import { decode, disassemble, hex, mnemonics, type Assembly, type Decoded } from './p8-asm.ts';
import { initialCpu, p8Machine, type CpuState } from './p8.ts';
import type { Machine } from './machine.ts';

export const pipelineIsa=mnemonics.filter(n=>!['PUSH','POP','CALL','RET'].includes(n));
export const pipeNames=['cycle','retired','stalls','flushed','halted','R0','R1','R2','R3'];
export const stages=['IF','ID','EX','MEM','WB'] as const;
export interface PipeBoot { image:Assembly; input:number[]; forwarding:boolean; branch:'stall'|'predict-not-taken' }
interface Row {
  id:number; pc:number; text:string; reads:string[]; writes:string[]; load:boolean; branch:boolean;
  after:CpuState;
}
export interface Mark { id:number; text:string; stage:typeof stages[number]; held:boolean; flushed:boolean }
export interface Arrow { from:number; to:number; cycle:number; stage:'EX'|'MEM'; operand:string }
export interface Tick {
  cycle:number; marks:Mark[]; bubble:boolean; arrows:Arrow[]; previous?:Tick;
}
export interface PipeState {
  boot:PipeBoot; cycle:number; stages:(Row|null)[]; cursor:CpuState|null; committed:CpuState;
  issued:number; retired:number; stalls:number; flushed:number; tick?:Tick; halted:boolean; error?:string;
}
function operands(i:Decoded) {
  const dest='R'+i.d, source='R'+i.b;
  const reads:string[]=[], writes:string[]=[];
  const alu=['ADD','SUB','AND','OR','XOR','SHL','SHR','CMP'].includes(i.name);
  if (alu || i.name==='OUT' || i.name==='ST') reads.push(dest);
  if ((i.form==='indirect' || i.form==='rr') && !reads.includes(source)) reads.push(source);
  if (i.name!=='JMP' && i.form==='jump') reads.push('标志');
  if ((alu && i.name!=='CMP') || ['LD','LDI','MOV','IN'].includes(i.name)) writes.push(dest);
  if (alu) writes.push('标志');
  return {reads,writes};
}
/** P8 给出该指令的顺序执行结果。预测路径只持有私有快照，到 WB 才提交。 */
function issue(before:CpuState,id:number):Row {
  const pc=before.pc, a=before.memory[pc], b=before.memory[(pc+1)&255], i=decode(a,b);
  const valid=typeof i!=='string';
  return {id,pc,text:disassemble(a,b),...(valid?operands(i):{reads:[],writes:[]}),
    branch:valid && i.form==='jump', load:valid && i.name==='LD', after:p8Machine.step(before).state};
}
function dependencies(id:Row|null,ex:Row|null,mem:Row|null) {
  return (id?.reads??[]).flatMap<{producer:Row;stage:'EX'|'MEM';operand:string}>(operand=>{
    // 同一寄存器可有两个在途写者，只能取较新的结果。
    if(ex?.writes.includes(operand)) return [{producer:ex,stage:'EX' as const,operand}];
    if(mem?.writes.includes(operand)) return [{producer:mem,stage:'MEM' as const,operand}];
    return [];
  });
}
const label=(row:Row)=>'#'+row.id+' '+row.text;
export const pipelineMachine:Machine<PipeBoot,PipeState>={
  init(boot) {
    const cpu=initialCpu({image:boot.image,input:boot.input,isa:pipelineIsa});
    return {boot,cursor:cpu,committed:cpu,stages:[null,null,null,null,null],issued:0,retired:0,cycle:0,stalls:0,flushed:0,halted:false};
  },
  step(s) {
    const cycle=s.cycle+1, [oldIF,oldID,oldEX,oldMEM]=s.stages, deps=dependencies(oldID,oldEX,oldMEM);
    const wait=deps.filter(d=>!s.boot.forwarding || (d.stage==='EX' && d.producer.load));
    const held=wait.length>0, ex=held?null:oldID, mem=oldEX, wb=oldMEM;
    let id=held?oldID:oldIF, fetch=held?oldIF:null, cursor=s.cursor, issued=s.issued;
    if(!held && cursor) {
      fetch=issue(cursor,++issued);
      cursor=fetch.after.halted || (fetch.branch && s.boot.branch==='stall') ? null : {...fetch.after,pc:(fetch.pc+2)&255};
    }
    const taken=!!ex?.after.frame?.effect?.branch;
    const redirect=ex?.branch && (taken || s.boot.branch==='stall');
    const squash=!!(ex?.branch && taken && s.boot.branch==='predict-not-taken');
    const slots=[fetch,id,ex,mem,wb];
    const marks:Mark[]=slots.flatMap((row,i)=>row?[{id:row.id,text:hex(row.pc)+' '+row.text,stage:stages[i],held:held && i<2,flushed:squash && i<2}]:[]);
    const arrows:Arrow[]=ex && s.boot.forwarding?deps.map(d=>({from:d.producer.id,to:ex.id,stage:d.stage,cycle:cycle-1,operand:d.operand})):[];
    if(redirect) cursor=ex.after;
    if(squash) { fetch=null; id=null; }
    const committed=wb?.after??s.committed;
    const halted=committed.halted;
    const error=committed.error??(!halted && cycle===1000?'1000 拍内没有停机':undefined);
    const changes=marks.map(m=>m.stage+' '+(m.held?'停留 ':'')+'#'+m.id);
    if(held) changes.push(label(oldID!)+' 等 '+wait.map(d=>d.operand+'（#'+d.producer.id+(s.boot.forwarding?' 取数尚未完成':' 尚未写回')+'）').join('、')+'，EX 留气泡');
    for(const a of arrows) changes.push('#'+a.from+' '+a.stage+' 转发 '+a.operand+' 到 #'+a.to+' EX');
    if(squash) changes.push('分支跳到 '+hex(ex!.after.pc)+'，冲掉 '+marks.filter(m=>m.flushed).map(m=>'#'+m.id).join('、'));
    else if(ex?.branch) changes.push('分支确定，下一地址 '+hex(ex.after.pc));
    if(error) changes.push(error);
    const touched=['cycle','CPI'];
    if(wb && !committed.error) {
      touched.push('retired',...wb.writes);
      if(wb.after.output.length!==s.committed.output.length) touched.push('output');
    }
    if(held) touched.push('stalls');
    if(squash && marks.some(m=>m.flushed)) touched.push('flushed');
    return {state:{...s,cycle,issued,cursor,committed,halted,error,stages:[fetch,id,ex,mem,wb],
      retired:committed.steps,stalls:s.stalls+Number(held),flushed:s.flushed+marks.filter(m=>m.flushed).length,
      tick:{cycle,marks,bubble:held,arrows,previous:s.tick}},
      events:[{text:changes.join('；'),kind:error?'error':'info',touched}],done:halted || !!error};
  },
  observe(s) {
    const [R0,R1,R2,R3]=s.committed.registers;
    return {cycle:s.cycle,retired:s.retired,stalls:s.stalls,flushed:s.flushed,halted:Number(s.halted),R0,R1,R2,R3};
  },
};

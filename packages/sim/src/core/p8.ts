import { emptyCache, visitCache, type CacheConfig, type CacheState, type Visit, type Access } from './cache.ts';
import { decode, disassemble, hex, type Assembly, type Decoded } from './p8-asm.ts';
import type { Machine, SimEvent, StepResult } from './machine.ts';

export const cpuNames = ['R0','R1','R2','R3','PC','SP','Z','N','C','V','cycles','steps','halted','outCount','lastOut','mem'];
export const cachedCpuNames = [...cpuNames,'hits','misses'];
interface ProgramBoot { image: Assembly; input: number[]; isa?: readonly string[] }
export interface Boot extends ProgramBoot { cache?:CacheConfig; fetch?:'data'|'through-cache' }
export interface CycleBar { step:number; address:number; cycles:number; miss:boolean }
type Flags = { Z: number; N: number; C: number; V: number };
const jumpFlags: Partial<Record<string, keyof Flags>> = {JZ:'Z', JNZ:'Z', JC:'C', JNC:'C', JN:'N', JV:'V'};
interface Transfer { address: number; value: number; write: boolean }
interface Effect {
  result?: number; dest?: number; flags?: Flags; sp?: number; pc?: number; branch?: boolean;
  memory?: Transfer; alu?: { left: number; right: number; operator: string; result: number };
  input?: boolean; output?: number; halt?: boolean;
}
interface Frame {
  address: number; first: number; second: number; instruction?: Decoded; effect?: Effect;
  visits?:Visit[]; startCycles?:number; startCache?:CacheState;
}
export interface CpuState {
  boot: Boot; registers: number[]; memory: number[]; flags: Flags; pc: number; sp: number;
  inputIndex: number; output: number[]; cycles: number; steps: number; lastCycles: number;
  halted: boolean; error?: string; phase: 0 | 1 | 2 | 3; frame?: Frame; returns: number[];
  cache?:CacheState; chart?:CycleBar[];
}
export const initialCpu = (boot: Boot): CpuState => ({
  ...(boot.cache && {cache:emptyCache(boot.cache),chart:[]}),
  boot, registers: [0,0,0,0], memory: boot.image.bytes, flags: {Z:0,N:0,C:0,V:0}, pc:0, sp:255,
  inputIndex:0, output:[], cycles:0, steps:0, lastCycles:0, halted:false, phase:0, returns:[],
});
const inc = (n: number) => (n + 1) & 255;
function plan(s: CpuState, i: Decoded): Effect | string {
  const {name, d, b} = i, left = s.registers[d], right = i.form === 'rr' ? s.registers[b] : b;
  const indirect = i.form === 'indirect' ? s.registers[b] : b;
  const read = (address: number): Transfer => ({address,value:s.memory[address],write:false});
  const write = (address: number,value: number): Transfer => ({address,value,write:true});
  const alu = (raw: number, operator: string, carry=false, overflow=false): Effect => {
    const result = raw & 255;
    return { result, dest:name === 'CMP' ? undefined : d, alu:{left,right:name === 'SHL' || name === 'SHR' ? 1 : right,operator,result},
      flags:{Z:Number(result === 0), N:result >> 7, C:Number(carry), V:Number(overflow)} };
  };
  switch (name) {
    case 'ADD': { const n=left+right; return alu(n,'+',n>255,!!(~(left^right)&(left^n)&128)); }
    case 'SUB': case 'CMP': { const n=left-right; return alu(n,'−',n<0,!!((left^right)&(left^n)&128)); }
    case 'AND': return alu(left & right,'AND');
    case 'OR': return alu(left | right,'OR');
    case 'XOR': return alu(left ^ right,'XOR');
    case 'SHL': return alu(left << 1,'<<',!!(left&128));
    case 'SHR': return alu(left >> 1,'>>',!!(left&1));
    case 'MOV': case 'LDI': return { dest:d, result:right };
    case 'LD': return { dest:d, result:s.memory[indirect], memory:read(indirect) };
    case 'ST': return { memory:write(indirect,left) };
    case 'PUSH': case 'CALL': return { memory:write(s.sp,name === 'CALL' ? s.pc : left), sp:(s.sp-1)&255, pc:name === 'CALL' ? b : undefined };
    case 'POP': case 'RET': {
      const sp=inc(s.sp), memory=read(sp);
      return name === 'RET' ? {sp,memory,pc:memory.value} : {sp,memory,dest:d,result:memory.value};
    }
    case 'IN': return s.inputIndex >= s.boot.input.length ? '输入已经读完' : {dest:d,result:s.boot.input[s.inputIndex],input:true};
    case 'OUT': return s.output.length >= 256 ? '输出超过 256 个' : {output:left};
    case 'HLT': return {halt:true};
    case 'NOP': return {};
    default: {
      const flag: Record<string,boolean> = { JMP:true,JZ:!!s.flags.Z,JNZ:!s.flags.Z,JC:!!s.flags.C,JNC:!s.flags.C,JN:!!s.flags.N,JV:!!s.flags.V };
      return { branch:flag[name], pc:flag[name] ? b : undefined };
    }
  }
}
function writeBack(s: CpuState, e: Effect, name: string): CpuState {
  const n: CpuState = { ...s, phase:0, steps:s.steps+1, lastCycles:1+(e.memory ? 10 : 0),
    flags:e.flags ?? s.flags, pc:e.pc ?? s.pc, sp:e.sp ?? s.sp, halted:!!e.halt };
  if (e.dest !== undefined) { n.registers=s.registers.slice(); n.registers[e.dest]=e.result!; }
  if (e.memory?.write) {
    if (!s.cache) n.cycles+=10;
    n.memory=s.memory.slice(); n.memory[e.memory.address]=e.memory.value;
    n.returns=s.returns.filter(a => a !== e.memory!.address);
    if (name === 'CALL') n.returns=[...n.returns,e.memory.address];
  }
  if (name === 'POP' || name === 'RET') n.returns=s.returns.filter(a => a !== e.sp);
  if (e.input) n.inputIndex++;
  if (e.output !== undefined) n.output=[...s.output,e.output];
  return n;
}
function invalid(s: CpuState, instruction: Decoded | string) {
  if (typeof instruction === 'string') return instruction;
  if (s.boot.isa && !s.boot.isa.includes(instruction.name)) return '这一处只开放 '+s.boot.isa.join('、');
}
function flagsText(f: Flags) { return 'Z = '+f.Z+' N = '+f.N+' C = '+f.C+' V = '+f.V; }
function written(e: Effect) {
  const parts: string[] = [];
  if (e.dest !== undefined) parts.push('R'+e.dest+' ← '+e.result);
  if (e.flags) parts.push(flagsText(e.flags));
  if (e.memory?.write) parts.push('M['+hex(e.memory.address)+'] ← '+e.memory.value);
  if (e.sp !== undefined) parts.push('SP ← '+hex(e.sp));
  if (e.pc !== undefined) parts.push('PC ← '+hex(e.pc));
  if (e.input) parts.push('取走输入 '+e.result);
  if (e.output !== undefined) parts.push('输出 '+e.output);
  if (e.halt) parts.push('停机');
  return parts.join('，') || '保持寄存器，继续顺序执行';
}
function executionText(e: Effect, name: string) {
  if (e.alu) return e.alu.left+' '+e.alu.operator+' '+e.alu.right+' = '+e.alu.result+'，'+flagsText(e.flags!);
  if (e.memory) return (e.memory.write?'准备写':'读')+' M['+hex(e.memory.address)+'] = '+e.memory.value;
  if (e.branch !== undefined) return e.branch ? '跳转成立，目标 '+hex(e.pc!) : '跳转条件不成立';
  if (e.dest !== undefined) return '要写入的值是 '+e.result+'，'+name+' 不改标志';
  return written(e);
}
function micro(s: CpuState): StepResult<CpuState> {
  const finish = (state: CpuState, text: string, kind: SimEvent['kind']='info', touched?: string[], writes?: string[]) => {
    const events: SimEvent[] = [{text,kind,touched}];
    if (writes?.length) events.push({kind:'write', touched:writes, text:''});
    return {state,events,done:state.halted};
  };
  const fail = (message: string) => finish({...s,halted:true,error:message},message,'error');
  if (s.halted) return finish(s,s.error ?? '已停机');
  if (s.phase === 0) {
    const address=s.pc, next=inc(address), pc=inc(next), first=s.memory[address], second=s.memory[next];
    return finish({...s,phase:1,pc,frame:{address,first,second}},'取指：读 M['+hex(address)+'] = '+hex(first)+'、M['+hex(next)+'] = '+hex(second)+'，PC 变成 '+hex(pc),'read',['M'+address,'M'+next,'PC'],['PC','IR']);
  }
  const f=s.frame!;
  if (s.phase === 1) {
    const i=decode(f.first,f.second), error=invalid(s,i);
    if (typeof i === 'string' || error) return fail('译码：'+hex(f.first)+' '+hex(f.second)+'，'+(error ?? i));
    const readsDest = ['ADD','SUB','AND','OR','XOR','CMP','SHL','SHR','ST','PUSH','OUT'].includes(i.name);
    const d=i.form==='none'||i.form==='jump'?'':'，d = '+i.d.toString(2).padStart(2,'0')+' 是 R'+i.d+(readsDest?' = '+s.registers[i.d]:'');
    const operand=i.form==='imm'?'，立即数 '+i.b:i.form==='rr'||i.form==='indirect'?'，R'+i.b+' = '+s.registers[i.b]:i.form==='direct'||i.form==='jump'?'，地址 '+hex(i.b):'';
    const stack = ['PUSH','POP','CALL','RET'].includes(i.name) ? '，SP = '+hex(s.sp) : '';
    const flag = jumpFlags[i.name];
    const condition = flag ? '，'+flag+' = '+s.flags[flag] : '';
    const reads = ['IR'];
    if (readsDest) reads.push('R'+i.d);
    if (i.form==='rr' || i.form==='indirect') reads.push('R'+i.b);
    if (stack) reads.push('SP');
    if (flag) reads.push(flag);
    if (i.name==='CALL') reads.push('PC');
    return finish({...s,phase:2,frame:{...f,instruction:i}},'译码：'+i.opcode.toString(2).padStart(6,'0')+' 是 '+i.name+d+operand+stack+condition,'read',reads);
  }
  const i=f.instruction!;
  if (s.phase === 2) {
    const e=plan(s,i);
    if (typeof e === 'string') return fail('执行：'+e);
    const read=e.memory && !e.memory.write ? e.memory : undefined;
    const reads = read ? ['M'+read.address] : e.input ? ['in:'+s.inputIndex] : [];
    return finish({...s,phase:3,cycles:s.cycles+1+(read && !s.cache?10:0),frame:{...f,effect:e}},
      '执行：'+executionText(e,i.name),reads.length?'read':'info',reads,['cycles']);
  }
  const e=f.effect!, n=writeBack(s,e,i.name);
  const collision=(i.name==='PUSH'||i.name==='CALL') && s.boot.image.owners[e.memory!.address];
  const writes = ['steps','lastCycles'];
  if (e.dest!==undefined) writes.push('R'+e.dest);
  if (e.flags) writes.push(...Object.keys(e.flags));
  if (e.sp!==undefined) writes.push('SP');
  if (e.pc!==undefined) writes.push('PC');
  if (e.memory?.write) writes.push('M'+e.memory.address,'cycles');
  if (e.input) writes.push('in:'+s.inputIndex);
  if (e.output!==undefined) writes.push('out:'+s.output.length);
  return finish(n,'写回：'+written(e)+(collision?'，栈进入了程序区':''),'write',writes);
}
/** 只在实际发生的微步收取访问费用，frame 保留本条指令的全部访问。 */
function timedMicro(s:CpuState):StepResult<CpuState> {
  const result=micro(s);
  if (!s.cache || s.halted) return result;
  if (result.state.error) {
    const frame=s.frame!;
    return {...result,state:{...result.state,cycles:frame.startCycles!,cache:frame.startCache!,frame:{...frame,visits:[]}},
      events:[...result.events,{kind:'write',touched:['cycles'],text:frame.visits?.length?'本条指令出错，撤销取指费用和缓存访问。':''}]};
  }
  const n=result.state, frame=n.frame!, start=s.phase===0?s.cycles:s.frame!.startCycles!;
  const accesses:Access[]=[];
  if (s.phase===0 && s.boot.fetch==='through-cache') {
    accesses.push({address:s.pc,write:false});
    const second=inc(s.pc), block=s.cache.config.blockSize;
    if (Math.floor(s.pc/block)!==Math.floor(second/block)) accesses.push({address:second,write:false});
  }
  const transfer=frame.effect?.memory;
  if (transfer && (s.phase===2 && !transfer.write || s.phase===3 && transfer.write)) accesses.push(transfer);
  let cache=s.cache, cycles=n.cycles;
  const visits=s.phase===0?[]:[...(s.frame?.visits??[])];
  for (const access of accesses) {
    const next=visitCache(cache,access), v=next.visit;
    cache=next.cache; cycles+=v.cost;
    result.events.push({kind:v.hit?'hit':'miss',touched:['cache:'+visits.length],text:cacheNote(v)});
    visits.push(v);
  }
  if (accesses.length) result.events.push({kind:'write',touched:['cycles'],text:''});
  const state={...n,frame:{...frame,startCycles:start,startCache:s.phase===0?s.cache:s.frame!.startCache,visits},cache,cycles};
  if (s.phase===3) {
    state.lastCycles=cycles-start;
    const bar={step:state.steps,address:frame.address,cycles:state.lastCycles,miss:visits.some(v=>!v.hit)};
    state.chart=[...(s.chart??[]).slice(-63),bar];
  }
  return {...result,state};
}
function cacheNote(v:Visit) {
  return hex(v.address)+(v.hit?' 命中':' 缺失')+(v.dirtyEviction?'并写回脏块':'')+'（+'+v.cost+'）';
}
export const p8Machine: Machine<Boot,CpuState> = {
  init:initialCpu,
  step(s,grain) {
    if (grain === '微步' || s.halted) return timedMicro(s);
    const events: SimEvent[]=[];
    let cost=0;
    do { const next=timedMicro(s); s=next.state; events.push(...next.events); cost++; } while(s.phase && !s.halted);
    if (!s.error) {
      const f=s.frame!, e=f.effect!;
      let summary=events.find(e=>e.text.startsWith('写回：'))!.text.slice(3);
      if (e.alu) summary=(e.dest!==undefined?'R'+e.dest+' = ':'比较 ')+executionText(e,f.instruction!.name);
      else if ((e.memory && !e.memory.write) || e.branch!==undefined) summary=executionText(e,f.instruction!.name)+'，'+summary;
      if (f.visits?.length) summary+=' · '+f.visits.map(cacheNote).join('、');
      return {state:s,done:s.halted,previewCost:cost,events:[{kind:'info',text:hex(f.address)+' '+disassemble(f.first,f.second)+'：'+summary},
        ...events.filter(e=>e.touched?.length).map(e=>({...e,text:''}))]};
    }
    return {state:s,done:true,events,previewCost:cost};
  },
  edit(s,action) {
    const {key,value,address}=action as {key:string;value:number;address?:number};
    if (s.phase || !Number.isInteger(value) || value < -128 || value > 255) throw new Error('只能在指令开头修改一个字节');
    const byte=value&255;
    if (/^R[0-3]$/.test(key)) { const registers=s.registers.slice(); registers[Number(key[1])]=byte; return {...s,registers}; }
    if (key==='PC') return {...s,pc:byte,halted:false,error:undefined};
    if (key==='SP') return {...s,sp:byte,returns:[]};
    if (key==='memory' && Number.isInteger(address) && address!>=0 && address!<256) {
      const memory=s.memory.slice(); memory[address!]=byte; return {...s,memory,returns:s.returns.filter(a=>a!==address)};
    }
    if (Object.hasOwn(s.flags,key) && (value===0||value===1)) return {...s,flags:{...s.flags,[key]:value}};
    throw new Error('无效的编辑位置或值');
  },
  observe(s) { const counts:Record<string,number>={}; if(s.cache) {counts.hits=s.cache.hits;counts.misses=s.cache.misses;} return {...counts,R0:s.registers[0],R1:s.registers[1],R2:s.registers[2],R3:s.registers[3],PC:s.pc,SP:s.sp,...s.flags,
    cycles:s.cycles,steps:s.steps,halted:Number(s.halted),outCount:s.output.length,lastOut:s.output.at(-1)??0}; },
  readMemory:(s,address)=>s.memory[address],
};

/** 判题不建历史、不生成界面事件，译码、执行和写回均和微步共用。 */
export function runCpu({image,input,isa}: ProgramBoot, limit: number) {
  let s=initialCpu({image,input,isa});
  while (!s.halted && s.cycles < limit) {
    const first=s.memory[s.pc], second=s.memory[inc(s.pc)], i=decode(first,second);
    s={...s,pc:(s.pc+2)&255};
    const error=invalid(s,i);
    if (typeof i==='string' || error) return {...s,halted:true,error:hex(first)+' '+hex(second)+'，'+(error ?? i)};
    const e=plan(s,i);
    if (typeof e==='string') return {...s,halted:true,error:e};
    const cost = 1 + (e.memory ? 10 : 0);
    if (s.cycles + cost > limit) return {...s, cycles:limit};
    s.cycles+=1+(e.memory && !e.memory.write ? 10 : 0);
    s=writeBack(s,e,i.name);
  }
  return s;
}

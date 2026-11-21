import type { Machine } from './machine.ts';
import { nextMulberry32 } from './rng.ts';

export const threadNames = ['step','switches','blocked','finished','deadlock','error','done'];
const signatures = {
  load:'rv', store:'vr', set:'ri', add:'rx', sub:'rx', jmp:'j', beq:'rij', bne:'rij',
  tas:'rv', lock:'m', unlock:'m', wait:'s', signal:'s',
} as const;
type Opcode = keyof typeof signatures;
export interface Instruction {op:Opcode; args:string[]; target:number; source:string; row:number}
export interface Program {name:string; code:Instruction[]}
interface Resources {shared:Record<string,number>; locks:string[]; semaphores:Record<string,number>}
export interface ThreadParams extends Resources {
  programs:Program[]; schedule:'rr'|'random'|string[]; quantum?:number; seed?:number;
}
export function assembleThread(source:string, resources:Resources) {
  const code:Instruction[] = [], labels = new Map<string,number>();
  const errors:{row:number;message:string}[]=[];
  source.normalize('NFKC').split('\n').forEach((line,row)=>{
    let src=line.split(';')[0].trim();
    const label=/^([A-Za-z_]\w*):/.exec(src);
    if(label){
      if(labels.has(label[1])) errors.push({row,message:'标号重复 '+label[1]});
      labels.set(label[1],code.length); src=src.slice(label[0].length).trim();
    }
    if(!src) return;
    const [,word,operands]=/^(\S+)(?:\s+(.*))?$/.exec(src)!;
    const op=word.toLowerCase() as Opcode;
    if(!Object.hasOwn(signatures,op)){errors.push({row,message:'未知指令 '+word});return;}
    const args=operands?.split(',').map(s=>s.trim())??[], sig=signatures[op];
    let valid=args.length===sig.length;
    for(let i=0;valid&&i<args.length;i++){
      const a=args[i], reg=/^r[0-3]$/.test(a), integer=/^[+-]?\d+$/.test(a);
      switch(sig[i]){
        case 'r': valid=reg;break;
        case 'i': valid=integer;break;
        case 'x': valid=integer||reg;break;
        case 'm': valid=resources.locks.includes(a);break;
        case 'v': valid=Object.hasOwn(resources.shared,a);break;
        case 's': valid=Object.hasOwn(resources.semaphores,a);break;
        case 'j': valid=/^[A-Za-z_]\w*$/.test(a);break;
      }
    }
    if(!valid) errors.push({row,message:op+' 的操作数不合法或资源未声明'});
    code.push({op,args,target:-1,source:line.split(';')[0].trim(),row});
    if(code.length===25) errors.push({row,message:'每个线程最多 24 条指令'});
  });
  for(const instruction of code){
    if(signatures[instruction.op].endsWith('j')){
      const label=instruction.args.at(-1)??'';
      if(!labels.has(label))errors.push({row:instruction.row,message:'未定义的标号 '+label});
      else instruction.target=labels.get(label)!;
    }
  }
  if(!code.length)errors.push({row:0,message:'程序至少一条指令'});
  return {code,errors};
}
interface Thread {pc:number; regs:bigint[]; wait:string|null}
interface Turn {name:string; pc:number}
export interface ThreadState {
  p:ThreadParams; ts:Thread[]; shared:Record<string,bigint>; sem:Record<string,number>;
  owners:Record<string,number>; queues:Record<string,number[]>; turns:Turn[];
  last:number; slice:number; cursor:number; seed:number; manual:number;
  switches:number; deadlock:boolean; error:boolean; done:boolean; text:string; reads:string[]; writes:string[];
}
export const canRun=(s:ThreadState,i:number)=>s.ts[i].wait===null && s.ts[i].pc<s.p.programs[i].code.length;
function execute(s:ThreadState):ThreadState {
  if(s.done)return s;
  const {p}=s, runnable=s.ts.flatMap((_,i)=>canRun(s,i)?[i]:[]);
  let {cursor,seed}=s, i=s.manual;
  if(i<0 && Array.isArray(p.schedule)){
    while(cursor<p.schedule.length && i<0){
      const name=p.schedule[cursor++];
      const id=p.programs.findIndex(t=>t.name===name);
      if(runnable.includes(id))i=id;
    }
  }
  if(i<0 && p.schedule==='random'){
    const draw=nextMulberry32(seed);seed=draw.state;i=runnable[Math.floor(draw.value*runnable.length)];
  }
  const quantum=p.schedule==='rr' ? p.quantum??1 : 1;
  const continued=i<0 && s.last>=0 && runnable.includes(s.last) && s.slice<quantum;
  if(i<0){
    if(continued)i=s.last;
    else for(let k=1;k<=s.ts.length;k++){
      const id=(s.last+k)%s.ts.length;
      if(runnable.includes(id)){i=id;break;}
    }
  }
  const ts=s.ts.map(t=>({...t,regs:[...t.regs]}));
  const next:ThreadState={...s,ts,shared:{...s.shared},sem:{...s.sem},owners:{...s.owners},queues:{...s.queues},
    reads:[],writes:[],manual:-1,seed,cursor,slice:continued?s.slice+1:1,last:i,
    switches:s.switches+Number(s.last>=0&&s.last!==i)};
  const t=ts[i], prog=p.programs[i], pc=t.pc, ins=prog.code[t.pc++];
  const [a,b]=ins.args, reg=(r:string)=>Number(r.slice(1));
  const rr=(r:string)=>{next.reads.push(i+':'+r);return t.regs[reg(r)];};
  const wr=(r:string,v:bigint)=>{next.writes.push(i+':'+r);t.regs[reg(r)]=v;};
  const block=(name:string)=>{
    t.pc=pc;
    t.wait=name;next.queues[name]=[...next.queues[name],i];next.writes.push(name,'state:'+i);
  };
  const wake=(name:string)=>{
    const [id,...rest]=next.queues[name];
    if(id!==undefined){
      ts[id].pc++;
      ts[id].wait=null;next.queues[name]=rest;next.writes.push('state:'+id);
    }
    next.writes.push(name);return id;
  };
  next.turns=[...s.turns,{name:prog.name,pc}];
  let why='';
  switch(ins.op){
    case 'load': next.reads.push(b);wr(a,next.shared[b]);why='把 '+b+' 的值 '+next.shared[b]+' 读入 '+a;break;
    case 'store': next.writes.push(a);next.shared[a]=rr(b);why='把 '+b+' 的值 '+next.shared[a]+' 写回 '+a;break;
    case 'set': wr(a,BigInt(b));why=a+' 置为 '+b;break;
    case 'add': case 'sub': {
      const operand=b.startsWith('r')?rr(b):BigInt(b);
      wr(a,rr(a)+(ins.op==='add'?operand:-operand));why=a+' 变为 '+t.regs[reg(a)];break;
    }
    case 'jmp': t.pc=ins.target;why='跳到 '+a;break;
    case 'beq': case 'bne':
      if((rr(a)===BigInt(b))===(ins.op==='beq')){t.pc=ins.target;why='条件成立，跳到 '+ins.args[2];}
      else why='条件不成立，顺序执行';break;
    case 'tas': wr(a,next.shared[b]);next.shared[b]=1n;next.reads.push(b);next.writes.push(b);why='读到旧值 '+t.regs[reg(a)]+'，同时把 '+b+' 置 1';break;
    case 'lock':
      next.reads.push(a);
      if(next.owners[a]!==-1){why='锁由 '+p.programs[next.owners[a]].name+' 持有，进入等待队列';block(a);}
      else{next.owners[a]=i;next.writes.push(a);why='取得锁';}break;
    case 'unlock':
      if(next.owners[a]!==i){next.error=true;why='解锁失败，当前线程没有持有这把锁';}
      else{const id=wake(a);next.owners[a]=id??-1;why=id===undefined?'释放锁':'锁直接交给 '+p.programs[id].name;}break;
    case 'wait':
      next.reads.push(a);
      if(next.sem[a]>0){next.sem[a]--;next.writes.push(a);why='取走一个许可';}
      else{block(a);why='没有许可，进入等待队列';}break;
    case 'signal': {
      const id=wake(a);if(id===undefined)next.sem[a]++;
      why=id===undefined?'增加一个许可':'许可直接交给 '+p.programs[id].name;break;
    }
  }
  const blocked=ts.filter(t=>t.wait!==null);
  next.done=next.error||next.turns.length>=1000||!ts.some((_,j)=>canRun(next,j));
  next.deadlock=!next.error && blocked.length>0 && !ts.some((_,j)=>canRun(next,j));
  if(next.deadlock)why+='。死锁：'+ts.flatMap((t,j)=>{
    if(t.wait===null)return [];
    const owner=next.owners[t.wait];
    return [p.programs[j].name+' 等 '+t.wait+(owner>=0?'（'+p.programs[owner].name+' 持有）':'（等待许可）')];
  }).join('，');
  else if(next.turns.length>=1000)why+='。已到 1000 步上限';
  next.text=prog.name+' 执行 '+ins.source+(why?'，'+why:'');
  return next;
}
export const threadMachine:Machine<ThreadParams,ThreadState>={
  init(p){return {p,ts:p.programs.map(()=>({pc:0,regs:[0n,0n,0n,0n],wait:null})),
    shared:Object.fromEntries(Object.entries(p.shared).map(([k,v])=>[k,BigInt(v)])),sem:{...p.semaphores},
    owners:Object.fromEntries(p.locks.map(m=>[m,-1])),queues:Object.fromEntries([...p.locks,...Object.keys(p.semaphores)].map(k=>[k,[]])),
    turns:[],last:-1,slice:0,cursor:0,seed:p.seed??0,manual:-1,switches:0,deadlock:false,error:false,done:false,text:'',reads:[],writes:[]};},
  step(s){const state=execute(s);return {state,done:state.done,events:[{kind:state.error?'error':'info',text:state.text}]};},
  atEnd:s=>s.done,
  edit(s,action){if(typeof action!=='number'||!s.ts[action]||!canRun(s,action)||s.done)return s;return {...s,manual:action};},
  observe:s=>({step:s.turns.length,switches:s.switches,blocked:s.ts.filter(t=>t.wait!==null).length,
    finished:s.ts.filter((t,i)=>t.wait===null&&t.pc>=s.p.programs[i].code.length).length,
    deadlock:s.deadlock,error:s.error,done:s.done,...Object.fromEntries(Object.entries(s.shared).map(([k,v])=>[k,Number(v)])),...s.sem}),
};

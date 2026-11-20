import type { Op } from './heap.ts';
export const structures=['dynamic-array','stack','queue','linked-list','hash-open','hash-chain'] as const;
export type Structure=typeof structures[number];
const commands:Record<string,readonly string[]>={
  'dynamic-array':['push','pop','get','set','insert','remove'],stack:['push','pop','peek'],queue:['enqueue','dequeue','peek'],
  'linked-list':['push-front','push-back','find','delete'],'hash-open':['insert','find','delete'],'hash-chain':['insert','find','delete'],
};
export class OpError extends Error { constructor(readonly line:number,message:string){super(message);} }
export function parseOps(source:string,kind:string):Op[] {
  const ops:Op[]=[];
  for(const [i,line] of source.normalize('NFKC').split(/\r?\n/).entries()) {
    const raw=line.trim();if(!raw)continue;
    const [name,...tokens]=raw.toLowerCase().split(/\s+/);
    const fail=(message:string):never=>{throw new OpError(i+1,message);};
    if(!commands[kind]?.includes(name))fail(kind+' 没有操作 '+name);
    const tail=tokens.join(' '), parts=tail?tail.split(/\s*,\s*|\s+/):[];
    const args=parts.map(s=>{
      if(!/^(?:0x[0-9a-f]+|0b[01]+|\d+)$/.test(s) || Number(s)>255)fail('操作数必须是 0–255 的整数字节');
      if(kind==='hash-open' && (Number(s)===0||Number(s)===255))fail('开放寻址的键范围为 1–254');
      return Number(s);
    });
    const arity=['pop','peek','dequeue','build','extract'].includes(name)?0:name==='set'||(name==='insert' && kind==='dynamic-array')?2:1;
    const repeat=['push','enqueue','push-front','push-back','insert'].includes(name);
    if(arity===0?args.length!==0:args.length<arity || args.length%arity!==0 || (!repeat && args.length!==arity))fail(name+' 每个操作需要 '+arity+' 个数');
    if(!arity)ops.push({name,args:[]});
    else for(let j=0;j<args.length;j+=arity)ops.push({name,args:args.slice(j,j+arity)});
    if(ops.length>256)fail('最多 256 个操作');
  }
  return ops;
}

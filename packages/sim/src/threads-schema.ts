import { z } from 'zod';
import { assembleThread, threadNames } from './core/threads.ts';

const name=z.string().regex(/^[A-Za-z][A-Za-z0-9_]{0,11}$/);
export const threadsSchema=z.strictObject({
  shared:z.record(name,z.int().min(-99).max(99)),locks:z.array(name).max(4).default([]),
  semaphores:z.record(name,z.int().min(0).max(9)).default({}),
  threads:z.record(z.string().regex(/^[A-Za-z0-9]{1,4}$/),z.string()),
  schedule:z.union([z.enum(['rr','random']),z.array(z.string()).min(1).max(100)]),
  quantum:z.int().min(1).max(10).optional(),seed:z.int().optional(),editable:z.boolean().default(true),
}).transform((p,ctx)=>{
  const fail=(path:(string|number)[],message:string,row?:number)=>ctx.addIssue({code:'custom',path,message,params:{row}});
  if(Object.keys(p.shared).length>6)fail(['shared'],'共享变量最多 6 个');
  if(Object.keys(p.semaphores).length>4)fail(['semaphores'],'信号量最多 4 个');
  const taken=new Set([...threadNames,'r0','r1','r2','r3']);
  for(const [field,names] of [['shared',Object.keys(p.shared)],['locks',p.locks],['semaphores',Object.keys(p.semaphores)]] as const)
    names.forEach((n,i)=>{if(taken.has(n))fail([field,field==='locks'?i:n],'名字重复或与寄存器、观测量重名');taken.add(n);});
  const programs=Object.entries(p.threads).map(([name,source])=>{
    const {code,errors}=assembleThread(source,p);
    errors.forEach(e=>fail(['threads',name],e.message,e.row));
    return {name,code};
  });
  if(programs.length<1||programs.length>3)fail(['threads'],'需要 1–3 个线程');
  if(Array.isArray(p.schedule))p.schedule.forEach((name,i)=>{if(!Object.hasOwn(p.threads,name))fail(['schedule',i],'没有这个线程');});
  if(p.quantum!==undefined&&p.schedule!=='rr')fail(['quantum'],'只有 rr 使用时间片');
  if((p.seed!==undefined)!==(p.schedule==='random'))fail([p.seed===undefined?'schedule':'seed'],'随机调度需要 seed，其他方式不能写');
  return {...p,programs};
});

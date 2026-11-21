import { expect, it } from 'vitest';
import { assembleThread, threadMachine as m, type ThreadParams } from './threads';
import { mulberry32 } from './rng';

const inc='load r0, counter\nadd r0, 1\nstore counter, r0', locked='lock m\n'+inc+'\nunlock m';
const loop=(body:string)=>'set r1, 3\nL: '+body+'\nsub r1, 1\nbne r1, 0, L';
function params(a:string,b:string|undefined,schedule:ThreadParams['schedule']='rr',quantum=1,seed=7):ThreadParams {
  const res={shared:{counter:0,items:0,flag:0},semaphores:{empty:2,full:0},locks:['m','m1','m2']};
  return {...res,schedule,seed,quantum,programs:(b===undefined?[a]:[a,b]).map((source,i)=>{
    const {code,errors}=assembleThread(source,res);expect(errors).toEqual([]);return {name:i?'B':'A',code};
  })};
}
function run(p:ThreadParams){
  let s=m.init(p,0);
  while(!s.done&&s.turns.length<=1000)s=m.step(s).state;
  return s;
}
it('丢失更新、阻塞移交及反序加锁',()=>{
  const s=run(params(inc,inc,['A','B','A','B','A','B']));
  expect([s.turns.map(t=>t.name).join(''),s.shared.counter,s.switches]).toEqual(['ABABAB',1n,5]);
  expect(run(params(inc,inc,'rr',3)).shared.counter).toBe(2n);
  expect(run(params(inc,inc)).shared.counter).toBe(1n);
  const l=run(params(locked,locked));
  expect([l.turns.map(t=>t.name).join(''),l.shared.counter,l.switches]).toEqual(['ABAAAABBBB',2n,3]);
  const a='lock m1\nlock m2\nunlock m2\nunlock m1',b='lock m2\nlock m1\nunlock m1\nunlock m2';
  const dead=run(params(a,b));
  expect(dead.turns.map(t=>t.name)).toEqual(['A','B','A','B']);
  expect([dead.deadlock,dead.ts.map(t=>t.wait)]).toEqual([true,['m2','m1']]);
  expect(run(params(a,b,'rr',2)).turns.length).toBe(8);
  expect(run(params('lock m\nlock m',undefined))).toMatchObject({deadlock:true,turns:[{},{}]});
  expect(run(params('unlock m',undefined))).toMatchObject({error:true,turns:[{}]});
});
it('带标号循环、种子和自旋锁',()=>{
  const a=loop(inc);
  for(const [mode,q,seed,counter,switches] of [['rr',1,7,3,31],['rr',5,7,6,null],['random',1,7,4,13],['random',1,10,6,null]] as const){
    const s=run(params(a,a,mode,q,seed));
    expect(s.shared.counter).toBe(BigInt(counter));expect(s.turns).toHaveLength(32);
    if(switches!==null)expect(s.switches).toBe(switches);
  }
  const spin='L: tas r0, flag\nbne r0, 0, L\n'+inc+'\nset r2, 0\nstore flag, r2';
  const s=run(params(spin,spin));
  expect([s.turns.length,s.shared.counter,s.shared.flag]).toEqual([20,2n,0n]);
  const prod=loop('wait empty\nlock m\nload r0, items\nadd r0, 1\nstore items, r0\nunlock m\nsignal full');
  const cons=prod.replace('wait empty','wait full').replace('add r0','sub r0').replace('signal full','signal empty');
  const f=run(params(prod,cons,'rr',2));
  expect([f.turns.length,f.shared.items,f.sem.empty,f.sem.full,f.switches]).toEqual([56,0n,2,0,25]);
});
it('独立原子计数模型核对任意交错，手选不耗 seed 或列表',()=>{
  const random=mulberry32(241);
  for(let sample=0;sample<80;sample++){
    const list=Array.from({length:80},()=>random()<.5?'A':'B');
    const counts=[1+Math.floor(random()*8),1+Math.floor(random()*8)];
    const programs=counts.map(n=>loop(locked).replace('set r1, 3','set r1, '+n));
    const s=run(params(programs[0],programs[1],list));
    // 在相同交错的每个 store 上独立提交一次原子加法，检查整个可见写入序列。
    const p=params(programs[0],programs[1],list);let state=m.init(p,0),expected=0n;
    for(const turn of s.turns){
      const id=turn.name==='A'?0:1;
      if(p.programs[id].code[turn.pc].op==='store')expected++;
      state=m.step(state).state;
      expect(state.shared.counter).toBe(expected);
    }
    expect(expected).toBe(BigInt(counts[0]+counts[1]));expect(s.deadlock).toBe(false);
  }
  for(const mode of ['random',['A','B']] as const){
    const p=params(inc,inc,mode==='random'?mode:[...mode]);
    const s=m.init(p,0), edited=m.step(m.edit!(s,1)).state;
    expect([edited.turns[0].name,edited.seed,edited.cursor,s.turns.length]).toEqual(['B',s.seed,0,0]);
  }
  expect(run(params('L: jmp L',undefined)).turns).toHaveLength(1000);
});

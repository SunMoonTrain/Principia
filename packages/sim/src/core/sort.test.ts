import { expect,it } from 'vitest';
import { presetData,sortFrames,sortMachine,sorts,type Sort } from './sort';
import { mulberry32 } from './rng';
const sorted=[1,2,3,4,5,6,7,8],reverse=[...sorted].reverse();
function result(a:number[],algo:Sort,pivot='last',seed=0){
  const all=[...sortFrames(a,algo,pivot,seed)],f=all.at(-1)!;
  return {f,counts:[f.compares,f.swaps,f.moves,f.writes,all.length-1]};
}
it('反序和有序八元素的计数与步数',()=>{
  const expected=[[28,28,0,56,56],[28,0,28,35,63],[28,4,0,8,32],[12,0,0,24,31],[28,4,0,8,32],[24,16,0,32,40]];
  sorts.forEach((algo,i)=>expect(result(reverse,algo).counts).toEqual(expected[i]));
  for(const [algo,c,s] of [['bubble',7,0],['insertion',7,0],['selection',28,0],['quick',28,0],['heap',27,22]] as const)
    expect(result(sorted,algo).counts.slice(0,3)).toEqual([c,s,0]);
  expect(result(sorted,'quick','random',4).counts.slice(0,2)).toEqual([20,8]);
});
it('预设、比赛冻结与相等元素的原下标',()=>{
  const a=presetData({kind:'random',n:16,seed:7});
  expect(a).toEqual([9,8,12,4,15,2,6,13,3,11,5,7,10,14,16,1]);
  expect(presetData({kind:'random',n:10,seed:5})).toEqual([6,4,8,9,3,1,5,2,10,7]);
  const few=presetData({kind:'few-unique',n:12,seed:3});expect(few).toEqual([3,1,2,1,4,2,2,1,2,3,1,1]);
  expect(result(few,'selection').f.a.filter(v=>v.v===2).map(v=>v.id)).toEqual([5,6,2,8]);
  let runs=sortMachine.init({algorithm:'merge',race:['insertion'],data:a},0);
  while(!sortMachine.atEnd!(runs))runs=sortMachine.step(runs).state;
  expect(runs.map(r=>[r.step,r.frame.compares,r.frame.moves,r.frame.writes])).toEqual([[79,47,0,64],[137,68,57,69]]);
  expect(sortMachine.observe(runs).step).toBe(79);
});
it.each([3,17,73])('逐算法对照内置稳定排序，种子 %i',seed=>{
  const r=mulberry32(seed);
  for(let i=0;i<36;i++){
    const a=Array.from({length:2+Math.floor(r()*31)},()=>1+Math.floor(r()*9)),expected=a.map((v,id)=>({v,id})).sort((x,y)=>x.v-y.v);
    for(const k of sorts){const actual=result(a,k).f.a;
      expect(actual.map(x=>x.v)).toEqual(expected.map(x=>x.v));
      if(['insertion','bubble','merge'].includes(k))expect(actual).toEqual(expected);
    }
  }
});

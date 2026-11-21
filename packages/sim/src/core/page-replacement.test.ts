import { expect,it } from 'vitest';
import { faultCurve,replacePages,replacements } from './page-replacement';
import { mulberry32 } from './rng';

const textbook=[7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1],belady=[1,2,3,4,1,2,5,1,2,3,4,5];
it('经典串逐列时钟、三四帧的四种算法',()=>{
  for(const [i,algorithm] of replacements.entries()){
    const curve=faultCurve(textbook,algorithm);
    expect(curve.slice(2,4)).toEqual([[15,10],[12,8],[9,8],[14,9]][i]);
  }
  const f=[...replacePages(textbook,{algorithm:'clock',frames:3})].at(-1)!;
  expect(f.columns.filter(c=>!c.hit).map(c=>c.slots.map(x=>x??'-').join(''))).toEqual('7-- 70- 701 201 203 403 423 420 320 310 312 012 072 071'.split(' '));
  expect(f).toMatchObject({faults:14,hits:6,evictions:11});
});
it('贝拉迪异常的完整曲线',()=>{
  const curves=[[12,12,9,10,5,5],[12,12,10,8,5,5],[12,9,7,6,5,5],[12,12,9,10,5,5]];
  replacements.forEach((a,i)=>expect(faultCurve(belady,a).slice(0,6)).toEqual(curves[i]));
});
// 枚举下一次缺页的所有受害页，按驻留集合记忆化，不使用模拟器的选帧函数。
function minimum(refs:number[],frames:number) {
  const memo=new Map<string,number>();
  function best(i:number,resident:number[]):number {
    if(i===refs.length)return 0;
    const key=i+'/'+[...resident].sort().join(',');
    const seen=memo.get(key);if(seen!==undefined)return seen;
    const page=refs[i];
    const n=resident.includes(page)?best(i+1,resident):resident.length<frames?1+best(i+1,[...resident,page]):
      1+Math.min(...resident.map((_,k)=>best(i+1,resident.map((v,j)=>k===j?page:v))));
    memo.set(key,n);return n;
  }
  return best(0,[]);
}
it('穷举最优缺页并用独立的最近使用栈核对 LRU',()=>{
  const rand=mulberry32(91);
  for(let trial=0;trial<65;trial++){
    const refs=Array.from({length:12},()=>Math.floor(rand()*6));let prev=Infinity;
    for(let frames=1;frames<=5;frames++){
      const optimum=minimum(refs,frames),stack:number[]=[];let misses=0;
      for(const p of refs){
        const at=stack.indexOf(p);if(at<0||at>=frames)misses++;
        if(at>=0)stack.splice(at,1);stack.unshift(p);
      }
      for(const algorithm of replacements){
        const f=[...replacePages(refs,{algorithm,frames})].at(-1)!;
        expect(f.faults).toBeGreaterThanOrEqual(optimum);
        if(algorithm==='opt')expect(f.faults).toBe(optimum);
        if(algorithm==='lru')expect(f.faults).toBe(misses);
      }
      expect(misses).toBeLessThanOrEqual(prev);prev=misses;
    }
  }
});

import {expect,it} from 'vitest';
import {dpFrames,type DpParams} from './dp-table';
import {mulberry32} from './rng';
it('LCS、编辑距离、背包的填表时机与回溯',()=>{
  const cases:[DpParams,number,number,number,string[]][]=[
    [{problem:'lcs',a:'ABCBDAB',b:'BDCABA'},42,8,4,['B','C','B','A']],
    [{problem:'edit-distance',a:'kitten',b:'sitting'},42,7,3,['k 换成 s','i 不变','t 不变','t 不变','e 换成 i','n 不变','插入 g']],
    [{problem:'knapsack',capacity:7,items:[[1,1],[3,4],[4,5],[5,7]]},32,4,9,['2','3']],
  ];
  for(const [p,filled,traced,result,answer] of cases){
    const frames=[...dpFrames(p)];expect(frames).toHaveLength(filled+traced+1);
    expect(frames.slice(0,filled).every(f=>f.result===-1)).toBe(true);
    expect(frames[filled]).toMatchObject({filled,traced:0,result});expect(frames.at(-1)).toMatchObject({filled,traced,result,answer});
  }
});
it('编辑距离在第 0 行或列继续回溯；背包平手不取后来的物品',()=>{
  expect([...dpFrames({problem:'edit-distance',a:'a',b:'bba'})].at(-1)?.answer).toEqual(['插入 b','插入 b','a 不变']);
  expect([...dpFrames({problem:'edit-distance',a:'bba',b:'a'})].at(-1)?.answer).toEqual(['删除 b','删除 b','a 不变']);
  expect([...dpFrames({problem:'knapsack',capacity:1,items:[[1,2],[1,2]]})].at(-1)?.answer).toEqual(['1']);
});
it.each([3,77,177])('逐格对照独立递推，种子 %i',seed=>{
  const r=mulberry32(seed),rand=(n:number)=>Math.floor(r()*n),word=()=>Array.from({length:1+rand(7)},()=>'ABCD'[rand(4)]).join('');
  for(let trial=0;trial<28;trial++){
    const a=word(),b=word(),items=Array.from({length:1+rand(7)},():[number,number]=>[1+rand(6),1+rand(12)]);
    for(const p of [{problem:'lcs',a,b},{problem:'edit-distance',a,b},{problem:'knapsack',capacity:1+rand(10),items}] as DpParams[]){
      const memo=new Map<string,number>();
      function ref(i:number,j:number):number{
        const key=i+','+j;if(memo.has(key))return memo.get(key)!;
        let v=0;
        if(!i||!j)v=p.problem==='edit-distance'?i+j:0;
        else if(p.problem==='knapsack'){
          const [weight,value]=p.items[i-1];v=Math.max(ref(i-1,j),j>=weight?ref(i-1,j-weight)+value:0);
        }else if(p.problem==='lcs')v=p.a[i-1]===p.b[j-1]?ref(i-1,j-1)+1:Math.max(ref(i-1,j),ref(i,j-1));
        else v=Math.min(ref(i-1,j-1)+Number(p.a[i-1]!==p.b[j-1]),1+ref(i-1,j),1+ref(i,j-1));
        memo.set(key,v);return v;
      }
      const frames=[...dpFrames(p)],last=frames.at(-1)!;
      expect([...last.table]).toEqual(Array.from(last.table,(_,k)=>ref(Math.floor(k/last.width),k%last.width)));
      for(let step=1;step<=last.filled;step++){const f=frames[step];expect([f.filled,f.table[f.at]]).toEqual([step,ref(Math.floor(f.at/f.width),f.at%f.width)]);}
    }
  }
});

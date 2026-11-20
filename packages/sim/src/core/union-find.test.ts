import { expect,it } from 'vitest';
import { unionMachine as m, type UnionConfig } from './union-find';
import { parseOps } from './operations';
import { mulberry32 } from './rng';
function run(script:string,settings:Partial<UnionConfig>={}){
  let s=m.init({kind:'union-find',n:8,union:'rank',compress:true,region:[16,255],commands:parseOps(script,'union-find'),...settings},0);
  const ends=[s],steps:number[]=[],writes:number[]=[];
  while(!m.atEnd!(s)){
    s=m.step(s).state;if(s.note.text.includes('直接接到根'))writes.push(s.note.writes[0]-16);
    if(!s.tape){steps.push(s.step-ends.at(-1)!.step);ends.push(s);}
  }
  return {s,ends,steps,writes};
}
const arr=(s:ReturnType<typeof run>['s'],at:number)=>[...s.pic.bytes.slice(at,at+8)];
const chain='union 0 1 1 2 2 3 3 4 4 5 5 6 6 7\nfind 0\nfind 0';
it('按秩平手方向、压缩顺序与 51 个微步',()=>{
  const {s,steps,ends,writes}=run('union 0 1 2 3 1 3\nfind 0\nunion 4 5 6 7 5 7 0 4\nfind 6\nconnected 2 5');
  expect(steps).toEqual([5,5,5,4,5,5,5,9,2,6]);expect(s.step).toBe(51);
  expect([...s.pic.bytes.slice(0,4)]).toEqual([16,24,8,1]);expect(arr(s,16)).toEqual([3,3,7,7,7,7,7,7]);
  expect(arr(s,24)).toEqual([0,1,0,2,0,1,0,3]);expect(writes).toEqual([0,4,2]);
  expect([ends[3].pic.bytes[17],ends[3].pic.bytes[27]]).toEqual([3,2]);
  expect((ends[4].pic.reads??0)-(ends[3].pic.reads??0)).toBe(3);
  expect((ends[8].pic.reads??0)-(ends[7].pic.reads??0)).toBe(5);
  expect(m.observe(s)).toMatchObject({height:3,sets:1,reads:27,compressions:3});expect(s.note.text).toContain('同一个集合');
});
it('长链、给定 parent、按大小合并',()=>{
  const a=run(chain,{union:'simple'});expect(a.steps).toEqual([...Array(7).fill(3),14,2]);expect(a.writes).toEqual([5,4,3,2,1,0]);
  expect(m.observe(a.ends[7]).height).toBe(8);expect(m.observe(a.ends[8]).height).toBe(2);
  const b=run(chain,{union:'simple',compress:false});expect(b.steps.slice(-2)).toEqual([8,8]);expect(m.observe(b.s).height).toBe(8);
  const parent=[1,2,3,4,5,6,7,7],c=run('find 0',{parent});
  expect(c.steps).toEqual([14]);expect(arr(c.ends[0],24)).toEqual([0,1,2,3,4,5,6,7]);expect(m.observe(c.ends[0])).toMatchObject({sets:1,height:8});
  expect(arr(run('',{parent,union:'size'}).s,24)).toEqual([1,2,3,4,5,6,7,8]);
  const d=run('union 0 1 2 1 3 4 1 4 5 4',{union:'size'});
  expect(d.steps).toEqual([5,5,5,5,6]);expect(arr(d.s,16)).toEqual([1,1,1,4,1,1,6,7]);expect(arr(d.s,24)).toEqual([1,6,1,1,2,1,1,1]);expect(m.observe(d.s).sets).toBe(3);
});
it.each([1,23,91])('独立连通分区为参照，种子 %i',seed=>{
  for(const union of ['rank','simple','size'] as const)for(const compress of [true,false]){
    const random=mulberry32(seed),group=Array.from({length:16},(_,i)=>i);
    let s=run('',{n:16,union,compress}).s;
    for(let i=0;i<400;i++){
      const a=Math.floor(random()*16),b=Math.floor(random()*16),name=random()<0.35?'union':'connected';
      const x=group[a],y=group[b];
      s=m.step({...s,commands:[{name,args:[a,b]}],ops:0},'一个操作').state;
      if(name==='union')for(let j=0;j<16;j++){if(group[j]===x)group[j]=y;}
      else expect(s.note.text.includes('同一个集合')).toBe(x===y);
      expect(m.observe(s).sets).toBe(new Set(group).size);
      if(union==='rank'&&!compress)for(let j=0;j<16;j++){
        if(s.pic.bytes[16+j]===j)expect(group.filter(g=>g===group[j]).length).toBeGreaterThanOrEqual(2**s.pic.bytes[32+j]);
      }
    }
  }
});

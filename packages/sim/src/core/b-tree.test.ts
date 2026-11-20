import { expect,it } from 'vitest';
import { bMachine as m } from './b-tree';
import { parseOps } from './operations';
import { mulberry32 } from './rng';
import { blank, type Picture } from './heap';

const seq=(n:number)=>Array.from({length:n},(_,i)=>i+1);
function start(script:string,keys:number[]=[],degree:2|3=2,end=255){
  return m.init({kind:'b-tree',region:[16,end],degree,keys,commands:parseOps(script,'b-tree')},0);
}
type State=ReturnType<typeof start>;
function one(s:State){
  const old=s, cases:string[]=[];
  do {
    s=m.step(s).state;
    const reason=s.note.reason??'';
    const code=/情形 (1|2[abc]|3[ab])/.exec(reason)?.[1];
    if(code)cases.push(code);else if(reason.includes('树降一层'))cases.push('降');
  }while(s.tape);
  return {s,cases,steps:s.step-old.step};
}
// 从原始字节独立解码，同时检查块、键界限、叶深与真实键集合。
function inspect(s:State){
  const {bytes:b,blocks}=s.pic,d=s.params.degree;
  const seen=new Set<number>(),depths=new Set<number>(),values:number[]=[];
  function walk(at:number,depth:number,lo:number,hi:number):string{
    expect(seen.has(at)).toBe(false);seen.add(at);
    expect(blocks.some(x=>x.at===at&&x.length===4*d+1)).toBe(true);
    const count=b[at],leaf=b[at+1];
    expect(count).toBeLessThanOrEqual(2*d-1);expect(count).toBeGreaterThanOrEqual(depth===0?(leaf?0:1):d-1);
    const keys=[...b.slice(at+2,at+2+count)],limits=[lo,...keys,hi];
    expect(limits.every((k,i)=>!i||k>limits[i-1])).toBe(true);values.push(...keys);
    let shape='['+keys.join(' ')+']';
    if(leaf){expect(leaf).toBe(1);depths.add(depth);}
    else shape+='('+limits.slice(1).map((upper,i)=>walk(b[at+2*d+1+i],depth+1,limits[i],upper)).join(' ')+')';
    return shape;
  }
  const shape=walk(b[0],0,-1,256);
  expect(seen.size).toBe(blocks.length);expect(depths.size).toBe(1);
  return {shape,keys:values.sort((a,b)=>a-b)};
}
it('插入的拍数、地址、线性比较和两种最小度数的形状',()=>{
  let s=start('insert '+seq(10).join(' ')+'\nfind 7\nfind 11');
  const steps:number[]=[],splits:number[]=[];
  for(let i=1;i<=10;i++){
    const x=one(s);if(x.s.pic.splits!==s.pic.splits)splits.push(i);steps.push(x.steps);s=x.s;
  }
  expect(steps).toEqual([2,2,2,5,3,5,3,5,6,6]);expect(splits).toEqual([4,6,8,9,10]);
  expect(m.observe(s)).toMatchObject({step:39,height:3,nodes:8,reads:17,compares:32,splits:5});
  expect(inspect(s).shape).toBe('[4]([2]([1] [3]) [6 8]([5] [7] [9 10]))');
  expect(s.pic.bytes[0]).toBe(61);
  expect(s.pic.blocks.map(({at})=>[at,...s.pic.bytes.slice(at+2,at+2+s.pic.bytes[at])]))
    .toEqual([[16,1],[25,2],[34,3],[43,5],[52,7],[61,4],[70,6,8],[79,9,10]]);
  expect(start('',seq(10)).pic.bytes).toEqual(s.pic.bytes);
  s=one(s).s;expect(m.observe(s)).toMatchObject({reads:20,compares:36});expect(s.note.text).toContain('找到键 7');
  s=one(s).s;expect(m.observe(s)).toMatchObject({reads:23,compares:41});expect(s.note.text).toContain('找不到 11');
  s=start('insert '+seq(20).join(' '),[],3);while(!m.atEnd!(s))s=one(s).s;
  expect(s.pic.splits).toBe(6);expect(inspect(s).shape).toBe('[9]([3 6]([1 2] [4 5] [7 8]) [12 15]([10 11] [13 14] [16 17 18 19 20]))');
});
it('五次删除的情形、根降层、最终地址和计数',()=>{
  let s=start('delete 1\ndelete 8\ndelete 4\ndelete 3\ndelete 7',seq(10));
  const cases=[],steps=[];
  for(let i=0;i<5;i++){
    const x=one(s);s=x.s;cases.push(x.cases);steps.push(x.steps);
    if(i===0)expect(s.pic.bytes[s.pic.bytes[0]+2]).toBe(6);
    if(i===1)expect(s.pic.bytes[0]).toBe(25);
  }
  expect(steps).toEqual([9,10,4,6,5]);expect(cases).toEqual([['3a','3b','1'],['3b','降','2b'],['2a'],['2c','1'],['3a','1']]);
  expect(m.observe(s)).toMatchObject({step:34,reads:18,compares:10,merges:3,borrows:2,size:5});
  expect(inspect(s).shape).toBe('[5 9]([2] [6] [10])');expect([...s.pic.bytes.slice(30,33)]).toEqual([16,52,79]);
  const miss=start('delete 11',seq(10)),a=one(miss).s;expect(a.pic.reads).toBe(3);expect(a.pic.bytes).toEqual(miss.pic.bytes);
  const dup=one(start('insert 7',seq(8)));expect(dup.steps).toBe(5);expect(m.observe(dup.s)).toMatchObject({size:8,height:3});
  const tight=start('insert 4',[1,2,3],2,33),fail=one(tight).s;expect(fail.note.failed).toBe(true);expect(fail.pic).toBe(tight.pic);
});
type Figure=string|[string,...Figure[]];
const code=(s:string)=>s.charCodeAt(0)-64;
function caption(f:Figure):string{
  const [word,...kids]=typeof f==='string'?[f]:f;
  return '['+[...word].map(code).join(' ')+']'+(kids.length?'('+kids.map(caption).join(' ')+')':'');
}
// 直接摆教材两幅图的 (a)，独立于插入算法。后续每幅子图也逐层列出。
function diagram(f:Figure):Picture{
  const pic=blank(),b=pic.bytes;
  function add(node:Figure):number{
    const [word,...kids]=typeof node==='string'?[node]:node;
    const at=16+13*pic.blocks.length;pic.blocks.push({at,length:13,kind:'b-tree'});
    b[at]=word.length;b[at+1]=Number(!kids.length);pic.size+=word.length;
    [...word].forEach((k,i)=>b[at+2+i]=code(k));kids.forEach((kid,i)=>b[at+7+i]=add(kid));
    return at;
  }
  b[0]=add(f);return pic;
}
const left:Figure=['CGM','AB','DEF','JKL','NO'],right:Figure=['TX','QRS','UV','YZ'];
const final:Figure=['P',left,right];
it('CLRS 第三版图 18.7 (a–e) 与 18.8 (a–f)',()=>{
  const insert:Figure[]=[['GMPX','ABCDE','JK','NO','RSTUV','YZ'],['GMPTX','ABCDE','JK','NO','QRS','UV','YZ'],
    ['P',['GM','ABCDE','JKL','NO'],right],final];
  let s={...start('insert '+[...'BQLF'].map(code).join(' '),[],3),pic:diagram(['GMPX','ACDE','JK','NO','RSTUV','YZ'])};
  for(const f of insert){s=one(s).s;expect(inspect(s).shape).toBe(caption(f));}
  const del:Figure[]=[['P',['CGM','AB','DE','JKL','NO'],right],['P',['CGL','AB','DE','JK','NO'],right],
    ['P',['CL','AB','DEJK','NO'],right],['CLPTX','AB','EJK','NO','QRS','UV','YZ'],['ELPTX','AC','JK','NO','QRS','UV','YZ']];
  s={...start([...'FMGDB'].map(k=>'delete '+code(k)).join('\n'),[],3),pic:diagram(final)};
  const cases=[];
  for(const f of del){const x=one(s);s=x.s;cases.push(x.cases);expect(inspect(s).shape).toBe(caption(f));}
  expect(cases).toEqual([['1'],['2a'],['2c','1'],['3b','降','1'],['3a','1']]);
});
it.each([2,3] as const)('度数 %i，逐操作与独立 Set 对照并核对 B 树性质',degree=>{
  for(const seed of [18,176,2026]){
    const random=mulberry32(seed),model=new Set<number>();let s=start('',[],degree);
    for(let i=0;i<400;i++){
      const k=Math.floor(random()*36),name=['insert','delete','find'][Math.floor(random()*3)];
      s=one({...s,commands:[{name,args:[k]}],ops:0}).s;
      expect(s.note.failed).toBeFalsy();
      if(name==='insert')model.add(k);else if(name==='delete')model.delete(k);else expect(s.note.text.includes('找到键')).toBe(model.has(k));
      expect(inspect(s).keys).toEqual([...model].sort((a,b)=>a-b));expect(s.pic.size).toBe(model.size);
    }
  }
});

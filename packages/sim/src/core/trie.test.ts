import { expect,it } from 'vitest';
import { trieMachine as m } from './trie';
import { parseOps } from './operations';
import { mulberry32 } from './rng';
const words=['car','cat','cart','dog','do'];
function start(script:string,keys:string[]=[],end=255){
  return m.init({kind:'trie',region:[16,end],keys,commands:parseOps(script,'trie')},0);
}
const op=(s:ReturnType<typeof start>)=>m.step(s,'一个操作').state;
it('逐字分配、按序查前缀，剪枝后的空洞优先复用',()=>{
  let s=start('insert car cat cart dog do\nfind ca\nfind car\nprefix ca');
  for(const [steps,compares] of [[6,0],[5,3],[5,3],[7,1],[4,3]]){
    const prev=s;s=op(s);expect([s.step-prev.step,s.pic.compares-prev.pic.compares]).toEqual([steps,compares]);
  }
  const bytes=s.pic.bytes;
  expect([...bytes.slice(16,48)]).toEqual([99,0,20,36,97,0,24,0,114,1,32,28,116,1,0,0,116,1,0,0,100,0,40,0,111,1,44,0,103,1,0,0]);
  expect(bytes[0]).toBe(16);expect(m.observe(s)).toMatchObject({size:5,nodes:8,height:4});
  s=op(s);expect(s.step).toBe(29);expect(s.note.text).toContain('只是前缀');
  s=op(s);expect(s.step).toBe(32);expect(s.note.text).toContain('是词');
  const compared=s.pic.compares;s=op(s);expect(s.step).toBe(37);expect(s.pic.compares-compared).toBe(2);
  expect(s.pic.words).toEqual(['car','cart','cat']);expect(m.observe(s).matches).toBe(3);
  s=start('delete cart\ndelete do\ninsert cab',words);expect(s.pic.bytes).toEqual(bytes);
  s=op(s);expect(m.observe(s)).toMatchObject({step:7,compares:4,nodes:7,height:3});
  expect(s.pic.bytes[26]).toBe(0);expect(s.pic.blocks.some(b=>b.at===32)).toBe(false);
  s=op(s);expect(s.step).toBe(11);expect(s.pic.bytes[41]).toBe(0);expect(s.pic.bytes[42]).toBe(44);
  s=op(s);expect(m.observe(s)).toMatchObject({step:16,compares:10});expect([...s.pic.bytes.slice(32,36)]).toEqual([98,1,0,24]);expect(s.pic.bytes[22]).toBe(32);
  expect(op(start('find a')).step).toBe(1);
  const small=start('insert abc',[],23), failed=op(small);expect(failed.note.failed).toBe(true);expect(failed.pic).toBe(small.pic);
});
it.each([3,18,2026])('独立词集合和不同前缀数，种子 %i',(seed)=>{
  const random=mulberry32(seed),set=new Set<string>();let s=start('');
  for(let i=0;i<400;i++){
    const name=['insert','delete','find','prefix'][Math.floor(random()*4)];
    const word=Array.from({length:1+Math.floor(random()*3)},()=>'abc'[Math.floor(random()*3)]).join('');
    s=op({...s,commands:[{name,args:[],word}],ops:0});
    if(name==='insert')set.add(word);if(name==='delete')set.delete(word);
    if(name==='find')expect(s.note.text.endsWith(' 是词')).toBe(set.has(word));
    if(name==='prefix')expect(s.pic.words).toEqual([...set].filter(w=>w.startsWith(word)).sort());
    const prefixes=new Set([...set].flatMap(w=>Array.from(w,(_,j)=>w.slice(0,j+1))));
    expect(m.observe(s)).toMatchObject({size:set.size,nodes:prefixes.size,height:Math.max(0,...[...set].map(w=>w.length))});
  }
});

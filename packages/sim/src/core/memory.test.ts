import { expect, it } from 'vitest';
import { memoryMachine as machine, type MemoryConfig } from './memory';
import { parseOps } from './operations';
import { holes } from './heap';

function run(structure:MemoryConfig['structure'],script:string,overrides:Partial<MemoryConfig>={}) {
  const config:MemoryConfig={structure,capacity:4,growth:2,probe:'linear',slots:11,region:[16,255],commands:parseOps(script,structure),...overrides};
  let s=machine.init(config,0);
  const ticks=[s],ends=[s];
  while(!machine.atEnd!(s)){
    s=machine.step(s).state;ticks.push(s);
    if(!s.tape)ends.push(s);
  }
  return {s,ticks,ends,b:s.pic.bytes,free:holes(config.region,s.pic.blocks)};
}
it.each([
  ['dynamic-array',45,1.4,63], ['stack',60,2.05,123], ['queue',50,2.3,115],
  ['dynamic-array',45,2.8,126], ['dynamic-array',45,1.3999999999999997,62],
] as const)('%s 从容量 %i 按十进制增长因子 %s 扩到 %i',(structure,capacity,growth,expected)=>{
  const op=structure==='queue'?'enqueue':'push';
  const script=op+' '+Array(capacity+1).fill(1).join(' ');
  const {s}=run(structure,script,{capacity,growth});
  expect(machine.observe(s)).toMatchObject({size:capacity+1,capacity:expected,resizes:1,moves:capacity});
});
it('首次适配逐字节搬运；释放合并并保留旧字节',()=>{
  const script='push '+Array.from({length:20},(_,i)=>i+1).join(' ');
  const a=run('dynamic-array',script,{capacity:1}), ninth=a.ends[9];
  expect([2,3,5,9].map(i=>a.ends[i].pic.bytes[0])).toEqual([17,19,23,31]);
  expect(ninth).toMatchObject({ops:9,step:32,pic:{moves:15,resizes:4}});
  expect([...ninth.pic.bytes.slice(0,3)]).toEqual([31,9,16]);
  expect(holes([16,255],ninth.pic.blocks)[0]).toEqual({at:16,length:15});
  expect(ninth.pic.bytes[16]).toBe(1);
  const b=run('dynamic-array',script,{capacity:1,growth:1.5});
  for(const [i,cap,n] of [[5,6,4],[20,28,8]]) {
    expect([...b.ends[i].pic.bytes.slice(0,3)]).toEqual([16,i,cap]);expect(b.ends[i].pic.resizes).toBe(n);
  }
});
it.each([
  ['linear',[22,33,44,0,0,0,0,7,18,0,0],[1,2,3,1,2]],
  ['quadratic',[22,33,0,0,44,0,0,7,18,0,0],[1,2,3,1,2]],
  ['double',[22,0,0,18,33,44,0,7,0,0,0],[1,2,2,1,3]],
] as const)('%s 的槽和每个键的探测数', (probe,table,counts)=>{
  const r=run('hash-open','insert 22 33 44 7 18',{probe});
  expect([...r.b.slice(16,27)]).toEqual(table);
  expect(r.ends.slice(1).map((s,i)=>s.pic.probes-r.ends[i].pic.probes)).toEqual(counts);
  expect(r.s.step).toBe(14);
});
it.each(['hash-open','hash-chain'] as const)('%s 精确比较装填比例和十进制阈值',kind=>{
  const slotsAfter=(slots:number,loadLimit:number)=>run(kind,'insert 1',{slots,loadLimit}).b[1];
  expect(slotsAfter(3,0.3333333333333333)).toBe(7);
  expect(slotsAfter(3,0.3333333333333334)).toBe(3);
  expect(slotsAfter(5,0.2)).toBe(5);
});
it('跨墓碑查找、回填墓碑，按老槽号迁移',()=>{
  const r=run('hash-open','insert 22 33 44 7 18\ndelete 33\nfind 44\ninsert 55 66');
  expect(r.ends[6].pic.bytes[17]).toBe(255);expect(r.ends[7].pic.probes-r.ends[6].pic.probes).toBe(3);
  expect(r.ends[8].pic.probes-r.ends[7].pic.probes).toBe(4);expect(r.ends[8].pic.bytes[17]).toBe(55);
  expect(r.b[19]).toBe(66);expect([...r.b.slice(0,4)]).toEqual([27,23,6,0]);
  expect([7,9,18,20,21,22].map(i=>r.b[27+i])).toEqual([7,55,18,66,44,22]);expect(r.free[0]).toEqual({at:16,length:11});
});
it('链式桶：链头、删除的唯一前驱和复用地址；翻倍重挂原结点',()=>{
  const script='insert 7 12 17 3 8', r=run('hash-chain',script+'\ndelete 12\ninsert 22',{slots:5});
  const before=r.ends[5],after=r.ends[6];
  expect(before.pic.blocks.map(b=>b.at)).toEqual([16,21,23,25,27,29]);
  expect([18,26,24,19,30].map(a=>before.pic.bytes[a])).toEqual([25,23,21,29,27]);
  expect(after.pic.probes-before.pic.probes).toBe(2);expect(after.pic.bytes[26]).toBe(21);
  expect(holes([16,255],after.pic.blocks)[0]).toEqual({at:23,length:2});expect(r.b[23]).toBe(22);
  const t=run('hash-chain',script+' 1',{slots:5,loadLimit:1});
  expect([...t.b.slice(16,21)]).toEqual([0,0,0,0,0]);expect(t.s.pic.moves).toBe(6);
  expect(t.b[0]).toBe(33);expect(t.b[1]).toBe(11);
  expect([1,3,6,7,8].map(i=>t.b[t.b[33+i]])).toEqual([12,3,17,7,8]);expect(t.b[t.b[t.b[34]+1]]).toBe(1);
});
it('链表删除只改前驱再释放，下一次复用；队列跨尾回绕再迁移',()=>{
  const r=run('linked-list','push-front 3 2 1\ndelete 2\npush-front 9');
  expect(r.ends.slice(1,4).map(s=>s.step)).toEqual([4,8,12]);
  expect(r.ends[3].pic.bytes[0]).toBe(20);expect(r.ends[3].pic.bytes[21]).toBe(18);
  expect(r.ends[4].pic.probes).toBe(2);expect(r.ends[4].pic.bytes[21]).toBe(16);
  expect(holes([16,255],r.ends[4].pic.blocks)[0]).toEqual({at:18,length:2});expect(r.b[0]).toBe(18);
  const q=run('queue','enqueue 1 2 3\ndequeue\ndequeue\nenqueue 4 5 6 7');
  expect([...q.ends[8].pic.bytes.slice(16,20)]).toEqual([5,6,3,4]);expect(q.ends[8].pic.bytes[1]).toBe(2);
  expect([...q.b.slice(0,4)]).toEqual([20,0,5,8]);expect([...q.b.slice(20,25)]).toEqual([3,4,5,6,7]);
  expect(q.s.pic.moves).toBe(4);expect(q.free[0]).toEqual({at:16,length:4});
});
it('失败原子回退，后面的操作继续；数组按方向搬移',()=>{
  const r=run('stack','push 1 2 3 4 5 6 7 8 9\npop',{capacity:1,region:[16,31]});
  expect(r.ends[9].note.text).toMatch(/16 字节.*空闲 8 字节.*7 字节/);
  expect(r.ends[9].pic).toBe(r.ends[8].pic);expect(r.s.pic.size).toBe(7);
  expect(run('stack','pop\npush 5').ends[1].note.failed).toBe(true);
  const a=run('dynamic-array','get 7\npush 1 3\ninsert 1 2\nremove 0\nset 1 4\nget 1');
  expect(a.ends[1].note.failed).toBe(true);expect([...a.b.slice(16,18)]).toEqual([2,4]);
});

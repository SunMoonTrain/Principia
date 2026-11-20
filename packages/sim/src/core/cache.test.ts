import { History } from './machine';
import { expect,it } from 'vitest';
import { visitCache,emptyCache,parseAccess,cacheMachine,type CacheConfig } from './cache';
import { cacheSchema } from '../cache-schema';
import { referenceCache } from './cache-reference.test-helper';
import { mulberry32 } from './rng';

const direct:CacheConfig={blockSize:4,sets:4,ways:1,replace:'lru',write:'write-back'};
function walk(config:CacheConfig, stream:(number|string)[]) {
  let s=emptyCache(config);
  const visits=stream.map(raw=>{const r=visitCache(s,parseAccess(raw)!);s=r.cache;return r.visit});
  return {s,visits,sequence:visits.map(v=>Number(v.hit)).join('')};
}
it('映射、替换次序和固定种子',()=>{
  expect(walk(direct,[0,4,16,0]).sequence).toBe('0000');
  for(const replace of ['lru','fifo'] as const) {
    expect(walk({...direct,sets:2,ways:2,replace},[0,4,16,0]).sequence).toBe('0001');
    expect(walk({...direct,sets:1,ways:2,replace},[0,8,0,16,0]).sequence).toBe(replace==='lru'?'00101':'00100');
  }
  const r=walk({...direct,sets:1,ways:2,replace:'random',seed:7},[0,4,8,0,4,8,0]);
  expect(r.sequence).toBe('0000101');expect(r.visits.filter(v=>v.evicted).map(v=>v.way)).toEqual([0,0,1]);
});
it('矩阵遍历使用行主序存储',()=>{
  for(const [ways,sets] of [[1,4],[2,2],[4,1],[1,16]]) for(const replace of ['lru','fifo'] as const) for(const order of ['row','column']) {
    const p=cacheSchema.parse({...direct,ways,sets,replace,pattern:{kind:'matrix',base:128,rows:8,cols:8,order}});
    expect(walk(p.config,p.accesses.map(a=>a.address)).s.misses).toBe(order==='row'||sets===16?16:64);
  }
});
it('两种写策略逐次计费，读缺失也可能写回',()=>{
  for(const write of ['write-back','write-through'] as const) {
    const r=walk({...direct,write},['w0x00',0,'w0x10',4,0]), back=write==='write-back';
    expect(r.sequence).toBe(back?'01000':'00001');expect(r.visits.map(v=>v.cost)).toEqual(back?[11,1,21,11,21]:[10,11,10,11,1]);
    expect([r.s.cycles,r.s.writebacks]).toEqual([back?65:43,2]);
  }
});
it('随机配置和读写流逐次比对独立队列模型',()=>{
  const random=mulberry32(827), integer=(n:number)=>Math.floor(random()*n);
  for(let i=0;i<120;i++) {
    const blockSize=2**integer(6), ways=2**integer(4), sets=2**integer(1+Math.min(6,Math.log2(256/blockSize/ways)));
    const config:CacheConfig={blockSize,sets,ways,replace:(['lru','fifo','random'] as const)[i%3],write:i%2?'write-back':'write-through',seed:i};
    const ref=referenceCache(config);let s=emptyCache(config);
    for(let j=0;j<100;j++) {
      const address=integer(256), write=random()<.4, r=visitCache(s,{address,write}), v=r.visit;
      expect({hit:v.hit,slot:v.way,cost:v.cost,victim:v.evicted?v.evicted.tag*sets+v.set:-1}).toEqual(ref(address,write));
      s=r.cache;
    }
  }
});

it('完整整数种子遵循 uint32 约定，随机换出后退、截断再播放一致',()=>{
  const seed=Number.MAX_SAFE_INTEGER, a=mulberry32(seed), b=mulberry32(seed>>>0);
  for(let i=0;i<12;i++) expect(a()).toBe(b());
  const stream={config:{...direct,sets:1,ways:2,replace:'random' as const,seed:7},accesses:[0,4,8,0,4,8,0].map(address=>({address,write:false}))};
  const h=new History(cacheMachine,stream,0);h.seek(7);const end=h.state;
  h.seek(2);expect(h.state.caches[0].random).toBe(7);h.truncate();h.seek(7);expect(h.state).toEqual(end);
});

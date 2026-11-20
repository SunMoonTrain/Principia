import { nextMulberry32 } from './rng.ts';
import type { Machine } from './machine.ts';

export interface CacheConfig {
  blockSize: number; sets: number; ways: number;
  replace: 'lru' | 'fifo' | 'random'; write: 'write-back' | 'write-through'; seed?: number;
}
export interface Access { address: number; write: boolean }
interface Line { tag: number; dirty: boolean; order: number }
export interface CacheState {
  config: CacheConfig; rows: (Line | null)[][]; random: number;
  hits: number; misses: number; cycles: number; writebacks: number;
}
export interface Visit extends Access {
  set: number; tag: number; offset: number; way: number; hit: boolean; cost: number;
  evicted: Line | null; dirtyEviction: boolean;
}
export const cacheNames = ['step','hits','misses','cycles','hit','writebacks'];
export const hex8 = (n:number) => '0x'+n.toString(16).toUpperCase().padStart(2,'0');
export function emptyCache(config: CacheConfig): CacheState {
  return {config, rows:Array.from({length:config.sets},()=>Array<Line|null>(config.ways).fill(null)),
    random:(config.seed ?? 0) >>> 0, hits:0, misses:0, cycles:0, writebacks:0};
}
export function blockRange(config: CacheConfig, set:number, tag:number) {
  const lo = (tag*config.sets+set)*config.blockSize;
  return hex8(lo)+'–'+hex8(lo+config.blockSize-1);
}
export function visitCache(state:CacheState, access:Access) {
  const {config} = state, {address,write} = access;
  const block = Math.floor(address/config.blockSize), set = block%config.sets, tag = Math.floor(block/config.sets);
  const row = state.rows[set], through = config.write==='write-through';
  let way = row.findIndex(line=>line?.tag===tag);
  const hit = way>=0;
  let random = state.random, evicted:Line|null = null;
  if (!hit && !(write && through)) {
    way = row.indexOf(null);
    if (way<0) {
      if (config.replace==='random') {
        const draw = nextMulberry32(random);
        random = draw.state;
        way = Math.floor(draw.value*config.ways);
      } else {
        way = 0;
        for (let j=1;j<row.length;j++) if (row[j]!.order<row[way]!.order) way=j;
      }
      evicted = row[way];
    }
  }
  const dirtyEviction = !!evicted?.dirty;
  const cost = (write && through ? (hit?11:10) : (hit?1:11)) + (dirtyEviction?10:0);
  let rows = state.rows;
  if (way>=0) {
    rows = rows.slice();
    rows[set] = row.slice();
    rows[set][way] = {tag, dirty:!through && (write || (hit && row[way]!.dirty)),
      order:hit && config.replace!=='lru' ? row[way]!.order : state.hits+state.misses+1};
  }
  const visit:Visit = {...access,set,tag,offset:address%config.blockSize,way,hit,cost,evicted,dirtyEviction};
  return {cache:{...state,rows,random,hits:state.hits+Number(hit),misses:state.misses+Number(!hit),
    cycles:state.cycles+cost,writebacks:state.writebacks+Number(dirtyEviction || (write && through))},visit};
}
export function describeVisit(c:CacheConfig,v:Visit) {
  const where = (v.write?'写 ':'读 ')+hex8(v.address)+'，标记 '+v.tag+'、组 '+v.set+'、偏移 '+v.offset;
  const result = v.hit ? '命中第 '+v.way+' 路' : v.way<0 ? '缺失，只写内存，不调块' :
    '缺失，将 '+blockRange(c,v.set,v.tag)+' 调入第 '+v.way+' 路';
  const why = v.evicted ? '，'+({lru:'最久未使用',fifo:'最早调入',random:'随机抽中'}[c.replace])+'，换出 '+blockRange(c,v.set,v.evicted.tag)+(v.dirtyEviction?' 并写回脏块':'（干净）') : '';
  return where+'；'+result+why+(v.write && v.hit && c.write==='write-through'?'，同时写内存':'')+'，用 '+v.cost+' 周期。';
}
export function parseAccess(raw:unknown):Access|undefined {
  const token = String(raw).normalize('NFKC').trim();
  const m = /^(w)?(0x[0-9a-f]+|0b[01]+|[0-9]+)$/i.exec(token);
  if (!m) return;
  const address = Number(m[2]);
  if (Number.isInteger(address) && address<=255) return {address,write:!!m[1]};
}
export interface Stream { config:CacheConfig; compare?:CacheConfig; accesses:Access[] }
interface StreamState { stream:Stream; index:number; caches:CacheState[]; visits:Visit[][] }
export const cacheMachine:Machine<Stream,StreamState> = {
  init(stream) { return {stream,index:0,caches:[stream.config,...(stream.compare?[stream.compare]:[])].map(emptyCache),visits:[]}; },
  step(s) {
    const visits = s.caches.map(cache=>visitCache(cache,s.stream.accesses[s.index]));
    const index=s.index+1;
    return {state:{...s,index,caches:visits.map(r=>r.cache),visits:[...s.visits,visits.map(r=>r.visit)]},
      events:visits.map(({cache,visit},i)=>({kind:visit.hit?'hit':'miss',text:(visits.length===2?(i?'对照：':'主表：'):'')+describeVisit(cache.config,visit)})),
      done:index===s.stream.accesses.length};
  },
  observe(s) {
    const {hits,misses,cycles,writebacks}=s.caches[0];
    return {step:s.index,hits,misses,cycles,writebacks,hit:Number(!!s.visits.at(-1)?.[0].hit)};
  },
};

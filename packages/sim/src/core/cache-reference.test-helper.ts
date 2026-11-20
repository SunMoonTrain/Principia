import type { CacheConfig } from './cache';
import { mulberry32 } from './rng';

/** 测试参照用全块号、显式路号和次序队列，不使用生产内核的地址分解或替换函数。 */
export function referenceCache(c:CacheConfig) {
  const groups=Array.from({length:c.sets},()=>[] as {block:number;slot:number;dirty:boolean}[]);
  const random=mulberry32(c.seed??0);
  return (address:number,write:boolean) => {
    const block=Math.floor(address/c.blockSize), q=groups[block%c.sets];
    const idx=q.findIndex(entry=>entry.block===block), hit=idx>=0;
    let slot=hit?q[idx].slot:-1, victim=-1, cost=hit?1:11;
    if (c.write==='write-through' && write) cost=hit?11:10;
    if (hit) {
      if (write && c.write==='write-back') q[idx].dirty=true;
      if (c.replace==='lru') q.push(q.splice(idx,1)[0]);
    } else if (!write || c.write==='write-back') {
      if(q.length===c.ways) {
        const draw=c.replace==='random'?Math.floor(random()*c.ways):-1;
        const old=q.splice(draw===-1?0:q.findIndex(e=>e.slot===draw),1)[0];
        slot=old.slot; victim=old.block;
        if(old.dirty) cost+=10;
      } else slot=q.length;
      q.push({block,slot,dirty:write});
    }
    return {hit,slot,victim,cost};
  };
}

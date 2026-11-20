import { useLayoutEffect, useRef } from 'react';
import { blockRange, hex8, type CacheState, type Visit } from './core/cache';
import './cache.css';

export function CacheTable({cache,visits,title}:{cache:CacheState;visits:Visit[];title:string}) {
  const c=cache.config, last=visits.at(-1), count=cache.hits+cache.misses;
  const pane=useRef<HTMLDivElement>(null);
  useLayoutEffect(()=>{
    const box=pane.current, row=box?.querySelector('tr[data-latest]');
    if (!box) return;
    if (!row) { box.scrollTop=0; box.scrollLeft=0; return; }
    const a=row.getBoundingClientRect(), b=box.getBoundingClientRect();
    const head=box.querySelector('thead')!.getBoundingClientRect().height;
    if (a.top<b.top+head) box.scrollTop+=a.top-b.top-head;
    else if (a.bottom>b.bottom) box.scrollTop+=a.bottom-b.bottom;
    const cell=row.children[(last?.way??-1)+1];
    if (cell && last && last.way>=0) {
      const rect=cell.getBoundingClientRect(), gutter=row.children[0].getBoundingClientRect().width;
      if(rect.left<b.left+gutter) box.scrollLeft+=rect.left-b.left-gutter;
      else if(rect.right>b.left+box.clientWidth) box.scrollLeft+=rect.right-b.left-box.clientWidth;
    }
  },[last]);
  const hits=visits.filter(v=>v.hit).length, misses=visits.length-hits;
  const rateChanged=!!visits.length && (count===visits.length || cache.hits*visits.length!==hits*count);
  const wrote=visits.some(v=>v.dirtyEviction || (v.write && c.write==='write-through'));
  const parts=[8-Math.log2(c.blockSize*c.sets),Math.log2(c.sets),Math.log2(c.blockSize)];
  const bits=last?.address.toString(2).padStart(8,'0');
  return <section className="cache-table"><h4>{title}</h4>
    <p>{c.sets} 组 × {c.ways} 路 · 每块 {c.blockSize} 字节 · {c.replace.toUpperCase()} · {c.write==='write-back'?'写回':'写直达'}</p>
    <div className="cache-address" aria-label="地址拆分">{parts.map((n,i)=>{
      const start=parts.slice(0,i).reduce((a,b)=>a+b,0);
      return <span key={i}><small>{['标记','组号','偏移'][i]}</small><b>{n?(bits?.slice(start,start+n)??'·'.repeat(n)):'∅'}</b></span>;
    })}</div>
    <div className="cache-grid-scroll" ref={pane} tabIndex={0} aria-label={title+'各组'}><table><thead><tr><th>组</th>{cache.rows[0].map((_,w)=><th key={w}>路 {w}</th>)}</tr></thead><tbody>
      {cache.rows.map((row,g)=><tr key={g} data-latest={last?.set===g?'':undefined}><th data-result={visits.some(v=>v.set===g && v.way<0)?'缺失':undefined}>{g}</th>{row.map((line,w)=>{
        const visit=visits.filter(v=>v.set===g && v.way===w).at(-1);
        return <td key={w} data-result={visit?(visit.hit?'命中':'缺失'):undefined}>{line?<>
          <strong>{blockRange(c,g,line.tag)}</strong><small>V1 · T{line.tag} · D{Number(line.dirty)}</small>
          {c.replace!=='random' && <small>{c.replace==='lru'?'使用':'调入'} #{line.order}</small>}
        </>:<span>V0 · 空</span>}{visit && <b>{visit.hit?'命中':'缺失'}</b>}</td>;
      })}</tr>)}</tbody></table></div>
    <p className="cache-counts"><span data-change={hits>0||undefined}>命中 <b>{cache.hits}</b></span><span data-change={misses>0||undefined}>缺失 <b>{cache.misses}</b></span>
      <span data-change={rateChanged||undefined}>命中率 <b>{count?(100*cache.hits/count).toFixed(1)+'%':'—'}</b></span><span data-change={!!visits.length||undefined}>周期 <b>{cache.cycles}</b></span>
      <span data-change={wrote||undefined}>{c.write==='write-back'?'写回':'写内存'} <b>{cache.writebacks}</b></span></p>
    {last?.way===-1 && <small>{hex8(last.address)} 写缺失，只写内存。</small>}
  </section>;
}

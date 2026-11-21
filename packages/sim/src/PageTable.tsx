import { useMemo, useState } from 'react';
import type { AnimProps } from '@principia/anim';
import { AlgorithmPlayer, useAlgorithm, type Controls } from './AlgorithmPlayer';
import { dimensions, pageMachine, pageNames, parseAccesses, type PageParams, type PageFrame } from './core/page-table';
import { IntegerInput, ScrollBox, mark } from './OsControls';

type Params=PageParams & Controls;
const seq=(n:number)=>Array.from({length:n},(_,i)=>i);
function Translation({p,f}:{p:Params;f:PageFrame}){
  const {pages,slots,frames,dirBits,offsetBits}=dimensions(p);
  const mappings=useMemo(()=>new Map(p.mappings.map(m=>[m.vpn,m])),[p.mappings]);
  const framePages=useMemo(()=>{
    const groups=Array.from({length:frames},()=>[] as number[]);
    for(const m of p.mappings)groups[m.frame].push(m.vpn);
    return groups;
  },[frames,p.mappings]);
  const dirs=useMemo(()=>new Set(p.mappings.map(m=>Math.floor(m.vpn/slots))),[p.mappings,slots]);
  const bits=f.request&&f.request.op!=='flush'?f.request.address.toString(2).padStart(p.vaBits,'0'):'';
  const split=p.vaBits-offsetBits;
  return <section className="os-panel"><h4>虚拟地址 {bits&&<code>
    {dirBits>0&&<b className="os-dir-bits">{bits.slice(0,dirBits)} </b>}<span {...mark('read')}>{bits.slice(dirBits,split)}</span> · <strong {...mark('write')}>{bits.slice(split)||'∅'}</strong></code>}</h4>
    <p>{p.levels===2?'目录号 '+(f.dir<0?'—':f.dir)+' · ':''}页号 {f.vpn<0?'—':f.vpn} · 偏移 {f.vpn<0?'—':f.offset} → {f.result||'等待访问'}</p>
    <div className="os-cols"><div><h4>TLB · {p.tlbPolicy??'lru'}</h4><ScrollBox label="TLB 项" step={f.step}><table><thead><tr>{['项','页','框','权限','装入','使用'].map(k=><th key={k}>{k}</th>)}</tr></thead><tbody>
    {seq(p.tlb).map(i=>{const e=f.tlb[i];return <tr key={i} {...mark(f.tlbSlot===i?f.hit?'read':'write':f.request?.op==='flush'?'write':undefined)}>
      {[i,e?.vpn,e?.frame,e?e.readonly?'R':'RW':undefined,e?.loaded,e?.used].map((v,j)=><td key={j}>{v??'—'}</td>)}</tr>;})}</tbody></table>{!p.tlb&&'已关闭'}</ScrollBox></div>
    {p.levels===2&&<div><h4>页目录</h4><ScrollBox step={f.step} label="页目录"><table><thead><tr><th>目录</th><th>有效</th></tr></thead><tbody>
      {seq(pages/slots).map(d=><tr key={d} {...mark(f.directoryRead&&d===f.dir?'read':undefined)}><th>{d}</th><td>{Number(dirs.has(d))}</td></tr>)}</tbody></table></ScrollBox></div>}
    <div><h4>页表 · {p.levels===1?pages:dirs.size*slots} 项</h4><ScrollBox step={f.step} label="页表项"><table><thead><tr>{['页','框','V','R/O','A','D'].map(k=><th key={k}>{k}</th>)}</tr></thead><tbody>
      {seq(pages).filter(v=>p.levels===1||dirs.has(Math.floor(v/slots))).map(v=>{
        const m=mappings.get(v);return <tr key={v} {...mark(v===f.vpn&&f.physical>=0?'write':v===f.vpn&&f.pteRead?'read':undefined)}>
          <th>{p.levels===2?Math.floor(v/slots)+':'+v%slots:v}</th><td>{m?.frame??'—'}</td><td>{Number(!!m)}</td><td>{Number(!!m?.readonly)}</td><td>{Number(f.visited.includes(v))}</td><td>{Number(f.dirty.includes(v))}</td></tr>;
      })}</tbody></table></ScrollBox></div></div>
    <h4>物理页框 {f.physical>=0&&<code>{f.physical.toString(2).padStart(p.paBits,'0').slice(0,p.paBits-offsetBits)} · {bits.slice(split)||'∅'}</code>}</h4><ScrollBox step={f.step} label="物理页框"><table><tbody><tr>{seq(frames).map(i=><td key={i}
      {...mark(f.physical>=0&&i===Math.floor(f.physical/p.pageSize)?f.request?.op==='W'?'write':'read':undefined)}>
      {i}〈{framePages[i].join(',')||'—'}〉</td>)}</tr></tbody></table></ScrollBox>
    <small>访问 {f.accesses} · 命中 {f.hits} · 缺失 {f.misses} · 缺页 {f.faults} · 写保护 {f.protections} · 访存 {f.refs} · 清空 {f.flushes}</small>
  </section>;
}
export default function PageTable({params:original,labels}:AnimProps<Params>){
  const session=useAlgorithm(original,pageMachine,pageNames,1),p=session.params;
  const [draft,set]=useState(original.accesses),parsed=parseAccesses(draft,p.vaBits);
  return <AlgorithmPlayer session={session} labels={labels} reset={()=>{set(original.accesses);session.apply(original);}} editor={<div className="os-editor">
    <label>访问串 <textarea rows={3} maxLength={650} value={draft} onChange={e=>set(e.target.value)}/></label>
    <button disabled={!!parsed.errors.length} onClick={()=>session.apply({...p,accesses:draft,requests:parsed.requests})}>应用访问</button>
    {parsed.errors.length>0&&<small role="status">第 {parsed.errors[0].row+1} 行，{parsed.errors[0].message}</small>}
    <IntegerInput label="TLB 项数" value={p.tlb} min={0} max={8} apply={tlb=>session.apply({...p,tlb})}/>
    <label>替换方式 <select disabled={!p.tlb} value={p.tlbPolicy??'lru'} onChange={e=>session.apply({...p,tlbPolicy:e.target.value as 'lru'|'fifo'})}>
      <option>lru</option><option>fifo</option></select></label></div>}>
    {([r])=><div className="os-stack"><Translation p={p} f={r.frame}/></div>}
  </AlgorithmPlayer>;
}

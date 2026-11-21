import { useMemo, useState } from 'react';
import type { AnimProps } from '@principia/anim';
import { AlgorithmPlayer, useAlgorithm, type Controls } from './AlgorithmPlayer';
import { faultCurve, replacements, replacementMachine, replacementNames, type ReplacementFrame, type ReplacementParams, type ReplacementRun } from './core/page-replacement';
import { IntegerInput, ScrollBox, mark, syncTimeline } from './OsControls';

type Params=ReplacementParams & Controls;
function Ring({f}:{f:ReplacementFrame}) {
  const col=f.columns.at(-1), active=col?.changed;
  return <svg width="158" height="104" viewBox="0 0 158 104" role="img" aria-label={'时钟指向帧 '+f.hand}>
    {f.bits.map((bit,i)=>{
      const a=2*Math.PI*i/f.bits.length-Math.PI/2,x=79+59*Math.cos(a),y=52+37*Math.sin(a);
      return <g key={i}><rect x={x-15} y={y-10} width="30" height="20" rx="6" fill={i===active||f.cleared.includes(i)?'color-mix(in srgb,#cb892d 48%,var(--surface))':'var(--surface)'} stroke="var(--border)"/>
        <text x={x} y={y+4} textAnchor="middle" fontSize="10" fill="var(--text)">{i}:{bit}</text>
        {i===f.hand&&<path d={'M79 52 L'+(79+.62*(x-79))+' '+(52+.62*(y-52))} stroke="var(--text)" strokeWidth={3}/>}</g>;
    })}
  </svg>;
}
function Panel({run,f,refs}:{run:ReplacementRun;f:ReplacementFrame;refs:number[]}){
  const t=f.columns.length-1, order=f.slots.flatMap((p,i)=>p===null?[]:[i]);
  if(run.algorithm==='fifo')order.sort((a,b)=>f.loaded[a]-f.loaded[b]);
  if(run.algorithm==='lru')order.sort((a,b)=>f.used[b]-f.used[a]);
  return <section className="os-panel"><h4>{f.title}</h4>
    <ScrollBox className="os-axis os-replace-axis" step={t+1} label="引用与页框"><table className="os-timeline" style={{width:(3.5+3.15*refs.length)+'rem'}}><colgroup><col style={{width:'3.5rem'}}/>{refs.map((_,i)=><col key={i}/>)}</colgroup><thead><tr><th>引用</th>{refs.map((page,i)=><td key={i} {...mark(i===t?'read':undefined)}>{page}</td>)}</tr></thead><tbody>
      {f.slots.map((_,frame)=><tr key={frame}><th>帧 {frame}</th>{refs.map((_,i)=>{
        const c=f.columns[i];return <td key={i} aria-current={i===t?'step':undefined} {...mark(i===t&&c?.changed===frame?c.hit?'read':'write':undefined)}>
          {c?.slots[frame]??'—'}{c?.changed===frame&&c.out!==null&&<small> ←{c.out}</small>}</td>;
      })}</tr>)}<tr><th>缺页</th>{refs.map((_,i)=><td key={i}>{f.columns[i]&&!f.columns[i].hit?'●':''}</td>)}</tr>
    </tbody></table></ScrollBox>
    {run.algorithm==='clock'?<div className="os-cols"><div><Ring f={f}/></div><p>帧号 : 引用位<br/>下一候选帧 {f.hand}<br/>本步清零〔{f.cleared.join('、')||'无'}〕</p></div>:
      run.algorithm==='opt'?<p>下次引用〔{f.future.map((n,i)=><span key={i} {...mark(f.columns[t]?.changed===i?'write':undefined)}> 帧{i} {Number.isFinite(n)?n+1:'∞'} </span>)}〕</p>:
      <p>{run.algorithm==='fifo'?'先装入 → 后装入':'最近 → 最久'}〔{order.map((i,j)=><span key={i} {...mark(f.columns[t]?.changed===i?f.columns[t].hit&&run.algorithm==='fifo'?'read':'write':undefined)}>{j?' → ':''}{f.slots[i]}</span>)}〕</p>}
    <small>命中 {f.hits} · 缺页 {f.faults} · 换出 {f.evictions}</small></section>;
}
function Curves({p}:{p:Params}){
  const curves=useMemo(()=>[...new Set(p.runs.map(r=>r.algorithm))].map(algorithm=>({algorithm,ys:faultCurve(p.refs,algorithm)})),[p.runs,p.refs]);
  const x=(i:number)=>34+i*30, y=(v:number)=>69-58*v/p.refs.length;
  return <section className="os-panel"><h4>帧数与缺页数</h4><svg width="284" height="88" viewBox="0 0 284 88" role="img" aria-label="一至八帧的缺页数">
    <path d="M28 8V69H254" stroke="var(--border)" fill="none"/>{[0,p.refs.length].map(n=><text key={n} x="23" y={y(n)+4} textAnchor="end" fill="var(--text)" fontSize="10">{n}</text>)}
    {Array.from({length:8},(_,i)=><text key={i} x={x(i)} y={84} textAnchor="middle" fill="var(--text)" fontSize="10">{i+1}</text>)}
    {curves.map(({algorithm,ys},i)=><polyline key={algorithm} points={ys.map((v,k)=>x(k)+','+y(v)).join(' ')} fill="none" stroke={i?'#c07c19':'var(--accent)'} strokeDasharray={i?'4 2':undefined} strokeWidth={2}/>)}</svg>
    <small>{curves.map(({algorithm,ys},i)=><span key={algorithm}>{i?'　虚线 ':'实线 '}{algorithm}〔{ys.join('，')}〕</span>)}</small></section>;
}
export default function PageReplacement({params:original,labels}:AnimProps<Params>){
  const session=useAlgorithm(original,replacementMachine,replacementNames,2),p=session.params;
  const [draft,set]=useState(original.refs.join(', ')),words=draft.normalize('NFKC').trim().split(/\s*,\s*|\s+/);
  const valid=words.length<=40&&words.every(w=>/^\d+$/.test(w)&&Number(w)<=99);
  const update=(i:number,r:ReplacementRun)=>session.apply({...p,runs:p.runs.map((v,j)=>i===j?r:v)});
  return <AlgorithmPlayer session={session} labels={labels} reset={()=>{set(original.refs.join(', '));session.apply(original);}} editor={<div className="os-editor">
    <label>引用串 <input value={draft} maxLength={240} onChange={e=>set(e.target.value)}/></label><button disabled={!valid} onClick={()=>session.apply({...p,refs:words.map(Number)})}>应用引用</button>
    {!valid&&<small role="status">请输入 1–40 个 0–99 的页号。</small>}{p.runs.map((r,i)=><fieldset key={i}><legend>配置 {i+1}</legend>
    <label>算法 <select value={r.algorithm} onChange={e=>update(i,{...r,algorithm:e.target.value as ReplacementRun['algorithm']})}>
      {replacements.map(a=><option key={a}>{a}</option>)}</select></label><IntegerInput label="帧数" value={r.frames} min={1} max={8} apply={frames=>update(i,{...r,frames})}/></fieldset>)}</div>}>
    {tracks=><div className="os-stack" onScrollCapture={syncTimeline}>{tracks.map((r,i)=><Panel key={i} f={r.frame} refs={p.refs} run={p.runs[i]}/>)}{p.curve&&<Curves p={p}/>}</div>}
  </AlgorithmPlayer>;
}

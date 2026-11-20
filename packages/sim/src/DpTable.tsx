import {useId,useState} from 'react';
import type {AnimProps} from '@principia/anim';
import {AlgorithmPlayer,useAlgorithm,type Controls} from './AlgorithmPlayer';
import {dpMachine,dpNames,type DpParams,type DpFrame} from './core/dp-table';
type Params=DpParams & Controls;
function Table({p,f}:{p:Params;f:DpFrame}){
  const marker=useId().replace(/:/g,''),dx=32,dy=25,left=p.problem==='knapsack'?78:38,top=22;
  const row=(i:number)=>i===0?'0':p.problem==='knapsack'?i+' ('+p.items[i-1].join(',')+')':Array.from(p.a)[i-1];
  const col=(j:number)=>p.problem==='knapsack'?j:j===0?'0':Array.from(p.b)[j-1];
  const x=(at:number)=>left+(at%f.width+.5)*dx,y=(at:number)=>top+(Math.floor(at/f.width)+.5)*dy;
  const traced=new Set(f.trace);
  return <section className="algo-panel alg-dp"><h4>{p.problem==='lcs'?'最长公共子序列':p.problem==='knapsack'?'0-1 背包':'编辑距离'}</h4>
    <svg viewBox={'0 0 '+(left+dx*f.width+3)+' '+(top+dy*f.height+4)} style={{width:'min(100%, '+(left+dx*f.width+3)+'px)'}} aria-label="动态规划表">
      <defs>{['use','other'].map(k=><marker key={k} id={marker+k} viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto">
        <path d="M0 0 L6 3 L0 6 Z" fill={k==='use'?'var(--accent)':'var(--muted)'}/></marker>)}</defs>
      {Array.from({length:f.width},(_,j)=><text key={j} x={x(j)} y={14}>{col(j)}</text>)}
      {Array.from({length:f.height},(_,i)=><text key={i} x={left/2} y={y(i*f.width)+4}>{row(i)}</text>)}
      {Array.from(f.table,(v,i)=><g key={i} data-cell={i} className={i===f.at?'current':f.deps.includes(i)?'dep':traced.has(i)?'traced':''}>
        <rect x={x(i)-dx/2+1} y={y(i)-dy/2+1} width={dx-2} height={dy-2} rx="3"/>
        <title>{'['+Math.floor(i/f.width)+']['+i%f.width+'] '+(v<0?'待填':v)}</title><text x={x(i)} y={y(i)+4}>{v<0?'·':v}</text>
      </g>)}
      {f.deps.map(target=>{
        const ax=x(f.at),ay=y(f.at),bx=x(target),by=y(target),len=Math.hypot(bx-ax,by-ay);
        const ux=(bx-ax)/len,uy=(by-ay)/len,used=target===f.chosen;
        // 横跨背包多列的依赖走格子上沿，避开中间的数字。
        const d=Math.abs(bx-ax)>dx+1?'M '+(ax-7)+' '+(ay-5)+' Q '+ax+' '+(by+dy/2)+' '+(bx+7)+' '+(by+5):
          'M '+(ax+ux*7)+' '+(ay+uy*7)+' L '+(bx-ux*8)+' '+(by-uy*8);
        return <path key={target} data-dependency={target} data-chosen={used} d={d} fill="none" stroke={used?'var(--accent)':'var(--muted)'} strokeWidth={used?2.6:1} markerEnd={'url(#'+marker+(used?'use':'other')+')'}/>;
      })}
    </svg>
    <p className="algo-count">已填 {f.filled} · 结果 {f.result} · 回溯 {f.traced}</p>
    {!!f.traced&&<div className="algo-meta">{p.problem==='knapsack'?'取第 '+f.answer.join('、')+' 件':p.problem==='lcs'?'公共子序列 '+f.answer.join(''):f.answer.join('、')}</div>}
  </section>;
}
function inputValues(p:Params):[string,string]{
  return p.problem==='knapsack'?[String(p.capacity),p.items.map(e=>e.join(',')).join('; ')]:[p.a,p.b];
}
export default function DpTable({params,labels}:AnimProps<Params>){
  const session=useAlgorithm(params,dpMachine,dpNames,4),p=session.params,bag=p.problem==='knapsack';
  const [[a,b],setDraft]=useState(()=>inputValues(params));
  function apply(next:Params){
    setDraft(inputValues(next));
    session.apply(next);
  }
  const first=a.normalize('NFKC').trim(),second=b.normalize('NFKC').trim();
  const items=second.split(/\s*;\s*/).map(pair=>pair.split(/\s*,\s*/));
  const words=p.problem==='lcs'?/^[\p{L}\p{N}]{1,12}$/u:/^\p{L}{1,12}$/u;
  const valid=bag?/^\d+$/.test(first)&&Number(first)>=1&&Number(first)<=20&&items.length<=8&&items.every(v=>v.length===2&&v.every((s,i)=>/^\d+$/.test(s)&&Number(s)>=1&&Number(s)<=(i===0?20:99))):words.test(first)&&words.test(second);
  return <AlgorithmPlayer session={session} labels={labels} reset={()=>apply(params)} editor={
    <form className="algo-editor" onSubmit={e=>{e.preventDefault();if(valid)apply(bag?{...p,capacity:Number(first),items:items.map(v=>[Number(v[0]),Number(v[1])])}:{...p,a:first,b:second});}}>
      <label>{bag?'容量':'行串 a'} <input value={a} size={12} maxLength={40} onChange={e=>setDraft([e.target.value,b])}/></label>
      <label>{bag?'物品（重,值；用分号隔开）':'列串 b'} <input value={b} size={bag?25:12} maxLength={120} onChange={e=>setDraft([a,e.target.value])}/></label>
      <button disabled={!valid}>应用输入</button>{!valid&&<small role="status">{bag?'容量 1–20；1–8 件，重量 1–20，价值 1–99。':'请输入 1–12 个有效字符。'}</small>}
    </form>}>
    {([r])=><Table p={p} f={r.frame}/>}
  </AlgorithmPlayer>;
}

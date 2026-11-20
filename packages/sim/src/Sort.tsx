import './sort.css';
import { useState } from 'react';
import type { AnimProps } from '@principia/anim';
import { AlgorithmPlayer,useInputs,type Controls } from './AlgorithmPlayer';
import { shuffle,sortMachine,sortNames,type SortParams,type SortFrame } from './core/sort';
import {useStepScroll} from './StructurePlayer';
import type { Track } from './core/algorithm';
type Params=SortParams & Controls & {shuffleSeed?:number};
function Bars({run,duplicates,max}:{run:Track<SortFrame>;duplicates:boolean;max:number}){
  const f=run.frame,k=f.scope;
  const scroll=useStepScroll({text:f.text,reads:f.reads,writes:f.writesAt},undefined,true);
  return <section className="algo-panel"><h4>{f.algorithm} {run.done?'✓':''}</h4>
    <div className="sort-scroll" ref={scroll}><div className="sort-bars" style={{minWidth:f.a.length*(duplicates?21:17)}}>{f.a.map((item,i)=><div className="sort-bar" key={i} data-act={f.writesAt.includes(i)?'write':f.reads.includes(i)?'read':undefined}
      data-touch={f.writesAt.includes(i)?'write':f.reads.includes(i)?'read':undefined} data-lo={k.lo===i} data-hi={k.hi===i} data-mid={k.mid===i} data-mark={k.mark===i} data-sorted={run.done||k.sorted!==undefined&&i>=k.sorted} title={'位置 '+i+'，原下标 '+item.id}>
      <i style={{height:(85*item.v/max)+'%'}}/><b>{item.v}</b>{duplicates&&<small>#{item.id}</small>}</div>)}</div></div>
    <p className="algo-meta">{k.label} [{k.lo}, {k.mid!==undefined?k.mid+', ':''}{k.hi}] {k.key&&<span data-act={f.reads.length?'read':undefined}> · {k.key.v} (#{k.key.id})</span>} {k.mark!==undefined&&' · 位置 '+k.mark}</p>
    {f.algorithm==='merge'&&<div className="sort-aux">辅助数组 {f.aux.map((v,i)=><span key={i} data-act={f.auxRead.includes(i)?'read':f.aux.length&&f.reads.length?'write':undefined}>{v.v}{duplicates?'#'+v.id:''}</span>)}</div>}
    <p className="algo-count">步 {run.step} · 比较 {f.compares} · 交换 {f.swaps} · 移动 {f.moves} · 写 {f.writes}</p>
  </section>;
}
function Session({params,labels,apply,reset}:AnimProps<Params>&{apply:(p:Params)=>void;reset:()=>void}){
  const [input,set]=useState(params.data.join(', ')),tokens=input.normalize('NFKC').trim().split(/\s*,\s*|\s+/);
  const valid=tokens.length>=2&&tokens.length<=32&&tokens.every(t=>/^\d+$/.test(t)&&Number(t)>=1&&Number(t)<=99);
  const seed=(params.shuffleSeed??params.preset?.seed??params.seed??0)+1;
  return <AlgorithmPlayer params={params} labels={labels} machine={sortMachine} names={sortNames} rate={4} reset={reset} editor={
    <form className="algo-editor" onSubmit={e=>{e.preventDefault();if(valid)apply({...params,data:tokens.map(Number)});}}>
      <label>数据 <input value={input} maxLength={200} onChange={e=>set(e.target.value)}/></label><button disabled={!valid}>应用数据</button>
      <button type="button" onClick={()=>apply({...params,data:shuffle(params.data,seed),shuffleSeed:seed})}>打乱</button>
      {!valid&&<small role="status">请输入 2–32 个 1–99 的整数。</small>}</form>}>
    {runs=>runs.map(run=><Bars key={run.frame.algorithm} run={run} duplicates={new Set(params.data).size!==params.data.length} max={Math.max(...params.data)}/>)}
  </AlgorithmPlayer>;
}
export default function Sort({params,labels}:AnimProps<Params>){
  const session=useInputs(params);return <Session key={session.id} {...session} labels={labels}/>;
}

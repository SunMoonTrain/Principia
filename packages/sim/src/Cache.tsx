import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { AnimProps } from '@principia/anim';
import { CacheTable } from './CacheTable';
import type { CacheParams } from './cache-schema';
import { cacheMachine,cacheNames,hex8,parseAccess,type Access } from './core/cache';
import type { Condition } from './core/predicate';
import { StepperBar } from './kit/StepperBar';
import { useMachine } from './kit/useMachine';

type Params=CacheParams & {goals?:Condition[];pauses?:Condition[]};
const format=(a:Access)=>(a.write?'w':'')+hex8(a.address);
function Session({params,labels,apply}:{params:Params;labels:AnimProps<Params>['labels'];apply:(a:Access[])=>void}) {
  const options=useMemo(()=>({names:cacheNames,goals:params.goals,pauses:params.pauses,stepsPerSecond:2}),[params.goals,params.pauses]);
  const player=useMachine(cacheMachine,params,0,options), s=player.history.state;
  const sequence=useRef<HTMLDivElement>(null);
  useLayoutEffect(()=>{
    const box=sequence.current, current=box?.querySelector('[aria-current="step"]');
    if (!box) return;
    if (!current) { box.scrollTop=0; return; }
    const row=current.getBoundingClientRect(), bounds=box.getBoundingClientRect();
    if (row.top<bounds.top) box.scrollTop+=row.top-bounds.top;
    else if (row.bottom>bounds.bottom) box.scrollTop+=row.bottom-bounds.bottom;
  },[s.index]);
  const [draft,setDraft]=useState(()=>params.accesses.map(format).join(', '));
  const parsed=draft.normalize('NFKC').split(',').map(parseAccess);
  const valid=parsed.length<=256 && parsed.every((a):a is Access=>!!a);
  return <StepperBar player={player} labels={labels} afterControls={params.editable && <div className="cache-editor"><label>地址流（写操作加 w）
    <textarea maxLength={8192} value={draft} onChange={e=>setDraft(e.target.value)}/></label>
    {!valid && <p role="status">请填 1 到 256 个地址，每个地址在 0–255 之间，用逗号隔开。</p>}
    <button disabled={!valid} onClick={()=>{if(valid)apply(parsed)}}>应用地址流</button></div>}>
    <div className="cache-compare">{s.caches.map((cache,i)=><CacheTable key={i} cache={cache} visits={s.visits.at(-1)?.slice(i,i+1)??[]} title={i?'对照配置':'主配置'}/>)}</div>
    <div ref={sequence} className="cache-stream" aria-label="访问序列">{params.accesses.map((a,i)=><span key={i} aria-current={i===s.index-1?'step':undefined}>
      {format(a)} <small>{s.visits[i]?.map(v=>v.hit?'命中':'缺失').join(' / ')??'待访问'}</small></span>)}</div>
  </StepperBar>;
}
export default function Cache({params,labels}:AnimProps<Params>) {
  const [stream,setStream]=useState({accesses:params.accesses,id:0});
  const active=useMemo(()=>({...params,accesses:stream.accesses}),[params,stream]);
  return <Session key={stream.id} params={active} labels={labels} apply={accesses=>setStream(s=>({accesses,id:s.id+1}))}/>;
}

import { useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { AnimProps } from '@principia/anim';
import type { PipelineParams } from './p8-schema';
import { assemble } from './core/p8-asm';
import { pipelineIsa, pipelineMachine, pipeNames, type Tick } from './core/pipeline';
import type { Condition } from './core/predicate';
import { useMachine } from './kit/useMachine';
import { StepperBar } from './kit/StepperBar';
import './pipeline.css';

const pitch=57, height=34, labelWidth=174, header=62;
function Diagram({last,end,start=Math.max(1,end-31)}:{last?:Tick;end:number;start?:number}) {
  const marker=useId(), pane=useRef<HTMLDivElement>(null);
  const ticks:Tick[]=[];
  for(let t=last;t && t.cycle>=start;t=t.previous) if(t.cycle<=end) ticks.push(t);
  ticks.reverse();
  const rows=new Map<number,{text:string;flushed:boolean}>();
  for(const t of ticks) for(const m of t.marks) rows.set(m.id,{text:m.text,flushed:m.flushed||!!rows.get(m.id)?.flushed});
  const ids=[...rows.keys()].sort((a,b)=>a-b);
  const x=(time:number)=>labelWidth+(time-(ticks[0]?.cycle??1))*pitch;
  const y=(id:number)=>header+ids.indexOf(id)*height;
  useLayoutEffect(()=>{
    const box=pane.current;
    if(!box) return;
    box.scrollLeft=box.scrollWidth; box.scrollTop=box.scrollHeight;
  },[end]);
  return <div className="pipe-scroll" ref={pane} tabIndex={0} aria-label="流水线时序，可在框内滚动">
    <div className="pipe-canvas" style={{width:labelWidth+Math.max(1,ticks.length)*pitch+2}}><svg width={labelWidth+Math.max(1,ticks.length)*pitch+2} height={header+Math.max(1,ids.length)*height+2} role="img" aria-label={'流水线，第 '+(ticks[0]?.cycle??0)+' 至 '+end+' 拍'}>
      <defs><marker id={marker} viewBox="0 0 7 7" refX="6" refY="3.5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L7 3.5 L0 7 Z"/></marker></defs>
      {!end && <text x={labelWidth} y={header+21}>待取指</text>}
      {ticks.map(t=><g key={t.cycle}>
        {t.marks.map(m=><g key={m.id} data-stage={m.stage} data-flushed={m.flushed||undefined} data-held={m.held||undefined} data-current={t.cycle===end||undefined}>
          <title>{m.text+' · '+m.stage+(m.flushed?' · 冲掉':m.held?' · 停顿':'')}</title>
          <rect x={x(t.cycle)+4} y={y(m.id)+2} width={pitch-8} height={height-5} rx={3}/>
          <text x={x(t.cycle)+pitch/2} y={y(m.id)+21} textAnchor="middle">{m.stage}{m.flushed?'×':m.held?'停':''}</text>
        </g>)}</g>)}
      {ticks.flatMap(t=>t.arrows.map((a,i)=>{
        const fromVisible=rows.has(a.from) && a.cycle>=ticks[0].cycle;
        // 两个操作数可能来自不同的生产者，分别走列间隙的两侧。
        const gutter=x(t.cycle)+(t.arrows.length===1?0:i===0?-1.8:1.8);
        const x1=fromVisible?x(a.cycle)+pitch-8:gutter, y1=fromVisible?y(a.from)+height-8:y(a.to)+3;
        const x2=x(t.cycle)+9, y2=y(a.to)+(i===0?8:height-9);
        return <path key={t.cycle+':'+a.operand} className="pipe-arrow" markerEnd={'url(#'+marker+')'}
          d={'M '+x1+' '+y1+' H '+gutter+' V '+(y2-4)+' L '+x2+' '+y2}><title>{'#'+a.from+' '+a.stage+' → #'+a.to+' EX · '+a.operand}</title></path>;
      }))}
    </svg>
    <div className="pipe-axis" style={{height:header}}><span style={{width:labelWidth}}>动态指令 / 拍<small>EX 空位</small></span>
      {ticks.map(t=><span key={t.cycle} style={{width:pitch}}>{t.cycle}{t.bubble && <small className="pipe-bubble">气泡</small>}</span>)}</div>
    <div className="pipe-row-labels" style={{paddingTop:header}} aria-hidden="true">{ids.map(id=><div key={id} style={{height}} title={rows.get(id)!.text}>#{id} {rows.get(id)!.text}{rows.get(id)!.flushed && <b>冲掉</b>}</div>)}</div></div>
  </div>;
}
type Params=PipelineParams & {goals?:Condition[];pauses?:Condition[]};
export default function Pipeline({params,labels}:AnimProps<Params>) {
  const boot=useMemo(()=>({...params,image:assemble(params.program,pipelineIsa)}),[params]);
  const options=useMemo(()=>({names:pipeNames,stepsPerSecond:1,goals:params.goals,pauses:params.pauses}),[params.goals,params.pauses]);
  const player=useMachine(pipelineMachine,boot,0,options), s=player.history.state;
  const [page,setPage]=useState(0), [open,setOpen]=useState(false);
  const written=player.history.events.flatMap(e=>e.touched??[]), olderCount=Math.max(0,s.cycle-32);
  const lastOldPage=Math.max(0,Math.ceil(olderCount/32)-1), currentPage=Math.min(page,lastOldPage);
  return <StepperBar player={player} labels={labels} afterControls={olderCount>0 && <details open={open} onToggle={e=>setOpen(e.currentTarget.open)}>
    <summary>更早的 {olderCount} 拍</summary>{open && <><div className="sim-controls">
      <button disabled={!currentPage} onClick={()=>setPage(currentPage-1)}>前 32 拍</button>
      <button disabled={currentPage===lastOldPage} onClick={()=>setPage(currentPage+1)}>后 32 拍</button></div>
      <Diagram last={s.tick} start={currentPage*32+1} end={Math.min((currentPage+1)*32,olderCount)}/></>}</details>}>
    <div className="pipe-main"><h4>{params.forwarding?'开启转发':'关闭转发'} · {params.branch==='stall'?'分支等待':'预测不跳'}</h4>
      <Diagram last={s.tick} end={s.cycle}/>
      <p className="pipe-stats"><span data-write={written.includes('cycle')||undefined}>总周期 <b>{s.cycle}</b></span><span data-write={written.includes('retired')||undefined}>完成 <b>{s.retired}</b></span>
        <span data-write={written.includes('CPI')||undefined}>CPI <b>{s.retired?(s.cycle/s.retired).toFixed(2):'—'}</b></span><span data-write={written.includes('stalls')||undefined}>数据停顿 <b>{s.stalls}</b></span><span data-write={written.includes('flushed')||undefined}>冲掉 <b>{s.flushed}</b></span></p>
      <p className="pipe-registers">{s.committed.registers.map((n,i)=><span key={i} data-write={written.includes('R'+i)||undefined}>R{i} <b>{n}</b></span>)}
        {Object.entries(s.committed.flags).map(([k,v])=><span key={k} data-write={written.includes('标志')||undefined}>{k} <b>{v}</b></span>)}</p>
      <p className="pipe-output" data-write={written.includes('output')||undefined}>输出　{s.committed.output.join(', ')||'—'}</p>
    </div></StepperBar>;
}

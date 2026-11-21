import { useState } from 'react';
import type { AnimProps } from '@principia/anim';
import { AlgorithmPlayer, useAlgorithm, type Controls } from './AlgorithmPlayer';
import { IntegerInput, ScrollBox, mark, syncTimeline } from './OsControls';
import { parseJobs, policies, schedulerMachine, schedulerNames, type Job, type ScheduleFrame, type ScheduleParams, type ScheduleRun } from './core/scheduler';

type Params = ScheduleParams & Controls;
function SchedulePanel({frame: f, jobs, run, horizon}: {frame: ScheduleFrame; jobs: Job[]; run: ScheduleRun; horizon:number}) {
  const cpu = f.ticks.at(-1)?.cpu, levels = run.algorithm === 'mlfq' ? run.quanta ?? [2,4,8] : [0];
  const currentTick = f.time - 1;
  const sleeping = f.processes.flatMap((p,i)=>p.wake>=0?[i]:[]);
  return <section className="os-panel"><h4>{f.title} · {currentTick < 0 ? '初态' : 't = ' + currentTick}</h4>
    <div className="os-schedule-layout"><ScrollBox className="os-axis" step={f.time} label="CPU 与作业的甘特图"><table className="os-timeline" style={{width:(3.5+2.7*horizon)+'rem'}}><colgroup><col style={{width:'3.5rem'}}/>{Array.from({length:horizon},(_,i)=><col key={i}/>)}</colgroup><tbody>
      {['时间','CPU',...jobs.map(j => j.name)].map((label, row) => <tr key={row}><th>{label}</th>{Array.from({length:horizon}, (_, t) => {
        const tick=f.ticks[t];
        if(!tick)return <td key={t}>{row===0?t:'　'}</td>;
        const state = tick.states[row-2], current = t === currentTick;
        return <td key={t} aria-current={current ? 'step' : undefined} data-state={state}
          {...mark(current ? row === 1 || state === '运行' ? 'write' : 'read' : undefined)}>
          {row === 0 ? t : row === 1 ? jobs[tick.cpu]?.name ?? '　' : state}</td>;
      })}</tr>)}</tbody></table></ScrollBox>
    <div>{levels.map((q,level)=><p key={level}><span {...mark(f.time?'read':undefined)}>
      {q?'L'+level+'（时间片 '+q+'）':'就绪'}〔{f.ready.filter(i=>f.processes[i].level===level).map(i=>
        jobs[i].name+(q?' '+f.processes[i].used+'/'+(run.allotments??levels)[level]:'')).join(' → ')||'空'}〕
    </span></p>)}
    <p>I/O〔{sleeping.length?sleeping.map((i,k)=><span key={i} {...mark(i===cpu?'write':undefined)}>{k>0?'，':''}{jobs[i].name} → {f.processes[i].wake}</span>):'空'}〕</p>
    <ScrollBox step={f.time} label="作业指标" className="os-metrics"><table><thead><tr>{['作业','到达','计算','首次','完成','周转','等待','响应',...(run.algorithm==='mlfq'?['级 / 已用额度']:[])].map(k=><th key={k}>{k}</th>)}</tr></thead><tbody>
      {f.processes.map((p,i) => {const j=jobs[i], turn=p.finish-j.arrival;
        return <tr key={i} {...mark(i===cpu?'write':undefined)}>{[j.name,j.arrival,p.cpu,p.first,p.finish,p.finish<0?-1:turn,p.finish<0?-1:turn-p.cpu-p.io,p.first<0?-1:p.first-j.arrival,...(run.algorithm==='mlfq'?['L'+p.level+' / '+p.used]:[])].map((x,k)=><td key={k}>{x===-1?'—':x}</td>)}</tr>;
      })}{f.completed===jobs.length&&<tr><th colSpan={5}>平均</th>{[f.turnaround,f.waiting,f.response].map((x,i)=><td key={i}>{(x/jobs.length).toFixed(2)}</td>)}</tr>}
    </tbody></table></ScrollBox></div></div>
    <small>完成 {f.completed} · 切换 {f.switches} · 抢占 {f.preemptions} · 空闲 {f.idle}</small>
  </section>;
}
export default function Scheduler({params:original, labels}: AnimProps<Params>) {
  const session = useAlgorithm(original, schedulerMachine, schedulerNames, 2), p = session.params;
  const [draft,setDraft] = useState(p.jobs);
  const parsed = parseJobs(draft,p.runs.some(r => r.algorithm==='priority'));
  function update(i:number, run:ScheduleRun) {session.apply({...p, runs:p.runs.map((r,k)=>k===i?run:r)});}
  return <AlgorithmPlayer labels={labels} session={session} reset={()=>{setDraft(original.jobs); session.apply(original);}} editor={
    <div className="os-editor"><label>作业表 <textarea rows={3} maxLength={700} value={draft} onChange={e=>setDraft(e.target.value)}/></label>
      <button disabled={!!parsed.errors.length} onClick={()=>session.apply({...p,jobs:draft,tasks:parsed.tasks})}>应用作业</button>
      {parsed.errors.length>0&&<small role="status">第 {parsed.errors[0].row+1} 行，{parsed.errors[0].message}</small>}
      {p.runs.map((run,i)=><fieldset key={i}><legend>配置 {i+1}</legend><label>算法 <select value={run.algorithm}
        onChange={e=>update(i,{algorithm:e.target.value as ScheduleRun['algorithm']})}>{policies.map(a=><option key={a} disabled={a==='priority'&&p.tasks.some(j=>j.priority===undefined)}>{a}</option>)}</select></label>
        {run.algorithm==='rr'&&<IntegerInput label="时间片" min={1} max={20} value={run.quantum??4} apply={quantum=>update(i,{...run,quantum})}/>}
        {run.algorithm==='priority'&&<label><input type="checkbox" checked={!!run.preemptive} onChange={e=>update(i,{...run,preemptive:e.target.checked})}/>允许抢占</label>}
        {run.algorithm==='mlfq'&&(run.quanta??[2,4,8]).map((q,k)=><IntegerInput key={k} label={'L'+k+' 时间片'} min={1} max={20} value={q}
          apply={n=>{const quanta=[...(run.quanta??[2,4,8])];quanta[k]=n;update(i,{...run,quanta,allotments:run.allotments?.map((a,j)=>Math.max(a,quanta[j]))});}}/>)}</fieldset>)}</div>}>
    {tracks=><div className="os-stack" onScrollCapture={syncTimeline}>{tracks.map((r,i)=><SchedulePanel key={i} horizon={Math.max(...tracks.map(t=>t.step))} jobs={p.tasks} run={p.runs[i]} frame={r.frame}/>)}</div>}
  </AlgorithmPlayer>;
}

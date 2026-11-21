import { useMemo, useState } from 'react';
import type { AnimProps } from '@principia/anim';
import type { Controls } from './AlgorithmPlayer';
import { canRun, threadMachine, threadNames, type ThreadParams } from './core/threads';
import { IntegerInput, ScrollBox, mark } from './OsControls';
import { useMachine } from './kit/useMachine';
import { StepperBar } from './kit/StepperBar';

type Params=ThreadParams & Controls;
export default function Threads({params:original,labels}:AnimProps<Params>) {
  const [p,set]=useState(original);
  const defaultList=Array.isArray(original.schedule)?original.schedule:original.programs.map(t=>t.name);
  const [listText,setListText]=useState(defaultList.join(', '));
  const list=listText.normalize('NFKC').trim().split(/\s*,\s*|\s+/);
  const listOK=list.length<=100&&list.every(name=>p.programs.some(t=>t.name===name));
  const options=useMemo(()=>({names:[...threadNames,...Object.keys(p.shared),...Object.keys(p.semaphores)],
    stepsPerSecond:2,goals:p.goals,pauses:p.pauses}),[p.shared,p.semaphores,p.goals,p.pauses]);
  const player=useMachine(threadMachine,p,0,options), s=player.history.state;
  const step=s.turns.length, touch=(k:string)=>mark(s.writes.includes(k)?'write':s.reads.includes(k)?'read':undefined);
  function apply(next:Params){set(next);player.replaceInputs(next);}
  return <StepperBar player={{...player,reset:()=>{setListText(defaultList.join(', '));apply(original);}}} labels={labels} afterControls={p.editable&&<div className="os-editor">
    <label>调度 <select value={Array.isArray(p.schedule)?'list':p.schedule} onChange={e=>{
      const schedule=e.target.value==='list'?(listOK?list:defaultList):e.target.value as 'rr'|'random';
      apply({...p,schedule,seed:schedule==='random'?original.seed??0:undefined,quantum:schedule==='rr'?original.quantum??1:undefined});
    }}><option value="rr">轮转</option><option value="random">随机</option><option value="list">指定列表</option></select></label>
    {Array.isArray(p.schedule)&&<><label>线程顺序 <input value={listText} maxLength={600} onChange={e=>setListText(e.target.value)}/></label>
      <button disabled={!listOK} onClick={()=>apply({...p,schedule:list})}>应用顺序</button>
      {!listOK&&<small role="status">用 1–100 个已声明的线程名指定交错。</small>}</>}
    {p.schedule==='rr'&&<IntegerInput label="时间片" value={p.quantum??1} min={1} max={10} apply={quantum=>apply({...p,quantum})}/>}
    {p.schedule==='random'&&<IntegerInput label="seed" value={p.seed??0} min={Number.MIN_SAFE_INTEGER} max={Number.MAX_SAFE_INTEGER} apply={seed=>apply({...p,seed})}/>}
  </div>}>
    <div className="os-stack"><section className="os-panel"><div className="os-cols">{p.programs.map((prog,i)=>{
      const t=s.ts[i],last=s.turns.at(-1);
      return <div key={prog.name}><h4>{prog.name} · <span {...touch('state:'+i)}>{t.wait!==null?'等待 '+t.wait:canRun(s,i)?'就绪':'完成'}</span></h4>
        <ScrollBox className="os-code-scroll" step={step} label={prog.name+' 指令'}><table><tbody>{prog.code.map((ins,pc)=><tr key={pc} aria-current={pc===t.pc?'step':undefined}
          {...mark(last?.name===prog.name&&last.pc===pc?'read':pc===t.pc&&s.last===i?'write':undefined)}><th>{pc}</th><td>{ins.source}</td></tr>)}</tbody></table></ScrollBox>
        <p>{t.regs.map((v,r)=><span key={r} {...touch(i+':r'+r)}> r{r}={String(v)} </span>)}</p>
        {p.editable&&<button aria-disabled={s.done||!canRun(s,i)} onClick={()=>{if(!s.done&&canRun(s,i)){player.edit(i);player.step();}}}>{prog.name} 走一步</button>}</div>;
    })}</div><h4>共享状态</h4><p>{Object.entries(s.shared).map(([k,v])=><span key={k} {...touch(k)}>{k} = {String(v)}　</span>)}</p>
    {Object.keys(s.queues).map(k=><p key={k} {...touch(k)}>{Object.hasOwn(s.owners,k)?'锁 '+k+' · '+(p.programs[s.owners[k]]?.name??'空闲'):'信号量 '+k+' = '+s.sem[k]}　等候〔{s.queues[k].map(i=>p.programs[i].name).join(' → ')||'空'}〕</p>)}
    <ScrollBox step={step} label="线程交错时间线"><table><tbody><tr><th>交错</th>{s.turns.map((t,i)=><td key={i} {...mark(i===step-1?'write':undefined)} title={String(i+1)}>{t.name}</td>)}</tr></tbody></table></ScrollBox>
    <small>步 {step} · 切换 {s.switches} · 阻塞 {s.ts.filter(t=>t.wait!==null).length}</small></section></div>
  </StepperBar>;
}

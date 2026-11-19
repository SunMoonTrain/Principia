import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { ProgramAnswer } from '../../shared/content-types';
import type { Verdict } from '../../shared/judge';
import type { CaseResult, ProgramResult } from '../../packages/sim/src/core/p8-program';
import { P8Editor, useAssembly } from '../../packages/sim/src/P8Editor';
import type { CpuParams } from '../../packages/sim/src/p8-schema';

import './ProgramForm.css';

const Cpu = lazy(() => import('../../packages/sim/src/Cpu'));
const views: CpuParams['view'] = ['code','registers','flags','memory','stack','output','cycles'];
const list = (values: number[]) => '[' + values.join(', ') + ']';

export default function ProgramForm({ answer, onSubmit }: {answer: ProgramAnswer; onSubmit: (raw: string, verdict: Verdict) => void}) {
  const [source, setSource] = useState(answer.starter);
  const [results, setResults] = useState<CaseResult[]>([]);
  const [inspect, setInspect] = useState<CpuParams | null>(null);
  const [busy, setBusy] = useState(false);
  const worker = useRef<Worker | null>(null);
  const draft = useAssembly(source, answer.isa);
  useEffect(() => () => worker.current?.terminate(), []);

  function change(value: string) {
    worker.current?.terminate();
    worker.current = null;
    setBusy(false);
    setResults([]);
    setInspect(null);
    setSource(value);
  }
  function run() {
    if (source.length > 8000) {
      onSubmit(source, {kind:'format', message:'作答原文最多 8000 字'});
      return;
    }
    if (draft.error) {
      onSubmit(source, {kind:'format', message:'第 ' + draft.error.line + ' 行：' + draft.error.message});
      return;
    }
    const task = new Worker(new URL('./program.worker.ts', import.meta.url), {type:'module'});
    worker.current = task;
    setBusy(true);
    const finish = () => {
      task.terminate();
      worker.current = null;
      setBusy(false);
    };
    task.onmessage = ({data}: MessageEvent<ProgramResult>) => {
      if (worker.current !== task) return;
      finish();
      if ('error' in data) onSubmit(source, {kind:'format', message:'第 '+data.error.line+' 行：'+data.error.message});
      else {
        setResults(data.results);
        setInspect(null);
        onSubmit(source, {kind:'graded', correct:data.results.every(r => r.passed)});
      }
    };
    task.onerror = () => {
      if (worker.current !== task) return;
      finish();
      onSubmit(source, {kind:'format',message:'测试未能运行，请重试'});
    };
    task.postMessage({source, answer});
  }
  function openSimulator() {
    const i = Math.max(0, results.findIndex(r => !r.passed));
    setInspect({program:source, input:answer.tests[i].in, isa:answer.isa, granularity:'instruction', view:views, editable:true, breakpoints:[]});
  }
  return <div className="program-form">
    <p>周期上限 {answer.maxCycles}{answer.isa && ' · 开放指令 '+answer.isa.join('、')}</p>
    <P8Editor value={source} change={change} error={draft.error} maxLength={8000}/>
    <button type="button" className="answer-submit" disabled={busy} onClick={run}>{busy?'正在测试…':'运行测试'}</button>
    <div className="program-tests"><table><thead><tr>{['用例','输入','期望输出','实际输出','周期','结果'].map(name=><th key={name}>{name}</th>)}</tr></thead>
      <tbody>{answer.tests.map((t,i)=><tr key={i}><th>{i+1}</th><td>{list(t.in)}</td><td>{list(t.out)}</td>
        <td>{results[i]?list(results[i].actual):'—'}</td><td>{results[i]?.cycles??'—'}</td>
        <td>{results[i]?(results[i].passed?'通过':results[i].reason):'待运行'}</td></tr>)}</tbody></table></div>
    <button type="button" className="hint-button" disabled={!!draft.error || busy} onClick={openSimulator}>在模拟器里单步看</button>
    {inspect && <Suspense fallback={<p>正在装入处理器…</p>}><Cpu key={JSON.stringify([inspect.program,inspect.input])} params={inspect}/></Suspense>}
  </div>;
}

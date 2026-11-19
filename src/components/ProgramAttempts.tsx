import type { ProblemProgress } from '../../shared/progress';

export function ProgramAttempts({record}: {record?: ProblemProgress}) {
  const attempts = record?.attempts?.filter(a => a.result !== 'gave-up');
  if (!attempts?.length) return null;
  return <details><summary>作答记录（{attempts.length}）</summary><ol>{attempts.map(a =>
    <li key={a.id}>{a.result === 'correct' ? '答对' : '答错'} · {a.at}
      <pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{a.input}</pre>
    </li>)}</ol></details>;
}

// 难题、思考题：状态（未开始 → 有思路 → 写完待批改 → 已批改）、思路笔记、「复制给 Claude」、录入批改结果。
// 见 docs/plan.md「题目与判题」。

import { useState, type FormEvent } from 'react';
import type { Problem } from '../../shared/content-types';
import {
  hintsShown,
  laterTimestamp,
  latestGrade,
  problemStatus,
  type GradeRecord,
  type GradeResult,
  type ProblemProgress,
  type ProblemStatus,
} from '../../shared/progress';
import { useContent } from '../content/ContentContext';
import { useLessonContext } from '../content/LessonContext';
import { claudeText, copyText } from '../notes/claudeText';
import { useNote } from '../progress/notes';
import { newId, useProgress } from '../progress/ProgressContext';
import { NoteEditor } from './NoteEditor';

export const STATUS_LABELS: Record<ProblemStatus, string> = { none: '未开始', idea: '有思路', ready: '写完待批改', graded: '已批改' };
export const GRADE_LABELS: Record<GradeResult, string> = { pass: '通过', partial: '部分', fail: '没过' };
const STATUSES: ProblemStatus[] = ['none', 'idea', 'ready', 'graded'];

/** 「11 月 9 日 11:05」 */
export function shortTime(at: string | undefined): string {
  if (!at) return '';
  const d = new Date(at);
  return `${d.getMonth() + 1} 月 ${d.getDate()} 日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** 题目卡片右上角：难题、思考题的状态。 */
export function WorkBadge({ record }: { record: ProblemProgress | undefined }) {
  const status = problemStatus(record);
  if (status === 'none') return null;
  const grade = latestGrade(record);
  const text = status === 'graded' && grade ? `已批改 · ${GRADE_LABELS[grade.result]}` : STATUS_LABELS[status];
  const tone = status === 'graded' && grade ? `grade-${grade.result}` : 'work-open';
  return <span className={`first-result work-badge ${tone}`}>{text}</span>;
}

function GradeForm({ onSave, onCancel }: { onSave: (result: GradeResult, comment: string) => void; onCancel: () => void }) {
  const [result, setResult] = useState<GradeResult | null>(null);
  const [comment, setComment] = useState('');
  const submit = (e: FormEvent): void => {
    e.preventDefault();
    if (result) onSave(result, comment.trim());
  };
  return (
    <form className="grade-form" onSubmit={submit}>
      <div className="grade-form-row">
        <span className="grade-form-label">批改结果</span>
        <div className="chips" role="radiogroup" aria-label="批改结果">
          {(['pass', 'partial', 'fail'] as const).map((r) => (
            <button key={r} type="button" role="radio" aria-checked={result === r} className={`chip grade-chip-${r}${result === r ? ' chip-on' : ''}`} onClick={() => setResult(r)}>
              {GRADE_LABELS[r]}
            </button>
          ))}
        </div>
      </div>
      <textarea
        className="grade-comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="批语，可省略，比如 Claude 指出的问题"
        rows={2}
        maxLength={4000}
        aria-label="批语"
      />
      <div className="grade-form-row">
        <button type="submit" className="answer-submit" disabled={!result}>
          记下
        </button>
        <button type="button" className="giveup-button" onClick={onCancel}>
          取消
        </button>
      </div>
    </form>
  );
}

function GradeList({ grades }: { grades: GradeRecord[] }) {
  return (
    <section className="grade-list" aria-label="批改记录">
      <div className="grade-list-title">批改记录</div>
      <ol>
        {[...grades].reverse().map((g) => (
          <li key={g.id}>
            <span className={`grade-badge grade-${g.result}`}>{GRADE_LABELS[g.result]}</span>
            <span className="grade-time">{shortTime(g.at)}</span>
            {g.comment && <span className="grade-text">{g.comment}</span>}
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ProblemWork({ problem, index, record }: { problem: Problem; index: number; record: ProblemProgress | undefined }) {
  const { lessonId, macros } = useLessonContext();
  const lesson = lessonId ?? '';
  const { lessons } = useContent();
  const progress = useProgress();
  const note = useNote(lesson, problem.id);
  const [grading, setGrading] = useState(false);
  const [copied, setCopied] = useState<{ ok: boolean; text: string } | null>(null);
  const status = problemStatus(record);
  const grade = latestGrade(record);

  const setStatus = (next: ProblemStatus): void => {
    if (next === status) return;
    progress.dispatch({ type: 'problem-status', lesson, problem: problem.id, status: next, at: laterTimestamp(record?.statusAt) });
  };
  const saveGrade = (result: GradeResult, comment: string): void => {
    progress.dispatch({
      type: 'grade',
      lesson,
      problem: problem.id,
      // 时间至少晚于现在的状态，这样「已批改」一定盖过刚点的状态
      grade: { id: newId(), at: laterTimestamp(record?.statusAt), result, ...(comment ? { comment } : {}) },
    });
    setGrading(false);
  };
  const copy = async (): Promise<void> => {
    const text = claudeText({
      lessonTitle: lessons.get(lesson)?.titleText ?? lesson,
      number: index + 1,
      tier: problem.tier,
      statement: problem.statementText ?? '',
      note: note.text,
      hintsShown: hintsShown(record),
      macros,
    });
    setCopied({ ok: await copyText(text), text });
  };

  return (
    <div className="work">
      <NoteEditor lesson={lesson} problem={problem.id} macros={macros} />
      <div className="work-row">
        <span className="work-label">状态</span>
        <div className="chips" role="group" aria-label="这道题的状态">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={status === s}
              className={status === s ? 'chip chip-on' : 'chip'}
              // 「已批改」要带上结果，点它就是录入一次批改
              onClick={() => (s === 'graded' ? setGrading(true) : setStatus(s))}
            >
              {s === 'graded' && status === 'graded' && grade ? `已批改 · ${GRADE_LABELS[grade.result]}` : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>
      <div className="work-row work-actions">
        <button type="button" className="hint-button" onClick={() => void copy()}>
          复制给 Claude
        </button>
        {!grading && (
          <button type="button" className="hint-button" onClick={() => setGrading(true)}>
            录入批改结果
          </button>
        )}
        {copied && (
          <span className={copied.ok ? 'copy-note' : 'copy-note copy-note-warn'} role="status">
            {copied.ok ? '已复制，粘贴给 Claude 就行' : '没能自动复制，请从下面手动复制'}
          </span>
        )}
      </div>
      {copied && (
        <details className="copy-preview" open={!copied.ok}>
          <summary>看看复制了什么</summary>
          <pre>{copied.text}</pre>
        </details>
      )}
      {grading && <GradeForm onSave={saveGrade} onCancel={() => setGrading(false)} />}
      {record?.grades?.length ? <GradeList grades={record.grades} /> : null}
    </div>
  );
}

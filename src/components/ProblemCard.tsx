// 一道题。简单题、中等题可以当场作答：数值题填式子，选择题点选项；答对或放弃后显示解答。
// 难题、思考题只显示题干和提示（笔记与批改是台阶 4）。提示点开一级才出现下一级的按钮。

import { useState, type FormEvent } from 'react';
import type { Answer, Problem, Tier } from '../../shared/content-types';
import { judgeChoice, judgeNumeric, type Verdict } from '../../shared/judge';
import { useLessonContext } from '../content/LessonContext';
import { Rich } from '../content/Rich';
import { firstResult, practiceKey, recordAttempt, revealHint, solutionUnlocked, solvedBeforeGivingUp, usePractice } from '../practice/store';

const TIER_LABELS: Record<Tier, string> = { easy: '简单', medium: '中等', hard: '难', thinking: '思考' };
const HINT_NAMES = ['方向', '关键步骤', '完整解答'];
const OPTION_LABELS = 'ABCDEFGHIJ';

type NumericAnswer = Extract<Answer, { type: 'number' | 'tuple' | 'set' }>;
type ChoiceAnswer = Extract<Answer, { type: 'choice' }>;

function answerKind(problem: Problem): string {
  const a = problem.answer;
  if (!a) return '写思路笔记，找 Claude 批改';
  switch (a.type) {
    case 'number':
      return '填一个数';
    case 'tuple':
      return `按顺序填 ${a.value.length} 个数`;
    case 'set':
      return `填 ${a.value.length} 个数，不分顺序`;
    case 'choice':
      return a.multiple ? '多选' : '单选';
  }
}

const HELP: Record<NumericAnswer['type'], string> = {
  number: '可以写式子：分数 1/3、根号 sqrt(2)、π 写 pi、乘方 2^10、对数 ln(2)',
  tuple: '按顺序填，用逗号隔开，例如 -1, 2；每个数都可以写式子',
  set: '不分顺序，用逗号隔开；重复的数要重复写',
};

interface Feedback {
  kind: 'correct' | 'wrong' | 'format' | 'gave-up';
  text: string;
  /** 每次作答换一个值，用来重新触发动效。 */
  nonce: number;
}

/** 判完一次：格式错误只提示；判了对错就记一次作答。 */
function useSubmit(key: string): [Feedback | null, (input: string, verdict: Verdict) => void, (f: Feedback) => void] {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const submit = (input: string, verdict: Verdict): void => {
    const nonce = Date.now();
    if (verdict.kind === 'format') {
      setFeedback({ kind: 'format', text: `${verdict.message}（这次不算作答）`, nonce });
      return;
    }
    recordAttempt(key, input, verdict.correct ? 'correct' : 'wrong');
    setFeedback(verdict.correct ? { kind: 'correct', text: '对了！', nonce } : { kind: 'wrong', text: '不对，再想想。', nonce });
  };
  return [feedback, submit, setFeedback];
}

function FeedbackLine({ feedback }: { feedback: Feedback | null }) {
  if (!feedback) return null;
  const icon = { correct: '✓', wrong: '✗', format: '!', 'gave-up': '·' }[feedback.kind];
  return (
    <p key={feedback.nonce} className={`feedback feedback-${feedback.kind}`} role="status">
      <span className="feedback-icon" aria-hidden="true">
        {icon}
      </span>
      {feedback.text}
    </p>
  );
}

function NumericForm({ answer, problem, onSubmit }: { answer: NumericAnswer; problem: Problem; onSubmit: (input: string, v: Verdict) => void }) {
  const [input, setInput] = useState('');
  const submit = (e: FormEvent): void => {
    e.preventDefault();
    onSubmit(input, judgeNumeric(answer, problem.tolerance!, input));
  };
  return (
    <form className="answer-form" onSubmit={submit}>
      <div className="answer-row">
        <input
          className="answer-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={answer.type === 'number' ? '输入答案' : '用逗号隔开'}
          aria-label={`第 ${problem.id.slice(1)} 题的答案`}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
        {answer.unit && (
          <span className="answer-unit">
            <Rich value={answer.unit} />
          </span>
        )}
        <button type="submit" className="answer-submit">
          提交
        </button>
      </div>
      <p className="answer-help">{HELP[answer.type]}</p>
    </form>
  );
}

function ChoiceForm({ answer, onSubmit }: { answer: ChoiceAnswer; onSubmit: (input: string, v: Verdict) => void }) {
  const [selected, setSelected] = useState<number[]>([]);
  const toggle = (n: number): void =>
    setSelected((s) => (answer.multiple ? (s.includes(n) ? s.filter((x) => x !== n) : [...s, n]) : s.includes(n) ? [] : [n]));
  const submit = (e: FormEvent): void => {
    e.preventDefault();
    const sorted = [...selected].sort((a, b) => a - b);
    onSubmit(sorted.map((n) => OPTION_LABELS[n - 1]).join(''), judgeChoice(answer, sorted));
  };
  return (
    <form className="answer-form" onSubmit={submit}>
      <ol className="problem-options" role={answer.multiple ? 'group' : 'radiogroup'}>
        {answer.options.map((option, i) => {
          const n = i + 1;
          const on = selected.includes(n);
          return (
            <li key={n}>
              <button
                type="button"
                className={on ? 'option option-selected' : 'option'}
                role={answer.multiple ? 'checkbox' : 'radio'}
                aria-checked={on}
                onClick={() => toggle(n)}
              >
                <span className={answer.multiple ? 'option-mark option-mark-box' : 'option-mark'} aria-hidden="true" />
                <span className="option-label">{OPTION_LABELS[i]}</span>
                <span className="option-body">
                  <Rich value={option} />
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <div className="answer-row">
        <button type="submit" className="answer-submit">
          提交
        </button>
        <span className="answer-help">{answer.multiple ? '可以选多个' : '只选一个'}</span>
      </div>
    </form>
  );
}

function FirstResultBadge({ result }: { result: ReturnType<typeof firstResult> }) {
  if (!result) return null;
  const text = { correct: '首次答对', wrong: '首次答错', 'gave-up': '放弃了（算错）' }[result];
  return <span className={`first-result first-result-${result}`}>{text}</span>;
}

export function ProblemCard({ problem, index }: { problem: Problem; index: number }) {
  const { lessonId } = useLessonContext();
  const key = practiceKey(lessonId ?? '', problem.id);
  const practice = usePractice(key);
  const [feedback, submit, setFeedback] = useSubmit(key);
  const [confirmGiveUp, setConfirmGiveUp] = useState(false);
  const a = problem.answer;
  const unlocked = solutionUnlocked(practice);
  // 放弃看过解答之后再答对的，不说「没看提示就答对了」
  const solved = solvedBeforeGivingUp(practice);

  const giveUp = (): void => {
    recordAttempt(key, '', 'gave-up');
    setConfirmGiveUp(false);
    setFeedback({ kind: 'gave-up', text: '已放弃，看看下面的解答。', nonce: Date.now() });
  };

  return (
    <article className={`problem problem-${problem.tier}${feedback?.kind === 'correct' ? ' problem-just-solved' : ''}`} id={`problem-${problem.id}`}>
      <header className="problem-head">
        <span className={`tier tier-${problem.tier}`}>{TIER_LABELS[problem.tier]}</span>
        <span className="problem-number">第 {index + 1} 题</span>
        <span className="problem-kind">{answerKind(problem)}</span>
        {a && <FirstResultBadge result={firstResult(practice)} />}
      </header>
      <div className="problem-statement">
        <Rich value={problem.statement} />
      </div>

      {a?.type === 'choice' && <ChoiceForm answer={a} onSubmit={submit} />}
      {a && a.type !== 'choice' && <NumericForm answer={a} problem={problem} onSubmit={submit} />}
      <FeedbackLine feedback={feedback} />

      <div className="hints">
        {problem.hints.slice(0, practice.hintsShown).map((hint, i) => (
          <div key={i} className="hint">
            <div className="hint-label">
              提示 {i + 1} · {HINT_NAMES[i]}
            </div>
            <div className="hint-body">
              <Rich value={hint} />
            </div>
          </div>
        ))}
        <div className="problem-actions">
          {practice.hintsShown < 3 && (
            <button type="button" className="hint-button" onClick={() => revealHint(key)}>
              看提示 {practice.hintsShown + 1}：{HINT_NAMES[practice.hintsShown]}
            </button>
          )}
          {a && !unlocked && !confirmGiveUp && (
            <button type="button" className="giveup-button" onClick={() => setConfirmGiveUp(true)}>
              放弃，看解答
            </button>
          )}
          {a && !unlocked && confirmGiveUp && (
            <span className="giveup-confirm">
              放弃会记为答错，确定吗？
              <button type="button" className="giveup-button giveup-yes" onClick={giveUp}>
                确定放弃
              </button>
              <button type="button" className="giveup-button" onClick={() => setConfirmGiveUp(false)}>
                再想想
              </button>
            </span>
          )}
        </div>
      </div>

      {a && unlocked && problem.solution && (
        <section className="solution" aria-label="解答">
          <div className="solution-label">
            解答
            {solved && (
              <span className="solution-note">
                {practice.hintsBeforeCorrect ? `答对前看了 ${practice.hintsBeforeCorrect} 级提示` : '没看提示就答对了'}
              </span>
            )}
          </div>
          <Rich value={problem.solution} />
        </section>
      )}
    </article>
  );
}

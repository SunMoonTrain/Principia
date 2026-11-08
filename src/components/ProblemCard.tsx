// 一道题。台阶 1 只显示题干和三级提示，不判题；点开一级才出现下一级的按钮。

import { useState } from 'react';
import type { Problem, Tier } from '../../shared/content-types';
import { Rich } from '../content/Rich';

const TIER_LABELS: Record<Tier, string> = { easy: '简单', medium: '中等', hard: '难', thinking: '思考' };
const HINT_NAMES = ['方向', '关键步骤', '完整解答'];
const OPTION_LABELS = 'ABCDEFGHIJ';

function answerKind(problem: Problem): string {
  const a = problem.answer;
  if (!a) return '写思路笔记，找 Claude 批改';
  switch (a.type) {
    case 'number':
      return '填一个数';
    case 'tuple':
      return '按顺序填一组数，用逗号隔开';
    case 'set':
      return '填一组数（不分顺序），用逗号隔开';
    case 'choice':
      return a.multiple ? '多选' : '单选';
  }
}

export function ProblemCard({ problem, index }: { problem: Problem; index: number }) {
  const [shown, setShown] = useState(0);
  const a = problem.answer;
  return (
    <article className={`problem problem-${problem.tier}`} id={`problem-${problem.id}`}>
      <header className="problem-head">
        <span className={`tier tier-${problem.tier}`}>{TIER_LABELS[problem.tier]}</span>
        <span className="problem-number">第 {index + 1} 题</span>
        <span className="problem-kind">{answerKind(problem)}</span>
      </header>
      <div className="problem-statement">
        <Rich value={problem.statement} />
      </div>
      {a?.type === 'choice' && (
        <ol className="problem-options">
          {a.options.map((option, i) => (
            <li key={i}>
              <span className="option-label">{OPTION_LABELS[i]}</span>
              <span className="option-body">
                <Rich value={option} />
              </span>
            </li>
          ))}
        </ol>
      )}
      {(a?.type === 'number' || a?.type === 'tuple' || a?.type === 'set') && a.unit && (
        <p className="problem-unit">
          单位：<Rich value={a.unit} />
        </p>
      )}
      <div className="hints">
        {problem.hints.slice(0, shown).map((hint, i) => (
          <div key={i} className="hint">
            <div className="hint-label">
              提示 {i + 1} · {HINT_NAMES[i]}
            </div>
            <div className="hint-body">
              <Rich value={hint} />
            </div>
          </div>
        ))}
        {shown < 3 && (
          <button type="button" className="hint-button" onClick={() => setShown(shown + 1)}>
            看提示 {shown + 1}：{HINT_NAMES[shown]}
          </button>
        )}
      </div>
    </article>
  );
}

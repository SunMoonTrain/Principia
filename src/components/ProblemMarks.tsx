// 任何题都能做的标记：「没把握」（做对了但心虚）和「内容有误」（题目或答案可能错了）。见 docs/plan.md「题目与判题」。

import { useRef } from 'react';
import { laterTimestamp, type ProblemProgress } from '../../shared/progress';
import { useLessonContext } from '../content/LessonContext';
import { partOf, rangeText, selectionWithin } from '../content/selectionText';
import { useProgress } from '../progress/ProgressContext';
import { useReportIssue } from './IssueReporter';

export function ProblemMarks({ problem, record }: { problem: string; record: ProblemProgress | undefined }) {
  const { lessonId } = useLessonContext();
  const progress = useProgress();
  const report = useReportIssue();
  const self = useRef<HTMLDivElement>(null);
  const unsure = record?.unsure === true;

  const toggleUnsure = (): void =>
    progress.dispatch({ type: 'unsure', lesson: lessonId ?? '', problem, value: !unsure, at: laterTimestamp(record?.unsureAt) });

  const reportIssue = (): void => {
    // 先在这道题里选中了文字的话，记下选中的原文和它在题目的哪一部分
    const range = selectionWithin(self.current?.closest('[data-problem]') ?? null);
    report(range ? { part: partOf(range.startContainer), quote: rangeText(range) } : { part: problem });
  };

  return (
    <div className="problem-marks" ref={self}>
      <button type="button" className={unsure ? 'mark mark-on' : 'mark'} aria-pressed={unsure} onClick={toggleUnsure} title="做对了但心虚：会进复习列表">
        {unsure ? '✓ 没把握' : '没把握'}
      </button>
      <button
        type="button"
        className="mark"
        // 按下时不让题目里的选区消失
        onMouseDown={(e) => e.preventDefault()}
        onClick={reportIssue}
        title="题目或答案可能有错：可以先选中有问题的文字再点"
      >
        内容有误
      </button>
    </div>
  );
}

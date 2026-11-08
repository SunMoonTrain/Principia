// 复习列表：标了「没把握」的、答错过的、看过提示的题（见 docs/plan.md「题目与判题」）。
// 可以手动移出；移出以后又答错、又看提示或又标「没把握」时重新回来。列表由进度算出来，不另存。

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import type { DomainPack, Tier } from '../../shared/content-types';
import { domainOf, lessonPath, PROBLEM_IDS, TIER_ORDER } from '../../shared/ids';
import { lastActivity, localTimestamp, reviewReasons, type ReviewReason } from '../../shared/progress';
import { useContent } from '../content/ContentContext';
import { Rich } from '../content/Rich';
import { useProgress } from '../progress/ProgressContext';

const REASON_LABELS: Record<ReviewReason, string> = { unsure: '没把握', wrong: '答错过', hints: '看过提示' };
const TIER_LABELS: Record<Tier, string> = { easy: '简单', medium: '中等', hard: '难', thinking: '思考' };

export interface ReviewItem {
  lesson: string;
  problem: string;
  /** 题号的序号（p1 → 0）。 */
  index: number;
  tier: Tier;
  reasons: ReviewReason[];
  /** 最近一次有动静的时间，列表按它从新到旧排。 */
  last: number;
}

export function useReviewItems(): ReviewItem[] {
  const { lessons } = useContent();
  const progress = useProgress();
  return useMemo(() => {
    const items: ReviewItem[] = [];
    for (const [lesson, problems] of Object.entries(progress.state.problems)) {
      const info = lessons.get(lesson);
      // 内容里已经没有这一节（或退回了待写）的不列
      if (!info || info.status === 'outline') continue;
      for (const [problem, record] of Object.entries(problems)) {
        const index = (PROBLEM_IDS as readonly string[]).indexOf(problem);
        if (index < 0) continue;
        const reasons = reviewReasons(record);
        if (reasons.length) items.push({ lesson, problem, index, tier: TIER_ORDER[index], reasons, last: lastActivity(record) });
      }
    }
    return items.sort((a, b) => b.last - a.last);
  }, [lessons, progress.state.problems]);
}

export function ReviewPage() {
  const { graph, lessons, domains, loadPack } = useContent();
  const progress = useProgress();
  const items = useReviewItems();
  const [packs, setPacks] = useState<Record<string, DomainPack>>({});

  // 题干在各领域的内容包里
  const neededDomains = [...new Set(items.map((i) => domainOf(i.lesson)))].sort().join(',');
  useEffect(() => {
    let cancelled = false;
    for (const id of neededDomains.split(',').filter(Boolean)) {
      const domain = domains.get(id);
      if (!domain) continue;
      loadPack(domain).then(
        (pack) => !cancelled && setPacks((p) => ({ ...p, [id]: pack })),
        () => undefined,
      );
    }
    return () => {
      cancelled = true;
    };
  }, [neededDomains, domains, loadPack]);

  if (!graph) return <p className="page-message">正在读取内容…</p>;

  // 按小节分组，小节的顺序跟着组里最近的那道题
  const groups = new Map<string, ReviewItem[]>();
  for (const item of items) groups.set(item.lesson, [...(groups.get(item.lesson) ?? []), item]);

  const dismiss = (item: ReviewItem): void =>
    progress.dispatch({ type: 'review-dismiss', lesson: item.lesson, problem: item.problem, at: localTimestamp() });

  return (
    <div className="review">
      <h1 className="home-title">复习列表</h1>
      <p className="home-lead">
        标了「没把握」的、答错过的、看过提示的题。复习完点「移出」；之后又答错、又看提示或又标「没把握」时，会重新回到这里。
      </p>
      {items.length === 0 && <p className="review-empty">现在没有要复习的题。</p>}
      {[...groups].map(([lesson, list]) => (
        <section key={lesson} className="review-group">
          <h2 className="review-lesson">
            <Link to={lessonPath(lesson)}>
              <Rich value={lessons.get(lesson)?.title} inert />
            </Link>
          </h2>
          <ol className="review-list">
            {[...list]
              .sort((a, b) => a.index - b.index)
              .map((item) => {
                const problem = packs[domainOf(lesson)]?.lessons[lesson]?.problems[item.index];
                return (
                  <li key={item.problem} className={`review-item problem-${item.tier}`}>
                    <div className="problem-head">
                      <span className={`tier tier-${item.tier}`}>{TIER_LABELS[item.tier]}</span>
                      <span className="problem-number">第 {item.index + 1} 题</span>
                      {item.reasons.map((r) => (
                        <span key={r} className={`review-reason review-reason-${r}`}>
                          {REASON_LABELS[r]}
                        </span>
                      ))}
                    </div>
                    {problem && (
                      <div className="review-statement">
                        <Rich value={problem.statement} inert />
                      </div>
                    )}
                    <div className="problem-actions">
                      <Link className="hint-button" to={lessonPath(lesson, `problem-${item.problem}`)}>
                        去做这道题
                      </Link>
                      <button type="button" className="giveup-button" onClick={() => dismiss(item)}>
                        移出
                      </button>
                    </div>
                  </li>
                );
              })}
          </ol>
        </section>
      ))}
    </div>
  );
}

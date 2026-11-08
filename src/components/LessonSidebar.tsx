// 小节页左侧的目录栏（宽屏才显示）：上面是这一节的目录，跟着滚动高亮当前位置；下面是同一领域的所有小节。

import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { GraphLesson, Rich as RichValue, Tier } from '../../shared/content-types';
import { lessonPath } from '../../shared/ids';
import { useContent } from '../content/ContentContext';
import { Rich } from '../content/Rich';
import { StatusBadge } from './StatusBadge';

export interface OutlineItem {
  id: string;
  /** 文字标题，或三级标题渲染好的内容（可能含公式）。 */
  label: string | RichValue;
  depth: 1 | 2;
  tier?: Tier;
}

/** 当前读到哪一项：顶端已经越过阅读线（视口上方 140px）的最后一项。 */
function useActiveId(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join('|');
  useEffect(() => {
    let frame = 0;
    const update = (): void => {
      frame = 0;
      let current: string | null = ids[0] ?? null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= 140) current = id;
        else break;
      }
      // 滚到底时最后一项可能永远到不了阅读线
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) current = ids[ids.length - 1] ?? current;
      setActive(current);
    };
    const schedule = (): void => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
    // ids 的内容由 key 代表，只在目录变了时重新订阅
  }, [key]);
  return active;
}

export function LessonSidebar({ lesson, outline }: { lesson: GraphLesson; outline: OutlineItem[] }) {
  const { graph, domains } = useContent();
  const active = useActiveId(outline.map((item) => item.id));
  // 读到某道题时，列表里高亮它所在的「8 道题」
  let activeInList: string | null = null;
  let lastSection: string | null = null;
  for (const item of outline) {
    if (item.depth === 1) lastSection = item.id;
    if (item.id === active) activeInList = item.tier ? lastSection : item.id;
  }
  const domain = domains.get(lesson.domain);
  const siblings = (graph?.lessons ?? []).filter((l) => l.domain === lesson.domain);

  return (
    <aside className="lesson-sidebar" aria-label="目录">
      {outline.length > 0 && (
        <nav className="toc" aria-label="本节目录">
          <div className="toc-title">本节目录</div>
          <ol className="toc-list">
            {outline
              .filter((item) => !item.tier)
              .map((item) => (
                <li key={item.id} className={`toc-item toc-depth-${item.depth}${item.id === activeInList ? ' toc-active' : ''}`}>
                  <Link to={`#${item.id}`} aria-current={item.id === activeInList ? 'location' : undefined}>
                    <span className="toc-label">{typeof item.label === 'string' ? item.label : <Rich value={item.label} inert />}</span>
                  </Link>
                </li>
              ))}
          </ol>
          {/* 8 道题排成一行小圆点，颜色是难度档，省地方 */}
          <ol className="toc-problems">
            {outline
              .filter((item) => item.tier)
              .map((item, i) => (
                <li key={item.id}>
                  <Link
                    to={`#${item.id}`}
                    className={`toc-problem tier-dot-${item.tier}${item.id === active ? ' toc-problem-active' : ''}`}
                    title={typeof item.label === 'string' ? item.label : undefined}
                    aria-label={typeof item.label === 'string' ? item.label : undefined}
                    aria-current={item.id === active ? 'location' : undefined}
                  >
                    {i + 1}
                  </Link>
                </li>
              ))}
          </ol>
        </nav>
      )}
      <nav className="toc toc-lessons" aria-label="同领域的小节">
        <div className="toc-title">
          <Rich value={domain?.title} inert /> · {siblings.length} 节
        </div>
        <ol className="toc-list">
          {siblings.map((l) => (
            <li key={l.id} className={l.id === lesson.id ? 'toc-lesson toc-lesson-current' : 'toc-lesson'}>
              <Link to={lessonPath(l.id)} aria-current={l.id === lesson.id ? 'page' : undefined}>
                <span className="toc-level" title="层级">
                  {l.level}
                </span>
                <span className="toc-lesson-title">
                  <Rich value={l.title} inert />
                </span>
              </Link>
              <StatusBadge status={l.status} />
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}

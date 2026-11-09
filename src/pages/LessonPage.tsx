// 小节页：按固定顺序显示 7 个必选部分（根节点没有前置回顾）和可选的常见误区，
// 见 docs/plan.md「每节固定结构与写作规范」。前置回顾、一句话总结、8 道题由数据自动生成。
// 宽屏时左侧有目录栏，窄屏（iPad 竖屏）改成顶部的一行目录。

import { useEffect, useLayoutEffect, type ReactNode } from 'react';
import { Link, useLocation, useParams } from 'react-router';
import type { GraphLesson, LessonContent, Rich as RichValue } from '../../shared/content-types';
import { lessonPath } from '../../shared/ids';
import { missingPrereqs, nodeState } from '../../shared/node-state';
import { TIER_LABELS } from '../../shared/problem-text';
import { laterTimestamp, localTimestamp } from '../../shared/progress';
import { SectionKindContext } from '../components/AnchorBlock';
import { IssueReporter } from '../components/IssueReporter';
import { LessonSidebar, type OutlineItem } from '../components/LessonSidebar';
import { ProblemCard } from '../components/ProblemCard';
import { StatusBadge } from '../components/StatusBadge';
import { useContent, useDomainPack } from '../content/ContentContext';
import { LessonContext } from '../content/LessonContext';
import { Rich } from '../content/Rich';
import { useLessonNotes } from '../progress/notes';
import { useProgress } from '../progress/ProgressContext';
import { subjectTitle } from '../subjects';
import { NotFoundPage } from './NotFoundPage';

const PROOF_POLICY: Record<string, string> = { sketch: '讲解只给证明思路', full: '讲解给完整证明' };
const NO_MACROS: Record<string, string> = {};

function Section({ id, title, auto, children }: { id: string; title: string; auto?: boolean; children: ReactNode }) {
  return (
    // data-part：「内容有误」记下选中的文字在哪一部分
    <section
      className={auto ? 'lesson-section lesson-section-auto' : 'lesson-section'}
      id={`section-${id}`}
      aria-labelledby={`section-${id}-title`}
      data-part={title}
    >
      <h2 className="lesson-section-title" id={`section-${id}-title`}>
        {title}
      </h2>
      <div className="lesson-section-body">{children}</div>
    </section>
  );
}

function PrereqReview({ lesson }: { lesson: GraphLesson }) {
  const { lessons } = useContent();
  return (
    <ul className="prereq-list">
      {lesson.prerequisites.map((id) => {
        const p = lessons.get(id);
        if (!p) return null;
        const outline = p.status === 'outline';
        return (
          <li key={id}>
            <Link to={lessonPath(id)} className="prereq-title">
              <Rich value={p.title} />
            </Link>
            {outline && <span className="badge badge-outline">待写</span>}
            <span className="prereq-text">
              ：<Rich value={outline ? p.goal : (p.summary ?? p.goal)} />
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** 一个部分里的三级标题（编译器给它们编了 id）。 */
function subheadings(section: RichValue | null): OutlineItem[] {
  const items: OutlineItem[] = [];
  for (const node of section?.children ?? []) {
    if (node.type !== 'element' || node.tagName !== 'h3' || typeof node.properties.id !== 'string') continue;
    items.push({ id: node.properties.id, label: { type: 'root', children: node.children }, depth: 2 });
  }
  return items;
}

/** 这一节的目录：各部分，加上讲解、例题等部分里的三级标题，和 8 道题。 */
function buildOutline(lesson: GraphLesson, content: LessonContent | null): OutlineItem[] {
  if (!content) {
    return lesson.prerequisites.length ? [{ id: 'section-prerequisites', label: '前置回顾', depth: 1 }] : [];
  }
  const { sections } = content;
  const part = (key: string, label: string, sub: RichValue | null = null): OutlineItem[] => [
    { id: `section-${key}`, label, depth: 1 },
    ...subheadings(sub),
  ];
  return [
    ...part('question', '这一节要回答的问题', sections.question),
    ...(lesson.prerequisites.length ? part('prerequisites', '前置回顾') : []),
    ...part('explanation', '讲解', sections.explanation),
    ...part('picture', '几何图像', sections.picture),
    ...part('examples', '例题', sections.examples),
    ...part('summary', '一句话总结'),
    ...(sections.misconceptions ? part('misconceptions', '常见误区', sections.misconceptions) : []),
    ...part('problems', '8 道题'),
    ...content.problems.map((p, i): OutlineItem => ({ id: `problem-${p.id}`, label: `第 ${i + 1} 题 · ${TIER_LABELS[p.tier]}`, depth: 2, tier: p.tier })),
  ];
}

/** 窄屏时顶部的一行目录（宽屏改用左侧目录栏）。 */
function SectionNav({ outline }: { outline: OutlineItem[] }) {
  const short: Record<string, string> = { 'section-question': '问题' };
  return (
    <nav className="section-nav" aria-label="本节目录">
      {outline
        .filter((item) => item.depth === 1)
        .map((item) => (
          <Link key={item.id} to={`#${item.id}`}>
            {short[item.id] ?? (item.label as string)}
          </Link>
        ))}
    </nav>
  );
}

/** 「11 月 8 日 16:10」 */
function shortTime(at: string | undefined): string {
  if (!at) return '';
  const d = new Date(at);
  return `${d.getMonth() + 1} 月 ${d.getDate()} 日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** 改这一节的学习状态（学完、已会、撤销）；时间至少比现有的晚 1 秒，同一秒连点两下也算数。 */
function useSetLessonStatus(lesson: GraphLesson): (status: 'completed' | 'known' | 'none') => void {
  const progress = useProgress();
  const record = progress.state.lessons[lesson.id];
  return (status) => progress.dispatch({ type: 'lesson-status', lesson: lesson.id, status, at: laterTimestamp(record?.statusAt) });
}

/** 页尾的「这节学完了」，可以撤销。这一节写好以前标过「已会」的，也在这里显示，可以撤销。 */
function LessonDone({ lesson }: { lesson: GraphLesson }) {
  const progress = useProgress();
  const record = progress.state.lessons[lesson.id];
  const done = record?.status === 'completed';
  const set = useSetLessonStatus(lesson);
  return (
    <section className={done ? 'lesson-done lesson-done-yes' : 'lesson-done'} aria-label="学完这一节">
      {done ? (
        <>
          <span className="lesson-done-text">
            <span className="lesson-done-check" aria-hidden="true">
              ✓
            </span>
            这节学完了<span className="lesson-done-time">（{shortTime(record.statusAt)}）</span>
          </span>
          <button type="button" className="giveup-button" onClick={() => set('none')}>
            撤销
          </button>
        </>
      ) : record?.status === 'known' ? (
        <>
          <span className="lesson-done-text">
            这一节写好以前你标过「已会」<span className="lesson-done-time">（{shortTime(record.statusAt)}）</span>
          </span>
          <button type="button" className="answer-submit" onClick={() => set('completed')}>
            这节学完了
          </button>
          <button type="button" className="giveup-button" onClick={() => set('none')}>
            撤销「已会」
          </button>
        </>
      ) : (
        <>
          <span className="lesson-done-text">讲解读完、题做完了，就标记一下。</span>
          <button type="button" className="answer-submit" onClick={() => set('completed')}>
            这节学完了
          </button>
        </>
      )}
    </section>
  );
}

function WrittenLesson({ lesson, content }: { lesson: GraphLesson; content: LessonContent }) {
  const { sections } = content;
  return (
    <>
      <Section id="question" title="这一节要回答的问题">
        <div className="prose prose-lead">
          <Rich value={sections.question} />
        </div>
      </Section>
      {lesson.prerequisites.length > 0 && (
        <Section id="prerequisites" title="前置回顾" auto>
          <PrereqReview lesson={lesson} />
        </Section>
      )}
      <Section id="explanation" title="讲解">
        <div className="prose">
          {/* 讲解里带锚点的定义段落显示成卡片 */}
          <SectionKindContext.Provider value="explanation">
            <Rich value={sections.explanation} />
          </SectionKindContext.Provider>
        </div>
      </Section>
      <Section id="picture" title="几何图像">
        <div className="prose">
          <Rich value={sections.picture} />
        </div>
      </Section>
      <Section id="examples" title="例题">
        <div className="prose">
          <Rich value={sections.examples} />
        </div>
      </Section>
      <Section id="summary" title="一句话总结" auto>
        <p className="summary-text">
          <Rich value={lesson.summary} />
        </p>
      </Section>
      {sections.misconceptions && (
        <Section id="misconceptions" title="常见误区">
          <div className="prose">
            <Rich value={sections.misconceptions} />
          </div>
        </Section>
      )}
      <Section id="problems" title="8 道题" auto>
        <div className="problem-list">
          {content.problems.map((p, i) => (
            <ProblemCard key={p.id} problem={p} index={i} />
          ))}
        </div>
      </Section>
      <LessonDone lesson={lesson} />
    </>
  );
}

/** 「够不着」的小节（写好了，但还有前置既没学完也没标「已会」）：页面顶上提示缺哪些前置，仍然可以往下读。 */
function MissingPrereqs({ lesson }: { lesson: GraphLesson }) {
  const progress = useProgress();
  const { lessons } = useContent();
  const missing = missingPrereqs(lesson, progress.state);
  return (
    <div className="missing-prereqs" role="note">
      这一节还够不着：前置
      {missing.map((id, i) => {
        const p = lessons.get(id);
        return (
          <span key={id}>
            {i > 0 && '、'}「
            <Link to={lessonPath(id)}>{p ? <Rich value={p.title} inert /> : id}</Link>」
            {p?.status === 'outline' && <span className="missing-prereqs-note">（待写，会了可以标「已会」）</span>}
          </span>
        );
      })}
      还没学完。可以先回去学，也可以直接往下读。
    </div>
  );
}

/** 待写的小节：「我已经会了」，标了以后这一节算学过（星图上点亮，后面的小节可学），可以撤销。 */
function KnownButton({ lesson }: { lesson: GraphLesson }) {
  const progress = useProgress();
  const record = progress.state.lessons[lesson.id];
  const set = useSetLessonStatus(lesson);
  if (record?.status === 'known') {
    return (
      <div className="known-row known-row-yes">
        <span>
          <span className="lesson-done-check" aria-hidden="true">
            ✓
          </span>
          你标了「已会」<span className="lesson-done-time">（{shortTime(record.statusAt)}）</span>，后面以它为前置的小节可以学了。
        </span>
        <button type="button" className="giveup-button" onClick={() => set('none')}>
          撤销
        </button>
      </div>
    );
  }
  return (
    <div className="known-row">
      <span>这些你已经会了的话，标一下，后面以它为前置的小节就可以学了。</span>
      <button type="button" className="answer-submit" onClick={() => set('known')}>
        我已经会了
      </button>
    </div>
  );
}

function OutlineLesson({ lesson }: { lesson: GraphLesson }) {
  return (
    <>
      <div className="outline-note">
        <p>
          这一节还没写，只有目录。它要做到的是：
          <strong>
            <Rich value={lesson.goal} />
          </strong>
        </p>
        <KnownButton lesson={lesson} />
      </div>
      {lesson.prerequisites.length > 0 && (
        <Section id="prerequisites" title="前置回顾" auto>
          <PrereqReview lesson={lesson} />
        </Section>
      )}
    </>
  );
}

/** 跳到地址里 # 后面的位置（目录栏、术语浮窗的链接），没有就回到顶部。定义段落跳过去后高亮一下。 */
function useScrollToHash(ready: boolean): void {
  const location = useLocation();
  useLayoutEffect(() => {
    if (!ready) return;
    const hash = decodeURIComponent(location.hash.replace(/^#/, ''));
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const target = document.querySelector<HTMLElement>(`[data-anchor="${CSS.escape(hash)}"]`) ?? document.getElementById(hash);
    if (!target) return;
    // 滚动停下来以后再高亮，不然长距离滚动时高亮在半路就褪完了
    let flashed = !target.matches('[data-anchor]');
    const flash = (): void => {
      if (flashed) return;
      flashed = true;
      window.removeEventListener('scrollend', flash);
      target.classList.remove('anchor-flash');
      void target.offsetWidth; // 重新触发高亮动画
      target.classList.add('anchor-flash');
    };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.addEventListener('scrollend', flash);
    const timer = window.setTimeout(flash, reduce ? 0 : 1000);
    target.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scrollend', flash);
    };
  }, [location.key, location.hash, ready]);
}

export function LessonPage() {
  const { id = '' } = useParams();
  const { graph, lessons, domains, error } = useContent();
  const lesson = lessons.get(id);
  const domain = lesson ? domains.get(lesson.domain) : undefined;
  const { pack, error: packError } = useDomainPack(lesson?.domain);
  const content = pack?.lessons[id] ?? null;
  const ready = !!lesson && (lesson.status === 'outline' || !!content);
  useScrollToHash(ready);

  // 记下第一次打开这一节的时间（只记写好了的小节）
  const progress = useProgress();
  const startedAt = progress.state.lessons[id]?.startedAt;
  const writtenLesson = !!lesson && lesson.status !== 'outline';
  const { dispatch, ready: progressReady } = progress;
  useEffect(() => {
    if (progressReady && writtenLesson && !startedAt) dispatch({ type: 'lesson-open', lesson: id, at: localTimestamp() });
  }, [progressReady, writtenLesson, startedAt, id, dispatch]);
  const done = progress.state.lessons[id]?.status === 'completed';
  const known = progress.state.lessons[id]?.status === 'known';
  // 难题、思考题的思路笔记
  useLessonNotes(writtenLesson ? id : null);

  useEffect(() => {
    if (lesson) document.title = `${lesson.titleText} · Principia`;
    return () => {
      document.title = 'Principia';
    };
  }, [lesson]);

  if (error && !graph) return <p className="page-message">读不到内容：{error}</p>;
  if (!graph) return <p className="page-message">正在读取内容…</p>;
  if (!lesson || !domain) return <NotFoundPage what={`小节「${id}」`} />;

  const outline = buildOutline(lesson, lesson.status === 'outline' ? null : content);
  return (
    <LessonContext.Provider value={{ lessonId: lesson.id, glossary: pack?.glossary ?? {}, macros: pack?.macros ?? NO_MACROS }}>
      {/* 换小节时整页重新挂载：每节的题号都是 p1…p8、动画组件也常同类，不重新挂载会带着上一节的输入、判题结果和滑块 */}
      <IssueReporter key={lesson.id} lesson={lesson.id}>
        <div className="lesson-layout">
          <LessonSidebar lesson={lesson} outline={outline} />
          <article className="lesson">
            <header className="lesson-head">
              <div className="lesson-crumbs">
                <Link to="/">{subjectTitle(lesson.subject)}</Link>
                <span aria-hidden="true">／</span>
                <span>
                  <Rich value={domain.title} />
                </span>
              </div>
              <h1 className="lesson-title">
                <Rich value={lesson.title} />
                <StatusBadge status={lesson.status} />
                {done && <span className="badge badge-done">已学完</span>}
                {known && <span className="badge badge-known">已会</span>}
              </h1>
              <div className="lesson-meta">
                <span>层级 {lesson.level}</span>
                {lesson.minutes !== null && <span>约 {lesson.minutes} 分钟（不含做题）</span>}
                {lesson.status !== 'outline' && <span>{PROOF_POLICY[content?.proofPolicy ?? domain.proofPolicy]}</span>}
              </div>
            </header>
            {nodeState(lesson, progress.state) === 'locked' && <MissingPrereqs lesson={lesson} />}
            {lesson.status === 'outline' ? (
              <OutlineLesson lesson={lesson} />
            ) : content ? (
              <>
                <SectionNav outline={outline} />
                <WrittenLesson lesson={lesson} content={content} />
              </>
            ) : (
              <p className="page-message">{packError ? `读不到内容包：${packError}` : '正在读取这一节…'}</p>
            )}
          </article>
        </div>
      </IssueReporter>
    </LessonContext.Provider>
  );
}

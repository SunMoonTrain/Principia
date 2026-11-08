// 术语浮窗，见 docs/plan.md「术语浮窗」。
// 电脑上鼠标悬停弹出；点一下术语会把浮窗固定住。iPad 上点一下弹出，点浮窗外面关闭。
// 点术语本身不跳转，只有点浮窗里的链接才跳转。

import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import type { TermEntry } from '../../shared/content-types';
import { lessonPath } from '../../shared/ids';
import { useContent } from '../content/ContentContext';
import { useLessonContext } from '../content/LessonContext';
import { Rich } from '../content/Rich';
import { useProgress } from '../progress/useProgress';

function TermCard({ term, onNavigate }: { term: TermEntry; onNavigate: () => void }) {
  const { lessons } = useContent();
  const { lessonId } = useLessonContext();
  const progress = useProgress();
  const target = lessons.get(term.definedIn);
  const outline = target?.status === 'outline';
  const here = term.definedIn === lessonId;
  return (
    <>
      <div className="term-card-name">
        <strong>
          <Rich value={term.zh} />
        </strong>
        <span className="term-card-en">
          （<Rich value={term.en} />
          {term.abbr && (
            <>
              ，<Rich value={term.abbr} />
            </>
          )}
          ）
        </span>
      </div>
      <div className="term-card-brief">
        <Rich value={term.brief} />
      </div>
      {target && (
        <div className="term-card-link">
          <Link
            to={outline ? lessonPath(term.definedIn) : lessonPath(term.definedIn, term.anchor)}
            state={{ scrollNonce: Date.now() }}
            onClick={onNavigate}
          >
            在《{target.titleText}》中定义
          </Link>
          {outline && <span className="badge badge-outline">待写</span>}
        </div>
      )}
      {target && !here && !progress.isLearned(target.id) && (
        <div className="term-card-note">这是第 {target.level + 1} 层才讲的，你还没学到</div>
      )}
    </>
  );
}

export function TermRef(props: { 'data-term-id'?: string; children?: ReactNode }) {
  const { glossary } = useLessonContext();
  const term = props['data-term-id'] ? glossary[props['data-term-id']] : undefined;
  const [open, setOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
    middleware: [offset(6), flip({ padding: 8 }), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });
  const hover = useHover(context, { mouseOnly: true, delay: { open: 120, close: 120 }, handleClose: safePolygon() });
  const click = useClick(context, { toggle: false });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'dialog' });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, click, dismiss, role]);

  // 构建已经保证术语都在术语表里；内容包还没读回来时先按普通文字显示
  if (!term) return <span>{props.children}</span>;
  return (
    <>
      <span ref={refs.setReference} className={open ? 'term term-open' : 'term'} tabIndex={0} {...getReferenceProps()}>
        {props.children}
      </span>
      {open && (
        <FloatingPortal>
          <div ref={refs.setFloating} style={floatingStyles} className="term-card" {...getFloatingProps()}>
            <TermCard term={term} onNavigate={() => setOpen(false)} />
          </div>
        </FloatingPortal>
      )}
    </>
  );
}

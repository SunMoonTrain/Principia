// 带锚点的段落（下定义的那一段）。在「讲解」里显示成定义卡片，卡片上方标出这一段定义的术语；
// 别的部分里只是普通的一段，供术语浮窗、小节链接跳转过来。

import { createContext, useContext, type ReactNode } from 'react';
import { useLessonContext } from '../content/LessonContext';
import { Rich } from '../content/Rich';

/** 当前在小节页的哪个部分（只有「讲解」里的锚点段落显示成卡片）。 */
export const SectionKindContext = createContext<string | null>(null);

export function AnchorBlock(props: { 'data-anchor'?: string; children?: ReactNode }) {
  const id = props['data-anchor'] ?? '';
  const section = useContext(SectionKindContext);
  const { glossary, lessonId } = useLessonContext();
  if (section !== 'explanation') {
    return (
      <div className="anchor-target" data-anchor={id}>
        {props.children}
      </div>
    );
  }
  // 这一段定义了哪些术语：术语表里定义在本节、锚点是这一段的
  const terms = Object.values(glossary).filter((t) => t.definedIn === lessonId && t.anchor === id);
  return (
    <div className="anchor-target def-card" data-anchor={id}>
      {terms.length > 0 && (
        <div className="def-card-label">
          {terms.map((t, i) => (
            <span key={t.id}>
              {i > 0 && <span className="def-card-sep">·</span>}
              <Rich value={t.zh} inert />
            </span>
          ))}
        </div>
      )}
      {props.children}
    </div>
  );
}

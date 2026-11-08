// 动画组件画廊（/gallery）：packages/anim 的演示页，也是测试页。按需加载。
// 演示里滑块标签、图例的公式用笔记预览的那一套（KaTeX）在浏览器里排版，交给画廊的 renderLabel。

import { Gallery } from '@principia/anim';
import { useEffect, type ReactNode } from 'react';
import { Rich } from '../content/Rich';
import { renderNote } from '../notes/renderNote';

function renderLabel(src: string): ReactNode {
  const root = renderNote(src, {});
  const p = root.children.find((c) => c.type === 'element' && c.tagName === 'p');
  return <Rich value={{ type: 'root', children: p?.type === 'element' ? p.children : [] }} />;
}

export default function GalleryPage() {
  useEffect(() => {
    document.title = '动画组件画廊 · Principia';
    return () => {
      document.title = 'Principia';
    };
  }, []);
  return (
    <div className="gallery-page">
      <h1>动画组件画廊</h1>
      <p className="gallery-lead">
        packages/anim 里已经实现的组件，每个一个演示，也是测试页。参数和小节里 :::anim 块的写法一样，展开「写法」可以看到；完整说明见
        docs/plan.md「附录：动画组件参数」。
      </p>
      <Gallery renderLabel={renderLabel} />
    </div>
  );
}

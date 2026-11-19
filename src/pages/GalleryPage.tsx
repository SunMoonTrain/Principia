// 动画组件画廊（/gallery）：packages/anim 的演示页，也是测试页。按需加载。
// 演示里滑块标签、图例的公式用笔记预览的那一套（KaTeX）在浏览器里排版，交给画廊的 renderLabel。

import { Gallery } from '@principia/anim/gallery';
import { lazy, Suspense, useEffect, type ReactNode } from 'react';
import type { Problem } from '../../shared/content-types';
import { ProblemCard } from '../components/ProblemCard';
import { Rich } from '../content/Rich';
import { renderNote } from '../notes/renderNote';

declare const __P8_DEMO_PROBLEM__: Problem;
const GalleryDemo = lazy(() => import('@principia/sim/gallery'));

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
        展开动画下方的「写法」可以看到小节里的参数；计算机模拟器一栏可以试步进与回退。完整说明见
        docs/plan.md「附录：动画组件参数」。
      </p>
      <Gallery renderLabel={renderLabel} />
      <section className="anim-demo" aria-labelledby="cs-simulators">
        <h2 id="cs-simulators">计算机模拟器</h2>
        <Suspense fallback={<p>正在加载模拟器…</p>}><GalleryDemo /></Suspense>
        <h3>编程练习 · 两个输入相加</h3>
        <ProblemCard problem={__P8_DEMO_PROBLEM__} index={2} practice />
      </section>
    </div>
  );
}

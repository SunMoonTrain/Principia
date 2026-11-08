// 静态图：把小节目录下的 SVG 内联进页面，这样图里的 currentColor 能跟着亮色 / 暗色主题变。
// 内联后同一页上几张图的 id 会互相冲突，所以给 id 统一加前缀。

import type { Element, ElementContent, Properties, Root } from 'hast';
import { fromHtml } from 'hast-util-from-html';
import type { Diagnostics } from './diagnostics.ts';
import { readText } from './fsutil.ts';

function elements(node: Root | Element, visit: (el: Element) => void): void {
  for (const child of node.children) {
    if (child.type === 'element') {
      visit(child);
      elements(child, visit);
    }
  }
}

function stripPositions(node: { position?: unknown; children?: unknown[] }): void {
  delete node.position;
  for (const child of node.children ?? []) stripPositions(child as { position?: unknown; children?: unknown[] });
}

export function loadSvg(file: string, prefix: string, alt: string, diags: Diagnostics, reportFile: string, line: number): Element | null {
  const tree = fromHtml(readText(file), { fragment: true });
  const svg = tree.children.find((c): c is Element => c.type === 'element' && c.tagName === 'svg');
  if (!svg) {
    diags.error(reportFile, line, `${prefix}：文件里没有 <svg> 元素`);
    return null;
  }
  const safePrefix = prefix.replace(/[^A-Za-z0-9-]/g, '-');
  const renamed = new Map<string, string>();
  let ok = true;

  elements(svg, (el) => {
    if (el.tagName === 'script' || el.tagName === 'foreignObject') {
      diags.error(reportFile, line, `SVG 里不能有 <${el.tagName}>`);
      ok = false;
    }
    for (const [key, value] of Object.entries(el.properties)) {
      if (/^on/i.test(key)) {
        diags.error(reportFile, line, `SVG 里不能有事件属性 ${key}`);
        ok = false;
      }
      if ((key === 'href' || key === 'xLinkHref') && typeof value === 'string' && !value.startsWith('#')) {
        diags.error(reportFile, line, `SVG 里不能引用外部资源：${value}`);
        ok = false;
      }
    }
    const id = el.properties.id;
    if (typeof id === 'string' && id) renamed.set(id, `${safePrefix}-${id}`);
  });
  if (!ok) return null;

  const rewrite = (value: string): string =>
    value.replace(/url\(\s*#([^)\s]+)\s*\)/g, (m, id: string) => (renamed.has(id) ? `url(#${renamed.get(id)})` : m));

  const fix = (el: Element): void => {
    const props: Properties = el.properties;
    for (const [key, value] of Object.entries(props)) {
      if (key === 'id' && typeof value === 'string') props.id = renamed.get(value) ?? value;
      else if ((key === 'href' || key === 'xLinkHref') && typeof value === 'string' && value.startsWith('#')) {
        props[key] = `#${renamed.get(value.slice(1)) ?? value.slice(1)}`;
      } else if (typeof value === 'string') props[key] = rewrite(value);
      else if (Array.isArray(value) && (key === 'ariaLabelledBy' || key === 'ariaDescribedBy')) {
        props[key] = value.map((v) => (typeof v === 'string' ? (renamed.get(v) ?? v) : String(v)));
      }
    }
    if (el.tagName === 'style') {
      el.children = el.children.map((c): ElementContent => {
        if (c.type !== 'text') return c;
        let text = rewrite(c.value);
        for (const [from, to] of renamed) text = text.replace(new RegExp(`#${from}(?![\\w-])`, 'g'), `#${to}`);
        return { ...c, value: text };
      });
    }
  };
  fix(svg);
  elements(svg, fix);

  // 注释、XML 声明之类不要
  const clean = (el: Element): void => {
    el.children = el.children.filter((c) => c.type !== 'comment');
    for (const c of el.children) if (c.type === 'element') clean(c);
  };
  clean(svg);

  const className = Array.isArray(svg.properties.className) ? svg.properties.className : [];
  svg.properties = {
    ...svg.properties,
    className: [...className, 'content-svg'],
    role: 'img',
    ariaLabel: alt || undefined,
  };
  stripPositions(svg as never);
  return svg;
}

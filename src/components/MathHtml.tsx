// 公式：构建时 KaTeX 已经编译成 HTML，这里原样放进去。

export function MathHtml(props: { 'data-html'?: string; 'data-display'?: string }) {
  const display = props['data-display'] === 'true';
  const html = { __html: props['data-html'] ?? '' };
  return display ? <span className="math math-display" dangerouslySetInnerHTML={html} /> : <span className="math" dangerouslySetInnerHTML={html} />;
}

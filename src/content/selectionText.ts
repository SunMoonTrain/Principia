// 「内容有误」要记下你选中的原文和它在哪一部分。页面上的公式是 KaTeX 排好的 HTML，
// 直接取文字会得到一堆拆散的符号；这里把公式换回 TeX 原文（KaTeX 在 MathML 的 annotation 里留了一份）。

function elementOf(node: Node): Element | null {
  return node instanceof Element ? node : node.parentElement;
}

const BLOCK_RE = /^(P|DIV|LI|H[1-6]|SECTION|ARTICLE|UL|OL|TR|BLOCKQUOTE|PRE|TABLE|FIGURE)$/;

function serialize(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? '';
  if (node instanceof Element) {
    if (node.classList.contains('katex')) {
      const tex = node.querySelector('annotation[encoding="application/x-tex"]')?.textContent ?? node.textContent ?? '';
      return node.parentElement?.classList.contains('katex-display') ? `\n$$${tex}$$\n` : `$${tex}$`;
    }
    if (node.tagName === 'BR') return '\n';
    if (node.getAttribute('aria-hidden') === 'true' || node.tagName === 'BUTTON' || node.tagName === 'svg') return '';
  }
  const inner = Array.from(node.childNodes).map(serialize).join('');
  return node instanceof Element && BLOCK_RE.test(node.tagName) ? `${inner}\n` : inner;
}

function tidy(text: string): string {
  return (
    text
      .replace(/[ \t ]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      // 去掉页面在公式和汉字之间自动加的空格，和内容文件里的写法一致，写内容 agent 好搜
      .replace(/(\p{Script=Han})[  ]+(?=\$)/gu, '$1')
      .replace(/(\$)[  ]+(?=\p{Script=Han})/gu, '$1')
      .trim()
  );
}

/** 一个元素里的文字，公式写回 $…$。 */
export function inlineText(el: Element): string {
  return tidy(serialize(el)).replace(/\s+/g, ' ');
}

/** 选中的文字，公式写回 $…$；选区的一端落在公式中间时，扩到整个公式。 */
export function rangeText(range: Range): string {
  const r = range.cloneRange();
  const startMath = elementOf(r.startContainer)?.closest('.katex');
  if (startMath) r.setStartBefore(startMath);
  const endMath = elementOf(r.endContainer)?.closest('.katex');
  if (endMath) r.setEndAfter(endMath);
  return tidy(serialize(r.cloneContents()));
}

/**
 * 选区在哪一部分：题目里是「p3 / 解答」（题号 / 题干、提示 N、解答、选项 X），
 * 正文里是部分标题，有三级标题时带上它，如「讲解 / 有理数轴上的洞」。
 */
export function partOf(node: Node): string {
  const el = elementOf(node);
  if (!el) return '正文';
  const problem = el.closest<HTMLElement>('[data-problem]');
  if (problem) {
    const sub = el.closest<HTMLElement>('[data-subpart]');
    return sub ? `${problem.dataset.problem} / ${sub.dataset.subpart}` : (problem.dataset.problem ?? '题目');
  }
  const section = el.closest<HTMLElement>('[data-part]');
  if (!section) return el.closest('.lesson-head') ? '标题' : '正文';
  // 这一部分里，选区前面最近的一个三级标题
  const heading = Array.from(section.querySelectorAll('h3'))
    .filter((h) => h.contains(el) || h.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING)
    .pop();
  return heading ? `${section.dataset.part} / ${inlineText(heading)}` : (section.dataset.part ?? '正文');
}

/** 当前选区（有的话）是否落在这个元素里。 */
export function selectionWithin(el: Element | null): Range | null {
  const selection = document.getSelection();
  if (!el || !selection || selection.isCollapsed || selection.rangeCount === 0) return null;
  const range = selection.getRangeAt(0);
  return el.contains(range.commonAncestorContainer) ? range : null;
}

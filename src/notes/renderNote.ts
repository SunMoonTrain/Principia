// 思路笔记的预览：Markdown + 公式，在浏览器里现算。和正文用同一套写法（GFM、$…$、$$…$$），
// 公式用 KaTeX 带上本领域的宏；写错的公式显示成红字，不影响别的部分。公式和汉字之间的空格规则和正文一致。
// 这个文件连同 KaTeX 一起按需加载（只有打开小节页、显示笔记时才下载）。

import type { Root } from 'hast';
import katex from 'katex';
import type { Root as MdRoot } from 'mdast';
import { toHast } from 'mdast-util-to-hast';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { keepPunctuationWithMath, spaceAroundMath, type InlineNode } from '../../shared/cjk-spacing';

const parser = unified().use(remarkParse).use(remarkGfm, { singleTilde: false }).use(remarkMath);

type Node = InlineNode & { position?: { start: { offset?: number } } };

/**
 * 单独成一段、写在同一行的 $$…$$ 也按行间公式显示（Markdown 只把单独占行的 $$ 围起来的才当行间公式，
 * 但写笔记时顺手写成一行很常见）。
 */
function aloneDoubleDollar(node: Node, src: string): boolean {
  const kids = node.children ?? [];
  const only = kids[0] as Node | undefined;
  const start = only?.position?.start.offset;
  return node.type === 'paragraph' && kids.length === 1 && only?.type === 'inlineMath' && start !== undefined && src.startsWith('$$', start);
}

function transform(node: Node, src: string, macros: Record<string, string>, display = false): void {
  if (node.type === 'inlineMath' || node.type === 'math') {
    display ||= node.type === 'math';
    const html = katex.renderToString(node.value ?? '', {
      displayMode: display,
      // KaTeX 会往 macros 里写 \gdef 定义的宏，每个公式给一份新的
      macros: { ...macros },
      throwOnError: false,
      strict: 'ignore',
      trust: false,
    });
    node.data = { hName: 'x-math', hProperties: display ? { dataHtml: html, dataDisplay: 'true' } : { dataHtml: html }, hChildren: [] };
    return;
  }
  if (!node.children) return;
  const alone = aloneDoubleDollar(node, src);
  for (const child of node.children) transform(child, src, macros, alone);
  if (!alone) node.children = keepPunctuationWithMath(spaceAroundMath(node.children));
}

export function renderNote(src: string, macros: Record<string, string>): Root {
  const tree = parser.runSync(parser.parse(src)) as unknown as Node;
  transform(tree, src, macros);
  // 原始 HTML 不显示（toHast 默认丢掉），笔记里写的标签不会变成页面元素
  return toHast(tree as unknown as MdRoot) as Root;
}

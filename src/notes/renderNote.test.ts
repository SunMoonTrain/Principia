import type { RootContent } from 'hast';
import { expect, it } from 'vitest';
import { renderNote } from './renderNote';

/** 简式：公式写成 $，链接 ⟨…⟩，强调 *…*，不折行的组 […]。 */
function outline(nodes: RootContent[]): string {
  return nodes
    .map((n) => {
      if (n.type === 'text') return n.value;
      if (n.type !== 'element') return '';
      const inner = outline(n.children);
      const marks: Record<string, string> = { 'x-math': '$', a: `⟨${inner}⟩`, em: `*${inner}*`, span: `[${inner}]` };
      return marks[n.tagName] ?? inner;
    })
    .join('');
}

it('笔记预览和正文同一套空格规则：链接、强调的边上是公式时，这一侧也和汉字留一个空格', () => {
  const root = renderNote('见[$f$](https://example.com)的图，设   *$x$*   是，[积分 $I$](https://example.com) 。', {});
  expect(outline(root.children)).toBe('见 ⟨$⟩ 的图，设 *$* 是，⟨积分 $⟩。');
});

it('笔记预览里全角空格也原样保留，公式挨着它不另加空格', () => {
  const FW = '　'; // 全角空格（U+3000）
  const root = renderNote(`**定理**${FW}$x$ 是，*设 $y$*${FW}则`, {});
  expect(outline(root.children)).toBe(`定理${FW}$ 是，*设 $*${FW}则`);
});

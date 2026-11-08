// 公式和汉字之间的空格、公式和紧贴它的中文标点不拆行（见 docs/plan.md「排版规范」）。
// 内容编译器处理正文和题目文字时用，网页的笔记预览也用同一份，两边显示一致。
// 输入是 mdast 的行内节点：公式节点已经带上 data.hName = 'x-math'。

export interface InlineNode {
  type: string;
  value?: string;
  children?: InlineNode[];
  data?: Record<string, unknown>;
}

const CJK_RE = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u;
/** 全角标点、中文引号、省略号、破折号：公式挨着它们时不留空格。 */
const CJK_PUNCT_RE = /[　-〿＀-￯‘-‟…—]/u;

function isCjk(ch: string | undefined): boolean {
  return ch !== undefined && CJK_RE.test(ch);
}

/** 公式这一侧应该是什么空白：汉字 → 一个空格；中文标点 → 不留；其他 → 不动（null）。 */
function gapFor(ch: string | undefined): string | null {
  if (ch === undefined) return null;
  if (CJK_RE.test(ch)) return ' ';
  if (CJK_PUNCT_RE.test(ch)) return '';
  return null;
}

/** 节点文字的第一个或最后一个字符；公式本身不算汉字。 */
function edgeChar(node: InlineNode | undefined, which: 'first' | 'last'): string | undefined {
  if (!node || node.type === 'inlineMath' || node.type === 'math') return undefined;
  if (node.value !== undefined) {
    const chars = Array.from(node.value);
    return which === 'first' ? chars[0] : chars[chars.length - 1];
  }
  const kids = node.children ?? [];
  return edgeChar(which === 'first' ? kids[0] : kids[kids.length - 1], which);
}

function isInlineMath(node: InlineNode): boolean {
  return node.type === 'inlineMath' && node.data?.hName === 'x-math';
}

/**
 * 行内公式和汉字之间统一留一个空格（作者不用手动写，写了几个都归成一个）；挨着中文标点时去掉空格。
 * 用真正的空格而不是边距：折行时空格会被浏览器去掉，不会在行首行尾留出缩进。
 */
export function spaceAroundMath<T extends InlineNode>(children: T[]): T[] {
  const out: InlineNode[] = [];
  children.forEach((node, i) => {
    if (!isInlineMath(node)) {
      out.push(node);
      return;
    }
    const prev = out[out.length - 1];
    if (prev?.type === 'text') {
      const trimmed = (prev.value ?? '').replace(/\s+$/u, '');
      const gap = gapFor(trimmed === '' ? edgeChar(out[out.length - 2], 'last') : edgeChar({ type: 'text', value: trimmed }, 'last'));
      if (gap !== null) prev.value = trimmed + gap;
    } else if (isCjk(edgeChar(prev, 'last'))) {
      out.push({ type: 'text', value: ' ' });
    }
    out.push(node);
    const next = children[i + 1];
    if (next?.type === 'text') {
      const trimmed = (next.value ?? '').replace(/^\s+/u, '');
      const gap = gapFor(trimmed === '' ? edgeChar(children[i + 2], 'first') : edgeChar({ type: 'text', value: trimmed }, 'first'));
      if (gap !== null) next.value = gap + trimmed;
    } else if (isCjk(edgeChar(next, 'first'))) {
      out.push({ type: 'text', value: ' ' });
    }
  });
  return out as T[];
}

const OPENING_PUNCT = '（「『【〈《〔［｛“‘';
const CLOSING_PUNCT_RE = /^[，。、：；！？）」』】〉》〕］｝”’…—]+/u;

/**
 * 浏览器在公式（行内块）前后总是允许折行，于是「、」「。」会被挤到下一行行首。
 * 把紧贴公式的中文标点和公式包进一个不折行的 span；代价是这样的公式整体不再折行，长公式应该写成行间公式。
 */
export function keepPunctuationWithMath<T extends InlineNode>(children: T[]): T[] {
  const out: InlineNode[] = [];
  children.forEach((node, i) => {
    if (!isInlineMath(node)) {
      out.push(node);
      return;
    }
    const group: InlineNode[] = [];
    const prev = out[out.length - 1];
    if (prev?.type === 'text' && prev.value) {
      const chars = Array.from(prev.value);
      const last = chars[chars.length - 1];
      if (OPENING_PUNCT.includes(last)) {
        prev.value = chars.slice(0, -1).join('');
        group.push({ type: 'text', value: last });
      }
    }
    group.push(node);
    const next = children[i + 1];
    const closing = next?.type === 'text' ? CLOSING_PUNCT_RE.exec(next.value ?? '') : null;
    if (next && closing) {
      group.push({ type: 'text', value: closing[0] });
      next.value = (next.value ?? '').slice(closing[0].length);
    }
    out.push(group.length > 1 ? { type: 'mathGroup', data: { hName: 'span', hProperties: { className: ['nobr'] } }, children: group } : node);
  });
  return out.filter((n) => n.type !== 'text' || n.value !== '') as T[];
}

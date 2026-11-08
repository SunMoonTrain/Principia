// 字数规则与精度要求的识别，见 docs/plan.md「每节固定结构与写作规范」「题目与判题」。

import { parseFragment, type MdNode } from './markdown.ts';

const ALNUM_RE = /[\p{Script=Latin}\p{Nd}]/u;

function countPlain(text: string): number {
  let count = 0;
  let inRun = false;
  for (const ch of text) {
    if (/\s/u.test(ch)) {
      inRun = false;
    } else if (ALNUM_RE.test(ch)) {
      if (!inRun) count++;
      inRun = true;
    } else {
      inRun = false;
      count++;
    }
  }
  return count;
}

/**
 * 字数规则：一个中文字或一个标点算 1，连续的英文字母或数字算 1，一个公式算 1，空格不算；
 * 计数前先去掉首尾空白。
 */
export function countChars(src: string): number {
  let count = 0;
  const walk = (node: MdNode): void => {
    if (node.type === 'inlineMath' || node.type === 'math') {
      count++;
      return;
    }
    if ((node.type === 'text' || node.type === 'inlineCode') && node.value) {
      count += countPlain(node.value);
      return;
    }
    // 两段文字之间的分界（如强调的边界）不算断开英文单词以外的东西，逐段数即可
    for (const child of node.children ?? []) walk(child);
  };
  walk(parseFragment(src.trim()));
  return count;
}

const N = '\\s*[0-9０-９零〇一二两三四五六七八九十百]+\\s*';

/** 题面写了精度要求：「保留 N 位」「N 位有效数字」「精确到」。N 可以是阿拉伯数字或中文数字，两边允许空格。 */
export const PRECISION_RE = new RegExp(`保留${N}位|${N}位有效数字|精确到`);

export function hasPrecisionRequirement(statement: string): boolean {
  return PRECISION_RE.test(statement);
}

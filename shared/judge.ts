// 判题器：简单题、中等题当场判对错，见 docs/plan.md「题目与判题」。
// 格式错误（看不懂、个数不对、带单位、算出复数……）只提示，不算一次作答。

import type { Answer, Tolerance } from './content-types.ts';
import { evaluateExpression, normalizeExpression } from './expr.ts';

export type Verdict = { kind: 'format'; message: string } | { kind: 'graded'; correct: boolean };

/** 容差规则：|x − a| ≤ max(abs, rel·|a|)。 */
export function withinTolerance(x: number, a: number, tol: Tolerance): boolean {
  return Math.abs(x - a) <= Math.max(tol.abs, tol.rel * Math.abs(a));
}

const OPEN = '([{';
const CLOSE = ')]}';

/** 第一个字符的括号是否正好在最后一个字符处闭合（「(1, 2)」是，「(1)+(2)」不是）。 */
function wrapsAll(s: string): boolean {
  if (s.length < 2 || OPEN.indexOf(s[0]) < 0 || OPEN.indexOf(s[0]) !== CLOSE.indexOf(s[s.length - 1])) return false;
  let depth = 0;
  for (let i = 0; i < s.length; i++) {
    if (OPEN.includes(s[i])) depth++;
    else if (CLOSE.includes(s[i])) depth--;
    if (depth === 0 && i < s.length - 1) return false;
  }
  return true;
}

/**
 * 把「一组数」的输入按最外层的逗号拆开：括号里的逗号不拆（如 nthRoot(8, 3)）；
 * 中文逗号也算；整个输入外面包着一对 ()、[]、{} 时先去掉。
 */
export function splitList(input: string): string[] {
  let s = normalizeExpression(input);
  if (wrapsAll(s)) s = s.slice(1, -1).trim();
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < s.length; i++) {
    if (OPEN.includes(s[i])) depth++;
    else if (CLOSE.includes(s[i])) depth--;
    else if (s[i] === ',' && depth === 0) {
      parts.push(s.slice(start, i).trim());
      start = i + 1;
    }
  }
  parts.push(s.slice(start).trim());
  return parts;
}

/** 多重集合匹配：每个输入配一个还没用过、在容差内的标准答案（增广路，数很少）。 */
function matchesAsMultiset(xs: number[], as: number[], tol: Tolerance): boolean {
  if (xs.length !== as.length) return false;
  const owner = new Array<number>(as.length).fill(-1);
  const assign = (i: number, seen: boolean[]): boolean => {
    for (let j = 0; j < as.length; j++) {
      if (seen[j] || !withinTolerance(xs[i], as[j], tol)) continue;
      seen[j] = true;
      if (owner[j] < 0 || assign(owner[j], seen)) {
        owner[j] = i;
        return true;
      }
    }
    return false;
  };
  return xs.every((_, i) => assign(i, new Array<boolean>(as.length).fill(false)));
}

function evaluateParts(parts: string[]): number[] | { message: string } {
  const values: number[] = [];
  for (const [i, part] of parts.entries()) {
    const prefix = parts.length > 1 ? `第 ${i + 1} 个数：` : '';
    if (part === '') return { message: parts.length > 1 ? `第 ${i + 1} 个数是空的` : '请先填写答案' };
    const r = evaluateExpression(part);
    if (!r.ok) return { message: prefix + r.message };
    values.push(r.value);
  }
  return values;
}

/** 判一道数值题（number、tuple、set）。 */
export function judgeNumeric(answer: Extract<Answer, { type: 'number' | 'tuple' | 'set' }>, tolerance: Tolerance, input: string): Verdict {
  if (normalizeExpression(input) === '') return { kind: 'format', message: '请先填写答案' };
  const parts = splitList(input);
  const expected = answer.type === 'number' ? 1 : answer.value.length;
  if (parts.length !== expected) {
    const message =
      answer.type === 'number'
        ? '这道题只填一个数（小数请用小数点，不要用逗号）'
        : `这道题要填 ${expected} 个数（${answer.type === 'tuple' ? '按顺序' : '不分顺序'}，用逗号隔开），你填了 ${parts.length} 个`;
    return { kind: 'format', message };
  }
  const values = evaluateParts(parts);
  if (!Array.isArray(values)) return { kind: 'format', message: values.message };
  if (answer.type === 'number') return { kind: 'graded', correct: withinTolerance(values[0], answer.value, tolerance) };
  if (answer.type === 'tuple') return { kind: 'graded', correct: values.every((x, i) => withinTolerance(x, answer.value[i], tolerance)) };
  return { kind: 'graded', correct: matchesAsMultiset(values, answer.value, tolerance) };
}

/** 判一道选择题；selected 是选中的选项序号（从 1 开始）。 */
export function judgeChoice(answer: Extract<Answer, { type: 'choice' }>, selected: number[]): Verdict {
  if (selected.length === 0) return { kind: 'format', message: '请先选择' };
  if (!answer.multiple && selected.length > 1) return { kind: 'format', message: '这是单选题，只能选一个' };
  const picked = [...new Set(selected)].sort((a, b) => a - b);
  const correct = picked.length === answer.value.length && picked.every((v, i) => v === answer.value[i]);
  return { kind: 'graded', correct };
}

// 验算脚本的公用部分：数值求确界的小工具，以及和 problems.yaml 里标准答案的比对。
// 验算脚本只根据题意独立计算，算完后才读标准答案来比对（见 docs/plan.md「内容生产与审查流水线」）。

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { evaluateValue } from '../../shared/expr.ts';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

/** 一道题独立算出的答案：数、有序的一组数、无序的一组数、选择题的选项序号。 */
export type Computed =
  | { type: 'number'; value: number }
  | { type: 'tuple' | 'set'; value: number[] }
  | { type: 'choice'; value: number[] };

export interface Verification {
  lesson: string;
  /** 每道题怎么算的，一句话。 */
  notes: Record<string, string>;
  compute(): Record<string, Computed>;
}

/**
 * 集合 {x : pred(x)} 的上确界：在 [lo, hi] 上先粗扫找到最右边满足条件的格点，再在它和下一个格点之间二分。
 * 要求集合在上确界左边紧挨着有元素（区间或区间的并）。
 */
export function supOfPredicate(pred: (x: number) => boolean, lo = -100, hi = 100, steps = 200_000): number | null {
  const h = (hi - lo) / steps;
  let last: number | null = null;
  for (let i = 0; i <= steps; i++) {
    const x = lo + i * h;
    if (pred(x)) last = x;
  }
  if (last === null) return null;
  let a = last;
  let b = Math.min(last + h, hi);
  for (let k = 0; k < 200; k++) {
    const m = (a + b) / 2;
    if (pred(m)) a = m;
    else b = m;
  }
  return (a + b) / 2;
}

export function infOfPredicate(pred: (x: number) => boolean, lo = -100, hi = 100, steps = 200_000): number | null {
  const s = supOfPredicate((x) => pred(-x), -hi, -lo, steps);
  return s === null ? null : -s;
}

/** 在 [lo, hi] 上找 f 的所有零点：粗扫找变号，再二分。f 返回 null 表示这一点没有定义。 */
export function rootsOf(f: (x: number) => number | null, lo: number, hi: number, steps = 4000): number[] {
  const roots: number[] = [];
  const h = (hi - lo) / steps;
  for (let i = 0; i < steps; i++) {
    let a = lo + i * h;
    let b = a + h;
    const fa = f(a);
    const fb = f(b);
    if (fa === null || fb === null) continue;
    if (fa === 0) {
      roots.push(a);
      continue;
    }
    if (fa * fb > 0) continue;
    let va = fa;
    for (let k = 0; k < 200; k++) {
      const m = (a + b) / 2;
      const vm = f(m);
      if (vm === null) break;
      if (va * vm <= 0) b = m;
      else {
        a = m;
        va = vm;
      }
    }
    roots.push((a + b) / 2);
  }
  // 去掉同一个零点被相邻两格各找一次的情况
  return roots.filter((r, i) => i === 0 || Math.abs(r - roots[i - 1]) > h * 2);
}

function close(x: number, a: number): boolean {
  return Math.abs(x - a) <= Math.max(1e-9, 1e-6 * Math.abs(a));
}

interface StandardAnswer {
  type: string;
  value: number[];
}

function loadStandardAnswers(lesson: string): Map<string, StandardAnswer> | null {
  const [subject, domain, name] = lesson.split('.');
  const file = path.join(ROOT, 'content', subject, domain, name, 'problems.yaml');
  if (!fs.existsSync(file)) return null;
  const problems = parse(fs.readFileSync(file, 'utf8')) as { id: string; answer?: { type: string; value: unknown } }[];
  const result = new Map<string, StandardAnswer>();
  for (const p of problems) {
    if (!p.answer) continue;
    const raw = Array.isArray(p.answer.value) ? p.answer.value : [p.answer.value];
    const value = raw.map((v) => {
      const r = evaluateValue(v);
      return r.ok ? r.value : Number.NaN;
    });
    result.set(p.id, { type: p.answer.type, value });
  }
  return result;
}

function format(c: Computed): string {
  const v = c.value;
  const show = (x: number): string => (Number.isInteger(x) ? String(x) : x.toPrecision(12));
  if (c.type === 'number') return show(c.value as number);
  if (c.type === 'tuple') return `(${(v as number[]).map(show).join(', ')})`;
  if (c.type === 'set') return `{${(v as number[]).map(show).join(', ')}}`;
  return `选项 ${(v as number[]).join('、')}`;
}

/** 跑一个验算：打印独立算出的答案；problems.yaml 存在时和标准答案比对。返回是否全部一致。 */
export function runVerification(v: Verification): boolean {
  console.log(`\n# ${v.lesson}`);
  const computed = v.compute();
  const standard = loadStandardAnswers(v.lesson);
  let ok = true;
  for (const [id, c] of Object.entries(computed)) {
    let verdict = '（还没有 problems.yaml，只输出算出的值）';
    if (standard) {
      const s = standard.get(id);
      if (!s) {
        verdict = '✗ problems.yaml 里没有这道题的标准答案';
        ok = false;
      } else {
        const mine = c.type === 'set' || c.type === 'choice' ? [...(c.value as number[])].sort((a, b) => a - b) : c.type === 'number' ? [c.value as number] : (c.value as number[]);
        const theirs = s.type === 'set' || s.type === 'choice' ? [...s.value].sort((a, b) => a - b) : s.value;
        const same = s.type === c.type && mine.length === theirs.length && mine.every((x, i) => close(x, theirs[i]));
        verdict = same ? `✓ 与标准答案一致（${s.type}：${theirs.join(', ')}）` : `✗ 与标准答案不一致（${s.type}：${theirs.join(', ')}）`;
        if (!same) ok = false;
      }
    }
    console.log(`${id}  算得 ${format(c)}  ${verdict}`);
    if (v.notes[id]) console.log(`    方法：${v.notes[id]}`);
  }
  return ok;
}

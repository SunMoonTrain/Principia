// problems.yaml：每节恰好 8 道题，见 docs/plan.md「内容模型」「题目与判题」。

import type { Answer, Problem, Rich, Tier, Tolerance } from '../shared/content-types.ts';
import { evaluateValue } from '../shared/expr.ts';
import { PROBLEM_IDS, TIER_ORDER } from '../shared/ids.ts';
import { readText } from './fsutil.ts';
import { renderField, type MdContext } from './markdown.ts';
import { ProblemSchema, reportIssues } from './schema.ts';
import { PRECISION_RE } from './text-rules.ts';
import { lineOf, parseYaml, textAt, type TextField, type YamlFile } from './yaml-text.ts';

export const DEFAULT_TOLERANCE: Tolerance = { rel: 1e-3, abs: 1e-9 };

const TIER_NAMES: Record<Tier, string> = { easy: '简单', medium: '中等', hard: '难', thinking: '思考' };

type FieldCtx = Omit<MdContext, 'lineOffset' | 'file'>;

function render(y: YamlFile, field: TextField | null, ctx: FieldCtx, mode: 'rich' | 'plain'): Rich | null {
  return field ? renderField(field, { ...ctx, file: y.file }, mode) : null;
}

/** 检查并渲染一道题；结构不对时返回 null（错误已记下）。 */
function processProblem(y: YamlFile, raw: unknown, i: number, ctx: FieldCtx): Problem | null {
  const { diags } = ctx;
  const at = (...path: PropertyKey[]): number => lineOf(y, [i, ...path]);
  // 报错里用题号（p1.statement）而不是列表下标（0.statement）
  const label = PROBLEM_IDS[i] ?? `第 ${i + 1} 题`;
  const named = (path: PropertyKey[]): string => [label, ...path.slice(1)].join('.');
  const text = (...path: PropertyKey[]) => textAt(y, [i, ...path], diags, named([i, ...path]));

  // 先按 YAML 节点检查文字字段的写法：即使别处结构有错，也要报出双引号吃反斜杠这类问题。
  const statement = text('statement');
  const hints = [0, 1, 2].map((j) => text('hints', j));
  const solution = text('solution');
  text('reference');
  const rawOptions = (raw as { answer?: { options?: unknown } } | null)?.answer?.options;
  const options = Array.isArray(rawOptions) ? rawOptions.map((_, j) => text('answer', 'options', j)) : [];
  const unit = text('answer', 'unit');

  const parsed = ProblemSchema.safeParse(raw);
  if (!parsed.success) {
    reportIssues(y, parsed.error.issues, diags, [i], named);
    return null;
  }
  const p = parsed.data;
  const errorsBefore = diags.errorCount;
  const expectedId = PROBLEM_IDS[i];
  const expectedTier = TIER_ORDER[i];
  if (expectedId && p.id !== expectedId) diags.error(y.file, at('id'), `第 ${i + 1} 道题的题号应为 ${expectedId}，这里是 ${p.id}`);
  if (expectedTier && p.tier !== expectedTier) {
    diags.error(
      y.file,
      at('tier'),
      `${expectedId} 应为「${TIER_NAMES[expectedTier]}」（顺序固定：p1、p2 简单，p3、p4 中等，p5、p6 难，p7、p8 思考），这里是 ${p.tier}`,
    );
  }

  const auto = p.tier === 'easy' || p.tier === 'medium';
  if (auto) {
    if (!p.answer) diags.error(y.file, at(), `${p.id}：简单题、中等题必须有 answer`);
    if (p.solution === undefined) diags.error(y.file, at(), `${p.id}：简单题、中等题必须有 solution`);
    if (p.reference !== undefined) diags.error(y.file, at('reference'), `${p.id}：reference 只给难题、思考题`);
  } else {
    if (p.answer) diags.error(y.file, at('answer'), `${p.id}：难题、思考题没有 answer`);
    if (p.solution !== undefined) diags.error(y.file, at('solution'), `${p.id}：难题、思考题没有 solution（完整解答写在第 3 级提示里）`);
    if (p.tolerance) diags.error(y.file, at('tolerance'), `${p.id}：难题、思考题没有 tolerance`);
    if (p.reference === undefined) diags.error(y.file, at(), `${p.id}：难题、思考题必须有 reference（给审查用的参考解答）`);
  }

  let answer: Answer | null = null;
  let tolerance: Tolerance | null = null;
  if (p.answer && auto) {
    const a = p.answer;
    const evaluate = (v: number | string, path: PropertyKey[]): number => {
      const r = evaluateValue(v);
      if (r.ok) return r.value;
      const message = r.code === 'infinite' ? '答案不能是 ∞' : r.message;
      diags.error(y.file, at('answer', ...path), `${p.id}：标准答案 ${String(v)} 求不出有限实数值：${message}`);
      return Number.NaN;
    };
    if (a.type === 'number') {
      answer = { type: 'number', value: evaluate(a.value, ['value']), source: String(a.value), unit: render(y, unit, ctx, 'plain') };
    } else if (a.type === 'tuple' || a.type === 'set') {
      answer = {
        type: a.type,
        value: a.value.map((v, j) => evaluate(v, ['value', j])),
        source: a.value.map(String),
        unit: render(y, unit, ctx, 'plain'),
      };
    } else {
      const values = Array.isArray(a.value) ? a.value : [a.value];
      if (!a.multiple && values.length !== 1) diags.error(y.file, at('answer', 'value'), `${p.id}：单选题的 value 只写一个选项序号`);
      if (new Set(values).size !== values.length) diags.error(y.file, at('answer', 'value'), `${p.id}：value 里有重复的选项序号`);
      for (const v of values) {
        if (v < 1 || v > a.options.length) {
          diags.error(y.file, at('answer', 'value'), `${p.id}：选项序号 ${v} 超出范围（从 1 开始，共 ${a.options.length} 个选项）`);
        }
      }
      answer = {
        type: 'choice',
        multiple: a.multiple,
        options: options.map((o) => render(y, o, ctx, 'rich') ?? { type: 'root', children: [] }),
        value: [...values].sort((x, z) => x - z),
      };
    }

    if (a.type === 'choice') {
      if (p.tolerance) diags.error(y.file, at('tolerance'), `${p.id}：选择题不用 tolerance`);
    } else {
      if (p.tolerance && p.tolerance.rel === undefined && p.tolerance.abs === undefined) {
        diags.error(y.file, at('tolerance'), `${p.id}：tolerance 至少写 rel 或 abs`);
      }
      const precision = PRECISION_RE.exec(p.statement);
      if (precision && !p.tolerance) {
        // 指到精度要求所在的那一行
        const line = statement ? statement.contentLine + p.statement.slice(0, precision.index).split('\n').length - 1 : at('statement');
        diags.error(y.file, line, `${p.id}：题面写了精度要求（「${precision[0].trim()}」），必须同时写 tolerance`);
      }
      tolerance = { ...DEFAULT_TOLERANCE, ...p.tolerance };
    }
  }

  const renderedHints = hints.map((h) => render(y, h, ctx, 'rich') ?? { type: 'root' as const, children: [] });
  const problem: Problem = {
    id: p.id,
    tier: p.tier,
    statement: render(y, statement, ctx, 'rich') ?? { type: 'root', children: [] },
    answer,
    tolerance,
    hints: [renderedHints[0], renderedHints[1], renderedHints[2]],
    solution: auto ? render(y, solution, ctx, 'rich') : null,
  };
  return diags.errorCount === errorsBefore ? problem : null;
}

/** 读一节的 problems.yaml。返回 null 表示有错误（已记下）。 */
export function processProblems(file: string, reportFile: string, ctx: FieldCtx): Problem[] | null {
  const y = parseYaml(readText(file), reportFile, 0, ctx.diags);
  if (!y) return null;
  const data = y.doc.toJS() as unknown;
  if (!Array.isArray(data)) {
    ctx.diags.error(reportFile, 1, 'problems.yaml 要写成题目列表（每道题以「- id: p1」开头）');
    return null;
  }
  if (data.length !== 8) {
    ctx.diags.error(reportFile, data.length ? lineOf(y, [data.length - 1]) : 1, `每节恰好 8 道题（p1 到 p8），这里有 ${data.length} 道`);
  }
  const problems = data.map((raw, i) => processProblem(y, raw, i, ctx));
  return data.length === 8 && problems.every((p) => p !== null) ? (problems as Problem[]) : null;
}

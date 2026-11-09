// 第一批组件的参数格式和检查，见 docs/plan.md「附录：动画组件参数」。
// 内容编译器在构建时用它检查小节里写的参数（结构、式子能不能编译、个数对不对），组件用它的类型。
// 这个文件不碰 DOM 和 React，编译器（Node）也能直接用。滑块的通用规则（结构、重名）由编译器查。

import { z } from 'zod';
import { checkExpr } from './expr.ts';

export interface ParamIssue {
  path: (string | number)[];
  message: string;
}

/** 一个数，或一个能用滑块名的式子。 */
const Expr = z.union([z.number(), z.string().min(1)]);
const Range = z.tuple([z.number(), z.number()]).refine(([a, b]) => a < b, '范围要从小写到大，如 [-3, 3]');
const Label = z.string();
const Identifier = z.string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/, '变量名只能用英文字母、数字和下划线，且不能以数字开头');
/** 积分步长。 */
const Dt = z.number().positive().max(1);
/** sliders 的结构由编译器按通用规则查，这里只占个位。 */
const Sliders = z.array(z.unknown()).optional();

export interface SliderSpec {
  name: string;
  min: number;
  max: number;
  step: number;
  default: number;
  label: string;
}

export const FunctionPlotSchema = z.strictObject({
  range: z.strictObject({ x: Range, y: Range }),
  functions: z.array(z.strictObject({ expr: Expr, label: Label.optional() })).optional(),
  // step：隔几项画一个（默认 1），画子列用，如 n: [2, 40] 加 step: 2 只画偶数项
  sequences: z.array(z.strictObject({ expr: Expr, n: z.tuple([z.int(), z.int()]), step: z.int().min(1).optional(), label: Label.optional() })).optional(),
  points: z.array(z.strictObject({ x: Expr, y: Expr })).optional(),
  sliders: Sliders,
});

export const PhasePortraitSchema = z.strictObject({
  system: z.record(Identifier, Expr),
  range: z.record(z.string(), Range),
  dt: Dt,
  // 图上同时最多 12 条轨迹（再点就去掉最早点出来的）
  initial: z.array(z.tuple([z.number(), z.number()])).max(12).optional(),
  sliders: Sliders,
});

export const VectorField2DSchema = z.strictObject({
  field: z.strictObject({ x: Expr, y: Expr }),
  range: z.strictObject({ x: Range, y: Range }),
  dt: Dt,
  particles: z.int().min(1).max(2000).optional(),
  sliders: Sliders,
});

export const OscillatorSchema = z.strictObject({
  masses: z.array(Expr).min(1).max(8),
  springs: z.array(Expr),
  damping: Expr.optional(),
  initial: z.array(Expr),
  dt: Dt,
  sliders: Sliders,
});

export type FunctionPlotParams = Omit<z.infer<typeof FunctionPlotSchema>, 'sliders'> & { sliders?: SliderSpec[] };
export type PhasePortraitParams = Omit<z.infer<typeof PhasePortraitSchema>, 'sliders'> & { sliders?: SliderSpec[] };
export type VectorField2DParams = Omit<z.infer<typeof VectorField2DSchema>, 'sliders'> & { sliders?: SliderSpec[] };
export type OscillatorParams = Omit<z.infer<typeof OscillatorSchema>, 'sliders'> & { sliders?: SliderSpec[] };

export interface ComponentSpec {
  schema: z.ZodType;
  /** 滑块不能用的名字（变量名）；t 和 e、pi 这些常数由编译器另查。 */
  reserved(params: never): string[];
  /** 结构对了以后再查：式子能不能编译、个数对不对。sliders 是滑块名。 */
  check(params: never, sliders: string[]): ParamIssue[];
  /** 滑块以外要排版的文字字段（图例）：路径和组件里用来取它的键。 */
  labels(params: never): { path: (string | number)[]; key: string }[];
}

function expr(issues: ParamIssue[], path: (string | number)[], src: string | number, names: string[]): void {
  const problem = checkExpr(src, names);
  if (problem) issues.push({ path, message: problem });
}

const functionPlot: ComponentSpec = {
  schema: FunctionPlotSchema,
  reserved: () => ['x', 'n'],
  check(p: FunctionPlotParams, sliders) {
    const issues: ParamIssue[] = [];
    if (!p.functions?.length && !p.sequences?.length) issues.push({ path: [], message: 'functions 和 sequences 至少要有一种' });
    p.functions?.forEach((f, i) => expr(issues, ['functions', i, 'expr'], f.expr, ['x', ...sliders]));
    p.sequences?.forEach((s, i) => {
      expr(issues, ['sequences', i, 'expr'], s.expr, ['n', ...sliders]);
      if (s.n[0] > s.n[1] || s.n[1] - s.n[0] > 5000) issues.push({ path: ['sequences', i, 'n'], message: 'n 要从小写到大，最多画 5000 项' });
    });
    p.points?.forEach((pt, i) => {
      expr(issues, ['points', i, 'x'], pt.x, sliders);
      expr(issues, ['points', i, 'y'], pt.y, sliders);
    });
    return issues;
  },
  labels: (p: FunctionPlotParams) => [
    ...(p.functions ?? []).flatMap((f, i) => (f.label === undefined ? [] : [{ path: ['functions', i, 'label'], key: `function:${i}` }])),
    ...(p.sequences ?? []).flatMap((s, i) => (s.label === undefined ? [] : [{ path: ['sequences', i, 'label'], key: `sequence:${i}` }])),
  ],
};

const phasePortrait: ComponentSpec = {
  schema: PhasePortraitSchema,
  reserved: (p: PhasePortraitParams) => Object.keys(p.system),
  check(p: PhasePortraitParams, sliders) {
    const issues: ParamIssue[] = [];
    const vars = Object.keys(p.system);
    if (vars.length !== 2) {
      issues.push({ path: ['system'], message: `system 要恰好两个状态变量，这里是 ${vars.length} 个` });
      return issues;
    }
    if (vars.includes('t')) issues.push({ path: ['system'], message: '状态变量不能叫 t（t 是时间）' });
    const rangeKeys = Object.keys(p.range);
    if (rangeKeys.length !== 2 || !vars.every((v) => rangeKeys.includes(v))) {
      issues.push({ path: ['range'], message: `range 的键要和 system 的一样（${vars.join('、')}）` });
    }
    for (const v of vars) expr(issues, ['system', v], p.system[v], [...vars, 't', ...sliders]);
    return issues;
  },
  labels: () => [],
};

const vectorField2D: ComponentSpec = {
  schema: VectorField2DSchema,
  reserved: () => ['x', 'y'],
  check(p: VectorField2DParams, sliders) {
    const issues: ParamIssue[] = [];
    expr(issues, ['field', 'x'], p.field.x, ['x', 'y', 't', ...sliders]);
    expr(issues, ['field', 'y'], p.field.y, ['x', 'y', 't', ...sliders]);
    return issues;
  },
  labels: () => [],
};

const oscillator: ComponentSpec = {
  schema: OscillatorSchema,
  reserved: () => [],
  check(p: OscillatorParams, sliders) {
    const issues: ParamIssue[] = [];
    const n = p.masses.length;
    if (p.springs.length !== n + 1) issues.push({ path: ['springs'], message: `${n} 个物块要写 ${n + 1} 根弹簧（从左墙到右墙），这里是 ${p.springs.length} 根` });
    if (p.initial.length !== n) issues.push({ path: ['initial'], message: `${n} 个物块要写 ${n} 个初始位移，这里是 ${p.initial.length} 个` });
    p.masses.forEach((m, i) => {
      expr(issues, ['masses', i], m, sliders);
      if (typeof m === 'number' && m <= 0) issues.push({ path: ['masses', i], message: '质量必须大于 0' });
    });
    p.springs.forEach((k, i) => {
      expr(issues, ['springs', i], k, sliders);
      if (typeof k === 'number' && k < 0) issues.push({ path: ['springs', i], message: '劲度系数不能是负数（写 0 表示不连）' });
    });
    p.initial.forEach((x, i) => expr(issues, ['initial', i], x, sliders));
    if (p.damping !== undefined) {
      expr(issues, ['damping'], p.damping, sliders);
      if (typeof p.damping === 'number' && p.damping < 0) issues.push({ path: ['damping'], message: '阻尼系数不能是负数' });
    }
    return issues;
  },
  labels: () => [],
};

/** 已经实现的组件（内容里写的名字 → 参数格式）。 */
export const SPECS: Record<string, ComponentSpec> = {
  'function-plot': functionPlot,
  'phase-portrait': phasePortrait,
  'vector-field-2d': vectorField2D,
  oscillator,
};

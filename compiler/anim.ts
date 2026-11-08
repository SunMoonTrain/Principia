// :::anim 动画组件块，见 docs/plan.md「可复用动画组件库」和「附录：动画组件参数」。
// 台阶 1 还没有实现任何组件：附录里列了的组件只警告、页面显示占位框；附录里没有的名字直接报错。
// 通用参数（sliders）的规则现在就检查；各组件的专有参数等台阶 7 实现组件时再补。

import { z } from 'zod';
import type { MdContext, MdNode } from './markdown.ts';
import { renderField } from './markdown.ts';
import { lineOf, parseYaml, textAt } from './yaml-text.ts';

/** 附录「各组件」表里的组件；值是「状态变量」所在的参数名（滑块不能和状态变量重名）。 */
export const ANIM_COMPONENTS: Record<string, { stateKey?: string }> = {
  'phase-portrait': { stateKey: 'system' },
  'function-plot': {},
  'vector-field-2d': {},
  oscillator: {},
  'particle-motion': {},
  'wave-1d': {},
  'linear-map-2d': {},
  'surface-3d': {},
  'complex-map': {},
  distribution: {},
  construction: {},
};

/** 已经实现的组件（台阶 7 起由 packages/anim 提供）。 */
export const IMPLEMENTED_COMPONENTS = new Set<string>();

/** 滑块不能用的名字：时间变量 t，以及 math.js 的 e、pi、i、Infinity 和它们的大写形式。 */
const RESERVED_NAMES = new Set(['t', 'e', 'pi', 'i', 'Infinity', 'E', 'PI', 'I', 'INFINITY']);

const Slider = z.strictObject({
  name: z.string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/, '滑块名只能用英文字母、数字和下划线，且不能以数字开头'),
  min: z.number(),
  max: z.number(),
  step: z.number().positive(),
  default: z.number(),
  label: z.string(),
});

export interface AnimUse {
  component: string;
  implemented: boolean;
  line: number;
}

export function processAnim(node: MdNode, ctx: MdContext): MdNode | null {
  const line = (node.position?.start.line ?? 1) + ctx.lineOffset;
  const attrs = node.attributes ?? {};
  const component = attrs.component ?? '';
  if (!component) {
    ctx.diags.error(ctx.file, line, '动画组件块缺 component，写法是 :::anim{component="phase-portrait"}');
    return null;
  }
  if (!Object.hasOwn(ANIM_COMPONENTS, component)) {
    ctx.diags.error(ctx.file, line, `没有叫「${component}」的动画组件；能用的组件见 plan.md「附录：动画组件参数」`);
    return null;
  }
  const extra = Object.keys(attrs).filter((k) => k !== 'component');
  if (extra.length) ctx.diags.error(ctx.file, line, `动画组件块只认 component 属性，多了 ${extra.join('、')}`);

  // 块里的内容是 YAML，取原文（remark 已经把它当 Markdown 解析过了，不能用解析结果）。
  const startLine = node.position?.start.line ?? 1;
  const endLine = node.position?.end.line ?? startLine;
  const lines = ctx.sourceLines ?? [];
  const closed = endLine > startLine && /^\s*:::\s*$/.test(lines[endLine - 1] ?? '');
  if (!closed) {
    ctx.diags.error(ctx.file, line, '动画组件块没有用单独一行的 ::: 结束');
    return null;
  }
  const yamlText = lines.slice(startLine, endLine - 1).join('\n');
  const y = parseYaml(yamlText, ctx.file, startLine + ctx.lineOffset, ctx.diags);
  if (!y) return null;
  const params = (y.doc.toJS() ?? {}) as Record<string, unknown>;
  if (typeof params !== 'object' || Array.isArray(params)) {
    ctx.diags.error(ctx.file, line, '动画组件的参数要写成「键: 值」的映射');
    return null;
  }

  const stateKey = ANIM_COMPONENTS[component].stateKey;
  const stateVars = stateKey && params[stateKey] && typeof params[stateKey] === 'object' ? Object.keys(params[stateKey] as object) : [];
  if (params.sliders !== undefined) {
    if (!Array.isArray(params.sliders)) {
      ctx.diags.error(ctx.file, lineOf(y, ['sliders']), 'sliders 要写成列表');
    } else {
      const seen = new Set<string>();
      params.sliders.forEach((raw, i) => {
        const parsed = Slider.safeParse(raw);
        if (!parsed.success) {
          for (const issue of parsed.error.issues) {
            ctx.diags.error(ctx.file, lineOf(y, ['sliders', i, ...issue.path]), `滑块 ${['sliders', i, ...issue.path].join('.')}：${issue.message}`);
          }
          return;
        }
        const s = parsed.data;
        const at = lineOf(y, ['sliders', i, 'name']);
        if (RESERVED_NAMES.has(s.name) || stateVars.includes(s.name)) {
          ctx.diags.error(ctx.file, at, `滑块名「${s.name}」和时间变量 t、状态变量或 e、pi、i、Infinity（含大写）重名`);
        }
        if (seen.has(s.name)) ctx.diags.error(ctx.file, at, `滑块名「${s.name}」重复了`);
        seen.add(s.name);
        if (!(s.min < s.max) || s.default < s.min || s.default > s.max) {
          ctx.diags.error(ctx.file, lineOf(y, ['sliders', i]), `滑块「${s.name}」要满足 min < max，且 default 在 min 和 max 之间`);
        }
        const label = textAt(y, ['sliders', i, 'label'], ctx.diags);
        if (label) renderField(label, ctx, 'plain');
      });
    }
  }

  const implemented = IMPLEMENTED_COMPONENTS.has(component);
  ctx.anims?.push({ component, implemented, line });
  if (!implemented) ctx.diags.warn(ctx.file, line, `动画组件「${component}」还没实现，页面上先显示占位框`);
  return {
    type: 'animBlock',
    data: {
      hName: 'x-anim',
      hProperties: { dataComponent: component, dataParams: JSON.stringify(params), dataImplemented: String(implemented) },
      hChildren: [],
    },
  };
}

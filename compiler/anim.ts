// :::anim 动画组件块，见 docs/plan.md「可复用动画组件库」和「附录：动画组件参数」。
// 已实现的组件（packages/anim 的 SPECS）查全部参数：结构、式子能不能编译、个数对不对；
// 附录里列了但还没实现的组件只查通用参数（sliders），构建警告、页面显示占位框；附录里没有的名字直接报错。
// 滑块标签和图例在这里排好版，作为 x-anim-label 子元素交给网站。

import type { ElementContent } from 'hast';
import { z } from 'zod';
// 用相对路径而不是 @principia/anim/specs：vite.config.ts 加载内容插件时只打包相对路径引入的文件，
// 包名引入的交给 Node 直接加载，而 Node 22 不认 .ts 文件
import { SPECS } from '../packages/anim/src/specs.ts';
import type { Rich } from '../shared/content-types.ts';
import type { MdContext, MdNode } from './markdown.ts';
import { renderField } from './markdown.ts';
import { reportIssues } from './schema.ts';
import { lineOf, parseYaml, textAt } from './yaml-text.ts';

/** 附录「各组件」表里的组件。 */
export const ANIM_COMPONENTS = new Set([
  'phase-portrait',
  'function-plot',
  'vector-field-2d',
  'oscillator',
  'particle-motion',
  'wave-1d',
  'linear-map-2d',
  'surface-3d',
  'complex-map',
  'distribution',
  'construction',
]);

/** 已经实现的组件（由 packages/anim 提供）。 */
export const IMPLEMENTED_COMPONENTS = new Set(Object.keys(SPECS));

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

/** 排好版的一段文字，网站按 key 取（`slider:<名字>`、`function:<序号>` 等）。 */
function labelElement(key: string, rich: Rich): ElementContent {
  return { type: 'element', tagName: 'x-anim-label', properties: { dataKey: key }, children: rich.children as ElementContent[] };
}

export function processAnim(node: MdNode, ctx: MdContext): MdNode | null {
  const line = (node.position?.start.line ?? 1) + ctx.lineOffset;
  const attrs = node.attributes ?? {};
  const component = attrs.component ?? '';
  if (!component) {
    ctx.diags.error(ctx.file, line, '动画组件块缺 component，写法是 :::anim{component="phase-portrait"}');
    return null;
  }
  if (!ANIM_COMPONENTS.has(component)) {
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

  // 专有参数的结构；结构对了才知道这个组件的变量名（滑块不能和它们重名）
  const spec = SPECS[component];
  let checked: unknown = null;
  let reserved: string[] = [];
  if (spec) {
    const parsed = spec.schema.safeParse(params);
    if (parsed.success) {
      checked = parsed.data;
      reserved = spec.reserved(checked as never);
    } else {
      reportIssues(y, parsed.error.issues, ctx.diags, [], (path) => `参数 ${path.join('.')}`);
    }
  }

  const labels: ElementContent[] = [];
  const sliderNames: string[] = [];
  if (params.sliders !== undefined) {
    if (!Array.isArray(params.sliders)) {
      ctx.diags.error(ctx.file, lineOf(y, ['sliders']), 'sliders 要写成列表');
    } else {
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
        if (RESERVED_NAMES.has(s.name)) {
          ctx.diags.error(ctx.file, at, `滑块名「${s.name}」和时间变量 t 或 e、pi、i、Infinity（含大写）重名`);
        } else if (reserved.includes(s.name)) {
          ctx.diags.error(ctx.file, at, `滑块名「${s.name}」和这个组件的变量重名（${reserved.join('、')}）`);
        }
        if (sliderNames.includes(s.name)) ctx.diags.error(ctx.file, at, `滑块名「${s.name}」重复了`);
        sliderNames.push(s.name);
        if (!(s.min < s.max) || s.default < s.min || s.default > s.max) {
          ctx.diags.error(ctx.file, lineOf(y, ['sliders', i]), `滑块「${s.name}」要满足 min < max，且 default 在 min 和 max 之间`);
        } else {
          // 滑块只能停在 min 加整数个 step 上：max 不在上面就拖不到，default 不在上面就和滑块的位置对不上
          for (const key of ['default', 'max'] as const) {
            const k = (s[key] - s.min) / s.step;
            if (Math.abs(k - Math.round(k)) > 1e-6) {
              ctx.diags.error(ctx.file, lineOf(y, ['sliders', i, key]), `滑块「${s.name}」的 ${key} 要等于 min 加整数个 step（滑块只能停在这些值上）`);
            }
          }
        }
        const label = textAt(y, ['sliders', i, 'label'], ctx.diags);
        if (label) labels.push(labelElement(`slider:${s.name}`, renderField(label, ctx, 'plain')));
      });
    }
  }

  // 式子能不能编译、个数对不对；图例排版
  if (spec && checked) {
    for (const issue of spec.check(checked as never, sliderNames)) {
      const where = issue.path.length ? `参数 ${issue.path.join('.')}` : '参数';
      ctx.diags.error(ctx.file, lineOf(y, issue.path), `${where}：${issue.message}`);
    }
    for (const { path, key } of spec.labels(checked as never)) {
      const field = textAt(y, path, ctx.diags);
      if (field) labels.push(labelElement(key, renderField(field, ctx, 'plain')));
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
      hChildren: labels,
    },
  };
}

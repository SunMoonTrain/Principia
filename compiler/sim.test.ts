import { expect, it, vi } from 'vitest';
import { Diagnostics } from './diagnostics.ts';
import { parseLessonMarkdown, transformBody } from './markdown.ts';
import { ANIM_COMPONENTS, IMPLEMENTED_COMPONENTS } from './anim.ts';

vi.mock('../packages/sim/src/specs.ts', async (original) => {
  const real = await original<typeof import('../packages/sim/src/specs.ts')>();
  const { z } = await import('zod');
  return { ...real, SIM_SPECS: { bits: {
    schema: z.strictObject({ variable: z.string() }), reserved: () => [], labels: () => [], check: () => [],
    observables: (params: { variable: string }) => [params.variable],
  } } };
});

function compile(rule: string, component = 'bits') {
  const src = ':::anim{component="' + component + '"}\nvariable: counter\ngoals:\n  - when: "' + rule + '"\n    text: |\n      达到 $2$。\n:::\n';
  const root = parseLessonMarkdown(src);
  const diags = new Diagnostics();
  transformBody(root, { file: 'lesson.md', lineOffset: 0, macros: {}, diags, refs: { lessons: [], terms: [] }, sourceLines: src.split('\n') });
  return { root, diags };
}

it('由已实现规格声明可用量，目标标签通过既有公式通道，错误指到 when 行', () => {
  const ok = compile('counter >= 2');
  expect(ok.diags.errorCount).toBe(0);
  expect(JSON.stringify(ok.root)).toContain('goals:0');
  expect(JSON.stringify(ok.root)).toContain('x-math');
  const bad = compile('unknown == 2');
  expect(bad.diags.errors).toContainEqual(expect.objectContaining({ file: 'lesson.md', line: 4, message: expect.stringContaining('unknown') }));
});
it('预留组件显示占位框；画廊演示不对内容开放', () => {
  const { root, diags } = compile('cycles > 1', 'cpu');
  expect(diags.errorCount).toBe(0);
  expect(diags.warnings).toHaveLength(1);
  expect(JSON.stringify(root)).toContain('"dataImplemented":"false"');
  expect(ANIM_COMPONENTS.has('euclid')).toBe(false);
  expect(IMPLEMENTED_COMPONENTS.has('cpu')).toBe(false);
});

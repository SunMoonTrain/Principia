import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, expect, it } from 'vitest';
import { compileContent } from './compile.ts';
import { exportStatements } from '../tools/statements/lib.ts';

const sample = path.join(import.meta.dirname, 'fixtures', 'c0');
const roots: string[] = [];
afterEach(() => { for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true }); });

function change(file: string, from: string | RegExp, to: string) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'principia-c0-'));
  roots.push(root);
  fs.cpSync(path.join(sample, 'content'), path.join(root, 'content'), { recursive: true });
  const target = path.join(root, 'content', 'cs', 'foundation', 'demo', file);
  const old = fs.readFileSync(target, 'utf8');
  const next = old.replace(from, to);
  expect(next).not.toBe(old);
  fs.writeFileSync(target, next);
  return compileContent(root).report.errors;
}

it('计算机小节可以审过；讲解和动手模拟各自保留动画，清单按语言高亮', () => {
  const build = compileContent(sample);
  expect(build.report.errors).toEqual([]);
  const lesson = build.packs!.get('cs.foundation')!.lessons['cs.foundation.demo'];
  for (const part of [lesson.sections.explanation, lesson.sections.picture]) expect(JSON.stringify(part)).toContain('x-anim');
  for (const [rich, lang] of [[lesson.sections.explanation, 'rust'], [lesson.sections.explanation, 'python'],
    [lesson.sections.examples, 'typescript'], [lesson.problems[0].statement, 'rust']] as const) {
    const output = JSON.stringify(rich);
    expect(output).toContain('language-' + lang);
    expect(output).toContain('hljs-');
  }
  const statements = exportStatements(sample, { scopes: ['cs'], tiers: ['easy'] }).text;
  expect(statements).toContain('可以写 0x、0b');
  expect(statements).toContain('可用记号：A、B、C、D');
  expect(statements).not.toContain('0x7F');
});

it.each([
  ['lesson.md', '## 动手模拟', '## 几何图像', '缺少二级标题「动手模拟」'],
  ['lesson.md', '```rust', '```', '必须写支持的语言'],
  ['lesson.md', '```rust', '```go', '必须写支持的语言'],
  ['lesson.md', 'fn main', '\tfn main', '代码缩进用空格'],
  ['problems.yaml', '```rust', '```go', '必须写支持的语言'],
  ['problems.yaml', '0x7F', '1.5', '安全整数'],
  ['problems.yaml', '0x7F', '9007199254740992', '安全整数'],
  ['problems.yaml', '  hints:', '  tolerance: { rel: 0.1 }\n  hints:', '不能同时写 tolerance'],
  ['problems.yaml', '[A, B, D]', '[A B, D]', '记号只能'],
  ['problems.yaml', '[A, B, D]', '[A, X]', 'alphabet 以外'],
  ...['true', 'false', 'null'].map((v) => ['problems.yaml', '[A, B, D]', '[A, ' + v + ']', 'answer.value']),
])('%s 拒绝 %s → %s', (file, from, to, message) => {
  expect(change(file, from, to)).toContainEqual(expect.objectContaining({ line: expect.any(Number), message: expect.stringContaining(message) }));
});

it('动手模拟只有 SVG 或占位框都不能审过', () => {
  const from = /## 动手模拟[\s\S]*?## 例题/;
  // SVG 本身合法，图片检查与小节的交互要求分别执行。
  for (const body of ['![数轴](line.svg)', ':::anim{component="surface-3d"}\n:::']) {
    expect(change('lesson.md', from, '## 动手模拟\n\n' + body + '\n\n## 例题')).toContainEqual(
      expect.objectContaining({ message: expect.stringContaining('「动手模拟」至少要有一个') }));
  }
});

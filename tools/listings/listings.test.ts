import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterEach, expect, it } from 'vitest';
import { checkListings } from './lib';

const created: string[] = [];
afterEach(() => {
  for (const dir of created.splice(0)) fs.rmSync(dir, { recursive: true, force: true, maxRetries: 4 });
});
function fixture(markdown: string, problems?: string) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'principia-c1-test-'));
  created.push(root);
  const domain = path.join(root, 'content', 'cs', 'data'), lesson = path.join(domain, 'one'), tmp = path.join(root, 'tmp');
  fs.mkdirSync(lesson, { recursive: true }); fs.mkdirSync(tmp);
  fs.writeFileSync(path.join(domain, '_domain.yaml'), '{}');
  fs.writeFileSync(path.join(lesson, 'lesson.md'), markdown);
  if (problems) fs.writeFileSync(path.join(lesson, 'problems.yaml'), problems);
  return { root, tmp };
}
function pathEnv(search: string) {
  return { ...Object.fromEntries(Object.entries(process.env).filter(([k]) => k.toLowerCase() !== 'path')), PATH: search };
}
const has = (tool: string) => spawnSync(tool, ['--version'], { windowsHide: true }).status === 0;

it.skipIf(!has('rustc'))('Rust 2024 运行带入口的清单、编译库，并报告块内的类型错误行', () => {
  const { root, tmp } = fixture(['~~~rust', 'fn main() { println!("rust-ok"); }', '~~~', '~~~rust',
    '// fn main() is only a comment', 'pub fn add(a: u8, b: u8) -> u8 { a.wrapping_add(b) }', '~~~', '~~~rust',
    'fn main() {', '    let x: i32 = "错";', '}', '~~~'].join('\n'));
  const r = checkListings(root, ['cs.data'], { tmp });
  expect(r.counts).toEqual({ 通过: 2, 失败: 1, 跳过: 0 });
  expect(r.messages.join('\n')).toMatch(/rust-ok[\s\S]*按库编译通过[\s\S]*lesson.md:10（块内第 2 行）/);
  expect(fs.readdirSync(tmp)).toEqual([]);
}, 60000);

it.skipIf(!has('python'))('Python 输出、异常与 YAML 题目清单按实际文件行定位', () => {
  const { root, tmp } = fixture('~~~python\nprint("python-ok")\n~~~',
    '- statement: |\n    示例\n    ~~~python\n    x = 1\n    raise ValueError(x)\n    ~~~');
  const r = checkListings(root, ['cs.data.one'], { tmp });
  expect(r.counts).toEqual({ 通过: 1, 失败: 1, 跳过: 0 });
  expect(r.messages.join('\n')).toMatch(/python-ok[\s\S]*problems.yaml:5（块内第 2 行）[\s\S]*ValueError/);
  expect(fs.readdirSync(tmp)).toEqual([]);
});
it('TypeScript 单独检查每段，DOM 类型可用，类型错误带行号', () => {
  const { root, tmp } = fixture('~~~typescript\nconst x = document.title;\n~~~\n~~~typescript\nconst x: number = "错";\n~~~');
  const r = checkListings(root, ['cs'], { tmp });
  expect(r.counts).toEqual({ 通过: 1, 失败: 1, 跳过: 0 });
  expect(r.messages.join('\n')).toMatch(/lesson.md:5（块内第 1 行）[\s\S]*TS2322/);
  expect(checkListings(root, ['cs.other']).ok).toBe(false);
  expect(fs.readdirSync(tmp)).toEqual([]);
}, 60000);
it('PATH 中无 rustc、Python 时逐种说明并跳过', () => {
  const { root, tmp } = fixture('~~~rust\nfn main() {}\n~~~\n~~~python\nprint(1)\n~~~');
  const r = checkListings(root, [], { tmp, env: pathEnv(tmp) });
  expect(r.counts).toEqual({ 通过: 0, 失败: 0, 跳过: 2 });
  expect(r.messages.join('\n')).toMatch(/找不到 rustc[\s\S]*找不到 Python/);
  expect(fs.readdirSync(tmp)).toEqual([]);
});
it.skipIf(!has('python'))('在无第三方包的独立 Python 环境中确实缺 NumPy', () => {
  const { root, tmp } = fixture('~~~python\nimport numpy as np\nprint(np.zeros(2))\n~~~');
  const envDir = path.join(root, 'venv');
  const venv = spawnSync('python', ['-I', '-m', 'venv', '--without-pip', envDir], { windowsHide: true, encoding: 'utf8' });
  expect(venv.status, venv.stderr).toBe(0);
  const env = pathEnv(path.join(envDir, process.platform === 'win32' ? 'Scripts' : 'bin'));
  const r = checkListings(root, [], { env, tmp });
  expect(r.counts).toEqual({ 通过: 0, 失败: 0, 跳过: 1 });
  expect(r.messages.join('\n')).toContain('缺 NumPy，没有检查');
  expect(fs.readdirSync(tmp)).toEqual([]);
}, 30000);

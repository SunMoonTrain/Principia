// 内容编译器的验收用例（docs/plan.md「给写代码 agent 的提示词」里台阶 1 的验收）：
// 把仓库里的 content/ 拷到临时目录，逐条故意改坏，确认构建失败并指出文件和行号。

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import type { Diagnostic, Rich } from '../shared/content-types.ts';
import { compileContent } from './compile.ts';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LESSON = 'content/math/analysis/completeness/lesson.md';
const PROBLEMS = 'content/math/analysis/completeness/problems.yaml';
const LIMITS = 'content/math/analysis/sequences-limits/lesson.md';

const roots: string[] = [];

function fixture(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'principia-test-'));
  fs.cpSync(path.join(repo, 'content'), path.join(root, 'content'), { recursive: true });
  roots.push(root);
  return root;
}

function edit(root: string, file: string, from: string | RegExp, to: string): number {
  const full = path.join(root, file);
  const text = fs.readFileSync(full, 'utf8');
  const index = typeof from === 'string' ? text.indexOf(from) : text.search(from);
  if (index < 0) throw new Error(`fixture 里找不到要改的文字：${String(from)}`);
  fs.writeFileSync(full, text.replace(from, to));
  return text.slice(0, index).split('\n').length; // 被改的那一行
}

function errors(root: string): Diagnostic[] {
  const result = compileContent(root);
  expect(result.report.ok).toBe(false);
  expect(result.files).toBeNull();
  return result.report.errors;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('样例内容', () => {
  it('构建通过，三节的层级依次是 0、1、2', () => {
    const result = compileContent(repo);
    expect(result.report.errors).toEqual([]);
    const levels = Object.fromEntries(result.graph!.lessons.map((l) => [l.id, l.level]));
    expect(levels).toEqual({
      'math.analysis.sequences-limits': 0,
      'math.analysis.completeness': 1,
      'math.analysis.bounded-monotone': 2,
    });
  });

  it('completeness 有固定结构的各部分和 8 道题', () => {
    const lesson = compileContent(repo).packs!.get('math.analysis')!.lessons['math.analysis.completeness'];
    expect(Object.keys(lesson.sections)).toEqual(['question', 'explanation', 'picture', 'examples', 'misconceptions']);
    expect(lesson.problems.map((p) => `${p.id}:${p.tier}`)).toEqual([
      'p1:easy',
      'p2:easy',
      'p3:medium',
      'p4:medium',
      'p5:hard',
      'p6:hard',
      'p7:thinking',
      'p8:thinking',
    ]);
  });

  // 把 hast 写成「文字 <元素> [不折行的组]」的简式，方便比对
  const outline = (nodes: Rich['children']): string =>
    nodes
      .map((c) => (c.type === 'text' ? JSON.stringify(c.value) : c.type === 'element' ? (c.tagName === 'span' ? `[${outline(c.children)}]` : `<${c.tagName}>`) : ''))
      .join(' ');

  it('行内公式和汉字之间自动留一个空格；挨着中文标点时不留，且标点和公式不分开折行', () => {
    const pack = compileContent(repo).packs!.get('math.analysis')!;
    expect(outline(pack.glossary['math.analysis.sequence-limit'].brief.children)).toBe(
      '"数列 " <x-math> " 越来越接近 " [<x-math> "："] "任给 " [<x-math> "，"] "从某一项起都有 " [<x-math> "。"]',
    );
  });

  it('作者手动写的空格也归成一个，标点前的空格去掉', () => {
    const root = fixture();
    edit(root, LESSON, '设$A\\subseteq\\R$。', '设   $A\\subseteq\\R$  。');
    edit(root, LESSON, '就说$M$是$A$的', '就说  $M$  是$A$的');
    const lesson = compileContent(root).packs!.get('math.analysis')!.lessons['math.analysis.completeness'];
    const para = lesson.sections.explanation.children.find(
      (c) => c.type === 'element' && c.tagName === 'x-anchor' && JSON.stringify(c).includes('"如果实数 "'),
    );
    expect(para).toBeDefined();
    const text = outline((para as { children: Rich['children'] }).children.flatMap((c) => (c.type === 'element' && c.tagName === 'p' ? c.children : [])));
    expect(text.startsWith('"设 " [<x-math> "。"] "如果实数 " <x-math>')).toBe(true);
    expect(text).toContain('[<x-math> "，"] "就说 " <x-math> " 是 " <x-math> " 的"');
  });

  it('锚点段落包在 x-anchor 里（网站把讲解里的显示成定义卡片）', () => {
    const lesson = compileContent(repo).packs!.get('math.analysis')!.lessons['math.analysis.completeness'];
    const anchors = lesson.sections.explanation.children.flatMap((c) =>
      c.type === 'element' && c.tagName === 'x-anchor' ? [c.properties.dataAnchor] : [],
    );
    expect(anchors).toEqual(['def-upper-bound', 'def-supremum', 'def-maximum', 'def-infimum', 'def-supremum-principle']);
  });

  it('三级标题带 id，供目录栏跳转', () => {
    const lesson = compileContent(repo).packs!.get('math.analysis')!.lessons['math.analysis.completeness'];
    const ids = lesson.sections.explanation.children.flatMap((c) => (c.type === 'element' && c.tagName === 'h3' ? [c.properties.id] : []));
    expect(ids).toEqual(['h-explanation-1', 'h-explanation-2', 'h-explanation-3']);
  });

  it('同一个三级标题下同一个术语标了两次，只有第一次成为术语标记；换了三级标题重新算', () => {
    const root = fixture();
    // 「为什么这样定义」那段在三级标题「上界与上确界」下，前一段已经标过「上确界」
    edit(root, LESSON, '也就是上确界。上确界的第二个条件', '也就是:term[上确界]{id="math.analysis.supremum"}。:term[上确界]{id="math.analysis.supremum"}的第二个条件');
    const lesson = compileContent(root).packs!.get('math.analysis')!.lessons['math.analysis.completeness'];
    const marks = (section: Rich): number => JSON.stringify(section).match(/"dataTermId":"math\.analysis\.supremum"/g)?.length ?? 0;
    // 讲解里「上界与上确界」「确界原理」两个三级标题下各算一次
    expect(marks(lesson.sections.explanation)).toBe(2);
  });

  it('题目文字里每个字段各算一块范围', () => {
    const lesson = compileContent(repo).packs!.get('math.analysis')!.lessons['math.analysis.completeness'];
    const p2 = lesson.problems[1];
    expect(JSON.stringify(p2.statement)).toContain('"dataTermId":"math.analysis.maximum"');
    expect(JSON.stringify(p2.hints[0])).toContain('"dataTermId":"math.analysis.supremum"');
  });
});

describe('故意改坏，构建失败并指出文件和行号', () => {
  it('不存在的 KaTeX 命令', () => {
    const root = fixture();
    const line = edit(root, LESSON, 'c-b &= \\frac{2-b^2}{b+2}', 'c-b &= \\notacommand{2-b^2}{b+2}');
    const [e] = errors(root);
    expect(e).toMatchObject({ file: LESSON, line });
    expect(e.message).toContain('\\notacommand');
    expect(e.detail).toContain('\\notacommand{2-b^2}{b+2}');
  });

  it('前置形成环，列出环上所有小节', () => {
    const root = fixture();
    edit(root, LIMITS, 'prerequisites: []', 'prerequisites: [math.analysis.bounded-monotone]');
    const [e] = errors(root);
    for (const id of ['math.analysis.sequences-limits', 'math.analysis.completeness', 'math.analysis.bounded-monotone']) {
      expect(e.message).toContain(id);
    }
  });

  it('题目文字改用双引号写 \\theta', () => {
    const root = fixture();
    const line = edit(root, PROBLEMS, /statement: \|\n {4}设\$A=\\\{x\\in\\R : x\^2<3\\\}\$，求\$\\sup A\$。/, 'statement: "设$\\theta$是$A=(0,1)$的上确界，求$\\theta$。"');
    const errs = errors(root);
    expect(errs.every((e) => e.file === PROBLEMS && e.line === line)).toBe(true);
    expect(errs.some((e) => e.message.includes('U+0009'))).toBe(true);
  });

  it('文件头 id 和路径不一致', () => {
    const root = fixture();
    const line = edit(root, LESSON, 'id: math.analysis.completeness', 'id: math.analysis.real-completeness');
    expect(errors(root)).toMatchObject([{ file: LESSON, line, message: expect.stringContaining('不一致') }]);
  });

  it('题面写「保留三位有效数字」却不写 tolerance', () => {
    const root = fixture();
    const line = edit(root, PROBLEMS, '求$\\sup A$。\n', '求$\\sup A$，结果保留三位有效数字。\n');
    expect(errors(root)).toMatchObject([{ file: PROBLEMS, line, message: expect.stringContaining('tolerance') }]);
  });

  it('题目少于 8 道', () => {
    const root = fixture();
    const file = path.join(root, PROBLEMS);
    const text = fs.readFileSync(file, 'utf8');
    fs.writeFileSync(file, text.slice(0, text.indexOf('\n- id: p8') + 1));
    expect(errors(root)).toMatchObject([{ file: PROBLEMS, message: expect.stringContaining('这里有 7 道') }]);
  });

  it('正文标记了术语表里没有的术语', () => {
    const root = fixture();
    const line = edit(root, LESSON, '{id="math.analysis.upper-bound"}（upper bound）', '{id="math.analysis.upper-bnd"}（upper bound）');
    expect(errors(root)).toMatchObject([{ file: LESSON, line, message: expect.stringContaining('math.analysis.upper-bnd') }]);
  });

  it('不允许的二级标题', () => {
    const root = fixture();
    const line = edit(root, LESSON, '## 常见误区', '## 小结');
    expect(errors(root)).toMatchObject([{ file: LESSON, line, message: expect.stringContaining('不允许的二级标题') }]);
  });

  it('一句话总结超过 30 字', () => {
    const root = fixture();
    edit(root, LESSON, '实数轴上没有洞：有上界的非空集合一定有最小上界。', '实数轴上没有洞：任何一个有上界的非空实数集合都一定在实数里有一个最小的上界。');
    expect(errors(root)[0].message).toContain('不超过 30 字');
  });

  it('标准答案是 ∞', () => {
    const root = fixture();
    edit(root, PROBLEMS, 'value: sqrt(3)', 'value: 1/0');
    expect(errors(root)[0].message).toContain('∞');
  });

  it('前置引用了不存在的小节', () => {
    const root = fixture();
    const line = edit(root, LIMITS, 'prerequisites: []', 'prerequisites: [math.analysis.nothing]');
    expect(errors(root)).toMatchObject([{ file: LIMITS, line, message: expect.stringContaining('不存在') }]);
  });

  it('术语的定义锚点不存在', () => {
    const root = fixture();
    edit(root, 'content/math/analysis/_domain.yaml', 'anchor: def-supremum\n', 'anchor: def-sup\n');
    expect(errors(root)[0].message).toContain('def-sup');
  });
});

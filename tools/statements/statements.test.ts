import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { sourceText } from '../../compiler/markdown.ts';
import { exportStatements } from './lib.ts';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const PROBLEMS = 'content/math/analysis/completeness/problems.yaml';

const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('只导出题干', () => {
  it('题干、选项、作答方式和网页上一样；公式原样，术语标记换成文字；带本领域的符号宏', () => {
    const { text, unmatched, failures } = exportStatements(repo, { scopes: ['math.analysis.completeness'], tiers: [] });
    expect(unmatched).toEqual([]);
    expect(failures).toEqual([]);
    expect(text).toContain('## math.analysis.completeness　实数的完备性');
    expect(text.match(/^### p\d　/gm)).toEqual(['### p1　', '### p2　', '### p3　', '### p4　', '### p5　', '### p6　', '### p7　', '### p8　']);
    expect(text).toContain('### p1　简单\n\n设$A=\\{x\\in\\R : x^2<3\\}$，求$\\sup A$。\n\n作答：填一个数');
    expect(text).toContain('下面哪些集合有最大元（也就是上确界属于这个集合）？');
    expect(text).not.toContain(':term');
    expect(text).toContain('A. $[0,1]$\nB. $[0,1)$');
    expect(text).toContain('作答：多选');
    expect(text).toContain('作答：按顺序填 2 个数');
    expect(text).toContain('作答：填 2 个数，不分顺序');
    expect(text).toContain('### p5　难');
    expect(text).toContain('作答：写思路笔记，找 Claude 批改');
    expect(text).toContain('\\R = \\mathbb{R}');
  });

  it('不带标准答案、提示、解答和参考解答', () => {
    const { text } = exportStatements(repo, { scopes: [], tiers: [] });
    const problems = parse(fs.readFileSync(path.join(repo, PROBLEMS), 'utf8')) as Record<string, unknown>[];
    const secrets = problems.flatMap((p) => [...((p.hints as string[]) ?? []), p.solution, p.reference].filter((s): s is string => typeof s === 'string'));
    expect(secrets.length).toBeGreaterThan(24);
    for (const secret of secrets) {
      expect(text).not.toContain(sourceText(secret));
      // 再拿每段的第一行比一次，免得整段比较时因为换行、空格不同而漏过
      const first = sourceText(secret.split('\n')[0]);
      if (first.length > 8) expect(text).not.toContain(first);
    }
    expect(text).not.toContain('sqrt(3)');
    expect(text).not.toMatch(/value|tolerance|hints|solution|reference/);
  });

  it('按范围和难度档筛选；对不上的范围单独列出', () => {
    const result = exportStatements(repo, { scopes: ['math.analysis', 'math.nothing'], tiers: ['easy', 'medium'] });
    expect(result.unmatched).toEqual(['math.nothing']);
    expect(result.text.match(/^### p\d/gm)).toEqual(['### p1', '### p2', '### p3', '### p4']);
    // 按领域导出时，还没有题目的 outline 小节直接跳过；点名时说一声
    expect(result.text).not.toContain('math.analysis.sequences-limits');
    expect(exportStatements(repo, { scopes: ['math.analysis.sequences-limits'], tiers: [] }).text).toContain('（这一节还没有 problems.yaml）');
  });

  it('题目文件写坏了：别的小节照样导出，坏的单独报出来', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'principia-statements-'));
    roots.push(root);
    fs.cpSync(path.join(repo, 'content'), path.join(root, 'content'), { recursive: true });
    fs.writeFileSync(path.join(root, PROBLEMS), '- id: p1\n  statement: [\n');
    const result = exportStatements(root, { scopes: ['math'], tiers: [] });
    expect(result.failures).toHaveLength(1);
    expect(result.failures[0]).toContain(path.normalize(PROBLEMS));
    expect(result.unmatched).toEqual([]);
  });
});

import { describe, expect, it } from 'vitest';
import { claudeText } from './claudeText';

const input = {
  lessonTitle: '实数的完备性',
  number: 5,
  tier: 'hard' as const,
  statement: '设$A,B$是$\\R$的非空、有上界的子集。证明$\\sup(A+B)=\\sup A+\\sup B$。',
  note: '先证 $\\sup A+\\sup B$ 是上界，再用 $\\varepsilon$ 证明它最小。',
  hintsShown: 2,
  macros: { '\\R': '\\mathbb{R}', '\\N': '\\mathbb{N}' },
};

describe('复制给 Claude', () => {
  it('包含题目原文、笔记、看过第几级提示；只列用到的符号约定', () => {
    const text = claudeText(input);
    expect(text).toContain('【题目】《实数的完备性》第 5 题\n设$A,B$是$\\R$的非空、有上界的子集。');
    expect(text).toContain('【我的思路笔记】\n先证 $\\sup A+\\sup B$ 是上界');
    expect(text).toContain('【看过的提示】看过前 2 级提示（共 3 级：方向、关键步骤、完整解答）。');
    expect(text).toContain('【符号约定】\n\\R 表示 \\mathbb{R}');
    expect(text).not.toContain('\\N 表示');
    expect(text).toContain('通过、部分或没过');
  });

  it('没写笔记、没看提示、看过完整解答时的写法', () => {
    expect(claudeText({ ...input, note: '  ', hintsShown: 0 })).toContain('（还没写笔记）');
    expect(claudeText({ ...input, hintsShown: 0 })).toContain('【看过的提示】没看提示。');
    expect(claudeText({ ...input, hintsShown: 3 })).toContain('看过全部 3 级提示（第 3 级是完整解答）');
  });

  it('宏名后面紧跟字母时是另一个命令（\\Re 不算用了 \\R）', () => {
    expect(claudeText({ ...input, statement: '$\\Re z$', note: '' })).not.toContain('【符号约定】');
  });
});

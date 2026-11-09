import { describe, expect, it } from 'vitest';
import { suspectTex } from './tex.ts';

/** 每处可疑的地方写成「原文 → 本来的写法」，行末反斜杠写成「行末」。 */
function suspects(tex: string): string[] {
  return suspectTex(tex).map((s) => {
    const m = /「(.+?)」是不是 (\S+?)？/.exec(s.message);
    return m ? `${m[1]} → ${m[2]}` : s.message.includes('末尾只有一个反斜杠') ? '行末' : s.message;
  });
}

describe('公式能渲染、但多半是反斜杠被吃掉了的地方', () => {
  it('不带反斜杠的命令名，包括紧跟在变量、数字后面的', () => {
    expect(suspects('frac{1}{2}+dot q')).toEqual(['frac → \\frac', 'dot → \\dot']);
    expect(suspects('m\\ddot x=-mddot y+2sin x')).toEqual(['mddot → m\\ddot', 'sin → \\sin']);
  });

  it('\\n、\\r 开头的命令被吃成换行，只看行首剩下的部分', () => {
    // JS 字符串里的 \n 就是换行：\nabla 只剩「换行 + abla」，\rho 的回车读进来时也变成换行
    expect(suspects('\nabla\\cdot E=\nho_0')).toEqual(['abla → \\nabla', 'ho → \\rho']);
    expect(suspects('a\\neq b+ho+abla')).toEqual([]);
  });

  it('多行公式行末的换行只剩一个反斜杠', () => {
    expect(suspects('a&=b,\\\nc&=d')).toEqual(['行末']);
    expect(suspects('a&=b,\\ \nc&=d')).toEqual(['行末']);
    expect(suspects('a&=b,\\\\\nc&=d')).toEqual([]);
  });

  it('正常写法不报：命令、文字参数、下标缩写、变量乘积、控制空格', () => {
    for (const tex of [
      'v_{max}+F_{ext}+E_{int}+T_{eq}',
      'mgl\\cos\\theta+\\alpha\\beta',
      '\\text{sup 与 inf}+\\operatorname{tr}A+\\mathrm{det}+\\operatorname*{arg\\,max}',
      'x^ne^{-x}',
      '\\begin{pmatrix}1&0\\\\0&1\\end{pmatrix}',
      'f(x)\\to L\\ (x\\to a),\\ \\forall x',
      '\\lim_{n\\to\\infty}\\int_0^1\\sin x\\,\\mathrm{d}x',
    ]) {
      expect(suspects(tex), tex).toEqual([]);
    }
  });
});

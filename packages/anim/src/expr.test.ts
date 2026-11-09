import { describe, expect, it } from 'vitest';
import { checkExpr, compileExpr } from './expr.ts';

describe('动画参数里的式子', () => {
  it('翻译成函数，按变量顺序取值；常数、乘方、隐式乘法、log 都和 math.js 一样', () => {
    const f = compileExpr('-sin(x) - b*y', ['x', 'y', 'b']);
    expect(f([Math.PI / 2, 2, 0.5])).toBeCloseTo(-1 - 1, 12);
    expect(compileExpr('2x^2 + pi', ['x'])([3])).toBeCloseTo(18 + Math.PI, 12);
    expect(compileExpr('log(e^2) + log(8, 2) + ln(1)', [])([])).toBeCloseTo(5, 12);
    expect(compileExpr('mod(-1, 3)', [])([])).toBe(2);
    expect(compileExpr(1.5, [])([])).toBe(1.5);
  });

  it('滑块和常数重名时以滑块为准（phi、tau 可以当滑块名）', () => {
    expect(compileExpr('phi', ['phi'])([0.3])).toBe(0.3);
    expect(compileExpr('phi', [])([])).toBeCloseTo(1.618033988749895, 12);
  });

  it('求和 sum(k, 下限, 上限, 式子)、连乘 prod：上下限可以用变量和滑块，可以嵌套', () => {
    expect(compileExpr('sum(k, 1, n, 1/k^2)', ['n'])([3])).toBeCloseTo(1 + 1 / 4 + 1 / 9, 12);
    expect(compileExpr('prod(j, 1, 5, j)', [])([])).toBe(120);
    // 方波的傅里叶部分和：x = π/2 处是 4/π·(1 − 1/3 + 1/5 − …) → 1
    const square = compileExpr('4/pi * sum(k, 1, N, sin((2k - 1)*x) / (2k - 1))', ['x', 'N']);
    expect(square([Math.PI / 2, 2000])).toBeCloseTo(1, 3);
    // 上限带一点舍入误差时仍取到 3；上限小于下限时和是 0、积是 1
    expect(compileExpr('sum(k, 1, m, 1)', ['m'])([2.9999999999])).toBe(3);
    expect(compileExpr('sum(k, 1, 0, k) + prod(k, 5, 4, k)', [])([])).toBe(1);
    // 嵌套：Σ_{i=1}^{3} Σ_{j=1}^{i} j = 1 + 3 + 6
    expect(compileExpr('sum(i, 1, 3, sum(j, 1, i, j))', [])([])).toBe(10);
    // 项数超过上限、上下限没有定义时，算作没有定义
    expect(compileExpr('sum(k, 1, 1e6, 1)', [])([])).toBeNaN();
    expect(compileExpr('sum(k, 1, sqrt(-1), 1)', [])([])).toBeNaN();
  });

  it('求和写错、求和变量和已有的名字重名时报错；求和变量只在第四个参数里有效', () => {
    expect(checkExpr('sum(k, 1, n)', ['n'])).toBe('sum 要写成 sum(k, 下限, 上限, 式子)');
    expect(checkExpr('sum(2, 1, n, k)', ['n'])).toMatch(/sum 要写成/);
    expect(checkExpr('sum(n, 1, n, n)', ['n'])).toBe('sum 的变量「n」和已有的名字重名，换一个名字');
    expect(checkExpr('prod(e, 1, 3, e)', [])).toMatch(/重名/);
    expect(checkExpr('sum(k, 1, 3, k) + k', [])).toBe('不认识的名字「k」');
  });

  it('不认识的名字、不能用的函数、比较和赋值都报错，消息能直接给人看', () => {
    expect(checkExpr('x + z', ['x'])).toBe('不认识的名字「z」');
    expect(checkExpr('foo(x)', ['x'])).toBe('不能用的函数「foo」');
    expect(checkExpr('x > 1', ['x'])).toMatch(/不支持的运算/);
    expect(checkExpr('a = 1', [])).toMatch(/不支持的写法/);
    expect(checkExpr('sin(', [])).toMatch(/写错了/);
    expect(checkExpr('-sin(x) - b*y', ['x', 'y', 'b'])).toBeNull();
  });
});

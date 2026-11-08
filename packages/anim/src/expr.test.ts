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

  it('不认识的名字、不能用的函数、比较和赋值都报错，消息能直接给人看', () => {
    expect(checkExpr('x + z', ['x'])).toBe('不认识的名字「z」');
    expect(checkExpr('foo(x)', ['x'])).toBe('不能用的函数「foo」');
    expect(checkExpr('x > 1', ['x'])).toMatch(/不支持的运算/);
    expect(checkExpr('a = 1', [])).toMatch(/不支持的写法/);
    expect(checkExpr('sin(', [])).toMatch(/写错了/);
    expect(checkExpr('-sin(x) - b*y', ['x', 'y', 'b'])).toBeNull();
  });
});

import { describe, expect, it } from 'vitest';
import { evaluateExpression, evaluateValue } from './expr.ts';

// plan.md「测试用例与验收 / 判题」里和解析器有关的输入；容差比较是台阶 2 的事。
describe('evaluateExpression', () => {
  it.each([
    ['1/2', 0.5],
    ['0.5004', 0.5004],
    ['0.51', 0.51],
    ['1e-12', 1e-12],
    ['2pi', 2 * Math.PI],
    ['sqrt(2)', Math.SQRT2],
    ['ln(e)', 1],
    ['（1+1）×3', 6],
    ['√(4)', 2],
    ['3!', 6],
    ['atanh(0.6)', Math.log(2)],
    ['artanh(3/5)', Math.log(2)],
    ['arcsinh(1)', Math.log(1 + Math.SQRT2)],
    ['acosh(2)', Math.log(2 + Math.sqrt(3))],
  ])('%s = %d', (input, value) => {
    const r = evaluateExpression(input);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBeCloseTo(value, 12);
  });

  it('pi/2 能求值（标准答案 1.5708）', () => {
    const r = evaluateExpression('pi/2');
    expect(r.ok && Math.abs(r.value - 1.5708) < 1e-4).toBe(true);
  });

  it.each([
    ['abc', 'unknown-symbol'],
    ['', 'empty'],
    ['2 s', 'unit'],
    ['3 cm', 'unit'],
    ['sqrt(-1)', 'complex'],
    ['atanh(2)', 'complex'],
    ['acosh(0.5)', 'complex'],
    ['1/0', 'infinite'],
    ['x = 1', 'unsupported'],
    ['[1, 2]', 'unsupported'],
    ['1 +', 'syntax'],
  ])('%s 是格式错误（%s）', (input, code) => {
    const r = evaluateExpression(input);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe(code);
  });
});

describe('evaluateValue', () => {
  it('YAML 里的数和表达式字符串都能求值', () => {
    expect(evaluateValue(1)).toEqual({ ok: true, value: 1 });
    expect(evaluateValue('2*pi*sqrt(1/9.8)')).toMatchObject({ ok: true });
  });

  it('∞ 不能作答案', () => {
    expect(evaluateValue(Number.POSITIVE_INFINITY)).toMatchObject({ ok: false, code: 'infinite' });
  });
});

// 动画参数里的式子（如 "-sin(x) - b*y"）：用 math.js 解析，再翻译成普通的 JavaScript 函数。
// 每帧要算成千上万次，直接用 math.js 求值太慢；翻译以后就是原生的四则运算和 Math 函数。
// 只认四则运算、乘方、括号和下面列出的函数、常数；别的写法在构建时就报错（编译器调用同一个函数检查）。

import { parse, type MathNode } from 'mathjs';

/** 编译好的式子：按 names 的顺序传入变量的值。 */
export type CompiledExpr = (values: ArrayLike<number>) => number;

const FUNCTIONS: Record<string, string> = {
  sin: 'Math.sin',
  cos: 'Math.cos',
  tan: 'Math.tan',
  asin: 'Math.asin',
  acos: 'Math.acos',
  atan: 'Math.atan',
  atan2: 'Math.atan2',
  sinh: 'Math.sinh',
  cosh: 'Math.cosh',
  tanh: 'Math.tanh',
  exp: 'Math.exp',
  ln: 'Math.log',
  log10: 'Math.log10',
  log2: 'Math.log2',
  sqrt: 'Math.sqrt',
  cbrt: 'Math.cbrt',
  abs: 'Math.abs',
  sign: 'Math.sign',
  floor: 'Math.floor',
  ceil: 'Math.ceil',
  round: 'Math.round',
  min: 'Math.min',
  max: 'Math.max',
  hypot: 'Math.hypot',
  pow: 'Math.pow',
};

/** 常数；和滑块、变量重名时以变量为准（如滑块叫 phi）。 */
const CONSTANTS: Record<string, string> = {
  pi: 'Math.PI',
  PI: 'Math.PI',
  e: 'Math.E',
  E: 'Math.E',
  tau: '(2*Math.PI)',
  phi: '1.618033988749895',
};

export class ExprError extends Error {}

function translate(node: MathNode, index: Map<string, number>): string {
  switch (node.type) {
    case 'ConstantNode': {
      const value = (node as unknown as { value: unknown }).value;
      if (typeof value !== 'number') throw new ExprError(`不认识的常量 ${String(value)}`);
      return `(${value})`;
    }
    case 'SymbolNode': {
      const name = (node as unknown as { name: string }).name;
      const i = index.get(name);
      if (i !== undefined) return `v[${i}]`;
      if (Object.hasOwn(CONSTANTS, name)) return CONSTANTS[name];
      throw new ExprError(`不认识的名字「${name}」`);
    }
    case 'ParenthesisNode':
      return `(${translate((node as unknown as { content: MathNode }).content, index)})`;
    case 'OperatorNode': {
      const op = node as unknown as { fn: string; args: MathNode[] };
      const [a, b] = op.args.map((arg) => translate(arg, index));
      switch (op.fn) {
        case 'add':
          return `(${a}+${b})`;
        case 'subtract':
          return `(${a}-${b})`;
        case 'multiply':
          return `(${a}*${b})`;
        case 'divide':
          return `(${a}/${b})`;
        case 'pow':
          return `Math.pow(${a},${b})`;
        case 'unaryMinus':
          return `(-${a})`;
        case 'unaryPlus':
          return `(+${a})`;
        case 'mod':
          return `((${a}%${b}+${b})%${b})`;
        default:
          throw new ExprError(`不支持的运算「${op.fn}」`);
      }
    }
    case 'FunctionNode': {
      const call = node as unknown as { fn: { name?: string }; args: MathNode[] };
      const name = call.fn.name ?? '';
      const args = call.args.map((arg) => translate(arg, index));
      if (name === 'log') {
        // math.js 的 log(x) 是自然对数，log(x, b) 以 b 为底
        if (args.length === 1) return `Math.log(${args[0]})`;
        if (args.length === 2) return `(Math.log(${args[0]})/Math.log(${args[1]}))`;
      }
      if (name === 'mod' && args.length === 2) return `((${args[0]}%${args[1]}+${args[1]})%${args[1]})`;
      if (Object.hasOwn(FUNCTIONS, name)) return `${FUNCTIONS[name]}(${args.join(',')})`;
      throw new ExprError(`不能用的函数「${name}」`);
    }
    default:
      throw new ExprError(`不支持的写法（${node.type}）`);
  }
}

/**
 * 把式子编译成函数；names 是式子里能用的变量（状态变量、时间 t、滑块名……），调用时按这个顺序传值。
 * 式子也可以直接是数字。写错时抛 ExprError，消息可以直接给人看。
 */
export function compileExpr(src: string | number, names: readonly string[]): CompiledExpr {
  if (typeof src === 'number') {
    if (!Number.isFinite(src)) throw new ExprError('数值必须是有限的数');
    return () => src;
  }
  let node: MathNode;
  try {
    node = parse(src);
  } catch (error) {
    throw new ExprError(`式子「${src}」写错了：${(error as Error).message}`);
  }
  const index = new Map(names.map((name, i) => [name, i]));
  const body = translate(node, index);
  return new Function('v', `"use strict"; return ${body};`) as CompiledExpr;
}

/** 只检查能不能编译（构建时用）；能就返回 null，不能就返回原因。 */
export function checkExpr(src: string | number, names: readonly string[]): string | null {
  try {
    compileExpr(src, names);
    return null;
  } catch (error) {
    return (error as Error).message;
  }
}

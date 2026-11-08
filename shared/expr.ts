// 数学表达式求值：判题器（台阶 2 起）和内容编译器（求标准答案 value）共用同一个解析器，
// 见 docs/plan.md「题目与判题」。只接受数、四则运算、乘方、阶乘、括号、白名单里的函数和常数；
// 单位、矩阵、赋值、比较等一律算格式错误。

import { all, create, type MathNode } from 'mathjs';

const math = create(all);

/** 允许的常数（名字 → 值）。`i`、`Infinity` 不在其中：答案只能是有限实数。 */
const CONSTANTS: Record<string, number> = {
  pi: Math.PI,
  e: Math.E,
  tau: 2 * Math.PI,
};

/** 允许的函数：输入里写的名字 → math.js 里的名字。 */
const FUNCTIONS: Record<string, string> = {
  sqrt: 'sqrt',
  cbrt: 'cbrt',
  nthRoot: 'nthRoot',
  exp: 'exp',
  log: 'log',
  ln: 'log',
  log10: 'log10',
  log2: 'log2',
  sin: 'sin',
  cos: 'cos',
  tan: 'tan',
  sec: 'sec',
  csc: 'csc',
  cot: 'cot',
  asin: 'asin',
  acos: 'acos',
  atan: 'atan',
  arcsin: 'asin',
  arccos: 'acos',
  arctan: 'atan',
  sinh: 'sinh',
  cosh: 'cosh',
  tanh: 'tanh',
  abs: 'abs',
  factorial: 'factorial',
  pow: 'pow',
};

const OPERATORS = new Set(['add', 'subtract', 'multiply', 'divide', 'pow', 'unaryMinus', 'unaryPlus', 'factorial']);

export type EvalErrorCode =
  | 'empty'
  | 'syntax'
  | 'unsupported'
  | 'unknown-symbol'
  | 'unit'
  | 'complex'
  | 'infinite'
  | 'nan';

export type EvalResult =
  | { ok: true; value: number }
  | { ok: false; code: EvalErrorCode; message: string };

/** 把全角符号、数学符号换成解析器认识的写法（iPad 中文键盘常打出全角括号）。 */
export function normalizeExpression(input: string): string {
  return input
    .normalize('NFKC')
    .replace(/[−–]/g, '-')
    .replace(/[×·⋅]/g, '*')
    .replace(/÷/g, '/')
    .replace(/π/g, 'pi')
    // √3、√x 补上括号；√(…) 直接换成 sqrt(…)
    .replace(/√\s*([0-9.]+|[A-Za-z]+)/g, 'sqrt($1)')
    .replace(/√/g, 'sqrt')
    .trim();
}

class Rejected extends Error {
  constructor(
    readonly code: EvalErrorCode,
    message: string,
  ) {
    super(message);
  }
}

function check(node: MathNode): void {
  switch (node.type) {
    case 'ConstantNode': {
      const value = (node as unknown as { value: unknown }).value;
      if (typeof value !== 'number') throw new Rejected('unsupported', '只能填数和式子');
      return;
    }
    case 'SymbolNode': {
      const name = (node as unknown as { name: string }).name;
      if (Object.hasOwn(CONSTANTS, name)) return;
      if (math.Unit.isValuelessUnit(name)) throw new Rejected('unit', `不要带单位：${name}`);
      throw new Rejected('unknown-symbol', `不认识的名字：${name}`);
    }
    case 'ParenthesisNode':
      check((node as unknown as { content: MathNode }).content);
      return;
    case 'OperatorNode': {
      const op = node as unknown as { fn: string; op: string; args: MathNode[] };
      if (!OPERATORS.has(op.fn)) throw new Rejected('unsupported', `不支持运算符 ${op.op}`);
      op.args.forEach(check);
      return;
    }
    case 'FunctionNode': {
      const fn = node as unknown as { fn: MathNode; args: MathNode[] };
      const name = fn.fn.type === 'SymbolNode' ? (fn.fn as unknown as { name: string }).name : null;
      if (name === null || !Object.hasOwn(FUNCTIONS, name)) {
        throw new Rejected('unknown-symbol', `不认识的函数：${name ?? fn.fn.toString()}`);
      }
      fn.args.forEach(check);
      return;
    }
    default:
      throw new Rejected('unsupported', `不支持这种写法：${node.toString()}`);
  }
}

const scope = new Map<string, unknown>([
  ...Object.entries(CONSTANTS),
  ...Object.entries(FUNCTIONS).map(([name, target]) => [name, (math as unknown as Record<string, unknown>)[target]] as const),
]);

/** 求一个表达式的值。失败时给出可以直接显示给人看的中文说明。 */
export function evaluateExpression(input: string): EvalResult {
  const src = normalizeExpression(input);
  if (src === '') return { ok: false, code: 'empty', message: '请先填写答案' };
  let node: MathNode;
  try {
    node = math.parse(src);
  } catch (error) {
    const at = /char (\d+)/.exec(String(error))?.[1];
    return { ok: false, code: 'syntax', message: at ? `式子写法有误（第 ${at} 个字符附近）` : '式子写法有误' };
  }
  try {
    check(node);
  } catch (error) {
    if (error instanceof Rejected) return { ok: false, code: error.code, message: error.message };
    throw error;
  }
  let value: unknown;
  try {
    value = node.compile().evaluate(new Map(scope));
  } catch {
    return { ok: false, code: 'nan', message: '这个式子算不出值' };
  }
  if (math.isComplex(value)) {
    const c = value as { re: number; im: number };
    if (c.im !== 0) return { ok: false, code: 'complex', message: '结果是复数，不是实数' };
    value = c.re;
  }
  if (typeof value !== 'number') return { ok: false, code: 'unsupported', message: '结果不是一个数' };
  if (Number.isNaN(value)) return { ok: false, code: 'nan', message: '结果不是一个数' };
  if (!Number.isFinite(value)) return { ok: false, code: 'infinite', message: '结果是无穷大' };
  return { ok: true, value };
}

/** 求标准答案 `value` 里的一项：YAML 里可以直接写数，也可以写表达式字符串。 */
export function evaluateValue(raw: unknown): EvalResult {
  if (typeof raw === 'number') {
    if (Number.isNaN(raw)) return { ok: false, code: 'nan', message: '结果不是一个数' };
    if (!Number.isFinite(raw)) return { ok: false, code: 'infinite', message: '结果是无穷大' };
    return { ok: true, value: raw };
  }
  if (typeof raw === 'string') return evaluateExpression(raw);
  return { ok: false, code: 'unsupported', message: '只能写数或表达式字符串' };
}

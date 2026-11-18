import type { Machine, StepResult } from './machine.ts';

export const widths = [4, 8, 16, 32] as const;
export type Width = typeof widths[number];
export const binaryOps = ['add', 'sub', 'and', 'or', 'xor'] as const;
export const unaryOps = ['neg', 'not', 'shl', 'shr', 'sar'] as const;
export type BitOp = { kind: typeof binaryOps[number]; b: number } | { kind: typeof unaryOps[number] }
  | { kind: 'extend'; to: Width; signed?: boolean } | { kind: 'truncate'; to: Width };
export const bitNames = ['a', 'b', 'result', 'signed', 'CF', 'OF', 'ZF', 'SF', 'step'];
export interface BitParams { width: Width; value: number; op?: BitOp }
export const unsigned = (n: number, w: number) => (n >>> 0) % 2 ** w;
export const signed = (n: number, w: number) => n < 2 ** (w - 1) ? n : n - 2 ** w;
export const bit = (n: number, i: number) => (n >>> i) & 1;
export const binary = (n: number, w: number) => n.toString(2).padStart(w, '0');

function initial({ width, value, op }: BitParams) {
  const a = unsigned(value, width);
  return { width, op, a, b: op && 'b' in op ? unsigned(op.b, width) : 0, result: a, resultWidth: width,
    step: 0, carry: 0, CF: 0, OF: 0, ZF: Number(a === 0), SF: bit(a, width - 1) };
}
type State = ReturnType<typeof initial>;

function advance(s: State): StepResult<State> {
  const { a, b, width: w, op } = s;
  if (!op) return { state: s, events: [], done: true };
  const step = s.step + 1;
  const next = { ...s, step };
  let text: string;
  let done = true;
  let touched = ['result'];
  if (op.kind === 'add' || op.kind === 'sub') {
    const sub = op.kind === 'sub';
    const i = step - 1 - Number(sub);
    if (i < 0) {
      next.carry = 1;
      next.result = 0;
      text = 'a − b = a + ~b + 1。把 b 的每一位取反，进位进置 1。';
      done = false;
    } else if (i < w) {
      const x = bit(a, i), y = bit(b, i) ^ Number(sub);
      const sum = x + y + s.carry;
      next.carry = sum >> 1;
      next.result = (i === 0 ? 0 : s.result) + (sum % 2) * 2 ** i;
      touched = ['bit' + i];
      text = '第 ' + i + ' 位：输入 ' + x + ' 和 ' + y + '，进位进 ' + s.carry + '，和 ' + (sum % 2) + '，进位出 ' + next.carry + '。';
      if (i === w - 1) {
        if (s.carry === next.carry) text += '符号位的进位进和进位出相等，有符号结果没有溢出。';
        else if (sub) text += '两数异号，相减后结果与被减数异号，超出有符号范围。';
        else text += x ? '两个负数相加得出非负数，有符号溢出。' : '进位进了符号位：两个正数加出了负数。';
      }
      done = false;
    } else {
      next.CF = sub ? 1 - s.carry : s.carry;
      const sa = signed(a, w), sb = signed(b, w);
      const exact = sub ? sa - sb : sa + sb;
      next.OF = Number(exact !== signed(next.result, w));
      text = sub ? '加法器的进位输出是 ' + s.carry + '，所以借位是 1 − ' + s.carry + ' = ' + next.CF + '。' : '最高位的进位输出是 ' + s.carry + '。';
    }
  } else {
    switch (op.kind) {
      case 'neg':
        next.result = unsigned(-a, w); next.CF = Number(a !== 0); next.OF = Number(a === 2 ** (w - 1));
        text = '逐位取反再加 1，保留低 ' + w + ' 位。'; break;
      case 'not': next.result = unsigned(~a, w); text = '每一位都取 a 对应位的反。'; break;
      case 'and': next.result = (a & b) >>> 0; text = '对应两位都为 1 时结果位为 1。'; break;
      case 'or': next.result = (a | b) >>> 0; text = '对应两位至少有一位为 1 时结果位为 1。'; break;
      case 'xor': next.result = (a ^ b) >>> 0; text = '对应两位不同时结果位为 1。'; break;
      case 'shl':
        next.CF = bit(a, w - 1); next.result = unsigned(a * 2, w);
        text = '每位向左移一格，移出最高位 ' + next.CF + '，低位补 0。'; break;
      case 'shr': case 'sar': {
        const fill = op.kind === 'sar' ? bit(a, w - 1) : 0;
        next.CF = bit(a, 0); next.result = (a >>> 1) + fill * 2 ** (w - 1);
        text = '每位向右移一格，移出最低位 ' + next.CF + '，高位补' + (op.kind === 'sar' ? '符号位 ' : ' ') + fill + '。'; break;
      }
      case 'extend': case 'truncate':
        next.resultWidth = op.to;
        next.result = unsigned(op.kind === 'extend' && op.signed ? signed(a, w) : a, op.to);
        text = op.kind === 'truncate' ? '保留低 ' + op.to + ' 位，丢弃其余高位。' :
          '保留原来的低 ' + w + ' 位，新增高位全部填' + (op.signed ? '符号位 ' + bit(a, w - 1) : ' 0') + '。'; break;
    }
  }
  if (done) {
    next.ZF = Number(next.result === 0); next.SF = bit(next.result, next.resultWidth - 1);
    text += ' CF=' + next.CF + '，OF=' + next.OF + '，ZF=' + next.ZF + '，SF=' + next.SF + '。';
  }
  return { state: next, done, events: [{ text, kind: 'write', touched }] };
}

export const bitsMachine: Machine<BitParams, State> = {
  init: initial, step: advance,
  edit(s, action) {
    if (typeof action !== 'object' || !action || !('operand' in action) || !('index' in action)
      || (action.operand !== 'a' && action.operand !== 'b') || typeof action.index !== 'number'
      || !Number.isInteger(action.index) || action.index < 0 || action.index >= s.width) throw new Error('无效的比特位置');
    const flip = 2 ** action.index;
    const op = action.operand === 'b' && s.op && 'b' in s.op ? { ...s.op, b: (s.b ^ flip) >>> 0 } : s.op;
    return initial({ width: s.width, value: action.operand === 'a' ? (s.a ^ flip) >>> 0 : s.a, op });
  },
  observe: ({ a, b, result, resultWidth, CF, OF, ZF, SF, step }) => ({ a, b, result, signed: signed(result, resultWidth), CF, OF, ZF, SF, step }),
};

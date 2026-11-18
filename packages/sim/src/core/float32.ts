import type { Machine } from './machine.ts';

export const floatNames = ['bits', 'value', 'exponent', 'ulp', 'step', 'stuck', 'error'];
const SIGN = 0x80000000, INF = 0x7f800000, HIDDEN = 0x800000;
const view = new DataView(new ArrayBuffer(4));
export function toBits(value: number) {
  view.setFloat32(0, value);
  return view.getUint32(0);
}
export function fromBits(bits: number) {
  view.setUint32(0, bits);
  return view.getFloat32(0);
}
export const hex32 = (bits: number) => '0x' + bits.toString(16).toUpperCase().padStart(8, '0');

function fields(bits: number) {
  const sign = bits >>> 31, field = (bits >>> 23) & 255, fraction = bits % HIDDEN;
  const exponent = field === 0 ? -126 : field - 127;
  return { sign, field, fraction, exponent, mantissa: fraction + (field ? HIDDEN : 0) };
}

/** 有限 binary32 都是 2^-149 的整数倍，共用这个单位做对齐、加减和舍入。 */
function units(bits: number) {
  const { sign, field, mantissa } = fields(bits);
  return BigInt(sign ? -mantissa : mantissa) << BigInt(Math.max(0, field - 1));
}

function decimal(integer: bigint, places: number) {
  const sign = integer < 0n ? '−' : '';
  const digits = (integer < 0n ? -integer : integer).toString().padStart(places + 1, '0');
  if (!places) return sign + digits;
  const fraction = digits.slice(-places).replace(/0+$/, '');
  return sign + digits.slice(0, -places) + (fraction ? '.' + fraction : '');
}

const five149 = 5n ** 149n;
export function exactDecimal(bits: number) {
  const magnitude = bits % SIGN;
  if (magnitude > INF) return 'NaN';
  if (magnitude === INF) return bits >= SIGN ? '−∞' : '+∞';
  if (bits === SIGN) return '−0';
  return decimal(units(bits) * five149, 149);
}

export function neighbor(bits: number, direction: 1 | -1) {
  if (bits % SIGN > INF || (bits === INF && direction === 1) || (bits === SIGN + INF && direction === -1)) return bits;
  if (bits % SIGN === 0) return direction === 1 ? 1 : SIGN + 1;
  return bits + (bits >= SIGN ? -direction : direction);
}
export function inspect(bits: number) {
  const f = fields(bits);
  return { ...f, bits, value: fromBits(bits), exact: exactDecimal(bits),
    ulp: f.field === 255 ? NaN : 2 ** (f.exponent - 23), previous: neighbor(bits, -1), next: neighbor(bits, 1) };
}

function roundSum(total: bigint, negativeZero: boolean) {
  const negative = total < 0n || (total === 0n && negativeZero);
  const magnitude = total < 0n ? -total : total;
  const shift = Math.max(0, magnitude.toString(2).length - 24);
  const unit = 1n << BigInt(shift);
  const floor = magnitude / unit, rest = magnitude % unit;
  const lower = floor < BigInt(HIDDEN) ? Number(floor) : (shift + 1) * HIDDEN + Number(floor) - HIDDEN;
  const tie = 2n * rest === unit;
  const up = 2n * rest > unit || (tie && (floor & 1n) === 1n);
  const sign = negative ? SIGN : 0;
  return { bits: sign + Math.min(INF, lower + Number(up)), lower: sign + Math.min(INF, lower),
    upper: sign + Math.min(INF, lower + 1), shift, floor, rest, tie, up };
}

export interface AddParams { mode: 'add'; a: number; b: number }
export interface AccParams { mode: 'accumulate'; delta: number; count: number }
export type FloatSteps = AddParams | AccParams;

/** 以输入十进制数为基准；十进制位数和乘法在整数域保留。 */
export function decimalInput(value: number) {
  const [digits, exponent = '0'] = String(value).toLowerCase().split('e');
  const places = (digits.split('.')[1]?.length ?? 0) - Number(exponent);
  const numerator = BigInt(digits.replace('.', ''));
  return { numerator: numerator * 10n ** BigInt(Math.max(0, -places)), places: Math.max(0, places) };
}
function initial(p: FloatSteps) {
  const a = p.mode === 'add' ? toBits(Number(p.a)) : 0;
  const b = toBits(Number(p.mode === 'add' ? p.b : p.delta));
  return { p, a, b, bits: a, step: 0, total: 0n, double: fromBits(a), exact: exactDecimal(a), error: 0, stuck: 0 };
}
type State = ReturnType<typeof initial>;

function alignment(a: number, b: number) {
  const x = fields(a), y = fields(b);
  const small = x.exponent <= y.exponent ? x : y;
  const shift = Math.abs(x.exponent - y.exponent);
  const mantissa = BigInt(small.mantissa);
  const at = (i: number) => i < 0 ? 0 : Number((mantissa >> BigInt(i)) & 1n);
  const sticky = shift > 2 && (mantissa % (1n << BigInt(shift - 2))) !== 0n;
  return '较小阶码的尾数右移 ' + shift + ' 位，对齐后为 ' + (mantissa >> BigInt(shift)).toString(2)
    + '，保护位 G=' + at(shift - 1) + '，舍入位 R=' + at(shift - 2) + '，粘滞位 S=' + Number(sticky) + '。';
}
function unpack(bits: number) {
  const f = fields(bits);
  return '符号 ' + f.sign + '，指数 ' + f.exponent + '，带隐含位的尾数 ' + f.mantissa.toString(2).padStart(24, '0');
}
function addStep(s: State) {
  const next = { ...s, step: s.step + 1 };
  let text: string;
  switch (next.step) {
    case 1: text = '拆开两个加数。a：' + unpack(s.a) + '；b：' + unpack(s.b) + '。'; break;
    case 2: text = '对齐。' + alignment(s.a, s.b); break;
    case 3:
      next.total = units(s.a) + units(s.b);
      text = (s.a >>> 31) === (s.b >>> 31) ? '同号，尾数相加。' : '异号，尾数相减。';
      text += '保留所有低位，精确和为 ' + next.total + ' × 2⁻¹⁴⁹。'; break;
    default: {
      const r = roundSum(s.total, s.a === SIGN && s.b === SIGN);
      if (next.step === 4) text = '规格化。' + (s.total === 0n ? '精确和为零。' :
        '保留的尾数为 ' + r.floor.toString(2) + '，以 2^(' + (r.shift - 149) + ') 为单位，余下 ' + r.rest + ' 个 2⁻¹⁴⁹。');
      else if (next.step === 5) {
        const chosen = exactDecimal(r.bits);
        if (r.lower % SIGN === INF) text = '舍入。精确和的绝对值达到 2¹²⁸，溢出为 ' + chosen + '。';
        else if (r.rest === 0n) text = '舍入。精确和正好等于 ' + chosen + '，无需舍入。';
        else {
          const upper = r.upper % SIGN === INF ? (r.bits >= SIGN ? '−' : '') + '2¹²⁸（溢出边界）' : exactDecimal(r.upper);
          text = '舍入。精确和位于 ' + exactDecimal(r.lower) + ' 和 ' + upper + ' 之间，'
            + (r.tie ? '正好在中间，取尾数为偶的' : '取距离较近的') + '，得到 ' + chosen + '。';
        }
      } else {
        next.bits = r.bits;
        text = '装回 32 位：' + hex32(next.bits) + '，值为 ' + exactDecimal(next.bits) + '。';
      }
      if (next.step >= 5) next.error = Number(r.bits % SIGN === INF ? Infinity : units(r.bits) - s.total) * 2 ** -149;
      next.error = Math.abs(next.error);
    }
  }
  if (next.step >= 3) {
    next.double = s.p.mode === 'add' ? Number(s.p.a) + Number(s.p.b) : next.double;
    next.exact = decimal(next.total * five149, 149);
  }
  return { state: next, events: [{ kind: 'write' as const, text, touched: [next.step === 6 ? 'bits' : 'stage'] }], done: next.step === 6 };
}

export const floatMachine: Machine<FloatSteps, State> = {
  init: initial,
  step(s) {
    if (s.p.mode === 'add') return addStep(s);
    const step = s.step + 1, delta = Number(s.p.delta);
    const bits = toBits(fromBits(s.bits) + fromBits(s.b));
    const { numerator, places } = decimalInput(delta);
    const exact = decimal(numerator * BigInt(step), places);
    const alignedPlaces = Math.max(149, places);
    const error = bits % SIGN === INF ? Infinity : Number(decimal(
      units(bits) * five149 * 10n ** BigInt(alignedPlaces - 149) - numerator * BigInt(step) * 10n ** BigInt(alignedPlaces - places), alignedPlaces).replace('−', '-'));
    const stuck = Number(fromBits(bits) === fromBits(s.bits));
    let text = '第 ' + step + ' 次，单精度结果 ' + exactDecimal(bits) + '，精确累加和 ' + exact + '。';
    if (stuck) {
      const gap = Math.abs(fromBits(neighbor(s.bits, delta < 0 ? -1 : 1)) - fromBits(s.bits));
      if (!Number.isFinite(fromBits(s.bits))) text += '上一步已经溢出。';
      else if (Math.abs(fromBits(s.b)) === gap / 2) text += '正好半个 ULP，取尾数为偶的原值。';
      else text += '加的数不到半个 ULP，被舍掉了。';
    }
    return { state: { ...s, bits, step, double: s.double + delta, exact, error: Math.abs(error), stuck },
      events: [{ kind: 'write', touched: ['bits'], text }], done: step === s.p.count };
  },
  observe(s) {
    const { exponent, ulp, value } = inspect(s.bits);
    return { bits: s.bits, exponent, ulp, value, step: s.step, stuck: s.stuck, error: s.error };
  },
};

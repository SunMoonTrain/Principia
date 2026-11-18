import { expect, it } from 'vitest';
import { bitsMachine, widths, type BitOp, type Width } from './bits';
import { accumulationPlot, alignment, binarySum, exactDecimal, floatMachine, fromBits, inspect, neighbor, toBits, type FloatSteps } from './float32';
import { History } from './machine';
import { characterLabel, encodeCodePoint } from './utf';

function runBits(a: number, op: BitOp, width: Width = 8) {
  const h = new History(bitsMachine, { value: a, op, width }, 0);
  h.seek(40);
  return h;
}
function runFloat(p: FloatSteps) {
  const h = new History(floatMachine, p, 0);
  h.seek(1000);
  return h;
}
function rng(seed: number) {
  return () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return seed >>> 0; };
}
it('补码进位、借位、扩展和截断按实际位宽计算', () => {
  const h = runBits(127, { kind: 'add', b: 1 });
  expect(h.state).toMatchObject({ result: 128, CF: 0, OF: 1, step: 9 });
  expect(h.eventsAt(8)[0].text).toContain('进位进了符号位：两个正数加出了负数');
  expect(runBits(255, { kind: 'add', b: 1 }).state).toMatchObject({ result: 0, CF: 1, OF: 0, ZF: 1 });
  expect(runBits(-128, { kind: 'neg' }).state).toMatchObject({ result: 128, OF: 1 });
  const sub = runBits(5, { kind: 'sub', b: 7 });
  expect(sub.state).toMatchObject({ result: 254, CF: 1, OF: 0, step: 10 });
  expect(sub.events[0].text).toContain('进位输出是 0，所以借位是 1');
  expect(runBits(0x96, { kind: 'sar' }).state.result).toBe(0xcb);
  expect(runBits(0x96, { kind: 'shr' }).state.result).toBe(0x4b);
  expect(runBits(0xf0, { kind: 'extend', to: 16, signed: true }).state.result).toBe(0xfff0);
  expect(runBits(0xf0, { kind: 'extend', to: 16 }).state.result).toBe(0xf0);
  expect(runBits(0x1234, { kind: 'truncate', to: 8 }, 16).state.result).toBe(0x34);
  expect(bitsMachine.observe(runBits(7, { kind: 'add', b: 1 }, 4).state)).toMatchObject({ result: 8, signed: -8 });
});
it('4、8、16、32 位各 2000 对输入的加减与独立 BigInt 真值一致', () => {
  const random = rng(0x83c194bf);
  for (const w of widths) for (let i = 0; i < 2000; i++) {
    const a = BigInt.asUintN(w, BigInt(random())), b = BigInt.asUintN(w, BigInt(random()));
    for (const kind of ['add', 'sub'] as const) {
      const exact = kind === 'add' ? a + b : a - b;
      const sa = BigInt.asIntN(w, a), sb = BigInt.asIntN(w, b);
      const signedResult = kind === 'add' ? sa + sb : sa - sb;
      const state = runBits(Number(a), { kind, b: Number(b) }, w).state;
      expect([state.result, state.CF, state.OF]).toEqual([Number(BigInt.asUintN(w, exact)),
        Number(exact < 0n || exact >= 2n ** BigInt(w)), Number(BigInt.asIntN(w, signedResult) !== signedResult)]);
    }
  }
});
it('单精度拆解、精确展开、舍入中点和逐次累加', () => {
  expect(toBits(0.1)).toBe(0x3dcccccd);
  expect(exactDecimal(0x3dcccccd)).toBe('0.100000001490116119384765625');
  for (const [a, b, expected] of [[2 ** 24, 1, 2 ** 24], [2 ** 24, 2, 16777218], [2 ** 24, 3, 16777220],
    [1, 2 ** -24, 1], [1, 2 ** -23, 1.0000001192092896], [-0, -0, -0]]) {
    const h = runFloat({ mode: 'add', a, b });
    expect(h.index).toBe(6); expect(h.state.bits).toBe(toBits(expected));
    expect(h.eventsAt(2)[0].text).toMatch(/保护位 G=.*舍入位 R=.*粘滞位 S=/);
    if (a === 2 ** 24 && b % 2) expect(h.eventsAt(5)[0].text).toContain('正好在中间，取尾数为偶');
  }
  const h = runFloat({ mode: 'accumulate', delta: 0.1, count: 10 });
  expect(h.state).toMatchObject({ bits: 0x3f800001, exact: '1', step: 10, error: 2 ** -23 });
  expect(exactDecimal(h.state.bits)).toBe('1.00000011920928955078125');
  expect(inspect(1)).toMatchObject({ value: 2 ** -149, exponent: -126, ulp: 2 ** -149 });
  expect(fromBits(0x7f7fffff)).toBe(3.4028234663852886e38);
  expect([0x7f800000, 0x7fc00000, 0x80000000].map(exactDecimal)).toEqual(['+∞', 'NaN', '−0']);
  expect(neighbor(0x80000000, -1)).toBe(0x80000001);
  expect(runFloat({ mode: 'accumulate', delta: 2 ** -151, count: 2 }).state.stuck).toBe(1);
});
it('10000 对有限单精度数逐步加法与 DataView 和 Math.fround 逐位相同', () => {
  const random = rng(0xfea1032d), ref = new DataView(new ArrayBuffer(4));
  const finite = (v: number) => (v & 0x7f800000) === 0x7f800000 ? (v ^ 0x00800000) >>> 0 : v;
  for (let i = 0; i < 10000; i++) {
    const x = finite(random()), y = i % 4 ? finite(random()) : random() & 0x807fffff;
    ref.setUint32(0, x); const a = ref.getFloat32(0);
    ref.setUint32(0, y); const b = ref.getFloat32(0);
    ref.setFloat32(0, Math.fround(a + b));
    expect(runFloat({ mode: 'add', a, b }).state.bits).toBe(ref.getUint32(0));
  }
});
it('UTF-8 和 TextEncoder 逐字节相同，代理对分为高、低码元', () => {
  for (const c of 'Aé中😀👩‍💻\u007f\u0080\u07ff\u0800\uffff\u{10ffff}\ud800') {
    const encoded = encodeCodePoint(c);
    expect(encoded.utf8.map((v) => v.byte)).toEqual([...new TextEncoder().encode(c)]);
    expect(encoded.utf16).toEqual(encoded.character.split('').map((u) => u.charCodeAt(0)));
  }
  expect(encodeCodePoint('😀').utf16).toEqual([0xd83d, 0xde00]);
});

it('进位按列保留，回退、编辑和 32 位的最高进位独立于结果', () => {
  const h = runBits(127, { kind: 'add', b: 1 });
  for (let i = 0; i <= 7; i++) {
    h.seek(i);
    expect(h.state.carries).toEqual([0, ...Array(i).fill(1)]);
  }
  h.seek(8); expect(h.state.carries.slice(-2)).toEqual([1, 0]);
  h.seek(0); h.edit({ operand: 'a', index: 0 }); h.seek(1);
  expect(h.state.carries).toEqual([0, 0]);
  const sub = runBits(5, { kind: 'sub', b: 7 });
  sub.seek(1); expect(sub.state.carries).toEqual([1]);
  sub.seek(10); expect(sub.state.carries[8]).toBe(0);
  expect(runBits(0xffffffff, { kind: 'add', b: 1 }, 32).state.carries[32]).toBe(1);
});
it('从大数累加，寄存器、参考和、误差、曲线与回退一致', () => {
  for (const [start, delta, message] of [[16777216, 1, '正好半个 ULP'], [1, 2 ** -25, '不到半个 ULP']] as const) {
    const h = runFloat({ mode: 'accumulate', start, delta, count: 3 });
    for (let k = 1; k <= 3; k++) {
      h.seek(k);
      expect(h.state).toMatchObject({ bits: toBits(start), stuck: 1, error: k * delta });
      expect(h.events[0].text).toContain(message);
    }
  }
  const p = { mode: 'accumulate', start: 16777216, delta: 3, count: 3 } as const;
  const h = runFloat(p);
  for (let i = 0; i <= 3; i++) {
    h.seek(i);
    expect(h.state).toMatchObject({ bits: toBits(p.start + 4 * i), double: p.start + 3 * i, exact: String(p.start + 3 * i), error: i });
  }
  expect(accumulationPlot(p)).toEqual([0, 1, 2, 3].map(i => ({ single: 4 * i, exact: 3 * i })));
  const decimal = runFloat({ mode: 'accumulate', start: -0.1, delta: 0.025, count: 4 });
  decimal.seek(0); expect(decimal.state.exact).toBe('−0.1'); expect(decimal.state.error).toBeGreaterThan(0);
  decimal.seek(3); expect(decimal.state.exact).toBe('−0.025');
  decimal.seek(4); expect(decimal.state.exact).toBe('0');
});
it('对齐行、保护位、舍入位、粘滞位和未舍入的二进制低位', () => {
  const large = toBits(2 ** 24);
  expect(alignment(large, toBits(1))).toMatchObject({ operand: 'b', shift: 24, guard: 1, round: 0, sticky: 0 });
  expect(alignment(toBits(1.75), large)).toMatchObject({ operand: 'a', guard: 1, round: 1, sticky: 1 });
  const h = runFloat({ mode: 'add', a: 2 ** 24, b: 1 });
  h.seek(3);
  expect(binarySum(h.state.total)).toEqual({ main: '1.' + '0'.repeat(23), low: '1', exponent: 24 });
  expect(binarySum(-1n)).toEqual({ main: '−0.' + '0'.repeat(22) + '1', low: '', exponent: -126 });
});
it('独立展示格式、控制、空白和组合字符时有可读标签', () => {
  expect(Array.from('‍​\u0000\t\n \u0301\ufe0f中', characterLabel)).toEqual(
    ['零宽连接符', '不可见字符', '不可见字符', '制表符', '换行', '空白', '◌́', '不可见字符', '中']);
});

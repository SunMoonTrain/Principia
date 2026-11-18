import { expect, it } from 'vitest';
import { circuitMachine as machine, truthTable } from './circuit';
import { History } from './machine';
import { compileCircuit, type Gate, type Level, type Module, type Netlist } from './netlist';

const gate = (id: string, type: string, ...inputs: string[]): Gate => ({ id, type, in: inputs });
const fa: Module = { inputs: ['a', 'b', 'cin'], gates: [gate('x', 'xor', 'a', 'b'), gate('s', 'xor', 'x', 'cin'),
  gate('ab', 'and', 'a', 'b'), gate('xc', 'and', 'x', 'cin'), gate('co', 'or', 'ab', 'xc')], outputs: { s: 's', cout: 'co' } };
const half: Netlist = { inputs: { A: 0, B: 0 }, gates: [gate('s', 'xor', 'A', 'B'), gate('c', 'and', 'A', 'B')], outputs: { S: 's', C: 'c' } };
const hist = (p: Netlist) => new History(machine, compileCircuit(p), 0);
function ripple(a: number, b: number, cin: Level): Netlist {
  const inputs: Record<string, Level> = { Cin: cin }, gates: Gate[] = [], outputs: Record<string, string> = {};
  for (let i = 0; i < 4; i++) {
    inputs['A' + i] = (a >> i & 1) as Level; inputs['B' + i] = (b >> i & 1) as Level;
    gates.push(gate('u' + i, 'fa', 'A' + i, 'B' + i, i ? 'u' + (i - 1) + '.cout' : 'Cin'));
    outputs['S' + i] = 'u' + i + '.s';
  }
  return { inputs, modules: { fa }, gates, outputs: { ...outputs, Cout: 'u3.cout' }, probes: ['u1.cout'] };
}
it('半加器、全加器按首个输入为最高位列出所有稳定结果', () => {
  expect(truthTable(compileCircuit(half)).map(r => r.outputs.join(''))).toEqual(['00', '10', '10', '01']);
  const full = compileCircuit({ inputs: { a: 0, b: 0, cin: 0 }, gates: fa.gates, outputs: fa.outputs });
  truthTable(full).forEach(({ inputs, outputs }, i) => {
    expect(parseInt(inputs.join(''), 2)).toBe(i);
    const sum = inputs.filter(Boolean).length;
    expect(outputs).toEqual([sum % 2, sum >> 1]);
  });
  const h = hist(half);
  h.edit({ A: 1, B: 1 });
  expect(h.state.trace).toHaveLength(1); expect(h.state.tick).toBe(0);
  h.step(); expect(machine.observe(h.state)).toMatchObject({ S: 0, C: 1, stable: 1 });
});
it.each([[7, 1, 0, 7, '01000'], [15, 1, 0, 8, '10000'], [15, 0, 1, 9, '10000']] as const)(
  '行波加法器 %i + %i + %i 在第 %i 拍稳定', (a, b, cin, end, answer) => {
    const h = hist(ripple(a, b, cin)), net = h.state.net;
    expect(net.gates).toHaveLength(20); expect(net.longest).toBe(9);
    for (let t = 0; t <= end; t++) {
      h.seek(t); const v = machine.observe(h.state);
      expect(v.stable).toBe(Number(t === end));
      if (a === 7) { expect(v.S1).toBe(Number(t === 2)); expect(v.S2).toBe(Number(t >= 2 && t <= 4)); }
      if (a === 15 && b) expect(v.S3).toBe(Number(t >= 2 && t <= 6));
      if (cin) expect(v.Cout).toBe(Number(t === 9));
    }
    const v = machine.observe(h.state);
    expect([v.Cout, v.S3, v.S2, v.S1, v.S0].join('')).toBe(answer);
    const first = h.state.trace; h.seek(0); h.step('到稳定');
    expect(h.state.tick).toBe(end); expect(h.state.trace).toEqual(first);
  });
it('SR 同拍放开和自反非门在首次重复时暂停，仍可继续单步', () => {
  const h = hist({ inputs: { S: 0, R: 0 }, init: { Q: 0, Qn: 1 }, gates: [gate('Q', 'nor', 'R', 'Qn'),
    gate('Qn', 'nor', 'S', 'Q')], outputs: { Q: 'Q', Qn: 'Qn' } });
  expect(h.state.net.longest).toBeNull(); expect(h.state.stableAt).toBe(0);
  h.edit({ S: 1 }); h.step('到稳定');
  expect(h.state.tick).toBe(2); expect(h.state.stableAt).toBe(2); expect(machine.observe(h.state).Q).toBe(1);
  h.edit({ S: 0 }); expect(h.state.stableAt).toBe(0); expect(machine.observe(h.state).Q).toBe(1);
  h.edit({ S: 1, R: 1 }); h.step('到稳定'); expect(machine.observe(h.state)).toMatchObject({ Q: 0, Qn: 0 });
  const released = h.state.tick; h.edit({ S: 0 }); h.edit({ R: 0 }); expect(h.state.tick).toBe(released);
  h.step(); expect(h.state.period).toBe(0); h.step(); expect(h.state.period).toBe(2);
  expect(h.pause).toBe(true); expect(h.done).toBe(false); h.step(); expect(h.state.tick).toBe(released + 3);
  const ring = hist({ inputs: {}, gates: [gate('n', 'not', 'n')], outputs: { Y: 'n' } });
  ring.step('到稳定'); expect([ring.state.tick, ring.state.period]).toEqual([2, 2]);
});
it('D 在上升沿被采样，Q 在下一拍更新，切换粒度仍保留每拍的时序', () => {
  const p: Netlist = { clock: { every: 4 }, inputs: { D: 1 }, gates: [gate('Q', 'dff', 'D', 'CLK')], outputs: { Q: 'Q' } };
  const h = hist(p);
  for (let t = 0; t <= 13; t++) {
    h.seek(t); if (t === 6) h.edit({ D: 0 });
    expect(machine.observe(h.state)).toMatchObject({ CLK: Math.floor(t / 4) % 2, Q: Number(t >= 5 && t < 13), stable: 0, osc: 0 });
  }
  expect(h.state.net.waves).toEqual(['CLK', 'D', 'Q']);
  h.seek(1); h.step('半个周期'); expect(h.state.tick).toBe(4);
  const slow = hist({ ...p, clock: { every: 10000 } }); slow.step('半个周期'); slow.step('半个周期');
  expect(slow.state.tick).toBe(20000); expect(slow.state.trace.map(f => f.tick)).toEqual(Array.from({length: 64}, (_, i) => 19937 + i));
  expect(machine.observe(slow.state).Q).toBe(1);
  const limit = Number.MAX_SAFE_INTEGER;
  const long = hist({ ...p, clock: { every: limit - 2 } });
  long.step('半个周期'); expect(long.state.tick).toBe(limit - 2);
  long.step('半个周期'); expect(long.state.tick).toBe(limit);
  expect(machine.observe(long.state).Q).toBe(1);
  expect(long.done).toBe(true);
});
it('3 位计数器的八次进位与回绕锁在第 5 至 61 拍', () => {
  const h = hist({ inputs: {}, clock: { every: 4 }, gates: [gate('n', 'not', 'Q0'), gate('x', 'xor', 'Q1', 'Q0'),
    gate('a', 'and', 'Q1', 'Q0'), gate('y', 'xor', 'Q2', 'a'), gate('Q0', 'dff', 'n', 'CLK'),
    gate('Q1', 'dff', 'x', 'CLK'), gate('Q2', 'dff', 'y', 'CLK')], outputs: { C2: 'Q2', C1: 'Q1', C0: 'Q0' } });
  expect(h.state.net.longest).toBe(2);
  for (let t = 0; t <= 65; t++) {
    h.seek(t); const v = machine.observe(h.state);
    expect(parseInt([v.C2, v.C1, v.C0].join(''), 2)).toBe(Math.floor((t + 3) / 8) % 8);
  }
  expect(h.state.trace).toHaveLength(64); expect(h.state.trace[0].tick).toBe(2);
});
it('多输入反相门、嵌套与直通端口不增加延迟，悬空长支路不计入输出路径', () => {
  const pass: Module = { inputs: ['p'], gates: [], outputs: { out: 'p' } };
  const wrapper: Module = { inputs: ['v'], gates: [gate('u', 'pass', 'v')], outputs: { y: 'u.out' } };
  const h = hist({ inputs: { A: 1 }, modules: { pass, wrapper }, gates: [gate('w', 'wrapper', 'A'),
    gate('xn', 'xnor', 'A', 'w.y', 'A'), gate('na', 'nand', 'A', 'xn'), gate('unused', 'buffer', 'na')], outputs: { Y: 'na', P: 'w.y' } });
  expect(h.state.net.longest).toBe(2);
  h.step('到稳定'); expect(machine.observe(h.state)).toMatchObject({ Y: 1, P: 1, xn: 0 });
});

it('到稳定粒度也能找到周期超过 256 拍的组合反馈', () => {
  const gates: Gate[] = [];
  for (const n of [17, 19]) for (let i = 0; i < n; i++)
    gates.push(gate('r' + n + '_' + i, 'buffer', 'r' + n + '_' + ((i + 1) % n)));
  const h = hist({ inputs: {}, gates, outputs: { Y: 'r17_0' }, init: { r17_0: 1, r19_0: 1 } });
  h.step('到稳定');
  expect([h.state.tick, h.state.period, h.state.trace.length]).toEqual([323, 323, 64]);
});

it.each(['到稳定','半个周期'])('%s 限制实际运算量，预览、继续和重放都保留逐拍结果', grain => {
  const clocked = grain === '半个周期';
  const gates = [gate('ring', 'not', 'ring')];
  for (let i = 0; i < 11; i++) gates.push(gate('n'+i, 'not', 'q'+i),
    gate('q'+i, 'dff', 'n'+i, i ? 'q'+(i-1) : 'ring'));
  const p: Netlist = { inputs: {}, gates, outputs: { Y: 'q10' }, clock: clocked ? { every: 3000 } : undefined };
  const h = hist(p), ref = hist(p);
  h.preview(200, grain);
  expect(h.end).toBe(1); expect(h.state.tick).toBe(0);
  h.step(grain);
  const first = h.state.tick;
  expect(first).toBe(1024); expect(h.pause || h.done).toBe(false);
  expect(h.events[0].text).toContain(clocked ? '还没到下一次 CLK 翻转' : '还没稳定，也没发现重复');
  expect(machine.observe(h.state)).toMatchObject({ stable: 0, osc: 0 });
  const expectedEnd = clocked ? 3000 : 4097;
  for (let from = first; from < expectedEnd; from += 1024) {
    h.step(grain);
    expect(h.state.tick).toBe(Math.min(from + 1024, expectedEnd));
    ref.seek(h.state.tick);
    expect(h.state.trace).toEqual(ref.state.trace); expect(h.state.period).toBe(ref.state.period);
  }
  expect(clocked ? h.state.tick : h.state.period).toBe(clocked ? 3000 : 4096);
  const end = h.state, last = h.index;
  h.seek(1); h.truncate(); h.seek(last, grain);
  expect(h.state.trace).toEqual(end.trace); expect(h.state.period).toBe(end.period);
});

it('第 0 拍时钟输入已高时不采样，第一次实际的上升沿才采样', () => {
  const h = hist({ inputs: { D: 1, C: 1 }, init: { buf: 1 }, outputs: { Q: 'q', Qb: 'qb' },
    gates: [gate('buf','buffer','C'), gate('q','dff','D','C'), gate('qb','dff','D','buf')] });
  h.step(); expect(machine.observe(h.state)).toMatchObject({ Q: 0, Qb: 0 });
  h.edit({ C: 0 }); h.step(); h.edit({ C: 1 }); h.step();
  expect(machine.observe(h.state)).toMatchObject({ Q: 1, Qb: 0 });
  h.step(); expect(machine.observe(h.state)).toMatchObject({ Q: 1, Qb: 1 });
});

it('半周期仅剩少量计算预算时发现重复，仍返回连续 64 拍的波形', () => {
  const ring = (size: number): Module => ({ inputs: [], outputs: { out: 'b0' },
    gates: Array.from({ length: size }, (_, i) => gate('b'+i, 'buffer', 'b'+((i+1) % size))) });
  const p: Netlist = { inputs: {}, modules: { r31: ring(31), r32: ring(32) },
    gates: [gate('p','r31'), gate('q','r32')], outputs: { P: 'p.out', Q: 'q.out' },
    init: { 'p.b0': 1, 'q.b0': 1 }, clock: { every: 50000 } };
  const h = hist(p), ref = hist(p);
  h.step('半个周期'); // 第 992 拍首次重复，本步只余 32 次实际计算。
  expect(h.state.tick).toBe(1024);
  ref.seek(1024);
  expect(h.state.trace).toEqual(ref.state.trace);
});

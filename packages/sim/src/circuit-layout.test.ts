import { parse } from 'yaml';
import { simDemos } from './demos';
import { expect, it } from 'vitest';
import { layoutCircuit, pinPoint } from './circuit-layout';
import type { Netlist } from './core/netlist';

it('手动指定同一格的门分开摆，连线经过输出别名仍接到实例的正确引脚', () => {
  const net: Netlist = {
    inputs: { A: 1 },
    modules: { pair: { inputs: ['a'], gates: [{ id: 'n', type: 'not', in: ['a'] }], outputs: { p: 'a', q: 'n' } } },
    gates: [
      { id: 'u', type: 'pair', in: ['A'], at: [0, 0] },
      { id: 'b', type: 'buffer', in: ['Y'], at: [0, 0] },
      { id: 'n', type: 'not', in: ['n'], at: [0, 1] },
    ],
    outputs: { Y: 'u.q', Z: 'b' },
  };
  const { nodes, wires } = layoutCircuit(net);
  const devices = nodes.filter(n => n.kind === 'module' || n.kind === 'gate');
  expect(devices.map(n => n.row)).toEqual([0, 2, 1]);
  for (const [i, a] of nodes.entries()) for (const b of nodes.slice(i + 1)) {
    expect(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y).toBe(true);
  }
  const alias = wires.find(w => w.to.node.name === 'b')!;
  expect([alias.from.node.name, alias.from.pin, alias.to.pin]).toEqual(['u', 1, 0]);
  const source = pinPoint(alias.from.node, 1, true);
  expect(alias.path.startsWith('M' + source.x + ' ' + source.y + 'H')).toBe(true);
  const loop = wires.find(w => w.to.node.name === 'n')!;
  expect(loop.from.node).toBe(loop.to.node);
  expect(loop.path).toContain('V');
});

/** 从最终 SVG 路径量距离，同时检查引脚、元件和画布边界。 */
function inspectWires(net: Netlist) {
  const { nodes, wires, width, height } = layoutCircuit(net);
  const segments: { vertical: boolean; at: number; lo: number; hi: number; driver: string }[] = [];
  for (const wire of wires) {
    const driver = wire.from.node.outs[wire.from.pin].signal;
    const start = /^M([\d.-]+) ([\d.-]+)/.exec(wire.path)!;
    let x = Number(start[1]), y = Number(start[2]);
    expect({ x, y }).toEqual(pinPoint(wire.from.node, wire.from.pin, true));
    for (const [, axis, coordinate] of wire.path.matchAll(/([HV])([\d.-]+)/g)) {
      const vertical = axis === 'V', next = Number(coordinate), prev = vertical ? y : x;
      if (next === prev) continue;
      const at = vertical ? x : y, lo = Math.min(prev, next), hi = Math.max(prev, next);
      expect(lo >= 0 && hi <= (vertical ? height : width)).toBe(true);
      for (const other of segments) {
        if (other.driver === driver || other.vertical !== vertical || Math.min(hi, other.hi) <= Math.max(lo, other.lo)) continue;
        if (Math.abs(at - other.at) < 8) throw new Error(driver + ' 与 ' + other.driver + ' 间距 ' + Math.abs(at - other.at));
      }
      for (const n of nodes) {
        const [left, right, top, bottom] = vertical ? [n.y, n.y+n.h, n.x, n.x+n.w] : [n.x, n.x+n.w, n.y, n.y+n.h];
        if (at > top && at < bottom && Math.min(hi,right) > Math.max(lo,left)) throw new Error(driver + ' 穿过 ' + n.key);
      }
      segments.push({ vertical, at, lo, hi, driver });
      if (vertical) y = next;
      else x = next;
    }
    expect({ x, y }).toEqual(pinPoint(wire.to.node, wire.to.pin, false));
  }
}

it.each(simDemos.filter(d => d.name === 'logic-circuit'))('$title 的异源平行线有足够间距', ({ yaml }) => {
  inspectWires(parse(yaml));
});

it('不同列宽、手动布局、反馈和扇出的 100 组可复现网表均能分线', () => {
  let seed = 27;
  function pick(n: number) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return Math.floor(seed / 2 ** 32 * n);
  }
  for (let run = 0; run < 100; run++) {
    const ids = Array.from({ length: 6 + pick(12) }, (_, i) => (i % 3 ? 'g' : 'long_name_') + i);
    const sources = ['A', 'B', 'CLK', ...ids, 'u.s', 'u.c', 'Y'];
    const input = () => sources[pick(sources.length)];
    const net: Netlist = { inputs: { A: 0, B: 1 }, clock: { every: 4 },
      modules: { pair: { inputs: ['a','b'], gates: [], outputs: { s: 'a', c: 'b' } } },
      gates: [{ id: 'u', type: 'pair', in: ['A','B'] }, ...ids.map(id => {
        const type = ['and','xor','dff','not'][pick(4)];
        return { id, type, in: Array.from({ length: type === 'not' ? 1 : type === 'dff' ? 2 : 2 + pick(3) }, input),
          at: pick(2) ? [pick(6)-2, pick(5)-1] as [number, number] : undefined };
      })], outputs: { Y: ids[0], Z: ids[ids.length-1] } };
    inspectWires(net);
  }
});

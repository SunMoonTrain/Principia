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

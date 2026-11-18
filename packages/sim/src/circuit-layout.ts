import type { Netlist } from './core/netlist';

interface Pin { name: string; signal: string }
export interface DiagramNode {
  key: string; name: string; kind: 'input' | 'clock' | 'gate' | 'module' | 'output'; type: string;
  ins: Pin[]; outs: Pin[]; at?: [number, number]; column: number; row: number; x: number; y: number; w: number; h: number;
}
interface Terminal { node: DiagramNode; pin: number }
export interface Wire { from: Terminal; to: Terminal; signal: string; path: string }
export function pinPoint(node: DiagramNode, index: number, output: boolean) {
  const count = output ? node.outs.length : node.ins.length;
  const header = node.kind === 'module' || node.type === 'dff' ? 32 : 0;
  return { x: output ? node.x + node.w : node.x, y: node.y + header + (node.h - header) * (index + 1) / (count + 1) };
}
export function layoutCircuit(p: Netlist) {
  const nodes: DiagramNode[] = [], sources = new Map<string, Terminal>();
  function add(name: string, kind: DiagramNode['kind'], type: string, ins: Pin[], outs: Pin[], at?: [number, number]) {
    const key = kind + ':' + name;
    const h = kind === 'module' || type === 'dff' ? 32 + 22 * (1 + Math.max(ins.length, outs.length)) :
      kind === 'gate' ? Math.max(48, 14 * (ins.length + 1)) : 36;
    const titleWidth = Math.max(name.length, type.length) * 8 + 34;
    const pinsWidth = kind === 'module' ? 8 * (Math.max(0, ...ins.map(i => i.name.length)) + Math.max(0, ...outs.map(i => i.name.length))) + 44 : 0;
    const node = { key, name, kind, type, ins, outs, at, column: 0, row: 0, x: 0, y: 0, w: Math.max(90, titleWidth, pinsWidth), h };
    nodes.push(node); outs.forEach((pin, i) => sources.set(pin.signal, { node, pin: i }));
    return node;
  }
  for (const name of Object.keys(p.inputs)) add(name, 'input', '', [], [{ name, signal: name }]);
  if (p.clock) add('CLK', 'clock', '', [], [{ name: 'CLK', signal: 'CLK' }]);
  for (const g of p.gates) {
    const mod = p.modules && Object.hasOwn(p.modules, g.type) ? p.modules[g.type] : undefined;
    const ins = g.in.map((signal, i) => ({ signal, name: mod ? mod.inputs[i] : g.type === 'dff' ? ['D', 'CLK'][i] : '' }));
    const outs = mod ? Object.keys(mod.outputs).map(pin => ({ name: pin, signal: g.id + '.' + pin })) : [{ name: g.type === 'dff' ? 'Q' : '', signal: g.id }];
    add(g.id, mod ? 'module' : 'gate', g.type, ins, outs, g.at);
  }
  for (const [name, signal] of Object.entries(p.outputs)) add(name, 'output', '', [{ name, signal }], []);
  const driver = (signal: string) => {
    while (!sources.has(signal)) signal = p.outputs[signal];
    return sources.get(signal)!;
  };
  const placed = new Set<DiagramNode>(), visiting = new Set<DiagramNode>();
  function column(n: DiagramNode): number {
    if (placed.has(n)) return n.column;
    if (visiting.has(n) || n.kind === 'input' || n.kind === 'clock') return 0;
    visiting.add(n);
    n.column = n.at ? n.at[0] + 1 : n.type === 'dff' ? 1 : 1 + Math.max(0, ...n.ins.map(pin => column(driver(pin.signal).node)));
    visiting.delete(n); placed.add(n);
    return n.column;
  }
  const components = nodes.filter(n => n.kind === 'gate' || n.kind === 'module');
  components.forEach(column);
  const left = Math.min(0, ...components.map(n => n.column - 1)), right = Math.max(1, ...components.map(n => n.column + 1));
  nodes.forEach(n => {
    if (n.kind === 'input' || n.kind === 'clock') n.column = left;
    if (n.kind === 'output') n.column = right;
  });
  const columns = [...new Set(nodes.map(n => n.column))].sort((a,b) => a-b);
  let x = 24;
  for (const col of columns) {
    const group = nodes.filter(n => n.column === col);
    const used = new Set<number>();
    const requested = new Set(group.flatMap(n => n.at ? [n.at[1]] : []));
    let free = 0;
    for (const n of group) {
      if (n.at && !used.has(n.at[1])) n.row = n.at[1];
      else {
        while (requested.has(free)) free++;
        n.row = free++;
      }
      used.add(n.row); n.x = x;
    }
    x += Math.max(...group.map(n => n.w)) + 70;
  }
  let y = 20;
  const lanes = new Map<number, number>();
  for (const row of [...new Set(nodes.map(n => n.row))].sort((a,b) => a-b)) {
    const group = nodes.filter(n => n.row === row), height = Math.max(...group.map(n => n.h));
    for (const n of group) n.y = y + (height - n.h) / 2;
    lanes.set(row, y + height + 9); y += height + 34;
  }
  const wires: Wire[] = [];
  for (const n of nodes) n.ins.forEach(({ signal }, i) => {
    const from = driver(signal), a = pinPoint(from.node, from.pin, true), b = pinPoint(n, i, false);
    const lane = (wires.length % 5) * 4;
    const near = columns.indexOf(n.column) === columns.indexOf(from.node.column) + 1;
    const route = near ? 'H' + (b.x - 22 - lane) + 'V' + b.y :
      'H' + (from.node.x + from.node.w + 14 + lane) + 'V' + (lanes.get(from.node.row)! + lane) + 'H' + (b.x - 16 - lane) + 'V' + b.y;
    wires.push({ from, to: { node: n, pin: i }, signal, path: 'M' + a.x + ' ' + a.y + route + 'H' + b.x });
  });
  return { nodes, wires, width: x - 46, height: y };
}

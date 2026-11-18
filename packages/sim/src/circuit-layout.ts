import type { Netlist } from './core/netlist';

interface Pin { name: string; signal: string }
export interface DiagramNode {
  key: string; name: string; kind: 'input' | 'clock' | 'gate' | 'module' | 'output'; type: string;
  ins: Pin[]; outs: Pin[]; at?: [number, number]; column: number; row: number; x: number; y: number; w: number; h: number;
}
interface Terminal { node: DiagramNode; pin: number }
export interface Wire { from: Terminal; to: Terminal; signal: string; path: string }
const trackSpacing = 8;
interface Occupied { from: Terminal; lo: number; hi: number }
type Channel = Occupied[][];

/** 通道两端也要留出转弯位置；同一输出脚扇出的线可以共享。 */
function reserve(channel: Channel, from: Terminal, start: number, end: number) {
  const lo = Math.min(start, end), hi = Math.max(start, end);
  let lane = channel.findIndex(track => track.every(s => s.from === from || s.hi < lo || hi < s.lo));
  if (lane === -1) lane = channel.push([]) - 1;
  channel[lane].push({ from, lo, hi });
  return lane;
}

export function pinPoint(node: DiagramNode, index: number, output: boolean) {
  const count = output ? node.outs.length : node.ins.length;
  const header = node.kind === 'module' || node.type === 'dff' ? 32 : 0;
  const center = node.y + header + (node.h - header) * (index + 1) / (count + 1);
  // 输入和输出脚分别占偶数道和奇数道，相邻列伸向通道的短横线也能分开。
  const offset = output ? trackSpacing : 0, pitch = 2 * trackSpacing;
  return { x: output ? node.x + node.w : node.x, y: Math.round((center - offset) / pitch) * pitch + offset };
}
export function layoutCircuit(p: Netlist) {
  const nodes: DiagramNode[] = [], sources = new Map<string, Terminal>();
  function add(name: string, kind: DiagramNode['kind'], type: string, ins: Pin[], outs: Pin[], at?: [number, number]) {
    const key = kind + ':' + name;
    const h = kind === 'module' || type === 'dff' ? 32 + 22 * (1 + Math.max(ins.length, outs.length)) :
      kind === 'gate' ? Math.max(48, 2 * trackSpacing * (ins.length + 1)) : 36;
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
      used.add(n.row);
    }
  }
  const rows = [...new Set(nodes.map(n => n.row))].sort((a,b) => a-b);
  const vertical: Channel[] = Array.from({ length: columns.length + 1 }, () => []);
  const horizontal: Channel[] = rows.map(() => []);
  const routes = nodes.flatMap(n => n.ins.map(({ signal }, pin) => {
    const from = driver(signal), to = { node: n, pin };
    const exit = columns.indexOf(from.node.column) + 1, entry = columns.indexOf(n.column);
    const row = rows.indexOf(from.node.row), target = rows.indexOf(n.row);
    // 偶数表示元件行，奇数表示行下方的通道。先按区间分道，随后按道数定间距。
    const adjacent = exit === entry;
    const startLane = reserve(vertical[exit], from, 2 * row, adjacent ? 2 * target : 2 * row + 1);
    const endLane = adjacent ? startLane : reserve(vertical[entry], from, 2 * row + 1, 2 * target);
    const across = adjacent ? -1 : reserve(horizontal[row], from, exit, entry);
    return { from, to, signal, exit, entry, row, startLane, endLane, across };
  }));

  let width = 0;
  const channelX = vertical.map((lanes, i) => {
    const first = width + 20;
    width += Math.max(i > 0 && i < columns.length ? 56 : 24, lanes.length ? 40 + (lanes.length - 1) * trackSpacing : 0);
    if (i < columns.length) {
      const group = nodes.filter(n => n.column === columns[i]);
      for (const n of group) n.x = width;
      width += Math.max(...group.map(n => n.w));
    }
    return first;
  });
  let height = 20;
  const channelY = rows.map((row, i) => {
    const group = nodes.filter(n => n.row === row), tallest = Math.max(...group.map(n => n.h));
    for (const n of group) n.y = height + (tallest - n.h) / 2;
    height += tallest;
    const first = height + 16;
    height += 32 + Math.max(0, horizontal[i].length - 1) * trackSpacing;
    return first;
  });
  const wires: Wire[] = routes.map(({ from, to, signal, exit, entry, row, startLane, endLane, across }) => {
    const a = pinPoint(from.node, from.pin, true), b = pinPoint(to.node, to.pin, false);
    let path = 'M' + a.x + ' ' + a.y + 'H' + (channelX[exit] + startLane * trackSpacing);
    if (across >= 0) path += 'V' + (channelY[row] + across * trackSpacing) + 'H' + (channelX[entry] + endLane * trackSpacing);
    return { from, to, signal, path: path + 'V' + b.y + 'H' + b.x };
  });
  return { nodes, wires, width, height };
}

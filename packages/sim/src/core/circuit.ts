import type { Machine, StepResult } from './machine.ts';
import type { Circuit, Level, Primitive } from './netlist.ts';

const level = (v: number | boolean): Level => v ? 1 : 0;
function combinational(type: Primitive, inputs: number[], values: Level[]): Level {
  switch (type) {
    case 'buffer': return values[inputs[0]];
    case 'not': return level(!values[inputs[0]]);
    case 'and': case 'nand': return level(inputs.every(i => values[i]) !== (type === 'nand'));
    case 'or': case 'nor': return level(inputs.some(i => values[i]) !== (type === 'nor'));
    case 'xor': case 'xnor': return level(inputs.reduce<number>((p, i) => p ^ values[i], Number(type === 'xnor')));
    case 'dff': throw new Error('触发器需要时钟沿');
  }
}
function following(net: Circuit, values: Level[], clocks: Level[], tick: number) {
  const next = values.slice();
  if (net.every) next[net.clock] = level(Math.floor((tick + 1) / net.every) % 2);
  let d = 0;
  net.gates.forEach((g, i) => {
    const slot = net.first + i;
    if (g.type === 'dff') {
      if (clocks[d] === 0 && values[g.in[1]] === 1) next[slot] = values[g.in[0]];
      d++;
    } else next[slot] = combinational(g.type, g.in, values);
  });
  return next;
}
const clockInputs = (net: Circuit, values: Level[]) => net.dffs.map(i => values[net.gates[i].in[1]]);
const tickBudget = 1024;
type Seen = { key: string; tick: number } | { bit: number; zero: Seen; one: Seen };

/** 按有差异的位索引完整状态；插入只复制查找路径，后退时仍可使用旧树。 */
function remember(root: Seen | undefined, key: string, tick: number): Seen | number {
  const leaf = { key, tick };
  if (!root) return leaf;
  let match = root;
  while ('bit' in match) match = key[match.bit] === '0' ? match.zero : match.one;
  if (match.key === key) return match.tick;
  let bit = 0;
  while (match.key[bit] === key[bit]) bit++;
  function insert(node: Seen): Seen {
    if (!('bit' in node) || node.bit > bit) {
      return key[bit] === '0' ? { bit, zero: leaf, one: node } : { bit, zero: node, one: leaf };
    }
    return key[node.bit] === '0' ? { ...node, zero: insert(node.zero) } : { ...node, one: insert(node.one) };
  }
  return insert(root);
}
interface Sample { tick: number; values: Level[] }
export interface CircuitState {
  net: Circuit; tick: number; values: Level[]; next: Level[]; clocks: Level[]; changed: number[];
  editedAt: number; stableAt: number | null; period: number; seen?: Seen; trace: Sample[];
}
function classify(s: CircuitState): CircuitState {
  if (s.net.every) return s;
  if (s.next.every((v, i) => v === s.values[i])) {
    return { ...s, stableAt: s.stableAt ?? s.tick - s.editedAt, seen: undefined };
  }
  if (!s.period && (s.net.longest === null || s.net.dffs.length)) {
    // 边沿存储也属于触发器的状态。同一拍内编辑会重开本段查重历史。
    const key = s.values.join('') + s.clocks.join('');
    const seen = remember(s.seen, key, s.tick);
    return typeof seen === 'number' ? { ...s, period: s.tick - seen, seen: undefined } : { ...s, seen };
  }
  return s;
}
function initial(net: Circuit): CircuitState {
  const values = net.values.slice(), clocks = clockInputs(net, values);
  return classify({ net, tick: 0, values, next: following(net, values, clocks, 0), clocks, changed: [],
    editedAt: 0, stableAt: null, period: 0, trace: [{ tick: 0, values }] });
}
function tickOnce(s: CircuitState): CircuitState {
  const { net, next: values } = s, tick = s.tick + 1, clocks = clockInputs(net, s.values);
  const changed = net.gates.flatMap((_, i) => values[net.first + i] !== s.values[net.first + i] ? [net.first + i] : []);
  return classify({ ...s, tick, values, clocks, changed, next: following(net, values, clocks, tick),
    trace: [...s.trace.slice(-63), { tick, values }] });
}

function step(s: CircuitState, grain?: string): StepResult<CircuitState> {
  const from = s.tick;
  const settle = !s.net.every && grain === '到稳定';
  const half = s.net.every && grain === '半个周期' ? s.net.every : 0;
  const target = from + Math.min(half ? half - from % half : 1, Number.MAX_SAFE_INTEGER - from);
  // 半周期中的外部时钟恒定。遇到完全相同的内部状态可跳过整周期，尾部逐拍保留供时序图使用。
  const repeated = new Map<string, number>();
  let computed = 0;
  while (s.tick < target || (settle && s.tick < Number.MAX_SAFE_INTEGER && s.stableAt === null && !s.period)) {
    if (computed === tickBudget) break;
    // 快进后要有足够预算重建时序窗口，即使本步提前返回也保留连续的最近 64 拍。
    if (half && target - s.tick > 65 && tickBudget - computed >= 65) {
      const key = s.values.join('') + ':' + s.clocks.join('');
      const earlier = repeated.get(key);
      if (earlier === undefined) repeated.set(key, s.tick);
      else {
        const period = s.tick - earlier;
        const skip = Math.floor((target - s.tick - 65) / period) * period;
        if (skip) s = { ...s, tick: s.tick + skip };
      }
    }
    s = tickOnce(s);
    computed++;
  }
  let text = '第 ' + s.tick + ' 拍。';
  if (s.period) text += '没有稳定，每 ' + s.period + ' 拍重复一次。';
  else if (s.stableAt !== null) text += '拨动以后第 ' + s.stableAt + ' 拍稳定。';
  else if (computed === tickBudget && (settle || s.tick < target))
    text += '本步已计算 ' + computed + (settle ? ' 拍，还没稳定，也没发现重复。' : ' 拍，还没到下一次 CLK 翻转。');
  else text += s.changed.length ? s.changed.map(i => s.net.gates[i - s.net.first].id).join('、') + ' 的输出改变。' : '门输出保持。';
  const done = s.tick === Number.MAX_SAFE_INTEGER;
  if (done) text += '已到可精确表示的最后一拍。';
  return { state: s, events: [{ kind: 'write', text }], previewCost: computed, pause: s.period > 0 || s.stableAt !== null, done };
}

export const circuitMachine: Machine<Circuit, CircuitState> = {
  init: initial, step,
  edit(s, action) {
    if (!action || typeof action !== 'object' || Array.isArray(action)) throw new Error('要指定输入开关和值');
    const values = s.values.slice();
    for (const [name, v] of Object.entries(action)) {
      const i = s.net.inputs.indexOf(name);
      if (i < 0 || (v !== 0 && v !== 1)) throw new Error('输入必须是已有的开关和值 0 或 1');
      values[i] = v;
    }
    if (values.every((v, i) => v === s.values[i])) return s;
    return classify({ ...s, values, next: following(s.net, values, s.clocks, s.tick),
      editedAt: s.tick, stableAt: null, period: 0, seen: undefined,
      trace: [...s.trace.slice(0, -1), { tick: s.tick, values }] });
  },
  observe(s) {
    const signals = Object.fromEntries(s.net.observed.map(name => [name, s.values[s.net.signals.get(name)!]]));
    return { ...signals, tick: s.tick, stable: Number(s.stableAt !== null), osc: Number(s.period > 0) };
  },
};

export function truthTable(net: Circuit) {
  if (net.every || net.dffs.length || net.longest === null || net.inputs.length > 6) throw new Error('这个电路不能列真值表');
  return Array.from({ length: 2 ** net.inputs.length }, (_, n) => {
    const values = net.values.slice();
    const inputs = net.inputs.map((_, i) => level((n >> (net.inputs.length - i - 1)) & 1));
    inputs.forEach((v, i) => { values[i] = v; });
    for (const i of net.order) values[net.first + i] = combinational(net.gates[i].type, net.gates[i].in, values);
    return { inputs, outputs: net.outputs.map(name => values[net.signals.get(name)!]) };
  });
}

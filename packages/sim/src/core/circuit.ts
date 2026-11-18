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
interface Seen { key: string; tick: number; previous?: Seen }
interface Sample { tick: number; values: Level[] }
export interface CircuitState {
  net: Circuit; tick: number; values: Level[]; next: Level[]; clocks: Level[]; changed: number[];
  editedAt: number; stableAt: number | null; period: number; seen?: Seen; trace: Sample[];
}
function classify(s: CircuitState, batch?: Map<string, number>): CircuitState {
  if (s.net.every) return s;
  if (s.next.every((v, i) => v === s.values[i])) {
    return { ...s, stableAt: s.stableAt ?? s.tick - s.editedAt, seen: undefined };
  }
  if (!s.period && (s.net.longest === null || s.net.dffs.length)) {
    // 边沿存储也属于触发器的状态。同一拍内编辑会重开本段查重历史。
    const key = s.values.join('') + ':' + s.clocks.join('');
    let earlier = batch?.get(key);
    if (!batch) {
      for (let entry = s.seen; entry; entry = entry.previous) {
        if (entry.key === key) { earlier = entry.tick; break; }
      }
    }
    if (earlier !== undefined) return { ...s, period: s.tick - earlier, seen: undefined };
    batch?.set(key, s.tick);
    return { ...s, seen: { key, tick: s.tick, previous: s.seen } };
  }
  return s;
}
function initial(net: Circuit): CircuitState {
  const values = net.values.slice(), clocks = clockInputs(net, values);
  return classify({ net, tick: 0, values, next: following(net, values, clocks, 0), clocks, changed: [],
    editedAt: 0, stableAt: null, period: 0, trace: [{ tick: 0, values }] });
}
function tickOnce(s: CircuitState, batch?: Map<string, number>): CircuitState {
  const { net, next: values } = s, tick = s.tick + 1, clocks = clockInputs(net, s.values);
  const changed = net.gates.flatMap((_, i) => values[net.first + i] !== s.values[net.first + i] ? [net.first + i] : []);
  return classify({ ...s, tick, values, clocks, changed, next: following(net, values, clocks, tick),
    trace: [...s.trace.slice(-63), { tick, values }] }, batch);
}

function step(s: CircuitState, grain?: string): StepResult<CircuitState> {
  const from = s.tick;
  const settle = !s.net.every && grain === '到稳定';
  const half = s.net.every && grain === '半个周期' ? s.net.every : 0;
  const target = from + Math.min(half ? half - from % half : 1, Number.MAX_SAFE_INTEGER - from);
  // 半周期中的外部时钟恒定。遇到完全相同的内部状态可跳过整周期，尾部逐拍保留供时序图使用。
  const repeated = new Map<string, number>();
  if (settle) for (let e = s.seen; e; e = e.previous) repeated.set(e.key, e.tick);
  while (s.tick < target || (settle && s.tick < Number.MAX_SAFE_INTEGER && s.stableAt === null && !s.period)) {
    if (half && target - s.tick > 65) {
      const key = s.values.join('') + ':' + s.clocks.join('');
      const earlier = repeated.get(key);
      if (earlier === undefined) repeated.set(key, s.tick);
      else {
        const period = s.tick - earlier;
        const skip = Math.floor((target - s.tick - 65) / period) * period;
        if (skip) s = { ...s, tick: s.tick + skip };
      }
    }
    s = tickOnce(s, settle ? repeated : undefined);
  }
  let text = '第 ' + s.tick + ' 拍。';
  if (s.period) text += '没有稳定，每 ' + s.period + ' 拍重复一次。';
  else if (s.stableAt !== null) text += '拨动以后第 ' + s.stableAt + ' 拍稳定。';
  else text += s.changed.length ? s.changed.map(i => s.net.gates[i - s.net.first].id).join('、') + ' 的输出改变。' : '门输出保持。';
  const done = s.tick === Number.MAX_SAFE_INTEGER;
  if (done) text += '已到可精确表示的最后一拍。';
  return { state: s, events: [{ kind: 'write', text }], pause: s.period > 0 || s.stableAt !== null, done };
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

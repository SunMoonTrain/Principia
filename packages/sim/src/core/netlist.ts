export const primitiveTypes = ['not', 'buffer', 'and', 'or', 'xor', 'nand', 'nor', 'xnor', 'dff'] as const;
export type Primitive = typeof primitiveTypes[number];
export type Level = 0 | 1;
export interface Gate { id: string; type: string; in: string[]; at?: [number, number] }
export interface Module { inputs: string[]; gates: Gate[]; outputs: Record<string, string> }
export interface Netlist {
  inputs: Record<string, Level>; gates: Gate[]; outputs: Record<string, string>; modules?: Record<string, Module>;
  init?: Record<string, Level>; clock?: { every: number }; probes?: string[]; show?: ('circuit' | 'timing' | 'truth-table')[];
}
type Path = (string | number)[];
export class WiringError extends Error {
  constructor(readonly path: Path, message: string) { super(message); }
}
interface FlatGate { id: string; type: Primitive; in: string[] }
interface Expanded { inputs: string[]; gates: FlatGate[]; outputs: Record<string, string>; pins: Map<string, string>; depth: number }
const primitive = (name: string): name is Primitive => primitiveTypes.some((t) => t === name);
const fixed = new Set(['tick', 'stable', 'osc', 'CLK']);
function identifier(id: string, path: Path) {
  if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(id) || fixed.has(id))
    throw new WiringError(path, '名字「' + id + '」无效或已被保留');
}

/** 一次展开一个作用域。先登记全部接脚，再连线，因而网表允许反馈和向后引用。 */
function expand(scope: Module, templates: Map<string, Expanded>, clock: boolean, base: Path): Expanded {
  const names = new Set<string>(), sources = new Set<string>(), aliases = new Map<string, string>();
  const local = new Set<string>(), gates: FlatGate[] = [];
  let depth = 0;
  const declare = (id: string, path: Path) => {
    identifier(id, path);
    if (names.has(id)) throw new WiringError(path, '信号名重复：' + id);
    names.add(id);
  };
  for (const [i, input] of scope.inputs.entries()) {
    declare(input, [...base, 'inputs', base.length ? i : input]);
    sources.add(input); local.add(input);
  }
  if (clock) { sources.add('CLK'); local.add('CLK'); }
  scope.gates.forEach((gate, i) => {
    const at = [...base, 'gates', i], type = gate.type;
    declare(gate.id, [...at, 'id']);
    if (primitive(type)) {
      const n = gate.in.length;
      const valid = type === 'not' || type === 'buffer' ? n === 1 : type === 'dff' ? n === 2 : n >= 2 && n <= 4;
      if (!valid) throw new WiringError([...at, 'in'], type + ' 的输入个数不对');
      local.add(gate.id); sources.add(gate.id);
      gates.push({ id: gate.id, type, in: gate.in });
    } else {
      const mod = templates.get(type);
      if (!mod) throw new WiringError([...at, 'type'], '未知门或尚未定义的子电路：' + type + '（须先定义后使用，不能递归）');
      if (gate.in.length !== mod.inputs.length) throw new WiringError([...at, 'in'], type + ' 需要 ' + mod.inputs.length + ' 个输入');
      depth = Math.max(depth, 1 + mod.depth);
      if (depth + Number(base.length > 0) > 3) throw new WiringError([...at, 'type'], '子电路最多嵌套 3 层');
      const args = new Map(mod.inputs.map((pin, j) => [pin, gate.in[j]]));
      const bind = (signal: string) => args.get(signal) ?? (signal === 'CLK' ? signal : gate.id + '.' + signal);
      for (const inner of mod.gates) {
        const id = gate.id + '.' + inner.id;
        gates.push({ id, type: inner.type, in: inner.in.map(bind) }); sources.add(id);
      }
      for (const [pin, signal] of Object.entries(mod.outputs)) {
        const name = gate.id + '.' + pin;
        local.add(name); aliases.set(name, bind(signal));
      }
    }
    if (gates.length > 200) throw new WiringError(at, '展开后的门超过 200 个');
  });

  for (const [name, signal] of Object.entries(scope.outputs)) {
    const at = [...base, 'outputs', name];
    identifier(name, at);
    if (names.has(name) && name !== signal) throw new WiringError(at, '输出名和已有信号重名：' + name);
    if (!names.has(name)) aliases.set(name, signal);
  }
  const check = (signal: string, path: Path) => {
    if (!local.has(signal) && !Object.hasOwn(scope.outputs, signal)) throw new WiringError(path, '未连接或不存在的信号：' + signal);
  };
  scope.gates.forEach((g, i) => g.in.forEach((s, j) => check(s, [...base, 'gates', i, 'in', j])));
  for (const [name, signal] of Object.entries(scope.outputs)) check(signal, [...base, 'outputs', name]);

  const resolve = (signal: string, path: Path): string => {
    const seen = new Set<string>();
    while (!sources.has(signal)) {
      const next = aliases.get(signal);
      if (next === undefined || seen.has(signal)) throw new WiringError(path, '信号没有驱动它的门或输入：' + signal);
      seen.add(signal); signal = next;
    }
    return signal;
  };
  const outputs = Object.fromEntries(Object.entries(scope.outputs).map(([name, v]) => [name, resolve(v, [...base, 'outputs', name])]));
  for (const g of gates) g.in = g.in.map(s => resolve(s, [...base, 'gates']));
  const pins = new Map([...local].map(s => [s, resolve(s, base)]));
  return { inputs: scope.inputs, gates, outputs, pins, depth };
}

export function compileCircuit(p: Netlist) {
  const inputs = Object.keys(p.inputs), outputs = Object.keys(p.outputs);
  if (inputs.length + p.gates.length + outputs.length + Number(!!p.clock) > 40)
    throw new WiringError(['gates'], '顶层开关、时钟、元件和输出灯合计最多 40 个');
  if (!outputs.length) throw new WiringError(['outputs'], '至少连接一个输出');
  const templates = new Map<string, Expanded>();
  for (const [name, module] of Object.entries(p.modules ?? {})) {
    identifier(name, ['modules', name]);
    if (primitive(name)) throw new WiringError(['modules', name], '子电路不能与基本门重名');
    templates.set(name, expand(module, templates, !!p.clock, ['modules', name]));
  }
  const flat = expand({ ...p, inputs }, templates, !!p.clock, []);
  const clock = p.clock ? inputs.length : -1, first = inputs.length + Number(!!p.clock);
  const slots = new Map([...inputs, ...(p.clock ? ['CLK'] : []), ...flat.gates.map(g => g.id)].map((s, i) => [s, i]));
  const index = (s: string) => slots.get(s)!;
  const signals = new Map([...flat.pins].map(([s, v]) => [s, index(v)]));
  for (const [key, v] of Object.entries(flat.outputs)) signals.set(key, index(v));
  const gates = flat.gates.map(g => ({ id: g.id, type: g.type, in: g.in.map(index) }));
  const values: Level[] = [...Object.values(p.inputs), ...(p.clock ? [0 as const] : []), ...gates.map(() => 0 as const)];
  const initialized = new Set<number>();
  for (const [name, value] of Object.entries(p.init ?? {})) {
    const slot = signals.get(name) ?? slots.get(name);
    if (slot === undefined || slot < first || initialized.has(slot)) throw new WiringError(['init', name], '初值必须对应唯一的门输出：' + name);
    initialized.add(slot); values[slot] = value;
  }
  const dffs = gates.flatMap((g, i) => g.type === 'dff' ? [i] : []);
  const depth = new Map<number, number>(), visiting = new Set<number>(), order: number[] = [];
  let feedback = false;
  function distance(slot: number): number {
    if (slot < first || gates[slot - first].type === 'dff') return 0;
    const known = depth.get(slot);
    if (known !== undefined) return known;
    if (visiting.has(slot)) { feedback = true; return 0; }
    visiting.add(slot);
    const n = 1 + Math.max(...gates[slot - first].in.map(distance));
    visiting.delete(slot); depth.set(slot, n); order.push(slot - first);
    return n;
  }
  gates.forEach((_, i) => distance(first + i));
  const endpoints = [...outputs.map(s => signals.get(s)!), ...dffs.flatMap(i => gates[i].in)];
  const longest = feedback ? null : Math.max(0, ...endpoints.map(distance));
  if (p.show?.includes('truth-table') && (p.clock || dffs.length || feedback || inputs.length > 6))
    throw new WiringError(['show'], '真值表只支持无时钟、无 dff、无反馈且不超过 6 个输入的组合电路');
  for (const [i, s] of (p.probes ?? []).entries()) {
    if (!signals.has(s)) throw new WiringError(['probes', i], '探针找不到信号：' + s);
  }
  const observed = [...new Set([...inputs, ...outputs, ...p.gates.filter(g => primitive(g.type)).map(g => g.id),
    ...(p.clock ? ['CLK'] : [])])];
  const waves = [...new Set([...(p.clock ? ['CLK'] : []), ...inputs, ...outputs, ...p.probes ?? []])];
  return { inputs, outputs, gates, values, first, clock, every: p.clock?.every, dffs, signals, observed, waves, longest, order };
}
export type Circuit = ReturnType<typeof compileCircuit>;

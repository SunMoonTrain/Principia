import { bNames } from './core/b-tree.ts';
import { unionNames } from './core/union-find.ts';
import { trieNames } from './core/trie.ts';
import { treeNames } from './core/tree.ts';
import { sortSchema } from './sort-schema.ts';
import { sortNames } from './core/sort.ts';
import { gridSchema } from './grid-search-schema.ts';
import { gridNames } from './core/grid-search.ts';
import { graphSchema } from './graph-schema.ts';
import { graphNames } from './core/graph.ts';
import { treeSchema, memorySchema } from './structure-schema.ts';
import { memoryNames } from './core/memory.ts';
import { pipeNames } from './core/pipeline.ts';
import { cacheSchema } from './cache-schema.ts';
import { cacheNames } from './core/cache.ts';
import { pipelineSchema, cpuSchema, type CpuParams } from './p8-schema.ts';
import { cpuNames, cachedCpuNames } from './core/p8.ts';
import { z } from 'zod';
import type { ComponentSpec } from '../../anim/src/specs.ts';

import { evaluateValue } from '../../../shared/expr.ts';
import { binaryOps, unaryOps, bitNames, widths, type BitParams } from './core/bits.ts';
import { compileCircuit, WiringError, type Netlist } from './core/netlist.ts';
import { floatNames, toBits } from './core/float32.ts';

export const SIM_COMPONENTS = ['bits', 'float32', 'text-encoding', 'logic-circuit', 'cpu', 'cache', 'pipeline', 'memory', 'tree', 'sort', 'grid-search', 'graph', 'dp-table'] as const;
export const ConditionList = z.array(z.strictObject({ when: z.string().min(1), text: z.string().min(1) }));
const numeric = z.union([z.number(), z.string()]).transform((raw, ctx) => {
  const result = evaluateValue(raw);
  if (result.ok) return result.value;
  ctx.addIssue({ code: 'custom', message: result.message });
  return z.NEVER;
});
const integer = numeric.pipe(z.int());
const width = integer.pipe(z.literal(widths));
const bitOp = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.enum(binaryOps), b: integer }),
  z.strictObject({ kind: z.enum(unaryOps) }),
  z.strictObject({ kind: z.literal('extend'), to: width, signed: z.boolean().optional() }),
  z.strictObject({ kind: z.literal('truncate'), to: width }),
]);
const bits = z.strictObject({ width, value: integer, op: bitOp.optional(), editable: z.boolean().default(true),
  show: z.array(z.enum(['unsigned', 'signed', 'hex', 'octal', 'char', 'wheel'])).default(['unsigned', 'signed', 'hex']),
}).superRefine((p, ctx) => {
  const fits = (n: number) => -(2 ** (p.width - 1)) <= n && n < 2 ** p.width;
  if (!fits(p.value)) ctx.addIssue({ code: 'custom', path: ['value'], message: '初值超出所选位宽' });
  if (p.op && 'b' in p.op && !fits(p.op.b)) ctx.addIssue({ code: 'custom', path: ['op', 'b'], message: '第二个数超出所选位宽' });
  if (p.op && 'to' in p.op && (p.op.kind === 'extend' ? p.op.to <= p.width : p.op.to >= p.width))
    ctx.addIssue({ code: 'custom', path: ['op', 'to'], message: '扩展要增加位宽，截断要减少位宽' });
  if (p.show.includes('wheel') && (p.width > 8 || (p.op && 'to' in p.op && p.op.to > 8)))
    ctx.addIssue({ code: 'custom', path: ['show'], message: '数轮只能显示至多 8 位的数' });
});
const finite32 = numeric.refine((n) => Number.isFinite(Math.fround(n)), '转成单精度后必须是有限数');
const shared = { compare64: z.boolean().optional() };
const float = z.discriminatedUnion('mode', [
  z.strictObject({ mode: z.literal('inspect'), value: numeric.optional(), bits: integer.pipe(z.number().min(0).max(0xffffffff)).optional(), ...shared }),
  z.strictObject({ mode: z.literal('add'), a: finite32, b: finite32, ...shared }),
  z.strictObject({ mode: z.literal('accumulate'), start: finite32.default(0), delta: finite32, count: integer.pipe(z.number().min(1).max(1000)), ...shared }),
]).superRefine((p, ctx) => {
  if (p.mode === 'inspect' && (p.value === undefined) === (p.bits === undefined))
    ctx.addIssue({ code: 'custom', path: ['value'], message: 'inspect 的 value 和 bits 要写其中一个' });
}).transform((p) => p.mode === 'inspect' ? { ...p, bits: p.bits ?? toBits(p.value!) } : p);
const utf = z.strictObject({ text: z.string().transform((s) => s.replace(/\n$/, '')),
  show: z.array(z.enum(['utf8', 'utf16'])).default(['utf8', 'utf16']) });
export type BitsDisplay = z.output<typeof bits>;
export type FloatDisplay = z.output<typeof float>;
export type TextDisplay = z.output<typeof utf>;

const wire = z.string().min(1);
const bitLevel = integer.pipe(z.literal([0, 1]));
const gate = z.strictObject({ id: wire, type: wire, in: z.array(wire), at: z.tuple([integer, integer]).optional() });
const outputs = z.record(wire, wire);
const moduleSchema = z.strictObject({ inputs: z.array(wire), gates: z.array(gate), outputs });
const circuit = z.strictObject({
  inputs: z.record(wire, bitLevel), gates: z.array(gate), outputs,
  modules: z.record(wire, moduleSchema).optional(), init: z.record(wire, bitLevel).optional(),
  clock: z.strictObject({ every: integer.pipe(z.number().positive()) }).optional(),
  probes: z.array(wire).optional(), show: z.array(z.enum(['circuit', 'truth-table', 'timing'])).min(1).default(['circuit']),
}).superRefine((params, ctx) => {
  try { compileCircuit(params); }
  catch (error) {
    if (!(error instanceof WiringError)) throw error;
    ctx.addIssue({ code: 'custom', path: error.path, message: error.message });
  }
});
const common = { labels: () => [], check: () => [], reserved: () => [] };
export const SIM_SPECS: Record<string, ComponentSpec> = {
  'sort': { ...common, schema:sortSchema, observables:()=>sortNames },
  'grid-search': { ...common, schema:gridSchema, observables:()=>gridNames },
  'graph': { ...common, schema:graphSchema, observables:()=>graphNames },
  tree: { ...common, schema:treeSchema, observables:(p:{kind:string})=>p.kind==='trie'?trieNames:p.kind==='union-find'?unionNames:p.kind==='b-tree'?bNames:treeNames },
  memory: { ...common, schema:memorySchema, observables:()=>memoryNames },
  pipeline: { ...common, schema:pipelineSchema, observables:()=>pipeNames },
  cache: { ...common, schema:cacheSchema, observables:()=>cacheNames },
  cpu: { ...common, schema:cpuSchema, observables:(p:CpuParams) => p.cache?cachedCpuNames:cpuNames },
  'logic-circuit': { ...common, schema: circuit, observables: (p: Netlist) => [...compileCircuit(p).observed, 'tick', 'stable', 'osc'] },
  bits: { ...common, schema: bits, reserved: () => bitNames, observables: (p: BitParams) => p.op ? bitNames : [] },
  float32: { ...common, schema: float, reserved: () => floatNames, observables: (p: FloatDisplay) => p.mode === 'inspect' ? [] : floatNames },
  'text-encoding': { ...common, schema: utf, observables: () => [] },
};

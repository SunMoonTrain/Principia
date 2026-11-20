import { z } from 'zod';
import { structures } from './core/operations.ts';
import { prime, variables } from './core/memory.ts';

const byte = z.int().min(0).max(255);
const capacity = z.int().min(1).max(64);
const common = {
  region: z.tuple([byte, byte]).default([16, 255]),
  ops: z.string(), granularity: z.enum(['step', 'op']).default('step'), editable: z.boolean().default(true),
};
export const memorySchema = z.strictObject({
  ...common, structure: z.enum(structures), view: z.array(z.enum(['structure', 'memory'])).min(1).default(['structure', 'memory']),
  capacity: capacity.optional(), growth: z.number().min(1.25).max(4).optional(),
  slots: z.int().min(3).max(97).pipe(z.int().refine(prime, 'slots 必须是素数')).optional(),
  probe: z.enum(['linear', 'quadratic', 'double']).optional(), loadLimit: z.number().positive().optional(),
}).superRefine((p, ctx) => {
  const error = (field:string, message:string) => ctx.addIssue({code:'custom', path:[field], message});
  const hash = p.structure.startsWith('hash-'), array = !hash && p.structure !== 'linked-list';
  for (const k of ['capacity','growth'] as const) if (!array && p[k] !== undefined) error(k,'只适用于数组、栈或队列');
  for (const k of ['slots','loadLimit'] as const) if (!hash && p[k] !== undefined) error(k,'只适用于散列表');
  if (p.probe && p.structure !== 'hash-open') error('probe','只适用于开放寻址');
  if (p.structure === 'hash-open' && p.loadLimit !== undefined && (p.loadLimit >= 1 || (p.probe === 'quadratic' && p.loadLimit > 0.5)))
    error('loadLimit','开放寻址须小于 1，平方探测不超过 0.5');
  const [lo,hi] = p.region, need = hash ? p.slots ?? 11 : array ? p.capacity ?? 4 : 1;
  if (lo < variables(p.structure).length || hi-lo+1 < need) error('region','堆区覆盖变量或放不下初始结构');
}).transform(p => ({...p, capacity:p.capacity ?? 4, growth:p.growth ?? 2, slots:p.slots ?? 11, probe:p.probe ?? 'linear'}));

import { z } from 'zod';
import { parseJobs, policies } from './core/scheduler.ts';

const slice = z.int().min(1).max(20);
const run = z.strictObject({
  algorithm: z.enum(policies), quantum: slice.optional(), preemptive: z.boolean().optional(),
  quanta: z.array(slice).min(2).max(4).optional(),
  allotments: z.array(z.int().min(1).max(100)).min(2).max(4).optional(),
  boost: z.int().min(0).max(200).refine(n => n !== 1).optional(),
}).superRefine((r, ctx) => {
  for (const [key, policy] of [['quantum','rr'],['preemptive','priority'],['quanta','mlfq'],['allotments','mlfq'],['boost','mlfq']] as const)
    if (r[key] !== undefined && r.algorithm !== policy)
      ctx.addIssue({code:'custom', path:[key], message:key + ' 仅适用于 ' + policy});
  const quanta = r.quanta ?? [2,4,8];
  if (r.allotments && (r.allotments.length !== quanta.length || r.allotments.some((a,i) => a < quanta[i])))
    ctx.addIssue({code:'custom', path:['allotments'], message:'额度要与时间片逐级对应，且不小于该级时间片'});
});
export const schedulerSchema = z.strictObject({
  jobs: z.string(), runs: z.array(run).min(1).max(2), editable: z.boolean().default(true),
}).transform((p, ctx) => {
  const {tasks, errors} = parseJobs(p.jobs, p.runs.some(r => r.algorithm === 'priority'));
  for (const {row, message} of errors) ctx.addIssue({code:'custom', path:['jobs'], params:{row}, message});
  return {...p, tasks};
});

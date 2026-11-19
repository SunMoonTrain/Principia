import { z } from 'zod';
import { inputByte, mnemonics } from './core/p8-asm.ts';

const byte = z.union([z.number(), z.string()]).transform((v, ctx) => {
  const n = inputByte(v);
  if (n !== undefined) return n;
  ctx.addIssue({code:'custom',message:'字节须为 −128 到 255 的整数'});
  return z.NEVER;
});
export const p8Bytes = z.array(byte).max(256);
export const p8Isa = z.array(z.string().transform(s => s.toUpperCase()).refine(s => mnemonics.includes(s),'不认识的 P8 助记符'));
export const cpuViews = ['code','registers','flags','memory','stack','output','cycles'] as const;
export const cpuSchema = z.strictObject({
  program:z.string(), input:p8Bytes.default([]), isa:p8Isa.optional(),
  view:z.array(z.enum(cpuViews)).default([...cpuViews]), granularity:z.enum(['instruction','micro']).default('instruction'),
  breakpoints:z.array(z.union([z.string(),z.int().positive()])).default([]), editable:z.boolean().default(true),
});
export type CpuParams = z.output<typeof cpuSchema>;

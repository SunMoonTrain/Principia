import { z } from 'zod';
import { replacements } from './core/page-replacement.ts';
export const replacementSchema=z.strictObject({
  refs:z.array(z.int().min(0).max(99)).min(1).max(40),
  runs:z.array(z.strictObject({algorithm:z.enum(replacements),frames:z.int().min(1).max(8)})).min(1).max(2),
  curve:z.boolean().default(false),editable:z.boolean().default(true),
});

import { z } from 'zod';
import { parseFsOps } from './core/filesystem.ts';

export const fsSchema=z.strictObject({
  inodes:z.int().min(4).max(32),blocks:z.int().min(4).max(64),direct:z.int().min(1).max(8),
  indirect:z.int().min(0).max(16),entries:z.int().min(3).max(8),ops:z.string(),
  granularity:z.enum(['io','op']).default('io'),editable:z.boolean().default(true),
}).transform((p,ctx)=>{
  const {commands,errors}=parseFsOps(p.ops);
  for(const {message,row} of errors)ctx.addIssue({code:'custom',path:['ops'],message,params:{row}});
  return {...p,commands};
});

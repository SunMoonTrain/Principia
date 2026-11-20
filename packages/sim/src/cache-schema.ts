import { z } from 'zod';
import { parseAccess, type Access } from './core/cache.ts';

const power = (max:number) => z.int().min(1).max(max).refine(n=>(n & (n-1))===0,'必须是 2 的幂');
const fields = z.strictObject({
  blockSize:power(32), sets:power(64), ways:power(8), replace:z.enum(['lru','fifo','random']),
  write:z.enum(['write-back','write-through']), seed:z.int().optional(),
});
export const cacheConfig = fields.extend({replace:fields.shape.replace.default('lru'),write:fields.shape.write.default('write-back')})
  .superRefine((c,ctx)=>{
    if (c.blockSize*c.sets*c.ways>256) ctx.addIssue({code:'custom',path:['ways'],message:'缓存容量不能超过 256 字节'});
    if (c.replace==='random' && c.seed===undefined) ctx.addIssue({code:'custom',path:['replace'],message:'random 必须写 seed'});
  });
const address = z.union([z.number(),z.string()]).transform((v,ctx)=>{
  const a=parseAccess(v);
  if (a) return a;
  ctx.addIssue({code:'custom',message:'地址须为 0–255，写操作用 w 前缀'}); return z.NEVER;
});
const pattern = z.strictObject({kind:z.literal('matrix'),base:z.int().min(0).max(255),
  rows:z.int().min(1).max(256),cols:z.int().min(1).max(256),order:z.enum(['row','column'])})
  .refine(p=>p.base+p.rows*p.cols<=256,{path:['base'],message:'矩阵超出 256 字节内存'});
export const cacheSchema = z.strictObject({...cacheConfig.shape, compare:fields.partial().optional(),
  accesses:z.array(address).min(1).max(256).optional(),pattern:pattern.optional(),editable:z.boolean().default(true)})
  .transform(({accesses,pattern,compare,editable,...base},ctx)=>{
    if (!!accesses===!!pattern) ctx.addIssue({code:'custom',path:[pattern?'pattern':'accesses'],message:'accesses 和 pattern 必须选一个'});
    const main=cacheConfig.safeParse(base), other=compare && cacheConfig.safeParse({...base,...compare});
    if (!main.success) main.error.issues.forEach(e=>ctx.addIssue({code:'custom',path:e.path,message:e.message}));
    if (other && !other.success) other.error.issues.forEach(e=>ctx.addIssue({code:'custom',path:['compare',...e.path],message:e.message}));
    if (!main.success || (other && !other.success)) return z.NEVER;
    const stream:Access[] = accesses ?? [];
    if (pattern) {
      const {base,rows,cols,order}=pattern;
      for(let i=0;i<rows*cols;i++) stream.push({address:base+(order==='row'?i:(i%rows)*cols+Math.floor(i/rows)),write:false});
    }
    return {config:main.data,compare:other?.data,accesses:stream,editable};
  });
export type CacheParams = z.output<typeof cacheSchema>;

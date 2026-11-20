import {z} from 'zod';
const text=(pattern:RegExp)=>z.string().normalize('NFKC').regex(pattern,'请输入 1–12 个符合要求的字符');
const common={editable:z.boolean().default(true)};
export const dpSchema=z.discriminatedUnion('problem',[
  z.strictObject({...common,problem:z.literal('lcs'),a:text(/^[\p{L}\p{N}]{1,12}$/u),b:text(/^[\p{L}\p{N}]{1,12}$/u)}),
  z.strictObject({...common,problem:z.literal('edit-distance'),a:text(/^\p{L}{1,12}$/u),b:text(/^\p{L}{1,12}$/u)}),
  z.strictObject({...common,problem:z.literal('knapsack'),capacity:z.int().min(1).max(20),
    items:z.array(z.tuple([z.int().min(1).max(20),z.int().min(1).max(99)])).min(1).max(8)}),
]);

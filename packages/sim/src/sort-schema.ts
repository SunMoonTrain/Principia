import { z } from 'zod';
import { sorts,presetData } from './core/sort.ts';
const data=z.array(z.int().min(1).max(99)).min(2).max(32);
const preset=z.strictObject({kind:z.enum(['random','sorted','reversed','few-unique']),n:z.int().min(2).max(32),seed:z.int().optional()});
export const sortSchema=z.strictObject({algorithm:z.enum(sorts),data:data.optional(),preset:preset.optional(),race:z.array(z.enum(sorts)).min(1).max(2).optional(),
  pivot:z.enum(['last','random']).optional(),seed:z.int().optional(),editable:z.boolean().default(true)}).superRefine((p,c)=>{
  const error=(path:string[],message:string)=>c.addIssue({code:'custom',path,message});
  if(!!p.data===!!p.preset)error([p.preset?'preset':'algorithm'],'data 和 preset 须选一个');
  if(p.preset && ['random','few-unique'].includes(p.preset.kind)&&p.preset.seed===undefined)error(['preset'],'随机预设需要 seed');
  if(p.pivot && p.algorithm!=='quick')error(['pivot'],'pivot 只用于主算法 quick');
  if(p.pivot==='random' && p.seed===undefined)error(['pivot'],'随机枢轴需要 seed');
  if(new Set([p.algorithm,...p.race??[]]).size!==1+(p.race?.length??0))error(['race'],'请选择不同的算法');
}).transform(p=>({...p,data:p.data??presetData(p.preset!),race:p.race??[]}));

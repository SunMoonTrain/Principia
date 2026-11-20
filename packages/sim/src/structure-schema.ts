import { z } from 'zod';
import { treeKinds, isHeap } from './core/tree.ts';
import { normalizeWord, validWord, structures } from './core/operations.ts';
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

const binarySchema = z.strictObject({
  ...common, kind:z.enum(treeKinds), keys:z.array(byte).default([]), capacity:capacity.optional(),
  view:z.array(z.enum(['tree','memory','array'])).min(1).optional(),
}).superRefine((p,ctx)=>{
  const heap=isHeap(p.kind),[lo,hi]=p.region;
  const error=(field:string,message:string)=>ctx.addIssue({code:'custom',path:[field],message});
  if(!heap && p.capacity!==undefined)error('capacity','只有堆使用 capacity');
  if(!heap && p.view?.includes('array'))error('view','只有堆有数组视图');
  const minimum=heap?Math.max(p.capacity??4,p.keys.length):new Set(p.keys).size*(p.kind==='bst'?3:4);
  if(lo<(heap?3:1)||hi<lo)error('region','堆区与变量重叠，或范围颠倒');
  else if(hi-lo+1<minimum)error(p.keys.length?'keys':'region','初始结构放不进堆区');
}).transform(p=>({...p,capacity:p.capacity??4,view:p.view??(isHeap(p.kind)?['tree','array','memory']:['tree','memory'])}));

const treeView=z.array(z.enum(['tree','memory'])).min(1).default(['tree','memory']);
const trieSchema=z.strictObject({
  ...common, kind:z.literal('trie'), view:treeView,
  keys:z.array(z.string().transform(normalizeWord).refine(validWord,'词限 1–16 个字母 a–z')).default([]),
}).superRefine((p,ctx)=>{
  const [lo,hi]=p.region, prefixes=new Set<string>();
  if(lo<1 || hi<lo)ctx.addIssue({code:'custom',path:['region'],message:'堆区覆盖 root 或范围颠倒'});
  for(const word of p.keys)for(let i=1;i<=word.length;i++)prefixes.add(word.slice(0,i));
  if(prefixes.size*4>hi-lo+1)ctx.addIssue({code:'custom',path:['keys'],message:'不同前缀所需的结点放不进堆区'});
});

const unionSchema=z.strictObject({
  ...common, kind:z.literal('union-find'), n:z.int().min(2).max(32).default(8),
  union:z.enum(['rank','size','simple']).default('rank'), compress:z.boolean().default(true),
  parent:z.array(byte).max(32).optional(),view:z.array(z.enum(['tree','array','memory'])).min(1).default(['tree','array','memory']),
}).superRefine((p,ctx)=>{
  const [lo,hi]=p.region, parent=p.parent;
  const error=(field:string,message:string)=>ctx.addIssue({code:'custom',path:[field],message});
  if(lo<4 || hi-lo+1<p.n*(p.union==='simple'?1:2))error('region','堆区覆盖变量或放不下初始数组');
  if(!parent)return;
  if(parent.length!==p.n || parent.some(v=>v>=p.n)){error('parent','parent 须有 n 个有效的元素编号');return;}
  for(let i=0;i<p.n;i++){
    let at=i,hops=0;
    while(at!==parent[at] && hops++<p.n)at=parent[at];
    if(at!==parent[at]){error('parent','父指针有环');return;}
  }
});
export const treeSchema=z.discriminatedUnion('kind',[binarySchema,trieSchema,unionSchema]);

import { z } from 'zod';
import { heuristics, searches } from './core/grid-search.ts';
const run=z.strictObject({algorithm:z.enum(searches),heuristic:z.enum(heuristics).optional(),weight:z.number().min(1).max(10).optional()}).superRefine((v,c)=>{
  if(v.heuristic && !['greedy','astar'].includes(v.algorithm))c.addIssue({code:'custom',path:['heuristic'],message:'只有贪心和 A* 使用启发式'});
  if(v.weight!==undefined&&v.algorithm!=='astar')c.addIssue({code:'custom',path:['weight'],message:'只有 A* 使用 weight'});
});
export const gridSchema=z.strictObject({map:z.string(),moves:z.literal([4,8]).default(4),runs:z.array(run).min(1).max(2),
  costs:z.record(z.string().refine(s=>Array.from(s).length===1&&!'.#SG'.includes(s),'只给单个自定义地形指定代价'),z.int().min(1).max(9)).default({}),
  editable:z.boolean().default(true)}).transform((p,c)=>{
  const rows=p.map.replace(/\n$/,'').split('\n'),width=Array.from(rows[0]).length;
  const error=(message:string,row=0)=>c.addIssue({code:'custom',path:['map'],message,params:{row}});
  if(rows.length<2||rows.length>25)error('地图需要 2–25 行');
  if(width<2||width>40)error('地图需要 2–40 列');
  let starts=0,goals=0;
  rows.forEach((line,row)=>{
    const cells=Array.from(line);
    if(cells.length!==width)error('地图各行必须等长',row);
    for(const ch of cells){if(ch==='S')starts++;else if(ch==='G')goals++;
      else if(ch!=='.'&&ch!=='#'&&!Object.hasOwn(p.costs,ch)){error('未定义的地形 '+ch,row);break;}}
  });
  if(starts!==1||goals!==1)error('地图必须各有一个 S 和 G');
  return {...p,rows};
});

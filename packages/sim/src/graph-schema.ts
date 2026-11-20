import {z} from 'zod';
import {graphAlgos,type Edge} from './core/graph.ts';
const name=z.string().regex(/^[\p{L}\p{N}_]{1,12}$/u,'结点名为 1–12 个字母、数字或下划线');
const xy=z.number().min(0).max(20);
export const graphSchema=z.strictObject({algorithm:z.enum(graphAlgos),nodes:z.record(name,z.tuple([xy,xy])),edges:z.string(),
  source:name.optional(),sink:name.optional(),editable:z.boolean().default(true),view:z.array(z.enum(['graph','table','adjacency','matrix'])).min(1).default(['graph','table'])
}).transform((p,c)=>{
  const names=Object.keys(p.nodes),links:Edge[]=[],seen=new Set<string>();let directed:boolean|undefined;
  const error=(field:string,message:string,row?:number)=>c.addIssue({code:'custom',path:[field],message,params:row===undefined?{}:{row}});
  if(names.length<2||names.length>16)error('nodes','需要 2–16 个结点');
  for(const [i,line] of p.edges.trimEnd().split('\n').entries()){
    if(!line.trim())continue;
    const parts=/^\s*(\S+?)\s+(--|->)\s+(\S+)\s+([+-]?[0-9０-９]+)\s*$/.exec(line);
    if(!parts){error('edges','边应写作 A -- B 4 或 A -> B 4',i);continue;}
    const [,u,arrow,v,weight]=parts,w=Number(weight.normalize('NFKC')),d=arrow==='->';
    if(!names.includes(u)||!names.includes(v)){error('edges','边的端点不在 nodes 里',i);continue;}
    if(u===v){error('edges','图不允许自环',i);continue;}
    if(directed!==undefined&&directed!==d)error('edges','不能混用有向和无向边',i);directed=d;
    const key=(d?[u,v]:[u,v].sort()).join(':');
    if(seen.has(key))error('edges','重复边',i);
    if(p.algorithm==='max-flow' && seen.has(v+':'+u))error('edges','流网络不允许反平行边',i);
    if(w < -99||w>99 || (p.algorithm==='max-flow'&&w<1) || (w<0&&!['dijkstra','bellman-ford','prim','kruskal'].includes(p.algorithm)))error('edges','边权不符合算法要求',i);
    if((['prim','kruskal'].includes(p.algorithm)&&d)||(['topo','max-flow'].includes(p.algorithm)&&!d))error('edges','边的方向不符合算法要求',i);
    seen.add(key);links.push({u,v,w});
  }
  if(p.source!==undefined?!names.includes(p.source):!['topo','kruskal'].includes(p.algorithm))error(p.source===undefined?'algorithm':'source','需要有效的起点');
  if(p.algorithm==='max-flow'){if(!p.sink||!names.includes(p.sink)||p.sink===p.source)error(p.sink?'sink':'algorithm','汇点必须存在且和起点不同');}
  else if(p.sink!==undefined)error('sink','只有最大流使用汇点');
  return {...p,links,directed:directed??['topo','max-flow'].includes(p.algorithm)};
});

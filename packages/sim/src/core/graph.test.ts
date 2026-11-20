import {expect,it} from 'vitest';
import {graphFrames,type GraphAlgo,type GraphParams} from './graph';
import {mulberry32} from './rng';
function config(edges:string,directed=false,extra:string[]=[]):GraphParams{
  const links=edges.split(';').filter(Boolean).map(line=>{const [u,v,w]=line.split(' ');return {u,v,w:Number(w??1)};});
  const names=[...new Set([...extra,...links.flatMap(e=>[e.u,e.v])])].sort();
  return {nodes:Object.fromEntries(names.map((u,i)=>[u,[i,0]])),links,directed,algorithm:'bfs',source:names[0],view:['graph']};
}
const base=config('A B 4;A C 2;B C 1;B D 5;C D 8;C E 10;D E 2;D F 6;E F 2');
const run=(algorithm:GraphAlgo,p=base)=>[...graphFrames({...p,algorithm})];
it('六结点图锁住访问、时间、边序、距离和微步',()=>{
  const bfs=run('bfs'),b=bfs.at(-1)!;expect(bfs.length-1).toBe(11);expect(b.order).toEqual([0,1,2,3,4,5]);expect(b.dist).toEqual([0,1,1,2,2,3]);
  const dfs=run('dfs'),f=dfs.at(-1)!;expect(dfs.length-1).toBe(16);expect(f.discovered).toEqual([1,2,3,4,5,6]);expect(f.finished).toEqual([12,11,10,9,8,7]);
  expect(f.kinds).toEqual(['树边','回边','树边','回边','树边','回边','树边','回边','树边']);
  for(const a of ['dijkstra','prim'] as const){const all=run(a),v=all.at(-1)!;expect(all.length-1).toBe(15);expect(v.order).toEqual([0,2,1,3,4,5]);
    if(a==='prim'){expect(v.chosen).toEqual([1,2,3,6,8]);expect(v.weight).toBe(12);}
    else {expect(v.dist).toEqual([0,3,2,8,10,12]);expect(v.relaxed).toBe(9);}}
  const k=run('kruskal');expect(k.slice(1).map(x=>x.writeEdges[0])).toEqual([2,1,6,8,0,3]);expect(k.at(-1)).toMatchObject({chosen:[2,1,6,8,3],weight:12});
  const bf=run('bellman-ford');expect(bf.length-1).toBe(36);expect(bf.at(-1)).toMatchObject({rounds:2,dist:[0,3,2,8,10,12]});
});
it('负权反例、负环、横跨边、穿衣拓扑序和无零入度',()=>{
  const neg=config('A B 2;A C 3;C B -2',true);
  expect(run('dijkstra',neg).at(-1)?.dist[1]).toBe(2);
  const bf=run('bellman-ford',neg);expect(bf.length-1).toBe(6);expect(bf.at(-1)?.dist[1]).toBe(1);
  expect(run('bellman-ford',config('A B 1;B C -2;C B 1',true)).at(-1)).toMatchObject({rounds:2,negcycle:true});
  const dfs=run('dfs',config('A B;A D;B C;D C;D E;C F;E F',true));expect(dfs.length-1).toBe(14);
  expect(dfs.at(-1)).toMatchObject({discovered:[1,2,3,8,9,4],finished:[12,7,6,11,10,5],kinds:['树边','树边','树边','横跨边','树边','树边','横跨边']});
  const clothes=config('undershorts pants;undershorts shoes;pants belt;pants shoes;belt jacket;shirt belt;shirt tie;tie jacket;socks shoes',true,['watch']);
  const topo=run('topo',clothes),last=topo.at(-1)!;expect(topo.length-1).toBe(18);
  expect(last.order.map(i=>last.names[i])).toEqual('shirt socks tie undershorts pants belt jacket shoes watch'.split(' '));
  const cyclic=run('topo',config('A B;B C;C A;A D;D C',true));expect(cyclic.length).toBe(2);expect(cyclic[1].cycle).toBe(true);
});
it('图 26.1：三条增广路、瓶颈和最终失败 BFS 的步数',()=>{
  const p=config('s a 16;s b 13;a c 12;b a 4;b d 14;c b 9;c t 20;d c 7;d t 4',true);p.source='s';p.sink='t';
  const all=run('max-flow',p);expect(all.length-1).toBe(38);
  expect(all.filter((f,i)=>i&&f.augments>all[i-1].augments).map(f=>[f.path.map(i=>f.names[i]).join(''),f.flow])).toEqual([['sact',12],['sbdt',16],['sbdct',23]]);
});
// 穷举简单路、生成树的边子集以及 s/t 割；三个参照都只读取输入图。
it.each([4,29,101])('随机小图对独立参照，种子 %i',seed=>{
  const r=mulberry32(seed),names=['A','B','C','D','E'];
  for(let trial=0;trial<24;trial++){
    const edges:string[]=[];
    for(let i=0;i<5;i++)for(let j=i+1;j<5;j++)if(j===i+1||r()<.45)edges.push(names[i]+' '+names[j]+' '+(1+Math.floor(r()*8)));
    const p=config(edges.join(';'));const dist=names.map(()=>Infinity);
    function walk(i:number,cost:number,seen:number){dist[i]=Math.min(dist[i],cost);for(const e of p.links){
      const v=names.indexOf(e.u===names[i]?e.v:e.v===names[i]?e.u:'');if(v>=0&&!(seen&1<<v))walk(v,cost+e.w,seen|1<<v);}}
    walk(0,0,1);for(const k of ['bellman-ford','dijkstra'] as const)expect(run(k,p).at(-1)?.dist).toEqual(dist);
    let mst=Infinity,cut=Infinity;
    for(let mask=0;mask<1<<p.links.length;mask++){
      const subset=p.links.filter((_,i)=>mask&1<<i);if(subset.length!==4)continue;
      const seen=new Set(['A']);for(let pass=0;pass<4;pass++)for(const e of subset)if(seen.has(e.u)||seen.has(e.v)){seen.add(e.u);seen.add(e.v);}
      if(seen.size===5)mst=Math.min(mst,subset.reduce((a,e)=>a+e.w,0));
    }
    for(const k of ['prim','kruskal'] as const)expect(run(k,p).at(-1)?.weight).toBe(mst);
    p.directed=true;p.sink='E';
    for(const e of p.links)if(r()<.25)[e.u,e.v]=[e.v,e.u];
    for(let mask=1;mask<16;mask+=2){
      const cap=p.links.filter(e=>(mask&1<<names.indexOf(e.u))&&!(mask&1<<names.indexOf(e.v))).reduce((n,e)=>n+e.w,0);cut=Math.min(cut,cap);
    }
    expect(run('max-flow',p).at(-1)?.flow).toBe(cut);
  }
});

it('第二条增广路用反向边抵消第一条路上的单位流',()=>{
  const p=config('s a 1;s b 1;a x 1;a y 1;b x 1;x t 1;y t 1',true);p.source='s';p.sink='t';
  const all=run('max-flow',p),aug=all.filter((f,i)=>i&&f.augments>all[i-1].augments);
  expect(aug.map(f=>f.path.map(i=>f.names[i]).join(''))).toEqual(['saxt','sbxayt']);
  expect(aug[1].flows).toEqual([1,1,0,1,1,1,1]);expect(all.at(-1)?.flow).toBe(2);
});

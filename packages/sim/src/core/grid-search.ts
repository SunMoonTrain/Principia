import { algorithmMachine } from './algorithm.ts';
export const searches=['bfs','dfs','dijkstra','greedy','astar'] as const;
export const heuristics=['manhattan','euclidean','chebyshev','octile','zero'] as const;
export type Search=typeof searches[number];
export type Heuristic=typeof heuristics[number];
export interface GridRun {algorithm:Search;heuristic?:Heuristic;weight?:number}
export interface GridParams {rows:string[];moves:4|8;costs:Record<string,number>;runs:GridRun[]}
export const gridNames=['step','expanded','frontier','cost','found','done'];
export const defaultH=(moves:number):Heuristic=>moves===4?'manhattan':'octile';
export function hValue(kind:Heuristic,at:number,goal:number,w:number){
  const x=Math.abs(at%w-goal%w),y=Math.abs(Math.floor(at/w)-Math.floor(goal/w));
  switch(kind){case 'zero':return 0;case 'manhattan':return x+y;case 'euclidean':return Math.hypot(x,y);
    case 'chebyshev':return Math.max(x,y);case 'octile':return Math.max(x,y)+(Math.SQRT2-1)*Math.min(x,y);}
}
const directions=[[-1,0],[0,1],[1,0],[0,-1],[-1,1],[1,1],[1,-1],[-1,-1]];
export interface GridFrame {g:Float64Array;h:Float64Array;parent:Int16Array;closed:Uint8Array;open:Uint8Array;at:number;reads:number[];writes:number[];
  path:number[];expanded:number;frontier:number;cost:number;found:boolean;text:string}
interface Entry {at:number;g:number;from:number;order:number;priority:number}
export function* gridFrames(p:GridParams,run:GridRun):Generator<GridFrame,void>{
  const rows=p.rows.map(s=>Array.from(s)),w=rows[0].length,tiles=rows.flat(),n=tiles.length,start=tiles.indexOf('S'),goal=tiles.indexOf('G');
  const g=new Float64Array(n).fill(Infinity),parent=new Int16Array(n).fill(-1),closed=new Uint8Array(n),open=new Uint8Array(n);
  const informed=run.algorithm==='greedy'||run.algorithm==='astar',heuristic=informed?run.heuristic??defaultH(p.moves):'zero';
  const h=Float64Array.from(tiles,(_,i)=>hValue(heuristic,i,goal,w)),weight=run.weight??1;
  const stack=run.algorithm==='dfs',fifo=run.algorithm==='bfs',queue:Entry[]=[];
  let expanded=0,serial=0,path:number[]=[];
  function enqueue(at:number,distance:number,from:number){
    const priority=run.algorithm==='greedy'?h[at]:distance+weight*h[at];
    queue.push({at,g:distance,from,order:serial++,priority});open[at]++;g[at]=distance;parent[at]=from;
  }
  function snapshot(at:number,reads:number[],writes:number[],text:string):GridFrame{
    const found=at===goal;
    return {g:g.slice(),h,parent:parent.slice(),closed:closed.slice(),open:open.slice(),at,reads,writes,path,expanded,frontier:queue.length,
      cost:found?Number(g[goal].toFixed(2)):-1,found,text:run.algorithm+' · '+text};
  }
  enqueue(start,0,-1);yield snapshot(-1,[],[],'起点入队');
  while(queue.length){
    let index=stack?queue.length-1:0;
    if(!stack&&!fifo)for(let i=1;i<queue.length;i++){
      const a=queue[i],b=queue[index],dp=a.priority-b.priority,dh=h[a.at]-h[b.at];
      if(dp<=-1e-9 || Math.abs(dp)<1e-9 && (dh<=-1e-9 || Math.abs(dh)<1e-9 && a.order<b.order))index=i;
    }
    const [entry]=queue.splice(index,1),at=entry.at;open[at]--;
    if(closed[at])continue;
    g[at]=entry.g;parent[at]=entry.from;closed[at]=1;expanded++;
    const row=Math.floor(at/w),col=at%w,reads:number[]=[],writes=[at];
    if(at===goal){
      path=[];
      for(let i=goal;i!==-1;i=parent[i])path.push(i);
      path=path.reverse();yield snapshot(at,reads,writes,'取出终点，沿父格回溯，代价 '+g[at].toFixed(2));return;
    }
    const dirs=directions.slice(0,p.moves);
    if(stack)dirs.reverse();
    for(const [dr,dc] of dirs){
      const r=row+dr,c=col+dc;if(r<0||r>=rows.length||c<0||c>=w)continue;
      const next=r*w+c;reads.push(next);
      if(tiles[next]==='#'||closed[next]||(dr&&dc&&rows[row][c]==='#'&&rows[r][col]==='#'))continue;
      const distance=g[at]+(p.costs[tiles[next]]??1)*(dr&&dc?Math.SQRT2:1);
      if(!stack&&open[next]){
        if(fifo||run.algorithm==='greedy'||g[next]-distance<1e-9)continue;
        queue.splice(queue.findIndex(e=>e.at===next),1);open[next]--;
      }
      enqueue(next,distance,at);writes.push(next);
    }
    // 此后的栈顶若已扩展，不构成一次可播放的扩展。
    while(stack&&queue.length&&closed[queue.at(-1)!.at])open[queue.pop()!.at]--;
    yield snapshot(at,reads,writes,'扩展 ('+row+', '+col+')，g = '+g[at].toFixed(2)+(informed?'，h = '+h[at].toFixed(2):'')+
      (run.algorithm==='astar'?'，f = '+entry.priority.toFixed(2):'')+(queue.length?'，加入或更新 '+(writes.length-1)+' 格':'，队列已空，终点不可达'));
  }
}
export const gridMachine=algorithmMachine((p:GridParams)=>p.runs.map(run=>gridFrames(p,run)),({expanded,frontier,cost,found})=>({expanded,frontier,cost,found}));

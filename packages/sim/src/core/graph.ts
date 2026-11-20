import {algorithmMachine} from './algorithm.ts';
export const graphAlgos=['bfs','dfs','topo','dijkstra','bellman-ford','prim','kruskal','max-flow'] as const;
export type GraphAlgo=typeof graphAlgos[number];
export interface Edge {u:string;v:string;w:number}
export interface GraphParams {algorithm:GraphAlgo;nodes:Record<string,[number,number]>;links:Edge[];directed:boolean;source?:string;sink?:string;view:string[]}
export const graphNames=['step','visited','relaxed','rounds','edges','weight','flow','augments','cycle','negcycle','done'];
interface Arc {from:number;to:number;id:number;w:number}
export interface GraphFrame {
  text:string;names:string[];dist:number[];parent:number[];discovered:number[];finished:number[];degree:number[];fixed:boolean[];
  order:number[];queue:number[];edgeQueue:number[];kinds:string[];chosen:number[];flows:number[];path:number[];
  read:number[];write:number[];readEdges:number[];writeEdges:number[];
  visited:number;relaxed:number;rounds:number;edges:number;weight:number;flow:number;augments:number;cycle:boolean;negcycle:boolean;
}
export function* graphFrames(p:GraphParams):Generator<GraphFrame,void>{
  const names=Object.keys(p.nodes).sort(),n=names.length,id=(name?:string)=>names.indexOf(name??'');
  const source=id(p.source),sink=id(p.sink);
  const links=p.links.map((e,i)=>({from:id(e.u),to:id(e.v),w:e.w,id:i}));
  const arcs=links.flatMap(e=>p.directed?[e]:[e,{...e,from:e.to,to:e.from}]);
  const adj=names.map((_,i)=>arcs.filter(e=>e.from===i).sort((a,b)=>a.to-b.to));
  const dist=Array<number>(n).fill(Infinity),parent=Array<number>(n).fill(-1),fixed=Array<boolean>(n).fill(false);
  const discovered=Array<number>(n).fill(0),finished=discovered.slice(),degree=discovered.slice(),order:number[]=[],chosen:number[]=[];
  const flows=Array<number>(links.length).fill(0),kinds=links.map(()=>''),treeEdge=Array<number>(n).fill(-1);
  let queue:number[]=[],edgeQueue:number[]=[],path:number[]=[],visited=0,relaxed=0,rounds=0,weight=0,flow=0,augments=0,cycle=false,negcycle=false;
  let prior:GraphFrame|undefined;
  const snapshot=(text:string,read:number[]=[],write:number[]=[],readEdges:number[]=[],writeEdges:number[]=[]):GraphFrame=>{
    const changed=new Set(write);
    if(prior)for(let i=0;i<n;i++)if(parent[i]!==prior.parent[i]||degree[i]!==prior.degree[i]||dist[i]!==prior.dist[i]||fixed[i]!==prior.fixed[i]||discovered[i]!==prior.discovered[i]||finished[i]!==prior.finished[i])changed.add(i);
    return prior={
    text,names,dist:dist.slice(),parent:parent.slice(),discovered:discovered.slice(),finished:finished.slice(),degree:degree.slice(),fixed:fixed.slice(),
    order:order.slice(),queue:queue.slice(),edgeQueue:edgeQueue.slice(),kinds:kinds.slice(),chosen:chosen.slice(),flows:flows.slice(),path:path.slice(),
    read,write:[...changed],readEdges,writeEdges,visited,relaxed,rounds,edges:chosen.length,weight,flow,augments,cycle,negcycle,
    };
  };
  const label=(e:Arc)=>names[e.from]+'→'+names[e.to];
  const priority=()=>names.map((_,i)=>i).filter(i=>!fixed[i]&&Number.isFinite(dist[i])).sort((a,b)=>dist[a]-dist[b]||a-b);
  const edgeOrder=(a:Arc,b:Arc)=>a.w-b.w||Math.min(a.from,a.to)-Math.min(b.from,b.to)||Math.max(a.from,a.to)-Math.max(b.from,b.to);
  if(source>=0)dist[source]=0;
  if(p.algorithm==='topo'){arcs.forEach(e=>degree[e.to]++);queue=degree.flatMap((d,i)=>d===0?[i]:[]);}
  else if(p.algorithm==='kruskal')edgeQueue=links.slice().sort(edgeOrder).map(e=>e.id);
  else if(source>=0&&p.algorithm!=='bellman-ford')queue=[source];
  yield snapshot('初始图');
  if(p.algorithm==='bfs'){
    while(queue.length){
      const u=queue.shift()!;fixed[u]=true;visited++;order.push(u);yield snapshot('取出 '+names[u]+'，按名字检查邻居',[],[u]);
      for(const e of adj[u])if(!Number.isFinite(dist[e.to])){
        const v=e.to;dist[v]=dist[u]+1;parent[v]=u;queue.push(v);kinds[e.id]='树边';
        yield snapshot('发现 '+names[v]+'，距起点 '+dist[v]+' 条边，进队',[u],[v],[],[e.id]);
      }
    }
  }else if(p.algorithm==='dfs'){
    let time=0;queue=[];
    function* visit(u:number,via?:Arc):Generator<GraphFrame,void>{
      if(via){parent[u]=via.from;kinds[via.id]='树边';}
      discovered[u]=++time;queue.push(u);visited++;order.push(u);
      yield snapshot('发现 '+names[u]+'，记时 '+time,via?[via.from]:[],[u],[],via?[via.id]:[]);
      for(const e of adj[u]){
        const v=e.to;
        if(!discovered[v]){yield* visit(v,e);continue;}
        if(!p.directed&&(finished[v]||v===parent[u]))continue;
        const kind=!finished[v]?'回边':discovered[v]>discovered[u]?'前向边':'横跨边';kinds[e.id]=kind;
        if(p.directed&&!finished[v])cycle=true;
        yield snapshot(label(e)+' 是'+kind+'，'+(!finished[v]?'终点已发现且尚未完成':'终点已完成'),[u,v],[],[],[e.id]);
      }
      finished[u]=++time;fixed[u]=true;queue.pop();yield snapshot('完成 '+names[u]+'，记时 '+time,[],[u]);
    }
    for(const u of [source,...names.map((_,i)=>i)])if(!discovered[u])yield* visit(u);
  }else if(p.algorithm==='topo'){
    while(order.length<n){
      if(!queue.length){cycle=true;yield snapshot('还有未输出结点，但没有零入度结点，存在有向环');break;}
      const u=queue.shift()!;order.push(u);visited++;fixed[u]=true;
      yield snapshot('取名字最小的零入度结点 '+names[u],[],[u]);
      for(const e of adj[u]){
        degree[e.to]--;kinds[e.id]='已移除';if(degree[e.to]===0){queue.push(e.to);queue.sort((a,b)=>a-b);}
        yield snapshot('移除 '+label(e)+'，入度减为 '+degree[e.to],[u],[e.to],[],[e.id]);
      }
    }
  }else if(p.algorithm==='dijkstra'||p.algorithm==='prim'){
    const mst=p.algorithm==='prim';
    while(queue.length){
      const u=queue[0];fixed[u]=true;visited++;order.push(u);queue=priority();
      const edge=treeEdge[u];if(edge>=0){kinds[edge]='树边';if(mst){chosen.push(edge);weight+=links[edge].w;}}
      const skipped=!mst?adj[u].filter(e=>fixed[e.to]&&dist[u]+e.w<dist[e.to]):[];
      yield snapshot((mst?'选入树 ':'确定 ')+names[u]+'，当前最小值 '+dist[u]+(skipped.length?'；'+skipped.map(e=>label(e)+' 可降至 '+(dist[u]+e.w)+'，终点已确定，跳过').join('、'):''),skipped.map(e=>e.to),[u],skipped.map(e=>e.id),edge>=0?[edge]:[]);
      for(const e of adj[u])if(!fixed[e.to]){
        const v=e.to,candidate=mst?e.w:dist[u]+e.w,old=dist[v],better=candidate<old;
        if(better){dist[v]=candidate;parent[v]=u;treeEdge[v]=e.id;if(!mst)relaxed++;queue=priority();}
        yield snapshot(label(e)+'：'+(mst?'边权 ':dist[u]+' + '+e.w+' = ')+candidate+(better?' < ':' ≥ ')+(Number.isFinite(old)?old:'∞')+(better?'，更新':'，保留'),[u,v],better?[v]:[],[e.id]);
      }
    }
  }else if(p.algorithm==='bellman-ford'){
    for(let pass=1;pass<=n;pass++){
      const check=pass===n;let changed=false;if(!check)rounds=pass;
      for(const e of arcs){
        const d=dist[e.from]+e.w,old=dist[e.to],better=d<old;
        if(better&&!check){dist[e.to]=d;parent[e.to]=e.from;relaxed++;changed=true;}
        if(check&&better)negcycle=true;
        yield snapshot((check?'检查轮':'第 '+pass+' 轮')+' · '+label(e)+'，候选 '+(Number.isFinite(d)?d:'∞')+(negcycle?' 仍可降低，有可达负环':better?' 更小，更新':' 未改善'),[e.from,e.to],better&&!check?[e.to]:[],[e.id]);
        if(negcycle)return;
      }
      if(!changed)break;
    }
  }else if(p.algorithm==='kruskal'){
    const group=names.map((_,i)=>i);
    while(edgeQueue.length&&chosen.length<n-1){
      const i=edgeQueue.shift()!,e=links[i],left=group[e.from],right=group[e.to],take=left!==right;
      if(take){for(let j=0;j<n;j++)if(group[j]===right)group[j]=left;chosen.push(i);weight+=e.w;}
      kinds[i]=take?'树边':'跳过';if(chosen.length===n-1)edgeQueue=[];
      yield snapshot(label(e)+' 权 '+e.w+(take?'，连接不同分量，选入':'，两端已连通，跳过'),[e.from,e.to],[],[],[i]);
    }
  }else{
    const residual=names.map((_,i)=>links.filter(e=>e.from===i||e.to===i).map(e=>({v:e.from===i?e.to:e.from,edge:e,sign:e.from===i?1:-1})).sort((a,b)=>a.v-b.v));
    while(true){
      queue=[source];parent.fill(-1);parent[source]=source;path=[];
      const via=new Map<number,{id:number;sign:number;room:number}>();
      while(queue.length&&!via.has(sink)){
        const u=queue.shift()!;yield snapshot('剩余网络 BFS 取出 '+names[u],[],[u]);
        for(const {v,edge,sign} of residual[u]){
          const room=sign===1?edge.w-flows[edge.id]:flows[edge.id];
          if(room<=0||parent[v]!==-1)continue;
          parent[v]=u;via.set(v,{id:edge.id,sign,room});queue.push(v);
          yield snapshot('发现 '+names[v]+(sign===1?'，正向剩余容量 ':'，反向可抵消 ')+room,[u],[v],[edge.id]);
          if(v===sink)break;
        }
      }
      if(!via.has(sink))break;
      for(let v=sink;;v=parent[v]){path.unshift(v);if(v===source)break;}
      const hops=path.slice(1).map(v=>via.get(v)!),delta=Math.min(...hops.map(e=>e.room));
      hops.forEach(e=>flows[e.id]+=e.sign*delta);flow+=delta;augments++;queue=[];
      yield snapshot('沿 '+path.map(i=>names[i]).join('→')+' 增广 '+delta+'，取路径最小剩余容量',[],path.slice(),[],hops.map(e=>e.id));
    }
  }
}
export const graphMachine=algorithmMachine((p:GraphParams)=>[graphFrames(p)],f=>({visited:f.visited,relaxed:f.relaxed,rounds:f.rounds,edges:f.edges,
  weight:f.weight,flow:f.flow,augments:f.augments,cycle:f.cycle,negcycle:f.negcycle}));

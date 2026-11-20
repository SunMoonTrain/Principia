import {useId,useMemo,useState} from 'react';
import type {AnimProps} from '@principia/anim';
import {AlgorithmPlayer,useInputs,type Controls} from './AlgorithmPlayer';
import {graphMachine,graphNames,type GraphFrame,type GraphParams} from './core/graph';
import {useStepScroll} from './StructurePlayer';
import './graph.css';

type Params=GraphParams & Controls;
const number=(n:number)=>Number.isFinite(n)?String(n):'∞';
function value(p:Params,f:GraphFrame,i:number){
  switch(p.algorithm){
    case 'dfs':return (f.discovered[i]||'–')+'/'+(f.finished[i]||'–');
    case 'topo':return '入 '+f.degree[i];
    case 'prim':return 'k '+number(f.dist[i]);
    case 'kruskal':return '';
    case 'max-flow':{
      const incoming=p.links.reduce((sum,e,k)=>sum+(e.v===f.names[i]?f.flows[k]:0),0);
      return '流 '+(f.names[i]===p.source?f.flow:incoming);
    }
    default:return 'd '+number(f.dist[i]);
  }
}
const activity=(id:number,read:number[],write:number[])=>write.includes(id)?'write':read.includes(id)?'read':undefined;
function Diagram({p,f,pick,setPick}:{p:Params;f:GraphFrame;pick:number;setPick:(n:number)=>void}){
  const marker=useId().replace(/:/g,''),points=f.names.map(k=>p.nodes[k]);
  const xs=points.map(v=>v[0]),ys=points.map(v=>v[1]),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
  const pos=points.map(([x,y])=>({x:maxX===minX?320:49+540*(x-minX)/(maxX-minX),y:maxY===minY?105:34+150*(maxY-y)/(maxY-minY)}));
  const radii=f.names.map(k=>Math.max(15,Array.from(k).length*3.6+3));
  const bends=useMemo(()=>p.links.map(e=>{
    const u=f.names.indexOf(e.u),v=f.names.indexOf(e.v),a=pos[u],b=pos[v],dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1;
    const reverse=p.directed&&p.links.some(other=>other.u===e.v&&other.v===e.u);
    // 作者给定结点位置。连线若穿过第三个结点，试两侧的弧线，保留最小可用偏移。
    for(const bend of reverse?[24,48,72,96]:[0,24,-24,48,-48,72,-72,96,-96]){
      const clear=pos.every((node,i)=>{
        if(i===u||i===v)return true;
        for(let k=1;k<32;k++){
          const t=k/32,offset=2*(1-t)*t*bend;
          const x=a.x+t*dx-offset*dy/len,y=a.y+t*dy+offset*dx/len;
          if(Math.hypot(x-node.x,y-node.y)<radii[i]+5)return false;
        }
        return true;
      });
      if(clear)return bend;
    }
    return reverse?24:0;
  }),[p,f.names]);
  const chain=new Set<number>(),seen=new Set<number>();
  for(let u=pick;u>=0&&!seen.has(u);u=f.parent[u]){
    seen.add(u);const from=f.names[f.parent[u]],to=f.names[u];
    const k=p.links.findIndex(e=>e.u===from&&e.v===to||!p.directed&&e.u===to&&e.v===from);if(k>=0)chain.add(k);
  }
  return <svg className="alg-network" viewBox="0 0 640 226" role="group" aria-label="结点与边">
    <defs>{['plain','read','write','tree'].map(k=><marker key={k} id={marker+k} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto" markerUnits="userSpaceOnUse"><path className={'arrow '+k} d="M0 0 L7 3.5 L0 7 Z"/></marker>)}</defs>
    {p.links.map((e,k)=>{
      const u=f.names.indexOf(e.u),v=f.names.indexOf(e.v),a=pos[u],b=pos[v],dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1;
      const bend=bends[k];
      const cx=(a.x+b.x)/2-dy/len*bend,cy=(a.y+b.y)/2+dx/len*bend;
      const startLen=Math.hypot(cx-a.x,cy-a.y)||1,endLen=Math.hypot(cx-b.x,cy-b.y)||1;
      const sx=a.x+(cx-a.x)*radii[u]/startLen,sy=a.y+(cy-a.y)*radii[u]/startLen;
      const ex=b.x+(cx-b.x)*(radii[v]+2)/endLen,ey=b.y+(cy-b.y)*(radii[v]+2)/endLen;
      const loop=u===v,d=loop?'M '+(a.x-9)+' '+(a.y-12)+' c -32 -27 32 -27 18 0':'M '+sx+' '+sy+' Q '+cx+' '+cy+' '+ex+' '+ey;
      const act=activity(k,f.readEdges,f.writeEdges),kind=act??(chain.has(k)||f.kinds[k]==='树边'||f.path.some((id,j)=>j>0&&((f.path[j-1]===u&&id===v)||(f.path[j-1]===v&&id===u)))?'tree':'plain');
      const lx=loop?a.x:(sx+2*cx+ex)/4,ly=loop?a.y-29:(sy+2*cy+ey)/4-3;
      return <g key={k} data-edge={k} className={'alg-edge '+kind} data-status={f.kinds[k]}><title>{e.u+' → '+e.v+' '+f.kinds[k]}</title>
        <path d={d} markerEnd={p.directed?'url(#'+marker+kind+')':undefined}/><text x={lx} y={ly}>{p.algorithm==='max-flow'?f.flows[k]+'/'+e.w:e.w}</text></g>;
    })}
    {f.names.map((name,i)=><g key={name} transform={'translate('+pos[i].x+' '+pos[i].y+')'} className="alg-vertex" data-vertex={i}
      data-act={activity(i,f.read,f.write)} data-fixed={f.fixed[i]} data-picked={pick===i} >
      <circle r={radii[i]}/><text dy="4">{name}</text><text className="alg-value" y={radii[i]+12}>{value(p,f,i)}</text><foreignObject x={-radii[i]} y={-radii[i]} width={2*radii[i]} height={2*radii[i]}><button type="button" className="alg-node-hit" aria-label={'查看 '+name+' 的路径'} onClick={()=>setPick(i)}/></foreignObject></g>)}
  </svg>;
}
function Views({p,f}:{p:Params;f:GraphFrame}){
  const [pick,setPick]=useState(-1),ns=f.names;
  const note={text:f.text,reads:f.read,writes:f.write};
  const adjScroll=useStepScroll(note,undefined,true),matrixScroll=useStepScroll(note,undefined,true);
  const edgeId=(u:string,v:string)=>p.links.findIndex(e=>e.u===u&&e.v===v||!p.directed&&e.u===v&&e.v===u);
  const caption=(i:number)=>p.links[i].u+'–'+p.links[i].v;
  return <section className="algo-panel alg-graph"><h4>{p.algorithm}</h4>
    {p.view.includes('graph')&&<Diagram p={p} f={f} pick={pick} setPick={setPick}/>}
    {p.view.includes('table')&&<><div className="alg-state">{ns.map((n,i)=><span key={n} data-act={activity(i,f.read,f.write)}><b>{n}</b> {value(p,f,i)} {f.parent[i]>=0&&f.parent[i]!==i?'←'+ns[f.parent[i]]:''}</span>)}</div>
      <div className="algo-meta">{p.algorithm==='kruskal'?'剩余边 '+f.edgeQueue.map(caption).join('、'):p.algorithm==='bellman-ford'?'边序 '+p.links.map((_,i)=>caption(i)).join('、'):
        (p.algorithm==='dfs'?'栈':p.algorithm==='prim'||p.algorithm==='dijkstra'?'优先队列':'队列')+' ['+f.queue.map(i=>ns[i]).join(', ')+']'}
        {f.order.length>0&&' · 顺序 '+f.order.map(i=>ns[i]).join(' → ')}</div></>}
    {(p.view.includes('adjacency')||p.view.includes('matrix'))&&<div className="alg-reps">
      {p.view.includes('adjacency')&&<div ref={adjScroll}><b>邻接表</b>{ns.map((u,i)=><div key={u}><strong data-touch={activity(i,f.read,f.write)}>{u}</strong> {ns.flatMap(v=>{const k=edgeId(u,v);return k<0?[]:[<span key={v} data-touch={activity(k,f.readEdges,f.writeEdges)}>{v}({p.links[k].w}) </span>];})}</div>)}</div>}
      {p.view.includes('matrix')&&<div ref={matrixScroll}><b>邻接矩阵</b><table><thead><tr><th/>{ns.map((v,i)=><th key={v} data-touch={activity(i,f.read,f.write)}>{v}</th>)}</tr></thead><tbody>{ns.map((u,i)=><tr key={u}><th data-touch={activity(i,f.read,f.write)}>{u}</th>{ns.map(v=>{
        const k=edgeId(u,v);return <td key={v} data-touch={activity(k,f.readEdges,f.writeEdges)}>{k<0?'·':p.links[k].w}</td>;})}</tr>)}</tbody></table></div>}
    </div>}
    <div className="algo-count">{p.algorithm==='max-flow'?'最大流 '+f.flow+' · 增广 '+f.augments:p.algorithm==='prim'||p.algorithm==='kruskal'?'已选 '+f.chosen.map(caption).join('、')+' · 总权 '+f.weight:
      p.algorithm==='bellman-ford'?'轮数 '+f.rounds+' · 松弛 '+f.relaxed+(f.negcycle?' · 有负环':''):'访问 '+f.visited+(p.algorithm==='dijkstra'?' · 松弛 '+f.relaxed:'')+(f.cycle?' · 有环':'')}</div>
  </section>;
}
export default function Graph({params,labels}:AnimProps<Params>){
  const s=useInputs(params),p=s.params,names=Object.keys(p.nodes).sort();
  const select=(field:'source'|'sink')=><label>{field==='source'?'起点':'汇点'} <select value={p[field]} onChange={e=>s.apply({...p,[field]:e.target.value})}>
    {names.map(n=><option key={n} disabled={p.algorithm==='max-flow'&&n===p[field==='source'?'sink':'source']}>{n}</option>)}</select></label>;
  return <AlgorithmPlayer key={s.id} params={p} labels={labels} machine={graphMachine} names={graphNames} rate={2} reset={s.reset}
    editor={<div className="algo-editor">{!['topo','kruskal'].includes(p.algorithm)&&select('source')}{p.algorithm==='max-flow'&&select('sink')}</div>}>
    {([r])=><Views p={p} f={r.frame}/>}
  </AlgorithmPlayer>;
}

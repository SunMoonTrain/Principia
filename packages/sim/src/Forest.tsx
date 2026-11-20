import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { addr, type Note, type Picture, type Region } from './core/heap';
import { HeapGrid, touch } from './StructurePlayer';
import './forest.css';

export interface Branch {
  at:number; label:string; caption?:string; children:number[]; bytes:number[]; terminal?:boolean;
  slots?:{at:number;label:number}[];
}
interface Position {node:Branch; x:number; y:number; width:number; span:number; parent?:Position; index:number}
/** 同层子树各占一段互不重叠的位置。未接入或刚断开的结点也保留在图上。 */
function layout(nodes:Branch[],roots:number[]) {
  const byId=new Map(nodes.map(n=>[n.at,n])), seen=new Set<number>(), points:Position[]=[];
  let left=8;
  function place(at:number,start:number,depth:number,index:number,parent?:Position):Position|undefined {
    const node=byId.get(at);
    if(!node||seen.has(at))return;
    seen.add(at);
    const width=node.slots?Math.max(30,node.slots.length*31):node.at===0?12:30;
    const own=Math.max(width,(node.caption?.length??0)*6+6),y=10+depth*48;
    const p:Position={node,x:start+own/2,y,width,span:own,parent,index};
    points.push(p);
    let end=start;
    const kids:Position[]=[];
    node.children.forEach((child,i)=>{
      const q=place(child,end,depth+1,i,p);
      if(q){kids.push(q);end+=q.span+10;}
    });
    if(kids.length){
      const middle=(kids[0].x+kids[kids.length-1].x)/2;
      const shift=Math.max(0,start+own/2-middle);
      if(shift)for(let i=points.indexOf(p)+1;i<points.length;i++)points[i].x+=shift;
      p.x=middle+shift;
      p.span=Math.max(p.x+own/2,end-10+shift)-start;
    }
    return p;
  }
  for(const at of [...roots,...byId.keys()]){
    const root=place(at,left,0,0);if(root)left+=root.span+12;
  }
  // 拓扑顺序会在合并时反转。按地址保持 DOM 顺序，浏览器才能连续插值同一个结点。
  points.sort((a,b)=>a.node.at-b.node.at);
  return {points,width:Math.max(left,50),height:Math.max(52,...points.map(p=>p.y+44))};
}
function Diagram({nodes,roots,note,selected,select,title}:{nodes:Branch[];roots:number[];note:Note;selected?:number;select:(a:number)=>void;title:string}){
  const {points,width,height}=layout(nodes,roots),ref=useRef<HTMLDivElement>(null),prior=useRef(selected);
  useLayoutEffect(()=>{
    const box=ref.current;if(!box)return;
    const picked=selected!==prior.current && selected!==undefined;
    prior.current=selected;
    const active=picked?points.filter(p=>p.node.at===selected):points.filter(p=>touch(note,...p.node.bytes));
    if(!active.length){if(!note.text){box.scrollLeft=0;box.scrollTop=0;}return;}
    const first=active.find(p=>touch(note,...p.node.bytes)==='write')??active[0];
    let l=Math.min(...active.map(p=>p.x-p.width/2)),r=Math.max(...active.map(p=>p.x+p.width/2));
    let t=Math.min(...active.map(p=>p.y)),b=Math.max(...active.map(p=>p.y+40));
    if(r-l>box.clientWidth){l=first.x-first.width/2;r=l+first.width;}
    if(b-t>box.clientHeight){t=first.y;b=t+40;}
    box.scrollLeft=Math.max(r-box.clientWidth,Math.min(l,box.scrollLeft));
    box.scrollTop=Math.max(b-box.clientHeight,Math.min(t,box.scrollTop));
  },[note,selected]);
  return <section className="ds-panel ds-tree"><h4>{title}</h4><div className="ds-scroll" ref={ref}><div className="ds-canvas" style={{width,height}}>
    <svg width={width} height={height} aria-hidden="true">{points.map(p=>{
      const q=p.parent;if(!q)return null;
      const x=q.node.slots?q.x-q.width/2+q.width*p.index/Math.max(1,q.node.children.length-1):q.x;
      const d='M '+x+' '+(q.y+(q.node.at===0?19:27))+' L '+p.x+' '+p.y;
      return <path key={p.node.at} d={d} style={{d:'path("'+d+'")'}}/>;
    })}</svg>
    {points.map(({node:n,x,y,width:w})=><button type="button" key={n.at} data-node={n.at} className="ds-node" data-virtual={n.at===0||undefined} data-terminal={n.terminal||undefined}
      data-slots={n.slots!==undefined||undefined} data-touch={touch(note,...n.bytes)} data-selected={n.at===selected||undefined}
      aria-label={n.label+' '+(n.caption??'')+' '+addr(n.at)} aria-pressed={n.at===selected} onClick={()=>select(n.at)}
      style={{width:w,transform:'translate('+(x-w/2)+'px,'+(y+(n.at===0?8:0))+'px)'}}>
      {n.slots?.length?n.slots.map(slot=><span key={slot.at} data-touch={touch(note,slot.at)}>{slot.label}</span>):n.label}
      {n.caption&&<small>{n.caption}</small>}
    </button>)}
  </div></div></section>;
}

export function ForestViews({pic,note,region,view,nodes,roots,vars,title,array}:{pic:Picture;note:Note;region:Region;view:string[];nodes:Branch[];roots:number[];vars:string[];title:string;
  array?:(selected:number|undefined,select:(at:number)=>void)=>ReactNode}){
  const [picked,setPicked]=useState<number>();
  const selection=nodes.find(n=>n.at===picked);
  const select=(at:number)=>setPicked(nodes.find(n=>n.bytes.includes(at))?.at);
  return <div className="ds-forest">
    {view.includes('tree')&&<Diagram nodes={nodes} roots={roots} note={note} selected={selection?.at} select={setPicked} title={title}/>}
    <div className="ds-forest-lower">{view.includes('array')&&array?.(selection?.at,select)}
      {view.includes('memory')&&<HeapGrid followGroup pic={pic} note={note} vars={vars} region={region} selected={selection?.bytes} select={select}/>}
    </div>
  </div>;
}

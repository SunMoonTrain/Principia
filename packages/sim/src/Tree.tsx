import { lazy, useLayoutEffect, useRef, useState } from 'react';
import type { AnimProps } from '@principia/anim';
import { type Work, addr } from './core/heap';
import { treeMachine, treeNames, isHeap, type TreeConfig } from './core/tree';
import { HeapGrid, StructurePlayer, touch, useStepScroll, type Display } from './StructurePlayer';
import type { BConfig } from './core/b-tree';
import type { UnionConfig } from './core/union-find';
import type { TrieConfig } from './core/trie';
import './tree.css';
const BTree=lazy(()=>import('./BTree'));
const UnionFind=lazy(()=>import('./UnionFind'));
const Trie=lazy(()=>import('./Trie'));

interface Vertex {at:number;x:number;y:number;parent:number;length:number}
function positions({pic,params}:Work<TreeConfig>):Vertex[] {
  const b=pic.bytes, at=b[0], vertices:Vertex[]=[];
  if(isHeap(params.kind)){
    const levels=Math.ceil(Math.log2(pic.size+1)),width=42*2**Math.max(0,levels-1);
    for(let i=0;i<pic.size;i++){
      const d=Math.floor(Math.log2(i+1)),slots=2**d;
      vertices.push({at:at+i,parent:i?at+((i-1)>>1):0,length:1,y:24+48*d,x:width*((i+1-slots+.5)/slots)});
    }
  }else{
    const seen=new Set<number>();let x=23;
    const walk=(node:number,d:number,parent:number)=>{
      if(!node||seen.has(node))return;
      seen.add(node);walk(b[node+1],d+1,node);
      vertices.push({at:node,parent,x,y:24+48*d,length:params.kind==='bst'?3:4});
      x+=42;walk(b[node+2],d+1,node);
    };
    walk(at,0,0);
    for(const block of pic.blocks)walk(block.at,0,0);
  }
  return vertices;
}
const bytesOf=(v:Vertex)=>Array.from({length:v.length},(_,i)=>v.at+i);
function Drawing({s,vertices,selected,select}:{s:Work<TreeConfig>;vertices:Vertex[];selected?:number;select:(a:number)=>void}) {
  const ref=useRef<HTMLDivElement>(null), b=s.pic.bytes, kind=s.params.kind;
  const height=(at:number)=>at?b[at+3]:0;
  const affected=(v:Vertex)=>v.at===b[0]?[...bytesOf(v),0]:bytesOf(v);
  const active=vertices.find(v=>affected(v).some(a=>s.note.writes.includes(a)))??vertices.find(v=>bytesOf(v).some(a=>s.note.reads.includes(a)));
  const previousSelection=useRef(selected);
  useLayoutEffect(()=>{
    const focus=selected!==previousSelection.current && selected!==undefined
      ?vertices.find(v=>v.at===selected):active;
    previousSelection.current=selected;
    const box=ref.current;if(!box||!focus)return;
    if(focus.x-22<box.scrollLeft)box.scrollLeft=focus.x-22;
    else if(focus.x+22>box.scrollLeft+box.clientWidth)box.scrollLeft=focus.x+22-box.clientWidth;
    if(focus.y-22<box.scrollTop)box.scrollTop=focus.y-22;
    else if(focus.y+24>box.scrollTop+box.clientHeight)box.scrollTop=focus.y+24-box.clientHeight;
  },[active?.at,active?.x,active?.y,selected,s.step]);
  const width=Math.max(50,...vertices.map(v=>v.x+23)),h=Math.max(55,...vertices.map(v=>v.y+24));
  return <section className="ds-panel ds-tree"><h4>树 <small>{kind}</small></h4><div className="ds-scroll" ref={ref}><div className="ds-canvas" style={{width,height:h}}>
    {!vertices.length && <small>空树</small>}
    <svg width={width} height={h} aria-hidden="true">{vertices.map(v=>{
      const p=vertices.find(n=>n.at===v.parent);if(!p)return null;
      const d='M '+p.x+' '+p.y+' L '+v.x+' '+v.y;
      return <path key={v.at} d={d} style={{d:'path("'+d+'")'}}/>;
    })}</svg>
    {vertices.map(v=><button key={v.at} type="button" className="ds-node" data-node={v.at} data-color={kind==='red-black'?(b[v.at+3]?'red':'black'):undefined} data-touch={touch(s.note,...affected(v))} data-selected={selected===v.at||undefined}
      title={addr(v.at)+' · 键 '+b[v.at]} aria-label={'键 '+b[v.at]+'，地址 '+addr(v.at)} aria-pressed={selected===v.at} onClick={()=>select(v.at)}
      style={{transform:'translate('+(v.x-16)+'px,'+(v.y-16)+'px)'}}>
      {b[v.at]}{kind==='red-black'&&<small>{b[v.at+3]?'红':'黑'}</small>}{kind==='avl'&&<small>BF {height(b[v.at+1])-height(b[v.at+2])}</small>}
    </button>)}
  </div></div></section>;
}
function Views({s,view}:{s:Work<TreeConfig>;view:string[]}) {
  const [selected,setSelected]=useState<number>(),{params,pic,note}=s,heap=isHeap(params.kind);
  const vertices=positions(s), node=vertices.find(v=>v.at===selected), bytes=node?bytesOf(node):[];
  const arrayScroll=useStepScroll(note,node?.at);
  const select=(a:number)=>setSelected(vertices.find(v=>a>=v.at&&a<v.at+v.length)?.at);
  return <>{(view.includes('tree')||view.includes('array'))&&<div className="ds-tree-column">
    {view.includes('tree')&&<Drawing s={s} vertices={vertices} selected={node?.at} select={select}/>}
    {view.includes('array')&&<section className="ds-panel ds-array"><h4>堆数组</h4><div ref={arrayScroll} className="ds-scroll">
      {pic.blocks.map(block=><div key={block.at} className="ds-row">{Array.from({length:block.length},(_,i)=>{
        const a=block.at+i,live=block.at===pic.bytes[0]?i<pic.size:s.tape?.slice(0,s.next).some(t=>t.note.reads.length&&t.note.writes.includes(a));
        return <button className="ds-cell" key={a} data-touch={touch(note,a)} data-used={!!live} data-selected={bytes.includes(a)||undefined} onClick={()=>select(a)}>
          <small>{i}</small><b>{live?pic.bytes[a]:'·'}</b></button>;
      })}</div>)}
    </div></section>}
  </div>}
  {view.includes('memory')&&<HeapGrid pic={pic} note={note} vars={heap?['ptr','len','cap']:['root']} region={params.region} selected={bytes} select={select}/>}
  </>;
}
export default function Tree({params,labels}:AnimProps<(TreeConfig|TrieConfig|UnionConfig|BConfig) & Display>) {
  if(params.kind==='b-tree')return <BTree params={params} labels={labels}/>;
  if(params.kind==='union-find')return <UnionFind params={params} labels={labels}/>;
  if(params.kind==='trie')return <Trie params={params} labels={labels}/>;
  return <StructurePlayer params={params} labels={labels} machine={treeMachine} kind={params.kind} names={treeNames} rate={1}>
    {s=><Views s={s} view={params.view}/>}
  </StructurePlayer>;
}

import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { AnimProps } from '@principia/anim';
import { addr, boundary, largeGrains, smallGrains, type Block, type Note, type Op, type Picture, type Region, type Work } from './core/heap';
import type { Machine } from './core/machine';
import type { Condition } from './core/predicate';
import { parseOps } from './core/operations';
import { useMachine } from './kit/useMachine';
import { StepperBar } from './kit/StepperBar';
import './structure.css';

export interface Display {editable:boolean; granularity:'step'|'op'; view:string[]; goals?:Condition[]; pauses?:Condition[]}
const titles:Record<string,string>={ops:'完成操作',step:'微步',size:'个数',capacity:'容量',moves:'搬运',probes:'探测',resizes:'扩容',tombstones:'墓碑',freeBytes:'空闲字节',largestHole:'最大空洞',height:'树高',rotations:'旋转',compares:'比较',swaps:'交换',root:'根键'};
export function touch(note:Note, ...at:number[]) {
  return note.writes.some(a=>at.includes(a))?'write':note.reads.some(a=>at.includes(a))?'read':undefined;
}
const hex=(n:number)=>n.toString(16).toUpperCase().padStart(2,'0');
const ptr=(n:number)=>n?'0x'+hex(n):'∅';
function blockName(b:Block,bytes:Uint8Array) {
  if(b.kind==='array')return '数组 · 容量 '+b.length;
  if(b.kind==='buckets')return '桶 · '+b.length;
  if(b.kind==='slots')return '表 · '+b.length+' 槽';
  return '结点 '+bytes[b.at];
}
/** 只移动面板内部的滚动条，避开横纵滚动条占用的区域。 */
export function useStepScroll(note:Note, selected?:number) {
  const ref=useRef<HTMLDivElement>(null);
  const previousSelection=useRef(selected);
  useLayoutEffect(()=>{
    const box=ref.current;
    if(!box)return;
    const picked=selected!==previousSelection.current && selected!==undefined;
    previousSelection.current=selected;
    const cell=(picked && box.querySelector('[data-selected]')) ||
      box.querySelector('[data-heap][data-touch="write"]') || box.querySelector('[data-touch="write"]') ||
      box.querySelector('[data-touch="read"]') || box.querySelector('[data-block-change]');
    if(!cell){
      if(!note.text){box.scrollLeft=0;box.scrollTop=0;}
      return;
    }
    const r=cell.getBoundingClientRect(), bounds=box.getBoundingClientRect();
    const left=bounds.left+box.clientLeft, top=bounds.top+box.clientTop;
    if(r.left<left)box.scrollLeft+=Math.floor(r.left-left);
    else if(r.right>left+box.clientWidth)box.scrollLeft+=Math.ceil(r.right-left-box.clientWidth);
    if(r.top<top)box.scrollTop+=Math.floor(r.top-top);
    else if(r.bottom>top+box.clientHeight)box.scrollTop+=Math.ceil(r.bottom-top-box.clientHeight);
  },[note,selected]);
  return ref;
}
export function HeapGrid({pic,note,vars,region,selected,select}:{pic:Picture;note:Note;vars:string[];region:Region;selected?:number[];select?:(at:number)=>void}) {
  const {bytes,blocks}=pic;
  const scroll=useStepScroll(note,selected?.[0]);
  const isPointer=(i:number)=>i===0 && ['head','ptr','root'].includes(vars[i]);
  return <section className="ds-panel ds-memory"><h4>内存 <small>∅ 空指针　· 空槽　† 墓碑</small></h4>
    <div ref={scroll} className="ds-scroll"><table aria-label="256 字节内存"><thead><tr><th>址</th>{Array.from({length:16},(_,i)=><th key={i}>{i.toString(16).toUpperCase()}</th>)}</tr></thead>
      <tbody>{Array.from({length:16},(_,row)=><tr key={row}><th>{hex(row*16)}</th>{Array.from({length:16},(_,col)=>{
        const a=row*16+col,b=blocks.find(v=>a>=v.at && a<v.at+v.length),v=bytes[a],off=b?a-b.at:0;
        const pointer=isPointer(a)||b?.kind==='buckets'||(b?.kind==='list'&&off===1)||(b && ['avl','bst','red-black'].includes(b.kind)&&[1,2].includes(off));
        const label=vars[a]??(b?blockName(b,bytes):a>=region[0]&&a<=region[1]?'空洞':'保留');
        const val=pointer?ptr(v):b?.kind==='slots'?(v===0?'·':v===255?'†':v):v;
        const title=addr(a)+' · '+label+' · '+val;
        return <td key={a} data-at={a} data-heap={!!b||undefined} data-block-change={note.blockChange?.includes(a)||undefined} title={title} data-touch={touch(note,a)} data-used={!!b||!!vars[a]} data-start={b?.at===a || undefined} data-end={b && off===b.length-1 || undefined} data-selected={selected?.includes(a)||undefined}>
          {select && b?<button title={title} onClick={()=>select(a)}>{val}</button>:val}</td>;
      })}</tr>)}</tbody></table></div>
    <div className="ds-key">{vars.map((name,i)=><span key={i} data-touch={touch(note,i)}>{addr(i)} {name}={isPointer(i)?ptr(bytes[i]):bytes[i]}</span>)}</div>
    <div className="ds-blocks">{blocks.map(b=><span key={b.at}>{addr(b.at)}–{hex(b.at+b.length-1)} {blockName(b,bytes)}</span>)}</div>
  </section>;
}
export function StructurePlayer<P extends {region:Region; commands:Op[]}>({params,labels,machine,names,kind,rate,children}:{
  params:P & Display;labels:AnimProps<P>['labels'];machine:Machine<P,Work<P>>;names:string[];kind:string;rate:number;
  children:(s:Work<P>)=>ReactNode;
}) {
  const options=useMemo(()=>({names,goals:params.goals,pauses:params.pauses,boundary,
    stepsPerSecond:(g?:string)=>g==='一个操作'?1:rate,granularities:params.granularity==='op'?largeGrains:smallGrains}),[names,params.goals,params.pauses,params.granularity,rate]);
  const player=useMachine(machine,params,0,options), s=player.history.state, counts=machine.observe(s);
  const previous=s.previous?machine.observe({...s,pic:s.previous,ops:s.previousOps!,step:s.previousStep!}):counts;
  const [draft,setDraft]=useState(''), [error,setError]=useState('');
  const edit=()=>{try{
    const commands=parseOps(draft,kind);
    if(!commands.length)throw Error('请写一条操作');
    player.edit(commands); player.step(); setDraft(''); setError('');
  }catch(e){setError((e as Error).message);}};
  return <StepperBar player={player} labels={labels} afterControls={params.editable && <form className="ds-editor" onSubmit={e=>{e.preventDefault();if(boundary(s))edit();}}>
    <label>追加操作 <input value={draft} maxLength={2048} onChange={e=>{setDraft(e.target.value);setError('');}} /></label>
    <button disabled={!boundary(s)||!draft.trim()}>执行</button><small role="status">{s.tape?'这个操作走完再加':error}</small>
  </form>}>
    <div className="ds-views">{children(s)}</div>
    <div className="ds-counts">{Object.entries(counts).map(([name,n])=><span key={name+(previous[name]!==n?s.step:'')} data-changed={previous[name]!==n||undefined}>{titles[name]} <b>{String(n)}</b></span>)}</div>
    <small className="ds-legend"><i data-touch="read"/> 这一步读　<i data-touch="write"/> 这一步写　<span className="ds-lifetime-key">┄</span> 申请或释放</small>
  </StepperBar>;
}

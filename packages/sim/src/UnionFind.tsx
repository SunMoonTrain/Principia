import type { AnimProps } from '@principia/anim';
import { forest, unionMachine, unionNames, type UnionConfig } from './core/union-find';
import type { Work } from './core/heap';
import { ForestViews } from './Forest';
import { StructurePlayer, useStepScroll, touch, type Display } from './StructurePlayer';

function Arrays({s,selected,select}:{s:Work<UnionConfig>;selected?:number;select:(at:number)=>void}){
  const b=s.pic.bytes,ref=useStepScroll(s.note,selected,true);
  return <section className="ds-panel ds-array"><h4>元素数组</h4><div className="ds-scroll" ref={ref}>
    {(b[1]?[b[0],b[1]]:[b[0]]).map(base=><div key={base}><small>{base===b[0]?'parent':s.params.union==='rank'?'rank':'size'}</small>
      <div className="ds-row">{Array.from({length:s.pic.size},(_,i)=><button type="button" className="ds-cell" key={i}
        aria-label={i+' 号元素，值 '+b[base+i]} data-at={base+i} data-touch={touch(s.note,base+i)} data-selected={selected===b[0]+i||undefined}
        onClick={()=>select(base+i)}><small>{i}</small><b>{b[base+i]}</b></button>)}</div></div>)}
  </div></section>;
}
export default function UnionFind({params,labels}:AnimProps<UnionConfig & Display>){
  return <StructurePlayer params={params} labels={labels} machine={unionMachine} kind="union-find" names={unionNames} n={params.n} rate={1}>
    {s=>{
      const b=s.pic.bytes,{children,roots}=forest(s.pic),meta=params.union==='rank'?'rank':params.union==='size'?'size':'无辅助数组';
      const nodes=children.map((kids,i)=>({at:b[0]+i,label:String(i),children:kids.map(k=>b[0]+k),bytes:b[1]?[b[0]+i,b[1]+i]:[b[0]+i],
        caption:b[1] && b[b[0]+i]===i?meta+' '+b[b[1]+i]:undefined}));
      return <ForestViews pic={s.pic} note={s.note} region={params.region} view={params.view} nodes={nodes} roots={roots.map(i=>b[0]+i)}
        title="并查集森林" vars={['parent',meta,'n','sets']} array={(selected,select)=><Arrays s={s} selected={selected} select={select}/>}/>;
    }}
  </StructurePlayer>;
}

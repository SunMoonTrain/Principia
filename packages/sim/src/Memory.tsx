import type { AnimProps } from '@principia/anim';
import { addr, type Block, type Work } from './core/heap';
import { memoryMachine, memoryNames, variables, type MemoryConfig } from './core/memory';
import { StructurePlayer, HeapGrid, touch, useStepScroll, type Display } from './StructurePlayer';
type Params=MemoryConfig & Display;
function Structure({s}:{s:Work<MemoryConfig>}) {
  const {pic,note,params}=s, b=pic.bytes, kind=params.structure;
  const scroll=useStepScroll(note);
  const linked=new Set<number>();
  const chain=(head:number)=>{
    const out:number[]=[];
    for(let a=head;a && !out.includes(a);a=b[a+1])out.push(a);
    out.forEach(a=>linked.add(a));
    return <span className="ds-chain">{out.map(a=><span key={a} data-touch={touch(note,a,a+1)}>{b[a]} <small>{addr(a)}</small> → </span>)}∅</span>;
  };
  const row=(block:Block)=>{
    const {at,length}=block,queue=kind==='queue',active=at===b[0],head=queue&&active?b[1]:0;
    const ring=queue, radius=Math.max(60,Math.ceil(length*39/(2*Math.PI)));
    return <div key={at}><small>{addr(at)} · {active?'当前块':'新块'} · {length} 格</small>
      {note.probeBase===at && note.probeKey!==undefined && <div className="ds-formula">h({note.probeKey}) = {note.probeKey} mod {length} = {note.probeKey%length}{params.probe==='double'?'，步长 '+(1+note.probeKey%(length-1)):''}</div>}
      <div className={ring?'ds-ring':'ds-row'} data-slots={block.kind==='slots'||undefined} style={ring?{width:2*radius+50,height:2*radius+52}:undefined}>
      {Array.from({length},(_,i)=>{
        const angle=Math.PI*2*i/length-Math.PI/2, path=note.probeBase===at?note.path:[],value=b[at+i];
        const moving=s.tape && s.tape.slice(0,s.next).some(t=>t.note.reads.length && t.note.writes.includes(at+i));
        const insertion=active && s.tape && s.commands[s.ops]?.name==='insert' && i===pic.size && moving;
        const used=block.kind==='slots'?value!==0:(active?((i-head+length)%length<pic.size || insertion):moving);
        return <span key={i} className="ds-cell" data-block-change={note.blockChange?.includes(at+i)||undefined} data-used={used} data-touch={touch(note,at+i)} style={ring?{left:25+radius*(1+Math.cos(angle)),top:25+radius*(1+Math.sin(angle))}:undefined}>
          <small>{i}{queue&&active?(i===head?' H':'')+(i===(head+pic.size)%length?' T':''):''}</small>
          <b>{block.kind==='slots'?(value===255?'†':value||'·'):used?value:'·'}</b>
          {path?.includes(i)&&<em>{path.flatMap((k,j)=>k===i?[j+1]:[]).join(',')}</em>}
        </span>;
      })}</div></div>;
  };
  return <section className="ds-panel ds-structure"><h4>结构 <small>{kind}{kind==='queue'?' · H 队首 / T 下次入队':''}</small></h4><div ref={scroll} className="ds-scroll ds-diagram">
    {kind==='linked-list' && <div><b data-touch={touch(note,0)}>head</b> → {chain(b[0])}</div>}
    {pic.blocks.filter(v=>v.kind!=='list').map(block=>block.kind==='buckets'?<div key={block.at}><small>{addr(block.at)} · 桶</small>{Array.from({length:block.length},(_,i)=><div className="ds-bucket" key={i}><b data-touch={touch(note,block.at+i)}>{i}</b> → {chain(b[block.at+i])}</div>)}</div>:row(block))}
    {pic.blocks.filter(v=>v.kind==='list' && !linked.has(v.at)).map(v=><small key={v.at} data-block-change={note.blockChange?.includes(v.at)||undefined} data-touch={touch(note,v.at,v.at+1)}>游离结点 {addr(v.at)} · {b[v.at]} → {b[v.at+1]?addr(b[v.at+1]):'∅'}</small>)}
  </div></section>;
}
export default function Memory({params,labels}:AnimProps<Params>) {
  return <StructurePlayer params={params} labels={labels} machine={memoryMachine} kind={params.structure} names={memoryNames} rate={2}>
    {s=><>{params.view.includes('structure') && <Structure s={s}/>}
      {params.view.includes('memory') && <HeapGrid {...s} vars={variables(params.structure)} region={params.region}/>}</>}
  </StructurePlayer>;
}

import type { AnimProps } from '@principia/anim';
import { bMachine, bNames, bNode, type BConfig } from './core/b-tree';
import { ForestViews } from './Forest';
import { StructurePlayer, type Display } from './StructurePlayer';
export default function BTree({params,labels}:AnimProps<BConfig & Display>){
  return <StructurePlayer params={params} labels={labels} machine={bMachine} kind="b-tree" names={bNames} rate={1}>
    {s=>{
      const b=s.pic.bytes;
      const nodes=s.pic.blocks.map(({at,length})=>{
        const n=bNode(b,at,params.degree);
        return {at,label:n.keys.join(' ')||'∅',children:n.kids,bytes:Array.from({length},(_,i)=>at+i),
          slots:n.keys.map((label,i)=>({at:at+2+i,label}))};
      });
      return <ForestViews pic={s.pic} note={s.note} region={params.region} view={params.view}
        nodes={nodes} roots={[b[0]]} vars={['root']} title={'B 树 · 最小度数 '+params.degree}/>;
    }}
  </StructurePlayer>;
}

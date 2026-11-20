import type { AnimProps } from '@principia/anim';
import { siblings, trieMachine, trieNames, type TrieConfig } from './core/trie';
import type { Picture } from './core/heap';
import { ForestViews, type Branch } from './Forest';
import { StructurePlayer, type Display } from './StructurePlayer';

function branches(pic:Picture) {
  const b=pic.bytes, nodes:Branch[]=[{at:0,label:'·',children:siblings(b,b[0]),bytes:[0]}],seen=new Set<number>();
  function visit(at:number,prefix:string){
    if(seen.has(at))return;
    seen.add(at);
    const label=String.fromCharCode(b[at]),word=prefix+label,children=siblings(b,b[at+2]);
    nodes.push({at,label,children,bytes:[at,at+1,at+2,at+3],terminal:!!b[at+1],caption:b[at+1]?word:undefined});
    for(const child of children)visit(child,word);
  }
  for(const child of nodes[0].children)visit(child,'');
  for(const block of pic.blocks)visit(block.at,'');
  return nodes;
}
export default function Trie({params,labels}:AnimProps<TrieConfig & Display>) {
  return <StructurePlayer params={params} labels={labels} machine={trieMachine} names={trieNames} kind="trie" rate={1}>
    {s=><ForestViews pic={s.pic} note={s.note} region={params.region} view={params.view} nodes={branches(s.pic)} roots={[0]} vars={['root']} title="字典树"/>}
  </StructurePlayer>;
}

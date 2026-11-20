import { Trace, blank, operationMachine, OperationFailure, type Op, type Picture, type Region } from './heap.ts';
import { initialArray, growArray } from './memory.ts';
import { SearchTree, type SearchKind } from './search-tree.ts';
export const treeKinds=['bst','avl','max-heap','min-heap'] as const;
export type TreeKind=typeof treeKinds[number];
export interface TreeConfig {kind:TreeKind;keys:number[];capacity:number;region:Region;commands:Op[]}
export const treeNames=['step','ops','size','height','rotations','compares','swaps','root','mem'];
export const isHeap=(kind:string)=>kind==='max-heap'||kind==='min-heap';
export function orderedHeap(keys:number[],kind:string) {
  return keys.every((v,i)=>!i||(kind==='max-heap'?keys[(i-1)>>1]>=v:keys[(i-1)>>1]<=v));
}
function heapOp(t:Trace,p:TreeConfig,{name,args:[key]}:Op) {
  let at=t.b[0],size=t.pic.size;
  if(name!=='build' && !orderedHeap(Array.from(t.b.subarray(at,at+size)),p.kind))
    throw new OperationFailure('当前数组尚未成堆，先执行 build');
  const better=(i:number,j:number)=>{
    t.emit('比较下标 '+i+' 与 '+j+'：'+t.b[at+i]+'、'+t.b[at+j],[at+i,at+j],[],{compares:t.pic.compares+1});
    return p.kind==='max-heap'?t.b[at+i]>t.b[at+j]:t.b[at+i]<t.b[at+j];
  };
  const swap=(i:number,j:number)=>t.emit('交换下标 '+i+' 和 '+j,[at+i,at+j],[[at+i,t.b[at+j]],[at+j,t.b[at+i]]],{swaps:t.pic.swaps+1});
  const sink=(i:number)=>{
    while(2*i+1<size){
      let child=2*i+1;
      if(child+1<size && better(child+1,child))child++;
      if(!better(child,i))break;
      swap(child,i);i=child;
    }
  };
  if(name==='build'){
    for(let i=(size>>1)-1;i>=0;i--)sink(i);
    if(size<2)t.emit('不足两个元素，已经是堆');
  }else if(name==='extract'){
    if(!size)throw new OperationFailure('堆为空，无法取根');
    size--;
    t.emit('取出根 '+t.b[at]+'，末尾补到根',[at,at+size],[[at,t.b[at+size]],[1,size]],{size});
    sink(0);
  }else {
    if(size===t.b[2])growArray(t,2);
    at=t.b[0];
    t.emit('放入末尾 '+key,[],[[at+size,key],[1,size+1]],{size:size+1});
    let i=size;
    while(i>0){
      const parent=(i-1)>>1;
      if(!better(i,parent))break;
      swap(i,parent);i=parent;
    }
  }
}
export function treeHeight(pic:Picture,node:number):number {
  return node?1+Math.max(treeHeight(pic,pic.bytes[node+1]),treeHeight(pic,pic.bytes[node+2])):0;
}
export const treeMachine=operationMachine<TreeConfig>(p=>{
  let pic=blank();
  if(isHeap(p.kind)){
    const t=new Trace(pic,p.region);
    initialArray(t,Math.max(p.capacity,p.keys.length),p.keys);
    pic=t.pic;
  }else for(const key of new Set(p.keys)){
    const t=new Trace(pic,p.region);
    new SearchTree(t,p.kind as SearchKind).operate({name:'insert',args:[key]});pic=t.pic;
  }
  return {...pic,rotations:0,compares:0,swaps:0};
},(t,p,op)=>{
  if(isHeap(p.kind))heapOp(t,p,op);
  else new SearchTree(t,p.kind as SearchKind).operate(op);
},({params,pic,step,ops})=>{
  const at=pic.bytes[0], heap=isHeap(params.kind);
  return {step,ops,size:pic.size,height:heap?Math.ceil(Math.log2(pic.size+1)):treeHeight(pic,at),
    rotations:pic.rotations,compares:pic.compares,swaps:pic.swaps,root:(heap?pic.size:at)?pic.bytes[at]:-1};
});

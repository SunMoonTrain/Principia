import { addr, blank, Trace, operationMachine, type Op, type Picture, type Region, type Write } from './heap.ts';

export interface BConfig {kind:'b-tree';degree:2|3;keys:number[];region:Region;commands:Op[]}
export const bNames=['step','ops','size','nodes','height','compares','reads','splits','merges','borrows','mem'];
interface Node {at:number;keys:number[];kids:number[]}
export function bNode(b:Uint8Array,at:number,t:number):Node {
  const n=b[at],first=at+2*t+1;
  return {at,keys:Array.from(b.subarray(at+2,at+2+n)),kids:b[at+1]?[]:Array.from(b.subarray(first,first+n+1))};
}
const show=(n:Node)=>'['+n.keys.join(' ')+']';
/** 只写仍在用的键/孩子槽。减小 n 后，尾部旧字节留在内存里。 */
function updates(b:Uint8Array,t:number,n:Node):Write[]{
  const writes:Write[]=[[n.at,n.keys.length]];
  n.keys.forEach((v,i)=>writes.push([n.at+2+i,v]));
  n.kids.forEach((v,i)=>writes.push([n.at+2*t+1+i,v]));
  return writes.filter(([a,v])=>b[a]!==v);
}
function allocate(t:Trace,degree:number,keys:number[],kids:number[],also?:(at:number)=>Write[]) {
  const bytes=Array<number>(4*degree+1).fill(0);
  bytes[0]=keys.length;bytes[1]=Number(!kids.length);
  keys.forEach((k,i)=>bytes[2+i]=k);kids.forEach((k,i)=>bytes[2*degree+1+i]=k);
  return t.allocate(bytes.length,'b-tree',bytes,also);
}
interface Cursor {node:Node;index:number;equal:boolean}
class BTree {
  constructor(readonly trace:Trace,readonly degree:number){}
  read(at:number,key?:number):Cursor {
    const t=this.trace,node=bNode(t.b,at,this.degree),reads=[at];let index=0,equal=false,comparisons=0;
    if(key!==undefined){
      for(const k of node.keys){
        reads.push(at+2+index);comparisons++;
        if(k>=key){equal=k===key;break;}
        index++;
      }
    }
    t.emit('读结点 '+show(node)+' @ '+addr(at)+(key===undefined?'，查看可用键和孩子':'，比较 '+comparisons+' 次'+(equal?'，命中 '+key:'，位置 '+index)),reads,[],
      {reads:(t.pic.reads??0)+1,compares:t.pic.compares+comparisons});
    return {node,index,equal};
  }
  change(text:string,nodes:Node[],fields:Partial<Picture>={},reason=false) {
    const t=this.trace;
    t.emit(text,[],nodes.flatMap(n=>updates(t.b,this.degree,n)),fields,reason?{reason:text}:{});
  }
  split(parent:Node,i:number,c:Cursor){
    const t=this.trace,d=this.degree,old=c.node,median=old.keys[d-1];
    const right=allocate(t,d,old.keys.slice(d),old.kids.slice(d),()=>[[old.at,d-1]]);
    t.finish('满结点 '+show(old)+' 的后一半移到 '+addr(right)+'，左半留下');
    parent.keys.splice(i,0,median);parent.kids.splice(i+1,0,right);
    this.change('把中间键 '+median+' 升到父结点，接上右半', [parent],{splits:(t.pic.splits??0)+1});
    if(c.index>=d){c.node=bNode(t.b,right,d);c.index-=d;}
    else c.node=bNode(t.b,old.at,d);
  }
  insert(key:number){
    const t=this.trace,d=this.degree;let c=this.read(t.b[0],key);
    const full=(n:Node)=>n.keys.length===2*d-1;
    if(!c.equal && full(c.node)){
      const root=allocate(t,d,[],[c.node.at],at=>[[0,at]]);
      t.finish('旧根已满，root 指向只有一个孩子的新根');
      this.split(bNode(t.b,root,d),0,c);
    }
    while(!c.equal && c.node.kids.length){
      const {node,index}=c;c=this.read(node.kids[index],key);
      if(!c.equal && full(c.node))this.split(node,index,c);
    }
    if(c.equal){t.finish('键 '+key+' 已存在');return;}
    c.node.keys.splice(c.index,0,key);
    this.change('在叶子的位置 '+c.index+' 插入 '+key,[c.node],{size:t.pic.size+1});
  }
  merge(parent:Node,i:number,left:Node,right:Node,kind:'2c'|'3b'){
    const t=this.trace,k=parent.keys[i],reason='情形 '+kind+'：两边都只有 '+(this.degree-1)+' 个键，把 '+show(left)+'、'+k+' 和 '+show(right)+' 合并';
    left.keys.push(k,...right.keys);left.kids.push(...right.kids);
    parent.keys.splice(i,1);parent.kids.splice(i+1,1);
    this.change(reason,[left,parent],{merges:(t.pic.merges??0)+1},true);
    t.release(right.at);
    if(parent.at===t.b[0] && !parent.keys.length){
      const reason='根空了，树降一层，新根在 '+addr(left.at);
      t.release(parent.at,[[0,left.at]]);t.finish(reason,{},[],reason);
    }
  }
  /** 下降前给最小孩子补键。cursor 已经定位过，移动时只修正槽号。 */
  fill(parent:Node,i:number,c:Cursor){
    const d=this.degree,t=this.trace,child=c.node;
    if(child.keys.length>=d)return;
    const left=i?this.read(parent.kids[i-1]).node:undefined;
    const right=(!left||left.keys.length<d) && i+1<parent.kids.length?this.read(parent.kids[i+1]).node:undefined;
    const fromLeft=!!left && left.keys.length>=d, peer=fromLeft?left:right;
    if(peer && peer.keys.length>=d){
      const j=fromLeft?i-1:i,old=parent.keys[j];
      const reason='情形 3a：孩子 '+show(child)+' 只有 '+child.keys.length+' 个键，向'+(fromLeft?'左':'右')+'兄弟 '+show(peer)+' 借，分隔键 '+old+' 下移';
      if(fromLeft){
        child.keys.unshift(old);parent.keys[j]=peer.keys.pop()!;
        if(peer.kids.length)child.kids.unshift(peer.kids.pop()!);
        c.index++;
      }else{
        child.keys.push(old);parent.keys[j]=peer.keys.shift()!;
        if(peer.kids.length)child.kids.push(peer.kids.shift()!);
      }
      this.change(reason,[parent,child,peer],{borrows:(t.pic.borrows??0)+1},true);
    }else if(left){
      c.index+=left.keys.length+1;this.merge(parent,i-1,left,child,'3b');c.node=left;
    }else this.merge(parent,i,child,right!,'3b');
  }
  removeLeaf(n:Node,index:number,text:string,reason=false){
    const [removed]=n.keys.splice(index,1);
    this.change(text,[n],{size:this.trace.pic.size-1},reason);return removed;
  }
  extreme(n:Node,predecessor:boolean){
    while(n.kids.length){
      const i=predecessor?n.kids.length-1:0,c=this.read(n.kids[i]);
      this.fill(n,i,c);n=c.node;
    }
    const i=predecessor?n.keys.length-1:0;
    return this.removeLeaf(n,i,'从叶子取出'+(predecessor?'前驱 ':'后继 ')+n.keys[i]);
  }
  search(key:number,deleting:boolean){
    const t=this.trace;let c=this.read(t.b[0],key);
    while(true){
      const {node:n,index:i,equal}=c;
      if(equal && !deleting){t.finish('找到键 '+key);return;}
      if(!n.kids.length){
        if(equal)this.removeLeaf(n,i,'情形 1：从叶子 '+show(n)+' 删除 '+key,true);
        else t.finish('已到叶子，找不到 '+key);
        return;
      }
      if(equal){
        const left=this.read(n.kids[i]).node;
        const right=left.keys.length<this.degree?this.read(n.kids[i+1]).node:undefined;
        const pred=left.keys.length>=this.degree;
        if(pred || right!.keys.length>=this.degree){
          const side=pred?left:right!,which=pred?'前驱':'后继',kind=pred?'2a':'2b';
          const reason='情形 '+kind+'：'+(pred?'左':'右')+'孩子 '+show(side)+' 至少有 '+this.degree+' 个键，用'+which+'替换 '+key;
          t.finish(reason,{},[],reason);
          n.keys[i]=this.extreme(side,pred);
          this.change('用'+which+' '+n.keys[i]+' 替换 '+key,[n]);return;
        }
        const position=left.keys.length;
        this.merge(n,i,left,right!,'2c');c={node:left,index:position,equal:true};
      }else{
        c=this.read(n.kids[i],key);
        if(deleting)this.fill(n,i,c);
      }
    }
  }
}
export function initialBTree(p:Pick<BConfig,'degree'|'region'|'keys'>){
  const first=new Trace(blank(),p.region);allocate(first,p.degree,[],[],at=>[[0,at]]);
  let pic=first.pic;
  for(const key of new Set(p.keys)){
    const tr=new Trace(pic,p.region);new BTree(tr,p.degree).insert(key);pic=tr.pic;
  }
  return {...pic,reads:0,compares:0,splits:0};
}
export const bMachine=operationMachine<BConfig>(initialBTree,(t,p,{name,args:[k]})=>{
  const tree=new BTree(t,p.degree);
  if(name==='insert')tree.insert(k);else tree.search(k,name==='delete');
},({pic,params,step,ops})=>{
  let height=0,at=pic.bytes[0];
  while(at){const n=bNode(pic.bytes,at,params.degree);if(n.keys.length)height++;at=n.kids[0];}
  return {step,ops,size:pic.size,nodes:pic.blocks.length,height,compares:pic.compares,reads:pic.reads??0,
    splits:pic.splits??0,merges:pic.merges??0,borrows:pic.borrows??0};
});

import { addr, type Trace, type Write, type Op } from './heap.ts';

export type SearchKind = 'bst'|'avl';
export class SearchTree {
  constructor(readonly t:Trace, readonly kind:SearchKind) {}
  get b(){return this.t.b;}
  get root(){return this.b[0];}
  child(node:number,side:number){return node?this.b[node+side]:0;}
  height(node:number){return node?this.b[node+3]:0;}
  balance(node:number){return this.height(this.child(node,1))-this.height(this.child(node,2));}
  /** 父指针不占内存。根持有指针的地址是 0，其余由搜索路径找到。 */
  link(node:number) {
    let at=0;
    while(this.b[at]!==node) {
      const p=this.b[at];
      if(!p)throw Error('树中没有结点 '+addr(node));
      at=p+(this.b[node]<this.b[p]?1:2);
    }
    return at;
  }
  parent(node:number){const at=this.link(node);return at?at-(this.t.pic.blocks.some(b=>b.at===at-1)?1:2):0;}
  /** 将一次旋转的三个指针和附带的元数据作为一个微步提交。 */
  rotate(node:number, raisedSide:1|2, reason:string, extra:Write[]=[]) {
    const other=3-raisedSide, up=this.b[node+raisedSide], middle=this.b[up+other];
    const writes:Write[]=[[this.link(node),up],[node+raisedSide,middle],[up+other,node],...extra];
    if(this.kind==='avl'){
      const lowHeight=1+Math.max(this.height(this.b[node+other]),this.height(middle));
      writes.push([node+3,lowHeight],[up+3,1+Math.max(lowHeight,this.height(this.b[up+raisedSide]))]);
    }
    this.t.emit(reason,[node,up],writes,{rotations:this.t.pic.rotations+1},{reason});
    return up;
  }
  adjust(node:number) {
    while(node) {
      const h=1+Math.max(this.height(this.b[node+1]),this.height(this.b[node+2])), balance=this.balance(node);
      this.t.emit('更新 '+this.b[node]+' 的高度 '+h+'，平衡因子 '+balance,[node+1,node+2],[[node+3,h]]);
      if(Math.abs(balance)>1){
        const side=balance>0?1:2,child=this.b[node+side],bf=this.balance(child);
        const cross=balance>0?bf<0:bf>0;
        const why=(side===1?(cross?'左右':'左左'):(cross?'右左':'右右'))+'，平衡因子 '+balance+' / '+bf;
        if(cross)this.rotate(child,side===1?2:1,why+'，先旋孩子 '+this.b[child]);
        node=this.rotate(node,side,why+'，'+(side===1?'右旋 ':'左旋 ')+this.b[node]);
      }
      node=this.parent(node);
    }
  }
  remove(z:number) {
    const slot=this.link(z), left=this.b[z+1],right=this.b[z+2];
    let lowest=this.parent(z), successor=z, x:number, xp:number;
    const transplant=(link:number,old:number,replacement:number)=>{
      this.t.emit('顶替 '+this.b[old]+'：M['+addr(link)+'] ← '+addr(replacement),[old],[[link,replacement]]);
    };
    if(!left||!right){
      x=left||right;xp=lowest;transplant(slot,z,x);
    }else{
      successor=right;
      while(this.b[successor+1]){
        this.t.emit('向左找后继，经过 '+this.b[successor],[successor,successor+1]);
        successor=this.b[successor+1];
      }
      x=this.b[successor+2];
      if(successor!==right){
        lowest=this.parent(successor);xp=lowest;
        transplant(lowest+1,successor,x);
        this.t.emit('后继接右子树 '+this.b[right],[],[[successor+2,right]]);
      }else {lowest=successor;xp=successor;}
      transplant(slot,z,successor);
      this.t.emit('后继接左子树 '+this.b[left],[],[[successor+1,left]]);
    }
    this.t.release(z,[],{size:this.t.pic.size-1});
    return {lowest,successor,x,xp};
  }
  operate({name,args:[key]}:Op) {
    let slot=0,node=this.root,parent=0;
    while(node) {
      const equal=this.b[node]===key;
      this.t.emit('比较 '+key+' 与 '+this.b[node]+(equal?(name==='insert'?'，键已存在':'，找到'):''),
        [node],[],{compares:this.t.pic.compares+1});
      if(equal)break;
      parent=node;slot=node+(key<this.b[node]?1:2);node=this.b[slot];
    }
    if(name==='insert' && !node) {
      const data=this.kind==='bst'?[key,0,0]:[key,0,0,1];
      node=this.t.allocate(data.length,this.kind,data);
      this.t.emit('接入结点 '+key+'：M['+addr(slot)+'] ← '+addr(node),[],[[slot,node]],{size:this.t.pic.size+1});
      if(this.kind==='avl')this.adjust(parent);
    }else if(name==='delete' && node) {
      const result=this.remove(node);
      if(this.kind==='avl')this.adjust(result.lowest);
    }else if(!node) {
      if(this.t.ticks.length)this.t.ticks[this.t.ticks.length-1].note.text+='，该方向为空，未找到';
      else this.t.emit('根为空，未找到 '+key,[0]);
    }
  }
}

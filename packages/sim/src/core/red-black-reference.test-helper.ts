/** 独立的引用模型。对象保存父子引用，与模拟器的字节地址、分配器和微步无关。 */
class Node {
  left:Node=this;right:Node=this;parent:Node=this;
  constructor(readonly key:number,public red:boolean) {}
}
export class ReferenceRB {
  private nil=new Node(-1,false);
  private root=this.nil;
  private turn(top:Node,left:boolean) {
    const up=left?top.right:top.left,mid=left?up.left:up.right;
    if(left)top.right=mid;else top.left=mid;
    if(mid!==this.nil)mid.parent=top;
    up.parent=top.parent;
    if(top.parent===this.nil)this.root=up;
    else if(top===top.parent.left)top.parent.left=up;
    else top.parent.right=up;
    if(left)up.left=top;else up.right=top;
    top.parent=up;
  }
  insert(key:number) {
    let p=this.nil,n=this.root;
    while(n!==this.nil){
      if(n.key===key)return;p=n;n=key<n.key?n.left:n.right;
    }
    n=new Node(key,true);n.left=n.right=this.nil;n.parent=p;
    if(p===this.nil)this.root=n;else if(key<p.key)p.left=n;else p.right=n;
    while(n.parent.red){
      p=n.parent;const g=p.parent,left=p===g.left,u=left?g.right:g.left;
      if(u.red){p.red=u.red=false;g.red=true;n=g;continue;}
      if(n===(left?p.right:p.left)){n=p;this.turn(n,left);}
      n.parent.red=false;n.parent.parent.red=true;this.turn(n.parent.parent,!left);
    }
    this.root.red=false;
  }
  private replace(a:Node,b:Node) {
    if(a.parent===this.nil)this.root=b;
    else if(a===a.parent.left)a.parent.left=b;else a.parent.right=b;
    b.parent=a.parent;
  }
  delete(key:number) {
    let z=this.root;
    while(z!==this.nil && z.key!==key)z=key<z.key?z.left:z.right;
    if(z===this.nil)return;
    let y=z,red=y.red,x:Node;
    if(z.left===this.nil){x=z.right;this.replace(z,x);}
    else if(z.right===this.nil){x=z.left;this.replace(z,x);}
    else{
      y=z.right;while(y.left!==this.nil)y=y.left;
      red=y.red;x=y.right;
      if(y.parent===z)x.parent=y;
      else {this.replace(y,x);y.right=z.right;y.right.parent=y;}
      this.replace(z,y);y.left=z.left;y.left.parent=y;y.red=z.red;
    }
    if(red)return;
    while(x!==this.root && !x.red){
      const p=x.parent,left=x===p.left;
      let w=left?p.right:p.left;
      if(w.red){w.red=false;p.red=true;this.turn(p,left);w=left?p.right:p.left;}
      if(!w.left.red && !w.right.red){w.red=true;x=p;continue;}
      if(!(left?w.right:w.left).red){
        (left?w.left:w.right).red=false;w.red=true;this.turn(w,!left);w=left?p.right:p.left;
      }
      w.red=p.red;p.red=false;(left?w.right:w.left).red=false;this.turn(p,left);x=this.root;
    }
    x.red=false;
  }
  shape():string {
    const visit=(n:Node):string=>n===this.nil?'.':n.key+(n.red?'R':'B')+'('+visit(n.left)+','+visit(n.right)+')';
    return visit(this.root);
  }
}

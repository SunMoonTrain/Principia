import type { Write } from './heap.ts';
import type { SearchTree } from './search-tree.ts';

const color=(tree:SearchTree,node:number)=>node?tree.b[node+3]:0;
const paint=(node:number,c:number):Write=>[node+3,c];
const sideName=(mirrored:boolean)=>mirrored?'（镜像）':'';
function recolor(tree:SearchTree,text:string,...changes:Write[]) {
  tree.t.emit(text,[],changes,{},{reason:text});
}

/** CLRS 第三版 13.3。左右对称分支只交换近侧和远侧，编号沿用原书。 */
export function fixInsert(tree:SearchTree,z:number) {
  const {b}=tree;
  let p=tree.parent(z);
  while(color(tree,p)===1){
    const g=tree.parent(p), mirror=tree.b[g+2]===p, near=mirror?2:1, far=mirror?1:2;
    const u=tree.b[g+far], tag=sideName(mirror);
    if(color(tree,u)){
      recolor(tree,'插入情形 1'+tag+'：叔 '+b[u]+' 红，父 '+b[p]+' 与叔涂黑，祖父 '+b[g]+' 涂红并向上检查',paint(p,0),paint(u,0),paint(g,1));
      z=g;
    }else{
      if(z===tree.b[p+far]){
        tree.rotate(p,far,'插入情形 2'+tag+'：叔黑，内侧孩子 '+b[z]+' 与父亲形成折线，先旋父 '+b[p]);
        z=p;p=tree.parent(z);
      }
      tree.rotate(g,near,'插入情形 3'+tag+'：叔黑，外侧孩子与父同向；父 '+b[p]+' 涂黑，祖父 '+b[g]+' 涂红并旋转', [paint(p,0),paint(g,1)]);
      break;
    }
    p=tree.parent(z);
  }
  if(color(tree,tree.root))recolor(tree,'根 '+tree.b[tree.root]+' 从红改黑',paint(tree.root,0));
}

/** CLRS 第三版 13.4。NIL 在内存中统一为 0，另带 xp 记住被顶替位置的父结点。 */
export function fixDelete(tree:SearchTree,x:number,xp:number) {
  while(x!==tree.root && !color(tree,x)){
    const mirror=x!==tree.b[xp+1], near=mirror?2:1,far=mirror?1:2,tag=sideName(mirror);
    let w=tree.b[xp+far];
    if(color(tree,w)){
      tree.rotate(xp,far,'删除情形 1'+tag+'：兄弟 '+tree.b[w]+' 为红，兄弟涂黑、父亲涂红并旋父，重新找兄弟',[paint(w,0),paint(xp,1)]);
      w=tree.b[xp+far];
    }
    const close=tree.b[w+near],distant=tree.b[w+far];
    if(!color(tree,close) && !color(tree,distant)){
      recolor(tree,'删除情形 2'+tag+'：黑兄弟 '+tree.b[w]+' 的两个孩子都黑，兄弟涂红，把缺少的黑色上移到父亲',paint(w,1));
      x=xp;xp=tree.parent(x);
    }else{
      if(!color(tree,distant)){
        tree.rotate(w,near,'删除情形 3'+tag+'：近侄红、远侄黑；近侄涂黑，兄弟 '+tree.b[w]+' 涂红并旋转',[paint(close,0),paint(w,1)]);
        w=tree.b[xp+far];
      }
      const outer=tree.b[w+far];
      tree.rotate(xp,far,'删除情形 4'+tag+'：远侄 '+tree.b[outer]+' 红，兄弟继承父色，父与远侄涂黑并旋父，补足黑高',
        [paint(w,color(tree,xp)),paint(xp,0),paint(outer,0)]);
      x=tree.root;
    }
  }
  if(color(tree,x))recolor(tree,'结点 '+tree.b[x]+' 从红改黑，补足黑高',paint(x,0));
}

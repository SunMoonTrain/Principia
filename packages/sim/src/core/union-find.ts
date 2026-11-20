import { Trace, blank, operationMachine, type Op, type Region, type Picture } from './heap.ts';

export interface UnionConfig {kind:'union-find'; n:number; union:'rank'|'size'|'simple'; compress:boolean; parent?:number[]; region:Region;commands:Op[]}
export const unionNames=['step','ops','size','sets','height','reads','compressions','mem'];
export function forest(pic:Picture) {
  const b=pic.bytes,children=Array.from({length:pic.size},()=>[] as number[]),roots:number[]=[];
  for(let i=0;i<pic.size;i++){
    const parent=b[b[0]+i];
    if(parent===i)roots.push(i);else children[parent].push(i);
  }
  return {children,roots};
}
function initial(p:UnionConfig){
  const t=new Trace(blank(),p.region), parents=p.parent??Array.from({length:p.n},(_,i)=>i);
  const base=t.allocate(p.n,'parents',parents);
  t.emit('设置 parent',[],[[0,base],[2,p.n]],{size:p.n});
  const {children,roots}=forest(t.pic);
  if(p.union!=='simple'){
    const values=Array<number>(p.n);
    function visit(i:number):number{
      const sub=children[i].map(visit);
      return values[i]=p.union==='size'?1+sub.reduce((a,b)=>a+b,0):Math.max(0,...sub.map(x=>x+1));
    }
    roots.forEach(visit);
    const meta=t.allocate(p.n,p.union==='size'?'sizes':'ranks',values);
    t.emit('设置辅助数组',[],[[1,meta]]);
  }
  t.emit('记下集合数',[],[[3,roots.length]]);
  return t.pic;
}
function operate(t:Trace,p:UnionConfig,op:Op) {
  const base=t.b[0],meta=t.b[1];
  function find(start:number) {
    const path:number[]=[];let i=start;
    while(true){
      const parent=t.b[base+i];
      t.emit('读 parent['+i+'] = '+parent+(i===parent?'，到根了':'，继续向上'),[base+i],[],{reads:(t.pic.reads??0)+1});
      if(i===parent)break;
      path.push(i);i=parent;
    }
    if(p.compress)for(const child of path.reverse()){
      if(t.b[base+child]!==i)t.emit('把 '+child+' 直接接到根 '+i,[],[[base+child,i]],{compressions:(t.pic.compressions??0)+1});
    }
    return i;
  }
  const ra=find(op.args[0]);
  if(op.name==='find'){t.finish('根是 '+ra);return;}
  const rb=find(op.args[1]);
  if(op.name==='connected'||ra===rb){t.finish(ra===rb?'属于同一个集合':'分别属于两个集合');return;}
  let child=ra,root=rb;
  if(p.union!=='simple'){
    const a=t.b[meta+ra],b=t.b[meta+rb],name=p.union==='rank'?'秩':'大小';
    t.emit('比较根 '+ra+'、'+rb+' 的'+name+'：'+a+' 和 '+b+(a===b?'，相等时第二个根留下':''),[meta+ra,meta+rb]);
    if(a>b){child=rb;root=ra;}
  }
  t.emit('把根 '+child+' 接到根 '+root+'，合为一个集合',[],[[base+child,root],[3,t.b[3]-1]]);
  if(p.union==='size')t.emit('把两棵树的大小相加',[],[[meta+root,t.b[meta+root]+t.b[meta+child]]]);
  if(p.union==='rank' && t.b[meta+ra]===t.b[meta+rb])t.emit('两个根原先同秩，新根的秩加 1',[],[[meta+root,t.b[meta+root]+1]]);
}
export const unionMachine=operationMachine<UnionConfig>(initial,operate,({pic,step,ops})=>{
  const {children,roots}=forest(pic);
  const depth=(i:number):number=>1+Math.max(0,...children[i].map(depth));
  return {step,ops,size:pic.size,sets:pic.bytes[3],height:Math.max(...roots.map(depth)),reads:pic.reads??0,compressions:pic.compressions??0};
});

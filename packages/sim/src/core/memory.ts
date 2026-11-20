import { decimalInput } from './decimal.ts';
import { Trace, addr, blank, holes, operationMachine, OperationFailure, type Op, type Region, type Write } from './heap.ts';
import type { Structure } from './operations.ts';

export interface MemoryConfig {
  structure:Structure; region:Region; commands:Op[]; capacity:number; growth:number;
  slots:number; probe:'linear'|'quadratic'|'double'; loadLimit?:number;
}
export const memoryNames=['step','ops','size','capacity','moves','probes','resizes','tombstones','freeBytes','largestHole','mem'];
export function variables(kind:string):string[] {
  if(kind==='linked-list')return ['head'];
  if(kind==='queue')return ['ptr','head','len','cap'];
  if(kind==='hash-open')return ['ptr','m','count','tombs'];
  if(kind==='hash-chain')return ['ptr','m','count'];
  return ['ptr','len','cap'];
}
export function prime(n:number) {
  if(!Number.isSafeInteger(n) || n<2)return false;
  for(let d=2;d*d<=n;d++)if(n%d===0)return false;
  return true;
}
function largerPrime(m:number){let n=2*m+1;while(!prime(n))n++;return n;}
export function initialArray(t:Trace,cap:number,values:number[]=[],queue=false) {
  const at=t.allocate(cap,'array',values);
  t.emit('初始化数组变量',[],queue?[[0,at],[1,0],[2,values.length],[3,cap]]:[[0,at],[1,values.length],[2,cap]],{size:values.length});
}
export function growArray(t:Trace,growth:number,queue=false) {
  const old=t.b[0], size=t.pic.size, capVar=queue?3:2, cap=t.b[capVar], head=queue?t.b[1]:0;
  const {numerator,places}=decimalInput(growth);
  const scaled=BigInt(cap)*numerator / (10n ** BigInt(places));
  const next=Math.max(cap+1,Number(scaled)), at=t.allocate(next,'array');
  for(let i=0;i<size;i++){
    const from=old+(head+i)%cap;
    t.emit('搬元素 '+t.b[from]+'：'+addr(from)+' → '+addr(at+i),[from],[[at+i,t.b[from]]],{moves:t.pic.moves+1});
  }
  const changes:Write[]=[[0,at],[capVar,next]];
  if(queue)changes.push([1,0]);
  t.release(old,changes,{resizes:t.pic.resizes+1});
}
function arrayOp(t:Trace,p:MemoryConfig,{name,args:[x,v]}:Op) {
  const queue=p.structure==='queue', len=t.pic.size, lenVar=queue?2:1, capVar=queue?3:2;
  let at=t.b[0];
  if(name==='insert'?x>len:['get','set','remove'].includes(name) && x>=len)throw new OperationFailure('下标 '+x+' 越界，当前长度 '+len);
  if(['push','enqueue','insert'].includes(name)) {
    if(len===t.b[capVar])growArray(t,p.growth,queue);
    at=t.b[0];
    const index=name==='insert'?x:queue?(t.b[1]+len)%t.b[capVar]:len;
    for(let i=len;i>index && name==='insert';i--)t.emit('向后挪下标 '+(i-1)+' → '+i,[at+i-1],[[at+i,t.b[at+i-1]]],{moves:t.pic.moves+1});
    const value=name==='insert'?v:x;
    t.emit('下标 '+index+' 写入 '+value,[],[[at+index,value],[lenVar,len+1]],{size:len+1});
  } else if(name==='get'||name==='peek'){
    if(!len)throw new OperationFailure('结构为空，无法读取');
    const i=name==='get'?x:queue?t.b[1]:len-1;
    t.emit('读下标 '+i+'，得到 '+t.b[at+i],[at+i]);
  } else if(name==='set') t.emit('下标 '+x+' 写入 '+v,[],[[at+x,v]]);
  else {
    if(!len)throw new OperationFailure('结构为空，无法取出');
    const i=name==='remove'?x:queue?t.b[1]:len-1, value=t.b[at+i];
    const changes:Write[]=[[lenVar,len-1]];
    if(queue)changes.push([1,(i+1)%t.b[capVar]]);
    if(name==='remove' && i<len-1) {
      t.emit('移除下标 '+i+' 的 '+value,[at+i]);
      for(let j=i;j<len-1;j++){
        const last=j===len-2;
        t.emit('向前挪下标 '+(j+1)+' → '+j,[at+j+1],[[at+j,t.b[at+j+1]],...(last?changes:[])],
          {moves:t.pic.moves+1,size:last?len-1:len});
      }
    } else t.emit('取出 '+value+'，长度变成 '+(len-1),[at+i],changes,{size:len-1});
  }
}
function probeIndex(c:MemoryConfig,key:number,m:number,i:number) {
  return (key%m+(c.probe==='quadratic'?i*i:c.probe==='double'?i*(1+key%(m-1)):i))%m;
}
function exceedsLoad(count:number,slots:number,limit:number) {
  const {numerator,places}=decimalInput(limit);
  return BigInt(count)*(10n ** BigInt(places)) > BigInt(slots)*numerator;
}
function resizeOpen(t:Trace,p:MemoryConfig) {
  const old=t.b[0], m=t.b[1], n=largerPrime(m), ptr=t.allocate(n,'slots',Array(n).fill(0));
  for(let i=0;i<m;i++){
    const key=t.b[old+i];if(!key||key===255)continue;
    const path:number[]=[];
    for(let j=0;j<n;j++){
      const k=probeIndex(p,key,n,j);path.push(k);
      if(!t.b[ptr+k]){
        t.emit('重散列 '+key+'，新表路径 '+path.join(' → '),[old+i,...path.map(a=>ptr+a)],[[ptr+k,key]],
          {moves:t.pic.moves+1,probes:t.pic.probes+path.length},{path,probeBase:ptr,probeKey:key});
        break;
      }
    }
  }
  t.release(old,[[0,ptr],[1,n],[3,0]],{resizes:t.pic.resizes+1});
}
function hashOpen(t:Trace,p:MemoryConfig,{name,args:[key]}:Op) {
  const ptr=t.b[0],m=t.b[1],path:number[]=[];
  let tomb=-1,empty=-1;
  for(let i=0;i<m;i++){
    const k=probeIndex(p,key,m,i),v=t.b[ptr+k];path.push(k);
    const desc=v===0?'空槽':v===255?'墓碑':String(v);
    t.emit('h('+key+') = '+key%m+(p.probe==='double'?'，步长 '+(1+key%(m-1)):'')+'，第 '+(i+1)+' 次读槽 '+k+'：'+desc+
      (v===key?(name==='insert'?'，键已存在':'，找到 '+key):(!v||i===m-1)&&name!=='insert'?'，未找到':''),
      [ptr+k],[],{probes:t.pic.probes+1},{path:[...path],probeBase:ptr,probeKey:key});
    if(v===key){
      if(name==='delete')t.emit('删除 '+key+'，槽 '+k+' 标为墓碑',[],[[ptr+k,255],[2,t.pic.size-1],[3,t.b[3]+1]],{size:t.pic.size-1},{path,probeBase:ptr,probeKey:key});
      return;
    }
    if(!v){empty=k;break;}
    if(v===255 && tomb<0)tomb=k;
  }
  if(name!=='insert')return;
  const k=tomb>=0?tomb:empty;
  if(k<0){t.emit('已探测 '+m+' 次，没有可用槽',[],[],{},{failed:true,path,probeBase:ptr,probeKey:key});return;}
  const size=t.pic.size+1,tombs=t.b[3]-Number(k===tomb);
  t.emit('槽 '+k+' 写入 '+key+(k===tomb?'，复用墓碑':''),[],[[ptr+k,key],[2,size],[3,tombs]],{size},{path,probeBase:ptr,probeKey:key});
  if(exceedsLoad(size+tombs,m,p.loadLimit??0.5))resizeOpen(t,p);
}
function resizeChain(t:Trace) {
  const old=t.b[0],m=t.b[1],n=largerPrime(m),at=t.allocate(n,'buckets',Array(n).fill(0));
  for(let i=0;i<m;i++){
    let a=t.b[old+i];
    while(a){
      const next=t.b[a+1], key=t.b[a], bucket=at+key%n;
      t.emit('键 '+key+' 头插到新桶 '+key%n,[a,a+1,bucket],[[old+i,next],[a+1,t.b[bucket]],[bucket,a]],{moves:t.pic.moves+1});
      a=next;
    }
  }
  t.release(old,[[0,at],[1,n]],{resizes:t.pic.resizes+1});
}
function linked(t:Trace,p:MemoryConfig,{name,args:[key]}:Op) {
  const hash=p.structure==='hash-chain',head=hash?t.b[0]+key%t.b[1]:0;
  let link=head,a=t.b[head];
  if(name!=='push-front')while(a){
    const matches=t.b[a]===key && name!=='push-back';
    t.emit('访问 '+addr(a)+'，键为 '+t.b[a]+(matches?'，找到 '+key:''),[a,a+1],[],{probes:t.pic.probes+1});
    if(matches){
      if(name==='delete'){
        const size=t.pic.size-1;
        t.emit('将 '+addr(link)+' 指向 '+addr(t.b[a+1]),[a+1],[[link,t.b[a+1]],...(hash?[[2,size] as Write]:[])],{size});
        t.release(a);
      }
      return;
    }
    link=a+1;a=t.b[link];
  }
  if(name==='delete'||name==='find'){
    if(!t.ticks.length)t.emit('链为空，未找到 '+key,[head]);
    else t.ticks[t.ticks.length-1].note.text+='，到达链尾，未找到 '+key;
    return;
  }
  const dest=name==='push-back'?link:head, size=t.pic.size+1;
  const node=t.allocate(2,'list');
  t.emit('结点 '+addr(node)+' 写入键 '+key,[],[[node,key]]);
  t.emit('新结点 next 指向 '+addr(t.b[dest]),[dest],[[node+1,t.b[dest]]]);
  t.emit('接入键 '+key+'：'+addr(dest)+' ← '+addr(node),[],[[dest,node],...(hash?[[2,size] as Write]:[])],{size});
  if(hash && p.loadLimit!==undefined && exceedsLoad(size,t.b[1],p.loadLimit))resizeChain(t);
}
export const memoryMachine=operationMachine<MemoryConfig>(p=>{
  const t=new Trace(blank(),p.region);
  if(p.structure.startsWith('hash-')){
    const ptr=t.allocate(p.slots,p.structure==='hash-open'?'slots':'buckets',Array(p.slots).fill(0));
    t.emit('初始化表',[],[[0,ptr],[1,p.slots]]);
  } else if(p.structure!=='linked-list') initialArray(t,p.capacity,[],p.structure==='queue');
  return t.pic;
},(t,p,op)=>{
  if(p.structure==='hash-open')hashOpen(t,p,op);
  else if(p.structure==='hash-chain'||p.structure==='linked-list')linked(t,p,op);
  else arrayOp(t,p,op);
},s=>{
  const {pic,params}=s,b=pic.bytes,free=holes(params.region,pic.blocks);
  const kind=params.structure;
  return {step:s.step,ops:s.ops,size:pic.size,capacity:kind==='linked-list'?0:b[kind.startsWith('hash')?1:kind==='queue'?3:2],
    moves:pic.moves,probes:pic.probes,resizes:pic.resizes,tombstones:kind==='hash-open'?b[3]:0,
    freeBytes:free.reduce((n,h)=>n+h.length,0),largestHole:Math.max(0,...free.map(h=>h.length))};
});

import { Trace, blank, operationMachine, type Op, type Picture, type Region } from './heap.ts';

export interface TrieConfig { kind:'trie'; keys:string[]; region:Region; commands:Op[] }
export const trieNames=['step','ops','size','nodes','height','compares','matches','mem'];

export function siblings(b:Uint8Array, first:number) {
  const list:number[]=[];
  for(let at=first;at;at=b[at+3])list.push(at);
  return list;
}
function height(pic:Picture,first:number,depth=1):number {
  let longest=0;
  for(const at of siblings(pic.bytes,first)){
    if(pic.bytes[at+1])longest=Math.max(longest,depth);
    longest=Math.max(longest,height(pic,pic.bytes[at+2],depth+1));
  }
  return longest;
}
function operate(t:Trace,{name,word}:Op) {
  const w=word!, path:{at:number;link:number}[]=[];
  let link=0,index=0;
  while(index<w.length) {
    const at=t.b[link];
    if(!at)break;
    const letter=String.fromCharCode(t.b[at]),target=w[index];
    const direction=letter===target?'相等':target>letter?'目标更大，往后找':'目标更小，这层没有它';
    t.emit('比较 '+target+' 和 '+letter+'：'+direction,[at],[],{compares:t.pic.compares+1});
    if(letter>target)break;
    if(letter<target){link=at+3;continue;}
    path.push({at,link});link=at+2;index++;
  }
  const found=index===w.length, last=path.at(-1)?.at;
  if(name==='insert') {
    if(found){
      if(t.b[last!+1])t.finish(w+' 已经是词');
      else t.emit('已有全部字母，把 '+w+' 标为词尾',[],[[last!+1,1]],{size:t.pic.size+1});
    }
    for(;index<w.length;index++){
      const end=Number(index===w.length-1);
      const at=t.allocate(4,'trie',[w.charCodeAt(index),end,0,t.b[link]]);
      t.finish('写入 '+w[index]+(end?'，标为词尾':''));
      t.emit('把 '+w[index]+' 接入有序兄弟链',[],[[link,at]],{size:t.pic.size+end});
      link=at+2;
    }
    return;
  }
  if(!t.ticks.length)t.emit('读 root，字典树为空',[0]);
  const terminal=found && !!t.b[last!+1];
  if(name==='prefix'){
    const words:string[]=terminal?[w]:[];
    const visit=(first:number,prefix:string)=>{
      for(const at of siblings(t.b,first)) {
        const next=prefix+String.fromCharCode(t.b[at]);
        t.emit('访问 '+next+(t.b[at+1]?'，收录这个词':'，继续向下'),[at,at+1]);
        if(t.b[at+1])words.push(next);
        visit(t.b[at+2],next);
      }
    };
    if(found)visit(t.b[last!+2],w);
    t.finish(words.length?'找到 '+words.join('、'):'没有匹配的词',{words});
    return;
  }
  if(name==='find'||!terminal) {
    t.finish(w+(terminal?' 是词':found?' 只是前缀':' 不在树中'));
    return;
  }
  t.emit('清除 '+w+' 的词尾标记',[],[[last!+1,0]],{size:t.pic.size-1});
  for(const {at,link:incoming} of path.reverse()){
    if(t.b[at+1]||t.b[at+2])break;
    t.emit('这个字母没有孩子，也不是词尾，让指针跳过它',[at+3],[[incoming,t.b[at+3]]]);
    t.release(at);
  }
}
export const trieMachine=operationMachine<TrieConfig>(p=>{
  let pic=blank();
  for(const word of new Set(p.keys)){
    const trace=new Trace(pic,p.region);operate(trace,{name:'insert',args:[],word});pic=trace.pic;
  }
  return {...pic,compares:0};
},(t,_p,op)=>operate(t,op),({pic,step,ops})=>({
  step,ops,size:pic.size,nodes:pic.blocks.length,height:height(pic,pic.bytes[0]),compares:pic.compares,matches:pic.words?.length??0,
}));

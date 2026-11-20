import { algorithmMachine } from './algorithm.ts';
import { mulberry32 } from './rng.ts';

export const sorts=['bubble','insertion','selection','merge','quick','heap'] as const;
export type Sort=typeof sorts[number];
export const sortNames=['step','compares','swaps','moves','writes','done'];
export interface Preset {kind:'random'|'sorted'|'reversed'|'few-unique';n:number;seed?:number}
export interface SortParams {algorithm:Sort;data:number[];race:Sort[];pivot?:'last'|'random';seed?:number;preset?:Preset}
export function shuffle(data:number[],seed:number) {
  const a=data.slice(),r=mulberry32(seed);
  for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}
export function presetData(p:Preset){
  const a=Array.from({length:p.n},(_,i)=>i+1);
  if(p.kind==='random')return shuffle(a,p.seed!);
  if(p.kind==='few-unique'){const r=mulberry32(p.seed!);return a.map(()=>1+Math.floor(r()*4));}
  return p.kind==='sorted'?a:a.reverse();
}
interface Item {v:number;id:number}
interface Scope {lo:number;hi:number;mid?:number;mark?:number;key?:Item;sorted?:number;label:string}
export interface SortFrame {algorithm:Sort;a:Item[];aux:Item[];reads:number[];writesAt:number[];auxRead:number[];scope:Scope;text:string;compares:number;swaps:number;moves:number;writes:number}
export function* sortFrames(data:number[],algorithm:Sort,pivot='last',seed=0):Generator<SortFrame,void>{
  const a=data.map((v,id)=>({v,id})),n=a.length,r=mulberry32(seed);
  let aux:Item[]=[],scope:Scope={lo:0,hi:n-1,label:'待排序'},compares=0,swaps=0,moves=0,writes=0;
  const frame=(text:string,reads:number[]=[],writesAt:number[]=[],auxRead:number[]=[]):SortFrame=>({
    algorithm,a:a.slice(),aux,scope:{...scope},compares,swaps,moves,writes,reads,writesAt,auxRead,text:algorithm+' · '+text,
  });
  const compare=(i:number,j:number,why:string)=>{compares++;return frame('比较 '+a[i].v+' 和 '+a[j].v+'，'+why,[i,j]);};
  const swap=(i:number,j:number)=>{const old=a[i].v;[a[i],a[j]]=[a[j],a[i]];swaps++;writes+=2;return frame('交换位置 '+i+'、'+j+' 的 '+old+' 和 '+a[i].v,[],[i,j]);};
  yield frame('初始数组');
  if(algorithm==='bubble'){
    for(let end=n-1;end>0;end--){
      let changed=false;scope={lo:0,hi:end,sorted:end+1,label:'冒泡区间'};
      for(let i=0;i<end;i++){
        const greater=a[i].v>a[i+1].v;yield compare(i,i+1,greater?'逆序，接下来交换':'顺序正确');
        if(greater){yield swap(i,i+1);changed=true;}
      }
      if(!changed)break;
    }
  }else if(algorithm==='selection'){
    for(let i=0;i<n-1;i++){
      let min=i;scope={lo:i,hi:n-1,mark:min,label:'当前最小'};
      for(let j=i+1;j<n;j++){
        const old=min;if(a[j].v<a[min].v)min=j;scope.mark=min;
        yield compare(old,j,'最小值在 '+min);
      }
      if(i!==min)yield swap(i,min);
    }
  }else if(algorithm==='insertion'){
    for(let i=1;i<n;i++){
      const key=a[i];let j=i;
      scope={lo:0,hi:i,key,mark:i,label:'取出 key'};
      while(j>0){
        compares++;const shift=a[j-1].v>key.v;
        yield frame('比较 '+a[j-1].v+' 和 key '+key.v+'，'+(shift?'前者较大，后移':'停止后移'),[j-1,...(j===i?[i]:[])]);
        if(!shift)break;
        a[j]=a[j-1];moves++;writes++;scope.mark=j-1;yield frame('把 '+a[j].v+' 移到位置 '+j,[j-1],[j]);j--;
      }
      if(j<i){a[j]=key;writes++;scope.mark=j;yield frame('把 key '+key.v+' 放回 '+j,[],[j]);}
    }
  }else if(algorithm==='quick'){
    function* quick(lo:number,hi:number):Generator<SortFrame,void>{
      if(lo>=hi)return;
      const pick=pivot==='random'?lo+Math.floor(r()*(hi-lo+1)):hi;
      scope={lo,hi,mark:hi,key:a[pick],label:'枢轴'};
      if(pick!==hi)yield swap(pick,hi);
      let i=lo;
      for(let j=lo;j<hi;j++){
        const take=a[j].v<=a[hi].v;yield compare(j,hi,take?'归入左区':'留在右区');
        if(take){if(i!==j)yield swap(i,j);i++;}
      }
      if(i!==hi){scope.mark=i;yield swap(i,hi);}
      yield* quick(lo,i-1);yield* quick(i+1,hi);
    }
    yield* quick(0,n-1);
  }else if(algorithm==='merge'){
    function* merge(lo:number,hi:number):Generator<SortFrame,void>{
      if(lo>=hi)return;
      const mid=(lo+hi)>>1;
      yield* merge(lo,mid);yield* merge(mid+1,hi);
      scope={lo,mid,hi,label:'合并区间'};aux=a.slice(lo,hi+1);
      yield frame('把 ['+lo+', '+hi+'] 抄到辅助数组',aux.map((_,i)=>lo+i));
      let l=0,right=mid-lo+1;const cut=right;
      for(let k=lo;k<=hi;k++){
        const both=l<cut && right<aux.length,seen=both?[l,right]:[l<cut?l:right];
        if(both)compares++;
        const takeLeft=l<cut && (right===aux.length||aux[l].v<=aux[right].v);
        a[k]=aux[takeLeft?l++:right++];writes++;
        yield frame((both?'比较两边，':'一侧已空，')+'取'+(takeLeft?'左':'右')+'侧 '+a[k].v+' 写入 '+k,[],[k],seen);
      }
    }
    yield* merge(0,n-1);
  }else{
    function* sink(i:number,end:number):Generator<SortFrame,void>{
      while(2*i+1<=end){
        let k=2*i+1;
        if(k+1<=end){const right=a[k+1].v>a[k].v;yield compare(k,k+1,'选较大的孩子，平手取左');if(right)k++;}
        const down=a[k].v>a[i].v;yield compare(i,k,down?'孩子更大，下沉':'已经满足堆序');
        if(!down)break;
        yield swap(i,k);i=k;
      }
    }
    scope={lo:0,hi:n-1,sorted:n,label:'大顶堆'};
    for(let i=(n>>1)-1;i>=0;i--)yield* sink(i,n-1);
    for(let end=n-1;end>0;end--){scope={lo:0,hi:end-1,sorted:end,label:'大顶堆'};yield swap(0,end);yield* sink(0,end-1);}
  }
}
export const sortMachine=algorithmMachine((p:SortParams)=>[p.algorithm,...p.race].map(algo=>sortFrames(p.data,algo,algo===p.algorithm?p.pivot:undefined,p.seed)),
  ({compares,swaps,moves,writes})=>({compares,swaps,moves,writes}));

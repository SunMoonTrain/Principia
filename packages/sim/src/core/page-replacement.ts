import { algorithmMachine } from './algorithm.ts';

export const replacements=['fifo','lru','opt','clock'] as const;
export interface ReplacementRun {algorithm:typeof replacements[number];frames:number}
export interface ReplacementParams {refs:number[];runs:ReplacementRun[];curve?:boolean}
export const replacementNames=['step','hits','faults','evictions','done'];
export interface Column {page:number;slots:(number|null)[];changed:number;out:number|null;hit:boolean}
export interface ReplacementFrame {
  text:string;columns:Column[];slots:(number|null)[];loaded:number[];used:number[];future:number[];
  bits:number[];hand:number;cleared:number[];hits:number;faults:number;evictions:number;
}
export function* replacePages(refs:number[],r:ReplacementRun):Generator<ReplacementFrame,void>{
  const empty=Array<number>(r.frames).fill(0);
  let f:ReplacementFrame={text:'页框为空',columns:[],slots:empty.map(()=>null),loaded:[...empty],used:[...empty],future:empty.map(()=>Infinity),
    bits:[...empty],hand:0,cleared:[],hits:0,faults:0,evictions:0};
  yield f;
  for(const [t,page] of refs.entries()){
    f={...f,slots:[...f.slots],loaded:[...f.loaded],used:[...f.used],bits:[...f.bits],cleared:[]};
    let at=f.slots.indexOf(page),out:number|null=null,reason='';
    const hit=at>=0;
    if(hit){f.hits++;reason='命中';}
    else{
      f.faults++;at=f.slots.indexOf(null);
      if(at>=0)reason='缺页，装入最小空帧';
      else{
        at=0;
        switch(r.algorithm){
          case 'clock':
            while(f.bits[f.hand]===1){f.cleared.push(f.hand);f.bits[f.hand]=0;f.hand=(f.hand+1)%r.frames;}
            at=f.hand;f.hand=(at+1)%r.frames;reason='指针选中引用位为 0 的帧';break;
          case 'fifo':case 'lru': {
            const time=r.algorithm==='fifo'?f.loaded:f.used;
            for(let i=1;i<r.frames;i++)if(time[i]<time[at])at=i;
            reason=r.algorithm==='fifo'?'最早装入':'最久没有引用';break;
          }
          case 'opt':
            for(let i=1;i<r.frames;i++)
              if(f.future[i]>f.future[at] || f.future[i]===f.future[at]&&f.loaded[i]<f.loaded[at])at=i;
            reason='下次引用最远，同距时最早装入';break;
        }
        f.evictions++;out=f.slots[at];reason='缺页，'+reason+'，换出 '+out;
      }
      f.loaded[at]=t;f.slots[at]=page;
    }
    f.used[at]=t;f.bits[at]=1;
    f.future=f.slots.map(p=>{const i=p===null?-1:refs.indexOf(p,t+1);return i<0?Infinity:i;});
    f.columns=[...f.columns,{page,slots:f.slots,changed:at,out,hit}];
    f.text='引用 '+page+'：'+reason+'，帧 '+at;yield f;
  }
}
export const replacementMachine=algorithmMachine((p:ReplacementParams)=>p.runs.map(r=>replacePages(p.refs,r)),
  f=>({hits:f.hits,faults:f.faults,evictions:f.evictions}));
export function faultCurve(refs:number[],algorithm:ReplacementRun['algorithm']){
  return Array.from({length:8},(_,i)=>{
    let faults=0;for(const f of replacePages(refs,{algorithm,frames:i+1})) faults=f.faults;return faults;
  });
}

import type { Machine } from './machine.ts';

export interface Frame { text:string }
export interface Track<F> { frame:F; step:number; done:boolean; next:()=>Track<F> }
function track<F>(iterator:Generator<F,void>,frame:F,step:number):Track<F> {
  const pending=iterator.next();
  let next:Track<F>|undefined;
  const here:Track<F>={frame,step,done:!!pending.done,next:()=>{
    if(pending.done)return here;
    return next??=track(iterator,pending.value,step+1);
  }};
  return here;
}
// 每个有界输入只向前预读一帧。分支重放共享只读快照；并排时完成的一侧留在末帧。
export function algorithmMachine<P,F extends Frame>(streams:(p:P)=>Generator<F,void>[],counts:(f:F)=>Record<string,number|boolean>):Machine<P,Track<F>[]> {
  return {
    init:p=>streams(p).map(iterator=>{
      const first=iterator.next();
      if(first.done)throw Error('算法缺少初始画面');
      return track(iterator,first.value,0);
    }),
    atEnd:runs=>runs.every(r=>r.done),
    step:runs=>{
      const state=runs.map(r=>r.next());
      return {state,done:state.every(r=>r.done),events:state.flatMap((r,i)=>r===runs[i]?[]:[{kind:'info' as const,text:r.frame.text}])};
    },
    observe:([r])=>({step:r.step,...counts(r.frame),done:r.done}),
  };
}

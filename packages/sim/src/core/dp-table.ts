import {algorithmMachine} from './algorithm.ts';
export type DpParams={problem:'lcs'|'edit-distance';a:string;b:string}|{problem:'knapsack';capacity:number;items:[number,number][]};
export const dpNames=['step','filled','result','traced','done'];
export interface DpFrame {table:Int16Array;width:number;height:number;at:number;deps:number[];chosen:number;trace:number[];answer:string[];
  text:string;filled:number;result:number;traced:number}
export function* dpFrames(p:DpParams):Generator<DpFrame,void>{
  const bag=p.problem==='knapsack',edit=p.problem==='edit-distance',a=bag?[]:Array.from(p.a),b=bag?[]:Array.from(p.b);
  const height=1+(bag?p.items.length:a.length),width=1+(bag?p.capacity:b.length);
  const table=new Int16Array(width*height).fill(-1);
  for(let i=0;i<height;i++)table[i*width]=edit?i:0;
  for(let j=0;j<width;j++)table[j]=edit?j:0;
  const trace:number[]=[],answer:string[]=[];let filled=0,traced=0;
  const frame=(text:string,at:number,deps:number[],chosen:number):DpFrame=>({table:table.slice(),width,height,at,deps,chosen,
    trace:trace.slice(),answer:answer.slice(),text,filled,traced,result:table.at(-1)!});
  yield frame('第 0 行、第 0 列已按边界条件填好',-1,[],-1);
  function choice(i:number,j:number){
    const at=i*width+j,up=at-width,left=at-1,diag=up-1;
    if(p.problem==='knapsack'){
      const [w,v]=p.items[i-1],can=j>=w,from=up-w,take=can&&table[from]+v>table[up];
      return {chosen:take?from:up,deps:can?[up,from]:[up],value:take?table[from]+v:table[up],why:!can?'容量不足，不取':take?'取这件更高':'不取至少一样好',part:take?String(i):''};
    }
    const same=i>0&&j>0&&a[i-1]===b[j-1];
    if(!edit){
      if(same)return {chosen:diag,deps:[diag],value:table[diag]+1,why:'字符相同，取左上加一',part:a[i-1]};
      const chosen=table[up]>=table[left]?up:left;
      return {chosen,deps:[up,left],value:table[chosen],why:chosen===up?'字符不同，上方不小于左方':'字符不同，左方更大',part:''};
    }
    const delta=same?0:1;
    const cost=Math.min(i&&j?table[diag]+delta:Infinity,i?table[up]+1:Infinity,j?table[left]+1:Infinity);
    const deps=[...(i&&j?[diag]:[]),...(i?[up]:[]),...(j?[left]:[])];
    if(i&&j&&cost===table[diag]+delta)return {chosen:diag,deps,value:cost,why:same?'字符相同，沿左上不变':'沿左上替换，代价加一',part:same?a[i-1]+' 不变':a[i-1]+' 换成 '+b[j-1]};
    if(i&&cost===table[up]+1)return {chosen:up,deps,value:cost,why:'从上方删除，代价加一',part:'删除 '+a[i-1]};
    return {chosen:left,deps,value:cost,why:'从左方插入，代价加一',part:'插入 '+b[j-1]};
  }
  for(let i=1;i<height;i++)for(let j=bag?0:1;j<width;j++){
    const at=i*width+j,c=choice(i,j);table[at]=c.value;filled++;
    yield frame('填 ['+i+']['+j+']：'+c.why+'，写入 '+c.value,at,c.deps,c.chosen);
  }
  let i=height-1,j=width-1;trace.push(i*width+j);
  while(bag?i>0:edit?i>0||j>0:i>0&&j>0){
    const at=i*width+j,c=choice(i,j);
    if(c.part)answer.unshift(c.part);trace.push(c.chosen);traced++;
    yield frame('回溯 ['+i+']['+j+']：'+c.why+(c.part?' · '+c.part:''),at,c.deps,c.chosen);
    i=Math.floor(c.chosen/width);j=c.chosen%width;
  }
}
export const dpMachine=algorithmMachine((p:DpParams)=>[dpFrames(p)],({filled,result,traced})=>({filled,result,traced}));

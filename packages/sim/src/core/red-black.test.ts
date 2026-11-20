import { it,expect } from 'vitest';
import { ReferenceRB } from './red-black-reference.test-helper';
import { treeMachine as m } from './tree';
import { type Picture } from './heap';
import { parseOps } from './operations';

const ten=[1,2,3,4,5,6,7,8,9,10];
function snapshot(p:Picture) {
  const b=p.bytes,keys:number[]=[],seen=new Set<number>();
  function visit(n:number):[number,string]{
    if(!n)return [1,'.'];
    if(seen.has(n))throw Error('结点被重复引用');seen.add(n);
    const [lh,l]=visit(b[n+1]);keys.push(b[n]);const [rh,r]=visit(b[n+2]);
    if(lh!==rh)throw Error('左右黑高不同');
    if(b[n+3] && [b[n+1],b[n+2]].some(a=>a && b[a+3]))throw Error('红色父子');
    return [lh+Number(!b[n+3]),b[n]+(b[n+3]?'R':'B')+'('+l+','+r+')'];
  }
  if(b[0] && b[b[0]+3])throw Error('根必须是黑色');
  const [,shape]=visit(b[0]);
  if(seen.size!==p.size || p.blocks.length!==seen.size)throw Error('结点数量不符');
  return {shape,keys};
}
function sample(script:string,keys:number[]=[]) {
  const params={kind:'red-black' as const,keys,commands:parseOps(script,'red-black'),capacity:4,region:[16,255] as const};
  let s=m.init(params,0);
  const cases:string[][]=[],roots:number[]=[];
  while(!m.atEnd!(s)){
    const op=s.ops;s=m.step(s).state;
    const reason=s.note.reason??'',c=/情形 (\d)(（镜像）)?/.exec(reason);
    cases[op]??=[];
    if(c)cases[op].push(c[1]+(c[2]?'m':''));
    if(reason.startsWith('根 '))roots.push(op+1);
  }
  return {s,cases,roots,shape:snapshot(s.pic).shape};
}
it('1–10 的镜像情形、根涂黑和最终着色',()=>{
  const r=sample('insert '+ten.join(' '));
  expect(r.cases).toEqual([[],[],['3m'],['1m'],['3m'],['1m'],['3m'],['1m','3m'],['3m'],['1m','1m']]);
  expect(r.roots).toEqual([1,4,10]);expect(r.s.pic.rotations).toBe(5);
  expect(r.shape).toBe('4B(2B(1B(.,.),3B(.,.)),6B(5B(.,.),8R(7B(.,.),9B(.,10R(.,.)))))');
  const lr=sample('insert 3 1 2');expect(lr.cases[2]).toEqual(['2','3']);
  expect(lr.shape).toBe('2B(1R(.,.),3R(.,.))');expect(lr.s.pic.rotations).toBe(2);
});
it('删除的四种修复，后继接替根',()=>{
  const four=sample('delete 4',ten);expect(four.cases[0]).toEqual(['1','2']);
  expect(four.shape).toBe('5B(2B(1B(.,.),3B(.,.)),8B(6B(.,7R(.,.)),9B(.,10R(.,.))))');
  const one=sample('delete 1',ten);expect(one.cases[0]).toEqual(['2','4']);expect(m.observe(one.s).root).toBe(6);
  const three=sample('delete 1',[2,1,4,3]);expect(three.cases[0]).toEqual(['3','4']);
  expect(three.s.pic.rotations).toBe(2);expect(three.shape).toBe('3B(2B(.,.),4B(.,.))');
});
it('40 个种子，每组 500 次插入删除后与独立父指针模型同形同色',()=>{
  for(let seed=1;seed<=40;seed++){
    const ref=new ReferenceRB(),set=new Set<number>();let rng=seed;
    const next=()=>{rng=(Math.imul(1664525,rng)+1013904223)>>>0;return rng>>>8;};
    const config={kind:'red-black' as const,keys:[],capacity:4,region:[16,255] as const,commands:[]};
    let s=m.init(config,0);
    for(let step=0;step<500;step++){
      const key=next()%48,insert=next()%2===0,name=insert?'insert':'delete';
      if(insert){set.add(key);ref.insert(key);}else{set.delete(key);ref.delete(key);}
      s=m.step({...s,ops:0,commands:[{name,args:[key]}]},'一个操作').state;
      const actual=snapshot(s.pic);
      if(actual.keys.join()!==[...set].sort((a,b)=>a-b).join() || actual.shape!==ref.shape())throw Error('种子 '+seed+' 操作 '+step+' '+name+' '+key);
    }
  }
});

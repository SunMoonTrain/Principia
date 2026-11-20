import { expect,it } from 'vitest';
import { treeMachine as machine, type TreeKind } from './tree';
import { parseOps } from './operations';
import { type Picture } from './heap';

function run(kind:TreeKind,script:string,keys:number[]=[]) {
  let s=machine.init({kind,commands:parseOps(script,kind),keys,region:[16,255],capacity:4},0);
  const ticks=[s],ends=[s];
  while(!machine.atEnd!(s)){s=machine.step(s).state;ticks.push(s);if(!s.tape)ends.push(s);}
  return {s,ticks,ends};
}
function shape(p:Picture,a=p.bytes[0]):unknown {
  return a?[p.bytes[a],shape(p,p.bytes[a+1]),shape(p,p.bytes[a+2])]:null;
}
const leaf=(n:number)=>[n,null,null];
it.each([
  ['avl','delete 1\ndelete 3\ndelete 2',[1,2,3,4,5,6,7]],
  ['red-black','insert 1 2 3 4 5 6 7 8 9 10',[]],
  ['red-black','delete 4',[1,2,3,4,5,6,7,8,9,10]],
] as const)('%s 的整操作说明按顺序保留各微步的理由，结尾只出现一次',(kind,script,keys)=>{
  const fine=run(kind,script,[...keys]);
  let state=fine.ends[0];
  for(const end of fine.ends.slice(1)){
    const notes=fine.ticks.slice(state.step+1,end.step+1).map(t=>t.note);
    const lines=notes.flatMap(n=>n.reason?[n.reason]:[]);
    if(!notes.at(-1)?.reason)lines.push(end.note.text);
    state=machine.step(state,'一个操作').state;
    const actual=state.note.text.replace(/^\d+ 个微步。/,'').split(/[；。]/).filter(Boolean);
    const expected=lines.flatMap(line=>line.split(/[；。]/)).filter(Boolean);
    expect(actual).toEqual(expected);
  }
});
it('顺序插入在 BST 退化，AVL 的四次右右调节与地址固定',()=>{
  const script='insert 1 2 3 4 5 6 7',a=run('avl',script);
  expect(a.ends.map(s=>s.pic.rotations)).toEqual([0,0,0,1,1,2,3,4]);
  expect(a.ticks.filter(s=>s.note.reason?.includes('右右'))).toHaveLength(4);
  expect(shape(a.s.pic)).toEqual([4,[2,leaf(1),leaf(3)],[6,leaf(5),leaf(7)]]);
  expect(a.s.pic.bytes[0]).toBe(28);expect(a.s.pic.blocks.map(b=>b.at)).toEqual([16,20,24,28,32,36,40]);
  expect(machine.observe(run('bst',script).s)).toMatchObject({height:7});
  const b=run('avl','insert 3 1 2');
  expect(shape(b.s.pic)).toEqual([2,leaf(1),leaf(3)]);expect(b.s.pic.rotations).toBe(2);
  expect(b.ticks.filter(s=>s.note.reason?.includes('左右'))).toHaveLength(2);
});
it('删除后从变化处往上，孩子因子为零也做单旋',()=>{
  const r=run('avl','delete 1\ndelete 3\ndelete 2',[1,2,3,4,5,6,7]);
  expect(r.ends.map(s=>s.pic.rotations)).toEqual([0,0,0,1]);expect(r.s.note.reason).toContain('-2 / 0');
  expect(shape(r.s.pic)).toEqual([6,[4,null,leaf(5)],leaf(7)]);
});
it('TREE-DELETE 的四次指针写按序单步可见，后继的键留在原址',()=>{
  const r=run('bst','delete 50',[50,30,70,20,40,60,80,65]);
  expect(r.ticks.filter(s=>s.note.writes.length===1).map(s=>[s.note.writes[0],s.pic.bytes[s.note.writes[0]]]))
    .toEqual([[0x17,0x25],[0x21,0x16],[0,0x1f],[0x20,0x13]]);
  expect(r.s.note.blockChange).toEqual([16,17,18]);expect(r.s.note.writes).toEqual([]);expect(r.s.pic.bytes[16]).toBe(50);
  expect(shape(r.s.pic)).toEqual([60,[30,leaf(20),leaf(40)],[70,leaf(65),leaf(80)]]);
});
it('大小堆用同一套比较规则，建堆、取出和上浮分别计数',()=>{
  const keys=[3,1,6,5,2,4],r=run('max-heap','build\nextract\ninsert 7',keys);
  const values=(s:typeof r.s)=>Array.from(s.pic.bytes.slice(s.pic.bytes[0],s.pic.bytes[0]+s.pic.size));
  expect(r.ends.slice(1).map(values)).toEqual([[6,5,4,1,2,3],[5,3,4,1,2],[7,3,5,1,2,4]]);
  expect(r.ends.slice(1).map((s,i)=>[s.pic.compares-r.ends[i].pic.compares,s.pic.swaps-r.ends[i].pic.swaps,s.step-r.ends[i].step])).toEqual([[6,3,9],[4,1,6],[2,2,5]]);
  expect(r.ticks[10].note.text).toContain('取出根 6');
  const min=run('min-heap','build',keys).s;expect(values(min)).toEqual([1,2,4,5,3,6]);expect(min.pic).toMatchObject({compares:7,swaps:3});
});

it('原始数组未成堆时，读者改脚本仍须先建堆',()=>{
  const r=run('max-heap','extract\nbuild',[1,3,2]);
  expect(r.ends[1].note.failed).toBe(true);expect(r.ends[1].pic).toBe(r.ends[0].pic);
  expect(machine.observe(r.s).root).toBe(3);
});
it.each(['avl','bst'] as const)('%s 随机删除后，每个可达键、地址和高度均正确',kind=>{
  let rng=73,s=machine.init({kind,commands:[],keys:[],region:[16,255],capacity:4},0);
  const set=new Set<number>();
  for(let i=0;i<5000;i++){
    rng=(Math.imul(rng,1664525)+1013904223)>>>0;
    const k=(rng>>>16)%48,name=(rng&8)?'insert':'delete';
    if(name==='insert')set.add(k);else set.delete(k);
    s=machine.step({...s,ops:0,commands:[{name,args:[k]}]},'一个操作').state;
    const b=s.pic.bytes,keys:number[]=[],seen=new Set<number>();
    function walk(a:number):number {
      if(!a)return 0;
      if(seen.has(a))throw Error('重复地址');seen.add(a);
      const l=walk(b[a+1]);keys.push(b[a]);const r=walk(b[a+2]),h=1+Math.max(l,r);
      if(kind==='avl' && (Math.abs(l-r)>1||b[a+3]!==h))throw Error('AVL 高度错误');
      return h;
    }
    walk(b[0]);
    if(seen.size!==s.pic.blocks.length || keys.join()!==[...set].sort((a,b)=>a-b).join())throw Error('键或分配状态不符');
  }
});

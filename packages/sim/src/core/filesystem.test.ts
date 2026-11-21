import { expect,it } from 'vitest';
import { fsMachine as m, parseFsOps, type FsState,type FsParams,type Disk } from './filesystem';
import { mulberry32 } from './rng';
function inputs(ops:string):FsParams {
  const {errors,commands}=parseFsOps(ops.replaceAll(';','\n'));expect(errors).toEqual([]);
  return {ops,commands,inodes:8,blocks:16,direct:4,indirect:4,entries:4,granularity:'io'};
}
function run(ops:string){
  let s=m.init(inputs(ops),0);const states:FsState[]=[];
  while(!m.atEnd!(s)){s=m.step(s,'一个操作').state;states.push(s);}
  return states;
}
const list=(s:FsState)=>[false,true].map(w=>s.list.filter(x=>x.write===w).map(x=>x.key).join(' ')).join(' / ');
it('七种操作的完整读写清单和回收',()=>{
  const s=run('mkdir /foo;touch /foo/bar;write /foo/bar 3;read /foo/bar;ln /foo/bar /baz;rm /foo/bar;read /baz;rm /baz;rmdir /foo');
  expect(s.map(list)).toEqual([
    'i0 b0 imap bmap / imap bmap b0 b1 i0 i1','i0 b0 i1 b1 imap / imap b1 i1 i2',
    'i0 b0 i1 b1 i2 bmap / bmap b2 b3 b4 i2','i0 b0 i1 b1 i2 b2 b3 b4 / ',
    'i0 b0 i1 b1 i2 / b0 i0 i2','i0 b0 i1 b1 i2 / b1 i1 i2','i0 b0 i2 b2 b3 b4 / ',
    'i0 b0 i2 imap bmap / imap bmap b0 i0 i2','i0 b0 i1 b1 imap bmap / imap bmap b0 i0 i1',
  ]);
  expect(m.observe(s.at(-1)!)).toMatchObject({ops:9,inodes:1,blocks:1,errors:0});
});
it('间接块先分配，按逻辑顺序读，失败的一步都不写',()=>{
  const s=run('touch /big;write /big 6;read /big;write /big 3;rm /big');
  expect(s.map(list)).toEqual(['i0 b0 imap / imap b0 i0 i1','i0 b0 i1 bmap / bmap b1 b2 b3 b4 b5 b6 b7 i1',
    'i0 b0 i1 b1 b2 b3 b4 b5 b6 b7 / ','i0 b0 i1 / ','i0 b0 i1 b5 imap bmap / imap bmap b0 i0 i1']);
  expect(s[1].disk.inode[1]).toMatchObject({direct:[1,2,3,4],indirect:5,size:6});
  expect(s[1].disk.block[5]).toEqual({kind:'indirect',pointers:[6,7]});
  expect(s[3].disk).toEqual(s[2].disk);expect(s[3].errors).toBe(1);
});
it('目录的第二块、非空目录、耗尽 inode',()=>{
  const s=run('mkdir /a;mkdir /a/b;touch /a/b/c;read /a/b/c;rmdir /a;touch /a/x;touch /a/y;touch /a/z;mkdir /a/q;touch /last');
  expect(s.map(list)).toEqual(['i0 b0 imap bmap / imap bmap b0 b1 i0 i1','i0 b0 i1 b1 imap bmap / imap bmap b1 b2 i1 i2',
    'i0 b0 i1 b1 i2 b2 imap / imap b2 i2 i3','i0 b0 i1 b1 i2 b2 i3 / ','i0 b0 i1 b1 / ',
    'i0 b0 i1 b1 imap / imap b1 i1 i4','i0 b0 i1 b1 imap bmap / imap bmap b3 i1 i5',
    'i0 b0 i1 b1 b3 imap / imap b3 i1 i6','i0 b0 i1 b1 b3 imap bmap / imap bmap b3 b4 i1 i7','i0 b0 imap / ']);
  expect(s[6].disk.inode[1]?.direct).toEqual([1,3]);expect(s[8].disk.imap.every(Boolean)).toBe(true);
});
// 从根按目录项与指针重建可达集合和入链计数，不读取机器的观测量或内部规划结果。
function audit(d:Disk){
  const nodes=new Set<number>(),blocks=new Set<number>(),links=new Map<number,number>();
  function walk(id:number){
    if(nodes.has(id))return;
    nodes.add(id);const n=d.inode[id]!;
    for(const b of n.direct){
      expect(blocks.has(b)).toBe(false);blocks.add(b);
      const data=d.block[b]; if(data?.kind==='dir')for(const e of data.entries)if(e){
        links.set(e.ino,(links.get(e.ino)??0)+1);walk(e.ino);
      }
    }
    if(n.indirect!==null){
      blocks.add(n.indirect);const ind=d.block[n.indirect];expect(ind?.kind).toBe('indirect');
      if(ind?.kind==='indirect')ind.pointers.forEach(b=>{expect(blocks.has(b)).toBe(false);blocks.add(b);});
    }
  }
  walk(0);
  expect(d.imap).toEqual(d.imap.map((_,i)=>nodes.has(i)));
  expect(d.bmap).toEqual(d.bmap.map((_,i)=>blocks.has(i)));
  for(const i of nodes)expect(d.inode[i]?.links).toBe(links.get(i));
}
it('随机操作后的位图、链接数与独立遍历一致，两种粒度同终态',()=>{
  const rand=mulberry32(173),names=['/a','/b','/c','/a/x','/b/u','/t','/q'];
  for(let trial=0;trial<65;trial++){
    const at=()=>names[Math.floor(rand()*names.length)],ops=['touch','mkdir','rm','rmdir','ln','write','read'];
    const seq=Array.from({length:30},()=>{const op=ops[Math.floor(rand()*ops.length)];return op+' '+at()+(op==='ln'?' '+at():op==='write'?' '+(1+Math.floor(rand()*8)):'');}).join(';');
    const p=inputs(seq);let a=m.init(p,0),b=m.init(p,0);
    while(!m.atEnd!(a)){
      const before=a.disk;a=m.step(a,'一个操作').state;
      do{b=m.step(b,'一次读写').state;}while(b.tape);
      expect(b.disk).toEqual(a.disk);audit(a.disk);
      if(a.reason)expect(a.disk).toEqual(before);
    }
  }
});

import type { Machine } from './machine.ts';

export const fsNames=['step','ops','reads','writes','inodes','blocks','errors','done'];
export const fsGrains=['一次读写','一个操作'];
export type FsCommand={op:'mkdir'|'touch'|'write'|'read'|'ln'|'rm'|'rmdir';path:string;dest?:string;count?:number};
export interface FsParams {inodes:number;blocks:number;direct:number;indirect:number;entries:number;commands:FsCommand[];ops:string;granularity:'io'|'op'}
export function parseFsOps(source:string){
  const commands:FsCommand[]=[],errors:{row:number;message:string}[]=[];
  const lines=source.normalize('NFKC').trimEnd().split('\n');
  const validPath=(s:string)=>s==='/'||/^\/[a-z0-9._-]{1,8}(?:\/[a-z0-9._-]{1,8}){0,3}$/.test(s)&&!s.split('/').some(n=>n==='.'||n==='..');
  if(lines.length>30)errors.push({row:30,message:'操作最多 30 行'});
  lines.forEach((line,row)=>{
    const args=line.trim().split(/\s+/),[op,path,extra]=args;
    if(!['mkdir','touch','write','read','ln','rm','rmdir'].includes(op) ||
      args.length!==(op==='ln'||op==='write'?3:2) || !validPath(path) ||
      op==='ln'&&!validPath(extra) || op==='write'&&(!/^\d+$/.test(extra)||Number(extra)<1||Number(extra)>20))
      errors.push({row,message:'操作、绝对路径或块数不合法（write 追加 1–20 块）'});
    else commands.push({op:op as FsCommand['op'],path,...(op==='ln'?{dest:extra}:op==='write'?{count:Number(extra)}:{})});
  });
  return {commands,errors};
}
export interface Inode {kind:'dir'|'file';size:number;links:number;direct:number[];indirect:number|null}
interface Dirent {name:string;ino:number}
export type Block={kind:'dir';entries:(Dirent|null)[]}|{kind:'file';ino:number;offset:number}|{kind:'indirect';pointers:number[]};
export interface Disk {imap:boolean[];bmap:boolean[];inode:(Inode|null)[];block:(Block|null)[]}
export interface IO {key:string;text:string;write:boolean}
interface Tape {io:IO[];result:Disk;error:string}
export interface FsState {p:FsParams;disk:Disk;tape:Tape|null;next:number;ops:number;step:number;reads:number;writes:number;errors:number;
  list:IO[];active:IO[];reason:string}
const empty=<T>(n:number)=>Array<T|null>(n).fill(null);
const inode=(kind:Inode['kind']):Inode=>({kind,size:0,links:kind==='dir'?2:1,direct:[],indirect:null});
const dirBlock=(n:number):Extract<Block,{kind:'dir'}>=>({kind:'dir',entries:empty<Dirent>(n)});
export function formatDisk(p:FsParams):Disk {
  const disk:Disk={imap:Array<boolean>(p.inodes).fill(false),bmap:Array<boolean>(p.blocks).fill(false),inode:empty(p.inodes),block:empty(p.blocks)};
  disk.imap[0]=disk.bmap[0]=true;
  const root=inode('dir'),b=dirBlock(p.entries);
  root.direct=[0];root.size=2;b.entries[0]={name:'.',ino:0};b.entries[1]={name:'..',ino:0};
  disk.inode[0]=root;disk.block[0]=b;
  return disk;
}
export function diskLabel(key:string){
  if(key==='imap')return 'inode 位图';
  if(key==='bmap')return '数据位图';
  return (key[0]==='i'?'inode ':'块 ')+key.slice(1);
}
class FsFailure extends Error {}
function fail(reason:string):never {throw new FsFailure(reason);}
function plan(p:FsParams, before:Disk, cmd:FsCommand):Tape{
  const disk=structuredClone(before), reads=new Map<string,string>(),writes=new Map<string,string>();
  const read=(key:string,why:string)=>{if(!reads.has(key))reads.set(key,why);};
  const write=(key:string,why:string)=>writes.set(key,why);
  function alloc(bitmap:'imap'|'bmap'){
    read(bitmap,'检查最低空闲编号');
    const n=disk[bitmap].indexOf(false);
    if(n<0)fail(bitmap==='imap'?'inode 已用完':'数据块已用完');
    disk[bitmap][n]=true;write(bitmap,'标记分配');return n;
  }
  function node(ino:number){
    read('i'+ino,'查看类型和块指针');return disk.inode[ino]!;
  }
  function directory(id:number){
    const b=disk.block[id];if(b?.kind!=='dir')throw Error('目录块损坏');
    return b;
  }
  function lookup(ino:number,name:string,scanAll=false){
    const dir=node(ino);
    if(dir.kind!=='dir')fail('路径中有普通文件');
    let found:{ino:number;block:number;slot:number}|undefined;
    let free:{block:number;slot:number}|undefined;
    for(const id of dir.direct){
      read('b'+id,'查找目录项 '+name);
      const entries=directory(id).entries;
      entries.forEach((e,slot)=>{
        if(e?.name===name)found={ino:e.ino,block:id,slot};
        if(!e&&!free)free={block:id,slot};
      });
      if(found&&!scanAll)break;
    }
    return {found,free};
  }
  function parent(path:string){
    const parts=path.split('/').filter(Boolean),name=parts.pop();
    node(0);
    if(!name)fail('根目录不适用此操作');
    let ino=0;
    for(const part of parts){
      const hit=lookup(ino,part).found;if(!hit)fail('找不到 '+part);
      ino=hit.ino;
    }
    return {ino,name};
  }
  function existing(path:string){
    const {ino:parentId,name}=parent(path),hit=lookup(parentId,name).found;
    if(!hit)fail('找不到 '+name);
    return {...hit,parentId,file:node(hit.ino)};
  }
  function add(path:string,kind:'file'|'dir',link?:number){
    const par=parent(path),dir=node(par.ino),place=lookup(par.ino,par.name,true);
    if(place.found)fail('名字已经存在');
    if(!place.free&&dir.direct.length>=p.direct)fail('父目录的直接指针已用完');
    const id=link??alloc('imap');
    let free=place.free;
    if(!free){
      const block=alloc('bmap');disk.block[block]=dirBlock(p.entries);
      dir.direct.push(block);free={block,slot:0};
    }
    const child=link===undefined?inode(kind):disk.inode[id]!;
    if(link!==undefined)child.links++;
    if(kind==='dir'){
      const b=alloc('bmap'),contents=dirBlock(p.entries);
      contents.entries[0]={name:'.',ino:id};contents.entries[1]={name:'..',ino:par.ino};
      child.direct=[b];child.size=2;dir.links++;disk.block[b]=contents;write('b'+b,'初始化目录');
    }
    directory(free.block).entries[free.slot]={name:par.name,ino:id};
    write('b'+free.block,'加入目录项 '+par.name);dir.size++;disk.inode[id]=child;
    write('i'+par.ino,'更新父目录');write('i'+id,'更新 inode 和链接数');
  }
  function pointers(id:number){
    const block=disk.block[id];if(block?.kind!=='indirect')throw Error('间接块损坏');
    return block.pointers;
  }
  function unlink(hit:ReturnType<typeof existing>){
    const {file,ino,parentId}=hit,dir=disk.inode[parentId]!;
    if(cmd.op==='rmdir'){
      if(file.kind!=='dir')fail('rmdir 需要目录');
      for(const b of file.direct){
        read('b'+b,'检查目录是否为空');
        if(directory(b).entries.some(e=>e&&e.name!=='.'&&e.name!=='..'))fail('目录不空');
      }
      dir.links--;file.links=0;
    }else{
      if(file.kind!=='file')fail('rm 只删除文件');
      file.links--;
    }
    directory(hit.block).entries[hit.slot]=null;dir.size--;
    write('b'+hit.block,'移除目录项');write('i'+parentId,'更新父目录');write('i'+ino,'更新链接数或释放 inode');
    if(file.links>0)return;
    const released=[...file.direct];
    if(file.indirect!==null){
      read('b'+file.indirect,'读取待释放的间接指针');
      released.push(file.indirect,...pointers(file.indirect));
    }
    read('imap','释放 inode');disk.imap[ino]=false;disk.inode[ino]=null;write('imap','释放 inode');
    if(released.length){
      read('bmap','释放数据块');for(const b of released)disk.bmap[b]=false;
      write('bmap','释放数据块');
    }
  }
  let error='';
  try{
    if(cmd.op==='mkdir'||cmd.op==='touch')add(cmd.path,cmd.op==='mkdir'?'dir':'file');
    else{
      const hit=existing(cmd.path),{ino,file}=hit;
      if(cmd.op==='rm'||cmd.op==='rmdir')unlink(hit);
      else{
        if(file.kind!=='file')fail('操作需要普通文件');
        if(cmd.op==='ln')add(cmd.dest!,'file',ino);
        if(cmd.op==='read'){
          for(const b of file.direct)read('b'+b,'读取文件数据');
          if(file.indirect!==null){read('b'+file.indirect,'取得间接指针');for(const b of pointers(file.indirect))read('b'+b,'读取文件数据');}
        }
        if(cmd.op==='write'){
          const size=file.size+cmd.count!;
          if(size>p.direct+p.indirect)fail('追加后超过文件容量');
          if(file.indirect!==null)read('b'+file.indirect,'追加间接指针');
          read('bmap','检查追加需要的空闲块');
          const extra=Number(file.indirect===null&&size>p.direct);
          if(disk.bmap.filter(x=>!x).length<cmd.count!+extra)fail('空闲块不足');
          for(let offset=file.size;offset<size;offset++){
            if(offset===p.direct){file.indirect=alloc('bmap');disk.block[file.indirect]={kind:'indirect',pointers:[]};}
            const b=alloc('bmap');
            if(offset<p.direct)file.direct.push(b);
            else{pointers(file.indirect!).push(b);write('b'+file.indirect,'登记间接指针');}
            disk.block[b]={kind:'file',ino,offset};write('b'+b,'追加文件数据');
          }
          file.size=size;write('i'+ino,'保存大小和块指针');
        }
      }
    }
  }catch(e){if(!(e instanceof FsFailure))throw e;error=e.message;writes.clear();}
  const rank=(key:string)=>key==='imap'?-2:key==='bmap'?-1:(key[0]==='i'?p.blocks:0)+Number(key.slice(1));
  const io:IO[]=[...reads].map(([key,why])=>({key,write:false,text:'读 '+diskLabel(key)+'（'+why+'）'}));
  for(const [key,why] of [...writes].sort(([a],[b])=>rank(a)-rank(b)))
    io.push({key,write:true,text:'写 '+diskLabel(key)+'（'+why+'）'});
  return {io,result:error?before:disk,error};
}
function applyWrite(disk:Disk,result:Disk,key:string):Disk{
  if(key==='imap'||key==='bmap')return {...disk,[key]:result[key]};
  const n=Number(key.slice(1));
  if(key[0]==='i'){const inode=[...disk.inode];inode[n]=result.inode[n];return {...disk,inode};}
  const block=[...disk.block];block[n]=result.block[n];return {...disk,block};
}
export const fsMachine:Machine<FsParams,FsState>={
  init:p=>({p,disk:formatDisk(p),tape:null,next:0,ops:0,step:0,reads:0,writes:0,errors:0,list:[],active:[],reason:''}),
  atEnd:s=>s.ops>=s.p.commands.length,
  step(s,grain){
    const cmd=s.p.commands[s.ops],tape=s.tape??plan(s.p,s.disk,cmd);
    const stop=grain==='一个操作'?tape.io.length:s.next+1,end=stop===tape.io.length,active=tape.io.slice(s.next,stop);
    const disk=active.reduce((d,x)=>x.write?applyWrite(d,tape.result,x.key):d,s.disk);
    const writes=active.filter(x=>x.write).length,reason=end?tape.error:'';
    const text=cmd.op+' '+cmd.path+' · '+(active.length===1?active[0].text:active.length+' 次读写，最后'+active.at(-1)!.text)+(reason?'。失败，'+reason:'');
    const state={...s,disk,tape:end?null:tape,next:end?0:stop,ops:s.ops+Number(end),step:s.step+active.length,
      reads:s.reads+active.length-writes,writes:s.writes+writes,errors:s.errors+Number(!!reason),list:tape.io,active,reason};
    return {state,events:[{kind:reason?'warn':'info',text}],done:state.ops>=s.p.commands.length,previewCost:s.tape?active.length:tape.io.length};
  },
  edit(s,action){
    const commands=action as FsCommand[];
    if(s.tape||!commands.length||s.ops+commands.length>30)throw Error('只能在操作边界接着添加，合计最多 30 个');
    return {...s,p:{...s.p,commands:[...s.p.commands.slice(0,s.ops),...commands]},list:[],active:[],reason:''};
  },
  observe:s=>({step:s.step,ops:s.ops,reads:s.reads,writes:s.writes,inodes:s.disk.imap.filter(Boolean).length,
    blocks:s.disk.bmap.filter(Boolean).length,errors:s.errors,done:s.ops>=s.p.commands.length}),
};

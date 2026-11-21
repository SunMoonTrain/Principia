import { useMemo, useState } from 'react';
import type { AnimProps } from '@principia/anim';
import type { Controls } from './AlgorithmPlayer';
import { ScrollBox, mark } from './OsControls';
import { useMachine } from './kit/useMachine';
import { StepperBar } from './kit/StepperBar';
import { diskLabel, fsMachine, fsNames, fsGrains, parseFsOps, type Disk, type FsParams, type FsState, type Block } from './core/filesystem';

type Params=FsParams & Controls;
function contents(b:Block|null){
  if(!b)return '—';
  if(b.kind==='file')return '文件 i'+b.ino+' · 第 '+(b.offset+1)+' 块';
  if(b.kind==='indirect')return '间接 → '+b.pointers.join('，');
  return b.entries.map(e=>e?e.name+'→i'+e.ino:'□').join('　');
}
function Directory({disk}:{disk:Disk}) {
  const rows:{path:string;ino:number;dirBlock?:number}[]=[];
  function walk(path:string,ino:number,dirBlock?:number){
    rows.push({path,ino,dirBlock});
    const i=disk.inode[ino];if(i?.kind!=='dir')return;
    for(const b of i.direct){
      const d=disk.block[b];if(d?.kind!=='dir')continue;
      for(const e of d.entries)if(e&&e.name!=='.'&&e.name!=='..')walk((path==='/'?'':path)+'/'+e.name,e.ino,b);
    }
  }
  walk('/',0);return rows;
}
function DiskPanel({s}:{s:FsState}){
  const {disk,step}=s;
  const touch=(key:string)=>mark(s.active.some(x=>x.key===key&&x.write)?'write':s.active.some(x=>x.key===key)?'read':undefined);
  return <section className="os-panel"><div className="os-cols os-disk"><div><h4>分配位图</h4>
    {(['imap','bmap'] as const).map(key=><p key={key} {...touch(key)}>{diskLabel(key)}<br/><code style={{overflowWrap:'anywhere'}}>{disk[key].map(Number).join('')}</code></p>)}</div>
    <div><h4>inode 表</h4><ScrollBox step={step} label="inode 表"><table><thead><tr>{['号','类型','大小','链接','直接','间接'].map(v=><th key={v}>{v}</th>)}</tr></thead>
    <tbody>{disk.inode.map((n,i)=><tr key={i} {...touch('i'+i)}><th>{i}</th><td>{n?.kind==='file'?'文件':n?'目录':'空'}</td>
      <td>{n?.size??'—'}</td><td>{n?.links??'—'}</td><td>{n?.direct.join(',')||'—'}</td><td>{n?.indirect??'—'}</td></tr>)}</tbody></table></ScrollBox></div>
    <div><h4>数据块</h4><ScrollBox step={step} label="数据块"><table><tbody>{disk.block.map((b,i)=><tr key={i} {...touch('b'+i)}>
      <th>{i}</th><td>{disk.bmap[i]?contents(b):'空'}</td></tr>)}</tbody></table></ScrollBox></div>
    <div><h4>目录树</h4><ScrollBox step={step} label="目录树"><table><tbody>{Directory({disk}).map(row=><tr key={row.path} {...(row.dirBlock!==undefined&&s.active.some(x=>x.key==='b'+row.dirBlock&&x.write)?mark('write'):touch('i'+row.ino))}>
      <td>{row.path}</td><td>i{row.ino}</td></tr>)}</tbody></table></ScrollBox></div></div>
    <h4>操作读写清单</h4><ScrollBox step={step} label="读写清单"><table><tbody>{s.list.map((io,i)=><tr key={i}
      {...mark(s.active.includes(io)?io.write?'write':'read':undefined)}><th>{i+1}</th><td>{io.text}</td></tr>)}</tbody></table>
      {!s.list.length&&'等待执行'}</ScrollBox>{s.active.length>1&&<p>{[false,true].map(w=><span key={Number(w)} data-act={w?'write':'read'}>{w?' 写':' 读'}〔{s.active.filter(x=>x.write===w).map(x=>diskLabel(x.key)).join('，')||'无'}〕 </span>)}</p>}<p>完成 {s.ops} · 读 {s.reads} · 写 {s.writes} · 失败 {s.errors} · 已用 inode {disk.imap.filter(Boolean).length} · 块 {disk.bmap.filter(Boolean).length}</p>
  </section>;
}
const rate=(g?:string)=>g==='一个操作'?1:2;
const opFirst=[...fsGrains].reverse();
export default function Filesystem({params:p,labels}:AnimProps<Params>){
  const options=useMemo(()=>({names:fsNames,goals:p.goals,pauses:p.pauses,stepsPerSecond:rate,
    granularities:p.granularity==='op'?opFirst:fsGrains}),[p.goals,p.pauses,p.granularity]);
  const player=useMachine(fsMachine,p,0,options),s=player.history.state;
  const [draft,set]=useState(''),parsed=parseFsOps(draft),valid=!s.tape&&parsed.errors.length===0&&s.ops+parsed.commands.length<=30;
  return <StepperBar labels={labels} player={{...player,reset:()=>{set('');player.replaceInputs(p);}}} afterControls={p.editable&&<div className="os-editor">
    <label>接着执行 <textarea rows={2} maxLength={1800} value={draft} onChange={e=>set(e.target.value)}/></label>
    <button aria-disabled={!valid} onClick={()=>{if(valid){player.edit(parsed.commands);set('');}}}>从这里添加操作</button>
    {s.tape?<small>本操作结束后可添加。</small>:draft&&!valid&&<small role="status">{parsed.errors[0]?.message??'合计最多 30 个操作'}</small>}</div>}>
    <div className="os-stack"><DiskPanel s={s}/></div>
  </StepperBar>;
}

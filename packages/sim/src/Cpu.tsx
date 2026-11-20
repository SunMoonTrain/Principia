import { CacheTable } from './CacheTable';
import { CycleChart } from './CycleChart';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { AnimProps } from '@principia/anim';
import type { CpuParams } from './p8-schema';
import type { Condition } from './core/predicate';
import { assemble, breakpointAddress, disassemble, hex, inputByte, signed } from './core/p8-asm';
import { cpuNames, cachedCpuNames, p8Machine, type CpuState } from './core/p8';
import { StepperBar, touchKind } from './kit/StepperBar';
import { useMachine } from './kit/useMachine';
import { P8Editor, syntax, useAssembly } from './P8Editor';

type Params = CpuParams & { goals?:Condition[]; pauses?:Condition[] };
const phaseNames=['取指','译码','执行','写回'];
const micros=['微步','一条指令'], instructions=['一条指令','微步'];
const boundary=(s:CpuState)=>s.phase===0 && s.steps>0;
const rate=(grain?:string)=>grain==='微步'?4:2;
const ascii=(n:number)=>n===10?'换行':n>=32 && n<=126?String.fromCharCode(n):'—';

function MicroPanel({s,irTouch}:{s:CpuState;irTouch:ReturnType<typeof touchKind>}) {
  const f=s.frame, e=f?.effect, a=e?.alu, bus=e?.memory;
  const phase=f?(s.error?s.phase:(s.phase+3)%4):-1;
  return <section className="p8-micro"><header className="p8-micro-head"><h4>微步</h4>
    <span className="p8-legend"><span data-touch="read">读</span><span data-touch="write">写</span></span>
  </header><ol>{phaseNames.map((name,i)=><li aria-current={phase===i?'step':undefined} key={name}>{name}</li>)}</ol>
    <dl><div><dt>指令寄存器</dt><dd className="p8-ir" data-touch={irTouch}>{f?<><span title="操作码">{(f.first>>2).toString(2).padStart(6,'0')}</span><b title="寄存器 d">{(f.first&3).toString(2).padStart(2,'0')}</b><em title="第 2 字节">{f.second.toString(2).padStart(8,'0')}</em></>:'—'}</dd></div>
      <div><dt>译码</dt><dd>{f?.instruction?disassemble(f.first,f.second):'—'}</dd></div>
      <div><dt>ALU</dt><dd>{a?a.left+' '+a.operator+' '+a.right+' → '+a.result:e?.result!==undefined?'传送 '+e.result:e?.branch!==undefined?(e.branch?'跳转成立':'顺序执行'):'—'}</dd></div>
      <div><dt>数据访存</dt><dd>{bus?hex(bus.address)+(bus.write?' ← ':' → ')+hex(bus.value):'—'}</dd></div></dl>
  </section>;
}
function CpuSession({params,labels,load}:{params:Params;labels:AnimProps<Params>['labels'];load:(source:string,input:number[])=>void}) {
  const image=useMemo(()=>assemble(params.program,params.isa),[params.program,params.isa]);
  const boot=useMemo(()=>({image,input:params.input,isa:params.isa,cache:params.cache,fetch:params.fetch}),[image,params.input,params.isa,params.cache,params.fetch]);
  const [marks,setMarks]=useState(()=>new Set(params.breakpoints.map(m=>breakpointAddress(image,m)).filter((a):a is number=>a!==undefined)));
  const options=useMemo(()=>({names:params.cache?cachedCpuNames:cpuNames,goals:params.goals,pauses:params.pauses,stepsPerSecond:rate,boundary,
    granularities:params.granularity==='micro'?micros:instructions,
    breakpoint:(s:CpuState)=>boundary(s) && !s.halted && marks.has(s.pc)}),[marks,params.cache,params.goals,params.pauses,params.granularity]);
  const player=useMachine(p8Machine,boot,0,options), s=player.history.state;
  const [source,setSource]=useState(params.program), [input,setInput]=useState(params.input.join(', '));
  const draft=useAssembly(source,params.isa);
  const inputs=input.normalize('NFKC').trim()?input.normalize('NFKC').trim().split(/[\s,]+/).map(inputByte):[];
  const validInput=inputs.length<=256 && inputs.every((v):v is number=>v!==undefined);
  const [field,setField]=useState('R0'),[address,setAddress]=useState('0x00'),[raw,setRaw]=useState('0');
  const byte=inputByte(raw), addr=inputByte(address), locked=s.phase!==0;
  const at=s.phase && s.frame?s.frame.address:s.pc;
  const changed=(a:number)=>s.memory[a]!==image.bytes[a] || s.memory[(a+1)&255]!==image.bytes[(a+1)&255];
  const fmt=(a:number)=>disassemble(s.memory[a],s.memory[(a+1)&255]);
  const show=(view:CpuParams['view'][number])=>params.view.some(v=>v===view);
  const bits=['Z','N','C','V'];
  const touch = (key:string) => touchKind(player.history.events,key);
  const codePane = useRef<HTMLDivElement>(null);
  const editPanel = useRef<HTMLDetailsElement>(null);
  useLayoutEffect(() => {
    const pane = codePane.current;
    const row = pane?.querySelector('tr[aria-current="step"]');
    if (!pane || !row) return;
    const box = pane.getBoundingClientRect(), active = row.getBoundingClientRect();
    if (row === row.parentElement?.firstElementChild) pane.scrollTop = 0;
    else if (active.top < box.top) pane.scrollTop += active.top-box.top;
    else if (active.bottom > box.top+pane.clientHeight) pane.scrollTop += active.bottom-box.top-pane.clientHeight;
  }, [at,params.program]);

  const stackSize = 255-s.sp, recentCount = Math.min(stackSize,12);
  const stackCell = (a:number) => <li key={a} data-touch={touch('M'+a)}>{hex(a)}　{hex(s.memory[a])} {s.returns.includes(a)?'返回地址':''}</li>;
  const panels = <div className="p8-secondary">
    {s.cache && show('cache') && <details open><summary>缓存</summary><CacheTable title="处理器缓存" cache={s.cache}
      visits={(s.frame?.visits??[]).filter((_,i)=>touch('cache:'+i))}/><p>缓存记录标记和脏位。内存面板显示最新值，脏块换出才计写回费用。</p></details>}
    {s.chart && show('chart') && <details open><summary>每条指令的周期</summary><CycleChart bars={s.chart}/></details>}
    {show('memory') && <details open><summary>内存</summary><p>P 指令地址 · S 栈指针</p>
      <div className="p8-memory-scroll"><table className="p8-memory"><thead><tr><th></th>{s.memory.slice(0,16).map((_,j)=><th key={j}>{j.toString(16).toUpperCase()}</th>)}</tr></thead><tbody>
        {Array.from({length:16},(_,row)=><tr key={row}><th>{hex(row*16)}</th>{s.memory.slice(row*16,row*16+16).map((n,col)=>{
          const a=row*16+col, tag=(a===s.pc||a===((s.pc+1)&255)?'P':'')+(a===s.sp?'S':'');
          return <td key={a} data-area={a>s.sp?'stack':image.owners[a]?'program':undefined} data-touch={touch('M'+a)}>
            <button type="button" disabled={locked||!params.editable} aria-label={'内存 '+hex(a)} onClick={()=>{setField('memory');setAddress(hex(a));setRaw(hex(n)); if (editPanel.current) editPanel.current.open=true;}}>
              {hex(n).slice(2)}<sup>{tag}</sup></button></td>;
        })}</tr>)}</tbody></table></div></details>}
    {show('stack') && <details open={stackSize>0}><summary>栈 · {stackSize} 格{stackSize>0 && ' · 栈顶 '+hex(s.sp+1)}</summary>
      {stackSize===0 ? <p>空栈</p> : <>
        <ol className="p8-stack">{Array.from({length:recentCount},(_,i)=>stackCell(s.sp+recentCount-i))}</ol>
        {stackSize>recentCount && <details><summary>更早的 {stackSize-recentCount} 格</summary>
          <ol className="p8-stack">{Array.from({length:stackSize-recentCount},(_,i)=>stackCell(255-i))}</ol>
        </details>}
      </>}
    </details>}
    {show('output') && <details><summary>输入 / 输出 · 已输出 {s.output.length} 个{ s.output.length>0 && <span data-touch={touch('out:'+(s.output.length-1))}> · 最近 {s.output.at(-1)}</span>}</summary><p>输入队列　{params.input.length?params.input.map((v,i)=><span key={i} data-touch={touch('in:'+i)} aria-current={i===s.inputIndex?'step':undefined}>{i===s.inputIndex?'▸':''}{v} </span>):'空'}</p>
      <div className="p8-output"><table><thead><tr><th>输出</th><th>无符号</th><th>有符号</th><th>十六进制</th><th>字符</th></tr></thead><tbody>{s.output.map((n,i)=>
        <tr key={i} data-touch={touch('out:'+i)}><th>{i+1}</th><td>{n}</td><td>{signed(n)}</td><td>{hex(n)}</td><td>{ascii(n)}</td></tr>)}</tbody></table></div></details>}
    {params.editable && <details ref={editPanel}><summary>改状态</summary>{locked && <p>这条指令走完再改</p>}
      <fieldset disabled={locked}><div className="sim-controls"><select aria-label="修改位置" value={field} onChange={e=>setField(e.target.value)}>
        {['R0','R1','R2','R3','PC','SP',...bits,'memory'].map(k=><option key={k} value={k}>{k==='memory'?'内存':k}</option>)}</select>
        {field==='memory'&&<input aria-label="内存地址" value={address} onChange={e=>setAddress(e.target.value)}/>}
        <input aria-label="新的值" value={raw} onChange={e=>setRaw(e.target.value)}/>
        <button disabled={byte===undefined || (field==='memory' && addr===undefined) || (bits.includes(field) && byte!>1)}
          onClick={()=>player.edit({key:field,address:addr,value:byte},[field==='memory'?'M'+addr:field])}>应用修改</button></div>
        <details><summary>编辑程序和输入</summary><P8Editor value={source} change={setSource} error={draft.error} disabled={locked}/>
          {params.isa && <p>开放指令　{params.isa.join('、')}</p>}<label>输入队列 <input value={input} onChange={e=>setInput(e.target.value)}/></label>
          {!validInput && <p className="p8-error">输入最多 256 个字节，每个数须在 −128 到 255 之间。</p>}
          <button disabled={!draft.image||!validInput} onClick={()=>{if(validInput)load(source,inputs);}}>汇编并装入</button></details>
      </fieldset></details>}
  </div>;
  return <StepperBar player={player} labels={labels} afterControls={panels}><div className="p8">
    <div className="p8-overview">
    {show('code') && <section><h4>代码</h4>
      {!image.instructions.has(at) && <p>PC = {hex(at)} 不在任何一条指令的开头 · {fmt(at)}</p>}
      <div className="p8-code-scroll" ref={codePane}><table className="p8-code"><thead><tr><th>行 / 断点</th><th>地址</th><th>字节</th><th>汇编</th></tr></thead><tbody>
        {params.program.trimEnd().split('\n').map((line,i)=>{
          const a=image.lineAddresses.get(i+1), current=a!==undefined && at===a;
          return <tr key={i} aria-current={current?'step':undefined} className={current && s.error?'p8-bad-line':undefined}>
            <td>{a===undefined?i+1:<button aria-label={'第 '+(i+1)+' 行断点'} aria-pressed={marks.has(a)} onClick={()=>setMarks(prev=>{
              const next=new Set(prev); if(next.has(a))next.delete(a);else next.add(a); return next;
            })}>{marks.has(a)?'●':'○'} {i+1}</button>}</td><td>{a===undefined?'':hex(a)}</td>
            <td>{a===undefined?'':hex(s.memory[a]).slice(2)+' '+hex(s.memory[(a+1)&255]).slice(2)}</td><td><code>{syntax(line)}</code>
              {a!==undefined && changed(a) && <small>内存里已改成 {fmt(a)}</small>}</td></tr>;
        })}</tbody></table></div>{s.error && <p role="alert" className="p8-error">{s.error}</p>}
    </section>}
    <div className="p8-summary">
      {show('registers') && <section><h4>寄存器</h4><table><thead><tr><th>寄存器</th><th>十六进制</th><th>无符号</th><th>有符号</th></tr></thead><tbody>
        {s.registers.map((n,i)=><tr key={i} data-touch={touch('R'+i)}><th>R{i}</th><td>{hex(n)}</td><td>{n}</td><td>{signed(n)}</td></tr>)}</tbody></table><p><span data-touch={touch('PC')}>PC {hex(s.pc)}</span>　 <span data-touch={touch('SP')}>SP {hex(s.sp)}</span></p></section>}
      {show('flags') && <section><h4>标志</h4><dl className="p8-flags">{Object.entries(s.flags).map(([k,v])=><div key={k} data-touch={touch(k)}><dt>{k}</dt><dd>{v}</dd></div>)}</dl></section>}
      {show('cycles') && <section><h4>周期</h4><dl><div data-touch={touch('cycles')}><dt>总周期</dt><dd>{s.cycles}</dd></div><div data-touch={touch('steps')}><dt>已完成指令</dt><dd>{s.steps}</dd></div><div data-touch={touch('lastCycles')}><dt>上一条周期</dt><dd>{s.lastCycles}</dd></div></dl></section>}
    </div>
    </div>
    <MicroPanel s={s} irTouch={touch('IR')}/>
  </div></StepperBar>;
}
export default function Cpu({params,labels}:AnimProps<Params>) {
  const [loaded,setLoaded]=useState({source:params.program,input:params.input,generation:0});
  const active=useMemo(()=>({...params,program:loaded.source,input:loaded.input}),[params,loaded]);
  return <CpuSession key={loaded.generation} params={active} labels={labels}
    load={(source,input)=>setLoaded(p=>({source,input,generation:p.generation+1}))}/>;
}

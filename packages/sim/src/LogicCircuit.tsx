import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { AnimProps } from '@principia/anim';
import { circuitMachine, truthTable, type CircuitState } from './core/circuit';
import { compileCircuit, type Circuit, type Level, type Netlist } from './core/netlist';
import type { Condition } from './core/predicate';
import { layoutCircuit, pinPoint, type DiagramNode } from './circuit-layout';
import { StepperBar } from './kit/StepperBar';
import { useMachine } from './kit/useMachine';
import './logic-circuit.css';

type Params = Netlist & { goals?: Condition[]; pauses?: Condition[] };
type Edit = (inputs: Record<string, Level>) => void;
const titles: Record<string,string> = { and: '与', or: '或', xor: '异或', nand: '与非', nor: '或非', xnor: '同或', not: '非', buffer: '缓冲', dff: 'D 触发器' };

function Switch({ name, value, edit }: { name: string; value: Level; edit: Edit }) {
  return <button className="logic-switch" aria-label={'输入 ' + name} aria-pressed={!!value}
    onClick={() => edit({ [name]: value ? 0 : 1 })}><span>{name}</span><b>{value}</b></button>;
}
function Diagram({ params, s, edit }: { params: Params; s: CircuitState; edit: Edit }) {
  const layout = useMemo(() => layoutCircuit(params), [params]);
  const read = (key: string) => s.values[s.net.signals.get(key)!];
  const changed = new Set(s.changed);
  function node(n: DiagramNode) {
    const { x, y, w, h } = n, device = n.kind === 'module' || n.kind === 'gate';
    const labeledPins = n.kind === 'module' || n.type === 'dff';
    const active = device && n.outs.some(pin => changed.has(s.net.signals.get(pin.signal)!));
    return <g key={n.key} data-node={n.key} data-changed={active || undefined}>
      <rect className="logic-box" x={x} y={y} width={w} height={h} rx={device ? 5 : 10}/>
      {n.kind === 'input' ? <foreignObject x={x+1} y={y+1} width={w-2} height={h-2}>
        <Switch name={n.name} value={read(n.name)} edit={edit}/></foreignObject>
        : device ? <g className="logic-label" textAnchor="middle"><text x={x+w/2} y={y+(labeledPins ? 15 : h/2-2)}>{n.name}</text>
          <text className="logic-secondary" x={x+w/2} y={y+(labeledPins ? 29 : h/2+14)}>{n.kind === 'module' ? n.type : titles[n.type]}</text></g>
        : <g className="logic-label"><circle className="logic-level" data-level={read(n.name)} cx={x+13} cy={y+h/2} r="6"/>
          <text x={x+25} y={y+h/2+4}>{n.name}　{read(n.name)}</text></g>}
      {[false, true].map(out => (out ? n.outs : n.ins).map((pin,i) => {
        const pt = pinPoint(n,i,out);
        return <g key={String(out)+i}><circle className="logic-level" data-level={read(pin.signal)} data-pin={(out?'out:':'in:')+i}
          cx={pt.x} cy={pt.y} r="3.3"><title>{pin.signal} = {read(pin.signal)}</title></circle>
          {labeledPins && pin.name && <text className="logic-pin-name" textAnchor={out?'end':'start'}
            x={pt.x+(out?-7:7)} y={pt.y+4}>{pin.name}</text>}</g>;
      }))}
    </g>;
  }
  return <div className="logic-scroll" aria-label="电路图"><svg role="group" aria-label="开关、逻辑门与输出灯"
    width={layout.width} height={layout.height} viewBox={'0 0 '+layout.width+' '+layout.height}>
    {layout.wires.map(w => {
      const value = read(w.signal), end = pinPoint(w.to.node,w.to.pin,false);
      return <g key={w.to.node.key+':'+w.to.pin} className="logic-wire" data-level={value}>
        <path d={w.path} data-source={w.from.node.key} data-source-pin={w.from.pin} data-target={w.to.node.key} data-target-pin={w.to.pin}/>
        <text x={end.x-7} y={end.y-4} textAnchor="end">{value}</text><title>{w.signal} → {w.to.node.name}，值 {value}</title>
      </g>;
    })}
    {layout.nodes.map(node)}
  </svg></div>;
}

function Truth({ net, s, edit }: { net: Circuit; s: CircuitState; edit: Edit }) {
  const rows = useMemo(() => truthTable(net), [net]);
  return <div className="logic-table-wrap"><table className="logic-table"><caption>真值表 · 点行切换输入</caption>
    <thead><tr><th>输入组合</th>{[...net.inputs,...net.outputs].map((name,i) => <th key={i} scope="col">{name}</th>)}</tr></thead>
    <tbody>{rows.map(({ inputs, outputs },i) => {
      const current = inputs.every((v,j) => v === s.values[j]);
      return <tr key={i} aria-current={current || undefined} onClick={() => edit(Object.fromEntries(net.inputs.map((k,j) => [k,inputs[j]])))}>
        <th scope="row"><button aria-label={'选择输入 '+inputs.join('')} aria-pressed={current}>{current?'●':'○'} {inputs.join('') || '∅'}</button></th>
        {[...inputs,...outputs].map((v,j) => <td key={j}>{v}</td>)}</tr>;
    })}</tbody></table></div>;
}
function Timing({ s }: { s: CircuitState }) {
  const { waves, signals } = s.net, frames = s.trace;
  const box = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(640);
  useLayoutEffect(() => {
    const el = box.current!;
    const measure = () => setAvailable(el.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const left = Math.max(50, ...waves.map(n => n.length * 8 + 16));
  const width = Math.max(available, left + frames.length * 4 + 16);
  const pitch = Math.min(48, (width - left - 16) / frames.length);
  const spacing = pitch >= 30 ? 1 : pitch >= 8 ? 4 : 8;
  const bottom = waves.length*24+10;
  return <figure className="logic-timing"><figcaption>时序图 · 第 {frames[0].tick}～{s.tick} 拍</figcaption>
    <div ref={box} className="logic-scroll"><svg width={width} height={bottom+25} viewBox={'0 0 '+width+' '+(bottom+25)} role="img" aria-label="最近 64 拍的数字信号">
      {frames.map((f,i) => (i === 0 || i === frames.length-1 || (f.tick % spacing === 0 && Math.min(i, frames.length - 1 - i) * pitch >= 28)) &&
        <g key={f.tick}><path className="logic-grid" d={'M'+(left+i*pitch)+' 5V'+bottom}/>
          <text className="logic-axis" x={left+i*pitch} y={bottom+15} textAnchor="middle">{f.tick}</text></g>)}
      {waves.map((name,row) => {
        const slot = signals.get(name)!, base = 23+row*24;
        const path = frames.map((f,i) => (i?'V':'M'+left+' ')+(base-f.values[slot]*11)+'H'+(left+(i+1)*pitch)).join('');
        return <g key={name} data-wave={name}><text className="logic-label" x={left-9} y={base-1} textAnchor="end">{name}</text>
          <path className="logic-wave" d={path}/><title>{name}：{frames.map(f => f.values[slot]).join('')}</title></g>;
      })}
    </svg></div></figure>;
}
export default function LogicCircuit({ params, labels }: AnimProps<Params>) {
  const net = useMemo(() => compileCircuit(params), [params]);
  const options = useMemo(() => ({ names: [...net.observed,'tick','stable','osc'], goals: params.goals, pauses: params.pauses,
    stepsPerSecond: 2, granularities: net.every ? ['每拍','半个周期'] : ['每拍','到稳定'] }), [net, params.goals, params.pauses]);
  const player = useMachine(circuitMachine, net, 0, options), s = player.history.state;
  const show = params.show ?? ['circuit'];
  return <StepperBar player={player} labels={labels}>
    <div className="logic-status"><strong>第 {s.tick} 拍</strong>
      <span>{net.every ? '时钟每 '+net.every+' 拍翻转' : s.period ? '没有稳定，每 '+s.period+' 拍重复一次' :
        s.stableAt === null ? '还没稳定' : '拨动以后第 '+s.stableAt+' 拍稳定'}</span>
      <span>{net.longest === null ? '有反馈，不算最长路径' : '最长路径 '+net.longest+' 个门'}</span></div>
    {show.includes('circuit') ? <Diagram params={params} s={s} edit={player.edit}/> :
      <div className="sim-controls">{net.inputs.map((n,i) => <Switch key={n} name={n} value={s.values[i]} edit={player.edit}/>)}</div>}
    {show.includes('truth-table') && <Truth net={net} s={s} edit={player.edit}/>}
    {show.includes('timing') && <Timing s={s}/>}
  </StepperBar>;
}

import { useMemo, useState } from 'react';
import type { AnimProps } from '@principia/anim';
import { characterLabel } from './core/utf';
import { BitRow } from './BitRow';
import { bitNames, bitsMachine, signed, unsigned } from './core/bits';
import type { BitsDisplay } from './specs';
import type { Condition } from './core/predicate';
import { StepperBar } from './kit/StepperBar';
import { useMachine } from './kit/useMachine';

type Params = BitsDisplay & { goals?: Condition[]; pauses?: Condition[] };
type Props = AnimProps<Params>;

function Wheel({ value, width }: { value: number; width: number }) {
  const size = 2 ** width;
  const position = (n: number, r: number) => {
    const angle = n / size * 2 * Math.PI;
    return { x: 100 + r * Math.sin(angle), y: 86 - r * Math.cos(angle) };
  };
  const dot = position(value, 61);
  return <svg className="sim-wheel" viewBox="0 0 200 182" role="img" aria-label={size + ' 个刻度的补码数轮'}>
    <circle cx="100" cy="86" r="61" fill="none" stroke="currentColor" opacity=".4"/>
    {Array.from({ length: size }, (_, i) => {
      const a = position(i, 57), b = position(i, i % (size / 4) ? 64 : 68);
      return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="currentColor" />;
    })}
    {[0, size / 2].map((i) => {
      const a = position(i - 0.5, 51), b = position(i - 0.5, 72);
      return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={i ? 'var(--warn)' : 'var(--accent)'} strokeWidth="3"/>;
    })}
    <circle cx={dot.x} cy={dot.y} r="4" fill="var(--good)" />
    <g textAnchor="middle" fill="currentColor" fontSize="11">
      <text x="100" y="10">无符号回绕 {size - 1} → 0</text>
      <text x="100" y="83">无符号 {value}</text><text x="100" y="101">有符号 {signed(value, width)}</text>
      <text x="100" y="170">有符号断点 {size / 2 - 1} → −{size / 2}</text>
    </g>
  </svg>;
}
function Readings({ value, width, show }: { value: number; width: number; show: BitsDisplay['show'] }) {
  const scalar = value <= 0x10ffff && !(value >= 0xd800 && value <= 0xdfff);
  const readings = { unsigned: ['无符号', value], signed: ['有符号', signed(value, width)],
    hex: ['十六进制', '0x' + value.toString(16).toUpperCase().padStart(Math.ceil(width / 4), '0')],
    octal: ['八进制', '0o' + value.toString(8)], char: ['字符', scalar ? 'U+' + value.toString(16).toUpperCase().padStart(4, '0') + ' ' + characterLabel(String.fromCodePoint(value)) : '无对应字符'] };
  return <><dl className="sim-values">{show.filter((key) => key !== 'wheel').map((key) =>
    <div key={key}><dt>{readings[key][0]}</dt><dd>{readings[key][1]}</dd></div>)}</dl>
    {show.includes('wheel') && <Wheel width={width} value={value}/>}</>;
}
function BitSteps({ params, labels }: Props) {
  const options = useMemo(() => ({ names: bitNames, stepsPerSecond: 2, goals: params.goals, pauses: params.pauses }), [params]);
  const player = useMachine(bitsMachine, params, 0, options);
  const { state: s, events } = player.history;
  const activeKey = events[0]?.touched?.find((key) => key.startsWith('bit'));
  const active = activeKey ? Number(activeKey.slice(3)) : undefined;
  const arithmetic = s.op?.kind === 'add' || s.op?.kind === 'sub';
  const flip = (operand: 'a' | 'b') => params.editable === false ? undefined : (index: number) => {
    player.seek(0); player.edit({ operand, index });
  };
  return <StepperBar player={player} labels={labels}>
    <div className={arithmetic ? 'sim-adder' : undefined}>
      <BitRow label="a" value={s.a} width={s.width} active={active} toggle={flip('a')}/>
      {s.op && 'b' in s.op && <BitRow label="b" value={s.b} width={s.width} active={active} toggle={flip('b')}/>}
      {s.op?.kind === 'sub' && s.step > 0 && <BitRow label="~b" value={unsigned(~s.b, s.width)} width={s.width} active={active}/>}
      {arithmetic && <BitRow label="进位" value={s.carries} width={s.width} active={active}/>}
      <BitRow label="结果" value={s.result} width={s.resultWidth} active={active}/>
    </div>
    {arithmetic && <small>最高位进位出 {s.carries[s.width] ?? '待定'}</small>}
    <Readings value={s.result} width={s.resultWidth} show={params.show}/>
    <dl className="sim-values">{(['CF', 'OF', 'ZF', 'SF'] as const).map((flag) =>
      <div key={flag}><dt>{flag}</dt><dd>{s.step && !player.history.done ? '待定' : s[flag]}</dd></div>)}</dl>
  </StepperBar>;
}
function BitInspect({ params }: Props) {
  const [value, setValue] = useState(unsigned(params.value, params.width));
  return <div className="sim-player"><BitRow label="a" value={value} width={params.width}
    toggle={params.editable === false ? undefined : (i) => setValue((n) => (n ^ 2 ** i) >>> 0)}/>
    <Readings value={value} width={params.width} show={params.show}/></div>;
}
export default function Bits(props: Props) {
  return props.params.op ? <BitSteps {...props}/> : <BitInspect {...props}/>;
}

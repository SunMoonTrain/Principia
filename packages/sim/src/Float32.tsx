import { useEffect, useMemo, useState } from 'react';
import { useCanvas, useTheme } from '@principia/anim/kit';
import type { AnimProps } from '@principia/anim';
import { BitRow } from './BitRow';
import { accumulationPlot, alignment, binarySum, exactDecimal, floatMachine, floatNames, fromBits, hex32, inspect, neighbor, type AccParams } from './core/float32';
import type { Condition } from './core/predicate';
import { StepperBar, touchKind } from './kit/StepperBar';
import { useMachine } from './kit/useMachine';
import type { FloatDisplay } from './specs';

type Params = FloatDisplay & { goals?: Condition[]; pauses?: Condition[] };
function FloatRow({ bits, toggle }: { bits: number; toggle?: (i: number) => void }) {
  return <div className="sim-float-fields"><BitRow label="符号" value={bits} width={1} offset={31} toggle={toggle}/>
    <BitRow label="阶码" value={bits} width={8} offset={23} toggle={toggle}/>
    <BitRow label="尾数" value={bits} width={23} toggle={toggle}/></div>;
}
function NumberLine({ bits }: { bits: number }) {
  const [zoom, setZoom] = useState(0);
  const { value, ulp } = inspect(bits);
  if (!Number.isFinite(value)) return <p>数轴只标有限数。</p>;
  const radius = ulp * 4 * 2 ** zoom;
  const ticks = [{ bits, x: 200 }];
  for (const dir of [-1, 1] as const) {
    let prev = bits;
    for (;;) {
      const n = neighbor(prev, dir), offset = (fromBits(n) - value) / radius;
      if (n === prev || !Number.isFinite(offset) || Math.abs(offset) > 1) break;
      ticks.push({ bits: n, x: 200 + 185 * offset });
      prev = n;
    }
  }
  return <div><svg className="sim-axis" viewBox="0 0 400 42" role="img" aria-label="附近能表示的单精度数，每条刻度代表一个数">
    <path d="M12 18H388" stroke="currentColor"/>
    {ticks.map((t) => <line key={t.bits} x1={t.x} x2={t.x} y1={t.bits === bits ? 5 : 12} y2="24"
      stroke={t.bits === bits ? 'var(--accent)' : 'currentColor'}><title>{exactDecimal(t.bits)}</title></line>)}
    <text x="200" y="39" textAnchor="middle" fill="currentColor" fontSize="11">{hex32(bits)}</text>
  </svg><div className="sim-controls"><button disabled={zoom === -3} onClick={() => setZoom(zoom - 1)}>放大 2 倍</button>
    <button disabled={zoom === 3} onClick={() => setZoom(zoom + 1)}>缩小 2 倍</button><small>半轴宽 {4 * 2 ** zoom} ULP</small></div></div>;
}
function Inspect({ params }: { params: Extract<Params, { mode: 'inspect' }> }) {
  const [bits, setBits] = useState(params.bits);
  const f = inspect(bits), finite = f.field !== 255;
  const fraction = f.fraction.toString(2).padStart(23, '0');
  return <div className="sim-player"><FloatRow bits={bits} toggle={(i) => setBits((n) => (n ^ 2 ** i) >>> 0)}/>
    <dl className="sim-values">
      <div><dt>位型</dt><dd>{hex32(bits)}</dd></div><div><dt>阶码字段</dt><dd>{f.field}</dd></div>
      <div><dt>有效指数</dt><dd>{finite ? f.exponent : '特殊值'}</dd></div>
      <div><dt>隐含位</dt><dd>{finite ? Number(f.field !== 0) : '—'}</dd></div>
      <div><dt>ULP</dt><dd>{finite ? '2^(' + (f.exponent - 23) + ')' : '—'}</dd></div>
    </dl><dl className="sim-details">
      <dt>值的式子</dt><dd>{finite ? '(−1)^' + f.sign + ' × (' + Number(f.field !== 0) + '.' + fraction + ')₂ × 2^(' + f.exponent + ')' : f.exact}</dd>
      <dt>精确十进制</dt><dd>{f.exact}</dd>
      <dt>前一个数</dt><dd>{Number.isNaN(f.value) || f.previous === bits ? '—' : exactDecimal(f.previous)}</dd>
      <dt>后一个数</dt><dd>{Number.isNaN(f.value) || f.next === bits ? '—' : exactDecimal(f.next)}</dd>
      {params.compare64 && <><dt>双精度输入</dt><dd>{String(params.value ?? f.value)}</dd></>}
    </dl><NumberLine bits={bits}/></div>;
}
function SumPlot({ params, step }: { params: AccParams; step: number }) {
  const { box, canvas, size, context } = useCanvas(.5, 145);
  const theme = useTheme();
  const values = useMemo(() => accumulationPlot(params), [params]);
  useEffect(() => {
    const ctx = context();
    if (!ctx) return;
    const { width: w, height: h } = size;
    const finite = values.flatMap(({ single, exact }) => [single, exact]).filter(Number.isFinite);
    const low = Math.min(...finite), high = Math.max(...finite);
    const x = (i: number) => 14 + (w - 32) * i / params.count;
    const y = (v: number) => low === high ? h / 2 : 14 + (high - v) / (high - low) * (h - 38);
    ctx.clearRect(0, 0, w, h);
    ctx.setLineDash([]); ctx.lineWidth = 1; ctx.strokeStyle = theme.border;
    ctx.strokeRect(14, 14, w - 32, h - 38);
    for (const reference of [false, true]) {
      ctx.beginPath(); ctx.strokeStyle = theme.series[reference ? 0 : 2];
      ctx.lineWidth = reference ? 2 : 4; ctx.setLineDash(reference ? [5, 4] : []);
      for (let i = 0; i <= step; i++) {
        const v = reference ? values[i].exact : values[i].single;
        if (!Number.isFinite(v)) break;
        if (i) ctx.lineTo(x(i), y(v)); else ctx.moveTo(x(i), y(v));
      }
      ctx.stroke();
    }
    ctx.fillStyle = theme.text;
    ctx.fillText('0', 10, h - 6); ctx.fillText('步数 ' + params.count, w - 65, h - 6);
    ctx.fillText(String(high), 17, 10);
    if (high !== low) ctx.fillText(String(low), 17, h - 28);
  }, [context, size, theme, params, values, step]);
  return <figure className="sim-plot"><figcaption>相对单精度起点的变化 · <span>单精度实线</span> / 精确值虚线</figcaption>
    <div ref={box}><canvas ref={canvas} style={{ height: size.height }} aria-label="单精度和精确累加和曲线，当前值见上方读数"/></div></figure>;
}
function AddWork({ a, b, total, step }: { a: number; b: number; total: bigint; step: number }) {
  const aligned = alignment(a, b), sum = binarySum(total);
  return <dl className="sim-details sim-add-work">
    {[a, b].map((bits, i) => {
      const f = inspect(bits);
      return <div key={i}><dt>加数 {i ? 'b' : 'a'}</dt><dd>{f.sign ? '−' : '+'}{Number(f.field !== 0)}.{f.fraction.toString(2).padStart(23, '0')}₂ × 2<sup>{f.exponent}</sup></dd></div>;
    })}
    {step >= 2 && <div><dt>对齐后的 {aligned.operand}</dt><dd>{aligned.sign ? '−' : '+'}{aligned.mantissa}₂ × 2<sup>{aligned.exponent}</sup>
      <span className="sim-grs">保护位 G={aligned.guard} · 舍入位 R={aligned.round} · 粘滞位 S={aligned.sticky}</span></dd></div>}
    {step >= 3 && <div><dt>精确和（二进制）</dt><dd>{sum.main}<em title="超出 24 位精度的低位">{sum.low}</em>₂ × 2<sup>{sum.exponent}</sup>
      {sum.low && <small>　着色部分为舍入前的低位</small>}</dd></div>}
  </dl>;
}

function FloatPlayer({ params, labels }: AnimProps<Exclude<Params, { mode: 'inspect' }>>) {
  const options = useMemo(() => ({ names: floatNames, stepsPerSecond: 1, goals: params.goals, pauses: params.pauses }), [params]);
  const player = useMachine(floatMachine, params, 0, options), s = player.history.state;
  return <StepperBar player={player} labels={labels}>
    <p className="sim-stage" data-touch={touchKind(player.history.events, 'stage')}>{params.mode === 'add' ?
      (['准备', '拆开', '对齐', '相加或相减', '规格化', '舍入', '装回'][s.step]) + ' · ' + params.a + ' + ' + params.b :
      '从 ' + (params.start ?? 0) + ' 开始，每次加 ' + params.delta}</p>
    {params.mode === 'add' && s.step >= 1 && s.step <= 5 ? <AddWork a={s.a} b={s.b} total={s.total} step={s.step}/> : <FloatRow bits={s.bits}/>}
    <dl className="sim-details"><dt>单精度寄存器</dt><dd data-touch={touchKind(player.history.events, 'bits')}>{hex32(s.bits)} · {exactDecimal(s.bits)}</dd>
      <dt>精确和</dt><dd>{params.mode === 'add' && s.step < 3 ? '待相加' : s.exact}</dd>
      {params.compare64 && <><dt>双精度</dt><dd>{s.double}</dd></>}
      {(params.mode === 'accumulate' || s.step >= 5) && <><dt>绝对误差</dt><dd>{s.error}</dd></>}
    </dl>{params.mode === 'accumulate' && <SumPlot params={params} step={s.step}/>}
  </StepperBar>;
}
export default function Float32({ params, labels }: AnimProps<Params>) {
  return params.mode === 'inspect' ? <Inspect params={params}/> : <FloatPlayer params={params} labels={labels}/>;
}

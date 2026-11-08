// Oscillator：一串物块排在两堵墙之间，用弹簧连起来；上面画物块和弹簧，下面画每个物块的位移随时间变化的曲线。
// 写法见 docs/plan.md「附录：动画组件参数」。改了滑块，振子从初始位移重新开始。

import { useCallback, useEffect, useMemo } from 'react';
import { compileExpr, type CompiledExpr } from './expr';
import {
  AnimError,
  ControlBar,
  drawAxes,
  formatNumber,
  Legend,
  SliderPanel,
  useAnimationFrame,
  useCanvas,
  useInView,
  usePlayback,
  useSliders,
  useTheme,
  Viewport,
  type AnimProps,
  type Theme,
} from './kit';
import { RK4, StepClock, type Derivative } from './ode';
import type { OscillatorParams, SliderSpec } from './specs';

/** 曲线图显示最近多少秒（模拟时间）：要看得出拍的包络。 */
const WINDOW = 20;
/** 曲线图里每个物块最多存多少个点。 */
const MAX_SAMPLES = 2000;
/** 上面画物块的那一条有多高（像素）。 */
const MECH_HEIGHT = 96;

interface Compiled {
  masses: CompiledExpr[];
  springs: CompiledExpr[];
  damping: CompiledExpr;
  initial: CompiledExpr[];
}

/** 按当前滑块算出来的数值。 */
interface Values {
  m: number[];
  k: number[];
  c: number;
  x0: number[];
}

export function compile(p: OscillatorParams): Compiled | string {
  const names = (p.sliders ?? []).map((s) => s.name);
  try {
    return {
      masses: p.masses.map((m) => compileExpr(m, names)),
      springs: p.springs.map((k) => compileExpr(k, names)),
      damping: compileExpr(p.damping ?? 0, names),
      initial: p.initial.map((x) => compileExpr(x, names)),
    };
  } catch (e) {
    return e instanceof Error ? e.message : String(e);
  }
}

/**
 * 画物块和曲线图用的参考振幅：滑块都取默认值、以及每个滑块单独取最小值和最大值时，初始位移绝对值的最大者。
 * 不直接用当前的初始位移：拖控制振幅的滑块时，要看得出振幅变了。
 */
export function referenceAmplitude(c: Compiled, sliders: SliderSpec[]): number {
  const base = sliders.map((s) => s.default);
  const trials = [base, ...sliders.flatMap((s, i) => [s.min, s.max].map((v) => base.map((b, j) => (j === i ? v : b))))];
  let max = 0;
  for (const values of trials) {
    const vars = Float64Array.from(values);
    for (const f of c.initial) {
      const x = Math.abs(f(vars));
      if (Number.isFinite(x)) max = Math.max(max, x);
    }
  }
  return max || 1;
}

/** 式子里用了滑块，算出来的值可能不合理（质量不是正数等），这时不动，显示原因。 */
function evaluate(c: Compiled, sliders: Float64Array): Values | string {
  const m = c.masses.map((f) => f(sliders));
  const k = c.springs.map((f) => f(sliders));
  const damping = c.damping(sliders);
  const x0 = c.initial.map((f) => f(sliders));
  const badMass = m.findIndex((v) => !(v > 0) || !Number.isFinite(v));
  if (badMass >= 0) return `第 ${badMass + 1} 个物块的质量是 ${formatNumber(m[badMass])}，必须大于 0`;
  const badSpring = k.findIndex((v) => !(v >= 0) || !Number.isFinite(v));
  if (badSpring >= 0) return `第 ${badSpring + 1} 根弹簧的劲度系数是 ${formatNumber(k[badSpring])}，不能是负数`;
  if (!(damping >= 0) || !Number.isFinite(damping)) return `阻尼系数是 ${formatNumber(damping)}，不能是负数`;
  const badStart = x0.findIndex((v) => !Number.isFinite(v));
  if (badStart >= 0) return `第 ${badStart + 1} 个物块的初始位移无定义`;
  return { m, k, c: damping, x0 };
}

class OscSim {
  t = 0;
  values: Values | null = null;
  readonly n: number;
  readonly clock: StepClock;
  /** 曲线图的历史：时间和每个物块的位移，环形缓冲区。 */
  readonly times: Float64Array;
  readonly xs: Float64Array;
  samples = 0;
  head = 0;
  /** 跑到现在位移的最大绝对值，曲线图的纵轴跟着放大。 */
  peak = 0;
  readonly y: Float64Array;
  private readonly stride: number;
  private steps = 0;
  private readonly solver: RK4;
  private readonly derivative: Derivative;

  constructor(n: number, readonly dt: number) {
    this.n = n;
    this.y = new Float64Array(2 * n);
    this.solver = new RK4(2 * n);
    this.clock = new StepClock(dt);
    this.stride = Math.max(1, Math.ceil(WINDOW / dt / MAX_SAMPLES));
    const capacity = Math.ceil(WINDOW / (dt * this.stride)) + 2;
    this.times = new Float64Array(capacity);
    this.xs = new Float64Array(capacity * n);
    // y = [x_1 … x_N, v_1 … v_N]；第 i 个物块受左右两根弹簧和阻尼的力，两端的墙位移为 0
    this.derivative = (_t, y, out) => {
      const v = this.values!;
      for (let i = 0; i < n; i++) {
        const x = y[i];
        const left = i === 0 ? 0 : y[i - 1];
        const right = i === n - 1 ? 0 : y[i + 1];
        const force = -v.k[i] * (x - left) + v.k[i + 1] * (right - x) - v.c * y[n + i];
        out[i] = y[n + i];
        out[n + i] = force / v.m[i];
      }
    };
  }

  get capacity(): number {
    return this.times.length;
  }

  configure(values: Values | null): void {
    this.values = values;
    this.restart();
  }

  restart(): void {
    this.t = 0;
    this.steps = 0;
    this.clock.reset();
    this.samples = 0;
    this.head = 0;
    this.y.fill(0);
    if (this.values) this.y.set(this.values.x0);
    this.peak = this.values ? Math.max(...this.values.x0.map(Math.abs)) : 0;
    this.record();
  }

  advance(steps: number): void {
    if (!this.values) return;
    for (let s = 0; s < steps; s++) {
      this.solver.step(this.derivative, this.t, this.y, this.dt);
      this.t += this.dt;
      if (++this.steps % this.stride === 0) this.record();
    }
  }

  private record(): void {
    this.times[this.head] = this.t;
    for (let i = 0; i < this.n; i++) {
      this.xs[this.head * this.n + i] = this.y[i];
      this.peak = Math.max(this.peak, Math.abs(this.y[i]));
    }
    this.head = (this.head + 1) % this.capacity;
    this.samples = Math.min(this.capacity, this.samples + 1);
  }
}

/** 一根弹簧：两端各留一小段直线，中间画锯齿。 */
function spring(ctx: CanvasRenderingContext2D, x1: number, x2: number, y: number): void {
  const length = x2 - x1;
  ctx.moveTo(x1, y);
  if (length <= 6) {
    ctx.lineTo(x2, y);
    return;
  }
  const lead = Math.min(8, length * 0.15);
  const a = x1 + lead;
  const b = x2 - lead;
  const teeth = 16;
  const amplitude = 6;
  ctx.lineTo(a, y);
  for (let s = 1; s < teeth; s++) ctx.lineTo(a + ((b - a) * s) / teeth, y + (s % 2 ? -amplitude : amplitude));
  ctx.lineTo(b, y);
  ctx.lineTo(x2, y);
}

function wall(ctx: CanvasRenderingContext2D, x: number, top: number, bottom: number, side: -1 | 1): void {
  ctx.moveTo(x, top);
  ctx.lineTo(x, bottom);
  for (let y = top + 4; y <= bottom; y += 8) {
    ctx.moveTo(x, y);
    ctx.lineTo(x + side * 7, y - 7);
  }
}

function drawMechanism(ctx: CanvasRenderingContext2D, width: number, theme: Theme, sim: OscSim, amplitude: number): void {
  const v = sim.values!;
  const n = sim.n;
  const left = 22;
  const right = width - 22;
  const floor = MECH_HEIGHT - 18;
  const gap = (right - left) / (n + 1);
  const bw = Math.min(46, gap * 0.5);
  const bh = Math.min(36, bw * 0.85);
  // 参考振幅对应偏离平衡位置 0.3 个间距
  const scale = (gap * 0.3) / amplitude;
  const centers = Array.from({ length: n }, (_, i) => left + (i + 1) * gap + sim.y[i] * scale);
  const springY = floor - bh / 2;

  ctx.strokeStyle = theme.border;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(left, floor + 0.5);
  ctx.lineTo(right, floor + 0.5);
  ctx.stroke();
  // 平衡位置的小刻度
  ctx.strokeStyle = theme.muted;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const x = Math.round(left + (i + 1) * gap) + 0.5;
    ctx.moveTo(x, floor + 3);
    ctx.lineTo(x, floor + 9);
  }
  ctx.stroke();

  ctx.strokeStyle = theme.muted;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  // 写 0 的弹簧不画；两端的弹簧是 0 时，那一端的墙也不画
  if (v.k[0] > 0) wall(ctx, left, floor - bh - 14, floor, -1);
  if (v.k[n] > 0) wall(ctx, right, floor - bh - 14, floor, 1);
  for (let i = 0; i <= n; i++) {
    if (!(v.k[i] > 0)) continue;
    const from = i === 0 ? left : centers[i - 1] + bw / 2;
    const to = i === n ? right : centers[i] - bw / 2;
    spring(ctx, from, to, springY);
  }
  ctx.stroke();

  for (let i = 0; i < n; i++) {
    ctx.beginPath();
    ctx.roundRect(centers[i] - bw / 2, floor - bh, bw, bh, 4);
    ctx.fillStyle = theme.series[i % theme.series.length];
    ctx.fill();
  }
}

function drawChart(ctx: CanvasRenderingContext2D, width: number, height: number, theme: Theme, sim: OscSim, amplitude: number): void {
  const yMax = Math.max(amplitude * 1.25, sim.peak * 1.1);
  const t0 = Math.max(0, sim.t - WINDOW);
  const view = new Viewport([t0, t0 + WINDOW], [-yMax, yMax], width, height, { left: 40, right: 14, top: MECH_HEIGHT + 12, bottom: 26 });
  drawAxes(ctx, view, theme, ['t', 'x']);
  ctx.save();
  view.clip(ctx);
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  const oldest = (sim.head - sim.samples + sim.capacity) % sim.capacity;
  for (let i = 0; i < sim.n; i++) {
    ctx.strokeStyle = theme.series[i % theme.series.length];
    ctx.beginPath();
    for (let k = 0; k < sim.samples; k++) {
      const at = (oldest + k) % sim.capacity;
      const px = view.px(sim.times[at]);
      const py = view.py(sim.xs[at * sim.n + i]);
      if (k === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  ctx.restore();
}

export function Oscillator({ params: p, labels }: AnimProps<OscillatorParams>) {
  const compiled = useMemo(() => compile(p), [p]);
  const sliders = useSliders(p.sliders);
  const playback = usePlayback();
  const theme = useTheme();
  const { box, canvas, size, context } = useCanvas(0.62, 440);
  const inView = useInView(box);
  const n = p.masses.length;

  const sim = useMemo(() => new OscSim(n, p.dt), [n, p.dt]);
  const values = useMemo(() => {
    if (typeof compiled === 'string') return compiled;
    return evaluate(compiled, Float64Array.from((p.sliders ?? []).map((s) => sliders.values[s.name])));
  }, [compiled, p.sliders, sliders.values]);

  const amplitude = useMemo(() => (typeof compiled === 'string' ? 1 : referenceAmplitude(compiled, p.sliders ?? [])), [compiled, p.sliders]);

  const draw = useCallback(() => {
    const ctx = context();
    if (!ctx) return;
    ctx.clearRect(0, 0, size.width, size.height);
    if (!sim.values) return;
    drawMechanism(ctx, size.width, theme, sim, amplitude);
    drawChart(ctx, size.width, size.height, theme, sim, amplitude);
  }, [context, sim, size, theme, amplitude]);

  // 改了滑块：从初始位移重新开始
  useEffect(() => sim.configure(typeof values === 'string' ? null : values), [sim, values]);
  useEffect(draw, [draw, values]);

  useAnimationFrame(playback.playing && inView && typeof values !== 'string', (elapsed) => {
    sim.advance(sim.clock.steps(elapsed, playback.speed));
    draw();
  });

  if (typeof compiled === 'string') return <AnimError message={compiled} />;

  const legend = Array.from({ length: n }, (_, i) => ({
    color: theme.series[i % theme.series.length],
    kind: 'line' as const,
    label: (
      <>
        第 {i + 1} 个物块的位移 <i>x</i>
        <sub>{i + 1}</sub>
      </>
    ),
  }));

  const reset = (): void => {
    sim.restart();
    sliders.reset();
  };

  return (
    <div className="anim" data-component="oscillator">
      <div className="anim-stage" ref={box}>
        <canvas ref={canvas} style={{ width: size.width, height: size.height }} role="img" aria-label="弹簧振子" />
        {typeof values === 'string' && <AnimError message={values} />}
      </div>
      <Legend items={n > 1 ? legend : []} />
      <div className="anim-controls">
        <SliderPanel sliders={p.sliders} values={sliders.values} onChange={sliders.set} labels={labels} />
        <ControlBar playing={playback.playing} onToggle={playback.toggle} speed={playback.speed} onSpeed={playback.setSpeed} onReset={reset} />
      </div>
    </div>
  );
}

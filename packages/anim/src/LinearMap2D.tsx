// LinearMap2D：线性变换怎样拉扯平面。从单位矩阵插值到目标矩阵，网格、单位正方形、基向量跟着变；
// 写了 steps 时几个矩阵依次作用（先作用第一个）。写法见 docs/plan.md「附录：动画组件参数」。
// 1× 时每一步 2 秒，放完停在终点，点「播放」从头重放；进度条能拖到任意时刻。改了滑块，画面直接跟着变，不从头来。

import { useEffect, useMemo, useRef, useState } from 'react';
import { compileExpr, type CompiledExpr } from './expr';
import {
  AnimError,
  arrow,
  ControlBar,
  drawAxes,
  formatNumber,
  Legend,
  niceStep,
  prefersReducedMotion,
  SliderPanel,
  useAnimationFrame,
  useCanvas,
  useInView,
  usePlayback,
  useSliders,
  useTheme,
  Viewport,
  withAlpha,
  type AnimProps,
  type LegendItem,
  type Theme,
} from './kit';
import { apply, composeAt, det, eigenDirections, gridExtent, IDENTITY, product, stepAt, timeAtProgress, totalTime, type Mat2 } from './linmap';
import { linearMapSteps, type LinearMap2DParams } from './specs';

const DEFAULT_SHOW = ['grid', 'square', 'basis'];
/** 变换后的网格每个方向最多画几条线：矩阵接近不可逆时网格线挤在一起，画到这里为止。 */
const MAX_LINES = 120;
/** 卡顿时一帧最多补多少秒（再乘以速度）。 */
const MAX_FRAME = 0.1;

interface Compiled {
  /** 每一步的四个元素，按行。 */
  matrices: CompiledExpr[][];
  vectors: [CompiledExpr, CompiledExpr][];
}

function compile(p: LinearMap2DParams): Compiled | string {
  const names = (p.sliders ?? []).map((s) => s.name);
  try {
    return {
      matrices: linearMapSteps(p).map((s) => s.matrix.flat().map((entry) => compileExpr(entry, names))),
      vectors: (p.vectors ?? []).map((v) => [compileExpr(v.x, names), compileExpr(v.y, names)]),
    };
  } catch (e) {
    return e instanceof Error ? e.message : String(e);
  }
}

/** 原来的一段线段 (x0, y0)–(x1, y1) 经 m 变换后的样子。 */
function segment(ctx: CanvasRenderingContext2D, view: Viewport, m: Mat2, x0: number, y0: number, x1: number, y1: number): void {
  const [ax, ay] = apply(m, x0, y0);
  const [bx, by] = apply(m, x1, y1);
  ctx.moveTo(view.px(ax), view.py(ay));
  ctx.lineTo(view.px(bx), view.py(by));
}

/**
 * 变换后的网格：原来横竖的网格线经 m 变换后的样子；过原点的两条（两条坐标轴的像）画得深一些。
 * 网格间隔是 1，单位正方形正好是一格；显示范围超过 20 时按刻度的间隔画，免得太密。
 */
function drawGrid(ctx: CanvasRenderingContext2D, view: Viewport, color: string, m: Mat2): void {
  const span = Math.max(view.x[1] - view.x[0], view.y[1] - view.y[0]);
  const spacing = span <= 20 ? 1 : niceStep(span, 10);
  const n = Math.ceil(gridExtent(m, view.x, view.y, MAX_LINES * spacing) / spacing);
  const far = n * spacing;
  for (const axis of [false, true]) {
    ctx.beginPath();
    for (let k = -n; k <= n; k++) {
      if ((k === 0) !== axis) continue;
      segment(ctx, view, m, k * spacing, -far, k * spacing, far);
      segment(ctx, view, m, -far, k * spacing, far, k * spacing);
    }
    ctx.strokeStyle = withAlpha(color, axis ? 0.75 : 0.3);
    ctx.lineWidth = axis ? 1.6 : 1;
    ctx.stroke();
  }
}

/** 单位正方形经 m 变换后的平行四边形；dashed 时只画虚线轮廓（原来的正方形）。 */
function drawSquare(ctx: CanvasRenderingContext2D, view: Viewport, color: string, m: Mat2, dashed: boolean): void {
  ctx.beginPath();
  [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ].forEach(([x, y], i) => {
    const [u, v] = apply(m, x, y);
    if (i === 0) ctx.moveTo(view.px(u), view.py(v));
    else ctx.lineTo(view.px(u), view.py(v));
  });
  ctx.closePath();
  if (dashed) {
    ctx.setLineDash([4, 4]);
  } else {
    ctx.fillStyle = withAlpha(color, 0.16);
    ctx.fill();
  }
  ctx.strokeStyle = dashed ? withAlpha(color, 0.6) : withAlpha(color, 0.85);
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.setLineDash([]);
}

/** 单位圆经 m 变换后的椭圆。 */
function drawCircle(ctx: CanvasRenderingContext2D, view: Viewport, color: string, m: Mat2, dashed: boolean): void {
  ctx.beginPath();
  const samples = 120;
  for (let k = 0; k <= samples; k++) {
    const theta = (2 * Math.PI * k) / samples;
    const [u, v] = apply(m, Math.cos(theta), Math.sin(theta));
    if (k === 0) ctx.moveTo(view.px(u), view.py(v));
    else ctx.lineTo(view.px(u), view.py(v));
  }
  ctx.setLineDash(dashed ? [4, 4] : []);
  ctx.strokeStyle = dashed ? withAlpha(color, 0.6) : color;
  ctx.lineWidth = dashed ? 1.5 : 2;
  ctx.stroke();
  ctx.setLineDash([]);
}

/** 从原点出发的箭头；dashed 时画成淡的虚线（变换前的向量）。 */
function drawVector(ctx: CanvasRenderingContext2D, view: Viewport, color: string, x: number, y: number, dashed: boolean): void {
  const ox = view.px(0);
  const oy = view.py(0);
  ctx.beginPath();
  arrow(ctx, ox, oy, view.px(x) - ox, view.py(y) - oy, 9);
  ctx.setLineDash(dashed ? [4, 4] : []);
  ctx.strokeStyle = dashed ? withAlpha(color, 0.5) : color;
  ctx.lineWidth = dashed ? 1.5 : 2.6;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.lineCap = 'butt';
}

/** 实特征向量所在的直线（过原点，画满整个画面）。 */
function drawEigenLines(ctx: CanvasRenderingContext2D, view: Viewport, color: string, directions: [number, number][]): void {
  const reach = 2 * (Math.abs(view.x[0]) + Math.abs(view.x[1]) + Math.abs(view.y[0]) + Math.abs(view.y[1]));
  ctx.beginPath();
  for (const [ux, uy] of directions) {
    ctx.moveTo(view.px(-reach * ux), view.py(-reach * uy));
    ctx.lineTo(view.px(reach * ux), view.py(reach * uy));
  }
  ctx.setLineDash([7, 5]);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.6;
  ctx.stroke();
  ctx.setLineDash([]);
}

/** 各样东西的颜色：e₁ 的像用绿、e₂ 的像用红，单位圆用紫，另外画的向量从第 5 种颜色起轮着用。 */
function colors(theme: Theme) {
  const s = theme.series;
  return {
    grid: s[0],
    square: s[0],
    flipped: s[1],
    e1: s[2],
    e2: s[1],
    circle: s[3],
    vector: (i: number): string => s[(4 + i) % s.length],
  };
}

export function LinearMap2D({ params: p, labels }: AnimProps<LinearMap2DParams>) {
  const compiled = useMemo(() => compile(p), [p]);
  const sliders = useSliders(p.sliders);
  const playback = usePlayback();
  const theme = useTheme();
  const { x: rx, y: ry } = p.range;
  const ratio = (ry[1] - ry[0]) / (rx[1] - rx[0]);
  const { box, canvas, size, context } = useCanvas(Math.max(0.45, Math.min(0.85, ratio)), 540, ratio);
  const inView = useInView(box);
  const view = useMemo(() => new Viewport(rx, ry, size.width, size.height), [rx, ry, size]);
  const show = useMemo(() => new Set<string>(p.show ?? DEFAULT_SHOW), [p.show]);
  const steps = useMemo(() => linearMapSteps(p), [p]);

  const n = Math.max(1, steps.length);
  const total = totalTime(n);
  // 时间轴上的时刻（1× 时的秒数）；「减少动态效果」时一开始就停在终点
  const [time, setTime] = useState(() => (prefersReducedMotion() ? total : 0));
  const timeRef = useRef(time);
  const seek = (t: number): void => {
    timeRef.current = t;
    setTime(t);
  };

  // 滑块的当前值代进式子：每一步的矩阵、另外画的向量
  const names = useMemo(() => (p.sliders ?? []).map((s) => s.name), [p.sliders]);
  const vars = useMemo(() => Float64Array.from(names, (name) => sliders.values[name]), [names, sliders.values]);
  const mats = useMemo(
    () => (typeof compiled === 'string' ? [] : compiled.matrices.map((entries) => entries.map((f) => f(vars)) as unknown as Mat2)),
    [compiled, vars],
  );
  const vectors = useMemo(() => (typeof compiled === 'string' ? [] : compiled.vectors.map(([fx, fy]) => [fx(vars), fy(vars)] as const)), [compiled, vars]);
  const defined = mats.length > 0 && mats.every((m) => m.every(Number.isFinite));

  const { index, s, progress } = stepAt(time, n);
  const current = defined ? composeAt(mats, index, s) : IDENTITY;
  const final = defined ? product(mats) : IDENTITY;

  useEffect(() => {
    const ctx = context();
    if (!ctx || typeof compiled === 'string') return;
    const c = colors(theme);
    ctx.clearRect(0, 0, size.width, size.height);
    drawAxes(ctx, view, theme, ['x', 'y']);
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillStyle = theme.muted;
    if (!defined) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillText('矩阵在这组滑块值下没有定义', (view.left + view.right) / 2, (view.top + view.bottom) / 2);
      return;
    }
    const eigen = show.has('eigen') ? eigenDirections(final) : null;
    ctx.save();
    view.clip(ctx);
    ctx.lineJoin = 'round';
    if (show.has('grid')) drawGrid(ctx, view, c.grid, current);
    if (eigen) drawEigenLines(ctx, view, withAlpha(theme.muted, 0.9), eigen.directions);
    if (show.has('square')) {
      drawSquare(ctx, view, theme.muted, IDENTITY, true);
      drawSquare(ctx, view, det(current) < 0 ? c.flipped : c.square, current, false);
    }
    if (show.has('circle')) {
      drawCircle(ctx, view, theme.muted, IDENTITY, true);
      drawCircle(ctx, view, c.circle, current, false);
    }
    vectors.forEach(([x, y], i) => {
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;
      drawVector(ctx, view, c.vector(i), x, y, true);
      const [u, v] = apply(current, x, y);
      drawVector(ctx, view, c.vector(i), u, v, false);
    });
    if (show.has('basis')) {
      drawVector(ctx, view, c.e1, current[0], current[2], false);
      drawVector(ctx, view, c.e2, current[1], current[3], false);
    }
    ctx.restore();
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillStyle = theme.muted;
    if (show.has('det')) {
      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';
      ctx.fillText(`det = ${formatNumber(det(current))}`, view.right - 6, view.top + 6);
    }
    if (eigen?.all) {
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillText('每个方向都是特征向量', view.left + 6, view.bottom - 6);
    }
  }, [compiled, context, size, view, theme, show, defined, current, final, vectors]);

  useAnimationFrame(playback.playing && inView && defined, (elapsed) => {
    const next = Math.min(total, timeRef.current + Math.min(elapsed, MAX_FRAME) * playback.speed);
    seek(next);
    if (next >= total) playback.setPlaying(false);
  });

  if (typeof compiled === 'string') return <AnimError message={compiled} />;

  const c = colors(theme);
  const legend: LegendItem[] = [];
  if (show.has('basis')) {
    legend.push({ color: c.e1, kind: 'line', label: 'e₁ 的像' }, { color: c.e2, kind: 'line', label: 'e₂ 的像' });
  }
  if (show.has('circle')) legend.push({ color: c.circle, kind: 'line', label: '单位圆的像' });
  if (show.has('eigen')) legend.push({ color: theme.muted, kind: 'line', label: '特征向量所在的直线' });
  (p.vectors ?? []).forEach((v, i) => {
    legend.push({ color: c.vector(i), kind: 'line', label: labels?.[`vector:${i}`] ?? v.label ?? `(${v.x}, ${v.y})` });
  });

  const stepLabel = labels?.[`step:${index}`] ?? steps[index]?.label;
  const toggle = (): void => {
    // 放完了再点「播放」：从头重放
    if (!playback.playing && timeRef.current >= total) seek(0);
    playback.toggle();
  };
  const reset = (): void => {
    seek(0);
    sliders.reset();
  };

  return (
    <div className="anim" data-component="linear-map-2d">
      <div className="anim-stage" ref={box}>
        <canvas ref={canvas} style={{ width: size.width, height: size.height }} role="img" aria-label="线性变换" />
      </div>
      {(n > 1 || stepLabel) && (
        <div className="anim-caption">
          {n > 1 ? `第 ${index + 1} 步（共 ${n} 步）` : null}
          {n > 1 && stepLabel ? '：' : null}
          {stepLabel}
        </div>
      )}
      <Legend items={legend} />
      <div className="anim-controls">
        <label className="anim-slider anim-progress">
          <span className="anim-slider-label">进度</span>
          <input
            type="range"
            min={0}
            max={n}
            step={0.001}
            value={progress}
            onChange={(e) => {
              playback.setPlaying(false);
              seek(timeAtProgress(Number(e.target.value), n));
            }}
          />
          <output className="anim-slider-value">{n > 1 ? `${index + 1}/${n} 步` : `${Math.round(progress * 100)}%`}</output>
        </label>
        <SliderPanel sliders={p.sliders} values={sliders.values} onChange={sliders.set} labels={labels} />
        <ControlBar playing={playback.playing} onToggle={toggle} speed={playback.speed} onSpeed={playback.setSpeed} onReset={reset} />
      </div>
    </div>
  );
}

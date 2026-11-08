// FunctionPlot：函数曲线、数列和标出的点，参数可拖，没有时间演化。写法见 docs/plan.md「附录：动画组件参数」。
// 鼠标移到图上，图例里显示各条曲线在那一处的值（数列取最近的整数 n）。

import { useEffect, useMemo, useState, type PointerEvent } from 'react';
import { compileExpr, type CompiledExpr } from './expr';
import {
  AnimError,
  ControlBar,
  drawAxes,
  formatNumber,
  Legend,
  SliderPanel,
  useCanvas,
  useSliders,
  useTheme,
  Viewport,
  type AnimProps,
  type LegendItem,
} from './kit';
import type { FunctionPlotParams } from './specs';

interface Compiled {
  functions: CompiledExpr[];
  sequences: CompiledExpr[];
  points: [CompiledExpr, CompiledExpr][];
}

function compile(p: FunctionPlotParams): Compiled | string {
  const names = (p.sliders ?? []).map((s) => s.name);
  try {
    return {
      functions: (p.functions ?? []).map((f) => compileExpr(f.expr, ['x', ...names])),
      sequences: (p.sequences ?? []).map((s) => compileExpr(s.expr, ['n', ...names])),
      points: (p.points ?? []).map((pt) => [compileExpr(pt.x, names), compileExpr(pt.y, names)]),
    };
  } catch (e) {
    return e instanceof Error ? e.message : String(e);
  }
}

/** 一条曲线：每个像素取两个点；遇到无定义的点断开，跨过渐近线（一点在上方外面、下一点在下方外面）也断开。 */
function plotCurve(ctx: CanvasRenderingContext2D, view: Viewport, f: CompiledExpr, vars: Float64Array): void {
  const samples = Math.ceil((view.right - view.left) * 2);
  const limit = 4000;
  ctx.beginPath();
  let pen = false;
  let previous = 0;
  for (let k = 0; k <= samples; k++) {
    const x = view.x[0] + ((view.x[1] - view.x[0]) * k) / samples;
    vars[0] = x;
    const y = f(vars);
    if (!Number.isFinite(y)) {
      pen = false;
      continue;
    }
    const py = Math.max(view.top - limit, Math.min(view.bottom + limit, view.py(y)));
    const jump = pen && ((previous < view.top && py > view.bottom) || (previous > view.bottom && py < view.top));
    if (pen && !jump) ctx.lineTo(view.px(x), py);
    else ctx.moveTo(view.px(x), py);
    pen = true;
    previous = py;
  }
  ctx.stroke();
}

export function FunctionPlot({ params: p, labels }: AnimProps<FunctionPlotParams>) {
  const compiled = useMemo(() => compile(p), [p]);
  const sliders = useSliders(p.sliders);
  const theme = useTheme();
  const { box, canvas, size, context } = useCanvas(0.6, 420);
  /** 鼠标所在处的横坐标。 */
  const [hover, setHover] = useState<number | null>(null);

  const names = useMemo(() => (p.sliders ?? []).map((s) => s.name), [p.sliders]);
  const functions = p.functions ?? [];
  const sequences = p.sequences ?? [];
  const onlySequences = functions.length === 0;
  const view = useMemo(() => new Viewport(p.range.x, p.range.y, size.width, size.height), [p.range, size]);
  const color = (i: number): string => theme.series[i % theme.series.length];

  // 变量数组：第 0 个是 x（或 n），后面依次是滑块的值
  const vars = useMemo(() => {
    const v = new Float64Array(1 + names.length);
    names.forEach((name, i) => (v[i + 1] = sliders.values[name]));
    return v;
  }, [names, sliders.values]);
  const sliderVars = useMemo(() => vars.subarray(1), [vars]);

  const hoverN = hover === null ? null : Math.round(hover);

  useEffect(() => {
    const ctx = context();
    if (!ctx || typeof compiled === 'string') return;
    ctx.clearRect(0, 0, size.width, size.height);
    drawAxes(ctx, view, theme, [onlySequences ? 'n' : 'x', 'y']);
    ctx.save();
    view.clip(ctx);
    ctx.lineJoin = 'round';

    // 鼠标所在处的竖线
    if (hover !== null) {
      const at = view.px(onlySequences ? hoverN! : hover);
      ctx.strokeStyle = theme.muted;
      ctx.setLineDash([3, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(at, view.top);
      ctx.lineTo(at, view.bottom);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.lineWidth = 2.2;
    compiled.functions.forEach((f, i) => {
      ctx.strokeStyle = color(i);
      plotCurve(ctx, view, f, vars);
    });

    const unit = view.scale[0];
    const radius = Math.max(1.6, Math.min(3.6, unit * 0.28));
    compiled.sequences.forEach((f, i) => {
      const [n0, n1] = sequences[i].n;
      const from = Math.max(n0, Math.ceil(view.x[0]));
      const to = Math.min(n1, Math.floor(view.x[1]));
      ctx.fillStyle = color(functions.length + i);
      ctx.beginPath();
      for (let n = from; n <= to; n++) {
        vars[0] = n;
        const y = f(vars);
        if (!Number.isFinite(y)) continue;
        const px = view.px(n);
        const py = view.py(y);
        ctx.moveTo(px + radius, py);
        ctx.arc(px, py, radius, 0, Math.PI * 2);
      }
      ctx.fill();
    });

    // 鼠标所在处：曲线上的点、数列的那一项加圈
    if (hover !== null) {
      ctx.lineWidth = 2;
      compiled.functions.forEach((f, i) => {
        vars[0] = hover;
        const y = f(vars);
        if (!Number.isFinite(y)) return;
        ctx.beginPath();
        ctx.arc(view.px(hover), view.py(y), 4, 0, Math.PI * 2);
        ctx.fillStyle = theme.surface;
        ctx.fill();
        ctx.strokeStyle = color(i);
        ctx.stroke();
      });
      compiled.sequences.forEach((f, i) => {
        const [n0, n1] = sequences[i].n;
        if (hoverN! < n0 || hoverN! > n1) return;
        vars[0] = hoverN!;
        const y = f(vars);
        if (!Number.isFinite(y)) return;
        ctx.beginPath();
        ctx.arc(view.px(hoverN!), view.py(y), radius + 3, 0, Math.PI * 2);
        ctx.strokeStyle = color(functions.length + i);
        ctx.stroke();
      });
    }

    for (const [fx, fy] of compiled.points) {
      const x = fx(sliderVars);
      const y = fy(sliderVars);
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
      ctx.beginPath();
      ctx.arc(view.px(x), view.py(y), 4.5, 0, Math.PI * 2);
      ctx.fillStyle = theme.text;
      ctx.fill();
      ctx.strokeStyle = theme.surface;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.restore();
    // color、functions、sequences 都由 p 和 theme 决定，不必列进依赖
  }, [compiled, context, size, view, theme, vars, sliderVars, hover, hoverN, onlySequences]);

  if (typeof compiled === 'string') return <AnimError message={compiled} />;

  const legend: LegendItem[] = [
    ...functions.map((f, i): LegendItem => {
      let value: string | undefined;
      if (hover !== null) {
        vars[0] = hover;
        value = formatNumber(compiled.functions[i](vars));
      }
      return { color: color(i), kind: 'line', label: labels?.[`function:${i}`] ?? <code>{String(f.expr)}</code>, value };
    }),
    ...sequences.map((s, i): LegendItem => {
      let value: string | undefined;
      if (hoverN !== null && hoverN >= s.n[0] && hoverN <= s.n[1]) {
        vars[0] = hoverN;
        value = formatNumber(compiled.sequences[i](vars));
      }
      return { color: color(functions.length + i), kind: 'dot', label: labels?.[`sequence:${i}`] ?? <code>{String(s.expr)}</code>, value };
    }),
  ];
  const header =
    hover === null ? undefined : onlySequences ? `n = ${hoverN}` : sequences.length ? `x = ${formatNumber(hover)}，n = ${hoverN}` : `x = ${formatNumber(hover)}`;

  const onPointerMove = (e: PointerEvent<HTMLCanvasElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const inside = px >= view.left && px <= view.right && py >= view.top && py <= view.bottom;
    setHover(inside ? view.fromPx(px, py)[0] : null);
  };

  return (
    <div className="anim" data-component="function-plot">
      <div className="anim-stage" ref={box}>
        <canvas
          ref={canvas}
          style={{ width: size.width, height: size.height }}
          onPointerMove={onPointerMove}
          onPointerLeave={() => setHover(null)}
          role="img"
          aria-label="函数图像"
        />
      </div>
      <Legend items={legend} header={header} />
      {p.sliders?.length ? (
        <div className="anim-controls">
          <SliderPanel sliders={p.sliders} values={sliders.values} onChange={sliders.set} labels={labels} />
          <ControlBar onReset={sliders.reset} />
        </div>
      ) : null}
    </div>
  );
}

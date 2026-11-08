// 动画组件共用的部分：主题颜色、画布、坐标换算和坐标轴、滑块、播放控制、动画循环。
// 颜色从页面的 CSS 变量里取（--text、--accent 等，取不到就用默认值），亮色、暗色主题切换时跟着变。

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import type { SliderSpec } from './specs';

export interface AnimProps<P> {
  params: P;
  /** 排好版的文字：滑块 `slider:<名字>`、图例 `function:<序号>`、`sequence:<序号>`。没有时用名字或式子原文。 */
  labels?: Record<string, ReactNode>;
}

// ---------- 主题 ----------

export interface Theme {
  text: string;
  muted: string;
  border: string;
  surface: string;
  /** 几条曲线、几个物块依次用的颜色。 */
  series: string[];
}

function readTheme(): Theme {
  const style = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string): string => style.getPropertyValue(name).trim() || fallback;
  return {
    text: v('--text', '#1d2026'),
    muted: v('--muted', '#6c717a'),
    border: v('--border', '#d9d6cc'),
    surface: v('--surface', '#ffffff'),
    series: [v('--accent', '#2f5bd3'), v('--danger', '#c2410c'), v('--good', '#0f8a5f'), v('--tier-thinking', '#7c3aed'), v('--warn', '#a8661a'), v('--tier-hard', '#b4541b')],
  };
}

export function useTheme(): Theme {
  const [theme, setTheme] = useState(readTheme);
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(readTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class', 'style'] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

/** 颜色加透明度（只认 #rrggbb 和 #rgb，别的原样返回）。 */
export function withAlpha(color: string, alpha: number): string {
  const hex = color.startsWith('#') ? color.slice(1) : '';
  const full = hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex;
  if (full.length !== 6) return color;
  const n = parseInt(full, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ---------- 画布 ----------

export interface CanvasSize {
  width: number;
  height: number;
}

/**
 * 画布尺寸：宽度跟着容器，高度 = 宽度 × aspect（不超过 maxHeight）。
 * 给了 ratio（纵轴范围 ÷ 横轴范围）时尽量让两轴等比例（圆画出来是圆）：坐标区太高就把画布缩窄、居中；
 * 比例太悬殊、等比例画出来太窄或太扁时，退回按 aspect 画。
 */
function layout(available: number, aspect: number, maxHeight: number, ratio?: number): CanvasSize {
  const fallback = { width: available, height: Math.round(Math.min(maxHeight, available * aspect)) };
  if (ratio === undefined) return fallback;
  const padX = DEFAULT_PADDING.left + DEFAULT_PADDING.right;
  const padY = DEFAULT_PADDING.top + DEFAULT_PADDING.bottom;
  let plotWidth = available - padX;
  let plotHeight = plotWidth * ratio;
  if (plotHeight + padY > maxHeight) {
    plotHeight = maxHeight - padY;
    plotWidth = plotHeight / ratio;
  }
  if (plotWidth < (available - padX) * 0.5 || plotHeight < 160) return fallback;
  return { width: Math.round(plotWidth + padX), height: Math.round(plotHeight + padY) };
}

/** 画布：尺寸见 layout；按屏幕像素比放大，画的时候按 CSS 像素算。 */
export function useCanvas(aspect: number, maxHeight: number, ratio?: number) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState<CanvasSize>(() => layout(640, aspect, maxHeight, ratio));

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const update = (): void => {
      const next = layout(Math.max(240, Math.floor(el.clientWidth)), aspect, maxHeight, ratio);
      setSize((s) => (s.width === next.width && s.height === next.height ? s : next));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [aspect, maxHeight, ratio]);

  /** 取画布的 2D 上下文，并按当前尺寸和像素比设好变换。 */
  const context = useCallback((): CanvasRenderingContext2D | null => {
    const c = canvas.current;
    if (!c) return null;
    const dpr = window.devicePixelRatio || 1;
    const w = Math.round(size.width * dpr);
    const h = Math.round(size.height * dpr);
    if (c.width !== w || c.height !== h) {
      c.width = w;
      c.height = h;
    }
    const ctx = c.getContext('2d');
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }, [size]);

  return { box, canvas, size, context };
}

// ---------- 坐标 ----------

export interface Padding {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

const DEFAULT_PADDING: Padding = { left: 40, right: 14, top: 12, bottom: 26 };

/** 数学坐标和画布像素之间的换算；纵轴向上为正。 */
export class Viewport {
  constructor(
    readonly x: readonly [number, number],
    readonly y: readonly [number, number],
    readonly width: number,
    readonly height: number,
    readonly pad: Padding = DEFAULT_PADDING,
  ) {}

  get left(): number {
    return this.pad.left;
  }

  get right(): number {
    return this.width - this.pad.right;
  }

  get top(): number {
    return this.pad.top;
  }

  get bottom(): number {
    return this.height - this.pad.bottom;
  }

  px(x: number): number {
    return this.left + ((x - this.x[0]) / (this.x[1] - this.x[0])) * (this.right - this.left);
  }

  py(y: number): number {
    return this.bottom - ((y - this.y[0]) / (this.y[1] - this.y[0])) * (this.bottom - this.top);
  }

  /** 像素 → 数学坐标。 */
  fromPx(px: number, py: number): [number, number] {
    return [
      this.x[0] + ((px - this.left) / (this.right - this.left)) * (this.x[1] - this.x[0]),
      this.y[0] + ((this.bottom - py) / (this.bottom - this.top)) * (this.y[1] - this.y[0]),
    ];
  }

  /** 每个数学单位多少像素（横、纵）。 */
  get scale(): [number, number] {
    return [(this.right - this.left) / (this.x[1] - this.x[0]), (this.bottom - this.top) / (this.y[1] - this.y[0])];
  }

  /** 把画图限制在坐标区里面。 */
  clip(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.rect(this.left, this.top, this.right - this.left, this.bottom - this.top);
    ctx.clip();
  }
}

/** 刻度间隔：1、2、5 乘以 10 的幂，一条轴大约 target 格。 */
export function niceStep(span: number, target = 6): number {
  const raw = span / target;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / magnitude;
  return (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * magnitude;
}

function formatTick(value: number, step: number): string {
  const decimals = Math.max(0, -Math.floor(Math.log10(step) + 1e-9));
  const text = value.toFixed(decimals);
  return text === '-0' ? '0' : text.replace(/^-/, '−');
}

/** 网格、坐标轴（过原点时画）和刻度数字。 */
export function drawAxes(ctx: CanvasRenderingContext2D, view: Viewport, theme: Theme, names: [string, string] = ['', '']): void {
  ctx.save();
  ctx.font = '11px system-ui, sans-serif';
  ctx.lineWidth = 1;
  const sx = niceStep(view.x[1] - view.x[0], Math.max(3, Math.round((view.right - view.left) / 80)));
  const sy = niceStep(view.y[1] - view.y[0], Math.max(3, Math.round((view.bottom - view.top) / 60)));
  ctx.strokeStyle = withAlpha(theme.border, 0.9);
  ctx.fillStyle = theme.muted;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  for (let x = Math.ceil(view.x[0] / sx) * sx; x <= view.x[1] + 1e-9; x += sx) {
    const p = Math.round(view.px(x)) + 0.5;
    ctx.beginPath();
    ctx.moveTo(p, view.top);
    ctx.lineTo(p, view.bottom);
    ctx.stroke();
    ctx.fillText(formatTick(x, sx), p, view.bottom + 6);
  }
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let y = Math.ceil(view.y[0] / sy) * sy; y <= view.y[1] + 1e-9; y += sy) {
    const p = Math.round(view.py(y)) + 0.5;
    ctx.beginPath();
    ctx.moveTo(view.left, p);
    ctx.lineTo(view.right, p);
    ctx.stroke();
    ctx.fillText(formatTick(y, sy), view.left - 6, p);
  }
  // 坐标轴：落在范围里才画，否则画在边上
  ctx.strokeStyle = theme.muted;
  ctx.lineWidth = 1.2;
  const ax = view.x[0] <= 0 && view.x[1] >= 0 ? view.px(0) : view.left;
  const ay = view.y[0] <= 0 && view.y[1] >= 0 ? view.py(0) : view.bottom;
  ctx.beginPath();
  ctx.moveTo(view.left, ay);
  ctx.lineTo(view.right, ay);
  ctx.moveTo(ax, view.top);
  ctx.lineTo(ax, view.bottom);
  ctx.stroke();
  // 轴名（变量名）
  ctx.fillStyle = theme.text;
  ctx.font = 'italic 13px "Times New Roman", serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  if (names[0]) ctx.fillText(names[0], view.right - 2, ay - 4);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  if (names[1]) ctx.fillText(names[1], ax + 5, view.top + 2);
  ctx.restore();
}

/** 画一个小箭头（像素坐标），从 (x, y) 指向 (x + dx, y + dy)。 */
export function arrow(ctx: CanvasRenderingContext2D, x: number, y: number, dx: number, dy: number, head = 4): void {
  const len = Math.hypot(dx, dy);
  if (len < 1e-6) return;
  const ux = dx / len;
  const uy = dy / len;
  const ex = x + dx;
  const ey = y + dy;
  ctx.moveTo(x, y);
  ctx.lineTo(ex, ey);
  ctx.moveTo(ex - head * ux + head * 0.55 * uy, ey - head * uy - head * 0.55 * ux);
  ctx.lineTo(ex, ey);
  ctx.lineTo(ex - head * ux - head * 0.55 * uy, ey - head * uy + head * 0.55 * ux);
}

// ---------- 滑块和播放控制 ----------

export function useSliders(sliders: SliderSpec[] | undefined) {
  const defaults = (): Record<string, number> => Object.fromEntries((sliders ?? []).map((s) => [s.name, s.default]));
  const [values, setValues] = useState(defaults);
  return {
    values,
    set: (name: string, value: number): void => setValues((v) => ({ ...v, [name]: value })),
    reset: (): void => setValues(defaults()),
  };
}

function formatValue(value: number, step: number): string {
  const decimals = Math.max(0, Math.min(6, -Math.floor(Math.log10(step) + 1e-9)));
  return value.toFixed(decimals).replace(/^-/, '−');
}

export function SliderPanel({
  sliders,
  values,
  onChange,
  labels,
}: {
  sliders: SliderSpec[] | undefined;
  values: Record<string, number>;
  onChange: (name: string, value: number) => void;
  labels?: Record<string, ReactNode>;
}) {
  if (!sliders?.length) return null;
  return (
    <div className="anim-sliders">
      {sliders.map((s) => (
        <label key={s.name} className="anim-slider">
          <span className="anim-slider-label">{labels?.[`slider:${s.name}`] ?? s.name}</span>
          <input type="range" min={s.min} max={s.max} step={s.step} value={values[s.name] ?? s.default} onChange={(e) => onChange(s.name, Number(e.target.value))} />
          <output className="anim-slider-value">{formatValue(values[s.name] ?? s.default, s.step)}</output>
        </label>
      ))}
    </div>
  );
}

const SPEEDS = [0.25, 0.5, 1, 2, 4];

/** 播放 / 暂停、速度、重置；没有时间演化的组件只有重置。 */
export function ControlBar({
  playing,
  onToggle,
  speed,
  onSpeed,
  onReset,
  children,
}: {
  playing?: boolean;
  onToggle?: () => void;
  speed?: number;
  onSpeed?: (speed: number) => void;
  onReset: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="anim-bar">
      {onToggle && (
        <button type="button" className="anim-button anim-button-main" onClick={onToggle} aria-pressed={playing}>
          {playing ? '暂停' : '播放'}
        </button>
      )}
      {onSpeed && speed !== undefined && (
        <label className="anim-speed">
          速度
          <select value={speed} onChange={(e) => onSpeed(Number(e.target.value))}>
            {SPEEDS.map((s) => (
              <option key={s} value={s}>
                {s}×
              </option>
            ))}
          </select>
        </label>
      )}
      <button type="button" className="anim-button" onClick={onReset}>
        重置
      </button>
      {children}
    </div>
  );
}

export interface LegendItem {
  color: string;
  /** 线（曲线）还是点（数列、物块）。 */
  kind: 'line' | 'dot';
  label: ReactNode;
  /** 鼠标所在处的值。 */
  value?: string;
}

export function Legend({ items, header }: { items: LegendItem[]; header?: string }) {
  if (!items.length) return null;
  return (
    <div className="anim-legend">
      {header && <span className="anim-legend-header">{header}</span>}
      {items.map((item, i) => (
        <span key={i} className="anim-legend-item">
          <span className={`anim-swatch anim-swatch-${item.kind}`} style={{ background: item.color }} aria-hidden="true" />
          <span className="anim-legend-label">{item.label}</span>
          {item.value !== undefined && <span className="anim-legend-value">= {item.value}</span>}
        </span>
      ))}
    </div>
  );
}

/** 参数在运行时出了问题（式子编译不了、质量不是正数）：代替画面显示。 */
export function AnimError({ message }: { message: string }) {
  return (
    <div className="anim-error" role="alert">
      动画参数有误：{message}
    </div>
  );
}

/** 给人看的数：四位有效数字，负号用 −。 */
export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return Number.isNaN(value) ? '无定义' : value > 0 ? '∞' : '−∞';
  const text = Math.abs(value) >= 1e5 || (value !== 0 && Math.abs(value) < 1e-3) ? value.toExponential(2) : String(Number(value.toPrecision(4)));
  return text.replace(/^-/, '−');
}

/** 元素在不在屏幕上：不在的时候动画不跑。 */
export function useInView(ref: RefObject<Element | null>): boolean {
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '100px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}

/** 动画循环：active 时每帧调用 onFrame(这一帧距上一帧多少秒)；页面在后台时不算。 */
export function useAnimationFrame(active: boolean, onFrame: (elapsed: number) => void): void {
  const callback = useRef(onFrame);
  callback.current = onFrame;
  useEffect(() => {
    if (!active) return;
    let id = 0;
    let last = performance.now();
    const loop = (now: number): void => {
      const elapsed = (now - last) / 1000;
      last = now;
      if (!document.hidden) callback.current(elapsed);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [active]);
}

/** 带时间演化的组件：默认播放；系统设置了「减少动态效果」时默认暂停。 */
export function usePlayback() {
  const [playing, setPlaying] = useState(() => !prefersReducedMotion());
  const [speed, setSpeed] = useState(1);
  return { playing, setPlaying, toggle: () => setPlaying((p) => !p), speed, setSpeed };
}

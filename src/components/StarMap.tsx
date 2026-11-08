// 首页的知识星图，见 docs/plan.md「立体知识图谱与动态效果」。两种看法一键切换，选哪种记在这台设备的浏览器里：
// - 立体（StarMap3D，three.js，按需加载）：横放的圆筒，沿轴往右越深，每个领域是圆筒上的一条；
// - 平面（横向展开图）：把圆筒展开铺平，横轴是层级（往右越深），纵轴是领域带；比屏幕宽，横向滚动。
// 坐标在构建时算好（compiler/layout.ts）；节点的五种状态见 shared/node-state.ts。
// 悬停（或用键盘移到节点上）显示标题和一句话总结，点击进入小节。学完一节回到星图时，这颗星点亮，光沿连线流向刚解锁的节点。

import {
  lazy,
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router';
import type { Graph, GraphLesson } from '../../shared/content-types';
import { lessonPath } from '../../shared/ids';
import { missingPrereqs, NODE_STATE_LABELS, nodeState, type NodeState } from '../../shared/node-state';
import { useContent } from '../content/ContentContext';
import { Rich } from '../content/Rich';
import { useProgress } from '../progress/ProgressContext';
import { subjectTitle } from '../subjects';

const StarMap3D = lazy(() => import('./StarMap3D'));

/** 横向展开图在缩放为 1 时的尺寸（像素）：每一层一列，宽 COL；一行高 ROW。 */
const COL = 200;
const ROW = 26;
/** 缩到最小时，每一层也至少 MIN_COL 宽、每一行至少 MIN_ROW 高：图比屏幕宽也比框高，横向、上下都滚，点不挤在一起。
 *  显示标题时每层至少 LABEL_COL 宽，标题不叠。 */
const MIN_COL = 90;
const MIN_ROW = 11;
const LABEL_COL = 190;
/** 内容四周留的空。 */
const PAD = 28;
/** 左边固定的一栏写学科和领域名，顶上固定的一行写层级；滚动时它们不动。 */
const HEAD_LEFT = 150;
const HEAD_TOP = 30;
/** 放大到这么大（行距约 16 像素）才显示节点的标题；最多放大到 MAX_ZOOM。 */
const LABEL_ZOOM = 0.6;
const MAX_ZOOM = 1.6;
/** 标题最多显示几个字，长的截断，完整的看悬停卡片。 */
const LABEL_CHARS = 13;
const CARD_WIDTH = 300;

const MODE_KEY = 'principia.map-mode';
const SEEN_KEY = 'principia.map-seen';

export type MapMode = '3d' | '2d';

const hueStyle = (hue: number): CSSProperties => ({ '--hue': hue }) as CSSProperties;

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function supportsWebGL(): boolean {
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
}

function readMode(): MapMode {
  try {
    return localStorage.getItem(MODE_KEY) === '2d' ? '2d' : '3d';
  } catch {
    return '3d';
  }
}

/** 学完一节回到星图时的点亮动画：和上次看星图时比，新学完（或新标已会）的节点，以及因此变成可学的后续。 */
export interface Reveal {
  newly: Set<string>;
  /** [新点亮的前置, 刚解锁的后续]：光沿这些连线流过去。 */
  flows: [string, string][];
}

function useMapReveal(graph: Graph | null, states: Map<string, NodeState>, ready: boolean): Reveal | null {
  const [reveal, setReveal] = useState<Reveal | null>(null);
  const checked = useRef(false);
  useEffect(() => {
    if (!graph || !ready || checked.current) return;
    checked.current = true;
    const learned = graph.lessons.map((l) => l.id).filter((id) => states.get(id) === 'completed' || states.get(id) === 'known');
    let seen: string[] | null = null;
    try {
      const raw = localStorage.getItem(SEEN_KEY);
      seen = raw ? (JSON.parse(raw) as string[]) : null;
      localStorage.setItem(SEEN_KEY, JSON.stringify(learned));
    } catch {
      // 存不了就不放动画
    }
    // 第一次看星图时什么都不放，免得满屏都在亮
    if (!seen || prefersReducedMotion()) return;
    const before = new Set(seen);
    const newly = new Set(learned.filter((id) => !before.has(id)));
    if (!newly.size) return;
    setReveal({ newly, flows: graph.edges.filter(([from, to]) => newly.has(from) && states.get(to) === 'available') });
  }, [graph, states, ready]);
  return reveal;
}

/** 节点的样子（平面图和图例）：可学的有呼吸的光，已完成的实心，已会的是带圈的点（立体图里是菱形），够不着的暗，待写的是虚线圈。 */
function NodeGlyph({ state, mode = '2d' }: { state: NodeState; mode?: MapMode }) {
  if (mode === '3d' && state === 'known') return <rect className="map-dot" x={-6.5} y={-6.5} width={13} height={13} transform="rotate(45)" />;
  return (
    <>
      {state === 'available' && <circle className="map-glow" r={17} />}
      {state === 'completed' && <circle className="map-halo" r={15} />}
      <circle className="map-dot" r={9} />
      {state === 'known' && <circle className="map-dot-inner" r={3.5} />}
    </>
  );
}

function Legend({ mode }: { mode: MapMode }) {
  const states: NodeState[] = ['completed', 'known', 'available', 'locked', 'outline'];
  return (
    <ul className={mode === '3d' ? 'map-legend map-legend-3d' : 'map-legend'} aria-label="图例">
      {states.map((s) => (
        <li key={s}>
          <svg width="22" height="22" viewBox="-11 -11 22 22" aria-hidden="true">
            <g className={`map-node map-node-${s}${mode === '3d' && s === 'known' ? ' map-node-known-3d' : ''}`} style={hueStyle(230)}>
              <NodeGlyph state={s} mode={mode} />
            </g>
          </svg>
          {NODE_STATE_LABELS[s]}
        </li>
      ))}
      <li>
        <span className="map-legend-unreviewed">未审</span>
        {mode === '3d' ? '节点上方的小橙点：写好但还没审' : '写好但还没审'}
      </li>
    </ul>
  );
}

/** 悬停卡片的内容：标题、状态、未审、层级、一句话总结（待写的显示目标），够不着的写出还差哪几节。 */
export function MapCard({ lesson, state, hue }: { lesson: GraphLesson; state: NodeState; hue: number }) {
  const { lessons } = useContent();
  const progress = useProgress();
  return (
    <>
      <div className="map-card-title">
        <Rich value={lesson.title} inert />
      </div>
      <div className="map-card-tags">
        <span className={`map-state map-state-${state}`} style={hueStyle(hue)}>
          {NODE_STATE_LABELS[state]}
        </span>
        {lesson.status === 'written' && <span className="badge badge-unreviewed">未审</span>}
        <span className="map-card-level">层级 {lesson.level}</span>
      </div>
      <div className="map-card-text">
        <Rich value={lesson.status === 'outline' ? lesson.goal : (lesson.summary ?? lesson.goal)} inert />
      </div>
      {state === 'locked' && (
        <div className="map-card-missing">
          还差：
          {missingPrereqs(lesson, progress.state)
            .map((id) => lessons.get(id)?.titleText ?? id)
            .join('、')}
        </div>
      )}
    </>
  );
}

// ---------- 平面图：横向展开，比屏幕宽，横向滚动 ----------

const shortTitle = (title: string): string => {
  const chars = [...title];
  return chars.length > LABEL_CHARS ? `${chars.slice(0, LABEL_CHARS - 1).join('')}…` : title;
};

/** 节点在屏幕上的大小：放大到看得清时不再变；缩小时跟着行距变小，点的直径约为行距的七成，上下两行的点之间留着空。 */
const glyphScale = (sy: number): number => Math.min(1, Math.max(0.3, sy));

/**
 * 平面图：外面一层是普通的滚动框（横向滚动条、Shift+滚轮、触控板左右滑都能滚），里面撑开一块和图一样大的地方；
 * 真正画图的 SVG 用 sticky 钉在可见的那一块上，按滚动位置平移内容，左边的领域名、顶上的层级就能一直留在原处。
 * 缩放：纵向按 s；横向至少 MIN_COL 一层，所以一开始（按高度装下全图）也比屏幕宽。
 */
function StarMap2D({
  graph,
  states,
  reveal,
  onOpen,
  focusAvailable,
  home,
}: {
  graph: Graph;
  states: Map<string, NodeState>;
  reveal: Reveal | null;
  onOpen: (l: GraphLesson) => void;
  focusAvailable: number;
  home: number;
}) {
  const { lessons } = useContent();
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 960, h: 600 });
  /** null：缩到最小（一开始和「复位」以后）。 */
  const [zoom, setZoom] = useState<number | null>(null);
  const [scroll, setScroll] = useState({ left: 0, top: 0 });
  /** 缩放以后要滚到的位置：等新尺寸排好版再滚。 */
  const pendingScroll = useRef<{ left: number; top: number } | null>(null);
  const [active, setActive] = useState<string | null>(null);

  // 内容坐标：横轴是层级；纵轴是领域带，按行算，每个学科里一行都是 ROW 像素
  // （立体图里两个学科各占半圈、行宽不同；展开成平面时各学科按自己的行数伸缩，不浪费地方）
  const geo = useMemo(() => {
    const maxLevel = Math.max(0, ...graph.lessons.map((l) => l.level));
    let rows = 0;
    const bands = graph.subjects.map((s) => {
      const band = { start: s.start, end: s.end, row: s.row, offset: rows };
      rows += (s.end - s.start) / s.row;
      return band;
    });
    const x = (level: number): number => PAD + level * COL;
    const y = (deg: number): number => {
      const band = bands.find((b) => deg <= b.end) ?? bands[bands.length - 1];
      return PAD + (band.offset + (deg - band.start) / band.row) * ROW;
    };
    return { maxLevel, x, y, width: x(maxLevel) + COL, height: PAD * 2 + rows * ROW };
  }, [graph]);

  // 最小缩放：一行至少 MIN_ROW 像素；框很高、整张图放得下时就按框高装下
  const minZoom = Math.max(MIN_ROW / ROW, (size.h - HEAD_TOP - 16) / geo.height);
  const clampZoom = (z: number): number => Math.min(MAX_ZOOM, Math.max(minZoom, z));
  const xScale = (z: number): number => Math.max(z, MIN_COL / COL, z >= LABEL_ZOOM ? LABEL_COL / COL : 0);
  const sy = clampZoom(zoom ?? minZoom);
  const sx = xScale(sy);
  // 回调里（键盘移动、记下的节点）现取最新的尺寸和缩放
  const live = useRef({ sx, sy, w: size.w, h: size.h });
  live.current = { sx, sy, w: size.w, h: size.h };

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const update = (): void => setSize((s) => (s.w === el.clientWidth && s.h === el.clientHeight ? s : { w: el.clientWidth, h: el.clientHeight }));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 缩放后撑开的地方变了，排好版再滚到该在的位置
  useLayoutEffect(() => {
    const el = box.current;
    const target = pendingScroll.current;
    if (!el || !target) return;
    pendingScroll.current = null;
    el.scrollLeft = target.left;
    el.scrollTop = target.top;
    setScroll({ left: el.scrollLeft, top: el.scrollTop });
  });

  /** 缩放到 next，画面上 (ax, ay) 处（相对画面左上角）的那一点留在原处。 */
  const zoomTo = (next: number, ax: number, ay: number): void => {
    const el = box.current;
    if (!el) return;
    const z = clampZoom(next);
    const X = (ax - HEAD_LEFT + el.scrollLeft) / sx;
    const Y = (ay - HEAD_TOP + el.scrollTop) / sy;
    pendingScroll.current = { left: X * xScale(z) - (ax - HEAD_LEFT), top: Y * z - (ay - HEAD_TOP) };
    setActive(null);
    setZoom(z);
  };

  // 「复位」：缩到最小，回到左上角
  const firstHome = useRef(home);
  useEffect(() => {
    if (home === firstHome.current) return;
    setActive(null);
    pendingScroll.current = { left: 0, top: 0 };
    setZoom(null);
  }, [home]);

  // 「我现在能学什么」：放大到看得清标题，把可学的节点挪到画面中间
  const firstFocus = useRef(focusAvailable);
  useEffect(() => {
    if (focusAvailable === firstFocus.current) return;
    const targets = graph.lessons.filter((l) => states.get(l.id) === 'available');
    if (!targets.length) return;
    const xs = targets.map((l) => geo.x(l.level));
    const ys = targets.map((l) => geo.y(l.y2d));
    const [x0, x1, y0, y1] = [Math.min(...xs) - 40, Math.max(...xs) + COL, Math.min(...ys) - 60, Math.max(...ys) + 60];
    const viewW = size.w - HEAD_LEFT;
    const viewH = size.h - HEAD_TOP;
    const z = clampZoom(Math.max(LABEL_ZOOM, Math.min(1, viewW / (x1 - x0), viewH / (y1 - y0))));
    pendingScroll.current = { left: ((x0 + x1) / 2) * xScale(z) - viewW / 2, top: ((y0 + y1) / 2) * z - viewH / 2 };
    setActive(null);
    setZoom(z);
  }, [focusAvailable]);

  // Ctrl+滚轮（触控板双指捏合也是这个）缩放；普通滚轮留给页面上下滚动
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const onWheel = (e: WheelEvent): void => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      zoomTo(sy * Math.exp(-e.deltaY * 0.004), e.clientX - rect.left, e.clientY - rect.top);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  });

  // 鼠标按住拖动也能滚（触屏本来就能滑）；拖过以后松手不算点击
  const drag = useRef<{ id: number; x: number; y: number; left: number; top: number; moving: boolean } | null>(null);
  const suppressClick = useRef(false);
  const onPointerDown = (e: ReactPointerEvent<SVGSVGElement>): void => {
    const el = box.current;
    if (!el || e.pointerType !== 'mouse' || e.button !== 0) return;
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, left: el.scrollLeft, top: el.scrollTop, moving: false };
  };
  const onPointerMove = (e: ReactPointerEvent<SVGSVGElement>): void => {
    const d = drag.current;
    const el = box.current;
    if (!d || !el || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moving) {
      if (Math.hypot(dx, dy) < 4) return;
      d.moving = true;
      try {
        // 拖出画面也接着拖；拿不到（指针已经不在了）也不影响滚动
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // 忽略
      }
      setActive(null);
    }
    el.scrollLeft = d.left - dx;
    el.scrollTop = d.top - dy;
  };
  const onPointerUp = (e: ReactPointerEvent<SVGSVGElement>): void => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    if (d.moving) {
      suppressClick.current = true;
      window.setTimeout(() => (suppressClick.current = false), 0);
    }
  };

  const hueOf = useMemo(() => new Map(graph.domains.map((d) => [d.id, d.hue])), [graph]);
  const learned = (id: string): boolean => states.get(id) === 'completed' || states.get(id) === 'known';

  // 内容（领域带、层级线、连线、节点）只在内容、状态、悬停变了时重新生成；滚动、缩放只改外面那层的变换
  const bands = useMemo(
    () => (
      <>
        {graph.subjects.map((s, i) => (
          <rect key={s.id} className={`map-subject map-subject-${i % 2}`} x={0} y={geo.y(s.start)} width={geo.width} height={geo.y(s.end) - geo.y(s.start)} />
        ))}
        {graph.domains.map((d) => (
          <rect key={d.id} className="map-sector" style={hueStyle(d.hue)} x={PAD / 2} y={geo.y(d.sector[0]) + 1} width={geo.width - PAD} height={geo.y(d.sector[1]) - geo.y(d.sector[0]) - 2} rx={8} />
        ))}
        {Array.from({ length: geo.maxLevel + 1 }, (_, level) => (
          <line key={level} className="map-level-line" x1={geo.x(level)} x2={geo.x(level)} y1={PAD / 2} y2={geo.height - PAD / 2} />
        ))}
      </>
    ),
    [graph, geo],
  );
  const flowing = useMemo(() => new Set((reveal?.flows ?? []).map(([a, b]) => `${a}>${b}`)), [reveal]);
  const edges = useMemo(
    () =>
      graph.edges.map(([from, to]) => {
        const a = lessons.get(from);
        const b = lessons.get(to);
        if (!a || !b) return null;
        const [x1, y1, x2, y2] = [geo.x(a.level), geo.y(a.y2d), geo.x(b.level), geo.y(b.y2d)];
        const bend = Math.min(COL / 2, (x2 - x1) / 2);
        const classes = ['map-edge', learned(from) && 'map-edge-lit', flowing.has(`${from}>${to}`) && 'map-edge-flow'].filter(Boolean).join(' ');
        return <path key={`${from}>${to}`} className={classes} style={hueStyle(hueOf.get(b.domain) ?? 230)} d={`M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`} />;
      }),
    // learned 由 states 决定
    [graph, lessons, geo, states, flowing, hueOf],
  );
  const nodes = useMemo(
    () =>
      graph.lessons.map((l) => {
        const state = states.get(l.id)!;
        const focus = (): void => setActive(l.id);
        const blur = (): void => setActive((a) => (a === l.id ? null : a));
        const classes = ['map-node', `map-node-${state}`, active === l.id && 'map-node-active', reveal?.newly.has(l.id) && 'map-node-new'].filter(Boolean).join(' ');
        return (
          <g
            key={l.id}
            className={classes}
            style={hueStyle(hueOf.get(l.domain) ?? 230)}
            transform={`translate(${geo.x(l.level)} ${geo.y(l.y2d)})`}
            role="link"
            tabIndex={0}
            aria-label={`${l.titleText}：${NODE_STATE_LABELS[state]}${l.status === 'written' ? '，未审' : ''}`}
            onClick={() => {
              if (!suppressClick.current) onOpen(l);
            }}
            onKeyDown={(e: KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpen(l);
              }
            }}
            onMouseEnter={() => {
              if (!drag.current?.moving) focus();
            }}
            onMouseLeave={blur}
            onFocus={() => {
              focus();
              // 用键盘移到画面外的节点时，滚过去
              const el = box.current;
              if (!el) return;
              const { sx: kx, sy: ky, w, h } = live.current;
              const px = HEAD_LEFT - el.scrollLeft + geo.x(l.level) * kx;
              const py = HEAD_TOP - el.scrollTop + geo.y(l.y2d) * ky;
              if (px < HEAD_LEFT + 20 || px > w - 60 || py < HEAD_TOP + 10 || py > h - 20) {
                el.scrollLeft = geo.x(l.level) * kx - (w - HEAD_LEFT) / 2;
                el.scrollTop = geo.y(l.y2d) * ky - (h - HEAD_TOP) / 2;
              }
            }}
            onBlur={blur}
          >
            <g className="map-glyph">
              <NodeGlyph state={state} />
            </g>
            {/* 标题按屏幕像素画，字号不随缩放变 */}
            <g className="map-text">
              <text className="map-label" x={14} y={4}>
                {shortTitle(l.titleText)}
                {l.status === 'written' && (
                  <tspan className="map-unreviewed" dx={6}>
                    未审
                  </tspan>
                )}
              </text>
            </g>
          </g>
        );
      }),
    [graph, states, active, reveal, geo, hueOf, onOpen],
  );

  const tx = HEAD_LEFT - scroll.left;
  const ty = HEAD_TOP - scroll.top;
  const sxOf = (level: number): number => tx + geo.x(level) * sx;
  const syOf = (deg: number): number => ty + geo.y(deg) * sy;
  const card = active ? lessons.get(active) : undefined;
  const levelStep = [1, 2, 5, 10].find((n) => COL * sx * n >= 26) ?? 10;
  const glyph = glyphScale(sy);
  const svgStyle = { '--kx': glyph / sx, '--ky': glyph / sy, '--ux': 1 / sx, '--uy': 1 / sy } as CSSProperties;
  const spacer = { width: Math.max(size.w, HEAD_LEFT + geo.width * sx + 24), height: Math.max(size.h, HEAD_TOP + geo.height * sy + 8) };

  return (
    <div className="map2d-wrap">
      <div className="map2d" ref={box} onScroll={(e) => setScroll({ left: e.currentTarget.scrollLeft, top: e.currentTarget.scrollTop })}>
        <div className="map2d-spacer" style={spacer}>
          <svg
            className={sy >= LABEL_ZOOM ? 'map2d-svg map2d-zoomed' : 'map2d-svg'}
            style={svgStyle}
            width={size.w}
            height={size.h}
            role="group"
            aria-label="知识星图：每个节点是一节，连线从前置指向后续，往右越深"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <g transform={`translate(${tx} ${ty}) scale(${sx} ${sy})`}>
              {bands}
              {edges}
              {nodes}
            </g>
            {/* 顶上一行：层级；左边一栏：学科和领域。滚动时不动 */}
            <rect className="map2d-head" x={0} y={0} width={size.w} height={HEAD_TOP} />
            <text className="map-level-label map2d-level-title" x={HEAD_LEFT - 12} y={HEAD_TOP / 2 + 4}>
              层级 →
            </text>
            {Array.from({ length: geo.maxLevel + 1 }, (_, level) => level)
              .filter((level) => level % levelStep === 0 && sxOf(level) > HEAD_LEFT - 4 && sxOf(level) < size.w - 8)
              .map((level) => (
                <text key={level} className="map-level-label map2d-level" x={sxOf(level)} y={HEAD_TOP / 2 + 4}>
                  {level}
                </text>
              ))}
            <rect className="map2d-head" x={0} y={HEAD_TOP} width={HEAD_LEFT} height={size.h - HEAD_TOP} />
            {graph.subjects.map((s) => {
              const top = Math.max(HEAD_TOP + 8, syOf(s.start));
              const bottom = Math.min(size.h - 8, syOf(s.end));
              if (bottom - top < 40) return null;
              const empty = !graph.domains.some((d) => d.subject === s.id);
              return (
                <text key={s.id} className="map-subject-label map2d-subject" x={18} y={(top + bottom) / 2}>
                  {subjectTitle(s.id)}
                  {empty ? '（还没有内容）' : ''}
                </text>
              );
            })}
            {(() => {
              // 领域名写在领域带正中；两个名字挨得太近时，后一个先不写（放大就出来）
              let last = -Infinity;
              return graph.domains.map((d) => {
                const y = syOf((d.sector[0] + d.sector[1]) / 2);
                if (y < HEAD_TOP + 6 || y > size.h - 4 || y - last < 12) return null;
                last = y;
                return (
                  <text key={d.id} className="map-domain-label map2d-domain" style={hueStyle(d.hue)} x={HEAD_LEFT - 12} y={y + 4}>
                    {d.titleText}
                  </text>
                );
              });
            })()}
          </svg>
        </div>
      </div>
      <div className="map2d-zoom" role="group" aria-label="缩放">
        <button type="button" className="map2d-zoom-button" onClick={() => zoomTo(sy * 1.6, size.w / 2, size.h / 2)} aria-label="放大">
          ＋
        </button>
        <button type="button" className="map2d-zoom-button" onClick={() => zoomTo(sy / 1.6, size.w / 2, size.h / 2)} aria-label="缩小">
          －
        </button>
      </div>
      {card && (
        <div
          className="map-card"
          role="tooltip"
          style={{
            left: sxOf(card.level) + 22 + CARD_WIDTH > size.w ? sxOf(card.level) - 22 - CARD_WIDTH : sxOf(card.level) + 22,
            top: Math.max(6, Math.min(syOf(card.y2d) - 26, size.h - 160)),
            width: CARD_WIDTH,
          }}
        >
          <MapCard lesson={card} state={states.get(card.id)!} hue={hueOf.get(card.domain) ?? 230} />
        </div>
      )}
    </div>
  );
}

export function StarMap() {
  const { graph } = useContent();
  const progress = useProgress();
  const navigate = useNavigate();
  const webgl = useMemo(supportsWebGL, []);
  const [mode, setModeState] = useState<MapMode>(() => (webgl ? readMode() : '2d'));
  // 「我现在能学什么」「复位」：每点一次加一，星图看到变化就转过去
  const [focusAvailable, setFocusAvailable] = useState(0);
  const [home, setHome] = useState(0);
  const [note, setNote] = useState<string | null>(null);

  const states = useMemo(() => new Map((graph?.lessons ?? []).map((l) => [l.id, nodeState(l, progress.state)])), [graph, progress.state]);
  const reveal = useMapReveal(graph, states, progress.ready);

  useEffect(() => {
    if (!note) return;
    const timer = window.setTimeout(() => setNote(null), 3000);
    return () => window.clearTimeout(timer);
  }, [note]);

  if (!graph) return null;

  const setMode = (next: MapMode): void => {
    setModeState(next);
    try {
      localStorage.setItem(MODE_KEY, next);
    } catch {
      // 记不住也不影响这次
    }
  };
  const open = (lesson: GraphLesson): void => void navigate(lessonPath(lesson.id));
  const showAvailable = (): void => {
    if (![...states.values()].includes('available')) setNote('现在没有可学的节点：要么都学完了，要么前置还没学完。');
    else setFocusAvailable((n) => n + 1);
  };
  const renderCard = (lesson: GraphLesson): ReactNode => (
    <MapCard lesson={lesson} state={states.get(lesson.id)!} hue={graph.domains.find((d) => d.id === lesson.domain)?.hue ?? 230} />
  );

  return (
    <section className="map" aria-labelledby="map-title">
      <div className="map-head">
        <h1 className="home-title" id="map-title">
          知识星图
        </h1>
        <p className="home-lead">
          {mode === '3d'
            ? '越往右越深；左右拖动沿着层级走，上下拖动转动圆筒，滚轮缩放，点一颗星走进那一节。'
            : '越往右越深；按住拖动或用滚动条移动（上下用滚轮，左右用 Shift+滚轮），Ctrl+滚轮或右下角按钮缩放，放大才显示标题。'}
        </p>
        <div className="map-tools">
          <button type="button" className="hint-button" onClick={showAvailable}>
            我现在能学什么
          </button>
          <button type="button" className="hint-button" onClick={() => setHome((n) => n + 1)} title={mode === '3d' ? '回到一开始的全景' : '缩到最小，回到左上角'}>
            复位
          </button>
          <div className="map-mode" role="group" aria-label="星图的看法">
            <button type="button" className={mode === '3d' ? 'chip chip-on' : 'chip'} aria-pressed={mode === '3d'} disabled={!webgl} onClick={() => setMode('3d')} title={webgl ? undefined : '这个浏览器不支持 WebGL，只能看平面图'}>
              立体
            </button>
            <button type="button" className={mode === '2d' ? 'chip chip-on' : 'chip'} aria-pressed={mode === '2d'} onClick={() => setMode('2d')}>
              平面
            </button>
          </div>
        </div>
      </div>
      <Legend mode={mode} />
      {note && (
        <p className="map-note" role="status">
          {note}
        </p>
      )}
      {mode === '3d' ? (
        <Suspense fallback={<div className="map3d map3d-loading">正在载入立体星图…</div>}>
          <StarMap3D graph={graph} states={states} reveal={reveal} onOpen={open} focusAvailable={focusAvailable} home={home} renderCard={renderCard} />
        </Suspense>
      ) : (
        <StarMap2D graph={graph} states={states} reveal={reveal} onOpen={open} focusAvailable={focusAvailable} home={home} />
      )}
    </section>
  );
}

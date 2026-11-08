// 首页的知识星图，见 docs/plan.md「立体知识图谱与动态效果」。两种看法一键切换，选哪种记在这台设备的浏览器里：
// - 立体（StarMap3D，three.js，按需加载）：高度是层级，领域占圆周上的扇区，可以旋转、缩放、平移；
// - 平面（展开图）：把圆柱展开铺平，横轴是领域扇区的角度，纵轴是层级，越往上越深。
// 坐标在构建时算好（compiler/layout.ts）；节点的五种状态见 shared/node-state.ts。
// 悬停（或用键盘移到节点上）显示标题和一句话总结，点击进入小节。学完一节回到星图时，这颗星点亮，光沿连线流向刚解锁的节点。

import { lazy, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import type { Graph, GraphLesson } from '../../shared/content-types';
import { lessonPath } from '../../shared/ids';
import { missingPrereqs, NODE_STATE_LABELS, nodeState, type NodeState } from '../../shared/node-state';
import { useContent } from '../content/ContentContext';
import { Rich } from '../content/Rich';
import { useProgress } from '../progress/ProgressContext';
import { subjectTitle } from '../subjects';

const StarMap3D = lazy(() => import('./StarMap3D'));

/** 相邻两层的间距、上下左右留的地方（像素）。 */
const ROW = 92;
const TOP = 52;
const BOTTOM = 48;
const LEFT = 64;
const RIGHT = 20;
/** 比这窄时横向滚动，节点不挤在一起。 */
const MIN_WIDTH = 720;
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

function StarMap2D({ graph, states, reveal, onOpen }: { graph: Graph; states: Map<string, NodeState>; reveal: Reveal | null; onOpen: (l: GraphLesson) => void }) {
  const { lessons } = useContent();
  const scroller = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(960);
  const [active, setActive] = useState<string | null>(null);

  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const update = (): void => setWidth(Math.max(MIN_WIDTH, el.clientWidth));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const maxLevel = Math.max(0, ...graph.lessons.map((l) => l.level));
  const height = TOP + maxLevel * ROW + BOTTOM;
  const px = (deg: number): number => LEFT + (deg / 360) * (width - LEFT - RIGHT);
  const py = (level: number): number => TOP + (maxLevel - level) * ROW;
  const hueOf = new Map(graph.domains.map((d) => [d.id, d.hue]));
  const learned = (id: string): boolean => states.get(id) === 'completed' || states.get(id) === 'known';
  const flowing = new Set((reveal?.flows ?? []).map(([a, b]) => `${a}>${b}`));
  const card = active ? lessons.get(active) : undefined;

  return (
    <div className="map-scroll" ref={scroller}>
      <div className="map-canvas" style={{ width, height }}>
        <svg width={width} height={height} role="group" aria-label="知识星图：每个节点是一节，连线从前置指向后续">
          {graph.subjects.map((s, i) => {
            const empty = !graph.domains.some((d) => d.subject === s.id);
            return (
              <g key={s.id}>
                <rect className={`map-subject map-subject-${i % 2}`} x={px(s.start)} y={0} width={px(s.end) - px(s.start)} height={height} />
                <text className="map-subject-label" x={(px(s.start) + px(s.end)) / 2} y={24}>
                  {subjectTitle(s.id)}
                  {empty ? '（还没有内容）' : ''}
                </text>
              </g>
            );
          })}
          {graph.domains.map((d) => (
            <g key={d.id} style={hueStyle(d.hue)}>
              <rect className="map-sector" x={px(d.sector[0])} y={TOP - 22} width={px(d.sector[1]) - px(d.sector[0])} height={maxLevel * ROW + 44} rx={10} />
              <text className="map-domain-label" x={(px(d.sector[0]) + px(d.sector[1])) / 2} y={height - 14}>
                {d.titleText}
              </text>
            </g>
          ))}
          {Array.from({ length: maxLevel + 1 }, (_, level) => (
            <g key={level}>
              <line className="map-level-line" x1={LEFT - 8} x2={width - RIGHT} y1={py(level)} y2={py(level)} />
              <text className="map-level-label" x={10} y={py(level) + 4}>
                层级 {level}
              </text>
            </g>
          ))}
          {graph.edges.map(([from, to]) => {
            const a = lessons.get(from);
            const b = lessons.get(to);
            if (!a || !b) return null;
            const [x1, y1, x2, y2] = [px(a.x2d), py(a.level), px(b.x2d), py(b.level)];
            const bend = Math.min(ROW / 2, (y1 - y2) / 2);
            const classes = ['map-edge', learned(from) && 'map-edge-lit', flowing.has(`${from}>${to}`) && 'map-edge-flow'].filter(Boolean).join(' ');
            return (
              <path
                key={`${from}>${to}`}
                className={classes}
                style={hueStyle(hueOf.get(b.domain) ?? 230)}
                d={`M ${x1} ${y1} C ${x1} ${y1 - bend}, ${x2} ${y2 + bend}, ${x2} ${y2}`}
              />
            );
          })}
          {graph.lessons.map((l) => {
            const state = states.get(l.id)!;
            const focus = (): void => setActive(l.id);
            const blur = (): void => setActive((a) => (a === l.id ? null : a));
            const classes = ['map-node', `map-node-${state}`, active === l.id && 'map-node-active', reveal?.newly.has(l.id) && 'map-node-new'].filter(Boolean).join(' ');
            return (
              <g
                key={l.id}
                className={classes}
                style={hueStyle(hueOf.get(l.domain) ?? 230)}
                transform={`translate(${px(l.x2d)} ${py(l.level)})`}
                role="link"
                tabIndex={0}
                aria-label={`${l.titleText}：${NODE_STATE_LABELS[state]}${l.status === 'written' ? '，未审' : ''}`}
                onClick={() => onOpen(l)}
                onKeyDown={(e: KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpen(l);
                  }
                }}
                onMouseEnter={focus}
                onMouseLeave={blur}
                onFocus={focus}
                onBlur={blur}
              >
                <NodeGlyph state={state} />
                <text className="map-label" x={15} y={4}>
                  {l.titleText}
                  {l.status === 'written' && (
                    <tspan className="map-unreviewed" dx={6}>
                      未审
                    </tspan>
                  )}
                </text>
              </g>
            );
          })}
        </svg>
        {card && (
          <div
            className="map-card"
            role="tooltip"
            style={{
              left: px(card.x2d) + 22 + CARD_WIDTH > width ? px(card.x2d) - 22 - CARD_WIDTH : px(card.x2d) + 22,
              top: Math.max(6, Math.min(py(card.level) - 26, height - 150)),
              width: CARD_WIDTH,
            }}
          >
            <MapCard lesson={card} state={states.get(card.id)!} hue={hueOf.get(card.domain) ?? 230} />
          </div>
        )}
      </div>
    </div>
  );
}

export function StarMap() {
  const { graph } = useContent();
  const progress = useProgress();
  const navigate = useNavigate();
  const webgl = useMemo(supportsWebGL, []);
  const [mode, setModeState] = useState<MapMode>(() => (webgl ? readMode() : '2d'));
  // 「我现在能学什么」：每点一次加一，立体图看到变化就把镜头转过去
  const [focusAvailable, setFocusAvailable] = useState(0);
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
        <p className="home-lead">{mode === '3d' ? '越往上越深；拖动旋转，滚轮缩放，右键拖动平移，点一颗星走进那一节。' : '越往上越深；点一颗星走进那一节。'}</p>
        <div className="map-tools">
          {mode === '3d' && (
            <button type="button" className="hint-button" onClick={showAvailable}>
              我现在能学什么
            </button>
          )}
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
          <StarMap3D graph={graph} states={states} reveal={reveal} onOpen={open} focusAvailable={focusAvailable} renderCard={renderCard} />
        </Suspense>
      ) : (
        <StarMap2D graph={graph} states={states} reveal={reveal} onOpen={open} />
      )}
    </section>
  );
}

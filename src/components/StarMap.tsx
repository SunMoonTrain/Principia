// 首页的知识星图（平面展开图，见 docs/plan.md「立体知识图谱与动态效果」）：横轴是领域扇区的角度，
// 数学占左半边、物理占右半边；纵轴是层级，越往上越深。坐标在构建时算好（compiler/layout.ts）。
// 节点的五种状态见 shared/node-state.ts。悬停或用键盘移到节点上显示标题和一句话总结，点击进入小节。

import { useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router';
import type { GraphLesson } from '../../shared/content-types';
import { lessonPath } from '../../shared/ids';
import { missingPrereqs, NODE_STATE_LABELS, nodeState, type NodeState } from '../../shared/node-state';
import { useContent } from '../content/ContentContext';
import { Rich } from '../content/Rich';
import { useProgress } from '../progress/ProgressContext';
import { subjectTitle } from '../subjects';

/** 相邻两层的间距、上下左右留的地方（像素）。 */
const ROW = 92;
const TOP = 52;
const BOTTOM = 48;
const LEFT = 64;
const RIGHT = 20;
/** 比这窄时横向滚动，节点不挤在一起。 */
const MIN_WIDTH = 720;
const CARD_WIDTH = 300;

const hueStyle = (hue: number): CSSProperties => ({ '--hue': hue }) as CSSProperties;

/** 节点的样子：可学的有呼吸的光，已完成的实心，已会的是带圈的点，够不着的暗，待写的是虚线圈。 */
function NodeGlyph({ state }: { state: NodeState }) {
  return (
    <>
      {state === 'available' && <circle className="map-glow" r={17} />}
      {state === 'completed' && <circle className="map-halo" r={15} />}
      <circle className="map-dot" r={9} />
      {state === 'known' && <circle className="map-dot-inner" r={3.5} />}
    </>
  );
}

function Legend() {
  const states: NodeState[] = ['completed', 'known', 'available', 'locked', 'outline'];
  return (
    <ul className="map-legend" aria-label="图例">
      {states.map((s) => (
        <li key={s}>
          <svg width="22" height="22" viewBox="-11 -11 22 22" aria-hidden="true">
            <g className={`map-node map-node-${s}`} style={hueStyle(230)}>
              <NodeGlyph state={s} />
            </g>
          </svg>
          {NODE_STATE_LABELS[s]}
        </li>
      ))}
      <li>
        <span className="map-legend-unreviewed">未审</span>写好但还没审
      </li>
    </ul>
  );
}

export function StarMap() {
  const { graph, lessons } = useContent();
  const progress = useProgress();
  const navigate = useNavigate();
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
  }, [graph]);

  if (!graph) return null;

  const maxLevel = Math.max(0, ...graph.lessons.map((l) => l.level));
  const height = TOP + maxLevel * ROW + BOTTOM;
  const px = (deg: number): number => LEFT + (deg / 360) * (width - LEFT - RIGHT);
  const py = (level: number): number => TOP + (maxLevel - level) * ROW;
  const hueOf = new Map(graph.domains.map((d) => [d.id, d.hue]));
  const states = new Map(graph.lessons.map((l) => [l.id, nodeState(l, progress.state)]));
  const learned = (id: string): boolean => states.get(id) === 'completed' || states.get(id) === 'known';
  const open = (lesson: GraphLesson): void => void navigate(lessonPath(lesson.id));

  const card = active ? lessons.get(active) : undefined;
  const cardState = card ? states.get(card.id)! : null;

  return (
    <section className="map" aria-labelledby="map-title">
      <div className="map-head">
        <h1 className="home-title" id="map-title">
          知识星图
        </h1>
        <p className="home-lead">越往上越深；点一颗星走进那一节。</p>
      </div>
      <Legend />
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
              return (
                <path
                  key={`${from}>${to}`}
                  className={learned(from) ? 'map-edge map-edge-lit' : 'map-edge'}
                  style={hueStyle(hueOf.get(b.domain) ?? 230)}
                  d={`M ${x1} ${y1} C ${x1} ${y1 - bend}, ${x2} ${y2 + bend}, ${x2} ${y2}`}
                />
              );
            })}
            {graph.lessons.map((l) => {
              const state = states.get(l.id)!;
              const focus = (): void => setActive(l.id);
              const blur = (): void => setActive((a) => (a === l.id ? null : a));
              return (
                <g
                  key={l.id}
                  className={`map-node map-node-${state}${active === l.id ? ' map-node-active' : ''}`}
                  style={hueStyle(hueOf.get(l.domain) ?? 230)}
                  transform={`translate(${px(l.x2d)} ${py(l.level)})`}
                  role="link"
                  tabIndex={0}
                  aria-label={`${l.titleText}：${NODE_STATE_LABELS[state]}${l.status === 'written' ? '，未审' : ''}`}
                  onClick={() => open(l)}
                  onKeyDown={(e: KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      open(l);
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
          {card && cardState && (
            <div
              className="map-card"
              role="tooltip"
              style={{
                left: px(card.x2d) + 22 + CARD_WIDTH > width ? px(card.x2d) - 22 - CARD_WIDTH : px(card.x2d) + 22,
                top: Math.max(6, Math.min(py(card.level) - 26, height - 150)),
                width: CARD_WIDTH,
              }}
            >
              <div className="map-card-title">
                <Rich value={card.title} inert />
              </div>
              <div className="map-card-tags">
                <span className={`map-state map-state-${cardState}`} style={hueStyle(hueOf.get(card.domain) ?? 230)}>
                  {NODE_STATE_LABELS[cardState]}
                </span>
                {card.status === 'written' && <span className="badge badge-unreviewed">未审</span>}
                <span className="map-card-level">层级 {card.level}</span>
              </div>
              <div className="map-card-text">
                <Rich value={card.status === 'outline' ? card.goal : (card.summary ?? card.goal)} inert />
              </div>
              {cardState === 'locked' && (
                <div className="map-card-missing">
                  还差：
                  {missingPrereqs(card, progress.state)
                    .map((id) => lessons.get(id)?.titleText ?? id)
                    .join('、')}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

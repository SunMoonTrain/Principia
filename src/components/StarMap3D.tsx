// 立体星图（three.js + react-three-fiber），见 docs/plan.md「立体知识图谱与动态效果」：
// 一个横放的圆筒，沿轴往右越深；每个领域是圆筒上的一条（数学那半圈正对镜头，物理在背面），节点在一个圆筒壳里，坐标在构建时算好。
// 节点用实例化渲染（每种状态一个 InstancedMesh）；只在需要时重画，有动画时最多每秒 30 帧。
// 左右拖动沿着层级走，上下拖动转动圆筒，滚轮缩放（以鼠标所在处为准）；悬停显示卡片，点击时镜头飞向那颗星再进入小节。
// 系统设置了「减少动态效果」时：光晕不呼吸、没有点亮动画和镜头飞行。
// 这个文件连同 three.js 按需加载（切到「立体」时才下载）。

import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode, type RefObject } from 'react';
import * as THREE from 'three';
import type { Graph, GraphLesson } from '../../shared/content-types';
import { LEVEL_GAP, position3d, RADIUS_INNER, RADIUS_OUTER } from '../../shared/map';
import type { NodeState } from '../../shared/node-state';
import { subjectTitle } from '../subjects';
import { prefersReducedMotion, type Reveal } from './StarMap';

const RAD = Math.PI / 180;
const CARD_WIDTH = 300;
/** 镜头的上下视角（度）。 */
const FOV = 45;
/** 圆筒壳中间的半径：上下拖动时，这一圈跟着鼠标走。 */
const RADIUS_MID = (RADIUS_INNER + RADIUS_OUTER) / 2;
/** 领域条、层级圈画在节点外面一点。 */
const SHELL = RADIUS_OUTER + 0.6;
/** 滚轮最多推到离轴这么近（还在圆筒外面）；点一颗星时飞到它跟前，不受这个限制。 */
const MIN_DISTANCE = RADIUS_OUTER + 8;

/**
 * 发光点（THREE.Points）的 size 不是场景单位：画出来的直径相当于 size × tan(视角/2) 个场景单位。
 * 这里按场景单位给，换算成 size。
 */
function pointSize(diameter: number): number {
  return diameter / Math.tan((FOV / 2) * RAD);
}

interface Props {
  graph: Graph;
  states: Map<string, NodeState>;
  reveal: Reveal | null;
  onOpen(lesson: GraphLesson): void;
  /** 「我现在能学什么」：每次值变了就把镜头对准所有可学的节点。 */
  focusAvailable: number;
  /** 「全图」：每次值变了就回到一开始的全景。 */
  home: number;
  renderCard(lesson: GraphLesson): ReactNode;
}

interface Item {
  lesson: GraphLesson;
  state: NodeState;
  /** 圆筒自己的坐标（圆筒转动时跟着转）。 */
  position: THREE.Vector3;
  color: THREE.Color;
}

/** 镜头总是正对圆筒（看向 -z）：x 是镜头对着的位置（沿轴），distance 是离轴多远；roll 是圆筒绕轴转过的角度（弧度）。 */
interface DrumView {
  x: number;
  roll: number;
  distance: number;
}

interface Rig {
  current(): DrumView;
  flyTo(view: DrumView, ms: number, done?: () => void): void;
}

/** 节点绕轴的角度（弧度）：0 在正上方，π/2 正对镜头。 */
const phiOf = (p: THREE.Vector3): number => Math.atan2(p.z, p.y);

/** 把角度为 phi 的节点转到正对镜头要转到的 roll，取离现在最近的那一圈。 */
function rollToFront(phi: number, current: number): number {
  const target = Math.PI / 2 - phi;
  return target + 2 * Math.PI * Math.round((current - target) / (2 * Math.PI));
}

// ---------- 颜色跟着亮色、暗色主题 ----------

interface Palette {
  dark: boolean;
  text: string;
  muted: string;
  border: string;
  warn: string;
  sat: number;
  light: number;
}

function readPalette(): Palette {
  const style = getComputedStyle(document.documentElement);
  const v = (name: string): string => style.getPropertyValue(name).trim();
  return {
    dark: document.documentElement.dataset.theme === 'dark',
    text: v('--text') || '#888',
    muted: v('--muted') || '#888',
    border: v('--border') || '#888',
    warn: v('--warn') || '#c80',
    sat: parseFloat(v('--map-sat')) / 100 || 0.6,
    light: parseFloat(v('--map-light')) / 100 || 0.5,
  };
}

function usePalette(): Palette {
  const [palette, setPalette] = useState(readPalette);
  useEffect(() => {
    const observer = new MutationObserver(() => setPalette(readPalette()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  return palette;
}

// ---------- 小工具：贴图、文字 ----------

/** 中间亮、往外变淡的圆点，给光晕和流动的光用。 */
function glowTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.35, 'rgba(255,255,255,0.45)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** 一圈细环，悬停时圈住那颗星。 */
function ringTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.strokeStyle = 'rgba(255,255,255,1)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(32, 32, 26, 0, Math.PI * 2);
  ctx.stroke();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** 文字做成总是朝着镜头的贴片；height 是文字在场景里的高度。 */
function textSprite(text: string, color: string, height: number, weight = 600): THREE.Sprite {
  const px = 64;
  const font = `${weight} ${px}px ${getComputedStyle(document.body).fontFamily}`;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  ctx.font = font;
  canvas.width = Math.ceil(ctx.measureText(text).width) + 16;
  canvas.height = Math.ceil(px * 1.35);
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 8, canvas.height / 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }));
  sprite.scale.set((height * canvas.width) / canvas.height, height, 1);
  sprite.raycast = () => undefined;
  return sprite;
}

function disposeObject(object: THREE.Object3D): void {
  object.traverse((child) => {
    const node = child as THREE.Mesh;
    node.geometry?.dispose();
    const materials = Array.isArray(node.material) ? node.material : node.material ? [node.material] : [];
    for (const m of materials) {
      (m as THREE.MeshBasicMaterial).map?.dispose();
      m.dispose();
    }
  });
}

/** 用 useMemo 造出来的 three.js 对象，换掉或卸载时释放显存。 */
function useDisposable<T extends THREE.Object3D>(make: () => T, deps: unknown[]): T {
  const object = useMemo(make, deps);
  useEffect(() => () => disposeObject(object), [object]);
  return object;
}

// ---------- 场景里的各部分 ----------

/** 不用每帧都画：有动画时每秒 30 帧，静止时只在拖动、悬停等变化时画。画布尺寸定下来（或变了）时也要画一次。 */
function Ticker({ active }: { active: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  const size = useThree((s) => s.size);
  useEffect(() => {
    invalidate();
    // 浏览器下一帧排版完成后再画一次，免得刚打开时还是空白
    const id = requestAnimationFrame(() => invalidate());
    return () => cancelAnimationFrame(id);
  }, [size, invalidate]);
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => {
      if (!document.hidden) invalidate();
    }, 1000 / 30);
    return () => window.clearInterval(id);
  }, [active, invalidate]);
  return null;
}

/**
 * 操作：左右拖动沿轴走，上下拖动转圆筒（圆筒中间那一圈跟着鼠标走），右键拖动一样；滚轮推近拉远，鼠标所在的那一层留在原处。
 * 一开始（以及窗口大小变了、还没动过时）是全景；「全图」回到全景。
 */
function DrumControls({
  home,
  homeSignal,
  span,
  maxDistance,
  drum,
  rig,
  reduce,
}: {
  home: DrumView;
  homeSignal: number;
  span: [number, number];
  maxDistance: number;
  drum: RefObject<THREE.Group | null>;
  rig: MutableRefObject<Rig | null>;
  reduce: boolean;
}) {
  const { camera, gl, invalidate } = useThree();
  const view = useRef<DrumView>({ ...home });
  const moved = useRef(false);
  const tween = useRef<{ from: DrumView; to: DrumView; start: number; ms: number; done?: () => void } | null>(null);

  const apply = useCallback(() => {
    const v = view.current;
    camera.position.set(v.x, 0, v.distance);
    camera.lookAt(v.x, 0, 0);
    if (drum.current) drum.current.rotation.x = v.roll;
    invalidate();
  }, [camera, drum, invalidate]);

  useLayoutEffect(() => {
    if (moved.current) return;
    view.current = { ...home };
    apply();
  }, [home, apply]);

  const flyTo = useCallback(
    (to: DrumView, ms: number, done?: () => void) => {
      if (ms <= 0) {
        tween.current = null;
        view.current = { ...to };
        apply();
        done?.();
        return;
      }
      tween.current = { from: { ...view.current }, to: { ...to }, start: performance.now(), ms, done };
      invalidate();
    },
    [apply, invalidate],
  );
  rig.current = { current: () => ({ ...view.current }), flyTo };

  const firstHome = useRef(homeSignal);
  useEffect(() => {
    if (homeSignal === firstHome.current) return;
    moved.current = false;
    flyTo(home, reduce ? 0 : 700);
  }, [homeSignal]);

  useEffect(() => {
    const el = gl.domElement;
    const unitsPerPx = (): number => (2 * view.current.distance * Math.tan((FOV / 2) * RAD)) / Math.max(1, el.clientHeight);
    const clampX = (x: number): number => Math.min(span[1], Math.max(span[0], x));
    let drag: { id: number; x: number; y: number; from: DrumView } | null = null;
    const down = (e: PointerEvent): void => {
      if (e.button !== 0 && e.button !== 2) return;
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, from: { ...view.current } };
      tween.current = null;
    };
    const move = (e: PointerEvent): void => {
      if (!drag || drag.id !== e.pointerId) return;
      const u = unitsPerPx();
      moved.current = true;
      view.current = {
        ...drag.from,
        x: clampX(drag.from.x - (e.clientX - drag.x) * u),
        roll: drag.from.roll + ((e.clientY - drag.y) * u) / RADIUS_MID,
      };
      apply();
    };
    const up = (e: PointerEvent): void => {
      if (drag?.id === e.pointerId) drag = null;
    };
    const wheel = (e: WheelEvent): void => {
      e.preventDefault();
      tween.current = null;
      moved.current = true;
      const rect = el.getBoundingClientRect();
      const offset = e.clientX - rect.left - rect.width / 2;
      const at = view.current.x + offset * unitsPerPx();
      view.current = { ...view.current, distance: Math.min(maxDistance, Math.max(MIN_DISTANCE, view.current.distance * Math.exp(e.deltaY * 0.0015))) };
      view.current.x = clampX(at - offset * unitsPerPx());
      apply();
    };
    const menu = (e: Event): void => e.preventDefault();
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    el.addEventListener('wheel', wheel, { passive: false });
    el.addEventListener('contextmenu', menu);
    return () => {
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      el.removeEventListener('wheel', wheel);
      el.removeEventListener('contextmenu', menu);
    };
  }, [gl, apply, span, maxDistance]);

  useFrame(() => {
    const tw = tween.current;
    if (!tw) return;
    const k = Math.min(1, (performance.now() - tw.start) / tw.ms);
    const e = k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2;
    view.current = {
      x: tw.from.x + (tw.to.x - tw.from.x) * e,
      roll: tw.from.roll + (tw.to.roll - tw.from.roll) * e,
      distance: tw.from.distance + (tw.to.distance - tw.from.distance) * e,
    };
    apply();
    if (k >= 1) {
      tween.current = null;
      tw.done?.();
    }
  });
  return null;
}

/** 圆筒上的东西（跟着圆筒转）：每个领域一条，沿着这一条隔一段写一次领域名；两个学科的分界线；右端写学科名。 */
function DrumFrame({ graph, palette, domainColor, maxLevel }: { graph: Graph; palette: Palette; domainColor: (hue: number) => THREE.Color; maxLevel: number }) {
  const group = useDisposable(() => {
    const g = new THREE.Group();
    const from = -1.6 * LEVEL_GAP;
    const to = (maxLevel + 0.8) * LEVEL_GAP;
    for (const d of graph.domains) {
      const [start, end] = d.sector;
      // CylinderGeometry 绕 y 轴，转成绕 x 轴以后角度差 90°（θ = 我们的角度 - 90°）
      const stripe = new THREE.Mesh(
        new THREE.CylinderGeometry(SHELL, SHELL, to - from, Math.max(4, Math.ceil((end - start) / 3)), 1, true, (start - 90) * RAD, (end - start) * RAD),
        new THREE.MeshBasicMaterial({ color: domainColor(d.hue), transparent: true, opacity: palette.dark ? 0.1 : 0.14, side: THREE.DoubleSide, depthWrite: false }),
      );
      stripe.rotation.z = -Math.PI / 2;
      stripe.position.x = (from + to) / 2;
      stripe.raycast = () => undefined;
      g.add(stripe);
      // 领域名写在圆筒两端，不放在中间挡住节点
      const label = textSprite(d.titleText, `#${domainColor(d.hue).getHexString(THREE.SRGBColorSpace)}`, 0.8);
      label.position.set(...position3d((start + end) / 2, SHELL + 1.2, -1.4));
      const right = label.clone();
      right.position.set(...position3d((start + end) / 2, SHELL + 1.2, maxLevel + 1.4));
      g.add(label, right);
    }
    // 两个学科的分界线（沿着圆筒），学科名写在右端
    const border = new THREE.LineBasicMaterial({ color: palette.border, transparent: true, opacity: 0.9 });
    graph.subjects.forEach((s) => {
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...position3d(s.start, SHELL, from / LEVEL_GAP)), new THREE.Vector3(...position3d(s.start, SHELL, to / LEVEL_GAP))]),
        border,
      );
      line.raycast = () => undefined;
      g.add(line);
      const empty = !graph.domains.some((d) => d.subject === s.id);
      const label = textSprite(`${subjectTitle(s.id)}${empty ? '（还没有内容）' : ''}`, palette.text, 1.3);
      label.position.set(...position3d((s.start + s.end) / 2, RADIUS_MID, maxLevel + 2.6));
      g.add(label);
    });
    return g;
  }, [graph, palette, domainColor, maxLevel]);
  // 转到背面的领域名、学科名变淡，免得透过圆筒和正面的叠在一起
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    for (const child of group.children) {
      if (!(child instanceof THREE.Sprite)) continue;
      child.getWorldPosition(v);
      child.material.opacity = v.z >= -0.5 ? 1 : 0.15;
    }
  });
  return <primitive object={group} />;
}

/** 不跟着圆筒转的东西：中轴、每一层的圈和层级数字（在圆筒上方）。 */
function Rulers({ palette, maxLevel }: { palette: Palette; maxLevel: number }) {
  const group = useDisposable(() => {
    const g = new THREE.Group();
    const axis = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-1.6 * LEVEL_GAP, 0, 0), new THREE.Vector3((maxLevel + 0.8) * LEVEL_GAP, 0, 0)]),
      new THREE.LineBasicMaterial({ color: palette.border }),
    );
    axis.raycast = () => undefined;
    g.add(axis);
    const ring = new THREE.LineBasicMaterial({ color: palette.border, transparent: true, opacity: palette.dark ? 0.35 : 0.6 });
    for (let level = 0; level <= maxLevel; level++) {
      const circle = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 96 }, (_, i) => new THREE.Vector3(...position3d((i * 360) / 96, SHELL, level)))), ring);
      circle.raycast = () => undefined;
      g.add(circle);
      const label = textSprite(String(level), palette.muted, 0.9, 500);
      label.position.set(level * LEVEL_GAP, SHELL + 2.2, 0);
      g.add(label);
    }
    const title = textSprite('层级 →', palette.muted, 0.9, 500);
    title.position.set(-2.4 * LEVEL_GAP, SHELL + 2.2, 0);
    g.add(title);
    return g;
  }, [palette, maxLevel]);
  return <primitive object={group} />;
}

/** 连线：只有直接前置；从点亮的前置（已完成、已会）出发的用后续那一节的领域颜色，其余淡灰。 */
function Edges({ graph, items, palette, domainColor }: { graph: Graph; items: Map<string, Item>; palette: Palette; domainColor: (hue: number) => THREE.Color }) {
  const lines = useDisposable(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const muted = new THREE.Color(palette.border);
    const hues = new Map(graph.domains.map((d) => [d.id, d.hue]));
    for (const [from, to] of graph.edges) {
      const a = items.get(from);
      const b = items.get(to);
      if (!a || !b) continue;
      const lit = a.state === 'completed' || a.state === 'known';
      const color = lit ? domainColor(hues.get(b.lesson.domain) ?? 230) : muted;
      positions.push(...a.position.toArray(), ...b.position.toArray());
      colors.push(...color.toArray(), ...color.toArray());
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const segments = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9, depthWrite: false }));
    segments.raycast = () => undefined;
    return segments;
  }, [graph, items, palette, domainColor]);
  return <primitive object={lines} />;
}

/** 一种状态的所有节点，用一个 InstancedMesh 画。 */
function NodeLayer({ items, geometry, material }: { items: Item[]; geometry: THREE.BufferGeometry; material: THREE.Material }) {
  const mesh = useMemo(() => {
    const m = new THREE.InstancedMesh(geometry, material, Math.max(1, items.length));
    m.raycast = () => undefined;
    return m;
  }, [geometry, material, items.length]);
  useLayoutEffect(() => {
    const matrix = new THREE.Matrix4();
    items.forEach((item, i) => {
      mesh.setMatrixAt(i, matrix.makeTranslation(item.position));
      mesh.setColorAt(i, item.color);
    });
    mesh.count = items.length;
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [mesh, items]);
  useEffect(() => () => mesh.dispose(), [mesh]);
  return <primitive object={mesh} />;
}

/** 一组发光的点（光晕、未审的小橙点）；breathe 时大小和亮度缓慢起伏。 */
function Glow({ points, colors, size, opacity, breathe, additive, texture }: { points: THREE.Vector3[]; colors: THREE.Color[]; size: number; opacity: number; breathe?: boolean; additive: boolean; texture: THREE.Texture }) {
  const object = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points.flatMap((p) => p.toArray()), 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors.flatMap((c) => c.toArray()), 3));
    const material = new THREE.PointsMaterial({
      size,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity,
      depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    const p = new THREE.Points(geometry, material);
    p.raycast = () => undefined;
    return p;
  }, [points, colors, size, opacity, additive, texture]);
  useEffect(
    () => () => {
      object.geometry.dispose();
      (object.material as THREE.Material).dispose();
    },
    [object],
  );
  useFrame(({ clock }) => {
    if (!breathe) return;
    const k = (Math.sin((clock.elapsedTime * 2 * Math.PI) / 3.2) + 1) / 2;
    const material = object.material as THREE.PointsMaterial;
    material.opacity = opacity * (0.35 + 0.65 * k);
    material.size = size * (0.85 + 0.3 * k);
  });
  return <primitive object={object} />;
}

/** 学完一节回到星图：新点亮的星闪一下，光沿连线流向刚解锁的节点，一共三遍。 */
function RevealEffects({ reveal, items, texture, additive }: { reveal: Reveal; items: Map<string, Item>; texture: THREE.Texture; additive: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  const start = useRef(performance.now());
  const [done, setDone] = useState(false);
  const bursts = useMemo(() => [...reveal.newly].map((id) => items.get(id)).filter((i): i is Item => !!i), [reveal, items]);
  const flows = useMemo(
    () =>
      reveal.flows
        .map(([a, b]) => [items.get(a), items.get(b)] as const)
        .filter((pair): pair is readonly [Item, Item] => !!pair[0] && !!pair[1]),
    [reveal, items],
  );
  const burst = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(bursts.flatMap((b) => b.position.toArray()), 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(bursts.flatMap((b) => b.color.toArray()), 3));
    const p = new THREE.Points(geometry, new THREE.PointsMaterial({ size: 0, map: texture, vertexColors: true, transparent: true, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending }));
    p.raycast = () => undefined;
    return p;
  }, [bursts, texture, additive]);
  const sparks = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(new Array(flows.length * 3).fill(0), 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(flows.flatMap(([, b]) => b.color.toArray()), 3));
    const p = new THREE.Points(geometry, new THREE.PointsMaterial({ size: pointSize(1.1), map: texture, vertexColors: true, transparent: true, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending }));
    p.raycast = () => undefined;
    return p;
  }, [flows, texture, additive]);
  useEffect(
    () => () => {
      for (const p of [burst, sparks]) {
        p.geometry.dispose();
        (p.material as THREE.Material).dispose();
      }
    },
    [burst, sparks],
  );

  useFrame(() => {
    if (done) return;
    const t = (performance.now() - start.current) / 1000;
    // 点亮：1.2 秒里先放大再收回
    const k = Math.min(1, t / 1.2);
    const burstMaterial = burst.material as THREE.PointsMaterial;
    burstMaterial.size = pointSize(4) * Math.sin(Math.PI * k);
    burstMaterial.opacity = 1 - k * 0.6;
    // 流光：0.6 秒以后开始，每遍 1.1 秒，三遍
    const positions = sparks.geometry.getAttribute('position') as THREE.BufferAttribute;
    const f = t < 0.6 ? -1 : ((t - 0.6) % 1.1) / 1.1;
    flows.forEach(([a, b], i) => {
      const p = f < 0 ? a.position : new THREE.Vector3().lerpVectors(a.position, b.position, f);
      positions.setXYZ(i, p.x, p.y, p.z);
    });
    positions.needsUpdate = true;
    (sparks.material as THREE.PointsMaterial).opacity = f < 0 || t > 3.9 ? 0 : 1 - f * 0.4;
    if (t > 4) setDone(true);
    invalidate();
  });
  if (done) return null;
  return (
    <>
      <primitive object={burst} />
      <primitive object={sparks} />
    </>
  );
}

/** 悬停卡片跟着那颗星在屏幕上的位置走（拖动、转动、缩放时也跟着）。 */
function CardTracker({ position, drum, cardRef }: { position: THREE.Vector3 | null; drum: RefObject<THREE.Group | null>; cardRef: MutableRefObject<HTMLDivElement | null> }) {
  const { camera, size, invalidate } = useThree();
  const v = useMemo(() => new THREE.Vector3(), []);
  useEffect(() => invalidate(), [position, invalidate]);
  useFrame(() => {
    const el = cardRef.current;
    if (!el || !position || !drum.current) return;
    drum.current.updateMatrixWorld();
    v.copy(position).applyMatrix4(drum.current.matrixWorld).project(camera);
    const x = ((v.x + 1) / 2) * size.width;
    const y = ((1 - v.y) / 2) * size.height;
    const left = x + 22 + CARD_WIDTH > size.width ? x - 22 - CARD_WIDTH : x + 22;
    const top = Math.max(6, Math.min(y - 30, size.height - el.offsetHeight - 6));
    el.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
    el.style.visibility = v.z < 1 ? 'visible' : 'hidden';
  });
  return null;
}

function Scene({
  graph,
  states,
  reveal,
  onOpen,
  focusAvailable,
  home,
  hover,
  setHover,
  cardRef,
}: Omit<Props, 'renderCard'> & { hover: string | null; setHover: (id: string | null) => void; cardRef: MutableRefObject<HTMLDivElement | null> }) {
  const palette = usePalette();
  const reduce = useMemo(prefersReducedMotion, []);
  const rig = useRef<Rig | null>(null);
  const drum = useRef<THREE.Group | null>(null);
  const invalidate = useThree((s) => s.invalidate);
  const canvas = useThree((s) => s.size);

  const domainColor = useMemo(() => (hue: number) => new THREE.Color().setHSL(hue / 360, palette.sat, palette.light, THREE.SRGBColorSpace), [palette]);
  const hues = useMemo(() => new Map(graph.domains.map((d) => [d.id, d.hue])), [graph]);
  const items = useMemo(
    () =>
      new Map(
        graph.lessons.map((l): [string, Item] => [
          l.id,
          {
            lesson: l,
            state: states.get(l.id)!,
            position: new THREE.Vector3(...position3d(l.angle, l.radius, l.level)),
            color: domainColor(hues.get(l.domain) ?? 230),
          },
        ]),
      ),
    [graph, states, domainColor, hues],
  );
  const byState = useMemo(() => {
    const groups: Record<NodeState, Item[]> = { completed: [], known: [], available: [], locked: [], outline: [] };
    for (const item of items.values()) groups[item.state].push(item);
    return groups;
  }, [items]);
  const all = useMemo(() => [...items.values()], [items]);
  const maxLevel = Math.max(0, ...graph.lessons.map((l) => l.level));

  // 全景：镜头正对数学那半圈，整个圆筒横着占满画面（按画布的宽高比算）
  const aspect = canvas.width / Math.max(1, canvas.height) || 1.8;
  const tan = Math.tan((FOV / 2) * RAD);
  const homeView = useMemo<DrumView>(() => {
    const length = maxLevel * LEVEL_GAP;
    const fitLength = RADIUS_OUTER + (length / 2 + 4 * LEVEL_GAP) / (tan * aspect);
    const fitHeight = (SHELL + 3) / tan;
    return { x: length / 2, roll: 0, distance: Math.max(fitLength, fitHeight) };
  }, [maxLevel, aspect, tan]);
  const span = useMemo<[number, number]>(() => [-LEVEL_GAP, maxLevel * LEVEL_GAP + LEVEL_GAP], [maxLevel]);

  // 材质：每种状态一个；颜色由每个节点自己带（领域颜色）
  const looks = useMemo(() => {
    const grey = new THREE.Color(palette.muted);
    return {
      completed: { geometry: new THREE.SphereGeometry(0.4, 24, 16), material: new THREE.MeshBasicMaterial() },
      known: { geometry: new THREE.OctahedronGeometry(0.5), material: new THREE.MeshBasicMaterial() },
      available: { geometry: new THREE.SphereGeometry(0.36, 24, 16), material: new THREE.MeshBasicMaterial() },
      locked: { geometry: new THREE.SphereGeometry(0.28, 16, 12), material: new THREE.MeshBasicMaterial({ color: grey, transparent: true, opacity: 0.5 }) },
      outline: { geometry: new THREE.IcosahedronGeometry(0.38, 1), material: new THREE.MeshBasicMaterial({ color: grey, wireframe: true, transparent: true, opacity: 0.7 }) },
    };
  }, [palette]);
  useEffect(
    () => () => {
      for (const look of Object.values(looks)) {
        look.geometry.dispose();
        look.material.dispose();
      }
    },
    [looks],
  );
  // 够不着、待写的不带领域颜色：每个节点的颜色当成白色，材质自己的灰色起作用
  const neutral = useMemo(() => {
    const white = new THREE.Color(1, 1, 1);
    return { locked: byState.locked.map((i) => ({ ...i, color: white })), outline: byState.outline.map((i) => ({ ...i, color: white })) };
  }, [byState]);
  // 光晕和未审小点的位置、颜色；只在节点或主题变了时重算，悬停时不重建
  const glows = useMemo(() => {
    const unreviewed = all.filter((i) => i.lesson.status === 'written');
    const orange = new THREE.Color(palette.warn);
    // 小橙点放在节点外侧（离轴更远的方向）
    const lift = (p: THREE.Vector3): THREE.Vector3 => {
      const out = new THREE.Vector3(0, p.y, p.z).normalize().multiplyScalar(0.62);
      return p.clone().add(out);
    };
    return {
      completed: { points: byState.completed.map((i) => i.position), colors: byState.completed.map((i) => i.color) },
      available: { points: byState.available.map((i) => i.position), colors: byState.available.map((i) => i.color) },
      unreviewed: { points: unreviewed.map((i) => lift(i.position)), colors: unreviewed.map(() => orange) },
    };
  }, [all, byState, palette]);
  const glow = useMemo(glowTexture, []);
  const ring = useMemo(ringTexture, []);
  useEffect(
    () => () => {
      glow.dispose();
      ring.dispose();
    },
    [glow, ring],
  );

  // 透明的大一点的球，专门接鼠标：星星本身太小，不好点中
  const hit = useMemo(() => {
    const mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.75, 10, 8), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false }), Math.max(1, all.length));
    const matrix = new THREE.Matrix4();
    all.forEach((item, i) => mesh.setMatrixAt(i, matrix.makeTranslation(item.position)));
    mesh.count = all.length;
    mesh.computeBoundingSphere();
    return mesh;
  }, [all]);
  useEffect(
    () => () => {
      hit.geometry.dispose();
      (hit.material as THREE.Material).dispose();
      hit.dispose();
    },
    [hit],
  );

  // 「我现在能学什么」：转到可学节点所在的那一面，左右对准它们，推近到正好装下
  // 只在按钮按下（值变了）时转一次；之后节点状态变了不再转
  const handledFocus = useRef(focusAvailable);
  useEffect(() => {
    if (focusAvailable === handledFocus.current) return;
    handledFocus.current = focusAvailable;
    const targets = byState.available;
    if (!targets.length || !rig.current) return;
    const xs = targets.map((i) => i.position.x);
    const [lo, hi] = [Math.min(...xs), Math.max(...xs)];
    const sin = targets.reduce((sum, i) => sum + Math.sin(phiOf(i.position)), 0);
    const cos = targets.reduce((sum, i) => sum + Math.cos(phiOf(i.position)), 0);
    const current = rig.current.current();
    const distance = Math.min(homeView.distance, Math.max(18, RADIUS_OUTER + ((hi - lo) / 2 + 3 * LEVEL_GAP) / (tan * aspect)));
    rig.current.flyTo({ x: (lo + hi) / 2, roll: rollToFront(Math.atan2(sin, cos), current.roll), distance }, reduce ? 0 : 900);
  }, [focusAvailable, byState, reduce]);

  useEffect(() => {
    document.body.style.cursor = hover ? 'pointer' : '';
    return () => {
      document.body.style.cursor = '';
    };
  }, [hover]);

  const pick = (e: ThreeEvent<MouseEvent>): void => {
    // 拖动时松开鼠标不算点击
    if (e.delta > 6 || e.instanceId === undefined) return;
    e.stopPropagation();
    const item = all[e.instanceId];
    if (!item) return;
    if (reduce || !rig.current) {
      onOpen(item.lesson);
      return;
    }
    // 圆筒转到这颗星正对镜头，镜头飞到它跟前，再进入小节
    const current = rig.current.current();
    const fromAxis = Math.hypot(item.position.y, item.position.z);
    rig.current.flyTo({ x: item.position.x, roll: rollToFront(phiOf(item.position), current.roll), distance: fromAxis + 3 }, 650, () => onOpen(item.lesson));
  };

  const hovered = hover ? items.get(hover) : undefined;
  const hoverRing = useMemo(() => (hovered ? { points: [hovered.position], colors: [new THREE.Color(palette.text)] } : null), [hovered, palette]);
  const additive = palette.dark;

  return (
    <>
      <DrumControls home={homeView} homeSignal={home} span={span} maxDistance={homeView.distance * 1.4} drum={drum} rig={rig} reduce={reduce} />
      <Ticker active={!reduce && byState.available.length > 0} />
      <Rulers palette={palette} maxLevel={maxLevel} />
      <group ref={drum}>
        <DrumFrame graph={graph} palette={palette} domainColor={domainColor} maxLevel={maxLevel} />
        <Edges graph={graph} items={items} palette={palette} domainColor={domainColor} />
        <NodeLayer items={byState.completed} geometry={looks.completed.geometry} material={looks.completed.material} />
        <NodeLayer items={byState.known} geometry={looks.known.geometry} material={looks.known.material} />
        <NodeLayer items={byState.available} geometry={looks.available.geometry} material={looks.available.material} />
        <NodeLayer items={neutral.locked} geometry={looks.locked.geometry} material={looks.locked.material} />
        <NodeLayer items={neutral.outline} geometry={looks.outline.geometry} material={looks.outline.material} />
        {glows.completed.points.length > 0 && <Glow {...glows.completed} size={pointSize(2)} opacity={additive ? 0.6 : 0.4} additive={additive} texture={glow} />}
        {glows.available.points.length > 0 && <Glow {...glows.available} size={pointSize(2.4)} opacity={additive ? 0.85 : 0.55} breathe={!reduce} additive={additive} texture={glow} />}
        {glows.unreviewed.points.length > 0 && <Glow {...glows.unreviewed} size={pointSize(0.42)} opacity={1} additive={false} texture={glow} />}
        {hoverRing && <Glow {...hoverRing} size={pointSize(1.5)} opacity={0.9} additive={false} texture={ring} />}
        {reveal && <RevealEffects reveal={reveal} items={items} texture={glow} additive={additive} />}
        <primitive
          object={hit}
          onPointerMove={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            const id = e.instanceId === undefined ? null : (all[e.instanceId]?.lesson.id ?? null);
            if (id !== hover) {
              setHover(id);
              invalidate();
            }
          }}
          onPointerOut={() => {
            setHover(null);
            invalidate();
          }}
          onClick={pick}
        />
      </group>
      <CardTracker position={hovered?.position ?? null} drum={drum} cardRef={cardRef} />
    </>
  );
}

export default function StarMap3D(props: Props) {
  const [hover, setHover] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const lesson = hover ? props.graph.lessons.find((l) => l.id === hover) : undefined;
  return (
    <div className="map3d" role="region" aria-label="立体知识星图（键盘用户可以切到平面图，或用下面的小节列表）">
      <Canvas frameloop="demand" dpr={[1, 2]} gl={{ antialias: true, alpha: true }} camera={{ fov: FOV, near: 0.1, far: 1000 }} onPointerMissed={() => setHover(null)}>
        <Scene {...props} hover={hover} setHover={setHover} cardRef={cardRef} />
      </Canvas>
      {lesson && (
        <div ref={cardRef} className="map-card map3d-card" role="tooltip" style={{ width: CARD_WIDTH, visibility: 'hidden' }}>
          {props.renderCard(lesson)}
        </div>
      )}
    </div>
  );
}

// 立体星图（three.js + react-three-fiber），见 docs/plan.md「立体知识图谱与动态效果」：
// 高度是层级，每个领域在圆周上占一块扇区（数学前半圈、物理后半圈），节点在一个圆柱壳里，坐标在构建时算好。
// 节点用实例化渲染（每种状态一个 InstancedMesh）；只在需要时重画，有动画时最多每秒 30 帧。
// 拖动旋转、滚轮缩放、右键拖动平移；悬停显示卡片，点击时镜头飞向那颗星再进入小节。
// 系统设置了「减少动态效果」时：光晕不呼吸、没有点亮动画和镜头飞行、旋转不带惯性。
// 这个文件连同 three.js 按需加载（切到「立体」时才下载）。

import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { Graph, GraphLesson } from '../../shared/content-types';
import { LEVEL_HEIGHT, position3d, RADIUS_INNER, RADIUS_OUTER } from '../../shared/map';
import type { NodeState } from '../../shared/node-state';
import { subjectTitle } from '../subjects';
import { prefersReducedMotion, type Reveal } from './StarMap';

const RAD = Math.PI / 180;
/** 地面（领域扇区、领域名）放在第 0 层下面一点。 */
const FLOOR_Y = -1.3;
const CARD_WIDTH = 300;
/** 镜头的上下视角（度）。 */
const FOV = 45;

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
  renderCard(lesson: GraphLesson): ReactNode;
}

interface Item {
  lesson: GraphLesson;
  state: NodeState;
  position: THREE.Vector3;
  color: THREE.Color;
}

/** 镜头：飞到某个位置、看着某个点。 */
interface Rig {
  flyTo(position: THREE.Vector3, target: THREE.Vector3, ms: number, done?: () => void): void;
  camera: THREE.Camera;
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

function Controls({ target, position, reduce, rig }: { target: THREE.Vector3; position: THREE.Vector3; reduce: boolean; rig: MutableRefObject<Rig | null> }) {
  const { camera, gl, invalidate } = useThree();
  const controls = useMemo(() => new OrbitControls(camera, gl.domElement), [camera, gl]);
  const tween = useRef<{ p0: THREE.Vector3; t0: THREE.Vector3; p1: THREE.Vector3; t1: THREE.Vector3; start: number; ms: number; done?: () => void } | null>(null);

  useLayoutEffect(() => {
    camera.position.copy(position);
    controls.target.copy(target);
    controls.update();
    invalidate();
  }, [camera, controls, position, target, invalidate]);

  useEffect(() => {
    const onChange = (): void => invalidate();
    controls.addEventListener('change', onChange);
    return () => {
      controls.removeEventListener('change', onChange);
      controls.dispose();
    };
  }, [controls, invalidate]);

  useEffect(() => {
    // 减少动态效果时不带惯性，松手就停
    controls.enableDamping = !reduce;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.5;
    controls.maxDistance = 200;
  }, [controls, reduce]);

  rig.current = {
    camera,
    flyTo(p, t, ms, done) {
      if (ms <= 0) {
        camera.position.copy(p);
        controls.target.copy(t);
        controls.update();
        invalidate();
        done?.();
        return;
      }
      tween.current = { p0: camera.position.clone(), t0: controls.target.clone(), p1: p.clone(), t1: t.clone(), start: performance.now(), ms, done };
      invalidate();
    },
  };

  useFrame(() => {
    const tw = tween.current;
    if (tw) {
      const k = Math.min(1, (performance.now() - tw.start) / tw.ms);
      const e = k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2;
      camera.position.lerpVectors(tw.p0, tw.p1, e);
      controls.target.lerpVectors(tw.t0, tw.t1, e);
      if (k >= 1) {
        tween.current = null;
        tw.done?.();
      }
    }
    // 带惯性时停手以后还会转一会儿，转动期间接着画
    if (controls.update() || tween.current) invalidate();
  });
  return null;
}

/** 地面：每个领域一块扇形，标出领域名；外圈标学科名；中轴标层级。 */
function Floor({ graph, palette, domainColor, maxLevel }: { graph: Graph; palette: Palette; domainColor: (hue: number) => THREE.Color; maxLevel: number }) {
  const group = useDisposable(() => {
    const g = new THREE.Group();
    for (const d of graph.domains) {
      const [start, end] = d.sector;
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(RADIUS_INNER - 1.2, RADIUS_OUTER + 1.2, Math.max(8, Math.ceil((end - start) / 3)), 1, (start + 180) * RAD, (end - start) * RAD),
        new THREE.MeshBasicMaterial({ color: domainColor(d.hue), transparent: true, opacity: palette.dark ? 0.16 : 0.2, side: THREE.DoubleSide, depthWrite: false }),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = FLOOR_Y;
      ring.raycast = () => undefined;
      g.add(ring);
      const label = textSprite(d.titleText, `#${domainColor(d.hue).getHexString(THREE.SRGBColorSpace)}`, 0.75);
      label.position.set(...position3d((start + end) / 2, RADIUS_OUTER + 2.4, 0)).setY(FLOOR_Y);
      g.add(label);
    }
    // 学科名浮在圆柱顶上方，往各自那半圈偏一点，不挡住星星；高度错开，从正面看前后两个名字不叠在一起
    graph.subjects.forEach((s, i) => {
      const empty = !graph.domains.some((d) => d.subject === s.id);
      const label = textSprite(`${subjectTitle(s.id)}${empty ? '（还没有内容）' : ''}`, palette.text, 1.1);
      label.position.set(...position3d((s.start + s.end) / 2, RADIUS_INNER, maxLevel)).setY(maxLevel * LEVEL_HEIGHT + 3 + 2.6 * i);
      g.add(label);
    });
    // 圆周上分开两个学科的两条线
    const border = new THREE.LineBasicMaterial({ color: palette.border, transparent: true, opacity: 0.9 });
    for (const s of graph.subjects) {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...position3d(s.start, RADIUS_INNER - 1.2, 0)).setY(FLOOR_Y),
        new THREE.Vector3(...position3d(s.start, RADIUS_OUTER + 4, 0)).setY(FLOOR_Y),
      ]);
      const line = new THREE.Line(geometry, border);
      line.raycast = () => undefined;
      g.add(line);
    }
    // 中轴和每一层的刻度：越往上越深
    const axis = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, FLOOR_Y, 0), new THREE.Vector3(0, maxLevel * LEVEL_HEIGHT + 1, 0)]),
      new THREE.LineBasicMaterial({ color: palette.border }),
    );
    axis.raycast = () => undefined;
    g.add(axis);
    for (let level = 0; level <= maxLevel; level++) {
      const label = textSprite(`层级 ${level}`, palette.muted, 0.6, 400);
      label.position.set(0.9, level * LEVEL_HEIGHT, 0);
      g.add(label);
      const circle = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(Array.from({ length: 96 }, (_, i) => new THREE.Vector3(...position3d((i * 360) / 96, RADIUS_OUTER + 0.6, level)))),
        new THREE.LineBasicMaterial({ color: palette.border, transparent: true, opacity: palette.dark ? 0.35 : 0.6 }),
      );
      circle.raycast = () => undefined;
      g.add(circle);
    }
    return g;
  }, [graph, palette, domainColor, maxLevel]);
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

/** 悬停卡片跟着那颗星在屏幕上的位置走（旋转、缩放时也跟着）。 */
function CardTracker({ position, cardRef }: { position: THREE.Vector3 | null; cardRef: MutableRefObject<HTMLDivElement | null> }) {
  const { camera, size, invalidate } = useThree();
  const v = useMemo(() => new THREE.Vector3(), []);
  useEffect(() => invalidate(), [position, invalidate]);
  useFrame(() => {
    const el = cardRef.current;
    if (!el || !position) return;
    v.copy(position).project(camera);
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
  hover,
  setHover,
  cardRef,
}: Omit<Props, 'renderCard'> & { hover: string | null; setHover: (id: string | null) => void; cardRef: MutableRefObject<HTMLDivElement | null> }) {
  const palette = usePalette();
  const reduce = useMemo(prefersReducedMotion, []);
  const rig = useRef<Rig | null>(null);
  const invalidate = useThree((s) => s.invalidate);

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

  // 镜头：从数学那半圈正前方、略高一点看过去，圆柱的前半边占满画面
  const view = useMemo(() => {
    const height = maxLevel * LEVEL_HEIGHT;
    const target = new THREE.Vector3(0, height / 2, 0);
    const distance = Math.max((RADIUS_OUTER + 4) * 1.7, height * 1.4);
    const position = new THREE.Vector3(0, height / 2 + distance * Math.sin(16 * RAD), distance * Math.cos(16 * RAD));
    return { target, position };
  }, [maxLevel]);

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
    const lift = new THREE.Vector3(0, 0.62, 0);
    return {
      completed: { points: byState.completed.map((i) => i.position), colors: byState.completed.map((i) => i.color) },
      available: { points: byState.available.map((i) => i.position), colors: byState.available.map((i) => i.color) },
      unreviewed: { points: unreviewed.map((i) => i.position.clone().add(lift)), colors: unreviewed.map(() => orange) },
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

  // 「我现在能学什么」：镜头转到所有可学节点的正前方
  const firstFocus = useRef(focusAvailable);
  useEffect(() => {
    if (focusAvailable === firstFocus.current) return;
    const targets = byState.available.map((i) => i.position);
    if (!targets.length || !rig.current) return;
    const center = targets.reduce((sum, p) => sum.add(p), new THREE.Vector3()).divideScalar(targets.length);
    const spread = Math.max(...targets.map((p) => p.distanceTo(center)));
    const outward = new THREE.Vector3(center.x, 0, center.z);
    if (outward.length() < 1e-3) outward.set(0, 0, 1);
    outward.normalize();
    const distance = Math.max(10, spread * 2.6);
    const position = center.clone().addScaledVector(outward, distance).add(new THREE.Vector3(0, distance * 0.3, 0));
    rig.current.flyTo(position, center, reduce ? 0 : 900);
  }, [focusAvailable, byState, reduce]);

  useEffect(() => {
    document.body.style.cursor = hover ? 'pointer' : '';
    return () => {
      document.body.style.cursor = '';
    };
  }, [hover]);

  const pick = (e: ThreeEvent<MouseEvent>): void => {
    // 拖动旋转时松开鼠标不算点击
    if (e.delta > 6 || e.instanceId === undefined) return;
    e.stopPropagation();
    const item = all[e.instanceId];
    if (!item) return;
    if (reduce || !rig.current) {
      onOpen(item.lesson);
      return;
    }
    // 镜头飞向那颗星，再进入小节
    const camera = rig.current.camera;
    const toward = camera.position.clone().sub(item.position).normalize();
    rig.current.flyTo(item.position.clone().addScaledVector(toward, 3), item.position, 650, () => onOpen(item.lesson));
  };

  const hovered = hover ? items.get(hover) : undefined;
  const hoverRing = useMemo(() => (hovered ? { points: [hovered.position], colors: [new THREE.Color(palette.text)] } : null), [hovered, palette]);
  const additive = palette.dark;

  return (
    <>
      <Controls target={view.target} position={view.position} reduce={reduce} rig={rig} />
      <Ticker active={!reduce && byState.available.length > 0} />
      <Floor graph={graph} palette={palette} domainColor={domainColor} maxLevel={maxLevel} />
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
      <CardTracker position={hovered?.position ?? null} cardRef={cardRef} />
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

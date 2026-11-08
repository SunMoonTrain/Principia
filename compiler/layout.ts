// 星图的布局，见 docs/plan.md「立体知识图谱与动态效果」。构建时算好写进全局图谱，同样的内容每次位置都一样。
// 横向展开图（2D）：横轴是层级，往右越深；纵轴是领域带，用「圆周上的角度」0–360° 表示（数学占上半、物理占下半），
// 立体星图就是把它卷成一个横放的圆筒。每个领域带的宽度 = 这个领域里节点最多的那一层的节点数 + 1 行，
// 所以同一层的节点总能隔开整整一行；同一层里的节点按前置、后续的平均位置排。
// 立体星图（3D）：横轴是层级，绕轴的角度从展开图的纵坐标出发，离轴的距离在一个圆筒壳里（固定种子的随机数），
// 同一层离得太近的互相推开（力导向微调），角度不出自己领域的那一段。

import { RADIUS_INNER, RADIUS_OUTER } from '../shared/map.ts';
import type { PrereqMap } from './graph.ts';

export { RADIUS_INNER, RADIUS_OUTER };

/** 学科在圆周上的顺序：数学占前半圈，物理占后半圈；没有内容的学科也留着它那半圈，加内容时别的学科不挪位置。 */
export const SUBJECT_ORDER = ['math', 'physics'];

/** 领域带比节点最多的那一层多留几行：相邻领域之间至少空出这么多。 */
export const SPARE_ROWS = 1;

/** 立体星图里同一层两个节点至少隔这么远（场景单位），太近就互相推开。 */
export const MIN_DISTANCE_3D = 1.2;

export interface LayoutInput {
  domains: { id: string; subject: string }[];
  lessons: { id: string; domain: string; level: number }[];
  prereqs: PrereqMap;
}

export interface Sector {
  start: number;
  end: number;
}

export interface MapLayout {
  /** 学科占的那一段，和这个学科里一行占多少度（同一层相邻两个节点至少隔一行）。 */
  subjects: ({ id: string; row: number } & Sector)[];
  /** 领域 → 领域带（度）和颜色（色相，0–360）。 */
  domains: Map<string, Sector & { hue: number }>;
  /** 小节 → 横向展开图的纵坐标（度）。 */
  y2d: Map<string, number>;
  /** 小节 → 立体星图里绕轴的角度（度）和离轴的距离。 */
  polar: Map<string, { angle: number; radius: number }>;
}

/** 固定种子的伪随机数（FNV-1a 散列 + mulberry32）：同一个 id 每次得到同一串数。 */
function seeded(id: string): () => number {
  let h = 2166136261;
  for (const ch of id) h = Math.imul(h ^ ch.codePointAt(0)!, 16777619);
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const RAD = Math.PI / 180;

/**
 * 立体星图：从展开图的纵坐标出发，离轴的距离取圆筒壳中间那一段里的随机值；同一层里离得比 MIN_DISTANCE_3D 近的
 * 两两推开，再往起点拉回一点，反复几十次。角度不出自己领域带的可用范围，距离不出圆筒壳。
 */
function relax3d(
  lessons: { id: string; domain: string; level: number }[],
  start: Map<string, number>,
  usable: (domain: string) => [number, number],
): Map<string, { angle: number; radius: number }> {
  const mid = (RADIUS_INNER + RADIUS_OUTER) / 2;
  const nodes = [...lessons]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((l) => {
      const random = seeded(l.id);
      const radius = RADIUS_INNER + (RADIUS_OUTER - RADIUS_INNER) * (0.2 + 0.6 * random());
      return { ...l, home: start.get(l.id)!, angle: start.get(l.id)!, radius };
    });
  const byLevel = new Map<number, typeof nodes>();
  for (const n of nodes) byLevel.set(n.level, [...(byLevel.get(n.level) ?? []), n]);
  for (let step = 0; step < 60; step++) {
    for (const row of byLevel.values()) {
      const xy = row.map((n) => [n.radius * Math.cos(n.angle * RAD), n.radius * Math.sin(n.angle * RAD)]);
      for (let i = 0; i < row.length; i++) {
        for (let j = i + 1; j < row.length; j++) {
          let dx = xy[j][0] - xy[i][0];
          let dy = xy[j][1] - xy[i][1];
          let d = Math.hypot(dx, dy);
          if (d >= MIN_DISTANCE_3D) continue;
          if (d < 1e-6) [dx, dy, d] = [1e-3, 0, 1e-3];
          const push = (MIN_DISTANCE_3D - d) / 2 / d;
          xy[i][0] -= dx * push;
          xy[i][1] -= dy * push;
          xy[j][0] += dx * push;
          xy[j][1] += dy * push;
        }
      }
      row.forEach((n, i) => {
        const [lo, hi] = usable(n.domain);
        const angle = Math.atan2(xy[i][1], xy[i][0]) / RAD;
        // atan2 给的是 -180–180°，换回离原来最近的那个角度
        const unwrapped = angle + 360 * Math.round((n.angle - angle) / 360);
        n.angle = Math.min(hi, Math.max(lo, unwrapped + (n.home - unwrapped) * 0.05));
        n.radius = Math.min(RADIUS_OUTER, Math.max(RADIUS_INNER, Math.hypot(xy[i][0], xy[i][1]) + (mid - n.radius) * 0.01));
      });
    }
  }
  return new Map(nodes.map((n) => [n.id, { angle: Math.round(n.angle * 100) / 100, radius: Math.round(n.radius * 100) / 100 }]));
}

/**
 * 在 [lo, hi] 里排好一组点（已按想去的位置排好序）：尽量靠近各自想去的位置，相邻至少隔 gap，放不下时缩小间隔。
 * 挤在一起的几个点合成一块，整块以它们想去的位置的平均为中心，不会都往一边推。
 */
function pack(desired: number[], lo: number, hi: number, gap: number): number[] {
  const n = desired.length;
  if (n === 0) return [];
  const step = n > 1 ? Math.min(gap, (hi - lo) / (n - 1)) : 0;
  const blocks: { first: number; count: number; left: number }[] = [];
  for (let i = 0; i < n; i++) {
    let block = { first: i, count: 1, left: desired[i] };
    for (let prev = blocks.at(-1); prev && prev.left + prev.count * step > block.left; prev = blocks.at(-1)) {
      blocks.pop();
      const count = prev.count + block.count;
      let sum = 0;
      for (let k = 0; k < count; k++) sum += desired[prev.first + k] - k * step;
      block = { first: prev.first, count, left: sum / count };
    }
    blocks.push(block);
  }
  const x: number[] = [];
  for (const b of blocks) for (let k = 0; k < b.count; k++) x.push(b.left + k * step);
  // 收进边界：后面留够后面几个点的位置，前面也一样；这样收完间隔照样不小于 step
  for (let i = n - 1; i >= 0; i--) x[i] = Math.min(x[i], hi - (n - 1 - i) * step);
  for (let i = 0; i < n; i++) x[i] = Math.max(x[i], lo + i * step);
  return x;
}

const mean = (xs: number[]): number => xs.reduce((a, b) => a + b, 0) / xs.length;

export function layoutMap({ domains, lessons, prereqs }: LayoutInput): MapLayout {
  // ---- 每个领域要几行：节点最多的那一层有几个，再多留 SPARE_ROWS 行 ----
  const rows = new Map<string, string[]>(); // 「领域|层级」→ 这一层的小节
  for (const l of [...lessons].sort((a, b) => a.id.localeCompare(b.id))) {
    const key = `${l.domain}|${l.level}`;
    rows.set(key, [...(rows.get(key) ?? []), l.id]);
  }
  const widest = new Map<string, number>();
  for (const [key, ids] of rows) {
    const domain = key.slice(0, key.lastIndexOf('|'));
    widest.set(domain, Math.max(widest.get(domain) ?? 0, ids.length));
  }
  const rowsOf = (domain: string): number => (widest.get(domain) ?? 0) + SPARE_ROWS;

  // ---- 学科各占一段圆周，领域按要的行数分学科那一段 ----
  const subjectIds = [...SUBJECT_ORDER, ...[...new Set(domains.map((d) => d.subject))].filter((s) => !SUBJECT_ORDER.includes(s)).sort()];
  const share = 360 / subjectIds.length;
  const subjects: MapLayout['subjects'] = [];
  const sectors = new Map<string, Sector & { hue: number }>();
  const rowDeg = new Map<string, number>(); // 领域 → 它所在学科里一行占多少度
  subjectIds.forEach((id, i) => {
    const start = i * share;
    const end = (i + 1) * share;
    const own = domains.filter((d) => d.subject === id).sort((a, b) => a.id.localeCompare(b.id));
    const row = (end - start) / Math.max(1, own.reduce((sum, d) => sum + rowsOf(d.id), 0));
    subjects.push({ id, start, end, row: Math.round(row * 1e4) / 1e4 });
    let at = start;
    for (const d of own) {
      const width = rowsOf(d.id) * row;
      // 色相跟着领域带在圆周上的位置走，相邻领域颜色相近、一圈下来正好是色环
      sectors.set(d.id, { start: at, end: at + width, hue: Math.round((at + width / 2 + 180) % 360) });
      rowDeg.set(d.id, row);
      at += width;
    }
  });

  // ---- 每个领域里逐层排 ----
  const dependents = new Map<string, string[]>(lessons.map((l) => [l.id, []]));
  for (const l of lessons) for (const p of prereqs.get(l.id) ?? []) dependents.get(p)?.push(l.id);
  const maxLevel = Math.max(0, ...lessons.map((l) => l.level));
  // 领域带两边各留半行（SPARE_ROWS 行分给两边），节点排在中间；节点最多的那一层也正好放得下、隔整整一行
  const usable = (domain: string): [number, number] => {
    const s = sectors.get(domain)!;
    const pad = (rowDeg.get(domain)! * SPARE_ROWS) / 2;
    return [s.start + pad, s.end - pad];
  };
  const y = new Map<string, number>();

  const placeRow = (domain: string, ids: string[], desiredOf: (id: string) => number | null): void => {
    const [lo, hi] = usable(domain);
    const wanted = ids.map((id, i) => ({ id, d: desiredOf(id) ?? y.get(id) ?? lo + ((hi - lo) * (i + 1)) / (ids.length + 1) }));
    wanted.sort((a, b) => a.d - b.d || a.id.localeCompare(b.id));
    const placed = pack(
      wanted.map((w) => w.d),
      lo,
      hi,
      rowDeg.get(domain)!,
    );
    wanted.forEach((w, i) => y.set(w.id, placed[i]));
  };
  // 往深处一层层排：想去的位置 = 前置的平均位置；往回一层层排：= 后续的平均位置
  const fromPrereqs = (id: string): number | null => {
    const ps = (prereqs.get(id) ?? []).filter((p) => y.has(p));
    return ps.length ? mean(ps.map((p) => y.get(p)!)) : null;
  };
  const fromDependents = (id: string): number | null => {
    const ds = (dependents.get(id) ?? []).filter((d) => y.has(d));
    return ds.length ? mean(ds.map((d) => y.get(d)!)) : null;
  };
  const sweep = (levels: number[], desiredOf: (id: string) => number | null): void => {
    for (const level of levels) {
      for (const d of domains) {
        const ids = rows.get(`${d.id}|${level}`);
        if (ids) placeRow(d.id, ids, desiredOf);
      }
    }
  };
  const deeper = Array.from({ length: maxLevel + 1 }, (_, i) => i);
  sweep(deeper, fromPrereqs);
  sweep([...deeper].reverse(), fromDependents);
  sweep(deeper, fromPrereqs);
  // 坐标保留两位小数就够了，图谱文件也好读
  for (const [id, value] of y) y.set(id, Math.round(value * 100) / 100);
  return { subjects, domains: sectors, y2d: y, polar: relax3d(lessons, y, usable) };
}

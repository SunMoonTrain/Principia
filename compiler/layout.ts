// 星图的布局，见 docs/plan.md「立体知识图谱与动态效果」。构建时算好写进全局图谱，同样的内容每次位置都一样。
// 平面展开图（2D）：横轴是领域扇区里的角度（0–360°，数学占前半圈、物理占后半圈），纵轴是层级；
// 同一层里的节点按前置、后续的平均位置排，挨得太近时沿横轴推开。
// 立体星图（3D）：高度是层级，角度从展开图的横坐标出发，半径在一个圆柱壳里（固定种子的随机数），
// 同一层离得太近的互相推开（力导向微调），角度不出自己领域的扇区。

import { RADIUS_INNER, RADIUS_OUTER } from '../shared/map.ts';
import type { PrereqMap } from './graph.ts';

export { RADIUS_INNER, RADIUS_OUTER };

/** 学科在圆周上的顺序：数学占前半圈，物理占后半圈；没有内容的学科也留着它那半圈，加内容时别的节点不挪位置。 */
export const SUBJECT_ORDER = ['math', 'physics'];

/** 同一层相邻两个节点之间想留的角度（度）。领域扇区放不下时按扇区宽度均分。 */
export const PREFERRED_GAP = 10;

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
  subjects: ({ id: string } & Sector)[];
  /** 领域 → 扇区和颜色（色相，0–360）。 */
  domains: Map<string, Sector & { hue: number }>;
  /** 小节 → 展开图的横坐标（度）。 */
  x: Map<string, number>;
  /** 小节 → 立体星图里的角度（度）和半径。 */
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
 * 立体星图：从展开图的横坐标出发，半径取圆柱壳中间那一段里的随机值；同一层里离得比 MIN_DISTANCE_3D 近的
 * 两两推开，再往起点拉回一点，反复几十次。角度不出自己领域扇区的可用范围，半径不出圆柱壳。
 */
function relax3d(
  lessons: { id: string; domain: string; level: number }[],
  x: Map<string, number>,
  usable: (domain: string) => [number, number],
): Map<string, { angle: number; radius: number }> {
  const mid = (RADIUS_INNER + RADIUS_OUTER) / 2;
  const nodes = [...lessons]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((l) => {
      const random = seeded(l.id);
      const radius = RADIUS_INNER + (RADIUS_OUTER - RADIUS_INNER) * (0.2 + 0.6 * random());
      return { ...l, home: x.get(l.id)!, angle: x.get(l.id)!, radius };
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
  // 收进边界：右边留够后面几个点的位置，左边也一样；这样收完间隔照样不小于 step
  for (let i = n - 1; i >= 0; i--) x[i] = Math.min(x[i], hi - (n - 1 - i) * step);
  for (let i = 0; i < n; i++) x[i] = Math.max(x[i], lo + i * step);
  return x;
}

const mean = (xs: number[]): number => xs.reduce((a, b) => a + b, 0) / xs.length;

export function layoutMap({ domains, lessons, prereqs }: LayoutInput): MapLayout {
  // ---- 学科各占一段圆周，领域按小节数分学科那一段 ----
  const subjectIds = [...SUBJECT_ORDER, ...[...new Set(domains.map((d) => d.subject))].filter((s) => !SUBJECT_ORDER.includes(s)).sort()];
  const share = 360 / subjectIds.length;
  const subjects = subjectIds.map((id, i) => ({ id, start: i * share, end: (i + 1) * share }));
  const count = new Map<string, number>();
  for (const l of lessons) count.set(l.domain, (count.get(l.domain) ?? 0) + 1);

  const sectors = new Map<string, Sector & { hue: number }>();
  for (const subject of subjects) {
    const own = domains.filter((d) => d.subject === subject.id).sort((a, b) => a.id.localeCompare(b.id));
    const total = own.reduce((sum, d) => sum + Math.max(1, count.get(d.id) ?? 0), 0);
    let at = subject.start;
    for (const d of own) {
      const width = ((subject.end - subject.start) * Math.max(1, count.get(d.id) ?? 0)) / total;
      // 色相跟着扇区在圆周上的位置走，相邻领域颜色相近、一圈下来正好是色环
      sectors.set(d.id, { start: at, end: at + width, hue: Math.round((at + width / 2 + 180) % 360) });
      at += width;
    }
  }

  // ---- 每个领域里逐层排 ----
  const dependents = new Map<string, string[]>(lessons.map((l) => [l.id, []]));
  for (const l of lessons) for (const p of prereqs.get(l.id) ?? []) dependents.get(p)?.push(l.id);
  const maxLevel = Math.max(0, ...lessons.map((l) => l.level));
  const rows = new Map<string, string[]>(); // 「领域|层级」→ 这一层的小节
  for (const l of [...lessons].sort((a, b) => a.id.localeCompare(b.id))) {
    const key = `${l.domain}|${l.level}`;
    rows.set(key, [...(rows.get(key) ?? []), l.id]);
  }
  const usable = (domain: string): [number, number] => {
    const s = sectors.get(domain)!;
    // 两边留一点空，相邻领域的节点不贴在一起
    const pad = Math.min(2, (s.end - s.start) * 0.08);
    return [s.start + pad, s.end - pad];
  };
  const x = new Map<string, number>();

  const placeRow = (domain: string, ids: string[], desiredOf: (id: string) => number | null): void => {
    const [lo, hi] = usable(domain);
    const wanted = ids.map((id, i) => ({ id, d: desiredOf(id) ?? x.get(id) ?? lo + ((hi - lo) * (i + 1)) / (ids.length + 1) }));
    wanted.sort((a, b) => a.d - b.d || a.id.localeCompare(b.id));
    const placed = pack(
      wanted.map((w) => w.d),
      lo,
      hi,
      PREFERRED_GAP,
    );
    wanted.forEach((w, i) => x.set(w.id, placed[i]));
  };
  // 往上一层层排：想去的位置 = 前置的平均位置；往下一层层排：= 后续的平均位置
  const fromPrereqs = (id: string): number | null => {
    const ps = (prereqs.get(id) ?? []).filter((p) => x.has(p));
    return ps.length ? mean(ps.map((p) => x.get(p)!)) : null;
  };
  const fromDependents = (id: string): number | null => {
    const ds = (dependents.get(id) ?? []).filter((d) => x.has(d));
    return ds.length ? mean(ds.map((d) => x.get(d)!)) : null;
  };
  const sweep = (levels: number[], desiredOf: (id: string) => number | null): void => {
    for (const level of levels) {
      for (const d of domains) {
        const ids = rows.get(`${d.id}|${level}`);
        if (ids) placeRow(d.id, ids, desiredOf);
      }
    }
  };
  const up = Array.from({ length: maxLevel + 1 }, (_, i) => i);
  sweep(up, fromPrereqs);
  sweep([...up].reverse(), fromDependents);
  sweep(up, fromPrereqs);
  // 坐标保留两位小数就够了，图谱文件也好读
  for (const [id, value] of x) x.set(id, Math.round(value * 100) / 100);
  return { subjects, domains: sectors, x, polar: relax3d(lessons, x, usable) };
}

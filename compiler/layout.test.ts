import { describe, expect, it } from 'vitest';
import { computeLevels, type PrereqMap } from './graph.ts';
import { layoutMap, MIN_DISTANCE_3D, PREFERRED_GAP, RADIUS_INNER, RADIUS_OUTER, type LayoutInput } from './layout.ts';

/** 小节 id 写成「领域.名字」，前置写在后面。 */
function input(domains: Record<string, string>, entries: Record<string, string[]>): LayoutInput {
  const prereqs: PrereqMap = new Map(Object.entries(entries));
  const levels = computeLevels(prereqs);
  return {
    domains: Object.entries(domains).map(([id, subject]) => ({ id, subject })),
    lessons: Object.keys(entries).map((id) => ({ id, domain: id.split('.').slice(0, 2).join('.'), level: levels.get(id)! })),
    prereqs,
  };
}

describe('星图展开图的布局', () => {
  it('数学占前半圈、物理占后半圈；领域按小节数分学科那一段', () => {
    const layout = layoutMap(
      input(
        { 'math.a': 'math', 'math.b': 'math', 'physics.c': 'physics' },
        { 'math.a.x': [], 'math.a.y': [], 'math.a.z': [], 'math.b.x': [], 'physics.c.x': [] },
      ),
    );
    expect(layout.subjects).toEqual([
      { id: 'math', start: 0, end: 180 },
      { id: 'physics', start: 180, end: 360 },
    ]);
    expect(layout.domains.get('math.a')).toMatchObject({ start: 0, end: 135 });
    expect(layout.domains.get('math.b')).toMatchObject({ start: 135, end: 180 });
    expect(layout.domains.get('physics.c')).toMatchObject({ start: 180, end: 360 });
    // 每个节点都在自己领域的扇区里
    for (const [id, x] of layout.x) {
      const sector = layout.domains.get(id.split('.').slice(0, 2).join('.'))!;
      expect(x).toBeGreaterThan(sector.start);
      expect(x).toBeLessThan(sector.end);
    }
  });

  it('一条链 A → B → C 竖直排成一列，在扇区正中', () => {
    const layout = layoutMap(input({ 'math.a': 'math' }, { 'math.a.a': [], 'math.a.b': ['math.a.a'], 'math.a.c': ['math.a.b'] }));
    expect([...layout.x.values()]).toEqual([90, 90, 90]);
  });

  it('同一层的节点按前置的位置排，挨得太近时推开，至少隔 PREFERRED_GAP', () => {
    const layout = layoutMap(
      input({ 'math.a': 'math' }, { 'math.a.root': [], 'math.a.left': ['math.a.root'], 'math.a.right': ['math.a.root'], 'math.a.mid': ['math.a.root'] }),
    );
    const xs = ['math.a.left', 'math.a.mid', 'math.a.right'].map((id) => layout.x.get(id)!).sort((a, b) => a - b);
    expect(xs[1] - xs[0]).toBeGreaterThanOrEqual(PREFERRED_GAP - 0.01);
    expect(xs[2] - xs[1]).toBeGreaterThanOrEqual(PREFERRED_GAP - 0.01);
    // 三个后续围着前置排开，前置在它们中间
    expect(layout.x.get('math.a.root')).toBeCloseTo(xs[1], 0);
  });

  it('扇区放不下时在扇区里均分，不越界', () => {
    const entries: Record<string, string[]> = { 'math.b.only': [] };
    for (let i = 0; i < 30; i++) entries[`math.a.n${String(i).padStart(2, '0')}`] = [];
    const layout = layoutMap(input({ 'math.a': 'math', 'math.b': 'math' }, entries));
    const sector = layout.domains.get('math.a')!;
    const xs = Object.keys(entries)
      .filter((id) => id.startsWith('math.a.'))
      .map((id) => layout.x.get(id)!)
      .sort((a, b) => a - b);
    expect(xs[0]).toBeGreaterThan(sector.start);
    expect(xs[xs.length - 1]).toBeLessThan(sector.end);
    for (let i = 1; i < xs.length; i++) expect(xs[i] - xs[i - 1]).toBeGreaterThan(0);
  });

  it('跨领域的前置不把节点拉出自己的扇区；同样的输入每次结果一样', () => {
    const data = input({ 'math.a': 'math', 'physics.c': 'physics' }, { 'math.a.x': [], 'physics.c.y': ['math.a.x'] });
    const layout = layoutMap(data);
    expect(layout.x.get('physics.c.y')).toBeGreaterThan(180);
    expect(layoutMap(data).x).toEqual(layout.x);
    expect(layoutMap(data).polar).toEqual(layout.polar);
  });
});

describe('立体星图的布局', () => {
  it('不挤的时候角度和展开图一样，半径在圆柱壳里', () => {
    const layout = layoutMap(input({ 'math.a': 'math' }, { 'math.a.a': [], 'math.a.b': ['math.a.a'], 'math.a.c': ['math.a.b'] }));
    for (const [id, { angle, radius }] of layout.polar) {
      expect(angle).toBeCloseTo(layout.x.get(id)!, 1);
      expect(radius).toBeGreaterThanOrEqual(RADIUS_INNER);
      expect(radius).toBeLessThanOrEqual(RADIUS_OUTER);
    }
  });

  it('同一层挤在小扇区里的节点在立体图里互相推开，角度不出扇区', () => {
    const entries: Record<string, string[]> = {};
    for (let i = 0; i < 12; i++) entries[`math.a.n${String(i).padStart(2, '0')}`] = [];
    for (let i = 0; i < 60; i++) entries[`math.b.n${String(i).padStart(2, '0')}`] = [];
    const layout = layoutMap(input({ 'math.a': 'math', 'math.b': 'math' }, entries));
    const sector = layout.domains.get('math.a')!;
    const points = Object.keys(entries)
      .filter((id) => id.startsWith('math.a.'))
      .map((id) => {
        const { angle, radius } = layout.polar.get(id)!;
        expect(angle).toBeGreaterThan(sector.start);
        expect(angle).toBeLessThan(sector.end);
        return [radius * Math.cos((angle * Math.PI) / 180), radius * Math.sin((angle * Math.PI) / 180)];
      });
    // 12 个节点挤在约 30° 的扇区里：展开图里只隔 2° 多，立体图里靠半径错开
    let closest = Infinity;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) closest = Math.min(closest, Math.hypot(points[i][0] - points[j][0], points[i][1] - points[j][1]));
    }
    expect(closest).toBeGreaterThan(MIN_DISTANCE_3D * 0.8);
  });
});

import { describe, expect, it } from 'vitest';
import { computeLevels, type PrereqMap } from './graph.ts';
import { layoutMap, MIN_DISTANCE_3D, RADIUS_INNER, RADIUS_OUTER, type LayoutInput } from './layout.ts';

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

describe('星图横向展开图的布局', () => {
  it('数学占上半、物理占下半；领域带的宽度按节点最多的那一层的个数再多一行分学科那一段', () => {
    const layout = layoutMap(
      input(
        { 'math.a': 'math', 'math.b': 'math', 'physics.c': 'physics' },
        { 'math.a.x': [], 'math.a.y': [], 'math.a.z': [], 'math.b.x': [], 'physics.c.x': [] },
      ),
    );
    // math.a 同一层 3 个 → 4 行，math.b 1 个 → 2 行：数学那半圈一行 30°
    expect(layout.subjects).toEqual([
      { id: 'math', start: 0, end: 180, row: 30 },
      { id: 'physics', start: 180, end: 360, row: 90 },
    ]);
    expect(layout.domains.get('math.a')).toMatchObject({ start: 0, end: 120 });
    expect(layout.domains.get('math.b')).toMatchObject({ start: 120, end: 180 });
    expect(layout.domains.get('physics.c')).toMatchObject({ start: 180, end: 360 });
    // 每个节点都在自己的领域带里
    for (const [id, y] of layout.y2d) {
      const band = layout.domains.get(id.split('.').slice(0, 2).join('.'))!;
      expect(y).toBeGreaterThan(band.start);
      expect(y).toBeLessThan(band.end);
    }
  });

  it('一条链 A → B → C 横着排成一行，在领域带正中', () => {
    const layout = layoutMap(input({ 'math.a': 'math' }, { 'math.a.a': [], 'math.a.b': ['math.a.a'], 'math.a.c': ['math.a.b'] }));
    expect([...layout.y2d.values()]).toEqual([90, 90, 90]);
  });

  it('同一层的节点按前置的位置排，相邻至少隔一行', () => {
    const layout = layoutMap(
      input({ 'math.a': 'math' }, { 'math.a.root': [], 'math.a.left': ['math.a.root'], 'math.a.right': ['math.a.root'], 'math.a.mid': ['math.a.root'] }),
    );
    const row = layout.subjects[0].row;
    const ys = ['math.a.left', 'math.a.mid', 'math.a.right'].map((id) => layout.y2d.get(id)!).sort((a, b) => a - b);
    expect(ys[1] - ys[0]).toBeGreaterThanOrEqual(row - 0.01);
    expect(ys[2] - ys[1]).toBeGreaterThanOrEqual(row - 0.01);
    // 三个后续围着前置排开，前置在它们中间
    expect(layout.y2d.get('math.a.root')).toBeCloseTo(ys[1], 0);
  });

  it('节点最多的那一层也放得下：相邻隔整整一行，不出领域带', () => {
    const entries: Record<string, string[]> = { 'math.b.only': [] };
    for (let i = 0; i < 30; i++) entries[`math.a.n${String(i).padStart(2, '0')}`] = [];
    const layout = layoutMap(input({ 'math.a': 'math', 'math.b': 'math' }, entries));
    const band = layout.domains.get('math.a')!;
    const row = layout.subjects[0].row;
    const ys = Object.keys(entries)
      .filter((id) => id.startsWith('math.a.'))
      .map((id) => layout.y2d.get(id)!)
      .sort((a, b) => a - b);
    expect(ys[0]).toBeGreaterThan(band.start);
    expect(ys[ys.length - 1]).toBeLessThan(band.end);
    for (let i = 1; i < ys.length; i++) expect(ys[i] - ys[i - 1]).toBeGreaterThanOrEqual(row - 0.02);
  });

  it('跨领域的前置不把节点拉出自己的领域带；同样的输入每次结果一样', () => {
    const data = input({ 'math.a': 'math', 'physics.c': 'physics' }, { 'math.a.x': [], 'physics.c.y': ['math.a.x'] });
    const layout = layoutMap(data);
    expect(layout.y2d.get('physics.c.y')).toBeGreaterThan(180);
    expect(layoutMap(data).y2d).toEqual(layout.y2d);
    expect(layoutMap(data).polar).toEqual(layout.polar);
  });
});

describe('立体星图的布局', () => {
  it('不挤的时候绕轴的角度和展开图的纵坐标一样，离轴的距离在圆筒壳里', () => {
    const layout = layoutMap(input({ 'math.a': 'math' }, { 'math.a.a': [], 'math.a.b': ['math.a.a'], 'math.a.c': ['math.a.b'] }));
    for (const [id, { angle, radius }] of layout.polar) {
      expect(angle).toBeCloseTo(layout.y2d.get(id)!, 1);
      expect(radius).toBeGreaterThanOrEqual(RADIUS_INNER);
      expect(radius).toBeLessThanOrEqual(RADIUS_OUTER);
    }
  });

  it('同一层挤在窄领域带里的节点在立体图里互相推开，角度不出领域带', () => {
    const entries: Record<string, string[]> = {};
    for (let i = 0; i < 12; i++) entries[`math.a.n${String(i).padStart(2, '0')}`] = [];
    for (let i = 0; i < 60; i++) entries[`math.b.n${String(i).padStart(2, '0')}`] = [];
    const layout = layoutMap(input({ 'math.a': 'math', 'math.b': 'math' }, entries));
    const band = layout.domains.get('math.a')!;
    const points = Object.keys(entries)
      .filter((id) => id.startsWith('math.a.'))
      .map((id) => {
        const { angle, radius } = layout.polar.get(id)!;
        expect(angle).toBeGreaterThan(band.start);
        expect(angle).toBeLessThan(band.end);
        return [radius * Math.cos((angle * Math.PI) / 180), radius * Math.sin((angle * Math.PI) / 180)];
      });
    // 12 个节点挤在约 30° 的领域带里：展开图里只隔 2° 多，立体图里靠离轴的距离错开
    let closest = Infinity;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) closest = Math.min(closest, Math.hypot(points[i][0] - points[j][0], points[i][1] - points[j][1]));
    }
    expect(closest).toBeGreaterThan(MIN_DISTANCE_3D * 0.8);
  });
});

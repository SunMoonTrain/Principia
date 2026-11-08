import { describe, expect, it } from 'vitest';
import { missingPrereqs, nodeState, type NodeLesson } from './node-state.ts';
import { EMPTY_PROGRESS, type ProgressState } from './progress.ts';

const lesson = (id: string, prerequisites: string[], status: NodeLesson['status'] = 'written'): NodeLesson => ({ id, status, prerequisites });
const A = lesson('A', []);
const B = lesson('B', ['A']);
const C = lesson('C', ['B']);
const withStatus = (entries: Record<string, 'completed' | 'known' | 'none'>): ProgressState => ({
  lessons: Object.fromEntries(Object.entries(entries).map(([id, status]) => [id, { status, statusAt: '2026-11-09T10:00:00+08:00' }])),
  problems: {},
});
const states = (progress: ProgressState): string[] => [A, B, C].map((l) => nodeState(l, progress));

// plan.md「测试用例与验收 / 图谱」
describe('节点状态', () => {
  it('三节链 A → B → C：完成 A 后，B 从「够不着」变为「可学」，C 不变', () => {
    expect(states(EMPTY_PROGRESS)).toEqual(['available', 'locked', 'locked']);
    expect(states(withStatus({ A: 'completed' }))).toEqual(['completed', 'available', 'locked']);
  });

  it('「已会」和「已完成」一样算前置已满足；撤销（none）以后又够不着', () => {
    expect(states(withStatus({ A: 'known' }))).toEqual(['known', 'available', 'locked']);
    expect(states(withStatus({ A: 'none' }))).toEqual(['available', 'locked', 'locked']);
  });

  it('只有目录的是「待写」；标了「已会」就是已会，写好以后也还是已会', () => {
    const outline = lesson('D', [], 'outline');
    expect(nodeState(outline, EMPTY_PROGRESS)).toBe('outline');
    expect(nodeState(outline, withStatus({ D: 'known' }))).toBe('known');
    expect(nodeState({ ...outline, status: 'written' }, withStatus({ D: 'known' }))).toBe('known');
  });

  it('列出还没学的前置：待写的前置没标「已会」也算没学', () => {
    const E = lesson('E', ['A', 'D']);
    expect(missingPrereqs(E, withStatus({ A: 'completed' }))).toEqual(['D']);
    expect(missingPrereqs(E, withStatus({ A: 'completed', D: 'known' }))).toEqual([]);
  });
});

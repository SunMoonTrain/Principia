import { describe, expect, it } from 'vitest';
import { computeLevels, findCycles, redundantPrereqs, type PrereqMap } from './graph.ts';

const map = (entries: Record<string, string[]>): PrereqMap => new Map(Object.entries(entries));

// plan.md「测试用例与验收 / 图谱」
describe('前置关系', () => {
  it('三节链 A → B → C 的层级依次为 0、1、2', () => {
    const levels = computeLevels(map({ A: [], B: ['A'], C: ['B'] }));
    expect([levels.get('A'), levels.get('B'), levels.get('C')]).toEqual([0, 1, 2]);
  });

  it('层级取最长前置链', () => {
    const levels = computeLevels(map({ A: [], B: ['A'], C: ['B'], D: ['A', 'C'] }));
    expect(levels.get('D')).toBe(3);
  });

  it('环 A → B → A 能找出来，并列出 A 和 B', () => {
    const cycles = findCycles(map({ A: ['B'], B: ['A'], C: [] }));
    expect(cycles).toHaveLength(1);
    expect(new Set(cycles[0])).toEqual(new Set(['A', 'B']));
    expect(cycles[0][0]).toBe(cycles[0][cycles[0].length - 1]);
  });

  it('三节的环给出完整路径', () => {
    const cycles = findCycles(map({ A: ['C'], B: ['A'], C: ['B'] }));
    expect(cycles).toEqual([['A', 'B', 'C', 'A']]);
  });

  it('没有环时返回空', () => {
    expect(findCycles(map({ A: [], B: ['A'], C: ['A', 'B'] }))).toEqual([]);
  });

  it('能由别的前置推出的前置算多余', () => {
    expect(redundantPrereqs(map({ A: [], B: ['A'], C: ['A', 'B'] }))).toEqual([{ lesson: 'C', redundant: 'A', via: 'B' }]);
  });
});

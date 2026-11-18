import { expect, it } from 'vitest';
import { History, type Machine } from './machine';
import { mulberry32 } from './rng';

interface State { count: number; checksum: number }
const counter: Machine<number, State> = {
  init: (count, seed) => ({ count, checksum: seed }),
  step(s, grain) {
    const count = s.count + (grain === 'pair' ? 2 : 1);
    return { state: { count, checksum: Math.imul(s.checksum, 31) + count | 0 }, events: [{ text: '计到 ' + count }] };
  },
  edit: (s, value) => ({ ...s, count: Number(value) }),
  observe: (s) => ({ ...s }),
};

it('100 步后退 37 步再逐步前进，状态和事件完全相同', () => {
  const h = new History(counter, 0, 7);
  h.seek(100);
  const first = { state: h.state, events: h.events };
  for (let i = 0; i < 37; i++) h.seek(h.index - 1);
  expect(h.index).toBe(63);
  for (let i = 0; i < 37; i++) h.step();
  expect({ state: h.state, events: h.events }).toEqual(first);
});

it('超过 20000 步后按原粒度从检查点重放，保护编辑点', () => {
  const h = new History(counter, 0, 7);
  const states = [counter.init(0, 7)];
  for (let i = 0; i < 25000; i++) {
    const grain = i % 3 === 0 ? 'pair' : 'single';
    h.step(grain);
    states.push(counter.step(states[i], grain).state);
  }
  for (const i of [3, 4321, 401, 25000, 50]) {
    h.seek(i);
    expect(h.state).toEqual(states[i]);
  }
  h.edit(81);
  expect(h.end).toBe(50);
  const edited = { ...states[50], count: 81 };
  expect(h.state).toEqual(edited);
  h.seek(25000);
  h.seek(51);
  expect(h.state).toEqual(counter.step(edited).state);
  h.seek(49);
  expect(h.state).toEqual(states[49]);
  h.step('single');
  expect(h.state).toEqual(edited);
  h.step('pair');
  expect(h.end).toBe(51);
  expect(h.state).toEqual(counter.step(edited, 'pair').state);
});

it('预计算停在终点、保留当前步骤；种子产生稳定的 mulberry32 序列', () => {
  const machine: Machine<number, number> = {
    init: (n) => n, step: (n) => ({ state: n + 1, done: n === 2, events: [] }), observe: (n) => ({ n }),
  };
  const h = new History(machine, 0, 0);
  h.preview(100);
  expect([h.index, h.state, h.end]).toEqual([0, 0, 3]);
  h.seek(100);
  h.step();
  expect([h.index, h.state, h.done]).toEqual([3, 3, true]);
  const next = mulberry32(1);
  expect([next(), next()].map((v) => v * 2 ** 32)).toEqual([2693262067, 11749833]);
});

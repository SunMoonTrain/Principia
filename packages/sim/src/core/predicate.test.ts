import { expect, it } from 'vitest';
import { compilePredicate } from './predicate';

it.each(['n == 2', 'n != 3', '1 < n', 'n <= 2', 'n > 1', 'n >= 2',
  'not flag and (n == 2 or mem(0x10) == 7)', 'mem(0x10) == 7 and n + 2 == 4'])('%s', (src) => {
  expect(compilePredicate(src, ['n', 'flag', 'mem'])({ n: 2, flag: false }, (addr) => addr === 16 ? 7 : 0)).toBe(true);
});
it('逻辑短路；内存和观测量必须由这个组件提供', () => {
  expect(compilePredicate('flag and mem(0) > 0', ['flag', 'mem'])({ flag: false }, () => { throw Error(); })).toBe(false);
  for (const src of ['other == 0', 'mem(0) == 1', 'value = 1', 'random()']) expect(() => compilePredicate(src, ['value'])).toThrow();
});

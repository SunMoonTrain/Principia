import { describe, expect, it } from 'vitest';
import {
  apply,
  composeAt,
  det,
  eigenDirections,
  gridExtent,
  IDENTITY,
  lerpFromIdentity,
  multiply,
  product,
  STEP_HOLD,
  STEP_SECONDS,
  stepAt,
  timeAtProgress,
  totalTime,
  type Mat2,
} from './linmap.ts';

const ROTATE_90: Mat2 = [0, -1, 1, 0];
const STRETCH_X: Mat2 = [2, 0, 0, 1];

function close(a: readonly number[], b: readonly number[], digits = 12): void {
  expect(a.length).toBe(b.length);
  a.forEach((x, i) => expect(x).toBeCloseTo(b[i], digits));
}

/** v 是不是 m 的特征向量：m·v 和 v 平行（叉积为零）。 */
function isEigenvector(m: Mat2, [x, y]: [number, number]): boolean {
  const [u, v] = apply(m, x, y);
  return Math.abs(u * y - v * x) < 1e-9 * Math.max(1, Math.hypot(u, v));
}

describe('LinearMap2D 的计算', () => {
  it('依次作用：后面的矩阵乘在左边；先转 90° 再横向拉长 2 倍是 [[0, −2], [1, 0]]', () => {
    close(product([ROTATE_90, STRETCH_X]), multiply(STRETCH_X, ROTATE_90));
    close(product([ROTATE_90, STRETCH_X]), [0, -2, 1, 0]);
    close(product([STRETCH_X, ROTATE_90]), [0, -1, 2, 0]);
    close(product([]), IDENTITY);
    expect(det(product([ROTATE_90, STRETCH_X]))).toBeCloseTo(det(ROTATE_90) * det(STRETCH_X), 12);
  });

  it('插值从单位矩阵开始、到目标矩阵结束；分步时每一步接着上一步的结果', () => {
    const mats: Mat2[] = [ROTATE_90, STRETCH_X, [1, 0.5, 0, 1]];
    close(lerpFromIdentity(STRETCH_X, 0), IDENTITY);
    close(lerpFromIdentity(STRETCH_X, 1), STRETCH_X);
    close(composeAt(mats, 0, 0), IDENTITY);
    for (let k = 0; k < mats.length - 1; k++) close(composeAt(mats, k, 1), composeAt(mats, k + 1, 0));
    close(composeAt(mats, mats.length - 1, 1), product(mats));
  });

  it('时间轴：每步 2 秒，步与步之间停一下；进度条和时刻能互相换算', () => {
    expect(STEP_SECONDS).toBe(2);
    expect(totalTime(1)).toBe(2);
    expect(totalTime(3)).toBeCloseTo(3 * STEP_SECONDS + 2 * STEP_HOLD, 12);
    expect(stepAt(0, 3)).toEqual({ index: 0, s: 0, progress: 0 });
    expect(stepAt(totalTime(3), 3)).toEqual({ index: 2, s: 1, progress: 3 });
    expect(stepAt(-1, 1).progress).toBe(0);
    expect(stepAt(99, 1)).toEqual({ index: 0, s: 1, progress: 1 });
    // 两步之间停的那一会儿：停在上一步的终点
    expect(stepAt(STEP_SECONDS + STEP_HOLD / 2, 2)).toEqual({ index: 0, s: 1, progress: 1 });
    // 走到一半时两头放慢的进度也是一半
    expect(stepAt(STEP_SECONDS / 2, 1).s).toBeCloseTo(0.5, 12);
    expect(stepAt(STEP_SECONDS / 4, 1).s).toBeLessThan(0.25);
    for (const p of [0, 0.3, 1, 1.7, 2.5, 3]) expect(stepAt(timeAtProgress(p, 3), 3).progress).toBeCloseTo(p, 12);
  });

  it('特征向量的方向：对角矩阵、剪切、对称矩阵、旋转、单位矩阵的倍数', () => {
    const diagonal = eigenDirections([2, 0, 0, 3]);
    expect(diagonal.directions).toHaveLength(2);
    expect(diagonal.directions.every((v) => isEigenvector([2, 0, 0, 3], v))).toBe(true);
    // 剪切只有一个方向：横轴
    const shear = eigenDirections([1, 1.5, 0, 1]);
    expect(shear.directions).toHaveLength(1);
    expect(Math.abs(shear.directions[0][0])).toBeCloseTo(1, 12);
    const symmetric = eigenDirections([2, 1, 1, 2]);
    expect(symmetric.directions.map(([x, y]) => Math.abs(x * y))).toEqual([expect.closeTo(0.5, 12), expect.closeTo(0.5, 12)]);
    expect(eigenDirections(ROTATE_90)).toEqual({ directions: [], all: false });
    expect(eigenDirections([2, 0, 0, 2])).toEqual({ directions: [], all: true });
    // 随便取一些有实特征值的矩阵：给出的方向都是特征向量，而且插值过程中一直是
    const samples: Mat2[] = [[1.5, 0.5, 0.5, 1], [0, 1, 1, 0], [3, -2, 1, 0], [-1, 2, 0.5, 1], [1e-3, 2, 3, 1e-3]];
    for (const m of samples) {
      const { directions } = eigenDirections(m);
      expect(directions.length).toBeGreaterThan(0);
      for (const v of directions) {
        expect(Math.hypot(...v)).toBeCloseTo(1, 12);
        for (const s of [0.25, 0.5, 1]) expect(isEigenvector(lerpFromIdentity(m, s), v)).toBe(true);
      }
    }
  });

  it('网格画到显示范围四个角逆变换回去的地方；不可逆时画到上限', () => {
    expect(gridExtent(IDENTITY, [-3, 3], [-2, 2], 100)).toBeCloseTo(3, 12);
    expect(gridExtent([0.5, 0, 0, 0.5], [-3, 3], [-3, 3], 100)).toBeCloseTo(6, 12);
    expect(gridExtent([1, 2, 2, 4], [-3, 3], [-3, 3], 100)).toBe(100);
    expect(gridExtent([1e-4, 0, 0, 1], [-3, 3], [-3, 3], 100)).toBe(100);
  });
});

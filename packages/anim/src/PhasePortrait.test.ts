import { describe, expect, it } from 'vitest';
import { compileExpr } from './expr.ts';
import { MAX_FULL_TRAIL, PhaseSim } from './PhasePortrait.tsx';

const NAMES = ['x', 'y', 't'];

function sim(fx: string, fy: string, dt: number, start: [number, number], full: [[number, number], [number, number]] | null): PhaseSim {
  return new PhaseSim(compileExpr(fx, NAMES), compileExpr(fy, NAMES), dt, 0, [start], full);
}

/** 尾迹里按先后排的点。 */
function trail(s: PhaseSim): [number, number][] {
  const tr = s.list[0];
  const capacity = tr.trail.length / 2;
  const oldest = (tr.head - tr.length + capacity) % capacity;
  return Array.from({ length: tr.length }, (_, k) => {
    const at = ((oldest + k) % capacity) * 2;
    return [tr.trail[at], tr.trail[at + 1]];
  });
}

describe('PhasePortrait 的尾迹', () => {
  it('默认只留最近 8 个单位的时间，轨迹一直往前算', () => {
    const s = sim('1', '0', 0.01, [0, 0], null);
    s.advance(2000);
    const points = trail(s);
    expect(points).toHaveLength(800);
    expect(s.list[0].stopped).toBe(false);
    expect(points[0][0]).toBeCloseTo(12.01, 6);
    expect(points[799][0]).toBeCloseTo(20, 6);
  });

  it('trail: full 整条留着（缓冲区不够就加倍），跑出显示范围就停在边上', () => {
    const s = sim('1', '0', 0.01, [0, 0], [
      [0, 100],
      [-1, 1],
    ]);
    s.advance(20000);
    const points = trail(s);
    expect(s.list[0].stopped).toBe(true);
    expect(points[0]).toEqual([0, 0]);
    expect(points.length).toBeGreaterThan(800);
    const last = points[points.length - 1][0];
    expect(last).toBeGreaterThan(100);
    expect(last).toBeLessThan(100.02);
    // 画面里相邻两个记下的点至少隔开显示范围的千分之一（出界的最后一点不管多近都记）
    const inside = points.slice(0, -1);
    expect(Math.min(...inside.slice(1).map((p, k) => p[0] - inside[k][0]))).toBeGreaterThanOrEqual(0.1 - 1e-9);
  });

  it('trail: full 停在平衡点附近的轨迹不越攒越多；绕圈的轨迹到上限就停', () => {
    const box: [[number, number], [number, number]] = [
      [-2, 2],
      [-2, 2],
    ];
    const sink = sim('-x', '-y', 0.01, [1, 1], box);
    sink.advance(10000);
    expect(sink.list[0].stopped).toBe(false);
    expect(sink.list[0].length).toBeLessThan(400);

    const circle = sim('-y', 'x', 0.01, [1, 0], box);
    circle.advance(40000);
    expect(circle.list[0].stopped).toBe(true);
    expect(circle.list[0].length).toBe(MAX_FULL_TRAIL);
  });

  it('重新开始时从起点重记，加倍过的缓冲区接着用', () => {
    const s = sim('1', '0', 0.01, [0, 0], [
      [0, 100],
      [-1, 1],
    ]);
    s.advance(20000);
    s.restart();
    expect(trail(s)).toEqual([[0, 0]]);
    s.advance(500);
    const points = trail(s);
    expect(points[0]).toEqual([0, 0]);
    expect(s.list[0].y[0]).toBeCloseTo(5, 6);
    expect(5 - points[points.length - 1][0]).toBeLessThan(0.1);
    expect(s.list[0].stopped).toBe(false);
  });
});

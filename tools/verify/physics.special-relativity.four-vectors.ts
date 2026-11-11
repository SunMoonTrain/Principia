// 独立验算 physics.special-relativity.four-vectors 的 p1–p4（简单题、中等题）。
// 内积用两条路：一是按度规 η = diag(1, −1, −1, −1) 逐项相乘；二是不写度规，用「时间分量² − 空间部分的几何长度²」
// 和极化恒等式（dotByPolarization），再把两个矢量一起做几次任意方向的推进，核对内积不变。
// 变换后的分量另用批次 6 的雷达法（只用光信号）算：把四维矢量当成两个事件的坐标差。
// 单独运行：npx tsx tools/verify/physics.special-relativity.four-vectors.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, boost4ByRadar, boostAlong, check, chosen, dot4, dotByPolarization, gamma, type Four } from './physics.special-relativity._relativity.ts';

const boosts: [number, [number, number, number]][] = [
  [0.7, [1, 0, 0]],
  [1.3, [0.3, -1, 0.5]],
  [-0.4, [0, 0.2, 1]],
];

export const verification: Verification = {
  lesson: 'physics.special-relativity.four-vectors',
  notes: {
    p1: '按度规逐项相乘；另用极化恒等式（不写度规）算一遍；再把 A、B 一起做三次不同方向、不同快度的推进，内积都不变。',
    p2: 'A：x^μ = (ct, x, y, z) 的第 3 个是 z；B：取两个随意的矢量，降指标后 A_μB^μ 和 A^μB_μ 相等；C：(1, 0, 0, 0) 推进后时间分量变成 γ（反例）；D：A·A < 0 就是类空的定义，推进后符号不变；E：Σ A^μB^μ（两个都是上标）推进后会变，不是求和约定表示的量（反例）。',
    p3: '用 4×4 的 Λ(0.8) 算 A′⁰；另把 A 当成两个事件的坐标差（ct = 5，x = 3，y = 4），用批次 6 的雷达法求 S′ 里的时间差。',
    p4: 'A·B = 2k − 3 = 0 解出 k；另对 k 二分求零点；再算 B·B < 0，是类空的。',
  },
  compute() {
    // p1
    const A1: Four = [3, 1, 2, 0];
    const B1: Four = [2, 1, 0, 1];
    const p1 = agree(dotByPolarization(A1, B1), dot4(A1, B1), 'p1');
    for (const [phi, n] of boosts) agree(dot4(boostAlong(phi, n, A1), boostAlong(phi, n, B1)), p1, 'p1 推进后不变');

    // p2
    const A2 = true;
    const X: Four = [1.7, -0.4, 2.2, 0.9];
    const Y: Four = [0.3, 1.1, -0.6, 2.5];
    const lower = (V: Four): Four => [V[0], -V[1], -V[2], -V[3]];
    const sum = (P: Four, Q: Four): number => P.reduce((s, p, i) => s + p * Q[i], 0);
    const B2 = Math.abs(sum(lower(X), Y) - sum(X, lower(Y))) < 1e-12;
    const C2 = Math.abs(boostAlong(0.5, [1, 0, 0], [1, 0, 0, 0])[0] - 1) < 1e-12;
    const negative: Four = [1, 2, 0, 0];
    check(dot4(negative, negative) < 0 && boosts.every(([phi, n]) => dot4(boostAlong(phi, n, negative), boostAlong(phi, n, negative)) < 0), 'p2 D：类空推进后仍类空');
    const D2 = true;
    check(Math.abs(sum(boostAlong(0.5, [1, 0, 0], X), boostAlong(0.5, [1, 0, 0], Y)) - sum(X, Y)) > 1e-3, 'p2 E：两个上标逐项相乘再加，推进后会变');
    const E2 = false;
    const p2 = chosen([A2, B2, C2, D2, E2]);

    // p3
    const A3: Four = [5, 3, 4, 0];
    const g = gamma(0.8);
    const p3 = agree(boost4ByRadar(0.8, A3)[0], g * (A3[0] - 0.8 * A3[1]), 'p3');

    // p4
    const A4: Four = [2, 1, 0, 0];
    const k = bisect((kk) => dot4(A4, [kk, 3, 1, 0]), -10, 10);
    const p4 = agree(k, 3 / 2, 'p4');
    check(dot4([p4, 3, 1, 0], [p4, 3, 1, 0]) < 0, 'p4：B 是类空的');

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}

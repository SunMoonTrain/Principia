// 独立验算 physics.newtonian-mechanics.rotational-energy 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的 ½Iω²、平行轴定理、机械能守恒；二是 p1 把飞轮换成同样转动惯量的细圆环逐点算 ½mv²，
// p3 沿圆环逐点数值积分到钉子的距离的平方，p4 用转动定律求加速度再由匀加速运动算速率。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.rotational-energy.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen, integrate } from './physics.newtonian-mechanics._nm.ts';

const g = 9.8;

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.rotational-energy',
  notes: {
    p1: '½×0.80×50²；和半径 0.5 m、质量 3.2 kg 的细圆环（I 也是 0.80）分成 3600 个质点、逐个算 ½m(rω)² 再相加核对。',
    p2: '逐条用例子：A I = 0.8、ω = 5 的两个刚体，½Iω² 都是 10 J（对）；B I = 1、ω = 2 和 I = 4、ω = 1，动能都是 2 J，角动量 2 和 4（错）；C 半径 1、质量 1 的圆盘，数值二重积分对盘边一点的 I = 1.5（对）；D ω 加倍动能变成 4 倍（错）；E 长 1、质量 1 的细杆，分段求和得对一端、对中点的 I 之比为 4，动能之比也是 4（对）。',
    p3: '平行轴定理 MR² + MR² = 2MR²；和沿圆环数值积分 ∫|r − r钉|² dm 核对。',
    p4: '机械能守恒 (m1 − m2)gh = ½(m1 + m2 + M/2)v²；和用转动定律求 a = (m1 − m2)g/(m1 + m2 + M/2)，再 v = √(2ah) 核对。',
  },
  compute() {
    // p1（J）
    const I = 0.8;
    const w = 50;
    const rr = 0.5;
    const Mr = I / (rr * rr);
    const n = 3600;
    let K = 0;
    for (let i = 0; i < n; i++) K += 0.5 * (Mr / n) * (rr * w) ** 2;
    const p1 = agree(K, 0.5 * I * w * w, 'p1 转动动能', 1e-12);

    // p2
    const optA = Math.abs(0.5 * 0.8 * 25 - 0.5 * 0.8 * 25) < 1e-12;
    check(0.5 * 1 * 2 ** 2 === 0.5 * 4 * 1 ** 2, 'p2 B 两个飞轮动能相同');
    const optB = 1 * 2 === 4 * 1;
    // C：圆盘（面密度 1/π）对盘边一点 (1, 0) 的转动惯量，用极坐标数值积分
    const Iedge = integrate((r) => integrate((phi) => ((r * Math.cos(phi) - 1) ** 2 + (r * Math.sin(phi)) ** 2) * (1 / Math.PI) * r, 0, 2 * Math.PI, 16, 16), 0, 1, 16, 16);
    check(Math.abs(Iedge - 1.5) < 1e-10, 'p2 C 对盘边一点的转动惯量是 1.5');
    const optC = Math.abs(Iedge - 1.5) < 1e-10;
    const optD = Math.abs(0.5 * 1 * 4 ** 2 - 2 * 0.5 * 1 * 2 ** 2) < 1e-12;
    const rodI = (from: number) => {
      const N = 100000;
      let s = 0;
      for (let i = 0; i < N; i++) {
        const x = from + (i + 0.5) / N;
        s += x * x / N;
      }
      return s;
    };
    const optE = Math.abs(rodI(0) / rodI(-0.5) - 4) < 1e-6;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（kg·m²）
    const M = 0.5;
    const R = 0.2;
    // 钉子在 (R, 0)；环上一点 (R cos φ, R sin φ)，dm = M dφ/(2π)
    const Ipivot = integrate((phi) => ((R * Math.cos(phi) - R) ** 2 + (R * Math.sin(phi)) ** 2) * (M / (2 * Math.PI)), 0, 2 * Math.PI);
    const p3 = agree(Ipivot, 2 * M * R * R, 'p3 圆环对钉子的转动惯量', 1e-12);

    // p4（m/s）
    const m1 = 3.0;
    const m2 = 1.0;
    const Mp = 2.0;
    const h = 1.0;
    const a = ((m1 - m2) * g) / (m1 + m2 + Mp / 2);
    const vEnergy = Math.sqrt((2 * (m1 - m2) * g * h) / (m1 + m2 + Mp / 2));
    const p4 = agree(Math.sqrt(2 * a * h), vEnergy, 'p4 速率', 1e-12);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}

// 独立验算 physics.thermal-physics.kinetic-theory 的 p1–p4（简单题、中等题）。
// 常量按 CODATA 的定义值：N_A = 6.022 140 76×10^23 /mol，k_B = 1.380 649×10^-23 J/K，R = N_A·k_B；摩尔质量照题面取。
// 两套算法：一是讲解里的式子（⟨ε_t⟩ = 3/2·k_B T，p = 1/3·(N/V)·m⟨v²⟩，v_rms = √(3RT/M)）；
// 二是不用这些式子，直接模拟长方体盒子里的分子：事件驱动的台球模拟，每个分子沿直线飞，先撞到哪面墙就把那个速度分量反向
// （弹性碰撞，平行于墙的分量不变），逐次记下撞右壁 x = Lx 的次数和交给右壁的冲量 2m|v_x|；很长的时间 Δt 里冲量之和除以 Δt·A
// 就是压强。温度用前置 ideal-gas-law 的 pV = N k_B T 从模拟出的压强读出（T = pV/(N k_B)），平均平动动能、方均根速率直接对分子的
// 速度求平均。分子之间不相碰（理想气体的微观模型）。
// 速度：每个分子的速度分量取独立的正态随机数（固定种子），再把每个速度的 3 个分量轮换、对调，各分量取正负号，展开成 48 个分子，
// 这样「没有哪个方向特殊」严格成立；要某个温度，就把全部速度乘同一个因子 s，再用模拟读出的温度核对。
// 单独运行：npx tsx tools/verify/physics.thermal-physics.kinetic-theory.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen } from './physics.electromagnetism._es.ts';

const NA = 6.02214076e23; // mol^-1
const kB = 1.380649e-23; // J/K
const R = NA * kB; // J/(mol·K)

type V3 = [number, number, number];

/** 固定种子的伪随机数（mulberry32），[0, 1)。 */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 标准正态随机数（Box-Muller）。 */
function gauss(r: () => number): number {
  let u = r();
  while (u === 0) u = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r());
}

/** groups 组速度，每组 48 个：3 个分量的 6 种排列 × 8 种正负号。分量的标准差为 sigma。 */
function isotropicVelocities(groups: number, sigma: number, seed: number): V3[] {
  const r = rng(seed);
  const perms = [
    [0, 1, 2],
    [1, 2, 0],
    [2, 0, 1],
    [0, 2, 1],
    [2, 1, 0],
    [1, 0, 2],
  ];
  const out: V3[] = [];
  for (let g = 0; g < groups; g++) {
    const base = [gauss(r) * sigma, gauss(r) * sigma, gauss(r) * sigma];
    for (const p of perms) {
      for (let s = 0; s < 8; s++) {
        out.push([(s & 1 ? -1 : 1) * base[p[0]], (s & 2 ? -1 : 1) * base[p[1]], (s & 4 ? -1 : 1) * base[p[2]]]);
      }
    }
  }
  return out;
}

const scaleAll = (vs: V3[], s: number): V3[] => vs.map(([a, b, c]) => [a * s, b * s, c * s]);
const meanSq = (vs: V3[]): number => vs.reduce((acc, [a, b, c]) => acc + a * a + b * b + c * c, 0) / vs.length;
/** 直接对分子求平均的平均平动动能（J）。 */
const meanKE = (m: number, vs: V3[]): number => 0.5 * m * meanSq(vs);
/** 直接对分子求平均的方均根速率。 */
const vrmsOf = (vs: V3[]): number => Math.sqrt(meanSq(vs));

interface WallResult {
  /** 右壁在 Δt 里收到的总冲量（N·s）。 */
  impulse: number;
  /** 右壁在 Δt 里挨撞的次数。 */
  hits: number;
}

/**
 * 事件驱动的台球模拟：盒子 [0,Lx]×[0,Ly]×[0,Lz]，分子从随机位置出发，飞到最近的墙就把那个分量反向。
 * 只记右壁 x = Lx 收到的冲量和挨撞的次数。
 */
function simulateWall(m: number, vs: V3[], box: V3, dt: number, seed: number): WallResult {
  const r = rng(seed);
  let impulse = 0;
  let hits = 0;
  for (const v0 of vs) {
    const x: V3 = [r() * box[0], r() * box[1], r() * box[2]];
    const v: V3 = [v0[0], v0[1], v0[2]];
    let t = 0;
    for (;;) {
      // 三个方向上各自撞墙还要多久
      let best = Infinity;
      let axis = -1;
      for (let k = 0; k < 3; k++) {
        if (v[k] === 0) continue;
        const tk = v[k] > 0 ? (box[k] - x[k]) / v[k] : -x[k] / v[k];
        if (tk < best) {
          best = tk;
          axis = k;
        }
      }
      if (axis < 0 || t + best > dt) break;
      t += best;
      for (let k = 0; k < 3; k++) x[k] += v[k] * best;
      x[axis] = v[axis] > 0 ? box[axis] : 0;
      if (axis === 0 && v[0] > 0) {
        impulse += 2 * m * v[0];
        hits += 1;
      }
      v[axis] = -v[axis];
    }
  }
  return { impulse, hits };
}

interface Measured {
  p: number;
  T: number;
  impulsePerHit: number;
  hitsPerTime: number;
}

/** 模拟一段足够长的时间（典型的分子沿 x 来回约 roundTrips 次），读出压强、温度（pV = N k_B T）、每次撞壁的平均冲量、单位时间挨撞的次数。 */
function measure(m: number, vs: V3[], box: V3, roundTrips = 600, seed = 7): Measured {
  const dt = (roundTrips * 2 * box[0]) / vrmsOf(vs);
  const { impulse, hits } = simulateWall(m, vs, box, dt, seed);
  const A = box[1] * box[2];
  const V = box[0] * A;
  const p = impulse / (dt * A);
  return { p, T: (p * V) / (vs.length * kB), impulsePerHit: impulse / hits, hitsPerTime: hits / dt };
}

/** 把速度整体乘一个因子，使模拟读出的温度等于 T：先按 s² 估一次，再修正一次。 */
function atTemperature(m: number, vs: V3[], box: V3, T: number): { vs: V3[]; meas: Measured } {
  let cur = vs;
  for (let k = 0; k < 3; k++) {
    const meas = measure(m, cur, box);
    if (Math.abs(meas.T - T) <= 1e-4 * T) return { vs: cur, meas };
    cur = scaleAll(cur, Math.sqrt(T / meas.T));
  }
  const meas = measure(m, cur, box);
  check(Math.abs(meas.T - T) <= 1e-3 * T, `模拟读出的温度 ${meas.T} 调不到 ${T}`);
  return { vs: cur, meas };
}

const box: V3 = [1, 0.8, 0.6];
const GROUPS = 100; // 4800 个分子

export const verification: Verification = {
  lesson: 'physics.thermal-physics.kinetic-theory',
  notes: {
    p1: '3/2·k_B·500 K，以 10^-21 J 为单位；和模拟核对：氮分子、氦原子各 4800 个，速度整体缩放到撞壁读出的温度 pV/(N k_B) = 500 K，直接对分子求 ½m⟨v²⟩，两种气体都和 3/2·k_B·500 K 一致（≤ 2×10^-3）。',
    p2: '模拟：A 氮气 300 K → 600 K（同 N、V），直接求得的平均平动动能之比 2.000（对）；B 方均根速率之比 1.414，不是 2（错）；C 300 K 时拿走一半分子（每组 48 个里按正负号的奇偶拿走 24 个，剩下的速度分布不变），读出的压强之比 0.500、温度不变，剩下分子的平均平动动能之比 1.000，不减半（错）；D 300 K → 600 K，每次撞壁的平均冲量、单位时间撞壁的次数都变成约 1.414 倍（对）；E 都在 300 K 时，氢分子每次撞壁的平均冲量只有氧分子的约 1/4（√(2.016/32)），不比它大（错）。',
    p3: 'p = 1/3·(N/V)·(M/N_A)·v_rms²，以 kPa 为单位；和模拟核对：4800 个氦原子放进体积 4800/(2.0×10^25) m³ 的立方盒子，速度缩放到 v_rms = 1300 m/s，撞壁的冲量读出压强。',
    p4: 'v_rms = √(3RT/M) = 2370 m/s ⇒ T = M·v²/(3R)，M = 28.01 g/mol（题面），R 取精确值；R 取 8.314 时 6307.8 K，三位有效数字一样。和模拟核对：4800 个氮分子（m = M/N_A）的速度缩放到 v_rms = 2370 m/s，由撞右壁的冲量读出压强，再用 pV = N k_B T 读出温度。第 1 轮修订换的题（原题求和 300 K 氢气方均根速率相同的氧气温度）。',
  },
  compute() {
    const mN2 = 28.0134e-3 / NA;

    // p1（10^-21 J）
    const p1Exact = (1.5 * kB * 500) / 1e-21;
    for (const [M, seed] of [
      [28.0134e-3, 11],
      [4.0026e-3, 12],
    ] as const) {
      const m = M / NA;
      const { vs } = atTemperature(m, isotropicVelocities(GROUPS, 300, seed), box, 500);
      agree(meanKE(m, vs) / 1e-21, p1Exact, `p1 模拟（M = ${M}）`, 2e-3);
    }
    const p1 = p1Exact;

    // p2
    const base = isotropicVelocities(GROUPS, 300, 21);
    const g300 = atTemperature(mN2, base, box, 300);
    const g600 = atTemperature(mN2, g300.vs, box, 600);
    const keRatio = meanKE(mN2, g600.vs) / meanKE(mN2, g300.vs);
    const vrmsRatio = vrmsOf(g600.vs) / vrmsOf(g300.vs);
    const optA = Math.abs(keRatio - 2) < 2e-3;
    const optB = Math.abs(vrmsRatio - 2) < 2e-3;
    check(Math.abs(vrmsRatio - Math.SQRT2) < 2e-3, 'p2 B 方均根速率之比约 √2');
    // C：拿走一半分子。每组 48 个里按正负号的奇偶拿走一半（正负号 000、011、101、110 的留下），
    // 剩下的分子速度的分布和原来一样、各方向仍然均等，就是「随便抽走一半」在分子很多时的样子。
    const half = g300.vs.filter((_, i) => [0, 3, 5, 6].includes(i % 8));
    const halfMeas = measure(mN2, half, box);
    check(Math.abs(halfMeas.p / g300.meas.p - 0.5) < 3e-3, 'p2 C 拿走一半后压强减半');
    check(Math.abs(halfMeas.T / g300.meas.T - 1) < 3e-3, 'p2 C 拿走一半后温度不变');
    const halfAt300 = atTemperature(mN2, half, box, 300);
    const keHalfRatio = meanKE(mN2, halfAt300.vs) / meanKE(mN2, g300.vs);
    check(Math.abs(keHalfRatio - 1) < 3e-3, 'p2 C 同温下平均平动动能不变');
    const optC = Math.abs(halfMeas.p / g300.meas.p - 0.5) < 3e-3 && Math.abs(keHalfRatio - 0.5) < 3e-3;
    // D：同 N、V，升温
    const perHitUp = g600.meas.impulsePerHit / g300.meas.impulsePerHit;
    const rateUp = g600.meas.hitsPerTime / g300.meas.hitsPerTime;
    check(Math.abs(perHitUp - Math.SQRT2) < 5e-3 && Math.abs(rateUp - Math.SQRT2) < 5e-3, 'p2 D 两样都约是 √2 倍');
    const optD = perHitUp > 1 && rateUp > 1;
    // E：同温度的氢、氧
    const mH2 = 2.016e-3 / NA;
    const mO2 = 32.0e-3 / NA;
    const h2 = atTemperature(mH2, isotropicVelocities(GROUPS, 1000, 22), box, 300);
    const o2 = atTemperature(mO2, isotropicVelocities(GROUPS, 300, 23), box, 300);
    const perHitRatio = h2.meas.impulsePerHit / o2.meas.impulsePerHit;
    check(Math.abs(perHitRatio - Math.sqrt(2.016 / 32)) < 1e-2, 'p2 E 冲量之比约 √(m_H2/m_O2)');
    const optE = perHitRatio > 1;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（kPa）
    const n3 = 2.0e25;
    const m3 = 4.0e-3 / NA;
    const p3Exact = ((1 / 3) * n3 * m3 * 1300 ** 2) / 1e3;
    const vs3raw = isotropicVelocities(GROUPS, 700, 31);
    const vs3 = scaleAll(vs3raw, 1300 / vrmsOf(vs3raw));
    const side = Math.cbrt(vs3.length / n3);
    const meas3 = measure(m3, vs3, [side, side, side]);
    agree(meas3.p / 1e3, p3Exact, 'p3 模拟撞壁读出的压强', 2e-3);
    // 换一条路：v_rms → T = M v²/(3R)，再 p = (N/V) k_B T
    agree(n3 * kB * ((4.0e-3 * 1300 ** 2) / (3 * R)) / 1e3, p3Exact, 'p3 由温度再用 pV = N k_B T', 1e-12);
    const p3 = p3Exact;

    // p4（K）：氮分子的方均根速率等于月球的逃逸速度 2370 m/s 时的温度
    const vEsc = 2370;
    const M4 = 28.01e-3;
    const p4Exact = (M4 * vEsc ** 2) / (3 * R);
    const n2raw = isotropicVelocities(GROUPS, 1300, 41);
    const n2esc = scaleAll(n2raw, vEsc / vrmsOf(n2raw));
    check(Math.abs(vrmsOf(n2esc) - vEsc) < 1e-9 * vEsc, 'p4 缩放后 v_rms = 2370 m/s');
    const T4 = measure(M4 / NA, n2esc, box).T;
    agree(T4, p4Exact, 'p4 模拟撞壁读出的氮气温度', 2e-3);
    // R 取 8.314 时三位有效数字不变
    const T4r = (M4 * vEsc ** 2) / (3 * 8.314);
    check(Math.round(T4r / 10) === Math.round(p4Exact / 10), 'p4 R 取 8.314 时三位有效数字一样');
    const p4 = p4Exact;

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

// 独立验算 physics.newtonian-mechanics.rockets 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（反冲、火箭方程、推力 u|dm/dt|）；二是不用这些式子：
// p1 把枪和子弹之间一对内力交给四阶龙格-库塔法积分；p3 把燃气一小份一小份地喷出，每一份单独用动量守恒，
// 喷到速度达到 5.0 km/s 为止；p4 把竖直起飞的速度积分一小段，数值求导得 t = 0 的加速度。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.rockets.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, rk4, rk4Until } from './physics.newtonian-mechanics._nm.ts';

const g = 9.8;

/** 不受外力的火箭：每秒喷出 rate，排气速度 u，从质量 m0、速度 0 积到质量 m1，返回末速度（状态 [m, v]）。 */
function burn(m0: number, m1: number, u: number, rate: number): number {
  const e = rk4Until((_t, s) => [-rate, (u * rate) / s[0]], [m0, 0], 0, (m0 - m1) / rate / 20000, 1e7, (_t, s) => m1 - s[0]);
  return e.y[1];
}

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.rockets',
  notes: {
    p1: 'v = mv_弹/M = 0.010 × 800/4.0；和积分核对：枪和子弹之间一对内力 A sin(πt/τ)，二分出让子弹达到 800 m/s 的 A，读出枪的速度。',
    p2: '逐条用例子（u = 2 km/s）：A 质量比都是 4、每秒喷出 1 kg 和 10 kg 两种烧法，积分出的末速度相同（对）；B 同一例子，烧得快并不更快（错）；C u ln R² = 2u ln R，R = 3 时 4.39 km/s 两边相等（对）；D 每秒喷出 1 kg、m₀ = 10 kg，第 0 s、第 5 s 的加速度 0.2、0.4 km/s²（错）；E u ln 2 = 0.693u（对）。',
    p3: '燃料比例 1 − e^{−Δv/u} = 1 − e^{−2.5}；和逐份喷气核对：每次喷出 m₀ 的 10⁻⁶，每一份单独用动量守恒（Δv = u·δ/m），喷到速度达到 5.0 km/s，剩下的质量就是燃料烧完时的质量。',
    p4: 'a = (u|dm/dt| − m₀g)/m₀ = (6.0 − 4.9) × 10⁶/5.0 × 10⁵；和求导核对：m dv/dt = u|dm/dt| − mg 积到 t = 0.001 s，v/t 和二阶差分外推到 t = 0。',
  },
  compute() {
    // p1（m/s）
    const mGun = 4;
    const mB = 0.01;
    const tau = 1e-3;
    const shoot = (A: number) => rk4((t) => {
      const f = A * Math.sin((Math.PI * t) / tau);
      return [f / mB, -f / mGun];
    }, [0, 0], 0, tau, 2000);
    const A = bisect((a) => shoot(a)[0] - 800, 0, 1e6);
    const p1 = agree(-shoot(A)[1], (mB * 800) / mGun, 'p1 枪后退的速度', 1e-9);

    // p2
    const u = 2;
    const slow = burn(40, 10, u, 1);
    const fast = burn(40, 10, u, 10);
    const optA = Math.abs(slow - fast) < 1e-6;
    const optB = fast > slow + 1e-6;
    const optC = Math.abs(2 * u * Math.log(3) - u * Math.log(9)) < 1e-12;
    const aAt = (t: number) => (u * 1) / (10 - 1 * t);
    const optD = Math.abs(aAt(0) - aAt(5)) < 1e-12;
    const optE = Math.abs(burn(10, 5, u, 1) - 0.693 * u) < 0.001 * u;
    check(aAt(5) > aAt(0), 'D 的加速度在变大');
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（%）
    const uu = 2;
    const target = 5;
    const delta = 1e-6;
    let m = 1;
    let v = 0;
    while (v < target) {
      const dv = (uu * delta) / m;
      if (v + dv >= target) {
        // 最后一份只喷够需要的那一点
        m -= ((target - v) * m) / uu;
        v = target;
        break;
      }
      v += dv;
      m -= delta;
    }
    const p3 = agree(100 * (1 - m), 100 * (1 - Math.exp(-target / uu)), 'p3 燃料占的比例', 1e-5);

    // p4（m/s²）
    const m0 = 5e5;
    const rate = 2e3;
    const ue = 3e3;
    const vAt = (t: number) => rk4((s) => [(ue * rate) / (m0 - rate * s) - g], [0], 0, t, 200)[0];
    const h = 1e-3;
    const aNum = 2 * (vAt(h) / h) - vAt(2 * h) / (2 * h); // v/t 的理查森外推，消去 O(t) 项
    const formula4 = (ue * rate - m0 * g) / m0;
    const p4 = agree(aNum, formula4, 'p4 刚起飞时的加速度', 1e-6);

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

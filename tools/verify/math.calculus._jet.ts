// 单变量微积分验算用的泰勒展开式算术（自动求导的一种）：每个量存成 x = a 附近的泰勒系数 c[k] = f^(k)(a)/k!，
// 四则运算和 exp、log、sin、cos、实数次幂都按系数的递推公式算，k 阶导数就是 c[k]·k!。
// 文件名第三段以下划线开头，npm run verify 不把它当小节脚本。高阶导数这类题用差商算不准，用它算。

function factorial(k: number): number {
  let r = 1;
  for (let i = 2; i <= k; i++) r *= i;
  return r;
}

export class Jet {
  constructor(readonly c: number[]) {}

  get order(): number {
    return this.c.length - 1;
  }

  /** 自变量 x 在 a 附近：x = a + t。 */
  static variable(a: number, order: number): Jet {
    const c = new Array<number>(order + 1).fill(0);
    c[0] = a;
    if (order >= 1) c[1] = 1;
    return new Jet(c);
  }

  static constant(v: number, order: number): Jet {
    const c = new Array<number>(order + 1).fill(0);
    c[0] = v;
    return new Jet(c);
  }

  private lift(o: Jet | number): Jet {
    return typeof o === 'number' ? Jet.constant(o, this.order) : o;
  }

  add(o: Jet | number): Jet {
    const b = this.lift(o);
    return new Jet(this.c.map((v, k) => v + b.c[k]));
  }

  sub(o: Jet | number): Jet {
    const b = this.lift(o);
    return new Jet(this.c.map((v, k) => v - b.c[k]));
  }

  neg(): Jet {
    return new Jet(this.c.map((v) => -v));
  }

  mul(o: Jet | number): Jet {
    const b = this.lift(o);
    const n = this.order;
    const c = new Array<number>(n + 1).fill(0);
    for (let k = 0; k <= n; k++) for (let j = 0; j <= k; j++) c[k] += this.c[j] * b.c[k - j];
    return new Jet(c);
  }

  div(o: Jet | number): Jet {
    const b = this.lift(o);
    const n = this.order;
    const q = new Array<number>(n + 1).fill(0);
    for (let k = 0; k <= n; k++) {
      let s = this.c[k];
      for (let j = 1; j <= k; j++) s -= b.c[j] * q[k - j];
      q[k] = s / b.c[0];
    }
    return new Jet(q);
  }

  exp(): Jet {
    const n = this.order;
    const e = new Array<number>(n + 1).fill(0);
    e[0] = Math.exp(this.c[0]);
    for (let k = 1; k <= n; k++) {
      let s = 0;
      for (let j = 1; j <= k; j++) s += j * this.c[j] * e[k - j];
      e[k] = s / k;
    }
    return new Jet(e);
  }

  log(): Jet {
    const n = this.order;
    const l = new Array<number>(n + 1).fill(0);
    l[0] = Math.log(this.c[0]);
    for (let k = 1; k <= n; k++) {
      let s = 0;
      for (let j = 1; j < k; j++) s += j * l[j] * this.c[k - j];
      l[k] = (this.c[k] - s / k) / this.c[0];
    }
    return new Jet(l);
  }

  /** 同时算 sin、cos（两者的递推互相用到）。 */
  private sincos(): [Jet, Jet] {
    const n = this.order;
    const s = new Array<number>(n + 1).fill(0);
    const c = new Array<number>(n + 1).fill(0);
    s[0] = Math.sin(this.c[0]);
    c[0] = Math.cos(this.c[0]);
    for (let k = 1; k <= n; k++) {
      let ss = 0;
      let cc = 0;
      for (let j = 1; j <= k; j++) {
        ss += j * this.c[j] * c[k - j];
        cc += j * this.c[j] * s[k - j];
      }
      s[k] = ss / k;
      c[k] = -cc / k;
    }
    return [new Jet(s), new Jet(c)];
  }

  sin(): Jet {
    return this.sincos()[0];
  }

  cos(): Jet {
    return this.sincos()[1];
  }

  /** 实数次幂 a^r，要求 a 在展开点处为正（或 r 是整数）。 */
  pow(r: number): Jet {
    const n = this.order;
    const p = new Array<number>(n + 1).fill(0);
    p[0] = this.c[0] ** r;
    for (let k = 1; k <= n; k++) {
      let s = 0;
      for (let j = 1; j <= k; j++) s += (r * j - (k - j)) * this.c[j] * p[k - j];
      p[k] = s / (k * this.c[0]);
    }
    return new Jet(p);
  }

  /** 在展开点处的 k 阶导数。 */
  derivative(k: number): number {
    return this.c[k] * factorial(k);
  }
}

// 独立验算 math.logic-sets.natural-arithmetic 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.logic-sets.natural-arithmetic.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';

// ---- 一元记法的自然数：0 和后继，不借用 JS 的加法、乘法 ----

type Nat = { pred: Nat } | null; // null 是 0，{ pred: n } 是 S(n)

const ZERO: Nat = null;
function S(n: Nat): Nat {
  return { pred: n };
}
/** 把 JS 的非负整数写成一元记法。 */
function nat(k: number): Nat {
  let n: Nat = ZERO;
  for (let i = 0; i < k; i++) n = S(n);
  return n;
}
/** 数一元记法里有几层 S。 */
function size(n: Nat): number {
  let k = 0;
  for (let p = n; p !== null; p = p.pred) k++;
  return k;
}
/** 加法：照 m+0=m、m+S(n)=S(m+n)。 */
function add(m: Nat, n: Nat): Nat {
  return n === null ? m : S(add(m, n.pred));
}

// ---- p1：m∗0=m，m∗S(n)=S(S(m∗n)) ----

function ast(m: Nat, n: Nat): Nat {
  return n === null ? m : S(S(ast(m, n.pred)));
}

// ---- p2：把两条定义式当从左到右的改写规则，求范式；再用一个不满足归纳公理的模型核对判「否」的 ----

type Term = { k: 'var'; name: string } | { k: 'zero' } | { k: 'S'; a: Term } | { k: '+'; l: Term; r: Term };

const V = (name: string): Term => ({ k: 'var', name });
const Z: Term = { k: 'zero' };
const Sx = (a: Term): Term => ({ k: 'S', a });
const plus = (l: Term, r: Term): Term => ({ k: '+', l, r });
/** 数字 k 展开成 S(S(…S(0)…))。 */
function num(k: number): Term {
  let t: Term = Z;
  for (let i = 0; i < k; i++) t = Sx(t);
  return t;
}

/**
 * 改写到范式：x+0 → x，x+S(y) → S(x+y)，里面的先改。
 * 这两条规则左边线性、互不重叠（正交），所以合流；每用一次，加号右边的 S 或 0 少一层，所以一定停。
 * 于是「只用这两条等式（代入、等量代换有限次）能证出 s = t」当且仅当 s、t 的范式相同。
 */
function normal(t: Term): Term {
  if (t.k === 'S') return Sx(normal(t.a));
  if (t.k === '+') {
    const l = normal(t.l);
    const r = normal(t.r);
    if (r.k === 'zero') return l;
    if (r.k === 'S') return Sx(normal(plus(l, r.a)));
    return plus(l, r);
  }
  return t;
}
function show(t: Term): string {
  if (t.k === 'var') return t.name;
  if (t.k === 'zero') return '0';
  if (t.k === 'S') return `S(${show(t.a)})`;
  return `(${show(t.l)}+${show(t.r)})`;
}

/** p2 的模型：ℕ 外加两个点 a、b，S(a)=a，S(b)=b；x+n（n 是自然数）是对 x 取 n 次 S，x+a=b，x+b=a。 */
type El = number | 'a' | 'b';
const modelS = (x: El): El => (typeof x === 'number' ? x + 1 : x);
function modelAdd(x: El, y: El): El {
  if (y === 'a') return 'b';
  if (y === 'b') return 'a';
  let r = x;
  for (let i = 0; i < y; i++) r = modelS(r);
  return r;
}
function evalTerm(t: Term, env: Record<string, El>): El {
  if (t.k === 'var') return env[t.name];
  if (t.k === 'zero') return 0;
  if (t.k === 'S') return modelS(evalTerm(t.a, env));
  return modelAdd(evalTerm(t.l, env), evalTerm(t.r, env));
}

// ---- p3：m⋆0=m，m⋆(n+1)=(m⋆n)+m ----

function star(m: Nat, n: Nat): Nat {
  return n === null ? m : add(star(m, n.pred), m);
}

// ---- p4：{0,1,2,3} 上 S(0)=1、S(1)=2、S(2)=3、S(3)=2 ----

const P4_SET = [0, 1, 2, 3];
const P4_S = [1, 2, 3, 2];

export const verification: Verification = {
  lesson: 'math.logic-sets.natural-arithmetic',
  notes: {
    p1:
      '自然数用一元记法（0 和后继的嵌套）表示，照 m∗0=m、m∗S(n)=S(S(m∗n)) 逐步递归，数出后继的层数；' +
      '另核对 0..8 上都有 m∗n = m+2n（不可交换，3∗4 与 4∗3 不同）。',
    p2:
      '把 m+0=m、m+S(n)=S(m+n) 当从左到右的改写规则，两条规则正交、会停，能证出当且仅当两边范式相同；2、3、4 展开成 S(S(0)) 这样。' +
      '判「否」的再给模型核对：ℕ 外加两个点 a、b，S(a)=a、S(b)=b，x+n 是对 x 取 n 次 S，x+a=b，x+b=a；' +
      '两条定义式在样本（0..12、a、b）上全成立，B 在 m=0、n=a 处不成立，E 在 m=a 处不成立，A、C、D 处处成立。',
    p3:
      '照递归式用一元记法算 m⋆n，在 0..6 的全部三元组上逐条代入；另核对 m⋆n = m(n+1)（0..12）。' +
      'B 两边都是 m(n+1)(k+1)、E 两边都是 (m+n)(k+1)，对所有自然数成立；' +
      '反例：A 取 m=0、n=1（0 与 1）；C 取 (1,0,1)：(1⋆0)⋆1=2，1⋆(0⋆1)=1；D 取 (1,0,0)：1⋆0=1，1+1=2。',
    p4:
      '先照题意核对：枚举 {0,1,2,3} 的 16 个子集，含 0 且对 S 封闭的只有全集（公理 5 成立）；S(1)=S(3) 而 1≠3（公理 4 不成立）。' +
      '再对每个 m 枚举一行 (m+0, m+1, m+2, m+3) 的 4^4 种取法，留下满足 m+0=m、m+S(n)=S(m+n) 的，各恰有一种，运算由此唯一；' +
      '读出 3+3，再逐个三元组数 m≠n 且 m+k=n+k 的（有序，(m,n,k) 与 (n,m,k) 算两个）。',
  },
  compute() {
    // p1
    for (let m = 0; m <= 8; m++)
      for (let n = 0; n <= 8; n++)
        if (size(ast(nat(m), nat(n))) !== m + 2 * n) throw new Error(`p1 的 ${m}∗${n} 不是 m+2n`);
    const p1 = [size(ast(nat(3), nat(4))), size(ast(nat(4), nat(3)))];

    // p2
    const m = V('m');
    const n = V('n');
    const eqs: [Term, Term][] = [
      [plus(plus(m, n), num(2)), plus(m, plus(n, num(2)))], // A
      [plus(plus(m, num(2)), n), plus(m, plus(num(2), n))], // B
      [plus(Z, num(4)), num(4)], // C
      [plus(m, num(3)), Sx(Sx(Sx(m)))], // D
      [plus(num(3), m), Sx(Sx(Sx(m)))], // E
    ];
    const provable = eqs.map(([l, r]) => show(normal(l)) === show(normal(r)));
    // 模型满足两条定义式
    const sample: El[] = [...Array.from({ length: 13 }, (_, i) => i), 'a', 'b'];
    for (const x of sample) {
      if (modelAdd(x, 0) !== x) throw new Error('p2 的模型不满足 m+0=m');
      for (const y of sample)
        if (modelAdd(x, modelS(y)) !== modelS(modelAdd(x, y))) throw new Error('p2 的模型不满足 m+S(n)=S(m+n)');
    }
    const holdsInModel = eqs.map(([l, r]) =>
      sample.every((x) => sample.every((y) => evalTerm(l, { m: x, n: y }) === evalTerm(r, { m: x, n: y }))),
    );
    // 范式相同的在任何满足两条定义式的模型里都成立；范式不同的，这个模型给出反例
    provable.forEach((p, i) => {
      if (p !== holdsInModel[i]) throw new Error(`p2 选项 ${i + 1}：范式判断与模型不一致`);
    });
    if (evalTerm(eqs[1][0], { m: 0, n: 'a' }) === evalTerm(eqs[1][1], { m: 0, n: 'a' })) throw new Error('p2 B 的反例没起作用');
    if (evalTerm(eqs[4][0], { m: 'a', n: 0 }) === evalTerm(eqs[4][1], { m: 'a', n: 0 })) throw new Error('p2 E 的反例没起作用');
    const p2 = provable.flatMap((p, i) => (p ? [i + 1] : []));

    // p3
    for (let i = 0; i <= 12; i++)
      for (let j = 0; j <= 12; j++) if (size(star(nat(i), nat(j))) !== i * (j + 1)) throw new Error('p3 的 m⋆n 不是 m(n+1)');
    const sv = (x: number, y: number): number => size(star(nat(x), nat(y)));
    const av = (x: number, y: number): number => size(add(nat(x), nat(y)));
    const p3Tests: ((x: number, y: number, z: number) => boolean)[] = [
      (x, y) => sv(x, y) === sv(y, x), // A
      (x, y, z) => sv(sv(x, y), z) === sv(sv(x, z), y), // B
      (x, y, z) => sv(sv(x, y), z) === sv(x, sv(y, z)), // C
      (x, y, z) => sv(x, av(y, z)) === av(sv(x, y), sv(x, z)), // D
      (x, y, z) => sv(av(x, y), z) === av(sv(x, z), sv(y, z)), // E
    ];
    const p3Results = p3Tests.map((t) => {
      for (let x = 0; x <= 6; x++) for (let y = 0; y <= 6; y++) for (let z = 0; z <= 6; z++) if (!t(x, y, z)) return false;
      return true;
    });
    if (p3Tests[0](0, 1, 0) || p3Tests[2](1, 0, 1) || p3Tests[3](1, 0, 0)) throw new Error('p3 的反例没起作用');
    if (sv(sv(1, 0), 1) !== 2 || sv(1, sv(0, 1)) !== 1) throw new Error('p3 C 的反例的值和 notes 写的不一致');
    const p3 = p3Results.flatMap((t, i) => (t ? [i + 1] : []));

    // p4
    let inductive = 0;
    for (let mask = 0; mask < 16; mask++) {
      const has = (x: number): boolean => ((mask >> x) & 1) === 1;
      if (!has(0)) continue;
      if (!P4_SET.every((x) => !has(x) || has(P4_S[x]))) continue;
      inductive++;
      if (mask !== 15) throw new Error('p4 不满足公理 (5)');
    }
    if (inductive !== 1) throw new Error('p4 公理 (5) 的检查有误');
    if (!(P4_S[1] === P4_S[3])) throw new Error('p4 应不满足公理 (4)');
    const table: number[][] = P4_SET.map((x) => {
      const rows: number[][] = [];
      for (let code = 0; code < 256; code++) {
        const row = [code & 3, (code >> 2) & 3, (code >> 4) & 3, (code >> 6) & 3];
        if (row[0] !== x) continue;
        if (P4_SET.every((y) => row[P4_S[y]] === P4_S[row[y]])) rows.push(row);
      }
      if (rows.length !== 1) throw new Error(`p4 中 m=${x} 的一行有 ${rows.length} 种取法`);
      return rows[0];
    });
    let triples = 0;
    for (const x of P4_SET) for (const y of P4_SET) for (const z of P4_SET) if (x !== y && table[x][z] === table[y][z]) triples++;
    const p4 = [table[3][3], triples];

    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'choice', value: p3 },
      p4: { type: 'tuple', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}

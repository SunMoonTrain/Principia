// 独立验算 math.logic-sets.propositions 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.logic-sets.propositions.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';

/** n 个字母的全部真假组合，按讲解约定的行序：从全真排到全假，第一个字母变得最慢。 */
function rows(n: number): boolean[][] {
  const out: boolean[][] = [];
  for (let k = 0; k < 2 ** n; k++) {
    out.push(Array.from({ length: n }, (_, i) => ((k >> (n - 1 - i)) & 1) === 0));
  }
  return out;
}

/** 两个复合命题在真值表的每一行都同真假，就逻辑等价。 */
function equivalent(f: (v: boolean[]) => boolean, g: (v: boolean[]) => boolean, n: number): boolean {
  return rows(n).every((v) => f(v) === g(v));
}

// p1 用：一句话算不算命题。只有陈述句、里面没有没取定的字母、判断标准不因人而异、并且真值能算出来的才算。
// 「没取定的字母」「因人而异的标准」都用两种取法给出相反的真假来说明；能算出真值的用整数精确比较。
interface Sentence {
  label: string;
  declarative: boolean;
  /** 句中没取定的东西（变量或「很大」的标准）取两种值时的真假；两者不同，就判断不了。 */
  dependsOn?: [boolean, boolean];
  /** 句子说得清时的真值。 */
  truth?: () => boolean;
}

export const verification: Verification = {
  lesson: 'math.logic-sets.propositions',
  notes: {
    p1: '按讲解的定义（能判断真假的陈述句）逐条判断：A 里 x 没取定，x=1 时真、x=0 时假；C 是祈使句；D 的「很大」没有公认的标准，以 50 为界真、以 1000 为界假；B 用整数 2¹⁰=1024>1000 判为真；E 两边平方，(√2+√3)²=5+2√6，2√6<5 等价于 24<25，判为假（浮点也核对了 3.146<3.162）。B、E 真值确定，是命题。',
    p2: '按讲解的行序列出 P、Q、R 的 8 行，逐行算 ¬P∨(Q∧R)，数为真的行。',
    p3: '把 ¬(P∨¬Q) 和五个选项在 P、Q 的 4 行上逐行比较，每行都相同的算逻辑等价。',
    p4: '（第 1 轮修订后的新题，复核时重写）把「a、b 中至少有一个是正数」写成 a>0 或 b>0，否定是 ¬(a>0 ∨ b>0)；五种说法照字面写成 a、b 的判断式（A：a≤0 且 b≤0，B：a≤0 或 b≤0，C：并非 a、b 都是正数，D：a<0 且 b<0，E：a 不是正数且 b 不是正数），在 a、b ∈ {−2, −1, −0.5, −10⁻⁹, 0, 10⁻⁹, 0.5, 1, 2} 的 81 组取值（含 0，D 靠它判错）上和否定逐个比较，每组都同真假的才算。',
  },
  compute() {
    // p1
    const sentences: Sentence[] = [
      // A：x² − 1 = 0，x 没取定
      { label: 'A', declarative: true, dependsOn: [1 ** 2 - 1 === 0, 0 ** 2 - 1 === 0] },
      // B：2¹⁰ > 1000
      { label: 'B', declarative: true, truth: () => 2 ** 10 > 1000 },
      // C：祈使句
      { label: 'C', declarative: false },
      // D：「很大」的标准因人而异
      { label: 'D', declarative: true, dependsOn: [100 > 50, 100 > 1000] },
      // E：√2 + √3 > √10 ⟺ 5 + 2√6 > 10 ⟺ 2√6 > 5 ⟺ 24 > 25（两边都正，平方不改变大小）
      {
        label: 'E',
        declarative: true,
        truth: () => {
          const exact = 4 * 6 > 25;
          const float = Math.SQRT2 + Math.sqrt(3) > Math.sqrt(10);
          if (exact !== float) throw new Error('E 的精确比较和浮点比较不一致');
          return exact;
        },
      },
    ];
    const p1 = sentences.flatMap((s, i) => {
      if (!s.declarative) return [];
      if (s.dependsOn && s.dependsOn[0] !== s.dependsOn[1]) return [];
      if (!s.truth) return [];
      s.truth(); // 真值算得出来（B 真、E 假），都是命题
      return [i + 1];
    });

    // p2
    const p2 = rows(3).filter(([P, Q, R]) => !P || (Q && R)).length;

    // p3
    const target = ([P, Q]: boolean[]): boolean => !(P || !Q);
    const options3: ((v: boolean[]) => boolean)[] = [
      ([P, Q]) => !P && Q,
      ([P, Q]) => !P || Q,
      ([P, Q]) => Q && !(P && Q),
      ([P, Q]) => !(!Q || P),
      ([P, Q]) => P && !Q,
    ];
    const p3 = options3.flatMap((g, i) => (equivalent(target, g, 2) ? [i + 1] : []));

    // p4
    const vals = [-2, -1, -0.5, -1e-9, 0, 1e-9, 0.5, 1, 2];
    const pts = vals.flatMap((a) => vals.map((b) => [a, b] as const));
    const negation = (a: number, b: number): boolean => !(a > 0 || b > 0);
    const options4: ((a: number, b: number) => boolean)[] = [
      (a, b) => a <= 0 && b <= 0,
      (a, b) => a <= 0 || b <= 0,
      (a, b) => !(a > 0 && b > 0),
      (a, b) => a < 0 && b < 0,
      (a, b) => !(a > 0) && !(b > 0),
    ];
    const p4 = options4.flatMap((g, i) => (pts.every(([a, b]) => g(a, b) === negation(a, b)) ? [i + 1] : []));

    return {
      p1: { type: 'choice', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'choice', value: p3 },
      p4: { type: 'choice', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}

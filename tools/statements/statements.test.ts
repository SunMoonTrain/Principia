import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { sourceText } from '../../compiler/markdown.ts';
import { exportStatements } from './lib.ts';

// 用测试自己摆的一小份 content/，不用仓库里的真实内容：真实内容每一批都在改，措辞、有没有题都会变。

/** math.analysis.alpha 的 8 道题：四种作答方式，题干里有术语标记、小节链接和本领域的宏。 */
const ALPHA = String.raw`
- id: p1
  tier: easy
  statement: |
    设$A=\{x\in\R : x^2<3\}$，求$\sup A$。
  answer:
    type: number
    value: sqrt(3)
  hints:
    - |
      第一条提示：先求出这个区间的两个端点。
    - |
      第二条提示：右端点是上界，再看它还能不能更小。
    - |
      第三条提示：比右端点小的数都不是上界。
  solution: |
    完整解答：上确界不一定属于集合本身。
- id: p2
  tier: easy
  statement: |
    下面哪些集合有:term[最大元]{id="math.analysis.maximum"}（也就是上确界属于这个集合）？
  answer:
    type: choice
    multiple: true
    options:
      - |
        $[0,1]$
      - |
        $[0,1)$
    value: [1]
  hints:
    - |
      选择题提示一：先求每个集合的上确界。
    - |
      选择题提示二：两个集合的上确界都是同一个数。
    - |
      选择题提示三：只看上确界在不在集合里。
  solution: |
    选择题解答：闭区间含右端点，半开区间不含。
- id: p3
  tier: medium
  statement: |
    按$(\inf A,\sup A)$的顺序填写，记号见[第二节](lesson:math.analysis.beta)。
  answer:
    type: tuple
    value: [-1, 1]
  hints:
    - |
      有序数组提示一：把奇数项和偶数项分开看。
    - |
      有序数组提示二：两组各自单调。
    - |
      有序数组提示三：两组的极限互为相反数。
  solution: |
    有序数组解答：下确界和上确界都取不到。
- id: p4
  tier: medium
  statement: |
    求方程$x^2-3x+2=0$的全部实根。
  answer:
    type: set
    value: [1, 2]
  hints:
    - |
      无序集合提示一：试着因式分解。
    - |
      无序集合提示二：两个一次因式相乘。
    - |
      无序集合提示三：每个因式等于零各给一个根。
  solution: |
    无序集合解答：两个根都是整数。
- id: p5
  tier: hard
  statement: |
    证明$\sup(A+B)=\sup A+\sup B$。
  hints:
    - |
      难题提示一：先证右边是上界。
    - |
      难题提示二：再证比右边小的数都不是上界。
    - |
      难题提示三：把误差平均分给两边。
  reference: |
    难题参考解答：分两步，先上界、后最小。
- id: p6
  tier: hard
  statement: |
    证明有上界的非空整数集合有最大元。
  hints:
    - |
      第六题提示一：先取上确界。
    - |
      第六题提示二：上确界左边一个单位内有元素。
    - |
      第六题提示三：整数之间至少差一。
  reference: |
    第六题参考解答：上确界本身就是集合的元素。
- id: p7
  tier: thinking
  statement: |
    为什么有理数轴上有洞？
  hints:
    - |
      思考题提示一：找一个没有有理上确界的集合。
    - |
      思考题提示二：平方小于二的有理数。
    - |
      思考题提示三：它的上界可以一直往下压。
  reference: |
    思考题参考解答：根号二不是有理数。
- id: p8
  tier: thinking
  statement: |
    确界原理能不能当作实数的定义？
  hints:
    - |
      第八题提示一：想想戴德金分割。
    - |
      第八题提示二：公理化的看法。
    - |
      第八题提示三：两种看法等价。
  reference: |
    第八题参考解答：可以，作为公理。
`;

/** physics.mech.gamma：一道带单位的简单题、一道思考题。 */
const GAMMA = String.raw`
- id: p1
  tier: easy
  statement: |
    小球落地时的速度是多少？
  answer:
    type: number
    value: 6
    unit: |
      m/s
  hints:
    - |
      力学提示一：用能量守恒。
    - |
      力学提示二：势能全部变成动能。
    - |
      力学提示三：开方。
- id: p7
  tier: thinking
  statement: |
    能量守恒和时间平移对称有什么关系？
  hints:
    - |
      力学思考题提示一：想想诺特定理。
    - |
      力学思考题提示二：拉格朗日量不显含时间。
    - |
      力学思考题提示三：能量函数守恒。
  reference: |
    力学思考题参考解答：时间平移对称给出能量函数守恒。
`;

const ALPHA_FILE = 'content/math/analysis/alpha/problems.yaml';

const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

const lesson = (id: string, title: string): string => `---\nid: ${id}\ntitle: |\n  ${title}\nstatus: written\n---\n`;

/** 临时目录里的一小份 content/：math.analysis 下 alpha 有题、beta 还没有题；physics.mech 下 gamma 有题。 */
function miniContent(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'principia-statements-'));
  roots.push(root);
  const files: Record<string, string> = {
    'content/math/analysis/_domain.yaml': 'id: math.analysis\ntitle: |\n  数学分析\nmacros:\n  \\R: |\n    \\mathbb{R}\n',
    'content/math/analysis/alpha/lesson.md': lesson('math.analysis.alpha', '实数的完备性'),
    [ALPHA_FILE]: ALPHA,
    'content/math/analysis/beta/lesson.md': lesson('math.analysis.beta', '数列的极限'),
    'content/physics/mech/_domain.yaml': 'id: physics.mech\ntitle: |\n  力学\n',
    'content/physics/mech/gamma/lesson.md': lesson('physics.mech.gamma', '能量守恒'),
    'content/physics/mech/gamma/problems.yaml': GAMMA,
  };
  for (const [file, text] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), text);
  }
  return root;
}

describe('只导出题干', () => {
  it('题干、选项、作答方式和网页上一样；公式原样，术语标记和小节链接换成文字；带本领域的符号宏', () => {
    const { text, unmatched, failures } = exportStatements(miniContent(), { scopes: ['math.analysis.alpha'], tiers: [] });
    expect(unmatched).toEqual([]);
    expect(failures).toEqual([]);
    expect(text).toContain('# math.analysis　数学分析');
    expect(text).toContain('符号宏：\\R = \\mathbb{R}');
    expect(text).toContain('## math.analysis.alpha　实数的完备性');
    expect(text.match(/^### p\d　/gm)).toEqual(['### p1　', '### p2　', '### p3　', '### p4　', '### p5　', '### p6　', '### p7　', '### p8　']);
    expect(text).toContain('### p1　简单\n\n设$A=\\{x\\in\\R : x^2<3\\}$，求$\\sup A$。\n\n作答：填一个数');
    expect(text).toContain('下面哪些集合有最大元（也就是上确界属于这个集合）？');
    expect(text).not.toContain(':term');
    expect(text).toContain('记号见第二节。');
    expect(text).not.toContain('lesson:');
    expect(text).toContain('A. $[0,1]$\nB. $[0,1)$');
    expect(text).toContain('作答：多选');
    expect(text).toContain('作答：按顺序填 2 个数');
    expect(text).toContain('作答：填 2 个数，不分顺序');
    expect(text).toContain('### p5　难');
    expect(text).toContain('作答：写思路笔记，找 Claude 批改');
    // 别的领域、没点名的小节不导出
    expect(text).not.toContain('physics.mech');
  });

  it('带单位的题写出单位', () => {
    const { text } = exportStatements(miniContent(), { scopes: ['physics.mech.gamma'], tiers: ['easy'] });
    expect(text).toContain('作答：填一个数\n单位：m/s');
  });

  it('不带标准答案、提示、解答和参考解答', () => {
    const { text } = exportStatements(miniContent(), { scopes: [], tiers: [] });
    const problems = [ALPHA, GAMMA].flatMap((src) => parse(src) as Record<string, unknown>[]);
    const secrets = problems.flatMap((p) => [...((p.hints as string[]) ?? []), p.solution, p.reference].filter((s): s is string => typeof s === 'string'));
    // 10 道题各 3 条提示，加上 4 条解答、5 条参考解答
    expect(secrets).toHaveLength(39);
    for (const secret of secrets) {
      expect(text).not.toContain(sourceText(secret).trim());
      // 再拿每段的第一行比一次，免得整段比较时因为换行、空格不同而漏过
      expect(text).not.toContain(sourceText(secret.split('\n')[0]));
    }
    expect(text).not.toContain('sqrt(3)');
    expect(text).not.toMatch(/value|tolerance|hints|solution|reference/);
  });

  it('按范围和难度档筛选；对不上的范围单独列出', () => {
    const root = miniContent();
    const result = exportStatements(root, { scopes: ['math.analysis', 'math.nothing'], tiers: ['easy', 'medium'] });
    expect(result.unmatched).toEqual(['math.nothing']);
    expect(result.text.match(/^### p\d/gm)).toEqual(['### p1', '### p2', '### p3', '### p4']);
    // 按领域导出时，还没有题目的小节直接跳过；点名时说一声
    expect(result.text).not.toContain('math.analysis.beta');
    expect(exportStatements(root, { scopes: ['math.analysis.beta'], tiers: [] }).text).toContain('（这一节还没有 problems.yaml）');
    // 只要思考题：alpha 的 p7、p8 和 gamma 的 p7
    expect(exportStatements(root, { scopes: [], tiers: ['thinking'] }).text.match(/^## .+|^### p\d/gm)).toEqual([
      '## math.analysis.alpha　实数的完备性',
      '### p7',
      '### p8',
      '## physics.mech.gamma　能量守恒',
      '### p7',
    ]);
  });

  it('题目文件写坏了：别的小节照样导出，坏的单独报出来', () => {
    const root = miniContent();
    fs.writeFileSync(path.join(root, ALPHA_FILE), '- id: p1\n  statement: [\n');
    const result = exportStatements(root, { scopes: ['math', 'physics'], tiers: [] });
    expect(result.failures).toHaveLength(1);
    expect(result.failures[0]).toContain(path.normalize(ALPHA_FILE));
    expect(result.unmatched).toEqual([]);
    expect(result.text).toContain('## physics.mech.gamma　能量守恒');
  });
});

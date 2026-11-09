// 公式校验与编译：每个公式节点单独交给 KaTeX，带上领域宏；KaTeX 的警告也算失败。
// 校验通过的那一次输出就是页面上显示的 HTML，保证「校验的」和「显示的」是同一份。

import katex, { type ParseError } from 'katex';

export interface TexResult {
  html?: string;
  /** 出错的说明；为空表示通过。 */
  problems: string[];
  /** ParseError 给出的出错位置（公式原文里的字符下标）。 */
  position?: number;
}

const TRANSLATIONS: [RegExp, (m: RegExpExecArray) => string][] = [
  [/^Undefined control sequence: (\S+)/, (m) => `KaTeX 不认识命令 ${m[1]}（KaTeX 不支持，或领域宏里没有定义）`],
  [/^Unicode text character "(.+)" used in math mode/, (m) => `公式里直接写了文字「${m[1]}」，要放进 \\text{…}`],
  [/^Expected '(.+)', got '(.+)'/, (m) => `这里应该是「${m[1]}」，实际是「${m[2]}」`],
  [/^Unexpected end of input/, () => '公式没写完（括号或环境没有闭合）'],
  [/^No such environment: (\S+)/, (m) => `KaTeX 不支持环境 ${m[1]}`],
];

function translate(message: string): string {
  for (const [re, fn] of TRANSLATIONS) {
    const m = re.exec(message);
    if (m) return `${fn(m)}（${message}）`;
  }
  return message;
}

/**
 * 常见命令的名字。反斜杠被 sed、shell 或脚本吃掉、只剩字母时（\dot → dot），KaTeX 把它当成几个斜体字母照样渲染，
 * 构建发现不了。只收三个字母以上、不像变量乘积或下标缩写的（max、min、int、ext 这类会写成下标的不收）。
 */
const COMMAND_NAMES = new Set(
  (
    'frac dfrac tfrac sqrt dot ddot vec hat bar tilde overline underline mathbf mathbb mathcal mathsf boldsymbol ' +
    'text mathrm operatorname left right bigl bigr Bigl Bigr cdot cdots ldots vdots ddots times partial nabla infty ' +
    'approx equiv propto leq geq neq forall exists sum prod oint iint lim limsup liminf sup inf ' +
    'sin cos tan cot sec csc arcsin arccos arctan sinh cosh tanh exp log det dim ker ' +
    'alpha beta gamma delta epsilon varepsilon zeta eta theta vartheta kappa lambda sigma tau phi varphi chi psi omega rho ' +
    'Gamma Delta Theta Lambda Sigma Phi Psi Omega quad qquad begin langle rangle lfloor rfloor lceil rceil mapsto ' +
    'rightarrow Rightarrow leftarrow Leftrightarrow subset subseteq setminus emptyset varnothing circ perp hbar ell ' +
    'displaystyle binom'
  ).split(' '),
);

/** \n、\r 开头的命令，反斜杠连同 n、r 被吃成换行（回车读进来时也换成了换行）以后，留在行首的部分。 */
const AFTER_NEWLINE = new Map([
  ['abla', 'nabla'],
  ['eq', 'neq'],
  ['otin', 'notin'],
  ['ho', 'rho'],
  ['ight', 'right'],
  ['ightarrow', 'rightarrow'],
  ['angle', 'rangle'],
  ['floor', 'rfloor'],
  ['ceil', 'rceil'],
]);

/** 一个记号：带文字参数的命令（参数里的字母不查）、别的命令、或一串不带反斜杠的字母。 */
const TOKEN_RE = /\\(?:(?:text|textrm|textbf|textit|mathrm|mathit|mbox|operatorname\*?|begin|end)\s*\{[^{}]*\}|[A-Za-z]+|[\s\S])|([A-Za-z]+)/g;

/** 一串不带反斜杠的字母像不像吃掉了反斜杠的命令；像的话返回本来的写法（\frac、m\ddot、\nabla）。 */
function asCommand(run: string, atLineStart: boolean): string | undefined {
  if (COMMAND_NAMES.has(run)) return `\\${run}`;
  const afterNewline = atLineStart ? AFTER_NEWLINE.get(run) : undefined;
  if (afterNewline) return `\\${afterNewline}`;
  // 紧跟在变量后面的：m\ddot x 只剩 mddot x
  for (const k of [1, 2]) {
    const rest = run.slice(k);
    if (rest.length >= 3 && COMMAND_NAMES.has(rest)) return `${run.slice(0, k)}\\${rest}`;
  }
  return undefined;
}

export interface TexSuspect {
  /** 在公式原文里的字符下标。 */
  position: number;
  message: string;
}

/**
 * 公式能渲染、但多半是反斜杠被吃掉了的地方：不带反斜杠的命令名；行末只剩一个反斜杠（多行公式的换行 \\ 被吃成 \，
 * KaTeX 把它当空格，几行挤成一行）。
 */
export function suspectTex(tex: string): TexSuspect[] {
  const found: TexSuspect[] = [];
  for (const m of tex.matchAll(TOKEN_RE)) {
    const command = m[1] === undefined ? undefined : asCommand(m[1], tex[m.index - 1] === '\n');
    if (command) found.push({ position: m.index, message: `公式里的「${m[1]}」是不是 ${command}？命令前面的反斜杠多半被 sed、shell 或脚本吃掉了` });
  }
  for (const m of tex.matchAll(/\\+(?= *\n)/g)) {
    if (m[0].length % 2 === 1) {
      found.push({ position: m.index, message: '公式的这一行末尾只有一个反斜杠：多行公式的换行要写两个（\\\\），多半是被 shell 或脚本吃掉了一个' });
    }
  }
  return found.sort((a, b) => a.position - b.position);
}

export function compileTex(tex: string, displayMode: boolean, macros: Record<string, string>): TexResult {
  const problems: string[] = [];
  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => problems.push(translate(args.map(String).join(' ')));
  try {
    const html = katex.renderToString(tex, {
      displayMode,
      macros: { ...macros },
      throwOnError: true,
      trust: false,
      strict: (code: string, message: string) => {
        problems.push(translate(message) + `（${code}）`);
        return 'ignore';
      },
    });
    return { html, problems };
  } catch (error) {
    if (error instanceof katex.ParseError) {
      const e = error as ParseError;
      problems.push(translate(e.rawMessage || e.message));
      return { problems, position: e.position };
    }
    problems.push(String(error));
    return { problems };
  } finally {
    console.warn = originalWarn;
  }
}

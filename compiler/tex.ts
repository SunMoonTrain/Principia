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

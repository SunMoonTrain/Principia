// YAML 解析与「文字字段」检查，见 docs/plan.md「内容模型」的 YAML 写法。

import { isScalar, LineCounter, parseDocument, Scalar, type Document, type Node as YamlNode } from 'yaml';
import type { Diagnostics } from './diagnostics.ts';

export interface YamlFile {
  doc: Document;
  lines: LineCounter;
  /** 报错用的文件路径（相对仓库根目录）。 */
  file: string;
  /** YAML 第 1 行在原文件里是第 lineOffset + 1 行（文件头、动画参数块嵌在别的文件里）。 */
  lineOffset: number;
}

/** 文字字段解析出来后的值和位置。 */
export interface TextField {
  value: string;
  /** 字段在原文件里的起始行（块写法时是 `|` 所在行）。 */
  line: number;
  /** 字段内容第 1 行在原文件里的行号：块写法的内容从 `|` 的下一行开始。 */
  contentLine: number;
}

export function parseYaml(src: string, file: string, lineOffset: number, diags: Diagnostics): YamlFile | null {
  const lines = new LineCounter();
  const doc = parseDocument(src, { lineCounter: lines, prettyErrors: false, uniqueKeys: true });
  for (const e of [...doc.errors, ...doc.warnings]) {
    const line = (e.linePos?.[0]?.line ?? 1) + lineOffset;
    diags.error(file, line, `YAML 写法有误：${e.message.split('\n')[0]}`);
  }
  if (doc.errors.length || doc.warnings.length) return null;
  return { doc, lines, file, lineOffset };
}

function nodeLine(y: YamlFile, node: YamlNode | null | undefined): number | undefined {
  const start = node?.range?.[0];
  if (start === undefined) return undefined;
  return y.lines.linePos(start).line + y.lineOffset;
}

/** 某个路径在原文件里的行号；路径不存在时退到最近的上一级。 */
export function lineOf(y: YamlFile, path: readonly PropertyKey[]): number {
  for (let n = path.length; n >= 0; n--) {
    const node = n === 0 ? y.doc.contents : y.doc.getIn(path.slice(0, n) as unknown[], true);
    const line = nodeLine(y, node as YamlNode | undefined);
    if (line !== undefined) return line;
  }
  return 1 + y.lineOffset;
}

const CONTROL_RE = /[\u0000-\u0009\u000B-\u001F\u007F-\u009F]/;

const CONTROL_NAMES: Record<string, string> = {
  '\t': '制表符，多半是 \\t（如 \\theta、\\tau）被双引号、sed 或脚本当成了转义',
  '\b': '退格符，多半是 \\b（如 \\beta）被双引号、sed 或脚本当成了转义',
  '\f': '换页符，多半是 \\f（如 \\frac）被双引号、sed 或脚本当成了转义',
  '\r': '回车符，多半是 \\r（如 \\rho）被双引号、sed 或脚本当成了转义',
  '\v': '垂直制表符，多半是 \\v（如 \\varepsilon）被双引号、sed 或脚本当成了转义',
  '\u0007': '响铃符，多半是 \\a（如 \\alpha）被双引号、sed 或脚本当成了转义',
  '\u001b': '转义符，多半是 \\e（如 \\epsilon）被双引号当成了转义',
};

/** 换行以外的第一个控制字符，写成「U+0009（制表符，多半是……）」；没有时返回 null。 */
export function controlChar(text: string): string | null {
  const control = CONTROL_RE.exec(text);
  if (!control) return null;
  const ch = control[0];
  const code = `U+${ch.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')}`;
  return `${code}（${CONTROL_NAMES[ch] ?? '换行以外的控制字符'}）`;
}

/**
 * 取一个文字字段并检查写法：必须用块写法 `|`；解析出来后不能有换行以外的控制字符。
 * 字段不存在或不是字符串时返回 null（类型错误由 zod 报）。
 */
export function textAt(y: YamlFile, path: readonly PropertyKey[], diags: Diagnostics, name = path.join('.')): TextField | null {
  const node = y.doc.getIn(path as unknown[], true);
  if (!isScalar(node) || typeof node.value !== 'string') return null;
  const line = nodeLine(y, node) ?? lineOf(y, path);
  const block = node.type === Scalar.BLOCK_LITERAL;
  if (!block) {
    diags.error(
      y.file,
      line,
      `文字字段 ${name} 要用块写法 |：双引号会把 \\n、\\t 这类反斜杠当成转义吃掉，不加引号时「冒号+空格」和「空格+#」会出错`,
    );
  }
  const control = controlChar(node.value);
  if (control) diags.error(y.file, line, `文字字段 ${name} 里出现了控制字符 ${control}`);
  return { value: node.value, line, contentLine: block ? line + 1 : line };
}

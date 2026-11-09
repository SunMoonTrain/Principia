// _domain.yaml：领域信息、证明深度、符号约定（KaTeX 宏）、术语表，见 docs/plan.md「内容模型」。

import type { ProofPolicy, Rich } from '../shared/content-types.ts';
import { ANCHOR_RE, LESSON_ID_RE, TERM_ID_RE } from '../shared/ids.ts';
import type { Diagnostics } from './diagnostics.ts';
import { readText } from './fsutil.ts';
import { plainText, renderField, type Refs } from './markdown.ts';
import { DomainFile, reportIssues } from './schema.ts';
import { compileTex } from './tex.ts';
import { countChars } from './text-rules.ts';
import { lineOf, parseYaml, textAt } from './yaml-text.ts';

export const BRIEF_MAX = 60;

export interface GlossaryInfo {
  id: string;
  domain: string;
  zh: Rich;
  en: Rich;
  abbr: Rich | null;
  brief: Rich;
  definedIn: string;
  anchor: string;
  file: string;
  line: number;
}

export interface DomainInfo {
  id: string;
  subject: string;
  file: string;
  title: Rich;
  titleText: string;
  proofPolicy: ProofPolicy;
  macros: Record<string, string>;
  /** 每个宏在 _domain.yaml 里的行号，跨领域核对宏定义时报错用。 */
  macroLines: Record<string, number>;
  glossary: GlossaryInfo[];
}

const EMPTY: Rich = { type: 'root', children: [] };

export function processDomain(file: string, reportFile: string, expectedId: string, diags: Diagnostics): DomainInfo | null {
  const y = parseYaml(readText(file), reportFile, 0, diags);
  if (!y) return null;
  const raw = y.doc.toJS() as Record<string, unknown> | null;

  const title = textAt(y, ['title'], diags);
  const macroFields = raw && typeof raw.macros === 'object' && raw.macros ? Object.keys(raw.macros) : [];
  for (const key of macroFields) textAt(y, ['macros', key], diags);
  const glossaryRaw = Array.isArray(raw?.glossary) ? (raw.glossary as unknown[]) : [];
  const glossaryFields = glossaryRaw.map((_, i) => ({
    zh: textAt(y, ['glossary', i, 'zh'], diags),
    en: textAt(y, ['glossary', i, 'en'], diags),
    abbr: textAt(y, ['glossary', i, 'abbr'], diags),
    brief: textAt(y, ['glossary', i, 'brief'], diags),
  }));

  const parsed = DomainFile.safeParse(raw);
  if (!parsed.success) {
    reportIssues(y, parsed.error.issues, diags);
    return null;
  }
  const d = parsed.data;
  if (d.id !== expectedId) {
    diags.error(reportFile, lineOf(y, ['id']), `领域 id「${d.id}」和目录推出的「${expectedId}」不一致`);
  }

  // 符号约定：宏名是反斜杠加字母；定义本身也要能被 KaTeX 渲染（用 {x} 填参数试一次）。
  const macros: Record<string, string> = {};
  const macroLines: Record<string, number> = {};
  for (const [name, value] of Object.entries(d.macros ?? {})) {
    macroLines[name] = lineOf(y, ['macros', name]);
    if (!/^\\[A-Za-z]+$/.test(name)) diags.error(reportFile, macroLines[name], `宏名「${name}」要写成反斜杠加英文字母，如 \\R`);
    macros[name] = value.trim();
  }
  for (const [name, value] of Object.entries(macros)) {
    const argc = Math.max(0, ...[...value.matchAll(/#([1-9])/g)].map((m) => Number(m[1])));
    const sample = name + '{x}'.repeat(argc);
    const result = compileTex(sample, false, macros);
    if (result.problems.length) {
      diags.error(reportFile, lineOf(y, ['macros', name]), `宏 ${name} 的定义无法渲染：${result.problems.join('；')}`, `定义：${value}`);
    }
  }

  const refs: Refs = { lessons: [], terms: [] };
  const ctx = { file: reportFile, macros, diags, refs };
  const seen = new Set<string>();
  const glossary: GlossaryInfo[] = [];
  (d.glossary ?? []).forEach((entry, i) => {
    const line = lineOf(y, ['glossary', i, 'id']);
    if (!TERM_ID_RE.test(entry.id) || !entry.id.startsWith(`${d.id}.`)) {
      diags.error(reportFile, line, `术语 id「${entry.id}」要写成「${d.id}.术语名」（小写英文字母、数字和连字符）`);
    }
    if (seen.has(entry.id)) diags.error(reportFile, line, `术语 id「${entry.id}」重复了`);
    seen.add(entry.id);
    if (!LESSON_ID_RE.test(entry.definedIn)) {
      diags.error(reportFile, lineOf(y, ['glossary', i, 'definedIn']), `definedIn「${entry.definedIn}」不是小节 id`);
    }
    if (!ANCHOR_RE.test(entry.anchor)) {
      diags.error(reportFile, lineOf(y, ['glossary', i, 'anchor']), `锚点「${entry.anchor}」只能用小写英文字母、数字和连字符`);
    }
    const f = glossaryFields[i];
    const brief = f.brief;
    if (brief) {
      const n = countChars(brief.value);
      if (n > BRIEF_MAX) diags.error(reportFile, brief.line, `术语简介不超过 ${BRIEF_MAX} 字，这里是 ${n} 字`, brief.value.trim());
    }
    glossary.push({
      id: entry.id,
      domain: d.id,
      zh: f.zh ? renderField(f.zh, ctx, 'plain') : EMPTY,
      en: f.en ? renderField(f.en, ctx, 'plain') : EMPTY,
      abbr: f.abbr ? renderField(f.abbr, ctx, 'plain') : null,
      brief: brief ? renderField(brief, ctx, 'plain') : EMPTY,
      definedIn: entry.definedIn,
      anchor: entry.anchor,
      file: reportFile,
      line,
    });
  });

  return {
    id: d.id,
    subject: d.id.split('.')[0],
    file: reportFile,
    title: title ? renderField(title, ctx, 'plain') : EMPTY,
    titleText: plainText(d.title),
    proofPolicy: d.proofPolicy,
    macros,
    macroLines,
    glossary,
  };
}

/**
 * 同一个宏名在各领域的定义要一样（plan.md「内容模型」的符号宏约定：同名的宏在哪个领域都是同一个意思，别的领域照抄定义）。
 * 比较时空白不算（首尾去掉，连续的空白当一个）。以用得最多的定义为准，一样多时以领域 id 排在前面的为准；
 * 和它不一样的领域逐个报错，指到那个领域里这个宏的那一行。
 */
export function checkMacroConsistency(domains: DomainInfo[], diags: Diagnostics): void {
  const normalize = (s: string): string => s.trim().replace(/\s+/g, ' ');
  const owners = new Map<string, DomainInfo[]>();
  for (const d of [...domains].sort((a, b) => a.id.localeCompare(b.id))) {
    for (const name of Object.keys(d.macros)) owners.set(name, [...(owners.get(name) ?? []), d]);
  }
  for (const [name, list] of owners) {
    const counts = new Map<string, number>();
    for (const d of list) {
      const value = normalize(d.macros[name]);
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    if (counts.size < 2) continue;
    let standard = normalize(list[0].macros[name]);
    for (const [value, n] of counts) if (n > counts.get(standard)!) standard = value;
    const keeper = list.find((d) => normalize(d.macros[name]) === standard)!;
    const n = counts.get(standard)!;
    // 中文和英文之间留空格：「math.x 里是」「math.x 等 3 个领域里是」
    const where = n > 1 ? `${keeper.id} 等 ${n} 个领域` : `${keeper.id} `;
    for (const d of list) {
      const value = normalize(d.macros[name]);
      if (value === standard) continue;
      diags.error(d.file, d.macroLines[name], `宏 ${name} 在各领域的定义要一样：这里是「${value}」，${where}里是「${standard}」`);
    }
  }
}

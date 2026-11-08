// 只导出题干：审内容 agent 独立验算简单题、中等题时用，见 docs/plan.md「内容生产与审查流水线」。
// 导出的和网页上做题时看到的一样：题干、选项、作答方式、单位；没有标准答案、提示、解答和参考解答。
// 直接读 content/ 下的源文件，不经过构建（构建报错时也能用）；公式保留 $…$，术语标记和小节链接换成文字。

import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { sourceText } from '../../compiler/markdown.ts';
import type { Tier } from '../../shared/content-types.ts';
import { answerKind, OPTION_LABELS, TIER_LABELS } from '../../shared/problem-text.ts';

export const TIERS: Tier[] = ['easy', 'medium', 'hard', 'thinking'];

export interface ExportOptions {
  /** 范围：学科（math）、领域（math.analysis）或小节（math.analysis.completeness）的 id；空表示全部。 */
  scopes: string[];
  /** 只导出这些难度档；空表示全部。 */
  tiers: Tier[];
}

export interface ExportResult {
  text: string;
  /** 给了、但一个小节也对不上的范围（多半是 id 写错了）。 */
  unmatched: string[];
  /** 读不了的文件和原因；别的小节照样导出。 */
  failures: string[];
}

interface LessonDir {
  id: string;
  dir: string;
}

interface DomainDir {
  id: string;
  dir: string;
  lessons: LessonDir[];
}

function subdirs(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

/** content/<学科>/<领域>/<小节>：有 _domain.yaml 的才算领域，有 lesson.md 的才算小节（和编译器一样）。 */
function listDomains(root: string): DomainDir[] {
  const content = path.join(root, 'content');
  const domains: DomainDir[] = [];
  for (const subject of subdirs(content)) {
    for (const domain of subdirs(path.join(content, subject))) {
      const dir = path.join(content, subject, domain);
      if (!fs.existsSync(path.join(dir, '_domain.yaml'))) continue;
      const lessons = subdirs(dir)
        .filter((name) => fs.existsSync(path.join(dir, name, 'lesson.md')))
        .map((name) => ({ id: `${subject}.${domain}.${name}`, dir: path.join(dir, name) }));
      domains.push({ id: `${subject}.${domain}`, dir, lessons });
    }
  }
  return domains;
}

const inScope = (id: string, scope: string): boolean => id === scope || id.startsWith(`${scope}.`);

const text = (value: unknown): string => (typeof value === 'string' ? sourceText(value) : '');

/** 多行的文字放在列表项后面时，后面几行缩进对齐。 */
const indent = (s: string, by: string): string => s.replace(/\n/g, `\n${by}`);

function domainHeader(domain: DomainDir, root: string, failures: string[]): string[] {
  const file = path.join(domain.dir, '_domain.yaml');
  try {
    const data = (parse(fs.readFileSync(file, 'utf8')) ?? {}) as { title?: unknown; macros?: Record<string, unknown> };
    const lines = [`# ${domain.id}　${text(data.title)}`.trimEnd(), ''];
    const macros = Object.entries(data.macros ?? {}).map(([name, body]) => `${name} = ${String(body).trim()}`);
    if (macros.length) lines.push(`符号宏：${macros.join('；')}`, '');
    return lines;
  } catch (e) {
    failures.push(`${path.relative(root, file)}：${(e as Error).message.split('\n')[0]}`);
    return [`# ${domain.id}`, ''];
  }
}

function lessonTitle(dir: string): string {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(fs.readFileSync(path.join(dir, 'lesson.md'), 'utf8'));
  if (!match) return '';
  try {
    return text((parse(match[1]) as { title?: unknown } | null)?.title);
  } catch {
    return '';
  }
}

interface ProblemSource {
  id?: unknown;
  tier?: unknown;
  statement?: unknown;
  answer?: { type?: unknown; value?: unknown; multiple?: unknown; options?: unknown; unit?: unknown } | null;
}

/** 一道题：只取题干、选项、作答方式、单位，别的字段一律不碰。 */
function problemLines(p: ProblemSource): string[] {
  const tier = TIERS.includes(p.tier as Tier) ? TIER_LABELS[p.tier as Tier] : String(p.tier);
  const lines = [`### ${String(p.id)}　${tier}`, '', text(p.statement) || '（没有题干）', ''];
  const a = p.answer;
  if (a && a.type === 'choice' && Array.isArray(a.options)) {
    a.options.forEach((option, i) => lines.push(`${OPTION_LABELS[i] ?? '?'}. ${indent(text(option), '   ')}`));
    lines.push('');
  }
  const kind = a && ['number', 'tuple', 'set', 'choice'].includes(a.type as string)
    ? answerKind({ type: a.type as 'number' | 'tuple' | 'set' | 'choice', value: a.value, multiple: a.multiple === true })
    : answerKind(null);
  lines.push(`作答：${kind}`);
  if (a && typeof a.unit === 'string') lines.push(`单位：${text(a.unit)}`);
  lines.push('');
  return lines;
}

export function exportStatements(root: string, options: ExportOptions): ExportResult {
  const { scopes, tiers } = options;
  const failures: string[] = [];
  const matched = new Set<string>();
  const out: string[] = ['（只含题干、选项、作答方式和单位，和网页上做题时看到的一样；没有标准答案、提示、解答和参考解答。）', ''];

  for (const domain of listDomains(root)) {
    const domainLines: string[] = [];
    for (const lesson of domain.lessons) {
      const hits = scopes.filter((s) => inScope(lesson.id, s));
      if (scopes.length && !hits.length) continue;
      hits.forEach((s) => matched.add(s));
      const header = [`## ${lesson.id}　${lessonTitle(lesson.dir)}`.trimEnd(), ''];
      const file = path.join(lesson.dir, 'problems.yaml');
      if (!fs.existsSync(file)) {
        // 明确点名的小节还没有题目时说一声；按领域、学科导出时，没题的（outline）小节直接跳过
        if (hits.includes(lesson.id)) domainLines.push(...header, '（这一节还没有 problems.yaml）', '');
        continue;
      }
      let problems: ProblemSource[];
      try {
        const data: unknown = parse(fs.readFileSync(file, 'utf8'));
        if (!Array.isArray(data)) throw new Error('应该是题目的列表');
        problems = data as ProblemSource[];
      } catch (e) {
        failures.push(`${path.relative(root, file)}：${(e as Error).message.split('\n')[0]}（先跑 npm run content 看报错）`);
        continue;
      }
      const chosen = problems.filter((p) => !tiers.length || tiers.includes(p.tier as Tier));
      if (!chosen.length) continue;
      domainLines.push(...header, ...chosen.flatMap(problemLines));
    }
    if (domainLines.length) out.push(...domainHeader(domain, root, failures), ...domainLines);
  }

  return { text: `${out.join('\n').trimEnd()}\n`, unmatched: scopes.filter((s) => !matched.has(s)), failures };
}

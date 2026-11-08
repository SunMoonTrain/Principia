// 内容编译器：读 content/ → 校验 → 全局图谱 + 每领域一个内容包 + 校验报告。
// 见 docs/plan.md「架构与技术栈」：内容在构建时校验完、编译好，网站只读。

import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {
  CONTENT_FORMAT,
  type BuildReport,
  type DomainPack,
  type Graph,
  type GraphDomain,
  type GraphLesson,
  type TermEntry,
} from '../shared/content-types.ts';
import { SEGMENT_RE } from '../shared/ids.ts';
import { Diagnostics } from './diagnostics.ts';
import { processDomain, type DomainInfo, type GlossaryInfo } from './domain.ts';
import { relPosix } from './fsutil.ts';
import { computeLevels, findCycles, redundantPrereqs, type PrereqMap } from './graph.ts';
import { layoutMap } from './layout.ts';
import { processLesson, type LessonInfo } from './lesson.ts';

export interface CompileResult {
  report: BuildReport;
  /** 只有通过时才有：要写进 generated/ 的文件（相对路径 → 内容）。 */
  files: Map<string, string> | null;
  graph: Graph | null;
  packs: Map<string, DomainPack> | null;
}

/** content/ 下不算内容的文件：网站写的「内容有误」和写内容 agent 的处理记录。改了它们不用重编。 */
export const NOT_CONTENT = new Set(['issues.yaml', 'issues-resolved.yaml']);

function dirs(dir: string): string[] {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
    .map((e) => e.name)
    .sort();
}

function hash(text: string): string {
  return createHash('sha1').update(text).digest('hex').slice(0, 10);
}

export function compileContent(root: string): CompileResult {
  const contentDir = path.join(root, 'content');
  const diags = new Diagnostics();
  const rel = (file: string): string => relPosix(root, file);
  const domains = new Map<string, DomainInfo>();
  const lessons = new Map<string, LessonInfo>();

  if (!fs.existsSync(contentDir)) {
    diags.error('content', undefined, '找不到 content/ 目录');
  } else {
    for (const subject of dirs(contentDir)) {
      const subjectDir = path.join(contentDir, subject);
      if (!SEGMENT_RE.test(subject)) {
        diags.error(rel(subjectDir), undefined, `学科目录名「${subject}」只能用小写字母、数字和连字符，且以字母开头`);
        continue;
      }
      for (const domainName of dirs(subjectDir)) {
        const domainDir = path.join(subjectDir, domainName);
        const domainId = `${subject}.${domainName}`;
        if (!SEGMENT_RE.test(domainName)) {
          diags.error(rel(domainDir), undefined, `领域目录名「${domainName}」只能用小写字母、数字和连字符，且以字母开头`);
          continue;
        }
        const domainFile = path.join(domainDir, '_domain.yaml');
        if (!fs.existsSync(domainFile)) {
          diags.error(rel(domainDir), undefined, '领域目录里缺 _domain.yaml');
          continue;
        }
        const domain = processDomain(domainFile, rel(domainFile), domainId, diags);
        if (!domain) continue;
        domains.set(domainId, domain);
        for (const lessonName of dirs(domainDir)) {
          const lessonDir = path.join(domainDir, lessonName);
          const lessonFile = path.join(lessonDir, 'lesson.md');
          if (!SEGMENT_RE.test(lessonName)) {
            diags.error(rel(lessonDir), undefined, `小节目录名「${lessonName}」只能用小写字母、数字和连字符，且以字母开头`);
            continue;
          }
          if (!fs.existsSync(lessonFile)) {
            diags.warn(rel(lessonDir), undefined, '目录里没有 lesson.md，跳过');
            continue;
          }
          // id 由路径推出：先转成正斜杠的相对路径，再和文件头的 id 比对（见「Windows 上额外的坑」）。
          const [s, d, l] = relPosix(contentDir, lessonDir).split('/');
          const lesson = processLesson(lessonFile, rel(lessonFile), `${s}.${d}.${l}`, domain, diags);
          if (lesson) lessons.set(lesson.id, lesson);
        }
      }
    }
  }

  // ---- 前置关系：引用的 id 必须存在、不能有环；层级 = 最长前置链长度 ----
  const prereqs: PrereqMap = new Map();
  for (const lesson of lessons.values()) {
    const existing: string[] = [];
    lesson.prerequisites.forEach((p, i) => {
      if (lessons.has(p)) existing.push(p);
      else diags.error(lesson.file, lesson.prerequisiteLines[i], `前置「${p}」不存在`);
    });
    prereqs.set(lesson.id, existing);
  }
  const cycles = findCycles(prereqs);
  for (const cycle of cycles) {
    const first = lessons.get(cycle[0])!;
    const members = [...new Set(cycle)];
    diags.error(
      first.file,
      first.prerequisitesLine,
      `前置关系出现环：${cycle.join(' → ')}（箭头从前置指向后续）`,
      `环上的小节：\n${members.map((id) => `${id}（${lessons.get(id)!.file}）`).join('\n')}`,
    );
  }
  const levels = cycles.length ? new Map<string, number>() : computeLevels(prereqs);
  if (!cycles.length) {
    for (const r of redundantPrereqs(prereqs)) {
      const lesson = lessons.get(r.lesson)!;
      diags.warn(
        lesson.file,
        lesson.prerequisiteLines[lesson.prerequisites.indexOf(r.redundant)],
        `前置「${r.redundant}」可以由「${r.via}」间接推出，按规则只列最少的直接前置`,
      );
    }
  }

  // ---- 术语与小节链接 ----
  const terms = new Map<string, GlossaryInfo>();
  for (const domain of domains.values()) for (const t of domain.glossary) terms.set(t.id, t);
  for (const lesson of lessons.values()) {
    for (const ref of lesson.refs.terms) {
      if (!terms.has(ref.id)) diags.error(ref.file, ref.line, `术语表里没有 id 为「${ref.id}」的术语`);
    }
    for (const ref of lesson.refs.lessons) {
      const target = lessons.get(ref.id);
      if (!target) diags.error(ref.file, ref.line, `链接的小节「${ref.id}」不存在`);
      else if (ref.anchor && target.status !== 'outline' && !target.anchors.has(ref.anchor)) {
        diags.error(ref.file, ref.line, `小节「${ref.id}」里没有锚点「${ref.anchor}」`);
      }
    }
  }
  for (const term of terms.values()) {
    const target = lessons.get(term.definedIn);
    if (!target) {
      diags.error(term.file, term.line, `术语「${term.id}」的定义小节「${term.definedIn}」不存在`);
    } else if (target.status === 'outline') {
      diags.warn(term.file, term.line, `术语「${term.id}」的定义小节「${term.definedIn}」还是 outline，暂不检查锚点「${term.anchor}」`);
    } else if (!target.anchors.has(term.anchor)) {
      diags.error(term.file, term.line, `术语「${term.id}」的定义锚点「${term.anchor}」在小节「${term.definedIn}」里不存在`);
    }
  }

  const report: BuildReport = {
    ok: diags.errors.length === 0,
    finishedAt: new Date().toISOString(),
    errors: diags.errors,
    warnings: diags.warnings,
  };
  if (!report.ok) return { report, files: null, graph: null, packs: null };

  // ---- 星图：展开图坐标、领域扇区和颜色、只画直接前置的连线 ----
  const layout = layoutMap({
    domains: [...domains.values()].map((d) => ({ id: d.id, subject: d.subject })),
    lessons: [...lessons.values()].map((l) => ({ id: l.id, domain: l.domain, level: levels.get(l.id) ?? 0 })),
    prereqs,
  });
  const redundant = new Set(redundantPrereqs(prereqs).map((r) => `${r.redundant}>${r.lesson}`));
  const edges: [string, string][] = [...prereqs]
    .flatMap(([lesson, ps]) => ps.filter((p) => !redundant.has(`${p}>${lesson}`)).map((p): [string, string] => [p, lesson]))
    .sort((a, b) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]));

  // ---- 输出：全局图谱 + 每领域一个内容包 ----
  const files = new Map<string, string>();
  const packs = new Map<string, DomainPack>();
  const graphDomains: GraphDomain[] = [];
  const toEntry = (t: GlossaryInfo): TermEntry => ({
    id: t.id,
    domain: t.domain,
    zh: t.zh,
    en: t.en,
    abbr: t.abbr,
    brief: t.brief,
    definedIn: t.definedIn,
    anchor: t.anchor,
  });
  for (const domain of [...domains.values()].sort((a, b) => a.id.localeCompare(b.id))) {
    const own = [...lessons.values()].filter((l) => l.domain === domain.id);
    const glossary: Record<string, TermEntry> = {};
    for (const t of domain.glossary) glossary[t.id] = toEntry(t);
    for (const l of own) for (const ref of l.refs.terms) glossary[ref.id] ??= toEntry(terms.get(ref.id)!);
    const pack: DomainPack = {
      format: CONTENT_FORMAT,
      domain: domain.id,
      macros: domain.macros,
      glossary,
      lessons: Object.fromEntries(own.filter((l) => l.content).map((l) => [l.id, l.content!])),
    };
    const text = JSON.stringify(pack);
    const name = `domains/${domain.id}.json`;
    files.set(name, text);
    packs.set(domain.id, pack);
    graphDomains.push({
      id: domain.id,
      subject: domain.subject,
      title: domain.title,
      titleText: domain.titleText,
      proofPolicy: domain.proofPolicy,
      pack: `${name}?v=${hash(text)}`,
      lessons: own.map((l) => l.id),
      sector: [layout.domains.get(domain.id)!.start, layout.domains.get(domain.id)!.end],
      hue: layout.domains.get(domain.id)!.hue,
    });
  }
  const graphLessons: GraphLesson[] = [...lessons.values()]
    .map((l) => ({
      id: l.id,
      subject: l.subject,
      domain: l.domain,
      title: l.title,
      titleText: l.titleText,
      goal: l.goal,
      summary: l.summary,
      status: l.status,
      minutes: l.minutes,
      prerequisites: l.prerequisites,
      level: levels.get(l.id) ?? 0,
      x2d: layout.x.get(l.id) ?? 0,
      angle: layout.polar.get(l.id)?.angle ?? 0,
      radius: layout.polar.get(l.id)?.radius ?? 0,
    }))
    .sort((a, b) => a.domain.localeCompare(b.domain) || a.level - b.level || a.id.localeCompare(b.id));
  const graph: Graph = { format: CONTENT_FORMAT, subjects: layout.subjects, domains: graphDomains, lessons: graphLessons, edges };
  files.set('graph.json', JSON.stringify(graph));
  return { report, files, graph, packs };
}

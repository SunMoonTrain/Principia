// lesson.md：文件头 + 固定结构的正文，见 docs/plan.md「内容模型」「每节固定结构与写作规范」。

import fs from 'node:fs';
import path from 'node:path';
import { toString } from 'mdast-util-to-string';
import type { LessonContent, LessonSections, LessonStatus, ProofPolicy, Rich } from '../shared/content-types.ts';
import { LESSON_ID_RE } from '../shared/ids.ts';
import type { AnimUse } from './anim.ts';
import type { Diagnostics } from './diagnostics.ts';
import type { DomainInfo } from './domain.ts';
import { readText } from './fsutil.ts';
import { parseLessonMarkdown, plainText, renderField, toRich, transformBody, type MdContext, type MdNode, type Refs } from './markdown.ts';
import { processProblems } from './problems.ts';
import { LessonFrontmatter, reportIssues } from './schema.ts';
import { countChars } from './text-rules.ts';
import { controlChar, lineOf, parseYaml, textAt } from './yaml-text.ts';

export const SUMMARY_MAX = 30;

/** lesson.md 里固定文字的二级标题，按顺序；常见误区可选。 */
const SECTIONS: { title: string; key: keyof LessonSections; required: boolean }[] = [
  { title: '这一节要回答的问题', key: 'question', required: true },
  { title: '讲解', key: 'explanation', required: true },
  { title: '几何图像', key: 'picture', required: true },
  { title: '例题', key: 'examples', required: true },
  { title: '常见误区', key: 'misconceptions', required: false },
];

export interface LessonInfo {
  id: string;
  subject: string;
  domain: string;
  file: string;
  status: LessonStatus;
  title: Rich;
  titleText: string;
  goal: Rich;
  summary: Rich | null;
  minutes: number | null;
  prerequisites: string[];
  /** 每个前置在 lesson.md 里的行号（报错用）。 */
  prerequisiteLines: number[];
  prerequisitesLine: number;
  proofPolicy: ProofPolicy;
  anchors: Map<string, number>;
  refs: Refs;
  /** written、reviewed 且没有错误时才有。 */
  content: LessonContent | null;
}

const EMPTY: Rich = { type: 'root', children: [] };

function contains(nodes: MdNode[], test: (n: MdNode) => boolean): boolean {
  return nodes.some((n) => test(n) || contains(n.children ?? [], test));
}

export function processLesson(
  file: string,
  reportFile: string,
  expectedId: string,
  domain: DomainInfo,
  diags: Diagnostics,
): LessonInfo | null {
  const source = readText(file);
  const root = parseLessonMarkdown(source);
  const front = root.children?.[0];
  if (!front || front.type !== 'yaml' || front.position?.start.line !== 1) {
    diags.error(reportFile, 1, 'lesson.md 要以 --- 包起来的文件头开始');
    return null;
  }
  const y = parseYaml(front.value ?? '', reportFile, front.position.start.line, diags);
  if (!y) return null;
  const raw = y.doc.toJS() as unknown;
  const titleField = textAt(y, ['title'], diags);
  const goalField = textAt(y, ['goal'], diags);
  const summaryField = textAt(y, ['summary'], diags);
  const parsed = LessonFrontmatter.safeParse(raw);
  if (!parsed.success) {
    reportIssues(y, parsed.error.issues, diags);
    return null;
  }
  const fm = parsed.data;
  if (fm.id !== expectedId) {
    diags.error(reportFile, lineOf(y, ['id']), `文件头的 id「${fm.id}」和路径推出的「${expectedId}」不一致`);
  }
  if (fm.status !== 'outline') {
    if (fm.minutes === undefined) diags.error(reportFile, lineOf(y, []), `status 为 ${fm.status} 时必须写 minutes`);
    if (fm.summary === undefined) diags.error(reportFile, lineOf(y, []), `status 为 ${fm.status} 时必须写 summary`);
  }
  const prerequisiteLines = fm.prerequisites.map((_, i) => lineOf(y, ['prerequisites', i]));
  const seenPrereq = new Set<string>();
  fm.prerequisites.forEach((p, i) => {
    if (!LESSON_ID_RE.test(p)) diags.error(reportFile, prerequisiteLines[i], `前置「${p}」不是小节 id（学科.领域.小节）`);
    if (p === expectedId) diags.error(reportFile, prerequisiteLines[i], '小节不能把自己列为前置');
    if (seenPrereq.has(p)) diags.error(reportFile, prerequisiteLines[i], `前置「${p}」重复了`);
    seenPrereq.add(p);
  });

  const refs: Refs = { lessons: [], terms: [] };
  const fieldCtx = { file: reportFile, macros: domain.macros, diags, refs };
  if (summaryField) {
    const n = countChars(summaryField.value);
    if (n > SUMMARY_MAX) diags.error(reportFile, summaryField.line, `一句话总结不超过 ${SUMMARY_MAX} 字，这里是 ${n} 字`, summaryField.value.trim());
  }

  const info: LessonInfo = {
    id: expectedId,
    subject: domain.subject,
    domain: domain.id,
    file: reportFile,
    status: fm.status,
    title: titleField ? renderField(titleField, fieldCtx, 'plain') : EMPTY,
    titleText: plainText(fm.title),
    goal: goalField ? renderField(goalField, fieldCtx, 'plain') : EMPTY,
    summary: summaryField ? renderField(summaryField, fieldCtx, 'plain') : null,
    minutes: fm.minutes ?? null,
    prerequisites: fm.prerequisites,
    prerequisiteLines,
    prerequisitesLine: lineOf(y, ['prerequisites']),
    proofPolicy: fm.proofPolicy ?? domain.proofPolicy,
    anchors: new Map(),
    refs,
    content: null,
  };

  const lessonDir = path.dirname(file);
  const problemsFile = path.join(lessonDir, 'problems.yaml');
  const body = (root.children ?? []).slice(1);
  if (fm.status === 'outline') {
    // 只有目录的小节：正文和题目还没写，不编译。
    if (body.length) diags.warn(reportFile, body[0].position?.start.line, '小节还是 outline，正文不会显示，也不做检查');
    if (fs.existsSync(problemsFile)) diags.warn(`${path.posix.dirname(reportFile)}/problems.yaml`, 1, '小节还是 outline，题目不会显示，也不做检查');
    return info;
  }

  const errorsBefore = diags.errorCount;
  // 正文里的控制字符：sed、shell 或脚本把 \theta 的 \t 吃成了制表符，KaTeX 当空白照样渲染（文件头的文字字段由 textAt 查）
  const frontEnd = front.position.end.line;
  source.split('\n').forEach((text, i) => {
    const control = i >= frontEnd ? controlChar(text) : null;
    if (control) diags.error(reportFile, i + 1, `正文里出现了控制字符 ${control}`);
  });
  const anims: AnimUse[] = [];
  const svgCount = { value: 0 };
  const ctx: MdContext = {
    file: reportFile,
    lineOffset: 0,
    macros: domain.macros,
    diags,
    refs,
    lessonDir,
    idPrefix: expectedId.replace(/\./g, '-'),
    anchors: info.anchors,
    sourceLines: source.split('\n'),
    anims,
    svgCount,
  };
  transformBody(root, ctx);
  const sections = splitSections(root.children ?? [], reportFile, source.split('\n').length, diags);

  // 几何图像：至少一张图或一个动画组件；只有占位框的不能标 reviewed。
  const picture = sections.picture;
  if (picture) {
    const hasSvg = contains(picture, (n) => n.type === 'svgFigure');
    const hasAnim = contains(picture, (n) => n.type === 'animBlock');
    const hasRealAnim = contains(picture, (n) => n.type === 'animBlock' && n.data?.hProperties !== undefined && (n.data.hProperties as Record<string, string>).dataImplemented === 'true');
    if (!hasSvg && !hasAnim) diags.error(reportFile, sections.lines.picture, '「几何图像」里至少要有一张图（SVG）或一个动画组件');
    else if (fm.status === 'reviewed' && !hasSvg && !hasRealAnim) {
      diags.error(reportFile, sections.lines.picture, '「几何图像」里只有尚未实现的动画组件（占位框），不能标 reviewed');
    }
  }

  const problemsReport = `${path.posix.dirname(reportFile)}/problems.yaml`;
  let problems = null;
  if (!fs.existsSync(problemsFile)) {
    diags.error(problemsReport, undefined, `status 为 ${fm.status} 的小节必须有 problems.yaml（8 道题）`);
  } else {
    problems = processProblems(problemsFile, problemsReport, { macros: domain.macros, diags, refs, lessonDir, idPrefix: ctx.idPrefix });
  }

  if (diags.errorCount === errorsBefore && problems) {
    info.content = {
      id: expectedId,
      proofPolicy: info.proofPolicy,
      sections: {
        question: toRich(sections.question ?? []),
        explanation: toRich(sections.explanation ?? []),
        picture: toRich(sections.picture ?? []),
        examples: toRich(sections.examples ?? []),
        misconceptions: sections.misconceptions ? toRich(sections.misconceptions) : null,
      },
      problems,
    };
  }
  return info;
}

type SplitResult = Partial<Record<keyof LessonSections, MdNode[]>> & { lines: Partial<Record<keyof LessonSections, number>> };

/** 按二级标题切分正文，检查标题文字、顺序、有没有缺。 */
function splitSections(nodes: MdNode[], file: string, lastLine: number, diags: Diagnostics): SplitResult {
  const result: SplitResult = { lines: {} };
  let current: keyof LessonSections | null = null;
  let lastIndex = -1;
  for (const node of nodes) {
    if (node.type === 'heading' && node.depth === 2) {
      const line = node.position?.start.line;
      const text = toString(node as never).trim();
      const index = SECTIONS.findIndex((s) => s.title === text);
      if (index < 0) {
        diags.error(file, line, `不允许的二级标题「${text}」：只能用 ${SECTIONS.map((s) => `「${s.title}」`).join('')}；讲解内部分段用三级标题`);
        current = null;
        continue;
      }
      if (index <= lastIndex) {
        diags.error(file, line, `二级标题「${text}」重复或顺序不对：顺序是 ${SECTIONS.map((s) => s.title).join(' → ')}`);
        current = null;
        continue;
      }
      lastIndex = index;
      current = SECTIONS[index].key;
      result[current] = [];
      result.lines[current] = line;
      continue;
    }
    if (current === null) {
      if (lastIndex < 0) diags.error(file, node.position?.start.line, '第一个二级标题「这一节要回答的问题」前面不能有内容');
      continue;
    }
    result[current]!.push(node);
  }
  for (const s of SECTIONS) {
    const content = result[s.key];
    if (!content) {
      if (s.required) diags.error(file, lastLine, `缺少二级标题「${s.title}」`);
    } else if (content.length === 0) {
      diags.error(file, result.lines[s.key], `「${s.title}」下面没有内容`);
    }
    // 三级标题编上 id，小节页左侧的目录栏用它跳转
    let n = 0;
    for (const node of content ?? []) {
      if (node.type !== 'heading' || node.depth !== 3) continue;
      n++;
      node.data = { ...node.data, hProperties: { ...(node.data?.hProperties as object), id: `h-${s.key}-${n}` } };
    }
  }
  return result;
}

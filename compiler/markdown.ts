// Markdown 管线：unified + remark-math + remark-directive 解析，逐个节点校验、改写，再转成 hast。
// 公式用 remark-math 解析出节点后逐个交给 KaTeX（见 tex.ts），不先把公式抽出来。

import fs from 'node:fs';
import path from 'node:path';
import type { Root as HastRoot, Element } from 'hast';
import type { Root as MdRoot } from 'mdast';
import { toHast } from 'mdast-util-to-hast';
import { toString } from 'mdast-util-to-string';
import remarkDirective from 'remark-directive';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import type { Rich } from '../shared/content-types.ts';
import { ANCHOR_RE, lessonPath } from '../shared/ids.ts';
import { processAnim, type AnimUse } from './anim.ts';
import type { Diagnostics } from './diagnostics.ts';
import { loadSvg } from './svg.ts';
import { keepPunctuationWithMath, spaceAroundMath } from '../shared/cjk-spacing.ts';
import { compileTex, suspectTex } from './tex.ts';
import type { TextField } from './yaml-text.ts';

/** mdast 节点的宽松写法：这里要改写节点、造自定义节点，用联合类型反而碍事。 */
export interface MdNode {
  type: string;
  children?: MdNode[];
  value?: string;
  name?: string;
  attributes?: Record<string, string | null | undefined> | null;
  url?: string;
  alt?: string | null;
  depth?: number;
  position?: { start: { line: number; column: number; offset?: number }; end: { line: number; column: number; offset?: number } };
  data?: Record<string, unknown>;
}

const lessonParser = unified()
  .use(remarkParse)
  .use(remarkFrontmatter, ['yaml'])
  .use(remarkGfm, { singleTilde: false })
  .use(remarkMath)
  .use(remarkDirective);

const fragmentParser = unified().use(remarkParse).use(remarkGfm, { singleTilde: false }).use(remarkMath).use(remarkDirective);

/** 解析整个 lesson.md（含文件头），节点上的行号就是文件里的行号。 */
export function parseLessonMarkdown(src: string): MdNode {
  return lessonParser.runSync(lessonParser.parse(src)) as unknown as MdNode;
}

/** 解析一个文字字段（不认文件头）。 */
export function parseFragment(src: string): MdNode {
  return fragmentParser.runSync(fragmentParser.parse(src)) as unknown as MdNode;
}

export interface RefLesson {
  id: string;
  anchor?: string;
  file: string;
  line: number;
}

export interface RefTerm {
  id: string;
  file: string;
  line: number;
}

export interface Refs {
  lessons: RefLesson[];
  terms: RefTerm[];
}

/**
 * 三种场合允许的写法不同：
 * - body：lesson.md 正文，什么都能写；
 * - rich：题目文字（statement、hints、solution、options），不能写标题、锚点、动画；
 * - plain：标题、goal、summary、术语表、单位、滑块标签，只能写一段文字、强调和行内公式。
 */
export type Mode = 'body' | 'rich' | 'plain';

export interface MdContext {
  file: string;
  /** mdast 行号 + lineOffset = 文件里的行号。 */
  lineOffset: number;
  macros: Record<string, string>;
  diags: Diagnostics;
  refs: Refs;
  /** 小节目录（绝对路径），找 SVG 用。 */
  lessonDir?: string;
  /** SVG 里 id 的前缀，避免同一页上几张图的 id 冲突。 */
  idPrefix?: string;
  /** 正文里的锚点：id → 行号。 */
  anchors?: Map<string, number>;
  /** lesson.md 原文按行拆开，取 :::anim 块里的原始 YAML 用。 */
  sourceLines?: string[];
  anims?: AnimUse[];
  /** 正文里内联了几张 SVG。 */
  svgCount?: { value: number };
}

function lineOf(ctx: MdContext, node: MdNode): number | undefined {
  const line = node.position?.start.line;
  return line === undefined ? undefined : line + ctx.lineOffset;
}

function countNewlines(s: string): number {
  return s.split('\n').length - 1;
}

const KIND_NAMES: Record<string, string> = {
  heading: '标题',
  list: '列表',
  code: '代码块',
  blockquote: '引用块',
  table: '表格',
  thematicBreak: '分隔线',
  math: '行间公式',
  link: '链接',
  image: '图片',
};

function renderMath(node: MdNode, ctx: MdContext): void {
  const display = node.type === 'math';
  const tex = node.value ?? '';
  // 行间公式的内容从 $$ 的下一行开始；知道出错位置（公式里的字符下标）时，精确到公式里的那一行。
  const start = lineOf(ctx, node) ?? 1;
  const multiline = node.position ? node.position.end.line > node.position.start.line : false;
  const lineAt = (position = 0) => start + (display && multiline ? 1 : 0) + countNewlines(tex.slice(0, position));
  const result = compileTex(tex, display, ctx.macros);
  if (result.problems.length || result.html === undefined) {
    ctx.diags.error(ctx.file, lineAt(result.position), `公式无法渲染：${result.problems.join('；')}`, `公式：${tex}`);
    node.data = { hName: 'code', hProperties: { className: ['math-error'] }, hChildren: [{ type: 'text', value: tex }] };
    return;
  }
  for (const s of suspectTex(tex)) ctx.diags.warn(ctx.file, lineAt(s.position), s.message, `公式：${tex}`);
  node.data = {
    hName: 'x-math',
    hProperties: display ? { dataHtml: result.html, dataDisplay: 'true' } : { dataHtml: result.html },
    hChildren: [],
  };
}

function handleLink(node: MdNode, ctx: MdContext): boolean {
  const url = node.url ?? '';
  const line = lineOf(ctx, node) ?? 1;
  if (url.startsWith('lesson:')) {
    const [id, anchor] = url.slice('lesson:'.length).split('#');
    ctx.refs.lessons.push({ id, anchor: anchor || undefined, file: ctx.file, line });
    node.url = lessonPath(id, anchor || undefined);
    node.data = { hProperties: { dataLesson: id } };
    return true;
  }
  if (/^https?:\/\//.test(url)) {
    node.data = { hProperties: { target: '_blank', rel: 'noreferrer' } };
    return true;
  }
  ctx.diags.error(ctx.file, line, `链接只能写 lesson:<小节 id>（小节之间）或 http(s) 地址，这里是「${url}」`);
  return false;
}

function svgFigure(image: MdNode, ctx: MdContext): MdNode | null {
  const line = lineOf(ctx, image) ?? 1;
  const url = image.url ?? '';
  if (!ctx.lessonDir) {
    ctx.diags.error(ctx.file, line, '这里不能放图片');
    return null;
  }
  if (!/^(\.\/)?[A-Za-z0-9_-]+\.svg$/.test(url)) {
    ctx.diags.error(ctx.file, line, `图片要用小节目录下的 SVG 文件（如 picture.svg），这里是「${url}」`);
    return null;
  }
  const file = path.join(ctx.lessonDir, url.replace(/^\.\//, ''));
  if (!fs.existsSync(file)) {
    ctx.diags.error(ctx.file, line, `找不到图片文件 ${url}`);
    return null;
  }
  const prefix = `${ctx.idPrefix ?? 'svg'}-${path.basename(file, '.svg')}`;
  const svg = loadSvg(file, prefix, image.alt ?? '', ctx.diags, ctx.file, line);
  if (!svg) return null;
  if (ctx.svgCount) ctx.svgCount.value++;
  return {
    type: 'svgFigure',
    data: { hName: 'figure', hProperties: { className: ['figure'] }, hChildren: [svg] },
  };
}

/** 一块范围里已经出现过的术语 id。范围：正文里以二级、三级标题为界；题目文字里每个字段各算一块。 */
type Seen = Set<string>;

function textDirective(node: MdNode, ctx: MdContext, mode: Mode, para: Seen): MdNode[] {
  const line = lineOf(ctx, node) ?? 1;
  const attrs = node.attributes ?? {};
  if (node.name === 'term') {
    transformChildren(node, ctx, mode, para);
    const label = node.children ?? [];
    if (mode === 'plain') {
      ctx.diags.error(ctx.file, line, '这个字段里不能用术语标记（只有正文和题目文字里能用）');
      return label;
    }
    const id = attrs.id ?? '';
    const extra = Object.keys(attrs).filter((k) => k !== 'id');
    if (!id) {
      ctx.diags.error(ctx.file, line, '术语标记缺 id，写法是 :term[显示的文字]{id="学科.领域.术语"}');
      return label;
    }
    if (extra.length) ctx.diags.error(ctx.file, line, `术语标记只认 id，多了 ${extra.join('、')}`);
    if (toString(node as never).trim() === '') ctx.diags.error(ctx.file, line, '术语标记的方括号里要写显示的文字');
    ctx.refs.terms.push({ id, file: ctx.file, line });
    // 同一块（三级标题下）同一个术语只有第一次加下划线、弹浮窗，后面再出现按普通文字显示。
    if (para.has(id)) return label;
    para.add(id);
    node.data = { hName: 'x-term', hProperties: { dataTermId: id } };
    return [node];
  }
  // 「a:b」「10:30」这类普通冒号会被解析成没有方括号、没有属性的指令，还原成文字。
  if ((node.children ?? []).length === 0 && Object.keys(attrs).length === 0) {
    return [{ type: 'text', value: `:${node.name}` }];
  }
  ctx.diags.error(ctx.file, line, `不认识的标记 :${node.name}（如果是普通冒号，改用全角「：」或写进公式）`);
  return node.children ?? [];
}

function transformNode(node: MdNode, ctx: MdContext, mode: Mode, para: Seen, topLevel: boolean): MdNode[] {
  const line = lineOf(ctx, node) ?? 1;
  const kind = KIND_NAMES[node.type] ?? node.type;
  switch (node.type) {
    case 'yaml':
      return [];
    case 'html':
      ctx.diags.error(ctx.file, line, `不支持 HTML 标签：${(node.value ?? '').trim().slice(0, 40)}`);
      return [];
    case 'footnoteDefinition':
    case 'footnoteReference':
      ctx.diags.error(ctx.file, line, '不支持脚注');
      return [];
    case 'definition':
    case 'linkReference':
    case 'imageReference':
      ctx.diags.error(ctx.file, line, '链接和图片请直接写地址，不用引用式写法');
      return [];
    case 'heading': {
      if (mode !== 'body') {
        ctx.diags.error(ctx.file, line, '这里不能写标题');
        return [];
      }
      if (node.depth === 1) {
        ctx.diags.error(ctx.file, line, '不能用一级标题；小节标题写在文件头的 title 里');
        return [];
      }
      if (node.depth === 2 && !topLevel) {
        ctx.diags.error(ctx.file, line, '二级标题只能出现在最外层');
        return [];
      }
      transformChildren(node, ctx, mode, para);
      return [node];
    }
    case 'paragraph': {
      const meaningful = (node.children ?? []).filter((c) => !(c.type === 'text' && (c.value ?? '').trim() === ''));
      if (meaningful.some((c) => c.type === 'image')) {
        if (mode === 'plain') {
          ctx.diags.error(ctx.file, line, '这个字段里不能放图片');
          return [];
        }
        if (meaningful.length !== 1) {
          ctx.diags.error(ctx.file, line, '图片要单独占一段');
          return [];
        }
        const figure = svgFigure(meaningful[0], ctx);
        return figure ? [figure] : [];
      }
      transformChildren(node, ctx, mode, para);
      return [node];
    }
    case 'tableCell':
      transformChildren(node, ctx, mode, para);
      return [node];
    case 'textDirective':
      return textDirective(node, ctx, mode, para);
    case 'leafDirective':
      ctx.diags.error(ctx.file, line, node.name === 'anchor' ? '这里不能放锚点（只有正文里能放）' : `不认识的标记 ::${node.name}`);
      return [];
    case 'containerDirective': {
      if (node.name === 'anim' && mode === 'body') {
        const anim = processAnim(node, ctx);
        return anim ? [anim] : [];
      }
      ctx.diags.error(ctx.file, line, node.name === 'anim' ? '动画组件只能放在正文里' : `不认识的标记 :::${node.name}`);
      return [];
    }
    case 'link':
      if (mode === 'plain') {
        ctx.diags.error(ctx.file, line, '这个字段里不能放链接');
        return node.children ?? [];
      }
      handleLink(node, ctx);
      transformChildren(node, ctx, mode, para);
      return [node];
    case 'image':
      ctx.diags.error(ctx.file, line, '图片要单独占一段');
      return [];
    case 'math':
      if (mode === 'plain') {
        ctx.diags.error(ctx.file, line, '这个字段里只能写行内公式 $...$');
        return [];
      }
      renderMath(node, ctx);
      return [node];
    case 'inlineMath':
      renderMath(node, ctx);
      return [node];
    case 'list':
    case 'listItem':
    case 'code':
    case 'blockquote':
    case 'table':
    case 'tableRow':
    case 'thematicBreak':
      if (mode === 'plain') {
        ctx.diags.error(ctx.file, line, `这个字段里不能写${kind}`);
        return [];
      }
      if (node.children) transformChildren(node, ctx, mode, para);
      return [node];
    case 'text':
    case 'inlineCode':
    case 'break':
      return [node];
    case 'emphasis':
    case 'strong':
    case 'delete':
      transformChildren(node, ctx, mode, para);
      return [node];
    default:
      ctx.diags.error(ctx.file, line, `不支持的写法：${node.type}`);
      return [];
  }
}

function transformChildren(parent: MdNode, ctx: MdContext, mode: Mode, para: Seen, topLevel = false): void {
  const input = parent.children ?? [];
  const output: MdNode[] = [];
  let scope = para;
  for (let i = 0; i < input.length; i++) {
    const node = input[i];
    // 正文最外层：每个二级、三级标题开始一块新的术语范围（标题本身算新的一块）
    if (topLevel && node.type === 'heading' && (node.depth ?? 0) <= 3) scope = new Set();
    if (node.type === 'leafDirective' && node.name === 'anchor' && mode === 'body') {
      const anchor = anchorTarget(node, input[i + 1], ctx, mode, scope, topLevel);
      if (anchor) {
        output.push(anchor);
        i++;
      }
      continue;
    }
    output.push(...transformNode(node, ctx, mode, scope, topLevel));
  }
  parent.children = keepPunctuationWithMath(spaceAroundMath(output));
}

/** `::anchor{id="..."}` 单独一行，标记紧接着的那一段：把那一段包进带 data-anchor 的 x-anchor。 */
function anchorTarget(node: MdNode, next: MdNode | undefined, ctx: MdContext, mode: Mode, scope: Seen, topLevel: boolean): MdNode | null {
  const line = lineOf(ctx, node) ?? 1;
  const attrs = node.attributes ?? {};
  const id = attrs.id ?? '';
  if (!ANCHOR_RE.test(id)) {
    ctx.diags.error(ctx.file, line, `锚点 id「${id}」只能用小写英文字母、数字和连字符`);
    return null;
  }
  if (ctx.anchors?.has(id)) {
    ctx.diags.error(ctx.file, line, `锚点 id「${id}」在这一节里重复了（第 ${ctx.anchors.get(id)} 行已有）`);
    return null;
  }
  ctx.anchors?.set(id, line);
  if (!next || next.type === 'heading' || next.type.endsWith('Directive')) {
    ctx.diags.error(ctx.file, line, '锚点后面要紧跟着被标记的那一段（不能是标题或别的标记）');
    return null;
  }
  const inner = transformNode(next, ctx, mode, scope, topLevel);
  return {
    type: 'anchorTarget',
    // 网站把它渲染成可跳转的块；讲解里的显示成定义卡片
    data: { hName: 'x-anchor', hProperties: { dataAnchor: id } },
    children: inner,
  };
}

/** 去掉 hast 上的位置信息，内容包小一些。 */
function stripPositions(node: { position?: unknown; children?: unknown[] }): void {
  delete node.position;
  for (const child of node.children ?? []) stripPositions(child as { position?: unknown; children?: unknown[] });
}

export function toRich(children: MdNode[]): Rich {
  const hast = toHast({ type: 'root', children } as unknown as MdRoot) as HastRoot;
  stripPositions(hast);
  return hast;
}

/** 正文：改写整棵树（解析出来的根节点）。 */
export function transformBody(root: MdNode, ctx: MdContext): void {
  transformChildren(root, ctx, 'body', new Set(), true);
}

/** 渲染一个 YAML 文字字段。plain 模式下只能有一段，返回这一段里的内容（不带 <p>）。 */
export function renderField(field: TextField, ctx: Omit<MdContext, 'lineOffset'>, mode: Exclude<Mode, 'body'>): Rich {
  const fieldCtx: MdContext = { ...ctx, lineOffset: field.contentLine - 1 };
  const tree = parseFragment(field.value);
  transformChildren(tree, fieldCtx, mode, new Set());
  const blocks = tree.children ?? [];
  if (mode === 'plain') {
    if (blocks.length > 1 || (blocks[0] && blocks[0].type !== 'paragraph')) {
      ctx.diags.error(ctx.file, field.contentLine, '这个字段只能写一段文字');
    }
    // 整段转成 hast 再取 <p> 的内容：直接把行内节点当根节点的孩子转换，节点之间会被插进换行，显示成多余的空格
    const p = toRich(blocks[0]?.type === 'paragraph' ? [blocks[0]] : []).children.find(
      (c): c is Element => c.type === 'element' && c.tagName === 'p',
    );
    return { type: 'root', children: p?.children ?? [] };
  }
  return toRich(blocks);
}

/**
 * 「复制给 Claude」用的原文：保留 Markdown 和公式（$…$），术语标记换成显示的文字，小节链接换成链接文字。
 * 按解析出来的节点位置在原文上替换，不重新生成 Markdown，免得公式里的反斜杠被转义。
 */
export function sourceText(src: string): string {
  const edits: { start: number; end: number; text: string }[] = [];
  const visit = (node: MdNode): void => {
    const replace = (node.type === 'textDirective' && node.name === 'term') || (node.type === 'link' && node.url?.startsWith('lesson:'));
    const start = node.position?.start.offset;
    const end = node.position?.end.offset;
    if (replace && start !== undefined && end !== undefined) {
      const kids = node.children ?? [];
      const from = kids[0]?.position?.start.offset;
      const to = kids[kids.length - 1]?.position?.end.offset;
      edits.push({ start, end, text: from !== undefined && to !== undefined ? src.slice(from, to) : '' });
      return;
    }
    node.children?.forEach(visit);
  };
  visit(parseFragment(src));
  let out = src;
  for (const edit of edits.sort((a, b) => b.start - a.start)) out = out.slice(0, edit.start) + edit.text + out.slice(edit.end);
  return out.trim();
}

/** 纯文字（公式保留 TeX 原文），给浏览器标签页、提交信息用。 */
export function plainText(src: string): string {
  return toString(parseFragment(src.trim()) as never).replace(/\s+/g, ' ').trim();
}

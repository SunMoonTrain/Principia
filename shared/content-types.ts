// 内容编译器的输出格式（generated/ 下的 JSON），网站只读。
// 这是构建产物的格式，每次构建重新生成，不是要长期保存的数据。

import type { Root } from 'hast';

/**
 * 渲染好的文字：hast 树（已去掉位置信息）。公式已在构建时用 KaTeX 编译成 HTML，
 * 放在自定义元素 `x-math` 里；术语标记是 `x-term`，动画组件是 `x-anim`。
 */
export type Rich = Root;

export type LessonStatus = 'outline' | 'written' | 'reviewed';
export type Tier = 'easy' | 'medium' | 'hard' | 'thinking';
export type ProofPolicy = 'sketch' | 'full';

export const CONTENT_FORMAT = 1;

export interface GraphLesson {
  id: string;
  subject: string;
  domain: string;
  title: Rich;
  /** 纯文字标题（公式保留 TeX 原文），用于浏览器标签页、存档提交信息等。 */
  titleText: string;
  goal: Rich;
  summary: Rich | null;
  status: LessonStatus;
  minutes: number | null;
  prerequisites: string[];
  /** 层级 = 从没有前置的小节出发的最长前置链长度，根节点为 0。 */
  level: number;
}

export interface GraphDomain {
  id: string;
  subject: string;
  title: Rich;
  titleText: string;
  proofPolicy: ProofPolicy;
  /** 内容包的文件名（相对 /data/），带内容哈希，便于浏览器缓存。 */
  pack: string;
  lessons: string[];
}

export interface Graph {
  format: typeof CONTENT_FORMAT;
  domains: GraphDomain[];
  lessons: GraphLesson[];
}

export interface TermEntry {
  id: string;
  domain: string;
  zh: Rich;
  en: Rich;
  abbr: Rich | null;
  brief: Rich;
  definedIn: string;
  anchor: string;
}

export interface LessonSections {
  question: Rich;
  explanation: Rich;
  picture: Rich;
  examples: Rich;
  misconceptions: Rich | null;
}

export interface Tolerance {
  rel: number;
  abs: number;
}

export type Answer =
  | { type: 'number'; value: number; source: string; unit: Rich | null }
  | { type: 'tuple' | 'set'; value: number[]; source: string[]; unit: Rich | null }
  | { type: 'choice'; multiple: boolean; options: Rich[]; value: number[] };

export interface Problem {
  id: string;
  tier: Tier;
  statement: Rich;
  /** 难题、思考题没有 answer、solution、tolerance。 */
  answer: Answer | null;
  tolerance: Tolerance | null;
  hints: [Rich, Rich, Rich];
  solution: Rich | null;
}

export interface LessonContent {
  id: string;
  proofPolicy: ProofPolicy;
  sections: LessonSections;
  problems: Problem[];
}

export interface DomainPack {
  format: typeof CONTENT_FORMAT;
  domain: string;
  /** 本领域的 KaTeX 宏（台阶 4 的笔记预览要用）。 */
  macros: Record<string, string>;
  /** 本领域的术语，加上本领域内容引用到的其他领域的术语。 */
  glossary: Record<string, TermEntry>;
  /** 只含 written、reviewed 的小节；outline 小节只在全局图谱里。 */
  lessons: Record<string, LessonContent>;
}

export interface Diagnostic {
  level: 'error' | 'warning';
  /** 相对仓库根目录、用正斜杠的路径。 */
  file: string;
  line?: number;
  message: string;
  /** 出错的公式原文等。 */
  detail?: string;
}

export interface BuildReport {
  ok: boolean;
  finishedAt: string;
  errors: Diagnostic[];
  warnings: Diagnostic[];
}

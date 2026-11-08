// id 规则，见 docs/plan.md「内容模型」。编译器和网站共用。

/** 目录名（学科、领域、小节）：小写字母开头，只用小写字母、数字和连字符。 */
export const SEGMENT_RE = /^[a-z][a-z0-9-]*$/;
/** 学科.领域 */
export const DOMAIN_ID_RE = /^[a-z][a-z0-9-]*\.[a-z][a-z0-9-]*$/;
/** 学科.领域.小节 */
export const LESSON_ID_RE = /^[a-z][a-z0-9-]*\.[a-z][a-z0-9-]*\.[a-z][a-z0-9-]*$/;
/** 学科.领域.术语 */
export const TERM_ID_RE = /^[a-z][a-z0-9-]*\.[a-z][a-z0-9-]*\.[a-z0-9][a-z0-9-]*$/;
/** 定义段落的锚点：只用小写英文字母、数字和连字符。 */
export const ANCHOR_RE = /^[a-z0-9-]+$/;

export const TIER_ORDER = ['easy', 'easy', 'medium', 'medium', 'hard', 'hard', 'thinking', 'thinking'] as const;
export const PROBLEM_IDS = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'] as const;

export function domainOf(id: string): string {
  return id.split('.').slice(0, 2).join('.');
}

export function subjectOf(id: string): string {
  return id.split('.')[0];
}

export function lessonPath(id: string, anchor?: string): string {
  return `/lesson/${id}` + (anchor ? `#${anchor}` : '');
}

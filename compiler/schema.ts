// 内容文件的结构校验（zod），字段见 docs/plan.md「内容模型」。
// 只校验「形状」；和别的文件有关的检查（前置是否存在、术语是否存在等）在 compile.ts 里做。
// 出现方案里没有的字段一律报错，防止拼错字段名后被悄悄忽略。

import { z } from 'zod';
import type { Diagnostics } from './diagnostics.ts';
import { p8Bytes, p8Isa } from '../packages/sim/src/p8-schema.ts';
import { TOKEN } from '../shared/sequence.ts';
import { lineOf, type YamlFile } from './yaml-text.ts';

z.config(z.locales.zhCN());

export const LessonFrontmatter = z.strictObject({
  id: z.string(),
  title: z.string(),
  goal: z.string(),
  prerequisites: z.array(z.string()),
  status: z.enum(['outline', 'written', 'reviewed']),
  minutes: z.number().int().positive().optional(),
  summary: z.string().optional(),
  proofPolicy: z.enum(['sketch', 'full']).optional(),
});
export type LessonFrontmatter = z.infer<typeof LessonFrontmatter>;

export const GlossaryEntry = z.strictObject({
  id: z.string(),
  zh: z.string(),
  en: z.string(),
  abbr: z.string().optional(),
  brief: z.string(),
  definedIn: z.string(),
  anchor: z.string(),
});

export const DomainFile = z.strictObject({
  id: z.string(),
  title: z.string(),
  proofPolicy: z.enum(['sketch', 'full']),
  macros: z.record(z.string(), z.string()).optional(),
  glossary: z.array(GlossaryEntry).optional(),
});
export type DomainFile = z.infer<typeof DomainFile>;

const NumberOrExpression = z.union([z.number(), z.string()]);

const Token = z.union([z.string(), z.number()]).transform(String).pipe(z.string().regex(TOKEN, '记号只能含英文字母、数字、_ + - .'));
const NumericFields = { unit: z.string().optional(), exact: z.literal(true).optional() };

export const AnswerSchema = z.discriminatedUnion(
  'type',
  [
    z.strictObject({
      type: z.literal('program'), language: z.literal('p8asm'), starter: z.string(),
      tests: z.array(z.strictObject({ in: p8Bytes.default([]), out: p8Bytes })).min(1).max(20),
      maxCycles: z.int().positive().max(100000).default(10000), isa: p8Isa.optional(),
    }),
    z.strictObject({ type: z.literal('number'), value: NumberOrExpression, ...NumericFields }),
    z.strictObject({ type: z.literal('tuple'), value: z.array(NumberOrExpression).min(1), ...NumericFields }),
    z.strictObject({ type: z.literal('set'), value: z.array(NumberOrExpression).min(1), ...NumericFields }),
    z.strictObject({
      type: z.literal('sequence'), value: z.array(Token).min(1), alphabet: z.array(Token).min(1).optional(),
      caseSensitive: z.boolean().optional(),
    }),
    z.strictObject({
      type: z.literal('choice'),
      multiple: z.boolean(),
      options: z.array(z.string()).min(2),
      value: z.union([z.number().int(), z.array(z.number().int()).min(1)]),
    }),
  ],
  { error: 'answer.type 只能是 number、tuple、set、choice、sequence、program 之一' },
);

export const ProblemSchema = z.strictObject({
  id: z.string(),
  tier: z.enum(['easy', 'medium', 'hard', 'thinking']),
  statement: z.string(),
  answer: AnswerSchema.optional(),
  tolerance: z
    .strictObject({ rel: z.number().nonnegative().optional(), abs: z.number().nonnegative().optional() })
    .optional(),
  hints: z.array(z.string()).length(3, '恰好 3 条提示（方向、关键步骤、完整解答）'),
  solution: z.string().optional(),
  reference: z.string().optional(),
});
export type ProblemInput = z.infer<typeof ProblemSchema>;

/** 把 zod 的问题报成「文件:行号  路径：说明」。 */
export function reportIssues(
  y: YamlFile,
  issues: z.ZodError['issues'],
  diags: Diagnostics,
  prefix: PropertyKey[] = [],
  name: (path: PropertyKey[]) => string = (path) => path.join('.'),
): void {
  for (const issue of issues) {
    const path = [...prefix, ...issue.path];
    if (issue.code === 'unrecognized_keys') {
      for (const key of issue.keys) {
        diags.error(y.file, lineOf(y, [...path, key]), `${name([...path, key])}：方案里没有这个字段（拼错了？）`);
      }
      continue;
    }
    const where = path.length ? name(path) : '整个文件';
    diags.error(y.file, lineOf(y, path), `${where}：${issue.message}`);
  }
}

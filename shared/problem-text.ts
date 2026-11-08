// 题目在页面上的叫法：难度档的名字、选项的字母、作答方式。
// 网页的题目卡片和「只导出题干」的小工具（tools/statements）共用，两边说法一致。

import type { Tier } from './content-types.ts';

export const TIER_LABELS: Record<Tier, string> = { easy: '简单', medium: '中等', hard: '难', thinking: '思考' };

/** 选项在页面上依次标为 A、B、C……（提示和解答里提到选项时也用这些字母）。 */
export const OPTION_LABELS = 'ABCDEFGHIJ';

/** 作答方式（题目卡片右上角那一行）：只看题型和个数，不涉及答案本身。没有 answer 的是难题、思考题。 */
export function answerKind(answer: { type: 'number' | 'tuple' | 'set' | 'choice'; value?: unknown; multiple?: boolean } | null | undefined): string {
  if (!answer) return '写思路笔记，找 Claude 批改';
  const count = Array.isArray(answer.value) ? answer.value.length : 1;
  switch (answer.type) {
    case 'number':
      return '填一个数';
    case 'tuple':
      return `按顺序填 ${count} 个数`;
    case 'set':
      return `填 ${count} 个数，不分顺序`;
    case 'choice':
      return answer.multiple ? '多选' : '单选';
  }
}

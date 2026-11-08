// 「复制给 Claude」：把题目原文、你的思路笔记、看过第几级提示打包成一段文字，直接粘贴就能批改。
// 不带参考解答（reference 根本不在内容包里）。用到本领域的符号宏时，在后面写明它们的意思。

import type { Tier } from '../../shared/content-types';

const TIER_NAMES: Record<Tier, string> = { easy: '简单题', medium: '中等题', hard: '难题', thinking: '思考题' };

export interface ClaudeTextInput {
  lessonTitle: string;
  /** 第几题（1–8）。 */
  number: number;
  tier: Tier;
  statement: string;
  note: string;
  /** 点开到第几级提示（0–3）。 */
  hintsShown: number;
  macros: Record<string, string>;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hintsLine(shown: number): string {
  if (shown === 0) return '没看提示。';
  if (shown === 3) return '看过全部 3 级提示（第 3 级是完整解答）。';
  return `看过前 ${shown} 级提示（共 3 级：方向、关键步骤、完整解答）。`;
}

export function claudeText(input: ClaudeTextInput): string {
  const text = `${input.statement}\n${input.note}`;
  // 宏名后面紧跟字母时是另一个命令（\R 和 \Re），不算用到
  const used = Object.entries(input.macros).filter(([name]) => new RegExp(`${escapeRegExp(name)}(?![a-zA-Z])`).test(text));
  const lines = [
    `请帮我批改下面这道${TIER_NAMES[input.tier]}。请指出推理里的错误和漏洞，最后用一个词给出结论：通过、部分或没过。`,
    '',
    `【题目】《${input.lessonTitle}》第 ${input.number} 题`,
    input.statement.trim(),
    '',
    '【我的思路笔记】',
    input.note.trim() || '（还没写笔记）',
    '',
    `【看过的提示】${hintsLine(input.hintsShown)}`,
  ];
  if (used.length) lines.push('', '【符号约定】', ...used.map(([name, def]) => `${name} 表示 ${def.trim()}`));
  return lines.join('\n');
}

/** 复制到剪贴板。局域网地址（iPad）不是安全上下文，没有 navigator.clipboard，退回旧办法。 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (window.isSecureContext && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // 退回旧办法
  }
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  area.remove();
  return ok;
}

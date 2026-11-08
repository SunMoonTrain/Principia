// 小节页给里面的术语浮窗等组件提供「当前是哪一节、术语表是什么、本领域的符号宏」。

import { createContext, useContext } from 'react';
import type { TermEntry } from '../../shared/content-types';

export interface LessonContextValue {
  lessonId: string | null;
  glossary: Record<string, TermEntry>;
  /** 本领域的 KaTeX 宏：笔记预览、「复制给 Claude」用。 */
  macros: Record<string, string>;
}

export const LessonContext = createContext<LessonContextValue>({ lessonId: null, glossary: {}, macros: {} });

export function useLessonContext(): LessonContextValue {
  return useContext(LessonContext);
}

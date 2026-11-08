// 小节页给里面的术语浮窗等组件提供「当前是哪一节、术语表是什么」。

import { createContext, useContext } from 'react';
import type { TermEntry } from '../../shared/content-types';

export interface LessonContextValue {
  lessonId: string | null;
  glossary: Record<string, TermEntry>;
}

export const LessonContext = createContext<LessonContextValue>({ lessonId: null, glossary: {} });

export function useLessonContext(): LessonContextValue {
  return useContext(LessonContext);
}

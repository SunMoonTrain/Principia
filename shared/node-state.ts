// 星图节点的五种状态，见 docs/plan.md「立体知识图谱与动态效果 · 节点状态」。星图、小节页、术语浮窗共用。

import type { LessonStatus as ContentStatus } from './content-types.ts';
import { isLearned, type ProgressState } from './progress.ts';

/** 已完成、已会、可学、够不着、待写。 */
export type NodeState = 'completed' | 'known' | 'available' | 'locked' | 'outline';

export interface NodeLesson {
  id: string;
  status: ContentStatus;
  prerequisites: string[];
}

/**
 * 你点过「这节学完了」就是已完成、标过「我已经会了」就是已会（这一节后来写好了也还是已会）；
 * 否则只有目录的是待写；写好了的看前置：全部是已完成或已会就可学，不然够不着。
 */
export function nodeState(lesson: NodeLesson, progress: ProgressState): NodeState {
  const status = progress.lessons[lesson.id]?.status;
  if (status === 'completed') return 'completed';
  if (status === 'known') return 'known';
  if (lesson.status === 'outline') return 'outline';
  return missingPrereqs(lesson, progress).length ? 'locked' : 'available';
}

/** 还没学（既不是已完成也不是已会）的前置。 */
export function missingPrereqs(lesson: NodeLesson, progress: ProgressState): string[] {
  return lesson.prerequisites.filter((id) => !isLearned(progress.lessons[id]));
}

export const NODE_STATE_LABELS: Record<NodeState, string> = {
  completed: '已完成',
  known: '已会',
  available: '可学',
  locked: '够不着',
  outline: '待写',
};

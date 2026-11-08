// 进度（已完成 / 已会）。台阶 3 才有进度服务，现在每一节都当作「还没学」。

export interface ProgressView {
  /** 状态是「已完成」或「已会」。 */
  isLearned(lessonId: string): boolean;
}

const nothingLearned: ProgressView = { isLearned: () => false };

export function useProgress(): ProgressView {
  return nothingLearned;
}

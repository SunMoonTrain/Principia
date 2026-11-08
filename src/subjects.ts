// 学科的显示名。内容里没有学科文件（plan.md 只定义了领域文件），这里先写死。
const SUBJECTS: Record<string, string> = { math: '数学', physics: '物理' };

export function subjectTitle(id: string): string {
  return SUBJECTS[id] ?? id;
}

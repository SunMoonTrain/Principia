import type { LessonStatus } from '../../shared/content-types';

/** 待写（outline）、未审（written）；reviewed 不加标记。 */
export function StatusBadge({ status }: { status: LessonStatus }) {
  if (status === 'outline') return <span className="badge badge-outline">待写</span>;
  if (status === 'written') return <span className="badge badge-unreviewed">未审</span>;
  return null;
}

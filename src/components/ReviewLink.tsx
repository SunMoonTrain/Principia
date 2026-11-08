// 顶栏的「复习」入口，带上复习列表里有几道题。

import { NavLink } from 'react-router';
import { useReviewItems } from '../pages/ReviewPage';

export function ReviewLink() {
  const count = useReviewItems().length;
  return (
    <NavLink to="/review" className="review-link" title="标了没把握、答错过、看过提示的题">
      复习
      {count > 0 && <span className="review-count">{count}</span>}
    </NavLink>
  );
}

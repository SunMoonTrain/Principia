import { Link } from 'react-router';

export function NotFoundPage({ what = '这个页面' }: { what?: string }) {
  return (
    <div className="page-message">
      <p>找不到{what}。</p>
      <p>
        <Link to="/">回到所有小节</Link>
      </p>
    </div>
  );
}

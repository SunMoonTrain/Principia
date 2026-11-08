// 内容里的链接：小节之间用站内路由，外部链接新开标签页。

import type { ReactNode } from 'react';
import { Link } from 'react-router';

export function ContentLink(props: { href?: string; target?: string; rel?: string; 'data-lesson'?: string; children?: ReactNode }) {
  if (props['data-lesson'] && props.href) {
    return (
      <Link to={props.href} state={{ scrollNonce: Date.now() }}>
        {props.children}
      </Link>
    );
  }
  return (
    <a href={props.href} target={props.target} rel={props.rel}>
      {props.children}
    </a>
  );
}

// 小节里的动画组件块：已实现的组件按需加载 packages/anim（和 three.js 一样不放进首屏的包），没实现的显示占位框。
// 编译器把滑块标签、图例排好版，作为 x-anim-label 子元素放在块里，这里按 data-key 收起来交给组件。

import { Children, isValidElement, lazy, Suspense, useMemo, type ReactNode } from 'react';
import { AnimPlaceholder } from './AnimPlaceholder';

const AnimRuntime = lazy(() => import('./AnimRuntime'));

interface AnimLabelProps {
  'data-key'?: string;
  children?: ReactNode;
}

export function AnimLabel({ children }: AnimLabelProps) {
  return <>{children}</>;
}

export function AnimBlock(props: { 'data-component'?: string; 'data-params'?: string; 'data-implemented'?: string; children?: ReactNode }) {
  const name = props['data-component'] ?? '';
  const source = props['data-params'];
  const params = useMemo(() => {
    try {
      return JSON.parse(source ?? '{}') as unknown;
    } catch {
      return null;
    }
  }, [source]);
  const labels = useMemo(() => {
    const out: Record<string, ReactNode> = {};
    Children.forEach(props.children, (child) => {
      if (isValidElement<AnimLabelProps>(child) && child.type === AnimLabel && child.props['data-key']) {
        out[child.props['data-key']] = child.props.children;
      }
    });
    return out;
  }, [props.children]);

  if (props['data-implemented'] !== 'true' || !params) return <AnimPlaceholder data-component={name} />;
  return (
    <Suspense fallback={<div className="anim anim-loading" aria-busy="true" />}>
      {/* 参数原文作 key：参数原地变了（开发时内容热更新）就重新挂载，滑块、轨迹从头开始；换小节由小节页的 key 负责 */}
      <AnimRuntime key={source} component={name} params={params} labels={labels} />
    </Suspense>
  );
}

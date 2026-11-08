// 按需加载的那一块：packages/anim 的组件表。网站只认组件名，参数原样交给组件。

import { ANIMATIONS } from '@principia/anim';
import type { ReactNode } from 'react';
import { AnimPlaceholder } from './AnimPlaceholder';

export default function AnimRuntime({ component, params, labels }: { component: string; params: unknown; labels: Record<string, ReactNode> }) {
  const Component = ANIMATIONS[component];
  if (!Component) return <AnimPlaceholder data-component={component} />;
  return <Component params={params as never} labels={labels} />;
}

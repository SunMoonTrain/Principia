// 按需加载的那一块：packages/anim 的组件表。网站只认组件名，参数原样交给组件。

import { SliderPanel, useSliders } from '@principia/anim/kit';
import type { SliderSpec } from '@principia/anim/specs';
import { ANIMATIONS } from '@principia/anim/registry';
import { SIMULATORS } from '@principia/sim/registry';
import type { ReactNode } from 'react';
import { AnimPlaceholder } from './AnimPlaceholder';

function SimSliders({ sliders, labels }: { sliders: SliderSpec[]; labels: Record<string, ReactNode> }) {
  const { values, set } = useSliders(sliders);
  return <SliderPanel sliders={sliders} values={values} onChange={set} labels={labels}/>;
}

export default function AnimRuntime({ component, params, labels }: { component: string; params: unknown; labels: Record<string, ReactNode> }) {
  const Component = ANIMATIONS[component] ?? SIMULATORS[component];
  if (!Component) return <AnimPlaceholder data-component={component} />;
  const sliders = SIMULATORS[component] && (params as { sliders?: SliderSpec[] }).sliders;
  return <><Component params={params as never} labels={labels} />
    {sliders?.length ? <SimSliders sliders={sliders} labels={labels}/> : null}</>;
}

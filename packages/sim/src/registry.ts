import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { AnimProps } from '@principia/anim';

/** 内容组件名与 specs.ts 的 SIM_SPECS 一一对应。 */
export const SIMULATORS: Record<string, LazyExoticComponent<ComponentType<AnimProps<never>>>> = {
  memory: lazy(() => import('./Memory')),
  pipeline: lazy(() => import('./Pipeline')),
  cache: lazy(() => import('./Cache')),
  cpu: lazy(() => import('./Cpu')),
  'logic-circuit': lazy(() => import('./LogicCircuit')),
  bits: lazy(() => import('./Bits')),
  float32: lazy(() => import('./Float32')),
  'text-encoding': lazy(() => import('./TextEncoding')),
};

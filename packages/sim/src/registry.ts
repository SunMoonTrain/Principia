import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { AnimProps } from '@principia/anim';

/** 内容组件名与 specs.ts 的 SIM_SPECS 一一对应。 */
export const SIMULATORS: Record<string, LazyExoticComponent<ComponentType<AnimProps<never>>>> = {
  'scheduler': lazy(() => import('./Scheduler')),
  'threads': lazy(() => import('./Threads')),
  'page-table': lazy(() => import('./PageTable')),
  'page-replacement': lazy(() => import('./PageReplacement')),
  'filesystem': lazy(() => import('./Filesystem')),
  'sort': lazy(()=>import('./Sort')),
  'grid-search': lazy(()=>import('./GridSearch')),
  'graph': lazy(()=>import('./Graph')),
  'dp-table': lazy(()=>import('./DpTable')),
  tree: lazy(() => import('./Tree')),
  memory: lazy(() => import('./Memory')),
  pipeline: lazy(() => import('./Pipeline')),
  cache: lazy(() => import('./Cache')),
  cpu: lazy(() => import('./Cpu')),
  'logic-circuit': lazy(() => import('./LogicCircuit')),
  bits: lazy(() => import('./Bits')),
  float32: lazy(() => import('./Float32')),
  'text-encoding': lazy(() => import('./TextEncoding')),
};

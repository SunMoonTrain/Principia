// 内容里写的组件名 → 组件。和 specs.ts 的 SPECS 一一对应（编译器按 SPECS 判断组件实现了没有）。

import type { ComponentType } from 'react';
import { FunctionPlot } from './FunctionPlot';
import type { AnimProps } from './kit';
import { LinearMap2D } from './LinearMap2D';
import { Oscillator } from './Oscillator';
import { PhasePortrait } from './PhasePortrait';
import { VectorField2D } from './VectorField2D';

export const ANIMATIONS: Record<string, ComponentType<AnimProps<never>>> = {
  'function-plot': FunctionPlot,
  'phase-portrait': PhasePortrait,
  'vector-field-2d': VectorField2D,
  oscillator: Oscillator,
  'linear-map-2d': LinearMap2D,
};

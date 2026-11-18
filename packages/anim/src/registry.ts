import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { AnimProps } from './kit';

export const ANIMATIONS: Record<string, LazyExoticComponent<ComponentType<AnimProps<never>>>> = {
  'function-plot': lazy(() => import('./FunctionPlot').then((m) => ({ default: m.FunctionPlot }))),
  'phase-portrait': lazy(() => import('./PhasePortrait').then((m) => ({ default: m.PhasePortrait }))),
  'vector-field-2d': lazy(() => import('./VectorField2D').then((m) => ({ default: m.VectorField2D }))),
  'oscillator': lazy(() => import('./Oscillator').then((m) => ({ default: m.Oscillator }))),
  'linear-map-2d': lazy(() => import('./LinearMap2D').then((m) => ({ default: m.LinearMap2D }))),
};

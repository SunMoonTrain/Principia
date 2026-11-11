// 可复用动画组件库（docs/plan.md「可复用动画组件库」）。不依赖网站的任何代码；
// 参数格式和检查在 specs.ts（编译器从 @principia/anim/specs 引入，不带 React）。

export { FunctionPlot } from './FunctionPlot';
export { Gallery } from './Gallery';
export type { AnimProps } from './kit';
export { LinearMap2D } from './LinearMap2D';
export { Oscillator } from './Oscillator';
export { PhasePortrait } from './PhasePortrait';
export { ANIMATIONS } from './registry';
export { VectorField2D } from './VectorField2D';

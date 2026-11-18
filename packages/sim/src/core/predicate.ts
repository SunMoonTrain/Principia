import { compileExpr } from '../../../anim/src/expr.ts';

export type Observation = Record<string, number | boolean>;
export interface Condition { when: string; text: string }

export function compilePredicate(source: string, names: readonly string[]) {
  const test = compileExpr(source, names, true);
  return (values: Observation, readMemory?: (address: number) => number): boolean =>
    Boolean(test(names.map((key) => Number(values[key])), readMemory));
}

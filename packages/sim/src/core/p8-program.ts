import type { ProgramAnswer } from '../../../../shared/content-types.ts';
import { assemble, AssemblyError } from './p8-asm.ts';
import { runCpu } from './p8.ts';

export interface CaseResult {
  actual: number[];
  cycles: number;
  reason: string;
  passed: boolean;
}
export type ProgramResult = { error: { line: number; message: string } } | { results: CaseResult[] };

export function gradeProgram(source: string, answer: ProgramAnswer): ProgramResult {
  let image;
  try {
    image = assemble(source, answer.isa);
  } catch (error) {
    if (!(error instanceof AssemblyError)) throw error;
    return { error: { line: error.line, message: error.message } };
  }
  const results = answer.tests.map(test => {
    const s = runCpu({ image, input: test.in, isa: answer.isa }, answer.maxCycles);
    const matches = s.output.length === test.out.length && s.output.every((value, i) => value === test.out[i]);
    const reason = s.error ?? (!s.halted || s.cycles > answer.maxCycles ? answer.maxCycles + ' 个周期内没有停机' : matches ? '' : '输出与期望不同');
    return { actual: s.output, cycles: s.cycles, reason, passed: !reason };
  });
  return { results };
}

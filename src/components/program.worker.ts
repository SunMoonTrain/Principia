import type { ProgramAnswer } from '../../shared/content-types';
import { gradeProgram } from '../../packages/sim/src/core/p8-program';

self.onmessage = ({data}: MessageEvent<{ source: string; answer: ProgramAnswer }>) => {
  self.postMessage(gradeProgram(data.source, data.answer));
};

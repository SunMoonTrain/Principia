import path from 'node:path';
import { processProblems } from './problems.ts';
import { simDemos } from '../packages/sim/src/demos.ts';
import { Diagnostics, formatDiagnostic } from './diagnostics.ts';
import { parseLessonMarkdown, transformBody } from './markdown.ts';

export function compileProgramDemo(root: string) {
  const file = 'compiler/fixtures/c3/content/cs/processor/demo/problems.yaml';
  const diags = new Diagnostics();
  const problems = processProblems(path.join(root, ...file.split('/')), file, {diags, macros:{}, refs:{lessons:[],terms:[]}});
  if (!problems || diags.errors.length) throw new Error(diags.errors.map(formatDiagnostic).join('\n'));
  return problems.find(p => p.answer?.type === 'program')!;
}

export function compileSimDemos() {
  return simDemos.map(({ name, title, yaml }) => {
    const source = ':::anim{component="' + name + '"}\n' + yaml + '\n:::';
    const root = parseLessonMarkdown(source), diags = new Diagnostics();
    transformBody(root, { file: '画廊 / ' + title, lineOffset: 0, macros: {}, diags,
      refs: { lessons: [], terms: [] }, sourceLines: source.split('\n') });
    if (diags.items.length) throw new Error(diags.items.map(formatDiagnostic).join('\n'));
    const props = root.children![0].data!.hProperties as { dataParams: string };
    return { name, title, params: JSON.parse(props.dataParams) };
  });
}

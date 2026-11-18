import { simDemos } from '../packages/sim/src/demos.ts';
import { Diagnostics, formatDiagnostic } from './diagnostics.ts';
import { parseLessonMarkdown, transformBody } from './markdown.ts';

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

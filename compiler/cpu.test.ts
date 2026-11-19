import { expect, it } from 'vitest';
import { Diagnostics } from './diagnostics';
import { parseLessonMarkdown, transformBody } from './markdown';

function errors(body: string) {
  const source = ':::anim{component="cpu"}\n' + body + '\n:::';
  const diags = new Diagnostics();
  transformBody(parseLessonMarkdown(source), { file: 'cpu.md', macros: {}, lineOffset: 0, diags,
    refs: { lessons: [], terms: [] }, sourceLines: source.split('\n') });
  return diags.errors;
}
const program = 'program: |\n  start: NOP\n  HLT';
it('cpu 参数、断点和开放指令的错误指向内容行', () => {
  for (const [field, line] of [
    ['isa: [NOP]',4], ['isa: [MUL]',5], ['breakpoints: [missing]',5], ['breakpoints: [3]',5],
    ['input: [256]',5], ['cache: {}',5], ['sliders: []',5], ['goals:\n  - when: unknown == 0\n    text: |\n      预测',6],
  ] as const) expect(errors(program+'\n'+field),field).toContainEqual(expect.objectContaining({file:'cpu.md',line}));
  expect(errors(program.replace('HLT','MUL R0, R1'))[0].line).toBe(4);
  expect(errors('program: |\n  LDI R0, 1\n  SUB R0, 1\nisa: [LDI, ADD, OUT, HLT]')).toContainEqual(expect.objectContaining({
    line:4, message:expect.stringContaining('只开放 LDI、ADD、OUT、HLT'),
  }));
  expect(errors('program: |\n  data: .byte 0\nbreakpoints: [data]')[0].line).toBe(4);
  expect(errors(program+'\ninput: [-1, "0b10", "0x08"]\nbreakpoints: [start, 2]\ngoals:\n  - when: mem(0) == 4\n    text: |\n      读出操作码')).toEqual([]);
});

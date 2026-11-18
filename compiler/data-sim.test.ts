import { expect, it } from 'vitest';
import { Diagnostics } from './diagnostics';
import { parseLessonMarkdown, transformBody } from './markdown';

function compile(name: string, body: string) {
  const source = ':::anim{component="' + name + '"}\n' + body + '\n:::\n';
  const root = parseLessonMarkdown(source), diags = new Diagnostics();
  transformBody(root, { file: 'sample.md', lineOffset: 0, macros: {}, diags, refs: { lessons: [], terms: [] }, sourceLines: source.split('\n') });
  return { errors: diags.errors, root };
}
it.each([
  ['bits', 'width: 12\nvalue: 0', 2], ['bits', 'width: 8\nvalue: 256', 3],
  ['bits', 'width: 4\nvalue: -9', 3], ['bits', 'width: 8\nvalue: 0\nop:\n  kind: rol', 5],
  ['bits', 'width: 8\nvalue: 0\nop: {kind: neg}\ngoals:\n  - when: phantom == 1\n    text: |\n      测试', 6],
  ['bits', 'width: 4\nvalue: 0\npauses: []', 4], ['text-encoding', 'text: |-\n  A中😀\ngoals: []', 4],
  ['float32', 'mode: inspect\nbits: -1', 3], ['float32', 'mode: inspect\nvalue: 1\npauses: []', 4],
  ['float32', 'mode: add\na: 1e39\nb: 0', 3], ['float32', 'mode: accumulate\ndelta: 1\ncount: 1001', 4],
  ['text-encoding', 'text: A中😀', 2],
])('不合法的 %s 参数定位到源文件', (name, body, line) => {
  expect(compile(String(name), String(body)).errors).toContainEqual(expect.objectContaining({ file: 'sample.md', line }));
});
it('小节实际收到规范化的数字和文字', () => {
  const parse = (name: string, body: string) => {
    const r = compile(name, body);
    expect(r.errors).toHaveLength(0);
    return JSON.stringify(r.root.children![0].data);
  };
  expect(parse('bits', 'width: 8\nvalue: "0b01111111"')).toEqual(parse('bits', 'width: 8\nvalue: 127'));
  expect(parse('text-encoding', 'text: |\n  A中😀')).toEqual(parse('text-encoding', 'text: |-\n  A中😀'));
});

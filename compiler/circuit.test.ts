import { expect, it } from 'vitest';
import { Diagnostics } from './diagnostics';
import { parseLessonMarkdown, transformBody } from './markdown';

function compile(yaml: string) {
  const source = ':::anim{component="logic-circuit"}\n' + yaml + '\n:::', root = parseLessonMarkdown(source), diags = new Diagnostics();
  transformBody(root, { file: 'c2.md', macros: {}, lineOffset: 0, diags, refs: { lessons: [], terms: [] }, sourceLines: source.split('\n') });
  return { errors: diags.errors, root };
}
const base = 'inputs: { A: 0 }\ngates:\n  - { id: N, type: not, in: [A] }\noutputs: { Y: N }';
const bad = (yaml: string, line: number, message: string) => {
  expect(compile(yaml).errors).toContainEqual(expect.objectContaining({ file: 'c2.md', line, message: expect.stringContaining(message) }));
};
it('门、引脚、输出、名称和条件的错误报在相应的 YAML 行', () => {
  bad(base.replace('[A]', '[other]'), 4, '不存在');
  bad(base.replace('Y: N', 'Y: missing'), 5, '不存在');
  bad(base.replace('not,', 'unknown,'), 4, '未知');
  for (const [type, ins] of [['not', 'A,A'], ['buffer', 'A,A'], ['and','A'], ['nor','A,A,A,A,A'], ['dff','A']])
    bad(base.replace('not, in: [A]', type + ', in: [' + ins + ']'), 4, '个数');
  bad(base.replace('id: N', 'id: A'), 4, '重复');
  for (const reserved of ['CLK', 'tick', 'stable', 'osc']) bad(base.replace('id: N', 'id: ' + reserved), 4, '保留');
  bad(base + '\ngoals:\n  - when: hidden == 1\n    text: |-\n      预测', 7, 'hidden');
  bad(base + '\nsliders: []', 6, 'sliders');
  bad(base.replace('Y: N', ''), 5, '至少连接');
});
it('子电路必须按定义顺序使用，检查递归、层数和扁平大小', () => {
  const module = (name: string, type: string) => '  ' + name + ':\n    inputs: [p]\n    gates: [{id: u, type: ' + type + ', in: [p]}]\n    outputs: {y: u' + (type === 'not' ? '' : '.y') + '}';
  const block = (defs: string[], type: string) => 'modules:\n' + defs.join('\n') + '\n' + base.replace('not,', type + ',').replace('Y: N', 'Y: N.y');
  bad(block([module('m', 'm')], 'm'), 5, '先定义');
  bad(block([module('a', 'b'), module('b', 'not')], 'a'), 5, '先定义');
  const defs = [module('m1', 'not'), module('m2', 'm1'), module('m3', 'm2')];
  expect(compile(block(defs, 'm3')).errors).toEqual([]);
  bad(block([...defs, module('m4','m3')], 'm4'), 17, '3 层');
  const large = 'modules:\n  m:\n    inputs: [p]\n    gates: [' + Array.from({length: 101}, (_,i) => '{id: n' + i + ', type: not, in: [p]}').join(',') + ']\n    outputs: {y: n0}\n';
  bad(large + 'inputs: {A: 0}\ngates:\n  - {id: x, type: m, in: [A]}\n  - {id: y, type: m, in: [A]}\noutputs: {Y: x.y}', 10, '200');
});
it('真值表只接组合电路、最多六个开关，顶层元件上限独立于展开数', () => {
  bad(base.replace('[A]', '[N]') + '\nshow: [truth-table]', 6, '真值表');
  bad(base.replace('not, in: [A]', 'dff, in: [A,A]') + '\nshow: [truth-table]', 6, '真值表');
  bad(base.replace('A: 0', 'A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0') + '\nshow: [truth-table]', 6, '真值表');
  bad(base.replace('A: 0', Array.from({length: 39}, (_,i) => 'A' + i + ': 0').join(', ')), 4, '40');
  bad(base + '\nprobes: [bad]', 6, '探针');
  const good = compile(base.replace('A: 0','A: "0b01"') + '\nclock: {every: "2^2"}\ninit: {N: "0"}');
  expect(good.errors).toEqual([]); expect(JSON.stringify(good.root)).toContain('dataImplemented');
});

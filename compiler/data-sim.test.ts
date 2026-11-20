import { expect, it } from 'vitest';
import { compileSimDemos } from './sim-demos';
import { Diagnostics } from './diagnostics';
import { parseLessonMarkdown, transformBody } from './markdown';

function compile(name: string, body: string) {
  const source = ':::anim{component="' + name + '"}\n' + body + '\n:::\n';
  const root = parseLessonMarkdown(source), diags = new Diagnostics();
  transformBody(root, { file: 'sample.md', lineOffset: 0, macros: {}, diags, refs: { lessons: [], terms: [] }, sourceLines: source.split('\n') });
  return { errors: diags.errors, root };
}
it.each([
  ...[
    ['structure: unknown',2], ['structure: stack\ngrowth: 1',3], ['structure: queue\ncapacity: 65',3],
    ['structure: stack\nregion: [2, 255]',3], ['structure: queue\nregion: [16, 18]',3], ['structure: linked-list\nregion: [1, 256]',3],
    ['structure: hash-open\nslots: 4',3], ['structure: hash-open\nslots: 101',3], ['structure: hash-open\nloadLimit: 1',3],
    ['structure: hash-open\nprobe: quadratic\nloadLimit: 0.51',4], ['structure: hash-chain\nloadLimit: 0',3], ['structure: stack\nprobe: double',3],
    ['structure: stack\nsliders: []',3], ['structure: stack\ngoals:\n  - when: oops == 0\n    text: |\n      目标',4],
  ].map(([body,line])=>['memory',body+'\nops: |\n  ',line]),
  ...['peek 3','push','push 256','popx','enqueue 4','push 1,,2','push '+Array(257).fill(1).join(' ')].map(op=>['memory','structure: stack\nops: |\n  push 1\n  '+op,5]),
  ...[['kind: missing',2],['kind: bst\nregion: [16, 20]\nkeys: [1, 2]',4],
    ['kind: max-heap\nkeys: [1,2]',3], ['kind: min-heap\nregion: [16, 17]',3],
    ['kind: bst\nview: [array]',3],['kind: avl\ncapacity: 1',3],['kind: bst\nsliders: []',3],
    ['kind: bst\ngoals:\n  - when: bogus > 1\n    text: |\n      查看',4]].map(([s,n])=>['tree',s+'\nops: |\n  insert 1',n]),
  ...[['keys: [abc9]',3],['keys: [abcdefghijklmnopq]',3],['region: [0, 15]',3],['region: [16, 19]\nkeys: [ab]',4],
    ['view: [array]',3],['degree: 2',3],['parent: []',3],['n: 8',3],['union: rank',3],['compress: true',3],
    ['goals:\n  - when: root == 0\n    text: |-\n      测试',4]].map(([s,n])=>['tree','kind: trie\n'+s+'\nops: |\n  find a',n]),
  ...['degree: 1','degree: 4','keys: [256]','keys: [-1]','region: [0, 255]','region: [16, 23]','n: 8','union: rank','compress: true','parent: [0]','view: [array]']
    .map(field=>['tree','kind: b-tree\n'+field+'\nops: |\n  find 1',3]),
  ['tree','kind: b-tree\nregion: [16, 33]\nkeys: [1,2,3,4]\nops: |\n  find 1',4],
  ['tree','kind: b-tree\nops: |\n  insert 256',4],
  ['tree','kind: b-tree\nops: |\n  find 1\ngoals:\n  - when: matches == 1\n    text: |-\n      测试',6],
  ...['n: 1','n: 33','parent: [1, 1]','parent: [8,1,2,3,4,5,6,7]','parent: [1,0,2,3,4,5,6,7]','keys: []','degree: 2','region: [3, 255]','region: [16, 30]']
    .map(field=>['tree','kind: union-find\n'+field+'\nops: |\n  find 1',3]),
  ...['find 8','union 0','connected 0','connected 0 1 2 3','union 3 8'].map(op=>['tree','kind: union-find\nops: |\n  '+op,4]),
  ['tree','kind: union-find\nops: |\n  find 1\npauses:\n  - when: nodes > 0\n    text: |-\n      测试',6],
  ['tree','kind: trie\nops: |\n  insert car\n  find 42',5],
  ['tree','kind: avl\nops: |\n  extract',4],['tree','kind: max-heap\nops: |\n  find 3',4],
  ...[0,255].map(k=>['memory','structure: hash-open\nops: |\n  insert '+k,4]),
  ['bits', 'width: 12\nvalue: 0', 2], ['bits', 'width: 8\nvalue: 256', 3],
  ['bits', 'width: 4\nvalue: -9', 3], ['bits', 'width: 8\nvalue: 0\nop:\n  kind: rol', 5],
  ['bits', 'width: 8\nvalue: 0\nop: {kind: neg}\ngoals:\n  - when: phantom == 1\n    text: |\n      测试', 6],
  ['bits', 'width: 4\nvalue: 0\npauses: []', 4], ['text-encoding', 'text: |-\n  A中😀\ngoals: []', 4],
  ['float32', 'mode: inspect\nbits: -1', 3], ['float32', 'mode: inspect\nvalue: 1\npauses: []', 4],
  ['float32', 'mode: add\na: 1e39\nb: 0', 3], ['float32', 'mode: accumulate\ndelta: 1\ncount: 1001', 4],
  ['text-encoding', 'text: A中😀', 2],
  ['float32', 'mode: accumulate\ndelta: 1\ncount: 3\nstart: 1e40', 5],
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

it.each([['bits', 'width: 8\nvalue: 0'], ['float32', 'mode: inspect\nvalue: 1'], ['text-encoding', 'text: |-\n  A'], ['cpu', '']])(
  '%s 的通用滑块会在 sliders 行得到明确诊断', (name, fields) => {
    const { errors } = compile(name, fields + '\nsliders: []');
    expect(errors).toContainEqual(expect.objectContaining({ message: expect.stringContaining('计算机组件暂不支持 sliders'), line: fields.split('\n').length + 2 }));
  });
it('所有计算机画廊内容演示通过小节规格，使用解析后的表达式、默认值与目标', () => {
  const demos = compileSimDemos();
  expect(demos[0].params).toMatchObject({ value: 127, editable: true, goals: [{ when: 'OF == 1' }] });
  expect(demos.find((d) => d.params.mode === 'inspect')?.params.bits).toBe(0x3dcccccd);
  expect(demos.filter((d) => d.params.mode === 'accumulate').map((d) => d.params.start)).toEqual([0, 16777216]);
  expect(demos.find((d) => d.name === 'text-encoding')?.params.show).toEqual(['utf8', 'utf16']);
});

it('字典树的 keys 和 ops 都先规范化，再按词拆开',()=>{
  const {root,errors}=compile('tree','kind: trie\nkeys: [ＣＡＲ]\nops: |\n  ＩＮＳＥＲＴ ＤＯＧ ＣＡＴ');
  expect(errors).toEqual([]);
  const params=JSON.parse((root.children![0].data as {hProperties:{dataParams:string}}).hProperties.dataParams);
  expect(params.keys).toEqual(['car']);expect(params.commands.map((op:{word:string})=>op.word)).toEqual(['dog','cat']);
});

it('各 kind 的专用字段和 array 视图在字段所在行检查',()=>{
  const kinds=['bst','avl','red-black','min-heap','max-heap','trie','union-find','b-tree'];
  const fields:Record<string,string>={degree:'2',n:'8',union:'rank',compress:'true',parent:'[0,1,2,3,4,5,6,7]'};
  for(const kind of kinds){
    for(const [field,value] of Object.entries(fields)){
      const allowed=field==='degree'?kind==='b-tree':kind==='union-find';
      const errors=compile('tree','kind: '+kind+'\n'+field+': '+value+'\nops: |-\n  ').errors;
      if(allowed)expect(errors).toEqual([]);
      else expect(errors).toContainEqual(expect.objectContaining({line:3}));
    }
    const errors=compile('tree','kind: '+kind+'\nview: [array]\nops: |-\n  ').errors;
    if(kind.endsWith('heap')||kind==='union-find')expect(errors).toEqual([]);
    else expect(errors).toContainEqual(expect.objectContaining({line:3}));
  }
});

it.each([
  ["algorithm: bad\ndata: [1,2]",2],
  ["algorithm: bubble",2],
  ["algorithm: selection\ndata: [1,2]\npreset: {kind: sorted,n: 2}",4],
  ["algorithm: merge\ndata: [0,100]",3],
  ["algorithm: merge\ndata: [3]",3],
  ["algorithm: merge\npreset: {kind: wrong, n: 8}",3],
  ["algorithm: merge\npreset: {kind: random, n: 33}",3],
  ["algorithm: merge\npreset: {kind: few-unique, n: 8}",3],
  ["algorithm: bubble\ndata: [1,2]\nrace: [xx]",4],
  ["algorithm: bubble\ndata: [1,2]\nrace: [merge, insertion, heap]",4],
  ["algorithm: bubble\ndata: [1,2]\npivot: last",4],
  ["algorithm: bubble\ndata: [1,2]\nsliders: []",4],
  ["algorithm: quick\ndata: [1,2]\npivot: random",4],
  ["algorithm: quick\ndata: [1,2]\ngoals:\n  - when: odd > 1\n    text: |-\n      测试",5],
])("sort 的坏参数定位到源行", (body,line)=>{
  expect(compile("sort",String(body)).errors).toContainEqual(expect.objectContaining({line}));
});

it.each([
  ["map: |\n  S.\nruns: [{algorithm: bfs}]",3],
  ["map: |\n  S........................................\n  .G\nruns: [{algorithm: bfs}]",3],
  ["map: |\n  S.\n  ..\nruns: [{algorithm: bfs}]",3],
  ["map: |\n  SS\n  .G\nruns: [{algorithm: bfs}]",3],
  ["map: |\n  S.\n  .G\n  ..\n  .G\nruns: [{algorithm: bfs}]",3],
  ["map: |\n  S.\n  ..G\nruns: [{algorithm: bfs}]",4],
  ["map: |\n  S.\n  xG\nruns: [{algorithm: bfs}]",4],
  ["map: |\n  S.\n  .G\nruns: [{algorithm: bfs}]\ncosts: {\".\": 2}",6],
  ["map: |\n  S.\n  .G\nruns: [{algorithm: bfs}]\ncosts: {\"~\": 10}",6],
  ["map: |\n  S.\n  .G\nruns: [{algorithm: bfs}]\nmoves: 7",6],
  ["map: |\n  S.\n  .G\nruns: [{algorithm: bfs}]\nsliders: []",6],
  ["map: |\n  S.\n  .G\nruns: []",5],
  ["map: |\n  S.\n  .G\nruns: [{algorithm: bfs},{algorithm: dfs},{algorithm: astar}]",5],
  ["map: |\n  S.\n  .G\nruns: [{algorithm: other}]",5],
  ["map: |\n  S.\n  .G\nruns: [{algorithm: dfs, heuristic: zero}]",5],
  ["map: |\n  S.\n  .G\nruns: [{algorithm: bfs, weight: 2}]",5],
  ["map: |\n  S.\n  .G\nruns: [{algorithm: astar, weight: 11}]",5],
  ["map: |\n  S.\n  .G\nruns: [{algorithm: greedy, heuristic: unknown}]",5],
  ["map: |\n  S.\n  .G\nruns: [{algorithm: dfs}]\npauses:\n  - when: moves > 0\n    text: |-\n      观察",7],
])("grid-search 的坏参数定位到源行", (body,line)=>{
  expect(compile("grid-search",String(body)).errors).toContainEqual(expect.objectContaining({line}));
});

import { expect,it } from 'vitest';
import { Diagnostics } from './diagnostics';
import { parseLessonMarkdown,transformBody } from './markdown';

function errors(name:string,yaml:string) {
  const source=':::anim{component="'+name+'"}\n'+yaml+'\n:::', root=parseLessonMarkdown(source), diags=new Diagnostics();
  transformBody(root,{file:'c4.md',macros:{},lineOffset:0,diags,refs:{lessons:[],terms:[]},sourceLines:source.split('\n')});
  return diags.errors;
}
const base='blockSize: 4\nsets: 4\nways: 1\naccesses: [0]';
it('缓存配置、访问、对照、条件和滑块定位到 YAML 行',()=>{
  for(const [yaml,line] of [
    [base.replace('blockSize: 4','blockSize: 3'),2],[base.replace('sets: 4','sets: 128'),3],
    [base.replace('ways: 1','ways: 9'),4],[base.replace('sets: 4','sets: 64').replace('ways: 1','ways: 2'),4],
    [base.replace('[0]','[256]'),5],[base.replace('[0]','[w-1]'),5],[base+'\nreplace: random',6],
    [base+'\ncompare: {ways: 3}',6],[base.replace('accesses: [0]','pattern: {kind: matrix, base: 240, rows: 8, cols: 8, order: row}'),5],
    [base+'\nsliders: []',6],[base+'\npauses:\n  - when: other == 1\n    text: |-\n      预测',7],
  ] as const) expect(errors('cache',yaml)).toContainEqual(expect.objectContaining({file:'c4.md',line}));
});

it('处理器配置与实际可观测量',()=>{
  const source='program: |\n  HLT\n';
  for(const [options,line] of [['cache: {blockSize: 3, sets: 4, ways: 1}',4],['fetch: through-cache',4],
    ['view: [cache]',4],['goals:\n  - when: hits > 0\n    text: |-\n      观察',5]] as const)
    expect(errors('cpu',source+options)).toContainEqual(expect.objectContaining({line}));
  expect(errors('cpu',source+'cache: {blockSize: 4, sets: 4, ways: 1}\ngoals:\n  - when: misses > 0\n    text: |-\n      观察')).toEqual([]);
});

it('流水线子集定位到汇编源行，拒绝未开放的观测量和滑块',()=>{
  for(const word of ['PUSH R0','POP R0','CALL 0','RET'])
    expect(errors('pipeline','program: |\n  NOP\n  '+word+'\n  HLT')).toContainEqual(expect.objectContaining({line:4,message:expect.stringContaining('只开放')}));
  expect(errors('pipeline','program: |\n  HLT\nsliders: []')).toContainEqual(expect.objectContaining({line:4}));
  expect(errors('pipeline','program: |\n  HLT\ngoals:\n  - when: PC == 0\n    text: |-\n      目标')).toContainEqual(expect.objectContaining({line:5}));
});

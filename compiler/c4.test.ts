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
    [base+'\nsliders: []',6],[base+'\npauses:\n  - when: other == 1\n    text: 预测',7],
  ] as const) expect(errors('cache',yaml)).toContainEqual(expect.objectContaining({file:'c4.md',line}));
});

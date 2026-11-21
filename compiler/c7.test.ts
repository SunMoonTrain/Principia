import { expect, it } from 'vitest';
import { Diagnostics } from './diagnostics';
import { parseLessonMarkdown, transformBody } from './markdown';

function diagnostics(component: string, yaml: string) {
  const source = ':::anim{component="'+component+'"}\n'+yaml+'\n:::';
  const root=parseLessonMarkdown(source), diags=new Diagnostics();
  transformBody(root,{file:'c7.md',lineOffset:0,macros:{},diags,refs:{lessons:[],terms:[]},sourceLines:source.split('\n')});
  return diags.errors;
}
function rejects(component:string, yaml:string, line:number) {
  expect(diagnostics(component,yaml),yaml).toContainEqual(expect.objectContaining({file:'c7.md',line}));
}
it('scheduler 的作业行、算法专用字段与条件定位到源行',()=>{
  const base='jobs: |\n  A 0 2\n  B 1 2\nruns: [{algorithm: rr}]';
  expect(diagnostics('scheduler',base)).toEqual([]);
  for(const s of ['A 1 2','longname 1 2','B -1 2','B 51 2','B 1 0','B 1 31','B 1 2+3','B 1 1+2+1+2+1+2+1+2+1+2+1','B 1 2 10'])
    rejects('scheduler',base.replace('B 1 2',s),4);
  rejects('scheduler',base.replace('B 1 2','B 1 2 0').replace('rr','priority'),3);
  for(const runs of ['[]','[{algorithm: sjf}, {algorithm: sjf}, {algorithm: rr}]','[{algorithm: unknown}]',
    '[{algorithm: sjf, quantum: 1}]','[{algorithm: rr, preemptive: false}]','[{algorithm: rr, quanta: [1,2]}]',
    '[{algorithm: rr, allotments: [1,2]}]','[{algorithm: rr, boost: 4}]','[{algorithm: mlfq, quanta: [1]}]',
    '[{algorithm: mlfq, allotments: [1,2]}]','[{algorithm: mlfq, allotments: [1,4,8]}]'])
    rejects('scheduler',base.replace('[{algorithm: rr}]',runs),5);
  rejects('scheduler',base+'\nsliders: []',6);
  rejects('scheduler',base+'\ngoals:\n  - when: invalid == 1\n    text: |\n      比较',7);
});

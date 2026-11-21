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
it('threads 校验声明、程序、逐行指令及调度',()=>{
  const base='shared: {x: 0}\nthreads:\n  A: |\n    set r0, 1\n    store x, r0\nschedule: rr';
  for(const bad of ['unknown r0','set r4, 1','load r0, y','lock m','wait s','bne r0, 0, X'])
    rejects('threads',base.replace('store x, r0',bad),6);
  rejects('threads',base.replace('set r0, 1','L: set r0, 1').replace('store x, r0','L: jmp L'),6);
  rejects('threads',base.replace('store x, r0',Array(24).fill('set r0, 1').join('\n    ')),29);
  rejects('threads',base.replace('  A: |\n    set r0, 1\n    store x, r0','  A: "set r0, 1"'),4);
  rejects('threads',base.replace('schedule: rr','schedule: [A, B]'),7);
  rejects('threads',base.replace('schedule: rr','schedule: random\nseed: 4\nquantum: 2'),9);
  rejects('threads',base+'\nseed: 0',8);
  rejects('threads',base.replace('{x: 0}','{step: 0}'),2);
  rejects('threads',base+'\nsemaphores: {x: 1}',8);
  rejects('threads',base+'\nsliders: []',8);
  rejects('threads',base+'\ngoals:\n  - when: other == 1\n    text: |\n      观察',9);
  rejects('threads','shared: {}\nthreads:\n  2: |\n    set r4, 0\nschedule: rr',5);
  rejects('threads','shared: {}\nthreads:\n'+['A','B','C','D'].map(k=>'  '+k+': |\n    set r0, 1').join('\n')+'\nschedule: rr',4);
  expect(diagnostics('threads',base.replace('  A: |\n    set r0, 1\n    store x, r0','  {}'))).not.toEqual([]);
});

it('page-table 位域、越界、重复页、访问行、TLB 和条件',()=>{
  const base='vaBits: 8\npaBits: 8\npageSize: 16\ntlb: 2\ntable: |\n  6 3\n  7 9\naccesses: |\n  R 100\n  W 128';
  expect(diagnostics('page-table',base)).toEqual([]);
  for(const line of ['6 0','16 1','7 16','7 9 w','bad'])rejects('page-table',base.replace('7 9',line),8);
  for(const line of ['X 1','R 256','R -1','R 0xgg','flush 1'])rejects('page-table',base.replace('W 128',line),11);
  for(const extra of ['dirBits: 2','sliders: []'])rejects('page-table',base+'\n'+extra,12);
  rejects('page-table',base+'\nlevels: 2\ndirBits: 4',13);
  rejects('page-table',base.replace('tlb: 2','tlb: 0')+'\ntlbPolicy: fifo',12);
  for(const [a,b,line] of [['vaBits: 8','vaBits: 3',2],['pageSize: 16','pageSize: 7',4],['vaBits: 8','vaBits: 16',4],['paBits: 8','paBits: 16',4]] as const)
    rejects('page-table',base.replace(a,b),line);
  rejects('page-table',base+'\ngoals:\n  - when: other == 1\n    text: |\n      翻译',13);
});

it('page-replacement 引用、算法、帧数、配置数和通用条件',()=>{
  const base='refs: [0, 2, 1]\nruns: [{algorithm: clock, frames: 3}]';
  expect(diagnostics('page-replacement',base)).toEqual([]);
  for(const refs of ['[100]','[-1]','[]','['+Array(41).fill(5).join(',')+']'])rejects('page-replacement',base.replace('[0, 2, 1]',refs),2);
  for(const runs of ['[]','[{algorithm: fifo, frames: 0}]','[{algorithm: lru, frames: 9}]','[{algorithm: bad, frames: 2}]','['+Array(3).fill('{algorithm: opt, frames: 2}').join(',')+']'])
    rejects('page-replacement',base.replace('[{algorithm: clock, frames: 3}]',runs),3);
  rejects('page-replacement',base+'\nsliders: []',4);
  rejects('page-replacement',base+'\ngoals:\n  - when: other == 1\n    text: |\n      引用',5);
});

it('filesystem 配置、路径及操作错误定位到对应行',()=>{
  const base='inodes: 8\nblocks: 16\ndirect: 4\nindirect: 4\nentries: 4\nops: |\n  touch /x\n  read /x';
  for(const [field,value] of [['inodes','3'],['blocks','65'],['direct','0'],['indirect','17'],['entries','2']] as const)
    rejects('filesystem',base.replace(new RegExp(field+': \\d+'),field+': '+value),['inodes','blocks','direct','indirect','entries'].indexOf(field)+2);
  for(const op of ['bad /x','read relative','read /a/../b','mkdir /a/b/c/d/e','touch /Upper','rm /toolong12','write /x 0','write /x 21','ln /x y'])
    rejects('filesystem',base.replace('read /x',op),9);
  rejects('filesystem',base+'\nsliders: []',10);
  rejects('filesystem',base+'\ngoals:\n  - when: other == 1\n    text: |\n      检查',11);
  expect(diagnostics('filesystem',base.replace('read /x','read /absent'))).toEqual([]);
});

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

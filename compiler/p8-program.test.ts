import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { expect, it } from 'vitest';
import { compileContent } from './compile';
import { compileProgramDemo } from './sim-demos';
import { Diagnostics } from './diagnostics';
import { processProblems } from './problems';
import { AnswerSchema } from './schema';
import { gradeProgram } from '../packages/sim/src/core/p8-program';
import type { ProgramAnswer } from '../shared/content-types';
import { exportStatements } from '../tools/statements/lib';
import { runVerification } from '../tools/verify/lib';

const root = path.resolve('compiler','fixtures','c3'), id = 'cs.processor.demo';
const file = path.join(root,'content','cs','processor','demo','problems.yaml');
const raw = fs.readFileSync(file,'utf8');
const program = 'IN R0\nIN R1\nADD R0, R1\nOUT R0\nHLT';
const sample = compileProgramDemo(process.cwd()).answer as ProgramAnswer;
function results(source: string, maxCycles = 1000) {
  const result = gradeProgram(source,{...sample,maxCycles});
  if ('error' in result) throw Error(result.error.message);
  return result.results;
}
it('每个用例独立开机；错误、输出、周期上限的两端', () => {
  expect(results(program,5)).toEqual([7,127].map(n=>({actual:[n],cycles:5,passed:true,reason:''})));
  expect(results(program.replace('ADD','SUB')).map(r=>[r.actual,r.passed])).toEqual([[[255],false],[[73],false]]);
  expect(results('loop: JMP loop').map(r=>r.reason)).toEqual(Array(2).fill('1000 个周期内没有停机'));
  expect(results('IN R0\nIN R0\nIN R0')[0]).toMatchObject({cycles:2,passed:false,reason:'输入已经读完'});
  expect(results('PUSH R0\nHLT',4)[0]).toMatchObject({cycles:4,passed:false,actual:[]});
  expect(results(program,4)[0]).toMatchObject({cycles:4,passed:false});
  expect(gradeProgram('NOP\nBAD',sample)).toMatchObject({error:{line:2}});
  expect(gradeProgram(program,{...sample,isa:['IN','HLT']})).toMatchObject({error:{line:3}});
});
it('每条程序题约束定位到夹具里的 YAML 或代码行', () => {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'p8-questions-'));
  try {
    const check=(from:string,to:string,marker:string) => {
      const source=raw.replace(from,to), local=path.join(dir,'problems.yaml'), diags=new Diagnostics();
      fs.writeFileSync(local,source);
      processProblems(local,'problems.yaml',{diags,refs:{lessons:[],terms:[]},macros:{}});
      const line=source.split('\n').findIndex(s=>s.includes(marker))+1;
      expect(diags.errors,marker).toContainEqual(expect.objectContaining({file:'problems.yaml',line}));
    };
    check('out: [127]', 'out: [126]', '    IN R0');
    check('; 在这里写程序','MUL R0, 1','MUL');
    check('; 在这里写程序', 'IN R0\n      IN R1\n      ADD R0, R1\n      OUT R0','starter:');
    check('out: [127]','out: [256]','out: [256]');
    check('language: p8asm','language: python','language: python');
    check('maxCycles: 1000','maxCycles: 100001','maxCycles: 100001');
    check('maxCycles: 1000','isa: [IN, OUT, HLT]','    ADD R0, R1');

  } finally { fs.rmSync(dir,{recursive:true,force:true}); }
});
it('程序题 schema 的个数、范围与默认值', () => {
  const minimal={type:'program',language:'p8asm',starter:'HLT',tests:[{out:['0xFF','0b10',-1]}]};
  expect(AnswerSchema.parse(minimal)).toMatchObject({maxCycles:10000,tests:[{in:[],out:[255,2,255]}]});
  for (const changes of [{tests:[]},{tests:Array(21).fill({out:[]})},{tests:[{in:Array(257).fill(0),out:[]}]},
    {tests:[{out:[-129]}]},{tests:[{out:[1.2]}]},{maxCycles:0},{isa:['MUL']}])
    expect(AnswerSchema.safeParse({...minimal,...changes}).success).toBe(false);
});
it('夹具完整编译，编译后的画廊卡片相同，题干和独立验算逐例对照', () => {
  const compiled=compileContent(root);
  expect(compiled.report.errors).toEqual([]);
  expect(compiled.packs!.get('cs.processor')!.lessons[id].problems[2]).toEqual(compileProgramDemo(process.cwd()));
  const out=exportStatements(root,{scopes:[id],tiers:['medium']});
  expect(out.failures).toEqual([]);
  for (const word of ['用 IN 读两个数','起始代码','; 在这里写程序','输入 [3, 4]，期望输出 [7]','输入 [100, 27]，期望输出 [127]','周期上限 1000','全部 P8 指令'])
    expect(out.text).toContain(word);
  expect(out.text).not.toContain('ADD R0, R1');
  const verify=(offset:number)=>runVerification({lesson:id,notes:{p3:'分别把输入相加'},compute:()=>({
    p3:{type:'program',value:[[3,4],[100,27]].map(([a,b])=>[a+b+offset])}
  })},root);
  expect(verify(0)).toBe(true); expect(verify(1)).toBe(false);
});

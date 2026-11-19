import { expect, it } from 'vitest';
import { Diagnostics } from './diagnostics';
import { parseLessonMarkdown, transformBody, renderField } from './markdown';
import { parseYaml, textAt } from './yaml-text';

it('正文和 YAML 题干、提示、解答的汇编错误都定位到实际文件行', () => {
  const fence = '```p8asm\nNOP\nMUL R0,R1\n```';
  for (const language of ['p8asm','text']) {
    const diags=new Diagnostics(), source='## 讲解\n\n'+fence.replace('p8asm',language);
    const ctx={diags,file:'lesson.md',macros:{},refs:{lessons:[],terms:[]}};
    transformBody(parseLessonMarkdown(source),{...ctx,lineOffset:0});
    expect(diags.errors.map(e=>e.line)).toEqual(language==='text'?[]:[5]);
  }
  for (const key of ['statement','hints','solution']) {
    const diags=new Diagnostics(), file='problems.yaml', source='\n'+key+': |\n  提示\n\n'+fence.split('\n').map(l=>'  '+l).join('\n');
    const y=parseYaml(source,file,0,diags)!;
    renderField(textAt(y,[key],diags)!,{diags,file,macros:{},refs:{lessons:[],terms:[]}},'rich');
    expect(diags.errors).toContainEqual(expect.objectContaining({file,line:7}));
  }
});

it('同时有未定义的标号和后续语法错误，围栏诊断指向前一处的文件行', () => {
  const source = 'solution: |\n  计算过程\n\n  ```p8asm\n  JMP missing\n  NOP\n  MUL R0, R1\n  ```';
  const diags = new Diagnostics(), file = 'problems.yaml';
  const yaml = parseYaml(source,file,0,diags)!;
  renderField(textAt(yaml,['solution'],diags)!, {file,diags,macros:{},refs:{lessons:[],terms:[]}},'rich');
  expect(diags.errors).toEqual([expect.objectContaining({file,line:5,message:expect.stringContaining('missing')})]);
});

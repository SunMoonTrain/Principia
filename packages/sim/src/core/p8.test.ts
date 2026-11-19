import { expect, it } from 'vitest';
import { assemble, AssemblyError, decode, disassemble } from './p8-asm';
import { History } from './machine';
import { p8Machine as cpu, runCpu } from './p8';

const a1 = 'LDI R0, 10\nLDI R1, 0\nloop: ADD R1, R0\nSUB R0, 1\nJNZ loop\nOUT R1\nHLT';
const a2 = 'LDI R0, 7\nPUSH R0\nLDI R0, 9\nPOP R1\nHLT';
const a3 = 'LDI R0, 21\nCALL double\nOUT R0\nHLT\ndouble: ADD R0, R0\nRET';
const boot = (source: string) => ({image:assemble(source),input:[]});
const history = (source: string) => new History(cpu,boot(source),0);
it('编码的合法域、反汇编与汇编一一对应', () => {
  let legal=0;
  const names=new Set<string>();
  for (let a=0;a<256;a++) for (let b=0;b<256;b++) {
    const i=decode(a,b);
    if (typeof i==='string') continue;
    legal++; names.add(i.name);
    expect(assemble(disassemble(a,b)).bytes.slice(0,2)).toEqual([a,b]);
  }
  expect([legal,names.size]).toEqual([11435,27]);
  for (const [a,b] of [[8,0],[0,5],[65,4]]) expect(disassemble(a,b)).toMatch(/^\.byte/);
  const s=runCpu(boot('NOP\n.byte 0x41, 0x04'),100);
  expect(s).toMatchObject({halted:true,steps:1,cycles:1,error:expect.stringContaining('0–3')});
});
it('A1 的编码、34 条指令、136 个微步和指令边界一致', () => {
  const image=assemble(a1);
  expect(image.bytes.slice(0,14)).toEqual([20,10,21,0,65,0,100,1,168,4,229,0,0,0]);
  expect(image.labels.get('loop')).toBe(4);
  for (const grain of ['微步','一条指令']) {
    const h=history(a1), breaks:number[]=[], stops:number[]=[];
    let pause=0;
    while(!h.done && h.index<137) {
      h.step(grain);
      if (h.state.phase===0 && h.state.pc===4) { breaks.push(h.state.registers[1]); stops.push(h.state.steps); }
      if (h.state.phase===0 && h.state.pc===10) { pause=h.state.steps; expect(h.state.registers[1]).toBe(55); }
    }
    expect(stops).toEqual([2,5,8,11,14,17,20,23,26,29]);
    expect(breaks).toEqual([0,10,19,27,34,40,45,49,52,54]);
    expect(pause).toBe(32); expect(h.index).toBe(grain==='微步'?136:34);
    expect(h.state).toMatchObject({steps:34,cycles:34,output:[55],flags:{Z:1,N:0,C:0,V:0}});
  }
  const h=history(a1);
  for (const word of ['M[0x00] = 0x14','000101 是 LDI','要写入的值是 10','R0 ← 10']) {
    h.step('微步'); expect(h.events[0].text).toContain(word);
  }
  h.seek(1); expect(()=>h.edit({key:'R1',value:1})).toThrow();
  h.step('一条指令');expect(h.state.steps).toBe(1);
  h.edit({key:'R1',value:99}); expect(h.end).toBe(h.index);
  expect(h.state.registers[1]).toBe(99); h.step('一条指令'); expect(h.state.registers[1]).toBe(0);
  h.edit({key:'memory',address:4,value:0x45}); h.seek(35,'一条指令');expect(h.state.output).toEqual([201]);
});
it('A2、A3 的访存周期、压栈、返回与写回', () => {
  const h=history(a2), costs=[];
  for(let i=0;i<5;i++){h.step();costs.push(h.state.lastCycles);}
  expect(costs).toEqual([1,11,1,11,1]);expect(h.state).toMatchObject({cycles:25,sp:255,registers:[9,7,0,0]});expect(h.state.memory[255]).toBe(7);
  const c=history(a3);c.seek(2);expect(c.state).toMatchObject({pc:8,sp:254,returns:[255]});expect(c.state.memory[255]).toBe(4);
  c.seek(4);expect(c.state).toMatchObject({pc:4,sp:255,returns:[]});c.seek(6);expect(c.state).toMatchObject({cycles:26,output:[42],steps:6});
});
it.each([
  [127,'ADD R0, 1',128,0,1,0,1],[255,'ADD R0, 1',0,1,0,1,0],
  [0,'SUB R0, 1',255,0,1,1,0],[128,'SUB R0, 1',127,0,0,0,1],
  [129,'SHL R0',2,0,0,1,0],[1,'SHR R0',0,1,0,1,0],[3,'CMP R0, 5',3,0,1,1,0],
] as const)('运算 %i / %s 的结果及标志', (v,op,r,Z,N,C,V)=>{
  const s=runCpu(boot('LDI R0, '+v+'\n'+op+'\nLDI R1, 16\nHLT'),8);
  expect(s.registers[0]).toBe(r);expect(s.flags).toEqual({Z,N,C,V});
});
it('栈和统一内存、输出上限、PC 回绕',()=>{
  const h=history('loop: PUSH R0\nJMP loop');
  h.seek(503);expect(h.state.sp).toBe(3);h.seek(505);expect(h.events[0].text).toContain('栈进入了程序区');expect(h.state.memory[3]).toBe(0);
  h.seek(507);expect(h.state.memory[2]).toBe(0);h.step();expect(h.state).toMatchObject({steps:508,cycles:3048,halted:true});
  const out=runCpu(boot('loop: OUT R0\nJMP loop'),9999);
  expect(out.output).toHaveLength(256);expect(out).toMatchObject({steps:512,cycles:512,error:'输出超过 256 个'});
  const wrap=history('.byte 42\n.org 255\n.byte 20');wrap.edit({key:'PC',value:255});wrap.step();expect(wrap.state.registers[0]).toBe(42);expect(wrap.state.pc).toBe(1);
});
it('汇编错误带行、重叠指出两行，标号前向引用和标点字符可用',()=>{
  for(const bad of ['MUL R0,R1','LDI R0,R1','LDI R0,256','ADD R0,-129','SHL R4','ADD R0','JMP missing','ADD: HLT','label: HLT']) {
    try {assemble('label: NOP\n'+bad);throw Error('没有报错');}catch(e){expect(e).toBeInstanceOf(AssemblyError);expect((e as AssemblyError).line).toBe(2);}
  }
  expect(()=>assemble('.zero 255\nHLT')).toThrow(/256/);
  expect(()=>assemble('NOP\n.org 1\n.byte 0')).toThrow(/第 1 行重叠/);
  expect(assemble("LDI r0, arr\narr:\n.byte ';', ',', 'A', -1").bytes.slice(0,6)).toEqual([20,2,59,44,65,255]);
  expect(()=>assemble('SUB R0,1',['LDI','ADD','OUT','HLT'])).toThrow(/只开放/);
});

it('布局指令也能用可确定的前向地址，位置相互依赖时报出源行', () => {
  const image = assemble('.org origin\n.byte 42\n.zero count\n.org 4\ncount:\n.org 128\norigin:');
  expect(image.bytes[128]).toBe(42);
  expect(image.owners.slice(129,133)).toEqual([3,3,3,3]);
  expect(() => assemble('.org tail\nNOP\ntail:')).toThrow(/循环依赖/);
});

it('访存和周期出现在对应微步，写回才改变输出、寄存器和栈', () => {
  const h=history('LDI R0, 7\nPUSH R0\nPOP R1\nOUT R1\nHLT');
  const go=(n:number)=>{h.seek(n,'微步'); return h.state;};
  expect(go(7)).toMatchObject({sp:255,steps:1,cycles:2});
  expect(h.state.memory[255]).toBe(0);
  expect(go(8)).toMatchObject({sp:254,steps:2,cycles:12});
  expect(h.state.memory[255]).toBe(7);
  expect(go(11)).toMatchObject({sp:254,registers:[7,0,0,0],steps:2,cycles:23});
  expect(h.events[0].touched).toEqual(['M255']);
  expect(go(12)).toMatchObject({sp:255,registers:[7,7,0,0],steps:3,cycles:23});
  expect(go(15).output).toEqual([]); expect(go(16).output).toEqual([7]);
  expect(go(19).halted).toBe(false); expect(go(20).halted).toBe(true);
});

it.each([
  ['JMP nowhere\nNOP\nMUL R0, R1',1,'未定义'],
  ['LDI R0, 300\nNOP\nMOV R0, 5',1,'255'],
  ['.byte 1, -129\n.org missing',1,'-128'],
  ['LD R0, [missing]\n.org 0\nHLT',1,'未定义'],
  ['JMP valid\nMOV R4, R0\nvalid: HLT',2,'寄存器'],
  ['.org here\nMUL R0, R0\n.org 10\nhere:\n.byte 1,',2,'助记符'],
  ['JMP target\n.org nowhere\ntarget: HLT',2,'未定义'],
  ['JMP target\n.org target\ntarget: HLT',2,'循环依赖'],
  ['JMP end\n.zero 254\nend:\nBAD',1,'255'],
] as const)('多个错误时按源码顺序诊断 %s', (source,line,message) => {
  expect(() => assemble(source)).toThrowError(expect.objectContaining({line,message:expect.stringContaining(message)}));
});

it('微步的读写随历史回放，整条指令保留所有阶段的读写', () => {
  const h = history(a1);
  const touched = (kind:'read'|'write') => h.events.filter(e => e.kind===kind).flatMap(e => e.touched ?? []);
  h.seek(8,'微步');
  h.step('微步'); expect(touched('write')).toEqual(['PC','IR']);
  h.step('微步'); expect(touched('read')).toEqual(['IR','R1','R0']);
  h.step('微步'); expect(touched('write')).toEqual(['cycles']);
  h.step('微步'); expect(touched('write')).toEqual(expect.arrayContaining(['R1','Z','N','C','V','steps','lastCycles']));
  h.seek(10); expect(touched('read')).toContain('R0'); expect(touched('write')).toEqual([]);
  h.seek(8); h.step(); expect(touched('read')).toContain('R0'); expect(touched('write')).not.toContain('R0');
  expect(touched('write')).toEqual(expect.arrayContaining(['R1','PC','Z','N','C','V','cycles','steps']));
  const stack = history(a2); stack.seek(2);
  expect(stack.events.filter(e => e.kind==='write').flatMap(e=>e.touched)).toEqual(expect.arrayContaining(['SP','M255']));
  expect(stack.events.filter(e => e.kind==='read').flatMap(e=>e.touched)).toEqual(expect.arrayContaining(['R0','SP']));
});

it('改写内存后按实际指令检查 ISA，出错时仍能回看修改', () => {
  const h = new History(cpu,{...boot('NOP\nHLT'),isa:['NOP','HLT']},0);
  h.edit({key:'memory',address:0,value:0x44},['M0']);
  h.step('微步');
  h.step('微步');
  expect(h.state).toMatchObject({halted:true,cycles:0,steps:0,error:expect.stringContaining('只开放 NOP、HLT')});
  h.seek(0);
  expect(h.events[0]).toMatchObject({kind:'write',touched:['M0']});
});

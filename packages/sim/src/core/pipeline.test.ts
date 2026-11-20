import { expect,it } from 'vitest';
import { assemble } from './p8-asm';
import { runCpu } from './p8';
import { pipelineMachine as pipe,type PipeBoot,type Tick } from './pipeline';
import { mulberry32 } from './rng';

function play(program:string,forwarding=true,branch:PipeBoot['branch']='predict-not-taken',input:number[]=[]) {
  const boot={image:assemble(program),input,forwarding,branch};
  let s=pipe.init(boot,0);
  const ticks:Tick[]=[];
  for(let i=0;i<1000;i++) {
    const next=pipe.step(s);s=next.state;ticks.push(s.tick!);if(next.done)break;
  }
  return {...s,ticks};
}
it('ADD 与 LD 的相邻依赖，精确到 WB、停顿、气泡和转发来源',()=>{
  for(const load of [false,true]) for(const fwd of [false,true]){
    const r=play((load?'LD R1, [128]':'ADD R1, R2')+'\nADD R3, R1\nHLT',fwd);
    const stall=fwd?Number(load):2;
    expect([r.stalls,r.cycle,r.retired]).toEqual([stall,7+stall,3]);
    expect(r.ticks.find(t=>t.marks.some(m=>m.id===2 && m.stage==='WB'))?.cycle).toBe(6+stall);
    expect(r.ticks.filter(t=>t.bubble)).toHaveLength(stall);
    expect(r.ticks.filter(t=>t.marks.some(m=>m.id===2 && m.stage==='ID' && m.held))).toHaveLength(stall);
    const arrows=r.ticks.flatMap(t=>t.arrows);
    expect(arrows).toEqual(fwd?[{from:1,to:2,stage:load?'MEM':'EX',operand:'R1',cycle:load?4:3}]:[]);
  }
});
it('跳与不跳，冲掉的指令没有架构效果，错路 HLT 后恢复取指',()=>{
  const jump='LDI R0, 1\nJMP skip\nLDI R1, 5\nLDI R2, 6\nskip: LDI R3, 7\nHLT';
  for(const b of ['stall','predict-not-taken'] as const) {
    const r=play(jump,true,b);
    expect([r.cycle,r.flushed,r.committed.registers]).toEqual([10,b==='stall'?0:2,[1,0,0,7]]);
    expect(r.ticks.flatMap(t=>t.marks.filter(m=>m.flushed).map(m=>m.stage))).toEqual(b==='stall'?[]:['IF','ID']);
    expect(play('LDI R0, 1\nSUB R0, 0\nJZ skip\nLDI R1, 5\nskip: HLT',true,b).cycle).toBe(b==='stall'?11:9);
  }
  expect(play('JMP dest\nHLT\ndest: OUT R0\nHLT').committed.output).toEqual([0]);
  const flag='LDI R0, 2\nSUB R0, 1\nJNZ end\nNOP\nend: HLT';
  for(const f of [false,true]){
    const r=play(flag,f);expect([r.stalls,r.flushed,r.cycle]).toEqual([f?0:4,2,f?10:14]);
    if(!f) for(const id of [2,3]) expect(r.ticks.filter(t=>t.marks.some(m=>m.id===id && m.stage==='ID' && m.held))).toHaveLength(2);
  }
});
it('A1 四种设置，WB 前寄存器和标志保持',()=>{
  const a1='LDI R0, 10\nLDI R1, 0\nloop: ADD R1, R0\nSUB R0, 1\nJNZ loop\nOUT R1\nHLT';
  for(const [f,b,cycle] of [[true,'predict-not-taken',56],[true,'stall',58],[false,'predict-not-taken',78],[false,'stall',80]] as const) {
    const r=play(a1,f,b);expect([r.cycle,r.retired,r.stalls,r.flushed,r.committed.output]).toEqual([cycle,34,f?0:22,b==='stall'?0:18,[55]]);
  }
  let s=pipe.init({image:assemble('LDI R0, 128\nSUB R0, 1\nHLT'),input:[],forwarding:true,branch:'stall'},0);
  for(let i=1;i<=6;i++){s=pipe.step(s).state;expect(s.committed.registers[0]).toBe(i<5?0:i===5?128:127);expect(s.committed.flags.V).toBe(Number(i===6));}
});
it('截止拍、动态非法指令、自修改、推测的内存与 IO',()=>{
  const timeout=play('loop: JMP loop');expect(timeout).toMatchObject({cycle:1000,halted:false,error:'1000 拍内没有停机'});
  expect(play('.byte 0xC0,0').error).toContain('只开放');
  expect(play('JMP dest\nIN R0\nST R0, [128]\ndest: IN R1\nOUT R1\nHLT',true,'predict-not-taken',[9]).committed.output).toEqual([9]);
  const changed=play('LDI R0, 0\nST R0, [next]\nnext: OUT R0\nHLT');
  expect([changed.retired,changed.committed.output]).toEqual([3,[]]);
});
it('随机可停机程序四种排程与顺序 P8 逐个比对',()=>{
  const random=mulberry32(701), n=(k:number)=>Math.floor(random()*k);
  for(let i=0;i<160;i++){
    const lines=['IN R0','LDI R1, 0xA0'];
    for(let j=0;j<18;j++){
      const d='R'+n(4),q='R'+n(4),next='l'+(j+1);
      const options=['ADD '+d+', '+q,'MOV '+d+', '+q,'LD '+d+', [160]','ST '+d+', [160]',
        'SUB '+d+', '+n(8),'CMP '+d+', '+q,'JZ '+next,'JNZ '+next,'SHR '+d,'OUT '+d,
        'XOR '+d+', '+q,'LD '+d+', [R0]','JMP '+next];
      lines.push('l'+j+': '+options[n(options.length)]);
      if(j%3===0) lines.push('ADD R0, 1');
    }
    const program=lines.concat('l18: OUT R0','HLT').join('\n'), input=[n(256)];
    const cpu=runCpu({image:assemble(program),input},1000);
    const times:number[]=[];
    for(const f of [true,false]) for(const b of ['predict-not-taken','stall'] as const) {
      const r=play(program,f,b,input);
      expect(r.error).toBeUndefined();expect(r.committed).toMatchObject({registers:cpu.registers,steps:cpu.steps,flags:cpu.flags,output:cpu.output,memory:cpu.memory,halted:true});
      expect(r.cycle).toBeGreaterThanOrEqual(r.retired+4);times.push(r.cycle);
    }
    expect(times[0]).toBeLessThanOrEqual(times[2]);expect(times[1]).toBeLessThanOrEqual(times[3]);
    expect(times[0]).toBeLessThanOrEqual(times[1]);expect(times[2]).toBeLessThanOrEqual(times[3]);
  }
});

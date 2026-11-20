import { expect,it } from 'vitest';
import { assemble } from './p8-asm';
import { p8Machine,type Boot } from './p8';
import { History } from './machine';
import { mulberry32 } from './rng';
import type { CacheConfig } from './cache';
import { referenceCache } from './cache-reference.test-helper';

const direct:CacheConfig={blockSize:4,sets:4,ways:1,replace:'lru',write:'write-back'};
const sum=`LDI R0, arr
LDI R1, 16
LDI R2, 0
loop: LD R3, [R0]
ADD R2, R3
ADD R0, 1
SUB R1, 1
JNZ loop
OUT R2
HLT
.org 128
arr: .byte 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16`;
function play(program:string,cache?:CacheConfig,fetch?:Boot['fetch']) {
  return new History(p8Machine,{image:assemble(program),input:[],cache,fetch},0);
}
it('A4 的周期、冲突缺失和 16 次 LD 的柱高',()=>{
  for(const [c,fetch,cycles,misses,hits] of [
    [undefined,'data',245,0,0],[direct,'data',141,4,12],[direct,'through-cache',486,30,71],
    [{...direct,sets:16},'through-cache',486,30,71],[{...direct,ways:2},'through-cache',276,9,92],
  ] as const) {
    const h=play(sum,c,fetch), reads=[];
    for(let i=0;i<85;i++){h.step();if(h.state.frame?.instruction?.name==='LD') reads.push(h.state.lastCycles);}
    expect(h.state).toMatchObject({cycles,output:[136],steps:85,halted:true});
    if(!c) continue;
    expect(h.state.cache).toMatchObject({hits,misses});expect(h.state.chart).toHaveLength(64);
    if(fetch==='data') expect(reads).toEqual(Array.from({length:16},(_,i)=>i%4===0?12:2));
  }
});
it('A2 两种写策略，微步计费，手改内存保留缓存',()=>{
  const source='LDI R0, 7\nPUSH R0\nLDI R0, 9\nPOP R1\nHLT';
  for(const write of ['write-back','write-through'] as const) {
    const h=play(source,{...direct,write});h.seek(5);
    expect(h.state.chart?.map(b=>b.cycles)).toEqual(write==='write-back'?[1,12,1,2,1]:[1,11,1,12,1]);
    expect(h.state.cycles).toBe(write==='write-back'?17:26);
  }
  const h=play(source,{...direct,blockSize:1},'through-cache');h.step('微步');
  expect(h.state).toMatchObject({cycles:22,cache:{misses:2}});h.seek(4,'微步');
  const cache=h.state.cache;h.edit({key:'memory',address:128,value:99});expect(h.state.cache).toBe(cache);
  h.seek(7,'微步');expect(h.state.cache?.misses).toBe(4);h.step('微步');expect(h.state.cache?.misses).toBe(5);
  h.seek(15,'微步');expect(h.state.frame?.visits?.at(-1)).toMatchObject({address:255,hit:false,cost:11});
});
it('随机访存程序的每条周期由独立参考缓存逐次计算',()=>{
  const random=mulberry32(43),int=(n:number)=>Math.floor(random()*n);
  for(let k=0;k<90;k++) {
    const config:CacheConfig={blockSize:2**int(4),sets:2**int(3),ways:2**int(3),
      replace:(['lru','fifo','random'] as const)[k%3],write:k%2?'write-back':'write-through',seed:k};
    const fetch=k%4?'through-cache':'data', ref=referenceCache(config);
    const actions=Array.from({length:24},()=>({write:random()<.5,address:128+int(64)}));
    const program=actions.map(a=>(a.write?'ST R0, [':'LD R1, [')+a.address+']').concat('HLT').join('\n');
    const h=play(program,config,fetch);
    for(let i=0;i<=actions.length;i++){
      let cost=1;const pc=i*2;
      if(fetch==='through-cache') {
        cost+=ref(pc,false).cost;
        if(Math.floor(pc/config.blockSize)!==Math.floor((pc+1)/config.blockSize)) cost+=ref(pc+1,false).cost;
      }
      if(actions[i]) cost+=ref(actions[i].address,actions[i].write).cost;
      h.step();expect(h.state.lastCycles).toBe(cost);
    }
  }
});

it('出错指令整条不计费，后退可看到取指当拍的费用',()=>{
  for(const source of ['.byte 0xFF, 0','IN R0']){
    const h=play(source,direct,'through-cache');h.step('微步');
    expect(h.state.cycles).toBe(11);while(!h.done)h.step('微步');
    expect(h.state).toMatchObject({steps:0,cycles:0,halted:true,frame:{visits:[]},cache:{misses:0,hits:0}});
    h.seek(1);expect(h.state.cache?.misses).toBe(1);
  }
});

it('CALL 和 RET 共用栈缓存，跨 0xFF 的取指读两个块',()=>{
  const h=play('CALL go\nHLT\ngo: RET',direct);
  h.seek(1);expect(h.state.frame?.visits).toMatchObject([{address:255,write:true,hit:false,cost:11}]);
  expect(h.state).toMatchObject({sp:254,cycles:12});h.step();
  expect(h.state.frame?.visits).toMatchObject([{address:255,write:false,hit:true,cost:1}]);
  expect(h.state).toMatchObject({sp:255,pc:2,cycles:14});
  const wrap=play('HLT',direct,'through-cache');wrap.edit({key:'PC',value:255});wrap.step('微步');
  expect(wrap.state).toMatchObject({pc:1,cycles:22,frame:{visits:[{address:255},{address:0}]}});
});

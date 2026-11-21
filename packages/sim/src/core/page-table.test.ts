import { expect,it } from 'vitest';
import { translations,parseAccesses,type PageParams } from './page-table';
import { mulberry32 } from './rng';

const input=(s:string)=>parseAccesses(s.replaceAll(';','\n'),10).requests;
const base:PageParams={vaBits:8,paBits:8,pageSize:16,levels:1,tlb:4,accesses:'',requests:[],
  mappings:[{vpn:6,frame:3,readonly:false},{vpn:7,frame:9,readonly:false},{vpn:8,frame:5,readonly:false}]};
it('数组十次读与无 TLB 的对照',()=>{
  const p={...base,requests:Array.from({length:10},(_,i)=>({op:'R' as const,address:100+4*i}))};
  const f=[...translations(p)].slice(1);
  expect(f.map(s=>s.hit)).toEqual([false,true,true,false,true,true,true,false,true,true]);
  expect(f[0].physical).toBe(52);expect(f.at(-1)).toMatchObject({hits:7,refs:13,accesses:10});
  expect([...translations({...p,tlb:0})].at(-1)?.refs).toBe(20);
});
it('逐级访存、保护、无效目录、脏位及清空',()=>{
  const p:PageParams={...base,vaBits:10,levels:2,dirBits:3,tlb:2,
    mappings:[[0,2],[1,7],[9,4],[63,11]].map(([vpn,frame])=>({vpn,frame,readonly:vpn===1})),
    requests:input('R 0x005;R 0x00a;W 0x01a;R 0x09c;W 0x094;R 0x3f0;R 0x200;R 0x004;flush;R 0x098')};
  const f=[...translations(p)];
  expect(f.at(-1)).toMatchObject({hits:2,misses:7,faults:1,protections:1,refs:20,dirty:[9],flushes:1,accesses:9});
  expect(f[7]).toMatchObject({dir:4,directoryRead:true,pteRead:false,physical:-1});
  expect(f[9].tlb).toEqual([]);
  expect(new Set(p.mappings.map(m=>m.vpn>>3)).size*8+8).toBe(32);
  expect([...translations({...p,levels:1})].at(-1)?.refs).toBe(14);
  expect([...translations({...p,tlb:0})].at(-1)?.refs).toBe(24);
  const ro=[...translations({...p,requests:input('R 16;W 16')})].at(-1)!;
  const recent=[...translations({...p,requests:input('R 16;R 0;W 16;R 144;R 16')})].at(-1)!;
  expect(recent).toMatchObject({hits:2,protections:1});
  expect(ro).toMatchObject({hits:1,protections:1,refs:3,dirty:[]});
});
it('LRU 与 FIFO；按位独立复算所有成功翻译',()=>{
  const p:PageParams={...base,tlb:2,mappings:[0,1,2].map(vpn=>({vpn,frame:vpn,readonly:false})),requests:input('R 0;R 16;R 0;R 32;R 0')};
  expect([...translations(p)].at(-1)?.hits).toBe(2);
  expect([...translations({...p,tlbPolicy:'fifo'})].at(-1)?.hits).toBe(1);
  const rand=mulberry32(77);
  for(let n=0;n<70;n++){
    const shift=1+n%5, mappings=Array.from({length:16},(_,vpn)=>({vpn,frame:Math.floor(rand()*16),readonly:rand()<.3}));
    const q:PageParams={...p,vaBits:shift+5,paBits:shift+4,pageSize:1<<shift,levels:n%2?2:1,mappings,
      requests:Array.from({length:40},()=>({op:rand()<.5?'W':'R',address:Math.floor(rand()*(32<<shift))}))};
    for(const f of [...translations(q)].slice(1)){
      const r=f.request!,vpn=r.address>>shift,off=r.address&((1<<shift)-1),m=mappings[vpn];
      expect(f.physical).toBe(m&&!(m.readonly&&r.op==='W')?(m.frame<<shift)|off:-1);
    }
  }
});

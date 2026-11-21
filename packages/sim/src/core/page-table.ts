import { algorithmMachine } from './algorithm.ts';

export interface Mapping {vpn:number; frame:number; readonly:boolean}
export interface Access {op:'R'|'W'|'flush'; address:number}
export interface PageParams {
  vaBits:number; paBits:number; pageSize:number; levels:1|2; dirBits?:number;
  mappings:Mapping[]; requests:Access[]; accesses:string; tlb:number; tlbPolicy?:'lru'|'fifo';
}
export const pageNames=['step','accesses','hits','misses','faults','protections','refs','flushes','done'];
const numberText=/^(?:\d+|0x[0-9a-f]+)$/i;
export function parseAccesses(source:string, vaBits:number){
  const requests:Access[]=[], errors:{row:number;message:string}[]=[];
  const lines=source.normalize('NFKC').trimEnd().split('\n');
  if(lines.length>40)errors.push({row:40,message:'访问串最多 40 行'});
  lines.forEach((line,row)=>{
    const fields=line.trim().split(/\s+/),op=fields[0].toUpperCase();
    if(fields.length===1&&op==='FLUSH')requests.push({op:'flush',address:0});
    else if(fields.length===2&&(op==='R'||op==='W')&&numberText.test(fields[1])&&Number(fields[1])<2**vaBits)
      requests.push({op,address:Number(fields[1])});
    else errors.push({row,message:'写 R 地址、W 地址或 flush，地址需在虚拟地址空间内'});
  });
  return {requests,errors};
}
interface Entry {vpn:number; frame:number; readonly:boolean; loaded:number; used:number}
export interface PageFrame {
  text:string; step:number; request?:Access; vpn:number; offset:number; dir:number; slot:number; physical:number;
  tlb:Entry[]; tlbSlot:number; directoryRead:boolean; pteRead:boolean; hit:boolean; result:string;
  visited:number[]; dirty:number[]; accesses:number; hits:number; misses:number; faults:number;
  protections:number; refs:number; flushes:number;
}
export function dimensions(p:Pick<PageParams,'levels'|'vaBits'|'dirBits'|'pageSize'|'paBits'>) {
  const offsetBits=Math.log2(p.pageSize), vpnBits=p.vaBits-offsetBits;
  const dirBits=p.levels===2?p.dirBits??Math.ceil(vpnBits/2):0;
  return {offsetBits,vpnBits,dirBits,slots:2**(vpnBits-dirBits),pages:2**vpnBits,frames:2**p.paBits/p.pageSize};
}
export function* translations(p:PageParams):Generator<PageFrame,void> {
  const {slots}=dimensions(p), map=new Map(p.mappings.map(m=>[m.vpn,m]));
  const validDirs=new Set(p.mappings.map(m=>Math.floor(m.vpn/slots)));
  let f:PageFrame={text:'准备翻译',step:0,vpn:-1,offset:0,dir:-1,slot:-1,physical:-1,tlb:[],tlbSlot:-1,
    directoryRead:false,pteRead:false,hit:false,result:'',visited:[],dirty:[],accesses:0,hits:0,misses:0,faults:0,protections:0,refs:0,flushes:0};
  yield f;
  for(const request of p.requests){
    f={...f,request,step:f.step+1,tlb:[...f.tlb],physical:-1,tlbSlot:-1,pteRead:false,directoryRead:false,hit:false};
    if(request.op==='flush'){
      f.vpn=f.dir=f.slot=-1;f.flushes++;f.tlb=[];f.text=f.result='清空 TLB';yield f;continue;
    }
    const vpn=Math.floor(request.address/p.pageSize),dir=Math.floor(vpn/slots);
    f.vpn=vpn;f.offset=request.address%p.pageSize;f.dir=dir;f.slot=vpn%slots;f.accesses++;
    const at=f.tlb.findIndex(e=>e.vpn===vpn);
    f.hit=at>=0;f.tlbSlot=at;
    const notes=['0x'+request.address.toString(16)+' 分成页号 '+vpn+'、偏移 '+f.offset];
    if(f.hit){f.hits++;f.tlb[at]={...f.tlb[at],used:f.step};notes.push('TLB 命中');}
    else{
      if(p.tlb){f.misses++;notes.push('TLB 缺失');}
      if(p.levels===2){f.directoryRead=true;f.refs++;notes.push('查目录 '+dir);}
      if(p.levels===1||validDirs.has(dir)){f.pteRead=true;f.refs++;notes.push('查页表项 '+f.slot);}
    }
    const mapping=f.hit?f.tlb[at]:map.get(vpn);
    if(!mapping){f.faults++;f.result='缺页';}
    else if(request.op==='W'&&mapping.readonly){f.protections++;f.result='写保护错';}
    else{
      if(p.tlb && !f.hit){
          const key=p.tlbPolicy==='fifo'?'loaded':'used';
          f.tlbSlot=f.tlb.length<p.tlb?f.tlb.length:f.tlb.reduce((best,e,i)=>e[key]<f.tlb[best][key]?i:best,0);
          f.tlb[f.tlbSlot]={vpn,frame:mapping.frame,readonly:mapping.readonly,loaded:f.step,used:f.step};
      }
      if(!f.visited.includes(vpn))f.visited=[...f.visited,vpn];
      if(request.op==='W'&&!f.dirty.includes(vpn))f.dirty=[...f.dirty,vpn];
      f.physical=mapping.frame*p.pageSize+f.offset;f.refs++;f.result='页框 '+mapping.frame+'，'+(request.op==='W'?'写':'读')+'物理地址 '+f.physical;
    }
    f.text=[...notes,f.result].join('，');yield f;
  }
}
export const pageMachine=algorithmMachine((p:PageParams)=>[translations(p)],f=>({
  accesses:f.accesses,hits:f.hits,misses:f.misses,faults:f.faults,protections:f.protections,refs:f.refs,flushes:f.flushes,
}));

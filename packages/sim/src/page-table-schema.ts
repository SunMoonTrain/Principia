import { z } from 'zod';
import { dimensions, parseAccesses, type Mapping } from './core/page-table.ts';

export const pageSchema=z.strictObject({
  vaBits:z.int().min(4).max(16),paBits:z.int().min(4).max(16),pageSize:z.int().min(1).max(65536),
  levels:z.literal([1,2]).default(1),dirBits:z.int().optional(),table:z.string(),accesses:z.string(),
  tlb:z.int().min(0).max(8),tlbPolicy:z.enum(['lru','fifo']).optional(),editable:z.boolean().default(true),
}).transform((p,ctx)=>{
  const issue=(key:string,message:string,row?:number)=>ctx.addIssue({code:'custom',path:[key],message,params:{row}});
  const {vpnBits,offsetBits,frames,dirBits,pages}=dimensions(p);
  if(!Number.isInteger(offsetBits)||offsetBits>Math.min(p.vaBits,p.paBits)||vpnBits>10||frames>256)
    issue('pageSize','页大小需为 2 的幂且不超过地址空间，页号最多 10 位，页框最多 256 个');
  if(p.levels===1&&p.dirBits!==undefined || p.levels===2&&(dirBits<1||dirBits>=vpnBits))
    issue(p.dirBits===undefined?'levels':'dirBits','两级页表的目录号和页表号都要至少一位');
  if(p.tlb===0&&p.tlbPolicy!==undefined)issue('tlbPolicy','没有 TLB 时不能写 tlbPolicy');
  const mappings:Mapping[]=[],seen=new Set<number>();
  if(p.table.trim())p.table.normalize('NFKC').trimEnd().split('\n').forEach((line,row)=>{
    const m=/^\s*(\d+)\s+(\d+)(?:\s+(r))?\s*$/.exec(line);
    if(!m||Number(m[1])>=pages||Number(m[2])>=frames)issue('table','写合法的页号、页框号和可选的 r',row);
    else if(seen.has(Number(m[1])))issue('table','页号重复',row);
    else {seen.add(Number(m[1]));mappings.push({vpn:Number(m[1]),frame:Number(m[2]),readonly:!!m[3]});}
  });
  const {requests,errors}=parseAccesses(p.accesses,p.vaBits);
  errors.forEach(e=>issue('accesses',e.message,e.row));
  return {...p,mappings,requests};
});

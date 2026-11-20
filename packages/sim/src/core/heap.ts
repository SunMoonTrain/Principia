import type { Machine, SimEvent } from './machine.ts';

export type Region = readonly [number, number];
export type BlockKind = 'array'|'list'|'slots'|'buckets'|'bst'|'avl'|'red-black';
export interface Block { at:number; length:number; kind:BlockKind }
export interface Hole { at:number; length:number }
export function holes(region:Region, blocks:Block[]):Hole[] {
  const free:Hole[]=[];
  let next=region[0];
  for(const b of blocks) {
    if(b.at>next) free.push({at:next,length:b.at-next});
    next=b.at+b.length;
  }
  if(next<=region[1]) free.push({at:next,length:region[1]-next+1});
  return free;
}
export const addr=(n:number)=>'0x'+n.toString(16).toUpperCase().padStart(2,'0');
export interface Op { name:string; args:number[] }
export const opText=(op:Op)=>[op.name,...op.args].join(' ');
export interface Picture {
  bytes:Uint8Array; blocks:Block[]; size:number; moves:number; probes:number; resizes:number;
  rotations:number; compares:number; swaps:number;
}
export const blank=():Picture=>({bytes:new Uint8Array(256),blocks:[],size:0,moves:0,probes:0,resizes:0,rotations:0,compares:0,swaps:0});
export type Write = [number,number];
export interface Note {
  text:string; reads:number[]; writes:number[]; path?:number[]; probeBase?:number; probeKey?:number;
  reason?:string; failed?:boolean; blockChange?:number[];
}
export interface Tick { pic:Picture; note:Note }
type Changes=Partial<Omit<Picture,'bytes'>>;
export class OperationFailure extends Error {}

/** 一个操作先生成有界的微步；失败时丢弃整段草稿，历史中的旧字节从不改写。 */
export class Trace {
  readonly ticks:Tick[]=[];
  constructor(public pic:Picture, readonly region:Region) {}
  get b(){return this.pic.bytes;}
  emit(text:string, reads:number[]=[], changes:Write[]=[], fields:Changes={}, note:Partial<Note>={}) {
    const bytes=changes.length?this.b.slice():this.b;
    for(const [at,value] of changes) bytes[at]=value;
    this.pic={...this.pic,...fields,bytes};
    this.ticks.push({pic:this.pic,note:{text,reads,writes:changes.map(w=>w[0]),...note}});
  }
  allocate(length:number,kind:BlockKind,initial:number[]|null=null) {
    const free=holes(this.region,this.pic.blocks), at=free.find(h=>h.length>=length)?.at;
    if(at===undefined) throw new OperationFailure('申请 '+length+' 字节失败。空闲 '+free.reduce((n,h)=>n+h.length,0)+' 字节，最大空洞 '+Math.max(0,...free.map(h=>h.length))+' 字节。');
    const block={at,length,kind}, blocks=[...this.pic.blocks,block].sort((a,b)=>a.at-b.at);
    this.emit('申请 '+length+' 字节：'+addr(at)+'–'+addr(at+length-1),[],initial?.map((v,i)=>[at+i,v])??[],{blocks},
      {blockChange:Array.from({length},(_,i)=>at+i)});
    return at;
  }
  release(at:number,changes:Write[]=[],fields:Changes={}) {
    const block=this.pic.blocks.find(b=>b.at===at)!;
    this.emit('释放 '+addr(at)+'–'+addr(at+block.length-1)+'，保留原字节。',[],changes,
      {...fields,blocks:this.pic.blocks.filter(b=>b!==block)}, {blockChange:Array.from({length:block.length},(_,i)=>at+i)});
  }
}
export interface Work<P> {
  params:P; pic:Picture; commands:Op[]; ops:number; step:number; note:Note;
  previous?:Picture; previousStep?:number; previousOps?:number;
  tape:Tick[]|null; next:number;
}
export const boundary=<P,>(s:Work<P>)=>!s.tape;
export const smallGrains=['一步','一个操作'], largeGrains=['一个操作','一步'];
export function operationMachine<P extends {region:Region;commands:Op[]}>(
  init:(p:P)=>Picture, plan:(t:Trace,p:P,op:Op)=>void, observe:(s:Work<P>)=>Record<string,number>,
):Machine<P,Work<P>> {
  return {
    init(p){return {params:p,commands:p.commands,pic:init(p),ops:0,step:0,tape:null,next:0,note:{text:'',reads:[],writes:[]}};},
    atEnd:s=>!s.tape && s.ops===s.commands.length,
    step(s,grain) {
      const op=s.commands[s.ops];
      if(!op)return {state:s,events:[],done:true};
      let tape=s.tape;
      if(!tape) {
        const t=new Trace(s.pic,s.params.region);
        try { plan(t,s.params,op); tape=t.ticks; }
        catch(e){if(!(e instanceof OperationFailure))throw e;tape=[{pic:s.pic,note:{text:e.message,reads:[],writes:[],failed:true}}];}
      }
      const stop=grain==='一个操作'?tape.length:s.next+1;
      const last=tape[stop-1], end=stop===tape.length, count=stop-s.next;
      let note=last.note;
      if(count>1) {
        const steps=tape.slice(s.next,stop);
        const reasons=steps.map(x=>x.note.reason).filter(Boolean);
        if(note.reason===note.text)reasons.pop();
        note={...note,text:count+' 个微步。'+(reasons.length?reasons.join('；')+'。':'')+note.text,
          blockChange:[...new Set(steps.flatMap(x=>x.note.blockChange??[]))],
          reads:[...new Set(steps.flatMap(x=>x.note.reads))],writes:[...new Set(steps.flatMap(x=>x.note.writes))]};
      }
      const ops=s.ops+Number(end);
      const events:SimEvent[]=[{kind:note.failed?'warn':'info',text:opText(op)+' · '+note.text}];
      return {state:{...s,previous:s.pic,previousStep:s.step,previousOps:s.ops,pic:last.pic,step:s.step+count,ops,note,tape:end?null:tape,next:end?0:stop},events,
        done:end && ops===s.commands.length,previewCost:s.tape?count:tape.length};
    },
    edit(s,action) {
      const commands=action as Op[];
      if(s.tape || !commands.length || s.ops+commands.length>256)throw new Error('只能在操作边界添加，最多 256 个操作');
      return {...s,commands:[...s.commands.slice(0,s.ops),...commands],note:{text:'',reads:[],writes:[]}};
    },
    readMemory:(s,at)=>s.pic.bytes[at],observe,
  };
}

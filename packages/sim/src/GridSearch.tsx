import { useLayoutEffect,useMemo,useRef,useState,type PointerEvent } from 'react';
import type { AnimProps } from '@principia/anim';
import { AlgorithmPlayer,useAlgorithm,type Controls } from './AlgorithmPlayer';
import { defaultH,gridMachine,gridNames,heuristics,searches,type GridFrame,type GridParams,type GridRun,type Search,type Heuristic } from './core/grid-search';
type Params=GridParams & Controls;
const num=(n:number)=>Number.isFinite(n)?Number(n.toFixed(2)).toString():'∞';
const legend='墙 ■　已扩展 ▧　队列 □　读 蓝　写 橙　路径 ●';
function Board({p,run,f,rows,paint,editable,inspect,pick,select}:{p:Params;run:GridRun;f:GridFrame;rows:string[];editable:boolean;inspect:boolean;pick:number;select:(at:number)=>void;paint:(i:number,finish:boolean)=>void}){
  const ref=useRef<HTMLCanvasElement>(null),drag=useRef(false),[theme,setTheme]=useState(0);
  const previous=useRef<{rows:string[];run:GridRun;f:GridFrame;pick:number;theme:number;scale:number}|null>(null);
  const tiles=useMemo(()=>rows.flatMap(row=>Array.from(row)),[rows]);
  const h=rows.length,w=tiles.length/h,small=h<=10&&w<=16,unit=small?48:14;
  const scale=Math.min(2,window.devicePixelRatio||1);
  const informed=run.algorithm==='greedy'||run.algorithm==='astar',themeRoot=document.documentElement;
  useLayoutEffect(()=>{
    const watch=new MutationObserver(()=>setTheme(n=>n+1)),media=matchMedia('(prefers-color-scheme: dark)'),refresh=()=>setTheme(n=>n+1);
    watch.observe(themeRoot,{attributes:true,attributeFilter:['class','data-theme','style']});media.addEventListener('change',refresh);
    return ()=>{watch.disconnect();media.removeEventListener('change',refresh);};
  },[themeRoot]);
  useLayoutEffect(()=>{
    const ctx=ref.current?.getContext('2d');if(!ctx)return;
    const css=getComputedStyle(ref.current!),color=(key:string)=>css.getPropertyValue(key).trim();
    const accent=color('--accent'),border=color('--border'),text=color('--text'),surface=color('--surface'),muted=color('--muted');
    ctx.setTransform(scale,0,0,scale,0,0);
    const old=previous.current;
    const dirty=old && old.rows===rows && old.run===run && old.theme===theme && old.scale===scale
      ? new Set([...old.f.reads,...old.f.writes,...f.reads,...f.writes,...old.f.path,...f.path,old.f.at,f.at,old.pick,pick])
      : null;
    // DFS 单步也可能丢弃旧栈项；前进一步、回退和跳步都检查可见状态的差异。
    if(dirty && old && old.f!==f){
      for(let i=0;i<tiles.length;i++){
        if(old.f.open[i]!==f.open[i] || old.f.closed[i]!==f.closed[i] || (small&&old.f.g[i]!==f.g[i]))dirty.add(i);
      }
    }
    previous.current={rows,run,f,pick,theme,scale};
    const path=new Set(f.path),writes=new Set(f.writes),reads=new Set(f.reads);
    for(const i of dirty??tiles.keys()){
      if(i<0)continue;
      const x=(i%w)*unit,y=Math.floor(i/w)*unit,ch=tiles[i];
      ctx.fillStyle=ch==='#'?muted:Object.hasOwn(p.costs,ch)?'hsl('+((p.costs[ch]*38+12)%360)+' 30% 50%)':surface;ctx.fillRect(x,y,unit,unit);
      if(f.closed[i]&&ch!=='#'){ctx.globalAlpha=.36;ctx.fillStyle=accent;ctx.fillRect(x,y,unit,unit);ctx.globalAlpha=1;}
      if(reads.has(i)||writes.has(i)){ctx.fillStyle=writes.has(i)?'#d89128':'#639cdc';ctx.globalAlpha=.65;ctx.fillRect(x+1,y+1,unit-2,unit-2);ctx.globalAlpha=1;}
      ctx.strokeStyle=f.open[i]?accent:border;
      ctx.lineWidth=f.open[i]?2.5:0.7;
      // 整条描边留在本格内，使局部重画与整图重画的像素一致。
      const inset=f.open[i]?1.5:1;
      ctx.strokeRect(x+inset,y+inset,unit-2*inset,unit-2*inset);
      if(path.has(i)){ctx.fillStyle='#2f9d70';ctx.beginPath();ctx.arc(x+unit/2,y+unit/2,unit*.18,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle=text;ctx.textAlign='center';
      if(ch==='S'||ch==='G'||small&&ch!=='.'&&ch!=='#'){ctx.font='bold '+(small?13:10)+'px sans-serif';ctx.fillText(ch,x+unit/2,y+(small?14:11));}
      if(small&&ch!=='#'){ctx.font='15px monospace';ctx.fillText('g '+num(f.g[i]),x+unit/2,y+28,unit-3);
        if(run.algorithm==='astar')ctx.fillText('f '+num(f.g[i]+(run.weight??1)*f.h[i]),x+unit/2,y+44,unit-3);}
      if(i===pick||i===f.at){ctx.strokeStyle=text;ctx.lineWidth=2;ctx.strokeRect(x+2,y+2,unit-4,unit-4);}
    }
  },[f,rows,run,p.costs,pick,theme,scale,tiles]);
  function at(e:PointerEvent<HTMLCanvasElement>){
    const b=e.currentTarget.getBoundingClientRect(),x=Math.floor((e.clientX-b.left)*w/b.width),y=Math.floor((e.clientY-b.top)*h/b.height);
    return x<0||x>=w||y<0||y>=h?-1:y*w+x;
  }
  const selected=pick>=0?pick:f.at,coord=(i:number)=>i<0?'—':'('+Math.floor(i/w)+', '+i%w+')';
  return <section className="algo-panel grid-board"><h4>{run.algorithm}{informed?' · '+(run.heuristic??defaultH(p.moves)):''}{run.algorithm==='astar'?' · w='+ (run.weight??1):''}</h4>
    <canvas ref={ref} width={w*unit*scale} height={h*unit*scale} style={{width:'min(100%, '+w*unit+'px)'}} aria-label={h+' 行 '+w+' 列寻路地图'} tabIndex={0}
      onKeyDown={e=>{const d:Record<string,number>={ArrowRight:1,ArrowLeft:-1,ArrowUp:-w,ArrowDown:w};if(e.key in d){e.preventDefault();e.stopPropagation();select(Math.max(0,Math.min(w*h-1,Math.max(0,selected)+d[e.key])));}}}
      onPointerDown={e=>{const i=at(e);if(i<0)return;select(i);if(editable&&!inspect){drag.current=true;e.currentTarget.setPointerCapture(e.pointerId);paint(i,false);}}}
      onPointerMove={e=>{const i=at(e);if(i>=0&&drag.current)paint(i,false);}}
      onPointerUp={e=>{if(drag.current){drag.current=false;paint(at(e),true);}}}
      onPointerCancel={()=>{if(drag.current){drag.current=false;paint(-1,true);}}}/>
    <div className="algo-meta">{legend} {Object.entries(p.costs).map(([k,v])=><span key={k}> · {k} 代价 {v}</span>)}</div>
    <div className="algo-count">扩展 {f.expanded} · 队列 {f.frontier} · 代价 {f.cost<0?'−1':f.cost.toFixed(2)} · {f.found?'找到':'未找到'}</div>
    {selected>=0&&<div className="algo-meta">{coord(selected)}　g {num(f.g[selected])}　h {num(f.h[selected])}　f {num(f.g[selected]+(run.weight??1)*f.h[selected])}　父 {coord(f.parent[selected])}</div>}
  </section>;
}
function WeightInput({run,change}:{run:GridRun;change:(weight:number)=>void}){
  const input=useRef<HTMLInputElement>(null);
  const weight=run.weight??1;
  useLayoutEffect(()=>{if(input.current)input.current.value=String(weight);},[run,weight]);
  function commit(field:HTMLInputElement){
    const next=field.valueAsNumber,valid=Number.isFinite(next)&&next>=1&&next<=10;
    field.value=String(valid?next:weight);
    if(valid&&next!==weight)change(next);
  }
  return <label> w <input ref={input} type="number" min="1" max="10" step="any" defaultValue={weight}
    disabled={run.algorithm!=='astar'} onBlur={e=>commit(e.currentTarget)}
    onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();commit(e.currentTarget);}}}/></label>;
}
export default function GridSearch({params,labels}:AnimProps<Params>){
  const session=useAlgorithm(params,gridMachine,gridNames,20,true),p=session.params,[brush,setBrush]=useState('查看'),[draft,setDraft]=useState<string[]|null>(null),stroke=useRef<string[]|null>(null);
  const [picks,setPicks]=useState<number[]>([]);
  function apply(next:Params){setPicks([]);session.apply(next);}
  function paint(i:number,finish:boolean){
    const rows=(stroke.current??p.rows).map(s=>Array.from(s)),w=rows[0].length,tiles=rows.flat();
    if(i>=0&&tiles[i]!==brush){
      if(brush==='S'||brush==='G'){
        if(tiles[i]!== (brush==='S'?'G':'S')){tiles[tiles.indexOf(brush)]='.';tiles[i]=brush;}
      }else if(tiles[i]!=='S'&&tiles[i]!=='G')tiles[i]=brush;
    }
    const next=rows.map((_,r)=>tiles.slice(r*w,(r+1)*w).join(''));
    stroke.current=finish?null:next;setDraft(finish?null:next);
    if(finish&&next.some((s,r)=>s!==p.rows[r]))apply({...p,rows:next});
  }
  const change=(i:number,run:GridRun)=>apply({...p,runs:p.runs.map((v,j)=>j===i?run:v)});
  return <AlgorithmPlayer session={session} labels={labels}
    reset={()=>{setBrush('查看');setDraft(null);stroke.current=null;apply(params);}} editor={<div className="algo-editor">
      <label>画笔 <select value={brush} onChange={e=>setBrush(e.target.value)}>{['查看','#','.',...Object.keys(p.costs),'S','G'].map(k=><option key={k} value={k}>{{'#':'墙','.':'平地',S:'起点',G:'终点'}[k]??k}</option>)}</select></label>
      {p.runs.map((v,i)=><div key={i}><label>配置 {i+1} <select value={v.algorithm} onChange={e=>change(i,{algorithm:e.target.value as Search})}>{searches.map(k=><option key={k}>{k}</option>)}</select></label>
        <label> h <select disabled={!['astar','greedy'].includes(v.algorithm)} value={v.heuristic??defaultH(p.moves)} onChange={e=>change(i,{...v,heuristic:e.target.value as Heuristic})}>{heuristics.map(k=><option key={k}>{k}</option>)}</select></label>
        <WeightInput run={v} change={weight=>change(i,{...v,weight})}/></div>)}
    </div>}>
    {tracks=>tracks.map((t,i)=><Board key={i} p={p} run={p.runs[i]} f={t.frame} rows={draft??p.rows} paint={paint} inspect={brush==='查看'} editable={p.editable}
      pick={picks[i]??-1} select={cell=>setPicks(old=>p.runs.map((_,j)=>j===i?cell:old[j]??-1))}/>)}
  </AlgorithmPlayer>;
}

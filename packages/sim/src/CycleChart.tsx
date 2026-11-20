import { hex } from './core/p8-asm';
import type { CycleBar } from './core/p8';

export function CycleChart({bars}:{bars:CycleBar[]}) {
  if (!bars.length) return <p>第一条指令写回后显示周期。</p>;
  const max=Math.max(...bars.map(b=>b.cycles)), width=624, left=32, floor=87;
  const pitch=(width-left-8)/64;
  return <figure className="p8-chart"><figcaption>最近 {bars.length} 条 · 周期数 · <span>橙色表示缺失</span></figcaption>
    <svg viewBox={'0 0 '+width+' 111'} role="img" aria-label="每条指令的周期，横轴为指令序号">
      {[0,max].map(n=><g key={n}><text x={left-4} y={floor-n/max*68+3} textAnchor="end">{n}</text>
        <line x1={left} x2={width-6} y1={floor-n/max*68} y2={floor-n/max*68}/></g>)}
      {bars.map((b,i)=><g key={b.step} data-miss={b.miss} aria-label={'第 '+b.step+' 条，'+b.cycles+' 周期'}>
        <title>{'第 '+b.step+' 条 · '+hex(b.address)+' · '+b.cycles+' 周期'+(b.miss?' · 缺失':'')}</title>
        <rect x={left+i*pitch} y={floor-b.cycles/max*68} width={pitch-1.4} height={b.cycles/max*68}/>
        {(i===0 || (i%8===0 && bars.length-i>3) || (i===bars.length-1 && i>=3)) && <text x={left+i*pitch} y="105">{b.step}</text>}
      </g>)}
    </svg></figure>;
}

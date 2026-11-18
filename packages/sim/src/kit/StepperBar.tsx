import { useState, type KeyboardEvent, type ReactNode } from 'react';
import type { SimEvent } from '../core/machine';
import type { useMachine } from './useMachine';
import '../sim.css';

/** 写入优先于读取，同一步的其它操作使用普通强调色。 */
export function touchKind(events: SimEvent[], key: string) {
  const touched = events.filter((event) => event.touched?.includes(key));
  if (touched.some((event) => event.kind === 'write')) return 'write';
  if (touched.some((event) => event.kind === 'read')) return 'read';
  return touched.length ? 'other' : undefined;
}

function StepLog({ index, end, eventsAt, seek }: {
  index: number; end: number; eventsAt: (i: number) => SimEvent[]; seek: (i: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const start = Math.min(page, Math.floor(end / 100)) * 100;
  return <details className="sim-log" open={open} onToggle={(e) => {
    setOpen(e.currentTarget.open);
    if (e.currentTarget.open) setPage(Math.floor(index / 100));
  }}>
    <summary>步骤记录</summary>
    {open && <>
      {end >= 100 && <div>
        <button disabled={start === 0} onClick={() => setPage(start / 100 - 1)}>上一页</button>
        <button disabled={start + 100 > end} onClick={() => setPage(start / 100 + 1)}>下一页</button>
      </div>}
      <ol start={start}>
        {Array.from({ length: Math.min(100, end - start + 1) }, (_, j) => {
          const i = start + j;
          return <li key={i}><button aria-current={i === index ? 'step' : undefined} onClick={() => seek(i)}>
            {eventsAt(i).map((event) => event.text).join(' ') || '初始状态'}
          </button></li>;
        })}
      </ol>
    </>}
  </details>;
}

export function StepperBar<P, S>({ player, children, labels = {} }: {
  player: ReturnType<typeof useMachine<P, S>>; children: ReactNode; labels?: Record<string, ReactNode>;
}) {
  const { history, options, pauseIndex } = player;
  const onKey = (event: KeyboardEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey ||
      target.isContentEditable || target.closest('input, select, textarea')) return;
    switch (event.key) {
      case 'ArrowRight': player.step(); break;
      case 'ArrowLeft': player.seek(Math.max(0, history.index - 1)); break;
      case ' ':
        if (target.closest('button, summary, a')) return;
        player.toggle();
        break;
      case 'Home': player.reset(); break;
      default: return;
    }
    event.preventDefault();
  };
  return <section ref={player.playerRef} className="sim-player" aria-label="步进模拟器" tabIndex={0} onKeyDown={onKey}>
    {children}
    <p className="sim-event" aria-live="polite">{history.events.map((event) => event.text).join(' ') || '初始状态'}</p>
    {pauseIndex >= 0 && <div className="sim-pause" role="status">{labels['pauses:' + pauseIndex] ?? options.pauses?.[pauseIndex].text}</div>}
    <div className="sim-controls">
      <button onClick={player.reset}>重置</button>
      <button disabled={!history.index} onClick={() => player.seek(history.index - 1)}>后退</button>
      <button disabled={history.done} onClick={player.step}>单步</button>
      <button className="sim-run" onClick={player.toggle} disabled={history.done}>{player.running ? '暂停' : pauseIndex >= 0 ? '继续' : '运行'}</button>
      <label>速度 <select value={player.speed} onChange={(e) => player.setSpeed(Number(e.target.value))}>
        {[0.25, 0.5, 1, 2, 4].map((v) => <option key={v} value={v}>{v}×</option>)}
      </select></label>
      {(options.granularities?.length ?? 0) > 1 && <label>粒度 <select value={player.grain} onChange={(e) => player.changeGrain(e.target.value)}>
        {options.granularities?.map((g) => <option key={g}>{g}</option>)}
      </select></label>}
    </div>
    <label className="sim-seek">
      <span>第 {history.index} 步 / {history.finished ? '共' : '已计算'} {history.end} 步</span>
      <input aria-label="跳到步骤" type="range" min={0} max={history.end} value={history.index} onChange={(e) => player.seek(Number(e.target.value))} />
    </label>
    {!!options.goals?.length && <ul aria-label="目标" className="sim-goals">
      {options.goals.map((goal, i) => <li key={i} data-reached={player.reached[i]}>
        <span aria-label={player.reached[i] ? '已达成' : '待达成'}>{player.reached[i] ? '✓' : '○'}</span> {labels['goals:' + i] ?? goal.text}
      </li>)}
    </ul>}
    <StepLog index={history.index} end={player.visited} eventsAt={(i) => history.eventsAt(i)} seek={player.seek} />
  </section>;
}

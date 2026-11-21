import { useState, type ReactNode, type UIEvent } from 'react';
import { useStepScroll } from './StructurePlayer';
import './os.css';

export function ScrollBox({step, children, label, className = ''}: {
  step: number; children: ReactNode; label: string; className?: string;
}) {
  const ref = useStepScroll({text: step ? String(step) : '', reads: [], writes: []}, undefined, true);
  return <div className={'os-scroll ' + className} aria-label={label} ref={ref}>{children}</div>;
}

/** 并排演示共享水平时间轴；各面板的其它滚动区独立。 */
export function syncTimeline(e:UIEvent<HTMLDivElement>) {
  const source=e.target;
  if(!(source instanceof HTMLElement)||!source.classList.contains('os-axis'))return;
  for(const peer of e.currentTarget.querySelectorAll<HTMLElement>('.os-axis'))
    if(peer!==source && Math.abs(peer.scrollLeft-source.scrollLeft)>1)peer.scrollLeft=source.scrollLeft;
}

export function IntegerInput({label, value, min, max, apply}: {
  label: string; value: number; min: number; max: number; apply: (n: number) => void;
}) {
  const [draft, setDraft] = useState<string>();
  function commit() {
    if (draft === undefined) return;
    const raw = draft.normalize('NFKC').trim();
    const n = Number(raw);
    setDraft(undefined);
    if (/^-?\d+$/.test(raw) && Number.isSafeInteger(n) && n >= min && n <= max && n !== value) apply(n);
  }
  return <label>{label} <input inputMode="numeric" size={4} value={draft ?? value}
    onChange={e => setDraft(e.target.value)} onBlur={commit}
    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); commit(); } }}/></label>;
}

export function mark(kind?: 'read' | 'write') { return {'data-act': kind, 'data-touch': kind}; }

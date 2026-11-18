import { bit } from './core/bits';
import './sim.css';

export function BitRow({ label, value, width, offset = 0, active, toggle }: {
  label: string; value: number; width: number; offset?: number; active?: number; toggle?: (index: number) => void;
}) {
  return <div className="sim-bit-row" role="group" aria-label={label}>
    <strong>{label}</strong>
    <div className="sim-digits">{Array.from({ length: width }, (_, n) => {
      const i = width + offset - 1 - n, digit = bit(value, i);
      return toggle ? <button key={i} aria-label={label + ' 第 ' + i + ' 位'} aria-pressed={!!digit}
        data-touch={i === active ? 'write' : undefined} onClick={() => toggle(i)}>{digit}</button>
        : <span key={i} data-touch={i === active ? 'write' : undefined}>{digit}</span>;
    })}</div>
  </div>;
}

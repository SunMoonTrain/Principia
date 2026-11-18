import { useState } from 'react';
import type { AnimProps } from '@principia/anim';
import type { TextDisplay } from './specs';
import { characterLabel, encodeCodePoint } from './core/utf';
import './sim.css';

const hex = (n: number, width: number) => n.toString(16).toUpperCase().padStart(width, '0');
export default function TextEncoding({ params }: AnimProps<TextDisplay>) {
  const [text, setText] = useState(params.text);
  return <div className="sim-player sim-encoding">
    <label>输入文字<textarea rows={2} value={text} onChange={(e) => setText(e.target.value)}/></label>
    <p>按码位拆分。用零宽连接符（ZWJ）组合的表情会占多行。</p>
    {Array.from(text, encodeCodePoint).map(({ point, character, utf8, utf16 }, i) => <div className="sim-codepoint" key={i}>
      <strong>{characterLabel(character)} <code>U+{hex(point, 4)}</code></strong>
      {params.show.includes('utf8') && <div><b>UTF-8</b><div className="sim-bytes">{utf8.map((byte, j) =>
        <div key={j}><code>{hex(byte.byte, 2)}</code><code><em title="前缀">{byte.prefix}</em><span title="载荷">{byte.payload}</span></code>
          <small>载荷 ← 位 {byte.high}…{byte.low}</small></div>)}</div></div>}
      {params.show.includes('utf16') && <div><b>UTF-16</b><div className="sim-bytes">{utf16.map((unit, j) =>
        <div key={j}><code>{hex(unit, 4)}</code><small>{utf16.length === 1 ? '单码元' : j ? '低代理' : '高代理'}</small></div>)}</div></div>}
    </div>)}
  </div>;
}

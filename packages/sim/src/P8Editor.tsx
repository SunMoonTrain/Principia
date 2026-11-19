import { useMemo, useRef, type ReactNode } from 'react';
import { assemble, AssemblyError, mnemonics } from './core/p8-asm';
import './cpu.css';

export function useAssembly(source: string, isa?: readonly string[]) {
  return useMemo(() => {
    try { return { image:assemble(source,isa) }; }
    catch (error) { if (!(error instanceof AssemblyError)) throw error; return {error}; }
  },[source,isa]);
}
export function syntax(line: string) {
  const pattern=/'[\x00-\x7f]'|;.*|[A-Za-z][A-Za-z0-9_]*(?=:)|\.[a-z]+|(?:0x[\da-f]+|0b[01]+|\d+)|[A-Za-z][A-Za-z0-9_]*/gi;
  const nodes: ReactNode[] = [];
  let at=0;
  for (const m of line.matchAll(pattern)) {
    const word=m[0], i=m.index!;
    const kind=word.startsWith(';')?'comment':/^['.\d]/.test(word)?'literal':mnemonics.includes(word.toUpperCase())?'keyword':/^R[0-3]$/i.test(word)?'register':'label';
    nodes.push(line.slice(at,i),<span className={'p8-'+kind} key={i}>{word}</span>);
    at=i+word.length;
  }
  nodes.push(line.slice(at)); return nodes;
}
export function P8Editor({ value, change, error, disabled, maxLength }: {
  value:string; change:(code:string)=>void; error?:AssemblyError; disabled?:boolean; maxLength?:number;
}) {
  const layer=useRef<HTMLPreElement>(null);
  return <div className="p8-editor-wrap">
    <div className="p8-editor"><pre ref={layer} aria-hidden="true">{value.split('\n').map((line,i)=>
      <span className={error?.line===i+1?'p8-bad-line':undefined} key={i}>{syntax(line)}{'\n'}</span>)}</pre>
      <textarea aria-label="P8 汇编程序" value={value} onChange={e=>change(e.target.value)} disabled={disabled}
        onScroll={e=>layer.current?.scrollTo(e.currentTarget.scrollLeft,e.currentTarget.scrollTop)}
        wrap="off" spellCheck={false} autoCapitalize="off" maxLength={maxLength} aria-invalid={!!error}/>
    </div>
    {error && <p role="status" className="p8-error">第 {error.line} 行 · {error.message}</p>}
  </div>;
}

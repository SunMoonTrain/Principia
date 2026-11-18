import type { Element } from 'hast';
import { createLowlight } from 'lowlight';
import python from 'highlight.js/lib/languages/python';
import rust from 'highlight.js/lib/languages/rust';
import typescript from 'highlight.js/lib/languages/typescript';
import glsl from 'highlight.js/lib/languages/glsl';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import sql from 'highlight.js/lib/languages/sql';

const languages = { python, rust, typescript, glsl, html: xml, css, sql };
const highlighter = createLowlight(languages);
highlighter.register('p8asm', (hljs) => ({
  case_insensitive: true,
  keywords: { keyword: 'HLT NOP MOV LDI LD ST ADD SUB AND OR XOR CMP SHL SHR JMP JZ JNZ JC JNC JN JV PUSH POP CALL RET IN OUT', built_in: 'R0 R1 R2 R3 PC SP' },
  contains: [hljs.COMMENT(';', '$'), hljs.C_NUMBER_MODE, hljs.APOS_STRING_MODE,
    { scope: 'meta', match: /\.(?:org|byte|zero)\b/i }, { scope: 'title', match: /[A-Za-z]\w*(?=:)/ }],
}));

export function highlightCode(lang: string, source: string): Element | null {
  if (lang !== 'text' && lang !== 'p8asm' && !Object.hasOwn(languages, lang)) return null;
  return { type: 'element', tagName: 'code', properties: { className: ['language-' + lang] },
    children: lang === 'text' ? [{ type: 'text', value: source }] : highlighter.highlight(lang, source).children.filter((child) => child.type !== 'doctype') };
}

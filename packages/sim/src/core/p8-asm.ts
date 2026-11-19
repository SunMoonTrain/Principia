/** P8 的编码表由汇编、反汇编和执行共用。 */
type Form = 'none' | 'reg' | 'rr' | 'imm' | 'direct' | 'indirect' | 'jump';
export interface Encoding { opcode: number; name: string; form: Form }
const table: (Encoding | undefined)[] = [];
function define(base: number, form: Form, names: string) {
  names.split(' ').forEach((name, i) => { table[base+i] = { opcode: base+i, form, name }; });
}
define(0, 'none', 'HLT NOP');
define(4, 'rr', 'MOV'); define(5, 'imm', 'LDI');
define(6, 'direct', 'LD'); define(7, 'indirect', 'LD');
define(8, 'direct', 'ST'); define(9, 'indirect', 'ST');
const arithmetic = 'ADD SUB AND OR XOR CMP';
define(16, 'rr', arithmetic); define(24, 'imm', arithmetic);
define(32, 'reg', 'SHL SHR');
define(40, 'jump', 'JMP JZ JNZ JC JNC JN JV');
define(48, 'reg', 'PUSH POP'); define(50, 'jump', 'CALL'); define(51, 'none', 'RET');
define(56, 'reg', 'IN OUT');
const encodings = table.filter((e): e is Encoding => !!e);
export const mnemonics = [...new Set(encodings.map(e => e.name))];
export const hex = (n: number) => '0x' + n.toString(16).toUpperCase().padStart(2, '0');
export const signed = (n: number) => n < 128 ? n : n - 256;

export type Decoded = Encoding & { d: number; b: number };
export function decode(first: number, b: number): Decoded | string {
  const spec = table[first >> 2], d = first & 3;
  if (!spec) return '没有这个操作码';
  if ((spec.form === 'none' || spec.form === 'jump') && d) return '这条指令的 d 必须是 0';
  if ((spec.form === 'none' || spec.form === 'reg') && b) return '这条指令的第 2 字节必须是 0';
  if ((spec.form === 'rr' || spec.form === 'indirect') && b > 3) return '第 2 字节是寄存器编号，只能是 0–3';
  return { ...spec, d, b };
}
export function disassemble(first: number, b: number): string {
  const e = decode(first,b);
  if (typeof e === 'string') return '.byte ' + hex(first) + ', ' + hex(b);
  const dest = e.name + ' R' + e.d;
  switch (e.form) {
    case 'none': return e.name;
    case 'reg': return dest;
    case 'jump': return e.name + ' ' + hex(b);
    case 'rr': return dest + ', R' + b;
    case 'imm': return dest + ', ' + b;
    case 'direct': return dest + ', [' + hex(b) + ']';
    case 'indirect': return dest + ', [R' + b + ']';
  }
}

export class AssemblyError extends Error {
  constructor(readonly line: number, message: string) { super(message); }
}
export interface Assembly {
  bytes: number[];
  /** 每个已占用字节的源行，0 代表未占用。 */
  owners: number[];
  instructions: Map<number, number>;
  lineAddresses: Map<number, number>;
  labels: Map<string, number>;
}
const ident = /^[A-Za-z][A-Za-z0-9_]*$/;
const register = /^R([0-3])$/i;
function literal(s: string) {
  if (/^'[\x00-\x7f]'$/.test(s)) return s.charCodeAt(1);
  const m = /^([+-]?)(0x[\da-f]+|0b[01]+|\d+)$/i.exec(s);
  return m ? (m[1] === '-' ? -1 : 1) * Number(m[2]) : NaN;
}
function operands(line: number, text: string) {
  if (!text.trim()) return [];
  // 保留字符 ',' 和 ';'，仅把引号外的逗号当成分隔符。
  const parts = text.match(/(?:'[\x00-\x7f]'|[^,'])+|,/g) ?? [];
  if (parts.join('') !== text) throw new AssemblyError(line, '字符常量须为单个 ASCII 字符');
  const result: string[] = [];
  let arg = '';
  for (const part of parts) {
    if (part === ',') { result.push(arg.trim()); arg = ''; }
    else arg += part;
  }
  result.push(arg.trim());
  if (result.some(s => !s)) throw new AssemblyError(line, '缺少操作数');
  return result;
}

function sourceLine(raw: string) {
  const body = raw.replace(/'[\x00-\x7f]'|;.*/g, s => s.startsWith(';') ? '' : s).trim();
  const label = /^([A-Za-z][A-Za-z0-9_]*)\s*:/.exec(body);
  const instruction = label ? body.slice(label[0].length).trim() : body;
  const [, word = '', rest = ''] = /^(\S+)\s*([\s\S]*)$/.exec(instruction) ?? [];
  return { label: label?.[1], word, rest };
}

/** .org 或 .zero 前向引用时求每行的地址。已知起点向依赖它的行传播，每条边只访问一次。 */
function layoutLabels(lines: ReturnType<typeof sourceLine>[]) {
  const definitions = new Map<string, number>();
  lines.forEach(({label}, i) => { if (label) definitions.set(label, i); });
  const sum = new Float64Array(lines.length + 1);
  const missing = new Uint8Array(lines.length + 1);
  const consumers = Array.from({length: lines.length + 1}, () => [] as number[]);
  const ready = [0];
  lines.forEach(({word, rest}, i) => {
    const next = i + 1, name = word.toUpperCase();
    const depend = (row: number) => { consumers[row].push(next); missing[next]++; };
    if (name !== '.ORG') depend(i);
    if (name === '.ORG' || name === '.ZERO') {
      const arg = rest.trim();
      if (ident.test(arg)) {
        const row = definitions.get(arg);
        if (row === undefined) throw new AssemblyError(next, '未定义的标号：' + arg);
        depend(row);
      } else sum[next] = literal(arg);
    } else sum[next] = name === '.BYTE' ? operands(next, rest).length : word ? 2 : 0;
    if (!missing[next]) ready.push(next);
  });
  for (let j = 0; j < ready.length; j++) {
    const row = ready[j];
    for (const next of consumers[row]) {
      sum[next] += sum[row];
      if (--missing[next] === 0) ready.push(next);
    }
  }
  return (name: string, line: number) => {
    const row = definitions.get(name);
    if (row === undefined) throw new AssemblyError(line, '未定义的标号：' + name);
    if (missing[row]) throw new AssemblyError(line, '标号的位置循环依赖：' + name);
    return sum[row];
  };
}

export function assemble(source: string, isa?: readonly string[]): Assembly {
  const lines = source.split(/\r?\n/).map(sourceLine);
  let layout: ReturnType<typeof layoutLabels> | undefined;
  const labels = new Map<string, number>(), instructions = new Map<number,number>(), lineAddresses = new Map<number,number>();
  const bytes = Array<number>(256).fill(0), owners = bytes.slice();
  const pending: { at: number; line: number; token: string; address: boolean }[] = [];
  let cursor = 0;
  const number = (token: string, line: number, min: number, max: number, layoutDirective = false) => {
    let n = literal(token);
    if (ident.test(token)) {
      const address = labels.get(token);
      if (address !== undefined) n = address;
      else if (layoutDirective) {
        layout ??= layoutLabels(lines);
        n = layout(token, line);
      } else throw new AssemblyError(line, '未定义的标号或无效操作数：' + token);
    }
    if (!Number.isInteger(n) || n < min || n > max) throw new AssemblyError(line, '操作数 ' + token + ' 必须是 ' + min + ' 到 ' + max + ' 的整数或标号');
    return n;
  };
  const put = (byte: number, line: number) => {
    if (cursor >= 256) throw new AssemblyError(line, '程序超过 256 字节');
    if (owners[cursor]) throw new AssemblyError(line, hex(cursor) + ' 和第 ' + owners[cursor] + ' 行重叠');
    owners[cursor] = line; bytes[cursor++] = byte;
  };
  for (const [i, { label, word, rest }] of lines.entries()) {
    const line = i + 1;
    if (label) {
      const name = label;
      if (mnemonics.includes(name.toUpperCase()) || /^(?:R[0-3]|PC|SP)$/i.test(name)) throw new AssemblyError(line, '标号不能使用助记符或寄存器名：'+name);
      if (labels.has(name)) throw new AssemblyError(line, '标号重复：'+name);
      labels.set(name,cursor);
    }
    if (!word) continue;
    const name = word.toUpperCase(), args = operands(line, rest);
    const arity = (n: number) => { if (args.length !== n) throw new AssemblyError(line, name + ' 需要 ' + n + ' 个操作数'); };
    if (name === '.ORG' || name === '.ZERO') {
      arity(1);
      if (name === '.ORG') cursor = number(args[0],line,0,255,true);
      else { const count = number(args[0],line,0,256,true); for (let j=0;j<count;j++) put(0,line); }
      continue;
    }
    const defer = (token: string, address: boolean) => { pending.push({ at:cursor, line, token, address }); put(0,line); };
    if (name === '.BYTE') {
      if (!args.length) throw new AssemblyError(line,'.byte 缺少数据');
      args.forEach(s => defer(s,false)); continue;
    }
    const variants = encodings.filter(e => e.name === name);
    if (!variants.length) throw new AssemblyError(line,'不认识的助记符：'+word);
    if (isa && !isa.includes(name)) throw new AssemblyError(line,'这一处只开放 '+isa.join('、'));
    const form = variants[0].form;
    arity(form === 'none' ? 0 : form === 'reg' || form === 'jump' ? 1 : 2);
    const reg = (s: string) => {
      if (!register.test(s)) throw new AssemblyError(line,'需要寄存器 R0–R3，得到 '+s);
      return Number(s[1]);
    };
    const d = form === 'none' || form === 'jump' ? 0 : reg(args[0]);
    let token = form === 'jump' ? args[0] : args[1];
    if (form === 'direct') {
      const m = /^\[\s*(.*?)\s*\]$/.exec(token);
      if (!m) throw new AssemblyError(line, '访存地址要写在方括号里');
      token = m[1];
    }
    const variant = variants.length === 1 || register.test(token) === (form === 'rr') ? variants[0] : variants[1];
    instructions.set(cursor,line); lineAddresses.set(line,cursor);
    put(variant.opcode * 4 + d,line);
    if (variant.form === 'rr' || variant.form === 'indirect') put(reg(token),line);
    else if (token !== undefined) defer(token, variant.form === 'direct' || form === 'jump');
    else put(0,line);
  }
  pending.forEach(p => { bytes[p.at] = number(p.token,p.line,p.address ? 0 : -128,255) & 255; });
  return { bytes, owners, labels, instructions, lineAddresses };
}

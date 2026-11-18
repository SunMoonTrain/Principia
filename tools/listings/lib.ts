import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { LineCounter, parseDocument, Scalar, visit } from 'yaml';
import { parseFragment, parseLessonMarkdown, type MdNode } from '../../compiler/markdown.ts';
import { inScope, listDomains } from '../statements/lib.ts';

type Language = 'rust' | 'typescript' | 'python';
interface Listing { lang: Language; code: string; first: number; file: string }

function listings(file: string, source: string): Listing[] {
  const blocks: Listing[] = [];
  function collect(node: MdNode, offset: number) {
    if (node.type === 'containerDirective' && node.name === 'anim') return;
    const lang = node.lang;
    if (node.type === 'code' && (lang === 'rust' || lang === 'typescript' || lang === 'python')) {
      blocks.push({ lang, code: node.value ?? '', first: offset + node.position!.start.line + 1, file });
    }
    node.children?.forEach((child) => collect(child, offset));
  }
  if (!source.includes('~~~') && !source.includes('```')) return blocks;
  if (path.extname(file) === '.md') collect(parseLessonMarkdown(source), 0);
  else {
    const lines = new LineCounter();
    const doc = parseDocument(source, { lineCounter: lines });
    if (doc.errors.length) throw doc.errors[0];
    visit(doc, { Scalar(_, node) {
      if (node.type === Scalar.BLOCK_LITERAL && typeof node.value === 'string' && node.range)
        collect(parseFragment(node.value), lines.linePos(node.range[0]).line);
    } });
  }
  return blocks;
}

interface Result { status: '通过' | '失败' | '跳过'; message: string; line?: number }
const tsc = createRequire(import.meta.url).resolve('typescript/bin/tsc');
function check(block: Listing, dir: string, env: NodeJS.ProcessEnv): Result {
  const run = (command: string, args: string[]) => spawnSync(command, args, {
    cwd: dir, env, encoding: 'utf8', windowsHide: true, timeout: 30000, maxBuffer: 4 * 1024 * 1024,
  });
  type Execution = ReturnType<typeof run>;
  const result = (r: Execution, line?: number): Result => ({
    status: r.status === 0 ? '通过' : '失败', line,
    message: [r.stdout, r.stderr, r.error?.message].filter(Boolean).join('\n').trimEnd(),
  });
  const missing = (r: Execution) => (r.error as NodeJS.ErrnoException | undefined)?.code === 'ENOENT';
  const write = (name: string) => fs.writeFileSync(path.join(dir, name), block.code + '\n');
  if (block.lang === 'python') {
    write('listing.py');
    const r = run('python', ['-I', '-X', 'utf8', 'listing.py']);
    if (missing(r)) return { status: '跳过', message: 'PATH 中找不到 Python，没有检查' };
    if (r.status !== 0 && (r.stderr ?? '').trimEnd().endsWith("ModuleNotFoundError: No module named 'numpy'") &&
      run('python', ['-I', '-c', "import importlib.util, sys; sys.exit(int(importlib.util.find_spec('numpy') is None))"]).status === 1)
      return { status: '跳过', message: '缺 NumPy，没有检查' };
    const match = [...(r.stderr ?? '').matchAll(/File "[^"]*listing\.py", line (\d+)/g)].at(-1);
    return result(r, match && Number(match[1]));
  }
  if (block.lang === 'typescript') {
    write('listing.ts');
    const r = run(process.execPath, [tsc, '--strict', '--noEmit', '--target', 'ES2022', '--module', 'ESNext', '--pretty', 'false', 'listing.ts']);
    const match = /listing\.ts\((\d+),/.exec(r.stdout ?? '');
    return result(r, match ? Number(match[1]) : undefined);
  }
  write('listing.rs');
  const exe = process.platform === 'win32' ? 'listing.exe' : 'listing';
  const rust = (library: boolean) => run('rustc', ['--edition', '2024', '--error-format=json', '--crate-type', library ? 'lib' : 'bin',
    'listing.rs', '-o', library ? 'listing.rlib' : exe]);
  let compiled = rust(false);
  if (missing(compiled)) return { status: '跳过', message: 'PATH 中找不到 rustc，没有检查' };
  // 让 Rust 自己识别入口；注释、字符串和 impl 里的 fn main 都不能充当程序入口。
  const library = (compiled.stderr ?? '').includes('"code":"E0601"');
  if (library) compiled = rust(true);
  if (compiled.status !== 0) {
    const messages: string[] = [];
    let line: number | undefined;
    for (const entry of (compiled.stderr ?? '').split(/\r?\n/).filter(Boolean)) {
      try {
        const d = JSON.parse(entry) as { rendered?: string; spans?: { file_name: string; is_primary: boolean; line_start: number }[] };
        line ??= d.spans?.find((s) => s.is_primary && s.file_name === 'listing.rs')?.line_start;
        messages.push(d.rendered ?? entry);
      } catch { messages.push(entry); }
    }
    return { ...result(compiled, line), message: messages.join('\n').trimEnd() || result(compiled).message };
  }
  if (library) return { status: '通过', message: '按库编译通过' };
  const r = run(path.join(dir, exe), []);
  const match = /listing\.rs:(\d+):/.exec(r.stderr ?? '');
  return result(r, match ? Number(match[1]) : undefined);
}

export function checkListings(root: string, scopes: string[], options: { env?: NodeJS.ProcessEnv; tmp?: string } = {}) {
  const matched = new Set<string>(), messages: string[] = [];
  const counts = { 通过: 0, 失败: 0, 跳过: 0 };
  for (const domain of listDomains(root)) for (const lesson of domain.lessons) {
    const hits = scopes.filter((s) => inScope(lesson.id, s));
    if (scopes.length && !hits.length) continue;
    hits.forEach((s) => matched.add(s));
    for (const name of ['lesson.md', 'problems.yaml']) {
      const absolute = path.join(lesson.dir, name), file = path.relative(root, absolute);
      if (!fs.existsSync(absolute)) continue;
      try {
        for (const block of listings(file, fs.readFileSync(absolute, 'utf8'))) {
          const dir = fs.mkdtempSync(path.join(options.tmp ?? os.tmpdir(), 'principia-listing-'));
          try {
            const r = check(block, dir, options.env ?? process.env);
            counts[r.status]++;
            const where = r.line === undefined ? '代码起始行' : '块内第 ' + r.line + ' 行';
            messages.push(file + ':' + (block.first + (r.line ?? 1) - 1) + '（' + where + '） ' + block.lang + ' ' + r.status
              + (r.message ? '\n' + r.message : ''));
          } finally { fs.rmSync(dir, { recursive: true, force: true, maxRetries: 4, retryDelay: 100 }); }
        }
      } catch (error) { counts.失败++; messages.push(file + '：' + (error as Error).message); }
    }
  }
  const unmatched = scopes.filter((s) => !matched.has(s));
  for (const s of unmatched) messages.push('没有找到「' + s + '」对应的小节');
  messages.push('代码清单：通过 ' + counts.通过 + '，失败 ' + counts.失败 + '，跳过 ' + counts.跳过);
  return { messages, counts, ok: counts.失败 === 0 && !unmatched.length };
}

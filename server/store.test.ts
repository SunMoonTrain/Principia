import { execFileSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import type { ProgressOp } from '../shared/progress.ts';
import { archiveMessage, archiveProgress } from './archive.ts';
import { ProgressStore } from './store.ts';

const L = 'math.analysis.completeness';
const dirs: string[] = [];
function tempDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'principia-progress-'));
  dirs.push(dir);
  return dir;
}
afterEach(() => {
  for (const dir of dirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

const attempt = (id: string, at: string, result: 'correct' | 'wrong' | 'gave-up', input: string, problem = 'p1'): ProgressOp => ({
  type: 'attempt',
  lesson: L,
  problem,
  attempt: { id, at, input, result },
});

describe('读写 progress/', () => {
  it('按定好的格式写：lessons.yaml 和 problems/<领域>.yaml', async () => {
    const store = new ProgressStore(path.join(tempDir(), 'progress'));
    await store.apply([
      { type: 'lesson-open', lesson: L, at: '2026-11-08T15:30:12+08:00' },
      attempt('3f2a9c1e-0000-0000-0000-000000000001', '2026-11-08T15:41:02+08:00', 'wrong', '1.7'),
      { type: 'hint', lesson: L, problem: 'p1', level: 1, at: '2026-11-08T15:41:40+08:00' },
      attempt('9c1b0000-0000-0000-0000-000000000002', '2026-11-08T15:42:30+08:00', 'correct', 'sqrt(3)'),
    ]);
    const problems = fs.readFileSync(store.problemsFile('math.analysis'), 'utf8');
    expect(problems).toContain(`${L}:\n  p1:\n    attempts:\n      - id: 3f2a9c1e-0000-0000-0000-000000000001\n        at: 2026-11-08T15:41:02+08:00\n        input: '1.7'\n        result: wrong`);
    expect(problems).toContain('    hints:\n      1: 2026-11-08T15:41:40+08:00');
    expect(fs.readFileSync(store.lessonsFile, 'utf8')).toContain(`${L}:\n  startedAt: 2026-11-08T15:30:12+08:00`);
    expect(store.read().problems[L].p1.attempts).toHaveLength(2);
  });

  it('同时到达的很多操作排队写，一条不丢', async () => {
    const store = new ProgressStore(path.join(tempDir(), 'progress'));
    await Promise.all(
      Array.from({ length: 40 }, (_, i) => store.apply([attempt(`id-${String(i).padStart(6, '0')}`, `2026-11-08T15:${String(i).padStart(2, '0')}:00+08:00`, 'wrong', String(i))])),
    );
    expect(store.read().problems[L].p1.attempts).toHaveLength(40);
  });

  it('保留文件里不认识的字段（手动加的、以后台阶加的）', async () => {
    const store = new ProgressStore(path.join(tempDir(), 'progress'));
    fs.mkdirSync(path.dirname(store.problemsFile('math.analysis')), { recursive: true });
    fs.writeFileSync(store.problemsFile('math.analysis'), `${L}:\n  p5:\n    note: 手写的备注\n`);
    await store.apply([attempt('aaaaaaaa', '2026-11-08T15:41:02+08:00', 'wrong', '1', 'p1')]);
    expect(parse(fs.readFileSync(store.problemsFile('math.analysis'), 'utf8'))[L].p5.note).toBe('手写的备注');
  });

  it('台阶 4 的字段按定好的格式和顺序写；批语写成块写法', async () => {
    const store = new ProgressStore(path.join(tempDir(), 'progress'));
    await store.apply([
      { type: 'grade', lesson: L, problem: 'p5', grade: { id: '5e1d0c2a-0001', at: '2026-11-09T11:05:00+08:00', result: 'partial', comment: '第二步没说明 $A+B$ 非空。' } },
      { type: 'hint', lesson: L, problem: 'p5', level: 1, at: '2026-11-09T10:10:00+08:00' },
      { type: 'review-dismiss', lesson: L, problem: 'p1', at: '2026-11-10T21:00:00+08:00' },
      { type: 'unsure', lesson: L, problem: 'p1', value: true, at: '2026-11-09T10:02:11+08:00' },
      attempt('aaaaaaaa', '2026-11-08T15:41:02+08:00', 'correct', 'sqrt(3)'),
    ]);
    const text = fs.readFileSync(store.problemsFile('math.analysis'), 'utf8');
    expect(text).toContain(
      `  p1:\n    attempts:\n      - id: aaaaaaaa\n        at: 2026-11-08T15:41:02+08:00\n        input: sqrt(3)\n        result: correct\n` +
        `    unsure: true\n    unsureAt: 2026-11-09T10:02:11+08:00\n    reviewDismissedAt: 2026-11-10T21:00:00+08:00\n`,
    );
    expect(text).toContain(
      `  p5:\n    hints:\n      1: 2026-11-09T10:10:00+08:00\n    status: graded\n    statusAt: 2026-11-09T11:05:00+08:00\n` +
        `    grades:\n      - id: 5e1d0c2a-0001\n        at: 2026-11-09T11:05:00+08:00\n        result: partial\n        comment: |-\n          第二步没说明 $A+B$ 非空。\n`,
    );
    // 读回来一样
    expect(store.read().problems[L].p5.grades?.[0].comment).toBe('第二步没说明 $A+B$ 非空。');
  });

  it('「内容有误」写进 content/issues.yaml：只往后追加，按 id 去重，原文写成块写法', async () => {
    const dir = tempDir();
    const store = new ProgressStore(path.join(dir, 'progress'));
    const issue = { id: '7f3c2a1e-0001', at: '2026-11-09T10:20:00+08:00', lesson: L, part: 'p3 / 解答', quote: '偶数项从下方逼近 $1$', note: '应该是奇数项？' };
    await store.apply([{ type: 'issue', issue }, { type: 'issue', issue }]);
    await store.apply([{ type: 'issue', issue: { id: '7f3c2a1e-0002', at: '2026-11-09T10:25:00+08:00', lesson: L, part: '讲解 / 有理数轴上的洞' } }]);
    const file = path.join(dir, 'content', 'issues.yaml');
    expect(store.issuesFile).toBe(file);
    const text = fs.readFileSync(file, 'utf8');
    expect(text).toContain(
      `- id: 7f3c2a1e-0001\n  at: 2026-11-09T10:20:00+08:00\n  lesson: ${L}\n  part: p3 / 解答\n  quote: |-\n    偶数项从下方逼近 $1$\n  note: |-\n    应该是奇数项？\n- id: 7f3c2a1e-0002\n`,
    );
    expect(store.readIssues().map((i) => i.id)).toEqual(['7f3c2a1e-0001', '7f3c2a1e-0002']);
    // 进度文件不受影响
    expect(fs.existsSync(store.dir)).toBe(false);
  });

  it('issues.yaml 被改成了别的样子：报错，不覆盖', async () => {
    const dir = tempDir();
    const store = new ProgressStore(path.join(dir, 'progress'));
    fs.mkdirSync(path.dirname(store.issuesFile), { recursive: true });
    fs.writeFileSync(store.issuesFile, 'a: 1\n');
    await expect(store.apply([{ type: 'issue', issue: { id: 'iiiiiiii', at: '2026-11-09T10:20:00+08:00', lesson: L, part: 'p1' } }])).rejects.toThrow('应该是一个列表');
    expect(fs.readFileSync(store.issuesFile, 'utf8')).toBe('a: 1\n');
  });

  it('文件被手动改坏时报错，不覆盖', async () => {
    const store = new ProgressStore(path.join(tempDir(), 'progress'));
    fs.mkdirSync(store.dir, { recursive: true });
    fs.writeFileSync(store.lessonsFile, 'a: b: c\n');
    await expect(store.apply([{ type: 'lesson-open', lesson: L, at: '2026-11-08T15:30:12+08:00' }])).rejects.toThrow('不是合法的 YAML');
    expect(fs.readFileSync(store.lessonsFile, 'utf8')).toBe('a: b: c\n');
  });

  it('写到一半强制结束进程，文件仍是完整的旧版本或新版本', async () => {
    const dir = tempDir();
    const file = path.join(dir, 'big.yaml');
    const fsutil = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'compiler', 'fsutil.ts');
    // 子进程不停地整份重写一个 2 MB 的文件，每一版内容都完整、可识别
    const script = `
      import { writeFileAtomic } from ${JSON.stringify(pathToUrl(fsutil))};
      for (let v = 1; ; v++) await writeFileAtomic(${JSON.stringify(file)}, 'version: ' + v + '\\n' + 'x'.repeat(2_000_000) + '\\nend: ' + v + '\\n');
    `;
    // 临时目录里没有 package.json，用 .mts 才按 ES 模块（支持顶层 await）处理
    fs.writeFileSync(path.join(dir, 'writer.mts'), script);
    // 直接用 node 加载 tsx，杀掉的就是正在写文件的那个进程（tsx 命令行会再套一层子进程）
    const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
    const child = spawn(process.execPath, ['--import', 'tsx', path.join(dir, 'writer.mts')], { cwd: repoRoot, stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '';
    child.stderr.on('data', (d: Buffer) => (stderr += d.toString()));
    const exited = new Promise((r) => child.once('exit', r));
    // 等它写出至少一版
    for (let i = 0; i < 100 && !fs.existsSync(file); i++) await new Promise((r) => setTimeout(r, 100));
    await new Promise((r) => setTimeout(r, 800));
    child.kill('SIGKILL');
    await exited;
    expect(stderr).toBe('');
    const text = fs.readFileSync(file, 'utf8');
    const version = /^version: (\d+)\n/.exec(text)?.[1];
    expect(version).toBeDefined();
    expect(text.endsWith(`\nend: ${version}\n`)).toBe(true);
  }, 20000);
});

function pathToUrl(p: string): string {
  return 'file:///' + p.split(path.sep).join('/').replace(/^\/+/, '');
}

describe('存档', () => {
  function repo(): string {
    const dir = tempDir();
    const run = (...args: string[]): string => execFileSync('git', args, { cwd: dir, encoding: 'utf8' });
    run('init', '-q');
    run('config', 'user.email', 'test@example.com');
    run('config', 'user.name', 'test');
    fs.writeFileSync(path.join(dir, 'README.md'), 'x\n');
    run('add', '.');
    run('commit', '-q', '-m', 'init');
    return dir;
  }
  const git = (dir: string, ...args: string[]): string => execFileSync('git', args, { cwd: dir, encoding: 'utf8' });
  const title = (id: string): string => ({ [L]: '实数的完备性' })[id] ?? id;

  it('只提交 progress/，提交信息列出学完的小节和做过的题目数；没有改动时不提交', async () => {
    const dir = repo();
    const store = new ProgressStore(path.join(dir, 'progress'));
    // 仓库里另有一个已暂存的改动，存档不能把它带进去
    fs.writeFileSync(path.join(dir, 'other.txt'), 'staged\n');
    git(dir, 'add', 'other.txt');

    await store.apply([
      { type: 'lesson-status', lesson: L, status: 'completed', at: '2026-11-08T16:10:05+08:00' },
      attempt('aaaaaaaa', '2026-11-08T15:41:02+08:00', 'wrong', '1.7', 'p1'),
      attempt('bbbbbbbb', '2026-11-08T15:42:30+08:00', 'correct', 'sqrt(3)', 'p1'),
      attempt('cccccccc', '2026-11-08T15:50:00+08:00', 'correct', 'AD', 'p2'),
    ]);
    const first = await archiveProgress(store, dir, title);
    expect(first).toMatchObject({ committed: true, message: '学完 1 节：实数的完备性；做题 2 道' });
    expect(git(dir, 'show', '--name-only', '--format=', 'HEAD').trim().split('\n').sort()).toEqual([
      'progress/lessons.yaml',
      'progress/problems/math.analysis.yaml',
    ]);
    expect(git(dir, 'diff', '--cached', '--name-only').trim()).toBe('other.txt');

    expect(await archiveProgress(store, dir, title)).toMatchObject({ committed: false });

    // 第二次只算新做的题
    await store.apply([attempt('dddddddd', '2026-11-08T17:00:00+08:00', 'wrong', '0', 'p3')]);
    expect(await archiveProgress(store, dir, title)).toMatchObject({ committed: true, message: '做题 1 道' });
  });

  it('批改记录算做题；写过的笔记另算「写笔记 N 题」，另存的冲突版本不算', async () => {
    const dir = repo();
    const store = new ProgressStore(path.join(dir, 'progress'));
    await store.apply([{ type: 'grade', lesson: L, problem: 'p5', grade: { id: 'gggggggg-1', at: '2026-11-09T11:05:00+08:00', result: 'pass' } }]);
    const notesDir = path.join(dir, 'progress', 'notes', L);
    fs.mkdirSync(notesDir, { recursive: true });
    fs.writeFileSync(path.join(notesDir, 'p5.md'), '思路\n');
    fs.writeFileSync(path.join(notesDir, 'p7.md'), '想法\n');
    fs.writeFileSync(path.join(notesDir, 'p5.conflict-20261109-104000.md'), '另一份\n');
    const result = await archiveProgress(store, dir, title);
    expect(result).toMatchObject({ committed: true, message: '做题 1 道；写笔记 2 题' });
    expect(git(dir, 'show', '--name-only', '--format=', 'HEAD').trim().split('\n')).toContain(`progress/notes/${L}/p5.conflict-20261109-104000.md`);
    // 改一份、删一份：只算改的
    fs.writeFileSync(path.join(notesDir, 'p5.md'), '思路，补了第二步\n');
    fs.rmSync(path.join(notesDir, 'p7.md'));
    expect(await archiveProgress(store, dir, title)).toMatchObject({ committed: true, message: '写笔记 1 题' });
  });

  it('只看了提示、打开了小节时，提交信息写「更新学习进度」', () => {
    expect(archiveMessage({ lessons: {}, problems: {} }, { lessons: { [L]: { startedAt: '2026-11-08T15:30:12+08:00' } }, problems: {} }, title)).toBe(
      '更新学习进度',
    );
  });
});

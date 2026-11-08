import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { buildServer } from './app.ts';

const L = 'math.analysis.completeness';
const dirs: string[] = [];
afterEach(() => {
  for (const dir of dirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

async function server() {
  const dataRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'principia-api-'));
  dirs.push(dataRoot);
  return buildServer({ codeRoot: dataRoot, dataRoot, serveSite: false });
}

describe('进度接口', () => {
  it('一批里格式不对的操作单独丢掉，别的照常写入', async () => {
    const app = await server();
    const res = await app.inject({
      method: 'POST',
      url: '/api/progress/ops',
      payload: {
        ops: [
          { type: 'hint', lesson: L, problem: 'p1', level: 1, at: '昨天' },
          { type: 'attempt', lesson: L, problem: 'p1', attempt: { id: 'aaaaaaaa-1', at: '2026-11-08T15:41:02+08:00', input: '1.7', result: 'wrong' } },
          { type: 'lesson-open', lesson: L, at: '2026-11-08T15:30:12+08:00' },
        ],
      },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ ok: true, applied: 2, rejected: [0] });
    const progress = (await app.inject({ method: 'GET', url: '/api/progress' })).json();
    expect(progress.problems[L].p1.attempts).toHaveLength(1);
    expect(progress.problems[L].p1.hints).toBeUndefined();
    expect(progress.lessons[L].startedAt).toBe('2026-11-08T15:30:12+08:00');
    await app.close();
  });

  it('「内容有误」走同一个接口，写进数据仓库的 content/issues.yaml', async () => {
    const app = await server();
    const res = await app.inject({
      method: 'POST',
      url: '/api/progress/ops',
      payload: { ops: [{ type: 'issue', issue: { id: 'iiiiiiii-1', at: '2026-11-09T10:20:00+08:00', lesson: L, part: 'p3 / 解答', quote: '$1$' } }] },
    });
    expect(res.json()).toEqual({ ok: true, applied: 1, rejected: [] });
    expect(fs.readFileSync(path.join(dirs[0], 'content', 'issues.yaml'), 'utf8')).toContain('part: p3 / 解答');
    await app.close();
  });

  it('笔记：保存、读回；拿着旧指纹保存回 409，另存冲突版本；可以删掉冲突版本', async () => {
    const app = await server();
    const put = (text: string, base: string | null) => app.inject({ method: 'PUT', url: `/api/notes/${L}/p5`, payload: { text, base } });
    const first = await put('第一版 $x$', null);
    expect(first.statusCode).toBe(200);
    const { version } = first.json() as { version: string };
    expect((await put('第二版', version)).statusCode).toBe(200);
    const conflict = await put('另一台设备', version);
    expect(conflict.statusCode).toBe(409);
    const body = conflict.json() as { conflict: { file: string; text: string }; current: { text: string } };
    expect(body.current.text).toBe('第二版');
    expect(body.conflict.text).toBe('另一台设备');
    const lesson = (await app.inject({ method: 'GET', url: `/api/notes/${L}` })).json() as { notes: Record<string, { text: string }>; conflicts: Record<string, unknown[]> };
    expect(lesson.notes.p5.text).toBe('第二版');
    expect(lesson.conflicts.p5).toHaveLength(1);
    const del = await app.inject({ method: 'DELETE', url: `/api/notes/${L}/p5/conflicts/${body.conflict.file}` });
    expect(del.json()).toEqual({ deleted: true });
    // 题号、文件名不对的请求一律 400
    expect((await app.inject({ method: 'PUT', url: `/api/notes/${L}/p9`, payload: { text: 'x', base: null } })).statusCode).toBe(400);
    expect((await app.inject({ method: 'DELETE', url: `/api/notes/${L}/p5/conflicts/p5.md` })).statusCode).toBe(400);
    expect((await app.inject({ method: 'DELETE', url: `/api/notes/${L}/p5/conflicts/p6.conflict-20261109-104000.md` })).statusCode).toBe(400);
    await app.close();
  });

  it('请求本身不对（没有 ops 数组、一批超过 1000 条）回 400，什么也不写', async () => {
    const app = await server();
    expect((await app.inject({ method: 'POST', url: '/api/progress/ops', payload: { op: [] } })).statusCode).toBe(400);
    const many = Array.from({ length: 1001 }, () => ({ type: 'lesson-open', lesson: L, at: '2026-11-08T15:30:12+08:00' }));
    expect((await app.inject({ method: 'POST', url: '/api/progress/ops', payload: { ops: many } })).statusCode).toBe(400);
    expect((await app.inject({ method: 'GET', url: '/api/progress' })).json().lessons).toEqual({});
    await app.close();
  });
});

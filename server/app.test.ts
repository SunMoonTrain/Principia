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

  it('请求本身不对（没有 ops 数组、一批超过 1000 条）回 400，什么也不写', async () => {
    const app = await server();
    expect((await app.inject({ method: 'POST', url: '/api/progress/ops', payload: { op: [] } })).statusCode).toBe(400);
    const many = Array.from({ length: 1001 }, () => ({ type: 'lesson-open', lesson: L, at: '2026-11-08T15:30:12+08:00' }));
    expect((await app.inject({ method: 'POST', url: '/api/progress/ops', payload: { ops: many } })).statusCode).toBe(400);
    expect((await app.inject({ method: 'GET', url: '/api/progress' })).json().lessons).toEqual({});
    await app.close();
  });
});

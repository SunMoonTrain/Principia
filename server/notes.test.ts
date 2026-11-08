import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { noteVersion, NotesStore } from './notes.ts';

const L = 'math.analysis.completeness';
const dirs: string[] = [];
function store(): NotesStore {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'principia-notes-'));
  dirs.push(dir);
  return new NotesStore(path.join(dir, 'progress', 'notes'));
}
afterEach(() => {
  for (const dir of dirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

describe('思路笔记', () => {
  it('写进 progress/notes/<小节>/<题号>.md，就是原文；带公式的笔记读回来一字不差', async () => {
    const notes = store();
    const text = '先证 $\\sup A+\\sup B$ 是上界。\n\n$$\\sup(A+B)\\le s+t$$\n';
    expect(await notes.save(L, 'p5', text, null)).toEqual({ ok: true, version: noteVersion(text) });
    expect(fs.readFileSync(notes.file(L, 'p5'), 'utf8')).toBe(text);
    expect(notes.readLesson(L)).toEqual({ notes: { p5: { text, version: noteVersion(text) } }, conflicts: {} });
  });

  it('接着上一版改：指纹对得上就覆盖', async () => {
    const notes = store();
    const first = await notes.save(L, 'p5', '第一版', null);
    const second = await notes.save(L, 'p5', '第二版', first.ok ? first.version : null);
    expect(second.ok).toBe(true);
    expect(fs.readFileSync(notes.file(L, 'p5'), 'utf8')).toBe('第二版');
  });

  it('另一台设备改过（指纹对不上）：不覆盖，这次的内容另存为 <题号>.conflict-<时间>.md', async () => {
    const notes = store();
    const base = await notes.save(L, 'p5', '电脑上写的', null);
    await notes.save(L, 'p5', '电脑上又改了', base.ok ? base.version : null);
    // iPad 还拿着第一版的指纹
    const result = await notes.save(L, 'p5', 'iPad 上写的', base.ok ? base.version : null, new Date(2026, 10, 9, 10, 40, 0));
    expect(result).toEqual({
      ok: false,
      conflict: { file: 'p5.conflict-20261109-104000.md', text: 'iPad 上写的' },
      current: { text: '电脑上又改了', version: noteVersion('电脑上又改了') },
    });
    expect(fs.readFileSync(notes.file(L, 'p5'), 'utf8')).toBe('电脑上又改了');
    expect(notes.readLesson(L).conflicts).toEqual({ p5: [{ file: 'p5.conflict-20261109-104000.md', text: 'iPad 上写的' }] });
    // 同一秒又冲突一次：文件名加序号，不覆盖前一份
    const again = await notes.save(L, 'p5', 'iPad 上又写的', base.ok ? base.version : null, new Date(2026, 10, 9, 10, 40, 0));
    expect(again.ok ? '' : again.conflict.file).toBe('p5.conflict-20261109-104000-2.md');
  });

  it('补交的内容和服务端现在的一样：不算冲突', async () => {
    const notes = store();
    await notes.save(L, 'p5', '同一份', null);
    expect(await notes.save(L, 'p5', '同一份', null)).toEqual({ ok: true, version: noteVersion('同一份') });
  });

  it('清空笔记就删掉文件；另一台设备删掉了，这边接着写不算冲突', async () => {
    const notes = store();
    const saved = await notes.save(L, 'p7', '想法', null);
    expect(await notes.save(L, 'p7', '', saved.ok ? saved.version : null)).toEqual({ ok: true, version: null });
    expect(fs.existsSync(notes.file(L, 'p7'))).toBe(false);
    expect(fs.existsSync(path.dirname(notes.file(L, 'p7')))).toBe(false);
    expect((await notes.save(L, 'p7', '接着写', saved.ok ? saved.version : null)).ok).toBe(true);
  });

  it('删掉另存的版本：只认冲突文件的名字', async () => {
    const notes = store();
    const base = await notes.save(L, 'p5', 'a', null);
    await notes.save(L, 'p5', 'b', base.ok ? base.version : null);
    const conflict = await notes.save(L, 'p5', 'c', base.ok ? base.version : null);
    expect(notes.deleteConflict(L, 'p5.md')).toBe(false);
    expect(notes.deleteConflict(L, '../lessons.yaml')).toBe(false);
    expect(notes.deleteConflict(L, conflict.ok ? '' : conflict.conflict.file)).toBe(true);
    expect(notes.readLesson(L).conflicts).toEqual({});
    expect(fs.readFileSync(notes.file(L, 'p5'), 'utf8')).toBe('b');
  });
});

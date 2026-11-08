// 「存档」：把 progress/ 提交到 Git，只提交 progress/；提交信息统计自上次存档以来学了什么。
// 「上次存档」就是 HEAD 里的 progress/（别的提交不碰 progress/）。没有改动时不提交。

import { execFile } from 'node:child_process';
import path from 'node:path';
import { parse } from 'yaml';
import type { LessonProgress, ProblemProgress, ProgressState } from '../shared/progress.ts';
import type { ProgressStore } from './store.ts';

function git(cwd: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile('git', args, { cwd, windowsHide: true, maxBuffer: 64 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) reject(new Error(`git ${args[0]} 失败：${stderr || error.message}`));
      else resolve(stdout);
    });
  });
}

async function readCommitted(root: string, rel: string): Promise<ProgressState> {
  const show = async (file: string): Promise<unknown> => {
    try {
      return parse(await git(root, ['show', `HEAD:${file}`])) ?? {};
    } catch {
      return {};
    }
  };
  const lessons = (await show(`${rel}/lessons.yaml`)) as Record<string, LessonProgress>;
  const problems: Record<string, Record<string, ProblemProgress>> = {};
  const listed = await git(root, ['ls-tree', '-r', '--name-only', 'HEAD', '--', `${rel}/problems`]).catch(() => '');
  for (const file of listed.split('\n').filter((f) => f.endsWith('.yaml'))) {
    Object.assign(problems, (await show(file)) as Record<string, Record<string, ProblemProgress>>);
  }
  return { lessons, problems };
}

/** 例如「学完 2 节：实数的完备性、确界原理；做题 11 道」。做题数按题目数计，不按作答次数。 */
export function archiveMessage(before: ProgressState, after: ProgressState, title: (lessonId: string) => string): string {
  const changedTo = (status: string): string[] =>
    Object.keys(after.lessons)
      .filter((id) => after.lessons[id].status === status && before.lessons[id]?.status !== status)
      .sort()
      .map(title);
  const completed = changedTo('completed');
  const known = changedTo('known');
  let solved = 0;
  for (const [lesson, problems] of Object.entries(after.problems)) {
    for (const [problem, record] of Object.entries(problems)) {
      const old = new Set((before.problems[lesson]?.[problem]?.attempts ?? []).map((a) => a.id));
      if ((record.attempts ?? []).some((a) => !old.has(a.id))) solved++;
    }
  }
  const parts: string[] = [];
  if (completed.length) parts.push(`学完 ${completed.length} 节：${completed.join('、')}`);
  if (known.length) parts.push(`标为已会 ${known.length} 节：${known.join('、')}`);
  if (solved) parts.push(`做题 ${solved} 道`);
  return parts.join('；') || '更新学习进度';
}

export interface ArchiveResult {
  committed: boolean;
  message: string;
  commit?: string;
}

export async function archiveProgress(store: ProgressStore, root: string, title: (lessonId: string) => string): Promise<ArchiveResult> {
  const rel = path.relative(root, store.dir).split(path.sep).join('/');
  // -uall：即使 Git 配置里关了「显示未跟踪文件」，第一次存档的新文件也要看得到
  const status = await git(root, ['status', '--porcelain', '--untracked-files=all', '--', rel]);
  if (!status.trim()) return { committed: false, message: '没有新的进度，不用存档' };
  const message = archiveMessage(await readCommitted(root, rel), store.read(), title);
  await git(root, ['add', '--', rel]);
  // 带上路径只提交 progress/，暂存区里别的改动不受影响
  await git(root, ['commit', '-m', message, '--', rel]);
  const commit = (await git(root, ['rev-parse', '--short', 'HEAD'])).trim();
  return { committed: true, message, commit };
}

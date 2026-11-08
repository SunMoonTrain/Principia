import fs from 'node:fs';
import path from 'node:path';

/** 读文本文件：去掉 BOM，把 CRLF 统一成 LF（Windows 上的编辑器可能存成 CRLF）。 */
export function readText(file: string): string {
  return fs.readFileSync(file, 'utf8').replace(/^﻿/, '').replace(/\r\n?/g, '\n');
}

/** 相对 root 的正斜杠路径，用于报错和推 id（见 plan.md「Windows 上额外的坑」）。 */
export function relPosix(root: string, file: string): string {
  return path.relative(root, file).split(path.sep).join('/');
}

const RETRYABLE = new Set(['EPERM', 'EBUSY', 'EACCES']);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 先写临时文件再改名，写到一半中断也不会留下半个文件。
 * Windows 上目标文件被杀毒软件或编辑器占用时改名会报 EPERM，间隔几十毫秒重试几次。
 */
export async function writeFileAtomic(file: string, data: string): Promise<void> {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmp, data, 'utf8');
  for (let attempt = 0; ; attempt++) {
    try {
      fs.renameSync(tmp, file);
      return;
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code ?? '';
      if (!RETRYABLE.has(code) || attempt >= 8) {
        fs.rmSync(tmp, { force: true });
        throw error;
      }
      await sleep(30 * (attempt + 1));
    }
  }
}

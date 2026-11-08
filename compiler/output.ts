// 把编译结果写进 generated/：只重写有变化的文件；构建失败时只写校验报告，网站继续用上一次通过的内容。

import fs from 'node:fs';
import path from 'node:path';
import type { CompileResult } from './compile.ts';
import { writeFileAtomic } from './fsutil.ts';

export interface WriteSummary {
  written: string[];
  removed: string[];
}

export async function writeOutputs(outDir: string, result: CompileResult): Promise<WriteSummary> {
  const summary: WriteSummary = { written: [], removed: [] };
  const write = async (name: string, text: string): Promise<void> => {
    const file = path.join(outDir, ...name.split('/'));
    if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === text) return;
    await writeFileAtomic(file, text);
    summary.written.push(name);
  };

  if (result.files) {
    for (const [name, text] of result.files) await write(name, text);
    // 删掉已经不存在的领域的内容包
    const domainsDir = path.join(outDir, 'domains');
    if (fs.existsSync(domainsDir)) {
      for (const entry of fs.readdirSync(domainsDir)) {
        if (!result.files.has(`domains/${entry}`)) {
          fs.rmSync(path.join(domainsDir, entry), { force: true });
          summary.removed.push(`domains/${entry}`);
        }
      }
    }
  }
  await write('report.json', JSON.stringify(result.report, null, 2));
  return summary;
}

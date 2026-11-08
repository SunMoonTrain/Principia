// 命令行：npm run content（编译一次，失败时退出码为 1）、npm run content:watch（监听 content/ 自动重编）。

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compileContent, NOT_CONTENT } from './compile.ts';
import { formatReport } from './diagnostics.ts';
import { writeOutputs } from './output.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'generated');

async function runOnce(): Promise<boolean> {
  const started = Date.now();
  const result = compileContent(root);
  const summary = await writeOutputs(outDir, result);
  console.log(formatReport(result.report));
  const changed = summary.written.filter((f) => f !== 'report.json');
  console.log(
    `\n用时 ${Date.now() - started} ms` +
      (result.report.ok ? `；更新了 ${changed.length ? changed.join('、') : '0 个文件'}` : '；网站继续使用上一次通过的内容'),
  );
  return result.report.ok;
}

if (process.argv.includes('--watch')) {
  await runOnce();
  let timer: NodeJS.Timeout | undefined;
  let running = false;
  let pending = false;
  const trigger = (): void => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      if (running) {
        pending = true;
        return;
      }
      running = true;
      console.log(`\n—— ${new Date().toLocaleTimeString()} 内容有变化，重新编译 ——`);
      try {
        await runOnce();
      } catch (error) {
        console.error(error);
      }
      running = false;
      if (pending) {
        pending = false;
        trigger();
      }
    }, 150);
  };
  fs.watch(path.join(root, 'content'), { recursive: true }, (_event, name) => {
    if (!name || !NOT_CONTENT.has(name.toString())) trigger();
  });
  console.log('\n正在监听 content/ 的变化（Ctrl+C 退出）');
} else {
  process.exitCode = (await runOnce()) ? 0 : 1;
}

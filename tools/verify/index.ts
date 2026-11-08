// 跑 tools/verify/ 下所有验算脚本（文件名是小节 id），和 problems.yaml 里的标准答案比对。
// npm run verify；有任何一题不一致时退出码为 1。

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { runVerification, type Verification } from './lib.ts';

const dir = path.dirname(fileURLToPath(import.meta.url));
const scripts = fs
  .readdirSync(dir)
  .filter((f) => /^[a-z][a-z0-9-]*\.[a-z][a-z0-9-]*\.[a-z][a-z0-9-]*\.ts$/.test(f))
  .sort();

let ok = true;
for (const file of scripts) {
  const mod = (await import(pathToFileURL(path.join(dir, file)).href)) as { verification: Verification };
  if (!runVerification(mod.verification)) ok = false;
}
console.log(ok ? `\n全部一致（${scripts.length} 个小节）` : '\n有不一致的题目，见上面的 ✗');
process.exitCode = ok ? 0 : 1;

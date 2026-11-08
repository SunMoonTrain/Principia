// 只导出题干，给审内容 agent 独立验算用（docs/plan.md「内容生产与审查流水线」）：
//   npm run statements -- [范围…] [--tier easy,medium]
// 范围写学科、领域或小节的 id（如 math、math.analysis、math.analysis.completeness），不写就是全部。
// 结果写到标准输出，可以重定向到文件；范围对不上、文件读不了时退出码为 1。

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Tier } from '../../shared/content-types.ts';
import { exportStatements, TIERS } from './lib.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const USAGE = '用法：npm run statements -- [范围…] [--tier easy,medium]\n范围写学科、领域或小节的 id，如 math.analysis.completeness；不写就是全部。';

const scopes: string[] = [];
let tiers: Tier[] = [];
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '-h' || arg === '--help') {
    console.log(USAGE);
    process.exit(0);
  } else if (arg === '--tier' || arg.startsWith('--tier=')) {
    const value = arg === '--tier' ? (args[++i] ?? '') : arg.slice('--tier='.length);
    const names = value.split(',').map((s) => s.trim()).filter(Boolean);
    const unknown = names.filter((t) => !TIERS.includes(t as Tier));
    if (!names.length || unknown.length) {
      console.error(`--tier 只认 ${TIERS.join('、')}，用逗号隔开${unknown.length ? `；不认识：${unknown.join('、')}` : ''}`);
      process.exit(1);
    }
    tiers = names as Tier[];
  } else if (arg.startsWith('-')) {
    console.error(`不认识的选项 ${arg}\n${USAGE}`);
    process.exit(1);
  } else {
    scopes.push(arg);
  }
}

const result = exportStatements(ROOT, { scopes, tiers });
process.stdout.write(result.text);
for (const s of result.unmatched) console.error(`没有找到「${s}」：范围要写学科、领域或小节的 id，如 math、math.analysis、math.analysis.completeness`);
for (const f of result.failures) console.error(`读不了 ${f}`);
process.exitCode = result.unmatched.length || result.failures.length ? 1 : 0;

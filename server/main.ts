// npm start：先构建网站（package.json 里的 start 脚本），再用这个服务同时提供网站和进度接口。
//   --lan          对局域网开放（iPad 用；第一次会弹 Windows 防火墙，只对专用网络允许即可）
//   --port 3141    端口
//   --data <目录>   进度所在的 Git 仓库，默认就是本仓库（测试时可以指到别处）

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildServer } from './app.ts';

const codeRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const option = (name: string): string | undefined => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const lan = args.includes('--lan');
const port = Number(option('--port') ?? process.env.PORT ?? 3141);
const dataRoot = path.resolve(option('--data') ?? codeRoot);

if (!fs.existsSync(path.join(codeRoot, 'dist', 'index.html'))) {
  console.error('还没有构建好的网站（dist/）。请运行 npm start（会先构建），或先运行 npm run build。');
  process.exit(1);
}

const app = await buildServer({ codeRoot, dataRoot, serveSite: true });
await app.listen({ port, host: lan ? '0.0.0.0' : '127.0.0.1' });

console.log(`\n进度服务已启动：http://localhost:${port}`);
if (lan) {
  for (const list of Object.values(os.networkInterfaces())) {
    for (const net of list ?? []) {
      if (net.family === 'IPv4' && !net.internal) console.log(`  iPad（同一个 Wi-Fi）打开：http://${net.address}:${port}`);
    }
  }
} else {
  console.log('  只对本机开放；iPad 要用的话改运行 npm run start:lan');
}
console.log(`  进度写在 ${path.join(dataRoot, 'progress')}\n  按 Ctrl+C 停止\n`);

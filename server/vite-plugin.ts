// 开发模式（npm run dev）下把进度接口挂到 Vite 的开发服务器上，和 npm start 用同一套代码。

import type { Plugin } from 'vite';
import { buildServer } from './app.ts';

export function progressApiPlugin(): Plugin {
  return {
    name: 'principia-progress-api',
    apply: 'serve',
    async configureServer(server) {
      const root = server.config.root;
      const app = await buildServer({ codeRoot: root, dataRoot: root, serveSite: false });
      await app.ready();
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith('/api/')) app.routing(req, res);
        else next();
      });
      server.httpServer?.once('close', () => void app.close());
    },
  };
}

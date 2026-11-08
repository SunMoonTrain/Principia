// Vite 插件：开发模式下启动时编译内容、监听 content/ 自动重编，并在 /data/ 下提供编译结果；
// 构建（vite build）时先编译内容，不通过就让构建失败，通过则把结果拷进 dist/data/。

import fs from 'node:fs';
import path from 'node:path';
import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite';
import { compileContent, type CompileResult } from './compile.ts';
import { formatReport } from './diagnostics.ts';
import { writeOutputs } from './output.ts';

export const CONTENT_EVENT = 'principia:content';

export function contentPlugin(): Plugin {
  let config: ResolvedConfig;
  let outDir = '';
  let last: CompileResult | null = null;

  const run = async (): Promise<CompileResult> => {
    const result = compileContent(config.root);
    await writeOutputs(outDir, result);
    last = result;
    return result;
  };

  const notify = (server: ViteDevServer, result: CompileResult): void => {
    if (result.report.ok) {
      server.ws.send({ type: 'custom', event: CONTENT_EVENT, data: { ok: true, at: result.report.finishedAt } });
      return;
    }
    const first = result.report.errors[0];
    const file = path.join(config.root, ...first.file.split('/'));
    server.ws.send({
      type: 'error',
      err: {
        plugin: 'principia-content',
        message: formatReport(result.report),
        stack: '',
        id: file,
        loc: { file, line: first.line ?? 1, column: 1 },
      },
    });
  };

  return {
    name: 'principia-content',

    configResolved(resolved) {
      config = resolved;
      outDir = path.join(config.root, 'generated');
    },

    async buildStart() {
      if (config.command !== 'build') return;
      const result = await run();
      const text = formatReport(result.report);
      if (!result.report.ok) this.error(text);
      config.logger.info(text);
    },

    async configureServer(server) {
      const contentDir = path.join(config.root, 'content');
      const log = (result: CompileResult): void => {
        const text = formatReport(result.report);
        if (result.report.ok) config.logger.info(text, { timestamp: true });
        else config.logger.error(text + '\n网站继续使用上一次通过的内容。', { timestamp: true });
      };

      log(await run());

      let timer: NodeJS.Timeout | undefined;
      let running: Promise<void> | null = null;
      const recompile = (): void => {
        clearTimeout(timer);
        timer = setTimeout(async () => {
          await running;
          running = (async () => {
            const result = await run();
            log(result);
            notify(server, result);
          })();
          await running;
          running = null;
        }, 150);
      };
      server.watcher.add(contentDir);
      server.watcher.on('all', (_event, file) => {
        const relative = path.relative(contentDir, file);
        if (!relative.startsWith('..') && !path.isAbsolute(relative)) recompile();
      });
      // 构建失败时打开页面，也要看到错误
      server.ws.on('connection', () => {
        if (last && !last.report.ok) setTimeout(() => notify(server, last!), 300);
      });

      server.middlewares.use('/data', (req, res, next) => {
        const url = decodeURIComponent((req.url ?? '/').split('?')[0]).replace(/^\/+/, '');
        const file = path.resolve(outDir, url);
        if (!file.startsWith(outDir + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return next();
        res.setHeader('Content-Type', file.endsWith('.json') ? 'application/json; charset=utf-8' : 'application/octet-stream');
        res.setHeader('Cache-Control', 'no-cache');
        fs.createReadStream(file).pipe(res);
      });
    },

    closeBundle() {
      if (config.command !== 'build' || !last?.report.ok) return;
      fs.cpSync(outDir, path.join(path.resolve(config.root, config.build.outDir), 'data'), { recursive: true });
    },
  };
}

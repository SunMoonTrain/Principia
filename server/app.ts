// 进度服务：同一个服务既提供网站，又提供进度接口（见 docs/plan.md「进度存储」）。
//   GET  /api/progress      读全部进度（打开网页时以这里为准）
//   POST /api/progress/ops  提交一批操作（最多 1000 条），按题合并写进 progress/
//   POST /api/archive       「存档」：把 progress/ 提交到 Git
//   GET  /api/notes/:lesson                  一节的思路笔记和另存的冲突版本
//   PUT  /api/notes/:lesson/:problem         保存一道题的笔记（带上开始编辑时那一版的指纹）
//   DELETE /api/notes/:lesson/:problem/conflicts/:file  合并完以后删掉另存的版本
// 开发模式（npm run dev）下由 Vite 插件挂上同样的接口，不另起服务。

import fs from 'node:fs';
import path from 'node:path';
import compress from '@fastify/compress';
import fastifyStatic from '@fastify/static';
import Fastify, { type FastifyInstance } from 'fastify';
import { z } from 'zod';
import type { Graph } from '../shared/content-types.ts';
import { LESSON_ID_RE, PROBLEM_IDS } from '../shared/ids.ts';
import { archiveProgress } from './archive.ts';
import { CONFLICT_FILE_RE, NotesStore } from './notes.ts';
import { ProgressStore } from './store.ts';

const Timestamp = z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?([+-]\d{2}:\d{2}|Z)$/);
const LessonId = z.string().regex(LESSON_ID_RE);
const ProblemId = z.enum(PROBLEM_IDS);
const RecordId = z.string().min(8).max(64);
/** 你写的一段文字（批语、内容有误的说明和原文）。 */
const UserText = z.string().max(4000);

const Op = z.discriminatedUnion('type', [
  z.strictObject({ type: z.literal('lesson-open'), lesson: LessonId, at: Timestamp }),
  z.strictObject({ type: z.literal('lesson-status'), lesson: LessonId, status: z.enum(['completed', 'known', 'none']), at: Timestamp }),
  z.strictObject({
    type: z.literal('attempt'),
    lesson: LessonId,
    problem: ProblemId,
    attempt: z.strictObject({
      id: RecordId,
      at: Timestamp,
      input: z.string().max(500),
      result: z.enum(['correct', 'wrong', 'gave-up']),
    }),
  }),
  z.strictObject({ type: z.literal('hint'), lesson: LessonId, problem: ProblemId, level: z.union([z.literal(1), z.literal(2), z.literal(3)]), at: Timestamp }),
  z.strictObject({ type: z.literal('unsure'), lesson: LessonId, problem: ProblemId, value: z.boolean(), at: Timestamp }),
  z.strictObject({ type: z.literal('problem-status'), lesson: LessonId, problem: ProblemId, status: z.enum(['none', 'idea', 'ready', 'graded']), at: Timestamp }),
  z.strictObject({
    type: z.literal('grade'),
    lesson: LessonId,
    problem: ProblemId,
    grade: z.strictObject({ id: RecordId, at: Timestamp, result: z.enum(['pass', 'partial', 'fail']), comment: UserText.optional() }),
  }),
  z.strictObject({ type: z.literal('review-dismiss'), lesson: LessonId, problem: ProblemId, at: Timestamp }),
  z.strictObject({
    type: z.literal('issue'),
    issue: z.strictObject({
      id: RecordId,
      at: Timestamp,
      lesson: LessonId,
      part: z.string().min(1).max(200),
      quote: UserText.optional(),
      note: UserText.optional(),
    }),
  }),
]);
// 每条操作单独校验（见下面的接口），一条坏的不连累同一批里别的
const OpsBody = z.strictObject({ ops: z.array(z.unknown()).max(1000) });
/** 一道题的笔记最多 200 KB，够写很长的证明了。 */
const NoteBody = z.strictObject({ text: z.string().max(200_000), base: z.string().max(64).nullable() });

export interface ServerOptions {
  /** 代码所在的仓库（找 dist/ 和 generated/）。 */
  codeRoot: string;
  /** 进度所在的 Git 仓库（progress/ 在它下面，存档提交到它）；平时和 codeRoot 相同。 */
  dataRoot: string;
  /** npm start 时提供构建好的网站；开发模式下网站由 Vite 提供。 */
  serveSite: boolean;
}

/** 存档提交信息里用小节标题；读最新的全局图谱。 */
function lessonTitles(codeRoot: string): (id: string) => string {
  for (const file of [path.join(codeRoot, 'generated', 'graph.json'), path.join(codeRoot, 'dist', 'data', 'graph.json')]) {
    if (!fs.existsSync(file)) continue;
    const graph = JSON.parse(fs.readFileSync(file, 'utf8')) as Graph;
    const titles = new Map(graph.lessons.map((l) => [l.id, l.titleText]));
    return (id) => titles.get(id) ?? id;
  }
  return (id) => id;
}

export async function buildServer(options: ServerOptions): Promise<FastifyInstance> {
  const app = Fastify({ logger: false, bodyLimit: 2 * 1024 * 1024 });
  // 内容包很大（KaTeX 的输出），压缩后小很多
  await app.register(compress, { encodings: ['gzip', 'deflate'] });

  const store = new ProgressStore(path.join(options.dataRoot, 'progress'), path.join(options.dataRoot, 'content', 'issues.yaml'));
  const notes = new NotesStore(path.join(options.dataRoot, 'progress', 'notes'));

  app.get('/api/progress', async (_request, reply) => {
    reply.header('Cache-Control', 'no-store');
    return store.read();
  });

  app.post('/api/progress/ops', async (request, reply) => {
    const parsed = OpsBody.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: '请求格式不对', issues: parsed.error.issues.slice(0, 5) });
    const ops: z.infer<typeof Op>[] = [];
    const rejected: number[] = [];
    parsed.data.ops.forEach((raw, i) => {
      const op = Op.safeParse(raw);
      if (op.success) ops.push(op.data);
      else rejected.push(i);
    });
    if (rejected.length) console.warn(`进度服务：丢掉了 ${rejected.length} 条格式不对的操作`);
    await store.apply(ops);
    // rejected 是丢掉的几条在这批里的位置，网页据此只把存下的算进进度
    return { ok: true, applied: ops.length, rejected };
  });

  const NoteParams = z.strictObject({ lesson: LessonId, problem: ProblemId });

  app.get('/api/notes/:lesson', async (request, reply) => {
    const params = z.strictObject({ lesson: LessonId }).safeParse(request.params);
    if (!params.success) return reply.code(400).send({ error: '小节 id 不对' });
    reply.header('Cache-Control', 'no-store');
    return notes.readLesson(params.data.lesson);
  });

  app.put('/api/notes/:lesson/:problem', async (request, reply) => {
    const params = NoteParams.safeParse(request.params);
    const body = NoteBody.safeParse(request.body);
    if (!params.success || !body.success) return reply.code(400).send({ error: '请求格式不对' });
    const result = await notes.save(params.data.lesson, params.data.problem, body.data.text, body.data.base);
    // 409：文件在你编辑期间被另一台设备改过，这次的内容另存了，回给你服务端现在的那一版
    return result.ok ? { version: result.version } : reply.code(409).send({ conflict: result.conflict, current: result.current });
  });

  app.delete('/api/notes/:lesson/:problem/conflicts/:file', async (request, reply) => {
    const params = NoteParams.extend({ file: z.string().regex(CONFLICT_FILE_RE) }).safeParse(request.params);
    if (!params.success || !params.data.file.startsWith(`${params.data.problem}.`)) return reply.code(400).send({ error: '请求格式不对' });
    return { deleted: notes.deleteConflict(params.data.lesson, params.data.file) };
  });

  app.post('/api/archive', async (_request, reply) => {
    try {
      return await archiveProgress(store, options.dataRoot, lessonTitles(options.codeRoot));
    } catch (error) {
      return reply.code(500).send({ error: (error as Error).message });
    }
  });

  if (options.serveSite) {
    const dist = path.join(options.codeRoot, 'dist');
    await app.register(fastifyStatic, { root: dist });
    // 网站是单页应用：/lesson/... 这类地址都返回 index.html
    app.setNotFoundHandler((request, reply) => {
      if (request.method === 'GET' && !request.url.startsWith('/api/') && !request.url.startsWith('/data/')) {
        return reply.header('Cache-Control', 'no-cache').sendFile('index.html');
      }
      return reply.code(404).send({ error: '找不到' });
    });
  }
  return app;
}

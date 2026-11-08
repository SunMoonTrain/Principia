// progress/ 下的文件读写：每次改动都先读文件、按操作合并、再整份写回（先写临时文件再改名）。
// 同一个文件排队写；不在内存里长期缓存，这样你手动改文件或 git 切换后也不会被旧数据覆盖。

import fs from 'node:fs';
import path from 'node:path';
import { parse, stringify } from 'yaml';
import { writeFileAtomic } from '../compiler/fsutil.ts';
import { domainOf } from '../shared/ids.ts';
import { applyOp, type LessonProgress, type ProblemProgress, type ProgressOp, type ProgressState } from '../shared/progress.ts';

type LessonsFile = Record<string, LessonProgress>;
type ProblemsFile = Record<string, Record<string, ProblemProgress>>;

const LESSONS_HEADER = '# 每节的学习状态。网站写入，你点「存档」时提交；格式见 docs/plan.md「进度存储」。\n';
const problemsHeader = (domain: string): string => `# ${domain} 各题的作答记录。网站写入，你点「存档」时提交；格式见 docs/plan.md「进度存储」。\n`;

function readYaml<T>(file: string): T | null {
  if (!fs.existsSync(file)) return null;
  const text = fs.readFileSync(file, 'utf8');
  try {
    return (parse(text) ?? {}) as T;
  } catch (error) {
    // 手动改坏了的文件不能被覆盖，报错让人去修
    throw new Error(`进度文件 ${file} 不是合法的 YAML：${(error as Error).message}`);
  }
}

function byNumber(a: string, b: string): number {
  return Number(a.replace(/\D/g, '')) - Number(b.replace(/\D/g, '')) || a.localeCompare(b);
}

/** 写回时排好序：小节按 id，题按题号，作答按时间；提示的级数写成数字键。 */
function serializeLessons(lessons: LessonsFile): string {
  const sorted = Object.fromEntries(Object.keys(lessons).sort().map((id) => [id, lessons[id]]));
  return LESSONS_HEADER + stringify(sorted, { lineWidth: 0, singleQuote: true });
}

function serializeProblems(domain: string, problems: ProblemsFile): string {
  const sorted = Object.fromEntries(
    Object.keys(problems)
      .sort()
      .map((lesson) => [
        lesson,
        Object.fromEntries(
          Object.keys(problems[lesson])
            .sort(byNumber)
            .map((problem) => {
              const { attempts, hints, ...rest } = problems[lesson][problem];
              const out: Record<string, unknown> = {};
              if (attempts?.length) out.attempts = attempts;
              if (hints && Object.keys(hints).length) {
                out.hints = new Map(Object.keys(hints).sort(byNumber).map((level) => [Number(level), hints[Number(level) as 1 | 2 | 3]]));
              }
              return [problem, { ...out, ...rest }];
            }),
        ),
      ]),
  );
  return problemsHeader(domain) + stringify(sorted, { lineWidth: 0, singleQuote: true });
}

export class ProgressStore {
  private readonly queues = new Map<string, Promise<unknown>>();

  constructor(readonly dir: string) {}

  get lessonsFile(): string {
    return path.join(this.dir, 'lessons.yaml');
  }

  problemsFile(domain: string): string {
    return path.join(this.dir, 'problems', `${domain}.yaml`);
  }

  /** 读出全部进度。 */
  read(): ProgressState {
    const lessons = readYaml<LessonsFile>(this.lessonsFile) ?? {};
    const problems: ProblemsFile = {};
    const problemsDir = path.join(this.dir, 'problems');
    if (fs.existsSync(problemsDir)) {
      for (const name of fs.readdirSync(problemsDir).filter((f) => f.endsWith('.yaml'))) {
        Object.assign(problems, readYaml<ProblemsFile>(path.join(problemsDir, name)) ?? {});
      }
    }
    return { lessons, problems };
  }

  /** 同一个文件排队：前一次读改写结束后再开始下一次。 */
  private enqueue<T>(file: string, task: () => Promise<T>): Promise<T> {
    const previous = this.queues.get(file) ?? Promise.resolve();
    const next = previous.then(task, task);
    this.queues.set(
      file,
      next.catch(() => undefined),
    );
    return next;
  }

  /** 应用一批操作：按文件分组，每个文件读出来、合并、写回。 */
  async apply(ops: ProgressOp[]): Promise<void> {
    const lessonOps = ops.filter((op) => op.type === 'lesson-open' || op.type === 'lesson-status');
    const byDomain = new Map<string, ProgressOp[]>();
    for (const op of ops) {
      if (op.type !== 'attempt' && op.type !== 'hint') continue;
      const domain = domainOf(op.lesson);
      byDomain.set(domain, [...(byDomain.get(domain) ?? []), op]);
    }
    const tasks: Promise<void>[] = [];
    if (lessonOps.length) {
      const file = this.lessonsFile;
      tasks.push(
        this.enqueue(file, async () => {
          const state = lessonOps.reduce(applyOp, { lessons: readYaml<LessonsFile>(file) ?? {}, problems: {} });
          await writeFileAtomic(file, serializeLessons(state.lessons));
        }),
      );
    }
    for (const [domain, domainOps] of byDomain) {
      const file = this.problemsFile(domain);
      tasks.push(
        this.enqueue(file, async () => {
          const state = domainOps.reduce(applyOp, { lessons: {}, problems: readYaml<ProblemsFile>(file) ?? {} });
          await writeFileAtomic(file, serializeProblems(domain, state.problems));
        }),
      );
    }
    await Promise.all(tasks);
  }
}

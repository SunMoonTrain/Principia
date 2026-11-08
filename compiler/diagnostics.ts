import type { BuildReport, Diagnostic } from '../shared/content-types.ts';

/** 收集构建中的错误和警告。错误让构建失败；警告只提示。 */
export class Diagnostics {
  readonly items: Diagnostic[] = [];

  error(file: string, line: number | undefined, message: string, detail?: string): void {
    this.items.push({ level: 'error', file, line, message, detail });
  }

  warn(file: string, line: number | undefined, message: string, detail?: string): void {
    this.items.push({ level: 'warning', file, line, message, detail });
  }

  get errors(): Diagnostic[] {
    return this.items.filter((d) => d.level === 'error');
  }

  get warnings(): Diagnostic[] {
    return this.items.filter((d) => d.level === 'warning');
  }

  /** 当前错误个数，用来判断某一步有没有新增错误。 */
  get errorCount(): number {
    return this.errors.length;
  }
}

function byLocation(a: Diagnostic, b: Diagnostic): number {
  return a.file.localeCompare(b.file) || (a.line ?? 0) - (b.line ?? 0);
}

export function formatDiagnostic(d: Diagnostic): string {
  const where = d.line ? `${d.file}:${d.line}` : d.file;
  const lines = [`  ${where}`, `    ${d.message}`];
  if (d.detail) lines.push(...d.detail.split('\n').map((l) => `    │ ${l}`));
  return lines.join('\n');
}

export function formatReport(report: BuildReport): string {
  const parts: string[] = [];
  const counts = `${report.errors.length} 个错误，${report.warnings.length} 个警告`;
  parts.push(report.ok ? `内容构建通过（${counts}）` : `内容构建失败：${counts}`);
  if (report.errors.length) {
    parts.push('', '错误：', ...[...report.errors].sort(byLocation).map(formatDiagnostic));
  }
  if (report.warnings.length) {
    parts.push('', '警告：', ...[...report.warnings].sort(byLocation).map(formatDiagnostic));
  }
  return parts.join('\n');
}

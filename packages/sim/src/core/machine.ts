export interface SimEvent {
  text: string;
  touched?: string[];
  kind?: 'read' | 'write' | 'compare' | 'jump' | 'alloc' | 'free' | 'hit' | 'miss' | 'info' | 'warn' | 'error';
}

export interface StepResult<S> {
  state: S;
  events: SimEvent[];
  done?: boolean;
}

export interface Machine<P, S> {
  init(params: P, seed: number): S;
  step(state: S, granularity?: string): StepResult<S>;
  edit?(state: S, action: unknown): S;
  observe(state: S): Record<string, number | boolean>;
  readMemory?(state: S, address: number): number;
}

/** 每一步留下事件和粒度，较早的状态只保留检查点和编辑点。 */
export class History<P, S> {
  private readonly snapshots = new Map<number, S>();
  private readonly edits = new Set<number>();
  private readonly log: Omit<StepResult<S>, 'state'>[] = [];
  private readonly grains: (string | undefined)[] = [];
  private cursor = 0;
  private current: S;

  constructor(private readonly machine: Machine<P, S>, params: P, seed: number,
    private readonly limit = 20000, private readonly interval = 200) {
    if (!Number.isSafeInteger(limit) || limit < 1 || !Number.isSafeInteger(interval) || interval < 1) throw new RangeError('历史容量和检查点间隔必须是正整数');
    this.current = machine.init(params, seed);
    this.snapshots.set(0, this.current);
    this.log.push({ events: [] });
  }

  get index() { return this.cursor; }
  get end() { return this.log.length - 1; }
  get state() { return this.current; }
  get events() { return this.log[this.cursor].events; }
  get done() { return !!this.log[this.cursor].done; }
  get finished() { return !!this.log[this.end].done; }
  eventsAt(index: number) { return this.log[index].events; }

  /** 粒度变动和手工编辑都从当前步骤重新开始。 */
  truncate(): void {
    for (let i = this.end; i > this.cursor; i--) {
      this.snapshots.delete(i);
      this.edits.delete(i);
    }
    this.log.length = this.cursor + 1;
    this.grains.length = this.cursor;
  }

  step(granularity?: string): void {
    if (this.done) return;
    if (this.cursor < this.end && this.grains[this.cursor] === granularity) {
      this.seek(this.cursor + 1);
      return;
    }
    if (this.cursor < this.end) this.truncate();
    const result = this.machine.step(this.current, granularity);
    this.current = result.state;
    this.cursor++;
    this.grains.push(granularity);
    this.log.push({ events: result.events, done: result.done });
    this.snapshots.set(this.cursor, this.current);
    const expired = this.cursor - this.limit;
    if (expired > 0 && expired % this.interval !== 0 && !this.edits.has(expired)) this.snapshots.delete(expired);
  }

  seek(target: number, granularity?: string): void {
    if (!Number.isSafeInteger(target) || target < 0) throw new RangeError('步号必须是非负整数');
    const known = Math.min(target, this.end);
    if (known !== this.cursor) {
      let from = known;
      while (from !== this.cursor && !this.snapshots.has(from)) from--;
      if (from !== this.cursor) this.current = this.snapshots.get(from)!;
      for (let i = from; i < known; i++) this.current = this.machine.step(this.current, this.grains[i]).state;
      this.cursor = known;
    }
    while (this.cursor < target && !this.done) this.step(granularity);
  }

  /** 进度条按一小段向前计算，读者仍停在原来的状态。 */
  preview(count: number, granularity?: string): void {
    const current = this.cursor;
    this.seek(this.end + count, granularity);
    this.seek(current);
  }

  edit(action: unknown): void {
    if (!this.machine.edit) throw new Error('这个模拟器不支持编辑');
    const next = this.machine.edit(this.current, action);
    this.truncate();
    this.current = next;
    this.edits.add(this.cursor);
    this.snapshots.set(this.cursor, next);
    this.log[this.cursor] = { events: [{ kind: 'info', text: '已从这一步修改状态。' }] };
  }
}

import { algorithmMachine } from './algorithm.ts';

export const policies = ['fcfs', 'sjf', 'srtf', 'rr', 'priority', 'mlfq'] as const;
export interface ScheduleRun {
  algorithm: typeof policies[number];
  quantum?: number;
  preemptive?: boolean;
  quanta?: number[];
  allotments?: number[];
  boost?: number;
}
export interface Job { name: string; arrival: number; bursts: number[]; priority?: number }
export interface ScheduleParams { jobs: string; tasks: Job[]; runs: ScheduleRun[] }
export const schedulerNames = ['step', 'completed', 'switches', 'preemptions', 'idle', 'turnaround', 'waiting', 'response', 'done'];

export function parseJobs(source: string, priority: boolean) {
  const tasks: Job[] = [];
  const errors: {row: number; message: string}[] = [];
  const rows = source.normalize('NFKC').trimEnd().split('\n');
  if (rows.length > 8) errors.push({row: 8, message: '作业表最多 8 行'});
  rows.forEach((line, row) => {
    const fields = line.trim().split(/\s+/);
    const [name, arrival, pattern, rank] = fields;
    const bursts = (pattern ?? '').split('+').map(Number);
    let message = '';
    if (fields.length < 3 || fields.length > 4 || !/^[A-Za-z0-9]{1,4}$/.test(name))
      message = '每行写作业名、到达时刻、运行时长和可选的优先级';
    else if (tasks.some(j => j.name === name)) message = '作业名重复';
    else if (!/^\d+$/.test(arrival) || Number(arrival) > 50) message = '到达时刻为 0–50';
    else if (!/^\d+(?:\+\d+)*$/.test(pattern) || bursts.length > 9 || bursts.length % 2 !== 1 || bursts.some(n => n < 1 || n > 30))
      message = '计算和 I/O 交替写 1–9 段（奇数），每段 1–30 拍';
    else if ((rank !== undefined && !/^\d$/.test(rank)) || (priority && rank === undefined))
      message = '优先级调度需要每个作业写 0–9 的优先级';
    if (message) errors.push({row, message});
    else tasks.push({name, arrival: Number(arrival), bursts, priority: rank === undefined ? undefined : Number(rank)});
  });
  return {tasks, errors};
}

interface Process {
  part: number; left: number; wake: number; level: number; used: number;
  first: number; finish: number; cpu: number; io: number;
}
export interface Tick { cpu: number; states: string[] }
export interface ScheduleFrame {
  text: string; time: number; ticks: Tick[]; ready: number[]; processes: Process[];
  completed: number; switches: number; preemptions: number; idle: number;
  waiting: number; response: number; turnaround: number;
}
export function* schedule(jobs: Job[], config: ScheduleRun): Generator<ScheduleFrame, void> {
  const {algorithm, quantum = 4, quanta = [2, 4, 8], allotments = quanta, boost = 0} = config;
  const mlfq = algorithm === 'mlfq';
  const processes = jobs.map(({bursts}): Process => ({
    part: 0, left: bursts[0], wake: -1, level: 0, used: 0, first: -1, finish: -1,
    cpu: bursts.reduce((a, n, i) => a + (i % 2 ? 0 : n), 0),
    io: bursts.reduce((a, n, i) => a + (i % 2 ? n : 0), 0),
  }));
  let ready: number[] = [], ticks: Tick[] = [];
  let running = -1, last = -1, slice = 0, completed = 0, switches = 0, preemptions = 0, idle = 0;
  let waiting = 0, response = 0, turnaround = 0;
  function snapshot(text: string): ScheduleFrame {
    return {text, time: ticks.length, ticks, ready: [...ready], processes: processes.map(p => ({...p})),
      completed, switches, preemptions, idle, waiting, response, turnaround};
  }
  function rank(i: number) {
    if (algorithm === 'sjf' || algorithm === 'srtf') return processes[i].left;
    if (algorithm === 'priority') return jobs[i].priority ?? 0;
    return mlfq ? processes[i].level : 0;
  }
  function best() { return ready.reduce((a, b) => rank(b) < rank(a) ? b : a); }
  function demote(p: Process) {
    if (mlfq && p.used >= allotments[p.level]) {
      p.level = Math.min(quanta.length - 1, p.level + 1);
      p.used = 0;
    }
  }
  yield snapshot('准备调度');
  for (let t = 0; completed < jobs.length; t++) {
    const notes: string[] = [];
    processes.forEach((p, i) => {
      if (p.wake === t) { ready.push(i); p.wake = -1; notes.push(jobs[i].name + ' 的 I/O 结束'); }
    });
    jobs.forEach((j, i) => { if (j.arrival === t) { ready.push(i); notes.push(j.name + ' 到达'); } });
    const prior = running;
    if (running >= 0) {
      const p = processes[running];
      let reason = '';
      if (mlfq && p.used >= allotments[p.level]) { demote(p); reason = '用完本级额度'; }
      else if (mlfq && slice >= quanta[p.level] || algorithm === 'rr' && slice >= quantum) reason = '用满时间片';
      else if (ready.length && (mlfq || algorithm === 'srtf' || algorithm === 'priority' && config.preemptive)
        && rank(best()) < rank(running)) reason = '让给优先运行的作业';
      if (reason) { notes.push(jobs[running].name + reason + '，回到队尾'); ready.push(running); running = -1; }
    }
    if (mlfq && boost && t > 0 && t % boost === 0) {
      ready.sort((a, b) => processes[a].level - processes[b].level);
      if (running >= 0) ready.push(running);
      running = -1;
      processes.forEach(p => { p.level = p.used = 0; });
      notes.push('全部提升到最高级');
    }
    if (running < 0 && ready.length) {
      running = best();
      ready.splice(ready.indexOf(running), 1);
      slice = 0;
    }
    const cpu = running;
    const states = processes.map((p, i) => i === cpu ? '运行' : p.finish >= 0 ? '完成' :
      jobs[i].arrival > t ? '未到' : p.wake > t ? 'I/O' : '就绪');
    ticks = [...ticks, {cpu, states}];
    if (cpu < 0) { idle++; notes.push('CPU 空闲'); }
    else {
      const p = processes[cpu], job = jobs[cpu];
      if (last >= 0 && last !== cpu) switches++;
      if (prior >= 0 && prior !== cpu) preemptions++;
      if (p.first < 0) p.first = t;
      last = cpu;
      p.left--; slice++;
      if (mlfq) p.used++;
      notes.push(job.name + ' 运行');
      if (p.left === 0) {
        running = -1;
        if (p.part + 1 < job.bursts.length) {
          p.wake = t + 1 + job.bursts[p.part + 1]; p.part += 2; p.left = job.bursts[p.part];
          demote(p);
          notes.push('开始 I/O，至 ' + p.wake);
        } else {
          completed++; p.finish = t + 1;
          const turn = p.finish - job.arrival;
          turnaround += turn; waiting += turn - p.cpu - p.io; response += p.first - job.arrival;
          notes.push('在 ' + p.finish + ' 完成');
        }
      }
    }
    yield snapshot('t = ' + t + '：' + notes.join('，'));
  }
}
export const schedulerMachine = algorithmMachine(
  (p: ScheduleParams) => p.runs.map(config => schedule(p.tasks, config)),
  f => ({completed: f.completed, switches: f.switches, preemptions: f.preemptions, idle: f.idle,
    turnaround: f.turnaround, waiting: f.waiting, response: f.response}),
);

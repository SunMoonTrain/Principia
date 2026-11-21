import { describe, expect, it } from 'vitest';
import { parseJobs, schedule, type Job, type ScheduleRun } from './scheduler';
import { mulberry32 } from './rng';

const jobs = (s:string) => parseJobs(s.replaceAll(';','\n'),false).tasks;
function finish(j:Job[], r:ScheduleRun) {return [...schedule(j,r)].at(-1)!;}
function check(j:Job[], run:ScheduleRun, segments:string, totals:Record<string,number> = {}) {
  const f=finish(j,run);
  expect(f.ticks.map(t=>j[t.cpu]?.name??'_')).toEqual(segments.split(' ').flatMap(s=>{
    const [name,ticks]=s.split(':'); return Array<string>(Number(ticks)).fill(name);
  }));
  expect(f).toMatchObject(totals);
  return f;
}
// 只从作业输入和 CPU 时间线解释每拍，不调用调度器的队列、进程状态或计数。
function referenceStates(job:Job,id:number,cpu:number[]){
  let part=0,work=job.bursts[0],ready=job.arrival;
  return cpu.map((owner,t)=>{
    if(t<job.arrival)return '未到';
    if(part===job.bursts.length)return '完成';
    if(t<ready)return 'I/O';
    if(owner!==id)return '就绪';
    if(--work===0){
      part++;
      if(part<job.bursts.length){ready=t+1+job.bursts[part++];work=job.bursts[part];}
    }
    return '运行';
  });
}
describe('调度验收',()=>{
  it('护航效应、轮转与到达时抢占',()=>{
    const j=jobs('P1 0 24;P2 0 3;P3 0 3');
    const a=check(j,{algorithm:'fcfs'},'P1:24 P2:3 P3:3',{waiting:51,time:30,switches:2});
    expect(a.processes.map(p=>p.first)).toEqual([0,24,27]);
    check(j,{algorithm:'sjf'},'P2:3 P3:3 P1:24',{waiting:9});
    const rr=check(j,{algorithm:'rr',quantum:4},'P1:4 P2:3 P3:3 P1:20',{waiting:17,response:11,switches:3,preemptions:1});
    expect(rr.processes.map(p=>p.finish-p.cpu)).toEqual([6,4,7]);
    const k=jobs('P1 0 8;P2 1 4;P3 2 9;P4 3 5');
    check(k,{algorithm:'srtf'},'P1:1 P2:4 P4:5 P1:7 P3:9',{waiting:26,preemptions:1});
    expect(finish(k,{algorithm:'sjf'}).waiting).toBe(31);
    expect(finish(k,{algorithm:'fcfs'}).waiting).toBe(35);
    expect(finish(k,{algorithm:'rr',quantum:2})).toMatchObject({waiting:51,response:8,switches:12,preemptions:9});
  });
  it('优先级、长作业及响应',()=>{
    const p=jobs('P1 0 10 3;P2 0 1 1;P3 0 2 4;P4 0 1 5;P5 0 5 2');
    check(p,{algorithm:'priority'},'P2:1 P5:5 P1:10 P3:2 P4:1',{waiting:41});
    const j=jobs('A 0 30;B 0 10;C 0 10');
    j[0].bursts=[100];
    expect(finish(j,{algorithm:'fcfs'}).turnaround).toBe(330);
    expect(finish(j,{algorithm:'sjf'}).turnaround).toBe(150);
    j[1].arrival=j[2].arrival=10;
    expect(finish(j,{algorithm:'sjf'}).turnaround).toBe(310);
    expect(finish(j,{algorithm:'srtf'}).turnaround).toBe(150);
    const short=jobs('A 0 5;B 0 5;C 0 5');
    expect(finish(short,{algorithm:'sjf'}).response).toBe(15);
    expect(finish(short,{algorithm:'rr',quantum:1})).toMatchObject({response:3,turnaround:42});
    const pr=jobs('L 0 6 5;H1 1 2 1;H2 3 2 1;H3 5 2 1;H4 7 2 1');
    check(pr,{algorithm:'priority',preemptive:true},'L:1 H1:2 H2:2 H3:2 H4:2 L:5',{waiting:8});
    const non=check(pr,{algorithm:'priority'},'L:6 H1:2 H2:2 H3:2 H4:2');
    expect(non.processes.slice(1).map((p,i)=>p.first-pr[i+1].arrival)).toEqual([5,5,5,5]);
  });
  it('I/O 重叠，同拍唤醒先于新到达',()=>{
    const j=jobs('A 0 5+5+5+5+5;B 0 15');
    check(j,{algorithm:'fcfs'},'A:5 B:15 A:5 _:5 A:5',{time:35,idle:5});
    check(j,{algorithm:'srtf'},'A:5 B:5 A:5 B:10 A:5',{time:30,idle:0});
    check(jobs('A 0 2+2+2;B 4 2'),{algorithm:'fcfs'},'A:2 _:2 A:2 B:2');
  });
  it('MLFQ 跨 I/O 的额度和提升次序',()=>{
    const j=jobs('A 0 20;B 5 1+3+1+3+1+3+1');
    const f=check(j,{algorithm:'mlfq'},'A:5 B:1 A:3 B:1 A:3 B:1 A:3 B:1 A:6',{preemptions:4,switches:8});
    expect([f.processes[1].first,f.processes[1].finish]).toEqual([5,18]);
    const b=finish(j,{algorithm:'rr',quantum:4}).processes[1];
    expect([b.finish-5-b.cpu-b.io,b.first-5]).toEqual([6,3]);
    const k=jobs('A 0 30;B 0 1;C 0 1');
    k[1].bursts=k[2].bursts=[1,2,1,2,1,2,1,2,1,2,1];
    for(const [boost,ends,wait] of [[0,[26,27],33],[10,[19,20],19]] as const){
      const result=finish(k,{algorithm:'mlfq',quanta:[1,2,4],boost});
      const p=result.processes.slice(1);
      expect(p.map(x=>x.finish)).toEqual(ends);expect(result.waiting).toBe(wait);
    }
    check(jobs('A 0 4;B 0 5'),{algorithm:'mlfq',quanta:[1,2,4],boost:5},'A:1 B:1 A:2 B:1 A:1 B:3',{waiting:6});
  });
  it('从每拍状态独立重算时间、忙闲和非抢占计算段',()=>{
    const random=mulberry32(27);
    for(let trial=0;trial<40;trial++){
      const js=Array.from({length:4},(_,i)=>({name:String(i),arrival:Math.floor(random()*6),priority:i,bursts:Array.from({length:3},()=>1+Math.floor(random()*5))}));
      for(const algorithm of ['fcfs','sjf','srtf','priority','rr','mlfq'] as const){
        const f=finish(js,{algorithm});let wait=0,turn=0,response=0;
        js.forEach((j,i)=>{
          const at=f.ticks.flatMap((tick,t)=>tick.cpu===i?[t]:[]);
          const states=referenceStates(j,i,f.ticks.map(t=>t.cpu));
          expect(f.ticks.map(t=>t.states[i])).toEqual(states);
          const end=at.at(-1)!+1, cpu=j.bursts[0]+j.bursts[2];
          expect(at.length).toBe(cpu);
          expect(states.filter(s=>s==='就绪').length).toBe(end-j.arrival-cpu-j.bursts[1]);
          expect(f.processes[i].finish).toBe(end);
          wait+=end-j.arrival-cpu-j.bursts[1];turn+=end-j.arrival;response+=at[0]-j.arrival;
          if(['fcfs','priority','sjf'].includes(algorithm)){
            const spans=states.join(',').match(/运行(?:,运行)*/g)??[];
            expect(spans.map(s=>s.split(',').length)).toEqual([j.bursts[0],j.bursts[2]]);
          }
        });
        expect(f.ticks.every(t=>t.states.filter(s=>s==='运行').length<=1)).toBe(true);
        expect(f).toMatchObject({waiting:wait,turnaround:turn,response});
      }
    }
  });
});

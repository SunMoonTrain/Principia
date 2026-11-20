import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useInView } from '@principia/anim/kit';
import { History, type Machine } from '../core/machine';
import { compilePredicate, type Condition } from '../core/predicate';

export interface PlaybackOptions<S = unknown> {
  names: readonly string[];
  goals?: readonly Condition[];
  pauses?: readonly Condition[];
  stepsPerSecond: number | ((grain?: string) => number);
  frameClock?: boolean;
  boundary?: (state: S) => boolean;
  breakpoint?: (state: S) => boolean;
  granularities?: readonly string[];
}

const PREVIEW = 200;

/** 参数变动时由小节的 AnimBlock 按参数重新挂载；画廊使用固定参数。 */
export function useMachine<P, S>(machine: Machine<P, S>, params: P, seed: number, options: PlaybackOptions<S>) {
  const playerRef = useRef<HTMLElement>(null);
  const inView = useInView(playerRef, '0px');
  const initialGrain = options.granularities?.[0];
  const fresh = (inputs: P) => {
    const history = new History(machine, inputs, seed);
    history.preview(PREVIEW, initialGrain);
    return history;
  };
  const [history, setHistory] = useState(() => fresh(params));
  const [version, refresh] = useReducer((v: number) => v + 1, 0);
  const [visited, setVisited] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [grain, setGrain] = useState(initialGrain);
  const [pauseIndex, setPauseIndex] = useState(-1);
  const rules = useMemo(() => {
    const compile = (items: readonly Condition[] = []) => items.map((item) => compilePredicate(item.when, options.names));
    return { goals: compile(options.goals), pauses: compile(options.pauses) };
  }, [options.goals, options.pauses, options.names]);

  const matches = useCallback((tests: typeof rules.goals, state: S) => {
    if (options.boundary && !options.boundary(state)) return tests.map(() => false);
    const values = machine.observe(state);
    const read = machine.readMemory;
    return tests.map((test) => test(values, read && ((addr) => read(state, addr))));
  }, [machine, options.boundary]);
  const [reached, setReached] = useState(() => matches(rules.goals, history.state));
  const collect = useCallback((state: S) => {
    const now = matches(rules.goals, state);
    setReached((previous) => now.some((hit, i) => hit && !previous[i]) ? now.map((hit, i) => hit || previous[i]) : previous);
  }, [matches, rules]);

  const stop = () => { setRunning(false); setPauseIndex(-1); };
  const extend = useCallback(() => {
    if (!history.finished && history.end - history.index < 2) history.preview(PREVIEW, grain);
  }, [history, grain]);
  const advance = useCallback(() => {
    // 中途切粒度或拖进度后仍比较相邻两个指令边界。
    const start = history.index;
    if (rules.pauses.length && options.boundary)
      while (history.index && !options.boundary(history.state)) history.seek(history.index - 1);
    const before = matches(rules.pauses, history.state);
    if (history.index !== start) history.seek(start);
    history.step(grain);
    setVisited((last) => Math.max(last, history.index));
    collect(history.state);
    const pause = matches(rules.pauses, history.state).findIndex((hit, i) => hit && !before[i]);
    setPauseIndex(pause);
    const stopped = history.done || history.pause || pause >= 0 || !!options.breakpoint?.(history.state);
    if (stopped) setRunning(false);
    extend();
    refresh();
    return stopped;
  }, [history, grain, rules, matches, collect, extend, options.boundary, options.breakpoint]);
  const rate = typeof options.stepsPerSecond === 'number' ? options.stepsPerSecond : options.stepsPerSecond(grain);
  const clockVersion = options.frameClock ? 0 : version;
  useEffect(() => {
    if (!running || !inView) return;
    if (options.frameClock) {
      const period = 1000 / (speed * rate);
      let frame = 0, last = 0, elapsed = 0;
      const draw = (now: number) => {
        if (last) elapsed += Math.min(now - last, 4 * period);
        last = now;
        while (elapsed >= period) {
          elapsed -= period;
          if (advance()) return;
        }
        frame = requestAnimationFrame(draw);
      };
      const schedule = () => {
        cancelAnimationFrame(frame);
        last = elapsed = 0;
        if (!document.hidden) frame = requestAnimationFrame(draw);
      };
      document.addEventListener('visibilitychange', schedule);
      schedule();
      return () => { document.removeEventListener('visibilitychange', schedule); cancelAnimationFrame(frame); };
    }
    let timer: number | undefined;
    const schedule = () => {
      window.clearTimeout(timer);
      if (!document.hidden) {
        timer = window.setTimeout(() => {
          if (!document.hidden) advance();
        }, 1000 / (speed * rate));
      }
    };
    document.addEventListener('visibilitychange', schedule);
    schedule();
    return () => {
      document.removeEventListener('visibilitychange', schedule);
      window.clearTimeout(timer);
    };
  }, [running, inView, speed, rate, advance, clockVersion, options.frameClock]);

  const seek = (target: number) => {
    stop();
    history.seek(target, grain);
    setVisited((last) => Math.max(last, history.index));
    collect(history.state);
    extend();
    refresh();
  };
  const resetHistory = (inputs: P, keepGoals: boolean) => {
    stop();
    const next = fresh(inputs);
    if (keepGoals) collect(next.state);
    else setReached(matches(rules.goals, next.state));
    setGrain(initialGrain);
    setVisited(0);
    setHistory(next);
  };
  const reset = () => resetHistory(params, true);
  const replaceInputs = (inputs: P) => resetHistory(inputs, false);
  const edit = (action: unknown, written?: string[]) => {
    stop();
    history.edit(action, written);
    setVisited(history.index);
    collect(history.state);
    // 被截去的步骤从新状态重新算，供进度条拖动。
    history.preview(PREVIEW, grain);
    refresh();
  };
  const changeGrain = (next: string) => {
    stop();
    history.truncate();
    setVisited(history.index);
    history.preview(PREVIEW, next);
    setGrain(next);
    refresh();
  };
  const toggle = () => {
    setPauseIndex(-1);
    if (!history.done) setRunning((was) => !was);
  };
  return { playerRef, history, visited, running, speed, grain, pauseIndex, reached, setSpeed, seek, reset, replaceInputs, edit, changeGrain, toggle,
    step: () => { stop(); advance(); }, options };
}

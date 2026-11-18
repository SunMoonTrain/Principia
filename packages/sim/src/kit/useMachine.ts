import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { History, type Machine } from '../core/machine';
import { compilePredicate, type Condition } from '../core/predicate';

export interface PlaybackOptions {
  names: readonly string[];
  goals?: readonly Condition[];
  pauses?: readonly Condition[];
  stepsPerSecond: number;
  granularities?: readonly string[];
}

const PREVIEW = 200;

/** 参数变动时由小节的 AnimBlock 按参数重新挂载；画廊使用固定参数。 */
export function useMachine<P, S>(machine: Machine<P, S>, params: P, seed: number, options: PlaybackOptions) {
  const initialGrain = options.granularities?.[0];
  const fresh = () => {
    const history = new History(machine, params, seed);
    history.preview(PREVIEW, initialGrain);
    return history;
  };
  const [history, setHistory] = useState(fresh);
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
    const values = machine.observe(state);
    const read = machine.readMemory;
    return tests.map((test) => test(values, read && ((addr) => read(state, addr))));
  }, [machine]);
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
    const before = matches(rules.pauses, history.state);
    history.step(grain);
    setVisited((last) => Math.max(last, history.index));
    collect(history.state);
    const pause = matches(rules.pauses, history.state).findIndex((hit, i) => hit && !before[i]);
    setPauseIndex(pause);
    if (history.done || pause >= 0) setRunning(false);
    extend();
    refresh();
  }, [history, grain, rules, matches, collect, extend]);
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(advance, 1000 / (speed * options.stepsPerSecond));
    return () => window.clearTimeout(timer);
  }, [running, speed, options.stepsPerSecond, advance, version]);

  const seek = (target: number) => {
    stop();
    history.seek(target, grain);
    setVisited((last) => Math.max(last, history.index));
    collect(history.state);
    extend();
    refresh();
  };
  const reset = () => {
    stop();
    const next = fresh();
    collect(next.state);
    setGrain(initialGrain);
    setVisited(0);
    setHistory(next);
  };
  const edit = (action: unknown) => {
    stop();
    history.edit(action);
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
  return { history, visited, running, speed, grain, pauseIndex, reached, setSpeed, seek, reset, edit, changeGrain, toggle,
    step: () => { stop(); advance(); }, options };
}

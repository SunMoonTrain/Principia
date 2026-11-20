import { useMemo, useState, type ReactNode } from 'react';
import type { AnimProps } from '@principia/anim';
import { StepperBar } from './kit/StepperBar';
import { useMachine } from './kit/useMachine';
import type { Condition } from './core/predicate';
import type { Machine } from './core/machine';
import type { Track,Frame } from './core/algorithm';
import './algorithms.css';

export interface Controls {editable:boolean;goals?:Condition[];pauses?:Condition[]}
export function useAlgorithm<P extends Controls, F extends Frame>(
  original: P, machine: Machine<NoInfer<P>, Track<F>[]>, names: string[], rate: number, frameClock = false,
) {
  const [params, setParams] = useState(original);
  const options = useMemo(() => ({
    names, stepsPerSecond: rate, frameClock, goals: params.goals, pauses: params.pauses,
  }), [names, rate, frameClock, params.goals, params.pauses]);
  const player = useMachine(machine, params, 0, options);
  function apply(next: P) {
    setParams(next);
    player.replaceInputs(next);
  }
  return { params, player, apply };
}

export function AlgorithmPlayer<P extends Controls, F extends Frame>({session, labels, reset, editor, children}: {
  session: ReturnType<typeof useAlgorithm<P, F>>;
  labels: AnimProps<P>['labels'];
  reset: () => void;
  editor?: ReactNode;
  children: (tracks: Track<F>[]) => ReactNode;
}) {
  return <StepperBar player={{...session.player, reset}} labels={labels} afterControls={session.params.editable && editor}>
    <div className="algo-panels">{children(session.player.history.state)}</div>
  </StepperBar>;
}

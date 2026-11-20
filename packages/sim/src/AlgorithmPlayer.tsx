import { useMemo, useState, type ReactNode } from 'react';
import type { AnimProps } from '@principia/anim';
import { StepperBar } from './kit/StepperBar';
import { useMachine } from './kit/useMachine';
import type { Condition } from './core/predicate';
import type { Machine } from './core/machine';
import type { Track,Frame } from './core/algorithm';
import './algorithms.css';

export interface Controls {editable:boolean;goals?:Condition[];pauses?:Condition[]}
export function useInputs<P>(original:P){
  const [session,set]=useState({params:original,id:0});
  const apply=(params:P)=>set(s=>({params,id:s.id+1}));
  return {...session,apply,reset:()=>apply(original)};
}
export function AlgorithmPlayer<P,F extends Frame>({params,labels,machine,names,rate,reset,editor,children}:{
  params:P & Controls;labels:AnimProps<P>['labels'];machine:Machine<P,Track<F>[]>;names:string[];rate:number;reset:()=>void;
  editor?:ReactNode;children:(tracks:Track<F>[])=>ReactNode;
}){
  const options=useMemo(()=>({names,stepsPerSecond:rate,goals:params.goals,pauses:params.pauses}),[names,rate,params.goals,params.pauses]);
  const player=useMachine(machine,params,0,options);
  return <StepperBar player={{...player,reset}} labels={labels} afterControls={params.editable&&editor}>
    <div className="algo-panels">{children(player.history.state)}</div>
  </StepperBar>;
}

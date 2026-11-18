import type { ComponentType, LazyExoticComponent } from 'react';
import type { AnimProps } from '@principia/anim';

export const SIMULATORS: Record<string, LazyExoticComponent<ComponentType<AnimProps<never>>>> = {};

import { z } from 'zod';
import type { ComponentSpec } from '../../anim/src/specs.ts';

export const SIM_COMPONENTS = ['bits', 'float32', 'text-encoding', 'logic-circuit', 'cpu', 'cache', 'pipeline', 'memory', 'tree', 'sort', 'grid-search', 'graph', 'dp-table'] as const;
export const ConditionList = z.array(z.strictObject({ when: z.string().min(1), text: z.string().min(1) }));
export const SIM_SPECS: Record<string, ComponentSpec> = {};

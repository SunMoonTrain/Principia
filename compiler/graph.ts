// 前置关系：环检测、层级（最长前置链长度）、多余的前置。
// 边的方向按 plan.md 的写法：A → B 表示 A 是 B 的前置。

/** 每个小节 → 它的直接前置（已去掉不存在的 id）。 */
export type PrereqMap = Map<string, string[]>;

/** 找出所有环。每个环给出一条具体路径（首尾是同一节），方向是「前置 → 后续」。 */
export function findCycles(prereqs: PrereqMap): string[][] {
  // 用 Tarjan 算强连通分量；大小 > 1 或有自环的分量就是环。
  const ids = [...prereqs.keys()].sort();
  const index = new Map<string, number>();
  const low = new Map<string, number>();
  const onStack = new Set<string>();
  const stack: string[] = [];
  const components: string[][] = [];
  let counter = 0;

  const dependents = new Map<string, string[]>(ids.map((id) => [id, []]));
  for (const id of ids) for (const p of prereqs.get(id) ?? []) dependents.get(p)?.push(id);

  const strongConnect = (v: string): void => {
    index.set(v, counter);
    low.set(v, counter);
    counter++;
    stack.push(v);
    onStack.add(v);
    for (const w of dependents.get(v) ?? []) {
      if (!index.has(w)) {
        strongConnect(w);
        low.set(v, Math.min(low.get(v)!, low.get(w)!));
      } else if (onStack.has(w)) {
        low.set(v, Math.min(low.get(v)!, index.get(w)!));
      }
    }
    if (low.get(v) === index.get(v)) {
      const component: string[] = [];
      let w: string;
      do {
        w = stack.pop()!;
        onStack.delete(w);
        component.push(w);
      } while (w !== v);
      components.push(component);
    }
  };
  for (const id of ids) if (!index.has(id)) strongConnect(id);

  const cycles: string[][] = [];
  for (const component of components) {
    const members = new Set(component);
    const start = [...component].sort()[0];
    const selfLoop = (prereqs.get(start) ?? []).includes(start);
    if (component.length === 1 && !selfLoop) continue;
    if (component.length === 1) {
      cycles.push([start, start]);
      continue;
    }
    // 在分量内部从 start 出发广度优先，找一条回到 start 的最短路径
    const previous = new Map<string, string>();
    const seen = new Set([start]);
    const queue = [start];
    let last: string | undefined;
    search: while (queue.length) {
      const v = queue.shift()!;
      for (const w of dependents.get(v) ?? []) {
        if (!members.has(w)) continue;
        if (w === start) {
          last = v;
          break search;
        }
        if (!seen.has(w)) {
          seen.add(w);
          previous.set(w, v);
          queue.push(w);
        }
      }
    }
    const middle: string[] = [];
    for (let v = last; v !== undefined && v !== start; v = previous.get(v)) middle.unshift(v);
    cycles.push([start, ...middle, start]);
  }
  return cycles;
}

/** 层级 = 从没有前置的小节出发，最长前置链的长度；没有前置的是 0。要求图里没有环。 */
export function computeLevels(prereqs: PrereqMap): Map<string, number> {
  const levels = new Map<string, number>();
  const visit = (id: string): number => {
    const known = levels.get(id);
    if (known !== undefined) return known;
    const ps = prereqs.get(id) ?? [];
    const level = ps.length === 0 ? 0 : Math.max(...ps.map(visit)) + 1;
    levels.set(id, level);
    return level;
  };
  for (const id of prereqs.keys()) visit(id);
  return levels;
}

/** 能由别的前置间接推出的前置（plan.md：前置只列最少的直接前置）。要求图里没有环。 */
export function redundantPrereqs(prereqs: PrereqMap): { lesson: string; redundant: string; via: string }[] {
  const ancestors = new Map<string, Set<string>>();
  const ancestorsOf = (id: string): Set<string> => {
    const known = ancestors.get(id);
    if (known) return known;
    const result = new Set<string>();
    for (const p of prereqs.get(id) ?? []) {
      result.add(p);
      for (const a of ancestorsOf(p)) result.add(a);
    }
    ancestors.set(id, result);
    return result;
  };
  const found: { lesson: string; redundant: string; via: string }[] = [];
  for (const [lesson, ps] of prereqs) {
    for (const p of ps) {
      const via = ps.find((q) => q !== p && ancestorsOf(q).has(p));
      if (via) found.push({ lesson, redundant: p, via });
    }
  }
  return found;
}

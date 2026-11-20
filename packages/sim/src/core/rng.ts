/** 单次抽样和推进后的种子都可存入历史。 */
export function nextMulberry32(seed: number) {
  const state = ((seed >>> 0) + 0x6d2b79f5) >>> 0;
  let t = Math.imul(state ^ (state >>> 15), state | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return { state, value: ((t ^ (t >>> 14)) >>> 0) / 4294967296 };
}
export function mulberry32(seed: number): () => number {
  return () => {
    const next = nextMulberry32(seed);
    seed = next.state;
    return next.value;
  };
}

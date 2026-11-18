export const TOKEN = /^[A-Za-z0-9_+.\-]+$/;

export function normalizeToken(token: string, caseSensitive = false): string {
  return caseSensitive ? token : token.toLowerCase();
}

export function sameSequence(expected: readonly string[], actual: readonly string[], caseSensitive = false): boolean {
  return expected.length === actual.length && expected.every((v, i) => normalizeToken(v, caseSensitive) === normalizeToken(actual[i], caseSensitive));
}

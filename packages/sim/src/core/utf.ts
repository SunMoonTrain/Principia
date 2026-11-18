/** Unicode 码位单独显示时，给不可见字符一个可以读出的名字。 */
export function characterLabel(character: string) {
  if (character === '\u200d') return '零宽连接符';
  if (character === '\n') return '换行';
  if (character === '\t') return '制表符';
  if (/[\p{Cc}\p{Cf}\p{Default_Ignorable_Code_Point}]/u.test(character)) return '不可见字符';
  if (!character.trim()) return '空白';
  return /^\p{M}$/u.test(character) ? '◌' + character : character;
}

export function encodeCodePoint(character: string) {
  const raw = character.codePointAt(0)!;
  const point = raw >= 0xd800 && raw <= 0xdfff ? 0xfffd : raw;
  const widths = point <= 0x7f ? [7] : point <= 0x7ff ? [5, 6] : point <= 0xffff ? [4, 6, 6] : [3, 6, 6, 6];
  const utf8 = widths.map((width, index) => {
    const low = 6 * (widths.length - index - 1);
    const prefix = index > 0 ? '10' : widths.length === 1 ? '0' : '1'.repeat(widths.length) + '0';
    const payload = ((point >>> low) & (2 ** width - 1)).toString(2).padStart(width, '0');
    return { prefix, payload, low, high: low + width - 1, byte: parseInt(prefix + payload, 2) };
  });
  const utf16 = point < 0x10000 ? [point] : [0xd800 + ((point - 0x10000) >>> 10), 0xdc00 + ((point - 0x10000) & 1023)];
  return { character: String.fromCodePoint(point), point, utf8, utf16 };
}

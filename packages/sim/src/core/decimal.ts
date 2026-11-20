/** 以输入十进制数为基准；十进制位数和乘法在整数域保留。 */
export function decimalInput(value: number) {
  const [digits, exponent = '0'] = String(value).toLowerCase().split('e');
  const places = (digits.split('.')[1]?.length ?? 0) - Number(exponent);
  const numerator = BigInt(digits.replace('.', ''));
  return { numerator: numerator * 10n ** BigInt(Math.max(0, -places)), places: Math.max(0, places) };
}

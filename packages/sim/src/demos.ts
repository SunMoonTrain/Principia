/** 每个演示的 YAML 也是小节 anim 块的实际写法。 */
export const simDemos = [
  { name: 'bits', title: '补码加法 · 127 + 1', yaml: `width: 8
value: "0b01111111"
op: {kind: add, b: 1}
goals:
  - when: OF == 1
    text: |-
      让两个正数相加得出负数
pauses:
  - when: step == 7
    text: |-
      下一步处理符号位。你预测有符号结果是多少？` },
  { name: 'bits', title: '补码减法 · 5 − 7', yaml: `width: 8
value: 5
op: {kind: sub, b: 7}` },
  { name: 'bits', title: '四位数轮 · 7 + 1', yaml: `width: 4
value: 7
op: {kind: add, b: 1}
show: [wheel]` },
  { name: 'float32', title: '拆开单精度数 · 0.1', yaml: `mode: inspect
value: 0.1` },
  { name: 'float32', title: '单精度加法 · 16777216 + 1', yaml: `mode: add
a: 16777216
b: 1
compare64: true` },
  { name: 'float32', title: '逐次舍入 · 十次 0.1', yaml: `mode: accumulate
delta: 0.1
count: 10
compare64: true` },
  { name: 'text-encoding', title: '从码位到字节 · A中😀', yaml: `text: |-
  A中😀` },
  { name: 'float32', title: '大数累加 · 每次加 3', yaml: `mode: accumulate
start: "2^24"
delta: 3
count: 3
compare64: true` },
];

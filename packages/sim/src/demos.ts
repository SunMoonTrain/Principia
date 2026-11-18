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
  { name: 'logic-circuit', title: '半加器 · 真值表', yaml: `inputs: { A: 0, B: 0 }
gates:
  - { id: sum, type: xor, in: [A, B] }
  - { id: carry, type: and, in: [A, B] }
outputs: { S: sum, C: carry }
show: [circuit, truth-table]` },
  { name: 'logic-circuit', title: '全加器 · 两个加数和进位', yaml: `inputs: { A: 1, B: 1, Cin: 1 }
gates:
  - { id: x1, type: xor, in: [A, B] }
  - { id: x2, type: xor, in: [x1, Cin] }
  - { id: a1, type: and, in: [A, B] }
  - { id: a2, type: and, in: [x1, Cin] }
  - { id: o1, type: or, in: [a1, a2] }
outputs: { S: x2, Cout: o1 }
show: [circuit, truth-table]` },
  { name: 'logic-circuit', title: '四位行波进位加法器 · 观察毛刺', yaml: `inputs: { A3: 0, A2: 1, A1: 1, A0: 1, B3: 0, B2: 0, B1: 0, B0: 1, Cin: 0 }
modules:
  fa:
    inputs: [a, b, cin]
    gates:
      - { id: x1, type: xor, in: [a, b] }
      - { id: x2, type: xor, in: [x1, cin] }
      - { id: a1, type: and, in: [a, b] }
      - { id: a2, type: and, in: [x1, cin] }
      - { id: o1, type: or, in: [a1, a2] }
    outputs: { s: x2, cout: o1 }
gates:
  - { id: u0, type: fa, in: [A0, B0, Cin] }
  - { id: u1, type: fa, in: [A1, B1, u0.cout] }
  - { id: u2, type: fa, in: [A2, B2, u1.cout] }
  - { id: u3, type: fa, in: [A3, B3, u2.cout] }
outputs: { S0: u0.s, S1: u1.s, S2: u2.s, S3: u3.s, Cout: u3.cout }
show: [circuit, timing]
probes: [u1.cout]` },
  { name: 'logic-circuit', title: 'SR 锁存器 · 同拍放开两个输入', yaml: `inputs: { S: 0, R: 0 }
gates:
  - { id: Q, type: nor, in: [R, Qn] }
  - { id: Qn, type: nor, in: [S, Q] }
init: { Q: 0, Qn: 1 }
outputs: { Q: Q, Qn: Qn }
show: [circuit, timing]
goals:
  - when: osc == 1
    text: |-
      让锁存器振荡：先置 S、R 为 1 并走到稳定，再同拍放开两个输入。` },
  { name: 'logic-circuit', title: '非门反馈 · 每两拍重复', yaml: `inputs: {}
gates: [{ id: N, type: not, in: [N] }]
outputs: { Y: N }
show: [circuit, timing]` },
  { name: 'logic-circuit', title: 'D 触发器 · 上升沿采样', yaml: `inputs: { D: 1 }
clock: { every: 4 }
gates: [{ id: Q, type: dff, in: [D, CLK] }]
outputs: { Q: Q }
show: [circuit, timing]` },
  { name: 'logic-circuit', title: '三位计数器 · 八个状态', yaml: `inputs: {}
clock: { every: 4 }
gates:
  - { id: n0, type: not, in: [Q0] }
  - { id: x1, type: xor, in: [Q1, Q0] }
  - { id: a1, type: and, in: [Q1, Q0] }
  - { id: x2, type: xor, in: [Q2, a1] }
  - { id: Q0, type: dff, in: [n0, CLK] }
  - { id: Q1, type: dff, in: [x1, CLK] }
  - { id: Q2, type: dff, in: [x2, CLK] }
outputs: { C2: Q2, C1: Q1, C0: Q0 }
show: [circuit, timing]` },
];

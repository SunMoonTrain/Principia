import { mulberry32 } from './core/rng.ts';
const gridExample=`  S....#....
  .##..#.~~.
  ..#..#.~~.
  ..#....~~.
  ..####..#.
  .......##G`;
function largeGrid(){
  const r=mulberry32(11);
  return Array.from({length:25},(_,y)=>'  '+Array.from({length:40},(_,x)=>!x&&!y?'S':x===39&&y===24?'G':r()<0.28?'#':'.').join('')).join('\n');
}
const graphExample=`nodes: {A: [0, 1], B: [2, 2], C: [2, 0], D: [4, 2], E: [4, 0], F: [6, 1]}
edges: |
  A -- B 4
  A -- C 2
  B -- C 1
  B -- D 5
  C -- D 8
  C -- E 10
  D -- E 2
  D -- F 6
  E -- F 2`;
const cachedSum = `program: |
  LDI R0, arr
  LDI R1, 16
  LDI R2, 0
  loop: LD R3, [R0]
  ADD R2, R3
  ADD R0, 1
  SUB R1, 1
  JNZ loop
  OUT R2
  HLT
  .org 0x80
  arr: .byte 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
cache: {blockSize: 4, sets: 4, ways: 1}`;

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
  { name: 'cpu', title: '累加 1 到 10 · 跟踪 R1', yaml: `program: |
  LDI R0, 10
  LDI R1, 0
  loop: ADD R1, R0
  SUB R0, 1
  JNZ loop
  OUT R1
  HLT
pauses:
  - when: PC == 0x0A
    text: |-
      先猜 R1 现在是多少。
goals:
  - when: outCount == 1
    text: |-
      将累加结果送到输出。` },
  { name: 'cpu', title: '栈 · 保存再取回', yaml: `program: |
  LDI R0, 7
  PUSH R0
  LDI R0, 9
  POP R1
  HLT` },
  { name: 'cpu', title: '子程序 · 返回地址', yaml: `program: |
  LDI R0, 21
  CALL double
  OUT R0
  HLT
  double: ADD R0, R0
  RET` },
  { name: 'cpu', title: '栈进入程序区', yaml: `program: |
  loop: PUSH R0
  JMP loop
pauses:
  - when: SP == 3
    text: |-
      下一次压栈将写到哪条指令？` },
  { name: 'cpu', title: '只用四条指令 · 输出 255', yaml: `program: |
  LDI R0, 254
  ADD R0, 1
  OUT R0
  HLT
isa: [LDI, ADD, OUT, HLT]` },
  { name:'cache', title:'冲突缺失 · 直接映射与两路组相联', yaml:`blockSize: 4
sets: 4
ways: 1
accesses: [0x00, 0x04, 0x10, 0x00]
compare: {sets: 2, ways: 2}` },
  { name:'cache', title:'空间局部性 · 按列读矩阵', yaml:`blockSize: 4
sets: 4
ways: 1
pattern: {kind: matrix, base: 0x80, rows: 8, cols: 8, order: column}
compare: {sets: 16}` },
  { name:'cache', title:'写回与写直达 · 同一串读写', yaml:`blockSize: 4
sets: 4
ways: 1
accesses: [w0x00, 0x00, w0x10, 0x04, 0x00]
compare: {write: write-through}` },
  { name:'cpu', title:'数组求和 · 数据走缓存', yaml:cachedSum },
  { name:'cpu', title:'数组求和 · 取指与数据争用缓存', yaml:cachedSum+'\nfetch: through-cache' },
  ...[true,false].map(forwarding=>({name:'pipeline', title:'ADD 接 ADD · '+(forwarding?'开启':'关闭')+'转发',yaml:`program: |
  ADD R1, R2
  ADD R3, R1
  HLT
forwarding: `+forwarding})),
  {name:'pipeline', title:'取数后使用 · 一个气泡',yaml:`program: |
  LD R1, [0x80]
  ADD R2, R1
  HLT
  .org 0x80
  .byte 7`},
  {name:'pipeline', title:'累加 1 到 10 · 预测不跳',yaml:`program: |
  LDI R0, 10
  LDI R1, 0
  loop: ADD R1, R0
  SUB R0, 1
  JNZ loop
  OUT R1
  HLT
branch: predict-not-taken`},
  {name:'tree',title:'B 树 · 分裂与根升高',yaml:`kind: b-tree
ops: |
  insert 1 2 3 4 5 6 7 8 9 10
pauses:
  - when: nodes == 3
    text: |-
      第一次分裂后，哪个键留在新根？
goals:
  - when: size == 10
    text: |-
      插入全部十个键。`},
  {name:'tree',title:'B 树 · 五次删除',yaml:`kind: b-tree
keys: [1,2,3,4,5,6,7,8,9,10]
ops: |
  delete 1
  delete 8
  delete 4
  delete 3
  delete 7`},
  {name:'tree',title:'并查集 · 按秩合并与压缩',yaml:`kind: union-find
n: 8
ops: |
  union 0 1 2 3 1 3
  find 0
  union 4 5 6 7 5 7 0 4
  find 6
  connected 2 5`},
  {name:'tree',title:'并查集 · 把一条长链压平',yaml:`kind: union-find
union: simple
ops: |
  union 0 1 1 2 2 3 3 4 4 5 5 6 6 7
  find 0`},
  {name:'tree',title:'字典树 · 逐字插入与前缀查找',yaml:`kind: trie
ops: |
  insert car cat cart dog do
  find ca
  prefix ca`},
  {name:'tree',title:'字典树 · 剪枝与地址复用',yaml:`kind: trie
keys: [car, cat, cart, dog, do]
ops: |
  delete cart
  delete do
  insert cab`},
  {name:'tree', title:'AVL · 依次插入 1–7', yaml:`kind: avl
ops: |
  insert 1 2 3 4 5 6 7
pauses:
  - when: rotations == 1
    text: |-
      哪个结点成了新的根？`},
  {name:'tree', title:'BST · 同一串键', yaml:`kind: bst
ops: |
  insert 1 2 3 4 5 6 7`},
  {name:'tree', title:'BST · 删除根 50', yaml:`kind: bst
keys: [50, 30, 70, 20, 40, 60, 80, 65]
ops: |
  delete 50`},
  {name:'tree', title:'红黑树 · 依次插入 1–10', yaml:`kind: red-black
ops: |
  insert 1 2 3 4 5 6 7 8 9 10`},
  {name:'tree', title:'红黑树 · 后继顶替 4', yaml:`kind: red-black
keys: [1,2,3,4,5,6,7,8,9,10]
ops: |
  delete 4`},
  {name:'tree', title:'大顶堆 · 建堆、取根、插入', yaml:`kind: max-heap
keys: [3, 1, 6, 5, 2, 4]
ops: |
  build
  extract
  insert 7`},
  {name:'memory', title:'动态数组 · 翻倍', yaml:`structure: dynamic-array
capacity: 1
growth: 2
ops: |
  push 1 2 3 4 5 6 7 8 9
pauses:
  - when: resizes == 1
    text: |-
      第一次扩容后，旧块里还存着什么？
goals:
  - when: size == 9
    text: |-
      放入全部九个元素。`},
  {name:'memory', title:'动态数组 · 增长 1.5 倍', yaml:`structure: dynamic-array
capacity: 1
growth: 1.5
ops: |
  push 1 2 3 4 5 6 7 8 9`},
  {name:'memory', title:'链表 · 删除中间结点', yaml:`structure: linked-list
ops: |
  push-front 3 2 1
  delete 2`},
  {name:'memory', title:'开放寻址 · 线性探测', yaml:`structure: hash-open
slots: 11
probe: linear
ops: |
  insert 22 33 44 7 18
  delete 33
  find 44
  insert 55 66`},
  {name:'memory', title:'开放寻址 · 平方探测', yaml:`structure: hash-open
slots: 11
probe: quadratic
ops: |
  insert 22 33 44 7 18
  delete 33
  find 44
  insert 55 66`},
  {name:'memory', title:'开放寻址 · 双重散列', yaml:`structure: hash-open
slots: 11
probe: double
ops: |
  insert 22 33 44 7 18
  delete 33
  find 44
  insert 55 66`},
  {name:'memory', title:'桶与链 · 删除 12', yaml:`structure: hash-chain
slots: 5
ops: |
  insert 7 12 17 3 8
  delete 12`},
  {name:'memory', title:'栈 · 先进后出', yaml:`structure: stack
capacity: 2
ops: |
  push 8 13 21
  peek
  pop`},
  {name:'memory', title:'环形队列 · 绕回与扩容', yaml:`structure: queue
capacity: 4
ops: |
  enqueue 1 2 3
  dequeue
  dequeue
  enqueue 4 5 6 7`},
  ...[
    ['冒泡 · 反序八个数','algorithm: bubble\npreset: {kind: reversed, n: 8}'],
    ['插入与归并 · 同一组随机数','algorithm: insertion\nrace: [merge]\npreset: {kind: random, n: 16, seed: 7}'],
    ['快排 · 有序输入与末尾枢轴','algorithm: quick\npreset: {kind: sorted, n: 8}'],
    ['插入与选择 · 相等元素的次序','algorithm: insertion\nrace: [selection]\npreset: {kind: few-unique, n: 12, seed: 3}'],
    ['堆排序 · 取出最大值','algorithm: heap\npreset: {kind: random, n: 10, seed: 5}'],
  ].map(([title,yaml])=>({name:'sort',title,yaml})),
  ...[
    ['寻路 · A* 与 Dijkstra','[{algorithm: astar}, {algorithm: dijkstra}]'],
    ['寻路 · 贪心与加权 A*','[{algorithm: greedy}, {algorithm: astar, weight: 2}]'],
  ].map(([title,runs])=>({name:'grid-search',title,yaml:'map: |\n'+gridExample+'\ncosts: {"~": 5}\nmoves: 4\nruns: '+runs})),
  {name:'grid-search',title:'寻路 · 40 × 25 障碍地图',yaml:'map: |\n'+largeGrid()+'\nruns: [{algorithm: astar}]'},
  ...['bfs','dfs','dijkstra','prim','kruskal'].map(algorithm=>({name:'graph',title:'六结点图 · '+algorithm,
    yaml:graphExample+'\nalgorithm: '+algorithm+(algorithm==='kruskal'?'':'\nsource: A')+(algorithm==='bfs'?'\nview: [graph, table, adjacency, matrix]':'')})),
  ...['dijkstra','bellman-ford'].map(algorithm=>({name:'graph',title:'负权边 · '+algorithm,yaml:`nodes: {A: [0, 1], B: [4, 1], C: [2, 3]}
edges: |
  A -> B 2
  A -> C 3
  C -> B -2
source: A
algorithm: `+algorithm})),
  {name:'graph',title:'拓扑排序 · 穿衣次序',yaml:`algorithm: topo
nodes: {undershorts: [1, 4], pants: [4, 4], shoes: [8, 5], socks: [5, 6], belt: [7, 3], jacket: [10, 2], shirt: [2, 1], tie: [6, 1], watch: [10, 6]}
edges: |
  undershorts -> pants 1
  undershorts -> shoes 1
  pants -> belt 1
  pants -> shoes 1
  belt -> jacket 1
  shirt -> belt 1
  shirt -> tie 1
  tie -> jacket 1
  socks -> shoes 1`},
  {name:'graph',title:'最大流 · 剩余网络增广',yaml:`algorithm: max-flow
nodes: {s: [0, 1], a: [2, 2], b: [2, 0], c: [4, 2], d: [4, 0], t: [6, 1]}
source: s
sink: t
edges: |
  s -> a 16
  s -> b 13
  a -> c 12
  b -> a 4
  b -> d 14
  c -> b 9
  c -> t 20
  d -> c 7
  d -> t 4`},
  {name:'dp-table',title:'公共子序列 · ABCBDAB 与 BDCABA',yaml:`problem: lcs
a: ABCBDAB
b: BDCABA
pauses:
  - when: filled == 42
    text: |-
      两条支路相等时，回溯会先走哪边？
goals:
  - when: traced == 8
    text: |-
      沿表找回公共子序列。`},
  {name:'dp-table',title:'0-1 背包 · 容量七',yaml:'problem: knapsack\ncapacity: 7\nitems: [[1,1],[3,4],[4,5],[5,7]]'},
  {name:'dp-table',title:'编辑距离 · kitten → sitting',yaml:'problem: edit-distance\na: kitten\nb: sitting'},
  {name: 'scheduler', title: '先来先服务与短作业优先', yaml: `jobs: |
  P1 0 24
  P2 0 3
  P3 0 3
runs: [{algorithm: fcfs}, {algorithm: sjf}]
goals:
  - when: switches >= 1
    text: |-
      看见第一次切换。
pauses:
  - when: completed == 1
    text: |-
      第一个作业刚完成。`},
  {name: 'scheduler', title: '四拍时间片轮转', yaml: `jobs: |
  P1 0 24
  P2 0 3
  P3 0 3
runs: [{algorithm: rr, quantum: 4}]`},
  {name: 'scheduler', title: '新作业到达时比较剩余时间', yaml: `jobs: |
  P1 0 8
  P2 1 4
  P3 2 9
  P4 3 5
runs: [{algorithm: srtf}]`},
  {name: 'scheduler', title: '优先级是否抢占', yaml: `jobs: |
  L 0 6 5
  H1 1 2 1
  H2 3 2 1
  H3 5 2 1
  H4 7 2 1
runs: [{algorithm: priority, preemptive: true}, {algorithm: priority}]`},
  {name: 'scheduler', title: '多级反馈队列与短计算段', yaml: `jobs: |
  A 0 20
  B 5 1+3+1+3+1+3+1
runs: [{algorithm: mlfq, quanta: [2, 4, 8]}]`},
  {name: 'scheduler', title: '计算与 I/O 重叠', yaml: `jobs: |
  A 0 5+5+5+5+5
  B 0 15
runs: [{algorithm: fcfs}, {algorithm: srtf}]`},
];

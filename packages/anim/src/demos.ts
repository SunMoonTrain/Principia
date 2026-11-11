// 组件画廊的演示：参数和小节里 :::anim 块的写法一样。不带 React，编译器的测试拿它检查每个演示的写法都能通过构建。

export interface Demo {
  component: string;
  title: string;
  /** 看什么。 */
  note: string;
  params: Record<string, unknown>;
}

export const DEMOS: Demo[] = [
  {
    component: 'function-plot',
    title: 'FunctionPlot · 数列的极限',
    note: '拖动 ε，看 aₙ 从第几项起超过 1 − ε。鼠标移到图上，图例里显示那一项的值。',
    params: {
      range: { x: [0, 41], y: [0, 1.1] },
      functions: [{ expr: '1 - eps', label: '$y=1-\\varepsilon$' }],
      sequences: [{ expr: '1 - 1/n', n: [1, 40], label: '$a_n=1-\\frac{1}{n}$' }],
      sliders: [{ name: 'eps', min: 0.02, max: 0.5, step: 0.01, default: 0.2, label: '$\\varepsilon$' }],
    },
  },
  {
    component: 'function-plot',
    title: 'FunctionPlot · 切线',
    note: '拖动 a，切点和切线跟着动；a = ±1/√3 ≈ ±0.58 时切线是水平的。',
    params: {
      range: { x: [-2, 2], y: [-1.5, 1.5] },
      functions: [
        { expr: 'x^3 - x', label: '$y=x^3-x$' },
        { expr: '(a^3 - a) + (3*a^2 - 1)*(x - a)', label: '在$x=a$处的切线' },
      ],
      points: [{ x: 'a', y: 'a^3 - a' }],
      sliders: [{ name: 'a', min: -1.5, max: 1.5, step: 0.05, default: 0.9, label: '切点$a$' }],
    },
  },
  {
    component: 'function-plot',
    title: 'FunctionPlot · 级数的部分和',
    note: '拖动 N，看方波的傅里叶级数前 N 项的和怎样逼近方波；跳跃点两边冲过头的高度不随 N 变小，只是越来越窄（吉布斯现象）。式子里用 sum(k, 1, N, …) 求和。',
    params: {
      range: { x: [-3.5, 3.5], y: [-1.5, 1.5] },
      functions: [
        { expr: 'sign(sin(x))', label: '方波' },
        { expr: '4/pi * sum(k, 1, N, sin((2k - 1)*x) / (2k - 1))', label: '前$N$项的和' },
      ],
      sliders: [{ name: 'N', min: 1, max: 40, step: 1, default: 5, label: '项数$N$' }],
    },
  },
  {
    component: 'phase-portrait',
    title: 'PhasePortrait · 有阻尼的单摆',
    note: 'x 是摆角，y 是角速度。b = 0 时轨迹是闭合曲线（周期运动）；b > 0 时盘旋着落向平衡点。在图上点一下，从那里放一条新轨迹。',
    params: {
      system: { x: 'y', y: '-sin(x) - b*y' },
      range: { x: [-6.3, 6.3], y: [-3, 3] },
      dt: 0.01,
      initial: [
        [1, 0],
        [3, 0],
      ],
      sliders: [{ name: 'b', min: 0, max: 1, step: 0.05, default: 0.2, label: '阻尼系数$b$' }],
    },
  },
  {
    component: 'phase-portrait',
    title: 'PhasePortrait · 方向场和解曲线',
    note: '画 y′ = y(1 − y) − h：横轴是自变量，写成 x′ = 1 让它匀速增加，轨迹就是解曲线。trail: full 让整条解曲线留着、不变淡，跑出画面就停。h > 1/4 时没有平衡点，解都往下跑出画面。在图上点一下，从那里放一条解曲线。',
    params: {
      system: { x: '1', y: 'y*(1 - y) - h' },
      range: { x: [0, 12], y: [-0.5, 1.5] },
      dt: 0.01,
      trail: 'full',
      initial: [
        [0, 0.1],
        [0, 0.3],
        [0, 0.6],
        [0, 1.3],
      ],
      sliders: [{ name: 'h', min: 0, max: 0.4, step: 0.01, default: 0.1, label: '捕捞量$h$' }],
    },
  },
  {
    component: 'vector-field-2d',
    title: 'VectorField2D · 旋转加伸缩',
    note: 'a = 0 时是纯旋转，粒子绕圈；a < 0 时螺旋着收向原点，a > 0 时螺旋着向外散开。',
    params: {
      field: { x: 'a*x - y', y: 'x + a*y' },
      range: { x: [-3, 3], y: [-3, 3] },
      dt: 0.02,
      particles: 300,
      sliders: [{ name: 'a', min: -0.5, max: 0.5, step: 0.05, default: -0.15, label: '$a$' }],
    },
  },
  {
    component: 'oscillator',
    title: 'Oscillator · 两个耦合振子',
    note: '只拉开左边的物块再放手。中间的弹簧弱（k 小）时，振动在两个物块之间来回转移（拍）；k 越大，转移得越快。',
    params: {
      masses: [1, 1],
      springs: [1, 'k', 1],
      initial: [1, 0],
      dt: 0.01,
      sliders: [{ name: 'k', min: 0.05, max: 2, step: 0.05, default: 0.3, label: '中间弹簧的劲度系数$k$' }],
    },
  },
  {
    component: 'oscillator',
    title: 'Oscillator · 有阻尼的单个振子',
    note: '右端的弹簧写 0，不连墙。c 小时振幅慢慢衰减；c = 4（临界阻尼，2√(km)）附近不再来回振动。',
    params: {
      masses: [1],
      springs: [4, 0],
      damping: 'c',
      initial: [1],
      dt: 0.01,
      sliders: [{ name: 'c', min: 0, max: 6, step: 0.1, default: 0.4, label: '阻尼系数$c$' }],
    },
  },
  {
    component: 'linear-map-2d',
    title: 'LinearMap2D · 矩阵怎样拉扯平面',
    note: '从单位矩阵慢慢变到 [[a, b], [c, d]]。绿、橙红两个箭头是两个基向量的像，也就是矩阵的两列。拖动 c 让行列式变成负数，单位正方形翻了面，颜色跟着变；虚线是特征向量所在的直线，变换过程中这两条线上的点一直留在线上。进度条能拖到任意时刻。',
    params: {
      matrix: [
        ['a', 'b'],
        ['c', 'd'],
      ],
      range: { x: [-3, 3], y: [-3, 3] },
      show: ['grid', 'square', 'basis', 'eigen', 'det'],
      vectors: [{ x: 1, y: 2, label: '$\\mathbf v$' }],
      sliders: [
        { name: 'a', min: -2, max: 2, step: 0.1, default: 1.5, label: '$a$' },
        { name: 'b', min: -2, max: 2, step: 0.1, default: 0.5, label: '$b$' },
        { name: 'c', min: -2, max: 2, step: 0.1, default: 0.5, label: '$c$' },
        { name: 'd', min: -2, max: 2, step: 0.1, default: 1, label: '$d$' },
      ],
    },
  },
  {
    component: 'linear-map-2d',
    title: 'LinearMap2D · 分步：A = PDP⁻¹',
    note: 'A = [[2, 1], [1, 2]] 分三步作用：先顺时针转 45°，把两条特征向量的直线转到坐标轴上；再沿坐标轴伸缩 3 倍和 1 倍；最后转回来。单位圆变成长轴沿 (1, 1) 的椭圆。写 steps 时先作用第一个。',
    params: {
      steps: [
        {
          matrix: [
            ['sqrt(1/2)', 'sqrt(1/2)'],
            ['-sqrt(1/2)', 'sqrt(1/2)'],
          ],
          label: '先转到特征向量的方向上（$P^{-1}$）',
        },
        {
          matrix: [
            [3, 0],
            [0, 1],
          ],
          label: '沿坐标轴伸缩（$D$）',
        },
        {
          matrix: [
            ['sqrt(1/2)', '-sqrt(1/2)'],
            ['sqrt(1/2)', 'sqrt(1/2)'],
          ],
          label: '再转回来（$P$）',
        },
      ],
      range: { x: [-3.5, 3.5], y: [-3.5, 3.5] },
      show: ['grid', 'circle', 'basis', 'eigen'],
    },
  },
];

function flow(v: unknown): string {
  if (typeof v === 'string') return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(flow).join(', ')}]`;
  if (v && typeof v === 'object') return `{ ${Object.entries(v).map(([k, x]) => `${k}: ${flow(x)}`).join(', ')} }`;
  return String(v);
}

/** 演示写回小节里的写法：对象列表逐项展开，label 用块写法 |，其余用流式写法。 */
export function demoSource(demo: Demo): string {
  const lines = [`:::anim{component="${demo.component}"}`];
  for (const [key, value] of Object.entries(demo.params)) {
    const objects = Array.isArray(value) && value.some((x) => x && typeof x === 'object' && !Array.isArray(x));
    if (!objects) {
      lines.push(`${key}: ${flow(value)}`);
      continue;
    }
    lines.push(`${key}:`);
    for (const item of value as Record<string, unknown>[]) {
      Object.entries(item).forEach(([k, x], i) => {
        const prefix = i === 0 ? '  - ' : '    ';
        if (k === 'label') lines.push(`${prefix}label: |`, `      ${String(x)}`);
        else lines.push(`${prefix}${k}: ${k === 'name' ? String(x) : flow(x)}`);
      });
    }
  }
  lines.push(':::');
  return lines.join('\n');
}

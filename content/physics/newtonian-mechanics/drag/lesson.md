---
id: physics.newtonian-mechanics.drag
title: |
  与速度有关的阻力
goal: |
  会求物体在线性阻力和平方阻力作用下的运动，并求出终端速度。
prerequisites: [physics.newtonian-mechanics.common-forces, math.ode.separable, math.calculus.hyperbolic-functions]
minutes: 25
summary: |
  阻力随速率增大，下落物体的速度趋于阻力等于重力时的终端速度。
status: reviewed
---

## 这一节要回答的问题

雨滴从两千米高的云里落下，如果只受:term[重力]{id="physics.newtonian-mechanics.weight"}（weight），落地时:term[速度]{id="physics.newtonian-mechanics.velocity"}（velocity）约有$200\,\mathrm{m/s}$，即$720\,\mathrm{km/h}$，是高铁的两倍；实际上大雨滴落地时只有约$9\,\mathrm{m/s}$。空气是怎样阻碍物体运动的？下落的物体为什么不会一直加速？

## 讲解

### 阻力

::anchor{id="def-drag"}
物体在空气、水这类流体（fluid）里运动时，流体对它的、方向和它相对流体的:term[速度]{id="physics.newtonian-mechanics.velocity"}相反的:term[力]{id="physics.newtonian-mechanics.force"}（force），叫作:term[阻力]{id="physics.newtonian-mechanics.drag"}（drag）。大小和:term[速率]{id="physics.newtonian-mechanics.speed"}（speed）成正比的$F=bv$叫作:term[线性阻力]{id="physics.newtonian-mechanics.linear-drag"}（linear drag），和速率的平方成正比的$F=cv^2$叫作:term[平方阻力]{id="physics.newtonian-mechanics.quadratic-drag"}（quadratic drag）。

为什么这样定义：物体走得越快，每秒推开的流体越多、越猛，阻力就越大。很小、很慢的物体在黏稠的流体里，例如在蜂蜜里下沉的小珠子、空气里的灰尘，阻力近似和速率成正比；大一些、快一些的物体在空气里，例如雨滴、棒球、跳伞的人，阻力近似和速率的平方成正比，$c$和物体的横截面积、空气的密度有关。边界情况：真实的阻力往往介于两者之间，两种模型只是两头的近似；阻力只在物体相对流体运动时才有，顺风时要用相对空气的速度。

### 终端速度

::anchor{id="def-terminal-velocity"}
下落的物体受的:term[阻力]{id="physics.newtonian-mechanics.drag"}随:term[速度]{id="physics.newtonian-mechanics.velocity"}增大。速度为某一个值时，阻力正好和:term[重力]{id="physics.newtonian-mechanics.weight"}相等，:term[合力]{id="physics.newtonian-mechanics.net-force"}（net force）为零，以这个速度下落的物体就一直保持这个速度，这个速度叫作:term[终端速度]{id="physics.newtonian-mechanics.terminal-velocity"}（terminal velocity）：:term[线性阻力]{id="physics.newtonian-mechanics.linear-drag"}时$v_T=\frac{mg}b$，:term[平方阻力]{id="physics.newtonian-mechanics.quadratic-drag"}时$v_T=\sqrt{\frac{mg}c}$。从静止开始下落的物体，速度越来越接近$v_T$。

为什么这样定义：终端速度是下落速度的上限，由$mg$等于阻力定出，不用解:term[运动方程]{id="physics.newtonian-mechanics.equation-of-motion"}（equation of motion）就能算。形状相同时，重的物体终端速度大，所以在空气里铁球比同样大的木球落得快。边界情况：竖直向下抛出时速度超过$v_T$，阻力大于重力，物体反而减速，同样趋于$v_T$。

### 线性阻力下的下落

::anchor{id="thm-linear-drag"}
定理：:term[质量]{id="physics.newtonian-mechanics.mass"}（mass）为$m$的物体从静止开始下落，只受:term[重力]{id="physics.newtonian-mechanics.weight"}和:term[线性阻力]{id="physics.newtonian-mechanics.linear-drag"}$bv$，它的:term[速度]{id="physics.newtonian-mechanics.velocity"}是$v(t)=v_T\bigl(1-e^{-t/\tau}\bigr)$，$\tau=\frac mb=\frac{v_T}g$叫作时间常数（time constant）。

证明思路：取向下为正，:term[运动方程]{id="physics.newtonian-mechanics.equation-of-motion"}是$m\dv vt=mg-bv$，即$\dv vt=\frac1\tau(v_T-v)$。这是可分离变量的方程（separable equation），分离变量得$\frac{1}{v_T-v}\dv vt=\frac1\tau$，两边积分，$-\ln(v_T-v)=\frac t\tau+C$。由$v(0)=0$定出$C=-\ln v_T$，就得到上式。

速度和$v_T$的差按指数衰减，每过一个$\tau$缩小到原来的$\frac1e$，过了$3\tau$速度就达到$v_T$的$95\%$。速度永远只是越来越接近$v_T$，而从不超过它。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 10], y: [0, 36] }
functions:
  - expr: "9.8*x"
    label: |
      没有阻力
  - expr: "(9.8/k)*(1 - exp(-k*x))"
    label: |
      线性阻力
  - expr: "(9.8/k)*tanh(k*x)"
    label: |
      平方阻力
  - expr: "9.8/k"
    label: |
      终端速度$v_T$
sliders:
  - name: k
    min: 0.3
    max: 1.2
    step: 0.05
    default: 0.5
    label: |
      阻力系数$k=\frac g{v_T}$（$\mathrm{s^{-1}}$）
:::

三个物体从静止开始下落，横轴是时间（$\mathrm s$，图上写作$x$），纵轴是:term[速度]{id="physics.newtonian-mechanics.velocity"}（$\mathrm{m/s}$），$g$取$9.8\,\mathrm{m/s^2}$。蓝线没有:term[阻力]{id="physics.newtonian-mechanics.drag"}，速度一直线性增大；橙色、绿色曲线分别受:term[线性阻力]{id="physics.newtonian-mechanics.linear-drag"}和:term[平方阻力]{id="physics.newtonian-mechanics.quadratic-drag"}，两者的:term[终端速度]{id="physics.newtonian-mechanics.terminal-velocity"}都是$v_T=\frac gk$，即紫色的水平线。开始时阻力很小，三条线几乎重合；以后有阻力的两条渐渐弯平，平方阻力的那条更早接近$v_T$。拖动$k$，阻力越大，终端速度越小，接近它也越快。

## 例题

### 例 1　雨滴的下落

雨滴受:term[平方阻力]{id="physics.newtonian-mechanics.quadratic-drag"}，:term[终端速度]{id="physics.newtonian-mechanics.terminal-velocity"}是$9.0\,\mathrm{m/s}$，从静止开始下落，$g$取$9.8\,\mathrm{m/s^2}$。写出:term[速度]{id="physics.newtonian-mechanics.velocity"}随时间的变化，并求它达到终端速度的$90\%$要多长时间。

**为什么想到这么做**：列出:term[运动方程]{id="physics.newtonian-mechanics.equation-of-motion"}，它和:term[线性阻力]{id="physics.newtonian-mechanics.linear-drag"}时一样是可分离变量的方程，只是要用部分分式（partial fractions）积分。

**推导**：取向下为正，$m\dv vt=mg-cv^2$，由$v_T^2=\frac{mg}c$，$\dv vt=g\Bigl(1-\frac{v^2}{v_T^2}\Bigr)$。分离变量，$\frac1{1-u^2}=\frac12\Bigl(\frac1{1-u}+\frac1{1+u}\Bigr)$，$u=\frac v{v_T}$，两边求原函数，由$t=0$时$u=0$定出常数是零，得$\frac{v_T}2\ln\frac{1+u}{1-u}=gt$，即$v=v_T\tanh\frac{gt}{v_T}$。由$\tanh\frac{gt}{v_T}=0.90$，$\frac{gt}{v_T}=\frac12\ln19\approx1.47$，$t\approx1.47\times\frac{9.0}{9.8}\approx1.35\,\mathrm s$。

### 例 2　小船靠惯性滑行

:term[质量]{id="physics.newtonian-mechanics.mass"}$200\,\mathrm{kg}$的小船以$4.0\,\mathrm{m/s}$关掉发动机，靠:term[惯性]{id="physics.newtonian-mechanics.inertia"}（inertia）在静水里滑行，水的:term[阻力]{id="physics.newtonian-mechanics.drag"}是$bv$，$b=50\,\mathrm{kg/s}$。$10\,\mathrm s$后船速多大？船最多能滑出多远？

**为什么想到这么做**：水平方向只有:term[线性阻力]{id="physics.newtonian-mechanics.linear-drag"}，:term[运动方程]{id="physics.newtonian-mechanics.equation-of-motion"}$m\dv vt=-bv$可以分离变量；位置是:term[速度]{id="physics.newtonian-mechanics.velocity"}的原函数。

**推导**：$\tau=\frac mb=4.0\,\mathrm s$，$v=4.0e^{-t/4.0}$，$10\,\mathrm s$后$v=4.0e^{-2.5}\approx0.33\,\mathrm{m/s}$。从关掉发动机的位置算起，位置$x$是速度的原函数，$x=-16e^{-t/4.0}+C$，由$x(0)=0$得$C=16$，所以$x=16\bigl(1-e^{-t/4.0}\bigr)\,\mathrm m$，$10\,\mathrm s$时约$14.7\,\mathrm m$。$t$越大$x$越接近$16\,\mathrm m$而达不到，船永远停不下来，滑出的距离却不超过$v_0\tau=16\,\mathrm m$。

## 常见误区

- 「以:term[终端速度]{id="physics.newtonian-mechanics.terminal-velocity"}下落的物体不受:term[力]{id="physics.newtonian-mechanics.force"}。」它受:term[重力]{id="physics.newtonian-mechanics.weight"}和:term[阻力]{id="physics.newtonian-mechanics.drag"}，两者平衡，:term[合力]{id="physics.newtonian-mechanics.net-force"}为零。
- 「在空气里，轻的物体和重的物体落得一样快。」那是空气的影响可以忽略的时候；有阻力时，形状相同的物体，重的终端速度大，落得快。
- 「有阻力时，下落的物体越落越慢。」从静止开始下落时:term[速度]{id="physics.newtonian-mechanics.velocity"}一直在增大，只是:term[加速度]{id="physics.newtonian-mechanics.acceleration"}（acceleration）越来越小，速度趋于终端速度。

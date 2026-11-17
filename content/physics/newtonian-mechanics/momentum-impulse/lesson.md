---
id: physics.newtonian-mechanics.momentum-impulse
title: |
  动量与冲量
goal: |
  会用动量定理把冲量（力对时间的积分）和动量的变化联系起来。
prerequisites: [physics.newtonian-mechanics.newtons-laws, math.calculus.fundamental-theorem]
minutes: 27
summary: |
  合力的冲量$\int\vb F\,\dd t$等于动量$m\vb v$的改变。
status: reviewed
---

## 这一节要回答的问题

从同样的高度落下，掉在水泥地上的鸡蛋摔碎了，掉在厚海绵上的却完好无损。两次鸡蛋都从同样的:term[速度]{id="physics.newtonian-mechanics.velocity"}（velocity）变成静止，差别在哪里？撞击时的:term[力]{id="physics.newtonian-mechanics.force"}（force）在千分之几秒里先猛增、再减小，没法逐时刻测出来，怎样算它的总效果？

## 讲解

### 动量

::anchor{id="def-momentum"}
:term[质量]{id="physics.newtonian-mechanics.mass"}（mass）为$m$、:term[速度]{id="physics.newtonian-mechanics.velocity"}为$\vb v$的质点，矢量$\vb p=m\vb v$叫作它的:term[动量]{id="physics.newtonian-mechanics.momentum"}（momentum）。

为什么这样定义：质量不变时，:term[牛顿第二定律]{id="physics.newtonian-mechanics.newtons-second-law"}（Newton's second law）可以写成$\vb F=m\dv{\vb v}t=\dv{\vb p}t$，:term[合力]{id="physics.newtonian-mechanics.net-force"}（net force）决定的正是动量的变化率。同样的:term[力]{id="physics.newtonian-mechanics.force"}作用同样长的时间，给轻的物体和重的物体的动量改变一样多，轻的速度变得多，重的变得少。边界情况：动量是矢量，方向和速度相同；做:term[匀速圆周运动]{id="physics.newtonian-mechanics.uniform-circular-motion"}（uniform circular motion）的质点:term[速率]{id="physics.newtonian-mechanics.speed"}（speed）不变，动量的大小不变，方向却一直在变。

### 冲量

::anchor{id="def-impulse"}
:term[力]{id="physics.newtonian-mechanics.force"}$\vb F(t)$从$t_1$到$t_2$对时间的定积分（definite integral）$\vb J=\int_{t_1}^{t_2}\vb F(t)\,\dd t$，叫作这个力在这段时间里的:term[冲量]{id="physics.newtonian-mechanics.impulse"}（impulse），矢量的积分按分量算。

为什么这样定义：力不变时，冲量就是$\vb F\Delta t$，力越大、作用越久，总效果越大。力随时间变化时，把这段时间分成许多小段，每一小段里力近似不变，冲量近似是$\sum\vb F(t_i)\Delta t_i$，分得越来越细就得到积分；画成力随时间变化的曲线，冲量的分量就是曲线下面的面积。边界情况：冲量只看力和作用的时间，不管物体动没动，人推墙推不动时，手对墙的力的冲量也不是零，只是和别的力的冲量抵消了。

### 动量定理

::anchor{id="thm-impulse-momentum"}
定理（:term[动量定理]{id="physics.newtonian-mechanics.impulse-momentum-theorem"}，impulse–momentum theorem）：在:term[惯性系]{id="physics.newtonian-mechanics.inertial-frame"}（inertial frame）里，质点受的:term[合力]{id="physics.newtonian-mechanics.net-force"}在$t_1$到$t_2$这段时间里的:term[冲量]{id="physics.newtonian-mechanics.impulse"}，等于这段时间里质点:term[动量]{id="physics.newtonian-mechanics.momentum"}的改变：$\int_{t_1}^{t_2}\vb F\,\dd t=\vb p(t_2)-\vb p(t_1)$。

证明思路：由:term[牛顿第二定律]{id="physics.newtonian-mechanics.newtons-second-law"}，$\dv{\vb p}t=\vb F$，所以动量的每个分量是合力相应分量的一个原函数。由牛顿-莱布尼茨公式（Newton-Leibniz formula），合力的分量从$t_1$到$t_2$的积分，等于这个原函数在两端的值之差，也就是动量这个分量的改变。

### 平均力

::anchor{id="def-average-force"}
一段时间$\Delta t$里，:term[力]{id="physics.newtonian-mechanics.force"}的:term[冲量]{id="physics.newtonian-mechanics.impulse"}除以$\Delta t$，即$\bar{\vb F}=\frac{\vb J}{\Delta t}$，叫作这段时间里的:term[平均力]{id="physics.newtonian-mechanics.average-force"}（average force）。

为什么这样定义：撞击时力怎样随时间变化很难测，撞击前后的:term[速度]{id="physics.newtonian-mechanics.velocity"}和撞击持续的时间却容易测。平均力是在同样的时间里给出同样冲量的恒力。由:term[动量定理]{id="physics.newtonian-mechanics.impulse-momentum-theorem"}，:term[合力]{id="physics.newtonian-mechanics.net-force"}的平均值（average value）是$\frac{\Delta\vb p}{\Delta t}$：:term[动量]{id="physics.newtonian-mechanics.momentum"}的改变一定时，作用的时间越长，平均力越小，海绵正是这样保护了鸡蛋。边界情况：平均力只反映总效果，撞击中力的最大值比它大，几何图像里曲线的最高点就是平均力的 2 倍。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 70], y: [0, 55] }
functions:
  - expr: "(500/w)*sin(pi*x/w)^2 + 0*sqrt(w - x)"
    label: |
      撞击时的合力
  - expr: "250/w + 0*sqrt(w - x)"
    label: |
      平均力
sliders:
  - name: w
    min: 10
    max: 60
    step: 1
    default: 20
    label: |
      撞击持续的时间$\Delta t$（$\mathrm{ms}$）
:::

:term[质量]{id="physics.newtonian-mechanics.mass"}$50\,\mathrm g$的鸡蛋以$5.0\,\mathrm{m/s}$落地并停下，图上是撞击时它受的:term[合力]{id="physics.newtonian-mechanics.net-force"}，横轴是时间（$\mathrm{ms}$，图上写作$x$），纵轴是:term[力]{id="physics.newtonian-mechanics.force"}（$\mathrm N$）。不管撞击持续多久，鸡蛋的:term[动量]{id="physics.newtonian-mechanics.momentum"}都改变$0.25\,\mathrm{N\cdot s}$，所以蓝色曲线下面的面积，也就是合力的:term[冲量]{id="physics.newtonian-mechanics.impulse"}，始终是$0.25\,\mathrm{N\cdot s}$。橙色线段是:term[平均力]{id="physics.newtonian-mechanics.average-force"}，它下面的矩形面积也是这么多。把撞击时间拉长，曲线变矮变宽，最大的力和平均力都和$\Delta t$成反比。

## 例题

### 例 1　随时间变化的力

:term[质量]{id="physics.newtonian-mechanics.mass"}$2.0\,\mathrm{kg}$的物块静止在光滑的水平面上，从$t=0$起受到一个水平的:term[力]{id="physics.newtonian-mechanics.force"}$F=6t(2-t)\,\mathrm N$（$t$以$\mathrm s$为单位，$0\le t\le2$），$t=2\,\mathrm s$时力撤去。物块最后的:term[速度]{id="physics.newtonian-mechanics.velocity"}多大？

**为什么想到这么做**：竖直方向的力互相抵消，水平方向只有$F$。速度的改变只取决于力对时间的积分，用:term[动量定理]{id="physics.newtonian-mechanics.impulse-momentum-theorem"}一步就能算出，不必先写出每一时刻的:term[加速度]{id="physics.newtonian-mechanics.acceleration"}（acceleration）。

**推导**：$6t(2-t)=12t-6t^2$的一个原函数是$6t^2-2t^3$，由牛顿-莱布尼茨公式，:term[冲量]{id="physics.newtonian-mechanics.impulse"}$J=(6t^2-2t^3)\Big|_0^2=8.0\,\mathrm{N\cdot s}$。由动量定理，$mv-0=J$，$v=\frac{8.0}{2.0}=4.0\,\mathrm{m/s}$。力在$t=1\,\mathrm s$时最大，是$6\,\mathrm N$，两秒里的:term[平均力]{id="physics.newtonian-mechanics.average-force"}是$4.0\,\mathrm N$。

### 例 2　安全气囊

汽车以$54\,\mathrm{km/h}$撞上障碍物后很快停下，车里:term[质量]{id="physics.newtonian-mechanics.mass"}$60\,\mathrm{kg}$的人向前扑到打开的安全气囊上，约$0.15\,\mathrm s$停下；如果没有气囊，头部撞到方向盘上，约$0.010\,\mathrm s$就停下。把人当作质点，两种情况下人在水平方向受的:term[平均力]{id="physics.newtonian-mechanics.average-force"}各是多少？

**为什么想到这么做**：两种情况下人都从同样的:term[速度]{id="physics.newtonian-mechanics.velocity"}变到静止，:term[动量]{id="physics.newtonian-mechanics.momentum"}的改变一样。由:term[动量定理]{id="physics.newtonian-mechanics.impulse-momentum-theorem"}，水平方向的:term[冲量]{id="physics.newtonian-mechanics.impulse"}就是这个改变，除以作用的时间就是平均力。

**推导**：$54\,\mathrm{km/h}=15\,\mathrm{m/s}$，动量改变的大小是$60\times15=900\,\mathrm{N\cdot s}$。扑到气囊上：$\bar F=\frac{900}{0.15}=6.0\times10^3\,\mathrm N$；撞到方向盘上：$\bar F=\frac{900}{0.010}=9.0\times10^4\,\mathrm N$，是前者的$15$倍。气囊并没有减小动量的改变，只是把作用的时间拉长了，还把:term[力]{id="physics.newtonian-mechanics.force"}分散到更大的面积上。

## 常见误区

- 「:term[动量]{id="physics.newtonian-mechanics.momentum"}大的物体，受的:term[力]{id="physics.newtonian-mechanics.force"}也大。」力决定的是动量的变化率；匀速飞行的飞机动量很大，受的:term[合力]{id="physics.newtonian-mechanics.net-force"}却是零。
- 「气囊软，人的动量改变得就少。」人从同样的:term[速度]{id="physics.newtonian-mechanics.velocity"}变到静止，动量的改变一样；气囊只是让作用的时间变长，:term[平均力]{id="physics.newtonian-mechanics.average-force"}变小（例 2）。
- 「:term[冲量]{id="physics.newtonian-mechanics.impulse"}的方向就是物体运动的方向。」冲量的方向是动量改变的方向：球撞墙反弹时，墙给球的冲量和球原来运动的方向相反。

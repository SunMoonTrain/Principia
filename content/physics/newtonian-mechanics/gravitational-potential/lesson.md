---
id: physics.newtonian-mechanics.gravitational-potential
title: |
  引力势能与逃逸速度
goal: |
  会求引力势能，并用能量守恒求逃逸速度。
prerequisites: [physics.newtonian-mechanics.gravitation, physics.newtonian-mechanics.potential-energy, math.calculus.improper-integrals]
minutes: 28
summary: |
  引力势能$U=-\frac{GMm}r$；机械能不小于零的物体能逃到无穷远。
status: reviewed
---

## 这一节要回答的问题

竖直向上发射的物体，发射得越快，飞得越高。要多快，它才能一去不回、彻底摆脱地球？飞到几千千米高时，$g$已经明显变小，:term[重力势能]{id="physics.newtonian-mechanics.gravitational-potential-energy"}（gravitational potential energy）$mgh$还能用吗？

## 讲解

### 引力做的功

地球对卫星的:term[引力]{id="physics.newtonian-mechanics.gravitation"}（gravitation）总指向地心，大小只和卫星到地心的距离有关。这样的:term[力]{id="physics.newtonian-mechanics.force"}（force）做的:term[功]{id="physics.newtonian-mechanics.work"}（work）有简单的算法。

::anchor{id="thm-radial-work"}
定理：质点受的力总沿着它和固定点$O$的连线，大小只和它到$O$的距离$r$有关，写成$\vb F=F(r)\uv r$，其中$\uv r=\frac{\vb r}r$是沿$\vb r$的单位矢量（unit vector），$F>0$时力背离$O$，$F<0$时指向$O$。这个力从$A$到$B$做的功只取决于$A$、$B$到$O$的距离，$W_{AB}=\int_{r_A}^{r_B}F(r)\,\dd r$，所以它是:term[保守力]{id="physics.newtonian-mechanics.conservative-force"}（conservative force）。

证明思路：$r^2=\vb r\cdot\vb r$，两边对时间求导，$2r\dv rt=2\vb r\cdot\vb v$，所以$\uv r\cdot\vb v=\dv rt$，力的:term[功率]{id="physics.newtonian-mechanics.power"}（power）是$\vb F\cdot\vb v=F(r)\dv rt$。设$H'=F$，由链式法则（chain rule），$H\bigl(r(t)\bigr)$对$t$的导数正是$F(r)\dv rt$。按[功与动能定理](lesson:physics.newtonian-mechanics.work-energy#def-work-general)里功的定义，再用牛顿-莱布尼茨公式（Newton-Leibniz formula），$W_{AB}=H(r_B)-H(r_A)=\int_{r_A}^{r_B}F(r)\,\dd r$。

直观地看：质点绕$O$走一段圆弧时，力和:term[速度]{id="physics.newtonian-mechanics.velocity"}（velocity）垂直，不做功；沿半径走时，就是一维的功$\int F\,\dd r$。随便哪条路径，都可以看成许多小段圆弧和小段半径拼成的，所以功只看$r$从多少变到多少。

### 引力势能

::anchor{id="def-gravitational-potential"}
:term[质量]{id="physics.newtonian-mechanics.mass"}（mass）为$M$、$m$的两个质点相距$r$，取无穷远处为参考点，:term[万有引力]{id="physics.newtonian-mechanics.gravitation"}的:term[势能]{id="physics.newtonian-mechanics.potential-energy"}（potential energy）是$U(r)=-\frac{GMm}r$，叫作:term[引力势能]{id="physics.newtonian-mechanics.gravitational-potential-energy-universal"}（gravitational potential energy）。

为什么这样定义：由上面的定理，引力$F(r)=-\frac{GMm}{r^2}$是:term[保守力]{id="physics.newtonian-mechanics.conservative-force"}，质点在$r$处的势能，就是它从$r$移到参考点时引力做的:term[功]{id="physics.newtonian-mechanics.work"}。无穷远处引力为零，各个方向都一样，取它作参考点最自然；这时要算无穷区间上的反常积分（improper integral）：$U(r)=\int_r^{+\infty}\Bigl(-\frac{GMm}{s^2}\Bigr)\dd s=\frac{GMm}s\Big|_r^{+\infty}=-\frac{GMm}r$。势能是负的，表示要把两个质点从相距$r$分开到无穷远，至少要给它们$\frac{GMm}r$的能量。边界情况：在地面上方不高处，$U(R+h)-U(R)=\frac{GMmh}{R(R+h)}\approx\frac{GMm}{R^2}h=mgh$（$h\ll R$），正是以地面为参考点的:term[重力势能]{id="physics.newtonian-mechanics.gravitational-potential-energy"}，见[势能与机械能守恒](lesson:physics.newtonian-mechanics.potential-energy#def-gravitational-pe)；离地面越高，$g$越小，$mgh$就越偏大。

### 逃逸速度

只有:term[引力]{id="physics.newtonian-mechanics.gravitation"}做:term[功]{id="physics.newtonian-mechanics.work"}时，:term[机械能]{id="physics.newtonian-mechanics.mechanical-energy"}（mechanical energy）$E=\frac12mv^2-\frac{GMm}r$守恒（见[势能与机械能守恒](lesson:physics.newtonian-mechanics.potential-energy#thm-mechanical-energy)）。$r\to+\infty$时:term[引力势能]{id="physics.newtonian-mechanics.gravitational-potential-energy-universal"}趋于零，:term[动能]{id="physics.newtonian-mechanics.kinetic-energy"}（kinetic energy）又不能是负的，所以物体能飞到无穷远，当且仅当$E\ge0$；$E<0$的物体最远只能到$-\frac{GMm}r=E$的地方，然后被拉回来。

::anchor{id="def-escape-velocity"}
从天体表面出发、只受这个天体的引力，能飞到无穷远的最小:term[速率]{id="physics.newtonian-mechanics.speed"}（speed），叫作这个天体的:term[逃逸速度]{id="physics.newtonian-mechanics.escape-velocity"}（escape velocity）。由$\frac12mv_2^2-\frac{GMm}R=0$，$v_2=\sqrt{\frac{2GM}R}$；地球的逃逸速度是$\sqrt{2gR}\approx11.2\,\mathrm{km/s}$，也叫第二宇宙速度。

为什么这样定义：发射时的动能越大，物体飞得越高，速率达到$v_2$时，$E=0$，它就能一直飞下去，速率越来越小，趋于零，却永远不会被拉回来。机械能是标量，和:term[速度]{id="physics.newtonian-mechanics.velocity"}的方向无关，只要路径不撞上地面，朝哪个方向发射都一样。$v_2$是:term[第一宇宙速度]{id="physics.newtonian-mechanics.first-cosmic-velocity"}（first cosmic velocity）$\sqrt{gR}$的$\sqrt2$倍。边界情况：真实的发射要穿过大气，空气做负功，需要的速率比$v_2$大；物体的:term[质量]{id="physics.newtonian-mechanics.mass"}约掉了，大火箭和小石子的逃逸速度一样。

## 几何图像

:::anim{component="function-plot"}
range: { x: [1, 6], y: [-1.1, 0.4] }
functions:
  - expr: "-1/x"
    label: |
      引力势能$U$
  - expr: "x - 2"
    label: |
      按$mgh$算的势能
  - expr: "v^2/124.85 - 1"
    label: |
      机械能$E$
points:
  - { x: "1/(1 - v^2/124.85)", y: "v^2/124.85 - 1" }
sliders:
  - name: v
    min: 0
    max: 12.5
    step: 0.1
    default: 7
    label: |
      竖直发射的速率$v_0$（$\mathrm{km/s}$）
:::

横轴是到地心的距离$r$和地球半径$R$之比，图上写作$x$；纵轴的单位是$\frac{GMm}R$。蓝线是:term[引力势能]{id="physics.newtonian-mechanics.gravitational-potential-energy-universal"}$-\frac{GMm}r$；橙线把$g$当作不变，用$mgh$算:term[势能]{id="physics.newtonian-mechanics.potential-energy"}，在地面处和蓝线相切；绿线是从地面竖直发射的物体的:term[机械能]{id="physics.newtonian-mechanics.mechanical-energy"}，圆点是它能到达的最高处，那里势能等于$E$，:term[动能]{id="physics.newtonian-mechanics.kinetic-energy"}为零。$v_0$不大时，蓝线和橙线差不多；$v_0$越大，圆点越远，蓝线比橙线平缓得多，物体比按$mgh$估计的飞得高。$v_0$拖到约$11.2\,\mathrm{km/s}$以上，绿线升到零以上，和蓝线不再相交，物体一去不回。

## 例题

### 例 1　竖直发射能飞多高

从地面以$5.0\,\mathrm{km/s}$竖直向上发射一个物体，不计空气，它能飞到离地面多高？和用$mgh$算的结果比较。$g$取$9.8\,\mathrm{m/s^2}$，地球半径取$6.37\times10^6\,\mathrm m$。

**为什么想到这么做**：只有:term[引力]{id="physics.newtonian-mechanics.gravitation"}做:term[功]{id="physics.newtonian-mechanics.work"}，:term[机械能]{id="physics.newtonian-mechanics.mechanical-energy"}守恒；最高处:term[速度]{id="physics.newtonian-mechanics.velocity"}为零。$GM$不知道，用地面上的$GM=gR^2$代掉。

**推导**：设最高处离地心$r$，$\frac12mv_0^2-\frac{GMm}R=-\frac{GMm}r$。令$a=\frac{v_0^2}{2gR}=\frac{(5.0\times10^3)^2}{2\times9.8\times6.37\times10^6}\approx0.200$，代入$GM=gR^2$得$r=\frac R{1-a}$，离地面$r-R=\frac{a}{1-a}R\approx1.59\times10^6\,\mathrm m$。用$mgh$算，$h=\frac{v_0^2}{2g}\approx1.28\times10^6\,\mathrm m$，少了约$20\%$：越往上$g$越小，物体减速得越来越慢，飞得更高。

### 例 2　把卫星送上更高的轨道

卫星在离地面$300\,\mathrm{km}$的圆轨道上运行，要把它送上半径$4.22\times10^7\,\mathrm m$的同步轨道，每千克至少要增加多少:term[机械能]{id="physics.newtonian-mechanics.mechanical-energy"}？地球的:term[质量]{id="physics.newtonian-mechanics.mass"}取$5.97\times10^{24}\,\mathrm{kg}$，半径取$6.37\times10^6\,\mathrm m$。

**为什么想到这么做**：圆轨道的:term[速率]{id="physics.newtonian-mechanics.speed"}满足$\frac{GMm}{r^2}=\frac{mv^2}r$，由它写出:term[动能]{id="physics.newtonian-mechanics.kinetic-energy"}，再加上:term[引力势能]{id="physics.newtonian-mechanics.gravitational-potential-energy-universal"}，就是圆轨道的机械能，比较两条轨道上的值。

**推导**：圆轨道上$\frac12mv^2=\frac{GMm}{2r}$，正好是引力势能大小的一半，所以$E=\frac{GMm}{2r}-\frac{GMm}r=-\frac{GMm}{2r}$，轨道越高，$E$越大。$r_1=6.67\times10^6\,\mathrm m$，$r_2=4.22\times10^7\,\mathrm m$，每千克要增加$\frac{GM}2\Bigl(\frac1{r_1}-\frac1{r_2}\Bigr)\approx2.5\times10^7\,\mathrm J$。其中动能每千克减少了约$2.5\times10^7\,\mathrm J$（速率从$7.7\,\mathrm{km/s}$降到$3.1\,\mathrm{km/s}$），引力势能却增加了约$5.0\times10^7\,\mathrm J$：卫星升高以后跑得慢了，机械能反而更多。

## 常见误区

- 「:term[引力势能]{id="physics.newtonian-mechanics.gravitational-potential-energy-universal"}是负的，说明物体的能量是负的，这不合理。」:term[势能]{id="physics.newtonian-mechanics.potential-energy"}只有差才有意义，负号来自参考点取在无穷远；它表示要把两者分开，得给它们能量。
- 「要竖直向上发射，才能用:term[逃逸速度]{id="physics.newtonian-mechanics.escape-velocity"}逃走。」:term[机械能]{id="physics.newtonian-mechanics.mechanical-energy"}和方向无关，不计空气、不撞上地面时，朝哪个方向都一样。
- 「离地面多高都可以用$mgh$算势能的变化。」只有高度比地球半径小得多时才行；例 1 里飞到约$1600\,\mathrm{km}$高，按$mgh$算就差了约$20\%$。

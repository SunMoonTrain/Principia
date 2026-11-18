---
id: physics.oscillations-waves.nonlinear-oscillators
title: |
  非线性振动
goal: |
  会分析大振幅单摆和杜芬振子，并说明非线性振动的频率为什么依赖于振幅。
prerequisites: [physics.oscillations-waves.pendulums, math.ode.nonlinear-systems, physics.oscillations-waves.oscillation-energy, math.calculus.substitution]
minutes: 28
summary: |
  回复力不是线性的，周期就随振幅变；大振幅单摆$T=4\sqrt{l/g}\,K\bigl(\sin\frac{\theta_0}2\bigr)$。
status: reviewed
---

## 这一节要回答的问题

弹簧振子来回一次的时间和它摆开多远无关，摆却是摆角越大、来回一次越久。为什么线性的振子是这样，非线性的就不是？摆到很大角度的摆，来回一次的时间能不能精确地算出来？弹簧变硬或变软时，振动的快慢又怎样随摆开的距离变化？

## 讲解

### 频率为什么依赖振幅

::anchor{id="def-nonlinear-oscillation"}
质点在平衡位置两侧来回运动，:term[回复力]{id="physics.oscillations-waves.restoring-force"}（restoring force）却不和位移成正比，这样的振动叫作:term[非线性振动]{id="physics.oscillations-waves.nonlinear-oscillation"}（nonlinear oscillation）。

为什么这样定义：线性回复力的方程$m\ddot x=-kx$有一个特别的性质，解乘上任何常数仍是解，:term[振幅]{id="physics.oscillations-waves.amplitude"}（amplitude）变了，:term[周期]{id="physics.oscillations-waves.period"}（period）不变（见[简谐运动](lesson:physics.oscillations-waves.simple-harmonic-motion#thm-shm-solution)）。回复力不是线性的，这个性质就没有了，周期一般随振幅变化。边界情况：振幅很小时，光滑的回复力在平衡位置附近近似等于它的一次项；一次项不为零（$U''(x_0)>0$）时，非线性振动近似是:term[简谐运动]{id="physics.oscillations-waves.simple-harmonic-motion"}（simple harmonic motion，见[简谐运动的能量与小振动](lesson:physics.oscillations-waves.oscillation-energy#thm-small-oscillation)），一次项为零时不是，例如下面$n=4$的例子。

::anchor{id="thm-period-energy"}
定理：质点在势能$U(x)$中运动，机械能（mechanical energy）为$E$，在$x_1<x_2$之间来回，$U(x_1)=U(x_2)=E$，$U'(x_1)$、$U'(x_2)$都不为零，两点之间$U<E$；它的周期是$T(E)=\sqrt{2m}\int_{x_1}^{x_2}\frac{\dd x}{\sqrt{E-U(x)}}$。

证明思路：由机械能守恒（conservation of mechanical energy），$\frac12m\dot x^2+U(x)=E$，从$x_1$走到$x_2$时$\dot x=\sqrt{\frac2m\bigl(E-U(x)\bigr)}$，用时$\int_{x_1}^{x_2}\frac{\dd x}{\dot x}$，回来的半程用时相同。端点处$E-U$和$\lvert x-x_i\rvert$同阶，被积函数和$\lvert x-x_i\rvert^{-1/2}$同阶，和[单摆与复摆](lesson:physics.oscillations-waves.pendulums#thm-large-amplitude)里的道理一样，这个反常积分（improper integral）收敛。

周期和振幅的关系，就藏在$U$的形状里。例如$U=c\lvert x\rvert^n$，振幅为$A$时$E=cA^n$，换元$x=Au$（两端无界，先在去掉两端一小段的闭区间上换元，再取极限）得$T=\sqrt{\frac{2m}c}\,A^{1-n/2}\int_{-1}^1\frac{\dd u}{\sqrt{1-\lvert u\rvert^n}}$，周期和$A^{1-n/2}$成正比：$n=2$时和振幅无关，$n=4$时和振幅成反比，和简谐运动那一节第 7 题一致。

### 大振幅单摆

::anchor{id="thm-pendulum-period"}
定理：:term[振幅]{id="physics.oscillations-waves.amplitude"}为$\theta_0$（$0<\theta_0<\pi$）的:term[单摆]{id="physics.oscillations-waves.simple-pendulum"}（simple pendulum），:term[周期]{id="physics.oscillations-waves.period"}$T=4\sqrt{\frac lg}\,K(q)$，$q=\sin\frac{\theta_0}2$，$K(q)=\int_0^{\pi/2}\frac{\dd u}{\sqrt{1-q^2\sin^2u}}$；展开得$T=T_0\bigl(1+\frac{\theta_0^2}{16}+\frac{11\theta_0^4}{3072}+\cdots\bigr)$，$T_0=2\pi\sqrt{\frac lg}$；$\theta_0\to\pi$时$T\to\infty$。

证明思路：由[单摆与复摆](lesson:physics.oscillations-waves.pendulums#thm-large-amplitude)，$T=4\sqrt{\frac l{2g}}\int_0^{\theta_0}\frac{\dd\theta}{\sqrt{\cos\theta-\cos\theta_0}}$。$\cos\theta-\cos\theta_0=2\bigl(q^2-\sin^2\frac\theta2\bigr)$。被积函数在$\theta_0$处无界，先在$[0,\theta_1]$（$\theta_1<\theta_0$）上换元$\sin\frac\theta2=q\sin u$（见[换元积分法](lesson:math.calculus.substitution#thm-substitution-definite)），$\sqrt{q^2-\sin^2\frac\theta2}=q\cos u$，$\dd\theta=\frac{2q\cos u}{\sqrt{1-q^2\sin^2u}}\,\dd u$；换元后的被积函数在$\bigl[0,\frac\pi2\bigr]$上连续，再令$\theta_1\to\theta_0$，$u$的上限趋于$\frac\pi2$，反常积分就是这个极限（见[无界函数的反常积分](lesson:math.calculus.improper-unbounded#def-improper-unbounded)），即得。展开时把$\frac1{\sqrt{1-q^2\sin^2u}}$写成泰勒公式（Taylor's formula）$1+\frac12q^2\sin^2u+\frac38q^4\sin^4u+\cdots$逐项积分，得$K=\frac\pi2\bigl(1+\frac{q^2}4+\frac{9q^4}{64}+\cdots\bigr)$，再代入$q^2=\sin^2\frac{\theta_0}2$的展开；$q\to1$时被积函数在$u=\frac\pi2$附近像$\frac1{\cos u}$，积分趋于无穷。

$K(q)$叫作第一类完全椭圆积分（complete elliptic integral of the first kind），没有初等的原函数，可被积函数在整个区间上有界、光滑，数值积分很容易算准。$\theta_0$趋于$\pi$时，摆在接近倒立的位置附近走得极慢，周期越来越长（p5）。

### 杜芬振子

::anchor{id="def-duffing"}
运动方程为$\ddot x+\omega_0^2x+\varepsilon x^3=0$的振子叫作:term[杜芬振子]{id="physics.oscillations-waves.duffing-oscillator"}（Duffing oscillator）；$\varepsilon>0$时:term[回复力]{id="physics.oscillations-waves.restoring-force"}随偏离增长得比线性快，叫作硬弹簧（hardening spring），$\varepsilon<0$时增长得比线性慢，叫作软弹簧（softening spring）。

为什么这样定义：把关于平衡位置对称的回复力在$x=0$处展开，第一项是线性的，下一项就是$x^3$，所以杜芬振子是最简单的、对称的非线性振子。:term[单摆]{id="physics.oscillations-waves.simple-pendulum"}就是一个软弹簧：$\sin\theta\approx\theta-\frac{\theta^3}6$，方程近似为$\ddot\theta+\omega_0^2\theta-\frac{\omega_0^2}6\theta^3=0$。边界情况：$\varepsilon<0$时，偏离超过$\frac{\omega_0}{\sqrt{\lvert\varepsilon\rvert}}$，回复力反而向外，能量足够大的质点不再来回振动；加上阻尼、周期性的驱动力，或者线性项的系数为负（两个势阱）的方程，通常也叫杜芬振子。

::anchor{id="thm-duffing"}
定理：杜芬振子以:term[振幅]{id="physics.oscillations-waves.amplitude"}$A$振动，$\lvert\varepsilon\rvert A^2\ll\omega_0^2$时，:term[角频率]{id="physics.oscillations-waves.angular-frequency"}（angular frequency）$\omega\approx\omega_0+\frac{3\varepsilon A^2}{8\omega_0}$。

证明思路：单位质量的势能是$\frac12\omega_0^2x^2+\frac14\varepsilon x^4$，由上面的:term[周期]{id="physics.oscillations-waves.period"}公式（取$m=1$），利用$A^4-x^4=(A^2-x^2)(A^2+x^2)$，$T=4\int_0^A\frac{\dd x}{\sqrt{A^2-x^2}\,\sqrt{\omega_0^2+\frac\varepsilon2(A^2+x^2)}}$。第二个根号按小量展开，$\frac1{\sqrt{\omega_0^2+\delta}}\approx\frac1{\omega_0}\bigl(1-\frac\delta{2\omega_0^2}\bigr)$，再用$\int_0^A\frac{\dd x}{\sqrt{A^2-x^2}}=\frac\pi2$、$\int_0^A\frac{x^2\,\dd x}{\sqrt{A^2-x^2}}=\frac{\pi A^2}4$（同样先在去掉右端一小段的区间上换元$x=A\sin u$，再取极限），得$T\approx\frac{2\pi}{\omega_0}\bigl(1-\frac{3\varepsilon A^2}{8\omega_0^2}\bigr)$，取倒数即得。

硬弹簧振幅越大振得越快，软弹簧越大越慢。非线性振子的运动也不再是单一的余弦，还含有$3\omega$等:term[频率]{id="physics.oscillations-waves.frequency"}（frequency）的成分（p6）。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 3.1], y: [0.9, 2.2] }
functions:
  - expr: "sum(j, 0, 199, 1/sqrt(1 - sin(x/2)^2*sin((j + 0.5)*pi/400)^2))/200"
    label: |
      精确值$\frac2\pi K\bigl(\sin\frac{\theta_0}2\bigr)$
  - expr: "1 + x^2/16"
    label: |
      展开到$\theta_0^2$
  - expr: "1 + x^2/16 + 11*x^4/3072"
    label: |
      展开到$\theta_0^4$
:::

横轴是:term[单摆]{id="physics.oscillations-waves.simple-pendulum"}的:term[振幅]{id="physics.oscillations-waves.amplitude"}$\theta_0$（弧度），纵轴是:term[周期]{id="physics.oscillations-waves.period"}和小振幅周期之比$\frac T{T_0}$。蓝线是数值积分算出的精确值，橙线、绿线是展开到$\theta_0^2$、$\theta_0^4$的近似。振幅不到$1$弧度时三条线几乎重合；$\theta_0$接近$\pi$时精确值无限增大，任何有限项的展开都跟不上。

## 例题

### 例 1　摆到水平的单摆

:term[单摆]{id="physics.oscillations-waves.simple-pendulum"}从水平位置（$\theta_0=90^\circ$）由静止放开，它的:term[周期]{id="physics.oscillations-waves.period"}是:term[振幅]{id="physics.oscillations-waves.amplitude"}很小时的周期$T_0$的多少倍？取$l=g$的单位，周期是多少？

**为什么想到这么做**：直接用定理，$q=\sin45^\circ=\frac1{\sqrt2}$，要算的是$K\bigl(\frac1{\sqrt2}\bigr)$，被积函数$\frac1{\sqrt{1-\frac12\sin^2u}}$在$\bigl[0,\frac\pi2\bigr]$上光滑，数值积分即可。

**推导**：数值积分得$K\bigl(\frac1{\sqrt2}\bigr)\approx1.8541$，$\frac T{T_0}=\frac2\pi K\approx1.180$；展开到$\theta_0^2$只给出$1.154$。$l=g$时$T=4K\approx7.416$，正是[非线性系统与线性化](lesson:math.ode.nonlinear-systems)第 8 题数值算出的那个数；$l=1.00\,\mathrm m$、$g=9.80\,\mathrm{m/s^2}$时$T\approx2.369\,\mathrm s$，和[单摆与复摆](lesson:physics.oscillations-waves.pendulums)例 2 一致。

### 例 2　把单摆当作软弹簧

用:term[杜芬振子]{id="physics.oscillations-waves.duffing-oscillator"}的:term[频率]{id="physics.oscillations-waves.frequency"}公式，估计:term[单摆]{id="physics.oscillations-waves.simple-pendulum"}的:term[角频率]{id="physics.oscillations-waves.angular-frequency"}怎样随:term[振幅]{id="physics.oscillations-waves.amplitude"}变化，并和大振幅单摆的展开比较。

**为什么想到这么做**：$\sin\theta\approx\theta-\frac{\theta^3}6$，单摆近似是$\varepsilon=-\frac{\omega_0^2}6$的杜芬振子，振幅$A=\theta_0$。

**推导**：$\omega\approx\omega_0+\frac{3}{8\omega_0}\bigl(-\frac{\omega_0^2}6\bigr)\theta_0^2=\omega_0\bigl(1-\frac{\theta_0^2}{16}\bigr)$，:term[周期]{id="physics.oscillations-waves.period"}$T=\frac{2\pi}\omega\approx T_0\bigl(1+\frac{\theta_0^2}{16}\bigr)$，和定理的展开到$\theta_0^2$相同。分析力学用[作用量-角变量](lesson:physics.analytical-mechanics.action-angle-variables)第 5 题得到的也是这个结果。

## 常见误区

- 「:term[单摆]{id="physics.oscillations-waves.simple-pendulum"}的:term[周期]{id="physics.oscillations-waves.period"}$2\pi\sqrt{l/g}$对任何摆角都成立。」它只在摆角小时近似成立，摆到水平时周期要长约$18\%$。
- 「非线性振子的周期总比同样的线性振子长。」软弹簧（如单摆）的周期随:term[振幅]{id="physics.oscillations-waves.amplitude"}变长，硬弹簧的随振幅变短。
- 「非线性振子做的是:term[频率]{id="physics.oscillations-waves.frequency"}随振幅变化的:term[简谐运动]{id="physics.oscillations-waves.simple-harmonic-motion"}。」它做周期运动，可$x(t)$不是单一的余弦函数，除了基本的:term[角频率]{id="physics.oscillations-waves.angular-frequency"}$\omega$，还有$3\omega$等成分。

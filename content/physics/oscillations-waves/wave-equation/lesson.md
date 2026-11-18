---
id: physics.oscillations-waves.wave-equation
title: |
  弦的波动方程
goal: |
  会由弦元的受力推出波动方程，并说明$f(x-vt)$是向右传播的行波。
prerequisites: [physics.oscillations-waves.beaded-string]
minutes: 23
summary: |
  弦满足$\mu y_{tt}=Ty_{xx}$，$v=\sqrt{T/\mu}$；$f(x-vt)$是向右传播的行波。
status: reviewed
---

## 这一节要回答的问题

抖一下绷紧的长绳的一端，一个鼓包沿着绳跑过去，形状几乎不变。绳上每一点只是上下动，向前跑的是什么？跑得多快由什么决定？两个鼓包迎面相遇，会撞得粉碎，还是各自穿过去？

## 讲解

### 弦的运动方程

[一维链与连续极限](lesson:physics.oscillations-waves.beaded-string#thm-continuum-limit)从一串小球取极限得到了弦的方程，这里直接由一小段弦的受力推出它。设弦的线密度（linear density）为$\mu$、张力为$T$，静止时沿$x$轴拉直；$y(x,t)$是$x$处在$t$时刻的横向位移，偏导数（partial derivative）记作$y_t$、$y_x$、$y_{tt}$、$y_{xx}$。

::anchor{id="thm-string-equation"}
定理：弦的斜率处处很小（$|y_x|\ll1$）、重力可以不计时，横向位移满足$\mu y_{tt}=Ty_{xx}$。

证明思路：取$x$到$x+\Delta x$的一小段弦，质量是$\mu\Delta x$。两端的张力沿弦的切线，和$x$轴的夹角$\alpha$很小时，竖直分量$T\sin\alpha\approx T\tan\alpha=Ty_x$，水平分量$T\cos\alpha\approx T$：水平方向两端的力抵消，各处的张力都是$T$；竖直方向的合力是$Ty_x(x+\Delta x,t)-Ty_x(x,t)$。由牛顿第二定律，$\mu\Delta x\,y_{tt}=T\bigl(y_x(x+\Delta x,t)-y_x(x,t)\bigr)$，两边除以$\Delta x$，令$\Delta x\to0$即得。

::anchor{id="def-wave-equation"}
方程$y_{tt}=v^2y_{xx}$叫作一维的:term[波动方程]{id="physics.oscillations-waves.wave-equation"}（wave equation）；对弦，$v=\sqrt{T/\mu}$，叫作弦上的:term[波速]{id="physics.oscillations-waves.wave-speed"}（wave speed）。

为什么这样定义：方程说的是，弦上一点的加速度和那里弯曲的程度$y_{xx}$成正比：向上凹的地方往上加速，向上凸的地方往下加速，弦总被拉向变直的方向。$\sqrt{T/\mu}$的单位是$\sqrt{\mathrm N/(\mathrm{kg/m})}=\mathrm{m/s}$，下面会看到它正是形状移动的速度。边界情况：斜率不小、弦本身有抗弯的硬度或者有阻尼时，方程要加别的项，不再是这个形式。

### 行波

::anchor{id="thm-traveling-wave"}
定理：对任何二阶可导的函数$f$、$g$，$y=f(x-vt)$和$y=g(x+vt)$都满足:term[波动方程]{id="physics.oscillations-waves.wave-equation"}：前者的形状以:term[波速]{id="physics.oscillations-waves.wave-speed"}$v$沿$x$轴正方向平移，后者沿负方向平移。

证明思路：由链式法则（chain rule），$\frac{\partial}{\partial t}f(x-vt)=-vf'(x-vt)$，再求一次得$v^2f''(x-vt)$，而对$x$求两次是$f''(x-vt)$，所以$y_{tt}=v^2y_{xx}$；$g(x+vt)$同理。$t$时刻$y=f(x-vt)$在$x_0+vt$处的值等于$0$时刻在$x_0$处的值$f(x_0)$：整个形状向右挪了$vt$。

::anchor{id="def-traveling-wave"}
形状不变、以一定的速度沿弦平移的波，例如$f(x-vt)$或$g(x+vt)$，叫作:term[行波]{id="physics.oscillations-waves.traveling-wave"}（traveling wave）。

为什么这样定义：向前走的不是弦上的物质，而是「哪里鼓起来」这个形状：每一点只在$y$方向来回动，速度是$y_t=-vf'(x-vt)$，和波速$v$是两回事。边界情况：$\sin kx\cos kvt$也满足波动方程，形状却不平移，只是原地起伏，不是行波；它等于$\frac12\bigl(\sin k(x-vt)+\sin k(x+vt)\bigr)$，是两列反向行波之和。

方程是线性的，两个解之和也是解。$y=f(x-vt)+g(x+vt)$里两个形状各以$v$反向而行，相遇时位移相加，分开后完全复原，就像穿过了对方。无限长的弦上，波动方程的每个解都能写成这种形式，要到[一维波动方程与达朗贝尔公式](lesson:math.pde.wave-dalembert)才证明。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-8, 8], y: [-1, 1.3] }
functions:
  - expr: "exp(-(x + 4 - s)^2)"
    label: |
      向右的脉冲$f(x-vt)$
  - expr: "-0.6*exp(-((x - 4 + s)/0.7)^2)"
    label: |
      向左的脉冲$g(x+vt)$
  - expr: "exp(-(x + 4 - s)^2) - 0.6*exp(-((x - 4 + s)/0.7)^2)"
    label: |
      弦的位移$y$
sliders:
  - name: s
    min: 0
    max: 8
    step: 0.1
    default: 0
    label: |
      两个脉冲各走过的距离$vt$
:::

横轴是弦上的位置$x$，纵轴是横向位移。蓝线、橙线是两个:term[行波]{id="physics.oscillations-waves.traveling-wave"}脉冲各自的位移，绿线是它们相加得到的弦的实际位移，两个脉冲分开时绿线和它们重合。拖动滑块：两个脉冲相向而行，重叠时位移相加、一正一负互相抵掉一部分，然后各自原样穿过去。

## 例题

### 例 1　吉他弦上的波速

一根吉他弦的线密度是$5.0\times10^{-3}\,\mathrm{kg/m}$，张力是$80\,\mathrm N$。求弦上的:term[波速]{id="physics.oscillations-waves.wave-speed"}，以及一个脉冲跑完$0.65\,\mathrm m$长的弦要多久。

**为什么想到这么做**：波速只由张力和线密度决定，$v=\sqrt{T/\mu}$；脉冲形状不变、匀速前进，用时就是长度除以波速。

**推导**：$v=\sqrt{\frac{80}{5.0\times10^{-3}}}=\sqrt{1.6\times10^4}\approx126\,\mathrm{m/s}$，跑完全长要$\frac{0.65}{126}\,\mathrm s\approx5.1\,\mathrm{ms}$。张力变为 4 倍，波速才加倍。

### 例 2　一正一反两个脉冲相遇

$y=f(x-vt)-f(x+vt)$，$f$是偶函数（$f(-u)=f(u)$），表示形状相同、一正一反的两个脉冲相向而行。$t=0$时弦是什么样子？各点的速度呢？

**为什么想到这么做**：两个:term[行波]{id="physics.oscillations-waves.traveling-wave"}的位移直接相加；速度对$t$求偏导数就能得到。

**推导**：$t=0$时$y=f(x)-f(x)=0$，弦完全拉直。速度$y_t=-vf'(x-vt)-vf'(x+vt)$，$t=0$时是$-2vf'(x)$，在$f$变化的地方不为零。所以这一刻弦虽然是直的，各点却在运动；过一会儿两个脉冲又各自出现，接着向前走。

## 常见误区

- 「波向前传，弦上的物质也跟着向前跑。」向前走的是形状；弦上每一点只在横向来回动，它的速度$y_t$和:term[波速]{id="physics.oscillations-waves.wave-speed"}$v$是两回事。
- 「脉冲越陡、越窄，跑得越快。」斜率很小时，弦上的波速$\sqrt{T/\mu}$只由张力和线密度决定，任何形状的脉冲都以同样的速度前进，形状也不变。
- 「两个脉冲相遇会互相反弹。」:term[波动方程]{id="physics.oscillations-waves.wave-equation"}是线性的，位移直接相加，两个脉冲穿过对方继续前进，形状不变（例 2）。

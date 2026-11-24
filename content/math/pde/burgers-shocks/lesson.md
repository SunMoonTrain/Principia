---
id: math.pde.burgers-shocks
title: |
  非线性一阶方程与激波
goal: |
  会用特征线解伯格斯方程，并说明特征线相交时为什么会出现激波。
prerequisites: [math.pde.transport-equation, math.calculus.implicit-differentiation]
minutes: 30
summary: |
  伯格斯方程里$u$大处跑得快，特征线相交后解出现跳跃：激波。
status: reviewed
---

## 这一节要回答的问题

[输运方程与特征线法](lesson:math.pde.transport-equation)里，形状以固定的速度平移，永远不变形。如果每一处前进的速度就是那里的$u$，高处跑得快、低处跑得慢，形状会怎样变？后面的追上了前面的，又会发生什么？

## 讲解

### 伯格斯方程

直线上有许多粒子各自匀速运动，记$t$时刻位于$x$处的粒子的速度为$u(x,t)$。跟着一个粒子走，它的位置$x(t)$满足$\dv xt=u\bigl(x(t),t\bigr)$；它的速度不变，由全导数（total derivative），

$$
0=\dv{}{t}u\bigl(x(t),t\bigr)=u_x\dv xt+u_t=u_t+uu_x.
$$

::anchor{id="def-burgers"}
方程$u_t+uu_x=0$叫作伯格斯方程（Burgers' equation），以伯格斯（Johannes Burgers）命名。像它这样对各个偏导数（partial derivative）是一次的、系数可以依赖$u$本身的一阶方程，叫作拟线性（quasilinear）方程，如$u_t+a(u)u_x=0$。

为什么这样定义：$u$的值以速度$u$被带走，这是「传得多快由$u$决定」最简单的情形。$u$乘了$u_x$，它不是:term[线性偏微分方程]{id="math.pde.linear-pde"}（linear partial differential equation），没有:term[叠加原理]{id="math.pde.superposition-principle"}（superposition principle）。边界情况：$a(u)$是常数$c$时，拟线性方程就是:term[输运方程]{id="math.pde.transport-equation"}（transport equation）。

### 特征线

::anchor{id="def-quasilinear-characteristic"}
设$u$是$u_t+a(u)u_x=0$的可微（differentiable）解。满足$\dv xt=a\bigl(u(x,t)\bigr)$的曲线$x=x(t)$，也叫作这个方程的:term[特征线]{id="math.pde.characteristic-curve"}（characteristic curve）；伯格斯方程的特征线就是粒子走过的路线。

为什么这样定义：像上面那样，$u$沿特征线的全导数是$u_t+a(u)u_x=0$，$u$不变，$\dv xt$也不变，所以特征线是直线；伯格斯方程的初值$u(x,0)=\varphi(x)$给定时，从$x_0$出发的那条是$x=x_0+\varphi(x_0)t$。和:term[输运方程]{id="math.pde.transport-equation"}一样，沿特征线:term[偏微分方程]{id="math.pde.pde"}（partial differential equation）化成了常微分方程（ordinary differential equation），只是这里的特征线要由解来定。边界情况：$\varphi$是常数$c$时，特征线就是输运方程的$x-ct=x_0$。

::anchor{id="thm-burgers-implicit"}
**定理 1**　设$\varphi$有界（bounded）、有连续的导数，$0\le t<t_1$时$1+t\varphi'$处处为正。那么$0\le t<t_1$时，对每个$(x,t)$，方程$u=\varphi(x-ut)$恰有一个解$u$；这样定出的$u(x,t)$可微，满足伯格斯方程和$u(x,0)=\varphi(x)$，并且$u_x=\frac{\varphi'(x_0)}{1+t\varphi'(x_0)}$，其中$x_0=x-ut$。

**证明思路**：固定$t$，$X(x_0)=x_0+t\varphi(x_0)$的导数为正，由拉格朗日中值定理（mean value theorem）它严格递增；$\varphi$有界，由介值定理（intermediate value theorem）它又取遍整条直线。所以$t$时刻特征线互不相交、铺满直线，过$(x,t)$的那条从$x_0=x-ut$出发，$u=\varphi(x_0)$。$G(x,t,u)=u-\varphi(x-ut)$的偏导数连续，$G_u=1+t\varphi'(x_0)>0$，由:term[隐函数定理]{id="math.vector-calculus.implicit-function-theorem"}（implicit function theorem，见[反函数定理与隐函数定理](lesson:math.vector-calculus.inverse-implicit#thm-implicit-function)），$u$可微。固定$t$，对$u=\varphi(x-ut)$两边对$x$求导（隐函数求导，implicit differentiation），得$u_x=\varphi'(x_0)(1-tu_x)$，解出$u_x$；同样求出$u_t$，可验证方程成立。

### 特征线相交

$\varphi$在某处递减时，左边的值比右边大、走得快：$x_0<x_1$、$\varphi(x_0)>\varphi(x_1)$时，两条:term[特征线]{id="math.pde.characteristic-curve"}相交于$t=\frac{x_1-x_0}{\varphi(x_0)-\varphi(x_1)}$，由拉格朗日中值定理，它等于某个$\frac1{-\varphi'(\xi)}$，$\xi$在$x_0$、$x_1$之间。由定理 1，$\varphi'(x_0)<0$的特征线上$u_x$越来越负，波形的这一段越来越陡。

::anchor{id="def-breaking-time"}
设$\varphi$有界、有连续的导数，$\varphi'$有负值，$-\varphi'$在$x_0=\eta$处取得最大值$m$。$t<\frac1m$时$1+t\varphi'\ge1-tm>0$，定理 1 给出可微的解；$t\to\frac1m$时，从$\eta$出发的特征线上$u_x\to-\infty$，波形在那里变成竖直。$\frac1m$叫作破裂时间（breaking time），记作$t^*$。

为什么这样定义：上面的交点时刻$\frac1{-\varphi'(\xi)}\ge t^*$，所以$t^*$以前特征线互不相交；$t^*$以后有些已经相交，$u=\varphi(x-ut)$在一些$x$处有几个解，$u$成了多值的，$1+t\varphi'=0$正是:term[隐函数定理]{id="math.vector-calculus.implicit-function-theorem"}失效的地方。边界情况：$\varphi'$没有负值时不会破裂，如[偏微分方程与分类](lesson:math.pde.pde-basics)里的$u=\frac x{1+t}$，特征线$x=x_0(1+t)$越走越散开。

### 守恒律与激波

把伯格斯方程写成$u_t+\bigl(\frac12u^2\bigr)_x=0$。设$u$、$u_t$连续，对任意$a<b$，

$$
\dv{}{t}\int_a^bu\dd x=\int_a^bu_t\dd x=-\int_a^b\Bigl(\frac{u^2}2\Bigr)_x\dd x=\frac{u(a,t)^2}2-\frac{u(b,t)^2}2.
$$

第一步把求导移进积分号（见[含参变量积分](lesson:math.analysis.parameter-integrals#thm-leibniz-rule)），第二步用了方程，第三步是牛顿-莱布尼茨公式（Newton-Leibniz formula）。区间里的总量只因两端的进出而变。

::anchor{id="def-conservation-law"}
形如$u_t+q(u)_x=0$的方程叫作守恒律（conservation law），$q$叫作流量（flux）；对一切$a<b$都成立的$\dv{}{t}\int_a^bu\dd x=q\bigl(u(a,t)\bigr)-q\bigl(u(b,t)\bigr)$，叫作它的积分形式（integral form）。

为什么这样定义：守恒律就是一维的:term[连续性方程]{id="math.vector-calculus.continuity-equation"}（continuity equation，见[高斯公式（散度定理）](lesson:math.vector-calculus.divergence-theorem#def-continuity-equation)）$u_t+J_x=0$，流量$J=q(u)$只依赖$u$；积分形式是守恒的本来意思。$u$可微、$u_t$连续时两者一样，方程可以写成$u_t+q'(u)u_x=0$，:term[特征线]{id="math.pde.characteristic-curve"}的速度是$q'(u)$；$u$跳跃时偏导数没有意义，积分形式却仍有意义。边界情况：伯格斯方程两边乘$u$，得另一个守恒律$\bigl(\frac{u^2}2\bigr)_t+\bigl(\frac{u^3}3\bigr)_x=0$，下面算出的跳跃速度就不同。

::anchor{id="def-shock"}
满足积分形式、在一些曲线以外是守恒律的可微解的$u$，也算作解（积分形式下的解）。$u$在其中一条曲线$x=s(t)$上跳跃时，这个跳跃叫作激波（shock wave）。

为什么这样定义：特征线相交以后可微的解延续不下去，积分形式下的解却能接着走，把多值的那一段换成跳跃。反例：对伯格斯方程，两侧是$1$、$0$、以$\frac13$的速度走的跳跃不满足积分形式（见定理 2）。

::anchor{id="thm-rankine-hugoniot"}
**定理 2（兰金-于戈尼奥条件，Rankine–Hugoniot condition）**　设$q$有连续的导数，$u$是守恒律$u_t+q(u)_x=0$的积分形式下的解，在可导的曲线$x=s(t)$处跳跃，曲线两侧的可微解连同$u_t$都能连续地延到曲线上，跳跃左、右紧挨着的值是$u_-$、$u_+$，则$s'(t)=\frac{q(u_-)-q(u_+)}{u_--u_+}$。对伯格斯方程，$q(u)=\frac12u^2$，$s'=\frac{u_-+u_+}2$。

**证明思路**：设跳跃附近两侧都是常数，取$a<s(t)<b$，区间里的总量$u_-(s-a)+u_+(b-s)$对$t$的导数是$(u_--u_+)s'$，由积分形式它等于$q(u_-)-q(u_+)$；两侧不是常数时见第 5 题。条件以研究气体激波的兰金（William Rankine）、于戈尼奥（Pierre-Henri Hugoniot）命名。

积分形式下的解并不唯一，能实际出现的激波还要满足：特征线从两侧走进激波，即$q'(u_-)>s'>q'(u_+)$，伯格斯方程就是$u_->u_+$；为什么见第 6 题。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-3, 3], y: [0, 4] }
functions:
  - expr: "(x + 1.5)*sqrt(1 + 1.5^2)/(1.5*A) + 0*sqrt(x + 1.5)"
    label: |
      $x_0=-1.5$
  - expr: "(x + 0.4)*sqrt(1 + 0.4^2)/(0.4*A) + 0*sqrt(x + 0.4)"
    label: |
      $x_0=-0.4$
  - expr: "(0.4 - x)*sqrt(1 + 0.4^2)/(0.4*A) + 0*sqrt(0.4 - x)"
    label: |
      $x_0=0.4$
  - expr: "(1.5 - x)*sqrt(1 + 1.5^2)/(1.5*A) + 0*sqrt(1.5 - x)"
    label: |
      $x_0=1.5$
points:
  - { x: "0", y: "1/A" }
sliders:
  - name: A
    min: 0.5
    max: 2
    step: 0.1
    default: 1
    label: |
      $A$
:::

图上是初值$\varphi(x)=-\frac{Ax}{\sqrt{1+x^2}}$的四条:term[特征线]{id="math.pde.characteristic-curve"}$x=x_0-\frac{Ax_0t}{\sqrt{1+x_0^2}}$，纵轴写作 y，是时间$t$。左边的$u$为正，特征线向右走；右边的为负，向左走；越靠近原点走得越慢。$-\varphi'=\frac A{(1+x^2)^{3/2}}$在原点最大，破裂时间$t^*=\frac1A$，圆点标出$(0,t^*)$，离原点越近的两条特征线交得越接近它。

拖动滑块$A$，坡越陡，破裂得越早。两侧的值互为相反数，由定理 2，激波此后停在$x=0$：特征线走到$x=0$就进了激波，越过它的部分是照特征线硬算的。

![四幅小图从左到右排成一排，横轴 x、纵轴 u，上方依次标着 t = 0、t = 1/2、t = 1、t = 2。前两幅里左边 u = 1、右边 u = 0，中间是一段下降的斜坡，第二幅的斜坡更窄、更陡；第三幅在 x = 1 处用强调色画出竖直的一段，从 1 降到 0；第四幅在 x = 1.5 处用强调色画出竖直的跳跃，旁边用虚线画出照特征线硬算出的形状：上面的水平线一直延到 x = 2，再斜着折回到 x = 1 处的 x 轴，在 1 和 2 之间成了三值的。](steepening.svg)

例 2 的斜坡在$t=0$、$\frac12$、$1$、$2$时的形状。斜坡越走越陡，$t=1$时在$x=1$处竖直；$t=2$时，虚线是照特征线硬算出的三值的形状，实际的解在$x=\frac32$处跳跃（强调色的竖线）。振幅很大的声波（见[声波](lesson:physics.oscillations-waves.sound-waves)）也会这样越传越陡，最后出现压强的突变，因为压强高的地方传得快。

## 例题

### 例 1　鼓包什么时候破裂

伯格斯方程的初值是$\varphi(x)=e^{-x^2}$，求破裂时间和波形最先变竖直的位置。

**为什么想到这么做**：$t^*$由$-\varphi'$的最大值定；最先变竖直的地方，在从最大值点出发的:term[特征线]{id="math.pde.characteristic-curve"}上。

**推导**：$-\varphi'(x)=2xe^{-x^2}$，$x<0$时为负；$x>0$时它的导数$2(1-2x^2)e^{-x^2}$在$\frac1{\sqrt2}$处由正变负。所以$-\varphi'$在$\eta=\frac1{\sqrt2}$处取得最大值$m=\sqrt2e^{-1/2}$，$t^*=\frac1m=\sqrt{\frac e2}\approx1.17$。从$\eta$出发的特征线$x=\eta+\varphi(\eta)t$在$t^*$时到达$x=\frac1{\sqrt2}+e^{-1/2}\sqrt{\frac e2}=\sqrt2$。鼓包的前坡越来越陡，在$x=\sqrt2$处最先变成竖直；后坡上$\varphi'>0$，越拉越缓。

### 例 2　斜坡变成激波

伯格斯方程的初值是$\varphi(x)=1$（$x\le0$）、$1-x$（$0<x<1$）、$0$（$x\ge1$），求激波何时、在哪里出现，以后怎样走。

**为什么想到这么做**：斜坡上$-\varphi'=1$处处相同，从斜坡出发的:term[特征线]{id="math.pde.characteristic-curve"}同时交于一点；以后两侧都是常数，用定理 2。

**推导**：从$x_0\in[0,1]$出发的特征线是$x=x_0+(1-x_0)t$，在$t=1$时都到达$x=1$；左边的特征线$x=x_0+t$、右边的$x=x_0$，和它们都不会更早相交。所以$t<1$时，$u=1$（$x\le t$）、$\frac{1-x}{1-t}$（$t<x<1$）、$0$（$x\ge1$），斜坡越来越陡，$t=1$时在$x=1$处竖直，激波从这里出发。以后左边$u_-=1$、右边$u_+=0$，由定理 2，$s'=\frac12$，$s(t)=1+\frac{t-1}2$；$u_->u_+$，特征线从两侧走进激波。

解沿$x=t$、$x=1$有折角，但整体满足积分形式，照样算作解。

## 常见误区

- 「伯格斯方程的解$u=\varphi(x-ut)$和:term[输运方程]{id="math.pde.transport-equation"}的$\varphi(x-ct)$一样，是:term[行波]{id="math.pde.traveling-wave"}（traveling wave）。」$u$不同的部分走得快慢不同，形状一直在变：例 1 的鼓包前坡越来越陡、后坡越来越缓，不是行波。
- 「波形最先在$\varphi$最大的地方变得竖直。」要看下降最陡的地方：例 1 的鼓包最高处在$x=0$，最先变竖直的却是从$\frac1{\sqrt2}$出发的那一段，到$x=\sqrt2$处。
- 「振幅大的脉冲跑得快，弦上的波也是这样。」[弦的波动方程](lesson:physics.oscillations-waves.wave-equation)一节说，斜率很小时，任何形状的脉冲都以同一个速度前进：那是线性的波，速度和振幅无关。伯格斯方程是非线性的，$u$的值以速度$u$被带走。
- 「激波就是超音速飞机后面的:term[马赫锥]{id="physics.oscillations-waves.mach-cone"}（Mach cone）。」[多普勒效应](lesson:physics.oscillations-waves.doppler-effect)一节把马赫锥上的压强突变也叫激波，那是比波跑得快的波源发出的各个波叠在一起；这里的激波是:term[特征线]{id="math.pde.characteristic-curve"}相交以后解的跳跃，例 2 里并没有运动的波源。

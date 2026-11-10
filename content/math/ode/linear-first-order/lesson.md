---
id: math.ode.linear-first-order
title: |
  一阶线性方程与积分因子
goal: |
  会用积分因子解一阶线性方程。
prerequisites: [math.ode.what-is-ode]
minutes: 30
summary: |
  乘上积分因子$e^{\int p\dd x}$，左边就成了一个乘积的导数。
status: reviewed
---

## 这一节要回答的问题

热水放在房间里冷却，温度的变化率和水与室温的温差成正比；室温$T_a(t)$本身也在变时，方程写出来是$T'+kT=kT_a(t)$的样子。这类方程右边多了一项，没法把$T$和$t$分到两边。有没有一个统一的办法解它们？

## 讲解

### 一阶线性方程

冷却的方程$T'+kT=kT_a(t)$、电容充电的方程$RQ'+\frac QC=E(t)$，形状都一样：未知函数和它的导数各乘一个已知函数，加起来等于一个已知函数。

::anchor{id="def-linear-first-order"}
能写成$y'+p(x)y=q(x)$的方程，叫作:term[一阶线性方程]{id="math.ode.linear-first-order-equation"}（first-order linear equation），这里$p$、$q$是区间$I$上的连续函数。$q\equiv0$时叫作齐次线性方程（homogeneous linear equation），否则叫作非齐次线性方程（nonhomogeneous linear equation）。

为什么这样定义：「线性」指$y$、$y'$都只以一次的形式出现，不相乘、不平方，也不放进别的函数里。这样的方程有统一的解法，解还有简单的结构（定理 2）。边界情况：$y'+y^2=x$不是线性的，$y$平方了；$xy'+y=\sin x$在不含$0$的区间上两边除以$x$，就是线性的。

### 积分因子

看$y'+2y=e^x$。左边不是什么函数的导数，可乘上$e^{2x}$以后，$e^{2x}y'+2e^{2x}y=(e^{2x}y)'$恰好是一个乘积的导数。于是$(e^{2x}y)'=e^{3x}$，两边求原函数（antiderivative）得$e^{2x}y=\frac13e^{3x}+C$，即$y=\frac13e^x+Ce^{-2x}$。

::anchor{id="def-integrating-factor"}
设$P$是$p$的一个原函数，函数$\mu(x)=e^{P(x)}$叫作方程$y'+p(x)y=q(x)$的:term[积分因子]{id="math.ode.integrating-factor"}（integrating factor）。

为什么这样定义：$\mu'=p\mu$，所以$(\mu y)'=\mu y'+p\mu y=\mu(y'+py)$，乘上$\mu$以后，左边正好是乘积$\mu y$的导数。边界情况：积分因子不唯一，$P$差一个常数，$\mu$就差一个正的倍数，不影响最后的解；它永远不为$0$，所以乘上它不会丢掉解，也不会添出解。

::anchor{id="thm-linear-solution"}
**定理 1**　设$p$、$q$在区间$I$上连续，$\mu$是积分因子，$F$是$\mu q$的一个原函数。则方程$y'+p(x)y=q(x)$在$I$上的:term[通解]{id="math.ode.general-solution"}（general solution）是$y=\frac{F(x)+C}{\mu(x)}$；对$x_0\in I$和任意$y_0$，:term[初值问题]{id="math.ode.initial-value-problem"}（initial value problem）$y(x_0)=y_0$在整个$I$上有唯一的解，其中$C=\mu(x_0)y_0-F(x_0)$。

**证明思路**：$y$是解，当且仅当$(\mu y)'=\mu q$，当且仅当$\mu y$是$\mu q$的原函数。同一个函数在区间上的原函数只差常数（见[原函数与不定积分](lesson:math.calculus.antiderivatives)），所以$\mu y=F+C$；连续函数$\mu q$一定有原函数，这由[微积分基本定理](lesson:math.calculus.fundamental-theorem)（fundamental theorem of calculus）保证。初始条件定出唯一的$C$。

为什么想到这么做：左边$y'+py$差一点就是乘积的导数，缺的是一个因子$\mu$，它要满足$\mu'=p\mu$，指数函数正好有这个性质。和$y'=y^2$不同，线性方程的解在$p$、$q$连续的整个区间上都存在，不会中途跑到无穷（第 7 题）。

### 解的结构

::anchor{id="thm-linear-structure"}
**定理 2**　设$y_p$是$y'+p(x)y=q(x)$的一个解，则这个方程的每一个解都能写成$y=y_p+Ce^{-P(x)}$，其中$Ce^{-P(x)}$是齐次线性方程$y'+py=0$的:term[通解]{id="math.ode.general-solution"}。

**证明思路**：两个解$y_1$、$y_2$相减，$(y_1-y_2)'+p(y_1-y_2)=q-q=0$，差是齐次线性方程的解；由定理 1（取$q=0$），齐次线性方程的解是$Ce^{-P(x)}$。

为什么想到这么做：方程对$y$是线性的，两个解之差就把右边的$q$抵消了。在物理上，$Ce^{-P(x)}$常常随时间衰减掉，最后只剩下$y_p$：起点不同，只影响会衰减掉的那一项（几何图像）。边界情况：非线性方程没有这种结构，$y'=y^2$的两个解之差不满足任何简单的方程。

## 几何图像

:::anim{component="phase-portrait"}
system: { x: "1", y: "-k*y + sin(x)" }
range: { x: [0, 15], y: [-2.5, 2.5] }
dt: 0.01
trail: full
initial:
  - [0, -2]
  - [0, -1]
  - [0, 0]
  - [0, 1]
  - [0, 2]
sliders:
  - name: k
    min: 0.3
    max: 3
    step: 0.1
    default: 0.5
    label: |
      $k$
:::

这是$y'+ky=\sin x$的:term[解曲线]{id="math.ode.solution-curve"}（solution curve），横轴可以看成时间。从不同的地方出发，解曲线很快汇到同一条周期曲线上：两条解之差是齐次线性方程的解$Ce^{-kx}$，按指数衰减（定理 2）。拖动$k$：$k$越大，汇合得越快，留下的周期曲线起伏越小。

## 例题

### 例 1　系数不是常数

解$y'-\frac{2}{x}y=x^3$（$x>0$）。

**为什么想到这么做**：方程已经是$y'+p(x)y=q(x)$的样子，$p(x)=-\frac2x$；求出:term[积分因子]{id="math.ode.integrating-factor"}，左边就成了乘积的导数。

**推导**：$P(x)=-2\ln x$，积分因子$\mu=e^{-2\ln x}=\frac{1}{x^2}$。两边乘以$\frac{1}{x^2}$，得$\bigl(\frac{y}{x^2}\bigr)'=x$，所以$\frac{y}{x^2}=\frac{x^2}{2}+C$，$y=\frac{x^4}{2}+Cx^2$。可以代回原方程验证。

### 例 2　跟不上的冷却

室温从$10$度开始，每分钟升高$1$度；一杯$30$度的水放进屋里，温度$T$满足$T'=-0.5\bigl(T-(10+t)\bigr)$。求$T(t)$，并说明很久以后水温比室温低多少。

**为什么想到这么做**：整理成$T'+0.5T=5+0.5t$，是:term[一阶线性方程]{id="math.ode.linear-first-order-equation"}（first-order linear equation），:term[积分因子]{id="math.ode.integrating-factor"}是$e^{0.5t}$。

**推导**：$(e^{0.5t}T)'=(5+0.5t)e^{0.5t}$。右边的一个原函数是$(t+8)e^{0.5t}$，求导可以验证，所以$e^{0.5t}T=(t+8)e^{0.5t}+C$，$T=t+8+Ce^{-0.5t}$。由$T(0)=30$得$C=22$，$T=t+8+22e^{-0.5t}$。很久以后$22e^{-0.5t}$衰减掉，$T\approx t+8$，而室温是$10+t$：水温一直比室温低$2$度，追着室温涨，却总差一截。

## 常见误区

- 「:term[积分因子]{id="math.ode.integrating-factor"}要先算出$\int p\dd x$的全部原函数。」取任意一个原函数就够了，常数只让$\mu$乘上一个正数，不影响解。
- 「乘上积分因子以后，只要对左边求原函数。」两边都要求原函数，并且常数$C$要在除以$\mu$之前加上：写成$y=\frac{F}{\mu}+C$就错了。
- 「所有一阶方程都能这样解。」只有$y$、$y'$都是一次的方程才行；$y'+y^2=x$这样的方程要用别的办法，常常只能数值求解。

---
id: math.ode.numerical-methods
title: |
  数值解法：欧拉法与龙格-库塔法
goal: |
  会用欧拉法和四阶龙格-库塔法求数值解，并比较两种方法的误差随步长缩小得有多快。
prerequisites: [math.ode.what-is-ode, math.calculus.taylor-polynomial]
minutes: 30
summary: |
  欧拉法误差正比于步长，四阶龙格-库塔法正比于步长的四次方。
status: reviewed
---

## 这一节要回答的问题

大多数:term[微分方程]{id="math.ode.differential-equation"}（differential equation）写不出解的公式，$y'=x^2+y^2$就是一个例子。可[方向场](lesson:math.ode.what-is-ode#def-direction-field)（direction field）告诉了我们每一点该往哪个方向走，沿着方向一小步一小步地走，就能近似地画出:term[解曲线]{id="math.ode.solution-curve"}（solution curve）。这样算出来的值有多准？步子缩小一半，误差缩小多少？

## 讲解

### 欧拉法

看$y'=y$，$y(0)=1$，精确解是$e^x$。从$(0,1)$出发，那里的斜率是$1$，沿切线走$0.5$到$(0.5,\,1.5)$；在新的点斜率是$1.5$，再走$0.5$到$(1,\,2.25)$。$2.25$离$e\approx2.718$还差得远，可步子越小，折线就越贴近:term[解曲线]{id="math.ode.solution-curve"}。

::anchor{id="def-euler"}
对:term[初值问题]{id="math.ode.initial-value-problem"}（initial value problem）$y'=f(x,y)$、$y(x_0)=y_0$，取步长（step size）$h>0$，令$x_n=x_0+nh$，按$y_{n+1}=y_n+hf(x_n,y_n)$依次算出$y_1,y_2,\dots$，用$y_n$近似$y(x_n)$。这叫作:term[欧拉法]{id="math.ode.euler-method"}（Euler's method）。

为什么这样定义：$y(x_n+h)\approx y(x_n)+hy'(x_n)$是一阶泰勒近似（Taylor approximation），在:term[方向场]{id="math.ode.direction-field"}里，就是沿着$(x_n,y_n)$处的小线段走出$h$那么远。边界情况：除了第一步，每一步都从近似值$y_n$而不是真正的$y(x_n)$出发，前面的误差会被带到后面，所以要看误差怎样累积。

### 误差与阶

::anchor{id="def-local-error"}
从精确值$y(x_n)$出发、按方法走一步，得到的值与$y(x_{n+1})$之差，叫作:term[局部截断误差]{id="math.ode.local-truncation-error"}（local truncation error）；从$x_0$走到固定的$X=x_0+Nh$，$y_N$与$y(X)$之差，叫作:term[整体误差]{id="math.ode.global-error"}（global error）。整体误差像$Ch^p$那样随$h$缩小时，就说这个方法是$p$阶（order $p$）的。

为什么这样定义：局部截断误差说一步走得准不准，整体误差才是最后关心的；阶说的是步长缩小一半，误差缩小到$\frac{1}{2^p}$。边界情况：局部截断误差是$h^{p+1}$量级时，整体误差一般只有$h^p$量级，低一阶，因为走到$X$要走$N=\frac{X-x_0}{h}$步，误差一步步累积起来。

::anchor{id="thm-euler-order"}
**:term[欧拉法]{id="math.ode.euler-method"}是一阶方法**　设$f$对$y$满足$|f(x,y)-f(x,z)|\le L|y-z|$（$L$是常数），解$y$有连续的二阶导数，则欧拉法的局部截断误差是$\frac{h^2}{2}y''(\xi)$，在有界区间上，整体误差是$h$的量级。

**证明思路**：由带拉格朗日余项的[泰勒公式](lesson:math.calculus.taylor-polynomial)（Taylor's formula），$y(x_n+h)=y(x_n)+hy'(x_n)+\frac{h^2}{2}y''(\xi)$，后一项就是局部截断误差。$N\sim\frac1h$步、每步$h^2$量级的误差加起来是$h$量级；前面的误差每走一步至多放大到$1+hL$倍，这正是定理里对$f$的条件保证的，累积起来仍是$h$的量级，严格的估计见第 5 题。

### 改进的欧拉法与龙格-库塔法

:term[欧拉法]{id="math.ode.euler-method"}只用了每一步起点的斜率。要走得更准，可以多试几个点的斜率，取一个更有代表性的平均。

::anchor{id="def-heun"}
每一步先用欧拉法试走一步，再把起点的斜率$k_1=f(x_n,y_n)$和试走终点的斜率$k_2=f(x_n+h,\,y_n+hk_1)$取平均，令$y_{n+1}=y_n+\frac h2(k_1+k_2)$，这叫作:term[改进的欧拉法]{id="math.ode.improved-euler"}（improved Euler method，也叫 Heun's method）。$f$足够光滑时，它是二阶方法（第 6 题）。

为什么这样定义：起点的斜率只代表这一步的开头，两端的斜率取平均，相当于用梯形公式（trapezoidal rule）代替矩形去算这一步的积分。边界情况：每一步要算两次$f$，比欧拉法多一倍；$f$只依赖$x$时，它就是对$\int f\dd x$用梯形公式。

::anchor{id="def-rk4"}
每一步算四个斜率：$k_1=f(x_n,y_n)$，$k_2=f\bigl(x_n+\frac h2,\,y_n+\frac h2k_1\bigr)$，$k_3=f\bigl(x_n+\frac h2,\,y_n+\frac h2k_2\bigr)$，$k_4=f(x_n+h,\,y_n+hk_3)$，再令$y_{n+1}=y_n+\frac h6(k_1+2k_2+2k_3+k_4)$，这叫作:term[四阶龙格-库塔法]{id="math.ode.rk4"}（classical fourth-order Runge-Kutta method，RK4）。

为什么这样定义：$f$只依赖$x$时，它正是辛普森公式（Simpson's rule）算$\int_{x_n}^{x_n+h}f\dd x$；四个斜率的权重是精心选的，$f$足够光滑时，能让$y_{n+1}$和真正的$y(x_n+h)$的泰勒展开一直对到$h^4$项，:term[局部截断误差]{id="math.ode.local-truncation-error"}是$h^5$量级，:term[整体误差]{id="math.ode.global-error"}是$h^4$量级。边界情况：每步要算四次$f$，比欧拉法贵四倍，可在同样的计算量下，它通常准得多（例 2）。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 2.1], y: [0, 8.5] }
functions:
  - expr: "exp(x)"
    label: |
      精确解$y=e^x$
  - expr: "(1 + 1/N)^floor(x*N) * (1 + (x - floor(x*N)/N))"
    label: |
      欧拉法的折线
points:
  - { x: "1", y: "(1 + 1/N + 1/(2*N^2) + 1/(6*N^3) + 1/(24*N^4))^N" }
  - { x: "2", y: "(1 + 1/N + 1/(2*N^2) + 1/(6*N^3) + 1/(24*N^4))^(2*N)" }
sliders:
  - name: N
    min: 1
    max: 10
    step: 1
    default: 2
    label: |
      每单位长度走$N$步
:::

这是$y'=y$、$y(0)=1$，步长$h=\frac1N$。拖动$N$：:term[欧拉法]{id="math.ode.euler-method"}的折线一直在$e^x$下面，$N$大了以后，步数加倍，$x=2$处的差距大约减半；两个圆点是:term[四阶龙格-库塔法]{id="math.ode.rk4"}在$x=1$、$x=2$处算出的值，$N=1$时就几乎落在$e^x$上，每单位只走一步，误差也看不太出来。欧拉法折线的顶点是方法算出的值，顶点之间的线段就是沿:term[方向场]{id="math.ode.direction-field"}的小线段走的那一步。

## 例题

### 例 1　欧拉法为什么是一阶的

用:term[欧拉法]{id="math.ode.euler-method"}解$y'=y$、$y(0)=1$，步长$h=\frac1N$。估计$x=1$处的:term[整体误差]{id="math.ode.global-error"}（global error）。

**为什么想到这么做**：对$y'=y$，欧拉法每一步是$y_{n+1}=(1+h)y_n$，可以写出$y_N$的公式，再和$e$比较。

**推导**：$y_N=(1+h)^N=\bigl(1+\frac1N\bigr)^N$。由泰勒公式，$N\ln\bigl(1+\frac1N\bigr)=1-\frac{1}{2N}+O\bigl(\frac{1}{N^2}\bigr)$，所以$y_N=e\cdot e^{-\frac{1}{2N}+O(N^{-2})}=e-\frac{e}{2N}+O\bigl(\frac{1}{N^2}\bigr)$。整体误差约为$\frac{e}{2}h$，和$h$成正比：步长减半，误差减半，欧拉法是一阶的。

### 例 2　三种方法比一比

仍是$y'=y$、$y(0)=1$，算$y(1)$的近似值，看步长从$0.1$减到$0.05$时误差怎样变。

**为什么想到这么做**：精确值是$e$，三种方法在同样的步长下各算一遍，看误差缩小的倍数，就能看出阶。

**推导**：误差（$e$减去近似值）如下表。

| 方法 | $h=0.1$ | $h=0.05$ | 缩小倍数 |
| --- | --- | --- | --- |
| :term[欧拉法]{id="math.ode.euler-method"} | $1.245\times10^{-1}$ | $6.50\times10^{-2}$ | 约$1.9$ |
| :term[改进的欧拉法]{id="math.ode.improved-euler"} | $4.20\times10^{-3}$ | $1.09\times10^{-3}$ | 约$3.9$ |
| :term[四阶龙格-库塔法]{id="math.ode.rk4"} | $2.08\times10^{-6}$ | $1.36\times10^{-7}$ | 约$15.3$ |

步长减半，误差分别缩小约$2$倍、$4$倍、$16$倍，对应一阶、二阶、四阶。龙格-库塔法在$h=0.1$时只算了$40$次$f$，误差就比欧拉法在$h=0.05$时（算$20$次）小四个数量级。

## 常见误区

- 「每一步的误差很小，最后的误差也就很小。」误差会累积：步数是$\frac1h$量级，:term[局部截断误差]{id="math.ode.local-truncation-error"}$h^2$累积成:term[整体误差]{id="math.ode.global-error"}$h$。
- 「步长越小越好。」步长太小，步数太多，计算量大，舍入误差（round-off error）也会一步步积累（第 8 题）。
- 「:term[四阶龙格-库塔法]{id="math.ode.rk4"}的『四阶』是说每步算四次斜率。」四阶说的是整体误差和$h^4$成正比；算四次$f$只是它的代价，二者凑巧都是$4$。

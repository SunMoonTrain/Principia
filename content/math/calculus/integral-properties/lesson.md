---
id: math.calculus.integral-properties
title: |
  定积分的性质
goal: |
  会用定积分的线性、区间可加性和保序性估计积分的值，知道连续函数在区间上取得到它的平均值。
prerequisites: [math.calculus.definite-integral, math.calculus.closed-interval-properties]
minutes: 26
summary: |
  定积分有线性、区间可加性、保序性；连续函数取得到它的平均值。
status: reviewed
---

## 这一节要回答的问题

$\int_0^1e^{-x^2}\,\dd x$用:term[黎曼和]{id="math.calculus.riemann-sum"}（Riemann sum）很难算出精确值，能不能至少知道它在哪两个数之间？:term[定积分]{id="math.calculus.definite-integral"}（definite integral）是黎曼和的极限，求和的那些规律，比如可以分组相加、每一项变大和就变大，积分也有吗？

## 讲解

### 两个约定

::anchor{id="def-reversed-limits"}
规定$\int_a^af(x)\,\dd x=0$；$a>b$时，规定$\int_a^bf(x)\,\dd x=-\int_b^af(x)\,\dd x$。

为什么这样规定：从$a$积到$a$，区间缩成一个点，面积是$0$；从右往左积，:term[黎曼和]{id="math.calculus.riemann-sum"}里的$\Delta x_i$都变成负的，结果正好差一个符号。有了这两条，下面的:term[区间可加性]{id="math.calculus.additivity-over-intervals"}（additivity over intervals）对$a$、$b$、$c$的任何顺序都成立。边界情况：$a>b$时$\int_a^bf(x)\,\dd x$不再是面积，$f\ge0$时它是面积的相反数。

### 线性与区间可加性

::anchor{id="thm-linearity"}
**定理（线性，linearity）**　设$f$、$g$在$[a,b]$上:term[可积]{id="math.calculus.integrable"}（integrable），$\alpha$、$\beta$是常数，则$\alpha f+\beta g$也可积，并且$\int_a^b\bigl[\alpha f(x)+\beta g(x)\bigr]\dd x=\alpha\int_a^bf(x)\,\dd x+\beta\int_a^bg(x)\,\dd x$。

道理：取同一个:term[分割]{id="math.calculus.partition"}（partition）、同一组点，$\sum\bigl[\alpha f(\xi_i)+\beta g(\xi_i)\bigr]\Delta x_i=\alpha\sum f(\xi_i)\Delta x_i+\beta\sum g(\xi_i)\Delta x_i$，分割越来越细时两边一起取极限。

::anchor{id="thm-additivity"}
**定理（:term[区间可加性]{id="math.calculus.additivity-over-intervals"}，additivity over intervals）**　设$f$在包含$a$、$b$、$c$的区间上可积，则$\int_a^bf(x)\,\dd x=\int_a^cf(x)\,\dd x+\int_c^bf(x)\,\dd x$。

道理：$a<c<b$时，把$c$取作分点，:term[黎曼和]{id="math.calculus.riemann-sum"}分成$[a,c]$和$[c,b]$上的两部分，取极限即得；几何上，两块面积拼成一块。别的顺序用两个约定化成这种情形，比如$a<b<c$时先有$\int_a^c=\int_a^b+\int_b^c$，移项就是要证的式子。

由几何意义还能看出对称的用处：奇函数（odd function，$f(-x)=-f(x)$）在$[-a,a]$上的积分是$0$，左右两块带符号的面积正好抵消；偶函数（even function）在$[-a,a]$上的积分是$[0,a]$上的$2$倍（例 2）。

### 保序性与估值

::anchor{id="thm-monotone-integral"}
**定理（保序性，monotonicity）**　设$a<b$，$f$、$g$在$[a,b]$上:term[可积]{id="math.calculus.integrable"}，并且处处$f(x)\le g(x)$，则$\int_a^bf(x)\,\dd x\le\int_a^bg(x)\,\dd x$。

道理：每个:term[黎曼和]{id="math.calculus.riemann-sum"}里都逐项有$f(\xi_i)\Delta x_i\le g(\xi_i)\Delta x_i$，取极限时不等号保持。取$g$为常数，得到估值（estimation）：如果在$[a,b]$上$m\le f(x)\le M$，那么$m(b-a)\le\int_a^bf(x)\,\dd x\le M(b-a)$。由$-|f|\le f\le|f|$，还有$\Bigl|\int_a^bf(x)\,\dd x\Bigr|\le\int_a^b|f(x)|\,\dd x$（$f$:term[连续]{id="math.calculus.continuous"}（continuous）时$|f|$也连续，可积）。

为什么有用：积分算不出来时，先估计出它在哪两个数之间（例 1）。边界情况：$f\le g$并且有些点上$f<g$，积分却可能相等：只改变一个点的函数值，黎曼和里至多两项受影响，:term[分割]{id="math.calculus.partition"}越来越细时这两项趋于$0$，积分不变。所以要得到严格的不等号，需要连续，见下面的定理。

::anchor{id="thm-positive-integral"}
**定理**　设$a<b$，$f$在$[a,b]$上连续，$f\ge0$，并且有一点$x_0$使$f(x_0)>0$，则$\int_a^bf(x)\,\dd x>0$。

道理：$x$靠近$x_0$时$f(x)$无限接近$f(x_0)$，所以在含$x_0$的一小段$[c,d]$上$f(x)>\frac{f(x_0)}2$。由:term[区间可加性]{id="math.calculus.additivity-over-intervals"}，把积分拆成这一段和其余部分：其余部分的积分不小于$0$，这一段的积分不小于$\frac{f(x_0)}2(d-c)>0$。

### 积分中值定理与平均值

::anchor{id="thm-integral-mean-value"}
**定理（:term[积分中值定理]{id="math.calculus.integral-mean-value-theorem"}，mean value theorem for integrals）**　设$f$在$[a,b]$上:term[连续]{id="math.calculus.continuous"}，则有$\xi\in[a,b]$，使$\int_a^bf(x)\,\dd x=f(\xi)(b-a)$。

道理：由:term[最值定理]{id="math.calculus.extreme-value-theorem"}（extreme value theorem），$f$在$[a,b]$上取得到最小值$m$和最大值$M$；由估值，$m\le\frac1{b-a}\int_a^bf(x)\,\dd x\le M$。由:term[介值定理]{id="math.calculus.intermediate-value-theorem"}（intermediate value theorem），$f$取遍$m$和$M$之间的值，所以有一点$\xi$，使$f(\xi)$正好等于中间这个数。几何上，以$f(\xi)$为高、$[a,b]$为底的长方形，面积等于:term[曲边梯形]{id="math.calculus.curvilinear-trapezoid"}（curvilinear trapezoid）的面积。

::anchor{id="def-average-value"}
$\frac1{b-a}\int_a^bf(x)\,\dd x$叫作$f$在$[a,b]$上的:term[平均值]{id="math.calculus.average-value"}（average value）。

为什么这样定义：等分成$n$段的:term[黎曼和]{id="math.calculus.riemann-sum"}除以$b-a$，是$\frac1n\sum_{i=1}^nf(\xi_i)$，正是$n$个函数值的平均数；:term[分割]{id="math.calculus.partition"}越来越细，就是「所有函数值的平均」。速度在一段时间上的平均值，就是位移除以时间，即平均速度。边界情况：不连续的函数可能取不到它的平均值，$[0,2]$上$x<1$时取$0$、$x\ge1$时取$1$的函数，平均值是$\frac12$，它却只取$0$和$1$两个值。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-0.3, 4.3], y: [-3.2, 2.2] }
functions:
  - expr: "1 + x - x^2/2"
    label: |
      $y=f(x)=1+x-\frac{x^2}2$
  - expr: "1 + b/2 - b^2/6 + 0*sqrt(x*(b - x))"
    label: |
      $f$在$[0,b]$上的平均值
points:
  - { x: "b", y: "1 + b - b^2/2" }
sliders:
  - name: b
    min: 0.5
    max: 4
    step: 0.05
    default: 2
    label: |
      右端点$b$
:::

蓝色曲线是$f(x)=1+x-\frac{x^2}2$，橙色线段从$x=0$画到$x=b$，高度是$f$在$[0,b]$上的:term[平均值]{id="math.calculus.average-value"}；以它为高的长方形，面积等于$\int_0^bf(x)\,\dd x$。拖动$b$，橙色线段总和蓝色曲线相交，交点的横坐标就是:term[积分中值定理]{id="math.calculus.integral-mean-value-theorem"}里的$\xi$；曲线在线段上方多出的面积，正好补上下方缺的面积。$b>1.5$以后，右端新加进来的函数值比当前的平均值小，平均值开始变小；$b>1+\sqrt3$以后，曲线还有一段在$x$轴下方，那部分面积算负的。

## 例题

### 例 1　估计一个算不出的积分

估计$\int_0^1e^{-x^2}\,\dd x$。

**为什么想到这么做**：$x^2$在$[0,1]$上递增，$e^{-x^2}$就递减，最大值、最小值在两端取到，可以直接用估值。区间分得越细，估计越准，分段要用:term[区间可加性]{id="math.calculus.additivity-over-intervals"}。

**推导**：在$[0,1]$上$e^{-1}\le e^{-x^2}\le1$，所以积分在$e^{-1}\approx0.368$和$1$之间。在$\frac12$处分开：$\bigl[0,\frac12\bigr]$上$e^{-1/4}\le e^{-x^2}\le1$，$\bigl[\frac12,1\bigr]$上$e^{-1}\le e^{-x^2}\le e^{-1/4}$，两段各自估值再相加，得

$$
\frac12\bigl(e^{-1/4}+e^{-1}\bigr)\le\int_0^1e^{-x^2}\,\dd x\le\frac12\bigl(1+e^{-1/4}\bigr),
$$

即积分在$0.573$和$0.890$之间，比一开始的估计窄得多。

### 例 2　平均值

求$f(x)=1-x^2$在$[-1,1]$上的:term[平均值]{id="math.calculus.average-value"}，并求:term[积分中值定理]{id="math.calculus.integral-mean-value-theorem"}里的$\xi$。

**为什么想到这么做**：用线性拆成$\int_{-1}^11\,\dd x$和$\int_{-1}^1x^2\,\dd x$；$x^2$是偶函数，后者是$[0,1]$上的$2$倍，而$\int_0^1x^2\,\dd x=\frac13$已经在[定积分与黎曼和](lesson:math.calculus.definite-integral)里算过。

**推导**：$\int_{-1}^1(1-x^2)\,\dd x=2-2\cdot\frac13=\frac43$，区间长$2$，平均值是$\frac23$。由$1-\xi^2=\frac23$得$\xi=\pm\frac1{\sqrt3}\approx\pm0.577$，两个都在$[-1,1]$里：定理里的$\xi$不一定只有一个。

## 常见误区

- 「$\int_a^bf(x)g(x)\,\dd x=\int_a^bf(x)\,\dd x\cdot\int_a^bg(x)\,\dd x$。」在$[0,2]$上取$f=g=1$：左边是$2$，右边是$4$。
- 「$\int_a^bf(x)\,\dd x\ge0$，所以$f\ge0$。」$\int_{-1}^2x\,\dd x=\frac32>0$，可$x$在$[-1,0)$上是负的；保序性只能从函数推到积分，不能反过来。
- 「:term[平均值]{id="math.calculus.average-value"}就是两端函数值的平均数。」$x^2$在$[0,1]$上的平均值是$\frac13$，不是$\frac{0+1}2$。

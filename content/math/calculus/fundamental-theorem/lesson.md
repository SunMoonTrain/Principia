---
id: math.calculus.fundamental-theorem
title: |
  微积分基本定理
goal: |
  会求变上限积分的导数，并用牛顿-莱布尼茨公式计算定积分。
prerequisites: [math.calculus.integral-properties, math.calculus.antiderivatives, math.calculus.chain-rule]
minutes: 28
summary: |
  $\int_a^xf(t)\,\dd t$的导数是$f(x)$；$F'=f$时$\int_a^bf(x)\,\dd x=F(b)-F(a)$。
status: reviewed
---

## 这一节要回答的问题

用:term[黎曼和]{id="math.calculus.riemann-sum"}（Riemann sum）算$\int_0^1x^2\,\dd x$，要先求出$1^2+2^2+\cdots+n^2$，再让$n\to\infty$；换一个:term[被积函数]{id="math.calculus.integrand"}（integrand），这样的和往往求不出来。另一边，把求导倒过来，已经有了一张基本积分表（见[原函数与不定积分](lesson:math.calculus.antiderivatives)）。:term[定积分]{id="math.calculus.definite-integral"}（definite integral）是一个数，:term[原函数]{id="math.calculus.antiderivative"}（antiderivative）是一族函数，两者有什么关系，能不能用原函数算定积分？

## 讲解

### 变上限积分

一辆车沿直线行驶，速度$v(t)>0$。从时刻$a$到时刻$x$，它走过的路程是$\int_a^xv(t)\,\dd t$；$x$越大，走得越远，路程是$x$的函数。这个函数的变化率，应当就是此刻的速度$v(x)$。

::anchor{id="def-variable-upper-limit-integral"}
设$f$在区间$I$上:term[连续]{id="math.calculus.continuous"}（continuous），$a$是$I$里的一点。对$I$里的每个$x$，$\int_a^xf(t)\,\dd t$都是一个数，记作$\Phi(x)$；这样得到的函数$\Phi$叫作$f$的:term[变上限积分]{id="math.calculus.variable-upper-limit-integral"}（integral with variable upper limit）。

为什么这样定义：让上限动起来，:term[定积分]{id="math.calculus.definite-integral"}就从一个数变成了一个函数，可以问它怎样变化、对它求导。$x<a$时按$\int_a^xf(t)\,\dd t=-\int_x^af(t)\,\dd t$理解（见[定积分的性质](lesson:math.calculus.integral-properties#def-reversed-limits)）。:term[积分变量]{id="math.calculus.integration-variable"}（variable of integration）写成$t$，是为了不和上限$x$混淆，换个字母不改变积分的值。

边界情况：$f$不连续时，只要定积分存在，$\Phi$照样有定义。$x<0$时取$0$、$x\ge0$时取$1$的台阶函数（step function）只有一个跳跃，在每个闭区间上都:term[可积]{id="math.calculus.integrable"}（integrable）；它的$\Phi(x)=\int_0^xf(t)\,\dd t$在$x\ge0$时是$x$，在$x<0$时是$0$，处处连续，在$0$处却有尖角。

### 微积分基本定理

::anchor{id="thm-ftc"}
**定理（:term[微积分基本定理]{id="math.calculus.fundamental-theorem-of-calculus"}，fundamental theorem of calculus）**　设$f$在区间$I$上:term[连续]{id="math.calculus.continuous"}，$a\in I$，则:term[变上限积分]{id="math.calculus.variable-upper-limit-integral"}$\Phi(x)=\int_a^xf(t)\,\dd t$在$I$上:term[可导]{id="math.calculus.differentiable"}（differentiable），并且$\Phi'(x)=f(x)$。

道理：由:term[区间可加性]{id="math.calculus.additivity-over-intervals"}（additivity over intervals，见[定积分的性质](lesson:math.calculus.integral-properties#thm-additivity)），$\Phi(x+h)-\Phi(x)=\int_x^{x+h}f(t)\,\dd t$。由:term[积分中值定理]{id="math.calculus.integral-mean-value-theorem"}（mean value theorem for integrals），右边等于$f(\xi)h$，$\xi$在$x$和$x+h$之间，所以:term[差商]{id="math.calculus.difference-quotient"}（difference quotient）$\frac{\Phi(x+h)-\Phi(x)}h=f(\xi)$。$h\to0$时$\xi\to x$，$f$连续，差商趋于$f(x)$。$x$是$I$的端点时，$h$只从一侧趋于$0$，得到的是单侧导数（one-sided derivative）。

先积分、再求导，回到了原来的函数：对连续函数，变上限积分和求导是互逆的。这也说明区间上的连续函数都有:term[原函数]{id="math.calculus.antiderivative"}，$\Phi$就是一个。[原函数与不定积分](lesson:math.calculus.antiderivatives)第 8 题里的$e^{-x^2}$也有原函数，比如$\int_0^xe^{-t^2}\,\dd t$，只是它写不成:term[初等函数]{id="math.calculus.elementary-function"}（elementary function）。

边界情况：$f$在某点不连续时，$\Phi$在那里可能不可导。上面台阶函数的$\Phi$，在$0$处的左导数（left derivative）是$0$、右导数（right derivative）是$1$，不可导；$\Phi$在别处都可导，:term[导数]{id="math.calculus.derivative"}（derivative）等于$f$。

上限换成可导函数$u(x)$时，$\int_a^{u(x)}f(t)\,\dd t=\Phi\bigl(u(x)\bigr)$是复合函数，由:term[链式法则]{id="math.calculus.chain-rule"}（chain rule），它的导数是$f\bigl(u(x)\bigr)u'(x)$（例 1）。下限是$x$的函数时，先用$\int_{u(x)}^bf(t)\,\dd t=-\int_b^{u(x)}f(t)\,\dd t$换成上限。

### 牛顿-莱布尼茨公式

::anchor{id="thm-newton-leibniz"}
**定理（:term[牛顿-莱布尼茨公式]{id="math.calculus.newton-leibniz-formula"}，Newton-Leibniz formula）**　设$f$在$[a,b]$上:term[连续]{id="math.calculus.continuous"}，$F$是$f$在$[a,b]$上的一个:term[原函数]{id="math.calculus.antiderivative"}，则$\int_a^bf(x)\,\dd x=F(b)-F(a)$。

道理：由:term[微积分基本定理]{id="math.calculus.fundamental-theorem-of-calculus"}，$\Phi(x)=\int_a^xf(t)\,\dd t$也是$f$在$[a,b]$上的原函数。同一个函数在区间上的原函数只差一个常数（见[原函数与不定积分](lesson:math.calculus.antiderivatives#thm-antiderivatives)），所以$\Phi(x)=F(x)+C$。令$x=a$，由$\Phi(a)=0$得$C=-F(a)$；再令$x=b$，就是要证的公式。

$F(b)-F(a)$常记作$F(x)\Big|_a^b$。于是$\int_0^1x^2\,\dd x=\frac{x^3}3\Big|_0^1=\frac13$，和用:term[黎曼和]{id="math.calculus.riemann-sum"}算出的一样；$\int_0^\pi\sin x\,\dd x=-\cos x\Big|_0^\pi=2$，正弦曲线一拱下的面积是$2$。算:term[定积分]{id="math.calculus.definite-integral"}从此不用求和取极限，只要找到一个原函数。

为什么说得通：$F'=f$是$F$的变化率，公式写成$\int_a^bF'(x)\,\dd x=F(b)-F(a)$，说的是把变化率在区间上积起来，得到总的变化。由速度求位移、由加速度求速度的变化，都是这样。

边界情况：公式要求$f$在整个$[a,b]$上连续。$\frac1{x^2}$在$x\ne0$时有原函数$-\frac1x$，照搬公式会得到$\int_{-1}^1\frac{\dd x}{x^2}=-\frac1x\Big|_{-1}^1=-2$，可:term[被积函数]{id="math.calculus.integrand"}处处为正，积分不会是负数。毛病出在$\frac1{x^2}$在$0$附近无界，在$[-1,1]$上不:term[可积]{id="math.calculus.integrable"}。

### 积分与求和

$\int$取自「求和」，现在可以看出原因。用分点$a=x_0<x_1<\cdots<x_n=b$把$[a,b]$分成$n$段，总的变化等于每一段上的变化之和：$F(b)-F(a)=\sum_{i=1}^n\bigl[F(x_i)-F(x_{i-1})\bigr]$。由:term[中值定理]{id="math.calculus.mean-value-theorem"}（mean value theorem），每一段里有$\xi_i$使$F(x_i)-F(x_{i-1})=f(\xi_i)\Delta x_i$，所以$F(b)-F(a)=\sum_{i=1}^nf(\xi_i)\Delta x_i$。

右边正是一个:term[黎曼和]{id="math.calculus.riemann-sum"}：每一段里挑对了点，黎曼和就恰好等于$F(b)-F(a)$，不管分得多粗多细。:term[分割]{id="math.calculus.partition"}（partition）越来越细时黎曼和趋于:term[定积分]{id="math.calculus.definite-integral"}，所以定积分也等于$F(b)-F(a)$，这是:term[牛顿-莱布尼茨公式]{id="math.calculus.newton-leibniz-formula"}的另一个证明。$\int_a^bf(x)\,\dd x$可以读成：把每一小段上的「变化率乘长度」$f(x)\,\dd x$加起来，得到总的变化。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-3, 3], y: [-3.6, 3] }
functions:
  - expr: "1 - x^2/2"
    label: |
      $y=f(x)=1-\frac{x^2}2$
  - expr: "(x - x^3/6) - (a - a^3/6)"
    label: |
      $y=\Phi(x)=\int_a^xf(t)\,\dd t$
  - expr: "(u - u^3/6) - (a - a^3/6) + (1 - u^2/2)*(x - u)"
    label: |
      $\Phi$在$x=u$处的切线
points:
  - { x: "u", y: "1 - u^2/2" }
  - { x: "u", y: "(u - u^3/6) - (a - a^3/6)" }
  - { x: "a", y: "0" }
sliders:
  - name: a
    min: -2.5
    max: 2.5
    step: 0.1
    default: -2
    label: |
      积分下限$a$
  - name: u
    min: -2.5
    max: 2.5
    step: 0.1
    default: 0.5
    label: |
      切点的横坐标$u$
:::

蓝色曲线是$f(x)=1-\frac{x^2}2$，橙色曲线是它的:term[变上限积分]{id="math.calculus.variable-upper-limit-integral"}$\Phi$，在$x=a$处为$0$。拖动$u$，绿色:term[切线]{id="math.calculus.tangent-line"}（tangent line）的斜率始终等于蓝色曲线在$u$处的高度$f(u)$：$f>0$的地方$\Phi$上升，$f<0$的地方$\Phi$下降。拖动$a$，橙色曲线只上下平移：下限不同的变上限积分只差一个常数，都是$f$的:term[原函数]{id="math.calculus.antiderivative"}。

## 例题

### 例 1　上限是函数

设$F(x)=\int_0^{x^2}e^{-t^2}\,\dd t$，求$F'(x)$。

**为什么想到这么做**：$e^{-t^2}$的:term[原函数]{id="math.calculus.antiderivative"}写不成:term[初等函数]{id="math.calculus.elementary-function"}，$F$没有明确的式子。可$F$是:term[变上限积分]{id="math.calculus.variable-upper-limit-integral"}$\Phi(u)=\int_0^ue^{-t^2}\,\dd t$和$u=x^2$的复合，用:term[微积分基本定理]{id="math.calculus.fundamental-theorem-of-calculus"}配上:term[链式法则]{id="math.calculus.chain-rule"}，不必知道$F$长什么样。

**推导**：$\Phi'(u)=e^{-u^2}$，$F(x)=\Phi(x^2)$，所以$F'(x)=\Phi'(x^2)\cdot(x^2)'=2xe^{-x^4}$。

### 例 2　位移和路程

一个质点沿直线运动，$t$时刻的速度是$v(t)=t^2-4t+3$。求$t=0$到$t=3$这段时间里，它的位移和走过的路程。

**为什么想到这么做**：位置是速度的:term[原函数]{id="math.calculus.antiderivative"}，位移是位置的变化，用:term[牛顿-莱布尼茨公式]{id="math.calculus.newton-leibniz-formula"}。路程要把往回走的部分也算成正的，是$|v|$的积分，按$v$的正负把区间分开。

**推导**：$s(t)=\frac{t^3}3-2t^2+3t$是$v$的一个原函数。位移是$\int_0^3v(t)\,\dd t=s(3)-s(0)=0$，质点回到了出发点。$v=(t-1)(t-3)$在$(0,1)$上为正、在$(1,3)$上为负，所以路程是

$$
\int_0^1v(t)\,\dd t-\int_1^3v(t)\,\dd t=\bigl[s(1)-s(0)\bigr]-\bigl[s(3)-s(1)\bigr]=\frac43+\frac43=\frac83.
$$

## 常见误区

- 「$\dv{}{x}\int_0^{x^2}f(t)\,\dd t=f(x^2)$。」漏了:term[链式法则]{id="math.calculus.chain-rule"}的因子：上限是$x^2$，:term[导数]{id="math.calculus.derivative"}是$2xf(x^2)$。
- 「用不同的:term[原函数]{id="math.calculus.antiderivative"}，会算出不同的:term[定积分]{id="math.calculus.definite-integral"}。」原函数之间只差常数$C$，$\bigl[F(b)+C\bigr]-\bigl[F(a)+C\bigr]=F(b)-F(a)$，常数抵消了，所以算定积分时不用写$C$。
- 「$\int_a^bf(x)\,\dd x$是$x$的函数。」它是一个数，$x$只是:term[积分变量]{id="math.calculus.integration-variable"}，换成$t$也一样；随上限变化的是$\int_a^xf(t)\,\dd t$。

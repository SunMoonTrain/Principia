---
id: math.calculus.definite-integral
title: |
  定积分与黎曼和
goal: |
  会把曲边梯形的面积写成黎曼和的极限，并用几何意义求简单的定积分。
prerequisites: [math.calculus.continuity, math.calculus.limits-at-infinity]
minutes: 27
summary: |
  取点求和得黎曼和，分割越来越细时，黎曼和的极限就是定积分。
status: reviewed
---

## 这一节要回答的问题

抛物线$y=x^2$、$x$轴和直线$x=1$围成的图形，面积是多少？中学只会算由线段围成的图形的面积，这块图形有一条边是弯的。一辆车的速度时时在变，它一小时走了多远？这两个问题看上去不相干，能不能用同一个办法解决？

## 讲解

### 曲边梯形的面积

::anchor{id="def-curvilinear-trapezoid"}
设$f$在$[a,b]$上:term[连续]{id="math.calculus.continuous"}（continuous）并且$f\ge0$。由直线$x=a$、$x=b$、$x$轴和曲线$y=f(x)$围成的图形，叫作:term[曲边梯形]{id="math.calculus.curvilinear-trapezoid"}（curvilinear trapezoid）。

为什么起这个名字：它像一个梯形，只是顶上那条边换成了曲线；$f$是常数时它就是长方形。边界情况：$f$在某处为$0$时，图形在那里收成一点，开头那块图形在$x=0$处就是这样。

求开头那块图形的面积：把$[0,1]$等分成$n$段，第$k$段$\bigl[\frac{k-1}n,\frac kn\bigr]$上，用以右端点的函数值$\bigl(\frac kn\bigr)^2$为高的长方形代替那一条曲边梯形。这些长方形的面积之和是

$$
S_n=\sum_{k=1}^n\Bigl(\frac kn\Bigr)^2\cdot\frac1n=\frac{1^2+2^2+\cdots+n^2}{n^3}=\frac{(n+1)(2n+1)}{6n^2}.
$$

$n\to\infty$时$S_n\to\frac13$。改用左端点的函数值作高，和是$\frac{(n-1)(2n-1)}{6n^2}$，也趋于$\frac13$；$x^2$在$[0,1]$上递增，真正的面积夹在这两个和之间，所以就是$\frac13$。由速度求路程也是这样：把时间分成小段，每一小段上速度几乎不变，路程近似是「速度乘时间」的和，分得越细越准。

### 黎曼和

::anchor{id="def-riemann-sum"}
设$f$在$[a,b]$上有定义。在$[a,b]$里取分点$a=x_0<x_1<\cdots<x_n=b$，把它分成$n$个小区间$[x_{i-1},x_i]$，这叫作$[a,b]$的一个:term[分割]{id="math.calculus.partition"}（partition），记$\Delta x_i=x_i-x_{i-1}$。在每个小区间里任取一点$\xi_i$，和$\sum_{i=1}^nf(\xi_i)\Delta x_i$叫作$f$的一个:term[黎曼和]{id="math.calculus.riemann-sum"}（Riemann sum）。

为什么这样定义：每一项$f(\xi_i)\Delta x_i$是一个细长方形的面积，或者一小段时间里的路程。分点不必等距，$\xi_i$也不必是端点，这样定义的积分才不依赖某一种特殊的取法。边界情况：黎曼和既随分割变，也随取的点变；$x^2$在$[0,1]$上只分一段时，取$\xi_1=0$得$0$，取$\xi_1=1$得$1$。

### 定积分

::anchor{id="def-definite-integral"}
记$\lambda$为最长的小区间的长度。如果不管:term[分割]{id="math.calculus.partition"}和$\xi_i$怎样取，只要$\lambda\to0$，:term[黎曼和]{id="math.calculus.riemann-sum"}都无限接近同一个数$I$，就说$f$在$[a,b]$上:term[可积]{id="math.calculus.integrable"}（integrable），$I$叫作$f$在$[a,b]$上的:term[定积分]{id="math.calculus.definite-integral"}（definite integral），记作$\int_a^bf(x)\,\dd x$。$a$、$b$分别叫作:term[积分下限]{id="math.calculus.lower-limit-of-integration"}（lower limit of integration）、:term[积分上限]{id="math.calculus.upper-limit-of-integration"}（upper limit of integration），$[a,b]$叫作:term[积分区间]{id="math.calculus.interval-of-integration"}（interval of integration），$f(x)$是:term[被积函数]{id="math.calculus.integrand"}（integrand），$x$叫作:term[积分变量]{id="math.calculus.integration-variable"}（variable of integration）。

为什么这样定义：分割越来越细，长方形拼成的台阶就越来越贴近曲线；要求所有的分割和取点都趋于同一个数，面积才确定。这个极限和:term[数列的极限]{id="math.calculus.sequence-limit"}（limit of a sequence）不一样，黎曼和不只随段数变，严格的说法见数学分析的[黎曼积分与达布和](lesson:math.analysis.riemann-integral)。记号里，$\int$是拉长的 S，取自「求和」，$f(x)\,\dd x$对应$f(\xi_i)\Delta x_i$；积分变量只是一个记号，$\int_a^bf(x)\,\dd x=\int_a^bf(t)\,\dd t$。

边界情况：不是每个函数都可积。$0<x\le1$时取$\frac1x$、$f(0)=0$的函数，第一个小区间里的$\xi_1$取得离$0$越近，$f(\xi_1)\Delta x_1$就越大，黎曼和可以任意大，没有极限。

::anchor{id="thm-integrable"}
**定理**　闭区间$[a,b]$上的:term[连续函数]{id="math.calculus.continuous"}在$[a,b]$上:term[可积]{id="math.calculus.integrable"}；在$[a,b]$上只有有限个:term[跳跃间断点]{id="math.calculus.jump-discontinuity"}（jump discontinuity）、其余处处连续的函数也可积。

这里不证，证明见数学分析的[哪些函数可积](lesson:math.analysis.integrable-functions)。可积时，任取一种分割方式算极限都行，开头的等分加右端点就是最方便的一种。

### 几何意义

$f\ge0$时，$\int_a^bf(x)\,\dd x$就是:term[曲边梯形]{id="math.calculus.curvilinear-trapezoid"}的面积。$f$有正有负时，$f(\xi_i)<0$的那些项是负的，曲线在$x$轴下方的部分算负面积：:term[定积分]{id="math.calculus.definite-integral"}等于$x$轴上方的面积减去下方的面积，是带符号的面积。比如$\int_0^{2\pi}\sin x\,\dd x=0$，正弦曲线在$[0,\pi]$上方和$[\pi,2\pi]$下方的两块一样大，正好抵消。

能看出面积的，就能直接写出定积分（例 2）。$y=\sqrt{1-x^2}$是上半个单位圆，所以$\int_{-1}^1\sqrt{1-x^2}\,\dd x=\frac\pi2$。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-0.3, 6.3], y: [-0.7, 1.7] }
functions:
  - expr: "0.5 + sin(x)"
    label: |
      $y=0.5+\sin x$
  - expr: "0.5 + sin((min(floor(x*N/6), N - 1) + c)*6/N) + 0*sqrt(x*(6 - x))"
    label: |
      黎曼和里长方形的顶边
sliders:
  - name: N
    min: 1
    max: 40
    step: 1
    default: 6
    label: |
      等分的段数$N$
  - name: c
    min: 0
    max: 1
    step: 0.05
    default: 0.5
    label: |
      $\xi_i$在每一段里的位置$c$
:::

把$[0,6]$等分成$N$段，每一段里取离左端点$c$倍段长的点作$\xi_i$：$c=0$取左端点，$c=1$取右端点。橙色台阶是这些长方形的顶边，曲线在$x$轴下方的那几段，长方形也在下方，算负的。拖动$N$变大，台阶贴近蓝色曲线，长方形的面积之和趋于:term[定积分]{id="math.calculus.definite-integral"}；$N$大时再拖动$c$，台阶几乎不动，取哪一组点都一样。

## 例题

### 例 1　用黎曼和算积分

求$\int_1^2x^2\,\dd x$。

**为什么想到这么做**：$x^2$在$[1,2]$上:term[连续]{id="math.calculus.continuous"}，:term[可积]{id="math.calculus.integrable"}，任取一种方便的:term[分割]{id="math.calculus.partition"}方式算极限都行。等分加右端点，和式能用$1+2+\cdots+n$、$1^2+2^2+\cdots+n^2$的公式求出来。

**推导**：把$[1,2]$等分成$n$段，取$\xi_k=1+\frac kn$，:term[黎曼和]{id="math.calculus.riemann-sum"}是

$$
\sum_{k=1}^n\Bigl(1+\frac kn\Bigr)^2\frac1n=\frac1n\sum_{k=1}^n\Bigl(1+\frac{2k}n+\frac{k^2}{n^2}\Bigr)=1+\frac{n+1}{n}+\frac{(n+1)(2n+1)}{6n^2}.
$$

$n\to\infty$时它趋于$1+1+\frac13=\frac73$，所以$\int_1^2x^2\,\dd x=\frac73$。

### 例 2　看出面积

求$\int_{-2}^2\sqrt{4-x^2}\,\dd x$和$\int_{-1}^2x\,\dd x$。

**为什么想到这么做**：两个:term[被积函数]{id="math.calculus.integrand"}的图像分别是半圆和直线，围成的图形面积用几何公式就能算，按带符号的面积写出:term[定积分]{id="math.calculus.definite-integral"}。

**推导**：$y=\sqrt{4-x^2}$是半径为$2$的上半圆，$\int_{-2}^2\sqrt{4-x^2}\,\dd x=\frac12\pi\cdot2^2=2\pi$。$y=x$在$[0,2]$上和$x$轴围成面积为$2$的三角形，在$[-1,0]$上围成的三角形在$x$轴下方，面积为$\frac12$，所以$\int_{-1}^2x\,\dd x=2-\frac12=\frac32$。

## 常见误区

- 「:term[定积分]{id="math.calculus.definite-integral"}就是面积。」它是带符号的面积：$\int_{-1}^1x\,\dd x=0$，可直线和$x$轴围成的两块三角形面积加起来是$1$。
- 「:term[黎曼和]{id="math.calculus.riemann-sum"}只能等分、取右端点。」定义要求任何:term[分割]{id="math.calculus.partition"}、任何取点都趋于同一个数；等分、取右端点只是:term[可积]{id="math.calculus.integrable"}以后算起来方便的一种。
- 「:term[积分变量]{id="math.calculus.integration-variable"}换个字母，积分就变了。」$\int_0^1x^2\,\dd x$和$\int_0^1t^2\,\dd t$都是$\frac13$，积分变量只说明对谁求和。

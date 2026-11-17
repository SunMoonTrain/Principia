---
id: math.calculus.optimization
title: |
  最值问题
goal: |
  会求闭区间上连续函数的最大值和最小值，并把实际问题化成求最值。
prerequisites: [math.calculus.monotonicity, math.calculus.chain-rule]
minutes: 26
summary: |
  最值在端点、驻点或不可导点取到；区间上唯一的极值点是最值点。
status: reviewed
---

## 这一节要回答的问题

一张边长$30\,\mathrm{cm}$的正方形纸板，四个角各剪去一个同样大小的小正方形，折成无盖的盒子。剪去的小正方形边长取多少，盒子的容积最大？这里的「最大」是和所有可能的取法比，不是只和附近比的:term[极大值]{id="math.calculus.local-maximum"}（local maximum），怎样确定找到的就是最大的？

## 讲解

### 闭区间上的最值

[闭区间上连续函数的性质](lesson:math.calculus.closed-interval-properties#thm-extreme-value)说，闭区间上的:term[连续函数]{id="math.calculus.continuous"}（continuous function）一定取得到最大值和最小值，可没说在哪里取到。[极值与费马定理](lesson:math.calculus.local-extrema)第 7 题说，最大值点在区间内部时是极大值点，不然就在端点。

::anchor{id="thm-closed-interval-extrema"}
**定理**　设$f$在$[a,b]$上连续，在$(a,b)$内除有限个点外都:term[可导]{id="math.calculus.differentiable"}（differentiable）。那么$f$在$[a,b]$上的最大值和最小值，就是它在三类点处的值里最大的和最小的：端点$a$、$b$，$(a,b)$内的:term[驻点]{id="math.calculus.stationary-point"}（stationary point），$(a,b)$内不可导的点。

道理：由:term[最值定理]{id="math.calculus.extreme-value-theorem"}（extreme value theorem），最大值、最小值都取得到。最大值点如果在$(a,b)$内，附近的函数值都不比它大，它是:term[极值点]{id="math.calculus.extremum-point"}（extremum point）；由:term[费马定理]{id="math.calculus.fermat-theorem"}（Fermat's theorem），它是驻点或不可导的点。最小值点同理，所以只要在这三类点里比较。

为什么这样做：候选点通常只有有限几个，算出函数值比一比就行，不用逐个判断驻点是极大还是极小（例 1）。边界情况：闭区间和连续缺一不可。$f(x)=x$在$(0,1)$上既没有最大值，也没有最小值；$[0,1]$上$x<1$时取$x$、$x=1$时取$0$的函数，在$1$处不连续，函数值能任意接近$1$，却取不到最大值。

### 区间上唯一的极值点

实际问题的定义域常常是开区间：开头的盒子，剪去的边长$x$只能在$(0,15)$里取，取$0$或$15$就折不成盒子。这时:term[最值定理]{id="math.calculus.extreme-value-theorem"}用不上，可以用下面的定理。

::anchor{id="thm-single-extremum"}
**定理**　设$f$在区间$I$上:term[可导]{id="math.calculus.differentiable"}，并且在$I$内只有一个:term[驻点]{id="math.calculus.stationary-point"}$x_0$。如果$x_0$是极大值点，那么$f(x_0)$是$f$在$I$上的最大值；如果$x_0$是极小值点，那么$f(x_0)$是最小值。

道理：$f'$在$x_0$两侧都不为$0$，由:term[导函数]{id="math.calculus.derivative-function"}（derivative function）的介值性（intermediate value property，见[极值与费马定理](lesson:math.calculus.local-extrema)第 5 题），它在$x_0$左边不变号，在右边也不变号。$x_0$是极大值点时，左边只能是$f'>0$：否则$f$在$x_0$左边严格递减，左边附近的值都比$f(x_0)$大。同理右边$f'<0$，所以$f$在$x_0$左边严格递增、右边严格递减，$f(x_0)$比$I$上别的值都大。

边界情况：「只有一个」不能少。$2x^3-3x^2$在$\R$上有两个驻点，$0$是极大值点，$f(0)=0$，可$f(2)=4$更大，它在$\R$上没有最大值。

所以解实际问题分几步：选一个量作自变量，把要求最值的量写成它的函数，写出定义域；求驻点；再说明找到的确实是最值，或者比较闭区间上候选点的值，或者用上面的定理（例 2）。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-0.3, 4.8], y: [-1, 11] }
functions:
  - expr: "x^3 - 6x^2 + 9x + 0*sqrt(x*(b - x))"
    label: |
      $y=x^3-6x^2+9x$，$0\le x\le b$
  - expr: "max(min(b, 1)^3 - 6*min(b, 1)^2 + 9*min(b, 1), b^3 - 6b^2 + 9b)"
    label: |
      这一段上的最大值
points:
  - { x: "b", y: "b^3 - 6b^2 + 9b" }
sliders:
  - name: b
    min: 0.5
    max: 4.5
    step: 0.05
    default: 2
    label: |
      右端点$b$
:::

蓝色是$f(x)=x^3-6x^2+9x$在$[0,b]$上的一段，橙色水平线是它在这一段上的最大值。拖动$b$：$b\le1$时最大值在右端点；$1<b<4$时最大值是:term[极大值]{id="math.calculus.local-maximum"}$f(1)=4$；$b>4$时右端点的值超过$4$，最大值又回到右端点。最小值一直是端点处的$f(0)=0$，$b\ge3$时:term[驻点]{id="math.calculus.stationary-point"}$3$处也取到。

## 例题

### 例 1　端点、驻点和不可导点

求$f(x)=x|x-3|$在$[0,4]$上的最大值和最小值。

**为什么想到这么做**：$f$在闭区间上:term[连续]{id="math.calculus.continuous"}，用第一个定理：找出$(0,4)$内的:term[驻点]{id="math.calculus.stationary-point"}和不可导的点，和两个端点放在一起比较。$|x-3|$在$x=3$处有尖角，那里要单独看。

**推导**：$0\le x<3$时$f(x)=3x-x^2$，$f'(x)=3-2x$，驻点是$\frac32$；$3<x\le4$时$f(x)=x^2-3x$，$f'(x)=2x-3>0$，没有驻点。在$3$处，左边的斜率趋于$-3$、右边的趋于$3$，不可导。比较$f(0)=0$、$f\bigl(\frac32\bigr)=\frac94$、$f(3)=0$、$f(4)=4$：最大值是$4$，在端点$4$处取到；最小值是$0$，在端点$0$和不可导点$3$处取到。$\frac94$只是:term[极大值]{id="math.calculus.local-maximum"}。

### 例 2　盒子的最大容积

解开头的问题。

**为什么想到这么做**：设剪去的边长是$x\,\mathrm{cm}$，容积是$x$的函数，定义域是开区间$(0,15)$；:term[驻点]{id="math.calculus.stationary-point"}只有一个，用第二个定理。

**推导**：盒底的边长是$30-2x$，容积$V(x)=x(30-2x)^2$，$0<x<15$。由:term[乘积法则]{id="math.calculus.product-rule"}（product rule）和:term[链式法则]{id="math.calculus.chain-rule"}（chain rule），$V'(x)=(30-2x)^2-4x(30-2x)=(30-2x)(30-6x)$，在$(0,15)$内只有驻点$x=5$。$0<x<5$时$V'>0$，$5<x<15$时$V'<0$，$5$是极大值点，所以$V(5)=5\times20^2=2000$是最大值：剪去边长$5\,\mathrm{cm}$的正方形，容积最大，是$2000\,\mathrm{cm^3}$。

## 常见误区

- 「:term[极大值]{id="math.calculus.local-maximum"}就是最大值。」极大值只和附近比：例 1 的$\frac94$是极大值，最大值却是端点处的$4$。
- 「最值只能在:term[驻点]{id="math.calculus.stationary-point"}取到。」$|x|$在$[-1,2]$上没有驻点，最小值$0$在不可导的点$0$处取到，最大值$2$在端点处取到。
- 「实际问题里，求出驻点就是答案。」还要说明它确实是最值：可能有几个驻点，最值也可能在端点。

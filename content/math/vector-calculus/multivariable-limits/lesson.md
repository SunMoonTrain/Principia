---
id: math.vector-calculus.multivariable-limits
title: |
  多元函数的极限与连续
goal: |
  会判断二元函数的极限是否存在（包括沿不同路径趋近得到不同结果的情形），并判断函数是否连续。
prerequisites: [math.vector-calculus.functions-of-several-variables, math.calculus.continuity]
minutes: 35
summary: |
  二重极限要求沿任何路径趋近都得同一个值。
status: reviewed
---

## 这一节要回答的问题

一元函数里，$x\to a$只能从左右两边趋近；平面上，点$(x,y)$可以从四面八方、沿直线或曲线趋近$(a,b)$。$f(x,y)=\frac{xy}{x^2+y^2}$沿两条坐标轴趋近原点时一直是$0$，沿直线$y=x$趋近时却一直是$\frac12$。:term[二元函数]{id="math.vector-calculus.multivariable-function"}（function of two variables）的极限该怎样定义？怎样判断它存在或不存在，函数在一点:term[连续]{id="math.vector-calculus.continuous"}（continuous）又是什么意思？

## 讲解

### 二重极限

::anchor{id="def-double-limit"}
设:term[二元函数]{id="math.vector-calculus.multivariable-function"}$f$在以$(a,b)$为圆心的某个圆盘里有定义（圆心处可以没有定义），$L$是一个数。如果只要点$(x,y)$到$(a,b)$的距离$\sqrt{(x-a)^2+(y-b)^2}$足够小、但不为$0$，$|f(x,y)-L|$就能小于任意给定的正数，就说$(x,y)\to(a,b)$时$f$的极限是$L$，记作$\lim_{(x,y)\to(a,b)}f(x,y)=L$。这样的极限叫作:term[二重极限]{id="math.vector-calculus.double-limit"}（double limit）。

为什么这样定义：意思和一元函数的极限一样，只是「靠近」用平面上的距离来量，不管$(x,y)$从哪个方向、沿什么路径靠近。一元函数极限的四则运算法则和夹逼定理（squeeze theorem）照样成立，例如$\lim_{(x,y)\to(1,2)}(x^2y+3y)=8$。边界情况：$f$在$(a,b)$处有没有定义、定义成多少，都不影响二重极限。

::anchor{id="def-iterated-limit"}
先固定$y$让$x\to a$，再让$y\to b$，得到的$\lim_{y\to b}\bigl(\lim_{x\to a}f(x,y)\bigr)$叫作累次极限（iterated limit）；换一个次序，是另一个累次极限。它只沿一种特殊的方式趋近，和二重极限是两回事（见常见误区和第 5 题）。

### 判断极限不存在

::anchor{id="thm-path-test"}
**沿不同路径的极限**　如果$(x,y)$沿两条趋向$(a,b)$的曲线趋近时，$f$的极限不相等，或者沿某一条曲线的极限不存在，那么:term[二重极限]{id="math.vector-calculus.double-limit"}$\lim_{(x,y)\to(a,b)}f(x,y)$不存在。

**证明思路**：如果二重极限是$L$，那么点离$(a,b)$足够近时$f$就离$L$任意近；沿任何一条曲线走到离$(a,b)$足够近的地方都是这样，所以沿每条曲线的极限都是$L$。

例如$f(x,y)=\frac{xy}{x^2+y^2}$沿直线$y=kx$（$x\ne0$）趋近原点时，$f=\frac{k}{1+k^2}$是常数，$k=0$时为$0$，$k=1$时为$\frac12$，所以原点处的二重极限不存在。这个定理只能用来证明极限不存在：沿再多条路径算出同一个值，也不能断定二重极限存在（例 2）。

### 连续

::anchor{id="def-continuous"}
设$f$在$(a,b)$处和它附近有定义。如果$\lim_{(x,y)\to(a,b)}f(x,y)=f(a,b)$，就说$f$在$(a,b)$处:term[连续]{id="math.vector-calculus.continuous"}。如果$f$在集合$D$的每一点都连续，就说$f$在$D$上连续；在$D$的边界点上，只让$D$里的点去趋近，例如说$f$在闭矩形（closed rectangle）$[a,b]\times[c,d]$上连续，四条边上的点也算在内。

为什么这样定义：和一元函数一样，连续就是「求极限可以直接代入」。由极限的运算法则，多项式、分母不为零处的有理分式都连续；连续的一元函数和连续的:term[二元函数]{id="math.vector-calculus.multivariable-function"}复合起来仍然连续，例如$e^{x^2+y^2}$、$\sin(xy)$处处连续，$\sqrt{1-x^2-y^2}$在闭圆盘（closed disk）$x^2+y^2\le1$上连续。边界情况：$f(x,y)=\frac{xy}{x^2+y^2}$、$f(0,0)=0$，固定$y=0$看是$x$的连续函数，固定$x=0$看也是，可它在原点处的:term[二重极限]{id="math.vector-calculus.double-limit"}不存在，所以在原点不连续。

::anchor{id="thm-extreme-value"}
**:term[最值定理]{id="math.vector-calculus.extreme-value-theorem"}（extreme value theorem）**　设$D$是有界闭区域（bounded closed region），即包括边界在内、又能放进某个圆盘里的区域，例如闭矩形、闭圆盘。$D$上的连续函数在$D$上有界，并且能取到最大值和最小值。

这里不证，道理和闭区间上的连续函数一样（见[闭区间上连续函数的性质](lesson:math.calculus.closed-interval-properties)）。两个条件缺一不可：$\frac{1}{1+x^2+y^2}$在整个平面上连续，却取不到最小值；$\frac{1}{x^2+y^2}$在挖掉原点的圆盘$0<x^2+y^2\le1$上连续，却无界。

## 几何图像

![两幅等值线图。左图是 xy/(x² + y²) 的等值线，都是过原点的直线：y = 2x 和 y = x/2 上的值是 2/5，y = x 上是 1/2，y = −2x 和 y = −x/2 上是 −2/5，y = −x 上是 −1/2，坐标轴上是 0。右图是 x²y/(x⁴ + y²) 的等值线，都是过原点的抛物线：y = 2x² 和 y = x²/2 上的值是 2/5，y = x² 上是 1/2，开口向下的三条对应 −2/5、−1/2、−2/5，坐标轴上是 0。原点画成空心圆。下方两行字：左边的等值线是过原点的直线，右边的是过原点的抛物线（坐标轴上的值都是 0）；原点附近两个函数都取遍 −1/2 到 1/2 之间的值，原点处的二重极限都不存在。](level-curves.svg)

图里画了两个函数在原点附近的:term[等值线]{id="math.vector-calculus.level-curve"}（level curve）。左边$\frac{xy}{x^2+y^2}$的等值线是过原点的直线，$y=kx$上的值是$\frac{k}{1+k^2}$；右边$\frac{x^2y}{x^4+y^2}$的等值线是过原点的抛物线，$y=mx^2$上的值是$\frac{m}{1+m^2}$。不管离原点多近，两个函数都取遍$-\frac12$到$\frac12$之间的每个值，所以原点处的:term[二重极限]{id="math.vector-calculus.double-limit"}都不存在。右边的函数沿任何一条过原点的直线趋近原点时极限都是$0$，可沿抛物线$y=x^2$趋近时一直是$\frac12$（例 2）。

## 例题

### 例 1　用夹逼证明极限存在

求$\lim_{(x,y)\to(0,0)}\frac{x^2y}{x^2+y^2}$。

**为什么想到这么做**：分子是三次式、分母是二次式，猜极限是$0$；要证明它，就把$|f(x,y)-0|$用一个只依赖于到原点的距离、并且趋于$0$的量夹住。

**推导**：$(x,y)\ne(0,0)$时$x^2\le x^2+y^2$，所以$\left|\frac{x^2y}{x^2+y^2}\right|\le|y|\le\sqrt{x^2+y^2}$。点到原点的距离趋于$0$时右边趋于$0$，由夹逼定理，所求的:term[二重极限]{id="math.vector-calculus.double-limit"}是$0$。用极坐标$x=r\cos\theta$、$y=r\sin\theta$看也一样：$f=r\cos^2\theta\sin\theta$，$|f|\le r$，这个上界和$\theta$无关。

### 例 2　沿所有直线的极限都是 0

$f(x,y)=\frac{x^2y}{x^4+y^2}$（$(x,y)\ne(0,0)$）。证明$(x,y)$沿每条过原点的直线趋近原点时，$f$的极限都是$0$，但$\lim_{(x,y)\to(0,0)}f(x,y)$不存在。

**为什么想到这么做**：沿直线$y=kx$代进去，就成了一元函数的极限；分母里$x^4$和$y^2$的次数不同，沿直线时$y^2$占上风，沿抛物线$y=mx^2$时两项一样大，可能得到不为零的值。

**推导**：沿$y=kx$（$k\ne0$），$f=\frac{kx^3}{x^4+k^2x^2}=\frac{kx}{x^2+k^2}\to0$；沿两条坐标轴，$f$恒为$0$。沿抛物线$y=x^2$，$f=\frac{x^4}{2x^4}=\frac12$，极限是$\frac12\ne0$。由[沿不同路径的极限](lesson:math.vector-calculus.multivariable-limits#thm-path-test)，:term[二重极限]{id="math.vector-calculus.double-limit"}不存在。

## 常见误区

- 「沿所有直线趋近时极限都是$L$，:term[二重极限]{id="math.vector-calculus.double-limit"}就是$L$。」例 2 沿每条直线都是$0$，沿抛物线$y=x^2$却是$\frac12$。
- 「两个累次极限相等，二重极限就存在。」$\frac{xy}{x^2+y^2}$的两个累次极限都是$0$，原点处的二重极限却不存在；反过来，二重极限存在时，累次极限也可能不存在（第 5 题）。
- 「对$x$、对$y$分别:term[连续]{id="math.vector-calculus.continuous"}，就是二元连续。」讲解里的$\frac{xy}{x^2+y^2}$（$f(0,0)=0$）就是反例。
- 「用极坐标算出：对每个固定的$\theta$，$r\to0$时$f\to L$，所以二重极限是$L$。」例 2 里固定$\theta$时$f\to0$，可$\theta$越接近$0$，$f$趋于$0$得越慢；要像例 1 那样找一个和$\theta$无关的上界（第 7 题）。

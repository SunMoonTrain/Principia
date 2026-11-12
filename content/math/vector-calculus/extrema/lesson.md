---
id: math.vector-calculus.extrema
title: |
  多元函数的极值
goal: |
  会求二元函数的驻点，并用二阶导数判别法判断极大值、极小值和鞍点。
prerequisites: [math.vector-calculus.taylor-multivariable]
minutes: 35
summary: |
  驻点处看判别式定极大、极小、鞍点；最值还要比较边界上的值。
status: reviewed
---

## 这一节要回答的问题

一片地形的海拔是$f(x,y)$，最低的洼地、最高的山顶在哪里？:term[多元泰勒公式]{id="math.vector-calculus.taylor-formula"}（Taylor's formula）说，:term[驻点]{id="math.vector-calculus.stationary-point"}（stationary point）附近的形状由:term[黑塞矩阵]{id="math.vector-calculus.hessian-matrix"}（Hessian matrix）决定；二元时，能不能把它变成只看几个数的判别法？在一块有边界的区域上找最高点，只看驻点够不够，区域又为什么必须有界、闭？

## 讲解

### 极值

::anchor{id="def-local-extremum"}
设$f$在点$\vb a$附近有定义。如果$\vb a$附近的点都满足$f(\vb x)\le f(\vb a)$，就说$f$在$\vb a$取局部极大值（local maximum），$\vb a$叫作局部极大点；都满足$f(\vb x)\ge f(\vb a)$时，叫作局部极小值（local minimum）、局部极小点。两者统称局部极值（local extremum），简称极值；$f$在整个区域上的最大值、最小值统称最值（global extremum），和极值不同。

为什么这样定义：和一元时一样（见[极值与费马定理](lesson:math.calculus.local-extrema)），极值只和附近的点比，最值要和整个区域比。:term[可微]{id="math.vector-calculus.differentiable"}（differentiable）的函数在定义域内部的极值点一定是:term[驻点]{id="math.vector-calculus.stationary-point"}；反过来不对，驻点还可能是:term[鞍点]{id="math.vector-calculus.saddle-point"}（saddle point）。边界情况：常数函数在每一点既取极大值、也取极小值。

### 二阶导数判别法

::anchor{id="thm-second-derivative-test"}
**二阶导数判别法（second derivative test）**　设$f$在:term[驻点]{id="math.vector-calculus.stationary-point"}$\vb a$附近有:term[连续]{id="math.vector-calculus.continuous"}（continuous）的:term[二阶偏导数]{id="math.vector-calculus.second-partial-derivative"}（second-order partial derivative），记$D=f_{xx}f_{yy}-f_{xy}^2$，各:term[偏导数]{id="math.vector-calculus.partial-derivative"}（partial derivative）在$\vb a$处取值。(1) $D>0$且$f_{xx}>0$时，$\vb a$是严格局部极小点（strict local minimum）；(2) $D>0$且$f_{xx}<0$时，$\vb a$是严格局部极大点；(3) $D<0$时，$\vb a$是:term[鞍点]{id="math.vector-calculus.saddle-point"}；(4) $D=0$时判断不了。

**证明思路**：(1) 就是[多元泰勒公式与黑塞矩阵](lesson:math.vector-calculus.taylor-multivariable)里「:term[黑塞矩阵]{id="math.vector-calculus.hessian-matrix"}与极小」的定理，加上那一节第 5 题；把$f$换成$-f$得到 (2)。(3) 记$Q(h,k)=f_{xx}h^2+2f_{xy}hk+f_{yy}k^2$：$f_{xx}\ne0$时$Q(1,0)=f_{xx}$，$Q(-f_{xy},f_{xx})=f_{xx}D$，两者异号；$f_{xx}=0$时$f_{xy}\ne0$，$Q(1,t)=2f_{xy}t+f_{yy}t^2$在$t$很小时随$t$的正负变号。沿$Q>0$的方向$\vb h$，一元函数$g(t)=f(\vb a+t\vb h)$满足$g'(0)=0$、$g''(0)=Q(\vb h)>0$，由一元的泰勒公式（见[泰勒公式](lesson:math.calculus.taylor-polynomial)），$t\ne0$很小时$g(t)>g(0)$；沿$Q<0$的方向$g(t)<g(0)$，所以$\vb a$不是极值点，是鞍点。

为什么只看$f_{xx}$：$D>0$时$f_{xx}f_{yy}>f_{xy}^2\ge0$，$f_{xx}$和$f_{yy}$同号，看哪一个都行。$D$正是黑塞矩阵的行列式，二元时它的符号加上$f_{xx}$的符号，就决定了二次项$Q$是恒正、恒负还是有正有负。边界情况：$D=0$时二次项退化，要看更高阶的项。

### 有界闭区域上的最值

::anchor{id="thm-global-extremum"}
**求最值的办法**　设$D$是有界闭区域（bounded closed region），$f$在$D$上:term[连续]{id="math.vector-calculus.continuous"}、在$D$的内部:term[可微]{id="math.vector-calculus.differentiable"}。由:term[最值定理]{id="math.vector-calculus.extreme-value-theorem"}（extreme value theorem），$f$在$D$上取到最大值和最小值，而它们只可能在两类点取到：$D$内部的:term[驻点]{id="math.vector-calculus.stationary-point"}，或$D$的边界。所以分别求出内部的驻点处的值和边界上的最大值、最小值，放在一起比较，最大的就是最大值，最小的就是最小值。

为什么要有界、闭：少了哪一个，最值都可能不存在。开圆盘（open disk）$x^2+y^2<1$上，$x^2+y^2$越靠近边界越大，却取不到$1$，没有最大值；整个平面上，$\frac1{1+x^2+y^2}$越往远处越小，却取不到$0$，没有最小值。边界上的最值，通常把边界写成参数方程（parametric equation），变成一元函数的最值（例 2）。

## 几何图像

![方框里是 −1.8 ≤ x, y ≤ 1.8 的范围，坐标轴画成方框的边和刻度。函数 f(x, y) = x⁴ + y⁴ − 4xy 的等值线，取值 −1.8、−1.2、−0.4（绿色）、0（棕色）、1、3、6（蓝色）。(1, 1) 和 (−1, −1) 两点附近各有一组一圈套一圈的绿色闭曲线，中心各画一个绿点，用虚线引到框外，标着「极小 f = −2」。原点画一个棕色的点，标着「鞍点」，f = 0 的等值线在原点交叉成十字形。下方两行字：绿色闭曲线围着两个极小点；棕色是 f = 0 的等值线，在原点交叉成十字形；蓝色等值线 f = 1、3、6 把两组闭曲线一起包在里面。](critical.svg)

图里是例 1 的函数。极小点周围的:term[等值线]{id="math.vector-calculus.level-curve"}（level curve）是一圈套一圈的:term[闭曲线]{id="math.vector-calculus.closed-curve"}（closed curve），越往里值越小；:term[鞍点]{id="math.vector-calculus.saddle-point"}处，经过它的那条等值线交叉成十字形，把附近分成四块，两块比$f(0,0)$大、两块比它小。:term[驻点]{id="math.vector-calculus.stationary-point"}处两个:term[一阶偏导数]{id="math.vector-calculus.partial-derivative"}都是$0$，等值线才可能在那里交叉。

## 例题

### 例 1　找出驻点并分类

$f(x,y)=x^4+y^4-4xy$。求它的:term[驻点]{id="math.vector-calculus.stationary-point"}，并判断每个驻点是什么点。

**为什么想到这么做**：先解$f_x=f_y=0$求出全部驻点，再在每个驻点算$D$，按二阶导数判别法分类。

**推导**：$f_x=4x^3-4y$，$f_y=4y^3-4x$。由$f_x=0$得$y=x^3$，代入$f_y=0$得$x^9=x$，所以$x=0$或$x=\pm1$，驻点是$(0,0)$、$(1,1)$、$(-1,-1)$。$f_{xx}=12x^2$，$f_{yy}=12y^2$，$f_{xy}=-4$：原点处$D=0-16<0$，是:term[鞍点]{id="math.vector-calculus.saddle-point"}；$(\pm1,\pm1)$处$D=144-16=128>0$、$f_{xx}=12>0$，是严格局部极小点，$f=-2$。

### 例 2　圆盘上的最大值和最小值

求$f(x,y)=x^2+2y^2-x$在闭圆盘（closed disk）$x^2+y^2\le1$上的最大值和最小值。

**为什么想到这么做**：闭圆盘有界、闭，$f$:term[连续]{id="math.vector-calculus.continuous"}，最值一定取得到。按求最值的办法，分内部的:term[驻点]{id="math.vector-calculus.stationary-point"}和边界两部分；边界是单位圆，写成$x=\cos t$、$y=\sin t$。

**推导**：内部：$f_x=2x-1=0$，$f_y=4y=0$，驻点$\bigl(\frac12,0\bigr)$，$f=-\frac14$。边界上$f=\cos^2t+2\sin^2t-\cos t=2-\cos^2t-\cos t$，令$c=\cos t\in[-1,1]$，$g(c)=2-c^2-c$在$c=-\frac12$取最大值$\frac94$，在$c=1$取最小值$0$。比较$-\frac14$、$\frac94$、$0$：最大值是$\frac94$，在$\bigl(-\frac12,\pm\frac{\sqrt3}2\bigr)$取到；最小值是$-\frac14$，在$\bigl(\frac12,0\bigr)$取到。

## 常见误区

- 「$D=0$，:term[驻点]{id="math.vector-calculus.stationary-point"}就不是极值点。」$D=0$时判断不了：$x^4+y^2$在原点是极小点，$x^3+y^2$在原点是:term[鞍点]{id="math.vector-calculus.saddle-point"}，两者的$D$都是$0$。
- 「最值一定在驻点取到。」例 2 的最大值在边界上取到，那里不是驻点。
- 「:term[连续函数]{id="math.vector-calculus.continuous"}一定有最大值和最小值。」要区域有界、闭；开圆盘、整个平面上都可能取不到。
- 「只有一个驻点，又是极小点，它就是最小值点。」一元时是这样，二元时不一定（第 7 题）。

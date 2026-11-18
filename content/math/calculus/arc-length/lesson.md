---
id: math.calculus.arc-length
title: |
  弧长与旋转曲面的面积
goal: |
  会用微元法推出弧长公式，并求曲线的弧长和旋转曲面的面积。
prerequisites: [math.calculus.area-between-curves]
minutes: 27
summary: |
  弧长微元$\dd s=\sqrt{\dd x^2+\dd y^2}=\sqrt{1+y'^2}\,\dd x$；旋转曲面的面积微元是$2\pi y\,\dd s$。
status: reviewed
---

## 这一节要回答的问题

圆的周长是$2\pi r$，可一条曲线的「长度」到底是什么意思？量弯的东西，可以用很多小段线段去贴，段数越多越准。这个想法能不能写成积分？把曲线绕一条直线转一圈，转出的曲面（比如球面）面积又怎么算？

## 讲解

### 弧长

::anchor{id="def-arc-length"}
在曲线上从一端到另一端依次取分点，连成折线。如果分点越来越密、最长的一段趋于$0$时，折线的长度总趋于同一个数，就把这个数叫作这段曲线的:term[弧长]{id="math.calculus.arc-length"}（arc length）。

为什么这样定义：线段的长度会算，曲线的长度就借折线来逼近，就像面积借长方形来逼近。由三角形两边之和大于第三边，加密分点时折线不会变短，弧长是这些折线长度的上限。边界情况：不是每条曲线都有弧长，$y=x\sin\frac1x$在$0$附近来回振荡无数次，折线可以任意长。

::anchor{id="thm-arc-length"}
**定理（弧长公式）**　设$f$在$[a,b]$上有:term[连续]{id="math.calculus.continuous"}（continuous）的:term[导数]{id="math.calculus.derivative"}（derivative），则曲线$y=f(x)$（$a\le x\le b$）的弧长是$s=\int_a^b\sqrt{1+f'(x)^2}\,\dd x$。

道理：取分点$a=x_0<x_1<\cdots<x_n=b$，第$i$段折线长$\sqrt{(\Delta x_i)^2+(\Delta y_i)^2}$。由:term[中值定理]{id="math.calculus.mean-value-theorem"}（mean value theorem），$\Delta y_i=f'(\xi_i)\Delta x_i$，这一段长$\sqrt{1+f'(\xi_i)^2}\,\Delta x_i$，所以折线的总长正好是$\sqrt{1+f'^2}$的一个:term[黎曼和]{id="math.calculus.riemann-sum"}（Riemann sum），分得越细越趋于这个积分。用:term[微元法]{id="math.calculus.element-method"}（method of differential elements）说，$[x,x+\dd x]$上的一小段弧近似是直角边为$\dd x$、$\dd y$的斜边，弧长的:term[微元]{id="math.calculus.differential-element"}（differential element）是$\dd s=\sqrt{\dd x^2+\dd y^2}=\sqrt{1+f'(x)^2}\,\dd x$。

写成$\dd s=\sqrt{\dd x^2+\dd y^2}$的好处是不依赖用哪个变量。曲线写成$x=x(t)$、$y=y(t)$时，同样有$\dd s=\sqrt{x'(t)^2+y'(t)^2}\,\dd t$；单位圆$x=\cos t$、$y=\sin t$从$t=0$到$t=\theta$的长度是$\int_0^\theta\sqrt{\sin^2t+\cos^2t}\,\dd t=\theta$，弧度正是单位圆上的弧长。参数形式的完整讲法见[参数曲线](lesson:math.calculus.parametric-curves#thm-parametric-arc-length)。边界情况：公式要求$f'$在闭区间上连续，半圆$y=\sqrt{r^2-x^2}$在$x=\pm r$处的:term[切线]{id="math.calculus.tangent-line"}（tangent line）是竖直的，$f'$无界，这时改用参数形式。

### 旋转曲面的面积

::anchor{id="def-surface-of-revolution"}
平面曲线绕同一平面内的一条直线旋转一周，得到的曲面叫作旋转曲面（surface of revolution）。

为什么单独讲：球面、圆锥面、圆柱面都是旋转曲面，它们的面积可以沿旋转轴一窄条一窄条地加。边界情况：曲线和旋转轴相交时，曲面在交点处收成一点，比如圆锥的顶点。

::anchor{id="thm-surface-area"}
**定理**　设$f$在$[a,b]$上有:term[连续]{id="math.calculus.continuous"}的:term[导数]{id="math.calculus.derivative"}、$f\ge0$，曲线$y=f(x)$（$a\le x\le b$）绕$x$轴旋转，得到的旋转曲面面积是$S=2\pi\int_a^bf(x)\sqrt{1+f'(x)^2}\,\dd x$。

道理：一小段弧$\dd s$转一圈，成为一条窄带，近似是母线长$\dd s$、两端半径约为$f(x)$的圆台侧面。圆台的侧面积是$\pi(r_1+r_2)l$，所以$\dd S=2\pi f(x)\,\dd s$。窄带是斜的，宽度是$\dd s$而不是$\dd x$；用$\dd x$就会把斜的窄带当成竖直的圆柱面，算小了。比如半径$r$的球面，$f=\sqrt{r^2-x^2}$，$f\sqrt{1+f'^2}=r$，在$[-r+\varepsilon,r-\varepsilon]$上积分得$4\pi r(r-\varepsilon)$，令$\varepsilon\to0$，得$S=4\pi r^2$。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-2, 2], y: [0, 5] }
functions:
  - expr: "(exp(x) + exp(-x))/2 + 0*sqrt((x + 1.5)*(1.5 - x))"
    label: |
      $y=\frac{e^x+e^{-x}}2$，$-1.5\le x\le1.5$
  - expr: "(exp((-1.5 + (min(floor((x + 1.5)*N/3), N - 1))*3/N)) + exp(-(-1.5 + (min(floor((x + 1.5)*N/3), N - 1))*3/N)))/2 + ((exp((-1.5 + (min(floor((x + 1.5)*N/3), N - 1) + 1)*3/N)) + exp(-(-1.5 + (min(floor((x + 1.5)*N/3), N - 1) + 1)*3/N)))/2 - (exp((-1.5 + (min(floor((x + 1.5)*N/3), N - 1))*3/N)) + exp(-(-1.5 + (min(floor((x + 1.5)*N/3), N - 1))*3/N)))/2)*((x + 1.5)*N/3 - min(floor((x + 1.5)*N/3), N - 1)) + 0*sqrt((x + 1.5)*(1.5 - x))"
    label: |
      分成$N$段的折线
  - expr: "sum(k, 0, N - 1, sqrt((3/N)^2 + ((exp(-1.5 + (k + 1)*3/N) + exp(1.5 - (k + 1)*3/N))/2 - (exp(-1.5 + k*3/N) + exp(1.5 - k*3/N))/2)^2)) + 0*x"
    label: |
      高度是折线的总长
  - expr: "exp(1.5) - exp(-1.5) + 0*x"
    label: |
      高度是弧长$e^{1.5}-e^{-1.5}$
sliders:
  - name: N
    min: 1
    max: 40
    step: 1
    default: 3
    label: |
      折线的段数$N$
:::

蓝色曲线是$y=\frac{e^x+e^{-x}}2$，橙色折线把它等分成$N$段。绿色横线的高度是折线的总长，紫色横线的高度是曲线的:term[弧长]{id="math.calculus.arc-length"}，由弧长公式算出是$e^{1.5}-e^{-1.5}\approx4.259$。拖动$N$：$N=1$时折线只是一条水平的弦，总长$3$；段数增加，折线贴近曲线，总长一路增加，$N=10$时约为$4.250$，$N=40$时约为$4.258$，从下面逼近弧长，始终不超过它。

## 例题

### 例 1　被积式恰好是完全平方

求曲线$y=\frac{x^2}4-\frac{\ln x}2$（$1\le x\le2$）的:term[弧长]{id="math.calculus.arc-length"}。

**为什么想到这么做**：$\sqrt{1+y'^2}$一般积不出来，这条曲线的$1+y'^2$恰好是完全平方，根号能开出来。

**推导**：$y'=\frac x2-\frac1{2x}$，$1+y'^2=\frac{x^2}4+\frac12+\frac1{4x^2}=\Bigl(\frac x2+\frac1{2x}\Bigr)^2$，所以

$$
s=\int_1^2\Bigl(\frac x2+\frac1{2x}\Bigr)\dd x=\Bigl(\frac{x^2}4+\frac{\ln x}2\Bigr)\Big|_1^2=\frac34+\frac{\ln2}2.
$$

### 例 2　球面上的一条带

半径为$r$的球面，夹在两个相距$h$的平行平面之间的部分（两个平面都和球相交），面积是多少？

**为什么想到这么做**：球面是半圆$y=\sqrt{r^2-x^2}$绕$x$轴旋转得到的，两个平面取作$x=c$和$x=c+h$，用旋转曲面的面积公式；讲解里已经算出:term[被积函数]{id="math.calculus.integrand"}（integrand）$f\sqrt{1+f'^2}$就是常数$r$。

**推导**：$-r\le c<c+h\le r$，

$$
S=2\pi\int_c^{c+h}r\,\dd x=2\pi rh.
$$

面积只和两个平面的距离有关，和这条带在球上的位置无关：靠近赤道的带宽而窄，靠近两极的带窄而陡，面积一样。这是阿基米德（Archimedes）发现的。

## 常见误区

- 「旋转曲面的面积是$2\pi\int_a^bf(x)\,\dd x$。」要用$\dd s$不能用$\dd x$。对球面，$2\pi\int_{-r}^r\sqrt{r^2-x^2}\,\dd x=\pi^2r^2$，不是$4\pi r^2$。
- 「$\sqrt{1+f'^2}=1+f'$。」平方根不能这样拆。$y=x$在$[0,1]$上，$\int_0^1\sqrt{1+1}\,\dd x=\sqrt2$是对的长度，$\int_0^1(1+1)\,\dd x=2$不是。
- 「分点越多，折线越长，所以折线可以比:term[弧长]{id="math.calculus.arc-length"}还长。」折线连的是曲线上的点，每一段都不长于它对着的那段弧，所以折线的总长不超过弧长，弧长是它们的极限。

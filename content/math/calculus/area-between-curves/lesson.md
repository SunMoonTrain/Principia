---
id: math.calculus.area-between-curves
title: |
  微元法与平面图形的面积
goal: |
  会用微元法列出积分，求曲线围成的平面图形的面积。
prerequisites: [math.calculus.fundamental-theorem, math.calculus.differentials]
minutes: 26
summary: |
  微元法：写出一小段上的$\dd Q$，再积起来；两曲线间的面积是$\int_a^b(f-g)\,\dd x$。
status: reviewed
---

## 这一节要回答的问题

抛物线$y=x^2$和$y=2x-x^2$围成一块图形，面积是多少？:term[定积分]{id="math.calculus.definite-integral"}（definite integral）给出的是:term[曲边梯形]{id="math.calculus.curvilinear-trapezoid"}（curvilinear trapezoid）的面积，下边是$x$轴，这块图形的上下两边却都是曲线。以后还要用积分求体积、:term[弧长]{id="math.calculus.arc-length"}（arc length）、变力做的功，每次都从:term[黎曼和]{id="math.calculus.riemann-sum"}（Riemann sum）写起太麻烦，有没有直接列出积分的办法？

## 讲解

### 两条曲线之间的面积

::anchor{id="thm-area-between-curves"}
**定理**　设$f$、$g$在$[a,b]$上:term[连续]{id="math.calculus.continuous"}（continuous），并且$f(x)\ge g(x)$，则曲线$y=f(x)$、$y=g(x)$和直线$x=a$、$x=b$围成的图形的面积是$A=\int_a^b\bigl[f(x)-g(x)\bigr]\dd x$。

道理：$g\ge0$时，这块图形是$f$下面的:term[曲边梯形]{id="math.calculus.curvilinear-trapezoid"}去掉$g$下面的曲边梯形，由:term[定积分]{id="math.calculus.definite-integral"}的线性（linearity，见[定积分的性质](lesson:math.calculus.integral-properties#thm-linearity)），面积是$\int_a^bf(x)\,\dd x-\int_a^bg(x)\,\dd x=\int_a^b\bigl[f(x)-g(x)\bigr]\dd x$。$g$有负值时，把两条曲线一起向上平移$C$，使$g+C\ge0$：图形只是挪了位置，面积不变，而$(f+C)-(g+C)=f-g$。

开头的问题：由$x^2=2x-x^2$得两条曲线交于$x=0$和$x=1$，在$[0,1]$上$2x-x^2\ge x^2$，所以面积是$\int_0^1(2x-2x^2)\,\dd x=\Bigl(x^2-\frac23x^3\Bigr)\Big|_0^1=\frac13$。

边界情况：两条曲线在$[a,b]$里相交时，上下会互换。这时要先求交点，在每一段上都用上面的减下面的，即$A=\int_a^b\bigl|f(x)-g(x)\bigr|\,\dd x$。直接积$f-g$，得到的是两边面积之差：$y=x^3$和$y=x$在$[-1,1]$上围成两块面积都是$\frac14$的图形，$\int_{-1}^1(x^3-x)\,\dd x$却是$0$。

### 微元法

上面的公式还可以这样看：在$[x,x+\dd x]$上竖着切下一窄条，它近似是高$f(x)-g(x)$、宽$\dd x$的长方形；把这些窄条从$a$到$b$加起来，就是上面的积分。体积、:term[弧长]{id="math.calculus.arc-length"}、功也都能这样一小段一小段地写出来，下面把这个办法说清楚。

::anchor{id="def-element-method"}
设要求的量$Q$分布在区间$[a,b]$上，记$[a,x]$上的那一部分为$Q(x)$，$Q(a)=0$。如果$[x,x+\Delta x]$上的那一部分$\Delta Q=Q(x+\Delta x)-Q(x)$等于$f(x)\Delta x$加上一个和$\Delta x$相比趋于$0$的量，并且$f$:term[连续]{id="math.calculus.continuous"}，就把$\dd Q=f(x)\,\dd x$叫作$Q$的:term[微元]{id="math.calculus.differential-element"}（differential element），由它得到$Q=\int_a^bf(x)\,\dd x$。这样求$Q$的办法叫作:term[微元法]{id="math.calculus.element-method"}（method of differential elements）。

道理：条件说的是$\frac{\Delta Q}{\Delta x}\to f(x)$，即$Q'(x)=f(x)$，$\dd Q=f(x)\,\dd x$正是$Q$的:term[微分]{id="math.calculus.differential"}（differential）。由:term[牛顿-莱布尼茨公式]{id="math.calculus.newton-leibniz-formula"}（Newton-Leibniz formula），$Q(b)-Q(a)=\int_a^bf(x)\,\dd x$，而$Q(a)=0$。从:term[黎曼和]{id="math.calculus.riemann-sum"}看也一样：$Q$等于各小段上的量之和，每一段用微元代替，和就是$f$的一个黎曼和；分得越细，每一段的误差占这一段长度的比例越小，误差的总和不超过这个比例乘$b-a$，也趋于$0$。

为什么这样起名：$\dd Q$是$\Delta Q$里和$\Delta x$成正比的那一部分，好比微分是函数增量里的主要部分；积分号把这些微小的单元加起来。用起来分三步：选定:term[积分变量]{id="math.calculus.integration-variable"}（variable of integration）和它的范围；在$[x,x+\dd x]$上写出微元；从$a$积到$b$。

边界情况：误差要和$\dd x$相比趋于$0$，随手的近似不一定行。直线$y=x$从$(0,0)$到$(1,1)$的一段长$\sqrt2$；如果把每一小段的长度近似成它在$x$轴上的投影$\dd x$，积出来是$1$，因为误差$(\sqrt2-1)\dd x$和$\dd x$相比不趋于$0$。

两条曲线之间的面积正是这样：$[x,x+\Delta x]$上的那一窄条，面积夹在$m\Delta x$和$M\Delta x$之间，$m$、$M$是$f-g$在这一小段上的最小值和最大值。$f-g$连续，$\Delta x\to0$时$m$、$M$都趋于$f(x)-g(x)$，所以面积微元是$\dd A=\bigl[f(x)-g(x)\bigr]\dd x$，和定理一致。

### 横着切

:term[微元法]{id="math.calculus.element-method"}不限于竖着切。图形的左右两边是曲线$x=\varphi(y)$、$x=\psi(y)$（$\varphi(y)\le\psi(y)$），上下由直线$y=c$、$y=d$截住时，在$[y,y+\dd y]$上横着切下一窄条，它长$\psi(y)-\varphi(y)$、宽$\dd y$，所以

$$
\dd A=\bigl[\psi(y)-\varphi(y)\bigr]\dd y,\qquad A=\int_c^d\bigl[\psi(y)-\varphi(y)\bigr]\dd y.
$$

:term[被积函数]{id="math.calculus.integrand"}（integrand）是右边的减左边的，要写成$y$的函数，:term[积分区间]{id="math.calculus.interval-of-integration"}（interval of integration）是$y$的范围。为什么要换着切：竖着切时，图形的上边或下边如果由两段曲线拼成，就得在拼接处分开积；横着切时，每一条的左右两端也许各在一条曲线上（例 1）。哪一种只要积一个积分、:term[原函数]{id="math.calculus.antiderivative"}（antiderivative）又好求，就用哪一种。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-0.3, 3.3], y: [-0.7, 4.7] }
functions:
  - expr: "x"
    label: |
      $y=x$
  - expr: "x^2/2"
    label: |
      $y=\frac{x^2}2$
  - expr: "2*(min(x, 2)^2/2 - min(x, 2)^3/6) - (x^2/2 - x^3/6) + 0*sqrt(x*(b - x))"
    label: |
      $[0,x]$上两条线之间的面积
  - expr: "x^2/2 - x^3/6 + 0*sqrt(x*(b - x))"
    label: |
      $\int_0^x\bigl(t-\frac{t^2}2\bigr)\dd t$
points:
  - { x: "b", y: "b" }
  - { x: "b", y: "b^2/2" }
  - { x: "b", y: "2*(min(b, 2)^2/2 - min(b, 2)^3/6) - (b^2/2 - b^3/6)" }
sliders:
  - name: b
    min: 0.2
    max: 3
    step: 0.05
    default: 1.2
    label: |
      右端点$b$
:::

蓝色直线$y=x$和橙色抛物线$y=\frac{x^2}2$交于$x=0$和$x=2$。绿色曲线在$x$处的高度，是两条线在$[0,x]$上围成的面积，画到右端点$b$为止。拖动$b$，绿色曲线一直往上走，末端的斜率等于直线和抛物线上两个圆点的距离$\bigl|b-\frac{b^2}2\bigr|$，这就是:term[微元]{id="math.calculus.differential-element"}$\dd A=\bigl|f(x)-g(x)\bigr|\dd x$说的事；$b=2$时两点重合，绿色曲线在那里是平的。紫色曲线是$x-\frac{x^2}2$的积分：$b<2$时它和绿色曲线重合，$b>2$以后两条线上下互换，它往下走，$b=3$时回到$0$，绿色曲线却停在$\frac43$。

## 例题

### 例 1　横着切更简单

求抛物线$y^2=2x$和直线$y=x-4$围成的图形的面积。

**为什么想到这么做**：竖着切时，$0\le x\le2$那一段的上下边都在抛物线上，$2\le x\le8$那一段的下边换成了直线，要分两段积，还带着根号。横着切，每一条的左端都在抛物线$x=\frac{y^2}2$上，右端都在直线$x=y+4$上，一个积分就够了。

**推导**：由$\frac{y^2}2=y+4$得$y=-2$或$y=4$，交点是$(2,-2)$和$(8,4)$。在$-2\le y\le4$上直线在右边，所以

$$
A=\int_{-2}^4\Bigl(y+4-\frac{y^2}2\Bigr)\dd y=\Bigl(\frac{y^2}2+4y-\frac{y^3}6\Bigr)\Big|_{-2}^4=\frac{40}3+\frac{14}3=18.
$$

### 例 2　椭圆的面积

求椭圆$\frac{x^2}{a^2}+\frac{y^2}{b^2}=1$（$a,b>0$）围成的面积。

**为什么想到这么做**：椭圆上下对称，上半边是$y=\frac ba\sqrt{a^2-x^2}$，下半边是$y=-\frac ba\sqrt{a^2-x^2}$，竖着切，每一条长$\frac{2b}a\sqrt{a^2-x^2}$。$\int_{-a}^a\sqrt{a^2-x^2}\,\dd x$是半径为$a$的半圆的面积，不用找:term[原函数]{id="math.calculus.antiderivative"}。

**推导**：面积的:term[微元]{id="math.calculus.differential-element"}是$\dd A=\frac{2b}a\sqrt{a^2-x^2}\,\dd x$，由线性，

$$
A=\int_{-a}^a\frac{2b}a\sqrt{a^2-x^2}\,\dd x=\frac{2b}a\int_{-a}^a\sqrt{a^2-x^2}\,\dd x=\frac{2b}a\cdot\frac{\pi a^2}2=\pi ab.
$$

$a=b$时就是圆的面积$\pi a^2$。换个角度看：把圆$x^2+y^2=a^2$沿竖直方向伸缩成原来的$\frac ba$倍，就得到这个椭圆；每一竖条都变成原来的$\frac ba$倍，面积也就变成原来的$\frac ba$倍。

## 常见误区

- 「先积$f-g$，结果是负的就取绝对值，就是面积。」只有两条曲线在区间里不相交时才对。$y=x$和$y=x^2$在$[0,2]$上，$\int_0^2(x-x^2)\,\dd x=-\frac23$，可面积是$\frac16+\frac56=1$：$x=1$处上下互换，要分两段。
- 「横着切时，:term[被积函数]{id="math.calculus.integrand"}还是上面的减下面的。」横着切时每一条的长是右边的横坐标减左边的，要写成$y$的函数，例 1 里是$(y+4)-\frac{y^2}2$；:term[积分区间]{id="math.calculus.interval-of-integration"}也换成$y$的范围$[-2,4]$。
- 「:term[微元]{id="math.calculus.differential-element"}随便近似都行，反正最后要取极限。」圆锥的底面半径为$R$、高为$H$，把侧面横着切成窄带，每一条都当成高$\dd z$的圆柱面，积出来是$\pi RH$，可侧面积是$\pi R\sqrt{R^2+H^2}$：窄带是斜的，宽是$\dd z$的$\frac{\sqrt{R^2+H^2}}H$倍，误差和$\dd z$相比不趋于$0$。

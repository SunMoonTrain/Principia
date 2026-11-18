---
id: math.complex-analysis.contour-integrals
title: |
  复积分
goal: |
  会计算复函数沿曲线的积分，并用「曲线长度乘最大模」估计积分。
prerequisites: [math.complex-analysis.complex-functions, math.vector-calculus.line-integrals]
minutes: 28
summary: |
  $\int_Cf\,\dd z=\int_a^bf(z(t))z'(t)\,\dd t$；$\oint\frac{\dd z}z=2\pi i$，$|\int_Cf\,\dd z|\le ML$。
status: reviewed
---

## 这一节要回答的问题

实函数的定积分（definite integral）沿区间从左走到右。:term[复变函数]{id="math.complex-analysis.complex-function"}（function of a complex variable）的自变量在平面上，从一点到另一点可以走不同的曲线。沿一条曲线怎样积分一个复变函数？积分的大小，能不能不算出来就先估计？

## 讲解

### 曲线的复数写法

平面上的曲线$C$写成$z(t)=x(t)+iy(t)$，$a\le t\le b$，是实变量的:term[复值函数]{id="math.complex-analysis.complex-valued-function"}（complex-valued function）。$z'(t)=x'(t)+iy'(t)$连续并且处处不为$0$时，$C$是光滑曲线（smooth curve），$z'(t)$就是切向量（tangent vector）；几段光滑曲线首尾相接，叫作分段光滑（piecewise smooth）。$C$的方向是从起点$z(a)$走到终点$z(b)$，反方向走的同一条曲线记作$-C$；$z(a)=z(b)$时$C$是闭曲线（closed curve）。

最常用的两条：圆周$|z-z_0|=r$逆时针走一圈写成$z(t)=z_0+re^{it}$，$0\le t\le2\pi$，$z'(t)=ire^{it}$；从$z_1$到$z_2$的线段写成$z(t)=z_1+t(z_2-z_1)$，$0\le t\le1$。

### 复积分

::anchor{id="def-contour-integral"}
设$C$是光滑曲线$z(t)$（$a\le t\le b$），$f$在$C$上连续。规定$\int_Cf(z)\,\dd z=\int_a^bf(z(t))\,z'(t)\,\dd t$，叫作$f$沿$C$的:term[复积分]{id="math.complex-analysis.contour-integral"}（contour integral）；$C$分段光滑时，把各段上的积分加起来。$C$是闭曲线时也写作$\oint_Cf(z)\,\dd z$。

为什么这样定义：把$C$分成小段，$f(z_k)(z_k-z_{k-1})$求和，而$z_k-z_{k-1}\approx z'(t_k)\Delta t$，和式就趋于上面的积分。写开来，$f\,\dd z=(u+iv)(\dd x+i\,\dd y)$，所以$\int_Cf\,\dd z=\int_C(u\,\dd x-v\,\dd y)+i\int_C(v\,\dd x+u\,\dd y)$，是两个曲线积分（line integral）；同方向换一种参数，积分不变，这和曲线积分一样。边界情况：方向反过来，$z'(t)$变号，积分也变号，$\int_{-C}f\,\dd z=-\int_Cf\,\dd z$。

::anchor{id="thm-contour-properties"}
**定理**　复积分有这些性质：$\int_C(\alpha f+\beta g)\,\dd z=\alpha\int_Cf\,\dd z+\beta\int_Cg\,\dd z$，$\alpha$、$\beta$是复常数；$C$由$C_1$、$C_2$首尾相接而成时，$\int_Cf\,\dd z=\int_{C_1}f\,\dd z+\int_{C_2}f\,\dd z$；$\int_{-C}f\,\dd z=-\int_Cf\,\dd z$。

**证明**：第一条是:term[复值函数]{id="math.complex-analysis.complex-valued-function"}积分的线性性，见[实变量的复值函数](lesson:math.complex-analysis.complex-exponential#def-complex-valued-function)。第二条把参数区间在接头处分成两段。第三条：$-C$可以写成$w(s)=z(a+b-s)$，$w'(s)=-z'(a+b-s)$，作换元$t=a+b-s$即得。

### 一个最重要的例子

::anchor{id="thm-power-integral"}
**定理**　设$n$是整数，$C$是圆周$|z-z_0|=r$，逆时针走一圈。则$n\ne-1$时$\oint_C(z-z_0)^n\,\dd z=0$，而$\oint_C\frac{\dd z}{z-z_0}=2\pi i$。

**证明**：取$z(t)=z_0+re^{it}$，$0\le t\le2\pi$，则$(z(t)-z_0)^nz'(t)=r^ne^{int}\cdot ire^{it}=ir^{n+1}e^{i(n+1)t}$。由[$e^{\lambda t}$的积分公式](lesson:math.complex-analysis.complex-exponential#thm-exp-derivative)，$n+1\ne0$时$\int_0^{2\pi}e^{i(n+1)t}\,\dd t=0$；$n=-1$时被积函数（integrand）是常数$i$，积分是$2\pi i$。

为什么重要：以后计算:term[复积分]{id="math.complex-analysis.contour-integral"}，很多都要化成这一个结果。$\oint_C\frac{\dd z}{z-z_0}=2\pi i$和半径$r$无关：被积函数的:term[模]{id="math.complex-analysis.modulus"}（modulus）是$\frac1r$，圆周长$2\pi r$，两者正好抵消。边界情况：$n\ne-1$时积分为$0$，可沿半个圆周就不一定为$0$，例如$\int\frac{\dd z}{z^2}$沿上半圆从$r$到$-r$是$\frac2r$（第 3 题是同一类计算）。

### 长度乘最大模

::anchor{id="thm-integral-modulus"}
**引理**　设$g$是$[a,b]$上连续的:term[复值函数]{id="math.complex-analysis.complex-valued-function"}，则$\Bigl|\int_a^bg(t)\,\dd t\Bigr|\le\int_a^b|g(t)|\,\dd t$。

**证明**：记$I=\int_a^bg(t)\,\dd t$，$I=0$时不用证。$I\ne0$时写成$I=|I|e^{i\theta}$，则$|I|=e^{-i\theta}I=\int_a^be^{-i\theta}g(t)\,\dd t$。左边是实数，所以它等于右边积分的:term[实部]{id="math.complex-analysis.real-part"}（real part），即$\int_a^b\Re\bigl(e^{-i\theta}g(t)\bigr)\,\dd t$。而$\Re\bigl(e^{-i\theta}g(t)\bigr)\le|g(t)|$，由保序性（monotonicity），$|I|\le\int_a^b|g(t)|\,\dd t$。

::anchor{id="thm-ml-inequality"}
**定理（:term[ML 不等式]{id="math.complex-analysis.ml-inequality"}，ML inequality）**　设光滑曲线$C$的长度是$L$，$f$在$C$上连续，并且$C$上处处$|f(z)|\le M$。则$\bigl|\int_Cf(z)\,\dd z\bigr|\le ML$。

**证明**：由引理和$|z'(t)|=\sqrt{x'(t)^2+y'(t)^2}$，

$$
\Bigl|\int_Cf(z)\,\dd z\Bigr|\le\int_a^b|f(z(t))|\,|z'(t)|\,\dd t\le M\int_a^b|z'(t)|\,\dd t=ML,
$$

最后一步用了弧长（arc length）公式$L=\int_a^b\sqrt{x'(t)^2+y'(t)^2}\,\dd t$。分段光滑时各段相加，结论不变。

为什么有用：很多积分算不出来，只要知道它很小，这个估计就够了，例如证明某个积分在半径趋于无穷时趋于$0$（例 2）。它的名字就是「最大:term[模]{id="math.complex-analysis.modulus"}$M$乘长度$L$」。边界情况：这个界只管大小、不管抵消，$\oint_{|z|=r}\frac{\dd z}{z^2}=0$，ML 不等式给的界却是$\frac1{r^2}\cdot2\pi r=\frac{2\pi}r$。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 6.6], y: [-2.2, 6.8] }
functions:
  - expr: "(cos((k + 1.000001)*x) - 1)/(k + 1.000001)"
    label: |
      实部
  - expr: "sin((k + 1.000001)*x)/(k + 1.000001)"
    label: |
      虚部
points:
  - { x: "2*pi", y: "0" }
  - { x: "2*pi", y: "2*pi" }
sliders:
  - name: k
    min: -3
    max: 3
    step: 1
    default: -1
    label: |
      指数$n$
:::

沿单位圆从$1$出发逆时针走，走到参数$s$时，积分$\int z^n\,\dd z$的:term[实部]{id="math.complex-analysis.real-part"}是蓝线，:term[虚部]{id="math.complex-analysis.imaginary-part"}（imaginary part）是橙线，横轴是$s$（图上写作 x）。拖动$n$：$n\ne-1$时两条线摆动几下，到$s=2\pi$走完一圈时都回到$0$；$n=-1$时实部一直是$0$，虚部直线上升，走完一圈正好是$2\pi$，即$\oint\frac{\dd z}z=2\pi i$。两个圆点标出$s=2\pi$处的高度$0$和$2\pi$。

## 例题

### 例 1　换一条路，积分变不变

从$0$到$1+i$，沿两条路积分$f(z)=\bar z$和$g(z)=z^2$：$C_1$是线段；$C_2$先沿:term[实轴]{id="math.complex-analysis.real-axis"}（real axis）走到$1$，再竖直走到$1+i$。

**为什么想到这么做**：两条路都按定义写出参数。线段用$z=t(1+i)$；$C_2$的第一段用$z=t$，第二段用$z=1+it$，$0\le t\le1$。

**推导**：沿$C_1$，$\int_{C_1}\bar z\,\dd z=\int_0^1t(1-i)(1+i)\,\dd t=1$；沿$C_2$，

$$
\int_{C_2}\bar z\,\dd z=\int_0^1t\,\dd t+\int_0^1(1-it)\,i\,\dd t=\frac12+\Bigl(i+\frac12\Bigr)=1+i.
$$

两条路的结果不同：$\bar z$的:term[复积分]{id="math.complex-analysis.contour-integral"}不只由起点和终点决定。同样算$z^2$：$\int_{C_1}z^2\,\dd z=(1+i)^3\int_0^1t^2\,\dd t=\frac{(1+i)^3}3$，而$\int_{C_2}z^2\,\dd z=\frac13+i\int_0^1(1+it)^2\,\dd t$，也等于$\frac{(1+i)^3}3=-\frac23+\frac23i$。为什么$z^2$换路不变、$\bar z$却变，[柯西积分定理](lesson:math.complex-analysis.cauchy-theorem)一节回答。

### 例 2　半径趋于无穷时积分趋于零

设$C_R$是圆周$|z|=R$（$R>1$），证明$R\to\infty$时$\oint_{C_R}\frac{\dd z}{z^2+1}\to0$。

**为什么想到这么做**：积分不必算出来，用:term[ML 不等式]{id="math.complex-analysis.ml-inequality"}：在圆周上把$\bigl|\frac1{z^2+1}\bigr|$放大成只和$R$有关的数，再乘周长。

**推导**：在$C_R$上，由:term[三角不等式]{id="math.complex-analysis.triangle-inequality"}（triangle inequality），$|z^2+1|\ge|z|^2-1=R^2-1$，所以$\bigl|\frac1{z^2+1}\bigr|\le\frac1{R^2-1}$。周长是$2\pi R$，于是

$$
\Bigl|\oint_{C_R}\frac{\dd z}{z^2+1}\Bigr|\le\frac{2\pi R}{R^2-1}\to0\qquad(R\to\infty).
$$

分子是一次、分母是二次，所以趋于$0$；要被积函数比$\frac1R$衰减得快才行，$\oint\frac{\dd z}z$就不趋于$0$。

## 常见误区

- 「:term[复积分]{id="math.complex-analysis.contour-integral"}只由起点和终点决定。」一般不对：例 1 里$\bar z$沿两条路的积分分别是$1$和$1+i$。换路不变要有条件，见[柯西积分定理](lesson:math.complex-analysis.cauchy-theorem)。
- 「$\bigl|\int_Cf\,\dd z\bigr|=\int_a^b|f(z(t))|\,|z'(t)|\,\dd t$。」只有「$\le$」；$\oint_{|z|=1}\frac{\dd z}{z^2}=0$，右边却是$2\pi$。
- 「圆周越大，$\oint_{|z|=r}\frac{\dd z}z$越大。」它对每个$r$都是$2\pi i$：圆周变长，被积函数的:term[模]{id="math.complex-analysis.modulus"}按同样的比例变小。

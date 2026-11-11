---
id: math.ode.frobenius
title: |
  弗罗贝尼乌斯方法与贝塞尔方程
goal: |
  会在正则奇点附近用弗罗贝尼乌斯方法求解，并由此得到贝塞尔函数。
prerequisites: [math.ode.series-solutions]
minutes: 35
summary: |
  正则奇点附近试$x^r\sum a_nx^n$；指标方程定出$r$，得到贝塞尔函数。
status: reviewed
---

## 这一节要回答的问题

圆形鼓面的振动、圆柱里的热传导，都会遇到$x^2y''+xy'+(x^2-\nu^2)y=0$。它的首项系数在$x=0$处为零，$0$是:term[奇点]{id="math.ode.singular-point"}（singular point），上一节的幂级数解法不能直接用。奇点附近的解是什么样子？能不能把幂级数（power series）稍加修改，照样求出来？

## 讲解

### 正则奇点

最简单的有:term[奇点]{id="math.ode.singular-point"}的方程是$x^2y''+axy'+by=0$（$x>0$）。试$y=x^r$：$x^2\cdot r(r-1)x^{r-2}+ax\cdot rx^{r-1}+bx^r=\bigl(r(r-1)+ar+b\bigr)x^r$，所以$r$满足二次方程$r(r-1)+ar+b=0$，往往不是整数，这样的$x^r$在$0$处不是幂级数。有奇点的方程，在奇点附近常常就像这样一个方程。

::anchor{id="def-regular-singular-point"}
设$0$是$y''+P(x)y'+Q(x)y=0$的奇点。如果$xP(x)$和$x^2Q(x)$在$0$附近都能写成收敛的幂级数，就说$0$是这个方程的:term[正则奇点]{id="math.ode.regular-singular-point"}（regular singular point）。

为什么这样定义：这时方程两边乘$x^2$，可以写成$x^2y''+xp(x)y'+q(x)y=0$，$p=xP$、$q=x^2Q$是幂级数；在$0$附近$p\approx p_0$、$q\approx q_0$（$p_0=p(0)$、$q_0=q(0)$），方程就像上面那个最简单的方程。在别的点$x_0$处同样定义，把$x$换成$x-x_0$。边界情况：$x^2y''+y'+y=0$在$0$处$xP=\frac1x$不是幂级数，$0$是奇点，但不是正则奇点。

### 弗罗贝尼乌斯方法

::anchor{id="def-frobenius"}
在:term[正则奇点]{id="math.ode.regular-singular-point"}$0$附近，试形如$y=x^r\sum_{n=0}^{\infty}a_nx^n$（$a_0\ne0$，$x>0$）的解，代入方程求$r$和各个$a_n$，这种方法叫作:term[弗罗贝尼乌斯方法]{id="math.ode.frobenius-method"}（Frobenius method）；最低次幂的系数给出的方程$r(r-1)+p_0r+q_0=0$叫作:term[指标方程]{id="math.ode.indicial-equation"}（indicial equation）。

为什么这样定义：$x^r$负责:term[奇点]{id="math.ode.singular-point"}附近的主要样子，后面的幂级数负责修正。代入$x^2y''+xpy'+qy=0$后，最低次幂$x^r$的系数是$a_0\bigl(r(r-1)+p_0r+q_0\bigr)$，$a_0\ne0$，所以$r$必须满足指标方程。边界情况：$p\equiv p_0$、$q\equiv q_0$时，级数只剩$a_0$一项，解就是$x^r$。

::anchor{id="thm-frobenius"}
**弗罗贝尼乌斯定理**　设$0$是正则奇点，$p$、$q$的幂级数在$|x|<R$里收敛，指标方程有两个实根$r_1\ge r_2$。则方程在$0<x<R$上有一个解$x^{r_1}\sum_{n=0}^{\infty}a_nx^n$（$a_0=1$）；若$r_1-r_2$不是整数，还有一个与它线性无关的解$x^{r_2}\sum_{n=0}^{\infty}b_nx^n$（$b_0=1$）。$r_1-r_2$是整数（包括$0$）时，第二个解可能含有$\ln x$乘第一个解的一项。

**证明思路**：记$F(r)=r(r-1)+p_0r+q_0$。代入后$x^{r+n}$的系数为零，给出$F(r+n)a_n=-\sum_{k=0}^{n-1}\bigl((r+k)p_{n-k}+q_{n-k}\bigr)a_k$，$p_j$、$q_j$是$p$、$q$的幂级数系数。$r=r_1$时，$r_1$是较大的根，$F(r_1+n)\ne0$对所有$n\ge1$成立，每个$a_n$都能解出来；$r=r_2$时，若$r_1-r_2$是正整数$N$，则$F(r_2+N)=0$，第$N$步可能解不出来，对数项就从这里来。级数的收敛同:term[常点]{id="math.ode.ordinary-point"}（ordinary point）的情形，这里不证。

### 贝塞尔方程

::anchor{id="def-bessel"}
方程$x^2y''+xy'+(x^2-\nu^2)y=0$（$\nu\ge0$）叫作:term[贝塞尔方程]{id="math.ode.bessel-equation"}（Bessel's equation）；$\nu=n$是非负整数时，它在$0$处有界的解$J_n(x)=\sum_{k=0}^{\infty}\frac{(-1)^k}{k!\,(k+n)!}\bigl(\frac x2\bigr)^{2k+n}$叫作$n$阶:term[贝塞尔函数]{id="math.ode.bessel-function"}（Bessel function）。

为什么这样定义：这里$p=1$、$q=x^2-\nu^2$，$0$是:term[正则奇点]{id="math.ode.regular-singular-point"}，:term[指标方程]{id="math.ode.indicial-equation"}是$r^2-\nu^2=0$，$r=\pm\nu$；取$r=n$，系数满足$a_m=-\frac{a_{m-2}}{m(m+2n)}$，$a_0$取$\frac{1}{2^nn!}$就得到上面的级数，这是习惯的取法。$\nu$不是整数时，阶乘$(k+\nu)!$换成:term[伽马函数]{id="math.analysis.gamma-function"}（gamma function）$\Gamma(k+\nu+1)$。边界情况：$n=0$时，指标方程有重根$0$，第二个解含$\ln x$，在$0$处趋于无穷，鼓面中心这类物理问题里常因此舍去它。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 20], y: [-1, 1.2] }
functions:
  - expr: "sum(k, 0, N, (-1)^k * (x/2)^(2*k) / prod(j, 1, k, j)^2)"
    label: |
      部分和$\sum_{k=0}^{N}\frac{(-1)^k}{(k!)^2}\bigl(\frac x2\bigr)^{2k}$
sliders:
  - name: N
    min: 0
    max: 40
    step: 1
    default: 6
    label: |
      保留到第$N$项
:::

这是$J_0$的部分和。拖动$N$：项数越多，曲线在越来越远的地方稳定下来；$N$取到$35$左右，整个画面里的曲线都已经稳定。$J_0$像一个振幅慢慢变小的余弦，相邻零点的间隔越来越接近$\pi$，但不是等间隔的。

## 例题

### 例 1　两个指数

求$2x^2y''+xy'-(x+1)y=0$在$0$附近的:term[指标方程]{id="math.ode.indicial-equation"}的根，并写出较大的根对应的解的前三项。

**为什么想到这么做**：两边除以$2$得$x^2y''+\frac12xy'-\frac{1+x}{2}y=0$，$p=\frac12$、$q=-\frac{1+x}{2}$都是多项式，$0$是:term[正则奇点]{id="math.ode.regular-singular-point"}，用:term[弗罗贝尼乌斯方法]{id="math.ode.frobenius-method"}。

**推导**：$p_0=\frac12$、$q_0=-\frac12$，指标方程$r(r-1)+\frac12r-\frac12=0$，即$(2r+1)(r-1)=0$，根是$1$和$-\frac12$，差$\frac32$不是整数，有两个弗罗贝尼乌斯解。代入$y=\sum a_nx^{n+r}$，$x^{n+r}$的系数给出$\bigl(2(n+r)^2-(n+r)-1\bigr)a_n=a_{n-1}$；$r=1$时左边的系数是$n(2n+3)$，所以$a_n=\frac{a_{n-1}}{n(2n+3)}$。取$a_0=1$，$a_1=\frac15$，$a_2=\frac{1}{70}$，解是$y_1=x\bigl(1+\frac x5+\frac{x^2}{70}+\cdots\bigr)$。

### 例 2　$J_0$的级数

用:term[弗罗贝尼乌斯方法]{id="math.ode.frobenius-method"}求$x^2y''+xy'+x^2y=0$在$0$处有界的解。

**为什么想到这么做**：这是$\nu=0$的:term[贝塞尔方程]{id="math.ode.bessel-equation"}，$p_0=1$、$q_0=0$，:term[指标方程]{id="math.ode.indicial-equation"}$r^2=0$有重根$0$，只能先得到一个弗罗贝尼乌斯解。

**推导**：代入$y=\sum a_nx^n$：$x^2y''+xy'=\sum n^2a_nx^n$，$x^2y=\sum a_{n-2}x^n$，所以$a_1=0$，$n\ge2$时$a_n=-\frac{a_{n-2}}{n^2}$。取$a_0=1$，$a_2=-\frac14$，$a_4=\frac{1}{4\cdot16}$，一般地$a_{2k}=\frac{(-1)^k}{4^k(k!)^2}$，得$J_0(x)=\sum_{k=0}^{\infty}\frac{(-1)^k}{(k!)^2}\bigl(\frac x2\bigr)^{2k}$。另一个解含$\ln x$，在$0$处无界。

## 常见误区

- 「:term[奇点]{id="math.ode.singular-point"}附近一定没有像样的解。」:term[正则奇点]{id="math.ode.regular-singular-point"}附近有形如$x^r\sum a_nx^n$的解，$r$可以不是整数。
- 「:term[指标方程]{id="math.ode.indicial-equation"}的两个根总给出两个线性无关的弗罗贝尼乌斯解。」两根之差是整数（包括相等）时，第二个解可能要带$\ln x$。
- 「$J_n$的零点是等间隔的。」相邻零点的间隔只是越来越接近$\pi$。
- 「$a_0$可以取$0$。」$a_0\ne0$是规定：否则最低次幂就不是$x^r$，指标方程也推不出来。

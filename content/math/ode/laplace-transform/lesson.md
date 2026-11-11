---
id: math.ode.laplace-transform
title: |
  拉普拉斯变换
goal: |
  会求常见函数的拉普拉斯变换，并用平移和微分的性质推出新的变换。
prerequisites: [math.calculus.improper-integrals, math.calculus.integration-by-parts]
minutes: 30
summary: |
  $F(s)=\int_0^\infty e^{-st}f(t)\dd t$；求导变成乘以$s$，乘$e^{at}$变成平移。
status: reviewed
---

## 这一节要回答的问题

解常系数线性方程时，求导、配初值都要一步一步来。如果有一种变换，能把求导变成乘以一个变量，又顺便把初值带进来，:term[微分方程]{id="math.ode.differential-equation"}（differential equation）就变成了代数方程。积分$\int_0^{+\infty}e^{-st}f(t)\dd t$正是这样一种变换：它对哪些函数有意义？常见的函数变过去是什么？

## 讲解

### 定义

::anchor{id="def-laplace"}
设$f$定义在$[0,+\infty)$上。对使反常积分（improper integral）收敛的$s$，函数$F(s)=\int_0^{+\infty}e^{-st}f(t)\dd t$叫作$f$的:term[拉普拉斯变换]{id="math.ode.laplace-transform"}（Laplace transform），记作$\mathcal L\{f\}$。

为什么这样定义：$e^{-st}$在$t$大时迅速衰减，把$f$在远处的增长压下去，反常积分才可能收敛；$s$越大，压得越狠。积分把$t$的函数变成$s$的函数，下面会看到，$f'$的变换就是$sF(s)-f(0)$。边界情况：$f\equiv1$时$\int_0^{+\infty}e^{-st}\dd t=\frac1s$，只在$s>0$时收敛，$s\le0$时积分发散。

::anchor{id="def-exponential-order"}
如果有常数$M$、$a$、$T$，使$t\ge T$时$|f(t)|\le Me^{at}$，就说$f$是:term[指数阶]{id="math.ode.exponential-order"}（exponential order）的函数。

为什么这样定义：这样的$f$在远处增长得不比某个指数函数快，$s>a$时$e^{-st}|f(t)|\le Me^{-(s-a)t}$，由比较判别法（comparison test），积分收敛。多项式、$e^{kt}$、$\sin bt$、$\cos bt$都是指数阶的。边界情况：$e^{t^2}$不是指数阶的，它的拉普拉斯变换对任何$s$都不存在（第 7 题）。

::anchor{id="thm-laplace-exists"}
**存在性**　设$f$在$[0,+\infty)$上分段连续（piecewise continuous），并且$t\ge T$时$|f(t)|\le Me^{at}$。则$F(s)$在$s>a$时存在，并且$s\to+\infty$时$F(s)\to0$。

**证明思路**：$[0,T]$上$f$有界，设$|f|\le K$；$t\ge T$时$|e^{-st}f(t)|\le Me^{-(s-a)t}$，它在$[T,+\infty)$上的积分收敛，由[比较判别法](lesson:math.calculus.improper-integrals)，$F(s)$的积分绝对收敛（absolutely convergent）。并且$|F(s)|\le\int_0^TKe^{-st}\dd t+\int_T^{+\infty}Me^{-(s-a)t}\dd t\le\frac Ks+\frac{M}{s-a}$，$s\to+\infty$时趋于$0$。

### 常用的变换

| $f(t)$ | $F(s)$ | $s$的范围 |
| --- | --- | --- |
| $1$ | $\frac1s$ | $s>0$ |
| $e^{at}$ | $\frac{1}{s-a}$ | $s>a$ |
| $t^n$（$n=0,1,2,\dots$） | $\frac{n!}{s^{n+1}}$ | $s>0$ |
| $\sin bt$ | $\frac{b}{s^2+b^2}$ | $s>0$ |
| $\cos bt$ | $\frac{s}{s^2+b^2}$ | $s>0$ |

前两行直接积分：$\int_0^{+\infty}e^{-(s-a)t}\dd t=\frac{1}{s-a}$。$t^n$那一行用分部积分（integration by parts）归纳得到（第 6 题），后两行见例 1。

::anchor{id="thm-laplace-shift"}
**线性与平移**　设$\mathcal L\{f\}=F$、$\mathcal L\{g\}=G$。则$\mathcal L\{\alpha f+\beta g\}=\alpha F+\beta G$；并且$\mathcal L\{e^{at}f(t)\}=F(s-a)$，乘上$e^{at}$相当于把变换向右平移$a$。

**证明思路**：积分对被积函数是线性的。平移：$\int_0^{+\infty}e^{-st}e^{at}f(t)\dd t=\int_0^{+\infty}e^{-(s-a)t}f(t)\dd t$，正是$F$在$s-a$处的值，对使$F(s-a)$存在的$s$都成立。

::anchor{id="thm-laplace-derivative"}
**导数的变换**　设$f$连续、$f'$分段连续，并且它们都是:term[指数阶]{id="math.ode.exponential-order"}的，则$\mathcal L\{f'\}=sF(s)-f(0)$。同样，$f''$也满足这些条件时，$\mathcal L\{f''\}=s^2F(s)-sf(0)-f'(0)$。

**证明思路**：分部积分，$\int_0^{T}e^{-st}f'(t)\dd t=e^{-sT}f(T)-f(0)+s\int_0^{T}e^{-st}f(t)\dd t$；$s$足够大时$e^{-sT}f(T)\to0$（$T\to+\infty$），得$sF(s)-f(0)$。把这个公式用在$f'$上，$\mathcal L\{f''\}=s\mathcal L\{f'\}-f'(0)=s^2F(s)-sf(0)-f'(0)$。详细的证明见第 5 题。

### 逆变换

::anchor{id="def-inverse-laplace"}
如果$\mathcal L\{f\}=F$，就说$f$是$F$的:term[拉普拉斯逆变换]{id="math.ode.inverse-laplace-transform"}（inverse Laplace transform），记作$f=\mathcal L^{-1}\{F\}$。

为什么这样定义：可以证明，两个连续函数的:term[拉普拉斯变换]{id="math.ode.laplace-transform"}相同，它们本身就相同（这里不证），所以对连续函数，逆变换是确定的。实际求逆变换时，通常把$F$拆成表里有的几项，再用线性和平移逐项写出来。边界情况：只在有限个点上不同的两个分段连续函数，变换完全相同，所以分段连续时，逆变换只在不计这些点的意义下唯一。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 15], y: [-0.6, 1.6] }
functions:
  - expr: "exp(-s*x) * sin(x)"
    label: |
      被积函数$e^{-st}\sin t$
  - expr: "(1 - exp(-s*x) * (s*sin(x) + cos(x))) / (s^2 + 1)"
    label: |
      积分$\int_0^te^{-s\tau}\sin\tau\dd\tau$
  - expr: "1 / (s^2 + 1)"
    label: |
      $F(s)=\frac{1}{s^2+1}$
sliders:
  - name: s
    min: 0.2
    max: 3
    step: 0.1
    default: 0.5
    label: |
      $s$
:::

横轴是$t$（图上写作 x）。一条曲线是被积函数$e^{-st}\sin t$，另一条是从$0$积到$t$的积分，它随$t$增大趋于水平线$\frac{1}{s^2+1}$，那就是$\sin t$的:term[拉普拉斯变换]{id="math.ode.laplace-transform"}在$s$处的值。拖动$s$：$s$越大，$e^{-st}$衰减得越快，积分越早稳定下来，$F(s)$也越小；$s=0.2$时积分还在水平线上下摆动，$t=15$处离它约$0.03$。

## 例题

### 例 1　正弦和余弦的变换

求$\mathcal L\{\sin bt\}$和$\mathcal L\{\cos bt\}$（$b>0$）。

**为什么想到这么做**：直接积分要分部积分两次；更快的办法是用导数的变换：$f=\sin bt$满足$f''=-b^2f$，两边取变换就得到$F$的一个代数方程。

**推导**：$f(0)=0$、$f'(0)=b$，由导数的变换，$\mathcal L\{f''\}=s^2F-b$；而$f''=-b^2f$，所以$s^2F-b=-b^2F$，$F=\frac{b}{s^2+b^2}$（$s>0$）。同样，$g=\cos bt$满足$g''=-b^2g$、$g(0)=1$、$g'(0)=0$，$s^2G-s=-b^2G$，$G=\frac{s}{s^2+b^2}$。

### 例 2　平移

求$\mathcal L\{e^{at}\sin bt\}$；再求$F(s)=\frac{s+2}{s^2+4s+13}$的:term[拉普拉斯逆变换]{id="math.ode.inverse-laplace-transform"}。

**为什么想到这么做**：乘$e^{at}$对应把变换平移$a$；反过来，分母配方以后若是$(s-a)^2+b^2$的样子，就是平移过的正弦、余弦。

**推导**：由平移，$\mathcal L\{e^{at}\sin bt\}=\frac{b}{(s-a)^2+b^2}$。$s^2+4s+13=(s+2)^2+9$，所以$F(s)=\frac{s+2}{(s+2)^2+3^2}$，它是$\frac{s}{s^2+9}$平移到$s+2$的结果，而$\frac{s}{s^2+9}=\mathcal L\{\cos3t\}$。因此$\mathcal L^{-1}\{F\}=e^{-2t}\cos3t$。

## 常见误区

- 「每个函数都有:term[拉普拉斯变换]{id="math.ode.laplace-transform"}。」反常积分要收敛：$e^{t^2}$对任何$s$都没有变换。
- 「$\mathcal L\{fg\}=FG$。」乘积的变换一般不是变换的乘积；变换的乘积对应的是:term[卷积]{id="math.ode.convolution"}（convolution），见以后的[阶跃函数、冲激与卷积](lesson:math.ode.convolution-impulse)。
- 「$\mathcal L\{f'\}=sF(s)$。」还要减去$f(0)$，初值就是这样带进来的。
- 「$F(s)$对所有的$s$都有定义。」只在使积分收敛的$s$上有定义，通常是某个$s>a$的范围。

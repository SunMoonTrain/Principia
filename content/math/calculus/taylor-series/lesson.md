---
id: math.calculus.taylor-series
title: |
  泰勒级数
goal: |
  会把$e^x$、$\sin x$、$\ln(1+x)$等函数展开成幂级数，并说明展开式在什么范围内成立。
prerequisites: [math.calculus.power-series, math.calculus.taylor-remainder]
minutes: 28
summary: |
  余项趋于$0$时泰勒级数收敛到$f$；$e^x$、$\sin x$处处成立，$\ln(1+x)$在$-1<x\le1$。
status: reviewed
---

## 这一节要回答的问题

[泰勒公式](lesson:math.calculus.taylor-polynomial)用:term[泰勒多项式]{id="math.calculus.taylor-polynomial"}（Taylor polynomial）$T_n(x)$近似$f(x)$，阶数越高，在$a$附近越准。让$n\to\infty$，$T_n(x)$就成了一个:term[幂级数]{id="math.calculus.power-series"}（power series）的:term[部分和]{id="math.calculus.partial-sum"}（partial sum）。这个:term[级数]{id="math.calculus.series"}（series）收敛吗，和是不是就是$f(x)$？对$e^x$、$\sin x$、$\ln(1+x)$，答案在哪些$x$处是肯定的？

## 讲解

### 泰勒级数

::anchor{id="def-taylor-series"}
设$f$在$a$附近任意阶:term[可导]{id="math.calculus.differentiable"}（differentiable），以$\frac{f^{(n)}(a)}{n!}$为系数的:term[幂级数]{id="math.calculus.power-series"}$\sum_{n=0}^\infty\frac{f^{(n)}(a)}{n!}(x-a)^n$叫作$f$在$a$处的:term[泰勒级数]{id="math.calculus.taylor-series"}（Taylor series），$a=0$时也叫:term[麦克劳林级数]{id="math.calculus.maclaurin-series"}（Maclaurin series）。

为什么这样定义：它的前$n+1$项之和正是$n$阶:term[泰勒多项式]{id="math.calculus.taylor-polynomial"}$T_n(x)$，泰勒级数就是把阶数越来越高的泰勒多项式排成一串。由:term[泰勒公式]{id="math.calculus.taylor-formula"}（Taylor's formula）$f(x)=T_n(x)+R_n(x)$，下面的定理随即可得。

::anchor{id="thm-taylor-series-sum"}
**定理**　在给定的$x$处，$f$的泰勒级数收敛到$f(x)$，当且仅当:term[余项]{id="math.calculus.remainder"}（remainder）$R_n(x)=f(x)-T_n(x)$在$n\to\infty$时趋于$0$。

道理：泰勒级数前$n+1$项的和是$T_n(x)=f(x)-R_n(x)$，它趋于$f(x)$和$R_n(x)\to0$是一回事。

为什么有用：要证展开式成立，就去估计余项；:term[收敛半径]{id="math.calculus.radius-of-convergence"}（radius of convergence）只说明:term[级数]{id="math.calculus.series"}收敛，不说明收敛到$f$。边界情况：$f(x)=e^{-1/x^2}$（$f(0)=0$）在$0$处各阶:term[导数]{id="math.calculus.derivative"}（derivative）都是$0$（这里不证，[泰勒公式](lesson:math.calculus.taylor-polynomial)第 8 题用过这件事），它的麦克劳林级数各项都是$0$，处处收敛，和却只在$x=0$处等于$f(x)$。

### $e^x$、$\sin x$、$\cos x$

::anchor{id="thm-exp-sin-cos-series"}
**定理**　对一切实数$x$，$e^x$、$\sin x$、$\cos x$都等于它们的:term[麦克劳林级数]{id="math.calculus.maclaurin-series"}。

$$
\begin{aligned}
e^x&=1+x+\frac{x^2}{2!}+\frac{x^3}{3!}+\cdots,\\
\sin x&=x-\frac{x^3}{3!}+\frac{x^5}{5!}-\cdots,\\
\cos x&=1-\frac{x^2}{2!}+\frac{x^4}{4!}-\cdots.
\end{aligned}
$$

道理：三个函数的各阶:term[导数]{id="math.calculus.derivative"}是$\pm e^x$、$\pm\sin x$、$\pm\cos x$，在$0$和$x$之间都不超过$e^{|x|}$。由:term[拉格朗日余项]{id="math.calculus.lagrange-remainder"}（Lagrange remainder）给出的误差估计，$|R_n(x)|\le e^{|x|}\frac{|x|^{n+1}}{(n+1)!}$；由[比值判别法与根值判别法](lesson:math.calculus.ratio-root-tests)的例 2，$\frac{|x|^{n+1}}{(n+1)!}\to0$，所以$R_n(x)\to0$。系数是$\frac{f^{(n)}(0)}{n!}$：$e^x$的各阶导数在$0$处都是$1$，$\sin x$的依次是$0,1,0,-1,\dots$，$\cos x$的依次是$1,0,-1,0,\dots$。

为什么有用：三个:term[级数]{id="math.calculus.series"}的:term[收敛半径]{id="math.calculus.radius-of-convergence"}都是$+\infty$，处处成立，许多地方直接拿它们来算这三个函数，甚至拿它们作定义。边界情况：处处收敛不等于处处好算，$e^{-20}$的级数各项先变大，最大的约有$4.3\times10^7$，再正负相消到约$2\times10^{-9}$，直接相加会损失精度；先算$e^{20}$再取倒数就好得多。

### $\ln(1+x)$

::anchor{id="thm-log-series"}
**定理**　$-1<x\le1$时，$\ln(1+x)=\sum_{n=1}^\infty\frac{(-1)^{n+1}x^n}n$，即$x-\frac{x^2}2+\frac{x^3}3-\cdots$。特别地，$\ln2=1-\frac12+\frac13-\cdots$。

道理：$t\ne-1$时，由等比数列的前$n$项和，

$$
\frac1{1+t}=1-t+t^2-\cdots+(-1)^{n-1}t^{n-1}+\frac{(-1)^nt^n}{1+t}.
$$

设$x>-1$，两边从$0$到$x$积分，

$$
\ln(1+x)=x-\frac{x^2}2+\cdots+\frac{(-1)^{n-1}x^n}n+(-1)^n\int_0^x\frac{t^n}{1+t}\,\dd t.
$$

前面$n$项正是$T_n(x)$，最后一项就是:term[余项]{id="math.calculus.remainder"}$R_n(x)$。$0\le x\le1$时:term[被积函数]{id="math.calculus.integrand"}（integrand）在$0$和$t^n$之间，由:term[保序性]{id="math.calculus.integral-monotonicity"}（monotonicity），$|R_n(x)|\le\int_0^xt^n\,\dd t=\frac{x^{n+1}}{n+1}\le\frac1{n+1}$；$-1<x<0$时，在$x$和$0$之间$1+t\ge1+x$，$|R_n(x)|\le\frac{|x|^{n+1}}{(n+1)(1+x)}$。两种情形下都有$R_n(x)\to0$。

为什么这样证：$\ln(1+x)$的:term[拉格朗日余项]{id="math.calculus.lagrange-remainder"}是$\frac{(-1)^nx^{n+1}}{(n+1)(1+\xi)^{n+1}}$，$-1<x<-\frac12$时$\bigl|\frac x{1+\xi}\bigr|$可能大于$1$，估计不出它趋于$0$；把余项写成积分，就绕开了这个困难。在$x=1$处两种写法给出同样的界$\frac1{n+1}$，:term[交错调和级数]{id="math.calculus.alternating-harmonic-series"}（alternating harmonic series）的和是$\ln2$由此得到。边界情况：展开式只在$-1<x\le1$成立，虽然$\ln(1+x)$对一切$x>-1$都有定义；$x>1$时:term[级数]{id="math.calculus.series"}的通项不趋于$0$，$x=-1$时它是:term[调和级数]{id="math.calculus.harmonic-series"}（harmonic series）的相反数，都发散。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-6, 6], y: [-3, 3] }
functions:
  - expr: "sin(x)"
    label: |
      $y=\sin x$
  - expr: "sum(k, 0, m, (-1)^k*x^(2*k + 1)/prod(j, 1, 2*k + 1, j))"
    label: |
      $\sin x$的麦克劳林多项式，到$x^{2m+1}$项
  - expr: "ln(1 + x)"
    label: |
      $y=\ln(1+x)$
  - expr: "sum(k, 1, m, (-1)^(k + 1)*x^k/k)"
    label: |
      $\ln(1+x)$的麦克劳林多项式，到$x^m$项
sliders:
  - name: m
    min: 1
    max: 15
    step: 1
    default: 3
    label: |
      $m$
:::

蓝线是$\sin x$，橙线是它的:term[麦克劳林多项式]{id="math.calculus.maclaurin-polynomial"}（Maclaurin polynomial）；绿线是$\ln(1+x)$，紫线是它的麦克劳林多项式。增大$m$：橙线贴住蓝线的范围越来越宽，要多宽有多宽，因为$\sin x$的展开式对一切$x$成立。紫线却只在$-1<x\le1$上贴近绿线，过了$x=1$，阶数越高离得越远；往左越靠近$x=-1$，贴近得越慢。

## 例题

### 例 1　算$\ln1.5$

用$\ln(1+x)$的展开式算$\ln1.5$，按上面的:term[余项]{id="math.calculus.remainder"}估计，取几项就能保证误差不超过$0.0005$？

**为什么想到这么做**：$x=0.5$在$-1<x\le1$里，展开式成立；$0\le x\le1$时:term[余项]{id="math.calculus.remainder"}不超过$\frac{x^{n+1}}{n+1}$。

**推导**：$x=0.5$时$|R_n|\le\frac{0.5^{n+1}}{n+1}$。$n=6$时这个界约是$0.0011$，不够；$n=7$时约是$0.00049$，够了。所以取前$7$项，$T_7(0.5)\approx0.40580$，而$\ln1.5\approx0.40547$，实际误差约$0.00034$。

### 例 2　算$e^{-1}$

用$e^x$的:term[级数]{id="math.calculus.series"}算$e^{-1}$，要误差不超过$0.0005$，加到哪一项为止？

**为什么想到这么做**：$x=-1$时级数$1-1+\frac1{2!}-\frac1{3!}+\cdots$正负相间，从第二项起各项的绝对值$\frac1{n!}$单调递减趋于$0$，可以用:term[交错级数判别法]{id="math.calculus.alternating-series-test"}（alternating series test）的误差估计：误差不超过第一个丢掉的项。

**推导**：$\frac1{n!}\le0.0005$即$n!\ge2000$，最小的是$n=7$，$7!=5040$。所以加到$\frac1{6!}$为止：$1-1+\frac12-\frac16+\frac1{24}-\frac1{120}+\frac1{720}\approx0.36806$，误差不超过$\frac1{5040}\approx0.0002$；实际上$e^{-1}\approx0.36788$。:term[拉格朗日余项]{id="math.calculus.lagrange-remainder"}给出同样的界：$\xi$在$-1$和$0$之间，$|R_6(-1)|\le\frac{e^\xi}{7!}<\frac1{5040}$。

## 常见误区

- 「$f$任意阶:term[可导]{id="math.calculus.differentiable"}，它的:term[泰勒级数]{id="math.calculus.taylor-series"}就收敛到$f$。」$e^{-1/x^2}$的:term[麦克劳林级数]{id="math.calculus.maclaurin-series"}处处收敛到$0$，不等于$f$；要证:term[余项]{id="math.calculus.remainder"}趋于$0$。
- 「$\ln(1+x)$的展开式对一切$x>-1$成立。」只在$-1<x\le1$成立；$x=2$时:term[级数]{id="math.calculus.series"}发散，虽然$\ln3$有定义。
- 「$\sin x$的展开式只在$0$附近好用。」它对一切$x$都成立；$x$很大时项数要多，可以先用周期性把$x$挪到$[-\pi,\pi]$里再算。

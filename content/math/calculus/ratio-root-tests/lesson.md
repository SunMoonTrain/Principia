---
id: math.calculus.ratio-root-tests
title: |
  比值判别法与根值判别法
goal: |
  会用比值判别法和根值判别法判断正项级数是否收敛。
prerequisites: [math.calculus.comparison-tests]
minutes: 25
summary: |
  相邻项之比或$n$次根趋于$\rho$：$\rho<1$收敛，$\rho>1$发散。
status: reviewed
---

## 这一节要回答的问题

$\sum\frac{n^2}{2^n}$、$\sum\frac{n!}{n^n}$这样的:term[级数]{id="math.calculus.series"}（series），通项里有指数、阶乘，和$\frac1{n^p}$比很难找出合适的不等式。:term[几何级数]{id="math.calculus.geometric-series"}（geometric series）$\sum q^n$的每一项都是前一项的$q$倍。一个级数的相邻两项之比如果最终接近某个小于$1$的数，它是不是就像几何级数那样收敛？

## 讲解

### 比值判别法

::anchor{id="thm-ratio-test"}
**定理（:term[比值判别法]{id="math.calculus.ratio-test"}，ratio test）**　设$a_n>0$，$\frac{a_{n+1}}{a_n}\to\rho$（$\rho$可以是$+\infty$）。$\rho<1$时$\sum a_n$收敛；$\rho>1$时$\sum a_n$发散；$\rho=1$时这个判别法不能下结论。

道理：$\rho<1$时取$q$使$\rho<q<1$，从某一项$N$起$\frac{a_{n+1}}{a_n}\le q$，即$a_{n+1}\le a_nq$，一项一项推下去，$n\ge N$时$a_n\le a_Nq^{n-N}$。右边是公比为$q$的:term[几何级数]{id="math.calculus.geometric-series"}的通项，由:term[比较判别法]{id="math.calculus.comparison-test"}（comparison test），$\sum a_n$收敛。$\rho>1$时从某一项起$a_{n+1}>a_n$，通项越来越大，不趋于$0$，:term[级数]{id="math.calculus.series"}发散。

为什么有用：通项里有阶乘、指数时，相邻两项之比往往能约掉一大片。$\sum\frac{n^2}{2^n}$的比值$\frac{(n+1)^2}{2n^2}\to\frac12$，收敛；$\sum\frac{n!}{10^n}$的比值$\frac{n+1}{10}\to+\infty$，发散。边界情况：$\rho=1$时什么都可能发生，$\sum\frac1n$和$\sum\frac1{n^2}$的比值都趋于$1$，前者发散，后者收敛。

### 根值判别法

::anchor{id="thm-root-test"}
**定理（:term[根值判别法]{id="math.calculus.root-test"}，root test）**　设$a_n\ge0$，$\sqrt[n]{a_n}\to\rho$（$\rho$可以是$+\infty$）。$\rho<1$时$\sum a_n$收敛；$\rho>1$时$\sum a_n$发散；$\rho=1$时这个判别法不能下结论。

道理：$\rho<1$时取$q$使$\rho<q<1$，从某一项起$\sqrt[n]{a_n}\le q$，即$a_n\le q^n$，和:term[几何级数]{id="math.calculus.geometric-series"}比较。$\rho>1$时从某一项起$\sqrt[n]{a_n}>1$，即$a_n>1$，通项不趋于$0$，:term[级数]{id="math.calculus.series"}发散。

为什么有用：通项是某个式子的$n$次方时，开$n$次方正好去掉指数。$\sum\Bigl(\frac n{2n+1}\Bigr)^n$的$\sqrt[n]{a_n}=\frac n{2n+1}\to\frac12$，收敛。边界情况：$\rho=1$时同样不能下结论，$\frac1n$和$\frac1{n^2}$开$n$次方都趋于$1$，因为$\sqrt[n]n\to1$，见下面。

### 两个判别法的关系

先看$\sqrt[n]n\to1$。$\sqrt[n]n=e^{\frac{\ln n}n}$；由$e^u\ge1+u$（[微分中值定理](lesson:math.calculus.mean-value-theorem)第 5 题）得$\ln y\le y-1$，取$y=\sqrt n$得$\ln n\le2\sqrt n$。所以$0<\frac{\ln n}n\le\frac2{\sqrt n}\to0$，由$e^x$的:term[连续性]{id="math.calculus.continuous"}（continuity），$\sqrt[n]n\to e^0=1$。

比值趋于$\rho$时，$\sqrt[n]{a_n}$也趋于$\rho$：$0<\rho<+\infty$的情形见第 5 题；$\rho=0$时只用那里的上界$a_n\le a_N\varepsilon^{n-N}$，$\rho=+\infty$时只用下界$a_n\ge a_NM^{n-N}$（$\varepsilon$任意小，$M$任意大），道理一样。所以能用:term[比值判别法]{id="math.calculus.ratio-test"}的地方，:term[根值判别法]{id="math.calculus.root-test"}也能用；比值好算，通常先试比值。反过来不成立：$a_n=2^{(-1)^n-n}$时，相邻两项之比在$\frac18$和$2$之间来回跳，不趋于任何数，而$\sqrt[n]{a_n}=2^{\frac{(-1)^n}n-1}\to\frac12$，由根值判别法，$\sum a_n$收敛。边界情况：两个判别法都靠和:term[几何级数]{id="math.calculus.geometric-series"}比较，通项像$\frac1{n^p}$那样衰减得比任何几何级数都慢时，比值、根值都趋于$1$，要回到[比较判别法与积分判别法](lesson:math.calculus.comparison-tests)。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 41], y: [0, 3.5] }
functions:
  - expr: "1 + 0*x"
    label: |
      $y=1$
  - expr: "r + 0*x"
    label: |
      $y=r$
sequences:
  - expr: "(n + 1)^2*r/n^2"
    n: [2, 40]
    label: |
      比值$\frac{a_{n+1}}{a_n}$
  - expr: "n^(2/n)*r"
    n: [2, 40]
    label: |
      根值$\sqrt[n]{a_n}$
sliders:
  - name: r
    min: 0.3
    max: 1.5
    step: 0.05
    default: 0.6
    label: |
      $a_n=n^2r^n$里的$r$
:::

:term[级数]{id="math.calculus.series"}是$\sum n^2r^n$，横轴是$n$（图上写作 x）。绿色的点是:term[比值判别法]{id="math.calculus.ratio-test"}看的$\frac{a_{n+1}}{a_n}=\bigl(1+\frac1n\bigr)^2r$，紫色的点是:term[根值判别法]{id="math.calculus.root-test"}看的$\sqrt[n]{a_n}=n^{2/n}r$，两串数都趋于橙色横线$y=r$，比值靠得快，根值靠得慢。拖动$r$：橙线在蓝线$y=1$下方时，两串点最终都落到蓝线下面，级数收敛；橙线在蓝线上方时发散。开头几个点在蓝线上方不要紧，判别法只看「最终」。

## 例题

### 例 1　阶乘和$n$次方

判断$\sum_{n=1}^\infty\frac{n!}{n^n}$和$\sum_{n=2}^\infty\Bigl(1-\frac1n\Bigr)^{n^2}$是否收敛。

**为什么想到这么做**：第一个有阶乘，相邻两项一比，阶乘约掉；第二个是$n$次方的$n$次方，开$n$次方去掉一层。两个都会碰到$\bigl(1+\frac1n\bigr)^n$，用:term[第二个重要极限]{id="math.calculus.second-special-limit"}（limit defining $e$）。

**推导**：第一个，

$$
\frac{a_{n+1}}{a_n}=\frac{(n+1)!}{(n+1)^{n+1}}\cdot\frac{n^n}{n!}=\Bigl(\frac n{n+1}\Bigr)^n=\frac1{\bigl(1+\frac1n\bigr)^n}\to\frac1e<1,
$$

由:term[比值判别法]{id="math.calculus.ratio-test"}收敛。第二个，

$$
\sqrt[n]{a_n}=\Bigl(1-\frac1n\Bigr)^n=\frac1{\bigl(1+\frac1{n-1}\bigr)^{n-1}\bigl(1+\frac1{n-1}\bigr)}\to\frac1e<1,
$$

由:term[根值判别法]{id="math.calculus.root-test"}收敛。

### 例 2　阶乘比指数长得快

证明对任何实数$x$，$\frac{x^n}{n!}\to0$。

**为什么想到这么做**：直接看$\frac{x^n}{n!}$不好估计。可只要$\sum\frac{|x|^n}{n!}$收敛，它的通项就趋于$0$，而这个:term[级数]{id="math.calculus.series"}正适合用:term[比值判别法]{id="math.calculus.ratio-test"}。

**推导**：$x=0$时显然。$x\ne0$时，$a_n=\frac{|x|^n}{n!}$，$\frac{a_{n+1}}{a_n}=\frac{|x|}{n+1}\to0<1$，所以$\sum a_n$收敛，通项$a_n\to0$，即$\Bigl|\frac{x^n}{n!}\Bigr|\to0$。比如$x=10$时，$\frac{10^n}{n!}$先增大到约$2756$（$n=9$、$10$时），以后才一路减小到$0$。

## 常见误区

- 「比值小于$1$，:term[级数]{id="math.calculus.series"}就收敛。」要比值的极限小于$1$：$\frac{n}{n+1}<1$，可$\sum\frac1n$的比值就是$\frac n{n+1}$，级数发散。
- 「比值的极限是$1$，级数发散。」$\rho=1$时不能下结论，$\sum\frac1{n^2}$的比值也趋于$1$，却收敛。
- 「:term[比值判别法]{id="math.calculus.ratio-test"}能处理所有的:term[正项级数]{id="math.calculus.nonnegative-series"}（series of nonnegative terms）。」比值要有极限，并且极限不是$1$；$\sum\frac1{n^p}$这类级数要用:term[比较判别法]{id="math.calculus.comparison-test"}或:term[积分判别法]{id="math.calculus.integral-test"}（integral test）。

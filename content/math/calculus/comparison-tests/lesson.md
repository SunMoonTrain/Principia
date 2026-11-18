---
id: math.calculus.comparison-tests
title: |
  比较判别法与积分判别法
goal: |
  会用比较判别法和积分判别法判断正项级数是否收敛。
prerequisites: [math.calculus.series, math.calculus.improper-integrals]
minutes: 28
summary: |
  正项级数和已知级数或积分比较；$\sum\frac1{n^p}$在$p>1$时收敛。
status: reviewed
---

## 这一节要回答的问题

$\sum\frac1{n^2}$收敛吗？$\sum\frac1{\sqrt n}$呢？$\sum\frac{2n+1}{n^3+n}$呢？

大多数:term[级数]{id="math.calculus.series"}（series）的:term[部分和]{id="math.calculus.partial-sum"}（partial sum）写不出简单的式子，没法像:term[几何级数]{id="math.calculus.geometric-series"}（geometric series）那样直接算出和。各项都不小于$0$时，能不能拿它和已经知道收敛或发散的级数比一比，或者和一个:term[反常积分]{id="math.calculus.improper-integral"}（improper integral）比一比，就判断出来？

## 讲解

### 正项级数

::anchor{id="def-nonnegative-series"}
各项都不小于$0$的:term[级数]{id="math.calculus.series"}$\sum a_n$（$a_n\ge0$）叫作:term[正项级数]{id="math.calculus.nonnegative-series"}（series of nonnegative terms）。

为什么单独讲：$a_n\ge0$时:term[部分和]{id="math.calculus.partial-sum"}$S_n$随$n$增大而增大，判断收敛只要看它有没有上界。边界情况：有正有负的级数，部分和有上界也不够，$1-1+1-\cdots$的部分和只取$0$和$1$，级数照样发散。

::anchor{id="thm-bounded-partial-sums"}
**定理**　正项级数收敛，当且仅当它的部分和有上界。

道理：$S_n$递增。有上界时，由:term[单调有界原理]{id="math.analysis.monotone-convergence-theorem"}（monotone convergence theorem，见[两个重要极限](lesson:math.calculus.special-limits)），数列$S_n$收敛，级数收敛；没有上界时，$S_n$越过任何数以后就一直待在它上面，趋于:term[无穷大]{id="math.calculus.infinity"}（infinity），级数发散。

### 比较判别法

::anchor{id="thm-comparison-test"}
**定理（:term[比较判别法]{id="math.calculus.comparison-test"}，comparison test）**　设从某一项起$0\le a_n\le b_n$。如果$\sum b_n$收敛，那么$\sum a_n$也收敛；如果$\sum a_n$发散，那么$\sum b_n$也发散。

道理：去掉前面有限项不影响收敛与否，不妨设处处$0\le a_n\le b_n$。$\sum a_n$的:term[部分和]{id="math.calculus.partial-sum"}不超过$\sum b_n$的部分和，后者不超过$\sum b_n$的和，所以有上界，由上面的定理，$\sum a_n$收敛。后一半是前一半的逆否命题（contrapositive）。

为什么有用：拿:term[几何级数]{id="math.calculus.geometric-series"}和:term[调和级数]{id="math.calculus.harmonic-series"}（harmonic series）作尺子量。$0<\frac1{2^n+1}<\frac1{2^n}$，$\sum\frac1{2^n}$收敛，所以$\sum\frac1{2^n+1}$收敛；$\frac1{\sqrt n}\ge\frac1n$，调和级数发散，所以$\sum\frac1{\sqrt n}$发散。边界情况：比收敛的大、比发散的小，都什么也推不出来，$\frac1{n^2}\le\frac1n$，可$\sum\frac1{n^2}$收敛，见下面。

### 积分判别法

::anchor{id="thm-integral-test"}
**定理（:term[积分判别法]{id="math.calculus.integral-test"}，integral test）**　设$f$在$[1,+\infty)$上:term[连续]{id="math.calculus.continuous"}（continuous）、为正、递减，$a_n=f(n)$。则$\sum a_n$和:term[反常积分]{id="math.calculus.improper-integral"}$\int_1^{+\infty}f(x)\,\dd x$同时收敛或同时发散。

道理：$f$递减，在$[n-1,n]$上$f(n)\le f(x)\le f(n-1)$，由:term[保序性]{id="math.calculus.integral-monotonicity"}（monotonicity），$a_n\le\int_{n-1}^nf(x)\,\dd x\le a_{n-1}$。把$n=2,\dots,N$加起来，得

$$
S_N-a_1\le\int_1^Nf(x)\,\dd x\le S_{N-1}.
$$

积分收敛时，$S_N\le a_1+\int_1^{+\infty}f(x)\,\dd x$，:term[部分和]{id="math.calculus.partial-sum"}有上界，:term[级数]{id="math.calculus.series"}收敛；积分发散时，$\int_1^Nf(x)\,\dd x$没有上界，$S_{N-1}$也没有，级数发散。

由[幂函数的反常积分](lesson:math.calculus.improper-integrals#thm-power-improper)，$\int_1^{+\infty}\frac{\dd x}{x^p}$在$p>1$时收敛、$p\le1$时发散，所以$\sum\frac1{n^p}$在$p>1$时收敛、$p\le1$时发散；$p=1$就是:term[调和级数]{id="math.calculus.harmonic-series"}。取$f=\frac1x$，上面的不等式还给出$\ln(N+1)\le S_N\le1+\ln N$：调和级数的部分和和$\ln N$差不多一样快地增长。边界情况：积分只决定收敛与否，不等于级数的和，$\sum_{n=1}^\infty\frac1{2^n}=1$，$\int_1^{+\infty}2^{-x}\,\dd x=\frac1{2\ln2}\approx0.72$。

### 比较判别法的极限形式

::anchor{id="thm-limit-comparison"}
**定理**　设$a_n>0$、$b_n>0$，并且$\frac{a_n}{b_n}\to L$，$0<L<+\infty$。则$\sum a_n$和$\sum b_n$同时收敛或同时发散。

道理：从某一项起$\frac L2<\frac{a_n}{b_n}<2L$，即$\frac L2b_n<a_n<2Lb_n$，用两次:term[比较判别法]{id="math.calculus.comparison-test"}。

为什么有用：不用找出具体的不等式，只看$n$很大时通项像哪个$\frac1{n^p}$。$\frac{n+1}{n^3+2}$像$\frac1{n^2}$，两者之比趋于$1$，所以$\sum\frac{n+1}{n^3+2}$收敛。边界情况：$L=0$或$L=+\infty$时只剩一个方向，比如$L=0$时，$\sum b_n$收敛才推得出$\sum a_n$收敛。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0.5, 12.5], y: [-0.1, 1.15] }
functions:
  - expr: "x^(-p) + 0*sqrt((x - 1)*(12 - x))"
    label: |
      $y=f(x)=\frac1{x^p}$
  - expr: "(-floor(-x))^(-p) + 0*sqrt((x - 1)*(12 - x))"
    label: |
      在曲线下方的长方形，高$a_2,a_3,\dots$
  - expr: "floor(x)^(-p) + 0*sqrt((x - 1)*(12 - x))"
    label: |
      在曲线上方的长方形，高$a_1,a_2,\dots$
sliders:
  - name: p
    min: 0.4
    max: 2.5
    step: 0.05
    default: 1
    label: |
      指数$p$
:::

蓝色曲线是$f(x)=\frac1{x^p}$。在$[n-1,n]$上，橙色台阶的高是右端点的值$a_n$，整个落在曲线下方；绿色台阶的高是左端点的值$a_{n-1}$，整个在曲线上方。所以从$1$到$N$，曲线下的面积夹在$a_2+\cdots+a_N$和$a_1+\cdots+a_{N-1}$之间：:term[级数]{id="math.calculus.series"}和积分要么都有限，要么都无限。拖动$p$：$p>1$时曲线贴着横轴降得快，台阶的总面积有限；$p\le1$时降得慢，面积越积越大。

## 例题

### 例 1　比调和级数还慢

判断$\sum_{n=2}^\infty\frac1{n\ln n}$和$\sum_{n=2}^\infty\frac1{n(\ln n)^2}$是否收敛。

**为什么想到这么做**：$n\ge3$时$\frac1{n\ln n}$比$\frac1n$小，$n$足够大时又比任何$\frac1{n^p}$（$p>1$）大，拿幂函数比较两头都推不出。可$f(x)=\frac1{x\ln x}$在$[2,+\infty)$上:term[连续]{id="math.calculus.continuous"}、为正、递减，它的:term[原函数]{id="math.calculus.antiderivative"}（antiderivative）能求导验证出来，用:term[积分判别法]{id="math.calculus.integral-test"}（下限从$2$开始，道理一样）。

**推导**：由:term[链式法则]{id="math.calculus.chain-rule"}（chain rule），$\bigl(\ln\ln x\bigr)'=\frac1{x\ln x}$，$\int_2^b\frac{\dd x}{x\ln x}=\ln\ln b-\ln\ln2$没有上界，所以第一个:term[级数]{id="math.calculus.series"}发散。$\Bigl(-\frac1{\ln x}\Bigr)'=\frac1{x(\ln x)^2}$，$\int_2^{+\infty}\frac{\dd x}{x(\ln x)^2}=\frac1{\ln2}$，收敛，所以第二个级数收敛。

### 例 2　看通项像什么

判断$\sum_{n=1}^\infty\frac{2n+1}{n^3+n}$和$\sum_{n=1}^\infty\sin\frac1n$是否收敛。

**为什么想到这么做**：$n$很大时，$\frac{2n+1}{n^3+n}$像$\frac2{n^2}$；$\sin\frac1n$像$\frac1n$，因为$\frac{\sin x}x\to1$。用:term[比较判别法]{id="math.calculus.comparison-test"}的极限形式，分别和$\frac1{n^2}$、$\frac1n$比。

**推导**：$\frac{2n+1}{n^3+n}\Big/\frac1{n^2}=\frac{2n^3+n^2}{n^3+n}\to2$，$\sum\frac1{n^2}$收敛，所以第一个:term[级数]{id="math.calculus.series"}收敛。$\sin\frac1n>0$，由:term[第一个重要极限]{id="math.calculus.first-special-limit"}（limit of $\frac{\sin x}{x}$），$\sin\frac1n\Big/\frac1n\to1$，:term[调和级数]{id="math.calculus.harmonic-series"}发散，所以$\sum\sin\frac1n$发散。

## 常见误区

- 「$a_n\le b_n$，$\sum b_n$发散，所以$\sum a_n$发散。」比发散的小推不出发散：$\frac1{n^2}\le\frac1n$，$\sum\frac1{n^2}$却收敛。
- 「:term[积分判别法]{id="math.calculus.integral-test"}算出的积分，就是:term[级数]{id="math.calculus.series"}的和。」两者一般不相等：$\sum_{n=1}^\infty\frac1{2^n}=1$，$\int_1^{+\infty}2^{-x}\,\dd x$约为$0.72$。积分只告诉我们收敛与否。
- 「:term[比较判别法]{id="math.calculus.comparison-test"}对有正有负的级数也能用。」$-1\le\frac1{n^2}$，$\sum\frac1{n^2}$收敛，可$\sum(-1)$发散；判别法要求$0\le a_n$。

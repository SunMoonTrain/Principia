---
id: math.analysis.parseval
title: |
  贝塞尔不等式与帕塞瓦尔等式
goal: |
  会把傅里叶系数看成正交展开的坐标，并用帕塞瓦尔等式求级数的和。
prerequisites: [math.analysis.fourier-convergence, math.linear-algebra.gram-schmidt]
minutes: 30
summary: |
  部分和是最佳平方逼近；系数平方和不超过$\frac1\pi\int f^2$，常常相等。
status: reviewed
---

## 这一节要回答的问题

[傅里叶级数](lesson:math.analysis.fourier-series)第 8 题把:term[三角函数系]{id="math.analysis.trig-system"}（trigonometric system）比作一组两两垂直的坐标轴，:term[傅里叶系数]{id="math.analysis.fourier-coefficients"}（Fourier coefficients）比作坐标。有限维空间里，向量长度的平方等于坐标的平方和，坐标还给出离子空间最近的点。对函数，这些还成立吗？顺带，能不能用它算出$\sum\frac{1}{n^4}$这样的:term[级数]{id="math.analysis.series"}（series）？

## 讲解

### 正交投影

[内积空间](lesson:math.linear-algebra.inner-product-spaces)里讲过函数的积分内积（inner product）。这里取$\langle f,g\rangle=\int_{-\pi}^{\pi}f(x)g(x)\dd x$，$\|f\|=\sqrt{\langle f,f\rangle}$。由[傅里叶级数](lesson:math.analysis.fourier-series#thm-orthogonality)的定理 1，$\frac{1}{\sqrt{2\pi}},\frac{\cos x}{\sqrt\pi},\frac{\sin x}{\sqrt\pi},\frac{\cos2x}{\sqrt\pi},\dots$两两正交，长度都是$1$，是一组正交规范（orthonormal）的函数。次数不超过$N$的三角多项式（trigonometric polynomial）组成一个$2N+1$维的子空间。

::anchor{id="thm-best-approximation"}
**定理 1**　设$f$在$[-\pi,\pi]$上:term[可积]{id="math.analysis.riemann-integral"}（Riemann integrable），$S_N$是它的:term[傅里叶级数]{id="math.analysis.fourier-series"}（Fourier series）的第$N$个:term[部分和]{id="math.analysis.partial-sum"}（partial sum）。对每个次数不超过$N$的三角多项式$T$，都有$\|f-T\|\ge\|f-S_N\|$，并且$\int_{-\pi}^{\pi}(f-S_N)^2\dd x=\int_{-\pi}^{\pi}f^2\dd x-\pi\bigl(\frac{a_0^2}{2}+\sum_{n=1}^N(a_n^2+b_n^2)\bigr)$。

**证明**：由:term[傅里叶系数]{id="math.analysis.fourier-coefficients"}的定义和[傅里叶级数](lesson:math.analysis.fourier-series#thm-trig-polynomial)的定理 2，$k\le N$时$\langle S_N,\cos kx\rangle=\pi a_k=\langle f,\cos kx\rangle$，所以$\langle f-S_N,\cos kx\rangle=0$；$\sin kx$同理。于是$f-S_N$和每个次数不超过$N$的三角多项式正交，特别是和$S_N-T$、$S_N$正交。由勾股定理（Pythagorean theorem），$\|f-T\|^2=\|f-S_N\|^2+\|S_N-T\|^2\ge\|f-S_N\|^2$，$\|f\|^2=\|f-S_N\|^2+\|S_N\|^2$。最后由正交性，$\|S_N\|^2=\pi\bigl(\frac{a_0^2}{2}+\sum_{n=1}^N(a_n^2+b_n^2)\bigr)$。

为什么想到这么做：这正是[正交补与正交投影](lesson:math.linear-algebra.orthogonal-projection)里的正交投影（orthogonal projection）：$S_N$是$f$在这个子空间上的投影，误差$f-S_N$垂直于子空间。所以傅里叶部分和是平方平均意义下最好的三角多项式逼近，系数不用一起调整，每个系数各算各的。

### 贝塞尔不等式

::anchor{id="thm-bessel"}
**定理 2**　设$f$在$[-\pi,\pi]$上:term[可积]{id="math.analysis.riemann-integral"}，则$\frac{a_0^2}{2}+\sum_{n=1}^\infty(a_n^2+b_n^2)$:term[收敛]{id="math.analysis.convergent-series"}（convergent series），并且$\frac{a_0^2}{2}+\sum_{n=1}^\infty(a_n^2+b_n^2)\le\frac1\pi\int_{-\pi}^{\pi}f(x)^2\dd x$。这叫作:term[贝塞尔不等式]{id="math.analysis.bessel-inequality"}（Bessel's inequality）。

**证明**：由定理 1，$\int(f-S_N)^2\ge0$，所以每个:term[部分和]{id="math.analysis.partial-sum"}$\sigma_N=\frac{a_0^2}{2}+\sum_{n=1}^N(a_n^2+b_n^2)$都不超过$\frac1\pi\int f^2$。这个:term[级数]{id="math.analysis.series"}的项都非负，$\sigma_N$单调递增、有:term[上界]{id="math.analysis.upper-bound"}（upper bound），由:term[确界原理]{id="math.analysis.supremum-principle"}（least-upper-bound property），$\{\sigma_N\}$有:term[上确界]{id="math.analysis.supremum"}（supremum，sup）$\sigma\le\frac1\pi\int f^2$。任给$\varepsilon>0$，有某个$\sigma_M>\sigma-\varepsilon$；$\sigma_N$单调递增，所以$N\ge M$时$\sigma-\varepsilon<\sigma_N\le\sigma$，级数收敛于$\sigma$。

推论：级数收敛，项趋于$0$，所以$a_n\to0$、$b_n\to0$。在几何上，这是说$f$在各个坐标轴上的投影的长度平方加起来，不超过$f$本身的长度平方。

### 帕塞瓦尔等式

::anchor{id="def-mean-square"}
若$\int_{-\pi}^{\pi}\bigl(f(x)-S_N(x)\bigr)^2\dd x\to0$（$N\to\infty$），就说$f$的:term[傅里叶级数]{id="math.analysis.fourier-series"}:term[平方平均收敛]{id="math.analysis.mean-square-convergence"}（convergence in mean square）于$f$。

为什么这样定义：这是用长度$\|f-S_N\|$来量误差，正是定理 1 里最小化的量。它不在乎个别点：$f$在有限个点上取什么值，都不影响$\int(f-S_N)^2$。边界情况：所以平方平均收敛的极限只能确定到「除去有限个点」为止；方波的:term[级数]{id="math.analysis.series"}在跳跃点:term[收敛]{id="math.analysis.convergent-series"}到中点，旁边还有:term[吉布斯现象]{id="math.analysis.gibbs-phenomenon"}（Gibbs phenomenon），却仍然平方平均收敛（第 8 题）。

::anchor{id="thm-parseval"}
**定理 3**　设$f$在$[-\pi,\pi]$上:term[可积]{id="math.analysis.riemann-integral"}。(1) $f$的傅里叶级数平方平均收敛于$f$，当且仅当$\frac{a_0^2}{2}+\sum_{n=1}^\infty(a_n^2+b_n^2)=\frac1\pi\int_{-\pi}^{\pi}f(x)^2\dd x$。这个等式叫作:term[帕塞瓦尔等式]{id="math.analysis.parseval-identity"}（Parseval's identity）。

::anchor{id="thm-parseval-continuous"}
(2) 设$f$以$2\pi$为周期、:term[连续]{id="math.analysis.continuous-function"}（continuous），并且在$[-\pi,\pi]$上:term[分段光滑]{id="math.analysis.piecewise-smooth"}（piecewise smooth），则$f$满足帕塞瓦尔等式。

**证明**：(1) 由定理 1，$\int(f-S_N)^2$等于$\int f^2$减去$\pi$乘以左边级数的:term[部分和]{id="math.analysis.partial-sum"}，它趋于$0$当且仅当部分和趋于$\frac1\pi\int f^2$。(2) 由[傅里叶级数的收敛](lesson:math.analysis.fourier-convergence#thm-fourier-uniform)的定理 2，$S_N$:term[一致收敛]{id="math.analysis.uniform-convergence"}（uniform convergence）于$f$：任给$\varepsilon>0$，$N$足够大时$|f(x)-S_N(x)|<\varepsilon$对所有$x$成立，于是$\int(f-S_N)^2\le2\pi\varepsilon^2$。所以级数平方平均收敛，由 (1)，等式成立。

为什么想到这么做：(1) 说的是勾股定理能不能推到无穷维：长度平方等于所有坐标的平方和，当且仅当坐标轴「够用」，部分和能把$f$逼近到误差为$0$。(2) 用一致收敛给出平方平均收敛，是最省事的一条路。事实上，帕塞瓦尔等式对每个可积函数都成立，第 8 题给出了证明的思路；第 7 题说明，这和:term[三角函数系]{id="math.analysis.trig-system"}「够用」有关。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-3.14159, 3.14159], y: [-1, 10.5] }
functions:
  - expr: "x^2"
    label: |
      $f(x)=x^2$
  - expr: "pi^2/3 + 4 * sum(k, 1, N, (-1)^k * cos(k*x) / k^2)"
    label: |
      部分和$S_N$
  - expr: "(x^2 - pi^2/3 - 4 * sum(k, 1, N, (-1)^k * cos(k*x) / k^2))^2"
    label: |
      误差的平方$(f-S_N)^2$
sliders:
  - name: N
    min: 1
    max: 10
    step: 1
    default: 1
    label: |
      $N$
:::

这是例 1 的$f(x)=x^2$和它的:term[部分和]{id="math.analysis.partial-sum"}。第三条曲线是误差的平方，它和横轴之间的面积就是定理 1 里的$\int(f-S_N)^2$。拖动$N$：这块面积越来越小，由定理 3，它趋于$0$，系数的平方和也就补足了$\frac1\pi\int f^2$。

## 例题

### 例 1　$\sum\frac{1}{n^4}$

用$f(x)=x^2$（$-\pi\le x\le\pi$）的:term[帕塞瓦尔等式]{id="math.analysis.parseval-identity"}求$\sum_{n=1}^\infty\frac{1}{n^4}$。

**为什么想到这么做**：$x^2$的:term[傅里叶系数]{id="math.analysis.fourier-coefficients"}是$\frac{1}{n^2}$量级，平方以后正好是$\frac{1}{n^4}$；而$\frac1\pi\int x^4\dd x$容易算。$x^2$延拓后:term[连续]{id="math.analysis.continuous-function"}、:term[分段光滑]{id="math.analysis.piecewise-smooth"}，定理 3 (2) 保证等式成立。

**推导**：$x^2$是偶函数，$a_0=\frac1\pi\int_{-\pi}^{\pi}x^2\dd x=\frac{2\pi^2}{3}$；分部积分两次得$a_n=\frac2\pi\int_0^\pi x^2\cos nx\dd x=\frac{4(-1)^n}{n^2}$，$b_n=0$。又$\frac1\pi\int_{-\pi}^{\pi}x^4\dd x=\frac{2\pi^4}{5}$。由帕塞瓦尔等式，$\frac12\Bigl(\frac{2\pi^2}{3}\Bigr)^2+\sum_{n=1}^\infty\frac{16}{n^4}=\frac{2\pi^4}{5}$，即$16\sum\frac{1}{n^4}=\frac{2\pi^4}{5}-\frac{2\pi^4}{9}=\frac{8\pi^4}{45}$，所以$\sum_{n=1}^\infty\frac{1}{n^4}=\frac{\pi^4}{90}$。

### 例 2　贝塞尔不等式给出的估计

设$f$在$[-\pi,\pi]$上:term[可积]{id="math.analysis.riemann-integral"}，$|f|\le1$。证明$|a_n|$、$|b_n|$都不超过$\sqrt2$，并且$\sum_{n=1}^\infty(a_n^2+b_n^2)\le2$。

**为什么想到这么做**：:term[贝塞尔不等式]{id="math.analysis.bessel-inequality"}把所有系数的平方和压在$\frac1\pi\int f^2$下面，而$|f|\le1$时这个积分很容易估计。

**推导**：$\frac1\pi\int_{-\pi}^{\pi}f^2\dd x\le\frac1\pi\cdot2\pi=2$。由贝塞尔不等式，$\sum_{n=1}^\infty(a_n^2+b_n^2)\le2$，其中每一项$a_n^2$、$b_n^2$也都不超过$2$。直接估计积分只能得到$|a_n|\le\frac1\pi\int|f|\le2$，贝塞尔不等式给出的界更好，而且管住了所有系数的平方和。

## 常见误区

- 「:term[贝塞尔不等式]{id="math.analysis.bessel-inequality"}总是取等号。」对:term[三角函数系]{id="math.analysis.trig-system"}，:term[可积]{id="math.analysis.riemann-integral"}函数都取等号（第 8 题）；可要是从三角函数系里去掉一个函数，比如$\cos x$，再对$f=\cos x$用贝塞尔不等式，左边是$0$，右边是$1$（第 7 题）。
- 「:term[平方平均收敛]{id="math.analysis.mean-square-convergence"}就是:term[逐点收敛]{id="math.analysis.pointwise-convergence"}（pointwise convergence）。」不对：平方平均收敛不管个别点，方波的:term[级数]{id="math.analysis.series"}在跳跃点并不:term[收敛]{id="math.analysis.convergent-series"}到$f$在那里的值，平方平均收敛却照样成立（第 8 题）。
- 「最佳逼近要把所有系数一起调。」正交性使得每个系数各管各的：多加一项，前面的系数不用改（定理 1）。

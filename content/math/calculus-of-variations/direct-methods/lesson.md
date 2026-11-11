---
id: math.calculus-of-variations.direct-methods
title: |
  直接方法与里茨近似
goal: |
  会用里茨方法在有限维函数空间里近似求解变分问题，并知道极小值不一定能取到。
prerequisites: [math.calculus-of-variations.euler-lagrange, math.linear-algebra.linear-systems, math.analysis.subsequences]
minutes: 30
summary: |
  极小值不一定取得到；里茨方法用有限个基函数求近似，给出上界。
status: reviewed
---

## 这一节要回答的问题

推导:term[欧拉-拉格朗日方程]{id="math.calculus-of-variations.euler-lagrange-equation"}（Euler–Lagrange equation）时，先假定极小值点存在，再找它满足的条件。可是极小值不一定取得到（[第一变分与欧拉-拉格朗日方程](lesson:math.calculus-of-variations.euler-lagrange)的 p6 就是一例），方程也常常解不出来。能不能直接对:term[泛函]{id="math.calculus-of-variations.functional"}（functional）下手，既判断极小值在不在，又把它近似地算出来？

## 讲解

### 极小化序列

设:term[泛函]{id="math.calculus-of-variations.functional"}$J$在:term[容许函数]{id="math.calculus-of-variations.admissible-function"}（admissible function）中有下界，它的下确界（infimum）记作$m$。按下确界的定义（见[实数的完备性](lesson:math.analysis.completeness)），对每个正整数$k$，都有容许函数$y_k$使$m\le J[y_k]<m+\frac1k$。

::anchor{id="def-minimizing-sequence"}
使$J[y_k]\to m$的一列容许函数$y_1,y_2,\dots$，叫作$J$的:term[极小化序列]{id="math.calculus-of-variations.minimizing-sequence"}（minimizing sequence）。

为什么这样定义：它总是存在的（上面就造出了一个），不需要事先知道极小值点在不在；如果有极小值点$y^*$，常数序列$y_k=y^*$就是一个。反过来，极小化序列不一定收敛，收敛了，极限也不一定是极小值点（例 2）。边界情况：$J$没有下界时$m=-\infty$，谈不上极小值，下面都假定$J$有下界。

### 直接方法

::anchor{id="def-direct-method"}
不经过:term[欧拉-拉格朗日方程]{id="math.calculus-of-variations.euler-lagrange-equation"}，而是从:term[极小化序列]{id="math.calculus-of-variations.minimizing-sequence"}出发，证明极小值点存在或者把它近似算出来，这类办法叫作:term[直接方法]{id="math.calculus-of-variations.direct-method"}（direct method）。

为什么这样定义：一元函数的最小值也可以这样找。闭区间上的连续函数$f$，取$f(x_k)\to\inf f$的$x_k$，由致密性定理（Bolzano–Weierstrass theorem）它有收敛的子列（subsequence）$x_{k_j}\to x^*$（见[子列与致密性定理](lesson:math.analysis.subsequences)），再由连续性$f(x^*)=\inf f$，最小值取到了。边界情况：在函数中照搬这三步——取极小化序列、挑收敛的子列、说明极限是:term[容许函数]{id="math.calculus-of-variations.admissible-function"}并且$J$在那里不比$m$大——后两步都可能失败。

失败的方式有两种。一是极限不是容许函数：[第一变分与欧拉-拉格朗日方程](lesson:math.calculus-of-variations.euler-lagrange)的 p6 里，$\frac{\arctan kx}{\arctan k}$组成极小化序列，它趋向一个在$x=0$处跳跃的函数，不连续，更谈不上有连续的导数。二是$J$在极限处「跳上去」：例 2 的锯齿函数（zigzag function）趋于$0$，可$J$在$0$处的值远大于$m$。

什么时候能成功？可以证明，如果被积函数$F(x,y,p)$对$p$是凸（convex）的，即$F_{pp}\ge0$，并且$|p|$大时$F$增长得足够快，那么在适当放宽的函数类里极小值点存在。这是希尔伯特（David Hilbert）等人在 20 世纪初为了给:term[狄利克雷原理]{id="math.calculus-of-variations.dirichlet-principle"}（Dirichlet principle）打下基础而发展的理论，要用到泛函分析（functional analysis），这里不展开。例 2 的被积函数$(p^2-1)^2+y^2$在$p=0$附近不是凸的，极小值点就不存在。

### 里茨方法

:term[直接方法]{id="math.calculus-of-variations.direct-method"}的第一步可以具体地做：在一族便于计算的函数里求$J$的最小值。取一个满足边界条件的$y_0$，和若干个在两端为零的基函数（basis function）$\varphi_1,\dots,\varphi_N$，只在$y=y_0+c_1\varphi_1+\dots+c_N\varphi_N$这样的函数中比较。这时$J$成了$N$个数$c_1,\dots,c_N$的函数，令它对各个$c_i$的偏导数（partial derivative）为零，就得到最小值点满足的方程。

::anchor{id="def-ritz-method"}
在形如$y_0+\sum_{i=1}^Nc_i\varphi_i$的函数中求$J$的最小值，用它近似原来的问题，这种办法叫作:term[里茨方法]{id="math.calculus-of-variations.ritz-method"}（Ritz method）。

为什么这样定义：在更小的范围里求最小值，结果不会更小，所以里茨方法给出的$J$值是$m$的上界；每加一个基函数，范围变大，上界只降不升。基函数选得合适（例如多项式或正弦函数，个数越来越多时能任意逼近:term[容许函数]{id="math.calculus-of-variations.admissible-function"}），里茨方法的最小值点就组成一个:term[极小化序列]{id="math.calculus-of-variations.minimizing-sequence"}。边界情况：下确界取不到时，里茨方法的$J$值照样降向$m$，但近似函数不会收敛到极小值点，因为根本没有极小值点。

最常用的是二次:term[泛函]{id="math.calculus-of-variations.functional"}$J[y]=\int_a^b\bigl(p\,y'^2+q\,y^2-2fy\bigr)\dd x$，$p$、$q$、$f$是给定的函数。两端都为零时取$y_0=0$，$J$是$c_i$的二次函数，令偏导数为零得到线性方程组（system of linear equations）

$$
\sum_{j=1}^NA_{ij}c_j=b_i ,\qquad A_{ij}=\int_a^b\bigl(p\,\varphi_i'\varphi_j'+q\,\varphi_i\varphi_j\bigr)\dd x ,\quad b_i=\int_a^bf\varphi_i\,\dd x .
$$

$A$是对称的（$A_{ij}=A_{ji}$），$p>0$、$q\ge0$时方程组有唯一解（p6）。这样，解微分方程（differential equation）的问题变成了解线性方程组，后者可以交给计算机。[瑞利商与特征值的变分刻画](lesson:math.calculus-of-variations.rayleigh-quotient)里用:term[试探函数]{id="math.calculus-of-variations.trial-function"}（trial function）估计特征值（eigenvalue），也是在一族函数里求最小值，得到的同样是上界。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 1], y: [-0.005, 0.07] }
functions:
  - expr: "x - sinh(x)/sinh(1)"
    label: |
      精确解$x-\frac{\sinh x}{\sinh1}$
  - expr: "sum(k, 1, N, 2*(-1)^(k+1)/(k*pi*(k^2*pi^2+1))*sin(k*pi*x))"
    label: |
      里茨近似$\sum_{k=1}^Nc_k\sin k\pi x$
sliders:
  - name: N
    min: 1
    max: 6
    step: 1
    default: 1
    label: |
      基函数的个数$N$
:::

第一幅图是例 1 的:term[泛函]{id="math.calculus-of-variations.functional"}用正弦函数$\sin k\pi x$（$k=1,\dots,N$）作基函数的:term[里茨方法]{id="math.calculus-of-variations.ritz-method"}。这些正弦函数在$[0,1]$上两两正交（orthogonal），即$i\ne j$时$\int_0^1\sin i\pi x\,\sin j\pi x\,\dd x=0$，它们的导数也一样，所以方程组是对角的，系数可以直接写出：$c_k=\frac{2(-1)^{k+1}}{k\pi(k^2\pi^2+1)}$。$N=1$时近似曲线左右对称，精确解的最高点却偏右；$N$增大，两条曲线很快就分不清了。

:::anim{component="function-plot"}
range: { x: [0, 1], y: [-0.05, 0.55] }
functions:
  - expr: "1/(2*m) - abs(mod(x, 1/m) - 1/(2*m))"
    label: |
      锯齿函数$y_m$
sliders:
  - name: m
    min: 1
    max: 10
    step: 1
    default: 2
    label: |
      齿数$m$
:::

第二幅图是例 2 的锯齿函数$y_m$（尖角没有磨圆）：斜率在$1$和$-1$之间来回切换，共$m$个齿，高$\frac1{2m}$。$m$越大，$y_m$越贴近$0$，$J[y_m]$越接近下确界$0$；可是极限$0$的$J$值是$1$。

## 例题

### 例 1　一项里茨近似

用:term[里茨方法]{id="math.calculus-of-variations.ritz-method"}求$J[y]=\int_0^1\bigl(y'^2+y^2-2xy\bigr)\dd x$、$y(0)=y(1)=0$的近似极小值点，基函数只取$\varphi_1=x(1-x)$，并和精确解比较。

**为什么想到这么做**：这是二次:term[泛函]{id="math.calculus-of-variations.functional"}，$p=q=1$、$f=x$，只有一个基函数时方程组只有一个方程$A_{11}c_1=b_1$。它的:term[欧拉-拉格朗日方程]{id="math.calculus-of-variations.euler-lagrange-equation"}$-y''+y=x$有用双曲函数（hyperbolic function）$\sinh x=\frac{e^x-e^{-x}}{2}$写出的精确解，正好用来检验。

**推导**：$A_{11}=\int_0^1\bigl((1-2x)^2+x^2(1-x)^2\bigr)\dd x=\frac13+\frac1{30}=\frac{11}{30}$，$b_1=\int_0^1x^2(1-x)\,\dd x=\frac1{12}$，所以$c_1=\frac{5}{22}$，近似解是$\frac{5}{22}x(1-x)$。代回去，$J$的近似最小值是$-\frac{b_1^2}{A_{11}}=-\frac{5}{264}\approx-0.01894$。可以验证$y=x-\frac{\sinh x}{\sinh1}$满足方程和边界条件，它在$x=\frac12$处约是$0.05659$，近似解是$\frac5{88}\approx0.05682$；精确的最小值是$\coth1-\frac43\approx-0.02030$，比近似值小，和「里茨方法给出上界」一致。

### 例 2　取不到的下确界

$J[y]=\int_0^1\bigl((y'^2-1)^2+y^2\bigr)\dd x$，$y(0)=y(1)=0$。证明$J$的下确界是$0$，但没有:term[容许函数]{id="math.calculus-of-variations.admissible-function"}取到它。

**为什么想到这么做**：$J\ge0$。要让$J$小，第一项要求$y'$接近$\pm1$，第二项要求$y$接近$0$，两个要求互相拉扯；用许多很小的锯齿来兼顾。

**推导**：取第二幅图里的锯齿函数$y_m$，把尖角磨圆一点使导数连续。第一项只在磨圆的小段上不为零，可以任意小；第二项$\int_0^1y_m^2\,\dd x=\frac{1}{12m^2}$。所以$J[y_m]\to0$，$y_m$是:term[极小化序列]{id="math.calculus-of-variations.minimizing-sequence"}，下确界是$0$。如果某个容许函数使$J[y]=0$，连续、非负的被积函数只能处处为零，于是$y\equiv0$、$y'^2\equiv1$，矛盾；所以下确界取不到。

这一列函数的最大值$\frac1{2m}\to0$，它们趋于$0$，可$J[0]=1$：$J$在极限处「跳了上去」，:term[直接方法]{id="math.calculus-of-variations.direct-method"}的第三步失败了。原因在被积函数：$(p^2-1)^2$在$p=0$附近不是凸的，平均地取$p=\pm1$反而更好，这和[第二变分与勒让德条件](lesson:math.calculus-of-variations.second-variation)的例 2 是同一个现象。

## 常见误区

- 「:term[泛函]{id="math.calculus-of-variations.functional"}有下界，极小值就一定取得到。」有下界只保证有下确界；例 2 的下确界取不到。
- 「:term[极小化序列]{id="math.calculus-of-variations.minimizing-sequence"}收敛了，极限就是极小值点。」例 2 的锯齿函数趋于$0$，$J[0]=1$却比下确界$0$大得多。
- 「基函数越多，:term[里茨方法]{id="math.calculus-of-variations.ritz-method"}算出的近似函数一定越接近极小值点。」$J$值只降不升，但函数本身不一定收敛：例 2 根本没有极小值点；有极小值点时，还要基函数选得合适。
- 「里茨方法只能用多项式作基函数。」任何在两端为零、积分算得出来的函数都行，几何图像里用的是正弦函数。

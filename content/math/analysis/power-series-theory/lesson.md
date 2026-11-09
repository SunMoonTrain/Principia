---
id: math.analysis.power-series-theory
title: |
  幂级数的收敛理论
goal: |
  会用上极限求收敛半径（柯西-阿达马公式），并证明幂级数在收敛区间内可以逐项求导和逐项积分。
prerequisites: [math.analysis.function-series, math.analysis.uniform-limit-theorems, math.analysis.limsup-liminf, math.calculus.power-series-calculus]
minutes: 30
summary: |
  收敛半径用上极限算；收敛区间内的幂级数能逐项求导和积分。
status: reviewed
---

## 这一节要回答的问题

微积分里，:term[幂级数]{id="math.analysis.power-series"}（power series）$\sum a_nx^n$有一个:term[收敛半径]{id="math.analysis.radius-of-convergence"}（radius of convergence）$R$：$|x|<R$时它是:term[收敛级数]{id="math.analysis.convergent-series"}（convergent series），$|x|>R$时是:term[发散级数]{id="math.analysis.divergent-series"}（divergent series）。求$R$常用比值$\bigl|\frac{a_n}{a_{n+1}}\bigr|$的:term[极限]{id="math.analysis.sequence-limit"}（limit of a sequence，lim）；在$(-R,R)$里，还可以逐项求导、逐项积分。

可比值不一定有极限，这时$R$怎么求？无穷多项的和求导，为什么能分到每一项上去？

## 讲解

### 收敛半径

$\sum x^n$在$|x|<1$时:term[收敛]{id="math.analysis.convergent-series"}，$|x|\ge1$时:term[发散]{id="math.analysis.divergent-series"}；$\sum\frac{x^n}{n!}$对所有$x$收敛；$\sum n!\,x^n$只在$x=0$处收敛。三个例子里，收敛的点都组成一个以$0$为中心的区间（可能只有一点，也可能是整条直线），这不是巧合。

::anchor{id="def-power-series"}
形如$\sum_{n=0}^\infty a_n(x-x_0)^n$的:term[函数项级数]{id="math.analysis.function-series"}（series of functions）叫作以$x_0$为中心的:term[幂级数]{id="math.analysis.power-series"}。换元$t=x-x_0$就化成$x_0=0$的情形，下面只看$\sum_{n=0}^\infty a_nx^n$。

为什么研究它：幂级数是「无穷次的多项式」，泰勒级数（Taylor series）都是幂级数，$e^x$、$\sin x$、$\ln(1+x)$都能写成幂级数的和。边界情况：$\sum n!\,x^n$只在$x=0$处收敛，这样的幂级数除了中心，什么也定义不了。

::anchor{id="thm-abel-lemma"}
**引理**　若$x_1\ne0$，并且$\{a_nx_1^n\}$是:term[有界数列]{id="math.analysis.bounded-sequence"}（bounded sequence），比如$\sum a_nx_1^n$收敛，则$|x|<|x_1|$时$\sum a_nx^n$:term[绝对收敛]{id="math.analysis.absolute-convergence"}（absolute convergence）。这叫作阿贝尔引理（Abel's lemma）。

**证明**：设$|a_nx_1^n|\le K$。$|x|<|x_1|$时记$q=\bigl|\frac{x}{x_1}\bigr|<1$，则$|a_nx^n|=|a_nx_1^n|\,q^n\le Kq^n$。等比级数（geometric series）$\sum Kq^n$收敛，由:term[比较判别法]{id="math.analysis.comparison-test"}（comparison test），$\sum a_nx^n$绝对收敛。

::anchor{id="def-radius"}
记$E$为使$\sum a_nx^n$收敛的$x$组成的集合，$R=\sup\{|x|:x\in E\}$（$E$里的$|x|$没有:term[上界]{id="math.analysis.upper-bound"}（upper bound）时记$R=+\infty$），$R$叫作幂级数的:term[收敛半径]{id="math.analysis.radius-of-convergence"}，$(-R,R)$叫作收敛区间（interval of convergence）。

为什么这样定义：由阿贝尔引理，$|x|<R$时，有$x_1\in E$使$|x|<|x_1|$，于是$\sum a_nx^n$绝对收敛；$|x|>R$时$x\notin E$，:term[级数]{id="math.analysis.series"}（series）发散。所以收敛的点确实组成以$0$为中心的区间，$R$就是它的半径。边界情况：端点$x=\pm R$处什么都可能发生，$\sum\frac{x^n}{n}$的收敛半径是$1$，在两个端点处的情形就不一样（见几何图像）。

### 柯西-阿达马公式

:term[收敛半径]{id="math.analysis.radius-of-convergence"}的定义说清了$R$是什么，可没说怎么算。根值判别法（root test）看$\sqrt[n]{|a_nx^n|}=\sqrt[n]{|a_n|}\,|x|$：它最终压在某个小于$1$的数以下就:term[收敛]{id="math.analysis.convergent-series"}，无穷多次大于$1$就:term[发散]{id="math.analysis.divergent-series"}。$\sqrt[n]{|a_n|}$不一定有:term[极限]{id="math.analysis.sequence-limit"}，:term[上极限]{id="math.analysis.limit-superior"}（limit superior，lim sup）却总有，[上极限与下极限](lesson:math.analysis.limsup-liminf)第 8 题已经预告过答案。

::anchor{id="thm-cauchy-hadamard"}
**定理 1**　记$\rho=\limsup_{n\to\infty}\sqrt[n]{|a_n|}$，则:term[收敛半径]{id="math.analysis.radius-of-convergence"}$R=\frac1\rho$；这里约定$\rho=0$时$R=+\infty$，$\rho=+\infty$时$R=0$。这叫作:term[柯西-阿达马公式]{id="math.analysis.cauchy-hadamard-formula"}（Cauchy-Hadamard formula）。

**证明**：设$\rho<+\infty$，这时$\{\sqrt[n]{|a_n|}\}$有:term[上界]{id="math.analysis.upper-bound"}，也就:term[有界]{id="math.analysis.bounded-sequence"}。任取$x\ne0$满足$\rho|x|<1$，取$q$使$\rho|x|<q<1$，再取$\varepsilon>0$使$(\rho+\varepsilon)|x|\le q$。由[上极限与下极限](lesson:math.analysis.limsup-liminf)的定理 1，大于$\rho+\varepsilon$的$\sqrt[n]{|a_n|}$只有有限个，所以$n$足够大时$|a_nx^n|\le\bigl((\rho+\varepsilon)|x|\bigr)^n\le q^n$，由:term[比较判别法]{id="math.analysis.comparison-test"}，:term[级数]{id="math.analysis.series"}:term[绝对收敛]{id="math.analysis.absolute-convergence"}。

再设$x$满足$\rho|x|>1$（$\rho=+\infty$时取任意$x\ne0$）。若$\{\sqrt[n]{|a_n|}\}$有界，由同一个定理 1，取$\varepsilon>0$使$(\rho-\varepsilon)|x|>1$，大于$\rho-\varepsilon$的项有无穷多个；若无界，大于$\frac{1}{|x|}$的项也有无穷多个。两种情况下，都有无穷多个$n$使$|a_nx^n|>1$，项不趋于$0$，级数发散。所以$R=\frac1\rho$。

为什么想到这么做：要和等比级数比，就看$|a_nx^n|$开$n$次方以后，最终能不能压到某个$q<1$以下。压不压得住，取决于$\sqrt[n]{|a_n|}$最终能无穷多次达到多高，这正是上极限。比值算法是它的特殊情形：$\bigl|\frac{a_{n+1}}{a_n}\bigr|$有极限$L$时，$\sqrt[n]{|a_n|}$也趋于$L$（第 5 题）。

### 逐项求导与逐项积分

:term[幂级数]{id="math.analysis.power-series"}在收敛区间上不一定:term[一致收敛]{id="math.analysis.uniform-convergence"}（uniform convergence）：$\sum x^n$在$(-1,1)$上就不一致收敛。可在每个闭子区间上它是一致收敛的，而:term[连续]{id="math.analysis.continuous-function"}（continuous）、:term[可导]{id="math.analysis.differentiable-function"}（differentiable）这些事只和一点附近有关，这就够了。

::anchor{id="def-locally-uniform"}
设:term[函数项级数]{id="math.analysis.function-series"}在区间$I$里的每个闭区间$[c,d]\subset I$上都一致收敛，就说它在$I$上:term[内闭一致收敛]{id="math.analysis.locally-uniform-convergence"}（uniform convergence on compact subsets）。

为什么这样定义：一致收敛要一个$N$管住整个$I$，内闭一致收敛只要求管住每个闭子区间，$N$可以随子区间变（[逐点收敛与一致收敛](lesson:math.analysis.uniform-convergence)第 8 题）。开区间$I$里每一点都在某个闭子区间的内部，所以连续、可导这些只看一点附近的性质，用内闭一致收敛就能推出来。反例：$\sum x^n$在$(-1,1)$上内闭一致收敛，却不一致收敛。

::anchor{id="thm-power-series-uniform"}
**定理 2**　设$\sum a_nx^n$的:term[收敛半径]{id="math.analysis.radius-of-convergence"}$R>0$，则它在$(-R,R)$上:term[内闭一致收敛]{id="math.analysis.locally-uniform-convergence"}，和函数$S$在$(-R,R)$上:term[连续]{id="math.analysis.continuous-function"}（continuous）。

**证明**：任取闭区间$[c,d]\subset(-R,R)$，记$r=\max\{|c|,|d|\}<R$。$x\in[c,d]$时$|a_nx^n|\le|a_n|r^n$，而$r<R$，$\sum a_nr^n$:term[绝对收敛]{id="math.analysis.absolute-convergence"}，由:term[魏尔斯特拉斯判别法]{id="math.analysis.weierstrass-m-test"}（Weierstrass M-test），:term[级数]{id="math.analysis.series"}在$[c,d]$上一致收敛。:term[部分和]{id="math.analysis.partial-sum"}（partial sum）都是多项式，连续，由[一致收敛与极限交换](lesson:math.analysis.uniform-limit-theorems)的定理 1，$S$在$[c,d]$上连续；$(-R,R)$里每一点都在某个这样的$[c,d]$的内部，所以$S$在$(-R,R)$上连续。

::anchor{id="thm-termwise"}
**定理 3**　设$\sum a_nx^n$的收敛半径$R>0$，和函数为$S$。则 (1) 逐项求导得到的$\sum_{n=1}^\infty na_nx^{n-1}$、逐项积分得到的$\sum_{n=0}^\infty\frac{a_n}{n+1}x^{n+1}$，收敛半径都是$R$；(2) $S$在$(-R,R)$上:term[可导]{id="math.analysis.differentiable-function"}（differentiable），$S'(x)=\sum_{n=1}^\infty na_nx^{n-1}$；(3) $|x|<R$时，$\int_0^xS(t)\dd t=\sum_{n=0}^\infty\frac{a_n}{n+1}x^{n+1}$。

**证明**：(1) 设$|x|<r<R$。$\sum a_nr^n$:term[收敛]{id="math.analysis.convergent-series"}，项:term[有界]{id="math.analysis.bounded-sequence"}，设$|a_nr^n|\le K$；记$s=\frac{|x|}{r}<1$，则$|na_nx^{n-1}|=\frac nr|a_nr^n|s^{n-1}\le\frac Kr\,ns^{n-1}$。由比值判别法（ratio test），$\sum ns^{n-1}$收敛，所以$\sum na_nx^{n-1}$绝对收敛，逐项求导得到的级数，收敛半径不小于$R$。

若它的收敛半径大于$R$，取$|x|>R$并且小于它的收敛半径，它在$x$处绝对收敛；而$n\ge1$时$|a_nx^n|\le|x|\,|na_nx^{n-1}|$，于是$\sum a_nx^n$在$x$处也绝对收敛，和$|x|>R$矛盾。所以收敛半径恰好是$R$。逐项积分得到的级数，逐项求导正好回到$\sum a_nx^n$，由刚才的结论，两者收敛半径相同。

(2) 任取$x_0\in(-R,R)$，再取$r$使$|x_0|<r<R$。在$[-r,r]$上，部分和$S_N(x)=\sum_{n=0}^Na_nx^n$是多项式，导函数连续；由 (1) 和定理 2，导函数$\sum_{n=1}^Nna_nx^{n-1}$在$[-r,r]$上一致收敛，$S_N(-r)$也收敛。由[一致收敛与极限交换](lesson:math.analysis.uniform-limit-theorems)的定理 3，$S$在$[-r,r]$上可导，导数是$\sum na_nx^{n-1}$，在$x_0$处当然也是。

(3) 在以$0$和$x$为端点的闭区间上，部分和一致收敛于$S$（定理 2）。由[一致收敛与极限交换](lesson:math.analysis.uniform-limit-theorems)的定理 2，积分和极限可以交换：$\int_0^xS=\lim_{N\to\infty}\sum_{n=0}^N\int_0^xa_nt^n\dd t=\sum_{n=0}^\infty\frac{a_n}{n+1}x^{n+1}$。

为什么想到这么做：逐项求导以后收敛半径不变，所以在$(-R,R)$的每个闭子区间上，导函数的级数也能用魏尔斯特拉斯判别法，一致收敛，正好满足求导和极限交换的条件。反复用 (2)，$S$在$(-R,R)$上任意阶可导，并且$a_n=\frac{S^{(n)}(0)}{n!}$：幂级数就是它的和函数的泰勒级数。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-1, 0.75], y: [-13, 17] }
functions:
  - expr: "1 / (1 - x)^2"
    label: |
      $y=\frac{1}{(1-x)^2}$
  - expr: "(1 - (k + 1) * x^k + k * x^(k + 1)) / (1 - x)^2"
    label: |
      部分和$y=1+2x+\cdots+kx^{k-1}$
sliders:
  - name: k
    min: 1
    max: 24
    step: 1
    default: 6
    label: |
      项数$k$
:::

$\sum_{n=0}^\infty x^n=\frac{1}{1-x}$（$|x|<1$），逐项求导得$\sum_{n=1}^\infty nx^{n-1}$，定理 3 说它的和是$\bigl(\frac{1}{1-x}\bigr)'=\frac{1}{(1-x)^2}$。图里是这个:term[级数]{id="math.analysis.series"}的前$k$项之和与$\frac{1}{(1-x)^2}$。在每个$[-r,r]$（$r<1$）上，$k$大了两条曲线就重合，这是:term[内闭一致收敛]{id="math.analysis.locally-uniform-convergence"}；越靠近$x=\pm1$，要的$k$越大，在$x=-1$处:term[部分和]{id="math.analysis.partial-sum"}来回跳，越跳越远，级数:term[发散]{id="math.analysis.divergent-series"}。

![左：例 1 的系数开 n 次方以后在 1 和 2 之间跳，上极限是 2，收敛半径是 1/2；右：Σ xⁿ/n 的收敛半径是 1，|x| 小于 1 时绝对收敛，大于 1 时发散，两个端点情形不同](radius.svg)

左边是例 1 的$\sqrt[n]{|a_n|}$，在$1$和$2$之间跳，:term[上极限]{id="math.analysis.limit-superior"}是$2$，所以$R=\frac12$；比值$\frac{a_{n+1}}{a_n}$也没有:term[极限]{id="math.analysis.sequence-limit"}，比值算法用不上。右边是$\sum\frac{x^n}{n}$：:term[收敛半径]{id="math.analysis.radius-of-convergence"}是$1$，$|x|<1$时:term[绝对收敛]{id="math.analysis.absolute-convergence"}，$|x|>1$时发散；$x=-1$处是交错级数（alternating series），:term[条件收敛]{id="math.analysis.conditional-convergence"}（conditional convergence），$x=1$处是调和级数（harmonic series），发散，端点要单独判断。

## 例题

### 例 1　比值没有极限时求收敛半径

设$n$为偶数时$a_n=2^n$，$n$为奇数时$a_n=1$。求$\sum a_nx^n$的:term[收敛半径]{id="math.analysis.radius-of-convergence"}。

**为什么想到这么做**：比值$\frac{a_{n+1}}{a_n}$在$2^{-n}$和$2^{n+1}$之间跳，没有:term[极限]{id="math.analysis.sequence-limit"}，比值算法用不上；开$n$次方以后只有两个值，正好用:term[柯西-阿达马公式]{id="math.analysis.cauchy-hadamard-formula"}。

**推导**：$\sqrt[n]{|a_n|}$在$n$为偶数时是$2$，为奇数时是$1$。任给$\varepsilon>0$，大于$2+\varepsilon$的项一个也没有，大于$2-\varepsilon$的项有无穷多个（所有偶数项），所以:term[上极限]{id="math.analysis.limit-superior"}是$2$，$R=\frac12$。

直接核对：$|x|<\frac12$时，偶数项$|2x|^n$、奇数项$|x|^n$都不超过公比小于$1$的等比级数的项，:term[级数]{id="math.analysis.series"}:term[绝对收敛]{id="math.analysis.absolute-convergence"}；$|x|>\frac12$时，偶数项$|a_nx^n|=|2x|^n>1$，项不趋于$0$，级数:term[发散]{id="math.analysis.divergent-series"}。

### 例 2　$\sum\frac{x^n}{n}$的和函数

求$\sum_{n=1}^\infty\frac{x^n}{n}$在$(-1,1)$上的和函数。

**为什么想到这么做**：逐项求导后是$\sum x^{n-1}=\frac{1}{1-x}$，这是已知的；定理 3 保证和函数的导数就是它，再用「导数相同的函数只差一个常数」。

**推导**：$\sqrt[n]{\frac1n}\to1$（见[数列的极限](lesson:math.analysis.sequences-limits)第 5 题），由:term[柯西-阿达马公式]{id="math.analysis.cauchy-hadamard-formula"}，:term[收敛半径]{id="math.analysis.radius-of-convergence"}是$1$。记和函数为$S$，由定理 3，$|x|<1$时$S'(x)=\sum_{n=1}^\infty x^{n-1}=\frac{1}{1-x}$。

令$g(x)=S(x)+\ln(1-x)$，则$g'(x)=\frac{1}{1-x}-\frac{1}{1-x}=0$，$g(0)=0$。由[中值定理的证明](lesson:math.analysis.mean-value-proofs)的例 1，$g$在$(-1,1)$上恒为$0$，所以$S(x)=-\ln(1-x)$。

$x=-1$处:term[级数]{id="math.analysis.series"}也:term[收敛]{id="math.analysis.convergent-series"}（交错级数），它的和是不是$-\ln2$？定理 3 只管开区间，端点要用阿贝尔定理（Abel's theorem），见第 7 题。

## 常见误区

- 「:term[收敛半径]{id="math.analysis.radius-of-convergence"}就是$\lim\bigl|\frac{a_n}{a_{n+1}}\bigr|$。」不对：这个:term[极限]{id="math.analysis.sequence-limit"}不一定存在（例 1）；存在时才等于$R$（第 5 题）。
- 「:term[幂级数]{id="math.analysis.power-series"}在收敛区间上:term[一致收敛]{id="math.analysis.uniform-convergence"}。」不对：$\sum x^n$在$(-1,1)$上只:term[内闭一致收敛]{id="math.analysis.locally-uniform-convergence"}（定理 2）。
- 「端点处的:term[收敛]{id="math.analysis.convergent-series"}情况和区间里一样。」不对：$\sum\frac{x^n}{n}$在两个端点处的情形就不同（几何图像）。端点要单独判断。
- 「逐项求导不改变收敛的范围。」收敛半径不变，端点处却可能变：$\sum\frac{x^n}{n^2}$在$x=1$处收敛，逐项求导以后在$x=1$处:term[发散]{id="math.analysis.divergent-series"}（第 6 题）。

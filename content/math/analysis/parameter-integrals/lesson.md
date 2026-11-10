---
id: math.analysis.parameter-integrals
title: |
  含参变量积分
goal: |
  会判断什么时候可以在积分号下求导、交换两个积分的次序，并用它算出$\int_0^{\infty}x^2e^{-ax^2}\dd x$这类积分。
prerequisites: [math.analysis.uniform-limit-theorems, math.vector-calculus.partial-derivatives, math.vector-calculus.polar-double-integrals]
minutes: 30
summary: |
  被积函数及其偏导数连续时，可以在积分号下求导、交换积分次序。
status: reviewed
---

## 这一节要回答的问题

由[极坐标下的二重积分](lesson:math.vector-calculus.polar-double-integrals)里的$\int_{-\infty}^{\infty}e^{-x^2}\dd x=\sqrt\pi$，换元就得到$\int_0^\infty e^{-ax^2}\dd x=\frac12\sqrt{\frac{\pi}{a}}$（$a>0$）。两边对$a$求导，如果左边能把求导搬进积分号里，就得到$\int_0^\infty x^2e^{-ax^2}\dd x=\frac{\sqrt\pi}{4}a^{-3/2}$，一个新积分不费力地算了出来。

可求导和积分都是取极限，交换它们需要理由；交换两个积分的次序也一样。什么条件下可以这样做？

## 讲解

### 含参变量积分

$\int_0^1x^y\dd x=\frac{1}{y+1}$（$y>-1$），$\int_0^\pi\sin(xy)\dd x$，$\int_0^\infty e^{-ax^2}\dd x$：积分号里除了积分变量，还有一个可以变动的量，积分的结果是这个量的函数。

::anchor{id="def-parameter-integral"}
设$f(x,y)$在矩形$[a,b]\times[c,d]$上有定义，并且对每个$y\in[c,d]$，$f(x,y)$作为$x$的函数在$[a,b]$上:term[可积]{id="math.analysis.riemann-integral"}（Riemann integrable）。函数$F(y)=\int_a^bf(x,y)\dd x$（$c\le y\le d$）叫作:term[含参变量积分]{id="math.analysis.parameter-integral"}（integral depending on a parameter），$y$叫作参变量（parameter）。积分区间是无穷区间、积分是反常积分（improper integral）时，也这样叫。

为什么这样定义：很多函数本来就是由积分给出的，比如下一节的:term[伽马函数]{id="math.analysis.gamma-function"}（gamma function）；要研究它们，就得知道$F$什么时候:term[连续]{id="math.analysis.continuous-function"}（continuous）、:term[可导]{id="math.analysis.differentiable-function"}（differentiable）、可积。

边界情况：$f$对每个变量分别连续还不够。令$x>0$时$f(x,y)=\frac{y}{x^2}e^{-y/x}$，$f(0,y)=0$，则对每个$y\ge0$，它作为$x$的函数在$[0,1]$上连续，作为$y$的函数也连续。可换元$u=\frac yx$得$y>0$时$F(y)=\int_0^1f(x,y)\dd x=\int_y^\infty e^{-u}\dd u=e^{-y}$，而$F(0)=0$，$F$在$0$处不连续；毛病出在$(0,0)$附近：$f(x,x)=\frac{1}{ex}\to+\infty$，$f$在那里不是二元连续的。

### 连续性

下面总假定$f$在闭矩形$R=[a,b]\times[c,d]$上:term[连续]{id="math.analysis.continuous-function"}，即作为二元函数连续（见[多元函数的极限与连续](lesson:math.vector-calculus.multivariable-limits)）。

::anchor{id="thm-uniform-continuity-2d"}
**引理**　设$f$在闭矩形$R$上连续，则$f$在$R$上:term[一致连续]{id="math.analysis.uniform-continuity"}（uniform continuity）：任给$\varepsilon>0$，有$\delta>0$，使$R$里满足$|x-x'|<\delta$、$|y-y'|<\delta$的任意两点，都有$|f(x,y)-f(x',y')|<\varepsilon$。

**证明**：照[一致连续](lesson:math.analysis.uniform-continuity#thm-heine-cantor)里:term[康托尔定理]{id="math.analysis.heine-cantor-theorem"}（Heine-Cantor theorem）的证明。若不然，有$\varepsilon_0>0$和$R$里的两列点$P_n=(x_n,y_n)$、$Q_n=(x_n',y_n')$，对应坐标之差都小于$\frac1n$，而$|f(P_n)-f(Q_n)|\ge\varepsilon_0$。由:term[致密性定理]{id="math.analysis.bolzano-weierstrass"}（Bolzano-Weierstrass theorem），$\{x_n\}$有:term[收敛]{id="math.analysis.convergent-sequence"}（convergent sequence）的:term[子列]{id="math.analysis.subsequence"}（subsequence），在这个子列里$\{y_n\}$又有收敛的子列，于是$P_{n_k}$趋于某个$P\in R$，$Q_{n_k}$也趋于$P$。由$f$在$P$处连续，$f(P_{n_k})-f(Q_{n_k})\to0$，矛盾。

::anchor{id="thm-parameter-continuous"}
**定理 1**　设$f$在$R$上连续，则$F(y)=\int_a^bf(x,y)\dd x$在$[c,d]$上连续。

**证明**：任给$\varepsilon>0$，取引理里的$\delta$。$|y-y_0|<\delta$时，对每个$x$都有$|f(x,y)-f(x,y_0)|<\varepsilon$，所以$|F(y)-F(y_0)|\le\int_a^b|f(x,y)-f(x,y_0)|\dd x\le(b-a)\varepsilon$。

为什么想到这么做：$F(y)-F(y_0)$是$f(x,y)-f(x,y_0)$的积分，只要后者对所有$x$同时很小，积分就小。「对所有$x$同时」正是一致连续给的，边界情况里的例子在$(0,0)$附近就做不到。

### 积分号下求导

::anchor{id="thm-leibniz-rule"}
**定理 2**　设$f$和偏导数（partial derivative）$\frac{\partial f}{\partial y}$都在$R$上:term[连续]{id="math.analysis.continuous-function"}，则$F(y)=\int_a^bf(x,y)\dd x$在$[c,d]$上:term[可导]{id="math.analysis.differentiable-function"}（differentiable），并且$F'(y)=\int_a^b\frac{\partial f}{\partial y}(x,y)\dd x$。这叫作:term[积分号下求导]{id="math.analysis.differentiation-under-integral"}（differentiation under the integral sign）。

**证明**：任给$\varepsilon>0$，对$\frac{\partial f}{\partial y}$取引理里的$\delta$。设$0<|h|<\delta$，$y$、$y+h\in[c,d]$；对每个$x$，由:term[拉格朗日中值定理]{id="math.analysis.mean-value-theorem"}（mean value theorem），有介于$y$和$y+h$之间的$\eta$，使$\frac{f(x,y+h)-f(x,y)}{h}=\frac{\partial f}{\partial y}(x,\eta)$，它和$\frac{\partial f}{\partial y}(x,y)$相差小于$\varepsilon$。对$x$积分，得$\Bigl|\frac{F(y+h)-F(y)}{h}-\int_a^b\frac{\partial f}{\partial y}(x,y)\dd x\Bigr|\le(b-a)\varepsilon$。

为什么想到这么做：差商$\frac{F(y+h)-F(y)}{h}$是$\frac{f(x,y+h)-f(x,y)}{h}$对$x$的积分。中值定理把被积函数换成偏导数在附近某点的值，:term[一致连续]{id="math.analysis.uniform-continuity"}保证它对所有$x$同时接近$\frac{\partial f}{\partial y}(x,y)$（几何图像）。由定理 1，这样得到的$F'$还是连续的。

### 交换积分次序

::anchor{id="thm-fubini-rectangle"}
**定理 3**　设$f$在$R$上:term[连续]{id="math.analysis.continuous-function"}，则$\int_c^d\Bigl(\int_a^bf(x,y)\dd x\Bigr)\dd y=\int_a^b\Bigl(\int_c^df(x,y)\dd y\Bigr)\dd x$。

**证明**：对$t\in[c,d]$，令$g(x,t)=\int_c^tf(x,y)\dd y$，$\varphi(t)=\int_c^t\Bigl(\int_a^bf(x,y)\dd x\Bigr)\dd y$，$\psi(t)=\int_a^bg(x,t)\dd x$。由定理 1，内层积分是$y$的连续函数，由:term[微积分基本定理]{id="math.analysis.fundamental-theorem-of-calculus"}（fundamental theorem of calculus），$\varphi'(t)=\int_a^bf(x,t)\dd x$。$g$在$R$上连续（理由见下段），$\frac{\partial g}{\partial t}=f(x,t)$也连续，由定理 2，$\psi'(t)=\int_a^bf(x,t)\dd x$。$\varphi'=\psi'$，$\varphi(c)=\psi(c)=0$，所以$\varphi(d)=\psi(d)$，这就是要证的等式。

$g$的连续性：记$M$为$|f|$在$R$上的最大值，则$|g(x,t)-g(x_0,t_0)|\le\int_c^d|f(x,y)-f(x_0,y)|\dd y+M|t-t_0|$。由引理，$|x-x_0|<\delta$时第一项不超过$(d-c)\varepsilon$，所以$(x,t)\to(x_0,t_0)$时右边趋于$0$。

为什么想到这么做：两边都看成右端点的函数，比较导数，导数相同、起点相同的两个函数相等。[二重积分](lesson:math.vector-calculus.double-integrals)把二重积分（double integral）化成累次积分（iterated integral）时，默认了两种次序结果一样；这里对矩形上的连续函数补上了证明。$f$不连续时，两种次序可能不一样（第 4 题）。

### 无穷区间

无穷区间上的:term[含参变量积分]{id="math.analysis.parameter-integral"}$F(y)=\int_a^\infty f(x,y)\dd x$，是$F_n(y)=\int_a^nf(x,y)\dd x$当$n\to\infty$时的:term[极限]{id="math.analysis.sequence-limit"}（limit of a sequence，lim）。定理 1、2 用在每个$F_n$上，再用[一致收敛与极限交换](lesson:math.analysis.uniform-limit-theorems)里的定理把极限搬过去；要的是:term[一致收敛]{id="math.analysis.uniform-convergence"}（uniform convergence），下面用一个积分收敛的函数$g$把尾巴一起压住。

::anchor{id="thm-leibniz-improper"}
**定理 4**　设$f$和$\frac{\partial f}{\partial y}$在$[a,+\infty)\times[c,d]$上:term[连续]{id="math.analysis.continuous-function"}，对每个$y\in[c,d]$，$\int_a^\infty f(x,y)\dd x$收敛；又有$[a,+\infty)$上的连续函数$g$，使$\bigl|\frac{\partial f}{\partial y}(x,y)\bigr|\le g(x)$，并且$\int_a^\infty g(x)\dd x$收敛。则$F(y)=\int_a^\infty f(x,y)\dd x$在$[c,d]$上:term[可导]{id="math.analysis.differentiable-function"}，$F'(y)=\int_a^\infty\frac{\partial f}{\partial y}(x,y)\dd x$。

**证明**：对整数$n>a$，令$F_n(y)=\int_a^nf(x,y)\dd x$。由定理 2 和定理 1，$F_n'(y)=\int_a^n\frac{\partial f}{\partial y}(x,y)\dd x$，它是连续函数。由反常积分的比较判别法（comparison test），$G(y)=\int_a^\infty\frac{\partial f}{\partial y}(x,y)\dd x$收敛，并且$|G(y)-F_n'(y)|\le\int_n^\infty g(x)\dd x$，右边与$y$无关、趋于$0$，所以$F_n'$在$[c,d]$上一致收敛于$G$。又$F_n(y)\to F(y)$，由[一致收敛与极限交换](lesson:math.analysis.uniform-limit-theorems#thm-derivative-interchange)的定理 3，$F$可导，$F'=G$。

为什么想到这么做：无穷区间切成有限段，有限段上用定理 2；剩下的尾巴$\int_n^\infty$，不论$y$是多少都被同一个$\int_n^\infty g$压住，这就是一致收敛。没有这样的$g$时，结论可能不对（第 7 题）。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 4], y: [-0.85, 0.1] }
functions:
  - expr: "-x^2 * exp(-x^2)"
    label: |
      偏导数$y=\frac{\partial f}{\partial y}(x,1)=-x^2e^{-x^2}$
  - expr: "(exp(-(1 + h) * x^2) - exp(-x^2)) / h"
    label: |
      差商$y=\frac{f(x,1+h)-f(x,1)}{h}$
sliders:
  - name: h
    min: -0.9
    max: 1.9
    step: 0.2
    default: 0.9
    label: |
      增量$h$
:::

这是定理 2 证明里的那一步，取$f(x,y)=e^{-yx^2}$、$y=1$。拖动$h$：差商是$x$的函数，$h\to0$时它在整个$[0,+\infty)$上一起贴向偏导数，最大的差距也随$h$趋于$0$，这就是:term[一致收敛]{id="math.analysis.uniform-convergence"}。:term[积分号下求导]{id="math.analysis.differentiation-under-integral"}，靠的正是这一点。

## 例题

### 例 1　用交换积分次序算积分

设$0<a<b$，求$\int_0^1\frac{x^b-x^a}{\ln x}\dd x$。

**为什么想到这么做**：被积函数的原函数写不出来。可$\frac{x^b-x^a}{\ln x}$恰好是$x^y$对$y$从$a$到$b$的积分，写成二重积分以后换个次序，内层就好积了。

**推导**：对$0<x<1$，$\int_a^bx^y\dd y=\Bigl[\frac{x^y}{\ln x}\Bigr]_{y=a}^{y=b}=\frac{x^b-x^a}{\ln x}$。令$0<x\le1$时$f(x,y)=x^y$，$f(0,y)=0$；因为$x^y\le x^a\to0$（$x\to0^+$），$f$在$[0,1]\times[a,b]$上:term[连续]{id="math.analysis.continuous-function"}。由定理 3，

$$\int_0^1\frac{x^b-x^a}{\ln x}\dd x=\int_0^1\Bigl(\int_a^bx^y\dd y\Bigr)\dd x=\int_a^b\Bigl(\int_0^1x^y\dd x\Bigr)\dd y=\int_a^b\frac{\dd y}{y+1}=\ln\frac{b+1}{a+1}.$$

$x\to0^+$、$x\to1^-$时被积函数分别趋于$0$和$b-a$，在两端补上这两个值以后连续，左边是普通的积分。

### 例 2　$\int_0^\infty x^2e^{-ax^2}\dd x$

设$a>0$，求$\int_0^\infty x^2e^{-ax^2}\dd x$。

**为什么想到这么做**：$x^2e^{-ax^2}$正是$e^{-ax^2}$对$a$求偏导再变号，而$\int_0^\infty e^{-ax^2}\dd x$已知。只要定理 4 的条件成立，对$a$求导就行。

**推导**：取$0<c<a<d$，在$[0,+\infty)\times[c,d]$上令$f(x,y)=e^{-yx^2}$，则$\frac{\partial f}{\partial y}=-x^2e^{-yx^2}$，$\bigl|\frac{\partial f}{\partial y}\bigr|\le x^2e^{-cx^2}=g(x)$。$x^4e^{-cx^2}$:term[有界]{id="math.analysis.bounded-function"}（bounded function），设不超过$K$，则$x\ge1$时$g(x)\le\frac{K}{x^2}$，所以$\int_0^\infty g$收敛。由定理 4，$F(y)=\int_0^\infty e^{-yx^2}\dd x=\frac{\sqrt\pi}{2}y^{-1/2}$:term[可导]{id="math.analysis.differentiable-function"}，并且

$$\int_0^\infty x^2e^{-ax^2}\dd x=-F'(a)=\frac{\sqrt\pi}{4}a^{-3/2}.$$

## 常见误区

- 「被积函数对每个变量分别:term[连续]{id="math.analysis.continuous-function"}，:term[含参变量积分]{id="math.analysis.parameter-integral"}就连续。」不对：讲解里的边界情况就是反例，要的是二元连续（定理 1）。
- 「积分号下总能求导。」有限区间上要$\frac{\partial f}{\partial y}$连续（定理 2）；无穷区间上还要一个积分收敛的$g$压住偏导数（定理 4），不然连$F$本身都可能不连续（第 7 题）。
- 「交换两个积分的次序不改变结果。」被积函数在闭矩形上连续时才有定理 3 的保证；在角上无界的函数，两种次序可以得到不同的值（第 4 题）。

---
id: math.calculus.taylor-polynomial
title: |
  泰勒公式
goal: |
  会写出函数在一点的泰勒多项式，知道它和函数只差一个比$(x-a)^n$高阶的无穷小。
prerequisites: [math.calculus.lhopital, math.calculus.higher-derivatives, math.calculus.infinitesimal-orders]
minutes: 28
summary: |
  $T_n(x)=\sum_{k=0}^n\frac{f^{(k)}(a)}{k!}(x-a)^k$，$f(x)=T_n(x)+o\bigl((x-a)^n\bigr)$。
status: reviewed
---

## 这一节要回答的问题

$y=x$、$y=1$分别是$y=\sin x$、$y=\cos x$在$0$处的:term[切线]{id="math.calculus.tangent-line"}（tangent line），所以$x$很小时$\sin x\approx x$，$\cos x\approx1$。想要更准，能不能改用二次、三次的多项式？多项式的系数怎样选，误差又有多小？

## 讲解

### 泰勒多项式

$f$在$a$处的:term[切线]{id="math.calculus.tangent-line"}$y=f(a)+f'(a)(x-a)$和$f$在$a$处的值、斜率都相同。再加一项$c(x-a)^2$，让:term[二阶导数]{id="math.calculus.second-derivative"}（second derivative）也相同：这个多项式在$a$处的二阶导数是$2c$，所以取$c=\frac{f''(a)}2$。$\cos x$在$0$处这样做，得到$1-\frac{x^2}2$，比$1$准得多。照这个办法让前$n$阶导数都相同，系数就是$\frac{f^{(k)}(a)}{k!}$（见[高阶导数](lesson:math.calculus.higher-derivatives)第 8 题）。

::anchor{id="def-taylor-polynomial"}
设$f$在$a$处$n$阶可导。多项式$T_n(x)=\sum_{k=0}^n\frac{f^{(k)}(a)}{k!}(x-a)^k$叫作$f$在$a$处的$n$阶:term[泰勒多项式]{id="math.calculus.taylor-polynomial"}（Taylor polynomial）；$a=0$时，也叫:term[麦克劳林多项式]{id="math.calculus.maclaurin-polynomial"}（Maclaurin polynomial）。

写开就是

$$
T_n(x)=f(a)+f'(a)(x-a)+\frac{f''(a)}{2!}(x-a)^2+\cdots+\frac{f^{(n)}(a)}{n!}(x-a)^n.
$$

为什么这样定义：$T_n$在$a$处的值和前$n$阶:term[导数]{id="math.calculus.derivative"}（derivative）都和$f$的一样，次数不超过$n$的多项式里只有它做得到。$n=1$时它就是切线。边界情况：$f$要在$a$处$n$阶可导，$|x|$在$0$处连$T_1$都没有；次数不超过$n$的多项式，$T_n$就是它自己。

### 常见函数的麦克劳林多项式

$e^x$的各阶导数都是$e^x$，在$0$处都是$1$。$\sin x$的各阶导数在$0$处依次是$0$、$1$、$0$、$-1$，循环往复（见[高阶导数](lesson:math.calculus.higher-derivatives)），$\cos x$的依次是$1$、$0$、$-1$、$0$。$\ln(1+x)$的$k$阶导数是$\frac{(-1)^{k-1}(k-1)!}{(1+x)^k}$，$(1+x)^\alpha$的是$\alpha(\alpha-1)\cdots(\alpha-k+1)(1+x)^{\alpha-k}$，在$0$处取值再除以$k!$，就得到它们的:term[麦克劳林多项式]{id="math.calculus.maclaurin-polynomial"}，列在下一部分的末尾。

$\sin x$只有奇次项，$\cos x$只有偶次项，所以$\sin x$的$T_{2m+1}$也就是$T_{2m+2}$。$\alpha$是正整数时，$(1+x)^\alpha$的麦克劳林多项式就是二项式展开（binomial expansion）；$\alpha$不是正整数时它照样存在，$\alpha=-\frac12$时前两项是$1-\frac x2$。

### 带佩亚诺余项的泰勒公式

::anchor{id="def-remainder"}
$R_n(x)=f(x)-T_n(x)$叫作$f$在$a$处的$n$阶:term[余项]{id="math.calculus.remainder"}（remainder），它就是用$T_n(x)$近似$f(x)$的误差。

::anchor{id="thm-peano"}
**定理**　设$f$在$a$处$n$阶可导，则$x\to a$时$R_n(x)=o\bigl((x-a)^n\bigr)$，即$f(x)=T_n(x)+o\bigl((x-a)^n\bigr)$。这个等式叫作带:term[佩亚诺余项]{id="math.calculus.peano-remainder"}（Peano remainder）的:term[泰勒公式]{id="math.calculus.taylor-formula"}（Taylor's formula），$o\bigl((x-a)^n\bigr)$就是佩亚诺余项。

道理：$T_n$在$a$处的前$n$阶导数和$f$的一样，所以$R_n$和它的前$n$阶导数在$a$处都是$0$，$\frac{R_n(x)}{(x-a)^n}$是:term[$\frac00$型]{id="math.calculus.zero-over-zero"}（indeterminate form 0/0）。用$n-1$次:term[洛必达法则]{id="math.calculus.lhopital-rule"}（L'Hôpital's rule），分子、分母变成$R_n^{(n-1)}(x)$和$n!(x-a)$。$R_n^{(n-1)}(a)=0$，所以$\frac{R_n^{(n-1)}(x)}{n!(x-a)}=\frac1{n!}\cdot\frac{R_n^{(n-1)}(x)-R_n^{(n-1)}(a)}{x-a}$，由:term[导数]{id="math.calculus.derivative"}的定义，它趋于$\frac{R_n^{(n)}(a)}{n!}=0$。

为什么有用：误差是比$(x-a)^n$:term[高阶的无穷小]{id="math.calculus.higher-order-infinitesimal"}（higher-order infinitesimal），$x$越靠近$a$，$T_n(x)$越准，$n$越大，准得越快。[无穷小的比较](lesson:math.calculus.infinitesimal-orders)里的$\sin x=x+o(x)$、$1-\cos x=\frac12x^2+o(x^2)$，都是它的特例。边界情况：定理只说$x\to a$时的情形，不说某个固定的$x$处误差多大，那要用:term[拉格朗日余项]{id="math.calculus.lagrange-remainder"}（Lagrange remainder，见[泰勒公式的余项与误差估计](lesson:math.calculus.taylor-remainder)）。

五个常见函数在$0$处的展开（$x\to0$）：

$$
\begin{aligned}
e^x&=1+x+\frac{x^2}{2!}+\cdots+\frac{x^n}{n!}+o(x^n),\\
\sin x&=x-\frac{x^3}{3!}+\frac{x^5}{5!}-\cdots+(-1)^m\frac{x^{2m+1}}{(2m+1)!}+o(x^{2m+2}),\\
\cos x&=1-\frac{x^2}{2!}+\frac{x^4}{4!}-\cdots+(-1)^m\frac{x^{2m}}{(2m)!}+o(x^{2m+1}),\\
\ln(1+x)&=x-\frac{x^2}2+\frac{x^3}3-\cdots+(-1)^{n-1}\frac{x^n}n+o(x^n),\\
(1+x)^\alpha&=1+\alpha x+\frac{\alpha(\alpha-1)}{2!}x^2+\cdots+\frac{\alpha(\alpha-1)\cdots(\alpha-n+1)}{n!}x^n+o(x^n).
\end{aligned}
$$

这些式子里的$x$可以换成任何趋于$0$的量$u$，余项还是比$u^n$高阶的无穷小。$u=-x^2$时$o(u^2)=o(x^4)$，得$e^{-x^2}=1-x^2+\frac{x^4}2+o(x^4)$。$N\to\infty$时取$u=\frac1N$，得$\ln\bigl(1+\frac1N\bigr)=\frac1N-\frac1{2N^2}+o\bigl(\frac1{N^2}\bigr)$，乘以$N$就是$N\ln\bigl(1+\frac1N\bigr)=1-\frac1{2N}+o\bigl(\frac1N\bigr)$。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-4, 4], y: [-2, 8] }
functions:
  - expr: "exp(x)"
    label: |
      $y=e^x$
  - expr: "exp(a) * sum(k, 0, m, prod(j, 1, k, (x - a)/j))"
    label: |
      $e^x$在$a$处的$m$阶泰勒多项式
points:
  - { x: "a", y: "exp(a)" }
sliders:
  - name: m
    min: 1
    max: 8
    step: 1
    default: 2
    label: |
      阶数$m$
  - name: a
    min: -2
    max: 2
    step: 0.1
    default: 0
    label: |
      展开点$a$
:::

蓝色是$e^x$，橙色是它在$a$处的$m$阶:term[泰勒多项式]{id="math.calculus.taylor-polynomial"}。$m$每加$1$，橙色曲线在$a$附近贴得更紧，贴住的范围也更宽；离$a$远了，它还是会离开$e^x$。拖动$a$，换一个展开点，泰勒多项式就在新的点附近贴住曲线：它只在展开点附近好用。

## 例题

### 例 1　在$a\ne0$处展开

写出$\sqrt[3]x$在$8$处的$2$阶:term[泰勒多项式]{id="math.calculus.taylor-polynomial"}，并用它近似$\sqrt[3]9$。

**为什么想到这么做**：$9$离$8$近，$\sqrt[3]8=2$好算；在$8$处展开，$x-8=1$，二次项在:term[切线]{id="math.calculus.tangent-line"}的基础上再修正一步。

**推导**：$f(x)=x^{\frac13}$，$f'(x)=\frac13x^{-\frac23}$，$f''(x)=-\frac29x^{-\frac53}$。在$8$处，$f(8)=2$，$f'(8)=\frac1{12}$，$f''(8)=-\frac1{144}$，所以$T_2(x)=2+\frac{x-8}{12}-\frac{(x-8)^2}{288}$。$T_2(9)=2+\frac1{12}-\frac1{288}\approx2.07986$，而$\sqrt[3]9=2.08008\cdots$；只用$T_1$（切线）得$2.08333$，误差大十多倍。

### 例 2　驻点处的符号

设$f$在$a$处二阶可导，$f'(a)=0$，$f''(a)>0$。说明$a$是$f$的极小值点。

**为什么想到这么做**：$f'(a)=0$，:term[泰勒公式]{id="math.calculus.taylor-formula"}里一次项没有了，$f(x)-f(a)$的主要部分是二次项，二次项在$a$的两侧都是正的。

**推导**：由带:term[佩亚诺余项]{id="math.calculus.peano-remainder"}的泰勒公式，$f(x)-f(a)=\frac{f''(a)}2(x-a)^2+o\bigl((x-a)^2\bigr)=(x-a)^2\Bigl[\frac{f''(a)}2+\varepsilon(x)\Bigr]$，其中$x\to a$时$\varepsilon(x)\to0$。$x$离$a$很近时方括号是正的，所以$x\ne a$时$f(x)>f(a)$，$a$是:term[极值点]{id="math.calculus.extremum-point"}（extremum point），而且是极小值点。这正是:term[二阶导数判别法]{id="math.calculus.second-derivative-test"}（second derivative test，见[凹凸性与拐点](lesson:math.calculus.concavity)）；多变量微积分判断:term[极值]{id="math.calculus.local-extremum"}（local extremum），也是沿每个方向这样看。

## 常见误区

- 「:term[泰勒多项式]{id="math.calculus.taylor-polynomial"}的系数是$f^{(k)}(a)$。」漏了$k!$：$e^x$的$T_2$是$1+x+\frac{x^2}2$，不是$1+x+x^2$。
- 「阶数越高，$T_n$在哪里都越准。」:term[佩亚诺余项]{id="math.calculus.peano-remainder"}只管$x\to a$：$e^x$的$T_2$在$5$处是$18.5$，而$e^5\approx148.4$。
- 「$(1+x)^\alpha$的展开只对正整数$\alpha$成立。」那是二项式定理（binomial theorem）；$\alpha$是任何实数，带佩亚诺余项的展开都成立，比如$\sqrt{1+x}=1+\frac x2-\frac{x^2}8+o(x^2)$。

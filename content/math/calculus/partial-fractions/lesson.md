---
id: math.calculus.partial-fractions
title: |
  有理函数的积分
goal: |
  会把有理函数拆成部分分式并逐项积分。
prerequisites: [math.calculus.substitution, math.calculus.implicit-differentiation]
minutes: 26
summary: |
  化成真分式，按分母的因式拆成部分分式，再逐项积分。
status: reviewed
---

## 这一节要回答的问题

$\frac1{x^2-1}$、$\frac{x+1}{x(x^2+1)}$这样两个多项式之比，:term[原函数]{id="math.calculus.antiderivative"}（antiderivative）是什么？常微分方程里解种群增长的方程，就要积$\frac K{y(K-y)}$。能不能把它们拆成几个简单的分式，每一项都一眼就能积出来？

## 讲解

### 真分式与多项式除法

::anchor{id="def-proper-fraction"}
两个多项式之比$\frac{P(x)}{Q(x)}$叫作有理函数（rational function）。$P$的次数低于$Q$的次数时，它叫作真分式（proper fraction），否则叫作假分式（improper fraction）。

为什么要分：假分式先做多项式除法，写成多项式加真分式，比如$\frac{x^3+1}{x^2+1}=x+\frac{1-x}{x^2+1}$；多项式那一部分直接积，下面只要处理真分式。边界情况：分子、分母次数相同也是假分式，$\frac{x^2}{x^2-1}=1+\frac1{x^2-1}$。

### 分母的分解与部分分式

::anchor{id="thm-real-factorization"}
**定理**　实系数多项式能分解成一次因式和不可约的二次因式的乘积，二次因式$x^2+px+q$不可约（irreducible）是说$p^2-4q<0$，它没有实根。

这里不证。它来自代数基本定理（fundamental theorem of algebra）：复系数的多项式总有复数根；实系数多项式的虚根成对出现，一对共轭的虚根合起来，就是一个不可约的二次因式。

::anchor{id="def-partial-fractions"}
设$\frac{P(x)}{Q(x)}$是真分式。$Q$的每个因式$(x-a)^k$对应$\frac{A_1}{x-a}+\frac{A_2}{(x-a)^2}+\cdots+\frac{A_k}{(x-a)^k}$，每个因式$(x^2+px+q)^m$对应$\frac{B_1x+C_1}{x^2+px+q}+\cdots+\frac{B_mx+C_m}{(x^2+px+q)^m}$，$\frac PQ$等于所有这些项的和，其中的常数唯一确定。这些项叫作$\frac PQ$的:term[部分分式]{id="math.calculus.partial-fraction"}（partial fractions）。

为什么这样设：数一数待定的常数，$(x-a)^k$给出$k$个，$(x^2+px+q)^m$给出$2m$个，加起来正好是$Q$的次数，和分子$P$要对上的系数一样多；这些常数存在而且唯一，这里不证。求常数时，两边乘以$Q$，比较同次项的系数，或者代入几个特殊的$x$。比如$\frac1{x^2-1}=\frac A{x-1}+\frac B{x+1}$，两边乘以$x^2-1$得$1=A(x+1)+B(x-1)$，代入$x=1$得$A=\frac12$，代入$x=-1$得$B=-\frac12$。

边界情况：二次因式上面的分子要设成$Bx+C$，只设一个常数不够：$\frac x{x^2+1}$就写不成$\frac C{x^2+1}$。重因式的每一次幂都要有一项，$\frac1{x^2(x+1)}=-\frac1x+\frac1{x^2}+\frac1{x+1}$，少了$-\frac1x$就对不上。

### 逐项积分

:term[部分分式]{id="math.calculus.partial-fraction"}只有四种，前三种直接积：$\int\frac{A\,\dd x}{x-a}=A\ln|x-a|+C$；$k\ge2$时$\int\frac{A\,\dd x}{(x-a)^k}=-\frac A{(k-1)(x-a)^{k-1}}+C$；第三种$\frac{Bx+C}{x^2+px+q}$要先配方。记$x^2+px+q=\bigl(x+\frac p2\bigr)^2+r^2$，$r=\sqrt{q-\frac{p^2}4}>0$，把分子拆成$\frac B2(2x+p)+\bigl(C-\frac{Bp}2\bigr)$：

$$
\Bigl[\ln\bigl(x^2+px+q\bigr)\Bigr]'=\frac{2x+p}{x^2+px+q},\qquad\Bigl[\frac1r\arctan\frac{x+\frac p2}r\Bigr]'=\frac1{\bigl(x+\frac p2\bigr)^2+r^2}.
$$

前一个由:term[第一类换元法]{id="math.calculus.substitution-first-kind"}（substitution of the first kind）令$u=x^2+px+q$得到；后一个令$u=\frac{x+p/2}r$，化成$\frac1r\int\frac{\dd u}{u^2+1}$，得到:term[反正切函数]{id="math.calculus.arctangent"}（arctangent）。第四种$\frac{Bx+C}{(x^2+px+q)^m}$（$m\ge2$）配方以后用递推公式降低$m$（第 5 题）。

所以有理函数的:term[原函数]{id="math.calculus.antiderivative"}总能写成有理函数、对数和反正切的组合，都是:term[初等函数]{id="math.calculus.elementary-function"}（elementary function）。边界情况：$\int\frac{\dd x}{x^2+1}=\arctan x+C$，不是$\ln(x^2+1)+C$，对数来自分子是$2x$的$\frac{2x}{x^2+1}$。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-5, 5], y: [-6, 6] }
functions:
  - expr: "(x + 5)/((x - 1)*(x + 2))"
    label: |
      $y=\frac{x+5}{(x-1)(x+2)}$
  - expr: "2/(x - 1)"
    label: |
      $y=\frac2{x-1}$
  - expr: "-1/(x + 2)"
    label: |
      $y=-\frac1{x+2}$
points:
  - { x: "c", y: "(c + 5)/((c - 1)*(c + 2))" }
  - { x: "c", y: "2/(c - 1)" }
  - { x: "c", y: "-1/(c + 2)" }
sliders:
  - name: c
    min: -4.9
    max: 4.9
    step: 0.05
    default: 2.5
    label: |
      横坐标$c$
:::

蓝色曲线$y=\frac{x+5}{(x-1)(x+2)}$是橙色、绿色两条曲线之和：$\frac{x+5}{(x-1)(x+2)}=\frac2{x-1}-\frac1{x+2}$。拖动$c$，蓝色曲线上圆点的高度，总是另外两个圆点的高度之和。靠近$x=1$时，橙色那一项冲向无穷，绿色那一项只是一个有限的数，蓝色曲线和橙色曲线贴在一起；靠近$x=-2$时换成绿色那一项起主要作用。每个:term[部分分式]{id="math.calculus.partial-fraction"}管一个分母为零的点，它的系数就是那里的「强度」。

## 例题

### 例 1　分母是不同的一次因式

求$\int\frac{x+5}{x^2+x-2}\,\dd x$。

**为什么想到这么做**：分子次数低于分母，已经是真分式；分母$x^2+x-2=(x-1)(x+2)$，两个不同的一次因式，设成$\frac A{x-1}+\frac B{x+2}$。

**推导**：$x+5=A(x+2)+B(x-1)$。代入$x=1$得$6=3A$，$A=2$；代入$x=-2$得$3=-3B$，$B=-1$。所以

$$
\int\frac{x+5}{x^2+x-2}\,\dd x=\int\Bigl(\frac2{x-1}-\frac1{x+2}\Bigr)\dd x=2\ln|x-1|-\ln|x+2|+C.
$$

### 例 2　分母有不可约的二次因式

求$\int\frac{x+1}{x(x^2+1)}\,\dd x$。

**为什么想到这么做**：$x^2+1$不可约，它上面的分子设成$Bx+C$，即$\frac{x+1}{x(x^2+1)}=\frac Ax+\frac{Bx+C}{x^2+1}$。积分时$\frac{-x}{x^2+1}$凑成对数，$\frac1{x^2+1}$给出:term[反正切]{id="math.calculus.arctangent"}。

**推导**：$x+1=A(x^2+1)+(Bx+C)x$。代入$x=0$得$A=1$；比较$x^2$的系数，$0=A+B$，$B=-1$；比较$x$的系数，$C=1$。所以

$$
\begin{aligned}
\int\frac{x+1}{x(x^2+1)}\,\dd x&=\int\Bigl(\frac1x-\frac x{x^2+1}+\frac1{x^2+1}\Bigr)\dd x\\
&=\ln|x|-\frac12\ln\bigl(x^2+1\bigr)+\arctan x+C.
\end{aligned}
$$

## 常见误区

- 「假分式也直接按分母拆。」$\frac{x^2}{x^2-1}$设成$\frac A{x-1}+\frac B{x+1}$，右边通分后分子最多一次，永远对不上$x^2$；要先除出$1$。
- 「不可约二次因式上面只要一个常数。」$\frac{x+1}{x(x^2+1)}$里设成$\frac Ax+\frac C{x^2+1}$，比较系数会得到矛盾的方程；分子要设成$Bx+C$。
- 「$\int\frac{\dd x}{x^2+1}=\ln(x^2+1)+C$。」求导验算：$\bigl[\ln(x^2+1)\bigr]'=\frac{2x}{x^2+1}$。正确的是$\arctan x+C$。

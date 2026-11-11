---
id: math.ode.series-solutions
title: |
  幂级数解法
goal: |
  会在常点附近用幂级数求二阶线性方程的解，并得到系数的递推公式。
prerequisites: [math.ode.second-order-linear, math.calculus.power-series-calculus, math.complex-analysis.complex-numbers]
minutes: 35
summary: |
  常点附近的解是幂级数；代入方程比较系数，得到系数的递推公式。
status: reviewed
---

## 这一节要回答的问题

$y''-xy=0$的系数不是常数，:term[特征方程]{id="math.ode.characteristic-equation"}（characteristic equation）那一套用不上，它的解也写不成初等函数。可它的系数是多项式，能不能假设解是一个幂级数（power series），代进去一项一项地定出系数？这样得到的级数，在多大的范围里收敛？

## 讲解

### 常点与奇点

把方程写成标准形式$y''+P(x)y'+Q(x)y=0$，讨论它在一点$x_0$附近的解。

::anchor{id="def-ordinary-point"}
如果$P$、$Q$在$x_0$附近都能写成收敛的幂级数，就说$x_0$是方程的:term[常点]{id="math.ode.ordinary-point"}（ordinary point）；否则说$x_0$是方程的:term[奇点]{id="math.ode.singular-point"}（singular point）。

为什么这样定义：常点附近系数是「好」的函数，可以期望解也是幂级数。系数是多项式的方程$a(x)y''+b(x)y'+c(x)y=0$，满足$a(x_0)\ne0$的点都是常点，$a$的零点一般是奇点。边界情况：$y''+y=0$处处是常点；$(1-x^2)y''-2xy'+2y=0$的奇点是$\pm1$。

::anchor{id="thm-series-solution"}
**常点附近的幂级数解**　设$x_0$是$y''+P(x)y'+Q(x)y=0$的常点，$P$、$Q$的幂级数在$|x-x_0|<R$里收敛。则方程有两个线性无关的解，都是幂级数$\sum_{n=0}^{\infty}a_n(x-x_0)^n$，在$|x-x_0|<R$里收敛；其中$a_0=y(x_0)$、$a_1=y'(x_0)$可以任意给定，其余的系数由方程确定。

**证明思路**：把级数代入方程，在收敛的范围里可以[逐项求导](lesson:math.calculus.power-series-calculus)（term-by-term differentiation），合并同次幂以后，每个$(x-x_0)^n$的系数都要为零，这给出用前面的系数表示$a_{n+2}$的式子。由它算出的级数确实收敛、收敛半径（radius of convergence）不小于$R$，要用一个处处更大的级数来控制，这里不证。系数是多项式时，$R$可以取$x_0$到$a(x)$最近的零点的距离，复数的零点（见[复数](lesson:math.complex-analysis.complex-numbers)）也要算上（第 7 题）。

### 递推公式

::anchor{id="def-recurrence"}
把幂级数代入方程，令各次幂的系数为零，得到的用前面的系数表示后面系数的式子，叫作系数的:term[递推公式]{id="math.ode.recurrence-relation"}（recurrence relation）。

为什么这样定义：有了递推公式，任意多项系数都能一个一个算出来，往往还能看出通项。边界情况：$y''+y=0$代入$\sum a_nx^n$，得$a_{n+2}=-\frac{a_n}{(n+2)(n+1)}$；$a_0=1$、$a_1=0$时得到$1-\frac{x^2}{2!}+\frac{x^4}{4!}-\cdots$，正是$\cos x$。

代入时先要把下标移齐。例如$y=\sum_{n=0}^{\infty}a_nx^n$时$y''=\sum_{n=2}^{\infty}n(n-1)a_nx^{n-2}=\sum_{n=0}^{\infty}(n+2)(n+1)a_{n+2}x^n$，而$xy=\sum_{n=1}^{\infty}a_{n-1}x^n$；都写成$x^n$的系数以后，才能逐项比较。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-8, 2.5], y: [-3, 6] }
functions:
  - expr: "sum(k, 0, N, x^(3*k) / prod(j, 1, k, (3*j - 1)*(3*j)))"
    label: |
      部分和$\sum_{k=0}^{N}a_{3k}x^{3k}$
sliders:
  - name: N
    min: 0
    max: 25
    step: 1
    default: 3
    label: |
      保留到第$N$项
:::

这是$y''=xy$满足$y(0)=1$、$y'(0)=0$的解的部分和（例 1）。拖动$N$：项数越多，曲线在越来越宽的范围里不再变化，$x$离$0$越远，需要的项越多；$N=25$时，整个画面里的曲线都已经稳定。$x<0$时解来回振荡，$x>0$时增长得很快，和常系数方程的解都不一样。

## 例题

### 例 1　艾里方程

求艾里方程（Airy equation）$y''=xy$满足$y(0)=1$、$y'(0)=0$的幂级数解。

**为什么想到这么做**：系数$x$是多项式，$0$是:term[常点]{id="math.ode.ordinary-point"}（ordinary point），设$y=\sum a_nx^n$，求出:term[递推公式]{id="math.ode.recurrence-relation"}。

**推导**：$y''=\sum_{n=0}^{\infty}(n+2)(n+1)a_{n+2}x^n$，$xy=\sum_{n=1}^{\infty}a_{n-1}x^n$。比较常数项得$2a_2=0$；比较$x^n$（$n\ge1$）的系数得$a_{n+2}=\frac{a_{n-1}}{(n+2)(n+1)}$，下标每次跳$3$。$a_0=1$、$a_1=0$时，$a_2=0$，于是只有$a_{3k}$不为零：$a_3=\frac{1}{2\cdot3}$，$a_6=\frac{1}{2\cdot3\cdot5\cdot6}$，一般地$a_{3k}=\frac{1}{(2\cdot3)(5\cdot6)\cdots((3k-1)\cdot3k)}$，解是$y=\sum_{k=0}^{\infty}a_{3k}x^{3k}$。

### 例 2　截断成多项式

求$(1-x^2)y''-2xy'+6y=0$在$0$附近的一个多项式解。

**为什么想到这么做**：$0$是:term[常点]{id="math.ode.ordinary-point"}，先求:term[递推公式]{id="math.ode.recurrence-relation"}。系数里的$n(n+1)$在某个$n$处和$6$相等时，递推会让后面的系数全为零，级数截断成多项式。

**推导**：代入$\sum a_nx^n$，$x^n$的系数是$(n+2)(n+1)a_{n+2}-\bigl(n(n-1)+2n-6\bigr)a_n$，所以$a_{n+2}=\frac{n(n+1)-6}{(n+2)(n+1)}a_n$。取$a_0=1$、$a_1=0$：$a_2=\frac{-6}{2}=-3$，$a_4=\frac{2\cdot3-6}{4\cdot3}a_2=0$，以后的偶数项都为零。所以$y=1-3x^2$是一个解；代回验证，$(1-x^2)(-6)-2x(-6x)+6(1-3x^2)=0$。

## 常见误区

- 「代入以后，三个求和逐项相加、令每一项为零。」要先把下标移齐，都写成同一个$x^n$的系数，再令系数为零。
- 「$a_0$、$a_1$也由:term[递推公式]{id="math.ode.recurrence-relation"}决定。」它们是两个任意常数，就是$y(x_0)$、$y'(x_0)$，对应解空间是二维的。
- 「收敛半径只看实数轴上的:term[奇点]{id="math.ode.singular-point"}。」$(1+x^2)y''+2xy'=0$在实数轴上处处是:term[常点]{id="math.ode.ordinary-point"}，可它的解$\arctan x$的级数只在$|x|\le1$上收敛（第 7 题）。
- 「幂级数解只能在$0$附近求。」在任何常点$x_0$附近都可以，用$(x-x_0)$的幂。

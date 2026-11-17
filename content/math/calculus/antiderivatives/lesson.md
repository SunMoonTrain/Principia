---
id: math.calculus.antiderivatives
title: |
  原函数与不定积分
goal: |
  知道同一个函数的原函数之间只差一个常数，会用基本积分表求简单的不定积分。
prerequisites: [math.calculus.mean-value-theorem]
minutes: 25
summary: |
  导数是$f$的函数叫原函数，彼此只差常数：$\int f(x)\,\dd x=F(x)+C$。
status: reviewed
---

## 这一节要回答的问题

由位置求速度是求导。反过来，知道汽车每一刻的速度，怎样求它的位置？已知:term[导数]{id="math.calculus.derivative"}（derivative）、求原来的函数，这样的函数有几个，它们之间又是什么关系？

## 讲解

### 原函数

速度是$v(t)=2t$时，位置可以是$s(t)=t^2$，因为$(t^2)'=2t$；可$t^2+5$、$t^2-3$的:term[导数]{id="math.calculus.derivative"}也是$2t$，它们只是出发点不同。导数相同的函数不止一个。

::anchor{id="def-antiderivative"}
设$f$在区间$I$上有定义。如果$I$上的:term[可导函数]{id="math.calculus.differentiable"}（differentiable function）$F$对$I$里所有的$x$都满足$F'(x)=f(x)$，就说$F$是$f$在$I$上的一个:term[原函数]{id="math.calculus.antiderivative"}（antiderivative）。

为什么这样定义：求原函数就是把求导倒过来，由速度求位置、由加速度求速度都是求原函数。边界情况：不是每个函数都有原函数。$x<0$时取$0$、$x\ge0$时取$1$的台阶函数（step function）在$\R$上没有原函数：:term[导函数]{id="math.calculus.derivative-function"}（derivative function）取到两个值，就要取遍两者之间的所有值，不会跳跃（见[极值与费马定理](lesson:math.calculus.local-extrema)第 5 题）。

::anchor{id="thm-antiderivatives"}
**定理**　如果$F$是$f$在区间$I$上的一个原函数，那么$f$在$I$上的原函数恰好是$F(x)+C$这些函数，$C$取遍所有常数。

道理：$(F+C)'=F'=f$，所以$F+C$都是原函数。反过来，$G$也是原函数时，$G'=F'$在区间$I$上处处成立，由:term[中值定理]{id="math.calculus.mean-value-theorem"}（mean value theorem）的推论 2（见[微分中值定理](lesson:math.calculus.mean-value-theorem#thm-same-derivative)），$G-F$是常数。所以同一个函数在一个区间上的原函数只差一个常数，找到一个，就找到了全部。

边界情况：定义域要是一个区间。$\frac1x$在$x<0$和$x>0$两段上各有原函数$\ln|x|+C_1$、$\ln|x|+C_2$，两段的常数可以不同，合起来就不是「一个原函数加一个常数」了。

### 不定积分

::anchor{id="def-indefinite-integral"}
$f$在区间$I$上的全体:term[原函数]{id="math.calculus.antiderivative"}叫作$f$的:term[不定积分]{id="math.calculus.indefinite-integral"}（indefinite integral），记作$\int f(x)\,\dd x$；由上面的定理，$F$是一个原函数时，$\int f(x)\,\dd x=F(x)+C$。其中$\int$叫作积分号（integral sign），$f(x)$叫作:term[被积函数]{id="math.calculus.integrand"}（integrand），任意常数$C$叫作:term[积分常数]{id="math.calculus.constant-of-integration"}（constant of integration）。

为什么这样记：$\dd x$指出把谁当自变量；$\int$是拉长的字母 S，取自「求和」，这个记号和求和的关系要到:term[微积分基本定理]{id="math.calculus.fundamental-theorem-of-calculus"}（fundamental theorem of calculus，见[微积分基本定理](lesson:math.calculus.fundamental-theorem)）才看得到。边界情况：$\int f(x)\,\dd x$是一族函数，不是一个函数；检验一个不定积分算得对不对，只要对右边求导，看是不是等于被积函数。

求导的线性给出积分的线性：常数$a$、$b$不全为零时，$\int[af(x)+bg(x)]\,\dd x=a\int f(x)\,\dd x+b\int g(x)\,\dd x$，因为右边求导正好得$af+bg$。所以多项式这类和式可以逐项求原函数，最后只写一个$C$。

### 基本积分表

把[初等函数的导数](lesson:math.calculus.elementary-derivatives)里的表倒过来读，就得到下面这些:term[不定积分]{id="math.calculus.indefinite-integral"}，每一条都可以对右边求导来验证：

| 不定积分 | 结果 | 不定积分 | 结果 |
| --- | --- | --- | --- |
| $\int x^a\,\dd x$（$a\ne-1$） | $\frac{x^{a+1}}{a+1}+C$ | $\int\frac1x\,\dd x$ | $\ln\lvert x\rvert+C$ |
| $\int e^x\,\dd x$ | $e^x+C$ | $\int a^x\,\dd x$ | $\frac{a^x}{\ln a}+C$ |
| $\int\cos x\,\dd x$ | $\sin x+C$ | $\int\sin x\,\dd x$ | $-\cos x+C$ |
| $\int\frac1{\cos^2x}\,\dd x$ | $\tan x+C$ | | |

$a$不是整数时，第一条要求$x>0$；$a^x$那一条要求$a>0$、$a\ne1$。幂函数的公式在$a=-1$时分母为零，正好缺了$\frac1x$这一项，由$\ln|x|$补上。$\frac1{1+x^2}$这类:term[被积函数]{id="math.calculus.integrand"}的:term[原函数]{id="math.calculus.antiderivative"}是:term[反三角函数]{id="math.calculus.inverse-trigonometric-functions"}（inverse trigonometric functions），要用到[隐函数与反函数的求导](lesson:math.calculus.implicit-differentiation)里的:term[导数]{id="math.calculus.derivative"}；$\cos2x$、$e^{3x}$这类复合的被积函数，要用以后的:term[换元积分法]{id="math.calculus.integration-by-substitution"}（integration by substitution，见[换元积分法](lesson:math.calculus.substitution)）。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-3, 3], y: [-4, 4] }
functions:
  - expr: "x^3/3 - x"
    label: |
      $y=\frac{x^3}3-x$
  - expr: "x^3/3 - x + C"
    label: |
      $y=\frac{x^3}3-x+C$
  - expr: "u^3/3 - u + (u^2 - 1)*(x - u)"
    label: |
      蓝色曲线在$x=u$处的切线
  - expr: "u^3/3 - u + C + (u^2 - 1)*(x - u)"
    label: |
      橙色曲线在$x=u$处的切线
points:
  - { x: "u", y: "u^3/3 - u" }
  - { x: "u", y: "u^3/3 - u + C" }
sliders:
  - name: C
    min: -3
    max: 3
    step: 0.1
    default: 1.5
    label: |
      积分常数$C$
  - name: u
    min: -2
    max: 2
    step: 0.1
    default: 1.4
    label: |
      切点的横坐标$u$
:::

蓝色、橙色两条曲线都是$x^2-1$的:term[原函数]{id="math.calculus.antiderivative"}，橙色的是蓝色的上下平移了$C$。拖动$u$，绿色、紫色两条:term[切线]{id="math.calculus.tangent-line"}（tangent line）始终平行，斜率都是$u^2-1$：在同一个$x$处，一族原函数的切线方向都一样，它们之间只差竖直方向的平移。

## 例题

### 例 1　先展开，再逐项积分

求$\int\frac{(x+1)^2}{\sqrt x}\,\dd x$（$x>0$）。

**为什么想到这么做**：表里没有这种形式，可把分子展开、除以$\sqrt x$，每一项都是$x$的实数次幂，用幂函数那一条和积分的线性。

**推导**：$\frac{(x+1)^2}{\sqrt x}=\frac{x^2+2x+1}{x^{1/2}}=x^{\frac32}+2x^{\frac12}+x^{-\frac12}$。所以$\int\frac{(x+1)^2}{\sqrt x}\,\dd x=\frac25x^{\frac52}+\frac43x^{\frac32}+2x^{\frac12}+C$。验证：右边求导得$x^{\frac32}+2x^{\frac12}+x^{-\frac12}$，正是:term[被积函数]{id="math.calculus.integrand"}。

### 例 2　用一个点定出常数

曲线$y=F(x)$（$x>0$）经过点$(1,3)$，并且在每一点处:term[切线]{id="math.calculus.tangent-line"}的斜率是$x-\frac1{x^2}$。求$F(x)$。

**为什么想到这么做**：切线的斜率是$F'(x)$，所以$F$是$x-\frac1{x^2}$的一个:term[原函数]{id="math.calculus.antiderivative"}；全体原函数只差常数，经过的那个点把常数定下来。

**推导**：$\int\Bigl(x-\frac1{x^2}\Bigr)\dd x=\frac{x^2}2+\frac1x+C$。代入$F(1)=3$：$\frac12+1+C=3$，$C=\frac32$。所以$F(x)=\frac{x^2}2+\frac1x+\frac32$。

## 常见误区

- 「$\int2x\,\dd x=x^2$。」漏了:term[积分常数]{id="math.calculus.constant-of-integration"}：$x^2+1$、$x^2-7$的:term[导数]{id="math.calculus.derivative"}也是$2x$，正确的是$x^2+C$。
- 「$\int x^{-1}\,\dd x=\frac{x^0}0+C$。」幂函数的公式在$a=-1$时不能用，$\int\frac1x\,\dd x=\ln|x|+C$。
- 「$\int f(x)g(x)\,\dd x=\int f(x)\,\dd x\cdot\int g(x)\,\dd x$。」取$f=g=1$：左边是$x+C$，右边是$(x+C_1)(x+C_2)$，里面有$x^2$项，求导就知道不对。

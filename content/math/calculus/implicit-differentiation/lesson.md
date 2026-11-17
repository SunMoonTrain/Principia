---
id: math.calculus.implicit-differentiation
title: |
  隐函数与反函数的求导
goal: |
  会对隐函数方程两边求导，并求反三角函数等反函数的导数。
prerequisites: [math.calculus.chain-rule, math.calculus.elementary-derivatives]
minutes: 29
summary: |
  把$y$看成$x$的函数对方程求导；反函数的导数是倒数。
status: reviewed
---

## 这一节要回答的问题

圆$x^2+y^2=25$上点$(3,4)$处的:term[切线]{id="math.calculus.tangent-line"}（tangent line）斜率是多少？解出$y=\sqrt{25-x^2}$再求导当然可以，可$x^3+y^3=6xy$这样的方程根本解不出$y$。另外，$\arcsin x$、$\arctan x$是$\sin x$、$\tan x$倒过来的函数，它们的:term[导数]{id="math.calculus.derivative"}（derivative）能不能从$\sin x$、$\tan x$的导数倒推出来？

## 讲解

### 隐函数

圆$x^2+y^2=25$整个不是一个函数的图像，一个$x$对应上下两个$y$。可只看点$(3,4)$附近，曲线就是上半圆$y=\sqrt{25-x^2}$的一段，是一个函数的图像。

::anchor{id="def-implicit-function"}
设$(x_0,y_0)$满足关于$x$、$y$的方程。如果在$x_0$附近，对每个$x$，方程在$y_0$附近恰好有一个解$y$，就说这个方程在$(x_0,y_0)$附近确定了一个:term[隐函数]{id="math.calculus.implicit-function"}（implicit function）$y=y(x)$；写成$y=f(x)$形式的函数叫作显函数（explicit function）。

为什么这样定义：很多曲线由方程给出，整体上不是函数的图像，局部上却是；隐函数只要求「在一点附近」。它也不要求能解出公式：$y^5+y=x$对每个$x$都恰有一个$y$，却写不出$y$的式子（第 7 题）。边界情况：圆在$(5,0)$附近，$x<5$时有两个$y$，$x>5$时一个也没有，确定不了隐函数，那里的:term[切线]{id="math.calculus.tangent-line"}是竖直的。

### 隐函数求导法

::anchor{id="def-implicit-differentiation"}
把$y$看成$x$的函数$y(x)$，对方程两边同时对$x$求导，再解出$y'$，这种办法叫作隐函数求导法（implicit differentiation）。

以圆为例。$x^2$对$x$的:term[导数]{id="math.calculus.derivative"}是$2x$；$y^2$是$y(x)$的平方，由:term[链式法则]{id="math.calculus.chain-rule"}（chain rule），它对$x$的导数是$2y\,y'$。所以$2x+2yy'=0$，$y'=-\frac xy$，在$(3,4)$处是$-\frac34$，和对$y=\sqrt{25-x^2}$直接求导的结果一样。

为什么可以这样做：方程对附近的每个$x$都成立，两边是同一个$x$的函数，导数当然相等；关键是每遇到$y$都要乘上$y'$。结果里同时有$x$和$y$，算某一点的斜率要代入这一点的两个坐标。边界情况：这样做先假定了$y(x)$:term[可导]{id="math.calculus.differentiable"}（differentiable）；方程在什么条件下确实确定一个可导的:term[隐函数]{id="math.calculus.implicit-function"}，由多变量微积分的:term[隐函数定理]{id="math.vector-calculus.implicit-function-theorem"}（implicit function theorem）保证。在圆上$y=0$的两点，$-\frac xy$没有意义，正对着竖直的:term[切线]{id="math.calculus.tangent-line"}。

### 反函数的导数

$y=x^3$在$(2,8)$处的:term[切线]{id="math.calculus.tangent-line"}斜率是$12$；它的反函数（inverse function）$y=\sqrt[3]x$的图像和它关于直线$y=x$对称，在对称的点$(8,2)$处，切线斜率是$\frac1{12}$。

::anchor{id="thm-inverse-derivative"}
**定理（:term[反函数的求导法则]{id="math.calculus.inverse-function-rule"}，inverse function rule）**　设$f$在区间上:term[连续]{id="math.calculus.continuous"}（continuous）、严格单调，在$x_0$处:term[可导]{id="math.calculus.differentiable"}且$f'(x_0)\ne0$，则反函数$f^{-1}$在$y_0=f(x_0)$处可导，并且$(f^{-1})'(y_0)=\frac1{f'(x_0)}$。

道理：图像关于$y=x$翻过去，切线也跟着翻，斜率$k$变成$\frac1k$。用:term[差商]{id="math.calculus.difference-quotient"}（difference quotient）说：记$x=f^{-1}(y)$，严格单调保证$y\ne y_0$时$x\ne x_0$，于是$\frac{f^{-1}(y)-f^{-1}(y_0)}{y-y_0}=\frac{x-x_0}{f(x)-f(x_0)}$。严格单调的连续函数，反函数也连续（这里不证），所以$y\to y_0$时$x\to x_0$，右边趋于$\frac1{f'(x_0)}$。

边界情况：$f'(x_0)=0$时，反函数在$y_0$处不可导，切线是竖直的：$x^3$在$0$处:term[导数]{id="math.calculus.derivative"}为$0$，$\sqrt[3]x$在$0$处的切线是$y$轴（见[导数的定义](lesson:math.calculus.derivative)）。拿已知的验证一下：$\ln x$是$e^x$的反函数，$(\ln y)'=\frac1{e^x}=\frac1y$，和[初等函数的导数](lesson:math.calculus.elementary-derivatives)的结果一致。

### 反三角函数

::anchor{id="def-inverse-trig"}
$\sin x$在$\bigl[-\frac\pi2,\frac\pi2\bigr]$上严格递增，取遍$[-1,1]$，它在这一段上的反函数叫作:term[反正弦函数]{id="math.calculus.arcsine"}（arcsine），记作$\arcsin x$，定义在$[-1,1]$上，值在$\bigl[-\frac\pi2,\frac\pi2\bigr]$里。同样，$\cos x$在$[0,\pi]$上的反函数叫作:term[反余弦函数]{id="math.calculus.arccosine"}（arccosine），记作$\arccos x$；$\tan x$在$\bigl(-\frac\pi2,\frac\pi2\bigr)$上的反函数叫作:term[反正切函数]{id="math.calculus.arctangent"}（arctangent），记作$\arctan x$，定义在整条数轴上。它们统称:term[反三角函数]{id="math.calculus.inverse-trigonometric-functions"}（inverse trigonometric functions）。

为什么要先截一段：$\sin x$不是一一对应的，整个没有反函数；截出一段让它严格单调、又取遍所有的值，就有了，取包含$0$的那一段最简单。边界情况：$\sin(\arcsin x)=x$总成立，$\arcsin(\sin x)=x$却只在$\bigl[-\frac\pi2,\frac\pi2\bigr]$上成立，比如$\arcsin(\sin\pi)=0$。

设$y=\arcsin x$，$-1<x<1$，则$x=\sin y$、$-\frac\pi2<y<\frac\pi2$，由:term[反函数的求导法则]{id="math.calculus.inverse-function-rule"}，$y'=\frac1{\cos y}$；在这一段上$\cos y>0$，所以$\cos y=\sqrt{1-\sin^2y}=\sqrt{1-x^2}$。同样，$x=\tan y$给出$y'=\cos^2y=\frac1{1+\tan^2y}=\frac1{1+x^2}$；$x=\cos y$、$0<y<\pi$给出$y'=-\frac1{\sin y}=-\frac1{\sqrt{1-x^2}}$。

::anchor{id="thm-inverse-trig-derivatives"}
**定理（反三角函数的:term[导数]{id="math.calculus.derivative"}）**　$-1<x<1$时，$(\arcsin x)'=\frac1{\sqrt{1-x^2}}$，$(\arccos x)'=-\frac1{\sqrt{1-x^2}}$；对所有$x$，$(\arctan x)'=\frac1{1+x^2}$。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-2.5, 7.5], y: [-2, 4] }
functions:
  - expr: "exp(x)"
    label: |
      $y=e^x$
  - expr: "ln(x)"
    label: |
      $y=\ln x$
  - expr: "exp(a) + exp(a)*(x - a)"
    label: |
      $e^x$在$(a,e^a)$处的切线
  - expr: "a + exp(-a)*(x - exp(a))"
    label: |
      $\ln x$在$(e^a,a)$处的切线
  - expr: "x"
    label: |
      $y=x$
points:
  - { x: "a", y: "exp(a)" }
  - { x: "exp(a)", y: "a" }
sliders:
  - name: a
    min: -1.5
    max: 1.3
    step: 0.1
    default: 0.5
    label: |
      $a$
:::

蓝色的$e^x$和橙色的$\ln x$关于直线$y=x$对称，两个点$(a,e^a)$、$(e^a,a)$也对称。绿色:term[切线]{id="math.calculus.tangent-line"}的斜率是$e^a$，紫色切线的斜率是$e^{-a}$，正好互为倒数，两条切线也关于$y=x$对称。纵轴的范围取成横轴的$0.6$倍，画面上$y=x$才是$45^\circ$，对称才看得出来。

## 例题

### 例 1　解不出$y$的方程

求曲线$x^3+y^3=6xy$在点$(3,3)$处的:term[切线]{id="math.calculus.tangent-line"}方程。

**为什么想到这么做**：这个方程解不出$y$，只能用隐函数求导法，两边对$x$求导，$y^3$、$6xy$里的$y$都要按$y(x)$处理。

**推导**：$3x^2+3y^2y'=6y+6xy'$，所以$y'(3y^2-6x)=6y-3x^2$，$y'=\frac{2y-x^2}{y^2-2x}$。在$(3,3)$处，$y'=\frac{6-9}{9-6}=-1$，切线是$y-3=-(x-3)$，即$x+y=6$。

### 例 2　反正弦的切线

求曲线$y=\arcsin\frac x2$在$x=1$处的:term[切线]{id="math.calculus.tangent-line"}方程。

**为什么想到这么做**：外层是$\arcsin u$，里层是$u=\frac x2$，用:term[反正弦]{id="math.calculus.arcsine"}的:term[导数]{id="math.calculus.derivative"}配上:term[链式法则]{id="math.calculus.chain-rule"}；切点的纵坐标是$\arcsin\frac12$。

**推导**：$y'=\frac1{\sqrt{1-x^2/4}}\cdot\frac12=\frac1{\sqrt{4-x^2}}$，$x=1$时是$\frac1{\sqrt3}$。$y(1)=\arcsin\frac12=\frac\pi6$，所以切线是$y=\frac\pi6+\frac{x-1}{\sqrt3}$。

## 常见误区

- 「$\arcsin x=\frac1{\sin x}$。」$\arcsin x$（也写成$\sin^{-1}x$）是反函数，不是倒数：$\arcsin\frac12=\frac\pi6$，而$\frac1{\sin(1/2)}\approx2.09$。
- 「对$x^2+y^2=25$两边求导，得$2x+2y=0$。」$y$是$x$的函数，$y^2$的:term[导数]{id="math.calculus.derivative"}是$2yy'$。
- 「$(f^{-1})'(x)=\frac1{f'(x)}$，在同一个$x$处取值。」要在对应的点取值：$f(x)=x^3$时，$(\sqrt[3]x)'$在$x=8$处是$\frac1{f'(2)}=\frac1{12}$，不是$\frac1{f'(8)}=\frac1{192}$。

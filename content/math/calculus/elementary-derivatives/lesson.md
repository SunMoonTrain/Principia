---
id: math.calculus.elementary-derivatives
title: |
  初等函数的导数
goal: |
  会推导正弦、余弦、指数和对数函数的导数，并求由它们组合成的函数的导数。
prerequisites: [math.calculus.derivative-rules, math.calculus.special-limits]
minutes: 28
summary: |
  由两个重要极限推出$\sin x$、$e^x$、$\ln x$等的导数，$(e^x)'=e^x$。
status: reviewed
---

## 这一节要回答的问题

多项式、有理函数的:term[导数]{id="math.calculus.derivative"}（derivative）已经会求了，可$\sin x$、$e^x$、$\ln x$不是用加减乘除从$x$拼出来的，求导只能回到:term[差商]{id="math.calculus.difference-quotient"}（difference quotient）。它们的差商都是$\frac00$型，要用到哪些:term[极限]{id="math.calculus.limit"}（limit，lim）？算出来的导数又有什么规律？

## 讲解

### 正弦与余弦

由两角和的公式，$\sin(x+h)=\sin x\cos h+\cos x\sin h$，所以$\sin x$的:term[差商]{id="math.calculus.difference-quotient"}是$\frac{\sin(x+h)-\sin x}{h}=\sin x\cdot\frac{\cos h-1}{h}+\cos x\cdot\frac{\sin h}{h}$。由:term[第一个重要极限]{id="math.calculus.first-special-limit"}（limit of $\frac{\sin x}{x}$），$\frac{\sin h}h\to1$；[两个重要极限](lesson:math.calculus.special-limits)里求过$\frac{1-\cos h}{h^2}\to\frac12$，所以$\frac{\cos h-1}{h}=-h\cdot\frac{1-\cos h}{h^2}\to0$。于是差商趋于$\cos x$。

::anchor{id="thm-sin-cos"}
**定理 1**　$(\sin x)'=\cos x$，$(\cos x)'=-\sin x$，这里$x$用弧度。

$\cos x$的推导一样：$\cos(x+h)=\cos x\cos h-\sin x\sin h$，差商趋于$-\sin x$。几何上，$\sin x$在波峰、波谷处:term[切线]{id="math.calculus.tangent-line"}（tangent line）水平，那里$\cos x=0$；$\sin x$在$(0,\pi)$上先升后降，$\cos x$在$\bigl(0,\frac\pi2\bigr)$上为正、在$\bigl(\frac\pi2,\pi\bigr)$上为负，正好对得上。边界情况：$x$用角度的话，差商里出现的是$\frac{\sin h^\circ}{h}\to\frac\pi{180}$，:term[导数]{id="math.calculus.derivative"}多出因子$\frac\pi{180}$（[两个重要极限](lesson:math.calculus.special-limits)第 7 题），所以微积分里角一律用弧度。

由:term[商法则]{id="math.calculus.quotient-rule"}（quotient rule），$(\tan x)'=\Bigl(\frac{\sin x}{\cos x}\Bigr)'=\frac{\cos x\cdot\cos x-\sin x\cdot(-\sin x)}{\cos^2x}=\frac1{\cos^2x}$，在$\cos x\ne0$的点成立。

### 指数函数

$e^x$的:term[差商]{id="math.calculus.difference-quotient"}是$\frac{e^{x+h}-e^x}{h}=e^x\cdot\frac{e^h-1}{h}$，由[两个重要极限](lesson:math.calculus.special-limits#thm-log-exp-limits)里的推论，$\frac{e^h-1}h\to1$。同样，$\frac{a^{x+h}-a^x}h=a^x\cdot\frac{a^h-1}h\to a^x\ln a$。

::anchor{id="thm-exp"}
**定理 2**　$(e^x)'=e^x$；$a>0$时，$(a^x)'=a^x\ln a$。

$e^x$的:term[导数]{id="math.calculus.derivative"}就是它自己：曲线$y=e^x$上每一点的:term[切线]{id="math.calculus.tangent-line"}斜率等于这一点的高度。别的底数都要多乘一个$\ln a$，比如$y=2^x$在$x=0$处的切线斜率是$\ln2\approx0.693$，正是[函数极限的直观](lesson:math.calculus.limits-intuition)第 4 题用数值表猜过的那个:term[极限]{id="math.calculus.limit"}。$e$是唯一使$y=a^x$在$x=0$处切线斜率为$1$的底数，以$e$为底，求导最干净。

### 对数函数

设$x>0$。$\ln x$的:term[差商]{id="math.calculus.difference-quotient"}是$\frac{\ln(x+h)-\ln x}{h}=\frac1x\cdot\frac{\ln(1+t)}{t}$，其中$t=\frac hx$；$h\to0$时$t\to0$且$t\ne0$，由推论$\frac{\ln(1+t)}t\to1$，差商趋于$\frac1x$。$x<0$时，$\ln|x|=\ln(-x)$，它的差商是$\frac1h\ln\frac{-x-h}{-x}=\frac1h\ln\bigl(1+\frac hx\bigr)$，同样趋于$\frac1x$。换底公式$\log_ax=\frac{\ln x}{\ln a}$又给出一般底数的情形。

::anchor{id="thm-log"}
**定理 3**　$x>0$时$(\ln x)'=\frac1x$；$x\ne0$时$(\ln|x|)'=\frac1x$；$a>0$、$a\ne1$时$(\log_ax)'=\frac1{x\ln a}$。

$\ln x$的:term[导数]{id="math.calculus.derivative"}$\frac1x$随$x$增大而减小：曲线$y=\ln x$一直在升，却越升越慢。$\ln|x|$的导数在$x<0$时也是$\frac1x$，这一条以后求:term[原函数]{id="math.calculus.antiderivative"}（antiderivative）时要用。

### 实数次幂

[求导的四则运算法则](lesson:math.calculus.derivative-rules)里的:term[幂法则]{id="math.calculus.power-rule"}（power rule）只管整数次幂。$x>0$、$a$是任意实数时，$\frac{(x+h)^a-x^a}h=x^{a-1}\cdot\frac{(1+t)^a-1}{t}$，$t=\frac hx$。$a\ne0$时把$(1+t)^a$写成$e^{a\ln(1+t)}$，令$u=a\ln(1+t)$，$t\to0$时$u\to0$且$u\ne0$，于是$\frac{(1+t)^a-1}{t}=\frac{e^u-1}{u}\cdot a\cdot\frac{\ln(1+t)}{t}\to1\cdot a\cdot1=a$，这里用了[连续与间断](lesson:math.calculus.continuity)里换元的定理。

::anchor{id="thm-real-power"}
**定理 4**　对任何实数$a$，$x>0$时$(x^a)'=ax^{a-1}$。

整数次幂是它的特例；$a=\frac12$时得到$(\sqrt x)'=\frac12x^{-\frac12}=\frac1{2\sqrt x}$，和[导数的定义](lesson:math.calculus.derivative)例 1 一致。把上面求出的:term[导数]{id="math.calculus.derivative"}列成表（$a$是常数）：

| 函数 | 导数 | 函数 | 导数 |
| --- | --- | --- | --- |
| $x^a$（$x>0$） | $ax^{a-1}$ | $e^x$ | $e^x$ |
| $\sin x$ | $\cos x$ | $a^x$ | $a^x\ln a$ |
| $\cos x$ | $-\sin x$ | $\ln\lvert x\rvert$ | $\frac1x$ |
| $\tan x$ | $\frac1{\cos^2x}$ | $\log_ax$ | $\frac1{x\ln a}$ |

配上:term[乘积法则]{id="math.calculus.product-rule"}（product rule）和:term[商法则]{id="math.calculus.quotient-rule"}，由它们加减乘除得到的函数都能求导。$e^{2x}$、$\sin x^2$这类复合函数还要用:term[链式法则]{id="math.calculus.chain-rule"}（chain rule，见[链式法则](lesson:math.calculus.chain-rule)）；:term[反三角函数]{id="math.calculus.inverse-trigonometric-functions"}（inverse trigonometric functions）的导数要用:term[反函数的求导法则]{id="math.calculus.inverse-function-rule"}（inverse function rule），见[隐函数与反函数的求导](lesson:math.calculus.implicit-differentiation)。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-6.3, 6.3], y: [-2, 2] }
functions:
  - expr: "sin(x)"
    label: |
      $y=\sin x$
  - expr: "cos(x)"
    label: |
      $y=\cos x$
  - expr: "sin(a) + cos(a)*(x - a)"
    label: |
      $\sin x$在$x=a$处的切线
points:
  - { x: "a", y: "sin(a)" }
  - { x: "a", y: "cos(a)" }
sliders:
  - name: a
    min: -6
    max: 6
    step: 0.1
    default: 0.8
    label: |
      切点的横坐标$a$
:::

绿色直线是蓝色曲线$\sin x$在$x=a$处的:term[切线]{id="math.calculus.tangent-line"}，它的斜率等于橙色曲线$\cos x$在同一个$a$处的高度。拖动$a$：在$\sin x$的波峰、波谷处切线变成水平，橙色曲线上的点正好落在横轴上；$a=0$时切线是$y=x$，斜率$1$就是:term[第一个重要极限]{id="math.calculus.first-special-limit"}。

## 例题

### 例 1　乘积和商

求$y=x^2e^x$和$y=\frac{\ln x}{x}$（$x>0$）的:term[导数]{id="math.calculus.derivative"}，并找出曲线$y=\frac{\ln x}x$上:term[切线]{id="math.calculus.tangent-line"}水平的点。

**为什么想到这么做**：第一个是$x^2$和$e^x$的乘积，第二个是$\ln x$和$x$的商，各因子的导数都在表里，用:term[乘积法则]{id="math.calculus.product-rule"}和:term[商法则]{id="math.calculus.quotient-rule"}。

**推导**：$(x^2e^x)'=2x\cdot e^x+x^2\cdot e^x=x(x+2)e^x$。$\Bigl(\frac{\ln x}x\Bigr)'=\frac{\frac1x\cdot x-\ln x\cdot1}{x^2}=\frac{1-\ln x}{x^2}$，它等于$0$当且仅当$\ln x=1$，即$x=e$。所以切线水平的点是$\bigl(e,\frac1e\bigr)$。

### 例 2　切线水平的点有无穷多个

曲线$y=e^x\sin x$上，哪些点的:term[切线]{id="math.calculus.tangent-line"}是水平的？

**为什么想到这么做**：切线水平就是:term[导数]{id="math.calculus.derivative"}为$0$。$y$是$e^x$和$\sin x$的乘积，用:term[乘积法则]{id="math.calculus.product-rule"}求导，再解三角方程。

**推导**：$y'=e^x\sin x+e^x\cos x=e^x(\sin x+\cos x)$。$e^x>0$，所以$y'=0$当且仅当$\sin x+\cos x=0$，即$\tan x=-1$，$x=-\frac\pi4+k\pi$（$k$是整数）。这些点上$\sin x=\pm\frac{\sqrt2}2$，对应的点是$\bigl(-\frac\pi4+k\pi,\ (-1)^{k+1}\frac{\sqrt2}2e^{-\frac\pi4+k\pi}\bigr)$。

## 常见误区

- 「$(a^x)'=xa^{x-1}$。」那是幂函数的公式，$a^x$是指数函数：$(2^x)'=2^x\ln2$，在$x=1$处是$2\ln2\approx1.386$，不是$1$。
- 「$(\cos x)'=\sin x$。」$\cos x$在$(0,\pi)$上一直在减小，:term[导数]{id="math.calculus.derivative"}应当为负，正确的是$-\sin x$。
- 「角用角度时，$(\sin x)'=\cos x$照样成立。」角度制下导数多出因子$\frac\pi{180}$，公式只对弧度成立。

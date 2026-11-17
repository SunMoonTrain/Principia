---
id: math.calculus.substitution
title: |
  换元积分法
goal: |
  会用第一类和第二类换元法求不定积分，并在定积分里换元。
prerequisites: [math.calculus.fundamental-theorem]
minutes: 28
summary: |
  $\int f(\varphi(x))\varphi'(x)\,\dd x=\int f(u)\,\dd u$；定积分换元时上下限跟着换。
status: reviewed
---

## 这一节要回答的问题

$\cos2x$、$e^{3x}$、$2xe^{x^2}$的:term[原函数]{id="math.calculus.antiderivative"}（antiderivative）是什么？[原函数与不定积分](lesson:math.calculus.antiderivatives)的基本积分表里只有$\cos x$、$e^x$这样的简单函数，求导时却有:term[链式法则]{id="math.calculus.chain-rule"}（chain rule）对付复合函数。把链式法则倒过来，能不能求复合函数的:term[不定积分]{id="math.calculus.indefinite-integral"}（indefinite integral）？算:term[定积分]{id="math.calculus.definite-integral"}（definite integral）时换了变量，上下限又该怎么办？

## 讲解

### 第一类换元法

::anchor{id="def-integration-by-substitution"}
把:term[积分变量]{id="math.calculus.integration-variable"}（variable of integration）换成新的变量，使:term[被积函数]{id="math.calculus.integrand"}（integrand）变简单，这样求积分的方法叫作:term[换元积分法]{id="math.calculus.integration-by-substitution"}（integration by substitution）。它有两种用法：把式子里的一块看成新变量，或者把原来的变量写成新变量的函数。

::anchor{id="thm-substitution-first"}
**定理（:term[第一类换元法]{id="math.calculus.substitution-first-kind"}，substitution of the first kind）**　设$F'(u)=f(u)$，$u=\varphi(x)$:term[可导]{id="math.calculus.differentiable"}（differentiable），则$\int f\bigl(\varphi(x)\bigr)\varphi'(x)\,\dd x=F\bigl(\varphi(x)\bigr)+C$。

道理：由:term[链式法则]{id="math.calculus.chain-rule"}，$\bigl[F(\varphi(x))\bigr]'=f\bigl(\varphi(x)\bigr)\varphi'(x)$。按:term[导数]{id="math.calculus.derivative"}（derivative）的记号$\dv ux=\varphi'(x)$，形式上写成$\dd u=\varphi'(x)\,\dd x$，定理就是$\int f\bigl(\varphi(x)\bigr)\varphi'(x)\,\dd x=\int f(u)\,\dd u$：积出来，再把$u=\varphi(x)$代回去。用的时候在被积函数里找出$\varphi'(x)\,\dd x$，把它凑成$\dd u$，所以这个方法也叫凑微分法。

取$u=2x$，$\dd u=2\,\dd x$，$\int\cos2x\,\dd x=\frac12\int\cos u\,\dd u=\frac12\sin2x+C$。一般地，$a\ne0$时$\int f(ax+b)\,\dd x=\frac1aF(ax+b)+C$，比如$\int e^{3x}\,\dd x=\frac13e^{3x}+C$。$2xe^{x^2}$里的$2x\,\dd x$正好凑成$\dd u$，$u=x^2$，所以$\int2xe^{x^2}\,\dd x=e^{x^2}+C$。

边界情况：被积函数里要有$\varphi'(x)$这个因子，差一个常数倍可以补上：$\int xe^{-x^2}\,\dd x=-\frac12e^{-x^2}+C$。$\int e^{-x^2}\,\dd x$缺了因子$x$，凑不出来；它的:term[原函数]{id="math.calculus.antiderivative"}也确实写不成:term[初等函数]{id="math.calculus.elementary-function"}（elementary function），见[原函数与不定积分](lesson:math.calculus.antiderivatives)第 8 题。

### 第二类换元法

:term[被积函数]{id="math.calculus.integrand"}里有$\sqrt x$这样碍事的部分时，可以反过来令$x=t^2$，根号就没了。

::anchor{id="thm-substitution-second"}
**定理（:term[第二类换元法]{id="math.calculus.substitution-second-kind"}，substitution of the second kind）**　设$f$:term[连续]{id="math.calculus.continuous"}（continuous），$x=\psi(t)$在一个区间上有连续的:term[导数]{id="math.calculus.derivative"}并且严格单调，$G(t)$是$f\bigl(\psi(t)\bigr)\psi'(t)$的一个:term[原函数]{id="math.calculus.antiderivative"}，则$\int f(x)\,\dd x=G\bigl(\psi^{-1}(x)\bigr)+C$，其中$\psi^{-1}$是$\psi$的反函数（inverse function）。

道理：$f$连续，由:term[微积分基本定理]{id="math.calculus.fundamental-theorem-of-calculus"}（fundamental theorem of calculus），它有原函数$F$。由:term[第一类换元法]{id="math.calculus.substitution-first-kind"}，$F\bigl(\psi(t)\bigr)$是$f\bigl(\psi(t)\bigr)\psi'(t)$的原函数，所以$G(t)=F\bigl(\psi(t)\bigr)+C_1$；代入$t=\psi^{-1}(x)$，得$G\bigl(\psi^{-1}(x)\bigr)=F(x)+C_1$，正是$f$的原函数。

为什么要单调：积完要把$t$换回$x$，每个$x$只能对应一个$t$。比如$\int\frac{\dd x}{1+\sqrt x}$，令$x=t^2$（$t\ge0$），$\dd x=2t\,\dd t$，化成$\int\frac{2t}{1+t}\,\dd t=\int\Bigl(2-\frac2{1+t}\Bigr)\dd t=2t-2\ln(1+t)+C$，再代回$t=\sqrt x$，得$2\sqrt x-2\ln\bigl(1+\sqrt x\bigr)+C$。边界情况：$x=t^2$在整个实数轴上不单调，要先选定$t\ge0$这一支，$\sqrt x=t$才成立；选$t\le0$，就得写$\sqrt x=-t$。

### 定积分的换元

::anchor{id="thm-substitution-definite"}
**定理**　设$\varphi$在$[\alpha,\beta]$上有:term[连续]{id="math.calculus.continuous"}的:term[导数]{id="math.calculus.derivative"}，$f$在包含$\varphi$的所有取值的区间上连续，则$\int_\alpha^\beta f\bigl(\varphi(t)\bigr)\varphi'(t)\,\dd t=\int_{\varphi(\alpha)}^{\varphi(\beta)}f(x)\,\dd x$。

道理：设$F$是$f$的:term[原函数]{id="math.calculus.antiderivative"}。由:term[第一类换元法]{id="math.calculus.substitution-first-kind"}，$F\bigl(\varphi(t)\bigr)$是左边:term[被积函数]{id="math.calculus.integrand"}的原函数，由:term[牛顿-莱布尼茨公式]{id="math.calculus.newton-leibniz-formula"}（Newton-Leibniz formula），两边都等于$F\bigl(\varphi(\beta)\bigr)-F\bigl(\varphi(\alpha)\bigr)$。

为什么方便：上下限跟着换成新变量的范围，积完不必换回原来的变量。从左往右用是第一类：$\int_0^{\sqrt\pi}2x\cos x^2\,\dd x=\int_0^\pi\cos u\,\dd u=0$；从右往左用是第二类：令$x=\varphi(t)$，$t$从$\alpha$走到$\beta$时$x$从$a$走到$b$（例 2）。这里不要求$\varphi$单调，只要$\varphi'$连续。两个常用的特例：$\int_a^bf(x+c)\,\dd x=\int_{a+c}^{b+c}f(u)\,\dd u$，图形左右平移，面积不变；$\int_a^bf(kx)\,\dd x=\frac1k\int_{ka}^{kb}f(u)\,\dd u$（$k\ne0$），图形左右伸缩，面积跟着变。

边界情况：被积函数要整个写成新变量的函数。$\int_{-1}^1x^2\,\dd x$令$u=x^2$，$x^2\,\dd x=\frac x2\,\dd u$里还剩一个$x$，它在$[-1,0]$上是$-\sqrt u$，在$[0,1]$上是$\sqrt u$，要分两段换；一律写成$\sqrt u$，就会得到$\int_1^1\frac{\sqrt u}2\,\dd u=0$，而正确答案是$\frac23$（第 8 题）。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-0.2, 5], y: [-3, 2.3] }
functions:
  - expr: "2*x*cos(x^2) + 0*sqrt(x*(b - x))"
    label: |
      $y=2x\cos x^2$，$0\le x\le b$
  - expr: "cos(x) + 0*sqrt(x*(b^2 - x))"
    label: |
      $y=\cos u$，$0\le u\le b^2$
  - expr: "sin(x^2) + 0*sqrt(x*(b - x))"
    label: |
      $\int_0^x2t\cos t^2\,\dd t=\sin x^2$
  - expr: "sin(x) + 0*sqrt(x*(b^2 - x))"
    label: |
      $\int_0^u\cos s\,\dd s=\sin u$
points:
  - { x: "b", y: "sin(b^2)" }
  - { x: "b^2", y: "sin(b^2)" }
sliders:
  - name: b
    min: 0.5
    max: 2.2
    step: 0.02
    default: 1.2
    label: |
      积分上限$b$
:::

横轴同时当$x$轴和$u$轴用。蓝色曲线$y=2x\cos x^2$画在$[0,b]$上，橙色曲线$y=\cos u$画在$[0,b^2]$上；绿色、紫色曲线分别是它们从$0$积起的积分。拖动$b$，两个圆点总在同一高度$\sin b^2$：$\int_0^b2x\cos x^2\,\dd x=\int_0^{b^2}\cos u\,\dd u$。$x$处的一窄条宽$\dd x$、高$2x\cos x^2$，对应$u=x^2$处的一窄条宽$\dd u=2x\,\dd x$、高$\cos u$，两条面积相等：$2x<1$的地方$u$的区间被压短、蓝色曲线相应地矮，$2x>1$的地方反过来。

## 例题

### 例 1　两个凑微分

求$\int\tan x\,\dd x$和$\int\frac{\dd x}{x\ln x}$。

**为什么想到这么做**：$\tan x=\frac{\sin x}{\cos x}$，分子$\sin x$差一个负号就是$\cos x$的:term[导数]{id="math.calculus.derivative"}，令$u=\cos x$。$\frac1{x\ln x}$里，$\frac1x$正是$\ln x$的导数，令$u=\ln x$。

**推导**：$u=\cos x$，$\dd u=-\sin x\,\dd x$，$\int\tan x\,\dd x=-\int\frac{\dd u}u=-\ln|\cos x|+C$。$u=\ln x$，$\dd u=\frac{\dd x}x$，$\int\frac{\dd x}{x\ln x}=\int\frac{\dd u}u=\ln\bigl|\ln x\bigr|+C$。

### 例 2　去掉根号

求$\int_1^4\frac{\dd x}{x+\sqrt x}$。

**为什么想到这么做**：麻烦在$\sqrt x$，令$x=t^2$（$t\ge0$），$\sqrt x=t$。$x$从$1$走到$4$时，$t$从$1$走到$2$，上下限换成$1$和$2$，积完不必代回。

**推导**：$\dd x=2t\,\dd t$，所以

$$
\int_1^4\frac{\dd x}{x+\sqrt x}=\int_1^2\frac{2t\,\dd t}{t^2+t}=\int_1^2\frac{2\,\dd t}{t+1}=2\ln(t+1)\Big|_1^2=2\ln\frac32.
$$

## 常见误区

- 「$\int\cos2x\,\dd x=\sin2x+C$。」求导验算：$(\sin2x)'=2\cos2x$，多了因子$2$，正确的是$\frac12\sin2x+C$。
- 「:term[定积分]{id="math.calculus.definite-integral"}换元以后，上下限不用换。」$\int_0^{\sqrt\pi}2x\cos x^2\,\dd x$令$u=x^2$，$u$的范围是$[0,\pi]$；照抄$[0,\sqrt\pi]$，就得到错误的$\sin\sqrt\pi$。要么换限、不代回，要么代回、用原来的限，不能混着来。
- 「换元时只换:term[被积函数]{id="math.calculus.integrand"}里的$x$，$\dd x$不用管。」$\int_0^1\sqrt x\,\dd x$令$x=t^2$，要连$\dd x=2t\,\dd t$一起换，得$\int_0^12t^2\,\dd t=\frac23$；写成$\int_0^1t\,\dd t=\frac12$就错了。

---
id: math.ode.variation-of-parameters
title: |
  常数变易法
goal: |
  会用常数变易法求非齐次线性方程的特解。
prerequisites: [math.ode.constant-coefficients]
minutes: 30
summary: |
  把通解里的常数换成函数，再加一个条件，就能解出特解的公式。
status: reviewed
---

## 这一节要回答的问题

[待定系数法](lesson:math.ode.undetermined-coefficients)（method of undetermined coefficients）要求右边是多项式、指数函数、正弦余弦，碰到$y''+y=\tan x$就无能为力。解:term[一阶线性方程]{id="math.ode.linear-first-order-equation"}（first-order linear equation）时有另一个办法：把齐次方程（homogeneous equation）的:term[通解]{id="math.ode.general-solution"}（general solution）里的常数换成待定的函数，代回去求出这个函数。这个办法能不能推广到二阶方程，而且不挑右边是什么样子？

## 讲解

### 一阶时的做法

回顾[一阶线性方程](lesson:math.ode.linear-first-order)：$y'+p(x)y=q(x)$对应的齐次方程有:term[通解]{id="math.ode.general-solution"}$Ce^{-P(x)}$，$P$是$p$的一个原函数。把常数$C$换成待定的函数$C(x)$，代入后含$C$的两项抵消，剩下$C'(x)e^{-P(x)}=q(x)$，求原函数就得到$C(x)$，结果和用:term[积分因子]{id="math.ode.integrating-factor"}（integrating factor）解出的完全一样。

### 推广到二阶

对$y''+p(x)y'+q(x)y=g(x)$，设$y_1$、$y_2$是齐次方程的:term[基本解组]{id="math.ode.fundamental-set"}（fundamental set of solutions），把:term[通解]{id="math.ode.general-solution"}$C_1y_1+C_2y_2$里的常数换成函数：$y=u_1(x)y_1+u_2(x)y_2$。两个未知函数只要满足一个方程，可以再加一个条件，让计算变简单。求导得$y'=u_1y_1'+u_2y_2'+(u_1'y_1+u_2'y_2)$，要求括号里为零，$y'$就和$u_1$、$u_2$是常数时一样；再求一次导代入方程，$y_1$、$y_2$满足齐次方程的那些项都抵消，只剩$u_1'y_1'+u_2'y_2'=g$。

::anchor{id="def-variation-of-parameters"}
把齐次方程通解里的常数换成待定的函数，设$y=u_1y_1+u_2y_2$，并要求$u_1'y_1+u_2'y_2=0$，再由方程定出$u_1'$、$u_2'$，这种求:term[特解]{id="math.ode.particular-solution"}（particular solution）的方法叫作:term[常数变易法]{id="math.ode.variation-of-parameters-method"}（variation of parameters）。

为什么这样定义：附加的条件让$y'$里不出现$u_1'$、$u_2'$，于是$y''$里只出现它们的一阶导数，$u_1'$、$u_2'$满足的是一个二元一次方程组，而不是新的二阶方程。边界情况：一阶方程只有一个常数，不需要附加条件，就是上面一阶时的做法。

::anchor{id="thm-variation-formula"}
**常数变易公式**　设$p$、$q$、$g$在区间$I$上连续，$y_1$、$y_2$是齐次方程的基本解组，$W$是它们的:term[朗斯基行列式]{id="math.ode.wronskian"}（Wronskian）。则$u_1'=-\frac{y_2g}{W}$、$u_2'=\frac{y_1g}{W}$，任取它们的原函数$u_1$、$u_2$，$y_p=u_1y_1+u_2y_2$就是$y''+py'+qy=g$的一个特解。

**证明思路**：$u_1'$、$u_2'$满足方程组$u_1'y_1+u_2'y_2=0$、$u_1'y_1'+u_2'y_2'=g$，它的系数正好组成朗斯基行列式，由[阿贝尔公式](lesson:math.ode.second-order-linear#thm-abel)（Abel's formula），$W$处处不为零，消元即得上面的解。验证：记$L[y]=y''+py'+qy$，由附加条件$y_p'=u_1y_1'+u_2y_2'$，于是$L[y_p]=u_1L[y_1]+u_2L[y_2]+u_1'y_1'+u_2'y_2'=g$。详细的推导见第 5 题。

把原函数写成从$x_0$开始的积分，特解可以合成一个积分：

$$
y_p(x)=\int_{x_0}^{x}\frac{y_1(s)y_2(x)-y_1(x)y_2(s)}{W(s)}\,g(s)\dd s ,
$$

它满足$y_p(x_0)=y_p'(x_0)=0$（第 6 题）。例如$y''+y=g$时，$y_1=\cos x$、$y_2=\sin x$、$W=1$，$y_p(x)=\int_{x_0}^{x}\sin(x-s)g(s)\dd s$：每一时刻$s$的外力$g(s)$引起一个$\sin(x-s)$的响应，特解是这些响应的叠加，以后在[阶跃函数、冲激与卷积](lesson:math.ode.convolution-impulse)里还会见到。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-1.5, 1.5], y: [-1.5, 1.5] }
functions:
  - expr: "-cos(x) * ln(1/cos(x) + tan(x))"
    label: |
      特解$y_p$
  - expr: "(sin(c) - ln(1/cos(c) + tan(c))) * cos(x) - cos(c) * sin(x)"
    label: |
      冻结在$x=c$处的齐次解
points:
  - { x: "c", y: "-cos(c) * ln(1/cos(c) + tan(c))" }
sliders:
  - name: c
    min: -1.3
    max: 1.3
    step: 0.05
    default: 0.6
    label: |
      冻结的位置$c$
:::

一条曲线是$y''+y=\tan x$在$\bigl(-\frac\pi2,\frac\pi2\bigr)$上的:term[特解]{id="math.ode.particular-solution"}$y_p=u_1\cos x+u_2\sin x$（例 1）；另一条是把$u_1$、$u_2$在$x=c$处的值冻结成常数，得到的齐次方程的解$u_1(c)\cos x+u_2(c)\sin x$。拖动$c$：两条曲线在$x=c$处不但相交，而且相切，因为附加条件$u_1'y_1+u_2'y_2=0$正是让$y_p'$也等于冻结后的导数。所以$y_p$在每一点都和一条齐次方程的解贴在一起，只是贴着的那一条随点慢慢变，「常数变易」这个名字说的正是这件事。

## 例题

### 例 1　右边是$\tan x$

求$y''+y=\tan x$在$\bigl(-\frac\pi2,\frac\pi2\bigr)$上的一个:term[特解]{id="math.ode.particular-solution"}。

**为什么想到这么做**：$\tan x$的各阶导数越来越复杂，:term[待定系数法]{id="math.ode.method-of-undetermined-coefficients"}用不上；齐次方程的:term[基本解组]{id="math.ode.fundamental-set"}$\cos x$、$\sin x$是现成的，用常数变易公式。

**推导**：$W(\cos x,\sin x)=1$。$u_1'=-\sin x\tan x=-\frac{\sin^2x}{\cos x}=\cos x-\frac{1}{\cos x}$，取$u_1=\sin x-\ln\bigl(\frac{1}{\cos x}+\tan x\bigr)$，求导即可验证；$u_2'=\cos x\tan x=\sin x$，取$u_2=-\cos x$。所以$y_p=u_1\cos x+u_2\sin x=-\cos x\ln\bigl(\frac{1}{\cos x}+\tan x\bigr)$，$\sin x\cos x$的两项抵消了。

### 例 2　变系数的方程

已知$y_1=x$、$y_2=x^2$是$x^2y''-2xy'+2y=0$（$x>0$）的:term[基本解组]{id="math.ode.fundamental-set"}，求$x^2y''-2xy'+2y=x^3$的一个:term[特解]{id="math.ode.particular-solution"}。

**为什么想到这么做**：:term[常数变易法]{id="math.ode.variation-of-parameters-method"}只要知道基本解组，不要求系数是常数。但公式里的$g$是标准形式$y''+py'+qy=g$的右边，要先把方程两边除以$x^2$。

**推导**：标准形式是$y''-\frac2xy'+\frac2{x^2}y=x$，所以$g=x$，不是$x^3$。$W=x\cdot2x-1\cdot x^2=x^2$，$u_1'=-\frac{x^2\cdot x}{x^2}=-x$，$u_2'=\frac{x\cdot x}{x^2}=1$，取$u_1=-\frac{x^2}{2}$、$u_2=x$。$y_p=-\frac{x^3}{2}+x^3=\frac{x^3}{2}$；代回验证，$x^2\cdot3x-2x\cdot\frac{3x^2}{2}+2\cdot\frac{x^3}{2}=x^3$。

## 常见误区

- 「公式里的$g$就是原方程的右边。」要先化成首项系数为$1$的标准形式，$g$是那时的右边（例 2）。
- 「附加条件$u_1'y_1+u_2'y_2=0$是从方程推出来的。」它是我们自己加的：两个未知函数只要满足一个方程，有余地再要求一件事，这样选让$u_1'$、$u_2'$满足一阶的方程组。
- 「求原函数时漏了常数，:term[特解]{id="math.ode.particular-solution"}就错了。」不会错：常数多出来的$C_1y_1+C_2y_2$是齐次方程的解，加上它仍是特解。
- 「:term[常数变易法]{id="math.ode.variation-of-parameters-method"}只能用于常系数方程。」只要知道齐次方程的:term[基本解组]{id="math.ode.fundamental-set"}就能用（例 2）；常系数时，基本解组由:term[特征方程]{id="math.ode.characteristic-equation"}（characteristic equation）直接写出来。

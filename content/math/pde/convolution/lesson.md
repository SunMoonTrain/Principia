---
id: math.pde.convolution
title: |
  卷积与卷积定理
goal: |
  会计算两个函数的卷积，并用卷积定理把卷积的傅里叶变换化成两个变换的乘积。
prerequisites: [math.pde.fourier-inversion, math.calculus.dirac-delta]
minutes: 25
summary: |
  $f*g$是平移的$f$按$g$加权叠加；两者绝对可积、一个有界时，$\widehat{f*g}=\hat f\hat g$。
status: reviewed
---

## 这一节要回答的问题

相机没有对准焦，照片就糊了：每一点的亮度变成了它周围一小片亮度的加权平均。这样把一个函数「抹开」，怎样用式子写？抹开以后，它的:term[傅里叶变换]{id="math.pde.fourier-transform"}（Fourier transform）和原来的有什么关系？

## 讲解

### 卷积

最简单的抹开是取平均：把$f$在$x$处的值换成它在$[x-h,x+h]$上的平均值（$h>0$）。令$s=x-y$换元，

$$
\frac1{2h}\int_{x-h}^{x+h}f(s)\dd s=\int_{-h}^{h}f(x-y)\,\frac{\dd y}{2h}.
$$

记$g$为宽$2h$、高$\frac1{2h}$的矩形：$|y|\le h$时$g(y)=\frac1{2h}$，其余为$0$。右边就是$\int_{-\infty}^{+\infty}f(x-y)g(y)\dd y$：把$f$向右平移$y$，按权重$g(y)\dd y$加起来。照片糊了也是这样，权重之和仍是$1$，只是不再处处相等，离得近的点占的份量大。

::anchor{id="def-convolution"}
设$f$、$g$中一个有界、在每个有限区间上可积（integrable），另一个:term[绝对可积]{id="math.pde.absolutely-integrable"}（absolutely integrable）。函数$(f*g)(x)=\int_{-\infty}^{+\infty}f(x-y)g(y)\dd y$叫作$f$和$g$的:term[卷积]{id="math.pde.convolution"}（convolution）。

为什么这样定义：$f(x-y)$是把$f$向右平移$y$，$g(y)\dd y$是这一份的权重，卷积把平移到各处的$f$按$g$加权叠加。设$|f|\le M$，则$|f(x-y)g(y)|\le M|g(y)|$，由[无穷区间上的反常积分](lesson:math.calculus.improper-integrals#thm-improper-comparison)的比较判别法（comparison test），积分对每个$x$都绝对收敛（absolutely convergent）；$g$有界时同理。那一节设被积函数连续，有跳跃时判别法照样成立，见[傅里叶变换](lesson:math.pde.fourier-transform#def-absolutely-integrable)一节。先在$[-R,R]$上换元$y\to x-y$（有跳跃也成立，见那一节定理 1），再令$R\to+\infty$，得$f*g=g*f$，所以哪一个有界都一样。

边界情况：$f$、$g$在$x<0$时都为$0$，则$f(x-y)g(y)$只在$0\le y\le x$上可能不为$0$，所以$x>0$时$(f*g)(x)=\int_0^xf(x-y)g(y)\dd y$，$x\le0$时$(f*g)(x)=0$。常微分方程[阶跃函数、冲激与卷积](lesson:math.ode.convolution-impulse#def-convolution)一节从$0$积到$t$的卷积，就是这种情形。

$g$越窄，抹得越轻。取[狄拉克 δ 函数](lesson:math.calculus.dirac-delta#def-dirac-delta)一节高$\frac1\varepsilon$、宽$\varepsilon$的矩形尖峰$\delta_\varepsilon$，设$f$和它照定义能做卷积，并且$f$在包含$x$的一个开区间上连续。把$f(x-y)$看成$y$的函数，由筛选性质（sifting property），$\varepsilon\to0^+$时$(f*\delta_\varepsilon)(x)=\int_{-\infty}^{+\infty}f(x-y)\delta_\varepsilon(y)\dd y\to f(x)$：面积为$1$的窄尖峰几乎不把$f$抹开，$\delta$在卷积里的作用就像乘法里的$1$。换成那一节第 6 题的三角形尖峰，结论也一样。

### 卷积定理

例 1 会算出：两个宽为$2$的矩形的:term[卷积]{id="math.pde.convolution"}是三角形$2-|x|$，三角形的:term[傅里叶变换]{id="math.pde.fourier-transform"}正好是矩形的变换$\frac{2\sin\xi}\xi$的平方，$\xi$是:term[频率变量]{id="math.pde.frequency-variable"}（frequency variable）。这不是巧合。$f*g$是许多平移过的$f$按权重$g(y)\dd y$叠加起来的，平移$y$只让变换乘上$e^{-i\xi y}$（[傅里叶变换](lesson:math.pde.fourier-transform#thm-fourier-properties)一节定理 1（1））。加起来，正是$\hat f(\xi)\int_{-\infty}^{+\infty}g(y)e^{-i\xi y}\dd y=\hat f(\xi)\hat g(\xi)$。

::anchor{id="thm-convolution"}
**定理（:term[卷积定理]{id="math.pde.convolution-theorem"}，convolution theorem）**　设$f$、$g$都:term[绝对可积]{id="math.pde.absolutely-integrable"}，其中一个有界，则$f*g$也绝对可积，并且对一切$\xi$，$\widehat{f*g}(\xi)=\hat f(\xi)\,\hat g(\xi)$。

**证明思路**：把卷积代进变换，交换两个积分的次序，再把$e^{-i\xi x}$拆成$e^{-i\xi(x-y)}e^{-i\xi y}$：

$$
\widehat{f*g}(\xi)=\int_{-\infty}^{+\infty}g(y)e^{-i\xi y}\Bigl(\int_{-\infty}^{+\infty}f(x-y)e^{-i\xi(x-y)}\dd x\Bigr)\dd y=\hat f(\xi)\,\hat g(\xi),
$$

里层令$s=x-y$就是$\hat f(\xi)$。被积函数的绝对值在整个平面上的积分是$\int|f|\dd x\cdot\int|g|\dd y$，有限，这时可以交换次序，这里不证（闭矩形上的连续函数见[二重积分](lesson:math.vector-calculus.double-integrals#thm-fubini)的富比尼定理（Fubini's theorem））。同样地交换次序，得$\int|f*g|\dd x\le\int|f|\dd x\int|g|\dd y$；$f*g$又是连续的（这里不证），所以它绝对可积。光学[夫琅禾费衍射与傅里叶变换](lesson:physics.optics.fourier-optics#thm-convolution)一节说「严格的证明要交换两重积分的次序」，指的就是这一步。

为什么有用：卷积在$x$这边是一个积分，到了频率这边只是乘法。取$\xi=0$，得$\int(f*g)\dd x=\int f\dd x\int g\dd y$：$g\ge0$、积分为$1$时，抹开不改变总量，照片糊了，总的亮度不变。反过来，看出一个变换是两个变换之积，由[傅里叶反演公式](lesson:math.pde.fourier-inversion#thm-uniqueness)一节的推论（函数满足那里的条件时），就能认出原来的函数是一个卷积（例 2）；[热核与无界区域上的热方程](lesson:math.pde.heat-kernel)一节就这样把解写成卷积。

边界情况：常数$1$有界，$f$绝对可积时$(f*1)(x)=\int_{-\infty}^{+\infty}f(y)\dd y$是常数，不为$0$时不绝对可积，没有变换，$1$本身也没有：定理要求两个函数都绝对可积。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-4, 4], y: [0, 1.8] }
functions:
  - expr: "1 + 0*sqrt(1 - abs(x))"
    label: |
      $g(y)$
  - expr: "exp(-(p - x)^2)"
    label: |
      $f(x-y)$
  - expr: "exp(-(p - x)^2) + 0*sqrt(1 - abs(x))"
    label: |
      $f(x-y)g(y)$
  - expr: "sum(k, 0, 39, exp(-(x - (-1 + (k + 0.5)/20))^2))/20"
    label: |
      $f*g$
points:
  - { x: "p", y: "sum(k, 0, 39, exp(-(p - (-1 + (k + 0.5)/20))^2))/20" }
sliders:
  - name: p
    min: -3
    max: 3
    step: 0.05
    default: -1.5
    label: |
      卷积的自变量$x$
:::

图上$f(y)=e^{-y^2}$，$g$是宽为$2$的矩形（$|y|<1$时为$1$，其余为$0$）。横轴图上写作 x，前三条线里它是积分变量$y$（纵轴图上写作 y，只表示函数值）：蓝线是$g$的顶边，橙线是把$f$左右翻转、再平移到$x$处的$f(x-y)$（$f$是偶函数，翻转后不变），绿线是乘积$f(x-y)g(y)$（矩形以外乘积为$0$，没有画），绿线下的面积就是$(f*g)(x)$。紫线是:term[卷积]{id="math.pde.convolution"}$f*g$本身，对它来说横轴就是$x$。拖动滑块改变$x$：橙线滑过矩形，绿线下的面积先变大、后变小，圆点$\bigl(x,(f*g)(x)\bigr)$沿紫线移动；矩形陡直的两边被抹成了缓坡。

## 例题

### 例 1　两个矩形的卷积

设$g(x)=1$（$|x|<1$），$g(x)=0$（其余）。求$g*g$，并验证:term[卷积定理]{id="math.pde.convolution-theorem"}。

**为什么想到这么做**：$g(x-y)g(y)$只在$|x-y|<1$、$|y|<1$同时成立时等于$1$，其余为$0$，所以$(g*g)(x)$就是区间$(x-1,x+1)$和$(-1,1)$重叠部分的长度。

**推导**：$|x|\ge2$时两个区间不重叠，$(g*g)(x)=0$；$0\le x<2$时重叠部分是$(x-1,1)$，长$2-x$；$-2<x<0$时是$(-1,x+1)$，长$2+x$。所以

$$
(g*g)(x)=\begin{cases}2-|x|,&|x|\le2,\\0,&|x|>2,\end{cases}
$$

两个矩形卷成了一个三角形。由[傅里叶变换](lesson:math.pde.fourier-transform)一节，矩形$g$的:term[傅里叶变换]{id="math.pde.fourier-transform"}是$\hat g(\xi)=\frac{2\sin\xi}\xi$。三角形是偶函数，它的变换是$2\int_0^2(2-x)\cos\xi x\dd x$，分部积分（integration by parts）一次得$\frac{2(1-\cos2\xi)}{\xi^2}=\bigl(\frac{2\sin\xi}\xi\bigr)^2$（$\xi\ne0$；$\xi=0$时两边都是$4$），正是$\hat g(\xi)^2$。

三角形连续、分段光滑（piecewise smooth），它的变换:term[绝对可积]{id="math.pde.absolutely-integrable"}。由:term[反演公式]{id="math.pde.fourier-inversion-formula"}（Fourier inversion formula），在$x=0$处$2=\frac1{2\pi}\int_{-\infty}^{+\infty}\frac{4\sin^2\xi}{\xi^2}\dd\xi$，即$\int_0^{+\infty}\frac{\sin^2\xi}{\xi^2}\dd\xi=\frac\pi2$。复分析[柯西主值与实轴上的极点](lesson:math.complex-analysis.cauchy-principal-value)第 5 题换了一种办法，算的也是它。

### 例 2　两个高斯函数的卷积

设$a>0$，$b>0$。求$e^{-ax^2}*e^{-bx^2}$。

**为什么想到这么做**：直接积分要配方。中心在原点的:term[高斯函数]{id="math.pde.gaussian-function"}（Gaussian function），:term[傅里叶变换]{id="math.pde.fourier-transform"}还是中心在原点的高斯函数（[傅里叶反演公式](lesson:math.pde.fourier-inversion#thm-gaussian-transform)一节定理 1），由:term[卷积定理]{id="math.pde.convolution-theorem"}，:term[卷积]{id="math.pde.convolution"}的变换是两个这样的高斯函数之积，仍是这样的高斯函数，认出它是谁的变换就行。

**推导**：由卷积定理和那一节定理 1，$e^{-ax^2}*e^{-bx^2}$的变换是

$$
\sqrt{\frac\pi a}\,e^{-\xi^2/(4a)}\cdot\sqrt{\frac\pi b}\,e^{-\xi^2/(4b)}=\frac\pi{\sqrt{ab}}\,e^{-\xi^2/(4c)},\qquad c=\frac{ab}{a+b},
$$

这里$\frac1{4c}=\frac1{4a}+\frac1{4b}$。由同一个定理，$\sqrt{\frac\pi{a+b}}\,e^{-cx^2}$的变换是$\sqrt{\frac\pi{a+b}}\sqrt{\frac\pi c}\,e^{-\xi^2/(4c)}=\frac\pi{\sqrt{ab}}\,e^{-\xi^2/(4c)}$，和上式相同。

两者都连续、:term[绝对可积]{id="math.pde.absolutely-integrable"}，处处有连续的导数。卷积可以在积分号下求导（differentiation under the integral sign）：被积函数对$x$的导数的绝对值$2a|x-y|e^{-a(x-y)^2}e^{-by^2}\le\sqrt{2a/e}\,e^{-by^2}$（$2a|t|e^{-at^2}$的最大值是$\sqrt{2a/e}$），右端连续、积分收敛，满足[含参变量积分](lesson:math.analysis.parameter-integrals#thm-leibniz-improper)一节定理 4 的条件（正、负半轴分开用）。求出的导数是有界、绝对可积的$-2axe^{-ax^2}$和$e^{-bx^2}$的卷积，所以也连续（见卷积定理的证明思路）。由[傅里叶反演公式](lesson:math.pde.fourier-inversion#thm-uniqueness)一节的推论，

$$
e^{-ax^2}*e^{-bx^2}=\sqrt{\frac\pi{a+b}}\,e^{-\frac{ab}{a+b}x^2}.
$$

$e^{-ax^2}$的宽度和$\frac1{\sqrt a}$成正比，而$\frac1c=\frac1a+\frac1b$：卷积以后，宽度的平方是两个宽度的平方之和。

## 常见误区

- 「乘积$fg$的:term[傅里叶变换]{id="math.pde.fourier-transform"}是$\hat f\hat g$。」两个变换之积对应的是:term[卷积]{id="math.pde.convolution"}，不是乘积。例 1 的矩形满足$g\cdot g=g$，乘积的变换就是$\frac{2\sin\xi}\xi$，并不是它的平方。
- 「卷积就是把$f$平移到$x$处，再和$g$相乘、积分：$(f*g)(x)=\int_{-\infty}^{+\infty}f(y-x)g(y)\dd y$。」$f(x-y)$作为$y$的函数，是把$f$先左右翻转、再平移到$x$处。少了翻转，$f$不是偶函数时结果一般就不同：例如$f$、$g$都是$[0,1]$上高为$1$的矩形，$f*g$在$x=1$处最大，$\int_{-\infty}^{+\infty}f(y-x)g(y)\dd y$却在$x=0$处最大。

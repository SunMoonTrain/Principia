---
id: math.pde.fourier-transform
title: |
  傅里叶变换
goal: |
  会求常见函数的傅里叶变换，并使用平移、伸缩和求导的性质。
prerequisites: [math.analysis.fourier-series, math.complex-analysis.complex-exponential, math.calculus.substitution]
minutes: 30
summary: |
  $\hat f(\xi)=\int fe^{-i\xi x}\dd x$；平移改相位，伸缩宽窄相反；$f$连续、$f'$绝对可积时求导乘$i\xi$。
status: reviewed
---

## 这一节要回答的问题

[傅里叶级数](lesson:math.analysis.fourier-series)（Fourier series）把周期函数拆成频率分立的正弦和余弦。一个只在有限范围里不为零的脉冲没有周期，它能不能也拆成各种频率的成分？各个频率的成分有多少，怎样算？把函数平移、拉宽或者求导，这些成分又怎样变？

## 讲解

### 复数形式的傅里叶级数

由欧拉公式（Euler's formula），$\cos\theta=\frac{e^{i\theta}+e^{-i\theta}}2$，$\sin\theta=\frac{e^{i\theta}-e^{-i\theta}}{2i}$。代进[傅里叶级数](lesson:math.analysis.fourier-series#def-fourier-series-2l)一节周期为$2L$的级数，第$n$项变成

$$
a_n\cos\frac{n\pi x}L+b_n\sin\frac{n\pi x}L=\frac{a_n-ib_n}2e^{in\pi x/L}+\frac{a_n+ib_n}2e^{-in\pi x/L}.
$$

一对正弦、余弦换成了频率为$\pm\frac{n\pi}L$的两个复指数函数（complex exponential function）。

::anchor{id="def-complex-fourier-series"}
设$f$在$[-L,L]$上可积（integrable），对每个整数$n$令$c_n=\frac1{2L}\int_{-L}^{L}f(x)e^{-in\pi x/L}\dd x$。级数$\sum_{n=-\infty}^{\infty}c_ne^{in\pi x/L}$叫作$f$的复数形式的傅里叶级数（complex Fourier series），它的和按对称的部分和$\sum_{n=-N}^{N}$在$N\to\infty$时的极限理解。

为什么这样定义：$k$是非零整数时，由[欧拉公式与复指数](lesson:math.complex-analysis.complex-exponential#thm-exp-derivative)的积分公式，$\int_{-L}^{L}e^{ik\pi x/L}\dd x=\frac{L}{ik\pi}\bigl(e^{ik\pi}-e^{-ik\pi}\bigr)=0$。所以若$f=\sum c_me^{im\pi x/L}$且能逐项积分，两边乘上$e^{-in\pi x/L}$再积分，右边只剩$2Lc_n$，系数只能这样取。和上式对照，$c_0=\frac{a_0}2$，$c_{\pm n}=\frac{a_n\mp ib_n}2$，对称的部分和就是原来的部分和。边界情况：[傅里叶级数](lesson:math.analysis.fourier-series)一节例 2 的方波有$c_{\pm n}=\mp\frac{2i}{n\pi}$（$n$为正奇数），在$x=0$处只取$n>0$的一半是发散的，对称的部分和却两两相消。

从级数到积分（启发，不是证明）：设$f$只在有限的范围里不为零，取$L$大到$[-L,L]$包住这个范围。记$\xi_n=\frac{n\pi}L$，相邻两个相差$\Delta\xi=\frac\pi L$，于是

$$
\sum_{n=-\infty}^{\infty}c_ne^{i\xi_nx}=\frac1{2\pi}\sum_{n=-\infty}^{\infty}\Bigl(\int_{-\infty}^{+\infty}f(s)e^{-i\xi_ns}\dd s\Bigr)e^{i\xi_nx}\,\Delta\xi.
$$

$L\to\infty$时$\xi_n$越排越密，右边像一个黎曼和（Riemann sum），趋于对$\xi$的积分：$f$是各种频率的$e^{i\xi x}$叠加起来的，括号里的积分说的是每种频率的成分有多少。

### 傅里叶变换

宽为$a$、高为$1$的矩形：$|x|<\frac a2$时$f(x)=1$，其余为$0$。上面括号里的积分是

$$
\int_{-a/2}^{a/2}e^{-i\xi x}\dd x=\frac{e^{-i\xi a/2}-e^{i\xi a/2}}{-i\xi}=a\,\frac{\sin(\xi a/2)}{\xi a/2}\quad(\xi\ne0),
$$

$\xi=0$时是$a$。$f$在无限的范围里不为零时，这个积分是反常积分（improper integral），要对每个$\xi$都收敛才有意义。

::anchor{id="def-absolutely-integrable"}
设$f$在每个有限区间上可积，并且反常积分$\int_{-\infty}^{+\infty}|f(x)|\dd x$收敛，就说$f$:term[绝对可积]{id="math.pde.absolutely-integrable"}（absolutely integrable）。

为什么这样定义：$|f(x)e^{-i\xi x}|=|f(x)|$，所以$f$绝对可积时，$\int_{-\infty}^{+\infty}f(x)e^{-i\xi x}\dd x$的实部、虚部对每个$\xi$都绝对收敛（absolutely convergent），从而收敛（见[无穷区间上的反常积分](lesson:math.calculus.improper-integrals#def-absolute-convergence)）。那一节只对连续函数写，这里的$f$可以有跳跃：反常积分照样先在有限区间上积、再取极限，比较判别法（comparison test）和「绝对收敛则收敛」靠的是保序性（monotonicity）等，对可积的函数照样成立。边界情况：$\frac1{1+x^2}$绝对可积；$\frac1{1+|x|}$也趋于$0$，却不绝对可积，它在远处像$\frac1{|x|}$。

::anchor{id="def-fourier-transform"}
设$f$绝对可积。$\xi$的函数$\hat f(\xi)=\int_{-\infty}^{+\infty}f(x)e^{-i\xi x}\dd x$叫作$f$的:term[傅里叶变换]{id="math.pde.fourier-transform"}（Fourier transform），也记作$\mathcal F\{f\}(\xi)$；$\xi$叫作:term[频率变量]{id="math.pde.frequency-variable"}（frequency variable）。

为什么这样定义：$\hat f(\xi)$量的是$f$里按$e^{i\xi x}$变化的成分有多少，正是启发里括号中的积分；矩形的变换就是$a\frac{\sin(\xi a/2)}{\xi a/2}$。边界情况：常数$1$、$\cos x$不绝对可积，定义里的积分不收敛，它们在这个意义下没有傅里叶变换。

记号：光学[夫琅禾费衍射与傅里叶变换](lesson:physics.optics.fourier-optics)的$q$、复分析[若尔当引理与傅里叶型积分](lesson:math.complex-analysis.jordan-lemma)的$\omega$，都是这里的$\xi$。物理里:term[简谐波]{id="physics.oscillations-waves.harmonic-wave"}（harmonic wave）写成$\tilde Ae^{i(\omega t-kx)}$（见[简谐波](lesson:physics.oscillations-waves.harmonic-waves#thm-complex-wave)），空间因子$e^{-ikx}$是$\xi=-k$的成分：:term[波数]{id="physics.oscillations-waves.wave-number"}（wave number）$k$和$\xi$只差正负号，也就是只差左右。

::anchor{id="def-inverse-fourier-transform"}
反过来，对$\xi$的函数$g$，$\frac1{2\pi}\int_{-\infty}^{+\infty}g(\xi)e^{i\xi x}\dd\xi$叫作$g$的:term[傅里叶逆变换]{id="math.pde.inverse-fourier-transform"}（inverse Fourier transform），记作$\mathcal F^{-1}\{g\}(x)$；积分不绝对收敛时，按对称的极限$\lim_{R\to+\infty}\int_{-R}^{R}$理解。

为什么这样定义：照启发，$f$是各个$e^{i\xi x}$以$\frac1{2\pi}\hat f(\xi)\dd\xi$为权重叠加起来的，逆变换就是把它们加回去；它在一定条件下真的给回$f$，见[傅里叶反演公式](lesson:math.pde.fourier-inversion)。边界情况：矩形的变换的绝对值是$\frac{2|\sin(\xi a/2)|}{|\xi|}$，不绝对可积（$\frac{|\sin x|}x$的积分发散），所以要用对称的极限。

### 平移、伸缩与求导

::anchor{id="thm-fourier-properties"}
**定理 1**　设$f$:term[绝对可积]{id="math.pde.absolutely-integrable"}，$x_0$、$\xi_0$、$\alpha$是实数，$\alpha\ne0$。（1）$f(x-x_0)$的:term[傅里叶变换]{id="math.pde.fourier-transform"}是$e^{-i\xi x_0}\hat f(\xi)$；（2）$e^{i\xi_0x}f(x)$的变换是$\hat f(\xi-\xi_0)$；（3）$f(\alpha x)$的变换是$\frac1{|\alpha|}\hat f\bigl(\frac\xi\alpha\bigr)$；（4）$f$取实数值时，$\hat f(-\xi)=\overline{\hat f(\xi)}$。

**证明思路**：（1）（3）都是换元，要先在$[-R,R]$上换元，再令$R\to+\infty$：[换元积分法](lesson:math.calculus.substitution#thm-substitution-definite)（integration by substitution）只管有限区间上的连续函数；线性换元把$[-R,R]$的分割（partition）和黎曼和一一对应过去，$f$可积就成立。（1）令$y=x-x_0$，$e^{-i\xi(y+x_0)}=e^{-i\xi x_0}e^{-i\xi y}$，常数因子提到积分号外；（3）令$y=\alpha x$，$\alpha<0$时上下限对调，翻回来多一个负号，所以是$\frac1{|\alpha|}$。（2）（4）直接代：$e^{i\xi_0x}e^{-i\xi x}=e^{-i(\xi-\xi_0)x}$；$f$是实的，共轭可以移进积分号，而$\overline{e^{-i\xi x}}=e^{i\xi x}$。

为什么有用：平移只让变换乘一个模为$1$的因子，各个频率的成分大小$|\hat f|$不变；乘$e^{i\xi_0x}$反过来让变换整体平移$\xi_0$。$0<\alpha<1$时$f(\alpha x)$把$f$横向拉宽为原来的$\frac1\alpha$倍，变换却缩窄为原来的$\alpha$、高度变为$\frac1\alpha$倍：函数越宽，变换越窄。$\alpha=-1$时$f$左右翻转，变换也左右翻转；（4）说实函数的变换只要看$\xi\ge0$的一半。

::anchor{id="thm-fourier-derivative"}
**定理 2**　设$f$连续，除有限个点外可导、导数连续，并且$f$和$f'$都绝对可积，那么$f'$的变换是$i\xi\hat f(\xi)$。

**证明思路**：在$[-R,R]$上分部积分（integration by parts；有不可导的点就在那里分段，$f$连续，分点处的项抵消），

$$
\int_{-R}^{R}f'(x)e^{-i\xi x}\dd x=f(R)e^{-i\xi R}-f(-R)e^{i\xi R}+i\xi\int_{-R}^{R}f(x)e^{-i\xi x}\dd x.
$$

$f$和$f'$都绝对可积保证$f(\pm R)\to0$（第 5 题），令$R\to+\infty$，边界项消失。

为什么有用：对$x$求导变成乘$i\xi$；对$x$的:term[常系数线性常微分方程]{id="math.ode.ode"}（linear ordinary differential equation with constant coefficients）变成代数方程，:term[热方程]{id="math.pde.heat-equation"}（heat equation）对$x$作变换变成对$t$的常微分方程，[热核与无界区域上的热方程](lesson:math.pde.heat-kernel)一节就靠这一条。常微分方程的:term[拉普拉斯变换]{id="math.ode.laplace-transform"}（Laplace transform）也是一边平移、另一边乘指数（见[拉普拉斯变换](lesson:math.ode.laplace-transform#thm-laplace-shift)、[阶跃函数、冲激与卷积](lesson:math.ode.convolution-impulse#thm-second-shift)），可那里求导多出一项$-f(0)$；这里积分从$-\infty$起，两头都趋于$0$，没有这一项。边界情况：去掉「$f$连续」就不对，矩形除两个跳跃点外导数都是$0$，$i\xi\hat f(\xi)$却不是$0$。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-8, 8], y: [0, 2.4] }
functions:
  - expr: "exp(-a*abs(x))"
    label: |
      $f(x)=e^{-a|x|}$
  - expr: "2*a/(a^2 + x^2)"
    label: |
      $\hat f(\xi)=\frac{2a}{a^2+\xi^2}$
sliders:
  - name: a
    min: 1
    max: 4
    step: 0.1
    default: 1
    label: |
      衰减的快慢$a$
:::

图上是例 1 的$f$（蓝线）和它的:term[傅里叶变换]{id="math.pde.fourier-transform"}$\hat f$（橙线），横轴图上写作 x，对蓝线是$x$，对橙线是$\xi$。拖动$a$：$f$变窄，$\hat f$变矮、变宽，$\hat f(0)=\frac2a$始终等于蓝线下的面积。$f$降到一半的地方在$|x|=\frac{\ln2}a$，$\hat f$降到一半的地方在$|\xi|=a$，两者的乘积$\ln2$不随$a$变：一个越窄，另一个越宽。

## 例题

### 例 1　$e^{-a|x|}$的傅里叶变换

求$f(x)=e^{-a|x|}$（$a>0$）的:term[傅里叶变换]{id="math.pde.fourier-transform"}。这里的$a$表示衰减的快慢，和讲解里矩形的宽无关。

**为什么想到这么做**：在$x>0$、$x<0$两段上，被积函数分别是复指数$e^{-(a+i\xi)x}$和$e^{(a-i\xi)x}$，有现成的积分公式；积分限是无穷，先在有限区间上积，再取极限。

**推导**：$\int_0^{R}e^{-(a+i\xi)x}\dd x=\frac{1-e^{-(a+i\xi)R}}{a+i\xi}$，而$\bigl|e^{-(a+i\xi)R}\bigr|=e^{-aR}\to0$，所以$x>0$的一半是$\frac1{a+i\xi}$；同理，$x<0$的一半是$\frac1{a-i\xi}$。合起来

$$
\hat f(\xi)=\frac1{a+i\xi}+\frac1{a-i\xi}=\frac{2a}{a^2+\xi^2}.
$$

它是实的偶函数，这不是巧合：$f$是实的偶函数，由定理 1（3）取$\alpha=-1$，$\hat f(-\xi)=\hat f(\xi)$；再由（4），$\hat f(\xi)=\overline{\hat f(\xi)}$，是实数。

### 例 2　有限长的波列

设$L>0$，$f(x)=e^{i\xi_0x}$（$|x|<\frac L2$），$f(x)=0$（其余），这是一段有限长的波列（wave train）。求$\hat f$，并说明波列越长，$\hat f$的峰越窄。

**为什么想到这么做**：$f$就是宽为$L$的矩形乘上$e^{i\xi_0x}$，由定理 1（2），把矩形的:term[傅里叶变换]{id="math.pde.fourier-transform"}平移$\xi_0$就行。

**推导**：矩形的变换取$a=L$，再把$\xi$换成$\xi-\xi_0$：

$$
\hat f(\xi)=L\,\frac{\sin\bigl((\xi-\xi_0)L/2\bigr)}{(\xi-\xi_0)L/2}.
$$

峰在$\xi_0$处，高$L$，离峰最近的零点在$\xi_0\pm\frac{2\pi}L$。峰到这两个零点的距离乘波列的长度，等于$2\pi$，不随$L$变：波列越长，频率越集中，越短越散开。光学[相干性](lesson:physics.optics.coherence)一节说的「波越短，包含的波长范围越宽」，就是这件事。

## 常见误区

- 「:term[傅里叶变换]{id="math.pde.fourier-transform"}的定义各书都一样。」各家的约定不同：有的把$\frac1{2\pi}$放进变换里，有的正、:term[逆变换]{id="math.pde.inverse-fourier-transform"}各带$\frac1{\sqrt{2\pi}}$，有的把指数的正负号反过来。约定一换，同一个函数的变换可能差一个常数因子，或者$\xi$换成$-\xi$；指数的正负号反过来时，定理 1（1）（2）和定理 2 的式子也要改。读别的书先看清它的定义。
- 「实函数的傅里叶变换也是实函数。」一般不是：矩形向右平移$x_0$（$x_0\ne0$），变换就乘上$e^{-i\xi x_0}$，不再是实函数。实函数的变换只满足$\hat f(-\xi)=\overline{\hat f(\xi)}$。

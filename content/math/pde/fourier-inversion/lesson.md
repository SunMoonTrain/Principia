---
id: math.pde.fourier-inversion
title: |
  傅里叶反演公式
goal: |
  会求高斯函数的傅里叶变换，并用反演公式由傅里叶变换求回原来的函数。
prerequisites: [math.pde.fourier-transform, math.analysis.parameter-integrals, math.analysis.fourier-convergence]
minutes: 28
summary: |
  分段光滑的绝对可积函数，反演公式在每点给出左右极限的平均。
status: reviewed
---

## 这一节要回答的问题

[傅里叶变换](lesson:math.pde.fourier-transform)一节写出了:term[逆变换]{id="math.pde.inverse-fourier-transform"}（inverse Fourier transform），却没有证明它真能把$\hat f$变回$f$。什么条件下能？$f$有跳跃时，在跳跃点变回来的又是什么？要试一试，先得有一个:term[傅里叶变换]{id="math.pde.fourier-transform"}（Fourier transform）和逆变换都算得出来的函数，钟形的$e^{-x^2}$就是。

## 讲解

### 高斯函数的变换

钟形曲线$y=e^{-x^2}$下的面积由高斯积分（Gaussian integral）给出：$\int_{-\infty}^{+\infty}e^{-x^2}\dd x=\sqrt\pi$（见[极坐标下的二重积分](lesson:math.vector-calculus.polar-double-integrals#thm-gaussian)）。正态分布的密度也是这个形状。

::anchor{id="def-gaussian"}
设$a>0$，$A$、$x_0$是实数，$A\ne0$。函数$Ae^{-a(x-x_0)^2}$叫作:term[高斯函数]{id="math.pde.gaussian-function"}（Gaussian function），最简单的是$e^{-ax^2}$。

为什么这样定义：平移、乘非零常数只改变位置和高低（$A<0$时上下翻过来），所以一起算进来。$a$管宽窄：$e^{-ax^2}$在$|x|=\frac1{\sqrt a}$处降到峰高的$\frac1e$，$a$越大越窄；换元可知积分是$A\sqrt{\pi/a}$（[极坐标下的二重积分](lesson:math.vector-calculus.polar-double-integrals)第 7 题）。边界情况：$a\le0$时$e^{-ax^2}$不趋于$0$，不:term[绝对可积]{id="math.pde.absolutely-integrable"}（absolutely integrable），不算高斯函数。

::anchor{id="thm-gaussian-transform"}
**定理 1**　设$a>0$，则$e^{-ax^2}$的:term[傅里叶变换]{id="math.pde.fourier-transform"}是$\sqrt{\frac\pi a}\,e^{-\xi^2/(4a)}$，$\xi$是:term[频率变量]{id="math.pde.frequency-variable"}（frequency variable）。

**证明思路**：$e^{-i\xi x}=\cos\xi x-i\sin\xi x$，$e^{-ax^2}\sin\xi x$是奇函数，积分为$0$，余下$2\int_0^{+\infty}e^{-ax^2}\cos\xi x\dd x$。令$x=\frac s{\sqrt a}$（先在$[0,R]$上换元，再令$R\to+\infty$），它就成了$\frac2{\sqrt a}$乘[含参变量积分](lesson:math.analysis.parameter-integrals)第 6 题证明的$\int_0^{+\infty}e^{-s^2}\cos(2sy)\dd s=\frac{\sqrt\pi}2e^{-y^2}$，其中$y=\frac\xi{2\sqrt a}$。

为什么重要：中心在原点的高斯函数，变换还是中心在原点的高斯函数。变换在$|\xi|=2\sqrt a$处降到峰高的$\frac1e$，这个宽度乘$e^{-ax^2}$的宽度$\frac1{\sqrt a}$得$2$，不随$a$变：函数越窄，变换越宽（几何图像）。

### 反演公式

先用定理 1 试一试。把定理 1 里的$x$、$\xi$对调，$a$换成$\frac1{4a}$，得$\int_{-\infty}^{+\infty}e^{-\xi^2/(4a)}e^{-i\xi x}\dd\xi=\sqrt{4\pi a}\,e^{-ax^2}$；右边是$x$的偶函数，把$e^{-i\xi x}$换成$e^{i\xi x}$不变。于是把$e^{-ax^2}$的:term[傅里叶变换]{id="math.pde.fourier-transform"}代进:term[逆变换]{id="math.pde.inverse-fourier-transform"}，

$$
\frac1{2\pi}\int_{-\infty}^{+\infty}\sqrt{\frac\pi a}\,e^{-\xi^2/(4a)}e^{i\xi x}\dd\xi=\frac1{2\pi}\sqrt{\frac\pi a}\sqrt{4\pi a}\,e^{-ax^2}=e^{-ax^2},
$$

正好变回原来的函数。

::anchor{id="thm-inversion"}
**定理 2（:term[傅里叶反演公式]{id="math.pde.fourier-inversion-formula"}，Fourier inversion formula）**　设$f$:term[绝对可积]{id="math.pde.absolutely-integrable"}，在每个有限区间上分段光滑（piecewise smooth），则对每个$x$，$\lim_{R\to+\infty}\frac1{2\pi}\int_{-R}^{R}\hat f(\xi)e^{i\xi x}\dd\xi=\frac{f(x^-)+f(x^+)}2$；在$f$连续的点，它就是$f(x)$。这里$f(x^-)$、$f(x^+)$是$f$在$x$处的左、右极限（one-sided limits），左边是按对称的极限理解的逆变换。这个公式也简称反演公式。

**证明思路**：把$\hat f(\xi)=\int_{-\infty}^{+\infty}f(y)e^{-i\xi y}\dd y$代进去，交换两个积分的次序（被积函数的绝对值在$[-R,R]\times\R$上的积分是$2R\int_{-\infty}^{+\infty}|f|\dd y$，有限，可以这样交换，这里不证；闭矩形上的连续函数见[二重积分](lesson:math.vector-calculus.double-integrals#thm-fubini)的富比尼定理（Fubini's theorem））。先对$\xi$积分，$\frac1{2\pi}\int_{-R}^{R}e^{i\xi(x-y)}\dd\xi=\frac{\sin R(x-y)}{\pi(x-y)}$；再令$y=x+u$，左边的积分成了

$$
\frac1\pi\int_{-\infty}^{+\infty}f(x+u)\,\frac{\sin Ru}u\dd u.
$$

[傅里叶级数的收敛](lesson:math.analysis.fourier-convergence)一节的部分和是$\frac1\pi\int_{-\pi}^{\pi}f(x+u)D_N(u)\dd u$，而狄利克雷核（Dirichlet kernel）$D_N(u)=\frac{\sin(N+\frac12)u}{2\sin\frac u2}$在$u$很小时约为$\frac{\sin(N+\frac12)u}u$：两者同一个样子，$R$相当于$N+\frac12$。照那里狄利克雷定理（Dirichlet's theorem）的证明，用$\frac1\pi\int_0^{+\infty}\frac{\sin Ru}u\dd u=\frac12$代替$\frac1\pi\int_0^\pi D_N(u)\dd u=\frac12$，再减去$\frac{f(x^-)+f(x^+)}2$。取一个大数$M$：$|u|\le M$的部分由黎曼-勒贝格引理（Riemann-Lebesgue lemma）趋于$0$；$|u|>M$的部分里，含$f$的项不超过$\frac1{\pi M}\int|f|$，$M$取得大就很小，常数项是收敛积分$\int\frac{\sin v}v\dd v$的尾巴，$R\to+\infty$时也趋于$0$。这里用到$\int_0^{+\infty}\frac{\sin u}u\dd u=\frac\pi2$，它也由狄利克雷核得出，见第 5 题。

为什么：$f$是各个$e^{i\xi x}$的叠加，频率为$\xi$的那个成分的:term[复振幅]{id="physics.oscillations-waves.complex-amplitude"}（complex amplitude）是$\frac1{2\pi}\hat f(\xi)\dd\xi$，定理 2 说这样加回去确实得到$f$。在跳跃点得到左右极限的平均，和傅里叶级数（Fourier series）在狄利克雷定理里的结论一样。对称的极限就是复分析里积分限为$\pm\infty$时的:term[柯西主值]{id="math.complex-analysis.cauchy-principal-value"}（Cauchy principal value）；$\int_0^{+\infty}\frac{\sin u}u\dd u$复分析里也算过（[柯西主值与实轴上的极点](lesson:math.complex-analysis.cauchy-principal-value)例 1），[若尔当引理与傅里叶型积分](lesson:math.complex-analysis.jordan-lemma)第 8 题也猜出过它。

边界情况：矩形不连续，它的变换不绝对可积（见[傅里叶变换](lesson:math.pde.fourier-transform#def-inverse-fourier-transform)），定理 2 照样管得住它：定理只要求$f$绝对可积、分段光滑，不要求$\hat f$绝对可积（例 1）。$\hat f$绝对可积时，左边就是普通的反常积分（improper integral）$\frac1{2\pi}\int_{-\infty}^{+\infty}\hat f(\xi)e^{i\xi x}\dd\xi$。

### 唯一性与普朗歇尔定理

::anchor{id="thm-uniqueness"}
**推论**　设$f$、$g$都连续、:term[绝对可积]{id="math.pde.absolutely-integrable"}，在每个有限区间上分段光滑。如果$\hat f(\xi)=\hat g(\xi)$对一切$\xi$成立，那么$f=g$。

**证明**：$f$、$g$连续，由定理 2，$f(x)$和$g(x)$都等于同一个极限$\lim_{R\to+\infty}\frac1{2\pi}\int_{-R}^{R}\hat f(\xi)e^{i\xi x}\dd\xi$。

为什么有用：认出一个:term[傅里叶变换]{id="math.pde.fourier-transform"}是哪个满足推论条件的函数的变换，就找回了原来的函数（例 2）；[卷积与卷积定理](lesson:math.pde.convolution)、[热核与无界区域上的热方程](lesson:math.pde.heat-kernel)两节都这样认出:term[高斯函数]{id="math.pde.gaussian-function"}。边界情况：去掉「连续」就不对，在一点改动$f$的值，积分不变，$\hat f$也不变。

高斯函数还满足另一个等式。$f=e^{-x^2/2}$时，$\int_{-\infty}^{+\infty}f^2\dd x=\sqrt\pi$；由定理 1，$\hat f=\sqrt{2\pi}\,e^{-\xi^2/2}$，$\int_{-\infty}^{+\infty}\hat f^2\dd\xi=2\pi\sqrt\pi$，正好是前者的$2\pi$倍。

::anchor{id="thm-plancherel"}
**普朗歇尔定理（Plancherel theorem）**　设$f$绝对可积，并且$|f|^2$在整条直线上的积分也收敛，则$|\hat f|^2$的积分也收敛，并且$\int_{-\infty}^{+\infty}|f(x)|^2\dd x=\frac1{2\pi}\int_{-\infty}^{+\infty}|\hat f(\xi)|^2\dd\xi$。这里不证。

为什么有用：$|f|^2$的积分常常是能量一类的量，定理说按$x$算和按频率算是同一个量，只差因子$\frac1{2\pi}$。它是傅里叶级数的:term[帕塞瓦尔等式]{id="math.analysis.parseval-identity"}（Parseval's identity）在积分上的版本。边界情况：矩形的$\hat f$不绝对可积，$|\hat f|^2$却像$\frac1{\xi^2}$那样衰减、积分收敛，定理照样成立。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-8, 8], y: [0, 3.7] }
functions:
  - expr: "exp(-a*x^2)"
    label: |
      $f(x)=e^{-ax^2}$
  - expr: "sqrt(pi/a)*exp(-x^2/(4*a))"
    label: |
      $\hat f(\xi)=\sqrt{\pi/a}\,e^{-\xi^2/(4a)}$
sliders:
  - name: a
    min: 0.25
    max: 4
    step: 0.05
    default: 1
    label: |
      $a$
:::

蓝线是:term[高斯函数]{id="math.pde.gaussian-function"}$f(x)=e^{-ax^2}$，橙线是它的:term[傅里叶变换]{id="math.pde.fourier-transform"}$\hat f$；横轴图上写作 x，对蓝线是$x$，对橙线是$\xi$。拖动$a$：蓝线变窄时，橙线变宽、变矮，两条都是钟形；$a=\frac12$时，橙线正好是蓝线的$\sqrt{2\pi}$倍。不论$a$取多少，橙线下的面积都是$2\pi$，除以$2\pi$正是蓝线在$x=0$处的高度$1$：这就是:term[反演公式]{id="math.pde.fourier-inversion-formula"}在$x=0$处的样子。

:::anim{component="function-plot"}
range: { x: [-2.5, 2.5], y: [-0.3, 1.3] }
functions:
  - expr: "sum(k, 0, 199, (sin(R*(k + 0.5)/200*(1 + x)) + sin(R*(k + 0.5)/200*(1 - x)))/(k + 0.5))/pi"
    label: |
      $\frac1{2\pi}\int_{-R}^{R}\hat f(\xi)e^{i\xi x}\dd\xi$
  - expr: "1 + 0*sqrt(1 - abs(x))"
    label: |
      矩形$f$的顶边
points:
  - { x: "-1", y: "0.5" }
  - { x: "1", y: "0.5" }
sliders:
  - name: R
    min: 1
    max: 30
    step: 1
    default: 4
    label: |
      积分限$R$
:::

蓝线是宽为$2$的矩形（$|x|<1$时为$1$，其余为$0$）在$[-R,R]$上截断的:term[逆变换]{id="math.pde.inverse-fourier-transform"}，用数值积分算出；橙线是矩形的顶边，两个圆点在$\bigl(\pm1,\frac12\bigr)$。拖动$R$：蓝线越来越贴近矩形，在跳跃点$x=\pm1$处趋于$\frac12$。$R$大了以后，跳跃旁边冲过头约$0.09$，$R$越大，这个尖峰越窄、越靠近跳跃点，高度却不降，和[傅里叶级数的收敛](lesson:math.analysis.fourier-convergence#def-gibbs)一节的吉布斯现象（Gibbs phenomenon）一样。

## 例题

### 例 1　矩形在边缘处的反演

宽为$b$、高为$1$的矩形：$|x|<\frac b2$时$f(x)=1$，其余为$0$（宽写成$b$，免得和:term[高斯函数]{id="math.pde.gaussian-function"}的$a$混淆）。求$\lim_{R\to+\infty}\frac1{2\pi}\int_{-R}^{R}\hat f(\xi)e^{i\xi b/2}\dd\xi$。

**为什么想到这么做**：这正是:term[反演公式]{id="math.pde.fourier-inversion-formula"}在矩形的右边缘$x=\frac b2$处给出的值。$f$:term[绝对可积]{id="math.pde.absolutely-integrable"}，在每个有限区间上分段光滑，满足定理 2 的条件；它在$\frac b2$处从$1$跳到$0$。

**推导**：由定理 2，极限是$\frac{1+0}2=\frac12$。也可以直接验算：由[傅里叶变换](lesson:math.pde.fourier-transform)一节，$\hat f(\xi)=\frac{2\sin(\xi b/2)}\xi$，

$$
\hat f(\xi)e^{i\xi b/2}=\frac{\sin b\xi}\xi+i\,\frac{1-\cos b\xi}\xi.
$$

虚部是奇函数，在$[-R,R]$上的积分为$0$；实部令$u=b\xi$，积分趋于$\int_{-\infty}^{+\infty}\frac{\sin u}u\dd u=\pi$，乘$\frac1{2\pi}$也得$\frac12$。反过来由这个例子求$\int_0^{+\infty}\frac{\sin u}u\dd u$就绕回去了：定理 2 的证明已经用到它。

### 例 2　由变换求回函数

设$\xi_0$是实数。求连续、:term[绝对可积]{id="math.pde.absolutely-integrable"}、在每个有限区间上分段光滑的函数$f$，使它的:term[傅里叶变换]{id="math.pde.fourier-transform"}是$e^{-(\xi-\xi_0)^2}$。

**为什么想到这么做**：$e^{-\xi^2}$是:term[高斯函数]{id="math.pde.gaussian-function"}，由定理 1 能认出它是哪个函数的变换；平移$\xi_0$对应乘$e^{i\xi_0x}$（[傅里叶变换](lesson:math.pde.fourier-transform#thm-fourier-properties)一节定理 1（2））。最后由推论，这样凑出来的连续函数就是要找的$f$。

**推导**：定理 1 取$a=\frac14$，$e^{-x^2/4}$的变换是$2\sqrt\pi\,e^{-\xi^2}$，所以$g(x)=\frac1{2\sqrt\pi}e^{-x^2/4}$的变换是$e^{-\xi^2}$，$e^{i\xi_0x}g(x)$的变换是$e^{-(\xi-\xi_0)^2}$。它连续、绝对可积、处处有连续的导数，由推论，

$$
f(x)=\frac1{2\sqrt\pi}\,e^{-x^2/4}\,e^{i\xi_0x}.
$$

$f$是钟形的包络（envelope）$\frac1{2\sqrt\pi}e^{-x^2/4}$乘上振荡的$e^{i\xi_0x}$，所含的频率集中在$\xi_0$附近：这样的函数物理里叫作波包（wave packet）。

## 常见误区

- 「:term[反演公式]{id="math.pde.fourier-inversion-formula"}总给回$f(x)$。」在$f$的跳跃点，给回的是左右极限的平均（例 1）。$f$在一点的值随便改，$\hat f$都不变，反演公式也就不可能知道$f$在跳跃点取什么值。
- 「$\hat f$不:term[绝对可积]{id="math.pde.absolutely-integrable"}，:term[逆变换]{id="math.pde.inverse-fourier-transform"}就没有意义。」$f$满足定理 2 的条件时，按对称的极限理解就有意义：矩形的$\hat f$不绝对可积，它的逆变换照样在每一点收敛到定理 2 说的值（例 1）。

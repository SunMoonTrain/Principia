---
id: math.pde.heat-kernel
title: |
  热核与无界区域上的热方程
goal: |
  会用傅里叶变换解无界直线上的热方程，并把解写成初值和热核的卷积。
prerequisites: [math.pde.convolution, math.pde.heat-equation]
minutes: 30
summary: |
  初值有界、分段连续时，它和热核的卷积给出直线上热方程的解。
status: reviewed
---

## 这一节要回答的问题

一根很长的杆，开始时只有中间一小段是热的，热量怎样向两边散开？[热方程的推导](lesson:math.pde.heat-equation)一节估计过，温度的变化在$t$时间里约传开$\sqrt{Dt}$远，$D$是:term[扩散系数]{id="math.pde.diffusion-coefficient"}（diffusion coefficient）。能不能把散开的样子准确地写出来？

## 讲解

### 用傅里叶变换解

杆很长、两端离中间的距离远大于$\sqrt{Dt}$时，端点的影响小得可以不计，可以把杆看成整条直线。要解的是:term[热方程]{id="math.pde.heat-equation"}（heat equation）在整条直线上的:term[初值问题]{id="math.pde.initial-value-problem"}（initial value problem）：

$$
u_t=Du_{xx}\quad(-\infty<x<+\infty,\ t>0),\qquad u(x,0)=\varphi(x).
$$

设$\varphi$有界、:term[绝对可积]{id="math.pde.absolutely-integrable"}（absolutely integrable）。把$t$看成参数，对$x$作:term[傅里叶变换]{id="math.pde.fourier-transform"}（Fourier transform）：$\hat u(\xi,t)=\int_{-\infty}^{+\infty}u(x,t)e^{-i\xi x}\dd x$，$\xi$是:term[频率变量]{id="math.pde.frequency-variable"}（frequency variable）。推导时先设解足够好：$u$、$u_t$、$u_x$、$u_{xx}$都连续，$u$、$u_x$、$u_{xx}$作为$x$的函数绝对可积，$t$在每个闭区间$[t_1,t_2]$（$t_1>0$）里时$|u_t|$不超过一个和$t$无关、连续、绝对可积的函数，并且$t\to0^+$时$\hat u(\xi,t)\to\hat\varphi(\xi)$。这些假设只用来找出公式，找到以后再直接验证（下面的定理）。

$\partial_t$表示对$t$求偏导数（partial derivative）。由[含参变量积分](lesson:math.analysis.parameter-integrals#thm-leibniz-improper)的定理 4（实部、虚部和正、负半轴分开用），求导可以移进积分号，$\partial_t\hat u$就是$u_t$的变换；由[傅里叶变换](lesson:math.pde.fourier-transform#thm-fourier-derivative)一节的定理 2，用两次，$u_{xx}$的变换是$(i\xi)^2\hat u$。于是方程变成

$$
\partial_t\hat u(\xi,t)=-D\xi^2\,\hat u(\xi,t).
$$

对每个固定的$\xi$，这是$t$的常微分方程（ordinary differential equation）。由它，$\partial_t\bigl(e^{D\xi^2t}\hat u\bigr)=e^{D\xi^2t}\bigl(\partial_t\hat u+D\xi^2\hat u\bigr)=0$，所以$e^{D\xi^2t}\hat u$不随$t$变，等于它在$t\to0^+$时的极限$\hat\varphi(\xi)$：

$$
\hat u(\xi,t)=\hat\varphi(\xi)\,e^{-D\xi^2t}.
$$

频率为$\xi$的成分按$e^{-D\xi^2t}$衰减，$|\xi|$越大衰减得越快。细小的起伏是高频的成分，最先消失，温度分布越来越平滑。

剩下的是认出$\hat\varphi(\xi)e^{-D\xi^2t}$是哪个函数的变换。[傅里叶反演公式](lesson:math.pde.fourier-inversion#thm-gaussian-transform)一节的定理 1 取$a=\frac1{4Dt}$，说$e^{-x^2/(4Dt)}$的变换是$\sqrt{4\pi Dt}\,e^{-D\xi^2t}$，所以$e^{-D\xi^2t}$是:term[高斯函数]{id="math.pde.gaussian-function"}（Gaussian function）$K(x,t)=\frac1{\sqrt{4\pi Dt}}e^{-x^2/(4Dt)}$（看成$x$的函数）的变换。$K$有界、绝对可积，由:term[卷积定理]{id="math.pde.convolution-theorem"}（convolution theorem），$\hat\varphi(\xi)e^{-D\xi^2t}$是$K$和$\varphi$的:term[卷积]{id="math.pde.convolution"}（convolution）的变换。$u$和这个卷积都满足[傅里叶反演公式](lesson:math.pde.fourier-inversion#thm-uniqueness)一节推论的条件（卷积连续；照下面定理的证明思路，它对$x$的导数是有界、绝对可积的$K_x$和$\varphi$的卷积，也连续），变换又相同，所以

$$
u(x,t)=\int_{-\infty}^{+\infty}K(x-y,t)\,\varphi(y)\dd y .
$$

### 热核

::anchor{id="def-heat-kernel"}
设$D>0$。函数$K(x,t)=\frac1{\sqrt{4\pi Dt}}e^{-x^2/(4Dt)}$（$t>0$）叫作:term[热方程]{id="math.pde.heat-equation"}$u_t=Du_{xx}$的热核（heat kernel）。

为什么这样定义：上面的$u(x,t)$是各处的初温$\varphi(y)$按权重$K(x-y,t)\dd y$加起来的，「核」指的就是积分里的这个权重，和[傅里叶级数的收敛](lesson:math.analysis.fourier-convergence#def-dirichlet-kernel)一节的狄利克雷核（Dirichlet kernel）、那一节第 7 题提示里的费耶尔核（Fejér kernel）是同一种叫法。固定$t$，$K$是取$\sigma=\sqrt{2Dt}$的正态分布（normal distribution）的密度：$K>0$，$\int_{-\infty}^{+\infty}K\dd x=1$（见[极坐标下的二重积分](lesson:math.vector-calculus.polar-double-integrals)第 7 题）。所以$u$是初温的加权平均，$\inf\varphi\le u\le\sup\varphi$。

由[极坐标下的二重积分](lesson:math.vector-calculus.polar-double-integrals)第 5 题的$\int_{-\infty}^{+\infty}x^2e^{-x^2}\dd x=\frac{\sqrt\pi}2$换元（先在有限区间上换元，再取极限），得$\int_{-\infty}^{+\infty}x^2K\dd x=2Dt$，所以拿$\sqrt{2Dt}$来量热核的宽度。它和$\sqrt t$成正比：散开的距离加倍，时间要变成$4$倍。热学[热传导与扩散](lesson:physics.thermal-physics.heat-conduction-diffusion)一节说香水分子「走$1\,\mathrm{cm}$只要十秒左右」，取那里的$D\approx1.2\times10^{-5}\,\mathrm{m^2/s}$，宽度长到$L=1\,\mathrm{cm}$要$t=\frac{L^2}{2D}\approx4\,\mathrm s$（那里按$t\approx\frac{L^2}D$只估量级）；[平均自由程](lesson:physics.thermal-physics.mean-free-path)一节说它们「离开瓶口的距离增加得极慢」，也是这件事。

边界情况：$t\to0^+$时$K$越来越窄、越来越高，面积总是$1$，像[狄拉克 δ 函数](lesson:math.calculus.dirac-delta#def-dirac-delta)一节的尖峰；$t\to+\infty$时它越来越矮、越来越平。

::anchor{id="thm-heat-solution"}
**定理**　设$\varphi$有界，在每个有限区间上分段连续（piecewise continuous），即只有有限个间断点（point of discontinuity），在间断点处左、右极限（left-hand and right-hand limits）都存在。则$u(x,t)=\int_{-\infty}^{+\infty}K(x-y,t)\varphi(y)\dd y$在$t>0$时满足$u_t=Du_{xx}$；$t\to0^+$时，在$\varphi$连续的点$u(x,t)\to\varphi(x)$，在间断点$u(x,t)\to\frac{\varphi(x^-)+\varphi(x^+)}2$。

为什么这样要求：左、右极限存在，结论里的平均值才有意义。$\sin\frac1x$（$0$处任补一个值）有界，只在$0$处间断，可那里没有左、右极限，不算分段连续。

**证明思路**：$K$满足热方程，直接求导就能验证。对$u$求导时把导数移进积分号（differentiation under the integral sign）：$K$的偏导数是$K$乘一个多项式，$|y|$大时衰减得极快，$\varphi$又有界，照[含参变量积分](lesson:math.analysis.parameter-integrals#thm-leibniz-improper)的定理 4 就行（在$\varphi$的间断点处分段），所以$u$也满足热方程。

$t\to0^+$时，由$\int K\dd y=1$，$u(x,t)-\varphi(x)=\int_{-\infty}^{+\infty}K(x-y,t)\bigl(\varphi(y)-\varphi(x)\bigr)\dd y$，和[狄拉克 δ 函数](lesson:math.calculus.dirac-delta)一节第 6 题一样；可$K$并不只在一小段上不为零，要多一步。$\varphi$在$x$处连续时，离$x$近的$y$，$\varphi(y)$和$\varphi(x)$差得少；离得远的，$|\varphi(y)-\varphi(x)|$有界，而这部分的权重之和随$t\to0^+$趋于$0$（[魏尔斯特拉斯逼近定理](lesson:math.analysis.weierstrass-approximation)一节的证明也这样分成两部分）。在间断点，$K$左右两半的权重各是$\frac12$，就得到平均值；完整的证明见第 5、6 题。

::anchor{id="def-erf"}
函数$\operatorname{erf}z=\frac2{\sqrt\pi}\int_0^ze^{-s^2}\dd s$叫作:term[误差函数]{id="math.pde.error-function"}（error function）。

为什么这样定义：$e^{-s^2}$的原函数不是初等函数（elementary function，这里不证），热核在一段区间上的面积却总要用到这个积分（例 1），就给它起个名字；乘$\frac2{\sqrt\pi}$是为了$z\to+\infty$时$\operatorname{erf}z\to1$。它是奇函数，从$-1$增加到$1$。边界情况：$\operatorname{erf}2\approx0.995$，$|z|\ge2$时它和$\pm1$相差不到$0.005$。

### 点热源与传播速度

初温是在$y_0$处、面积为$1$的窄尖峰$\delta_\varepsilon(y-y_0)$时，由筛选性质（sifting property），$\varepsilon\to0^+$时解趋于$K(x-y_0,t)$：初值为$\delta(x-y_0)$的解，就是平移到$y_0$处的热核。一般的初温是许多尖峰按$\varphi(y)\dd y$叠加起来的，解也就是它们各自的解叠加起来，正是上面的:term[卷积]{id="math.pde.convolution"}。常微分方程的:term[冲激响应]{id="math.ode.impulse-response"}（impulse response）也这样用：初值为零、输入为$g$时，解是冲激响应和$g$的卷积（见[阶跃函数、冲激与卷积](lesson:math.ode.convolution-impulse#thm-convolution)）。

$t>0$时$K(x,t)>0$对一切$x$成立：初温集中在一点，过了任意短的时间，每一处都热了一点，扰动瞬间就传到各处。这和:term[波动方程]{id="math.pde.wave-equation"}（wave equation）的:term[有限传播速度]{id="math.pde.finite-propagation-speed"}（finite propagation speed）正相反（见[一维波动方程与达朗贝尔公式](lesson:math.pde.wave-dalembert#thm-finite-speed)）。:term[热方程]{id="math.pde.heat-equation"}描述的是大量微观粒子无规则运动的平均效果，粒子的速度其实有限；远处分到的那一点热小得根本测不出来。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-5, 5], y: [0, 1.3] }
functions:
  - expr: "exp(-x^2/(4*s))/sqrt(4*pi*s)"
    label: |
      热核$K(x,t)$
  - expr: "1/2 + x/sqrt(4*pi*s) * sum(k, 0, 59, exp(-((x*(k + 0.5)/60)^2)/(4*s)))/60"
    label: |
      例 1 的$u(x,t)$（$u_1=0$，$u_2=1$）
sliders:
  - name: s
    min: 0.05
    max: 2
    step: 0.05
    default: 0.25
    label: |
      $Dt$
:::

蓝线是热核$K(x,t)$，橙线是例 1 取$u_1=0$、$u_2=1$时的解$u(x,t)$，滑块是$Dt$。拖动滑块：$Dt$越小，蓝线越窄、越高，下面的面积始终是$1$；$Dt$变大，它按$\sqrt{2Dt}$变宽、变矮。橙线在$x$处的高度正是蓝线在$x$左边的面积，在$x=0$处始终是$\frac12$，陡直的台阶被抹成了缓坡。

## 例题

### 例 1　两根杆接在一起

两根材料相同、侧面绝热的长杆，温度分别是$u_1$、$u_2$，$t=0$时在$x=0$处接上：$x<0$时$\varphi(x)=u_1$，$x>0$时$\varphi(x)=u_2$。求以后的温度，特别是接触面$x=0$处的温度。

**为什么想到这么做**：初温有界、分段连续，由定理，解是热核和初温的:term[卷积]{id="math.pde.convolution"}；初温在两条半直线上各是常数，积分就是热核在半直线上的面积，换元后正是:term[误差函数]{id="math.pde.error-function"}。

**推导**：$u(x,t)=u_1\int_{-\infty}^0K(x-y,t)\dd y+u_2\int_0^{+\infty}K(x-y,t)\dd y$。在后一个积分里令$y=x+\sqrt{4Dt}\,s$（先在有限区间上换元，再取极限），

$$
\int_0^{+\infty}K(x-y,t)\dd y=\frac1{\sqrt\pi}\int_{-x/\sqrt{4Dt}}^{+\infty}e^{-s^2}\dd s=\frac12+\frac12\operatorname{erf}\frac x{\sqrt{4Dt}} ;
$$

前一个积分是$1$减去它。所以

$$
u(x,t)=\frac{u_1+u_2}2+\frac{u_2-u_1}2\operatorname{erf}\frac x{\sqrt{4Dt}} .
$$

接触面上$\operatorname{erf}0=0$，温度从$t>0$起就是$\frac{u_1+u_2}2$，以后一直不变，正是定理说的间断点处左右极限的平均。$u$只通过$\frac x{\sqrt{4Dt}}$依赖$x$和$t$：时间变成$4$倍，温度分布就沿$x$方向拉宽为$2$倍。

## 常见误区

- 「公式$u=\int K(x-y,t)\varphi(y)\dd y$只对:term[绝对可积]{id="math.pde.absolutely-integrable"}的初温成立。」用:term[傅里叶变换]{id="math.pde.fourier-transform"}推导时要$\varphi$绝对可积，定理却只要$\varphi$有界、分段连续：例 1 的阶跃不绝对可积，公式照样给出解。
- 「初温给定以后，:term[热方程]{id="math.pde.heat-equation"}在整条直线上的解只有本节公式给出的这一个。」$\varphi$连续时，在有界的解里它是唯一的；不限制$|x|\to+\infty$时解增长的快慢，就还有别的解（都不证）。

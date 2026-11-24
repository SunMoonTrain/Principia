---
id: math.pde.string-modes
title: |
  弦振动与简正模
goal: |
  会用分离变量法解两端固定的弦的振动，并把解写成简正模的叠加。
prerequisites: [math.pde.separation-of-variables, math.pde.wave-dalembert]
minutes: 27
summary: |
  长$L$、两端固定的弦$u_{tt}=c^2u_{xx}$的运动是简正模的叠加，以$\frac{2L}c$为周期。
status: reviewed
---

## 这一节要回答的问题

拨一下吉他弦，听到的声音里有一个最低的音，还有频率是它整数倍的音。[驻波](lesson:physics.oscillations-waves.standing-waves)一节只用「两端不动」就找出了弦上原地起伏、不跑开的那几种振动；从:term[波动方程]{id="math.pde.wave-equation"}（wave equation）出发，为什么原地起伏的振动只有这几种？一般的振动又是什么样子？

## 讲解

### 简正模

这一节$L$是弦长，$c$是波速（振动与波那边写$\ell$、$v$）。弦开始时的形状是$\varphi$、各点的速度是$\psi$，要解的是:term[波动方程]{id="math.pde.wave-equation"}的:term[初边值问题]{id="math.pde.initial-boundary-value-problem"}（initial-boundary value problem）：在$0<x<L$上，

$$
u_{tt}=c^2u_{xx},\qquad u(0,t)=u(L,t)=0,\qquad u(x,0)=\varphi(x),\quad u_t(x,0)=\psi(x).
$$

用:term[分离变量法]{id="math.pde.separation-of-variables"}（separation of variables），先找乘积解$u=X(x)T(t)$，$X$、$T$都不恒为零。代进方程，两边除以$c^2XT$，得$\frac{T''}{c^2T}=\frac{X''}X$，两边等于同一个:term[分离常数]{id="math.pde.separation-constant"}（separation constant），记作$-\lambda$。两端的条件给出$X(0)=X(L)=0$，这正是[分离变量法](lesson:math.pde.separation-of-variables#def-eigen)一节两端为零的:term[边值问题]{id="math.pde.boundary-value-problem"}（boundary value problem）：$\lambda\le0$时只有零解，:term[特征值]{id="math.pde.eigenvalue"}（eigenvalue）是$\lambda_n=\bigl(\frac{n\pi}L\bigr)^2$，:term[特征函数]{id="math.pde.eigenfunction"}（eigenfunction）是$\sin\frac{n\pi x}L$（$n=1,2,\dots$）。

时间因子满足$T''+c^2\lambda_nT=0$，照[常系数齐次方程的解法](lesson:math.ode.constant-coefficients#thm-constant-coefficients)，$T=A_n\cos\omega_nt+B_n\sin\omega_nt$，其中$\omega_n=\frac{n\pi c}L$。同样的特征值，在:term[热方程]{id="math.pde.heat-equation"}（heat equation）里给出只会衰减的$e^{-D\lambda_nt}$；这里方程对$t$二阶，给出不衰减的振动。

::anchor{id="def-normal-mode"}
乘积解$u_n(x,t)=(A_n\cos\omega_nt+B_n\sin\omega_nt)\sin\frac{n\pi x}L$（$A_n$、$B_n$不全为零）叫作弦的第$n$个:term[简正模]{id="math.pde.normal-mode"}（normal mode），$\omega_n=\frac{n\pi c}L$叫作第$n$个简正模的角频率。

为什么这样定义：在一个简正模里，弦上各点以同一个角频率振动，形状$\sin\frac{n\pi x}L$不变，只是整体伸缩、上下翻转。[驻波](lesson:physics.oscillations-waves.standing-waves#thm-string-modes)一节只用「两端都是:term[波节]{id="physics.oscillations-waves.node"}（node）」就找出了同样的振动，这里由分离变量推出，连$\lambda\le0$的情形也排除了。固有频率$f_n=\frac{\omega_n}{2\pi}=\frac{nc}{2L}$和那里的$f_n=\frac{nv}{2\ell}$一致：$f_1$是:term[基频]{id="physics.oscillations-waves.fundamental-frequency"}（fundamental frequency），$f_n=nf_1$是第$n$次:term[谐波]{id="physics.oscillations-waves.harmonic"}（harmonic），一个简正模就是一种:term[驻波]{id="physics.oscillations-waves.standing-wave"}（standing wave）。

边界情况：$n$换成$-n$只让$\sin\frac{n\pi x}L$变号，给不出新的简正模。[耦合振子与简正模](lesson:physics.oscillations-waves.normal-modes)里的简正模是对有限个振子说的，只有有限个；弦的简正模有无穷多个，$n$越大，角频率越高。

### 简正模的叠加

由:term[叠加原理]{id="math.pde.superposition-principle"}（superposition principle），有限个:term[简正模]{id="math.pde.normal-mode"}之和仍满足方程和两端的条件。一般的初始条件（initial condition）要用无穷多个：

$$
u(x,t)=\sum_{n=1}^\infty\bigl(A_n\cos\omega_nt+B_n\sin\omega_nt\bigr)\sin\frac{n\pi x}L .
$$

$t=0$时要$\sum A_n\sin\frac{n\pi x}L=\varphi(x)$、$\sum\omega_nB_n\sin\frac{n\pi x}L=\psi(x)$（$0<x<L$），都是正弦级数（sine series）。把$\varphi$、$\psi$:term[奇延拓]{id="math.pde.odd-extension"}（odd extension），照[分离变量法](lesson:math.pde.separation-of-variables#def-extension)一节，由$\sin\frac{n\pi x}L$两两正交（orthogonal）求系数。

::anchor{id="thm-string-series"}
**定理**　设$\varphi$有连续的二阶导数（second derivative）、$\varphi''$分段光滑（piecewise smooth），$\psi$有连续的导数、$\psi'$分段光滑，并且$\varphi$、$\varphi''$、$\psi$在$x=0$和$x=L$处都是$0$。令$A_n=\frac2L\int_0^L\varphi(x)\sin\frac{n\pi x}L\dd x$，$B_n=\frac2{\omega_nL}\int_0^L\psi(x)\sin\frac{n\pi x}L\dd x$，则上面的级数在$0\le x\le L$上对一切$t$收敛，和$u$的二阶偏导数（second-order partial derivative）连续，满足方程、两端的条件和两个初始条件。

**证明思路**：$t=0$时两个级数是$\varphi$、$\psi$奇延拓、再按周期$2L$延开以后的傅里叶级数（Fourier series），由狄利克雷定理（Dirichlet's theorem，见[傅里叶级数的收敛](lesson:math.analysis.fourier-convergence#thm-dirichlet)，周期换成$2L$同理）收敛到$\varphi$、$\psi$。第$n$项和它的一、二阶偏导数，绝对值都不超过某个常数乘$n^2(|A_n|+|B_n|)$；只要$\sum n^2(|A_n|+|B_n|)$收敛，由:term[魏尔斯特拉斯判别法]{id="math.analysis.weierstrass-m-test"}（Weierstrass M-test，见[函数项级数与魏尔斯特拉斯判别法](lesson:math.analysis.function-series#thm-weierstrass-m-test)），这些级数都一致收敛（uniform convergence）；各项的导数都连续，可以逐项求导（[一致收敛与极限交换](lesson:math.analysis.uniform-limit-theorems#thm-derivative-interchange)的定理 3）。分部积分（integration by parts）两次，$A_n$是$-\bigl(\frac L{n\pi}\bigr)^2$乘$\varphi''$的正弦级数的系数，$\varphi''$在两端为$0$，奇延拓后连续、分段光滑，由[傅里叶级数的收敛](lesson:math.analysis.fourier-convergence#thm-fourier-uniform)定理 2 的证明，这些系数的绝对值之和收敛；$B_n$同理，完整的证明见第 5 题。

为什么是这个样子：两个物块的每个运动都是简正模的叠加（[耦合振子与简正模](lesson:physics.oscillations-waves.normal-modes#thm-mode-superposition)），弦的运动是无穷多个简正模的版本。小球越来越密时，链的简正模趋于弦的简正模（[一维链与连续极限](lesson:physics.oscillations-waves.beaded-string#thm-continuum-limit)），那一节第 5 题用离散的正交性求各个振幅，这里换成了积分。满足定理条件的解只有这一个，见[能量方法](lesson:math.pde.energy-method)。

$\omega_n=n\omega_1$，$t$增加$\frac{2L}c$时每一项的$\omega_nt$都增加$2n\pi$，各项回到原样，所以弦的运动以$\frac{2L}c$为周期，和开始时怎样拨无关。[弗罗贝尼乌斯方法与贝塞尔方程](lesson:math.ode.frobenius)第 8 题说琴弦的音高明确，道理就在这里；鼓面不是这样，见[圆膜振动与贝塞尔函数](lesson:math.pde.bessel-functions)。拨的位置怎样影响各个简正模的振幅，留给振动与波的[拨弦的位置与音色](lesson:physics.oscillations-waves.plucked-string)。

### 和行波的关系

由积化和差公式（product-to-sum formula），

$$
\sin\frac{n\pi x}L\cos\omega_nt=\frac12\Bigl[\sin\frac{n\pi(x-ct)}L+\sin\frac{n\pi(x+ct)}L\Bigr],
$$

一个:term[简正模]{id="math.pde.normal-mode"}是两列反向的:term[行波]{id="math.pde.traveling-wave"}（traveling wave）之和，含$\sin\omega_nt$的项也一样。记$\tilde\varphi$、$\tilde\psi$是$\varphi$、$\psi$:term[奇延拓]{id="math.pde.odd-extension"}、再按周期$2L$延到整条直线上的函数，逐项相加可以验证，整个级数就是把它们代进:term[达朗贝尔公式]{id="math.pde.dalembert-formula"}（d'Alembert's formula）得到的解：

$$
u(x,t)=\frac12\bigl[\tilde\varphi(x-ct)+\tilde\varphi(x+ct)\bigr]+\frac1{2c}\int_{x-ct}^{x+ct}\tilde\psi(s)\dd s .
$$

$\tilde\varphi$、$\tilde\psi$关于$x=0$和$x=L$都是奇的，两端自动不动：这是[一维波动方程与达朗贝尔公式](lesson:math.pde.wave-dalembert)第 5 题半无界弦的办法，两端都用上；那道题也说明了定理里端点处$\varphi=\varphi''=\psi=0$的条件从哪里来。从行波看，向右跑的鼓包碰到$x=L$倒过来跑回，到$x=0$再倒过来一次，走过$2L$回到原处，周期$\frac{2L}c$又出现了。

拨弦时弦被拉成三角形，尖角处没有二阶导数，不满足定理的条件，照公式算出的只是放宽了意思的解（见[一维波动方程与达朗贝尔公式](lesson:math.pde.wave-dalembert)第 7 题）。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 1], y: [-1.5, 1.5] }
functions:
  - expr: "sin(m*pi*x)*cos(m*pi*s)"
    label: |
      第$m$个简正模
  - expr: "sin(pi*x)*cos(pi*s) + 0.5*sin(2*pi*x)*cos(2*pi*s)"
    label: |
      例 1 的弦
sliders:
  - name: m
    min: 1
    max: 6
    step: 1
    default: 2
    label: |
      简正模的序号$m$
  - name: s
    min: 0
    max: 2
    step: 0.01
    default: 0
    label: |
      时间$t$（$L=1$，$c=1$）
:::

图上取$L=1$、$c=1$，横轴是弦上的位置$x$，纵轴图上写作 y，是位移$u$。蓝线是第$m$个:term[简正模]{id="math.pde.normal-mode"}$\sin m\pi x\cos m\pi t$：拖动时间滑块，它的形状不变，只在原地伸缩、上下翻转，有几处始终不动。橙线是例 1 的弦：两个简正模各按自己的角频率振动，形状一直在变；$t=1$时它是开始的形状左右翻过来、再上下颠倒的样子，$t=2$时回到开始的形状。

:::anim{component="function-plot"}
range: { x: [-1, 2], y: [-1.1, 1.1] }
functions:
  - expr: "max(0, 1 - ((x - 2*floor((x + 1)/2) - 0.3)/0.15)^2)^3 - max(0, 1 - ((x - 2*floor((x + 1)/2) + 0.3)/0.15)^2)^3"
    label: |
      延拓后的初始形状$\tilde\varphi$
  - expr: "0.5*(max(0, 1 - ((x - s - 2*floor((x - s + 1)/2) - 0.3)/0.15)^2)^3 - max(0, 1 - ((x - s - 2*floor((x - s + 1)/2) + 0.3)/0.15)^2)^3 + max(0, 1 - ((x + s - 2*floor((x + s + 1)/2) - 0.3)/0.15)^2)^3 - max(0, 1 - ((x + s - 2*floor((x + s + 1)/2) + 0.3)/0.15)^2)^3)"
    label: |
      $t$时刻的$u$
points:
  - { x: "0", y: "0" }
  - { x: "1", y: "0" }
sliders:
  - name: s
    min: 0
    max: 2
    step: 0.01
    default: 0.15
    label: |
      时间$t$（$L=1$，$c=1$）
:::

第二幅图也取$L=1$、$c=1$，弦开始时静止，形状是$x=0.3$附近的一个鼓包$\max\bigl(0,1-\bigl(\frac{x-0.3}{0.15}\bigr)^2\bigr)^3$，它满足定理的条件。两个圆点是弦的两端，只有它们之间的一段是弦，两边是:term[奇延拓]{id="math.pde.odd-extension"}、再按周期$2$延出去的部分。蓝线是延拓后的初始形状$\tilde\varphi$，橙线是由:term[达朗贝尔公式]{id="math.pde.dalembert-formula"}算出的$t$时刻的$u$。

图一开始停在两半刚分开的$t=0.15$。拖动时间滑块：鼓包分成两半跑开；一半跑到端点时，延拓出来的倒鼓包正好从另一侧迎面进来，端点处始终抵消，在弦上看就是鼓包倒过来弹回。$t=1$时两半在$x=0.7$处合成一个倒过来的鼓包，$t=2$时橙线和蓝线重合，回到开始的样子。

## 例题

### 例 1　两个简正模之和

弦开始时静止，形状是$\varphi(x)=\sin\frac{\pi x}L+\frac12\sin\frac{2\pi x}L$。求$u(x,t)$。$t=\frac Lc$时弦是什么形状？什么时候第一次回到开始的形状？

**为什么想到这么做**：开始的形状已经是第 1、2 个:term[简正模]{id="math.pde.normal-mode"}的形状之和，初速度为$0$，两个简正模各自振动再相加，不用求积分。

**推导**：$A_1=1$，$A_2=\frac12$，其余的$A_n$和所有$B_n$都是$0$，所以

$$
u(x,t)=\sin\frac{\pi x}L\cos\frac{\pi ct}L+\frac12\sin\frac{2\pi x}L\cos\frac{2\pi ct}L .
$$

$t=\frac Lc$时两个余弦分别是$-1$、$1$，$u=-\sin\frac{\pi x}L+\frac12\sin\frac{2\pi x}L=-\varphi(L-x)$：开始的形状左右翻过来，再上下颠倒。$u$要等于$\varphi$，比较两个简正模的系数，$\cos\frac{\pi ct}L$和$\cos\frac{2\pi ct}L$都得是$1$，第一次是$t=\frac{2L}c$。

一般地，$\cos\omega_n\bigl(t+\frac Lc\bigr)=(-1)^n\cos\omega_nt$（换成$\sin$也一样），$\sin\frac{n\pi(L-x)}L=(-1)^{n+1}\sin\frac{n\pi x}L$，所以弦的任何运动都满足$u\bigl(x,t+\frac Lc\bigr)=-u(L-x,t)$：过$\frac Lc$，每个鼓包都在一端反射了一次，到了对称的位置，倒了过来。

## 常见误区

- 「弦的振动都是:term[驻波]{id="physics.oscillations-waves.standing-wave"}：形状不变，只是整体伸缩。」一个:term[简正模]{id="math.pde.normal-mode"}是这样；几个简正模叠加起来，它们的角频率不同，形状就随时间变（例 1）。
- 「简正模的角频率由开始时怎样拨决定。」$\omega_n=\frac{n\pi c}L$只由弦长和波速决定；开始时的形状和速度只决定各个简正模的$A_n$、$B_n$。

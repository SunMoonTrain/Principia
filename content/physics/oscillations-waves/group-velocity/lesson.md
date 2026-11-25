---
id: physics.oscillations-waves.group-velocity
title: |
  波包与群速度
goal: |
  会区分相速度和群速度，并说明色散为什么会让波包展宽。
prerequisites: [physics.oscillations-waves.dispersion-relations, math.pde.fourier-inversion, physics.oscillations-waves.superposition-beats]
minutes: 30
summary: |
  无阻尼、波数范围窄时，包络以$v_{\mathrm g}=\dv\omega k$前进；$v_{\mathrm g}$随$k$变，波包终会展宽。
status: reviewed
---

## 这一节要回答的问题

往深水里扔块石头，盯住一个波峰：它从这群波的后沿冒出来，跑到前沿消失。波峰和这群波为什么跑得不一样快？这群波为什么越走越宽？

## 讲解

### 两列波的包络

两列:term[振幅]{id="physics.oscillations-waves.amplitude"}（amplitude）相同、:term[角频率]{id="physics.oscillations-waves.angular-frequency"}（angular frequency）和:term[波数]{id="physics.oscillations-waves.wave-number"}（wave number）都相近的:term[简谐波]{id="physics.oscillations-waves.harmonic-wave"}（harmonic wave）叠加，照[耦合振子与简正模](lesson:physics.oscillations-waves.normal-modes)例 2 用和差化积，

$$
A\cos(\omega_1t-k_1x)+A\cos(\omega_2t-k_2x)=2A\cos\frac{(\omega_2-\omega_1)t-(k_2-k_1)x}2\,\cos(\bar\omega t-\bar kx).
$$

横线表示两个值的平均，不是对时间平均。固定一点看，就是:term[拍]{id="physics.oscillations-waves.beats"}（beats）；固定一个时刻看，波形一段段地成群。后一个因子变得快，波峰以$\frac{\bar\omega}{\bar k}$前进；前一个因子变得慢，以$\frac{\omega_2-\omega_1}{k_2-k_1}$前进，两个速度一般不同。

::anchor{id="def-envelope"}
快速振荡的振动或波里缓慢变化的振幅，也就是把各处峰顶连起来的那条曲线，叫作:term[包络]{id="physics.oscillations-waves.envelope"}（envelope）；上面的包络是$2A\Bigl\lvert\cos\frac{(\omega_2-\omega_1)t-(k_2-k_1)x}2\Bigr\rvert$。

为什么这样定义：快的因子只管峰在哪里，峰有多高由慢的因子管，看得见的「一群」就是它。边界情况：两个波数相差很大时，两个因子变得差不多快，分不出包络。

### 波包

两列波叠成的群一个接一个，没有尽头；多叠几列，主峰更尖、更高（[振动的叠加与拍](lesson:physics.oscillations-waves.superposition-beats)第 7 题）。把$k_0$附近各个:term[波数]{id="physics.oscillations-waves.wave-number"}的:term[简谐波]{id="physics.oscillations-waves.harmonic-wave"}都叠起来，就能只留下一群：

$$
y=\Re\tilde y,\qquad\tilde y(x,t)=\int\tilde A(k)e^{i(\omega(k)t-kx)}\dd k.
$$

$\tilde A(k)\dd k$是波数为$k$的成分的:term[复振幅]{id="physics.oscillations-waves.complex-amplitude"}（complex amplitude）。每个成分都满足线性的运动方程，叠起来也满足：$\tilde A$、$\omega$连续，$\tilde A$只在有限区间里不为零时，可以在积分号下求导（differentiation under the integral sign，见[含参变量积分](lesson:math.analysis.parameter-integrals#thm-leibniz-rule)；$\tilde A$衰减得足够快时，如$e^{-k^2}$，用那里的定理 4）。${t=0}$时的$\tilde y$记作$f(x)$；$f$连续、满足[傅里叶反演公式](lesson:math.pde.fourier-inversion#thm-inversion)（Fourier inversion formula）的条件时，取$\tilde A(k)=\frac1{2\pi}\hat f(-k)$正好叠出$f$，$\hat f$是它的傅里叶变换（Fourier transform），那里的$\xi$是这里的$-k$。

::anchor{id="def-wave-packet"}
波数集中在$k_0$附近、散开的范围远小于$k_0$的许多简谐波，叠成的只在有限的一段里明显不为零的波，叫作:term[波包]{id="physics.oscillations-waves.wave-packet"}（wave packet）；它的外形是快速振荡的因子乘上缓变的:term[包络]{id="physics.oscillations-waves.envelope"}。

为什么这样定义：要让波只占一段，就得叠上许多波数。提出$e^{i(\omega(k_0)t-k_0x)}$，剩下的因子只含很小的$q=k-k_0$，在一个:term[波长]{id="physics.oscillations-waves.wavelength"}（wavelength）里几乎不变，它的模就是包络。像[傅里叶反演公式](lesson:math.pde.fourier-inversion)例 2 那样的高斯波包（Gaussian wave packet）$f(x)=e^{-x^2/w^2}e^{-ik_0x}$（$k_0w\gg1$）就是，那里的$\xi_0$是这里的$-k_0$。边界情况：波数的范围和$k_0$差不多时，叠成的只是一个脉冲，分不出振荡和包络。

### 群速度

两列波的:term[波数]{id="physics.oscillations-waves.wave-number"}靠拢时，波峰的速度$\frac{\bar\omega}{\bar k}$趋于:term[相速度]{id="physics.oscillations-waves.phase-velocity"}（phase velocity）$v_{\mathrm p}=\frac\omega k$，:term[包络]{id="physics.oscillations-waves.envelope"}的速度$\frac{\omega_2-\omega_1}{k_2-k_1}$趋于导数$\dv\omega k$。

::anchor{id="def-group-velocity"}
:term[波包]{id="physics.oscillations-waves.wave-packet"}的波数集中在$k_0$附近、范围很窄时，包络前进的速度叫作:term[群速度]{id="physics.oscillations-waves.group-velocity"}（group velocity），它等于:term[色散关系]{id="physics.oscillations-waves.dispersion-relation"}（dispersion relation）$\omega(k)$在$k_0$处的导数$v_{\mathrm g}=\dv\omega k$。

为什么这样定义：相速度说的是波峰，它说的是包络（开头的水波见第 4 题）；没有:term[色散]{id="physics.oscillations-waves.dispersion"}（dispersion）时$\omega=vk$，两者相等。开始时在原点步调一致的各成分，$t$时刻在$x=v_{\mathrm g}t$处又大致步调一致：那里$\omega(k)t-kx$对$k$的导数在$k_0$为零。边界情况：波数散得很开、各部分的$\dv\omega k$又不同时，没有一个速度能代表整个波。

::anchor{id="thm-envelope-velocity"}
定理（包络以群速度平移）：线性、均匀的系统，色散关系$\omega(k)$取实数值、二阶导数（second derivative）连续，$\tilde A(k)$只在$\lvert k-k_0\rvert\le\Delta k$里不为零，所考虑的时间里$\frac12\max\lvert\omega''\rvert(\Delta k)^2t\ll1$（最大值在这个区间里取），则$\tilde y(x,t)\approx e^{i(\omega(k_0)t-k_0x)}\,\tilde Y(x-v_{\mathrm g}t)$，其中$\tilde Y(x)=\tilde y(x,0)e^{ik_0x}$是开始时的复包络（complex envelope）。

证明思路：由[泰勒公式的余项与误差估计](lesson:math.calculus.taylor-remainder#thm-remainder-bound)，$\omega(k)=\omega(k_0)+v_{\mathrm g}q+R$，$\lvert R\rvert\le\frac12\max\lvert\omega''\rvert q^2$。由$\lvert e^{iRt}-1\rvert\le\lvert R\rvert t$，略去$R$，$\tilde y$的误差不超过$\frac12\max\lvert\omega''\rvert(\Delta k)^2t\int\lvert\tilde A\rvert\dd k$（各成分步调一致时，这个积分就是峰高）。余下的${\int\tilde A(k_0+q)e^{-iq(x-v_{\mathrm g}t)}\dd q}$正是$\tilde Y$平移了$v_{\mathrm g}t$（[傅里叶变换](lesson:math.pde.fourier-transform#thm-fourier-properties)定理 1（1））。高斯波包的$\tilde A$处处不为零，但离$k_0$远处小得可以略去，定理近似成立。

### 波包的展宽

略去的二阶项积累起来，就让:term[包络]{id="physics.oscillations-waves.envelope"}变形。:term[波数]{id="physics.oscillations-waves.wave-number"}偏$q$的那部分约以$v_{\mathrm g}+\omega''(k_0)q$前进，$\omega''(k_0)\ne0$时，开始叠在一处的各部分，过时间$t$就拉开约$2\lvert\omega''(k_0)\rvert\Delta k\,t$。开始时包络越窄，所含的波数越散（[傅里叶变换](lesson:math.pde.fourier-transform)例 2），展得越快。:term[高斯波包]{id="physics.oscillations-waves.wave-packet"}$e^{-x^2/w^2}e^{-ik_0x}$降到峰高$\frac1e$处的半宽，包络的是$w$，$\tilde A$的是$\frac2w$（[傅里叶反演公式](lesson:math.pde.fourier-inversion#thm-gaussian-transform)）：偏$\frac2w$的部分和中心的速度差约$\frac{2\lvert\omega''(k_0)\rvert}w$，拉开$w$那么远，要约$\frac{w^2}{2\lvert\omega''(k_0)\rvert}$的时间（精确的宽度见第 5 题）。

没有:term[色散]{id="physics.oscillations-waves.dispersion"}的弦，$\omega=vk$，包络严格不变形。边界情况：$\omega$是$k$的一次函数、常数项不为零时，照定义有色散，:term[群速度]{id="physics.oscillations-waves.group-velocity"}却处处相同，包络不变形，只是波峰在包络里滑动；$\omega''(k_0)=0$只去掉了二阶项，不为零的三阶项还会让包络变形。

展宽以后峰值变低，可$\int\lvert\tilde y\rvert^2\dd x$（它只是能量的代表）不变：$t$时刻的$\tilde y$正是$\tilde Ae^{i\omega t}$对$k$的傅里叶变换，$\tilde Ae^{i\omega t}$的模不随$t$变，由[傅里叶反演公式](lesson:math.pde.fourier-inversion#thm-plancherel)（$\int\lvert\tilde A\rvert\dd k$、$\int\lvert\tilde A\rvert^2\dd k$都有限），这个积分总是$2\pi\int\lvert\tilde A\rvert^2\dd k$。[色散关系](lesson:physics.oscillations-waves.dispersion-relations)一节说脉冲摊开、总能量不变，道理相同。

### 信号和能量

一列:term[简谐波]{id="physics.oscillations-waves.harmonic-wave"}处处一样，传不了信号。:term[波包]{id="physics.oscillations-waves.wave-packet"}以外的介质几乎不动，几乎没有能量，所以没有吸收时，能量和信号都跟着:term[包络]{id="physics.oscillations-waves.envelope"}走，以:term[群速度]{id="physics.oscillations-waves.group-velocity"}传播。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-10, 50], y: [-1.2, 1.2] }
functions:
  - expr: "sum(j, -15, 15, exp(-(j/10)^2*4)*cos((3 + j/10)*x - (3 + j/10)^2/2*s))/sum(j, -15, 15, exp(-(j/10)^2*4))"
    label: |
      波包
  - expr: "exp(-(x - 3*s)^2/16)"
    label: |
      以群速度平移、不变形的包络
sliders:
  - name: s
    min: 0
    max: 12
    step: 0.05
    default: 0
    label: |
      时间$t$
:::

取$\omega=\frac12k^2$、$k_0=3$、$w=4$，横轴是位置，图上写作 x。蓝线是 31 个:term[波数]{id="physics.oscillations-waves.wave-number"}叠成的:term[高斯波包]{id="physics.oscillations-waves.wave-packet"}，橙线是以:term[群速度]{id="physics.oscillations-waves.group-velocity"}$v_{\mathrm g}=3$平移的:term[包络]{id="physics.oscillations-waves.envelope"}。拖动时间：一群波跟着橙线走，波峰却只以$v_{\mathrm p}=1.5$前进，和水波相反，从前沿冒出来、落到后沿消失；到$t=\frac{w^2}{2\lvert\omega''\rvert}=8$时，蓝线已明显比橙线宽、矮。

## 例题

### 例 1　一维链上的群速度

:term[一维链]{id="physics.oscillations-waves.beaded-string"}（beaded string）上，求:term[波数]{id="physics.oscillations-waves.wave-number"}在$0<ka<\pi$里的:term[波包]{id="physics.oscillations-waves.wave-packet"}的:term[群速度]{id="physics.oscillations-waves.group-velocity"}。:term[波长]{id="physics.oscillations-waves.wavelength"}为$3a$时，它和:term[相速度]{id="physics.oscillations-waves.phase-velocity"}各是长波极限$v$的多少倍？$ka\to\pi$时呢？

**为什么想到这么做**：:term[色散关系]{id="physics.oscillations-waves.dispersion-relation"}是现成的（[色散关系](lesson:physics.oscillations-waves.dispersion-relations#thm-chain-dispersion)），对$k$求导就得群速度。

**推导**：$\omega=2\sqrt{\frac T{ma}}\sin\frac{ka}2$，$v=\sqrt{\frac{Ta}m}$，所以$v_{\mathrm g}=\dv\omega k=v\cos\frac{ka}2$，$v_{\mathrm p}=v\frac{\sin(ka/2)}{ka/2}$。波长为$3a$时$\frac{ka}2=\frac\pi3$，$v_{\mathrm g}=\frac v2$，$v_{\mathrm p}\approx0.827v$。$ka\to\pi$时相邻小球反向振动，$v_{\mathrm p}\to\frac2\pi v$，$v_{\mathrm g}\to0$：波包不再前进，只在原地变宽；再高的:term[频率]{id="physics.oscillations-waves.frequency"}（frequency）就传不出去了。

## 常见误区

- 「:term[群速度]{id="physics.oscillations-waves.group-velocity"}不会大于真空中的光速$c$。」吸收很强的:term[频率]{id="physics.oscillations-waves.frequency"}附近，$\dv\omega k$可以大于$c$，甚至为负，:term[波包]{id="physics.oscillations-waves.wave-packet"}在那里边走边被吸收、变了形，它的峰不再代表信号。相对论限制的是信号的前沿（signal front），它不会超过$c$（见[介质的色散](lesson:physics.electromagnetism.dispersion)、[时空图与光锥](lesson:physics.special-relativity.spacetime-diagrams#thm-causal-order)）。

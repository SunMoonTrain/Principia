---
id: physics.oscillations-waves.gas-sound-speed
title: |
  气体中的声速
goal: |
  会求出理想气体中的声速$v=\sqrt{\gamma RT/M}$，并说明为什么要用绝热过程而不是等温过程。
prerequisites: [physics.oscillations-waves.sound-waves, physics.thermal-physics.adiabatic-processes]
minutes: 29
summary: |
  $\gamma$不变的理想气体里的小振幅声波，各层准静态绝热时，声速$v=\sqrt{\gamma RT/M}$。
status: reviewed
---

## 这一节要回答的问题

[声波](lesson:physics.oscillations-waves.sound-waves)例 1 由实测的:term[声速]{id="physics.oscillations-waves.speed-of-sound"}（speed of sound）反推出，$20\,^\circ\mathrm C$空气的:term[体积模量]{id="physics.oscillations-waves.bulk-modulus"}（bulk modulus）约是大气压（atmospheric pressure）的 1.4 倍，可温度不变时它只等于压强（pressure）。多出的四成从哪里来？声速又怎样随温度、随气体的种类变？

## 讲解

### 等温的估算

本节的$\gamma$是比热容比（heat capacity ratio），不是:term[阻尼振动]{id="physics.oscillations-waves.damped-oscillation"}（damped oscillation）里的$\frac bm$；$T$和热学里一样只表示热力学温度（thermodynamic temperature），不是张力或:term[周期]{id="physics.oscillations-waves.period"}（period）；$M$是摩尔质量（molar mass），$R$是摩尔气体常量（molar gas constant）；$p_0$、$\rho_0$、$T$都指没有:term[声波]{id="physics.oscillations-waves.sound-wave"}（sound wave）时的值。

牛顿在 1687 年的《自然哲学的数学原理》里第一个算出了空气中的:term[声速]{id="physics.oscillations-waves.speed-of-sound"}。他用的是玻意耳定律（Boyle's law），压强和密度成正比，相当于认为压缩时温度不变：$pV$不变，等温的:term[体积模量]{id="physics.oscillations-waves.bulk-modulus"}$K_{\text{等温}}=-V\dv pV=p$，声速是$\sqrt{p_0/\rho_0}$。

由$pV=nRT$得$\rho_0=\frac{p_0M}{RT}$，空气取$M=0.029\,\mathrm{kg/mol}$，$20\,^\circ\mathrm C$时$\sqrt{p_0/\rho_0}=\sqrt{RT/M}\approx290\,\mathrm{m/s}$，只是实测值$343\,\mathrm{m/s}$的约 0.85 倍。[静止流体中的压强](lesson:physics.newtonian-mechanics.fluid-statics)第 5 题里温度处处相同的大气，用的也是这个假设。

### 理想气体中的声速

::anchor{id="thm-gas-sound-speed"}
定理：一定量的理想气体（ideal gas），$C_{V,\mathrm m}$不随温度变、只做体积变化的功时，过同一个状态，等温的:term[体积模量]{id="physics.oscillations-waves.bulk-modulus"}是$p$，准静态（quasi-static）绝热的体积模量是$\gamma p$。在[声波](lesson:physics.oscillations-waves.sound-waves#thm-sound-equation)一节给出:term[波动方程]{id="physics.oscillations-waves.wave-equation"}（wave equation）的那条定理的条件下，各薄层的压缩和膨胀又都是准静态的绝热过程（adiabatic process）时，:term[声速]{id="physics.oscillations-waves.speed-of-sound"}$v=\sqrt{\gamma p_0/\rho_0}=\sqrt{\gamma RT/M}$。

证明思路：由[绝热过程](lesson:physics.thermal-physics.adiabatic-processes#thm-adiabat-steeper)里绝热线（adiabat）比等温线（isotherm）陡的那条定理，过同一个状态，等温线上$\dv pV=-\frac pV$，绝热线上$\dv pV=-\gamma\frac pV$，各乘$-V$就是两个体积模量。代入[声波](lesson:physics.oscillations-waves.sound-waves#thm-sound-speed)里的$v=\sqrt{K/\rho_0}$，再用$\frac{p_0}{\rho_0}=\frac{RT}M$。

对常温常压空气里的:term[声波]{id="physics.oscillations-waves.sound-wave"}，这些条件都满足：空气近似是理想气体；温度只在极小的范围里变化（第 4 题），$C_{V,\mathrm m}$不会变；略去黏性（viscosity），各层只推挤相邻的层，只做体积变化的功。准静态、绝热两条，见「为什么是绝热」。

由$v=\sqrt{\gamma RT/M}$：温度一定时，密度和压强同比例变，声速不变；声速和$\sqrt T$成正比；同一温度下，比热容比相近的气体，摩尔质量小的传得快。氦气（$\gamma=1.67$，$M=4.0\,\mathrm{g/mol}$）又轻、比热容比又大，$20\,^\circ\mathrm C$时约$1.0\times10^3\,\mathrm{m/s}$。$20\,^\circ\mathrm C$的空气取$\gamma=1.40$，$M$同样取$0.029\,\mathrm{kg/mol}$，得$v\approx343\,\mathrm{m/s}$，正是实测值，牛顿的值是它的$\frac1{\sqrt{1.40}}\approx0.85$倍。

[绝热过程](lesson:physics.thermal-physics.adiabatic-processes)第 6 题瓶口的钢球，压着的瓶中空气像一根弹簧：劲度系数（spring constant）$\frac{\gamma pS^2}V$正是绝热体积模量$\gamma p$乘管的截面积$S$的平方、再除以空气的体积$V$（那道题把截面积写作$A$）。

### 为什么是绝热

绝热只要求没有热量（heat）出入，并不要求缓慢；[准静态过程](lesson:physics.thermal-physics.quasi-static-processes#def-quasi-static)（quasi-static process）要求每一时刻都几乎处在平衡态（equilibrium state）。开阔空气里的:term[声波]{id="physics.oscillations-waves.sound-wave"}两条都成立，靠的是两个时间尺度，[绝热过程](lesson:physics.thermal-physics.adiabatic-processes)讲打气筒和第 6 题瓶口的钢球时就这样分开说过。

一是比分子之间的碰撞慢得多：分子之间碰撞极其频繁，每一薄层时时都几乎处在平衡态，压缩和膨胀是准静态的。

二是比热传导（heat conduction）快得多。在开阔的空气里，压缩得最厉害的地方变热，膨胀得最厉害的地方变冷，两处相距半个:term[波长]{id="physics.oscillations-waves.wavelength"}（wavelength）；空气导热很差，半个:term[周期]{id="physics.oscillations-waves.period"}里热量来不及传过半个波长，各层近似绝热。

有点出人意料：在开阔的空气里，:term[频率]{id="physics.oscillations-waves.frequency"}越低越接近绝热。$20\,\mathrm{Hz}$、$1\,\mathrm{kHz}$、$20\,\mathrm{kHz}$时，热量传过半个波长要的时间和半个周期之比分别是$10^8$、$10^6$、$10^5$量级（估算见第 5 题）。频率高到$10^9\,\mathrm{Hz}$量级时，波长已和:term[平均自由程]{id="physics.thermal-physics.mean-free-path"}（mean free path）差不多，把空气看成连续的描述就不成立了。

十九世纪初，拉普拉斯（Pierre-Simon Laplace）指出声波里的压缩是绝热的，理论才和实验对上。常温的水受热时体积变化很小，比热容比约为 1.01，两种:term[体积模量]{id="physics.oscillations-waves.bulk-modulus"}只差约 1%，在水里用哪一个几乎没有差别；空气里却差四成（一般物质的两种体积模量之比也是比热容比，这里不证）。空气的$\gamma\approx1.40$本节当作实验值（[热容与焓](lesson:physics.thermal-physics.heat-capacity#def-heat-capacity-ratio)的实测表），它为什么约是$\frac75$，见[能量均分定理](lesson:physics.thermal-physics.equipartition)。

## 几何图像

:::anim{component="function-plot"}
range: { x: [200, 400], y: [0, 1300] }
functions:
  - expr: "sqrt(1.40*8.314*x/0.029)"
    label: |
      空气，绝热
  - expr: "sqrt(8.314*x/0.029)"
    label: |
      空气，等温
  - expr: "sqrt(1.67*8.314*x/0.0040)"
    label: |
      氦气，绝热
:::

横轴是热力学温度$T$（$\mathrm K$，图上写作 x），纵轴是:term[声速]{id="physics.oscillations-waves.speed-of-sound"}（$\mathrm{m/s}$，图上写作 y）。蓝线、橙线是空气按绝热、等温算的，绿线是氦气按绝热算的。同一温度下，橙线总是蓝线的约 0.85 倍；氦气的声速约是空气的 2.9 倍：摩尔质量只有空气的约七分之一，比热容比还大些。

## 例题

### 例 1　高空的声速

[多普勒效应](lesson:physics.oscillations-waves.doppler-effect)例 2 把高空的:term[声速]{id="physics.oscillations-waves.speed-of-sound"}取作$300\,\mathrm{m/s}$。空气的比热容比取$1.40$，摩尔质量取$0.029\,\mathrm{kg/mol}$，这对应多低的气温？地面附近$15\,^\circ\mathrm C$时声速是多少？

**为什么想到这么做**：空气的声速只由温度决定，把$v=\sqrt{\gamma RT/M}$反过来就是$T=\frac{Mv^2}{\gamma R}$。

**推导**：$T=\frac{0.029\times300^2}{1.40\times8.314}\,\mathrm K\approx224\,\mathrm K$，约$-49\,^\circ\mathrm C$，是一万米左右高空常见的气温。$15\,^\circ\mathrm C$即$288.15\,\mathrm K$时，$v=\sqrt{\frac{1.40\times8.314\times288.15}{0.029}}\,\mathrm{m/s}\approx340\,\mathrm{m/s}$，正是那一节例 1 和[平面波与球面波](lesson:physics.oscillations-waves.waves-in-3d)例 1 取的值。取$300\,\mathrm{m/s}$的那道例题里，声音从飞机传到地面，一路上声速在变，当作不变是一种简化。

### 例 2　声速和分子的速率

[气体动理论](lesson:physics.thermal-physics.kinetic-theory)例 1 算出，$0\,^\circ\mathrm C$、1 标准大气压（standard atmosphere）下，空气分子的方均根速率（root-mean-square speed）约为$485\,\mathrm{m/s}$（那里空气的密度取$1.29\,\mathrm{kg/m^3}$）。这时空气中的:term[声速]{id="physics.oscillations-waves.speed-of-sound"}是多少？和方均根速率比一比。

**为什么想到这么做**：两者都和$\sqrt{p_0/\rho_0}$成正比：$v=\sqrt{\gamma p_0/\rho_0}$，$v_{\mathrm{rms}}=\sqrt{3p_0/\rho_0}$，比值只和$\gamma$有关。

**推导**：$\frac v{v_{\mathrm{rms}}}=\sqrt{\frac\gamma3}=\sqrt{\frac{1.40}3}\approx0.683$，$v\approx0.683\times485\,\mathrm{m/s}\approx331\,\mathrm{m/s}$。声速和分子热运动（thermal motion）的速率是同一个量级，又小一些：扰动正是靠分子的运动和碰撞一层层传过去的。

## 常见误区

- 「空气里的:term[声速]{id="physics.oscillations-waves.speed-of-sound"}是一个固定的数，约$340\,\mathrm{m/s}$。」声速随温度变：约$331\,\mathrm{m/s}$对应$0\,^\circ\mathrm C$，$340\,\mathrm{m/s}$对应$15\,^\circ\mathrm C$，$343\,\mathrm{m/s}$对应$20\,^\circ\mathrm C$。说空气里的声速，要带上温度。
- 「:term[声波]{id="physics.oscillations-waves.sound-wave"}振动得快，热量来不及传，所以是绝热的；:term[频率]{id="physics.oscillations-waves.frequency"}越高越接近绝热。」该比的是热量传过半个:term[波长]{id="physics.oscillations-waves.wavelength"}的时间和半个:term[周期]{id="physics.oscillations-waves.period"}；在开阔的空气里，频率越低反而越接近绝热。

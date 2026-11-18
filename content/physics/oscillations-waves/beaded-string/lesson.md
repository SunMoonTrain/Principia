---
id: physics.oscillations-waves.beaded-string
title: |
  一维链与连续极限
goal: |
  会求$N$个耦合振子组成的一维链的简正模，并看出$N$很大时它变成一根弦。
prerequisites: [physics.oscillations-waves.normal-modes, math.vector-calculus.partial-derivatives]
minutes: 22
summary: |
  $N$个小球的链有$N$个简正模，$\omega_n=2\sqrt{\frac T{ma}}\sin\frac{n\pi}{2(N+1)}$；连续极限给出波动方程。
status: reviewed
---

## 这一节要回答的问题

一根绷紧的绳上串着许多小球，每个小球只和左右的邻居相连。它有多少个:term[简正模]{id="physics.oscillations-waves.normal-mode"}（normal mode），各是什么样子？小球越来越多、越来越密时，这串小球像不像一根弦，弦的运动又满足什么方程？

## 讲解

### 一维链的运动方程

::anchor{id="def-beaded-string"}
$N$个质量都是$m$的小球，以间距$a$串在一根质量不计、张力为$T$的绳上，绳的两端固定，小球只在垂直于绳的方向做小振动，这样的系统叫作:term[一维链]{id="physics.oscillations-waves.beaded-string"}（beaded string），也叫小球链。记第$j$个小球的横向位移为$y_j$，两端固定写成$y_0=y_{N+1}=0$，链长$\ell=(N+1)a$。

为什么这样定义：它是最简单的$N$个:term[耦合振子]{id="physics.oscillations-waves.coupled-oscillators"}（coupled oscillators）：每个小球只受左右两段绳的拉力，只和邻居耦合，$N$个方程的形式全都一样。边界情况：位移不小时，绳的斜率不再小，张力也随之改变，下面的方程就不成立了。

::anchor{id="thm-chain-equations"}
定理：绳的斜率很小时，$m\ddot y_j=\frac Ta\,(y_{j+1}-2y_j+y_{j-1})$，$j=1,\dots,N$。

证明思路：小球$j$右边那段绳以张力$T$沿绳拉它，绳和原来方向的夹角$\alpha$很小时，横向分量$T\sin\alpha\approx T\tan\alpha=T\frac{y_{j+1}-y_j}a$；左边那段给出$-T\frac{y_j-y_{j-1}}a$。绳的伸长是位移的二次小量，张力的变化可以略去，两个分量相加即得。

$N=2$时，方程和[耦合振子与简正模](lesson:physics.oscillations-waves.normal-modes#thm-normal-modes)里三根弹簧一样硬的两个物块相同，相当于劲度系数（spring constant）$k=\frac Ta$。

### 一维链的简正模

::anchor{id="thm-chain-modes"}
定理：:term[一维链]{id="physics.oscillations-waves.beaded-string"}正好有$N$个:term[简正模]{id="physics.oscillations-waves.normal-mode"}。第$n$个（$n=1,2,\dots,N$）简正模里，第$j$个小球的:term[振幅]{id="physics.oscillations-waves.amplitude"}（amplitude）正比于$\sin\frac{jn\pi}{N+1}$，:term[简正频率]{id="physics.oscillations-waves.normal-frequency"}（normal frequency）是$\omega_n=2\sqrt{\frac T{ma}}\sin\frac{n\pi}{2(N+1)}$。

证明思路：设$y_j=\sin(j\theta)\cos(\omega t+\varphi)$，由$\sin(j+1)\theta+\sin(j-1)\theta=2\sin j\theta\cos\theta$，方程右边是$-\frac{2T}a(1-\cos\theta)\sin j\theta\cos(\omega t+\varphi)$，所以只要$m\omega^2=\frac{4T}a\sin^2\frac\theta2$，每个方程都满足。$y_0=0$自动成立，$y_{N+1}=0$要求$\theta=\frac{n\pi}{N+1}$。$n=N+1$时所有$y_j$都是零，$n$再大，形状只是前面的重复或差一个负号，所以不同的简正模正好是$n=1,\dots,N$这$N$个，和小球的个数一样。

$n=1$的简正模里所有小球在同一侧，排成半个正弦拱，:term[频率]{id="physics.oscillations-waves.frequency"}（frequency）最低；$n=N$时相邻小球总是反向，频率最高，但仍小于$2\sqrt{\frac T{ma}}$。

### 连续极限

让小球越来越多、越来越轻、越来越密：$N\to\infty$、$a\to0$，同时保持线密度（linear density）$\mu=\frac ma$和链长$\ell$不变。第$j$个小球的位置$x=ja$变成连续的变量，$y_j(t)$变成二元函数$y(x,t)$，偏导数（partial derivative）记作$y_t=\frac{\partial y}{\partial t}$、$y_{xx}=\frac{\partial^2y}{\partial x^2}$等（见[偏导数](lesson:math.vector-calculus.partial-derivatives#def-second-partials)）。

::anchor{id="thm-continuum-limit"}
定理：对固定的$n$，$N\to\infty$时第$n$个:term[简正模]{id="physics.oscillations-waves.normal-mode"}的形状趋于$\sin\frac{n\pi x}\ell$，:term[简正频率]{id="physics.oscillations-waves.normal-frequency"}趋于$\frac{n\pi v}\ell$，其中$v=\sqrt{\frac T\mu}$；运动方程趋于$\mu y_{tt}=Ty_{xx}$。

证明思路：$\frac{jn\pi}{N+1}=\frac{n\pi x}\ell$。$\frac{n\pi}{2(N+1)}\to0$，$\sin$可以换成它的自变量，$\omega_n\approx\frac{n\pi}{N+1}\sqrt{\frac T{ma}}=\frac{n\pi}\ell\sqrt{\frac{Ta}m}=\frac{n\pi v}\ell$。方程两边除以$a$：$\frac ma\ddot y_j=T\frac{y_{j+1}-2y_j+y_{j-1}}{a^2}$；由泰勒公式（Taylor's formula），$y(x\pm a)=y\pm ay_x+\frac{a^2}2y_{xx}+o(a^2)$，所以右边的分式趋于$y_{xx}$。

$\mu y_{tt}=Ty_{xx}$就是弦的:term[波动方程]{id="physics.oscillations-waves.wave-equation"}（wave equation），[弦的波动方程](lesson:physics.oscillations-waves.wave-equation)直接由弦的受力推出它。

## 几何图像

:::anim{component="oscillator"}
masses: [1, 1, 1, 1, 1, 1]
springs: [1, 1, 1, 1, 1, 1, 1]
initial: ["sin(n*pi/7)", "sin(2*n*pi/7)", "sin(3*n*pi/7)", "sin(4*n*pi/7)", "sin(5*n*pi/7)", "sin(6*n*pi/7)"]
dt: 0.01
sliders:
  - name: n
    min: 1
    max: 6
    step: 1
    default: 1
    label: |
      简正模的序号$n$
:::

六个物块按第$n$个:term[简正模]{id="physics.oscillations-waves.normal-mode"}的形状由静止放开。组件画的是物块沿链的方向振动（纵向），方程$m\ddot x_j=k(x_{j+1}-2x_j+x_{j-1})$和横向的:term[一维链]{id="physics.oscillations-waves.beaded-string"}一样，只是$\frac Ta$换成了弹簧的$k$。每个$n$下六条曲线步调一致、:term[振幅]{id="physics.oscillations-waves.amplitude"}之比不变；$n$越大振得越快，$n=6$时相邻物块反向。

:::anim{component="function-plot"}
range: { x: [0, 21], y: [0, 3.3] }
functions:
  - expr: "pi*x/(N + 1)"
    label: |
      按连续的弦算的$\frac{n\pi}{N+1}$
sequences:
  - expr: "2*sin(n*pi/(2*(N + 1))) + 0*sqrt(N - n)"
    n: [1, 20]
    label: |
      一维链的$\omega_n$（以$\sqrt{T/(ma)}$为单位）
sliders:
  - name: N
    min: 6
    max: 20
    step: 1
    default: 10
    label: |
      小球数$N$
:::

横轴是简正模的序号$n$（图上写作$x$）。橙色的圆点是一维链的:term[简正频率]{id="physics.oscillations-waves.normal-frequency"}，只画到$n=N$；蓝线是连续的弦给出的$\frac{n\pi}{N+1}$。$n$比$N$小得多时两者几乎重合，$n$接近$N$时链的:term[频率]{id="physics.oscillations-waves.frequency"}明显偏低。

## 例题

### 例 1　三个小球

$N=3$，求三个:term[简正模]{id="physics.oscillations-waves.normal-mode"}的形状和:term[简正频率]{id="physics.oscillations-waves.normal-frequency"}。

**为什么想到这么做**：直接代入定理，$\frac{n\pi}{N+1}=\frac{n\pi}4$。

**推导**：记$\omega_*=\sqrt{\frac T{ma}}$。$n=1$：$\bigl(\sin\frac\pi4,\sin\frac\pi2,\sin\frac{3\pi}4\bigr)\propto(1,\sqrt2,1)$，$\omega_1=2\omega_*\sin\frac\pi8\approx0.765\omega_*$。$n=2$：$(1,0,-1)$，中间的小球不动，$\omega_2=2\omega_*\sin\frac\pi4=\sqrt2\omega_*$。$n=3$：$(1,-\sqrt2,1)$，$\omega_3=2\omega_*\sin\frac{3\pi}8\approx1.848\omega_*$。

### 例 2　链有多像弦

$N=10$时，第 1 个和第 10 个:term[简正频率]{id="physics.oscillations-waves.normal-frequency"}各是连续的弦给出的$\frac{n\pi v}\ell$的多少倍？

**为什么想到这么做**：两者之比是$\frac{2\sin\frac{n\pi}{2(N+1)}}{\frac{n\pi}{N+1}}=\frac{\sin u}u$，$u=\frac{n\pi}{2(N+1)}$。

**推导**：$n=1$时$u=\frac\pi{22}\approx0.143$，$\frac{\sin u}u\approx0.9966$；$n=10$时$u=\frac{10\pi}{22}\approx1.428$，$\frac{\sin u}u\approx0.693$。最低的:term[简正模]{id="physics.oscillations-waves.normal-mode"}和弦只差千分之几，最高的简正模却低了约三成：小球数一定时，只有远比间距长的「波形」才看不出链是一粒一粒的。

## 常见误区

- 「$N$个小球的链有无穷多个:term[简正模]{id="physics.oscillations-waves.normal-mode"}，和弦一样。」只有$N$个；$n>N$时$\sin\frac{jn\pi}{N+1}$只是重复前面的形状，或者全为零。
- 「小球越多，每个:term[简正频率]{id="physics.oscillations-waves.normal-frequency"}都越接近$\frac{n\pi v}\ell$。」对固定的$n$才是；$n$接近$N$的高阶简正模，$N$再大也偏离很多（例 2）。
- 「:term[频率]{id="physics.oscillations-waves.frequency"}最低的简正模里，相邻小球反向振动。」正好相反：频率最低时所有小球在同一侧，相邻小球反向的是频率最高的简正模。

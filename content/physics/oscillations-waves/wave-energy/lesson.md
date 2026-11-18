---
id: physics.oscillations-waves.wave-energy
title: |
  波的能量与能流
goal: |
  会求弦上波的能量密度和能流（功率），说明能量随着波一起传播，并核算反射、透射时的能量。
prerequisites: [physics.oscillations-waves.reflection-transmission, physics.oscillations-waves.oscillation-energy]
minutes: 22
summary: |
  能流$j=-Ty_xy_t$；行波里$j=vu$，能量随波形以$v$移动；简谐波功率$\frac12Z\omega^2A^2$。
status: reviewed
---

## 这一节要回答的问题

抖动绳子的一端，手要不停地做功，这些能量到哪里去了？它怎样沿着绳子跑出去，跑得多快？波在两根弦的连接处分成反射波和透射波，能量是不是正好分完？

## 讲解

### 能量密度与能流

::anchor{id="thm-string-energy"}
定理：斜率很小时，弦上$x$到$x+\Delta x$的一小段，动能是$\frac12\mu y_t^2\Delta x$，势能是$\frac12Ty_x^2\Delta x$（以弦拉直、静止时为零）。

证明思路：这一段的质量是$\mu\Delta x$，横向速度是$y_t$，动能是$\frac12\mu\Delta x\,y_t^2$。弦弯起来以后，这一段长$\sqrt{1+y_x^2}\,\Delta x\approx\bigl(1+\frac12y_x^2\bigr)\Delta x$，比拉直时长了$\frac12y_x^2\Delta x$；张力$T$把它拉长这么多要做功$\frac12Ty_x^2\Delta x$，这就是它储存的势能。

::anchor{id="def-energy-flux"}
弦上单位长度的能量$u=\frac12\mu y_t^2+\frac12Ty_x^2$叫作能量密度（energy density）；单位时间里从$x$处的左边传到右边的能量$j=-Ty_xy_t$叫作:term[能流]{id="physics.oscillations-waves.energy-flux"}（energy flux）。

为什么这样定义：$x$左边的弦对右边的弦施加横向拉力$-Ty_x$，那里的点以$y_t$运动，这个力做功的功率（power）就是$-Ty_xy_t$，能量正是靠它从左边送到右边，$j>0$表示向右流。能流的单位和功率一样是瓦。边界情况：弦的末端固定时，那里$y_t=0$，$j=0$，能量不会从末端流走。

::anchor{id="thm-energy-continuity"}
定理：弦的运动满足:term[波动方程]{id="physics.oscillations-waves.wave-equation"}（wave equation）时，$\pdv ut+\pdv jx=0$。

证明思路：$\pdv ut=\mu y_ty_{tt}+Ty_xy_{xt}$，用$\mu y_{tt}=Ty_{xx}$换掉第一项，得$T(y_ty_{xx}+y_xy_{xt})=\pdv{}x(Ty_xy_t)=-\pdv jx$。所以一段弦$[x_1,x_2]$上的能量$\int_{x_1}^{x_2}u\,\dd x$的变化率等于$j(x_1)-j(x_2)$，即左端流进来的减去右端流出去的。

### 行波的能量

::anchor{id="thm-traveling-energy"}
定理：在:term[行波]{id="physics.oscillations-waves.traveling-wave"}（traveling wave）$y=f(x-vt)$里，动能密度和势能密度时时处处相等，$u=Tf'^2$，:term[能流]{id="physics.oscillations-waves.energy-flux"}$j=vu$；:term[振幅]{id="physics.oscillations-waves.amplitude"}（amplitude）为$A$、:term[角频率]{id="physics.oscillations-waves.angular-frequency"}（angular frequency）为$\omega$的:term[简谐波]{id="physics.oscillations-waves.harmonic-wave"}（harmonic wave），一个:term[周期]{id="physics.oscillations-waves.period"}（period）里的平均能流是$\bar P=\frac12Z\omega^2A^2$，$Z$是弦的:term[阻抗]{id="physics.oscillations-waves.impedance"}（impedance）。

证明思路：$y_x=f'$，$y_t=-vf'$，$\frac12\mu y_t^2=\frac12\mu v^2f'^2=\frac12Tf'^2=\frac12Ty_x^2$，所以$u=Tf'^2$，$j=Tvf'^2=vu$。向右的行波里$-Ty_x=Zy_t$（见[波的反射与透射](lesson:physics.oscillations-waves.reflection-transmission#def-impedance)），所以$j=Zy_t^2$；简谐波的$y_t=-A\omega\sin(\omega t-kx+\varphi)$，$\sin^2$在一个周期里的平均是$\frac12$（见[简谐运动的能量与小振动](lesson:physics.oscillations-waves.oscillation-energy#thm-shm-energy)），得$\bar P=\frac12Z\omega^2A^2$。

$j=vu$说的是：能量密度为$u$的那一段波形以$v$平移，单位时间扫过一点的能量正好是$vu$，能量跟着波形走。这和弹簧振子不同：弹簧振子的动能和势能此消彼长，总量不变；弦上的一小段在平衡位置时动能、势能同时最大，到波峰时同时为零。它的能量并不守恒，而是一边从左边接收，一边送给右边。

### 连接处的能量

::anchor{id="thm-junction-energy"}
定理：张力相同的两根弦连在一起，:term[简谐波]{id="physics.oscillations-waves.harmonic-wave"}从弦 1 射到连接处，反射波、透射波的平均功率分别占入射波的$r^2$和$\frac{Z_2}{Z_1}\tau^2$，两者之和是$1$。

证明思路：三列波的:term[频率]{id="physics.oscillations-waves.frequency"}（frequency）相同，平均功率都是$\frac12Z\omega^2\times$:term[振幅]{id="physics.oscillations-waves.amplitude"}的平方，振幅之比是$r$和$\tau$（见[波的反射与透射](lesson:physics.oscillations-waves.reflection-transmission#thm-reflection)），所以两个比例是$r^2$和$\frac{Z_2}{Z_1}\tau^2$。代入$r=\frac{Z_1-Z_2}{Z_1+Z_2}$、$\tau=\frac{2Z_1}{Z_1+Z_2}$，和为$\frac{(Z_1-Z_2)^2+4Z_1Z_2}{(Z_1+Z_2)^2}=1$。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 3], y: [-1.3, 1.3] }
functions:
  - expr: "cos(2*pi*(x - s))"
    label: |
      位移$y$
  - expr: "sin(2*pi*(x - s))^2"
    label: |
      能量密度$u$
sliders:
  - name: s
    min: 0
    max: 2
    step: 0.01
    default: 0
    label: |
      时间$t$（以周期为单位）
:::

横轴是位置$x$（以:term[波长]{id="physics.oscillations-waves.wavelength"}（wavelength）为单位），蓝线是向右传播的:term[简谐波]{id="physics.oscillations-waves.harmonic-wave"}的位移（以:term[振幅]{id="physics.oscillations-waves.amplitude"}为单位），橙线是能量密度（以它的最大值为单位）。拖动时间，能量密度的峰跟着波形一起向右平移，这正是:term[能流]{id="physics.oscillations-waves.energy-flux"}$j=vu$的意思。它在位移为零的地方最大，在波峰、波谷处为零：那里的弦既不动，也没有被拉长。

## 例题

### 例 1　弦上的简谐波带多大功率

一根弦的线密度（linear density）是$5.0\,\mathrm{g/m}$，张力是$80\,\mathrm N$，弦上有:term[频率]{id="physics.oscillations-waves.frequency"}$100\,\mathrm{Hz}$、:term[振幅]{id="physics.oscillations-waves.amplitude"}$2.0\,\mathrm{mm}$的:term[简谐波]{id="physics.oscillations-waves.harmonic-wave"}向右传播。求它的平均功率。

**为什么想到这么做**：先求:term[阻抗]{id="physics.oscillations-waves.impedance"}$Z=\sqrt{T\mu}$，再用$\bar P=\frac12Z\omega^2A^2$。

**推导**：$Z=\sqrt{80\times5.0\times10^{-3}}\,\mathrm{kg/s}\approx0.632\,\mathrm{kg/s}$，$\omega=2\pi\times100\,\mathrm{rad/s}\approx628\,\mathrm{rad/s}$，$\bar P=\frac12\times0.632\times628^2\times(2.0\times10^{-3})^2\,\mathrm W\approx0.50\,\mathrm W$。频率或振幅变为原来的 2 倍，功率都变为原来的 4 倍。

### 例 2　连接处的能量核算

两根张力相同的弦，$\mu_2=4\mu_1$。:term[简谐波]{id="physics.oscillations-waves.harmonic-wave"}先从弦 1 射向弦 2，再换成从弦 2 射向弦 1，分别核算连接处的能量。

**为什么想到这么做**：由线密度之比求:term[阻抗]{id="physics.oscillations-waves.impedance"}之比，算出$r$、$\tau$，再求$r^2$和$\frac{Z_2}{Z_1}\tau^2$（下标按「从哪根射来」重新编）。

**推导**：从轻射向重，$\frac{Z_2}{Z_1}=2$，$r=-\frac13$，$\tau=\frac23$，反射占$\frac19$，透射占$2\times\frac49=\frac89$。从重射向轻，阻抗之比是$\frac12$，$r=\frac13$，$\tau=\frac43$：透射波的:term[振幅]{id="physics.oscillations-waves.amplitude"}比入射波还大，可轻弦的阻抗小，透射的功率占$\frac12\times\frac{16}9=\frac89$，加上反射的$\frac19$仍是$1$。

## 常见误区

- 「弦上的每一小段像弹簧振子一样，动能和势能此消彼长。」:term[行波]{id="physics.oscillations-waves.traveling-wave"}里两者时时相等，在平衡位置同时最大，在波峰、波谷同时为零。
- 「能量沿弦传过去，是因为弦上的物质被送了过去。」弦上的点只在横向来回动，能量是左边的弦对右边的弦做功传过去的，$j=-Ty_xy_t$正是这个功率。
- 「:term[简谐波]{id="physics.oscillations-waves.harmonic-wave"}的功率只和:term[振幅]{id="physics.oscillations-waves.amplitude"}有关。」$\bar P=\frac12Z\omega^2A^2$，同样的振幅，:term[频率]{id="physics.oscillations-waves.frequency"}越高功率越大，弦的:term[阻抗]{id="physics.oscillations-waves.impedance"}越大功率也越大。

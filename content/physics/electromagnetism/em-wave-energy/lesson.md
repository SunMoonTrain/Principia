---
id: physics.electromagnetism.em-wave-energy
title: |
  电磁波的能量与强度
goal: |
  会求电磁波的能量密度和坡印亭矢量的时间平均，并由此求出强度。
prerequisites: [physics.electromagnetism.em-waves, physics.electromagnetism.poynting-theorem]
minutes: 35
summary: |
  电磁波里电场、磁场的能量各占一半；强度是能流的时间平均。
status: reviewed
---

## 这一节要回答的问题

阳光晒在身上是热的，收音机离电台越远，收到的信号越弱。:term[电磁波]{id="physics.electromagnetism.em-wave"}（electromagnetic wave）带着多少能量？能量沿什么方向、以多快的速度流动？怎样用一个数说明一束光或一列无线电波有多强？

## 讲解

### 能量密度和能流

::anchor{id="thm-wave-energy"}
定理（:term[平面电磁波]{id="physics.electromagnetism.em-wave"}的能量）：真空中的平面电磁波里，:term[电场]{id="physics.electromagnetism.electric-field"}（electric field）和:term[磁场]{id="physics.electromagnetism.magnetic-field"}（magnetic field）的:term[能量密度]{id="physics.electromagnetism.energy-density"}（energy density）时时处处相等，$\frac{\varepsilon_0}{2}E^2=\frac{1}{2\mu_0}B^2$，总能量密度$u=\varepsilon_0E^2$；:term[坡印亭矢量]{id="physics.electromagnetism.poynting-vector"}（Poynting vector）沿传播方向，$\vb S=cu\,\uv n$。

证明思路：平面波里$B=\frac Ec$，$\frac{B^2}{2\mu_0}=\frac{E^2}{2\mu_0c^2}=\frac{\varepsilon_0}{2}E^2$，用了$\mu_0\varepsilon_0c^2=1$。$\vb E\perp\vb B$，$\vb E\times\vb B$沿$\uv n$，$S=\frac{EB}{\mu_0}=\frac{E^2}{\mu_0c}=c\varepsilon_0E^2=cu$。

$\vb S=cu\,\uv n$说的是：能量密度为$u$的一层场以速度$c$沿传播方向平移，单位时间穿过单位面积的能量正是$cu$，能量随波一起以光速流动。这和弦上的波一样，能量跟着波形走（见[波的能量与能流](lesson:physics.oscillations-waves.wave-energy)）。

### 强度

可见光的频率是$10^{14}\,\mathrm{Hz}$量级，眼睛、照相机、光电池都跟不上这么快的变化，测到的是一段时间里的平均。

::anchor{id="def-intensity"}
:term[坡印亭矢量]{id="physics.electromagnetism.poynting-vector"}的大小对一个周期的平均$I=\langle S\rangle$叫作:term[电磁波]{id="physics.electromagnetism.em-wave"}的:term[强度]{id="physics.electromagnetism.intensity"}（intensity），单位是$\mathrm{W/m^2}$；对振幅为$E_0$的简谐平面波，$I=\frac12c\varepsilon_0E_0^2=\frac{E_0B_0}{2\mu_0}=c\langle u\rangle$。

为什么这样定义：强度就是单位时间垂直穿过单位面积的平均能量，探测器吸收的功率等于强度乘以面积；$\cos^2$对一个周期的平均是$\frac12$，所以有那个$\frac12$。强度和:term[电场]{id="physics.electromagnetism.electric-field"}振幅的平方成正比，振幅加倍，强度变成四倍。边界情况：两列相向传播的波形成驻波（standing wave）时，坡印亭矢量来回变号，平均为零，可:term[能量密度]{id="physics.electromagnetism.energy-density"}不为零：能量储存在那里，平均下来并不流动（第 5 题）。

阳光在地球大气层外垂直照射时的强度约为$1361\,\mathrm{W/m^2}$，这是卫星测得的平均值，会随太阳活动有千分之一左右的起伏，以前叫「太阳常数」（例 1）。

### 点源的强度和距离

各向同性的点源以功率$P$向四周发出:term[电磁波]{id="physics.electromagnetism.em-wave"}，能量没有损失时，单位时间穿过以它为球心、半径为$r$的球面的能量都是$P$，所以$I=\frac{P}{4\pi r^2}$：:term[强度]{id="physics.electromagnetism.intensity"}和距离的平方成反比，:term[电场]{id="physics.electromagnetism.electric-field"}振幅和距离成反比，正是球面波的振幅按$\frac1r$衰减（见[平面波与球面波](lesson:physics.oscillations-waves.waves-in-3d)）。离源很远时，一小块地方的波面几乎是平的，可以当平面波算。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 2], y: [-1.1, 2.2] }
functions:
  - expr: "0.5*(cos(2*pi*(x - s)) - r*cos(2*pi*(x + s)))^2"
    label: |
      电场的能量密度，以$\varepsilon_0E_0^2$为单位
  - expr: "0.5*(cos(2*pi*(x - s)) + r*cos(2*pi*(x + s)))^2"
    label: |
      磁场的能量密度，以$\varepsilon_0E_0^2$为单位
  - expr: "cos(2*pi*(x - s))^2 - r^2*cos(2*pi*(x + s))^2"
    label: |
      坡印亭矢量的$z$分量，以$c\varepsilon_0E_0^2$为单位
sliders:
  - name: s
    min: 0
    max: 1
    step: 0.05
    default: 0
    label: |
      时间，以周期为单位
  - name: r
    min: 0
    max: 1
    step: 0.25
    default: 0
    label: |
      反向传播的那列波的振幅，以$E_0$为单位
:::

动画画的是沿$z$轴（图上写作$x$，以波长为单位）的:term[能量密度]{id="physics.electromagnetism.energy-density"}和:term[坡印亭矢量]{id="physics.electromagnetism.poynting-vector"}，场和[真空中的电磁波](lesson:physics.electromagnetism.em-waves)里的动画一样。$r=0$时只有一列行波：:term[电场]{id="physics.electromagnetism.electric-field"}和:term[磁场]{id="physics.electromagnetism.magnetic-field"}的能量密度两条曲线重合，坡印亭矢量（以$c\varepsilon_0E_0^2$为单位）正好等于两者之和，处处为正，一起向右移，平均值是$\frac12$。$r=1$时成了驻波：电场的能量和磁场的能量在空间上错开四分之一波长、在时间上此消彼长，坡印亭矢量正负交替，能量只在相邻的两处之间来回倒，平均下来不流动。

## 例题

### 例 1　阳光的电场和磁场

在地球大气层外，阳光垂直照射时的:term[强度]{id="physics.electromagnetism.intensity"}约为$1361\,\mathrm{W/m^2}$。把阳光当成一列简谐平面波，估计:term[电场]{id="physics.electromagnetism.electric-field"}和:term[磁场]{id="physics.electromagnetism.magnetic-field"}的振幅，以及:term[能量密度]{id="physics.electromagnetism.energy-density"}的时间平均。

**为什么想到这么做**：由$I=\frac12c\varepsilon_0E_0^2$解出$E_0$，$B_0=\frac{E_0}{c}$，$\langle u\rangle=\frac Ic$。阳光包含许多频率，这样算出的是一个等效的振幅。

**推导**：$E_0=\sqrt{\frac{2I}{c\varepsilon_0}}=\sqrt{\frac{2\times1361}{3.00\times10^8\times8.854\times10^{-12}}}\,\mathrm{V/m}\approx1.01\times10^3\,\mathrm{V/m}$，$B_0=\frac{E_0}{c}\approx3.4\times10^{-6}\,\mathrm T$。$\langle u\rangle=\frac Ic\approx4.5\times10^{-6}\,\mathrm{J/m^3}$。电场振幅约一千伏每米，可方向每秒变化$10^{15}$次左右，平均起来推不动:term[电荷]{id="physics.electromagnetism.electric-charge"}（electric charge）。

### 例 2　电台的信号

把一个功率为$50\,\mathrm{kW}$的电台当成各向同性的点源，求$10\,\mathrm{km}$外的:term[强度]{id="physics.electromagnetism.intensity"}和:term[电场]{id="physics.electromagnetism.electric-field"}的振幅。

**为什么想到这么做**：能量均匀地分布在半径为$r$的球面上，$I=\frac{P}{4\pi r^2}$；再由$I=\frac12c\varepsilon_0E_0^2$求振幅。

**推导**：$I=\frac{5.0\times10^4}{4\pi\times(1.0\times10^4)^2}\,\mathrm{W/m^2}\approx4.0\times10^{-5}\,\mathrm{W/m^2}$，$E_0=\sqrt{\frac{2I}{c\varepsilon_0}}\approx0.17\,\mathrm{V/m}$。实际的天线向水平方向发得多，地面附近的强度比这个估计大一些，量级不变。

## 常见误区

- 「:term[电磁波]{id="physics.electromagnetism.em-wave"}的:term[强度]{id="physics.electromagnetism.intensity"}和:term[电场]{id="physics.electromagnetism.electric-field"}的振幅成正比。」和振幅的平方成正比。
- 「平面波里:term[磁场]{id="physics.electromagnetism.magnetic-field"}是电场的$\frac1c$，磁场的能量可以忽略。」磁场的:term[能量密度]{id="physics.electromagnetism.energy-density"}时时处处和电场的相等，各占一半。
- 「驻波里:term[坡印亭矢量]{id="physics.electromagnetism.poynting-vector"}平均为零，所以里面没有能量。」能量密度不为零，能量储存在驻波里，只是平均下来不流动。

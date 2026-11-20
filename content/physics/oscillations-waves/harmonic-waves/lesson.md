---
id: physics.oscillations-waves.harmonic-waves
title: |
  简谐波
goal: |
  会用波长、频率、波数和角频率描述简谐波，并写出它的复数形式。
prerequisites: [physics.oscillations-waves.wave-equation, physics.oscillations-waves.phasors]
minutes: 24
summary: |
  简谐波$A\cos(\omega t-kx+\varphi)$以$v=\frac\omega k=\lambda f$向右传播。
status: reviewed
---

## 这一节要回答的问题

让绷紧的长弦的一端不停地上下振动，一列整齐的波就沿弦传开。弦上每一点都在做同样的振动，只是步调一点点错开。怎样用几个数把这列波说清楚，这几个数之间有什么关系？振动能用复数来算，波能不能也这样算？

## 讲解

### 简谐波

::anchor{id="def-harmonic-wave"}
形如$y=A\cos(\omega t-kx+\varphi)$的波（$A$、$\omega$、$k$都是正的常数）叫作:term[简谐波]{id="physics.oscillations-waves.harmonic-wave"}（harmonic wave）；$k$叫作它的:term[波数]{id="physics.oscillations-waves.wave-number"}（wave number），$\lambda=\frac{2\pi}k$叫作它的:term[波长]{id="physics.oscillations-waves.wavelength"}（wavelength）。

为什么这样定义：固定$x$看，这一点在做:term[简谐运动]{id="physics.oscillations-waves.simple-harmonic-motion"}（simple harmonic motion），:term[振幅]{id="physics.oscillations-waves.amplitude"}（amplitude）是$A$，:term[角频率]{id="physics.oscillations-waves.angular-frequency"}（angular frequency）是$\omega$，每过$\frac{2\pi}\omega$重复一次；固定$t$看，波形是一条余弦曲线，每隔$\lambda$重复一次。$\omega t-kx+\varphi$是$x$处的点振动的:term[相位]{id="physics.oscillations-waves.phase"}（phase），它每单位时间增加$\omega$，沿弦每单位长度减少$k$，所以同一时刻相距$\Delta x$的两点相位差$k\Delta x=2\pi\frac{\Delta x}\lambda$；$\varphi$是$x=0$处的点的:term[初相]{id="physics.oscillations-waves.initial-phase"}（initial phase）。边界情况：相距一个波长的两点步调完全一致，相距半个波长的两点总是反向。

::anchor{id="thm-harmonic-wave"}
定理：简谐波$y=A\cos(\omega t-kx+\varphi)$满足:term[波动方程]{id="physics.oscillations-waves.wave-equation"}（wave equation）$y_{tt}=v^2y_{xx}$，当且仅当$\omega=vk$，也就是$\lambda f=v$，$f=\frac\omega{2\pi}$是:term[频率]{id="physics.oscillations-waves.frequency"}（frequency）；这时它是以:term[波速]{id="physics.oscillations-waves.wave-speed"}（wave speed）$v$沿$x$轴正方向传播的:term[行波]{id="physics.oscillations-waves.traveling-wave"}（traveling wave）。

证明思路：$y_{tt}=-\omega^2y$，$y_{xx}=-k^2y$，所以方程成立当且仅当$\omega^2=v^2k^2$；三个量都是正的，即$\omega=vk$，两边除以$2\pi$，再用$k=\frac{2\pi}\lambda$，就是$f=\frac v\lambda$。这时$\omega t-kx=-k(x-vt)$，$y$是$x-vt$的函数，由[弦的波动方程](lesson:physics.oscillations-waves.wave-equation#thm-traveling-wave)，波形以$v$向右平移。

$\lambda f=v$说的是：每过$\frac1f$，波形正好前进一个波长。$x$越大，相位越落后，前面的点重复着后面的点早先的动作，振动的状态就这样传了过去。把$-kx$换成$+kx$，$A\cos(\omega t+kx+\varphi)$就是向左传播的简谐波。电磁学里常写$\cos(kx-\omega t+\varphi')$，余弦是偶函数，它就是$\cos(\omega t-kx-\varphi')$，也向右传播，和这里的写法只差初相的符号。

### 横波和纵波

::anchor{id="def-transverse-longitudinal"}
介质里各点振动的方向和波传播的方向垂直的波叫作:term[横波]{id="physics.oscillations-waves.transverse-wave"}（transverse wave），平行的叫作:term[纵波]{id="physics.oscillations-waves.longitudinal-wave"}（longitudinal wave）。

为什么这样定义：两种波可以满足同样的方程，区别在振动的方向，以及介质靠哪种形变把各点拉回来。弦的横向振动靠张力拉回，是横波；[一维链与连续极限](lesson:physics.oscillations-waves.beaded-string)的动画里物块沿链的方向振动，这样的链上传的是纵波，空气里的:term[声波]{id="physics.oscillations-waves.sound-wave"}也是纵波。边界情况：水面波经过时，水的质点大致沿圆或椭圆运动，横向、纵向都在动，两种都不是。

### 复数形式

::anchor{id="thm-complex-wave"}
定理：:term[简谐波]{id="physics.oscillations-waves.harmonic-wave"}可以写成$y=\Re\bigl(\tilde Ae^{i(\omega t-kx)}\bigr)$，$\tilde A=Ae^{i\varphi}$是这列波的:term[复振幅]{id="physics.oscillations-waves.complex-amplitude"}（complex amplitude）；同一根弦上$\omega$、$k$都相同的两列简谐波之和仍是这样的简谐波，复振幅是两者的复振幅之和；对$t$求导就是乘$i\omega$，对$x$求导就是乘$-ik$。

证明思路：由欧拉公式（Euler's formula），$\Re\bigl(Ae^{i\varphi}e^{i(\omega t-kx)}\bigr)=A\cos(\omega t-kx+\varphi)$。记$\theta=\omega t-kx$，实部的和等于和的实部，$\Re(\tilde A_1e^{i\theta})+\Re(\tilde A_2e^{i\theta})=\Re\bigl((\tilde A_1+\tilde A_2)e^{i\theta}\bigr)$。求导时把另一个变量看成常数，和[复数表示与旋转矢量](lesson:physics.oscillations-waves.phasors#thm-phasor-derivative)里一样，$e^{i(\omega t-kx)}$对$t$求导乘$i\omega$，对$x$求导乘$-ik$。

固定$x$，$\tilde Ae^{-ikx}$就是这一点振动的复振幅。往前走$\Delta x$，它乘上$e^{-ik\Delta x}$，模不变，辐角（argument）减小$k\Delta x$，正是:term[相位]{id="physics.oscillations-waves.phase"}落后$k\Delta x$，和[复数表示与旋转矢量](lesson:physics.oscillations-waves.phasors#def-complex-amplitude)里「乘$e^{-i\delta}$表示落后$\delta$」一致。向左传播的简谐波写成$\Re\bigl(\tilde Ae^{i(\omega t+kx)}\bigr)$。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 4], y: [-1.5, 1.5] }
functions:
  - expr: "cos(2*pi*(s - x))"
    label: |
      $t$时刻的波形
  - expr: "cos(2*pi*x)"
    label: |
      $t=0$时的波形
points:
  - { x: "1", y: "cos(2*pi*(s - 1))" }
  - { x: "s", y: "1" }
sliders:
  - name: s
    min: 0
    max: 3
    step: 0.01
    default: 0.25
    label: |
      时间$t$（以周期为单位）
:::

横轴是位置$x$（以:term[波长]{id="physics.oscillations-waves.wavelength"}为单位），纵轴是位移$y$（以:term[振幅]{id="physics.oscillations-waves.amplitude"}为单位）。蓝线是$t$时刻的波形，橙线是$t=0$时的波形。拖动时间：固定在$x=1$处的圆点只在原地上下振动；另一个圆点跟着$t=0$时位于$x=0$的那个波峰，每过一个:term[周期]{id="physics.oscillations-waves.period"}（period）向右移动一个波长。

## 例题

### 例 1　从波的表达式读出各个量

弦上的波是$y=0.020\cos(40\pi t-0.50\pi x)$（国际单位制）。求它的:term[振幅]{id="physics.oscillations-waves.amplitude"}、:term[波长]{id="physics.oscillations-waves.wavelength"}、:term[频率]{id="physics.oscillations-waves.frequency"}和:term[波速]{id="physics.oscillations-waves.wave-speed"}，并说明它向哪边传播。

**为什么想到这么做**：和$A\cos(\omega t-kx+\varphi)$逐项对照，读出$A$、$\omega$、$k$，再用$\lambda=\frac{2\pi}k$、$f=\frac\omega{2\pi}$、$v=\lambda f$。

**推导**：$A=0.020\,\mathrm m$，$\omega=40\pi\,\mathrm{rad/s}$，$k=0.50\pi\,\mathrm{rad/m}$。$\lambda=\frac{2\pi}{0.50\pi}\,\mathrm m=4.0\,\mathrm m$，$f=\frac{40\pi}{2\pi}\,\mathrm{Hz}=20\,\mathrm{Hz}$，$v=\lambda f=80\,\mathrm{m/s}$。$t$和$x$前的符号相反，波沿$x$轴正方向传播。

### 例 2　两列同向的简谐波相加

同一根弦上有两列沿$x$轴正方向传播的:term[简谐波]{id="physics.oscillations-waves.harmonic-wave"}，$y_1=3\cos(\omega t-kx)$，$y_2=4\cos\bigl(\omega t-kx+\frac\pi2\bigr)$，单位是毫米。求合成的波的:term[振幅]{id="physics.oscillations-waves.amplitude"}和:term[初相]{id="physics.oscillations-waves.initial-phase"}。

**为什么想到这么做**：两列波的$\omega$、$k$相同，由定理，:term[复振幅]{id="physics.oscillations-waves.complex-amplitude"}直接相加，和同:term[频率]{id="physics.oscillations-waves.frequency"}的振动叠加一样。

**推导**：$\tilde A_1=3$，$\tilde A_2=4e^{i\pi/2}=4i$，$\tilde A=3+4i$，模是$5$，辐角是$\arctan\frac43\approx0.927$。合成的波是$y=5\cos(\omega t-kx+0.927)\,\mathrm{mm}$，仍是以同样的:term[波速]{id="physics.oscillations-waves.wave-speed"}向右传播的简谐波。

## 常见误区

- 「:term[波长]{id="physics.oscillations-waves.wavelength"}越长，波跑得越快。」同一根弦上，:term[波速]{id="physics.oscillations-waves.wave-speed"}只由张力和线密度（linear density）决定，波长长的:term[频率]{id="physics.oscillations-waves.frequency"}低，$\lambda f$不变。
- 「电磁学写的$\cos(kx-\omega t)$和$\cos(\omega t-kx)$方向相反。」两者相等，都向右传播；判断方向看$t$和$x$前的符号，相反向右，相同向左。
- 「$k$是每米里有几个波长。」$k=\frac{2\pi}\lambda$是每米里:term[相位]{id="physics.oscillations-waves.phase"}变化的弧度数，每米里的波长个数是$\frac1\lambda$；光谱学里也把$\frac1\lambda$叫作波数，用的时候要看清是哪一个。

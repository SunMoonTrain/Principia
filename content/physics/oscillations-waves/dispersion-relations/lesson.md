---
id: physics.oscillations-waves.dispersion-relations
title: |
  色散关系
goal: |
  会写出一维链等系统的色散关系$\omega(k)$，并判断波是否色散。
prerequisites: [physics.oscillations-waves.harmonic-waves]
minutes: 20
summary: |
  代入$e^{i(\omega t-kx)}$得到$\omega(k)$；$\omega$和$k$成正比时不色散。
status: reviewed
---

## 这一节要回答的问题

弦上不论长波短波，都以同一个速度前进，所以一个脉冲跑起来形状不变。换成一串小球，长波和短波还跑得一样快吗？怎样用一个式子说清楚，一个系统里能传哪些波、各以多快的速度传？

## 讲解

### 色散关系与相速度

::anchor{id="def-dispersion-relation"}
线性、均匀的系统里，形如$\Re\bigl(\tilde Ae^{i(\omega t-kx)}\bigr)$的波能够存在时$\omega$和$k$必须满足的关系，叫作这个系统的:term[色散关系]{id="physics.oscillations-waves.dispersion-relation"}（dispersion relation），常写成$\omega=\omega(k)$。

为什么这样定义：把$e^{i(\omega t-kx)}$代进线性的运动方程，对$t$求导变成乘$i\omega$，对$x$求导变成乘$-ik$（见[简谐波](lesson:physics.oscillations-waves.harmonic-waves#thm-complex-wave)），方程就化成$\omega$和$k$之间的一个代数关系。例如:term[波动方程]{id="physics.oscillations-waves.wave-equation"}（wave equation）给出$-\omega^2=-v^2k^2$，即$\omega=vk$。边界情况：系统不均匀时，比如弦的线密度（linear density）随位置变化，代进去以后系数随$x$变，$e^{-ikx}$消不掉，就没有这样的关系。

::anchor{id="def-phase-velocity"}
:term[简谐波]{id="physics.oscillations-waves.harmonic-wave"}（harmonic wave）的:term[相位]{id="physics.oscillations-waves.phase"}（phase）以$v_{\mathrm p}=\frac\omega k$前进，$v_{\mathrm p}$叫作:term[相速度]{id="physics.oscillations-waves.phase-velocity"}（phase velocity）；相速度随:term[波数]{id="physics.oscillations-waves.wave-number"}（wave number）变化时，就说这个系统有:term[色散]{id="physics.oscillations-waves.dispersion"}（dispersion），$\omega$和$k$成正比时没有色散。

为什么这样定义：相位不变的点满足$\omega t-kx=$常数，$\dv xt=\frac\omega k$，波峰就以这个速度移动。没有色散时，各种:term[波长]{id="physics.oscillations-waves.wavelength"}（wavelength）的简谐波同速前进，它们叠加成的波形整体平移、形状不变；有色散时，各个成分跑得不一样快，波形边走边变。名字来自光：棱镜把白光分成彩色，是因为玻璃里各种颜色的光相速度$\frac cn$不同，:term[折射率]{id="physics.optics.refractive-index"}（refractive index）随:term[频率]{id="physics.oscillations-waves.frequency"}（frequency）变化，和这里说的是同一件事。

### 一维链的色散关系

::anchor{id="thm-chain-dispersion"}
定理：质量为$m$的小球以间距$a$串在张力为$T$的绳上，组成无限长的:term[一维链]{id="physics.oscillations-waves.beaded-string"}（beaded string），它的:term[色散关系]{id="physics.oscillations-waves.dispersion-relation"}是$\omega=2\sqrt{\frac T{ma}}\,\bigl\lvert\sin\frac{ka}2\bigr\rvert$；$ka\ll1$时$\omega\approx vk$，$v=\sqrt{\frac T\mu}$，$\mu=\frac ma$。

证明思路：第$j$个小球在$x=ja$处，代入$y_j=\Re\bigl(\tilde Ae^{i(\omega t-kja)}\bigr)$。[一维链与连续极限](lesson:physics.oscillations-waves.beaded-string#thm-chain-equations)里的运动方程$m\ddot y_j=\frac Ta(y_{j+1}-2y_j+y_{j-1})$变成$-m\omega^2=\frac Ta\bigl(e^{-ika}-2+e^{ika}\bigr)=-\frac{4T}a\sin^2\frac{ka}2$，开方即得。$ka\ll1$时$\sin\frac{ka}2\approx\frac{ka}2$，$\omega\approx k\sqrt{\frac{Ta}m}=vk$。

链和弦的不同，都在这个式子里：
- :term[相速度]{id="physics.oscillations-waves.phase-velocity"}$v_{\mathrm p}=v\,\frac{\lvert\sin(ka/2)\rvert}{ka/2}$比$v$小，:term[波长]{id="physics.oscillations-waves.wavelength"}越短越慢，波长比间距大得多时才回到弦的$v$：链有:term[色散]{id="physics.oscillations-waves.dispersion"}。
- $\omega$最大是$2\sqrt{\frac T{ma}}$，在$ka=\pi$处，相邻小球反向；用更高的:term[频率]{id="physics.oscillations-waves.frequency"}去推链的一端，扰动传不出去，只在附近（p5）。
- $k$换成$k+\frac{2\pi}a$，每个$y_j$都不变，只要看$\lvert k\rvert\le\frac\pi a$：比$2a$更短的「波长」在链上没有新的意思。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 8], y: [0, 5] }
functions:
  - expr: "2/a*abs(sin(a*x/2))"
    label: |
      一维链的$\omega(k)$
  - expr: "x"
    label: |
      弦的$\omega=vk$
points:
  - { x: "pi/a", y: "2/a" }
sliders:
  - name: a
    min: 0.45
    max: 1.5
    step: 0.01
    default: 1
    label: |
      小球的间距$a$
:::

横轴是:term[波数]{id="physics.oscillations-waves.wave-number"}$k$，纵轴是:term[角频率]{id="physics.oscillations-waves.angular-frequency"}（angular frequency）$\omega$，取$T=\mu=1$，所以$v=1$。蓝线是:term[一维链]{id="physics.oscillations-waves.beaded-string"}的:term[色散关系]{id="physics.oscillations-waves.dispersion-relation"}，橙线是弦的$\omega=vk$，圆点是链能传的最高角频率，在$k=\frac\pi a$处。拖动间距：间距越小，蓝线贴着橙线的一段越长，圆点越高、越远；圆点右边蓝线往下走的部分，和左边是同样的运动。

## 例题

### 例 1　链上的短波跑得多慢

:term[一维链]{id="physics.oscillations-waves.beaded-string"}上:term[波长]{id="physics.oscillations-waves.wavelength"}为$4a$的:term[简谐波]{id="physics.oscillations-waves.harmonic-wave"}，:term[相速度]{id="physics.oscillations-waves.phase-velocity"}是长波极限$v$的多少倍？

**为什么想到这么做**：由:term[色散关系]{id="physics.oscillations-waves.dispersion-relation"}，$\frac{v_{\mathrm p}}v=\frac{\sin(ka/2)}{ka/2}$，只要算出$ka$。

**推导**：$k=\frac{2\pi}{4a}$，$\frac{ka}2=\frac\pi4$，$\frac{v_{\mathrm p}}v=\frac{\sin(\pi/4)}{\pi/4}=\frac{2\sqrt2}\pi\approx0.900$。每个波长里只有四个小球时，波就慢了一成。

### 例 2　弹性基底上的弦

弦贴在一层弹性基底上，每单位长度还受:term[回复力]{id="physics.oscillations-waves.restoring-force"}（restoring force）$-\kappa y$，运动方程是$\mu y_{tt}=Ty_{xx}-\kappa y$。求:term[色散关系]{id="physics.oscillations-waves.dispersion-relation"}和:term[相速度]{id="physics.oscillations-waves.phase-velocity"}。:term[频率]{id="physics.oscillations-waves.frequency"}很低时会怎样？

**为什么想到这么做**：方程线性、均匀，代入$e^{i(\omega t-kx)}$，求导换成乘$i\omega$、$-ik$。

**推导**：$-\mu\omega^2=-Tk^2-\kappa$，即$\omega^2=v^2k^2+\omega_{\mathrm c}^2$，$\omega_{\mathrm c}=\sqrt{\frac\kappa\mu}$。相速度$v_{\mathrm p}=\sqrt{v^2+\frac{\omega_{\mathrm c}^2}{k^2}}$比$v$大，随$k$变化，有:term[色散]{id="physics.oscillations-waves.dispersion"}。$\omega<\omega_{\mathrm c}$时$k^2<0$，没有实数的$k$，这样的频率传不出去。

## 常见误区

- 「:term[相速度]{id="physics.oscillations-waves.phase-velocity"}就是能量和信号传播的速度。」有:term[色散]{id="physics.oscillations-waves.dispersion"}时，一群波（波包）前进的速度和波峰的速度不同，信号跟着波包走（见[波包与群速度](lesson:physics.oscillations-waves.group-velocity)）。
- 「:term[一维链]{id="physics.oscillations-waves.beaded-string"}上，多短的波都能传。」:term[波长]{id="physics.oscillations-waves.wavelength"}最短到$2a$，更短的和某个较长的波是同一种运动；:term[角频率]{id="physics.oscillations-waves.angular-frequency"}也有上限$2\sqrt{\frac T{ma}}$。
- 「有色散，波就会越走越弱。」单一:term[频率]{id="physics.oscillations-waves.frequency"}的:term[简谐波]{id="physics.oscillations-waves.harmonic-wave"}不会变弱；脉冲里各个频率跑得不一样快，脉冲会摊开、峰值变低，可总能量不变。能量损失要靠阻尼，链和弹性基底上的弦都没有阻尼。

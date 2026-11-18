---
id: physics.oscillations-waves.standing-waves
title: |
  驻波
goal: |
  会把驻波看成两列反向行波的叠加，并求两端固定的弦的固有频率和波节的位置。
prerequisites: [physics.oscillations-waves.reflection-transmission]
minutes: 21
summary: |
  两列反向的简谐波叠成驻波；两端固定的弦$f_n=\frac{nv}{2\ell}$，相邻波节相距$\frac\lambda2$。
status: reviewed
---

## 这一节要回答的问题

拨一下吉他弦，弦上的波形并不跑开，只是在原地上下起伏，有几个点始终不动。这样的波是怎么来的？一根两端固定的弦，振动时能发出哪些音？

## 讲解

### 驻波

::anchor{id="def-standing-wave"}
两列:term[振幅]{id="physics.oscillations-waves.amplitude"}（amplitude）、:term[频率]{id="physics.oscillations-waves.frequency"}（frequency）都相同，沿相反方向传播的:term[简谐波]{id="physics.oscillations-waves.harmonic-wave"}（harmonic wave）叠加成的波，叫作:term[驻波]{id="physics.oscillations-waves.standing-wave"}（standing wave）；驻波里始终不动的点叫作:term[波节]{id="physics.oscillations-waves.node"}（node），振幅最大的点叫作:term[波腹]{id="physics.oscillations-waves.antinode"}（antinode）。

为什么这样定义：两列波各自跑着，加起来却不跑，$A\cos(\omega t-kx)+A\cos(\omega t+kx)=2A\cos kx\cos\omega t$，每一点都以同一个:term[角频率]{id="physics.oscillations-waves.angular-frequency"}（angular frequency）振动，振幅$2A\lvert\cos kx\rvert$随位置变化，波形只在原地伸缩、不平移。[弦的波动方程](lesson:physics.oscillations-waves.wave-equation#def-traveling-wave)里说的$\sin kx\cos kvt$就是这样的波。边界情况：两列波的振幅不相等时，叠加的结果是一列驻波加一列:term[行波]{id="physics.oscillations-waves.traveling-wave"}（traveling wave），没有始终不动的点。

::anchor{id="thm-standing-wave"}
定理：驻波$2A\cos kx\cos\omega t$的波节在$\cos kx=0$处，波腹在$\lvert\cos kx\rvert=1$处；相邻两个波节（或两个波腹）相距$\frac\lambda2$，波节和相邻的波腹相距$\frac\lambda4$；相邻两个波节之间的各点同相振动，一个波节两侧的点反相振动。

证明思路：$\cos kx=0$即$kx=\frac\pi2+m\pi$，相邻两个相差$\frac\pi k=\frac\lambda2$；$\lvert\cos kx\rvert=1$即$kx=m\pi$，和波节错开$\frac\lambda4$。两个相邻波节之间$\cos kx$的符号不变，各点同相；经过一个波节，$\cos kx$变号，振动反相。

### 两端固定的弦

弦的一端固定时，射来的波反射回来倒过来（$r=-1$，见[波的反射与透射](lesson:physics.oscillations-waves.reflection-transmission#thm-reflection)），和入射波叠成:term[驻波]{id="physics.oscillations-waves.standing-wave"}，固定端是:term[波节]{id="physics.oscillations-waves.node"}：固定端在$x=0$处时，$A\cos(\omega t-kx)-A\cos(\omega t+kx)=2A\sin kx\sin\omega t$。

::anchor{id="thm-string-modes"}
定理：长为$\ell$、两端固定的弦上的驻波只能是$y=B\sin\frac{n\pi x}\ell\cos(\omega_nt+\varphi)$（$n=1,2,3,\dots$），:term[波长]{id="physics.oscillations-waves.wavelength"}（wavelength）$\lambda_n=\frac{2\ell}n$，:term[频率]{id="physics.oscillations-waves.frequency"}$f_n=\frac{\omega_n}{2\pi}=\frac{nv}{2\ell}$，$v=\sqrt{T/\mu}$是:term[波速]{id="physics.oscillations-waves.wave-speed"}（wave speed）。

证明思路：$x=0$处是波节，驻波写成$B\sin kx\cos(\omega t+\varphi)$；$x=\ell$处也要是波节，$\sin k\ell=0$，$k=\frac{n\pi}\ell$，$\lambda=\frac{2\pi}k=\frac{2\ell}n$。由[简谐波](lesson:physics.oscillations-waves.harmonic-waves#thm-harmonic-wave)，$\omega=vk$，所以$f_n=\frac{nv}{2\ell}$。

::anchor{id="def-harmonics"}
两端固定的弦的这些频率$f_n$叫作它的:term[固有频率]{id="physics.oscillations-waves.natural-frequency"}（natural frequency）；最低的$f_1=\frac v{2\ell}$叫作:term[基频]{id="physics.oscillations-waves.fundamental-frequency"}（fundamental frequency），$f_n=nf_1$叫作第$n$次:term[谐波]{id="physics.oscillations-waves.harmonic"}（harmonic）。

为什么这样定义：弦被拨动以后自由振动，只能以这些频率振动，它们由弦本身的长度、张力、线密度（linear density）决定，所以叫固有频率；它们恰好是基频的整数倍。弦的每一种驻波就是它的一个:term[简正模]{id="physics.oscillations-waves.normal-mode"}（normal mode），$2\pi f_n=\frac{n\pi v}\ell$正是[一维链与连续极限](lesson:physics.oscillations-waves.beaded-string#thm-continuum-limit)里连续弦的:term[简正频率]{id="physics.oscillations-waves.normal-frequency"}（normal frequency）；单个振子只有一个:term[固有角频率]{id="physics.oscillations-waves.natural-angular-frequency"}（natural angular frequency），弦却有无穷多个固有频率。边界情况：弦的一端改成能沿光滑竖杆自由滑动的轻环，那一端成了:term[波腹]{id="physics.oscillations-waves.antinode"}，固有频率只有$\frac v{4\ell}$的奇数倍（p5）。

$\sin\frac{n\pi x}\ell$满足$-y''=k_n^2y$、两端为零，$k_n^2=\bigl(\frac{n\pi}\ell\bigr)^2$；变分法里把这个$k^2$记作$\lambda$，基频由最小的那个决定（见[瑞利商与特征值的变分刻画](lesson:math.calculus-of-variations.rayleigh-quotient)）。本节的$\lambda$只表示波长。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 2], y: [-1.2, 1.2] }
functions:
  - expr: "0.5*cos(2*pi*(s - x))"
    label: |
      向右的波
  - expr: "0.5*cos(2*pi*(s + x))"
    label: |
      向左的波
  - expr: "cos(2*pi*x)*cos(2*pi*s)"
    label: |
      两者之和
points:
  - { x: "0.25", y: "0" }
  - { x: "0.75", y: "0" }
  - { x: "1.25", y: "0" }
  - { x: "1.75", y: "0" }
sliders:
  - name: s
    min: 0
    max: 2
    step: 0.01
    default: 0.1
    label: |
      时间$t$（以周期为单位）
:::

横轴是位置$x$（以:term[波长]{id="physics.oscillations-waves.wavelength"}为单位）。蓝线、橙线是两列:term[振幅]{id="physics.oscillations-waves.amplitude"}相同、反向传播的波，绿线是它们的和。拖动时间：蓝线、橙线分别向右、向左平移，绿线却不平移，只在原地伸缩；四个圆点是:term[波节]{id="physics.oscillations-waves.node"}，绿线始终从那里经过，相邻两个相距半个波长。

## 例题

### 例 1　吉他弦的固有频率

吉他弦长$0.65\,\mathrm m$，两端固定，线密度$5.0\,\mathrm{g/m}$，张力$80\,\mathrm N$。求它的:term[基频]{id="physics.oscillations-waves.fundamental-frequency"}和第 2、3 次:term[谐波]{id="physics.oscillations-waves.harmonic"}的:term[频率]{id="physics.oscillations-waves.frequency"}。

**为什么想到这么做**：先求:term[波速]{id="physics.oscillations-waves.wave-speed"}$v=\sqrt{T/\mu}$，再用$f_n=\frac{nv}{2\ell}$。

**推导**：$v=\sqrt{\frac{80}{5.0\times10^{-3}}}\,\mathrm{m/s}\approx126\,\mathrm{m/s}$，$f_1=\frac v{2\ell}\approx\frac{126}{1.30}\,\mathrm{Hz}\approx97\,\mathrm{Hz}$，$f_2\approx195\,\mathrm{Hz}$，$f_3\approx292\,\mathrm{Hz}$。弦拧紧，$v$变大，各个频率一起升高，比值仍是$1:2:3$。

### 例 2　轻按弦长的三分之一处

拨弦的同时，用手指在离一端$\frac\ell3$处轻轻碰住弦（不把弦按到底），这一点就不能振动。弦上还剩下哪些:term[谐波]{id="physics.oscillations-waves.harmonic"}？

**为什么想到这么做**：被碰住的点必须是:term[波节]{id="physics.oscillations-waves.node"}，看哪些$\sin\frac{n\pi x}\ell$在$x=\frac\ell3$处为零。

**推导**：$\sin\frac{n\pi}3=0$要求$n$是$3$的倍数，剩下第 3、6、9……次谐波，最低的是$3f_1$。吉他手轻触弦上的特定位置弹出清亮的高音，就是这个道理。

## 常见误区

- 「:term[驻波]{id="physics.oscillations-waves.standing-wave"}里各点的振动步调都一样。」相邻两个:term[波节]{id="physics.oscillations-waves.node"}之间的点同相，一个波节两侧的点反相。
- 「两端固定的弦，:term[波长]{id="physics.oscillations-waves.wavelength"}可以是任意的，只是有的听不到。」能存在的驻波只有$\lambda_n=\frac{2\ell}n$这些，别的波长两端不能同时是波节。
- 「按住弦的中点，:term[频率]{id="physics.oscillations-waves.frequency"}变为原来的一半。」按住中点，每一半是长$\frac\ell2$的弦，:term[基频]{id="physics.oscillations-waves.fundamental-frequency"}变为原来的 2 倍，正是原来的第 2 次:term[谐波]{id="physics.oscillations-waves.harmonic"}。

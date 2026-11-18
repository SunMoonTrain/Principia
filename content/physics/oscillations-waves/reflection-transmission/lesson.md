---
id: physics.oscillations-waves.reflection-transmission
title: |
  波的反射与透射
goal: |
  会引入阻抗，并用边界条件求波在两根弦的连接处的反射系数和透射系数。
prerequisites: [physics.oscillations-waves.harmonic-waves]
minutes: 28
summary: |
  阻抗$Z=\sqrt{T\mu}$决定连接处的反射和透射：$r=\frac{Z_1-Z_2}{Z_1+Z_2}$，$\tau=\frac{2Z_1}{Z_1+Z_2}$。
status: reviewed
---

## 这一节要回答的问题

一根细弦接着一根粗弦，一个脉冲沿细弦跑到接头处，会怎样？一部分透过去、一部分弹回来，各占多少由什么决定？弹回来的脉冲是正着的，还是倒过来的？

## 讲解

### 连接处的条件

两根弦在$x=0$处用一个质量不计的结连起来，张力都是$T$；左边的弦 1 线密度（linear density）为$\mu_1$，:term[波速]{id="physics.oscillations-waves.wave-speed"}（wave speed）$v_1=\sqrt{T/\mu_1}$，右边的弦 2 线密度为$\mu_2$，波速为$v_2$。

::anchor{id="thm-junction"}
定理：斜率很小时，连接处两边弦的位移相等，斜率也相等：$y_1(0,t)=y_2(0,t)$，$\pdv{y_1}x(0,t)=\pdv{y_2}x(0,t)$。

证明思路：弦是连着的，结两边的位移相同。结受左右两段弦的拉力，横向分量分别是$-T\pdv{y_1}x$和$T\pdv{y_2}x$，和[弦的波动方程](lesson:physics.oscillations-waves.wave-equation#thm-string-equation)里一小段弦受的力一样；结的质量为零，由牛顿第二定律（Newton's second law），两者之和必须为零，否则结的加速度无限大。

::anchor{id="def-impedance"}
张力为$T$、线密度为$\mu$的弦，$Z=\sqrt{T\mu}$叫作它的:term[阻抗]{id="physics.oscillations-waves.impedance"}（impedance）。

为什么这样定义：对向右的:term[行波]{id="physics.oscillations-waves.traveling-wave"}（traveling wave）$y=f(x-vt)$，$y_x=f'$，$y_t=-vf'$，左边的弦对右边的弦的横向拉力$-Ty_x=\frac Tvy_t=Zy_t$。所以阻抗说的是「要让弦上的点以单位速度横向运动，得用多大的横向力」，它也等于$\mu v$或$\frac Tv$；张力相同时，弦越重，波速越小，阻抗越大。边界情况：对向左的行波$g(x+vt)$，$-Ty_x=-Zy_t$，力和速度反号。

### 反射系数和透射系数

::anchor{id="def-coefficients"}
波从弦 1 射到连接处，反射波、透射波在连接处的位移和入射波在那里的位移之比，分别叫作:term[反射系数]{id="physics.oscillations-waves.reflection-coefficient"}（reflection coefficient）$r$和:term[透射系数]{id="physics.oscillations-waves.transmission-coefficient"}（transmission coefficient）$\tau$。

为什么这样定义：下面的定理说明，这两个比值不随时间变，也和入射波的形状无关，只由两根弦决定，两个数就说清了连接处的作用。透射系数写成$\tau$，免得和时间$t$混淆，电磁学里写作$t$。边界情况：$r<0$表示反射回来的波是倒过来的。

::anchor{id="thm-reflection"}
定理：张力相同的两根弦连在一起，从弦 1 射来的任意形状的波在连接处分成反射波和透射波，$r=\frac{Z_1-Z_2}{Z_1+Z_2}$，$\tau=\frac{2Z_1}{Z_1+Z_2}$；入射波是:term[简谐波]{id="physics.oscillations-waves.harmonic-wave"}（harmonic wave）时，透射波的:term[频率]{id="physics.oscillations-waves.frequency"}（frequency）不变，:term[波长]{id="physics.oscillations-waves.wavelength"}（wavelength）变为原来的$\frac{v_2}{v_1}$倍。

证明思路：入射波$f(x-v_1t)$、反射波$g(x+v_1t)$、透射波$h(x-v_2t)$在$x=0$处引起的位移记作$F(t)$、$G(t)$、$H(t)$。位移相等给出$F+G=H$。向右的波$y_x=-\frac{y_t}v$，向左的波$y_x=\frac{y_t}v$，所以斜率相等给出$\frac{-F'+G'}{v_1}=-\frac{H'}{v_2}$；乘$T$再积分，波到来之前三者都为零，得$Z_1(F-G)=Z_2H$。和$F+G=H$联立，$G=\frac{Z_1-Z_2}{Z_1+Z_2}F$，$H=\frac{2Z_1}{Z_1+Z_2}F$；连接处两边以同一个频率振动，波长$\lambda=\frac vf$随:term[波速]{id="physics.oscillations-waves.wave-speed"}变。

几个特殊情形：
- $Z_1=Z_2$时$r=0$，波全部透过去，一点也不反射。
- 弦的末端固定，相当于$Z_2\to\infty$：$r=-1$，波倒过来弹回，末端始终不动。
- 末端系一个能沿光滑竖杆自由上下滑动的轻环，相当于$Z_2\to0$：$r=1$，波正着弹回，末端的位移是入射波的 2 倍。
- 从轻弦射向重弦（$Z_1<Z_2$），$-1<r<0$，反射波倒过来；从重弦射向轻弦，$0<r<1$，不倒，而$\tau>1$。

光的反射也是这样：张力相同时弦的:term[阻抗]{id="physics.oscillations-waves.impedance"}和波速成反比，光的:term[折射率]{id="physics.optics.refractive-index"}（refractive index）也和波速成反比，所以光垂直入射、从折射率小的介质射向折射率大的介质时，反射光的电场倒过来，电场的反射系数$\frac{n_1-n_2}{n_1+n_2}$和这里的$r$形式相同（见[界面上的反射与折射：菲涅耳公式](lesson:physics.electromagnetism.fresnel-equations)）。电磁学的波阻抗（wave impedance）$\frac EH$却和波速成正比，用它写，这个反射系数是$\frac{Z_2-Z_1}{Z_2+Z_1}$，正负号的排法和弦相反，所以不能把弦的阻抗说成电磁学的波阻抗。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-8, 8], y: [-1, 1.7] }
functions:
  - expr: "exp(-(x - s + 4)^2) + (1 - z)/(1 + z)*exp(-(x + s - 4)^2) + 0*sqrt(-x)"
    label: |
      弦 1 的位移（入射波加反射波）
  - expr: "2/(1 + z)*exp(-(z*x - s + 4)^2) + 0*sqrt(x)"
    label: |
      弦 2 的位移（透射波）
sliders:
  - name: s
    min: 0
    max: 10
    step: 0.05
    default: 6
    label: |
      时间$t$（以脉冲在弦 1 上走过单位长度的时间为单位）
  - name: z
    min: 0.25
    max: 4
    step: 0.05
    default: 3
    label: |
      阻抗之比$Z_2/Z_1$
:::

横轴是位置$x$，连接处在$x=0$，左边是弦 1，右边是弦 2，两根弦张力相同，$v_2=v_1\frac{Z_1}{Z_2}$。蓝线是弦 1 的位移，开始时只有向右跑的入射脉冲；橙线是弦 2 的位移。拖动时间：脉冲到达连接处以后分成两个；$Z_2>Z_1$时反射回来的脉冲倒过来，透射的脉冲变窄、变慢，$Z_2<Z_1$时反射的不倒，透射的变宽、比入射的还高。

## 例题

### 例 1　轻弦接重弦

两根张力相同的弦，$\mu_2=4\mu_1$。:term[简谐波]{id="physics.oscillations-waves.harmonic-wave"}从弦 1 射向弦 2，求:term[反射系数]{id="physics.oscillations-waves.reflection-coefficient"}、:term[透射系数]{id="physics.oscillations-waves.transmission-coefficient"}，以及弦 2 上的:term[波长]{id="physics.oscillations-waves.wavelength"}是弦 1 上的多少倍。

**为什么想到这么做**：张力相同，:term[阻抗]{id="physics.oscillations-waves.impedance"}和$\sqrt\mu$成正比，:term[波速]{id="physics.oscillations-waves.wave-speed"}和$\frac1{\sqrt\mu}$成正比，代入定理。

**推导**：$\frac{Z_2}{Z_1}=\sqrt{\frac{\mu_2}{\mu_1}}=2$，$r=\frac{1-2}{1+2}=-\frac13$，$\tau=\frac2{1+2}=\frac23$。反射波倒过来，:term[振幅]{id="physics.oscillations-waves.amplitude"}（amplitude）是入射波的三分之一；$\frac{v_2}{v_1}=\frac12$，弦 2 上的波长是弦 1 上的一半。

### 例 2　末端固定和末端自由

一个向右跑的脉冲到达弦的末端。末端固定时和末端是能自由上下滑动的轻环时，弹回来的脉冲各是什么样子？脉冲正在末端时，末端的位移各是多少？

**为什么想到这么做**：两种末端分别相当于另一根弦的:term[阻抗]{id="physics.oscillations-waves.impedance"}无穷大和为零，末端的位移是入射波和反射波在那里的位移之和$F+G=(1+r)F$。

**推导**：固定端$r=-1$，脉冲倒过来弹回，末端的位移$(1-1)F=0$，正是「固定」的意思。自由端$r=1$，脉冲正着弹回，末端的位移是$2F$：脉冲到达自由端时，末端甩起的高度是脉冲高度的 2 倍。

## 常见误区

- 「反射回来的波总是倒过来的。」只有射向:term[阻抗]{id="physics.oscillations-waves.impedance"}更大的弦（包括固定端）时才倒过来，射向阻抗更小的弦或自由端时不倒。
- 「透射波的:term[振幅]{id="physics.oscillations-waves.amplitude"}不可能比入射波大，否则能量就多出来了。」从重弦射向轻弦时$\tau>1$；轻弦上同样振幅的波带的能量少，能量并不多出来（见[波的能量与能流](lesson:physics.oscillations-waves.wave-energy)）。
- 「波进入另一根弦，:term[频率]{id="physics.oscillations-waves.frequency"}也跟着变。」连接处两边的位移时时相同，振动步调一致，频率不变，变的是:term[波长]{id="physics.oscillations-waves.wavelength"}。

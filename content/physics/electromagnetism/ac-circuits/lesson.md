---
id: physics.electromagnetism.ac-circuits
title: |
  交流电路与阻抗
goal: |
  会用复阻抗分析 RLC 交流电路，并求谐振频率和平均功率。
prerequisites: [physics.electromagnetism.rl-circuits, physics.oscillations-waves.driven-oscillations]
minutes: 40
summary: |
  交流电路里电感、电容化成复阻抗；串联电路共振时阻抗最小。
status: reviewed
---

## 这一节要回答的问题

家用电源的:term[电动势]{id="physics.electromagnetism.electromotive-force"}（electromotive force）每秒往返变向一百次，频率是$50\,\mathrm{Hz}$；:term[电容器]{id="physics.electromagnetism.capacitor"}（capacitor）隔断直流，接在这样的电源上，电路里却有:term[电流]{id="physics.electromagnetism.electric-current"}（electric current）。电源按正弦规律变化时，含:term[电阻]{id="physics.electromagnetism.resistance"}（resistance）、线圈和电容器的电路里电流有多大？为什么收音机转动一下旋钮，就能从许多电台里选中一个？

## 讲解

### 交流电和有效值

::anchor{id="def-ac"}
:term[电动势]{id="physics.electromagnetism.electromotive-force"}和:term[电流]{id="physics.electromagnetism.electric-current"}按正弦规律随时间变化的电路叫作交流电路（alternating-current circuit），这样的电流叫作:term[交流电]{id="physics.electromagnetism.alternating-current"}（alternating current）；转动的线圈给出的:term[感应电动势]{id="physics.electromagnetism.induced-emf"}（induced electromotive force）正是这样（见[法拉第电磁感应定律](lesson:physics.electromagnetism.faraday-law#thm-generator)）。

为什么这样定义：正弦是最简单的周期变化，交流发电机直接给出它；更重要的是，任何周期的变化都能分解成许多正弦变化之和，搞清了正弦的情形，别的情形可以叠加出来。边界情况：频率为零的交流电就是直流电。

::anchor{id="def-rms"}
交流电$I_0\cos(\omega t-\theta)$通过:term[电阻]{id="physics.electromagnetism.resistance"}$R$，一个周期里的平均功率等于多大的:term[恒定电流]{id="physics.electromagnetism.steady-current"}（steady current）通过同一个电阻时的功率，这个恒定电流的大小就叫作交流电的有效值（root-mean-square value）$I_{\mathrm{rms}}$；正弦交流电的有效值是$I_{\mathrm{rms}}=\frac{I_0}{\sqrt2}$，:term[电势差]{id="physics.electromagnetism.potential-difference"}（potential difference）的有效值同样是峰值的$\frac{1}{\sqrt2}$。

为什么这样定义：电阻发热只看电流的平方，$\cos^2$在一个周期里的平均是$\frac12$，平均功率是$\frac12I_0^2R=I_{\mathrm{rms}}^2R$；用有效值，交流电的功率公式和直流电一样。我国家用电源的电动势有效值是$220\,\mathrm V$。边界情况：波形不是正弦时，有效值和峰值的比例不同，例如方波的有效值就等于峰值。

### 复数表示和阻抗

线性的电路接上正弦电源，过了开头几个:term[时间常数]{id="physics.electromagnetism.time-constant"}（time constant）的暂态（transient）以后，各处的:term[电流]{id="physics.electromagnetism.electric-current"}、:term[电势差]{id="physics.electromagnetism.potential-difference"}都按电源的角频率$\omega$做正弦变化，只是振幅和相位各不相同，和受迫振动（driven oscillation）的稳态（steady state）一样。用复数表示（见[复数表示与旋转矢量](lesson:physics.oscillations-waves.phasors)）：电流$I(t)=\operatorname{Re}\bigl(\tilde Ie^{i\omega t}\bigr)$，复振幅（complex amplitude）$\tilde I$的模是振幅、辐角是初相位，对时间求导就是乘以$i\omega$。

元件两端的电势差$V$取电流流入的一端减去流出的一端，它和电流的关系：:term[电阻]{id="physics.electromagnetism.resistance"}上$V=IR$；线圈上$V=L\dv It$（见[RL 电路](lesson:physics.electromagnetism.rl-circuits)）；:term[电容器]{id="physics.electromagnetism.capacitor"}上$I=C\dv Vt$。换成复数，分别是$\tilde V=R\tilde I$、$\tilde V=i\omega L\tilde I$、$\tilde V=\frac{\tilde I}{i\omega C}$。

::anchor{id="def-impedance"}
元件两端电势差的复振幅和电流的复振幅之比$Z=\frac{\tilde V}{\tilde I}$叫作这个元件的阻抗（impedance），单位是欧姆：电阻的阻抗是$R$，线圈的是$i\omega L$，电容器的是$\frac{1}{i\omega C}$；$\omega L$和$\frac{1}{\omega C}$分别叫作感抗（inductive reactance）和容抗（capacitive reactance）。

为什么这样定义：有了阻抗，交流电路就能像直流电路一样算：:term[基尔霍夫定律]{id="physics.electromagnetism.kirchhoff-laws"}（Kirchhoff's circuit laws）对复振幅照样成立，因为每一项都乘着同一个$e^{i\omega t}$；串联的阻抗相加，并联的阻抗倒数相加。$|Z|$是电势差和电流的振幅之比，$\arg Z$是电势差比电流超前的相位：线圈上电势差超前电流$90^\circ$，电容器上落后$90^\circ$。边界情况：$\omega\to0$（直流）时线圈的阻抗为零、电容器的阻抗是无穷大，所以电容器隔断直流；$\omega$很大时反过来，线圈几乎不让电流通过。

### RLC 串联电路和共振

::anchor{id="thm-rlc-series"}
定理（RLC 串联电路）：:term[电动势]{id="physics.electromagnetism.electromotive-force"}为$\mathcal E_0\cos\omega t$的电源和:term[电阻]{id="physics.electromagnetism.resistance"}$R$、:term[自感]{id="physics.electromagnetism.self-inductance"}（self-inductance）为$L$的线圈、:term[电容]{id="physics.electromagnetism.capacitance"}（capacitance）为$C$的:term[电容器]{id="physics.electromagnetism.capacitor"}串联，稳态时电路里的:term[电流]{id="physics.electromagnetism.electric-current"}是$I_0\cos(\omega t-\theta)$，$I_0=\frac{\mathcal E_0}{|Z|}$，$|Z|=\sqrt{R^2+\bigl(\omega L-\frac{1}{\omega C}\bigr)^2}$，$\tan\theta=\frac{\omega L-1/(\omega C)}{R}$，$\theta$是电流落后于电动势的相位。

证明思路：串联的总阻抗$Z=R+i\omega L+\frac{1}{i\omega C}=R+i\Bigl(\omega L-\frac{1}{\omega C}\Bigr)$。由$\tilde I=\frac{\mathcal E_0}{Z}=\frac{\mathcal E_0}{|Z|}e^{-i\theta}$，$\theta=\arg Z$，取实部即得。

这一节里:term[电荷]{id="physics.electromagnetism.electric-charge"}（electric charge）写作$q$，$Q$留给品质因数（quality factor）。回路定律给出$L\dv{^2q}{t^2}+R\dv qt+\frac qC=\mathcal E_0\cos\omega t$，和受迫的阻尼振子的方程形式一样：$L$对应质量，$R$对应阻尼系数，$\frac1C$对应劲度系数，$q$对应位移，电动势对应驱动力（见[受迫振动与共振](lesson:physics.oscillations-waves.driven-oscillations)）。没有电源和电阻时，$q$以角频率$\frac{1}{\sqrt{LC}}$振荡，正是[自感、互感与磁场的能量](lesson:physics.electromagnetism.inductance)一节说的:term[电场]{id="physics.electromagnetism.electric-field"}（electric field）和:term[磁场]{id="physics.electromagnetism.magnetic-field"}（magnetic field）的能量来回交换。

::anchor{id="thm-resonance"}
定理（串联电路的共振（resonance））：$\omega_0=\frac{1}{\sqrt{LC}}$时$\omega L=\frac{1}{\omega C}$，$|Z|=R$最小，电流振幅最大，是$\frac{\mathcal E_0}{R}$，电流和电动势同相；电流振幅降到最大值的$\frac{1}{\sqrt2}$的两个角频率之差是$\Delta\omega=\frac RL$，品质因数$Q=\frac{\omega_0L}{R}=\frac{\omega_0}{\Delta\omega}$。

证明思路：$|Z|$里只有括号那一项随$\omega$变，它为零时$|Z|$最小。电流振幅是最大值的$\frac{1}{\sqrt2}$，即$|Z|=\sqrt2R$，即$\omega L-\frac{1}{\omega C}=\pm R$；两个方程的正根分别是$\omega_\pm=\pm\frac{R}{2L}+\sqrt{\frac{R^2}{4L^2}+\frac{1}{LC}}$，相减得$\frac RL$。

共振时线圈和电容器两端的:term[电势差]{id="physics.electromagnetism.potential-difference"}振幅都是$\omega_0L\cdot\frac{\mathcal E_0}{R}=Q\mathcal E_0$，可以比电源的电动势大得多；两者方向相反，加起来是零。收音机的调谐（tuning）就是改变电容，让电路的$\omega_0$对准一个电台的频率，$Q$越大，共振峰越窄，相邻的电台越不容易串进来（例 2）。

### 平均功率

::anchor{id="thm-ac-power"}
定理（交流电路的平均功率）：元件两端的:term[电势差]{id="physics.electromagnetism.potential-difference"}是$V_0\cos\omega t$、:term[电流]{id="physics.electromagnetism.electric-current"}是$I_0\cos(\omega t-\theta)$时，一个周期里的平均功率是$\bar P=\frac12V_0I_0\cos\theta=V_{\mathrm{rms}}I_{\mathrm{rms}}\cos\theta$；$\cos\theta$叫作功率因数（power factor）。

证明思路：功率是$V_0I_0\cos\omega t\cos(\omega t-\theta)$，积化和差，等于$\frac12V_0I_0\bigl[\cos\theta+\cos(2\omega t-\theta)\bigr]$，第二项在一个周期里平均为零。

理想的线圈和:term[电容器]{id="physics.electromagnetism.capacitor"}$\theta=\pm90^\circ$，平均功率是零：它们在半个周期里从电源吸收能量、存进:term[磁场]{id="physics.electromagnetism.magnetic-field"}或:term[电场]{id="physics.electromagnetism.electric-field"}，另半个周期又还回去。所以电路的平均功率全部消耗在:term[电阻]{id="physics.electromagnetism.resistance"}上；功率因数小，同样的平均功率要更大的电流，输电线上的损耗也更大。

### 变压器

::anchor{id="def-transformer"}
两个线圈绕在同一个闭合铁芯上，接电源的一个叫作原线圈（primary coil），接用电器的一个叫作副线圈（secondary coil），这样的装置叫作:term[变压器]{id="physics.electromagnetism.transformer"}（transformer）。

为什么这样定义：原线圈里的:term[交流电]{id="physics.electromagnetism.alternating-current"}在铁芯里产生交变的:term[磁通量]{id="physics.electromagnetism.magnetic-flux"}（magnetic flux），它穿过副线圈，在那里感应出:term[电动势]{id="physics.electromagnetism.electromotive-force"}，靠的是两个线圈之间的:term[互感]{id="physics.electromagnetism.mutual-inductance"}（mutual inductance）；铁芯的:term[相对磁导率]{id="physics.electromagnetism.relative-permeability"}（relative permeability）很大，又是闭合的，:term[磁场线]{id="physics.electromagnetism.magnetic-field-line"}（magnetic field line）几乎全部关在铁芯里，两个线圈的每一匝都穿过同样的磁通量。边界情况：没有铁芯时，原线圈的磁通量只有一部分穿过副线圈，两个线圈两端的:term[电势差]{id="physics.electromagnetism.potential-difference"}之比就不只由匝数决定了。

::anchor{id="thm-transformer"}
定理（理想变压器）：原线圈、副线圈的匝数分别是$N_1$、$N_2$，铁芯里的磁通量全部穿过两个线圈，线圈的:term[电阻]{id="physics.electromagnetism.resistance"}和铁芯的损耗都不计，铁芯的相对磁导率又极大，副线圈不接用电器时原线圈里的:term[电流]{id="physics.electromagnetism.electric-current"}（空载电流，no-load current）可以不计。那么两个线圈两端的电势差之比是$\frac{V_2}{V_1}=\frac{N_2}{N_1}$，电流之比是$\frac{I_2}{I_1}=\frac{N_1}{N_2}$。

证明思路：两个线圈的每一匝都穿过同样的磁通量$\Phi$。由:term[法拉第定律]{id="physics.electromagnetism.faraday-law"}（Faraday's law of induction），每一匝的:term[感应电动势]{id="physics.electromagnetism.induced-emf"}都是$-\dv{\Phi}{t}$，线圈电阻不计时两端的电势差等于它的$N$倍，所以$\frac{V_2}{V_1}=\frac{N_2}{N_1}$。没有损耗，空载电流可以不计时铁芯里:term[磁场]{id="physics.electromagnetism.magnetic-field"}储存的能量也可以不计，输入的功率等于输出的功率，$V_1I_1=V_2I_2$，电流之比和匝数之比相反。

[电动势与直流电路](lesson:physics.electromagnetism.dc-circuits)第 7 题说，远距离输电要用很高的电势差，到用户那里再降下来，靠的就是变压器；直流电在铁芯里产生的磁通量不变，变压器对它不起作用。1885 年，布达佩斯冈茨工厂的布拉西（Ottó Bláthy）、德里（Miksa Déri）和齐珀诺夫斯基（Károly Zipernowsky）做出了闭合铁芯的变压器，交流输电从此推广开来。实际的铁芯用:term[磁滞]{id="physics.electromagnetism.hysteresis"}（hysteresis）小的软铁，并叠成彼此绝缘的薄片，减小磁滞和:term[涡电流]{id="physics.electromagnetism.eddy-current"}（eddy current）的损耗。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 3], y: [-1.1, 1.1] }
functions:
  - expr: "1/sqrt(1 + Q^2*(x - 1/x)^2)"
    label: |
      电流的振幅，以共振时的值为单位
  - expr: "atan(Q*(x - 1/x))/(pi/2)"
    label: |
      电流落后于电动势的相位，以$90^\circ$为单位
sliders:
  - name: Q
    min: 1
    max: 10
    step: 1
    default: 3
    label: |
      品质因数$Q$
:::

动画画的是 RLC 串联电路里:term[电流]{id="physics.electromagnetism.electric-current"}的振幅和相位随电源频率的变化，横轴是$\frac{\omega}{\omega_0}$（图上写作$x$）。振幅在$\omega=\omega_0$处最大，品质因数越大，峰越窄（这里按共振时的值归一，峰高都是$1$）。相位从低频时接近$-90^\circ$（电流超前，:term[电容器]{id="physics.electromagnetism.capacitor"}起主导作用），经过共振时的零，到高频时接近$90^\circ$（电流落后，线圈起主导作用）；$Q$越大，相位在$\omega_0$附近变得越陡。

:::anim{component="oscillator"}
masses: [1]
springs: [1, 0]
damping: R
initial: [1]
dt: 0.01
sliders:
  - name: R
    min: 0
    max: 3
    step: 0.25
    default: 0.25
    label: |
      电阻$R$
:::

这个动画用弹簧振子模拟没有电源的 RLC 串联电路：物块的质量对应$L=1$，弹簧的劲度系数对应$\frac1C=1$，阻尼系数对应:term[电阻]{id="physics.electromagnetism.resistance"}$R$，物块的位移对应电容器上的:term[电荷]{id="physics.electromagnetism.electric-charge"}$q$（曲线图的纵轴写作$x$），开始时电容器带电、电流为零。$R=0$时电荷以角频率$\frac{1}{\sqrt{LC}}=1$来回振荡，振幅不变；$R$越大衰减越快，$R\ge2\sqrt{\frac LC}=2$时不再振荡，电荷单调地放完。

## 例题

### 例 1　RC 串联接在家用电源上

$R=100\,\Omega$的:term[电阻]{id="physics.electromagnetism.resistance"}和$C=20\,\mu\mathrm F$的:term[电容器]{id="physics.electromagnetism.capacitor"}串联，接在有效值$220\,\mathrm V$、频率$50\,\mathrm{Hz}$的电源上。求:term[电流]{id="physics.electromagnetism.electric-current"}的有效值、电流和:term[电动势]{id="physics.electromagnetism.electromotive-force"}的相位差，以及电路消耗的平均功率。

**为什么想到这么做**：串联的阻抗相加，$Z=R+\frac{1}{i\omega C}$；它的模给出电流，辐角给出相位，平均功率只消耗在电阻上。

**推导**：$\omega=2\pi\times50\,\mathrm{rad/s}\approx314\,\mathrm{rad/s}$，容抗$\frac{1}{\omega C}\approx159\,\Omega$，$|Z|=\sqrt{100^2+159^2}\,\Omega\approx188\,\Omega$。电流有效值$\frac{220}{188}\,\mathrm A\approx1.17\,\mathrm A$。$\tan\theta=\frac{-159}{100}$，$\theta\approx-58^\circ$：电流比电动势超前约$58^\circ$。平均功率$I_{\mathrm{rms}}^2R\approx137\,\mathrm W$，也等于$V_{\mathrm{rms}}I_{\mathrm{rms}}\cos\theta$。

### 例 2　收音机的调谐电路

收音机的调谐电路里，线圈的:term[自感]{id="physics.electromagnetism.self-inductance"}是$0.25\,\mathrm{mH}$，电路的:term[电阻]{id="physics.electromagnetism.resistance"}约为$10\,\Omega$。要收到频率为$1.0\,\mathrm{MHz}$的中波电台，:term[可变电容器]{id="physics.electromagnetism.capacitor"}要调到多大？这时共振峰的宽度是多少？

**为什么想到这么做**：电台的信号在天线里引起各种频率的微弱:term[电动势]{id="physics.electromagnetism.electromotive-force"}，调谐电路只对共振频率附近的有明显的:term[电流]{id="physics.electromagnetism.electric-current"}；让共振频率等于电台的频率，由$\omega_0=\frac{1}{\sqrt{LC}}$求$C$，峰的宽度由$\Delta\omega=\frac RL$给出。

**推导**：$C=\frac{1}{\omega_0^2L}=\frac{1}{(2\pi\times10^6)^2\times2.5\times10^{-4}}\,\mathrm F$，约为$1.0\times10^{-10}\,\mathrm F=100\,\mathrm{pF}$。$\Delta\omega=\frac RL=4\times10^4\,\mathrm{rad/s}$，即$\Delta f=\frac{\Delta\omega}{2\pi}\approx6.4\,\mathrm{kHz}$，品质因数$Q=\frac{f_0}{\Delta f}\approx160$。频率相差几十千赫的电台，在这个电路里引起的电流要小得多，所以只听到一个台。

## 常见误区

- 「:term[电容器]{id="physics.electromagnetism.capacitor"}不让:term[电流]{id="physics.electromagnetism.electric-current"}通过，交流电路里电容器所在的支路没有电流。」:term[电荷]{id="physics.electromagnetism.electric-charge"}不穿过两板，可极板反复充电、放电，导线里一直有交变的电流；频率越高，容抗越小。
- 「串联元件两端:term[电势差]{id="physics.electromagnetism.potential-difference"}的有效值可以直接相加，得到电源的有效值。」各元件的电势差相位不同，要按复数相加；共振时线圈和电容器两端的电势差都可以比电源的大。
- 「平均功率等于电势差和电流的有效值相乘。」还要乘功率因数$\cos\theta$；理想的线圈和电容器平均不消耗功率。
- 「:term[变压器]{id="physics.electromagnetism.transformer"}也能给直流电升压。」直流电产生的:term[磁通量]{id="physics.electromagnetism.magnetic-flux"}不变，副线圈里没有:term[感应电动势]{id="physics.electromagnetism.induced-emf"}。

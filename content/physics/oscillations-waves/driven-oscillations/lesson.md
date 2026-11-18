---
id: physics.oscillations-waves.driven-oscillations
title: |
  受迫振动与共振
goal: |
  会求受迫振动的稳态振幅和相位，并用品质因数描述共振峰的宽窄。
prerequisites: [physics.oscillations-waves.damped-oscillations, physics.oscillations-waves.phasors]
minutes: 24
summary: |
  稳态$\tilde x=\frac{F_0/m}{\omega_0^2-\omega^2+i\gamma\omega}$；$Q=\frac{\omega_0}\gamma$描述共振峰的宽窄。
status: reviewed
---

## 这一节要回答的问题

有节奏地推秋千，推的节奏和秋千自己摆的节奏一致时，秋千荡得最高。周期性的外力推着一个有阻尼的振子，它最后振成什么样？外力的节奏偏一点，:term[振幅]{id="physics.oscillations-waves.amplitude"}（amplitude）差多少？:term[共振]{id="physics.oscillations-waves.resonance"}（resonance）的峰有多尖，由什么决定？

## 讲解

### 受迫振动的稳态

::anchor{id="def-driven-oscillation"}
振子受到随时间周期性变化的外力而做的振动叫作:term[受迫振动]{id="physics.oscillations-waves.driven-oscillation"}（driven oscillation），这个外力叫作驱动力（driving force）。驱动力是$F_0\cos\omega t$时，:term[阻尼振动]{id="physics.oscillations-waves.damped-oscillation"}（damped oscillation）的方程变成$\ddot x+\gamma\dot x+\omega_0^2x=\frac{F_0}m\cos\omega t$，$\omega$叫作驱动角频率（driving angular frequency）。

为什么这样定义：:term[回复力]{id="physics.oscillations-waves.restoring-force"}（restoring force）、:term[阻尼力]{id="physics.oscillations-waves.damping-force"}（damping force）都由振子自己的位置、速度决定，驱动力却是事先给定的时间的函数，不管振子怎么动。余弦是最简单的周期性驱动力。边界情况：$F_0=0$时就是阻尼振动；$\omega=0$时驱动力是恒力，只把平衡位置挪动$\frac{F_0}k$。

::anchor{id="thm-steady-state"}
定理：受迫振动的方程有一个和驱动力同:term[频率]{id="physics.oscillations-waves.frequency"}（frequency）的解$x_{\mathrm s}=A\cos(\omega t-\delta)$，:term[复振幅]{id="physics.oscillations-waves.complex-amplitude"}（complex amplitude）是$\tilde x=\frac{F_0/m}{\omega_0^2-\omega^2+i\gamma\omega}$，即$A=\frac{F_0/m}{\sqrt{(\omega_0^2-\omega^2)^2+\gamma^2\omega^2}}$，位移落后驱动力的:term[相位]{id="physics.oscillations-waves.phase"}（phase）$\delta$在$0$和$\pi$之间，$\tan\delta=\frac{\gamma\omega}{\omega_0^2-\omega^2}$。任何一个解都等于$x_{\mathrm s}$加上一个阻尼振动。

证明思路：设$x=\Re\bigl(\tilde xe^{i\omega t}\bigr)$，由[复数表示与旋转矢量](lesson:physics.oscillations-waves.phasors#thm-phasor-derivative)，求导就是乘$i\omega$，方程变成$(\omega_0^2-\omega^2+i\gamma\omega)\tilde x=\frac{F_0}m$，取模得$A$，取辐角（argument）得$-\delta$。两个解之差满足没有驱动力的方程，是一个阻尼振动。

::anchor{id="def-steady-state"}
上面和驱动力同频率的解叫作稳态（steady state），另加的那个阻尼振动叫作暂态（transient）。

为什么这样定义：暂态按$e^{-\lambda t}$衰减，$\lambda$是[阻尼振动](lesson:physics.oscillations-waves.damped-oscillations#thm-critical)里说的衰减率，:term[欠阻尼]{id="physics.oscillations-waves.underdamped"}（underdamped）、:term[临界阻尼]{id="physics.oscillations-waves.critically-damped"}（critically damped）时就是$\frac\gamma2$，:term[过阻尼]{id="physics.oscillations-waves.overdamped"}（overdamped）时比它小；过几个$\frac1\lambda$以后，不管开始怎样，振子都只剩稳态：:term[振幅]{id="physics.oscillations-waves.amplitude"}、相位都不再变，频率是驱动力的频率，不是振子的:term[固有角频率]{id="physics.oscillations-waves.natural-angular-frequency"}（natural angular frequency）。边界情况：没有阻尼时暂态不衰减；$\omega=\omega_0$时上面的$\tilde x$还会变成无穷大，这时的解振幅随时间线性增长，就是常微分方程里讲的:term[共振]{id="math.ode.resonance"}（resonance）。

三个极限看得清物理：$\omega\ll\omega_0$时$A\approx\frac{F_0}k$、$\delta\approx0$，驱动力慢慢变，振子跟着它，弹簧的力起主要作用；$\omega\gg\omega_0$时$A\approx\frac{F_0}{m\omega^2}$、$\delta\approx\pi$，惯性起主要作用，位移和驱动力反相；$\omega=\omega_0$时$A=\frac{F_0}{m\gamma\omega_0}$，$\delta=\frac\pi2$。

### 共振与品质因数

::anchor{id="def-resonance"}
:term[驱动角频率]{id="physics.oscillations-waves.angular-frequency"}接近:term[固有角频率]{id="physics.oscillations-waves.natural-angular-frequency"}时，稳态的:term[振幅]{id="physics.oscillations-waves.amplitude"}变得很大，这种现象叫作:term[共振]{id="physics.oscillations-waves.resonance"}（resonance）。$Q=\frac{\omega_0}\gamma$叫作振子的:term[品质因数]{id="physics.oscillations-waves.quality-factor"}（quality factor）。

为什么这样定义：$A$对$\omega$求导可知，位移振幅的峰在$\sqrt{\omega_0^2-\gamma^2/2}$，比$\omega_0$略低；速度的振幅$\omega A$则正好在$\omega_0$处最大，这时速度和驱动力同相。阻尼弱时两个峰几乎重合，都叫共振；共振时的振幅$\frac{F_0}{m\gamma\omega_0}=Q\frac{F_0}k$，是静态位移的$Q$倍。边界情况：$\gamma\ge\sqrt2\,\omega_0$（$Q\le\frac1{\sqrt2}$）时位移振幅随$\omega$一路减小，没有峰。

::anchor{id="thm-power"}
定理：稳态时驱动力的平均功率是$\bar P=\frac{F_0^2}{2m}\cdot\frac{\gamma\omega^2}{(\omega_0^2-\omega^2)^2+\gamma^2\omega^2}$，在$\omega=\omega_0$处最大，是$\frac{F_0^2}{2m\gamma}$；$\bar P$降到最大值一半的两个角频率之差恰好是$\Delta\omega=\gamma$，所以$Q=\frac{\omega_0}{\Delta\omega}$。

证明思路：功率$F\dot x=-F_0\omega A\cos\omega t\sin(\omega t-\delta)$，$\cos\omega t\sin(\omega t-\delta)=\frac12\bigl(\sin(2\omega t-\delta)-\sin\delta\bigr)$，第一项一个:term[周期]{id="physics.oscillations-waves.period"}（period）里平均为零，所以$\bar P=\frac12F_0\omega A\sin\delta$，代入$A$和$\sin\delta=\frac{\gamma\omega}{\sqrt{(\omega_0^2-\omega^2)^2+\gamma^2\omega^2}}$即得。降到一半要$(\omega_0^2-\omega^2)^2=\gamma^2\omega^2$，即$\omega^2\pm\gamma\omega-\omega_0^2=0$，两个正根是$\sqrt{\omega_0^2+\gamma^2/4}\pm\frac\gamma2$，差是$\gamma$。

$Q$越大，共振峰越高越窄：驱动角频率偏离$\omega_0$只要比$\frac{\omega_0}Q$大得多，振子就几乎不响应。收音机选台、乐器的共鸣都靠这一点。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 2.5], y: [0, 6] }
functions:
  - expr: "1 / sqrt((1 - x^2)^2 + x^2/Q^2)"
    label: |
      稳态振幅和静态位移之比$\frac{A}{F_0/k}$
  - expr: "atan2(x/Q, 1 - x^2)"
    label: |
      位移落后驱动力的相位$\delta$（弧度）
points:
  - { x: "sqrt(1 - 1/(2*Q^2))", y: "Q / sqrt(1 - 1/(4*Q^2))" }
sliders:
  - name: Q
    min: 0.5
    max: 5
    step: 0.1
    default: 2
    label: |
      品质因数$Q$
:::

横轴是$\frac\omega{\omega_0}$（图上写作$x$）。蓝线是稳态:term[振幅]{id="physics.oscillations-waves.amplitude"}和静态位移$\frac{F_0}k$之比，圆点是它的峰；橙线是位移落后驱动力的:term[相位]{id="physics.oscillations-waves.phase"}$\delta$。拖大$Q$：峰变高、变尖，向$\omega=\omega_0$靠拢，相位在$\omega_0$附近从$0$很快变到$\pi$；$Q$小于$\frac1{\sqrt2}$时没有峰，圆点不见了。不管$Q$多大，$\omega=\omega_0$处的相位都是$\frac\pi2$。

## 例题

### 例 1　稳态的振幅和相位

质量$0.20\,\mathrm{kg}$的物块连在劲度系数（spring constant）$80\,\mathrm{N/m}$的弹簧上，阻尼系数$0.80\,\mathrm{kg/s}$，受驱动力$0.40\cos\omega t$（单位$\mathrm N$）。求$\omega=15\,\mathrm{rad/s}$和$\omega=20\,\mathrm{rad/s}$时的稳态:term[振幅]{id="physics.oscillations-waves.amplitude"}和:term[相位]{id="physics.oscillations-waves.phase"}。

**为什么想到这么做**：先算$\omega_0$、$\gamma$和$\frac{F_0}m$，再代进稳态的振幅和相位的式子。

**推导**：$\omega_0=\sqrt{\frac{80}{0.20}}=20\,\mathrm{rad/s}$，$\gamma=\frac{0.80}{0.20}=4.0\,\mathrm{s^{-1}}$，$Q=5$，$\frac{F_0}m=2.0\,\mathrm{m/s^2}$。$\omega=15\,\mathrm{rad/s}$时，$\omega_0^2-\omega^2=175$，$\gamma\omega=60$，$\sqrt{175^2+60^2}=185$，$A=\frac{2.0}{185}\,\mathrm m\approx1.08\,\mathrm{cm}$，$\delta=\arctan\frac{60}{175}\approx0.330$。$\omega=20\,\mathrm{rad/s}$时$A=\frac{2.0}{4.0\times20}\,\mathrm m=2.5\,\mathrm{cm}$，$\delta=\frac\pi2$，正是静态位移$\frac{F_0}k=0.50\,\mathrm{cm}$的$Q=5$倍。

### 例 2　由共振曲线求品质因数

测得一个振子吸收的平均功率在$100.0\,\mathrm{Hz}$处最大，在$99.0\,\mathrm{Hz}$和$101.0\,\mathrm{Hz}$处降到最大值的一半。求它的:term[品质因数]{id="physics.oscillations-waves.quality-factor"}；撤去驱动力后，自由振动的:term[振幅]{id="physics.oscillations-waves.amplitude"}过多久降为原来的$\frac1e$？

**为什么想到这么做**：半功率的两个:term[角频率]{id="physics.oscillations-waves.angular-frequency"}之差就是$\gamma$，$Q=\frac{\omega_0}{\Delta\omega}$；自由振动的振幅按$e^{-\gamma t/2}$衰减。

**推导**：$Q=\frac{\omega_0}{\Delta\omega}=\frac{f_0}{\Delta f}=\frac{100.0}{2.0}=50$。$\gamma=\Delta\omega=2\pi\times2.0\,\mathrm{s^{-1}}\approx12.6\,\mathrm{s^{-1}}$，振幅降为$\frac1e$要$\frac2\gamma\approx0.16\,\mathrm s$，大约是振动 16 次的时间。

## 常见误区

- 「:term[共振]{id="physics.oscillations-waves.resonance"}时:term[振幅]{id="physics.oscillations-waves.amplitude"}无限大。」有阻尼时共振的振幅是有限的$Q\frac{F_0}k$；完全没有阻尼、:term[驱动角频率]{id="physics.oscillations-waves.angular-frequency"}又正好等于:term[固有角频率]{id="physics.oscillations-waves.natural-angular-frequency"}时，振幅才随时间一直增长。
- 「驱动角频率等于固有角频率时，位移振幅最大。」位移振幅的峰在$\sqrt{\omega_0^2-\gamma^2/2}$，略低于$\omega_0$；正好在$\omega_0$处最大的是速度振幅和吸收的平均功率。
- 「:term[受迫振动]{id="physics.oscillations-waves.driven-oscillation"}的:term[频率]{id="physics.oscillations-waves.frequency"}由振子自己决定。」稳态的频率等于驱动力的频率；振子的固有角频率只在衰减掉的暂态里出现。

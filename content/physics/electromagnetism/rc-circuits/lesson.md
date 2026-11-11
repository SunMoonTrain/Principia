---
id: physics.electromagnetism.rc-circuits
title: |
  RC 电路
goal: |
  会写出电容器充放电的微分方程，并求时间常数。
prerequisites: [physics.electromagnetism.dc-circuits, physics.electromagnetism.capacitors, math.ode.linear-first-order]
minutes: 30
summary: |
  电容器经电阻充放电，按指数规律变化，时间常数是 RC。
status: reviewed
---

## 这一节要回答的问题

把充了电的:term[电容器]{id="physics.electromagnetism.capacitor"}（capacitor）和一个:term[电阻]{id="physics.electromagnetism.resistance"}（resistance）接成回路，:term[电荷]{id="physics.electromagnetism.electric-charge"}（electric charge）不会一下子放完：放电的快慢由什么决定？用电池通过电阻给电容器充电，要多久才能充满？充电时电池输出的能量，有多少存进了电容器？

## 讲解

### 放电

:term[电容]{id="physics.electromagnetism.capacitance"}（capacitance）为$C$的:term[电容器]{id="physics.electromagnetism.capacitor"}带电$Q_0$，$t=0$时用:term[电阻]{id="physics.electromagnetism.resistance"}$R$把两个极板接起来。设$t$时刻正极板带电$Q(t)$，:term[电流]{id="physics.electromagnetism.electric-current"}（electric current）$I(t)$从正极板经电阻流向负极板。这一节把电路的每一刻都当作:term[恒定电流]{id="physics.electromagnetism.steady-current"}（steady current）处理：电流变化得足够慢，导线各个截面上的电流相同，电容器两板之间的:term[电势差]{id="physics.electromagnetism.potential-difference"}（potential difference）也和静电时一样，是$\frac QC$。

::anchor{id="thm-discharge"}
定理（电容器的放电）：:term[电容]{id="physics.electromagnetism.capacitance"}为$C$、带电$Q_0$的电容器在$t=0$时接上电阻$R$，此后极板上的:term[电荷]{id="physics.electromagnetism.electric-charge"}是$Q(t)=Q_0e^{-t/RC}$，回路里的:term[电流]{id="physics.electromagnetism.electric-current"}是$I(t)=\frac{Q_0}{RC}e^{-t/RC}$。

证明思路：沿回路用[回路定律](lesson:physics.electromagnetism.dc-circuits#thm-kirchhoff)，电容器两板的电势差等于电阻两端的电势差，$\frac QC=IR$；电流使正极板的电荷减少，$I=-\dv Qt$。于是$\dv Qt=-\frac{Q}{RC}$，这是一阶线性方程（first-order linear equation），$Q$的变化率和$Q$本身成正比。用积分因子（integrating factor）$e^{t/RC}$，或者直接求导验证，满足$Q(0)=Q_0$的解是$Q_0e^{-t/RC}$，再由$I=-\dv Qt$得电流。

::anchor{id="def-time-constant"}
按$e^{-t/\tau}$衰减的量，$\tau$叫作它的:term[时间常数]{id="physics.electromagnetism.time-constant"}（time constant）：每过时间$\tau$，它变成原来的$\frac1e\approx0.368$。RC 电路的时间常数是$\tau=RC$。

为什么这样定义：$RC$的单位是$\Omega\cdot\mathrm F=\frac{\mathrm V}{\mathrm A}\cdot\frac{\mathrm C}{\mathrm V}=\mathrm s$，确实是时间。几何上，从$t=0$出发沿放电曲线的切线一直降下去，恰好在$t=\tau$时降到零；电荷降到一半的时间是$\tau\ln2\approx0.693\tau$。边界情况：放电不会在有限的时间里完全结束，但过了$5\tau$，剩下的电荷只有开始时的$e^{-5}$，不到$1\%$，实际上可以认为放完了。

把电路当作恒定电流处理，要求电流变化得比:term[电场]{id="physics.electromagnetism.electric-field"}（electric field）传过整个电路慢得多。电场以光速传播，一米大小的电路只要几纳秒，所以时间常数在微秒以上时，这一节的结果都很准确。

### 充电

:term[电动势]{id="physics.electromagnetism.electromotive-force"}（electromotive force）为$\mathcal E$的电源、:term[电阻]{id="physics.electromagnetism.resistance"}$R$和原来不带电的:term[电容器]{id="physics.electromagnetism.capacitor"}串联，$t=0$时接通；电源的:term[内阻]{id="physics.electromagnetism.internal-resistance"}（internal resistance）算进$R$里。:term[电流]{id="physics.electromagnetism.electric-current"}$I$从电源正极流向电容器的正极板，$I=\dv Qt$。

::anchor{id="thm-charge"}
定理（电容器的充电）：电动势为$\mathcal E$的电源经电阻$R$给:term[电容]{id="physics.electromagnetism.capacitance"}为$C$、原来不带电的电容器充电，此后$Q(t)=C\mathcal E\bigl(1-e^{-t/RC}\bigr)$，$I(t)=\frac{\mathcal E}{R}e^{-t/RC}$。

证明思路：回路定律给出$\mathcal E=IR+\frac QC$，即$\dv Qt+\frac{Q}{RC}=\frac{\mathcal E}{R}$。乘上积分因子$e^{t/RC}$，左边是$\dv{}{t}\bigl(Qe^{t/RC}\bigr)$，积分得$Qe^{t/RC}=C\mathcal Ee^{t/RC}+K$；由$Q(0)=0$得$K=-C\mathcal E$。

刚接通时$Q=0$，电容器两端没有:term[电势差]{id="physics.electromagnetism.potential-difference"}，电流是$\frac{\mathcal E}{R}$，电容器像一根导线；充满以后电流为零，电容器两端的电势差等于$\mathcal E$，它像断开的开关。电容器的:term[电荷]{id="physics.electromagnetism.electric-charge"}、电势差都不能突变，只能按:term[时间常数]{id="physics.electromagnetism.time-constant"}$RC$连续地变。

### 能量

::anchor{id="thm-rc-energy"}
定理（充电过程的能量）：上面的充电过程结束时，电源一共做功$C\mathcal E^2$，:term[电容器]{id="physics.electromagnetism.capacitor"}储存的能量是$\frac12C\mathcal E^2$，:term[电阻]{id="physics.electromagnetism.resistance"}上放出的:term[焦耳热]{id="physics.electromagnetism.joule-heating"}（Joule heating）也是$\frac12C\mathcal E^2$，和$R$无关。

证明思路：电源每秒做功$\mathcal EI$，总共是$\mathcal E\int_0^\infty I\,\dd t=\mathcal EQ(\infty)=C\mathcal E^2$。电容器储存$\frac12C\mathcal E^2$（见[电容器储存的能量](lesson:physics.electromagnetism.capacitors#thm-capacitor-energy)）。电阻上放出$\int_0^\infty I^2R\,\dd t=\frac{\mathcal E^2}{R}\int_0^\infty e^{-2t/RC}\dd t=\frac{\mathcal E^2}{R}\cdot\frac{RC}{2}=\frac12C\mathcal E^2$，三者恰好满足能量守恒。

$R$越小，:term[电流]{id="physics.electromagnetism.electric-current"}越大，持续的时间越短，两者的效果恰好抵消，焦耳热总是电源做功的一半。要减少这部分损失，不能靠减小电阻，而要让电源的:term[电动势]{id="physics.electromagnetism.electromotive-force"}随电容器的:term[电势差]{id="physics.electromagnetism.potential-difference"}慢慢升高（第 6 题）。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 5], y: [0, 1.2] }
functions:
  - expr: "1 - exp(-x/T)"
    label: |
      充电时的电荷
  - expr: "exp(-x/T)"
    label: |
      充电时的电流
  - expr: "x/T"
    label: |
      电荷曲线在开始处的切线
sliders:
  - name: T
    min: 0.5
    max: 2.5
    step: 0.25
    default: 1
    label: |
      时间常数$\tau=RC$
:::

动画画的是充电过程：横轴是时间$t$（图上写作$x$），:term[电荷]{id="physics.electromagnetism.electric-charge"}以充满时的$C\mathcal E$为单位，:term[电流]{id="physics.electromagnetism.electric-current"}以开始时的$\frac{\mathcal E}{R}$为单位。电荷曲线开始处的切线在$t=\tau$时到达$1$：假如一直按开始时的电流充下去，一个:term[时间常数]{id="physics.electromagnetism.time-constant"}就能充满，实际上电流越来越小，$t=\tau$时只充到$1-\frac1e\approx63\%$。拖动滑块，$\tau$变大，两条曲线都按比例向右拉长，形状不变：RC 电路里只有$\frac t\tau$这一个比值要紧。

放电时的电荷曲线和充电时的电流曲线形状一样，都是$e^{-t/\tau}$。

## 例题

### 例 1　由放电的快慢测电容

一个充了电的:term[电容器]{id="physics.electromagnetism.capacitor"}两极接在一个:term[电阻]{id="physics.electromagnetism.resistance"}为$1.0\,\mathrm{M\Omega}$的电压表（voltmeter）上，读数从$10.0\,\mathrm V$降到$5.0\,\mathrm V$用了$3.5\,\mathrm s$。求电容器的:term[电容]{id="physics.electromagnetism.capacitance"}。

**为什么想到这么做**：电容器通过电压表放电，:term[电势差]{id="physics.electromagnetism.potential-difference"}$\frac QC$和:term[电荷]{id="physics.electromagnetism.electric-charge"}一样按$e^{-t/RC}$衰减。降到一半的时间是$\tau\ln2$，由它求出$\tau$，再除以$R$。

**推导**：$e^{-t/\tau}=\frac12$，$\tau=\frac{t}{\ln2}=\frac{3.5\,\mathrm s}{0.693}\approx5.05\,\mathrm s$。$C=\frac\tau R=\frac{5.05\,\mathrm s}{1.0\times10^6\,\Omega}\approx5.0\times10^{-6}\,\mathrm F=5.0\,\mu\mathrm F$。这个办法只要一块表和一个秒表，常用来测较大的电容。

### 例 2　两个电容器经电阻相连

:term[电容]{id="physics.electromagnetism.capacitance"}都是$C$的两个:term[电容器]{id="physics.electromagnetism.capacitor"}，一个带电$Q_0$，一个不带电，$t=0$时用:term[电阻]{id="physics.electromagnetism.resistance"}$R$把它们的正极板连起来（负极板之间用导线相连）。求:term[电荷]{id="physics.electromagnetism.electric-charge"}怎样随时间变化，以及电阻上一共放出多少热。

**为什么想到这么做**：[电容器](lesson:physics.electromagnetism.capacitors)第 7 题说，连起来以后两个电容器的总能量只剩一半，和电阻的大小无关；这里把中间的过程算出来。两个电荷的和不变，要求的是它们的差怎样变。

**推导**：设两个正极板的电荷为$q_1$、$q_2$，$q_1+q_2=Q_0$；:term[电流]{id="physics.electromagnetism.electric-current"}$I$从第一个流向第二个，$I=-\dv{q_1}t=\dv{q_2}t$。回路定律给出$\frac{q_1}{C}-\frac{q_2}{C}=IR$。差$\Delta q=q_1-q_2$满足$\dv{\Delta q}{t}=-2I=-\frac{2\Delta q}{RC}$，所以$\Delta q=Q_0e^{-2t/RC}$，:term[时间常数]{id="physics.electromagnetism.time-constant"}是$\frac{RC}{2}$，两个电荷都趋于$\frac{Q_0}2$。

电流$I=\frac{\Delta q}{RC}=\frac{Q_0}{RC}e^{-2t/RC}$，电阻上放出的热是$\int_0^\infty I^2R\,\dd t=\frac{Q_0^2}{RC^2}\cdot\frac{RC}{4}=\frac{Q_0^2}{4C}$，正是开始时的能量$\frac{Q_0^2}{2C}$的一半，和$R$无关：$R$小，电流大，持续的时间短，放出的热不变。

## 常见误区

- 「:term[电容器]{id="physics.electromagnetism.capacitor"}要无穷长的时间才能充满，所以实际上永远充不满。」过了$5\tau$，和最终的值只差不到$1\%$；工程上说「充满」就是这个意思。
- 「:term[电阻]{id="physics.electromagnetism.resistance"}越大，充电时浪费的能量越多。」电阻上放出的:term[焦耳热]{id="physics.electromagnetism.joule-heating"}总是$\frac12C\mathcal E^2$，和$R$无关；$R$只决定充电的快慢。
- 「:term[时间常数]{id="physics.electromagnetism.time-constant"}就是电容器放完电要用的时间。」过了一个时间常数，:term[电荷]{id="physics.electromagnetism.electric-charge"}还剩约$37\%$。
- 「刚接通时，电容器两端的:term[电势差]{id="physics.electromagnetism.potential-difference"}就是电源的:term[电动势]{id="physics.electromagnetism.electromotive-force"}。」刚接通时电容器不带电，两端没有电势差，电源的电动势全加在电阻上，:term[电流]{id="physics.electromagnetism.electric-current"}最大。

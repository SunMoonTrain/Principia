---
id: physics.electromagnetism.rl-circuits
title: |
  RL 电路
goal: |
  会求 RL 电路中电流的增长和衰减。
prerequisites: [physics.electromagnetism.inductance, physics.electromagnetism.rc-circuits]
minutes: 30
summary: |
  电感使电流不能突变，电流按指数规律变化，时间常数是$\frac LR$。
status: reviewed
---

## 这一节要回答的问题

把一个线圈很多的电路接到电池上，:term[电流]{id="physics.electromagnetism.electric-current"}（electric current）不会一下子跳到$\frac{\mathcal E}{R}$，它是怎样增长的？断开电源，电流又怎样衰减，线圈里储存的能量去了哪里？和:term[电容器]{id="physics.electromagnetism.capacitor"}（capacitor）充放电的 RC 电路比，有什么相同、有什么不同？

## 讲解

### 电路里的线圈

电路里有:term[自感]{id="physics.electromagnetism.self-inductance"}（self-inductance）为$L$的线圈时，:term[电流]{id="physics.electromagnetism.electric-current"}变化在线圈里产生:term[自感电动势]{id="physics.electromagnetism.electromotive-force"}（self-induced electromotive force）$-L\dv It$。把它和电池的电动势一样算进回路定律（见[法拉第电磁感应定律](lesson:physics.electromagnetism.faraday-law#thm-faraday)），回路定律就能照样用：沿回路一圈，各电动势之和等于各:term[电阻]{id="physics.electromagnetism.resistance"}（resistance）上的:term[电势]{id="physics.electromagnetism.electric-potential"}（electric potential）降落之和。

线圈的导线电阻不计时，导线里的:term[电场]{id="physics.electromagnetism.electric-field"}（electric field）为零，线圈两端的:term[电势差]{id="physics.electromagnetism.potential-difference"}（potential difference）正好和自感电动势抵消：电流$I$从线圈的$a$端流进、$b$端流出，$\varphi_a-\varphi_b=L\dv It$。电流增大时进端的电势高，电流减小时出端的电势高。线圈的导线有电阻$r$时，把$r$当作和理想线圈串联的一个电阻。

### 电流的增长

::anchor{id="thm-rl-growth"}
定理（RL 电路里:term[电流]{id="physics.electromagnetism.electric-current"}的增长）：:term[电动势]{id="physics.electromagnetism.electromotive-force"}为$\mathcal E$的电源、:term[电阻]{id="physics.electromagnetism.resistance"}$R$（电源的:term[内阻]{id="physics.electromagnetism.internal-resistance"}（internal resistance）和线圈的电阻都算在里面）和:term[自感]{id="physics.electromagnetism.self-inductance"}为$L$的线圈串联，$t=0$时接通，此后电流是$I(t)=\frac{\mathcal E}{R}\bigl(1-e^{-Rt/L}\bigr)$，:term[时间常数]{id="physics.electromagnetism.time-constant"}（time constant）是$\tau=\frac LR$。

证明思路：回路定律给出$\mathcal E-L\dv It=IR$，即$\dv It+\frac RLI=\frac{\mathcal E}{L}$，这是一阶线性方程（first-order linear equation）。乘上积分因子（integrating factor）$e^{Rt/L}$，左边是$\dv{}{t}\bigl(Ie^{Rt/L}\bigr)$，积分得$Ie^{Rt/L}=\frac{\mathcal E}{R}e^{Rt/L}+K$；由$I(0)=0$得$K=-\frac{\mathcal E}{R}$。

刚接通时$I=0$，线圈两端的:term[电势差]{id="physics.electromagnetism.potential-difference"}是$L\dv It=\mathcal E$，整个电动势都加在线圈上，线圈像断开的开关；电流稳定以后$\dv It=0$，线圈像一根导线。$\frac LR$的单位是$\frac{\mathrm{V\,s/A}}{\mathrm{V/A}}=\mathrm s$，确实是时间：$L$越大，电流越难改变，增长越慢；$R$越大，终值越小，到达终值也越快。

### 电流的衰减

::anchor{id="thm-rl-decay"}
定理（RL 电路里:term[电流]{id="physics.electromagnetism.electric-current"}的衰减）：线圈里原有电流$I_0$，$t=0$时撤去电源，让线圈和:term[电阻]{id="physics.electromagnetism.resistance"}$R$接成回路，此后$I(t)=I_0e^{-Rt/L}$；电阻上一共放出的:term[焦耳热]{id="physics.electromagnetism.joule-heating"}（Joule heating）是$\frac12LI_0^2$。

证明思路：回路里没有电源，$-L\dv It=IR$，满足$I(0)=I_0$的解是$I_0e^{-Rt/L}$。电阻上放出的热是$\int_0^\infty I^2R\,\dd t=I_0^2R\cdot\frac{L}{2R}=\frac12LI_0^2$，正是电流为$I_0$时线圈里储存的能量（见[自感、互感与磁场的能量](lesson:physics.electromagnetism.inductance#thm-energy-li2)）：:term[磁场]{id="physics.electromagnetism.magnetic-field"}（magnetic field）的能量经过电流全部变成了热。

电流衰减时线圈两端的:term[电势差]{id="physics.electromagnetism.potential-difference"}$L\dv It$变成负的，线圈像一个电源，推着电流继续沿原来的方向流。电流不能突变，所以不能在有线圈的电路里随手断开开关：电流若被迫在极短的时间里变成零，$L\dv It$会非常大，在开关处打出火花（例 2）。

### 和 RC 电路对照

两种电路的方程都是一阶线性方程，RL 电路里的:term[电流]{id="physics.electromagnetism.electric-current"}、RC 电路里:term[电容器]{id="physics.electromagnetism.capacitor"}上的:term[电荷]{id="physics.electromagnetism.electric-charge"}（electric charge）都按同样的指数规律趋向终值，:term[时间常数]{id="physics.electromagnetism.time-constant"}分别是$RC$和$\frac LR$（见[RC 电路](lesson:physics.electromagnetism.rc-circuits#def-time-constant)）。不同的是：RC 电路里电容器的电荷和两端的:term[电势差]{id="physics.electromagnetism.potential-difference"}不能突变，刚接通时电容器像一根导线、充满后像断开的开关；RL 电路里线圈的电流不能突变，刚接通时线圈像断开的开关、稳定后像一根导线。两者的能量都储存在场里：电容器在:term[电场]{id="physics.electromagnetism.electric-field"}里，线圈在:term[磁场]{id="physics.electromagnetism.magnetic-field"}里。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 6], y: [-1.2, 1.2] }
functions:
  - expr: "(1 + sign(3 - x))/2 * (1 - exp(-x/T)) + (1 - sign(3 - x))/2 * (1 - exp(-3/T)) * exp(-(x - 3)/T)"
    label: |
      线圈里的电流
  - expr: "(1 + sign(3 - x))/2 * exp(-x/T) - (1 - sign(3 - x))/2 * (1 - exp(-3/T)) * exp(-(x - 3)/T)"
    label: |
      线圈两端的电势差
sliders:
  - name: T
    min: 0.25
    max: 2
    step: 0.25
    default: 0.75
    label: |
      时间常数$\tau=\frac LR$
:::

动画画的是 RL 电路先接通、再撤去电源：横轴是时间$t$（图上写作$x$），$t=0$时接通，$t=3$时撤去电源、让线圈和:term[电阻]{id="physics.electromagnetism.resistance"}接成回路。:term[电流]{id="physics.electromagnetism.electric-current"}以终值$\frac{\mathcal E}{R}$为单位，:term[电势差]{id="physics.electromagnetism.potential-difference"}以$\mathcal E$为单位。接通时电流从零开始连续地增长，线圈两端的电势差一开始就是$\mathcal E$，随后衰减；撤去电源的一刻，电流不跳，电势差却从接近零一下子变成负的，线圈推着电流继续流，直到:term[磁场]{id="physics.electromagnetism.magnetic-field"}的能量放完。$\tau$大时，到$t=3$电流还没长到终值。

## 例题

### 例 1　接通一个线圈

$L=0.50\,\mathrm H$的线圈（:term[电阻]{id="physics.electromagnetism.resistance"}算进下面的$R$里）和$R=10\,\Omega$的电阻串联，$t=0$时接到:term[电动势]{id="physics.electromagnetism.electromotive-force"}$12\,\mathrm V$、:term[内阻]{id="physics.electromagnetism.internal-resistance"}不计的电池上。求:term[时间常数]{id="physics.electromagnetism.time-constant"}、刚接通时:term[电流]{id="physics.electromagnetism.electric-current"}增长的快慢，以及电流达到终值的$90\%$要多长时间。

**为什么想到这么做**：这正是上面的增长定理：先求$\tau=\frac LR$和终值$\frac{\mathcal E}{R}$，刚接通时$I=0$，电动势全加在线圈上，$\dv It=\frac{\mathcal E}{L}$。

**推导**：$\tau=\frac{0.50}{10}\,\mathrm s=0.050\,\mathrm s$，终值$1.2\,\mathrm A$，刚接通时$\dv It=\frac{12}{0.50}\,\mathrm{A/s}=24\,\mathrm{A/s}$。$1-e^{-t/\tau}=0.90$，$t=\tau\ln10\approx0.115\,\mathrm s$。如果电流一直按开始时的快慢增长，$\tau=0.050\,\mathrm s$就到终值了；实际上越长越慢。

### 例 2　断开线圈时的高电压

:term[电动势]{id="physics.electromagnetism.electromotive-force"}$12\,\mathrm V$、:term[内阻]{id="physics.electromagnetism.internal-resistance"}不计的电池接在一个线圈的两端，线圈的:term[自感]{id="physics.electromagnetism.self-inductance"}为$L=2.0\,\mathrm H$、导线的:term[电阻]{id="physics.electromagnetism.resistance"}$r=10\,\Omega$；线圈两端还并联着$R_2=1.0\,\mathrm{k\Omega}$的电阻。:term[电流]{id="physics.electromagnetism.electric-current"}稳定以后断开电池，求断开那一刻$R_2$两端的:term[电势差]{id="physics.electromagnetism.potential-difference"}，以及此后电流衰减的:term[时间常数]{id="physics.electromagnetism.time-constant"}。

**为什么想到这么做**：断开的一刻线圈里的电流不能突变，只能改道经过$R_2$；$R_2$大，同样的电流在它上面产生很大的电势差。

**推导**：稳定时线圈里的电流是$\frac{\mathcal E}{r}=1.2\,\mathrm A$。断开以后，线圈、$r$和$R_2$组成回路，电流从$1.2\,\mathrm A$开始衰减，$R_2$两端的电势差一开始是$1.2\times1000\,\mathrm V=1.2\times10^3\,\mathrm V$，是电池电动势的$100$倍。时间常数$\tau=\frac{L}{r+R_2}=\frac{2.0}{1010}\,\mathrm s\approx2.0\,\mathrm{ms}$，线圈里储存的$\frac12LI_0^2=1.44\,\mathrm J$在这么短的时间里变成热。并联的电阻越大，这个电压越高；不并联电阻，它就加在断开的开关两端，打出火花。

## 常见误区

- 「刚接通时，线圈里的:term[电流]{id="physics.electromagnetism.electric-current"}就是$\frac{\mathcal E}{R}$。」线圈里的电流不能突变，刚接通时是零，按:term[时间常数]{id="physics.electromagnetism.time-constant"}$\frac LR$增长。
- 「断开开关，线圈里的电流马上就变成零。」电流不能突变，它要找一条路继续流；找不到路时，开关两端的电压高到击穿空气。
- 「RL 电路的时间常数是$RL$。」是$\frac LR$：:term[电阻]{id="physics.electromagnetism.resistance"}越大，衰减越快。
- 「理想线圈的导线没有电阻，所以线圈两端的:term[电势差]{id="physics.electromagnetism.potential-difference"}总是零。」电流变化时，两端的电势差是$L\dv It$，只有电流不变时才是零。

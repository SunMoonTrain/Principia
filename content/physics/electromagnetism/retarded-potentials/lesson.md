---
id: physics.electromagnetism.retarded-potentials
title: |
  推迟势
goal: |
  会写出推迟势，并说明推迟时间的物理意义。
prerequisites: [physics.electromagnetism.gauge-potentials, math.pde.wave-3d]
minutes: 45
summary: |
  场点此刻的势由光走到那里所需时间以前的源决定。
status: reviewed
---

## 这一节要回答的问题

静电学里，:term[电荷]{id="physics.electromagnetism.electric-charge"}（electric charge）在哪里，:term[电势]{id="physics.electromagnetism.electric-potential"}（electric potential）就按:term[库仑定律]{id="physics.electromagnetism.coulomb-law"}（Coulomb's law）由它此刻的分布决定。可电荷动了以后，远处的场并不立刻改变，变化以光速传开（见[感生电场](lesson:physics.electromagnetism.induced-electric-field)第 8 题）。电荷和:term[电流]{id="physics.electromagnetism.electric-current"}（electric current）随时间变化时，势怎样由它们求出，「推迟」推迟了多少？什么时候可以不管它？

## 讲解

### 推迟时间

:term[洛伦茨规范]{id="physics.electromagnetism.lorenz-gauge"}（Lorenz gauge）下，标势（scalar potential）和矢势（vector potential）满足$\lap\varphi-\frac1{c^2}\frac{\partial^2\varphi}{\partial t^2}=-\frac\rho{\varepsilon_0}$、$\lap\vb A-\frac1{c^2}\frac{\partial^2\vb A}{\partial t^2}=-\mu_0\vb J$（见[电磁势与规范变换](lesson:physics.electromagnetism.gauge-potentials#def-lorenz-gauge)），四个方程形式一样，都是以$c$传播的有源波动方程（inhomogeneous wave equation）。没有源的地方，三维波动方程有球对称的解$\frac{f(t-r/c)}{r}$，它是以$c$从原点向外传播的球面波（spherical wave）：$r$处$t$时刻的值，是原点在$t-\frac rc$时刻「发出」的（见[三维波动方程与惠更斯原理](lesson:math.pde.wave-3d)）。

::anchor{id="def-retarded-time"}
光从源点$\vb r'$走到场点$\vb r$要用时间$\frac{|\vb r-\vb r'|}{c}$；$t_{\mathrm r}=t-\frac{|\vb r-\vb r'|}{c}$叫作源点$\vb r'$对于场点$\vb r$、时刻$t$的:term[推迟时间]{id="physics.electromagnetism.retarded-time"}（retarded time）。

为什么这样定义：$t_{\mathrm r}$时刻从$\vb r'$出发、以光速前进的信号，正好在$t$时刻到达$\vb r$；下面会看到，势的变化正是以这个速度传播的，$t$时刻$\vb r$处的势只由各个源点在各自的推迟时间的状态决定。离场点远近不同的源点，推迟时间也不同，就像同一眼看到的星光，近处的星发出得晚，远处的星发出得早。边界情况：源点就在场点上时$t_{\mathrm r}=t$；源变化得很慢、在光走过整个源的时间里几乎不变时，推迟可以不计（例 2）。

### 推迟势

::anchor{id="thm-retarded-potentials"}
定理（:term[推迟势]{id="physics.electromagnetism.retarded-potentials"}，retarded potentials）：:term[电荷]{id="physics.electromagnetism.electric-charge"}和:term[电流]{id="physics.electromagnetism.electric-current"}分布在有限的区域里，除了它们自己发出的波，没有从远处射来的:term[电磁波]{id="physics.electromagnetism.em-wave"}（electromagnetic wave）时，:term[洛伦茨规范]{id="physics.electromagnetism.lorenz-gauge"}下的电磁势（electromagnetic potentials）是$\varphi(\vb r,t)=\frac{1}{4\pi\varepsilon_0}\int\frac{\rho(\vb r',t_{\mathrm r})}{|\vb r-\vb r'|}\dd V'$，$\vb A(\vb r,t)=\frac{\mu_0}{4\pi}\int\frac{\vb J(\vb r',t_{\mathrm r})}{|\vb r-\vb r'|}\dd V'$，$t_{\mathrm r}=t-\frac{|\vb r-\vb r'|}{c}$是各个源点的:term[推迟时间]{id="physics.electromagnetism.retarded-time"}。

证明思路：方程是线性的，把源切成小块分别求解再相加。原点处电量随时间变化的一小块电荷$q(t)$，在原点以外满足没有源的波动方程，球对称的解$\frac{f(t-r/c)}{r}$以$c$向外传播，只取向外的，因为没有从远处射来的波；原点附近$r$很小，$f(t-r/c)\approx f(t)$，要和这一时刻的库仑势$\frac{q(t)}{4\pi\varepsilon_0r}$一样，才能在原点给出:term[泊松方程]{id="physics.electromagnetism.poisson-equation"}（Poisson's equation）的源项，所以$\varphi=\frac{q(t-r/c)}{4\pi\varepsilon_0r}$。把小块挪到$\vb r'$处、对所有小块求和就得到$\varphi$，$\vb A$的每个分量满足形式相同的方程，做法一样；可以验证这样求出的势满足洛伦茨规范条件（第 5 题）。

推迟势和:term[静电势]{id="physics.electromagnetism.electric-potential"}、:term[恒定电流]{id="physics.electromagnetism.steady-current"}（steady current）的矢势只差一处：$\rho$、$\vb J$不取此刻的值，而取推迟时间的值。源不随时间变时，两者完全一样。可场不能这样照搬：把:term[库仑定律]{id="physics.electromagnetism.coulomb-law"}、:term[毕奥-萨伐尔定律]{id="physics.electromagnetism.biot-savart-law"}（Biot–Savart law）里的源换成推迟时间的值，得到的:term[电场]{id="physics.electromagnetism.electric-field"}（electric field）、:term[磁场]{id="physics.electromagnetism.magnetic-field"}（magnetic field）是错的，因为由$\vb E=-\nabla\varphi-\pdv{\vb A}t$、$\vb B=\curl\vb A$求导时，推迟时间也随场点变，会多出含$\pdv\rho t$、$\pdv{\vb J}t$的项（第 6 题）；远处按$\frac1r$衰减、带走能量的辐射正来自这些项（见[电偶极辐射](lesson:physics.electromagnetism.dipole-radiation)）。

把推迟时间换成$t+\frac{|\vb r-\vb r'|}{c}$，得到的「超前势」（advanced potentials）数学上也满足同样的方程，它描述从远处汇聚到源上的波，要求场预先知道源将来怎样变化；定理里「没有从远处射来的电磁波」这个条件把它排除了（第 7 题）。黎曼（Bernhard Riemann）在 1858 年、洛伦茨（Ludvig Lorenz）在 1867 年先后提出势以有限的速度传播，洛伦茨写出的正是这里的推迟势，洛伦茨规范条件在他的结果里成立。

### 什么时候可以不管推迟

::anchor{id="def-quasi-static"}
源的尺寸$l$比波长$\lambda=\frac cf$小得多时（$f$是源变化的频率），光走过整个源所用的时间$\frac lc$比周期$\frac1f$短得多，各源点的:term[推迟时间]{id="physics.electromagnetism.retarded-time"}相差无几；场点离源也不远时，推迟可以不计，各处的势就由此刻的:term[电荷]{id="physics.electromagnetism.electric-charge"}、:term[电流]{id="physics.electromagnetism.electric-current"}决定。这样处理叫作:term[准静态]{id="physics.electromagnetism.quasi-static"}（quasi-static）近似，前面各节用的都是它。

为什么这样定义：准静态近似下，静电学、静磁学的结果在每一时刻照样适用，只是电荷、电流随时间慢慢变。频率为$50\,\mathrm{Hz}$的:term[交流电]{id="physics.electromagnetism.alternating-current"}（alternating current），波长约$6000\,\mathrm{km}$，家里的电路都满足这个条件。边界情况：手机信号的频率在几百兆赫兹到几吉赫兹，波长只有几厘米到几十厘米，电路板上的走线就不能再当作准静态，:term[电容器]{id="physics.electromagnetism.capacitor"}（capacitor）两板之间的场也不再均匀（见[位移电流与麦克斯韦方程组](lesson:physics.electromagnetism.maxwell-equations)第 6 题）。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 6], y: [0, 4] }
functions:
  - expr: "(1 + sign(ct - x))/2*ct/(x*sqrt(max(ct^2 - x^2, 1e-12)))"
    label: |
      电流突然接通以后的磁场
  - expr: "1/x"
    label: |
      恒定电流的磁场$\frac{\mu_0I_0}{2\pi s}$
sliders:
  - name: ct
    min: 0.5
    max: 6
    step: 0.25
    default: 2
    label: |
      接通以后经过的时间乘以$c$
:::

动画画的是例 1：一根长直导线里的:term[电流]{id="physics.electromagnetism.electric-current"}在$t=0$时突然从零变成$I_0$。横轴是到导线的距离$s$，以任选的长度$L$为单位；纵轴是:term[磁场]{id="physics.electromagnetism.magnetic-field"}，以$\frac{\mu_0I_0}{2\pi L}$为单位。$s>ct$的地方还没收到电流接通的消息，磁场为零；消息的前沿以光速向外推进，前沿后面的磁场比:term[恒定电流]{id="physics.electromagnetism.steady-current"}的磁场大，随着时间增长逐渐降到它。前沿处的磁场在这个理想化的模型里是无穷大，因为电流是在一瞬间接通的；实际的电流总要用一点时间升起来。

## 例题

### 例 1　突然接通的长直导线

一根无限长的直导线，$t<0$时没有:term[电流]{id="physics.electromagnetism.electric-current"}，$t\ge0$时电流是恒定的$I_0$。求离导线$s$处的矢势、:term[电场]{id="physics.electromagnetism.electric-field"}和:term[磁场]{id="physics.electromagnetism.magnetic-field"}。

**为什么想到这么做**：用:term[推迟势]{id="physics.electromagnetism.retarded-potentials"}。$t$时刻离导线$s$处的场点，只「看得到」导线上:term[推迟时间]{id="physics.electromagnetism.retarded-time"}$t_{\mathrm r}\ge0$的那一段，即到场点的距离不超过$ct$的那一段，$|z|\le\sqrt{c^2t^2-s^2}$。

**推导**：$t<\frac sc$时这一段不存在，场为零。$t>\frac sc$时记$z_0=\sqrt{c^2t^2-s^2}$，$\vb A=\frac{\mu_0I_0}{4\pi}\int_{-z_0}^{z_0}\frac{\dd z}{\sqrt{s^2+z^2}}\,\uv z=\frac{\mu_0I_0}{2\pi}\ln\frac{ct+\sqrt{c^2t^2-s^2}}{s}\,\uv z$。于是$\vb E=-\pdv{\vb A}t=-\frac{\mu_0I_0c}{2\pi\sqrt{c^2t^2-s^2}}\,\uv z$，$\vb B=\curl\vb A=-\pdv{A_z}s\,\uv\psi=\frac{\mu_0I_0}{2\pi s}\cdot\frac{ct}{\sqrt{c^2t^2-s^2}}\,\uv\psi$。$t\to\infty$时电场趋于零，磁场趋于:term[恒定电流]{id="physics.electromagnetism.steady-current"}的$\frac{\mu_0I_0}{2\pi s}$；电场和电流反向，阻碍电流的增长，和:term[感生电场]{id="physics.electromagnetism.induced-electric-field"}（induced electric field）的方向一致。

### 例 2　什么时候可以不管推迟

一块电路板长$10\,\mathrm{cm}$。（1）光从板的一端走到另一端要多少时间？（2）对$50\,\mathrm{Hz}$的:term[交流电]{id="physics.electromagnetism.alternating-current"}和$2.4\,\mathrm{GHz}$的无线信号，这段时间各占周期的多少？

**为什么想到这么做**：推迟能不能忽略，要比较光走过源的时间和源变化的周期。

**推导**：（1）$\frac lc=\frac{0.10}{3.00\times10^8}\,\mathrm s\approx3.3\times10^{-10}\,\mathrm s$。（2）$50\,\mathrm{Hz}$的周期是$0.020\,\mathrm s$，比值约$1.7\times10^{-8}$，推迟完全可以不计，板上各处的:term[电流]{id="physics.electromagnetism.electric-current"}、:term[电荷]{id="physics.electromagnetism.electric-charge"}可以当作同时变化。$2.4\,\mathrm{GHz}$的周期约$4.2\times10^{-10}\,\mathrm s$，比值约$0.8$：信号还没走完整块板，源已经变了将近一个周期，板上同一时刻各处的电压可以相差很大，必须当作波来处理。高速电路板上的走线要按传输线（transmission line）来设计，就是这个原因。

## 常见误区

- 「把:term[库仑定律]{id="physics.electromagnetism.coulomb-law"}里的:term[电荷密度]{id="physics.electromagnetism.charge-density"}（charge density）换成:term[推迟时间]{id="physics.electromagnetism.retarded-time"}的值，就得到变化的:term[电荷]{id="physics.electromagnetism.electric-charge"}产生的:term[电场]{id="physics.electromagnetism.electric-field"}。」不对。电场要由$-\nabla\varphi-\pdv{\vb A}t$求，求导时推迟时间也随场点变，会多出别的项（第 6 题）。
- 「:term[推迟势]{id="physics.electromagnetism.retarded-potentials"}说明:term[库仑规范]{id="physics.electromagnetism.coulomb-gauge"}（Coulomb gauge）里瞬时变化的标势是错的。」两种规范的势不同，求出的电场、:term[磁场]{id="physics.electromagnetism.magnetic-field"}一样；库仑规范下标势的瞬时变化不传递任何信号（见[电磁势与规范变换](lesson:physics.electromagnetism.gauge-potentials)第 8 题）。
- 「有了推迟势，静电学、静磁学的结果在变化的情形下都不能用了。」源的尺寸和到场点的距离都远小于波长时，推迟可以不计，:term[准静态]{id="physics.electromagnetism.quasi-static"}近似下那些结果照样适用（例 2）。

---
id: physics.thermal-physics.ideal-gas-law
title: |
  理想气体状态方程
goal: |
  会用状态方程$pV=nRT$求理想气体的状态参量。
prerequisites: [physics.thermal-physics.temperature]
minutes: 30
summary: |
  理想气体满足$pV=nRT=N\kB T$，$T$要用热力学温度。
status: reviewed
---

## 这一节要回答的问题

打足气的轮胎冬天捏着比夏天软，零食袋带到高原上会鼓起来。一定量的气体，压强（pressure）、体积和:term[温度]{id="physics.thermal-physics.temperature"}（temperature）有什么关系？为什么同温同压下，$1\,\mathrm{mol}$氢气和$1\,\mathrm{mol}$氧气的体积一样大？

## 讲解

### 玻意耳定律与等温线

堵住注射器的口，慢慢推活塞，让空气的:term[温度]{id="physics.thermal-physics.temperature"}保持室温：体积压到一半，压强变为原来的 2 倍。

::anchor{id="def-boyle"}
一定质量的气体，温度不变时，压强和体积成反比，$pV=$常数，这叫作:term[玻意耳定律]{id="physics.thermal-physics.boyles-law"}（Boyle's law）。

为什么是反比：同样多的分子挤进一半的空间，单位面积器壁每秒挨的撞击加倍（见[气体动理论](lesson:physics.thermal-physics.kinetic-theory)）。边界情况：室温下的二氧化碳压到约$6\times10^6\,\mathrm{Pa}$就液化了。

::anchor{id="def-isotherm"}
以$V$为横轴、$p$为纵轴的图叫作:term[$p$-$V$图]{id="physics.thermal-physics.pv-diagram"}（$p$-$V$ diagram），一定量气体的每个:term[平衡态]{id="physics.thermal-physics.equilibrium-state"}（equilibrium state）是图上的一个点；温度不变时，这些点连成的曲线叫作:term[等温线]{id="physics.thermal-physics.isotherm"}（isotherm）。

为什么这样定义：由玻意耳定律，等温线是反比例函数$p=\frac CV$的图像。边界情况：各处冷热不一的气体没有统一的温度，不是图上的点。

### 温度变化时

烈日下暴晒的轮胎容易爆胎：体积几乎不变，:term[温度]{id="physics.thermal-physics.temperature"}升高，压强变大。

::anchor{id="def-charles-gay-lussac"}
一定质量的气体，体积不变时压强和:term[热力学温度]{id="physics.thermal-physics.thermodynamic-temperature"}（thermodynamic temperature）成正比，$p\propto T$，这叫作查理定律；压强不变时$V\propto T$，叫作盖-吕萨克定律。英文书常把两个名字对调：Charles's law 多指$V\propto T$，Gay-Lussac's law 多指$p\propto T$。

为什么这样定义：$T$由[温度与热平衡](lesson:physics.thermal-physics.temperature#def-ideal-gas-scale)里的:term[理想气体温标]{id="physics.thermal-physics.ideal-gas-temperature-scale"}（ideal-gas temperature scale）确定，那里正是这样规定的。边界情况：用摄氏温度（Celsius temperature）只是一次函数，$0\,^\circ\mathrm C$时压强不是零；外推到压强为零，就是:term[绝对零度]{id="physics.thermal-physics.absolute-zero"}（absolute zero）。

::anchor{id="thm-pv-over-t"}
定理：在这三条定律成立的范围里，一定质量的气体在各个:term[平衡态]{id="physics.thermal-physics.equilibrium-state"}的$\frac{pV}T$都相同。

证明思路：从$(p_1,V_1,T_1)$出发，先保持温度不变，把体积变到$V_2$，压强变为$\frac{p_1V_1}{V_2}$；再保持体积不变，把温度变到$T_2$，压强再乘$\frac{T_2}{T_1}$，即$\frac{p_2V_2}{T_2}=\frac{p_1V_1}{T_1}$。所以:term[等温线]{id="physics.thermal-physics.isotherm"}$p=\frac CV$的$C\propto T$，温度越高离原点越远。

### 物质的量

一杯$180\,\mathrm g$的水约有$6\times10^{24}$个分子。

::anchor{id="def-amount-of-substance"}
表示含有多少个粒子的量叫作:term[物质的量]{id="physics.thermal-physics.amount-of-substance"}（amount of substance），记作$n$，单位是摩尔（mole，mol）；$1\,\mathrm{mol}$含有的粒子数叫作:term[阿伏伽德罗常量]{id="physics.thermal-physics.avogadro-constant"}（Avogadro constant，也叫阿伏加德罗常数），$N_{\mathrm A}=6.022\,140\,76\times10^{23}\,\mathrm{mol^{-1}}$，是规定的精确值；$N$个分子的物质的量是$n=\frac N{N_{\mathrm A}}$。

为什么这样定义：粒子太多，按「份」数方便，那杯水约$10\,\mathrm{mol}$。边界情况：它不是质量，$1\,\mathrm{mol}$氢气约$2\,\mathrm g$，氧气约$32\,\mathrm g$；也不说「摩尔数」。

本领域的$n$只表示物质的量，单位体积的分子数写成$\frac NV$，不像[电流与欧姆定律](lesson:physics.electromagnetism.current-density)里那样记作$n$。

::anchor{id="def-molar-mass"}
$1\,\mathrm{mol}$物质的质量叫作:term[摩尔质量]{id="physics.thermal-physics.molar-mass"}（molar mass），记作$M$，单位$\mathrm{kg/mol}$；物质的量为$n$时质量是$nM$，一个分子的质量是$m=\frac M{N_{\mathrm A}}$。

为什么这样定义：质量和物质的量从此能互相换算。边界情况：空气是混合物，按平均算约$29\,\mathrm{g/mol}$，即$0.029\,\mathrm{kg/mol}$（见第 5 题）。

### 理想气体状态方程

同温同压的两份同种气体合在一起，$n$、$V$都加倍，$p$、$T$不变，可见$\frac{pV}T\propto n$。化学里的阿伏伽德罗定律（Avogadro's law）又说，同温同压下同体积的气体分子数相同（压强越低越准），所以$\frac{pV}{nT}$对各种气体也相同。

::anchor{id="def-equation-of-state"}
一定量的物质处在:term[平衡态]{id="physics.thermal-physics.equilibrium-state"}时，压强、体积、:term[温度]{id="physics.thermal-physics.temperature"}之间的关系叫作:term[状态方程]{id="physics.thermal-physics.equation-of-state"}（equation of state）；有了它，三个:term[状态参量]{id="physics.thermal-physics.state-variable"}（state variable）只有两个能自由取值。

为什么这样定义：上面三条定律说的都是这种关系，合成一个方程更方便。边界情况：不在平衡态的气体谈不上状态方程。

::anchor{id="def-ideal-gas"}
把压强很低时各种气体共同的$\frac{pV}{nT}$记作$R$，得$pV=nRT$，叫作:term[理想气体状态方程]{id="physics.thermal-physics.ideal-gas-law"}（ideal gas law），$R\approx8.314\,\mathrm{J/(mol\cdot K)}$叫作:term[摩尔气体常量]{id="physics.thermal-physics.molar-gas-constant"}（molar gas constant），也叫气体常量、普适气体常量；严格满足它的气体叫作:term[理想气体]{id="physics.thermal-physics.ideal-gas"}（ideal gas）。

为什么这样定义：压强不太大、温度不太低时，实际气体（real gas）都近似满足它；式中$T$是:term[热力学温度]{id="physics.thermal-physics.thermodynamic-temperature"}。边界情况：高压、低温时偏离明显（第 7 题），见[范德瓦耳斯气体与临界点](lesson:physics.thermal-physics.van-der-waals)。

::anchor{id="def-boltzmann-constant"}
代入$n=\frac N{N_{\mathrm A}}$，得$pV=N\kB T$，$\kB=\frac R{N_{\mathrm A}}=1.380\,649\times10^{-23}\,\mathrm{J/K}$叫作:term[玻尔兹曼常量]{id="physics.thermal-physics.boltzmann-constant"}（Boltzmann constant），是规定的精确值。

为什么这样定义：$\kB$按每个分子说话，讲分子运动时方便；$N_{\mathrm A}$、$\kB$都精确，$R=N_{\mathrm A}\kB=8.314\,462\,618\ldots\,\mathrm{J/(mol\cdot K)}$也精确。边界情况：$N$是分子个数，$n$是:term[物质的量]{id="physics.thermal-physics.amount-of-substance"}，差一个因子$N_{\mathrm A}$，不能混用。

::anchor{id="def-number-density"}
单位体积里的分子数$\frac NV$叫作:term[数密度]{id="physics.thermal-physics.number-density"}（number density），$p=\frac NV\kB T$：同温同压下，各种气体的数密度相同。

为什么这样定义：温度一定时，压强只看数密度，和分子的种类、轻重无关（见[气体动理论](lesson:physics.thermal-physics.kinetic-theory)）；$1\,\mathrm{mol}$氢气和氧气都有$N_{\mathrm A}$个分子，同温同压下体积也就相同，这回答了开头的问题。边界情况：混合气体的总压强见第 5 题。

### 气体的密度

由$pV=nRT$，密度（density）$\rho=\frac{nM}V=\frac{pM}{RT}$，压强一定时和:term[热力学温度]{id="physics.thermal-physics.thermodynamic-temperature"}成反比，[渐变折射率与光线弯曲](lesson:physics.optics.graded-index)例 1 用的就是这一点。$0\,^\circ\mathrm C$、1 标准大气压（standard atmosphere，约$1.013\times10^5\,\mathrm{Pa}$，见[静止流体中的压强](lesson:physics.newtonian-mechanics.fluid-statics#def-atmospheric-pressure)）下，$1\,\mathrm{mol}$:term[理想气体]{id="physics.thermal-physics.ideal-gas"}约$22.4\,\mathrm L$，空气约$1.29\,\mathrm{kg/m^3}$，氦气（$4.0\,\mathrm{g/mol}$）约$0.18\,\mathrm{kg/m^3}$，正是[浮力与阿基米德原理](lesson:physics.newtonian-mechanics.buoyancy)第 4 题的值。

[静止流体中的压强](lesson:physics.newtonian-mechanics.fluid-statics)第 5 题里约$8\,\mathrm{km}$的常量正是$\frac{RT}{Mg}=\frac{\kB T}{mg}$，$15\,^\circ\mathrm C$时约$8.4\,\mathrm{km}$；那里记作$H$，本领域的$H$留给:term[焓]{id="physics.thermal-physics.enthalpy"}（enthalpy）。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 40], y: [0, 300] }
functions:
  - expr: "8.314*T/x"
    label: |
      温度为$T$的等温线
  - expr: "8.314*273.15/x"
    label: |
      $0\,^\circ\mathrm C$的等温线
points:
  - { x: 22.41, y: 101.3 }
sliders:
  - name: T
    min: 100
    max: 600
    step: 10
    default: 400
    label: |
      热力学温度$T$（$\mathrm K$）
:::

图中是$1\,\mathrm{mol}$:term[理想气体]{id="physics.thermal-physics.ideal-gas"}的:term[等温线]{id="physics.thermal-physics.isotherm"}，横轴 x 是体积$V$（$\mathrm L$），纵轴 y 是压强$p$（$\mathrm{kPa}$）；$1\,\mathrm{kPa\cdot L}=1\,\mathrm J$，所以$y=\frac{8.314\,T}x$。蓝线的:term[温度]{id="physics.thermal-physics.temperature"}由滑块调，橙线是$0\,^\circ\mathrm C$的，圆点是$0\,^\circ\mathrm C$、1 标准大气压下的状态。

## 例题

### 例 1　潜水气瓶

容积$12.0\,\mathrm L$的潜水气瓶里，空气的压强是$2.00\times10^7\,\mathrm{Pa}$，:term[温度]{id="physics.thermal-physics.temperature"}是$27\,^\circ\mathrm C$，:term[摩尔质量]{id="physics.thermal-physics.molar-mass"}取$29\,\mathrm{g/mol}$。瓶里有多少千克空气？

**为什么想到这么做**：三个:term[状态参量]{id="physics.thermal-physics.state-variable"}都知道，由$pV=nRT$求出:term[物质的量]{id="physics.thermal-physics.amount-of-substance"}，再乘摩尔质量。

**推导**：$T\approx300\,\mathrm K$，$n=\frac{pV}{RT}=\frac{2.00\times10^7\times12.0\times10^{-3}}{8.314\times300}\,\mathrm{mol}\approx96.2\,\mathrm{mol}$，质量$nM\approx2.79\,\mathrm{kg}$。

### 例 2　探空气球

探空气球（weather balloon）在地面充气时，外面是$1.01\times10^5\,\mathrm{Pa}$、$15\,^\circ\mathrm C$；升到约$10\,\mathrm{km}$高处，外面是$2.65\times10^4\,\mathrm{Pa}$、$-50\,^\circ\mathrm C$。球皮很软，内外的压强、:term[温度]{id="physics.thermal-physics.temperature"}相同，体积变为原来的几倍？

**为什么想到这么做**：:term[物质的量]{id="physics.thermal-physics.amount-of-substance"}不变，由讲解里的定理，$\frac{pV}T$不变。

**推导**：换成:term[热力学温度]{id="physics.thermal-physics.thermodynamic-temperature"}，$T_1\approx288\,\mathrm K$，$T_2\approx223\,\mathrm K$，$\frac{V_2}{V_1}=\frac{p_1}{p_2}\cdot\frac{T_2}{T_1}\approx3.81\times0.774\approx2.95$；只看压强会以为是$3.81$倍。

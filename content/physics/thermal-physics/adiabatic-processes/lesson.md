---
id: physics.thermal-physics.adiabatic-processes
title: |
  绝热过程
goal: |
  会推导理想气体的绝热过程中$pV^\gamma$保持不变，并计算绝热过程中的功。
prerequisites: [physics.thermal-physics.heat-capacity, math.ode.separable]
minutes: 30
summary: |
  比热容比不变的理想气体准静态绝热时$pV^\gamma$不变，绝热线比等温线陡。
status: reviewed
---

## 这一节要回答的问题

用打气筒打一阵子气，靠近底部的筒壁会发热；打开冰镇汽水，瓶口会冒出一缕白雾。两件事都很快，气体来不及和外界（surroundings）交换多少:term[热量]{id="physics.thermal-physics.heat"}（heat），:term[温度]{id="physics.thermal-physics.temperature"}（temperature）为什么还会变？这时压强（pressure）和体积满足什么关系？

## 讲解

### 准静态绝热过程

打气时压一下活塞只要零点几秒，空气导热又很差，来不及和筒壁交换多少:term[热量]{id="physics.thermal-physics.heat"}，可以当作:term[绝热过程]{id="physics.thermal-physics.adiabatic-process"}（adiabatic process）；压强的变化在筒里传开只要约千分之一秒，空气时时几乎处在:term[平衡态]{id="physics.thermal-physics.equilibrium-state"}（equilibrium state），又可以当作:term[准静态过程]{id="physics.thermal-physics.quasi-static-process"}（quasi-static process）。

绝热时$Q=0$，由:term[热力学第一定律]{id="physics.thermal-physics.first-law"}（first law of thermodynamics），$\Delta U=-W$：压缩时外界做功，:term[内能]{id="physics.thermal-physics.internal-energy"}（internal energy）增加，:term[温度]{id="physics.thermal-physics.temperature"}升高；汽水瓶口的气体冲出来时推开空气、对外做功，内能减少，温度降低，水汽凝成小水滴。

::anchor{id="thm-adiabatic"}
定理：一定量的:term[理想气体]{id="physics.thermal-physics.ideal-gas"}（ideal gas），:term[定容摩尔热容]{id="physics.thermal-physics.constant-volume-heat-capacity"}（molar heat capacity at constant volume）$C_{V,\mathrm m}$不随温度变，除了体积变化的功不做别的功时，在准静态的绝热过程中$pV^\gamma$保持不变，$\gamma=\frac{C_{p,\mathrm m}}{C_{V,\mathrm m}}$是:term[比热容比]{id="physics.thermal-physics.heat-capacity-ratio"}（heat capacity ratio）；$TV^{\gamma-1}$和$p^{1-\gamma}T^\gamma$也保持不变。

证明思路：由[热容与焓](lesson:physics.thermal-physics.heat-capacity#thm-cv)里的定理，准静态时吸收的热量$\delta Q=nC_{V,\mathrm m}\dd T+p\,\dd V$，绝热时它是零。代入$p=\frac{nRT}V$，得可分离变量的方程（separable equation）$\dv TV=-\frac R{C_{V,\mathrm m}}\cdot\frac TV$；由:term[迈耶公式]{id="physics.thermal-physics.mayers-relation"}（Mayer's relation），$\frac R{C_{V,\mathrm m}}=\frac{C_{p,\mathrm m}-C_{V,\mathrm m}}{C_{V,\mathrm m}}=\gamma-1$。$T$、$V$都是正的，分离变量（见[可分离变量的方程](lesson:math.ode.separable#thm-separation)）得$\ln T=-(\gamma-1)\ln V+$常数，即$TV^{\gamma-1}$不变。再用$pV=nRT$消去$T$，得$pV^\gamma$不变；消去$V$，得$p^{1-\gamma}T^\gamma$不变。

去掉「准静态」，结论就不一定成立。绝热只要求没有热量出入，并不要求缓慢：:term[自由膨胀]{id="physics.thermal-physics.free-expansion"}（free expansion）是绝热的，却不是准静态的，理想气体自由膨胀前后温度相同，$pV$不变，$pV^\gamma$就变了。

单原子理想气体的$\gamma=\frac53$；空气的$\gamma\approx1.40$，本节当作实验值，它为什么约等于$\frac75$，见[能量均分定理](lesson:physics.thermal-physics.equipartition)。$C_{V,\mathrm m}$随温度变时$\gamma$也变；常温附近空气的$\gamma$几乎不变，上千开时会变小几个百分点。

从分子看，活塞向里推时，分子撞上迎面而来的活塞，弹回时更快，气体就变热；向外退时反过来（[气体动理论](lesson:physics.thermal-physics.kinetic-theory)第 5 题）。分析力学[浸渐不变量](lesson:physics.analytical-mechanics.adiabatic-invariants)第 7 题的一维盒子里，互不碰撞的粒子总动能$E=\frac12FL$，$F$是墙受的平均力（average force），$L$是盒长；墙缓慢推进时$\dd E=-F\,\dd L$，得$FL^3$不变，正是一维的$pV^\gamma$不变，$\gamma=3$。

### 绝热线

在:term[$p$-$V$图]{id="physics.thermal-physics.pv-diagram"}（$p$-$V$ diagram）上，准静态的:term[绝热过程]{id="physics.thermal-physics.adiabatic-process"}也画成一条曲线。过同一个状态的:term[等温线]{id="physics.thermal-physics.isotherm"}（isotherm）和它，哪条更陡？

::anchor{id="def-adiabat"}
一定量的物质只做体积变化的功、经历准静态的绝热过程时，$p$-$V$图上各个:term[平衡态]{id="physics.thermal-physics.equilibrium-state"}连成的曲线叫作:term[绝热线]{id="physics.thermal-physics.adiabat"}（adiabat）。对$C_{V,\mathrm m}$不随:term[温度]{id="physics.thermal-physics.temperature"}变的:term[理想气体]{id="physics.thermal-physics.ideal-gas"}，绝热线是$pV^\gamma=$常数的图像，常数不同，绝热线就不同。

为什么这样定义：绝热线画出不吸热也不放热时压强怎样随体积变，和等温线一起能拼出许多:term[循环]{id="physics.thermal-physics.cyclic-process"}（cyclic process）。边界情况：叶轮慢慢搅拌绝热容器里的气体，体积不变，过程是准静态、绝热的，在$p$-$V$图上是一条竖直线段，却不是绝热线：叶轮也在对气体做功。

::anchor{id="thm-adiabat-steeper"}
定理：一定量的理想气体，$C_{V,\mathrm m}$不随温度变、只做体积变化的功时，在$p$-$V$图上过同一个状态$(V,p)$，等温线的斜率是$\dv pV=-\frac pV$，绝热线的斜率是$\dv pV=-\gamma\frac pV$，是等温线的$\gamma$倍，所以绝热线比等温线陡；沿绝热线，$\frac{\dd p}p=-\gamma\frac{\dd V}V$。

证明思路：等温线上$pV=nRT$不变，$p=\frac{nRT}V$，对$V$求导得$-\frac{nRT}{V^2}=-\frac pV$。绝热线上$pV^\gamma$不变，设它经过状态$(V_0,p_0)$，则$p=p_0V_0^\gamma V^{-\gamma}$，求导得$-\gamma p_0V_0^\gamma V^{-\gamma-1}=-\gamma\frac pV$；两边乘$\frac{\dd V}p$，就是最后那个式子。

为什么绝热线更陡：压缩时外界做的功使温度升高，由$p=\frac{nRT}V$，压强比等温时增大得更多；膨胀时温度降低，压强降得更快。$-V\dv pV$说明体积改变一个小的比例时压强改变多少，等温时是$p$，绝热时是$\gamma p$，[声波](lesson:physics.oscillations-waves.sound-waves)一节叫它体积模量（bulk modulus）。

### 绝热过程中的功

::anchor{id="thm-adiabatic-work"}
定理：一定量的:term[理想气体]{id="physics.thermal-physics.ideal-gas"}，$C_{V,\mathrm m}$不随:term[温度]{id="physics.thermal-physics.temperature"}变，经:term[绝热过程]{id="physics.thermal-physics.adiabatic-process"}从:term[平衡态]{id="physics.thermal-physics.equilibrium-state"}$(p_1,V_1,T_1)$变到平衡态$(p_2,V_2,T_2)$时，对外做的功$W=-\Delta U=nC_{V,\mathrm m}(T_1-T_2)$，也可以写成$W=\frac{p_1V_1-p_2V_2}{\gamma-1}$；过程不必是准静态的。

证明思路：$Q=0$，由:term[热力学第一定律]{id="physics.thermal-physics.first-law"}，$W=-\Delta U$。理想气体的:term[内能]{id="physics.thermal-physics.internal-energy"}只和温度有关，不管过程是不是准静态的，都有$\Delta U=nC_{V,\mathrm m}(T_2-T_1)$（见[热容与焓](lesson:physics.thermal-physics.heat-capacity#thm-cv)）；再由$nRT=pV$和$C_{V,\mathrm m}=\frac R{\gamma-1}$，$nC_{V,\mathrm m}T=\frac{pV}{\gamma-1}$。

从同一状态膨胀到同样的体积，绝热膨胀时温度跟着降低，对外做的功比:term[等温膨胀]{id="physics.thermal-physics.isothermal-process"}（isothermal expansion）少（见几何图像）。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0.3, 3], y: [0, 3] }
functions:
  - expr: "1/x"
    label: |
      等温线
  - expr: "x^(-g)"
    label: |
      绝热线
points:
  - { x: 1, y: 1 }
sliders:
  - name: g
    min: 1.05
    max: 1.8
    step: 0.01
    default: 1.4
    label: |
      比热容比$\gamma$
:::

横轴是$\frac V{V_0}$（图上写作 x），纵轴是$\frac p{p_0}$（图上写作 y），圆点是状态$(V_0,p_0)$，蓝线、橙线分别是过它的:term[等温线]{id="physics.thermal-physics.isotherm"}和:term[绝热线]{id="physics.thermal-physics.adiabat"}，滑块调:term[比热容比]{id="physics.thermal-physics.heat-capacity-ratio"}$\gamma$。圆点右边是膨胀，绝热线在下，曲线下的面积小，对外做的功少；左边是压缩，绝热线在上。$\gamma$越大，两条线分得越开，接近 1 时几乎重合。

## 例题

### 例 1　柴油机为什么不用火花塞

柴油机（diesel engine）的气缸吸进$300\,\mathrm K$、$1.0\times10^5\,\mathrm{Pa}$的空气，活塞很快地把它压缩到原来体积的$\frac1{15}$。把压缩当作准静态的:term[绝热过程]{id="physics.thermal-physics.adiabatic-process"}，空气当作:term[理想气体]{id="physics.thermal-physics.ideal-gas"}，:term[比热容比]{id="physics.thermal-physics.heat-capacity-ratio"}取$1.40$。压缩后空气的:term[温度]{id="physics.thermal-physics.temperature"}和压强各是多少？每摩尔空气，外界做了多少功？

**为什么想到这么做**：求温度用$TV^{\gamma-1}$不变，求压强用$pV^\gamma$不变；不吸热，外界做的功全部变成:term[内能]{id="physics.thermal-physics.internal-energy"}的增加。

**推导**：

$$
T_2=T_1\Bigl(\frac{V_1}{V_2}\Bigr)^{\gamma-1}=300\times15^{0.40}\,\mathrm K\approx886\,\mathrm K ,
$$

约$613\,^\circ\mathrm C$；

$$
p_2=p_1\Bigl(\frac{V_1}{V_2}\Bigr)^\gamma=1.0\times10^5\times15^{1.40}\,\mathrm{Pa}\approx4.4\times10^6\,\mathrm{Pa} .
$$

由:term[迈耶公式]{id="physics.thermal-physics.mayers-relation"}，$C_{V,\mathrm m}=\frac R{\gamma-1}\approx20.8\,\mathrm{J/(mol\cdot K)}$，每摩尔空气外界做的功是$C_{V,\mathrm m}(T_2-T_1)\approx20.8\times586\,\mathrm J\approx1.22\times10^4\,\mathrm J$。

压强变为原来的约 44 倍，而不是 15 倍：温度也变为原来的约 3 倍。这个温度远高于柴油自燃的温度，柴油喷进去就燃烧，所以柴油机不用火花塞（spark plug）。

## 常见误区

- 「绝热就是:term[温度]{id="physics.thermal-physics.temperature"}不变。」绝热只说没有:term[热量]{id="physics.thermal-physics.heat"}出入；对外做的总功不为零，:term[内能]{id="physics.thermal-physics.internal-energy"}就会改变，:term[理想气体]{id="physics.thermal-physics.ideal-gas"}的温度跟着变：准静态:term[绝热压缩]{id="physics.thermal-physics.adiabatic-process"}时升温，膨胀时降温。
- 「气体绝热膨胀后变冷了，说明它放出了热量。」绝热过程没有热量出入，变冷是因为对外做功花掉了内能。温度降低不等于放热，就像理想气体:term[等温膨胀]{id="physics.thermal-physics.isothermal-process"}时吸了热，温度却不变。

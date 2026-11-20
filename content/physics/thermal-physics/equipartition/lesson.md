---
id: physics.thermal-physics.equipartition
title: |
  能量均分定理
goal: |
  会用能量均分定理求理想气体的内能和摩尔热容。
prerequisites: [physics.thermal-physics.heat-capacity, physics.newtonian-mechanics.rotational-energy, physics.oscillations-waves.oscillation-energy]
minutes: 30
summary: |
  经典力学适用时，平衡态中每个平方项平均分到$\frac12\kB T$，理想气体$C_{V,\mathrm m}=\frac f2R$。
status: reviewed
---

## 这一节要回答的问题

实测表明，单原子分子（monatomic molecule）氦、氩的:term[定容摩尔热容]{id="physics.thermal-physics.constant-volume-heat-capacity"}（molar heat capacity at constant volume）是$\frac32R$，双原子分子（diatomic molecule）氮、氧约是$\frac52R$；铁、铝、铅等固体的:term[摩尔热容]{id="physics.thermal-physics.molar-heat-capacity"}（molar heat capacity）都接近$3R$。这些数从哪里来？

## 讲解

### 自由度与平方项

氦原子可以看成质点，只能平动；氮分子像哑铃，还能绕垂直于键的轴转动、沿键振动。同温下两者的:term[平均平动动能]{id="physics.thermal-physics.mean-translational-kinetic-energy"}（mean translational kinetic energy）一样（见[气体动理论](lesson:physics.thermal-physics.kinetic-theory#thm-temperature-ke)），氮多吸的热只能存进转动和振动里。

::anchor{id="def-dof"}
确定一个分子里所有原子的位置所需的独立坐标的个数，叫作分子的:term[自由度]{id="physics.thermal-physics.degrees-of-freedom"}（degrees of freedom）。确定质心（center of mass）位置的 3 个是平动自由度（translational degrees of freedom），确定朝向的是转动自由度（rotational degrees of freedom），其余的是振动自由度（vibrational degrees of freedom）；原子间距离都不变的分子叫作刚性分子（rigid molecule），没有振动自由度。

为什么这样定义：每个独立坐标对应一种运动方式，能量在这些方式之间分配。$N\ge2$个原子、间距都能变的分子有$3N$个自由度：平动 3 个，转动 3 个（原子共线时 2 个），其余是振动。

边界情况：刚性双原子分子有$6-1=5$个自由度，和[约束与广义坐标](lesson:physics.analytical-mechanics.constraints#def-dof)按$3N-k$数的一致；原子当作质点时，绕键轴本身的转动不改变它们的位置，不算。

设双原子分子的两个原子质量都是$m$，核间距是$d$，$\vb n$是沿键的单位向量（unit vector）。两个原子的速度是$\vb v_{\mathrm C}\pm\frac d2\dot{\vb n}$（$\vb v_{\mathrm C}$是质心的速度），动能（kinetic energy）相加时交叉项抵消，剩下质心平动的动能和转动动能（rotational kinetic energy）$\frac12I\omega^2$（见[转动动能与平行轴定理](lesson:physics.newtonian-mechanics.rotational-energy#thm-rotational-ke)），$I=2m\bigl(\frac d2\bigr)^2$，角速度（angular velocity）$\omega=|\dot{\vb n}|$；$\dot{\vb n}$垂直于键（$\vb n\cdot\dot{\vb n}=0$），只有两个分量，$\omega^2=\omega_1^2+\omega_2^2$。键长变成$d+x$时（略去它对$I$的影响），动能多出$2\times\frac12m\bigl(\frac{\dot x}2\bigr)^2=\frac12\cdot\frac m2\dot x^2$，势能近似是$\frac12kx^2$（见[简谐运动的能量与小振动](lesson:physics.oscillations-waves.oscillation-energy#thm-small-oscillation)），$k$是键的劲度系数（spring constant），不是:term[玻尔兹曼常量]{id="physics.thermal-physics.boltzmann-constant"}（Boltzmann constant）$\kB$。

所以一个双原子分子的能量是

$$
\begin{aligned}
\varepsilon={}&\tfrac12(2m)v_{\mathrm Cx}^2+\tfrac12(2m)v_{\mathrm Cy}^2+\tfrac12(2m)v_{\mathrm Cz}^2\\
&+\tfrac12I\omega_1^2+\tfrac12I\omega_2^2+\tfrac12\cdot\tfrac m2\dot x^2+\tfrac12kx^2 .
\end{aligned}
$$

::anchor{id="def-quadratic-term"}
分子能量中等于常数乘某个速度（或角速度）分量的平方、或乘某个从平衡位置量起的坐标的平方的项，叫作平方项（quadratic term）；一个分子能量中平方项的个数记作$f$，上式中$f=7$。

为什么另数平方项：下面的定理按平方项分能量；振动的每个自由度有动能、势能两个平方项，平动、转动的只有一个。本节的$f$不是频率。

边界情况：重力势能（gravitational potential energy）$mgz$是坐标的一次式（第 8 题）；振幅大了，势能里的三次、四次项不能略去，振动的能量也不全是平方项。

### 能量均分定理

::anchor{id="thm-equipartition"}
定理（:term[能量均分定理]{id="physics.thermal-physics.equipartition-theorem"}，equipartition theorem）：各种运动之间能充分交换能量、经典力学（classical mechanics）适用时，:term[温度]{id="physics.thermal-physics.temperature"}（temperature）为$T$的:term[平衡态]{id="physics.thermal-physics.equilibrium-state"}（equilibrium state）中，分子能量里的每一个平方项对所有分子的平均值都是$\frac12\kB T$；一个分子有$f$个平方项时，平均能量是$\frac f2\kB T$。

证明思路：平动的三项各分到$\frac12\kB T$（[气体动理论](lesson:physics.thermal-physics.kinetic-theory#thm-temperature-ke)里的$\frac32\kB T$按三个方向平分）。分子不停地碰撞，哪个平方项平均分得多，能量就从它那里流走，平衡时谁也不比谁多。为什么平方项各分到$\frac12\kB T$、一次项却分到$\kB T$（第 8 题），见[玻尔兹曼分布与配分函数](lesson:physics.thermal-physics.boltzmann-distribution)。

各种运动之间交换能量很慢时，能量迟迟不均分（第 7 题）。按量子力学，转动、振动的能量一份一份地变，$\kB T$比一份小得多时，这种运动几乎被冻住（见[爱因斯坦固体与热容](lesson:physics.thermal-physics.einstein-solid)）。

### 理想气体的摩尔热容

:term[理想气体]{id="physics.thermal-physics.ideal-gas"}（ideal gas）的:term[内能]{id="physics.thermal-physics.internal-energy"}（internal energy）是所有分子的平动、转动、振动能量之和，振动的势能在分子内部，也算在内。由:term[能量均分定理]{id="physics.thermal-physics.equipartition-theorem"}，$U=\frac f2N\kB T=\frac f2nRT$；$f$不随:term[温度]{id="physics.thermal-physics.temperature"}变时$U$和$T$成正比，由[热容与焓](lesson:physics.thermal-physics.heat-capacity#thm-cv)里的定理，$C_V=\dv UT=\frac f2nR$，于是

$$
C_{V,\mathrm m}=\frac f2R,\qquad C_{p,\mathrm m}=C_{V,\mathrm m}+R=\frac{f+2}2R,\qquad\gamma=\frac{f+2}f ,
$$

第二式用了:term[迈耶公式]{id="physics.thermal-physics.mayers-relation"}（Mayer's relation），$\gamma$是:term[比热容比]{id="physics.thermal-physics.heat-capacity-ratio"}（heat capacity ratio）。

单原子分子只有平动，$f=3$，$C_{V,\mathrm m}=\frac32R$。刚性双原子分子$f=5$，$\gamma=\frac75=1.40$：氮、氧比氦、氩多出的$R$正是两个转动平方项分到的；空气主要是氮和氧，[绝热过程](lesson:physics.thermal-physics.adiabatic-processes)当实验值用的$\gamma\approx1.40$由此而来。

算上振动，$f=7$，$C_{V,\mathrm m}=\frac72R$；可室温下氮、氧的$C_{V,\mathrm m}$接近$\frac52R$，振动的一份能量比$\kB T$大得多，几乎被冻住了。氢气冷到几十开尔文以下，$C_{V,\mathrm m}$降到约$\frac32R$，连转动也冻住了。

### 固体和液体

::anchor{id="thm-dulong-petit"}
定理（杜隆-珀蒂定律，Dulong–Petit law）：:term[温度]{id="physics.thermal-physics.temperature"}足够高时，由一种原子组成的固体，:term[摩尔热容]{id="physics.thermal-physics.molar-heat-capacity"}约为$3R\approx24.9\,\mathrm{J/(mol\cdot K)}$。

证明思路：每个原子在平衡位置附近朝三个方向近似做简谐运动（simple harmonic motion），共 6 个平方项，由:term[能量均分定理]{id="physics.thermal-physics.equipartition-theorem"}平均能量是$3\kB T$，$C_{V,\mathrm m}=3R$；固体受热时体积变化很小，定压、定容两种摩尔热容差得很少。边界情况：金刚石室温下只有约$6.1\,\mathrm{J/(mol\cdot K)}$，碳原子轻、键又硬，振动几乎被冻住。

分子间的力再复杂，一个分子质心的动能也总是三个平方项。所以温度不太低时，液体、固体里分子的:term[平均平动动能]{id="physics.thermal-physics.mean-translational-kinetic-energy"}也是$\frac32\kB T$，热茶里的分子平均比冷茶里的快（[质能关系](lesson:physics.special-relativity.mass-energy)第 8 题）。

## 几何图像

![三幅图画同一个双原子分子，两个圆球表示两个原子。左图，平动：分子的质心可以朝 x、y、z 三个互相垂直的方向运动，z 轴画成斜向右下的线，表示垂直于纸面的方向，有 3 个平方项；中图，转动：分子可以绕两根互相垂直、又都垂直于键的轴转动，竖直的一根在纸面内，斜的一根和左图的 z 轴平行、垂直于纸面，弧形箭头表示转向，记作 ω₁、ω₂，有 2 个平方项；沿键的虚线是键轴，绕它的转动不计；右图，振动：两个原子之间像连着一根弹簧，沿键反向来回振动，动能和势能各一个平方项，共 2 个。最下面一行写着刚性分子 f = 3 + 2 = 5，算上振动 f = 3 + 2 + 2 = 7。示意图，箭头只表示方向](diatomic.svg)

左起是平动、转动、振动：平动有三个速度分量，转动只有绕两根垂直于键的轴的两种，振动有动能、势能。刚性分子$f=3+2=5$，算上振动$f=7$。

## 例题

### 例 1　二氧化碳的摩尔热容

二氧化碳分子 O=C=O 的三个原子排成一条直线。振动全部算上时，按:term[能量均分定理]{id="physics.thermal-physics.equipartition-theorem"}它的:term[定容摩尔热容]{id="physics.thermal-physics.constant-volume-heat-capacity"}是多少？和[热容与焓](lesson:physics.thermal-physics.heat-capacity)里的实测值$28.8\,\mathrm{J/(mol\cdot K)}$比，说明了什么？

**为什么想到这么做**：先数:term[自由度]{id="physics.thermal-physics.degrees-of-freedom"}，再按平动、转动各一个、振动两个数出平方项$f$，代入$C_{V,\mathrm m}=\frac f2R$。

**推导**：3 个原子共有 9 个自由度：平动 3 个；排成一条直线，转动 2 个；振动$9-3-2=4$个，是沿轴的两种伸缩振动（stretching vibration）和垂直于轴的两种弯曲振动（bending vibration）。所以$f=3+2+2\times4=13$，$C_{V,\mathrm m}=\frac{13}2R\approx54.0\,\mathrm{J/(mol\cdot K)}$。

实测的$28.8$介于刚性分子的$\frac52R\approx20.8$和$54.0$之间，振动只分到一部分能量。按量子力学算，室温下两种弯曲振动对:term[摩尔热容]{id="physics.thermal-physics.molar-heat-capacity"}的贡献各约是充分激发时的一半（约$0.45R$），两种伸缩振动几乎被冻住。

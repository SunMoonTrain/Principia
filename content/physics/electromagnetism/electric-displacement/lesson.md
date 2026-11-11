---
id: physics.electromagnetism.electric-displacement
title: |
  电位移与线性电介质
goal: |
  会用电位移$\vb{D}$和高斯定律处理有电介质的问题，并求填充电介质后的电容。
prerequisites: [physics.electromagnetism.polarization, physics.electromagnetism.capacitors]
minutes: 30
summary: |
  电位移的散度只由自由电荷决定；线性电介质里$\vb D=\varepsilon\vb E$。
status: reviewed
---

## 这一节要回答的问题

有:term[电介质]{id="physics.electromagnetism.dielectric"}（dielectric）时，:term[高斯定律]{id="physics.electromagnetism.gauss-law"}（Gauss's law）右边的:term[电荷]{id="physics.electromagnetism.electric-charge"}（electric charge）包括:term[束缚电荷]{id="physics.electromagnetism.bound-charge"}（bound charge），可束缚电荷由:term[电场]{id="physics.electromagnetism.electric-field"}（electric field）决定，事先不知道。能不能把束缚电荷「藏」起来，只用我们放上去的:term[自由电荷]{id="physics.electromagnetism.free-charge"}（free charge）写高斯定律？:term[电容器]{id="physics.electromagnetism.capacitor"}（capacitor）的两板之间填满电介质，:term[电容]{id="physics.electromagnetism.capacitance"}（capacitance）变成多少？

## 讲解

### 电位移

:term[电介质]{id="physics.electromagnetism.dielectric"}里的:term[电荷]{id="physics.electromagnetism.electric-charge"}分成:term[自由电荷]{id="physics.electromagnetism.free-charge"}$\rho_{\mathrm f}$和:term[束缚电荷]{id="physics.electromagnetism.bound-charge"}$\rho_{\mathrm b}=-\divg\vb P$，$\vb P$是:term[极化强度]{id="physics.electromagnetism.polarization"}（polarization density）。[高斯定律的微分形式](lesson:physics.electromagnetism.gauss-differential)说$\varepsilon_0\divg\vb E=\rho_{\mathrm f}+\rho_{\mathrm b}=\rho_{\mathrm f}-\divg\vb P$，把含$\vb P$的一项移到左边，$\divg(\varepsilon_0\vb E+\vb P)=\rho_{\mathrm f}$。

::anchor{id="def-displacement"}
$\vb D=\varepsilon_0\vb E+\vb P$叫作:term[电位移]{id="physics.electromagnetism.electric-displacement"}（electric displacement），单位是$\mathrm{C/m^2}$。

为什么这样定义：它的散度只由:term[自由电荷]{id="physics.electromagnetism.free-charge"}决定，而自由电荷是我们放上去、能控制的；束缚电荷的影响被吸收进了$\vb D$。边界情况：真空里$\vb P=\vb 0$，$\vb D=\varepsilon_0\vb E$。「位移」是麦克斯韦（James Clerk Maxwell）留下的名字，当时设想:term[电场]{id="physics.electromagnetism.electric-field"}让介质里的电荷发生位移；$\vb D$是一个场，不是某个东西挪动的距离。

::anchor{id="thm-gauss-d"}
定理（有电介质时的:term[高斯定律]{id="physics.electromagnetism.gauss-law"}）：$\divg\vb D=\rho_{\mathrm f}$；积分形式是$\oint_S\vb D\cdot\dd\vb a=Q_{\mathrm f,\text{内}}$，右边是闭合曲面$S$里的自由电荷。

证明思路：微分形式是上一段的推导。对任意区域积分，用散度定理就得到积分形式。

要小心：$\divg\vb D$只由自由电荷决定，$\vb D$本身却不一定：$\curl\vb D=\curl\vb P$，一般不为零（p7）。只有在对称性足够好时（平面、球、圆柱），才能像以前用高斯定律求电场那样，由自由电荷直接求出$\vb D$。

### 线性电介质

::anchor{id="def-linear-dielectric"}
很多:term[电介质]{id="physics.electromagnetism.dielectric"}里，:term[电场]{id="physics.electromagnetism.electric-field"}不太强时:term[极化强度]{id="physics.electromagnetism.polarization"}和电场成正比，$\vb P=\varepsilon_0\chi_{\mathrm e}\vb E$，这样的电介质叫作:term[线性电介质]{id="physics.electromagnetism.linear-dielectric"}（linear dielectric），无量纲的比例系数$\chi_{\mathrm e}$叫作:term[电极化率]{id="physics.electromagnetism.electric-susceptibility"}（electric susceptibility）。

为什么这样定义：每个分子的:term[电偶极矩]{id="physics.electromagnetism.dipole-moment"}（electric dipole moment）和电场成正比，比例系数是分子的:term[极化率]{id="physics.electromagnetism.polarizability"}（polarizability，见[电介质与极化](lesson:physics.electromagnetism.polarization)），单位体积的总和也就和电场成正比，$\chi_{\mathrm e}$把这个比例写成了和单个分子无关的宏观量。边界情况：$\chi_{\mathrm e}$还可以和方向有关（晶体），电场很强时$\vb P$和$\vb E$不再成正比，这一节都不讨论。

::anchor{id="def-permittivity"}
线性电介质里$\vb D=\varepsilon_0(1+\chi_{\mathrm e})\vb E=\varepsilon\vb E$，$\varepsilon=\varepsilon_0(1+\chi_{\mathrm e})$叫作这种电介质的介电常量（permittivity），$\varepsilon_{\mathrm r}=1+\chi_{\mathrm e}=\frac{\varepsilon}{\varepsilon_0}$叫作:term[相对介电常量]{id="physics.electromagnetism.relative-permittivity"}（relative permittivity）。

为什么这样定义：真空里$\varepsilon_{\mathrm r}=1$，$\varepsilon$就是[电荷与库仑定律](lesson:physics.electromagnetism.coulomb-law)里的$\varepsilon_0$；电介质里把$\varepsilon_0$换成$\varepsilon$，很多公式形式不变。边界情况：$\varepsilon_{\mathrm r}$总不小于$1$；室温下水的相对介电常量约为$80$，空气只比$1$大万分之几。法拉第（Michael Faraday）在 1837 年用两个同心金属球之间填进不同物质的办法测过这个比值，他叫它「比感应容量」（specific inductive capacity），例如虫胶（shellac）约为空气的两倍。

::anchor{id="thm-filled-capacitor"}
定理（填满电介质的:term[电容器]{id="physics.electromagnetism.capacitor"}）：:term[电容器]{id="physics.electromagnetism.capacitor"}两极板（plate）之间的空间填满相对介电常量为$\varepsilon_{\mathrm r}$的线性电介质，:term[电容]{id="physics.electromagnetism.capacitance"}变成原来的$\varepsilon_{\mathrm r}$倍，$C=\varepsilon_{\mathrm r}C_0$。

证明思路：以平行板电容器为例，极板上的:term[自由电荷]{id="physics.electromagnetism.free-charge"}面密度是$\sigma_{\mathrm f}$，取跨过极板的扁圆柱面作:term[高斯面]{id="physics.electromagnetism.gaussian-surface"}（Gaussian surface），$D=\sigma_{\mathrm f}$，和有没有电介质无关。$E=\frac D\varepsilon=\frac{\sigma_{\mathrm f}}{\varepsilon_{\mathrm r}\varepsilon_0}$，同样的:term[电荷]{id="physics.electromagnetism.electric-charge"}，电场和:term[电势差]{id="physics.electromagnetism.potential-difference"}（potential difference）都变成原来的$\frac{1}{\varepsilon_{\mathrm r}}$，所以电容是$\varepsilon_{\mathrm r}$倍。球形、圆柱形电容器同理，只要电介质填满有电场的地方。

电场变弱，是因为紧贴极板的电介质表面出现了异号的:term[束缚电荷]{id="physics.electromagnetism.bound-charge"}$\sigma_{\mathrm b}=-P=-\frac{\varepsilon_{\mathrm r}-1}{\varepsilon_{\mathrm r}}\sigma_{\mathrm f}$，把极板上的电荷抵消掉一部分，净剩$\frac{\sigma_{\mathrm f}}{\varepsilon_{\mathrm r}}$。

### 界面上的条件

两种:term[电介质]{id="physics.electromagnetism.dielectric"}的交界面上没有:term[自由电荷]{id="physics.electromagnetism.free-charge"}时，$\vb D$和$\vb E$各满足一个连接条件。

::anchor{id="thm-boundary"}
定理（电介质界面上的条件）：界面上没有自由电荷时，$\vb D$垂直于界面的分量连续，$\vb E$平行于界面的分量连续。

证明思路：取跨过界面的扁圆柱面作:term[高斯面]{id="physics.electromagnetism.gaussian-surface"}，两个底面紧贴界面，由$\oint\vb D\cdot\dd\vb a=0$得两侧$D$的法向分量相等。取跨过界面的扁矩形回路，两条长边紧贴界面，:term[静电场]{id="physics.electromagnetism.electric-field"}沿闭合曲线的积分为零（见[电势](lesson:physics.electromagnetism.electric-potential#thm-conservative)），得两侧$E$的切向分量相等。

两个条件合起来，:term[电场线]{id="physics.electromagnetism.field-line"}（electric field line）穿过界面时会改变方向（p5）。界面上的:term[束缚电荷]{id="physics.electromagnetism.bound-charge"}就在这里：$\vb D$的法向分量连续，可$\varepsilon$不同，$\vb E$的法向分量跳了，跳的那一份正是束缚电荷的贡献。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 3], y: [0, 1.3] }
functions:
  - expr: "1 - (1 + sign(x - 1))/2 * (1 - sign(x - 2))/2 * (1 - 1/k)"
    label: |
      电场$E$
  - expr: "1"
    label: |
      电位移$\frac{D}{\varepsilon_0}$
sliders:
  - name: k
    min: 1
    max: 5
    step: 0.5
    default: 2
    label: |
      相对介电常量$\varepsilon_{\mathrm r}$
:::

动画画的是:term[平行板电容器]{id="physics.electromagnetism.capacitor"}两极板之间（$0<x<3$，图上写作$x$）的:term[电场]{id="physics.electromagnetism.electric-field"}和:term[电位移]{id="physics.electromagnetism.electric-displacement"}，中间$1<x<2$是一块:term[相对介电常量]{id="physics.electromagnetism.relative-permittivity"}为$\varepsilon_{\mathrm r}$的:term[电介质]{id="physics.electromagnetism.dielectric"}板，纵轴以真空里的电场$\frac{\sigma_{\mathrm f}}{\varepsilon_0}$为单位。$\vb D$垂直于板面，只由极板上的:term[自由电荷]{id="physics.electromagnetism.free-charge"}决定，处处相同；电场在电介质板里变成$\frac{1}{\varepsilon_{\mathrm r}}$，在两个表面上跳变。$\varepsilon_{\mathrm r}=1$时电介质板和真空一样。

## 例题

### 例 1　电介质里的点电荷

:term[点电荷]{id="physics.electromagnetism.point-charge"}（point charge）$q$放在无限大的:term[线性电介质]{id="physics.electromagnetism.linear-dielectric"}里，:term[相对介电常量]{id="physics.electromagnetism.relative-permittivity"}为$\varepsilon_{\mathrm r}$。求它周围的$\vb D$、$\vb E$，以及紧贴点电荷的:term[电介质]{id="physics.electromagnetism.dielectric"}里出现的:term[束缚电荷]{id="physics.electromagnetism.bound-charge"}总量。

**为什么想到这么做**：:term[电荷]{id="physics.electromagnetism.electric-charge"}分布球对称，用有电介质时的:term[高斯定律]{id="physics.electromagnetism.gauss-law"}，只要:term[自由电荷]{id="physics.electromagnetism.free-charge"}就能求出$\vb D$；再由$\vb D=\varepsilon\vb E$求:term[电场]{id="physics.electromagnetism.electric-field"}。

**推导**：取以$q$为中心的球面，$D\cdot4\pi r^2=q$，$\vb D=\frac{q}{4\pi r^2}\uv r$，$\vb E=\frac{q}{4\pi\varepsilon r^2}\uv r=\frac{1}{4\pi\varepsilon_0}\frac{q/\varepsilon_{\mathrm r}}{r^2}\uv r$，像一个电荷为$\frac{q}{\varepsilon_{\mathrm r}}$的点电荷。所以$q$周围紧贴着一层束缚电荷，总量是$\frac{q}{\varepsilon_{\mathrm r}}-q=-\frac{\varepsilon_{\mathrm r}-1}{\varepsilon_{\mathrm r}}q$，和$q$异号。

### 例 2　部分填充的平行板电容器

:term[平行板电容器]{id="physics.electromagnetism.capacitor"}的极板面积为$A$、间隔为$d$，平行地塞进一块厚$t<d$、:term[相对介电常量]{id="physics.electromagnetism.relative-permittivity"}为$\varepsilon_{\mathrm r}$的:term[电介质]{id="physics.electromagnetism.dielectric"}板，面积也是$A$。求:term[电容]{id="physics.electromagnetism.capacitance"}。

**为什么想到这么做**：$\vb D$垂直于板面，由极板上的:term[自由电荷]{id="physics.electromagnetism.free-charge"}决定，在真空和电介质里都是$\sigma_{\mathrm f}$；两部分的:term[电场]{id="physics.electromagnetism.electric-field"}不同，:term[电势差]{id="physics.electromagnetism.potential-difference"}分段相加。

**推导**：真空部分$E=\frac{\sigma_{\mathrm f}}{\varepsilon_0}$，电介质里$E=\frac{\sigma_{\mathrm f}}{\varepsilon_{\mathrm r}\varepsilon_0}$，$\Delta\varphi=\frac{\sigma_{\mathrm f}}{\varepsilon_0}\Bigl(d-t+\frac{t}{\varepsilon_{\mathrm r}}\Bigr)$。所以$C=\frac{Q}{\Delta\varphi}=\frac{\varepsilon_0A}{d-t+t/\varepsilon_{\mathrm r}}$。$t=d$时回到$\varepsilon_{\mathrm r}C_0$，$t=0$时是$C_0$；它也等于两个电容器串联的结果。

## 常见误区

- 「:term[电位移]{id="physics.electromagnetism.electric-displacement"}只由:term[自由电荷]{id="physics.electromagnetism.free-charge"}决定。」只有它的散度是；它的旋度等于$\curl\vb P$，一般不为零。
- 「:term[电介质]{id="physics.electromagnetism.dielectric"}里的:term[电场]{id="physics.electromagnetism.electric-field"}总是外面的$\frac{1}{\varepsilon_{\mathrm r}}$。」电介质填满有电场的地方，或者垂直于电场的板，才是这样；平行于电场的电介质板里，电场的切向分量连续，不变弱。
- 「$\varepsilon_{\mathrm r}$越大，:term[电容器]{id="physics.electromagnetism.capacitor"}储存的能量越多。」带电量不变时，$U=\frac{Q^2}{2C}$反而变小；接在电源上:term[电势差]{id="physics.electromagnetism.potential-difference"}不变时，$U=\frac12C(\Delta\varphi)^2$才变大。
- 「:term[相对介电常量]{id="physics.electromagnetism.relative-permittivity"}可以小于 1。」静电场里，电介质的极化总是顺着电场，$\chi_{\mathrm e}>0$，$\varepsilon_{\mathrm r}>1$。

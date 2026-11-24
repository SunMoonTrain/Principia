---
id: physics.thermal-physics.carnot-theorem
title: |
  卡诺定理与热力学温标
goal: |
  会用热力学第二定律证明卡诺定理，并用可逆热机定义与工作物质无关的热力学温标。
prerequisites: [physics.thermal-physics.second-law]
minutes: 30
summary: |
  同两个热库间可逆热机的热机效率相同且最高，由它定热力学温标。
status: reviewed
---

## 这一节要回答的问题

[热机与卡诺循环](lesson:physics.thermal-physics.heat-engines)只对:term[理想气体]{id="physics.thermal-physics.ideal-gas"}（ideal gas）算出了:term[卡诺热机]{id="physics.thermal-physics.carnot-engine"}（Carnot engine）的:term[热机效率]{id="physics.thermal-physics.thermal-efficiency"}（thermal efficiency）$1-\frac{T_{\mathrm L}}{T_{\mathrm H}}$。换成水和水蒸气当:term[工作物质]{id="physics.thermal-physics.working-substance"}（working substance），结果会变吗？有没有:term[热机]{id="physics.thermal-physics.heat-engine"}（heat engine）比它更好？:term[温度]{id="physics.thermal-physics.temperature"}（temperature）能不能不靠任何一种物质来定义？

## 讲解

### 卡诺定理

两台没有摩擦（friction）的:term[卡诺热机]{id="physics.thermal-physics.carnot-engine"}工作在同样两个:term[热库]{id="physics.thermal-physics.heat-reservoir"}（heat reservoir）之间，甲用水和水蒸气当:term[工作物质]{id="physics.thermal-physics.working-substance"}，乙用:term[理想气体]{id="physics.thermal-physics.ideal-gas"}，乙的:term[热机效率]{id="physics.thermal-physics.thermal-efficiency"}是$1-\frac{T_{\mathrm L}}{T_{\mathrm H}}$。甲的会更高吗？要是更高，把乙倒过来当:term[制冷机]{id="physics.thermal-physics.refrigerator"}（refrigerator），用甲做的功带动它试试。

::anchor{id="thm-carnot"}
定理（:term[卡诺定理]{id="physics.thermal-physics.carnot-theorem"}，Carnot's theorem）：只和同样两个热库交换:term[热量]{id="physics.thermal-physics.heat"}（heat）的:term[热机]{id="physics.thermal-physics.heat-engine"}里，任何热机的热机效率都不超过:term[可逆热机]{id="physics.thermal-physics.reversible-engine"}（reversible engine）；可逆热机的热机效率都相同，和工作物质无关。

证明思路：设甲是任意一台热机，乙是可逆热机，调整乙里工作物质的多少，使两台每个:term[循环]{id="physics.thermal-physics.cyclic-process"}（cyclic process）对外做的功都是$W$。假如$\eta_{\text{甲}}>\eta_{\text{乙}}$，就把乙倒过来当制冷机，由甲做的功带动（几何图像左图）。甲从高温热库吸热$\frac W{\eta_{\text{甲}}}$，乙向它放热$\frac W{\eta_{\text{乙}}}$，后者更多；合起来外界（surroundings）不做功，高温热库净得到热量，低温热库失去同样多，违反:term[克劳修斯表述]{id="physics.thermal-physics.clausius-statement"}（Clausius statement，见[热力学第二定律](lesson:physics.thermal-physics.second-law#thm-clausius)）。

所以$\eta_{\text{甲}}\le\eta_{\text{乙}}$。甲也可逆时，互换两者的角色，又得$\eta_{\text{乙}}\le\eta_{\text{甲}}$，两者相等。

[热机与卡诺循环](lesson:physics.thermal-physics.heat-engines#thm-carnot-efficiency)那条定理里的卡诺热机没有摩擦时是可逆热机，所以同样两个热库之间的可逆热机都和它一样，$\frac{Q_{\mathrm L}}{Q_{\mathrm H}}=\frac{T_{\mathrm L}}{T_{\mathrm H}}$（$Q_{\mathrm H}$、$Q_{\mathrm L}$取正值），热机效率是$1-\frac{T_{\mathrm L}}{T_{\mathrm H}}$；这里的$T$暂时是:term[理想气体温标]{id="physics.thermal-physics.ideal-gas-temperature-scale"}（ideal-gas temperature scale）给出的:term[温度]{id="physics.thermal-physics.temperature"}。不管工作物质是什么，在这两个热库之间工作的热机都不会超过它。

可逆热机倒过来就是制冷机，各段的热量和功只改变正负，$\frac{Q_{\mathrm L}}{Q_{\mathrm H}}$不变，所以没有摩擦的:term[卡诺制冷机]{id="physics.thermal-physics.carnot-refrigerator"}（Carnot refrigerator）的:term[制冷系数]{id="physics.thermal-physics.coefficient-of-performance"}（coefficient of performance）$\frac{T_{\mathrm L}}{T_{\mathrm H}-T_{\mathrm L}}$也和工作物质无关。[热机与卡诺循环](lesson:physics.thermal-physics.heat-engines)里两处「以后会证明」的热机效率、制冷系数和第 8 题题干里的预告，到这里都证完了；那一节第 6 题换成任何可逆热机，结论也成立。

### 热力学温标

[温度与热平衡](lesson:physics.thermal-physics.temperature#def-ideal-gas-scale)的:term[理想气体温标]{id="physics.thermal-physics.ideal-gas-temperature-scale"}离不开气体，几开尔文以下几乎所有物质都凝结了，它就用不上。:term[卡诺定理]{id="physics.thermal-physics.carnot-theorem"}给了另一条路：:term[可逆热机]{id="physics.thermal-physics.reversible-engine"}的$\frac{Q_{\mathrm L}}{Q_{\mathrm H}}$和:term[工作物质]{id="physics.thermal-physics.working-substance"}无关；可逆传热只看:term[温度]{id="physics.thermal-physics.temperature"}，温度相同的:term[热库]{id="physics.thermal-physics.heat-reservoir"}可以互换，所以比值只由两个热库的温度决定。用某一支温度计的读数$\theta$标记热库（即那一节第 6 题的$\theta$，不必是:term[气体温度计]{id="physics.thermal-physics.gas-thermometer"}（gas thermometer）的$T^*$），这个比值就只是$\theta_{\mathrm H}$、$\theta_{\mathrm L}$的函数。

再取一个参考热库（reference reservoir），读数为$\theta_0$。一台可逆热机工作在$\theta_{\mathrm H}$和$\theta_0$之间，另一台工作在$\theta_0$和$\theta_{\mathrm L}$之间，调好大小，让两台和参考热库交换的:term[热量]{id="physics.thermal-physics.heat"}都是$Q_0$，一进一出正好抵消（几何图像右图）；$\theta_0$不在两者之间时，其中一台倒过来当:term[制冷机]{id="physics.thermal-physics.refrigerator"}。参考热库没有净变化，两台合起来就是$\theta_{\mathrm H}$、$\theta_{\mathrm L}$之间的一台可逆热机，所以

$$
\frac{Q_{\mathrm L}}{Q_{\mathrm H}}=\frac{Q_{\mathrm L}}{Q_0}\cdot\frac{Q_0}{Q_{\mathrm H}} .
$$

记$\varphi(\theta)$为工作在$\theta$和$\theta_0$之间的可逆热机在$\theta$处、在$\theta_0$处交换的热量之比（$\varphi(\theta_0)=1$），上式右边就是$\frac{\varphi(\theta_{\mathrm L})}{\varphi(\theta_{\mathrm H})}$，两个因子各只依赖一个热库。

::anchor{id="def-thermodynamic-scale"}
规定任意两个热库的温度之比$\frac{T_{\mathrm L}}{T_{\mathrm H}}=\frac{Q_{\mathrm L}}{Q_{\mathrm H}}$，$Q_{\mathrm H}$、$Q_{\mathrm L}$是一台可逆热机在两者之间吸、放的热量，也就是让$T$和上面的$\varphi(\theta)$成正比。这样规定温度的办法叫作:term[热力学温标]{id="physics.thermal-physics.thermodynamic-temperature-scale"}（thermodynamic temperature scale），也叫开尔文温标（Kelvin scale）、绝对温标（absolute temperature scale）。

为什么这样定义：它只量热量，不靠哪一种物质的性质，[温度与热平衡](lesson:physics.thermal-physics.temperature)说的「和物质无关的定义」就是它；取正比，是为了和理想气体温标一致（见下一段）。边界情况：它只定下温度之比，单位还得另选；历史上规定水的:term[三相点]{id="physics.thermal-physics.triple-point"}（triple point）是$273.16\,\mathrm K$，2019 年起改为规定:term[玻尔兹曼常量]{id="physics.thermal-physics.boltzmann-constant"}（Boltzmann constant）的数值，三相点仍约是$273.16\,\mathrm K$。

在气体温度计能用的范围里，以:term[理想气体]{id="physics.thermal-physics.ideal-gas"}为工作物质、没有摩擦的:term[卡诺热机]{id="physics.thermal-physics.carnot-engine"}，$\frac{Q_{\mathrm L}}{Q_{\mathrm H}}$等于理想气体温标的读数之比，三相点又都取$273.16\,\mathrm K$，所以两者在这个范围里一致。[温度与热平衡](lesson:physics.thermal-physics.temperature#def-thermodynamic-temperature)由理想气体温标给出的:term[热力学温度]{id="physics.thermal-physics.thermodynamic-temperature"}（thermodynamic temperature），正是这里的$T$在那个范围里的值；那一节第 5 题（3）说「以热力学温度为准」，准的就是这里的定义，以后说的热力学温度也都按它，不限于那个范围。

## 几何图像

![左右两幅图，箭头长短不按比例。左图的标题是甲带动倒过来的乙：上方是高温热库，下方是低温热库，中间一个虚线框里有两个圆，左边的是热机甲，右边的是倒过来运行的可逆热机乙。蓝色箭头 W/η甲 从高温热库进入甲，蓝色箭头 W/η甲 − W 从甲进入低温热库，绿色箭头 W 从甲流向乙；蓝色箭头 W/η乙 − W 从低温热库进入乙，蓝色箭头 W/η乙 从乙进入高温热库。右图的标题是两台可逆热机接成一台：从上到下是高温热库 θH、参考热库 θ0、低温热库 θL，参考热库旁注没有净变化。上面的热机从 θH 吸热 QH、向参考热库放热 Q0，下面的热机从参考热库吸热 Q0、向 θL 放热 QL，两台各有一个绿色箭头向右，表示对外做的功](carnot-proof.svg)

左图证明:term[卡诺定理]{id="physics.thermal-physics.carnot-theorem"}：:term[可逆热机]{id="physics.thermal-physics.reversible-engine"}乙倒过来当:term[制冷机]{id="physics.thermal-physics.refrigerator"}，由甲带动；甲的:term[热机效率]{id="physics.thermal-physics.thermal-efficiency"}要是更高，合起来就只把:term[热量]{id="physics.thermal-physics.heat"}从:term[低温热库]{id="physics.thermal-physics.heat-reservoir"}送到高温热库。右图：两台可逆热机经参考热库接成一台。蓝色是热量，绿色是功，长短不按比例。

## 例题

### 例 1　声称的热机

有人声称，他的:term[热机]{id="physics.thermal-physics.heat-engine"}在$520\,\mathrm K$和$390\,\mathrm K$两个:term[热库]{id="physics.thermal-physics.heat-reservoir"}之间工作，每个:term[循环]{id="physics.thermal-physics.cyclic-process"}吸热$2.0\,\mathrm{kJ}$、对外做功$0.60\,\mathrm{kJ}$。这可能吗？

**为什么想到这么做**：:term[卡诺定理]{id="physics.thermal-physics.carnot-theorem"}给出了:term[热机效率]{id="physics.thermal-physics.thermal-efficiency"}的上限，而且和:term[工作物质]{id="physics.thermal-physics.working-substance"}无关，拿声称的值去比就行。

**推导**：上限是$1-\frac{390}{520}=0.25$，吸热$2.0\,\mathrm{kJ}$最多做功$0.50\,\mathrm{kJ}$。声称的热机效率是$\frac{0.60}{2.0}=0.30$，超过了上限，不管用什么工作物质都不可能：用它带动倒过来的:term[可逆热机]{id="physics.thermal-physics.reversible-engine"}，就违反了:term[克劳修斯表述]{id="physics.thermal-physics.clausius-statement"}。

## 常见误区

- 「只要没有摩擦、不漏热，:term[热机效率]{id="physics.thermal-physics.thermal-efficiency"}就能达到$1-\frac{T_{\mathrm L}}{T_{\mathrm H}}$。」还得每一段都是:term[准静态过程]{id="physics.thermal-physics.quasi-static-process"}（quasi-static process），只在$T_{\mathrm H}$吸热、只在$T_{\mathrm L}$放热，不隔着有限的温差：[热机与卡诺循环](lesson:physics.thermal-physics.heat-engines)第 5 题的:term[奥托循环]{id="physics.thermal-physics.cyclic-process"}（Otto cycle）没有摩擦，可吸热、放热不在两个固定的:term[温度]{id="physics.thermal-physics.temperature"}下进行，热机效率就比它的最高、最低温度之间的:term[卡诺热机]{id="physics.thermal-physics.carnot-engine"}低。
- 「:term[热力学温标]{id="physics.thermal-physics.thermodynamic-temperature-scale"}规定水的:term[三相点]{id="physics.thermal-physics.triple-point"}是$273.16\,\mathrm K$，所以它还是靠水定义的。」温度之比由:term[可逆热机]{id="physics.thermal-physics.reversible-engine"}定，和物质无关；三相点只用来选单位，2019 年起连这一步也不用水了。

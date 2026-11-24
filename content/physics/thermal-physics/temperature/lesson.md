---
id: physics.thermal-physics.temperature
title: |
  温度与热平衡
goal: |
  会用热力学第零定律说明温度的含义，并用理想气体温标定义温度。
prerequisites: []
minutes: 30
summary: |
  互为热平衡的系统温度相同；理想气体温标用稀薄气体定义温度。
status: reviewed
---

## 这一节要回答的问题

冬天的铁栏杆摸着比木椅凉，它们的:term[温度]{id="physics.thermal-physics.temperature"}（temperature）不同吗？体温计为什么要夹几分钟？两种温度计读数不一，该信哪个？

## 讲解

### 平衡态与热平衡

盖紧的保温瓶里刚灌进的热水，起初各处冷热不一，过一阵子就不再变了。

::anchor{id="def-state-variable"}
所研究的物体叫作系统（system），系统以外的叫作外界（surroundings）；描述系统整体的宏观量（macroscopic quantity），如压强（pressure）$p$、体积$V$，叫作:term[状态参量]{id="physics.thermal-physics.state-variable"}（state variable）。

为什么这样定义：分子数以$10^{25}$计，只能用宏观量描述。边界情况：活塞猛推时各处压强不同，整个气体说不出一个压强。

::anchor{id="def-equilibrium-state"}
没有外界影响时，宏观性质长时间不变的状态叫作:term[平衡态]{id="physics.thermal-physics.equilibrium-state"}（equilibrium state）。

为什么这样定义：只有平衡态，压强、:term[温度]{id="physics.thermal-physics.temperature"}这类状态参量才对整个系统有确定的值。反例：铁棒两端分别插在沸水和冰水里，冷热分布也不变，但靠外界维持。

::anchor{id="def-thermal-equilibrium"}
两个系统接触（隔着薄铜片也行），各自的状态参量都不再变化时，说它们达到了:term[热平衡]{id="physics.thermal-physics.thermal-equilibrium"}（thermal equilibrium）；没接触的两个系统，让它们接触时都不变，也算处于热平衡。

为什么这样定义：它说的是接触着、谁也不再改变谁。边界情况：隔着理想的隔热层，一冷一热也能各自不变，但那不算热平衡。

### 热力学第零定律与温度

同一支温度计示数相同的两杯水，不用放在一起试，也知道一样热。

::anchor{id="def-zeroth-law"}
如果$A$、$B$分别与第三个系统$C$处于:term[热平衡]{id="physics.thermal-physics.thermal-equilibrium"}，那么$A$、$B$也处于热平衡。这条实验规律叫作:term[热力学第零定律]{id="physics.thermal-physics.zeroth-law"}（zeroth law of thermodynamics），也叫热平衡定律。

为什么单列为定律：它不是逻辑上必然的，甲认识丙、乙认识丙，甲乙未必认识。用数学的话说，热平衡是一种:term[等价关系]{id="math.logic-sets.equivalence-relation"}（equivalence relation）。

::anchor{id="def-temperature"}
由第零定律，和同一个系统热平衡的系统可以归成一类，同一类共有的宏观性质叫作:term[温度]{id="physics.thermal-physics.temperature"}（temperature），用一个数标记（为什么行得通，见第 6 题）：两个系统温度相同，当且仅当它们接触时处于热平衡。

为什么这样定义：温度计就是$C$，它小得几乎不改变待测物体，热平衡后的读数就是物体的温度，体温计夹几分钟就是等热平衡。边界情况：铁栏杆和木椅温度相同，铁导热快，才摸着凉。

### 温标

::anchor{id="def-temperature-scale"}
选定测温物质（thermometric substance）和它随:term[温度]{id="physics.thermal-physics.temperature"}变化的一种性质，即测温性质（thermometric property），再规定固定点（fixed point）的数值和分度办法，这套规定叫作:term[温标]{id="physics.thermal-physics.temperature-scale"}（temperature scale）。摄氏温标（Celsius scale）原来规定 1 标准大气压（standard atmosphere）下冰水混合物为$0\,^\circ\mathrm C$、沸水为$100\,^\circ\mathrm C$，中间按水银柱长度均分 100 份，量出的摄氏温度（Celsius temperature）记作$t$。

为什么这样定义：有了数，才能说升高了几度。边界情况：换一种测温物质照样刻度，只在固定点上一定对得上（见第 5 题）。本领域只在这一节用$t$表示摄氏温度。

### 理想气体温标

::anchor{id="def-gas-thermometer"}
:term[定容气体温度计]{id="physics.thermal-physics.gas-thermometer"}（constant-volume gas thermometer）如下图：移动右管让左管水银面停在标记处，泡里气体体积不变，压强$p=p_0+\rho_{\text{汞}}gh$，$p_0$是大气压（atmospheric pressure），$h$是右管水银面高出左管的高度。纯水的冰、水和水蒸气平衡共存的唯一状态叫作水的:term[三相点]{id="physics.thermal-physics.triple-point"}（triple point）；规定读数和压强成正比、三相点的读数为$273.16$开尔文（kelvin，K），读数就是$T^*=273.16\,\mathrm K\times\frac p{p_3}$，$p_3$是泡浸在三相点的水里时的压强。

![定容气体温度计：玻璃泡浸在待测物体里，接水银压强计，右管可上下移动，水银面比左管高出 h。示意图，不按比例](gas-thermometer.svg)

为什么这样定义：压强好测，稀薄的气体表现又一致；三相点比冰点好复现。边界情况：泡也会热胀冷缩，精密测量要修正。

实际读数还和气体种类、充气多少稍有关系，$p_3$越小越一致（见几何图像）。

::anchor{id="def-ideal-gas-scale"}
用气体越来越稀薄时读数的共同值标定:term[温度]{id="physics.thermal-physics.temperature"}，这样的:term[温标]{id="physics.thermal-physics.temperature-scale"}叫作:term[理想气体温标]{id="physics.thermal-physics.ideal-gas-temperature-scale"}（ideal-gas temperature scale）。

为什么这样定义：它和气体种类无关，适合当标准。边界情况：几开尔文以下几乎所有物质都凝结了，它用不上；和物质无关的定义见[卡诺定理与热力学温标](lesson:physics.thermal-physics.carnot-theorem)。

### 热力学温度与绝对零度

::anchor{id="def-thermodynamic-temperature"}
在:term[气体温度计]{id="physics.thermal-physics.gas-thermometer"}能用的范围里，由:term[理想气体温标]{id="physics.thermal-physics.ideal-gas-temperature-scale"}给出的:term[温度]{id="physics.thermal-physics.temperature"}叫作:term[热力学温度]{id="physics.thermal-physics.thermodynamic-temperature"}（thermodynamic temperature），也叫绝对温度，记作$T$，单位是开尔文。摄氏温度现在由它定义：$T=t+273.15\,\mathrm K$。

开尔文得名于威廉·汤姆孙（William Thomson，后来的开尔文勋爵）。本领域的$T$只表示热力学温度。

为什么这样定义：取$273.16$是为了让$1\,\mathrm K$和$1\,^\circ\mathrm C$一样大，温差用两种单位数值相同；冰点比:term[三相点]{id="physics.thermal-physics.triple-point"}低约$0.01\,\mathrm K$，三位有效数字时取$T\approx t+273\,\mathrm K$。按现在的定义，1 标准大气压下水的沸点是$373.12\,\mathrm K$，即$99.97\,^\circ\mathrm C$。边界情况：只有热力学温度能说「几倍」，$20\,^\circ\mathrm C$的热力学温度只是$10\,^\circ\mathrm C$的$1.035$倍。

::anchor{id="def-absolute-zero"}
$T=0$即$-273.15\,^\circ\mathrm C$，叫作:term[绝对零度]{id="physics.thermal-physics.absolute-zero"}（absolute zero）。

为什么这样定义：读数和压强成正比，压强不能为负，没有更低的温度。边界情况：这是外推，实际气体（real gas）早已液化，绝对零度只能接近、不能达到（见[热力学第三定律](lesson:physics.thermal-physics.third-law)）。

2019 年起，开尔文改由:term[玻尔兹曼常量]{id="physics.thermal-physics.boltzmann-constant"}（Boltzmann constant）定义。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-5, 100], y: [373.0, 373.45] }
functions:
  - expr: "373.124 + 0.00296*x + 0*sqrt(x)"
    label: |
      氧气
  - expr: "373.124 + 0.00271*x + 0*sqrt(x)"
    label: |
      氮气
  - expr: "373.124 + 0.00026*x + 0*sqrt(x)"
    label: |
      氢气
  - expr: "373.124 - 0.00008*x + 0*sqrt(x)"
    label: |
      氦气
points:
  - { x: 0, y: 373.124 }
:::

横轴是$p_3$（$\mathrm{kPa}$，图上写作 x），纵轴是沸水里的读数$T^*$（$\mathrm K$，图上写作 y）；蓝、橙、绿、紫依次是氧、氮、氢、氦，斜率按实际气体估算。它们交于圆点，约$373.12\,\mathrm K$，即:term[理想气体温标]{id="physics.thermal-physics.ideal-gas-temperature-scale"}下水的沸点。

## 例题

### 例 1　外推求水的沸点

用充氮气的:term[定容气体温度计]{id="physics.thermal-physics.gas-thermometer"}量 1 标准大气压下水的沸点：$p_3=80.00\,\mathrm{kPa}$时沸水里的压强是$109.340\,\mathrm{kPa}$；放掉一些气体后，$p_3=40.00\,\mathrm{kPa}$时是$54.654\,\mathrm{kPa}$。按:term[理想气体温标]{id="physics.thermal-physics.ideal-gas-temperature-scale"}，沸点是多少？

**为什么想到这么做**：两次读数不同，气体还不够稀薄；读数随$p_3$按直线变，延长到$p_3=0$即可。

**推导**：$\frac p{p_3}$分别是$1.366\,75$、$1.366\,35$，$p_3$每减$40\,\mathrm{kPa}$减少$0.000\,40$，$p_3=0$时是$1.365\,95$，$T=273.16\,\mathrm K\times1.365\,95\approx373.12\,\mathrm K$。

---
id: physics.special-relativity.four-momentum
title: |
  四维速度与四维动量
goal: |
  会求四维动量，并使用能量-动量关系$E^2=p^2c^2+m^2c^4$。
prerequisites: [physics.special-relativity.four-vectors, physics.special-relativity.velocity-transformation, physics.newtonian-mechanics.collisions]
minutes: 35
summary: |
  四维动量$(E/c,\vb p)$守恒，由它的内积得到$E^2=p^2c^2+m^2c^4$。
status: reviewed
---

## 这一节要回答的问题

牛顿力学里，碰撞前后各物体的$m\vb u$之和不变，而且换一个:term[惯性系]{id="physics.special-relativity.inertial-frame"}（inertial frame）仍然不变：伽利略变换（Galilean transformation）下每个速度都减去同一个$\vb v$。相对论的:term[速度变换]{id="physics.special-relativity.velocity-transformation"}（velocity transformation）不是简单的相减，$\sum m\vb u$在一个惯性系里守恒，换一个惯性系就不守恒了（例 2）。什么量在每个惯性系里都守恒，速度低时又回到$m\vb u$？

## 讲解

### 四维速度

用速度凑成的$(c,\vb u)$不是:term[四维矢量]{id="physics.special-relativity.four-vector"}（four-vector），毛病出在$\dd t$：时间间隔随:term[惯性系]{id="physics.special-relativity.inertial-frame"}变。把$\dd t$换成和惯性系无关的:term[固有时]{id="physics.special-relativity.proper-time"}（proper time）$\dd\tau$，就得到四维矢量。

::anchor{id="def-four-velocity"}
质点的:term[世界线]{id="physics.special-relativity.worldline"}（world line）上，坐标对:term[固有时]{id="physics.special-relativity.proper-time"}的导数$U^\mu=\dv{x^\mu}{\tau}$叫作质点的:term[四维速度]{id="physics.special-relativity.four-velocity"}（four-velocity）；质点在某个惯性系里的速度是$\vb u$时，$U^\mu=\gamma_u(c,\vb u)$，其中$\gamma_u=\frac{1}{\sqrt{1-u^2/c^2}}$。

为什么这样定义：两个相邻:term[事件]{id="physics.special-relativity.event"}（event）的坐标差$\dd x^\mu$是四维矢量，$\dd\tau$是:term[洛伦兹标量]{id="physics.special-relativity.lorentz-scalar"}（Lorentz scalar），相除仍是四维矢量。沿世界线$\dd\tau=\dd t\sqrt{1-u^2/c^2}=\frac{\dd t}{\gamma_u}$，所以$U^\mu=\gamma_u\dv{x^\mu}{t}=\gamma_u(c,\vb u)$；它和自己的内积$U\cdot U=\gamma_u^2(c^2-u^2)=c^2$，对每个质点、在每个惯性系里都一样。边界情况：光走过的世界线上$\dd\tau=0$，光没有四维速度。

记号：从这一节起，$\gamma$仍专指两个惯性系的相对速度$v$对应的:term[洛伦兹因子]{id="physics.special-relativity.lorentz-factor"}（Lorentz factor），质点自己的速度$u$对应的写成$\gamma_u$。

### 四维动量

::anchor{id="def-four-momentum"}
质量为$m$的质点，$P^\mu=mU^\mu=(\gamma_umc,\gamma_um\vb u)$叫作它的:term[四维动量]{id="physics.special-relativity.four-momentum"}（four-momentum）；记$E=\gamma_umc^2$，$\vb p=\gamma_um\vb u$，则$P^\mu=\bigl(\frac Ec,\vb p\bigr)$，$E$叫作质点的能量，$\vb p$叫作它的（相对论）动量（relativistic momentum）。

为什么这样定义：$m$是常数，$U$是:term[四维矢量]{id="physics.special-relativity.four-vector"}，所以$P$也是四维矢量。速度低时$\gamma_u\approx1+\frac{u^2}{2c^2}$（见[时间延缓](lesson:physics.special-relativity.time-dilation#def-lorentz-factor)），于是$\vb p\approx m\vb u$，$E\approx mc^2+\frac12mu^2$：空间分量回到牛顿力学的动量，能量$E$（时间分量的$c$倍）是一个常数加上牛顿力学的动能（kinetic energy）。本领域说的质量$m$都是质点静止时量到的质量，它是:term[洛伦兹标量]{id="physics.special-relativity.lorentz-scalar"}，不随速度变。边界情况：质点静止时$\vb p=0$，能量却不是零而是$mc^2$，它的意义见[质能关系](lesson:physics.special-relativity.mass-energy)。

::anchor{id="thm-conservation-frames"}
定理（守恒和:term[惯性系]{id="physics.special-relativity.inertial-frame"}无关）：如果一个过程（碰撞、衰变等）前后，各粒子四维动量之和在某个惯性系里相等，那么在每个惯性系里都相等。

证明：设在$S$里$\sum_{\text{前}}P_i=\sum_{\text{后}}P_j$。换到$S'$，每个四维动量都乘同一个矩阵$\Lambda$：$\sum_{\text{前}}P'_i=\Lambda\sum_{\text{前}}P_i=\Lambda\sum_{\text{后}}P_j=\sum_{\text{后}}P'_j$，用到的只是变换是线性的。

::anchor{id="def-four-momentum-conservation"}
四维动量守恒定律（conservation of four-momentum）：孤立系统里，粒子碰撞、衰变、产生和湮灭前后，各粒子四维动量之和不变；空间分量守恒就是动量守恒，时间分量$\frac Ec$守恒就是能量守恒。

为什么相信它：这是实验定律，粒子物理里的每一次碰撞、衰变都在检验它；上面的定理保证它和:term[相对性原理]{id="physics.special-relativity.principle-of-relativity"}（principle of relativity）相容，在一个惯性系里成立，就在所有惯性系里成立。牛顿力学的$\sum m\vb u$做不到这一点（例 2）。边界情况：守恒的是能量之和$\sum E$，不是质量之和；过程前后各粒子的质量之和可以变（例 2）。

### 能量-动量关系

::anchor{id="thm-energy-momentum"}
定理（:term[能量-动量关系]{id="physics.special-relativity.energy-momentum-relation"}，energy–momentum relation）：质量为$m$的质点，能量和动量满足$E^2=p^2c^2+m^2c^4$，速度$\vb u=\frac{\vb pc^2}{E}$。

证明：$P\cdot P=m^2\,U\cdot U=m^2c^2$；另一方面$P\cdot P=\frac{E^2}{c^2}-p^2$，两式相等就是$E^2=p^2c^2+m^2c^4$。由定义，$\frac{\vb p}{E}=\frac{\gamma_um\vb u}{\gamma_umc^2}=\frac{\vb u}{c^2}$。

这个关系说明，$E$和$\vb p$各自随:term[惯性系]{id="physics.special-relativity.inertial-frame"}变，$E^2-p^2c^2$却在每个惯性系里都是$m^2c^4$：质量就是:term[四维动量]{id="physics.special-relativity.four-momentum"}的「长度」除以$c$。在以$pc$为横轴、$E$为纵轴的平面上，同一个质点在各个惯性系里的四维动量都落在双曲线$E^2-p^2c^2=m^2c^4$上（见几何图像）。

### 无质量粒子

::anchor{id="def-massless-particle"}
质量为零的粒子叫作:term[无质量粒子]{id="physics.special-relativity.massless-particle"}（massless particle）；它的:term[四维动量]{id="physics.special-relativity.four-momentum"}$P=\bigl(\frac Ec,\vb p\bigr)$满足$P\cdot P=0$，即$E=pc$。

为什么能有这样的粒子：$P=mU$在$m=0$时失去意义，可:term[能量-动量关系]{id="physics.special-relativity.energy-momentum-relation"}只涉及$E$和$\vb p$，$m=0$时照样能用。由$\vb u=\frac{\vb pc^2}{E}$，无质量粒子的速率是$\frac{pc^2}{pc}=c$，在任何:term[惯性系]{id="physics.special-relativity.inertial-frame"}里都以光速运动；光子（photon）就是这样的粒子。边界情况：无质量粒子没有静止的惯性系，也没有:term[四维速度]{id="physics.special-relativity.four-velocity"}；它的能量可以是任何正数，光的频率越高，光子的能量越大，这是量子力学（quantum mechanics）的内容。

### 单位

粒子物理里能量的单位常用电子伏特（electronvolt，eV）：$1\,\mathrm{eV}=1.602\,176\,634\times10^{-19}\,\mathrm J$，$1\,\mathrm{MeV}=10^6\,\mathrm{eV}$，$1\,\mathrm{GeV}=10^9\,\mathrm{eV}$。动量用$\mathrm{MeV}/c$、质量用$\mathrm{MeV}/c^2$作单位，:term[能量-动量关系]{id="physics.special-relativity.energy-momentum-relation"}就写成$E^2=(pc)^2+(mc^2)^2$，三项都以$\mathrm{MeV}^2$计。例如电子的$m_ec^2=0.511\,\mathrm{MeV}$，质子的$m_pc^2=938.3\,\mathrm{MeV}$。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-2.5, 2.5], y: [0, 3] }
functions:
  - expr: "sqrt(1 + x^2)"
    label: |
      $E^2-p^2c^2=m^2c^4$
  - expr: "abs(x)"
    label: |
      无质量粒子$E=|\vb p|c$
  - expr: "1 + x^2/2"
    label: |
      牛顿力学$E=mc^2+\frac{p^2}{2m}$
  - expr: "x/u + 0*sqrt(x*(u/sqrt(1 - u^2) - x))"
    label: |
      四维动量$P$
points:
  - { x: "u/sqrt(1 - u^2)", y: "1/sqrt(1 - u^2)" }
sliders:
  - name: u
    min: -0.9
    max: 0.9
    step: 0.01
    default: 0.6
    label: |
      质点的速度$u/c$
:::

横轴是$pc$，纵轴是$E$，都以$mc^2$为单位。拖动滑块改变质点的速度，相当于在不同的:term[惯性系]{id="physics.special-relativity.inertial-frame"}里看同一个质点：:term[四维动量]{id="physics.special-relativity.four-momentum"}的端点沿双曲线移动，它的「长度」$\sqrt{P\cdot P}=mc$不变。速度越接近光速，端点越贴近:term[无质量粒子]{id="physics.special-relativity.massless-particle"}的那两条线；牛顿力学的抛物线只在$p$小的地方和双曲线重合。

## 例题

### 例 1　电子的能量和动量

电子以$0.6c$运动，$m_ec^2=0.511\,\mathrm{MeV}$。求它的能量和动量，并验证:term[能量-动量关系]{id="physics.special-relativity.energy-momentum-relation"}。

**为什么想到这么做**：直接按定义算$\gamma_u$、$E$、$\vb p$；用$\mathrm{MeV}$、$\mathrm{MeV}/c$作单位，验证时三项都是$\mathrm{MeV}^2$。

**推导**：$\gamma_u=\frac{1}{\sqrt{1-0.36}}=1.25$，$E=1.25\times0.511\,\mathrm{MeV}\approx0.639\,\mathrm{MeV}$，$pc=\gamma_um_euc=1.25\times0.6\times0.511\,\mathrm{MeV}\approx0.383\,\mathrm{MeV}$，即$p\approx0.383\,\mathrm{MeV}/c$。验证：$(pc)^2+(m_ec^2)^2\approx0.1469+0.2611=0.4080$，$E^2\approx0.639^2\approx0.4080$（单位$\mathrm{MeV}^2$）。反过来$\frac{pc}{E}=0.6$，正是速度。

### 例 2　牛顿力学的动量换个惯性系就不守恒

两个质量都是$m$的小球在$S$里以$\pm0.6c$迎面相撞，粘成一个物体。求这个物体的质量；再到小球 2 静止的:term[惯性系]{id="physics.special-relativity.inertial-frame"}$S'$里，检验碰撞前后$\sum m\vb u$和$\sum\vb p$是否相等。

**为什么想到这么做**：在$S$里两球对称，合成的物体静止，用能量守恒就能求出它的质量。再用:term[速度变换]{id="physics.special-relativity.velocity-transformation"}求各物体在$S'$里的速度，两种动量各算一遍。

**推导**：在$S$里，碰撞前总动量为零，总能量$2\gamma_umc^2=2.5mc^2$；碰撞后物体静止，能量是$Mc^2$，所以$M=2.5m$，比$2m$大。$S'$相对$S$以$-0.6c$运动：小球 1 的速度是$\frac{0.6c+0.6c}{1+0.36}=\frac{15}{17}c$，小球 2 静止，合成的物体以$0.6c$运动。

$\sum m\vb u$：碰撞前是$\frac{15}{17}mc\approx0.882mc$，碰撞后不论按$2m$还是$2.5m$算，都是$1.2mc$或$1.5mc$，不相等。$\sum\vb p$：小球 1 的$\gamma=\frac{17}{8}$，碰撞前$p=\frac{17}8\cdot\frac{15}{17}mc=\frac{15}8mc$；碰撞后$1.25\times2.5m\times0.6c=\frac{15}8mc$，相等。能量也守恒：碰撞前$\frac{17}8mc^2+mc^2=\frac{25}8mc^2$，碰撞后$1.25\times2.5mc^2=\frac{25}8mc^2$。动能变成了合成物体多出来的质量，这是下一节的内容。

## 常见误区

- 「$\gamma_um\vb u$说明运动物体的质量变大了。」本领域的质量$m$不随速度变，$\gamma_u$来自$\dd\tau$和$\dd t$的换算；把$\gamma_um$叫作「相对论质量」的旧说法容易误导（见 p7）。
- 「$E=\gamma_umc^2$是动能。」它包括质点静止时的$mc^2$；动能是$E-mc^2$，见[质能关系](lesson:physics.special-relativity.mass-energy)。
- 「光子没有质量，所以没有动量。」:term[无质量粒子]{id="physics.special-relativity.massless-particle"}的动量是$\frac Ec$，光照在物体上会产生压力。
- 「:term[四维速度]{id="physics.special-relativity.four-velocity"}的空间分量就是速度，所以不超过$c$。」空间分量是$\gamma_u\vb u$，可以任意大，只有$\vb u$本身不超过$c$。
- 「能量和动量都和:term[惯性系]{id="physics.special-relativity.inertial-frame"}无关。」它们各自随惯性系变，不变的是$E^2-p^2c^2=m^2c^4$。

---
id: physics.electromagnetism.skin-effect
title: |
  导体中的电磁波与趋肤效应
goal: |
  会求电磁波在导体中的衰减，并估计趋肤深度。
prerequisites: [physics.electromagnetism.waves-in-media]
minutes: 45
summary: |
  电磁波进入导体后迅速衰减，高频电流只在导体表面一薄层里流。
status: reviewed
---

## 这一节要回答的问题

金属外壳的电梯里手机信号常常变差，潜艇潜到深处就很难收到岸上的无线电，频率很高的:term[交流电]{id="physics.electromagnetism.alternating-current"}（alternating current）在导线里只走表面一薄层。:term[电磁波]{id="physics.electromagnetism.em-wave"}（electromagnetic wave）进入:term[导体]{id="physics.electromagnetism.conductor"}（conductor）会怎样？能进去多深？深度和频率、导体的:term[电导率]{id="physics.electromagnetism.conductivity"}（electrical conductivity）有什么关系？

## 讲解

### 导体中的平面电磁波

这一节的$\sigma$都是:term[电导率]{id="physics.electromagnetism.conductivity"}（见[电流与欧姆定律](lesson:physics.electromagnetism.current-density#def-ohm)），不是:term[面电荷密度]{id="physics.electromagnetism.charge-density"}（surface charge density）。设:term[导体]{id="physics.electromagnetism.conductor"}是均匀的线性介质，$\vb D=\varepsilon\vb E$，$\vb B=\mu\vb H$，:term[自由电流]{id="physics.electromagnetism.free-current"}（free current）服从:term[欧姆定律]{id="physics.electromagnetism.ohms-law"}（Ohm's law）$\vb J_{\mathrm f}=\sigma\vb E$；导体里原有的:term[自由电荷]{id="physics.electromagnetism.free-charge"}（free charge）会很快散到表面上去（第 4 题），下面设导体内部$\rho_{\mathrm f}=0$。复数表示的约定和[交流电路与阻抗](lesson:physics.electromagnetism.ac-circuits)一样，场是$\operatorname{Re}\bigl(\tilde{\vb E}e^{i\omega t}\bigr)$的形式。

::anchor{id="thm-conductor-wave"}
定理（导体中的:term[平面电磁波]{id="physics.electromagnetism.em-wave"}）：均匀线性导体的$\varepsilon$、$\mu$、$\sigma$都是常量、内部没有自由电荷时，沿$z$方向传播的平面电磁波可以写成$\vb E=\operatorname{Re}\bigl(\tilde{\vb E}_0e^{i(\omega t-\tilde kz)}\bigr)$，$\tilde{\vb E}_0$垂直于$z$轴，:term[复波数]{id="physics.electromagnetism.complex-wave-number"}（complex wave number）$\tilde k=k-i\kappa$满足$\tilde k^2=\mu\varepsilon\omega^2-i\mu\sigma\omega$，$k>0$，$\kappa>0$；:term[电场]{id="physics.electromagnetism.electric-field"}（electric field）是$E_0e^{-\kappa z}\cos(\omega t-kz+\xi)$，振幅随深度按指数衰减。

证明思路：介质中的:term[麦克斯韦方程组]{id="physics.electromagnetism.maxwell-equations"}（Maxwell's equations）里代入$\vb J_{\mathrm f}=\sigma\vb E$，对:term[法拉第定律]{id="physics.electromagnetism.faraday-law"}（Faraday's law）取旋度，用$\divg\vb E=0$得$\lap\vb E=\mu\varepsilon\frac{\partial^2\vb E}{\partial t^2}+\mu\sigma\pdv{\vb E}t$，比:term[绝缘体]{id="physics.electromagnetism.insulator"}（insulator）里多了最后一项。代入复数形式的平面波，对$t$求导是乘以$i\omega$，对$z$求导是乘以$-i\tilde k$，得$\tilde k^2=\mu\varepsilon\omega^2-i\mu\sigma\omega$。它的虚部为负，两个平方根里取实部为正的那个，虚部也为负，记作$-\kappa$；$e^{-i\tilde kz}=e^{-\kappa z}e^{-ikz}$，取实部即得。

右边两项分别来自:term[位移电流]{id="physics.electromagnetism.displacement-current"}（displacement current）和:term[传导电流]{id="physics.electromagnetism.electric-current"}（conduction current），两者之比是$\frac{\sigma}{\varepsilon\omega}$。比值远小于$1$时，导体和[介质中的电磁波](lesson:physics.electromagnetism.waves-in-media)里的绝缘体差不多，波只是慢慢衰减（第 5 题）；比值远大于$1$时，传导电流占绝对优势。

::anchor{id="def-good-conductor"}
在所讨论的频率下$\sigma\gg\varepsilon\omega$，即传导电流远大于位移电流的导体，叫作良导体（good conductor）。

为什么这样定义：一种材料是不是良导体，要看频率。铜的$\varepsilon\approx\varepsilon_0$，从直流到微波都是良导体；到了红外和可见光，频率高到电子在两次碰撞之间就感到电场方向的变化，欧姆定律本身不再适用。边界情况：约$900\,\mathrm{MHz}$是海水里传导电流和位移电流相等的频率（见[位移电流与麦克斯韦方程组](lesson:physics.electromagnetism.maxwell-equations)第 4 题），海水要在比它低得多的频率下才算良导体，例如$1\,\mathrm{MHz}$时$\frac{\sigma}{\varepsilon\omega}\approx900$（第 5 题）；频率比它高得多时，海水更像绝缘体。

::anchor{id="thm-good-conductor"}
定理（良导体中的电磁波）：$\sigma\gg\varepsilon\omega$时，$k\approx\kappa\approx\sqrt{\frac{\mu\sigma\omega}2}$；:term[磁场]{id="physics.electromagnetism.magnetic-field"}（magnetic field）的相位比电场落后$45^\circ$，振幅之比$\frac{B_0}{E_0}=\sqrt{\frac{\mu\sigma}{\omega}}$。

证明思路：$\tilde k^2\approx-i\mu\sigma\omega=\mu\sigma\omega e^{-i\pi/2}$，所以$\tilde k=\sqrt{\mu\sigma\omega}\,e^{-i\pi/4}=\sqrt{\frac{\mu\sigma\omega}{2}}(1-i)$。由法拉第定律，平面波里$\tilde{\vb B}_0=\frac{\tilde k}{\omega}\uv z\times\tilde{\vb E}_0$，推导和真空里一样，只是$k$换成$\tilde k$（见[真空中的电磁波](lesson:physics.electromagnetism.em-waves#thm-plane-wave)）。$\frac{\tilde k}{\omega}=\sqrt{\frac{\mu\sigma}\omega}\,e^{-i\pi/4}$，乘以$e^{-i\pi/4}$就是相位落后$45^\circ$。

真空里$\frac{B_0}{E_0}=\frac1c$；良导体里$\frac{B_0}{E_0}$大得多，磁场的:term[能量密度]{id="physics.electromagnetism.energy-density"}（energy density）和电场的之比是$\frac{\sigma}{\varepsilon\omega}$，场的能量几乎都在磁场里。

### 趋肤深度

::anchor{id="def-skin-depth"}
:term[电磁波]{id="physics.electromagnetism.em-wave"}在:term[导体]{id="physics.electromagnetism.conductor"}里振幅衰减到$\frac1e$所走的距离$\delta=\frac1\kappa$叫作:term[趋肤深度]{id="physics.electromagnetism.skin-depth"}（skin depth）；良导体里$\delta=\sqrt{\frac{2}{\mu\sigma\omega}}$。

为什么这样定义：$\delta$说的是电磁场能进入导体多深，深度为$3\delta$处振幅只剩约$5\%$，$5\delta$处不到$1\%$。良导体里的波长是$\frac{2\pi}{k}=2\pi\delta$，波还没走完一个波长，振幅就衰减到原来的$e^{-2\pi}\approx\frac1{535}$。边界情况：频率越高、:term[电导率]{id="physics.electromagnetism.conductivity"}越大，$\delta$越小；$\omega\to0$时$\delta\to\infty$，恒定的场能进入整个导体。

铜（$\sigma=5.96\times10^7\,\mathrm{S/m}$，$\mu\approx\mu_0$）在$50\,\mathrm{Hz}$时$\delta\approx9.2\,\mathrm{mm}$，在$1\,\mathrm{GHz}$时只有约$2\,\mu\mathrm m$（例 1）。导体壳挡住电磁波就靠这个：电梯的钢板厚一两毫米，手机信号的频率是吉赫兹量级，钢的趋肤深度只有几微米，穿过钢板的波微乎其微，信号主要从门缝等缝隙里漏进来（见[导体与静电平衡](lesson:physics.electromagnetism.conductors)第 7 题）。

海水的电导率约$4\,\mathrm{S/m}$，比铜小一千多万倍，趋肤深度大得多，可对无线电通信来说仍然太浅：频率为$1\,\mathrm{MHz}$时约$0.25\,\mathrm m$。所以潜艇只能用频率很低的电磁波和岸上联络；美国海军的极低频发射台（Project ELF）在 2004 年关闭以前，就用$76\,\mathrm{Hz}$的电磁波向深潜的潜艇发简短的信号（例 2）。

### 趋肤效应

::anchor{id="def-skin-effect"}
:term[交流电流]{id="physics.electromagnetism.alternating-current"}集中在:term[导体]{id="physics.electromagnetism.conductor"}表面附近、越往里越弱的现象叫作趋肤效应（skin effect）。

为什么这样定义：导线里的:term[电场]{id="physics.electromagnetism.electric-field"}和:term[电流]{id="physics.electromagnetism.electric-current"}也满足上面的方程，场从导线表面向里传，频率高时电流集中在表面约$\delta$厚的一层里，导线中间的部分几乎不导电，:term[交流电阻]{id="physics.electromagnetism.resistance"}（AC resistance）比直流电阻大（第 3 题）。所以高频电路的导线常在表面镀银，大功率的高频线圈干脆用空心铜管绕成（第 8 题）。边界情况：导体的尺寸比$\delta$小得多时，电流在整个截面上近似均匀，趋肤效应可以不计，家里的电线通$50\,\mathrm{Hz}$的交流电就是这样。

[感生电场](lesson:physics.electromagnetism.induced-electric-field)第 5 题算金属圆盘里的:term[涡电流]{id="physics.electromagnetism.eddy-current"}（eddy current）时，忽略了涡电流自己的:term[磁场]{id="physics.electromagnetism.magnetic-field"}，这只有在导体的尺寸比:term[趋肤深度]{id="physics.electromagnetism.skin-depth"}小得多时才合理。频率高了，涡电流的磁场把外加磁场的变化抵消在导体表面的一薄层里，里面的导体不再起作用，这正是趋肤效应（第 7 题）。

1883 年，兰姆（Horace Lamb）对球形导体算出了这种效应；1885 年，亥维赛（Oliver Heaviside）把它推广到任意形状的导体。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 6], y: [-1.1, 1.1] }
functions:
  - expr: "exp(-x)*cos(2*pi*s - x)"
    label: |
      电场，以表面处的振幅$E_0$为单位
  - expr: "exp(-x)*cos(2*pi*s - x - pi/4)"
    label: |
      磁场乘以$\sqrt{\frac{\omega}{\mu\sigma}}$，以$E_0$为单位
  - expr: "exp(-x)"
    label: |
      振幅的包络$e^{-z/\delta}$
  - expr: "-exp(-x)"
    label: |
      包络的另一半$-e^{-z/\delta}$
sliders:
  - name: s
    min: 0
    max: 1
    step: 0.05
    default: 0
    label: |
      时间，以周期为单位
:::

横轴是进入:term[良导体]{id="physics.electromagnetism.conductor"}的深度$z$，以:term[趋肤深度]{id="physics.electromagnetism.skin-depth"}$\delta$为单位。拖动时间，波形向导体里移动，振幅却按$e^{-z/\delta}$迅速变小：$z=\delta$处剩约$37\%$，还没走完一个波长（$2\pi\delta$）就几乎看不见了。:term[磁场]{id="physics.electromagnetism.magnetic-field"}的波形比:term[电场]{id="physics.electromagnetism.electric-field"}落后八分之一个周期，即$45^\circ$的相位。

## 例题

### 例 1　铜的趋肤深度

求铜（$\sigma=5.96\times10^7\,\mathrm{S/m}$，$\mu=\mu_0$）在$50\,\mathrm{Hz}$、$1\,\mathrm{MHz}$和$1\,\mathrm{GHz}$时的:term[趋肤深度]{id="physics.electromagnetism.skin-depth"}。

**为什么想到这么做**：先确认是:term[良导体]{id="physics.electromagnetism.conductor"}：$\varepsilon\approx\varepsilon_0$，即使在$1\,\mathrm{GHz}$，$\frac{\sigma}{\varepsilon_0\omega}\approx10^9$，远大于$1$。然后用$\delta=\sqrt{\frac2{\mu\sigma\omega}}$，它和$\frac1{\sqrt\omega}$成正比。

**推导**：$50\,\mathrm{Hz}$时$\delta=\sqrt{\frac{2}{4\pi\times10^{-7}\times5.96\times10^7\times2\pi\times50}}\,\mathrm m\approx9.2\,\mathrm{mm}$。频率变成$2\times10^4$倍，$\delta$变成$\frac{1}{\sqrt{2\times10^4}}$，$1\,\mathrm{MHz}$时约$65\,\mu\mathrm m$；频率再变成$1000$倍，$1\,\mathrm{GHz}$时约$2.1\,\mu\mathrm m$。家用电线的铜芯半径不到$1\,\mathrm{mm}$，$50\,\mathrm{Hz}$的:term[电流]{id="physics.electromagnetism.electric-current"}在里面是均匀的；电路板上的铜箔厚约$35\,\mu\mathrm m$，对吉赫兹的信号已经是十几个趋肤深度。

### 例 2　向潜艇发信号

把海水看成$\sigma=4.0\,\mathrm{S/m}$、$\mu=\mu_0$的:term[良导体]{id="physics.electromagnetism.conductor"}。（1）求$76\,\mathrm{Hz}$和$20\,\mathrm{kHz}$的:term[电磁波]{id="physics.electromagnetism.em-wave"}在海水里的:term[趋肤深度]{id="physics.electromagnetism.skin-depth"}。（2）潜艇在水下$100\,\mathrm m$，$76\,\mathrm{Hz}$的信号到那里时振幅剩下海面处的多少？

**为什么想到这么做**：先检查是不是良导体：海水的$\varepsilon\approx80\varepsilon_0$，$20\,\mathrm{kHz}$时$\frac{\sigma}{\varepsilon\omega}\approx4.5\times10^4$，频率更低时更大。振幅按$e^{-z/\delta}$衰减。

**推导**：（1）$76\,\mathrm{Hz}$时$\delta=\sqrt{\frac{2}{4\pi\times10^{-7}\times4.0\times2\pi\times76}}\,\mathrm m\approx28.9\,\mathrm m$，$20\,\mathrm{kHz}$时约$1.78\,\mathrm m$。（2）$e^{-100/28.9}\approx0.031$，振幅剩约$3\%$；换成$20\,\mathrm{kHz}$，同样深度只剩$e^{-56}\approx4\times10^{-25}$，根本收不到。所以要和深潜的潜艇联络只能用极低的频率，代价是发射天线长达几十千米、传信息极慢。

## 常见误区

- 「:term[导体]{id="physics.electromagnetism.conductor"}把照到它上面的:term[电磁波]{id="physics.electromagnetism.em-wave"}都吸收了。」良导体主要把电磁波反射回去，透进去的一小部分在几个:term[趋肤深度]{id="physics.electromagnetism.skin-depth"}里被吸收（第 6 题）。
- 「趋肤深度是电磁波能到达的最大深度。」振幅按指数衰减，没有截止的深度；深度为$\delta$处振幅还剩$37\%$。
- 「直流电也只在导线表面流。」$\omega\to0$时$\delta\to\infty$，:term[直流电流]{id="physics.electromagnetism.steady-current"}（direct current）在导线截面上是均匀的；趋肤效应只在频率足够高、导体比$\delta$粗时才明显。

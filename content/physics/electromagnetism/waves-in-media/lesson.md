---
id: physics.electromagnetism.waves-in-media
title: |
  介质中的电磁波
goal: |
  会求线性介质中电磁波的波速和折射率$n=\sqrt{\varepsilon_{\mathrm r}\mu_{\mathrm r}}$。
prerequisites: [physics.electromagnetism.em-waves, physics.electromagnetism.magnetic-intensity]
minutes: 40
summary: |
  线性介质里电磁波变慢，折射率由相对介电常量和相对磁导率决定。
status: reviewed
---

## 这一节要回答的问题

光从空气射进玻璃会偏折，玻璃里的光速比真空里慢。介质会被:term[电场]{id="physics.electromagnetism.electric-field"}（electric field）极化、被:term[磁场]{id="physics.electromagnetism.magnetic-field"}（magnetic field）磁化，:term[电磁波]{id="physics.electromagnetism.em-wave"}（electromagnetic wave）在里面还能传播吗？传播得多快？水的:term[相对介电常量]{id="physics.electromagnetism.relative-permittivity"}（relative permittivity）约为$80$，比玻璃大得多，为什么光在水里反而比在玻璃里跑得快？

## 讲解

### 介质中的麦克斯韦方程组

[位移电流与麦克斯韦方程组](lesson:physics.electromagnetism.maxwell-equations#thm-ampere-maxwell-d)里，:term[束缚电荷]{id="physics.electromagnetism.bound-charge"}（bound charge）挪动形成的:term[电流]{id="physics.electromagnetism.electric-current"}（electric current）$\pdv{\vb P}t$已经并进了$\pdv{\vb D}t$；:term[磁介质]{id="physics.electromagnetism.magnetic-material"}（magnetic material）里还有磁化产生的:term[束缚电流]{id="physics.electromagnetism.bound-current"}（bound current）$\curl\vb M$（见[磁化与束缚电流](lesson:physics.electromagnetism.magnetization#thm-bound-current)）。把它们都算进:term[安培-麦克斯韦定律]{id="physics.electromagnetism.ampere-maxwell-law"}（Ampère–Maxwell law），方程里就只剩下:term[自由电荷]{id="physics.electromagnetism.free-charge"}（free charge）和:term[自由电流]{id="physics.electromagnetism.free-current"}（free current）。

::anchor{id="thm-maxwell-matter"}
定理（介质中的:term[麦克斯韦方程组]{id="physics.electromagnetism.maxwell-equations"}，Maxwell's equations in matter）：$\divg\vb D=\rho_{\mathrm f}$，$\divg\vb B=0$，$\curl\vb E=-\pdv{\vb B}t$，$\curl\vb H=\vb J_{\mathrm f}+\pdv{\vb D}t$，其中$\vb D=\varepsilon_0\vb E+\vb P$，$\vb H=\frac{\vb B}{\mu_0}-\vb M$。

证明思路：第一个是:term[电位移]{id="physics.electromagnetism.electric-displacement"}（electric displacement）的:term[高斯定律]{id="physics.electromagnetism.gauss-law"}（Gauss's law，见[电位移与线性电介质](lesson:physics.electromagnetism.electric-displacement#thm-gauss-d)），中间两个不含:term[电荷]{id="physics.electromagnetism.electric-charge"}（electric charge）和电流，和真空里一样。安培-麦克斯韦定律里的:term[电流密度]{id="physics.electromagnetism.current-density"}（current density）是$\vb J_{\mathrm f}+\pdv{\vb P}t+\curl\vb M$，所以$\curl\vb B=\mu_0\Bigl(\vb J_{\mathrm f}+\pdv{\vb P}t+\curl\vb M\Bigr)+\mu_0\varepsilon_0\pdv{\vb E}t$；除以$\mu_0$，把$\curl\vb M$移到左边，就是$\curl\vb H=\vb J_{\mathrm f}+\pdv{}{t}(\varepsilon_0\vb E+\vb P)$。

场不随时间变时，最后一个方程回到有磁介质时的:term[安培环路定理]{id="physics.electromagnetism.ampere-law"}（Ampère's circuital law，见[磁场强度与线性磁介质](lesson:physics.electromagnetism.magnetic-intensity#thm-ampere-h)）。

### 波速和折射率

下面设介质是均匀的线性介质：$\vb D=\varepsilon\vb E$，$\vb B=\mu\vb H$，$\varepsilon=\varepsilon_{\mathrm r}\varepsilon_0$和$\mu=\mu_{\mathrm r}\mu_0$处处相同，也不随场变化的快慢而变；里面没有:term[自由电荷]{id="physics.electromagnetism.free-charge"}和:term[自由电流]{id="physics.electromagnetism.free-current"}，例如玻璃、纯净的水这样几乎不导电的物质。这时方程组和真空里的形式完全一样，只是$\varepsilon_0$换成$\varepsilon$，$\mu_0$换成$\mu$。

::anchor{id="thm-wave-speed-medium"}
定理（介质中:term[电磁波]{id="physics.electromagnetism.em-wave"}的速度）：均匀线性介质的$\varepsilon$、$\mu$不随频率变，里面没有自由电荷和自由电流时，:term[电场]{id="physics.electromagnetism.electric-field"}和:term[磁场]{id="physics.electromagnetism.magnetic-field"}满足以速度$v=\frac{1}{\sqrt{\varepsilon\mu}}=\frac{c}{\sqrt{\varepsilon_{\mathrm r}\mu_{\mathrm r}}}$传播的波动方程（wave equation）；平面波里$\vb E$、$\vb B$和传播方向两两垂直，$B=\frac Ev$。

证明思路：把真空里推波动方程的过程照搬一遍：对:term[法拉第定律]{id="physics.electromagnetism.faraday-law"}（Faraday's law）取旋度，用$\divg\vb E=\frac1\varepsilon\divg\vb D=0$和$\curl\vb B=\mu\curl\vb H=\mu\varepsilon\pdv{\vb E}t$，得$\lap\vb E=\varepsilon\mu\frac{\partial^2\vb E}{\partial t^2}$；平面波的关系也只是把$c$换成$v$（见[真空中的电磁波](lesson:physics.electromagnetism.em-waves#thm-plane-wave)）。

::anchor{id="def-refractive-index"}
真空中的光速和介质中电磁波的速度之比$n=\frac cv=\sqrt{\varepsilon_{\mathrm r}\mu_{\mathrm r}}$叫作介质的:term[折射率]{id="physics.electromagnetism.refractive-index"}（refractive index）。

为什么这样定义：光斜着射到两种介质的界面上会偏折，偏折的程度只由两边的波速之比决定（见[界面上的反射与折射：菲涅耳公式](lesson:physics.electromagnetism.fresnel-equations)），给每种介质一个$\frac cv$就够用了，「折射率」的名字就是这么来的。电磁波从真空射进介质，频率不变（第 8 题），速度变成$\frac cn$，波长也变成真空里的$\frac1n$。透明的物质几乎都不显出磁性，$\mu_{\mathrm r}\approx1$，$n\approx\sqrt{\varepsilon_{\mathrm r}}$。边界情况：真空的$n=1$；可见光在常见的透明物质里$n>1$，例如水对黄光约为$1.33$，普通玻璃约为$1.5$，钻石约为$2.42$。

光在介质里是变快还是变慢，曾经是检验光的本性的问题：牛顿的微粒说认为光进入水、玻璃时被吸引而加速，惠更斯（Christiaan Huygens）的波动说则要求光在里面变慢，两者对折射的解释正好相反。1850 年，傅科（Léon Foucault）用旋转镜比较了光在空气和水里的速度，测出光在水里更慢，和波动说一致。

平面波的能量也照搬真空的结果：电场和磁场的:term[能量密度]{id="physics.electromagnetism.energy-density"}（energy density）相等，$\frac{\varepsilon}{2}E^2=\frac{1}{2\mu}B^2$，:term[坡印亭矢量]{id="physics.electromagnetism.poynting-vector"}（Poynting vector）是$\vb E\times\vb H$，:term[强度]{id="physics.electromagnetism.intensity"}（intensity）是$\frac12v\varepsilon E_0^2$（第 5 题）。$\mu_{\mathrm r}=1$时强度等于$\frac n2c\varepsilon_0E_0^2$：同样的电场振幅，在介质里带着更多的能流。

### 静电的介电常量和光的折射率

水的:term[相对介电常量]{id="physics.electromagnetism.relative-permittivity"}约为$80$（见[电位移与线性电介质](lesson:physics.electromagnetism.electric-displacement#def-permittivity)），按上面的式子，水的:term[折射率]{id="physics.electromagnetism.refractive-index"}该是$\sqrt{80}\approx8.9$，可光在水里的折射率只有$1.33$，对应的相对介电常量只有约$1.8$。毛病出在频率上：$80$是:term[电场]{id="physics.electromagnetism.electric-field"}不变或变化很慢时的值，那时极性的水分子来得及跟着电场转向；可见光的频率约$5\times10^{14}\,\mathrm{Hz}$，分子转不过来，只有电子云还能跟着电场振动，极化弱得多（见[电介质与极化](lesson:physics.electromagnetism.polarization)第 7 题）。

所以:term[介电常量]{id="physics.electromagnetism.permittivity"}（permittivity）和折射率都随频率变，即:term[色散]{id="physics.electromagnetism.dispersion"}（dispersion），[介质的色散](lesson:physics.electromagnetism.dispersion)专门讲这件事。对一列单一频率的波，前面波速和折射率的式子照样成立，只是$\varepsilon$、$\mu$要用这个频率下的值；说一种物质的折射率，总是对某个频率而言的。

这一节的介质里没有:term[自由电流]{id="physics.electromagnetism.free-current"}。海水能导电，频率低于约$900\,\mathrm{MHz}$时:term[传导电流]{id="physics.electromagnetism.electric-current"}比:term[位移电流]{id="physics.electromagnetism.displacement-current"}（displacement current）大（见[位移电流与麦克斯韦方程组](lesson:physics.electromagnetism.maxwell-equations)第 4 题），这时海水更像:term[导体]{id="physics.electromagnetism.conductor"}（conductor），:term[电磁波]{id="physics.electromagnetism.em-wave"}进去很快就衰减了，要按[导体中的电磁波与趋肤效应](lesson:physics.electromagnetism.skin-effect)里的办法处理。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-2, 2], y: [-2, 2] }
functions:
  - expr: "(1 - sign(x))/2*(cos(2*pi*(x - s)) + (1 - ri)/(1 + ri)*cos(2*pi*(x + s))) + (1 + sign(x))/2*2/(1 + ri)*cos(2*pi*(ri*x - s))"
    label: |
      电场，以入射波的振幅为单位
sliders:
  - name: ri
    min: 1
    max: 2.5
    step: 0.25
    default: 1.5
    label: |
      右边介质的折射率$n$
  - name: s
    min: 0
    max: 1
    step: 0.05
    default: 0
    label: |
      时间，以周期为单位
:::

动画画的是一列平面波从左边的真空垂直射到右边的介质上（横轴是位置，以真空里的波长为单位；介质的:term[相对磁导率]{id="physics.electromagnetism.relative-permeability"}（relative permeability）取$1$）。右边的波长缩短成真空里的$\frac1n$，拖动时间，两边的波形同步振动，频率相同。界面上还有一部分被反射回去，左边是入射波和反射波的叠加，各处振动的幅度不同，拖动时间时波形一边移动一边忽高忽低；反射和透射各占多少，在[界面上的反射与折射：菲涅耳公式](lesson:physics.electromagnetism.fresnel-equations)里讲。$n=1$时没有界面，整列波原样通过。

## 例题

### 例 1　玻璃里的光

真空中波长为$600\,\mathrm{nm}$的光射进:term[折射率]{id="physics.electromagnetism.refractive-index"}为$1.50$的玻璃。求光在玻璃里的速度、频率和波长。

**为什么想到这么做**：$v=\frac cn$；频率在界面两侧相同，由真空里的$\lambda f=c$求出；玻璃里的波长是$\frac vf$。

**推导**：$v=\frac{3.00\times10^8}{1.50}\,\mathrm{m/s}=2.00\times10^8\,\mathrm{m/s}$；$f=\frac{c}{\lambda}=\frac{3.00\times10^8}{600\times10^{-9}}\,\mathrm{Hz}=5.00\times10^{14}\,\mathrm{Hz}$，进玻璃后不变；玻璃里的波长$\frac vf=400\,\mathrm{nm}$，正是$\frac{600\,\mathrm{nm}}{1.50}$。光的颜色由频率决定，所以进了玻璃颜色不变。

### 例 2　水的两个介电常量

室温下水的静电:term[相对介电常量]{id="physics.electromagnetism.relative-permittivity"}约为$80$，对黄光的:term[折射率]{id="physics.electromagnetism.refractive-index"}是$1.333$。（1）按$n=\sqrt{\varepsilon_{\mathrm r}}$，黄光频率下水的相对介电常量是多少？（2）为什么两者差这么多？

**为什么想到这么做**：水不显磁性，$\mu_{\mathrm r}=1$，$\varepsilon_{\mathrm r}=n^2$；差别要从极化跟不跟得上:term[电场]{id="physics.electromagnetism.electric-field"}的变化去想。

**推导**：（1）$\varepsilon_{\mathrm r}=1.333^2\approx1.78$。（2）静电场里，水分子本身有很大的:term[电偶极矩]{id="physics.electromagnetism.dipole-moment"}（electric dipole moment），会顺着电场转过来，这部分极化占了大头；黄光的电场每秒变向约$10^{15}$次，水分子要碰着周围的分子转动，根本跟不上，只剩电子云的极化，相对介电常量只有$1.78$左右。:term[介电常量]{id="physics.electromagnetism.permittivity"}随频率变，在[介质的色散](lesson:physics.electromagnetism.dispersion)里会用一个振子模型来算。

## 常见误区

- 「光进入玻璃，频率和波长都变了。」频率不变，界面两侧的场要时时连接起来；变的是速度和波长。
- 「:term[折射率]{id="physics.electromagnetism.refractive-index"}等于静电:term[相对介电常量]{id="physics.electromagnetism.relative-permittivity"}的平方根。」只在相对介电常量用同一频率的值时才对；水在可见光频率的相对介电常量远小于静电的$80$。
- 「介质里:term[电磁波]{id="physics.electromagnetism.em-wave"}的:term[磁场]{id="physics.electromagnetism.magnetic-field"}能量变得可以忽略。」$\varepsilon$、$\mu$不随频率变时，$\frac{\varepsilon}{2}E^2=\frac{1}{2\mu}B^2$照样成立，:term[电场]{id="physics.electromagnetism.electric-field"}和磁场的能量各占一半。

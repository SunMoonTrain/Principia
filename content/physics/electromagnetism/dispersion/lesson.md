---
id: physics.electromagnetism.dispersion
title: |
  介质的色散
goal: |
  会用束缚电子的受迫振动模型解释折射率随频率的变化和反常色散。
prerequisites: [physics.electromagnetism.waves-in-media, physics.oscillations-waves.driven-oscillations]
minutes: 50
summary: |
  折射率随频率变：束缚电子受迫振动，共振附近有反常色散和吸收。
status: reviewed
---

## 这一节要回答的问题

白光穿过三棱镜会分成一条彩带，雨后的彩虹也是这样来的：玻璃和水对紫光的:term[折射率]{id="physics.electromagnetism.refractive-index"}（refractive index）比对红光的大。折射率为什么随频率变？水的:term[相对介电常量]{id="physics.electromagnetism.relative-permittivity"}（relative permittivity）从静电时的$80$降到可见光频率下的约$1.8$，中间发生了什么？有没有折射率随频率增大反而变小的情形？

## 讲解

### 束缚电子的振子模型

介质里的电子被原子核和别的电子拉在平衡位置附近，:term[电场]{id="physics.electromagnetism.electric-field"}（electric field）把它拉开一点，它就像弹簧上的小球一样被拉回来；:term[电磁波]{id="physics.electromagnetism.em-wave"}（electromagnetic wave）的电场来回变，电子就做受迫振动（driven oscillation，见[受迫振动与共振](lesson:physics.oscillations-waves.driven-oscillations)）。电子振动形成的:term[电偶极矩]{id="physics.electromagnetism.dipole-moment"}（electric dipole moment）加起来就是:term[极化强度]{id="physics.electromagnetism.polarization"}（polarization density），它和电场之比决定了:term[介电常量]{id="physics.electromagnetism.permittivity"}（permittivity）。复数表示的约定和[交流电路与阻抗](lesson:physics.electromagnetism.ac-circuits)一样，量都是$\operatorname{Re}\bigl(\tilde Xe^{i\omega t}\bigr)$的形式。

::anchor{id="thm-oscillator-model"}
定理（色散的振子模型）：设介质里单位体积有$N$个电子，每个电子受到恢复力（restoring force）$-m\omega_0^2x$和阻尼力（damping force）$-m\gamma\dot x$，介质足够稀薄，电子感受到的就是电磁波的电场，:term[磁场]{id="physics.electromagnetism.magnetic-field"}（magnetic field）的力可以不计；那么对角频率为$\omega$的电磁波，介质的:term[相对介电常量]{id="physics.electromagnetism.relative-permittivity"}是复数$\tilde\varepsilon_{\mathrm r}=1+\frac{Ne^2}{m\varepsilon_0}\cdot\frac{1}{\omega_0^2-\omega^2+i\gamma\omega}$。

证明思路：电场是$\operatorname{Re}\bigl(\tilde Ee^{i\omega t}\bigr)$，电子的运动方程是$m\ddot x+m\gamma\dot x+m\omega_0^2x=-eE$。稳态时$x=\operatorname{Re}\bigl(\tilde xe^{i\omega t}\bigr)$，对时间求导是乘以$i\omega$，得$\tilde x=-\frac{e\tilde E}{m(\omega_0^2-\omega^2+i\gamma\omega)}$。每个电子的电偶极矩是$-e\tilde x$，极化强度$\tilde P=-Ne\tilde x$，由$\tilde\varepsilon_{\mathrm r}=1+\frac{\tilde P}{\varepsilon_0\tilde E}$即得。

相对介电常量成了复数，[导体中的电磁波与趋肤效应](lesson:physics.electromagnetism.skin-effect#thm-conductor-wave)里的推导照样适用：介质不显磁性时:term[复波数]{id="physics.electromagnetism.complex-wave-number"}（complex wave number）$\tilde k=\frac\omega c\sqrt{\tilde\varepsilon_{\mathrm r}}=k-i\kappa$，实部给出:term[折射率]{id="physics.electromagnetism.refractive-index"}$n=\frac{ck}{\omega}$，虚部$\kappa$给出吸收，:term[强度]{id="physics.electromagnetism.intensity"}（intensity）按$e^{-2\kappa z}$衰减。阻尼$\gamma$代表电子振动的能量被碰撞、辐射等带走，正是它让电磁波被吸收。:term[导体]{id="physics.electromagnetism.conductor"}（conductor）是这个模型的特例：自由电子没有恢复力，$\omega_0=0$，把:term[电导率]{id="physics.electromagnetism.conductivity"}（electrical conductivity）写进介电常量就是$\tilde\varepsilon=\varepsilon-\frac{i\sigma}{\omega}$。

真实的原子、分子里电子有好几种束缚方式，各有各的$\omega_0$和$\gamma$，$\tilde\varepsilon_{\mathrm r}-1$是几项这样的式子之和；分子和晶格里离子的振动也是振子，共振（resonance）在红外。玻璃、水的电子共振都在紫外。

### 正常色散和反常色散

::anchor{id="def-dispersion"}
介质的:term[折射率]{id="physics.electromagnetism.refractive-index"}随频率变化的现象叫作色散（dispersion）；折射率随频率增大而增大叫作正常色散（normal dispersion），随频率增大而减小叫作反常色散（anomalous dispersion）。

为什么这样定义：白光里各种频率的光在介质里速度不同，折射时偏折不同，色散把它们分开（见[棱镜与色散](lesson:physics.optics.prisms-dispersion)）。离共振频率远时阻尼可以不计，$\omega<\omega_0$时$\tilde\varepsilon_{\mathrm r}$随$\omega$增大而增大，是正常色散；只有在共振频率附近、宽约$\gamma$的区间里，$n$随频率增大而减小，吸收也集中在这里。边界情况：真空没有色散；可见光离玻璃、水的电子共振还远，所以是正常色散，紫光的折射率比红光的大。

离共振频率很远（$\omega\ll\omega_0$）时，把$\frac{1}{\omega_0^2-\omega^2}$按$\frac{\omega^2}{\omega_0^2}$展开，稀薄介质的折射率近似为$n\approx A+\frac{B}{\lambda^2}$，$\lambda$是真空中的波长（第 5 题）。柯西（Augustin-Louis Cauchy）在 1836 年前后提出过这个公式，常用来拟合玻璃在可见光的折射率（例 1）。反常色散要到吸收很强的地方才看得到：1870 年，克里斯蒂安森（Christian Christiansen）发现品红的酒精溶液对红光的折射率比对紫光的大，品红强烈吸收绿光，共振正落在可见光里。

### 等离子体频率

::anchor{id="def-plasma-frequency"}
自由电子没有恢复力，$\omega_0=0$，阻尼不计时$\tilde\varepsilon_{\mathrm r}=1-\frac{\omega_{\mathrm p}^2}{\omega^2}$，其中$\omega_{\mathrm p}=\sqrt{\frac{Ne^2}{m\varepsilon_0}}$叫作等离子体频率（plasma frequency）。

为什么这样定义：$\omega_{\mathrm p}$是:term[电磁波]{id="physics.electromagnetism.em-wave"}能不能进入自由电子气（free electron gas）的分界。$\omega<\omega_{\mathrm p}$时$\tilde\varepsilon_{\mathrm r}<0$，$\tilde k$是纯虚数，场离开表面按指数衰减，电磁波全被反射回去（第 6 题）；$\omega>\omega_{\mathrm p}$时波能传播，:term[折射率]{id="physics.electromagnetism.refractive-index"}$n=\sqrt{1-\frac{\omega_{\mathrm p}^2}{\omega^2}}<1$。边界情况：$\omega\gg\omega_{\mathrm p}$时$n\to1$，电子来不及响应，介质对电磁波几乎透明。

地球高空的电离层（ionosphere）里，自由电子的密度约$10^{11}$到$10^{12}\,\mathrm{m^{-3}}$，等离子体频率是几兆赫兹：短波广播被电离层反射，能传到地平线以外很远的地方；调频广播、电视和卫星信号的频率高得多，直接穿过电离层（例 2）。金属里自由电子的密度约$10^{28}$到$10^{29}\,\mathrm{m^{-3}}$，等离子体频率在紫外，所以金属能反射可见光。1933 年，伍德（Robert W. Wood）发现钠、钾这些碱金属的薄膜能让波长较短的紫外线透过（第 4 题）。

### 水的介电常量随频率的变化

[电介质与极化](lesson:physics.electromagnetism.polarization)第 7 题说过，:term[电场]{id="physics.electromagnetism.electric-field"}变得快了，取向极化先跟不上，再快连电子云也跟不上。水正是这样：静电时:term[相对介电常量]{id="physics.electromagnetism.relative-permittivity"}约为$80$；频率升到约$20\,\mathrm{GHz}$附近，水分子的转动受周围分子牵制，跟不上电场，取向极化渐渐消失，这一带吸收很强，微波炉用的$2.45\,\mathrm{GHz}$就在这个吸收带的低频一侧。红外有分子振动的共振，水对红外很不透明；到了可见光只剩电子云的极化，$\varepsilon_{\mathrm r}\approx1.8$，吸收很弱，水是透明的（见[介质中的电磁波](lesson:physics.electromagnetism.waves-in-media)）；紫外又遇上电子的共振，吸收再次变强。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 2], y: [-0.6, 1.1] }
functions:
  - expr: "g*(1 - x^2)/((1 - x^2)^2 + g^2*x^2)"
    label: |
      折射率减 1，即$n-1$
  - expr: "g^2*x/((1 - x^2)^2 + g^2*x^2)"
    label: |
      吸收，即$\frac{c\kappa}{\omega}$
sliders:
  - name: g
    min: 0.05
    max: 0.5
    step: 0.05
    default: 0.2
    label: |
      阻尼和共振角频率之比$\frac{\gamma}{\omega_0}$
:::

横轴是:term[电磁波]{id="physics.electromagnetism.em-wave"}的角频率和共振角频率之比$\frac{\omega}{\omega_0}$。介质很稀薄，$n-1$和吸收都很小，纵轴的单位取$\frac{Ne^2}{2m\varepsilon_0\gamma\omega_0}$，这样吸收峰高为$1$。离共振远的地方$n$随频率增大，是正常色散；共振附近、宽约$\gamma$的区间里$n$随频率减小，是反常色散，吸收也集中在这里。阻尼越小，吸收峰越窄，$n-1$的起伏越陡。

## 例题

### 例 1　用柯西公式拟合玻璃的折射率

一种常用的光学玻璃对波长$656.3\,\mathrm{nm}$的红光:term[折射率]{id="physics.electromagnetism.refractive-index"}是$1.51432$，对$486.1\,\mathrm{nm}$的蓝光是$1.52238$。用$n=A+\frac{B}{\lambda^2}$求$A$、$B$，并估计它对$587.6\,\mathrm{nm}$的黄光的折射率。

**为什么想到这么做**：两个数据定两个常数，再代入第三个波长；可见光离玻璃的电子共振很远，柯西公式够用。

**推导**：两式相减，$B=\frac{1.52238-1.51432}{486.1^{-2}-656.3^{-2}}\,\mathrm{nm^2}\approx4.22\times10^3\,\mathrm{nm^2}$，$A=1.51432-\frac{B}{656.3^2}\approx1.5045$。$587.6\,\mathrm{nm}$时$n\approx1.5045+\frac{4.22\times10^3}{587.6^2}\approx1.5167$，和这种玻璃（BK7）手册上的$1.51680$只差约$6\times10^{-5}$。红光和蓝光的折射率只差约$0.008$，这已经足够让棱镜把白光分开。

### 例 2　电离层能反射哪些无线电波

电离层里电子密度最大的一层约为$1.0\times10^{12}\,\mathrm{m^{-3}}$。求它的等离子体频率$f_{\mathrm p}=\frac{\omega_{\mathrm p}}{2\pi}$；垂直向上发射的$5\,\mathrm{MHz}$短波和$100\,\mathrm{MHz}$调频广播，哪个会被反射回来？取$e=1.602\times10^{-19}\,\mathrm C$，$m=9.109\times10^{-31}\,\mathrm{kg}$，$\varepsilon_0=8.854\times10^{-12}\,\mathrm{F/m}$。

**为什么想到这么做**：电离层里的电子基本是自由的，频率低于$f_{\mathrm p}$的波进不去，被反射回来。

**推导**：$\omega_{\mathrm p}=\sqrt{\frac{1.0\times10^{12}\times(1.602\times10^{-19})^2}{9.109\times10^{-31}\times8.854\times10^{-12}}}\,\mathrm{rad/s}\approx5.64\times10^7\,\mathrm{rad/s}$，$f_{\mathrm p}\approx9.0\,\mathrm{MHz}$。$5\,\mathrm{MHz}$低于它，被反射回地面；$100\,\mathrm{MHz}$远高于它，:term[折射率]{id="physics.electromagnetism.refractive-index"}$\sqrt{1-0.09^2}\approx0.996$，几乎不受影响地穿过去。所以短波电台能传到很远的地方，调频广播却只能收到附近的；斜着射上去的波更容易被反射，实际能反射回来的最高频率比$f_{\mathrm p}$高一些。

## 常见误区

- 「:term[折射率]{id="physics.electromagnetism.refractive-index"}小于 1，光就比真空中的光速快，违反相对论。」大于$c$的是相速度（phase velocity），即波峰移动的速度，它不传递信号；等离子体里能量以群速度（group velocity）$cn$传播，比$c$小（见[波包与群速度](lesson:physics.oscillations-waves.group-velocity)和第 6 题）。相对论限制的是信号的速度，任何介质里信号的前沿都不会超过$c$。
- 「吸收最强的频率，折射率也最大。」稀薄介质在吸收峰处$n-1$恰好是零，折射率最大和最小的地方在吸收峰两侧。
- 「只有玻璃、水这样的物质才有色散。」有极化的介质都有色散，只有真空没有；空气的折射率只比$1$大万分之三左右，色散很小，但精密测量里照样要考虑。

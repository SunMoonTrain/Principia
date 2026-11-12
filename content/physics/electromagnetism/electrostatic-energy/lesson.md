---
id: physics.electromagnetism.electrostatic-energy
title: |
  静电场的能量
goal: |
  会求电荷系的静电能，并把它写成电场能量密度$\frac{\varepsilon_0}{2}E^2$的积分。
prerequisites: [physics.electromagnetism.conductors, physics.electromagnetism.gauss-differential]
minutes: 30
summary: |
  连续分布时，静电能是$\frac{\varepsilon_0}{2}E^2$的全空间积分，能量在电场里。
status: reviewed
---

## 这一节要回答的问题

把一组:term[电荷]{id="physics.electromagnetism.electric-charge"}（electric charge）从彼此离得很远的地方搬到一起，要做多少功？这份能量放在哪里：在电荷上，还是在它们周围的:term[电场]{id="physics.electromagnetism.electric-field"}（electric field）里？[电容器](lesson:physics.electromagnetism.capacitors)一节里，:term[平行板电容器]{id="physics.electromagnetism.capacitor"}（parallel-plate capacitor）的能量正好是$\frac{\varepsilon_0}{2}E^2$乘以两板之间的体积，这对任何电荷分布都成立吗？

## 讲解

### 点电荷系的静电能

先放下:term[点电荷]{id="physics.electromagnetism.point-charge"}（point charge）$q_1$，周围还没有:term[电场]{id="physics.electromagnetism.electric-field"}，不用做功。再把$q_2$从无穷远搬到离$q_1$为$r_{12}$处，外力做功$q_2\varphi_1(\vb r_2)=\frac{1}{4\pi\varepsilon_0}\frac{q_1q_2}{r_{12}}$，$\varphi_1$是$q_1$的:term[电势]{id="physics.electromagnetism.electric-potential"}（electric potential）。再搬$q_3$，要克服$q_1$、$q_2$两个的电场，做功$\frac{1}{4\pi\varepsilon_0}\Bigl(\frac{q_1q_3}{r_{13}}+\frac{q_2q_3}{r_{23}}\Bigr)$；依此类推，每一对:term[电荷]{id="physics.electromagnetism.electric-charge"}贡献一项。

::anchor{id="def-electrostatic-energy"}
把一组:term[电荷]{id="physics.electromagnetism.electric-charge"}从彼此相距无穷远、静止的状态慢慢搬到现在的位置，外力做的总功叫作这组电荷的:term[静电能]{id="physics.electromagnetism.electrostatic-energy"}（electrostatic energy）$U$。对点电荷系，$U=\sum_{i<j}\frac{1}{4\pi\varepsilon_0}\frac{q_iq_j}{r_{ij}}$，$r_{ij}$是$q_i$和$q_j$之间的距离。

为什么这样定义：静电力是保守力，外力做的功和搬运的顺序、路径都无关，只由最后的位置决定，所以它就是这组电荷的:term[电势能]{id="physics.electromagnetism.potential-energy"}（electric potential energy）。每一对电荷算一次，正是[电势](lesson:physics.electromagnetism.electric-potential)一节第 8 题说的两者共有的相互作用能。边界情况：同号电荷的这一项为正，推到一起要做功；异号电荷的为负，它们自己会靠拢。

::anchor{id="thm-energy-sum"}
定理（静电能的另一种写法）：$U=\frac12\sum_iq_i\varphi_i$，$\varphi_i$是除$q_i$以外的电荷在$q_i$处产生的电势；连续分布的电荷是$U=\frac12\int\rho\varphi\,\dd V$。

证明思路：$\frac12\sum_iq_i\varphi_i=\frac12\sum_i\sum_{j\ne i}\frac{1}{4\pi\varepsilon_0}\frac{q_iq_j}{r_{ij}}$，每一对在两个求和里各出现一次，乘以$\frac12$正好每对一次。连续分布时把求和换成积分；一小块电荷自己在自己所在处产生的电势，随这一块变小而趋于零，所以不用特意扣掉。

:term[导体]{id="physics.electromagnetism.conductor"}（conductor）上的电势处处相同，$\frac12\int\rho\varphi\,\dd V$变成$\frac12\sum_kQ_k\varphi_k$，对每个导体求和。:term[电容器]{id="physics.electromagnetism.capacitor"}（capacitor）的两极板（plate）带$\pm Q$，得到$\frac12Q(\varphi_+-\varphi_-)$，正是[电容器](lesson:physics.electromagnetism.capacitors#thm-capacitor-energy)一节的结果。

### 能量密度

把$\rho=\varepsilon_0\divg\vb E$代进$\frac12\int\rho\varphi\,\dd V$。在直角坐标里逐项用乘积的求导法则，$\divg(\varphi\vb E)=\varphi\divg\vb E+\vb E\cdot\nabla\varphi$，而$\nabla\varphi=-\vb E$，所以$\varphi\divg\vb E=\divg(\varphi\vb E)+E^2$。

::anchor{id="thm-field-energy"}
定理（:term[静电能]{id="physics.electromagnetism.electrostatic-energy"}写成:term[电场]{id="physics.electromagnetism.electric-field"}的积分）：:term[电荷]{id="physics.electromagnetism.electric-charge"}连续分布在有限区域里、:term[体电荷密度]{id="physics.electromagnetism.charge-density"}（volume charge density）处处有限时，$U=\frac{\varepsilon_0}{2}\int E^2\,\dd V$，积分遍及全空间。

证明思路：$U=\frac{\varepsilon_0}{2}\int_V\bigl[\divg(\varphi\vb E)+E^2\bigr]\dd V$，$V$取一个很大的球，前一项由散度定理（divergence theorem）化成球面上的$\oint\varphi\vb E\cdot\dd\vb a$。球的半径$R$很大时，$\varphi$像$\frac1R$、$E$像$\frac{1}{R^2}$那样衰减，球面积只按$R^2$增大，这一项随$\frac1R$趋于零。剩下的就是$\frac{\varepsilon_0}{2}\int E^2\,\dd V$。

::anchor{id="def-energy-density"}
单位体积的:term[电场]{id="physics.electromagnetism.electric-field"}里的$u=\frac{\varepsilon_0}{2}E^2$叫作电场的:term[能量密度]{id="physics.electromagnetism.energy-density"}（energy density），单位是$\mathrm{J/m^3}$。

为什么这样定义：静电学里把能量写成$\frac12\int\rho\varphi\,\dd V$还是$\int u\,\dd V$，总数一样：前者把能量算在电荷所在的地方，后者算在有电场的地方。电荷挪动以后，:term[电磁波]{id="physics.electromagnetism.em-wave"}（electromagnetic wave）离开电荷照样带着能量（见[电场](lesson:physics.electromagnetism.electric-field)一节），只有后一种说法讲得通，所以说能量储存在场里。边界情况：$u$处处不小于零，可两个异号:term[点电荷]{id="physics.electromagnetism.point-charge"}的静电能是负的，原因在下一段。

::anchor{id="def-self-energy"}
用$\int u\,\dd V$算单个点电荷，$E=\frac{1}{4\pi\varepsilon_0}\frac{q}{r^2}$，$\int_0^\infty\frac{\varepsilon_0}{2}E^2\cdot4\pi r^2\,\dd r=\frac{q^2}{8\pi\varepsilon_0}\int_0^\infty\frac{\dd r}{r^2}$，在$r\to0$处发散。它包含了把这个点电荷本身「攒」起来的能量，叫作自能（self-energy）。$\sum_{i<j}$的写法只算电荷之间的相互作用，不含自能；对体电荷密度有限的连续分布，两种写法完全一样（p5、p7）。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 4], y: [0, 4.2] }
functions:
  - expr: "min(x^4/R^6, 1/x^2)"
    label: |
      均匀带电的球体
  - expr: "(1 + sign(x - R))/2/x^2"
    label: |
      均匀带电的球面
sliders:
  - name: R
    min: 0.5
    max: 1.5
    step: 0.25
    default: 1
    label: |
      半径$R$
:::

动画画的是总:term[电荷]{id="physics.electromagnetism.electric-charge"}都为$Q$的均匀带电球体和球面，:term[电场]{id="physics.electromagnetism.electric-field"}能量在离中心不同距离处的分布：纵轴是半径$r$到$r+\dd r$的薄球壳里的能量$4\pi r^2u\,\dd r$除以$\dd r$，以$\frac{Q^2}{8\pi\varepsilon_0}$除以长度单位的平方为单位；横轴是$r$（图上写作$x$）。曲线下的面积就是:term[静电能]{id="physics.electromagnetism.electrostatic-energy"}。两者在外面一样，都按$\frac{1}{r^2}$衰减；球体里面还有一部分电场，多出一块能量。半径越小，能量越集中在中心附近，总能量也越大。

## 例题

### 例 1　均匀带电球体的静电能

半径为$R$的球体均匀带电$Q$，求它的:term[静电能]{id="physics.electromagnetism.electrostatic-energy"}：先按定义一层一层地搬:term[电荷]{id="physics.electromagnetism.electric-charge"}，再用:term[能量密度]{id="physics.electromagnetism.energy-density"}核对。

**为什么想到这么做**：按定义，从无穷远搬来一层层薄球壳，每次搬的:term[电荷]{id="physics.electromagnetism.electric-charge"}落在已经攒好的小球表面上，那里的:term[电势]{id="physics.electromagnetism.electric-potential"}是小球的电荷除以$4\pi\varepsilon_0r$。:term[电场]{id="physics.electromagnetism.electric-field"}里外都已知，能量密度积分也不难。

**推导**：攒到半径$r$时，小球带电$Q\frac{r^3}{R^3}$，表面的电势是$\frac{1}{4\pi\varepsilon_0}\frac{Qr^2}{R^3}$；再搬来$\dd q=\frac{3Qr^2}{R^3}\dd r$，做功$\frac{1}{4\pi\varepsilon_0}\frac{3Q^2r^4}{R^6}\dd r$，从$0$积到$R$得$U=\frac35\cdot\frac{1}{4\pi\varepsilon_0}\frac{Q^2}{R}$。用能量密度：球里$E=\frac{1}{4\pi\varepsilon_0}\frac{Qr}{R^3}$，积分得$\frac{1}{4\pi\varepsilon_0}\frac{Q^2}{10R}$；球外$E=\frac{1}{4\pi\varepsilon_0}\frac{Q}{r^2}$，积分得$\frac{1}{4\pi\varepsilon_0}\frac{Q^2}{2R}$。两部分相加也是$\frac35\cdot\frac{1}{4\pi\varepsilon_0}\frac{Q^2}{R}$。

### 例 2　孤立导体球的静电能

半径为$R$的孤立:term[导体]{id="physics.electromagnetism.conductor"}球带电$Q$，用$\frac12\sum_kQ_k\varphi_k$和:term[电场]{id="physics.electromagnetism.electric-field"}的能量各算一次它的:term[静电能]{id="physics.electromagnetism.electrostatic-energy"}。

**为什么想到这么做**：导体上的:term[电势]{id="physics.electromagnetism.electric-potential"}处处相同，第一种写法只要知道导体的电势；:term[电场]{id="physics.electromagnetism.electric-field"}只在球外，和:term[点电荷]{id="physics.electromagnetism.point-charge"}的一样。

**推导**：导体球的电势是$\frac{1}{4\pi\varepsilon_0}\frac QR$，$U=\frac12Q\varphi=\frac{1}{8\pi\varepsilon_0}\frac{Q^2}{R}$。电场的能量是$\int_R^\infty\frac{\varepsilon_0}{2}\Bigl(\frac{1}{4\pi\varepsilon_0}\frac{Q}{r^2}\Bigr)^2\cdot4\pi r^2\,\dd r=\frac{1}{8\pi\varepsilon_0}\frac{Q^2}{R}$，一样。它比:term[电荷]{id="physics.electromagnetism.electric-charge"}相同的均匀带电球体（例 1）小，因为球里面没有电场。

## 常见误区

- 「:term[静电能]{id="physics.electromagnetism.electrostatic-energy"}是$\sum_iq_i\varphi_i$。」这样每一对:term[电荷]{id="physics.electromagnetism.electric-charge"}算了两次，要乘以$\frac12$。
- 「两个:term[电场]{id="physics.electromagnetism.electric-field"}叠加，能量也相加。」:term[能量密度]{id="physics.electromagnetism.energy-density"}和$E^2$成正比，$(\vb E_1+\vb E_2)^2$里多出交叉项$2\vb E_1\cdot\vb E_2$，它正是两组电荷之间的相互作用能（p5）。
- 「能量密度处处非负，所以两个异号:term[点电荷]{id="physics.electromagnetism.point-charge"}的静电能不可能是负的。」$\int u\,\dd V$里含有每个点电荷的自能；扣掉自能，剩下的相互作用能可以是负的。
- 「能量储存在电场里，所以电荷挪走以后能量也跟着搬走。」静电学里两种说法给出同样的总数；电场的能量怎样流动，要到电磁场随时间变化时才讲得清（见[坡印亭定理](lesson:physics.electromagnetism.poynting-theorem)）。

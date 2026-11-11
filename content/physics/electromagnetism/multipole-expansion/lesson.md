---
id: physics.electromagnetism.multipole-expansion
title: |
  多极展开
goal: |
  会把远处的电势按单极、偶极、四极展开，并求出各阶的系数。
prerequisites: [physics.electromagnetism.electric-dipole, math.pde.legendre-polynomials]
minutes: 30
summary: |
  远处的电势按$\frac1r$的幂展开，系数依次是总电荷、偶极矩、四极矩。
status: reviewed
---

## 这一节要回答的问题

一团:term[电荷]{id="physics.electromagnetism.electric-charge"}（electric charge）在远处产生的:term[电势]{id="physics.electromagnetism.electric-potential"}（electric potential），最主要的部分是$\frac{1}{4\pi\varepsilon_0}\frac{Q}{r}$；总电荷为零时，主要部分由:term[电偶极矩]{id="physics.electromagnetism.dipole-moment"}（electric dipole moment）决定。要是电偶极矩也是零，例如[电偶极子](lesson:physics.electromagnetism.electric-dipole)一节第 8 题里的$+q$、$-2q$、$+q$呢？能不能把远处的电势一项一项地按$\frac1r$、$\frac{1}{r^2}$、$\frac{1}{r^3}$……展开，并说清每一项由电荷分布的什么性质决定？

## 讲解

### 两点距离的倒数怎样展开

:term[电荷]{id="physics.electromagnetism.electric-charge"}在$\vb r'$处，场点在$\vb r$处，:term[电势]{id="physics.electromagnetism.electric-potential"}里的关键是$\frac{1}{|\vb r-\vb r'|}$。取$z$轴沿$\vb r'$，记$\gamma$为$\vb r$和$\vb r'$的夹角。作为$\vb r$的函数，它在$\vb r\ne\vb r'$处满足:term[拉普拉斯方程]{id="physics.electromagnetism.laplace-equation"}（Laplace's equation，它就是$\vb r'$处一个:term[点电荷]{id="physics.electromagnetism.point-charge"}（point charge）的电势），绕$z$轴对称。

::anchor{id="thm-generating"}
定理（距离倒数的展开）：$r>r'$时，$\frac{1}{|\vb r-\vb r'|}=\sum_{l=0}^\infty\frac{r'^l}{r^{l+1}}P_l(\cos\gamma)$，$P_l$是勒让德多项式（Legendre polynomials）。

证明思路：在$r>r'$的区域里，它在无穷远处趋于零，按[球坐标下的分离变量与勒让德多项式](lesson:math.pde.legendre-polynomials)里轴对称的通解，只能是$\sum_l\frac{B_l}{r^{l+1}}P_l(\cos\gamma)$。在$z$轴上（$\gamma=0$，$P_l(1)=1$），它等于$\frac{1}{r-r'}=\frac1r\cdot\frac{1}{1-r'/r}=\sum_l\frac{r'^l}{r^{l+1}}$，所以$B_l=r'^l$。系数定了，展开对所有$\gamma$都成立。

### 多极展开

把展开代进连续分布:term[电荷]{id="physics.electromagnetism.electric-charge"}的:term[电势]{id="physics.electromagnetism.electric-potential"}$\varphi(\vb r)=\frac{1}{4\pi\varepsilon_0}\int\frac{\rho(\vb r')}{|\vb r-\vb r'|}\dd V'$，对每个$l$积分。电荷都在半径$a$以内时，在$r>a$处，每一项都随$r$按固定的幂次衰减，系数只和电荷分布有关。

::anchor{id="thm-multipole"}
定理（:term[多极展开]{id="physics.electromagnetism.multipole-expansion"}，multipole expansion）：电荷都在原点附近半径$a$以内时，$r>a$处的:term[电势]{id="physics.electromagnetism.electric-potential"}是$\varphi(\vb r)=\frac{1}{4\pi\varepsilon_0}\sum_{l=0}^\infty\frac{1}{r^{l+1}}\int r'^lP_l(\cos\gamma)\rho(\vb r')\,\dd V'$。$l=0$、$1$、$2$的项分别叫作单极项（monopole）、偶极项（dipole）、四极项（quadrupole）。

证明思路：把上一个定理的展开代进积分，交换求和与积分的次序。$r>a\ge r'$，级数的各项按$\bigl(\frac{r'}{r}\bigr)^l$衰减，所以收敛，越远收敛得越快。

前两项正是已经认识的：$l=0$时$P_0=1$，积分是总:term[电荷]{id="physics.electromagnetism.electric-charge"}$Q$，单极项是$\frac{1}{4\pi\varepsilon_0}\frac Qr$；$l=1$时$r'P_1(\cos\gamma)=\uv r\cdot\vb r'$，积分是$\uv r\cdot\vb p$，$\vb p=\int\vb r'\rho\,\dd V'$是:term[电偶极矩]{id="physics.electromagnetism.dipole-moment"}，偶极项是$\frac{1}{4\pi\varepsilon_0}\frac{\vb p\cdot\uv r}{r^2}$。

### 电四极矩

$l=2$时，$r'^2P_2(\cos\gamma)=\frac{3(\uv r\cdot\vb r')^2-r'^2}{2}$。把$\uv r\cdot\vb r'=\sum_i\hat r_ix_i'$代进去，积分就拆成一组只和:term[电荷]{id="physics.electromagnetism.electric-charge"}分布有关的数，乘以$\uv r$的分量。

::anchor{id="def-quadrupole"}
电荷分布的:term[电四极矩]{id="physics.electromagnetism.quadrupole-moment"}（electric quadrupole moment）是一组数$Q_{ij}=\int\bigl(3x_i'x_j'-r'^2\delta_{ij}\bigr)\rho(\vb r')\,\dd V'$，$i$、$j$各取$x$、$y$、$z$，$i=j$时$\delta_{ij}=1$，否则为$0$；四极项是$\frac{1}{4\pi\varepsilon_0}\frac{1}{2r^3}\sum_{i,j}Q_{ij}\hat r_i\hat r_j$。

为什么这样定义：总电荷说的是电荷有多少，:term[电偶极矩]{id="physics.electromagnetism.dipole-moment"}说的是正负电荷的「中心」错开多少，电四极矩说的是电荷沿各个方向「拉长」或「压扁」了多少，远处:term[电势]{id="physics.electromagnetism.electric-potential"}里$\frac{1}{r^3}$那一项全由它决定。$Q_{xx}+Q_{yy}+Q_{zz}=\int(3r'^2-3r'^2)\rho\,\dd V'=0$，又$Q_{ij}=Q_{ji}$，所以只有$5$个独立的数。边界情况：分布绕$z$轴对称时，$Q_{xx}=Q_{yy}=-\frac12Q_{zz}$，其余为零，四极项化成$\frac{1}{4\pi\varepsilon_0}\frac{Q_{zz}P_2(\cos\theta)}{2r^3}$，只要一个数$Q_{zz}$。

和电偶极矩一样，电四极矩一般和原点的选取有关；只有总电荷和电偶极矩都为零时，它才和原点无关（p5）。所以远处的电势由第一个不为零的那一阶决定，这一阶的系数是电荷分布本身的性质。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 4], y: [0, 3] }
functions:
  - expr: "1/abs(x - 1)"
    label: |
      精确的电势
  - expr: "sum(k, 0, N, 1/x^(k + 1))"
    label: |
      展开到第$N$项
sliders:
  - name: N
    min: 0
    max: 6
    step: 1
    default: 1
    label: |
      展开到$l=N$
:::

动画画的是$z$轴上$z=a$处一个:term[点电荷]{id="physics.electromagnetism.point-charge"}在$z$轴上产生的:term[电势]{id="physics.electromagnetism.electric-potential"}，横轴是场点的$z$坐标（以$a$为单位，图上写作$x$），电势以$\frac{1}{4\pi\varepsilon_0}\frac qa$为单位。相对原点，这个:term[电荷]{id="physics.electromagnetism.electric-charge"}的各阶矩都不为零，展开式在轴上就是$\sum_l\frac{a^l}{z^{l+1}}$。$x>1$时，项数越多越接近精确值，离得越远，前一两项就够了；$x<1$时，场点比电荷离原点还近，加的项越多偏得越远，展开不能用。

## 例题

### 例 1　直线四极子（linear quadrupole）

$+q$、$-2q$、$+q$依次放在$z$轴上$z=d$、$0$、$-d$处。求它的各阶矩和远处的:term[电势]{id="physics.electromagnetism.electric-potential"}。

**为什么想到这么做**：先看总:term[电荷]{id="physics.electromagnetism.electric-charge"}和:term[电偶极矩]{id="physics.electromagnetism.dipole-moment"}，它们为零，远处由四极项决定；分布绕$z$轴对称，只要算$Q_{zz}$。

**推导**：$Q=q-2q+q=0$，$\vb p=qd\uv z+0+q(-d)\uv z=\vb 0$。$Q_{zz}=\sum_iq_i\bigl(3z_i^2-r_i^2\bigr)=q\cdot2d^2+q\cdot2d^2=4qd^2$，中间的电荷在原点，没有贡献。所以远处$\varphi\approx\frac{1}{4\pi\varepsilon_0}\frac{4qd^2}{2r^3}P_2(\cos\theta)=\frac{1}{4\pi\varepsilon_0}\frac{qd^2(3\cos^2\theta-1)}{r^3}$；在轴上是$\frac{1}{4\pi\varepsilon_0}\frac{2qd^2}{r^3}$，和[电偶极子](lesson:physics.electromagnetism.electric-dipole)一节第 8 题直接算的一样。

### 例 2　均匀带电的细圆环

半径为$R$的细圆环均匀带电$Q$，圆心在原点，环在$xy$平面上。求远处的:term[电势]{id="physics.electromagnetism.electric-potential"}，展开到四极项。

**为什么想到这么做**：圆环绕$z$轴对称，单极项、偶极项、四极项各只要一个数；轴上的电势可以精确算出，可以拿来核对。

**推导**：单极项是$\frac{1}{4\pi\varepsilon_0}\frac Qr$。环关于原点对称，$\vb p=\vb 0$。环上每一点$z'=0$、$r'=R$，$Q_{zz}=\int(0-R^2)\,\dd q=-QR^2$，所以$\varphi\approx\frac{1}{4\pi\varepsilon_0}\Bigl[\frac Qr-\frac{QR^2}{2r^3}P_2(\cos\theta)\Bigr]$。在轴上，精确的电势是$\frac{1}{4\pi\varepsilon_0}\frac{Q}{\sqrt{z^2+R^2}}=\frac{1}{4\pi\varepsilon_0}\frac Qz\Bigl(1-\frac{R^2}{2z^2}+\cdots\Bigr)$，前两项正好对上。

## 常见误区

- 「总:term[电荷]{id="physics.electromagnetism.electric-charge"}为零，远处就没有:term[电势]{id="physics.electromagnetism.electric-potential"}。」还有偶极项、四极项……，只是衰减得更快。
- 「:term[电四极矩]{id="physics.electromagnetism.quadrupole-moment"}和原点怎么取无关。」只有总电荷和:term[电偶极矩]{id="physics.electromagnetism.dipole-moment"}都为零时才是这样，一般要说明是对哪个点算的。
- 「:term[多极展开]{id="physics.electromagnetism.multipole-expansion"}在哪里都能用。」它要求场点比所有电荷都离原点远；离电荷近了，级数不收敛（几何图像）。
- 「四极项只由电荷离原点的距离决定。」它还和电荷在哪个方向上有关：同样的距离，沿轴拉长和在赤道上铺开，$Q_{zz}$的符号相反（例 1 和例 2）。

---
id: math.vector-calculus.triple-integrals
title: |
  三重积分
goal: |
  会在直角坐标下把三重积分化成累次积分，求立体的体积和质量。
prerequisites: [math.vector-calculus.double-integrals]
minutes: 35
summary: |
  三重积分把立体切成小块求和取极限，可以先穿线、也可以先切片。
status: reviewed
---

## 这一节要回答的问题

一块物体各处的密度不同，密度是$\rho(x,y,z)$，它的总质量是多少？一个立体被几张曲面围住，它的体积怎样算？:term[二重积分]{id="math.vector-calculus.double-integral"}（double integral）把平面区域切成小块，空间的立体能不能照样切成小盒子求和、取极限？算的时候又该怎样一层一层地积？

## 讲解

### 三重积分

::anchor{id="def-triple-integral"}
设$f$在长方体$B=[a,b]\times[c,d]\times[p,q]$上有定义。把三条边各分成小段，$B$就被分成许多小长方体，第$k$块的体积记作$\Delta V_k$，在里面任取一点$(x_k^*,y_k^*,z_k^*)$，作黎曼和（Riemann sum）$\sum_kf(x_k^*,y_k^*,z_k^*)\Delta V_k$。小长方体的最大边长趋于$0$时，如果不论怎样分、怎样取点，黎曼和都趋于同一个数，这个数就叫作$f$在$B$上的:term[三重积分]{id="math.vector-calculus.triple-integral"}（triple integral），记作$\iiint_Bf\,\dd V$，$\dd V$叫作:term[体积元]{id="math.vector-calculus.volume-element"}（volume element）。有界的立体$\Omega$照:term[二重积分]{id="math.vector-calculus.double-integral"}的办法处理：$f$在$\Omega$外补成$0$，再在包含$\Omega$的长方体上积。

为什么这样定义：$f$是密度时，$f(x_k^*,y_k^*,z_k^*)\Delta V_k$是一小块的质量，三重积分就是总质量；$f\equiv1$时，它是$\Omega$的体积。物理书里常只写一个积分号，例如电荷$\int_V\rho\,\dd V$，下标$V$表示在立体上积，仍是三重积分。$f$在$\Omega$上:term[连续]{id="math.vector-calculus.continuous"}（continuous）、$\Omega$的边界由几张连续的曲面组成时，三重积分一定存在（这里不证）。

### 化成累次积分

::anchor{id="thm-triple-iterated"}
**先穿线、再投影**　设立体$\Omega=\{(x,y,z):(x,y)\in D,\ \varphi_1(x,y)\le z\le\varphi_2(x,y)\}$，其中$D$是$\Omega$在$xy$平面上的投影，$\varphi_1$、$\varphi_2$在$D$上:term[连续]{id="math.vector-calculus.continuous"}，$f$在$\Omega$上连续，则$\iiint_\Omega f\,\dd V=\iint_D\Bigl(\int_{\varphi_1(x,y)}^{\varphi_2(x,y)}f(x,y,z)\dd z\Bigr)\dd A$。$D$再按[二重积分](lesson:math.vector-calculus.double-integrals)的办法化成:term[累次积分]{id="math.vector-calculus.iterated-integral"}（iterated integral），就是三层的累次积分。

**证明思路**：黎曼和可以先把同一根竖柱里的小长方体加起来：$\sum_{i,j}\Bigl(\sum_kf(x_i,y_j,z_k)\Delta z\Bigr)\Delta x\Delta y$。括号里是沿竖线$\int f\,\dd z$的黎曼和，外面是$D$上的:term[二重积分]{id="math.vector-calculus.double-integral"}的黎曼和。$\Omega$是长方体时，这就是三维的:term[富比尼定理]{id="math.vector-calculus.fubini-theorem"}（Fubini's theorem），六种积分次序都对。

::anchor{id="thm-slicing"}
**先切片、再积**　设$\Omega$夹在平面$z=p$和$z=q$之间，用平面$z=$常数截$\Omega$所得的截面记作$\Omega_z$，$f$在$\Omega$上:term[连续]{id="math.vector-calculus.continuous"}，则$\iiint_\Omega f\,\dd V=\int_p^q\Bigl(\iint_{\Omega_z}f(x,y,z)\,\dd A\Bigr)\dd z$。

为什么有两种拆法：先穿线是「一根根竖线」加起来，适合上下两张曲面都好写的立体；先切片是「一层层薄片」加起来，适合截面简单、或者$f$只和$z$有关的情形。$f\equiv1$时切片法给出$V=\int_p^qA(z)\dd z$，$A(z)$是截面面积，这就是一元时已知截面面积求体积。边界情况：竖线从一张曲面穿进、却从两张曲面穿出时，要把立体切成几块分别积。

## 几何图像

![斜视图，x 轴朝前下方、y 轴向右、z 轴向上。第一卦限里的四面体，顶点是 O(0, 0, 0)、(1, 0, 0)、(0, 1, 0)、(0, 0, 1)，斜面 x + y + z = 1 涂成浅蓝色；它在 xy 平面上的投影是三角形 D：x + y ≤ 1，涂成浅绿色。D 里的一点 (0.3, 0.2) 竖起一根蓝色线段，从 z = 0 到斜面上 z = 0.5。高度 z = 0.6 处画了一个棕色的截面三角形。下方两行字：穿线：在 D 里取一点，z 从 0 积到 1 − x − y；切片：高度 z 处的截面是三角形 x + y ≤ 1 − z。](tetrahedron.svg)

这是例 1、例 2 的四面体。蓝线是「先穿线」：$D$里每一点上方，立体从$z=0$延伸到斜面$z=1-x-y$，先对$z$积，再在$D$上积。棕色三角形是「先切片」：高度$z$处的截面是直角边长$1-z$的等腰直角三角形，面积$\frac{(1-z)^2}2$，先在截面上积，再对$z$积。

## 例题

### 例 1　四面体的体积

求第一卦限（first octant）里由坐标平面和平面$x+y+z=1$围成的四面体的体积。

**为什么想到这么做**：体积是$\iiint_\Omega1\,\dd V$。四面体在$xy$平面上的投影是三角形$D$：$x\ge0$、$y\ge0$、$x+y\le1$，每一点上方$z$从$0$到$1-x-y$，用先穿线的办法。

**推导**：$V=\iint_D(1-x-y)\,\dd A=\int_0^1\int_0^{1-x}(1-x-y)\dd y\dd x=\int_0^1\frac{(1-x)^2}2\dd x=\frac16$。和长方体比较：以$1$为边长的正方体，体积的$\frac16$。

### 例 2　密度随高度变化的四面体

例 1 的四面体密度是$\rho=z$（越高越密）。求它的质量。

**为什么想到这么做**：被积函数只和$z$有关，高度$z$处的截面是三角形$x+y\le1-z$，面积$\frac{(1-z)^2}2$已经知道，用先切片的办法，里层的:term[二重积分]{id="math.vector-calculus.double-integral"}不用真的去积。

**推导**：质量$m=\iiint_\Omega z\,\dd V=\int_0^1z\cdot\frac{(1-z)^2}2\dd z=\frac12\int_0^1(z-2z^2+z^3)\dd z=\frac12\Bigl(\frac12-\frac23+\frac14\Bigr)=\frac1{24}$。

## 常见误区

- 「:term[三重积分]{id="math.vector-calculus.triple-integral"}的积分限都是常数。」只有长方体是这样；一般的立体，里层的积分限依赖外层的变量，例如例 1 里$z$的上限是$1-x-y$。
- 「三重积分就是体积。」被积函数是$1$时才是体积；被积函数是密度时，它是质量（例 2）。
- 「物理里的$\int_V\rho\,\dd V$只有一个积分号，是一元积分。」下标$V$说明是在立体上积，$\dd V$是:term[体积元]{id="math.vector-calculus.volume-element"}，它就是三重积分。
- 「换一种积分次序，积分限照抄就行。」要先弄清立体的形状，再按新的次序重新写出每一层的上下限。

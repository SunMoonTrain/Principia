---
id: physics.electromagnetism.poisson-equation
title: |
  泊松方程与拉普拉斯方程
goal: |
  会写出电势满足的泊松方程，并说明没有电荷的区域里电势满足拉普拉斯方程。
prerequisites: [physics.electromagnetism.gauss-differential, math.vector-calculus.vector-identities, physics.electromagnetism.conductors]
minutes: 30
summary: |
  电势满足$\nabla^2\varphi=-\frac{\rho}{\varepsilon_0}$；没有电荷的地方$\nabla^2\varphi=0$。
status: reviewed
---

## 这一节要回答的问题

[高斯定律的微分形式](lesson:physics.electromagnetism.gauss-differential)讲的是:term[电场]{id="physics.electromagnetism.electric-field"}（electric field），而电场又是:term[电势]{id="physics.electromagnetism.electric-potential"}（electric potential）的负梯度。把两者合起来，一个标量函数$\varphi$就要满足一个方程，它是什么？没有:term[电荷]{id="physics.electromagnetism.electric-charge"}（electric charge）的地方，电势有什么特别的性质，为什么那里找不到电势的最高点和最低点？

## 讲解

### 泊松方程

把$\vb E=-\nabla\varphi$代进$\divg\vb E=\frac{\rho}{\varepsilon_0}$，得$\divg(\nabla\varphi)=-\frac{\rho}{\varepsilon_0}$。$\divg(\nabla\varphi)=\pdv{^2\varphi}{x^2}+\pdv{^2\varphi}{y^2}+\pdv{^2\varphi}{z^2}$就是拉普拉斯算子（Laplacian）$\nabla^2\varphi$（见[向量微分恒等式与拉普拉斯算子](lesson:math.vector-calculus.vector-identities)）。

::anchor{id="thm-poisson"}
定理（:term[泊松方程]{id="physics.electromagnetism.poisson-equation"}，Poisson's equation）：:term[静电场]{id="physics.electromagnetism.electric-field"}的:term[电势]{id="physics.electromagnetism.electric-potential"}满足$\nabla^2\varphi=-\frac{\rho}{\varepsilon_0}$，$\rho$是:term[体电荷密度]{id="physics.electromagnetism.charge-density"}（volume charge density）。

证明思路：上一段就是。这个方程最早出现在引力理论里：拉普拉斯（Pierre-Simon Laplace）指出物体外面的引力势（gravitational potential）满足$\nabla^2\Phi=0$，泊松（Siméon Denis Poisson）在 1813 年发表的文章里指出，物体内部要加上和密度成正比的一项。

一个方程管住了三个分量的电场，未知函数只有一个，这是电势的好处。反过来，:term[库仑定律]{id="physics.electromagnetism.coulomb-law"}（Coulomb's law）给出的电势$\varphi(\vb r)=\frac{1}{4\pi\varepsilon_0}\int\frac{\rho(\vb r')}{|\vb r-\vb r'|}\dd V'$确实满足它：由$\nabla\frac{1}{r}=-\frac{\vb r}{r^3}$和$\divg\frac{\vb r}{r^3}=4\pi\delta^3(\vb r)$（见[三维 δ 函数与点源](lesson:math.vector-calculus.delta-3d)），$\nabla^2\frac{1}{|\vb r-\vb r'|}=-4\pi\delta^3(\vb r-\vb r')$，代进积分正好得到$-\frac{\rho}{\varepsilon_0}$。

::anchor{id="thm-electrostatic-equations"}
定理（静电场的散度和旋度）：:term[静电场]{id="physics.electromagnetism.electric-field"}满足$\divg\vb E=\frac{\rho}{\varepsilon_0}$和$\curl\vb E=\vb 0$。

证明思路：第一个是:term[高斯定律]{id="physics.electromagnetism.gauss-law"}（Gauss's law）的微分形式。静电场是一个函数的负梯度，而任何函数的梯度的旋度（curl）都是零，$\curl\nabla\varphi=\vb 0$（见[向量微分恒等式与拉普拉斯算子](lesson:math.vector-calculus.vector-identities)），所以第二个成立。

### 拉普拉斯方程

::anchor{id="def-laplace-equation"}
没有:term[电荷]{id="physics.electromagnetism.electric-charge"}的区域里，:term[泊松方程]{id="physics.electromagnetism.poisson-equation"}变成$\nabla^2\varphi=0$，叫作:term[拉普拉斯方程]{id="physics.electromagnetism.laplace-equation"}（Laplace's equation）；满足它的函数叫作调和函数（harmonic function）。

为什么这样定义：静电学里的问题大多是这样的：电荷都在:term[导体]{id="physics.electromagnetism.conductor"}（conductor）上或者某个区域外面，要求的是没有电荷的那一片空间里的:term[电势]{id="physics.electromagnetism.electric-potential"}，那里只要解拉普拉斯方程。它的解很多，例如$\frac1r$（$r\ne0$）、$x$、$x^2-y^2$、$xy$都是；具体是哪一个，由区域边界上的条件决定（见[唯一性定理与镜像法](lesson:physics.electromagnetism.images-uniqueness)）。边界情况：一维的拉普拉斯方程$\dv{^2\varphi}{x^2}=0$只有直线解，两点之间的电势是线性的，正是两块大平行板之间的情形。

在球坐标$(r,\theta,\psi)$里，拉普拉斯算子是$\nabla^2\varphi=\frac{1}{r^2}\pdv{}{r}\Bigl(r^2\pdv{\varphi}{r}\Bigr)+\frac{1}{r^2\sin\theta}\pdv{}{\theta}\Bigl(\sin\theta\pdv{\varphi}{\theta}\Bigr)+\frac{1}{r^2\sin^2\theta}\pdv{^2\varphi}{\psi^2}$，其中$\theta$是和$z$轴的夹角；方位角（azimuth）记作$\psi$，因为$\varphi$已经是电势（这个式子的推导见[柱坐标与球坐标下的梯度、散度和旋度](lesson:math.vector-calculus.curvilinear-coordinates)）。只依赖$r$的函数，只剩第一项，它也可以由[高斯定律的微分形式](lesson:physics.electromagnetism.gauss-differential)例 1 的散度公式，加上$\nabla\varphi=\dv{\varphi}{r}\uv r$直接得到。

::anchor{id="thm-mean-value"}
定理（电势的平均值性质）：在没有:term[电荷]{id="physics.electromagnetism.electric-charge"}的区域里取一个球（连同球面都在这个区域里），:term[电势]{id="physics.electromagnetism.electric-potential"}在球面上的平均值等于球心的电势；所以在这个区域里面，电势没有极大值，也没有极小值。

证明思路：球面上电势的平均值$\bar\varphi(r)=\frac{1}{4\pi}\oint\varphi\,\dd\Omega$对半径求导，得$-\frac{1}{4\pi r^2}\oint\vb E\cdot\dd\vb a$，球里没有电荷，由:term[高斯定律]{id="physics.electromagnetism.gauss-law"}它是零；半径趋于零时平均值趋于球心的电势。如果球心是极大值点，附近球面上的电势都不超过它，平均值却等于它，只能处处相等，不是真正的极大值；极小值同理（[导体与静电平衡](lesson:physics.electromagnetism.conductors)第 5 题用的就是这个论证）。

这就把:term[恩肖定理]{id="physics.electromagnetism.earnshaw-theorem"}（Earnshaw's theorem，见[高斯定律的微分形式](lesson:physics.electromagnetism.gauss-differential#thm-earnshaw)）补全了：正的:term[点电荷]{id="physics.electromagnetism.point-charge"}（point charge）在电势为$\varphi$处的势能是$q\varphi$，要稳定平衡，就得在电势的极小值处，可没有电荷的地方电势没有极小值。电势的最高点和最低点总在区域的边界上，或者在电荷所在的地方。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-0.9, 0.9], y: [0, 10] }
functions:
  - expr: "1/abs(x - 1) + 1/abs(x + 1) + 2/sqrt(x^2 + 1)"
    label: |
      沿$x$轴
  - expr: "4/sqrt(x^2 + 1)"
    label: |
      沿$z$轴（横轴是$z$）
:::

动画画的是[电场](lesson:physics.electromagnetism.electric-field)一节第 6 题里的:term[电势]{id="physics.electromagnetism.electric-potential"}：四个相同的:term[正点电荷]{id="physics.electromagnetism.point-charge"}在$(\pm a,0,0)$和$(0,\pm a,0)$，横轴以$a$为单位（图上写作$x$），电势以$\frac{1}{4\pi\varepsilon_0}\frac{Q}{a}$为单位。原点附近没有:term[电荷]{id="physics.electromagnetism.electric-charge"}，电势满足:term[拉普拉斯方程]{id="physics.electromagnetism.laplace-equation"}：沿$x$轴（$y$轴也一样）原点是电势的最低点，沿$z$轴却是最高点，原点是一个鞍点（saddle point）。所以正电荷放在原点，沿$z$方向一挪就被推走。

## 例题

### 例 1　两块接地板之间的均匀电荷

两块接地的大:term[导体]{id="physics.electromagnetism.conductor"}板放在$x=0$和$x=d$，中间均匀分布着:term[体电荷密度]{id="physics.electromagnetism.charge-density"}为$\rho_0>0$的:term[电荷]{id="physics.electromagnetism.electric-charge"}。求两板之间的:term[电势]{id="physics.electromagnetism.electric-potential"}和最高的电势。

**为什么想到这么做**：板很大，电势只依赖$x$，:term[泊松方程]{id="physics.electromagnetism.poisson-equation"}变成只含$x$的方程$\dv{^2\varphi}{x^2}=-\frac{\rho_0}{\varepsilon_0}$；两板接地，给出两个边界条件$\varphi(0)=\varphi(d)=0$。

**推导**：积分两次，$\varphi=-\frac{\rho_0}{2\varepsilon_0}x^2+Ax+B$。由$\varphi(0)=0$得$B=0$，由$\varphi(d)=0$得$A=\frac{\rho_0d}{2\varepsilon_0}$，所以$\varphi=\frac{\rho_0}{2\varepsilon_0}x(d-x)$。最高的电势在正中间，$\varphi\bigl(\frac d2\bigr)=\frac{\rho_0d^2}{8\varepsilon_0}$；这里有电荷，电势才能有极值。

### 例 2　被屏蔽的点电荷

等离子体（plasma）里，一个正离子周围会聚集多一些:term[负电荷]{id="physics.electromagnetism.electric-charge"}，它的:term[电势]{id="physics.electromagnetism.electric-potential"}近似为$\varphi=\frac{1}{4\pi\varepsilon_0}\frac{q\,e^{-r/\lambda}}{r}$，$\lambda$是一个长度。求它周围（$r>0$）的:term[电荷密度]{id="physics.electromagnetism.charge-density"}和这些电荷的总量。

**为什么想到这么做**：电势只依赖$r$，拉普拉斯算子只剩径向那一项，$\nabla^2\varphi=\frac{1}{r^2}\dv{}{r}\Bigl(r^2\dv{\varphi}{r}\Bigr)$，它也等于$\frac1r\dv{^2(r\varphi)}{r^2}$；再由:term[泊松方程]{id="physics.electromagnetism.poisson-equation"}得电荷密度。

**推导**：$r\varphi=\frac{q}{4\pi\varepsilon_0}e^{-r/\lambda}$，$\nabla^2\varphi=\frac1r\dv{^2(r\varphi)}{r^2}=\frac{\varphi}{\lambda^2}$，所以$\rho=-\varepsilon_0\frac{\varphi}{\lambda^2}=-\frac{q}{4\pi\lambda^2}\frac{e^{-r/\lambda}}{r}$。它们的总量是$\int_0^\infty\rho\cdot4\pi r^2\,\dd r=-\frac{q}{\lambda^2}\int_0^\infty re^{-r/\lambda}\,\dd r=-q$：周围的负电荷正好把离子的电荷完全抵消，所以远处的电势比$\frac1r$衰减得快得多。

::anchor{id="def-debye"}
离子周围的电荷这样把它的:term[电场]{id="physics.electromagnetism.electric-field"}挡住的现象，叫作德拜屏蔽（Debye screening），$\lambda$叫作德拜长度（Debye length）。

## 常见误区

- 「$\nabla^2\varphi=0$的地方，:term[电势]{id="physics.electromagnetism.electric-potential"}是常量。」只有一维时它才是线性的；三维里$x^2-y^2$、$\frac1r$都满足:term[拉普拉斯方程]{id="physics.electromagnetism.laplace-equation"}，电势照样随位置变。
- 「:term[电场]{id="physics.electromagnetism.electric-field"}为零的点，电势一定是极大值或极小值。」几何图像里的原点电场为零，却是鞍点。
- 「没有:term[电荷]{id="physics.electromagnetism.electric-charge"}的区域里，电势可以在中间某处最高。」电势的最高点和最低点只能在区域的边界上，或者在电荷所在的地方。
- 「:term[泊松方程]{id="physics.electromagnetism.poisson-equation"}和:term[库仑定律]{id="physics.electromagnetism.coulomb-law"}是两套独立的规律。」库仑定律给出的电势就是泊松方程的解；泊松方程的好处在于能配合边界条件，求:term[导体]{id="physics.electromagnetism.conductor"}附近这类不知道电荷怎样分布的问题。

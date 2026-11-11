---
id: physics.electromagnetism.gauss-differential
title: |
  高斯定律的微分形式
goal: |
  会由散度定理得到$\divg\vb{E}=\frac{\rho}{\varepsilon_0}$，并用它由电场求电荷密度。
prerequisites: [physics.electromagnetism.gauss-applications, math.vector-calculus.delta-3d]
minutes: 30
summary: |
  一点处电场的散度，等于那里的电荷密度除以$\varepsilon_0$。
status: reviewed
---

## 这一节要回答的问题

:term[高斯定律]{id="physics.electromagnetism.gauss-law"}（Gauss's law）讲的是一整个闭合曲面上的:term[电通量]{id="physics.electromagnetism.electric-flux"}（electric flux）。能不能把它缩到一点上：知道一点附近的:term[电场]{id="physics.electromagnetism.electric-field"}（electric field），就知道那里有多少:term[电荷]{id="physics.electromagnetism.electric-charge"}（electric charge）？[电场](lesson:physics.electromagnetism.electric-field)一节的第 6 题里，三个方向的一次项系数加起来正好是零，这又是为什么？

## 讲解

### 散度与高斯定律

对任意闭合曲面$S$，:term[高斯定律]{id="physics.electromagnetism.gauss-law"}说$\oint_S\vb E\cdot\dd\vb a=\frac{Q_{\text{内}}}{\varepsilon_0}$，其中$Q_{\text{内}}=\int_V\rho\,\dd V$是$S$围住的区域$V$里的:term[电荷]{id="physics.electromagnetism.electric-charge"}，$\rho$是:term[体电荷密度]{id="physics.electromagnetism.charge-density"}（volume charge density）。另一方面，散度定理（divergence theorem）把同一个:term[电通量]{id="physics.electromagnetism.electric-flux"}写成体积分$\oint_S\vb E\cdot\dd\vb a=\int_V\divg\vb E\,\dd V$（见[高斯公式（散度定理）](lesson:math.vector-calculus.divergence-theorem)），其中散度（divergence）$\divg\vb E=\pdv{E_x}{x}+\pdv{E_y}{y}+\pdv{E_z}{z}$是一点附近单位体积穿出的电通量。两边都是对同一个区域的积分，被积的两个函数之间应当有关系。

::anchor{id="thm-gauss-differential"}
定理（高斯定律的微分形式，differential form of Gauss's law）：在体电荷密度$\rho$连续的地方，:term[电场]{id="physics.electromagnetism.electric-field"}的散度满足$\divg\vb E=\frac{\rho}{\varepsilon_0}$。

证明思路：对任意区域$V$，由散度定理和高斯定律，$\int_V\Bigl(\divg\vb E-\frac{\rho}{\varepsilon_0}\Bigr)\dd V=0$。假如某点$P$处括号里的量大于零，它连续，在$P$周围一个小球里也都大于零；取$V$为这个小球，积分就大于零，矛盾。小于零也一样，所以括号里的量处处为零。

反过来，把$\divg\vb E=\frac{\rho}{\varepsilon_0}$对任意区域积分，再用散度定理，就回到积分形式的高斯定律。所以两种形式说的是同一件事：积分形式管一整个闭合曲面，微分形式管每一点。

散度量的是:term[电场线]{id="physics.electromagnetism.field-line"}（electric field line）在一点附近发散的程度：$\divg\vb E>0$的地方有电场线出发，那里有正电荷；$\divg\vb E<0$的地方有电场线终止，那里有负电荷。没有电荷的地方$\divg\vb E=0$，电场线不会凭空出现或中断，这正是[电通量与高斯定律](lesson:physics.electromagnetism.gauss-law)里用电场线说的那件事。散度只管电场怎样发散，不管它有多强：:term[点电荷]{id="physics.electromagnetism.point-charge"}（point charge）外面的电场很强，散度却是零（见下一小节）。

### 点电荷与 δ 函数

:term[点电荷]{id="physics.electromagnetism.point-charge"}$q$在原点，:term[电场]{id="physics.electromagnetism.electric-field"}是$\vb E=\frac{q}{4\pi\varepsilon_0}\frac{\vb r}{r^3}$。在$r\ne0$处直接求导，$\pdv{}{x}\frac{x}{r^3}=\frac{1}{r^3}-\frac{3x^2}{r^5}$，三项加起来是$\frac{3}{r^3}-\frac{3r^2}{r^5}=0$，散度为零。可是包住原点的任何闭合曲面，:term[电通量]{id="physics.electromagnetism.electric-flux"}都是$\frac{q}{\varepsilon_0}$：散度全都集中在原点这一点上。

这正是三维$\delta$函数（three-dimensional delta function）描述的情形：$\divg\frac{\vb r}{r^3}=4\pi\delta^3(\vb r)$，$\delta^3(\vb r)$在原点以外处处为零，在任何包含原点的区域上积分都等于$1$（见[三维 δ 函数与点源](lesson:math.vector-calculus.delta-3d)）。

::anchor{id="def-point-density"}
位于$\vb r'$的点电荷$q$，:term[电荷密度]{id="physics.electromagnetism.charge-density"}写成$\rho(\vb r)=q\,\delta^3(\vb r-\vb r')$：它在$\vb r'$以外处处为零，在任何包含$\vb r'$的区域上积分都等于$q$。

为什么这样定义：这样写以后，点电荷和连续分布的:term[电荷]{id="physics.electromagnetism.electric-charge"}能用同一个$\rho$描述，积分形式里的$Q_{\text{内}}=\int_V\rho\,\dd V$照样成立。点电荷的电场满足$\divg\vb E=\frac{q}{4\pi\varepsilon_0}\cdot4\pi\delta^3(\vb r)=\frac{\rho}{\varepsilon_0}$，微分形式也照样成立，只是要按$\delta$函数的意思理解：对一个区域积分以后才有确定的值。边界情况：电荷分布在一个面上时，$\rho$也要用一维的$\delta$函数写（p7）。

### 恩肖定理

把:term[点电荷]{id="physics.electromagnetism.point-charge"}$q>0$放在没有:term[电荷]{id="physics.electromagnetism.electric-charge"}的区域里一个:term[电场]{id="physics.electromagnetism.electric-field"}为零的点$P$（取作原点），它受力为零，处于平衡。沿$x$轴挪一小段$x$，受力的$x$分量约为$q\pdv{E_x}{x}x$，要被推回来，需要$\pdv{E_x}{x}<0$；$y$、$z$方向也一样。可这里没有电荷，三个导数之和$\divg\vb E=0$，不可能都小于零，至少有一个方向推不回来。

::anchor{id="thm-earnshaw"}
定理（:term[恩肖定理]{id="physics.electromagnetism.earnshaw-theorem"}，Earnshaw's theorem）：在没有电荷的区域里，只受静电力作用的点电荷没有稳定的平衡位置。

证明思路：上面一段就是证明的主体；三个导数都为零时要看更高阶的项，结论不变（用:term[电势]{id="physics.electromagnetism.electric-potential"}（electric potential）的说法见[泊松方程与拉普拉斯方程](lesson:physics.electromagnetism.poisson-equation)）。[电场](lesson:physics.electromagnetism.electric-field)一节的第 6 题就是一个例子：四个点电荷中间的平衡点，在两个方向上稳定，在第三个方向上不稳定，三个系数之和为零。这个定理是恩肖（Samuel Earnshaw）在 1842 年发表的。

## 几何图像

:::anim{component="vector-field-2d"}
field: { x: "x / max(x^2 + y^2, R^2)", y: "y / max(x^2 + y^2, R^2)" }
range: { x: [-3, 3], y: [-3, 3] }
dt: 0.02
particles: 300
sliders:
  - name: R
    min: 0.5
    max: 2
    step: 0.25
    default: 1
    label: |
      圆柱的半径$R$
:::

动画画的是一根无限长、均匀带电的圆柱在横截面上的:term[电场]{id="physics.electromagnetism.electric-field"}：圆柱里电场和离轴的距离$s$成正比，圆柱外和$s$成反比（见[用高斯定律求对称电场](lesson:physics.electromagnetism.gauss-applications#thm-cylindrical)）。滑块改变圆柱的半径，单位长度的:term[电荷]{id="physics.electromagnetism.electric-charge"}不变。圆柱里，箭头越往外越长：每往外一圈，就有这一圈里的电荷发出的新的:term[电场线]{id="physics.electromagnetism.field-line"}，散度处处为正。圆柱外，箭头按$\frac1s$变短，一圈的周长却按$s$变长，穿出每一圈的:term[电通量]{id="physics.electromagnetism.electric-flux"}都一样，没有新的电场线，散度为零。

## 例题

### 例 1　由球对称的电场求电荷密度

某个球对称的:term[电荷]{id="physics.electromagnetism.electric-charge"}分布产生的:term[电场]{id="physics.electromagnetism.electric-field"}沿径向，$r\le a$时大小是$E_r=Ar^2$，$r>a$时是$E_r=\frac{Aa^4}{r^2}$，$A>0$是常量。求各处的:term[电荷密度]{id="physics.electromagnetism.charge-density"}和总电荷。

**为什么想到这么做**：电场已经知道，求电荷密度就是求散度。电场沿径向、大小只和$r$有关，在直角坐标里逐项求导很繁，不如先求出这种电场的散度：在以原点为心、半径从$r$到$r+\dd r$的薄球壳上用散度定理，穿出的:term[电通量]{id="physics.electromagnetism.electric-flux"}除以球壳的体积就是散度。

**推导**：从外表面穿出的电通量是$4\pi(r+\dd r)^2E_r(r+\dd r)$，从内表面穿进的是$4\pi r^2E_r(r)$，两者之差是$\dd\bigl(4\pi r^2E_r\bigr)$，球壳的体积是$4\pi r^2\,\dd r$，所以$\divg\vb E=\frac{1}{r^2}\dv{(r^2E_r)}{r}$。$r<a$时$\rho=\frac{\varepsilon_0}{r^2}\dv{(Ar^4)}{r}=4\varepsilon_0Ar$；$r>a$时$r^2E_r=Aa^4$是常量，$\rho=0$。总电荷是$\int_0^a4\varepsilon_0Ar\cdot4\pi r^2\,\dd r=4\pi\varepsilon_0Aa^4$，和外面的电场$\frac{1}{4\pi\varepsilon_0}\frac{Q}{r^2}=\frac{Aa^4}{r^2}$对得上。

### 例 2　由电场的形状看出两层电荷

某个层状区域里，:term[电场]{id="physics.electromagnetism.electric-field"}只有$x$分量，只依赖于$x$：$|x|<w$时$E_x=-E_0\Bigl(1-\frac{|x|}{w}\Bigr)$，$|x|\ge w$时$E_x=0$，$E_0>0$。求:term[电荷密度]{id="physics.electromagnetism.charge-density"}。二极管里 pn 结（p–n junction）附近的电场大致就是这个形状。

**为什么想到这么做**：电场只有$x$分量、只依赖于$x$，散度只剩$\dv{E_x}{x}$一项。

**推导**：$0<x<w$时$\dv{E_x}{x}=\frac{E_0}{w}$，$\rho=\frac{\varepsilon_0E_0}{w}$；$-w<x<0$时$\dv{E_x}{x}=-\frac{E_0}{w}$，$\rho=-\frac{\varepsilon_0E_0}{w}$；$|x|>w$时$\rho=0$。所以那里是一层:term[正电荷]{id="physics.electromagnetism.electric-charge"}挨着一层负电荷，各厚$w$，电荷密度大小相同，单位面积上的总电荷为零。电场从正的一层指向负的一层，在两层的交界处最强。

## 常见误区

- 「:term[电场]{id="physics.electromagnetism.electric-field"}为零的点，:term[电荷密度]{id="physics.electromagnetism.charge-density"}也为零。」均匀带电球体的球心电场为零，电荷密度却不是零；散度看的是电场在这一点附近怎样变化，不是电场本身的大小。
- 「电荷密度为零的地方，电场也为零。」:term[点电荷]{id="physics.electromagnetism.point-charge"}外面电荷密度为零，电场却不为零；那里只是没有:term[电场线]{id="physics.electromagnetism.field-line"}出发或终止，别处的电场线照样穿过。
- 「散度为零的电场，电场线是平行的。」点电荷外面的电场线向四面散开，散度却是零：电场随$\frac{1}{r^2}$变弱，正好抵消了散开。
- 「微分形式只对连续分布的:term[电荷]{id="physics.electromagnetism.electric-charge"}成立，点电荷要另说。」把点电荷的电荷密度写成$\delta$函数，微分形式照样成立。

---
id: math.vector-calculus.delta-3d
title: |
  三维 δ 函数与点源
goal: |
  会用三维$\delta$函数描述点源，并证明$\divg\frac{\uv{r}}{r^2}=4\pi\delta^3(\vb{r})$。
prerequisites: [math.vector-calculus.divergence-theorem, math.calculus.dirac-delta]
minutes: 35
summary: |
  点源的密度写成$\delta^3$；$\frac{\uv r}{r^2}$的散度是$4\pi\delta^3(\vb r)$。
status: reviewed
---

## 这一节要回答的问题

点电荷、质点把电荷或质量都集中在一点：密度在那一点以外处处为零，总量却不是零，这样的「密度」怎样写？$\frac{\uv r}{r^2}$在原点以外:term[散度]{id="math.vector-calculus.divergence"}（divergence）处处为零，可它穿过包住原点的球面的:term[通量]{id="math.vector-calculus.flux"}（flux）是$4\pi$，不是零。:term[散度定理]{id="math.vector-calculus.divergence-theorem"}（divergence theorem）在这里失效了吗？

## 讲解

### 一维的 δ 函数

一维的狄拉克$\delta$函数（Dirac delta function）可以看成越来越窄、和横轴围成的面积始终为$1$的尖峰的极限：$\delta(x)$在$x\ne0$处为零，$\int_{-\infty}^{\infty}\delta(x)\dd x=1$；$f$在$a$处连续（continuous）时，$\int_{-\infty}^{\infty}f(x)\delta(x-a)\dd x=f(a)$（见[狄拉克 δ 函数](lesson:math.calculus.dirac-delta)）。它不是普通的函数，意思由积分规定。空间里集中在一点的源要的是同样的东西，只是积分换成体积分。

### 三维 δ 函数

::anchor{id="def-delta-3d"}
$\delta^3(\vb r)=\delta(x)\delta(y)\delta(z)$叫作:term[三维$\delta$函数]{id="math.vector-calculus.delta-3d"}（three-dimensional delta function）。它在原点以外处处为零；对空间里的区域$V$，原点在$V$里面时$\iiint_V\delta^3(\vb r)\dd V=1$，原点在$V$外面时积分为零。$f$在点$\vb a$处:term[连续]{id="math.vector-calculus.continuous"}时，$\iiint f(\vb r)\,\delta^3(\vb r-\vb a)\dd V=f(\vb a)$（积分区域包住$\vb a$），这叫作筛选性质（sifting property）。

为什么这样定义：把一个单位质量看成越来越小的均匀小球的极限。半径为$\varepsilon$的小球里密度是$\frac3{4\pi\varepsilon^3}$，外面是零，总质量始终是$1$；$\varepsilon\to0$时，密度在原点以外变成零，在包住原点的区域上积分始终是$1$，正是上面两条性质。$f$连续时，$f$乘这个密度的积分是$f$在小球上的平均值，趋于$f(\vb 0)$（第 6 题）。边界情况：原点正好落在$V$的边界上时，积分要看边界在原点附近的形状，例如半空间按小球的极限算是$\frac12$，所以总是让原点不在边界上。

::anchor{id="def-point-source"}
质量$m$集中在点$\vb a$时，密度写成$\rho=m\,\delta^3(\vb r-\vb a)$：区域$V$里的质量$\iiint_V\rho\,\dd V$在$V$包住$\vb a$时是$m$，不包住时是$0$。这样集中在一点的源叫作:term[点源]{id="math.vector-calculus.point-source"}（point source），点电荷、点状的热源也都这样写。

为什么要单起名字：:term[散度定理]{id="math.vector-calculus.divergence-theorem"}里的「源」是:term[散度]{id="math.vector-calculus.divergence"}，处处连续的散度没法描述集中在一点的量；有了$\delta^3$，点源和连续分布的源可以写在同一个积分里，例如两个点电荷加一团连续分布的电荷。边界情况：$\delta^3$的单位是长度的负三次方，乘上$m$才是密度的单位（第 8 题）。

### $\frac{\uv r}{r^2}$的散度

::anchor{id="thm-div-point-source"}
$\divg\frac{\uv r}{r^2}=4\pi\delta^3(\vb r)$。意思是：对每一个原点不在边界上的区域$V$，$\oint_{\partial V}\frac{\uv r}{r^2}\cdot\dd\vb a=4\pi\iiint_V\delta^3(\vb r)\dd V$，原点在$V$里面时两边都是$4\pi$，在外面时都是$0$。

**证明思路**：原点在$V$外面时，$\frac{\uv r}{r^2}$在$V$上有:term[连续]{id="math.vector-calculus.continuous"}的:term[偏导数]{id="math.vector-calculus.partial-derivative"}（partial derivative），:term[散度]{id="math.vector-calculus.divergence"}为零，由:term[散度定理]{id="math.vector-calculus.divergence-theorem"}，:term[通量]{id="math.vector-calculus.flux"}是零。原点在$V$里面时，挖掉一个以原点为球心、半径为$\varepsilon$的小球：剩下的区域里散度为零，所以穿过$\partial V$的通量等于穿过小球面的通量，小球面上取:term[外法向]{id="math.vector-calculus.outward-normal"}（outward normal）。小球面上$\frac{\uv r}{r^2}\cdot\vb n=\frac1{\varepsilon^2}$，面积$4\pi\varepsilon^2$，通量是$4\pi$（[高斯公式（散度定理）](lesson:math.vector-calculus.divergence-theorem)第 6 题）。

为什么是这个式子：散度定理照样成立，只是原点处有一个总量为$4\pi$的:term[点源]{id="math.vector-calculus.point-source"}，逐点求散度看不见它，$4\pi\delta^3$把它写了出来。把点源换成越来越小的一团，场的散度就是$4\pi$乘那一团的密度，团缩成一点时正好得到$4\pi\delta^3$（例 2）。物理里点电荷$q$的电场是$\frac q{4\pi\varepsilon_0}\frac{\uv r}{r^2}$，它的散度是$\frac q{\varepsilon_0}\delta^3(\vb r)$，正是:term[高斯定律]{id="physics.electromagnetism.gauss-law"}（Gauss's law）的微分形式在点电荷上的样子。

### $\frac1r$的梯度的散度

::anchor{id="thm-laplacian-inverse-r"}
$r\ne0$时$\nabla\frac1r=-\frac{\uv r}{r^2}$，所以$\divg\nabla\frac1r=-4\pi\delta^3(\vb r)$；平移以后，$\divg\nabla\frac1{|\vb r-\vb r'|}=-4\pi\delta^3(\vb r-\vb r')$（对$\vb r$求导，$\vb r'$固定）。$\divg\nabla$就是:term[拉普拉斯算子]{id="math.vector-calculus.laplacian"}（Laplacian）$\lap$，所以这两个式子也写成$\lap\frac1r=-4\pi\delta^3(\vb r)$和$\lap\frac1{|\vb r-\vb r'|}=-4\pi\delta^3(\vb r-\vb r')$。

**证明思路**：直接求:term[偏导数]{id="math.vector-calculus.partial-derivative"}，$\pdv{}x\frac1r=-\frac1{r^2}\pdv rx=-\frac x{r^3}$，另两个分量同理，$\nabla\frac1r=-\frac{\vb r}{r^3}=-\frac{\uv r}{r^2}$。再由上面的结论，$\divg\nabla\frac1r=\divg\bigl(-\frac{\uv r}{r^2}\bigr)=-4\pi\delta^3(\vb r)$；把原点挪到$\vb r'$，就是第二个式子。

为什么有用：在原点以外$\divg\nabla\frac1r=0$，$\frac1r$的:term[梯度]{id="math.vector-calculus.gradient"}（gradient）的:term[散度]{id="math.vector-calculus.divergence"}全部集中在原点。所以把:term[点源]{id="math.vector-calculus.point-source"}的$\frac1{|\vb r-\vb r'|}$按密度$\rho(\vb r')$叠加起来，$f(\vb r)=\frac1{4\pi}\iiint\frac{\rho(\vb r')}{|\vb r-\vb r'|}\dd V'$满足$\lap f=-\rho$：对$\vb r$求梯度的散度、移进积分号，再用筛选性质（第 7 题）。这一步把$\delta^3$当普通函数在积分号下处理，严格的证明这里不给；电磁学由此从库仑定律得到电势满足的方程。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 3], y: [0, 6] }
functions:
  - expr: "3 * w^2 * x^2 / (x^2 + w^2)^2.5"
    label: |
      $4\pi r^2\delta_\varepsilon(r)$
  - expr: "x^3 / (x^2 + w^2)^1.5"
    label: |
      $M(r)$：半径$r$的球里的总量
sliders:
  - name: w
    min: 0.1
    max: 1
    step: 0.05
    default: 0.5
    label: |
      $\varepsilon$：尖峰的宽度
:::

图上横轴写作$x$，就是到原点的距离$r$。用的是例 2 里的$\delta_\varepsilon(\vb r)=\frac{3\varepsilon^2}{4\pi(r^2+\varepsilon^2)^{5/2}}$，它是$\delta^3$的一种近似。蓝色曲线是$4\pi r^2\delta_\varepsilon(r)$，它和横轴围成的面积始终是$1$，就是总量；橙色曲线是半径为$r$的球里的总量$M(r)$。把$\varepsilon$拉小，蓝色的峰变窄变高，橙色曲线在每一个$r>0$处都趋于$1$：总量越来越集中到原点，这就是:term[三维$\delta$函数]{id="math.vector-calculus.delta-3d"}。

## 例题

### 例 1　筛选性质

求$\iiint_{\R^3}(x^2+yz+1)\,\delta^3(\vb r-\vb a)\dd V$，$\vb a=(1,2,3)$；再求积分区域换成以原点为球心、半径为$2$的球时的结果。

**为什么想到这么做**：被积函数:term[连续]{id="math.vector-calculus.continuous"}，用:term[三维$\delta$函数]{id="math.vector-calculus.delta-3d"}的筛选性质，只要看$\vb a$在不在积分区域里，在的话就把$\vb a$代进去。

**推导**：在全空间上积分，结果是$1^2+2\cdot3+1=8$。$|\vb a|=\sqrt{14}>2$，$\vb a$在半径为$2$的球外面，$\delta^3(\vb r-\vb a)$在球里处处为零，积分是$0$。

### 例 2　把点源抹开

$\varepsilon>0$，$\vb F_\varepsilon=\frac{\vb r}{(r^2+\varepsilon^2)^{3/2}}$。求$\divg\vb F_\varepsilon$，说明它是$4\pi\delta_\varepsilon$，其中$\delta_\varepsilon=\frac{3\varepsilon^2}{4\pi(r^2+\varepsilon^2)^{5/2}}$在全空间上的积分是$1$；再说明$\varepsilon\to0$时$\vb F_\varepsilon$趋于$\frac{\uv r}{r^2}$。

**为什么想到这么做**：$\vb F_\varepsilon$处处光滑，可以放心求:term[散度]{id="math.vector-calculus.divergence"}；$\varepsilon\to0$时它变回$\frac{\vb r}{r^3}$。看它的散度怎样变，就能看出$4\pi\delta^3$从哪里来。

**推导**：$\vb F_\varepsilon=g(r)\vb r$，$g=(r^2+\varepsilon^2)^{-3/2}$。按分量算：由:term[链式法则]{id="math.vector-calculus.chain-rule"}（chain rule），$\pdv gx=g'(r)\pdv rx=g'(r)\frac xr$，所以$\pdv{}x(gx)=g+\frac{x^2}rg'(r)$，$y$、$z$两个分量同理。三项相加，$\frac{x^2+y^2+z^2}r=r$，得$\divg\vb F_\varepsilon=3g+rg'(r)=\frac3{(r^2+\varepsilon^2)^{3/2}}-\frac{3r^2}{(r^2+\varepsilon^2)^{5/2}}=\frac{3\varepsilon^2}{(r^2+\varepsilon^2)^{5/2}}=4\pi\delta_\varepsilon$。

穿过半径为$R$的球面的:term[通量]{id="math.vector-calculus.flux"}是$4\pi R^2\cdot\frac R{(R^2+\varepsilon^2)^{3/2}}$，由:term[散度定理]{id="math.vector-calculus.divergence-theorem"}，它等于$4\pi$乘$\delta_\varepsilon$在球里的积分；$R\to\infty$时通量趋于$4\pi$，所以$\delta_\varepsilon$在全空间上的积分是$1$。$r>0$固定、$\varepsilon\to0$时，$\vb F_\varepsilon\to\frac{\vb r}{r^3}=\frac{\uv r}{r^2}$，而$\delta_\varepsilon$在原点以外趋于零：散度集中到原点，总量$4\pi$不变。

## 常见误区

- 「$\divg\frac{\uv r}{r^2}$逐点算出来是零，所以它就是零。」原点处没有定义；按积分看，它是$4\pi\delta^3(\vb r)$，包住原点的球面上:term[通量]{id="math.vector-calculus.flux"}是$4\pi$。
- 「$\delta^3(\vb 0)$是无穷大，所以积分也是无穷大。」:term[三维$\delta$函数]{id="math.vector-calculus.delta-3d"}不是普通函数，它的意思由积分规定，在包住原点的区域上积分是$1$。
- 「$\frac1r$满足$\lap\frac1r=0$，所以它对应的源是零。」只在原点以外成立；原点处$\lap\frac1r=-4\pi\delta^3(\vb r)$，正是一个:term[点源]{id="math.vector-calculus.point-source"}。
- 「$\delta^3(2\vb r)$和$\delta^3(\vb r)$一样。」换元$\vb u=2\vb r$，体积缩成$\frac18$，$\delta^3(2\vb r)=\frac18\delta^3(\vb r)$（第 8 题）。

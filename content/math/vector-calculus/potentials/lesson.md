---
id: math.vector-calculus.potentials
title: |
  标量势与矢量势
goal: |
  知道无旋场可以写成梯度、无散场可以写成旋度，并会在简单区域上求出势。
prerequisites: [math.vector-calculus.vector-identities, math.vector-calculus.stokes-theorem]
minutes: 40
summary: |
  全空间上无旋场是梯度、无散场是旋度；区域有洞就不一定。
status: reviewed
---

## 这一节要回答的问题

:term[梯度]{id="math.vector-calculus.gradient"}（gradient）的:term[旋度]{id="math.vector-calculus.curl"}（curl）恒为零，旋度的:term[散度]{id="math.vector-calculus.divergence"}（divergence）恒为零（[向量微分恒等式与拉普拉斯算子](lesson:math.vector-calculus.vector-identities)）。反过来，一个:term[无旋场]{id="math.vector-calculus.irrotational-field"}（irrotational field）一定是某个函数的梯度吗？一个:term[无散场]{id="math.vector-calculus.divergence-free-field"}（divergence-free field）一定是某个场的旋度吗？如果是，怎样把那个函数、那个场求出来？

## 讲解

### 星形区域

::anchor{id="def-star-shaped"}
区域$D$里有一点$\vb r_0$，$D$里每一点和$\vb r_0$的连线都整个落在$D$里，就说$D$是以$\vb r_0$为中心的星形区域（star-shaped region）。全空间、球、长方体都是，中心可以取里面任何一点。

为什么这样定义：下面两个构造都是沿着从$\vb r_0$出发的线段积分，线段要整个留在区域里，式子才有意义。星形区域一定是:term[单连通区域]{id="math.vector-calculus.simply-connected-region"}（simply connected region）：每条:term[闭曲线]{id="math.vector-calculus.closed-curve"}（closed curve）都能沿着连线收缩到$\vb r_0$。边界情况：去掉$z$轴的空间不是星形区域，绕$z$轴的圈缩不成一点；去掉一个点的空间也不是星形区域，可它是单连通的。

### 标量势

::anchor{id="def-scalar-potential"}
$\vb F$是区域$D$上的:term[向量场]{id="math.vector-calculus.vector-field"}（vector field）。如果有函数$U$使$\vb F=-\nabla U$，$U$就叫作$\vb F$的:term[标量势]{id="math.vector-calculus.scalar-potential"}（scalar potential）。它和[保守场与路径无关](lesson:math.vector-calculus.conservative-fields)里的:term[势函数]{id="math.vector-calculus.potential-function"}（potential function）只差一个负号：势函数$f=-U$。

为什么这样定义：物理习惯取负号，力指向势能降低的方向，电场指向电势降低的方向。有了标量势，沿$D$里任何一条从$A$到$B$的曲线，$\int\vb F\cdot\dd\vb r=U(A)-U(B)$，只看两端。物理书常把标量势写成$\varphi$；这里$\varphi$是方位角（azimuth），所以记作$U$。边界情况：标量势只确定到差一个常数；场在某一点:term[旋度]{id="math.vector-calculus.curl"}不为零，就没有标量势，因为$\curl(-\nabla U)=\vb 0$。

::anchor{id="thm-scalar-potential"}
$D$是:term[单连通区域]{id="math.vector-calculus.simply-connected-region"}，$\vb F$在$D$上有:term[连续]{id="math.vector-calculus.continuous"}（continuous）的:term[偏导数]{id="math.vector-calculus.partial-derivative"}（partial derivative），则$\vb F$有:term[标量势]{id="math.vector-calculus.scalar-potential"}当且仅当$\curl\vb F=\vb 0$。$D$是以$\vb r_0$为中心的星形区域时，可以取$U(\vb r)=-\int_0^1\vb F\bigl(\vb r_0+t(\vb r-\vb r_0)\bigr)\cdot(\vb r-\vb r_0)\dd t$。

**证明思路**：必要性是$\curl\nabla U=\vb 0$。充分性：用:term[斯托克斯公式]{id="math.vector-calculus.stokes-theorem"}（Stokes' theorem）可以证明（见[斯托克斯公式](lesson:math.vector-calculus.stokes-theorem#thm-simply-connected-space)），单连通区域上:term[无旋场]{id="math.vector-calculus.irrotational-field"}是:term[保守场]{id="math.vector-calculus.conservative-field"}（conservative field），保守场有势函数$f$，取$U=-f$。星形区域上的式子，就是沿线段从$\vb r_0$走到$\vb r$做的功取负号：参数取$\vb r_0+t(\vb r-\vb r_0)$，$0\le t\le1$。

### 矢量势

::anchor{id="def-vector-potential"}
如果有:term[向量场]{id="math.vector-calculus.vector-field"}$\vb A$使$\vb G=\curl\vb A$，$\vb A$就叫作$\vb G$的:term[矢量势]{id="math.vector-calculus.vector-potential"}（vector potential）。

为什么这样定义：:term[旋度]{id="math.vector-calculus.curl"}的:term[散度]{id="math.vector-calculus.divergence"}恒为零，所以只有:term[无散场]{id="math.vector-calculus.divergence-free-field"}才可能有矢量势；磁场处处无散，物理里就用矢量势描述磁场。边界情况：矢量势远不唯一，$\vb A$加上任何:term[梯度场]{id="math.vector-calculus.gradient-field"}（gradient field）$\nabla\chi$，旋度不变，因为$\curl\nabla\chi=\vb 0$；物理里的:term[规范变换]{id="physics.electromagnetism.gauge-transformation"}（gauge transformation）说的就是这件事。

::anchor{id="thm-vector-potential"}
$\vb G=(G_1,G_2,G_3)$在全空间或一个长方体上有:term[连续]{id="math.vector-calculus.continuous"}的:term[偏导数]{id="math.vector-calculus.partial-derivative"}，$\divg\vb G=0$，则$\vb G$有:term[矢量势]{id="math.vector-calculus.vector-potential"}。取定$x_0$、$y_0$（全空间上可以取$0$，长方体取它一个角的坐标），可以令$\vb A=(0,\ A_2,\ A_3)$，$A_2=\int_{x_0}^xG_3(t,y,z)\dd t$，$A_3=-\int_{x_0}^xG_2(t,y,z)\dd t+\int_{y_0}^yG_1(x_0,s,z)\dd s$。

**证明思路**：先让$\vb A$的第一个分量为零，这是利用矢量势不唯一。$\curl\vb A$的第二、三个分量是$-\pdv{A_3}x=G_2$、$\pdv{A_2}x=G_3$，由微积分基本定理（fundamental theorem of calculus）直接成立。第一个分量是$\pdv{A_3}y-\pdv{A_2}z=-\int_{x_0}^x\bigl(\pdv{G_2}y+\pdv{G_3}z\bigr)\dd t+G_1(x_0,y,z)$（$\vb G$的偏导数连续，对$y$、$z$求导可以移进积分号，见[含参变量积分](lesson:math.analysis.parameter-integrals#thm-leibniz-rule)）；由$\divg\vb G=0$，被积函数是$-\pdv{G_1}t$，积分得$G_1(x,y,z)-G_1(x_0,y,z)$，再加上最后一项正好是$G_1$。

为什么有用：这给出了一个具体的求法（例 1）。更一般地，以原点为中心的星形区域上，$\vb A(\vb r)=\int_0^1t\,\vb G(t\vb r)\times\vb r\,\dd t$也是一个矢量势（第 5 题）。

### 区域有洞时

:term[无旋场]{id="math.vector-calculus.irrotational-field"}不一定有:term[标量势]{id="math.vector-calculus.scalar-potential"}：$\vb G=\frac{(-y,x,0)}{x^2+y^2}$在去掉$z$轴的空间里:term[旋度]{id="math.vector-calculus.curl"}为零，可绕$z$轴一圈的:term[环量]{id="math.vector-calculus.circulation"}（circulation）是$2\pi$；有标量势的话，沿:term[闭曲线]{id="math.vector-calculus.closed-curve"}的环量是$U(A)-U(A)=0$，所以它没有。无限长:term[螺线管]{id="physics.electromagnetism.solenoid"}（solenoid）外面的:term[磁矢势]{id="physics.electromagnetism.vector-potential"}（magnetic vector potential）就和这个场成正比：管外它旋度为零，却不是:term[梯度]{id="math.vector-calculus.gradient"}（第 7 题）。

:term[无散场]{id="math.vector-calculus.divergence-free-field"}不一定有:term[矢量势]{id="math.vector-calculus.vector-potential"}：$\frac{\uv r}{r^2}$在去掉原点的空间里:term[散度]{id="math.vector-calculus.divergence"}为零，可穿过单位球面的:term[通量]{id="math.vector-calculus.flux"}（flux）是$4\pi$。旋度场穿过:term[闭曲面]{id="math.vector-calculus.closed-surface"}（closed surface）的通量总是零（[斯托克斯公式](lesson:math.vector-calculus.stokes-theorem)），所以它没有矢量势（第 6 题）；去掉一条从原点出发的射线以后就有了（第 8 题）。粗略地说，无旋场有标量势要每条闭曲线都能缩成一点，无散场有矢量势要每张闭曲面都能缩成一点；后一句一般的证明这里不给。

## 几何图像

:::anim{component="vector-field-2d"}
field: { x: "(a*x - b*y) / max(x^2 + y^2, R^2)", y: "(a*y + b*x) / max(x^2 + y^2, R^2)" }
range: { x: [-3, 3], y: [-2, 2] }
dt: 0.02
particles: 400
sliders:
  - name: a
    min: -1
    max: 1
    step: 0.1
    default: 0
    label: |
      $a$：核里的源
  - name: b
    min: -1
    max: 1
    step: 0.1
    default: 0.6
    label: |
      $b$：核里的旋度
  - name: R
    min: 0.3
    max: 1
    step: 0.1
    default: 0.5
    label: |
      $R$：核的半径
:::

画的是和$z$无关的场在$xy$平面上的截面。半径为$R$的核外面，场是$\frac{a(x,y)+b(-y,x)}{x^2+y^2}$，处处无散又无旋；核里面的:term[散度]{id="math.vector-calculus.divergence"}是$\frac{2a}{R^2}$，:term[旋度]{id="math.vector-calculus.curl"}是$\frac{2b}{R^2}$。$a$那一部分在核外是$-\nabla(-a\ln s)$，有:term[标量势]{id="math.vector-calculus.scalar-potential"}；$b$那一部分绕核一圈的:term[环量]{id="math.vector-calculus.circulation"}是$2\pi b$，不管$R$取多大都一样，核外没有单值的标量势。只拉$b$，粒子绕着核转；只拉$a$，粒子沿射线往外跑（$a<0$时往里收）。

## 例题

### 例 1　求一个矢量势

$\vb G=(y,\ z,\ x)$。验证它是:term[无散场]{id="math.vector-calculus.divergence-free-field"}，并求它的一个:term[矢量势]{id="math.vector-calculus.vector-potential"}。

**为什么想到这么做**：$\divg\vb G=0+0+0=0$，$\vb G$在全空间上有:term[连续]{id="math.vector-calculus.continuous"}的:term[偏导数]{id="math.vector-calculus.partial-derivative"}，按上面的构造取$x_0=y_0=0$。这也回答了[向量微分恒等式与拉普拉斯算子](lesson:math.vector-calculus.vector-identities)第 7 题第（3）问：那里只判断了「可能」，这里把场找出来。

**推导**：$A_2=\int_0^xG_3(t,y,z)\dd t=\int_0^xt\,\dd t=\frac{x^2}2$，$A_3=-\int_0^xz\,\dd t+\int_0^ys\,\dd s=-xz+\frac{y^2}2$，所以$\vb A=\bigl(0,\ \frac{x^2}2,\ \frac{y^2}2-xz\bigr)$。验算：$\curl\vb A=\bigl(\pdv{A_3}y-\pdv{A_2}z,\ \pdv{A_1}z-\pdv{A_3}x,\ \pdv{A_2}x-\pdv{A_1}y\bigr)=(y,\ z,\ x)$。

### 例 2　沿线段求标量势

$\vb F=(2xy,\ x^2+z,\ y)$。说明它在全空间上有:term[标量势]{id="math.vector-calculus.scalar-potential"}，并用沿线段积分的式子求出$U$（取$U(\vb 0)=0$）。

**为什么想到这么做**：全空间是以原点为中心的星形区域，先验证$\curl\vb F=\vb 0$，再代进$U(\vb r)=-\int_0^1\vb F(t\vb r)\cdot\vb r\,\dd t$。

**推导**：$\curl\vb F=(1-1,\ 0-0,\ 2x-2x)=\vb 0$。$\vb F(t\vb r)=(2t^2xy,\ t^2x^2+tz,\ ty)$，和$\vb r=(x,y,z)$的点积（dot product）是$3t^2x^2y+2tyz$，对$t$从$0$积到$1$得$x^2y+yz$，所以$U=-x^2y-yz$。验算：$-\nabla U=(2xy,\ x^2+z,\ y)=\vb F$。

## 常见误区

- 「:term[无旋场]{id="math.vector-calculus.irrotational-field"}一定有:term[标量势]{id="math.vector-calculus.scalar-potential"}。」要区域单连通；去掉$z$轴的空间里，$\frac{(-y,x,0)}{x^2+y^2}$就没有（几何图像里的$b$）。
- 「:term[无散场]{id="math.vector-calculus.divergence-free-field"}一定是某个场的:term[旋度]{id="math.vector-calculus.curl"}。」区域里有「空腔」就不一定；$\frac{\uv r}{r^2}$在去掉原点的空间里就不是（第 6 题）。
- 「:term[矢量势]{id="math.vector-calculus.vector-potential"}只有一个。」加上任何:term[梯度场]{id="math.vector-calculus.gradient-field"}，旋度都不变；标量势也可以差一个常数。
- 「标量势和:term[势函数]{id="math.vector-calculus.potential-function"}是一回事。」差一个负号：$\vb F=-\nabla U$，势函数是$f=-U$，用到别的书时先看清它用哪一种。

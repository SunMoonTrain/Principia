---
id: math.vector-calculus.vector-identities
title: |
  向量微分恒等式与拉普拉斯算子
goal: |
  会用$\nabla$算子推导$\curl\nabla f=\vb{0}$、$\divg(\curl\vb{F})=0$等恒等式，并计算拉普拉斯算子。
prerequisites: [math.vector-calculus.curl-divergence]
minutes: 35
summary: |
  梯度的旋度、旋度的散度恒为零；梯度的散度是拉普拉斯算子。
status: reviewed
---

## 这一节要回答的问题

:term[梯度]{id="math.vector-calculus.gradient"}（gradient）、:term[散度]{id="math.vector-calculus.divergence"}（divergence）、:term[旋度]{id="math.vector-calculus.curl"}（curl）都是求:term[偏导数]{id="math.vector-calculus.partial-derivative"}（partial derivative），它们可以接连着用：先求梯度再求旋度，先求旋度再求散度，先求梯度再求散度。这些组合里，有没有一律等于零的？一元的乘积求导法则，在这三种运算里又变成什么样？

## 讲解

### 两个恒为零的组合

::anchor{id="thm-two-zeros"}
**两个恒等式**　设函数$f$和:term[向量场]{id="math.vector-calculus.vector-field"}（vector field）$\vb F$的各分量有:term[连续]{id="math.vector-calculus.continuous"}（continuous）的:term[二阶偏导数]{id="math.vector-calculus.second-partial-derivative"}（second-order partial derivative），则:term[梯度]{id="math.vector-calculus.gradient"}的:term[旋度]{id="math.vector-calculus.curl"}处处为零，$\curl(\nabla f)=\vb 0$；旋度的:term[散度]{id="math.vector-calculus.divergence"}也处处为零，$\divg(\curl\vb F)=0$。

**证明**：$\curl(\nabla f)$的第一个分量是$\pdv{}y f_z-\pdv{}z f_y=f_{zy}-f_{yz}$，由:term[施瓦茨定理]{id="math.vector-calculus.schwarz-theorem"}（Schwarz's theorem）为零，另两个分量同理。$\divg(\curl\vb F)=(R_y-Q_z)_x+(P_z-R_x)_y+(Q_x-P_y)_z$，展开的六项两两配成同一个函数的两个:term[混合偏导数]{id="math.vector-calculus.mixed-partial-derivative"}（mixed partial derivative）之差，也都为零。

为什么重要：它们给出了两个必要条件。:term[梯度场]{id="math.vector-calculus.gradient-field"}（gradient field）都是:term[无旋场]{id="math.vector-calculus.irrotational-field"}（irrotational field），所以旋度不为零的场不可能是梯度场；任何场的旋度都是:term[无散场]{id="math.vector-calculus.divergence-free-field"}（divergence-free field），所以散度不为零的场不可能是某个场的旋度。记法上，它们像向量的$\vb v\times\vb v=\vb 0$和$\vb v\cdot(\vb v\times\vb w)=0$：把$\nabla$当成向量，自己和自己叉积（cross product）为零。

边界情况：反过来不一定成立。$\frac{(-y,x)}{x^2+y^2}$在原点以外是无旋场，却不是梯度场；什么时候能反推，要看区域的形状，以后在[保守场与路径无关](lesson:math.vector-calculus.conservative-fields)里讲。

### 拉普拉斯算子

::anchor{id="def-laplacian"}
函数$f$的:term[梯度]{id="math.vector-calculus.gradient"}的:term[散度]{id="math.vector-calculus.divergence"}$\divg(\nabla f)=\pdv{^2f}{x^2}+\pdv{^2f}{y^2}+\pdv{^2f}{z^2}$记作$\lap f$，$\lap$叫作:term[拉普拉斯算子]{id="math.vector-calculus.laplacian"}（Laplacian）。平面上$\lap f=f_{xx}+f_{yy}$；对:term[向量场]{id="math.vector-calculus.vector-field"}，$\lap\vb F$指对每个分量求拉普拉斯算子。

为什么这样定义：$\lap f$量的是$f$在一点和它周围的平均值差多少。平面上，以$\vb p$为圆心、$r$为半径的圆上，$f$的平均值约是$f(\vb p)+\frac{r^2}4\lap f(\vb p)$（第 5 题）。$\lap f>0$时圆心比周围低，像碗底；$\lap f<0$时圆心比周围高，像山顶。

::anchor{id="def-harmonic"}
满足$\lap f=0$的函数叫作调和函数（harmonic function）：它在每一点都等于周围的平均值，没有比周围都低的坑，也没有比周围都高的包。例如$x^2-y^2$沿$x$方向向上弯、沿$y$方向向下弯，两者正好抵消；以后在偏微分方程里会专门讲它。

### 乘积的求导法则

::anchor{id="thm-product-rules"}
**乘积法则**　设$f$、$g$是函数，$\vb F$、$\vb G$是:term[向量场]{id="math.vector-calculus.vector-field"}，都有:term[连续]{id="math.vector-calculus.continuous"}的:term[偏导数]{id="math.vector-calculus.partial-derivative"}，则$\nabla(fg)=f\nabla g+g\nabla f$，$\divg(f\vb F)=f\,\divg\vb F+\nabla f\cdot\vb F$，$\curl(f\vb F)=f\,\curl\vb F+\nabla f\times\vb F$，$\divg(\vb F\times\vb G)=\vb G\cdot(\curl\vb F)-\vb F\cdot(\curl\vb G)$。

**证明思路**：按分量写开，每个乘积用一元的乘积求导法则。例如$\divg(f\vb F)$的第一项是$\pdv{}x(fP)=fP_x+f_xP$，三项加起来，第一部分是$f\,\divg\vb F$，第二部分是$\nabla f\cdot\vb F$。最后一条把$\vb F\times\vb G$的三个分量写出来求:term[散度]{id="math.vector-calculus.divergence"}，得到十二项，按导数落在$\vb F$上还是$\vb G$上分成两组（第 4 题可以用来验算）。

记法：每一条都是「两个因子轮流求导」，$\nabla$先作用在第一个因子上、再作用在第二个上。点积（dot product）、叉积里因子的次序照原样保持，叉积交换次序要变号，最后一条的负号就是从这里来的。

## 几何图像

![三幅等值线图并排，都以原点为中心、画到 ±2.2，灰色细线是函数的等值线，蓝色虚线是以原点为圆心、半径 1.2 的圆，原点有一个黑点。左图 f = x² + y²，等值线是同心圆，最外一圈标着 3.5；中图 f = x² − y²，等值线是双曲线；右图 f = −x² − y²，等值线也是同心圆，最外一圈标着 −3.5。每幅图下面两行字，分别是：f = x² + y²，∇²f = 4，圆上平均比圆心大；f = x² − y²，∇²f = 0，圆上平均等于圆心；f = −x² − y²，∇²f = −4，圆上平均比圆心小。](laplacian.svg)

三个函数在原点的值都是$0$。蓝色圆上$f$的平均值分别是$1.44$、$0$、$-1.44$，正好是$\frac{r^2}4\lap f$（$r=1.2$）：:term[拉普拉斯算子]{id="math.vector-calculus.laplacian"}比较的就是「周围的平均」和「中心」。

## 例题

### 例 1　验算恒等式

$f=x^2y+yz^3$。求$\nabla f$和$\lap f$，并验算$\curl(\nabla f)=\vb 0$。

**为什么想到这么做**：按定义逐个求:term[偏导数]{id="math.vector-calculus.partial-derivative"}；验算:term[旋度]{id="math.vector-calculus.curl"}时，每个分量都应当是同一对:term[混合偏导数]{id="math.vector-calculus.mixed-partial-derivative"}相减。

**推导**：$\nabla f=(2xy,\ x^2+z^3,\ 3yz^2)$。$\lap f=\pdv{}x(2xy)+\pdv{}y(x^2+z^3)+\pdv{}z(3yz^2)=2y+0+6yz$。旋度的三个分量是$\pdv{}y(3yz^2)-\pdv{}z(x^2+z^3)=3z^2-3z^2$、$\pdv{}z(2xy)-\pdv{}x(3yz^2)=0$、$\pdv{}x(x^2+z^3)-\pdv{}y(2xy)=2x-2x$，都是零。

### 例 2　$\frac1{|\vb r-\vb r'|}$的梯度

$\vb r'=(x',y',z')$是一个固定的点，记$\vb R=\vb r-\vb r'$，$R=|\vb R|$。求$\nabla\frac1R$（对$\vb r$求导）和$\nabla'\frac1R$（对$\vb r'$求导）；再对常向量$\vb J$求$\curl\frac{\vb J}R$。

**为什么想到这么做**：$\frac1R$是$R$的函数，$R$又是$x$的函数，先用一元的链式法则（chain rule）求$\pdv{}x\frac1R$，另两个分量同理。求$\curl\frac{\vb J}R$时，把它看成函数$\frac1R$乘:term[向量场]{id="math.vector-calculus.vector-field"}$\vb J$，套乘积法则。

**推导**：$R=\sqrt{(x-x')^2+(y-y')^2+(z-z')^2}$，$\pdv Rx=\frac{x-x'}R$，所以$\pdv{}x\frac1R=-\frac1{R^2}\cdot\frac{x-x'}R$，三个分量合起来$\nabla\frac1R=-\frac{\vb R}{R^3}$。对$x'$求导时$\pdv R{x'}=-\frac{x-x'}R$，符号相反，$\nabla'\frac1R=\frac{\vb R}{R^3}$。$\vb J$是常向量，$\curl\vb J=\vb 0$，由乘积法则$\curl\frac{\vb J}R=\frac1R\curl\vb J+\nabla\frac1R\times\vb J=\frac{\vb J\times\vb R}{R^3}$。电磁学里点电荷的电势、电流产生的磁场，算的都是这类式子。

## 常见误区

- 「$\lap f$就是$|\nabla f|^2$。」$\lap f=\divg(\nabla f)$是:term[二阶偏导数]{id="math.vector-calculus.second-partial-derivative"}之和，$|\nabla f|^2$是:term[一阶偏导数]{id="math.vector-calculus.partial-derivative"}的平方和。$f=x^2$时$\lap f=2$，而$|\nabla f|^2=4x^2$。
- 「$\curl(\curl\vb F)$也恒为零。」它等于$\nabla(\divg\vb F)-\lap\vb F$（第 6 题），一般不为零；例如$\vb F=(y^2,0,0)$时$\curl(\curl\vb F)=(-2,0,0)$。
- 「:term[旋度]{id="math.vector-calculus.curl"}为零的场一定是:term[梯度场]{id="math.vector-calculus.gradient-field"}。」恒等式只说梯度场无旋，反过来要看区域；$\frac{(-y,x)}{x^2+y^2}$在原点以外就是反例。
- 「$\curl(f\vb F)=f\,\curl\vb F+\vb F\times\nabla f$。」叉积的次序反了，差一个负号；$\nabla$先作用在$f$上，所以是$\nabla f\times\vb F$。

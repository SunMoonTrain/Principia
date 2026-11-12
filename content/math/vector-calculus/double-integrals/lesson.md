---
id: math.vector-calculus.double-integrals
title: |
  二重积分
goal: |
  会把二重积分化成累次积分，在矩形和一般区域上计算二重积分。
prerequisites: [math.vector-calculus.multivariable-limits, math.calculus.fundamental-theorem]
minutes: 35
summary: |
  二重积分是黎曼和的极限，连续时可以一层一层地积成累次积分。
status: reviewed
---

## 这一节要回答的问题

一座屋顶的高度是$z=f(x,y)$，地面是矩形$[a,b]\times[c,d]$，屋顶下面的空间有多大？一元的定积分（definite integral）把曲线下的面积切成细长条，用黎曼和（Riemann sum）逼近再取极限。平面区域能不能照样切成小块、取极限？这个极限又怎样算，能不能化成两次一元的定积分？

## 讲解

### 二重积分

::anchor{id="def-double-integral"}
设$f$在闭矩形（closed rectangle）$R=[a,b]\times[c,d]$上有定义。把$[a,b]$、$[c,d]$各分成小段，$R$就被分成许多小矩形，第$k$块的面积记作$\Delta A_k$，在里面任取一点$(x_k^*,y_k^*)$，作黎曼和$\sum_kf(x_k^*,y_k^*)\Delta A_k$。如果小矩形的最大边长趋于$0$时，不论怎样分、怎样取点，黎曼和都趋于同一个数，这个数就叫作$f$在$R$上的:term[二重积分]{id="math.vector-calculus.double-integral"}（double integral），记作$\iint_Rf\,\dd A$或$\iint_Rf(x,y)\,\dd x\dd y$，$\dd A$叫作:term[面积元]{id="math.vector-calculus.area-element"}（area element）。

为什么这样定义：$f\ge0$时，$f(x_k^*,y_k^*)\Delta A_k$是以小矩形为底、以$f$为高的细柱体的体积，黎曼和是这些细柱体拼成的近似，极限就是曲面下的体积。$f$是一块薄板每单位面积的质量时，二重积分是薄板的质量；$f\equiv1$时，它是$R$的面积。$f$在$R$上:term[连续]{id="math.vector-calculus.continuous"}（continuous）时二重积分一定存在（这里不证）；边界情况：曲面在$xy$平面下方的部分，算出来的体积是负的。

### 累次积分

::anchor{id="def-iterated-integral"}
固定$x$，先把$f(x,y)$当作$y$的函数从$c$积到$d$，得到$x$的函数$A(x)=\int_c^df(x,y)\dd y$；再把$A(x)$从$a$积到$b$，得到的$\int_a^b\Bigl(\int_c^df(x,y)\dd y\Bigr)\dd x$叫作:term[累次积分]{id="math.vector-calculus.iterated-integral"}（iterated integral），省掉括号写成$\int_a^b\int_c^df(x,y)\dd y\dd x$。里层的积分号和最靠里的$\dd y$配对。先对$x$、再对$y$积，就是另一种次序的$\int_c^d\int_a^bf(x,y)\dd x\dd y$。

为什么这样定义：$f\ge0$时，$A(x)$是用平面$x=$常数去截屋顶下的空间所得截面的面积；把截面面积沿$x$方向积起来，就是一片片薄片的体积之和。这样一个二元的问题被拆成了两次一元的定积分，每一次都能用牛顿-莱布尼茨公式（Newton-Leibniz formula）。

::anchor{id="thm-fubini"}
**:term[富比尼定理]{id="math.vector-calculus.fubini-theorem"}（Fubini's theorem）**　设$f$在闭矩形$R=[a,b]\times[c,d]$上:term[连续]{id="math.vector-calculus.continuous"}，则$\iint_Rf\,\dd A=\int_a^b\int_c^df(x,y)\dd y\dd x=\int_c^d\int_a^bf(x,y)\dd x\dd y$。

**证明思路**：把$[a,b]$分成$n$段、$[c,d]$分成$m$段，在每个小矩形里都取左下角，黎曼和可以先按列加起来：$\sum_i\Bigl(\sum_jf(x_i,y_j)\Delta y\Bigr)\Delta x$。括号里是$\int_c^df(x_i,y)\dd y$的黎曼和，$m\to\infty$时趋于$A(x_i)$；外面再对$i$求和，是$\int_a^bA(x)\dd x$的黎曼和。要说明这两步极限能合成一步取，严格的证明这里不给；先按行加起来，就得到另一种次序，两种次序相等的证明见[含参变量积分](lesson:math.analysis.parameter-integrals)。

特别地，$f(x,y)=g(x)h(y)$时，里层积分把另一个因子当常数提出来，$\iint_Rf\,\dd A=\int_a^bg(x)\dd x\cdot\int_c^dh(y)\dd y$。边界情况：$f$不连续时，两个累次积分可能都存在却不相等，见[含参变量积分](lesson:math.analysis.parameter-integrals)第 4 题。

### 一般区域

::anchor{id="def-integration-region"}
设$D$是平面上的有界区域，$f$在$D$上有定义。取一个包含$D$的闭矩形$R$，令$\tilde f$在$D$里等于$f$、在$D$外等于$0$，规定$\iint_Df\,\dd A=\iint_R\tilde f\,\dd A$，$D$叫作积分区域（region of integration）。

::anchor{id="thm-general-region"}
**一般区域上化成:term[累次积分]{id="math.vector-calculus.iterated-integral"}**　设$D=\{(x,y):a\le x\le b,\ \varphi_1(x)\le y\le\varphi_2(x)\}$，$\varphi_1$、$\varphi_2$在$[a,b]$上:term[连续]{id="math.vector-calculus.continuous"}，$f$在$D$上连续，则$\iint_Df\,\dd A=\int_a^b\int_{\varphi_1(x)}^{\varphi_2(x)}f(x,y)\dd y\dd x$。$D=\{(x,y):c\le y\le d,\ \psi_1(y)\le x\le\psi_2(y)\}$时同样有$\iint_Df\,\dd A=\int_c^d\int_{\psi_1(y)}^{\psi_2(y)}f(x,y)\dd x\dd y$。

**证明思路**：对$\tilde f$用:term[富比尼定理]{id="math.vector-calculus.fubini-theorem"}。$\tilde f$在$D$的边界上可能不连续，但不连续的点只在两条边界曲线上，结论照样成立（这里不证）；固定$x$时，$\tilde f(x,y)$只在$\varphi_1(x)\le y\le\varphi_2(x)$上不为零，所以里层只需从$\varphi_1(x)$积到$\varphi_2(x)$。

为什么要会两种写法：同一个区域常常两种方式都能描述，换一种次序时，积分限要重新从区域读出来，有时换过来里层才积得出来（例 2）。$f\equiv1$时得到$D$的面积$\int_a^b\bigl(\varphi_2(x)-\varphi_1(x)\bigr)\dd x$，就是一元时两条曲线之间的面积。边界情况：区域既不能写成上下两条曲线之间、也不能写成左右两条曲线之间时，把它切成几块，分别积再相加。

## 几何图像

![两幅图。左图是斜视图，x 轴朝前下方、y 轴向右、z 轴向上：地面矩形 0 ≤ x ≤ 1、0 ≤ y ≤ 2，上面是平面屋顶 z = 4 − x − y，画出顶面的轮廓和竖棱；平面 x = 0.5 截出的梯形截面涂成蓝色，里面写着 A(0.5)。右图是 xy 平面上的三角形区域 0 ≤ y ≤ x ≤ 1，涂成浅绿色；蓝色竖条在 x = 0.6 处，从 y = 0 到 y = 0.6，旁边写着「竖条：y 从 0 到 x」；棕色横条在 y = 0.3 处，从 x = 0.3 到 x = 1，旁边写着「横条：x 从 y 到 1」。下方两行字：左：平面 x = 0.5 截出的截面面积是 A(0.5)，先对 y 积出 A(x)，再对 x 积；右：同一个三角形，竖着切读出一组积分限，横着切读出另一组。](slices.svg)

左图是例 1 的屋顶：平面$x=0.5$截出的梯形截面面积是$A(0.5)=\int_0^2(3.5-y)\dd y$，让截面从$x=0$移到$x=1$，把截面面积积起来就是体积。右图是例 2 的积分区域：竖着切，每一条细条上$y$从$0$到$x$；横着切，每一条细条上$x$从$y$到$1$。同一个区域，两种切法读出两组积分限。

## 例题

### 例 1　屋顶下的体积

地面是矩形$0\le x\le1$、$0\le y\le2$，屋顶是平面$z=4-x-y$。求屋顶和地面之间的体积，两种次序各算一次。

**为什么想到这么做**：屋顶在矩形上处处为正，体积就是:term[二重积分]{id="math.vector-calculus.double-integral"}$\iint_R(4-x-y)\,\dd A$；被积函数:term[连续]{id="math.vector-calculus.continuous"}，由:term[富比尼定理]{id="math.vector-calculus.fubini-theorem"}，两种次序都行，结果应当一样。

**推导**：先对$y$积：$A(x)=\int_0^2(4-x-y)\dd y=2(4-x)-2=6-2x$，体积$=\int_0^1(6-2x)\dd x=6-1=5$。先对$x$积：$\int_0^1(4-x-y)\dd x=3.5-y$，体积$=\int_0^2(3.5-y)\dd y=7-2=5$。两种次序都是$5$。

### 例 2　换一种次序才积得出来

求$\int_0^1\int_y^1e^{x^2}\dd x\dd y$。

**为什么想到这么做**：$e^{x^2}$没有初等函数表示的原函数，里层对$x$积不出来。把积分区域画出来、换成先对$y$积，被积函数和$y$无关，里层就容易了。

**推导**：积分区域是$0\le y\le1$、$y\le x\le1$，也就是三角形$0\le y\le x\le1$，它也可以写成$0\le x\le1$、$0\le y\le x$。所以原式$=\int_0^1\int_0^xe^{x^2}\dd y\dd x=\int_0^1xe^{x^2}\dd x=\frac12\bigl(e-1\bigr)\approx0.859$。

## 常见误区

- 「$\int_a^b\int_c^df\,\dd y\dd x$先积的是$x$。」里层的积分号和最靠里的$\dd y$配对，先积$y$，$y$从$c$到$d$。
- 「换次序，把两组积分限对调就行。」只有矩形区域可以这样；一般区域要把区域画出来，重新读出新次序下的积分限（例 2）。
- 「:term[二重积分]{id="math.vector-calculus.double-integral"}就是体积。」被积函数有负值时，曲面在$xy$平面下方的部分算负的；只有$f\ge0$时它才是体积。
- 「两个:term[累次积分]{id="math.vector-calculus.iterated-integral"}都存在，就一定相等。」要有$f$:term[连续]{id="math.vector-calculus.continuous"}这类条件；不连续时可能不相等，见[含参变量积分](lesson:math.analysis.parameter-integrals)第 4 题。

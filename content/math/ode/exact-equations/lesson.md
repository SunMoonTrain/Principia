---
id: math.ode.exact-equations
title: |
  恰当方程
goal: |
  会判断一个一阶方程是否恰当，并通过求势函数得到它的解。
prerequisites: [math.ode.what-is-ode, math.vector-calculus.multivariable-chain-rule]
minutes: 30
summary: |
  $M\dd x+N\dd y=0$在$M_y=N_x$时恰当，解就是势函数的等值线。
status: reviewed
---

## 这一节要回答的问题

$x^2+y^2=C$是一族圆，对$x$求导得$2x+2yy'=0$，常写成$x\dd x+y\dd y=0$。反过来，给你一个形如$M(x,y)\dd x+N(x,y)\dd y=0$的方程，怎样判断它是不是某个函数$F(x,y)=C$求导得来的？如果是，怎样把$F$找回来？

## 讲解

### 恰当方程

从曲线族$x^2y+y^3=C$出发：沿着其中一条曲线$y(x)$，$F(x,y)=x^2y+y^3$不变，对$x$求导得$\frac{\partial F}{\partial x}+\frac{\partial F}{\partial y}y'=0$，即$2xy+(x^2+3y^2)y'=0$。这一步用的是多元复合函数的链式法则（chain rule），见[多元复合函数的链式法则](lesson:math.vector-calculus.multivariable-chain-rule)。所以$2xy\dd x+(x^2+3y^2)\dd y=0$的:term[解曲线]{id="math.ode.solution-curve"}（solution curve），就是这族曲线。

::anchor{id="def-exact"}
设$M$、$N$在区域$D$上连续。方程$M(x,y)+N(x,y)y'=0$也写作$M\dd x+N\dd y=0$；如果有函数$F$在$D$上满足$\frac{\partial F}{\partial x}=M$、$\frac{\partial F}{\partial y}=N$，这个方程就叫作:term[恰当方程]{id="math.ode.exact-equation"}（exact equation），$F$叫作它的:term[势函数]{id="math.ode.potential-function"}（potential function）。

为什么这样定义：这时沿着任何一条解曲线$y(x)$，都有$\frac{\dd}{\dd x}F(x,y(x))=M+Ny'=0$，$F$保持不变，所以解曲线都落在等值线（level curve）$F(x,y)=C$上。边界情况：同一族曲线可以写成不恰当的样子。$y\dd x-x\dd y=0$不恰当，可两边除以$x^2$后左边是$-\bigl(\frac yx\bigr)$的微分，就恰当了，解是直线$y=Cx$。

::anchor{id="thm-exactness-test"}
**判别法**　设$M$、$N$和偏导数（partial derivatives）$\frac{\partial M}{\partial y}$、$\frac{\partial N}{\partial x}$在矩形$R$上连续，则方程$M\dd x+N\dd y=0$在$R$上恰当，当且仅当在$R$上$\frac{\partial M}{\partial y}=\frac{\partial N}{\partial x}$。

**证明思路**：必要性：若$F$存在，$\frac{\partial M}{\partial y}$和$\frac{\partial N}{\partial x}$是$F$的两个混合偏导数（mixed partial derivatives），连续时相等（见[偏导数](lesson:math.vector-calculus.partial-derivatives)）。充分性：取$(x_0,y_0)\in R$，令$F(x,y)=\int_{x_0}^{x}M(s,y_0)\dd s+\int_{y_0}^{y}N(x,t)\dd t$，它对$y$求偏导得$N$；对$x$求偏导时，第二项要:term[积分号下求导]{id="math.analysis.differentiation-under-integral"}（differentiation under the integral sign），$N$、$\frac{\partial N}{\partial x}$在矩形上连续，正满足[含参变量积分](lesson:math.analysis.parameter-integrals#thm-leibniz-rule)里的条件；再用$\frac{\partial N}{\partial x}=\frac{\partial M}{\partial y}$，就得到$M$。详细的证明见第 5 题。

「矩形」这个条件不能随便去掉：区域里有洞时，$\frac{\partial M}{\partial y}=\frac{\partial N}{\partial x}$处处成立，方程也可能不恰当（第 6 题）。

### 求势函数

判别法成立以后，:term[势函数]{id="math.ode.potential-function"}可以一个变量一个变量地找。先把$M$对$x$求原函数（antiderivative），$y$当常数，得$F=\int M\dd x+g(y)$，「常数」$g(y)$可以依赖$y$；再要求$\frac{\partial F}{\partial y}=N$，定出$g'(y)$，求原函数得$g$。例 1 是完整的过程。

### 积分因子

不恰当的方程，乘上一个函数$\mu(x,y)$以后可能变成恰当的，前面的$y\dd x-x\dd y=0$乘以$\frac{1}{x^2}$就是这样。

::anchor{id="def-exact-integrating-factor"}
如果$\mu M\dd x+\mu N\dd y=0$是:term[恰当方程]{id="math.ode.exact-equation"}，函数$\mu(x,y)$就叫作方程$M\dd x+N\dd y=0$的:term[积分因子]{id="math.ode.integrating-factor"}（integrating factor）。[一阶线性方程与积分因子](lesson:math.ode.linear-first-order)里的$e^{\int p\dd x}$是它的特例。

为什么这样定义：乘上一个处处不为$0$的函数，方程的解不变，却可能把方程凑成某个函数的「全微分」。边界情况：积分因子不唯一（再乘上:term[势函数]{id="math.ode.potential-function"}的任何函数都还行），也不一定好找；只依赖$x$或只依赖$y$的那些，有下面的判别法。

::anchor{id="thm-integrating-factor-x"}
**只依赖$x$的积分因子**　若$\frac{1}{N}\bigl(\frac{\partial M}{\partial y}-\frac{\partial N}{\partial x}\bigr)$只是$x$的函数$\phi(x)$，则$\mu(x)=e^{\int\phi(x)\dd x}$是积分因子；对称地，若$\frac{1}{M}\bigl(\frac{\partial N}{\partial x}-\frac{\partial M}{\partial y}\bigr)$只是$y$的函数$\psi(y)$，则$\mu(y)=e^{\int\psi(y)\dd y}$是积分因子。

**证明思路**：$\mu=\mu(x)$时，$\mu M\dd x+\mu N\dd y=0$恰当的条件是$\mu\frac{\partial M}{\partial y}=\mu'N+\mu\frac{\partial N}{\partial x}$，即$\frac{\mu'}{\mu}=\frac1N\bigl(\frac{\partial M}{\partial y}-\frac{\partial N}{\partial x}\bigr)$。右边只依赖$x$时，这是一个可以直接积分的式子；依赖$y$的情形同理。

## 几何图像

:::anim{component="phase-portrait"}
system: { x: "2*y", y: "3*x^2 - 3" }
range: { x: [-2.5, 2.5], y: [-3, 3] }
dt: 0.005
initial:
  - [-1.5, 0]
  - [-1.2, 0]
  - [-0.5, 0]
  - [1, 0.05]
  - [0.98, 0]
  - [2, 1]
:::

这是:term[恰当方程]{id="math.ode.exact-equation"}$(3-3x^2)\dd x+2y\dd y=0$，:term[势函数]{id="math.ode.potential-function"}是$F=y^2-x^3+3x$。图里的动点按$x'=N=2y$、$y'=-M=3x^2-3$运动，沿途$\frac{\dd F}{\dd t}=Mx'+Ny'=MN-NM=0$，所以每条轨迹都是$F$的一条等值线，也就是方程的:term[解曲线]{id="math.ode.solution-curve"}。在$(-1,0)$周围，等值线是一圈圈闭合的曲线；在$(1,0)$处，等值线交叉成一个「×」，这里$M=N=0$，方程没有给出方向。

## 例题

### 例 1　求势函数

解:term[初值问题]{id="math.ode.initial-value-problem"}（initial value problem）$(2xy+3)\dd x+(x^2+4y)\dd y=0$，$y(0)=1$。

**为什么想到这么做**：先用判别法看是否恰当：$\frac{\partial M}{\partial y}=2x=\frac{\partial N}{\partial x}$，是:term[恰当方程]{id="math.ode.exact-equation"}。再一个变量一个变量地找:term[势函数]{id="math.ode.potential-function"}。

**推导**：$F=\int(2xy+3)\dd x=x^2y+3x+g(y)$。要求$\frac{\partial F}{\partial y}=x^2+g'(y)=x^2+4y$，所以$g'(y)=4y$，$g=2y^2$，$F=x^2y+3x+2y^2$。由$y(0)=1$得$F=2$，解满足$x^2y+3x+2y^2=2$。

### 例 2　找积分因子

解$(x+y^2)\dd x-2xy\dd y=0$（$x>0$）。

**为什么想到这么做**：$\frac{\partial M}{\partial y}=2y$，$\frac{\partial N}{\partial x}=-2y$，不恰当。算$\frac1N\bigl(\frac{\partial M}{\partial y}-\frac{\partial N}{\partial x}\bigr)=\frac{4y}{-2xy}=-\frac2x$，只依赖$x$，可以找只依赖$x$的:term[积分因子]{id="math.ode.integrating-factor"}。

**推导**：$\mu=e^{\int(-2/x)\dd x}=\frac{1}{x^2}$。乘上以后方程是$\bigl(\frac1x+\frac{y^2}{x^2}\bigr)\dd x-\frac{2y}{x}\dd y=0$，可以验证它恰当：两个偏导数都是$\frac{2y}{x^2}$。$F=\int\bigl(\frac1x+\frac{y^2}{x^2}\bigr)\dd x=\ln x-\frac{y^2}{x}+g(y)$，再由$\frac{\partial F}{\partial y}=-\frac{2y}{x}$得$g'=0$，所以解满足$\ln x-\frac{y^2}{x}=C$。

## 常见误区

- 「$M$对$x$积分、$N$对$y$积分，加起来就是$F$。」会把两边都有的项算两遍；要像例 1 那样，先积一个，再用另一个定出剩下的$g(y)$。
- 「$\frac{\partial M}{\partial y}=\frac{\partial N}{\partial x}$在哪里成立，方程在哪里就恰当。」区域里有洞时不一定（第 6 题），判别法要求的是矩形这样没有洞的区域。
- 「解一定能写成$y=f(x)$。」解常常只能写成$F(x,y)=C$；在$N=0$的点，等值线可能竖直，不能在那里把$y$写成$x$的函数（第 8 题）。

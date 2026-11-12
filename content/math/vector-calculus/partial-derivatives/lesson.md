---
id: math.vector-calculus.partial-derivatives
title: |
  偏导数
goal: |
  会求多元函数的偏导数和高阶偏导数，并知道混合偏导数在什么条件下相等。
prerequisites: [math.vector-calculus.multivariable-limits, math.calculus.elementary-derivatives, math.calculus.chain-rule]
minutes: 35
summary: |
  固定其余变量对一个变量求导，就是偏导数。
status: reviewed
---

## 这一节要回答的问题

铁板上的温度$T(x,y)$，沿正东（$x$增大的方向）走时变化得多快，沿正北呢？一元函数的导数是函数值的变化率，:term[二元函数]{id="math.vector-calculus.multivariable-function"}（function of two variables）有两个自变量，最简单的办法是一次只让一个变动。这样求出的导数怎样记、怎样算？对$x$、$y$各求一次导数时，先后次序有没有关系？

## 讲解

### 偏导数

::anchor{id="def-partial-derivative"}
设:term[二元函数]{id="math.vector-calculus.multivariable-function"}$f$在$(a,b)$附近有定义。如果极限$\lim_{h\to0}\frac{f(a+h,b)-f(a,b)}{h}$存在，就把它叫作$f$在$(a,b)$处对$x$的:term[偏导数]{id="math.vector-calculus.partial-derivative"}（partial derivative），记作$\pdv{f}{x}(a,b)$或$f_x(a,b)$。同样，$f_y(a,b)=\pdv{f}{y}(a,b)=\lim_{k\to0}\frac{f(a,b+k)-f(a,b)}{k}$是对$y$的偏导数；$n$元函数对$x_i$的偏导数$\pdv{f}{x_i}$，就是固定其余$n-1$个变量、只让$x_i$变动时的导数。

为什么这样定义：固定$y=b$，$g(x)=f(x,b)$是一元函数，$f_x(a,b)$就是$g'(a)$，即沿$x$方向的变化率；几何上，平面$y=b$截图像得到曲线$z=f(x,b)$，$f_x(a,b)$是这条截线在$x=a$处的切线斜率。所以求偏导数时，把其余变量都当常数，用一元函数的求导法则：$f=x^2y+\sin(xy)$时，$f_x=2xy+y\cos(xy)$，$f_y=x^2+x\cos(xy)$。边界情况：偏导数只看两条直线上的变化，它们都存在，函数也可能不:term[连续]{id="math.vector-calculus.continuous"}（continuous）。例如$f(x,y)=\frac{xy}{x^2+y^2}$、$f(0,0)=0$，$f(h,0)=0$、$f(0,k)=0$，所以$f_x(0,0)=f_y(0,0)=0$，可它在原点不连续，见[多元函数的极限与连续](lesson:math.vector-calculus.multivariable-limits)。

偏导数是对「第几个位置上的变量」求的，记号里的字母只是那个位置的名字。函数写成$F(x,y,p)$时，$F_y$、$F_p$是对第二、第三个变量的偏导数；变分法里把$p$换成$y'(x)$，就把$F_p$写作$F_{y'}$。

### 高阶偏导数

::anchor{id="def-second-partials"}
$f_x$、$f_y$仍是$x$、$y$的函数，对它们再求:term[偏导数]{id="math.vector-calculus.partial-derivative"}，得到四个:term[二阶偏导数]{id="math.vector-calculus.second-partial-derivative"}（second-order partial derivative）：$f_{xx}=\frac{\partial^2f}{\partial x^2}$，$f_{xy}=(f_x)_y=\frac{\partial^2f}{\partial y\,\partial x}$，$f_{yx}=(f_y)_x=\frac{\partial^2f}{\partial x\,\partial y}$，$f_{yy}=\frac{\partial^2f}{\partial y^2}$。其中$f_{xy}$、$f_{yx}$叫作:term[混合偏导数]{id="math.vector-calculus.mixed-partial-derivative"}（mixed partial derivative）。

为什么这样定义：一元函数的二阶导数说的是变化率本身变化得多快，这里每个一阶偏导数又能沿两个方向变化，所以有四个。下标从左往右是求导的次序，$f_{xy}$先对$x$、再对$y$；分式记号里的次序从右往左读，$\frac{\partial^2f}{\partial y\,\partial x}$也是先对$x$。例如$f=x^3y^2+ye^{2x}$，$f_x=3x^2y^2+2ye^{2x}$，$f_{xy}=6x^2y+2e^{2x}$；$f_y=2x^3y+e^{2x}$，$f_{yx}=6x^2y+2e^{2x}$，两者相等。三阶以上的偏导数同样定义，像$u_{tt}=c^2u_{xx}$这样含未知函数偏导数的方程是偏微分方程（partial differential equation），以后在[偏微分方程与分类](lesson:math.pde.pde-basics)里讲。

### 混合偏导数相等的条件

::anchor{id="thm-schwarz"}
**:term[施瓦茨定理]{id="math.vector-calculus.schwarz-theorem"}（Schwarz's theorem）**　设$f$的:term[混合偏导数]{id="math.vector-calculus.mixed-partial-derivative"}$f_{xy}$、$f_{yx}$在$(a,b)$附近都存在，并且在$(a,b)$处:term[连续]{id="math.vector-calculus.continuous"}，则$f_{xy}(a,b)=f_{yx}(a,b)$。这个定理也叫克莱罗定理（Clairaut's theorem）。

**证明思路**：考虑$\Delta=f(a+h,b+k)-f(a+h,b)-f(a,b+k)+f(a,b)$。令$\varphi(x)=f(x,b+k)-f(x,b)$，则$\Delta=\varphi(a+h)-\varphi(a)$；对$\varphi$用一次微分中值定理（mean value theorem，见[微分中值定理](lesson:math.calculus.mean-value-theorem)），再对$f_x(\xi,\cdot)$用一次，得$\Delta=f_{xy}(\xi,\eta)hk$，$(\xi,\eta)$在以$(a,b)$、$(a+h,b+k)$为对角的矩形里。换个次序，令$\psi(y)=f(a+h,y)-f(a,y)$，同样得$\Delta=f_{yx}(\xi',\eta')hk$。两式相等，约去$hk$后让$h,k\to0$，由连续性得$f_{xy}(a,b)=f_{yx}(a,b)$。

所以:term[二阶偏导数]{id="math.vector-calculus.second-partial-derivative"}都连续时，求导的次序可以随便换，三阶以上也一样。条件不能少：有的函数两个混合偏导数在原点都存在，却不相等（第 6 题）。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-2, 3], y: [-2.5, 8] }
functions:
  - expr: "x^2/2 - b*x"
    label: |
      截线$z=f(x,b)$
  - expr: "(0.5 - b) + (1 - b)*(x - 1)"
    label: |
      $x=1$处的切线，斜率$f_x(1,b)=1-b$
points:
  - { x: "1", y: "0.5 - b" }
sliders:
  - name: b
    min: -1
    max: 2
    step: 0.25
    default: 0.5
    label: |
      截面$y=b$里的$b$
:::

动画里的函数是$f(x,y)=\frac{x^2}2-xy$，画的是平面$y=b$截图像得到的截线$z=f(x,b)=\frac{x^2}2-bx$，图上的纵轴写作$y$，表示函数值$z$。截线在$x=1$处的切线斜率是:term[偏导数]{id="math.vector-calculus.partial-derivative"}$f_x(1,b)=1-b$。拖动$b$，截线和切线跟着变：$b$每增加$1$，斜率就减少$1$，这个变化率正是:term[混合偏导数]{id="math.vector-calculus.mixed-partial-derivative"}$f_{xy}=-1$。

## 例题

### 例 1　求偏导数

$f(x,y)=xe^{xy}$。求$f_x$、$f_y$，以及它们在$(1,0)$处的值。

**为什么想到这么做**：对$x$求:term[偏导数]{id="math.vector-calculus.partial-derivative"}时$y$是常数，$xe^{xy}$是两个含$x$的因子的乘积，用乘积法则，$e^{xy}$对$x$求导要用一元函数的链式法则（chain rule）；对$y$求偏导数时$x$是常数，前面的$x$只是系数。

**推导**：$f_x=e^{xy}+x\cdot ye^{xy}=(1+xy)e^{xy}$，$f_y=x\cdot xe^{xy}=x^2e^{xy}$。在$(1,0)$处，$f_x=(1+0)e^0=1$，$f_y=1\cdot e^0=1$。验算：$f(1+h,0)=1+h$，$f(1,k)=e^k$，在$h=0$、$k=0$处的导数都是$1$。

### 例 2　二阶偏导数

$f(x,y)=\ln(x^2+y^2)$。求四个:term[二阶偏导数]{id="math.vector-calculus.second-partial-derivative"}，并验证$f_{xx}+f_{yy}=0$。

**为什么想到这么做**：先求:term[一阶偏导数]{id="math.vector-calculus.partial-derivative"}，再分别对$x$、$y$求导；分母相同的分式，用商的求导法则。

**推导**：$f_x=\frac{2x}{x^2+y^2}$，$f_y=\frac{2y}{x^2+y^2}$。$f_{xx}=\frac{2(x^2+y^2)-2x\cdot2x}{(x^2+y^2)^2}=\frac{2(y^2-x^2)}{(x^2+y^2)^2}$，同理$f_{yy}=\frac{2(x^2-y^2)}{(x^2+y^2)^2}$，两者相加为$0$。$f_{xy}=\frac{-2x\cdot2y}{(x^2+y^2)^2}=-\frac{4xy}{(x^2+y^2)^2}$，$f_{yx}$也算得同样的结果，和:term[施瓦茨定理]{id="math.vector-calculus.schwarz-theorem"}一致（除原点外二阶偏导数都:term[连续]{id="math.vector-calculus.continuous"}）。

## 常见误区

- 「$\pdv{x}{r}$和$\pdv{r}{x}$互为倒数。」极坐标里$x=r\cos\theta$，固定$\theta$得$\pdv{x}{r}=\cos\theta$；$r=\sqrt{x^2+y^2}$，固定$y$得$\pdv{r}{x}=\frac xr=\cos\theta$，乘积是$\cos^2\theta$。两个:term[偏导数]{id="math.vector-calculus.partial-derivative"}保持不变的变量不同（一个是$\theta$，一个是$y$），不能像分数一样约分（第 7 题）。
- 「偏导数都存在，函数就:term[连续]{id="math.vector-calculus.continuous"}。」讲解里的$\frac{xy}{x^2+y^2}$就是反例。
- 「:term[混合偏导数]{id="math.vector-calculus.mixed-partial-derivative"}总是相等。」要它们在这一点连续；第 6 题的函数两个混合偏导数在原点分别是$-1$和$1$。
- 「$f_{xy}$是先对$y$、再对$x$求导。」下标从左往右是求导的次序，$f_{xy}=(f_x)_y$；分式记号$\frac{\partial^2f}{\partial y\,\partial x}$从右往左读。

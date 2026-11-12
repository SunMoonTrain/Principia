---
id: math.ode.what-is-ode
title: |
  微分方程与方向场
goal: |
  会验证一个函数是不是微分方程的解，并用方向场画出解曲线的大致样子。
prerequisites: [math.calculus.antiderivatives, math.calculus.chain-rule]
minutes: 25
summary: |
  微分方程联系未知函数和它的导数；方向场画出解曲线的走向。
status: reviewed
---

## 这一节要回答的问题

放射性物质衰变的快慢和剩下的量成正比；弹簧上的小球，加速度和离开平衡位置的位移成正比。这些规律说的都是：一个未知函数的导数和函数本身之间满足什么关系。怎样判断一个函数满足这样的关系？方程解不出来的时候，能不能先看出解大致长什么样？

## 讲解

### 微分方程和它的解

设$m(t)$是$t$时刻剩下的放射性物质的质量，衰变的规律是$m'(t)=-km(t)$，$k>0$是常数。试一试$m(t)=Ce^{-kt}$：$m'(t)=-kCe^{-kt}=-km(t)$，对每个常数$C$都成立。满足这个规律的函数有无穷多个，$C$正是$t=0$时的质量。

::anchor{id="def-ode"}
含有未知函数的导数的方程，叫作:term[微分方程]{id="math.ode.differential-equation"}（differential equation）；未知函数只有一个自变量时，叫作:term[常微分方程]{id="math.ode.ode"}（ordinary differential equation，ODE）。方程里出现的导数最高是几阶，方程就是几阶（order）的。

为什么这样定义：许多规律只告诉我们「变化率由现在的状态决定」，写出来就是含导数的方程，要找的是一个函数，不是一个数。边界情况：未知函数有两个以上的自变量、方程里出现:term[偏导数]{id="math.vector-calculus.partial-derivative"}（partial derivative）时，比如热传导方程（heat equation）$\frac{\partial u}{\partial t}=\frac{\partial^2u}{\partial x^2}$，那是偏微分方程（partial differential equation），见[偏微分方程与分类](lesson:math.pde.pde-basics)。$(y')^2=y$只含一阶导数，是一阶方程，导数带了平方也不改变阶数。

::anchor{id="def-solution"}
设$I$是一个区间。如果函数$y=\varphi(x)$在$I$上可导，代进方程以后，对$I$里的每个$x$等式都成立，就说它是方程在$I$上的解（solution）。

为什么这样定义：解是一个函数，说它「是解」，要说清在哪个区间上成立。边界情况：$y=\frac1x$满足$y'=-y^2$，可它在$x=0$处没有定义；只能说它在$(0,+\infty)$上是解、在$(-\infty,0)$上也是解，不能说它在$\R$上是解。

::anchor{id="def-general-solution"}
含有任意常数、常数取遍允许的值就能给出（几乎）所有解的表达式，叫作:term[通解]{id="math.ode.general-solution"}（general solution）；常数取定一个值得到的解，叫作:term[特解]{id="math.ode.particular-solution"}（particular solution）。比如$m=Ce^{-kt}$是$m'=-km$的通解，$m=5e^{-kt}$是一个特解。

为什么这样定义：解有无穷多个，一个带常数的式子就把它们一网打尽；一阶方程的通解通常含一个常数，二阶的通常含两个。边界情况：「通解」不一定真包含所有的解。$y'=-y^2$的解$y=\frac{1}{x+C}$里，$C$取什么值都得不到常数解$y=0$，可$y=0$显然也是解。

::anchor{id="def-ivp"}
给定微分方程，再要求解在某一点$x_0$取给定的值$y(x_0)=y_0$，这样的问题叫作:term[初值问题]{id="math.ode.initial-value-problem"}（initial value problem），$y(x_0)=y_0$叫作初始条件（initial condition）。

为什么这样定义：通解里的常数要一个条件来确定，在物理上就是「开始时的状态」：衰变问题给出$m(0)=m_0$，就得到$m(t)=m_0e^{-kt}$。边界情况：初值问题的解不一定唯一，也不一定在整条直线上都存在，什么时候存在、唯一，见[解的存在唯一性](lesson:math.ode.existence-uniqueness)。

### 方向场

方程$y'=x-y$说的是：解的图像经过点$(x,y)$时，那里的切线斜率是$x-y$。比如在$(1,0)$处斜率是$1$，在$(0,1)$处是$-1$，在直线$y=x$上处处是$0$。在很多点上画出这样的小线段，不用解方程，解的走向就一目了然。

::anchor{id="def-direction-field"}
对一阶方程$y'=f(x,y)$，在平面上许多点$(x,y)$处画一条斜率为$f(x,y)$的小线段，得到的图叫作这个方程的:term[方向场]{id="math.ode.direction-field"}（direction field，也叫 slope field）。解的图像叫作:term[解曲线]{id="math.ode.solution-curve"}（solution curve），它在经过的每一点都和那里的小线段相切。

为什么这样定义：画方向场只要会代入算斜率，解曲线就是顺着小线段的方向「走」出来的。边界情况：方程要能写成$y'=f(x,y)$，由点$(x,y)$唯一决定斜率；$(y')^2=y$在$y>0$的点上有两个斜率$\pm\sqrt y$，画不出一个方向场。

::anchor{id="def-isocline"}
方向场里斜率相同的点组成的曲线$f(x,y)=c$，叫作斜率为$c$的:term[等倾线]{id="math.ode.isocline"}（isocline）。

为什么这样定义：一条等倾线上的小线段互相平行，手工画方向场时，先画几条等倾线，再在每条上画同样倾斜的小线段，最省事。边界情况：等倾线一般不是解曲线。$y'=x-y$的等倾线是直线$y=x-c$，斜率都是$1$；解曲线穿过它时斜率却是$c$，只有$c=1$时两者一致（第 6 题说明这件事的一般道理）。

## 几何图像

:::anim{component="phase-portrait"}
system: { x: "1", y: "x - y" }
range: { x: [-3, 3], y: [-3, 3] }
dt: 0.01
trail: full
initial:
  - [-3, 3]
  - [-3, 1.5]
  - [-3, 0]
  - [-3, -1.5]
  - [-3, -3]
  - [-1, -3]
  - [0, 3]
:::

这是$y'=x-y$的:term[方向场]{id="math.ode.direction-field"}，横轴是$x$，纵轴是$y$。图里的动点每走一步，$x$都增加同样的量，所以它的轨迹就是一条:term[解曲线]{id="math.ode.solution-curve"}。几条解曲线从不同的地方出发，最后都挤向同一条直线；在图上点一下，就从那一点放出一条新的解曲线。

## 例题

### 例 1　验证解，再求特解

验证：对每个常数$C$，$y=Ce^{2x}-\frac{x}{2}-\frac14$都是$y'=2y+x$在$\R$上的解；再求满足$y(0)=1$的:term[特解]{id="math.ode.particular-solution"}。

**为什么想到这么做**：验证就是代入，分别算出左边$y'$和右边$2y+x$，看它们是否处处相等。特解要定出$C$，用初始条件。

**推导**：$y'=2Ce^{2x}-\frac12$；$2y+x=2Ce^{2x}-x-\frac12+x=2Ce^{2x}-\frac12$，两边相等，对每个$C$、每个实数$x$都成立。由$y(0)=C-\frac14=1$得$C=\frac54$，特解是$y=\frac54e^{2x}-\frac x2-\frac14$。

### 例 2　一条直的解曲线

$y'=y-x$的:term[方向场]{id="math.ode.direction-field"}里，有没有一条:term[解曲线]{id="math.ode.solution-curve"}是直线？

**为什么想到这么做**：直线$y=ax+b$的斜率处处是$a$；它要是解曲线，方向场在它上面每一点的斜率$y-x$都得等于$a$。把直线代进方程，比较两边就行。

**推导**：代入得$a=(ax+b)-x$，即$(a-1)x+(b-a)=0$对所有$x$成立，所以$a=1$，$b=1$。验证：$y=x+1$时$y'=1$，$y-x=1$，确实是解。它正是斜率为$1$的那条:term[等倾线]{id="math.ode.isocline"}$y-x=1$：这条等倾线上的小线段都沿着它自己。

## 常见误区

- 「:term[通解]{id="math.ode.general-solution"}包含方程的全部解。」不一定：$y'=-y^2$的常数解$y=0$不在$y=\frac{1}{x+C}$里。
- 「解在整条数轴上都有定义。」$y=\frac{1}{x+C}$在$x=-C$处没有定义，只在不含$-C$的区间上是解。
- 「:term[方向场]{id="math.ode.direction-field"}里的小线段连起来就是:term[解曲线]{id="math.ode.solution-curve"}。」小线段只告诉你切线的方向；解曲线顺着这些方向走，不必经过画出来的那些线段。

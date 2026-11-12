---
id: math.vector-calculus.polar-double-integrals
title: |
  极坐标下的二重积分
goal: |
  会把二重积分换到极坐标下计算，并用它求出$\int_{-\infty}^{\infty}e^{-x^2}\dd x=\sqrt{\pi}$。
prerequisites: [math.vector-calculus.double-integrals, math.calculus.polar-area, math.calculus.improper-integrals]
minutes: 35
summary: |
  换成极坐标时面积元是$r\,\dd r\dd\theta$，圆形区域由此变得好积。
status: reviewed
---

## 这一节要回答的问题

在圆盘、圆环上积分，用直角坐标写积分限会出现$\sqrt{4-x^2}$这样的根号，积起来很麻烦；用极坐标（polar coordinates），圆盘就是$0\le r\le2$。可是$\dd A$换成什么，是不是简单地换成$\dd r\dd\theta$？另外，$e^{-x^2}$没有初等函数表示的原函数，$\int_{-\infty}^{\infty}e^{-x^2}\dd x$却等于$\sqrt\pi$，这又是怎样算出来的？

## 讲解

### 极坐标下的面积元

::anchor{id="def-polar-cell"}
在极坐标$x=r\cos\theta$、$y=r\sin\theta$下，$r_1\le r\le r_2$、$\theta_1\le\theta\le\theta_2$的区域是一块圆环的一段，叫作极坐标矩形（polar rectangle）。它的面积是两个扇形面积之差：$\frac12(r_2^2-r_1^2)(\theta_2-\theta_1)=\frac{r_1+r_2}2\,\Delta r\,\Delta\theta$，其中$\Delta r=r_2-r_1$，$\Delta\theta=\theta_2-\theta_1$。

为什么这样算：扇形面积$\frac12r^2\theta$在[极坐标与极坐标下的面积](lesson:math.calculus.polar-area)里讲过。小块很小时，它近似一个长方形：沿半径方向长$\Delta r$，沿圆周方向长$r\Delta\theta$，面积约$r\,\Delta r\,\Delta\theta$，所以极坐标下:term[面积元]{id="math.vector-calculus.area-element"}（area element）$\dd A$要换成$r\,\dd r\dd\theta$。同样的$\Delta r$、$\Delta\theta$，离原点越远，小块越大；边界情况：$r$接近$0$时，小块缩成一个细长的尖角，面积也趋于$0$。

### 换成极坐标

::anchor{id="thm-polar"}
**极坐标下的:term[二重积分]{id="math.vector-calculus.double-integral"}（double integral）**　设区域$D$在极坐标下是$\alpha\le\theta\le\beta$、$g_1(\theta)\le r\le g_2(\theta)$，其中$0\le\beta-\alpha\le2\pi$，$g_1$、$g_2$:term[连续]{id="math.vector-calculus.continuous"}（continuous），$0\le g_1\le g_2$；$f$在$D$上连续，则$\iint_Df\,\dd A=\int_\alpha^\beta\int_{g_1(\theta)}^{g_2(\theta)}f(r\cos\theta,r\sin\theta)\,r\,\dd r\dd\theta$。

**证明思路**：用一族同心圆和过原点的射线把$D$分成小的极坐标矩形，在每一块里取$r$的中点$\bar r$、任意一个$\theta$，黎曼和（Riemann sum）$\sum f(\bar r\cos\theta,\bar r\sin\theta)\,\bar r\,\Delta r\Delta\theta$里$\bar r\Delta r\Delta\theta$正是这一块的面积。$f$连续时，小块越分越细，黎曼和照样趋于$\iint_Df\,\dd A$（这里不证）。另一方面，它又是右边那个:term[累次积分]{id="math.vector-calculus.iterated-integral"}（iterated integral）对$(r,\theta)$的黎曼和。

为什么多出一个$r$：直角坐标的小块是$\Delta x\times\Delta y$，处处一样大；极坐标的小块沿圆周方向的边长是$r\Delta\theta$，不是$\Delta\theta$。被积函数和区域都绕原点对称时，换成极坐标常常能把二重积分拆成两个一元积分的乘积。

### 高斯积分

::anchor{id="def-improper-double"}
设$f\ge0$在整个平面上:term[连续]{id="math.vector-calculus.continuous"}。如果圆盘$D_R:x^2+y^2\le R^2$上的积分在$R\to\infty$时有有限的极限，就把这个极限叫作$f$在整个平面上的:term[反常二重积分]{id="math.vector-calculus.improper-double-integral"}（improper double integral），记作$\iint_{\R^2}f\,\dd A$。$f\ge0$时，换成正方形$S_R=[-R,R]^2$去逼近，极限也一样：$D_R\subset S_R\subset D_{\sqrt2R}$，$S_R$上的积分被两个圆盘上的积分夹住。

::anchor{id="thm-gaussian"}
**:term[高斯积分]{id="math.vector-calculus.gaussian-integral"}（Gaussian integral）**　$\int_{-\infty}^{\infty}e^{-x^2}\dd x=\sqrt\pi$。

**证明**：记$I(R)=\int_{-R}^Re^{-x^2}\dd x$。在正方形上，被积函数$e^{-x^2-y^2}=e^{-x^2}e^{-y^2}$可以拆开，$\iint_{S_R}e^{-x^2-y^2}\dd A=I(R)^2$。在圆盘上换成极坐标，$\iint_{D_R}e^{-x^2-y^2}\dd A=\int_0^{2\pi}\int_0^Re^{-r^2}r\,\dd r\dd\theta=\pi\bigl(1-e^{-R^2}\bigr)$。被积函数为正，$D_R\subset S_R\subset D_{\sqrt2R}$，所以$\pi\bigl(1-e^{-R^2}\bigr)\le I(R)^2\le\pi\bigl(1-e^{-2R^2}\bigr)$；令$R\to\infty$，夹逼得$I(R)^2\to\pi$，而$I(R)>0$，所以$\int_{-\infty}^{\infty}e^{-x^2}\dd x=\sqrt\pi$（这个反常积分（improper integral）收敛：$|x|\ge1$时$e^{-x^2}\le e^{-|x|}$，由比较判别法（comparison test））。

为什么要绕到二维：$e^{-x^2}$没有初等函数表示的原函数，一元的办法算不出它；平方以后变成平面上的积分，换到极坐标多出的因子$r$正好是$e^{-r^2}$的导数的一部分，$\int e^{-r^2}r\,\dd r=-\frac12e^{-r^2}$就积得出来了。只看第一象限也一样：正方形$[0,R]^2$和四分之一圆盘互相夹住，得$\int_0^\infty e^{-x^2}\dd x=\frac{\sqrt\pi}2$。

## 几何图像

![两幅图。左图是第一象限里的极坐标网格：半径 1 到 4 的四段圆弧和每隔 15° 的射线；3 ≤ r ≤ 4、30° ≤ θ ≤ 45° 的一块涂成蓝色，沿半径方向的边标着 Δr，沿圆周方向的边标着 rΔθ；同样张角、1 ≤ r ≤ 2 的一块涂成浅蓝色，小得多。右图是三个嵌套的区域：标着 D_R 的半径为 R 的圆盘、标着 S_R 的边长 2R 的正方形、标着 D_√2R 的半径为 √2R 的圆盘；小圆盘在正方形里，正方形在大圆盘里，正方形的四个角正好碰到大圆；一条半径标着 R，从中心到正方形一角的虚线标着 √2R。下方两行字：左：同样的 Δr、Δθ，外圈的小块大，沿圆周方向的边长是 rΔθ，面积约 rΔrΔθ；右：正方形被两个圆盘夹住，正方形上的积分也被两个圆盘上的积分夹住。](polar.svg)

左图：同样的$\Delta r$、$\Delta\theta$，外圈的小块比内圈的大，大出来的正是因子$r$。右图是:term[高斯积分]{id="math.vector-calculus.gaussian-integral"}的证明：被积函数为正，区域越大积分越大，正方形上的积分夹在两个圆盘上的积分之间，而圆盘上的积分换成极坐标就能算出来。

## 例题

### 例 1　抛物面下的体积

求旋转抛物面（paraboloid of revolution）$z=4-x^2-y^2$和$xy$平面围成的立体的体积。

**为什么想到这么做**：抛物面和$xy$平面交于圆$x^2+y^2=4$，体积是圆盘$D$上的$\iint_D(4-x^2-y^2)\,\dd A$。被积函数只依赖$x^2+y^2=r^2$，区域是圆盘，换成极坐标。

**推导**：$V=\int_0^{2\pi}\int_0^2(4-r^2)\,r\,\dd r\dd\theta=2\pi\Bigl[2r^2-\frac{r^4}4\Bigr]_0^2=2\pi(8-4)=8\pi$。

### 例 2　积分限依赖于角度的区域

$D$是圆$x^2+y^2=2x$围成的圆盘。求$\iint_Dx\,\dd A$。

**为什么想到这么做**：圆$x^2+y^2=2x$的圆心是$(1,0)$、半径是$1$，在极坐标下$r^2=2r\cos\theta$，即$r=2\cos\theta$，整个圆在$-\frac\pi2\le\theta\le\frac\pi2$里。每一条射线上，$r$从$0$到$2\cos\theta$。

**推导**：$\iint_Dx\,\dd A=\int_{-\pi/2}^{\pi/2}\int_0^{2\cos\theta}r\cos\theta\cdot r\,\dd r\dd\theta=\int_{-\pi/2}^{\pi/2}\frac{8\cos^4\theta}3\dd\theta=\frac83\cdot\frac{3\pi}8=\pi$。验算：圆盘面积是$\pi$，它关于$x=1$对称，$x$的平均值是$1$，积分是$1\cdot\pi$。

## 常见误区

- 「换成极坐标，$\dd A$就换成$\dd r\dd\theta$。」要乘因子$r$：小块沿圆周方向的边长是$r\Delta\theta$。漏掉$r$，例 1 会算成$\int_0^{2\pi}\int_0^2(4-r^2)\dd r\dd\theta=\frac{32\pi}3$。
- 「$\theta$总是从$0$积到$2\pi$。」$\theta$的范围由区域决定，例 2 只用到$-\frac\pi2\le\theta\le\frac\pi2$。
- 「$\int_{-\infty}^{\infty}e^{-x^2}\dd x$先求出原函数再代上下限。」$e^{-x^2}$没有初等函数表示的原函数；它的值是靠平方成二维积分、换极坐标得到的。
- 「整个平面上的积分，用什么区域去逼近都一样。」讲解只对$f\ge0$说明了圆盘和正方形给出同一个极限；被积函数变号时，换一族区域，极限可能不同，甚至不存在（第 8 题）。

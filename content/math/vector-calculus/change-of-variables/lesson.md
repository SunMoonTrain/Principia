---
id: math.vector-calculus.change-of-variables
title: |
  重积分的换元与雅可比行列式
goal: |
  会用雅可比行列式做一般的重积分换元，并说明它为什么是面积和体积的缩放倍数。
prerequisites: [math.vector-calculus.cylindrical-spherical, math.vector-calculus.jacobian]
minutes: 35
summary: |
  换元要乘雅可比行列式的绝对值，它是局部的面积放大倍数。
status: reviewed
---

## 这一节要回答的问题

极坐标（polar coordinates）下:term[面积元]{id="math.vector-calculus.area-element"}（area element）是$r\,\dd r\dd\theta$，:term[球坐标]{id="math.vector-calculus.spherical-coordinates"}（spherical coordinates）下:term[体积元]{id="math.vector-calculus.volume-element"}（volume element）是$r^2\sin\theta\,\dd r\dd\theta\dd\varphi$，这两个因子都是画小块、量棱长凑出来的。换成一般的新变量$x=x(u,v)$、$y=y(u,v)$，小块不再是矩形或扇形，$\dd x\dd y$该换成什么？有没有一个统一的算法，把$r$和$r^2\sin\theta$都算出来？

## 讲解

### 雅可比行列式

::anchor{id="def-jacobian-determinant"}
设$T(u,v)=\bigl(x(u,v),y(u,v)\bigr)$的各个:term[偏导数]{id="math.vector-calculus.partial-derivative"}（partial derivative）都存在。它的:term[雅可比矩阵]{id="math.vector-calculus.jacobian-matrix"}（Jacobian matrix）的行列式$\frac{\partial(x,y)}{\partial(u,v)}=\det\begin{pmatrix}x_u&x_v\\y_u&y_v\end{pmatrix}=x_uy_v-x_vy_u$叫作$T$的:term[雅可比行列式]{id="math.vector-calculus.jacobian-determinant"}（Jacobian determinant）。三个变量时同样定义$\frac{\partial(x,y,z)}{\partial(u,v,w)}$，是$3\times3$雅可比矩阵的行列式。

为什么这样定义：由:term[局部线性近似]{id="math.vector-calculus.local-linear-approximation"}（local linear approximation），在$(u_0,v_0)$附近$T$差不多就是线性变换（linear transformation）$\vb h\mapsto J_T\vb h$，边长$\Delta u$、$\Delta v$的小矩形被变成近似的平行四边形，两条边是$T_u\Delta u$、$T_v\Delta v$。线性变换把面积放大$|\det J_T|$倍（见[行列式：有向面积与体积](lesson:math.linear-algebra.determinant)），所以这个平行四边形的面积约$\left|\frac{\partial(x,y)}{\partial(u,v)}\right|\Delta u\Delta v$。雅可比行列式的绝对值就是$T$在这一点附近把面积放大的倍数；边界情况：它在一点为$0$时，这一点附近的小块被压扁成一条线（例如极坐标的原点）。

### 换元公式

::anchor{id="thm-change-of-variables"}
**:term[重积分的换元公式]{id="math.vector-calculus.change-of-variables-formula"}（change of variables formula）**　设$T$把$uv$平面的区域$E$一对一地变成$xy$平面的区域$D$，$x(u,v)$、$y(u,v)$有:term[连续]{id="math.vector-calculus.continuous"}（continuous）的:term[偏导数]{id="math.vector-calculus.partial-derivative"}，$f$在$D$上连续，则$\iint_Df(x,y)\,\dd x\dd y=\iint_Ef\bigl(x(u,v),y(u,v)\bigr)\left|\frac{\partial(x,y)}{\partial(u,v)}\right|\dd u\dd v$。在$E$的边界上可以不一一对应、:term[雅可比行列式]{id="math.vector-calculus.jacobian-determinant"}可以为$0$。三个变量时把$\left|\frac{\partial(x,y,z)}{\partial(u,v,w)}\right|$乘在$\dd u\dd v\dd w$上，公式一样。

**证明思路**：把$E$分成小矩形，每一块被$T$变成$D$里近似的平行四边形，面积约$\left|\frac{\partial(x,y)}{\partial(u,v)}\right|\Delta u\Delta v$。这些像拼成$D$，于是$\sum f\bigl(T(u_i,v_j)\bigr)\left|\frac{\partial(x,y)}{\partial(u,v)}\right|\Delta u\Delta v$既是右边的黎曼和（Riemann sum），又近似$D$上的:term[二重积分]{id="math.vector-calculus.double-integral"}（double integral）。要说明「近似平行四边形」带来的误差在取极限时消失，严格的证明这里不给。

为什么取绝对值：雅可比行列式为负，说明$T$把小块翻了个面（朝向（orientation）反了），面积仍然是正的。验算：极坐标$x=r\cos\theta$、$y=r\sin\theta$，$\frac{\partial(x,y)}{\partial(r,\theta)}=\cos\theta\cdot r\cos\theta-(-r\sin\theta)\sin\theta=r$，正是[极坐标下的二重积分](lesson:math.vector-calculus.polar-double-integrals)里的因子$r$。边界情况：$T$不是一对一时，同一块区域会被算好几次，例如极坐标里让$\theta$从$0$积到$4\pi$，圆盘的面积就算成了两倍。

::anchor{id="thm-jacobian-inverse"}
**反过来的雅可比行列式**　若$u=u(x,y)$、$v=v(x,y)$是$T$的反过来的变换，则在对应的点上$\frac{\partial(x,y)}{\partial(u,v)}\cdot\frac{\partial(u,v)}{\partial(x,y)}=1$。

**证明思路**：先用$T$、再用反过来的变换，每一点都回到原处，面积不变；两次的放大倍数相乘是$1$，带上朝向，两个行列式的乘积也是$1$。只知道$u$、$v$用$x$、$y$表示时，先算$\frac{\partial(u,v)}{\partial(x,y)}$再取倒数，不必解出$x$、$y$（例 2）。

## 几何图像

:::anim{component="linear-map-2d"}
matrix: [["cos(th)", "-r*sin(th)"], ["sin(th)", "r*cos(th)"]]
range: { x: [-3, 3], y: [-3, 3] }
show: [grid, square, basis, det]
sliders:
  - name: r
    min: 0.25
    max: 2.5
    step: 0.25
    default: 1.5
    label: |
      极坐标的$r$
  - name: th
    min: 0
    max: 6.25
    step: 0.25
    default: 0.75
    label: |
      极坐标的$\theta$（弧度）
:::

动画作用的是极坐标变换在$(r,\theta)$处的:term[雅可比矩阵]{id="math.vector-calculus.jacobian-matrix"}$\begin{pmatrix}\cos\theta&-r\sin\theta\\\sin\theta&r\cos\theta\end{pmatrix}$：单位正方形先沿两列被拉成一个矩形，一边长$1$（沿半径方向），一边长$r$（沿圆周方向），再转一个角度$\theta$。右上角显示的行列式始终等于$r$，和$\theta$无关；拖动$r$，面积的放大倍数跟着变，$r$越小，沿圆周方向压得越扁。

![两幅图，中间一个箭头。左图是 uv 平面上的矩形 0 ≤ u ≤ 2、0 ≤ v ≤ 1，画着间隔 0.5 的网格，涂成浅蓝色，其中 0.5 ≤ u ≤ 1、0 ≤ v ≤ 0.5 的一小格涂成棕色。右图是 xy 平面上它的像：由 x + y = 0、x + y = 2、x − y = 0、x − y = 1 围成的斜放的长方形，网格线变成和坐标轴成 45° 的两组平行线，涂成浅绿色，三个角标着 (1, 1)、(1.5, 0.5)、(0.5, −0.5)，棕色小格的像是一个小正方形。箭头上方写着 x = (u + v)/2，y = (u − v)/2。下方两行字：左边一个小格的面积是 0.25，变到右边，面积缩小一半；雅可比行列式是 −1/2，取绝对值，面积元 dx dy = (1/2) du dv。](substitution.svg)

这是例 2 的换元。$uv$平面上的矩形被变成斜放的长方形，每一小格都缩成原来面积的一半，所以$\dd x\dd y=\frac12\dd u\dd v$；:term[雅可比行列式]{id="math.vector-calculus.jacobian-determinant"}是负的，说明图形还翻了个面。

## 例题

### 例 1　球坐标的雅可比行列式

用三阶行列式算出$\frac{\partial(x,y,z)}{\partial(r,\theta,\varphi)}$，其中$x=r\sin\theta\cos\varphi$，$y=r\sin\theta\sin\varphi$，$z=r\cos\theta$。

**为什么想到这么做**：[柱坐标与球坐标下的三重积分](lesson:math.vector-calculus.cylindrical-spherical)里量小盒子的三条棱得到$r^2\sin\theta$，这里用:term[换元公式]{id="math.vector-calculus.change-of-variables-formula"}的统一算法再算一次。先写出$3\times3$的:term[雅可比矩阵]{id="math.vector-calculus.jacobian-matrix"}，再用三阶行列式的六项公式；第三行有一个$0$，只剩四项。

**推导**：雅可比矩阵是$\begin{pmatrix}\sin\theta\cos\varphi&r\cos\theta\cos\varphi&-r\sin\theta\sin\varphi\\\sin\theta\sin\varphi&r\cos\theta\sin\varphi&r\sin\theta\cos\varphi\\\cos\theta&-r\sin\theta&0\end{pmatrix}$。六项里含$a_{33}=0$的两项为$0$，其余四项是$r^2\sin\theta\cos^2\theta\cos^2\varphi$、$r^2\sin^3\theta\sin^2\varphi$、$r^2\sin\theta\cos^2\theta\sin^2\varphi$、$r^2\sin^3\theta\cos^2\varphi$。相加得$r^2\sin\theta\cos^2\theta+r^2\sin^3\theta=r^2\sin\theta$，和那里的结果一致。

### 例 2　斜放的长方形

$D$是由直线$x+y=0$、$x+y=2$、$x-y=0$、$x-y=1$围成的区域。求$\iint_D(x+y)e^{x-y}\,\dd A$。

**为什么想到这么做**：区域的四条边都是$x+y$或$x-y$等于常数，被积函数也只含这两个组合。令$u=x+y$、$v=x-y$，区域变成矩形$0\le u\le2$、$0\le v\le1$，被积函数变成$ue^v$。

**推导**：$\frac{\partial(u,v)}{\partial(x,y)}=\det\begin{pmatrix}1&1\\1&-1\end{pmatrix}=-2$，所以$\frac{\partial(x,y)}{\partial(u,v)}=-\frac12$，绝对值$\frac12$。原式$=\int_0^2\int_0^1ue^v\cdot\frac12\dd v\dd u=\frac12\cdot2\cdot(e-1)=e-1\approx1.718$。也可以先解出$x=\frac{u+v}2$、$y=\frac{u-v}2$，直接算$\frac{\partial(x,y)}{\partial(u,v)}=\frac12\cdot\Bigl(-\frac12\Bigr)-\frac12\cdot\frac12=-\frac12$，结果一样。

## 常见误区

- 「换元时把$\dd x\dd y$直接换成$\dd u\dd v$。」要乘$\left|\frac{\partial(x,y)}{\partial(u,v)}\right|$；漏掉它，例 2 会算成$2(e-1)$，多了一倍。
- 「:term[雅可比行列式]{id="math.vector-calculus.jacobian-determinant"}就是$\frac{\partial(u,v)}{\partial(x,y)}$。」公式里要的是旧变量对新变量的$\frac{\partial(x,y)}{\partial(u,v)}$；手里只有$u$、$v$用$x$、$y$表示的式子时，算出$\frac{\partial(u,v)}{\partial(x,y)}$再取倒数。
- 「雅可比行列式是负的，积分就变号。」公式里取的是绝对值，负号只说明朝向翻了，面积仍是正的。
- 「随便一个换元都能用这个公式。」要一对一：极坐标里$\theta$积满$4\pi$，同一块区域被算了两次。

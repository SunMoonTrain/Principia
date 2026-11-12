---
id: math.vector-calculus.jacobian
title: |
  雅可比矩阵
goal: |
  会写出向量值函数的雅可比矩阵，并把链式法则写成雅可比矩阵的乘积。
prerequisites: [math.vector-calculus.multivariable-chain-rule, math.linear-algebra.determinant]
minutes: 35
summary: |
  雅可比矩阵是局部的线性近似，链式法则就是矩阵相乘。
status: reviewed
---

## 这一节要回答的问题

极坐标$(r,\theta)\mapsto(r\cos\theta,r\sin\theta)$把一对数变成另一对数；平面上的速度场（velocity field）$\vb f(x,y)=(f_1,f_2)$也是这样，每个点对应一个向量。这种「点对应到点」的函数在一点附近怎样变化？一个小正方形被它变成近似的平行四边形，这个近似是哪个线性变换（linear transformation）？几个这样的函数复合起来，:term[链式法则]{id="math.vector-calculus.chain-rule"}（chain rule）又该怎样写才简洁？

## 讲解

### 向量值函数

::anchor{id="def-vector-valued-function"}
把$\R^n$中的点对应到$\R^m$中的点的函数$\vb f(\vb x)=\bigl(f_1(\vb x),\dots,f_m(\vb x)\bigr)$叫作:term[向量值函数]{id="math.vector-calculus.vector-valued-function"}（vector-valued function），$f_1,\dots,f_m$叫作它的分量函数（component function）。

为什么这样定义：每个分量函数都是一个:term[多元函数]{id="math.vector-calculus.multivariable-function"}（function of several variables），合起来描述一个点怎样变到另一个点。极坐标是$n=m=2$的例子，空间曲线$\vb r(t)$是$n=1$的例子，速度场是$n=m$的例子。:term[连续]{id="math.vector-calculus.continuous"}（continuous）、:term[可微]{id="math.vector-calculus.differentiable"}（differentiable）都按分量来说：每个分量函数都可微，就说$\vb f$可微。边界情况：$m=1$时就是普通的多元函数。

### 雅可比矩阵

::anchor{id="def-jacobian-matrix"}
设$\vb f$的各分量函数在$\vb a$处的:term[偏导数]{id="math.vector-calculus.partial-derivative"}（partial derivative）都存在。$m\times n$矩阵$J_{\vb f}(\vb a)$，第$i$行第$j$列是$\pdv{f_i}{x_j}(\vb a)$，叫作$\vb f$在$\vb a$处的:term[雅可比矩阵]{id="math.vector-calculus.jacobian-matrix"}（Jacobian matrix）。

为什么这样定义：第$i$行是分量$f_i$的各个偏导数，合起来就是$f_i$的:term[梯度]{id="math.vector-calculus.gradient"}（gradient），见[方向导数与梯度](lesson:math.vector-calculus.gradient)；第$j$列$\pdv{\vb f}{x_j}$是只让$x_j$变动时像点移动的速度。例如极坐标$(r,\theta)\mapsto(r\cos\theta,r\sin\theta)$的雅可比矩阵是$\begin{pmatrix}\cos\theta&-r\sin\theta\\\sin\theta&r\cos\theta\end{pmatrix}$。边界情况：$m=1$时它是一行，就是各个偏导数排成的行；$n=1$时它是一列，就是曲线的速度$\vb r'(t)$。

::anchor{id="thm-local-linear"}
**:term[局部线性近似]{id="math.vector-calculus.local-linear-approximation"}（local linear approximation）**　设$\vb f$的各分量函数在$\vb a$处都:term[可微]{id="math.vector-calculus.differentiable"}，则$\vb f(\vb a+\vb h)=\vb f(\vb a)+J_{\vb f}(\vb a)\vb h+\vb r(\vb h)$，其中$\vb h\to\vb 0$时$\frac{|\vb r(\vb h)|}{|\vb h|}\to0$。

**证明思路**：每个分量可微，$f_i(\vb a+\vb h)=f_i(\vb a)+\sum_j\pdv{f_i}{x_j}(\vb a)h_j+r_i$，$\frac{r_i}{|\vb h|}\to0$。把$m$个式子竖着排起来，$\sum_j\pdv{f_i}{x_j}h_j$正是$J_{\vb f}\vb h$的第$i$个分量；$|\vb r|\le|r_1|+\dots+|r_m|$，所以$\frac{|\vb r|}{|\vb h|}\to0$。

所以在$\vb a$附近，$\vb f$的作用差不多就是线性变换$\vb h\mapsto J_{\vb f}(\vb a)\vb h$（见[线性变换及其矩阵](lesson:math.linear-algebra.linear-maps)）：小正方形被变成近似的平行四边形。常微分方程里的:term[线性化]{id="math.ode.linearization"}（linearization）用的正是这个近似。

### 链式法则的矩阵形式

::anchor{id="thm-chain-rule-matrix"}
**:term[链式法则]{id="math.vector-calculus.chain-rule"}的矩阵形式**　设$\vb g:\R^n\to\R^m$在$\vb a$处:term[可微]{id="math.vector-calculus.differentiable"}，$\vb f:\R^m\to\R^p$在$\vb g(\vb a)$处可微，则复合函数$\vb f\circ\vb g$在$\vb a$处可微，并且$J_{\vb f\circ\vb g}(\vb a)=J_{\vb f}\bigl(\vb g(\vb a)\bigr)J_{\vb g}(\vb a)$。

**证明思路**：记$\vb u=\vb g(\vb x)$。由多个自变量的链式法则，$\pdv{(f_i\circ\vb g)}{x_j}=\sum_k\pdv{f_i}{u_k}\pdv{g_k}{x_j}$，正是$J_{\vb f}$的第$i$行乘以$J_{\vb g}$的第$j$列。复合函数可微，道理是两个:term[局部线性近似]{id="math.vector-calculus.local-linear-approximation"}复合起来，误差仍比$|\vb h|$小得多。

为什么是乘积：$\vb g$在$\vb a$附近近似于线性变换$J_{\vb g}$，$\vb f$在$\vb g(\vb a)$附近近似于$J_{\vb f}$，先作用$J_{\vb g}$、再作用$J_{\vb f}$，就是乘以矩阵$J_{\vb f}J_{\vb g}$。次序不能颠倒：外层函数的:term[雅可比矩阵]{id="math.vector-calculus.jacobian-matrix"}写在左边。上一节依赖关系图（dependency diagram）上「每条路径相乘再相加」，写成矩阵就是这一个乘法。

## 几何图像

![两幅图。左图是 xy 平面上点 (1, 0.5) 附近的一个小正方形网格，边长 0.6，格子间隔 0.1，中心是黑点。右图是 uv 平面，蓝色曲线网格是这个小正方形在 F(x, y) = (x² − y², 2xy) 下的像，是一块有点弯的四边形；棕色虚线网格是在线性近似 F(1, 0.5) + Jh 下的像，是一个转过一定角度、放大了的正方形；两套网格在中心点 (0.75, 1) 附近几乎重合，越往外差得越多。下方两行字：蓝色是真实的像，棕色虚线是线性近似的像，J = [[2, −1], [1, 2]]；离中心越近，两套网格贴得越紧，小正方形近似地转了约 27°、放大了约 2.24 倍。](local-linear.svg)

图里$\vb F(x,y)=(x^2-y^2,2xy)$，在$(1,0.5)$处:term[雅可比矩阵]{id="math.vector-calculus.jacobian-matrix"}是$\begin{pmatrix}2x&-2y\\2y&2x\end{pmatrix}=\begin{pmatrix}2&-1\\1&2\end{pmatrix}$。真实的像是弯的，线性近似的像是直的；在中心附近两者几乎重合，越往外差得越多，误差和到中心距离的平方同阶（第 7 题）。

:::anim{component="linear-map-2d"}
matrix: [["2*a", "-2*b"], ["2*b", "2*a"]]
range: { x: [-6.5, 6.5], y: [-6.5, 6.5] }
show: [grid, square, basis, det]
sliders:
  - name: a
    min: -1.5
    max: 1.5
    step: 0.25
    default: 1
    label: |
      点的横坐标$a$
  - name: b
    min: -1.5
    max: 1.5
    step: 0.25
    default: 0.5
    label: |
      点的纵坐标$b$
:::

动画作用的是同一个$\vb F$在点$(a,b)$处的雅可比矩阵$\begin{pmatrix}2a&-2b\\2b&2a\end{pmatrix}$，默认就是上图的那一点。拖动$a$、$b$看：这个矩阵总是把单位正方形转一个角度、再放大，不会压扁，转的角度和$(a,b)$的方向角相同，边长放大$2\sqrt{a^2+b^2}$倍，面积放大$4(a^2+b^2)$倍，等于这个矩阵的行列式，动画结束时显示在右上角。插值途中的矩阵$(1-s)I+sJ$也是这种形状，所以图形一路都是正方形；$(a,b)=(0,0)$时矩阵为零，整个平面缩成一点。$b=0$、$a<0$时，途中有一刻矩阵为零，正方形先缩成一点，再朝相反方向张开。

## 例题

### 例 1　极坐标的雅可比矩阵

求$\vb F(r,\theta)=(r\cos\theta,r\sin\theta)$在$(r,\theta)=\bigl(2,\frac\pi3\bigr)$处的:term[雅可比矩阵]{id="math.vector-calculus.jacobian-matrix"}和它的行列式。

**为什么想到这么做**：两个分量函数$x=r\cos\theta$、$y=r\sin\theta$分别对$r$、$\theta$求:term[偏导数]{id="math.vector-calculus.partial-derivative"}，按「行是分量、列是变量」排好。

**推导**：$J=\begin{pmatrix}\cos\theta&-r\sin\theta\\\sin\theta&r\cos\theta\end{pmatrix}$，在$\bigl(2,\frac\pi3\bigr)$处是$\begin{pmatrix}\frac12&-\sqrt3\\\frac{\sqrt3}2&1\end{pmatrix}$。行列式是$r\cos^2\theta+r\sin^2\theta=r=2$。由:term[局部线性近似]{id="math.vector-calculus.local-linear-approximation"}，$(r,\theta)$平面上边长$\Delta r$、$\Delta\theta$的小矩形，被变成面积约为$2\,\Delta r\Delta\theta$的小块；以后在[重积分的换元与雅可比行列式](lesson:math.vector-calculus.change-of-variables)里，这个面积的比例就是:term[雅可比行列式]{id="math.vector-calculus.jacobian-determinant"}（Jacobian determinant）。

### 例 2　用矩阵乘积求复合函数的偏导数

$\vb g(s,t)=(s+t,\ st)$，$\vb f(u,v)=(u^2-v,\ e^v)$。用:term[链式法则]{id="math.vector-calculus.chain-rule"}的矩阵形式求$J_{\vb f\circ\vb g}(1,0)$。

**为什么想到这么做**：分别求两个:term[雅可比矩阵]{id="math.vector-calculus.jacobian-matrix"}，内层的在$(1,0)$处取值，外层的在$\vb g(1,0)$处取值，再相乘。

**推导**：$\vb g(1,0)=(1,0)$。$J_{\vb g}=\begin{pmatrix}1&1\\t&s\end{pmatrix}$，在$(1,0)$处是$\begin{pmatrix}1&1\\0&1\end{pmatrix}$；$J_{\vb f}=\begin{pmatrix}2u&-1\\0&e^v\end{pmatrix}$，在$(1,0)$处是$\begin{pmatrix}2&-1\\0&1\end{pmatrix}$。所以$J_{\vb f\circ\vb g}(1,0)=\begin{pmatrix}2&-1\\0&1\end{pmatrix}\begin{pmatrix}1&1\\0&1\end{pmatrix}=\begin{pmatrix}2&1\\0&1\end{pmatrix}$。验算：$\vb f\circ\vb g=\bigl((s+t)^2-st,\ e^{st}\bigr)$，对$s$求:term[偏导数]{id="math.vector-calculus.partial-derivative"}得$\bigl(2(s+t)-t,\ te^{st}\bigr)=(2,0)$，对$t$得$\bigl(2(s+t)-s,\ se^{st}\bigr)=(1,1)$，正是两列。

## 常见误区

- 「:term[雅可比矩阵]{id="math.vector-calculus.jacobian-matrix"}的第$i$行是对$x_i$的:term[偏导数]{id="math.vector-calculus.partial-derivative"}。」行对应分量函数，列对应自变量；$\R^n\to\R^m$的雅可比矩阵是$m\times n$的。
- 「$J_{\vb f\circ\vb g}=J_{\vb g}J_{\vb f}$。」先作用的写在右边，外层的$J_{\vb f}$在左，而且要在$\vb g(\vb a)$处取值；例 2 里换了次序，结果就不对。
- 「雅可比矩阵给出的线性变换，在整个定义域上都代替得了原来的函数。」它只是一点附近的近似，离开这一点越远误差越大（第 7 题）。
- 「:term[偏导数]{id="math.vector-calculus.partial-derivative"}都存在，就有:term[局部线性近似]{id="math.vector-calculus.local-linear-approximation"}。」要各分量函数:term[可微]{id="math.vector-calculus.differentiable"}；只有偏导数时，雅可比矩阵写得出来，却未必近似得了原来的函数。

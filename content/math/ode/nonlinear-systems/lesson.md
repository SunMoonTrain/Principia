---
id: math.ode.nonlinear-systems
title: |
  非线性系统与线性化
goal: |
  会求非线性系统的平衡点，并用雅可比矩阵线性化，判断平衡点附近的相图。
prerequisites: [math.ode.phase-plane-linear, math.vector-calculus.jacobian]
minutes: 35
summary: |
  在平衡点用雅可比矩阵线性化；双曲时可信，中心要另想办法。
status: reviewed
---

## 这一节要回答的问题

单摆$\theta''=-\frac gl\sin\theta$、捕食者和猎物的数量模型，都是非线性的方程组，一般写不出解的公式。它们可以有好几个:term[平衡点]{id="math.ode.equilibrium-point"}（equilibrium point），:term[相图]{id="math.ode.phase-portrait"}（phase portrait）在整个平面上可能很复杂。可在每个平衡点附近，方程组近似是线性的：能不能用[平面线性系统的相图](lesson:math.ode.phase-plane-linear)的分类，判断平衡点附近的样子？什么时候这样判断会出错？

## 讲解

### 平衡点与线性化

设平面上的:term[自治]{id="math.ode.autonomous-equation"}（autonomous）方程组$\vb x'=\vb f(\vb x)$，$\vb f=(f_1,f_2)$的分量有连续的偏导数（partial derivative）。:term[平衡点]{id="math.ode.equilibrium-point"}（equilibrium point）$\vb x^*$满足$\vb f(\vb x^*)=\vb 0$。令$\vb u=\vb x-\vb x^*$表示偏离平衡点的量，由[雅可比矩阵](lesson:math.vector-calculus.jacobian)（Jacobian matrix）给出的近似，$\vb u'=\vb f(\vb x^*+\vb u)=J\vb u+(\text{比}|\vb u|\text{高阶的小量})$，其中$J=\begin{pmatrix}\partial f_1/\partial x_1&\partial f_1/\partial x_2\\\partial f_2/\partial x_1&\partial f_2/\partial x_2\end{pmatrix}$在$\vb x^*$处取值。

::anchor{id="def-linearization"}
线性方程组$\vb u'=J\vb u$叫作$\vb x'=\vb f(\vb x)$在平衡点$\vb x^*$处的:term[线性化]{id="math.ode.linearization"}（linearization），其中$J$是$\vb f$在$\vb x^*$处的雅可比矩阵。

为什么这样定义：$\vb u$很小时，高阶的小量比$J\vb u$小得多，舍掉它，就得到一个可以完全分析的线性方程组。这和一维的[判别法](lesson:math.ode.autonomous-equations#thm-linearization)看$f'(y^*)$的符号是同一个想法，那里的$f'(y^*)$就是$1\times1$的雅可比矩阵。边界情况：$\vb f$本身是线性的$A\vb x$时，$J=A$，线性化就是原来的方程组。

### 双曲平衡点

::anchor{id="def-hyperbolic"}
雅可比矩阵$J$的特征值（eigenvalue）的实部都不为零时，:term[平衡点]{id="math.ode.equilibrium-point"}$\vb x^*$叫作:term[双曲平衡点]{id="math.ode.hyperbolic-equilibrium"}（hyperbolic equilibrium point）。

为什么这样定义：实部不为零，就是特征值不落在虚轴上，把$J$稍微改动一点，特征值只移动一点，实部的符号不变；高阶的小量正像这样一点改动。以迹（trace）$T$、行列式$D$为坐标画平面，双曲的平衡点就是去掉横轴$D=0$和纵轴上$D>0$的那一段以后剩下的部分：:term[鞍点]{id="math.ode.saddle-point"}（saddle point）、:term[结点]{id="math.ode.node"}（node）、:term[焦点]{id="math.ode.focus"}（focus）都是双曲的，:term[中心]{id="math.ode.center"}（center）不是。边界情况：特征值为$0$或是纯虚数时不是双曲的。

::anchor{id="thm-hartman-grobman"}
**:term[哈特曼-格罗布曼定理]{id="math.ode.hartman-grobman-theorem"}（Hartman-Grobman theorem）**　设$\vb x^*$是双曲平衡点。则在$\vb x^*$附近，$\vb x'=\vb f(\vb x)$和它的:term[线性化]{id="math.ode.linearization"}有同样样子的:term[相图]{id="math.ode.phase-portrait"}：有一个连续的一一对应，把$\vb x^*$附近的:term[轨线]{id="math.ode.trajectory"}（trajectory）变成线性化的轨线，并保持运动的方向。所以稳定性由线性化决定：$J$的特征值的实部都为负时$\vb x^*$:term[渐近稳定]{id="math.ode.asymptotically-stable"}（asymptotically stable），有一个为正时不稳定。

**证明思路**：这里不证。直观上，离$\vb x^*$越近，高阶的小量越小，而双曲时线性部分的「推力」处处不为零（实部为负的方向往里拉，为正的方向往外推），小量改变不了它。进一步还可以证明（$\vb f$足够光滑时），线性化是鞍点、两个特征值不同的结点、焦点时，原来的系统在$\vb x^*$附近也分别是鞍点、结点、焦点。

中心不是双曲的，线性化判断不了。例如$x'=-y+x(x^2+y^2)$、$y'=x+y(x^2+y^2)$，在原点的线性化是$x'=-y$、$y'=x$，原点是中心；可换成极坐标，$r'=r^3>0$、$\theta'=1$，轨线盘旋着离开原点，原点其实是不稳定的焦点（第 5 题）。

### 守恒量与中心

::anchor{id="def-conserved"}
如果函数$E(\vb x)$沿着$\vb x'=\vb f(\vb x)$的每个解都不变，即$\frac{\dd}{\dd t}E(\vb x(t))=\frac{\partial E}{\partial x_1}f_1+\frac{\partial E}{\partial x_2}f_2\equiv0$，并且$E$在任何一小块区域上都不是常数，就说$E$是这个方程组的:term[守恒量]{id="math.ode.conserved-quantity"}（conserved quantity）。

为什么这样定义：有守恒量时，每条:term[轨线]{id="math.ode.trajectory"}（trajectory）都待在$E$的一条等值线（level curve）上，画出等值线就画出了轨线。不加「在一小块区域上不是常数」，常数函数就成了守恒量，没有意义。边界情况：单摆$\theta'=v$、$v'=-\sin\theta$的能量$E=\frac12v^2-\cos\theta$是守恒量，$\frac{\dd E}{\dd t}=v\cdot(-\sin\theta)+\sin\theta\cdot v=0$。

::anchor{id="thm-conserved-center"}
**守恒量与:term[中心]{id="math.ode.center"}**　设$E$是$\vb x'=\vb f(\vb x)$的守恒量，$\vb x^*$是孤立的:term[平衡点]{id="math.ode.equilibrium-point"}（附近没有别的平衡点），并且$E$在$\vb x^*$处取严格的局部极小值。则$\vb x^*$附近的轨线都是绕$\vb x^*$的闭曲线，$\vb x^*$是:term[中心]{id="math.ode.center"}。

**证明思路**：$E$在严格极小点附近的等值线是一圈套一圈的闭曲线，解就在上面走；附近没有别的平衡点，解不会停下来，绕一圈回到出发点，轨线是闭的。所以对守恒的系统，:term[线性化]{id="math.ode.linearization"}是中心时可以再用守恒量确认。分析力学[相空间与刘维尔定理](lesson:physics.analytical-mechanics.phase-space-liouville)里势能的极小点周围是闭曲线，就是这个定理的一个例子。

## 几何图像

:::anim{component="phase-portrait"}
system: { x: "y", y: "-sin(x) - b*y" }
range: { x: [-7, 7], y: [-3.5, 3.5] }
dt: 0.01
initial:
  - [1, 0]
  - [2.5, 0]
  - [-3.1, 0.05]
  - [-7, 2.2]
  - [7, -2.2]
  - [-7, 3]
  - [7, -3]
sliders:
  - name: b
    min: 0
    max: 1
    step: 0.1
    default: 0
    label: |
      阻尼$b$
:::

这是单摆$\theta''=-\sin\theta-b\theta'$，横轴是角度$\theta$（图上写作 x），纵轴是角速度$\theta'$（图上写作 y）。$b=0$时，$(0,0)$、$(\pm2\pi,0)$是:term[中心]{id="math.ode.center"}，周围的闭曲线是来回摆；$(\pm\pi,0)$是:term[鞍点]{id="math.ode.saddle-point"}，上下两条波浪线是绕着悬点转圈。拖动$b$：$b>0$时中心变成:term[渐近稳定]{id="math.ode.asymptotically-stable"}的:term[焦点]{id="math.ode.focus"}，摆动越来越小；鞍点仍是鞍点，只是原来连接两个鞍点的那条:term[轨线]{id="math.ode.trajectory"}断开了。

## 例题

### 例 1　有阻尼的单摆

用:term[线性化]{id="math.ode.linearization"}判断$\theta'=v$、$v'=-\sin\theta-bv$（$0<b<2$）的:term[平衡点]{id="math.ode.equilibrium-point"}各是什么类型。

**为什么想到这么做**：平衡点是$v=0$、$\sin\theta=0$的点；求出雅可比矩阵，在每个平衡点代值，再用迹和行列式分类；平衡点是双曲的，结论可靠。

**推导**：平衡点是$(k\pi,0)$，$k$是整数。雅可比矩阵$J=\begin{pmatrix}0&1\\-\cos\theta&-b\end{pmatrix}$。$k$为偶数时$\cos\theta=1$，$T=-b<0$、$D=1$、$T^2-4D=b^2-4<0$，是:term[渐近稳定]{id="math.ode.asymptotically-stable"}的:term[焦点]{id="math.ode.focus"}；$k$为奇数时$\cos\theta=-1$，$D=-1<0$，是:term[鞍点]{id="math.ode.saddle-point"}。特征值的实部都不为零，由:term[哈特曼-格罗布曼定理]{id="math.ode.hartman-grobman-theorem"}和定理后面那句补充（单摆的$\vb f$足够光滑），原来的单摆在最低点附近也是渐近稳定的焦点，摆动越来越小，在最高点附近是鞍点。

### 例 2　捕食者和猎物

$x$、$y$是猎物和捕食者的数量（按比例缩放过），满足$x'=x(1-y)$、$y'=y(x-1)$。判断:term[平衡点]{id="math.ode.equilibrium-point"}$(1,1)$的类型。

**为什么想到这么做**：$(1,1)$处的:term[线性化]{id="math.ode.linearization"}是:term[中心]{id="math.ode.center"}，不是双曲的，线性化判断不了；试着找一个:term[守恒量]{id="math.ode.conserved-quantity"}。把两个方程相除，$\frac{\dd y}{\dd x}=\frac{y(x-1)}{x(1-y)}$，可以分离变量。

**推导**：$J=\begin{pmatrix}1-y&-x\\y&x-1\end{pmatrix}$在$(1,1)$处是$\begin{pmatrix}0&-1\\1&0\end{pmatrix}$，$T=0$、$D=1$，线性化是中心。分离变量得$\frac{1-y}{y}\dd y=\frac{x-1}{x}\dd x$，积分后知道$E=x-\ln x+y-\ln y$是守恒量；验证：$\frac{\dd E}{\dd t}=\bigl(1-\frac1x\bigr)x(1-y)+\bigl(1-\frac1y\bigr)y(x-1)=(x-1)(1-y)+(y-1)(x-1)=0$。$x-\ln x$在$x=1$处取严格的最小值，$y-\ln y$也是，所以$E$在$(1,1)$处取严格的极小值，$(1,1)$是孤立的平衡点，由上面的定理它是中心：两种数量周期性地此起彼伏。

## 常见误区

- 「:term[线性化]{id="math.ode.linearization"}是:term[中心]{id="math.ode.center"}，原来的系统就是中心。」中心不是双曲的，非线性项可以把它变成:term[焦点]{id="math.ode.focus"}；要用:term[守恒量]{id="math.ode.conserved-quantity"}等别的办法确认（例 2）。
- 「非线性方程组只有一个:term[平衡点]{id="math.ode.equilibrium-point"}，在原点。」可以有好几个，每个平衡点都要分别代值、分别线性化（例 1）。
- 「:term[线性化]{id="math.ode.linearization"}在整个平面上都近似原来的系统。」只在平衡点附近可靠；离远了，单摆会转圈，而线性化的:term[轨线]{id="math.ode.trajectory"}只会绕原点转。
- 「平衡点的特征值实部为负，从哪里出发的解都趋于它。」这只保证附近出发的解趋于它；有阻尼的单摆有无穷多个:term[渐近稳定]{id="math.ode.asymptotically-stable"}的平衡点，各自吸引自己附近的解。

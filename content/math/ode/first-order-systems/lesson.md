---
id: math.ode.first-order-systems
title: |
  一阶线性方程组
goal: |
  会把高阶方程化成一阶方程组，并写成$\vb{x}'=A\vb{x}$的矩阵形式。
prerequisites: [math.ode.constant-coefficients, math.linear-algebra.matrices]
minutes: 30
summary: |
  状态排成向量，方程写成$\vb x'=A\vb x$；齐次方程组的解组成$n$维空间。
status: reviewed
---

## 这一节要回答的问题

两个用弹簧连着的物块，每个物块的加速度都取决于两个物块的位置；两个连通的水箱，每个水箱里盐的变化率取决于两边的含盐量。就连一个$y''=-y$，要预测以后，也得同时知道$y$和$y'$（[微分方程与方向场](lesson:math.ode.what-is-ode)第 8 题）。能不能把这些方程统一写成「状态的变化率由状态决定」，再用一个矩阵把线性的情形写得简洁？

## 讲解

### 一阶方程组

::anchor{id="def-system"}
$n$个未知函数$x_1(t),\dots,x_n(t)$满足的一组方程$x_i'=f_i(t,x_1,\dots,x_n)$（$i=1,\dots,n$）叫作:term[一阶方程组]{id="math.ode.first-order-system"}（system of first-order equations）；把未知函数排成向量$\vb x=(x_1,\dots,x_n)$，它写成$\vb x'=\vb f(t,\vb x)$，再给定$\vb x(t_0)=\vb x_0$，就是方程组的:term[初值问题]{id="math.ode.initial-value-problem"}（initial value problem）。

为什么这样定义：$\vb x$记下了系统此刻的全部状态，方程说的是「状态的变化率由此刻的时间和状态决定」，和一个方程$y'=f(t,y)$是同一个意思，只是$y$换成了向量。$\vb f$满足[方程组与高阶方程](lesson:math.ode.existence-uniqueness#thm-systems)里的:term[利普希茨条件]{id="math.ode.lipschitz-condition"}（Lipschitz condition）时，初值问题在$t_0$附近有唯一的解。边界情况：$n=1$时就是以前的一阶方程。

### 高阶方程化成方程组

::anchor{id="thm-reduction"}
**高阶方程化成方程组**　令$x_1=y$、$x_2=y'$、…、$x_n=y^{(n-1)}$，$n$阶方程$y^{(n)}=g(t,y,y',\dots,y^{(n-1)})$就化成:term[一阶方程组]{id="math.ode.first-order-system"}$x_1'=x_2$、…、$x_{n-1}'=x_n$、$x_n'=g(t,x_1,\dots,x_n)$；方程的解$y$和方程组的解$\vb x$通过$\vb x=(y,y',\dots,y^{(n-1)})$一一对应。

**证明思路**：若$y$是方程的解，按上面的方式排出的$\vb x$满足方程组，前$n-1$个方程只是记号的定义。反过来，若$\vb x$满足方程组，前几个方程依次给出$x_2=x_1'$、…、$x_n=x_1^{(n-1)}$，最后一个方程就是$x_1$满足的$n$阶方程。初值$y(t_0)$、…、$y^{(n-1)}(t_0)$也正好对应$\vb x(t_0)$。

例如$y''+p(t)y'+q(t)y=g(t)$化成$x_1'=x_2$、$x_2'=-q(t)x_1-p(t)x_2+g(t)$。几个高阶方程连在一起时也一样，每个未知函数和它的各阶导数（最高阶的除外）都当作新的未知函数，见例 1。

### 矩阵形式与解的结构

::anchor{id="def-linear-system"}
右边对$\vb x$是线性的方程组$\vb x'=A(t)\vb x+\vb g(t)$叫作:term[一阶线性方程组]{id="math.ode.first-order-linear-system"}（first-order linear system），其中$A(t)$是$n\times n$的矩阵，每个元素是$t$的函数，$\vb g(t)$是:term[向量值函数]{id="math.vector-calculus.vector-valued-function"}（vector-valued function）；$\vb g\equiv\vb 0$时叫作齐次的（homogeneous）。

为什么这样定义：矩阵乘法把$n$个方程压成一个式子，$A\vb x$的第$i$个分量正是第$i$个方程右边的线性部分。$y''+py'+qy=g$化成的方程组就是这样，$A=\begin{pmatrix}0&1\\-q&-p\end{pmatrix}$、$\vb g=\begin{pmatrix}0\\g\end{pmatrix}$。边界情况：$A$是常数矩阵、$\vb g\equiv\vb 0$时，方程组就是常系数的齐次方程组$\vb x'=A\vb x$，下面几节主要讨论它。

::anchor{id="thm-linear-system-space"}
**解的结构**　设$A(t)$、$\vb g(t)$在区间$I$上连续，$t_0\in I$。则对任意$\vb x_0$，:term[初值问题]{id="math.ode.initial-value-problem"}$\vb x'=A(t)\vb x+\vb g(t)$、$\vb x(t_0)=\vb x_0$在整个$I$上有唯一的解；齐次方程组$\vb x'=A(t)\vb x$的全部解组成$n$维的向量空间（vector space），并且$n$个解线性无关，当且仅当它们在$t_0$处的值是$n$个线性无关的向量。

**证明思路**：存在唯一性和[二阶线性方程](lesson:math.ode.second-order-linear#thm-existence-linear)的情形一样，右边对$\vb x$满足:term[利普希茨条件]{id="math.ode.lipschitz-condition"}，并且至多线性增长，解不会在$I$内跑到无穷，这里不细证。解空间的部分照搬[解空间是二维的](lesson:math.ode.second-order-linear#thm-solution-space)的证明：把解$\vb x$对应到它在$t_0$处的值$\vb x(t_0)\in\R^n$，这个对应是线性的，由存在性它取遍$\R^n$，由唯一性只有零解对应零向量。所以解空间和$\R^n$一样是$n$维的，线性无关的解对应线性无关的初值（第 5 题）。

::anchor{id="def-fundamental-matrix"}
以齐次方程组$\vb x'=A(t)\vb x$的$n$个线性无关的解为列排成的矩阵$\Phi(t)$叫作这个方程组的:term[基本解矩阵]{id="math.ode.fundamental-matrix"}（fundamental matrix）；这时$\Phi'=A\Phi$，齐次方程组的:term[通解]{id="math.ode.general-solution"}（general solution）是$\vb x=\Phi(t)\vb c$，$\vb c$是任意的常数向量。

为什么这样定义：$\Phi(t)\vb c$就是这$n$个解以$\vb c$的分量为系数的线性组合，由上面的定理，它取遍全部的解；要满足初值，只需解线性方程组$\Phi(t_0)\vb c=\vb x_0$。非齐次方程组的解是一个:term[特解]{id="math.ode.particular-solution"}（particular solution）加上$\Phi(t)\vb c$，道理和[一阶线性方程](lesson:math.ode.linear-first-order#thm-linear-structure)一样：两个解之差满足齐次方程组。边界情况：$n=2$、方程组来自二阶方程时，$\Phi$的第一行就是一个:term[基本解组]{id="math.ode.fundamental-set"}（fundamental set of solutions），第二行是它们的导数。

### 相平面

::anchor{id="def-phase-plane"}
设$n=2$，方程组是:term[自治]{id="math.ode.autonomous-equation"}（autonomous）的，即右边不显含$t$：$\vb x'=\vb f(\vb x)$。以$x_1$、$x_2$为坐标的平面叫作:term[相平面]{id="math.ode.phase-plane"}（phase plane）；一个解$\vb x(t)$在相平面上描出的曲线，按$t$增大的方向标上箭头，叫作这个解的:term[轨线]{id="math.ode.trajectory"}（trajectory）。

为什么这样定义：自治时，经过相平面上一点的轨线，在那里的速度都是同一个$\vb f(\vb x)$，相平面上可以像:term[方向场]{id="math.ode.direction-field"}（direction field）那样画出每一点的方向，轨线顺着方向走。$y''=-y$化成$y'=v$、$v'=-y$，沿着解有$\frac{\dd}{\dd t}(y^2+v^2)=2yv-2vy=0$，所以轨线是绕原点的圆。边界情况：$\vb f(\vb x^*)=\vb 0$的点$\vb x^*$是:term[平衡点]{id="math.ode.equilibrium-point"}（equilibrium point），那里的轨线只有一个点。

解唯一时，自治方程组的轨线不会相交：若两条轨线经过同一点，把其中一个解在时间上平移，就和另一个解在那一点的值相同，由唯一性两者重合（第 6 题）。轨线丢掉了「什么时刻到哪里」，留下的是「从哪里出发、往哪里去」，后面几节都在相平面上看方程组。

## 几何图像

:::anim{component="phase-portrait"}
system: { y: "v", v: "-y - c*v" }
range: { y: [-3, 3], v: [-3, 3] }
dt: 0.01
initial:
  - [1, 0]
  - [2, 0]
  - [0, 2.5]
sliders:
  - name: c
    min: 0
    max: 1
    step: 0.1
    default: 0
    label: |
      $y''+cy'+y=0$里的$c$
:::

这是$y''+cy'+y=0$化成的方程组$y'=v$、$v'=-y-cv$在:term[相平面]{id="math.ode.phase-plane"}上的样子，横轴是$y$，纵轴是$v=y'$。$c=0$时就是$y''=-y$：三条:term[轨线]{id="math.ode.trajectory"}都是绕原点的圆，点在圆上顺时针转，转一圈的时间是$2\pi$。拖动$c$：$c>0$时轨线一圈圈地向原点盘旋，对应振幅越来越小的振动；在图上点一下，可以从那里放一条新的轨线。

## 例题

### 例 1　两个物块

两个质量为$1$的物块用三根劲度系数为$k$的弹簧串在两堵墙之间，偏离平衡位置的位移$y_1$、$y_2$满足$y_1''=-2ky_1+ky_2$、$y_2''=ky_1-2ky_2$。把它写成:term[一阶线性方程组]{id="math.ode.first-order-linear-system"}$\vb x'=A\vb x$。

**为什么想到这么做**：两个二阶方程，每个未知函数和它的一阶导数都当作新的未知函数，一共四个；它们的导数要用这四个量表示出来。

**推导**：令$\vb x=(y_1,y_2,v_1,v_2)$，$v_i=y_i'$。则$y_1'=v_1$、$y_2'=v_2$、$v_1'=-2ky_1+ky_2$、$v_2'=ky_1-2ky_2$，写成矩阵是

$$
\vb x'=\begin{pmatrix}0&0&1&0\\0&0&0&1\\-2k&k&0&0\\k&-2k&0&0\end{pmatrix}\vb x.
$$

初值要给两个物块的位移和速度，正好是$\vb x(0)$的四个分量。

### 例 2　基本解矩阵与初值

验证$\vb x_1=\begin{pmatrix}e^t\\e^t\end{pmatrix}$、$\vb x_2=\begin{pmatrix}e^{-t}\\-e^{-t}\end{pmatrix}$是$\vb x'=\begin{pmatrix}0&1\\1&0\end{pmatrix}\vb x$的解，写出:term[基本解矩阵]{id="math.ode.fundamental-matrix"}，并求满足$\vb x(0)=(2,0)$的解。

**为什么想到这么做**：代入验证是解；看它们在$t=0$处的值是否线性无关，就知道能不能组成基本解矩阵；初值给出关于$\vb c$的线性方程组。

**推导**：$A\vb x_1=\begin{pmatrix}e^t\\e^t\end{pmatrix}=\vb x_1'$，$A\vb x_2=\begin{pmatrix}-e^{-t}\\e^{-t}\end{pmatrix}=\vb x_2'$。$\vb x_1(0)=(1,1)$、$\vb x_2(0)=(1,-1)$不成比例，线性无关，所以$\Phi(t)=\begin{pmatrix}e^t&e^{-t}\\e^t&-e^{-t}\end{pmatrix}$是基本解矩阵。由$\Phi(0)\vb c=(2,0)$得$c_1+c_2=2$、$c_1-c_2=0$，$c_1=c_2=1$，所求的解是$\vb x=(e^t+e^{-t},\,e^t-e^{-t})$。

## 常见误区

- 「化成方程组以后，初值只要给$y(t_0)$。」初值是整个向量$\vb x(t_0)$，对二阶方程就是$y(t_0)$和$y'(t_0)$两个数。
- 「:term[轨线]{id="math.ode.trajectory"}就是解的图像。」轨线是$(x_1(t),x_2(t))$描出的曲线，上面不显示$t$；解的图像是$x_1$、$x_2$各自随$t$变化的曲线。
- 「:term[相平面]{id="math.ode.phase-plane"}上两条轨线可以相交。」解唯一时，:term[自治]{id="math.ode.autonomous-equation"}方程组的轨线不相交；右边显含$t$时，同一点在不同时刻的方向可以不同，轨线才会交叉（第 7 题）。
- 「$n$个解两两不成比例，就线性无关。」三个解两两不成比例，仍可能有一个是另两个的组合；要看它们在某一点的值是否线性无关。

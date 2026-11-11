---
id: math.ode.eigen-solutions
title: |
  用特征值解线性方程组
goal: |
  会用特征值和特征向量写出常系数线性方程组的通解。
prerequisites: [math.ode.first-order-systems, math.linear-algebra.diagonalization]
minutes: 30
summary: |
  试$\vb x=e^{\lambda t}\vb v$得$A\vb v=\lambda\vb v$；$n$个无关的特征向量给出通解。
status: reviewed
---

## 这一节要回答的问题

一个方程$x'=ax$的解是$Ce^{at}$；常系数的二阶方程，试$e^{rx}$就得到:term[特征方程]{id="math.ode.characteristic-equation"}（characteristic equation）。对常系数齐次（homogeneous）方程组$\vb x'=A\vb x$，能不能也找到「整体按同一个指数变化」的解？这样的解有几个，够不够拼出全部的解？

## 讲解

### 指数解与特征向量

设$\vb x=e^{\lambda t}\vb v$，$\vb v$是不为零的常数向量。代入$\vb x'=A\vb x$，左边是$\lambda e^{\lambda t}\vb v$，右边是$e^{\lambda t}A\vb v$，消去不为零的$e^{\lambda t}$，条件就是$A\vb v=\lambda\vb v$。

::anchor{id="thm-eigen-solution"}
**特征值（eigenvalue）给出的解**　设$\lambda$是$A$的特征值，$\vb v$是对应的特征向量（eigenvector），即$A\vb v=\lambda\vb v$、$\vb v\ne\vb 0$，则$\vb x(t)=e^{\lambda t}\vb v$是$\vb x'=A\vb x$的解；反过来，形如$e^{\lambda t}\vb v$（$\vb v\ne\vb 0$）的解，$\lambda$、$\vb v$一定是$A$的特征值和特征向量。

**证明思路**：就是上面的代入：$\vb x'=A\vb x$对所有$t$成立，当且仅当$\lambda\vb v=A\vb v$。几何上（$\lambda$、$\vb v$是实的时），这个解的方向始终是$\vb v$，只是长度按$e^{\lambda t}$变化：在:term[相平面]{id="math.ode.phase-plane"}（phase plane）上，它的:term[轨线]{id="math.ode.trajectory"}（trajectory）落在过原点、沿$\vb v$的直线上，$\lambda<0$时沿直线趋向原点，$\lambda>0$时沿直线离开原点。

例如$y''+py'+qy=0$化成的方程组，$A=\begin{pmatrix}0&1\\-q&-p\end{pmatrix}$，特征多项式（characteristic polynomial）是$\det(A-\lambda I)=\lambda^2+p\lambda+q$，正是二阶方程的:term[特征方程]{id="math.ode.characteristic-equation"}；特征值$\lambda$对应的特征向量是$(1,\lambda)$，解$e^{\lambda t}(1,\lambda)$的第一个分量就是以前的$e^{\lambda t}$（第 6 题）。

### 通解

::anchor{id="thm-eigen-general"}
**用特征向量写出全部的解**　设$n\times n$的实矩阵$A$有$n$个线性无关的特征向量$\vb v_1,\dots,\vb v_n$，对应的特征值$\lambda_1,\dots,\lambda_n$都是实数（可以有相同的）。则$\vb x'=A\vb x$的:term[通解]{id="math.ode.general-solution"}（general solution）是$\vb x=c_1e^{\lambda_1t}\vb v_1+\dots+c_ne^{\lambda_nt}\vb v_n$，以$e^{\lambda_it}\vb v_i$为列的矩阵是一个:term[基本解矩阵]{id="math.ode.fundamental-matrix"}（fundamental matrix）。

**证明思路**：由上面的定理，每个$e^{\lambda_it}\vb v_i$都是解。它们在$t=0$处的值$\vb v_1,\dots,\vb v_n$线性无关，由[解的结构](lesson:math.ode.first-order-systems#thm-linear-system-space)，这$n$个解线性无关，正好是$n$维解空间的一组基。初值$\vb x(0)=\vb x_0$定出系数：$c_1\vb v_1+\dots+c_n\vb v_n=\vb x_0$，$c_i$是$\vb x_0$在特征向量这组基下的坐标。

$n$个实特征值互不相同时，对应的特征向量一定线性无关，定理的条件自动满足。特征值有相同的时，只要对应的特征向量够数，照样可以用这个定理（例 2）。特征值是复数、或特征向量不够$n$个时，见以后的[平面线性系统的相图](lesson:math.ode.phase-plane-linear)和[矩阵指数](lesson:math.ode.matrix-exponential)。

### 对角化与解耦

::anchor{id="thm-decoupling"}
**解耦（decoupling）**　设$A=PDP^{-1}$，$D=\operatorname{diag}(\lambda_1,\dots,\lambda_n)$，$P$的各列是对应的特征向量。令$\vb x=P\vb y$，方程组$\vb x'=A\vb x$就化成$\vb y'=D\vb y$，即$y_i'=\lambda_iy_i$（$i=1,\dots,n$），$n$个方程互不相关。

**证明思路**：$P$是常数矩阵，$\vb x'=P\vb y'$，代入得$P\vb y'=AP\vb y$，两边左乘$P^{-1}$，$\vb y'=P^{-1}AP\vb y=D\vb y$。于是$y_i=c_ie^{\lambda_it}$，$\vb x=P\vb y=\sum c_ie^{\lambda_it}\vb v_i$，和上面的:term[通解]{id="math.ode.general-solution"}一致。

对角化（diagonalization）在方程组里的意思正在于此：换到特征向量作基的坐标里，各个坐标各自按指数变化，互不牵连。由此也看得出解的长期行为：所有$\lambda_i<0$时，每个解都趋于$\vb 0$；有一个$\lambda_i>0$时，只要初值在$\vb v_i$方向上的坐标不为零，解就随$t$增大而无界（第 5 题）。

## 几何图像

:::anim{component="phase-portrait"}
system: { x: "a*x + (b - a)*y", y: "b*y" }
range: { x: [-3, 3], y: [-3, 3] }
dt: 0.01
initial:
  - [2.5, 0]
  - [-2.5, 0]
  - [2, 2]
  - [-2, -2]
  - [-2.5, 1]
  - [2.5, -1]
  - [0.5, -2.5]
  - [-0.5, 2.5]
sliders:
  - name: a
    min: -2
    max: 2
    step: 0.5
    default: -1
    label: |
      沿$(1,0)$的特征值$a$
  - name: b
    min: -2
    max: 2
    step: 0.5
    default: 0.5
    label: |
      沿$(1,1)$的特征值$b$
:::

这是$\vb x'=A\vb x$，$A=\begin{pmatrix}a&b-a\\0&b\end{pmatrix}$，它的特征向量是$(1,0)$和$(1,1)$，特征值分别是$a$和$b$。从这两条直线上出发的四条:term[轨线]{id="math.ode.trajectory"}沿直线走，$a$或$b$小于$0$时向原点走，大于$0$时向外走；其余的轨线是两种运动的叠加。拖动滑块：$a$、$b$都小于$0$时所有轨线都进入原点，$a\ne b$时贴着衰减得慢的那个特征向量的方向进入；一正一负时，只有直线上那两条进入原点，其余的最终都沿另一条直线跑远。

## 例题

### 例 1　两个不同的特征值

解$\vb x'=\begin{pmatrix}1&2\\2&1\end{pmatrix}\vb x$，$\vb x(0)=(1,3)$。

**为什么想到这么做**：$2\times2$的矩阵，先由特征多项式求两个特征值，再求特征向量，写出:term[通解]{id="math.ode.general-solution"}，最后由初值定系数。

**推导**：$\det(A-\lambda I)=(1-\lambda)^2-4=0$，$\lambda=3$或$-1$。$\lambda=3$时$(A-3I)\vb v=\vb 0$给出$\vb v_1=(1,1)$；$\lambda=-1$时给出$\vb v_2=(1,-1)$。通解$\vb x=c_1e^{3t}(1,1)+c_2e^{-t}(1,-1)$，由$c_1+c_2=1$、$c_1-c_2=3$得$c_1=2$、$c_2=-1$，所以$\vb x=\bigl(2e^{3t}-e^{-t},\ 2e^{3t}+e^{-t}\bigr)$。

### 例 2　特征值相同、特征向量够数

解$\vb x'=A\vb x$，$A=\begin{pmatrix}1&1&1\\1&1&1\\1&1&1\end{pmatrix}$。

**为什么想到这么做**：$A$的每一列都相同，$A\vb v$的三个分量都等于$v_1+v_2+v_3$，特征向量可以直接看出来：分量之和为零的向量被$A$变成零，$(1,1,1)$被放大$3$倍。

**推导**：$A(1,1,1)=(3,3,3)$，特征值$3$；$A\vb v=\vb 0$的解是$v_1+v_2+v_3=0$的平面，取两个线性无关的$(1,-1,0)$、$(1,0,-1)$，特征值$0$出现两次。三个特征向量线性无关，:term[通解]{id="math.ode.general-solution"}是$\vb x=c_1e^{3t}(1,1,1)+c_2(1,-1,0)+c_3(1,0,-1)$。可以看出，$x_1+x_2+x_3$按$e^{3t}$增长，而两两之差$x_1-x_2$、$x_1-x_3$保持不变。

## 常见误区

- 「$\vb x=e^{\lambda t}\vb v$里的$\vb v$可以是任意向量。」只有特征向量才行；一般的初值要用几个这样的解组合出来。
- 「特征值有重复，就写不出:term[通解]{id="math.ode.general-solution"}。」只要对应的特征向量够数（例 2），照样写；不够时要用[矩阵指数](lesson:math.ode.matrix-exponential)。
- 「通解里的系数$c_i$就是$\vb x(0)$的分量。」$c_i$是$\vb x(0)$在特征向量这组基下的坐标，要解$\sum c_i\vb v_i=\vb x(0)$。
- 「有一个特征值大于$0$，所有的解就都无界。」初值在那个特征向量方向上的坐标为零时，那一项不出现，解可以趋于$\vb 0$（几何图像里落在直线上的:term[轨线]{id="math.ode.trajectory"}）。

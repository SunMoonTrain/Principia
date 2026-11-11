---
id: math.ode.matrix-exponential
title: |
  矩阵指数
goal: |
  会用矩阵指数$e^{tA}$写出线性方程组的解，并在矩阵不能对角化时用若尔当形计算它。
prerequisites: [math.ode.eigen-solutions, math.linear-algebra.jordan-form, math.calculus.power-series-calculus]
minutes: 35
summary: |
  $e^{tA}=\sum\frac{t^kA^k}{k!}$，$\vb x=e^{tA}\vb x_0$；不能对角化时用若尔当形算。
status: reviewed
---

## 这一节要回答的问题

一个方程$x'=ax$、$x(0)=x_0$的解是$x=e^{at}x_0$。方程组$\vb x'=A\vb x$能不能也写成$\vb x=e^{tA}\vb x_0$，这里的$e^{tA}$又该是什么？[用特征值解线性方程组](lesson:math.ode.eigen-solutions)要求$A$有$n$个线性无关的特征向量（eigenvector），像$\begin{pmatrix}2&1\\0&2\end{pmatrix}$这样特征向量不够的矩阵，解又是什么样子？

## 讲解

### 定义

::anchor{id="def-matrix-exponential"}
对$n\times n$的矩阵$A$（实的或复的），级数$I+A+\frac{A^2}{2!}+\frac{A^3}{3!}+\cdots=\sum_{k=0}^{\infty}\frac{A^k}{k!}$叫作$A$的:term[矩阵指数]{id="math.ode.matrix-exponential"}（matrix exponential），记作$e^A$；把$A$换成$tA$，就得到$e^{tA}=\sum_{k=0}^{\infty}\frac{t^kA^k}{k!}$。

为什么这样定义：照着$e^a=\sum\frac{a^k}{k!}$的样子，把数换成矩阵，加法和乘方都有意义。级数对每个方阵都收敛：设$A$的元素的绝对值都不超过$M$，归纳可知$A^k$的元素的绝对值都不超过$n^{k-1}M^k$，于是$e^{tA}$的每个元素由$\sum\frac{(nM|t|)^k}{k!}$控制，由比较判别法（comparison test）绝对收敛（absolutely convergent）。边界情况：$A=\operatorname{diag}(\lambda_1,\dots,\lambda_n)$时$A^k=\operatorname{diag}(\lambda_1^k,\dots,\lambda_n^k)$，所以$e^{tA}=\operatorname{diag}(e^{\lambda_1t},\dots,e^{\lambda_nt})$；$A=O$时$e^{tA}=I$。

### 性质

::anchor{id="thm-matrix-exponential"}
**:term[矩阵指数]{id="math.ode.matrix-exponential"}的性质**　(1) $\frac{\dd}{\dd t}e^{tA}=Ae^{tA}=e^{tA}A$；(2) 若$AB=BA$，则$e^{A+B}=e^Ae^B$，特别地$e^{(s+t)A}=e^{sA}e^{tA}$，并且$e^{tA}$可逆，逆矩阵是$e^{-tA}$；(3) $P$可逆时$e^{PBP^{-1}}=Pe^BP^{-1}$。

**证明思路**：(1) $e^{tA}$的每个元素都是$t$的幂级数（power series），处处收敛，可以[逐项求导](lesson:math.calculus.power-series-calculus)（term-by-term differentiation）：$\sum_{k\ge1}\frac{kt^{k-1}A^k}{k!}=A\sum_{k\ge1}\frac{t^{k-1}A^{k-1}}{(k-1)!}=Ae^{tA}$，$A$也可以提到右边。(2) 令$X(t)=e^{t(A+B)}$、$Y(t)=e^{tA}e^{tB}$；$B$和每个$A^k$可交换，所以和$e^{tA}$可交换，于是$Y'=Ae^{tA}e^{tB}+e^{tA}Be^{tB}=(A+B)Y$。$X$也满足$X'=(A+B)X$，并且$X(0)=Y(0)=I$，对每一列用[解的结构](lesson:math.ode.first-order-systems#thm-linear-system-space)里的唯一性，$X\equiv Y$，取$t=1$即得；(3) 由$(PBP^{-1})^k=PB^kP^{-1}$逐项得到。

数$a$、$b$总能交换，$e^{a+b}=e^ae^b$不需要条件；矩阵不可交换时，$e^{A+B}$一般不等于$e^Ae^B$（第 7 题）。

### 方程组的解

::anchor{id="thm-exp-solution"}
**用:term[矩阵指数]{id="math.ode.matrix-exponential"}写出解**　:term[初值问题]{id="math.ode.initial-value-problem"}（initial value problem）$\vb x'=A\vb x$、$\vb x(t_0)=\vb x_0$的唯一解是$\vb x(t)=e^{(t-t_0)A}\vb x_0$；$e^{tA}$是满足$\Phi(0)=I$的:term[基本解矩阵]{id="math.ode.fundamental-matrix"}（fundamental matrix）。

**证明思路**：由性质 (1)，$\vb x'=Ae^{(t-t_0)A}\vb x_0=A\vb x$，并且$\vb x(t_0)=I\vb x_0=\vb x_0$；由唯一性它就是那个解。$e^{tA}$的第$i$列是从标准基（standard basis）向量$\vb e_i$出发的解，它们在$t=0$处的值线性无关，所以$e^{tA}$是基本解矩阵。

这和一个方程的$x=e^{at}x_0$一字不差，只是$a$换成了矩阵：$e^{tA}$把$0$时刻的状态送到$t$时刻的状态。$A$是复矩阵时，定义和上面的性质都不变，量子力学的时间演化算符（time evolution operator）$U(t)=e^{-iHt/\hbar}$就是这样的矩阵指数，见以后的[薛定谔绘景与海森伯绘景](lesson:physics.quantum-mechanics.heisenberg-picture)。

### 计算矩阵指数

$A$能对角化（diagonalize）时，$A=PDP^{-1}$，由性质 (3)，$e^{tA}=Pe^{tD}P^{-1}$，$e^{tD}$的对角元是$e^{\lambda_it}$，这和[用特征值解线性方程组](lesson:math.ode.eigen-solutions#thm-decoupling)的解耦（decoupling）是一回事。不能对角化时，用若尔当标准形（Jordan normal form）$A=PJP^{-1}$，只要会算若尔当块（Jordan block）的指数。

::anchor{id="thm-jordan-exponential"}
**若尔当块的指数**　设$J=\lambda I+N$是$m$阶的若尔当块，$N$的主对角线上方一条斜线上是$1$、其余是$0$，满足$N^m=O$。则$e^{tJ}=e^{\lambda t}\Bigl(I+tN+\frac{t^2N^2}{2!}+\dots+\frac{t^{m-1}N^{m-1}}{(m-1)!}\Bigr)$；例如$m=2$时$e^{tJ}=e^{\lambda t}\begin{pmatrix}1&t\\0&1\end{pmatrix}$。

**证明思路**：$\lambda I$和任何矩阵都可交换，由性质 (2)，$e^{tJ}=e^{\lambda tI}e^{tN}=e^{\lambda t}e^{tN}$。$N$是幂零矩阵（nilpotent matrix），$N^m=O$，$e^{tN}$的级数到$N^{m-1}$那一项就停了，只是有限项之和。

所以不能对角化时，解里会出现$te^{\lambda t}$、$t^2e^{\lambda t}$这样的项，这正是[常系数齐次线性方程](lesson:math.ode.constant-coefficients#thm-constant-coefficients)重根时的$xe^{rx}$。特征值（eigenvalue）$\lambda$只有一个特征向量$\vb v$时，取广义特征向量（generalized eigenvector）$\vb w$满足$(A-\lambda I)\vb w=\vb v$，$e^{\lambda t}(\vb w+t\vb v)$就是另一个解（第 6 题）。

## 几何图像

:::anim{component="phase-portrait"}
system: { x: "l*x + y", y: "l*y" }
range: { x: [-3, 3], y: [-3, 3] }
dt: 0.01
initial:
  - [2.5, 0]
  - [-2.5, 0]
  - [-2.5, 2]
  - [2.5, -2]
  - [0, 2]
  - [0, -2]
  - [-1, 2]
  - [1, -2]
sliders:
  - name: l
    min: -1
    max: 1
    step: 0.25
    default: -0.5
    label: |
      特征值$\lambda$
:::

这是$\vb x'=J\vb x$，$J=\begin{pmatrix}\lambda&1\\0&\lambda\end{pmatrix}$只有一个特征向量方向$(1,0)$，解是$\vb x=e^{\lambda t}(x_0+ty_0,\ y_0)$。拖动$\lambda$：$\lambda<0$时所有:term[轨线]{id="math.ode.trajectory"}（trajectory）都进入原点，并且都贴着横轴进入，只有横轴上的两条是直线；$\lambda>0$时方向反过来，都贴着横轴离开原点。$\lambda=0$时$e^{tJ}=\begin{pmatrix}1&t\\0&1\end{pmatrix}$，横轴上的点都不动，其余的点沿水平线匀速移动，上半平面向右、下半平面向左。

## 例题

### 例 1　旋转

求$e^{tA}$，$A=\begin{pmatrix}0&-1\\1&0\end{pmatrix}$，并说明$\vb x'=A\vb x$的解在做什么。

**为什么想到这么做**：$A$的幂有规律：$A^2=-I$，于是$A^3=-A$、$A^4=I$，级数可以按偶次项、奇次项分开求和。

**推导**：偶次项是$\bigl(1-\frac{t^2}{2!}+\frac{t^4}{4!}-\cdots\bigr)I=(\cos t)I$，奇次项是$\bigl(t-\frac{t^3}{3!}+\cdots\bigr)A=(\sin t)A$，所以$e^{tA}=\begin{pmatrix}\cos t&-\sin t\\\sin t&\cos t\end{pmatrix}$。它把向量逆时针旋转$t$弧度，$\vb x'=A\vb x$的解绕原点以角速度$1$逆时针匀速转动。这和复数里的$e^{it}=\cos t+i\sin t$是同一件事：$A$作用在平面上，正像乘以$i$。

### 例 2　特征向量不够

求$e^{tA}$，$A=\begin{pmatrix}3&-1\\1&1\end{pmatrix}$，并解$\vb x'=A\vb x$、$\vb x(0)=(1,0)$。

**为什么想到这么做**：特征多项式（characteristic polynomial）$(3-\lambda)(1-\lambda)+1=(\lambda-2)^2$，特征值$2$是二重的；$A-2I=\begin{pmatrix}1&-1\\1&-1\end{pmatrix}$的秩（rank）是$1$，只有一个特征向量方向，不能对角化。把$A$拆成$2I+N$，看$N$是不是幂零的。

**推导**：$N=A-2I$，$N^2=\begin{pmatrix}1-1&-1+1\\1-1&-1+1\end{pmatrix}=O$。$2I$和$N$可交换，所以$e^{tA}=e^{2t}e^{tN}=e^{2t}(I+tN)=e^{2t}\begin{pmatrix}1+t&-t\\t&1-t\end{pmatrix}$。所求的解是$e^{tA}(1,0)=e^{2t}(1+t,\ t)$；验算：$\vb x'=e^{2t}(3+2t,\ 1+2t)$，$A\vb x=e^{2t}(3+3t-t,\ 1+t+t)$，两者相等。

## 常见误区

- 「$e^A$就是把$A$的每个元素取指数。」连对角矩阵也只是对角元取指数，对角线外的$0$仍是$0$，不是$e^0=1$；一般要按级数算，例 1 的$e^{tA}$里就出现了$\cos t$、$\sin t$。
- 「$e^{A+B}=e^Ae^B$总成立。」要$AB=BA$；不可交换时一般不成立（第 7 题）。
- 「:term[矩阵指数]{id="math.ode.matrix-exponential"}只对能对角化的矩阵有定义。」级数对任何方阵都收敛；不能对角化时用若尔当形来算（例 2）。
- 「特征值有重复，解里就一定出现$te^{\lambda t}$。」只有特征向量不够时才出现；特征向量够数时（[用特征值解线性方程组](lesson:math.ode.eigen-solutions)例 2），解里只有$e^{\lambda t}$。

---
id: math.linear-algebra.spectral-theorem
title: |
  实对称矩阵的谱定理
goal: |
  会用正交矩阵把实对称矩阵对角化，并说明属于不同特征值的特征向量互相正交。
prerequisites: [math.linear-algebra.orthogonal-matrices, math.linear-algebra.complex-eigenvalues]
minutes: 35
summary: |
  实对称矩阵的特征值都是实数，特征向量能取成正交规范基。
status: reviewed
---

## 这一节要回答的问题

[对角化](lesson:math.linear-algebra.diagonalization)说，有$n$个:term[线性无关]{id="math.linear-algebra.linearly-independent"}（linearly independent）的:term[特征向量]{id="math.linear-algebra.eigenvector"}（eigenvector）才能:term[对角化]{id="math.linear-algebra.diagonalization"}（diagonalization）；[复特征值与旋转](lesson:math.linear-algebra.complex-eigenvalues)里的:term[旋转矩阵]{id="math.linear-algebra.rotation-matrix"}（rotation matrix），连:term[实数特征值]{id="math.linear-algebra.eigenvalue"}（eigenvalue）都没有。很多来自几何、物理的矩阵是:term[对称矩阵]{id="math.linear-algebra.symmetric-matrix"}（symmetric matrix），它们总能对角化吗？特征向量之间有什么关系，能不能取一组互相垂直的特征向量当坐标轴？

## 讲解

### 对称矩阵的特征值是实数

:term[对称矩阵]{id="math.linear-algebra.symmetric-matrix"}在:term[点积]{id="math.linear-algebra.dot-product"}（dot product）里有一个好性质：$A\vb x\cdot\vb y=(A\vb x)\T\vb y=\vb x\T A\T\vb y$，所以$A\T=A$时，对所有$\vb x$、$\vb y$都有$A\vb x\cdot\vb y=\vb x\cdot A\vb y$，$A$可以从点积的一边挪到另一边。反过来，取$\vb x=\vb e_j$、$\vb y=\vb e_i$，这个等式就是$a_{ij}=a_{ji}$。下面几条结论，靠的都是这一点。

::anchor{id="thm-real-eigenvalues"}
**:term[特征值]{id="math.linear-algebra.eigenvalue"}是实数**　:term[实对称矩阵]{id="math.linear-algebra.symmetric-matrix"}的特征值都是实数，属于每个特征值的:term[特征向量]{id="math.linear-algebra.eigenvector"}都可以取成实向量。

**证明思路**：在复数范围里，设$A\vb v=\lambda\vb v$，$\vb v\ne\vb 0$，$\bar{\vb v}$是$\vb v$的各:term[分量]{id="math.linear-algebra.component"}（component）取共轭。数$\bar{\vb v}\T A\vb v$取共轭，得$\vb v\T A\bar{\vb v}$（$A$是实矩阵）；它是$1\times1$矩阵，等于自己的:term[转置]{id="math.linear-algebra.transpose"}（transpose）$\bar{\vb v}\T A\T\vb v=\bar{\vb v}\T A\vb v$，所以$\bar{\vb v}\T A\vb v$是实数。又$\bar{\vb v}\T A\vb v=\lambda\,\bar{\vb v}\T\vb v$，而$\bar{\vb v}\T\vb v=|v_1|^2+\dots+|v_n|^2>0$，所以$\lambda$是实数；这时$A-\lambda I$是不:term[可逆]{id="math.linear-algebra.invertible"}（invertible）的实矩阵，它的:term[零空间]{id="math.linear-algebra.null-space"}（null space）里有非零的实向量。

::anchor{id="thm-orthogonal-eigenvectors"}
**不同特征值的特征向量:term[正交]{id="math.linear-algebra.orthogonal"}（orthogonal）**　设$A$是实对称矩阵，$A\vb x=\lambda_1\vb x$，$A\vb y=\lambda_2\vb y$，$\lambda_1\ne\lambda_2$，则$\vb x\cdot\vb y=0$。

**证明思路**：$\lambda_1\,\vb x\cdot\vb y=A\vb x\cdot\vb y=\vb x\cdot A\vb y=\lambda_2\,\vb x\cdot\vb y$，所以$(\lambda_1-\lambda_2)\,\vb x\cdot\vb y=0$，而$\lambda_1\ne\lambda_2$。

### 谱定理

::anchor{id="thm-spectral"}
**:term[谱定理]{id="math.linear-algebra.spectral-theorem"}（spectral theorem）**　设$A$是$n$阶:term[实对称矩阵]{id="math.linear-algebra.symmetric-matrix"}。则$\R^n$有一组由$A$的:term[特征向量]{id="math.linear-algebra.eigenvector"}组成的:term[正交规范基]{id="math.linear-algebra.orthonormal-basis"}（orthonormal basis）；也就是说，有:term[正交矩阵]{id="math.linear-algebra.orthogonal-matrix"}（orthogonal matrix）$Q$和:term[实对角矩阵]{id="math.linear-algebra.diagonal-matrix"}（diagonal matrix）$D$，使$A=QDQ\T$。反过来，能这样写的矩阵一定对称。

**证明思路**：对$n$归纳，由[特征值是实数](lesson:math.linear-algebra.spectral-theorem#thm-real-eigenvalues)，取一个:term[实数特征值]{id="math.linear-algebra.eigenvalue"}$\lambda_1$和单位特征向量$\vb q_1$，令$W$是$\vb q_1$的:term[正交补]{id="math.linear-algebra.orthogonal-complement"}（orthogonal complement）。$\vb x\in W$时$A\vb x\cdot\vb q_1=\vb x\cdot A\vb q_1=\lambda_1\vb x\cdot\vb q_1=0$，所以$A$把$W$送回$W$。在$W$里取正交规范基$\vb w_2,\dots,\vb w_n$，$A$在$W$上的作用由$b_{ij}=A\vb w_j\cdot\vb w_i$给出，$b_{ij}=\vb w_j\cdot A\vb w_i=b_{ji}$，是$n-1$阶实对称矩阵，由归纳假设，$W$有一组由特征向量组成的正交规范基，添上$\vb q_1$就是$\R^n$的。反过来，$(QDQ\T)\T=QD\T Q\T=QDQ\T$。

$Q$的各列是正交规范的特征向量，$D$的对角元（diagonal entries）依次是对应的特征值；由[对角化就是找够特征向量](lesson:math.linear-algebra.diagonalization#thm-diagonalizable)，$A=QDQ^{-1}$，而$Q^{-1}=Q\T$。特征值都是实数，所以可以按大小排成$\lambda_1\le\lambda_2\le\dots\le\lambda_n$。

::anchor{id="def-spectral-decomposition"}
把$A=QDQ\T$按列乘开，得$A=\lambda_1\vb q_1\vb q_1\T+\dots+\lambda_n\vb q_n\vb q_n\T$，叫作$A$的:term[谱分解]{id="math.linear-algebra.spectral-decomposition"}（spectral decomposition）。

为什么这样定义：$\vb q_i\vb q_i\T\vb x=(\vb q_i\cdot\vb x)\vb q_i$，正是$\vb x$在$\vb q_i$上的:term[投影]{id="math.linear-algebra.projection"}（projection）。所以$A$作用在$\vb x$上，就是把$\vb x$分解到$n$个互相垂直的方向上，每个方向各乘对应的特征值，再加起来。边界情况：特征值有重复时，这个重复特征值的特征向量组成一个:term[子空间]{id="math.linear-algebra.subspace"}（subspace），里面的正交规范基可以任意取，所以$Q$不唯一，相应的投影之和却是确定的。

### 怎样求$Q$

先求:term[特征值]{id="math.linear-algebra.eigenvalue"}，对每个特征值求:term[特征空间]{id="math.linear-algebra.eigenspace"}（eigenspace）的一组:term[基]{id="math.linear-algebra.basis"}（basis）；不同特征值的特征空间已经互相:term[正交]{id="math.linear-algebra.orthogonal"}，只要在每个特征空间里做[施密特正交化](lesson:math.linear-algebra.gram-schmidt#thm-gram-schmidt)（Gram-Schmidt process），再单位化，合起来就是$Q$的各列（例 2）。

## 几何图像

:::anim{component="linear-map-2d"}
matrix: [[3, b], [b, 1]]
range: { x: [-4.5, 4.5], y: [-4.5, 4.5] }
show: [grid, circle, eigen]
sliders:
  - name: b
    min: -1.5
    max: 1.5
    step: 0.25
    default: 1
    label: |
      $b$
:::

动画作用的是:term[实对称矩阵]{id="math.linear-algebra.symmetric-matrix"}$\begin{pmatrix}3&b\\b&1\end{pmatrix}$，虚线是它的:term[特征向量]{id="math.linear-algebra.eigenvector"}所在的直线。拖动$b$，两条虚线跟着转，却总是互相垂直；$b=0$时它们就是两条坐标轴。单位圆变成以这两条虚线为轴的椭圆，两个半轴的:term[长度]{id="math.linear-algebra.length"}（length）就是两个:term[特征值]{id="math.linear-algebra.eigenvalue"}，这正是:term[谱定理]{id="math.linear-algebra.spectral-theorem"}：换到沿虚线的坐标里，矩阵只是沿两条轴各自伸缩。插值途中的矩阵$(1-s)I+sA$也是对称矩阵，特征向量和$A$的一样，所以图形一路都是轴沿虚线的椭圆。

## 例题

### 例 1　二阶矩阵

把$A=\begin{pmatrix}2&2\\2&5\end{pmatrix}$写成$A=QDQ\T$，$Q$是:term[正交矩阵]{id="math.linear-algebra.orthogonal-matrix"}。

**为什么想到这么做**：$A$对称，由:term[谱定理]{id="math.linear-algebra.spectral-theorem"}一定办得到；两个:term[特征值]{id="math.linear-algebra.eigenvalue"}不同时，:term[特征向量]{id="math.linear-algebra.eigenvector"}自动:term[正交]{id="math.linear-algebra.orthogonal"}，只要各自单位化。

**推导**：$\tr A=7$，$\det A=6$，:term[特征值]{id="math.linear-algebra.eigenvalue"}是$1$、$6$。$A-I=\begin{pmatrix}1&2\\2&4\end{pmatrix}$，特征向量取$(2,-1)$；$A-6I=\begin{pmatrix}-4&2\\2&-1\end{pmatrix}$，特征向量取$(1,2)$，两者:term[点积]{id="math.linear-algebra.dot-product"}是$0$。$Q=\frac1{\sqrt5}\begin{pmatrix}2&1\\-1&2\end{pmatrix}$，$D=\begin{pmatrix}1&0\\0&6\end{pmatrix}$，$A=QDQ\T$；$\det Q=1$，$Q$是:term[旋转矩阵]{id="math.linear-algebra.rotation-matrix"}，转到沿特征向量的坐标里，$A$只是把两个坐标分别乘以$1$和$6$。

### 例 2　有重复特征值的三阶矩阵

[特征值与特征向量](lesson:math.linear-algebra.eigenvalues)例 2 的$A=\begin{pmatrix}2&1&1\\1&2&1\\1&1&2\end{pmatrix}$有:term[特征值]{id="math.linear-algebra.eigenvalue"}$4$、$1$、$1$。求:term[正交矩阵]{id="math.linear-algebra.orthogonal-matrix"}$Q$，使$A=QDQ\T$。

**为什么想到这么做**：属于$1$的:term[特征空间]{id="math.linear-algebra.eigenspace"}是二维的，随手取的两个:term[特征向量]{id="math.linear-algebra.eigenvector"}一般不:term[正交]{id="math.linear-algebra.orthogonal"}，要在里面做:term[施密特正交化]{id="math.linear-algebra.gram-schmidt"}。

**推导**：属于$4$的特征向量是$(1,1,1)$。$A-I$的每一行都是$(1,1,1)$，属于$1$的特征空间是平面$x+y+z=0$，取:term[基]{id="math.linear-algebra.basis"}$(1,-1,0)$、$(1,0,-1)$，它们的:term[点积]{id="math.linear-algebra.dot-product"}是$1$，不正交。施密特正交化：$(1,0,-1)-\frac12(1,-1,0)=\bigl(\frac12,\frac12,-1\bigr)$，取$(1,1,-2)$。三个向量两两正交，单位化后作$Q$的各列：$Q=\begin{pmatrix}\frac1{\sqrt3}&\frac1{\sqrt2}&\frac1{\sqrt6}\\\frac1{\sqrt3}&-\frac1{\sqrt2}&\frac1{\sqrt6}\\\frac1{\sqrt3}&0&-\frac2{\sqrt6}\end{pmatrix}$，$D=\begin{pmatrix}4&0&0\\0&1&0\\0&0&1\end{pmatrix}$。

## 常见误区

- 「:term[对称矩阵]{id="math.linear-algebra.symmetric-matrix"}的任意两个:term[特征向量]{id="math.linear-algebra.eigenvector"}都:term[正交]{id="math.linear-algebra.orthogonal"}。」只有属于不同:term[特征值]{id="math.linear-algebra.eigenvalue"}的才一定正交；例 2 里属于$1$的$(1,-1,0)$、$(1,0,-1)$就不正交，要另取。
- 「能:term[对角化]{id="math.linear-algebra.diagonalization"}的矩阵都能用:term[正交矩阵]{id="math.linear-algebra.orthogonal-matrix"}对角化。」能用正交矩阵对角化的只有对称矩阵：$\begin{pmatrix}1&1\\0&2\end{pmatrix}$能对角化，特征向量$(1,0)$、$(1,1)$却不正交。
- 「只要矩阵对称，特征值就是实数，复矩阵也一样。」证明用到了$A$是实矩阵：$\begin{pmatrix}0&i\\i&0\end{pmatrix}$对称，特征值却是$\pm i$。复矩阵要把条件换成「各元素取共轭再:term[转置]{id="math.linear-algebra.transpose"}，等于自己」，见[复内积空间、厄米矩阵与酉矩阵](lesson:math.linear-algebra.hermitian-unitary)。
- 「:term[谱定理]{id="math.linear-algebra.spectral-theorem"}里的$Q$是唯一的。」各列可以换号、换次序，重复特征值的:term[特征空间]{id="math.linear-algebra.eigenspace"}里还能任意转；唯一的是:term[谱分解]{id="math.linear-algebra.spectral-decomposition"}里每个特征值对应的那部分。

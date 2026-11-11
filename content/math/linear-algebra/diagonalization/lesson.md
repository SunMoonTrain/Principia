---
id: math.linear-algebra.diagonalization
title: |
  对角化
goal: |
  会判断矩阵能否对角化，并求出可逆矩阵$P$和对角矩阵$D$使$A=PDP^{-1}$。
prerequisites: [math.linear-algebra.eigenvalues, math.linear-algebra.similarity]
minutes: 35
summary: |
  有$n$个线性无关的特征向量就能对角化：$A=PDP^{-1}$。
status: reviewed
---

## 这一节要回答的问题

[线性算子的矩阵与相似](lesson:math.linear-algebra.similarity)里，$A=\begin{pmatrix}3&-1\\2&0\end{pmatrix}$换到:term[基]{id="math.linear-algebra.basis"}（basis）$(1,1)$、$(1,2)$下，变成了:term[对角矩阵]{id="math.linear-algebra.diagonal-matrix"}（diagonal matrix）$\begin{pmatrix}2&0\\0&1\end{pmatrix}$。哪些矩阵能这样换成对角矩阵，那组基又怎样找？换成对角矩阵以后，算$A^k$、解方程组都会简单得多。

## 讲解

### 对角化与特征向量

::anchor{id="def-diagonalizable"}
如果$n$阶:term[方阵]{id="math.linear-algebra.square-matrix"}（square matrix）$A$与一个:term[对角矩阵]{id="math.linear-algebra.diagonal-matrix"}$D$:term[相似]{id="math.linear-algebra.similar"}（similar），即有:term[可逆]{id="math.linear-algebra.invertible"}（invertible）矩阵$P$使$A=PDP^{-1}$，就说$A$可以:term[对角化]{id="math.linear-algebra.diagonalization"}（diagonalize），找出这样的$P$和$D$叫作把$A$对角化。

为什么这样定义：$A=PDP^{-1}$说的是，在以$P$的各列为:term[基]{id="math.linear-algebra.basis"}的坐标里，$\vb x\mapsto A\vb x$只是把每个坐标各乘一个数，各坐标互不牵连。边界情况：对角矩阵本身取$P=I$；$\begin{pmatrix}2&1\\0&2\end{pmatrix}$不能对角化（见下面的定理），逆时针转$90^\circ$的:term[旋转矩阵]{id="math.linear-algebra.rotation-matrix"}（rotation matrix）也不能，因为没有实数的:term[特征值]{id="math.linear-algebra.eigenvalue"}（eigenvalue）。

::anchor{id="thm-diagonalizable"}
**对角化就是找够:term[特征向量]{id="math.linear-algebra.eigenvector"}（eigenvector）**　$n$阶方阵$A$可以对角化，当且仅当$A$有$n$个:term[线性无关]{id="math.linear-algebra.linearly-independent"}（linearly independent）的特征向量。这时$P$的各列取这$n$个特征向量，$D$的主对角元（diagonal entries）依次是对应的特征值。

**证明思路**：$A=PDP^{-1}$等价于$AP=PD$。设$P$的各列是$\vb p_1,\dots,\vb p_n$、$D$的主对角元是$d_1,\dots,d_n$，按列比较，$AP=PD$就是$A\vb p_j=d_j\vb p_j$，即每一列都是特征向量。$P$可逆，当且仅当这$n$列线性无关。

### 不同的特征值，特征向量线性无关

::anchor{id="thm-distinct-independent"}
**不同:term[特征值]{id="math.linear-algebra.eigenvalue"}的:term[特征向量]{id="math.linear-algebra.eigenvector"}:term[线性无关]{id="math.linear-algebra.linearly-independent"}**　属于不同特征值的特征向量线性无关。所以$n$阶:term[方阵]{id="math.linear-algebra.square-matrix"}有$n$个互不相同的实数特征值时，一定可以:term[对角化]{id="math.linear-algebra.diagonalization"}。

**证明思路**：设$\vb v_1,\dots,\vb v_k$分别属于不同的特征值$\lambda_1,\dots,\lambda_k$，并且已经线性无关；若再加一个属于$\lambda_{k+1}$的$\vb v_{k+1}=\sum_{i\le k}c_i\vb v_i$，两边作用$A-\lambda_{k+1}I$，得$\vb 0=\sum_{i\le k}c_i(\lambda_i-\lambda_{k+1})\vb v_i$。由线性无关，$c_i(\lambda_i-\lambda_{k+1})=0$，而$\lambda_i\ne\lambda_{k+1}$，所以各$c_i=0$，$\vb v_{k+1}=\vb 0$，这不可能。从一个向量开始，一个一个加上去，就得到结论。

同样的论证说明，把各个:term[特征空间]{id="math.linear-algebra.eigenspace"}（eigenspace）的:term[基]{id="math.linear-algebra.basis"}合在一起，仍然线性无关。所以特征值有重复时，只要每个特征空间里的特征向量够数，照样能对角化（例 2）。

### 重数决定能不能对角化

先看:term[相似]{id="math.linear-algebra.similar"}的矩阵有什么相同。$\det(P^{-1}AP-\lambda I)=\det\bigl(P^{-1}(A-\lambda I)P\bigr)$，由[乘积的行列式](lesson:math.linear-algebra.determinant-properties#thm-det-product)，它等于$\det(A-\lambda I)$。

::anchor{id="thm-similar-charpoly"}
**相似的矩阵:term[特征多项式]{id="math.linear-algebra.characteristic-polynomial"}（characteristic polynomial）相同**　相似的矩阵有相同的特征多项式，因而有相同的:term[特征值]{id="math.linear-algebra.eigenvalue"}、:term[迹]{id="math.linear-algebra.trace"}（trace）和:term[行列式]{id="math.linear-algebra.determinant"}（determinant）。

所以一个:term[线性算子]{id="math.linear-algebra.linear-operator"}（linear operator）在不同:term[基]{id="math.linear-algebra.basis"}下的矩阵，特征多项式都一样，可以说它是这个算子的特征多项式。用它可以比较两种重数。

::anchor{id="thm-multiplicity"}
**:term[几何重数]{id="math.linear-algebra.geometric-multiplicity"}（geometric multiplicity）不超过:term[代数重数]{id="math.linear-algebra.algebraic-multiplicity"}（algebraic multiplicity）**　每个特征值的几何重数都不超过它的代数重数。$A$可以:term[对角化]{id="math.linear-algebra.diagonalization"}，当且仅当特征多项式的根都是实数，并且每个特征值的几何重数等于代数重数。

**证明思路**：设特征值$\lambda_0$的几何重数是$g$，取:term[特征空间]{id="math.linear-algebra.eigenspace"}的一组基，再补成$\R^n$的一组基（[线性算子的矩阵与相似](lesson:math.linear-algebra.similarity)第 6 题）。在这组基下，矩阵的前$g$列只有主对角元$\lambda_0$不为零，沿第一列[展开](lesson:math.linear-algebra.determinant-properties#thm-cofactor-expansion)$g$次，特征多项式含因子$(\lambda_0-\lambda)^g$，所以代数重数至少是$g$。至于判别法：能对角化要$n$个:term[线性无关]{id="math.linear-algebra.linearly-independent"}的:term[特征向量]{id="math.linear-algebra.eigenvector"}，各特征空间的:term[维数]{id="math.linear-algebra.dimension"}（dimension）加起来最多是各代数重数之和，而这个和不超过$n$，只有每一处都取等号、所有根都是实数时才够数。

## 几何图像

:::anim{component="linear-map-2d"}
steps:
  - matrix: [[2, -1], [-1, 1]]
    label: |
      先作用$P^{-1}$，两条特征向量的方向转到坐标轴上
  - matrix: [[2, 0], [0, 1]]
    label: |
      再作用$D$，沿两条坐标轴各自伸缩
  - matrix: [[1, 1], [1, 2]]
    label: |
      最后作用$P$，转回原来的方向
range: { x: [-3, 5], y: [-2.5, 3.5] }
show: [grid, basis]
vectors:
  - x: 1
    y: 1
    label: |
      $\vb p_1$
  - x: 1
    y: 2
    label: |
      $\vb p_2$
:::

动画把$A=\begin{pmatrix}3&-1\\2&0\end{pmatrix}=PDP^{-1}$拆成三步，$P$的两列是:term[特征向量]{id="math.linear-algebra.eigenvector"}$\vb p_1=(1,1)$、$\vb p_2=(1,2)$，$D=\begin{pmatrix}2&0\\0&1\end{pmatrix}$。第一步把$\vb p_1$、$\vb p_2$分别送到$\vb e_1$、$\vb e_2$；第二步只沿坐标轴伸缩，$\vb e_1$变成原来的$2$倍；第三步再送回去，$\vb p_1$最后变成$2\vb p_1$，$\vb p_2$回到原处。三步合起来，正是[线性算子的矩阵与相似](lesson:math.linear-algebra.similarity)的动画里那个$A$。

## 例题

### 例 1　对角化一个二阶矩阵

把$A=\begin{pmatrix}4&1\\2&3\end{pmatrix}$:term[对角化]{id="math.linear-algebra.diagonalization"}。

**为什么想到这么做**：先求:term[特征值]{id="math.linear-algebra.eigenvalue"}；两个特征值不同，由定理一定能对角化，再各取一个:term[特征向量]{id="math.linear-algebra.eigenvector"}排成$P$。

**推导**：$\tr A=7$，$\det A=10$，:term[特征多项式]{id="math.linear-algebra.characteristic-polynomial"}$\lambda^2-7\lambda+10=(\lambda-2)(\lambda-5)$。$\lambda=2$时$A-2I=\begin{pmatrix}2&1\\2&1\end{pmatrix}$，取$(1,-2)$；$\lambda=5$时$A-5I=\begin{pmatrix}-1&1\\2&-2\end{pmatrix}$，取$(1,1)$。所以$P=\begin{pmatrix}1&1\\-2&1\end{pmatrix}$，$D=\begin{pmatrix}2&0\\0&5\end{pmatrix}$，$A=PDP^{-1}$。验算$AP=PD$：$A(1,-2)=(2,-4)$，$A(1,1)=(5,5)$。

### 例 2　特征值相同，一个能对角化，一个不能

判断$A=\begin{pmatrix}1&1&1\\0&2&1\\0&0&1\end{pmatrix}$和$B=\begin{pmatrix}1&1&0\\0&1&1\\0&0&2\end{pmatrix}$能否:term[对角化]{id="math.linear-algebra.diagonalization"}。

**为什么想到这么做**：两个都是:term[上三角矩阵]{id="math.linear-algebra.upper-triangular-matrix"}（upper triangular matrix），:term[特征值]{id="math.linear-algebra.eigenvalue"}一眼读出：都是$1$、$1$、$2$。$2$的:term[代数重数]{id="math.linear-algebra.algebraic-multiplicity"}是$1$，:term[几何重数]{id="math.linear-algebra.geometric-multiplicity"}自然也是$1$；关键是二重的特征值$1$的:term[特征空间]{id="math.linear-algebra.eigenspace"}是几维。

**推导**：$A-I=\begin{pmatrix}0&1&1\\0&1&1\\0&0&0\end{pmatrix}$的:term[秩]{id="math.linear-algebra.rank"}（rank）是$1$，特征空间是$3-1=2$维，等于代数重数，所以$A$能对角化：$1$的:term[特征向量]{id="math.linear-algebra.eigenvector"}取$(1,0,0)$、$(0,1,-1)$，$2$的取$(1,1,0)$。$B-I=\begin{pmatrix}0&1&0\\0&0&1\\0&0&1\end{pmatrix}$的秩是$2$，特征空间只有$1$维，小于代数重数$2$，所以$B$不能对角化。

## 常见误区

- 「有重复的:term[特征值]{id="math.linear-algebra.eigenvalue"}就不能:term[对角化]{id="math.linear-algebra.diagonalization"}。」:term[单位矩阵]{id="math.linear-algebra.identity-matrix"}（identity matrix）的特征值全是$1$，本身就是:term[对角矩阵]{id="math.linear-algebra.diagonal-matrix"}；例 2 的$A$也能对角化。要看的是每个:term[特征空间]{id="math.linear-algebra.eigenspace"}的:term[维数]{id="math.linear-algebra.dimension"}够不够。
- 「:term[可逆]{id="math.linear-algebra.invertible"}的矩阵都能对角化。」$\begin{pmatrix}1&1\\0&1\end{pmatrix}$可逆，却只有一个方向的:term[特征向量]{id="math.linear-algebra.eigenvector"}；反过来，$\begin{pmatrix}1&0\\0&0\end{pmatrix}$不可逆，却已经是对角矩阵。
- 「$P$的各列可以随便排，$D$不用跟着变。」$P$的第$j$列必须是属于$D$的第$j$个主对角元的特征向量，两边要按同一个顺序排。

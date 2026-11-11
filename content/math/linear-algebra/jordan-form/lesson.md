---
id: math.linear-algebra.jordan-form
title: |
  若尔当标准形
goal: |
  会求不能对角化的矩阵的广义特征向量和若尔当标准形。
prerequisites: [math.linear-algebra.diagonalization]
minutes: 35
summary: |
  特征向量不够时用广义特征向量补齐，矩阵化成若尔当块。
status: reviewed
---

## 这一节要回答的问题

[对角化](lesson:math.linear-algebra.diagonalization)里看到，$\begin{pmatrix}2&1\\0&2\end{pmatrix}$只有一个方向的:term[特征向量]{id="math.linear-algebra.eigenvector"}（eigenvector），不能化成:term[对角矩阵]{id="math.linear-algebra.diagonal-matrix"}（diagonal matrix）。这样的矩阵，换一组:term[基]{id="math.linear-algebra.basis"}（basis）最多能化得多简单？特征向量不够时，拿什么向量来补？

## 讲解

### 若尔当块

::anchor{id="def-jordan-block"}
主对角线（main diagonal）上都是$\lambda$、紧挨着主对角线上方的那条斜线上都是$1$、其余都是$0$的$m$阶:term[方阵]{id="math.linear-algebra.square-matrix"}（square matrix），叫作:term[若尔当块]{id="math.linear-algebra.jordan-block"}（Jordan block），记作$J_m(\lambda)$。例如$J_3(\lambda)=\begin{pmatrix}\lambda&1&0\\0&\lambda&1\\0&0&\lambda\end{pmatrix}$；$J_1(\lambda)$就是一个数$\lambda$。

为什么这样定义：$J_m(\lambda)=\lambda I+N$，$N$只在主对角线上方那条斜线上是$1$，它把:term[标准基向量]{id="math.linear-algebra.standard-basis-vector"}（standard basis vectors）依次往前挪：$N\vb e_1=\vb 0$，$N\vb e_k=\vb e_{k-1}$。所以$J_m(\lambda)$只有一个:term[特征值]{id="math.linear-algebra.eigenvalue"}（eigenvalue）$\lambda$，:term[代数重数]{id="math.linear-algebra.algebraic-multiplicity"}（algebraic multiplicity）是$m$，:term[特征空间]{id="math.linear-algebra.eigenspace"}（eigenspace）却只有$N$的:term[零空间]{id="math.linear-algebra.null-space"}（null space）那一维；它离:term[对角矩阵]{id="math.linear-algebra.diagonal-matrix"}只差那条斜线上的$1$。边界情况：$m=1$时没有那条斜线，若尔当块就是对角的。

::anchor{id="def-nilpotent"}
如果某个正整数$k$使$N^k=O$，就说方阵$N$是:term[幂零矩阵]{id="math.linear-algebra.nilpotent-matrix"}（nilpotent matrix）。

为什么这样定义：上面的$N$每作用一次，就把基向量往前挪一格，挪$m$次全变成$\vb 0$，所以$N^m=O$，它是幂零矩阵。幂零矩阵的特征值只能是$0$：$N\vb v=\lambda\vb v$时$\vb 0=N^k\vb v=\lambda^k\vb v$。反过来也对：特征值都是$0$的矩阵一定是幂零的，不过要用到下面的:term[若尔当标准形]{id="math.linear-algebra.jordan-canonical-form"}（Jordan canonical form）才好证明。只看样子不行：$\begin{pmatrix}0&1\\0&0\end{pmatrix}$幂零，$\begin{pmatrix}0&1\\1&0\end{pmatrix}$的平方却是$I$，它的特征值是$\pm1$。

### 广义特征向量与若尔当链

例如$A=\begin{pmatrix}1&1\\-1&3\end{pmatrix}$，:term[特征多项式]{id="math.linear-algebra.characteristic-polynomial"}（characteristic polynomial）是$(\lambda-2)^2$，$A-2I=\begin{pmatrix}-1&1\\-1&1\end{pmatrix}$的:term[秩]{id="math.linear-algebra.rank"}（rank）是$1$，:term[特征向量]{id="math.linear-algebra.eigenvector"}只有$\vb v=(1,1)$的倍数。再解$(A-2I)\vb w=\vb v$，得$\vb w=(0,1)$。于是$A\vb v=2\vb v$，$A\vb w=2\vb w+\vb v$，在:term[基]{id="math.linear-algebra.basis"}$\vb v$、$\vb w$下，$A$的矩阵正是$J_2(2)$。

::anchor{id="def-generalized-eigenvector"}
设$\lambda$是:term[方阵]{id="math.linear-algebra.square-matrix"}$A$的:term[特征值]{id="math.linear-algebra.eigenvalue"}。若非零向量$\vb w$满足$(A-\lambda I)^k\vb w=\vb 0$（$k$是某个正整数），就说$\vb w$是属于$\lambda$的:term[广义特征向量]{id="math.linear-algebra.generalized-eigenvector"}（generalized eigenvector）。若$(A-\lambda I)^m\vb w=\vb 0$而$(A-\lambda I)^{m-1}\vb w\ne\vb 0$，向量$\vb v_k=(A-\lambda I)^{m-k}\vb w$（$k=1,\dots,m$）叫作从$\vb w$出发的若尔当链（Jordan chain）。

为什么这样定义：$k=1$时就是特征向量；特征向量不够时，$(A-\lambda I)\vb w$不为零、但再乘一次就是零的$\vb w$最接近特征向量。链的第一个$\vb v_1$是特征向量，往后每一个被$A-\lambda I$送到前一个，即$A\vb v_k=\lambda\vb v_k+\vb v_{k-1}$，这正是$J_m(\lambda)$的各列说的事。

::anchor{id="thm-chain"}
**一条链给出一个:term[若尔当块]{id="math.linear-algebra.jordan-block"}**　若尔当链$\vb v_1,\dots,\vb v_m$:term[线性无关]{id="math.linear-algebra.linearly-independent"}（linearly independent）；在它们:term[生成]{id="math.linear-algebra.span"}（span）的:term[子空间]{id="math.linear-algebra.subspace"}（subspace）里，$A$在基$\vb v_1,\dots,\vb v_m$下的矩阵是$J_m(\lambda)$。

**证明思路**：设$\sum c_k\vb v_k=\vb 0$。作用$(A-\lambda I)^{m-1}$，除$\vb v_m=\vb w$以外的项都变成$\vb 0$，剩下$c_m\vb v_1=\vb 0$，所以$c_m=0$；再作用$(A-\lambda I)^{m-2}$得$c_{m-1}=0$，依次下去全为零。矩阵：$A\vb v_1=\lambda\vb v_1$，$A\vb v_k=\vb v_{k-1}+\lambda\vb v_k$，坐标正是$J_m(\lambda)$的第$k$列。

### 若尔当标准形

::anchor{id="thm-jordan"}
**:term[若尔当标准形]{id="math.linear-algebra.jordan-canonical-form"}**　每个:term[方阵]{id="math.linear-algebra.square-matrix"}$A$都和一个分块对角矩阵（block diagonal matrix）$J=\begin{pmatrix}J_{m_1}(\lambda_1)&&\\&\ddots&\\&&J_{m_s}(\lambda_s)\end{pmatrix}$:term[相似]{id="math.linear-algebra.similar"}（similar），即$A=PJP^{-1}$，空白处都是$0$；不计各块的次序，$J$是唯一的，叫作$A$的若尔当标准形，也叫若尔当形。:term[特征值]{id="math.linear-algebra.eigenvalue"}都是实数时，$P$可以取实矩阵；有复数特征值时，$P$、$J$是复矩阵。

**证明思路**：一般情形的证明较长，这里不证；做法是给每个特征值找出若干条若尔当链，把它们排成$P$的各列。从结果可以读出：属于$\lambda$的块的个数是它的:term[几何重数]{id="math.linear-algebra.geometric-multiplicity"}（geometric multiplicity），这些块的阶数之和是它的:term[代数重数]{id="math.linear-algebra.algebraic-multiplicity"}；所以全是一阶块，正好就是能:term[对角化]{id="math.linear-algebra.diagonalization"}（diagonalize）。块的大小由:term[秩]{id="math.linear-algebra.rank"}决定：阶数至少为$k$的块的个数，等于$\rank(A-\lambda I)^{k-1}-\rank(A-\lambda I)^k$。这是因为$(A-\lambda I)^k$与$(J-\lambda I)^k$相似、秩相同：$J_m(\lambda)-\lambda I$的$k$次方秩是$\max(m-k,0)$，每多乘一次，阶数不小于$k$的块各让秩少$1$；属于别的特征值的块减去$\lambda I$后:term[可逆]{id="math.linear-algebra.invertible"}（invertible），秩不变。

二阶实矩阵只有一个特征值$\lambda$（二重根）、又不能对角化时，可以直接验证：取一个不是:term[特征向量]{id="math.linear-algebra.eigenvector"}的$\vb w$，$\vb v=(A-\lambda I)\vb w\ne\vb 0$，可以验证$(A-\lambda I)^2=O$（第 6 题），于是$\vb v$是特征向量，$\vb v$、$\vb w$就是一条链，$A$相似于$J_2(\lambda)$。

## 几何图像

:::anim{component="linear-map-2d"}
matrix: [[1, 1], [0, q]]
range: { x: [-2.5, 2.5], y: [-2, 2] }
show: [grid, basis, eigen]
sliders:
  - name: q
    min: 0.5
    max: 1.5
    step: 0.125
    default: 1.25
    label: |
      $\varepsilon$
:::

动画作用的是$\begin{pmatrix}1&1\\0&\varepsilon\end{pmatrix}$，虚线是:term[特征向量]{id="math.linear-algebra.eigenvector"}所在的直线。$\varepsilon\ne1$时两个:term[特征值]{id="math.linear-algebra.eigenvalue"}$1$、$\varepsilon$不同，有两条虚线，能:term[对角化]{id="math.linear-algebra.diagonalization"}；把$\varepsilon$往$1$拖，第二条虚线$(1,\varepsilon-1)$越来越贴近横轴，$\varepsilon=1$时两条并成一条，矩阵就是:term[若尔当块]{id="math.linear-algebra.jordan-block"}$J_2(1)$，只剩一个方向的特征向量，平面被:term[剪切]{id="math.linear-algebra.shear"}（shear）。

## 例题

### 例 1　二阶：找广义特征向量

求$A=\begin{pmatrix}3&-1\\1&1\end{pmatrix}$的:term[若尔当标准形]{id="math.linear-algebra.jordan-canonical-form"}$J$和:term[可逆]{id="math.linear-algebra.invertible"}矩阵$P$，使$A=PJP^{-1}$。

**为什么想到这么做**：先看:term[特征值]{id="math.linear-algebra.eigenvalue"}和:term[特征空间]{id="math.linear-algebra.eigenspace"}的:term[维数]{id="math.linear-algebra.dimension"}（dimension）；只有一个:term[特征向量]{id="math.linear-algebra.eigenvector"}方向时，解$(A-\lambda I)\vb w=\vb v$找:term[广义特征向量]{id="math.linear-algebra.generalized-eigenvector"}，$\vb v$、$\vb w$排成$P$。

**推导**：$\tr A=4$，$\det A=4$，:term[特征多项式]{id="math.linear-algebra.characteristic-polynomial"}是$(\lambda-2)^2$；$A-2I=\begin{pmatrix}1&-1\\1&-1\end{pmatrix}$的:term[秩]{id="math.linear-algebra.rank"}是$1$，特征向量$\vb v=(1,1)$。解$(A-2I)\vb w=\vb v$，即$w_1-w_2=1$，取$\vb w=(1,0)$。所以$P=\begin{pmatrix}1&1\\1&0\end{pmatrix}$，$J=J_2(2)=\begin{pmatrix}2&1\\0&2\end{pmatrix}$。验算：$A\vb w=(3,1)=2\vb w+\vb v$。

### 例 2　三阶：三个向量组成的链

求$A=\begin{pmatrix}2&1&1\\0&2&1\\0&0&2\end{pmatrix}$的:term[若尔当标准形]{id="math.linear-algebra.jordan-canonical-form"}，并找出一条若尔当链。

**为什么想到这么做**：$A$是:term[上三角矩阵]{id="math.linear-algebra.upper-triangular-matrix"}（upper triangular matrix），:term[特征值]{id="math.linear-algebra.eigenvalue"}只有$2$；用:term[秩]{id="math.linear-algebra.rank"}判断块的大小，再从链的末端$\vb w$出发，反复乘$A-2I$。

**推导**：$A-2I=\begin{pmatrix}0&1&1\\0&0&1\\0&0&0\end{pmatrix}$的秩是$2$，:term[几何重数]{id="math.linear-algebra.geometric-multiplicity"}是$3-2=1$，只有一个块，所以$J=J_3(2)$。取$\vb w=\vb e_3$，则$(A-2I)\vb e_3=(1,1,0)$，$(A-2I)(1,1,0)=(1,0,0)$，再乘一次是$\vb 0$。链是$\vb v_1=(1,0,0)$、$\vb v_2=(1,1,0)$、$\vb v_3=(0,0,1)$，以它们为各列的$P$满足$P^{-1}AP=J_3(2)$。

## 常见误区

- 「同一个:term[特征值]{id="math.linear-algebra.eigenvalue"}在:term[若尔当标准形]{id="math.linear-algebra.jordan-canonical-form"}里只有一个块。」$2I$的若尔当形是两个$J_1(2)$；块的个数是:term[几何重数]{id="math.linear-algebra.geometric-multiplicity"}。
- 「:term[广义特征向量]{id="math.linear-algebra.generalized-eigenvector"}也都是:term[特征向量]{id="math.linear-algebra.eigenvector"}。」例 1 的$\vb w=(1,0)$满足$(A-2I)^2\vb w=\vb 0$，可$(A-2I)\vb w=\vb v\ne\vb 0$，它不是特征向量。
- 「若尔当标准形唯一，$P$也唯一。」$J$在不计次序时唯一，$P$不唯一：例 1 里$\vb w$换成$(1,0)+c(1,1)$也行。

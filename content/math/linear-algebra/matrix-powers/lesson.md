---
id: math.linear-algebra.matrix-powers
title: |
  矩阵的幂与线性递推
goal: |
  会用对角化计算矩阵的高次幂，并用它解斐波那契数列这样的线性递推。
prerequisites: [math.linear-algebra.diagonalization]
minutes: 30
summary: |
  $A=PDP^{-1}$时$A^k=PD^kP^{-1}$；线性递推的通项由特征值的幂组成。
status: reviewed
---

## 这一节要回答的问题

[矩阵与矩阵乘法](lesson:math.linear-algebra.matrices)第 8 题里，城区、郊区的人口每年按矩阵$M$变一次，$k$年后是$M^k\vb x$。几十年以后，人口会怎样分布？斐波那契数列（Fibonacci sequence）$0,1,1,2,3,5,8,\dots$每一项是前两项之和，第$100$项能不能不一项一项地算出来？两个问题都归结为算矩阵的高次幂。

## 讲解

### 用对角化算幂

::anchor{id="thm-power"}
**:term[对角化]{id="math.linear-algebra.diagonalization"}（diagonalization）以后算幂**　若$A=PDP^{-1}$，$D$是主对角元（diagonal entries）为$\lambda_1,\dots,\lambda_n$的:term[对角矩阵]{id="math.linear-algebra.diagonal-matrix"}（diagonal matrix），则$A^k=PD^kP^{-1}$，$D^k$的主对角元是$\lambda_1^k,\dots,\lambda_n^k$。若$\vb x=c_1\vb v_1+\dots+c_n\vb v_n$，$\vb v_i$是$P$的各列，则$A^k\vb x=c_1\lambda_1^k\vb v_1+\dots+c_n\lambda_n^k\vb v_n$。

**证明思路**：$A^2=PDP^{-1}PDP^{-1}=PD^2P^{-1}$，中间的$P^{-1}P$消掉，$k$次同理；对角矩阵乘方，就是各对角元乘方。第二个式子：$A\vb v_i=\lambda_i\vb v_i$，作用$k$次得$\lambda_i^k\vb v_i$，再由线性相加。

所以把$\vb x$按:term[特征向量]{id="math.linear-algebra.eigenvector"}（eigenvector）分解，每个方向各自按$\lambda_i^k$变，互不牵连。这要求$A$能对角化；不能对角化时，幂里会多出$k\lambda^{k-1}$这样的项，见[若尔当标准形](lesson:math.linear-algebra.jordan-form)第 7 题。

### 长期的样子

$k$很大时，$\lambda_i^k$里模最大的那一项压倒其余各项。

::anchor{id="thm-dominant"}
**模最大的:term[特征值]{id="math.linear-algebra.eigenvalue"}（eigenvalue）决定长期的方向**　设$A$可以:term[对角化]{id="math.linear-algebra.diagonalization"}，特征值$\lambda_1$的模比其余特征值的模都大，这样的$\lambda_1$叫作主导特征值（dominant eigenvalue）。若$\vb x=c_1\vb v_1+\dots+c_n\vb v_n$且$c_1\ne0$，则$k\to\infty$时，$\frac{A^k\vb x}{\lambda_1^k}\to c_1\vb v_1$，$A^k\vb x$的方向越来越接近$\vb v_1$。

**证明思路**：$\frac{A^k\vb x}{\lambda_1^k}=c_1\vb v_1+\sum_{i\ge2}c_i\bigl(\frac{\lambda_i}{\lambda_1}\bigr)^k\vb v_i$，各个$\bigl|\frac{\lambda_i}{\lambda_1}\bigr|<1$，它们的$k$次方都趋于$0$。

人口的例子：$M=\begin{pmatrix}0.9&0.2\\0.1&0.8\end{pmatrix}$的特征值是$1$和$0.7$，:term[特征向量]{id="math.linear-algebra.eigenvector"}是$\vb v_1=(2,1)$和$\vb v_2=(1,-1)$。$\vb x=c_1\vb v_1+c_2\vb v_2$时$M^k\vb x=c_1\vb v_1+0.7^kc_2\vb v_2$，第二项一年年变小；比较两个:term[分量]{id="math.linear-algebra.component"}（component）之和，$c_1=\frac{x_1+x_2}3$。所以几十年后，人口趋于$(x_1+x_2)\bigl(\frac23,\frac13\bigr)$：三分之二住在城区，和一开始怎样分布无关。

### 线性递推

斐波那契数列$F_0=0$、$F_1=1$、$F_{k+2}=F_{k+1}+F_k$。把相邻两项排成向量$\vb u_k=(F_{k+1},F_k)$，就有$\vb u_{k+1}=A\vb u_k$，$A=\begin{pmatrix}1&1\\1&0\end{pmatrix}$，于是$\vb u_k=A^k\vb u_0$。

::anchor{id="def-linear-recurrence"}
数列$a_0,a_1,\dots$若对每个$k$满足$a_{k+2}=pa_{k+1}+qa_k$（$p$、$q$是常数，$q\ne0$），就说它满足一个二阶的线性递推（linear recurrence）；$a_0$、$a_1$给定后，整个数列就定了。

为什么这样定义：后一项是前几项的固定的:term[线性组合]{id="math.linear-algebra.linear-combination"}（linear combination），排成向量$(a_{k+1},a_k)$，每走一步就是乘同一个矩阵$\begin{pmatrix}p&q\\1&0\end{pmatrix}$，可以用矩阵的幂来算。它的:term[特征多项式]{id="math.linear-algebra.characteristic-polynomial"}（characteristic polynomial）是$\lambda^2-p\lambda-q$，即方程$\lambda^2=p\lambda+q$。边界情况：$q=0$时$a_{k+2}=pa_{k+1}$，只是公比为$p$的等比数列。

::anchor{id="thm-recurrence"}
**线性递推的通项**　若$\lambda^2=p\lambda+q$有两个不同的根$r_1$、$r_2$，则满足$a_{k+2}=pa_{k+1}+qa_k$的数列都是$a_k=\alpha r_1^k+\beta r_2^k$，$\alpha$、$\beta$由$a_0$、$a_1$决定。

**证明思路**：矩阵$\begin{pmatrix}p&q\\1&0\end{pmatrix}$的两个:term[特征值]{id="math.linear-algebra.eigenvalue"}$r_1$、$r_2$不同，可以:term[对角化]{id="math.linear-algebra.diagonalization"}，由本节第一个定理，$(a_{k+1},a_k)$是$r_1^k$、$r_2^k$分别乘两个固定向量之和，取第二个:term[分量]{id="math.linear-algebra.component"}就是$\alpha r_1^k+\beta r_2^k$。反过来，$r_i^{k+2}=pr_i^{k+1}+qr_i^k$，所以这样的式子都满足递推；$a_0$、$a_1$给出$\alpha+\beta=a_0$、$\alpha r_1+\beta r_2=a_1$，$r_1\ne r_2$，能唯一解出$\alpha$、$\beta$。

斐波那契数列的$\lambda^2=\lambda+1$有两个根$\varphi=\frac{1+\sqrt5}2$、$\psi=\frac{1-\sqrt5}2$，由$F_0=0$、$F_1=1$解得$\alpha=\frac1{\sqrt5}$、$\beta=-\frac1{\sqrt5}$，所以$F_k=\frac{\varphi^k-\psi^k}{\sqrt5}$。$|\psi|<1$，$\psi^k$很快变得微不足道，$F_k$就是离$\frac{\varphi^k}{\sqrt5}$最近的整数，$\varphi$是主导特征值。

## 几何图像

:::anim{component="linear-map-2d"}
steps:
  - matrix: [[0.9, 0.2], [0.1, 0.8]]
    label: |
      第一年
  - matrix: [[0.9, 0.2], [0.1, 0.8]]
    label: |
      第二年
  - matrix: [[0.9, 0.2], [0.1, 0.8]]
    label: |
      第三年
range: { x: [-1.5, 3], y: [-1.5, 2] }
show: [grid, eigen]
vectors:
  - x: 2
    y: 1
    label: |
      $\vb v_1$
  - x: 1
    y: -1
    label: |
      $\vb v_2$
:::

动画把人口的矩阵$M$连续作用三次，虚线是它的两条:term[特征向量]{id="math.linear-algebra.eigenvector"}所在的直线。$\vb v_1=(2,1)$属于:term[特征值]{id="math.linear-algebra.eigenvalue"}$1$，三年都不动；$\vb v_2=(1,-1)$属于$0.7$，每一年都变成前一年的$0.7$倍。整个网格一年年向$\vb v_1$那条直线挤过去：不论从哪里出发，长期看都只剩下$\vb v_1$方向的那一部分。

## 例题

### 例 1　算$A^k$的公式

求$A=\begin{pmatrix}1&2\\2&1\end{pmatrix}$的$A^k$。

**为什么想到这么做**：先:term[对角化]{id="math.linear-algebra.diagonalization"}，再用$A^k=PD^kP^{-1}$；:term[对角矩阵]{id="math.linear-algebra.diagonal-matrix"}的幂一步就能写出。

**推导**：:term[特征多项式]{id="math.linear-algebra.characteristic-polynomial"}$\lambda^2-2\lambda-3=(\lambda-3)(\lambda+1)$，属于$3$、$-1$的:term[特征向量]{id="math.linear-algebra.eigenvector"}是$(1,1)$、$(1,-1)$。$P=\begin{pmatrix}1&1\\1&-1\end{pmatrix}$，$P^{-1}=\frac12\begin{pmatrix}1&1\\1&-1\end{pmatrix}$，所以$A^k=\frac12\begin{pmatrix}3^k+(-1)^k&3^k-(-1)^k\\3^k-(-1)^k&3^k+(-1)^k\end{pmatrix}$。验算：$k=1$时正是$A$，$k=2$时是$\begin{pmatrix}5&4\\4&5\end{pmatrix}=A^2$。

### 例 2　解一个线性递推

数列满足$a_0=0$、$a_1=1$、$a_{k+2}=a_{k+1}+2a_k$。求$a_k$的通项。

**为什么想到这么做**：解$\lambda^2=\lambda+2$，两个根不同，由定理$a_k=\alpha r_1^k+\beta r_2^k$，再用$a_0$、$a_1$定系数。

**推导**：$\lambda^2-\lambda-2=(\lambda-2)(\lambda+1)$，$r_1=2$、$r_2=-1$。由$\alpha+\beta=0$、$2\alpha-\beta=1$得$\alpha=\frac13$、$\beta=-\frac13$，所以$a_k=\frac{2^k-(-1)^k}3$。验算：$a_2=1$、$a_3=3$、$a_4=5$，和递推一项项算出的$1+0=1$、$1+2=3$、$3+2=5$一致。

## 常见误区

- 「$A^k$就是把每个元素$k$次方。」只有:term[对角矩阵]{id="math.linear-algebra.diagonal-matrix"}才这样；例 1 的$A^2$左上角是$5$，不是$1^2$。
- 「有一个:term[特征值]{id="math.linear-algebra.eigenvalue"}是$1$、其余的模都小于$1$，$A^k$就趋于:term[零矩阵]{id="math.linear-algebra.zero-matrix"}（zero matrix）。」人口的$M^k$趋于把每个$\vb x$变成$c_1\vb v_1$的矩阵，不是零矩阵；只有全部特征值的模都小于$1$时，$A^k$才趋于零矩阵。
- 「$A^k\vb x$的方向最后总趋于主导特征值的:term[特征向量]{id="math.linear-algebra.eigenvector"}。」要求$c_1\ne0$；$\vb x$正好落在其余特征向量:term[生成]{id="math.linear-algebra.span"}（span）的:term[子空间]{id="math.linear-algebra.subspace"}（subspace）里时，就不会。
- 「通项里有$\sqrt5$，$F_k$就不是整数。」$\varphi^k$、$\psi^k$里的$\sqrt5$在相减、再除以$\sqrt5$以后正好消掉。

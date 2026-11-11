---
id: math.linear-algebra.svd
title: |
  奇异值分解
goal: |
  会求矩阵的奇异值分解，并用它说明矩阵怎样把单位圆变成椭圆。
prerequisites: [math.linear-algebra.spectral-theorem]
minutes: 35
summary: |
  矩阵都能写成$U\Sigma V\T$：转动或翻转，沿坐标轴伸缩，再转动或翻转。
status: reviewed
---

## 这一节要回答的问题

[实对称矩阵的谱定理](lesson:math.linear-algebra.spectral-theorem)说，:term[对称矩阵]{id="math.linear-algebra.symmetric-matrix"}（symmetric matrix）把单位圆变成椭圆，椭圆的轴沿着:term[特征向量]{id="math.linear-algebra.eigenvector"}（eigenvector）的方向。不对称的矩阵，甚至不是:term[方阵]{id="math.linear-algebra.square-matrix"}（square matrix）的矩阵，把单位圆变成什么？如果还是椭圆，它的轴在哪里，有多长？能不能把任何矩阵都拆成几个简单的变换？

## 讲解

### 奇异值

一般的$m\times n$矩阵$A$没有:term[谱定理]{id="math.linear-algebra.spectral-theorem"}（spectral theorem）可用，可$A\T A$是$n$阶:term[对称矩阵]{id="math.linear-algebra.symmetric-matrix"}：$(A\T A)\T=A\T A$。它的:term[特征值]{id="math.linear-algebra.eigenvalue"}（eigenvalue）都不是负数：$A\T A\vb v=\lambda\vb v$、$|\vb v|=1$时，$\lambda=\vb v\T A\T A\vb v=|A\vb v|^2\ge0$。这个等式还说明，$A$把:term[单位特征向量]{id="math.linear-algebra.eigenvector"}$\vb v$拉长成:term[长度]{id="math.linear-algebra.length"}（length）$\sqrt\lambda$的向量。

::anchor{id="def-singular-value"}
设$A$是$m\times n$矩阵，$A\T A$的特征值从大到小是$\lambda_1\ge\lambda_2\ge\dots\ge\lambda_n\ge0$。$\sigma_i=\sqrt{\lambda_i}$叫作$A$的:term[奇异值]{id="math.linear-algebra.singular-value"}（singular values）。

为什么这样定义：由:term[谱定理]{id="math.linear-algebra.spectral-theorem"}，$A\T A$有一组正交规范的特征向量$\vb v_1,\dots,\vb v_n$，$|A\vb v_i|=\sigma_i$：奇异值就是$A$把这组互相垂直的:term[单位向量]{id="math.linear-algebra.unit-vector"}（unit vector）拉成的长度。$A\vb v_i$两两也:term[正交]{id="math.linear-algebra.orthogonal"}（orthogonal）：$i\ne j$时$A\vb v_i\cdot A\vb v_j=\vb v_i\T A\T A\vb v_j=\lambda_j\vb v_i\cdot\vb v_j=0$。边界情况：对称矩阵的奇异值是特征值的绝对值；:term[正交矩阵]{id="math.linear-algebra.orthogonal-matrix"}（orthogonal matrix）保持长度，奇异值都是$1$。

### 奇异值分解

::anchor{id="thm-svd"}
**:term[奇异值分解]{id="math.linear-algebra.svd"}（singular value decomposition）**　每个$m\times n$实矩阵$A$都能写成$A=U\Sigma V\T$：$U$是$m$阶:term[正交矩阵]{id="math.linear-algebra.orthogonal-matrix"}，$V$是$n$阶正交矩阵，$\Sigma$是$m\times n$矩阵，主对角线（main diagonal）上依次是:term[奇异值]{id="math.linear-algebra.singular-value"}$\sigma_1\ge\sigma_2\ge\dots$，其余元素都是$0$。

**证明思路**：$V$的各列取上面的$\vb v_1,\dots,\vb v_n$。设前$r$个奇异值不为$0$，令$\vb u_i=\frac{A\vb v_i}{\sigma_i}$（$i\le r$），由上面的计算，它们是正交规范的；再把它们补成$\R^m$的一组:term[正交规范基]{id="math.linear-algebra.orthonormal-basis"}（orthonormal basis）$\vb u_1,\dots,\vb u_m$，作$U$的各列。$i\le r$时$A\vb v_i=\sigma_i\vb u_i$，$i>r$时$|A\vb v_i|=\sigma_i=0$，所以$AV=U\Sigma$，两边右乘$V\T$即得。

读法是从右往左：$V\T$把$\vb v_i$转到第$i$条坐标轴上，$\Sigma$把第$i$个坐标乘以$\sigma_i$，$U$再把第$i$条坐标轴转到$\vb u_i$上。所以$A$把单位圆变成椭圆（$\R^n$里是椭球），半轴沿$\vb u_i$、:term[长度]{id="math.linear-algebra.length"}是$\sigma_i$；奇异值为$0$的方向被压扁，椭圆退化成线段（例 2）。平面上的正交矩阵是旋转或反射（reflection）；一般地，正交矩阵只是转动、翻转，不改变长度。所以任何矩阵都是「转动或翻转，沿坐标轴伸缩，再转动或翻转」。

把$U\Sigma V\T$按列乘开，得$A=\sigma_1\vb u_1\vb v_1\T+\dots+\sigma_r\vb u_r\vb v_r\T$，和:term[谱分解]{id="math.linear-algebra.spectral-decomposition"}（spectral decomposition）的样子一样，只是左右两边的向量不同。不为零的奇异值的个数$r$就是$A$的:term[秩]{id="math.linear-algebra.rank"}（rank）（第 6 题）；只保留前几项，就用少得多的数近似表示了$A$（第 8 题）。

### 怎样求

先算$A\T A$的:term[特征值]{id="math.linear-algebra.eigenvalue"}和:term[单位特征向量]{id="math.linear-algebra.eigenvector"}，得到:term[奇异值]{id="math.linear-algebra.singular-value"}和$V$；再用$\vb u_i=\frac{A\vb v_i}{\sigma_i}$算出$U$的前$r$列；$m>r$时，用[施密特正交化](lesson:math.linear-algebra.gram-schmidt#thm-gram-schmidt)（Gram-Schmidt process）把它们补成:term[正交规范基]{id="math.linear-algebra.orthonormal-basis"}（例 1）。

## 几何图像

:::anim{component="linear-map-2d"}
steps:
  - matrix: [[1/sqrt(2), 1/sqrt(2)], [-1/sqrt(2), 1/sqrt(2)]]
    label: |
      先作用$V\T$：$\vb v_1$、$\vb v_2$转到两条坐标轴上
  - matrix: [[3, 0], [0, 1]]
    label: |
      再作用$\Sigma$：横坐标乘以$3$，纵坐标不变
  - matrix: [[1/sqrt(10), -3/sqrt(10)], [3/sqrt(10), 1/sqrt(10)]]
    label: |
      最后作用$U$：两条坐标轴转到$\vb u_1$、$\vb u_2$上
range: { x: [-3.5, 3.5], y: [-3.5, 3.5] }
show: [circle, basis]
vectors:
  - x: 1/sqrt(2)
    y: 1/sqrt(2)
    label: |
      $\vb v_1$
  - x: -1/sqrt(2)
    y: 1/sqrt(2)
    label: |
      $\vb v_2$
:::

动画把$A=\frac1{\sqrt5}\begin{pmatrix}3&0\\4&5\end{pmatrix}$拆成三步。$A\T A=\begin{pmatrix}5&4\\4&5\end{pmatrix}$，:term[特征值]{id="math.linear-algebra.eigenvalue"}$9$、$1$，:term[奇异值]{id="math.linear-algebra.singular-value"}$3$、$1$，$\vb v_1=\frac1{\sqrt2}(1,1)$，$\vb v_2=\frac1{\sqrt2}(-1,1)$，$V\T$是顺时针转$45^\circ$。第二步之后单位圆变成横放的椭圆，半轴$3$、$1$；第三步$U$把它转过去，$\vb v_1$最后落在长轴的端点$3\vb u_1$上，$\vb v_2$落在短轴的端点$\vb u_2$上。第一步、第三步是旋转，插值途中图形会先缩小一点，那只是过渡；每一步要看的是开头和结尾。

## 例题

### 例 1　一个$3\times2$矩阵

求$A=\begin{pmatrix}1&1\\0&1\\1&0\end{pmatrix}$的:term[奇异值分解]{id="math.linear-algebra.svd"}。

**为什么想到这么做**：$A$不是:term[方阵]{id="math.linear-algebra.square-matrix"}，没有:term[特征值]{id="math.linear-algebra.eigenvalue"}可说，先算$2$阶:term[对称矩阵]{id="math.linear-algebra.symmetric-matrix"}$A\T A$；$U$是$3$阶的，只能由$A\vb v_i$得到两列，第三列要补。

**推导**：$A\T A=\begin{pmatrix}2&1\\1&2\end{pmatrix}$，特征值$3$、$1$，:term[奇异值]{id="math.linear-algebra.singular-value"}$\sqrt3$、$1$，$\vb v_1=\frac1{\sqrt2}(1,1)$，$\vb v_2=\frac1{\sqrt2}(1,-1)$。$\vb u_1=\frac{A\vb v_1}{\sqrt3}=\frac1{\sqrt6}(2,1,1)$，$\vb u_2=\frac{A\vb v_2}1=\frac1{\sqrt2}(0,-1,1)$；和这两个都:term[正交]{id="math.linear-algebra.orthogonal"}的:term[单位向量]{id="math.linear-algebra.unit-vector"}是$\vb u_3=\frac1{\sqrt3}(1,-1,-1)$。所以$A=U\Sigma V\T$，$U$的各列是$\vb u_1,\vb u_2,\vb u_3$，$\Sigma=\begin{pmatrix}\sqrt3&0\\0&1\\0&0\end{pmatrix}$，$V$的各列是$\vb v_1,\vb v_2$。

### 例 2　秩为$1$的矩阵

求$A=\begin{pmatrix}2&2\\1&1\end{pmatrix}$的:term[奇异值]{id="math.linear-algebra.singular-value"}，说明它把单位圆变成什么。

**为什么想到这么做**：两列相同，$A$的:term[秩]{id="math.linear-algebra.rank"}是$1$，应该只有一个奇异值不为$0$。

**推导**：$A\T A=\begin{pmatrix}5&5\\5&5\end{pmatrix}$，:term[特征值]{id="math.linear-algebra.eigenvalue"}$10$、$0$，奇异值$\sqrt{10}$、$0$。$\vb v_1=\frac1{\sqrt2}(1,1)$，$\vb u_1=\frac{A\vb v_1}{\sqrt{10}}=\frac1{\sqrt{20}}(4,2)=\frac1{\sqrt5}(2,1)$，$A=\sqrt{10}\,\vb u_1\vb v_1\T$。单位圆被压成沿$(2,1)$方向、长$2\sqrt{10}$的线段：沿$\vb v_2=\frac1{\sqrt2}(1,-1)$的方向全被压没了。

## 常见误区

- 「:term[奇异值]{id="math.linear-algebra.singular-value"}就是:term[特征值]{id="math.linear-algebra.eigenvalue"}。」$\begin{pmatrix}1&1\\0&1\end{pmatrix}$的特征值是$1$、$1$，奇异值却是$\frac{\sqrt5+1}2$、$\frac{\sqrt5-1}2$；只有:term[对称矩阵]{id="math.linear-algebra.symmetric-matrix"}的奇异值等于特征值的绝对值。
- 「:term[奇异值分解]{id="math.linear-algebra.svd"}里$U=V$。」一般不相等，例 1 里$U$、$V$连阶数都不同；对称矩阵、特征值都不为负时，才能取$U=V$。
- 「奇异值可以是负数。」奇异值是平方根，不小于$0$；负号都放进了$U$、$V$。
- 「只有:term[方阵]{id="math.linear-algebra.square-matrix"}才有奇异值分解。」例 1 是$3\times2$矩阵；任何矩阵都有。

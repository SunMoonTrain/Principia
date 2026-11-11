---
id: math.linear-algebra.change-of-basis
title: |
  坐标与基变换
goal: |
  会写出基变换矩阵，并求同一个向量在不同基下的坐标。
prerequisites: [math.linear-algebra.vector-spaces, math.linear-algebra.matrix-inverse]
minutes: 35
summary: |
  基变换矩阵的各列是旧基在新基下的坐标，乘它就换算坐标。
status: reviewed
---

## 这一节要回答的问题

[基与维数](lesson:math.linear-algebra.basis-dimension)的图里，同一个向量$\vb v=(1,5)$在:term[标准基]{id="math.linear-algebra.basis"}（standard basis）下的坐标是$(1,5)$，在基$\vb b_1=(2,1)$、$\vb b_2=(-1,1)$下的坐标是$(2,3)$。知道一个向量在一组基下的坐标，怎样算出它在另一组基下的坐标？能不能把这种换算写成一个矩阵，一次算好？

## 讲解

### 从坐标到向量

::anchor{id="thm-basis-matrix"}
**坐标与向量**　设$\mathcal B=(\vb b_1,\dots,\vb b_n)$是$\R^n$的一组:term[基]{id="math.linear-algebra.basis"}，$P_{\mathcal B}$是以$\vb b_1,\dots,\vb b_n$为各列的矩阵。那么$\vb v=P_{\mathcal B}[\vb v]_{\mathcal B}$；$P_{\mathcal B}$:term[可逆]{id="math.linear-algebra.invertible"}（invertible），$[\vb v]_{\mathcal B}=P_{\mathcal B}^{-1}\vb v$。

**证明思路**：设:term[坐标向量]{id="math.linear-algebra.coordinate-vector"}（coordinate vector）$[\vb v]_{\mathcal B}=(c_1,\dots,c_n)$，由[按列算矩阵乘向量](lesson:math.linear-algebra.matrices#def-matrix-vector)，$P_{\mathcal B}[\vb v]_{\mathcal B}=c_1\vb b_1+\dots+c_n\vb b_n=\vb v$。基向量:term[线性无关]{id="math.linear-algebra.linearly-independent"}（linearly independent），$P_{\mathcal B}\vb x=\vb 0$只有零解，由[可逆与方程组](lesson:math.linear-algebra.matrix-inverse#thm-invertible)，$P_{\mathcal B}$可逆，两边左乘$P_{\mathcal B}^{-1}$即得第二式。

所以$P_{\mathcal B}$把坐标变成向量，$P_{\mathcal B}^{-1}$把向量变成坐标；从$\vb v$求坐标，就是解方程组$P_{\mathcal B}\vb x=\vb v$。

### 基变换矩阵

::anchor{id="def-change-of-basis"}
设$\mathcal B=(\vb b_1,\dots,\vb b_n)$、$\mathcal C$是$n$维:term[向量空间]{id="math.linear-algebra.vector-space"}（vector space）$V$的两组:term[基]{id="math.linear-algebra.basis"}。以$[\vb b_1]_{\mathcal C},\dots,[\vb b_n]_{\mathcal C}$为各列的$n$阶矩阵，叫作从$\mathcal B$到$\mathcal C$的:term[基变换矩阵]{id="math.linear-algebra.change-of-basis-matrix"}（change-of-basis matrix），记作$P_{\mathcal C\leftarrow\mathcal B}$。

为什么这样定义：下面的定理说，它把$\mathcal B$下的坐标换成$\mathcal C$下的坐标，记号里箭头的方向就是换算的方向。各列是旧基$\mathcal B$的向量在新基$\mathcal C$下的坐标，这一点最容易记反。边界情况：$V=\R^n$、$\mathcal C$是标准基时，$[\vb b_j]_{\mathcal C}=\vb b_j$，$P_{\mathcal C\leftarrow\mathcal B}$就是上面的$P_{\mathcal B}$。

::anchor{id="thm-change-of-basis"}
**换算坐标**　对$V$里的每个向量$\vb v$，$[\vb v]_{\mathcal C}=P_{\mathcal C\leftarrow\mathcal B}[\vb v]_{\mathcal B}$；$P_{\mathcal C\leftarrow\mathcal B}$:term[可逆]{id="math.linear-algebra.invertible"}，它的逆是$P_{\mathcal B\leftarrow\mathcal C}$。

**证明思路**：设$\vb v=c_1\vb b_1+\dots+c_n\vb b_n$。坐标保持加法和:term[数乘]{id="math.linear-algebra.scalar-multiplication"}（scalar multiplication）（[坐标把$V$变成$\R^n$](lesson:math.linear-algebra.vector-spaces#thm-coordinates-iso)），所以$[\vb v]_{\mathcal C}=c_1[\vb b_1]_{\mathcal C}+\dots+c_n[\vb b_n]_{\mathcal C}$，正是$P_{\mathcal C\leftarrow\mathcal B}$乘以$(c_1,\dots,c_n)$。先从$\mathcal B$换到$\mathcal C$、再换回$\mathcal B$，每个坐标都回到原样，所以$P_{\mathcal B\leftarrow\mathcal C}P_{\mathcal C\leftarrow\mathcal B}=I$，由[一边成立就够](lesson:math.linear-algebra.matrix-inverse#thm-one-sided)，两者互为:term[逆矩阵]{id="math.linear-algebra.inverse-matrix"}（inverse matrix）。

::anchor{id="thm-rn-change"}
**$\R^n$里怎样求**　在$\R^n$里，$P_{\mathcal C\leftarrow\mathcal B}=P_{\mathcal C}^{-1}P_{\mathcal B}$；对$(P_{\mathcal C}\mid P_{\mathcal B})$做:term[初等行变换]{id="math.linear-algebra.elementary-row-operation"}（elementary row operations），把左半边化成$I$，右半边就是它。

**证明思路**：$\vb v=P_{\mathcal B}[\vb v]_{\mathcal B}=P_{\mathcal C}[\vb v]_{\mathcal C}$，两边左乘$P_{\mathcal C}^{-1}$即得第一式。它的第$j$列是$[\vb b_j]_{\mathcal C}$，即方程组$P_{\mathcal C}\vb x=\vb b_j$的解；$n$个方程组的系数相同，可以把$\vb b_1,\dots,\vb b_n$并排放在右边一起消元，道理和[用初等行变换求逆](lesson:math.linear-algebra.matrix-inverse#thm-gauss-jordan)一样。

## 几何图像

:::anim{component="linear-map-2d"}
matrix: [[2, -1], [1, 1]]
range: { x: [-2.5, 4.5], y: [-1.5, 6] }
show: [grid, basis]
vectors:
  - x: 2
    y: 3
    label: |
      坐标$(2,3)$
:::

动画把坐标网格慢慢变成:term[基]{id="math.linear-algebra.basis"}$\mathcal B$的斜网格，$P_{\mathcal B}=\begin{pmatrix}2&-1\\1&1\end{pmatrix}$的两列就是$\vb b_1$、$\vb b_2$（把矩阵看成变换，见[线性变换及其矩阵](lesson:math.linear-algebra.linear-maps)）。坐标网格里的点$(2,3)$被送到$2\vb b_1+3\vb b_2=(1,5)$，这正是$\vb v=P_{\mathcal B}[\vb v]_{\mathcal B}$：斜网格上数格子得到的坐标，乘上$P_{\mathcal B}$就是向量本身。反过来，从$\vb v=(1,5)$求坐标，就要乘$P_{\mathcal B}^{-1}$，把斜网格拉回方格。

## 例题

### 例 1　平面上的两组基

设$\mathcal B=\bigl((1,2),(2,3)\bigr)$、$\mathcal C=\bigl((1,1),(1,2)\bigr)$。求$P_{\mathcal C\leftarrow\mathcal B}$；已知$[\vb v]_{\mathcal B}=(2,-1)$，求$[\vb v]_{\mathcal C}$。

**为什么想到这么做**：用$P_{\mathcal C\leftarrow\mathcal B}=P_{\mathcal C}^{-1}P_{\mathcal B}$，或者直接求出$\vb b_1$、$\vb b_2$在$\mathcal C$下的坐标。

**推导**：$P_{\mathcal C}=\begin{pmatrix}1&1\\1&2\end{pmatrix}$，$ad-bc=1$，$P_{\mathcal C}^{-1}=\begin{pmatrix}2&-1\\-1&1\end{pmatrix}$，所以$P_{\mathcal C\leftarrow\mathcal B}=P_{\mathcal C}^{-1}\begin{pmatrix}1&2\\2&3\end{pmatrix}=\begin{pmatrix}0&1\\1&1\end{pmatrix}$。验算各列：$(1,2)=0(1,1)+1(1,2)$，$(2,3)=1(1,1)+1(1,2)$。于是$[\vb v]_{\mathcal C}=\begin{pmatrix}0&1\\1&1\end{pmatrix}\begin{pmatrix}2\\-1\end{pmatrix}=(-1,1)$；验算：$\vb v=2(1,2)-(2,3)=(0,1)$，而$-(1,1)+(1,2)=(0,1)$。

### 例 2　多项式按$x-1$展开

在$P_2$里，$\mathcal B=(1,x,x^2)$、$\mathcal C=\bigl(1,\ x-1,\ (x-1)^2\bigr)$。求$P_{\mathcal C\leftarrow\mathcal B}$，并求$p=2-x+3x^2$在$\mathcal C$下的坐标。

**为什么想到这么做**：$P_{\mathcal C\leftarrow\mathcal B}$的各列是$1$、$x$、$x^2$在$\mathcal C$下的坐标；把$x$写成$(x-1)+1$代进去展开。

**推导**：$1=1$，$x=1+(x-1)$，$x^2=\bigl((x-1)+1\bigr)^2=1+2(x-1)+(x-1)^2$，所以$P_{\mathcal C\leftarrow\mathcal B}=\begin{pmatrix}1&1&1\\0&1&2\\0&0&1\end{pmatrix}$。$[p]_{\mathcal B}=(2,-1,3)$，$[p]_{\mathcal C}=(2-1+3,\ -1+6,\ 3)=(4,5,3)$，即$p=4+5(x-1)+3(x-1)^2$。验算：展开得$4+5x-5+3x^2-6x+3=2-x+3x^2$。

## 常见误区

- 「:term[基变换矩阵]{id="math.linear-algebra.change-of-basis-matrix"}$P_{\mathcal C\leftarrow\mathcal B}$的各列是新的:term[基]{id="math.linear-algebra.basis"}在旧的基下的坐标。」反了：各列是旧基$\mathcal B$的向量在新基$\mathcal C$下的坐标，所以它把$\mathcal B$下的坐标换成$\mathcal C$下的坐标。
- 「$[\vb v]_{\mathcal B}=P_{\mathcal B}\vb v$。」$P_{\mathcal B}$把坐标变成向量，从向量求坐标要乘$P_{\mathcal B}^{-1}$。
- 「换了一组基，向量也就变了。」向量还是那个向量，变的只是描述它的坐标。
- 「$P_{\mathcal C\leftarrow\mathcal B}=P_{\mathcal B}^{-1}P_{\mathcal C}$。」次序要对：先用$P_{\mathcal B}$把$\mathcal B$下的坐标变成向量，再用$P_{\mathcal C}^{-1}$变成$\mathcal C$下的坐标，乘积是$P_{\mathcal C}^{-1}P_{\mathcal B}$。

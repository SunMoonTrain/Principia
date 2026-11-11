---
id: math.linear-algebra.similarity
title: |
  线性算子的矩阵与相似
goal: |
  会求线性算子在给定基下的矩阵，并知道换基后矩阵变成与它相似的$P^{-1}AP$。
prerequisites: [math.linear-algebra.change-of-basis, math.linear-algebra.kernel-image]
minutes: 30
summary: |
  算子在基下的矩阵随基而变，换基得到相似的矩阵$P^{-1}AP$。
status: reviewed
---

## 这一节要回答的问题

把平面上的向量关于直线$y=x$翻过去，:term[标准矩阵]{id="math.linear-algebra.standard-matrix"}（standard matrix）是$\begin{pmatrix}0&1\\1&0\end{pmatrix}$；可换成$(1,1)$、$(1,-1)$这组:term[基]{id="math.linear-algebra.basis"}（basis），第一个基向量不动，第二个变成相反向量，同一个变换写出来是$\begin{pmatrix}1&0\\0&-1\end{pmatrix}$。同一个变换，在不同的基下写成的矩阵有什么关系？怎样挑一组基，让矩阵变得简单？

## 讲解

### 线性算子在一组基下的矩阵

::anchor{id="def-operator-matrix"}
从:term[向量空间]{id="math.linear-algebra.vector-space"}（vector space）$V$到它自己的:term[线性映射]{id="math.linear-algebra.linear-map"}（linear map），叫作$V$上的:term[线性算子]{id="math.linear-algebra.linear-operator"}（linear operator）。设$\mathcal B=(\vb b_1,\dots,\vb b_n)$是$V$的一组:term[基]{id="math.linear-algebra.basis"}，以:term[坐标向量]{id="math.linear-algebra.coordinate-vector"}（coordinate vector）$[T(\vb b_1)]_{\mathcal B},\dots,[T(\vb b_n)]_{\mathcal B}$为各列的$n$阶矩阵，叫作$T$在$\mathcal B$下的矩阵，记作$[T]_{\mathcal B}$。

为什么这样定义：这正是[线性映射的核与像](lesson:math.linear-algebra.kernel-image)里取坐标时排出的矩阵，两边用同一组基，于是$[T(\vb v)]_{\mathcal B}=[T]_{\mathcal B}[\vb v]_{\mathcal B}$：作用$T$，就是用矩阵乘坐标。在$\R^n$里取标准基（standard basis），$[T]_{\mathcal B}$就是:term[标准矩阵]{id="math.linear-algebra.standard-matrix"}。边界情况：恒等算子（identity operator）在任何一组基下的矩阵都是$I$，零算子（zero operator）都是:term[零矩阵]{id="math.linear-algebra.zero-matrix"}（zero matrix）。

例如对$P_2$里的多项式求导，$D(1)=0$，$D(x)=1$，$D(x^2)=2x$，在基$\mathcal B=(1,x,x^2)$下，三个:term[像]{id="math.linear-algebra.image"}（image）的坐标是$(0,0,0)$、$(1,0,0)$、$(0,2,0)$，所以$[D]_{\mathcal B}=\begin{pmatrix}0&1&0\\0&0&2\\0&0&0\end{pmatrix}$。

### 换基与相似

::anchor{id="thm-change-operator"}
**换:term[基]{id="math.linear-algebra.basis"}时:term[算子]{id="math.linear-algebra.linear-operator"}的矩阵怎样变**　设$\mathcal B$、$\mathcal C$是$V$的两组基，$P=P_{\mathcal B\leftarrow\mathcal C}$是:term[基变换矩阵]{id="math.linear-algebra.change-of-basis-matrix"}（change-of-basis matrix），它的各列是$[\vb c_k]_{\mathcal B}$。则$[T]_{\mathcal C}=P^{-1}[T]_{\mathcal B}P$。

**证明思路**：对每个$\vb v$，由[换算坐标](lesson:math.linear-algebra.change-of-basis#thm-change-of-basis)，$[T(\vb v)]_{\mathcal C}=P^{-1}[T(\vb v)]_{\mathcal B}=P^{-1}[T]_{\mathcal B}[\vb v]_{\mathcal B}=P^{-1}[T]_{\mathcal B}P[\vb v]_{\mathcal C}$。另一方面$[T(\vb v)]_{\mathcal C}=[T]_{\mathcal C}[\vb v]_{\mathcal C}$，而$[\vb v]_{\mathcal C}$可以是任何一列数，所以两个矩阵相等。

从右往左读$P^{-1}[T]_{\mathcal B}P$：先用$P$把$\mathcal C$坐标换成$\mathcal B$坐标，再在$\mathcal B$坐标里作用$T$，最后用$P^{-1}$换回$\mathcal C$坐标。

::anchor{id="def-similar"}
设$A$、$B$是$n$阶:term[方阵]{id="math.linear-algebra.square-matrix"}（square matrix）。如果有:term[可逆]{id="math.linear-algebra.invertible"}（invertible）矩阵$P$使$B=P^{-1}AP$，就说$A$与$B$:term[相似]{id="math.linear-algebra.similar"}（similar）。

为什么这样定义：任何可逆的$P$，它的各列都是$\R^n$的一组基，所以$A$与$B$相似，正是说它们是同一个算子在两组基下的矩阵。相似是对称的，因为$A=(P^{-1})^{-1}BP^{-1}$；$A$与$B$相似、$B$与$C$相似时，$A$与$C$也相似。边界情况：$cI$只和它自己相似，因为$P^{-1}(cI)P=cI$；把每个向量都变成$c$倍的算子，在哪组基下都是$cI$。

### 相似的矩阵有什么相同

::anchor{id="thm-similar-invariants"}
**:term[相似]{id="math.linear-algebra.similar"}的矩阵的:term[秩]{id="math.linear-algebra.rank"}（rank）和幂**　若$B=P^{-1}AP$，则$\rank B=\rank A$，并且对每个正整数$k$，$B^k=P^{-1}A^kP$。

**证明思路**：$A$、$B$是同一个:term[算子]{id="math.linear-algebra.linear-operator"}$T$在两组:term[基]{id="math.linear-algebra.basis"}下的矩阵，秩都是$\dim\im T$；也可以由[秩与秩-零化度定理](lesson:math.linear-algebra.rank-nullity)第 5 题，乘上:term[可逆]{id="math.linear-algebra.invertible"}矩阵，秩不变大，再乘回去也不变大。幂：$B^2=P^{-1}APP^{-1}AP=P^{-1}A^2P$，中间的$PP^{-1}$都消掉了，$B^k$同理。

所以$A$满足$A^2=O$、$A^2=A$这样的等式时，和它相似的矩阵也满足。相似的矩阵还有别的共同点，以后在[对角化](lesson:math.linear-algebra.diagonalization)里会看到。反过来，若能挑一组基，使算子的矩阵是:term[对角矩阵]{id="math.linear-algebra.diagonal-matrix"}（diagonal matrix），算它的幂就只要把对角元（diagonal entries）各自乘方，这正是:term[对角化]{id="math.linear-algebra.diagonalization"}（diagonalization）要做的事。

## 几何图像

:::anim{component="linear-map-2d"}
matrix: [[3, -1], [2, 0]]
range: { x: [-2, 4], y: [-1.5, 3.5] }
show: [grid, basis]
vectors:
  - x: 1
    y: 1
    label: |
      $\vb c_1$
  - x: 1
    y: 2
    label: |
      $\vb c_2$
:::

动画把$A=\begin{pmatrix}3&-1\\2&0\end{pmatrix}$作用在平面上，另外画出了$\vb c_1=(1,1)$、$\vb c_2=(1,2)$。放完时，$\vb c_1$变成$(2,2)=2\vb c_1$，$\vb c_2$不动，所以在:term[基]{id="math.linear-algebra.basis"}$\mathcal C=(\vb c_1,\vb c_2)$下，这个:term[线性算子]{id="math.linear-algebra.linear-operator"}的矩阵是$\begin{pmatrix}2&0\\0&1\end{pmatrix}$。标准基下的$A$和它:term[相似]{id="math.linear-algebra.similar"}：$P$的两列取$\vb c_1$、$\vb c_2$，就有$A=P\begin{pmatrix}2&0\\0&1\end{pmatrix}P^{-1}$。插值途中，$\vb c_1$、$\vb c_2$一直留在各自的直线上。

## 例题

### 例 1　由一组好的基写出标准矩阵

$T$把平面上的每个向量沿$\vb c_2=(1,1)$的方向推到直线$\Span\{\vb c_1\}$上，$\vb c_1=(2,1)$；也就是说，$\vb v=a\vb c_1+b\vb c_2$时，$T(\vb v)=a\vb c_1$。求$T$的:term[标准矩阵]{id="math.linear-algebra.standard-matrix"}。

**为什么想到这么做**：在:term[基]{id="math.linear-algebra.basis"}$\mathcal C=(\vb c_1,\vb c_2)$下，$T(\vb c_1)=\vb c_1$、$T(\vb c_2)=\vb 0$，矩阵一眼就能写出；再用换基公式换回标准基。

**推导**：$[T]_{\mathcal C}=\begin{pmatrix}1&0\\0&0\end{pmatrix}$。标准基$\mathcal E$下，$P=P_{\mathcal E\leftarrow\mathcal C}=\begin{pmatrix}2&1\\1&1\end{pmatrix}$，由换基公式$[T]_{\mathcal C}=P^{-1}[T]_{\mathcal E}P$，得$[T]_{\mathcal E}=P[T]_{\mathcal C}P^{-1}$。$P^{-1}=\begin{pmatrix}1&-1\\-1&2\end{pmatrix}$，算得$[T]_{\mathcal E}=\begin{pmatrix}2&-2\\1&-1\end{pmatrix}$。验算：$T(2,1)=(2,1)$，$T(1,1)=(0,0)$。

### 例 2　求导：换一组基，矩阵变了样子

对$P_2$里的多项式求导，在:term[基]{id="math.linear-algebra.basis"}$\mathcal B=(1,x,x^2)$下是上面的$[D]_{\mathcal B}$。改用基$\mathcal C=(\frac12x^2,x,1)$，求$[D]_{\mathcal C}$，并用换基公式验算。

**为什么想到这么做**：直接算三个基向量的导数在$\mathcal C$下的坐标；验算时写出$P=P_{\mathcal B\leftarrow\mathcal C}$，它的各列是新基向量在$1,x,x^2$下的坐标。

**推导**：$D(\frac12x^2)=x$，$D(x)=1$，$D(1)=0$，在$\mathcal C$下的坐标是$(0,1,0)$、$(0,0,1)$、$(0,0,0)$，所以$[D]_{\mathcal C}=\begin{pmatrix}0&0&0\\1&0&0\\0&1&0\end{pmatrix}$。验算：$P=\begin{pmatrix}0&0&1\\0&1&0\\\frac12&0&0\end{pmatrix}$，$P^{-1}=\begin{pmatrix}0&0&2\\0&1&0\\1&0&0\end{pmatrix}$，$P^{-1}[D]_{\mathcal B}P$算出来正是$[D]_{\mathcal C}$。两个矩阵一个在主对角线（main diagonal）上方有数，一个在下方有数，却是同一个求导。

## 常见误区

- 「$[T]_{\mathcal C}=P[T]_{\mathcal B}P^{-1}$。」$P=P_{\mathcal B\leftarrow\mathcal C}$时是$P^{-1}[T]_{\mathcal B}P$；记不清时，看$P$先作用在哪一边的坐标上：$P$把$\mathcal C$坐标变成$\mathcal B$坐标，所以紧挨着$[\vb v]_{\mathcal C}$。
- 「:term[秩]{id="math.linear-algebra.rank"}相同的矩阵就:term[相似]{id="math.linear-algebra.similar"}。」$\begin{pmatrix}0&1\\0&0\end{pmatrix}$和$\begin{pmatrix}1&0\\0&0\end{pmatrix}$的秩都是$1$；前者的平方是:term[零矩阵]{id="math.linear-algebra.zero-matrix"}，后者的平方是它自己，不是零，所以不相似。
- 「:term[线性算子]{id="math.linear-algebra.linear-operator"}的矩阵只和算子有关。」矩阵还和选的:term[基]{id="math.linear-algebra.basis"}有关；和基无关的是相似的矩阵共有的东西，例如秩。

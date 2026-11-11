---
id: math.linear-algebra.determinant-properties
title: |
  行列式的计算与性质
goal: |
  会用行变换和按行展开计算行列式，并使用$\det(AB)=\det A\det B$和「可逆当且仅当行列式不为零」。
prerequisites: [math.linear-algebra.determinant, math.linear-algebra.matrix-inverse]
minutes: 35
summary: |
  行变换化成三角形算行列式；行列式可乘，不为零当且仅当可逆。
status: reviewed
---

## 这一节要回答的问题

[行列式：有向面积与体积](lesson:math.linear-algebra.determinant)里，:term[行列式]{id="math.linear-algebra.determinant"}（determinant）由:term[多重线性]{id="math.linear-algebra.multilinear"}（multilinear）、:term[交错]{id="math.linear-algebra.alternating"}（alternating）和$\det I=1$确定，可按定义展开要算$n!$项。怎样又快又准地算出一个$4$阶、$10$阶的行列式？两个变换先后作用，体积的放大倍数怎样合起来？行列式和[逆矩阵与转置](lesson:math.linear-algebra.matrix-inverse)里的:term[可逆]{id="math.linear-algebra.invertible"}（invertible）、:term[转置]{id="math.linear-algebra.transpose"}（transpose）又有什么关系？

## 讲解

### 三角矩阵

::anchor{id="def-triangular"}
主对角线（main diagonal）以下的数都是$0$的:term[方阵]{id="math.linear-algebra.square-matrix"}（square matrix）叫作:term[上三角矩阵]{id="math.linear-algebra.upper-triangular-matrix"}（upper triangular matrix），主对角线以上的数都是$0$的叫作下三角矩阵（lower triangular matrix），两者合称三角矩阵（triangular matrix）。

为什么这样定义：消元把矩阵化成的阶梯形，对方阵来说就是上三角矩阵；而三角矩阵的:term[行列式]{id="math.linear-algebra.determinant"}一眼就能看出来（下面的定理）。:term[对角矩阵]{id="math.linear-algebra.diagonal-matrix"}（diagonal matrix）既是上三角矩阵，也是下三角矩阵。边界情况：主对角线上可以有$0$。

::anchor{id="thm-triangular"}
**三角矩阵的行列式**　三角矩阵的行列式等于主对角线上各数的乘积。

**证明思路**：按[行列式由三条性质确定](lesson:math.linear-algebra.determinant#thm-det-unique)展开，每一项从每一列、每一行各取一个数。上三角时，第一列只有第$1$行的数可能不为零，这一项只能取$a_{11}$；第二列剩下的行里只有第$2$行可能不为零，只能取$a_{22}$；依此类推，不为零的只有$a_{11}a_{22}\cdots a_{nn}$这一项，它的行号就是$1,2,\dots,n$，符号为正。下三角时从最后一列倒着取，道理一样。

### 转置与行变换

::anchor{id="thm-det-transpose"}
**:term[转置]{id="math.linear-algebra.transpose"}不变**　$\det A\T=\det A$。

**证明思路**：展开式的每一项是从每一行、每一列各取一个数相乘，转置只是把「行」「列」两个字对调，乘积还是那些乘积。一项的符号是：列按顺序排好时，行号要交换几次才排成$1,\dots,n$；把这些交换倒着做，就得到行按顺序排好时列号的排法，交换次数相同，所以每一项的符号也不变。例如三阶的一项$a_{21}a_{32}a_{13}$：列按顺序排时行号是$(2,3,1)$，行按顺序排时列号是$(3,1,2)$，各交换两次排好，符号都是正号。

由这个定理，:term[行列式]{id="math.linear-algebra.determinant"}对每一行也是线性的，有两行相同时也为零；对列说的每一条性质，对行都成立。

::anchor{id="thm-row-ops-det"}
**行变换怎样改变行列式**　交换两行，行列式变号；某一行乘以数$c$，行列式乘以$c$；把一行的倍数加到另一行上，行列式不变。

**证明思路**：对列，这三条在[行列式：有向面积与体积](lesson:math.linear-algebra.determinant)里已经由:term[多重线性]{id="math.linear-algebra.multilinear"}和:term[交错]{id="math.linear-algebra.alternating"}得到；转置以后行变成列，行列式不变，所以对行也成立。

于是算行列式，只要用:term[初等行变换]{id="math.linear-algebra.elementary-row-operation"}（elementary row operations）把:term[方阵]{id="math.linear-algebra.square-matrix"}化成:term[上三角矩阵]{id="math.linear-algebra.upper-triangular-matrix"}，一边记下交换了几次、哪些行乘过数，最后乘出主对角线（例 1）。化的过程中某一列找不到:term[主元]{id="math.linear-algebra.pivot"}（pivot）时，得到的三角矩阵主对角线上有$0$，行列式就是$0$。

### 乘积与可逆

::anchor{id="thm-det-product"}
**乘积的:term[行列式]{id="math.linear-algebra.determinant"}**　同阶:term[方阵]{id="math.linear-algebra.square-matrix"}$A$、$B$满足$\det(AB)=\det A\det B$。

**证明思路**：固定$A$，看$f(B)=\det(AB)$。$AB$的第$j$列是$A\vb b_j$（[矩阵与矩阵乘法](lesson:math.linear-algebra.matrices#def-matrix-product)），它对$\vb b_j$是线性的，$B$有两列相同时$AB$也有两列相同，所以$f$对$B$的各列也满足:term[多重线性]{id="math.linear-algebra.multilinear"}和:term[交错]{id="math.linear-algebra.alternating"}。把[行列式由三条性质确定](lesson:math.linear-algebra.determinant#thm-det-unique)的展开照搬一遍，只是最后不用$\det I=1$，得到$f(B)=f(I)\det B=\det A\det B$。

几何上，先作用$B$，体积放大$|\det B|$倍；再作用$A$，又放大$|\det A|$倍；朝向（orientation）翻两次就翻回来，所以符号也相乘。

::anchor{id="thm-det-invertible"}
**:term[可逆]{id="math.linear-algebra.invertible"}当且仅当行列式不为零**　方阵$A$可逆，当且仅当$\det A\ne0$；可逆时$\det A^{-1}=\frac1{\det A}$。

**证明思路**：可逆时$\det A\det A^{-1}=\det I=1$，所以$\det A\ne0$，并且$\det A^{-1}=\frac1{\det A}$。不可逆时，由[可逆与方程组](lesson:math.linear-algebra.matrix-inverse#thm-invertible)，$A\vb x=\vb 0$有非零解$\vb x$；取$x_j\ne0$，第$j$列就是其余各列的组合$\vb a_j=-\frac1{x_j}\sum_{i\ne j}x_i\vb a_i$，由[行列式：有向面积与体积](lesson:math.linear-algebra.determinant)第 5 题，$\det A=0$。二阶时，这正是[二阶矩阵的逆](lesson:math.linear-algebra.matrix-inverse#thm-two-by-two)里$ad-bc\ne0$的条件。

### 按行展开

::anchor{id="def-cofactor"}
在$n$阶:term[方阵]{id="math.linear-algebra.square-matrix"}$A$里划去第$i$行和第$j$列，剩下的$n-1$阶方阵的:term[行列式]{id="math.linear-algebra.determinant"}叫作$a_{ij}$的:term[余子式]{id="math.linear-algebra.minor"}（minor），记作$M_{ij}$；$C_{ij}=(-1)^{i+j}M_{ij}$叫作$a_{ij}$的:term[代数余子式]{id="math.linear-algebra.cofactor"}（cofactor）。

为什么这样定义：下面的定理把$n$阶行列式化成若干个$n-1$阶的，余子式就是那些小行列式。符号$(-1)^{i+j}$按位置排成棋盘：左上角是$+$，相邻的位置正负相间。边界情况：二阶时$M_{11}=a_{22}$，$C_{12}=-a_{21}$。

::anchor{id="thm-cofactor-expansion"}
**按行展开**　对任何一行$i$，$\det A=a_{i1}C_{i1}+a_{i2}C_{i2}+\dots+a_{in}C_{in}$；按任何一列展开也一样。

**证明思路**：第$i$行是$a_{i1}(1,0,\dots,0)+\dots+a_{in}(0,\dots,0,1)$，由对行的线性，$\det A$是$n$个行列式的组合，第$j$个是把第$i$行换成第$j$个位置为$1$的那一行。把这一行逐次和上面相邻的行交换、换到第一行，再把第$j$列逐次和左边相邻的列交换、换到第一列，共交换$(i-1)+(j-1)$次，符号是$(-1)^{i+j}$。这时第一行是$(1,0,\dots,0)$，把它的倍数从下面各行减去，第一列除了左上角都变成$0$；再按定义展开，第一列只能取左上角的$1$，剩下的正是$M_{ij}$的展开式。

按有许多$0$的行或列展开最省事（例 2）。三阶时按第一行展开，得到的正是[行列式：有向面积与体积](lesson:math.linear-algebra.determinant)里的六项公式。

## 几何图像

:::anim{component="linear-map-2d"}
steps:
  - matrix: [[2, 1], [0, 1]]
    label: |
      先作用$B$，$\det B=2$
  - matrix: [[1, 0], [0, -1.5]]
    label: |
      再作用$A$，$\det A=-1.5$
range: { x: [-1.5, 4.5], y: [-2.5, 2.5] }
show: [grid, square, basis, det]
:::

动画分两步，角上显示当前矩阵的:term[行列式]{id="math.linear-algebra.determinant"}。第一步$B=\begin{pmatrix}2&1\\0&1\end{pmatrix}$把单位正方形变成面积为$2$的平行四边形；第二步$A=\begin{pmatrix}1&0\\0&-1.5\end{pmatrix}$把它上下翻过来、再拉长$1.5$倍，终点的行列式是$-3=\det A\det B$。第二步途中有一刻行列式为零、平面被压成一条线，那是朝向翻转必须经过的时刻。

## 例题

### 例 1　用行变换算四阶行列式

求$\det\begin{pmatrix}1&2&1&0\\2&5&3&1\\1&3&4&2\\0&1&2&4\end{pmatrix}$。

**为什么想到这么做**：$4!=24$项太多；把一行的倍数加到另一行上，:term[行列式]{id="math.linear-algebra.determinant"}不变，化成:term[上三角矩阵]{id="math.linear-algebra.upper-triangular-matrix"}后乘出主对角线。

**推导**：做$R_2-2R_1$、$R_3-R_1$，第二到四行变成$(0,1,1,1)$、$(0,1,3,2)$、$(0,1,2,4)$；再做$R_3-R_2$、$R_4-R_2$，得$(0,0,2,1)$、$(0,0,1,3)$；最后做$R_4-\frac12R_3$，第四行是$(0,0,0,\frac52)$。用的都是「一行的倍数加到另一行」，行列式不变，等于$1\cdot1\cdot2\cdot\frac52=5$。

### 例 2　按有许多零的行展开

求$\det\begin{pmatrix}2&0&1&0\\1&3&0&2\\0&0&4&0\\1&1&0&1\end{pmatrix}$。

**为什么想到这么做**：第三行只有一个数不为零，按这一行展开只剩一项，再算一个三阶:term[行列式]{id="math.linear-algebra.determinant"}。

**推导**：按第三行展开，$\det A=4\cdot C_{33}=4\cdot(-1)^{3+3}M_{33}$，划去第三行、第三列得$M_{33}=\det\begin{pmatrix}2&0&0\\1&3&2\\1&1&1\end{pmatrix}$。它的第一行只有$2$不为零，再按第一行展开，$M_{33}=2\cdot(3\cdot1-2\cdot1)=2$。所以$\det A=4\cdot2=8$。

## 常见误区

- 「做:term[初等行变换]{id="math.linear-algebra.elementary-row-operation"}不改变:term[行列式]{id="math.linear-algebra.determinant"}。」只有「一行的倍数加到另一行」不改变；交换两行要变号，一行乘以$c$要把行列式乘以$c$。
- 「$\det(A+B)=\det A+\det B$，$\det(cA)=c\det A$。」行列式对乘法友好：$\det(AB)=\det A\det B$；对加法不是，$n$阶时$\det(cA)=c^n\det A$。
- 「$AB\ne BA$，所以$\det(AB)$和$\det(BA)$也可能不同。」两者都等于$\det A\det B$，一定相同。
- 「按行展开时，:term[代数余子式]{id="math.linear-algebra.cofactor"}就是:term[余子式]{id="math.linear-algebra.minor"}。」还要乘$(-1)^{i+j}$，例如$a_{12}$的代数余子式是$-M_{12}$。

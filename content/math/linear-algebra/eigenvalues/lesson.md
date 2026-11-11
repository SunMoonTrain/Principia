---
id: math.linear-algebra.eigenvalues
title: |
  特征值与特征向量
goal: |
  会由特征多项式求矩阵的特征值，并求出对应的特征向量。
prerequisites: [math.linear-algebra.determinant-properties, math.linear-algebra.column-null-space]
minutes: 35
summary: |
  $A\vb v=\lambda\vb v$的方向只被伸缩；特征值是$\det(A-\lambda I)$的根。
status: reviewed
---

## 这一节要回答的问题

[线性变换及其矩阵](lesson:math.linear-algebra.linear-maps)里，矩阵$A$把平面上的向量又拉又转，大多数向量的方向都变了。有没有一些方向，$A$只把它们伸长、缩短或反向，不转动？沿着这样的方向，$A$的作用就是乘一个数，反复作用$A$这样的计算会一下子变得简单。怎样把这些方向和对应的数找出来？

## 讲解

### 特征值与特征向量

先看一个例子。$A=\begin{pmatrix}2&1\\1&2\end{pmatrix}$把$(1,0)$变成$(2,1)$，方向变了；可它把$(1,1)$变成$(3,3)=3(1,1)$，把$(1,-1)$变成$(1,-1)$。也就是说，沿$(1,1)$的过原点的直线被送回自己，线上每个向量都变成原来的$3$倍；沿$(1,-1)$的直线上，每个向量都不动。

::anchor{id="def-eigen"}
设$A$是$n$阶:term[方阵]{id="math.linear-algebra.square-matrix"}（square matrix）。如果数$\lambda$和非零向量$\vb v$满足$A\vb v=\lambda\vb v$，就说$\lambda$是$A$的:term[特征值]{id="math.linear-algebra.eigenvalue"}（eigenvalue），$\vb v$是$A$属于$\lambda$的:term[特征向量]{id="math.linear-algebra.eigenvector"}（eigenvector）。

为什么这样定义：$A\vb v=\lambda\vb v$说的是，$A$把$\vb v$所在的过原点的直线送回这条直线，在这条直线上，$A$的作用就是乘$\lambda$。要求$\vb v\ne\vb 0$，因为$A\vb 0=\lambda\vb 0$对任何$\lambda$都成立，什么也说明不了；特征值却可以是$0$，$A\vb v=\vb 0$有非零解，正是$A$不:term[可逆]{id="math.linear-algebra.invertible"}（invertible）的时候。反例：逆时针转$90^\circ$的:term[旋转矩阵]{id="math.linear-algebra.rotation-matrix"}（rotation matrix）$\begin{pmatrix}0&-1\\1&0\end{pmatrix}$把每个非零向量都转了方向，没有实数的特征值；它的特征值是复数，见以后的[复特征值与旋转](lesson:math.linear-algebra.complex-eigenvalues)。

### 特征多项式

怎样找:term[特征值]{id="math.linear-algebra.eigenvalue"}？$A\vb v=\lambda\vb v$可以写成$(A-\lambda I)\vb v=\vb 0$，其中$I$是$n$阶:term[单位矩阵]{id="math.linear-algebra.identity-matrix"}（identity matrix）。所以$\lambda$是特征值，当且仅当:term[齐次线性方程组]{id="math.linear-algebra.homogeneous-system"}（homogeneous linear system）$(A-\lambda I)\vb x=\vb 0$有非零解，也就是$A-\lambda I$不:term[可逆]{id="math.linear-algebra.invertible"}；由[可逆当且仅当行列式不为零](lesson:math.linear-algebra.determinant-properties#thm-det-invertible)，这又等价于$\det(A-\lambda I)=0$。

::anchor{id="def-characteristic-polynomial"}
$\det(A-\lambda I)$是$\lambda$的$n$次多项式，叫作$A$的:term[特征多项式]{id="math.linear-algebra.characteristic-polynomial"}（characteristic polynomial）。$A$的特征值正是特征多项式的根；属于特征值$\lambda$的:term[特征向量]{id="math.linear-algebra.eigenvector"}就是$(A-\lambda I)\vb x=\vb 0$的非零解，它们连同$\vb 0$组成:term[零空间]{id="math.linear-algebra.null-space"}（null space）$N(A-\lambda I)$，叫作$A$属于$\lambda$的:term[特征空间]{id="math.linear-algebra.eigenspace"}（eigenspace）。

为什么这样定义：$\det(A-\lambda I)$按[行列式由三条性质确定](lesson:math.linear-algebra.determinant#thm-det-unique)里的展开式写开，每一项是$n$个元素之积，每个元素最多含一个$\lambda$，所以它是$\lambda$的多项式。只有主对角线（main diagonal）上的元素之积$(a_{11}-\lambda)\cdots(a_{nn}-\lambda)$含$\lambda^n$，别的项最多含$n-2$个主对角元（diagonal entries），所以次数正好是$n$，$n$阶:term[方阵]{id="math.linear-algebra.square-matrix"}最多有$n$个不同的特征值。特征空间是零空间，因而是:term[子空间]{id="math.linear-algebra.subspace"}（subspace），求特征向量就是求它的一组:term[基]{id="math.linear-algebra.basis"}（basis），做法见[零空间的基](lesson:math.linear-algebra.column-null-space#thm-null-basis)。边界情况：$\lambda$不是特征值时，$N(A-\lambda I)=\{\vb 0\}$。

所以求特征值和特征向量分两步：先解方程$\det(A-\lambda I)=0$，求出全部特征值；再对每个特征值$\lambda$，把$A-\lambda I$化成:term[行阶梯形]{id="math.linear-algebra.row-echelon-form"}（row echelon form），求$N(A-\lambda I)$的一组基（例 1、例 2）。由[三角矩阵的行列式](lesson:math.linear-algebra.determinant-properties#thm-triangular)，:term[上三角矩阵]{id="math.linear-algebra.upper-triangular-matrix"}（upper triangular matrix）的特征多项式是$(a_{11}-\lambda)\cdots(a_{nn}-\lambda)$，特征值就是主对角元。

### 迹与特征值之和

二阶时可以直接写出来：$A=\begin{pmatrix}a&b\\c&d\end{pmatrix}$时，$\det(A-\lambda I)=(a-\lambda)(d-\lambda)-bc$，展开是$\lambda^2-(a+d)\lambda+(ad-bc)$。一次项的系数来自主对角元之和，常数项是$\det A$。

::anchor{id="def-trace"}
:term[方阵]{id="math.linear-algebra.square-matrix"}$A$的主对角元之和$a_{11}+a_{22}+\dots+a_{nn}$叫作$A$的:term[迹]{id="math.linear-algebra.trace"}（trace），记作$\tr A$。

为什么这样定义：迹和:term[行列式]{id="math.linear-algebra.determinant"}（determinant）一样，是由矩阵算出的一个数，而且两者都藏在:term[特征多项式]{id="math.linear-algebra.characteristic-polynomial"}的系数里（下面的定理）。迹只看主对角线，非对角元取什么都不影响，例如$\begin{pmatrix}1&5\\-3&2\end{pmatrix}$的迹是$3$。边界情况：$\tr I=n$；迹对矩阵是线性的，$\tr(A+B)=\tr A+\tr B$，$\tr(cA)=c\tr A$。

::anchor{id="thm-trace-det"}
**:term[特征值]{id="math.linear-algebra.eigenvalue"}之和与积**　二阶方阵的特征多项式是$\lambda^2-(\tr A)\lambda+\det A$。一般地，若$n$阶方阵$A$的特征多项式能写成$(-1)^n(\lambda-\lambda_1)\cdots(\lambda-\lambda_n)$（$\lambda_i$可以相同，也可以是复数），则$\lambda_1+\dots+\lambda_n=\tr A$，$\lambda_1\lambda_2\cdots\lambda_n=\det A$。

**证明思路**：常数项是$\lambda=0$时的值$\det A$；另一边，$\lambda=0$时$(-1)^n(0-\lambda_1)\cdots(0-\lambda_n)=\lambda_1\cdots\lambda_n$，所以积等于$\det A$。$\lambda^{n-1}$只能来自主对角元之积$(a_{11}-\lambda)\cdots(a_{nn}-\lambda)$，系数是$(-1)^{n-1}(a_{11}+\dots+a_{nn})$；而$(-1)^n(\lambda-\lambda_1)\cdots(\lambda-\lambda_n)$里这个系数是$(-1)^{n-1}(\lambda_1+\dots+\lambda_n)$，比较即得。在复数范围内，特征多项式总能这样分解（这是代数基本定理，fundamental theorem of algebra，这里不证）。

二阶时，它正是一元二次方程根与系数的关系：两个特征值之和是$\tr A$，积是$\det A$。所以只看迹和行列式，就能写出二阶矩阵的特征多项式，判断它有没有实数的特征值、有没有重根。

### 代数重数与几何重数

:term[特征多项式]{id="math.linear-algebra.characteristic-polynomial"}可能有重根。$B=\begin{pmatrix}2&1\\0&2\end{pmatrix}$的特征多项式是$(2-\lambda)^2$，:term[特征值]{id="math.linear-algebra.eigenvalue"}$2$是二重根；可$B-2I=\begin{pmatrix}0&1\\0&0\end{pmatrix}$的:term[零空间]{id="math.linear-algebra.null-space"}只由$(1,0)$:term[生成]{id="math.linear-algebra.span"}（span），:term[特征向量]{id="math.linear-algebra.eigenvector"}只有一个方向。$2I$的特征值也只有二重的$2$，每个非零向量却都是它的特征向量。

::anchor{id="def-multiplicity"}
特征值$\lambda_0$作为特征多项式的根的重数，叫作它的:term[代数重数]{id="math.linear-algebra.algebraic-multiplicity"}（algebraic multiplicity）；:term[特征空间]{id="math.linear-algebra.eigenspace"}$N(A-\lambda_0I)$的:term[维数]{id="math.linear-algebra.dimension"}（dimension），叫作它的:term[几何重数]{id="math.linear-algebra.geometric-multiplicity"}（geometric multiplicity）。

为什么这样定义：代数重数数的是特征多项式里因子$\lambda-\lambda_0$出现几次，几何重数数的是属于$\lambda_0$的:term[线性无关]{id="math.linear-algebra.linearly-independent"}（linearly independent）的特征向量最多有几个。上面的$B$，特征值$2$的代数重数是$2$、几何重数只有$1$；$2I$的两个重数都是$2$。几何重数至少是$1$，因为特征值总有特征向量；以后在[对角化](lesson:math.linear-algebra.diagonalization)里会证明它不超过代数重数，并看到两者相等与否，决定了矩阵能不能化成对角的样子。

## 几何图像

:::anim{component="linear-map-2d"}
matrix: [[2, 1], [k, 2]]
range: { x: [-4.5, 4.5], y: [-4.5, 4.5] }
show: [grid, basis, eigen]
sliders:
  - name: k
    min: -1
    max: 4
    step: 0.25
    default: 1
    label: |
      $k$
:::

动画从:term[单位矩阵]{id="math.linear-algebra.identity-matrix"}变到$A=\begin{pmatrix}2&1\\k&2\end{pmatrix}$，虚线是$A$的:term[特征向量]{id="math.linear-algebra.eigenvector"}所在的直线。$A\vb v=\lambda\vb v$时，插值途中的矩阵也满足$\bigl((1-s)I+sA\bigr)\vb v=(1-s+s\lambda)\vb v$，所以虚线上的点一直留在线上，只被拉长、缩短；别的点都离开了原来的直线。

拖动$k$：$k>0$时有两条虚线，$k=1$时就是开头那个例子；$k=0$时只剩一条，这时的$A$就是上面的$B$；$k<0$时一条也没有，每个非零向量都被转了方向。$k=4$时$\det A=0$，:term[特征值]{id="math.linear-algebra.eigenvalue"}$0$那条虚线上的点最后都被压到原点。

## 例题

### 例 1　二阶矩阵的特征值与特征向量

求$A=\begin{pmatrix}4&-2\\1&1\end{pmatrix}$的:term[特征值]{id="math.linear-algebra.eigenvalue"}和:term[特征向量]{id="math.linear-algebra.eigenvector"}。

**为什么想到这么做**：二阶时由:term[迹]{id="math.linear-algebra.trace"}和:term[行列式]{id="math.linear-algebra.determinant"}直接写出:term[特征多项式]{id="math.linear-algebra.characteristic-polynomial"}，求出两个根；再对每个特征值解$(A-\lambda I)\vb x=\vb 0$。

**推导**：$\tr A=5$，$\det A=4+2=6$，特征多项式是$\lambda^2-5\lambda+6=(\lambda-2)(\lambda-3)$，特征值是$2$、$3$。$\lambda=2$时，$A-2I=\begin{pmatrix}2&-2\\1&-1\end{pmatrix}$，两行都给出$x_1=x_2$，特征向量是$(1,1)$的非零倍数；$\lambda=3$时，$A-3I=\begin{pmatrix}1&-2\\1&-2\end{pmatrix}$，给出$x_1=2x_2$，特征向量是$(2,1)$的非零倍数。验算：$A(1,1)=(2,2)$，$A(2,1)=(6,3)$；两个特征值之和$5$、积$6$，正是迹和行列式。

### 例 2　三阶矩阵与二维的特征空间

求$A=\begin{pmatrix}2&1&1\\1&2&1\\1&1&2\end{pmatrix}$的:term[特征值]{id="math.linear-algebra.eigenvalue"}，以及每个特征值的:term[代数重数]{id="math.linear-algebra.algebraic-multiplicity"}和:term[几何重数]{id="math.linear-algebra.geometric-multiplicity"}。

**为什么想到这么做**：每一行的三个数加起来都是$4$，所以$A(1,1,1)=4(1,1,1)$，$4$是一个特征值。算$\det(A-\lambda I)$时，把第二、三列加到第一列，第一列的三个数都成了$4-\lambda$，可以提出这个公因子。

**推导**：提出$4-\lambda$以后，第一列全是$1$；再把第二、三行各减去第一行，得到:term[上三角矩阵]{id="math.linear-algebra.upper-triangular-matrix"}，主对角元是$1$、$1-\lambda$、$1-\lambda$，所以$\det(A-\lambda I)=(4-\lambda)(1-\lambda)^2$。特征值$4$的代数重数是$1$，:term[特征向量]{id="math.linear-algebra.eigenvector"}是$(1,1,1)$的非零倍数；特征值$1$的代数重数是$2$，$A-I$的元素都是$1$，$N(A-I)$由$x_1+x_2+x_3=0$给出，一组:term[基]{id="math.linear-algebra.basis"}是$(-1,1,0)$、$(-1,0,1)$，几何重数是$2$。验算：$4+1+1=6=\tr A$，$4\cdot1\cdot1=4=\det A$。

## 常见误区

- 「:term[特征向量]{id="math.linear-algebra.eigenvector"}可以是:term[零向量]{id="math.linear-algebra.zero-vector"}（zero vector）。」$A\vb 0=\lambda\vb 0$对每个$\lambda$都成立，所以定义里要求$\vb v\ne\vb 0$；:term[特征值]{id="math.linear-algebra.eigenvalue"}倒可以是$0$。
- 「:term[初等行变换]{id="math.linear-algebra.elementary-row-operation"}（elementary row operations）不改变特征值。」$\begin{pmatrix}1&1\\1&1\end{pmatrix}$的特征值是$0$、$2$，化成:term[行阶梯形]{id="math.linear-algebra.row-echelon-form"}$\begin{pmatrix}1&1\\0&0\end{pmatrix}$以后，特征值成了$1$、$0$。行变换保持的是方程组的解，不是特征值。
- 「特征值相同，特征向量也相同。」$\begin{pmatrix}3&0\\0&1\end{pmatrix}$和$\begin{pmatrix}3&2\\0&1\end{pmatrix}$的特征值都是$3$、$1$，属于$1$的特征向量，前一个是$(0,1)$的倍数，后一个是$(1,-1)$的倍数。
- 「实矩阵总有实数的特征值。」$\begin{pmatrix}1&-1\\1&1\end{pmatrix}$的:term[特征多项式]{id="math.linear-algebra.characteristic-polynomial"}是$\lambda^2-2\lambda+2$，判别式小于零，没有实数根。

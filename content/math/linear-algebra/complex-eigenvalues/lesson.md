---
id: math.linear-algebra.complex-eigenvalues
title: |
  复特征值与旋转
goal: |
  会求实矩阵的复特征值，并把对应的变换看成旋转加伸缩。
prerequisites: [math.linear-algebra.diagonalization, math.complex-analysis.complex-numbers]
minutes: 30
summary: |
  实矩阵的复特征值成对出现；在适当的实基下，矩阵是旋转加伸缩。
status: reviewed
---

## 这一节要回答的问题

逆时针转$90^\circ$的:term[旋转矩阵]{id="math.linear-algebra.rotation-matrix"}（rotation matrix）$\begin{pmatrix}0&-1\\1&0\end{pmatrix}$，:term[特征多项式]{id="math.linear-algebra.characteristic-polynomial"}（characteristic polynomial）是$\lambda^2+1$，没有实数根，也就没有实数的:term[特征值]{id="math.linear-algebra.eigenvalue"}（eigenvalue）。在复数范围里，它有两个根$\pm i$。这样的复特征值说明了实矩阵的什么性质？

## 讲解

### 复特征值成对出现

把数和向量的:term[分量]{id="math.linear-algebra.component"}（component）都放宽到复数，[特征值与特征向量](lesson:math.linear-algebra.eigenvalues#def-eigen)的定义一字不改：复数$\lambda$和分量是复数的非零向量$\vb v$满足$A\vb v=\lambda\vb v$，就说$\lambda$是$A$的:term[特征值]{id="math.linear-algebra.eigenvalue"}，$\vb v$是:term[特征向量]{id="math.linear-algebra.eigenvector"}（eigenvector）。[抽象向量空间](lesson:math.linear-algebra.vector-spaces)里说过，把实数换成复数，:term[向量空间]{id="math.linear-algebra.vector-space"}（vector space）的定义和前面的定理照样成立，求法也还是解$\det(A-\lambda I)=0$、再解$(A-\lambda I)\vb x=\vb 0$。复数范围内:term[特征多项式]{id="math.linear-algebra.characteristic-polynomial"}总有根，所以$n$阶:term[方阵]{id="math.linear-algebra.square-matrix"}（square matrix）总有特征值。

例如$A=\begin{pmatrix}1&-1\\1&1\end{pmatrix}$，特征多项式$\lambda^2-2\lambda+2$的根是$1\pm i$。$\lambda=1+i$时，$A-\lambda I$的第一行是$(-i,-1)$，给出$x_2=-ix_1$，特征向量取$(1,-i)$；$\lambda=1-i$时，同样得到$(1,i)$，正是前一个的各分量取共轭。

::anchor{id="thm-conjugate-pairs"}
**复特征值成对出现**　设$A$是实矩阵。若复数$\lambda$是$A$的特征值，$\vb v$是属于它的特征向量，则共轭$\bar\lambda$也是$A$的特征值，$\bar{\vb v}$（各分量取共轭）是属于$\bar\lambda$的特征向量。

**证明思路**：$A$的元素都是实数，取共轭不变，所以$A\bar{\vb v}=\overline{A\vb v}=\overline{\lambda\vb v}=\bar\lambda\bar{\vb v}$，而$\bar{\vb v}\ne\vb 0$。也可以从特征多项式看：它的系数都是实数，复数根和它的共轭总是同时是根。

### 在实基下：旋转加伸缩

把复数$z=x+iy$看成平面上的点$(x,y)$，乘以复数$a+bi$就是$(x,y)\mapsto(ax-by,\ bx+ay)$，矩阵是$\begin{pmatrix}a&-b\\b&a\end{pmatrix}$。写$a+bi=r(\cos\theta+i\sin\theta)$，$r=\sqrt{a^2+b^2}$，这个矩阵就是$r\begin{pmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{pmatrix}$：先逆时针转$\theta$，再把每个向量变成原来的$r$倍。它的:term[特征值]{id="math.linear-algebra.eigenvalue"}正是$a\pm bi$。

::anchor{id="thm-rotation-scaling"}
**旋转加伸缩**　设二阶实矩阵$A$有特征值$\lambda=a+bi$，$b\ne0$，属于它的:term[特征向量]{id="math.linear-algebra.eigenvector"}是$\vb v=\vb x+i\vb y$，$\vb x$、$\vb y$是实向量。则$\vb y$、$\vb x$:term[线性无关]{id="math.linear-algebra.linearly-independent"}（linearly independent）；以它们为两列的$P=(\vb y\ \ \vb x)$:term[可逆]{id="math.linear-algebra.invertible"}（invertible），并且$P^{-1}AP=\begin{pmatrix}a&-b\\b&a\end{pmatrix}$。

**证明思路**：比较$A(\vb x+i\vb y)=(a+bi)(\vb x+i\vb y)$两边的实部和虚部，得$A\vb x=a\vb x-b\vb y$，$A\vb y=b\vb x+a\vb y$。在:term[基]{id="math.linear-algebra.basis"}（basis）$\vb y$、$\vb x$下，$A\vb y$的坐标是$(a,b)$，$A\vb x$的坐标是$(-b,a)$，正是右边的矩阵（[换基时算子的矩阵怎样变](lesson:math.linear-algebra.similarity#thm-change-operator)）。若$\vb y$、$\vb x$:term[线性相关]{id="math.linear-algebra.linearly-dependent"}（linearly dependent），$\vb v$就是某个实向量$\vb u$的复数倍，$A\vb u=\lambda\vb u$左边是实向量，$\lambda$只能是实数，矛盾。

所以复特征值的二阶实矩阵，在实基$\vb y$、$\vb x$下就是旋转$\theta$加伸缩$r$倍，$r=|\lambda|$，$\theta$是$\lambda$的辐角（argument）。在原来的坐标里看，$P$把圆变成椭圆，反复作用$A$时，点沿着椭圆转（例 2），$r>1$时一圈圈向外，$r<1$时一圈圈向里。

## 几何图像

:::anim{component="linear-map-2d"}
matrix: [[a, -b], [b, a]]
range: { x: [-3, 3], y: [-3, 3] }
show: [grid, basis, circle]
sliders:
  - name: a
    min: -1.5
    max: 1.5
    step: 0.25
    default: 1
    label: |
      $a$
  - name: b
    min: -1.5
    max: 1.5
    step: 0.25
    default: 1
    label: |
      $b$
:::

动画作用的是$\begin{pmatrix}a&-b\\b&a\end{pmatrix}$，它的:term[特征值]{id="math.linear-algebra.eigenvalue"}是$a\pm bi$。比较开头和结尾：网格转了$\theta$，单位圆变成半径为$r=\sqrt{a^2+b^2}$的圆，两个基向量的:term[像]{id="math.linear-algebra.image"}（image）仍然一样长、互相垂直。插值途中的矩阵也是这种形状，只是$a$、$b$换成了别的数，所以网格一直是正方形；转的角度和伸缩的倍数不是均匀变的，默认的$a=b=1$时图形一边转一边变大，$a<1$时图形中途会先缩小。$b=0$时特征值是实数，矩阵是$aI$，只伸缩、不转动。

## 例题

### 例 1　旋转$45^\circ$再伸缩

求$A=\begin{pmatrix}1&-1\\1&1\end{pmatrix}$的:term[特征值]{id="math.linear-algebra.eigenvalue"}，并说明这个变换是哪个旋转加哪个伸缩。

**为什么想到这么做**：$A$已经是$\begin{pmatrix}a&-b\\b&a\end{pmatrix}$的样子，$a=b=1$，直接把$1+i$写成$r(\cos\theta+i\sin\theta)$。

**推导**：特征值是$1\pm i$（上面算过）。$|1+i|=\sqrt2$，辐角是$45^\circ$，所以$A=\sqrt2\begin{pmatrix}\cos45^\circ&-\sin45^\circ\\\sin45^\circ&\cos45^\circ\end{pmatrix}$：逆时针转$45^\circ$，每个向量再变成原来的$\sqrt2$倍。作用$8$次，转满一圈，每个向量变成原来的$16$倍，所以$A^8=16I$。

### 例 2　斜着的旋转

$A=\begin{pmatrix}1&-2\\1&-1\end{pmatrix}$。求它的:term[特征值]{id="math.linear-algebra.eigenvalue"}，找一组:term[实基]{id="math.linear-algebra.basis"}，使$A$在这组基下是旋转加伸缩，并说明反复作用$A$时，点怎样运动。

**为什么想到这么做**：:term[迹]{id="math.linear-algebra.trace"}（trace）是$0$、:term[行列式]{id="math.linear-algebra.determinant"}（determinant）是$1$，:term[特征多项式]{id="math.linear-algebra.characteristic-polynomial"}$\lambda^2+1$，特征值$\pm i$；取属于$i$的:term[特征向量]{id="math.linear-algebra.eigenvector"}的实部、虚部，按定理排成$P$。

**推导**：$A-iI$的第二行是$(1,-1-i)$，给出$x_1=(1+i)x_2$，特征向量取$(1+i,1)=(1,1)+i(1,0)$，$\vb x=(1,1)$，$\vb y=(1,0)$。$P=(\vb y\ \ \vb x)=\begin{pmatrix}1&1\\0&1\end{pmatrix}$，$P^{-1}AP=\begin{pmatrix}0&-1\\1&0\end{pmatrix}$：在这组基下就是转$90^\circ$，$r=1$。验算：$A\vb y=(1,1)=\vb x$，$A\vb x=(-1,0)=-\vb y$。所以$A^2=-I$、$A^4=I$，反复作用$A$时，每个点沿一个椭圆每次走四分之一圈，四次回到原处。

## 常见误区

- 「实矩阵的:term[特征向量]{id="math.linear-algebra.eigenvector"}都是实向量。」属于:term[复特征值]{id="math.linear-algebra.eigenvalue"}的特征向量，:term[分量]{id="math.linear-algebra.component"}必定有复数；若是实向量$\vb u$，$A\vb u=\lambda\vb u$就会让$\lambda$成为实数。
- 「特征值$a+bi$的实部是伸缩的倍数，虚部是转的角度。」伸缩倍数是模（modulus）$r=\sqrt{a^2+b^2}$，角度是辐角$\theta$；例 1 里$a=b=1$，倍数却是$\sqrt2$、角度是$45^\circ$。
- 「有复特征值的矩阵就是:term[旋转矩阵]{id="math.linear-algebra.rotation-matrix"}。」只有换到:term[实基]{id="math.linear-algebra.basis"}$\vb y$、$\vb x$以后才是旋转加伸缩；在原来的坐标里，点沿椭圆运动，例 2 的$A$就不是旋转矩阵。

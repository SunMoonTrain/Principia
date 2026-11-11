---
id: math.linear-algebra.rank-nullity
title: |
  秩与秩-零化度定理
goal: |
  会求矩阵的秩，并用秩-零化度定理（秩与零空间维数之和等于列数）分析方程组的解。
prerequisites: [math.linear-algebra.column-null-space]
minutes: 30
summary: |
  秩是主元个数，秩与零化度之和等于列数。
status: reviewed
---

## 这一节要回答的问题

[列空间与零空间](lesson:math.linear-algebra.column-null-space)的最后说，$\dim C(A)+\dim N(A)$等于列数：:term[列空间]{id="math.linear-algebra.column-space"}（column space）越大，:term[零空间]{id="math.linear-algebra.null-space"}（null space）就越小。$\dim C(A)$这个数说的是什么？矩阵的各行:term[生成]{id="math.linear-algebra.span"}（span）的:term[子空间]{id="math.linear-algebra.subspace"}（subspace），:term[维数]{id="math.linear-algebra.dimension"}（dimension）又是多少？怎样用它一眼看出方程组有没有解、有多少解？

## 讲解

### 秩与零化度

::anchor{id="def-rank"}
矩阵$A$的:term[列空间]{id="math.linear-algebra.column-space"}的:term[维数]{id="math.linear-algebra.dimension"}叫作$A$的:term[秩]{id="math.linear-algebra.rank"}（rank），记作$\rank A$；:term[零空间]{id="math.linear-algebra.null-space"}的维数叫作$A$的:term[零化度]{id="math.linear-algebra.nullity"}（nullity）。

为什么这样定义：由[列空间的基](lesson:math.linear-algebra.column-null-space#thm-column-basis)，$\rank A$等于把$A$化成:term[行阶梯形]{id="math.linear-algebra.row-echelon-form"}（row echelon form）后:term[主元]{id="math.linear-algebra.pivot"}（pivot）的个数，零化度等于:term[自由变量]{id="math.linear-algebra.free-variable"}（free variable）的个数。秩说的是$A\vb x$能到达多少个独立的方向，零化度说的是有多少个独立的方向被压成$\vb 0$。边界情况：:term[零矩阵]{id="math.linear-algebra.zero-matrix"}（zero matrix）的秩是$0$；$m\times n$矩阵每行、每列至多一个主元，所以秩既不超过$m$，也不超过$n$。

::anchor{id="thm-rank-nullity"}
**秩与零化度之和**　$m\times n$矩阵$A$满足$\rank A+\dim N(A)=n$，这叫作:term[秩-零化度定理]{id="math.linear-algebra.rank-nullity-theorem"}（rank–nullity theorem）。

**证明思路**：化成行阶梯形以后，每一列要么有主元，要么对应一个自由变量，两者必居其一。主元个数是秩，自由变量个数是零化度，合起来正好是列数$n$。

这个等式把两件看起来无关的事绑在了一起：未知数个数$n$一定时，$A$能到达的方向越多，被压成$\vb 0$的方向就越少。

### 行秩等于列秩

::anchor{id="def-row-space"}
把$m\times n$矩阵$A$的各行看成$\R^n$里的向量，它们:term[生成]{id="math.linear-algebra.span"}的:term[子空间]{id="math.linear-algebra.subspace"}叫作$A$的行空间（row space）。

为什么这样定义：方程组$A\vb x=\vb b$的每个方程对应$A$的一行，行空间里的向量对应由这些方程「加减」得到的新方程。:term[初等行变换]{id="math.linear-algebra.elementary-row-operation"}（elementary row operations）把每一行换成各行的:term[线性组合]{id="math.linear-algebra.linear-combination"}（linear combination），而且能倒回去，所以不改变行空间。边界情况：行空间和:term[列空间]{id="math.linear-algebra.column-space"}一般不是同一个子空间，$m\ne n$时连所在的空间都不同。

::anchor{id="thm-row-rank"}
**:term[行秩]{id="math.linear-algebra.rank"}（row rank）等于列秩（column rank）**　行空间的:term[维数]{id="math.linear-algebra.dimension"}等于$\rank A$。所以一个矩阵的行里最多有几个:term[线性无关]{id="math.linear-algebra.linearly-independent"}（linearly independent），列里也就最多有几个。

**证明思路**：行变换不改变行空间，所以只看化成的:term[行阶梯形]{id="math.linear-algebra.row-echelon-form"}。它的非零行生成行空间；它们又线性无关：设一个组合等于零，看第一个:term[主元]{id="math.linear-algebra.pivot"}所在的列，只有第一行在那里不为零，所以第一行的系数是$0$，再看第二个主元所在的列，依此类推。非零行的个数就是主元的个数，即$\rank A$。

### 用秩看方程组

::anchor{id="thm-rank-solvability"}
**判断方程组的解**　设$A$是$m\times n$矩阵。$A\vb x=\vb b$有解，当且仅当$\rank A=\rank(A\mid\vb b)$；有解时，:term[解集]{id="math.linear-algebra.solution-set"}（solution set）是一个:term[特解]{id="math.linear-algebra.particular-solution"}（particular solution）加上$n-\rank A$维的:term[零空间]{id="math.linear-algebra.null-space"}，所以$\rank A=n$时解唯一。$A\vb x=\vb b$对每个$\vb b$都有解，当且仅当$\rank A=m$。

**证明思路**：化成:term[行阶梯形]{id="math.linear-algebra.row-echelon-form"}，无解恰好是:term[增广矩阵]{id="math.linear-algebra.augmented-matrix"}（augmented matrix）多出一行$(0\ \cdots\ 0\mid c)$、$c\ne0$，:term[主元]{id="math.linear-algebra.pivot"}多了一个（[解的三种情况](lesson:math.linear-algebra.linear-systems#thm-three-cases)）。有解时解集是特解加零空间，零空间的:term[维数]{id="math.linear-algebra.dimension"}由:term[秩-零化度定理]{id="math.linear-algebra.rank-nullity-theorem"}得出。$\rank A=m$即每一行都有主元，由[生成整个$\R^n$](lesson:math.linear-algebra.span-subspaces#thm-span-rn)，$A$的各列:term[生成]{id="math.linear-algebra.span"}$\R^m$。

:term[方阵]{id="math.linear-algebra.square-matrix"}（square matrix）$m=n$时，「对每个$\vb b$有解」和「解唯一」都等价于$\rank A=n$，这正是[方程个数等于未知数个数时](lesson:math.linear-algebra.linear-systems#thm-square)的定理。

## 几何图像

:::anim{component="linear-map-2d"}
matrix: [[2, 1], [s, 1]]
range: { x: [-2, 4], y: [-2.5, 4.5] }
show: [grid, square, basis]
vectors:
  - x: 1
    y: -2
    label: |
      $(1,-2)$
sliders:
  - name: s
    min: 0
    max: 3
    step: 0.5
    default: 1
    label: |
      $s$
:::

动画把每个$\vb x$慢慢送到$A\vb x$，$A=\begin{pmatrix}2&1\\s&1\end{pmatrix}$（把矩阵看成变换，见[线性变换及其矩阵](lesson:math.linear-algebra.linear-maps)）。$s\ne2$时两列不:term[平行]{id="math.linear-algebra.parallel"}（parallel），:term[秩]{id="math.linear-algebra.rank"}是$2$，:term[列空间]{id="math.linear-algebra.column-space"}是整个平面，:term[零空间]{id="math.linear-algebra.null-space"}只有原点，$2+0=2$。拖到$s=2$，两列$(2,2)$、$(1,1)$平行，秩是$1$，平面被压到直线$y=x$上，$(1,-2)$被送到原点，零空间是它:term[生成]{id="math.linear-algebra.span"}的直线，$1+1=2$。动画的中途只是从$I$到$A$的过渡，看终点就行。

## 例题

### 例 1　求秩和零化度

求$A=\begin{pmatrix}1&2&1&0&3\\2&4&3&1&7\\1&2&2&1&4\end{pmatrix}$的:term[秩]{id="math.linear-algebra.rank"}、:term[零化度]{id="math.linear-algebra.nullity"}和行空间的一组:term[基]{id="math.linear-algebra.basis"}（basis）。

**为什么想到这么做**：化成:term[行阶梯形]{id="math.linear-algebra.row-echelon-form"}，数:term[主元]{id="math.linear-algebra.pivot"}；零化度用:term[秩-零化度定理]{id="math.linear-algebra.rank-nullity-theorem"}得出；非零行就是行空间的基。

**推导**：做$R_2-2R_1$、$R_3-R_1$，第二、三行都变成$(0,0,1,1,1)$；再做$R_3-R_2$，第三行全是零。主元在第一、三列，$\rank A=2$，零化度是$5-2=3$（:term[自由变量]{id="math.linear-algebra.free-variable"}$x_2$、$x_4$、$x_5$，正好$3$个）。行空间的一组基是$(1,2,1,0,3)$、$(0,0,1,1,1)$，:term[维数]{id="math.linear-algebra.dimension"}也是$2$。

### 例 2　带参数的方程组

$a$、$b$取什么值时，方程组$x_1+x_2+x_3=1$、$x_1+2x_2+3x_3=2$、$2x_1+3x_2+ax_3=b$无解、有唯一解、有无穷多个解？

**为什么想到这么做**：化成:term[行阶梯形]{id="math.linear-algebra.row-echelon-form"}，比较:term[系数矩阵]{id="math.linear-algebra.coefficient-matrix"}（coefficient matrix）和:term[增广矩阵]{id="math.linear-algebra.augmented-matrix"}（augmented matrix）的:term[秩]{id="math.linear-algebra.rank"}。

**推导**：做$R_2-R_1$得$(0,1,2\mid1)$，$R_3-2R_1$得$(0,1,a-2\mid b-2)$，再做$R_3-R_2$得$(0,0,a-4\mid b-3)$。$a\ne4$时两个秩都是$3$，有唯一解。$a=4$、$b\ne3$时$\rank A=2$而增广矩阵的秩是$3$，无解；$a=4$、$b=3$时两个秩都是$2$，有无穷多个解，:term[解集]{id="math.linear-algebra.solution-set"}是$3-2=1$维的，一条直线。

## 常见误区

- 「:term[秩]{id="math.linear-algebra.rank"}就是非零行的个数。」要先化成:term[行阶梯形]{id="math.linear-algebra.row-echelon-form"}再数；$\begin{pmatrix}1&1\\2&2\end{pmatrix}$有两个非零行，秩却是$1$。
- 「行空间和:term[列空间]{id="math.linear-algebra.column-space"}是同一个:term[子空间]{id="math.linear-algebra.subspace"}。」只是:term[维数]{id="math.linear-algebra.dimension"}相同；$m\times n$矩阵的行空间在$\R^n$里，列空间在$\R^m$里。
- 「方程比未知数多，方程组就无解。」只要$\rank A=\rank(A\mid\vb b)$就有解；多出来的方程可能正好是别的方程的组合。
- 「$\rank A=n$，方程组对每个$\vb b$都有解。」$\rank A=n$保证有解时解唯一；对每个$\vb b$都有解要$\rank A=m$。

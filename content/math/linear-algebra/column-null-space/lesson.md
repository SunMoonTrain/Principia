---
id: math.linear-algebra.column-null-space
title: |
  列空间与零空间
goal: |
  会求矩阵的列空间和零空间的基，并说明它们和方程组$A\vb{x}=\vb{b}$的解的关系。
prerequisites: [math.linear-algebra.basis-dimension, math.linear-algebra.matrices]
minutes: 35
summary: |
  列空间由各列生成，零空间是齐次解集；基从主元列和通解读出。
status: reviewed
---

## 这一节要回答的问题

[矩阵与矩阵乘法](lesson:math.linear-algebra.matrices)里，$A\vb x$是$A$各列的:term[线性组合]{id="math.linear-algebra.linear-combination"}（linear combination）；[生成与子空间](lesson:math.linear-algebra.span-subspaces)里，:term[齐次方程组]{id="math.linear-algebra.homogeneous-system"}（homogeneous linear system）的解组成一个:term[子空间]{id="math.linear-algebra.subspace"}（subspace）。对一个$m\times n$矩阵$A$，所有的$A\vb x$组成什么？$A\vb x=\vb 0$的解呢？怎样求它们的:term[基]{id="math.linear-algebra.basis"}（basis），它们和方程组$A\vb x=\vb b$有没有解、有多少解又有什么关系？

## 讲解

### 两个子空间

::anchor{id="def-column-null-space"}
$m\times n$矩阵$A$的各列在$\R^m$里:term[生成]{id="math.linear-algebra.span"}（span）的:term[子空间]{id="math.linear-algebra.subspace"}，叫作$A$的:term[列空间]{id="math.linear-algebra.column-space"}（column space），记作$C(A)$；:term[齐次方程组]{id="math.linear-algebra.homogeneous-system"}$A\vb x=\vb 0$的全部解组成的$\R^n$的子空间，叫作$A$的:term[零空间]{id="math.linear-algebra.null-space"}（null space），记作$N(A)$。

为什么这样定义：由[按列算矩阵乘向量](lesson:math.linear-algebra.matrices#def-matrix-vector)，$A\vb x=x_1\vb a_1+\dots+x_n\vb a_n$，所以$C(A)$正是全体$A\vb x$，而$N(A)$是被$A$送到$\vb 0$的那些$\vb x$。两者住在不同的地方：列空间在$\R^m$里，零空间在$\R^n$里。边界情况：$N(A)$总含有$\vb 0$；$A$是:term[零矩阵]{id="math.linear-algebra.zero-matrix"}（zero matrix）时，$C(A)=\{\vb 0\}$，$N(A)=\R^n$。

::anchor{id="thm-solvability"}
**两个子空间管着方程组**　$A\vb x=\vb b$有解，当且仅当$\vb b\in C(A)$；有解时，全部的解是$\vb p+\vb h$，$\vb p$是任意一个:term[特解]{id="math.linear-algebra.particular-solution"}（particular solution），$\vb h$取遍$N(A)$。所以有解时解唯一，当且仅当$N(A)=\{\vb 0\}$，即$A$的各列:term[线性无关]{id="math.linear-algebra.linearly-independent"}（linearly independent）。

**证明思路**：第一句就是$C(A)$等于全体$A\vb x$；第二句是[解集的结构](lesson:math.linear-algebra.solution-sets#thm-structure)。各列线性无关，说的正是只有$\vb x=\vb 0$使$x_1\vb a_1+\dots+x_n\vb a_n=\vb 0$，即$N(A)=\{\vb 0\}$。

### 求两组基

::anchor{id="thm-column-basis"}
**:term[列空间]{id="math.linear-algebra.column-space"}的:term[基]{id="math.linear-algebra.basis"}**　把$A$化成:term[行阶梯形]{id="math.linear-algebra.row-echelon-form"}（row echelon form），有:term[主元]{id="math.linear-algebra.pivot"}（pivot）的那些列对应的$A$的原来的列，是$C(A)$的一组基；$C(A)$的:term[维数]{id="math.linear-algebra.dimension"}（dimension）等于主元的个数。

**证明思路**：$C(A)$由$A$的各列:term[生成]{id="math.linear-algebra.span"}，用[挑出一组基的办法](lesson:math.linear-algebra.basis-dimension#thm-pivot-basis)即得。要用原来的列，因为:term[初等行变换]{id="math.linear-algebra.elementary-row-operation"}（elementary row operations）不改变$A\vb x=\vb 0$的解，也就不改变各列之间的线性关系（linear relation），却会改变各列本身，从而改变列空间（常见误区）。

::anchor{id="thm-null-basis"}
**:term[零空间]{id="math.linear-algebra.null-space"}的基**　把$A\vb x=\vb 0$的:term[通解]{id="math.linear-algebra.general-solution"}（general solution）写成$t_1\vb v_1+\dots+t_k\vb v_k$，每个:term[自由变量]{id="math.linear-algebra.free-variable"}（free variable）对应一个向量，$\vb v_1,\dots,\vb v_k$就是$N(A)$的一组基；$N(A)$的维数等于自由变量的个数。

**证明思路**：由[齐次解的基](lesson:math.linear-algebra.basis-dimension#thm-solution-basis)即得。

主元的个数加上自由变量的个数等于列数$n$，所以$\dim C(A)+\dim N(A)=n$。这件事在[秩与秩-零化度定理](lesson:math.linear-algebra.rank-nullity)里会单独讲：列空间越大，零空间就越小。

## 几何图像

:::anim{component="linear-map-2d"}
matrix: [[1, 2], [0.5, k]]
range: { x: [-1.5, 3.5], y: [-1.5, 3] }
show: [grid, square, basis]
vectors:
  - x: 2
    y: -1
    label: |
      $(2,-1)$
  - x: 1
    y: 1
    label: |
      $(1,1)$
sliders:
  - name: k
    min: 0
    max: 2
    step: 0.25
    default: 1
    label: |
      $k$
:::

动画把平面上的每个$\vb x$慢慢送到$A\vb x$，$A=\begin{pmatrix}1&2\\0.5&k\end{pmatrix}$（把矩阵看成变换，见[线性变换及其矩阵](lesson:math.linear-algebra.linear-maps)）。一开始$k=1$，两列$(1,0.5)$、$(2,1)$:term[平行]{id="math.linear-algebra.parallel"}（parallel），整个平面被压到直线$y=\frac x2$上，这条直线就是:term[列空间]{id="math.linear-algebra.column-space"}；$(2,-1)$被送到原点，它:term[生成]{id="math.linear-algebra.span"}的直线是:term[零空间]{id="math.linear-algebra.null-space"}，而$(1,1)$落在列空间里的$(3,1.5)$。拖动$k$离开$1$，两列不再平行，列空间是整个平面，零空间只剩原点，$(2,-1)$也不再被送到原点。动画的中途只是从$I$到$A$的过渡，看终点就行。

## 例题

### 例 1　求列空间和零空间的基

设$A=\begin{pmatrix}1&2&0&1\\2&4&1&4\\1&2&1&3\end{pmatrix}$。求$C(A)$和$N(A)$的一组:term[基]{id="math.linear-algebra.basis"}和:term[维数]{id="math.linear-algebra.dimension"}。

**为什么想到这么做**：化成:term[行阶梯形]{id="math.linear-algebra.row-echelon-form"}，:term[主元]{id="math.linear-algebra.pivot"}列给出:term[列空间]{id="math.linear-algebra.column-space"}的基；化成:term[简化行阶梯形]{id="math.linear-algebra.reduced-row-echelon-form"}（reduced row echelon form），:term[通解]{id="math.linear-algebra.general-solution"}给出:term[零空间]{id="math.linear-algebra.null-space"}的基。

**推导**：做$R_2-2R_1$、$R_3-R_1$，第二、三行都变成$(0,0,1,2)$，再做$R_3-R_2$，第三行全是零；主元在第一、三列，所以$C(A)$的基是$(1,2,1)$、$(0,1,1)$，维数$2$。这时已是简化行阶梯形，说的是$x_1=-2x_2-x_4$、$x_3=-2x_4$，:term[自由变量]{id="math.linear-algebra.free-variable"}是$x_2$、$x_4$，通解是$x_2(-2,1,0,0)+x_4(-1,0,-2,1)$。所以$N(A)$的基是$(-2,1,0,0)$、$(-1,0,-2,1)$，维数$2$，$2+2=4$正是列数。

### 例 2　有没有解，有多少解

对例 1 的$A$，判断$\vb b=(1,3,2)$、$\vb c=(1,3,3)$是否在$C(A)$里；在的话，写出$A\vb x=\vb b$的全部解。

**为什么想到这么做**：在不在:term[列空间]{id="math.linear-algebra.column-space"}里，就看方程组有没有解；有解时找一个:term[特解]{id="math.linear-algebra.particular-solution"}，加上:term[零空间]{id="math.linear-algebra.null-space"}。

**推导**：对$\vb b$，:term[增广矩阵]{id="math.linear-algebra.augmented-matrix"}（augmented matrix）经同样的行变换，第二、三行都是$(0,0,1,2\mid1)$，第三行消成全零，有解。取:term[自由变量]{id="math.linear-algebra.free-variable"}$x_2=x_4=0$，得$x_3=1$、$x_1=1$，特解$\vb p=(1,0,1,0)$，全部的解是$\vb p+s(-2,1,0,0)+t(-1,0,-2,1)$。对$\vb c$，第二、三行分别是$(0,0,1,2\mid1)$、$(0,0,1,2\mid2)$，相减得$(0,0,0,0\mid1)$，无解，$\vb c$不在$C(A)$里。

## 常见误区

- 「:term[列空间]{id="math.linear-algebra.column-space"}由:term[行阶梯形]{id="math.linear-algebra.row-echelon-form"}的各列:term[生成]{id="math.linear-algebra.span"}。」行变换改变了列；例如$\begin{pmatrix}1\\1\end{pmatrix}$化成$\begin{pmatrix}1\\0\end{pmatrix}$，列空间从直线$y=x$变成了$x$轴。要取原来的列。
- 「:term[零空间]{id="math.linear-algebra.null-space"}和列空间在同一个空间里。」$m\times n$矩阵的零空间在$\R^n$里，列空间在$\R^m$里，$m\ne n$时连向量的:term[分量]{id="math.linear-algebra.component"}（component）个数都不同。
- 「$A\vb x=\vb b$的:term[解集]{id="math.linear-algebra.solution-set"}（solution set）也是:term[子空间]{id="math.linear-algebra.subspace"}。」只有$\vb b=\vb 0$时是；否则它是零空间平移到$\vb p$的结果，不含$\vb 0$。
- 「零空间只有:term[零向量]{id="math.linear-algebra.zero-vector"}（zero vector），方程组就一定有解。」$N(A)=\{\vb 0\}$只保证有解时解唯一；例如$\begin{pmatrix}1\\1\end{pmatrix}x=\begin{pmatrix}1\\2\end{pmatrix}$无解。

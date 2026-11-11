---
id: math.linear-algebra.determinant
title: |
  行列式：有向面积与体积
goal: |
  会把行列式理解成线性变换对有向面积、有向体积的放大倍数，并由多重线性和交错性算出二阶、三阶行列式。
prerequisites: [math.linear-algebra.linear-maps]
minutes: 35
summary: |
  行列式是有向体积的放大倍数，由多重线性、交错性和$\det I=1$确定。
status: reviewed
---

## 这一节要回答的问题

[线性变换及其矩阵](lesson:math.linear-algebra.linear-maps)里，矩阵$A$把单位正方形变成以它的两列为邻边的平行四边形。面积放大了多少倍，平面有没有像照镜子那样被翻过来？到了三维、$n$维，体积又放大多少倍？能不能用一个数同时回答「放大多少」和「翻没翻」？

## 讲解

### 有向面积

::anchor{id="def-signed-area"}
以$\R^2$里的向量$\vb a$、$\vb b$为邻边的平行四边形，面积加上一个符号：从$\vb a$的方向逆时针转不到$180^\circ$就能转到$\vb b$的方向时取正，要顺时针转时取负，两者:term[平行]{id="math.linear-algebra.parallel"}（parallel）时为零。这样得到的数叫作$\vb a$、$\vb b$的:term[有向面积]{id="math.linear-algebra.signed-area"}（signed area），记作$D(\vb a,\vb b)$。

为什么这样定义：符号记下了两条边的先后顺序，也就记下了平行四边形的「朝向」（orientation）；交换$\vb a$、$\vb b$，面积不变，符号相反。例如$D(\vb e_1,\vb e_2)=1$，$D(\vb e_2,\vb e_1)=-1$。边界情况：一条边是:term[零向量]{id="math.linear-algebra.zero-vector"}（zero vector）时，平行四边形压扁成线段，有向面积是$0$。

有向面积有三条性质。(1) $D(\vb e_1,\vb e_2)=1$。(2) $D(\vb a,\vb a)=0$。(3) 固定一个变量时，它对另一个变量是线性的：$D(\vb a+\vb a',\vb b)=D(\vb a,\vb b)+D(\vb a',\vb b)$，$D(c\vb a,\vb b)=cD(\vb a,\vb b)$，对$\vb b$也一样；道理是以$\vb b$为底，有向面积等于底长乘以$\vb a$的终点到$\vb b$所在直线的带符号的距离，而这个距离对$\vb a$的加法、:term[数乘]{id="math.linear-algebra.scalar-multiplication"}（scalar multiplication）都是相加、成倍的。

::anchor{id="thm-signed-area"}
**有向面积的公式**　$\vb a=(a_1,a_2)$、$\vb b=(b_1,b_2)$的有向面积是$D(\vb a,\vb b)=a_1b_2-a_2b_1$。

**证明思路**：先由 (2)、(3)，$0=D(\vb e_1+\vb e_2,\vb e_1+\vb e_2)=D(\vb e_1,\vb e_2)+D(\vb e_2,\vb e_1)$，所以$D(\vb e_2,\vb e_1)=-1$。再把$\vb a=a_1\vb e_1+a_2\vb e_2$、$\vb b=b_1\vb e_1+b_2\vb e_2$代进去，用 (3) 拆成四项：$a_1b_1D(\vb e_1,\vb e_1)+a_1b_2D(\vb e_1,\vb e_2)+a_2b_1D(\vb e_2,\vb e_1)+a_2b_2D(\vb e_2,\vb e_2)=a_1b_2-a_2b_1$。只用了三条性质，所以满足这三条的函数只能是这个式子。

### 行列式

::anchor{id="def-determinant"}
对$n$阶:term[方阵]{id="math.linear-algebra.square-matrix"}（square matrix），把它的各列$\vb a_1,\dots,\vb a_n$依次放进去，得到一个数$\det A=\det(\vb a_1,\dots,\vb a_n)$；满足下面三条的这个函数叫作:term[行列式]{id="math.linear-algebra.determinant"}（determinant）：(1) 对每一列都是线性的，即固定其余各列时，对那一列是线性的，这叫:term[多重线性]{id="math.linear-algebra.multilinear"}（multilinear）；(2) 有两列相同时值为$0$，这叫:term[交错]{id="math.linear-algebra.alternating"}（alternating）；(3) $\det I=1$。

为什么这样定义：这三条正是:term[有向面积]{id="math.linear-algebra.signed-area"}的三条性质，搬到$n$维；二阶时就是$\det\begin{pmatrix}a&b\\c&d\end{pmatrix}=ad-bc$，以两列为邻边的平行四边形的有向面积。三维的平行六面体（parallelepiped）体积等于底面积乘高，加上朝向以后同样满足这三条，所以三阶行列式是以三列为棱的平行六面体的有向体积（signed volume）。边界情况：一阶方阵$(a)$的行列式就是$a$本身。

由多重线性和交错马上得到两条常用的性质。交换两列，行列式变号：把那两列都换成$\vb a+\vb b$，$0=\det(\dots,\vb a+\vb b,\dots,\vb a+\vb b,\dots)$展开后只剩$\det(\dots,\vb a,\dots,\vb b,\dots)+\det(\dots,\vb b,\dots,\vb a,\dots)$。把一列的倍数加到另一列上，行列式不变：多出的一项里有两列相同，是零。

::anchor{id="thm-det-unique"}
**行列式由三条性质确定**　满足上面三条的函数只有一个；它按各列展开，是$n!$项的和，每一项从每一列、每一行各取一个数相乘，再配上正号或负号。

**证明思路**：把每一列写成$\vb a_j=a_{1j}\vb e_1+\dots+a_{nj}\vb e_n$，用多重线性一列一列拆开，$\det A$成了许多项$a_{i_11}a_{i_22}\cdots a_{i_nn}\det(\vb e_{i_1},\dots,\vb e_{i_n})$的和。行号$i_1,\dots,i_n$有重复的项，有两列相同，是零；剩下的是$1,\dots,n$的各种排列（permutation），共$n!$项，$\det(\vb e_{i_1},\dots,\vb e_{i_n})$经若干次交换两列变成$\det I=1$，每交换一次变一次号，所以是$+1$或$-1$。可以证明（这里不证），这样配好符号的$n!$项之和确实满足三条，所以行列式存在而且唯一；具体怎样算，在[行列式的计算与性质](lesson:math.linear-algebra.determinant-properties)里讲。

三阶时$3!=6$项，按定理展开得
$$
\det\begin{pmatrix}a_{11}&a_{12}&a_{13}\\a_{21}&a_{22}&a_{23}\\a_{31}&a_{32}&a_{33}\end{pmatrix}=a_{11}a_{22}a_{33}+a_{12}a_{23}a_{31}+a_{13}a_{21}a_{32}-a_{13}a_{22}a_{31}-a_{11}a_{23}a_{32}-a_{12}a_{21}a_{33} .
$$
学过[叉积](lesson:math.linear-algebra.cross-product#def-triple-product)的话，:term[混合积]{id="math.linear-algebra.scalar-triple-product"}（scalar triple product）$(\vb u\times\vb v)\cdot\vb w$正是以$\vb u$、$\vb v$、$\vb w$为各列的三阶行列式，两者都是那个平行六面体的有向体积。

### 体积的放大倍数

::anchor{id="thm-det-volume"}
**:term[行列式]{id="math.linear-algebra.determinant"}是体积的放大倍数**　以$n$阶:term[方阵]{id="math.linear-algebra.square-matrix"}$A$的各列为棱的平行多面体（parallelotope，即$n$维的平行六面体），体积是$|\det A|$；:term[线性变换]{id="math.linear-algebra.linear-transformation"}（linear transformation）$\vb x\mapsto A\vb x$把任何区域的面积（$n=2$）、体积（$n=3$）都放大$|\det A|$倍。$\det A>0$时保持朝向，$\det A<0$时把朝向翻过来，$\det A=0$时把整个空间压扁。

**证明思路**：这个变换把单位正方形（单位立方体）变成以$A\vb e_1,\dots,A\vb e_n$，也就是以$A$的各列为棱的平行多面体，体积从$1$变成$|\det A|$。网格里的每个小正方形（小立方体）都被变成平移过的同一形状，放大的倍数都一样；一个区域用越来越细的小格子去拼，它的面积、体积也就放大$|\det A|$倍。$n>3$时，就把$|\det A|$当作以各列为棱的平行多面体的体积，它在二维、三维和面积、体积一致，[重积分的换元与雅可比行列式](lesson:math.vector-calculus.change-of-variables)里也是这样用的。

朝向的意思是：$\det A<0$的变换像照镜子，逆时针转的方向被变成顺时针转的方向；行列式为零时，各列落在一条直线（三维时是一个平面）里，平行多面体被压扁，体积为零。

## 几何图像

:::anim{component="linear-map-2d"}
matrix: [[1, b], [c, 1]]
range: { x: [-3, 3], y: [-3, 3] }
show: [grid, square, basis, det]
sliders:
  - name: b
    min: -1.5
    max: 1.5
    step: 0.25
    default: 1
    label: |
      $b$
  - name: c
    min: -1.5
    max: 1.5
    step: 0.25
    default: 0
    label: |
      $c$
:::

动画从:term[单位矩阵]{id="math.linear-algebra.identity-matrix"}（identity matrix）变到$A=\begin{pmatrix}1&b\\c&1\end{pmatrix}$，角上显示当前矩阵的:term[行列式]{id="math.linear-algebra.determinant"}，终点是$\det A=1-bc$。一开始$b=1$、$c=0$，是:term[剪切]{id="math.linear-algebra.shear"}（shear），单位正方形斜了过去，面积仍是$1$。拖动$c$使$bc>1$，例如$b=c=1.5$，终点的平行四边形翻了面、换了颜色，行列式是负数；动画途中有一刻行列式为零，整个平面被压成一条线，因为从$I$连续地变到朝向相反的矩阵，中途必须经过这样的时刻。$bc=1$时两列:term[平行]{id="math.linear-algebra.parallel"}，终点就是压扁的。

## 例题

### 例 1　二阶行列式与面积

设$A=\begin{pmatrix}3&1\\1&2\end{pmatrix}$。:term[线性变换]{id="math.linear-algebra.linear-transformation"}$\vb x\mapsto A\vb x$把单位正方形变成什么？面积放大几倍，朝向变没变？

**为什么想到这么做**：单位正方形的:term[像]{id="math.linear-algebra.image"}（image）以$A$的两列为邻边，:term[有向面积]{id="math.linear-algebra.signed-area"}就是$\det A$。

**推导**：两列是$(3,1)$、$(1,2)$，单位正方形变成以它们为邻边的平行四边形。$\det A=3\cdot2-1\cdot1=5>0$，所以面积放大$5$倍，朝向不变：从$(3,1)$逆时针转不到$180^\circ$就到$(1,2)$的方向。验算：这个平行四边形恰好放进$[0,4]\times[0,3]$的长方形，长方形里多出的部分是两个$1\times1$的小长方形、两个直角边为$3$和$1$的直角三角形、两个直角边为$1$和$2$的直角三角形，$12-2-3-2=5$。

### 例 2　三阶行列式与体积

求以$\vb a_1=(2,1,0)$、$\vb a_2=(0,3,1)$、$\vb a_3=(1,0,4)$为棱的平行六面体的体积，并判断这三个向量的顺序是不是和$\vb e_1$、$\vb e_2$、$\vb e_3$同朝向。

**为什么想到这么做**：体积是以三个向量为各列的:term[行列式]{id="math.linear-algebra.determinant"}的绝对值，朝向看行列式的符号；用三阶的六项公式算。

**推导**：矩阵是$\begin{pmatrix}2&0&1\\1&3&0\\0&1&4\end{pmatrix}$。六项依次是$2\cdot3\cdot4=24$、$0\cdot0\cdot0=0$、$1\cdot1\cdot1=1$，减去$1\cdot3\cdot0=0$、$2\cdot0\cdot1=0$、$0\cdot1\cdot4=0$，行列式是$25$。所以体积是$25$；行列式为正，和$\vb e_1$、$\vb e_2$、$\vb e_3$同朝向。交换其中两个向量的顺序，行列式变成$-25$，体积不变，朝向反了。

## 常见误区

- 「:term[行列式]{id="math.linear-algebra.determinant"}是面积，不会是负数。」行列式是:term[有向面积]{id="math.linear-algebra.signed-area"}、有向体积，符号说的是朝向；面积、体积是它的绝对值。
- 「$\det(A+B)=\det A+\det B$。」:term[多重线性]{id="math.linear-algebra.multilinear"}说的是对每一列分别线性，不是对整个矩阵线性；例如二阶时$\det(I+I)=4$，而$\det I+\det I=2$。
- 「$\det(cA)=c\det A$。」$n$阶时每一列都乘了$c$，所以$\det(cA)=c^n\det A$。
- 「行列式为零，矩阵就是:term[零矩阵]{id="math.linear-algebra.zero-matrix"}（zero matrix）。」两列:term[平行]{id="math.linear-algebra.parallel"}就为零，例如$\begin{pmatrix}1&2\\2&4\end{pmatrix}$。
- 「三阶的六项公式按对角线记，四阶也照样记。」四阶行列式有$4!=24$项，按对角线只凑得出$8$项；四阶以上要用[行列式的计算与性质](lesson:math.linear-algebra.determinant-properties)里的办法。

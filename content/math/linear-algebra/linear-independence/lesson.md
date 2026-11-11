---
id: math.linear-algebra.linear-independence
title: |
  线性无关
goal: |
  会判断一组向量是否线性无关，并在线性相关时找出能被其余向量表示的那一个。
prerequisites: [math.linear-algebra.span-subspaces]
minutes: 30
summary: |
  只有零组合等于零向量叫线性无关；相关时有一个能用其余表示。
status: reviewed
---

## 这一节要回答的问题

[生成与子空间](lesson:math.linear-algebra.span-subspaces)里，同一个向量可能有许多种写法；一组向量里能用其余向量表示的那一个，去掉以后:term[生成]{id="math.linear-algebra.span"}（span）的:term[子空间]{id="math.linear-algebra.subspace"}（subspace）不变（那一节的第 6 题）。怎样判断一组向量里有没有这样多余的向量？没有多余的向量时，写法是不是就唯一了？

## 讲解

### 线性无关与线性相关

::anchor{id="def-linear-independence"}
如果只有$c_1=\dots=c_k=0$时才有$c_1\vb v_1+\dots+c_k\vb v_k=\vb 0$，就说$\vb v_1,\dots,\vb v_k$:term[线性无关]{id="math.linear-algebra.linearly-independent"}（linearly independent）；否则，即有不全为零的$c_1,\dots,c_k$使这个组合等于$\vb 0$，就说它们:term[线性相关]{id="math.linear-algebra.linearly-dependent"}（linearly dependent），这个等式叫作它们之间的一个线性关系（linear relation）。

为什么这样定义：系数全取零，任何一组向量的:term[线性组合]{id="math.linear-algebra.linear-combination"}（linear combination）都是:term[零向量]{id="math.linear-algebra.zero-vector"}（zero vector）；线性无关说的是，除此之外再没有别的办法凑出零向量。例如$(1,0)$、$(0,1)$线性无关，而$2(1,2)-(2,4)=\vb 0$，所以$(1,2)$、$(2,4)$线性相关。边界情况：含有零向量的一组一定线性相关，给零向量配系数$1$、其余配$0$就行；单个向量线性无关当且仅当它不是零向量，两个向量线性相关当且仅当它们:term[平行]{id="math.linear-algebra.parallel"}（parallel）。

::anchor{id="thm-dependent-redundant"}
**相关就有多余的向量**　$\vb v_1,\dots,\vb v_k$（$k\ge2$）线性相关，当且仅当其中某一个能用其余的向量线性表示；这时去掉它，:term[生成]{id="math.linear-algebra.span"}的:term[子空间]{id="math.linear-algebra.subspace"}不变。

**证明思路**：若$c_1\vb v_1+\dots+c_k\vb v_k=\vb 0$而$c_j\ne0$，两边除以$c_j$再移项，就把$\vb v_j$写成了其余向量的组合。反过来，$\vb v_j=\sum_{i\ne j}a_i\vb v_i$移项，得到$\vb v_j$的系数为$-1$的线性关系。去掉以后生成的子空间不变，正是[生成与子空间](lesson:math.linear-algebra.span-subspaces)第 6 题。

### 用主元判断

::anchor{id="thm-independence-pivots"}
**按列消元判断**　把$\vb v_1,\dots,\vb v_k$作为各列，化成:term[行阶梯形]{id="math.linear-algebra.row-echelon-form"}（row echelon form）。它们:term[线性无关]{id="math.linear-algebra.linearly-independent"}，当且仅当每一列都有:term[主元]{id="math.linear-algebra.pivot"}（pivot）；第$j$列没有主元时，$\vb v_j$能用它前面有主元的那些列对应的向量表示。

**证明思路**：线性无关就是:term[齐次线性方程组]{id="math.linear-algebra.homogeneous-system"}（homogeneous linear system）$x_1\vb v_1+\dots+x_k\vb v_k=\vb 0$只有零解，也就是没有:term[自由变量]{id="math.linear-algebra.free-variable"}（free variable），每一列都有主元。若第$j$列没有主元，化成:term[简化行阶梯形]{id="math.linear-algebra.reduced-row-echelon-form"}（reduced row echelon form），令$x_j=1$、其余自由变量为$0$；第$j$列只在它左边那些主元所在的行里有非零的数，所以回代时右边的主变量（pivot variable）都是$0$。这个解把$\vb v_j$写成了它前面的主元列对应的向量的组合。

::anchor{id="thm-too-many"}
**向量太多一定相关**　$\R^n$里多于$n$个向量一定:term[线性相关]{id="math.linear-algebra.linearly-dependent"}。

**证明思路**：主元个数不超过行数$n$，多于$n$列时一定有一列没有主元。这也就是[线性方程组与高斯消元](lesson:math.linear-algebra.linear-systems)第 6 题：方程比未知数少的齐次方程组有不全为零的解。

### 线性无关与唯一的写法

::anchor{id="thm-unique-coefficients"}
**写法唯一**　$\vb v_1,\dots,\vb v_k$:term[线性无关]{id="math.linear-algebra.linearly-independent"}，当且仅当$\Span\{\vb v_1,\dots,\vb v_k\}$里的每个向量都只有一种写法。

**证明思路**：若$\vb b=\sum a_i\vb v_i=\sum b_i\vb v_i$，两式相减得$\sum(a_i-b_i)\vb v_i=\vb 0$；线性无关时每个$a_i-b_i=0$，两种写法相同。反过来，:term[零向量]{id="math.linear-algebra.zero-vector"}有写法$0\vb v_1+\dots+0\vb v_k$，写法唯一就说明只有零系数的组合等于零向量。

[解集的结构](lesson:math.linear-algebra.solution-sets)第 6 题证明了:term[通解]{id="math.linear-algebra.general-solution"}（general solution）里参数的取法唯一，说的正是通解里那几个向量线性无关：每个向量在自己的:term[自由变量]{id="math.linear-algebra.free-variable"}的位置上是$1$，在别的自由变量的位置上是$0$。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-4, 4], y: [-2.4, 2.4] }
functions:
  - expr: "x/2"
    label: |
      $\vb v_1$生成的直线
  - expr: "m*x"
    label: |
      $\vb v_2$生成的直线
points:
  - { x: "2", y: "1" }
  - { x: "1", y: "m" }
sliders:
  - name: m
    min: -2
    max: 2
    step: 0.25
    default: 1.5
    label: |
      斜率$m$
:::

两个点是$\vb v_1=(2,1)$和$\vb v_2=(1,m)$的终点，两条直线是它们各自:term[生成]{id="math.linear-algebra.span"}的集合。$m\ne\frac12$时两条直线不同，$\vb v_1$、$\vb v_2$不:term[平行]{id="math.linear-algebra.parallel"}，:term[线性无关]{id="math.linear-algebra.linearly-independent"}，它们的组合能到达平面上的每一点；拖到$m=\frac12$，两条直线重合，$\vb v_2=\frac12\vb v_1$，:term[线性相关]{id="math.linear-algebra.linearly-dependent"}。三维时道理一样：[生成与子空间](lesson:math.linear-algebra.span-subspaces)的图里，$\vb b$不在$\vb u$、$\vb v$生成的平面上，所以$\vb u$、$\vb v$、$\vb b$线性无关；换成平面上的$\vb u+\vb v$就线性相关了。

## 例题

### 例 1　判断并找出线性关系

判断$\vb v_1=(1,2,0)$、$\vb v_2=(0,1,1)$、$\vb v_3=(2,3,-1)$是否:term[线性无关]{id="math.linear-algebra.linearly-independent"}；相关的话，写出一个线性关系，并把多余的那个用其余的表示。

**为什么想到这么做**：以三个向量为各列化成:term[行阶梯形]{id="math.linear-algebra.row-echelon-form"}，看每一列有没有:term[主元]{id="math.linear-algebra.pivot"}；没有主元的那一列，由:term[齐次方程组]{id="math.linear-algebra.homogeneous-system"}的解读出线性关系。

**推导**：三行是$(1,0,2)$、$(2,1,3)$、$(0,1,-1)$。做$R_2-2R_1$得$(0,1,-1)$，再做$R_3-R_2$，第三行全是零，第三列没有主元，所以:term[线性相关]{id="math.linear-algebra.linearly-dependent"}。令$x_3=1$，由第二行$x_2-x_3=0$得$x_2=1$，由第一行$x_1+2x_3=0$得$x_1=-2$，线性关系是$-2\vb v_1+\vb v_2+\vb v_3=\vb 0$，即$\vb v_3=2\vb v_1-\vb v_2$。验算：$2(1,2,0)-(0,1,1)=(2,3,-1)$。

### 例 2　向量太多

说明$\R^3$里的$(1,0,0)$、$(1,1,0)$、$(1,1,1)$、$(3,2,1)$一定:term[线性相关]{id="math.linear-algebra.linearly-dependent"}，并找出可以去掉的那一个。

**为什么想到这么做**：四个向量多于$3$个，一定相关；按列排好以后已经是阶梯形，没有:term[主元]{id="math.linear-algebra.pivot"}的那一列就是多余的。

**推导**：以四个向量为各列，三行是$(1,1,1,3)$、$(0,1,1,2)$、$(0,0,1,1)$，已经是:term[行阶梯形]{id="math.linear-algebra.row-echelon-form"}，前三列有主元，第四列没有。由第三行$c=1$，第二行$b+c=2$得$b=1$，第一行$a+b+c=3$得$a=1$，所以$(3,2,1)=(1,0,0)+(1,1,0)+(1,1,1)$，去掉它，:term[生成]{id="math.linear-algebra.span"}的:term[子空间]{id="math.linear-algebra.subspace"}不变。

## 常见误区

- 「两两不:term[平行]{id="math.linear-algebra.parallel"}的三个向量就:term[线性无关]{id="math.linear-algebra.linearly-independent"}。」$(1,0,0)$、$(0,1,0)$、$(1,1,0)$两两不平行，却都在平面$z=0$上，第三个是前两个之和。
- 「:term[线性相关]{id="math.linear-algebra.linearly-dependent"}时，每一个向量都能用其余的表示。」只保证有一个能；例如$(1,0)$、$(2,0)$、$(0,1)$线性相关，但$(0,1)$不能用另外两个表示。
- 「线性无关的一组里再加进一个向量，仍然线性无关。」要看新向量在不在原来:term[生成]{id="math.linear-algebra.span"}的:term[子空间]{id="math.linear-algebra.subspace"}里（第 5 题）。
- 「判断线性无关，要看方程组$x_1\vb v_1+\dots+x_k\vb v_k=\vb b$有没有解。」看的是常数项为零的:term[齐次方程组]{id="math.linear-algebra.homogeneous-system"}是不是只有零解；有没有解是「在不在生成的子空间里」的问题。

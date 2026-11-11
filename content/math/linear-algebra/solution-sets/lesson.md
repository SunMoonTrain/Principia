---
id: math.linear-algebra.solution-sets
title: |
  解集的结构
goal: |
  会用自由变量写出方程组的通解，并说明非齐次方程组的通解等于一个特解加上对应齐次方程组的通解。
prerequisites: [math.linear-algebra.linear-systems]
minutes: 30
summary: |
  解集是一个特解加上齐次方程组的全部解；自由变量各给一个方向。
status: reviewed
---

## 这一节要回答的问题

[线性方程组与高斯消元](lesson:math.linear-algebra.linear-systems)里说，有无穷多个解时，没有:term[主元]{id="math.linear-algebra.pivot"}（pivot）的未知数可以随意取值。这无穷多个解，能不能用几个参数一次写全？系数相同、常数项不同的两个方程组，:term[解集]{id="math.linear-algebra.solution-set"}（solution set）之间又有什么联系？

## 讲解

### 自由变量与通解

::anchor{id="def-free-variable"}
把:term[线性方程组]{id="math.linear-algebra.linear-system"}（system of linear equations）的:term[增广矩阵]{id="math.linear-algebra.augmented-matrix"}（augmented matrix）化成:term[行阶梯形]{id="math.linear-algebra.row-echelon-form"}（row echelon form）以后，系数部分有:term[主元]{id="math.linear-algebra.pivot"}的列对应的未知数叫作主变量（pivot variable），没有主元的列对应的未知数叫作:term[自由变量]{id="math.linear-algebra.free-variable"}（free variable）。

为什么这样定义：回代时，自由变量没有方程限制它，可以取任何值；它们一旦取定，主变量就由回代唯一确定。方程组有解时，解有多少「自由度」，就看有几个自由变量。边界情况：有解而没有自由变量，就是有唯一解；没有主元的列只能是自由变量的列，所以主变量的个数等于主元的个数。

化成:term[简化行阶梯形]{id="math.linear-algebra.reduced-row-echelon-form"}（reduced row echelon form）最方便：每个主变量只出现在一个方程里，直接移项，就用自由变量把它表示出来。例如简化行阶梯形$\left(\begin{array}{cccc|c}1&2&0&-1&3\\0&0&1&2&1\end{array}\right)$说的是$x_1=3-2x_2+x_4$、$x_3=1-2x_4$，自由变量是$x_2$、$x_4$。

::anchor{id="def-general-solution"}
有解的线性方程组，把主变量用自由变量表示，再令各个自由变量分别等于参数$t_1,\dots,t_k$，把解写成$\vb x=\vb p+t_1\vb v_1+\dots+t_k\vb v_k$（$t_1,\dots,t_k$取遍全体实数），这个式子叫作方程组的:term[通解]{id="math.linear-algebra.general-solution"}（general solution）；方程组的任何一个具体的解叫作:term[特解]{id="math.linear-algebra.particular-solution"}（particular solution）。

为什么这样定义：通解一个式子就列出了全部的解，每一组参数给出一个解，不同的参数给出不同的解。上面的例子令$x_2=s$、$x_4=t$，得$\vb x=(3,0,1,0)+s(-2,1,0,0)+t(1,0,-2,1)$，其中$\vb p=(3,0,1,0)$是参数全取$0$得到的特解。边界情况：没有自由变量时，通解就是唯一的那个解$\vb p$；方程组无解时，没有特解，也谈不上通解。

### 齐次方程组的解

把每个方程的左边$a_1x_1+\dots+a_nx_n$记作$L(\vb x)$。它对向量的加法和:term[数乘]{id="math.linear-algebra.scalar-multiplication"}（scalar multiplication）有两条性质：$L(\vb u+\vb v)=L(\vb u)+L(\vb v)$，$L(c\vb u)=cL(\vb u)$，按:term[分量]{id="math.linear-algebra.component"}（component）写开就是数的分配律。

::anchor{id="thm-homogeneous-combinations"}
**齐次解相加、数乘仍是解**　如果$\vb u$、$\vb v$是:term[齐次线性方程组]{id="math.linear-algebra.homogeneous-system"}（homogeneous linear system）的解，$c$是数，那么$\vb u+\vb v$和$c\vb u$也是它的解；所以齐次方程组的解的任何:term[线性组合]{id="math.linear-algebra.linear-combination"}（linear combination）都是它的解。

**证明思路**：对每个方程，$L(\vb u+\vb v)=L(\vb u)+L(\vb v)=0+0=0$，$L(c\vb u)=cL(\vb u)=0$。齐次方程组的:term[通解]{id="math.linear-algebra.general-solution"}$t_1\vb v_1+\dots+t_k\vb v_k$里没有$\vb p$：常数项都是$0$，参数全取$0$得到的就是零解（trivial solution）。所以齐次方程组的全部解，正是$\vb v_1,\dots,\vb v_k$的全部线性组合。以后[列空间与零空间](lesson:math.linear-algebra.column-null-space)里讲的零空间（null space），就是这个集合。

### 非齐次方程组的解集

::anchor{id="thm-structure"}
**:term[解集]{id="math.linear-algebra.solution-set"}的结构**　常数项不全为零的:term[线性方程组]{id="math.linear-algebra.linear-system"}叫作非齐次线性方程组（nonhomogeneous linear system）。设$\vb p$是一个线性方程组的:term[特解]{id="math.linear-algebra.particular-solution"}，那么$\vb x$是它的解，当且仅当$\vb x-\vb p$是对应的:term[齐次方程组]{id="math.linear-algebra.homogeneous-system"}的解；也就是说，全部的解恰好是$\vb p+\vb h$，$\vb h$取遍对应齐次方程组的全部解。

**证明思路**：对每个方程$L(\vb x)=b$，有$L(\vb x)-L(\vb p)=L(\vb x-\vb p)$，而$L(\vb p)=b$，所以$L(\vb x)=b$当且仅当$L(\vb x-\vb p)=0$。所有方程同时看，就是定理的结论。

为什么这件事重要：解一个方程组，只要找到一个特解，再解出对应的齐次方程组，两者相加就是全部的解；常数项不同、系数相同的方程组，解集都是同一个齐次解集平移过去，只是有的方程组根本无解。几何上，齐次方程组的解集是过原点的直线、平面这类图形，非齐次的是把它平移到$\vb p$的位置。边界情况：两个不同的特解$\vb p$、$\vb p'$给出同一个解集，因为$\vb p'-\vb p$本身就是齐次方程组的解。

所以有解的方程组有唯一解，当且仅当对应的齐次方程组只有零解。常微分方程里线性方程的解也有同样的结构，道理相同：两个解之差满足齐次方程（见[一阶线性方程与积分因子](lesson:math.ode.linear-first-order#thm-linear-structure)）。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-9, 9], y: [-5.4, 5.4] }
functions:
  - expr: "(4 - x)/2"
    label: |
      $x+2y=4$的解集
  - expr: "-x/2"
    label: |
      $x+2y=0$的解集
points:
  - { x: "2", y: "1" }
  - { x: "2 - 2*k", y: "1 + k" }
  - { x: "-2*k", y: "k" }
sliders:
  - name: k
    min: -3
    max: 3
    step: 0.5
    default: 1
    label: |
      参数$t$
:::

只有一个方程、两个未知数的方程组$x+2y=4$：取:term[特解]{id="math.linear-algebra.particular-solution"}$\vb p=(2,1)$（固定的那个点），对应的齐次方程$x+2y=0$的解是$t(-2,1)$。拖动$t$，下面直线上的点是齐次解$t(-2,1)$，上面直线上的点是$\vb p+t(-2,1)$，两点之差始终是$\vb p$：上面那条直线就是下面那条平移了$\vb p$。图上的横轴、纵轴就是两个未知数$x$、$y$。

## 例题

### 例 1　写出通解

解方程组$x_1+2x_2-x_3=3$、$2x_1+4x_2+x_3=3$。

**为什么想到这么做**：方程比未知数少，多半有:term[自由变量]{id="math.linear-algebra.free-variable"}；化成:term[简化行阶梯形]{id="math.linear-algebra.reduced-row-echelon-form"}，把主变量用自由变量表示，写成:term[通解]{id="math.linear-algebra.general-solution"}。

**推导**：做$R_2-2R_1$，得$(0\ \ 0\ \ 3\mid-3)$，即$x_3=-1$；代回第一个方程，$x_1=3-2x_2+x_3=2-2x_2$。:term[主元]{id="math.linear-algebra.pivot"}在第一、三列，$x_2$是自由变量，令$x_2=t$，通解是$\vb x=(2,0,-1)+t(-2,1,0)$。验算：$2-2t+2t+1=3$，$2(2-2t)+4t-1=3$。

### 例 2　特解加齐次解

求方程$x_1-x_2+x_3=1$的:term[通解]{id="math.linear-algebra.general-solution"}，并说明它的几何意义。

**为什么想到这么做**：用:term[解集]{id="math.linear-algebra.solution-set"}的结构，先找一个:term[特解]{id="math.linear-algebra.particular-solution"}，再解对应的齐次方程$x_1-x_2+x_3=0$。

**推导**：$\vb p=(1,0,0)$是特解。齐次方程里$x_2$、$x_3$是:term[自由变量]{id="math.linear-algebra.free-variable"}，$x_1=x_2-x_3$，令$x_2=s$、$x_3=t$，齐次解是$s(1,1,0)+t(-1,0,1)$。所以通解是$\vb x=(1,0,0)+s(1,1,0)+t(-1,0,1)$。几何上，齐次方程的解是过原点的一个平面，原方程的解是把这个平面平移到经过$(1,0,0)$的位置。

## 常见误区

- 「:term[通解]{id="math.linear-algebra.general-solution"}的写法是唯一的。」换一个:term[特解]{id="math.linear-algebra.particular-solution"}、换一组参数，写出的式子不同，表示的:term[解集]{id="math.linear-algebra.solution-set"}却相同；例如例 1 的通解也可以写成$(0,1,-1)+s(2,-1,0)$。
- 「两个解相加还是解。」只对:term[齐次方程组]{id="math.linear-algebra.homogeneous-system"}成立；非齐次时，两个解之和满足的是常数项加倍的方程组。
- 「齐次方程组可能无解。」它总有零解；问题只在于有没有非零解。
- 「非齐次方程组的解集也经过原点。」:term[零向量]{id="math.linear-algebra.zero-vector"}（zero vector）只有在常数项全为零时才是解；非齐次的解集是齐次解集平移出去的结果，不经过原点。

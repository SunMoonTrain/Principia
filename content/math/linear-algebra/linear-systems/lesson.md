---
id: math.linear-algebra.linear-systems
title: |
  线性方程组与高斯消元
goal: |
  会用初等行变换把增广矩阵化成阶梯形，并判断方程组无解、有唯一解还是有无穷多解。
prerequisites: [math.linear-algebra.vectors]
minutes: 35
summary: |
  初等行变换不改变解；化成阶梯形后看主元，判断解的情况。
status: reviewed
---

## 这一节要回答的问题

成书于公元 200 年以前的《九章算术》（*The Nine Chapters on the Mathematical Art*）第八章，第一题是这样的：上等禾$3$捆、中等禾$2$捆、下等禾$1$捆，共打出谷子$39$斗；上等$2$捆、中等$3$捆、下等$1$捆，共$34$斗；上等$1$捆、中等$2$捆、下等$3$捆，共$26$斗，问每捆各打多少斗。三个未知数、三个方程，怎样有条不紊地解出来？换成别的方程组，怎样一眼看出它是无解、恰有一个解，还是有无穷多个解？

## 讲解

### 线性方程组

::anchor{id="def-linear-system"}
形如$a_1x_1+a_2x_2+\dots+a_nx_n=b$的方程叫作关于未知数$x_1,\dots,x_n$的线性方程（linear equation），$a_i$是系数，$b$是常数项（constant term）；若干个这样的方程放在一起叫作:term[线性方程组]{id="math.linear-algebra.linear-system"}（system of linear equations），使每个方程都成立的$(x_1,\dots,x_n)$叫作它的解（solution），全部解组成的集合叫作:term[解集]{id="math.linear-algebra.solution-set"}（solution set）。

为什么这样定义：「线性」是说未知数只以一次方出现，彼此不相乘，$x_1x_2$、$x_1^2$、$\sin x_1$都不允许。这样的方程，几何上在平面里是一条直线，在空间里是一个平面，解集就是它们的公共点。边界情况：方程$0x_1+0x_2=1$没有解，$0x_1+0x_2=0$则人人都满足，它们都算线性方程。

把未知数$x_j$的系数从上到下排成一列，记作$\vb a_j$，常数项排成$\vb b$，方程组就写成$x_1\vb a_1+x_2\vb a_2+\dots+x_n\vb a_n=\vb b$：解方程组，就是问$\vb b$能不能写成$\vb a_1,\dots,\vb a_n$的:term[线性组合]{id="math.linear-algebra.linear-combination"}（linear combination），能的话系数是多少。[向量与线性运算](lesson:math.linear-algebra.vectors)的例 2 就是这样一个方程组。

### 增广矩阵

::anchor{id="def-augmented-matrix"}
$m$行$n$列的一张数表叫作$m\times n$矩阵（matrix），第$i$行第$j$列的数记作$a_{ij}$；方程组的系数按原来的位置排成的矩阵叫作:term[系数矩阵]{id="math.linear-algebra.coefficient-matrix"}（coefficient matrix），右边再添一列常数项得到的矩阵叫作:term[增广矩阵]{id="math.linear-algebra.augmented-matrix"}（augmented matrix），添的那一列前面画一条竖线。

为什么这样定义：消元时动的只是系数和常数项，一遍遍抄写$x_1,x_2,\dots$是多余的，排成数表更清楚。例如方程组$x_1+2x_2=5$、$3x_1-x_2=1$的增广矩阵是$\left(\begin{array}{cc|c}1&2&5\\3&-1&1\end{array}\right)$。边界情况：系数矩阵的第$j$列就是$x_j$在各个方程里的系数$\vb a_j$，缺少某个未知数的方程，那个位置写$0$。

### 初等行变换

解方程组时常做的三件事：交换两个方程的位置，给一个方程两边同乘一个不为零的数，把一个方程的倍数加到另一个方程上。放到:term[增广矩阵]{id="math.linear-algebra.augmented-matrix"}上，就是对行的操作。

::anchor{id="def-row-operations"}
对矩阵的行做的下面三种变换叫作:term[初等行变换]{id="math.linear-algebra.elementary-row-operation"}（elementary row operations）：(1) 交换两行，记作$R_i\leftrightarrow R_j$；(2) 把一行乘以一个不为零的数$c$，记作$cR_i$；(3) 把一行的$c$倍加到另一行上，记作$R_i+cR_j$；这里$R_i$表示第$i$行。

::anchor{id="thm-row-operations"}
**初等行变换不改变:term[解集]{id="math.linear-algebra.solution-set"}**　对增广矩阵做初等行变换，得到的新方程组和原来的方程组有同样的解集。

**证明思路**：原方程组的解满足每个原方程，也就满足它们的倍数与和，所以是新方程组的解。三种变换都能用同一种变换撤销：再交换一次，乘以$\frac1c$，加上$-c$倍；所以新方程组的解也是原方程组的解。第 (2) 种要求$c\ne0$，正是为了能撤销：乘以$0$会把一个方程变成$0=0$，丢掉信息。

### 阶梯形与高斯消元

::anchor{id="def-echelon"}
一个矩阵如果满足：(1) 全为零的行都在最下面；(2) 每个非零行最左边的非零数都在上一行最左边的非零数的右边，就叫作:term[行阶梯形]{id="math.linear-algebra.row-echelon-form"}（row echelon form），每个非零行最左边的非零数叫作这一行的:term[主元]{id="math.linear-algebra.pivot"}（pivot）。

为什么这样定义：行阶梯形对应的方程组，越往下未知数越少，最后一个非零行只含最靠右的那几个未知数，可以从下往上一个一个解。主元下方全是零，这正是「消元」要达到的样子。边界情况：$\left(\begin{array}{cc|c}1&2&5\\0&0&3\end{array}\right)$也是行阶梯形，第二行的主元在常数项那一列，它说的是$0=3$。

::anchor{id="def-gaussian-elimination"}
用:term[初等行变换]{id="math.linear-algebra.elementary-row-operation"}把:term[增广矩阵]{id="math.linear-algebra.augmented-matrix"}化成行阶梯形，再从最后一个方程起往上逐个求出未知数（这一步叫作回代，back substitution），这种解法叫作:term[高斯消元法]{id="math.linear-algebra.gaussian-elimination"}（Gaussian elimination）。

为什么这样定义：化阶梯形的做法是一列一列来：在第一列里选一个不为零的数当:term[主元]{id="math.linear-algebra.pivot"}，必要时交换到第一行，用它把下面各行这一列的数都消成零；再对剩下的行重复。这个方法以高斯（Gauss）命名，可《九章算术》里已经有了实质相同的算法，书中把系数排成数表，一列一列地相消。边界情况：某一列在剩下的行里全是零，这一列就没有主元，跳到下一列继续。

::anchor{id="def-rref"}
行阶梯形如果还满足：(3) 每个主元都是$1$；(4) 主元所在的列里，其余的数都是$0$，就叫作:term[简化行阶梯形]{id="math.linear-algebra.reduced-row-echelon-form"}（reduced row echelon form）。

为什么这样定义：继续用初等行变换，把每个主元化成$1$、把主元上方的数也消成零，回代就在矩阵上做完了，解可以直接读出来，例如前面那个方程组$x_1+2x_2=5$、$3x_1-x_2=1$，增广矩阵化成$\left(\begin{array}{cc|c}1&0&1\\0&1&2\end{array}\right)$，读出$x_1=1$、$x_2=2$。可以证明（这里不证），一个矩阵不论怎样做初等行变换，最后得到的简化行阶梯形都是同一个，行阶梯形则不唯一。边界情况：全为零的矩阵没有主元，它本身就是简化行阶梯形。

### 解的三种情况

::anchor{id="thm-three-cases"}
**解的三种情况**　把:term[线性方程组]{id="math.linear-algebra.linear-system"}的:term[增广矩阵]{id="math.linear-algebra.augmented-matrix"}化成:term[行阶梯形]{id="math.linear-algebra.row-echelon-form"}：(1) 如果有一行是$(0\ \cdots\ 0\mid b)$，$b\ne0$，方程组无解；(2) 否则，如果系数部分的每一列都有:term[主元]{id="math.linear-algebra.pivot"}，方程组有唯一解；(3) 否则有无穷多个解。

**证明思路**：(1) 那一行说的是$0=b$，不可能成立。(2) 没有$0=b$这样的行时，从最后一个非零行往上回代，每一步都恰好解出一个未知数，没有选择的余地。(3) 没有主元的列对应的未知数在回代时没有方程限制它，可以任意取值，每取一个值都能把其余未知数解出来，于是解有无穷多个。

所以一个线性方程组的解只能是没有、恰好一个，或者无穷多个，不会恰好有两个（第 5 题）。平面上两条直线相交、平行、重合，正是这三种情况。

::anchor{id="def-homogeneous"}
常数项全为零的线性方程组叫作:term[齐次线性方程组]{id="math.linear-algebra.homogeneous-system"}（homogeneous linear system）；所有未知数都取零，每个方程都成立，这个解叫作它的零解（trivial solution）。

为什么这样定义：齐次方程组总有零解，不会出现$0=b\ne0$的行，问题只在于除了零解还有没有别的解。边界情况：一个方程组把常数项都换成零，就得到和它对应的齐次方程组，它们的:term[系数矩阵]{id="math.linear-algebra.coefficient-matrix"}相同，以后在[解集的结构](lesson:math.linear-algebra.solution-sets)里会看到两者的:term[解集]{id="math.linear-algebra.solution-set"}怎样联系。

::anchor{id="thm-square"}
**方程个数等于未知数个数时**　设线性方程组有$n$个方程、$n$个未知数，则下面三条等价：(1) 对某一组常数项，方程组有唯一解；(2) 对每一组常数项，方程组都有唯一解；(3) 对应的:term[齐次线性方程组]{id="math.linear-algebra.homogeneous-system"}只有零解。

**证明思路**：化行阶梯形时做哪些:term[初等行变换]{id="math.linear-algebra.elementary-row-operation"}，只看系数部分，所以系数部分的阶梯形和常数项无关。三条都等价于「系数部分的$n$列都有主元」：有主元的列不超过行数$n$，$n$列都有主元时$n$行都有主元，不会出现$(0\ \cdots\ 0\mid b)$这样的行，由上面的定理对每一组常数项都有唯一解；反过来，(1) 或 (3) 成立时，由上面的定理的 (2)、(3)，系数部分每一列都必须有主元。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-6, 6], y: [-3.6, 3.6] }
functions:
  - expr: "2 - x"
    label: |
      $x+y=2$
  - expr: "m*x + c"
    label: |
      $y=mx+c$
points:
  - { x: "(2 - c)/(m + 1)", y: "2 - (2 - c)/(m + 1)" }
sliders:
  - name: m
    min: -2
    max: 1
    step: 0.25
    default: 0.5
    label: |
      斜率$m$
  - name: c
    min: 1
    max: 3
    step: 0.5
    default: 1
    label: |
      截距$c$
:::

两条直线是方程组$x+y=2$、$y=mx+c$里两个方程的图像，点是它们的交点，也就是方程组的解。拖动$m$：$m\ne-1$时两条直线相交于一点，有唯一解；$m$越接近$-1$，交点跑得越远，$m=-1$时两条直线平行，没有交点，方程组无解。这时再把$c$调到$2$，两条直线重合，直线上的每一点都是解，这是无穷多解的情形。

## 例题

### 例 1　《九章算术》的谷子问题

设上、中、下等禾每捆分别打出$x$、$y$、$z$斗谷子，解开头的问题：$3x+2y+z=39$，$2x+3y+z=34$，$x+2y+3z=26$。

**为什么想到这么做**：三个方程、三个未知数，写出:term[增广矩阵]{id="math.linear-algebra.augmented-matrix"}，用:term[高斯消元法]{id="math.linear-algebra.gaussian-elimination"}化成:term[行阶梯形]{id="math.linear-algebra.row-echelon-form"}再回代。第三个方程的$x$系数是$1$，先把它换到第一行，免得出现分数。

**推导**：做$R_1\leftrightarrow R_3$，再做$R_2-2R_1$、$R_3-3R_1$，最后做$R_3-4R_2$：

$$
\left(\begin{array}{ccc|c}3&2&1&39\\2&3&1&34\\1&2&3&26\end{array}\right)\to\left(\begin{array}{ccc|c}1&2&3&26\\0&-1&-5&-18\\0&-4&-8&-39\end{array}\right)\to\left(\begin{array}{ccc|c}1&2&3&26\\0&-1&-5&-18\\0&0&12&33\end{array}\right).
$$

回代：$12z=33$，$z=\frac{11}{4}$；$-y-5z=-18$，$y=18-\frac{55}{4}=\frac{17}{4}$；$x=26-2y-3z=26-\frac{34}{4}-\frac{33}{4}=\frac{37}{4}$。上、中、下等禾每捆分别打出$9\frac14$、$4\frac14$、$2\frac34$斗，和书里的答案一致。

### 例 2　带参数的方程组

$k$取什么值时，方程组$x+y+z=1$、$x+2y+3z=2$、$2x+3y+4z=k$有解？有解时解有多少个？

**为什么想到这么做**：解的个数由:term[行阶梯形]{id="math.linear-algebra.row-echelon-form"}决定，先消元，看最后一行是不是$(0\ 0\ 0\mid b)$、各列有没有:term[主元]{id="math.linear-algebra.pivot"}。

**推导**：做$R_2-R_1$、$R_3-2R_1$，再做$R_3-R_2$：

$$
\left(\begin{array}{ccc|c}1&1&1&1\\1&2&3&2\\2&3&4&k\end{array}\right)\to\left(\begin{array}{ccc|c}1&1&1&1\\0&1&2&1\\0&1&2&k-2\end{array}\right)\to\left(\begin{array}{ccc|c}1&1&1&1\\0&1&2&1\\0&0&0&k-3\end{array}\right).
$$

$k\ne3$时最后一行是$0=k-3\ne0$，无解。$k=3$时最后一行全是零，第三列没有主元，有无穷多个解。不论$k$取什么值，都不会恰好有一个解。

## 常见误区

- 「方程个数等于未知数个数，就有唯一解。」例 2 有三个方程、三个未知数，可它要么无解，要么有无穷多个解。
- 「方程比未知数多，就一定无解。」三个方程、两个未知数也可能有解，例如[向量与线性运算](lesson:math.linear-algebra.vectors)第 3 题。
- 「把一行乘以$0$也是:term[初等行变换]{id="math.linear-algebra.elementary-row-operation"}。」乘以$0$撤销不了，会丢掉一个方程；初等行变换要求乘的数不为零。
- 「解有可能恰好两个。」如果$\vb p$、$\vb q$是两个不同的解，那么对每个数$t$，$\vb p+t(\vb q-\vb p)$都是解，解有无穷多个（第 5 题）。

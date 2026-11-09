---
id: math.calculus-of-variations.several-functions
title: |
  多个未知函数与高阶导数
goal: |
  会对含多个未知函数或高阶导数的泛函写出欧拉-拉格朗日方程组。
prerequisites: [math.calculus-of-variations.euler-lagrange]
minutes: 25
summary: |
  每个未知函数各有一个方程；含$y''$时是四阶的欧拉-泊松方程。
status: reviewed
---

## 这一节要回答的问题

空间里的曲线要用两个函数$y(x)$、$z(x)$来描述；弹性梁（elastic beam）弯曲的能量里出现二阶导数$y''$。:term[泛函]{id="math.calculus-of-variations.functional"}（functional）含几个未知函数或高阶导数时，:term[欧拉-拉格朗日方程]{id="math.calculus-of-variations.euler-lagrange-equation"}（Euler–Lagrange equation）变成什么样？端点上又要给几个条件？

## 讲解

### 几个未知函数

空间中从$A=(a,y_a,z_a)$到$B=(b,y_b,z_b)$的曲线写成$y=y(x)$、$z=z(x)$，长度是$\int_a^b\sqrt{1+y'^2+z'^2}\,\dd x$，未知的是两个函数。一般地，设

$$
J[y_1,\dots,y_n]=\int_a^bF\bigl(x,y_1,\dots,y_n,y_1',\dots,y_n'\bigr)\dd x ,
$$

每个$y_k$的两端都给定。

::anchor{id="thm-el-system"}
定理（:term[欧拉-拉格朗日方程组]{id="math.calculus-of-variations.euler-lagrange-equation"}）：设$F$有连续的二阶偏导数（partial derivative），$y_1,\dots,y_n$有连续的二阶导数。如果$J$在$(y_1,\dots,y_n)$处取局部极值，那么

$$
F_{y_k}-\dv{}{x}F_{y_k'}=0 ,\qquad k=1,\dots,n .
$$

证明思路：只把第$k$个函数换成$y_k+\varepsilon\eta$，其余不动，$J$就成了只含一个未知函数的:term[泛函]{id="math.calculus-of-variations.functional"}，照[第一变分与欧拉-拉格朗日方程](lesson:math.calculus-of-variations.euler-lagrange)的推导得到第$k$个方程。这里要求各个$y_k$能各自独立地变动；如果它们之间有:term[约束]{id="physics.analytical-mechanics.constraint"}（constraint，例如曲线必须落在一张曲面上），就不能这样做，那要用乘子（multiplier），见[约束在曲面上的变分问题](lesson:math.calculus-of-variations.holonomic-constraints)。

$n$个方程一般各是二阶的，通解含$2n$个常数，正好由两端的$2n$个条件定出。$F$不含某个$y_k$时，第$k$个方程积分一次就是$F_{y_k'}=C$，它是一个:term[首次积分]{id="math.calculus-of-variations.first-integral"}（first integral）。分析力学里的:term[哈密顿原理]{id="physics.analytical-mechanics.hamiltons-principle"}（Hamilton's principle，见[哈密顿原理](lesson:physics.analytical-mechanics.hamiltons-principle)）就是这个定理：把$x$换成时间，$y_k$换成描述位置的坐标。

### 含二阶导数

弹性梁、画图用的细木条，弯曲得越厉害，储存的能量越多，能量近似正比于$\int y''^2\,\dd x$。这类:term[泛函]{id="math.calculus-of-variations.functional"}是$J[y]=\int_a^bF(x,y,y',y'')\,\dd x$。比较的函数除了两端的$y$，两端的斜率$y'$也给定，所以$\eta$满足$\eta=\eta'=0$（两端）。

:term[第一变分]{id="math.calculus-of-variations.first-variation"}（first variation）是$\int_a^b\bigl(F_y\eta+F_{y'}\eta'+F_{y''}\eta''\bigr)\dd x$。第二项分部积分（integration by parts）一次，第三项分部积分两次：

$$
\int_a^bF_{y''}\eta''\,\dd x=\Bigl[F_{y''}\eta'-\Bigl(\dv{}{x}F_{y''}\Bigr)\eta\Bigr]_a^b+\int_a^b\frac{\dd^2}{\dd x^2}F_{y''}\,\eta\,\dd x ,
$$

方括号因$\eta=\eta'=0$而为零。所以$\delta J=\int_a^b\bigl(F_y-\dv{}{x}F_{y'}+\frac{\dd^2}{\dd x^2}F_{y''}\bigr)\eta\,\dd x$，再用:term[变分法基本引理]{id="math.calculus-of-variations.fundamental-lemma"}（fundamental lemma of the calculus of variations）。

::anchor{id="thm-euler-poisson"}
定理（:term[欧拉-泊松方程]{id="math.calculus-of-variations.euler-poisson-equation"}，Euler–Poisson equation）：设$F$足够光滑，$y$有连续的四阶导数，两端的$y$、$y'$都给定。如果$J[y]=\int_a^bF(x,y,y',y'')\,\dd x$在$y$处取局部极值，那么

$$
F_y-\dv{}{x}F_{y'}+\frac{\dd^2}{\dd x^2}F_{y''}=0 .
$$

$F_{y''y''}\ne0$时这是四阶方程，通解有四个常数，正好由两端的$y$、$y'$四个条件定出。如果只给定两端的$y$、不给$y'$，上面方括号里的$F_{y''}\eta'$不再消失，两端要另外满足$F_{y''}=0$（p5）。含更高阶导数时规律相同：$y^{(m)}$的那一项带$(-1)^m\frac{\dd^m}{\dd x^m}$。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 1], y: [-0.2, 1.2] }
functions:
  - expr: "2*x^2 - x^3"
    label: |
      $y=2x^2-x^3$
  - expr: "2*x^2 - x^3 + a*x^2*(1-x)^2"
    label: |
      $y+a\,x^2(1-x)^2$
  - expr: "x"
    label: |
      在$(1,1)$处的切线$y=x$
sliders:
  - name: a
    min: -6
    max: 6
    step: 0.25
    default: 3
    label: |
      变动的幅度$a$
:::

:::anim{component="function-plot"}
range: { x: [-6, 6], y: [0, 34] }
functions:
  - expr: "4 + 0.8*x^2"
    label: |
      $\int_0^1y''^2\,\dd x$，横轴是$a$
points:
  - { x: "a", y: "4 + 0.8*a^2" }
sliders:
  - name: a
    min: -6
    max: 6
    step: 0.25
    default: 3
    label: |
      变动的幅度$a$
:::

两张图对应例 2：两端的高度和斜率都给定，$y=2x^2-x^3$在原点处与$x$轴相切，在$(1,1)$处与直线$y=x$相切。加上的$x^2(1-x)^2$在两端的值和斜率都是零，所以变动后的曲线满足同样的四个条件；下图是弯曲能量随$a$的变化，最低点在$a=0$。

## 例题

### 例 1　空间中的最短曲线

求从$A$到$B$、写成$y=y(x)$、$z=z(x)$的曲线中长度的:term[极值曲线]{id="math.calculus-of-variations.extremal"}（extremal）。

**为什么想到这么做**：$F=\sqrt{1+p^2+q^2}$（$p$、$q$分别代$y'$、$z'$）不含$y$、$z$，两个方程都能积分一次，得到两个:term[首次积分]{id="math.calculus-of-variations.first-integral"}。

**推导**：$F_{y'}=\frac{y'}{\sqrt{1+y'^2+z'^2}}=C_1$，$F_{z'}=\frac{z'}{\sqrt{1+y'^2+z'^2}}=C_2$。两式平方相加，$\frac{y'^2+z'^2}{1+y'^2+z'^2}=C_1^2+C_2^2$，所以$y'^2+z'^2$是常数，根号也是常数，再由两个式子，$y'$、$z'$各是常数。极值曲线是直线，它的投影$y(x)$、$z(x)$都是一次函数。

### 例 2　弯曲能量最小的曲线

求$J[y]=\int_0^1y''^2\,\dd x$在$y(0)=0$、$y'(0)=0$、$y(1)=1$、$y'(1)=1$下的:term[极值曲线]{id="math.calculus-of-variations.extremal"}，并说明它使$J$最小。

**为什么想到这么做**：被积函数含$y''$，用:term[欧拉-泊松方程]{id="math.calculus-of-variations.euler-poisson-equation"}。$F$只依赖$y''$，方程会很简单；四个端点条件正好定出四阶方程的四个常数。

**推导**：$F_y=F_{y'}=0$，$F_{y''}=2y''$，方程是$2y''''=0$，所以$y$是三次多项式$y=c_3x^3+c_2x^2+c_1x+c_0$。由$y(0)=y'(0)=0$得$c_0=c_1=0$；由$y(1)=1$、$y'(1)=1$得$c_3+c_2=1$、$3c_3+2c_2=1$，解得$c_3=-1$、$c_2=2$，即$y=2x^2-x^3$。任取两端$\eta=\eta'=0$的$\eta$，

$$
J[y+\eta]=J[y]+2\int_0^1y''\eta''\,\dd x+\int_0^1\eta''^2\,\dd x ,
$$

中间一项分部积分两次等于$2\int_0^1y''''\eta\,\dd x=0$，所以$J[y+\eta]\ge J[y]=\int_0^1(4-6x)^2\,\dd x=4$。工程上画光滑曲线用的样条（spline），每两个节点之间都是三次多项式，道理就在这里。

## 常见误区

- 「有几个未知函数时，对其中一个求变分就够了。」每个函数都要单独变动一次，有几个未知函数就有几个方程；少一个，解就定不下来。
- 「含$y''$的:term[泛函]{id="math.calculus-of-variations.functional"}，只要固定两端的$y$。」:term[欧拉-泊松方程]{id="math.calculus-of-variations.euler-poisson-equation"}是四阶的，还需要两端的$y'$；不给$y'$时，取而代之的是端点上的$F_{y''}=0$。
- 「方程组里方程的个数等于未知函数的个数，所以解总能由端点条件唯一定出。」曲线写成参数形式$x(t)$、$y(t)$时，长度的两个方程并不独立，同一条直线的任何参数化都是解（p6）。

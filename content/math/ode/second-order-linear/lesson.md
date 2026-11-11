---
id: math.ode.second-order-linear
title: |
  二阶线性方程的解的结构
goal: |
  知道二阶齐次线性方程的解组成二维向量空间，并会用朗斯基行列式判断两个解是否线性无关。
prerequisites: [math.ode.linear-first-order, math.linear-algebra.vector-spaces, math.calculus.higher-derivatives]
minutes: 35
summary: |
  齐次方程的解组成二维向量空间，通解是两个无关解的组合。
status: reviewed
---

## 这一节要回答的问题

弹簧上的小球满足$my''+cy'+ky=0$，单摆的小振动满足$\theta''+\frac gl\theta=0$：未知函数和它的一阶、二阶导数都以一次的形式出现。:term[一阶线性方程]{id="math.ode.linear-first-order-equation"}（first-order linear equation）的解是一个常数乘一个固定的函数，再加一个:term[特解]{id="math.ode.particular-solution"}（particular solution）；二阶的呢？要先找到几个解，才能写出全部的解？

## 讲解

### 二阶线性方程

::anchor{id="def-second-order-linear"}
形如$y''+p(x)y'+q(x)y=g(x)$的方程叫作:term[二阶线性方程]{id="math.ode.second-order-linear-equation"}（second-order linear equation），$p$、$q$、$g$是区间$I$上给定的函数；$g\equiv0$时叫作齐次的（homogeneous），否则叫作非齐次的（nonhomogeneous）。

为什么这样定义：$y$、$y'$、$y''$都只以一次的形式出现，系数只依赖$x$，所以齐次方程的两个解相加、解乘以常数，仍然是解，下面的结构都由此而来。首项系数不为零的方程$a(x)y''+b(x)y'+c(x)y=d(x)$（在$I$上$a(x)\ne0$）两边除以$a(x)$，就化成上面的标准形式。边界情况：$a$在某点为零时不能这样除，那一点附近解的样子可能完全不同（第 7 题）。

::anchor{id="thm-existence-linear"}
**存在唯一性**　设$p$、$q$、$g$在区间$I$上连续，$x_0\in I$。对任意给定的两个数$a$、$b$，方程$y''+p(x)y'+q(x)y=g(x)$在整个$I$上有唯一的解满足$y(x_0)=a$、$y'(x_0)=b$。

**证明思路**：令$u=y$、$v=y'$，方程化成:term[一阶方程组]{id="math.ode.first-order-system"}（system of first-order equations）$u'=v$、$v'=g-pv-qu$，在$I$的每个有界闭子区间上，右边对$(u,v)$满足:term[利普希茨条件]{id="math.ode.lipschitz-condition"}（Lipschitz condition），常数可以取$1+|p|+|q|$的最大值。由[方程组与高阶方程](lesson:math.ode.existence-uniqueness#thm-systems)的定理，解在$x_0$附近存在且唯一。线性方程的解不会爆破（blow-up），能一直延伸到整个$I$：右边对$(u,v)$至多线性增长，解至多指数增长，不会在$I$内跑到无穷（道理和[一阶线性方程](lesson:math.ode.linear-first-order)第 7 题一样）；只要解有界，就能一段段接下去（见[解的存在唯一性](lesson:math.ode.existence-uniqueness)），这里不细证。

### 叠加原理与解空间

::anchor{id="thm-superposition"}
**:term[叠加原理]{id="math.ode.superposition-principle"}（superposition principle）**　若$y_1$、$y_2$是齐次方程$y''+py'+qy=0$的解，则对任意常数$C_1$、$C_2$，$C_1y_1+C_2y_2$也是解。所以齐次方程在$I$上的全部解组成一个向量空间（vector space）。

**证明思路**：记$L[y]=y''+py'+qy$，求导对加法和数乘都是线性的，所以$L[C_1y_1+C_2y_2]=C_1L[y_1]+C_2L[y_2]=0$。$I$上的函数按逐点相加、数乘组成一个向量空间，全部解是其中的一个子集，含零函数，对加法和数乘封闭，因此是一个子空间（subspace）。

::anchor{id="thm-solution-space"}
**解空间是二维的**　设$p$、$q$在区间$I$上连续，则齐次方程$y''+p(x)y'+q(x)y=0$在$I$上的解组成二维的向量空间：任取两个线性无关（linearly independent）的解$y_1$、$y_2$，每个解都能唯一地写成$C_1y_1+C_2y_2$。

**证明思路**：取$x_0\in I$，由存在唯一性，有解$\phi$满足$\phi(x_0)=1$、$\phi'(x_0)=0$，有解$\psi$满足$\psi(x_0)=0$、$\psi'(x_0)=1$。任一解$y$和$y(x_0)\phi+y'(x_0)\psi$在$x_0$处的值和导数都相同，由唯一性两者相等，所以$\phi$、$\psi$张成（span）解空间；$C_1\phi+C_2\psi\equiv0$时在$x_0$处取值和导数得$C_1=C_2=0$，它们线性无关，是一组基（basis），维数（dimension）是$2$。二维空间里任意两个线性无关的向量都是一组基，所以$y_1$、$y_2$也是。

::anchor{id="def-fundamental-set"}
齐次方程的两个线性无关的解$y_1$、$y_2$叫作一个:term[基本解组]{id="math.ode.fundamental-set"}（fundamental set of solutions），这时$y=C_1y_1+C_2y_2$是齐次方程的:term[通解]{id="math.ode.general-solution"}（general solution）。

为什么这样定义：由上面的定理，基本解组就是解空间的一组基；有了它，任何一组初值都可以通过解关于$C_1$、$C_2$的二元一次方程组来满足。边界情况：$\cos x$、$\sin x$是$y''+y=0$的基本解组；$\cos x$和$2\cos x$虽然都是解，却线性相关（linearly dependent），怎么组合也得不到$\sin x$。

### 朗斯基行列式

两个函数是否线性无关，按定义要看由$C_1y_1+C_2y_2\equiv0$能不能推出$C_1=C_2=0$，这要看整个区间。对同一个齐次方程的两个解，只看一点就够了。

::anchor{id="def-wronskian"}
函数$W(x)=y_1(x)y_2'(x)-y_1'(x)y_2(x)$叫作$y_1$、$y_2$的:term[朗斯基行列式]{id="math.ode.wronskian"}（Wronskian），记作$W(y_1,y_2)$；它就是二阶行列式$\begin{vmatrix}y_1&y_2\\y_1'&y_2'\end{vmatrix}$。

为什么这样定义：要$C_1y_1+C_2y_2$在$x_0$处的值和导数都为零，就是解关于$C_1$、$C_2$的方程组$C_1y_1(x_0)+C_2y_2(x_0)=0$、$C_1y_1'(x_0)+C_2y_2'(x_0)=0$；消去一个未知数就能看出，它只有零解，当且仅当$W(x_0)\ne0$。边界情况：$W(\cos x,\sin x)=\cos^2x+\sin^2x=1$，处处不为零。名字里的「行列式」（determinant）见[行列式](lesson:math.linear-algebra.determinant)，这里只用到上面这个式子。

::anchor{id="thm-abel"}
**:term[阿贝尔公式]{id="math.ode.abel-formula"}（Abel's formula）**　设$y_1$、$y_2$是齐次方程$y''+py'+qy=0$在$I$上的解，$P$是$p$的一个原函数，则$W(y_1,y_2)=Ce^{-P(x)}$，$C$是常数。所以$W$要么在$I$上处处为零，要么处处不为零；处处为零当且仅当$y_1$、$y_2$线性相关。

**证明思路**：直接求导，$W'=y_1y_2''-y_1''y_2$，把$y_i''=-py_i'-qy_i$代进去，$q$的两项抵消，剩下$W'=-pW$；这是:term[一阶线性方程]{id="math.ode.linear-first-order-equation"}，所以$W=Ce^{-P}$。若$W(x_0)=0$，可以取不全为零的$C_1$、$C_2$，使$C_1y_1+C_2y_2$在$x_0$处的值和导数都为零，由唯一性它恒为零，$y_1$、$y_2$线性相关；反过来，线性相关时$W$显然处处为零。详细的证明见第 5 题。

### 非齐次方程

::anchor{id="thm-nonhomogeneous"}
**非齐次方程的解**　设$y_p$是$y''+py'+qy=g$的一个解，$y_1$、$y_2$是对应的齐次方程的:term[基本解组]{id="math.ode.fundamental-set"}，则非齐次方程的每个解都能写成$y=y_p+C_1y_1+C_2y_2$。

**证明思路**：非齐次方程的两个解之差满足齐次方程，由解空间是二维的，它等于某个$C_1y_1+C_2y_2$。这和[一阶线性方程](lesson:math.ode.linear-first-order#thm-linear-structure)的情形一样：非齐次方程的解，是一个:term[特解]{id="math.ode.particular-solution"}加上齐次方程的:term[通解]{id="math.ode.general-solution"}。怎样找特解，见后面的[待定系数法](lesson:math.ode.undetermined-coefficients)和[常数变易法](lesson:math.ode.variation-of-parameters)。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-6.3, 6.3], y: [-3, 3] }
functions:
  - expr: "a*cos(x) + b*sin(x)"
    label: |
      解$y=a\cos x+b\sin x$
  - expr: "a + b*x"
    label: |
      $x=0$处的切线
points:
  - { x: "0", y: "a" }
sliders:
  - name: a
    min: -2
    max: 2
    step: 0.1
    default: 1
    label: |
      $y(0)=a$
  - name: b
    min: -2
    max: 2
    step: 0.1
    default: 0.5
    label: |
      $y'(0)=b$
:::

这是$y''+y=0$的解$y=a\cos x+b\sin x$。拖动$a$、$b$：$a$是$y(0)$，$b$是$y'(0)$，也就是那条切线的斜率；这两个数一定，解就定了：全部的解恰好用这两个数来编号，解空间是二维的，说的就是这件事。$a=b=0$时得到零解；$b$不变只改$a$，曲线在$x=0$处的那一点上下移动，切线的斜率不变。

## 例题

### 例 1　验证基本解组并解初值问题

验证$y_1=e^x$、$y_2=e^{-2x}$是$y''+y'-2y=0$的:term[基本解组]{id="math.ode.fundamental-set"}，并求满足$y(0)=1$、$y'(0)=4$的解。

**为什么想到这么做**：先代入验证它们是解，再用:term[朗斯基行列式]{id="math.ode.wronskian"}判断是否线性无关；初值条件给出$C_1$、$C_2$的两个方程。

**推导**：$y_1''+y_1'-2y_1=e^x+e^x-2e^x=0$，$y_2''+y_2'-2y_2=4e^{-2x}-2e^{-2x}-2e^{-2x}=0$。$W=e^x\cdot(-2e^{-2x})-e^x\cdot e^{-2x}=-3e^{-x}\ne0$，所以$y_1$、$y_2$线性无关，构成基本解组；这也符合:term[阿贝尔公式]{id="math.ode.abel-formula"}，这里$p=1$，$W=Ce^{-x}$。:term[通解]{id="math.ode.general-solution"}是$y=C_1e^x+C_2e^{-2x}$，由$C_1+C_2=1$、$C_1-2C_2=4$得$C_1=2$、$C_2=-1$，所求的解是$y=2e^x-e^{-2x}$。

### 例 2　知道一个解，求另一个

已知$y_1=e^x$是$xy''-(x+1)y'+y=0$（$x>0$）的一个解，求另一个与它线性无关的解。

**为什么想到这么做**：设$y_2=vy_1$。由商的求导法则（quotient rule），$\bigl(\frac{y_2}{y_1}\bigr)'=\frac{y_1y_2'-y_1'y_2}{y_1^2}=\frac{W}{y_1^2}$，而$W$可以由:term[阿贝尔公式]{id="math.ode.abel-formula"}直接写出来，这样只要再求一次原函数。

**推导**：标准形式是$y''-\bigl(1+\frac1x\bigr)y'+\frac1xy=0$，$p=-1-\frac1x$，取原函数$P=-x-\ln x$，$W=Ce^{x+\ln x}=Cxe^x$。于是$v'=\frac{W}{y_1^2}=Cxe^{-x}$；取$C=-1$，$v=(x+1)e^{-x}$，求导即可验证$\bigl((x+1)e^{-x}\bigr)'=-xe^{-x}$。所以$y_2=vy_1=x+1$；代回验证，$x\cdot0-(x+1)\cdot1+(x+1)=0$。

## 常见误区

- 「两个解都不是零函数，就能组成:term[基本解组]{id="math.ode.fundamental-set"}。」还要线性无关：$\cos x$和$2\cos x$就不行。
- 「:term[朗斯基行列式]{id="math.ode.wronskian"}在某一点为零，这两个函数就线性相关。」对一般的函数不对（第 8 题）；对同一个系数连续的齐次方程的两个解才对。
- 「非齐次方程的解也组成向量空间。」两个解之和满足的是$g$换成$2g$的方程；非齐次方程的解是一个:term[特解]{id="math.ode.particular-solution"}加上一个二维空间里的函数。
- 「二阶方程给一个初值就够了。」要同时给$y(x_0)$和$y'(x_0)$。

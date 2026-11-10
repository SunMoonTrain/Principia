---
id: math.calculus-of-variations.rayleigh-quotient
title: |
  瑞利商与特征值的变分刻画
goal: |
  会用瑞利商刻画最小特征值，并用试探函数估计它的上界。
prerequisites: [math.calculus-of-variations.isoperimetric-problems, math.linear-algebra.spectral-theorem]
minutes: 30
summary: |
  最小特征值是瑞利商的最小值，任何试探函数都给出它的上界。
status: reviewed
---

## 这一节要回答的问题

两端固定的弦（string）振动时，最低的频率，即基频（fundamental frequency），由这样一个问题决定：求最小的$\lambda$，使$-y''=\lambda y$有两端为零、不恒为零的解（见[驻波](lesson:physics.oscillations-waves.standing-waves)）。弦的粗细不均匀时，方程的系数随$x$变化，一般解不出来。能不能不解方程，直接估计这个最小的$\lambda$？

## 讲解

### 从矩阵说起

实对称矩阵$A$的最小特征值（eigenvalue）有一个不用解特征方程（characteristic equation）的刻画。按谱定理（spectral theorem），$A$有一组由特征向量（eigenvector）组成的正交规范基（orthonormal basis）$\mathbf v_1,\dots,\mathbf v_n$，对应的特征值是$\lambda_1\le\lambda_2\le\dots\le\lambda_n$。把$\mathbf x\ne\mathbf 0$写成$\sum c_i\mathbf v_i$，就有

$$
\frac{\mathbf x\cdot A\mathbf x}{\mathbf x\cdot\mathbf x}=\frac{\sum\lambda_ic_i^2}{\sum c_i^2}\ge\lambda_1 ,
$$

等号在$\mathbf x$是属于$\lambda_1$的特征向量时成立。所以$\lambda_1$是左边这个商的最小值，随便取一个$\mathbf x$代进去，得到的都是$\lambda_1$的上界。下面会看到，函数也有同样的结构。

### 瑞利商

在$[0,L]$上两端为零的:term[容许函数]{id="math.calculus-of-variations.admissible-function"}（admissible function）中，求$\int_0^Ly'^2\,\dd x$的最小值，同时要求$\int_0^Ly^2\,\dd x=1$。这是一个:term[等周问题]{id="math.calculus-of-variations.isoperimetric-problem"}（isoperimetric problem），乘子法则（multiplier rule）说极小值点满足$H=y'^2-\lambda y^2$的:term[欧拉-拉格朗日方程]{id="math.calculus-of-variations.euler-lagrange-equation"}（Euler–Lagrange equation），即$-y''=\lambda y$。两边乘$y$再积分，分部积分（integration by parts）时边界项因$y(0)=y(L)=0$而消失，得到$\int_0^Ly'^2\,\dd x=\lambda\int_0^Ly^2\,\dd x=\lambda$：乘子正好是最小值。

约束（constraint）$\int_0^Ly^2\,\dd x=1$只是把$y$的大小定下来：把$y$换成$cy$，两个积分同乘$c^2$。所以不如直接比较两个积分的商。

::anchor{id="def-rayleigh-quotient"}
对$[0,L]$上两端为零、不恒为零的容许函数$y$，商$R[y]=\frac{\int_0^Ly'^2\,\dd x}{\int_0^Ly^2\,\dd x}$叫作$y$的:term[瑞利商]{id="math.calculus-of-variations.rayleigh-quotient"}（Rayleigh quotient）。

为什么这样定义：$R[cy]=R[y]$，所以在所有不恒为零的$y$中求$R$的最小值，和上面带约束的问题是一回事，还免去了约束。它是矩阵那个商的对应物：分部积分得$\int_0^Ly'^2\,\dd x=\int_0^Ly\cdot(-y'')\,\dd x$，$-\dv{^2}{x^2}$扮演$A$的角色。边界情况：两端为零的条件不能少，否则常数$y\equiv1$给出$R=0$，最小值就没有意义了。

::anchor{id="def-eigenfunction"}
如果有两端为零、不恒为零的$y$满足$-y''=\lambda y$，就说$\lambda$是这个边值问题（boundary value problem）的特征值，$y$是属于$\lambda$的特征函数（eigenfunction）。

为什么这样定义：特征函数就是$-\dv{^2}{x^2}$的「特征向量」。上面乘$y$再积分的计算对任何特征函数都适用，所以特征函数的瑞利商等于它的特征值：$R[y]=\lambda$。边界情况：$y\equiv0$总满足方程，所以要求不恒为零；对一般的$\lambda$只有零解，例如$\lambda\le0$时（p5）。

### 最小特征值

::anchor{id="thm-min-eigenvalue"}
定理（最小特征值的变分刻画）：对$[0,L]$上两端为零、不恒为零的:term[容许函数]{id="math.calculus-of-variations.admissible-function"}，$R[y]\ge\frac{\pi^2}{L^2}$，等号只在$y=c\sin\frac{\pi x}{L}$时成立。所以$-y''=\lambda y$、$y(0)=y(L)=0$的最小特征值是$\lambda_1=\frac{\pi^2}{L^2}$，它就是:term[瑞利商]{id="math.calculus-of-variations.rayleigh-quotient"}的最小值。

证明思路：记$k=\frac\pi L$。在$(0,L)$上直接求导可以验证

$$
y'^2-k^2y^2=\bigl(y'-k\cot(kx)\,y\bigr)^2+\bigl(k\cot(kx)\,y^2\bigr)' .
$$

两边从$0$到$L$积分。$y(0)=0$、$y'$有界，所以$|y(x)|$不超过常数乘$x$，而$\cot(kx)$约是$\frac{1}{kx}$，边界项$k\cot(kx)\,y^2$在$x\to0$时趋于零，$x\to L$时同理，于是$\int_0^L(y'^2-k^2y^2)\,\dd x=\int_0^L\bigl(y'-k\cot(kx)\,y\bigr)^2\dd x\ge0$。等号成立要求$y'=k\cot(kx)\,y$，也就是$\bigl(y/\sin kx\bigr)'=0$，$y$是$\sin kx$的常数倍。

每个特征值都是某个特征函数的瑞利商，所以不小于$\frac{\pi^2}{L^2}$；$\sin\frac{\pi x}{L}$又正好是特征函数，定理的后半句由此得出。整个论证没有解微分方程（differential equation），只用了一个恒等式，它和[雅可比条件与共轭点](lesson:math.calculus-of-variations.jacobi-condition)里证明充分性的恒等式是同一个。

### 带系数的瑞利商与试探函数

弦的张力（tension）或密度随位置变化时，方程变成$-(p\,y')'+q\,y=\lambda w\,y$，$p>0$、$w>0$、$q$是给定的函数。同样的推导（乘子法则，再乘$y$积分）给出

$$
R[y]=\frac{\int_0^L\bigl(p\,y'^2+q\,y^2\bigr)\dd x}{\int_0^Lw\,y^2\,\dd x} ,
$$

特征函数的:term[瑞利商]{id="math.calculus-of-variations.rayleigh-quotient"}仍等于它的特征值，$R$的最小值点仍是属于最小特征值的特征函数。这时一般没有现成的恒等式，但可以证明最小值能取到（见[斯图姆-刘维尔理论](lesson:math.pde.sturm-liouville)），所以最小特征值$\lambda_1$仍是$R$的最小值。

::anchor{id="def-trial-function"}
为了估计$\lambda_1$而代进瑞利商的具体:term[容许函数]{id="math.calculus-of-variations.admissible-function"}，叫作:term[试探函数]{id="math.calculus-of-variations.trial-function"}（trial function）。

为什么这样定义：$\lambda_1$是$R$的最小值，所以任何试探函数给出的$R$都是$\lambda_1$的上界，试探函数越像特征函数，上界越准。选试探函数只要满足边界条件、形状大致像特征函数（例如在区间内不变号），积分又算得出来就行。边界情况：这样只能得到上界，下界要靠别的办法，例如上面的恒等式，或者像例 2 那样和系数为常数的问题比较。

更高的特征值也有类似的刻画。例如在$[0,L]$上和$\sin\frac{\pi x}{L}$正交（orthogonal）、即$\int_0^Ly\sin\frac{\pi x}{L}\,\dd x=0$的函数中，$R$的最小值是第二个特征值$\frac{4\pi^2}{L^2}$，这和矩阵在与$\mathbf v_1$正交的向量中求商的最小值一样（证明见[斯图姆-刘维尔理论](lesson:math.pde.sturm-liouville)）。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-4, 4], y: [0, 17.5] }
functions:
  - expr: "(1 + m^2*x^2)/(1 + x^2)"
    label: |
      $R/\pi^2$，试探函数$\sin\pi x+c\sin m\pi x$
  - expr: "1"
    label: |
      $\lambda_1/\pi^2$
  - expr: "m^2"
    label: |
      $\lambda_m/\pi^2$
sliders:
  - name: m
    min: 2
    max: 4
    step: 1
    default: 2
    label: |
      第二项$\sin m\pi x$里的$m$
:::

横轴是$c$，曲线是$[0,1]$上:term[试探函数]{id="math.calculus-of-variations.trial-function"}$\sin\pi x+c\sin m\pi x$的:term[瑞利商]{id="math.calculus-of-variations.rayleigh-quotient"}，以$\pi^2$为单位。两个正弦函数在$[0,1]$上正交，它们的导数也正交，所以$R=\pi^2\frac{1+m^2c^2}{1+c^2}$。曲线只在$c=0$处碰到$\lambda_1$那条线，其余处处在它上面；$|c|$越大，试探函数越像$\sin m\pi x$，$R$越接近它的特征值$\lambda_m=m^2\pi^2$。在$c=0$附近曲线很平，为什么见 p8。

## 例题

### 例 1　用试探函数估计最小特征值

用:term[试探函数]{id="math.calculus-of-variations.trial-function"}$y=x(1-x)$估计$[0,1]$上$-y''=\lambda y$、$y(0)=y(1)=0$的最小特征值，并和精确值比较。

**为什么想到这么做**：$x(1-x)$满足两端为零的条件，在区间内不变号，形状和$\sin\pi x$相似，积分又容易算。

**推导**：$y'=1-2x$，$\int_0^1(1-2x)^2\,\dd x=\frac13$，$\int_0^1x^2(1-x)^2\,\dd x=\frac1{30}$，所以$R[y]=10$。精确值是$\lambda_1=\pi^2\approx9.870$，上界只大了约$1.3\%$。这里没有解任何方程，只算了两个多项式的积分。

### 例 2　密度不均匀的弦

弦的密度随位置变化，方程变成$-y''=\lambda(1+x)y$，$y(0)=y(1)=0$（$x=1$那头更重）。估计最小特征值$\lambda_1$的上界和下界。

**为什么想到这么做**：这时$p=1$、$q=0$、$w=1+x$，:term[瑞利商]{id="math.calculus-of-variations.rayleigh-quotient"}是$R[y]=\frac{\int_0^1y'^2\,\dd x}{\int_0^1(1+x)y^2\,\dd x}$，方程的解不是初等函数。上界用:term[试探函数]{id="math.calculus-of-variations.trial-function"}；下界用$1\le1+x\le2$，和密度为常数的情形比较。

**推导**：试探函数取$\sin\pi x$，分子是$\frac{\pi^2}{2}$。分母里$\int_0^1x\sin^2\pi x\,\dd x=\frac14$（把$x$换成$1-x$，可知它等于$\int_0^1(1-x)\sin^2\pi x\,\dd x$，两者之和是$\frac12$），所以分母是$\frac34$，$\lambda_1\le\frac{2\pi^2}{3}\approx6.580$。另一方面，分母不超过$2\int_0^1y^2\,\dd x$，由定理，$R[y]\ge\frac12\cdot\pi^2\approx4.935$。数值解方程得$\lambda_1\approx6.548$，上界只大了约$0.5\%$；上界已经小于$\pi^2$，弦变重了，基频变低。

## 常见误区

- 「:term[试探函数]{id="math.calculus-of-variations.trial-function"}给出的是最小特征值的下界。」是上界：$\lambda_1$是$R$的最小值，任何试探函数的$R$都不比它小。
- 「试探函数不必满足边界条件。」必须满足。$y\equiv1$不满足$y(0)=y(1)=0$，代进去得$R=0$，比$\lambda_1=\pi^2$还小，估计就失效了。
- 「:term[瑞利商]{id="math.calculus-of-variations.rayleigh-quotient"}的驻点（stationary point）只有最小值点。」每个特征函数都是$R$的驻点，$R$在那里的值是它的特征值；只有属于$\lambda_1$的才是最小值点。
- 「瑞利商只能处理系数为常数的方程。」系数随$x$变化时（例 2）照样能用，分子、分母换成带系数的积分就行，只是一般求不出精确的最小值。

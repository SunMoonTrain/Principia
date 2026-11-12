---
id: math.calculus-of-variations.second-variation
title: |
  第二变分与勒让德条件
goal: |
  会用第二变分判断极值曲线是极小还是极大，并检验勒让德条件。
prerequisites: [math.calculus-of-variations.euler-lagrange, math.vector-calculus.taylor-multivariable]
minutes: 30
summary: |
  局部极小处第二变分非负，沿曲线还要有$F_{y'y'}\ge0$。
status: reviewed
---

## 这一节要回答的问题

:term[欧拉-拉格朗日方程]{id="math.calculus-of-variations.euler-lagrange-equation"}（Euler–Lagrange equation）只保证:term[第一变分]{id="math.calculus-of-variations.first-variation"}（first variation）为零。和函数的驻点（stationary point）一样，:term[极值曲线]{id="math.calculus-of-variations.extremal"}（extremal）可能是极小、极大，也可能都不是。一元函数用二阶导数来判断，:term[泛函]{id="math.calculus-of-variations.functional"}（functional）有没有类似的办法？

## 讲解

### 第二变分

先看一个例子。$J[y]=\int_0^b\bigl(y'^2-y^2\bigr)\dd x$，$y(0)=y(b)=0$，$y=0$是一条:term[极值曲线]{id="math.calculus-of-variations.extremal"}。$J$是二次的，所以$J[\varepsilon\eta]=\varepsilon^2\int_0^b\bigl(\eta'^2-\eta^2\bigr)\dd x$精确成立：:term[第一变分]{id="math.calculus-of-variations.first-variation"}为零，$y=0$是不是极小，全看这个二次项的符号。取$\eta=\sin\frac{\pi x}{b}$，二次项是$\frac b2\bigl(\frac{\pi^2}{b^2}-1\bigr)\varepsilon^2$，$b>\pi$时它是负的，$y=0$就不是极小。

一般地，固定:term[容许函数]{id="math.calculus-of-variations.admissible-function"}（admissible function）$y$和两端为零的$\eta$，令$\Phi(\varepsilon)=J[y+\varepsilon\eta]$。设$F$有连续的二阶偏导数（second-order partial derivative），在积分号下对$\varepsilon$求两次导数，被积函数的二阶导数正是多元泰勒公式（Taylor's formula）里二次项的两倍，即$F$对$(y,p)$的黑塞矩阵（Hessian matrix）作用在$(\eta,\eta')$上：

$$
\Phi''(0)=\int_a^b\bigl(F_{yy}\,\eta^2+2F_{yy'}\,\eta\eta'+F_{y'y'}\,\eta'^2\bigr)\dd x .
$$

::anchor{id="def-second-variation"}
$\delta^2J[y;\eta]=\Phi''(0)$，即上面的积分，叫作$J$在$y$处沿$\eta$的:term[第二变分]{id="math.calculus-of-variations.second-variation"}（second variation）。

为什么这样定义：它是一元函数二阶导数的对应物。$y$是极值曲线、又是局部极小时，$\Phi$在$\varepsilon=0$处取局部极小，$\Phi'(0)=0$，所以$\Phi''(0)\ge0$：对所有$\eta$都有$\delta^2J\ge0$，这是极小的必要条件；极大时反过来，$\delta^2J\le0$。边界情况：第二变分可以对所有$\eta$都为零，这时什么也判断不了。$J[y]=\int_0^1y'^3\,\dd x$、$y(0)=y(1)=0$时，$y=0$处$F_{y'y'}=6y'=0$，$\delta^2J\equiv0$，而$J[\varepsilon\eta]=\varepsilon^3\int_0^1\eta'^3\,\dd x$随$\varepsilon$变号，所以既不是极小也不是极大。

中间一项可以分部积分：$2\eta\eta'=(\eta^2)'$，$\eta$两端为零，$\int_a^b2F_{yy'}\eta\eta'\,\dd x=-\int_a^b\Bigl(\dv{}{x}F_{yy'}\Bigr)\eta^2\,\dd x$。于是

$$
\delta^2J=\int_a^b\bigl(P\,\eta'^2+Q\,\eta^2\bigr)\dd x ,\qquad P=F_{y'y'},\quad Q=F_{yy}-\dv{}{x}F_{yy'} ,
$$

$P$、$Q$都沿极值曲线取值。开头的例子里$P=2$、$Q=-2$（$F=p^2-y^2$），所以$\delta^2J=2\int_0^b(\eta'^2-\eta^2)\,\dd x$。

### 勒让德条件

$P$和$Q$哪个说了算？如果$\eta$是一个又窄又矮的「小鼓包」，宽$2h$、高约$h$，那么$\eta'$的大小和$h$无关，$\int P\eta'^2$约是$h$的一次方，而$\int Q\eta^2$约是$h$的三次方。$h$很小时，:term[第二变分]{id="math.calculus-of-variations.second-variation"}的符号由鼓包所在处$P$的符号决定。

::anchor{id="thm-legendre"}
定理（:term[勒让德条件]{id="math.calculus-of-variations.legendre-condition"}，Legendre condition）：设$F$有连续的二阶偏导数，:term[极值曲线]{id="math.calculus-of-variations.extremal"}$y$有连续的二阶导数。如果$J$在$y$处取局部极小，那么沿这条曲线处处$F_{y'y'}\bigl(x,y(x),y'(x)\bigr)\ge0$；取局部极大时，处处$F_{y'y'}\le0$。

证明思路：假如某点$x_0$处$P(x_0)<0$，在$x_0$附近放上面那样的小鼓包$\eta$，$h$足够小时$\delta^2J<0$，和「极小处$\delta^2J\ge0$」矛盾（完整的证明见 p5）。它只用到$\eta'$可以很大而$\eta$很小，所以只管$F_{y'y'}$，不管$Q$。

勒让德条件检查起来很方便，只要求一个二阶偏导数。长度$F=\sqrt{1+p^2}$的$F_{y'y'}=(1+p^2)^{-3/2}>0$，任何曲线上都满足取极小的条件。但它只是必要条件：开头的例子处处$P=2>0$，$b>\pi$时$y=0$仍然不是极小，因为这时起作用的是$Q$。区间要多长$Q$才压得过$P$，要靠[雅可比条件与共轭点](lesson:math.calculus-of-variations.jacobi-condition)回答。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-0.5, 0.5], y: [-0.8, 5.6] }
functions:
  - expr: "b/2*(pi^2/b^2 - 1)*x^2"
    label: |
      $J[\varepsilon\eta_1]$，$\eta_1=\sin\frac{\pi x}{b}$
  - expr: "b/2*(9*pi^2/b^2 - 1)*x^2"
    label: |
      $J[\varepsilon\eta_2]$，$\eta_2=\sin\frac{3\pi x}{b}$
sliders:
  - name: b
    min: 2
    max: 6
    step: 0.05
    default: 2.5
    label: |
      区间长度$b$
:::

横轴是$\varepsilon$，两条抛物线是开头的:term[泛函]{id="math.calculus-of-variations.functional"}$J=\int_0^b(y'^2-y^2)\,\dd x$沿两个方向变动时的值。$b<\pi$时都开口向上；$b$超过$\pi$，平缓的$\eta_1$方向先翻成开口向下，$y=0$不再是极小；振荡得快的$\eta_2$在图中的范围里一直开口向上。振荡得越快，$\eta'^2$那一项越占上风，这正是:term[勒让德条件]{id="math.calculus-of-variations.legendre-condition"}看的方向。

## 例题

### 例 1　谐振子型泛函的第二变分

求$J[y]=\int_0^b\bigl(y'^2-y^2\bigr)\dd x$在:term[极值曲线]{id="math.calculus-of-variations.extremal"}$y=0$处的$P$、$Q$，检验:term[勒让德条件]{id="math.calculus-of-variations.legendre-condition"}，并说明$b>\pi$时$y=0$不是局部极小。

**为什么想到这么做**：$F=p^2-y^2$的二阶偏导数都是常数，$P$、$Q$可以直接写出；要说明「不是极小」，只要找一个使:term[第二变分]{id="math.calculus-of-variations.second-variation"}为负的方向。

**推导**：$F_{yy}=-2$，$F_{yy'}=0$，$F_{y'y'}=2$，所以$P=2>0$，勒让德条件满足；$Q=-2$。取$\eta=\sin\frac{\pi x}{b}$，$\int_0^b\eta'^2\,\dd x=\frac{\pi^2}{2b}$，$\int_0^b\eta^2\,\dd x=\frac b2$，

$$
\delta^2J=2\Bigl(\frac{\pi^2}{2b}-\frac b2\Bigr)=\frac{\pi^2-b^2}{b} ,
$$

$b>\pi$时为负。$J$是二次的，$J[\varepsilon\eta]=\frac12\varepsilon^2\delta^2J<0=J[0]$，所以$y=0$不是局部极小。$b<\pi$时这个$\eta$给出正值，但这还不能说明$y=0$是极小，要对所有$\eta$都成立才行。

### 例 2　勒让德条件挑掉的直线

$J[y]=\int_0^1\bigl(y'^2-1\bigr)^2\dd x$，$y(0)=y(1)=0$。说明:term[极值曲线]{id="math.calculus-of-variations.extremal"}$y=0$不满足取极小的:term[勒让德条件]{id="math.calculus-of-variations.legendre-condition"}，并找一列函数，使$J$的值比$J[0]$小。

**为什么想到这么做**：$F=(p^2-1)^2$只含$p$，方程说明$F_{y'}$是常数，极值曲线是直线，过两端点的是$y=0$。在$p=0$处求$F_{y'y'}$，看符号。

**推导**：$F_{y'y'}=12p^2-4$，在$y=0$上等于$-4<0$，勒让德条件不满足，$y=0$不可能是局部极小。具体地，取斜率在$1$和$-1$之间来回切换的锯齿形曲线（把尖角磨圆一点使导数连续），被积函数除磨圆的小段外都是$0$，$J$可以任意接近$0$，而$J[0]=1$。被积函数$(p^2-1)^2$在$p=0$附近是向下弯的，平均地取$p=\pm1$反而更好，勒让德条件说的就是这件事。

## 常见误区

- 「:term[勒让德条件]{id="math.calculus-of-variations.legendre-condition"}满足了，就是极小。」它只是必要条件。例 1 处处$P=2>0$，$b>\pi$时仍不是极小。
- 「$F_{yy'}\eta\eta'$这一项可以略去。」不能略去；分部积分以后它并进$Q$，和$F_{yy}$一起决定$\eta^2$的系数。
- 「在一个方向上$\delta^2J>0$，就说明是极小。」要对所有两端为零的$\eta$都成立；例 1 中$b<\pi$时$\eta=\sin\frac{\pi x}{b}$给出正值，单凭它下不了结论。
- 「:term[第二变分]{id="math.calculus-of-variations.second-variation"}为零就说明是极小。」第二变分为零时什么也判断不了，讲解里$\int y'^3\,\dd x$的例子既不是极小也不是极大。

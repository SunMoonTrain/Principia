---
id: math.calculus-of-variations.euler-lagrange
title: |
  第一变分与欧拉-拉格朗日方程
goal: |
  会由第一变分为零推出欧拉-拉格朗日方程，并用它求简单泛函的极值曲线。
prerequisites: [math.calculus-of-variations.functionals, math.calculus.integration-by-parts, math.vector-calculus.multivariable-chain-rule]
minutes: 30
summary: |
  光滑的局部极值满足欧拉-拉格朗日方程$F_y-\dv{}{x}F_{y'}=0$。
status: reviewed
---

## 这一节要回答的问题

可导函数在极值点处导数为零，这个条件把找极值点变成了解方程。[泛函与变分问题](lesson:math.calculus-of-variations.functionals)把:term[泛函]{id="math.calculus-of-variations.functional"}（functional）沿一个方向化成了一元函数$\Phi(\varepsilon)=J[y+\varepsilon\eta]$。如果对每个方向都有$\Phi'(0)=0$，能推出$y$满足什么方程？

## 讲解

### 第一变分

下面总设$J[y]=\int_a^bF(x,y,y')\,\dd x$，$F(x,y,p)$有连续的二阶偏导数（partial derivative），:term[容许函数]{id="math.calculus-of-variations.admissible-function"}（admissible function）$y$有连续的二阶导数。$\eta$取在$[a,b]$上有连续导数、两端为零的函数，这样$y+\varepsilon\eta$满足同样的端点条件。

::anchor{id="def-first-variation"}
$\delta J[y;\eta]=\dv{}{\varepsilon}J[y+\varepsilon\eta]\Big|_{\varepsilon=0}$叫作$J$在$y$处沿$\eta$的:term[第一变分]{id="math.calculus-of-variations.first-variation"}（first variation），不必写明$\eta$时简写成$\delta J$。

为什么这样定义：它就是上一节的$\Phi'(0)$，把「:term[泛函]{id="math.calculus-of-variations.functional"}在一个函数处的导数」化成了一元函数的导数，只用到一元微积分。局部极值处，由费马定理（Fermat's theorem），对每个$\eta$都有$\delta J=0$。边界情况：反过来不成立，就像$x^3$在$0$处导数为零却不取极值。$J[y]=\int_0^1y'^3\,\dd x$、$y(0)=y(1)=0$时，$y=0$处$\delta J=0$，但取$\eta=x(1-x)^2$，$J[\varepsilon\eta]=\varepsilon^3\int_0^1\eta'^3\,\dd x=\frac{2}{35}\varepsilon^3$随$\varepsilon$的正负变号。

### 算出第一变分

令$\Phi(\varepsilon)=\int_a^bF(x,y+\varepsilon\eta,y'+\varepsilon\eta')\,\dd x$。在积分号下对$\varepsilon$求导，由多元复合函数的链式法则（chain rule），被积函数对$\varepsilon$的导数在$\varepsilon=0$处是$F_y\eta+F_{y'}\eta'$，所以

$$
\delta J=\int_a^b\bigl(F_y\,\eta+F_{y'}\,\eta'\bigr)\dd x .
$$

这里$F_y$、$F_{y'}$是$F(x,y,p)$对第二、第三个变量的偏导数，再代入$y=y(x)$、$p=y'(x)$，它们都是$x$的函数。交换求导和积分的次序要求被积函数对$\varepsilon$的偏导数连续，这里满足；严格的证明见数学分析的[含参变量积分](lesson:math.analysis.parameter-integrals)。

$y$有连续的二阶导数，$F_{y'}\bigl(x,y(x),y'(x)\bigr)$就有连续导数，第二项可以分部积分（integration by parts）：$\int_a^bF_{y'}\eta'\,\dd x=\bigl[F_{y'}\eta\bigr]_a^b-\int_a^b\dv{}{x}F_{y'}\,\eta\,\dd x$，而$\eta(a)=\eta(b)=0$，方括号为零。于是

$$
\delta J=\int_a^b\Bigl(F_y-\dv{}{x}F_{y'}\Bigr)\eta\,\dd x .
$$

### 变分法基本引理

::anchor{id="thm-fundamental-lemma"}
引理（:term[变分法基本引理]{id="math.calculus-of-variations.fundamental-lemma"}，fundamental lemma of the calculus of variations）：设$g$在$[a,b]$上连续。如果对所有在$[a,b]$上有连续导数、两端为零的$\eta$都有$\int_a^bg\,\eta\,\dd x=0$，那么$g$在$[a,b]$上恒为零。

证明思路：假如某点$x_0\in(a,b)$处$g(x_0)>0$，由连续性，$g$在某个小区间$[x_0-r,x_0+r]$上都是正的。取$\eta$在这个小区间上等于$(x-x_0+r)^2(x_0+r-x)^2$、在别处为零，它有连续导数、两端为零，而$\int_a^bg\,\eta\,\dd x>0$，矛盾。$g(x_0)<0$时同理，端点处的值再由连续性得到（完整的证明见 p5）。

### 欧拉-拉格朗日方程

::anchor{id="thm-euler-lagrange"}
定理（:term[欧拉-拉格朗日方程]{id="math.calculus-of-variations.euler-lagrange-equation"}，Euler–Lagrange equation）：在上面的假设下，如果$J$在:term[容许函数]{id="math.calculus-of-variations.admissible-function"}$y$处取局部极值，那么在$[a,b]$上$F_y-\dv{}{x}F_{y'}=0$。

证明思路：局部极值处$\delta J=0$对所有$\eta$成立；上一小节的式子说$\int_a^b\bigl(F_y-\dv{}{x}F_{y'}\bigr)\eta\,\dd x=0$，括号里是连续函数，由:term[基本引理]{id="math.calculus-of-variations.fundamental-lemma"}，它恒为零。只假设$y$有连续的一阶导数时，结论仍然成立，但不能直接分部积分，要换一个引理（p5）。

用链式法则展开，$\dv{}{x}F_{y'}=F_{y'x}+F_{y'y}\,y'+F_{y'y'}\,y''$，所以$F_{y'y'}\ne0$时方程是关于$y$的二阶微分方程（differential equation）。它的通解含两个任意常数，正好由两个端点条件定下来。

::anchor{id="def-extremal"}
有连续二阶导数、满足欧拉-拉格朗日方程的函数，叫作$J$的:term[极值曲线]{id="math.calculus-of-variations.extremal"}（extremal）。

为什么这样定义：定理说足够光滑的局部极值一定是极值曲线，所以先解方程找出极值曲线，再从中挑出满足端点条件、真正取极值的那一条。名字是历史沿用的，极值曲线只保证$\delta J=0$，相当于函数的驻点（stationary point），不一定取极值。边界情况：$F$不含$y'$时，方程$F_y=0$里没有导数，一般满足不了端点条件。例如$J[y]=\int_0^1(y-x)^2\,\dd x$、$y(0)=1$、$y(1)=0$，方程给出$y=x$，两个端点条件都不满足，这个问题没有极值曲线。

### 被积函数不含$y$的情形

$F$不含$y$时$F_y=0$，方程变成$\dv{}{x}F_{y'}=0$，积分一次就是$F_{y'}=C$：一个只含$x$、$y'$的一阶方程，常常能直接解出$y'$。例如$L[y]=\int_a^b\sqrt{1+y'^2}\,\dd x$，$F_{y'}=\frac{y'}{\sqrt{1+y'^2}}=C$，所以$y'$是常数，:term[极值曲线]{id="math.calculus-of-variations.extremal"}是直线，和上一节例 2 用不等式得到的一致。$F$不含$x$时也能积分一次，见[贝尔特拉米恒等式与最速降线](lesson:math.calculus-of-variations.beltrami-identity)。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 1], y: [-0.8, 1.6] }
functions:
  - expr: "(1-s)*x + s*x^3"
    label: |
      $y_s=(1-s)x+sx^3$
  - expr: "(1-s)*x + s*x^3 + a*sin(pi*x)"
    label: |
      $y_s+\varepsilon\sin\pi x$
sliders:
  - name: s
    min: 0
    max: 1
    step: 0.05
    default: 1
    label: |
      $s$：从直线$y=x$（$s=0$）变到$y=x^3$（$s=1$）
  - name: a
    min: -0.6
    max: 0.6
    step: 0.05
    default: 0.3
    label: |
      变动的幅度$\varepsilon$
:::

:::anim{component="function-plot"}
range: { x: [-0.6, 0.6], y: [4, 9.2] }
functions:
  - expr: "(1-s)^2 + 2*s*(1-s) + 9*s^2/5 + 4*(1-s) + 12*s/5 + 12*(1-s)/pi*x + pi^2/2*x^2"
    label: |
      $\Phi(\varepsilon)=J[y_s+\varepsilon\sin\pi x]$
points:
  - { x: "0", y: "(1-s)^2 + 2*s*(1-s) + 9*s^2/5 + 4*(1-s) + 12*s/5" }
sliders:
  - name: s
    min: 0
    max: 1
    step: 0.05
    default: 0
    label: |
      $s$：从直线$y=x$（$s=0$）变到$y=x^3$（$s=1$）
:::

两张图看的是例 1 的:term[泛函]{id="math.calculus-of-variations.functional"}$J[y]=\int_0^1(y'^2+12xy)\,\dd x$。上图是两端固定在$(0,0)$、$(1,1)$的一族曲线$y_s$，以及沿$\eta=\sin\pi x$变动后的曲线；下图的横轴是$\varepsilon$，曲线是$\Phi(\varepsilon)$，点标出$\varepsilon=0$。$s=0$（直线）时$\Phi$在$0$处斜率不为零，往负的$\varepsilon$走$J$还能变小，直线不是极小；拖到$s=1$，$\Phi$的最低点正好落在$\varepsilon=0$，这时$y=x^3$是:term[极值曲线]{id="math.calculus-of-variations.extremal"}。

## 例题

### 例 1　一个二次泛函

求$J[y]=\int_0^1\bigl(y'^2+12xy\bigr)\dd x$在$y(0)=0$、$y(1)=1$下的:term[极值曲线]{id="math.calculus-of-variations.extremal"}，并说明它确实使$J$最小。

**为什么想到这么做**：$F=p^2+12xy$对$y$、$p$的偏导数都很简单，:term[欧拉-拉格朗日方程]{id="math.calculus-of-variations.euler-lagrange-equation"}是一个能直接积分两次的二阶方程。$J$是二次的，把$J[y+\eta]$展开，展开式是精确的，可以直接比较大小。

**推导**：$F_y=12x$，$F_{y'}=2y'$，方程是$12x-2y''=0$，即$y''=6x$。积分两次，$y=x^3+C_1x+C_2$；由$y(0)=0$得$C_2=0$，由$y(1)=1$得$C_1=0$，所以$y=x^3$。

任取满足同样端点条件的:term[容许函数]{id="math.calculus-of-variations.admissible-function"}，写成$y+\eta$，$\eta(0)=\eta(1)=0$，展开得

$$
J[y+\eta]=J[y]+\int_0^1\bigl(2y'\eta'+12x\eta\bigr)\dd x+\int_0^1\eta'^2\,\dd x .
$$

中间一项正是$\delta J[y;\eta]$，分部积分后等于$\int_0^1(12x-2y'')\eta\,\dd x=0$。所以$J[y+\eta]=J[y]+\int_0^1\eta'^2\,\dd x\ge J[y]$，等号只在$\eta'\equiv0$、即$\eta\equiv0$时成立：$y=x^3$是唯一的最小值点，最小值$J[x^3]=\frac{21}{5}$。

### 例 2　一种「越靠近$y$轴越长」的长度

在$x>0$的半平面上，规定一段曲线的「长度」是$\int\frac{\sqrt{1+y'^2}}{x}\,\dd x$：同样一段，越靠近$y$轴算得越长。求这种长度的:term[极值曲线]{id="math.calculus-of-variations.extremal"}。

**为什么想到这么做**：$F=\frac{\sqrt{1+p^2}}{x}$不含$y$，方程可以积分一次，得到$F_{y'}=C$，再解出$y'$。

**推导**：$F_{y'}=\frac{y'}{x\sqrt{1+y'^2}}=C$。$C=0$时$y'=0$，极值曲线是水平线。$C\ne0$时两边平方，$y'^2=C^2x^2(1+y'^2)$，解出$y'=\frac{Cx}{\sqrt{1-C^2x^2}}$（$y'$和$C$同号）。注意到$\dv{}{x}\sqrt{1-C^2x^2}=-\frac{C^2x}{\sqrt{1-C^2x^2}}$，积分得

$$
y=D-\frac1C\sqrt{1-C^2x^2},\qquad\text{即}\qquad x^2+(y-D)^2=\frac{1}{C^2} .
$$

极值曲线是圆心在$y$轴上的圆（落在$x>0$的部分）和水平线。这种长度是双曲几何（hyperbolic geometry）的一种模型，这些圆弧和水平线就是它的「直线」。

## 常见误区

- 「$\dv{}{x}F_{y'}$是把$F_{y'}$对$x$求偏导数。」不对：先代入$y=y(x)$、$p=y'(x)$，再对$x$求导，$y$、$y'$也跟着$x$变，展开是$F_{y'x}+F_{y'y}y'+F_{y'y'}y''$。
- 「对$F$求$F_y$时把$y'$当常数，这是一种近似。」不是近似：$F(x,y,p)$本来就是三个独立变量的函数，偏导数照常求；$y$和$y'$的联系体现在$\dv{}{x}$里。
- 「解出:term[欧拉-拉格朗日方程]{id="math.calculus-of-variations.euler-lagrange-equation"}，就找到了最小值。」方程只是必要条件：:term[极值曲线]{id="math.calculus-of-variations.extremal"}可能是极大、极小，也可能都不是；最小值也可能根本不存在。例 1 能下结论，是因为另外证明了$J[y+\eta]\ge J[y]$。
- 「:term[变分法基本引理]{id="math.calculus-of-variations.fundamental-lemma"}要用到很古怪的$\eta$。」证明里只用了一个「小鼓包」，它有连续导数，而且只在一个小区间上不为零。

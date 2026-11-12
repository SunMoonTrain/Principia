---
id: math.vector-calculus.taylor-multivariable
title: |
  多元泰勒公式与黑塞矩阵
goal: |
  会写出二元函数的二阶泰勒公式和黑塞矩阵。
prerequisites: [math.vector-calculus.multivariable-chain-rule, math.calculus.taylor-polynomial]
minutes: 35
summary: |
  二阶泰勒公式的二次项由黑塞矩阵给出，它决定驻点附近的形状。
status: reviewed
---

## 这一节要回答的问题

在两个:term[一阶偏导数]{id="math.vector-calculus.partial-derivative"}（first-order partial derivative）都为零的点，:term[切平面]{id="math.vector-calculus.tangent-plane"}（tangent plane）是水平的，一阶近似只说「函数几乎不变」，分不出那里是碗底、山顶还是马鞍。一元函数要看二阶导数：$f(a+h)\approx f(a)+f'(a)h+\frac12f''(a)h^2$。:term[二元函数]{id="math.vector-calculus.multivariable-function"}（function of two variables）的二阶近似长什么样，二次项由什么决定？它怎样告诉我们:term[驻点]{id="math.vector-calculus.stationary-point"}（stationary point）附近的形状？

## 讲解

### 二阶泰勒公式

::anchor{id="thm-taylor"}
**二阶的:term[多元泰勒公式]{id="math.vector-calculus.taylor-formula"}（Taylor's formula）**　设$f$在$(a,b)$附近有:term[连续]{id="math.vector-calculus.continuous"}（continuous）的:term[二阶偏导数]{id="math.vector-calculus.second-partial-derivative"}（second-order partial derivative），则$f(a+h,b+k)=f(a,b)+f_xh+f_yk+\frac12\bigl(f_{xx}h^2+2f_{xy}hk+f_{yy}k^2\bigr)+r(h,k)$，其中各:term[偏导数]{id="math.vector-calculus.partial-derivative"}都在$(a,b)$处取值，并且$(h,k)\to(0,0)$时$\frac{r(h,k)}{h^2+k^2}\to0$。

**证明思路**：把$f$限制在线段上，令$g(t)=f(a+th,b+tk)$。由:term[链式法则]{id="math.vector-calculus.chain-rule"}（chain rule），$g'(t)=f_xh+f_yk$，再用一次得$g''(t)=f_{xx}h^2+2f_{xy}hk+f_{yy}k^2$，偏导数在$(a+th,b+tk)$处取值，两个混合项由:term[施瓦茨定理]{id="math.vector-calculus.schwarz-theorem"}（Schwarz's theorem）合并成$2f_{xy}hk$。令$\varphi(t)=g(t)-g(0)-g'(0)t-\frac12g''(0)t^2$，$\varphi(0)=\varphi'(0)=0$，对$\varphi$、$\varphi'$各用一次微分中值定理（mean value theorem，见[微分中值定理](lesson:math.calculus.mean-value-theorem)），得$r=\varphi(1)=\varphi''(\theta)\theta_1$，$0<\theta<\theta_1<1$；而$\varphi''(\theta)=g''(\theta)-g''(0)$，二阶偏导数连续，它比$h^2+k^2$小得多。

为什么是这个样子：沿线段看，就是一元的泰勒公式$g(1)\approx g(0)+g'(0)+\frac12g''(0)$（见[泰勒公式](lesson:math.calculus.taylor-polynomial)）。一次项是:term[全微分]{id="math.vector-calculus.total-differential"}（total differential），二次项是$h$、$k$的二次式，三个系数是三个二阶偏导数。$n$元函数同样有$f(\vb a+\vb h)=f(\vb a)+\sum_i\pdv{f}{x_i}(\vb a)h_i+\frac12\sum_{i,j}\frac{\partial^2f}{\partial x_i\,\partial x_j}(\vb a)h_ih_j+r$，$\frac{r}{|\vb h|^2}\to0$。

### 黑塞矩阵

::anchor{id="def-hessian"}
$f$的:term[二阶偏导数]{id="math.vector-calculus.second-partial-derivative"}在$\vb a$处都存在时，$n\times n$矩阵$H_f(\vb a)$，第$i$行第$j$列是先对$x_i$、再对$x_j$求的二阶偏导数$f_{x_ix_j}(\vb a)=\frac{\partial^2f}{\partial x_j\,\partial x_i}(\vb a)$，叫作$f$在$\vb a$处的:term[黑塞矩阵]{id="math.vector-calculus.hessian-matrix"}（Hessian matrix）。二元时$H_f=\begin{pmatrix}f_{xx}&f_{xy}\\f_{yx}&f_{yy}\end{pmatrix}$。

为什么这样定义：记$H_{ij}$为第$i$行第$j$列的元素，:term[二阶泰勒公式]{id="math.vector-calculus.taylor-formula"}的二次项正是$\frac12\sum_{i,j}H_{ij}h_ih_j$，和一元的$f(a)+f'(a)h+\frac12f''(a)h^2$一一对应，黑塞矩阵扮演二阶导数的角色。二阶偏导数:term[连续]{id="math.vector-calculus.continuous"}时，由:term[施瓦茨定理]{id="math.vector-calculus.schwarz-theorem"}，$H_{ij}=H_{ji}$，黑塞矩阵关于主对角线（main diagonal）对称。边界情况：一元时它就是只有一个元素$f''(a)$的矩阵。

### 驻点附近的形状

::anchor{id="def-stationary-point"}
使$f$的各个:term[一阶偏导数]{id="math.vector-calculus.partial-derivative"}都为$0$的点叫作$f$的:term[驻点]{id="math.vector-calculus.stationary-point"}；二元时就是$f_x=f_y=0$的点。

为什么这样定义：在驻点，:term[二阶泰勒公式]{id="math.vector-calculus.taylor-formula"}的一次项消失，:term[切平面]{id="math.vector-calculus.tangent-plane"}是水平的。:term[可微]{id="math.vector-calculus.differentiable"}（differentiable）的函数在定义域内部取到局部极大或极小的点一定是驻点，因为沿每条坐标方向的直线，一元函数都在那里取极值，导数为$0$（见[极值与费马定理](lesson:math.calculus.local-extrema)）。

::anchor{id="def-saddle-point"}
反过来不对：$x^2-y^2$在原点是驻点，沿$x$轴是极小、沿$y$轴是极大，原点不是极值点。这样不是局部极值点的驻点叫作:term[鞍点]{id="math.vector-calculus.saddle-point"}（saddle point），$x^2-y^2$的图像在原点附近正像马鞍。

在驻点，$f(\vb a+\vb h)-f(\vb a)=\frac12\sum_{i,j}H_{ij}h_ih_j+r$。只要二次项不比$|\vb h|^2$小，它就压过余项，决定函数值比$f(\vb a)$大还是小。

::anchor{id="thm-hessian-min"}
**:term[黑塞矩阵]{id="math.vector-calculus.hessian-matrix"}与极小**　设$f$在$\vb a$附近有:term[连续]{id="math.vector-calculus.continuous"}的:term[二阶偏导数]{id="math.vector-calculus.second-partial-derivative"}，$\vb a$是:term[驻点]{id="math.vector-calculus.stationary-point"}，并且有常数$m>0$，使对所有$\vb h$都有$\sum_{i,j}H_{ij}h_ih_j\ge m|\vb h|^2$（$H_{ij}$在$\vb a$处取值），则$\vb a$是$f$的严格局部极小点：$\vb a$附近的其他点处都有$f>f(\vb a)$。

**证明思路**：由二阶泰勒公式，$f(\vb a+\vb h)-f(\vb a)=\frac12\sum_{i,j}H_{ij}h_ih_j+r\ge\frac m2|\vb h|^2-|r|$。$\frac{r}{|\vb h|^2}\to0$，所以$|\vb h|$足够小时$|r|<\frac m4|\vb h|^2$，于是差值大于$\frac m4|\vb h|^2>0$。

二元时，若$f_{xx}>0$、$f_{xx}f_{yy}-f_{xy}^2>0$（在$\vb a$处取值），这样的$m$就存在（证明见第 5 题）。关于主对角线对称、并且对所有$\vb h\ne\vb0$都有$\sum_{i,j}H_{ij}h_ih_j>0$的矩阵，就是线性代数里的:term[正定]{id="math.linear-algebra.positive-definite"}（positive definite）矩阵，正定的矩阵总有这样的$m$（见[二次型与正定矩阵](lesson:math.linear-algebra.quadratic-forms)），所以常说「驻点处黑塞矩阵正定，就是严格局部极小」。把$f$换成$-f$得到极大的条件；$f_{xx}f_{yy}-f_{xy}^2<0$时二次项沿一些方向为正、沿另一些方向为负，驻点是鞍点，完整的判别留到[多元函数的极值](lesson:math.vector-calculus.extrema)。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-2, 2], y: [-4.5, 6] }
functions:
  - expr: "(1 + b*sin(2*th*pi/180)/2) * x^2"
    label: |
      沿方向$\theta$的截线$f(t\cos\theta,t\sin\theta)$
points:
  - { x: "0", y: "0" }
sliders:
  - name: b
    min: -4
    max: 4
    step: 0.5
    default: 3
    label: |
      $f=x^2+bxy+y^2$里的$b$
  - name: th
    min: 0
    max: 180
    step: 15
    default: 45
    label: |
      方向角$\theta$（度）
:::

动画里$f(x,y)=x^2+bxy+y^2$，原点是:term[驻点]{id="math.vector-calculus.stationary-point"}，:term[黑塞矩阵]{id="math.vector-calculus.hessian-matrix"}是$\begin{pmatrix}2&b\\b&2\end{pmatrix}$。画的是沿方向$(\cos\theta,\sin\theta)$的截线$f(t\cos\theta,t\sin\theta)=\bigl(1+\frac b2\sin2\theta\bigr)t^2$，图上横轴写作$x$，表示沿这个方向走过的距离$t$。默认$b=3$：拖动$\theta$，$\theta=45^\circ$时截线开口向上，$\theta=135^\circ$时开口向下，原点是:term[鞍点]{id="math.vector-calculus.saddle-point"}，此时$f_{xx}f_{yy}-f_{xy}^2=4-b^2<0$。把$b$调到$-2$和$2$之间，不管$\theta$取多少开口都向上，原点是极小点，正好是$4-b^2>0$的情形。

## 例题

### 例 1　写出二阶泰勒公式

写出$f(x,y)=e^x\cos y$在$(0,0)$处的:term[二阶泰勒公式]{id="math.vector-calculus.taylor-formula"}（不写余项），并用它估计$f(0.1,0.2)$。

**为什么想到这么做**：求出$(0,0)$处的函数值、两个:term[一阶偏导数]{id="math.vector-calculus.partial-derivative"}和三个:term[二阶偏导数]{id="math.vector-calculus.second-partial-derivative"}，代进:term[多元泰勒公式]{id="math.vector-calculus.taylor-formula"}。

**推导**：$f=1$；$f_x=e^x\cos y=1$，$f_y=-e^x\sin y=0$；$f_{xx}=e^x\cos y=1$，$f_{xy}=-e^x\sin y=0$，$f_{yy}=-e^x\cos y=-1$。所以$f(x,y)\approx1+x+\frac12(x^2-y^2)$。代入得$1+0.1+\frac12(0.01-0.04)=1.085$，实际值$e^{0.1}\cos0.2\approx1.0831$，误差约$0.002$，比$x^2+y^2=0.05$小得多。

### 例 2　判断驻点附近的形状

$f(x,y)=x^3-3x+y^2$。求它的:term[驻点]{id="math.vector-calculus.stationary-point"}，并判断每个驻点是严格局部极小点还是:term[鞍点]{id="math.vector-calculus.saddle-point"}。

**为什么想到这么做**：先解$f_x=f_y=0$，再看每个:term[驻点]{id="math.vector-calculus.stationary-point"}处的:term[黑塞矩阵]{id="math.vector-calculus.hessian-matrix"}。

**推导**：$f_x=3x^2-3$，$f_y=2y$，驻点是$(1,0)$和$(-1,0)$。$H=\begin{pmatrix}6x&0\\0&2\end{pmatrix}$。在$(1,0)$处$f_{xx}=6>0$、$f_{xx}f_{yy}-f_{xy}^2=12>0$，是严格局部极小点；验算：$f(1+h,k)-f(1,0)=3h^2+h^3+k^2$，$|h|<3$时为正（$(h,k)\ne(0,0)$）。在$(-1,0)$处$f_{xx}f_{yy}-f_{xy}^2=-12<0$：沿$x$方向$f(-1+h,0)-f(-1,0)=-3h^2+h^3$为负，沿$y$方向$f(-1,k)-f(-1,0)=k^2$为正，是鞍点。

## 常见误区

- 「:term[驻点]{id="math.vector-calculus.stationary-point"}就是极值点。」例 2 的$(-1,0)$是驻点，沿$x$方向是极大、沿$y$方向是极小，不是极值点。
- 「$f_{xx}>0$、$f_{yy}>0$，驻点就是极小点。」还要$f_{xx}f_{yy}-f_{xy}^2>0$；$x^2+3xy+y^2$在原点$f_{xx}=f_{yy}=2$，沿$y=-x$却是$-x^2$。
- 「:term[二阶泰勒公式]{id="math.vector-calculus.taylor-formula"}总能判断驻点的类型。」二次项退化时判断不了：$x^4+y^4$和$x^4-y^4$在原点的:term[黑塞矩阵]{id="math.vector-calculus.hessian-matrix"}元素全是$0$，一个是极小点，一个是:term[鞍点]{id="math.vector-calculus.saddle-point"}，要看更高阶的项。
- 「黑塞矩阵总是对称的。」要:term[混合偏导数]{id="math.vector-calculus.mixed-partial-derivative"}（mixed partial derivative）在这一点:term[连续]{id="math.vector-calculus.continuous"}；[偏导数](lesson:math.vector-calculus.partial-derivatives)第 6 题的函数在原点$f_{xy}=-1$、$f_{yx}=1$。

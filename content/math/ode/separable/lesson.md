---
id: math.ode.separable
title: |
  可分离变量的方程
goal: |
  会解可分离变量的方程，并用它描述指数增长和逻辑斯谛增长。
prerequisites: [math.ode.what-is-ode, math.calculus.partial-fractions]
minutes: 30
summary: |
  把$y$和$x$分到两边分别积分；常数解要单独找回来。
status: reviewed
---

## 这一节要回答的问题

[微分方程与方向场](lesson:math.ode.what-is-ode)里，$m'=-km$的解$Ce^{-kt}$是猜出来的。遇到$y'=xy$、$y'=y(1-y)$这样的方程，能不能有章法地解出来？人口不会无限地按指数增长（exponential growth），资源有限时，增长的曲线又是什么样子？

## 讲解

### 分离变量

先看$y'=xy$。在$y\ne0$的地方两边除以$y$，得$\frac{y'}{y}=x$，左边正是$\ln|y|$对$x$的导数，所以$\ln|y|=\frac{x^2}{2}+C$，$y=Ae^{x^2/2}$（$A=\pm e^C\ne0$）。被除掉的$y=0$也是解，它对应$A=0$，所以:term[通解]{id="math.ode.general-solution"}（general solution）是$y=Ae^{x^2/2}$，$A$任意。

::anchor{id="def-separable"}
能写成$y'=g(x)h(y)$的一阶方程，叫作:term[可分离变量的方程]{id="math.ode.separable-equation"}（separable equation）。

为什么这样定义：右边拆成「只含$x$的因子」乘「只含$y$的因子」，就能把$y$和$x$分到等号两边，各自求原函数（antiderivative）。边界情况：$y'=x+y$拆不成这样的乘积，要用别的办法，见[一阶线性方程与积分因子](lesson:math.ode.linear-first-order)；$y'=e^{x+y}$看起来不像，其实$e^{x+y}=e^xe^y$，可以分离。

::anchor{id="thm-separation"}
**解法**　设$g$、$h$连续。(1) 使$h(y^*)=0$的每个常数$y^*$，给出常数解$y\equiv y^*$。(2) 在$h(y)\ne0$的地方，记$H$是$\frac{1}{h(y)}$的一个原函数，$G$是$g(x)$的一个原函数，则解满足$H(y)=G(x)+C$。

**为什么成立**：设$y(x)$是解，并且$h(y(x))\ne0$。由链式法则（chain rule），$\frac{\dd}{\dd x}H(y(x))=\frac{y'(x)}{h(y(x))}=g(x)$，所以$H(y(x))$和$G(x)$的导数相同，只差一个常数。常把这一步写成$\frac{\dd y}{h(y)}=g(x)\dd x$、两边积分，那只是这个推导的速记。

为什么想到这么做：右边是乘积，除以$h(y)$就把含$y$的部分全挪到了左边，左边恰好是某个函数$H(y(x))$的导数。代价是除法：$h(y)=0$的那些常数解在这一步被丢掉了，所以 (1) 要单独列出来。

### 指数增长与衰减

最简单的:term[可分离变量的方程]{id="math.ode.separable-equation"}是$y'=ky$。由上面的解法，它的:term[通解]{id="math.ode.general-solution"}是$y=y_0e^{kx}$，$y_0$是$x=0$时的值。

::anchor{id="def-exponential-growth"}
$y'=ky$的解$y=y_0e^{kx}$，$k>0$时叫作指数增长（exponential growth），$k<0$时叫作指数衰减（exponential decay）。增长时，$y$变成原来两倍所用的时间$\frac{\ln2}{k}$叫作倍增时间（doubling time）；衰减时，$y$减少一半所用的时间$\frac{\ln2}{|k|}$叫作半衰期（half-life）。

为什么这样定义：$y$变化的快慢与$y$本身成正比时，每过一段同样长的时间，$y$都乘以同样的倍数$e^{k\Delta x}$，所以倍增时间、半衰期是常数，和从哪一刻开始算无关。边界情况：$k=0$时$y$是常数，既不增长也不衰减，倍增时间没有意义。

### 逻辑斯谛方程

资源有限时，人口越多，每个人分到的资源越少，增长率$\frac{y'}{y}$随$y$增大而下降。最简单的假设是它随$y$线性下降，在某个数量$K$处降到$0$。

::anchor{id="def-logistic"}
方程$y'=ry\bigl(1-\frac{y}{K}\bigr)$（$r>0$，$K>0$）叫作:term[逻辑斯谛方程]{id="math.ode.logistic-equation"}（logistic equation），$K$叫作:term[环境容纳量]{id="math.ode.carrying-capacity"}（carrying capacity）。

为什么这样定义：$y$很小时，括号接近$1$，方程接近指数增长$y'=ry$；$y$接近$K$时，括号接近$0$，增长停了下来。边界情况：$y=0$和$y=K$是两个常数解；$y>K$时右边是负的，数量会下降，回到$K$。

它是:term[可分离变量的方程]{id="math.ode.separable-equation"}。例 2 用部分分式（partial fractions）解出：$y(0)=y_0>0$时$y=\frac{K}{1+Ae^{-rt}}$，$A=\frac{K-y_0}{y_0}$。$t\to+\infty$时$y\to K$；$0<y_0<\frac K2$时，曲线先越来越陡，越过$\frac K2$以后变缓，是一条 S 形曲线。

## 几何图像

:::anim{component="phase-portrait"}
system: { x: "1", y: "r*y*(1 - y)" }
range: { x: [0, 12], y: [-0.2, 1.5] }
dt: 0.01
trail: full
initial:
  - [0, 0.05]
  - [0, 0.2]
  - [0, 0.5]
  - [0, 1.4]
  - [0, 0]
sliders:
  - name: r
    min: 0.5
    max: 2
    step: 0.1
    default: 1
    label: |
      增长率$r$
:::

这是$K=1$的:term[逻辑斯谛方程]{id="math.ode.logistic-equation"}，横轴是时间$t$（图上写作 x）。从$0$和$\frac12$之间出发的解是 S 形曲线，起点在$\frac12$到$1$之间（包括$\frac12$）的只剩 S 形的上半截，一开始就越走越缓；从$1$以上出发的解单调下降，从$0$出发的解一直是$0$。拖动$r$：曲线变陡或变缓，可正的解最后都趋于:term[环境容纳量]{id="math.ode.carrying-capacity"}$1$。

## 例题

### 例 1　解的定义区间

解:term[初值问题]{id="math.ode.initial-value-problem"}（initial value problem）$y'=-\frac{x}{y}$，$y(0)=2$。

**为什么想到这么做**：右边是$x$乘$\frac1y$，可以分离变量；$y=0$时右边没有定义，解只能活在$y\ne0$的区域里。

**推导**：分离变量，$yy'=-x$，即$\bigl(\frac{y^2}{2}\bigr)'=-x$，所以$y^2=-x^2+C$。由$y(0)=2$得$C=4$，又$y>0$，所以$y=\sqrt{4-x^2}$。它只在$(-2,2)$上是解：$x\to\pm2$时$y\to0$，方程的右边失去意义，:term[解曲线]{id="math.ode.solution-curve"}（solution curve）是一个上半圆，走到$x$轴就停了。

### 例 2　解逻辑斯谛方程

解$y'=ry\bigl(1-\frac{y}{K}\bigr)$，$y(0)=y_0$，$0<y_0<K$。

**为什么想到这么做**：右边是只含$y$的因子，可以分离变量；分离后要积$\frac{K}{y(K-y)}$，这是有理函数，拆成部分分式（见[有理函数的积分](lesson:math.calculus.partial-fractions)）。

**推导**：在$0<y<K$里，$\frac{K}{y(K-y)}=\frac1y+\frac{1}{K-y}$，分离变量得$\bigl(\ln y-\ln(K-y)\bigr)'=r$，所以$\ln\frac{y}{K-y}=rt+C$。由初始条件，$e^C=\frac{y_0}{K-y_0}$；记$A=\frac{K-y_0}{y_0}$，解出$y=\frac{K}{1+Ae^{-rt}}$。代回方程可以验证；这个式子对$y_0\ge K$也成立。

## 常见误区

- 「两边除以$h(y)$再积分，就得到了全部的解。」除法丢掉了常数解：$y'=y^2$的$y=0$不在$y=-\frac{1}{x+C}$里。
- 「$\int\frac{\dd y}{y}=\ln y+C$。」要写成$\ln|y|+C$，否则丢掉了$y<0$的解。
- 「:term[逻辑斯谛方程]{id="math.ode.logistic-equation"}的解增长得越来越慢。」不对：从$\frac K2$以下出发时，解先越长越快，越过$\frac K2$以后才变慢（第 6 题）。

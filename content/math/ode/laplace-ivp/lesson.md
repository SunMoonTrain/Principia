---
id: math.ode.laplace-ivp
title: |
  用拉普拉斯变换解初值问题
goal: |
  会用拉普拉斯变换把常系数线性方程的初值问题化成代数问题来求解。
prerequisites: [math.ode.laplace-transform, math.ode.constant-coefficients, math.calculus.partial-fractions]
minutes: 30
summary: |
  两边取变换，初值自动带入；解出$Y(s)$，拆成部分分式再变回去。
status: reviewed
---

## 这一节要回答的问题

解$y''+3y'+2y=e^{-3t}$、$y(0)=1$、$y'(0)=0$，按以前的办法要先求齐次方程（homogeneous equation）的:term[通解]{id="math.ode.general-solution"}（general solution），再找:term[特解]{id="math.ode.particular-solution"}（particular solution），最后用初值定常数。:term[拉普拉斯变换]{id="math.ode.laplace-transform"}（Laplace transform）把求导变成乘以$s$，初值也一起带了进来。能不能一步把这个:term[初值问题]{id="math.ode.initial-value-problem"}（initial value problem）变成代数问题？

## 讲解

### 变换、求解、变回

对$y''+ay'+by=g(t)$、$y(0)=y_0$、$y'(0)=y_1$，记$Y=\mathcal L\{y\}$、$G=\mathcal L\{g\}$。两边取变换，由导数的变换，$\mathcal L\{y''\}=s^2Y-sy_0-y_1$，$\mathcal L\{y'\}=sY-y_0$，于是$(s^2+as+b)Y-(s+a)y_0-y_1=G$。

::anchor{id="thm-laplace-ivp"}
**用变换求解**　设$g$分段连续（piecewise continuous）、是:term[指数阶]{id="math.ode.exponential-order"}（exponential order）的，$y$是$y''+ay'+by=g$、$y(0)=y_0$、$y'(0)=y_1$的解。则$Y(s)=\frac{G(s)+(s+a)y_0+y_1}{s^2+as+b}$，$y=\mathcal L^{-1}\{Y\}$。

**证明思路**：可以证明，这时解$y$和$y'$、$y''$也都是指数阶的（这里不证），所以能对方程两边取变换；由[导数的变换](lesson:math.ode.laplace-transform#thm-laplace-derivative)，左边是$(s^2+as+b)Y-(s+a)y_0-y_1$，解出$Y$即可。$y$连续，由逆变换的唯一性，它就是$Y$的:term[拉普拉斯逆变换]{id="math.ode.inverse-laplace-transform"}（inverse Laplace transform）。

::anchor{id="def-transfer-function"}
$H(s)=\frac{1}{s^2+as+b}$叫作方程$y''+ay'+by=g$的:term[传递函数]{id="math.ode.transfer-function"}（transfer function）：初值都为零时，$Y(s)=H(s)G(s)$。

为什么这样定义：$H$只由方程本身决定，把输入$g$的变换乘上它，就得到输出$y$的变换。它的分母正是:term[特征方程]{id="math.ode.characteristic-equation"}（characteristic equation）的左边，使分母为零的$s$就是特征根（characteristic root）。边界情况：$g\equiv0$时只剩初值那一项$\frac{(s+a)y_0+y_1}{s^2+as+b}$，它的逆变换就是齐次方程满足这组初值的解。

### 拆成部分分式

变回去的关键是把$Y(s)$拆成表里有的几项。先把分母分解成一次因式和不可约（irreducible）的二次因式，再按[有理函数的积分](lesson:math.calculus.partial-fractions)里的办法拆成部分分式（partial fractions），然后逐项变回：

| 部分分式 | 逆变换 |
| --- | --- |
| $\frac{A}{s-r}$ | $Ae^{rt}$ |
| $\frac{A}{(s-r)^2}$ | $Ate^{rt}$ |
| $\frac{B(s-\alpha)+C\beta}{(s-\alpha)^2+\beta^2}$ | $e^{\alpha t}(B\cos\beta t+C\sin\beta t)$ |

第二行由$\mathcal L\{t\}=\frac1{s^2}$平移得到，第三行由正弦、余弦的变换平移得到。分母的因式是一次的时，系数$A$可以把$s=r$代进「去掉这个因式以后的式子」直接算出来。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 20], y: [0, 2] }
functions:
  - expr: "1 - exp(-c*x/2) * (cos(sqrt(1 - c^2/4)*x) + c/(2*sqrt(1 - c^2/4)) * sin(sqrt(1 - c^2/4)*x))"
    label: |
      $y''+cy'+y=1$的解
  - expr: "1"
    label: |
      $y=1$
sliders:
  - name: c
    min: 0.2
    max: 1.8
    step: 0.2
    default: 0.6
    label: |
      阻尼系数$c$
:::

横轴是$t$（图上写作 x）。这是$y''+cy'+y=1$、$y(0)=y'(0)=0$的解，由$Y(s)=\frac{1}{s(s^2+cs+1)}$拆成部分分式变回来得到（例 2 是$c=1$的情形）：一个突然加上、以后一直不变的力，把振子推到新的平衡位置$y=1$。拖动$c$：阻尼越小，解冲过$1$越多、来回振荡越久；$c$接近$2$时几乎不冲过$1$。

## 例题

### 例 1　三个不同的实根

解$y''+3y'+2y=e^{-3t}$、$y(0)=1$、$y'(0)=0$。

**为什么想到这么做**：常系数方程加初值，正适合用变换：初值直接带进$Y(s)$，最后只要拆部分分式。

**推导**：$(s^2+3s+2)Y-s-3=\frac{1}{s+3}$，所以$Y=\frac{1+(s+3)^2}{(s+1)(s+2)(s+3)}=\frac{s^2+6s+10}{(s+1)(s+2)(s+3)}$。分母是三个不同的一次因式：$s=-1$代入$\frac{s^2+6s+10}{(s+2)(s+3)}$得$\frac52$；同样，$s=-2$得$-2$，$s=-3$得$\frac12$。所以$Y=\frac{5/2}{s+1}-\frac{2}{s+2}+\frac{1/2}{s+3}$，$y=\frac52e^{-t}-2e^{-2t}+\frac12e^{-3t}$；验算$y(0)=1$、$y'(0)=-\frac52+4-\frac32=0$。

### 例 2　突然加上的常力

解$y''+y'+y=1$、$y(0)=y'(0)=0$。

**为什么想到这么做**：初值都为零，$Y=H(s)G(s)$，$G=\mathcal L\{1\}=\frac1s$；分母里有不可约的二次因式，变回来是衰减的正弦、余弦。

**推导**：$Y=\frac{1}{s(s^2+s+1)}$。设$Y=\frac As+\frac{Bs+C}{s^2+s+1}$，通分后比较系数得$A=1$、$B=-1$、$C=-1$。$\frac{s+1}{s^2+s+1}=\frac{(s+\frac12)+\frac12}{(s+\frac12)^2+\frac34}$，按表的第三行，$\alpha=-\frac12$、$\beta=\frac{\sqrt3}{2}$、$B=1$、$C=\frac{1}{\sqrt3}$。所以$y=1-e^{-t/2}\bigl(\cos\frac{\sqrt3}{2}t+\frac{1}{\sqrt3}\sin\frac{\sqrt3}{2}t\bigr)$，$t\to+\infty$时趋于$1$。

## 常见误区

- 「取了变换，初值就用不上了。」初值在$\mathcal L\{y'\}$、$\mathcal L\{y''\}$里自动出现，正是这个方法省事的地方。
- 「$Y(s)$可以直接查表变回去。」通常要先拆成部分分式。
- 「重根时只写$\frac{A}{s-r}$一项。」要写$\frac{A}{s-r}+\frac{B}{(s-r)^2}$，后一项变回$Bte^{rt}$。
- 「:term[拉普拉斯变换]{id="math.ode.laplace-transform"}能把任何线性方程变成代数方程。」常系数方程才行；系数含$t$时，变换后得到的通常是$Y$满足的:term[微分方程]{id="math.ode.differential-equation"}（differential equation）。

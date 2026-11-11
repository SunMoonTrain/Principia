---
id: math.ode.convolution-impulse
title: |
  阶跃函数、冲激与卷积
goal: |
  会用阶跃函数和$\delta$函数描述突然加上的力和冲击，并用卷积写出系统的响应。
prerequisites: [math.ode.laplace-ivp, math.calculus.dirac-delta, math.vector-calculus.double-integrals]
minutes: 35
summary: |
  阶跃描述接通，$\delta$描述敲击；响应等于冲激响应与输入的卷积。
status: reviewed
---

## 这一节要回答的问题

开关在某一时刻接通，外力突然从$0$变成一个常数；锤子敲一下，一瞬间传过去一个冲量（impulse）。这样的力用以前的函数写起来很别扭：怎样把它们写进方程，用:term[拉普拉斯变换]{id="math.ode.laplace-transform"}（Laplace transform）来处理？对一般的外力，系统的响应能不能用「敲一下」的响应拼出来？

## 讲解

### 阶跃函数

::anchor{id="def-step"}
函数$u_c(t)=\begin{cases}0,&t<c\\1,&t\ge c\end{cases}$（$c\ge0$）叫作:term[单位阶跃函数]{id="math.ode.unit-step-function"}（unit step function，也叫 Heaviside function），它表示在$t=c$时刻接通的开关。

为什么这样定义：乘上$u_c(t)$，就把一个函数在$c$以前「关掉」；一个作用从$c$时刻起、而且从头开始的$f$，写成$u_c(t)f(t-c)$。分段给出的外力都可以用它拼起来，例如只在$[a,b)$上等于$1$的方波是$u_a(t)-u_b(t)$。边界情况：$c=0$时，$u_0(t)$在$t\ge0$上恒为$1$，它的变换就是$\frac1s$。

::anchor{id="thm-second-shift"}
**时间平移**　设$\mathcal L\{f\}=F$，$c\ge0$，则$\mathcal L\{u_c(t)f(t-c)\}=e^{-cs}F(s)$；特别地，$\mathcal L\{u_c(t)\}=\frac{e^{-cs}}{s}$。

**证明思路**：$\int_0^{+\infty}e^{-st}u_c(t)f(t-c)\dd t=\int_c^{+\infty}e^{-st}f(t-c)\dd t$，换元$\tau=t-c$，等于$e^{-cs}\int_0^{+\infty}e^{-s\tau}f(\tau)\dd\tau=e^{-cs}F(s)$。和[乘$e^{at}$的平移](lesson:math.ode.laplace-transform#thm-laplace-shift)对照：在$t$这边乘$e^{at}$，$s$那边平移；在$t$这边平移，$s$那边乘$e^{-cs}$。

### 冲激

锤子在$t=c$时刻敲一下：力很大，作用的时间很短，冲量是$1$。用狄拉克$\delta$函数（Dirac delta function）$\delta(t-c)$描述它：它是高$\frac1\varepsilon$、宽$\varepsilon$的矩形在$\varepsilon\to0$时的极限，满足筛选性质（sifting property）$\int_0^{+\infty}f(t)\delta(t-c)\dd t=f(c)$，见[狄拉克$\delta$函数](lesson:math.calculus.dirac-delta)。所以$c>0$时$\mathcal L\{\delta(t-c)\}=e^{-cs}$，并约定$\mathcal L\{\delta(t)\}=1$。

::anchor{id="def-impulse-response"}
初值都为零时，方程$y''+ay'+by=\delta(t)$的解$h(t)$叫作这个方程的:term[冲激响应]{id="math.ode.impulse-response"}（impulse response）；它的变换就是:term[传递函数]{id="math.ode.transfer-function"}（transfer function）$H(s)=\frac{1}{s^2+as+b}$。

为什么这样定义：$\delta(t)$的变换是$1$，所以$Y=H\cdot1=H$，$h=\mathcal L^{-1}\{H\}$。物理上，敲一下就是在$t=0$瞬间给出单位冲量，速度从$0$突变到$1$，以后不再受力，所以$h$是齐次方程（homogeneous equation）满足$h(0)=0$、$h'(0)=1$的解。边界情况：$y''+y=\delta(t)$的冲激响应是$\sin t$。

### 卷积

::anchor{id="def-convolution"}
函数$(f*g)(t)=\int_0^tf(\tau)g(t-\tau)\dd\tau$叫作$f$和$g$的:term[卷积]{id="math.ode.convolution"}（convolution）。

为什么这样定义：把输入$g$看成一连串小冲击，$\tau$时刻的冲击的冲量是$g(\tau)\dd\tau$，它在$t$时刻引起$h(t-\tau)g(\tau)\dd\tau$的响应；方程是线性的，总响应就是这些响应的叠加，正是$\int_0^th(t-\tau)g(\tau)\dd\tau=(h*g)(t)$。换元$\tau\to t-\tau$可知$f*g=g*f$。边界情况：$f*1=\int_0^tf(\tau)\dd\tau$，和常数$1$卷积就是从$0$开始积分。

::anchor{id="thm-convolution"}
**卷积定理**　设$f$、$g$分段连续（piecewise continuous）、是:term[指数阶]{id="math.ode.exponential-order"}（exponential order）的，则$\mathcal L\{f*g\}=F(s)G(s)$。所以初值都为零时，$y''+ay'+by=g$的解是$y=h*g=\int_0^th(t-\tau)g(\tau)\dd\tau$。

**证明思路**：$F(s)G(s)=\int_0^{+\infty}\int_0^{+\infty}e^{-s(\tau+\sigma)}f(\tau)g(\sigma)\dd\sigma\dd\tau$；令$t=\tau+\sigma$，再交换二重积分（double integral）的次序，它变成$\int_0^{+\infty}e^{-st}\Bigl(\int_0^tf(\tau)g(t-\tau)\dd\tau\Bigr)\dd t$。积分区域无界，被积函数的绝对值在区域上的积分有限时可以这样交换（这里不证）；$s$足够大时这一条满足，详细的推导见第 5 题。由$Y=HG$和逆变换的唯一性，$y=h*g$。

对$y''+y=g$，$h=\sin t$，$y=\int_0^t\sin(t-\tau)g(\tau)\dd\tau$，这正是[常数变易法](lesson:math.ode.variation-of-parameters)（variation of parameters）给出的那个积分。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 12], y: [-0.5, 2.5] }
functions:
  - expr: "1 - cos(x)"
    label: |
      常力的响应$1-\cos t$
  - expr: "sum(k, 0, floor(x/d), d*sin(x - k*d))"
    label: |
      每隔$d$敲一下的响应
sliders:
  - name: d
    min: 0.1
    max: 1.5
    step: 0.1
    default: 1
    label: |
      敲击的间隔$d$
:::

横轴是$t$（图上写作 x）。一条曲线是$y''+y=1$在初值为零时的解$1-\cos t$；另一条把常力换成从$t=0$起每隔$d$敲一下、每下冲量为$d$，每一下引起一个$d\sin(t-kd)$，全部叠加。拖动$d$：敲得越密、每下越轻，叠加出来的曲线越接近$1-\cos t$，这正是:term[卷积]{id="math.ode.convolution"}$\int_0^t\sin(t-\tau)\cdot1\dd\tau$的意思。

## 例题

### 例 1　中途接通的常力

解$y''+y=u_1(t)$、$y(0)=y'(0)=0$。

**为什么想到这么做**：右边是$t=1$时接通的:term[单位阶跃函数]{id="math.ode.unit-step-function"}，变换是$\frac{e^{-s}}{s}$；变回去时用时间平移。

**推导**：$(s^2+1)Y=\frac{e^{-s}}{s}$，$Y=e^{-s}\cdot\frac{1}{s(s^2+1)}=e^{-s}\Bigl(\frac1s-\frac{s}{s^2+1}\Bigr)$。括号里的是$1-\cos t$的变换，乘$e^{-s}$对应平移$1$，所以$y=u_1(t)\bigl(1-\cos(t-1)\bigr)$：$t<1$时静止，$t\ge1$以后绕新的平衡位置$1$振荡。

### 例 2　敲一下有阻尼的振子

解$y''+2y'+2y=\delta(t-\pi)$、$y(0)=y'(0)=0$。

**为什么想到这么做**：先求:term[冲激响应]{id="math.ode.impulse-response"}$h=\mathcal L^{-1}\{H\}$，在$t=\pi$敲一下，响应就是$h$平移$\pi$。

**推导**：$H=\frac{1}{s^2+2s+2}=\frac{1}{(s+1)^2+1}$，$h(t)=e^{-t}\sin t$。$\mathcal L\{\delta(t-\pi)\}=e^{-\pi s}$，$Y=e^{-\pi s}H(s)$，由时间平移，$y=u_\pi(t)e^{-(t-\pi)}\sin(t-\pi)$。$t<\pi$时什么也没发生，敲过以后，振子做衰减的振荡。

## 常见误区

- 「$u_c(t)f(t)$的变换是$e^{-cs}F(s)$。」公式里是$u_c(t)f(t-c)$；$u_c(t)f(t)$要先把$f(t)$写成$t-c$的函数。
- 「$\delta$函数是一个在$c$处取很大值的普通函数。」它只有放在积分里才有意义，用的是筛选性质。
- 「:term[卷积]{id="math.ode.convolution"}就是乘积。」$\mathcal L\{f*g\}=FG$，但$f*g\ne fg$；例如$1*1=t$，而$1\cdot1=1$。
- 「:term[冲激响应]{id="math.ode.impulse-response"}满足$h'(0)=0$。」敲一下以后速度突变为$1$，冲激响应是齐次方程满足$h(0)=0$、$h'(0)=1$的解。

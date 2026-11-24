---
id: math.pde.pde-basics
title: |
  偏微分方程与分类
goal: |
  会判断偏微分方程的阶和线性性，并把二阶线性偏微分方程分成椭圆型、抛物型和双曲型。
prerequisites: [math.vector-calculus.partial-derivatives, math.ode.what-is-ode, math.calculus.higher-derivatives]
minutes: 29
summary: |
  $Au_{xx}+2Bu_{xy}+Cu_{yy}+\cdots=f$在$B^2-AC<0$、$=0$、$>0$的点分别是椭圆、抛物、双曲型。
status: reviewed
---

## 这一节要回答的问题

[偏导数](lesson:math.vector-calculus.partial-derivatives)一节说，像$u_{tt}=c^2u_{xx}$这样含未知函数的偏导数（partial derivative）的方程是:term[偏微分方程]{id="math.pde.pde"}（partial differential equation，PDE）。这样的方程五花八门，能不能像椭圆、抛物线、双曲线那样分成几类？它的解往往有无穷多个，要从中挑出一个，又该给哪些条件？

## 讲解

### 偏微分方程

先看三个典型的方程。:term[热方程]{id="math.pde.heat-equation"}（heat equation）$u_t=u_{xx}$也叫热传导方程：杆上的温度满足$u_t=Du_{xx}$（$D$是正常数），换一下时间的单位就约掉了$D$。:term[波动方程]{id="math.pde.wave-equation"}（wave equation）是$u_{tt}=c^2u_{xx}$，拉普拉斯方程（Laplace's equation）是$u_{xx}+u_{yy}=0$。

::anchor{id="def-pde"}
含有未知多元函数（function of several variables）的偏导数的方程，叫作:term[偏微分方程]{id="math.pde.pde"}；方程里出现的偏导数最高是几阶，方程就是几阶（order）的。

为什么这样定义：常微分方程（ordinary differential equation）的未知函数只有一个自变量；自变量有两个以上时，变化率是沿各个方向的偏导数，规律写出来就是含偏导数的微分方程（differential equation）。边界情况：$u_x=0$在整个平面上的解，恰好是只依赖$y$的函数$F(y)$，$F$任取：常微分方程的通解（general solution）里是任意常数，这里是任意函数。

::anchor{id="def-solution"}
设$u$在某个范围里有方程中出现的各个偏导数，代进方程后在这个范围里处处成立，就说$u$是方程在这个范围里的解（solution）。

为什么这样定义：和常微分方程一样，要说清解在哪里成立。边界情况：[偏导数](lesson:math.vector-calculus.partial-derivatives)例 2 的$\ln(x^2+y^2)$满足$u_{xx}+u_{yy}=0$，可它在原点没有定义，只是去掉原点的平面上的解。

### 线性与叠加原理

$e^{-t}\sin x$、$e^{-4t}\sin2x$都满足$u_t=u_{xx}$，它们的和、常数倍也满足。$u=\frac x{1+t}$满足$u_t+uu_x=0$（$u_t=-\frac x{(1+t)^2}=-uu_x$），$2u$却不满足：$(2u)_t+2u(2u)_x=\frac{2x}{(1+t)^2}$，不恒为$0$。

::anchor{id="def-linear-pde"}
把$u$和它的各阶偏导数各乘一个只依赖自变量的系数再相加，记作$L[u]$。形如$L[u]=f$（$f$只依赖自变量）的:term[偏微分方程]{id="math.pde.pde"}，叫作:term[线性偏微分方程]{id="math.pde.linear-pde"}（linear partial differential equation）；$f$恒为$0$时叫作齐次（homogeneous）的，否则叫作非齐次（nonhomogeneous）的。

为什么这样定义：「线性」指$u$和它的偏导数都只以一次的形式出现，不互相乘、不平方、不放进别的函数里。这时$L$保持加法和数乘，解就能叠加；上面的$u_t+uu_x=0$里$u$乘了$u_x$，就不行。边界情况：系数可以随自变量变化，$e^xu_{xx}+u_{yy}=0$仍是线性的。

::anchor{id="thm-superposition"}
**:term[叠加原理]{id="math.pde.superposition-principle"}（superposition principle）**　设$L[u]=0$是齐次线性偏微分方程。（1）$u_1$、$u_2$是它在同一个范围里的解，$c_1$、$c_2$是常数，则$c_1u_1+c_2u_2$也是解。（2）$u_{\mathrm p}$是$L[u]=f$的一个解，则$L[u]=f$的解恰好是$u_{\mathrm p}$加上$L[u]=0$的解。

**证明思路**：求偏导数、乘只依赖自变量的系数都保持加法和数乘，所以$L[c_1u_1+c_2u_2]=c_1L[u_1]+c_2L[u_2]$；（2）由$L[u]-f=L[u-u_{\mathrm p}]$得出。完整证明见第 5 题。

无穷多个解叠加起来，还要验证:term[级数]{id="math.calculus.series"}（series）收敛、能一项一项地求导，见[分离变量法](lesson:math.pde.separation-of-variables)。

### 二阶方程的分类

把$u_{xx}$、$u_{xy}$、$u_{yy}$、$u_x$、$u_y$换成$\xi^2$、$\xi\eta$、$\eta^2$、$\xi$、$\eta$：拉普拉斯方程的$u_{xx}+u_{yy}$像椭圆$\xi^2+\eta^2=1$；:term[热方程]{id="math.pde.heat-equation"}以$x$、$t$为自变量写成$u_{xx}-u_t=0$，像抛物线$\xi^2-\eta=0$；:term[波动方程]{id="math.pde.wave-equation"}写成$c^2u_{xx}-u_{tt}=0$，像双曲线$c^2\xi^2-\eta^2=1$。二阶部分写成$Au_{xx}+2Bu_{xy}+Cu_{yy}$时（自变量是$x$、$t$就把$y$换成$t$），三者的$B^2-AC$依次是$-1$、$0$、$c^2$，正好是负、零、正。

::anchor{id="def-classification"}
两个自变量的:term[二阶线性偏微分方程]{id="math.pde.linear-pde"}写成$Au_{xx}+2Bu_{xy}+Cu_{yy}+\cdots=f$，$A$、$B$、$C$在每一点不全为$0$，「$\cdots$」是$u_x$、$u_y$、$u$各乘系数的低阶项（lower-order terms），系数和$f$都只依赖自变量。在$B^2-AC<0$、$=0$、$>0$的点，方程分别叫作:term[椭圆型]{id="math.pde.elliptic-equation"}（elliptic）、:term[抛物型]{id="math.pde.parabolic-equation"}（parabolic）、:term[双曲型]{id="math.pde.hyperbolic-equation"}（hyperbolic）的；在所考虑的范围里处处是同一型，就叫作椭圆型方程（elliptic equation）、抛物型方程（parabolic equation）、双曲型方程（hyperbolic equation）。

为什么这样定义：名字来自上面的类比。这三个方程的解表现很不一样，以后各节会看到：波动方程的扰动以有限的速度传开，热方程把起伏抹平，拉普拉斯方程描述不随时间变化的状态；这些主要由二阶部分决定。[多元函数的极值](lesson:math.vector-calculus.extrema)一节的判别式$f_{xx}f_{yy}-f_{xy}^2$也来自二次的式子，号和这里相反：那里判别式为负是:term[鞍点]{id="math.vector-calculus.saddle-point"}（saddle point），对应这里的$B^2-AC>0$。

边界情况：系数随自变量变化时，同一个方程在不同的点可以是不同的型（第 3 题）。$n$个自变量时，要看二阶部分对应的:term[二次型]{id="math.linear-algebra.quadratic-form"}（quadratic form）的矩阵有几个正、负:term[特征值]{id="math.linear-algebra.eigenvalue"}（eigenvalue）。换自变量时，只要新旧自变量可以互相表示、都有连续的二阶偏导数（second-order partial derivative），类型就不变，这里不证。

### 定解条件

$u_{tt}=c^2u_{xx}$的解有无穷多个：$F$、$G$二阶可导（twice differentiable）时，$F(x-ct)+G(x+ct)$都是解（[偏导数](lesson:math.vector-calculus.partial-derivatives)第 5 题）；反过来，整个$(x,t)$平面上二阶偏导数连续的解都是这种形式，见[一维波动方程与达朗贝尔公式](lesson:math.pde.wave-dalembert)。要挑出弦的一种运动，得知道开始时的形状$u(x,0)=\varphi(x)$和速度$u_t(x,0)=\psi(x)$；弦长为$L$、两端固定时，还要$u(0,t)=u(L,t)=0$。

::anchor{id="def-ivp-bvp"}
给出$t=0$时$u$的值（方程对$t$是二阶时再给$u_t$的值），叫作初始条件（initial condition）；在自变量取值范围的边界上给出$u$或它的导数要满足的条件，叫作边界条件（boundary condition）；两者统称定解条件（auxiliary conditions）。只给初始条件、求以后的解，叫作:term[初值问题]{id="math.pde.initial-value-problem"}（initial value problem），也叫柯西问题（Cauchy problem）；只给边界条件、求范围里的解，叫作:term[边值问题]{id="math.pde.boundary-value-problem"}（boundary value problem）。

为什么这样定义：常微分方程的初始条件给的是数，如$y(x_0)=y_0$（见[微分方程与方向场](lesson:math.ode.what-is-ode#def-ivp)），这里给的是函数，因为每个$x$处都有开始时的值。边值问题常微分方程里也有：$u''=0$、$u(0)=a$、$u(L)=b$的解是$u=a+\frac{(b-a)x}L$，两个条件分在两头，不像初值问题$u(0)=a$、$u'(0)=b$那样都在一端。

边界情况：:term[热方程]{id="math.pde.heat-equation"}的初始条件只给$u(x,0)$，:term[波动方程]{id="math.pde.wave-equation"}要给$u(x,0)$、$u_t(x,0)$两个，为什么见第 7 题。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-2.2, 2.2], y: [-2.5, 4.5] }
functions:
  - expr: "x^2"
    label: |
      $C=B^2$（抛物型）
points:
  - { x: "0", y: "1" }
  - { x: "0", y: "0" }
  - { x: "0", y: "-1" }
  - { x: "B", y: "C" }
sliders:
  - name: B
    min: -2
    max: 2
    step: 0.1
    default: 1
    label: |
      $B$
  - name: C
    min: -2
    max: 4
    step: 0.1
    default: 2
    label: |
      $C$
:::

图上是$(B,C)$平面，横轴写作 x，是$B$；纵轴写作 y，是$C$。$A\ne0$时方程两边同除以$A$，就能取$A=1$，这时$B^2-AC=B^2-C$：蓝色的抛物线$C=B^2$上是:term[抛物型]{id="math.pde.parabolic-equation"}，它上方是:term[椭圆型]{id="math.pde.elliptic-equation"}，下方是:term[双曲型]{id="math.pde.hyperbolic-equation"}。纵轴上三个固定的圆点，从上到下是拉普拉斯方程、以$x$、$t$为自变量的:term[热方程]{id="math.pde.heat-equation"}和$c=1$的:term[波动方程]{id="math.pde.wave-equation"}。拖动滑块$B$、$C$，第四个圆点跟着走，看它越过抛物线时类型怎样变。

## 例题

### 例 1　阶和线性

判断$u_t=u_{xx}+\sin x$、$u_{xx}u_{yy}-u_{xy}^2=1$、$(u_x)^2+(u_y)^2=1$各是几阶的，是不是线性的；线性的再说是不是齐次的。

**为什么想到这么做**：阶看出现的偏导数最高是几阶；线性看$u$和它的偏导数是不是都只以一次的形式出现。

**推导**：第一个是二阶的，写成$u_t-u_{xx}=\sin x$，左边是$L[u]$，线性，右边不为$0$，非齐次。第二个是二阶的，$u_{xx}$乘了$u_{yy}$，不是线性的。第三个只含一阶偏导数，是一阶的（导数带了平方也不改变阶数），不是线性的。

### 例 2　判断类型

判断$u_{xx}+4u_{xy}+3u_{yy}+u_y=0$和$2u_{xx}+2u_{xy}+u_{yy}=0$的类型。

**为什么想到这么做**：先把$u_{xy}$的系数写成$2B$，再算$B^2-AC$；$u_y$是低阶项，不影响类型。

**推导**：第一个方程$A=1$，$2B=4$即$B=2$，$C=3$，$B^2-AC=4-3=1>0$，处处是:term[双曲型]{id="math.pde.hyperbolic-equation"}。第二个方程$A=2$，$B=1$，$C=1$，$B^2-AC=1-2=-1<0$，处处是:term[椭圆型]{id="math.pde.elliptic-equation"}。

## 常见误区

- 「方程里出现$u^2$，就是二阶方程。」阶只看出现的偏导数最高是几阶，$u_t=u_x+u^2$是一阶的。
- 「把$u_{xy}$的系数当成$B$。」$u_{xy}$的系数是$2B$：例 2 第二个方程要是取$B=2$，会算出$4-2=2>0$，错判成:term[双曲型]{id="math.pde.hyperbolic-equation"}。
- 「:term[抛物型方程]{id="math.pde.parabolic-equation"}的解，图像像抛物线。」名字来自方程的二阶部分和抛物线方程的类比，说的是方程，不是解的图像：:term[热方程]{id="math.pde.heat-equation"}的解$e^{-t}\sin x$在每个时刻都是正弦曲线。

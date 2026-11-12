---
id: math.vector-calculus.multivariable-chain-rule
title: |
  多元复合函数的链式法则
goal: |
  会用链式法则求多元复合函数的偏导数，并画出变量之间的依赖关系图。
prerequisites: [math.vector-calculus.differentiability]
minutes: 35
summary: |
  复合函数的导数，等于沿依赖关系的每条路径相乘再相加。
status: reviewed
---

## 这一节要回答的问题

一架无人机沿曲线$\bigl(x(t),y(t)\bigr)$飞过一块铁板上空，测到的温度是$T\bigl(x(t),y(t)\bigr)$。它测到的温度随时间变化得多快？如果$x$、$y$又是极坐标$r$、$\theta$的函数，温度对$r$、对$\theta$的:term[偏导数]{id="math.vector-calculus.partial-derivative"}（partial derivative）怎样从$T_x$、$T_y$算出来？一元函数的链式法则（chain rule）说「外层的导数乘以内层的导数」，多元的时候是什么样子？

## 讲解

### 沿曲线求导

::anchor{id="thm-chain-rule"}
**:term[链式法则]{id="math.vector-calculus.chain-rule"}（chain rule）**　设$x(t)$、$y(t)$在$t$处可导，$f$在点$\bigl(x(t),y(t)\bigr)$处:term[可微]{id="math.vector-calculus.differentiable"}（differentiable），则$z=f\bigl(x(t),y(t)\bigr)$在$t$处可导，并且$\dv{z}{t}=f_x\dv{x}{t}+f_y\dv{y}{t}$，其中$f_x$、$f_y$在$\bigl(x(t),y(t)\bigr)$处取值。

**证明思路**：记$\Delta x=x(t+\Delta t)-x(t)$、$\Delta y=y(t+\Delta t)-y(t)$，$\rho=\sqrt{\Delta x^2+\Delta y^2}$。由可微，$\Delta z=f_x\Delta x+f_y\Delta y+r$，两边除以$\Delta t$得$\frac{\Delta z}{\Delta t}=f_x\frac{\Delta x}{\Delta t}+f_y\frac{\Delta y}{\Delta t}+\frac{r}{\Delta t}$。$\Delta t\to0$时前两项趋于$f_xx'+f_yy'$；$\rho=0$时$r=0$，否则$\left|\frac r{\Delta t}\right|=\frac{|r|}{\rho}\cdot\frac{\rho}{|\Delta t|}$，第一个因子趋于$0$，第二个趋于$\sqrt{x'^2+y'^2}$，有界，所以最后一项趋于$0$。

为什么是这个样子：把:term[全微分]{id="math.vector-calculus.total-differential"}（total differential）$\dd z=f_x\dd x+f_y\dd y$两边「除以$\dd t$」就是它：$t$变一点，$x$、$y$各变一点，各自通过:term[偏导数]{id="math.vector-calculus.partial-derivative"}影响$z$，再加起来。$n$个变量时$\dv{z}{t}=\sum_i\pdv{f}{x_i}\dv{x_i}{t}$。常用的特殊情形是$y$是$x$的函数：$\dv{}{x}F\bigl(x,y(x)\bigr)=F_x+F_yy'$；如果沿曲线$F\bigl(x,y(x)\bigr)=0$，就得到隐函数的求导公式$y'=-\frac{F_x}{F_y}$（$F_y\ne0$），什么时候$y(x)$存在留到[反函数定理与隐函数定理](lesson:math.vector-calculus.inverse-implicit)。

### 全导数

::anchor{id="def-total-derivative"}
设$z=f(x,y,t)$，而$x$、$y$又都是$t$的函数。把$x(t)$、$y(t)$代进去，$z$只依赖$t$，它对$t$的导数$\dv{z}{t}=f_x\dv{x}{t}+f_y\dv{y}{t}+\pdv{f}{t}$叫作$z$对$t$的:term[全导数]{id="math.vector-calculus.total-derivative"}（total derivative）。

为什么这样定义：$t$既直接出现在$f$里，又藏在$x$、$y$里，$\pdv ft$只算了直接的那一份（固定$x$、$y$时的变化率），全导数把三份都算上。物理里一个量随位置和时间变化、位置又随时间变化时，要的都是全导数。例如$f(x,t)=xt$、$x=t^2$，$\pdv ft=x=t^2$，全导数却是$f_x\cdot2t+\pdv ft=2t^2+t^2=3t^2$，和直接代入$z=t^3$求导一致。

### 多个自变量与依赖关系图

::anchor{id="thm-chain-rule-partial"}
**多个自变量的:term[链式法则]{id="math.vector-calculus.chain-rule"}**　设$x=x(s,t)$、$y=y(s,t)$在$(s,t)$处的:term[偏导数]{id="math.vector-calculus.partial-derivative"}都存在，$f$在对应的点$(x,y)$处:term[可微]{id="math.vector-calculus.differentiable"}，则$z=f\bigl(x(s,t),y(s,t)\bigr)$满足$\pdv zs=f_x\pdv xs+f_y\pdv ys$，$\pdv zt=f_x\pdv xt+f_y\pdv yt$。

**证明思路**：求$\pdv zs$时$t$固定，$x$、$y$都只随$s$变，就是上面沿曲线求导的情形；$\pdv zt$同理。

::anchor{id="def-dependency-diagram"}
把每个变量直接依赖哪些变量画成从上往下的箭头，叫作依赖关系图（dependency diagram）。$\pdv zs$等于从$z$到$s$的每一条路径上各段:term[偏导数]{id="math.vector-calculus.partial-derivative"}的乘积，再对所有路径求和。

一般地，$z$依赖$u_1,\dots,u_m$，每个$u_i$依赖$x_1,\dots,x_n$时，$\pdv{z}{x_j}=\sum_i\pdv{z}{u_i}\pdv{u_i}{x_j}$，在图上就是经过每个$u_i$的一条路径。$x_j$不出现在某个$u_i$里时，那条路径不存在，对应的项是$0$。以后在[雅可比矩阵](lesson:math.vector-calculus.jacobian)里，这些和会写成矩阵的乘积。

## 几何图像

![两张依赖关系图。左图：z 在最上面，下一层是 x、y，x 下面是 s、t，y 下面也是 s、t；从 z 到 x、y 的箭头标 f_x、f_y，从 x 到 s、t 的箭头标 x_s、x_t，从 y 到 s、t 的标 y_s、y_t；到两个 s 的两条路径加粗。下方写着：∂z/∂s = f_x x_s + f_y y_s，从 z 到 s 有两条路径。右图：z 在最上面，下一层是 x、y、t，箭头标 f_x、f_y、f_t；x、y 下面各有一个 t，箭头标 x′、y′；三条到 t 的路径都加粗。下方写着：dz/dt = f_x x′ + f_y y′ + f_t，t 既直接出现，又藏在 x、y 里：三条路径。](dependency.svg)

左图是$z=f(x,y)$、$x=x(s,t)$、$y=y(s,t)$的依赖关系图。求$\pdv zs$，从$z$出发走到$s$有两条路径$z\to x\to s$和$z\to y\to s$，把每条路径上的:term[偏导数]{id="math.vector-calculus.partial-derivative"}相乘再相加，就是多个自变量的:term[链式法则]{id="math.vector-calculus.chain-rule"}。右图是$z=f(x,y,t)$、$x=x(t)$、$y=y(t)$，到$t$有三条路径，其中一条直接从$z$到$t$，合起来是:term[全导数]{id="math.vector-calculus.total-derivative"}。

## 例题

### 例 1　沿单位圆求导

$z=x^2y+e^y$，$x=\cos t$，$y=\sin t$。求$t=0$时的$\dv zt$。

**为什么想到这么做**：$z$经过$x$、$y$依赖$t$，用沿曲线求导的:term[链式法则]{id="math.vector-calculus.chain-rule"}；$f$的:term[偏导数]{id="math.vector-calculus.partial-derivative"}处处:term[连续]{id="math.vector-calculus.continuous"}（continuous），所以:term[可微]{id="math.vector-calculus.differentiable"}，条件满足。

**推导**：$f_x=2xy$，$f_y=x^2+e^y$；$t=0$时$x=1$、$y=0$，$f_x=0$、$f_y=2$。$\dv xt=-\sin t=0$，$\dv yt=\cos t=1$。所以$\dv zt=0\cdot0+2\cdot1=2$。验算：直接代入得$z=\cos^2t\sin t+e^{\sin t}$，$z'(0)=\bigl(\cos^3t-2\cos t\sin^2t+e^{\sin t}\cos t\bigr)\big|_{t=0}=1+1=2$。

### 例 2　换成极坐标

$z=f(x,y)$:term[可微]{id="math.vector-calculus.differentiable"}，$x=r\cos\theta$，$y=r\sin\theta$。用$f_x$、$f_y$表示$z_r$、$z_\theta$，并证明$f_x^2+f_y^2=z_r^2+\frac{z_\theta^2}{r^2}$（$r>0$）。

**为什么想到这么做**：画出依赖关系图，$z$经过$x$、$y$依赖$r$、$\theta$，各有两条路径。

**推导**：$x_r=\cos\theta$、$y_r=\sin\theta$，$x_\theta=-r\sin\theta$、$y_\theta=r\cos\theta$，所以$z_r=f_x\cos\theta+f_y\sin\theta$，$z_\theta=-rf_x\sin\theta+rf_y\cos\theta$。于是$z_r^2+\frac{z_\theta^2}{r^2}=(f_x\cos\theta+f_y\sin\theta)^2+(-f_x\sin\theta+f_y\cos\theta)^2=f_x^2+f_y^2$，交叉项正好抵消。

## 常见误区

- 「$\dv zt$和$\pdv ft$是一回事。」$t$同时藏在别的变量里时，:term[全导数]{id="math.vector-calculus.total-derivative"}还包括经过那些变量的几项；讲解里$f=xt$、$x=t^2$时，$\pdv ft=t^2$，$\dv zt=3t^2$。
- 「:term[偏导数]{id="math.vector-calculus.partial-derivative"}都存在就能用:term[链式法则]{id="math.vector-calculus.chain-rule"}。」$f$要:term[可微]{id="math.vector-calculus.differentiable"}。$f(x,y)=\frac{x^2y}{x^2+y^2}$、$f(0,0)=0$在原点两个偏导数都是$0$，沿$x=t$、$y=t$，公式给出$0$，直接代入却是$z=\frac t2$，$\dv zt=\frac12$。
- 「$\pdv zs=\pdv zx\pdv xs$，把$\partial x$约掉。」$z$还经过$y$依赖$s$，要把依赖关系图上所有路径都加起来。
- 「依赖关系图里重复出现的变量，只算一次。」左图里$s$出现两次，两条路径都要算；漏掉一条，就少了一项。

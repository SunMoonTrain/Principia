---
id: physics.special-relativity.relativistic-action
title: |
  自由粒子的作用量
goal: |
  会写出自由粒子的相对论作用量，并由它推出相对论的动量和能量。
prerequisites: [physics.special-relativity.four-momentum, physics.analytical-mechanics.hamiltons-principle, physics.analytical-mechanics.energy-function]
minutes: 35
summary: |
  自由粒子的作用量是$-mc^2$乘固有时，由它推出相对论的动量和能量。
status: reviewed
---

## 这一节要回答的问题

分析力学里，真实运动让作用量（action）取驻值，作用量是拉格朗日量（Lagrangian）对时间的积分，而自由质点的拉格朗日量$\frac12mu^2$来自牛顿力学。到了相对论，自由粒子该用什么拉格朗日量？能不能不预先知道$\vb p=\gamma_um\vb u$，只从「作用量在所有:term[惯性系]{id="physics.special-relativity.inertial-frame"}（inertial frame）里都一样」出发，推出相对论的动量和能量？

## 讲解

### 记号

本领域用$S$、$S'$表示:term[惯性系]{id="physics.special-relativity.inertial-frame"}，所以这一节把作用量记作$\mathcal S=\int L\,\dd t$；分析力学里写作$S$的就是它。

### 作用量应当是洛伦兹标量

按哈密顿原理（Hamilton's principle），在两端固定的所有路径中，真实的那条让作用量取驻值。换一个:term[惯性系]{id="physics.special-relativity.inertial-frame"}来算，选出来的应当是同一条:term[世界线]{id="physics.special-relativity.worldline"}（world line），否则运动规律就和惯性系有关了。最省事的保证是：每条世界线的作用量在所有惯性系里都是同一个数，即它是:term[洛伦兹标量]{id="physics.special-relativity.lorentz-scalar"}（Lorentz scalar）。

对自由粒子，作用量只能由世界线本身决定；它还应当可加：整条世界线的作用量等于各段之和。世界线的每一小段上，和惯性系无关、又只由这一小段决定的量，就是它的:term[固有时]{id="physics.special-relativity.proper-time"}（proper time）$\dd\tau$。所以作用量应当是$-k\int\dd\tau$，$k$是常数（只考虑匀速运动时，p5 证明了它是唯一的选择）。

::anchor{id="def-free-particle-action"}
质量为$m$的自由粒子沿世界线从:term[事件]{id="physics.special-relativity.event"}（event）A 到事件 B 的作用量规定为$\mathcal S=-mc^2\int_A^B\dd\tau=-mc^2\int_{t_A}^{t_B}\sqrt{1-\frac{u^2}{c^2}}\,\dd t$，相应的拉格朗日量是$L=-mc^2\sqrt{1-u^2/c^2}$。

为什么这样定义：常数$k$由低速时的样子确定。$u\ll c$时$\sqrt{1-u^2/c^2}\approx1-\frac{u^2}{2c^2}$，$L\approx-mc^2+\frac12mu^2$，常数$-mc^2$不影响运动方程，剩下的正是牛顿力学的$\frac12mu^2$，所以$k=mc^2$。负号的道理：由[时空间隔与固有时](lesson:physics.special-relativity.spacetime-interval#thm-max-proper-time)里的定理，匀速直线的世界线固有时最长，乘上$-mc^2$，它的作用量就最小。边界情况：$L$本身不是洛伦兹标量，$L\,\dd t=-mc^2\,\dd\tau$才是；$m=0$时作用量恒为零，这种写法描述不了:term[无质量粒子]{id="physics.special-relativity.massless-particle"}（massless particle）。

### 由作用量推出动量和能量

::anchor{id="thm-action-momentum-energy"}
定理（动量和能量）：对拉格朗日量$L=-mc^2\sqrt{1-u^2/c^2}$，（1）$\pdv{L}{u_x}=\gamma_umu_x$，$y$、$z$分量同理，即$\pdv{L}{\vb u}=\gamma_um\vb u$；（2）$\vb u\cdot\pdv{L}{\vb u}-L=\gamma_umc^2$；（3）拉格朗日方程是$\dv{}{t}(\gamma_um\vb u)=0$，自由粒子做匀速直线运动，上面两个量都守恒。

证明：（1）$\pdv{L}{u_x}=-mc^2\cdot\frac{1}{2\sqrt{1-u^2/c^2}}\cdot\bigl(-\frac{2u_x}{c^2}\bigr)=\frac{mu_x}{\sqrt{1-u^2/c^2}}=\gamma_umu_x$。（2）$\vb u\cdot\gamma_um\vb u-L=\gamma_umu^2+\frac{mc^2}{\gamma_u}=\gamma_um\bigl(u^2+c^2-u^2\bigr)=\gamma_umc^2$。（3）$L$不显含$x$、$y$、$z$，拉格朗日方程（Lagrange's equations）$\dv{}{t}\pdv{L}{u_x}=\pdv Lx=0$给出$\gamma_um\vb u$不变，速度也就不变；$L$不显含$t$，沿运动$\dv{}{t}\bigl(\vb u\cdot\pdv{L}{\vb u}-L\bigr)=-\pdv Lt=0$（见[能量函数与能量守恒](lesson:physics.analytical-mechanics.energy-function)）。

这两个量就是分析力学里的广义动量（generalized momentum）和能量函数（energy function）。从作用量出发，不用任何碰撞实验，就得到了[四维速度与四维动量](lesson:physics.special-relativity.four-momentum)里定义的相对论动量$\gamma_um\vb u$和能量$\gamma_umc^2$；能量里自动带着粒子静止时的$mc^2$，它来自拉格朗日量里那个对运动方程没有影响的常数。

### 不依赖参数的写法

上面的写法挑了一个:term[惯性系]{id="physics.special-relativity.inertial-frame"}的时间$t$作参数。用沿:term[世界线]{id="physics.special-relativity.worldline"}单调增加的任意参数$\lambda$，记$\dot x^\mu=\dv{x^\mu}{\lambda}$，作用量可以写成

$$
\mathcal S=-mc\int\sqrt{\eta_{\mu\nu}\dot x^\mu\dot x^\nu}\,\dd\lambda ,
$$

因为$\sqrt{\eta_{\mu\nu}\dd x^\mu\dd x^\nu}=c\,\dd\tau$。这个写法里四个坐标$x^0=ct$、$x^1$、$x^2$、$x^3$地位相同，每一项都是:term[洛伦兹标量]{id="physics.special-relativity.lorentz-scalar"}。

::anchor{id="thm-covariant-action"}
定理（四维写法）：（1）上面的$\mathcal S$不随参数$\lambda$的选取而变；（2）它的欧拉-拉格朗日方程，取$\lambda=\tau$后就是$\dv{P^\mu}{\tau}=0$；（3）和$x^\mu$共轭的量是$-P_\mu$：空间坐标$x^i$共轭的是动量$p^i$，时间坐标$x^0=ct$共轭的是$-\frac Ec$。

证明：（1）换参数$\lambda=\lambda(\sigma)$，$\dv{x^\mu}{\sigma}=\dot x^\mu\dv\lambda\sigma$，根号里多出因子$\bigl(\dv\lambda\sigma\bigr)^2$，开方后和$\dd\sigma$相乘正好是$\dd\lambda$。（2）记被积函数$\tilde L=-mc\sqrt{\eta_{\rho\sigma}\dot x^\rho\dot x^\sigma}$，$\pdv{\tilde L}{\dot x^\mu}=-\frac{mc\,\eta_{\mu\nu}\dot x^\nu}{\sqrt{\eta_{\rho\sigma}\dot x^\rho\dot x^\sigma}}$，$\tilde L$不显含$x^\mu$，欧拉-拉格朗日方程（Euler–Lagrange equations）是$\dv{}{\lambda}\pdv{\tilde L}{\dot x^\mu}=0$；取$\lambda=\tau$，根号是$c$，$\pdv{\tilde L}{\dot x^\mu}=-m\eta_{\mu\nu}U^\nu=-P_\mu$，所以$\dv{P_\mu}{\tau}=0$，升指标就是$\dv{P^\mu}{\tau}=0$。（3）就是（2）里算出的$\pdv{\tilde L}{\dot x^\mu}=-P_\mu$：$-P_i=p^i$，$-P_0=-\frac Ec$。

所以:term[四维动量]{id="physics.special-relativity.four-momentum"}（four-momentum）守恒对应作用量不显含四个坐标：空间平移不改变作用量，给出动量守恒；时间平移不改变作用量，给出能量守恒。能量和时间共轭时多一个负号，来自度规$\eta_{00}$和$\eta_{ii}$的符号相反。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-1, 1], y: [-2.5, 0.5] }
functions:
  - expr: "-sqrt(1 - x^2)"
    label: |
      $L=-mc^2\sqrt{1-u^2/c^2}$
  - expr: "-1 + x^2/2"
    label: |
      低速近似$-mc^2+\frac12mu^2$
  - expr: "-sqrt(1 - a^2) + a/sqrt(1 - a^2)*(x - a)"
    label: |
      在$u$处的切线
points:
  - { x: "a", y: "-sqrt(1 - a^2)" }
  - { x: "0", y: "-1/sqrt(1 - a^2)" }
sliders:
  - name: a
    min: 0
    max: 0.9
    step: 0.01
    default: 0.5
    label: |
      粒子的速度$u/c$
:::

横轴是$\frac uc$，纵轴是拉格朗日量，以$mc^2$为单位。切线的斜率是$\pdv Lu$，即动量（以$mc$为单位）；切线在纵轴上的截距是$L-u\pdv Lu=-E$，即能量的相反数。速度越接近光速，切线越陡、截距越低：动量和能量都没有上限，而$L$本身只从$-mc^2$变到$0$。

## 例题

### 例 1　由拉格朗日量算动量和能量

粒子以$0.5c$运动。按这一节的拉格朗日量求它的动量和能量，并核对:term[能量-动量关系]{id="physics.special-relativity.energy-momentum-relation"}（energy–momentum relation）。

**为什么想到这么做**：动量是$\pdv Lu$，能量是$u\pdv Lu-L$，直接代入定理。

**推导**：$\sqrt{1-0.25}=\frac{\sqrt3}2$，$\gamma_u=\frac{2}{\sqrt3}\approx1.155$。$p=\gamma_um\times0.5c=\frac{1}{\sqrt3}mc\approx0.577mc$；$L=-\frac{\sqrt3}2mc^2$，$E=up-L=\frac{1}{2\sqrt3}mc^2+\frac{\sqrt3}{2}mc^2=\frac{2}{\sqrt3}mc^2\approx1.155mc^2$。核对：$E^2-p^2c^2=\bigl(\frac43-\frac13\bigr)m^2c^4=m^2c^4$。

### 例 2　加上势能

在某个:term[惯性系]{id="physics.special-relativity.inertial-frame"}里有一个不随时间变的势能$V(\vb r)$，粒子的拉格朗日量取$L=-mc^2\sqrt{1-u^2/c^2}-V(\vb r)$。写出运动方程和守恒的能量；势能是$V=-q\mathcal Ex$（电场强度为$\mathcal E$、沿$x$轴的匀强电场）时，结果是什么？

**为什么想到这么做**：拉格朗日方程照常用，只是$\pdv{L}{\vb u}$换成了相对论动量；$L$不显含时间，能量函数守恒。

**推导**：$\pdv{L}{\vb u}=\gamma_um\vb u$，$\pdv{L}{\vb r}=-\nabla V$，拉格朗日方程给出$\dv{}{t}(\gamma_um\vb u)=-\nabla V$：力是$-\nabla V$，它改变的是相对论动量。守恒的能量是$\vb u\cdot\pdv{L}{\vb u}-L=\gamma_umc^2+V$。匀强电场里$-\nabla V$是沿$x$轴的$q\mathcal E$，$\dv{}{t}(\gamma_umu)=q\mathcal E$，力不变，就是[四维力与相对论动力学](lesson:physics.special-relativity.four-force)里的:term[双曲运动]{id="physics.special-relativity.hyperbolic-motion"}（hyperbolic motion）；带电粒子在一般电磁场里的拉格朗日量，见 p7。

## 常见误区

- 「相对论的拉格朗日量是动能减势能，$L=(\gamma_u-1)mc^2-V$。」这样算出的$\pdv Lu=\gamma_u^3mu$，不是相对论动量；正确的是$L=-mc^2\sqrt{1-u^2/c^2}-V$，它不是「动能减势能」。
- 「拉格朗日量是:term[洛伦兹标量]{id="physics.special-relativity.lorentz-scalar"}。」$L=-\frac{mc^2}{\gamma_u}$随:term[惯性系]{id="physics.special-relativity.inertial-frame"}变，洛伦兹标量是$L\,\dd t=-mc^2\,\dd\tau$，即作用量。
- 「作用量前面的负号可以随便去掉。」去掉负号，运动方程不变，可算出的动量变成$-\gamma_um\vb u$、能量变成负的；负号由低速时$L\approx\frac12mu^2+\text{常数}$确定。
- 「真实的:term[世界线]{id="physics.special-relativity.worldline"}让作用量取最大值。」:term[固有时]{id="physics.special-relativity.proper-time"}最长，作用量$-mc^2\tau$就最短；一般只说取驻值。

---
id: math.pde.spherical-waves
title: |
  球面波与球对称的初值问题
goal: |
  会把球对称的三维波动方程化成一维波动方程，写出向外、向内传播的球面波，并用达朗贝尔公式解球对称的初值问题。
prerequisites: [math.pde.wave-dalembert, math.vector-calculus.curvilinear-coordinates]
minutes: 25
summary: |
  球面波乘$r$满足一维波动方程，在原点有界时向内向外两部分配对。
status: reviewed
---

## 这一节要回答的问题

在空旷的地方放一个鞭炮，声音向四面八方同样地传开，空气压强的变化只和离鞭炮的距离有关。压强的微小变化满足三维的:term[波动方程]{id="math.pde.wave-equation"}（wave equation）。只和距离有关的解，能不能像一维时那样，用:term[达朗贝尔公式]{id="math.pde.dalembert-formula"}（d'Alembert's formula）求出来？离得越远声音越弱，又是为什么？

## 讲解

### 球对称的波动方程

三维的:term[波动方程]{id="math.pde.wave-equation"}是$u_{tt}=c^2\Delta u$，$\Delta u=u_{xx}+u_{yy}+u_{zz}$就是[拉普拉斯算子](lesson:math.vector-calculus.vector-identities#def-laplacian)（Laplacian）$\nabla^2u$。设$u$只依赖时间$t$和到原点的距离$r=|\vb r|$，即$u$是球对称（spherically symmetric）的。这时球坐标（spherical coordinates）下的拉普拉斯算子只剩第一项（见[柱坐标与球坐标下的梯度、散度和旋度](lesson:math.vector-calculus.curvilinear-coordinates#thm-curvilinear-laplacian)），$r>0$处$\Delta u=u_{rr}+\frac2ru_r$；又$(ru)_{rr}=ru_{rr}+2u_r$，所以

$$
\Delta u=\frac1r(ru)_{rr}\qquad(r>0),
$$

这就是那一节的第 7 题（1）。

::anchor{id="thm-radial-reduction"}
**定理 1**　设$u$只依赖$r$和$t$，在$r>0$上二阶偏导数（second-order partial derivative）连续，记$w=ru$。$u$在$r>0$上满足三维的波动方程，当且仅当$w$满足一维的波动方程$w_{tt}=c^2w_{rr}$；这时$u=\frac{F(r-ct)+G(r+ct)}r$，$F$、$G$是二阶可导（twice differentiable）的一元函数。

**证明思路**：$w_{tt}=ru_{tt}$，$c^2w_{rr}=c^2r\Delta u$，两边只差一个不为零的因子$r$。通解（general solution）照[一维波动方程与达朗贝尔公式](lesson:math.pde.wave-dalembert#thm-general-solution)的定理 1：令$\xi=r-ct$、$\eta=r+ct$，由$w_{\xi\eta}=0$积分两次；$r>0$是半平面$\xi+\eta>0$，固定$\xi$或$\eta$时另一个仍在一个区间里变，积分照样成立。

乘上$r$，三维的问题就成了半直线$r>0$上的一维问题；多出的端点$r=0$要满足什么条件，后面再说。

### 向外和向内的球面波

::anchor{id="def-spherical-wave"}
三维的:term[波动方程]{id="math.pde.wave-equation"}只依赖$r$和$t$的解，叫作:term[球面波]{id="math.pde.spherical-wave"}（spherical wave）；其中$\frac{F(r-ct)}r$叫作向外传播的球面波，$\frac{G(r+ct)}r$叫作向内传播的球面波（$r>0$）。

为什么这样定义：每个时刻，$u$在以原点为心的每个球面上取同一个值。$\frac{F(r-ct)}r$里$F$的形状以速度$c$向外走，高低却按$\frac1r$变小，离得越远越弱；向内传播的越走越高。[平面波与球面波](lesson:physics.oscillations-waves.waves-in-3d#thm-spherical-wave)一节的定理验证了向外的$\frac{f(r-vt)}r$是解（那里的$v$就是$c$），定理 1 进一步说，$r>0$上的球面波只有这两种之和。

越传越弱，能量却没有丢：:term[能流]{id="physics.oscillations-waves.energy-flux"}（energy flux）和振幅的平方成正比（见[平面波与球面波](lesson:physics.oscillations-waves.waves-in-3d)），按$\frac1{r^2}$变小，乘上球面积$4\pi r^2$就不变了。

边界情况：在$r>0$上，向内的和向外的一样满足方程；只取向外的一半要另加条件，如电磁学[推迟势](lesson:physics.electromagnetism.retarded-potentials)一节依据的「没有从远处射来的波」。

### 球对称的初值问题

给出开始时的$u(r,0)=\varphi(r)$、$u_t(r,0)=\psi(r)$（$r\ge0$），求以后的:term[球面波]{id="math.pde.spherical-wave"}，这是一个:term[初值问题]{id="math.pde.initial-value-problem"}（initial value problem）。初值在原点也有定义，要找的是整个空间里的解，所以还要求$u$在原点附近有界。

这个条件把原点处有源的情形排除在外。例如$\frac Br$（常数$B\ne0$）在$r>0$上满足方程，可$\nabla\bigl(\frac Br\bigr)$穿过以原点为心的球面的通量（flux）总是$-4\pi B$，球面缩得再小也不趋于$0$（光滑的场会趋于$0$，见[高斯公式（散度定理）](lesson:math.vector-calculus.divergence-theorem)），原点处像放着一个:term[点源]{id="math.vector-calculus.point-source"}（point source）。[柱坐标与球坐标下的梯度、散度和旋度](lesson:math.vector-calculus.curvilinear-coordinates)第 7 题（3）要求在原点有界，排除的就是它。

$u$有界时，$w=ru$在$r\to0^+$时趋于$0$，由定理 1 得$F(-ct)+G(ct)=0$，即$G(s)=-F(-s)$（$s\ge0$）：向内传播的部分由向外的部分定出，两者配成一对。

::anchor{id="thm-spherical-ivp"}
**定理 2**　设$\varphi$在$r\ge0$上有连续的二阶导数（second derivative），$\varphi'(0)=0$，$\psi$在$r\ge0$上有连续的导数。在$r>0$上二阶偏导数连续、在原点附近有界、满足这两个初值的球面波恰好有一个：把$r\varphi(r)$、$r\psi(r)$延成奇函数，即$s\varphi(|s|)$、$s\psi(|s|)$（$s$取一切实数），代进:term[达朗贝尔公式]{id="math.pde.dalembert-formula"}求出$w$，再除以$r$。

写出来，$r>0$、$t\ge0$时

$$
u(r,t)=\frac{(r-ct)\varphi(|r-ct|)+(r+ct)\varphi(r+ct)}{2r}+\frac1{2cr}\int_{r-ct}^{r+ct}s\psi(|s|)\dd s .
$$

**证明思路**：$w$满足一维的:term[波动方程]{id="math.pde.wave-equation"}，开始时$w=r\varphi$、$w_t=r\psi$，原点处$w=0$，正是[一维波动方程与达朗贝尔公式](lesson:math.pde.wave-dalembert)第 5 题里左端固定的弦：初值延成奇函数后，公式在端点给出$0$。$\varphi'(0)=0$保证$s\varphi(|s|)$在$0$处也有连续的二阶导数，公式给出真正的解。唯一：有界的解写成$\frac{F(r-ct)+G(r+ct)}r$，初值定出$F$、$G$在正半轴上的值（只差一个消得掉的常数），$G(s)=-F(-s)$再定出$F$在负半轴上的值。

边界情况：$\varphi'(0)\ne0$时开始的形状在原点有个尖，如$\varphi(r)=e^{-r}$，公式给出的只是放宽了意思的解。原点处的值取$r\to0^+$时的极限，一般的式子见第 5 题。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0.02, 4.2], y: [-0.05, 1.05] }
functions:
  - expr: "max(0, (min(x + s, 1)^2 - max(x - s, -1)^2)/4)"
    label: |
      $w=ru$
  - expr: "max(0, (min(x + s, 1)^2 - max(x - s, -1)^2)/(4*x))"
    label: |
      $u$
sliders:
  - name: s
    min: 0
    max: 3
    step: 0.02
    default: 0.5
    label: |
      时间$t$（$c=1$，$a=1$，$v_0=1$）
:::

图上是例 1 取$c=1$、$a=1$、$v_0=1$的情形，横轴写作 x，是$r$，从$0.02$起，最左端的值就是球心附近的值；纵轴写作 y。蓝线是$w=ru$，橙线是$u$。

拖动时间滑块：$t=0$时只有初速度，两条线都贴在横轴上；$t<1$时，球心附近的橙线整块以$u=t$上升，外面一圈在向外传；$t$过了$1$，球心附近回到$0$，只剩一个向外走的球壳。这以后蓝线像一维的弦上的波，形状不变地向右走；橙线是它除以$r$，越走越矮。

## 例题

### 例 1　球里有均匀的初速度

$\varphi=0$；$r<a$时$\psi(r)=v_0$，$r>a$时$\psi(r)=0$（$a$、$v_0$是正常数）。求$u$，说明球心处的值怎样随时间变化，$r>a$处什么时候开始动、什么时候又静止。$\psi$在$r=a$处跳跃，这样的$u$只是放宽了意思的解，这里直接照定理 2 的公式算。

**为什么想到这么做**：$\varphi=0$，公式只剩积分那一项；$s\psi(|s|)$在$|s|<a$时是$v_0s$，其余是$0$。积分就是$\frac{v_0}2$乘重叠部分两端的平方差，所以要看积分区间$[r-ct,r+ct]$和$(-a,a)$怎样重叠。

**推导**：重叠部分是$(A,B)$时$u=\frac{v_0(B^2-A^2)}{4cr}$，不重叠时$u=0$。设$r>0$、$t>0$，分三种情形：

- $r+ct<a$：积分区间整个在$(-a,a)$里，$u=\frac{v_0[(r+ct)^2-(r-ct)^2]}{4cr}=v_0t$。
- $|r-ct|<a<r+ct$：重叠部分是$(r-ct,a)$，$u=\frac{v_0[a^2-(r-ct)^2]}{4cr}$。
- $r-ct\ge a$或$r-ct\le-a$：前者不重叠，后者盖住整个$(-a,a)$，奇函数在上面的积分是$0$，都有$u=0$。

球心：$r\to0^+$时，$ct<a$落在第一种情形，$u\to v_0t$；$ct>a$落在第三种，$u=0$。所以球心处的值从$0$开始均匀增大，快到$t=\frac ac$时接近$\frac{v_0a}c$，过了$\frac ac$一下子变成$0$，以后一直是$0$（为什么会跳，见第 7 题）。

$r>a$处：$ct\le r-a$时不动，$r-a<ct<r+a$时是第二种情形，$ct\ge r+a$以后又是$0$。所以这里从$t=\frac{r-a}c$动到$t=\frac{r+a}c$：扰动是一个厚$2a$、以速度$c$向外走的球壳，最高$\frac{v_0a^2}{4cr}$。球壳走过以后完全静止，不像一维时初速度把弦整体抬高（[一维波动方程与达朗贝尔公式](lesson:math.pde.wave-dalembert)例 1），原因见[三维波动方程与惠更斯原理](lesson:math.pde.wave-3d)。

## 常见误区

- 「$w=ru$满足一维的:term[波动方程]{id="math.pde.wave-equation"}，所以$u$也形状不变地传播。」形状不变的是$w$里向外、向内的两部分；$u=\frac wr$还要除以$r$，向外走时越来越矮，向内走时越来越高（几何图像里蓝线和橙线的对比）。
- 「:term[球面波]{id="math.pde.spherical-wave"}的振幅按$\frac1{r^2}$变小，因为球面积和$r^2$成正比。」被越来越大的球面摊薄的是:term[能流]{id="physics.oscillations-waves.energy-flux"}，它和振幅的平方成正比，所以振幅按$\frac1r$变小。

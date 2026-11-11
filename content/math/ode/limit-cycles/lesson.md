---
id: math.ode.limit-cycles
title: |
  极限环
goal: |
  会识别极限环，并用庞加莱-本迪克松定理判断平面上的周期轨道是否存在。
prerequisites: [math.ode.nonlinear-systems]
minutes: 35
summary: |
  孤立的闭轨叫极限环；轨线困在无平衡点的有界区域里就有闭轨。
status: reviewed
---

## 这一节要回答的问题

线性系统的周期解（periodic solution）成片出现：:term[中心]{id="math.ode.center"}（center）周围的闭曲线一圈挨一圈，振幅由初值决定。可有些振动不管从哪里开始，最后都落到同样的振幅和周期上，比如范德波尔方程（van der Pol equation）$x''-\mu(1-x^2)x'+x=0$，它最初来自电子管振荡电路。平面上怎样的方程组会有这样一条「吸引」别的:term[轨线]{id="math.ode.trajectory"}（trajectory）的闭曲线？不解方程，怎样判断它存在？

## 讲解

### 闭轨与极限环

::anchor{id="def-closed-orbit"}
不是常数的解$\vb x(t)$，如果有$T>0$使$\vb x(t+T)=\vb x(t)$对所有$t$成立，就叫作周期解（periodic solution）；它的:term[轨线]{id="math.ode.trajectory"}（trajectory）是一条闭曲线，叫作:term[闭轨]{id="math.ode.closed-orbit"}（closed orbit）。

为什么这样定义：由唯一性，解回到出发过的点以后，就会一模一样地重走一遍，所以轨线闭合等价于解是周期的。闭轨上没有:term[平衡点]{id="math.ode.equilibrium-point"}（equilibrium point），因为经过平衡点的轨线只有那一个点。边界情况：单摆在:term[中心]{id="math.ode.center"}附近的闭曲线都是闭轨，周期随振幅变化（[非线性系统与线性化](lesson:math.ode.nonlinear-systems)第 8 题）。

::anchor{id="def-limit-cycle"}
附近没有别的闭轨的闭轨叫作:term[极限环]{id="math.ode.limit-cycle"}（limit cycle）。两侧附近的轨线都随$t\to+\infty$趋近它时，叫作稳定的极限环；都离开它时叫作不稳定的；一侧趋近、一侧离开时叫作半稳定的（semi-stable）。

为什么这样定义：「孤立」把中心周围那种成片的闭轨排除在外，剩下的是由方程本身决定振幅和周期的振荡，稳定的极限环受了扰动还会回到它上面（第 8 题）。最简单的例子是极坐标下的$r'=r(1-r^2)$、$\theta'=1$：$0<r<1$时$r'>0$，$r>1$时$r'<0$，所以圆$r=1$两侧的轨线都盘旋着趋近它，它是稳定的极限环。边界情况：线性系统没有极限环，它的闭轨乘一个常数仍是闭轨（第 7 题）。

### 庞加莱-本迪克松定理

::anchor{id="thm-poincare-bendixson"}
**:term[庞加莱-本迪克松定理]{id="math.ode.poincare-bendixson-theorem"}（Poincaré-Bendixson theorem）**　设平面方程组$\vb x'=\vb f(\vb x)$的$\vb f$有连续的偏导数（partial derivative），$R$是平面上的有界闭区域，里面没有:term[平衡点]{id="math.ode.equilibrium-point"}。如果有一条:term[轨线]{id="math.ode.trajectory"}从某个时刻起一直留在$R$里，那么$R$里有一条:term[闭轨]{id="math.ode.closed-orbit"}：这条轨线本身是闭轨，或者随$t\to+\infty$盘旋着趋近一条闭轨。

**证明思路**：这里不证。关键是平面上的轨线不能相交：一条轨线被关在有界的区域里，又不能停在平衡点上，只能越绕越贴近自己走过的路，最后贴到一条闭曲线上。三维时轨线可以从旁边绕过去，定理不再成立，见以后的[混沌初步](lesson:math.ode.chaos)。

::anchor{id="def-trapping-region"}
如果从区域$R$的边界上出发的轨线都进入$R$（边界上$\vb f$指向$R$的里面），从$R$里出发的轨线就再也出不去，这样的$R$叫作:term[捕获区域]{id="math.ode.trapping-region"}（trapping region）。

为什么这样定义：庞加莱-本迪克松定理要求有一条轨线一直留在$R$里，捕获区域里出发的每一条都满足。常用的做法是取环形区域$a\le r\le b$：在$r=a$上$r'>0$，在$r=b$上$r'<0$，内圈把平衡点挖掉，再验证环里没有平衡点（例 2）。可以证明，闭轨围住的区域里一定有平衡点（这里不证），所以环形区域的「洞」里通常正好有一个平衡点。

### 范德波尔振子

范德波尔方程化成$x'=y$、$y'=-x+\mu(1-x^2)y$（$\mu>0$）。它像一个阻尼系数是$-\mu(1-x^2)$的振子：$|x|<1$时阻尼为负，振动被放大；$|x|>1$时阻尼为正，振动被削弱。用$E=\frac12(x^2+y^2)$来看，$\frac{\dd E}{\dd t}=\mu(1-x^2)y^2$，小振幅时能量增加，大振幅时转一圈下来能量减少，振幅最后停在中间某处。

原点处的:term[线性化]{id="math.ode.linearization"}（linearization）矩阵是$\begin{pmatrix}0&1\\-1&\mu\end{pmatrix}$，$T=\mu>0$、$D=1$，原点不稳定，附近的:term[轨线]{id="math.ode.trajectory"}离开原点；远处的轨线又被拉回来。可以证明（李纳尔定理（Liénard's theorem），这里不证），对每个$\mu>0$，范德波尔方程恰好有一个:term[极限环]{id="math.ode.limit-cycle"}，并且是稳定的。数值计算表明，极限环在$x$方向上的最大值总在$2$附近，$\mu$很小时它接近半径为$2$的圆，周期接近$2\pi$。

## 几何图像

:::anim{component="phase-portrait"}
system: { x: "y", y: "-x + m*(1 - x^2)*y" }
range: { x: [-4, 4], y: [-4.5, 4.5] }
dt: 0.01
initial:
  - [0.1, 0]
  - [-0.1, 0]
  - [3.5, 0]
  - [-3.5, 0]
  - [0, 3]
  - [0, -3]
sliders:
  - name: m
    min: 0.2
    max: 2
    step: 0.2
    default: 1
    label: |
      $\mu$
:::

这是范德波尔方程$x'=y$、$y'=-x+\mu(1-x^2)y$。从原点附近出发的两条:term[轨线]{id="math.ode.trajectory"}向外盘旋，从远处出发的四条向里盘旋，最后都落到同一条闭曲线上，那就是稳定的:term[极限环]{id="math.ode.limit-cycle"}。拖动$\mu$：$\mu$小时极限环接近半径为$2$的圆；$\mu$变大，它在纵向上被拉长，$\mu=2$时$y$的最大值约为$3.8$，形状越来越不像圆，可横向的最大值仍在$2$附近。

## 例题

### 例 1　两个极限环

求$r'=r(r-1)(2-r)$、$\theta'=1$的:term[极限环]{id="math.ode.limit-cycle"}，并判断它们的稳定性。

**为什么想到这么做**：$\theta'=1$，点一直在转；$r'=0$的正根$r=c$给出圆$r=c$，它是:term[闭轨]{id="math.ode.closed-orbit"}。看$r'$在圆两侧的符号，就知道附近的:term[轨线]{id="math.ode.trajectory"}是趋近还是离开。

**推导**：$r'=0$的正根是$r=1$和$r=2$，两个圆都是闭轨，附近没有别的闭轨，都是极限环。$0<r<1$时$r'=r\cdot(-)\cdot(+)<0$，$1<r<2$时$r'>0$：$r=1$两侧的轨线都离开它，是不稳定的极限环。$1<r<2$时$r'>0$，$r>2$时$r'<0$：$r=2$两侧的轨线都趋近它，是稳定的极限环。

### 例 2　找一个捕获区域

证明$x'=x-y-x(x^2+2y^2)$、$y'=x+y-y(x^2+2y^2)$有一条:term[闭轨]{id="math.ode.closed-orbit"}。

**为什么想到这么做**：方程不能解出来，用:term[庞加莱-本迪克松定理]{id="math.ode.poincare-bendixson-theorem"}。右边有$x^2+y^2$的影子，换成极坐标看$r'$的符号，找一个环形的:term[捕获区域]{id="math.ode.trapping-region"}。

**推导**：$rr'=xx'+yy'=x^2+y^2-(x^2+y^2)(x^2+2y^2)$，所以$r'=r\bigl(1-(x^2+2y^2)\bigr)$。因为$r^2\le x^2+2y^2\le2r^2$：在$r=\frac12$上$x^2+2y^2\le\frac12$，$r'>0$；在$r=2$上$x^2+2y^2\ge4$，$r'<0$。:term[平衡点]{id="math.ode.equilibrium-point"}只有原点（由$x'=y'=0$可推出$(1-s)^2x=-x$，$s=x^2+2y^2$，只能$x=0$，再得$y=0$），不在环里。所以环形区域$\frac12\le r\le2$是没有平衡点的捕获区域，由定理，里面有一条闭轨。

## 常见误区

- 「:term[闭轨]{id="math.ode.closed-orbit"}就是:term[极限环]{id="math.ode.limit-cycle"}。」:term[中心]{id="math.ode.center"}周围的闭轨一圈挨一圈，不是孤立的，不是:term[极限环]{id="math.ode.limit-cycle"}。
- 「:term[庞加莱-本迪克松定理]{id="math.ode.poincare-bendixson-theorem"}在三维也成立。」它靠平面上:term[轨线]{id="math.ode.trajectory"}不能相交；三维的轨线可以绕来绕去，永远不闭合也不停下，见[混沌初步](lesson:math.ode.chaos)。
- 「区域里有:term[平衡点]{id="math.ode.equilibrium-point"}，也能用这个定理。」要求区域里没有平衡点，否则留在区域里的轨线可能只是趋于平衡点；所以常把平衡点挖掉，取环形区域。
- 「极限环一定是圆。」例 1 里是圆，只是因为方程在极坐标下$r'$不依赖$\theta$；范德波尔方程的极限环就不是圆。

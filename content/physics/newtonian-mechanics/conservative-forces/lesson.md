---
id: physics.newtonian-mechanics.conservative-forces
title: |
  保守力与势能的梯度
goal: |
  会判断一个力是否保守，并用$\vb{F}=-\nabla U$在势能和力之间换算。
prerequisites: [physics.newtonian-mechanics.potential-energy, math.vector-calculus.conservative-fields]
minutes: 25
summary: |
  保守力是势能的负梯度$\vb F=-\nabla U$；单连通区域里旋度为零的力是保守力。
status: reviewed
---

## 这一节要回答的问题

:term[重力]{id="physics.newtonian-mechanics.weight"}（weight）、弹簧的:term[弹力]{id="physics.newtonian-mechanics.elastic-force"}（elastic force）是:term[保守力]{id="physics.newtonian-mechanics.conservative-force"}（conservative force），:term[滑动摩擦力]{id="physics.newtonian-mechanics.kinetic-friction"}（kinetic friction，见[摩擦力](lesson:physics.newtonian-mechanics.friction)）不是。给一个随位置变化的:term[力]{id="physics.newtonian-mechanics.force"}（force），比如$\vb F=(2xy,\ x^2)$，怎样判断它保守不保守？知道了:term[势能]{id="physics.newtonian-mechanics.potential-energy"}（potential energy），又怎样反过来求出力？

## 讲解

### 力是势能的负梯度

::anchor{id="def-force-field"}
只随位置变化、在空间每一点都有确定值的:term[力]{id="physics.newtonian-mechanics.force"}$\vb F(\vb r)$，叫作力场（force field）。

为什么这样定义：:term[重力]{id="physics.newtonian-mechanics.weight"}、弹簧的:term[弹力]{id="physics.newtonian-mechanics.elastic-force"}都只取决于质点在哪里，给定了位置就给定了力，这样的力才谈得上「做的:term[功]{id="physics.newtonian-mechanics.work"}（work）只看起点和终点」。边界情况：:term[滑动摩擦力]{id="physics.newtonian-mechanics.kinetic-friction"}、空气的阻碍和:term[速度]{id="physics.newtonian-mechanics.velocity"}（velocity）的方向有关，同一个位置上力可以不同，它们不是力场，也就谈不上:term[势能]{id="physics.newtonian-mechanics.potential-energy"}。

质点沿曲线$C$运动时，力场做的功$\int\vb F\cdot\vb v\,\dd t$，按时间参数化，就是曲线积分（line integral）$\int_C\vb F\cdot\dd\vb r$。所以力场是:term[保守力]{id="physics.newtonian-mechanics.conservative-force"}，正好就是数学里说的保守场（conservative field）。

::anchor{id="thm-gradient"}
定理：在一个区域里，力场$\vb F$是保守力，当且仅当有函数$U$使$\vb F=-\nabla U$；这个$U$就是它的势能。分量写出来是$F_x=-\frac{\partial U}{\partial x}$，$F_y=-\frac{\partial U}{\partial y}$，$F_z=-\frac{\partial U}{\partial z}$；沿直线运动时，它就是[势能与机械能守恒](lesson:physics.newtonian-mechanics.potential-energy#thm-force-from-potential)里推出的$F=-\dv Ux$。

证明思路：保守场就是梯度场（gradient field），有势函数（potential function）$f$使$\vb F=\nabla f$。由曲线积分基本定理（fundamental theorem for line integrals），从$A$到$B$做的功是$f(B)-f(A)$；和势能的定义$W_{AB}=U(A)-U(B)$对照，$U=-f$就是势能。

为什么有负号：数学书的势函数满足$\vb F=\nabla f$，物理的势能和它差一个负号。梯度（gradient）指向$U$增加最快的方向，负号让力指向势能降低最快的方向：力做正功时，势能减少。力和$U$的等值面（level surface）垂直，等值面越密，力越大；$U$加上一个常数，力不变。

### 怎样判断力是否保守

::anchor{id="thm-curl-test"}
定理：在单连通区域（simply connected region）里，有连续偏导数（partial derivative）的力场$\vb F$是:term[保守力]{id="physics.newtonian-mechanics.conservative-force"}，当且仅当它的旋度（curl）处处为零，$\nabla\times\vb F=\vb 0$；在平面上就是$\frac{\partial F_y}{\partial x}=\frac{\partial F_x}{\partial y}$。

这是[保守场与路径无关](lesson:math.vector-calculus.conservative-fields)里的判别法换成力的说法。判断时有两种办法：说它保守，可以算旋度，或者直接找出$U$；说它不保守，只要找到一条闭曲线，:term[力]{id="physics.newtonian-mechanics.force"}沿它走一圈做的:term[功]{id="physics.newtonian-mechanics.work"}不为零。

找$U$的办法：从参考点出发，沿一条方便的路径（例如先沿$x$轴、再平行于$y$轴）把$-\vb F\cdot\dd\vb r$积起来；或者先由$F_x=-\frac{\partial U}{\partial x}$对$x$积分，再用$F_y$定出剩下的那个只含$y$的函数。

## 几何图像

:::anim{component="vector-field-2d"}
field: { x: "-x - c*y", y: "-y + c*x" }
range: { x: [-3, 3], y: [-3, 3] }
dt: 0.02
particles: 300
sliders:
  - name: c
    min: 0
    max: 2
    step: 0.1
    default: 0
    label: |
      绕原点转的那部分力的强弱$c$
:::

箭头是力场$\vb F=(-x-cy,\ -y+cx)$的方向，粒子沿着力的方向跑，只是画出力的走向，不是质点真实的运动。$c=0$时:term[力]{id="physics.newtonian-mechanics.force"}处处指向原点，大小正比于离原点的距离，它是$U=\frac12(x^2+y^2)$的负梯度，是:term[保守力]{id="physics.newtonian-mechanics.conservative-force"}。拖动$c$，力多了一个绕原点转的部分$c(-y,\ x)$，旋度变成$2c$，粒子沿螺线转进原点；这时沿以原点为圆心、半径$r$的圆逆时针走一圈，力做的:term[功]{id="physics.newtonian-mechanics.work"}是$2\pi cr^2$，不再是保守力。

## 例题

### 例 1　判断并求势能

力场$\vb F=(2xy+3,\ x^2)$，:term[力]{id="physics.newtonian-mechanics.force"}以$\mathrm N$为单位，坐标以$\mathrm m$为单位。它是不是:term[保守力]{id="physics.newtonian-mechanics.conservative-force"}？如果是，求它的:term[势能]{id="physics.newtonian-mechanics.potential-energy"}，以及质点从原点移到$(1,2)$时它做的:term[功]{id="physics.newtonian-mechanics.work"}。

**为什么想到这么做**：力场定义在整个平面上，平面是单连通的，看$\frac{\partial F_y}{\partial x}$和$\frac{\partial F_x}{\partial y}$是否相等；相等就积分求$U$，再用$W_{AB}=U(A)-U(B)$。

**推导**：$\frac{\partial F_y}{\partial x}=2x=\frac{\partial F_x}{\partial y}$，是保守力。由$-\frac{\partial U}{\partial x}=2xy+3$，$U=-x^2y-3x+g(y)$；再由$-\frac{\partial U}{\partial y}=x^2-g'(y)=x^2$，$g$是常数，取原点为参考点，$U=-x^2y-3x$。从原点到$(1,2)$做的功是$U(0,0)-U(1,2)=0-(-2-3)=5\,\mathrm J$，走哪条路都一样。

### 例 2　平方反比的吸引力

质点受到指向原点的:term[力]{id="physics.newtonian-mechanics.force"}，大小是$\frac k{r^2}$，$r$是它离原点的距离，$k>0$，即$\vb F=-\frac k{r^2}\uv r$，$\uv r=\frac{\vb r}r$。验证它是:term[保守力]{id="physics.newtonian-mechanics.conservative-force"}，:term[势能]{id="physics.newtonian-mechanics.potential-energy"}是$U=-\frac kr$（无穷远处为零）。

**为什么想到这么做**：力只沿半径、大小只和$r$有关，猜势能也只和$r$有关；算出$-\nabla U$，看是不是$\vb F$。

**推导**：由链式法则（chain rule），$\frac{\partial r}{\partial x}=\frac{\partial}{\partial x}\sqrt{x^2+y^2+z^2}=\frac xr$，所以只和$r$有关的函数$U(r)$满足$\nabla U=U'(r)\frac{\vb r}r=U'(r)\uv r$。$U=-\frac kr$时$U'(r)=\frac k{r^2}$，$-\nabla U=-\frac k{r^2}\uv r=\vb F$，所以它是保守力。原点处力没有定义，不过已经找到了$U$，不必再算旋度。

## 常见误区

- 「$\vb F=-\nabla U$里的负号可有可无。」负号决定:term[力]{id="physics.newtonian-mechanics.force"}的方向：力指向:term[势能]{id="physics.newtonian-mechanics.potential-energy"}降低的方向，石头往低处落，正是因为:term[重力势能]{id="physics.newtonian-mechanics.gravitational-potential-energy"}（gravitational potential energy）在低处小。
- 「旋度处处为零的力一定是:term[保守力]{id="physics.newtonian-mechanics.conservative-force"}。」还要区域单连通：在挖掉一条直线的空间里，旋度为零的力绕这条直线走一圈，做的:term[功]{id="physics.newtonian-mechanics.work"}可以不为零。
- 「保守力的大小一定不变。」弹簧的:term[弹力]{id="physics.newtonian-mechanics.elastic-force"}随伸长量变化，例 2 的力随距离变化，它们都是保守力；保守看的是做功和路径无不无关。

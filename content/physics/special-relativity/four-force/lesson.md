---
id: physics.special-relativity.four-force
title: |
  四维力与相对论动力学
goal: |
  会用相对论的运动方程求恒力作用下粒子的运动（双曲运动）。
prerequisites: [physics.special-relativity.four-momentum, math.calculus.hyperbolic-functions]
minutes: 40
summary: |
  恒力使粒子做双曲运动：速度趋近光速，快度随固有时均匀增长。
status: reviewed
---

## 这一节要回答的问题

牛顿力学里，恒力作用下物体的速度随时间均匀增大，迟早超过光速。相对论里运动方程该怎样写？一艘飞船一直以船上的人感到的恒定加速度飞行，它的速度、走过的路程和船上的钟各是多少？

## 讲解

### 力与功率

::anchor{id="def-relativistic-force"}
在一个:term[惯性系]{id="physics.special-relativity.inertial-frame"}（inertial frame）里，作用在质点上的力规定为质点动量的变化率：$\vb F=\dv{\vb p}{t}$，其中$\vb p=\gamma_um\vb u$是相对论动量（relativistic momentum）。

为什么这样定义：速度低时$\vb p\approx m\vb u$，这就回到牛顿第二定律（Newton's second law）$\vb F=m\vb a$。在粒子相互作用时，一个粒子动量的增加正是别的粒子交给它的，用动量的变化率来定义力，就和[四维速度与四维动量](lesson:physics.special-relativity.four-momentum)里的动量守恒接上了。实验上，带电粒子在电场、磁场里受的力（如$q\vb E$）正是改变它的相对论动量，加速器就是按这个设计的。边界情况：力和加速度一般不平行，同样的力沿运动方向推和垂直于运动方向推，加速度不同（见 p5）。

::anchor{id="thm-power"}
定理（功率）：$\dv{E}{t}=\vb F\cdot\vb u$；所以力对质点做的功等于质点能量$E=\gamma_umc^2$的增加。

证明：由:term[能量-动量关系]{id="physics.special-relativity.energy-momentum-relation"}（energy–momentum relation）$E^2=p^2c^2+m^2c^4$，$m$不变时两边对$t$求导，$2E\dv{E}{t}=2c^2\,\vb p\cdot\dv{\vb p}{t}$。所以$\dv{E}{t}=\frac{\vb pc^2}{E}\cdot\vb F=\vb u\cdot\vb F$，用到了$\vb u=\frac{\vb pc^2}{E}$。

### 四维力

::anchor{id="def-four-force"}
质点:term[四维动量]{id="physics.special-relativity.four-momentum"}（four-momentum）对:term[固有时]{id="physics.special-relativity.proper-time"}（proper time）的导数$K^\mu=\dv{P^\mu}{\tau}$叫作:term[四维力]{id="physics.special-relativity.four-force"}（four-force）；用三维的力表示，$K^\mu=\gamma_u\bigl(\frac{\vb F\cdot\vb u}{c},\vb F\bigr)$。

为什么这样定义：$\dd P^\mu$是:term[四维矢量]{id="physics.special-relativity.four-vector"}（four-vector），$\dd\tau$是:term[洛伦兹标量]{id="physics.special-relativity.lorentz-scalar"}（Lorentz scalar），所以$K$是四维矢量，运动方程$K^\mu=\dv{P^\mu}{\tau}$在各:term[惯性系]{id="physics.special-relativity.inertial-frame"}里形式相同。由$\dd\tau=\frac{\dd t}{\gamma_u}$，$K^\mu=\gamma_u\dv{P^\mu}{t}=\gamma_u\bigl(\frac1c\dv{E}{t},\dv{\vb p}{t}\bigr)$，再用功率定理就是上式：时间分量是功率乘$\frac{\gamma_u}{c}$，空间分量是力乘$\gamma_u$。边界情况：质量不变时$P\cdot P=m^2c^2$是常数，对$\tau$求导得$P\cdot K=0$，即$K\cdot U=0$；质点被加热、质量变化时，这个关系不成立。

### 瞬时静止系与固有加速度

坐在加速的飞船里的人，每一时刻都和某个:term[惯性系]{id="physics.special-relativity.inertial-frame"}相对静止，下一时刻又换成另一个惯性系。他感到的加速度（被压在座椅上的程度），是相对这一时刻的惯性系量的。

::anchor{id="def-instantaneous-rest-frame"}
某一时刻和质点速度相同的:term[惯性系]{id="physics.special-relativity.inertial-frame"}，叫作质点在这一时刻的:term[瞬时静止系]{id="physics.special-relativity.instantaneous-rest-frame"}（instantaneous rest frame）；质点在瞬时静止系里的加速度大小$\alpha$，叫作它的:term[固有加速度]{id="physics.special-relativity.proper-acceleration"}（proper acceleration）。

为什么这样定义：在瞬时静止系里质点这一瞬间速度为零，$\gamma_u=1$，牛顿力学在这一瞬间成立，$F'=m\alpha$；船上的人感到的就是这个加速度。固有加速度不依赖用哪个惯性系描述，是质点自己的性质（下面的定理）。边界情况：固有加速度一般不等于实验室里量到的$\frac{\dd u}{\dd t}$，沿直线加速时后者小$\gamma_u^3$倍。

::anchor{id="def-four-acceleration"}
:term[四维速度]{id="physics.special-relativity.four-velocity"}（four-velocity）对:term[固有时]{id="physics.special-relativity.proper-time"}的导数$A^\mu=\dv{U^\mu}{\tau}$叫作:term[四维加速度]{id="physics.special-relativity.four-acceleration"}（four-acceleration）。

::anchor{id="thm-four-acceleration"}
定理（四维加速度）：$A\cdot U=0$，$A\cdot A=-\alpha^2$，$\alpha$是固有加速度。

证明：$U\cdot U=c^2$是常数，对$\tau$求导得$2A\cdot U=0$。在瞬时静止系里$U=(c,0,0,0)$，由$A\cdot U=0$得$A^0=0$；空间分量是$\dv{(\gamma_u\vb u)}{\tau}$，这一瞬间$\vb u=0$、$\gamma_u=1$，而$\gamma_u$对时间的导数正比于$\vb u\cdot\vb a$，也是零，所以空间分量就是这个参考系里的加速度。于是$A=(0,\vb a_0)$，$A\cdot A=-a_0^2=-\alpha^2$；$A\cdot A$是:term[洛伦兹标量]{id="physics.special-relativity.lorentz-scalar"}，在任何惯性系里算都是这个值。

::anchor{id="thm-longitudinal-force"}
定理（沿运动方向的力）：质点沿$x$轴运动、力也沿$x$轴时，力在瞬时静止系里的值和在原来的惯性系里相同，$F'=F$；所以固有加速度$\alpha=\frac Fm$。

证明：:term[四维力]{id="physics.special-relativity.four-force"}是$K=\gamma_u\bigl(\frac{Fu}{c},F,0,0\bigr)$。按:term[洛伦兹变换]{id="physics.special-relativity.lorentz-transformation"}（Lorentz transformation）变到以$u$运动的瞬时静止系，$K'^1=\gamma_u\bigl(K^1-\frac uc K^0\bigr)=\gamma_u^2F\bigl(1-\frac{u^2}{c^2}\bigr)=F$。在瞬时静止系里$\gamma'=1$，$K'^1$就是那里的力$F'$，所以$F'=F$，而$F'=m\alpha$。

由此，沿直线运动时$F=\dv{(\gamma_umu)}{t}=\gamma_u^3m\dv ut$（因为$\dv{(\gamma_uu)}{u}=\gamma_u^3$），即$\dv ut=\frac{\alpha}{\gamma_u^3}$：同样大的力，速度越接近光速，速度增加得越慢。

### 双曲运动

::anchor{id="def-hyperbolic-motion"}
质点从静止出发，沿一条直线以不变的:term[固有加速度]{id="physics.special-relativity.proper-acceleration"}$\alpha$运动，这种运动叫作:term[双曲运动]{id="physics.special-relativity.hyperbolic-motion"}（hyperbolic motion）。

::anchor{id="thm-hyperbolic-motion"}
定理（双曲运动）：取出发点为原点、出发时$t=0$，则$u=\frac{\alpha t}{\sqrt{1+\alpha^2t^2/c^2}}$，$x=\frac{c^2}{\alpha}\Bigl(\sqrt{1+\frac{\alpha^2t^2}{c^2}}-1\Bigr)$，:term[世界线]{id="physics.special-relativity.worldline"}（world line）是双曲线$\bigl(x+\frac{c^2}{\alpha}\bigr)^2-c^2t^2=\frac{c^4}{\alpha^2}$。

证明：由上一个定理，固有加速度不变就是实验室里的力$F=m\alpha$不变，$\dv{(\gamma_uu)}{t}=\alpha$，从静止出发积分得$\gamma_uu=\alpha t$。平方得$\frac{u^2}{1-u^2/c^2}=\alpha^2t^2$，解出$u$。对$t$积分，$x=\frac{c^2}{\alpha}\Bigl(\sqrt{1+\frac{\alpha^2t^2}{c^2}}-1\Bigr)$（求导可以验证它的导数是$u$）；移项平方就是那条双曲线。

::anchor{id="thm-hyperbolic-proper-time"}
定理（双曲运动的:term[固有时]{id="physics.special-relativity.proper-time"}）：取出发时$\tau=0$，船上的钟读数为$\tau$时，$ct=\frac{c^2}{\alpha}\sinh\frac{\alpha\tau}{c}$，$x=\frac{c^2}{\alpha}\bigl(\cosh\frac{\alpha\tau}{c}-1\bigr)$，$u=c\tanh\frac{\alpha\tau}{c}$，:term[快度]{id="physics.special-relativity.rapidity"}（rapidity）$\varphi=\frac{\alpha\tau}{c}$。

证明：由$\gamma_uu=\alpha t$，$\gamma_u=\sqrt{1+\gamma_u^2u^2/c^2}=\sqrt{1+\alpha^2t^2/c^2}$，所以$\dd\tau=\frac{\dd t}{\gamma_u}=\frac{\dd t}{\sqrt{1+\alpha^2t^2/c^2}}$。换元$t=\frac c\alpha\sinh s$，$\dd t=\frac c\alpha\cosh s\,\dd s$，$\sqrt{1+\sinh^2s}=\cosh s$，得$\dd\tau=\frac c\alpha\,\dd s$，即$s=\frac{\alpha\tau}c$，$ct=\frac{c^2}{\alpha}\sinh\frac{\alpha\tau}{c}$。代入$x$的式子得$x=\frac{c^2}{\alpha}\bigl(\cosh\frac{\alpha\tau}{c}-1\bigr)$；$u=\frac{\dd x/\dd\tau}{\dd t/\dd\tau}=c\tanh\frac{\alpha\tau}{c}$，所以快度是$\frac{\alpha\tau}{c}$。

快度随船上的时间均匀增长：每过一小段固有时$\dd\tau$，飞船在:term[瞬时静止系]{id="physics.special-relativity.instantaneous-rest-frame"}里获得一个小速度$\alpha\,\dd\tau$，快度增加$\frac{\alpha\,\dd\tau}{c}$，而快度是可以直接相加的。快度没有上限，速度$c\tanh\varphi$却永远小于$c$；船上的人感到的加速度始终是$\alpha$，地面却看到速度增加得越来越慢。[时空间隔与固有时](lesson:physics.special-relativity.spacetime-interval)的 p6 用的就是这里的$u(t)$。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 6], y: [0, 3.6] }
functions:
  - expr: "sqrt((x + 1/a)^2 - 1/a^2)"
    label: |
      双曲运动的世界线
  - expr: "x + 1/a"
    label: |
      渐近线（一条光线）
  - expr: "sqrt(2*x/a)"
    label: |
      牛顿力学：$x=\frac12\alpha t^2$
  - expr: "x"
    label: |
      从出发点发出的光线
points:
  - { x: "(cosh(a*s) - 1)/a", y: "sinh(a*s)/a" }
sliders:
  - name: a
    min: 0.5
    max: 3
    step: 0.05
    default: 1
    label: |
      固有加速度$\alpha$
  - name: s
    min: 0
    max: 1
    step: 0.01
    default: 1
    label: |
      船上的钟读数$\tau$
:::

图是地面参考系的:term[时空图]{id="physics.special-relativity.spacetime-diagram"}（spacetime diagram），取$c=1$，长度和时间用同一个单位，$\alpha$的单位是它的倒数。:term[双曲运动]{id="physics.special-relativity.hyperbolic-motion"}的:term[世界线]{id="physics.special-relativity.worldline"}从原点出发，越来越贴近渐近线，却永远碰不到它，速度趋于光速而达不到。渐近线是地球在$t=\frac1\alpha$时发出的光线，它跟在飞船后面，永远追不上飞船（见 p6）。

牛顿力学的抛物线在和出发点发出的光线相交以后就比光还快。标出的点是船上的钟读$\tau$时飞船所在的:term[事件]{id="physics.special-relativity.event"}（event），$\alpha$越大，同样的$\tau$走得越远。

## 例题

### 例 1　以$g$加速一年的飞船

飞船从地球出发，一直以:term[固有加速度]{id="physics.special-relativity.proper-acceleration"}$\alpha=9.8\,\mathrm{m/s^2}$直线加速，船上的钟走了$1$年。求这时飞船的速度、地球上过了多久、飞船离地球多远。取$c=3.00\times10^8\,\mathrm{m/s}$，$1$年$=3.156\times10^7\,\mathrm s$。

**为什么想到这么做**：这是:term[双曲运动]{id="physics.special-relativity.hyperbolic-motion"}，已知:term[固有时]{id="physics.special-relativity.proper-time"}，直接用固有时的那组公式；$\frac c\alpha$恰好接近一年，用年和光年作单位最方便。

**推导**：$\frac c\alpha=\frac{3.00\times10^8}{9.8}\,\mathrm s\approx3.06\times10^7\,\mathrm s\approx0.970$年，$\frac{\alpha\tau}c\approx\frac1{0.970}\approx1.031$。速度$u=c\tanh1.031\approx0.774c$；地球上过了$t=\frac c\alpha\sinh1.031\approx0.970\times1.224\approx1.19$年；距离$x=\frac{c^2}{\alpha}(\cosh1.031-1)\approx0.970\times0.580\approx0.56$光年。按牛顿力学，一年后速度是$\alpha\tau\approx1.03c$，比光还快。

### 例 2　电场中加速的电子

电子在$2\times10^6\,\mathrm{V/m}$的匀强电场里从静止开始加速，走了$1\,\mathrm m$。$m_ec^2=0.511\,\mathrm{MeV}$。求它的速率和所用的时间。

**为什么想到这么做**：电场力$eE$不变，由功率定理，走过$1\,\mathrm m$时能量增加$eE\times1\,\mathrm m$；有了能量就有速率和动量，再由动量等于力乘时间求时间。

**推导**：电场力做功$2\,\mathrm{MeV}$，$E=2.511\,\mathrm{MeV}$，$\gamma_u=\frac{2.511}{0.511}\approx4.914$，$u=c\sqrt{1-\gamma_u^{-2}}\approx0.979c$。动量$pc=\sqrt{E^2-(m_ec^2)^2}\approx2.459\,\mathrm{MeV}$，力是$2\,\mathrm{MeV/m}$，所以$t=\frac{p}{F}\approx\frac{2.459}{2}\cdot\frac{1\,\mathrm m}{c}\approx4.1\,\mathrm{ns}$。按牛顿力学$\frac12m_eu^2=2\,\mathrm{MeV}$，会得到$u\approx2.8c$。

1964 年贝尔托齐（William Bertozzi）用静电加速器和直线加速器（linear accelerator）把电子加速到$0.5$到$15\,\mathrm{MeV}$的动能，量出它们飞过约$8.4\,\mathrm m$所用的时间，再用量热的办法测出电子带来的能量：能量越来越高，速度却越来越贴近光速、不超过光速，和这一节的结果一致。

## 常见误区

- 「相对论里$\vb F=\gamma_um\vb a$。」力和加速度的关系随方向不同：沿运动方向$F=\gamma_u^3ma$，垂直于运动方向$F=\gamma_uma$（见 p5）。
- 「恒力作用下速度最终会超过光速，只是要很久。」$u=\frac{\alpha t}{\sqrt{1+\alpha^2t^2/c^2}}$对任何$t$都小于$c$。
- 「:term[固有加速度]{id="physics.special-relativity.proper-acceleration"}就是实验室里量到的加速度。」它是:term[瞬时静止系]{id="physics.special-relativity.instantaneous-rest-frame"}里的加速度，沿直线运动时实验室里的$\frac{\dd u}{\dd t}$只有它的$\frac1{\gamma_u^3}$。
- 「:term[双曲运动]{id="physics.special-relativity.hyperbolic-motion"}的飞船上，人会觉得越来越难加速。」船上的人感到的加速度始终不变，每过一段:term[固有时]{id="physics.special-relativity.proper-time"}:term[快度]{id="physics.special-relativity.rapidity"}都增加同样多，「加速变慢」只是地面参考系里的说法。
- 「:term[四维力]{id="physics.special-relativity.four-force"}的时间分量没有意义。」它是功率乘以$\frac{\gamma_u}{c}$，表示力在改变质点的能量。

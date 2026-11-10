---
id: physics.special-relativity.spacetime-diagrams
title: |
  时空图与光锥
goal: |
  会画时空图，用光锥判断两个事件能否有因果联系，并在图上画出另一个参考系的坐标轴。
prerequisites: [physics.special-relativity.lorentz-transformation]
minutes: 35
summary: |
  横轴$x$、纵轴$ct$画事件；光锥内的事件次序在各惯性系相同。
status: reviewed
---

## 这一节要回答的问题

:term[洛伦兹变换]{id="physics.special-relativity.lorentz-transformation"}（Lorentz transformation）把:term[同时的相对性]{id="physics.special-relativity.relativity-of-simultaneity"}（relativity of simultaneity）、:term[时间延缓]{id="physics.special-relativity.time-dilation"}（time dilation）、:term[长度收缩]{id="physics.special-relativity.length-contraction"}（length contraction）都装进了几行公式，可公式不容易一眼看出谁先谁后。能不能把:term[事件]{id="physics.special-relativity.event"}（event）和:term[世界线]{id="physics.special-relativity.worldline"}（world line）画在一张图上，让另一个:term[惯性系]{id="physics.special-relativity.inertial-frame"}（inertial frame）的「同时」和「同地」直接看得见？哪些事件之间可能有因果（causality）联系，图上又怎么判断？

## 讲解

### 时空图

::anchor{id="def-spacetime-diagram"}
以$x$为横轴、$ct$为纵轴，把:term[事件]{id="physics.special-relativity.event"}画成平面上的点、:term[世界线]{id="physics.special-relativity.worldline"}画成曲线，这样的图叫作:term[时空图]{id="physics.special-relativity.spacetime-diagram"}（spacetime diagram）。

为什么这样画：纵轴用$ct$而不用$t$，两个坐标的单位都是长度，光线$x=\pm ct+$常数就是$45^\circ$的斜线。比光慢的质点，速度$|u|<c$，世界线每一处都比$45^\circ$线陡；静止的质点是竖直线。边界情况：图上只画了一个空间方向，$y$、$z$方向的运动要画成三维图，或者干脆只讨论沿$x$轴的运动。

### 另一个惯性系的坐标轴

在$S$的:term[时空图]{id="physics.special-relativity.spacetime-diagram"}上画处于:term[标准位形]{id="physics.special-relativity.standard-configuration"}（standard configuration）的$S'$的坐标轴：$ct'$轴是$x'=0$的:term[事件]{id="physics.special-relativity.event"}，即$S'$原点的:term[世界线]{id="physics.special-relativity.worldline"}$x=\beta ct$；$x'$轴是$t'=0$的事件，由$t'=\gamma\bigl(t-\frac{vx}{c^2}\bigr)=0$得$ct=\beta x$。两条轴都过原点，$ct'$轴和$ct$轴、$x'$轴和$x$轴各夹一个角$\theta$，$\tan\theta=\beta$，两条带撇的轴关于光线$x=ct$对称，像剪刀一样向光线合拢。

::anchor{id="thm-oblique-coordinates"}
定理（读出带撇的坐标）：在$S$的时空图上，$x'$为常数的事件组成平行于$ct'$轴的直线，$t'$为常数的事件组成平行于$x'$轴的直线；$ct'=1$、$x'=0$的事件在双曲线$c^2t^2-x^2=1$上，$x'=1$、$t'=0$的事件在双曲线$x^2-c^2t^2=1$上。

证明：$x'=\gamma(x-\beta ct)$为常数，即$x-\beta ct$为常数，这些直线和$x-\beta ct=0$（$ct'$轴）平行；$ct'=\gamma(ct-\beta x)$为常数同理，平行于$ct-\beta x=0$（$x'$轴）。由逆变换，$ct'=1$、$x'=0$的事件在$S$里是$(ct,x)=(\gamma,\gamma\beta)$，$\gamma^2-\gamma^2\beta^2=1$；$x'=1$、$t'=0$的事件是$(ct,x)=(\gamma\beta,\gamma)$，$\gamma^2-\gamma^2\beta^2=1$。

所以要读一个事件在$S'$里的坐标，就过这个点作带撇的两条轴的平行线，像斜坐标系（oblique coordinate system）那样读数；刻度要用双曲线定，带撇的轴上的单位在纸面上看起来比不带撇的长。

::anchor{id="def-line-of-simultaneity"}
在$S$的时空图上，$t'$为常数的事件组成的直线叫作$S'$的同时线（line of simultaneity），它们都平行于$x'$轴。

同时线是斜的：$S$里同时（水平线上）的事件，在$S'$里不同时，这正是:term[同时的相对性]{id="physics.special-relativity.relativity-of-simultaneity"}在图上的样子。

### 光锥与因果

::anchor{id="def-light-cone"}
经过:term[事件]{id="physics.special-relativity.event"} O 的所有光线组成的集合，叫作 O 的:term[光锥]{id="physics.special-relativity.light-cone"}（light cone）；只画一个空间方向时，它是过 O 的两条$45^\circ$线，画两个空间方向时是一个圆锥面。

为什么这样定义：光锥把时空分成三部分：锥内$t>t_O$的部分（未来）、锥内$t<t_O$的部分（过去）、锥外。从 O 出发、不超过光速的信号只能到达未来部分及锥面上的事件，能影响 O 的事件只在过去部分及锥面上。由:term[洛伦兹变换]{id="physics.special-relativity.lorentz-transformation"}下光速不变，光锥在每个:term[惯性系]{id="physics.special-relativity.inertial-frame"}里都是同一个集合，这个划分和惯性系无关。边界情况：锥面上的事件只能用光（或别的以光速传播的信号）和 O 联系。

::anchor{id="thm-causal-order"}
定理（因果次序不变）：设事件 P 在 O 的光锥内或锥面上，并且$t_P>t_O$，那么在每个惯性系里 P 都在 O 之后。如果 P 在 O 的光锥外，那么有的惯性系里 P 在 O 之后，有的惯性系里在 O 之前，还有一个惯性系里两者同时。

证明：记$\Delta t=t_P-t_O$，$\Delta\vb r$为空间位移。任何惯性系都可以由$S$经空间转动、沿$x$轴的洛伦兹变换、再一次空间转动和平移得到，转动和平移不改变$\Delta t$，只需看沿$x$轴的变换：$\Delta t'=\gamma\bigl(\Delta t-\frac{v\Delta x}{c^2}\bigr)$。P 在锥内或锥面上时$c\Delta t\ge|\Delta\vb r|\ge|\Delta x|$，又$|v|<c$，所以$\bigl|\frac{v\Delta x}{c^2}\bigr|<\frac{|\Delta x|}{c}\le\Delta t$（$\Delta x=0$时左边为零），$\Delta t'>0$。

P 在锥外时，先转动坐标轴让$\Delta\vb r$沿$x$轴，于是$c|\Delta t|<|\Delta x|$。$\Delta t'$随$v$连续变化，取$v=\frac{c^2\Delta t}{\Delta x}$（它的绝对值小于$c$）得$\Delta t'=0$；$v$从这个值往两边稍稍变动，$\Delta t-\frac{v\Delta x}{c^2}$的符号相反，所以$\Delta t'$可正可负。

这个定理保证了因果不会颠倒：一个事件要影响另一个，中间得有不超过光速的信号，后者就在前者的未来光锥里，所有惯性系都同意先后。锥外的两个事件先后可以颠倒，但它们之间本来就不可能有因果联系。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-3, 4.5], y: [-1.5, 3] }
functions:
  - expr: "x"
    label: |
      光线$x=ct$
  - expr: "x/u"
    label: |
      $ct'$轴
  - expr: "u*x"
    label: |
      $x'$轴
  - expr: "sqrt(1 + x^2)"
    label: |
      双曲线$c^2t^2-x^2=1$
  - expr: "u*x + sqrt(1 - u^2)"
    label: |
      同时线$ct'=1$
points:
  - { x: "u/sqrt(1 - u^2)", y: "1/sqrt(1 - u^2)" }
sliders:
  - name: u
    min: 0.05
    max: 0.8
    step: 0.01
    default: 0.3
    label: |
      $S'$的速度$\beta=v/c$
:::

图是$S$的:term[时空图]{id="physics.special-relativity.spacetime-diagram"}，横轴$x$、纵轴$ct$。拖动滑块，$S'$的两条坐标轴像剪刀一样向光线合拢，光线始终在两轴正中间。标出的点是$S'$里$ct'=1$、$x'=0$的:term[事件]{id="physics.special-relativity.event"}，它总在双曲线上，比$S$里$ct=1$的点高：从$S$看，$S'$的钟走得慢。经过这个点的斜线是$S'$的同时线$ct'=1$，它和双曲线在这个点相切（见 p5）。

## 例题

### 例 1　在图上读出同时的相对性

在$S$里，:term[事件]{id="physics.special-relativity.event"} A 在原点，事件 B 在$x=2$、$ct=0$（单位任取，长度单位相同）。$S'$以$\beta=0.5$运动。在:term[时空图]{id="physics.special-relativity.spacetime-diagram"}上判断两事件在$S'$里谁先，并算出 B 的$ct'$。

**为什么想到这么做**：$S'$的同时线平行于$x'$轴$ct=\beta x$。看 B 在过 A 的那条同时线的上方还是下方，就知道 B 在$S'$里比 A 晚还是早。

**推导**：过 A 的$S'$同时线就是$x'$轴$ct=0.5x$，在$x=2$处高度为$1$；B 的$ct=0$在它下方，所以在$S'$里 B 比 A 早。计算：$\gamma=\frac{1}{\sqrt{0.75}}\approx1.155$，$ct'_B=\gamma(0-0.5\times2)\approx-1.155$。图和公式一致：$S$里同时，$S'$里沿运动方向在前面的 B 先发生。

### 例 2　用光锥判断因果联系

以:term[事件]{id="physics.special-relativity.event"} O 为原点，事件 P 在$x=3$、$ct=2$（单位：光年），事件 Q 在$x=1$、$ct=2$。O 能不能影响 P、影响 Q？如果不能，找一个让它和 O 同时发生的:term[惯性系]{id="physics.special-relativity.inertial-frame"}。

**为什么想到这么做**：看事件在不在 O 的未来:term[光锥]{id="physics.special-relativity.light-cone"}里：$c\Delta t\ge|\Delta x|$且$\Delta t>0$。在锥外的，用因果次序定理证明里的$v=\frac{c^2\Delta t}{\Delta x}$。

**推导**：Q：$ct=2\ge|x|=1$，在未来光锥内，O 可以影响 Q，例如派出速度为$0.5c$的飞船。P：$ct=2<|x|=3$，在锥外，O 发出的任何信号都赶不到 P，它们没有因果联系。取$v=\frac{2}{3}c$，$ct'_P=\gamma\bigl(2-\frac23\times3\bigr)=0$，在这个惯性系里 O、P 同时发生；速度再大一些的惯性系里，P 甚至在 O 之前。

## 常见误区

- 「$S'$的坐标轴应该和$S$的一样互相垂直。」在$S$的:term[时空图]{id="physics.special-relativity.spacetime-diagram"}上，$ct'$轴和$x'$轴都向光线倾斜，彼此不垂直；纸面上的角度和长度不代表时空里的关系，要按:term[洛伦兹变换]{id="physics.special-relativity.lorentz-transformation"}读。
- 「时空图上两点之间的纸面距离越长，:term[固有时]{id="physics.special-relativity.proper-time"}（proper time）越长。」纸面上是欧几里得距离（Euclidean distance），时空里要用$c^2\Delta t^2-\Delta x^2$；光线在纸上有长度，它上面两点的间隔却是零。
- 「:term[光锥]{id="physics.special-relativity.light-cone"}外的:term[事件]{id="physics.special-relativity.event"}，等一会儿也能影响 O。」光锥外的事件和 O 之间，任何不超过光速的信号都来不及；「等一会儿」得到的是另一个事件，它可能在锥内。
- 「先后次序会颠倒，所以因果关系也会颠倒。」只有锥外的两个事件先后可以颠倒，而它们之间本来没有因果联系。

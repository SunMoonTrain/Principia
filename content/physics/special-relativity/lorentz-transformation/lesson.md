---
id: physics.special-relativity.lorentz-transformation
title: |
  洛伦兹变换
goal: |
  会由两条基本假设推出洛伦兹变换，并用它在两个参考系之间换算事件的坐标。
prerequisites: [physics.special-relativity.length-contraction, math.linear-algebra.determinant, math.linear-algebra.matrix-inverse]
minutes: 35
summary: |
  $t'=\gamma(t-vx/c^2)$，$x'=\gamma(x-vt)$：一组公式换算同一个事件的坐标。
status: reviewed
---

## 这一节要回答的问题

前面几节分别得到了:term[同时的相对性]{id="physics.special-relativity.relativity-of-simultaneity"}（relativity of simultaneity）、:term[时间延缓]{id="physics.special-relativity.time-dilation"}（time dilation）和:term[长度收缩]{id="physics.special-relativity.length-contraction"}（length contraction），每次都要专门设计一个思想实验（thought experiment）。能不能有一组公式，直接给出同一个:term[事件]{id="physics.special-relativity.event"}（event）在两个:term[惯性系]{id="physics.special-relativity.inertial-frame"}（inertial frame）里的坐标之间的关系，把这些效应一次全包含进去？牛顿力学里这组公式是伽利略变换（Galilean transformation），相对论里要换成什么？

## 讲解

### 推导

设:term[惯性系]{id="physics.special-relativity.inertial-frame"}$S$和$S'$处于:term[标准位形]{id="physics.special-relativity.standard-configuration"}（standard configuration），一个:term[事件]{id="physics.special-relativity.event"}（event）$E$在$S$里的坐标是$(t,x,y,z)$，在$S'$里是$(t',x',y',z')$。横向长度不变（见[时间延缓](lesson:physics.special-relativity.time-dilation)），所以$y'=y$、$z'=z$，要找的是$t'$、$x'$和$t$、$x$的关系。

::anchor{id="thm-lorentz"}
定理（:term[洛伦兹变换]{id="physics.special-relativity.lorentz-transformation"}，Lorentz transformation）：标准位形下，同一个事件在两个惯性系里的坐标满足$t'=\gamma\bigl(t-\frac{vx}{c^2}\bigr)$，$x'=\gamma(x-vt)$，$y'=y$，$z'=z$，其中$\gamma=\frac{1}{\sqrt{1-v^2/c^2}}$。

证明：先求$x'$。在$S$里事件$E$发生的时刻$t$，$S'$的原点位于$x=vt$。$S'$的原点和$E$发生的地点（$S'$里坐标为$x'$的固定点）之间，是一段在$S'$里静止、:term[固有长度]{id="physics.special-relativity.proper-length"}（proper length）为$|x'|$的线段；在$S$里，它的两端在同一时刻$t$分别位于$vt$和$x$，所以它在$S$里长$|x-vt|$。由:term[长度收缩]{id="physics.special-relativity.length-contraction"}（length contraction）$|x-vt|=\frac{|x'|}{\gamma}$，两点的前后次序在两个惯性系里一样，$x-vt$和$x'$同号，于是$x'=\gamma(x-vt)$。

再从$S'$看：$S$的原点以速度$-v$运动，$S'$的时刻$t'$它位于$x'=-vt'$；$S$的原点和$E$的地点之间是一段在$S$里静止、固有长度为$|x|$的线段，同样的论证（按:term[相对性原理]{id="physics.special-relativity.principle-of-relativity"}（principle of relativity），$S'$里的长度收缩公式相同）给出$x=\gamma(x'+vt')$。设$v\ne0$（$v=0$时两个惯性系重合），把$x'=\gamma(x-vt)$代入，解出$t'=\frac{x}{\gamma v}-\frac{x'}{v}=\frac{x}{\gamma v}-\frac{\gamma(x-vt)}{v}=\gamma t+\frac{x}{v}\Bigl(\frac1\gamma-\gamma\Bigr)$。由$\gamma^2-1=\gamma^2\frac{v^2}{c^2}$，$\frac1\gamma-\gamma=-\gamma\frac{v^2}{c^2}$，所以$t'=\gamma\bigl(t-\frac{vx}{c^2}\bigr)$。

检验光速不变：$S$里沿$x$轴的光满足$x=ct$，代入得$x'=\gamma(c-v)t$，$t'=\gamma\bigl(1-\frac vc\bigr)t$，两者之比正是$c$，$S'$里光速仍是$c$。把$v$换成$-v$、带撇和不带撇的量对调，就得到逆变换$t=\gamma\bigl(t'+\frac{vx'}{c^2}\bigr)$、$x=\gamma(x'+vt')$，这正是相对性原理要求的：两个惯性系的地位对称。

### 矩阵形式

用$ct$代替$t$作时间坐标，两个坐标的单位都是长度，记$\beta=\frac vc$，变换写成

$$
\begin{pmatrix}ct'\\x'\end{pmatrix}=\begin{pmatrix}\gamma&-\gamma\beta\\-\gamma\beta&\gamma\end{pmatrix}\begin{pmatrix}ct\\x\end{pmatrix} .
$$

这是一个线性变换（linear transformation），矩阵记作$\Lambda(\beta)$，它的行列式（determinant）$\gamma^2-\gamma^2\beta^2=1$。逆矩阵（inverse matrix）是$\Lambda(-\beta)$，直接相乘可以验证$\Lambda(\beta)\Lambda(-\beta)$是单位矩阵（identity matrix），和逆变换把$v$换成$-v$一致。以后都用$(ct,x,y,z)$作:term[事件]{id="physics.special-relativity.event"}的坐标，后面讲四维矢量（four-vector）时，$ct$就是第$0$个分量。

### 低速时回到伽利略变换

$|v|\ll c$时$\gamma\approx1$，$x'\approx x-vt$。$t'$里多出的$\frac{vx}{c^2}$能不能略去，要看它和$t$比：日常的速度、距离下，它小得测不出来，$v=300\,\mathrm{m/s}$、$x=1000\,\mathrm{km}$时只有约$3\times10^{-9}\,\mathrm s$。所以伽利略变换是:term[洛伦兹变换]{id="physics.special-relativity.lorentz-transformation"}在$|v|\ll c$、距离又不太大时的近似，牛顿力学在这个范围里继续有效。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-0.95, 0.95], y: [-6, 9] }
functions:
  - expr: "(a - b*x)/sqrt(1 - x^2)"
    label: |
      $ct'$
  - expr: "(b - a*x)/sqrt(1 - x^2)"
    label: |
      $x'$
  - expr: "b - a*x"
    label: |
      伽利略变换的$x'$
sliders:
  - name: a
    min: 0
    max: 4
    step: 0.1
    default: 2.5
    label: |
      事件在$S$里的$ct$
  - name: b
    min: -3
    max: 3
    step: 0.1
    default: 1.2
    label: |
      事件在$S$里的$x$
:::

两个滑块定下$S$里的一个:term[事件]{id="physics.special-relativity.event"}，横轴是$S'$的速度$\beta=\frac vc$，三条曲线是这个事件在$S'$里的坐标。$\beta$越接近$\pm1$，:term[洛伦兹变换]{id="physics.special-relativity.lorentz-transformation"}的结果和伽利略变换差得越远；$|\beta|$小时，$x'$的曲线贴着伽利略变换的直线。事件在$S$里$|x|<ct$时，$x'$的曲线和横轴相交：有一个:term[惯性系]{id="physics.special-relativity.inertial-frame"}里事件就发生在原点处，而这时$ct'$的曲线正好取最小值，它的意义见[时空间隔与固有时](lesson:physics.special-relativity.spacetime-interval)。

## 例题

### 例 1　从一组公式得到三个效应

用:term[洛伦兹变换]{id="physics.special-relativity.lorentz-transformation"}重新推出:term[同时的相对性]{id="physics.special-relativity.relativity-of-simultaneity"}、:term[时间延缓]{id="physics.special-relativity.time-dilation"}和:term[长度收缩]{id="physics.special-relativity.length-contraction"}。

**为什么想到这么做**：三个效应说的都是两个:term[事件]{id="physics.special-relativity.event"}之间的坐标差。洛伦兹变换是线性的，坐标差满足同样的公式：$\Delta t'=\gamma\bigl(\Delta t-\frac{v\Delta x}{c^2}\bigr)$，$\Delta x'=\gamma(\Delta x-v\Delta t)$，只要在合适的:term[惯性系]{id="physics.special-relativity.inertial-frame"}里令某个差为零。

**推导**：同时的相对性：两个事件在$S$里同时、沿$x$轴分开，$\Delta t=0$、$\Delta x\ne0$，则$\Delta t'=-\frac{\gamma v\Delta x}{c^2}\ne0$。时间延缓：两个事件在$S'$里同地，$\Delta x'=0$，由逆变换$\Delta t=\gamma\bigl(\Delta t'+\frac{v\Delta x'}{c^2}\bigr)=\gamma\Delta t'$。长度收缩：杆在$S'$里静止、长$L$，在$S$里同时记两端，$\Delta t=0$，于是$\Delta x'=\gamma\Delta x$，即$\Delta x=\frac{L}{\gamma}$。

### 例 2　换算两个事件

在$S$里，:term[事件]{id="physics.special-relativity.event"} A 发生在原点、$t=0$，事件 B 发生在$t=2\,\mathrm s$、$x=1$光秒（光在$1\,\mathrm s$里走的距离）。$S'$以$0.6c$处于:term[标准位形]{id="physics.special-relativity.standard-configuration"}。求两个事件在$S'$里的坐标，B 在 A 之后吗？

**为什么想到这么做**：直接代公式。时间用秒、距离用光秒时$c=1$，公式化成$t'=\gamma(t-\beta x)$、$x'=\gamma(x-\beta t)$，最省事。

**推导**：$\gamma=\frac{1}{0.8}=1.25$。A 在$S'$里仍是$(0,0)$。B：$t'=1.25\times(2-0.6\times1)=1.75\,\mathrm s$，$x'=1.25\times(1-0.6\times2)=-0.25$光秒。

在$S'$里 B 仍在 A 之后$1.75\,\mathrm s$，地点在$S'$原点后方$0.25$光秒。两个:term[惯性系]{id="physics.special-relativity.inertial-frame"}对时间间隔、距离的说法都不同，但都同意 B 在 A 之后；先后次序会不会颠倒，见[时空图与光锥](lesson:physics.special-relativity.spacetime-diagrams)。

## 常见误区

- 「$t'$只依赖$t$。」$t'=\gamma\bigl(t-\frac{vx}{c^2}\bigr)$还依赖:term[事件]{id="physics.special-relativity.event"}的位置$x$，这一项正是:term[同时的相对性]{id="physics.special-relativity.relativity-of-simultaneity"}。
- 「:term[洛伦兹变换]{id="physics.special-relativity.lorentz-transformation"}只是数学上换个坐标，不对应可测量的东西。」$(t,x)$是$S$里:term[同步]{id="physics.special-relativity.synchronization"}（synchronized）的钟和静止的尺子记下的读数，$(t',x')$是$S'$里的；洛伦兹变换说的是两套实际读数之间的关系。
- 「把$x'=\gamma(x-vt)$对$t$求导，就得到速度在$S'$里的值。」速度是$\frac{\dd x'}{\dd t'}$，$t'$也随$t$和$x$变化，要连同$t'$一起变换，见[速度变换](lesson:physics.special-relativity.velocity-transformation)。
- 「$v$可以等于$c$，那就是光的参考系（frame of reference）。」$v=c$时$\gamma$没有定义，洛伦兹变换不存在；没有一个:term[惯性系]{id="physics.special-relativity.inertial-frame"}相对另一个以光速运动。

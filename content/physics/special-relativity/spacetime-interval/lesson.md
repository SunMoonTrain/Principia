---
id: physics.special-relativity.spacetime-interval
title: |
  时空间隔与固有时
goal: |
  会计算时空间隔，判断它是类时、类空还是类光的，并求固有时。
prerequisites: [physics.special-relativity.lorentz-transformation, math.calculus.fundamental-theorem]
minutes: 35
summary: |
  $c^2\Delta t^2-\Delta x^2-\Delta y^2-\Delta z^2$在所有惯性系里相同。
status: reviewed
---

## 这一节要回答的问题

两个:term[惯性系]{id="physics.special-relativity.inertial-frame"}（inertial frame）对两个:term[事件]{id="physics.special-relativity.event"}（event）相隔多久、相距多远各执一词。平面上转动坐标轴，点的坐标变了，两点之间的距离$\sqrt{\Delta x^2+\Delta y^2}$不变。:term[洛伦兹变换]{id="physics.special-relativity.lorentz-transformation"}（Lorentz transformation）下，有没有一个由坐标差组成、所有惯性系都同意的量？

## 讲解

### 时空间隔

::anchor{id="def-interval"}
两个:term[事件]{id="physics.special-relativity.event"}的坐标差组成的$\Delta s^2=c^2\Delta t^2-\Delta x^2-\Delta y^2-\Delta z^2$，叫作这两个事件之间的:term[时空间隔]{id="physics.special-relativity.spacetime-interval"}（spacetime interval）；这里$\Delta t^2$指$(\Delta t)^2$，其余同理。

为什么这样定义：下面的定理说明它和:term[惯性系]{id="physics.special-relativity.inertial-frame"}无关，地位相当于平面上的距离平方。符号这样取，是为了让同一只钟先后两次读数之间的间隔是正的，正好等于$c^2$乘以钟走过的时间的平方。边界情况：$\Delta s^2$可以是负数，也可以是零，它不一定是某个实数的平方，$\Delta s^2$只是一个记号；有的书把整体取负号，物理内容一样。

::anchor{id="thm-interval-invariance"}
定理（间隔不变）：同一对事件之间的时空间隔，在所有:term[惯性系]{id="physics.special-relativity.inertial-frame"}（inertial frame）里都相同。

证明：先看:term[标准位形]{id="physics.special-relativity.standard-configuration"}（standard configuration）。坐标差满足$c\Delta t'=\gamma(c\Delta t-\beta\Delta x)$，$\Delta x'=\gamma(\Delta x-\beta c\Delta t)$，$\Delta y'=\Delta y$，$\Delta z'=\Delta z$，于是

$$
\begin{aligned}
c^2\Delta t'^2-\Delta x'^2&=\gamma^2\bigl[(c\Delta t-\beta\Delta x)^2-(\Delta x-\beta c\Delta t)^2\bigr]\\
&=\gamma^2(1-\beta^2)(c^2\Delta t^2-\Delta x^2)=c^2\Delta t^2-\Delta x^2 .
\end{aligned}
$$

再减去不变的$\Delta y^2+\Delta z^2$，得$\Delta s'^2=\Delta s^2$。任意两个惯性系，转动坐标轴、平移原点和计时零点以后都能摆成标准位形；平移不改变坐标差，空间转动不改变$\Delta t$和$\Delta x^2+\Delta y^2+\Delta z^2$，所以每一步都保持$\Delta s^2$，定理对任意两个惯性系成立。

:term[光速不变原理]{id="physics.special-relativity.light-postulate"}（constancy of the speed of light）正是这个定理的一个特例：一束光经过的两个事件满足$\Delta s^2=0$，在任何惯性系里仍为零，即光速仍是$c$。

### 类时、类空、类光

::anchor{id="def-interval-types"}
$\Delta s^2>0$的间隔叫作:term[类时]{id="physics.special-relativity.timelike"}（timelike）的，$\Delta s^2<0$的叫作:term[类空]{id="physics.special-relativity.spacelike"}（spacelike）的，$\Delta s^2=0$的叫作:term[类光]{id="physics.special-relativity.lightlike"}（lightlike）的。

为什么这样分类：间隔不变，所以这个分类和:term[惯性系]{id="physics.special-relativity.inertial-frame"}无关。类光就是两个:term[事件]{id="physics.special-relativity.event"}正好能用一束光连起来；类时是两个事件的距离比光在这段时间里走的路短，比光慢的信号能把它们连起来；类空是连光都来不及。边界情况：一个事件和它自己的间隔是$0$，按定义算类光，这种平凡的情形下面不讨论。

::anchor{id="thm-interval-classification"}
定理（同地与同时）：两个不同的事件，间隔是类时的，当且仅当存在一个惯性系，在其中它们发生在同一地点；间隔是类空的，当且仅当存在一个惯性系，在其中它们同时发生。

证明：转动$S$的坐标轴，让两个事件的空间位移沿$x$轴，$\Delta y=\Delta z=0$。取$S'$相对$S$沿$x$轴以$v$运动：$\Delta x'=\gamma(\Delta x-v\Delta t)=0$等价于$v=\frac{\Delta x}{\Delta t}$，这样的惯性系存在（$|v|<c$）当且仅当$|\Delta x|<c|\Delta t|$，即$\Delta s^2>0$。同理，$\Delta t'=\gamma\bigl(\Delta t-\frac{v\Delta x}{c^2}\bigr)=0$等价于$v=\frac{c^2\Delta t}{\Delta x}$，$|v|<c$当且仅当$c|\Delta t|<|\Delta x|$，即$\Delta s^2<0$。反过来，如果某个惯性系里两事件同地，那里$\Delta s^2=c^2\Delta t'^2>0$（两事件不同，所以$\Delta t'\ne0$）；如果某个惯性系里两事件同时，那里$\Delta s^2=-(\Delta x'^2+\Delta y'^2+\Delta z'^2)<0$；由间隔不变，原来的惯性系里$\Delta s^2$也分别为正、为负。

### 固有时

:term[类时]{id="physics.special-relativity.timelike"}间隔的两个:term[事件]{id="physics.special-relativity.event"}，在它们同地的那个:term[惯性系]{id="physics.special-relativity.inertial-frame"}里，$\Delta s^2=c^2\Delta t'^2$，而$\Delta t'$正是两个事件之间的:term[固有时]{id="physics.special-relativity.proper-time"}（proper time）$\Delta\tau$。由间隔不变，在任何惯性系里都可以直接算：$\Delta\tau=\frac{\sqrt{\Delta s^2}}{c}=\sqrt{\Delta t^2-\frac{\Delta x^2+\Delta y^2+\Delta z^2}{c^2}}$。钟以速度$u$匀速运动时，$\Delta x^2+\Delta y^2+\Delta z^2=u^2\Delta t^2$，得$\Delta\tau=\Delta t\sqrt{1-\frac{u^2}{c^2}}$，和[时间延缓](lesson:physics.special-relativity.time-dilation)一致。

钟的速度在变化时，把它的:term[世界线]{id="physics.special-relativity.worldline"}（world line）分成许多小段，每一小段里近似匀速，钟走的时间是$\sqrt{1-\frac{u^2}{c^2}}\,\dd t$，加起来：

::anchor{id="def-proper-time-worldline"}
质点在惯性系里以速度$\vb u(t)$运动，从$t_1$到$t_2$，它的世界线上的固有时规定为$\tau=\int_{t_1}^{t_2}\sqrt{1-\frac{u(t)^2}{c^2}}\,\dd t$，$u=|\vb u|$。

为什么这样规定：每一小段近似匀速，就按匀速时的公式算，这里默认了钟的快慢和加速度无关。边界情况：每一小段的固有时都和惯性系无关，所以积分也和惯性系无关，换一个惯性系算，结果相同。

::anchor{id="def-clock-hypothesis"}
假定一只理想的钟走得多快只取决于它此刻的速度、和加速度无关，这个假定叫作时钟假设（clock hypothesis）。

时钟假设在很高的精度上成立：欧洲核子研究中心（CERN）的储存环（storage ring）里，缪子（muon）以约$10^{18}$倍重力加速度做圆周运动，寿命仍正好延长$\gamma$倍（例 2）。

::anchor{id="thm-max-proper-time"}
定理（直线的固有时最长）：设两个事件的间隔是类时的。在连接它们的所有世界线中（速度处处小于$c$），匀速直线运动的那条固有时最长，等于$\frac{\sqrt{\Delta s^2}}{c}$。

证明：在两个事件同地的惯性系里计算，设两个事件分别发生在$t_1$、$t_2$，那里的匀速直线世界线就是静止不动，固有时$t_2-t_1$。任何其他连接它们的世界线，$\tau=\int_{t_1}^{t_2}\sqrt{1-\frac{u^2}{c^2}}\,\dd t\le\int_{t_1}^{t_2}\dd t=t_2-t_1$，等号只在$u\equiv0$时成立。固有时和惯性系无关，所以这个结论在任何惯性系里都对；它就是双生子佯谬（twin paradox）的答案，见[双生子佯谬与其他佯谬](lesson:physics.special-relativity.twin-paradox)。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-5.8, 5.9], y: [-2.5, 4.5] }
functions:
  - expr: "x"
    label: |
      光线$x=ct$
  - expr: "-x"
    label: |
      光线$x=-ct$
  - expr: "sqrt(x^2 + 4)"
    label: |
      $c^2t^2-x^2=4$
  - expr: "sqrt(x^2 - 4)"
    label: |
      $c^2t^2-x^2=-4$
  - expr: "-sqrt(x^2 - 4)"
    label: |
      $c^2t^2-x^2=-4$（下半支）
points:
  - { x: "(1.5 - u*2.5)/sqrt(1 - u^2)", y: "(2.5 - u*1.5)/sqrt(1 - u^2)" }
  - { x: "(2.5 - u*1.5)/sqrt(1 - u^2)", y: "(1.5 - u*2.5)/sqrt(1 - u^2)" }
sliders:
  - name: u
    min: -0.5
    max: 0.9
    step: 0.01
    default: 0
    label: |
      观察者惯性系的速度$v/c$
:::

横轴是$x$，纵轴是$ct$，原点是一个:term[事件]{id="physics.special-relativity.event"}。两个点是另外两个事件在速度为$v$的:term[惯性系]{id="physics.special-relativity.inertial-frame"}里的坐标：$v=0$时一个在$(x,ct)=(1.5,2.5)$，和原点的间隔是:term[类时]{id="physics.special-relativity.timelike"}的；另一个在$(2.5,1.5)$，是:term[类空]{id="physics.special-relativity.spacelike"}的。拖动滑块换惯性系，坐标跟着变，可两个点始终各自留在一条双曲线上：间隔不变。类时的点总在光线上方，有一个惯性系它正好落在纵轴上（同地）；类空的点总在光线下方，有一个惯性系它落在横轴上（同时）。

## 例题

### 例 1　判断间隔并求固有时

在$S$里，:term[事件]{id="physics.special-relativity.event"} A 在原点、$t=0$；事件 B 在$t=5\,\mathrm s$、$x=3$光秒处。判断 AB 的间隔类型；如果是:term[类时]{id="physics.special-relativity.timelike"}的，求两事件之间的:term[固有时]{id="physics.special-relativity.proper-time"}，以及让它们同地的:term[惯性系]{id="physics.special-relativity.inertial-frame"}的速度。

**为什么想到这么做**：用秒和光秒作单位时$c=1$，$\Delta s^2=\Delta t^2-\Delta x^2$，直接计算；再用同地与同时定理的证明里的$v=\frac{\Delta x}{\Delta t}$。

**推导**：$\Delta s^2=5^2-3^2=16$（光秒$^2$），是类时的。固有时$\Delta\tau=\sqrt{16}=4\,\mathrm s$。让它们同地的惯性系速度$v=\frac{3}{5}c=0.6c$，验证：$\gamma=1.25$，$\Delta t'=1.25\times(5-0.6\times3)=4\,\mathrm s$，和固有时一致。

### 例 2　储存环里的缪子

1977 年 CERN 的储存环里，缪子以$\gamma=29.33$的速率沿圆周运动，静止时的平均寿命（mean lifetime）是$2.197\,\mu\mathrm s$。按:term[固有时]{id="physics.special-relativity.proper-time"}的定义，实验室里测到的平均寿命应是多少？缪子做圆周运动，这会不会影响结论？

**为什么想到这么做**：缪子衰变是它自身的「钟」走完一段固有时。圆周运动时速率不变，被积函数$\sqrt{1-\frac{u^2}{c^2}}=\frac1\gamma$是常数。

**推导**：固有时$\tau=\int_0^T\frac{\dd t}{\gamma}=\frac{T}{\gamma}$，所以实验室里平均寿命$T=\gamma\tau=29.33\times2.197\,\mu\mathrm s\approx64.4\,\mu\mathrm s$，和实测一致。速度方向一直在变，加速度极大，结论却只用到速率：这正是时钟假设的检验，实测和预言相差不到千分之一。

## 常见误区

- 「:term[时空间隔]{id="physics.special-relativity.spacetime-interval"}总是正的。」:term[类空]{id="physics.special-relativity.spacelike"}的间隔是负的，:term[类光]{id="physics.special-relativity.lightlike"}的是零；$\Delta s^2$只是一个记号。
- 「时空间隔就是两个:term[事件]{id="physics.special-relativity.event"}的空间距离。」它把时间差和空间差合在一起，只有它是各:term[惯性系]{id="physics.special-relativity.inertial-frame"}都同意的；距离、时间差各自都随惯性系变。
- 「两个事件之间的:term[固有时]{id="physics.special-relativity.proper-time"}是确定的，和怎么走无关。」固有时是沿:term[世界线]{id="physics.special-relativity.worldline"}算的，走法不同结果不同；$\frac{\sqrt{\Delta s^2}}{c}$只是匀速直线那条的固有时，也是最长的。
- 「类空间隔的两个事件，换个惯性系就能用信号联系起来。」类型和惯性系无关，类空的两个事件在任何惯性系里都来不及用光联系。

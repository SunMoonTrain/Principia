---
id: physics.newtonian-mechanics.kinematics-1d
title: |
  直线运动
goal: |
  会用导数由位置求速度和加速度，并用积分由加速度和初始条件求出运动。
prerequisites: [math.calculus.antiderivatives, math.calculus.higher-derivatives]
minutes: 28
summary: |
  速度是位置对时间的导数，加速度是速度的导数；反过来求原函数。
status: reviewed
---

## 这一节要回答的问题

汽车的速度表每一刻都有读数，可平常说的「路程除以时间」放在一个时刻上说不通：一瞬间车并没有走出一段路。某一时刻的:term[速度]{id="physics.newtonian-mechanics.velocity"}（velocity）到底是什么？反过来，只知道每一刻的:term[加速度]{id="physics.newtonian-mechanics.acceleration"}（acceleration）和出发时的情况，能算出车在任何时刻的位置吗？

## 讲解

### 位移和速度

一辆车沿笔直的路行驶，大小可以不计，看成质点。在路上取一点作原点、取一个方向为正，车的位置就是一个坐标$x$，它随时间变化，是时间的函数$x(t)$。

::anchor{id="def-displacement"}
从时刻$t_1$到$t_2$，质点位置的改变$\Delta x=x(t_2)-x(t_1)$叫作这段时间里的:term[位移]{id="physics.newtonian-mechanics.displacement"}（displacement）。

为什么这样定义：只比较起点和终点，位移的正负就说明质点往哪边移动了。边界情况：车开出去又开回原处，位移是零，走过的路程却不是零；只有一路不掉头时，路程才等于位移的大小。

::anchor{id="def-velocity"}
位移和所用时间之比$\frac{\Delta x}{\Delta t}$叫作这段时间里的平均速度（average velocity）；让$\Delta t\to0$，它的极限$v(t)=\lim_{\Delta t\to0}\frac{x(t+\Delta t)-x(t)}{\Delta t}=\dv xt$叫作$t$时刻的瞬时速度（instantaneous velocity），简称:term[速度]{id="physics.newtonian-mechanics.velocity"}（velocity）。

为什么这样定义：时间段越短，平均速度越能代表那一刻运动的快慢，取极限就是导数（derivative），这正回答了开头的问题。速度的正负表示方向，绝对值表示快慢，速度表显示的是绝对值。边界情况：质点掉头的那一刻速度为零，可它并没有停住，下一刻就往回走了。

### 加速度

::anchor{id="def-acceleration"}
:term[速度]{id="physics.newtonian-mechanics.velocity"}对时间的导数$a(t)=\dv vt=\frac{\dd^2x}{\dd t^2}$（也就是位置对时间的二阶导数，second derivative）叫作:term[加速度]{id="physics.newtonian-mechanics.acceleration"}（acceleration）。

为什么这样定义：起步、刹车时速度在变，加速度说的是速度变得多快，单位$\mathrm{m/s^2}$就是「每秒速度改变多少$\mathrm{m/s}$」。它的正负表示方向，不表示「加速」还是「减速」：$a$和$v$同号时速度的绝对值增大，异号时减小。边界情况：竖直上抛的物体到最高点时$v=0$，加速度却不是零，不然它就停在空中了。

### 由加速度求运动

::anchor{id="thm-motion"}
定理（由:term[加速度]{id="physics.newtonian-mechanics.acceleration"}求运动）：设一段时间里质点的加速度$a(t)$已知，某一时刻$t_0$的:term[速度]{id="physics.newtonian-mechanics.velocity"}$v_0$和位置$x_0$也已知，这两个数叫作:term[初始条件]{id="physics.newtonian-mechanics.initial-conditions"}（initial conditions）。那么$v(t)$是$a(t)$的满足$v(t_0)=v_0$的那个原函数，$x(t)$是$v(t)$的满足$x(t_0)=x_0$的那个原函数，运动由此唯一确定。

证明思路：$v$的导数是$a$，所以$v$是$a$的一个原函数；同一个函数在一个区间上的原函数只差一个常数（见[原函数与不定积分](lesson:math.calculus.antiderivatives)），$v(t_0)=v_0$把这个常数定下来。$x$也一样。

::anchor{id="def-uniform"}
加速度不随时间变化的直线运动叫作:term[匀变速直线运动]{id="physics.newtonian-mechanics.uniformly-accelerated-motion"}（uniformly accelerated motion）。取$t_0=0$，由上面的定理，$v=v_0+at$，$x=x_0+v_0t+\frac12at^2$，消去$t$还有$v^2-v_0^2=2a(x-x_0)$。

为什么这样定义：加速度不变是最简单也最常见的情形，[平面运动与抛体](lesson:physics.newtonian-mechanics.kinematics-vectors)里的许多运动，就是两个方向上的这种运动合在一起。边界情况：$a=0$时就是匀速直线运动；这几个公式只在加速度不变时成立，加速度随时间变化时要回到上面的定理（例 2）。

::anchor{id="def-g"}
在地面附近、空气的影响可以忽略时，各种物体下落的加速度都相同，方向竖直向下，大小约为$9.8\,\mathrm{m/s^2}$，这个加速度叫作:term[重力加速度]{id="physics.newtonian-mechanics.gravitational-acceleration"}（gravitational acceleration），记作$g$。

为什么这样定义：伽利略发现轻重不同的物体下落得一样快，这个加速度只和地点有关、和物体无关，值得起个名字。边界情况：$g$随纬度和高度略有不同，赤道约$9.78\,\mathrm{m/s^2}$，两极约$9.83\,\mathrm{m/s^2}$；羽毛在空气里落得慢，是受了空气的阻碍，在抽成真空的管子里它和铁球一样快。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 4.5], y: [-22, 22] }
functions:
  - expr: "u*x - 4.9*x^2 + 0*sqrt(2*u/9.8 - x)"
    label: |
      位置$y$（$\mathrm m$）
  - expr: "u - 9.8*x + 0*sqrt(2*u/9.8 - x)"
    label: |
      速度$v$（$\mathrm{m/s}$）
sliders:
  - name: u
    min: 8
    max: 20
    step: 2
    default: 14
    label: |
      抛出时的速度$v_0$（$\mathrm{m/s}$）
:::

竖直上抛，取向上为正，物体离抛出点的位置记作$y$。横轴是时间$t$（$\mathrm s$，图上写作$x$），两条曲线是位置$y(t)$（也就是从抛出点算起的:term[位移]{id="physics.newtonian-mechanics.displacement"}）和:term[速度]{id="physics.newtonian-mechanics.velocity"}$v(t)$，都画到落回抛出点为止。速度是位置曲线的斜率：位置到最高点时，速度正好穿过零；速度是一条斜率为$-g$的直线，因为:term[加速度]{id="physics.newtonian-mechanics.acceleration"}不变。滑块调抛出时的速度，最高点的高度随它的平方增大，上升和下落用的时间总是一样长。

## 例题

### 例 1　由位置求速度

质点沿$x$轴运动，$x(t)=t^3-6t^2+9t$（$x$以$\mathrm m$计，$t$以$\mathrm s$计）。什么时刻:term[速度]{id="physics.newtonian-mechanics.velocity"}为零？前$4\,\mathrm s$里的:term[位移]{id="physics.newtonian-mechanics.displacement"}和走过的路程各是多少？

**为什么想到这么做**：速度是$x(t)$的导数。路程要在掉头的时刻分段计算，每段取位移的大小再相加。

**推导**：$v=3t^2-12t+9=3(t-1)(t-3)$，$t=1\,\mathrm s$和$3\,\mathrm s$时速度为零，质点在这两个时刻掉头。$x(0)=0$，$x(1)=4$，$x(3)=0$，$x(4)=4$（单位$\mathrm m$），所以位移是$4\,\mathrm m$，路程是$4+4+4=12\,\mathrm m$。:term[加速度]{id="physics.newtonian-mechanics.acceleration"}$a=6t-12$：在$1\,\mathrm s$到$2\,\mathrm s$之间$v<0$、$a<0$，速度的绝对值反而在增大。

### 例 2　加速度随时间减小

汽车从静止起步，:term[加速度]{id="physics.newtonian-mechanics.acceleration"}$a(t)=a_0\bigl(1-\frac t\tau\bigr)$，$0\le t\le\tau$，其中$a_0=3\,\mathrm{m/s^2}$，$\tau=10\,\mathrm s$。$\tau$时刻汽车的:term[速度]{id="physics.newtonian-mechanics.velocity"}多大，走了多远？

**为什么想到这么做**：加速度在变，:term[匀变速直线运动]{id="physics.newtonian-mechanics.uniformly-accelerated-motion"}的公式不能用。按定理，先求$a$的原函数得到$v$，再求$v$的原函数得到$x$，常数由:term[初始条件]{id="physics.newtonian-mechanics.initial-conditions"}定。

**推导**：$v=a_0\bigl(t-\frac{t^2}{2\tau}\bigr)+C_1$，$v(0)=0$给出$C_1=0$，$v(\tau)=\frac{a_0\tau}2=15\,\mathrm{m/s}$。$x=a_0\bigl(\frac{t^2}2-\frac{t^3}{6\tau}\bigr)+C_2$，取起点为原点，$C_2=0$，$x(\tau)=\frac{a_0\tau^2}3=100\,\mathrm m$。若按平均加速度（average acceleration）$\frac{a_0}2$套匀变速的公式，会得到$75\,\mathrm m$：前一半时间加速度大，汽车早早就跑快了。

## 常见误区

- 「:term[加速度]{id="physics.newtonian-mechanics.acceleration"}为负，物体就在减速。」要看:term[速度]{id="physics.newtonian-mechanics.velocity"}的正负：例 1 里$1\,\mathrm s$到$2\,\mathrm s$之间$a<0$，速度的绝对值却在增大。
- 「:term[位移]{id="physics.newtonian-mechanics.displacement"}的大小就是走过的路程。」中途掉头时两者不同，例 1 里位移$4\,\mathrm m$，路程$12\,\mathrm m$。
- 「$x=v_0t+\frac12at^2$对直线运动都成立。」它只对:term[匀变速直线运动]{id="physics.newtonian-mechanics.uniformly-accelerated-motion"}成立；加速度在变时，要按定理求原函数（例 2）。

---
id: physics.newtonian-mechanics.energy-diagrams
title: |
  势能曲线与平衡
goal: |
  会从势能曲线读出转折点和平衡位置，并判断平衡是否稳定。
prerequisites: [physics.newtonian-mechanics.potential-energy, math.calculus.concavity]
minutes: 25
summary: |
  质点只能在$U\le E$处运动；$U'=0$处平衡，$U''>0$时稳定。
status: reviewed
---

## 这一节要回答的问题

小球在碗底附近来回滚，放在倒扣的碗顶上却一碰就滚下去。只知道:term[势能]{id="physics.newtonian-mechanics.potential-energy"}（potential energy）怎样随位置变化，能不能看出质点在哪个范围里来回运动、在哪里能静止不动、静止得稳不稳？

## 讲解

### 势能曲线与转折点

这一节的质点沿$x$轴运动，只有一个:term[保守力]{id="physics.newtonian-mechanics.conservative-force"}（conservative force）做:term[功]{id="physics.newtonian-mechanics.work"}（work），$F(x)=-U'(x)$（见[势能与机械能守恒](lesson:physics.newtonian-mechanics.potential-energy#thm-force-from-potential)），:term[机械能]{id="physics.newtonian-mechanics.mechanical-energy"}（mechanical energy）$E=\frac12mv^2+U(x)$不变。

::anchor{id="def-potential-curve"}
:term[势能]{id="physics.newtonian-mechanics.potential-energy"}$U$随位置$x$变化的曲线叫作:term[势能曲线]{id="physics.newtonian-mechanics.potential-energy-curve"}（potential energy curve）；在同一张图上再画一条高度为$E$的水平线，两者之间竖直方向的距离$E-U(x)$就是质点在$x$处的:term[动能]{id="physics.newtonian-mechanics.kinetic-energy"}（kinetic energy）。

为什么这样定义：动能不能是负的，所以质点只能在$U(x)\le E$的地方运动，曲线高出水平线的地方它去不了；水平线离曲线越远，那里的:term[速率]{id="physics.newtonian-mechanics.speed"}（speed）越大。一张图就把整个运动的范围和快慢都显示出来，不用解:term[运动方程]{id="physics.newtonian-mechanics.equation-of-motion"}（equation of motion）。边界情况：曲线只告诉我们质点在每个位置的速率，不告诉它正往哪边走，也不告诉它什么时刻到那里。

::anchor{id="def-turning-point"}
$U(x)=E$的点，质点到那里:term[速度]{id="physics.newtonian-mechanics.velocity"}（velocity）变为零、然后掉头，叫作:term[转折点]{id="physics.newtonian-mechanics.turning-point"}（turning point）。

为什么这样定义：在转折点，动能为零，可:term[力]{id="physics.newtonian-mechanics.force"}（force）$-U'(x)$一般不为零，指向$U$低的一边，也就是质点来的那一边，所以它停一下就掉头。质点被夹在两个转折点之间时，就在它们之间来回运动；只有一个转折点、另一边的$U$一直低于$E$时，它掉头以后就一去不回。边界情况：如果在这一点$U'$也为零，水平线正好在曲线的极值（extremum）处和它相切，那就不是转折点而是平衡位置，见下面。

### 平衡位置和稳定性

::anchor{id="def-equilibrium"}
$U'(x_0)=0$时，:term[力]{id="physics.newtonian-mechanics.force"}$F(x_0)=0$，静止在$x_0$的质点一直静止，$x_0$叫作平衡位置（equilibrium position）。质点稍稍离开平衡位置后，力总把它推回来的，叫作:term[稳定平衡]{id="physics.newtonian-mechanics.stable-equilibrium"}（stable equilibrium）；力把它推得更远的，叫作:term[不稳定平衡]{id="physics.newtonian-mechanics.unstable-equilibrium"}（unstable equilibrium）；附近的力处处为零、放在哪里都能静止的，叫作随遇平衡（neutral equilibrium）。

为什么这样定义：碗底的小球、碗顶的小球都受力平衡，可一个被扰动后回得来，一个回不来；真实的物体总会受到一点扰动，只有稳定平衡才能长久保持。边界情况：平放在水平桌面上的小球，推一下停在哪里都行，是随遇平衡，这时$U$在附近是常数。

::anchor{id="thm-stability"}
定理：$U'(x_0)=0$时，若$U''(x_0)>0$，$x_0$是稳定平衡，$U$在这里取极小值（local minimum）；若$U''(x_0)<0$，$x_0$是不稳定平衡，$U$在这里取极大值（local maximum）。

证明思路：设$U''(x_0)>0$，由二阶导数判别法（second derivative test）的道理，$x$离$x_0$很近时$\frac{U'(x)}{x-x_0}>0$：$x_0$左侧$U'<0$，右侧$U'>0$。所以左侧的力$-U'$向右、右侧的力向左，都指向$x_0$，平衡是稳定的，$U$在$x_0$取极小值；$U''(x_0)<0$时符号全反过来。

所以看:term[势能曲线]{id="physics.newtonian-mechanics.potential-energy-curve"}就能判断：谷底是稳定平衡，峰顶是不稳定平衡。$U''(x_0)=0$时这个判别法什么也不说，要看两侧$U'$的正负。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-2, 2], y: [-0.2, 2] }
functions:
  - expr: "(x^2 - 1)^2"
    label: |
      势能$U(x)=(x^2-1)^2$
  - expr: "s"
    label: |
      机械能$E$
points:
  - { x: "-sqrt(1 + sqrt(s))", y: "s" }
  - { x: "-sqrt(1 - sqrt(s))", y: "s" }
  - { x: "sqrt(1 - sqrt(s))", y: "s" }
  - { x: "sqrt(1 + sqrt(s))", y: "s" }
sliders:
  - name: s
    min: 0.1
    max: 1.8
    step: 0.01
    default: 0.4
    label: |
      机械能$E$
:::

蓝色曲线是一条有两个谷的:term[势能曲线]{id="physics.newtonian-mechanics.potential-energy-curve"}，单位是$\mathrm J$和$\mathrm m$；橙色水平线是:term[机械能]{id="physics.newtonian-mechanics.mechanical-energy"}$E$，黑点是:term[转折点]{id="physics.newtonian-mechanics.turning-point"}。$x=\pm1$是谷底，是:term[稳定平衡]{id="physics.newtonian-mechanics.stable-equilibrium"}；$x=0$是峰顶，是:term[不稳定平衡]{id="physics.newtonian-mechanics.unstable-equilibrium"}。$E<1\,\mathrm J$时有四个转折点，质点被关在其中一个谷里，在两个黑点之间来回运动；把$E$拖到$1\,\mathrm J$以上，中间的两个黑点消失，质点越过峰顶，在最外面的两个黑点之间来回运动。

## 例题

### 例 1　来回运动的范围

:term[质量]{id="physics.newtonian-mechanics.mass"}（mass）$2.0\,\mathrm{kg}$的质点在:term[势能]{id="physics.newtonian-mechanics.potential-energy"}$U=2.0x^2$（$U$以$\mathrm J$为单位，$x$以$\mathrm m$为单位）里运动，:term[机械能]{id="physics.newtonian-mechanics.mechanical-energy"}是$8.0\,\mathrm J$。它在什么范围里运动？经过$x=1.0\,\mathrm m$时的:term[速率]{id="physics.newtonian-mechanics.speed"}（speed）多大？

**为什么想到这么做**：质点只能在$U\le E$的地方，:term[转折点]{id="physics.newtonian-mechanics.turning-point"}满足$U=E$；某处的:term[动能]{id="physics.newtonian-mechanics.kinetic-energy"}是$E-U$。

**推导**：$2.0x^2=8.0$，转折点是$x=\pm2.0\,\mathrm m$，质点在$-2.0\,\mathrm m$和$2.0\,\mathrm m$之间来回运动。$x=1.0\,\mathrm m$处动能是$8.0-2.0=6.0\,\mathrm J$，$v=\sqrt{\frac{2\times6.0}{2.0}}\approx2.45\,\mathrm{m/s}$。

### 例 2　判断平衡稳不稳

质点沿$x$轴运动，:term[势能]{id="physics.newtonian-mechanics.potential-energy"}$U=x^3-3x$（单位同例 1），:term[质量]{id="physics.newtonian-mechanics.mass"}$1.0\,\mathrm{kg}$。求平衡位置并判断稳定性。质点原来静止在:term[稳定平衡]{id="physics.newtonian-mechanics.stable-equilibrium"}位置，给它多大的:term[速度]{id="physics.newtonian-mechanics.velocity"}，它就会一去不回？

**为什么想到这么做**：平衡位置满足$U'=0$，再看$U''$的正负。要一去不回，质点得越过另一个平衡位置那里的峰。

**推导**：$U'=3x^2-3=0$，$x=\pm1\,\mathrm m$。$U''=6x$，$x=1$处$U''=6>0$，是稳定平衡，$U(1)=-2\,\mathrm J$；$x=-1$处$U''=-6<0$，是:term[不稳定平衡]{id="physics.newtonian-mechanics.unstable-equilibrium"}，$U(-1)=2\,\mathrm J$。越过$x=-1$处的峰以后，$U$一直下降到$-\infty$，质点就一去不回，所以要$\frac12\times1.0\times v^2>2-(-2)=4\,\mathrm J$，$v>2\sqrt2\approx2.83\,\mathrm{m/s}$。速度向右时，它先冲到右边的:term[转折点]{id="physics.newtonian-mechanics.turning-point"}再折回来，也要满足同一个条件。

## 常见误区

- 「质点在:term[转折点]{id="physics.newtonian-mechanics.turning-point"}受的:term[力]{id="physics.newtonian-mechanics.force"}为零。」那里:term[速度]{id="physics.newtonian-mechanics.velocity"}为零，力一般不为零，正是这个力让它掉头。
- 「:term[势能]{id="physics.newtonian-mechanics.potential-energy"}为零的地方是平衡位置。」平衡看$U'=0$，不看$U$的值；$U$的值还随参考点变。
- 「:term[势能曲线]{id="physics.newtonian-mechanics.potential-energy-curve"}就是质点运动的轨迹。」它是$U$随$x$变化的图像，质点只在$x$轴上来回运动。

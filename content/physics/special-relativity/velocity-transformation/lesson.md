---
id: physics.special-relativity.velocity-transformation
title: |
  速度变换
goal: |
  会用相对论的速度变换公式合成速度，并验证结果不会超过光速。
prerequisites: [physics.special-relativity.lorentz-transformation]
minutes: 35
summary: |
  沿运动方向$u'=\frac{u-v}{1-uv/c^2}$；比光慢的速度怎样合成都比光慢。
status: reviewed
---

## 这一节要回答的问题

列车以$0.6c$行驶，车上的人向前扔出一个相对列车以$0.6c$运动的球。按伽利略变换（Galilean transformation），球相对地面的速度是$1.2c$，比光还快。相对论里的答案是什么？为什么从列车上向前射出的光，相对地面仍是$c$？

## 讲解

### 速度变换公式

::anchor{id="thm-velocity-transformation"}
定理（:term[速度变换]{id="physics.special-relativity.velocity-transformation"}，velocity transformation）：:term[标准位形]{id="physics.special-relativity.standard-configuration"}（standard configuration）下，质点在$S$里的速度为$(u_x,u_y,u_z)$，在$S'$里的速度为$u_x'=\frac{u_x-v}{1-u_xv/c^2}$，$u_y'=\frac{u_y}{\gamma(1-u_xv/c^2)}$，$u_z'=\frac{u_z}{\gamma(1-u_xv/c^2)}$，其中$\gamma$对应$S'$的速度$v$。

证明：取质点:term[世界线]{id="physics.special-relativity.worldline"}（world line）上相邻的两个:term[事件]{id="physics.special-relativity.event"}（event），在$S$里坐标差为$\Delta t$、$\Delta x=u_x\Delta t$、$\Delta y=u_y\Delta t$、$\Delta z=u_z\Delta t$（质点匀速时这对任意$\Delta t$成立，否则在$\Delta t\to0$时成立）。:term[洛伦兹变换]{id="physics.special-relativity.lorentz-transformation"}（Lorentz transformation）是线性的，坐标差满足$\Delta x'=\gamma(\Delta x-v\Delta t)=\gamma(u_x-v)\Delta t$，$\Delta t'=\gamma\bigl(\Delta t-\frac{v\Delta x}{c^2}\bigr)=\gamma\bigl(1-\frac{u_xv}{c^2}\bigr)\Delta t$，$\Delta y'=\Delta y$，$\Delta z'=\Delta z$。$|u_x|,|v|<c$时$1-\frac{u_xv}{c^2}>0$，$\Delta t'\ne0$，相除即得三个公式。

为什么不是简单相减：分母里的$1-\frac{u_xv}{c^2}$来自$\Delta t'$和$\Delta t$不相等，这里同时用上了:term[时间延缓]{id="physics.special-relativity.time-dilation"}（time dilation）和:term[同时的相对性]{id="physics.special-relativity.relativity-of-simultaneity"}（relativity of simultaneity）。横向分量也要变，因为同样的横向位移，在$S'$里花的时间不同。把$v$换成$-v$、带撇的和不带撇的对调，得到逆变换$u_x=\frac{u_x'+v}{1+u_x'v/c^2}$：$S'$相对$S$以$v$运动，物体相对$S'$以$u'$沿$x$轴运动，它相对$S$的速度就是这个式子。$|u_x|$、$|v|$都远小于$c$时，分母接近$1$，回到伽利略的$u_x'=u_x-v$。

### 比光慢的速度合成后仍比光慢

::anchor{id="thm-subluminal"}
定理（速度不超过光速）：设质点在$S$里的速率$u<c$，$|v|<c$，那么它在$S'$里的速率$u'<c$；如果$u=c$，那么$u'=c$。

证明：由:term[速度变换]{id="physics.special-relativity.velocity-transformation"}公式，$u'^2=\frac{(u_x-v)^2+(u_y^2+u_z^2)(1-v^2/c^2)}{(1-u_xv/c^2)^2}$。展开$\bigl(1-\frac{u_xv}{c^2}\bigr)^2-\frac{(u_x-v)^2}{c^2}=1-\frac{u_x^2}{c^2}-\frac{v^2}{c^2}+\frac{u_x^2v^2}{c^4}=\bigl(1-\frac{u_x^2}{c^2}\bigr)\bigl(1-\frac{v^2}{c^2}\bigr)$，于是$1-\frac{u'^2}{c^2}=\frac{(1-u^2/c^2)(1-v^2/c^2)}{(1-u_xv/c^2)^2}$。$u<c$、$|v|<c$时右边为正，所以$u'<c$；$u=c$时右边为零，$u'=c$，光沿任何方向的速率在$S'$里仍是$c$。

这个恒等式还给出$\frac{1}{\sqrt{1-u'^2/c^2}}=\frac{1-u_xv/c^2}{\sqrt{1-u^2/c^2}\sqrt{1-v^2/c^2}}$，以后讲:term[四维速度]{id="physics.special-relativity.four-velocity"}（four-velocity）时会用到。

### 快度

沿同一条直线的速度，合成公式$\frac{u+v}{1+uv/c^2}$不是简单相加。换一个量来描述速度，可以让合成变成相加。

::anchor{id="def-rapidity"}
对速度$u$（$|u|<c$），满足$\tanh\varphi=\frac uc$的实数$\varphi$叫作$u$的:term[快度]{id="physics.special-relativity.rapidity"}（rapidity），这里$\tanh\varphi=\frac{e^\varphi-e^{-\varphi}}{e^\varphi+e^{-\varphi}}$。

为什么这样定义：$\tanh$在实数上严格递增，取值充满$(-1,1)$，所以每个$|u|<c$都有唯一的快度，$\varphi=\frac12\ln\frac{c+u}{c-u}$；$u$很小时$\varphi\approx\frac uc$。可以验证$\tanh(\varphi_1+\varphi_2)=\frac{\tanh\varphi_1+\tanh\varphi_2}{1+\tanh\varphi_1\tanh\varphi_2}$，它和速度合成公式形状相同，所以沿同一直线合成速度，就是把快度相加。验证：记$a=e^{\varphi_1}$、$b=e^{\varphi_2}$，则$\tanh\varphi_1=\frac{a^2-1}{a^2+1}$、$\tanh\varphi_2=\frac{b^2-1}{b^2+1}$，右边的分子、分母同乘$(a^2+1)(b^2+1)$，化为$\frac{2a^2b^2-2}{2a^2b^2+2}=\frac{a^2b^2-1}{a^2b^2+1}=\tanh(\varphi_1+\varphi_2)$。边界情况：$u\to\pm c$时$\varphi\to\pm\infty$，有限次合成永远到不了光速。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-1, 1], y: [-1.6, 2] }
functions:
  - expr: "(x + v)/(1 + x*v)"
    label: |
      相对论：$\frac{u'+v}{1+u'v/c^2}$
  - expr: "x + v"
    label: |
      伽利略：$u'+v$
  - expr: "1"
    label: |
      光速$c$
  - expr: "-1"
    label: |
      光速$-c$
sliders:
  - name: v
    min: 0
    max: 0.9
    step: 0.1
    default: 0.5
    label: |
      $S'$相对$S$的速度$v/c$
:::

横轴是物体相对$S'$的速度$u'$，纵轴是它相对$S$的速度，都以$c$为单位。伽利略的直线会冲出$\pm c$的范围；相对论的曲线始终夹在两条光速线之间，在$u'=\pm c$处正好碰到它们：光相对谁都是$c$。$u'$和$v$都小时，两条线几乎重合。

## 例题

### 例 1　列车上扔出的球和发出的光

列车以$0.6c$行驶，车上的人向前扔出相对列车$0.6c$的球，又向前发出一束光。求球和光相对地面的速度。

**为什么想到这么做**：取地面为$S$、列车为$S'$，已知的是相对$S'$的速度，用逆变换$u=\frac{u'+v}{1+u'v/c^2}$。

**推导**：球：$u=\frac{0.6c+0.6c}{1+0.36}=\frac{1.2}{1.36}c\approx0.882c$，比光慢。光：$u=\frac{c+0.6c}{1+0.6}=c$，和:term[光速不变原理]{id="physics.special-relativity.light-postulate"}（constancy of the speed of light）一致。伽利略变换给出的$1.2c$和$1.6c$都错了，错在把两个参考系（frame of reference）的时间当成同一个。

### 例 2　流水中的光

光在折射率（refractive index）为$n$的静止的水里速度是$\frac cn$。水以速度$v$沿光的传播方向流动，实验室里测得的光速是多少？取$n=1.333$、$v=7\,\mathrm{m/s}$，光速比在静止的水里快了多少？

**为什么想到这么做**：在随水流动的参考系里，水静止，光速是$\frac cn$；实验室相对它以$-v$运动，用速度合成公式，再利用$v\ll c$做近似。

**推导**：$u=\frac{c/n+v}{1+v/(nc)}\approx\Bigl(\frac cn+v\Bigr)\Bigl(1-\frac{v}{nc}\Bigr)\approx\frac cn+v\Bigl(1-\frac{1}{n^2}\Bigr)$，略去了$v^2$项。光速只增加了$v\bigl(1-\frac1{n^2}\bigr)\approx0.437\times7\,\mathrm{m/s}\approx3.1\,\mathrm{m/s}$，而不是$v$。1851 年菲佐（Hippolyte Fizeau）用流水干涉实验测到了这个效应，菲涅耳（Augustin-Jean Fresnel）早在 1818 年用「以太（ether）被物质部分拖动」预言过系数$1-\frac1{n^2}$；1907 年劳厄（Max von Laue）指出，它正是相对论速度合成的结果，不需要以太。

## 常见误区

- 「:term[速度变换]{id="physics.special-relativity.velocity-transformation"}只改沿运动方向的分量，横向分量不变。」横向分量变成$\frac{u_y}{\gamma(1-u_xv/c^2)}$；横向长度不变，但时间间隔变了。
- 「在地面看两艘相向飞行的飞船，各以$0.9c$运动，所以它们之间的距离以$1.8c$缩小，这违反相对论。」不违反：$1.8c$是地面参考系里距离的变化率，不是任何物体的速度；在一艘飞船的参考系里，另一艘的速度是$\frac{1.8}{1.81}c\approx0.994c$。
- 「:term[快度]{id="physics.special-relativity.rapidity"}和速度一样，合成时要用特别的公式。」快度的好处正是沿同一直线合成时直接相加；不过不同方向的速度合成，快度也不能简单相加。
- 「菲佐实验说明水把以太部分地拖着走。」相对论里没有以太，光速的变化完全来自速度合成公式。

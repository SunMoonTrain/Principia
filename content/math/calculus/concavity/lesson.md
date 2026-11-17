---
id: math.calculus.concavity
title: |
  凹凸性与拐点
goal: |
  会用二阶导数判断曲线的凹凸性并求拐点。
prerequisites: [math.calculus.monotonicity, math.calculus.higher-derivatives]
minutes: 28
summary: |
  $f''>0$时曲线凸（向上弯），$f''<0$时凹；$f''$变号的点是拐点。
status: reviewed
---

## 这一节要回答的问题

$x>0$时，$x^2$和$\sqrt x$都严格递增，可一个越升越快、一个越升越慢，图像一个向上弯、一个向下弯。弯的方向怎样用:term[导数]{id="math.calculus.derivative"}（derivative）说清，弯的方向在哪里改变？找到:term[驻点]{id="math.calculus.stationary-point"}（stationary point）以后，能不能只看这一点，就判断它是极大还是极小？

## 讲解

### 凸函数与凹函数

在$y=x^2$的图像上任取两点连一条弦，两点之间的曲线总在弦的下方；$y=\sqrt x$正好相反，曲线在弦的上方。

::anchor{id="def-convex"}
设$f$在区间$I$上有定义。如果对$I$里任意$x_1<x<x_2$，都有$f(x)\le f(x_1)+\frac{f(x_2)-f(x_1)}{x_2-x_1}(x-x_1)$，即两点之间的曲线不高于连接$\bigl(x_1,f(x_1)\bigr)$、$\bigl(x_2,f(x_2)\bigr)$的弦，就说$f$是$I$上的:term[凸函数]{id="math.calculus.convex-function"}（convex function），也说$f$在$I$上凸；把$\le$换成$<$，叫严格凸（strictly convex）。把不等号反过来，就是:term[凹函数]{id="math.calculus.concave-function"}（concave function）、凹和严格凹。

为什么这样定义：弦在曲线上方，曲线就向上弯，像碗口朝上。只用到函数值，不要求:term[可导]{id="math.calculus.differentiable"}（differentiable）：$|x|$在$\R$上凸，可它在$0$处不可导。名字要留意：有的书把这里的凸叫作「凹」或「下凸」，读别的书时先看定义。边界情况：一次函数的弦和图像重合，它既凸又凹，但不严格。

### 用二阶导数判断

::anchor{id="thm-convex-second-derivative"}
**定理**　设$f$在区间$I$上:term[连续]{id="math.calculus.continuous"}（continuous），在$I$的内部二阶可导。如果内部处处$f''\ge0$，那么$f$在$I$上:term[凸]{id="math.calculus.convex-function"}；如果处处$f''>0$，那么$f$在$I$上严格凸。$f''\le0$、$f''<0$时，相应地是:term[凹]{id="math.calculus.concave-function"}和严格凹。

道理：$f''\ge0$，即$f'$的:term[导数]{id="math.calculus.derivative"}不为负，由[单调性与极值的判别](lesson:math.calculus.monotonicity#thm-monotonic-derivative)，$f'$递增。任取$x_1<x<x_2$，由:term[中值定理]{id="math.calculus.mean-value-theorem"}（mean value theorem），连接$x_1$、$x$两处的弦斜率是$f'(\xi_1)$，连接$x$、$x_2$两处的弦斜率是$f'(\xi_2)$，$\xi_1<x<\xi_2$，所以前者不超过后者。中间点处先缓后陡，$\bigl(x,f(x)\bigr)$就不高于整条弦；$f''>0$时$f'$严格递增，不等号都变成严格的。

所以$f''>0$时，:term[切线]{id="math.calculus.tangent-line"}（tangent line）的斜率越来越大，切线越转越朝上，曲线向上弯（见[高阶导数](lesson:math.calculus.higher-derivatives)）。边界情况：定理反过来不成立。$x^4$在$\R$上严格凸（$f'=4x^3$严格递增），可它的:term[二阶导数]{id="math.calculus.second-derivative"}（second derivative）$12x^2$在$0$处是$0$，和[单调性与极值的判别](lesson:math.calculus.monotonicity)里的$x^3$同理。

### 拐点

::anchor{id="def-inflection-point"}
设$f$在$x_0$处:term[连续]{id="math.calculus.continuous"}。如果在$x_0$的一侧附近$f$:term[严格凸]{id="math.calculus.convex-function"}、另一侧附近$f$:term[严格凹]{id="math.calculus.concave-function"}，就说点$\bigl(x_0,f(x_0)\bigr)$是曲线$y=f(x)$的:term[拐点]{id="math.calculus.inflection-point"}（inflection point）。

为什么这样定义：拐点是曲线弯的方向改变的地方，:term[切线]{id="math.calculus.tangent-line"}在那里从曲线的一侧穿到另一侧。$\sin x$的:term[二阶导数]{id="math.calculus.second-derivative"}$-\sin x$在$0$左侧为正、右侧为负，所以$(0,0)$是$y=\sin x$的拐点。边界情况：要的是严格凸和严格凹，一次函数两侧都既凸又凹，它图像上的点不是拐点。拐点说的是曲线上的点，要写出两个坐标。

找拐点和找:term[极值点]{id="math.calculus.extremum-point"}（extremum point）一样分两步。$f''$在$x_0$附近连续、$f''(x_0)\ne0$时，$f''$在$x_0$附近不变号，那里不会是拐点；所以拐点只能出现在$f''=0$或$f''$不存在的地方，找出这些点，再看$f''$在两侧变不变号。边界情况：$f''(x_0)=0$不够，$x^4$在$0$处$f''=0$，两侧都严格凸，$(0,0)$不是拐点。$f''$不存在的点也可能是拐点：$x|x|$在$0$处没有二阶导数，可它在$x<0$时严格凹、$x>0$时严格凸，$(0,0)$是拐点。

### 二阶导数判别法

::anchor{id="thm-second-derivative-test"}
**定理（:term[二阶导数判别法]{id="math.calculus.second-derivative-test"}，second derivative test）**　设$f'(x_0)=0$，并且$f''(x_0)$存在。如果$f''(x_0)>0$，那么$f(x_0)$是:term[极小值]{id="math.calculus.local-minimum"}（local minimum）；如果$f''(x_0)<0$，那么$f(x_0)$是:term[极大值]{id="math.calculus.local-maximum"}（local maximum）。

道理：设$f''(x_0)>0$。由:term[导数]{id="math.calculus.derivative"}的定义，$f''(x_0)=\lim_{x\to x_0}\frac{f'(x)-f'(x_0)}{x-x_0}=\lim_{x\to x_0}\frac{f'(x)}{x-x_0}$，所以$x$离$x_0$很近时$\frac{f'(x)}{x-x_0}>0$：左侧$f'<0$，右侧$f'>0$。由:term[一阶导数判别法]{id="math.calculus.first-derivative-test"}（first derivative test），$f(x_0)$是极小值；$f''(x_0)<0$同理。

它的好处是只看$x_0$一点，不用考察两侧。边界情况：$f''(x_0)=0$时这个判别法什么也不说。$x^4$、$-x^4$、$x^3$在$0$处都有$f'=f''=0$，$0$分别是极小值点、极大值点、不是:term[极值点]{id="math.calculus.extremum-point"}，这时要回到一阶导数判别法。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-3, 3], y: [-2, 3] }
functions:
  - expr: "x^4/12 - x^2/2"
    label: |
      $y=f(x)=\frac{x^4}{12}-\frac{x^2}2$
  - expr: "x^2 - 1"
    label: |
      $y=f''(x)=x^2-1$
  - expr: "u^4/12 - u^2/2 + (u^3/3 - u)*(x - u)"
    label: |
      $f$在$x=u$处的切线
points:
  - { x: "u", y: "u^4/12 - u^2/2" }
sliders:
  - name: u
    min: -2.8
    max: 2.8
    step: 0.1
    default: 2
    label: |
      切点的横坐标$u$
:::

蓝色是$f(x)=\frac{x^4}{12}-\frac{x^2}2$，橙色是它的:term[二阶导数]{id="math.calculus.second-derivative"}$f''(x)=x^2-1$。拖动$u$：$|u|>1$时橙色曲线在横轴上方，绿色:term[切线]{id="math.calculus.tangent-line"}在蓝色曲线下方，曲线:term[凸]{id="math.calculus.convex-function"}；$|u|<1$时切线在曲线上方，曲线:term[凹]{id="math.calculus.concave-function"}。$u=\pm1$处$f''$变号，切线从曲线的一侧穿到另一侧，$\bigl(\pm1,-\frac5{12}\bigr)$是:term[拐点]{id="math.calculus.inflection-point"}。:term[驻点]{id="math.calculus.stationary-point"}$0$处$f''=-1<0$，是极大值点；$\pm\sqrt3$处$f''=2>0$，是极小值点。

## 例题

### 例 1　凹凸区间和拐点

求$f(x)=\ln(1+x^2)$的凹凸区间和:term[拐点]{id="math.calculus.inflection-point"}。

**为什么想到这么做**：$f$处处二阶可导，按定理看$f''$的正负，$f''$变号的点就是拐点的横坐标。

**推导**：$f'(x)=\frac{2x}{1+x^2}$，$f''(x)=\frac{2(1+x^2)-2x\cdot2x}{(1+x^2)^2}=\frac{2(1-x^2)}{(1+x^2)^2}$。$|x|<1$时$f''>0$，$|x|>1$时$f''<0$。所以$f$在$[-1,1]$上:term[严格凸]{id="math.calculus.convex-function"}，在$(-\infty,-1]$和$[1,+\infty)$上各自:term[严格凹]{id="math.calculus.concave-function"}；$f''$在$\pm1$处变号，拐点是$(-1,\ln2)$和$(1,\ln2)$。

### 例 2　只看一点

求$f(x)=x+2\cos x$在$(0,2\pi)$内的:term[极值]{id="math.calculus.local-extremum"}（local extremum）。

**为什么想到这么做**：先找:term[驻点]{id="math.calculus.stationary-point"}；$f''$在驻点处的值好算，用:term[二阶导数判别法]{id="math.calculus.second-derivative-test"}，不用逐个看两侧的正负。

**推导**：$f'(x)=1-2\sin x=0$，在$(0,2\pi)$内得$x=\frac\pi6$和$x=\frac{5\pi}6$。$f''(x)=-2\cos x$：$f''\bigl(\frac\pi6\bigr)=-\sqrt3<0$，所以:term[极大值]{id="math.calculus.local-maximum"}是$f\bigl(\frac\pi6\bigr)=\frac\pi6+\sqrt3$；$f''\bigl(\frac{5\pi}6\bigr)=\sqrt3>0$，所以:term[极小值]{id="math.calculus.local-minimum"}是$f\bigl(\frac{5\pi}6\bigr)=\frac{5\pi}6-\sqrt3$。

## 常见误区

- 「:term[凸函数]{id="math.calculus.convex-function"}的图像向外鼓，像山顶。」这里的凸是弦在曲线上方，图像像碗口朝上，$x^2$是凸的；先看清书里的定义。
- 「$f''(x_0)=0$，$\bigl(x_0,f(x_0)\bigr)$就是:term[拐点]{id="math.calculus.inflection-point"}。」还要$f''$在两侧变号：$x^6$在$0$处$f''=0$，两侧都严格凸。
- 「拐点是$x=1$。」拐点是曲线上的点，要写成$(1,f(1))$这样的坐标。

---
id: math.calculus.local-extrema
title: |
  极值与费马定理
goal: |
  知道可导函数在极值点处的导数为零，会找出函数的驻点。
prerequisites: [math.calculus.derivative-rules]
minutes: 24
summary: |
  极值只和附近的点比；可导函数的极值点处导数为零，是驻点。
status: reviewed
---

## 这一节要回答的问题

竖直上抛的小球升到最高点的那一刻，速度是多少？山顶、谷底处的:term[切线]{id="math.calculus.tangent-line"}（tangent line）看上去都是水平的。这个直觉对所有函数都成立吗？反过来，切线水平的地方一定是山顶或谷底吗？

## 讲解

### 极大值与极小值

$f(x)=x^3-3x$的图像（见几何图像）在$x=-1$处有一个「山顶」，$f(-1)=2$，比它附近的函数值都大；可$x$很大时，$f(x)$远比$2$大。在$x=1$处有一个「谷底」，$f(1)=-2$。山顶、谷底只和附近的点比，不和整个定义域比。

::anchor{id="def-local-extremum"}
设$f$在$x_0$附近有定义。如果有$\delta>0$，使满足$|x-x_0|<\delta$的所有$x$都有$f(x)\le f(x_0)$，就说$f(x_0)$是$f$的:term[极大值]{id="math.calculus.local-maximum"}（local maximum），$x_0$是极大值点；把$\le$换成$\ge$，就是:term[极小值]{id="math.calculus.local-minimum"}（local minimum）和极小值点。极大值、极小值统称:term[极值]{id="math.calculus.local-extremum"}（local extremum），极大值点、极小值点统称:term[极值点]{id="math.calculus.extremum-point"}（extremum point）。

为什么这样定义：极值是局部的概念，只和$x_0$附近的点比；最大值、最小值要和整个定义域比。所以极大值可以比极小值还小：$x+\frac1x$在$x=-1$处取极大值$-2$，在$x=1$处取极小值$2$。边界情况：区间的端点只有一侧有定义，按这个定义不算极值点；常数函数的每一点既是极大值点，又是极小值点。

### 费马定理

::anchor{id="thm-fermat"}
**:term[费马定理]{id="math.calculus.fermat-theorem"}（Fermat's theorem）**　如果$x_0$是$f$的:term[极值点]{id="math.calculus.extremum-point"}，并且$f$在$x_0$处:term[可导]{id="math.calculus.differentiable"}（differentiable），那么$f'(x_0)=0$。

道理：设$x_0$是极大值点。$h>0$且很小时$f(x_0+h)-f(x_0)\le0$，:term[差商]{id="math.calculus.difference-quotient"}（difference quotient）$\frac{f(x_0+h)-f(x_0)}h\le0$；它的:term[极限]{id="math.calculus.limit"}（limit，lim）不会是正数，否则$h$很小时差商离这个正数很近，也是正的，所以右导数$\le0$。$h<0$时差商$\ge0$，同理左导数$\ge0$。$f$在$x_0$处可导时，左、右导数都等于$f'(x_0)$，只能是$0$；极小值点同理。

两个条件缺一不可。$|x|$在$0$处取:term[极小值]{id="math.calculus.local-minimum"}，可它在$0$处不可导，谈不上:term[导数]{id="math.calculus.derivative"}（derivative）为零。$x_0$还得在定义域内部：$f(x)=x$在$[0,1]$上的最大值在端点$1$处取到，导数却是$1$，因为端点不是极值点。

### 驻点

::anchor{id="def-stationary-point"}
使$f'(x_0)=0$的点$x_0$叫作$f$的:term[驻点]{id="math.calculus.stationary-point"}（stationary point）。

为什么要起这个名字：经过驻点的那一刻，$f$的瞬时变化率是$0$，像运动的物体在那一刻停住，竖直上抛的小球在最高点就是这样。:term[费马定理]{id="math.calculus.fermat-theorem"}说，:term[可导函数]{id="math.calculus.differentiable"}的:term[极值点]{id="math.calculus.extremum-point"}都在驻点里。边界情况：反过来不对，$x^3$在$0$处的:term[导数]{id="math.calculus.derivative"}是$0$，可$x^3$在$0$的左边为负、右边为正，$0$不是极值点。

所以找极值点只需要在两类点里找：驻点，以及$f$不可导的点；其余的点上$f$可导、导数不为零，由费马定理不可能是极值点。找出这些点以后，还要逐个判断是不是极值点：可以比较附近的函数值（例题），以后也可以看导数在两侧的正负（见[单调性与极值的判别](lesson:math.calculus.monotonicity)）。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-3, 3], y: [-4.5, 4.5] }
functions:
  - expr: "x^3 - 3x"
    label: |
      $y=x^3-3x$
  - expr: "a^3 - 3a + (3a^2 - 3)*(x - a)"
    label: |
      $x=a$处的切线
points:
  - { x: "a", y: "a^3 - 3a" }
sliders:
  - name: a
    min: -2.2
    max: 2.2
    step: 0.1
    default: -1.6
    label: |
      切点的横坐标$a$
:::

把$a$从左往右拖，橙色:term[切线]{id="math.calculus.tangent-line"}先向上倾斜，到$x=-1$的山顶变成水平，过了山顶向下倾斜，到$x=1$的谷底又变成水平。两个水平的位置就是$f'(x)=3x^2-3$的两个零点，也就是两个:term[驻点]{id="math.calculus.stationary-point"}；$x$很大或很小时，曲线冲出画面，所以$-1$、$1$处只是:term[极值]{id="math.calculus.local-extremum"}，不是最值。

## 例题

### 例 1　找驻点，再逐个判断

求$f(x)=x^4-2x^2$的:term[驻点]{id="math.calculus.stationary-point"}，并判断哪些是:term[极值点]{id="math.calculus.extremum-point"}。

**为什么想到这么做**：$f$是多项式，处处:term[可导]{id="math.calculus.differentiable"}，所以极值点只能是驻点。先解$f'(x)=0$，再拿驻点处的函数值和附近的比。

**推导**：$f'(x)=4x^3-4x=4x(x-1)(x+1)$，驻点是$-1$、$0$、$1$。$f(x)+1=(x^2-1)^2\ge0$，所以$f(x)\ge-1=f(\pm1)$，$\pm1$是极小值点（还是最小值点）。$f(0)=0$，而$0<|x|<\sqrt2$时$f(x)=x^2(x^2-2)<0$，所以$0$是极大值点，:term[极大值]{id="math.calculus.local-maximum"}是$0$。

### 例 2　不可导的点也可能是极值点

求$f(x)=|x|(x-2)$的:term[极值点]{id="math.calculus.extremum-point"}。

**为什么想到这么做**：$|x|$在$0$处不:term[可导]{id="math.calculus.differentiable"}，$f$可能也不可导，所以候选点除了:term[驻点]{id="math.calculus.stationary-point"}，还有$x=0$。去掉绝对值，分两段求导。

**推导**：$x\ge0$时$f(x)=x^2-2x$，$x<0$时$f(x)=-x^2+2x$。$x>0$时$f'(x)=2x-2$，驻点是$1$；$x<0$时$f'(x)=2-2x>0$，没有驻点。在$0$处，左导数是$2$、右导数是$-2$，不可导；$0<|x|<2$时$f(x)<0=f(0)$，所以$0$是极大值点。$f(x)-f(1)=x^2-2x+1=(x-1)^2\ge0$（$x\ge0$），所以$1$是极小值点，:term[极小值]{id="math.calculus.local-minimum"}是$-1$。

## 常见误区

- 「:term[导数]{id="math.calculus.derivative"}为零的点就是:term[极值点]{id="math.calculus.extremum-point"}。」$x^3$在$0$处导数为零，可$0$不是极值点。
- 「极值点处的导数一定为零。」$|x|$在$0$处取:term[极小值]{id="math.calculus.local-minimum"}，可它在$0$处不:term[可导]{id="math.calculus.differentiable"}；:term[费马定理]{id="math.calculus.fermat-theorem"}要求可导。
- 「:term[极大值]{id="math.calculus.local-maximum"}一定比极小值大。」$x+\frac1x$的极大值$-2$比极小值$2$小。

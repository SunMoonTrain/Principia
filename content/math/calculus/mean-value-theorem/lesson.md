---
id: math.calculus.mean-value-theorem
title: |
  微分中值定理
goal: |
  会叙述罗尔定理和拉格朗日中值定理，并用它们证明简单的不等式。
prerequisites: [math.calculus.local-extrema, math.calculus.closed-interval-properties, math.calculus.elementary-derivatives]
minutes: 28
summary: |
  某处的切线平行于弦：$f(b)-f(a)=f'(\xi)(b-a)$。
status: reviewed
---

## 这一节要回答的问题

一辆车两小时开了$160\,\mathrm{km}$，平均速度是$80\,\mathrm{km/h}$。速度表在某一刻一定恰好指着$80$吗？再说一件看似显然的事：速度表一直指着$0$，车就一直没动；这怎么从:term[导数]{id="math.calculus.derivative"}（derivative）的定义推出来？

## 讲解

### 罗尔定理

::anchor{id="thm-rolle"}
**:term[罗尔定理]{id="math.calculus.rolle-theorem"}（Rolle's theorem）**　设$f$在$[a,b]$上:term[连续]{id="math.calculus.continuous"}（continuous），在$(a,b)$内:term[可导]{id="math.calculus.differentiable"}（differentiable），并且$f(a)=f(b)$，那么至少有一点$\xi\in(a,b)$，使$f'(\xi)=0$。

道理：由:term[最值定理]{id="math.calculus.extreme-value-theorem"}（extreme value theorem），$f$在$[a,b]$上取到最大值$M$和最小值$m$。$M=m$时$f$是常数，$(a,b)$内每一点的:term[导数]{id="math.calculus.derivative"}都是$0$。$M>m$时，因为$f(a)=f(b)$，最大值、最小值至少有一个在内部某点$\xi$取到；$\xi$附近的函数值都不超过（或都不低于）$f(\xi)$，它是:term[极值点]{id="math.calculus.extremum-point"}（extremum point），由:term[费马定理]{id="math.calculus.fermat-theorem"}（Fermat's theorem），$f'(\xi)=0$。

几何上，两端一样高、中间处处有:term[切线]{id="math.calculus.tangent-line"}（tangent line）的连续曲线，中间至少有一处切线水平。三个条件少一个都不行：$|x|$在$[-1,1]$上两端一样高，可在$0$处不可导，哪里都没有水平切线；$f(x)=x$（$0\le x<1$）、$f(1)=0$在$1$处不连续，导数处处是$1$；$f(a)\ne f(b)$时，$f(x)=x$就是反例。

### 拉格朗日中值定理

::anchor{id="thm-mean-value"}
**:term[拉格朗日中值定理]{id="math.calculus.mean-value-theorem"}（mean value theorem）**　设$f$在$[a,b]$上:term[连续]{id="math.calculus.continuous"}，在$(a,b)$内:term[可导]{id="math.calculus.differentiable"}，那么至少有一点$\xi\in(a,b)$，使$f'(\xi)=\frac{f(b)-f(a)}{b-a}$，即$f(b)-f(a)=f'(\xi)(b-a)$。

道理：把弦「拉平」。连接$(a,f(a))$、$(b,f(b))$的弦是$g(x)=f(a)+\frac{f(b)-f(a)}{b-a}(x-a)$，令$\varphi(x)=f(x)-g(x)$，则$\varphi(a)=\varphi(b)=0$，$\varphi$满足:term[罗尔定理]{id="math.calculus.rolle-theorem"}的条件。所以有$\xi\in(a,b)$使$\varphi'(\xi)=f'(\xi)-\frac{f(b)-f(a)}{b-a}=0$。

几何上，曲线上某一点的:term[切线]{id="math.calculus.tangent-line"}平行于两端连成的弦；运动学上，某一时刻的瞬时速度等于平均速度，开头那辆车在某一刻速度表正好指着$80$。罗尔定理是$f(a)=f(b)$的特殊情形。边界情况：定理只说$\xi$存在，不说在哪里，也不说只有一个（见几何图像）。

写成增量的形式更常用：令$a=x_0$，$b=x_0+h$，$\xi=x_0+\theta h$，就是$f(x_0+h)-f(x_0)=f'(x_0+\theta h)\,h$，$0<\theta<1$，$h$可正可负。它把函数的增量和:term[导数]{id="math.calculus.derivative"}精确地连起来：[微分与线性近似](lesson:math.calculus.differentials)里的$\Delta y\approx f'(x_0)h$只是近似，这里换成中间某点的导数，就成了等式。

### 两个推论

::anchor{id="thm-zero-derivative"}
**推论 1**　如果在区间$I$上处处有$f'(x)=0$，那么$f$在$I$上是常数。

::anchor{id="thm-same-derivative"}
**推论 2**　如果在区间$I$上处处有$f'(x)=g'(x)$，那么$f-g$在$I$上是常数，即$f(x)=g(x)+C$。

道理：在$I$里任取$x_1<x_2$，由:term[中值定理]{id="math.calculus.mean-value-theorem"}，$f(x_2)-f(x_1)=f'(\xi)(x_2-x_1)=0$，所以$f$在任意两点的值都相等。对$f-g$用推论 1 就是推论 2：:term[导数]{id="math.calculus.derivative"}处处相同的两个函数只差一个常数。这回答了开头的问题：速度表一直指着$0$，位置就不变；以后求:term[原函数]{id="math.calculus.antiderivative"}（antiderivative）也要靠推论 2。

边界情况：「区间」不能少。$x<0$时取$0$、$x>0$时取$1$的函数，在它的定义域上处处导数为$0$，却不是常数：定义域断成两段，中值定理没法跨过$x=0$用。

### 用中值定理证明不等式

要估计$f(b)-f(a)$，就写成$f'(\xi)(b-a)$：$\xi$不知道在哪，可只要知道$f'$在$(a,b)$上的范围，就能把这个差夹住。特别地，在区间上$|f'(x)|\le M$时，$|f(x_2)-f(x_1)|\le M|x_2-x_1|$：:term[导数]{id="math.calculus.derivative"}有界，函数值就不会变得太快。下面两个例题都是这个思路。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-2.5, 3], y: [-3, 5.5] }
functions:
  - expr: "0.5x^3 - 1.5x"
    label: |
      $y=\frac12x^3-\frac32x$
  - expr: "-1 + 1.125*(x + 2)"
    label: |
      两端$x=-2$、$x=2.5$连成的弦
  - expr: "0.5c^3 - 1.5c + (1.5c^2 - 1.5)*(x - c)"
    label: |
      $x=c$处的切线
points:
  - { x: "-2", y: "-1" }
  - { x: "2.5", y: "4.0625" }
  - { x: "c", y: "0.5c^3 - 1.5c" }
sliders:
  - name: c
    min: -2
    max: 2.5
    step: 0.02
    default: 0.4
    label: |
      切点的横坐标$c$
:::

橙色的弦连接曲线在$x=-2$和$x=2.5$处的两点，斜率是$1.125$。拖动$c$，让绿色:term[切线]{id="math.calculus.tangent-line"}和橙色的弦平行：在$c\approx-1.32$和$c\approx1.32$两处都能做到，满足:term[中值定理]{id="math.calculus.mean-value-theorem"}的$\xi$有两个。

## 例题

### 例 1　正弦的差不超过自变量的差

证明：对任意实数$a$、$b$，$|\sin b-\sin a|\le|b-a|$。

**为什么想到这么做**：要比较的是函数值的差和自变量的差，正是:term[中值定理]{id="math.calculus.mean-value-theorem"}两边的东西；$(\sin x)'=\cos x$的绝对值不超过$1$。

**推导**：$a=b$时显然。$a\ne b$时，$\sin x$在以$a$、$b$为端点的区间上:term[连续]{id="math.calculus.continuous"}、:term[可导]{id="math.calculus.differentiable"}，由拉格朗日中值定理，有介于$a$、$b$之间的$\xi$，使$\sin b-\sin a=\cos\xi\,(b-a)$。所以$|\sin b-\sin a|=|\cos\xi|\,|b-a|\le|b-a|$。取$a=0$，就得到$|\sin x|\le|x|$。

### 例 2　对数的上下界

证明：$x>0$时，$\frac x{1+x}<\ln(1+x)<x$。

**为什么想到这么做**：$\ln(1+x)=\ln(1+x)-\ln1$是$\ln t$在$[1,1+x]$上的增量，用:term[中值定理]{id="math.calculus.mean-value-theorem"}写成$\frac1\xi\cdot x$；$\xi$在$1$和$1+x$之间，$\frac1\xi$就夹在$\frac1{1+x}$和$1$之间。

**推导**：$\ln t$在$[1,1+x]$上:term[连续]{id="math.calculus.continuous"}、:term[可导]{id="math.calculus.differentiable"}，由中值定理，有$\xi\in(1,1+x)$，使$\ln(1+x)-\ln1=\frac1\xi\cdot x$。因为$1<\xi<1+x$，所以$\frac1{1+x}<\frac1\xi<1$，乘以$x>0$即得$\frac x{1+x}<\ln(1+x)<x$。

## 常见误区

- 「:term[中值定理]{id="math.calculus.mean-value-theorem"}里的$\xi$是区间的中点。」$x^3$在$[0,1]$上，弦的斜率是$1$，$3\xi^2=1$给出$\xi=\frac1{\sqrt3}\approx0.577$，不是$0.5$；「中值」只是「中间某个值」。
- 「定义域上处处$f'(x)=0$，$f$就是常数。」定义域要是一个区间；$x<0$时取$0$、$x>0$时取$1$的函数是反例。
- 「:term[罗尔定理]{id="math.calculus.rolle-theorem"}的条件少一个也没关系，两端一样高，中间总有水平:term[切线]{id="math.calculus.tangent-line"}。」$|x|$在$[-1,1]$上两端一样高，却没有水平切线。

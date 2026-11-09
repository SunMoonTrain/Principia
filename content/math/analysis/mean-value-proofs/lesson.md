---
id: math.analysis.mean-value-proofs
title: |
  中值定理的证明
goal: |
  会用最值定理证明罗尔定理，再推出拉格朗日中值定理和柯西中值定理。
prerequisites: [math.analysis.differentiability, math.analysis.extreme-value, math.calculus.mean-value-theorem]
minutes: 27
summary: |
  最值定理加费马定理得罗尔定理，再推出拉格朗日、柯西中值定理。
status: reviewed
---

## 这一节要回答的问题

微积分里的:term[拉格朗日中值定理]{id="math.analysis.mean-value-theorem"}（mean value theorem）说：$f$在$[a,b]$上:term[连续]{id="math.analysis.continuous-function"}（continuous）、在$(a,b)$内:term[可导]{id="math.analysis.differentiable-function"}（differentiable），就有$\xi\in(a,b)$使$f'(\xi)=\frac{f(b)-f(a)}{b-a}$。画成图，是说某一点的切线和连接两个端点的弦平行，看上去理所当然。

可这个$\xi$是从哪里来的？证明它存在，要用到前面哪一条定理？

## 讲解

### 费马定理

::anchor{id="def-local-extremum"}
设$f$在$c$的某个:term[邻域]{id="math.analysis.neighborhood"}（neighborhood）里有定义。如果这个邻域里的$x$都满足$f(x)\le f(c)$，就说$f$在$c$处取到极大值；把不等号反过来，就是极小值。这里要紧的是「某个邻域」：$c$两边都有定义域里的点。

::anchor{id="thm-fermat"}
**定理 1**　设$f$在$c$处取到极大值或极小值，并且$f$在$c$处:term[可导]{id="math.analysis.differentiable-function"}，则$f'(c)=0$。这叫作:term[费马定理]{id="math.analysis.fermat-theorem"}（Fermat's theorem）。

**证明**：设$f$在$c$处取到极大值，$f(x)\le f(c)$对$c$的某个邻域里的$x$成立。$h>0$且足够小时，差商（difference quotient）$\frac{f(c+h)-f(c)}{h}\le0$。:term[保不等式性]{id="math.analysis.order-limit-theorem"}（order limit theorem）借:term[海涅定理]{id="math.analysis.heine-theorem"}（Heine's theorem）可以搬到:term[函数的极限]{id="math.analysis.function-limit"}（limit of a function）上，所以右导数（right derivative）不超过$0$。$h<0$时差商$\ge0$，同理左导数（left derivative）不小于$0$。

$f$在$c$处可导，左、右导数都等于$f'(c)$，所以$f'(c)=0$。极小值的情形，对$-f$用同样的论证。

为什么要「某个邻域」：$c$只有一边有点时，差商只有一个方向，推不出$f'(c)=0$。$f(x)=x$在$[0,1]$上，最大值在端点$1$处取到，$f'(1)=1$。反过来也不成立：$x^3$在$0$处导数为$0$，却不是极值点。

### 罗尔定理

::anchor{id="thm-rolle"}
**定理 2**　设$f$在$[a,b]$上:term[连续]{id="math.analysis.continuous-function"}，在$(a,b)$内:term[可导]{id="math.analysis.differentiable-function"}，并且$f(a)=f(b)$，则有$\xi\in(a,b)$使$f'(\xi)=0$。这叫作:term[罗尔定理]{id="math.analysis.rolle-theorem"}（Rolle's theorem）。

**证明**：由:term[最值定理]{id="math.analysis.extreme-value-theorem"}（extreme value theorem），$f$在$[a,b]$上取到最大值$M$和最小值$m$。若$M=m$，$f$是常数，$(a,b)$里每一点的导数都是$0$。否则$M$、$m$中至少有一个不等于$f(a)=f(b)$，不妨设$M>f(a)$，那么最大值点$\xi$不是端点，$\xi\in(a,b)$。

$\xi$在开区间里，有一个:term[邻域]{id="math.analysis.neighborhood"}整个落在$[a,b]$里，$f(\xi)=M$是这个邻域里的最大值，所以$f$在$\xi$处取到极大值。$f$在$\xi$处可导，由:term[费马定理]{id="math.analysis.fermat-theorem"}，$f'(\xi)=0$。

三个条件各用在一处，缺一个都不行。在$[0,1]$上，$f(x)=x$（$x<1$）、$f(1)=0$，两端相等、在$(0,1)$内可导，却在端点$1$处不连续，导数处处是$1$；$|x|$在$[-1,1]$上连续、两端相等，却在$0$处不可导；$x$在$[0,1]$上两端不相等。:term[实数的完备性]{id="math.analysis.real-completeness"}（completeness of the real numbers）藏在最值定理里：没有它，连最大值点$\xi$都找不到。

### 拉格朗日中值定理

::anchor{id="thm-mean-value"}
**定理 3**　设$f$在$[a,b]$上:term[连续]{id="math.analysis.continuous-function"}，在$(a,b)$内:term[可导]{id="math.analysis.differentiable-function"}，则有$\xi\in(a,b)$使$f'(\xi)=\frac{f(b)-f(a)}{b-a}$。这就是:term[拉格朗日中值定理]{id="math.analysis.mean-value-theorem"}。

**证明**：记$k=\frac{f(b)-f(a)}{b-a}$，令$g(x)=f(x)-\bigl[f(a)+k(x-a)\bigr]$。$g$在$[a,b]$上连续、在$(a,b)$内可导，$g(a)=0$，$g(b)=f(b)-f(a)-k(b-a)=0$。由:term[罗尔定理]{id="math.analysis.rolle-theorem"}，有$\xi\in(a,b)$使$g'(\xi)=f'(\xi)-k=0$。

为什么想到这么做：方括号里是连接两个端点的弦所在的直线。从$f$里减去它，两端就都变成$0$，正好符合罗尔定理的条件；而减去一条斜率为$k$的直线，导数恰好少了$k$。几何上，这是把整个图形「扶正」，让弦变成水平的。

### 柯西中值定理

::anchor{id="thm-cauchy-mean-value"}
**定理 4**　设$f$、$g$在$[a,b]$上:term[连续]{id="math.analysis.continuous-function"}，在$(a,b)$内:term[可导]{id="math.analysis.differentiable-function"}，并且$g'(x)\ne0$对$(a,b)$里的$x$都成立，则有$\xi\in(a,b)$使$\frac{f(b)-f(a)}{g(b)-g(a)}=\frac{f'(\xi)}{g'(\xi)}$。这叫作:term[柯西中值定理]{id="math.analysis.cauchy-mean-value-theorem"}（Cauchy's mean value theorem）。

**证明**：先说明分母不为零：若$g(b)=g(a)$，由:term[罗尔定理]{id="math.analysis.rolle-theorem"}，有一点使$g'=0$，和条件矛盾。记$k=\frac{f(b)-f(a)}{g(b)-g(a)}$，令$h(x)=f(x)-f(a)-k\bigl(g(x)-g(a)\bigr)$，则$h(a)=h(b)=0$。由罗尔定理，有$\xi\in(a,b)$使$h'(\xi)=f'(\xi)-kg'(\xi)=0$，两边除以$g'(\xi)\ne0$即得。

取$g(x)=x$，它就是:term[拉格朗日中值定理]{id="math.analysis.mean-value-theorem"}。把$\bigl(g(t),f(t)\bigr)$看成平面上一条曲线上的点，它说的是：曲线上某一点的切线，和连接两个端点的弦平行。它最常见的用处是证明洛必达法则（L'Hôpital's rule），见[洛必达法则](lesson:math.calculus.lhopital)。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-1.3, 2.1], y: [-3, 7.5] }
functions:
  - expr: "x^3"
    label: |
      $y=x^3$
  - expr: "-1 + (b^2 - b + 1) * (x + 1)"
    label: |
      弦
  - expr: "3 * ((b^2 - b + 1) / 3) * (x - sqrt((b^2 - b + 1) / 3)) + sqrt((b^2 - b + 1) / 3)^3"
    label: |
      在$\xi_1$处的切线
  - expr: "3 * ((b^2 - b + 1) / 3) * (x + sqrt((b^2 - b + 1) / 3)) - sqrt((b^2 - b + 1) / 3)^3"
    label: |
      在$\xi_2$处的切线
points:
  - { x: "-1", y: "-1" }
  - { x: "b", y: "b^3" }
  - { x: "sqrt((b^2 - b + 1) / 3)", y: "sqrt((b^2 - b + 1) / 3)^3" }
  - { x: "-sqrt((b^2 - b + 1) / 3)", y: "-sqrt((b^2 - b + 1) / 3)^3" }
sliders:
  - name: b
    min: 0.6
    max: 1.9
    step: 0.05
    default: 1.5
    label: |
      右端点$b$
:::

区间是$[-1,b]$，弦的斜率是$\frac{b^3+1}{b+1}=b^2-b+1$。$3\xi^2=b^2-b+1$有两个解$\xi_{1,2}=\pm\sqrt{\frac{b^2-b+1}{3}}$，滑块取的范围里两个都在$(-1,b)$内，两条切线都和弦平行。:term[拉格朗日中值定理]{id="math.analysis.mean-value-theorem"}只保证至少有一个$\xi$，不保证唯一，也不告诉你它在哪里。

![左：y = x³ 在 [0, 1.5] 上，ξ 处的切线平行于弦；右：减去弦以后的 g = x³ − 2.25x，两端为 0，ξ 处切线水平](chord-tangent.svg)

这是定理 3 的证明。左边$f(x)=x^3$，弦的斜率是$\frac{1.5^3-0}{1.5-0}=2.25$，$\xi=\sqrt{0.75}$处的切线和它平行。右边是减去弦以后的$g(x)=x^3-2.25x$：两端都是$0$，最小值点就是同一个$\xi$，那里的切线水平，这正是:term[罗尔定理]{id="math.analysis.rolle-theorem"}给出的点。

## 例题

### 例 1　导数恒为零的函数是常数

设$f$在区间$I$上:term[可导]{id="math.analysis.differentiable-function"}，并且$f'(x)=0$对$I$里的$x$都成立。证明$f$在$I$上是常数。

**为什么想到这么做**：要比较两点的函数值，又只知道导数，正是:term[拉格朗日中值定理]{id="math.analysis.mean-value-theorem"}管的事：它把两点的函数值之差，换成某一点的导数乘以距离。

**推导**：任取$I$里的$x<y$。$f$在$[x,y]$上可导，也就:term[连续]{id="math.analysis.continuous-function"}，由拉格朗日中值定理，有$\xi\in(x,y)$使$f(y)-f(x)=f'(\xi)(y-x)=0$。所以任意两点的函数值都相等，$f$是常数。

「区间」不能少：在$(-\infty,0)\cup(0,+\infty)$上令$f(x)=\operatorname{sgn}x$，它处处可导、导数恒为$0$，却不是常数。同样的办法还能证明：$f'>0$时$f$严格递增，$|f'|\le M$时$|f(x)-f(y)|\le M|x-y|$。

### 例 2　用中值定理估计$b^n-a^n$

设$0<a<b$，正整数$n\ge2$。证明$na^{n-1}(b-a)<b^n-a^n<nb^{n-1}(b-a)$。

**为什么想到这么做**：$\frac{b^n-a^n}{b-a}$是$x^n$在$[a,b]$上的割线斜率。:term[拉格朗日中值定理]{id="math.analysis.mean-value-theorem"}把它换成$n\xi^{n-1}$，$\xi$虽然不知道在哪，却知道夹在$a$和$b$之间，这就够了。

**推导**：$x^n$在$[a,b]$上:term[可导]{id="math.analysis.differentiable-function"}，由拉格朗日中值定理，有$\xi\in(a,b)$使$b^n-a^n=n\xi^{n-1}(b-a)$。$0<a<\xi<b$，$n-1\ge1$，所以$a^{n-1}<\xi^{n-1}<b^{n-1}$，乘以正数$n(b-a)$即得。例如$a=1$、$b=1.01$、$n=10$时，$0.1<1.01^{10}-1<0.1\times1.01^9\approx0.1094$。

## 常见误区

- 「中值定理里的$\xi$只有一个。」不对：前面的动画里，$x^3$在$[-1,b]$上有两个$\xi$。:term[拉格朗日中值定理]{id="math.analysis.mean-value-theorem"}只说至少有一个。
- 「:term[罗尔定理]{id="math.analysis.rolle-theorem"}只要$f(a)=f(b)$，再在$(a,b)$内:term[可导]{id="math.analysis.differentiable-function"}就行。」不对，还要在闭区间$[a,b]$上:term[连续]{id="math.analysis.continuous-function"}：$f(x)=x$（$0\le x<1$）、$f(1)=0$满足另外两条，导数却处处是$1$。
- 「$f'(c)=0$，$c$就是极值点。」不对：$x^3$在$0$处导数为$0$，左右两边一边小、一边大。:term[费马定理]{id="math.analysis.fermat-theorem"}只说极值点处导数为$0$，反过来不成立。
- 「:term[柯西中值定理]{id="math.analysis.cauchy-mean-value-theorem"}就是对$f$、$g$分别用拉格朗日中值定理，再相除。」不对：那样得到的是两个不同的$\xi$（第 7 题）。

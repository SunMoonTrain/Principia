---
id: math.calculus.monotonicity
title: |
  单调性与极值的判别
goal: |
  会用导数的符号判断函数的单调区间，并用一阶导数判别极值。
prerequisites: [math.calculus.mean-value-theorem]
minutes: 28
summary: |
  $f'>0$的区间上$f$严格递增，$f'<0$的区间上严格递减；$f'$变号处是极值点。
status: reviewed
---

## 这一节要回答的问题

[微分中值定理](lesson:math.calculus.mean-value-theorem)第 8 题说过：区间上处处$f'>0$，$f$就严格递增。怎样用:term[导数]{id="math.calculus.derivative"}（derivative）的正负，找出函数在哪些区间上增、哪些区间上减？找到:term[驻点]{id="math.calculus.stationary-point"}（stationary point）以后，怎样判断它是不是:term[极值点]{id="math.calculus.extremum-point"}（extremum point），是极大还是极小？

## 讲解

### 递增与递减

$x^2$在$(-\infty,0]$上越来越小，在$[0,+\infty)$上越来越大。说一个函数「增」还是「减」，要说在哪个区间上。

::anchor{id="def-monotonic"}
设$f$在区间$I$上有定义。如果对$I$里任意$x_1<x_2$都有$f(x_1)\le f(x_2)$，就说$f$在$I$上递增（increasing）；如果都有$f(x_1)<f(x_2)$，就说严格递增（strictly increasing）。把不等号反过来，就是递减（decreasing）和严格递减（strictly decreasing）。递增、递减统称单调（monotonic），严格递增、严格递减统称严格单调。

为什么这样定义：和:term[极值]{id="math.calculus.local-extremum"}（local extremum）的定义一样用不严格的不等号（见[极值与费马定理](lesson:math.calculus.local-extrema#def-local-extremum)），常数函数既递增又递减，下面的定理也说得最干净；要排除常数段时说「严格」。中学课本的「单调递增」就是这里的严格递增。边界情况：单调是对一个区间说的。$\frac1x$在$(-\infty,0)$和$(0,+\infty)$上都严格递减，在两段合起来的集合上却不是：$-1<1$，而$\frac1{-1}<\frac11$。

### 用导数判断单调性

::anchor{id="thm-monotonic-derivative"}
**定理**　设$f$在区间$I$上:term[连续]{id="math.calculus.continuous"}（continuous），在$I$的内部:term[可导]{id="math.calculus.differentiable"}（differentiable）。（1）$f$在$I$上递增，当且仅当$I$的内部处处$f'(x)\ge0$。（2）如果$I$的内部处处$f'(x)>0$，那么$f$在$I$上严格递增。把不等号反过来，就是递减的情形。

道理：任取$I$里的$x_1<x_2$，由:term[中值定理]{id="math.calculus.mean-value-theorem"}（mean value theorem），$f(x_2)-f(x_1)=f'(\xi)(x_2-x_1)$，$\xi$在两点之间。$f'>0$时右边为正，$f'\ge0$时右边不为负。反过来，$f$递增时，不管$h$是正是负，:term[差商]{id="math.calculus.difference-quotient"}（difference quotient）$\frac{f(x+h)-f(x)}h$都不为负，它的:term[极限]{id="math.calculus.limit"}（limit，lim）$f'(x)$也不为负。

边界情况：（2）反过来不成立，$x^3$在$\R$上严格递增，可$f'(0)=0$。准确的说法是：$f'\ge0$，并且在任何一小段区间上都不恒为$0$，$f$就严格递增。因为递增的$f$如果有$f(x_1)=f(x_2)$，它在$[x_1,x_2]$上就是常数，$f'$在这一段上恒为$0$。

定理要求$I$是区间。$-\frac1x$的:term[导数]{id="math.calculus.derivative"}$\frac1{x^2}$处处为正，可$-\frac1x$在它的定义域上不递增，原因和上面的$\frac1x$一样：定义域断成了两段。

### 单调区间

::anchor{id="def-monotonic-interval"}
$f$在其上严格单调的区间，叫作$f$的单调区间（interval of monotonicity）。

为什么这样定义：画图、求:term[极值]{id="math.calculus.local-extremum"}、解不等式，都要先知道函数在哪里升、在哪里降。边界情况：两个单调区间不能随手并起来写。$x^3-3x$在$(-\infty,-1]$上和$[1,+\infty)$上都严格递增，可$f(-1)=2>-2=f(1)$，它在两段的并集上不递增。

求单调区间，先找出$f'(x)=0$的点和$f'$不存在的点，它们把定义域分成几段。在相邻两个分界点之间，$f'$存在、又不为$0$，所以不变号：:term[导函数]{id="math.calculus.derivative-function"}（derivative function）有介值性（intermediate value property），变号就要经过$0$（见[极值与费马定理](lesson:math.calculus.local-extrema)第 5 题）。每一段里任取一点看$f'$的正负，就知道$f$在这一段上严格递增还是严格递减（例 1、例 2）。

### 一阶导数判别法

[极值与费马定理](lesson:math.calculus.local-extrema)说过，:term[极值点]{id="math.calculus.extremum-point"}只能是:term[驻点]{id="math.calculus.stationary-point"}或不可导的点。是不是极值点，看$f'$在它两侧变不变号。

::anchor{id="thm-first-derivative-test"}
**定理（:term[一阶导数判别法]{id="math.calculus.first-derivative-test"}，first derivative test）**　设$f$在$x_0$处:term[连续]{id="math.calculus.continuous"}，在$x_0$附近（$x_0$本身可以除外）:term[可导]{id="math.calculus.differentiable"}。（1）如果$x_0$左侧附近$f'>0$、右侧附近$f'<0$，那么$f(x_0)$是:term[极大值]{id="math.calculus.local-maximum"}（local maximum）。（2）左侧$f'<0$、右侧$f'>0$，$f(x_0)$是:term[极小值]{id="math.calculus.local-minimum"}（local minimum）。（3）两侧$f'$同号，$x_0$不是:term[极值点]{id="math.calculus.extremum-point"}。

道理：（1）取一小段$[x_0-\delta,x_0+\delta]$，$f$在上面连续。左半段内部$f'>0$，$f$在$[x_0-\delta,x_0]$上严格递增，$f(x)<f(x_0)$；右半段严格递减，同样$f(x)<f(x_0)$。（2）同理；（3）两侧同号时$f$在整段上严格单调，$x_0$附近既有比$f(x_0)$大的值，也有比它小的值。

边界情况：$f$在$x_0$处连续不能少。$x\ne0$时取$x^2$、$f(0)=1$的函数，$f'$在$0$左侧为负、右侧为正，可$f(0)=1$比附近的值都大，$0$是极大值点。$x_0$处可以不可导：$|x|$在$0$处不可导，两侧:term[导数]{id="math.calculus.derivative"}左负右正，$0$是极小值点。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-2.2, 2.2], y: [-4, 4] }
functions:
  - expr: "x^3/3 + a*x"
    label: |
      $y=f(x)=\frac{x^3}3+ax$
  - expr: "x^2 + a"
    label: |
      $y=f'(x)=x^2+a$
sliders:
  - name: a
    min: -2
    max: 1
    step: 0.1
    default: -1
    label: |
      $a$
:::

蓝色是$f(x)=\frac{x^3}3+ax$，橙色是它的:term[导函数]{id="math.calculus.derivative-function"}$f'(x)=x^2+a$。橙色曲线在横轴上方的地方，蓝色曲线上升；在横轴下方的地方，蓝色曲线下降。$a<0$时$f'$在$\pm\sqrt{-a}$处变号，$f$在$-\sqrt{-a}$处取:term[极大值]{id="math.calculus.local-maximum"}、在$\sqrt{-a}$处取:term[极小值]{id="math.calculus.local-minimum"}。$a=0$时$f'(0)=0$而两侧都为正，$0$是:term[驻点]{id="math.calculus.stationary-point"}、不是:term[极值点]{id="math.calculus.extremum-point"}；$a>0$时$f'>0$，$f$在整条数轴上严格递增。

## 例题

### 例 1　驻点不一定是极值点

求$f(x)=x^4-4x^3$的单调区间和:term[极值]{id="math.calculus.local-extremum"}。

**为什么想到这么做**：$f$处处:term[可导]{id="math.calculus.differentiable"}，分界点只有:term[驻点]{id="math.calculus.stationary-point"}；在每一段上看$f'$的正负，再用:term[一阶导数判别法]{id="math.calculus.first-derivative-test"}看驻点两侧变不变号。

**推导**：$f'(x)=4x^3-12x^2=4x^2(x-3)$，驻点是$0$和$3$。$x<0$和$0<x<3$时$f'<0$，$x>3$时$f'>0$。$f'$只在孤立的点$0$处为$0$，所以$f$在$(-\infty,3]$上严格递减，在$[3,+\infty)$上严格递增。$0$两侧$f'$都为负，不是:term[极值点]{id="math.calculus.extremum-point"}；$3$左负右正，是极小值点，:term[极小值]{id="math.calculus.local-minimum"}是$f(3)=-27$。

### 例 2　$\frac{\ln x}x$的最高点

求$f(x)=\frac{\ln x}x$（$x>0$）的单调区间和:term[极值]{id="math.calculus.local-extremum"}。

**为什么想到这么做**：定义域是$(0,+\infty)$，用:term[商法则]{id="math.calculus.quotient-rule"}（quotient rule）求$f'$，它的正负只看分子。

**推导**：$f'(x)=\frac{\frac1x\cdot x-\ln x}{x^2}=\frac{1-\ln x}{x^2}$。$0<x<e$时$\ln x<1$，$f'>0$；$x>e$时$f'<0$。所以$f$在$(0,e]$上严格递增，在$[e,+\infty)$上严格递减；$e$是极大值点，:term[极大值]{id="math.calculus.local-maximum"}是$\frac1e$。它也是$f$在整个定义域上的最大值：$x\ne e$时都有$\frac{\ln x}x<\frac1e$。

## 常见误区

- 「单调区间的分界点只有:term[驻点]{id="math.calculus.stationary-point"}。」不可导的点也可能是：$|x^2-1|$在$\pm1$处不可导，单调性在那里也会改变。
- 「$f'(x_0)>0$，所以$f$在$x_0$附近递增。」定理要的是一整个区间上$f'>0$，只知道一点的:term[导数]{id="math.calculus.derivative"}为正不够（第 7 题）。
- 「:term[极值点]{id="math.calculus.extremum-point"}两侧的导数一定一正一负。」常数函数的每一点都是极值点，两侧导数都是$0$；按这里的定义，极值点两侧$f'$不一定变号。

---
id: math.calculus.derivative
title: |
  导数的定义
goal: |
  会用差商的极限求导数，并把导数解释成切线的斜率和瞬时变化率。
prerequisites: [math.calculus.continuity]
minutes: 30
summary: |
  导数是差商在$h\to0$时的极限：切线的斜率，也是瞬时变化率。
status: reviewed
---

## 这一节要回答的问题

汽车的速度表指着$60\,\mathrm{km/h}$，说的是「这一刻」的速度。可速度是路程除以时间，一个时刻里路程和时间都是零，$\frac00$怎么算？

圆的:term[切线]{id="math.calculus.tangent-line"}（tangent line）是和圆只碰一点的直线，一般曲线的切线又该怎样定义？这两个问题的答案是同一个:term[极限]{id="math.calculus.limit"}（limit，lim）。

## 讲解

### 平均变化率

自由下落的物体，$t$秒内落下$s(t)=4.9t^2$米。从$t=1$到$t=1+h$，平均速度是$\frac{s(1+h)-s(1)}{h}=\frac{4.9(2h+h^2)}{h}=4.9(2+h)$。$h$取$0.1$、$0.01$、$0.001$时，平均速度是$10.29$、$9.849$、$9.8049$米每秒，时间段越短，越靠近$9.8$。

::anchor{id="def-difference-quotient"}
设函数$y=f(x)$，自变量从$a$变到$a+h$（$h\ne0$），$h$叫作自变量的增量（increment），记作$\Delta x$，$\Delta y=f(a+h)-f(a)$叫作函数的增量。比值$\frac{\Delta y}{\Delta x}=\frac{f(a+h)-f(a)}{h}$叫作$f$在$a$和$a+h$之间的:term[差商]{id="math.calculus.difference-quotient"}（difference quotient），也叫平均变化率（average rate of change）。

为什么这样定义：差商是「$x$每变一个单位，$y$平均变多少」。路程对时间的差商是平均速度，曲线上它是过$(a,f(a))$和$(a+h,f(a+h))$两点的直线的斜率。边界情况：$h$可以是负数，这时区间是$[a+h,a]$；$h$不能是$0$，差商在那里没有定义。

### 导数

::anchor{id="def-derivative"}
如果$h\to0$时:term[差商]{id="math.calculus.difference-quotient"}$\frac{f(a+h)-f(a)}{h}$的:term[极限]{id="math.calculus.limit"}存在，就说$f$在$a$处:term[可导]{id="math.calculus.differentiable"}（differentiable），这个极限叫作$f$在$a$处的:term[导数]{id="math.calculus.derivative"}（derivative），记作$f'(a)$。导数也写成$\left.\dv{y}{x}\right|_{x=a}$，又叫$f$在$a$处的瞬时变化率（instantaneous rate of change）。

令$x=a+h$，定义也可以写成$f'(a)=\lim_{x\to a}\frac{f(x)-f(a)}{x-a}$。上面的下落物体，$s'(1)=\lim_{h\to0}4.9(2+h)=9.8$，$t=1$秒时的速度就是$9.8$米每秒。

为什么这样定义：时间段越来越短，平均速度趋于一个数，这个数才配叫「那一刻的速度」；对一般的函数，就是平均变化率在区间缩成一点时的极限。$f$在$a$处:term[连续]{id="math.calculus.continuous"}（continuous）时，差商的分子、分母都趋于$0$，这是一个:term[$\frac00$型]{id="math.calculus.zero-over-zero"}（indeterminate form 0/0）的极限，导数比的正是$\Delta y$和$\Delta x$趋于零的快慢。

边界情况：$|x|$在$0$处的差商是$\frac{|h|}{h}$，$h>0$时是$1$，$h<0$时是$-1$，没有极限，所以$|x|$在$0$处不可导。

::anchor{id="def-one-sided-derivative"}
$h\to0^+$时差商的极限叫作$f$在$a$处的右导数（right derivative），$h\to0^-$时的叫作左导数（left derivative）。

为什么要单侧导数：区间的端点只能从一侧算，图像上的尖点两侧走向不同。由[函数极限的直观](lesson:math.calculus.limits-intuition)里:term[单侧极限]{id="math.calculus.one-sided-limit"}（one-sided limit）的那条定理，$f$在$a$处可导，当且仅当左导数、右导数都存在并且相等；$|x|$在$0$处的右导数是$1$、左导数是$-1$。

### 切线

::anchor{id="def-secant"}
曲线$y=f(x)$上两点$P(a,f(a))$、$Q(a+h,f(a+h))$连成的直线，叫作曲线的:term[割线]{id="math.calculus.secant-line"}（secant line），它的斜率就是:term[差商]{id="math.calculus.difference-quotient"}$\frac{f(a+h)-f(a)}{h}$。

::anchor{id="def-tangent"}
如果$f$在$a$处:term[可导]{id="math.calculus.differentiable"}，过点$P(a,f(a))$、斜率为$f'(a)$的直线叫作曲线$y=f(x)$在$P$处的:term[切线]{id="math.calculus.tangent-line"}，它的方程是$y=f(a)+f'(a)(x-a)$。如果$f$在$a$处:term[连续]{id="math.calculus.continuous"}，并且$h\to0$时差商是:term[无穷大]{id="math.calculus.infinity"}（infinity），竖直线$x=a$也叫作曲线在$P$处的切线；$a$是区间的端点时只看一侧。

为什么这样定义：$Q$沿曲线滑向$P$时，割线绕着$P$转动，斜率趋于$f'(a)$，切线就是割线的:term[极限]{id="math.calculus.limit"}位置。定义的后一句是同一个道理：差商是无穷大，说明割线越来越陡，极限位置是竖直线。「只碰一点」不能当定义：$y=x^3$在原点的切线是$y=0$（$f'(0)=0$，下面会算），它穿过曲线；竖直线$x=1$和抛物线$y=x^2$只碰一点，却不是切线。对圆来说两种说法一致，所以中学里那样讲没有问题。

边界情况：$y=\sqrt[3]x$在$0$处的差商是$\frac{\sqrt[3]h}{h}=\frac{1}{\sqrt[3]{h^2}}$，是无穷大，所以不可导；按定义的后一句，曲线在原点的切线是竖直线$x=0$，它没有斜率。

### 导函数

::anchor{id="def-derivative-function"}
如果$f$在区间$I$内每一点都:term[可导]{id="math.calculus.differentiable"}，让每个$x\in I$对应$f'(x)$，就得到一个新的函数，叫作$f$的:term[导函数]{id="math.calculus.derivative-function"}（derivative function），简称导数，记作$f'$、$y'$、$\dv yx$或$\dv fx$。

为什么要导函数：每一点的:term[导数]{id="math.calculus.derivative"}都要从头算一遍:term[极限]{id="math.calculus.limit"}太麻烦，不如把$x$当作变量，一次算出所有点的导数，$f'(a)$就是导函数在$a$处的值。边界情况：$f'(a)$是先求导、再代入$a$，不是先算出常数$f(a)$再求导。

从定义直接算几个。常数的:term[差商]{id="math.calculus.difference-quotient"}是$0$，所以$(c)'=0$；$(x)'=1$。$\frac{(x+h)^2-x^2}{h}=2x+h\to2x$，所以$(x^2)'=2x$。$\frac{\frac1{x+h}-\frac1x}{h}=\frac{-1}{x(x+h)}\to-\frac1{x^2}$，所以$x\ne0$时$\bigl(\frac1x\bigr)'=-\frac1{x^2}$。

$n$是正整数时，由二项式定理，$(x+h)^n=x^n+nx^{n-1}h+h^2Q$，$Q$是关于$x$、$h$的多项式，所以差商是$nx^{n-1}+hQ$，$h\to0$时趋于$nx^{n-1}$，即$(x^n)'=nx^{n-1}$。比如$(x^3)'=3x^2$，$y=x^3$在原点的:term[切线]{id="math.calculus.tangent-line"}斜率是$0$。

### 可导与连续

::anchor{id="thm-differentiable-continuous"}
**定理**　$f$在$a$处:term[可导]{id="math.calculus.differentiable"}，则$f$在$a$处:term[连续]{id="math.calculus.continuous"}。

道理：$h\ne0$时$f(a+h)-f(a)=\frac{f(a+h)-f(a)}{h}\cdot h$，$h\to0$时右边趋于$f'(a)\cdot0=0$，所以$\lim_{h\to0}f(a+h)=f(a)$。反过来不成立：$|x|$和$\sqrt[3]x$在$0$处都连续，却不可导。换个方向说，不连续的点一定不可导，比如:term[跳跃间断点]{id="math.calculus.jump-discontinuity"}（jump discontinuity）处:term[差商]{id="math.calculus.difference-quotient"}的分子不趋于$0$。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-3, 3], y: [-2, 7] }
functions:
  - expr: "x^2"
    label: |
      $y=x^2$
  - expr: "a^2 + ((a + h)^2 - a^2)/h * (x - a)"
    label: |
      割线$PQ$
  - expr: "a^2 + 2*a*(x - a)"
    label: |
      $P$处的切线
points:
  - { x: "a", y: "a^2" }
  - { x: "a + h", y: "(a + h)^2" }
sliders:
  - name: a
    min: -1.5
    max: 1.5
    step: 0.1
    default: 1
    label: |
      $P$的横坐标$a$
  - name: h
    min: -0.95
    max: 0.95
    step: 0.1
    default: 0.75
    label: |
      增量$h$
:::

两个点是$P(a,a^2)$和$Q(a+h,(a+h)^2)$，橙色直线是:term[割线]{id="math.calculus.secant-line"}$PQ$，绿色直线是$P$处的:term[切线]{id="math.calculus.tangent-line"}，斜率是$2a$。把$h$往$0$拖，$Q$沿抛物线滑向$P$，割线绕着$P$转，越来越贴近切线；$h$取负数，$Q$从左边靠近，结果一样。滑块上$h$取不到$0$：那时$P$、$Q$重合，割线没有定义。

## 例题

### 例 1　从定义求$\sqrt x$的导数

求$f(x)=\sqrt x$的:term[导函数]{id="math.calculus.derivative-function"}（$x>0$），以及曲线在$x=4$处的:term[切线]{id="math.calculus.tangent-line"}。

**为什么想到这么做**：:term[差商]{id="math.calculus.difference-quotient"}$\frac{\sqrt{x+h}-\sqrt x}{h}$是:term[$\frac00$型]{id="math.calculus.zero-over-zero"}，分子有根式，乘上$\sqrt{x+h}+\sqrt x$有理化，就能约掉$h$。

**推导**：$\frac{\sqrt{x+h}-\sqrt x}{h}=\frac{(x+h)-x}{h(\sqrt{x+h}+\sqrt x)}=\frac{1}{\sqrt{x+h}+\sqrt x}$，$h\to0$时趋于$\frac1{2\sqrt x}$，所以$(\sqrt x)'=\frac1{2\sqrt x}$。$f(4)=2$，$f'(4)=\frac14$，切线是$y=2+\frac14(x-4)$，即$y=\frac x4+1$。$x=0$处只有右边，差商$\frac{\sqrt h}{h}=\frac1{\sqrt h}$是:term[无穷大]{id="math.calculus.infinity"}，不:term[可导]{id="math.calculus.differentiable"}，切线是竖直的$y$轴。

### 例 2　让分段函数可导

设

$$
f(x)=\begin{cases}x^2,&x\le1,\\ax+b,&x>1.\end{cases}
$$

$a$、$b$取什么值时，$f$在$x=1$处:term[可导]{id="math.calculus.differentiable"}？

**为什么想到这么做**：可导一定:term[连续]{id="math.calculus.continuous"}，所以先让两段在$x=1$处接上；再让左导数和右导数相等，两段在接口处的斜率一样。

**推导**：连续要求:term[右极限]{id="math.calculus.right-limit"}（right-hand limit）$a+b$等于$f(1)=1$，即$a+b=1$。左导数是$\lim_{h\to0^-}\frac{(1+h)^2-1}{h}=\lim_{h\to0^-}(2+h)=2$；用$a+b=1$，右导数是$\lim_{h\to0^+}\frac{a(1+h)+b-1}{h}=\lim_{h\to0^+}\frac{ah}{h}=a$。可导要求$a=2$，于是$b=-1$。如果不先保证连续，右边的:term[差商]{id="math.calculus.difference-quotient"}分子不趋于$0$，右导数根本不存在。

## 常见误区

- 「:term[切线]{id="math.calculus.tangent-line"}就是和曲线只有一个公共点的直线。」$y=x^3$在原点的切线$y=0$穿过曲线；竖直线$x=1$和抛物线$y=x^2$只有一个公共点，却不是切线。
- 「:term[连续]{id="math.calculus.continuous"}就:term[可导]{id="math.calculus.differentiable"}。」$|x|$在$0$处连续，左、右导数却不相等。
- 「$f'(a)$是常数$f(a)$的:term[导数]{id="math.calculus.derivative"}，所以总是$0$。」$f'(a)$是:term[导函数]{id="math.calculus.derivative-function"}在$a$处的值，先求导、再代入。
- 「导数不存在，就没有切线。」$\sqrt[3]x$在原点不可导，可它在那里有竖直的切线。

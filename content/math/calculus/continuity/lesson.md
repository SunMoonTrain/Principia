---
id: math.calculus.continuity
title: |
  连续与间断
goal: |
  会判断函数在一点是否连续，并区分可去间断点、跳跃间断点和无穷间断点。
prerequisites: [math.calculus.limit-laws]
minutes: 28
summary: |
  极限等于函数值就是连续；断开的点分可去、跳跃、无穷等几种。
status: reviewed
---

## 这一节要回答的问题

一天里的气温随时间变化，图像一笔就能画下来；按重量收费的邮费，到了某个重量就往上跳一级。「一笔画下来」用:term[极限]{id="math.calculus.limit"}（limit，lim）怎么说？图像断开的地方，又有几种断法？

## 讲解

### 连续的定义

::anchor{id="def-continuous"}
设$f$在$a$和它附近有定义。如果$\lim_{x\to a}f(x)=f(a)$，就说$f$在$a$处:term[连续]{id="math.calculus.continuous"}（continuous）。

为什么这样定义：这一个等式里有三件事：$f(a)$有定义，$x\to a$时的:term[极限]{id="math.calculus.limit"}存在，两者相等。合起来就是「$x$靠近$a$时，$f(x)$靠近$f(a)$」，图像在$(a,f(a))$处没有缺口、没有跳跃，一笔穿过。数学分析里把它写成能拿来证明的形式，见[连续函数的严格定义](lesson:math.analysis.continuity)。

反例：$\frac{x^2-4}{x-2}$在$2$处没有定义，所以不连续，尽管极限是$4$；补上$f(2)=4$，它就连续了，补成别的数仍不连续。$\frac{|x|}{x}$在$0$处的:term[左极限]{id="math.calculus.left-limit"}（left-hand limit）和:term[右极限]{id="math.calculus.right-limit"}（right-hand limit）不相等，$f(0)$定义成多少都不连续。

::anchor{id="def-one-sided-continuous"}
如果$\lim_{x\to a^-}f(x)=f(a)$，就说$f$在$a$处左连续（left-continuous）；如果$\lim_{x\to a^+}f(x)=f(a)$，就说右连续（right-continuous）。$f$在开区间$(a,b)$内每一点都连续，就说$f$在$(a,b)$上连续；如果它还在$a$处右连续、在$b$处左连续，就说$f$在闭区间$[a,b]$上连续。在区间上连续的函数叫作:term[连续函数]{id="math.calculus.continuous"}（continuous function）。

为什么要单侧连续：区间的端点只有一侧，比如$\sqrt x$在$0$处左边没有定义，只能要求右连续，它在$[0,+\infty)$上连续。边界情况：$\lfloor x\rfloor$（不超过$x$的最大整数）在每个整数处右连续、不左连续，所以它在$[0,1]$上不连续，在$[0,1)$上连续。

### 连续函数的运算

::anchor{id="thm-continuity-arithmetic"}
**定理 1**　$f$、$g$都在$a$处:term[连续]{id="math.calculus.continuous"}，则$f\pm g$、$fg$在$a$处连续；$g(a)\ne0$时，$\frac fg$也在$a$处连续。

这是:term[极限的四则运算法则]{id="math.calculus.limit-laws"}（limit laws）换了个说法：例如$\lim_{x\to a}[f(x)+g(x)]=f(a)+g(a)$。[极限的运算法则与夹逼定理](lesson:math.calculus.limit-laws)里的:term[代入法]{id="math.calculus.direct-substitution"}（direct substitution）说的也是这件事：多项式处处连续，有理函数在分母不为零的点连续。

::anchor{id="thm-composite-limit"}
**定理 2**　设$\lim_{x\to a}g(x)=b$，$\lim_{u\to b}f(u)=L$，并且在$a$附近（$x\ne a$）$g(x)\ne b$，那么$\lim_{x\to a}f(g(x))=L$。如果$f$在$b$处连续，不用要求$g(x)\ne b$，结论是$\lim_{x\to a}f(g(x))=f(b)$，即$\lim_{x\to a}f(g(x))=f\bigl(\lim_{x\to a}g(x)\bigr)$。

道理：$x$靠近$a$时$u=g(x)$靠近$b$，而$u$靠近$b$时$f(u)$靠近$L$。求:term[极限]{id="math.calculus.limit"}时把$g(x)$换成新的变量$u$，也就是换元，靠的就是这条定理。特别地，$g$在$a$处连续、$f$在$g(a)$处连续时，复合函数$f(g(x))$在$a$处连续。

为什么要求$g(x)\ne b$：设$u\ne0$时$f(u)=0$，$f(0)=1$，于是$\lim_{u\to0}f(u)=0$；取$g(x)=0$，则$f(g(x))=1$，极限是$1$，不是$0$。毛病出在$g(x)$一直等于$b$，正好落在$f$「不合群」的那一点上；$f$在$b$处连续时就没有这个问题。

### 初等函数的连续性

::anchor{id="def-elementary-function"}
幂函数、指数函数、对数函数、三角函数和反三角函数（比如$\arcsin x$，即$\sin x$在$\bigl[-\frac\pi2,\frac\pi2\bigr]$上的反函数）叫作基本初等函数（basic elementary function）。由常数和基本初等函数经过有限次四则运算和复合得到、能用一个式子表示的函数，叫作:term[初等函数]{id="math.calculus.elementary-function"}（elementary function）。

为什么起这个名字：中学里见过的函数几乎都是初等函数，比如$\frac{\sqrt{1+x^2}}{\ln x}$、$e^{\sin x}$，它们有一个共同的好性质，就是下面的定理 3。分段函数一般不是初等函数，因为要用几个式子表示；可$|x|=\sqrt{x^2}$是，它写得成一个式子。$\lfloor x\rfloor$不是初等函数。

::anchor{id="thm-elementary-continuous"}
**定理 3**　:term[初等函数]{id="math.calculus.elementary-function"}在它的定义域里的每个区间上都:term[连续]{id="math.calculus.continuous"}。

这里不证。基本初等函数的图像在定义域里都是不断开的曲线，再用定理 1、定理 2，就得到初等函数的连续性；基本初等函数的严格处理见数学分析的[用幂级数定义指数函数与对数](lesson:math.analysis.exp-log-construction)和[用幂级数定义三角函数与 π](lesson:math.analysis.trig-construction)。有了定理 3，在初等函数的定义区间内部求:term[极限]{id="math.calculus.limit"}只要代入，例如$\lim_{x\to0}\frac{e^x+\cos x}{1+x^2}=\frac{1+1}{1}=2$。

### 间断点

::anchor{id="def-discontinuity"}
设$f$在$a$附近有定义（$a$本身可以除外）。如果$f$在$a$处不:term[连续]{id="math.calculus.continuous"}，就说$a$是$f$的:term[间断点]{id="math.calculus.discontinuity"}（point of discontinuity）。

为什么这样定义：不连续是因为那三件事里至少有一件不成立，按哪一件出毛病，可以分成几类。要求$f$在$a$附近有定义，是为了只谈附近有图像、却在$a$处断开的点；$\sqrt x$在$x=-1$附近根本没有定义，$-1$就不是它的间断点。

::anchor{id="def-removable"}
如果$\lim_{x\to a}f(x)$存在，但$f(a)$没有定义或者不等于这个:term[极限]{id="math.calculus.limit"}，$a$叫作$f$的:term[可去间断点]{id="math.calculus.removable-discontinuity"}（removable discontinuity）。

为什么叫「可去」：把$f(a)$改成（或补成）那个极限，$a$就成了连续点，间断去掉了，比如$\frac{x^2-4}{x-2}$的$x=2$。只改一个函数值就能修好的间断点，只有这一种。

::anchor{id="def-jump"}
如果$f$在$a$处的:term[左极限]{id="math.calculus.left-limit"}、:term[右极限]{id="math.calculus.right-limit"}都存在但不相等，$a$叫作:term[跳跃间断点]{id="math.calculus.jump-discontinuity"}（jump discontinuity）。

为什么单列：两侧各有各的走向，只是接不上，改哪一个值都没用，比如$\lfloor x\rfloor$在每个整数处、$\frac{|x|}{x}$在$0$处。边界情况：$f(a)$可以等于其中一侧的极限，这时$f$在那一侧单侧连续，$a$仍是跳跃间断点。

::anchor{id="def-infinite-discontinuity"}
如果$x\to a^-$或$x\to a^+$时$f(x)$是:term[无穷大]{id="math.calculus.infinity"}（infinity），$a$叫作:term[无穷间断点]{id="math.calculus.infinite-discontinuity"}（infinite discontinuity）。

为什么单列：函数值冲向无穷，图像沿着竖线$x=a$往上或往下跑，比如$\frac1x$和$\frac1{(x-1)^2}$。这三类不是全部：$\sin\frac1x$在$0$处来回摆动，左、右极限都不存在，也不是无穷大，$0$是它的间断点，却不属于上面任何一类。

## 几何图像

![三幅小图。左图是一条上升的曲线，在 x = a 处挖成空心圆，正下方有一个实心点，下面写着可去间断点、极限存在但不等于 f(a)；中图左边一段直线停在 x = a 处的空心圆，右边一段从更高处的实心点出发，写着跳跃间断点、左右极限不相等；右图有一条竖直虚线 x = a，左边的曲线贴着它往下冲，右边的往上冲，写着无穷间断点、一侧趋于无穷大。](discontinuities.svg)

三幅图是三类常见的:term[间断点]{id="math.calculus.discontinuity"}。左图里$x\to a$时曲线趋于空心圆的高度，:term[极限]{id="math.calculus.limit"}存在，只是$f(a)$（实心点）不在那里，把实心点挪进空心圆就连上了。中图两段各自有终点，高度不同，挪哪个点都接不上。右图的函数值沿竖直虚线冲向无穷，没有可以挪进去的点。

## 例题

### 例 1　找出间断点并分类

找出$f(x)=\frac{x^2-x}{x^2-1}$的:term[间断点]{id="math.calculus.discontinuity"}，并说出每个是哪一类。

**为什么想到这么做**：$f$是:term[初等函数]{id="math.calculus.elementary-function"}，在定义域的区间上都:term[连续]{id="math.calculus.continuous"}，间断只可能出在没有定义的点，也就是分母的零点$x=\pm1$。在这两点分别求:term[极限]{id="math.calculus.limit"}，看属于哪一类。

**推导**：$x\ne\pm1$时$f(x)=\frac{x(x-1)}{(x-1)(x+1)}=\frac{x}{x+1}$。$x\to1$时它趋于$\frac12$，极限存在而$f(1)$没有定义，$x=1$是:term[可去间断点]{id="math.calculus.removable-discontinuity"}。$x\to-1$时$\frac{x}{x+1}$的分子趋于$-1$、分母趋于$0$，$|f(x)|$无限增大，$x=-1$是:term[无穷间断点]{id="math.calculus.infinite-discontinuity"}。

### 例 2　让分段函数连续

设

$$
f(x)=\begin{cases}x^2+a,&x<2,\\3x-a,&x\ge2.\end{cases}
$$

问$a$取什么值时，$f$处处:term[连续]{id="math.calculus.continuous"}？

**为什么想到这么做**：两段都是多项式，各自在自己的范围里连续，只有分段点$x=2$要检查。$f(2)=6-a$由右边一段给出，所以只要:term[左极限]{id="math.calculus.left-limit"}也等于它。

**推导**：:term[右极限]{id="math.calculus.right-limit"}$\lim_{x\to2^+}(3x-a)=6-a=f(2)$，左极限$\lim_{x\to2^-}(x^2+a)=4+a$。连续要求$4+a=6-a$，即$a=1$。$a\ne1$时左、右极限不相等，$x=2$是:term[跳跃间断点]{id="math.calculus.jump-discontinuity"}。

## 常见误区

- 「$f$在$a$处有定义、有:term[极限]{id="math.calculus.limit"}，就在$a$处:term[连续]{id="math.calculus.continuous"}。」还要两者相等：把$x^2$在$2$处的值改成$0$，有定义、有极限，却不连续。
- 「:term[间断点]{id="math.calculus.discontinuity"}处函数一定没有定义。」:term[跳跃间断点]{id="math.calculus.jump-discontinuity"}处可以有定义，比如$\lfloor x\rfloor$在整数处；:term[可去间断点]{id="math.calculus.removable-discontinuity"}处也可以有定义，只是值不对。
- 「$\frac1x$是不连续的函数。」它在定义域$(-\infty,0)\cup(0,+\infty)$的每个区间上都连续；$0$是它的间断点，但不在定义域里。说「$f$连续」时，要说清是在哪个区间上。
- 「分段函数在分段点一定间断。」两段接得上就连续，例 2 里$a=1$时就是。

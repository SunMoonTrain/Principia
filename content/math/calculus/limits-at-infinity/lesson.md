---
id: math.calculus.limits-at-infinity
title: |
  无穷远处的极限与渐近线
goal: |
  会求$x\to\infty$时函数的极限和数列的极限，并据此找出曲线的水平渐近线和竖直渐近线。
prerequisites: [math.calculus.limit-laws]
minutes: 28
summary: |
  $x$或$n$无限增大时看函数的走向；趋于定值给水平渐近线。
status: reviewed
---

## 这一节要回答的问题

$\frac{2x+1}{x-1}$在$x=10$、$100$、$1000$处的值约是$2.33$、$2.03$、$2.003$，$x$越大越靠近$2$，图像远处贴着一条水平线。数列$1,\frac12,\frac13,\dots$「趋于$0$」，说的也是同一种走向。$x$或$n$无限增大时的:term[极限]{id="math.calculus.limit"}（limit，lim）该怎样说、怎样求？

## 讲解

### $x\to\infty$时的极限

::anchor{id="def-limit-at-infinity"}
如果$x$无限增大时，$f(x)$无限接近一个确定的数$L$，就说$x\to+\infty$时$f(x)$的:term[极限]{id="math.calculus.limit"}是$L$，记作$\lim_{x\to+\infty}f(x)=L$。把「$x$无限增大」换成「$x<0$而$|x|$无限增大」，就得到$\lim_{x\to-\infty}f(x)=L$；两者都等于$L$时，记作$\lim_{x\to\infty}f(x)=L$。这些都叫作:term[无穷远处的极限]{id="math.calculus.limit-at-infinity"}（limit at infinity）。

为什么这样定义：意思和$x\to a$时一样，只是「$x$离$a$足够近」换成了「$x$足够大」：要$f(x)$和$L$相差多么小都行，只要$x$足够大。$x\to\infty$不分正负，就像$x\to a$要求两侧都靠近一样，它要求两个方向都靠近同一个$L$。

反例：$x\to+\infty$时$\sin x$在$-1$和$1$之间来回摆动，没有极限。$\arctan x$（$\tan x$在$\bigl(-\frac\pi2,\frac\pi2\bigr)$上的反函数）在$x\to+\infty$时趋于$\frac\pi2$，在$x\to-\infty$时趋于$-\frac\pi2$，所以$\lim_{x\to\infty}\arctan x$不存在。

$x\to\infty$时$|f(x)|$无限增大，照样叫:term[无穷大]{id="math.calculus.infinity"}（infinity），例如$\lim_{x\to+\infty}x^2=+\infty$。最基本的结论是$\lim_{x\to\infty}\frac1x=0$，进而$\lim_{x\to\infty}\frac{1}{x^k}=0$（$k$是正整数）；从图像还看得出$\lim_{x\to+\infty}2^{-x}=0$。[极限的运算法则与夹逼定理](lesson:math.calculus.limit-laws)里的:term[四则运算法则]{id="math.calculus.limit-laws"}（limit laws）、开方和:term[夹逼定理]{id="math.calculus.squeeze-theorem"}（squeeze theorem），对$x\to+\infty$、$x\to-\infty$都照样成立，道理一样。

### 有理函数在无穷远处

$\frac{3x^2-x}{2x^2+5}$的分子、分母都是:term[无穷大]{id="math.calculus.infinity"}，不能直接相除。分子、分母同除以$x^2$，得$\frac{3-\frac1x}{2+\frac5{x^2}}$，$x\to\infty$时分子趋于$3$、分母趋于$2$，所以:term[极限]{id="math.calculus.limit"}是$\frac32$。

::anchor{id="thm-rational-at-infinity"}
**定理**　设$p$、$q$是多项式，最高次项分别是$a_mx^m$、$b_kx^k$（$a_m\ne0$，$b_k\ne0$）。$x\to\infty$时：若$m<k$，$\frac{p(x)}{q(x)}\to0$；若$m=k$，$\frac{p(x)}{q(x)}\to\frac{a_m}{b_k}$；若$m>k$，$\frac{p(x)}{q(x)}$是:term[无穷大]{id="math.calculus.infinity"}。

道理：$m\le k$时，分子、分母同除以$x^k$，分母趋于$b_k$，分子趋于$0$（$m<k$）或$a_m$（$m=k$）。$m>k$时改为同除以$x^m$，分子趋于$a_m\ne0$，分母趋于$0$，由[极限的运算法则与夹逼定理](lesson:math.calculus.limit-laws#def-zero-over-zero)里讲过的边界情况，商是无穷大。说白了，$x$很大时起作用的只有最高次项。

### 数列的极限

数列$\{a_n\}$是只在正整数上有定义的函数，$a_n=f(n)$。$\frac1n$是$1,\frac12,\frac13,\dots$，越来越靠近$0$；$\frac{n}{n+1}$是$\frac12,\frac23,\frac34,\dots$，越来越靠近$1$；$(-1)^n$在$-1$和$1$之间来回跳。

::anchor{id="def-sequence-limit"}
设$\{a_n\}$是一个数列。如果$n$无限增大时，$a_n$无限接近一个确定的数$L$，就说$L$是:term[数列的极限]{id="math.calculus.sequence-limit"}（limit of a sequence），记作$\lim_{n\to\infty}a_n=L$，也写成$n\to\infty$时$a_n\to L$。这时数列叫作:term[收敛数列]{id="math.calculus.convergent-sequence"}（convergent sequence），也说它收敛于$L$；找不到这样的$L$的数列叫作:term[发散数列]{id="math.calculus.divergent-sequence"}（divergent sequence）。

为什么这样定义：数列只在正整数上有定义，没有「靠近某个$a$」可谈，只能看$n$足够大时的走向，和$x\to+\infty$是一回事。所以$1,\frac12,\frac13,\dots$收敛于$0$，$\{(-1)^n\}$发散；$a_n=n$也发散，记作$\lim_{n\to\infty}n=+\infty$，意思是它是:term[无穷大]{id="math.calculus.infinity"}。把「无限接近」写成能拿来证明的话，见数学分析的[数列的极限](lesson:math.analysis.sequences-limits)。

如果$a_n=f(n)$，并且$\lim_{x\to+\infty}f(x)=L$，那么$a_n\to L$：所有足够大的实数$x$都让$f(x)$靠近$L$，只取整数当然也靠近。反过来不行：$\sin(\pi n)=0$，数列收敛于$0$，可$\sin(\pi x)$在$x\to+\infty$时没有:term[极限]{id="math.calculus.limit"}。所以求$\frac{n^2+1}{3n^2}$这类数列的极限，可以当成函数来求，结果是$\frac13$。

### 渐近线

::anchor{id="def-horizontal-asymptote"}
如果$\lim_{x\to+\infty}f(x)=L$，或者$\lim_{x\to-\infty}f(x)=L$，就说直线$y=L$是曲线$y=f(x)$的:term[水平渐近线]{id="math.calculus.horizontal-asymptote"}（horizontal asymptote）。

::anchor{id="def-vertical-asymptote"}
如果$x\to a^+$或$x\to a^-$时$f(x)$是:term[无穷大]{id="math.calculus.infinity"}，就说直线$x=a$是曲线$y=f(x)$的:term[竖直渐近线]{id="math.calculus.vertical-asymptote"}（vertical asymptote）。

为什么这样定义：沿着这条直线往远处走，曲线和直线之间的距离要多小有多小，曲线贴着它延伸，画草图时先画出它们就有了骨架。一条曲线最多两条水平渐近线，对应$x\to+\infty$和$x\to-\infty$，比如$\arctan x$的$y=\pm\frac\pi2$。

边界情况：曲线可以穿过水平渐近线。$\frac{2x^2+x}{x^2+1}$在$x\to\infty$时趋于$2$，可它在$x=2$处正好等于$2$。分母的零点也不一定是竖直渐近线：$\frac{x^2-1}{x-1}$在$x=1$处只是缺一个点，$x\to1$时它趋于$2$，不是无穷大。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-6, 10], y: [-6, 8] }
functions:
  - expr: "(a*x + 1)/(x - 1)"
    label: |
      $y=\frac{ax+1}{x-1}$
  - expr: "a"
    label: |
      $y=a$
sequences:
  - expr: "(a*n + 1)/(n - 1)"
    n: [2, 10]
    label: |
      $a_n=\frac{an+1}{n-1}$
sliders:
  - name: a
    min: -2
    max: 3
    step: 0.5
    default: 2
    label: |
      系数$a$
:::

蓝色曲线是$y=\frac{ax+1}{x-1}$，橙色水平线是$y=a$。$x\to\pm\infty$时曲线贴向这条水平线，它是:term[水平渐近线]{id="math.calculus.horizontal-asymptote"}；竖线$x=1$没有画出，曲线在它两侧冲出画面，它是:term[竖直渐近线]{id="math.calculus.vertical-asymptote"}。绿色的点是数列$a_n=\frac{an+1}{n-1}$，正好落在曲线上，随曲线一起趋于$a$。把$a$拖到$-1$：分子变成$-(x-1)$，函数在$x\ne1$时恒等于$-1$，竖直渐近线消失了。

## 例题

### 例 1　无穷大减无穷大

求$\lim_{x\to+\infty}\bigl(\sqrt{x^2+4x}-x\bigr)$。

**为什么想到这么做**：两项都是:term[无穷大]{id="math.calculus.infinity"}，差的法则用不上。差是根式减去一项，乘上$\sqrt{x^2+4x}+x$再除回去，平方差会让$x^2$抵消。

**推导**：$x>0$时，$\sqrt{x^2+4x}-x=\frac{(x^2+4x)-x^2}{\sqrt{x^2+4x}+x}=\frac{4x}{\sqrt{x^2+4x}+x}$。分子、分母同除以$x$（$x>0$，$\frac{\sqrt{x^2+4x}}x=\sqrt{1+\frac4x}$），得$\frac{4}{\sqrt{1+\frac4x}+1}$。$x\to+\infty$时$\frac4x\to0$，分母趋于$2$，所以:term[极限]{id="math.calculus.limit"}是$2$。

### 例 2　找渐近线

求曲线$y=\frac{x^2+x-2}{x^2-4}$的:term[水平渐近线]{id="math.calculus.horizontal-asymptote"}和:term[竖直渐近线]{id="math.calculus.vertical-asymptote"}。

**为什么想到这么做**：水平渐近线看$x\to\pm\infty$，用最高次项。竖直渐近线只可能在分母的零点$x=\pm2$，但要先约分，看看是不是只缺一个点。

**推导**：分子、分母次数相同，最高次项系数都是$1$，$x\to\infty$时$y\to1$，水平渐近线是$y=1$。$x\ne\pm2$时$y=\frac{(x+2)(x-1)}{(x+2)(x-2)}=\frac{x-1}{x-2}$。$x\to2$时分子趋于$1$、分母趋于$0$，$y$是:term[无穷大]{id="math.calculus.infinity"}，$x=2$是竖直渐近线；$x\to-2$时$y\to\frac{-3}{-4}=\frac34$，只缺一个点，$x=-2$不是渐近线。

## 常见误区

- 「曲线不会穿过它的:term[水平渐近线]{id="math.calculus.horizontal-asymptote"}。」渐近线只管远处，近处可以穿过，甚至穿过无穷多次（第 7 题）。
- 「分母为零的点都是:term[竖直渐近线]{id="math.calculus.vertical-asymptote"}。」要先约分：例 2 里的$x=-2$只是缺一个点。
- 「$\lim_{x\to\infty}$只看$x\to+\infty$。」它要求两个方向趋于同一个数；$\arctan x$两个方向的:term[极限]{id="math.calculus.limit"}不同，$\lim_{x\to\infty}\arctan x$不存在。
- 「数列$a_n=f(n)$收敛，$\lim_{x\to+\infty}f(x)$就存在。」$\sin(\pi n)\equiv0$收敛，$\sin(\pi x)$却没有极限。

---
id: math.calculus.limit-laws
title: |
  极限的运算法则与夹逼定理
goal: |
  会用极限的四则运算法则和夹逼定理求函数的极限。
prerequisites: [math.calculus.limits-intuition]
minutes: 26
summary: |
  两个极限都存在时可以逐项加减乘除；拆不开的就上下夹逼。
status: reviewed
---

## 这一节要回答的问题

数值表只能帮我们猜:term[极限]{id="math.calculus.limit"}（limit，lim）。$\lim_{x\to2}\frac{x^3-3x}{x+1}$能不能不列表、一步步算出来？$x^2\sin\frac1x$里的$\sin\frac1x$在$x\to0$时没有极限，这个乘积的极限又怎么求？

## 讲解

### 两个最简单的极限

常数函数$y=c$的图像是一条水平线，所以$\lim_{x\to a}c=c$。$y=x$的图像是一条斜线，$x$靠近$a$时$y$就靠近$a$，所以$\lim_{x\to a}x=a$。下面的法则把复杂的:term[极限]{id="math.calculus.limit"}一步步拆成这两个。

### 四则运算法则

::anchor{id="thm-limit-laws"}
**:term[极限的四则运算法则]{id="math.calculus.limit-laws"}（limit laws）**　设$\lim_{x\to a}f(x)=A$，$\lim_{x\to a}g(x)=B$，$A$、$B$都是数。那么$\lim_{x\to a}[f(x)\pm g(x)]=A\pm B$，$\lim_{x\to a}f(x)g(x)=AB$；$B\ne0$时，$\lim_{x\to a}\frac{f(x)}{g(x)}=\frac AB$。

道理：$f$离$A$近、$g$离$B$近时，$f+g$到$A+B$的距离不超过两个距离之和，$|(f+g)-(A+B)|\le|f-A|+|g-B|$。乘积拆成$fg-AB=(f-A)g+A(g-B)$，$g$靠近$B$、跑不远，两项都能任意小（第 5 题）。商要求$B\ne0$：$g$靠近$B$时离$0$远远的，除以它不出事。严格的证明在数学分析里，先对数列证（[极限的四则运算与夹逼定理](lesson:math.analysis.limit-arithmetic)），再搬到函数（[函数极限的严格定义](lesson:math.analysis.function-limits)）。

为什么要求两个:term[极限]{id="math.calculus.limit"}都存在：法则说的是「已知两个极限，求它们组合的极限」，缺一个就无从算起。例如$x\to0$时$\frac1x-\frac1x=0$，极限是$0$，可$\frac1x$本身没有极限，不能拆成两项分别求；$x\cdot\frac1x=1$也一样。拆开以后得到「$\infty-\infty$」「$0\cdot\infty$」，这些都不是数。

反复用乘法和常数倍，就得到下面这条最常用的结论。

::anchor{id="thm-substitution"}
**:term[代入法]{id="math.calculus.direct-substitution"}（direct substitution）**　多项式$p(x)$满足$\lim_{x\to a}p(x)=p(a)$。$p$、$q$都是多项式、$q(a)\ne0$时，$\lim_{x\to a}\frac{p(x)}{q(x)}=\frac{p(a)}{q(a)}$。开方也一样：$f(x)\ge0$、$\lim_{x\to a}f(x)=A$时，$\lim_{x\to a}\sqrt{f(x)}=\sqrt A$。

前两句由四则运算法则逐项推出，比如$\lim_{x\to a}x^2=a\cdot a$。开方这一句这里不证，从$y=\sqrt x$的图像没有断开看得出来。于是$\lim_{x\to2}\frac{x^3-3x}{x+1}=\frac{8-6}{3}=\frac23$：分母在$2$处不为零，直接代入。

### $\frac00$型

$\lim_{x\to2}\frac{x^2-4}{x^2-3x+2}$不能这样算：分母在$2$处是零，商的法则用不上。分子在$2$处也是零，两者都有因式$x-2$；$x\ne2$时约掉它，$\frac{(x-2)(x+2)}{(x-2)(x-1)}=\frac{x+2}{x-1}$，再代入，得$4$。

::anchor{id="def-zero-over-zero"}
$x\to a$时分子、分母都趋于$0$的分式，叫作:term[$\frac00$型]{id="math.calculus.zero-over-zero"}（indeterminate form 0/0），它的:term[极限]{id="math.calculus.limit"}要先变形才能求。

为什么单起名字：:term[四则运算法则]{id="math.calculus.limit-laws"}对它不起作用，结果要看分子、分母谁趋于零得快。$x\to0$时，$\frac{x}{x}\to1$，$\frac{x^2}{x}\to0$，而$\frac{x}{x^2}=\frac1x$是:term[无穷大]{id="math.calculus.infinity"}（infinity）。常用的变形是约去公因式，以及含根式时乘共轭根式（有理化）。边界情况：分子靠近一个不为零的数、分母靠近$0$时不是$\frac00$型，这时$\left|\frac{f}{g}\right|$无限增大，比如$\frac{x+1}{x}$在$0$处。

### 夹逼定理

$x^2\sin\frac1x$拆不开：$\sin\frac1x$在$x\to0$时没有:term[极限]{id="math.calculus.limit"}，乘积的法则用不上。可是$|\sin\frac1x|\le1$，所以$-x^2\le x^2\sin\frac1x\le x^2$，它被两条都趋于$0$的抛物线夹在中间。

::anchor{id="thm-squeeze"}
**:term[夹逼定理]{id="math.calculus.squeeze-theorem"}（squeeze theorem）**　如果在$a$附近（$x=a$可以除外）总有$g(x)\le f(x)\le h(x)$，并且$\lim_{x\to a}g(x)=\lim_{x\to a}h(x)=L$，那么$\lim_{x\to a}f(x)=L$。

道理：$g(x)$和$h(x)$都离$L$任意近时，夹在它们中间的$f(x)$离$L$也不会更远。于是$\lim_{x\to0}x^2\sin\frac1x=0$。常用的特殊情形：$|f(x)|\le h(x)$且$h(x)\to0$，就有$f(x)\to0$，因为$-h\le f\le h$。

两个条件都不能少：没有不等式就谈不上夹；上下两条曲线不趋于同一个数也夹不住，比如$-1\le\sin\frac1x\le1$对极限什么都没说。另一方面，不等式只要在$a$附近成立，离$a$远的地方怎样都行。:term[单侧极限]{id="math.calculus.one-sided-limit"}（one-sided limit）也有同样的夹逼定理，不等式只要在那一侧成立。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-0.5, 0.5], y: [-1.2, 1.2] }
functions:
  - expr: "abs(x)^p * sin(1/x)"
    label: |
      $|x|^p\sin\frac1x$
  - expr: "abs(x)^p"
    label: |
      $|x|^p$
  - expr: "-abs(x)^p"
    label: |
      $-|x|^p$
sliders:
  - name: p
    min: 0
    max: 2
    step: 0.1
    default: 1
    label: |
      指数$p$
:::

蓝色曲线$|x|^p\sin\frac1x$在$0$附近摆动无穷多次，图上只能画出一团。它始终夹在$-|x|^p$和$|x|^p$之间。$p>0$时上下两条曲线都趋于$0$，由:term[夹逼定理]{id="math.calculus.squeeze-theorem"}，中间的曲线也趋于$0$；$p$越大，夹得越紧。把$p$拖到$0$，上下界变成$\pm1$，夹不住了，夹逼定理什么也说不出；而中间的$\sin\frac1x$在$0$处本来就没有:term[极限]{id="math.calculus.limit"}。

## 例题

### 例 1　有理化

求$\lim_{x\to4}\frac{\sqrt x-2}{x-4}$。

**为什么想到这么做**：$x=4$时分子、分母都是$0$，是:term[$\frac00$型]{id="math.calculus.zero-over-zero"}。分子有根式，乘上$\sqrt x+2$，平方差公式会让根式消失，同时冒出因式$x-4$，和分母约掉。

**推导**：$x\ne4$、$x\ge0$时，$\frac{\sqrt x-2}{x-4}=\frac{(\sqrt x-2)(\sqrt x+2)}{(x-4)(\sqrt x+2)}=\frac{x-4}{(x-4)(\sqrt x+2)}=\frac1{\sqrt x+2}$。由:term[代入法]{id="math.calculus.direct-substitution"}，$x\to4$时$\sqrt x+2\to4$，所以原式的:term[极限]{id="math.calculus.limit"}是$\frac14$。

### 例 2　夹逼

求$\lim_{x\to0^+}\sqrt x\cdot2^{\sin\frac1x}$。

**为什么想到这么做**：$2^{\sin\frac1x}$在$x\to0^+$时来回摆动，没有:term[极限]{id="math.calculus.limit"}，乘积的法则用不上。可$\sin\frac1x$在$-1$和$1$之间，$2^{\sin\frac1x}$就在$\frac12$和$2$之间，有界；前面的$\sqrt x$趋于$0$，正好用来夹。

**推导**：$x>0$时$\frac12\le2^{\sin\frac1x}\le2$，乘上$\sqrt x>0$，得$\frac12\sqrt x\le\sqrt x\cdot2^{\sin\frac1x}\le2\sqrt x$。$x\to0^+$时两边都趋于$0$，由:term[单侧极限]{id="math.calculus.one-sided-limit"}的:term[夹逼定理]{id="math.calculus.squeeze-theorem"}，所求的极限是$0$。

## 常见误区

- 「$\lim_{x\to a}[f(x)+g(x)]$存在，所以$\lim_{x\to a}f(x)$和$\lim_{x\to a}g(x)$都存在。」$\frac1x+\bigl(-\frac1x\bigr)=0$，和的:term[极限]{id="math.calculus.limit"}存在，两项的极限都不存在。
- 「$\lim_{x\to0}x\sin\frac1x=\lim_{x\to0}x\cdot\lim_{x\to0}\sin\frac1x=0$。」结果碰巧对，理由错：第二个极限不存在，乘积的法则用不上，要用:term[夹逼定理]{id="math.calculus.squeeze-theorem"}。
- 「:term[$\frac00$型]{id="math.calculus.zero-over-zero"}的极限是$1$（或$0$，或不存在）。」它可以是任何数，也可以不存在，要看具体的式子（第 7 题）。
- 「夹逼定理里的不等式要对所有$x$成立。」只要在$a$附近成立；离$a$远的地方怎样都行。

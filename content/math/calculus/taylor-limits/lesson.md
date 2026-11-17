---
id: math.calculus.taylor-limits
title: |
  用泰勒公式求极限
goal: |
  会用带佩亚诺余项的泰勒公式展开复合函数，并用它求不定式的极限、确定无穷小的阶。
prerequisites: [math.calculus.taylor-polynomial]
minutes: 26
summary: |
  把分子、分母展开到第一个不抵消的项，就能求出不定式的极限。
status: reviewed
---

## 这一节要回答的问题

求$\lim_{x\to0}\frac{\cos x-e^{-x^2/2}}{x^4}$，用:term[洛必达法则]{id="math.calculus.lhopital-rule"}（L'Hôpital's rule）要连求四次导，一次比一次繁。[无穷小的比较](lesson:math.calculus.infinitesimal-orders)说过，加减里的项不能随便换成:term[等价无穷小]{id="math.calculus.equivalent-infinitesimal"}（equivalent infinitesimal），却没说该怎么办。有了带:term[佩亚诺余项]{id="math.calculus.peano-remainder"}（Peano remainder）的:term[泰勒公式]{id="math.calculus.taylor-formula"}（Taylor's formula），能不能把分子、分母都写成「主要部分加:term[高阶无穷小]{id="math.calculus.higher-order-infinitesimal"}（higher-order infinitesimal）」，一眼看出:term[极限]{id="math.calculus.limit"}（limit，lim）？

## 讲解

### $o$的运算

$o(x^n)$不是一个确定的量，它代表「某个比$x^n$:term[高阶的无穷小]{id="math.calculus.higher-order-infinitesimal"}」。把几个展开式相加、相乘时，要知道这些$o$合起来是什么。

::anchor{id="thm-o-rules"}
**定理**　$x\to0$时，设$m$、$n$是正整数。（1）$m>n$时，$x^m$和$o(x^m)$都是$o(x^n)$。（2）$o(x^n)\pm o(x^n)=o(x^n)$，常数乘以$o(x^n)$还是$o(x^n)$。（3）$x^m\cdot o(x^n)=o(x^{m+n})$，$o(x^m)\cdot o(x^n)=o(x^{m+n})$。

道理：都从定义出发。比如（3），设$\frac\alpha{x^n}\to0$，则$\frac{x^m\alpha}{x^{m+n}}=\frac\alpha{x^n}\to0$；（1）里$\frac{o(x^m)}{x^n}=\frac{o(x^m)}{x^m}\cdot x^{m-n}\to0$。这些等式要从左往右读：「左边的量都是右边那一类」，[无穷小的比较](lesson:math.calculus.infinitesimal-orders)第 8 题用过其中几条。

边界情况：$o(x^n)-o(x^n)$不是$0$。两个$o(x^2)$可以是不同的量，$x^3-2x^3=-x^3$，它还是$o(x^2)$，却不是$0$。

### 展开复合函数

乘积：把两个展开式乘开，次数超过要保留的阶的项都并进$o$。例如保留到$x^3$：

$$
e^x\sin x=\Bigl(1+x+\frac{x^2}2+o(x^2)\Bigr)\Bigl(x-\frac{x^3}6+o(x^3)\Bigr)=x+x^2+\frac{x^3}3+o(x^3).
$$

复合：$e^{\sin x}$里，$u=\sin x=x-\frac{x^3}6+o(x^3)$趋于$0$，把它代进$e^u=1+u+\frac{u^2}2+\frac{u^3}6+o(u^3)$。$u^2=x^2+o(x^3)$，$u^3=x^3+o(x^3)$，$o(u^3)=o(x^3)$，合起来$e^{\sin x}=1+x+\frac{x^2}2+o(x^3)$，$x^3$项正好抵消了。商可以化成乘积：$\frac1{\cos x}=\frac1{1-v}$，$v=1-\cos x=\frac{x^2}2+o(x^3)$；由$\frac1{1-v}=1+v+v^2+o(v^2)$和$v^2=o(x^3)$，得$\frac1{\cos x}=1+\frac{x^2}2+o(x^3)$，于是$\tan x=\sin x\cdot\frac1{\cos x}=x+\frac{x^3}3+o(x^3)$。

::anchor{id="thm-taylor-unique"}
**定理**　设$f$在$0$处$n$阶可导。如果$x\to0$时$f(x)=P(x)+o(x^n)$，$P$是次数不超过$n$的多项式，那么$P$就是$f$的$n$阶:term[麦克劳林多项式]{id="math.calculus.maclaurin-polynomial"}（Maclaurin polynomial）。

道理：$f(x)=T_n(x)+o(x^n)$也成立，两式相减，$P(x)-T_n(x)=o(x^n)$。左边是次数不超过$n$的多项式，如果不是零多项式，设它最低的一项是$cx^k$，$c\ne0$，$k\le n$；除以$x^k$，左边趋于$c$，右边趋于$0$，矛盾。

为什么有用：不管用乘法、代入还是除法，只要得到「多项式加$o(x^n)$」，那个多项式就是麦克劳林多项式，系数乘以$k!$就是$k$阶导数。由$\tan x=x+\frac{x^3}3+o(x^3)$，立刻得$\tan'''(0)=3!\cdot\frac13=2$。边界情况：$P$的次数不能超过$n$，否则多出的高次项本来就可以并进$o(x^n)$，谈不上唯一。

### 求极限、确定阶

求:term[$\frac00$型]{id="math.calculus.zero-over-zero"}（indeterminate form 0/0）的:term[极限]{id="math.calculus.limit"}，把分子、分母都展开到第一个不抵消的项，也就是找出它们的主要部分，再相除。展开要到够用的阶：分母是$x^k$时，分子一般要展开到$x^k$。确定一个:term[无穷小]{id="math.calculus.infinitesimal"}（infinitesimal）的阶也是这样，展开后第一个不为零的项$cx^k$说明它是:term[$k$阶无穷小]{id="math.calculus.infinitesimal-order"}（infinitesimal of order k），和$cx^k$:term[等价]{id="math.calculus.equivalent-infinitesimal"}。

例如$\tan x-\sin x=\bigl(x+\frac{x^3}3\bigr)-\bigl(x-\frac{x^3}6\bigr)+o(x^3)=\frac{x^3}2+o(x^3)$，它是三阶无穷小，和$\frac{x^3}2$等价。这也解释了[无穷小的比较](lesson:math.calculus.infinitesimal-orders)里的毛病：把$\tan x$、$\sin x$都换成$x$，相减时$x$项抵消了，剩下的正是被扔掉的$x^3$项。$x\to+\infty$的极限，令$t=\frac1x\to0^+$，就化成$t$趋于$0$的情形（第 3 题）。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-1.2, 1.2], y: [-1.8, 1.8] }
functions:
  - expr: "(tan(s*x) - sin(s*x))/s^3"
    label: |
      $y=\frac{\tan sx-\sin sx}{s^3}$
  - expr: "x^3/2"
    label: |
      $y=\frac{x^3}2$
sliders:
  - name: s
    min: 0.05
    max: 1
    step: 0.05
    default: 1
    label: |
      缩放比例$s$
:::

蓝色曲线是把$\tan x-\sin x$的图像横向放大到$\frac1s$倍、纵向放大到$\frac1{s^3}$倍的结果，橙色是它的主要部分$\frac{x^3}2$。$s=1$时两条曲线在$x=\pm1$附近明显分开；把$s$调小，相当于只看$0$附近越来越小的一段，蓝色曲线贴到了橙色曲线上。这正是$x\to0$时$\tan x-\sin x$和$\frac{x^3}2$:term[等价]{id="math.calculus.equivalent-infinitesimal"}的意思。

## 例题

### 例 1　四次导不用求

求$\lim_{x\to0}\frac{\cos x-e^{-x^2/2}}{x^4}$。

**为什么想到这么做**：分母是$x^4$，把分子的两项都展开到$x^4$；$e^{-x^2/2}$是在$e^u$的展开里代入$u=-\frac{x^2}2$。

**推导**：

$$
\begin{aligned}
\cos x&=1-\frac{x^2}2+\frac{x^4}{24}+o(x^4),\\
e^{-x^2/2}&=1-\frac{x^2}2+\frac12\Bigl(\frac{x^2}2\Bigr)^2+o(x^4)=1-\frac{x^2}2+\frac{x^4}8+o(x^4).
\end{aligned}
$$

相减，常数项和$x^2$项都抵消，分子是$\bigl(\frac1{24}-\frac18\bigr)x^4+o(x^4)=-\frac{x^4}{12}+o(x^4)$，所以:term[极限]{id="math.calculus.limit"}是$-\frac1{12}$。

### 例 2　定出无穷小的阶

$x\to0$时，:term[无穷小]{id="math.calculus.infinitesimal"}$\sin x-x\cos x$的主要部分是什么，它是几阶的？

**为什么想到这么做**：两项的主要部分都是$x$，会抵消，要展开到更高的阶；$x\cos x$是乘积，$x$乘上$\cos x$的展开。

**推导**：$\sin x=x-\frac{x^3}6+o(x^3)$，$x\cos x=x\bigl(1-\frac{x^2}2+o(x^2)\bigr)=x-\frac{x^3}2+o(x^3)$。相减得$\sin x-x\cos x=\frac{x^3}3+o(x^3)$，所以它是:term[三阶无穷小]{id="math.calculus.infinitesimal-order"}，和$\frac{x^3}3$:term[等价]{id="math.calculus.equivalent-infinitesimal"}。

## 常见误区

- 「$o(x^2)-o(x^2)=0$。」两个$o(x^2)$可以是不同的量，相减还是$o(x^2)$，不一定是$0$。
- 「分子展开到$x^2$就够了。」例 1 如果只展开到$x^2$，分子是$0+o(x^2)$，除以$x^4$什么也看不出来；要展开到分母的阶。
- 「加减里也能换:term[等价无穷小]{id="math.calculus.equivalent-infinitesimal"}。」把$\tan x-\sin x$里的两项都换成$x$，会得到$0$；展开以后才看得到，主要部分是$\frac{x^3}2$。

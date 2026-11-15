---
id: math.calculus.infinitesimal-orders
title: |
  无穷小的比较
goal: |
  会比较无穷小的阶，用等价无穷小替换求极限，并读懂$o(x)$记号。
prerequisites: [math.calculus.special-limits]
minutes: 28
summary: |
  趋于零的快慢用比值的极限比较；乘除里可以换成等价无穷小。
status: reviewed
---

## 这一节要回答的问题

$x\to0$时，$x$、$x^2$、$\sin x$、$1-\cos x$都趋于$0$，快慢却不一样：$x=0.01$时它们约是$0.01$、$0.0001$、$0.0099998$、$0.00005$。趋于零的快慢怎样比较？能不能借这种比较，把复杂的:term[极限]{id="math.calculus.limit"}（limit，lim）换成简单的来算？

## 讲解

### 无穷小

::anchor{id="def-infinitesimal"}
如果$\lim_{x\to a}\alpha(x)=0$，就说$x\to a$时$\alpha(x)$是:term[无穷小]{id="math.calculus.infinitesimal"}（infinitesimal）。把$x\to a$换成$x\to a^+$、$x\to\infty$、$n\to\infty$等，说法一样。

为什么起这个名字：:term[$\frac00$型]{id="math.calculus.zero-over-zero"}（indeterminate form 0/0）的:term[极限]{id="math.calculus.limit"}，比的正是两个趋于零的量，给它们起个名字，就能谈谁快谁慢。边界情况：无穷小是一个趋于零的函数，不是一个很小的数。$10^{-100}$不是无穷小，常数里只有$0$是；$x^2$在$x\to0$时是无穷小，在$x\to1$时就不是。

两条常用的事实。$\lim_{x\to a}f(x)=L$，就是$f(x)-L$在$x\to a$时是无穷小，所以$f(x)=L+\alpha(x)$。无穷小乘有界的函数还是无穷小：$|g|\le M$时$|\alpha g|\le M|\alpha|$，由:term[夹逼定理]{id="math.calculus.squeeze-theorem"}（squeeze theorem）趋于$0$，例如$x\to0$时的$x\sin\frac1x$。

### 无穷小的比较

下面设$x\to a$时$\alpha$、$\beta$都是:term[无穷小]{id="math.calculus.infinitesimal"}，并且在$a$附近$\beta\ne0$，:term[极限]{id="math.calculus.limit"}都指$x\to a$时的极限。

::anchor{id="def-higher-order"}
如果$\lim\frac{\alpha}{\beta}=0$，就说$\alpha$是比$\beta$:term[高阶的无穷小]{id="math.calculus.higher-order-infinitesimal"}（infinitesimal of higher order），记作$\alpha=o(\beta)$，读作「小 o」。

::anchor{id="def-same-order"}
如果$\lim\frac{\alpha}{\beta}=c$，$c$是不为零的数，就说$\alpha$与$\beta$是:term[同阶无穷小]{id="math.calculus.same-order-infinitesimal"}（infinitesimals of the same order）。

::anchor{id="def-equivalent"}
如果$\lim\frac{\alpha}{\beta}=1$，就说$\alpha$与$\beta$是:term[等价无穷小]{id="math.calculus.equivalent-infinitesimal"}（equivalent infinitesimals），记作$\alpha\sim\beta$。

::anchor{id="def-order-k"}
如果$\alpha$与$(x-a)^k$是同阶无穷小（$k>0$），就说$\alpha$是$x-a$的:term[$k$阶无穷小]{id="math.calculus.infinitesimal-order"}（infinitesimal of order k）；$x\to0$时说是$x$的$k$阶无穷小。

为什么用比值来比：比值趋于$0$，说明$\alpha$和$\beta$比起来小得可以忽略；趋于不为零的$c$，说明两者最终差不多成比例；趋于$1$，说明$\alpha\approx\beta$，相对误差趋于零。例如$x^2=o(x)$；$\frac{\sin x}{x}\to1$，所以$\sin x\sim x$；$\frac{1-\cos x}{x^2}\to\frac12$，所以$1-\cos x$是$x$的二阶无穷小。

边界情况：两个无穷小不一定能比。$x\to0$时$\frac{x\sin(1/x)}{x}=\sin\frac1x$没有极限，$x\sin\frac1x$和$x$谁高阶、是否同阶，都说不上。还要注意$o(\beta)$不是某一个函数，而是「比$\beta$高阶的某个无穷小」：$x^2=o(x)$、$x^3=o(x)$都对，推不出$x^2=x^3$，这里的等号只能从左往右读。

### 常用的等价无穷小

下表是$x\to0$时常用的:term[等价无穷小]{id="math.calculus.equivalent-infinitesimal"}，理由大多来自[两个重要极限](lesson:math.calculus.special-limits)。表里的$\arcsin x$、$\arctan x$分别是$\sin x$在$\bigl[-\frac\pi2,\frac\pi2\bigr]$上、$\tan x$在$\bigl(-\frac\pi2,\frac\pi2\bigr)$上的反函数。

| 等价无穷小 | 理由 |
| --- | --- |
| $\sin x\sim x$，$\tan x\sim x$，$\arcsin x\sim x$ | :term[第一个重要极限]{id="math.calculus.first-special-limit"}（limit of $\frac{\sin x}{x}$）和它的推论 |
| $\arctan x\sim x$ | 令$u=\arctan x$，$\frac{\arctan x}{x}=\frac{u}{\tan u}\to1$ |
| $1-\cos x\sim\frac12x^2$ | $\frac{1-\cos x}{x^2}\to\frac12$ |
| $\ln(1+x)\sim x$，$e^x-1\sim x$ | :term[第二个重要极限]{id="math.calculus.second-special-limit"}（limit defining $e$）的推论 |
| $a^x-1\sim x\ln a$（$a>0$，$a\ne1$） | 同上 |
| $(1+x)^\mu-1\sim\mu x$（$\mu\ne0$） | 见下 |

最后一行：$(1+x)^\mu-1=e^{\mu\ln(1+x)}-1$，所以$\frac{(1+x)^\mu-1}{x}=\frac{e^{\mu\ln(1+x)}-1}{\mu\ln(1+x)}\cdot\frac{\mu\ln(1+x)}{x}\to1\cdot\mu$。表里的$x$可以换成任何趋于$0$（并且不等于$0$）的式子，这是换元：$x\to0$时$\sin3x^2\sim3x^2$，$\sqrt{1+2x}-1\sim x$。

### 等价无穷小替换

::anchor{id="thm-equivalent-substitution"}
**定理**　设$\alpha\sim\alpha'$，$\beta\sim\beta'$，并且$\lim\frac{\alpha'}{\beta'}$存在，那么$\lim\frac{\alpha}{\beta}=\lim\frac{\alpha'}{\beta'}$。

道理：$\frac{\alpha}{\beta}=\frac{\alpha}{\alpha'}\cdot\frac{\alpha'}{\beta'}\cdot\frac{\beta'}{\beta}$，两头的因子都趋于$1$。所以求:term[极限]{id="math.calculus.limit"}时，分子、分母里乘除的因子可以换成和它:term[等价无穷小]{id="math.calculus.equivalent-infinitesimal"}的简单式子，例如$\lim_{x\to0}\frac{\sin2x}{\ln(1+5x)}=\lim_{x\to0}\frac{2x}{5x}=\frac25$。

加减里的项不能随便换。[两个重要极限](lesson:math.calculus.special-limits)例 1 算过$\lim_{x\to0}\frac{\tan x-\sin x}{x^3}=\frac12$；把$\tan x$、$\sin x$都换成$x$，分子变成$0$，得到错误的$0$。毛病在于等价只保证相对误差趋于零，两个等价量相减，剩下的恰恰是被忽略的误差。

::anchor{id="thm-equivalent-o"}
**定理**　$\alpha\sim\beta$当且仅当$\alpha-\beta=o(\beta)$，也就是$\alpha=\beta+o(\beta)$。

道理：$\frac{\alpha-\beta}{\beta}=\frac{\alpha}{\beta}-1$，前者趋于$0$和后者趋于$0$是一回事。于是上表可以读成$\sin x=x+o(x)$、$\ln(1+x)=x+o(x)$、$1-\cos x=\frac12x^2+o(x^2)$：主要部分加上一个更高阶的误差。以后[泰勒公式](lesson:math.calculus.taylor-polynomial)（Taylor's formula）会把误差里的主要部分也一项项写出来。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-0.9, 0.9], y: [-1.3, 1.5] }
functions:
  - expr: "x"
    label: |
      $y=x$
  - expr: "sin(x)"
    label: |
      $\sin x$
  - expr: "tan(x)"
    label: |
      $\tan x$
  - expr: "ln(1 + x)"
    label: |
      $\ln(1+x)$
  - expr: "exp(x) - 1"
    label: |
      $e^x-1$
:::

五条曲线在原点附近挤成一条：它们都和$x$是:term[等价无穷小]{id="math.calculus.equivalent-infinitesimal"}。离原点远一些就分开了，等价只说$x\to0$时比值趋于$1$，不说别处相等。

:::anim{component="function-plot"}
range: { x: [-3, 3], y: [-0.2, 2.5] }
functions:
  - expr: "(1 - cos(x)) / abs(x)^k"
    label: |
      $\frac{1-\cos x}{|x|^k}$
  - expr: "0.5"
    label: |
      $y=\frac12$
sliders:
  - name: k
    min: 1
    max: 3
    step: 0.25
    default: 1.5
    label: |
      比较用的幂次$k$
:::

蓝色曲线是$1-\cos x$和$|x|^k$的比值。$k<2$时它在原点附近趋于$0$，$1-\cos x$比$|x|^k$高阶；$k>2$时它在原点附近冲出画面，$1-\cos x$比$|x|^k$低阶。只有$k=2$时比值趋于不为零的$\frac12$，曲线在原点附近贴向橙色水平线，所以$1-\cos x$是$x$的二阶:term[无穷小]{id="math.calculus.infinitesimal"}。

## 例题

### 例 1　乘积里的替换

求$\lim_{x\to0}\frac{(1-\cos x)\ln(1+3x)}{x^2\arctan x}$。

**为什么想到这么做**：分子、分母都是几个:term[无穷小]{id="math.calculus.infinitesimal"}相乘，每个因子都能换成等价的幂，乘除里替换是允许的。

**推导**：$1-\cos x\sim\frac12x^2$，$\ln(1+3x)\sim3x$，$\arctan x\sim x$。由:term[等价无穷小]{id="math.calculus.equivalent-infinitesimal"}替换，原式$=\lim_{x\to0}\frac{\frac12x^2\cdot3x}{x^2\cdot x}=\frac32$。

### 例 2　整块换元

求$\lim_{x\to0}\frac{e^x-e^{\sin x}}{x-\sin x}$。

**为什么想到这么做**：分子是加减，不能把$e^x$、$e^{\sin x}$分别替换。提出公因子$e^{\sin x}$，剩下的$e^{x-\sin x}-1$正是「$e^u-1$」的样子，$u=x-\sin x$趋于$0$，可以整块替换，用不着知道$u$本身是几阶。

**推导**：$e^x-e^{\sin x}=e^{\sin x}\bigl(e^{x-\sin x}-1\bigr)$。$x\ne0$时$|\sin x|<|x|$，所以$u=x-\sin x\ne0$，并且$u\to0$，于是$e^u-1\sim u$。原式$=\lim_{x\to0}e^{\sin x}\cdot\frac{e^{u}-1}{u}=1\cdot1=1$。

## 常见误区

- 「:term[无穷小]{id="math.calculus.infinitesimal"}就是很小的数。」它说的是一个趋于零的过程；$10^{-100}$再小也不是无穷小。
- 「加减里的项也能换成:term[等价无穷小]{id="math.calculus.equivalent-infinitesimal"}。」$\tan x-\sin x$换成$x-x$就错了；只有乘除的因子能换，和差要先化成乘积或整块替换（例 2）。
- 「任意两个无穷小都能比较阶。」$x\sin\frac1x$和$x$的比值没有:term[极限]{id="math.calculus.limit"}，说不上谁高阶。
- 「由$x^2=o(x)$和$x^3=o(x)$得$x^2=x^3$。」$o(x)$只表示「比$x$高阶的某个无穷小」，等号只能从左往右读（第 8 题）。

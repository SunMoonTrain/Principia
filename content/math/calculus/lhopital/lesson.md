---
id: math.calculus.lhopital
title: |
  洛必达法则
goal: |
  会用洛必达法则求$\frac{0}{0}$型、$\frac{\infty}{\infty}$型等不定式的极限。
prerequisites: [math.calculus.mean-value-theorem, math.calculus.chain-rule]
minutes: 28
summary: |
  $\frac00$型、$\frac\infty\infty$型的极限，可以换成分子、分母各自求导后的比的极限。
status: reviewed
---

## 这一节要回答的问题

$\frac{\sin x}x$、$\frac{e^x-1}x$在$x\to0$时的:term[极限]{id="math.calculus.limit"}（limit，lim），[两个重要极限](lesson:math.calculus.special-limits)各费了一番功夫才求出来。$\frac{x-\sin x}{x^3}$（$x\to0$）、$\frac{\ln x}{\sqrt x}$（$x\to+\infty$）呢？分子、分母同时趋于$0$，或同时趋于:term[无穷大]{id="math.calculus.infinity"}（infinity），有没有一个统一的办法？

## 讲解

### 不定式

::anchor{id="def-indeterminate-form"}
$x\to a$时分子、分母都趋于$0$的分式叫作:term[$\frac00$型]{id="math.calculus.zero-over-zero"}（indeterminate form 0/0，见[极限的运算法则与夹逼定理](lesson:math.calculus.limit-laws#def-zero-over-zero)）；分子、分母都趋于:term[无穷大]{id="math.calculus.infinity"}的，叫作:term[$\frac\infty\infty$型]{id="math.calculus.infinity-over-infinity"}（indeterminate form ∞/∞）。这两类，连同后面的$0\cdot\infty$、$\infty-\infty$、$1^\infty$、$0^0$、$\infty^0$型，统称:term[不定式]{id="math.calculus.indeterminate-form"}（indeterminate form）。$x\to a^\pm$、$x\to\pm\infty$时也这样叫。

为什么这样定义：知道了各部分的:term[极限]{id="math.calculus.limit"}，还定不出整体的极限。同是$\frac\infty\infty$型，$x\to+\infty$时$\frac{x^2}x\to+\infty$，$\frac x{x^2}\to0$，$\frac{2x+1}x\to2$，结果要看分子、分母谁变得快。边界情况：分子趋于$0$、分母趋于无穷大的「$\frac0\infty$」不是不定式，比值一定趋于$0$。

### 柯西中值定理

要比较$f$和$g$在同一段上的增量，可以对它们各用一次:term[拉格朗日中值定理]{id="math.calculus.mean-value-theorem"}（mean value theorem，见[微分中值定理](lesson:math.calculus.mean-value-theorem#thm-mean-value)）：$f(b)-f(a)=f'(\xi_1)(b-a)$，$g(b)-g(a)=g'(\xi_2)(b-a)$。可$\xi_1$、$\xi_2$一般不是同一个点，相除得不到$f'$、$g'$在同一点的比。下面的定理给出同一个$\xi$。

::anchor{id="thm-cauchy-mean-value"}
**定理（:term[柯西中值定理]{id="math.calculus.cauchy-mean-value-theorem"}，Cauchy's mean value theorem）**　设$f$、$g$在$[a,b]$上:term[连续]{id="math.calculus.continuous"}（continuous），在$(a,b)$内:term[可导]{id="math.calculus.differentiable"}（differentiable），并且$(a,b)$内处处$g'(x)\ne0$，那么至少有一点$\xi\in(a,b)$，使$\frac{f(b)-f(a)}{g(b)-g(a)}=\frac{f'(\xi)}{g'(\xi)}$。

道理：先说分母不为零。若$g(b)=g(a)$，由:term[罗尔定理]{id="math.calculus.rolle-theorem"}（Rolle's theorem），有一点使$g'=0$，和条件矛盾。记$k=\frac{f(b)-f(a)}{g(b)-g(a)}$，令$\varphi(x)=f(x)-kg(x)$，则$\varphi(b)-\varphi(a)=0$；由罗尔定理，有$\xi\in(a,b)$使$\varphi'(\xi)=f'(\xi)-kg'(\xi)=0$，两边除以$g'(\xi)$即得。

取$g(x)=x$，就回到拉格朗日中值定理。边界情况：$g'\ne0$不能少。$f(x)=x^2$、$g(x)=x^3$在$[-1,1]$上，左边是$\frac{0}{2}=0$，可$\frac{f'(\xi)}{g'(\xi)}=\frac2{3\xi}$在$\xi\ne0$时都不为$0$，在$\xi=0$处没有定义；毛病出在$g'(0)=0$。

### 洛必达法则

::anchor{id="thm-lhopital"}
**定理（:term[洛必达法则]{id="math.calculus.lhopital-rule"}，L'Hôpital's rule）**　设$x\to a$时$\frac{f(x)}{g(x)}$是:term[$\frac00$型]{id="math.calculus.zero-over-zero"}或:term[$\frac\infty\infty$型]{id="math.calculus.infinity-over-infinity"}，$f$、$g$在$a$附近（$a$本身可以除外）:term[可导]{id="math.calculus.differentiable"}，并且$g'(x)\ne0$。如果$\lim_{x\to a}\frac{f'(x)}{g'(x)}=L$，$L$是一个数或$\infty$，那么$\lim_{x\to a}\frac{f(x)}{g(x)}=L$。把$x\to a$换成$x\to a^\pm$、$x\to\pm\infty$，结论也成立。

道理（$\frac00$型、$x\to a^+$）：$f(a)$、$g(a)$不影响:term[极限]{id="math.calculus.limit"}，就规定$f(a)=g(a)=0$，于是$f$、$g$在$[a,x]$上:term[连续]{id="math.calculus.continuous"}。由:term[柯西中值定理]{id="math.calculus.cauchy-mean-value-theorem"}，$\frac{f(x)}{g(x)}=\frac{f(x)-f(a)}{g(x)-g(a)}=\frac{f'(\xi)}{g'(\xi)}$，$\xi$在$a$和$x$之间。$x\to a^+$时$\xi\to a^+$，右边趋于$L$；$x\to a^-$同理。$\frac\infty\infty$型和$x\to\pm\infty$的情形这里不证。

为什么想得到：设$f(a)=g(a)=0$，$f$、$g$在$a$处可导，$g'(a)\ne0$。把分子、分母同除以$x-a$，$\frac{f(x)}{g(x)}=\frac{f(x)-f(a)}{x-a}\Big/\frac{g(x)-g(a)}{x-a}\to\frac{f'(a)}{g'(a)}$。在$a$附近，两条曲线都像各自的:term[切线]{id="math.calculus.tangent-line"}（tangent line），趋于零的快慢就看斜率（见几何图像）。

求导以后还是:term[不定式]{id="math.calculus.indeterminate-form"}，可以再用一次，每一步都要先查是不是不定式（例 1）。边界情况：$\frac{f'}{g'}$没有极限时，法则什么也没说。$x\to+\infty$时$\frac{x+\sin x}x=1+\frac{\sin x}x\to1$，分子、分母各自求导却得到$1+\cos x$，它没有极限。

### 化成分式

另外几种:term[不定式]{id="math.calculus.indeterminate-form"}先化成:term[$\frac00$型]{id="math.calculus.zero-over-zero"}或:term[$\frac\infty\infty$型]{id="math.calculus.infinity-over-infinity"}。$0\cdot\infty$型把一个因子挪到分母上：$x\to0^+$时，$x\ln x=\frac{\ln x}{1/x}$是$\frac\infty\infty$型，求导得$\frac{1/x}{-1/x^2}=-x\to0$，所以$x\ln x\to0$。$\infty-\infty$型通分，变成一个分式（第 3 题）。

$1^\infty$、$0^0$、$\infty^0$型是幂$u^v$，写成$u^v=e^{v\ln u}$，指数$v\ln u$是$0\cdot\infty$型。求出指数的:term[极限]{id="math.calculus.limit"}$c$，由$e^x$的:term[连续性]{id="math.calculus.continuous"}，原式趋于$e^c$。例如$x\to0^+$时$x^{2x}=e^{2x\ln x}$，指数趋于$0$，所以$x^{2x}\to1$。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-0.4, 2], y: [-1, 2.5] }
functions:
  - expr: "ln(1 + 2x)"
    label: |
      $y=f(x)=\ln(1+2x)$
  - expr: "sin(x)"
    label: |
      $y=g(x)=\sin x$
  - expr: "ln(1 + 2h)/h * x"
    label: |
      过原点和$\bigl(h,f(h)\bigr)$的直线
  - expr: "sin(h)/h * x"
    label: |
      过原点和$\bigl(h,g(h)\bigr)$的直线
points:
  - { x: "h", y: "ln(1 + 2h)" }
  - { x: "h", y: "sin(h)" }
sliders:
  - name: h
    min: 0.05
    max: 1.8
    step: 0.05
    default: 1.2
    label: |
      $h$
:::

$f(0)=g(0)=0$，$\frac{f(h)}{g(h)}$正是绿色、紫色两条直线的斜率之比：$\frac{f(h)/h}{g(h)/h}$。把$h$拖向$0$，两条直线变成两条曲线在原点的:term[切线]{id="math.calculus.tangent-line"}，斜率趋于$f'(0)=2$和$g'(0)=1$，所以$\frac{f(h)}{g(h)}\to2$。

## 例题

### 例 1　连用三次

求$\lim_{x\to0}\frac{x-\sin x}{x^3}$。

**为什么想到这么做**：分子、分母都趋于$0$，是:term[$\frac00$型]{id="math.calculus.zero-over-zero"}；求一次导还是$\frac00$型，就接着用，每次先查一遍。

**推导**：

$$
\lim_{x\to0}\frac{x-\sin x}{x^3}=\lim_{x\to0}\frac{1-\cos x}{3x^2}=\lim_{x\to0}\frac{\sin x}{6x}=\lim_{x\to0}\frac{\cos x}{6}=\frac16.
$$

前两步之后都还是$\frac00$型，最后一步分母不再趋于$0$，直接代入。所以$x$很小时$x-\sin x\approx\frac{x^3}6$：$\sin x$和$x$的差，比$x$本身小得多。

### 例 2　谁增长得快

$a>0$。求$\lim_{x\to+\infty}\frac{\ln x}{x^a}$和$\lim_{x\to+\infty}\frac{x^{10}}{e^x}$。

**为什么想到这么做**：两个都是:term[$\frac\infty\infty$型]{id="math.calculus.infinity-over-infinity"}，$x\to+\infty$。第一个求一次导，$\ln x$就变成$\frac1x$；第二个每求一次导，分子的次数降一次，分母$e^x$不变。

**推导**：$\frac{(\ln x)'}{(x^a)'}=\frac{1/x}{ax^{a-1}}=\frac1{ax^a}\to0$，所以$\frac{\ln x}{x^a}\to0$。第二个连用十次:term[洛必达法则]{id="math.calculus.lhopital-rule"}，每次都还是$\frac\infty\infty$型，最后得到$\frac{10!}{e^x}\to0$。所以$x\to+\infty$时，$\ln x$比$x$的任何正数次幂都增长得慢，$x^{10}$又比$e^x$增长得慢；把$10$换成任何正数，结论都一样。

## 常见误区

- 「分式的:term[极限]{id="math.calculus.limit"}都可以用:term[洛必达法则]{id="math.calculus.lhopital-rule"}。」不是:term[不定式]{id="math.calculus.indeterminate-form"}时不能用：$\lim_{x\to0}\frac{x^2+1}{x+1}=1$，分子、分母各自求导却得到$\frac{2x}1\to0$。
- 「用一次之后，接着再用。」每一步都要先查：$\lim_{x\to0}\frac{e^x-1}{x^2+x}$用一次得$\frac{e^x}{2x+1}\to1$；这时已经不是不定式，再求导会得到错误的$\frac12$。
- 「洛必达法则是对商求导。」是分子、分母各自求导再相除，不是用:term[商法则]{id="math.calculus.quotient-rule"}（quotient rule）求$\Bigl(\frac fg\Bigr)'$。

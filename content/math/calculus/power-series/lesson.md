---
id: math.calculus.power-series
title: |
  幂级数与收敛半径
goal: |
  会求幂级数的收敛半径和收敛域。
prerequisites: [math.calculus.ratio-root-tests, math.calculus.alternating-series]
minutes: 27
summary: |
  幂级数在$|x-x_0|<R$内绝对收敛，在外发散；端点要单独判断。
status: reviewed
---

## 这一节要回答的问题

多项式加到无穷多项，比如$1+x+x^2+\cdots$：$|x|<1$时它是收敛的:term[几何级数]{id="math.calculus.geometric-series"}（geometric series），和是$\frac1{1-x}$；$|x|\ge1$时它发散。一般的$a_0+a_1x+a_2x^2+\cdots$在哪些$x$处收敛？使它收敛的$x$总是组成一个区间吗？

## 讲解

### 幂级数

::anchor{id="def-power-series"}
形如$\sum_{n=0}^\infty a_n(x-x_0)^n=a_0+a_1(x-x_0)+a_2(x-x_0)^2+\cdots$的:term[级数]{id="math.calculus.series"}（series）叫作以$x_0$为中心的:term[幂级数]{id="math.calculus.power-series"}（power series），$a_n$叫作它的系数。$x_0=0$时就是$\sum_{n=0}^\infty a_nx^n$。它在收敛的每个$x$处都有一个和，这个和是$x$的函数，叫作幂级数的:term[和函数]{id="math.calculus.sum-function"}（sum function），记作$S(x)$。

为什么这样定义：多项式是最好算的函数，幂级数是「无穷次的多项式」。每取定一个$x$，它就是一个数项级数；使它收敛的$x$组成和函数的定义域。比如$\sum_{n=0}^\infty x^n$的和函数是$\frac1{1-x}$（$|x|<1$）。边界情况：$x=x_0$时除第一项外都是$0$，幂级数总在中心收敛，和是$a_0$（约定$(x-x_0)^0=1$）。

### 收敛半径

::anchor{id="thm-abel-lemma"}
**定理**　如果:term[幂级数]{id="math.calculus.power-series"}$\sum a_n(x-x_0)^n$在$x=x_1$（$x_1\ne x_0$）处收敛，那么在满足$|x-x_0|<|x_1-x_0|$的每个$x$处，它都:term[绝对收敛]{id="math.calculus.absolute-convergence"}（absolute convergence）；如果它在$x=x_2$处发散，那么在满足$|x-x_0|>|x_2-x_0|$的每个$x$处都发散。

道理：$\sum a_n(x_1-x_0)^n$收敛，通项趋于$0$，从某一项起都小于$1$，前面只有有限项，所以有界，设$|a_n(x_1-x_0)^n|\le M$。记$q=\frac{|x-x_0|}{|x_1-x_0|}<1$，则$|a_n(x-x_0)^n|\le Mq^n$，由:term[比较判别法]{id="math.calculus.comparison-test"}（comparison test），$\sum|a_n(x-x_0)^n|$收敛。后一半：要是在离中心比$x_2$更远的某处收敛，由前一半，在$x_2$处也收敛，矛盾。

::anchor{id="def-radius-of-convergence"}
所以使幂级数收敛的点，总是以$x_0$为中心排开：有一个$R$（$0\le R\le+\infty$），$|x-x_0|<R$时:term[级数]{id="math.calculus.series"}绝对收敛，$|x-x_0|>R$时发散。这个$R$叫作:term[收敛半径]{id="math.calculus.radius-of-convergence"}（radius of convergence），开区间$(x_0-R,x_0+R)$叫作:term[收敛区间]{id="math.calculus.interval-of-convergence"}（interval of convergence），收敛区间加上收敛的端点，即全部收敛点组成的集合，叫作:term[收敛域]{id="math.calculus.domain-of-convergence"}（domain of convergence）。

为什么这样定义：上面的定理说，收敛的点往外走不会断开再接上，收敛与否只取决于离中心多远。$R=0$表示只在中心收敛，$R=+\infty$表示处处收敛。$R$的存在要用到实数「没有洞」，这里不证，见数学分析的[幂级数的收敛理论](lesson:math.analysis.power-series-theory)。边界情况：在两个端点$x_0\pm R$处，定理什么也没说，级数可能收敛也可能发散，见下面。

### 用比值求收敛半径

::anchor{id="thm-radius-ratio"}
**定理**　设从某一项起$a_n\ne0$，并且$\Bigl|\frac{a_n}{a_{n+1}}\Bigr|\to R$（$R$可以是$+\infty$）。则$\sum a_n(x-x_0)^n$的:term[收敛半径]{id="math.calculus.radius-of-convergence"}就是$R$。

道理：对$\sum|a_n(x-x_0)^n|$用:term[比值判别法]{id="math.calculus.ratio-test"}（ratio test），相邻两项之比是$\Bigl|\frac{a_{n+1}}{a_n}\Bigr|\,|x-x_0|$，趋于$\frac{|x-x_0|}R$。$|x-x_0|<R$时它小于$1$，:term[级数]{id="math.calculus.series"}:term[绝对收敛]{id="math.calculus.absolute-convergence"}；$|x-x_0|>R$时它大于$1$，从某一项起$|a_n(x-x_0)^n|$越来越大，通项不趋于$0$，级数发散。同样，$\sqrt[n]{|a_n|}\to\frac1R$时收敛半径也是$R$，这时用:term[根值判别法]{id="math.calculus.root-test"}（root test）。

为什么有用：系数有明确公式时，这样一算就得到$R$。$\sum x^n$的$R=1$；$\sum\frac{x^n}{n!}$的$\bigl|\frac{a_n}{a_{n+1}}\bigr|=n+1\to+\infty$，处处收敛；$\sum n!\,x^n$的$\bigl|\frac{a_n}{a_{n+1}}\bigr|=\frac1{n+1}\to0$，只在$x=0$处收敛。边界情况：系数有无穷多个是$0$时比值没有定义，比如$\sum\frac{x^{2n}}{4^n}$，这时对相邻的非零项求比，得$\frac{x^2}4$，$|x|<2$时收敛，$|x|>2$时发散，$R=2$；也可以把它看成$u=x^2$的:term[几何级数]{id="math.calculus.geometric-series"}。

### 端点要单独判断

在$x_0\pm R$处，:term[幂级数]{id="math.calculus.power-series"}变成两个数项:term[级数]{id="math.calculus.series"}，要用前面的判别法分别判断。$\sum x^n$、$\sum\frac{x^n}n$、$\sum\frac{x^n}{n^2}$的:term[收敛半径]{id="math.calculus.radius-of-convergence"}都是$1$：第一个在$x=\pm1$处通项不趋于$0$，都发散；第二个在$x=1$处是:term[调和级数]{id="math.calculus.harmonic-series"}（harmonic series），发散，在$x=-1$处由:term[交错级数判别法]{id="math.calculus.alternating-series-test"}（alternating series test）收敛；第三个在两端都:term[绝对收敛]{id="math.calculus.absolute-convergence"}。所以三者的:term[收敛域]{id="math.calculus.domain-of-convergence"}分别是$(-1,1)$、$[-1,1)$、$[-1,1]$。

为什么要紧：端点处的值常常正是要用的结果，:term[交错调和级数]{id="math.calculus.alternating-harmonic-series"}（alternating harmonic series）的和、$1-\frac13+\frac15-\cdots$的和，都是幂级数在:term[收敛区间]{id="math.calculus.interval-of-convergence"}端点处的值，见[泰勒级数](lesson:math.calculus.taylor-series)和[幂级数的逐项求导与逐项积分](lesson:math.calculus.power-series-calculus)。边界情况：$\sum\frac{(-x)^n}n$把第二个级数左右翻过来，收敛域是$(-1,1]$，四种区间都可能出现。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-1.6, 1.6], y: [-3, 6] }
functions:
  - expr: "1/(1 - x) + 0*sqrt(1 - x^2)"
    label: |
      和函数$\frac1{1-x}$（$|x|<1$）
  - expr: "sum(k, 0, m, x^k)"
    label: |
      部分和$1+x+\cdots+x^m$
sliders:
  - name: m
    min: 1
    max: 40
    step: 1
    default: 4
    label: |
      项数$m$
:::

蓝色的是:term[几何级数]{id="math.calculus.geometric-series"}$\sum x^k$的:term[和函数]{id="math.calculus.sum-function"}$\frac1{1-x}$，只画在:term[收敛区间]{id="math.calculus.interval-of-convergence"}$(-1,1)$上；橙色的是:term[部分和]{id="math.calculus.partial-sum"}（partial sum）$1+x+\cdots+x^m$。拖动$m$：在$(-1,1)$里，橙线越来越贴近蓝线；出了这个区间，$x>1$时部分和冲上去，$x<-1$时一正一负越摆越大，都不收敛。越靠近$x=\pm1$，贴近得越慢，$m$要很大才看得出来。

## 例题

### 例 1　以$2$为中心

求$\sum_{n=1}^\infty\frac{(x-2)^n}{n\cdot3^n}$的:term[收敛半径]{id="math.calculus.radius-of-convergence"}和:term[收敛域]{id="math.calculus.domain-of-convergence"}。

**为什么想到这么做**：系数$a_n=\frac1{n\cdot3^n}$都不为$0$，先用比值求$R$，再把两个端点代进去，分别判断。

**推导**：$\Bigl|\frac{a_n}{a_{n+1}}\Bigr|=\frac{(n+1)3^{n+1}}{n\cdot3^n}=\frac{3(n+1)}n\to3$，$R=3$，:term[收敛区间]{id="math.calculus.interval-of-convergence"}是$(-1,5)$。$x=5$时:term[级数]{id="math.calculus.series"}是$\sum\frac1n$，发散；$x=-1$时是$\sum\frac{(-1)^n}n$，由:term[交错级数判别法]{id="math.calculus.alternating-series-test"}收敛。收敛域是$[-1,5)$。

### 例 2　只有奇数次项

求$\sum_{n=0}^\infty\frac{(-1)^nx^{2n+1}}{2n+1}=x-\frac{x^3}3+\frac{x^5}5-\cdots$的:term[收敛域]{id="math.calculus.domain-of-convergence"}。

**为什么想到这么做**：偶数次项的系数都是$0$，$\bigl|\frac{a_n}{a_{n+1}}\bigr|$没有定义，改为对相邻的非零项用:term[比值判别法]{id="math.calculus.ratio-test"}。

**推导**：相邻非零项之比的绝对值是$\frac{|x|^{2n+3}/(2n+3)}{|x|^{2n+1}/(2n+1)}=\frac{2n+1}{2n+3}x^2\to x^2$，$|x|<1$时:term[绝对收敛]{id="math.calculus.absolute-convergence"}，$|x|>1$时发散，$R=1$。$x=1$时:term[级数]{id="math.calculus.series"}是$1-\frac13+\frac15-\cdots$，$x=-1$时是它的相反数，都由:term[交错级数判别法]{id="math.calculus.alternating-series-test"}收敛，所以收敛域是$[-1,1]$。它的:term[和函数]{id="math.calculus.sum-function"}是$\arctan x$，见[幂级数的逐项求导与逐项积分](lesson:math.calculus.power-series-calculus)。

## 常见误区

- 「:term[收敛半径]{id="math.calculus.radius-of-convergence"}是$\bigl|\frac{a_{n+1}}{a_n}\bigr|$的极限。」反了，是$\bigl|\frac{a_n}{a_{n+1}}\bigr|$的极限：$\sum\frac{x^n}{2^n}$的收敛半径是$2$，不是$\frac12$。
- 「:term[收敛区间]{id="math.calculus.interval-of-convergence"}就是:term[收敛域]{id="math.calculus.domain-of-convergence"}。」端点要单独判断：$\sum\frac{x^n}n$在$x=-1$处收敛、在$x=1$处发散。
- 「系数有一半是$0$，照样用$\bigl|\frac{a_n}{a_{n+1}}\bigr|$求$R$。」这时比值没有定义；要对相邻的非零项求比，或者把$x^2$看成新的变量。

---
id: math.calculus.power-series-calculus
title: |
  幂级数的逐项求导与逐项积分
goal: |
  会对幂级数逐项求导和逐项积分，并用它求$\arctan x$等函数的展开式和一些级数的和。
prerequisites: [math.calculus.taylor-series, math.calculus.implicit-differentiation]
minutes: 28
summary: |
  收敛区间里幂级数可逐项求导、积分，收敛半径不变；$\arctan x$在$|x|\le1$展开。
status: reviewed
---

## 这一节要回答的问题

多项式求导、积分，一项一项做就行。:term[幂级数]{id="math.calculus.power-series"}（power series）有无穷多项，在:term[收敛区间]{id="math.calculus.interval-of-convergence"}（interval of convergence）里也能这样做吗？要是能，从$\frac1{1-x}=1+x+x^2+\cdots$出发，求导、积分就能得到许多新的展开式和:term[级数]{id="math.calculus.series"}（series）的和，比如$\arctan x$的展开式和$\frac\pi4$。

## 讲解

### 逐项求导与逐项积分

::anchor{id="thm-termwise"}
**定理**　设:term[幂级数]{id="math.calculus.power-series"}$\sum_{n=0}^\infty a_n(x-x_0)^n$的:term[收敛半径]{id="math.calculus.radius-of-convergence"}（radius of convergence）$R>0$，:term[和函数]{id="math.calculus.sum-function"}（sum function）为$S(x)$。则在:term[收敛区间]{id="math.calculus.interval-of-convergence"}$(x_0-R,x_0+R)$里，$S$:term[可导]{id="math.calculus.differentiable"}（differentiable），$S'(x)=\sum_{n=1}^\infty na_n(x-x_0)^{n-1}$，并且$\int_{x_0}^xS(t)\,\dd t=\sum_{n=0}^\infty\frac{a_n}{n+1}(x-x_0)^{n+1}$；逐项求导、逐项积分得到的两个:term[级数]{id="math.calculus.series"}，收敛半径都还是$R$。

道理（只说思路）：先看收敛半径。取$|x-x_0|<r<R$，$\sum a_nr^n$收敛，通项有界，设$|a_nr^n|\le M$；记$q=\frac{|x-x_0|}r<1$，则$|na_n(x-x_0)^{n-1}|\le\frac Mr\,nq^{n-1}$，而$\sum nq^{n-1}$由:term[比值判别法]{id="math.calculus.ratio-test"}（ratio test）收敛，所以求导后的级数在收敛区间里:term[绝对收敛]{id="math.calculus.absolute-convergence"}（absolute convergence）。反过来，$|a_n(x-x_0)^n|\le|x-x_0|\cdot|na_n(x-x_0)^{n-1}|$，求导后的级数收敛的地方原来的也收敛，所以两者的收敛半径相同；积分后的级数求导就是原来的级数，收敛半径也相同。至于和函数的:term[导数]{id="math.calculus.derivative"}（derivative）、积分正好是逐项求导、逐项积分的结果，要用到:term[一致收敛]{id="math.analysis.uniform-convergence"}（uniform convergence），这里不证，见数学分析的[幂级数的收敛理论](lesson:math.analysis.power-series-theory)。

为什么有用：在收敛区间里，幂级数可以像多项式一样求导、积分。反复求导，$S$任意阶可导，$S^{(n)}(x_0)=n!\,a_n$，即$a_n=\frac{S^{(n)}(x_0)}{n!}$：一个函数在$x_0$附近要是能写成幂级数，这个幂级数只能是它的:term[泰勒级数]{id="math.calculus.taylor-series"}（Taylor series）。边界情况：收敛半径不变，端点却可能变，$\sum\frac{x^n}{n^2}$的:term[收敛域]{id="math.calculus.domain-of-convergence"}（domain of convergence）是$[-1,1]$，逐项求导得$\sum\frac{x^{n-1}}n$，收敛域变成$[-1,1)$。

### 从几何级数出发

$|x|<1$时$\frac1{1-x}=\sum_{n=0}^\infty x^n$。逐项求导，得

$$
\frac1{(1-x)^2}=\sum_{n=1}^\infty nx^{n-1}=1+2x+3x^2+\cdots\qquad(|x|<1);
$$

从$0$到$x$逐项积分，得

$$
-\ln(1-x)=\sum_{n=1}^\infty\frac{x^n}n=x+\frac{x^2}2+\frac{x^3}3+\cdots\qquad(|x|<1).
$$

为什么有用：很多:term[级数]{id="math.calculus.series"}的和由此算出来。比如$\sum_{n=1}^\infty\frac n{2^n}$，提出$\frac12$，剩下$\sum_{n=1}^\infty n\bigl(\frac12\bigr)^{n-1}$，用第一式取$x=\frac12$得$4$，所以和是$2$。把第二式的$x$换成$-x$，就是[泰勒级数](lesson:math.calculus.taylor-series)里$\ln(1+x)$的展开式，两条路得到同一个级数，正如上面说的，展开式只能有一个。边界情况：第二式在$x=-1$处也成立（$\ln2$的级数），可逐项积分只管$|x|<1$，端点要另外证明，见下面$\arctan x$的做法。

### $\arctan x$的展开式

::anchor{id="thm-arctan-series"}
**定理**　$|x|\le1$时，$\arctan x=\sum_{n=0}^\infty\frac{(-1)^nx^{2n+1}}{2n+1}$，即$x-\frac{x^3}3+\frac{x^5}5-\cdots$。特别地，$\frac\pi4=1-\frac13+\frac15-\frac17+\cdots$。

道理：由有限项的等比数列求和，$\frac1{1+t^2}=\sum_{k=0}^{n-1}(-1)^kt^{2k}+\frac{(-1)^nt^{2n}}{1+t^2}$。由:term[反正切函数]{id="math.calculus.arctangent"}（arctangent）的:term[导数]{id="math.calculus.derivative"}$(\arctan t)'=\frac1{1+t^2}$，两边从$0$到$x$积分，

$$
\arctan x=\sum_{k=0}^{n-1}\frac{(-1)^kx^{2k+1}}{2k+1}+(-1)^n\int_0^x\frac{t^{2n}}{1+t^2}\,\dd t.
$$

最后一项的绝对值不超过$\Bigl|\int_0^xt^{2n}\,\dd t\Bigr|=\frac{|x|^{2n+1}}{2n+1}$，$|x|\le1$时它不超过$\frac1{2n+1}$，趋于$0$。在$|x|<1$里，这正是对$\frac1{1+t^2}=\sum(-1)^nt^{2n}$逐项积分；写成有限项加:term[余项]{id="math.calculus.remainder"}（remainder），端点$x=\pm1$也一并证完，取$x=1$，$\arctan1=\frac\pi4$。

为什么有用：$\frac\pi4$的这个:term[级数]{id="math.calculus.series"}漂亮，可收敛得很慢，误差约是第一个丢掉的项，要误差小于$10^{-4}$得加约$5000$项。实际算$\pi$常拆成$x$小的几项，比如$\frac\pi4=\arctan\frac12+\arctan\frac13$（用正切的和角公式验证），$x=\frac12$、$\frac13$时级数收敛得快得多。边界情况：$\arctan x$对一切$x$都有定义，展开式却只在$|x|\le1$成立，$|x|>1$时通项$\frac{|x|^{2n+1}}{2n+1}$不趋于$0$，级数发散。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-2, 2], y: [-2, 2] }
functions:
  - expr: "atan(x)"
    label: |
      $y=\arctan x$
  - expr: "sum(k, 0, m, (-1)^k*x^(2*k + 1)/(2*k + 1))"
    label: |
      展开式的前$m+1$项之和
points:
  - { x: "1", y: "pi/4" }
  - { x: "-1", y: "-pi/4" }
sliders:
  - name: m
    min: 0
    max: 30
    step: 1
    default: 3
    label: |
      $m$
:::

蓝线是$\arctan x$，橙线是它的展开式的前$m+1$项之和，两个圆点是$\bigl(\pm1,\pm\frac\pi4\bigr)$。增大$m$：在$(-1,1)$里，橙线越来越贴近蓝线；在端点，橙线一上一下地逼近圆点，逼近得很慢，正是$1-\frac13+\frac15-\cdots$收敛得慢。出了$[-1,1]$，$m$越大，橙线甩得越远，可蓝线一直平平地延伸，$\arctan x$在那里好好的，只是:term[幂级数]{id="math.calculus.power-series"}管不到。

## 例题

### 例 1　求$\sum\frac{n^2}{2^n}$

求$\sum_{n=1}^\infty\frac{n^2}{2^n}$。

**为什么想到这么做**：$n^2x^n$可以由$x^n$求两次导、乘两次$x$得到。从$\sum x^n$出发，在:term[收敛区间]{id="math.calculus.interval-of-convergence"}里逐项求导，最后代$x=\frac12$。

**推导**：由$\sum_{n=1}^\infty nx^{n-1}=\frac1{(1-x)^2}$，乘$x$得$\sum_{n=1}^\infty nx^n=\frac x{(1-x)^2}$。再逐项求导、乘$x$：

$$
\begin{aligned}
\sum_{n=1}^\infty n^2x^{n-1}&=\Bigl(\frac x{(1-x)^2}\Bigr)'=\frac{1+x}{(1-x)^3},\\
\sum_{n=1}^\infty n^2x^n&=\frac{x(1+x)}{(1-x)^3}.
\end{aligned}
$$

$x=\frac12$在收敛区间$(-1,1)$里，代入得$\frac{\frac12\cdot\frac32}{\frac18}=6$。

### 例 2　算$\int_0^1e^{-x^2}\,\dd x$

$e^{-x^2}$的:term[原函数]{id="math.calculus.antiderivative"}（antiderivative）不是:term[初等函数]{id="math.calculus.elementary-function"}（elementary function）。用:term[级数]{id="math.calculus.series"}算$\int_0^1e^{-x^2}\,\dd x$，误差不超过$0.0005$。

**为什么想到这么做**：$e^u=\sum\frac{u^n}{n!}$对一切$u$成立，代入$u=-x^2$得到:term[收敛半径]{id="math.calculus.radius-of-convergence"}为$+\infty$的:term[幂级数]{id="math.calculus.power-series"}，$[0,1]$在:term[收敛区间]{id="math.calculus.interval-of-convergence"}里，可以逐项积分。

**推导**：$e^{-x^2}=\sum_{n=0}^\infty\frac{(-1)^nx^{2n}}{n!}$，逐项积分，

$$
\begin{aligned}
\int_0^1e^{-x^2}\,\dd x&=\sum_{n=0}^\infty\frac{(-1)^n}{n!\,(2n+1)}\\
&=1-\frac13+\frac1{10}-\frac1{42}+\frac1{216}-\frac1{1320}+\frac1{9360}-\cdots.
\end{aligned}
$$

各项的绝对值递减趋于$0$，由:term[交错级数判别法]{id="math.calculus.alternating-series-test"}（alternating series test），误差不超过第一个丢掉的项。$\frac1{1320}\approx0.00076$还不够小，$\frac1{9360}\approx0.00011$够了，所以取前$6$项：$1-\frac13+\frac1{10}-\frac1{42}+\frac1{216}-\frac1{1320}\approx0.7467$，实际值约是$0.74682$。

## 常见误区

- 「逐项求导以后，:term[收敛域]{id="math.calculus.domain-of-convergence"}不变。」:term[收敛半径]{id="math.calculus.radius-of-convergence"}不变，端点却可能变：$\sum\frac{x^n}{n^2}$在$x=1$处收敛，求导后的$\sum\frac{x^{n-1}}n$在$x=1$处是:term[调和级数]{id="math.calculus.harmonic-series"}（harmonic series），发散。
- 「$\arctan x$处处有定义，它的展开式也处处成立。」只在$|x|\le1$成立；$x=2$时:term[级数]{id="math.calculus.series"}的通项不趋于$0$。
- 「$\sum_{n=1}^\infty nx^n=\frac1{(1-x)^2}$。」差一个因子$x$：$\sum nx^{n-1}=\frac1{(1-x)^2}$，$\sum nx^n=\frac x{(1-x)^2}$。

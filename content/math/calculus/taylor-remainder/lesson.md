---
id: math.calculus.taylor-remainder
title: |
  泰勒公式的余项与误差估计
goal: |
  会用拉格朗日余项估计用泰勒多项式近似函数时的误差。
prerequisites: [math.calculus.taylor-polynomial]
minutes: 26
summary: |
  余项是$\frac{f^{(n+1)}(\xi)}{(n+1)!}(x-a)^{n+1}$，$|f^{(n+1)}|\le M$时误差不超过$\frac{M|x-a|^{n+1}}{(n+1)!}$。
status: reviewed
---

## 这一节要回答的问题

用$1+x+\frac{x^2}{2!}+\cdots+\frac{x^n}{n!}$近似$e^x$，算$e$要准确到$10^{-6}$，$n$至少取几？带:term[佩亚诺余项]{id="math.calculus.peano-remainder"}（Peano remainder）的:term[泰勒公式]{id="math.calculus.taylor-formula"}（Taylor's formula）只说误差是$o\bigl((x-a)^n\bigr)$，即$x\to a$时比$(x-a)^n$小得多，没说在一个具体的$x$处误差到底有多大。[微分与线性近似](lesson:math.calculus.differentials)第 6 题估计过$\sqrt{1+x}\approx1+\frac x2$的误差，一般的函数怎样估计？

## 讲解

### 拉格朗日余项

$n=0$时，$T_0(x)=f(a)$，:term[余项]{id="math.calculus.remainder"}（remainder）$f(x)-f(a)$由:term[中值定理]{id="math.calculus.mean-value-theorem"}（mean value theorem）写成$f'(\xi)(x-a)$，$\xi$在$a$和$x$之间。这正是下一项$f'(a)(x-a)$的样子，只是:term[导数]{id="math.calculus.derivative"}（derivative）换到了一个不知道在哪里的点$\xi$上。下面的定理把这件事推广到任意$n$。

::anchor{id="thm-lagrange-remainder"}
**定理**　设$f$在包含$a$的区间$I$上$n+1$阶可导，$x\in I$，$T_n$是$f$在$a$处的$n$阶:term[泰勒多项式]{id="math.calculus.taylor-polynomial"}（Taylor polynomial），那么在$a$和$x$之间有一点$\xi$，使$f(x)=T_n(x)+R_n(x)$，其中$R_n(x)=\frac{f^{(n+1)}(\xi)}{(n+1)!}(x-a)^{n+1}$。$R_n(x)$的这种写法叫作:term[拉格朗日余项]{id="math.calculus.lagrange-remainder"}（Lagrange remainder），这个等式叫作带拉格朗日余项的:term[泰勒公式]{id="math.calculus.taylor-formula"}。

道理：记$R(t)=f(t)-T_n(t)$，$g(t)=(t-a)^{n+1}$。$T_n$在$a$处的前$n$阶导数和$f$的一样，所以$R$和它的前$n$阶导数在$a$处都是$0$；$g$也是这样，并且$g^{(n+1)}=(n+1)!$，$R^{(n+1)}=f^{(n+1)}$。对$R$、$g$连用$n+1$次:term[柯西中值定理]{id="math.calculus.cauchy-mean-value-theorem"}（Cauchy's mean value theorem），每次在$a$和上一个点之间得到一个新的点：

$$
\frac{R(x)}{g(x)}=\frac{R'(\xi_1)}{g'(\xi_1)}=\cdots=\frac{R^{(n+1)}(\xi_{n+1})}{g^{(n+1)}(\xi_{n+1})}=\frac{f^{(n+1)}(\xi_{n+1})}{(n+1)!}.
$$

取$\xi=\xi_{n+1}$，两边乘以$g(x)=(x-a)^{n+1}$，就是要证的等式。

为什么有用：$\xi$在哪里不知道，可只要知道$f^{(n+1)}$在$a$和$x$之间的范围，就能估计误差。边界情况：和:term[佩亚诺余项]{id="math.calculus.peano-remainder"}相比，它要求$f$在整个区间上$n+1$阶可导，而不只是在$a$处$n$阶可导；$\xi$随$x$、$n$而变，不是一个固定的数。

### 误差估计

::anchor{id="thm-remainder-bound"}
**推论**　如果在$a$和$x$之间处处$\bigl|f^{(n+1)}\bigr|\le M$，那么用$T_n(x)$近似$f(x)$的误差满足$|R_n(x)|\le\frac{M}{(n+1)!}|x-a|^{n+1}$。

这个上界里有两个因素：$|x-a|^{n+1}$说明离$a$越远误差越大，$(n+1)!$说明多取几项误差会缩小；$n$增大时，$(n+1)!$比$|x-a|^{n+1}$长得快。对$e^x$、$\sin x$、$\cos x$，$f^{(n+1)}$在有界区间上有一个和$n$无关的上界，所以不管$x$在哪里，$n$足够大时误差都趋于$0$（第 6 题）；可不是所有函数都这样（第 8 题）。

$\sin x$的:term[麦克劳林多项式]{id="math.calculus.maclaurin-polynomial"}（Maclaurin polynomial）里偶次项都是$0$，所以$T_3=T_4$。用$T_3$近似$\sin x$时，把它看成$T_4$，用$R_4$估计，得$\bigl|\sin x-\bigl(x-\frac{x^3}6\bigr)\bigr|\le\frac{|x|^5}{120}$，比用$R_3$得到的$\frac{x^4}{24}$好得多（例 2）。:term[拉格朗日余项]{id="math.calculus.lagrange-remainder"}也给出[微分与线性近似](lesson:math.calculus.differentials)第 6 题的结论：$\sqrt{1+x}$的$R_1(x)=-\frac{x^2}{8(1+\xi)^{3/2}}$，$x\ge0$时$\xi\ge0$，误差不超过$\frac{x^2}8$。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-6, 6], y: [-3, 3] }
functions:
  - expr: "sin(x)"
    label: |
      $y=\sin x$
  - expr: "sum(k, 0, (m - 1)/2, (-1)^k * prod(j, 1, 2k + 1, x/j))"
    label: |
      $y=T_m(x)$
  - expr: "sum(k, 0, (m - 1)/2, (-1)^k * prod(j, 1, 2k + 1, x/j)) + prod(j, 1, m + 2, abs(x)/j)"
    label: |
      $y=T_m(x)+\frac{|x|^{m+2}}{(m+2)!}$
  - expr: "sum(k, 0, (m - 1)/2, (-1)^k * prod(j, 1, 2k + 1, x/j)) - prod(j, 1, m + 2, abs(x)/j)"
    label: |
      $y=T_m(x)-\frac{|x|^{m+2}}{(m+2)!}$
sliders:
  - name: m
    min: 1
    max: 11
    step: 2
    default: 3
    label: |
      泰勒多项式的阶数$m$（奇数）
:::

蓝色是$\sin x$，橙色是它的$m$阶:term[麦克劳林多项式]{id="math.calculus.maclaurin-polynomial"}$T_m$。绿色、紫色两条曲线是$T_m$加、减误差的上界$\frac{|x|^{m+2}}{(m+2)!}$，蓝色曲线始终夹在它们中间。$x$离$0$越远，两条曲线张得越开；$m$每加$2$，在更大的范围里两条曲线贴在一起，误差在这个范围里都很小。

## 例题

### 例 1　算$e$到$10^{-6}$

$n$取多少，能保证$T_n(1)=1+1+\frac1{2!}+\cdots+\frac1{n!}$和$e$的差小于$10^{-6}$？

**为什么想到这么做**：$(e^x)^{(n+1)}=e^x$，在$0$和$1$之间不超过$e<3$，用推论，$M=3$。

**推导**：$0<R_n(1)=\frac{e^\xi}{(n+1)!}<\frac3{(n+1)!}$，$0<\xi<1$。要$\frac3{(n+1)!}<10^{-6}$，即$(n+1)!>3\times10^6$。$9!=362880$不够，$10!=3628800$够了，所以$n+1=10$，$n=9$。$T_9(1)=2.7182815\cdots$，误差小于$\frac3{10!}\approx8.3\times10^{-7}$。

### 例 2　$\sin x\approx x-\frac{x^3}6$有多准

$|x|\le0.5$时，估计用$x-\frac{x^3}6$近似$\sin x$的误差。

**为什么想到这么做**：$x-\frac{x^3}6$既是$T_3$也是$T_4$，用$R_4$估计；$(\sin x)^{(5)}=\cos x$，$M=1$。

**推导**：$|R_4(x)|=\Bigl|\frac{\cos\xi}{5!}x^5\Bigr|\le\frac{|x|^5}{120}$，$|x|\le0.5$时不超过$\frac{0.5^5}{120}\approx2.6\times10^{-4}$。用$R_3$只能得到$\frac{0.5^4}{24}\approx2.6\times10^{-3}$，差了十倍左右，所以$\sin0.5\approx0.5-\frac{0.125}6=0.47917$至少准确到小数点后三位。

## 常见误区

- 「$\xi$是一个确定的数，和$x$无关。」$\xi$随$x$和$n$而变，定理只说它存在；能用的只是它所在的范围。
- 「多取几项，误差一定更小。」要看函数和$x$。$e^x$在任何$x$处都是这样，$\ln(1+x)$在$x=2$处，项取得越多，$T_n(2)$反而离$\ln3$越远（第 8 题）。
- 「:term[拉格朗日余项]{id="math.calculus.lagrange-remainder"}和:term[佩亚诺余项]{id="math.calculus.peano-remainder"}一样，只在$x\to a$时有用。」拉格朗日余项给的是一个具体$x$处的误差范围；佩亚诺余项只说$x\to a$时误差比$(x-a)^n$小得多，求:term[极限]{id="math.calculus.limit"}（limit，lim）时用它。

---
id: math.calculus.dirac-delta
title: |
  狄拉克 δ 函数
goal: |
  会把$\delta$函数理解成越来越窄的尖峰的极限，并用它的筛选性质计算积分。
prerequisites: [math.calculus.improper-integrals]
minutes: 25
summary: |
  $\delta$是面积为$1$的尖峰的极限；$\int f(x)\delta(x-a)\dd x=f(a)$。
status: reviewed
---

## 这一节要回答的问题

一根细棒的总质量是$1$，均匀地分布在原点附近长$\varepsilon$的一小段上：那一段上的密度是$\frac1\varepsilon$，别处是$0$。让$\varepsilon$越来越小，原点处的密度越来越大，总质量却始终是$1$。质量全部集中到原点时，密度该怎样写？在原点以外处处为$0$的普通函数，积分只能是$0$，不会是$1$。

## 讲解

### 越来越窄的尖峰

对$\varepsilon>0$，记

$$
\delta_\varepsilon(x)=\begin{cases}\dfrac1\varepsilon, & |x|\le\dfrac\varepsilon2,\\[4pt] 0, & |x|>\dfrac\varepsilon2.\end{cases}
$$

它的图像是高$\frac1\varepsilon$、宽$\varepsilon$的矩形尖峰。:term[反常积分]{id="math.calculus.improper-integral"}（improper integral）$\int_{-\infty}^{+\infty}\delta_\varepsilon(x)\,\dd x$其实只在$\bigl[-\frac\varepsilon2,\frac\varepsilon2\bigr]$上积，等于$\frac1\varepsilon\cdot\varepsilon=1$：不管$\varepsilon$多小，尖峰和横轴围成的面积总是$1$。

为什么看这样的尖峰：它正是开头那根细棒的密度。$\varepsilon\to0^+$时，$\delta_\varepsilon(x)$在每个$x\ne0$处从某个时候起一直是$0$，在$x=0$处趋于:term[无穷大]{id="math.calculus.infinity"}（infinity），面积却始终是$1$。边界情况：逐点取极限，得到的是一个在$x\ne0$处为$0$的「函数」，它的积分是$0$，面积$1$在取极限时丢掉了；所以要先积分、再取极限，不能反过来。

### 狄拉克$\delta$函数

::anchor{id="def-dirac-delta"}
尖峰$\delta_\varepsilon$在$\varepsilon\to0^+$时的极限记作$\delta(x)$，叫作:term[狄拉克$\delta$函数]{id="math.calculus.dirac-delta"}（Dirac delta function），简称$\delta$函数。它不是逐点取值的普通函数，只有放在积分里才有意义：设$f$在包含$a$的一个开区间上:term[连续]{id="math.calculus.continuous"}（continuous），规定$\int_{-\infty}^{+\infty}f(x)\,\delta(x-a)\,\dd x$等于$\int_{-\infty}^{+\infty}f(x)\,\delta_\varepsilon(x-a)\,\dd x$在$\varepsilon\to0^+$时的极限，:term[积分区间]{id="math.calculus.interval-of-integration"}（interval of integration）换成$[p,q]$时同样规定。

为什么这样定义：细棒上集中在一点的质量、锤子在一瞬间的敲击，用到的都是它和别的函数相乘再积分的结果，所以只要规定它在积分里是什么意思。取$f=1$、$a=0$，得$\int_{-\infty}^{+\infty}\delta(x)\,\dd x=1$；积分区间$[p,q]$不含$a$时，$\varepsilon$足够小以后$\delta_\varepsilon(x-a)$在$[p,q]$上处处为$0$，积分是$0$，这就是「$\delta(x-a)$在$x\ne a$处为$0$」的意思。边界情况：$f$在$a$处间断时，极限和尖峰的形状有关，见「常见误区」。

### 筛选性质

::anchor{id="thm-sifting"}
**定理（:term[筛选性质]{id="math.calculus.sifting-property"}，sifting property）**　设$f$在包含$a$的一个开区间上:term[连续]{id="math.calculus.continuous"}，则$\int_{-\infty}^{+\infty}f(x)\,\delta(x-a)\,\dd x=f(a)$。:term[积分区间]{id="math.calculus.interval-of-integration"}换成$[p,q]$、$p<a<q$时也一样。

道理：$\varepsilon$足够小时，$\bigl[a-\frac\varepsilon2,a+\frac\varepsilon2\bigr]$落在这个开区间里，在它外面$\delta_\varepsilon(x-a)=0$，所以积分等于$\frac1\varepsilon\int_{a-\varepsilon/2}^{a+\varepsilon/2}f(x)\,\dd x$。由:term[积分中值定理]{id="math.calculus.integral-mean-value-theorem"}（mean value theorem for integrals），它等于$f(\xi_\varepsilon)$，$\xi_\varepsilon$在$a-\frac\varepsilon2$和$a+\frac\varepsilon2$之间。$\varepsilon\to0^+$时$\xi_\varepsilon\to a$，由$f$的连续性，$f(\xi_\varepsilon)\to f(a)$。

为什么叫筛选：整条曲线$f$进到积分里，出来的只是它在$a$处的一个值，别处的值都被筛掉了，比如$\int_0^{+\infty}\cos t\,\delta(t-\pi)\,\dd t=\cos\pi=-1$。边界情况：$a$正好是积分区间的端点时，比如$\int_0^{+\infty}f(x)\,\delta(x)\,\dd x$，对称的矩形只有右边一半在区间里，积分趋于$\frac{f(0)}2$；换成$[0,\varepsilon]$上的矩形，积分趋于$f(0)$。这时结果取决于用哪种尖峰，要另外约定。

### 伸缩

::anchor{id="thm-delta-scaling"}
**定理**　设$\lambda\ne0$，$f$在包含$a$的一个开区间上:term[连续]{id="math.calculus.continuous"}，则$\int_{-\infty}^{+\infty}f(x)\,\delta\bigl(\lambda(x-a)\bigr)\,\dd x=\frac{f(a)}{|\lambda|}$，也就是说，在积分里$\delta\bigl(\lambda(x-a)\bigr)$可以换成$\frac1{|\lambda|}\delta(x-a)$。

道理：$\bigl|\lambda(x-a)\bigr|\le\frac\varepsilon2$就是$|x-a|\le\frac\varepsilon{2|\lambda|}$，所以$\delta_\varepsilon\bigl(\lambda(x-a)\bigr)$是以$a$为中心、高$\frac1\varepsilon$、宽$\frac\varepsilon{|\lambda|}$的矩形，面积是$\frac1{|\lambda|}$。它正是$\frac1{|\lambda|}\delta_{\varepsilon/|\lambda|}(x-a)$：宽一样，高$\frac1{|\lambda|}\cdot\frac{|\lambda|}\varepsilon$也是$\frac1\varepsilon$。$\varepsilon\to0^+$时$\frac\varepsilon{|\lambda|}$也趋于$0$，照:term[筛选性质]{id="math.calculus.sifting-property"}的证明，积分趋于$\frac{f(a)}{|\lambda|}$。

为什么有用：$\delta(2x)$只有$\delta(x)$的一半「重」，$\lambda=-1$又给出$\delta(-x)=\delta(x)$。单位也由此看出：$x$以米为单位时，$\int_{-\infty}^{+\infty}\delta(x)\,\dd x=1$是纯数，所以$\delta(x)$的单位是$\mathrm{m}^{-1}$。边界情况：不能因为两者在$0$处都「是:term[无穷大]{id="math.calculus.infinity"}」就认为$\delta(2x)=\delta(x)$，尖峰窄了一半，面积也只剩一半。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-2, 2], y: [-0.5, 10.5] }
functions:
  - expr: "(1 + sign(eps/2 - abs(x)))/(2*eps)"
    label: |
      矩形尖峰$y=\delta_\varepsilon(x)$
  - expr: "max(0, eps - abs(x))/eps^2"
    label: |
      三角形尖峰，高$\frac1\varepsilon$、底宽$2\varepsilon$
sliders:
  - name: eps
    min: 0.1
    max: 1.5
    step: 0.05
    default: 0.5
    label: |
      宽度参数$\varepsilon$
:::

蓝色的是矩形尖峰$\delta_\varepsilon$，橙色的是三角形尖峰：两者的高都是$\frac1\varepsilon$，矩形宽$\varepsilon$，三角形底宽$2\varepsilon$，面积都是$1$。把$\varepsilon$往小拖，两个尖峰都越来越高、越来越窄，在$x\ne0$处很快变成$0$，面积却一直是$1$。形状不同，取极限得到的却是同一个:term[$\delta$函数]{id="math.calculus.dirac-delta"}：放在积分里，三角形尖峰也把:term[连续函数]{id="math.calculus.continuous"}在$0$处的值筛出来（第 6 题）。

## 例题

### 例 1　筛出一个值

计算$\int_{-\infty}^{+\infty}(x^3-2x)\,\delta(x-2)\,\dd x$和$\int_{-1}^{1}\cos x\,\delta(x-3)\,\dd x$。

**为什么想到这么做**：被积式是一个:term[连续函数]{id="math.calculus.continuous"}乘$\delta(x-a)$，用:term[筛选性质]{id="math.calculus.sifting-property"}，只要看$a$在不在:term[积分区间]{id="math.calculus.interval-of-integration"}里面。

**推导**：$x^3-2x$处处连续，$a=2$，第一个积分等于$2^3-2\cdot2=4$。第二个积分里$a=3$不在$[-1,1]$上，$\varepsilon<4$时$\delta_\varepsilon(x-3)$在$[-1,1]$上处处为$0$，积分是$0$。

### 例 2　括号里有系数

计算$\int_{-\infty}^{+\infty}(x^2+x)\,\delta(6-2x)\,\dd x$。

**为什么想到这么做**：把括号里写成$\lambda(x-a)$的样子，$6-2x=-2(x-3)$，再用伸缩的定理。

**推导**：$\lambda=-2$，$a=3$，$|\lambda|=2$，积分等于$\frac{3^2+3}{2}=6$。检验：尖峰处处不小于$0$，$x=3$附近$x^2+x>0$，结果应当是正的；忘了取绝对值会得到$-6$，忘了除以$|\lambda|$会得到$12$。

## 常见误区

- 「$\delta(x)$是在$0$处取很大值、别处为$0$的普通函数。」这样的普通函数积分是$0$，不是$1$；:term[$\delta$函数]{id="math.calculus.dirac-delta"}只有放在积分里才有意义，算的时候用:term[筛选性质]{id="math.calculus.sifting-property"}。
- 「$\delta(2x)$和$\delta(x)$一样，反正在$0$处都是:term[无穷大]{id="math.calculus.infinity"}。」尖峰窄了一半，面积也只剩一半：$\delta(2x)=\frac12\delta(x)$。
- 「$f$在$a$处间断也能筛出$f(a)$。」比如$f(x)$在$x<0$时为$0$、$x\ge0$时为$1$，对称的矩形尖峰给出$\frac12$，$[0,\varepsilon]$上的矩形给出$1$，结果和尖峰的形状有关；筛选性质要求$f$在$a$附近:term[连续]{id="math.calculus.continuous"}。

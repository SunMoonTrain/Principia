---
id: math.calculus.improper-integrals
title: |
  无穷区间上的反常积分
goal: |
  会计算无穷区间上的反常积分，并用比较判别法判断它是否收敛。
prerequisites: [math.calculus.fundamental-theorem]
minutes: 27
summary: |
  $\int_a^{+\infty}f\,\dd x=\lim_{b\to+\infty}\int_a^bf\,\dd x$；$\int_1^{+\infty}\frac{\dd x}{x^p}$在$p>1$时收敛。
status: reviewed
---

## 这一节要回答的问题

曲线$y=\frac1{x^2}$在$x\ge1$的部分和$x$轴之间，夹着一块向右无限延伸的图形，它的面积是有限的吗？把一个物体从地面移到离地球无限远的地方，克服万有引力要做多少功？:term[定积分]{id="math.calculus.definite-integral"}（definite integral）只对有界的闭区间定义，:term[分割]{id="math.calculus.partition"}（partition）只能分成有限段，:term[积分区间]{id="math.calculus.interval-of-integration"}（interval of integration）伸到无穷远时该怎么理解？

## 讲解

### 定义

::anchor{id="def-improper-integral"}
设$f$在$[a,+\infty)$上:term[连续]{id="math.calculus.continuous"}（continuous）。如果$b\to+\infty$时$\int_a^bf(x)\,\dd x$的:term[无穷远处的极限]{id="math.calculus.limit-at-infinity"}（limit at infinity）存在，就说:term[反常积分]{id="math.calculus.improper-integral"}（improper integral）$\int_a^{+\infty}f(x)\,\dd x$收敛（converge），并把这个极限作为它的值；极限不存在，就说它发散（diverge）。$\int_{-\infty}^bf(x)\,\dd x$同样定义，让下限趋于$-\infty$。

为什么这样定义：在每个有限区间$[a,b]$上积分都有意义，先积分，再让$b$往右走，看结果是否稳定在一个数上。$\int_1^b\frac{\dd x}{x^2}=1-\frac1b$，$b\to+\infty$时趋于$1$，开头那块无限长的图形，面积是$1$；$\int_1^b\frac{\dd x}x=\ln b$没有上界，$\int_1^{+\infty}\frac{\dd x}x$发散。边界情况：发散不一定是越积越大，$\int_0^b\cos x\,\dd x=\sin b$在$-1$和$1$之间来回摆，没有极限，$\int_0^{+\infty}\cos x\,\dd x$也发散。

$F$是$f$的:term[原函数]{id="math.calculus.antiderivative"}（antiderivative）时，由:term[牛顿-莱布尼茨公式]{id="math.calculus.newton-leibniz-formula"}（Newton-Leibniz formula），$\int_a^bf(x)\,\dd x=F(b)-F(a)$，所以反常积分收敛，就是$\lim_{b\to+\infty}F(b)$存在。记$F(x)\Big|_a^{+\infty}=\lim_{b\to+\infty}F(b)-F(a)$，计算时就可以写$\int_1^{+\infty}\frac{\dd x}{x^2}=-\frac1x\Big|_1^{+\infty}=1$。

::anchor{id="def-improper-both-ends"}
$f$在$(-\infty,+\infty)$上连续时，任取一点$c$，如果$\int_{-\infty}^cf(x)\,\dd x$和$\int_c^{+\infty}f(x)\,\dd x$都收敛，就说$\int_{-\infty}^{+\infty}f(x)\,\dd x$收敛，值是两者之和；有一个发散，它就发散。

为什么要拆成两个：两端各自伸到无穷远，要各自收敛；由:term[区间可加性]{id="math.calculus.additivity-over-intervals"}（additivity over intervals），换一个$c$，两部分此消彼长，和不变。边界情况：不能让两端同步趋于无穷。对每个$b$都有$\int_{-b}^bx\,\dd x=0$，可$\int_0^{+\infty}x\,\dd x$发散，所以$\int_{-\infty}^{+\infty}x\,\dd x$发散。

### 幂函数的反常积分

::anchor{id="thm-power-improper"}
**定理**　$\int_1^{+\infty}\frac{\dd x}{x^p}$在$p>1$时收敛，值是$\frac1{p-1}$；在$p\le1$时发散。

道理：$p\ne1$时$\int_1^b\frac{\dd x}{x^p}=\frac{b^{1-p}-1}{1-p}$。$p>1$时$b^{1-p}\to0$，积分趋于$\frac1{p-1}$；$p<1$时$b^{1-p}$没有上界。$p=1$时积分是$\ln b$，也没有上界。

为什么重要：$\frac1x$和$\frac1{x^2}$都趋于$0$，前者趋于$0$太慢，面积越积越多，后者快到面积有限，分界正好在$p=1$。这一族积分好算，下面拿它们作比较的标准。边界情况：:term[被积函数]{id="math.calculus.integrand"}（integrand）趋于$0$，不能保证:term[反常积分]{id="math.calculus.improper-integral"}收敛，$\frac1x$就是例子。

### 比较判别法

::anchor{id="thm-improper-comparison"}
**定理（:term[比较判别法]{id="math.calculus.improper-comparison-test"}，comparison test）**　设$f$、$g$在$[a,+\infty)$上:term[连续]{id="math.calculus.continuous"}，并且$0\le f(x)\le g(x)$。如果$\int_a^{+\infty}g(x)\,\dd x$收敛，那么$\int_a^{+\infty}f(x)\,\dd x$也收敛；如果$\int_a^{+\infty}f(x)\,\dd x$发散，那么$\int_a^{+\infty}g(x)\,\dd x$也发散。

道理：$f\ge0$，所以$\Phi(b)=\int_a^bf(x)\,\dd x$随$b$增大而增大；由:term[保序性]{id="math.calculus.integral-monotonicity"}（monotonicity，见[定积分的性质](lesson:math.calculus.integral-properties#thm-monotone-integral)），它不超过$\int_a^{+\infty}g(x)\,\dd x$。递增、有上界的函数在$b\to+\infty$时有:term[极限]{id="math.calculus.limit-at-infinity"}，这和[两个重要极限](lesson:math.calculus.special-limits)里用的:term[单调有界原理]{id="math.analysis.monotone-convergence-theorem"}（monotone convergence theorem）是一回事，这里不证。后一半是前一半的:term[逆否命题]{id="math.logic-sets.contrapositive"}（contrapositive）。

为什么有用：很多:term[反常积分]{id="math.calculus.improper-integral"}找不到:term[原函数]{id="math.calculus.antiderivative"}，可往往只要知道它收敛与否。$x\ge1$时$x^2\ge x$，$0<e^{-x^2}\le e^{-x}$，而$\int_1^{+\infty}e^{-x}\,\dd x=\frac1e$，所以$\int_1^{+\infty}e^{-x^2}\,\dd x$收敛；$e^{-x^2}$是偶函数（even function），$\int_{-\infty}^{+\infty}e^{-x^2}\,\dd x$也收敛，它的值$\sqrt\pi$要到[极坐标下的二重积分](lesson:math.vector-calculus.polar-double-integrals)里才算得出。边界情况：判别法只能由大的收敛推出小的收敛、由小的发散推出大的发散；比发散的函数小，什么也推不出来。

### 绝对收敛

::anchor{id="def-absolute-convergence"}
如果$\int_a^{+\infty}|f(x)|\,\dd x$收敛，就说$\int_a^{+\infty}f(x)\,\dd x$:term[绝对收敛]{id="math.calculus.absolutely-convergent-integral"}（absolutely convergent）。绝对收敛的:term[反常积分]{id="math.calculus.improper-integral"}一定收敛。

道理：$0\le f+|f|\le2|f|$，由:term[比较判别法]{id="math.calculus.improper-comparison-test"}，$\int_a^{+\infty}\bigl(f+|f|\bigr)\dd x$收敛；$f=\bigl(f+|f|\bigr)-|f|$，两个收敛的反常积分相减，仍然收敛。

为什么有用：$f$有正有负时比较判别法不能直接用，先看$|f|$。比如$\Bigl|\frac{\sin x}{x^2}\Bigr|\le\frac1{x^2}$，所以$\int_1^{+\infty}\frac{\sin x}{x^2}\,\dd x$绝对收敛。边界情况：收敛不一定绝对收敛，$\int_1^{+\infty}\frac{\sin x}x\,\dd x$收敛，$\int_1^{+\infty}\frac{|\sin x|}x\,\dd x$却发散（第 6 题）。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-1, 41], y: [-0.4, 4.2] }
functions:
  - expr: "1/x^2 + 0*sqrt(x - 1)"
    label: |
      $y=\frac1{x^2}$
  - expr: "1/x + 0*sqrt(x - 1)"
    label: |
      $y=\frac1x$
  - expr: "1 - 1/x + 0*sqrt((x - 1)*(b - x))"
    label: |
      $\int_1^x\frac{\dd t}{t^2}=1-\frac1x$
  - expr: "ln(x) + 0*sqrt((x - 1)*(b - x))"
    label: |
      $\int_1^x\frac{\dd t}t=\ln x$
points:
  - { x: "b", y: "1 - 1/b" }
  - { x: "b", y: "ln(b)" }
sliders:
  - name: b
    min: 3
    max: 40
    step: 0.5
    default: 5
    label: |
      积分上限$b$
:::

蓝色曲线$y=\frac1{x^2}$和橙色曲线$y=\frac1x$都从$x=1$出发，都贴着$x$轴趋于$0$，往右看几乎分不出来。绿色、紫色曲线是它们从$1$积到$x$的面积，画到上限$b$为止。拖动$b$：绿色曲线越来越平，贴近高度$1$，再往右也越不过$1$，$\int_1^{+\infty}\frac{\dd x}{x^2}=1$；紫色曲线也越来越平，却一直在升，$b=40$时约为$3.7$，要升到$10$，$b$得超过$22000$，它没有上界，$\int_1^{+\infty}\frac{\dd x}x$发散。

## 例题

### 例 1　把物体移到无穷远

地球的质量为$M$、半径为$R$，质量为$m$的物体离地心$r$时，受到的万有引力大小是$\frac{GMm}{r^2}$。把它从地面缓慢地移到无穷远，克服引力要做多少功？

**为什么想到这么做**：力随距离变化，在每一小段上几乎不变，功近似是「力乘距离」之和，和由速度求路程一样，是力对距离的积分。距离从$R$一直增大，:term[积分上限]{id="math.calculus.upper-limit-of-integration"}（upper limit of integration）是$+\infty$。

**推导**：

$$
W=\int_R^{+\infty}\frac{GMm}{r^2}\,\dd r=GMm\Bigl(-\frac1r\Bigr)\Big|_R^{+\infty}=\frac{GMm}R.
$$

功是有限的：引力随距离减弱得够快，和$\int_1^{+\infty}\frac{\dd x}{x^2}$收敛是一个道理。所以只要物体在地面上的动能不少于$\frac{GMm}R$，不计空气阻力，它就能飞到无穷远。

### 例 2　看被积函数在远处像什么

判断$\int_1^{+\infty}\frac{\dd x}{\sqrt{x^3+x}}$和$\int_1^{+\infty}\frac{x\,\dd x}{x^2+1}$是否收敛。

**为什么想到这么做**：只问收敛与否，用:term[比较判别法]{id="math.calculus.improper-comparison-test"}。$x$很大时，$\sqrt{x^3+x}$主要是$x^{3/2}$，$\frac x{x^2+1}$主要是$\frac1x$，所以拿$p=\frac32$和$p=1$的积分来比：前者要找一个比它大的、积分收敛的函数，后者要找一个比它小的、积分发散的函数。

**推导**：$\sqrt{x^3+x}\ge x^{3/2}$，所以$0<\frac1{\sqrt{x^3+x}}\le\frac1{x^{3/2}}$，而$p=\frac32>1$，第一个积分收敛。$x\ge1$时$x^2+1\le2x^2$，所以$\frac x{x^2+1}\ge\frac1{2x}$，而$\int_1^{+\infty}\frac{\dd x}{2x}$发散，第二个积分发散。

## 常见误区

- 「:term[被积函数]{id="math.calculus.integrand"}趋于$0$，:term[反常积分]{id="math.calculus.improper-integral"}就收敛。」$\frac1x\to0$，$\int_1^{+\infty}\frac{\dd x}x$却发散。
- 「$\int_{-\infty}^{+\infty}f(x)\,\dd x$就是$\lim_{b\to+\infty}\int_{-b}^bf(x)\,\dd x$。」两端要各自收敛。$\frac x{1+x^2}$是奇函数（odd function），$\int_{-b}^b\frac{x\,\dd x}{1+x^2}=0$，可$\int_0^b\frac{x\,\dd x}{1+x^2}=\frac12\ln(1+b^2)$没有上界，$\int_{-\infty}^{+\infty}\frac{x\,\dd x}{1+x^2}$发散。
- 「$0\le f\le g$，$\int_a^{+\infty}g(x)\,\dd x$发散，所以$\int_a^{+\infty}f(x)\,\dd x$也发散。」比发散的小，推不出发散：$\frac1{x^2}\le\frac1x$，$\int_1^{+\infty}\frac{\dd x}{x^2}$却收敛。

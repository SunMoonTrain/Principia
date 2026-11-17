---
id: math.calculus.improper-unbounded
title: |
  无界函数的反常积分
goal: |
  会计算无界函数的反常积分，并判断它是否收敛。
prerequisites: [math.calculus.improper-integrals]
minutes: 25
summary: |
  在瑕点附近挖掉一小段再取极限；$\int_0^1\frac{\dd x}{x^p}$在$p<1$时收敛。
status: reviewed
---

## 这一节要回答的问题

$y=\frac1{\sqrt x}$在$x\to0^+$时无限增大，它在$(0,1]$上和$x$轴之间的图形向上无限延伸，面积是有限的吗？[微积分基本定理](lesson:math.calculus.fundamental-theorem)里，照搬:term[牛顿-莱布尼茨公式]{id="math.calculus.newton-leibniz-formula"}（Newton-Leibniz formula）会得到$\int_{-1}^1\frac{\dd x}{x^2}=-2$，:term[被积函数]{id="math.calculus.integrand"}（integrand）处处为正，积分却是负的。被积函数在某一点附近无界，积分该怎么理解、怎么算？

## 讲解

### 瑕点与定义

无界的函数不:term[可积]{id="math.calculus.integrable"}（integrable）：在[定积分与黎曼和](lesson:math.calculus.definite-integral)里看到，$\frac1x$在$(0,1]$上的:term[黎曼和]{id="math.calculus.riemann-sum"}（Riemann sum）可以任意大。办法和无穷区间时一样：先避开出问题的地方积分，再让避开的那一段缩短。

::anchor{id="def-improper-unbounded"}
设$f$在$(a,b]$上:term[连续]{id="math.calculus.continuous"}（continuous），在$a$的右侧附近无界，$a$叫作$f$的瑕点（singular point）。如果$\int_{a+\varepsilon}^bf(x)\,\dd x$作为$\varepsilon$的函数在$0$处的:term[右极限]{id="math.calculus.right-limit"}（right-hand limit）存在，就说:term[反常积分]{id="math.calculus.improper-integral"}（improper integral）$\int_a^bf(x)\,\dd x$收敛（converge），值就是这个极限；极限不存在，就说它发散（diverge）。瑕点是右端点$b$时，同样取$\int_a^{b-\varepsilon}f(x)\,\dd x$在$\varepsilon\to0^+$时的极限。

为什么这样定义：$[a+\varepsilon,b]$上$f$连续，积分是普通的:term[定积分]{id="math.calculus.definite-integral"}（definite integral）；挖掉的一小段越来越短，看结果是否稳定在一个数上。$\int_\varepsilon^1\frac{\dd x}{\sqrt x}=2-2\sqrt\varepsilon\to2$，开头那块向上无限延伸的图形，面积是$2$；$\int_\varepsilon^1\frac{\dd x}x=-\ln\varepsilon$没有上界，$\int_0^1\frac{\dd x}x$发散。边界情况：$f$在$a$处的右极限存在时，比如$\frac{\sin x}x$在$(0,1]$上，补上$f(a)$就在$[a,b]$上连续，这样取极限得到的就是普通的定积分，不必当成反常积分。

用:term[原函数]{id="math.calculus.antiderivative"}（antiderivative）$F$计算时，$\int_{a+\varepsilon}^bf(x)\,\dd x=F(b)-F(a+\varepsilon)$，反常积分收敛就是$F$在$a$处的右极限存在。$F$在$a$处连续时，照常代入就行：$\int_0^1\frac{\dd x}{\sqrt x}=2\sqrt x\Big|_0^1=2$，$2\sqrt x$在$0$处连续。

### 瑕点在区间内部

::anchor{id="def-interior-singular"}
瑕点$c$在$(a,b)$内部时，如果$\int_a^cf(x)\,\dd x$和$\int_c^bf(x)\,\dd x$都收敛，就说$\int_a^bf(x)\,\dd x$收敛，值是两者之和；有一个发散，它就发散。

为什么这样定义：两侧各自靠近$c$，要各自收敛，和两端都是无穷的情形一样。开头的$\int_{-1}^1\frac{\dd x}{x^2}$，瑕点是$0$，$\int_\varepsilon^1\frac{\dd x}{x^2}=\frac1\varepsilon-1$没有上界，所以它发散；照搬公式得到$-2$，错在$-\frac1x$在$0$处没有定义，不是$\frac1{x^2}$在整个$[-1,1]$上的:term[原函数]{id="math.calculus.antiderivative"}。边界情况：一个积分里瑕点和无穷区间可能同时出现，比如$\int_0^{+\infty}\frac{\dd x}{\sqrt x}$，这时在中间任取一点拆开，每一段只留一种毛病（例 2）。

### 幂函数和比较

::anchor{id="thm-power-unbounded"}
**定理**　$\int_0^1\frac{\dd x}{x^p}$在$p<1$时收敛，值是$\frac1{1-p}$；在$p\ge1$时发散。

道理：$p\ne1$时$\int_\varepsilon^1\frac{\dd x}{x^p}=\frac{1-\varepsilon^{1-p}}{1-p}$。$p<1$时$\varepsilon^{1-p}\to0$，积分趋于$\frac1{1-p}$；$p>1$时$\varepsilon^{1-p}$没有上界。$p=1$时积分是$-\ln\varepsilon$，也没有上界。

为什么和无穷区间相反：在$[1,+\infty)$上要$\frac1{x^p}$趋于$0$得快，$p$越大越好，要$p>1$；在$(0,1]$上要$\frac1{x^p}$增大得慢，$p$越小越好，要$p<1$。$p=1$两头都发散，$\frac1x$正好卡在中间（第 7 题从图形上解释这一点）。

[无穷区间上的反常积分](lesson:math.calculus.improper-integrals)里的:term[比较判别法]{id="math.calculus.improper-comparison-test"}（comparison test）和:term[绝对收敛]{id="math.calculus.absolutely-convergent-integral"}（absolutely convergent），道理不变，把$[a,+\infty)$换成$(a,b]$照样成立。比如在$(0,1]$上$\Bigl|\frac{\cos x}{\sqrt x}\Bigr|\le\frac1{\sqrt x}$，所以$\int_0^1\frac{\cos x}{\sqrt x}\,\dd x$绝对收敛；$\frac{e^x}x\ge\frac1x$，所以$\int_0^1\frac{e^x}x\,\dd x$发散。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-0.05, 1.05], y: [-0.5, 7] }
functions:
  - expr: "1/sqrt(x) + 0*sqrt(1 - x)"
    label: |
      $y=\frac1{\sqrt x}$
  - expr: "1/x + 0*sqrt(x*(1 - x))"
    label: |
      $y=\frac1x$
  - expr: "2 - 2*sqrt(x) + 0*sqrt((x - d)*(1 - x))"
    label: |
      $\int_x^1\frac{\dd t}{\sqrt t}=2-2\sqrt x$
  - expr: "-ln(x) + 0*sqrt((x - d)*(1 - x))"
    label: |
      $\int_x^1\frac{\dd t}t=-\ln x$
points:
  - { x: "d", y: "2 - 2*sqrt(d)" }
  - { x: "d", y: "-ln(d)" }
sliders:
  - name: d
    min: 0.002
    max: 0.6
    step: 0.002
    default: 0.2
    label: |
      积分下限$\varepsilon$
:::

蓝色曲线$y=\frac1{\sqrt x}$和橙色曲线$y=\frac1x$在$x\to0^+$时都冲出图外。绿色、紫色曲线在$x$处的高度，是它们从$x$积到$1$的面积，画到下限$\varepsilon$为止。把$\varepsilon$往$0$拖：绿色曲线贴近高度$2$，越不过去，$\int_0^1\frac{\dd x}{\sqrt x}=2$；紫色曲线一直往上爬，$\varepsilon=0.002$时已经超过$6$，$\int_0^1\frac{\dd x}x$发散。和[无穷区间上的反常积分](lesson:math.calculus.improper-integrals)的图对照，$\frac1x$两头都发散，收敛的一方换成了指数小于$1$的$\frac1{\sqrt x}$。

## 例题

### 例 1　从静止开始滑下要多久

光滑斜面长$L$、倾角为$\alpha$，小物块从顶端由静止滑下，滑过路程$s$时速度是$v=\sqrt{2gs\sin\alpha}$（由机械能守恒，下降的高度是$s\sin\alpha$）。滑到底要多长时间？

**为什么想到这么做**：滑过$\dd s$要用时间$\frac{\dd s}v$，总时间是$\int_0^L\frac{\dd s}v$。出发时$v=0$，:term[被积函数]{id="math.calculus.integrand"}在$s=0$处无界，这是一个:term[反常积分]{id="math.calculus.improper-integral"}；$\frac1v$和$\frac1{\sqrt s}$成正比，指数$\frac12<1$，应当收敛。

**推导**：

$$
T=\int_0^L\frac{\dd s}{\sqrt{2g\sin\alpha}\,\sqrt s}=\frac{2\sqrt s}{\sqrt{2g\sin\alpha}}\Big|_0^L=\sqrt{\frac{2L}{g\sin\alpha}}.
$$

和匀加速运动的公式$L=\frac12(g\sin\alpha)T^2$一致。速度从$0$开始增大，开头那一刻「无限慢」，可速度增大得够快，总时间仍是有限的。

### 例 2　两种毛病一起出现

判断$\int_0^{+\infty}\frac{\dd x}{\sqrt x\,(1+x)}$是否收敛。

**为什么想到这么做**：$x=0$是瑕点，:term[积分区间]{id="math.calculus.interval-of-integration"}（interval of integration）又是无穷的，在$x=1$处拆开，每一段只有一种毛病。靠近$0$时:term[被积函数]{id="math.calculus.integrand"}像$\frac1{\sqrt x}$，很大时像$\frac1{x^{3/2}}$，分别和对应的幂函数比较。

**推导**：在$(0,1]$上$0<\frac1{\sqrt x\,(1+x)}\le\frac1{\sqrt x}$，$\int_0^1\frac{\dd x}{\sqrt x}$收敛，所以$\int_0^1$这一段收敛。在$[1,+\infty)$上$0<\frac1{\sqrt x\,(1+x)}\le\frac1{x^{3/2}}$，$\int_1^{+\infty}\frac{\dd x}{x^{3/2}}$收敛，所以这一段也收敛。两段都收敛，原积分收敛，它的值是$\pi$：令$x=t^2$，用:term[换元积分法]{id="math.calculus.integration-by-substitution"}（integration by substitution）化成$2\int_0^{+\infty}\frac{\dd t}{1+t^2}$就能算出。

## 常见误区

- 「区间里有一点:term[被积函数]{id="math.calculus.integrand"}没有定义，也照样用:term[牛顿-莱布尼茨公式]{id="math.calculus.newton-leibniz-formula"}。」$\int_{-1}^1\frac{\dd x}{x^2}$发散，照搬公式得到的$-2$没有意义；先找瑕点，在瑕点处拆开。
- 「$\int_0^1\frac{\dd x}{x^p}$和$\int_1^{+\infty}\frac{\dd x}{x^p}$的收敛条件一样。」正好相反：前者要$p<1$，后者要$p>1$，$p=1$两个都发散。
- 「$\frac1x$是奇函数（odd function），$\int_{-1}^1\frac{\dd x}x$左右抵消，等于$0$。」瑕点$0$两侧的$\int_{-1}^0\frac{\dd x}x$和$\int_0^1\frac{\dd x}x$都发散，原积分发散，不能让两侧一起挖、互相抵消（第 8 题）。

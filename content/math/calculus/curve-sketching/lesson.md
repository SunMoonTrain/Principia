---
id: math.calculus.curve-sketching
title: |
  函数作图
goal: |
  会综合定义域、渐近线、单调性和凹凸性画出函数图像的草图。
prerequisites: [math.calculus.concavity]
minutes: 26
summary: |
  先由定义域和渐近线搭骨架，再由$f'$、$f''$的正负定升降和弯向。
status: reviewed
---

## 这一节要回答的问题

$y=\frac{x^2}{x-1}$的图像长什么样？描点只能描出有限几个点：点和点之间怎样连，$x$很大时曲线往哪里去，$x$靠近$1$时又会怎样，光靠描点看不出来。:term[极限]{id="math.calculus.limit"}（limit，lim）和:term[导数]{id="math.calculus.derivative"}（derivative）各告诉我们图像的哪些信息，怎样把它们拼成一张草图？

## 讲解

### 斜渐近线

[无穷远处的极限与渐近线](lesson:math.calculus.limits-at-infinity)第 7 题说，$y=x+\frac1x$在远处贴着直线$y=x$：两者的差$\frac1x$趋于$0$。这条直线不水平，不是:term[水平渐近线]{id="math.calculus.horizontal-asymptote"}（horizontal asymptote），可作用一样。

::anchor{id="def-oblique-asymptote"}
如果有常数$k\ne0$和$b$，使$\lim_{x\to+\infty}\bigl[f(x)-(kx+b)\bigr]=0$，就说直线$y=kx+b$是曲线$y=f(x)$在$x\to+\infty$时的:term[斜渐近线]{id="math.calculus.oblique-asymptote"}（oblique asymptote）；$x\to-\infty$时同样定义。

为什么这样定义：曲线和直线的竖直距离趋于$0$，远处的曲线看上去就是这条直线，草图里先画出它，曲线贴着它画。$k=0$时，这就是水平渐近线的定义。边界情况：$x^2$、$\sqrt x$在$x\to+\infty$时都没有斜渐近线，前者增长得比任何直线都快，后者比任何不水平的直线都慢。

::anchor{id="thm-oblique-asymptote"}
**定理**　$y=kx+b$（$k\ne0$）是曲线$y=f(x)$在$x\to+\infty$时的:term[斜渐近线]{id="math.calculus.oblique-asymptote"}，当且仅当$k=\lim_{x\to+\infty}\frac{f(x)}x$，$b=\lim_{x\to+\infty}\bigl[f(x)-kx\bigr]$，两个:term[极限]{id="math.calculus.limit"}都存在。$x\to-\infty$时同理。

道理：如果$f(x)-kx-b\to0$，两边除以$x$，得$\frac{f(x)}x-k-\frac bx\to0$，所以$\frac{f(x)}x\to k$，再由定义$f(x)-kx\to b$。反过来，两个极限都存在时，$f(x)-(kx+b)\to0$正是定义。所以先求$k$，再求$b$；有理函数也可以做多项式除法，直接看出来（例 1）。

### 作图的步骤

画草图，就是把下面几类信息一项项求出来，再拼到一起。

- 定义域，以及对称性：$f$是偶函数（even function）时图像关于$y$轴对称，是奇函数（odd function）时关于原点对称，只要画一半。能求的话，再求出和坐标轴的交点。
- 渐近线：在定义域的断点和端点处看:term[单侧极限]{id="math.calculus.one-sided-limit"}（one-sided limit），找:term[竖直渐近线]{id="math.calculus.vertical-asymptote"}（vertical asymptote）；在$x\to\pm\infty$处找:term[水平渐近线]{id="math.calculus.horizontal-asymptote"}或:term[斜渐近线]{id="math.calculus.oblique-asymptote"}，两个方向分开求。
- $f'$的正负：单调区间和:term[极值点]{id="math.calculus.extremum-point"}（extremum point），见[单调性与极值的判别](lesson:math.calculus.monotonicity)。
- $f''$的正负：凹凸区间和:term[拐点]{id="math.calculus.inflection-point"}（inflection point），见[凹凸性与拐点](lesson:math.calculus.concavity)。

最后把这些结果按$x$从小到大列成一张表，标出交点、极值点、拐点，先画渐近线，再沿着渐近线、按表里的升降和弯向把点连起来。前两项是整体的骨架，管的是曲线大致在哪里、往哪里去；后两项管的是骨架之间每一段的形状。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-4, 6], y: [-6, 10] }
functions:
  - expr: "x + 1 + c/(x - 1)"
    label: |
      $y=x+1+\frac c{x-1}$
  - expr: "x + 1"
    label: |
      $y=x+1$
points:
  - { x: "1 - sqrt(c)", y: "2 - 2*sqrt(c)" }
  - { x: "1 + sqrt(c)", y: "2 + 2*sqrt(c)" }
sliders:
  - name: c
    min: 0.2
    max: 3
    step: 0.1
    default: 1
    label: |
      $c$
:::

蓝色曲线是$y=x+1+\frac c{x-1}$，橙色直线$y=x+1$是它在两个方向上共同的:term[斜渐近线]{id="math.calculus.oblique-asymptote"}，$x=1$是:term[竖直渐近线]{id="math.calculus.vertical-asymptote"}，曲线靠近它时冲向上下两端。两个点是极大值点$\bigl(1-\sqrt c,2-2\sqrt c\bigr)$和极小值点$\bigl(1+\sqrt c,2+2\sqrt c\bigr)$。拖动$c$，两个:term[极值点]{id="math.calculus.extremum-point"}随着移动，两条渐近线却不动：草图的骨架由渐近线定下，:term[导数]{id="math.calculus.derivative"}决定骨架之间的形状。

## 例题

### 例 1　有两条渐近线的有理函数

画出$y=\frac{x^2}{x-1}$的草图。

**为什么想到这么做**：按步骤来。分母在$x=1$处为$0$，那里多半有:term[竖直渐近线]{id="math.calculus.vertical-asymptote"}；分子比分母高一次，$x\to\pm\infty$时多半有:term[斜渐近线]{id="math.calculus.oblique-asymptote"}。

**推导**：定义域是$x\ne1$，曲线过原点。$x\to1^-$时$y\to-\infty$，$x\to1^+$时$y\to+\infty$，$x=1$是竖直渐近线。做除法，$\frac{x^2}{x-1}=x+1+\frac1{x-1}$，最后一项趋于$0$，所以$y=x+1$是两个方向的斜渐近线。

$y'=\frac{x(x-2)}{(x-1)^2}$，:term[驻点]{id="math.calculus.stationary-point"}（stationary point）是$0$和$2$；$y''=\frac2{(x-1)^3}$。把它们的正负列成表：

| $x$ | $(-\infty,0)$ | $0$ | $(0,1)$ | $(1,2)$ | $2$ | $(2,+\infty)$ |
| --- | --- | --- | --- | --- | --- | --- |
| $y'$ | $+$ | $0$ | $-$ | $-$ | $0$ | $+$ |
| $y''$ | $-$ | $-$ | $-$ | $+$ | $+$ | $+$ |
| $y$ | 升，向下弯 | 极大，$y=0$ | 降，向下弯 | 降，向上弯 | 极小，$y=4$ | 升，向上弯 |

$1$不在定义域里，$y''$在它两侧变号，可那里没有:term[拐点]{id="math.calculus.inflection-point"}。草图：左边一支从左下方贴着$y=x+1$升到原点，再往下冲向$x=1$；右边一支从$x=1$的上方下来，到$(2,4)$最低，再贴着$y=x+1$往右上方去。

### 例 2　奇函数

画出$y=\frac{x}{1+x^2}$的草图。

**为什么想到这么做**：$f(-x)=-f(x)$，是奇函数，只要画$x\ge0$的一半，再关于原点对称过去。

**推导**：定义域是$\R$，没有:term[竖直渐近线]{id="math.calculus.vertical-asymptote"}；$x\to\pm\infty$时$y\to0$，$y=0$是:term[水平渐近线]{id="math.calculus.horizontal-asymptote"}。$y'=\frac{1-x^2}{(1+x^2)^2}$，所以$y$在$[0,1]$上严格递增、在$[1,+\infty)$上严格递减，:term[极大值]{id="math.calculus.local-maximum"}（local maximum）是$f(1)=\frac12$。

$y''=\frac{2x(x^2-3)}{(1+x^2)^3}$，在$(0,\sqrt3)$内为负、在$(\sqrt3,+\infty)$内为正，$\bigl(\sqrt3,\frac{\sqrt3}4\bigr)$是:term[拐点]{id="math.calculus.inflection-point"}；$y''$在$0$两侧也变号，原点也是拐点。草图：从原点出发升到$\bigl(1,\frac12\bigr)$再下降，过了拐点由向下弯变成向上弯，贴着横轴往右延伸；左半边关于原点对称。

## 常见误区

- 「曲线不会和它的渐近线相交。」$y=\frac{x^2-x}{x^2+1}$以$y=1$为:term[水平渐近线]{id="math.calculus.horizontal-asymptote"}，可在$x=-1$处，曲线正好穿过这条直线。
- 「$x\to+\infty$和$x\to-\infty$的渐近线是同一条。」两个方向要分开求：$y=\sqrt{x^2+1}$在$x\to+\infty$时贴着$y=x$，在$x\to-\infty$时贴着$y=-x$。
- 「找到了:term[极值点]{id="math.calculus.extremum-point"}和:term[拐点]{id="math.calculus.inflection-point"}，就能把图连出来。」还要看定义域的断点和渐近线：例 1 的两个极值点之间隔着:term[竖直渐近线]{id="math.calculus.vertical-asymptote"}$x=1$，不能直接连起来。

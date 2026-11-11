---
id: math.linear-algebra.vector-spaces
title: |
  抽象向量空间
goal: |
  会验证多项式、函数等组成的集合是向量空间，并在其中使用基、维数和坐标。
prerequisites: [math.linear-algebra.basis-dimension]
minutes: 35
summary: |
  满足八条运算律的集合都是向量空间；多项式、函数也有基和维数。
status: reviewed
---

## 这一节要回答的问题

[向量与线性运算](lesson:math.linear-algebra.vectors)里，$\R^n$的加法和:term[数乘]{id="math.linear-algebra.scalar-multiplication"}（scalar multiplication）满足八条运算律；那一节第 8 题还把函数看成「有无穷多个:term[分量]{id="math.linear-algebra.component"}（component）的向量」。多项式（polynomial）、函数、方程的解，这些东西同样能相加、能乘以数。前面关于:term[子空间]{id="math.linear-algebra.subspace"}（subspace）、:term[线性无关]{id="math.linear-algebra.linearly-independent"}（linearly independent）、:term[基]{id="math.linear-algebra.basis"}（basis）与:term[维数]{id="math.linear-algebra.dimension"}（dimension）的结论，能不能原样搬过去？

## 讲解

### 向量空间

::anchor{id="def-vector-space"}
设$V$是一个集合，其中任意两个元素可以相加，任意一个元素可以乘以实数，结果都还在$V$里。如果对$V$里任意的$\vb u$、$\vb v$、$\vb w$和实数$c$、$d$，[运算律](lesson:math.linear-algebra.vectors#thm-laws)的八条都成立：$\vb u+\vb v=\vb v+\vb u$，$(\vb u+\vb v)+\vb w=\vb u+(\vb v+\vb w)$，有一个元素$\vb 0$使$\vb v+\vb 0=\vb v$，每个$\vb v$有$-\vb v$使$\vb v+(-\vb v)=\vb 0$，$c(\vb u+\vb v)=c\vb u+c\vb v$，$(c+d)\vb v=c\vb v+d\vb v$，$(cd)\vb v=c(d\vb v)$，$1\vb v=\vb v$，就说$V$是一个:term[向量空间]{id="math.linear-algebra.vector-space"}（vector space），它的元素叫作向量。

为什么这样定义：这八条正是$\R^n$的运算律；把它们当作定义，凡是只用这八条推出的结论，在每个向量空间里都成立，不必一个一个重新证明。这里的「向量」不一定是箭头，也不一定有:term[分量]{id="math.linear-algebra.component"}。边界情况：只含一个元素的$\{\vb 0\}$也是向量空间；把实数换成复数，定义一字不改，得到复向量空间（complex vector space）；反过来，复数全体只乘以实数时，是实数上的二维向量空间，以后在[域扩张与代数元](lesson:math.abstract-algebra.field-extensions)里，还会这样看待别的数系。

常见的例子有三类。(a) $\R^n$。(b) 次数不超过$n$的实系数多项式全体$P_n$，按通常的加法和:term[数乘]{id="math.linear-algebra.scalar-multiplication"}。(c) 区间$I$上的全体实函数，按逐点的运算$(f+g)(x)=f(x)+g(x)$、$(cf)(x)=cf(x)$，:term[零向量]{id="math.linear-algebra.zero-vector"}（zero vector）是处处为零的函数；八条运算律在每个点上都是数的运算律。

不是向量空间的例子：次数恰好是$2$的多项式，$(x^2+x)+(-x^2)=x$跑了出去，也没有零多项式；$\R^2$里的第一象限，没有$-\vb v$。

### 子空间、基与维数

[生成与子空间](lesson:math.linear-algebra.span-subspaces)、[线性无关](lesson:math.linear-algebra.linear-independence)、[基与维数](lesson:math.linear-algebra.basis-dimension)里的定义，只用到加法和:term[数乘]{id="math.linear-algebra.scalar-multiplication"}，原样适用于任何:term[向量空间]{id="math.linear-algebra.vector-space"}：含$\vb 0$、对加法和数乘封闭的子集是:term[子空间]{id="math.linear-algebra.subspace"}，:term[线性组合]{id="math.linear-algebra.linear-combination"}（linear combination）、:term[生成]{id="math.linear-algebra.span"}（span）、:term[线性无关]{id="math.linear-algebra.linearly-independent"}、:term[基]{id="math.linear-algebra.basis"}、:term[坐标向量]{id="math.linear-algebra.coordinate-vector"}（coordinate vector）都照旧。证明里用到的除了这八条，只有关于系数的:term[线性方程组]{id="math.linear-algebra.linear-system"}（system of linear equations），所以那些定理也照旧成立。

::anchor{id="def-finite-dimensional"}
向量空间$V$如果能由有限个向量生成，就说它是:term[有限维]{id="math.linear-algebra.finite-dimensional"}（finite-dimensional）的，它的:term[维数]{id="math.linear-algebra.dimension"}$\dim V$是它的任意一组基所含向量的个数；否则说它是无限维（infinite-dimensional）的。

为什么这样定义：有限维时，[个数的上限](lesson:math.linear-algebra.basis-dimension#thm-exchange)的证明照搬过来，任意两组基一样多，维数才有意义。$P_n$的一组基是$1,x,\dots,x^n$，所以$\dim P_n=n+1$；它们线性无关，因为$c_0+c_1x+\dots+c_nx^n$对每个$x$都等于$0$时，这个多项式有无穷多个根，系数只能全是$0$。边界情况：全体实函数组成的空间是无限维的，因为对每个$n$，$1,x,\dots,x^n$都线性无关，有限个函数生成不了它。

::anchor{id="thm-coordinates-iso"}
**坐标把$V$变成$\R^n$**　设$\mathcal B=(\vb b_1,\dots,\vb b_n)$是$V$的一组基。$\vb v\mapsto[\vb v]_{\mathcal B}$是$V$和$\R^n$之间的一一对应，并且$[\vb u+\vb v]_{\mathcal B}=[\vb u]_{\mathcal B}+[\vb v]_{\mathcal B}$，$[c\vb u]_{\mathcal B}=c[\vb u]_{\mathcal B}$；这样保持加法和数乘的一一对应叫作:term[同构]{id="math.linear-algebra.isomorphism"}（isomorphism）。

**证明思路**：坐标是唯一的，$\R^n$里每个数组$(c_1,\dots,c_n)$又恰好对应$V$里的$c_1\vb b_1+\dots+c_n\vb b_n$，所以是一一对应。两个线性组合相加、乘以数，系数也对应相加、乘以数（[基与维数](lesson:math.linear-algebra.basis-dimension)第 7 题）。所以在$n$维的$V$里判断线性无关、求维数、解方程，都可以先换成坐标，在$\R^n$里用消元来做（例 1）。

### 函数的线性无关

函数$f_1,\dots,f_k$:term[线性无关]{id="math.linear-algebra.linearly-independent"}，是说$c_1f_1+\dots+c_kf_k$在整个区间上处处为零时，只能各$c_i=0$；只在几个点上为零不算。反过来用：在区间里挑几个点，把「组合在这些点上为零」写成关于$c_1,\dots,c_k$的:term[齐次方程组]{id="math.linear-algebra.homogeneous-system"}（homogeneous linear system），如果它只有零解，函数就线性无关。例如$\sin x$、$\cos x$：$c_1\sin x+c_2\cos x\equiv0$，取$x=0$得$c_2=0$，取$x=\frac\pi2$得$c_1=0$，所以线性无关。

[二阶线性方程的解的结构](lesson:math.ode.second-order-linear)会证明，$y''+y=0$的全部解组成一个二维:term[向量空间]{id="math.linear-algebra.vector-space"}，$\sin x$、$\cos x$就是它的一组:term[基]{id="math.linear-algebra.basis"}；那里判断两个解是否线性无关，用的正是这一节的定义。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-6.3, 6.3], y: [-3.78, 3.78] }
functions:
  - expr: "sin(x)"
    label: |
      $\sin x$
  - expr: "cos(x)"
    label: |
      $\cos x$
  - expr: "a*sin(x) + b*cos(x)"
    label: |
      $a\sin x+b\cos x$
sliders:
  - name: a
    min: -2
    max: 2
    step: 0.5
    default: 1.5
    label: |
      $a$
  - name: b
    min: -2
    max: 2
    step: 0.5
    default: 1
    label: |
      $b$
:::

图里把函数画成曲线，每条曲线是:term[向量空间]{id="math.linear-algebra.vector-space"}里的一个「向量」。拖动$a$、$b$，$a\sin x+b\cos x$在$\sin x$、$\cos x$:term[生成]{id="math.linear-algebra.span"}的二维:term[子空间]{id="math.linear-algebra.subspace"}里移动，得到的总是同一种形状的波，只是高低和左右位置不同。系数$(a,b)$就是这条曲线在:term[基]{id="math.linear-algebra.basis"}$(\sin x,\cos x)$下的坐标，两个系数确定一条曲线，不多也不少。

## 例题

### 例 1　借助坐标判断多项式

在$P_2$里，判断$p_1=1+x$、$p_2=x+x^2$、$p_3=1+2x+x^2$是否:term[线性无关]{id="math.linear-algebra.linearly-independent"}，并求它们:term[生成]{id="math.linear-algebra.span"}的:term[子空间]{id="math.linear-algebra.subspace"}的:term[维数]{id="math.linear-algebra.dimension"}。

**为什么想到这么做**：在:term[基]{id="math.linear-algebra.basis"}$1,x,x^2$下取坐标，问题就变成$\R^3$里三个向量的线性无关，用消元判断。

**推导**：坐标是$(1,1,0)$、$(0,1,1)$、$(1,2,1)$。以它们为各列，三行是$(1,0,1)$、$(1,1,2)$、$(0,1,1)$；做$R_2-R_1$得$(0,1,1)$，再做$R_3-R_2$，第三行全是零，第三列没有:term[主元]{id="math.linear-algebra.pivot"}（pivot）。所以:term[线性相关]{id="math.linear-algebra.linearly-dependent"}（linearly dependent），而且$p_3=p_1+p_2$；前两个线性无关，生成的子空间的维数是$2$。

### 例 2　指数函数线性无关

证明$e^x$、$e^{2x}$、$e^{3x}$在$\R$上:term[线性无关]{id="math.linear-algebra.linearly-independent"}。

**为什么想到这么做**：设组合处处为零，换元$t=e^x$，把它变成多项式的问题。

**推导**：设$c_1e^x+c_2e^{2x}+c_3e^{3x}=0$对每个实数$x$成立。令$t=e^x$，$t$取遍全体正数，于是$c_1t+c_2t^2+c_3t^3=0$对每个$t>0$成立。这个多项式有无穷多个根，系数只能全为零，$c_1=c_2=c_3=0$，所以线性无关。

## 常见误区

- 「向量就是带方向的箭头。」在一般的:term[向量空间]{id="math.linear-algebra.vector-space"}里，多项式、函数都是向量；只要能相加、:term[数乘]{id="math.linear-algebra.scalar-multiplication"}，满足八条运算律就行。
- 「次数恰好是$2$的多项式组成向量空间。」两个这样的多项式相加，次数可能下降，也没有零多项式。
- 「两个函数在某一点都等于零，就:term[线性相关]{id="math.linear-algebra.linearly-dependent"}。」线性相关要组合处处为零；$x$、$x^2$在$x=0$处都是$0$，却:term[线性无关]{id="math.linear-algebra.linearly-independent"}。
- 「每个向量空间都有一组有限的:term[基]{id="math.linear-algebra.basis"}。」全体实函数组成的空间是无限维的，$1,x,x^2,\dots$永远加不完。

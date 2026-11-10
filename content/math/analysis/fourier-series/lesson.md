---
id: math.analysis.fourier-series
title: |
  傅里叶级数
goal: |
  会利用三角函数系的正交性求函数的傅里叶系数，并写出它的傅里叶级数。
prerequisites: [math.calculus.fundamental-theorem, math.calculus.integration-by-parts, math.calculus.series]
minutes: 30
summary: |
  三角函数系两两正交，傅里叶系数是$f$乘$\cos nx$、$\sin nx$的积分。
status: reviewed
---

## 这一节要回答的问题

弦的振动、交流电、方波信号，都是周期函数。泰勒级数（Taylor series）用$x$的幂去逼近函数；对周期函数，更自然的做法是用同样以$2\pi$为周期的$\cos nx$、$\sin nx$去拼。能不能把一个周期函数写成$\frac{a_0}{2}+\sum_{n=1}^\infty(a_n\cos nx+b_n\sin nx)$？如果能，系数该怎么求？

## 讲解

### 三角函数系的正交性

先算几个积分：$\int_{-\pi}^{\pi}\sin x\cos x\dd x=0$，$\int_{-\pi}^{\pi}\sin x\sin2x\dd x=0$，而$\int_{-\pi}^{\pi}\sin^2x\dd x=\pi$。不同的三角函数相乘，在一个周期上积分是$0$；同一个函数平方，积分是$\pi$。

::anchor{id="def-trig-system"}
函数列$1,\ \cos x,\ \sin x,\ \cos2x,\ \sin2x,\ \dots,\ \cos nx,\ \sin nx,\ \dots$叫作:term[三角函数系]{id="math.analysis.trig-system"}（trigonometric system）。

::anchor{id="def-orthogonal"}
设$f$、$g$在$[-\pi,\pi]$上:term[可积]{id="math.analysis.riemann-integral"}（Riemann integrable）。若$\int_{-\pi}^{\pi}f(x)g(x)\dd x=0$，就说$f$与$g$在$[-\pi,\pi]$上正交（orthogonal）。

为什么这样定义：平面上两个向量$(u_1,u_2)$、$(v_1,v_2)$垂直，当且仅当$u_1v_1+u_2v_2=0$。把函数在每一点的值看成它的「坐标」，求和换成积分，就得到$\int fg=0$（以后在[点积、长度与夹角](lesson:math.linear-algebra.dot-product)里会更系统地讲点积（dot product））。边界情况：正交和区间有关，$\sin x$与$\cos x$在$[-\pi,\pi]$上正交，在$\bigl[0,\frac{\pi}{2}\bigr]$上$\int\sin x\cos x\dd x=\frac12\ne0$，就不正交。

::anchor{id="thm-orthogonality"}
**定理 1**　:term[三角函数系]{id="math.analysis.trig-system"}里任意两个不同的函数在$[-\pi,\pi]$上正交；并且对正整数$n$，$\int_{-\pi}^{\pi}\cos^2nx\dd x=\int_{-\pi}^{\pi}\sin^2nx\dd x=\pi$，$\int_{-\pi}^{\pi}1^2\dd x=2\pi$。

**证明**：对非零整数$k$，$\int_{-\pi}^{\pi}\cos kx\dd x=\Bigl[\frac{\sin kx}{k}\Bigr]_{-\pi}^{\pi}=0$，同样$\int_{-\pi}^{\pi}\sin kx\dd x=0$。由积化和差公式（product-to-sum formulas），$\cos mx\cos nx=\frac12[\cos(m-n)x+\cos(m+n)x]$，$\sin mx\sin nx=\frac12[\cos(m-n)x-\cos(m+n)x]$，$\sin mx\cos nx=\frac12[\sin(m+n)x+\sin(m-n)x]$。$m\ne n$（$m,n\ge0$）时，右边每一项都是某个$\cos kx$或$\sin kx$（$k\ne0$），或者是$\sin0=0$，积分都是$0$；$\sin nx\cos nx=\frac12\sin2nx$，积分也是$0$。$m=n\ge1$时，$\cos^2nx=\frac12(1+\cos2nx)$，$\sin^2nx=\frac12(1-\cos2nx)$，积分都是$\pi$。

### 傅里叶系数

假设$f(x)=\frac{a_0}{2}+\sum_{n=1}^\infty(a_n\cos nx+b_n\sin nx)$，并且两边乘上$\cos mx$以后可以逐项积分。由定理 1，右边只剩$a_m\cos mx\cdot\cos mx$这一项，积分是$\pi a_m$（$m=0$时是$\frac{a_0}{2}\cdot2\pi=\pi a_0$），于是$a_m=\frac1\pi\int_{-\pi}^{\pi}f(x)\cos mx\dd x$；乘上$\sin mx$同理。系数只能是这样的：

::anchor{id="def-fourier-series"}
设$f$在$[-\pi,\pi]$上:term[可积]{id="math.analysis.riemann-integral"}。$a_n=\frac1\pi\int_{-\pi}^{\pi}f(x)\cos nx\dd x$（$n\ge0$）和$b_n=\frac1\pi\int_{-\pi}^{\pi}f(x)\sin nx\dd x$（$n\ge1$）叫作$f$的:term[傅里叶系数]{id="math.analysis.fourier-coefficients"}（Fourier coefficients）。:term[级数]{id="math.analysis.series"}（series）$\frac{a_0}{2}+\sum_{n=1}^\infty(a_n\cos nx+b_n\sin nx)$叫作$f$的:term[傅里叶级数]{id="math.analysis.fourier-series"}（Fourier series），记作$f(x)\sim\frac{a_0}{2}+\sum_{n=1}^\infty(a_n\cos nx+b_n\sin nx)$。

为什么这样定义：上面的推导说明，$f$真能写成这样的级数（并且可以逐项积分）时，系数只能是这些。常数项写成$\frac{a_0}{2}$，是为了让$a_n$的公式在$n=0$时也成立。边界情况：中间用的是「$\sim$」而不是「$=$」：改变$f$在一点的值，积分不变，系数和级数都不变，$f$却变了，所以级数不可能处处等于$f$。级数什么时候:term[收敛]{id="math.analysis.convergent-series"}（convergent series）、收敛到什么，是[傅里叶级数的收敛](lesson:math.analysis.fourier-convergence)的问题。

::anchor{id="thm-trig-polynomial"}
**定理 2**　设$T(x)=\frac{A_0}{2}+\sum_{n=1}^N(A_n\cos nx+B_n\sin nx)$，这样的有限和叫作三角多项式（trigonometric polynomial）。$T$的傅里叶系数就是$A_n$、$B_n$（$n\le N$），$n>N$时都是$0$。

**证明**：有限和可以逐项积分。$T(x)\cos mx$在$[-\pi,\pi]$上积分时，由定理 1，只有含$\cos^2mx$的那一项（$m=0$时是常数项乘$1$）不为$0$，积分是$\pi A_m$，所以$a_m=A_m$；$m>N$时没有这一项，$a_m=0$。$b_m$同理。

### 奇函数与偶函数

::anchor{id="thm-parity"}
**定理 3**　设$f$在$[-\pi,\pi]$上:term[可积]{id="math.analysis.riemann-integral"}。若$f$是偶函数（even function），则$b_n=0$，$a_n=\frac2\pi\int_0^\pi f(x)\cos nx\dd x$，:term[傅里叶级数]{id="math.analysis.fourier-series"}只含:term[余弦]{id="math.analysis.cosine"}（cosine，cos）项，叫作余弦级数（cosine series）；若$f$是奇函数（odd function），则$a_n=0$，$b_n=\frac2\pi\int_0^\pi f(x)\sin nx\dd x$，级数只含:term[正弦]{id="math.analysis.sine"}（sine，sin）项，叫作正弦级数（sine series）。

**证明**：$f$是偶函数时，$f(x)\sin nx$是奇函数，在对称区间上积分为$0$；$f(x)\cos nx$是偶函数，在$[-\pi,\pi]$上的积分是在$[0,\pi]$上的$2$倍。$f$是奇函数时反过来。

### 一般的周期

周期是$2L$时，令$x=\frac{\pi t}{L}$，$t$走过$[-L,L]$时$x$正好走过$[-\pi,\pi]$，对$g(x)=f\bigl(\frac{Lx}{\pi}\bigr)$用上面的公式，再换回$t$：

::anchor{id="def-fourier-series-2l"}
设$f$在$[-L,L]$上:term[可积]{id="math.analysis.riemann-integral"}，$a_n=\frac1L\int_{-L}^{L}f(t)\cos\frac{n\pi t}{L}\dd t$，$b_n=\frac1L\int_{-L}^{L}f(t)\sin\frac{n\pi t}{L}\dd t$，$f$的:term[傅里叶级数]{id="math.analysis.fourier-series"}是$\frac{a_0}{2}+\sum_{n=1}^\infty\bigl(a_n\cos\frac{n\pi t}{L}+b_n\sin\frac{n\pi t}{L}\bigr)$。

为什么这样定义：$\cos\frac{n\pi t}{L}$、$\sin\frac{n\pi t}{L}$都以$2L$为周期，在$[-L,L]$上照样两两正交，平方的积分是$L$，所以系数前面是$\frac1L$。边界情况：$L=\pi$时就是前面的定义。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-10, 10], y: [-4, 4] }
functions:
  - expr: "x - 2*pi*floor((x + pi) / (2*pi))"
    label: |
      周期延拓后的$f(x)=x$
  - expr: "2 * sum(k, 1, N, (-1)^(k + 1) * sin(k*x) / k)"
    label: |
      部分和$y=2\sum_{k=1}^{N}\frac{(-1)^{k+1}\sin kx}{k}$
sliders:
  - name: N
    min: 1
    max: 30
    step: 1
    default: 3
    label: |
      项数$N$
:::

这是例 1 的锯齿波和它的:term[傅里叶级数]{id="math.analysis.fourier-series"}的:term[部分和]{id="math.analysis.partial-sum"}（partial sum）。拖动$N$：在$(-\pi,\pi)$内部，部分和越来越贴近直线$y=x$；在跳跃点$x=\pm\pi$处，每个部分和都是$0$，正好是跳跃两侧的中点。从$N=5$起，跳跃点旁边的部分和会冲出锯齿波的取值范围$(-\pi,\pi)$，这个冲过头的尖角不随$N$消失，是[傅里叶级数的收敛](lesson:math.analysis.fourier-convergence)要讲的:term[吉布斯现象]{id="math.analysis.gibbs-phenomenon"}（Gibbs phenomenon）。

## 例题

### 例 1　锯齿波

设$f(x)=x$（$-\pi<x<\pi$），求它的:term[傅里叶级数]{id="math.analysis.fourier-series"}。

**为什么想到这么做**：$f$是奇函数，由定理 3，只要算$b_n$；被积函数$x\sin nx$是多项式乘三角函数，用分部积分（integration by parts）。

**推导**：$a_n=0$。$b_n=\frac2\pi\int_0^\pi x\sin nx\dd x=\frac2\pi\Bigl[-\frac{x\cos nx}{n}\Bigr]_0^\pi+\frac{2}{n\pi}\int_0^\pi\cos nx\dd x=-\frac{2\cos n\pi}{n}=\frac{2(-1)^{n+1}}{n}$。所以

$$x\sim2\Bigl(\sin x-\frac{\sin2x}{2}+\frac{\sin3x}{3}-\cdots\Bigr)=2\sum_{n=1}^\infty\frac{(-1)^{n+1}\sin nx}{n}.$$

### 例 2　方波

设$f(x)=-1$（$-\pi<x<0$），$f(x)=1$（$0<x<\pi$），求它的:term[傅里叶级数]{id="math.analysis.fourier-series"}。

**为什么想到这么做**：$f$也是奇函数，只要算$b_n$；在$(0,\pi)$上$f=1$，积分直接算得出来。

**推导**：$b_n=\frac2\pi\int_0^\pi\sin nx\dd x=\frac{2}{n\pi}(1-\cos n\pi)$，$n$为奇数时是$\frac{4}{n\pi}$，$n$为偶数时是$0$。所以

$$f(x)\sim\frac4\pi\Bigl(\sin x+\frac{\sin3x}{3}+\frac{\sin5x}{5}+\cdots\Bigr)=\frac4\pi\sum_{k=1}^\infty\frac{\sin(2k-1)x}{2k-1}.$$

$f(0)$没有定义，可:term[级数]{id="math.analysis.series"}在$x=0$处每一项都是$0$，和是$0$；这又是跳跃两侧的中点。

## 常见误区

- 「$f$的:term[傅里叶级数]{id="math.analysis.fourier-series"}等于$f$。」只能写「$\sim$」：:term[级数]{id="math.analysis.series"}可能不:term[收敛]{id="math.analysis.convergent-series"}，收敛了也可能不等于$f$（例 2 在$x=0$处）。
- 「$a_0$就是级数的常数项。」常数项是$\frac{a_0}{2}$，它等于$f$在一个周期上的平均值$\frac{1}{2\pi}\int_{-\pi}^{\pi}f(x)\dd x$。
- 「正交是两个函数本身的性质。」正交还和区间有关：$\sin x$与$\cos x$在$\bigl[0,\frac{\pi}{2}\bigr]$上就不正交。

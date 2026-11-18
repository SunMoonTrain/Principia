---
id: math.complex-analysis.complex-exponential
title: |
  欧拉公式与复指数
goal: |
  会用泰勒级数理解欧拉公式$e^{i\theta}=\cos\theta+i\sin\theta$，并会对$e^{\lambda t}$（$\lambda$是复数）求导和积分。
prerequisites: [math.complex-analysis.complex-numbers, math.calculus.taylor-series]
minutes: 27
summary: |
  $e^{i\theta}=\cos\theta+i\sin\theta$；$e^{x+iy}=e^xe^{iy}$，$(e^{\lambda t})'=\lambda e^{\lambda t}$。
status: reviewed
---

## 这一节要回答的问题

[复数与复平面](lesson:math.complex-analysis.complex-numbers#def-exponential-form)里把$\cos\theta+i\sin\theta$记作$e^{i\theta}$，理由只是它满足和指数一样的乘法法则。在$e^x$的泰勒级数（Taylor series）里把$x$换成$i\theta$，会得到什么？指数是:term[复数]{id="math.complex-analysis.complex-number"}（complex number）时，$e^z$该怎样定义？:term[常微分方程]{id="math.ode.ode"}（ordinary differential equation）里的$e^{(\alpha+i\beta)x}$求导时又守什么规矩？

## 讲解

### 复数项级数

::anchor{id="def-complex-series"}
设$z_n=a_n+ib_n$，$a_n$、$b_n$是实数。如果$\sum a_n$和$\sum b_n$都收敛，和分别是$A$、$B$，就说:term[复数项级数]{id="math.complex-analysis.complex-series"}（series of complex numbers）$\sum z_n$收敛，和是$A+iB$；否则说它发散。

为什么这样定义：:term[复数]{id="math.complex-analysis.complex-number"}由:term[实部]{id="math.complex-analysis.real-part"}（real part）、:term[虚部]{id="math.complex-analysis.imaginary-part"}（imaginary part）两个实数决定，部分和（partial sum）趋于$A+iB$就是实部、虚部两个实数列分别收敛，也就是部分和与$A+iB$的距离趋于$0$。由$|a_n|\le|z_n|$、$|b_n|\le|z_n|$和比较判别法（comparison test），只要$\sum|z_n|$收敛，$\sum a_n$、$\sum b_n$就都绝对收敛（absolute convergence），所以$\sum z_n$收敛：各项取:term[模]{id="math.complex-analysis.modulus"}（modulus）以后收敛的复数项级数一定收敛。边界情况：$\sum\frac{i^n}n$收敛，它的实部、虚部都是交错级数（alternating series），可是各项取模以后是发散的调和级数（harmonic series）。

::anchor{id="thm-exp-series"}
**定理**　对每个复数$z$，级数$\sum_{n=0}^\infty\frac{z^n}{n!}$收敛。

**证明**：$\bigl|\frac{z^n}{n!}\bigr|=\frac{|z|^n}{n!}$，而$\sum\frac{|z|^n}{n!}$是$e^x$的泰勒级数在$x=|z|$处的值，收敛（见[泰勒级数](lesson:math.calculus.taylor-series#thm-exp-sin-cos-series)）。由上面的说明，原级数收敛。

### 欧拉公式

::anchor{id="thm-euler"}
**定理（:term[欧拉公式]{id="math.complex-analysis.euler-formula"}，Euler's formula）**　对每个实数$\theta$，$\sum_{n=0}^\infty\frac{(i\theta)^n}{n!}=\cos\theta+i\sin\theta$。

**证明**：$i$的乘方四个一循环，$i^{2k}=(-1)^k$，$i^{2k+1}=(-1)^ki$。所以这个级数前$2m+2$项的和是

$$
\sum_{n=0}^{2m+1}\frac{(i\theta)^n}{n!}=\sum_{k=0}^{m}\frac{(-1)^k\theta^{2k}}{(2k)!}+i\sum_{k=0}^{m}\frac{(-1)^k\theta^{2k+1}}{(2k+1)!},
$$

:term[实部]{id="math.complex-analysis.real-part"}、:term[虚部]{id="math.complex-analysis.imaginary-part"}正是$\cos\theta$、$\sin\theta$的麦克劳林多项式（Maclaurin polynomial）。由[泰勒级数](lesson:math.calculus.taylor-series#thm-exp-sin-cos-series)，$m\to\infty$时它们分别趋于$\cos\theta$和$\sin\theta$。级数收敛，部分和趋于它的和，前$2m+2$项的那些部分和也趋于同一个和，所以和是$\cos\theta+i\sin\theta$。

为什么重要：$e^x=\sum\frac{x^n}{n!}$本来只对实数$x$成立；把同一个级数用到$x=i\theta$上，得到的正是[复数与复平面](lesson:math.complex-analysis.complex-numbers#def-exponential-form)里记作$e^{i\theta}$的那个数。所以那个记号不只是乘法法则凑巧一样，它就是$e^x$的级数在虚数处的值。取$\theta=\pi$得$e^{i\pi}+1=0$，把$0$、$1$、$i$、$\pi$、$e$连在了一起。边界情况：公式里的$\theta$是实数；$\theta$是:term[复数]{id="math.complex-analysis.complex-number"}时，右边的$\cos\theta$、$\sin\theta$还没有定义，要到[复变函数与映射](lesson:math.complex-analysis.complex-functions)里用复指数来定义。

### 复指数函数

::anchor{id="def-complex-exp"}
对:term[复数]{id="math.complex-analysis.complex-number"}$z=x+iy$（$x$、$y$是实数），规定$e^z=e^xe^{iy}=e^x(\cos y+i\sin y)$。函数$z\mapsto e^z$叫作:term[复指数函数]{id="math.complex-analysis.complex-exponential"}（complex exponential function），也记作$\exp z$。

为什么这样定义：$y=0$时它就是实的$e^x$，$x=0$时就是:term[欧拉公式]{id="math.complex-analysis.euler-formula"}；更要紧的是指数法则照样成立，见下面的定理。也可以直接用级数$\sum\frac{z^n}{n!}$来定义，两种定义给出同一个函数：数学分析[用幂级数定义指数函数与对数](lesson:math.analysis.exp-log-construction#thm-exp-addition)把两个级数相乘，证明了实数的$\exp(x+y)=\exp x\cdot\exp y$，同样的证明对复数也成立，再用欧拉公式就得到级数的和是$e^x(\cos y+i\sin y)$；以后[全纯函数的幂级数展开](lesson:math.complex-analysis.power-series)会换一条路得到。边界情况：$|e^z|=e^x>0$，所以$e^z$永远不是$0$；$e^z$的:term[辐角]{id="math.complex-analysis.argument"}（argument）是$y$，$y$每增加$2\pi$，$e^z$回到原处。

::anchor{id="thm-exp-addition"}
**定理**　对任意复数$z$、$w$，$e^{z+w}=e^ze^w$。特别地，$e^{z+2\pi i}=e^z$；$e^z=1$当且仅当$z=2k\pi i$，$k$是整数。

**证明**：设$z=x+iy$，$w=u+iv$。由实数的指数法则和$e^{iy}e^{iv}=e^{i(y+v)}$（[乘法是旋转加伸缩](lesson:math.complex-analysis.complex-numbers#thm-multiplication)），

$$
e^{z+w}=e^{x+u}e^{i(y+v)}=e^xe^u\,e^{iy}e^{iv}=e^ze^w.
$$

$e^{2\pi i}=\cos2\pi+i\sin2\pi=1$，取$w=2\pi i$即得周期性。$e^z=1$时$|e^z|=e^x=1$，所以$x=0$，而$\cos y+i\sin y=1$要求$y$是$2\pi$的整数倍；反过来显然。

为什么有用：指数法则把乘法变成加法，$e^{-z}=\frac1{e^z}$，$(e^z)^n=e^{nz}$（$n$是整数）；特别地$(e^{i\theta})^n=e^{in\theta}$，求复数的:term[$n$次方根]{id="math.complex-analysis.nth-root"}（nth root）就靠它，见[复数的$n$次方根](lesson:math.complex-analysis.complex-roots)。边界情况：$e^z=e^w$只能推出$z-w=2k\pi i$，推不出$z=w$；实数里$e^x$是一一对应的，复数里不是。

### 实变量的复值函数

::anchor{id="def-complex-valued-function"}
设$u$、$v$是区间$I$上的实函数，$g(t)=u(t)+iv(t)$叫作实变量的:term[复值函数]{id="math.complex-analysis.complex-valued-function"}（complex-valued function）。$u$、$v$都可导时，规定$g'(t)=u'(t)+iv'(t)$；$u$、$v$在$[a,b]$上可积（integrable）时，规定$\int_a^bg(t)\dd t=\int_a^bu(t)\dd t+i\int_a^bv(t)\dd t$。

为什么这样定义：$g'(t)$仍是差商（difference quotient）$\frac{g(t+h)-g(t)}h$的极限，:term[实部]{id="math.complex-analysis.real-part"}、:term[虚部]{id="math.complex-analysis.imaginary-part"}分别取极限。求导和积分的线性性（系数可以是:term[复数]{id="math.complex-analysis.complex-number"}）、乘积法则（product rule）、牛顿-莱布尼茨公式（Newton-Leibniz formula）$\int_a^bg'(t)\dd t=g(b)-g(a)$都照样成立：对实部、虚部分别用实函数的公式，乘积法则展开验证即可。边界情况：复数不比大小，所以「单调」「最大值」这些说法对$g$本身没有意义，只能对$|g|$、$\Re g$这些实函数说。

::anchor{id="thm-exp-derivative"}
**定理**　设$\lambda$是复数，则$(e^{\lambda t})'=\lambda e^{\lambda t}$；$\lambda\ne0$时，$\int_a^be^{\lambda t}\dd t=\frac{e^{\lambda b}-e^{\lambda a}}\lambda$。

**证明**：设$\lambda=\alpha+i\beta$，则$e^{\lambda t}=e^{\alpha t}\cos\beta t+ie^{\alpha t}\sin\beta t$。实部、虚部分别求导，

$$
\begin{aligned}
\Re\,(e^{\lambda t})'&=\alpha e^{\alpha t}\cos\beta t-\beta e^{\alpha t}\sin\beta t,\\
\Im\,(e^{\lambda t})'&=\alpha e^{\alpha t}\sin\beta t+\beta e^{\alpha t}\cos\beta t.
\end{aligned}
$$

另一方面，把$\lambda e^{\lambda t}=(\alpha+i\beta)e^{\alpha t}(\cos\beta t+i\sin\beta t)$展开，实部、虚部和上面两行相同。积分：$\frac{e^{\lambda t}}\lambda$的导数是$e^{\lambda t}$，用牛顿-莱布尼茨公式即得。

为什么有用：:term[常微分方程]{id="math.ode.ode"}里试$y=e^{\lambda x}$时，复数$\lambda$也照样代：$(e^{\lambda x})''=\lambda^2e^{\lambda x}$，于是$y''+ay'+by=(\lambda^2+a\lambda+b)e^{\lambda x}$，见[常系数齐次线性方程](lesson:math.ode.constant-coefficients)。积分公式给出$\int_0^{2\pi}e^{int}\dd t=0$（$n$是非零整数），以后算:term[复积分]{id="math.complex-analysis.contour-integral"}（contour integral）常用。边界情况：$g(t)=e^{it}$满足$g(2\pi)=g(0)$，导数$ie^{it}$的:term[模]{id="math.complex-analysis.modulus"}却处处是$1$，没有哪一点导数为$0$：拉格朗日中值定理（mean value theorem）不能照搬到复值函数上。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-2, 2], y: [-0.2, 2.2] }
functions:
  - expr: "sqrt(max(0, 1 - x^2)) + 0*sqrt(1.01 - abs(x))"
    label: |
      单位圆的上半
points:
  - { x: "1", y: "0" }
  - { x: "1", y: "th" }
  - { x: "1 - th^2/2", y: "th" }
  - { x: "1 - th^2/2", y: "th - th^3/6" }
  - { x: "1 - th^2/2 + th^4/24", y: "th - th^3/6" }
  - { x: "1 - th^2/2 + th^4/24", y: "th - th^3/6 + th^5/120" }
  - { x: "1 - th^2/2 + th^4/24 - th^6/720", y: "th - th^3/6 + th^5/120" }
  - { x: "1 - th^2/2 + th^4/24 - th^6/720", y: "th - th^3/6 + th^5/120 - th^7/5040" }
  - { x: "1 - th^2/2 + th^4/24 - th^6/720 + th^8/40320", y: "th - th^3/6 + th^5/120 - th^7/5040" }
  - { x: "1 - th^2/2 + th^4/24 - th^6/720 + th^8/40320", y: "th - th^3/6 + th^5/120 - th^7/5040 + th^9/362880" }
sliders:
  - name: th
    min: 0
    max: 2
    step: 0.05
    default: 1.5
    label: |
      $\theta$
:::

蓝线是单位圆的上半。十个圆点依次是级数$\sum\frac{(i\theta)^n}{n!}$的部分和$S_0=1$，$S_1=1+i\theta$，$S_2=1+i\theta-\frac{\theta^2}2$，……，一直到$S_9$：每加一项，走的方向比上一步向左转$90^\circ$，步长$\frac{\theta^n}{n!}$越来越短。拖动$\theta$：圆点绕着弯聚到单位圆上:term[辐角]{id="math.complex-analysis.argument"}为$\theta$的那一点，也就是$\cos\theta+i\sin\theta$；$\theta$越大，开头几步走得越远，要更多项才聚拢。

## 例题

### 例 1　三倍角公式

用:term[欧拉公式]{id="math.complex-analysis.euler-formula"}把$\cos3\theta$、$\sin3\theta$写成$\cos\theta$、$\sin\theta$的式子。

**为什么想到这么做**：指数法则给出$e^{3i\theta}=(e^{i\theta})^3$。左边是$\cos3\theta+i\sin3\theta$，右边用二项式展开，再比较:term[实部]{id="math.complex-analysis.real-part"}和:term[虚部]{id="math.complex-analysis.imaginary-part"}。

**推导**：记$c=\cos\theta$，$s=\sin\theta$，

$$
(c+is)^3=c^3+3c^2(is)+3c(is)^2+(is)^3=(c^3-3cs^2)+i(3c^2s-s^3).
$$

比较实部、虚部，$\cos3\theta=\cos^3\theta-3\cos\theta\sin^2\theta=4\cos^3\theta-3\cos\theta$，$\sin3\theta=3\cos^2\theta\sin\theta-\sin^3\theta=3\sin\theta-4\sin^3\theta$。一个:term[复数]{id="math.complex-analysis.complex-number"}等式顶两个实数等式。

### 例 2　用复指数算积分

求$\int_0^\pi e^{2t}\cos3t\,\dd t$。

**为什么想到这么做**：$e^{2t}\cos3t$是$e^{(2+3i)t}$的:term[实部]{id="math.complex-analysis.real-part"}。分部积分要做两次再解方程，换成:term[复值函数]{id="math.complex-analysis.complex-valued-function"}$e^{(2+3i)t}$，一步就积出来，最后取实部。

**推导**：由上面的积分公式，

$$
\int_0^\pi e^{(2+3i)t}\dd t=\frac{e^{(2+3i)\pi}-1}{2+3i}=\frac{-e^{2\pi}-1}{2+3i}=-\frac{(e^{2\pi}+1)(2-3i)}{13},
$$

这里用了$e^{3\pi i}=-1$。积分的实部就是实部的积分，所以$\int_0^\pi e^{2t}\cos3t\,\dd t=-\frac{2(e^{2\pi}+1)}{13}\approx-82.54$；顺带，:term[虚部]{id="math.complex-analysis.imaginary-part"}给出$\int_0^\pi e^{2t}\sin3t\,\dd t=\frac{3(e^{2\pi}+1)}{13}$。

## 常见误区

- 「$e^z$总是正数。」$e^z=e^x(\cos y+i\sin y)$一般不是实数，比如$e^{i\pi/2}=i$；只有$y$是$\pi$的整数倍时它才是实数，而$e^{i\pi}=-1$还是负数。
- 「$e^z=e^w$推出$z=w$。」只能推出$z-w=2k\pi i$，例如$e^{2\pi i}=e^0=1$。
- 「$|e^z|=e^{|z|}$。」应当是$|e^z|=e^{\Re z}$：$|e^{i\pi}|=1$，而$e^{|i\pi|}=e^\pi$。

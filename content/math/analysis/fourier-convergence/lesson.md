---
id: math.analysis.fourier-convergence
title: |
  傅里叶级数的收敛
goal: |
  会用狄利克雷定理判断傅里叶级数在各点收敛到什么，并解释吉布斯现象。
prerequisites: [math.analysis.fourier-series, math.analysis.uniform-convergence]
minutes: 30
summary: |
  分段光滑时级数收敛到左右极限的平均；跳跃旁有吉布斯现象。
status: reviewed
proofPolicy: sketch
---

## 这一节要回答的问题

上一节只写了「$\sim$」。方波的:term[傅里叶级数]{id="math.analysis.fourier-series"}（Fourier series）在$x=0$处的和是$0$，正是跳跃两侧的中点：一般的函数也是这样吗？什么样的函数，傅里叶级数处处:term[收敛]{id="math.analysis.convergent-series"}（convergent series）到它自己？跳跃点旁边那个尖角，项数再多也不消失，又说明了什么？

## 讲解

### 部分和与狄利克雷核

设$f$以$2\pi$为周期，在一个周期上:term[可积]{id="math.analysis.riemann-integral"}（Riemann integrable）。把系数公式代进:term[部分和]{id="math.analysis.partial-sum"}（partial sum）$S_N(x)=\frac{a_0}{2}+\sum_{n=1}^N(a_n\cos nx+b_n\sin nx)$，交换有限和与积分，再用$\cos nt\cos nx+\sin nt\sin nx=\cos n(t-x)$和换元$t=x+u$（被积函数以$2\pi$为周期，积分区间可以平移），得

$$S_N(x)=\frac1\pi\int_{-\pi}^{\pi}f(x+u)D_N(u)\dd u,\qquad D_N(u)=\frac12+\sum_{n=1}^N\cos nu.$$

::anchor{id="def-dirichlet-kernel"}
函数$D_N(u)=\frac12+\sum_{n=1}^N\cos nu$叫作:term[狄利克雷核]{id="math.analysis.dirichlet-kernel"}（Dirichlet kernel）。$u$不是$2\pi$的整数倍时，$D_N(u)=\frac{\sin(N+\frac12)u}{2\sin\frac u2}$（第 6 题）。

为什么这样定义：部分和是$f(x+u)$按权重$D_N(u)$做的「加权平均」，$S_N(x)$怎样随$N$变化，全看$D_N$长什么样。$D_N$是偶函数（even function），$\frac1\pi\int_{-\pi}^{\pi}D_N(u)\dd u=1$；它在$u=0$处有一个高$N+\frac12$的尖峰，两边振荡得越来越快（几何图像）。边界情况：$D_N$有负值，而且$\int_{-\pi}^{\pi}|D_N(u)|\dd u$随$N$增大趋于无穷，「加权平均」的直观不能全信，:term[收敛]{id="math.analysis.convergent-series"}要另外证明。

### 狄利克雷定理

下面记$f(x^+)$、$f(x^-)$为$f$在$x$处的右、左:term[单侧极限]{id="math.analysis.one-sided-limit"}（one-sided limit）。

::anchor{id="def-piecewise-smooth"}
设$f$在$[a,b]$上有定义。如果能用有限个点把$[a,b]$分成若干小区间，$f$在每个小区间的内部有:term[连续]{id="math.analysis.continuous-function"}（continuous）的导数，并且在每个分点处$f$和$f'$的单侧极限都存在（区间端点只看一侧），就说$f$在$[a,b]$上:term[分段光滑]{id="math.analysis.piecewise-smooth"}（piecewise smooth）。

为什么这样定义：方波、锯齿波、$|x|$都是这样：只有有限个跳跃或尖角，其余地方光滑。下面的证明只用到两件事：$f$:term[有界]{id="math.analysis.bounded-function"}（bounded function），并且在每一点，$\frac{f(x+u)-f(x^+)}{u}$在$u\to0^+$时有界（左边同理），由:term[拉格朗日中值定理]{id="math.analysis.mean-value-theorem"}（mean value theorem），分段光滑保证了这一点。边界情况：$\sqrt{|x|}$在$[-1,1]$上不是分段光滑的，导数$\frac{1}{2\sqrt x}$在$0^+$处没有有限的:term[极限]{id="math.analysis.function-limit"}（limit of a function，lim）。

::anchor{id="thm-dirichlet"}
**定理 1**　设$f$以$2\pi$为周期，在$[-\pi,\pi]$上分段光滑，则$f$的:term[傅里叶级数]{id="math.analysis.fourier-series"}在每一点$x$都:term[收敛]{id="math.analysis.convergent-series"}，和是$\frac{f(x^-)+f(x^+)}{2}$；在$f$连续的点，和就是$f(x)$。这叫作:term[狄利克雷定理]{id="math.analysis.dirichlet-theorem"}（Dirichlet's theorem）。

**证明思路**：$D_N$是偶函数，$\frac1\pi\int_0^\pi D_N=\frac12$，所以

$$S_N(x)-\frac{f(x^-)+f(x^+)}{2}=\frac1\pi\int_0^\pi\bigl[f(x+u)-f(x^+)\bigr]D_N(u)\dd u+\frac1\pi\int_0^\pi\bigl[f(x-u)-f(x^-)\bigr]D_N(u)\dd u.$$

第一项里，令$g(u)=\frac{f(x+u)-f(x^+)}{2\sin\frac u2}$，它在$(0,\pi]$上有界、:term[可积]{id="math.analysis.riemann-integral"}：$u\to0^+$时它和差商$\frac{f(x+u)-f(x^+)}{u}$只差一个趋于$1$的因子。于是第一项是$\frac1\pi\int_0^\pi g(u)\sin\bigl(N+\frac12\bigr)u\dd u$，由下面的引理，它趋于$0$；第二项同理。

::anchor{id="thm-riemann-lebesgue"}
**引理**　设$g$在$[a,b]$上可积，则$\lambda\to+\infty$时$\int_a^bg(u)\sin\lambda u\dd u\to0$，把$\sin$换成$\cos$也一样。这叫作:term[黎曼-勒贝格引理]{id="math.analysis.riemann-lebesgue-lemma"}（Riemann-Lebesgue lemma）。

**证明思路**：$g$是常数$c$时，$\int_a^bc\sin\lambda u\dd u=\frac{c(\cos\lambda a-\cos\lambda b)}{\lambda}\to0$：$\lambda$大了，正负两半一波一波地抵消。阶梯函数（step function）是有限个常数拼成的，结论也成立；一般的可积函数在积分的意义下能用阶梯函数任意逼近（取一个:term[分割]{id="math.analysis.partition"}（partition）上的:term[下和]{id="math.analysis.lower-sum"}（lower sum）对应的阶梯函数），就推到了一般情形，见第 5 题。$g$有连续导数时，分部积分（integration by parts）直接给出$O\bigl(\frac1\lambda\bigr)$，见[傅里叶级数](lesson:math.analysis.fourier-series)第 5 题。

### 一致收敛与吉布斯现象

::anchor{id="thm-fourier-uniform"}
**定理 2**　设$f$以$2\pi$为周期、:term[连续]{id="math.analysis.continuous-function"}，并且在$[-\pi,\pi]$上:term[分段光滑]{id="math.analysis.piecewise-smooth"}，则$f$的:term[傅里叶级数]{id="math.analysis.fourier-series"}在$\R$上:term[一致收敛]{id="math.analysis.uniform-convergence"}（uniform convergence）于$f$。

**证明思路**：分部积分，并用$f(-\pi)=f(\pi)$，$f'$的:term[傅里叶系数]{id="math.analysis.fourier-coefficients"}（Fourier coefficients）是$nb_n$和$-na_n$。记$T_N$为$f'$的傅里叶级数的:term[部分和]{id="math.analysis.partial-sum"}，由正交性，$0\le\int_{-\pi}^{\pi}(f'-T_N)^2\dd x=\int_{-\pi}^{\pi}f'^2\dd x-\pi\sum_{n=1}^Nn^2(a_n^2+b_n^2)$，所以$\sum n^2(a_n^2+b_n^2)$:term[收敛]{id="math.analysis.convergent-series"}（这是:term[贝塞尔不等式]{id="math.analysis.bessel-inequality"}（Bessel's inequality），[贝塞尔不等式与帕塞瓦尔等式](lesson:math.analysis.parseval)会细讲）；又$|a_n|\le\frac12\bigl(n^2a_n^2+\frac{1}{n^2}\bigr)$，所以$\sum(|a_n|+|b_n|)$收敛。$|a_n\cos nx+b_n\sin nx|\le|a_n|+|b_n|$，由:term[魏尔斯特拉斯判别法]{id="math.analysis.weierstrass-m-test"}（Weierstrass M-test，见[函数项级数与魏尔斯特拉斯判别法](lesson:math.analysis.function-series#thm-weierstrass-m-test)），:term[级数]{id="math.analysis.series"}（series）一致收敛，由定理 1，和就是$f$。

反过来，$f$有跳跃时，级数不可能一致收敛：部分和都是连续函数，一致收敛的连续函数列，极限也连续（[一致收敛与极限交换](lesson:math.analysis.uniform-limit-theorems#thm-uniform-limit-continuous)的定理 1）。跳跃附近发生的事，就是下面的现象。

::anchor{id="def-gibbs"}
方波$f(x)=-1$（$-\pi<x<0$）、$f(x)=1$（$0<x<\pi$）的部分和$S_N(x)=\frac4\pi\sum_{k=1}^N\frac{\sin(2k-1)x}{2k-1}$，在$x=\frac{\pi}{2N}$处取得$(0,\pi)$里的第一个极大值。$N\to\infty$时这个极大值趋于$\frac2\pi\int_0^\pi\frac{\sin t}{t}\dd t\approx1.1790$，比$f$的值$1$高出跳跃高度$2$的约$9\%$。部分和在跳跃旁边冲过头、冲过头的幅度不随$N$减小，这叫作:term[吉布斯现象]{id="math.analysis.gibbs-phenomenon"}（Gibbs phenomenon）。

**证明思路**：$S_N'(x)=\frac4\pi\sum_{k=1}^N\cos(2k-1)x=\frac{2\sin2Nx}{\pi\sin x}$，它在$(0,\pi)$里的第一个零点是$\frac{\pi}{2N}$。代进去，$S_N\bigl(\frac{\pi}{2N}\bigr)=\frac2\pi\sum_{k=1}^N\frac{\pi}{N}\cdot\frac{\sin t_k}{t_k}$，$t_k=\frac{(2k-1)\pi}{2N}$，这是$\frac{\sin t}{t}$在$[0,\pi]$上的黎曼和（Riemann sum），趋于那个积分。

为什么要单独起名：它说明:term[逐点收敛]{id="math.analysis.pointwise-convergence"}（pointwise convergence）和一致收敛的差别在画面上就看得见：尖峰的位置$\frac{\pi}{2N}$越来越靠近跳跃点，高度却不降。边界情况：$f$连续并且分段光滑时（如$|x|$）没有吉布斯现象，定理 2 保证了一致收敛。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-3.5, 3.5], y: [-1.5, 1.5] }
functions:
  - expr: "sign(sin(x))"
    label: |
      方波$f$
  - expr: "4/pi * sum(k, 1, N, sin((2k - 1)*x) / (2k - 1))"
    label: |
      部分和$S_N$
  - expr: "1.1789797"
    label: |
      $y\approx1.179$
sliders:
  - name: N
    min: 1
    max: 30
    step: 1
    default: 5
    label: |
      项数$N$
:::

拖动$N$：在每个:term[连续]{id="math.analysis.continuous-function"}点，:term[部分和]{id="math.analysis.partial-sum"}都贴向方波；在跳跃点$x=0$、$\pm\pi$处，部分和恒为$0$，是两侧的中点。跳跃旁边的尖峰随$N$增大越来越窄、越来越靠近跳跃点，高度却降不下去：$N=1$时约$1.27$，$N$大了以后稳定在$1.179$附近，这就是:term[吉布斯现象]{id="math.analysis.gibbs-phenomenon"}。

:::anim{component="function-plot"}
range: { x: [-3.2, 3.2], y: [-5, 16] }
functions:
  - expr: "0.5 + sum(k, 1, N, cos(k*x))"
    label: |
      $y=D_N(u)$（横轴是$u$）
sliders:
  - name: N
    min: 1
    max: 15
    step: 1
    default: 5
    label: |
      $N$
:::

这是:term[狄利克雷核]{id="math.analysis.dirichlet-kernel"}。$N$越大，中间的尖峰越高越窄，两边振荡得越快；尖峰下面积分的贡献集中在$u=0$附近，振荡的部分在和光滑函数相乘积分时互相抵消，这正是定理 1 证明的思路。

## 例题

### 例 1　$1-\frac13+\frac15-\cdots$的和

用方波的:term[傅里叶级数]{id="math.analysis.fourier-series"}求$1-\frac13+\frac15-\frac17+\cdots$。

**为什么想到这么做**：方波的:term[级数]{id="math.analysis.series"}里有$\frac{\sin(2k-1)x}{2k-1}$，在$x=\frac{\pi}{2}$处$\sin(2k-1)\frac{\pi}{2}=(-1)^{k+1}$，正好给出这个交错级数；方波在$\frac{\pi}{2}$处:term[连续]{id="math.analysis.continuous-function"}，由:term[狄利克雷定理]{id="math.analysis.dirichlet-theorem"}，级数的和就是$f\bigl(\frac{\pi}{2}\bigr)=1$。

**推导**：方波在$[-\pi,\pi]$上:term[分段光滑]{id="math.analysis.piecewise-smooth"}，在$x=\frac{\pi}{2}$处连续，所以$1=\frac4\pi\sum_{k=1}^\infty\frac{\sin(2k-1)\frac{\pi}{2}}{2k-1}=\frac4\pi\Bigl(1-\frac13+\frac15-\cdots\Bigr)$，即$1-\frac13+\frac15-\cdots=\frac{\pi}{4}$。

### 例 2　哪些级数一致收敛

[傅里叶级数](lesson:math.analysis.fourier-series)的例 1、第 3 题分别算了$x$和$|x|$（$-\pi\le x\le\pi$）的:term[傅里叶级数]{id="math.analysis.fourier-series"}。它们:term[一致收敛]{id="math.analysis.uniform-convergence"}吗？

**为什么想到这么做**：两个函数都:term[分段光滑]{id="math.analysis.piecewise-smooth"}。要不要一致收敛，看周期延拓以后是否:term[连续]{id="math.analysis.continuous-function"}，也就是比较$f(-\pi)$和$f(\pi)$。

**推导**：$x$在两端的值是$-\pi$和$\pi$，延拓后在$\pm\pi$处跳跃$2\pi$，:term[部分和]{id="math.analysis.partial-sum"}都是连续函数，:term[级数]{id="math.analysis.series"}不可能一致收敛，跳跃旁边有:term[吉布斯现象]{id="math.analysis.gibbs-phenomenon"}。$|x|$在两端都是$\pi$，延拓后连续、分段光滑，由定理 2，级数一致收敛于$|x|$；它的系数是$\frac{1}{n^2}$量级，$\sum\frac{1}{n^2}$:term[收敛]{id="math.analysis.convergent-series"}，也直接说明了这一点。

## 常见误区

- 「:term[傅里叶级数]{id="math.analysis.fourier-series"}:term[收敛]{id="math.analysis.convergent-series"}到$f$。」在跳跃点收敛到两侧的中点，$f$在那一点取什么值，根本不影响:term[级数]{id="math.analysis.series"}（定理 1）。
- 「项数足够多，:term[部分和]{id="math.analysis.partial-sum"}在跳跃附近也会贴近$f$。」不会：尖峰变窄，高度不降，这是:term[吉布斯现象]{id="math.analysis.gibbs-phenomenon"}，级数不:term[一致收敛]{id="math.analysis.uniform-convergence"}。
- 「:term[连续]{id="math.analysis.continuous-function"}函数的傅里叶级数一定处处收敛。」只连续还不够（第 7 题）；定理 1、定理 2 都要求:term[分段光滑]{id="math.analysis.piecewise-smooth"}。

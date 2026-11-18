---
id: math.complex-analysis.maximum-modulus
title: |
  平均值性质与最大模原理
goal: |
  会用平均值性质证明最大模原理，并用它估计函数在区域内的取值。
prerequisites: [math.complex-analysis.harmonic-functions]
minutes: 26
summary: |
  圆心的值是圆周上的平均；不是常数时$|f|$在区域内部取不到最大值。
status: reviewed
---

## 这一节要回答的问题

[柯西积分公式](lesson:math.complex-analysis.cauchy-integral-formula#thm-mean-on-circle)一节说明，:term[全纯函数]{id="math.complex-analysis.holomorphic-function"}（holomorphic function）在圆心的值是圆周上的平均值（average value）。调和函数（harmonic function）也这样吗？圆心的值是平均值，圆心就不会比周围都高；那么$|f|$能不能在:term[区域]{id="math.complex-analysis.domain"}（domain）内部取到最大值？

## 讲解

### 平均值性质

::anchor{id="def-mean-value-property"}
设$u$是:term[开集]{id="math.complex-analysis.open-set"}（open set）$D$上的连续函数，可以是实值，也可以是复值。如果对$D$里的每个:term[开圆盘]{id="math.complex-analysis.open-disc"}（open disc）$|z-a|<R$和每个$0<r<R$，都有$u(a)=\frac1{2\pi}\int_0^{2\pi}u(a+re^{it})\,\dd t$，就说$u$在$D$上有:term[平均值性质]{id="math.complex-analysis.mean-value-property"}（mean value property）。

为什么这样定义：圆心的值等于圆周上的平均值，$u$是实值时，圆周上的值就不可能全比圆心大，也不可能全比圆心小，后面证明「最大值不在内部取到」时只用到这一点。只取含在$D$里的开圆盘内的圆周：圆周在$D$里，$u$在圆周上才有定义；整个圆盘也要在$D$里，不然:term[全纯函数]{id="math.complex-analysis.holomorphic-function"}也可能不满足，比如$\frac1z$在去掉原点的平面上全纯，圆周$|z-\frac12|=1$在这个平面里，可它围着原点，$\frac1z$在上面的平均值是$0$，不等于圆心处的值$2$。边界情况：$|z|^2$没有平均值性质：它在$0$处是$0$，在圆周$|z|=r$上处处是$r^2$，平均值是$r^2$。

::anchor{id="thm-mean-value"}
**定理**　:term[全纯函数]{id="math.complex-analysis.holomorphic-function"}和调和函数都有平均值性质。

**证明**：设$f$在开集$D$上全纯，开圆盘$|z-a|<R$含在$D$里，由[圆心处的平均值](lesson:math.complex-analysis.cauchy-integral-formula#thm-mean-on-circle)，$0<r<R$时$f(a)$等于$f$在圆周$|z-a|=r$上的平均值。设$u$在$D$上调和，即有连续的二阶偏导数、$\lap u=0$；在开圆盘$|z-a|<R$上，由[圆盘里一定有共轭调和函数](lesson:math.complex-analysis.harmonic-functions#thm-conjugate-disc)，$u$是某个全纯函数$f$的:term[实部]{id="math.complex-analysis.real-part"}（real part），对$f$的平均值公式取实部即得。

为什么有用：这兑现了[向量微分恒等式与拉普拉斯算子](lesson:math.vector-calculus.vector-identities)一节说的调和函数「在每一点都等于周围的平均值」；电磁学[泊松方程与拉普拉斯方程](lesson:physics.electromagnetism.poisson-equation)一节的三维平均值性质也是同一回事。边界情况：$|f|$一般没有平均值性质，只满足$|f(a)|\le\frac1{2\pi}\int_0^{2\pi}|f(a+re^{it})|\,\dd t$：$f(z)=z$、$a=0$时左边是$0$，右边是$r$。

### 最大模原理

::anchor{id="thm-maximum-modulus"}
**定理（:term[最大模原理]{id="math.complex-analysis.maximum-modulus-principle"}，maximum modulus principle）**　设$f$在:term[区域]{id="math.complex-analysis.domain"}$D$上:term[全纯]{id="math.complex-analysis.holomorphic-function"}，并且$|f|$在$D$里某一点$z_0$取到它在$D$上的最大值。则$f$在$D$上是常数。

**证明**：先看$z_0$附近。记$M=|f(z_0)|$，$f(z_0)=Me^{i\alpha}$，令$g=e^{-i\alpha}f$，则$g(z_0)=M$，$D$上处处$|g|\le M$。取含在$D$里的:term[开圆盘]{id="math.complex-analysis.open-disc"}$|z-z_0|<R$，$0<r<R$时，对$g$用:term[平均值性质]{id="math.complex-analysis.mean-value-property"}再取:term[实部]{id="math.complex-analysis.real-part"}，$M=\frac1{2\pi}\int_0^{2\pi}\Re g(z_0+re^{it})\,\dd t$；而$\Re g\le|g|\le M$，连续函数$M-\Re g(z_0+re^{it})$非负、积分为$0$，只能处处为$0$。于是圆周上$\Re g=M$，又$|g|\le M$，所以:term[虚部]{id="math.complex-analysis.imaginary-part"}（imaginary part）为$0$、$g=M$；$r$任取，$f$在这个圆盘里恒等于$f(z_0)$。

再看整个$D$。任取$w\in D$，用落在$D$里的折线$\gamma(s)$（$0\le s\le1$）从$z_0$连到$w$；记$s^*$是这样的$t$的上确界（supremum）：对一切$s\le t$，$f(\gamma(s))=f(z_0)$。由连续性$f(\gamma(s^*))=f(z_0)$，$|f|$在$\gamma(s^*)$也取到最大值，由前面的论证，$f$在$\gamma(s^*)$附近的一个圆盘里恒等于$f(z_0)$；$s^*<1$的话，比$s^*$稍大的$s$也满足，和上确界矛盾。所以$s^*=1$，$f(w)=f(z_0)$。

为什么有用：有界区域上，$f$不是常数时，$|f|$的最大值只在边界上取到，只看边界就能估计区域里的值。比如$f$在有界闭区域（bounded closed region）上连续、在内部全纯时，由最值定理（extreme value theorem），$|f|$在这个闭区域上取到最大值，不在内部取到就在边界上取到；在内部取到时$f$是常数，边界上也取到。边界情况：区域无界时，边界上有界推不出内部有界：上半平面里$|e^{-iz}|=e^{\Im z}$，:term[实轴]{id="math.complex-analysis.real-axis"}（real axis）上处处是$1$，内部却无界（第 8 题）。

### 圆盘上的估计

::anchor{id="thm-disc-bound"}
**定理**　设$f$在以$a$为圆心、半径大于$R$的:term[开圆盘]{id="math.complex-analysis.open-disc"}上:term[全纯]{id="math.complex-analysis.holomorphic-function"}，$M$是$|f|$在圆周$|z-a|=R$上的最大值。则$|z-a|\le R$时$|f(z)|\le M$。

**证明**：圆周上的点不用证。$|z-a|<R$时，对每个正整数$n$，$f^n$也全纯，在圆周上$|f^n|\le M^n$；照[柯西积分公式](lesson:math.complex-analysis.cauchy-integral-formula)第 6 题的估计，$|f(z)|^n\le\frac{M^nR}{R-|z-a|}$。开$n$次方，$|f(z)|\le M\bigl(\frac R{R-|z-a|}\bigr)^{1/n}$，令$n\to\infty$，右边趋于$M$。

为什么有用：它不用最值定理，直接把圆内的值控制在圆周上的最大值以下，补上了那道题里粗糙的界$\frac{MR}{R-|z-a|}$：取$n$次方，粗糙的那个因子开方以后趋于$1$。边界情况：圆内某点取到等号时，$|f|$在圆盘里取到最大值，由:term[最大模原理]{id="math.complex-analysis.maximum-modulus-principle"}，$f$是常数。

### 最小模和调和函数

::anchor{id="thm-min-harmonic"}
**定理**　设$f$在:term[区域]{id="math.complex-analysis.domain"}$D$上:term[全纯]{id="math.complex-analysis.holomorphic-function"}、处处不为$0$，$|f|$在$D$里某点取到最小值，则$f$是常数。设$u$在区域$D$上调和，在$D$里某点取到最大值或最小值，则$u$是常数。

**证明**：$\frac1f$在$D$上全纯，$|f|$的最小值点就是$\bigl|\frac1f\bigr|$的最大值点，由:term[最大模原理]{id="math.complex-analysis.maximum-modulus-principle"}，$\frac1f$是常数。调和函数照最大模原理的证明，把$\Re g$换成$u$：在最大值点$z_0$附近，$u(z_0)-u$在每个圆周上非负、平均值为$0$，所以为$0$，再沿折线推到整个$D$；最小值看$-u$。

为什么有用：平板上不再随时间变化的温度是调和函数，内部取不到最高温，也取不到最低温，最高、最低都在边界上（第 7 题）。边界情况：关于最小值的结论要求$f$没有零点：$f(z)=z$在单位圆盘里，$|f|$在$0$处取到最小值$0$，$f$却不是常数。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-1, 1], y: [0, 1.4] }
functions:
  - expr: "sqrt(x^4 - 0.5*x^2*cos(2*th) + 0.0625)"
    label: |
      $|f|$在直径上的值
sliders:
  - name: th
    min: 0
    max: 1.57
    step: 0.01
    default: 0
    label: |
      方向角$\theta$
:::

$f(z)=z^2-\frac14$。横轴是单位圆盘里一条直径上的参数$x$（$-1\le x\le1$，图上的点是$xe^{i\theta}$），这条直径的方向角是$\theta$，曲线是$|f|$在直径上的值。拖动$\theta$：每条直径上$|f|$的最大值都在两端，也就是在圆周上；$\theta=0$时曲线在$x=\pm\frac12$处碰到$0$，那是$f$的零点，最小值可以在内部取到。整个闭圆盘上，$|f|$的最大值$\frac54$在圆周上的$\pm i$处取到（例 1）。

## 例题

### 例 1　在圆周上找最大值

求$\bigl|z^2-\frac14\bigr|$在闭圆盘$|z|\le1$上的最大值。

**为什么想到这么做**：$z^2-\frac14$是:term[整函数]{id="math.complex-analysis.entire-function"}（entire function），由圆盘上的估计，最大值在圆周上取到，只要在圆周上找。

**推导**：$z=e^{it}$时，$\bigl|e^{2it}-\frac14\bigr|^2=1-\frac12\cos2t+\frac1{16}$，$\cos2t=-1$即$t=\pm\frac\pi2$时最大，为$\frac{25}{16}$。所以最大值是$\frac54$，在$z=\pm i$处取到。

### 例 2　最大值和最小值都在边界上

求$|e^z|$在闭圆盘$|z|\le1$上的最大值和最小值。

**为什么想到这么做**：$e^z$:term[全纯]{id="math.complex-analysis.holomorphic-function"}、处处不为$0$，:term[最大模原理]{id="math.complex-analysis.maximum-modulus-principle"}和关于最小值的结论都能用，两个最值都在圆周上。$|e^z|=e^x$，直接看也很清楚。

**推导**：$|e^{x+iy}|=e^x$，闭圆盘里$-1\le x\le1$，所以最大值是$e$（在$z=1$处），最小值是$\frac1e$（在$z=-1$处），都在圆周上。$\ln|e^z|=x$是调和函数，它的最大值、最小值也都在边界上。

## 常见误区

- 「$|f|$在:term[区域]{id="math.complex-analysis.domain"}内部取不到最小值。」$f$有零点时可以：$f(z)=z$在单位圆盘里，$|f|$在$0$处取到最小值$0$。
- 「:term[最大模原理]{id="math.complex-analysis.maximum-modulus-principle"}说，$|f|$在边界上处处等于最大值。」它只说有界区域上的最大值在边界上的某处取到：$z^2-\frac14$在单位圆周上的:term[模]{id="math.complex-analysis.modulus"}（modulus）从$\frac34$变到$\frac54$（例 1）。
- 「边界上$|f|\le M$，内部就$|f|\le M$。」区域无界时不一定：在上半平面，$e^{-iz}$在:term[实轴]{id="math.complex-analysis.real-axis"}上的模是$1$，内部却无界。

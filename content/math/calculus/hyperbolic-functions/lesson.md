---
id: math.calculus.hyperbolic-functions
title: |
  双曲函数
goal: |
  会用指数函数定义$\sinh x$、$\cosh x$、$\tanh x$，推出它们的导数和$\cosh^2x-\sinh^2x=1$，并认出悬链线、终端速度这些用到它们的场合。
prerequisites: [math.calculus.elementary-derivatives, math.calculus.chain-rule]
minutes: 26
summary: |
  $\cosh x$、$\sinh x$是$e^x$的偶、奇部分，$\cosh^2x-\sinh^2x=1$。
status: reviewed
---

## 这一节要回答的问题

把$e^x$拆成偶的部分和奇的部分，得到两个函数，它们满足一个和$\cos^2x+\sin^2x=1$极像的恒等式，只差一个符号。两端挂起的链条、在空气里下落的雨滴，都离不开这两个函数。它们是什么，为什么叫「双曲」？

## 讲解

### 定义

任何定义在整条数轴上的函数都能拆成一个偶函数加一个奇函数，$e^x$拆出来是$e^x=\frac{e^x+e^{-x}}2+\frac{e^x-e^{-x}}2$。这两部分有专门的名字。

::anchor{id="def-hyperbolic"}
$\sinh x=\frac{e^x-e^{-x}}2$叫作:term[双曲正弦]{id="math.calculus.hyperbolic-sine"}（hyperbolic sine，sinh），$\cosh x=\frac{e^x+e^{-x}}2$叫作:term[双曲余弦]{id="math.calculus.hyperbolic-cosine"}（hyperbolic cosine，cosh），$\tanh x=\frac{\sinh x}{\cosh x}=\frac{e^x-e^{-x}}{e^x+e^{-x}}$叫作:term[双曲正切]{id="math.calculus.hyperbolic-tangent"}（hyperbolic tangent，tanh），它们统称:term[双曲函数]{id="math.calculus.hyperbolic-functions"}（hyperbolic functions）。

为什么这样定义：$\cosh x$是偶函数，$\sinh x$是奇函数，$\cosh x+\sinh x=e^x$；它们和$\cos x$、$\sin x$有一整套平行的公式（下面的恒等式和:term[导数]{id="math.calculus.derivative"}（derivative）），所以借了正弦、余弦的名字。边界情况：$\cosh x\ge1$，只在$x=0$处等于$1$；$\sinh x$取遍所有实数；$\tanh x$总在$-1$和$1$之间，$x\to\pm\infty$时趋于$\pm1$，$y=\pm1$是它的:term[水平渐近线]{id="math.calculus.horizontal-asymptote"}（horizontal asymptote）。$x$很大时$e^{-x}$可以忽略，$\cosh x$、$\sinh x$都约等于$\frac{e^x}2$（见几何图像）。

### 恒等式与双曲线

把定义代进去，$\cosh^2x-\sinh^2x=\frac{(e^x+e^{-x})^2-(e^x-e^{-x})^2}4=\frac{4e^x\cdot e^{-x}}4=1$。

::anchor{id="thm-hyperbolic-identity"}
**定理 1**　$\cosh^2x-\sinh^2x=1$。

这就是名字里「双曲」的来历：点$(\cos t,\sin t)$在单位圆$x^2+y^2=1$上，点$(\cosh t,\sinh t)$在双曲线$x^2-y^2=1$上，而且因为$\cosh t\ge1$，总在右边那一支。两边同除以$\cosh^2x$，又得到$1-\tanh^2x=\frac1{\cosh^2x}$。边界情况：$t$不再是角度，它不是点和原点连线的转角；转角的正切是$\frac{\sinh t}{\cosh t}=\tanh t$，绝对值永远小于$1$，所以连线总在两条渐近线$y=\pm x$之间。

### 导数

由:term[链式法则]{id="math.calculus.chain-rule"}（chain rule，见[链式法则](lesson:math.calculus.chain-rule)），$(e^{-x})'=-e^{-x}$。于是$(\sinh x)'=\frac{e^x+e^{-x}}2=\cosh x$，$(\cosh x)'=\frac{e^x-e^{-x}}2=\sinh x$；再用:term[商法则]{id="math.calculus.quotient-rule"}（quotient rule）和定理 1，$(\tanh x)'=\frac{\cosh^2x-\sinh^2x}{\cosh^2x}=\frac1{\cosh^2x}$。

::anchor{id="thm-hyperbolic-derivatives"}
**定理 2**　$(\sinh x)'=\cosh x$，$(\cosh x)'=\sinh x$，$(\tanh x)'=\frac1{\cosh^2x}=1-\tanh^2x$。

和三角函数比，$(\cos x)'=-\sin x$带负号，$(\cosh x)'=\sinh x$不带。所以$\sin x$求两次导回到$-\sin x$，$\sinh x$求两次导回到它自己。$\tanh x$的:term[导数]{id="math.calculus.derivative"}处处为正，最大值是$x=0$处的$1$，曲线在原点最陡。

### 用到双曲函数的场合

::anchor{id="def-catenary"}
两端挂起、只受重力的均匀链条，形状是$y=a\cosh\frac xa$，这条曲线叫作悬链线（catenary）；$a>0$由链条的张力和单位长度的重量决定，最低点在$(0,a)$。

为什么是它：力学上可以推出，链条的形状满足$y''=\frac1a\sqrt{1+y'^2}$（推导要用到以后的内容，这里只验证）。由:term[链式法则]{id="math.calculus.chain-rule"}，$y'=\sinh\frac xa$，$y''=\frac1a\cosh\frac xa$；由定理 1，$\cosh\frac xa=\sqrt{1+\sinh^2\frac xa}=\sqrt{1+y'^2}$，正好满足。它在最低点附近像抛物线，可离远了按指数增长，比任何抛物线都陡（第 8 题）。

::anchor{id="def-terminal-velocity"}
雨滴这类在空气里下落的物体，受的阻力大约和速度的平方成正比；从静止开始下落时，$t$秒后的速度是$v(t)=v_T\tanh\frac{gt}{v_T}$。$t\to+\infty$时$\tanh\frac{gt}{v_T}\to1$，速度趋于$v_T$，不再增大，$v_T$叫作终端速度（terminal velocity）。

为什么是它：由链式法则和定理 2，$v'(t)=v_T\cdot\frac g{v_T}\Bigl(1-\tanh^2\frac{gt}{v_T}\Bigr)=g\Bigl(1-\frac{v^2}{v_T^2}\Bigr)$。加速度一开始是重力加速度$g$，随速度增大而减小，到$v=v_T$时阻力和重力抵消，加速度为零；这个方程从受力怎样得到，见牛顿力学的[与速度有关的阻力](lesson:physics.newtonian-mechanics.drag)。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-3, 3], y: [-3.5, 5] }
functions:
  - expr: "cosh(x)"
    label: |
      $y=\cosh x$
  - expr: "sinh(x)"
    label: |
      $y=\sinh x$
  - expr: "tanh(x)"
    label: |
      $y=\tanh x$
  - expr: "exp(x)/2"
    label: |
      $y=\frac{e^x}2$
:::

蓝色的$\cosh x$像一条悬着的链子，最低点是$(0,1)$；橙色的$\sinh x$穿过原点；绿色的$\tanh x$夹在$y=-1$和$y=1$之间。$x$往右走，蓝色、橙色都贴向紫色的$\frac{e^x}2$：它们和$\frac{e^x}2$只差$\pm\frac{e^{-x}}2$，很快就看不出区别。

## 例题

### 例 1　由恒等式求其余的值

已知$x>0$、$\cosh x=\frac{13}{12}$，求$\sinh x$、$\tanh x$和$x$。

**为什么想到这么做**：和由$\cos x$求$\sin x$一样，用定理 1；$x>0$时$\sinh x>0$，开方取正号。求$x$时用$\cosh x+\sinh x=e^x$，不用解二次方程。

**推导**：$\sinh x=\sqrt{\cosh^2x-1}=\sqrt{\frac{169}{144}-1}=\frac5{12}$，$\tanh x=\frac{5/12}{13/12}=\frac5{13}$。$e^x=\cosh x+\sinh x=\frac{18}{12}=\frac32$，所以$x=\ln\frac32$。

### 例 2　悬链线的切线

悬链线$y=\cosh x$上，哪一点的:term[切线]{id="math.calculus.tangent-line"}（tangent line）和直线$y=x$平行？

**为什么想到这么做**：切线平行于$y=x$，就是切线斜率为$1$，即$(\cosh x)'=\sinh x=1$；解这个方程要把$\sinh x$写回指数函数。

**推导**：$\frac{e^x-e^{-x}}2=1$，两边乘$2e^x$得$e^{2x}-2e^x-1=0$，$e^x=1+\sqrt2$（负根舍去），$x=\ln(1+\sqrt2)$。由定理 1，这一点的纵坐标是$\cosh x=\sqrt{1+\sinh^2x}=\sqrt2$，所以切点是$\bigl(\ln(1+\sqrt2),\sqrt2\bigr)$。

## 常见误区

- 「$(\cosh x)'=-\sinh x$，和$\cos x$一样带负号。」$(\cosh x)'=\frac{e^x-e^{-x}}2=\sinh x$，不带负号。
- 「$\cosh^2x+\sinh^2x=1$。」是$\cosh^2x-\sinh^2x=1$；$\cosh^2x+\sinh^2x=\cosh2x$，在$x\ne0$时大于$1$。
- 「悬挂的链条是一条抛物线。」悬链线$y=a\cosh\frac xa$在最低点附近像抛物线，离远了比任何抛物线都陡，两者不是同一条曲线。

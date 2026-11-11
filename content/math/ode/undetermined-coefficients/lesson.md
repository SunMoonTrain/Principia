---
id: math.ode.undetermined-coefficients
title: |
  待定系数法
goal: |
  会用待定系数法求常系数非齐次线性方程的特解。
prerequisites: [math.ode.constant-coefficients]
minutes: 30
summary: |
  照右边的样子写出带未知系数的特解；撞上特征根时乘上$x$。
status: reviewed
---

## 这一节要回答的问题

弹簧振子受到周期性的外力，方程变成$my''+cy'+ky=F_0\cos\omega t$。由[非齐次方程的解的结构](lesson:math.ode.second-order-linear#thm-nonhomogeneous)，只差找出一个:term[特解]{id="math.ode.particular-solution"}（particular solution）。右边是多项式、指数函数、正弦余弦这类求导以后「样子不变」的函数时，能不能照着它的样子猜出特解？外力的频率碰巧等于振子自己的频率时，又会怎样？

## 讲解

### 照右边的样子猜

记$L[y]=y''+ay'+by$，$a$、$b$是常数。多项式求导还是多项式，$e^{kx}$求导还是它的常数倍，$\cos\beta x$、$\sin\beta x$求导互相变换。所以右边$g$是这类函数时，$L$作用在同样样子、系数待定的函数上，得到的还是这个样子，比较系数就能定出待定的系数。

::anchor{id="def-undetermined-coefficients"}
按右边$g(x)$的样子写出含未知系数的试探解（trial solution），代入$L[y]=g$，比较两边同类项的系数来定出这些系数，这种求:term[特解]{id="math.ode.particular-solution"}的方法叫作:term[待定系数法]{id="math.ode.method-of-undetermined-coefficients"}（method of undetermined coefficients）。

为什么这样定义：$L$把「多项式乘$e^{kx}$」这一类函数仍然变成这一类函数，所以试探解只需在这一类里找，求特解化成了解线性方程组。边界情况：$g=\tan x$、$\frac1x$这类函数，求导以后越变越多，找不到有限个系数的试探解，要用[常数变易法](lesson:math.ode.variation-of-parameters)（variation of parameters）。

::anchor{id="thm-trial-form"}
**试探解的样子**　设$g(x)=P_n(x)e^{kx}$，$P_n$是$n$次多项式。若$k$不是特征根（characteristic root），有形如$Q_n(x)e^{kx}$的特解；若$k$是$m$重的特征根（$m=1$或$2$），有形如$x^mQ_n(x)e^{kx}$的特解，$Q_n$是系数待定的$n$次多项式。$g(x)=e^{\alpha x}\bigl(P(x)\cos\beta x+R(x)\sin\beta x\bigr)$时，把$k$换成$\alpha+\beta i$同样判断，试探解里$\cos\beta x$、$\sin\beta x$两项都要写上，多项式的次数取$P$、$R$里较高的那个。

**证明思路**：记$p(r)=r^2+ar+b$，直接求导可得$L[u(x)e^{kx}]=\bigl(u''+p'(k)u'+p(k)u\bigr)e^{kx}$（第 5 题）。$p(k)\ne0$时，括号作用在$n$次多项式$u$上仍得$n$次多项式，比较系数可以从最高次起一项一项解出$u$；$k$是单根时$p(k)=0$、$p'(k)\ne0$，括号把次数降一，所以$u$要取$n+1$次的$xQ_n$；二重根时$p(k)=p'(k)=0$，只剩$u''$，$u$要取$x^2Q_n$。复数的$k$同理，最后取实部、虚部。

右边是几项之和时，$L$是线性的，可以对每一项分别求出特解再相加：$L[y_1]=g_1$、$L[y_2]=g_2$时，$L[y_1+y_2]=g_1+g_2$，这和:term[叠加原理]{id="math.ode.superposition-principle"}（superposition principle）是同一个道理。

### 共振

无阻尼的振子受到周期性的外力：$y''+\omega_0^2y=\cos\omega t$，$\omega_0>0$。$\omega\ne\omega_0$时，$\pm i\omega$不是特征根，试探解$A\cos\omega t$给出:term[特解]{id="math.ode.particular-solution"}$\frac{\cos\omega t}{\omega_0^2-\omega^2}$；$\omega$越接近$\omega_0$，它的振幅越大。

::anchor{id="def-resonance"}
外力的频率等于方程自己的频率时，右边$\cos\omega_0t$对应的$\pm i\omega_0$恰好是特征根，特解要乘上$t$：$y''+\omega_0^2y=\cos\omega_0t$有特解$\frac{t\sin\omega_0t}{2\omega_0}$，振幅随时间线性增长，这种现象叫作:term[共振]{id="math.ode.resonance"}（resonance）。

为什么这样定义：外力每个周期都恰好在振子往同一个方向运动时推它，能量越积越多。实际的振子有阻尼，振幅不会无限增长，但外力的频率接近$\omega_0$时，振幅会大得多（第 6 题）。边界情况：$\omega$接近但不等于$\omega_0$时，满足$y(0)=y'(0)=0$的解是$\frac{\cos\omega t-\cos\omega_0t}{\omega_0^2-\omega^2}$，振幅时大时小，形成拍（beats）。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 130], y: [-12, 12] }
functions:
  - expr: "(cos(w*x) - cos(x)) / (1 - w^2)"
    label: |
      解$y=\frac{\cos\omega x-\cos x}{1-\omega^2}$
  - expr: "2*abs(sin((w - 1)*x/2)) / abs(1 - w^2)"
    label: |
      包络
  - expr: "x*sin(x)/2"
    label: |
      $\omega=1$时的解$\frac{x\sin x}{2}$
sliders:
  - name: w
    min: 0.5
    max: 1.5
    step: 0.2
    default: 0.9
    label: |
      外力的频率$\omega$
:::

这是$y''+y=\cos\omega x$满足$y(0)=y'(0)=0$的解，横轴可以看成时间。拖动$\omega$：解的振幅在包络（envelope）里时大时小，形成拍；$\omega$越接近$1$，拍越慢，最大振幅$\frac{2}{|1-\omega^2|}$越大。$\omega=1$时没有拍，是:term[共振]{id="math.ode.resonance"}，解是振幅线性增长的$\frac{x\sin x}{2}$，很快跑出画面。

## 例题

### 例 1　多项式加指数

求$y''-y'-2y=4x+e^{3x}$的一个:term[特解]{id="math.ode.particular-solution"}。

**为什么想到这么做**：右边是两项之和，分别求特解再相加。:term[特征方程]{id="math.ode.characteristic-equation"}（characteristic equation）$r^2-r-2=(r-2)(r+1)$的根是$2$、$-1$，$0$和$3$都不是特征根，试探解不用乘$x$。

**推导**：对$4x$，试$Ax+B$：$L[Ax+B]=-A-2(Ax+B)=-2Ax-A-2B=4x$，得$A=-2$、$B=1$。对$e^{3x}$，试$Ce^{3x}$：$(9-3-2)Ce^{3x}=e^{3x}$，得$C=\frac14$。所以一个特解是$y_p=-2x+1+\frac14e^{3x}$。

### 例 2　共振时的特解

求$y''+4y=\sin2x$的一个:term[特解]{id="math.ode.particular-solution"}。

**为什么想到这么做**：特征根是$\pm2i$，右边$\sin2x$对应的$2i$恰好是单根，试探解要乘上$x$，并且$\cos2x$、$\sin2x$两项都要写。

**推导**：设$u=x(A\cos2x+B\sin2x)$，则$u''=-4A\sin2x+4B\cos2x-4x(A\cos2x+B\sin2x)$，$u''+4u=-4A\sin2x+4B\cos2x$。令它等于$\sin2x$，得$A=-\frac14$、$B=0$，特解是$y_p=-\frac x4\cos2x$：振幅随$x$线性增长，这正是:term[共振]{id="math.ode.resonance"}。

## 常见误区

- 「右边是$e^{kx}$，:term[特解]{id="math.ode.particular-solution"}就是$Ae^{kx}$。」$k$是特征根时，代进去左边是$0$，要乘上$x$或$x^2$。
- 「右边只有$\cos\beta x$，试探解只写$A\cos\beta x$。」方程里有$y'$项时会冒出$\sin\beta x$，两项都要写。
- 「:term[待定系数法]{id="math.ode.method-of-undetermined-coefficients"}什么右边都能用。」它只适用于常系数方程、右边是多项式、指数函数、正弦余弦的乘积与和；$\tan x$、$\ln x$这样的右边要用:term[常数变易法]{id="math.ode.variation-of-parameters-method"}。
- 「:term[共振]{id="math.ode.resonance"}时解一定会无限增大。」只有无阻尼时振幅才线性增长；有阻尼时振幅有上限，只是外力频率接近固有频率（natural frequency）时特别大。

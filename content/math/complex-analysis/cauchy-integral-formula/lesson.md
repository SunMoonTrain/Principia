---
id: math.complex-analysis.cauchy-integral-formula
title: |
  柯西积分公式
goal: |
  会用柯西积分公式计算积分，并知道全纯函数在圆盘内的值由圆周上的值决定。
prerequisites: [math.complex-analysis.goursat]
minutes: 23
summary: |
  $f(z)=\frac1{2\pi i}\oint\frac{f(\zeta)}{\zeta-z}\dd\zeta$：圆盘里的值由圆周上的值决定。
status: reviewed
---

## 这一节要回答的问题

[古尔萨定理](lesson:math.complex-analysis.goursat)一节说明，:term[全纯函数]{id="math.complex-analysis.holomorphic-function"}（holomorphic function）在圆盘里沿任何闭曲线的积分都是$0$。被积函数除以$\zeta-z$以后，在$\zeta=z$处分母为$0$，积分还是$0$吗？如果不是，它等于什么？知道了全纯函数在一个圆周上的值，能不能推出它在圆内的值？

## 讲解

### 圆盘上的柯西积分公式

::anchor{id="thm-cauchy-formula"}
**定理（:term[柯西积分公式]{id="math.complex-analysis.cauchy-integral-formula"}，Cauchy's integral formula）**　设$f$在以$a$为圆心、半径为$R$的:term[开圆盘]{id="math.complex-analysis.open-disc"}（open disc）$\Delta$上:term[全纯]{id="math.complex-analysis.holomorphic-function"}，$0<r<R$，$C_r$是圆周$|\zeta-a|=r$，取逆时针方向。则对满足$|z-a|<r$的每个$z$，$f(z)=\frac1{2\pi i}\oint_{C_r}\frac{f(\zeta)}{\zeta-z}\,\dd\zeta$。

**证明**：固定$z$。令$g(\zeta)=\frac{f(\zeta)-f(z)}{\zeta-z}$（$\zeta\ne z$），$g(z)=f'(z)$。由导数的定义，$\zeta\to z$时$g(\zeta)\to f'(z)$，所以$g$在$\Delta$上连续；在$\zeta\ne z$处，$g$是两个全纯函数的商，分母不为$0$，所以全纯。由[允许一个例外点](lesson:math.complex-analysis.goursat#thm-goursat-point)的定理，$g$沿$\Delta$里每个三角形的边界积分为$0$，再由[圆盘里的原函数](lesson:math.complex-analysis.goursat#thm-disc-antiderivative)，$\oint_{C_r}g\,\dd\zeta=0$，即

$$
\oint_{C_r}\frac{f(\zeta)}{\zeta-z}\,\dd\zeta=f(z)\oint_{C_r}\frac{\dd\zeta}{\zeta-z}.
$$

右边的积分里，$\frac1{\zeta-z}$在去掉$z$的平面上全纯，导数$-\frac1{(\zeta-z)^2}$连续，$z$在$C_r$里面，由[变形积分路径](lesson:math.complex-analysis.cauchy-theorem#thm-deformation)，它等于$2\pi i$。两边除以$2\pi i$即得公式。

为什么想到这么做：$\frac{f(\zeta)}{\zeta-z}$在$\zeta=z$处分母为$0$，不能直接用圆盘里的:term[原函数]{id="math.complex-analysis.antiderivative"}（antiderivative）。减去$\frac{f(z)}{\zeta-z}$，分子在$\zeta=z$处也为$0$，商变得连续，只剩一个不知道是否全纯的点，[古尔萨定理](lesson:math.complex-analysis.goursat)一节正是为这一步准备的；减掉的部分是常数$f(z)$乘$\frac1{\zeta-z}$，积分可以直接算。

为什么有用：公式右边只用到$f$在圆周$C_r$上的值，所以全纯函数在圆内的值完全由圆周上的值决定：两个在$\Delta$上全纯的函数在$C_r$上相等，在整个圆内就相等。它也是算积分的工具：被积函数能写成$\frac{f(\zeta)}{\zeta-z}$、$f$在包含圆周的开圆盘上全纯时，积分就是$2\pi if(z)$（例 1）；[高阶导数与莫雷拉定理](lesson:math.complex-analysis.higher-derivatives)、[全纯函数的幂级数展开](lesson:math.complex-analysis.power-series)两节还会从它推出全纯函数可以无穷次求导、能展开成幂级数（power series）。边界情况：$z$在圆周外面时，$\frac{f(\zeta)}{\zeta-z}$在开圆盘$|\zeta-a|<\min\{|z-a|,R\}$上全纯，这个圆盘包含$C_r$，所以积分是$0$，不是$f(z)$；$z$在圆周上时积分没有定义。

### 圆心处的值是圆周上的平均值

::anchor{id="thm-mean-on-circle"}
**定理**　在上面定理的条件下，$f(a)=\frac1{2\pi}\int_0^{2\pi}f(a+re^{it})\,\dd t$，即$f$在圆心的值等于它在圆周$C_r$上的平均值（average value）。

**证明**：在公式里取$z=a$。$C_r$的参数是$\zeta=a+re^{it}$，$0\le t\le2\pi$，$\dd\zeta=ire^{it}\,\dd t$，$\zeta-a=re^{it}$，所以

$$
f(a)=\frac1{2\pi i}\int_0^{2\pi}\frac{f(a+re^{it})}{re^{it}}\,ire^{it}\,\dd t=\frac1{2\pi}\int_0^{2\pi}f(a+re^{it})\,\dd t.
$$

为什么有用：分别取:term[实部]{id="math.complex-analysis.real-part"}（real part）和:term[虚部]{id="math.complex-analysis.imaginary-part"}（imaginary part），$f$的实部、虚部在圆心的值也都等于各自在圆周上的平均值，这能用来算一些实积分（例 2）。[平均值性质与最大模原理](lesson:math.complex-analysis.maximum-modulus)一节由它证明：不是常数的:term[全纯函数]{id="math.complex-analysis.holomorphic-function"}，$|f|$在圆盘内部取不到最大值。边界情况：只有圆心有这样简单的形式；圆内别的点$z$，公式里的权重$\frac1{\zeta-z}$随$\zeta$变化，$f(z)$一般不是圆周上的平均值，比如$f(z)=z$在单位圆周上的平均值是$0$，却不等于$f\bigl(\frac12\bigr)$。

### 换成一般的闭曲线

::anchor{id="thm-cauchy-formula-curve"}
**定理**　设$C$是分段光滑（piecewise smooth）的简单闭曲线（simple closed curve），取逆时针方向，$f$在一个包含$C$和它围成的部分的:term[开集]{id="math.complex-analysis.open-set"}（open set）$D$上:term[全纯]{id="math.complex-analysis.holomorphic-function"}、$f'$连续，$z$在$C$围成的部分里面。则$f(z)=\frac1{2\pi i}\oint_C\frac{f(\zeta)}{\zeta-z}\,\dd\zeta$。

**证明**：取$\rho_0>0$，使$0<\rho<\rho_0$时圆周$C_\rho$：$|\zeta-z|=\rho$都落在$C$围成的部分里面。$\frac{f(\zeta)}{\zeta-z}$在$D$去掉$z$以后的开集上全纯，导数$\frac{f'(\zeta)}{\zeta-z}-\frac{f(\zeta)}{(\zeta-z)^2}$连续，由[变形积分路径](lesson:math.complex-analysis.cauchy-theorem#thm-deformation)，对每个这样的$\rho$，$\oint_C\frac{f(\zeta)}{\zeta-z}\dd\zeta=\oint_{C_\rho}\frac{f(\zeta)}{\zeta-z}\dd\zeta$。左边和$\rho$无关；$f$在$z$处连续，由[复积分](lesson:math.complex-analysis.contour-integrals)第 6 题，$\rho\to0^+$时右边趋于$2\pi if(z)$。所以左边就等于$2\pi if(z)$。

为什么有用：多项式、$e^z$、$\sin z$、$\cos z$，以及它们的和、积和分母不为$0$处的商，导数都明显连续，对它们，圆周可以换成正方形、椭圆这类任何绕着$z$的简单闭曲线。条件「$f'$连续」只是为了用变形积分路径；[高阶导数与莫雷拉定理](lesson:math.complex-analysis.higher-derivatives)一节会证明全纯函数的导数自动连续，那时这个条件就去掉了。边界情况：$z$在$C$外面时，$\frac{f(\zeta)}{\zeta-z}$在$D$去掉$z$以后的开集上全纯、导数连续，这个开集包含$C$和它围成的部分，由:term[柯西积分定理]{id="math.complex-analysis.cauchy-theorem"}（Cauchy's integral theorem），积分是$0$。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 6.3], y: [-4, 6.5] }
functions:
  - expr: "exp(r*cos(x))*cos(r*sin(x))"
    label: |
      实部
  - expr: "exp(r*cos(x))*sin(r*sin(x))"
    label: |
      虚部
  - expr: "1"
    label: |
      圆心处的值$1$
sliders:
  - name: r
    min: 0.2
    max: 1.8
    step: 0.1
    default: 1
    label: |
      半径$r$
:::

横轴是圆周$|\zeta|=r$上的参数$t$（图上写作 x），$\zeta=re^{it}$。蓝线是$e^\zeta$的:term[实部]{id="math.complex-analysis.real-part"}$e^{r\cos t}\cos(r\sin t)$，橙线是:term[虚部]{id="math.complex-analysis.imaginary-part"}$e^{r\cos t}\sin(r\sin t)$，绿色横线是$1$。拖动$r$：两条曲线的起伏越来越大，可实部在$[0,2\pi]$上的平均值始终是$1$，虚部的平均值始终是$0$，合起来正是$e^\zeta$在圆心$0$处的值$1$。

## 例题

### 例 1　用公式算积分

设$C$是圆周$|z-1|=1$，取逆时针方向。求$\oint_C\frac{e^z}{z^2-1}\,\dd z$。

**为什么想到这么做**：被积函数在$\pm1$处分母为$0$；$1$在$C$里面，$-1$到$1$的距离是$2$，在$C$外面。把在$C$附近:term[全纯]{id="math.complex-analysis.holomorphic-function"}的部分并进分子，写成$\frac{f(z)}{z-1}$，就能用:term[柯西积分公式]{id="math.complex-analysis.cauchy-integral-formula"}。

**推导**：$\frac{e^z}{z^2-1}=\frac{f(z)}{z-1}$，其中$f(z)=\frac{e^z}{z+1}$在:term[开圆盘]{id="math.complex-analysis.open-disc"}$|z-1|<2$上全纯。取$a=1$、$R=2$、$r=1$，由柯西积分公式，

$$
\oint_C\frac{e^z}{z^2-1}\,\dd z=2\pi if(1)=2\pi i\cdot\frac e2=\pi ie.
$$

### 例 2　用平均值算实积分

求$\int_0^{2\pi}e^{\cos t}\cos(\sin t)\,\dd t$。

**为什么想到这么做**：$e^{\cos t}e^{i\sin t}=e^{e^{it}}$，被积函数是它的:term[实部]{id="math.complex-analysis.real-part"}，而$e^{e^{it}}$是:term[整函数]{id="math.complex-analysis.entire-function"}（entire function）$e^z$在单位圆周上的值，正好用圆心处的平均值公式。

**推导**：$e^z$在整个平面上:term[全纯]{id="math.complex-analysis.holomorphic-function"}，取$a=0$、$r=1$，

$$
\frac1{2\pi}\int_0^{2\pi}e^{e^{it}}\,\dd t=e^0=1.
$$

取实部，$\int_0^{2\pi}e^{\cos t}\cos(\sin t)\,\dd t=2\pi$；取:term[虚部]{id="math.complex-analysis.imaginary-part"}，还得到$\int_0^{2\pi}e^{\cos t}\sin(\sin t)\,\dd t=0$。

## 常见误区

- 「$\frac1{2\pi i}\oint_C\frac{f(\zeta)}{\zeta-z}\dd\zeta$总等于$f(z)$。」要$z$在$C$围成的部分里面；$z$在$C$外面时积分是$0$，比如$\oint_{|\zeta|=1}\frac{e^\zeta}{\zeta-2}\dd\zeta=0$，而$e^2\ne0$。
- 「分子$f$在圆周上:term[全纯]{id="math.complex-analysis.holomorphic-function"}，就能用公式。」$f$要在包含圆周和圆内的:term[开圆盘]{id="math.complex-analysis.open-disc"}上全纯：对$\oint_{|\zeta|=1}\frac{\dd\zeta}{\zeta(\zeta-\frac12)}$，把$\frac1\zeta$当分子、对$z=\frac12$用公式，会得到$4\pi i$，可$\frac1\zeta$在原点不全纯；拆成$2\bigl(\frac1{\zeta-\frac12}-\frac1\zeta\bigr)$算，实际积分是$0$。
- 「:term[柯西积分公式]{id="math.complex-analysis.cauchy-integral-formula"}的证明用到变形积分路径，所以也要假设$f'$连续。」对一般的$f$，圆盘上的公式只用了[古尔萨定理](lesson:math.complex-analysis.goursat)一节的两个定理；变形积分路径只用在$\frac1{\zeta-z}$上，它的导数明显连续。只有换成一般的闭曲线时，这里才暂时要$f'$连续。

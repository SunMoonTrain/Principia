---
id: math.complex-analysis.holomorphic
title: |
  柯西-黎曼方程与全纯函数
goal: |
  会用柯西-黎曼方程判断函数是否复可导（全纯）。
prerequisites: [math.complex-analysis.complex-derivative]
minutes: 26
summary: |
  复可导⇔$u$、$v$可微且$u_x=v_y$、$u_y=-v_x$；这时$f'=u_x+iv_x$。
status: reviewed
---

## 这一节要回答的问题

按定义判断:term[复可导]{id="math.complex-analysis.complex-derivative"}（complex differentiable），要算差商（difference quotient）从各个方向趋于$0$的极限，很麻烦。$f=u+iv$的$u$、$v$是两个二元实函数，能不能只看它们的偏导数（partial derivative）就判断？$e^z$、$\sin z$复可导吗，导数又是什么？

## 讲解

### 柯西-黎曼方程

::anchor{id="thm-cauchy-riemann"}
**定理（:term[柯西-黎曼方程]{id="math.complex-analysis.cauchy-riemann-equations"}，Cauchy-Riemann equations）**　设$f=u+iv$在$z_0=x_0+iy_0$附近有定义。$f$在$z_0$处:term[复可导]{id="math.complex-analysis.complex-derivative"}，当且仅当$u$、$v$在$(x_0,y_0)$处可微（differentiable），并且满足$u_x=v_y$，$u_y=-v_x$；这时$f'(z_0)=u_x+iv_x=v_y-iu_y$，偏导数都在$(x_0,y_0)$处取值。

**证明**：记$h=h_1+ih_2$。先设$f'(z_0)=p+iq$存在。由[复导数的几何意义](lesson:math.complex-analysis.complex-derivative#thm-local-linear)，$f(z_0+h)-f(z_0)=(p+iq)(h_1+ih_2)+\varepsilon(h)h$，$\varepsilon(h)\to0$。取:term[实部]{id="math.complex-analysis.real-part"}（real part）、:term[虚部]{id="math.complex-analysis.imaginary-part"}（imaginary part），

$$
\begin{aligned}
u(x_0+h_1,y_0+h_2)-u(x_0,y_0)&=ph_1-qh_2+\Re\bigl(\varepsilon(h)h\bigr),\\
v(x_0+h_1,y_0+h_2)-v(x_0,y_0)&=qh_1+ph_2+\Im\bigl(\varepsilon(h)h\bigr).
\end{aligned}
$$

两个余项（remainder）的绝对值都不超过$|\varepsilon(h)||h|$，除以$|h|$后趋于$0$，所以$u$、$v$可微，并且$u_x=p$，$u_y=-q$，$v_x=q$，$v_y=p$，这正是柯西-黎曼方程，$f'(z_0)=u_x+iv_x$。反过来，设$u$、$v$可微，记$p=u_x=v_y$，$q=v_x=-u_y$，则两式的余项$r_1$、$r_2$满足$\frac{r_1}{|h|}\to0$、$\frac{r_2}{|h|}\to0$；把第二式乘$i$加到第一式上，左边是$f(z_0+h)-f(z_0)$，右边是$(p+iq)h+r_1+ir_2$。于是差商等于$p+iq+\frac{r_1+ir_2}h$，趋于$p+iq$。

为什么有用：证明说明，柯西-黎曼方程正是要$(u,v)$的线性近似$(h_1,h_2)\mapsto(u_xh_1+u_yh_2,\ v_xh_1+v_yh_2)$恰好是乘以:term[复数]{id="math.complex-analysis.complex-number"}（complex number）$u_x+iv_x$。用起来常常更省事：由[可微的充分条件](lesson:math.vector-calculus.differentiability#thm-continuous-partials)，$u$、$v$的偏导数在$z_0$附近存在、在$z_0$处连续，又满足柯西-黎曼方程，$f$就在$z_0$处复可导。边界情况：只满足方程而不可微不行，$u=\sqrt{|xy|}$、$v=0$在原点的四个偏导数都是$0$，方程成立，可沿$h=t(1+i)$（$t>0$）的差商是$\frac{t}{t(1+i)}=\frac1{1+i}$，沿:term[实轴]{id="math.complex-analysis.real-axis"}（real axis）却是$0$，$f$在原点不复可导。

### 全纯函数

::anchor{id="def-holomorphic"}
设$D$是:term[开集]{id="math.complex-analysis.open-set"}（open set）。如果$f$在$D$的每一点都:term[复可导]{id="math.complex-analysis.complex-derivative"}，就说$f$在$D$上全纯（holomorphic），这样的$f$叫作$D$上的:term[全纯函数]{id="math.complex-analysis.holomorphic-function"}（holomorphic function）。在整个:term[复平面]{id="math.complex-analysis.complex-plane"}（complex plane）上全纯的函数叫作:term[整函数]{id="math.complex-analysis.entire-function"}（entire function）；$f$在一点$z_0$处全纯，指它在以$z_0$为圆心的某个:term[开圆盘]{id="math.complex-analysis.open-disc"}（open disc）里全纯。

为什么这样定义：要求在一整块开集上复可导，而不是只在零星的点上，就会得到一连串强得惊人的结论：以后会证明，全纯函数可以无穷次求导，沿闭曲线的积分为$0$，还能展开成幂级数（power series）。只在一点复可导没有这些后果，所以不叫全纯；很多书把全纯函数叫作:term[解析函数]{id="math.complex-analysis.analytic-function"}（analytic function），两者等价要到[全纯函数的幂级数展开](lesson:math.complex-analysis.power-series)一节才证明。边界情况：$|z|^2$只在$0$处复可导，所以在任何地方都不全纯；$\frac1z$在去掉原点的平面上全纯，但不是整函数。

### $e^z$、$\sin z$、$\cos z$的导数

::anchor{id="thm-exp-holomorphic"}
**定理**　$e^z$、$\sin z$、$\cos z$都是:term[整函数]{id="math.complex-analysis.entire-function"}，并且$(e^z)'=e^z$，$(\sin z)'=\cos z$，$(\cos z)'=-\sin z$。

**证明**：$e^z=e^x\cos y+ie^x\sin y$，$u=e^x\cos y$，$v=e^x\sin y$，四个偏导数$u_x=e^x\cos y$、$u_y=-e^x\sin y$、$v_x=e^x\sin y$、$v_y=e^x\cos y$处处连续，所以$u$、$v$处处可微，而且$u_x=v_y$、$u_y=-v_x$。由上面的定理，$e^z$处处:term[复可导]{id="math.complex-analysis.complex-derivative"}，$(e^z)'=u_x+iv_x=e^z$。由复合的[求导法则](lesson:math.complex-analysis.complex-derivative#thm-derivative-rules)，$(e^{iz})'=ie^{iz}$，$(e^{-iz})'=-ie^{-iz}$，所以$(\sin z)'=\frac{ie^{iz}+ie^{-iz}}{2i}=\cos z$；$(\cos z)'=-\sin z$同理。

为什么有用：多项式、$e^z$、$\sin z$、$\cos z$经过加减乘除和复合得到的函数，在有定义的地方都:term[全纯]{id="math.complex-analysis.holomorphic-function"}，导数照实数时的公式求。导数处处为$0$的全纯函数，在:term[区域]{id="math.complex-analysis.domain"}（domain）上一定是常数，证明见第 5 题。边界情况：实数里的公式不能随便搬，比如$|\sin z|\le1$不再成立，可求导公式都保留了下来，因为它们只用到了指数法则和求导法则。

## 几何图像

:::anim{component="linear-map-2d"}
matrix: [[p + s, -q], [q, p - s]]
range: { x: [-3, 3], y: [-3, 3] }
show: [grid, square, basis]
sliders:
  - name: p
    min: -2
    max: 2
    step: 0.25
    default: 1
    label: |
      $p$
  - name: q
    min: -2
    max: 2
    step: 0.25
    default: 0.5
    label: |
      $q$
  - name: s
    min: -1
    max: 1
    step: 0.25
    default: 0.5
    label: |
      偏离$s$
:::

这是一点附近的线性近似$(h_1,h_2)\mapsto(u_xh_1+u_yh_2,\ v_xh_1+v_yh_2)$，取$u_x=p+s$、$u_y=-q$、$v_x=q$、$v_y=p-s$。图例里「e₁ 的像」那支箭头是$(u_x,v_x)$，「e₂ 的像」那支是$(u_y,v_y)$；网格是方格的像，平行四边形是单位正方形（虚线）的像，翻了面时换一种颜色。$s\ne0$时$u_x\ne v_y$，:term[柯西-黎曼方程]{id="math.complex-analysis.cauchy-riemann-equations"}不成立，e₂ 的像不再是 e₁ 的像逆时针转$90^\circ$，正方形一般被拉成平行四边形；$p=q=0$时像虽然仍是正方形，却翻了面。把$s$拖到$0$，线性近似就是乘以:term[复数]{id="math.complex-analysis.complex-number"}$p+qi$：e₂ 的像正好是 e₁ 的像逆时针转$90^\circ$，$p+qi\ne0$时正方形变回正方形。

## 例题

### 例 1　只在一条直线上复可导

$f(z)=x^2+iy^2$在哪些点:term[复可导]{id="math.complex-analysis.complex-derivative"}？在哪里:term[全纯]{id="math.complex-analysis.holomorphic-function"}？

**为什么想到这么做**：$u=x^2$、$v=y^2$的偏导数处处连续，$u$、$v$处处可微，只要看:term[柯西-黎曼方程]{id="math.complex-analysis.cauchy-riemann-equations"}在哪里成立。

**推导**：$u_x=2x$，$u_y=0$，$v_x=0$，$v_y=2y$。$u_y=-v_x$处处成立，$u_x=v_y$当且仅当$x=y$。所以$f$恰在直线$y=x$上复可导，$f'(z)=u_x+iv_x=2x$。直线上的点周围的:term[开圆盘]{id="math.complex-analysis.open-disc"}里总有不在直线上的点，所以$f$在任何地方都不全纯。

### 例 2　由实部求全纯函数

求$v$，使$f=u+iv$是:term[整函数]{id="math.complex-analysis.entire-function"}，其中$u=x^3-3xy^2$，并把$f$写成$z$的式子。

**为什么想到这么做**：由$v_y=u_x$先把$v$对$y$积出来，留一个只依赖$x$的待定函数，再用$v_x=-u_y$把它定下来。

**推导**：$v_y=u_x=3x^2-3y^2$，所以$v=3x^2y-y^3+\varphi(x)$。再由$v_x=-u_y$：$6xy+\varphi'(x)=6xy$，$\varphi'(x)=0$，$\varphi$是常数$C$。于是$v=3x^2y-y^3+C$，四个偏导数连续、满足方程，$f$是整函数；对照$z^3=(x^3-3xy^2)+i(3x^2y-y^3)$，得$f(z)=z^3+iC$。

## 常见误区

- 「在一点满足:term[柯西-黎曼方程]{id="math.complex-analysis.cauchy-riemann-equations"}，就在这一点:term[复可导]{id="math.complex-analysis.complex-derivative"}。」还要$u$、$v$在这点可微，例如$u=\sqrt{|xy|}$、$v=0$在原点满足方程，却不复可导。
- 「$|z|^2$在$0$处复可导，所以在$0$处:term[全纯]{id="math.complex-analysis.holomorphic-function"}。」全纯要在一个:term[开圆盘]{id="math.complex-analysis.open-disc"}里处处复可导，$|z|^2$只在$0$这一点复可导。
- 「$f'=u_x+iu_y$。」应当是$f'=u_x+iv_x$，也等于$v_y-iu_y$；对$e^z$，$u_x+iu_y=e^x(\cos y-i\sin y)$，这是$e^{\bar z}$，不是导数。

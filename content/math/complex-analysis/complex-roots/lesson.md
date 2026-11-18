---
id: math.complex-analysis.complex-roots
title: |
  复数的$n$次方根
goal: |
  会用指数形式求复数的$n$次方根，并知道$n$次单位根在单位圆上均匀分布。
prerequisites: [math.complex-analysis.complex-exponential]
minutes: 23
summary: |
  $w=\rho e^{i\varphi}\ne0$恰有$n$个$n$次方根$\sqrt[n]\rho\,e^{i(\varphi+2k\pi)/n}$。
status: reviewed
---

## 这一节要回答的问题

$z^2=-1$在:term[复数]{id="math.complex-analysis.complex-number"}（complex number）里有两个解$\pm i$。$z^3=1$在实数里只有一个解$1$，在复数里还有别的解吗？一般的$z^n=w$有几个解，它们在:term[复平面]{id="math.complex-analysis.complex-plane"}（complex plane）上怎样排列？

## 讲解

### 棣莫弗公式

::anchor{id="thm-de-moivre"}
**定理（:term[棣莫弗公式]{id="math.complex-analysis.de-moivre-formula"}，de Moivre's formula）**　对每个整数$n$和实数$\theta$，$(\cos\theta+i\sin\theta)^n=\cos n\theta+i\sin n\theta$，即$(e^{i\theta})^n=e^{in\theta}$。

**证明**：由[指数法则](lesson:math.complex-analysis.complex-exponential#thm-exp-addition)，$e^{i\theta}$自乘$n$次是$e^{in\theta}$；$n<0$时再用$e^{-i\theta}=\frac1{e^{i\theta}}$。把两边按:term[指数形式]{id="math.complex-analysis.exponential-form"}（exponential form）的定义写开，就是要证的等式。

为什么有用：非零:term[复数]{id="math.complex-analysis.complex-number"}$z=re^{i\theta}$的$n$次方是$z^n=r^ne^{in\theta}$，:term[模]{id="math.complex-analysis.modulus"}（modulus）变成$r^n$，:term[辐角]{id="math.complex-analysis.argument"}（argument）变成$n\theta$，不必把$n$个因子乘开。例如$1+i=\sqrt2e^{i\pi/4}$，$(1+i)^8=16e^{2\pi i}=16$。边界情况：$n$不是整数时公式不能照搬，$\bigl(e^{i\theta}\bigr)^{1/2}$连意思都还没有，平方等于$e^{i\theta}$的数有两个：$e^{i\theta/2}$和$-e^{i\theta/2}$。

### $n$次方根

::anchor{id="def-nth-root"}
设$n$是正整数，$w$是:term[复数]{id="math.complex-analysis.complex-number"}。满足$z^n=w$的复数$z$叫作$w$的:term[$n$次方根]{id="math.complex-analysis.nth-root"}（nth root）。

为什么这样定义：实数里，正数的平方根有两个，负数没有平方根，奇数次方根只有一个，规则各不相同；复数里规则统一，非零复数恰有$n$个$n$次方根，见下面的定理。所以对复数一般不用根号表示「那个」方根，$\sqrt[n]{\rho}$只留给正实数$\rho$，表示它的正的实根。边界情况：$0$的$n$次方根只有$0$，因为$|z|^n=0$迫使$z=0$。

::anchor{id="thm-nth-roots"}
**定理**　设$w=\rho e^{i\varphi}\ne0$，$\rho>0$。则$w$恰有$n$个$n$次方根$z_k=\sqrt[n]\rho\,e^{i(\varphi+2k\pi)/n}$，$k=0,1,\dots,n-1$；它们是以原点为圆心、$\sqrt[n]\rho$为半径的圆的内接正$n$边形的顶点。

**证明**：设$z=re^{i\theta}$（$r>0$），由:term[棣莫弗公式]{id="math.complex-analysis.de-moivre-formula"}，$z^n=w$就是$r^ne^{in\theta}=\rho e^{i\varphi}$。两个非零复数相等，当且仅当:term[模]{id="math.complex-analysis.modulus"}相等、:term[辐角]{id="math.complex-analysis.argument"}相差$2\pi$的整数倍，所以$r^n=\rho$，$n\theta=\varphi+2k\pi$（$k$是整数），即$r=\sqrt[n]\rho$，$\theta=\frac{\varphi+2k\pi}n$。$k$换成$k+n$时$\theta$增加$2\pi$，是同一个点；$k=0,1,\dots,n-1$时这些$\theta$两两之差不为$0$、绝对值小于$2\pi$，给出$n$个不同的点。它们的模都是$\sqrt[n]\rho$，相邻两个的辐角差$\frac{2\pi}n$，所以组成正$n$边形。

### 单位根

::anchor{id="def-root-of-unity"}
$1$的$n$个:term[$n$次方根]{id="math.complex-analysis.nth-root"}$e^{2k\pi i/n}$（$k=0,1,\dots,n-1$）叫作$n$次:term[单位根]{id="math.complex-analysis.root-of-unity"}（root of unity）。记$\omega=e^{2\pi i/n}$，它们就是$1,\omega,\omega^2,\dots,\omega^{n-1}$。

为什么这样定义：单位根是以$1$为一个顶点的单位圆内接正$n$边形的顶点；任意$w\ne0$的$n$个$n$次方根，就是其中一个根$z_0$乘以全体$n$次单位根，即$z_0,z_0\omega,\dots,z_0\omega^{n-1}$，在图上就是把这个正$n$边形转一转、伸缩一下。$n\ge2$时单位根之和为$0$：$1+\omega+\dots+\omega^{n-1}=\frac{1-\omega^n}{1-\omega}=0$，因为$\omega\ne1$，而$\omega^n=1$。边界情况：$n=2$时单位根是$\pm1$，$n=4$时是$\pm1$、$\pm i$。

### 复系数的二次方程

::anchor{id="thm-quadratic"}
**定理**　设$a$、$b$、$c$是:term[复数]{id="math.complex-analysis.complex-number"}，$a\ne0$，$s$是$b^2-4ac$的一个平方根。则$az^2+bz+c=0$的根恰是$\frac{-b+s}{2a}$和$\frac{-b-s}{2a}$。

**证明**：配方，$4a(az^2+bz+c)=(2az+b)^2-(b^2-4ac)$，所以方程等价于$(2az+b)^2=s^2$，即$(2az+b-s)(2az+b+s)=0$。由$|z_1z_2|=|z_1||z_2|$，两个复数的积为$0$当且仅当其中一个为$0$，所以$z=\frac{-b+s}{2a}$或$z=\frac{-b-s}{2a}$。

为什么有用：判别式不必是正实数，取它的哪一个平方根都行，另一个平方根是$-s$，只是把两个根的名字对调。实系数的方程判别式为负时，就得到一对:term[共轭]{id="math.complex-analysis.conjugate"}（complex conjugate）的根。边界情况：$s=0$时两个根重合，是一个二重根。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-1.8, 1.8], y: [-1.08, 1.08] }
functions:
  - expr: "sqrt(max(0, 1 - x^2)) + 0*sqrt(1.01 - abs(x))"
    label: |
      单位圆的上半
  - expr: "-sqrt(max(0, 1 - x^2)) + 0*sqrt(1.01 - abs(x))"
    label: |
      单位圆的下半
points:
  - { x: "cos((a*pi/180 + 2*pi*0)/N)", y: "sin((a*pi/180 + 2*pi*0)/N)" }
  - { x: "cos((a*pi/180 + 2*pi*1)/N)", y: "sin((a*pi/180 + 2*pi*1)/N)" }
  - { x: "cos((a*pi/180 + 2*pi*2)/N)", y: "sin((a*pi/180 + 2*pi*2)/N)" }
  - { x: "cos((a*pi/180 + 2*pi*3)/N)", y: "sin((a*pi/180 + 2*pi*3)/N)" }
  - { x: "cos((a*pi/180 + 2*pi*4)/N)", y: "sin((a*pi/180 + 2*pi*4)/N)" }
  - { x: "cos((a*pi/180 + 2*pi*5)/N)", y: "sin((a*pi/180 + 2*pi*5)/N)" }
  - { x: "cos((a*pi/180 + 2*pi*6)/N)", y: "sin((a*pi/180 + 2*pi*6)/N)" }
  - { x: "cos((a*pi/180 + 2*pi*7)/N)", y: "sin((a*pi/180 + 2*pi*7)/N)" }
sliders:
  - name: N
    min: 1
    max: 8
    step: 1
    default: 5
    label: |
      次数$n$
  - name: a
    min: -180
    max: 180
    step: 15
    default: 60
    label: |
      $w$的辐角$\alpha$（度）
:::

蓝线和橙线合起来是单位圆。圆点是$w=e^{i\alpha}$的$n$个:term[$n$次方根]{id="math.complex-analysis.nth-root"}$e^{i(\alpha+2k\pi)/n}$，图里的$\alpha$按度数调。拖动$n$：圆点总是排成单位圆的内接正$n$边形，相邻两个的:term[辐角]{id="math.complex-analysis.argument"}差$\frac{2\pi}n$；$\alpha=0$时就是$n$次:term[单位根]{id="math.complex-analysis.root-of-unity"}。拖动$\alpha$从$-180^\circ$到$180^\circ$：$w$绕原点转了一圈，正多边形却只转了$\frac{360^\circ}n$，每个根都挪到了相邻的根原来的位置上，$w$回到原处，方根互相换了位置。

## 例题

### 例 1　$-8$的立方根

求$-8$的三个立方根。

**为什么想到这么做**：把$-8$写成:term[指数形式]{id="math.complex-analysis.exponential-form"}，用上面的定理。

**推导**：$-8=8e^{i\pi}$，立方根是$2e^{i(\pi+2k\pi)/3}$，$k=0,1,2$：

$$
2e^{i\pi/3}=1+\sqrt3i,\qquad 2e^{i\pi}=-2,\qquad 2e^{5\pi i/3}=1-\sqrt3i.
$$

实数立方根$-2$只是其中之一；三个根是半径为$2$的圆的内接正三角形的顶点。验算：$(1+\sqrt3i)^2=-2+2\sqrt3i$，再乘$1+\sqrt3i$得$-2-2\sqrt3i+2\sqrt3i+6i^2$，正是$-8$。

### 例 2　复系数的二次方程

解$z^2+(1-i)z-i=0$。

**为什么想到这么做**：用求根公式，关键是求判别式的一个平方根。判别式不是常见:term[辐角]{id="math.complex-analysis.argument"}的:term[复数]{id="math.complex-analysis.complex-number"}时，设平方根为$p+qi$，比较:term[实部]{id="math.complex-analysis.real-part"}（real part）和:term[虚部]{id="math.complex-analysis.imaginary-part"}（imaginary part）解出$p$、$q$。

**推导**：判别式是$(1-i)^2+4i=2i$。设$(p+qi)^2=2i$，即$p^2-q^2=0$、$2pq=2$，得$p=q=\pm1$，取$s=1+i$。于是

$$
z=\frac{-(1-i)\pm(1+i)}2,
$$

两个根是$i$和$-1$。验算：$(z-i)(z+1)=z^2+(1-i)z-i$。

## 常见误区

- 「$-8$的立方根是$-2$。」实数里只有这一个；在:term[复数]{id="math.complex-analysis.complex-number"}里$-8$有三个立方根，$-2$只是其中之一（例 1）。
- 「$(e^{2\pi i})^{1/2}=e^{\pi i}=-1$，而$e^{2\pi i}=1$，所以$1$开平方得$-1$。」$(e^{i\theta})^n=e^{in\theta}$只对整数$n$证过，$n$不是整数时不能照搬：$1$的平方根有两个，$\pm1$，复数的「开平方」不是一个确定的运算。
- 「复系数的二次方程要看判别式的正负。」复数不比大小；不管判别式是哪个复数，取它的任一个平方根代进求根公式，都得到全部的根。

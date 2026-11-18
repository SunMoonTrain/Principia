---
id: math.complex-analysis.complex-numbers
title: |
  复数与复平面
goal: |
  会做复数的四则运算，并用模和辐角把复数的乘法看成旋转加伸缩。
prerequisites: []
minutes: 28
summary: |
  复数是平面上的点；乘以$re^{i\theta}$就是转$\theta$角、伸缩$r$倍。
status: reviewed
---

## 这一节要回答的问题

方程$x^2+1=0$没有实数解。要是添上一个平方等于$-1$的新数$i$，还能照常做加减乘除吗？这些新数能不能画在平面上？乘以这样一个数，在图上又是什么样子？

## 讲解

### 复数

::anchor{id="def-complex-number"}
设$a$、$b$是实数，形如$z=a+bi$的数叫作:term[复数]{id="math.complex-analysis.complex-number"}（complex number），其中$i$满足$i^2=-1$，叫作虚数单位（imaginary unit）。$a$叫作$z$的:term[实部]{id="math.complex-analysis.real-part"}（real part），记作$\Re z$；$b$叫作$z$的:term[虚部]{id="math.complex-analysis.imaginary-part"}（imaginary part），记作$\Im z$。实部、虚部分别相等的两个复数相等；虚部为$0$的复数就是实数，实部为$0$、虚部不为$0$的叫作:term[纯虚数]{id="math.complex-analysis.purely-imaginary"}（purely imaginary number）。全体复数记作$\C$。

为什么这样定义：照多项式的规矩算，遇到$i^2$就换成$-1$，于是$(a+bi)+(c+di)=(a+c)+(b+d)i$，$(a+bi)(c+di)=(ac-bd)+(ad+bc)i$。实数的交换律、结合律、分配律照样成立，逐条展开验证即可。边界情况：复数不比大小，要是规定$i>0$，两边乘$i$得$-1>0$；规定$i<0$时，两边乘$i$要变号，同样得$-1>0$。

### 共轭复数与除法

::anchor{id="def-conjugate"}
:term[复数]{id="math.complex-analysis.complex-number"}$z=a+bi$的:term[共轭复数]{id="math.complex-analysis.conjugate"}（complex conjugate）是$\bar z=a-bi$。

为什么这样定义：$z\bar z=a^2+b^2$是非负实数，借它可以把除法变成乘法：$z\ne0$时$\frac wz=\frac{w\bar z}{z\bar z}$，分母是实数。按定义展开可以验证$\overline{z+w}=\bar z+\bar w$、$\overline{zw}=\bar z\,\bar w$，以及$\Re z=\frac{z+\bar z}2$、$\Im z=\frac{z-\bar z}{2i}$。边界情况：$\bar z=z$当且仅当$z$是实数，$\bar z=-z$当且仅当$z$是:term[纯虚数]{id="math.complex-analysis.purely-imaginary"}或$0$。

### 复平面与模

::anchor{id="def-complex-plane"}
把:term[复数]{id="math.complex-analysis.complex-number"}$a+bi$画成平面上的点$(a,b)$，这样表示复数的平面叫作:term[复平面]{id="math.complex-analysis.complex-plane"}（complex plane），横轴叫作:term[实轴]{id="math.complex-analysis.real-axis"}（real axis），纵轴叫作:term[虚轴]{id="math.complex-analysis.imaginary-axis"}（imaginary axis）。$z$到原点的距离$|z|=\sqrt{a^2+b^2}$叫作$z$的:term[模]{id="math.complex-analysis.modulus"}（modulus）。

为什么这样定义：复数由两个实数决定，正好对应一个点，也对应从原点指向这个点的向量；复数相加就是向量按平行四边形法则相加，$|z-w|$就是两点间的距离。:term[共轭]{id="math.complex-analysis.conjugate"}是关于实轴的反射。由$|z|^2=z\bar z$得$|zw|^2=zw\,\overline{zw}=z\bar z\cdot w\bar w$，所以$|zw|=|z||w|$。边界情况：$|z|=0$只在$z=0$时成立；模为$1$的复数组成以原点为圆心的单位圆。

::anchor{id="thm-triangle-inequality"}
**定理（:term[三角不等式]{id="math.complex-analysis.triangle-inequality"}，triangle inequality）**　对任意复数$z$、$w$，$|z+w|\le|z|+|w|$；$w\ne0$时，等号成立当且仅当$z=tw$，其中$t\ge0$是实数。

**证明**：由$|z|^2=z\bar z$，

$$
|z+w|^2=(z+w)(\bar z+\bar w)=|z|^2+|w|^2+2\Re(z\bar w).
$$

又$|z\bar w|^2=(\Re z\bar w)^2+(\Im z\bar w)^2$，所以$\Re(z\bar w)\le|z\bar w|=|z||w|$，于是$|z+w|^2\le(|z|+|w|)^2$，开方即得。等号成立当且仅当$\Re(z\bar w)=|z\bar w|$，即$z\bar w$是一个非负实数$s$；这时$z=\frac{s}{\bar w}=\frac{s}{|w|^2}w$，取$t=\frac s{|w|^2}$即可。反过来，$z=tw$（$t\ge0$）时两边都是$(t+1)|w|$。

为什么叫三角不等式：$z$、$w$、$z+w$对应的向量组成一个三角形，它说一边不超过另两边之和。把$z$换成$z-w$，得$|z|-|w|\le|z-w|$。以后估计积分时，常把一串复数之和的模放大成模之和。

### 辐角与三角形式

::anchor{id="def-argument"}
设$z\ne0$。从:term[正实轴]{id="math.complex-analysis.real-axis"}转到$z$所在的射线，转过的角$\theta$（逆时针为正）叫作$z$的:term[辐角]{id="math.complex-analysis.argument"}（argument），记作$\arg z$；它可以差$2\pi$的整数倍，其中落在$(-\pi,\pi]$里的那一个叫作$z$的:term[辐角主值]{id="math.complex-analysis.principal-argument"}（principal argument），记作$\Arg z$。记$r=|z|$，则$z=r(\cos\theta+i\sin\theta)$，这叫作$z$的:term[三角形式]{id="math.complex-analysis.trigonometric-form"}（trigonometric form）。

为什么这样定义：点的位置也可以由到原点的距离和方向决定，$a=r\cos\theta$、$b=r\sin\theta$，这和:term[极坐标]{id="math.calculus.polar-coordinates"}（polar coordinates）是一回事。转一整圈回到原处，所以辐角只能确定到$2\pi$的整数倍，要选一个代表时取主值；高中课本取$[0,2\pi)$里的那个作主值，这里照复分析的习惯取$(-\pi,\pi]$，以后[复对数](lesson:math.complex-analysis.complex-logarithm)（complex logarithm）的主值和它配套。边界情况：$0$没有辐角，它的方向无从说起；$\Arg(-1)=\pi$，$\Arg(-i)=-\frac\pi2$。

### 乘法是旋转加伸缩

::anchor{id="thm-multiplication"}
**定理**　设$z_1=r_1(\cos\theta_1+i\sin\theta_1)$，$z_2=r_2(\cos\theta_2+i\sin\theta_2)$，则$z_1z_2=r_1r_2\bigl(\cos(\theta_1+\theta_2)+i\sin(\theta_1+\theta_2)\bigr)$：:term[模]{id="math.complex-analysis.modulus"}相乘，:term[辐角]{id="math.complex-analysis.argument"}相加。

**证明**：展开乘积，再用两角和的余弦、正弦公式，

$$
\begin{aligned}
z_1z_2&=r_1r_2\bigl[(\cos\theta_1\cos\theta_2-\sin\theta_1\sin\theta_2)+i(\sin\theta_1\cos\theta_2+\cos\theta_1\sin\theta_2)\bigr]\\
&=r_1r_2\bigl(\cos(\theta_1+\theta_2)+i\sin(\theta_1+\theta_2)\bigr).
\end{aligned}
$$

为什么有用：固定$w=r(\cos\theta+i\sin\theta)$，映射$z\mapsto wz$把每个点到原点的距离乘以$r$，把辐角加上$\theta$：乘以一个:term[复数]{id="math.complex-analysis.complex-number"}，就是绕原点转$\theta$角、再伸缩为$r$倍。乘$i$是转$90^\circ$，乘$-1$是转$180^\circ$，$i^2=-1$说的就是「转两次直角等于掉头」。除法反过来，$z_2\ne0$时$\frac{z_1}{z_2}$的模是$\frac{r_1}{r_2}$，辐角是$\theta_1-\theta_2$。边界情况：辐角相加只在差$2\pi$的整数倍的意义下成立，:term[主值]{id="math.complex-analysis.principal-argument"}相加可能跑出$(-\pi,\pi]$，例如$\Arg(-1)+\Arg(-1)=2\pi$，而$\Arg\bigl((-1)(-1)\bigr)=0$。

### 记号$e^{i\theta}$

::anchor{id="def-exponential-form"}
对实数$\theta$，记$e^{i\theta}=\cos\theta+i\sin\theta$；于是非零:term[复数]{id="math.complex-analysis.complex-number"}可以写成$z=re^{i\theta}$，其中$r=|z|$，$\theta$是$z$的一个:term[辐角]{id="math.complex-analysis.argument"}，这叫作$z$的:term[指数形式]{id="math.complex-analysis.exponential-form"}（exponential form）。

为什么这样定义：上面的定理用这个记号写出来，就是$e^{i\alpha}e^{i\beta}=e^{i(\alpha+\beta)}$，和实数的指数法则$e^ae^b=e^{a+b}$一模一样；还有$|e^{i\theta}|=1$，$\overline{e^{i\theta}}=e^{-i\theta}=\frac1{e^{i\theta}}$，乘以$e^{i\theta}$就是绕原点转$\theta$角。它确实就是$e^x$在$x=i\theta$处的值，要用:term[泰勒级数]{id="math.calculus.taylor-series"}（Taylor series）说明，见[欧拉公式与复指数](lesson:math.complex-analysis.complex-exponential)。边界情况：$e^{i\theta}$总在单位圆上，$\theta$差$2\pi$的整数倍时是同一个点，$e^{2\pi i}=1$，$e^{i\pi}=-1$。

## 几何图像

:::anim{component="linear-map-2d"}
matrix: [[r*cos(th*pi/180), -r*sin(th*pi/180)], [r*sin(th*pi/180), r*cos(th*pi/180)]]
range: { x: [-3, 3], y: [-3, 3] }
show: [grid, circle, basis]
sliders:
  - name: r
    min: 0.25
    max: 2
    step: 0.25
    default: 1.5
    label: |
      模$r$
  - name: th
    min: -180
    max: 180
    step: 15
    default: 30
    label: |
      辐角$\theta$（度）
:::

这是:term[复平面]{id="math.complex-analysis.complex-plane"}上的方格乘以$w=re^{i\theta}$以后的样子，进度条从$0$拖到底，看平面从原样一点点变过去：网格是方格的像；图例里「e₁ 的像」那支箭头是$1$的像，也就是$w$本身，「e₂ 的像」那支是$i$的像$iw$；「单位圆的像」是虚线画的单位圆乘以$w$以后的样子。拖动$r$、$\theta$：整个平面绕原点转$\theta$角、伸缩为$r$倍，方格仍是方格，e₂ 的像始终和 e₁ 的像垂直、一样长。$\theta=90^\circ$、$r=1$时就是乘$i$；$\theta=180^\circ$时 e₁ 的像指向:term[负实轴]{id="math.complex-analysis.real-axis"}。

## 例题

### 例 1　除法、模与辐角

求$\frac{1+3i}{1-2i}$，以及它的:term[模]{id="math.complex-analysis.modulus"}和:term[辐角主值]{id="math.complex-analysis.principal-argument"}。

**为什么想到这么做**：分子、分母同乘分母的:term[共轭复数]{id="math.complex-analysis.conjugate"}，分母就变成实数。模和:term[辐角]{id="math.complex-analysis.argument"}也可以由乘除的法则先算出来，用来验算。

**推导**：

$$
\frac{1+3i}{1-2i}=\frac{(1+3i)(1+2i)}{(1-2i)(1+2i)}=\frac{-5+5i}5=-1+i.
$$

$-1+i$的模是$\sqrt2$；它在第二象限，和:term[负实轴]{id="math.complex-analysis.real-axis"}成$45^\circ$，辐角主值是$\frac{3\pi}4$。按模的乘除，$\frac{|1+3i|}{|1-2i|}=\frac{\sqrt{10}}{\sqrt5}=\sqrt2$，对得上。

### 例 2　正三角形的第三个顶点

正三角形的两个顶点是$0$和$2+2i$，求第三个顶点。

**为什么想到这么做**：从$0$出发的两条边一样长、夹角是$60^\circ$，所以第三个顶点是$2+2i$绕原点转$60^\circ$或$-60^\circ$，也就是乘以$e^{i\pi/3}$或$e^{-i\pi/3}$。

**推导**：$e^{i\pi/3}=\frac12+\frac{\sqrt3}2i$，

$$
(2+2i)\Bigl(\frac12+\frac{\sqrt3}2i\Bigr)=(1-\sqrt3)+(1+\sqrt3)i;
$$

转$-60^\circ$得$(2+2i)\bigl(\frac12-\frac{\sqrt3}2i\bigr)=(1+\sqrt3)+(1-\sqrt3)i$。两个答案分别在两已知顶点连线的两侧，各对应一个正三角形。验算：第一个点到$0$和到$2+2i$的距离的平方都是$(1-\sqrt3)^2+(1+\sqrt3)^2=8$，和$|2+2i|^2$相等。

## 常见误区

- 「$\sqrt{-1}\cdot\sqrt{-1}=\sqrt{(-1)(-1)}=1$。」$\sqrt a\sqrt b=\sqrt{ab}$在$a$、$b$都是负数时不成立；按定义，$i\cdot i=-1$。
- 「$z^2=|z|^2$。」这只对实数成立：$z^2=z\bar z$等价于$z=0$或$z=\bar z$。对一般的:term[复数]{id="math.complex-analysis.complex-number"}不对，比如$i^2=-1$，而$|i|^2=1$。
- 「$\Arg(z_1z_2)=\Arg z_1+\Arg z_2$。」:term[辐角]{id="math.complex-analysis.argument"}相加只在差$2\pi$的整数倍的意义下成立：$\Arg(-i)+\Arg(-i)=-\pi$，可$(-i)^2=-1$，$\Arg(-1)=\pi$。

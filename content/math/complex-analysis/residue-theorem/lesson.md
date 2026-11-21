---
id: math.complex-analysis.residue-theorem
title: |
  留数定理
goal: |
  会计算极点处的留数，并用留数定理计算闭曲线上的积分。
prerequisites: [math.complex-analysis.singularities]
minutes: 29
summary: |
  $f$在$C$上全纯、$C$里面只有有限个奇点时，$\oint_Cf\,\dd z$是$2\pi i$乘各点留数之和。
status: reviewed
---

## 这一节要回答的问题

[柯西积分公式](lesson:math.complex-analysis.cauchy-integral-formula)一节第 3 题要算$\frac1{2\pi i}\oint_{|z|=2}\frac{e^z}{z(z-1)}\,\dd z$，先把$\frac1{z(z-1)}$拆成两项，再对每一项用公式；[高阶导数与莫雷拉定理](lesson:math.complex-analysis.higher-derivatives)一节第 3 题把分母里的$z$换成$z^2$，就要拆成三项。闭曲线里面的:term[孤立奇点]{id="math.complex-analysis.isolated-singularity"}（isolated singularity）一多、:term[极点]{id="math.complex-analysis.pole"}（pole）的阶一高，这样拆就越来越麻烦。能不能每个孤立奇点各算出一个数，加起来就得到积分？

## 讲解

### 留数

$e^{1/z}=1+z^{-1}+\frac{z^{-2}}{2!}+\cdots$在去掉原点的平面上处处成立，它就是$e^{1/z}$在$0$处的:term[洛朗级数]{id="math.complex-analysis.laurent-series"}（Laurent series）。沿逆时针的单位圆周逐项积分（[收敛的定理](lesson:math.complex-analysis.laurent-series#thm-laurent-convergence)保证可以），由[一个最重要的例子](lesson:math.complex-analysis.contour-integrals#thm-power-integral)，除$z^{-1}$以外每一项的积分都是$0$，所以$\oint_{|z|=1}e^{1/z}\,\dd z=2\pi i$。整个积分只由$z^{-1}$的系数决定，$0$是:term[本性奇点]{id="math.complex-analysis.essential-singularity"}（essential singularity）也不碍事。

::anchor{id="def-residue"}
设$f$在:term[去心圆盘]{id="math.complex-analysis.punctured-disc"}（punctured disc）$0<|z-a|<R$上:term[全纯]{id="math.complex-analysis.holomorphic-function"}（holomorphic），它在这个去心圆盘里的洛朗级数是$\sum_{n=-\infty}^{\infty}a_n(z-a)^n$。系数$a_{-1}$叫作$f$在$a$处的:term[留数]{id="math.complex-analysis.residue"}（residue），记作$\Res_{z=a}f(z)$。由[洛朗展开](lesson:math.complex-analysis.laurent-series#thm-laurent)的系数公式，$\Res_{z=a}f(z)=\frac1{2\pi i}\oint_{C_r}f(z)\,\dd z$，这里$C_r$是逆时针的圆周$|z-a|=r$，$0<r<R$。

为什么这样定义：沿绕着$a$的小圆周逐项积分，只有$(z-a)^{-1}$这一项「留」下了值，「留数」的名字由此而来。系数公式里的$r$可以任意小，所以留数只由$a$附近的$f$决定。边界情况：$a$是:term[可去奇点]{id="math.complex-analysis.removable-singularity"}（removable singularity）时，:term[主部]{id="math.complex-analysis.principal-part"}（principal part）是$0$，留数也是$0$；反过来不成立，$\frac1{z^2}$在$0$处是:term[二阶极点]{id="math.complex-analysis.pole"}，没有$z^{-1}$项，留数却是$0$（[柯西积分定理](lesson:math.complex-analysis.cauchy-theorem)一节第 5 题（3））。

### 留数定理

::anchor{id="thm-residue"}
**定理（:term[留数定理]{id="math.complex-analysis.residue-theorem"}，residue theorem）**　设$C$是分段光滑（piecewise smooth）的简单闭曲线（simple closed curve），取逆时针方向，$z_1,\dots,z_n$是$C$围成的部分里面互不相同的点，$f$在一个包含$C$和它围成的部分的:term[开集]{id="math.complex-analysis.open-set"}（open set）上除$z_1,\dots,z_n$外处处:term[全纯]{id="math.complex-analysis.holomorphic-function"}。则$\oint_Cf(z)\,\dd z=2\pi i\sum_{k=1}^n\Res_{z=z_k}f(z)$。

**证明**：$f$在每个$z_k$的某个:term[去心圆盘]{id="math.complex-analysis.punctured-disc"}上全纯，记$h_k$是$f$在$z_k$处的:term[主部]{id="math.complex-analysis.principal-part"}。由[主部](lesson:math.complex-analysis.laurent-series#def-principal-part)那里的说明，$h_k$在去掉$z_k$的整个平面上全纯，$f-h_k$在$z_k$处补上值以后在$z_k$附近全纯。令$g=f-h_1-\dots-h_n$：在$z_k$附近，$g$是$f-h_k$减去另外几个在$z_k$附近全纯的$h_j$，所以每个$z_k$都是$g$的:term[可去奇点]{id="math.complex-analysis.removable-singularity"}，补上值以后$g$在整个开集上全纯。由:term[柯西积分定理]{id="math.complex-analysis.cauchy-theorem"}（Cauchy's integral theorem），$\oint_Cg\,\dd z=0$（$g'$连续由[导数自动连续](lesson:math.complex-analysis.higher-derivatives#thm-derivative-continuous)保证），所以$\oint_Cf\,\dd z=\sum_{k=1}^n\oint_Ch_k\,\dd z$。

剩下要算每个$\oint_Ch_k\,\dd z$。$C$不经过$z_k$，$|z(t)-z_k|$在参数区间上连续、处处为正，由最值定理（extreme value theorem）有正的最小值$\delta$，所以$C$落在$\delta\le|z-z_k|\le\rho$里（$\rho$足够大）。$h_k$是只有负次幂的:term[洛朗级数]{id="math.complex-analysis.laurent-series"}，在$0<|z-z_k|<+\infty$里处处收敛，由[收敛的定理](lesson:math.complex-analysis.laurent-series#thm-laurent-convergence)，可以沿$C$逐项积分。$\oint_C\frac{\dd z}{z-z_k}=2\pi i$（见[变形积分路径](lesson:math.complex-analysis.cauchy-theorem#thm-deformation)后面的说明）；$j\ge2$时$(z-z_k)^{-j}$在去掉$z_k$的平面上有:term[原函数]{id="math.complex-analysis.antiderivative"}（antiderivative）$\frac{(z-z_k)^{1-j}}{1-j}$，[沿闭曲线的积分是$0$](lesson:math.complex-analysis.cauchy-theorem#thm-antiderivative-integral)。

所以$\oint_Ch_k\,\dd z$是$2\pi i$乘$h_k$里$(z-z_k)^{-1}$的系数，也就是$2\pi i$乘$f$在$z_k$处的:term[留数]{id="math.complex-analysis.residue"}，相加即得。

为什么有用：每个:term[孤立奇点]{id="math.complex-analysis.isolated-singularity"}各算一个数，加起来乘以$2\pi i$就是积分，$C$外面的点不算；:term[极点]{id="math.complex-analysis.pole"}处的留数还有下面的公式。[变形积分路径](lesson:math.complex-analysis.cauchy-theorem#thm-deformation)只换一条内圈，奇点不止一个时套不上，所以上面先减去主部；也可以对$C$和绕各奇点的小圆周之间的部分用格林公式（Green's theorem）。

边界情况：奇点落在$C$上时定理不管，这时$\oint_Cf\,\dd z$一般不存在，比如$\oint_{|z|=1}\frac{\dd z}{z-1}$。$C$自己相交时定理也不管，见第 8 题。

### 极点处的留数

在:term[极点]{id="math.complex-analysis.pole"}处，不用写出整个:term[洛朗级数]{id="math.complex-analysis.laurent-series"}，下面的公式就能算出:term[留数]{id="math.complex-analysis.residue"}。

::anchor{id="thm-residue-poles"}
**定理**　设$f$在:term[去心圆盘]{id="math.complex-analysis.punctured-disc"}$0<|z-a|<R$上:term[全纯]{id="math.complex-analysis.holomorphic-function"}。（1）设$m$是正整数，$a$是$(z-a)^mf(z)$的:term[可去奇点]{id="math.complex-analysis.removable-singularity"}（$a$是$f$的$m$阶极点（pole of order m）时就是这样，见[极点的阶的定理](lesson:math.complex-analysis.singularities#thm-pole-order)），在$a$处补上值以后记作$g(z)$，则$\Res_{z=a}f(z)=\frac{g^{(m-1)}(a)}{(m-1)!}$；特别地，$m=1$时$\Res_{z=a}f(z)=\lim_{z\to a}(z-a)f(z)$。（2）设$f=\frac pq$，$p$、$q$在$|z-a|<R$上全纯，$a$是$q$的:term[单零点]{id="math.complex-analysis.order-of-zero"}（simple zero），$q$在去心圆盘里不为$0$，则$\Res_{z=a}f(z)=\frac{p(a)}{q'(a)}$。

**证明**：（1）$g$在$|z-a|<R$上全纯，由[泰勒展开的定理](lesson:math.complex-analysis.power-series#thm-taylor)，它等于自己的泰勒级数（Taylor series）$\sum_{k\ge0}\frac{g^{(k)}(a)}{k!}(z-a)^k$。在去心圆盘里除以$(z-a)^m$，得到$f$的洛朗级数（展开唯一），$(z-a)^{-1}$这一项来自$k=m-1$。$m=1$时$g$在$a$处连续，所以$g(a)=\lim_{z\to a}g(z)=\lim_{z\to a}(z-a)f(z)$。

（2）由[零点的阶](lesson:math.complex-analysis.identity-theorem#def-zero-order)，$q(z)=(z-a)q_1(z)$，$q_1$在$|z-a|<R$上全纯，$q_1(a)=q'(a)\ne0$；$q$在去心圆盘里不为$0$，所以$q_1$在整个$|z-a|<R$上都不为$0$。于是$(z-a)f(z)=\frac{p(z)}{q_1(z)}$在$a$处补上值$\frac{p(a)}{q_1(a)}$以后全纯，由（1）（$m=1$），留数是$\frac{p(a)}{q_1(a)}=\frac{p(a)}{q'(a)}$。

为什么有用：（1）里取$m=1$、$f(z)=\frac{F(z)}{z-a}$，$F$在$|z-a|<R$上全纯，留数就是$F(a)$，所以:term[柯西积分公式]{id="math.complex-analysis.cauchy-integral-formula"}（Cauchy's integral formula）是:term[留数定理]{id="math.complex-analysis.residue-theorem"}的特例。[高阶导数与莫雷拉定理](lesson:math.complex-analysis.higher-derivatives)一节第 3 题的$\frac{e^z}{z^2(z-1)}$在一阶极点（simple pole）$1$处的留数是$e$；$0$是二阶极点，$g(z)=\frac{e^z}{z-1}$，留数是$g'(0)=-2$，相加正是那里的$e-2$；那一节的例 1 是$m=3$的情形。[柯西积分公式](lesson:math.complex-analysis.cauchy-integral-formula)一节误区 2 的$\frac1{\zeta(\zeta-\frac12)}$在$0$、$\frac12$处的留数是$-2$、$2$，相加是$0$，正是那里的「实际积分是$0$」。

边界情况：（1）里的$m$可以取得比极点的阶大（$g$照样全纯，只是$g(a)=0$），却不能取小：$\frac1{z^2}$取$m=1$时，$zf(z)=\frac1z$在$0$处补不上值。

::anchor{id="def-meromorphic"}
设$D$是:term[开集]{id="math.complex-analysis.open-set"}，$f$在$D$上除去一些点以外处处全纯，并且这些点都是$f$的极点。这样的$f$叫作$D$上的:term[亚纯函数]{id="math.complex-analysis.meromorphic-function"}（meromorphic function）。

为什么这样定义：有理函数（rational function）、$\frac1{\sin z}$只有极点这一种奇点，在$\C$上亚纯，留数都能用上面的公式算。亚纯函数在$D$里的有界闭区域（bounded closed region）上只有有限个极点：否则照[有界闭区域里只有有限个零点](lesson:math.complex-analysis.identity-theorem#thm-finite-zeros)的证明，有一列互不相同的极点收敛到$D$里一点$z^*$，可$z^*$不管是不是极点，都有去心圆盘让$f$在里面全纯，矛盾。所以$C$和它围成的部分都在$D$里、$C$上没有极点时，就能用留数定理。

边界情况：$e^{1/z}$在$\C$上不是亚纯函数，$0$是它的:term[本性奇点]{id="math.complex-analysis.essential-singularity"}；$\frac1{\sin(\pi/z)}$在去掉原点的平面上亚纯，在$\C$上却不是，$0$不是它的:term[孤立奇点]{id="math.complex-analysis.isolated-singularity"}。

## 几何图像

![蓝色的不规则简单闭曲线 C，带逆时针方向的箭头。C 围成的部分里有三个圆点 z₁、z₂、z₃，各被一个绿色小圆周围着，小圆周也都带逆时针方向的箭头；C 和三个小圆周之间涂成浅蓝色。C 外面还有一个圆点 w。](residues.svg)

蓝色的简单闭曲线$C$和三个绿色小圆周都取逆时针方向，$f$在浅蓝色的部分和这些曲线上:term[全纯]{id="math.complex-analysis.holomorphic-function"}，$z_1$、$z_2$、$z_3$是它在$C$里面的:term[孤立奇点]{id="math.complex-analysis.isolated-singularity"}。沿每个小圆周的积分是$2\pi i$乘那一点的:term[留数]{id="math.complex-analysis.residue"}，:term[留数定理]{id="math.complex-analysis.residue-theorem"}说沿$C$的积分正是这三个积分之和。$C$外面的$w$不管是什么样的点，都不影响$\oint_Cf\,\dd z$。

## 例题

### 例 1　$\frac1{\sin z}$沿圆周$|z|=4$的积分

求$\oint_{|z|=4}\frac{\dd z}{\sin z}$，圆周取逆时针方向。

**为什么想到这么做**：$\frac1{\sin z}$只在$\sin z$的零点处不:term[全纯]{id="math.complex-analysis.holomorphic-function"}，这些零点只有$k\pi$（$k$是整数，见[复变函数与映射](lesson:math.complex-analysis.complex-functions#thm-sin-modulus)一节），圆里只有有限个。它们都是:term[单零点]{id="math.complex-analysis.order-of-zero"}，用$\frac{p(a)}{q'(a)}$算:term[留数]{id="math.complex-analysis.residue"}最省事。

**推导**：$|k\pi|<4$只有$k=0$、$\pm1$，圆周上也没有零点。$(\sin z)'=\cos z$在$k\pi$处是$(-1)^k\ne0$，所以这三点都是单零点，$\frac1{\sin z}$在$0$、$\pi$、$-\pi$处的留数依次是$\frac1{\cos0}=1$、$\frac1{\cos\pi}=-1$、$\frac1{\cos(-\pi)}=-1$。由:term[留数定理]{id="math.complex-analysis.residue-theorem"}，

$$
\oint_{|z|=4}\frac{\dd z}{\sin z}=2\pi i(1-1-1)=-2\pi i.
$$

### 例 2　三阶极点的留数

求$\oint_{|z|=1}\frac{\dd z}{z^2\sin z}$，圆周取逆时针方向。

**为什么想到这么做**：单位圆里$\sin z$只有零点$0$，它是:term[单零点]{id="math.complex-analysis.order-of-zero"}，所以$0$是分母$z^2\sin z$的三阶零点、被积函数（integrand）的:term[三阶极点]{id="math.complex-analysis.pole"}（[极点的阶的定理](lesson:math.complex-analysis.singularities#thm-pole-order)）。用定理的（1），$m=3$，要算$g(z)=\frac z{\sin z}$的二阶导数；直接求导再取极限很繁，写成$g=\frac1s$，$s(z)=\frac{\sin z}z$在$0$处的各阶导数可以从级数读出来。

**推导**：$s(z)=1-\frac{z^2}{3!}+\frac{z^4}{5!}-\cdots$（补上$s(0)=1$）是:term[整函数]{id="math.complex-analysis.entire-function"}（entire function），由级数的系数，$s(0)=1$，$s'(0)=0$，$s''(0)=-\frac13$。$g=\frac1s$在$0$附近:term[全纯]{id="math.complex-analysis.holomorphic-function"}，$g'=-\frac{s'}{s^2}$，$g''=\frac{2s'^2-ss''}{s^3}$，所以$g''(0)=\frac13$。由定理的（1），:term[留数]{id="math.complex-analysis.residue"}是$\frac{g''(0)}{2!}=\frac16$，

$$
\oint_{|z|=1}\frac{\dd z}{z^2\sin z}=2\pi i\cdot\frac16=\frac{\pi i}3.
$$

## 常见误区

- 「:term[留数]{id="math.complex-analysis.residue"}是$0$的点，是:term[可去奇点]{id="math.complex-analysis.removable-singularity"}。」:term[极点]{id="math.complex-analysis.pole"}处的留数也可以是$0$：$\frac1{z^2}$在$0$处是二阶极点，:term[洛朗级数]{id="math.complex-analysis.laurent-series"}里没有$z^{-1}$项。所以闭曲线围着极点，积分也可能是$0$。
- 「$m$阶极点处的留数是$\frac{g^{(m)}(a)}{m!}$。」留数是$g$的泰勒级数里$(z-a)^{m-1}$的系数，所以是$\frac{g^{(m-1)}(a)}{(m-1)!}$；拿$m=1$核对：一阶极点处的留数是$g(a)$，不是$g'(a)$。
- 「:term[留数定理]{id="math.complex-analysis.residue-theorem"}只管极点。」定理只要求$f$在$C$上:term[全纯]{id="math.complex-analysis.holomorphic-function"}、在$C$里面除有限个点外全纯，不管这些点是哪一类:term[孤立奇点]{id="math.complex-analysis.isolated-singularity"}，:term[本性奇点]{id="math.complex-analysis.essential-singularity"}也一样：讲解开头的$\oint_{|z|=1}e^{1/z}\,\dd z=2\pi i$就是例子。只是本性奇点处没有上面那样的公式，留数要从洛朗级数里找。

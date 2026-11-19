---
id: math.complex-analysis.singularities
title: |
  孤立奇点的分类
goal: |
  会用洛朗级数把孤立奇点分成可去奇点、极点和本性奇点。
prerequisites: [math.complex-analysis.laurent-series, math.complex-analysis.identity-theorem]
minutes: 29
summary: |
  主部为$0$是可去奇点，有限项是极点，无穷多项是本性奇点。
status: reviewed
---

## 这一节要回答的问题

$\frac{\sin z}z$、$\frac1z$、$e^{1/z}$都在去掉$0$的平面上:term[全纯]{id="math.complex-analysis.holomorphic-function"}（holomorphic），在$0$处没有定义。靠近$0$时三者却完全不同：第一个补上一个值就好，第二个的:term[模]{id="math.complex-analysis.modulus"}（modulus）趋于$+\infty$，第三个沿不同方向的表现各不相同。能不能从$0$处的:term[洛朗级数]{id="math.complex-analysis.laurent-series"}（Laurent series）看出是哪一种？还有没有第四种？

## 讲解

### 孤立奇点

$\frac1{z(1-z)}$在$0$处没有定义，却在:term[去心圆盘]{id="math.complex-analysis.punctured-disc"}（punctured disc）$0<|z|<1$上:term[全纯]{id="math.complex-analysis.holomorphic-function"}，有:term[洛朗级数]{id="math.complex-analysis.laurent-series"}$z^{-1}+1+z+\cdots$（见[洛朗级数](lesson:math.complex-analysis.laurent-series)一节开头）。

::anchor{id="def-isolated-singularity"}
设$f$在去心圆盘$0<|z-a|<R$上全纯，在$a$处没有定义或者不全纯，就说$a$是$f$的:term[孤立奇点]{id="math.complex-analysis.isolated-singularity"}（isolated singularity）。

为什么这样定义：有了去心圆盘，$f$在$a$处就有洛朗级数和:term[主部]{id="math.complex-analysis.principal-part"}（principal part），下面的分类全靠它。边界情况：$\frac1{\sin(\pi/z)}$在$\frac1k$（$k$是非零整数）处没有定义，这些点挤向$0$；$\Log z$在$(-\infty,0)$上不连续：$0$都不是它们的孤立奇点。常微分方程里方程的:term[奇点]{id="math.ode.singular-point"}（singular point）是另一个概念。

### 三类孤立奇点

$\frac{\sin z}z=1-\frac{z^2}{3!}+\cdots$在$0$处的:term[主部]{id="math.complex-analysis.principal-part"}是$0$，$\frac1z$的是它自己，$e^{1/z}=\sum_{n\ge0}\frac{z^{-n}}{n!}$的有无穷多项（见[洛朗级数](lesson:math.complex-analysis.laurent-series#def-principal-part)一节），正好对着开头的三种表现。

::anchor{id="def-singularity-types"}
设$a$是$f$的:term[孤立奇点]{id="math.complex-analysis.isolated-singularity"}。$f$在$a$处的主部为$0$时，$a$叫作:term[可去奇点]{id="math.complex-analysis.removable-singularity"}（removable singularity）；主部不为$0$、只有有限项时，$a$叫作:term[极点]{id="math.complex-analysis.pole"}（pole），最低次项是$a_{-m}(z-a)^{-m}$（$a_{-m}\ne0$）时叫$m$阶极点（pole of order m），$m=1$时叫一阶极点（simple pole）；主部有无穷多项时，$a$叫作:term[本性奇点]{id="math.complex-analysis.essential-singularity"}（essential singularity）。

为什么这样定义：$f$减去主部、在$a$处补上$a_0$，就在$|z-a|<R$上:term[全纯]{id="math.complex-analysis.holomorphic-function"}（见[洛朗级数](lesson:math.complex-analysis.laurent-series#def-principal-part)一节），毛病全在主部里；三种情形不重不漏，下面三段说明它们分别对应有界、:term[模]{id="math.complex-analysis.modulus"}趋于$+\infty$、两样都不是。边界情况：$f$在可去奇点处可以有定义、只是值不对，如$f(0)=0$、$z\ne0$时$f(z)=\frac{\sin z}z$，改成$f(0)=1$就好。极坐标（polar coordinates）的极点英文也叫 pole，和这里是两回事。

### 可去奇点

::anchor{id="thm-removable"}
**定理（黎曼可去奇点定理，Riemann's removable singularity theorem）**　设$f$在:term[去心圆盘]{id="math.complex-analysis.punctured-disc"}$0<|z-a|<R$上:term[全纯]{id="math.complex-analysis.holomorphic-function"}，$a$是它的:term[孤立奇点]{id="math.complex-analysis.isolated-singularity"}。则$a$是:term[可去奇点]{id="math.complex-analysis.removable-singularity"}，当且仅当$f$在$a$的某个去心圆盘里有界。这时在$a$处补上（或改成）:term[洛朗级数]{id="math.complex-analysis.laurent-series"}的常数项$a_0$，$f$就在$|z-a|<R$上全纯。

**证明**：可去时，由[洛朗级数](lesson:math.complex-analysis.laurent-series#def-principal-part)一节对:term[主部]{id="math.complex-analysis.principal-part"}的说明，补上$a_0$以后$f$在$|z-a|<R$上全纯，在$a$处连续，所以在$a$附近有界。反过来，设$0<|z-a|<\delta$里$|f|\le M$，$0<\rho<\delta$，$C_\rho$是逆时针的圆周$|\zeta-a|=\rho$。由[洛朗展开](lesson:math.complex-analysis.laurent-series#thm-laurent)的系数公式和 :term[ML 不等式]{id="math.complex-analysis.ml-inequality"}（ML inequality），$n\ge1$时

$$
|a_{-n}|=\biggl|\frac1{2\pi i}\oint_{C_\rho}f(\zeta)(\zeta-a)^{n-1}\,\dd\zeta\biggr|\le\frac{M\rho^{n-1}\cdot2\pi\rho}{2\pi}=M\rho^n,
$$

令$\rho\to0^+$，得$a_{-n}=0$。

为什么有用：判断可去只看有没有界，比[高阶导数与莫雷拉定理](lesson:math.complex-analysis.higher-derivatives#thm-morera)一节要的「在$a$处连续」更弱。[全纯函数的幂级数展开](lesson:math.complex-analysis.power-series)一节的$\frac{\sin z}z$和第 4、5 题的$\frac z{\sin z}$、$\frac z{e^z-1}$，$z\to0$时都趋于$1$，$0$是它们的可去奇点。边界情况：只沿:term[实轴]{id="math.complex-analysis.real-axis"}（real axis）有界不够，见下面的$e^{-1/z^2}$。

### 极点

::anchor{id="thm-pole-order"}
**定理**　设$a$是$f$的:term[孤立奇点]{id="math.complex-analysis.isolated-singularity"}，$m$是正整数。下面三条等价：（1）$a$是$f$的:term[$m$阶极点]{id="math.complex-analysis.pole"}；（2）在$a$附近$f(z)=\frac{g(z)}{(z-a)^m}$，$g$在以$a$为圆心的某个:term[开圆盘]{id="math.complex-analysis.open-disc"}（open disc）上:term[全纯]{id="math.complex-analysis.holomorphic-function"}，$g(a)\ne0$；（3）$f$在$a$的某个:term[去心圆盘]{id="math.complex-analysis.punctured-disc"}里不为$0$，$\frac1f$在$a$处补上值$0$以后，$a$是它的:term[$m$阶零点]{id="math.complex-analysis.order-of-zero"}（zero of order m）。

**证明**：（1）⇒（2）：设:term[主部]{id="math.complex-analysis.principal-part"}的最低次项是$a_{-m}(z-a)^{-m}$。去心圆盘里$(z-a)^mf(z)$的:term[洛朗级数]{id="math.complex-analysis.laurent-series"}$\sum_{k\ge0}a_{k-m}(z-a)^k$没有负次幂，补上值以后在$a$附近全纯（同可去奇点定理的证明），记作$g$，$g(a)=a_{-m}\ne0$。（2）⇒（1）：$g$的泰勒级数（Taylor series）除以$(z-a)^m$，就是$f$的洛朗级数（展开唯一），最低次项是$g(a)(z-a)^{-m}$。

（2）⇔（3）：$g(a)\ne0$时$a$附近$g\ne0$，$\frac1f=(z-a)^m\cdot\frac1g$，补上$0$以后在$a$处也成立，由[零点的阶](lesson:math.complex-analysis.identity-theorem#def-zero-order)的定义后面的说明，$a$是$\frac1f$的$m$阶零点。反过来，补上$0$以后$\frac1f=(z-a)^mh(z)$、$h(a)\ne0$时，$h$在$a$附近不为$0$，取$g=\frac1h$即可。

为什么有用：$f=\frac pq$，$p$、$q$在$a$附近全纯、不恒为$0$，$q(a)=0$时，比较零点的阶就能分类。设$p=(z-a)^jp_1$、$q=(z-a)^kq_1$，$p_1(a)$、$q_1(a)$不为$0$，则$f=(z-a)^{j-k}\frac{p_1}{q_1}$：$j\ge k$时$f$在$a$附近有界，$a$是:term[可去奇点]{id="math.complex-analysis.removable-singularity"}；$j<k$时由（2），$a$是$(k-j)$阶极点（例 1）。

::anchor{id="thm-pole-modulus"}
**定理**　设$a$是$f$的孤立奇点。则$a$是极点，当且仅当$z\to a$时$|f(z)|\to+\infty$。

**证明**：极点时由上一条的（2），$|f(z)|=\frac{|g(z)|}{|z-a|^m}$，而$a$附近$|g(z)|\ge\frac{|g(a)|}2>0$，所以$|f(z)|\to+\infty$。反过来，设$|f(z)|\to+\infty$，在某个去心圆盘里$|f|>1$，$\frac1f$在那里全纯、:term[模]{id="math.complex-analysis.modulus"}小于$1$，由可去奇点定理，补上值以后全纯，补的值是$\lim_{z\to a}\frac1{f(z)}=0$。补好的$\frac1f$不恒为$0$，$a$是它的某个$m$阶零点，由上一条定理，$a$是$f$的$m$阶极点。

为什么有用：$\frac1z$、$\frac{\sin z}{z^2}$在$0$处「补上什么值都不连续」（[古尔萨定理](lesson:math.complex-analysis.goursat)一节，[高阶导数与莫雷拉定理](lesson:math.complex-analysis.higher-derivatives)一节第 8 题），因为$0$是它们的一阶极点。上面的$\frac z{\sin z}$在$k\pi$、$\frac z{e^z-1}$在$2k\pi i$（$k\ne0$）也是一阶极点；[判断收敛半径](lesson:math.complex-analysis.power-series#thm-radius-nearest)（radius of convergence）时那个「离中心最近的、函数不全纯的点」，分别是其中的$\pm\pi$、$\pm2\pi i$。

边界情况：这条定理定不出阶数（$\frac1z$、$\frac1{z^2}$都满足）；只沿一条射线$|f|\to+\infty$不够，见下面的$e^{1/z}$。可去奇点挡不住收敛半径，:term[本性奇点]{id="math.complex-analysis.essential-singularity"}挡不挡见第 8 题。

### 本性奇点

::anchor{id="thm-essential"}
**推论**　设$a$是$f$的:term[孤立奇点]{id="math.complex-analysis.isolated-singularity"}。则$a$是:term[本性奇点]{id="math.complex-analysis.essential-singularity"}，当且仅当$f$在$a$的每个:term[去心圆盘]{id="math.complex-analysis.punctured-disc"}里都无界，并且$z\to a$时$|f(z)|$不趋于$+\infty$。

**证明**：三类奇点互不重叠、包括了全部孤立奇点。由上面两条定理，「不是:term[可去奇点]{id="math.complex-analysis.removable-singularity"}」就是每个去心圆盘里都无界，「不是:term[极点]{id="math.complex-analysis.pole"}」就是$|f(z)|$不趋于$+\infty$。

例子：$z$沿:term[正实轴]{id="math.complex-analysis.real-axis"}趋于$0$时$e^{1/z}=e^{1/x}\to+\infty$，沿负实轴时$e^{1/z}\to0$，沿:term[虚轴]{id="math.complex-analysis.imaginary-axis"}（imaginary axis）时$|e^{1/z}|=|e^{-i/y}|=1$。$e^{-1/z^2}$的:term[洛朗级数]{id="math.complex-analysis.laurent-series"}$\sum_{n\ge0}\frac{(-1)^n}{n!}z^{-2n}$也有无穷多个负次幂：沿实轴它趋于$0$，沿虚轴却是$e^{1/y^2}\to+\infty$（[全纯函数的幂级数展开](lesson:math.complex-analysis.power-series)一节第 7 题）。

和实函数的间断点（point of discontinuity）比，可去奇点和可去间断点（removable discontinuity，见[连续与间断](lesson:math.calculus.continuity#def-removable)）都是补上一个值就好，可实轴上的分类搬不过来：$e^{1/x}$、$e^{-1/x^2}$在$0$处分别是无穷间断点（infinite discontinuity）、可去间断点，换成$z$却都是本性奇点。

::anchor{id="thm-casorati"}
本性奇点附近，$f$的值还会任意接近每一个:term[复数]{id="math.complex-analysis.complex-number"}（complex number）：设$a$是$f$的本性奇点，则对任何复数$w_0$和任何$\varepsilon>0$，$a$的每个去心圆盘里都有$z$使$|f(z)-w_0|<\varepsilon$。这叫作卡索拉蒂-魏尔斯特拉斯定理（Casorati-Weierstrass theorem）。

证明见第 5 题，技巧和[刘维尔定理与代数基本定理](lesson:math.complex-analysis.liouville)一节第 5 题（2）相同。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0.02, 3], y: [0, 6] }
functions:
  - expr: "exp(cos(al*pi/180)/x)"
    label: |
      $|e^{1/z}|$
  - expr: "1/x"
    label: |
      $\bigl|\frac1z\bigr|$
  - expr: "sqrt(sin(x*cos(al*pi/180))^2 + sinh(x*sin(al*pi/180))^2)/x"
    label: |
      $\bigl|\frac{\sin z}z\bigr|$
sliders:
  - name: al
    min: 0
    max: 180
    step: 5
    default: 0
    label: |
      射线的辐角$\alpha$（度）
:::

三条线是沿射线$z=te^{i\alpha}$的:term[模]{id="math.complex-analysis.modulus"}，横轴是$t$（图上写作 x），$\alpha$是射线的:term[辐角]{id="math.complex-analysis.argument"}（argument）：蓝线$|e^{1/z}|=e^{\cos\alpha/t}$，橙线$\bigl|\frac1z\bigr|=\frac1t$，绿线$\bigl|\frac{\sin z}z\bigr|$。拖动$\alpha$：橙线不变，是:term[一阶极点]{id="math.complex-analysis.pole"}；绿线在$t\to0$时总趋于$1$，是:term[可去奇点]{id="math.complex-analysis.removable-singularity"}；蓝线在$\alpha<90^\circ$时往上冲，$\alpha>90^\circ$时贴向$0$，$\alpha=90^\circ$时恒为$1$，是:term[本性奇点]{id="math.complex-analysis.essential-singularity"}。$\alpha=0^\circ$、$180^\circ$时，蓝线就是$e^{1/x}$在$0$右侧、左侧的值（横轴是$|x|$）。

## 例题

### 例 1　比较零点的阶

找出$\frac{\sin\pi z}{z^2(z-1)}$的:term[孤立奇点]{id="math.complex-analysis.isolated-singularity"}并分类；:term[可去奇点]{id="math.complex-analysis.removable-singularity"}处要补上什么值？

**为什么想到这么做**：分子、分母都是:term[整函数]{id="math.complex-analysis.entire-function"}（entire function），分母只在$0$、$1$处为$0$；照讲解里$f=\frac pq$的办法，比较两者在这两点的:term[零点的阶]{id="math.complex-analysis.order-of-zero"}。

**推导**：$\sin\pi z$的导数$\pi\cos\pi z$在整数处是$\pm\pi\ne0$，所以$0$、$1$都是分子的单零点（simple zero）。分母以$0$为二阶零点、以$1$为单零点，所以$0$是:term[一阶极点]{id="math.complex-analysis.pole"}，$1$是可去奇点。补的值是极限：由$\sin\pi z=-\sin\pi(z-1)$，$z\to1$时

$$
\frac{\sin\pi z}{z^2(z-1)}=-\frac{\sin\pi(z-1)}{z-1}\cdot\frac1{z^2}\to-\pi.
$$

## 常见误区

- 「补上什么值都不连续的点就是:term[极点]{id="math.complex-analysis.pole"}。」:term[本性奇点]{id="math.complex-analysis.essential-singularity"}也补不上：$e^{1/z}$在$0$附近无界，补上什么值都不连续，可它沿:term[负实轴]{id="math.complex-analysis.real-axis"}趋于$0$，$0$不是极点。
- 「沿实轴从两侧趋于$a$时都有$|f|\to+\infty$，$a$就是极点。」极点要求$z$不管怎样趋于$a$都有$|f(z)|\to+\infty$：$e^{1/z^2}$在实轴上是$e^{1/x^2}$，两侧都趋于$+\infty$，沿:term[虚轴]{id="math.complex-analysis.imaginary-axis"}却是$e^{-1/y^2}\to0$，$0$是它的本性奇点。
- 「分母为$0$的点都是极点。」还要看分子：$\frac z{\sin z}$的分母、分子在$0$处都为$0$，$0$是:term[可去奇点]{id="math.complex-analysis.removable-singularity"}；例 1 的$1$也是。

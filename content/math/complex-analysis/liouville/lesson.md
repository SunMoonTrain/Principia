---
id: math.complex-analysis.liouville
title: |
  刘维尔定理与代数基本定理
goal: |
  会用柯西估计证明刘维尔定理，再推出代数基本定理。
prerequisites: [math.complex-analysis.higher-derivatives, math.complex-analysis.complex-roots]
minutes: 21
summary: |
  有界整函数是常数；由此，复系数多项式在复数里一定有根。
status: reviewed
---

## 这一节要回答的问题

$\sin x$在:term[实轴]{id="math.complex-analysis.real-axis"}（real axis）上有界，可$\sin z$沿:term[虚轴]{id="math.complex-analysis.imaginary-axis"}（imaginary axis）无限增大（[复变函数与映射](lesson:math.complex-analysis.complex-functions)一节）。有没有不是常数、在整个:term[复平面]{id="math.complex-analysis.complex-plane"}（complex plane）上又有界的:term[整函数]{id="math.complex-analysis.entire-function"}（entire function）？$x^2+1=0$在实数里没有根，添上$i$就有了；复系数的多项式方程，会不会又需要更大的数？

## 讲解

### 柯西估计

::anchor{id="thm-cauchy-estimate"}
**定理（:term[柯西估计]{id="math.complex-analysis.cauchy-estimate"}，Cauchy's estimate）**　设$f$在以$a$为圆心、半径为$R$的:term[开圆盘]{id="math.complex-analysis.open-disc"}（open disc）上:term[全纯]{id="math.complex-analysis.holomorphic-function"}（holomorphic），$0<r<R$，在圆周$|z-a|=r$上处处$|f(z)|\le M$。则对每个正整数$n$，$|f^{(n)}(a)|\le\frac{n!\,M}{r^n}$。

**证明**：由:term[高阶导数公式]{id="math.complex-analysis.higher-derivative-formula"}（Cauchy's integral formula for derivatives），$f^{(n)}(a)=\frac{n!}{2\pi i}\oint_{|\zeta-a|=r}\frac{f(\zeta)}{(\zeta-a)^{n+1}}\,\dd\zeta$。圆周上被积函数的:term[模]{id="math.complex-analysis.modulus"}（modulus）不超过$\frac M{r^{n+1}}$，圆周长$2\pi r$，由:term[ML 不等式]{id="math.complex-analysis.ml-inequality"}（ML inequality），$|f^{(n)}(a)|\le\frac{n!}{2\pi}\cdot\frac M{r^{n+1}}\cdot2\pi r=\frac{n!\,M}{r^n}$。

为什么有用：只知道$f$在一个圆周上不超过$M$，就能控制它在圆心的各阶导数；圆越大，控制得越紧；让$r\to+\infty$，就得到下面的定理。边界情况：这个估计不能再改进：$f(z)=\frac{M(z-a)^n}{r^n}$在圆周上$|f|=M$，而$f^{(n)}(a)=\frac{n!\,M}{r^n}$，等号成立。

### 刘维尔定理

::anchor{id="thm-liouville"}
**定理（:term[刘维尔定理]{id="math.complex-analysis.liouville-theorem"}，Liouville's theorem）**　有界的:term[整函数]{id="math.complex-analysis.entire-function"}一定是常数。

**证明**：设处处$|f(z)|\le M$。任取$a$，对每个$r>0$，$f$在以$a$为圆心、半径大于$r$的圆盘上:term[全纯]{id="math.complex-analysis.holomorphic-function"}，由:term[柯西估计]{id="math.complex-analysis.cauchy-estimate"}（$n=1$），$|f'(a)|\le\frac Mr$。$r$可以任意大，所以$f'(a)=0$。$f'$在整个平面上为$0$，平面是:term[区域]{id="math.complex-analysis.domain"}（domain），所以$f$是常数（[柯西-黎曼方程与全纯函数](lesson:math.complex-analysis.holomorphic)第 5 题）。

为什么有用：不是常数的整函数一定无界，$\sin z$、$\cos z$、$e^z$都是这样。这和实函数大不相同：$\sin x$、$\frac1{1+x^2}$在:term[实轴]{id="math.complex-analysis.real-axis"}上有界、无穷次可导，却不是常数。边界情况：「整个平面」不能换成圆盘，$f(z)=z$在单位圆盘里有界、全纯，不是常数；「有界」也不能只在一条直线上，$e^z$在:term[虚轴]{id="math.complex-analysis.imaginary-axis"}上$|e^{iy}|=1$，在整个平面上却无界。

### 代数基本定理

::anchor{id="thm-fundamental-algebra"}
**定理（:term[代数基本定理]{id="math.complex-analysis.fundamental-theorem-of-algebra"}，fundamental theorem of algebra）**　设$p(z)=a_nz^n+\dots+a_1z+a_0$是复系数多项式，$n\ge1$，$a_n\ne0$。则$p$在:term[复数]{id="math.complex-analysis.complex-number"}（complex number）里至少有一个根。

**证明**：记$A=|a_0|+\dots+|a_{n-1}|$，$\rho=\max\bigl\{1,\frac{2A}{|a_n|}\bigr\}$。$|z|\ge\rho$时，$k<n$的项满足$|a_kz^k|\le|a_k||z|^{n-1}$，所以$|p(z)|\ge|a_n||z|^n-A|z|^{n-1}\ge\frac{|a_n|}2|z|^n\ge\frac{|a_n|}2$。假如$p$没有根，$g=\frac1p$是:term[整函数]{id="math.complex-analysis.entire-function"}，$|z|\ge\rho$时$|g|\le\frac2{|a_n|}$。$|z|<\rho$时，对圆周$|\zeta|=2\rho$用:term[柯西积分公式]{id="math.complex-analysis.cauchy-integral-formula"}（Cauchy's integral formula），圆周上$|\zeta-z|>\rho$，由:term[ML 不等式]{id="math.complex-analysis.ml-inequality"}，$|g(z)|\le\frac1{2\pi}\cdot\frac2{|a_n|\rho}\cdot4\pi\rho=\frac4{|a_n|}$。

于是$g$是有界的整函数，由:term[刘维尔定理]{id="math.complex-analysis.liouville-theorem"}是常数，$p=\frac1g$也是常数，和$|z|\ge\rho$时$|p(z)|\ge\frac{|a_n|}2|z|^n$无界矛盾。所以$p$有根。

为什么有用：设$z_1$是根，由$z^k-z_1^k=(z-z_1)(z^{k-1}+z^{k-2}z_1+\dots+z_1^{k-1})$，$p(z)-p(z_1)$能提出因子$z-z_1$，即$p(z)=(z-z_1)q(z)$，$q$是$n-1$次多项式；一次次做下去，$p(z)=a_n(z-z_1)(z-z_2)\cdots(z-z_n)$，$p$在复数里恰好有$n$个根（重根按重数计）。单变量微积分[有理函数的积分](lesson:math.calculus.partial-fractions)一节说「这里不证」的，就是这件事，复数里不必再扩充数系。边界情况：系数是实数时$\overline{p(z)}=p(\bar z)$，不是实数的根成对出现，互为:term[共轭复数]{id="math.complex-analysis.conjugate"}（complex conjugate），实系数多项式因此能分解成实系数的一次、二次因式的乘积（例 2）。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-6.3, 6.3], y: [0, 11] }
functions:
  - expr: "sqrt(sin(x)^2 + sinh(c)^2)"
    label: |
      $|\sin(x+ic)|$
  - expr: "1"
    label: |
      高度$1$
sliders:
  - name: c
    min: 0
    max: 3
    step: 0.1
    default: 0
    label: |
      虚部$c$
:::

蓝线是$|\sin z|$沿水平线$\Im z=c$的值，横轴是$\Re z$（图上写作 x），纵轴是$|\sin z|$；$|\sin(x+ic)|^2=\sin^2x+\sinh^2c$，滑块调的是这条水平线的高度$c$，橙线是高度$1$。$c=0$时就是$|\sin x|$，不超过$1$；$c$变大，整条曲线抬高，最低点是$\sinh c$，$c=3$时已经超过$10$。$\sin z$在:term[实轴]{id="math.complex-analysis.real-axis"}上有界，在整个平面上却无界，正合:term[刘维尔定理]{id="math.complex-analysis.liouville-theorem"}：不是常数的:term[整函数]{id="math.complex-analysis.entire-function"}不可能处处有界。

## 例题

### 例 1　增长不快的整函数

设$f$是:term[整函数]{id="math.complex-analysis.entire-function"}，处处$|f(z)|\le1+|z|$。证明$f(z)=cz+d$，$c$、$d$是常数。

**为什么想到这么做**：$f$不一定有界，:term[刘维尔定理]{id="math.complex-analysis.liouville-theorem"}不能直接用；对二阶导数用:term[柯西估计]{id="math.complex-analysis.cauchy-estimate"}，圆越大，界越小。

**推导**：任取$a$和$r>0$。圆周$|z-a|=r$上$|f(z)|\le1+|a|+r$，由柯西估计（$n=2$），$|f''(a)|\le\frac{2(1+|a|+r)}{r^2}$，$r\to+\infty$时右边趋于$0$，所以$f''(a)=0$。$f''$处处为$0$，所以$f'$是常数$c$；$f(z)-cz$的导数为$0$，也是常数，记作$d$。

### 例 2　分解$z^4+4$

在:term[复数]{id="math.complex-analysis.complex-number"}里把$z^4+4$分解成一次因式，再合成实系数的二次因式。

**为什么想到这么做**：根是$-4$的四个:term[四次方根]{id="math.complex-analysis.nth-root"}（nth root），它们成对:term[共轭]{id="math.complex-analysis.conjugate"}；共轭的一对乘起来是实系数的二次式。

**推导**：$-4=4e^{i\pi}$，四次方根是$\sqrt2e^{i(\pi/4+k\pi/2)}$（$k=0,1,2,3$），即$1+i$、$-1+i$、$-1-i$、$1-i$。$(z-1-i)(z-1+i)=(z-1)^2+1$，即$z^2-2z+2$；同样$(z+1-i)(z+1+i)=z^2+2z+2$。所以$z^4+4=(z^2-2z+2)(z^2+2z+2)$。

## 常见误区

- 「$\sin z$在:term[实轴]{id="math.complex-analysis.real-axis"}上有界，所以是有界的:term[整函数]{id="math.complex-analysis.entire-function"}。」只在实轴上有界不够，$|\sin(iy)|=|\sinh y|$无界；由:term[刘维尔定理]{id="math.complex-analysis.liouville-theorem"}，不是常数的整函数都无界。
- 「实系数多项式至少有一个实根。」$z^2+1$的根是$\pm i$；奇数次的实系数多项式才一定有实根（第 8 题）。
- 「:term[代数基本定理]{id="math.complex-analysis.fundamental-theorem-of-algebra"}给出了求根的办法。」它只保证根存在，没有给出求根的办法；证明里的估计只说明根都在圆盘$|z|<\rho$里。

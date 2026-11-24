---
id: physics.thermal-physics.maxwell-relations
title: |
  麦克斯韦关系
goal: |
  会由热力学势推出麦克斯韦关系，并用它把难测的量换成可测的量。
prerequisites: [physics.thermal-physics.thermodynamic-potentials]
minutes: 29
summary: |
  二阶偏导数连续时，由热力学势交叉求导得麦克斯韦关系，如$\pdvc SVT=\pdvc pTV$。
status: reviewed
---

## 这一节要回答的问题

:term[熵]{id="physics.thermal-physics.entropy"}（entropy）没法直接测量，可「:term[等温膨胀]{id="physics.thermal-physics.isothermal-process"}（isothermal expansion）时熵增加多少」「液体的:term[定容热容]{id="physics.thermal-physics.constant-volume-heat-capacity"}（heat capacity at constant volume）是多少」这类问题常常要回答。能不能把它们换成热膨胀（thermal expansion）、压缩这些容易测的量？

## 讲解

### 由热力学势推出

一定量的物质只做体积变化的功时，:term[亥姆霍兹自由能]{id="physics.thermal-physics.helmholtz-free-energy"}（Helmholtz free energy）满足$\dd F=-S\dd T-p\,\dd V$（见[热力学势](lesson:physics.thermal-physics.thermodynamic-potentials#def-helmholtz)），所以$\pdvc FTV=-S$，$\pdvc FVT=-p$。把前一式对$V$、后一式对$T$再求一次偏导数（partial derivative）：

$$
\pdvc SVT=-\frac{\partial^2F}{\partial V\,\partial T} ,\qquad \pdvc pTV=-\frac{\partial^2F}{\partial T\,\partial V} .
$$

右边不看负号，是$F$的两个混合偏导数（mixed partial derivatives），它们连续时相等（[偏导数](lesson:math.vector-calculus.partial-derivatives#thm-schwarz)一节的施瓦茨定理，Schwarz's theorem），所以$\pdvc SVT=\pdvc pTV$。左边是:term[温度]{id="physics.thermal-physics.temperature"}（temperature）不变时:term[熵]{id="physics.thermal-physics.entropy"}随体积增加得多快，很难测；右边是体积不变时压强（pressure）随温度升得多快，由:term[状态方程]{id="physics.thermal-physics.equation-of-state"}（equation of state）就能算出。

::anchor{id="thm-maxwell"}
定理：一定量的物质只做体积变化的功，:term[热力学势]{id="physics.thermal-physics.thermodynamic-potential"}（thermodynamic potential）的二阶偏导数（second-order partial derivatives）都连续时，由$\dd U=T\dd S-p\,\dd V$、$\dd H=T\dd S+V\dd p$、$\dd F=-S\dd T-p\,\dd V$、$\dd G=-S\dd T+V\dd p$各得一个等式：$\pdvc TVS=-\pdvc pSV$，$\pdvc TpS=\pdvc VSp$，$\pdvc SVT=\pdvc pTV$，$\pdvc SpT=-\pdvc VTp$。这四个等式叫作麦克斯韦关系（Maxwell relations）。

证明思路：和上面由$F$推的一样，对每个热力学势的两个:term[自然变量]{id="physics.thermal-physics.natural-variables"}（natural variables）交叉求二阶偏导数，再用施瓦茨定理。第一个等式也可以这样看：$T\dd S-p\,\dd V$是$U$的全微分（total differential），[恰当方程](lesson:math.ode.exact-equations#thm-exactness-test)（exact equation）判别法的必要性那一半正给出$\pdvc TVS=\pdvc{(-p)}SV$。

记法：每个等式两边的分母和右下角的量合起来，正是那个热力学势的自然变量；分子一边是$T$或$S$，另一边是$p$或$V$。正负号不必死记，从全微分重推一遍就行。这里的麦克斯韦（James Clerk Maxwell）就是写出:term[麦克斯韦方程组]{id="physics.electromagnetism.maxwell-equations"}（Maxwell's equations）的那一位，这四个等式却和电磁学无关。

边界情况：热力学势通常都满足二阶偏导数连续，个别状态例外。压强一定时冰熔化（melting），温度不变而熵增加，$G(T)$在那个温度有折角（[热力学势](lesson:physics.thermal-physics.thermodynamic-potentials)第 8 题），二阶偏导数不存在，由$\dd G$得到的等式在那一点不能用。

### 偏导数之间的关系

设三个量$x$、$y$、$z$之间有一个关系，像:term[状态方程]{id="physics.thermal-physics.equation-of-state"}把$p$、$V$、$T$连起来那样，任取两个都可以当自变量。[偏导数](lesson:math.vector-calculus.partial-derivatives)一节的误区和第 7 题说过，保持不变的量不同时，两个偏导数不能像分数一样约分。保持同一个量$z$不变时却可以：$x$、$y$之间只剩一元的关系，导数不为零时，由反函数的求导法则（inverse function rule），$\pdvc xyz\pdvc yxz=1$。

::anchor{id="thm-cyclic"}
定理：三个量$x$、$y$、$z$之间有一个关系，每一个都是另外两个的可微（differentiable）函数，并且用到的偏导数都不为零时，$\pdvc xyz\pdvc yzx\pdvc zxy=-1$。这叫作循环关系（cyclic relation）。

证明思路：把$z$看成$x$、$y$的函数，$\dd z=\pdvc zxy\dd x+\pdvc zyx\dd y$。让$x$、$y$沿$z$不变的方向变化，$\dd z=0$，得

$$
\pdvc xyz=-\frac{\pdvc zyx}{\pdvc zxy} ,
$$

这和[多元复合函数的链式法则](lesson:math.vector-calculus.multivariable-chain-rule#thm-chain-rule)一节隐函数（implicit function）的求导公式$y'=-\frac{F_x}{F_y}$是一回事。两边乘以$\pdvc zxy\pdvc yzx$，再用$\pdvc yzx\pdvc zyx=1$，就得到循环关系。照分数约分会以为乘积是$+1$，错在三个偏导数保持不变的量各不相同。

### 把难测的量换成可测的量

$20\,^\circ\mathrm C$的水，压强不变时升温$1\,\mathrm K$，体积约增加万分之二；保持$20\,^\circ\mathrm C$、多加 1 标准大气压（standard atmosphere），体积约减少十万分之五。

::anchor{id="def-expansion-compressibility"}
对一定量的物质，$\alpha=\frac1V\pdvc VTp$叫作体膨胀系数（coefficient of volume expansion），$\kappa_T=-\frac1V\pdvc VpT$叫作等温压缩系数（isothermal compressibility），下标$T$表示:term[温度]{id="physics.thermal-physics.temperature"}不变，不能省。前者说压强不变时加热，体积胀得多快；后者说温度不变时加压，体积缩得多快，两者都容易测。

为什么这样定义：除以$V$，就得到和物体大小无关的:term[强度量]{id="physics.thermal-physics.intensive-quantity"}（intensive quantity）；加压时体积减小，负号让$\kappa_T$为正，流体的:term[等温体积模量]{id="physics.oscillations-waves.bulk-modulus"}（isothermal bulk modulus）就是$\frac1{\kappa_T}$。这里的$\alpha$和[准静态过程与气体的功](lesson:physics.thermal-physics.quasi-static-processes)第 5 题、[绝热过程](lesson:physics.thermal-physics.adiabatic-processes)第 5 题里$pV^\alpha$不变的那个指数无关。边界情况：:term[理想气体]{id="physics.thermal-physics.ideal-gas"}（ideal gas）$\alpha=\frac1T$，$\kappa_T=\frac1p$；常压下$0$到$4\,^\circ\mathrm C$的水受热反而收缩，$\alpha<0$。

循环关系的证明里，由$\dd z=0$得到的式子只要求分母不为零，$\alpha=0$时也能用。取$x=p$、$y=T$、$z=V$，

$$
\pdvc pTV=-\frac{\pdvc VTp}{\pdvc VpT}=\frac\alpha{\kappa_T} .
$$

所以$\pdvc SVT=\frac\alpha{\kappa_T}$：:term[等温膨胀]{id="physics.thermal-physics.isothermal-process"}时:term[熵]{id="physics.thermal-physics.entropy"}怎样变，测出热膨胀和压缩就知道了。同样，$\pdvc SpT=-\pdvc VTp=-V\alpha$。

::anchor{id="thm-cp-cv"}
定理：一定量的物质只做体积变化的功，:term[热力学势]{id="physics.thermal-physics.thermodynamic-potential"}的二阶偏导数连续时，:term[定压热容]{id="physics.thermal-physics.constant-pressure-heat-capacity"}（heat capacity at constant pressure）和:term[定容热容]{id="physics.thermal-physics.constant-volume-heat-capacity"}之差$C_p-C_V=\frac{TV\alpha^2}{\kappa_T}$。

证明思路：沿:term[可逆过程]{id="physics.thermal-physics.reversible-process"}（reversible process）吸的热是$T\dd S$，所以$C_p=T\pdvc STp$，$C_V=T\pdvc STV$。把$S$看成$T$、$V$的函数，压强不变时$V$随$T$变，用链式法则（chain rule）把$\pdvc STp$拆成两项，多出的一项里的$\pdvc SVT$换成$\frac\alpha{\kappa_T}$；完整推导见第 5 题。

理想气体代入$\alpha=\frac1T$、$\kappa_T=\frac1p$，得$C_p-C_V=\frac{pV}T=nR$，正是[热容与焓](lesson:physics.thermal-physics.heat-capacity#thm-mayer)的:term[迈耶公式]{id="physics.thermal-physics.mayers-relation"}（Mayer's relation）。温度趋于:term[绝对零度]{id="physics.thermal-physics.absolute-zero"}（absolute zero）时，同一温度下一个系统（system）各:term[平衡态]{id="physics.thermal-physics.equilibrium-state"}（equilibrium state）的熵之差趋于零（见[热力学第三定律](lesson:physics.thermal-physics.third-law#thm-nernst)），由$\pdvc SpT=-V\alpha$，$\alpha$也趋于零。

## 几何图像

![左右两幅示意图，画的是同一个小循环。左图横轴是体积 V、纵轴是压强 p，两条向右下方弯的等温线，上面一条标 T+ΔT，下面一条标 T；两条竖直的等容线，横轴上标 V 和 V+ΔV。四条线围成一小块，涂成浅蓝色，四条边上的箭头沿顺时针方向。右图横轴是熵 S、纵轴是温度 T，两条水平的等温线，纵轴左边标 T+ΔT 和 T；两条向右上方斜的等容线，上端标 V 和 V+ΔV。四条线围成一个斜的平行四边形，也涂成浅蓝色，箭头也沿顺时针方向；两块涂色区域画得一样大](small-cycle.svg)

两条:term[等温线]{id="physics.thermal-physics.isotherm"}（isotherm）和两条等容线（isochore）围成一个小的:term[可逆循环]{id="physics.thermal-physics.reversible-process"}，箭头沿顺时针方向。左边:term[$p$-$V$图]{id="physics.thermal-physics.pv-diagram"}（$p$-$V$ diagram）上围成的面积是净功，约为$\pdvc pTV\Delta T\,\Delta V$；右边:term[$T$-$S$图]{id="physics.thermal-physics.ts-diagram"}（$T$-$S$ diagram）上围成的面积是净吸热，约为$\pdvc SVT\Delta V\,\Delta T$。一圈下来:term[内能]{id="physics.thermal-physics.internal-energy"}（internal energy）不变，两块面积相等，正是$\pdvc SVT=\pdvc pTV$。这是示意图，两块涂色区域画得一样大。

## 例题

### 例 1　水的两种摩尔热容差多少

$20\,^\circ\mathrm C$时，水的$\alpha=2.07\times10^{-4}\,\mathrm{K^{-1}}$，$\kappa_T=4.59\times10^{-10}\,\mathrm{Pa^{-1}}$，摩尔体积（molar volume）$V_{\mathrm m}=1.805\times10^{-5}\,\mathrm{m^3/mol}$，:term[定压摩尔热容]{id="physics.thermal-physics.constant-pressure-heat-capacity"}（molar heat capacity at constant pressure）$C_{p,\mathrm m}=75.3\,\mathrm{J/(mol\cdot K)}$。求$C_{p,\mathrm m}-C_{V,\mathrm m}$和:term[比热容比]{id="physics.thermal-physics.heat-capacity-ratio"}（heat capacity ratio）$\gamma$，按$0\,^\circ\mathrm C=273.15\,\mathrm K$换算。

**为什么想到这么做**：液体的:term[定容热容]{id="physics.thermal-physics.constant-volume-heat-capacity"}很难直接测：体积不变时加热，压强一般升得极快（第 1 题），容器很难承受。用上面的定理，就换成了测得出的$\alpha$和$\kappa_T$。

**推导**：对$1\,\mathrm{mol}$水，$T=293.15\,\mathrm K$，

$$
C_{p,\mathrm m}-C_{V,\mathrm m}=\frac{TV_{\mathrm m}\alpha^2}{\kappa_T}=\frac{293.15\times1.805\times10^{-5}\times(2.07\times10^{-4})^2}{4.59\times10^{-10}}\,\mathrm{J/(mol\cdot K)} ,
$$

约为$0.494\,\mathrm{J/(mol\cdot K)}$。所以$C_{V,\mathrm m}\approx74.8\,\mathrm{J/(mol\cdot K)}$，$\gamma\approx\frac{75.3}{74.8}\approx1.007$，两种:term[热容]{id="physics.thermal-physics.heat-capacity"}只差约$0.7\%$。[热容与焓](lesson:physics.thermal-physics.heat-capacity#def-heat-capacity-ratio)说常温的水$\gamma$很接近 1，这里算出了接近到什么程度；:term[理想气体]{id="physics.thermal-physics.ideal-gas"}的两种:term[摩尔热容]{id="physics.thermal-physics.molar-heat-capacity"}却差$R\approx8.3\,\mathrm{J/(mol\cdot K)}$。

## 常见误区

- 「麦克斯韦关系只对:term[理想气体]{id="physics.thermal-physics.ideal-gas"}成立。」推导只用到:term[热力学势]{id="physics.thermal-physics.thermodynamic-potential"}存在、二阶偏导数连续，一定量的物质只做体积变化的功时都成立；冰熔化时$G$不满足后一条，由$\dd G$得到的那一个不能用。例 1 的水就不是理想气体。

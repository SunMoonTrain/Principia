---
id: physics.thermal-physics.thermodynamic-potentials
title: |
  热力学势
goal: |
  会用勒让德变换由内能得到焓、亥姆霍兹自由能和吉布斯自由能，并说出它们各自的自然变量。
prerequisites: [physics.thermal-physics.entropy-increase, math.vector-calculus.legendre-transform]
minutes: 29
summary: |
  $U(S,V)$经差一个负号的勒让德变换得$H(S,p)=U+pV$、$F(T,V)=U-TS$、$G(T,p)=H-TS$，括号里是自然变量。
status: reviewed
---

## 这一节要回答的问题

由[克劳修斯不等式与熵](lesson:physics.thermal-physics.entropy#thm-fundamental-relation)的:term[热力学基本方程]{id="physics.thermal-physics.fundamental-relation"}（fundamental thermodynamic relation），:term[内能]{id="physics.thermal-physics.internal-energy"}（internal energy）$U$最自然的自变量是:term[熵]{id="physics.thermal-physics.entropy"}（entropy）$S$和体积$V$。可实验里容易控制的是:term[温度]{id="physics.thermal-physics.temperature"}（temperature）和压强（pressure），熵却很难直接调节。能不能换一个函数，用温度、压强当自变量，又不丢掉任何信息？

## 讲解

### 换一个自变量

一定量的物质只做体积变化的功时，由:term[热力学基本方程]{id="physics.thermal-physics.fundamental-relation"}$\dd U=T\dd S-p\,\dd V$，把:term[内能]{id="physics.thermal-physics.internal-energy"}写成$U(S,V)$，它的偏导数（partial derivative）就是$\pdvc USV=T$、$\pdvc UVS=-p$。:term[温度]{id="physics.thermal-physics.temperature"}$T$是体积固定时曲线$U(S)$的斜率，问题是怎样让斜率当自变量，又不丢信息。

[勒让德变换](lesson:math.vector-calculus.legendre-transform)（Legendre transform）正是这样的办法：严格凸（strictly convex）的函数由它的全部切线确定，按斜率记下每条切线的截距就够了。分析力学由:term[拉格朗日量]{id="physics.analytical-mechanics.lagrangian"}（Lagrangian）得到:term[哈密顿量]{id="physics.analytical-mechanics.hamiltonian"}（Hamiltonian），用的也是它；本节的$H$却是:term[焓]{id="physics.thermal-physics.enthalpy"}（enthalpy），$T$、$V$是温度、体积。

热学和化学里习惯差一个负号：对函数$f(x)$，直接用切线在纵轴上的截距$f-xf'(x)$，它是勒让德变换$f^*$的相反数。

### 亥姆霍兹自由能

体积固定时，曲线$U(S)$在一点的斜率是$T=\pdvc USV$，过这一点的切线在纵轴上的截距是$U-TS$，也就是$-U^*$（几何图像）。用截距代替$U$，自变量就从$S$换成了$T$。

::anchor{id="def-helmholtz"}
$F=U-TS$叫作:term[亥姆霍兹自由能]{id="physics.thermal-physics.helmholtz-free-energy"}（Helmholtz free energy），也叫自由能、亥姆霍兹函数；它是能量，不是力，化学书常写作$A$，本领域的$A$是面积。一定量的物质只做体积变化的功时，由:term[热力学基本方程]{id="physics.thermal-physics.fundamental-relation"}，$\dd F=\dd U-T\dd S-S\dd T=-S\dd T-p\,\dd V$，所以$\pdvc FTV=-S$，$\pdvc FVT=-p$。

为什么这样定义：:term[温度]{id="physics.thermal-physics.temperature"}比:term[熵]{id="physics.thermal-physics.entropy"}容易控制，$F$的自变量正是$T$和$V$。它也没丢信息：由$S=-\pdvc FTV$得$U=F+TS=F-T\pdvc FTV$，这就是[勒让德变换](lesson:math.vector-calculus.legendre-transform)第 7 题的$U=F-T\dv FT$，只是那里体积固定，没写下标。$V$只是跟着的参数，不参加变换，那一节「多个变量」里说过这种情形。

边界情况：变换要求$U$对$S$严格凸。体积不变时沿:term[可逆过程]{id="physics.thermal-physics.reversible-process"}（reversible process）吸的热$T\dd S=C_V\dd T$，$C_V$是:term[定容热容]{id="physics.thermal-physics.constant-volume-heat-capacity"}（heat capacity at constant volume），所以$\pdvc STV=\frac{C_V}T$，$\bigl(\frac{\partial^2U}{\partial S^2}\bigr)_V=\pdvc TSV=\frac T{C_V}$，只要$C_V>0$就大于零。

### 焓和吉布斯自由能

对$V$变换：$S$固定时$U$对$V$的斜率是$\pdvc UVS=-p$，截距是$U-(-p)V=U+pV$，正是[热容与焓](lesson:physics.thermal-physics.heat-capacity#def-enthalpy)定义的:term[焓]{id="physics.thermal-physics.enthalpy"}$H$。由$\dd H=\dd U+p\,\dd V+V\dd p=T\dd S+V\dd p$，它的自变量换成了$S$和$p$。只要$\pdvc pVS<0$（$S$不变时膨胀，压强降低，:term[理想气体]{id="physics.thermal-physics.ideal-gas"}（ideal gas）沿:term[绝热线]{id="physics.thermal-physics.adiabat"}（adiabat）就是这样），$U$对$V$也严格凸：$\bigl(\frac{\partial^2U}{\partial V^2}\bigr)_S=-\pdvc pVS>0$。

[热容与焓](lesson:physics.thermal-physics.heat-capacity)说，等压、只做体积变化的功时，吸的热等于$\Delta H$。这正是$\dd H=T\dd S+V\dd p$在$\dd p=0$时的样子：沿:term[可逆过程]{id="physics.thermal-physics.reversible-process"}，$T\dd S$就是吸的热。

::anchor{id="def-gibbs"}
对$U(S,V)$的$S$、$V$一起变换，得$G=U-TS+pV=H-TS$，叫作:term[吉布斯自由能]{id="physics.thermal-physics.gibbs-free-energy"}（Gibbs free energy），也叫吉布斯函数，这里的$G$不是引力常量（gravitational constant）。一定量的物质只做体积变化的功时，由:term[热力学基本方程]{id="physics.thermal-physics.fundamental-relation"}，$\dd G=-S\dd T+V\dd p$，所以$\pdvc GTp=-S$，$\pdvc GpT=V$。

为什么这样定义：许多化学反应和熔化（melting）、汽化（vaporization）都在一定的:term[温度]{id="physics.thermal-physics.temperature"}和压强下进行，$G$的自变量正是这两个。边界情况：变换要求由$T$、$p$能唯一地解出$S$、$V$。$G-F=pV$，1 标准大气压（standard atmosphere）下$1\,\mathrm{mol}$水的$pV$只有约$1.8\,\mathrm J$，常压下液体、固体的$G$和$F$相差很小；$1\,\mathrm{mol}$理想气体在$300\,\mathrm K$时$pV=RT\approx2.5\,\mathrm{kJ}$，两者就差得多。

### 热力学势与自然变量

::anchor{id="def-thermodynamic-potential"}
$U$、$H$、$F$、$G$统称:term[热力学势]{id="physics.thermal-physics.thermodynamic-potential"}（thermodynamic potential）。一定量的物质只做体积变化的功时，把它们写成$U(S,V)$、$H(S,p)$、$F(T,V)$、$G(T,p)$，括号里的变量叫作各自的:term[自然变量]{id="physics.thermal-physics.natural-variables"}（natural variables）：用自然变量写出其中一个，在偏导数存在的地方，其余的量（$T$、$p$、$S$、$V$和另外三个热力学势）都能由它和它的偏导数求出来。

为什么这样定义：对自然变量求偏导数，就得到和它配对的量（有的差一个负号）；$U(S,V)$正是$T\dd S-p\,\dd V$在[恰当方程](lesson:math.ode.exact-equations#def-exact)（exact equation）意义下的势函数（potential function）。可「热力学势」是整个词起的名，指这四个函数，不是那里的术语。

边界情况：粒子数能变时，自然变量里还要添上粒子数，由此引出:term[化学势]{id="physics.thermal-physics.chemical-potential"}（chemical potential），见[化学势与开放系统](lesson:physics.thermal-physics.chemical-potential)。在什么条件下$F$、$G$只减不增，见[自由能判据与最大功](lesson:physics.thermal-physics.free-energy-criteria)。

### 广延量与强度量

::anchor{id="def-extensive"}
把两份完全相同、处在同一:term[平衡态]{id="physics.thermal-physics.equilibrium-state"}（equilibrium state）的系统（system）合成一个，加倍的量叫作:term[广延量]{id="physics.thermal-physics.extensive-quantity"}（extensive quantity），如体积、:term[内能]{id="physics.thermal-physics.internal-energy"}、:term[熵]{id="physics.thermal-physics.entropy"}、:term[物质的量]{id="physics.thermal-physics.amount-of-substance"}（amount of substance）；不变的量叫作:term[强度量]{id="physics.thermal-physics.intensive-quantity"}（intensive quantity），如:term[温度]{id="physics.thermal-physics.temperature"}、压强、密度。

为什么要分这两类：$T\dd S$、$-p\,\dd V$都是强度量乘广延量的微小改变，从$U$出发的勒让德变换，都把广延量换成和它配对的强度量，$S$、$V$换成$T$、$p$。边界情况：两份要处在同一平衡态。[熵变的计算与熵增原理](lesson:physics.thermal-physics.entropy-increase)例 1 里两份温度不同的水混合，中间热水向冷水放了热，最后的熵比原来两份之和大。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-1, 2.5], y: [-6, 10] }
functions:
  - expr: "exp(x)"
    label: |
      $U(S)$
  - expr: "exp(s) + exp(s)*(x - s)"
    label: |
      切点处的切线
points:
  - { x: "s", y: "exp(s)" }
  - { x: 0, y: "exp(s)*(1 - s)" }
sliders:
  - name: s
    min: -0.5
    max: 1.8
    step: 0.01
    default: 1.5
    label: |
      切点处的熵$S_0$
:::

体积固定、:term[定容热容]{id="physics.thermal-physics.constant-volume-heat-capacity"}为 1 的:term[理想气体]{id="physics.thermal-physics.ideal-gas"}，单位和零点适当选取，$U=e^S$。横轴写作 x，是:term[熵]{id="physics.thermal-physics.entropy"}$S$；纵轴写作 y，是:term[内能]{id="physics.thermal-physics.internal-energy"}$U$。蓝线是$U(S)$，橙线是切点处的切线，它的斜率是那一点的:term[温度]{id="physics.thermal-physics.temperature"}$T=e^{S_0}$，在纵轴上的截距（纵轴上的圆点）是$U-TS$，也就是:term[亥姆霍兹自由能]{id="physics.thermal-physics.helmholtz-free-energy"}$F$。拖滑块，每个温度对应一条切线、一个$F$；切线合起来定下了整条曲线，换成以$T$为自变量不丢信息。

## 例题

### 例 1　单原子理想气体的$U(S,V)$

一定量的单原子:term[理想气体]{id="physics.thermal-physics.ideal-gas"}（monatomic ideal gas），由[克劳修斯不等式与熵](lesson:physics.thermal-physics.entropy)里的式子（$C_{V,\mathrm m}=\frac32R$），:term[熵]{id="physics.thermal-physics.entropy"}$S=\frac32nR\ln T+nR\ln V+\text{常数}$。把:term[内能]{id="physics.thermal-physics.internal-energy"}写成$U(S,V)$，验证$\pdvc USV=T$、$\pdvc UVS=-p$；再写出:term[亥姆霍兹自由能]{id="physics.thermal-physics.helmholtz-free-energy"}$F(T,V)$，由它求压强。

**为什么想到这么做**：$U=\frac32nRT$只和$T$有关，把$T$看成$S$、$V$的函数，用链式法则（chain rule）求偏导数；$F$按$U-TS$直接写出来，再对$V$求偏导数。

**推导**：由熵的式子，$\ln T=\frac{2S}{3nR}-\frac23\ln V+\text{常数}$，所以$U=\frac32nRT=cV^{-2/3}e^{2S/(3nR)}$（$c$是正的常数），$\pdvc TSV=\frac{2T}{3nR}$，$\pdvc TVS=-\frac{2T}{3V}$。于是

$$
\pdvc USV=\frac32nR\cdot\frac{2T}{3nR}=T ,\qquad \pdvc UVS=\frac32nR\cdot\Bigl(-\frac{2T}{3V}\Bigr)=-\frac{nRT}V=-p .
$$

$F$照定义写出来：

$$
F=U-TS=\frac32nRT-T\Bigl(\frac32nR\ln T+nR\ln V+\text{常数}\Bigr) .
$$

它对$V$的偏导数是$-\frac{nRT}V$，所以$p=-\pdvc FVT=\frac{nRT}V$，正是:term[理想气体状态方程]{id="physics.thermal-physics.ideal-gas-law"}（ideal gas law）。

## 常见误区

- 「化学书上单说的『自由能』就是:term[亥姆霍兹自由能]{id="physics.thermal-physics.helmholtz-free-energy"}。」化学反应多在一定的:term[温度]{id="physics.thermal-physics.temperature"}和压强下进行，化学书单说「自由能」时常指:term[吉布斯自由能]{id="physics.thermal-physics.gibbs-free-energy"}$G$；本领域指$F$。
- 「$\pdvc FTV=-S$，所以压强不变时也有$\pdvc FTp=-S$。」下标不能省：压强不变时升温，体积通常跟着变，由链式法则还要加上$\pdvc FVT\pdvc VTp=-p\pdvc VTp$。

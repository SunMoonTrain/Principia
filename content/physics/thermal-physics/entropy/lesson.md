---
id: physics.thermal-physics.entropy
title: |
  克劳修斯不等式与熵
goal: |
  会由克劳修斯不等式定义熵，并说明$\frac{1}{T}$是热量的积分因子。
prerequisites: [physics.thermal-physics.carnot-theorem, math.ode.exact-equations]
minutes: 30
summary: |
  循环中$\oint\frac{\delta Q}{T}\le0$（$T$是热库的温度）；熵是状态函数，沿可逆过程$\dd S=\frac{\delta Q}{T}$。
status: reviewed
---

## 这一节要回答的问题

由[热容与焓](lesson:physics.thermal-physics.heat-capacity)第 8 题，:term[热量]{id="physics.thermal-physics.heat"}（heat）和路线有关，$\delta Q$不是:term[状态函数]{id="physics.thermal-physics.state-function"}（state function）的微小改变；可:term[理想气体]{id="physics.thermal-physics.ideal-gas"}（ideal gas）的$\frac{\delta Q}T$却是。这个状态函数是什么？换成别的物质，它还存在吗？

## 讲解

### 克劳修斯不等式

设:term[热机]{id="physics.thermal-physics.heat-engine"}（heat engine）每个:term[循环]{id="physics.thermal-physics.cyclic-process"}（cyclic process）只从:term[温度]{id="physics.thermal-physics.temperature"}（temperature）为$T_{\mathrm H}$的:term[热库]{id="physics.thermal-physics.heat-reservoir"}（heat reservoir）吸热$Q_{\mathrm H}$，只向温度为$T_{\mathrm L}$的热库放热$Q_{\mathrm L}$（都取正值）。由:term[卡诺定理]{id="physics.thermal-physics.carnot-theorem"}（Carnot's theorem），它的:term[热机效率]{id="physics.thermal-physics.thermal-efficiency"}（thermal efficiency）不超过$1-\frac{T_{\mathrm L}}{T_{\mathrm H}}$，即$\frac{Q_{\mathrm H}}{T_{\mathrm H}}-\frac{Q_{\mathrm L}}{T_{\mathrm L}}\le0$，:term[可逆热机]{id="physics.thermal-physics.reversible-engine"}（reversible engine）取等号。把放热记成吸收负的:term[热量]{id="physics.thermal-physics.heat"}，$Q_1=Q_{\mathrm H}$，$Q_2=-Q_{\mathrm L}$，这就是$\frac{Q_1}{T_{\mathrm H}}+\frac{Q_2}{T_{\mathrm L}}\le0$。

::anchor{id="thm-clausius-inequality"}
定理（:term[克劳修斯不等式]{id="physics.thermal-physics.clausius-inequality"}，Clausius inequality）：系统（system）经历一个循环，其间只和温度为$T_1,\dots,T_k$的热库交换热量，从第$i$个热库吸热$Q_i$（放热时为负），那么$\sum_i\frac{Q_i}{T_i}\le0$；循环是:term[可逆过程]{id="physics.thermal-physics.reversible-process"}（reversible process）时取等号。$T_i$是热库的:term[热力学温度]{id="physics.thermal-physics.thermodynamic-temperature"}（thermodynamic temperature），过程不可逆时，它不一定是系统的温度。

证明思路：另取温度$T_0$高于各个$T_i$的热库，给每个热库$T_i$配一台工作在$T_0$和$T_i$之间的可逆热机，把系统吸走的$Q_i$送还热库$T_i$（$Q_i<0$时倒过来当:term[制冷机]{id="physics.thermal-physics.refrigerator"}（refrigerator）用）。由:term[热力学温标]{id="physics.thermal-physics.thermodynamic-temperature-scale"}（thermodynamic temperature scale）的规定，它同时从热库$T_0$吸热$\frac{T_0}{T_i}Q_i$。一个循环下来，系统和各台可逆热机都复原，热库$T_i$没有净变化，热库$T_0$放出的$T_0\sum_i\frac{Q_i}{T_i}$全部变成了功（work）；由:term[开尔文表述]{id="physics.thermal-physics.kelvin-statement"}（Kelvin statement），它不能是正的。可逆时倒过来运行，每个$Q_i$变号，同理得等号；证明见第 5 题。

系统依次接触许多热库、相邻两个的温度只差一点点时，每一小段吸热$\delta Q$，那时热库的温度是$T$，上面的和取极限就是$\oint\frac{\delta Q}T\le0$。圈表示沿整个循环把各小段的$\frac{\delta Q}T$加起来，和气体做的功$\int p\,\dd V$是同一种写法。

### 熵

:term[可逆循环]{id="physics.thermal-physics.reversible-process"}里$\oint\frac{\delta Q}T=0$。:term[平衡态]{id="physics.thermal-physics.equilibrium-state"}（equilibrium state）A、B 之间总能找到可逆路径相连；从 A 到 B 任取两条，沿一条去、沿另一条倒着回来，倒着走时$\delta Q$只变号，合起来是可逆循环，所以两条路径上的$\int_{\mathrm A}^{\mathrm B}\frac{\delta Q}T$相等。

::anchor{id="def-entropy"}
取定一个参考平衡态 O，规定平衡态 A 的:term[熵]{id="physics.thermal-physics.entropy"}（entropy）为$S_{\mathrm A}=\int_{\mathrm O}^{\mathrm A}\frac{\delta Q_{\text{可逆}}}T$，沿 O 到 A 的任一条可逆路径积分，$\delta Q_{\text{可逆}}$是沿这条路径吸的热，$T$是:term[热力学温度]{id="physics.thermal-physics.thermodynamic-temperature"}。相邻两个平衡态之间$\dd S=\frac{\delta Q_{\text{可逆}}}T$；熵的单位是$\mathrm{J/K}$。

为什么这样定义：积分和可逆路径无关，$S$只由状态决定，是:term[状态函数]{id="physics.thermal-physics.state-function"}（见[内能与热量](lesson:physics.thermal-physics.internal-energy#def-state-function)），和:term[内能]{id="physics.thermal-physics.internal-energy"}（internal energy）一样只定到差一个常数；可逆路径上:term[热库]{id="physics.thermal-physics.heat-reservoir"}和系统同温，$T$也就是系统的:term[温度]{id="physics.thermal-physics.temperature"}。推理不靠哪种物质的性质，所以任何物质都有熵。边界情况：沿:term[不可逆过程]{id="physics.thermal-physics.irreversible-process"}（irreversible process），$\frac{\delta Q}T$（$T$取热库的温度）加起来一般不等于熵变，见[熵变的计算与熵增原理](lesson:physics.thermal-physics.entropy-increase)。

### $\frac1T$是积分因子

一定量的:term[理想气体]{id="physics.thermal-physics.ideal-gas"}只做体积变化的功，:term[定容摩尔热容]{id="physics.thermal-physics.constant-volume-heat-capacity"}（molar heat capacity at constant volume）$C_{V,\mathrm m}$不随:term[温度]{id="physics.thermal-physics.temperature"}变。:term[可逆过程]{id="physics.thermal-physics.reversible-process"}是:term[准静态过程]{id="physics.thermal-physics.quasi-static-process"}（quasi-static process），由[热容与焓](lesson:physics.thermal-physics.heat-capacity#thm-cv)，沿可逆过程它吸的:term[热量]{id="physics.thermal-physics.heat"}$\delta Q=nC_{V,\mathrm m}\dd T+p\,\dd V$；除以$T$，用$pV=nRT$消去$p$：

$$
\frac{\delta Q}T=\frac{nC_{V,\mathrm m}}T\,\dd T+\frac{nR}V\,\dd V .
$$

两个系数满足$\frac{\partial}{\partial V}\Bigl(\frac{nC_{V,\mathrm m}}T\Bigr)=\frac{\partial}{\partial T}\Bigl(\frac{nR}V\Bigr)=0$；状态平面上$T>0$、$V>0$是矩形，由[恰当方程](lesson:math.ode.exact-equations#thm-exactness-test)一节的判别法，它是恰当的（exact），势函数（potential function）就是:term[熵]{id="physics.thermal-physics.entropy"}：

$$
S=nC_{V,\mathrm m}\ln T+nR\ln V+\text{常数} .
$$

所以$\frac1T$是$\delta Q$的积分因子（integrating factor，见[恰当方程](lesson:math.ode.exact-equations#def-exact-integrating-factor)），乘出来的是全微分（total differential）$\dd S$。$n=1\,\mathrm{mol}$时这就是那一节第 7 题，那里的$C_V$是这里的$C_{V,\mathrm m}$，$\delta Q$默认沿准静态过程；[热容与焓](lesson:physics.thermal-physics.heat-capacity)第 8 题的$S$就是熵。对理想气体这是算出来的；对任何物质，由:term[热力学第二定律]{id="physics.thermal-physics.second-law"}（second law of thermodynamics），$\frac{\delta Q_{\text{可逆}}}T$总是熵的微小改变。

### 热力学基本方程

::anchor{id="thm-fundamental-relation"}
定理：一定量的物质，:term[可逆过程]{id="physics.thermal-physics.reversible-process"}中只做体积变化的功时，任意两个相邻的:term[平衡态]{id="physics.thermal-physics.equilibrium-state"}之间有$\dd U=T\dd S-p\,\dd V$，这叫作:term[热力学基本方程]{id="physics.thermal-physics.fundamental-relation"}（fundamental thermodynamic relation）。

证明思路：沿一段可逆过程，$\delta Q=T\dd S$，$\delta W=p\,\dd V$，代入:term[热力学第一定律]{id="physics.thermal-physics.first-law"}（first law of thermodynamics）$\delta Q=\dd U+\delta W$即得。式中只有:term[状态函数]{id="physics.thermal-physics.state-function"}，所以不管实际走的是什么过程，只要两头是相邻的平衡态就成立；过程不可逆时，$T\dd S$、$p\,\dd V$一般不再是吸的:term[热量]{id="physics.thermal-physics.heat"}和做的功，可两者之差仍是$\dd U$。

把$U$看成$S$、$V$的函数，就能读出$\pdvc UVS=-p$和$\pdvc USV=T$，后一式取倒数就是$\pdvc SUV=\frac1T$：体积不变时加进同样一小份:term[内能]{id="physics.thermal-physics.internal-energy"}，:term[温度]{id="physics.thermal-physics.temperature"}越低，:term[熵]{id="physics.thermal-physics.entropy"}增加得越多。

### 等熵过程

::anchor{id="def-isentropic"}
:term[熵]{id="physics.thermal-physics.entropy"}保持不变的过程叫作:term[等熵过程]{id="physics.thermal-physics.isentropic-process"}（isentropic process），可逆的:term[绝热过程]{id="physics.thermal-physics.adiabatic-process"}（adiabatic process）每一小段$\delta Q=0$、$\dd S=0$，就是等熵过程。以熵$S$为横轴、:term[温度]{id="physics.thermal-physics.temperature"}$T$为纵轴的图叫作:term[$T$-$S$图]{id="physics.thermal-physics.ts-diagram"}（$T$-$S$ diagram），:term[可逆过程]{id="physics.thermal-physics.reversible-process"}中$\delta Q=T\dd S$，从左往右走时吸的热是曲线下直到$T=0$的面积，等熵过程是竖直线段。

为什么单独起名：「绝热」说的是没有:term[热量]{id="physics.thermal-physics.heat"}出入，「等熵」说的是一个:term[状态函数]{id="physics.thermal-physics.state-function"}不变，两者只在可逆时一致；只做体积变化的功、没有摩擦（friction）的准静态绝热过程可逆，$C_{V,\mathrm m}$不随温度变的:term[理想气体]{id="physics.thermal-physics.ideal-gas"}沿:term[绝热线]{id="physics.thermal-physics.adiabat"}（adiabat）的$TV^{\gamma-1}$不变（见[绝热过程](lesson:physics.thermal-physics.adiabatic-processes#thm-adiabatic)），由$\frac R{C_{V,\mathrm m}}=\gamma-1$，正是$S$不变。分析力学[浸渐不变量](lesson:physics.analytical-mechanics.adiabatic-invariants)第 7 题说缓慢的绝热过程是等熵过程，「缓慢」要理解成准静态又没有能量耗散（energy dissipation）。$T$-$S$图上看热，就像:term[$p$-$V$图]{id="physics.thermal-physics.pv-diagram"}（$p$-$V$ diagram）上看功。边界情况：叶轮慢慢搅拌绝热容器里的气体，体积不变、温度升高，熵增加了，图上曲线下有面积，它却不吸热；:term[自由膨胀]{id="physics.thermal-physics.free-expansion"}（free expansion）也绝热而熵增。

## 几何图像

![左右两幅图，横轴都是熵 S；纵轴都是温度 T，从 0 画起，横轴的高度标着 0。左图的标题是「可逆过程：从 A 到 B」，一条向右上方的蓝色曲线从圆点 A 走到圆点 B，曲线中间有箭头；曲线和横轴之间、S_A 到 S_B 的一块涂成浅蓝色，写着曲线下的面积就是吸的热。右图的标题是「没有摩擦的卡诺循环：两段等温、两段等熵」，图中是一个矩形，上边在 T_H，下边在 T_L，四个角从左上起顺时针依次是 1、2、3、4，四条边上的箭头沿顺时针方向；上边上方写着吸热 Q_H，矩形内部涂成浅绿色，写着净功 W，矩形下边到横轴之间涂成浅蓝色，写着放热 Q_L](ts-diagram.svg)

纵轴从$T=0$画起。左图：沿:term[可逆过程]{id="physics.thermal-physics.reversible-process"}从 A 到 B 吸的:term[热量]{id="physics.thermal-physics.heat"}是曲线下的面积$\int T\,\dd S$。右图：没有摩擦的:term[卡诺循环]{id="physics.thermal-physics.carnot-cycle"}（Carnot cycle）由两段:term[等温过程]{id="physics.thermal-physics.isothermal-process"}（isothermal process）和两段:term[等熵过程]{id="physics.thermal-physics.isentropic-process"}组成，是矩形，宽是吸热那段的:term[熵变]{id="physics.thermal-physics.entropy"}$\Delta S$；上边到横轴的整块是吸热$Q_{\mathrm H}=T_{\mathrm H}\Delta S$，蓝色的是放热$Q_{\mathrm L}=T_{\mathrm L}\Delta S$，一圈下来:term[内能]{id="physics.thermal-physics.internal-energy"}不变，绿色的就是净功。

## 例题

### 例 1　这样的循环可能吗

一个系统每个:term[循环]{id="physics.thermal-physics.cyclic-process"}在$400\,\mathrm K$的:term[热库]{id="physics.thermal-physics.heat-reservoir"}吸热$1000\,\mathrm J$，在$300\,\mathrm K$的热库放热$800\,\mathrm J$，不和别的热库交换:term[热量]{id="physics.thermal-physics.heat"}。这可能吗？可逆吗？只放热$700\,\mathrm J$呢？

**为什么想到这么做**：算出:term[克劳修斯不等式]{id="physics.thermal-physics.clausius-inequality"}里的$\sum\frac{Q_i}{T_i}$，看它是负、是零还是正。

**推导**：放热记成负的吸热，

$$
\frac{1000\,\mathrm J}{400\,\mathrm K}+\frac{-800\,\mathrm J}{300\,\mathrm K}\approx-0.167\,\mathrm{J/K}<0 .
$$

满足克劳修斯不等式，:term[热力学第二定律]{id="physics.thermal-physics.second-law"}不排除它；不取等号，所以不是:term[可逆循环]{id="physics.thermal-physics.reversible-process"}。它每个循环做功$200\,\mathrm J$，:term[热机效率]{id="physics.thermal-physics.thermal-efficiency"}$0.20$，低于:term[可逆热机]{id="physics.thermal-physics.reversible-engine"}的$1-\frac{300}{400}=0.25$。只放热$700\,\mathrm J$时，和是$+0.167\,\mathrm{J/K}>0$，不可能：热机效率$0.30$超过了上限。

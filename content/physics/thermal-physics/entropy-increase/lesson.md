---
id: physics.thermal-physics.entropy-increase
title: |
  熵变的计算与熵增原理
goal: |
  会计算可逆和不可逆过程中的熵变，并用熵增原理判断过程能否自发进行。
prerequisites: [physics.thermal-physics.entropy]
minutes: 30
summary: |
  熵变沿连接始末的可逆路径算；系统绝热或孤立时，熵不减少。
status: reviewed
---

## 这一节要回答的问题

气体冲进真空，既不吸热也不做功，它的:term[熵]{id="physics.thermal-physics.entropy"}（entropy）变了没有？一杯热水放凉了，能不能自己再热起来？怎样用一个量判断一个过程会不会发生？

## 讲解

### 自由膨胀的熵变

:term[自由膨胀]{id="physics.thermal-physics.free-expansion"}（free expansion）中$Q=0$、$W=0$、$\Delta U=0$（见[热力学第一定律](lesson:physics.thermal-physics.first-law#def-free-expansion)），:term[理想气体]{id="physics.thermal-physics.ideal-gas"}（ideal gas）的:term[温度]{id="physics.thermal-physics.temperature"}（temperature）不变（见[热力学第一定律](lesson:physics.thermal-physics.first-law#thm-ideal-gas-energy)）。:term[熵]{id="physics.thermal-physics.entropy"}的定义要沿:term[可逆过程]{id="physics.thermal-physics.reversible-process"}（reversible process）积分，自由膨胀连:term[准静态过程]{id="physics.thermal-physics.quasi-static-process"}（quasi-static process）都不是。好在熵是:term[状态函数]{id="physics.thermal-physics.state-function"}（state function），可以另找一条始末相同的可逆过程来算，比如在温度为$T$的:term[热库]{id="physics.thermal-physics.heat-reservoir"}（heat reservoir）里可逆地:term[等温膨胀]{id="physics.thermal-physics.isothermal-process"}（isothermal expansion）。

这条可逆过程中$\Delta U=0$，吸的热$Q_{\text{可逆}}$等于对外做的功$nRT\ln\frac{V_2}{V_1}$，所以

$$
\Delta S=\frac{Q_{\text{可逆}}}T=nR\ln\frac{V_2}{V_1}>0 .
$$

$1\,\mathrm{mol}$气体体积加倍时，熵增加$R\ln2\approx5.76\,\mathrm{J/K}$，正是[热容与焓](lesson:physics.thermal-physics.heat-capacity)第 8 题（3）沿两条路线算出的$\int\frac{\delta Q}T$。

注意$nRT\ln\frac{V_2}{V_1}$只是那条可逆过程吸的热，自由膨胀实际吸热为$0$（[热力学第一定律](lesson:physics.thermal-physics.first-law)第 8 题（3）问的就是这一点）；算熵变要用前者。

### 孤立系统与熵增原理

::anchor{id="def-isolated-system"}
和外界（surroundings）既不交换能量、也不交换物质的[系统](lesson:physics.thermal-physics.temperature#def-state-variable)（system），叫作:term[孤立系统]{id="physics.thermal-physics.isolated-system"}（isolated system），例如装在刚性、密闭、包着:term[绝热壁]{id="physics.thermal-physics.adiabatic-wall"}（adiabatic wall，见[内能与热量](lesson:physics.thermal-physics.internal-energy#def-adiabatic-process)）的容器里的气体。

为什么这样定义：把和系统打交道的:term[热库]{id="physics.thermal-physics.heat-reservoir"}、物体都算进来，总能凑成孤立系统；只要始末各部分各自处在:term[平衡态]{id="physics.thermal-physics.equilibrium-state"}（equilibrium state），就可以各走各的:term[可逆过程]{id="physics.thermal-physics.reversible-process"}，:term[总熵变]{id="physics.thermal-physics.entropy"}是各部分的熵变之和，下面的定理照样成立。边界情况：桌上的一杯热水向屋里的空气放出:term[热量]{id="physics.thermal-physics.heat"}（heat），不是孤立系统，它的熵在减少；连同整间屋子，才近似是。

::anchor{id="thm-entropy-increase"}
定理（:term[熵增原理]{id="physics.thermal-physics.entropy-increase-principle"}，principle of entropy increase，也叫熵增加原理）：系统经:term[绝热过程]{id="physics.thermal-physics.adiabatic-process"}（adiabatic process）从一个平衡态变到另一个平衡态，熵不减少：过程是可逆过程时熵不变，是:term[不可逆过程]{id="physics.thermal-physics.irreversible-process"}（irreversible process）时熵增加。孤立系统和外界不交换能量，经历的都是绝热过程，所以孤立系统的熵也不减少。

证明思路：设绝热过程把系统从平衡态 A 变到平衡态 B，再沿一条可逆过程从 B 回到 A，合成一个:term[循环]{id="physics.thermal-physics.cyclic-process"}（cyclic process）。由:term[克劳修斯不等式]{id="physics.thermal-physics.clausius-inequality"}（Clausius inequality，见[克劳修斯不等式与熵](lesson:physics.thermal-physics.entropy#thm-clausius-inequality)），绝热那一段不交换热量，可逆那一段的$\int\frac{\delta Q}T$是$S_{\mathrm A}-S_{\mathrm B}$，所以$S_{\mathrm A}-S_{\mathrm B}\le0$。可逆的绝热过程每一小段$\dd S=\frac{\delta Q}T=0$，熵不变。

不可逆时取不到等号，以气体为例：体积不变时可逆地加热，$\dd S=\frac{\delta Q}T>0$，所以体积相同时:term[温度]{id="physics.thermal-physics.temperature"}越高熵越大。要是$S_{\mathrm B}=S_{\mathrm A}$，让气体从 B 沿:term[绝热线]{id="physics.thermal-physics.adiabat"}（adiabat）准静态、无摩擦（friction）地变到 A 的体积，熵不变，就回到了 A，两段的功正好抵消，外界也复原了，原来的过程就成了可逆的。

[绝热过程](lesson:physics.thermal-physics.adiabatic-processes)第 7 题的三种膨胀都绝热，体积都变到$2V_1$。（3）准静态，是:term[等熵过程]{id="physics.thermal-physics.isentropic-process"}（isentropic process）；（1）:term[自由膨胀]{id="physics.thermal-physics.free-expansion"}、（2）突然膨胀都不可逆，熵增加，末温就比（3）高，末态落在过初态的绝热线上方。

### 熵变的计算

始末都是:term[平衡态]{id="physics.thermal-physics.equilibrium-state"}时，找一条连接它们的:term[可逆过程]{id="physics.thermal-physics.reversible-process"}来算:term[熵变]{id="physics.thermal-physics.entropy"}。:term[热容]{id="physics.thermal-physics.heat-capacity"}（heat capacity）$C$不随:term[温度]{id="physics.thermal-physics.temperature"}变的物体，依次接触温度只差一点点的:term[热库]{id="physics.thermal-physics.heat-reservoir"}，就能可逆地从$T_1$加热（或冷却）到$T_2$（见第 5 题），$\delta Q=C\,\dd T$：

$$
\Delta S=\int_{T_1}^{T_2}\frac{C\,\dd T}T=C\ln\frac{T_2}{T_1} .
$$

沿温度不变的可逆过程，$\Delta S=\frac QT$。例如[热容与焓](lesson:physics.thermal-physics.heat-capacity)例 1 里，1 标准大气压（standard atmosphere）下$1.00\,\mathrm{kg}$、$100\,^\circ\mathrm C$的水全部汽化（vaporization），熵增加约$\frac{2.26\times10^6\,\mathrm J}{373\,\mathrm K}\approx6.06\times10^3\,\mathrm{J/K}$。热库吸热$Q$（放热时为负）时温度$T$不变，不管这份热怎样传来，末态都和可逆地吸热时一样，$\Delta S_{\text{热库}}=\frac QT$。

[准静态过程与气体的功](lesson:physics.thermal-physics.quasi-static-processes)第 6 题（2）的突然膨胀，压强（pressure）从$p_1$变为$p_2$，始末温度都是$T$，气体的熵变是$nR\ln\frac{p_1}{p_2}$；气体吸的热等于那道题算出的功，热库的熵变是$-nR\bigl(1-\frac{p_2}{p_1}\bigr)$。记$x=\frac{p_1}{p_2}$，总熵变$nR\bigl(\ln x-1+\frac1x\bigr)>0$，正是那道题（3）证的不等式，[热力学第一定律](lesson:physics.thermal-physics.first-law)第 8 题（1）也用过它。

### 过程能否自发进行

参与过程的物体、:term[热库]{id="physics.thermal-physics.heat-reservoir"}合起来是一个:term[孤立系统]{id="physics.thermal-physics.isolated-system"}，它的:term[熵变]{id="physics.thermal-physics.entropy"}记作$\Delta S_{\text{总}}$。看总熵沿途怎样变：一路增加的过程能自发（spontaneous）进行，自己就能发生，快慢另说；一路不变的是:term[可逆过程]{id="physics.thermal-physics.reversible-process"}；有一段要减少的，不会发生。这和光学里的自发辐射（spontaneous emission）不是一回事。

A、B 两个物体只和对方接触，各自:term[温度]{id="physics.thermal-physics.temperature"}均匀，A 的温度$T_{\mathrm A}$高于 B 的$T_{\mathrm B}$。A 把:term[热量]{id="physics.thermal-physics.heat"}$\delta Q$传给 B，两者的总熵变是

$$
-\frac{\delta Q}{T_{\mathrm A}}+\frac{\delta Q}{T_{\mathrm B}}=\delta Q\Bigl(\frac1{T_{\mathrm B}}-\frac1{T_{\mathrm A}}\Bigr)>0 .
$$

两边温度相等时这个因子为零，总熵最大，不再变化（几何图像）：孤立系统最后到达的:term[平衡态]{id="physics.thermal-physics.equilibrium-state"}，熵在它能变到的状态里最大。一杯热水在屋里放凉，水和屋子的总熵增加；水自己再热起来，总熵就要减少，不会发生。

## 几何图像

:::anim{component="function-plot"}
range: { x: [190, 410], y: [-0.2, 0.25] }
functions:
  - expr: "ln(x/400) + k*ln((200 + (400 - x)/k)/200)"
    label: |
      总熵变$\frac{\Delta S_{\text{总}}}{C}$
points:
  - { x: "(400 + 200*k)/(1 + k)", y: "ln(((400 + 200*k)/(1 + k))/400) + k*ln(((400 + 200*k)/(1 + k))/200)" }
sliders:
  - name: k
    min: 0.5
    max: 3
    step: 0.1
    default: 1
    label: |
      B 的热容是 A 的几倍
:::

A、B 两个物体只和对方交换:term[热量]{id="physics.thermal-physics.heat"}，A 开始是$400\,\mathrm K$、:term[热容]{id="physics.thermal-physics.heat-capacity"}为$C$，B 开始是$200\,\mathrm K$、热容为$kC$。横轴写作 x，是 A 的:term[温度]{id="physics.thermal-physics.temperature"}（$\mathrm K$）；纵轴写作 y，是从开始算起的:term[总熵变]{id="physics.thermal-physics.entropy"}除以$C$。A 从$400\,\mathrm K$往左降温，蓝线升高，到两边温度相等的圆点最高；再往左要热量从低温的 A 传到高温的 B，总熵减少，即使还比开始时大，也不会发生。滑块改热容之比$k$，最高点仍在温度相等处。

## 例题

### 例 1　冷热水混合

$1.0\,\mathrm{kg}$、$80\,^\circ\mathrm C$的水和$1.0\,\mathrm{kg}$、$20\,^\circ\mathrm C$的水在绝热容器里混合，容器的:term[热容]{id="physics.thermal-physics.heat-capacity"}、水的体积变化不计，求:term[总熵变]{id="physics.thermal-physics.entropy"}。水的:term[比热容]{id="physics.thermal-physics.specific-heat-capacity"}（specific heat capacity）取$4.18\times10^3\,\mathrm{J/(kg\cdot K)}$，不随:term[温度]{id="physics.thermal-physics.temperature"}变；按$0\,^\circ\mathrm C=273.15\,\mathrm K$换算。

**为什么想到这么做**：混合是:term[不可逆过程]{id="physics.thermal-physics.irreversible-process"}，不能沿它算；可熵是:term[状态函数]{id="physics.thermal-physics.state-function"}，两份水各沿一条从初温到末温的可逆路径算，再相加。

**推导**：两份水一样多，由能量守恒（conservation of energy），末温是$50\,^\circ\mathrm C$，即$323.15\,\mathrm K$。$mc=4180\,\mathrm{J/K}$，

$$
\Delta S_{\text{总}}=mc\ln\frac{323.15}{353.15}+mc\ln\frac{323.15}{293.15}\approx(-371.1+407.3)\,\mathrm{J/K}\approx36.2\,\mathrm{J/K}>0 .
$$

热水的熵减少，冷水的熵增加得更多。

## 常见误区

- 「:term[不可逆过程]{id="physics.thermal-physics.irreversible-process"}中，系统的:term[熵]{id="physics.thermal-physics.entropy"}总是增加。」:term[熵增原理]{id="physics.thermal-physics.entropy-increase-principle"}只管:term[绝热过程]{id="physics.thermal-physics.adiabatic-process"}。例 1 的混合不可逆，热水向冷水放热，它的熵却减少了；增加的是两份水的总熵。
- 「绝热过程不吸热，$\frac QT=0$，所以熵不变。」只有可逆的绝热过程才这样；:term[自由膨胀]{id="physics.thermal-physics.free-expansion"}、焦耳（Joule）搅拌水这类不可逆的绝热过程，熵要沿:term[可逆过程]{id="physics.thermal-physics.reversible-process"}算，是增加的。

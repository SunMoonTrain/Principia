---
id: physics.thermal-physics.free-energy-criteria
title: |
  自由能判据与最大功
goal: |
  会由熵增原理推出等温等容时亥姆霍兹自由能、等温等压时吉布斯自由能只减不增，并用它们求最大功、判断过程的方向。
prerequisites: [physics.thermal-physics.thermodynamic-potentials]
minutes: 30
summary: |
  等温时$W\le-\Delta F$；不做别的功时，等温等容下$F$、等温等压下$G$只减不增。
status: reviewed
---

## 这一节要回答的问题

:term[熵增原理]{id="physics.thermal-physics.entropy-increase-principle"}（principle of entropy increase）说:term[孤立系统]{id="physics.thermal-physics.isolated-system"}（isolated system）的:term[熵]{id="physics.thermal-physics.entropy"}（entropy）不减少，可冰的熔化（melting）、许多化学反应都在恒温的环境里、一定的压强（pressure）下进行，和环境交换着:term[热量]{id="physics.thermal-physics.heat"}（heat）。这时能不能只看系统（system）自己的量，判断过程往哪边走？一个过程最多能对外做多少功（work）？

## 讲解

### 最大功

把气缸浸在:term[温度]{id="physics.thermal-physics.temperature"}（temperature）为$T$的:term[热库]{id="physics.thermal-physics.heat-reservoir"}（heat reservoir）里，缸里的气体膨胀，推着活塞举起重物。气体、热库和重物合起来是一个:term[孤立系统]{id="physics.thermal-physics.isolated-system"}，重物只是被举高，:term[熵]{id="physics.thermal-physics.entropy"}不变，可以用:term[熵增原理]{id="physics.thermal-physics.entropy-increase-principle"}。

::anchor{id="def-isothermal-isobaric"}
本节的系统都整体不动，也不和外界（surroundings）交换物质。说过程「等温」，指系统只和温度为$T$的热库交换:term[热量]{id="physics.thermal-physics.heat"}，始末都是温度为$T$的:term[平衡态]{id="physics.thermal-physics.equilibrium-state"}（equilibrium state），中间不必处在平衡态；说「等压」，指外界的压强一直是$p$，系统始末的压强也都是$p$。

为什么这样定义：下面的推导只用到始末状态和热库的熵变，化学反应中途各处的温度可以不均匀。这里的「等温」不必是:term[等温过程]{id="physics.thermal-physics.isothermal-process"}（isothermal process）：[准静态过程与气体的功](lesson:physics.thermal-physics.quasi-static-processes)第 6 题（2）里气体在热库中突然膨胀，算「等温」，却不是:term[准静态过程]{id="physics.thermal-physics.quasi-static-process"}（quasi-static process）。「等压」也不必是:term[等压过程]{id="physics.thermal-physics.isobaric-process"}（isobaric process）：推开外界的功只看外界的压强，所以只要求它全程不变，中途系统各处的压强可以不均匀。

设系统从热库吸热$Q$、对外做功$W$，系统的熵变是$\Delta S$。热库的熵变是$-\frac QT$，由熵增原理，总熵变$\Delta S_{\text{总}}=\Delta S-\frac QT\ge0$。由:term[热力学第一定律]{id="physics.thermal-physics.first-law"}（first law of thermodynamics），$Q=\Delta U+W$，于是$W\le T\Delta S-\Delta U$。始末温度都是$T$，右边正是$-\Delta(U-TS)$，即:term[亥姆霍兹自由能]{id="physics.thermal-physics.helmholtz-free-energy"}（Helmholtz free energy）的减少$-\Delta F$。

::anchor{id="thm-max-work"}
定理（最大功，maximum work）：系统等温地从一个平衡态变到另一个平衡态，对外做的功$W\le-\Delta F$；过程是:term[可逆过程]{id="physics.thermal-physics.reversible-process"}（reversible process）时取等号，$-\Delta F$就是能得到的最大功。

由熵增原理，可逆时总熵不变，上面的不等号取等号。例如:term[理想气体]{id="physics.thermal-physics.ideal-gas"}（ideal gas）等温地从$V_1$膨胀到$V_2$，$\Delta U=0$，$\Delta S=nR\ln\frac{V_2}{V_1}$，所以$-\Delta F=nRT\ln\frac{V_2}{V_1}$，正是准静态等温膨胀做的功；突然膨胀时外界得到的功少（上面那道题的（3））。「自由能」这个名字说的就是：等温时$F$减少多少，最多就能拿出多少功。

### 亥姆霍兹自由能判据

::anchor{id="thm-helmholtz-criterion"}
定理（亥姆霍兹自由能判据，Helmholtz free energy criterion）：等温、体积不变、除体积变化的功以外不做别的功时，系统的:term[亥姆霍兹自由能]{id="physics.thermal-physics.helmholtz-free-energy"}只减不增；系统最后到达的:term[平衡态]{id="physics.thermal-physics.equilibrium-state"}，$F$在它能变到的状态里最小。

证明思路：这时$W=0$，由最大功的定理，$\Delta F\le0$。又$Q=\Delta U$，:term[总熵变]{id="physics.thermal-physics.entropy"}是$\Delta S-\frac{\Delta U}T=-\frac{\Delta F}T$：$F$一路减少的过程，总熵一路增加，能自发（spontaneous）进行。:term[孤立系统]{id="physics.thermal-physics.isolated-system"}最后到达的平衡态，总熵在能变到的状态里最大（见[熵变的计算与熵增原理](lesson:physics.thermal-physics.entropy-increase)），系统的$F$也就最小。

边界情况：外界对系统做别的功时，$F$可以增加，例如给蓄电池（storage battery）充电。

等温等容、不做别的功时，$F$像力学里的势能：系统朝$F$减小的方向变，最后停在能变到的状态里$F$最小处，就像有空气阻力（air resistance）时小球最后停在碗底、势能最低处的:term[稳定平衡]{id="physics.newtonian-mechanics.stable-equilibrium"}（stable equilibrium）。

### 吉布斯自由能判据

等温等压时，系统对外做的功分成两份：推开外界的$p\Delta V$，和别的功$W_{\text{其他}}$，如电功。外界的压强一直是$p$，前一份的算法和[准静态过程与气体的功](lesson:physics.thermal-physics.quasi-static-processes)第 6 题（2）一样。由最大功的定理，$p\Delta V+W_{\text{其他}}\le-\Delta F$；始末压强都是$p$，$\Delta F+p\Delta V=\Delta(F+pV)$，正是:term[吉布斯自由能]{id="physics.thermal-physics.gibbs-free-energy"}（Gibbs free energy）$G=F+pV$的改变$\Delta G$。

::anchor{id="thm-gibbs-criterion"}
定理（吉布斯自由能判据，Gibbs free energy criterion）：等温等压时，系统除推开外界以外对外做的功$W_{\text{其他}}\le-\Delta G$，过程是:term[可逆过程]{id="physics.thermal-physics.reversible-process"}时取等号；不做别的功时，$G$只减不增，系统最后到达的:term[平衡态]{id="physics.thermal-physics.equilibrium-state"}，$G$在它能变到的状态里最小。

证明思路：$W_{\text{其他}}=0$时$\Delta G\le0$；这时$Q=\Delta U+p\Delta V=\Delta H$，:term[总熵变]{id="physics.thermal-physics.entropy"}是$-\frac{\Delta G}T$，其余和上一个定理一样。

为什么用$G$：实验里:term[温度]{id="physics.thermal-physics.temperature"}比熵容易控制，敞口容器里的压强就是大气压（atmospheric pressure），冰的熔化、化学反应多用$G$判断。始末温度都是$T$时，$\Delta G=\Delta H-T\Delta S$，:term[焓]{id="physics.thermal-physics.enthalpy"}（enthalpy）的变化和熵的变化一起决定方向。燃料电池（fuel cell）连同用掉的燃料、氧气，在一定的温度、压强下靠化学反应最多能对外做$-\Delta G$的电功。

## 几何图像

:::anim{component="function-plot"}
range: { x: [253, 293], y: [-1500, 1500] }
functions:
  - expr: "-41*(x - 273.15)"
    label: |
      冰
  - expr: "-63*(x - 273.15)"
    label: |
      水
points:
  - { x: 273.15, y: 0 }
:::

1 标准大气压（standard atmosphere）下每摩尔冰和水的:term[吉布斯自由能]{id="physics.thermal-physics.gibbs-free-energy"}随:term[温度]{id="physics.thermal-physics.temperature"}的变化。由$\pdvc GTp=-S$，直线的斜率是每摩尔的:term[熵]{id="physics.thermal-physics.entropy"}的相反数，近似当常数，取手册上的值：冰约$41$、水约$63\,\mathrm{J/(mol\cdot K)}$。两者的$G$在$273.15\,\mathrm K$相等（例 1），这个共同的值取作零；熵的零点换一种取法，两条线一起倾斜，交点和谁高谁低都不变。

横轴写作 x，是温度（$\mathrm K$）；纵轴写作 y，是每摩尔的$G$（$\mathrm J$）。蓝线是冰，橙线是水；按手册的值，水的熵大，线更陡。两线交于圆点：高于$273.15\,\mathrm K$时水的$G$低，冰会熔化；低于它时冰的$G$低，水会结冰。

## 例题

### 例 1　冰和水，哪边稳定

1 标准大气压下，每摩尔冰在$0\,^\circ\mathrm C$熔化时吸热$6.01\,\mathrm{kJ}$。近似认为冰变成水时每摩尔:term[焓]{id="physics.thermal-physics.enthalpy"}的增加$\Delta H$、:term[熵]{id="physics.thermal-physics.entropy"}的增加$\Delta S$都不随:term[温度]{id="physics.thermal-physics.temperature"}变，按$0\,^\circ\mathrm C=273.15\,\mathrm K$换算。求$-10\,^\circ\mathrm C$、$0\,^\circ\mathrm C$、$10\,^\circ\mathrm C$时每摩尔冰变成水的$\Delta G$，判断冰和水哪一边稳定。

**为什么想到这么做**：温度、压强都固定，用:term[吉布斯自由能]{id="physics.thermal-physics.gibbs-free-energy"}判断；始末温度相同时$\Delta G=\Delta H-T\Delta S$，求出$\Delta H$、$\Delta S$就行。

**推导**：压强不变、只做体积变化的功时，吸的:term[热量]{id="physics.thermal-physics.heat"}等于焓的增加（见[热容与焓](lesson:physics.thermal-physics.heat-capacity#def-enthalpy)），$\Delta H=6010\,\mathrm J$。$0\,^\circ\mathrm C$时冰和水能一直共存，由吉布斯自由能判据，这时$\Delta G=0$，所以$\Delta S=\frac{6010\,\mathrm J}{273.15\,\mathrm K}\approx22.0\,\mathrm{J/K}$。于是

$$
\Delta G=\Delta H-T\Delta S=6010\,\mathrm J\times\Bigl(1-\frac T{273.15\,\mathrm K}\Bigr) .
$$

$-10\,^\circ\mathrm C$时$\Delta G\approx+220\,\mathrm J$，冰稳定，水会结冰；$0\,^\circ\mathrm C$时$\Delta G=0$，冰和水共存；$10\,^\circ\mathrm C$时$\Delta G\approx-220\,\mathrm J$，冰会熔化。熔化要吸热，可温度高时$T\Delta S$更大，盖过了$\Delta H$。

## 常见误区

- 「$\Delta G<0$的过程很快就会发生。」判据只管往哪边变，不管多快：常温常压下金刚石变成石墨的$\Delta G<0$，可几乎看不出变化。
- 「等温等压下$G$减少的过程，系统的:term[熵]{id="physics.thermal-physics.entropy"}一定增加。」例 1 中$-10\,^\circ\mathrm C$的水结冰，$G$减少，熵也减少；结冰放出的:term[热量]{id="physics.thermal-physics.heat"}让:term[热库]{id="physics.thermal-physics.heat-reservoir"}的熵增加得更多，增加的是总熵。

---
id: physics.thermal-physics.second-law
title: |
  热力学第二定律
goal: |
  会叙述开尔文表述和克劳修斯表述并证明它们等价，并用它们判断一个过程是否可逆。
prerequisites: [physics.thermal-physics.heat-engines]
minutes: 30
summary: |
  开尔文表述与克劳修斯表述等价；摩擦生热和有限温差传热不可逆。
status: reviewed
---

## 这一节要回答的问题

能量守恒（conservation of energy）不禁止轮船只从海水吸热、全部变成功（work），也不禁止:term[热量]{id="physics.thermal-physics.heat"}（heat）自己从冷藏室流到更热的厨房。为什么这些事不会发生？怎样判断一个过程能不能倒回去？

## 讲解

### 开尔文表述

:term[热机]{id="physics.thermal-physics.heat-engine"}（heat engine）都要向:term[低温热库]{id="physics.thermal-physics.heat-reservoir"}（heat reservoir）放热。:term[理想气体]{id="physics.thermal-physics.ideal-gas"}（ideal gas）在热库里:term[等温膨胀]{id="physics.thermal-physics.isothermal-process"}（isothermal expansion），倒是把吸的热全部变成了功，可气体变大了。只靠一个热库，能不能一遍遍地这样做？

::anchor{id="thm-kelvin"}
经验表明，不可能从单一热库吸热，使之完全变成功，而不引起别的变化。这是:term[热力学第二定律]{id="physics.thermal-physics.second-law"}（second law of thermodynamics）的:term[开尔文表述]{id="physics.thermal-physics.kelvin-statement"}（Kelvin statement），也叫开尔文-普朗克表述（Kelvin–Planck statement）；违反它的机器叫作第二类永动机（perpetual motion machine of the second kind）。

为什么单列为定律：第二类永动机不违反能量守恒，:term[热力学第一定律]{id="physics.thermal-physics.first-law"}（first law of thermodynamics）禁止:term[第一类永动机]{id="physics.thermal-physics.perpetual-motion-first-kind"}（perpetual motion machine of the first kind），却禁止不了它；[热力学第一定律](lesson:physics.thermal-physics.first-law#def-perpetual-motion)一节说「原因见热力学第二定律」的正是第二类永动机。边界情况：「而不引起别的变化」少不了，上面的等温膨胀就是例子。

只从海水吸热、全部变成功的船用发动机和:term[热机效率]{id="physics.thermal-physics.thermal-efficiency"}（thermal efficiency）为 1 的热机，都是第二类永动机，造不成；所以热机必须向低温热库放热，$Q_{\mathrm L}>0$，$\eta<1$。[绝热过程](lesson:physics.thermal-physics.adiabatic-processes)第 8 题用开尔文表述证明了两条:term[绝热线]{id="physics.thermal-physics.adiabat"}（adiabat）不能相交。

### 克劳修斯表述

::anchor{id="thm-clausius"}
不可能使:term[热量]{id="physics.thermal-physics.heat"}从低温物体传到高温物体，而不引起别的变化。这是:term[热力学第二定律]{id="physics.thermal-physics.second-law"}的:term[克劳修斯表述]{id="physics.thermal-physics.clausius-statement"}（Clausius statement）。

为什么这样说：热量从高温物体传到低温物体，[内能与热量](lesson:physics.thermal-physics.internal-energy#def-heat)已当实验事实写过；反过来不行，热量不会自发地（spontaneously）从低温物体传到高温物体。边界情况：冰箱把热量从冷藏室送到更热的厨房，代价是压缩机（compressor）做功，这就是「别的变化」。

### 两种表述等价

::anchor{id="thm-equivalence"}
定理：:term[开尔文表述]{id="physics.thermal-physics.kelvin-statement"}和:term[克劳修斯表述]{id="physics.thermal-physics.clausius-statement"}等价。违反其中一种的装置配上普通的:term[热机]{id="physics.thermal-physics.heat-engine"}或:term[制冷机]{id="physics.thermal-physics.refrigerator"}（refrigerator），就能违反另一种。

证明思路：设违反克劳修斯表述的装置每个:term[循环]{id="physics.thermal-physics.cyclic-process"}（cyclic process）把:term[热量]{id="physics.thermal-physics.heat"}$Q_{\mathrm L}$从:term[低温热库]{id="physics.thermal-physics.heat-reservoir"}送到高温热库，此外什么都不变。再让一台热机在这两个热库之间工作，调好大小，使它每个循环吸热$Q_{\mathrm H}$、做功$W$、放热也是$Q_{\mathrm L}$（$Q_{\mathrm H}$、$Q_{\mathrm L}$都取正值）。合起来低温热库没有变化，高温热库放出的$Q_{\mathrm H}-Q_{\mathrm L}=W$全部变成了功，此外没有变化，违反开尔文表述（左图）。

反过来，设某台机器每个循环从高温热库吸热$Q$、全部变成功$W=Q$，违反开尔文表述。用这份功带动一台制冷机，从低温热库吸热$Q_{\mathrm L}$，向高温热库放热$Q_{\mathrm L}+W$。合起来外界（surroundings）不做功，高温热库净得到的$Q_{\mathrm L}+W-Q=Q_{\mathrm L}$来自低温热库，此外没有变化，违反克劳修斯表述（右图）。

### 可逆过程与不可逆过程

气体:term[自由膨胀]{id="physics.thermal-physics.free-expansion"}（free expansion）以后，在原来:term[温度]{id="physics.thermal-physics.temperature"}（temperature）的:term[热库]{id="physics.thermal-physics.heat-reservoir"}里用活塞能把它压回原状，可外界做了功，热库多得了热；没有摩擦（friction）的:term[卡诺循环]{id="physics.thermal-physics.carnot-cycle"}（Carnot cycle）却能倒过来运行，正着、倒着各转一圈，不留痕迹。

::anchor{id="def-reversible"}
[系统](lesson:physics.thermal-physics.temperature#def-state-variable)（system）经过一个过程以后，如果还能用别的过程使系统和外界都完全复原，原来的过程就叫作:term[可逆过程]{id="physics.thermal-physics.reversible-process"}（reversible process），否则叫作:term[不可逆过程]{id="physics.thermal-physics.irreversible-process"}（irreversible process）。

为什么这样定义：只让系统复原并不难，难的是外界也不留痕迹，:term[第二定律]{id="physics.thermal-physics.second-law"}管的正是这一点。热现象里，可逆过程必须是:term[准静态过程]{id="physics.thermal-physics.quasi-static-process"}（quasi-static process），没有摩擦一类的能量耗散（energy dissipation），也不隔着有限的（不趋于零的）温差传热；没有耗散的单摆来回摆这样纯粹的力学运动也可逆，不在此列。准静态却不一定可逆：活塞有摩擦时，慢慢推进再拉回，摩擦生的热收不回来（证明见第 5 题）。光学的光路可逆（principle of reversibility）是另一回事。

::anchor{id="def-reversible-engine"}
整个:term[循环]{id="physics.thermal-physics.cyclic-process"}都是可逆过程的:term[热机]{id="physics.thermal-physics.heat-engine"}，叫作:term[可逆热机]{id="physics.thermal-physics.reversible-engine"}（reversible engine）。

为什么这样定义：走过可逆过程的任一小段后，接着走完全程、复原，再走到这段的起点，相当于沿原路倒走这段，:term[热量]{id="physics.thermal-physics.heat"}和功只改变正负；所以可逆热机倒过来就是:term[制冷机]{id="physics.thermal-physics.refrigerator"}，[卡诺定理与热力学温标](lesson:physics.thermal-physics.carnot-theorem)要用这一点。没有摩擦的:term[卡诺热机]{id="physics.thermal-physics.carnot-engine"}（Carnot engine）是可逆热机，实际的热机都不可逆。

用两种表述判断：摩擦把功变成热传给周围，要复原就得从周围这个热库吸热、全部变成功，此外没有变化，违反:term[开尔文表述]{id="physics.thermal-physics.kelvin-statement"}，所以滑动摩擦生的:term[内能]{id="physics.thermal-physics.internal-energy"}（internal energy）不会自己变回动能（kinetic energy，[势能与机械能守恒](lesson:physics.newtonian-mechanics.potential-energy)第 8 题）。隔着有限温差的:term[热传导]{id="physics.thermal-physics.heat-conduction"}（heat conduction），要复原就违反:term[克劳修斯表述]{id="physics.thermal-physics.clausius-statement"}；自由膨胀见例 1。

## 几何图像

![左右两幅图，每幅上方是温度为 T_H 的高温热库，下方是温度为 T_L 的低温热库，中间一个虚线框把两台机器框在一起。左图的标题是：违反克劳修斯表述的装置和一台热机。左边的虚线圆是装置，蓝色箭头 Q_L 从低温热库进入装置，再从装置进入高温热库；右边的实线圆是热机，蓝色箭头 Q_H 从高温热库进入热机，绿色箭头 W 向右穿出虚线框，蓝色箭头 Q_L 从热机进入低温热库。右图的标题是：违反开尔文表述的机器和一台制冷机。左边的虚线圆是机器，蓝色箭头 Q 从高温热库进入机器，绿色箭头 W 从机器流向右边的实线圆，那是制冷机；蓝色箭头 Q_L 从低温热库进入制冷机，蓝色箭头 Q_L + W 从制冷机进入高温热库。箭头长短不按比例](kelvin-clausius.svg)

两幅图依次对应证明的两半：左图合起来只从:term[高温热库]{id="physics.thermal-physics.heat-reservoir"}吸热、全部变成功，右图合起来把:term[热量]{id="physics.thermal-physics.heat"}从低温热库送到高温热库。蓝色是热量，绿色是功，长短不按比例。

## 例题

### 例 1　自由膨胀不可逆

用:term[开尔文表述]{id="physics.thermal-physics.kelvin-statement"}证明:term[理想气体]{id="physics.thermal-physics.ideal-gas"}的:term[自由膨胀]{id="physics.thermal-physics.free-expansion"}是:term[不可逆过程]{id="physics.thermal-physics.irreversible-process"}。

**为什么想到这么做**：假设它倒得回去，看能不能拼出第二类永动机。

**推导**：自由膨胀中$Q=0$、$W=0$，外界毫无变化；假如它可逆，就有过程能把气体送回原状、外界仍毫无变化。自由膨胀时:term[内能]{id="physics.thermal-physics.internal-energy"}不变，理想气体的:term[温度]{id="physics.thermal-physics.temperature"}也就不变（见[热力学第一定律](lesson:physics.thermal-physics.first-law#thm-ideal-gas-energy)），设为$T$。

让气体从原状出发，在温度为$T$的:term[热库]{id="physics.thermal-physics.heat-reservoir"}里准静态地:term[等温膨胀]{id="physics.thermal-physics.isothermal-process"}到同一个末态，内能不变，吸的热全部变成了正功，再用那个过程回到原状。合起来是只从一个热库吸热、全部变成功的:term[循环]{id="physics.thermal-physics.cyclic-process"}，此外毫无变化，违反开尔文表述，所以自由膨胀不可逆。

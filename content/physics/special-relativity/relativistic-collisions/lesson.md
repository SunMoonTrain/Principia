---
id: physics.special-relativity.relativistic-collisions
title: |
  相对论碰撞与衰变
goal: |
  会用四维动量守恒和不变质量分析衰变和碰撞，并求产生新粒子的阈能。
prerequisites: [physics.special-relativity.four-momentum]
minutes: 35
summary: |
  不变质量在各惯性系相同，用它算衰变产物的能量和反应的阈能。
status: reviewed
---

## 这一节要回答的问题

加速器里，质子打在静止的质子上，能量够大时会产生原来没有的粒子，新粒子的质量来自碰撞的能量。要产生一个反质子（antiproton），打来的质子至少要多大的能量？粒子衰变时，产物的能量又由什么决定？

## 讲解

### 不变质量

一个质点的:term[四维动量]{id="physics.special-relativity.four-momentum"}（four-momentum）满足$P\cdot P=m^2c^2$。对一组粒子，把它们的四维动量加起来，也可以问这个和的「长度」。

::anchor{id="def-invariant-mass"}
一组粒子的四维动量之和$P=\sum_iP_i$满足$P\cdot P=M^2c^2$，即$Mc^2=\sqrt{E_{\text{总}}^2-p_{\text{总}}^2c^2}$，$M$叫作这组粒子的:term[不变质量]{id="physics.special-relativity.invariant-mass"}（invariant mass）。

为什么这样定义：$P\cdot P$是:term[洛伦兹标量]{id="physics.special-relativity.lorentz-scalar"}（Lorentz scalar），所以$M$在每个:term[惯性系]{id="physics.special-relativity.inertial-frame"}（inertial frame）里都一样；四维动量守恒，反应前后$P$不变，$M$也就不变。一个粒子的不变质量就是它的质量；一个整体静止的物体，$Mc^2$是它的总能量，这正是[质能关系](lesson:physics.special-relativity.mass-energy)里物体的质量。边界情况：$M$一般不等于各粒子质量之和，两个光子的质量都是零，它们的不变质量却可以不为零（见 p1）。

::anchor{id="def-zero-momentum-frame"}
一组粒子总动量为零的惯性系，叫作这组粒子的:term[零动量系]{id="physics.special-relativity.zero-momentum-frame"}（zero-momentum frame），也常叫质心系（center-of-mass frame）；它相对实验室的速度是$\vb v=\frac{\vb p_{\text{总}}c^2}{E_{\text{总}}}$。

为什么这样定义：把总四维动量$P$当成一个质量为$M$的粒子的四维动量，按:term[能量-动量关系]{id="physics.special-relativity.energy-momentum-relation"}（energy–momentum relation）里的$\vb u=\frac{\vb pc^2}{E}$，这个「粒子」的速度就是上面的$\vb v$，在随它运动的惯性系里总动量为零。零动量系里总能量是$Mc^2$，碰撞能拿来产生新粒子的能量都在这里面。边界情况：只要$P$是:term[类时]{id="physics.special-relativity.timelike"}（timelike）的（有一个粒子有质量，或者几个光子不全同向），零动量系就存在；单个光子没有零动量系。

::anchor{id="thm-invariant-mass-bound"}
定理（不变质量不小于质量之和）：一组有质量的粒子，$M\ge\sum_im_i$；等号当且仅当所有粒子的速度相同。

证明：在零动量系里，第$i$个粒子的能量是$\gamma_i'm_ic^2$，$\gamma_i'\ge1$，所以$Mc^2=\sum_i\gamma_i'm_ic^2\ge\sum_im_ic^2$。等号当且仅当每个$\gamma_i'=1$，即所有粒子在零动量系里都静止，也就是它们的速度相同。

### 两体衰变

::anchor{id="thm-two-body-decay"}
定理（两体衰变）：静止的粒子 A（质量$M$）衰变（decay）成两个粒子 B、C（质量$m_B$、$m_C$）时，B 的能量$E_B=\frac{(M^2+m_B^2-m_C^2)c^2}{2M}$，C 的能量同理；两个产物的动量大小相等、方向相反。

证明：由:term[四维动量]{id="physics.special-relativity.four-momentum"}守恒，$P_C=P_A-P_B$。两边和自己作内积：$m_C^2c^2=M^2c^2-2P_A\cdot P_B+m_B^2c^2$。A 静止，$P_A=(Mc,0,0,0)$，$P_A\cdot P_B=ME_B$，代入解出$E_B$。A 的动量为零，所以 B、C 的动量大小相等、方向相反。

所以两体衰变的产物有确定的能量：静止的$\pi^+$介子（positive pion）衰变成缪子（muon）和中微子（neutrino），所有缪子的能量都一样（例 1）。如果 A 在实验室里以速度$v$运动，B 在 A 的静止系里沿各个方向飞出、动量大小都是$p^*$，到了实验室里，它的动量端点落在一个椭圆上：沿运动方向拉长$\gamma$倍，又整体前移（见几何图像）。

### 阈能

::anchor{id="def-threshold-energy"}
粒子 a 打在静止的粒子 b 上产生一组新的粒子，a 至少要有的能量叫作这个反应的:term[阈能]{id="physics.special-relativity.threshold-energy"}（threshold energy）。

::anchor{id="thm-threshold"}
定理（阈能）：质量为$m_a$的粒子打在静止的、质量为$m_b$的粒子上，要产生质量之和为$M_f$的一组粒子，a 的能量至少是$E_a=\frac{(M_f^2-m_a^2-m_b^2)c^2}{2m_b}$。

证明：反应前的总:term[四维动量]{id="physics.special-relativity.four-momentum"}$P=P_a+P_b$，$P\cdot P=m_a^2c^2+m_b^2c^2+2P_a\cdot P_b$，而 b 静止，$P_a\cdot P_b=m_bE_a$。反应后这组粒子的:term[不变质量]{id="physics.special-relativity.invariant-mass"}不小于$M_f$，不变质量又在反应前后相同，所以$m_a^2c^2+m_b^2c^2+2m_bE_a\ge M_f^2c^2$，解出$E_a$的下限。取等号时，产物在:term[零动量系]{id="physics.special-relativity.zero-momentum-frame"}里都静止，在实验室里以同一个速度一起飞走。

为什么阈能比新粒子静止时的能量大得多：动量必须守恒，打来的粒子带着动量，产物不能停在实验室里，大部分能量变成了它们一起飞走的动能。两束粒子迎面对撞时，实验室就是零动量系，全部能量都能用来产生新粒子，所以高能物理多用对撞机（collider）。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-1.5, 6], y: [-2.25, 2.25] }
functions:
  - expr: "sqrt(1 - ((x - b/(0.6*sqrt(1 - b^2)))*sqrt(1 - b^2))^2)"
    label: |
      产物动量的端点（上半）
  - expr: "-sqrt(1 - ((x - b/(0.6*sqrt(1 - b^2)))*sqrt(1 - b^2))^2)"
    label: |
      产物动量的端点（下半）
  - expr: "x*0.6*sqrt(1 - b^2)/sqrt(b^2 - 0.36)"
    label: |
      最大飞出角
points:
  - { x: "0", y: "0" }
sliders:
  - name: b
    min: 0
    max: 0.9
    step: 0.01
    default: 0.75
    label: |
      母粒子的速度$v/c$
:::

图上是衰变产物 B 在实验室里的动量$(p_x,p_y)$，以 B 在母粒子静止系里的动量大小$p^*$为单位；那里 B 的速率取$0.6c$。母粒子静止时，端点画出单位圆，B 朝各个方向飞的机会一样。母粒子越快，椭圆越往前移、越长；速度超过$0.6c$后，原点落到椭圆外面，所有产物都朝前飞，飞出方向和运动方向的夹角不超过那条切线给出的最大值。

## 例题

### 例 1　$\pi^+$介子衰变出的缪子

静止的$\pi^+$介子衰变：$\pi^+\to\mu^++\nu_\mu$。$m_\pi c^2=139.570\,\mathrm{MeV}$，$m_\mu c^2=105.658\,\mathrm{MeV}$，中微子的质量可以当作零。求缪子的能量、动能、动量和速率。

**为什么想到这么做**：这是两体衰变，直接用定理；中微子当作:term[无质量粒子]{id="physics.special-relativity.massless-particle"}（massless particle）。

**推导**：$E_\mu=\frac{(m_\pi^2+m_\mu^2)c^2}{2m_\pi}=\frac{139.570^2+105.658^2}{2\times139.570}\,\mathrm{MeV}\approx109.778\,\mathrm{MeV}$，动能$E_\mu-m_\mu c^2\approx4.120\,\mathrm{MeV}$。中微子的能量等于它的动量乘$c$，也等于缪子的动量乘$c$：$p_\mu c=m_\pi c^2-E_\mu\approx29.79\,\mathrm{MeV}$。缪子的速率$\frac{p_\mu c}{E_\mu}c\approx0.271c$；每个这样产生的缪子都有同样的动能，探测器里它们的径迹一样长。

### 例 2　产生反质子的阈能

质子打在静止的质子上：$\mathrm p+\mathrm p\to\mathrm p+\mathrm p+\mathrm p+\bar{\mathrm p}$。求入射质子的:term[阈能]{id="physics.special-relativity.threshold-energy"}和对应的动能。如果改成两束质子以相同的速率迎面对撞，每个质子至少要多大的动能？

**为什么想到这么做**：产物是四个质量为$m_p$的粒子，$M_f=4m_p$，代入阈能定理。对撞时实验室就是:term[零动量系]{id="physics.special-relativity.zero-momentum-frame"}，产物可以全部静止。

**推导**：$E_a=\frac{(16-1-1)m_p^2c^2}{2m_p}=7m_pc^2$，动能$6m_pc^2\approx6\times938.3\,\mathrm{MeV}\approx5.63\,\mathrm{GeV}$，而新产生的一对质子、反质子静止时的能量只有$2m_pc^2\approx1.88\,\mathrm{GeV}$。迎面对撞时，两个质子各带动能$K$，产物全部静止就行：$2(m_pc^2+K)=4m_pc^2$，$K=m_pc^2\approx0.94\,\mathrm{GeV}$。

伯克利（Berkeley）的质子同步加速器（proton synchrotron）Bevatron 就是按这个阈能设计的，能把质子加速到约$6\,\mathrm{GeV}$。1955 年，张伯伦（Owen Chamberlain）、塞格雷（Emilio Segrè）等人用它的质子打铜靶，找到了反质子，两人因此获得 1959 年的诺贝尔物理学奖。

## 常见误区

- 「:term[不变质量]{id="physics.special-relativity.invariant-mass"}等于各粒子的质量之和。」它一般更大，多出的部分来自粒子在:term[零动量系]{id="physics.special-relativity.zero-momentum-frame"}里的动能；只有各粒子速度相同时才相等。
- 「两个光子都没有质量，它们合起来也没有质量。」两个方向不同的光子，不变质量不为零；一个静止的$\pi^0$介子衰变成两个光子，这两个光子的不变质量就是$\pi^0$的质量。
- 「产生一对新粒子，只要提供它们静止时的能量就够了。」打静止靶时还要满足动量守恒，产物必须带着动能飞走，所需的能量比这大得多（例 2）。
- 「单个光子在真空里能变成一对正负电子。」单个光子的不变质量是零，而一对正负电子的不变质量至少是$2m_e$，所以必须有原子核之类的第三者在旁边吸收动量。

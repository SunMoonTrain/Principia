---
id: physics.thermal-physics.van-der-waals
title: |
  范德瓦耳斯气体与临界点
goal: |
  会用范德瓦耳斯方程描述实际气体，并求出它的临界点。
prerequisites: [physics.thermal-physics.phase-transitions]
minutes: 29
summary: |
  范德瓦耳斯方程$\bigl(p+\frac{an^2}{V^2}\bigr)(V-nb)=nRT$的临界点是$V_{\mathrm c}=3nb$、$p_{\mathrm c}=\frac a{27b^2}$、$T_{\mathrm c}=\frac{8a}{27Rb}$。
status: reviewed
---

## 这一节要回答的问题

压强（pressure）很大、:term[温度]{id="physics.thermal-physics.temperature"}（temperature）很低时，实际气体（real gas）偏离$pV=nRT$，还会液化（liquefaction）。能不能在:term[状态方程]{id="physics.thermal-physics.equation-of-state"}（equation of state）里补上分子的大小和分子之间的吸引，让它连液化也描述出来？这样的方程，:term[临界点]{id="physics.thermal-physics.critical-point"}（critical point）在哪里？

## 讲解

### 实际气体的等温线

安德鲁斯（Thomas Andrews）测过二氧化碳的:term[等温线]{id="physics.thermal-physics.isotherm"}（isotherm）。:term[温度]{id="physics.thermal-physics.temperature"}在:term[三相点]{id="physics.thermal-physics.triple-point"}（triple point，约$-56.6\,^\circ\mathrm C$）和$31.0\,^\circ\mathrm C$之间时，压缩到一定程度出现液体（室温下约$6\times10^6\,\mathrm{Pa}$，见[理想气体状态方程](lesson:physics.thermal-physics.ideal-gas-law)）；再压缩，压强不变、体积变小，等温线上是一段水平线，压强就是这个温度下的:term[饱和蒸气压]{id="physics.thermal-physics.saturated-vapor-pressure"}（saturated vapor pressure）；全部液化以后，压强陡升。$31.0\,^\circ\mathrm C$以上不会液化，等温线上没有这段水平线；$31.0\,^\circ\mathrm C$正是二氧化碳的:term[临界温度]{id="physics.thermal-physics.critical-temperature"}（critical temperature，见[相变与克拉珀龙方程](lesson:physics.thermal-physics.phase-transitions#def-critical-point)）。:term[理想气体]{id="physics.thermal-physics.ideal-gas"}（ideal gas）的等温线画不出这些。

### 范德瓦耳斯方程

从分子运动解释$pV=nRT$时，分子被想成质点，除了碰撞的瞬间互不作用（见[气体动理论](lesson:physics.thermal-physics.kinetic-theory#def-ideal-gas-model)）；气体稠密时，这两条都不成立（[理想气体状态方程](lesson:physics.thermal-physics.ideal-gas-law)第 7 题）。一是分子有大小：能自由活动的体积比容积$V$小，记作$V-nb$，其中$n$是:term[物质的量]{id="physics.thermal-physics.amount-of-substance"}（amount of substance），那道题里的$V_0$就是$nb$；它让压强变大（[气体动理论](lesson:physics.thermal-physics.kinetic-theory)第 8 题（3））。

二是分子之间有吸引：靠近器壁的分子被身后的分子往回拉，撞得轻了。被拉的分子数和拉它的分子数都和:term[数密度]{id="physics.thermal-physics.number-density"}（number density）$\frac NV$成正比，所以压强比$\frac{nRT}{V-nb}$少一个正比于$\bigl(\frac nV\bigr)^2$的量，记作$\frac{an^2}{V^2}$。

::anchor{id="def-van-der-waals"}
于是，气体各处均匀、体积$V>nb$时，$\bigl(p+\frac{an^2}{V^2}\bigr)(V-nb)=nRT$，这叫作:term[范德瓦耳斯方程]{id="physics.thermal-physics.van-der-waals-equation"}（van der Waals equation，也叫范德华方程），$a$、$b$是由气体决定的正的常量；均匀状态都严格满足它的气体叫作:term[范德瓦耳斯气体]{id="physics.thermal-physics.van-der-waals-gas"}（van der Waals gas）。

为什么这样定义：只添两个常量，就把分子的大小和吸引都写了进去，$a$、$b$可以由实验定出（第 4 题）。边界情况：气体稀薄时$nb\ll V$、$\frac{an^2}{V^2}\ll p$，方程回到$pV=nRT$。只有$b$时$\frac{pV}{nRT}=\frac V{V-nb}>1$，只有$a$时它小于 1；室温下、压强不太大时，二氧化碳以吸引为主，氢、氦以分子本身的体积为主（第 5 题）。

单原子（monatomic）的范德瓦耳斯气体，均匀时的:term[内能]{id="physics.thermal-physics.internal-energy"}（internal energy）就是[热力学第一定律](lesson:physics.thermal-physics.first-law)第 6 题给的$U=\frac32nRT-\frac{an^2}V$，后一项来自分子之间的吸引（推导见[麦克斯韦关系](lesson:physics.thermal-physics.maxwell-relations)第 6 题）。

### 等温线与临界点

把方程写成$p=\frac{nRT}{V-nb}-\frac{an^2}{V^2}$，按它画均匀状态的:term[等温线]{id="physics.thermal-physics.isotherm"}。:term[温度]{id="physics.thermal-physics.temperature"}高时前一项占上风，等温线一路下降；温度低时后一项显出来，中间有一段回折（van der Waals loop），从最低点升到最高点，体积变大、压强反而升高（几何图像，证明见第 6 题）。这时一条水平线可以和等温线交于三点；方程两边乘以$V^2(V-nb)$，交点的$V$满足一个三次方程，所以不会更多。

两:term[相]{id="physics.thermal-physics.phase"}（phase）平衡共存，要同一个温度、压强下有两个不同的状态。等温线一路下降时，一个压强只对应一个体积，分不成两相；有回折时，最左边的交点体积小，像液体，最右边的大，像气体。实际的等温线在这样两点之间是一段水平线，它的高度见[麦克斯韦等面积法则](lesson:physics.thermal-physics.maxwell-construction)。

温度升高，回折的最低点和最高点靠拢，到某个温度合成一点：那里切线水平，曲线弯的方向也在那里改变，是一个拐点（inflection point，见[凹凸性与拐点](lesson:math.calculus.concavity#def-inflection-point)）。温度再高就分不成两相了，所以这个温度就是:term[范德瓦耳斯气体]{id="physics.thermal-physics.van-der-waals-gas"}的:term[临界温度]{id="physics.thermal-physics.critical-temperature"}，那一点就是它的:term[临界点]{id="physics.thermal-physics.critical-point"}。

::anchor{id="thm-vdw-critical"}
定理：范德瓦耳斯气体的临界点满足$\pdvc pVT=0$、$\bigl(\frac{\partial^2p}{\partial V^2}\bigr)_T=0$，由此得临界点的体积$V_{\mathrm c}=3nb$、压强$p_{\mathrm c}=\frac a{27b^2}$、温度$T_{\mathrm c}=\frac{8a}{27Rb}$。过临界点的等温线叫作临界等温线（critical isotherm），$V_{\mathrm c}$、$p_{\mathrm c}$分别叫作临界体积（critical volume）、临界压强（critical pressure）。

证明思路：切线水平，一阶导数为零；拐点两侧二阶导数（second derivative）异号，它又连续，所以也为零。两个条件是

$$
-\frac{nRT}{(V-nb)^2}+\frac{2an^2}{V^3}=0 ,\qquad \frac{2nRT}{(V-nb)^3}-\frac{6an^2}{V^4}=0 .
$$

从两式各解出$nRT$，令它们相等，得$V-nb=\frac23V$，即$V_{\mathrm c}=3nb$；代回前一式得$T_{\mathrm c}$，再代进方程得$p_{\mathrm c}$。

为什么这样定义：拿$V_{\mathrm c}$、$p_{\mathrm c}$、$T_{\mathrm c}$做单位，$a$、$b$就从方程里消掉了（第 6 题）；$\frac{p_{\mathrm c}V_{\mathrm c}}{nRT_{\mathrm c}}=\frac38$也和$a$、$b$无关，拿它和实测值比正好检验方程（例 1）。边界情况：只有第一个条件不够，温度低于$T_{\mathrm c}$时，回折的最低点、最高点也满足它。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0.4, 4], y: [0, 2] }
functions:
  - expr: "8*T/(3*x - 1) - 3/x^2"
    label: |
      滑块所设温度下的等温线
  - expr: "8/(3*x - 1) - 3/x^2"
    label: |
      临界等温线
points:
  - { x: 1, y: 1 }
sliders:
  - name: T
    min: 0.85
    max: 1.2
    step: 0.01
    default: 0.9
    label: |
      $\frac T{T_{\mathrm c}}$
:::

横轴写作 x，是$\frac V{V_{\mathrm c}}$；纵轴写作 y，是$\frac p{p_{\mathrm c}}$；滑块调的是$\frac T{T_{\mathrm c}}$。用:term[临界点]{id="physics.thermal-physics.critical-point"}的值做单位，$\frac T{T_{\mathrm c}}$相同时，各种:term[范德瓦耳斯气体]{id="physics.thermal-physics.van-der-waals-gas"}的:term[等温线]{id="physics.thermal-physics.isotherm"}都是同一条（第 6 题）。蓝线是滑块所设:term[温度]{id="physics.thermal-physics.temperature"}下的等温线，橙线是临界等温线，圆点是临界点：温度低于:term[临界温度]{id="physics.thermal-physics.critical-temperature"}时蓝线有回折，升到临界温度（这时两条线重合），回折缩成圆点处的拐点。

## 例题

### 例 1　氩的临界点

氩的$a=0.1355\,\mathrm{Pa\cdot m^6/mol^2}$（和[热力学第一定律](lesson:physics.thermal-physics.first-law)第 6 题（2）的相同）、$b=3.20\times10^{-5}\,\mathrm{m^3/mol}$。按:term[范德瓦耳斯方程]{id="physics.thermal-physics.van-der-waals-equation"}求$1\,\mathrm{mol}$氩的:term[临界温度]{id="physics.thermal-physics.critical-temperature"}、临界压强、临界体积，和实测的$150.7\,\mathrm K$、$4.86\,\mathrm{MPa}$、约$75\,\mathrm{cm^3}$比较。哪一个数才算检验了方程？

**为什么想到这么做**：代定理里的三个式子就行。检验要看定$a$、$b$时没用过的数：常用表里的$a$、$b$，正是由实测的临界温度、临界压强反过来定出的（第 4 题）。

**推导**：$n=1\,\mathrm{mol}$，

$$
T_{\mathrm c}=\frac{8a}{27Rb}\approx151\,\mathrm K ,\qquad p_{\mathrm c}=\frac a{27b^2}\approx4.90\,\mathrm{MPa} ,\qquad V_{\mathrm c}=3nb=96.0\,\mathrm{cm^3} .
$$

前两个和实测差不到 1%，是定$a$、$b$时就对上了的。$V_{\mathrm c}$没有用来定常量，它约是实测的 1.3 倍；$\frac{p_{\mathrm c}V_{\mathrm c}}{nRT_{\mathrm c}}$是$\frac38$，实测约$0.29$。范德瓦耳斯方程在:term[临界点]{id="physics.thermal-physics.critical-point"}附近只能定性地用（第 8 题）。

## 常见误区

- 「$nb$就是所有分子本身的体积之和。」把分子当作硬球（hard sphere）估算：两个分子的中心最近也隔着一个直径，每个分子周围，半径是一个直径的球里，别的分子的中心进不去。这个球的体积是分子的 8 倍，每一对分子合用一个，平均到每个分子是 4 倍，$b$约是每摩尔分子本身体积的 4 倍。

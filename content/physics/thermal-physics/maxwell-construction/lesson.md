---
id: physics.thermal-physics.maxwell-construction
title: |
  麦克斯韦等面积法则
goal: |
  会用麦克斯韦等面积法则求范德瓦耳斯等温线上的气液共存压强，并说明等温线上哪一段不稳定。
prerequisites: [physics.thermal-physics.van-der-waals, physics.thermal-physics.free-energy-criteria]
minutes: 28
summary: |
  共存压强使水平线和等温线围成的两块面积相等；$\pdvc pVT>0$的一段不稳定。
status: reviewed
---

## 这一节要回答的问题

:term[温度]{id="physics.thermal-physics.temperature"}（temperature）低于:term[临界温度]{id="physics.thermal-physics.critical-temperature"}（critical temperature）时，:term[范德瓦耳斯气体]{id="physics.thermal-physics.van-der-waals-gas"}（van der Waals gas）的:term[等温线]{id="physics.thermal-physics.isotherm"}（isotherm）有一段回折（van der Waals loop），体积变大、压强（pressure）反而升高；实际的等温线上却有一段水平线。这段水平线该画在多高？回折上的状态又为什么看不到？

## 讲解

### 共存的压强

室温下的二氧化碳，:term[等温线]{id="physics.thermal-physics.isotherm"}上水平的一段是液体和气体共存，压强是这一:term[温度]{id="physics.thermal-physics.temperature"}的:term[饱和蒸气压]{id="physics.thermal-physics.saturated-vapor-pressure"}（saturated vapor pressure），记作$p_{\text{饱}}$。:term[范德瓦耳斯气体]{id="physics.thermal-physics.van-der-waals-gas"}的等温线在那里有一段回折，水平线和等温线交于三点，最左、最右的两点是液体、气体（见[范德瓦耳斯气体与临界点](lesson:physics.thermal-physics.van-der-waals)）。设一定量的物质在$p_{\text{饱}}$下全是液体、全是气体时，体积是$V_{\text{液}}$、$V_{\text{气}}$，:term[亥姆霍兹自由能]{id="physics.thermal-physics.helmholtz-free-energy"}（Helmholtz free energy）是$F_{\text{液}}$、$F_{\text{气}}$。

两:term[相]{id="physics.thermal-physics.phase"}（phase）处于:term[相平衡]{id="physics.thermal-physics.phase-equilibrium"}（phase equilibrium），:term[化学势]{id="physics.thermal-physics.chemical-potential"}（chemical potential）相等（见[相变与克拉珀龙方程](lesson:physics.thermal-physics.phase-transitions#def-phase-equilibrium)）。由$G=\mu N$（见[化学势与开放系统](lesson:physics.thermal-physics.chemical-potential#thm-g-mu-n)），同样多的液体和气体，:term[吉布斯自由能]{id="physics.thermal-physics.gibbs-free-energy"}（Gibbs free energy）$G=F+pV$相等：$F_{\text{液}}+p_{\text{饱}}V_{\text{液}}=F_{\text{气}}+p_{\text{饱}}V_{\text{气}}$。

只做体积变化的功、温度不变时$\dd F=-p\,\dd V$（见[热力学势](lesson:physics.thermal-physics.thermodynamic-potentials#def-helmholtz)）。把等温线上的状态都当作均匀的一相，沿它从$V_{\text{液}}$积到$V_{\text{气}}$，$F_{\text{液}}-F_{\text{气}}=\int_{V_{\text{液}}}^{V_{\text{气}}}p\,\dd V$；途中经过回折，这样算靠不靠得住，见第 8 题。代进上式，得下面的定理。

::anchor{id="thm-equal-area"}
定理：一定量、单一成分的范德瓦耳斯气体只做体积变化的功，温度低于:term[临界温度]{id="physics.thermal-physics.critical-temperature"}时，气液平衡共存的压强$p_{\text{饱}}$满足$\int_{V_{\text{液}}}^{V_{\text{气}}}p\,\dd V=p_{\text{饱}}(V_{\text{气}}-V_{\text{液}})$，$V_{\text{液}}$、$V_{\text{气}}$是高度为$p_{\text{饱}}$的水平线和等温线最左、最右两个交点的体积；也就是两者围成的两块，线上方的和线下方的面积相等。这叫作麦克斯韦等面积法则（Maxwell construction，也叫 Maxwell equal-area rule）。

等式移项，得$\int_{V_{\text{液}}}^{V_{\text{气}}}(p-p_{\text{饱}})\,\dd V=0$：线上方的一块算作正的，线下方的一块算作负的（见[微元法与平面图形的面积](lesson:math.calculus.area-between-curves#thm-area-between-curves)的边界情况），所以两块面积相等；$p_{\text{饱}}$也就是这段等温线上压强的平均值。这样的水平线恰有一条：线画得低，上方的一块大；线升高，上方的变小、下方的变大，升到回折的最高点，上方的就没有了。边界情况：温度升向临界温度，两块一起缩到:term[临界点]{id="physics.thermal-physics.critical-point"}（critical point）；再高就没有回折，也没有共存。

体积$V$在$V_{\text{液}}$、$V_{\text{气}}$之间、分成共存的两相时，设液体、气体各占:term[物质的量]{id="physics.thermal-physics.amount-of-substance"}（amount of substance）的$\frac{n_{\text{液}}}n$、$\frac{n_{\text{气}}}n$，则$V=\frac{n_{\text{液}}}nV_{\text{液}}+\frac{n_{\text{气}}}nV_{\text{气}}$。$V$变大，气体变多，压强一直是$p_{\text{饱}}$，这就是那段水平线。

### 哪一段不稳定

:term[温度]{id="physics.thermal-physics.temperature"}、体积固定，又不做别的功时，最后到达的:term[平衡态]{id="physics.thermal-physics.equilibrium-state"}（equilibrium state）的:term[亥姆霍兹自由能]{id="physics.thermal-physics.helmholtz-free-energy"}在能变到的状态里最小（见[自由能判据与最大功](lesson:physics.thermal-physics.free-energy-criteria#thm-helmholtz-criterion)）。沿:term[等温线]{id="physics.thermal-physics.isotherm"}$\pdvc FVT=-p$，所以$\bigl(\frac{\partial^2F}{\partial V^2}\bigr)_T=-\pdvc pVT$；回折上$\pdvc pVT>0$，$F$对$V$严格凹（strictly concave），曲线高过弦。把物质分成相等的两半，一半的体积变成$\frac12(V+\Delta V)$，另一半变成$\frac12(V-\Delta V)$，$\Delta V$很小；$F$是:term[广延量]{id="physics.thermal-physics.extensive-quantity"}（extensive quantity），总的$F$从$F(V)$变成$\frac12F(V+\Delta V)+\frac12F(V-\Delta V)$，落到弦上，变小了。

::anchor{id="thm-unstable"}
定理：一定量的物质等温、总体积不变、不做别的功时，$\pdvc pVT>0$的均匀状态不稳定：稍有疏密不均，$F$就减小，物质自发（spontaneous）分成密、稀两部分。范德瓦耳斯等温线上的回折就是这样的一段。

从力学看，体积稍一变大，压强反而升高，把活塞推得更远（[范德瓦耳斯气体与临界点](lesson:physics.thermal-physics.van-der-waals)第 7 题、[自由能判据与最大功](lesson:physics.thermal-physics.free-energy-criteria)第 5 题），像停在势能最高处的小球，不是:term[稳定平衡]{id="physics.newtonian-mechanics.stable-equilibrium"}（stable equilibrium）。边界情况：$\pdvc pVT<0$时$F$严格凸（strictly convex），小的扰动后回得来，可$F$不一定最小。

::anchor{id="def-metastable"}
温度低于:term[临界温度]{id="physics.thermal-physics.critical-temperature"}时，体积在共存液体的$V_{\text{液}}$和气体的$V_{\text{气}}$之间、$\pdvc pVT<0$的均匀状态，经得起小的扰动，但总体积不变、分成两:term[相]{id="physics.thermal-physics.phase"}时$F$更小（第 5 题），叫作亚稳态（metastable state）：从$V_{\text{液}}$到回折最低点的叫过热液体（superheated liquid），从回折最高点到$V_{\text{气}}$的叫过冷蒸气（supercooled vapor）。

为什么这样定义：它像停在浅坑里的小球，扰动大了就落进更深的坑（几何图像）。过热液体的压强比$p_{\text{饱}}$低，过冷蒸气的压强比$p_{\text{饱}}$高，早该沸腾（boiling）、凝结（condensation）。边界情况：回折的最低点、最高点上$\pdvc pVT=0$，再往里就不稳定，亚稳态到此为止。

## 几何图像

![温度等于 0.9 倍临界温度的等温线，横轴是体积 V，纵轴是压强 p。左边一条陡峭下降的粗线标着液体，降到圆点 A；从 A 起一条水平的粗线到圆点 E，标着气液共存，高度标着 p 饱；从 E 起一条缓缓下降的粗线标着气体。A、E 正下方的横轴上标着 V 液、V 气。范德瓦耳斯等温线从 A 沿蓝线陡降到最低的圆点 B，这一段由一条细线引到左边，标着过热液体；从 B 沿蓝色虚线升起，在圆点 C 穿过水平线，升到最高的圆点 D，这一段标着不稳定；从 D 沿蓝线缓缓降到 E，这一段标着过冷蒸气。水平线和范德瓦耳斯等温线围成两块，都涂成浅蓝色：线下方的一块在 A、C 之间，线上方的一块在 C、E 之间，面积相等](equal-area.svg)

$T=0.9T_{\mathrm c}$的:term[范德瓦耳斯气体]{id="physics.thermal-physics.van-der-waals-gas"}，按比例，两轴不从零起。粗线是最后到达平衡时的:term[等温线]{id="physics.thermal-physics.isotherm"}，蓝线是被水平段换掉的部分，涂色的两块面积相等。A、E 是共存的液体和气体，A 到 B 是过热液体，B 到 D 不稳定，D 到 E 是过冷蒸气。

:::anim{component="function-plot"}
range: { x: [0.4, 3.4], y: [0, 1] }
functions:
  - expr: "7.2/(3*x - 1) - 3/x^2"
    label: |
      $T=0.9T_{\mathrm c}$的等温线
  - expr: "h"
    label: |
      高度为$h$的水平线
  - expr: "5.2 - 2.4*ln(3*x - 1) - 3/x + h*(x - 1.4)"
    label: |
      $F+hV$（上下平移过）
sliders:
  - name: h
    min: 0.55
    max: 0.72
    step: 0.001
    default: 0.6
    label: |
      水平线的高度$h$
:::

横轴写作 x，是$\frac V{V_{\mathrm c}}$；纵轴写作 y，蓝线、橙线看$\frac p{p_{\mathrm c}}$，绿线看$F+hV$（以$p_{\mathrm c}V_{\mathrm c}$为单位）。绿线的两个坑正对着蓝线、橙线两端的交点，坡顶正对着中间的交点。两坑一样深，就是两端的:term[吉布斯自由能]{id="physics.thermal-physics.gibbs-free-energy"}相等，这时$h\approx0.647$，两块面积也相等；一深一浅时，停在浅坑里的就是亚稳态。

## 例题

### 例 1　$\frac T{T_{\mathrm c}}=0.9$时的共存压强

记$p_{\mathrm r}=\frac p{p_{\mathrm c}}$、$V_{\mathrm r}=\frac V{V_{\mathrm c}}$、$T_{\mathrm r}=\frac T{T_{\mathrm c}}$，:term[范德瓦耳斯方程]{id="physics.thermal-physics.van-der-waals-equation"}（van der Waals equation）就是${p_{\mathrm r}=\frac{8T_{\mathrm r}}{3V_{\mathrm r}-1}-\frac3{V_{\mathrm r}^2}}$（[范德瓦耳斯气体与临界点](lesson:physics.thermal-physics.van-der-waals)第 6 题）。求$T_{\mathrm r}=0.9$时共存的压强。

**为什么想到这么做**：水平线的高度由两端的交点定，交点又随高度变，就逐步逼近。上方减下方的面积差，等于「平均压强减高度」乘以两端的间距；线抬高一点，这个差约减少「抬高的量」乘以间距。所以下一次的高度就取平均压强。

**推导**：两端的交点记作$V_1$、$V_2$（由三次方程用计算器求），平均压强是

$$
\frac1{V_2-V_1}\int_{V_1}^{V_2}p_{\mathrm r}\,\dd V_{\mathrm r}=\frac1{V_2-V_1}\Bigl(2.4\ln\frac{3V_2-1}{3V_1-1}+\frac3{V_2}-\frac3{V_1}\Bigr) .
$$

| 高度 | $V_1$ | $V_2$ | 平均压强 |
| --- | --- | --- | --- |
| $0.6000$ | $0.6126$ | $2.721$ | $0.6429$ |
| $0.6429$ | $0.6041$ | $2.381$ | $0.6470$ |
| $0.6470$ | $0.6034$ | $2.349$ | $0.6470$ |

第二步就稳定了：$p_{\text{饱}}\approx0.647p_{\mathrm c}$，$V_{\text{液}}\approx0.603V_{\mathrm c}$，$V_{\text{气}}\approx2.35V_{\mathrm c}$。

## 常见误区

- 「水平线只要和:term[等温线]{id="physics.thermal-physics.isotherm"}交于三点，画在哪里都行。」三个交点只说明同一压强下有三个均匀状态；液体和气体平衡共存，还要:term[化学势]{id="physics.thermal-physics.chemical-potential"}相等，只有面积相等的那一条满足。

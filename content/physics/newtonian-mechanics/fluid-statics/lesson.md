---
id: physics.newtonian-mechanics.fluid-statics
title: |
  静止流体中的压强
goal: |
  会求静止流体中压强随深度的变化，并用帕斯卡原理分析液压机。
prerequisites: [physics.newtonian-mechanics.common-forces, math.calculus.fundamental-theorem]
minutes: 30
summary: |
  静止液体深$h$处的压强是$p_0+\rho gh$，各个方向一样大。
status: reviewed
---

## 这一节要回答的问题

潜水时越往下潜，耳朵胀得越疼；水坝都修得上窄下宽。用手压液压千斤顶，就能顶起一辆汽车。液体对和它接触的面的挤压，怎样随深度变化，又怎样传到别处？

## 讲解

### 压强

液体和气体没有固定的形状，统称流体（fluid）。静止的流体对和它接触的面只能垂直地推：要是有沿着面的分量，流体就会顺着它流动。

::anchor{id="def-pressure"}
垂直作用在面上的:term[力]{id="physics.newtonian-mechanics.force"}（force）叫作压力。面积为$S$的面上，压力均匀分布、大小为$F$时，$p=\frac FS$叫作:term[压强]{id="physics.newtonian-mechanics.pressure"}（pressure）；不均匀时，取包含某一点的小面积$\Delta S$，上面的压力为$\Delta F$，$\Delta S\to0$时$\frac{\Delta F}{\Delta S}$的极限就是这一点的压强。压强的单位是帕斯卡（pascal），$1\,\mathrm{Pa}=1\,\mathrm{N/m^2}$。

为什么这样定义：同样大的压力，压在小面积上效果更明显，刀刃磨薄了切东西省力，宽大的雪鞋不容易陷进雪里。边界情况：斜着压在面上的力，只有垂直于面的分量算压力。

::anchor{id="thm-isotropic"}
定理：静止流体里某一点的压强，不论取的面朝哪个方向，都一样大。

证明思路：在这一点取一个很小的三棱柱形流体块，三个侧面一个竖直、一个水平、一个倾斜，它受的压力和:term[重力]{id="physics.newtonian-mechanics.weight"}（weight）的:term[合力]{id="physics.newtonian-mechanics.net-force"}（net force）为零。流体块缩小时，压力和面积成正比，重力和体积成正比，小一阶，可以略去，于是三个面上的压强只能相等（第 6 题）；斜面的方向是任意取的。

所以说静止流体里一点的压强时，不用说明面朝哪个方向：压强只有大小，压力的方向由受压的面决定。

### 压强随深度的变化

::anchor{id="thm-depth"}
定理：密度为$\rho$的流体静止时，取$z$轴竖直向上，:term[压强]{id="physics.newtonian-mechanics.pressure"}随高度的变化率是$\dv pz=-\rho g$。液体的密度可以看成不变，液面上的压强为$p_0$时，液面下深$h$处的压强是$p=p_0+\rho gh$。

证明思路：取一个竖直放着的细圆柱形流体块，底面积$S$，下底面在$z$处，上底面在$z+\Delta z$处。侧面上的:term[压力]{id="physics.newtonian-mechanics.force"}都是水平的；竖直方向，下底面受向上的压力$p(z)S$，上底面受向下的压力$p(z+\Delta z)S$，还有:term[重力]{id="physics.newtonian-mechanics.weight"}$\rho gS\Delta z$。流体块静止，三者之和为零，两边除以$S\Delta z$，令$\Delta z\to0$，就得到$\dv pz=-\rho g$。$\rho$不变时，由微积分基本定理（fundamental theorem of calculus），$p(z)-p_0=-\rho g(z-z_0)$，$z_0$是液面的高度，$z_0-z$就是深度$h$。

水平放着的细圆柱形流体块，两端的压力也要平衡，所以连成一片的同一种静止液体里，同一水平面上压强处处相等；压强只和液面下的深度有关，和容器的形状无关。水每深$10\,\mathrm m$，压强增加约$1\times10^5\,\mathrm{Pa}$，水坝因此下宽上窄。

::anchor{id="def-communicating-vessels"}
上端开口、底部互相连通的几个容器，叫作:term[连通器]{id="physics.newtonian-mechanics.communicating-vessels"}（communicating vessels）。

为什么这样定义：只装一种液体、液体静止时，连通器各部分的液面一样高：底部同一水平面上各处压强相等，液面上又都是$p_0$，$p_0+\rho gh$里的$h$也就相等。茶壶的壶嘴和壶身、船闸都是连通器。边界情况：装着两种不相混合的液体时，液面一般不一样高（第 3 题）。

### 帕斯卡原理与大气压

::anchor{id="thm-pascal"}
定理（:term[帕斯卡原理]{id="physics.newtonian-mechanics.pascals-principle"}，Pascal's principle）：加在密闭容器里静止液体上的:term[压强]{id="physics.newtonian-mechanics.pressure"}，能大小不变地传到液体的各个部分。

证明思路：液面下深$h$处的压强是$p_0+\rho gh$。用活塞压液面，$p_0$增加$\Delta p$；液体几乎不能压缩，$\rho$和$h$都不变，所以各处的压强都增加$\Delta p$。

液压机（hydraulic press）的两个活塞一样高时，下面液体的压强相等，$\frac{F_1}{S_1}=\frac{F_2}{S_2}$，大活塞的面积是小活塞的几倍，它受的:term[力]{id="physics.newtonian-mechanics.force"}就是几倍（例 2）。

::anchor{id="def-atmospheric-pressure"}
地球表面被厚厚的大气包着，大气的压强叫作:term[大气压]{id="physics.newtonian-mechanics.atmospheric-pressure"}（atmospheric pressure）。海平面附近的大气压约为$1.013\times10^5\,\mathrm{Pa}$，这个值叫作标准大气压（standard atmosphere）。

为什么这样定义：身体内外都受着大气压，互相平衡，所以平时觉察不到它。托里拆利（Torricelli）把装满水银的玻璃管倒插在水银槽里，管里的水银柱降到比槽中液面高约$760\,\mathrm{mm}$就不再下降，管顶是真空，所以大气压等于$\rho_{\text{汞}}gh\approx13.6\times10^3\times9.8\times0.760\approx1.01\times10^5\,\mathrm{Pa}$。边界情况：空气容易压缩，越往上越稀薄，大气压并不随高度均匀减小（第 5 题）。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 20], y: [0, 7] }
functions:
  - expr: "1.013 + 0.098 * x"
    label: |
      液面上为标准大气压的水
  - expr: "p + 0.098 * r * x"
    label: |
      液面上压强为$p_0$、密度为$\rho$的液体
sliders:
  - name: p
    min: 0
    max: 3
    step: 0.01
    default: 2
    label: |
      液面上的压强$p_0$（$10^5\,\mathrm{Pa}$）
  - name: r
    min: 0.5
    max: 2
    step: 0.01
    default: 1
    label: |
      液体的密度$\rho$（$10^3\,\mathrm{kg/m^3}$）
:::

横轴是液面下的深度$h$（$\mathrm m$），纵轴是:term[压强]{id="physics.newtonian-mechanics.pressure"}（$10^5\,\mathrm{Pa}$）。$p=p_0+\rho gh$是直线，斜率$\rho g$由密度决定，截距是液面上的压强。只拖动$p_0$，橙线整条上下平移，各个深度的压强改变得一样多，这就是:term[帕斯卡原理]{id="physics.newtonian-mechanics.pascals-principle"}。

## 例题

### 例 1　深海里的压强

潜水器下潜到海面下$7.0\times10^3\,\mathrm m$处，海水的密度取$1.03\times10^3\,\mathrm{kg/m^3}$，海面上是标准:term[大气压]{id="physics.newtonian-mechanics.atmospheric-pressure"}，$g$取$9.8\,\mathrm{m/s^2}$。那里的:term[压强]{id="physics.newtonian-mechanics.pressure"}是多少？潜水器上直径$20\,\mathrm{cm}$的圆形观察窗，舱内是一个大气压，窗户内外受的:term[压力]{id="physics.newtonian-mechanics.force"}相差多少？

**为什么想到这么做**：海水静止，压强由$p=p_0+\rho gh$算；窗户内外都有大气压那一份，压力差只由$\rho gh$决定。

**推导**：$\rho gh=1.03\times10^3\times9.8\times7.0\times10^3\approx7.07\times10^7\,\mathrm{Pa}$，$p\approx7.08\times10^7\,\mathrm{Pa}$，约是大气压的$700$倍。窗的面积是$\pi\times0.10^2\approx3.14\times10^{-2}\,\mathrm{m^2}$，压力差约为$2.2\times10^6\,\mathrm N$，相当于两百多吨的东西压在窗上。

### 例 2　液压千斤顶

液压千斤顶的小活塞面积是$2.0\,\mathrm{cm^2}$，大活塞面积是$1.0\times10^2\,\mathrm{cm^2}$，两个活塞一样高，活塞的:term[质量]{id="physics.newtonian-mechanics.mass"}（mass）不计。要顶起压在大活塞上的$1.2\times10^4\,\mathrm N$的重物，小活塞上要加多大的:term[力]{id="physics.newtonian-mechanics.force"}？重物升高$1.0\,\mathrm{cm}$，小活塞要压下多少？

**为什么想到这么做**：由:term[帕斯卡原理]{id="physics.newtonian-mechanics.pascals-principle"}，两个活塞下面的:term[压强]{id="physics.newtonian-mechanics.pressure"}相等；液体不可压缩，小活塞压进去的体积等于大活塞让出的体积。

**推导**：$\frac{F_1}{2.0}=\frac{1.2\times10^4}{1.0\times10^2}$（面积都以$\mathrm{cm^2}$为单位，比值不变），$F_1=240\,\mathrm N$。由$2.0\,d_1=1.0\times10^2\times1.0$，$d_1=50\,\mathrm{cm}$：力省了几倍，路程就多走几倍。

## 常见误区

- 「容器底受的:term[压力]{id="physics.newtonian-mechanics.force"}等于里面液体的:term[重力]{id="physics.newtonian-mechanics.weight"}。」不算:term[大气压]{id="physics.newtonian-mechanics.atmospheric-pressure"}，液体对底面的压力是$\rho ghS$，只看深度和底面积；上粗下细的容器，侧壁托着一部分液体，底面受的压力比液体的重力小。
- 「水面越大，坝底受的:term[压强]{id="physics.newtonian-mechanics.pressure"}越大。」压强只看深度，同样深的水库和窄窄的水渠，坝底的压强一样大。

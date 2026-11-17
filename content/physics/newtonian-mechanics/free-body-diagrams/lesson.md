---
id: physics.newtonian-mechanics.free-body-diagrams
title: |
  受力分析与连接体
goal: |
  会画受力图，并用牛顿定律解斜面、滑轮和连接体问题。
prerequisites: [physics.newtonian-mechanics.common-forces]
minutes: 26
summary: |
  隔离物体画全受力，沿合适的轴分解，再列牛顿第二定律。
status: reviewed
---

## 这一节要回答的问题

斜面上被绳子拉着的木块、跨过滑轮连在一起的两个重物、一列被拉着走的车厢：几个物体、好几种:term[力]{id="physics.newtonian-mechanics.force"}（force）搅在一起，很容易漏掉一个力，或者多算一个力。怎样有条理地找全每个物体受的力，再用牛顿定律算出运动？

## 讲解

### 受力图

::anchor{id="def-fbd"}
把要研究的物体单独画出来，用箭头标出其他物体对它施加的每一个:term[力]{id="physics.newtonian-mechanics.force"}，这样的图叫作:term[受力图]{id="physics.newtonian-mechanics.free-body-diagram"}（free-body diagram）。

为什么这样定义：:term[牛顿第二定律]{id="physics.newtonian-mechanics.newtons-second-law"}（Newton's second law）里的:term[合力]{id="physics.newtonian-mechanics.net-force"}（net force），只算作用在这个物体上的力。把物体单独画出来，先画:term[重力]{id="physics.newtonian-mechanics.weight"}（weight），再沿着它的边缘走一圈，每个和它接触的绳子、支持面、别的物体各给出相应的力，就不会漏掉；不接触的，除了重力就没有别的力。边界情况：这个物体对别的物体施加的力不画在它的受力图上；「:term[向心力]{id="physics.newtonian-mechanics.centripetal-force"}（centripetal force）」「合力」不是单独的一种力，也不画。

### 选坐标轴

画好:term[受力图]{id="physics.newtonian-mechanics.free-body-diagram"}以后，选两个互相垂直的坐标轴，把每个:term[力]{id="physics.newtonian-mechanics.force"}分解到轴上，每个方向各列一个:term[牛顿第二定律]{id="physics.newtonian-mechanics.newtons-second-law"}的方程。坐标轴最好有一根沿着:term[加速度]{id="physics.newtonian-mechanics.acceleration"}（acceleration）的方向：在斜面上沿斜面和垂直于斜面选轴，垂直于斜面的方向没有加速度，方程最简单。

### 连接体

::anchor{id="def-connected"}
几个物体用绳、杆连着或者互相挤压，一起运动，叫作:term[连接体]{id="physics.newtonian-mechanics.connected-bodies"}（connected bodies）。把它们当作一个整体、只考虑外界对整体的:term[力]{id="physics.newtonian-mechanics.force"}，叫作:term[整体法]{id="physics.newtonian-mechanics.whole-system-method"}（whole-system method）；把其中一个物体单独隔离出来分析，叫作:term[隔离法]{id="physics.newtonian-mechanics.isolation-method"}（isolation method）。

为什么这样定义：用整体法时，物体之间的相互作用成对出现，由:term[牛顿第三定律]{id="physics.newtonian-mechanics.newtons-third-law"}（Newton's third law）相加为零，方程最少；要求物体之间的力，例如绳子的:term[拉力]{id="physics.newtonian-mechanics.tension"}（tension），就只能隔离。边界情况：整体法要求各物体的:term[加速度]{id="physics.newtonian-mechanics.acceleration"}相同；跨过滑轮的两个物体加速度方向不同时，要分别隔离，再用「绳长不变」把它们的加速度联系起来（例 2）。

## 几何图像

![两个受力图，箭头的长短和力的大小成正比：左边，光滑斜面的倾角为 θ，木块用平行于斜面的细绳拴在斜面顶端的桩上；木块受竖直向下的重力 G、垂直于斜面的支持力 N 和沿斜面向上的拉力 T，虚线是重力沿斜面和垂直于斜面的两个分量，T 和沿斜面的分量一样长，N 和垂直于斜面的分量一样长。右边按例 2 的数画，木块 A 放在光滑的水平桌面上，用轻绳跨过桌边的定滑轮和下面悬挂的木块 B 相连；A 受重力 GA、支持力 N 和水平向右的拉力 T，N 和 GA 一样长；B 受重力 GB 和竖直向上的拉力 T，两个拉力一样长，都比 GB 短，B 加速下落](fbd.svg)

左图：光滑斜面上用绳子拴住的木块，受:term[重力]{id="physics.newtonian-mechanics.weight"}$\vb G$、垂直于斜面的:term[支持力]{id="physics.newtonian-mechanics.normal-force"}（normal force）$\vb N$和沿斜面向上的:term[拉力]{id="physics.newtonian-mechanics.tension"}$\vb T$；虚线是重力沿斜面和垂直于斜面的两个分量，木块静止时$T=G\sin\theta$，$N=G\cos\theta$。右图：桌面上的$A$和挂着的$B$由:term[轻绳]{id="physics.newtonian-mechanics.light-string"}（light string）跨过光滑的滑轮连着，两个:term[受力图]{id="physics.newtonian-mechanics.free-body-diagram"}里的拉力一样大；$B$在加速下落，拉力比它受的重力小（例 2）。两个图里箭头的长短都和:term[力]{id="physics.newtonian-mechanics.force"}的大小成正比，右图按例 2 的数画。

## 例题

### 例 1　沿光滑斜面拉木块

倾角$30^\circ$的光滑斜面上，用平行于斜面的绳子把:term[质量]{id="physics.newtonian-mechanics.mass"}（mass）$2.0\,\mathrm{kg}$的木块以$1.0\,\mathrm{m/s^2}$的:term[加速度]{id="physics.newtonian-mechanics.acceleration"}沿斜面向上拉，$g$取$9.8\,\mathrm{m/s^2}$。绳子的:term[拉力]{id="physics.newtonian-mechanics.tension"}和斜面的:term[支持力]{id="physics.newtonian-mechanics.normal-force"}各是多少？

**为什么想到这么做**：木块受:term[重力]{id="physics.newtonian-mechanics.weight"}、支持力和拉力。沿斜面和垂直于斜面选轴，沿斜面方向有加速度，垂直方向没有。

**推导**：垂直于斜面：$N-mg\cos30^\circ=0$，$N\approx17.0\,\mathrm N$。沿斜面向上：$T-mg\sin30^\circ=ma$，$T=2.0\times(4.9+1.0)=11.8\,\mathrm N$。拉力比重力沿斜面的分量$9.8\,\mathrm N$多出的那一部分，正是产生加速度的:term[力]{id="physics.newtonian-mechanics.force"}。

### 例 2　桌面和滑轮

光滑水平桌面上的木块$A$（$3.0\,\mathrm{kg}$）用:term[轻绳]{id="physics.newtonian-mechanics.light-string"}跨过桌边光滑的定滑轮，和悬挂的木块$B$（$1.0\,\mathrm{kg}$）相连，$g$取$9.8\,\mathrm{m/s^2}$。从静止放开，两个木块的:term[加速度]{id="physics.newtonian-mechanics.acceleration"}和绳子的:term[拉力]{id="physics.newtonian-mechanics.tension"}各是多少？

**为什么想到这么做**：$A$水平运动、$B$竖直运动，方向不同，要分别用:term[隔离法]{id="physics.newtonian-mechanics.isolation-method"}；绳长不变，两者的加速度大小相等。

**推导**：$A$在水平方向只受拉力：$T=m_Aa$。$B$取向下为正：$m_Bg-T=m_Ba$。两式相加，$a=\frac{m_Bg}{m_A+m_B}=2.45\,\mathrm{m/s^2}$，$T=m_Aa\approx7.35\,\mathrm N$，比$B$的:term[重力]{id="physics.newtonian-mechanics.weight"}$9.8\,\mathrm N$小：$B$在加速下落，拉力不足以和重力平衡。

## 常见误区

- 「悬挂的物体加速下落时，绳子的:term[拉力]{id="physics.newtonian-mechanics.tension"}等于它的:term[重力]{id="physics.newtonian-mechanics.weight"}。」拉力比重力小（例 2），只有静止或匀速时两者才相等。
- 「斜面上的物体还受一个沿斜面向下的:term[力]{id="physics.newtonian-mechanics.force"}，叫『下滑力』。」沿斜面向下的趋势来自重力的分量$mg\sin\theta$，:term[受力图]{id="physics.newtonian-mechanics.free-body-diagram"}上只画重力，不能重复画。
- 「受力图上要把物体对别的物体的力也画上。」只画别的物体对它的力，否则:term[合力]{id="physics.newtonian-mechanics.net-force"}就算错了。

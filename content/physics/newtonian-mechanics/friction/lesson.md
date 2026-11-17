---
id: physics.newtonian-mechanics.friction
title: |
  摩擦力
goal: |
  会区分静摩擦力和滑动摩擦力，求出它们的大小和方向，并解有摩擦的斜面、连接体和平路转弯问题。
prerequisites: [physics.newtonian-mechanics.free-body-diagrams, physics.newtonian-mechanics.circular-dynamics]
minutes: 27
summary: |
  静摩擦力需要多少给多少，最大$\mu_{\mathrm s}N$；滑动摩擦力是$\mu_{\mathrm k}N$。
status: reviewed
---

## 这一节要回答的问题

推一个很重的箱子，轻轻推，推不动；越推越使劲，到某个程度箱子才突然动起来，动起来以后反而好推一些。地面是怎样「抵抗」的？汽车在平路上转弯，又是什么:term[力]{id="physics.newtonian-mechanics.force"}（force）提供了:term[向心力]{id="physics.newtonian-mechanics.centripetal-force"}（centripetal force）？

## 讲解

### 摩擦力和静摩擦力

::anchor{id="def-friction"}
两个互相接触的物体之间，沿着接触面、阻碍它们相对滑动的:term[力]{id="physics.newtonian-mechanics.force"}，叫作:term[摩擦力]{id="physics.newtonian-mechanics.friction"}（friction）；两者相对静止时叫作:term[静摩擦力]{id="physics.newtonian-mechanics.static-friction"}（static friction），相对滑动时叫作:term[滑动摩擦力]{id="physics.newtonian-mechanics.kinetic-friction"}（kinetic friction）。

为什么这样定义：:term[支持力]{id="physics.newtonian-mechanics.normal-force"}（normal force）只管垂直于接触面的方向，沿着接触面的作用要另外描述；它阻碍的是「相对」滑动，所以方向要看两个物体之间的相对运动，不看各自对地面的运动。边界情况：放在加速前进的传送带上的货物，没有打滑时受的静摩擦力向前，正是它带着货物加速，这时摩擦力不是阻力。

::anchor{id="def-max-static"}
:term[静摩擦力]{id="physics.newtonian-mechanics.static-friction"}的大小不是固定的：它正好等于让物体保持相对静止所需要的值，但有一个上限$f_{\max}=\mu_{\mathrm s}N$，叫作:term[最大静摩擦力]{id="physics.newtonian-mechanics.maximum-static-friction"}（maximum static friction），$N$是两者之间的支持力，$\mu_{\mathrm s}$叫作:term[静摩擦因数]{id="physics.newtonian-mechanics.coefficient-of-static-friction"}（coefficient of static friction）。

为什么这样定义：推力小时箱子不动，由:term[牛顿第二定律]{id="physics.newtonian-mechanics.newtons-second-law"}（Newton's second law），地面给的静摩擦力必须和推力等大反向，推力增大它也跟着增大；推到某个值箱子才动，说明它有上限。实验发现这个上限和接触面积几乎无关，和压紧两者的支持力成正比。边界情况：没有相对滑动的趋势时，静摩擦力为零，例如静止在水平桌面上的书。

### 滑动摩擦力

::anchor{id="def-kinetic"}
两个物体相对滑动时，:term[滑动摩擦力]{id="physics.newtonian-mechanics.kinetic-friction"}的大小是$f=\mu_{\mathrm k}N$，方向和物体相对接触面的:term[速度]{id="physics.newtonian-mechanics.velocity"}（velocity）相反；$\mu_{\mathrm k}$叫作:term[动摩擦因数]{id="physics.newtonian-mechanics.coefficient-of-kinetic-friction"}（coefficient of kinetic friction），一般比$\mu_{\mathrm s}$略小。

为什么这样定义：实验发现，滑动摩擦力和滑动的快慢、接触面积关系都不大，主要和:term[支持力]{id="physics.newtonian-mechanics.normal-force"}成正比，一个系数就够描述，箱子动起来以后好推一些，正是因为$\mu_{\mathrm k}<\mu_{\mathrm s}$。边界情况：这只是近似的经验规律，速度很大、接触面有润滑或者很软时都不再准确。

### 先判断滑不滑

有:term[摩擦力]{id="physics.newtonian-mechanics.friction"}的问题，先假设两个物体相对静止，用:term[受力图]{id="physics.newtonian-mechanics.free-body-diagram"}（free-body diagram）和牛顿定律算出需要的:term[静摩擦力]{id="physics.newtonian-mechanics.static-friction"}$f$。若$|f|\le\mu_{\mathrm s}N$，假设成立；否则两者相对滑动，摩擦力改用$\mu_{\mathrm k}N$，方向和相对运动的方向相反。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 12], y: [0, 9.5] }
functions:
  - expr: "x + 0*sqrt(10*s - x)"
    label: |
      静摩擦力（木块静止）
  - expr: "10*s*r + 0*sqrt(x - 10*s)"
    label: |
      滑动摩擦力（木块滑动）
sliders:
  - name: s
    min: 0.3
    max: 0.8
    step: 0.05
    default: 0.5
    label: |
      静摩擦因数$\mu_{\mathrm s}$
  - name: r
    min: 0.5
    max: 1
    step: 0.05
    default: 0.8
    label: |
      动摩擦因数和静摩擦因数之比$\frac{\mu_{\mathrm k}}{\mu_{\mathrm s}}$
:::

水平地面上的木块，地面对它的:term[支持力]{id="physics.newtonian-mechanics.normal-force"}是$10\,\mathrm N$。用一根水平的绳子拉它，绳子的:term[拉力]{id="physics.newtonian-mechanics.tension"}（tension）是$F$，横轴是$F$（$\mathrm N$，图上写作$x$），纵轴是:term[摩擦力]{id="physics.newtonian-mechanics.friction"}的大小（$\mathrm N$）。拉力不超过:term[最大静摩擦力]{id="physics.newtonian-mechanics.maximum-static-friction"}$10\mu_{\mathrm s}$时，木块不动，:term[静摩擦力]{id="physics.newtonian-mechanics.static-friction"}等于拉力，是一条斜率为$1$的直线；拉力一超过它，木块滑动，摩擦力突然降到$10\mu_{\mathrm k}$，以后不再随拉力变化。

## 例题

### 例 1　斜面上的木块什么时候开始滑

木块放在倾角可以调节的木板上，两者之间$\mu_{\mathrm s}=0.50$、$\mu_{\mathrm k}=0.40$，$g$取$9.8\,\mathrm{m/s^2}$。慢慢抬高木板，倾角多大时木块开始滑动？倾角为$30^\circ$时，木块下滑的:term[加速度]{id="physics.newtonian-mechanics.acceleration"}（acceleration）多大？

**为什么想到这么做**：先假设木块静止，算出需要的:term[静摩擦力]{id="physics.newtonian-mechanics.static-friction"}，和:term[最大静摩擦力]{id="physics.newtonian-mechanics.maximum-static-friction"}比；一旦滑动，:term[摩擦力]{id="physics.newtonian-mechanics.friction"}改用:term[滑动摩擦力]{id="physics.newtonian-mechanics.kinetic-friction"}。

**推导**：木块静止时，沿斜面$f=mg\sin\theta$，垂直于斜面$N=mg\cos\theta$。需要的静摩擦力不超过$\mu_{\mathrm s}N$，就是$\tan\theta\le\mu_{\mathrm s}$，所以倾角超过$\arctan0.50\approx26.6^\circ$时开始滑。$30^\circ$时木块已经在滑：$ma=mg\sin30^\circ-\mu_{\mathrm k}mg\cos30^\circ$，$a=9.8\times(0.500-0.40\times0.866)\approx1.5\,\mathrm{m/s^2}$。

### 例 2　平路转弯的最大速率

汽车在半径$50\,\mathrm m$的水平弯道上转弯，轮胎和路面之间$\mu_{\mathrm s}=0.60$，$g$取$9.8\,\mathrm{m/s^2}$。汽车不打滑的最大:term[速率]{id="physics.newtonian-mechanics.speed"}（speed）是多少？路面结冰、$\mu_{\mathrm s}$降到$0.10$时呢？

**为什么想到这么做**：轮胎和路面之间没有侧向的滑动，侧向的:term[静摩擦力]{id="physics.newtonian-mechanics.static-friction"}指向弯道内侧，就是:term[向心力]{id="physics.newtonian-mechanics.centripetal-force"}；它不能超过:term[最大静摩擦力]{id="physics.newtonian-mechanics.maximum-static-friction"}。

**推导**：竖直方向$N=mg$；水平方向$\frac{mv^2}R=f\le\mu_{\mathrm s}mg$，$v_{\max}=\sqrt{\mu_{\mathrm s}gR}=\sqrt{0.60\times9.8\times50}\approx17.1\,\mathrm{m/s}$，约$62\,\mathrm{km/h}$。结冰时$\sqrt{0.10\times9.8\times50}=7.0\,\mathrm{m/s}$，约$25\,\mathrm{km/h}$。:term[质量]{id="physics.newtonian-mechanics.mass"}（mass）约掉了，大车小车都一样。

## 常见误区

- 「:term[摩擦力]{id="physics.newtonian-mechanics.friction"}总是阻碍物体运动。」它阻碍的是两个物体之间的相对运动；人走路时，地面对鞋底的:term[静摩擦力]{id="physics.newtonian-mechanics.static-friction"}向前，推着人前进。
- 「静摩擦力总等于$\mu_{\mathrm s}N$。」那只是它的最大值；例 1 里倾角小于$26.6^\circ$时，静摩擦力等于$mg\sin\theta$，随倾角变化。
- 「物体在运动，受的就是:term[滑动摩擦力]{id="physics.newtonian-mechanics.kinetic-friction"}。」要看接触面之间有没有相对滑动：汽车正常转弯时轮胎不打滑，受的是静摩擦力（例 2）。

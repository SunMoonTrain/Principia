---
id: physics.newtonian-mechanics.gravitation
title: |
  万有引力定律
goal: |
  会用万有引力定律求圆轨道的速度和周期，以及地面附近的重力加速度。
prerequisites: [physics.newtonian-mechanics.circular-dynamics]
minutes: 28
summary: |
  万有引力$F=\frac{Gm_1m_2}{r^2}$提供卫星的向心力，也决定地面的$g=\frac{GM}{R^2}$。
status: reviewed
---

## 这一节要回答的问题

苹果从树上落下，月球却一直绕着地球转。让苹果下落的:term[力]{id="physics.newtonian-mechanics.force"}（force）和拉住月球的力是同一种力吗？人造卫星要飞多快才能绕地球转下去，离地面越高的卫星，转得越快还是越慢？

## 讲解

### 万有引力定律

::anchor{id="def-gravitation"}
:term[万有引力定律]{id="physics.newtonian-mechanics.law-of-gravitation"}（law of universal gravitation）：任意两个质点都相互吸引，:term[吸引力]{id="physics.newtonian-mechanics.force"}沿两者的连线，大小和两者:term[质量]{id="physics.newtonian-mechanics.mass"}（mass）的乘积成正比、和距离的平方成反比，$F=\frac{Gm_1m_2}{r^2}$。这种吸引叫作:term[万有引力]{id="physics.newtonian-mechanics.gravitation"}（gravitation），简称引力；比例系数$G=6.674\,30\times10^{-11}\,\mathrm{N\,m^2/kg^2}$叫作:term[引力常量]{id="physics.newtonian-mechanics.gravitational-constant"}（gravitational constant）。

为什么这样定义：牛顿猜想，让苹果下落的力也拉着月球。月球离地心约$60$个地球半径，引力若和距离的平方成反比，月球的:term[加速度]{id="physics.newtonian-mechanics.acceleration"}（acceleration）应是地面上的$g$的$\frac1{60^2}$，约$2.7\times10^{-3}\,\mathrm{m/s^2}$；由月球的轨道半径$3.84\times10^8\,\mathrm m$和周期$27.3$天算出的:term[向心加速度]{id="physics.newtonian-mechanics.centripetal-acceleration"}（centripetal acceleration）$\frac{4\pi^2r}{T^2}$正是这么大。边界情况：$G$极小，相距$1\,\mathrm m$的两个$1\,\mathrm{kg}$的质点，引力只有$6.7\times10^{-11}\,\mathrm N$，日常物体之间的引力察觉不到，直到 1798 年卡文迪什（Cavendish）才用扭秤（torsion balance）在实验室里测出它；地球、太阳的质量极大，它们的引力才显著。

### 重力加速度

地球不是质点。下面把地球、月球、太阳都当作:term[质量]{id="physics.newtonian-mechanics.mass"}集中在球心的质点；对质量球对称分布的球体，这样算出它对外面的质点的:term[引力]{id="physics.newtonian-mechanics.gravitation"}恰好准确，证明见[球壳定理](lesson:physics.newtonian-mechanics.shell-theorem)。

::anchor{id="thm-surface-gravity"}
定理：把地球当作质量$M$集中在地心的质点，不计地球的自转，地面附近的:term[重力加速度]{id="physics.newtonian-mechanics.gravitational-acceleration"}（gravitational acceleration）是$g=\frac{GM}{R^2}$，$R$是地球的半径；离地面高$h$处是$\frac{GM}{(R+h)^2}$。

证明思路：地面附近物体受的:term[重力]{id="physics.newtonian-mechanics.weight"}（weight）$mg$就是地球对它的引力，$mg=\frac{GMm}{R^2}$，约去物体的质量$m$即得；高$h$处把$R$换成$R+h$。

引力和质量成正比，$m$约掉了，所以各种物体下落的:term[加速度]{id="physics.newtonian-mechanics.acceleration"}相同。反过来，量出$g$和$R$，就能求出地球的质量（例 2）。$g$随高度减小得很慢：离地面$400\,\mathrm{km}$的空间站那里，$g$仍有地面的$88\%$。地球的自转对$g$的影响不到$0.4\%$，这一节不计。

### 圆轨道

::anchor{id="thm-circular-orbit"}
定理：卫星只受:term[质量]{id="physics.newtonian-mechanics.mass"}为$M$的天体的:term[引力]{id="physics.newtonian-mechanics.gravitation"}，绕它做半径为$r$的:term[匀速圆周运动]{id="physics.newtonian-mechanics.uniform-circular-motion"}（uniform circular motion），把天体当作不动的质点，卫星的:term[速率]{id="physics.newtonian-mechanics.speed"}（speed）是$v=\sqrt{\frac{GM}r}$，周期是$T=2\pi\sqrt{\frac{r^3}{GM}}$。

证明思路：引力是卫星受的全部:term[力]{id="physics.newtonian-mechanics.force"}，指向圆心，它就是:term[向心力]{id="physics.newtonian-mechanics.centripetal-force"}（centripetal force）：$\frac{GMm}{r^2}=\frac{mv^2}r$，解出$v$；再由$T=\frac{2\pi r}v$得到周期。

卫星的质量约掉了，同一条轨道上，大卫星和小卫星跑得一样快。轨道半径越大，速率越小，周期越长；$\frac{T^2}{r^3}=\frac{4\pi^2}{GM}$对绕同一个天体的所有圆轨道都相同，这是:term[开普勒第三定律]{id="physics.newtonian-mechanics.keplers-third-law"}（Kepler's third law）在圆轨道时的样子，椭圆轨道的情形见[开普勒定律与轨道方程](lesson:physics.newtonian-mechanics.kepler-orbits)。天体其实也被卫星拉着动，卫星的质量比天体小得多时可以不计，否则见[二体问题与约化质量](lesson:physics.newtonian-mechanics.two-body-problem)。

::anchor{id="def-first-cosmic-velocity"}
贴着地面绕地球做圆周运动的速率$v_1=\sqrt{\frac{GM}R}=\sqrt{gR}\approx7.9\,\mathrm{km/s}$，叫作:term[第一宇宙速度]{id="physics.newtonian-mechanics.first-cosmic-velocity"}（first cosmic velocity），也叫环绕速度。

为什么这样定义：牛顿设想，在高山上水平发射炮弹，不计空气，:term[速度]{id="physics.newtonian-mechanics.velocity"}（velocity）越大，炮弹落得越远；速度大到炮弹下落的弯曲正好赶上地面的弯曲，它就绕着地球转起来。圆轨道的半径越小，速率越大，所以$v_1$是绕地球做圆周运动的最大速率。边界情况：实际的卫星在大气层以外，离地面$400\,\mathrm{km}$的空间站速率约$7.7\,\mathrm{km/s}$；水平抛出的速率小于$v_1$时，引力比贴着地面转圈需要的向心力大，物体落回地面。

## 几何图像

:::anim{component="function-plot"}
range: { x: [1, 7], y: [0, 26] }
functions:
  - expr: "7.90*sqrt(k/x)"
    label: |
      速率$v$（$\mathrm{km/s}$）
  - expr: "1.407*sqrt(x^3/k)"
    label: |
      周期$T$（$\mathrm h$）
sliders:
  - name: k
    min: 0.5
    max: 2
    step: 0.05
    default: 1
    label: |
      中心天体的质量是地球的$k$倍
:::

横轴是圆轨道的半径$r$和地球半径$R$之比，图上写作$x$；蓝线是卫星的:term[速率]{id="physics.newtonian-mechanics.speed"}（单位$\mathrm{km/s}$），橙线是周期（单位$\mathrm h$），鼠标所在处的数值显示在图例里。$k=1$时是绕地球的轨道：贴着地面时速率约$7.9\,\mathrm{km/s}$、周期约$84$分钟；半径越大，速率越小，周期越长，而且周期比半径增长得快。拖动$k$，中心天体的:term[质量]{id="physics.newtonian-mechanics.mass"}变成地球的$k$倍，横轴的单位仍是地球半径：同一个半径上，速率按$\sqrt k$增大，周期按$\sqrt k$缩短。

## 例题

### 例 1　地球同步卫星

地球同步卫星（geostationary satellite）在赤道上空绕地球转，周期和地球相对恒星自转一周的时间相同，约$86164\,\mathrm s$，所以总停在赤道上某一点的正上方。它离地面多高，:term[速率]{id="physics.newtonian-mechanics.speed"}多大？地球的:term[质量]{id="physics.newtonian-mechanics.mass"}取$5.97\times10^{24}\,\mathrm{kg}$，半径取$6.37\times10^6\,\mathrm m$。

**为什么想到这么做**：卫星绕地球做:term[匀速圆周运动]{id="physics.newtonian-mechanics.uniform-circular-motion"}，周期已知，由圆轨道的周期公式反解出半径，再减去地球的半径。

**推导**：$r=\Bigl(\frac{GMT^2}{4\pi^2}\Bigr)^{1/3}=\Bigl(\frac{6.674\times10^{-11}\times5.97\times10^{24}\times86164^2}{4\pi^2}\Bigr)^{1/3}\approx4.22\times10^7\,\mathrm m$，约为地球半径的$6.6$倍；离地面$r-R\approx3.58\times10^7\,\mathrm m$，约$3.6$万千米。速率$v=\frac{2\pi r}T\approx3.07\,\mathrm{km/s}$，比$7.9\,\mathrm{km/s}$小得多。

### 例 2　称量地球

卡文迪什测出$G$以后，人们说他「称量了地球」。$g$取$9.8\,\mathrm{m/s^2}$，地球半径取$6.37\times10^6\,\mathrm m$，求地球的:term[质量]{id="physics.newtonian-mechanics.mass"}和平均密度。

**为什么想到这么做**：由$g=\frac{GM}{R^2}$，知道了$G$、$g$和$R$，就能反解出$M$；再除以地球的体积。

**推导**：$M=\frac{gR^2}G=\frac{9.8\times(6.37\times10^6)^2}{6.674\times10^{-11}}\approx5.96\times10^{24}\,\mathrm{kg}$。地球的体积是$\frac43\pi R^3\approx1.08\times10^{21}\,\mathrm{m^3}$，平均密度约$5.50\times10^3\,\mathrm{kg/m^3}$，是地表岩石（约$2.7\times10^3\,\mathrm{kg/m^3}$）的两倍，说明地球内部的物质比地表密得多。

## 常见误区

- 「空间站里的宇航员飘着，是因为那里没有:term[重力]{id="physics.newtonian-mechanics.weight"}。」离地面$400\,\mathrm{km}$处，地球的:term[引力]{id="physics.newtonian-mechanics.gravitation"}仍有地面上的$88\%$。宇航员和空间站都只受引力，:term[加速度]{id="physics.newtonian-mechanics.acceleration"}相同，宇航员用不着压在地板上，见[平动加速参考系与惯性力](lesson:physics.newtonian-mechanics.accelerating-frames)。
- 「离地面越高的卫星跑得越快。」圆轨道的:term[速率]{id="physics.newtonian-mechanics.speed"}$\sqrt{\frac{GM}r}$随半径增大而减小，高轨道上的卫星跑得慢，周期也长。
- 「地球吸引苹果，苹果不吸引地球。」引力是相互的，苹果对地球的引力和地球对苹果的一样大，只是地球的:term[质量]{id="physics.newtonian-mechanics.mass"}太大，它的加速度小得测不出来。

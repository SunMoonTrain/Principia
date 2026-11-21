---
id: physics.general-relativity.gps-clocks
title: |
  全球定位系统里的相对论
goal: |
  会把时间延缓和引力红移结合起来，算出 GPS 卫星的时钟每天要修正多少。
prerequisites: [physics.general-relativity.gravitational-redshift]
minutes: 27
summary: |
  GPS 卫星的钟因引力变快、因速度变慢，比地面的每天净快约$38.5\,\mu\mathrm s$。
status: reviewed
---

## 这一节要回答的问题

全球定位系统（Global Positioning System，GPS）的接收机靠卫星发来的时间信号算距离。[时间延缓](lesson:physics.special-relativity.time-dilation)一节的例 2 算出，卫星的钟因为运动每天慢约$7.2\,\mu\mathrm s$，又说引力的效应更大。卫星的钟到底每天快多少，出厂时怎样修正？

## 讲解

### 靠钟测距

GPS 的约 30 颗卫星在离地面约两万千米的轨道上，各带几台原子钟（atomic clock），播发的信号里写着按卫星的钟的发出时刻。接收机用收到的时刻减去它，乘以光速就是到这颗卫星的距离；$1\,\mathrm{ns}$对应约$30\,\mathrm{cm}$，卫星的钟要和约定的时间对准到纳秒。收到四颗卫星的信号，就能解出三个坐标和接收机自己的钟差。

### 地心参考系

[时间延缓](lesson:physics.special-relativity.time-dilation)例 2 里不计地球自转的「地面参考系」，说清楚就是：

::anchor{id="def-geocentric-frame"}
原点在地心、坐标轴指向遥远的恒星、不随地球转动的参考系，叫作地心参考系（Earth-centered inertial frame）。

为什么这样定义：它跟着地球一起绕太阳自由下落，日、月给地球和它附近的东西的加速度几乎一样（太阳的见[万有引力定律](lesson:physics.newtonian-mechanics.gravitation)第 7 题），它们的引力在这里只剩:term[潮汐力]{id="physics.general-relativity.tidal-force"}（tidal force），对钟的影响在 GPS 轨道处不超过约$10^{-15}$，比要修正的量小五个数量级以上，可以不计。地球自己的引力却抵消不掉，要用:term[引力势]{id="physics.general-relativity.gravitational-potential"}（gravitational potential）算进去；说它近似是惯性系（inertial frame），只是对钟的速度那一项说的。边界情况：它不是:term[局部惯性系]{id="physics.general-relativity.local-inertial-frame"}（local inertial frame），只受引力的卫星在里面绕地球转，不做匀速直线运动。

赤道上的地面钟随自转以约$465\,\mathrm{m/s}$运动（[圆周运动](lesson:physics.newtonian-mechanics.circular-motion)例 1），每天因此慢约$0.10\,\mu\mathrm s$，下面先不计。

### 两种效应合起来

::anchor{id="thm-clock-rate"}
定理：在地心参考系里，把地球的:term[引力场]{id="physics.general-relativity.gravitational-field"}（gravitational field）看作静态（static）的，不计日、月的:term[潮汐力]{id="physics.general-relativity.tidal-force"}；在:term[引力势]{id="physics.general-relativity.gravitational-potential"}为$\Phi$处以速率$u$运动的钟（取离地球很远处$\Phi=0$，$|\Phi|\ll c^2$，$u\ll c$），快慢满足$\dv{\tau}{t}\approx1+\frac{\Phi}{c^2}-\frac{u^2}{2c^2}$，$t$是这个参考系里离地球很远处静止的钟的读数。

证明思路：每一时刻在钟所在处放一只静止的钟作对照，由[引力红移](lesson:physics.general-relativity.gravitational-redshift#thm-redshift-potential)一节的定理，对照的钟和远处的钟快慢之比约为$1+\frac{\Phi}{c^2}$。在和对照的钟此刻同速的:term[局部惯性系]{id="physics.general-relativity.local-inertial-frame"}里，运动的钟以约$u$运动；按时钟假设（clock hypothesis），快慢只看此刻的速度，由固有时（proper time）的算法（见[时空间隔与固有时](lesson:physics.special-relativity.spacetime-interval#def-proper-time-worldline)），它和对照的钟快慢之比约为$\sqrt{1-\frac{u^2}{c^2}}\approx1-\frac{u^2}{2c^2}$。两个比相乘，略去两个小量的乘积，就是上式。

卫星的钟减去地面的钟：

$$
\dv{\tau_{\text{星}}}t-\dv{\tau_{\text{地}}}t\approx\frac{\Phi_{\text{星}}-\Phi_{\text{地}}}{c^2}-\frac{u_{\text{星}}^2-u_{\text{地}}^2}{2c^2} .
$$

前一项来自引力，是:term[引力时间延缓]{id="physics.general-relativity.gravitational-time-dilation"}（gravitational time dilation）；后一项来自速度，是狭义相对论的时间延缓（time dilation）。把地球当作地心处质量为$M$的质点，$\Phi=-\frac{GM}r$；卫星沿半径为$r$的圆轨道运动，由[万有引力定律](lesson:physics.newtonian-mechanics.gravitation#thm-circular-orbit)的圆轨道定理，$u_{\text{星}}^2=\frac{GM}r$（那里的$v$就是$u_{\text{星}}$）。地面的钟在$r=R$处，不计$u_{\text{地}}$，得

$$
\dv{\tau_{\text{星}}}t-\dv{\tau_{\text{地}}}t\approx\frac{GM}{c^2}\Bigl(\frac1R-\frac1r\Bigr)-\frac{GM}{2rc^2}=\frac{GM}{c^2}\Bigl(\frac1R-\frac3{2r}\Bigr) .
$$

## 几何图像

:::anim{component="function-plot"}
range: { x: [1, 5], y: [-35, 55] }
functions:
  - expr: "-30.02/x"
    label: |
      速度项（$\mu\mathrm s$）
  - expr: "60.05*(1 - 1/x)"
    label: |
      引力项（$\mu\mathrm s$）
  - expr: "60.05*(1 - 1.5/x)"
    label: |
      合计（$\mu\mathrm s$）
:::

横轴是圆轨道的半径$r$和地球半径$R$之比，图上写作 x；纵轴是卫星的钟每天比地面的钟多走的时间，负的表示少走，数取得和例 1 一样（$\frac{GM}{Rc^2}\times86400\,\mathrm s\approx60.05\,\mu\mathrm s$）。蓝线是速度项，橙线是引力项，绿线是两者之和：GPS 卫星在$x\approx4.18$处（例 1），绿线在$x=1.5$处穿过零（例 2）。

## 例题

### 例 1　GPS 卫星的钟每天快多少

[时间延缓](lesson:physics.special-relativity.time-dilation)例 2 把 GPS 卫星当作以$v=3.87\,\mathrm{km/s}$运动的参考系，这个$v$就是卫星在地心参考系里沿圆轨道运动的速率$u_{\text{星}}$。卫星的钟每天比地面的钟快多少？出厂时要把标称$10.23\,\mathrm{MHz}$的钟的频率调低多少？$G$取$6.674\times10^{-11}\,\mathrm{N\,m^2/kg^2}$，地球的质量$M=5.97\times10^{24}\,\mathrm{kg}$、半径$R=6.37\times10^6\,\mathrm m$，$c$取$3.00\times10^8\,\mathrm{m/s}$，不计地球自转。

**为什么想到这么做**：由圆轨道的速率求出半径，再代进上面卫星的钟减地面的钟的式子；频率按同样的相对量调低。

**推导**：$r=\frac{GM}{u_{\text{星}}^2}\approx2.66\times10^7\,\mathrm m$。引力项$\frac{GM}{c^2}\bigl(\frac1R-\frac1r\bigr)\approx5.286\times10^{-10}$，一天$86400\,\mathrm s$里快约$45.7\,\mu\mathrm s$；速度项$\frac{u_{\text{星}}^2}{2c^2}\approx8.32\times10^{-11}$，一天慢约$7.2\,\mu\mathrm s$，和[时间延缓](lesson:physics.special-relativity.time-dilation)例 2 一致。合起来相对量约$4.454\times10^{-10}$，每天快约$38.5\,\mu\mathrm s$，引力的效应确实更大；按光速折成距离，一天就差约$11.5\,\mathrm{km}$。

出厂时把频率调低同样的相对量，$10.23\,\mathrm{MHz}\times4.454\times10^{-10}\approx4.56\times10^{-3}\,\mathrm{Hz}$，升空以后它就照地面约定的时间走。实际用的是$4.4647\times10^{-10}$（调低约$4.567\times10^{-3}\,\mathrm{Hz}$），比这里算的大约$1\times10^{-12}$，还计入了地面的钟随自转的那一项（约$1.2\times10^{-12}$）等细节。

### 例 2　和地面的钟一样快的轨道

圆轨道的半径多大时，卫星的钟和地面的钟走得一样快？不计地球自转。

**为什么想到这么做**：要引力项和速度项正好抵消，令上面的差为零。

**推导**：$\frac1R-\frac3{2r}=0$，$r=\frac32R$，离地面约$3.2\times10^3\,\mathrm{km}$，和地球的质量、光速都无关。比这低的轨道速度项占上风，卫星的钟比地面的慢，离地面约$400\,\mathrm{km}$的空间站就是这样；比这高的引力项占上风，钟比地面的快。

## 常见误区

- 「引力项按:term[均匀引力场]{id="physics.general-relativity.gravitational-field"}的$\frac{gh}{c^2}$算就行，$h$取卫星离地面的高度。」$g$随高度一路变小（见[引力红移](lesson:physics.general-relativity.gravitational-redshift)一节的图），按地面的$g$算每天约$190\,\mu\mathrm s$，是例 1 引力项的四倍多，要用:term[引力势]{id="physics.general-relativity.gravitational-potential"}之差。
- 「发射前把卫星的钟和地面的钟对准一次，以后就一直准。」两只钟快慢不同，对准了也会越差越远，所以要调低频率，地面站还要经常测、经常改；[同时的相对性](lesson:physics.special-relativity.relativity-of-simultaneity)里对一次就够，是因为那里的钟都静止在同一个惯性系里，走得一样快。

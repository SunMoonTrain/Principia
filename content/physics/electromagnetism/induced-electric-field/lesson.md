---
id: physics.electromagnetism.induced-electric-field
title: |
  感生电场
goal: |
  会写出法拉第定律的微分形式$\curl\vb{E}=-\pdv{\vb{B}}{t}$，并求变化的磁场产生的感生电场。
prerequisites: [physics.electromagnetism.faraday-law]
minutes: 35
summary: |
  变化的磁场产生绕着它转的电场：$\curl\vb E=-\pdv{\vb B}t$。
status: reviewed
---

## 这一节要回答的问题

不动的线圈放在变化的:term[磁场]{id="physics.electromagnetism.magnetic-field"}（magnetic field）里，线圈里也有:term[感应电动势]{id="physics.electromagnetism.induced-emf"}（induced electromotive force）。导线不动，里面的:term[电荷]{id="physics.electromagnetism.electric-charge"}（electric charge）不受磁力，推动它们的是什么？[泊松方程与拉普拉斯方程](lesson:physics.electromagnetism.poisson-equation)第 8 题里那种绕着圈、旋度不为零的:term[电场]{id="physics.electromagnetism.electric-field"}（electric field），有没有真实的来源？没有导线的地方，它也存在吗？

## 讲解

### 感生电场

:term[法拉第定律]{id="physics.electromagnetism.faraday-law"}（Faraday's law of induction）对不动的回路也成立。回路上的:term[电荷]{id="physics.electromagnetism.electric-charge"}原来静止，磁力$q\vb v\times\vb B$是零，能推动静止电荷的只有:term[电场]{id="physics.electromagnetism.electric-field"}。所以变化的:term[磁场]{id="physics.electromagnetism.magnetic-field"}在周围产生了电场，:term[感应电动势]{id="physics.electromagnetism.induced-emf"}就是它沿回路的积分：$\oint_C\vb E\cdot\dd\vb l=-\dv{}{t}\int_S\vb B\cdot\dd\vb a$，$S$是以$C$为边界的曲面。

::anchor{id="def-induced-field"}
变化的磁场在周围产生的电场叫作:term[感生电场]{id="physics.electromagnetism.induced-electric-field"}（induced electric field）；它沿任一不动的闭合曲线$C$的积分，等于穿过$C$的:term[磁通量]{id="physics.electromagnetism.magnetic-flux"}（magnetic flux）的变化率的负值。

为什么这样定义：它和电荷产生的电场一样推动电荷、对电荷做功，用:term[试探电荷]{id="physics.electromagnetism.test-charge"}（test charge）去量也分不出来，所以同样叫电场。单独起名，是因为它不是电荷产生的，沿闭合曲线的积分不为零，没有:term[电势]{id="physics.electromagnetism.electric-potential"}（electric potential）可言（见[静电场是保守场](lesson:physics.electromagnetism.electric-potential#thm-conservative)）。边界情况：感生电场不需要导线，真空里照样存在；导线只是让电荷能沿着它流动，形成:term[电流]{id="physics.electromagnetism.electric-current"}（electric current）。

::anchor{id="thm-faraday-differential"}
定理（法拉第定律的微分形式）：电场和磁场满足$\curl\vb E=-\pdv{\vb B}t$，$\vb E$是总的电场；电荷产生的那部分旋度为零，不影响这个式子。

证明思路：取一个不随时间变的曲面$S$和它的边界$C$，由斯托克斯公式（Stokes' theorem），$\oint_C\vb E\cdot\dd\vb l=\int_S(\curl\vb E)\cdot\dd\vb a$。曲面不动、$\pdv{\vb B}t$连续时，求导可以移进积分号（[积分号下求导](lesson:math.analysis.parameter-integrals#thm-leibniz-rule)），右边是$-\int_S\pdv{\vb B}t\cdot\dd\vb a$。两边对任意小的曲面都相等，被积函数连续，只能处处相等（和[静磁场的散度和旋度](lesson:physics.electromagnetism.ampere-law#thm-ampere-differential)的推理一样）。

电场有两个来源：电荷决定它的散度（见[高斯定律的微分形式](lesson:physics.electromagnetism.gauss-differential)），变化的磁场决定它的旋度。静电场是旋度为零的特例；有变化的磁场时，电场不能写成一个电势的负梯度，两点之间的「:term[电势差]{id="physics.electromagnetism.potential-difference"}（potential difference）」和走的路径有关（第 6 题）。

和:term[安培环路定理]{id="physics.electromagnetism.ampere-law"}（Ampère's circuital law）对照：没有电荷的地方，$\curl\vb E=-\pdv{\vb B}t$、$\divg\vb E=0$，和$\curl\vb B=\mu_0\vb J$、$\divg\vb B=0$形式一样。感生电场绕着变化的磁场转，就像磁场绕着电流转，$-\pdv{\vb B}t$相当于$\mu_0\vb J$；所以有对称性时，例如长:term[螺线管]{id="physics.electromagnetism.solenoid"}（solenoid）里的磁场在变，可以像用安培环路定理求磁场那样求感生电场。

### 长螺线管周围的感生电场

::anchor{id="thm-solenoid-field"}
定理（长:term[螺线管]{id="physics.electromagnetism.solenoid"}的:term[感生电场]{id="physics.electromagnetism.induced-electric-field"}）：半径为$R$的长螺线管里，:term[磁场]{id="physics.electromagnetism.magnetic-field"}均匀、沿轴，大小$B(t)$在变化；离轴$s$处的感生电场沿$\uv\psi$方向，管内$E_\psi=-\frac s2\dv Bt$，管外$E_\psi=-\frac{R^2}{2s}\dv Bt$。

证明思路：磁场的分布绕轴转动、沿轴平移都不变，没有:term[电荷]{id="physics.electromagnetism.electric-charge"}时感生电场也有这样的对称性。它没有沿$\uv s$的分量，否则穿过以轴为中心的圆柱面的:term[电通量]{id="physics.electromagnetism.electric-flux"}（electric flux）不为零，和$\divg\vb E=0$矛盾；它也没有沿轴的分量，取一个在过轴平面里的矩形回路，磁场平行于这个平面，穿过的:term[磁通量]{id="physics.electromagnetism.magnetic-flux"}为零，所以沿轴的分量处处相同，而远处为零。剩下$\uv\psi$分量，取以轴为心、半径为$s$的圆：$2\pi sE_\psi=-\dv{}{t}(\pi s^2B)$（管内）或$-\dv{}{t}(\pi R^2B)$（管外）。

管外的磁场是零，感生电场却不是零：螺线管里的磁场变化，在远处也产生:term[电场]{id="physics.electromagnetism.electric-field"}，就像:term[电流]{id="physics.electromagnetism.electric-current"}在远处产生磁场一样。$\dv Bt>0$时，从磁场指向的一侧看去，感生电场沿顺时针方向，在管外放一圈导线，电流也沿顺时针方向，它的磁场在线圈里和原来的磁场反向，正是:term[楞次定律]{id="physics.electromagnetism.lenz-law"}（Lenz's law）。

### 涡电流

::anchor{id="def-eddy"}
大块的:term[导体]{id="physics.electromagnetism.conductor"}（conductor）放在变化的:term[磁场]{id="physics.electromagnetism.magnetic-field"}里，:term[感生电场]{id="physics.electromagnetism.induced-electric-field"}在导体里推动:term[电荷]{id="physics.electromagnetism.electric-charge"}沿着闭合的路径流动，这种:term[电流]{id="physics.electromagnetism.electric-current"}叫作:term[涡电流]{id="physics.electromagnetism.eddy-current"}（eddy current）。

为什么这样定义：导体里没有导线限定电流走哪条路，感生电场绕着变化的磁场转，电流也跟着绕圈，像水里的漩涡。涡电流在导体里放出:term[焦耳热]{id="physics.electromagnetism.joule-heating"}（Joule heating），又按:term[楞次定律]{id="physics.electromagnetism.lenz-law"}阻碍导体和磁场的相对运动。边界情况：材料的:term[电阻率]{id="physics.electromagnetism.resistivity"}（resistivity）越大，涡电流越小；把铁芯切成彼此绝缘的薄片，切断了绕大圈的电流路径，涡电流就大大减小（第 5 题）。

1824 年，阿拉戈（François Arago）发现转动的铜盘能带着上面吊着的磁针一起转，法拉第后来用:term[电磁感应]{id="physics.electromagnetism.electromagnetic-induction"}（electromagnetic induction）解释了这个现象；1855 年，傅科（Léon Foucault）发现在磁铁两极之间转动铜盘要费更大的力，铜盘还会发热。电磁炉、金属探测器、一些列车和过山车的电磁制动，用的都是涡电流。

## 几何图像

:::anim{component="vector-field-2d"}
field: { x: "k*y*R^2/max(x^2 + y^2, R^2)", y: "-k*x*R^2/max(x^2 + y^2, R^2)" }
range: { x: [-3, 3], y: [-3, 3] }
dt: 0.02
particles: 300
sliders:
  - name: k
    min: -1
    max: 1
    step: 0.5
    default: 1
    label: |
      磁场的变化率$\dv Bt$
  - name: R
    min: 0.5
    max: 2
    step: 0.5
    default: 1
    label: |
      螺线管的半径$R$
:::

动画画的是长:term[螺线管]{id="physics.electromagnetism.solenoid"}横截面上的:term[感生电场]{id="physics.electromagnetism.induced-electric-field"}：:term[磁场]{id="physics.electromagnetism.magnetic-field"}垂直屏幕向外，只在半径为$R$的圆里，滑块$k$是它的变化率。$k>0$（磁场增强）时:term[电场]{id="physics.electromagnetism.electric-field"}顺时针绕圈，$k<0$时逆时针，$k=0$时没有电场，粒子停下。管里电场和离轴的距离成正比，管外按$\frac1s$减弱，可是管外并没有磁场。这张图和[安培环路定理](lesson:physics.electromagnetism.ampere-law)一节里粗导线的磁场一模一样：$-\pdv{\vb B}t$在这里扮演了:term[电流密度]{id="physics.electromagnetism.current-density"}（current density）的角色。

## 例题

### 例 1　螺线管周围的电场

半径$2.0\,\mathrm{cm}$的长:term[螺线管]{id="physics.electromagnetism.solenoid"}里，:term[磁场]{id="physics.electromagnetism.magnetic-field"}以$0.50\,\mathrm{T/s}$的速率均匀增加。求离轴$1.0\,\mathrm{cm}$和$4.0\,\mathrm{cm}$处:term[感生电场]{id="physics.electromagnetism.induced-electric-field"}的大小，以及静止在离轴$4.0\,\mathrm{cm}$处的电子受的力。

**为什么想到这么做**：磁场均匀、沿轴，问题有轴对称，直接用上面的定理；$1.0\,\mathrm{cm}$在管内，$4.0\,\mathrm{cm}$在管外，用不同的式子。

**推导**：管内$E=\frac s2\dv Bt=\frac{0.010}{2}\times0.50\,\mathrm{V/m}=2.5\times10^{-3}\,\mathrm{V/m}$；管外$E=\frac{R^2}{2s}\dv Bt=\frac{(0.020)^2}{2\times0.040}\times0.50\,\mathrm{V/m}=2.5\times10^{-3}\,\mathrm{V/m}$，两处一样大，因为$1.0\times4.0=2.0^2$。电子受的力是$eE\approx1.6\times10^{-19}\times2.5\times10^{-3}\,\mathrm N=4.0\times10^{-22}\,\mathrm N$；从磁场指向的一侧看去，感生电场沿顺时针方向，电子带负电，受的力沿逆时针方向。这么小的:term[电场]{id="physics.electromagnetism.electric-field"}，却能在一圈导线里推动可观的:term[电流]{id="physics.electromagnetism.electric-current"}。

### 例 2　电子感应加速器

电子在真空的环形管里沿半径为$r$的圆周运动，垂直于轨道的:term[磁场]{id="physics.electromagnetism.magnetic-field"}由电磁铁产生，随时间增强。轨道上的磁场$B_{\text{轨}}$使电子绕圈，轨道围住的:term[磁通量]{id="physics.electromagnetism.magnetic-flux"}$\Phi$的变化产生:term[感生电场]{id="physics.electromagnetism.induced-electric-field"}，推动电子加速。要让电子在加速过程中一直沿同一个圆周运动，$B_{\text{轨}}$和$\Phi$要满足什么关系？

**为什么想到这么做**：轨道半径不变，要求电子的动量$p$和$B_{\text{轨}}$一起增长，始终满足$r=\frac{p}{eB_{\text{轨}}}$（见[磁场与洛伦兹力](lesson:physics.electromagnetism.lorentz-force#thm-cyclotron)）；动量增长的快慢由轨道上的感生电场决定。

**推导**：圆轨道要求$p=eB_{\text{轨}}r$。轨道上的感生电场大小是$\frac{1}{2\pi r}\dv{\Phi}{t}$，沿轨道推电子，$\dv pt=eE=\frac{e}{2\pi r}\dv{\Phi}{t}$。两式对时间求导后相比，$\dv{\Phi}{t}=2\pi r^2\dv{B_{\text{轨}}}{t}$，从零开始积分，$\Phi=2\pi r^2B_{\text{轨}}$：轨道围住的平均磁场要是轨道上磁场的$2$倍。1940 年，克斯特（Donald Kerst）在伊利诺伊大学建成第一台这样的加速器，把电子加速到$2.3\,\mathrm{MeV}$。

## 常见误区

- 「:term[感生电场]{id="physics.electromagnetism.induced-electric-field"}也有:term[电势]{id="physics.electromagnetism.electric-potential"}。」它沿闭合曲线的积分不为零，没有处处确定的电势；两点之间的「:term[电势差]{id="physics.electromagnetism.potential-difference"}」和路径有关。
- 「:term[磁场]{id="physics.electromagnetism.magnetic-field"}为零的地方没有感生电场。」长:term[螺线管]{id="physics.electromagnetism.solenoid"}外磁场为零，感生电场却不为零。
- 「感生电场只存在于导线里。」它在真空里照样存在，电子感应加速器里的电子就在真空里被它加速。
- 「电压表接在两点之间，读数只由这两点决定。」有感生电场时，读数和电压表的导线怎样走、包住多少:term[磁通量]{id="physics.electromagnetism.magnetic-flux"}有关（第 6 题）。

---
id: physics.thermal-physics.heat-conduction-diffusion
title: |
  热传导与扩散
goal: |
  会仿照黏性的推导求出气体的热导率和扩散系数，并说明三个输运系数之间的关系。
prerequisites: [physics.thermal-physics.viscosity, physics.thermal-physics.heat-capacity]
minutes: 30
summary: |
  常压附近，$\kappa\approx\frac13\rho c_Vv_{\mathrm{rms}}\lambda\approx c_V\eta$，和压强无关；$D\approx\frac13v_{\mathrm{rms}}\lambda\approx\frac\eta\rho$，温度不变时和压强成反比。
status: reviewed
---

## 这一节要回答的问题

羽绒服里一层不流动的空气，:term[热量]{id="physics.thermal-physics.heat"}（heat）很难穿过；没有风，香水分子也会慢慢散开。它们在静止的气体里怎样「走」过去，和[气体的黏性](lesson:physics.thermal-physics.viscosity)里分子运送动量（momentum）是不是一回事？

## 讲解

### 热传导与傅里叶定律

两块大平板水平放置，相距$h$，中间夹着空气，上板保持较高的:term[温度]{id="physics.thermal-physics.temperature"}（temperature）$T_2$，下板保持$T_1$，热的在上，空气不会对流（convection）。实验发现，稳定后每秒靠:term[热传导]{id="physics.thermal-physics.heat-conduction"}（heat conduction）传过的:term[热量]{id="physics.thermal-physics.heat"}和板的面积$A$、温差成正比，和$h$成反比。

::anchor{id="def-fourier"}
取$z$轴竖直向上，每秒沿$+z$方向穿过单位面积的热量$q$叫作热流密度（heat flux density）。实验表明$q=-\kappa\dv Tz$，这叫作傅里叶定律（Fourier's law）；比例系数$\kappa>0$叫作热导率（thermal conductivity），也叫导热系数，单位是$\mathrm{W/(m\cdot K)}$。

为什么这样定义：温差不大时，两板之间$\dv Tz\approx\frac{T_2-T_1}h$，傅里叶定律正好概括了实验，负号表示热量流向低温处；写成变化率，温度不均匀时也能逐层用（第 5 题）。铜的$\kappa$约为$400\,\mathrm{W/(m\cdot K)}$，空气只有约$0.026\,\mathrm{W/(m\cdot K)}$。

边界情况：气体稀薄到:term[平均自由程]{id="physics.thermal-physics.mean-free-path"}（mean free path）和板距差不多时，傅里叶定律不再成立（第 7 题）；热辐射（thermal radiation）也不归它管。三维的情形见[热方程的推导](lesson:math.pde.heat-equation)。

### 扩散与菲克定律

:term[温度]{id="physics.thermal-physics.temperature"}、压强（pressure）相同的氮气和氧气，抽掉中间的隔板，不搅拌也会慢慢混匀，靠的是分子的:term[热运动]{id="physics.thermal-physics.thermal-motion"}（thermal motion）。最简单的情形：同一种气体里一部分分子做了记号（如换成放射性同位素，radioactive isotope），简称甲分子，高度$z$处每单位体积里甲分子的质量是$\rho_1(z)$，温度、压强处处相同。

::anchor{id="def-diffusion"}
由于分子的热运动，一种分子从它的密度（density）大的地方迁移到密度小的地方，使各处渐渐混合均匀，这种现象叫作:term[扩散]{id="physics.thermal-physics.diffusion"}（diffusion）。每秒沿$+z$方向穿过单位面积的甲分子的质量记作$j$，实验表明$j=-D\dv{\rho_1}z$，这叫作菲克定律（Fick's law）；比例系数$D>0$叫作:term[扩散系数]{id="physics.thermal-physics.diffusion-coefficient"}（diffusion coefficient），单位是$\mathrm{m^2/s}$。

为什么这样定义：扩散是第三种:term[输运现象]{id="physics.thermal-physics.transport-phenomena"}（transport phenomena），输运的是分子本身；菲克定律和傅里叶定律一个样子。边界情况：风把气味吹过来是空气在流动，不算扩散；两种不同的分子互相扩散时，$D$和两种分子都有关。

### 估算热导率和扩散系数

照[气体的黏性](lesson:physics.thermal-physics.viscosity#thm-viscosity)的办法，看分子穿过高度$z_0$处的水平面（几何图像）；高度$z$处的分子平均每个带着某个量$\varphi(z)$。粗略地看，分子都以:term[方均根速率]{id="physics.thermal-physics.rms-speed"}（root-mean-square speed）$v_{\mathrm{rms}}$运动，每秒每单位面积向下、向上穿过平面的各约$\frac16\frac NVv_{\mathrm{rms}}$个，$\frac NV$是:term[数密度]{id="physics.thermal-physics.number-density"}（number density）。向下的分子上一次碰撞约在上方一个:term[平均自由程]{id="physics.thermal-physics.mean-free-path"}$\lambda$处，带着$\varphi(z_0+\lambda)$，向上的带着$\varphi(z_0-\lambda)$；$\lambda$很小，每秒每单位面积沿$+z$方向净带过

$$
\frac16\cdot\frac NVv_{\mathrm{rms}}\bigl[\varphi(z_0-\lambda)-\varphi(z_0+\lambda)\bigr]\approx-\frac13\cdot\frac NVv_{\mathrm{rms}}\lambda\dv{\varphi}z .
$$

黏性（viscosity）里$\varphi=mu$，$m$是分子的质量，$u$是流速。:term[理想气体]{id="physics.thermal-physics.ideal-gas"}（ideal gas）升温$\dd T$时，:term[内能]{id="physics.thermal-physics.internal-energy"}（internal energy）增加$C_V\dd T$（见[热容与焓](lesson:physics.thermal-physics.heat-capacity#thm-cv)），平均每个分子增加$mc_V\dd T$，$c_V=\frac{C_V}{Nm}$是:term[定容比热容]{id="physics.thermal-physics.constant-volume-heat-capacity"}（specific heat capacity at constant volume），所以:term[热传导]{id="physics.thermal-physics.heat-conduction"}里$\dv{\varphi}z=mc_V\dv Tz$。:term[扩散]{id="physics.thermal-physics.diffusion"}里，甲分子占总质量的$\frac{\rho_1}\rho$，$\varphi=m\frac{\rho_1}\rho$，$\rho=\frac NVm$是气体的密度。

::anchor{id="thm-conductivity"}
定理：平均自由程远小于容器的大小时，按方均根速率粗略估算，同一种理想气体的热导率$\kappa\approx\frac13\rho c_Vv_{\mathrm{rms}}\lambda\approx\frac{mc_Vv_{\mathrm{rms}}}{3\sqrt2\,\sigma}$，$\sigma$是:term[碰撞截面]{id="physics.thermal-physics.collision-cross-section"}（collision cross section）。

::anchor{id="thm-diffusion-coefficient"}
定理：理想气体中，平均自由程远小于容器的大小、甲分子和别的分子的质量和大小（几乎）相同时，按方均根速率粗略估算，:term[扩散系数]{id="physics.thermal-physics.diffusion-coefficient"}$D\approx\frac13v_{\mathrm{rms}}\lambda\approx\frac{v_{\mathrm{rms}}\kB T}{3\sqrt2\,\sigma p}$。

证明思路：把两种$\varphi$代进上式，和傅里叶定律、菲克定律比较，再代入$\lambda\approx\frac1{\sqrt2\,\sigma N/V}=\frac{\kB T}{\sqrt2\,\sigma p}$（见[平均自由程](lesson:physics.thermal-physics.mean-free-path#thm-mean-free-path)）。

$\kappa$的第二个式子里没有数密度：和:term[黏度]{id="physics.thermal-physics.viscosity"}（coefficient of viscosity）一样，分子少了，每个却从更远处带来更大的能量差，所以$\kappa$和压强无关，$c_V$不变时随$\sqrt T$增大。$D$却在:term[温度]{id="physics.thermal-physics.temperature"}不变时和压强成反比：要运送的甲分子有多少已由$\rho_1$定下，别的分子只挡路，气体越稀，甲分子每一步走得越远。

### 三个输运系数

把三个估算式放在一起：

$$
\eta\approx\frac13\rho v_{\mathrm{rms}}\lambda ,\qquad\kappa\approx\frac13\rho c_Vv_{\mathrm{rms}}\lambda ,\qquad D\approx\frac13v_{\mathrm{rms}}\lambda .
$$

::anchor{id="thm-transport-relations"}
定理：在上面两条定理的条件下，同一种气体的三个输运系数（transport coefficient）满足$\eta\approx\rho D$、$\kappa\approx c_V\eta$；:term[黏度]{id="physics.thermal-physics.viscosity"}和热导率与压强无关，:term[温度]{id="physics.thermal-physics.temperature"}不变时:term[扩散系数]{id="physics.thermal-physics.diffusion-coefficient"}和压强成反比。

证明思路：三个式子两两相除即得；它们只差在带的是动量、能量还是甲分子。

空气实测的$\frac{\rho D}\eta$、$\frac\kappa{c_V\eta}$都是 1 的量级（第 8 题）：粗估抓住了趋势，系数却不够准，热导率偏得最多（例 1）。

## 几何图像

![三幅并排的示意图，每幅里三条水平线从上到下是 z₀ + λ、z₀、z₀ − λ 三层，中间的虚线是平面 z₀；每幅里有一个分子（蓝色）从 z₀ + λ 向下、一个从 z₀ − λ 向上穿过 z₀。左「黏性」：绿色箭头是各层的流速，上大下小，下面写着 η ≈ (1/3)ρv_rms λ。中「热传导」：灰色横条的长短表示各层的温度，上高下低，下面写着 κ ≈ (1/3)ρc_V v_rms λ。右「扩散」：每层画 4 个分子，实心圆点是甲分子，空心的是别的分子，上层甲分子多、下层少；向下穿过的是甲分子，向上穿过的是别的分子，下面写着 D ≈ (1/3)v_rms λ。示意图，不按比例](three-transports.svg)

上下穿过平面$z_0$的分子一样多，带来的$\varphi$却不一样多：左图带动量（箭头是流速），中图带能量（横条长短表示:term[温度]{id="physics.thermal-physics.temperature"}），右图带甲分子（实心圆点）。都不按比例。

## 例题

### 例 1　由黏度估计热导率

$300\,\mathrm K$时，氦气的:term[黏度]{id="physics.thermal-physics.viscosity"}是$2.0\times10^{-5}\,\mathrm{Pa\cdot s}$，氦的:term[摩尔质量]{id="physics.thermal-physics.molar-mass"}（molar mass）取$4.003\,\mathrm{g/mol}$。按估算式，氦气的热导率约是多少？和实测值$0.155\,\mathrm{W/(m\cdot K)}$差多少？

**为什么想到这么做**：黏度好测，又有$\kappa\approx c_V\eta$；氦是单原子分子（monatomic molecule），$c_V$由$C_{V,\mathrm m}=\frac32R$就能算出。

**推导**：$c_V=\frac{C_{V,\mathrm m}}M=\frac{3R}{2M}\approx3.12\times10^3\,\mathrm{J/(kg\cdot K)}$，所以

$$
\kappa\approx c_V\eta\approx3.12\times10^3\times2.0\times10^{-5}\,\mathrm{W/(m\cdot K)}\approx0.062\,\mathrm{W/(m\cdot K)} .
$$

实测值约是它的 2.5 倍：量级对了，系数偏小（第 8 题）。

### 例 2　扩散穿过房间要多久

$300\,\mathrm K$、1 标准大气压（standard atmosphere）下，把香水分子粗略地当成氮分子，用[平均自由程](lesson:physics.thermal-physics.mean-free-path)例 1 里氮气的数据估计:term[扩散系数]{id="physics.thermal-physics.diffusion-coefficient"}。只靠:term[扩散]{id="physics.thermal-physics.diffusion"}，香味穿过$3.0\,\mathrm m$宽的房间要多久？

**为什么想到这么做**：只要数量级，先估出$D$，再比较要搬多少分子、每秒能搬多少。

**推导**：那里算出$\lambda\approx6.71\times10^{-8}\,\mathrm m$、$v_{\mathrm{rms}}\approx517\,\mathrm{m/s}$，所以

$$
D\approx\frac13\times517\times6.71\times10^{-8}\,\mathrm{m^2/s}\approx1.2\times10^{-5}\,\mathrm{m^2/s} .
$$

香水分子相当于甲分子，在长$L$的一段里铺开时，$\rho_1$的变化率约$\frac{\Delta\rho_1}L$；每单位面积要搬约$\Delta\rho_1L$，每秒只流过约$D\frac{\Delta\rho_1}L$，所以

$$
t\approx\frac{\Delta\rho_1L}{D\Delta\rho_1/L}=\frac{L^2}D\approx7.5\times10^5\,\mathrm s ,
$$

约 9 天。$t\propto L^2$：分子东一步、西一步地乱走，是一种随机游走（random walk，见[布朗运动与扩散](lesson:physics.thermal-physics.brownian-motion)），走$1\,\mathrm{cm}$只要十秒左右，越远越慢。香味几分钟就到，靠的是空气的流动。

## 常见误区

- 「:term[温度]{id="physics.thermal-physics.temperature"}不变时，气体越稀薄，导热越差。」:term[平均自由程]{id="physics.thermal-physics.mean-free-path"}远小于夹层的厚度时，热导率和压强无关；保温瓶要把夹层抽到平均自由程比夹层还厚，才挡得住:term[热传导]{id="physics.thermal-physics.heat-conduction"}（第 7 题）。

---
id: physics.special-relativity.relativistic-doppler
title: |
  相对论多普勒效应
goal: |
  会用四维波矢推出相对论的多普勒公式，并区分纵向和横向多普勒效应。
prerequisites: [physics.special-relativity.four-vectors, physics.oscillations-waves.doppler-effect]
minutes: 35
summary: |
  波的相位在各惯性系相同，由此得到四维波矢和相对论多普勒公式。
status: reviewed
---

## 这一节要回答的问题

声波的多普勒效应（Doppler effect）要分清是波源在动还是观察者在动：两者相对空气的速度不同，频移就不同。光传播不需要介质，只有光源和观察者的相对速度有意义，光的多普勒公式该是什么样？光源从观察者面前横着飞过时，频率变不变？

## 讲解

### 相位与四维波矢

一列平面波（plane wave）的某个分量正比于$\cos(\omega t-\vb k\cdot\vb r)$，$\omega$是角频率（angular frequency），$\vb k$是波矢（wave vector）。相位$\omega t-\vb k\cdot\vb r$数的是波峰：在某个:term[事件]{id="physics.special-relativity.event"}（event）处，波正好是一个波峰，或者探测器从开始到这一刻数过了多少个波峰，这些是事件本身的事实，和用哪个:term[惯性系]{id="physics.special-relativity.inertial-frame"}（inertial frame）描述无关。所以相位在所有惯性系里相同。

::anchor{id="def-four-wavevector"}
角频率为$\omega$、波矢为$\vb k$的平面波，$k^\mu=\bigl(\frac\omega c,\vb k\bigr)$叫作它的:term[四维波矢]{id="physics.special-relativity.four-wavevector"}（four-wavevector）；它的相位可以写成$\omega t-\vb k\cdot\vb r=\eta_{\mu\nu}k^\mu x^\nu$。

为什么这样定义：把时间部分和空间部分合在一起，相位就成了$k$和事件坐标$x$的内积，下面的定理说明$k$按:term[四维矢量]{id="physics.special-relativity.four-vector"}（four-vector）变换。真空中的光$\omega=c|\vb k|$，所以$k\cdot k=\frac{\omega^2}{c^2}-|\vb k|^2=0$，光的四维波矢是:term[类光]{id="physics.special-relativity.lightlike"}（lightlike）的，在每个惯性系里光速都是$c$。边界情况：在水这样的介质里，光的$\omega<c|\vb k|$，四维波矢是:term[类空]{id="physics.special-relativity.spacelike"}（spacelike）的，介质本身挑出了一个特殊的参考系。

::anchor{id="thm-wavevector"}
定理（四维波矢的变换）：相位在所有惯性系里相同，则$k^\mu$是四维矢量：$k'^\mu=\Lambda^\mu{}_\nu k^\nu$。

证明：把四维矢量写成列向量，同一个事件在$S$里是$x$，在$S'$里是$x'=\Lambda x$。相位相同就是对所有$x$有$k'\T\eta\Lambda x=k\T\eta x$，即$k'\T\eta\Lambda=k\T\eta$；$\eta\Lambda$可逆，满足这个式子的$k'$只有一个。由[四维矢量与闵可夫斯基度规](lesson:physics.special-relativity.four-vectors#thm-metric-preserved)，$\Lambda\T\eta\Lambda=\eta$，所以$(\Lambda k)\T\eta\Lambda=k\T\Lambda\T\eta\Lambda=k\T\eta$，$k'=\Lambda k$就是那个解。

### 多普勒公式

::anchor{id="thm-relativistic-doppler"}
定理（相对论多普勒效应）：光源在自己静止的:term[惯性系]{id="physics.special-relativity.inertial-frame"}里发出角频率为$\omega_0$的光，光源相对观察者以速度$v$运动；在观察者的惯性系里，光的传播方向和光源速度的夹角为$\theta$时，观察者测得$\omega=\frac{\omega_0}{\gamma(1-\beta\cos\theta)}$。

证明：取观察者的惯性系为$S$，光源静止的惯性系为$S'$，处于:term[标准位形]{id="physics.special-relativity.standard-configuration"}（standard configuration），光源的速度沿$x$轴。在$S$里光的:term[四维波矢]{id="physics.special-relativity.four-wavevector"}是$k=\frac\omega c(1,\cos\theta,\sin\theta,0)$。变到$S'$，$k'^0=\gamma(k^0-\beta k^1)=\gamma\frac\omega c(1-\beta\cos\theta)$；光源在$S'$里静止，发出的角频率$ck'^0=\omega_0$，所以$\omega_0=\gamma\omega(1-\beta\cos\theta)$，解出$\omega$。

::anchor{id="def-doppler-types"}
$\theta=0$或$\pi$，即光源正对着观察者飞来或背着他飞走时的频移，叫作:term[纵向多普勒效应]{id="physics.special-relativity.longitudinal-doppler"}（longitudinal Doppler effect）：飞来时$\omega=\omega_0\sqrt{\frac{1+\beta}{1-\beta}}$，飞走时$\omega=\omega_0\sqrt{\frac{1-\beta}{1+\beta}}$；在观察者的惯性系里$\theta=\frac\pi2$时的频移$\omega=\frac{\omega_0}{\gamma}$，叫作:term[横向多普勒效应]{id="physics.special-relativity.transverse-doppler"}（transverse Doppler effect）。

为什么这样分：纵向的频移是一阶的，$\omega\approx\omega_0(1\pm\beta)$，声波也有；横向的频移是二阶的，$\frac1\gamma\approx1-\frac{\beta^2}2$，是光源的钟走慢了（:term[时间延缓]{id="physics.special-relativity.time-dilation"}，time dilation），声波的公式里没有。纵向的因子$\sqrt{\frac{1+\beta}{1-\beta}}$恰好是声波两个公式的几何平均：波源运动时是$\frac{1}{1-\beta}$，观察者运动时是$1+\beta$，三者在一阶上相同，二阶上不同。边界情况：「横向」要说清是哪个惯性系里的直角，在光源的静止系里沿$90^\circ$发出的光，观察者测到的反而是蓝移$\gamma\omega_0$（见 p4）。

### 实验检验

1938 年，艾夫斯（Herbert Ives）和斯迪威（George Stilwell）用速度只有光速千分之几的氢离子束发光，同时观察沿运动方向向前、向后发出的光。两条谱线的一阶频移大小相等、方向相反，平均起来抵消；剩下的是平均位置朝红端移动了约$\frac{\beta^2}{2}$，这正是:term[时间延缓]{id="physics.special-relativity.time-dilation"}（例 2）。2014 年的一个实验在储存环里让锂离子以$0.338c$运动，用激光从前、后两个方向测它的谱线，和相对论的公式符合到$2\times10^{-9}$的量级。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 3.1416], y: [0, 3.2] }
functions:
  - expr: "sqrt(1 - b^2)/(1 - b*cos(x))"
    label: |
      相对论：$\frac{\omega}{\omega_0}=\frac{1}{\gamma(1-\beta\cos\theta)}$
  - expr: "1/(1 - b*cos(x))"
    label: |
      声波式的公式：$\frac{1}{1-\beta\cos\theta}$
  - expr: "1"
    label: |
      没有频移
points:
  - { x: "pi/2", y: "sqrt(1 - b^2)" }
sliders:
  - name: b
    min: 0
    max: 0.8
    step: 0.01
    default: 0.5
    label: |
      光源的速度$\beta=v/c$
:::

横轴是观察者:term[惯性系]{id="physics.special-relativity.inertial-frame"}里的夹角$\theta$（弧度，从$0$到$\pi$），纵轴是频率比$\frac{\omega}{\omega_0}$。相对论的曲线处处是声波式公式（波源在介质里运动）的$\frac1\gamma$倍：$\theta=0$附近两者都是蓝移，$\theta=\pi$附近都是红移。标出的点在$\theta=\frac\pi2$，声波式的公式在那里没有频移，相对论给出红移$\frac1\gamma$；不发生频移的方向因此偏向前方。

## 例题

### 例 1　远离的飞船发回的信号

飞船以$0.6c$飞离地球，用自己的钟发出频率为$10\,\mathrm{GHz}$的无线电信号。地球上收到的频率是多少？飞船掉头以$0.6c$飞回时呢？

**为什么想到这么做**：飞船正对着地球飞走或飞来，是:term[纵向多普勒效应]{id="physics.special-relativity.longitudinal-doppler"}，直接用公式；频率和角频率差一个因子$2\pi$，比值相同。

**推导**：飞走时$\sqrt{\frac{1-0.6}{1+0.6}}=\sqrt{\frac14}=\frac12$，收到$5\,\mathrm{GHz}$；飞来时$\sqrt{\frac{1.6}{0.4}}=2$，收到$20\,\mathrm{GHz}$。两个因子互为倒数，乘积是$1$，这一点按声波的公式不成立（$\frac1{1.6}\times\frac1{0.4}\ne1$）。

### 例 2　前后两条谱线的平均

一束离子以速率$\beta c$（$\beta=0.005$）运动，离子静止时发出波长$\lambda_0=486.1\,\mathrm{nm}$的光。在离子束的正前方和正后方各测一次波长。按相对论和按「光在以太里传播、离子相对以太运动」的旧理论，两个波长的平均值各是多少？

**为什么想到这么做**：波长和频率成反比，正前方是$\theta=0$、正后方是$\theta=\pi$。一阶的频移前后相反，取平均就抵消了，剩下二阶的效应。

**推导**：相对论：$\lambda_{\text{前}}=\lambda_0\sqrt{\frac{1-\beta}{1+\beta}}$，$\lambda_{\text{后}}=\lambda_0\sqrt{\frac{1+\beta}{1-\beta}}$，平均值$\frac{\lambda_0}{2}\cdot\frac{(1-\beta)+(1+\beta)}{\sqrt{1-\beta^2}}=\gamma\lambda_0$，比$\lambda_0$长约$\frac{\beta^2}2\lambda_0\approx1.25\times10^{-5}\times486.1\,\mathrm{nm}\approx0.0061\,\mathrm{nm}$。旧理论里光源在以太里运动，$\lambda_{\text{前}}=\lambda_0(1-\beta)$，$\lambda_{\text{后}}=\lambda_0(1+\beta)$，平均值正好是$\lambda_0$。艾夫斯和斯迪威看到的正是这个微小的平移，它是运动的原子钟走慢了的直接证据。

## 常见误区

- 「光的多普勒效应和声波一样，要分清是光源在动还是观察者在动。」光没有介质，公式只含相对速度$\beta$；声波的公式要看各自相对空气的速度。
- 「光源横着飞过时没有频移。」在观察者的:term[惯性系]{id="physics.special-relativity.inertial-frame"}里$\theta=\frac\pi2$时，频率是$\frac{\omega_0}{\gamma}$，这就是:term[横向多普勒效应]{id="physics.special-relativity.transverse-doppler"}。
- 「横向多普勒效应总是红移。」要看是哪个惯性系里的直角：光源静止系里$90^\circ$发出的光，观察者看到的是蓝移（见 p4）。
- 「频率和波长都变了，所以光速也变了。」光的:term[四维波矢]{id="physics.special-relativity.four-wavevector"}在每个惯性系里都是:term[类光]{id="physics.special-relativity.lightlike"}的，$\frac{\omega}{|\vb k|}=c$不变。
- 「多普勒效应只是光走的路程变长或变短造成的。」那只给出一阶的部分，相对论的公式里还有光源:term[时间延缓]{id="physics.special-relativity.time-dilation"}的因子$\frac1\gamma$。

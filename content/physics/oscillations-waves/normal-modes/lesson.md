---
id: physics.oscillations-waves.normal-modes
title: |
  耦合振子与简正模
goal: |
  会求两个耦合振子的简正频率和简正模，并把一般的运动写成简正模的叠加。
prerequisites: [physics.oscillations-waves.simple-harmonic-motion, math.linear-algebra.diagonalization]
minutes: 26
summary: |
  简正频率由$K\vb a=m\omega^2\vb a$给出，一般的运动是各简正模的叠加。
status: reviewed
---

## 这一节要回答的问题

两个物块用弹簧串在两面墙之间，拉开其中一个再放手，两个物块的运动看上去忽大忽小、没有规律。这里面有没有简单的成分？能不能让两个物块一起做:term[简谐运动]{id="physics.oscillations-waves.simple-harmonic-motion"}（simple harmonic motion），那时振得多快？

## 讲解

### 耦合振子

光滑水平面上，两个质量都是$m$的物块串在两面墙之间：左墙和物块 1 之间、物块 2 和右墙之间各是劲度系数（spring constant）为$k$的弹簧，两个物块之间是劲度系数为$\kappa$的弹簧。记两个物块离开平衡位置的位移为$x_1$、$x_2$，向右为正。中间的弹簧伸长了$x_2-x_1$，所以

$$
m\ddot x_1=-kx_1+\kappa(x_2-x_1),\qquad m\ddot x_2=-\kappa(x_2-x_1)-kx_2.
$$

写成矩阵就是$\ddot{\vb x}=-\frac1mK\vb x$，其中$\vb x=\begin{pmatrix}x_1\\x_2\end{pmatrix}$，$K=\begin{pmatrix}k+\kappa&-\kappa\\-\kappa&k+\kappa\end{pmatrix}$。

::anchor{id="def-coupled-oscillators"}
几个振子之间用弹簧之类的东西连着，一个振子的位移会改变另一个振子受的力，这样的一组振子叫作:term[耦合振子]{id="physics.oscillations-waves.coupled-oscillators"}（coupled oscillators）。上面的$\kappa$越小，两个振子之间的耦合越弱。

为什么这样定义：方程里的$\kappa x_2$让物块 1 的加速度依赖物块 2 的位移，反过来也一样，两个方程得一起解，「耦合」说的就是这种互相牵连；在矩阵里，它就是$K$的非对角元。边界情况：$\kappa=0$时两个方程互不相干，就是两个各自振动的振子，不算耦合。

### 简正模

::anchor{id="def-normal-mode"}
各振子的位移都是同一个$\cos(\omega t+\varphi)$乘一个常数，写成$\vb x=\vb a\cos(\omega t+\varphi)$（$\vb a\ne\vb0$是常向量，分量可正可负，负的表示反向），这样的运动叫作:term[简正模]{id="physics.oscillations-waves.normal-mode"}（normal mode），$\omega$叫作这个简正模的:term[简正频率]{id="physics.oscillations-waves.normal-frequency"}（normal frequency）。

为什么这样定义：简正模里各振子的位移之比一直不变，整个系统像一个振子那样做:term[简谐运动]{id="physics.oscillations-waves.simple-harmonic-motion"}，只是各部分振得大小不同、方向可能相反。边界情况：只拉开物块 1、物块 2 不动时放手，不是简正模：开始时$x_2=0$，后来物块 2 动起来，位移之比在变（例 1）。

::anchor{id="thm-normal-modes"}
定理：$\vb x=\vb a\cos(\omega t+\varphi)$是简正模，当且仅当$K\vb a=m\omega^2\vb a$，即$\vb a$是$K$的特征向量（eigenvector），$m\omega^2$是对应的特征值（eigenvalue）。上面的两个物块有两个简正频率：$\omega_1=\sqrt{k/m}$，$\vb a$正比于$(1,1)$；$\omega_2=\sqrt{(k+2\kappa)/m}$，$\vb a$正比于$(1,-1)$。

证明思路：代入方程，$-\omega^2\vb a\cos(\omega t+\varphi)=-\frac1mK\vb a\cos(\omega t+\varphi)$对所有$t$成立，即$K\vb a=m\omega^2\vb a$（见[特征值与特征向量](lesson:math.linear-algebra.eigenvalues#def-eigen)）。$\det(K-\lambda I)=(k+\kappa-\lambda)^2-\kappa^2=0$给出$\lambda=k$、$k+2\kappa$，代回求出特征向量。

第一个简正模里两个物块同向、同样大小地一起振动，中间的弹簧不伸不缩，各自只受旁边那根弹簧的力，所以:term[角频率]{id="physics.oscillations-waves.angular-frequency"}（angular frequency）就是$\sqrt{k/m}$。第二个里两个物块反向振动，中间的弹簧被拉压得最厉害，:term[回复力]{id="physics.oscillations-waves.restoring-force"}（restoring force）更大，振得更快。

### 一般的运动是简正模的叠加

::anchor{id="thm-mode-superposition"}
定理：两个物块的每个运动都可以写成$\vb x=C_1\begin{pmatrix}1\\1\end{pmatrix}\cos(\omega_1t+\varphi_1)+C_2\begin{pmatrix}1\\-1\end{pmatrix}\cos(\omega_2t+\varphi_2)$，常数$C_1$、$C_2$、$\varphi_1$、$\varphi_2$由两个物块的初位置和初速度定。

证明思路：$K$有两个不同的特征值，能对角化（diagonalize）：$K=PDP^{-1}$，$P$的两列是$(1,1)$、$(1,-1)$，$D$的对角元是$k$、$k+2\kappa$（见[对角化](lesson:math.linear-algebra.diagonalization#thm-distinct-independent)）。令$\vb y=P^{-1}\vb x$，即$y_1=\frac{x_1+x_2}2$、$y_2=\frac{x_1-x_2}2$，方程变成$\ddot y_1=-\omega_1^2y_1$、$\ddot y_2=-\omega_2^2y_2$，互不相干。由[简谐运动](lesson:physics.oscillations-waves.simple-harmonic-motion#thm-shm-solution)，$y_1$、$y_2$各是一个:term[简谐运动]{id="physics.oscillations-waves.simple-harmonic-motion"}（或恒为零），$\vb x=P\vb y$就是上式；两个物块的初位置、初速度给出$y_1$、$y_2$的初值，由此定出各自的:term[振幅]{id="physics.oscillations-waves.amplitude"}（amplitude）和:term[初相]{id="physics.oscillations-waves.initial-phase"}（initial phase）。

## 几何图像

:::anim{component="oscillator"}
masses: [1, 1]
springs: [1, c, 1]
initial: [1, s]
dt: 0.01
sliders:
  - name: s
    min: -1
    max: 1
    step: 0.05
    default: 1
    label: |
      物块 2 的初始位移$s$
  - name: c
    min: 0.1
    max: 2
    step: 0.05
    default: 1
    label: |
      中间弹簧的劲度系数$\kappa$（以$k$为单位）
:::

两个物块从静止放开，物块 1 的初始位移是$1$。$s=1$是同向的:term[简正模]{id="physics.oscillations-waves.normal-mode"}，两条曲线重合；$s=-1$是反向的简正模，两条曲线一正一负，振得更快。$s$取别的值时两个简正模叠在一起，每个物块的位移都不再是一条余弦曲线。把$\kappa$调到$0.2$左右、$s$调到$0$，可以看到振动从物块 1 慢慢全部转到物块 2，再转回来（例 2）。

## 例题

### 例 1　只拉开一个物块

三根弹簧一样硬（$\kappa=k$）。把物块 1 拉开$A$、物块 2 留在平衡位置，同时由静止放开，求$x_1(t)$、$x_2(t)$。

**为什么想到这么做**：初始位移$(A,0)$不是特征向量，却能拆成两个:term[简正模]{id="physics.oscillations-waves.normal-mode"}的形状：$(A,0)=\frac A2(1,1)+\frac A2(1,-1)$。两个简正模各自独立地振动，分别算出来再加起来。

**推导**：$\kappa=k$时$\omega_1=\sqrt{k/m}$，$\omega_2=\sqrt{3k/m}$。初速度为零，两个简正模都从最大位移出发，:term[初相]{id="physics.oscillations-waves.initial-phase"}都是$0$，所以$x_1=\frac A2(\cos\omega_1t+\cos\omega_2t)$，$x_2=\frac A2(\cos\omega_1t-\cos\omega_2t)$。$\frac{\omega_2}{\omega_1}=\sqrt3$不是有理数，两个物块永远不会精确地回到开始的状态。

### 例 2　弱耦合时振动来回转移

中间的弹簧很软（$\kappa\ll k$），同样只拉开物块 1。多久以后振动全部转到物块 2 上？

**为什么想到这么做**：解的形式和例 1 一样，只是$\omega_2=\sqrt{(k+2\kappa)/m}$和$\omega_1$很接近；两个:term[频率]{id="physics.oscillations-waves.frequency"}（frequency）相近的余弦相加减，用和差化积。

**推导**：记$\bar\omega=\frac{\omega_1+\omega_2}2$、$\Delta\omega=\omega_2-\omega_1$，和差化积得$x_1=A\cos\frac{\Delta\omega\,t}2\cos\bar\omega t$，$x_2=A\sin\frac{\Delta\omega\,t}2\sin\bar\omega t$。两个物块都以$\bar\omega$快速振动，:term[振幅]{id="physics.oscillations-waves.amplitude"}$A\bigl|\cos\frac{\Delta\omega\,t}2\bigr|$、$A\bigl|\sin\frac{\Delta\omega\,t}2\bigr|$慢慢此消彼长：$t=\frac\pi{\Delta\omega}$时物块 1 停下，振动全部转到物块 2 上，再过$\frac\pi{\Delta\omega}$又转回来。$\kappa\ll k$时$\Delta\omega\approx\omega_1\frac\kappa k$，耦合越弱转得越慢，可总会完全转过去。

## 常见误区

- 「一般的运动里，每个物块都在做:term[简谐运动]{id="physics.oscillations-waves.simple-harmonic-motion"}。」只有:term[简正模]{id="physics.oscillations-waves.normal-mode"}里才是；一般的运动里，每个物块的位移是两个:term[频率]{id="physics.oscillations-waves.frequency"}不同的余弦之和（例 1）。
- 「简正模里各物块的:term[振幅]{id="physics.oscillations-waves.amplitude"}之比由初始条件决定。」比例由$K$的特征向量定，是系统本身的性质；初始条件只决定每个简正模占多少、:term[初相]{id="physics.oscillations-waves.initial-phase"}是多少。
- 「耦合很弱，两个物块就几乎互不影响。」两个物块一样重、两边的弹簧也一样硬时，再弱的耦合也能把振动全部转过去，只是要等更久（例 2）。

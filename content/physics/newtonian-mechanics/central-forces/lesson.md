---
id: physics.newtonian-mechanics.central-forces
title: |
  有心力与有效势
goal: |
  会用角动量守恒把有心力问题化成一维的有效势问题，并判断轨道的类型。
prerequisites: [physics.newtonian-mechanics.gravitational-potential, physics.newtonian-mechanics.angular-momentum, physics.newtonian-mechanics.energy-diagrams, math.calculus.polar-area]
minutes: 29
summary: |
  角动量守恒把径向运动化成有效势$U+\frac{L^2}{2mr^2}$里的一维运动。
status: reviewed
---

## 这一节要回答的问题

有的彗星绕太阳一圈又一圈地转，离太阳时近时远；有的掠过太阳一次，就一去不回。不解出整条轨道，只知道:term[机械能]{id="physics.newtonian-mechanics.mechanical-energy"}（mechanical energy）和:term[角动量]{id="physics.newtonian-mechanics.angular-momentum"}（angular momentum），能不能判断它离太阳最近、最远各是多少，会不会一去不回？

## 讲解

### 极坐标里的速度

质点受:term[有心力]{id="physics.newtonian-mechanics.central-force"}（central force）时，:term[角动量守恒]{id="physics.newtonian-mechanics.conservation-of-angular-momentum"}（conservation of angular momentum），质点始终在过力心$O$、垂直于$\vb L$的平面里运动（见[力矩与角动量](lesson:physics.newtonian-mechanics.angular-momentum#thm-conservation)）。在这个平面里以$O$为极点取极坐标（polar coordinates）$(r,\varphi)$，$x=r\cos\varphi$，$y=r\sin\varphi$。

::anchor{id="thm-polar-velocity"}
定理：质点的极坐标随时间变化，记$v_r=\dv rt$，$\omega=\dv\varphi t$，则质点的:term[速率]{id="physics.newtonian-mechanics.speed"}（speed）满足$v^2=v_r^2+r^2\omega^2$，它对$O$的:term[角动量]{id="physics.newtonian-mechanics.angular-momentum"}的大小是$L=mr^2|\omega|$。

证明思路：对$x=r\cos\varphi$、$y=r\sin\varphi$求导，用乘积法则（product rule）和链式法则（chain rule），$\dv xt=v_r\cos\varphi-r\omega\sin\varphi$，$\dv yt=v_r\sin\varphi+r\omega\cos\varphi$。平方相加，交叉项消掉，得$v^2=v_r^2+r^2\omega^2$。角动量$\vb r\times m\vb v$垂直于运动的平面，它的分量$m\Bigl(x\dv yt-y\dv xt\Bigr)$化简后是$mr^2\omega$。

$v_r$是沿半径的分速度，$r\omega$是垂直于半径的分速度，两者垂直，所以平方相加；角动量只来自垂直于半径的那部分。$\omega$就是位置矢量转动的:term[角速度]{id="physics.newtonian-mechanics.angular-velocity"}（angular velocity）。$L$不变，所以离力心越近，转得越快；位置矢量扫过面积的快慢$\frac12r^2|\omega|=\frac L{2m}$不变，和极坐标下的面积公式$\frac12\int r^2\,\dd\varphi$正好对上。

### 有效势

:term[有心力]{id="physics.newtonian-mechanics.central-force"}的大小只和$r$有关时，由[引力势能与逃逸速度](lesson:physics.newtonian-mechanics.gravitational-potential#thm-radial-work)里的定理，它是:term[保守力]{id="physics.newtonian-mechanics.conservative-force"}（conservative force），:term[势能]{id="physics.newtonian-mechanics.potential-energy"}（potential energy）$U(r)$只和$r$有关。把$\omega^2=\frac{L^2}{m^2r^4}$代进:term[机械能]{id="physics.newtonian-mechanics.mechanical-energy"}，得$E=\frac12mv_r^2+\frac{L^2}{2mr^2}+U(r)$。

::anchor{id="def-effective-potential"}
$U_{\text{eff}}(r)=U(r)+\frac{L^2}{2mr^2}$叫作:term[有效势]{id="physics.newtonian-mechanics.effective-potential"}（effective potential）。于是$E=\frac12mv_r^2+U_{\text{eff}}(r)$，$r$的变化就像:term[质量]{id="physics.newtonian-mechanics.mass"}（mass）为$m$的质点在势能$U_{\text{eff}}$里做一维运动。

为什么这样定义：$\varphi$已经由守恒的$L$消掉，只剩下$r$，[势能曲线与平衡](lesson:physics.newtonian-mechanics.energy-diagrams)里看一维运动的办法全都用得上，$r$只能取$U_{\text{eff}}(r)\le E$的值。多出来的$\frac{L^2}{2mr^2}$就是垂直于半径的那部分运动的:term[动能]{id="physics.newtonian-mechanics.kinetic-energy"}（kinetic energy）$\frac12m(r\omega)^2$，用守恒的$L$写成了$r$的函数。它在$r\to0$时急剧增大，像一堵墙：只要$L\ne0$，$U$在$r\to0$时又比$\frac1{r^2}$降得慢，质点就到不了力心。边界情况：$L=0$时没有这堵墙，质点沿过力心的直线运动。

::anchor{id="def-apsides"}
$U_{\text{eff}}(r)=E$处$v_r=0$，是$r$的:term[转折点]{id="physics.newtonian-mechanics.turning-point"}（turning point）；轨道上$r$最小的点叫作:term[近心点]{id="physics.newtonian-mechanics.pericenter"}（pericenter），$r$最大的点叫作:term[远心点]{id="physics.newtonian-mechanics.apocenter"}（apocenter）。绕太阳的天体的近心点、远心点叫近日点、远日点，绕地球的叫近地点、远地点。

为什么这样定义：轨道离力心最近、最远的地方，决定了轨道占多大的范围，彗星离太阳最近时最亮，也跑得最快。边界情况：在近心点、远心点只是$v_r=0$，质点的:term[速率]{id="physics.newtonian-mechanics.speed"}是$\frac L{mr}$，不是零，:term[速度]{id="physics.newtonian-mechanics.velocity"}（velocity）和位置矢量垂直；圆轨道上$r$处处相同，谈不上近心点、远心点。

### 轨道的类型

::anchor{id="thm-orbit-types"}
定理：质点受指向力心、大小为$\frac k{r^2}$（$k>0$）的:term[力]{id="physics.newtonian-mechanics.force"}（force），:term[势能]{id="physics.newtonian-mechanics.potential-energy"}$U=-\frac kr$，:term[角动量]{id="physics.newtonian-mechanics.angular-momentum"}$L\ne0$。:term[有效势]{id="physics.newtonian-mechanics.effective-potential"}在$r_0=\frac{L^2}{mk}$处最小，最小值是$-\frac{mk^2}{2L^2}$。$E$等于这个最小值时，$r$保持$r_0$，轨道是圆；$E$比它大、又小于零时，$r$在:term[近心点]{id="physics.newtonian-mechanics.pericenter"}和:term[远心点]{id="physics.newtonian-mechanics.apocenter"}之间来回变化，轨道有界；$E\ge0$时只有近心点，$r$能增大到无穷，质点一去不回。

证明思路：$U_{\text{eff}}=-\frac kr+\frac{L^2}{2mr^2}$，$U_{\text{eff}}'(r)=\frac k{r^2}-\frac{L^2}{mr^3}=\frac k{r^3}(r-r_0)$，$r<r_0$时为负，$r>r_0$时为正，所以$U_{\text{eff}}$先减后增，在$r_0$处最小。$r\to0^+$时$U_{\text{eff}}\to+\infty$；$r>\frac{r_0}2$时$U_{\text{eff}}<0$，$r\to+\infty$时趋于$0$。所以高度为$E$的水平线：$E<0$时和曲线交于两点，$E\ge0$时只交于一点。

$U_{\text{eff}}''(r_0)=\frac k{r_0^3}>0$，由[势能曲线与平衡](lesson:physics.newtonian-mechanics.energy-diagrams#thm-stability)里的定理，$r_0$是$r$的:term[稳定平衡]{id="physics.newtonian-mechanics.stable-equilibrium"}（stable equilibrium）位置：圆轨道受到小扰动，$r$只在$r_0$附近来回变化，圆轨道是稳定的。对:term[万有引力]{id="physics.newtonian-mechanics.gravitation"}（gravitation），$k=GMm$，代入$L=mr_0v$得$v=\sqrt{\frac{GM}{r_0}}$，最小值$-\frac{mk^2}{2L^2}=-\frac{GMm}{2r_0}$，和圆轨道的:term[速率]{id="physics.newtonian-mechanics.speed"}、:term[机械能]{id="physics.newtonian-mechanics.mechanical-energy"}都对得上。有界的轨道是什么形状，要解出$r$和$\varphi$的关系，见[开普勒定律与轨道方程](lesson:physics.newtonian-mechanics.kepler-orbits)。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 6], y: [-1.6, 1.0] }
functions:
  - expr: "-1/x"
    label: |
      势能$U=-\frac kr$
  - expr: "-1/x + L^2/(2*x^2)"
    label: |
      有效势$U_{\text{eff}}$
  - expr: "s"
    label: |
      机械能$E$
points:
  - { x: "L^2/(1 + sqrt(1 + 2*s*L^2))", y: "s" }
  - { x: "(1 + sqrt(1 + 2*s*L^2))/(-2*s)", y: "s" }
sliders:
  - name: L
    min: 0.6
    max: 1.6
    step: 0.05
    default: 1
    label: |
      角动量$L$
  - name: s
    min: -1.5
    max: 0.5
    step: 0.01
    default: -0.3
    label: |
      机械能$E$
:::

单位取成$m=k=1$，横轴是$r$，图上写作$x$。蓝线是$U=-\frac kr$，橙线是:term[有效势]{id="physics.newtonian-mechanics.effective-potential"}，绿线是:term[机械能]{id="physics.newtonian-mechanics.mechanical-energy"}$E$，圆点是$r$的:term[转折点]{id="physics.newtonian-mechanics.turning-point"}。拖动$E$：$E$等于橙线的最低点时，轨道是圆；在最低点和$0$之间，有两个圆点，左边是:term[近心点]{id="physics.newtonian-mechanics.pericenter"}，右边是:term[远心点]{id="physics.newtonian-mechanics.apocenter"}，$r$在它们之间来回变化；拖到$0$以上，只剩近心点，质点一去不回；低于最低点，绿线和橙线不相交，这样的运动不存在。拖动$L$：$L$越大，靠近力心的墙越高，最低点越往右、越浅。

## 例题

### 例 1　由速率判断轨道的类型

卫星在离地心$7.0\times10^6\,\mathrm m$处，:term[速度]{id="physics.newtonian-mechanics.velocity"}垂直于半径。:term[速率]{id="physics.newtonian-mechanics.speed"}分别是$7.0\,\mathrm{km/s}$、$9.0\,\mathrm{km/s}$、$11.0\,\mathrm{km/s}$时，轨道各是什么类型？这一点是:term[近地点]{id="physics.newtonian-mechanics.pericenter"}还是:term[远地点]{id="physics.newtonian-mechanics.apocenter"}？地球的:term[质量]{id="physics.newtonian-mechanics.mass"}取$5.97\times10^{24}\,\mathrm{kg}$，:term[引力常量]{id="physics.newtonian-mechanics.gravitational-constant"}（gravitational constant）取$6.67\times10^{-11}\,\mathrm{N\,m^2/kg^2}$。

**为什么想到这么做**：速度垂直于半径，这一点$v_r=0$，是$r$的:term[转折点]{id="physics.newtonian-mechanics.turning-point"}。:term[机械能]{id="physics.newtonian-mechanics.mechanical-energy"}的正负决定轨道有没有界；这一点在:term[有效势]{id="physics.newtonian-mechanics.effective-potential"}最低点$r_0$的哪一侧，决定它是近地点还是远地点。

**推导**：$GM\approx3.98\times10^{14}\,\mathrm{m^3/s^2}$，这里的圆轨道速率$\sqrt{\frac{GM}r}\approx7.54\,\mathrm{km/s}$，刚好能逃到无穷远的速率$\sqrt{\frac{2GM}r}\approx10.7\,\mathrm{km/s}$；由$L=mrv$，$r_0=\frac{L^2}{GMm^2}=r\Bigl(\frac v{7.54\,\mathrm{km/s}}\Bigr)^2$。$7.0\,\mathrm{km/s}$：$E<0$，轨道有界，$r_0<r$，这一点在最低点右侧，是远地点，卫星接着会向地球靠近；$9.0\,\mathrm{km/s}$：$E<0$，轨道有界，$r_0>r$，这一点是近地点；$11.0\,\mathrm{km/s}$：$E>0$，这一点是近地点，卫星一去不回。

### 例 2　远地点在哪里

上例中:term[速率]{id="physics.newtonian-mechanics.speed"}为$9.0\,\mathrm{km/s}$的卫星，:term[远地点]{id="physics.newtonian-mechanics.apocenter"}离地心多远，在那里速率多大？

**为什么想到这么做**：:term[近地点]{id="physics.newtonian-mechanics.pericenter"}、远地点都满足$U_{\text{eff}}(r)=E$，这是$r$的二次方程，已知一个根，用根与系数的关系求另一个根；再由:term[角动量守恒]{id="physics.newtonian-mechanics.conservation-of-angular-momentum"}求速率。

**推导**：每千克的:term[机械能]{id="physics.newtonian-mechanics.mechanical-energy"}$\frac Em=\frac12v^2-\frac{GM}r\approx4.05\times10^7-5.69\times10^7=-1.64\times10^7\,\mathrm{J/kg}$。$U_{\text{eff}}(r)=E$两边乘$r^2$，得$Er^2+kr-\frac{L^2}{2m}=0$，$k=GMm$，两根之和$r_{\text{近}}+r_{\text{远}}=-\frac kE=\frac{GM}{-E/m}\approx2.43\times10^7\,\mathrm m$，所以远地点离地心约$2.43\times10^7-7.0\times10^6\approx1.73\times10^7\,\mathrm m$。角动量守恒，两点的:term[速度]{id="physics.newtonian-mechanics.velocity"}都垂直于半径，$r_{\text{近}}v_{\text{近}}=r_{\text{远}}v_{\text{远}}$，远地点的速率约$\frac{7.0\times10^6\times9.0}{1.73\times10^7}\approx3.64\,\mathrm{km/s}$。两根之和只和$E$有关，求轨道的大小时还会用到。

## 常见误区

- 「质点在:term[近心点]{id="physics.newtonian-mechanics.pericenter"}、:term[远心点]{id="physics.newtonian-mechanics.apocenter"}:term[速度]{id="physics.newtonian-mechanics.velocity"}为零。」那里只是$v_r=0$，速度垂直于半径，大小是$\frac L{mr}$。
- 「:term[机械能]{id="physics.newtonian-mechanics.mechanical-energy"}是负的，轨道就是圆。」$E<0$只说明轨道有界；只有$E$等于:term[有效势]{id="physics.newtonian-mechanics.effective-potential"}的最小值时才是圆，否则$r$在近心点和远心点之间变化。
- 「有效势里的$\frac{L^2}{2mr^2}$是另一种:term[力]{id="physics.newtonian-mechanics.force"}的:term[势能]{id="physics.newtonian-mechanics.potential-energy"}。」它是垂直于半径的那部分运动的:term[动能]{id="physics.newtonian-mechanics.kinetic-energy"}，用守恒的$L$写成了$r$的函数；在:term[惯性系]{id="physics.newtonian-mechanics.inertial-frame"}（inertial frame）里并没有一个把质点推开的力。

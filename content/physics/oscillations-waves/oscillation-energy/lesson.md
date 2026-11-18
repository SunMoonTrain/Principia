---
id: physics.oscillations-waves.oscillation-energy
title: |
  简谐运动的能量与小振动
goal: |
  会求简谐运动的动能、势能和机械能，并说明势能极小点附近的小振动都近似是简谐运动。
prerequisites: [physics.oscillations-waves.simple-harmonic-motion]
minutes: 21
summary: |
  简谐运动的机械能是$\frac12kA^2$；势能极小点附近$\omega=\sqrt{U''(x_0)/m}$。
status: reviewed
---

## 这一节要回答的问题

弹簧振子来回运动时，动能和势能怎样此消彼长？:term[振幅]{id="physics.oscillations-waves.amplitude"}（amplitude）加倍，能量变成几倍？原子之间的力、碗底的小球受的力都不是$-kx$，为什么轻轻一碰，它们也做:term[简谐运动]{id="physics.oscillations-waves.simple-harmonic-motion"}（simple harmonic motion）？

## 讲解

### 简谐运动的能量

劲度系数（spring constant）为$k$的弹簧连着质量为$m$的物块，做:term[简谐运动]{id="physics.oscillations-waves.simple-harmonic-motion"}$x=A\cos(\omega_0t+\varphi)$，$\omega_0^2=\frac km$。它的动能是$K=\frac12m\dot x^2=\frac12mA^2\omega_0^2\sin^2(\omega_0t+\varphi)=\frac12kA^2\sin^2(\omega_0t+\varphi)$，弹性势能（elastic potential energy）是$U=\frac12kx^2=\frac12kA^2\cos^2(\omega_0t+\varphi)$。

::anchor{id="thm-shm-energy"}
定理：做简谐运动的弹簧振子，机械能（mechanical energy）$E=K+U=\frac12kA^2$，不随时间变化；动能和势能都在$0$和$E$之间来回变化，一个:term[周期]{id="physics.oscillations-waves.period"}（period）里的平均值都是$\frac E2$。位移为$x$时，速率是$v=\omega_0\sqrt{A^2-x^2}$。

证明思路：两式相加，由$\sin^2\theta+\cos^2\theta=1$得$E=\frac12kA^2$。$\sin^2\theta=\frac12(1-\cos2\theta)$，一个周期里$\theta=\omega_0t+\varphi$走过$2\pi$，$\cos2\theta$正负抵消、平均为零，所以$\sin^2$、$\cos^2$的平均都是$\frac12$。由$\frac12mv^2=E-\frac12kx^2=\frac12k(A^2-x^2)$得速率。

能量和:term[振幅]{id="physics.oscillations-waves.amplitude"}的平方成正比。经过平衡位置时势能为零、动能最大，速率最大是$\omega_0A$；在两端动能为零、势能最大。[简谐运动](lesson:physics.oscillations-waves.simple-harmonic-motion#thm-initial-conditions)里由初位置和初速度求振幅的式子$A^2=x_0^2+\frac{v_0^2}{\omega_0^2}$，两边乘$\frac12k$就是$\frac12kA^2=\frac12kx_0^2+\frac12mv_0^2$，正是机械能守恒（conservation of mechanical energy）。

### 势能极小点附近的振动

原子之间、碗底的小球受的力虽然不是$-kx$，却都由势能给出：质点沿$x$轴运动、只受保守力（conservative force）时，$F=-U'(x)$（见[势能与机械能守恒](lesson:physics.newtonian-mechanics.potential-energy#thm-force-from-potential)）。$U$在$x_0$处取极小值时$U'(x_0)=0$，$x_0$是平衡位置，而且是:term[稳定平衡]{id="physics.newtonian-mechanics.stable-equilibrium"}（stable equilibrium）的位置：稍稍离开，力就把质点推回来。

::anchor{id="thm-small-oscillation"}
定理：质点在势能$U(x)$中沿直线运动，$U'(x_0)=0$、$U''(x_0)>0$。偏离$x_0$很小时，质点受的力近似是:term[线性回复力]{id="physics.oscillations-waves.restoring-force"}（restoring force）$-U''(x_0)(x-x_0)$，它绕$x_0$近似做:term[简谐运动]{id="physics.oscillations-waves.simple-harmonic-motion"}，:term[角频率]{id="physics.oscillations-waves.angular-frequency"}（angular frequency）是$\omega=\sqrt{U''(x_0)/m}$。

证明思路：$F(x)=-U'(x)$，$F(x_0)=0$，$F'(x_0)=-U''(x_0)$。照[简谐运动](lesson:physics.oscillations-waves.simple-harmonic-motion#def-restoring-force)里的做法，由泰勒公式（Taylor's formula），$F(x)=-U''(x_0)(x-x_0)+o(x-x_0)$，略去高阶小量，就是劲度系数$U''(x_0)$的线性回复力，再由那一节的定理得$\omega$。换成势能来说，$U(x)\approx U(x_0)+\frac12U''(x_0)(x-x_0)^2$：$U$的图像在极小点附近近似是一条抛物线，正是一根弹簧的弹性势能。

偏离多小才算「很小」？要$U$里三次、四次的项和二次项比起来可以略去；:term[振幅]{id="physics.oscillations-waves.amplitude"}大了，略去的项起作用，:term[周期]{id="physics.oscillations-waves.period"}一般随振幅变。定理不管的两种情形：$U''(x_0)<0$时$x_0$是极大点，质点一离开就被推走，不振动；$U''(x_0)=0$时，比如$U=cx^4$，力是$-4cx^3$，偏离再小也不是简谐运动（[简谐运动](lesson:physics.oscillations-waves.simple-harmonic-motion)第 7 题）。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 4.2], y: [0, 1.2] }
functions:
  - expr: "(1 - exp(1 - x))^2"
    label: |
      势能$U(x)$
  - expr: "(x - 1)^2"
    label: |
      极小点处的抛物线近似
  - expr: "w + 0*sqrt((x - 1 + ln(1 + sqrt(w))) * (1 - ln(1 - sqrt(w)) - x))"
    label: |
      机械能$E$
points:
  - { x: "1 - ln(1 + sqrt(w))", y: "w" }
  - { x: "1 - ln(1 - sqrt(w))", y: "w" }
sliders:
  - name: w
    min: 0.05
    max: 0.9
    step: 0.01
    default: 0.1
    label: |
      机械能$E$
:::

横轴是位置$x$，纵轴是能量。蓝线是形状像双原子分子里原子间势能的$U(x)$，极小点在$x=1$；橙线是它在极小点处的抛物线近似；绿线是机械能$E$，两个圆点是速度为零、质点折回的位置。$E$小时，两个圆点之间蓝线和橙线几乎重合，质点近似做:term[简谐运动]{id="physics.oscillations-waves.simple-harmonic-motion"}；拖大$E$，蓝线右边比抛物线平缓得多，右边的圆点跑得很远，振动就不再是简谐运动了。

## 例题

### 例 1　由能量求速率

质量$0.40\,\mathrm{kg}$的物块连在劲度系数$160\,\mathrm{N/m}$的弹簧上振动，:term[振幅]{id="physics.oscillations-waves.amplitude"}是$5.0\,\mathrm{cm}$。求机械能、最大速率和经过$x=3.0\,\mathrm{cm}$时的速率。

**为什么想到这么做**：机械能由振幅定，$E=\frac12kA^2$；知道了位置，势能就定了，剩下的是动能。

**推导**：$E=\frac12\times160\times0.050^2=0.20\,\mathrm J$。$\omega_0=\sqrt{\frac{160}{0.40}}=20\,\mathrm{rad/s}$，最大速率$\omega_0A=1.0\,\mathrm{m/s}$；经过$x=3.0\,\mathrm{cm}$时，$v=20\sqrt{0.050^2-0.030^2}=0.80\,\mathrm{m/s}$。

### 例 2　双势阱

质点在势能$U(x)=U_0\Bigl(\frac{x^2}{a^2}-1\Bigr)^2$（$U_0>0$）中沿$x$轴运动。它能在哪些位置附近做:term[振幅]{id="physics.oscillations-waves.amplitude"}很小的振动？这时的:term[角频率]{id="physics.oscillations-waves.angular-frequency"}是多少？

**为什么想到这么做**：先找$U'=0$的点，再看$U''$的正负：正的是极小点，附近的振动近似是:term[简谐运动]{id="physics.oscillations-waves.simple-harmonic-motion"}，$\omega=\sqrt{U''/m}$。

**推导**：$U'(x)=\frac{4U_0}{a^2}x\Bigl(\frac{x^2}{a^2}-1\Bigr)$，在$x=0$、$\pm a$处为零；$U''(x)=\frac{4U_0}{a^2}\Bigl(\frac{3x^2}{a^2}-1\Bigr)$，$U''(\pm a)=\frac{8U_0}{a^2}>0$，$U''(0)=-\frac{4U_0}{a^2}<0$。所以质点在$x=\pm a$附近振动，$\omega=\sqrt{\frac{8U_0}{ma^2}}$；$x=0$是极大点，质点稍一偏离就滑向一边。机械能超过$U_0$时，质点越过中间的高峰，在两个阱之间来回，那就不是振幅很小的振动了。

## 常见误区

- 「:term[振幅]{id="physics.oscillations-waves.amplitude"}加倍，振动的能量也加倍。」机械能$\frac12kA^2$和振幅的平方成正比，振幅加倍，能量是原来的 4 倍。
- 「势能为零的地方就是平衡位置。」势能的零点可以随意取，平衡位置是$U'=0$的地方；振动的:term[角频率]{id="physics.oscillations-waves.angular-frequency"}只看$U''(x_0)$，和$U(x_0)$是多少无关。
- 「势能有极小点，附近的振动就一定近似是:term[简谐运动]{id="physics.oscillations-waves.simple-harmonic-motion"}。」还要$U''(x_0)>0$：$U=cx^4$在$x=0$处有极小点，可$U''(0)=0$，振幅再小，:term[周期]{id="physics.oscillations-waves.period"}也随振幅变。

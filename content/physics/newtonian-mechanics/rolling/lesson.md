---
id: physics.newtonian-mechanics.rolling
title: |
  滚动
goal: |
  会写出纯滚动的约束条件，并求物体沿斜面滚下的加速度。
prerequisites: [physics.newtonian-mechanics.rotational-energy, physics.newtonian-mechanics.rotation-law, physics.newtonian-mechanics.friction, physics.newtonian-mechanics.center-of-mass-frame]
minutes: 24
summary: |
  纯滚动时$v_{\mathrm C}=R\omega$；滚下斜面的加速度是$\frac{g\sin\theta}{1+I_{\mathrm C}/(MR^2)}$。
status: reviewed
---

## 这一节要回答的问题

:term[质量]{id="physics.newtonian-mechanics.mass"}（mass）、半径都相同的圆环、圆盘和实心球，从同一个斜面的同一高度一起由静止滚下，谁先到底？轮子在路上滚，和地面接触的那一点是在动还是不动？轮子沿斜坡滚下时要靠摩擦才能越转越快，可:term[摩擦力]{id="physics.newtonian-mechanics.friction"}（friction）在这里做不做:term[功]{id="physics.newtonian-mechanics.work"}（work）？

## 讲解

### 纯滚动

::anchor{id="def-rolling"}
圆形的物体（轮子、圆柱、球）在平面上滚动时，和平面接触的那一点相对平面的:term[速度]{id="physics.newtonian-mechanics.velocity"}（velocity）为零，这样的滚动叫作:term[纯滚动]{id="physics.newtonian-mechanics.rolling-without-slipping"}（rolling without slipping）。这时:term[质心]{id="physics.newtonian-mechanics.center-of-mass"}（center of mass）的:term[速率]{id="physics.newtonian-mechanics.speed"}（speed）$v_{\mathrm C}=R\omega$，质心的:term[加速度]{id="physics.newtonian-mechanics.acceleration"}（acceleration）$a_{\mathrm C}=R\alpha$，$R$是半径，$\omega$、$\alpha$是绕质心转动的:term[角速度]{id="physics.newtonian-mechanics.angular-velocity"}（angular velocity）和:term[角加速度]{id="physics.newtonian-mechanics.angular-acceleration"}（angular acceleration）。

为什么这样定义：:term[刚体]{id="physics.newtonian-mechanics.rigid-body"}（rigid body）上一点的速度，是质心的速度加上它绕质心转动的速度。最低点绕质心转动的速度大小是$R\omega$，方向和前进的方向相反，所以它的速度是$v_{\mathrm C}-R\omega$，接触点不打滑就要$v_{\mathrm C}=R\omega$，也就是质心前进的距离等于边缘滚过的弧长。这时接触面之间没有相对滑动，接触点要是受:term[摩擦力]{id="physics.newtonian-mechanics.friction"}，就是:term[静摩擦力]{id="physics.newtonian-mechanics.static-friction"}（static friction）。边界情况：急刹车时车轮抱死，$\omega=0$而$v_{\mathrm C}\ne0$，车轮在地上滑；冰面上车轮空转，$R\omega>v_{\mathrm C}$，这两种都不是纯滚动。

同样的道理，最高点的速度是$v_{\mathrm C}+R\omega=2v_{\mathrm C}$：车轮上最高点的速率是车速的两倍，最低点却是静止的。

### 滚动的动能

::anchor{id="thm-rolling-ke"}
定理：:term[纯滚动]{id="physics.newtonian-mechanics.rolling-without-slipping"}的:term[刚体]{id="physics.newtonian-mechanics.rigid-body"}的:term[动能]{id="physics.newtonian-mechanics.kinetic-energy"}（kinetic energy）是$K=\frac12Mv_{\mathrm C}^2+\frac12I_{\mathrm C}\omega^2=\frac12\Bigl(M+\frac{I_{\mathrm C}}{R^2}\Bigr)v_{\mathrm C}^2$，$I_{\mathrm C}$是对过:term[质心]{id="physics.newtonian-mechanics.center-of-mass"}的转轴的:term[转动惯量]{id="physics.newtonian-mechanics.moment-of-inertia"}（moment of inertia）。

证明思路：由[质心系](lesson:physics.newtonian-mechanics.center-of-mass-frame#thm-koenig)里的:term[柯尼希定理]{id="physics.newtonian-mechanics.koenigs-theorem"}（König's theorem），总动能等于质心的动能加上在:term[质心系]{id="physics.newtonian-mechanics.center-of-mass-frame"}（center-of-mass frame）里的动能。在质心系里，刚体绕过质心的轴转动，动能就是:term[转动动能]{id="physics.newtonian-mechanics.rotational-kinetic-energy"}（rotational kinetic energy）$\frac12I_{\mathrm C}\omega^2$；再代入$\omega=\frac{v_{\mathrm C}}R$。

另一种看法：接触点这一瞬间不动，刚体好像正绕它转动。由:term[平行轴定理]{id="physics.newtonian-mechanics.parallel-axis-theorem"}（parallel axis theorem），对过接触点的轴的转动惯量是$I_{\mathrm C}+MR^2$，$\frac12(I_{\mathrm C}+MR^2)\omega^2$和上式相同。

### 沿斜面滚下

::anchor{id="thm-incline"}
定理：沿倾角为$\theta$的斜面:term[纯滚动]{id="physics.newtonian-mechanics.rolling-without-slipping"}滚下时，:term[质心]{id="physics.newtonian-mechanics.center-of-mass"}的:term[加速度]{id="physics.newtonian-mechanics.acceleration"}是$a_{\mathrm C}=\frac{g\sin\theta}{1+I_{\mathrm C}/(MR^2)}$，需要的:term[静摩擦力]{id="physics.newtonian-mechanics.static-friction"}沿斜面向上，大小是$f=\frac{I_{\mathrm C}/(MR^2)}{1+I_{\mathrm C}/(MR^2)}Mg\sin\theta$。

证明思路：沿斜面向下为正，由:term[质心运动定理]{id="physics.newtonian-mechanics.center-of-mass-theorem"}（center-of-mass theorem），$Mg\sin\theta-f=Ma_{\mathrm C}$。:term[重力]{id="physics.newtonian-mechanics.weight"}（weight）作用在质心，:term[支持力]{id="physics.newtonian-mechanics.normal-force"}（normal force）垂直于斜面、作用线过质心，只有:term[摩擦力]{id="physics.newtonian-mechanics.friction"}对过质心的轴有:term[力矩]{id="physics.newtonian-mechanics.torque"}（torque），由[转动定律](lesson:physics.newtonian-mechanics.rotation-law#thm-cm-rotation)里绕质心的:term[转动定律]{id="physics.newtonian-mechanics.law-of-rotation"}（law of rotation），$fR=I_{\mathrm C}\alpha=I_{\mathrm C}\frac{a_{\mathrm C}}R$。两式消去$f$即得。

也可以用能量：接触点的:term[速度]{id="physics.newtonian-mechanics.velocity"}为零，静摩擦力的:term[功率]{id="physics.newtonian-mechanics.power"}（power）$\vb f\cdot\vb v=0$，不做:term[功]{id="physics.newtonian-mechanics.work"}，支持力也不做功，:term[机械能守恒]{id="physics.newtonian-mechanics.conservation-of-mechanical-energy"}（conservation of mechanical energy）：$Mgh=\frac12\Bigl(M+\frac{I_{\mathrm C}}{R^2}\Bigr)v_{\mathrm C}^2$，对时间求导就得到同样的$a_{\mathrm C}$。$\frac{I_{\mathrm C}}{MR^2}$越小，滚得越快：同样的:term[势能]{id="physics.newtonian-mechanics.potential-energy"}（potential energy），分给转动的越少，质心得到的:term[动能]{id="physics.newtonian-mechanics.kinetic-energy"}越多。均匀实心球的$I_{\mathrm C}=\frac25MR^2$（第 5 题），均匀圆盘是$\frac12MR^2$，细圆环是$MR^2$。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 1.2], y: [0, 1] }
functions:
  - expr: "sin(s*pi/180) / (1 + x)"
    label: |
      纯滚动的加速度和$g$的比$\frac{a_{\mathrm C}}g$
  - expr: "tan(s*pi/180) * x / (1 + x)"
    label: |
      不打滑至少要的静摩擦因数$\mu_{\mathrm s}$
points:
  - { x: "0.4", y: "sin(s*pi/180) / 1.4" }
  - { x: "0.5", y: "sin(s*pi/180) / 1.5" }
  - { x: "1", y: "sin(s*pi/180) / 2" }
sliders:
  - name: s
    min: 5
    max: 50
    step: 1
    default: 30
    label: |
      斜面的倾角$\theta$（度）
:::

横轴是$\frac{I_{\mathrm C}}{MR^2}$。蓝线是:term[纯滚动]{id="physics.newtonian-mechanics.rolling-without-slipping"}时:term[质心]{id="physics.newtonian-mechanics.center-of-mass"}的:term[加速度]{id="physics.newtonian-mechanics.acceleration"}和$g$的比，三个圆点从左到右是实心球、圆盘、圆环；横轴为零处相当于在光滑斜面上滑下的物块，加速度是$g\sin\theta$。橙线是不打滑至少要的:term[静摩擦因数]{id="physics.newtonian-mechanics.coefficient-of-static-friction"}（coefficient of static friction）$\frac{I_{\mathrm C}/(MR^2)}{1+I_{\mathrm C}/(MR^2)}\tan\theta$。拖动倾角，三者的先后次序始终不变，和:term[质量]{id="physics.newtonian-mechanics.mass"}、半径都无关。

## 例题

### 例 1　圆环、圆盘和实心球比赛

:term[质量]{id="physics.newtonian-mechanics.mass"}、半径都相同的细圆环、均匀圆盘和均匀实心球，从倾角$30^\circ$、长$2.0\,\mathrm m$的斜面顶端同时由静止开始:term[纯滚动]{id="physics.newtonian-mechanics.rolling-without-slipping"}滚下，$g$取$9.8\,\mathrm{m/s^2}$。各用多长时间滚到底？

**为什么想到这么做**：三者的$\frac{I_{\mathrm C}}{MR^2}$分别是$1$、$\frac12$、$\frac25$，代入讲解里的:term[加速度]{id="physics.newtonian-mechanics.acceleration"}公式；加速度不变，再用匀加速运动的$s=\frac12at^2$。

**推导**：$g\sin30^\circ=4.9\,\mathrm{m/s^2}$。圆环$a=\frac{4.9}2=2.45\,\mathrm{m/s^2}$，$t=\sqrt{\frac{2\times2.0}{2.45}}\approx1.28\,\mathrm s$；圆盘$a=\frac{4.9}{1.5}\approx3.27\,\mathrm{m/s^2}$，$t\approx1.11\,\mathrm s$；实心球$a=\frac{4.9}{1.4}=3.5\,\mathrm{m/s^2}$，$t\approx1.07\,\mathrm s$。实心球最先到，圆环最后：圆环的质量全在边缘，转动分走的能量最多。

### 例 2　不打滑的条件

均匀圆盘沿倾角为$\theta$的斜面:term[纯滚动]{id="physics.newtonian-mechanics.rolling-without-slipping"}滚下，斜面的:term[静摩擦因数]{id="physics.newtonian-mechanics.coefficient-of-static-friction"}至少要多大？$\theta=30^\circ$时呢？

**为什么想到这么做**：需要的:term[静摩擦力]{id="physics.newtonian-mechanics.static-friction"}由讲解里的定理给出，它不能超过:term[最大静摩擦力]{id="physics.newtonian-mechanics.maximum-static-friction"}（maximum static friction）$\mu_{\mathrm s}N$，$N=Mg\cos\theta$。

**推导**：圆盘的$\frac{I_{\mathrm C}}{MR^2}=\frac12$，$f=\frac13Mg\sin\theta$。要$\frac13Mg\sin\theta\le\mu_{\mathrm s}Mg\cos\theta$，即$\mu_{\mathrm s}\ge\frac13\tan\theta$，$\theta=30^\circ$时约为$0.192$。斜面太陡或太滑，圆盘就会一边滚一边打滑。

## 常见误区

- 「:term[摩擦力]{id="physics.newtonian-mechanics.friction"}总是阻碍运动、做负:term[功]{id="physics.newtonian-mechanics.work"}。」:term[纯滚动]{id="physics.newtonian-mechanics.rolling-without-slipping"}下坡时，:term[静摩擦力]{id="physics.newtonian-mechanics.static-friction"}沿斜面向上，让轮子越转越快；接触点不动，它不做功，:term[机械能]{id="physics.newtonian-mechanics.mechanical-energy"}（mechanical energy）没有损失。
- 「滚动的轮子和地面接触的那一点在向前运动。」它这一瞬间是静止的；最高点的:term[速率]{id="physics.newtonian-mechanics.speed"}才是:term[质心]{id="physics.newtonian-mechanics.center-of-mass"}的两倍。
- 「:term[质量]{id="physics.newtonian-mechanics.mass"}大的球滚得快。」:term[加速度]{id="physics.newtonian-mechanics.acceleration"}只由$\frac{I_{\mathrm C}}{MR^2}$和倾角决定，形状相同的均匀球，大小、质量都不影响。

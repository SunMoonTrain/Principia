---
id: physics.electromagnetism.gauge-potentials
title: |
  电磁势与规范变换
goal: |
  会用标势和矢势表示随时间变化的电磁场，并在库仑规范和洛伦茨规范下写出势满足的方程。
prerequisites: [physics.electromagnetism.maxwell-equations, physics.electromagnetism.vector-potential]
minutes: 40
summary: |
  随时间变化的场也能由标势和矢势给出；选规范可以简化势的方程。
status: reviewed
---

## 这一节要回答的问题

:term[静电场]{id="physics.electromagnetism.electric-field"}（electrostatic field）可以写成:term[电势]{id="physics.electromagnetism.electric-potential"}（electric potential）的负梯度，:term[恒定电流]{id="physics.electromagnetism.steady-current"}（steady current）的:term[磁场]{id="physics.electromagnetism.magnetic-field"}（magnetic field）可以写成:term[磁矢势]{id="physics.electromagnetism.vector-potential"}（magnetic vector potential）的旋度（见[磁矢势](lesson:physics.electromagnetism.vector-potential)）。场随时间变化时，由:term[法拉第定律]{id="physics.electromagnetism.faraday-law"}（Faraday's law of induction），电场的旋度不再为零，$\vb E=-\nabla\varphi$不再成立。这时还能用势来描述电磁场吗？势是唯一的吗，满足什么方程？

## 讲解

### 标势和矢势

由$\divg\vb B=0$，:term[磁场]{id="physics.electromagnetism.magnetic-field"}总可以写成某个矢量场的旋度，$\vb B=\curl\vb A$（见[标量势与矢量势](lesson:math.vector-calculus.potentials)）；这和静磁场时一样，只是$\vb A$现在也随时间变。代入:term[法拉第定律]{id="physics.electromagnetism.faraday-law"}$\curl\vb E=-\pdv{\vb B}t$，得$\curl\Bigl(\vb E+\pdv{\vb A}t\Bigr)=\vb 0$：括号里的场旋度为零，可以写成某个函数的负梯度$-\nabla\varphi$。

::anchor{id="def-em-potentials"}
随时间变化的电磁场可以写成$\vb E=-\nabla\varphi-\pdv{\vb A}t$、$\vb B=\curl\vb A$；$\varphi$叫作标势（scalar potential），$\vb A$叫作矢势（vector potential），两者合起来叫作电磁势（electromagnetic potentials）。

为什么这样定义：有了势，:term[麦克斯韦方程组]{id="physics.electromagnetism.maxwell-equations"}（Maxwell's equations）里的$\divg\vb B=0$和$\curl\vb E=-\pdv{\vb B}t$自动成立，剩下的两个方程成了势满足的方程；要求的也从$\vb E$、$\vb B$的六个分量减少到$\varphi$、$\vb A$的四个函数。边界情况：场不随时间变时，$\varphi$就是静电学里的:term[电势]{id="physics.electromagnetism.electric-potential"}，$\vb A$就是:term[磁矢势]{id="physics.electromagnetism.vector-potential"}；场随时间变化时，$\varphi$沿一条路径的差不再等于:term[电场]{id="physics.electromagnetism.electric-field"}做的功，因为电场里还有$-\pdv{\vb A}t$那一部分。

### 规范变换

::anchor{id="thm-gauge-general"}
定理（:term[规范变换]{id="physics.electromagnetism.gauge-transformation"}，gauge transformation）：任取函数$\chi(\vb r,t)$，把电磁势换成$\varphi'=\varphi-\pdv\chi t$、$\vb A'=\vb A+\nabla\chi$，:term[电场]{id="physics.electromagnetism.electric-field"}和:term[磁场]{id="physics.electromagnetism.magnetic-field"}都不变。

证明思路：$\curl\vb A'=\curl\vb A+\curl(\nabla\chi)=\curl\vb A$，梯度的旋度为零。电场里，$-\nabla\varphi'-\pdv{\vb A'}t=-\nabla\varphi+\nabla\pdv\chi t-\pdv{\vb A}t-\pdv{}{t}\nabla\chi$，中间两项抵消，因为对时间求导和对坐标求导可以交换次序。

静磁场里的规范变换只有$\vb A\to\vb A+\nabla\chi$（见[磁矢势](lesson:physics.electromagnetism.vector-potential#thm-gauge)）。场随时间变化时，$\nabla\chi$随时间变会让电场多出$-\pdv{}{t}\nabla\chi$，标势同时减去$\pdv\chi t$正好把它抵消。正负号和分析力学里带电粒子的:term[拉格朗日量]{id="physics.analytical-mechanics.lagrangian"}（Lagrangian，见[电磁场中带电粒子的拉格朗日量](lesson:physics.analytical-mechanics.charged-particle-lagrangian)）、狭义相对论的$A^\mu\to A^\mu-\partial^\mu\chi$（见[电磁场张量](lesson:physics.special-relativity.field-tensor)）一致。

### 库仑规范和洛伦茨规范

把$\vb E$、$\vb B$用势写出，代入:term[高斯定律]{id="physics.electromagnetism.gauss-law"}（Gauss's law）和:term[安培-麦克斯韦定律]{id="physics.electromagnetism.ampere-maxwell-law"}（Ampère–Maxwell law），用$\curl(\curl\vb A)=\nabla(\divg\vb A)-\lap\vb A$和$c^2=\frac{1}{\mu_0\varepsilon_0}$，得到

$$
\begin{aligned}
\lap\varphi+\pdv{}{t}(\divg\vb A)&=-\frac{\rho}{\varepsilon_0},\\
\lap\vb A-\frac{1}{c^2}\frac{\partial^2\vb A}{\partial t^2}-\nabla\Bigl(\divg\vb A+\frac{1}{c^2}\pdv\varphi t\Bigr)&=-\mu_0\vb J.
\end{aligned}
$$

两个方程缠在一起。:term[规范变换]{id="physics.electromagnetism.gauge-transformation"}把$\divg\vb A$变成$\divg\vb A+\lap\chi$，可以挑一个$\chi$，让$\divg\vb A$满足一个方便的条件，把方程拆开。

::anchor{id="thm-coulomb-gauge"}
定理（:term[库仑规范]{id="physics.electromagnetism.coulomb-gauge"}（Coulomb gauge）下势的方程）：电磁势满足库仑规范$\divg\vb A=0$时，$\lap\varphi=-\frac{\rho}{\varepsilon_0}$，$\lap\vb A-\frac{1}{c^2}\frac{\partial^2\vb A}{\partial t^2}=-\mu_0\vb J+\frac{1}{c^2}\nabla\pdv\varphi t$。

证明思路：在上面两个方程里令$\divg\vb A=0$。

库仑规范下，标势满足静电学的:term[泊松方程]{id="physics.electromagnetism.poisson-equation"}（Poisson's equation），每一时刻由这一时刻的:term[电荷]{id="physics.electromagnetism.electric-charge"}（electric charge）分布决定，看上去像是瞬时传开的。可:term[电场]{id="physics.electromagnetism.electric-field"}里还有$-\pdv{\vb A}t$，两部分合起来，场的变化仍以光速传开（见第 8 题）。没有电荷的区域里，库仑规范下可以取$\varphi=0$，讲:term[电磁波]{id="physics.electromagnetism.em-wave"}（electromagnetic wave）时常这样做。

::anchor{id="def-lorenz-gauge"}
满足$\divg\vb A+\frac{1}{c^2}\pdv\varphi t=0$的电磁势叫作处在:term[洛伦茨规范]{id="physics.electromagnetism.lorenz-gauge"}（Lorenz gauge）下；这时上面两个方程分开，成为$\lap\varphi-\frac{1}{c^2}\frac{\partial^2\varphi}{\partial t^2}=-\frac{\rho}{\varepsilon_0}$、$\lap\vb A-\frac{1}{c^2}\frac{\partial^2\vb A}{\partial t^2}=-\mu_0\vb J$。

为什么这样定义：四个方程形式完全一样，都是以速度$c$传播的有源波动方程（wave equation），源分别是$\rho$和$\vb J$，下一步求:term[推迟势]{id="physics.electromagnetism.retarded-potentials"}（retarded potentials）就从它们出发（见[推迟势](lesson:physics.electromagnetism.retarded-potentials)）。任给一组电磁势，解一个以$c$传播的有源波动方程求出$\chi$，就能变到洛伦茨规范（第 5 题）。边界情况：场不随时间变时，洛伦茨规范就是库仑规范。

名字来自丹麦物理学家洛伦茨（Ludvig Lorenz）：他在 1867 年写出了带推迟效应的势，这个条件在他的结果里成立。它常被误写成荷兰物理学家洛伦兹（Hendrik Lorentz）的名字，后者后来也用这个条件来选定势。洛伦茨规范在狭义相对论里写成$\partial_\mu A^\mu=0$，在每个惯性系里形式相同（见[麦克斯韦方程组的协变形式](lesson:physics.special-relativity.covariant-maxwell)）。

## 几何图像

:::anim{component="vector-field-2d"}
field: { x: "-(1 - s/2)*y", y: "s*x/2" }
range: { x: [-3, 3], y: [-3, 3] }
dt: 0.02
particles: 300
sliders:
  - name: s
    min: 0
    max: 1
    step: 0.25
    default: 0.5
    label: |
      规范函数$\chi=\frac{s}{2}Bxy$里的$s$
:::

动画画的是同一个匀强:term[磁场]{id="physics.electromagnetism.magnetic-field"}$\vb B=B\uv z$（$B=1$，垂直屏幕向外）的一族矢势$\vb A_s=\bigl(-(1-\frac s2)By,\ \frac s2Bx,\ 0\bigr)$，小点沿着矢势的方向流动，只是为了看清矢势的样子。$s=0$时是$(-By,0,0)$，各处都沿$x$方向；$s=1$时是对称的$\frac12\vb B\times\vb r$，绕原点转圈。不管$s$取多少，$\curl\vb A_s$都是$B\uv z$：相邻两个$s$的矢势只差一个梯度$\nabla\chi$，磁场一点没变，看得见的只是势。

## 例题

### 例 1　同一个匀强电场的两组势

真空里有匀强:term[电场]{id="physics.electromagnetism.electric-field"}$\vb E=E_0\uv x$，没有:term[磁场]{id="physics.electromagnetism.magnetic-field"}。（1）写出一组$\vb A=\vb 0$的电磁势；（2）找一个:term[规范变换]{id="physics.electromagnetism.gauge-transformation"}，使新的标势处处为零，写出新的矢势；（3）两组势各满足哪种规范？

**为什么想到这么做**：静电场只用标势就够了；要让标势为零，就得用规范变换把它「挪」到矢势里，由$\varphi'=\varphi-\pdv\chi t=0$定出$\chi$。

**推导**：（1）$\varphi=-E_0x$，$\vb A=\vb 0$。（2）要$\pdv\chi t=\varphi=-E_0x$，取$\chi=-E_0xt$，于是$\vb A'=\nabla\chi=-E_0t\,\uv x$：矢势随时间均匀增长，$-\pdv{\vb A'}t=E_0\uv x$正是原来的电场，$\curl\vb A'=\vb 0$，磁场仍为零。（3）两组势的$\divg\vb A$和$\pdv\varphi t$都是零，同时满足:term[库仑规范]{id="physics.electromagnetism.coulomb-gauge"}和:term[洛伦茨规范]{id="physics.electromagnetism.lorenz-gauge"}：规范条件并没有把势完全定死。

### 例 2　平面波的势

在没有:term[电荷]{id="physics.electromagnetism.electric-charge"}和:term[电流]{id="physics.electromagnetism.electric-current"}（electric current）的真空里，取$\varphi=0$、$\vb A=A_0\cos(kz-\omega t)\,\uv x$。求:term[电场]{id="physics.electromagnetism.electric-field"}和:term[磁场]{id="physics.electromagnetism.magnetic-field"}，并说明$\omega$和$k$满足什么关系时，这组势满足:term[洛伦茨规范]{id="physics.electromagnetism.lorenz-gauge"}下的方程。

**为什么想到这么做**：$\varphi=0$、$\divg\vb A=\pdv{A_x}x=0$，规范条件自动满足；剩下的只是检查$\vb A$的方程，场由$\vb E=-\pdv{\vb A}t$、$\vb B=\curl\vb A$直接算出。

**推导**：$\vb E=-\pdv{\vb A}t=-\omega A_0\sin(kz-\omega t)\,\uv x$，$\vb B=\curl\vb A=\pdv{A_x}z\uv y=-kA_0\sin(kz-\omega t)\,\uv y$。没有源时方程是$\lap\vb A-\frac{1}{c^2}\frac{\partial^2\vb A}{\partial t^2}=\vb 0$，代入得$\bigl(-k^2+\frac{\omega^2}{c^2}\bigr)\vb A=\vb 0$，所以$\omega=ck$。这时电场和磁场互相垂直、都垂直于$z$轴，大小之比$\frac{\omega}{k}=c$：这是一列沿$z$方向传播的:term[电磁波]{id="physics.electromagnetism.em-wave"}（见[真空中的电磁波](lesson:physics.electromagnetism.em-waves)）。

## 常见误区

- 「矢势只在有:term[磁场]{id="physics.electromagnetism.magnetic-field"}的地方才不为零。」磁场为零的地方矢势也可以不为零，例如长:term[螺线管]{id="physics.electromagnetism.solenoid"}（solenoid）外面（见[感生电场](lesson:physics.electromagnetism.induced-electric-field)第 8 题）；例 1 里磁场处处为零，换一个规范，矢势却随时间增长。
- 「标势就是:term[电势]{id="physics.electromagnetism.electric-potential"}，两点的标势差就是单位:term[电荷]{id="physics.electromagnetism.electric-charge"}从一点移到另一点:term[电场]{id="physics.electromagnetism.electric-field"}做的功。」场随时间变化时，电场里有$-\pdv{\vb A}t$，它沿闭合路径的积分不为零，功和路径有关，标势差只是其中一部分。
- 「:term[库仑规范]{id="physics.electromagnetism.coulomb-gauge"}下标势瞬时变化，所以场的变化能比光传得快。」看得见的是电场和磁场，矢势那一部分正好抵消瞬时的那一部分，变化仍以光速传开（见第 8 题）。
- 「选定了:term[洛伦茨规范]{id="physics.electromagnetism.lorenz-gauge"}，势就唯一了。」还可以再做一次:term[规范变换]{id="physics.electromagnetism.gauge-transformation"}，只要$\chi$满足没有源的波动方程（第 5 题）；例 1 里两组势都满足洛伦茨规范。

---
id: physics.newtonian-mechanics.kinematics-vectors
title: |
  平面运动与抛体
goal: |
  会用位置矢量描述平面运动，并把抛体运动分解成两个方向上的直线运动。
prerequisites: [physics.newtonian-mechanics.kinematics-1d, math.linear-algebra.vectors]
minutes: 25
summary: |
  位置是矢量，速度、加速度按分量求导；抛体分解成两个直线运动。
status: reviewed
---

## 这一节要回答的问题

斜着扔出去的球走的是一条弧线，运动的方向时时在变，一个坐标已经说不清它在哪里、往哪里走。平面上的运动该怎样描述？以多大的角度扔，球能飞得最远？

## 讲解

### 速度和加速度是矢量

在平面上取原点$O$和互相垂直的$x$、$y$轴，质点的位置用从$O$指向它的位置向量（position vector）$\vb r=(x,y)$表示，物理里也叫位置矢量。质点运动时它是时间的函数$\vb r(t)$，从$t_1$到$t_2$的:term[位移]{id="physics.newtonian-mechanics.displacement"}（displacement）是$\Delta\vb r=\vb r(t_2)-\vb r(t_1)$，它和原点选在哪里无关。

::anchor{id="def-velocity-vector"}
位置向量对时间的导数（derivative）$\vb v=\dv{\vb r}t=\bigl(\dv xt,\dv yt\bigr)$叫作质点的:term[速度]{id="physics.newtonian-mechanics.velocity"}（velocity），它的大小$v=|\vb v|$叫作:term[速率]{id="physics.newtonian-mechanics.speed"}（speed）；速度的导数$\vb a=\dv{\vb v}t$叫作:term[加速度]{id="physics.newtonian-mechanics.acceleration"}（acceleration）。

为什么这样定义：矢量的极限按分量（component）取，对矢量求导就是对每个分量求导，直线运动是只剩一个分量的特殊情形。$\Delta t\to0$时位移$\Delta\vb r$的方向趋于轨迹的切线（tangent line），所以速度沿轨迹的切线、指向前进的一侧。边界情况：速率不变时速度的方向仍可以变，例如绕圆匀速转圈，这时加速度不是零（见[圆周运动](lesson:physics.newtonian-mechanics.circular-motion)）。

::anchor{id="thm-components"}
定理（运动的分解）：已知加速度$\vb a(t)=(a_x,a_y)$和某一时刻的位置、速度，$x(t)$只由$a_x$和$x$方向的初始位置、初始速度决定，$y(t)$只由$a_y$和$y$方向的这两个数决定，平面运动就是两个互不相干的直线运动。

证明思路：$\dv{\vb v}t=\vb a$按分量写就是$\dv{v_x}t=a_x$、$\dv{v_y}t=a_y$，每个分量单独满足[直线运动](lesson:physics.newtonian-mechanics.kinematics-1d#thm-motion)里由加速度求运动的定理，两个方向的:term[初始条件]{id="physics.newtonian-mechanics.initial-conditions"}（initial conditions）各定各的常数。

### 抛体运动

::anchor{id="def-projectile"}
物体以:term[初速度]{id="physics.newtonian-mechanics.velocity"}$\vb v_0$抛出后，空气的影响可以忽略，:term[加速度]{id="physics.newtonian-mechanics.acceleration"}始终是竖直向下的:term[重力加速度]{id="physics.newtonian-mechanics.gravitational-acceleration"}（gravitational acceleration）$g$，这样的运动叫作:term[抛体运动]{id="physics.newtonian-mechanics.projectile-motion"}（projectile motion）。取抛出点为原点、$x$轴水平、$y$轴竖直向上，$\vb v_0$和水平方向成抛射角（launch angle）$\theta$，则$\vb a=(0,-g)$，$x=v_0\cos\theta\cdot t$，$y=v_0\sin\theta\cdot t-\frac12gt^2$。

为什么这样定义：实验发现，从同一高度同时水平抛出和由静止释放的两个球同时落地，竖直方向的运动不受水平运动影响，正好可以用运动的分解：水平方向匀速，竖直方向是加速度为$-g$的:term[匀变速直线运动]{id="physics.newtonian-mechanics.uniformly-accelerated-motion"}（uniformly accelerated motion）。边界情况：$\theta=90^\circ$就是竖直上抛；空气的影响不能忽略时，水平速度会越来越小，两个方向也不再互不相干（第 8 题）。

::anchor{id="thm-range"}
定理（轨迹和射程）：抛体的轨迹是抛物线$y=x\tan\theta-\frac{gx^2}{2v_0^2\cos^2\theta}$；落回抛出高度时的水平距离叫作射程（range），$R=\frac{v_0^2\sin2\theta}g$，$\theta=45^\circ$时最大，$\theta$和$90^\circ-\theta$的射程相同。

证明思路：由$x=v_0\cos\theta\cdot t$解出$t$代入$y$，得到轨迹。令$y=0$，$t=\frac{2v_0\sin\theta}g$，代入$x$得$R=\frac{2v_0^2\sin\theta\cos\theta}g$。$\sin2\theta$在$2\theta=90^\circ$时最大，又有$\sin2\theta=\sin(180^\circ-2\theta)$。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 70], y: [0, 34] }
functions:
  - expr: "x*tan(a*pi/180) - 9.8*x^2/(2*v^2*cos(a*pi/180)^2) + 0*sqrt(v^2*sin(2*a*pi/180)/9.8 - x)"
    label: |
      以$\theta$抛出
  - expr: "x*tan((90 - a)*pi/180) - 9.8*x^2/(2*v^2*cos((90 - a)*pi/180)^2) + 0*sqrt(v^2*sin(2*a*pi/180)/9.8 - x)"
    label: |
      以$90^\circ-\theta$抛出
sliders:
  - name: v
    min: 15
    max: 25
    step: 5
    default: 20
    label: |
      抛出时的速率$v_0$（$\mathrm{m/s}$）
  - name: a
    min: 15
    max: 75
    step: 5
    default: 30
    label: |
      抛射角$\theta$（度）
:::

横轴是水平距离，纵轴是高度，单位都是$\mathrm m$（图上分别写作$x$、$y$），$g$取$9.8\,\mathrm{m/s^2}$。两条曲线是以同样的:term[速率]{id="physics.newtonian-mechanics.speed"}、分别以$\theta$和$90^\circ-\theta$抛出的轨迹，画到落回地面为止：高的那条飞得久，低的那条飞得快，落点却在同一处。把抛射角调到$45^\circ$，两条曲线重合，射程最大。

## 例题

### 例 1　从桥上水平扔出石子

从离水面$45\,\mathrm m$高的桥上，把石子以$15\,\mathrm{m/s}$的:term[速度]{id="physics.newtonian-mechanics.velocity"}水平扔出，$g$取$9.8\,\mathrm{m/s^2}$。

石子多久落水？落水点离桥多远？落水时速度和水面成多大角？

**为什么想到这么做**：这是$\theta=0$的:term[抛体运动]{id="physics.newtonian-mechanics.projectile-motion"}，竖直方向从静止开始匀加速下落，下落时间只由高度决定；水平方向匀速，用这个时间乘水平速度。

**推导**：竖直方向$45=\frac12\times9.8\,t^2$，$t\approx3.03\,\mathrm s$；水平距离$15\times3.03\approx45.5\,\mathrm m$。落水时竖直分速度$9.8\times3.03\approx29.7\,\mathrm{m/s}$，水平分速度仍是$15\,\mathrm{m/s}$，速度和水面的夹角满足$\tan\varphi=\frac{29.7}{15}\approx1.98$，$\varphi\approx63^\circ$。

### 例 2　打中同一个目标的两个角度

从地面以$20\,\mathrm{m/s}$的:term[速率]{id="physics.newtonian-mechanics.speed"}抛出小球，要落在$30\,\mathrm m$外、和抛出点一样高的地方，抛射角应取多少？两种抛法各飞多久？

**为什么想到这么做**：落回抛出高度，直接用射程公式解出$\sin2\theta$；$\sin2\theta$相同的角有两个，互为余角。

**推导**：$\sin2\theta=\frac{gR}{v_0^2}=\frac{9.8\times30}{400}=0.735$，$2\theta\approx47.3^\circ$或$132.7^\circ$，$\theta\approx23.7^\circ$或$66.3^\circ$。飞行时间$\frac{2v_0\sin\theta}g$分别约为$1.64\,\mathrm s$和$3.74\,\mathrm s$：低抛快，高抛慢，炮兵和篮球运动员都要在两者之间取舍。

## 常见误区

- 「水平抛得越快，落地越晚。」落地时间只由竖直方向决定，和水平方向抛得多快无关（例 1）。
- 「斜抛的物体到最高点时:term[速度]{id="physics.newtonian-mechanics.velocity"}为零。」到最高点时只是竖直分速度为零，水平分速度一直是$v_0\cos\theta$。
- 「抛射角$45^\circ$总是抛得最远。」这只在落回抛出高度、空气的影响可以忽略时成立；从高处往下抛时，抛得最远的角小于$45^\circ$（第 5 题）。

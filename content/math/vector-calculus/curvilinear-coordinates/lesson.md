---
id: math.vector-calculus.curvilinear-coordinates
title: |
  柱坐标与球坐标下的梯度、散度和旋度
goal: |
  会在柱坐标和球坐标下计算梯度、散度、旋度和拉普拉斯算子。
prerequisites: [math.vector-calculus.divergence-theorem, math.vector-calculus.vector-identities, math.vector-calculus.stokes-theorem]
minutes: 40
summary: |
  按尺度因子把坐标的变化换成长度，再用通量和环量推出各个公式。
status: reviewed
---

## 这一节要回答的问题

点电荷的电场只和到中心的距离有关，绕长直导线的磁场只和到导线的距离有关：这样的场用:term[球坐标]{id="math.vector-calculus.spherical-coordinates"}（spherical coordinates）、:term[柱坐标]{id="math.vector-calculus.cylindrical-coordinates"}（cylindrical coordinates）写最简单。可:term[梯度]{id="math.vector-calculus.gradient"}（gradient）、:term[散度]{id="math.vector-calculus.divergence"}（divergence）、:term[旋度]{id="math.vector-calculus.curl"}（curl）的公式都是用$x$、$y$、$z$写的。换成球坐标、柱坐标，这些公式变成什么样？为什么球坐标下的散度不是$\pdv{F_r}r+\pdv{F_\theta}\theta+\pdv{F_\varphi}\varphi$？

## 讲解

### 正交曲线坐标和单位向量

::anchor{id="def-orthogonal-coordinates"}
:term[柱坐标]{id="math.vector-calculus.cylindrical-coordinates"}$(s,\varphi,z)$、:term[球坐标]{id="math.vector-calculus.spherical-coordinates"}$(r,\theta,\varphi)$里，让一个坐标稍稍增加、另两个不动，点就沿一个方向移动，每一点的这三个方向两两垂直；这样的坐标叫作正交曲线坐标（orthogonal curvilinear coordinates）。沿这三个方向的单位向量，柱坐标是$\uv s=(\cos\varphi,\sin\varphi,0)$、$\uv\varphi=(-\sin\varphi,\cos\varphi,0)$、$\uv z=(0,0,1)$，球坐标是$\uv r=(\sin\theta\cos\varphi,\sin\theta\sin\varphi,\cos\theta)$、$\uv\theta=(\cos\theta\cos\varphi,\cos\theta\sin\varphi,-\sin\theta)$和同样的$\uv\varphi$。按这个次序它们排成右手系：$\uv s\times\uv\varphi=\uv z$，$\uv r\times\uv\theta=\uv\varphi$。

为什么这样定义：直角坐标的三个方向处处一样，这里的单位向量却随点转：$\uv r$在北极朝上，在赤道上朝外（几何图像右图是柱坐标的情形）。场写成$\vb F=F_r\uv r+F_\theta\uv\theta+F_\varphi\uv\varphi$，$F_r=\vb F\cdot\uv r$是沿当地径向的分量，球对称的场只剩这一个分量。边界情况：在$z$轴上（$s=0$，或$\theta=0$、$\pi$）$\uv\varphi$没有定义，原点处连$\uv r$也没有定义，那里要换回直角坐标看。

### 尺度因子

::anchor{id="def-scale-factor"}
坐标$q$增加$\dd q$、另两个坐标不动时，点移动的距离写成$h\,\dd q$，$h$叫作这个坐标的尺度因子（scale factor）。:term[柱坐标]{id="math.vector-calculus.cylindrical-coordinates"}里$h_s=1$、$h_\varphi=s$、$h_z=1$；:term[球坐标]{id="math.vector-calculus.spherical-coordinates"}里$h_r=1$、$h_\theta=r$、$h_\varphi=r\sin\theta$。

为什么这样定义：$\theta$、$\varphi$是角度，不是长度。$\theta$变$\dd\theta$，点在半径为$r$的圆上走了$r\,\dd\theta$；$\varphi$变$\dd\varphi$，点绕$z$轴走的圆半径是$r\sin\theta$，走了$r\sin\theta\,\dd\varphi$。三个方向两两垂直，小盒子的:term[体积元]{id="math.vector-calculus.volume-element"}（volume element）是$h_1h_2h_3\,\dd q_1\dd q_2\dd q_3$，在球坐标里就是$r^2\sin\theta\,\dd r\dd\theta\dd\varphi$，和[柱坐标与球坐标下的三重积分](lesson:math.vector-calculus.cylindrical-spherical#thm-spherical)里量棱长得到的一样；边界情况：在$z$轴上$h_\varphi=0$，$\varphi$怎么变，点都不动。

### 梯度

::anchor{id="thm-curvilinear-gradient"}
正交曲线坐标$(q_1,q_2,q_3)$的单位向量是$\uv e_1$、$\uv e_2$、$\uv e_3$，尺度因子是$h_1$、$h_2$、$h_3$，则$\nabla f=\frac1{h_1}\pdv f{q_1}\uv e_1+\frac1{h_2}\pdv f{q_2}\uv e_2+\frac1{h_3}\pdv f{q_3}\uv e_3$。

在:term[球坐标]{id="math.vector-calculus.spherical-coordinates"}、:term[柱坐标]{id="math.vector-calculus.cylindrical-coordinates"}里具体写出来是：

$$\nabla f=\pdv fr\uv r+\frac1r\pdv f\theta\uv\theta+\frac1{r\sin\theta}\pdv f\varphi\uv\varphi,\qquad\nabla f=\pdv fs\uv s+\frac1s\pdv f\varphi\uv\varphi+\pdv fz\uv z.$$

**证明思路**：$\nabla f\cdot\uv e_1$是沿$\uv e_1$的:term[方向导数]{id="math.vector-calculus.directional-derivative"}（directional derivative）。沿$\uv e_1$走$h_1\dd q_1$这么长，$f$变了$\pdv f{q_1}\dd q_1$，每单位长度的变化是$\frac1{h_1}\pdv f{q_1}$；另两个分量同理，三个单位向量两两垂直，合起来就是:term[梯度]{id="math.vector-calculus.gradient"}。验算：$f=r\cos\theta$就是$z$，公式给出$\nabla f=\cos\theta\,\uv r-\sin\theta\,\uv\theta$，按上面$\uv r$、$\uv\theta$的分量相加，正是$(0,0,1)$。

### 散度

::anchor{id="thm-curvilinear-divergence"}
$\vb F=F_1\uv e_1+F_2\uv e_2+F_3\uv e_3$有:term[连续]{id="math.vector-calculus.continuous"}（continuous）的:term[偏导数]{id="math.vector-calculus.partial-derivative"}（partial derivative），则$\divg\vb F=\frac1{h_1h_2h_3}\Bigl[\pdv{}{q_1}(h_2h_3F_1)+\pdv{}{q_2}(h_3h_1F_2)+\pdv{}{q_3}(h_1h_2F_3)\Bigr]$。

在:term[球坐标]{id="math.vector-calculus.spherical-coordinates"}、:term[柱坐标]{id="math.vector-calculus.cylindrical-coordinates"}里具体写出来是：

$$\divg\vb F=\frac1{r^2}\pdv{}r(r^2F_r)+\frac1{r\sin\theta}\pdv{}\theta(\sin\theta\,F_\theta)+\frac1{r\sin\theta}\pdv{F_\varphi}\varphi,$$

$$\divg\vb F=\frac1s\pdv{}s(sF_s)+\frac1s\pdv{F_\varphi}\varphi+\pdv{F_z}z.$$

**证明思路**：:term[散度]{id="math.vector-calculus.divergence"}是单位体积往外流出的:term[通量]{id="math.vector-calculus.flux"}（flux，见[高斯公式（散度定理）](lesson:math.vector-calculus.divergence-theorem)）。取每个坐标各变一点的小盒子，和$\uv e_1$垂直的两个面，面积约$h_2h_3\Delta q_2\Delta q_3$，可两个面上的$h_2h_3$不一样大。从这两个面流出的净量约$\bigl[h_2h_3F_1\bigr]_{q_1}^{q_1+\Delta q_1}\Delta q_2\Delta q_3\approx\pdv{}{q_1}(h_2h_3F_1)\Delta q_1\Delta q_2\Delta q_3$；三对面加起来，除以体积$h_1h_2h_3\Delta q_1\Delta q_2\Delta q_3$，就是上面的公式。

为什么$h$要放进求导里面：外面的面比里面的大（几何图像左图），同样大的$F_r$，从外面流出的比从里面流进的多。例如$\vb F=\uv r$，$\divg\vb F=\frac1{r^2}\pdv{}r(r^2)=\frac2r$，不是$0$：每个球面上流出的量$4\pi r^2$越往外越大。$\vb F=\frac{\uv r}{r^2}$时$r^2F_r=1$，散度在原点以外处处为零，和[高斯公式（散度定理）](lesson:math.vector-calculus.divergence-theorem)里$\frac{\vb r}{r^3}$的结论一致。

### 旋度

::anchor{id="thm-curvilinear-curl"}
$\vb F$有:term[连续]{id="math.vector-calculus.continuous"}的:term[偏导数]{id="math.vector-calculus.partial-derivative"}，$\curl\vb F$沿$\uv e_1$的分量是$\frac1{h_2h_3}\Bigl[\pdv{}{q_2}(h_3F_3)-\pdv{}{q_3}(h_2F_2)\Bigr]$，另两个分量把下标按$1\to2\to3\to1$轮换。

在:term[球坐标]{id="math.vector-calculus.spherical-coordinates"}、:term[柱坐标]{id="math.vector-calculus.cylindrical-coordinates"}里具体写出来是：

$$\begin{aligned}\curl\vb F=&\ \frac1{r\sin\theta}\Bigl[\pdv{}\theta(\sin\theta\,F_\varphi)-\pdv{F_\theta}\varphi\Bigr]\uv r\\&+\frac1r\Bigl[\frac1{\sin\theta}\pdv{F_r}\varphi-\pdv{}r(rF_\varphi)\Bigr]\uv\theta+\frac1r\Bigl[\pdv{}r(rF_\theta)-\pdv{F_r}\theta\Bigr]\uv\varphi,\end{aligned}$$

$$\curl\vb F=\Bigl[\frac1s\pdv{F_z}\varphi-\pdv{F_\varphi}z\Bigr]\uv s+\Bigl[\pdv{F_s}z-\pdv{F_z}s\Bigr]\uv\varphi+\frac1s\Bigl[\pdv{}s(sF_\varphi)-\pdv{F_s}\varphi\Bigr]\uv z.$$

**证明思路**：:term[旋度]{id="math.vector-calculus.curl"}沿$\uv e_1$的分量，是垂直于$\uv e_1$的面上单位面积的:term[环量]{id="math.vector-calculus.circulation"}（circulation，见[斯托克斯公式](lesson:math.vector-calculus.stokes-theorem#thm-curl-circulation)）。在$q_1$不变的坐标面上取小「矩形」，两边长$h_2\Delta q_2$、$h_3\Delta q_3$，按$\uv e_2\to\uv e_3$的转向绕一圈。沿$\uv e_2$的两条边上，$F_2h_2\Delta q_2$在$q_3$和$q_3+\Delta q_3$处走向相反，合起来约$-\pdv{}{q_3}(h_2F_2)\Delta q_2\Delta q_3$；另两条边合起来约$\pdv{}{q_2}(h_3F_3)\Delta q_2\Delta q_3$，除以面积$h_2h_3\Delta q_2\Delta q_3$就是公式。

为什么有用：轴对称、球对称的场分量少，套这些公式只剩一两项（例 1）。边界情况：公式里的$\frac1s$、$\frac1{r\sin\theta}$在$z$轴上没有意义，那是坐标的问题；场在轴上是否光滑，要换回直角坐标判断。

### 拉普拉斯算子

::anchor{id="thm-curvilinear-laplacian"}
把:term[梯度]{id="math.vector-calculus.gradient"}的公式代进:term[散度]{id="math.vector-calculus.divergence"}的公式（$F_i=\frac1{h_i}\pdv f{q_i}$），就得到:term[拉普拉斯算子]{id="math.vector-calculus.laplacian"}（Laplacian）$\lap f=\divg(\nabla f)$在正交曲线坐标下的式子：$\lap f=\frac1{h_1h_2h_3}\Bigl[\pdv{}{q_1}\Bigl(\frac{h_2h_3}{h_1}\pdv f{q_1}\Bigr)+\pdv{}{q_2}\Bigl(\frac{h_3h_1}{h_2}\pdv f{q_2}\Bigr)+\pdv{}{q_3}\Bigl(\frac{h_1h_2}{h_3}\pdv f{q_3}\Bigr)\Bigr]$。

在:term[球坐标]{id="math.vector-calculus.spherical-coordinates"}、:term[柱坐标]{id="math.vector-calculus.cylindrical-coordinates"}里具体写出来是：

$$\lap f=\frac1{r^2}\pdv{}r\Bigl(r^2\pdv fr\Bigr)+\frac1{r^2\sin\theta}\pdv{}\theta\Bigl(\sin\theta\pdv f\theta\Bigr)+\frac1{r^2\sin^2\theta}\pdv{^2f}{\varphi^2},$$

$$\lap f=\frac1s\pdv{}s\Bigl(s\pdv fs\Bigr)+\frac1{s^2}\pdv{^2f}{\varphi^2}+\pdv{^2f}{z^2}.$$

为什么有用：只依赖$r$的函数只剩第一项，$\lap f=f''+\frac2rf'$，和[向量微分恒等式与拉普拉斯算子](lesson:math.vector-calculus.vector-identities)第 8 题用直角坐标求的一致；例如$\lap\frac1r=0$（$r\ne0$）。电磁学里$\varphi$留给电势，方位角（azimuth）改写成$\psi$，最后一项就写成$\frac1{r^2\sin^2\theta}\pdv{^2f}{\psi^2}$。边界情况：只算第一项是常见的错，$f$依赖$\theta$时另外两项一样要算（例 2）。

## 几何图像

![两幅图，下面各有两行说明。左图是 z 不变的截面：从原点 O 出发两条射线，夹角 Δφ，和半径为 s、s + Δs 的两段圆弧围成一个浅蓝色的小块；里边的弧标着 sΔφ，外边的弧标着 (s + Δs)Δφ，沿射线的边标着 Δs。里外两段弧上各画三个沿半径向外的绿色箭头，表示径向的场。下面写着：外边比里边长：(s + Δs)Δφ 对 sΔφ；流出、流入的量里都要乘上边长。右图是 xy 平面上一个圆，圆上两点各画两个箭头：蓝色的标着 ŝ，沿半径向外；绿色的标着带帽的 φ，沿逆时针的切线方向；两点上的箭头方向各不相同。下面写着：两个单位向量随点变：在不同的点指向不同的方向。](cylinder-box.svg)

左图是:term[柱坐标]{id="math.vector-calculus.cylindrical-coordinates"}里$z$不变的一个小块：里边长$s\Delta\varphi$，外边长$(s+\Delta s)\Delta\varphi$。同样的$F_s$，从外边流出的比从里边流进的多，差约是$\pdv{}s(sF_s)\Delta s\Delta\varphi$，除以面积$s\Delta s\Delta\varphi$，正是:term[散度]{id="math.vector-calculus.divergence"}公式的第一项$\frac1s\pdv{}s(sF_s)$。右图是两个点上的$\uv s$、$\uv\varphi$：它们随点转动，所以对坐标求导时不能把它们当成常向量。

## 例题

### 例 1　绕轴转的两个场

求$\vb F=\frac1s\uv\varphi$和$\vb G=s\uv\varphi$的:term[散度]{id="math.vector-calculus.divergence"}和:term[旋度]{id="math.vector-calculus.curl"}，并和直角坐标的写法对照。

**为什么想到这么做**：两个场都只有$\uv\varphi$分量，大小只依赖$s$，用:term[柱坐标]{id="math.vector-calculus.cylindrical-coordinates"}的公式，每个只剩一两项。直角坐标里$\vb F=\frac{(-y,x,0)}{x^2+y^2}$，$\vb G=(-y,x,0)$。

**推导**：$\divg\vb F=\frac1s\pdv{}\varphi\bigl(\frac1s\bigr)=0$，$\divg\vb G=\frac1s\pdv{}\varphi(s)=0$。旋度只剩$\uv z$分量：$\vb F$的是$\frac1s\pdv{}s\bigl(s\cdot\frac1s\bigr)=0$，$\vb G$的是$\frac1s\pdv{}s(s\cdot s)=2$。所以$\vb F$在$z$轴以外无旋，$\vb G$处处旋度为$2\uv z$，和直角坐标算的$(0,0,2)$一致。两个场的:term[流线]{id="math.vector-calculus.flow-line"}（flow line）都是圆，旋度却一个是零、一个不是。

### 例 2　用球坐标算$\lap(z^2)$

$z^2$在:term[球坐标]{id="math.vector-calculus.spherical-coordinates"}里是$r^2\cos^2\theta$。用球坐标的:term[拉普拉斯算子]{id="math.vector-calculus.laplacian"}算$\lap(z^2)$，和直角坐标的结果$2$对照。

**为什么想到这么做**：直角坐标里一眼看出$\lap(z^2)=2$，正好拿来验算球坐标的公式，尤其是看清$\theta$那一项不能丢。

**推导**：第一项是$\frac1{r^2}\pdv{}r\bigl(r^2\cdot2r\cos^2\theta\bigr)=6\cos^2\theta$。第二项是$\frac1{r^2\sin\theta}\pdv{}\theta\bigl(\sin\theta\cdot(-2r^2\cos\theta\sin\theta)\bigr)=\frac1{\sin\theta}\pdv{}\theta\bigl(-2\cos\theta\sin^2\theta\bigr)=2\sin^2\theta-4\cos^2\theta$，第三项是零。合起来$6\cos^2\theta+2\sin^2\theta-4\cos^2\theta=2$，和直角坐标一致；只算第一项，会得到错误的$6\cos^2\theta$。

## 常见误区

- 「:term[球坐标]{id="math.vector-calculus.spherical-coordinates"}下:term[散度]{id="math.vector-calculus.divergence"}是$\pdv{F_r}r+\pdv{F_\theta}\theta+\pdv{F_\varphi}\varphi$。」单位向量随点变，小盒子的面也随$r$、$\theta$变大变小；$\vb F=\uv r$的散度是$\frac2r$，按这个式子却会算成$0$（第 6 题）。
- 「:term[梯度]{id="math.vector-calculus.gradient"}的$\theta$分量是$\pdv f\theta$。」$\theta$是角度，要除以尺度因子$r$，才是沿$\uv\theta$方向每单位长度的变化。
- 「$\uv r$是常向量，求导时可以提到外面。」$\uv r$随$\theta$、$\varphi$转，$\pdv{\uv r}\theta=\uv\theta$，$\pdv{\uv r}\varphi=\sin\theta\,\uv\varphi$（第 6 题）。
- 「公式在$z$轴上算出无穷大，场在那里就有奇点（singularity）。」可能只是坐标的毛病：$\uv\varphi$在$z$轴上没有定义，$\frac1s$这样的系数也是坐标带来的；场本身是否光滑，要换回直角坐标看，例 2 的$z^2$就处处光滑。

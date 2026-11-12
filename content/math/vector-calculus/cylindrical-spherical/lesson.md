---
id: math.vector-calculus.cylindrical-spherical
title: |
  柱坐标与球坐标下的三重积分
goal: |
  会把三重积分换到柱坐标和球坐标下计算。
prerequisites: [math.vector-calculus.triple-integrals, math.vector-calculus.polar-double-integrals]
minutes: 35
summary: |
  柱坐标的体积元是$s\,\dd s\dd\varphi\dd z$，球坐标的是$r^2\sin\theta\,\dd r\dd\theta\dd\varphi$。
status: reviewed
---

## 这一节要回答的问题

圆柱、圆锥、球这些绕一根轴对称、或者绕一个点对称的立体，在直角坐标下写积分限要套好几层根号：球$x^2+y^2+z^2\le R^2$里，$z$从$-\sqrt{R^2-x^2-y^2}$积到$\sqrt{R^2-x^2-y^2}$。:term[二重积分]{id="math.vector-calculus.double-integral"}（double integral）换成极坐标（polar coordinates）后，圆盘变成了矩形；空间里有没有类似的坐标，把圆柱、球变成长方体？换了坐标，:term[体积元]{id="math.vector-calculus.volume-element"}（volume element）$\dd V$又该乘上什么？

## 讲解

### 柱坐标

::anchor{id="def-cylindrical"}
空间的点$(x,y,z)$用$(s,\varphi,z)$表示：$x=s\cos\varphi$，$y=s\sin\varphi$，$z=z$，其中$s\ge0$是点到$z$轴的距离，$0\le\varphi<2\pi$是从$x$轴正方向量起的方位角（azimuthal angle）。$(s,\varphi,z)$叫作:term[柱坐标]{id="math.vector-calculus.cylindrical-coordinates"}（cylindrical coordinates）。

为什么这样定义：它就是把$xy$平面换成极坐标、$z$不变；$s=$常数是一个圆柱面，所以叫柱坐标。这里把极坐标的$r$、$\theta$改写成$s$、$\varphi$，是为了把$r$、$\theta$留给下面的:term[球坐标]{id="math.vector-calculus.spherical-coordinates"}（spherical coordinates），物理书大多这样写。边界情况：$z$轴上$s=0$，$\varphi$可以取任何值。

::anchor{id="thm-cylindrical"}
**柱坐标下的:term[三重积分]{id="math.vector-calculus.triple-integral"}（triple integral）**　设立体$\Omega$在柱坐标下由$(s,\varphi,z)$的一个区域$E$描述，$f$在$\Omega$上:term[连续]{id="math.vector-calculus.continuous"}（continuous），则$\iiint_\Omega f\,\dd V=\iiint_Ef(s\cos\varphi,s\sin\varphi,z)\,s\,\dd s\dd\varphi\dd z$，右边按$E$的形状化成:term[累次积分]{id="math.vector-calculus.iterated-integral"}（iterated integral）。

**证明思路**：先对$z$穿线，再把$xy$平面上的投影换成极坐标：$s\le s'\le s+\Delta s$、$\varphi\le\varphi'\le\varphi+\Delta\varphi$、$z\le z'\le z+\Delta z$的小块是一段圆环柱，底面积约$s\,\Delta s\Delta\varphi$，体积约$s\,\Delta s\Delta\varphi\Delta z$。

### 球坐标

::anchor{id="def-spherical"}
空间的点用$(r,\theta,\varphi)$表示：$x=r\sin\theta\cos\varphi$，$y=r\sin\theta\sin\varphi$，$z=r\cos\theta$，其中$r\ge0$是点到原点的距离，$0\le\theta\le\pi$是和$z$轴正方向的夹角，叫作极角（polar angle），$0\le\varphi<2\pi$是和:term[柱坐标]{id="math.vector-calculus.cylindrical-coordinates"}一样的方位角。$(r,\theta,\varphi)$叫作:term[球坐标]{id="math.vector-calculus.spherical-coordinates"}（spherical coordinates）。

为什么这样定义：$r=$常数是球面，$\theta=$常数是以原点为顶点的圆锥面，$\varphi=$常数是过$z$轴的半平面；点到$z$轴的距离$s=r\sin\theta$，所以$x=s\cos\varphi$这几个式子和柱坐标接得上。把地球放在原点，$\theta$相当于从北极量起的「余纬度」（colatitude），$\varphi$相当于经度。边界情况：数学书常把$\theta$、$\varphi$的意思对调，用到别的书时先看清定义；电磁学里$\varphi$要留给电势，方位角改写成$\psi$。

::anchor{id="thm-spherical"}
**球坐标下的:term[三重积分]{id="math.vector-calculus.triple-integral"}**　设立体$\Omega$在球坐标下由$(r,\theta,\varphi)$的一个区域$E$描述，$f$在$\Omega$上:term[连续]{id="math.vector-calculus.continuous"}，则$\iiint_\Omega f\,\dd V=\iiint_Ef(r\sin\theta\cos\varphi,r\sin\theta\sin\varphi,r\cos\theta)\,r^2\sin\theta\,\dd r\dd\theta\dd\varphi$。

**证明思路**：$r$、$\theta$、$\varphi$各增加$\Delta r$、$\Delta\theta$、$\Delta\varphi$围成的小块近似一个长方体，三条棱分别是：沿半径$\Delta r$；沿经线（$\theta$变化）是半径$r$的圆弧，长$r\Delta\theta$；沿纬线（$\varphi$变化）是半径$s=r\sin\theta$的圆弧，长$r\sin\theta\,\Delta\varphi$。三条棱两两垂直，体积约$r^2\sin\theta\,\Delta r\Delta\theta\Delta\varphi$。严格的说明见[重积分的换元与雅可比行列式](lesson:math.vector-calculus.change-of-variables)。

为什么是$r^2\sin\theta$：离原点越远，同样的角度张开的小块越大，按$r^2$长；靠近$z$轴（$\theta$接近$0$或$\pi$）时纬线圆缩小，小块变薄，按$\sin\theta$变小。验算：半径$R$的球，$\int_0^{2\pi}\int_0^\pi\int_0^Rr^2\sin\theta\,\dd r\dd\theta\dd\varphi=2\pi\cdot2\cdot\frac{R^3}3=\frac43\pi R^3$。

## 几何图像

![两幅斜视图。左图是柱坐标：画出半径为 s 的圆柱面，点 P 在它上面；原点到 P 在 xy 平面上的投影的线段标着 s，xy 平面上从 x 轴量起的角标着 φ，投影到 P 的竖直虚线标着 z。右图是球坐标：点 P 到原点的线段标着 r，它和 z 轴的夹角标着 θ，它在 xy 平面上的投影和 x 轴的夹角标着 φ；P 附近画了一个小盒子，三条棱分别标着 dr、r dθ、r sinθ dφ。下方两行字：左：柱坐标，s 是到 z 轴的距离，体积元 s ds dφ dz；右：球坐标，小盒子的三条棱是 dr、r dθ、r sinθ dφ，体积元 r² sinθ dr dθ dφ。](coordinates.svg)

左图：:term[柱坐标]{id="math.vector-calculus.cylindrical-coordinates"}就是$xy$平面的极坐标加上高度$z$。右图：:term[球坐标]{id="math.vector-calculus.spherical-coordinates"}里的小盒子，沿经线的棱长$r\,\dd\theta$，沿纬线的棱长$r\sin\theta\,\dd\varphi$，纬线圆的半径是$r\sin\theta$，正是$P$到$z$轴的距离$s$。

## 例题

### 例 1　圆柱绕轴的转动惯量

密度均匀（密度$\rho$）的圆柱$x^2+y^2\le a^2$、$0\le z\le h$，绕$z$轴的转动惯量（moment of inertia）是$I=\iiint\rho\,(x^2+y^2)\,\dd V$。用质量$M$表示$I$。

**为什么想到这么做**：圆柱在:term[柱坐标]{id="math.vector-calculus.cylindrical-coordinates"}下是长方体$0\le s\le a$、$0\le\varphi<2\pi$、$0\le z\le h$，被积函数$x^2+y^2=s^2$只和$s$有关，三层积分各自独立。

**推导**：$I=\rho\int_0^h\int_0^{2\pi}\int_0^as^2\cdot s\,\dd s\dd\varphi\dd z=\rho\cdot\frac{a^4}4\cdot2\pi\cdot h=\frac12\rho\pi a^2h\cdot a^2$。质量$M=\rho\pi a^2h$，所以$I=\frac12Ma^2$。

### 例 2　球里的圆锥

求球$x^2+y^2+z^2\le a^2$里、圆锥面$z=\sqrt{x^2+y^2}$上方那一块的体积（像一个冰淇淋筒）。

**为什么想到这么做**：圆锥面$z=\sqrt{x^2+y^2}$上的点和$z$轴的夹角都是$\frac\pi4$，在:term[球坐标]{id="math.vector-calculus.spherical-coordinates"}下就是$\theta=\frac\pi4$；这一块是$0\le r\le a$、$0\le\theta\le\frac\pi4$、$0\le\varphi<2\pi$，又是一个「长方体」。

**推导**：$V=\int_0^{2\pi}\int_0^{\pi/4}\int_0^ar^2\sin\theta\,\dd r\dd\theta\dd\varphi=2\pi\Bigl(1-\cos\frac\pi4\Bigr)\frac{a^3}3=\frac{2\pi a^3}3\Bigl(1-\frac{\sqrt2}2\Bigr)\approx0.613a^3$。$\theta$的上限换成$\pi$，就回到整个球$\frac43\pi a^3$。

## 常见误区

- 「:term[球坐标]{id="math.vector-calculus.spherical-coordinates"}的:term[体积元]{id="math.vector-calculus.volume-element"}是$\dd r\dd\theta\dd\varphi$。」要乘$r^2\sin\theta$：沿经线、纬线的两条棱长是$r\,\dd\theta$和$r\sin\theta\,\dd\varphi$。
- 「$\theta$也从$0$积到$2\pi$。」极角$\theta$只从$0$到$\pi$：从$z$轴正方向转到负方向就走遍了；绕一圈的是方位角$\varphi$。
- 「:term[柱坐标]{id="math.vector-calculus.cylindrical-coordinates"}的$s$就是到原点的距离。」$s$是到$z$轴的距离；到原点的距离是$r=\sqrt{s^2+z^2}$。
- 「各本书的$\theta$、$\varphi$意思都一样。」数学书常用$\varphi$表示极角、$\theta$表示方位角，和这里相反；电磁学的方位角写$\psi$。换书时先看定义，再套体积元。

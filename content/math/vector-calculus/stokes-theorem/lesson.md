---
id: math.vector-calculus.stokes-theorem
title: |
  斯托克斯公式
goal: |
  会用斯托克斯公式在闭曲线上的环量和旋度穿过曲面的通量之间转换。
prerequisites: [math.vector-calculus.surface-integrals, math.vector-calculus.greens-theorem]
minutes: 35
summary: |
  沿曲面边界的环量，等于旋度穿过这张曲面的通量。
status: reviewed
---

## 这一节要回答的问题

:term[格林公式]{id="math.vector-calculus.greens-theorem"}（Green's theorem）说：平面上沿区域边界的:term[环量]{id="math.vector-calculus.circulation"}（circulation），等于区域里各处:term[旋度]{id="math.vector-calculus.curl"}（curl）的$z$分量之和。把铁丝弯成空间里的一个圈，蘸一层肥皂膜，膜是一张弯曲的曲面，铁丝圈是它的边界。沿铁丝圈的环量，和膜上各处的旋度又是什么关系？三维的旋度是一个向量，它的方向和长度量的是什么？

## 讲解

### 曲面边界的走向

::anchor{id="def-boundary-orientation"}
$S$是:term[有向曲面]{id="math.vector-calculus.oriented-surface"}（oriented surface），单位法向量（unit normal vector）是$\vb n$，它的边界$\partial S$由一条或几条:term[闭曲线]{id="math.vector-calculus.closed-curve"}（closed curve）组成。站在曲面上、头朝$\vb n$的方向沿边界走，让曲面总在左手边，这样定下的走向叫作$\partial S$的:term[正向]{id="math.vector-calculus.positive-orientation"}（positive orientation）。换一种说法是右手定则（right-hand rule）：右手四指顺着正向弯过去，拇指指向$\vb n$。

为什么这样定义：平面区域取$\vb n=(0,0,1)$，头朝上沿边界走、区域在左手边，正是:term[格林公式]{id="math.vector-calculus.greens-theorem"}里的正向，所以这是平面情形的推广。把$\vb n$换成$-\vb n$，正向也跟着反过来：曲面的方向一定，边界的走向就定了。边界情况：球面这样的:term[闭曲面]{id="math.vector-calculus.closed-surface"}（closed surface）没有边界，谈不上走向；去掉上下底的圆柱面有两条边界，取:term[外法向]{id="math.vector-calculus.outward-normal"}（outward normal）时，从上往下看，两圈的正向一个顺时针、一个逆时针（第 2 题）。

### 斯托克斯公式

::anchor{id="thm-stokes"}
**:term[斯托克斯公式]{id="math.vector-calculus.stokes-theorem"}（Stokes' theorem）**　$S$是:term[分片光滑]{id="math.vector-calculus.piecewise-smooth-surface"}（piecewise smooth）的:term[有向曲面]{id="math.vector-calculus.oriented-surface"}，边界$\partial S$是:term[分段光滑]{id="math.vector-calculus.piecewise-smooth"}（piecewise smooth）的:term[闭曲线]{id="math.vector-calculus.closed-curve"}，取:term[正向]{id="math.vector-calculus.positive-orientation"}；:term[向量场]{id="math.vector-calculus.vector-field"}（vector field）$\vb F$在一块包住$S$的区域上有:term[连续]{id="math.vector-calculus.continuous"}（continuous）的:term[偏导数]{id="math.vector-calculus.partial-derivative"}（partial derivative），则$\oint_{\partial S}\vb F\cdot\dd\vb r=\iint_S(\curl\vb F)\cdot\dd\vb a$。左边是沿边界的:term[环量]{id="math.vector-calculus.circulation"}，右边是:term[旋度]{id="math.vector-calculus.curl"}穿过$S$的:term[通量]{id="math.vector-calculus.flux"}（flux）。

**证明思路**：先看$S$是函数$z=g(x,y)$（$(x,y)\in D$）的图像、法向量朝上的情形。沿$\partial S$走时$z=g(x,y)$，$\dd z=g_x\dd x+g_y\dd y$，左边变成$xy$平面上沿$\partial D$的:term[曲线积分]{id="math.vector-calculus.line-integral"}（line integral）$\oint_{\partial D}(P+Rg_x)\dd x+(Q+Rg_y)\dd y$；对它用:term[格林公式]{id="math.vector-calculus.greens-theorem"}，再用:term[链式法则]{id="math.vector-calculus.chain-rule"}（chain rule）展开，被积函数正好是$\curl\vb F$和$(-g_x,-g_y,1)$的点积（dot product），也就是右边（第 5 题）。一般的曲面切成小块，每一块都是某个坐标平面上的函数图像；相邻两块共用的边被走了两次、方向相反，加起来只剩外面的边界。

为什么是这个式子：取平面区域、$\vb n=(0,0,1)$，右边是$\iint_D(Q_x-P_y)\dd A$，斯托克斯公式就是格林公式。弯曲的曲面也一样：切成很多小块，每一小块的环量约是$(\curl\vb F)\cdot\vb n\,\Delta a$（下面的「旋度是单位面积的环量」），加起来，内部的边都抵消（几何图像）。边界情况：曲面要能取定方向，而且整个落在$\vb F$有连续偏导数的区域里；绕着去掉的$z$轴的圈，找不到这样的曲面（第 8 题）。

这个结果最早出现在威廉·汤姆孙（William Thomson，后来的开尔文勋爵）1850 年 7 月写给斯托克斯的一封信的附言里；斯托克斯 1854 年把它出成剑桥大学史密斯奖（Smith's Prize）考试的一道题，名字从此跟着他。

### 旋度是单位面积的环量

::anchor{id="thm-curl-circulation"}
$\vb F$有:term[连续]{id="math.vector-calculus.continuous"}的:term[偏导数]{id="math.vector-calculus.partial-derivative"}，$\vb n$是单位向量，$D_\varepsilon$是过点$\vb p$、垂直于$\vb n$、半径为$\varepsilon$的小圆盘，边界取和$\vb n$配套的:term[正向]{id="math.vector-calculus.positive-orientation"}，则$(\curl\vb F)(\vb p)\cdot\vb n=\lim_{\varepsilon\to0}\frac1{\pi\varepsilon^2}\oint_{\partial D_\varepsilon}\vb F\cdot\dd\vb r$。

**证明思路**：由:term[斯托克斯公式]{id="math.vector-calculus.stokes-theorem"}，$\oint_{\partial D_\varepsilon}\vb F\cdot\dd\vb r=\iint_{D_\varepsilon}(\curl\vb F)\cdot\vb n\,\dd a$。$\curl\vb F$连续，在小圆盘上和$(\curl\vb F)(\vb p)$相差很小，积分约是$(\curl\vb F)(\vb p)\cdot\vb n\cdot\pi\varepsilon^2$，除以面积再取极限即得。平面上取$\vb n=(0,0,1)$，就回到「:term[平面旋度]{id="math.vector-calculus.curl"}（scalar curl）是单位面积上的:term[环量]{id="math.vector-calculus.circulation"}」（见[格林公式](lesson:math.vector-calculus.greens-theorem)）。

为什么有用：这给了旋度一个不靠坐标的说法：$\curl\vb F$在$\vb n$方向的分量，是垂直于$\vb n$的平面上单位面积的环量；所以$\curl\vb F$指向环量最大的那个平面的法向，长度就是那个最大值（第 7 题）。反过来，如果对每一小片曲面$S$都有$\oint_{\partial S}\vb F\cdot\dd\vb r=\iint_S\vb G\cdot\dd\vb a$，$\vb G$连续，那么取小圆盘、除以面积、让半径趋于零，就得到$\curl\vb F=\vb G$。积分形式和微分形式说的是同一件事，物理里的:term[安培环路定理]{id="physics.electromagnetism.ampere-law"}（Ampère's circuital law）就是这样在两种形式之间转换的。

### 空间单连通区域上的保守场

::anchor{id="thm-simply-connected-space"}
空间里的:term[单连通区域]{id="math.vector-calculus.simply-connected-region"}（simply connected region）$D$上，$\vb F$有:term[连续]{id="math.vector-calculus.continuous"}的:term[偏导数]{id="math.vector-calculus.partial-derivative"}，并且$\curl\vb F=\vb 0$处处成立，则$\vb F$是$D$上的:term[保守场]{id="math.vector-calculus.conservative-field"}（conservative field）。这正是[保守场与路径无关](lesson:math.vector-calculus.conservative-fields#thm-simply-connected)里留下没证的空间情形。

**证明思路**：任取$D$里的一条:term[闭曲线]{id="math.vector-calculus.closed-curve"}$C$。$D$单连通，$C$能在$D$里连续地缩成一点，缩的过程中$C$扫过一张以$C$为边界的曲面$S$，整个在$D$里。对$S$用:term[斯托克斯公式]{id="math.vector-calculus.stokes-theorem"}，$\oint_C\vb F\cdot\dd\vb r=\iint_S\vb 0\cdot\dd\vb a=0$；每条闭曲线的:term[环量]{id="math.vector-calculus.circulation"}都是零，:term[曲线积分]{id="math.vector-calculus.line-integral"}就和路径无关，$\vb F$是保守场。扫出的曲面可能自己相交、不够光滑，把它修成:term[分片光滑]{id="math.vector-calculus.piecewise-smooth-surface"}的曲面这一步，这里不证。

为什么要单连通：去掉$z$轴的空间不是单连通的。$\vb G=\frac{(-y,x,0)}{x^2+y^2}$在那里:term[旋度]{id="math.vector-calculus.curl"}为零，绕$z$轴一圈的环量却是$2\pi$，和[保守场与路径无关](lesson:math.vector-calculus.conservative-fields)例 2 的平面场一样，所以不是保守场；以这个圈为边界的曲面都要穿过$z$轴（第 8 题）。去掉一个点的空间却是单连通的：绕着那一点的圈可以从旁边滑过去、缩成一点，所以引力场在去掉质点的空间里是保守场。

### 边界相同的两张曲面

::anchor{id="thm-same-boundary"}
两张:term[有向曲面]{id="math.vector-calculus.oriented-surface"}$S_1$、$S_2$有同一条边界$C$，$C$对两张曲面都是:term[正向]{id="math.vector-calculus.positive-orientation"}，$\vb F$在包住两张曲面的区域上有:term[连续]{id="math.vector-calculus.continuous"}的:term[偏导数]{id="math.vector-calculus.partial-derivative"}，则$\iint_{S_1}(\curl\vb F)\cdot\dd\vb a=\iint_{S_2}(\curl\vb F)\cdot\dd\vb a$：两边都等于$\oint_C\vb F\cdot\dd\vb r$。

为什么有用：一个场是某个场的:term[旋度]{id="math.vector-calculus.curl"}时，它穿过一条:term[闭曲线]{id="math.vector-calculus.closed-curve"}的:term[通量]{id="math.vector-calculus.flux"}只看这条曲线，和选哪张曲面无关，所以可以换一张好算的曲面（例 2）。另一个看法：两张曲面不相交时，把$S_2$的法向量反过来，和$S_1$拼成一张:term[闭曲面]{id="math.vector-calculus.closed-surface"}，由:term[散度定理]{id="math.vector-calculus.divergence-theorem"}（divergence theorem）和$\divg(\curl\vb F)=0$（见[向量微分恒等式与拉普拉斯算子](lesson:math.vector-calculus.vector-identities)），净通量是零（第 6 题）。物理里说「穿过一个线圈的:term[磁通量]{id="physics.electromagnetism.magnetic-flux"}（magnetic flux）」而不必说穿过哪张曲面，靠的就是这一点。

## 几何图像

![两幅斜视图，下面各有两行说明。左图是一个半球形的穹顶，表面画着经线和纬线，分成许多小块；边界是底下的圆，前半圈画实线，箭头向右，标着 ∂S；后半圈被穹顶挡住，画成虚线。穹顶顶上画着一个朝上的绿色箭头，标着 n。前面相邻的两小块涂成浅绿色，每一块四条边上各画一个小箭头，从外面看都是逆时针；两块共用的那条边画成橙色，左边一块在这条边上的箭头向上，右边一块的向下。下面写着：每一小块的环量 ≈ (∇×F)·nΔa；共用的边走两次、方向相反，只剩 ∂S。右图是同一个圆上的两张曲面：绿色的穹顶 S₁ 和浅蓝色的平底圆盘 S₂，两张曲面上各画一个朝上的法向量 n；圆的前半圈箭头向右，标着 C。下面写着：边界和走向相同的两张曲面，∇×F 穿过它们的通量相等。](stokes.svg)

左图是证明的道理：每一小块沿自己边界的:term[环量]{id="math.vector-calculus.circulation"}约是$(\curl\vb F)\cdot\vb n\,\Delta a$，相邻两块在共用的边上方向相反，加起来只剩曲面的边界$\partial S$。右图是「边界相同的两张曲面」那条推论：穹顶和圆盘共用边界$C$，法向量都朝上，$C$对两张曲面都是:term[正向]{id="math.vector-calculus.positive-orientation"}，:term[旋度]{id="math.vector-calculus.curl"}穿过它们的:term[通量]{id="math.vector-calculus.flux"}一样。

## 例题

### 例 1　在半球面上验算

$\vb F=(-y,\ x,\ xz)$，$S$是上半球面$x^2+y^2+z^2=1$（$z\ge0$），法向量朝外。分别算$\oint_{\partial S}\vb F\cdot\dd\vb r$和$\iint_S(\curl\vb F)\cdot\dd\vb a$。

**为什么想到这么做**：边界是$xy$平面上的单位圆，法向量朝外（朝上）时，:term[正向]{id="math.vector-calculus.positive-orientation"}是从上往下看逆时针。右边先求:term[旋度]{id="math.vector-calculus.curl"}，再在球面上用:term[外法向]{id="math.vector-calculus.outward-normal"}$\vb n=(x,y,z)$积分。

**推导**：边界上$z=0$，$\vb F=(-y,x,0)$；用$\vb r=(\cos t,\sin t,0)$，$\vb F\cdot\vb r'=\sin^2t+\cos^2t=1$，左边$=2\pi$。$\curl\vb F=(0,\ -z,\ 2)$，球面上$(\curl\vb F)\cdot\vb n=-yz+2z$。$-yz$在$y\to-y$下变号，积分为零；$\iint_S2z\,\dd a=2\int_0^{2\pi}\int_0^{\pi/2}\cos\theta\sin\theta\,\dd\theta\dd\varphi=2\pi$，两边相等。$xz$那一项在边界上乘的是$\dd z=0$，在曲面上只带来$-yz$，积分又是零，对两边都没有影响。

### 例 2　换一张好算的曲面

$\vb F=(-y+xz,\ x+yz,\ e^{xy})$，$S$是抛物面$z=4-x^2-y^2$在$z\ge0$的部分，法向量朝上。求$\iint_S(\curl\vb F)\cdot\dd\vb a$。

**为什么想到这么做**：直接算要对$e^{xy}$求:term[偏导数]{id="math.vector-calculus.partial-derivative"}，再在抛物面上积分，很麻烦。:term[斯托克斯公式]{id="math.vector-calculus.stokes-theorem"}说结果只看边界，可以换成边界相同的平面圆盘$x^2+y^2\le4$（$z=0$，法向量也朝上）。

**推导**：边界是$z=0$上半径为$2$的圆，从上往下看逆时针，对抛物面和圆盘都是:term[正向]{id="math.vector-calculus.positive-orientation"}。圆盘上$\vb n=(0,0,1)$，只用:term[旋度]{id="math.vector-calculus.curl"}的$z$分量$Q_x-P_y=1-(-1)=2$，积分$=2\cdot4\pi=8\pi$。验算：边界上$z=0$，$\vb F\cdot\dd\vb r=-y\,\dd x+x\,\dd y$，沿半径为$2$的圆一圈是围住面积的两倍，也是$8\pi$。

## 常见误区

- 「:term[斯托克斯公式]{id="math.vector-calculus.stokes-theorem"}里的曲面和走向都可以随便取。」曲面可以换成边界相同的另一张，但法向量和边界的走向要按右手定则配套；配反了，两边差一个负号。
- 「:term[闭曲面]{id="math.vector-calculus.closed-surface"}上，:term[旋度]{id="math.vector-calculus.curl"}的:term[通量]{id="math.vector-calculus.flux"}要一块一块地算。」闭曲面没有边界，$\oint(\curl\vb F)\cdot\dd\vb a$总是零：沿一条:term[闭曲线]{id="math.vector-calculus.closed-curve"}把它切成两张曲面，两边的:term[环量]{id="math.vector-calculus.circulation"}走向相反，正好抵消。
- 「区域里$\curl\vb F=\vb 0$，沿区域里每一条闭曲线的环量都是零。」要每一条闭曲线都是某张整个在区域里的曲面的边界，:term[单连通区域]{id="math.vector-calculus.simply-connected-region"}才行；去掉$z$轴的空间里，绕$z$轴的圈就是反例（第 8 题）。
- 「三维的旋度只是三个平面旋度拼起来，没有几何意义。」$(\curl\vb F)\cdot\vb n$是垂直于$\vb n$的平面上单位面积的环量，旋度指向环量最大的那个平面的法向（第 7 题）。

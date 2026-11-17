---
id: math.calculus.physical-applications
title: |
  定积分的物理应用
goal: |
  会用微元法求变力做的功、液体的压力和细杆的质心。
prerequisites: [math.calculus.area-between-curves]
minutes: 27
summary: |
  功的微元$F(x)\,\dd x$，压力的微元$\rho gh\,w(h)\,\dd h$，质心$x_{\mathrm C}=\frac{\int x\lambda\,\dd x}{\int\lambda\,\dd x}$。
status: reviewed
---

## 这一节要回答的问题

中学物理里，恒力沿直线做的功是$W=Fs$，液体在深$h$处的压强是$\rho gh$，均匀的杆在中点就能平衡。弹簧越拉越费力，水坝越往下受的压强越大，杆的粗细不均匀，这时功、压力、平衡点怎么求？三件事有一个共同点：在一小段上，变化的量几乎不变。

## 讲解

### 变力做功

::anchor{id="def-variable-force-work"}
物体沿$x$轴从$a$移动到$b$，受到沿$x$轴方向的力$F(x)$，$F$:term[连续]{id="math.calculus.continuous"}（continuous）。规定这个力做的功是$W=\int_a^bF(x)\,\dd x$。

为什么这样规定：用:term[微元法]{id="math.calculus.element-method"}（method of differential elements），在$[x,x+\dd x]$上力几乎不变，做的功约为$F(x)\,\dd x$，这就是功的:term[微元]{id="math.calculus.differential-element"}（differential element）；$F$是常数时，积分就是中学的$W=Fs$。弹簧伸长$x$时拉力是$kx$，从原长拉长$l$，做的功是$\int_0^lkx\,\dd x=\frac12kl^2$。边界情况：力的方向和运动方向成角$\alpha$时，只有沿运动方向的分力做功，:term[被积函数]{id="math.calculus.integrand"}（integrand）要换成$F(x)\cos\alpha$。

功的微元不一定按路程来分。把容器里的水抽到容器口，每一层水被提升的高度不同：深$y$处厚$\dd y$的一层，体积约为$A(y)\,\dd y$（$A(y)$是那里的截面面积），重$\rho gA(y)\,\dd y$，被提升$y$，所以$\dd W=\rho gA(y)\,y\,\dd y$，再对$y$积分（例 1）。

### 液体的压力

深$h$处的压强是$\rho gh$，各个方向都一样，压力垂直于受压的面。竖直放进液体的平板，不同深度的压强不同，不能直接用压强乘面积。在深$h$处取一条水平的窄带，宽$w(h)$、高$\dd h$，带上的压强几乎都是$\rho gh$，受的压力约为$\rho gh\,w(h)\,\dd h$。这些压力都垂直于平板、方向相同，可以直接相加：

$$
F=\int_{h_1}^{h_2}\rho gh\,w(h)\,\dd h.
$$

比如宽$L$、深$H$的矩形闸门，$F=\rho gL\int_0^Hh\,\dd h=\frac12\rho gLH^2$，等于平均压强$\frac12\rho gH$乘面积$LH$。边界情况：只有平的板，各条窄带受的压力方向才相同；曲面上各处压力的方向不同，大小不能直接相加，要按方向分开算。

### 细杆的质心

::anchor{id="def-linear-density"}
细杆放在$x$轴上的$[a,b]$处，$[x,x+\dd x]$那一小段的质量约为$\lambda(x)\,\dd x$，$\lambda(x)$叫作杆在$x$处的线密度（linear density），单位是$\mathrm{kg/m}$。杆的质量是$m=\int_a^b\lambda(x)\,\dd x$。

为什么这样定义：均匀的杆，线密度是质量除以长度；杆粗细不均匀、材料不同时，单位长度的质量处处不同。边界情况：杆上粘着一个有质量的小球时，那一点附近的质量不能写成$\lambda(x)\,\dd x$，要单独加上。

::anchor{id="def-center-of-mass-rod"}
$x_{\mathrm C}=\frac1m\int_a^bx\lambda(x)\,\dd x$叫作细杆的质心（center of mass）的坐标，杆在$x_{\mathrm C}$处支起来正好平衡。

为什么这样定义：由杠杆原理，几个质点$m_i$在$x_i$处，支点$x_{\mathrm C}$满足$\sum m_i(x_i-x_{\mathrm C})=0$。换成细杆，每一小段的「质量乘力臂」是$(x-x_{\mathrm C})\lambda(x)\,\dd x$，平衡要求$\int_a^b(x-x_{\mathrm C})\lambda(x)\,\dd x=0$，解出的正是上面的式子。比如$[0,L]$上$\lambda=\lambda_0\Bigl(1+\frac xL\Bigr)$，$m=\frac32\lambda_0L$，$\int_0^Lx\lambda\,\dd x=\frac56\lambda_0L^2$，$x_{\mathrm C}=\frac59L$，偏向重的一端。边界情况：$\lambda$是常数时$x_{\mathrm C}=\frac{a+b}2$，质心在中点；不均匀时质心偏离中点，但总在$[a,b]$里，因为它是$x$按质量加权的平均。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-0.1, 1.1], y: [-1.5, 5.5] }
functions:
  - expr: "1 + c*x + 0*sqrt(x*(1 - x))"
    label: |
      线密度$\lambda(x)=1+cx$
  - expr: "(1/2 + c/3) - x*(1 + c/2) + 0*sqrt(x*(1 - x))"
    label: |
      支点在$x$处时的$\int_0^1(s-x)\lambda(s)\,\dd s$
points:
  - { x: "(1/2 + c/3)/(1 + c/2)", y: "0" }
sliders:
  - name: c
    min: -0.9
    max: 4
    step: 0.1
    default: 2
    label: |
      线密度的斜率$c$
:::

杆放在$[0,1]$上，蓝色是线密度$\lambda(x)=1+cx$。橙色直线在$x$处的高度，是支点放在$x$时右边比左边多出的「质量乘力臂」$\int_0^1(s-x)\lambda(s)\,\dd s$：为正，杆向右倒；为负，向左倒。支点往右移，它一路减小，在圆点处变成$0$，杆在那里平衡，圆点就是质心$x_{\mathrm C}$。拖动$c$：$c=0$时杆是均匀的，质心在中点$\frac12$；$c>0$时右边重，质心右移；$c<0$时左移。

## 例题

### 例 1　把锥形容器里的水抽干

圆锥形容器顶点朝下，口的半径$R$，深$H$，装满了水。把水全部从容器口抽出，要做多少功？水的密度是$\rho$。

**为什么想到这么做**：各层水被提升的高度不同，按深度分层。离口深$y$的一层，离顶点$H-y$，由相似三角形，半径是$\frac RH(H-y)$；它被提升$y$。

**推导**：$\dd W=\rho g\pi\frac{R^2}{H^2}(H-y)^2\,y\,\dd y$，所以

$$
W=\frac{\rho g\pi R^2}{H^2}\int_0^Hy(H-y)^2\,\dd y=\frac{\rho g\pi R^2}{H^2}\cdot\frac{H^4}{12}=\frac{\rho g\pi R^2H^2}{12}.
$$

水的总重是$\frac13\rho g\pi R^2H$，做的功等于总重乘$\frac H4$：锥形容器里的水多半集中在上面，平均只要提升$\frac H4$。

### 例 2　三角形闸门受的压力

一块等腰三角形的闸门竖直放在水里，底边长$2b$，和水面齐平，顶点朝下，深$H$。求水对它的压力。

**为什么想到这么做**：不同深度的压强不同，按深度切成水平的窄带。深$h$处窄带的宽度由相似三角形得到：$w(h)=2b\Bigl(1-\frac hH\Bigr)$。

**推导**：

$$
F=\int_0^H\rho gh\cdot2b\Bigl(1-\frac hH\Bigr)\dd h=2\rho gb\Bigl(\frac{H^2}2-\frac{H^2}3\Bigr)=\frac13\rho gbH^2.
$$

面积是$bH$，平均压强只有$\frac13\rho gH$：三角形越往下越窄，深处压强大的部分面积小。

## 常见误区

- 「把一筒水从筒口抽干，做的功是水的重力乘筒深。」各层提升的高度从$0$到筒深都有。圆柱形的筒，每层截面一样，平均提升半个筒深，功是重力乘筒深的一半。
- 「竖直平板受的压力，是最深处的压强乘面积。」压强随深度变化，要积分；矩形闸门的压力等于半深处的压强乘面积，不是最深处。
- 「细杆的质心在中点。」只有线密度处处相同才这样；$\lambda_0\Bigl(1+\frac xL\Bigr)$的杆，质心在$\frac59L$处。

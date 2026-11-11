---
id: math.linear-algebra.orthogonal-matrices
title: |
  正交矩阵与正交变换
goal: |
  会判断正交矩阵，知道它保持长度和夹角、行列式为$\pm 1$，平面上对应旋转或反射。
prerequisites: [math.linear-algebra.gram-schmidt, math.linear-algebra.determinant-properties]
minutes: 30
summary: |
  $Q\T Q=I$的方阵保持长度和夹角，行列式是$\pm1$，平面上就是旋转或反射。
status: reviewed
---

## 这一节要回答的问题

[逆矩阵与转置](lesson:math.linear-algebra.matrix-inverse)第 7 题里，:term[旋转矩阵]{id="math.linear-algebra.rotation-matrix"}（rotation matrix）的逆恰好是它的:term[转置]{id="math.linear-algebra.transpose"}（transpose）。哪些:term[方阵]{id="math.linear-algebra.square-matrix"}（square matrix）有这个性质？它们作用在向量上，:term[长度]{id="math.linear-algebra.length"}（length）、:term[夹角]{id="math.linear-algebra.angle"}（angle）会变吗？物体的转动、照镜子，都能用这样的矩阵描述吗？

## 讲解

### 正交矩阵

::anchor{id="def-orthogonal-matrix"}
满足$Q\T Q=I$的$n$阶:term[方阵]{id="math.linear-algebra.square-matrix"}$Q$叫作:term[正交矩阵]{id="math.linear-algebra.orthogonal-matrix"}（orthogonal matrix）。

为什么这样定义：$Q\T Q$的第$i$行第$j$列是$Q$的第$i$列和第$j$列的:term[点积]{id="math.linear-algebra.dot-product"}（dot product），所以$Q\T Q=I$正是说$Q$的各列是$\R^n$的一组:term[正交规范基]{id="math.linear-algebra.orthonormal-basis"}（orthonormal basis）。由[一边成立就够](lesson:math.linear-algebra.matrix-inverse#thm-one-sided)，$Q^{-1}=Q\T$，于是$QQ\T=I$，$Q$的各行也是正交规范的。边界情况：$I$、$-I$都是正交矩阵；$\begin{pmatrix}2&0\\0&1\end{pmatrix}$的两列:term[正交]{id="math.linear-algebra.orthogonal"}（orthogonal），:term[长度]{id="math.linear-algebra.length"}却不是$1$，不是正交矩阵。

正交矩阵的乘积、逆仍是正交矩阵：$(Q_1Q_2)\T Q_1Q_2=Q_2\T Q_1\T Q_1Q_2=I$，$Q^{-1}=Q\T$也满足$(Q\T)\T Q\T=QQ\T=I$。所以几次转动、反射（reflection）接连作用，合起来仍是这一类变换。

### 保持长度和夹角

::anchor{id="thm-preserve-dot"}
**:term[正交矩阵]{id="math.linear-algebra.orthogonal-matrix"}保持:term[点积]{id="math.linear-algebra.dot-product"}**　对$n$阶:term[方阵]{id="math.linear-algebra.square-matrix"}$Q$，下面三条等价：(1) $Q$是正交矩阵；(2) 对所有$\vb x$、$\vb y$，$Q\vb x\cdot Q\vb y=\vb x\cdot\vb y$；(3) 对所有$\vb x$，$|Q\vb x|=|\vb x|$。

**证明思路**：(1) 推 (2)：$Q\vb x\cdot Q\vb y=(Q\vb x)\T(Q\vb y)=\vb x\T Q\T Q\vb y=\vb x\T\vb y$。(2) 推 (3)：取$\vb y=\vb x$。(3) 推 (1)：由[内积空间](lesson:math.linear-algebra.inner-product-spaces)第 5 题，$\vb x\cdot\vb y=\frac14\bigl(|\vb x+\vb y|^2-|\vb x-\vb y|^2\bigr)$，:term[长度]{id="math.linear-algebra.length"}不变，点积也就不变；取$\vb x=\vb e_i$、$\vb y=\vb e_j$，$Q$的第$i$、$j$列的点积等于$\vb e_i\cdot\vb e_j$，各列正交规范。

::anchor{id="def-orthogonal-transformation"}
$Q$是正交矩阵时，:term[线性变换]{id="math.linear-algebra.linear-transformation"}（linear transformation）$\vb x\mapsto Q\vb x$叫作:term[正交变换]{id="math.linear-algebra.orthogonal-transformation"}（orthogonal transformation）。

为什么这样定义：由上面的定理，正交变换不改变:term[长度]{id="math.linear-algebra.length"}，两点间的距离$|\vb x-\vb y|$也不变；点积不变，:term[夹角]{id="math.linear-algebra.angle"}也就不变，图形只是整体转了或翻了，形状、大小都不变。用坐标说，正交变换不改变平方和：$x_1^2+\dots+x_n^2$变换以后还是它。边界情况：保持两点间距离、却把原点挪走的变换（例如平移）不是线性变换，不在这一类里。

### 行列式与平面上的正交矩阵

::anchor{id="thm-det-orthogonal"}
**:term[行列式]{id="math.linear-algebra.determinant"}（determinant）是$\pm1$**　:term[正交矩阵]{id="math.linear-algebra.orthogonal-matrix"}的行列式是$1$或$-1$。

**证明思路**：由[行列式的乘法](lesson:math.linear-algebra.determinant-properties#thm-det-product)和[转置不改变行列式](lesson:math.linear-algebra.determinant-properties#thm-det-transpose)，$1=\det(Q\T Q)=\det Q\T\det Q=(\det Q)^2$。

行列式的绝对值是$1$，面积、体积不变；符号表示定向：$\det Q=1$时右手仍是右手，$\det Q=-1$时右手变成左手，像照镜子。反过来不成立：$\begin{pmatrix}1&1\\0&1\end{pmatrix}$的行列式是$1$，可它把$(0,1)$变成$(1,1)$，:term[长度]{id="math.linear-algebra.length"}变了，不是正交矩阵。

::anchor{id="thm-2d-orthogonal"}
**平面上的正交矩阵**　二阶正交矩阵只有两种：行列式为$1$的是:term[旋转矩阵]{id="math.linear-algebra.rotation-matrix"}$R_\theta=\begin{pmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{pmatrix}$；行列式为$-1$的是$S_\theta=\begin{pmatrix}\cos\theta&\sin\theta\\\sin\theta&-\cos\theta\end{pmatrix}$，它是关于过原点、和$x$轴正方向:term[夹角]{id="math.linear-algebra.angle"}为$\frac\theta2$的直线的反射。

**证明思路**：第一列是:term[单位向量]{id="math.linear-algebra.unit-vector"}（unit vector），写成$(\cos\theta,\sin\theta)$；第二列是和它:term[正交]{id="math.linear-algebra.orthogonal"}的单位向量，只能是$(-\sin\theta,\cos\theta)$或$(\sin\theta,-\cos\theta)$，行列式分别是$1$、$-1$。记$\varphi=\frac\theta2$，由和角公式，$S_\theta(\cos\varphi,\sin\varphi)=(\cos\varphi,\sin\varphi)$，$S_\theta(-\sin\varphi,\cos\varphi)=-(-\sin\varphi,\cos\varphi)$：沿这条直线的向量不动，垂直于它的向量反向，正是关于这条直线的反射。

所以[逆矩阵与转置](lesson:math.linear-algebra.matrix-inverse)第 7 题里$R_\theta^{-1}=R_\theta\T$，正是因为旋转矩阵是正交矩阵。空间里也一样：转动用行列式为$1$的三阶正交矩阵描述，刚体（rigid body）的取向就是这样一个矩阵（见[刚体的角速度与欧拉角](lesson:physics.analytical-mechanics.rigid-body-kinematics)）。

## 几何图像

:::anim{component="linear-map-2d"}
matrix: [[cos(d*pi/180), -sin(d*pi/180)], [sin(d*pi/180), cos(d*pi/180)]]
range: { x: [-2, 2], y: [-2, 2] }
show: [grid, circle, basis]
sliders:
  - name: d
    min: 0
    max: 180
    step: 15
    default: 60
    label: |
      转角$\theta$（度）
:::

第一个动画作用的是:term[旋转矩阵]{id="math.linear-algebra.rotation-matrix"}$R_\theta$，默认转$60^\circ$。比较开头和结尾：网格转了$\theta$，单位圆还是单位圆，两个基向量的:term[像]{id="math.linear-algebra.image"}（image）仍然一样长、互相垂直。插值途中的矩阵不是:term[正交矩阵]{id="math.linear-algebra.orthogonal-matrix"}，图形会先缩小，转$60^\circ$时一半处缩到原来的约$0.87$倍，转$180^\circ$时一半处整个平面缩成一点（第 7 题）；那只是从$I$到$R_\theta$的过渡，不是旋转本身。

:::anim{component="linear-map-2d"}
matrix: [[cos(2*d*pi/180), sin(2*d*pi/180)], [sin(2*d*pi/180), -cos(2*d*pi/180)]]
range: { x: [-2, 2], y: [-2, 2] }
show: [grid, square, basis]
vectors:
  - x: cos(d*pi/180)
    y: sin(d*pi/180)
    label: |
      沿镜子的向量
  - x: -sin(d*pi/180)
    y: cos(d*pi/180)
    label: |
      垂直于镜子的向量
sliders:
  - name: d
    min: 0
    max: 165
    step: 15
    default: 30
    label: |
      镜子和$x$轴的夹角（度）
:::

第二个动画作用的是关于一条直线的反射$S_\theta$，默认镜子和$x$轴成$30^\circ$。放完时，沿镜子的向量不动，垂直于镜子的向量反了向，单位正方形换了颜色：:term[行列式]{id="math.linear-algebra.determinant"}是$-1$，图形被翻了过来。插值途中，垂直于镜子的方向先缩短，一半处缩成$0$、整个平面被压成镜子所在的直线，之后反向伸长，行列式经过$0$才变成$-1$；平面上的连续变化不可能不经过压扁就把右手变成左手。

## 例题

### 例 1　空间里的一个正交矩阵

$Q=\frac13\begin{pmatrix}1&2&2\\2&1&-2\\2&-2&1\end{pmatrix}$。验证$Q$是:term[正交矩阵]{id="math.linear-algebra.orthogonal-matrix"}，求$Q^{-1}$和$\det Q$，并说明它把$\vb n=(1,-1,-1)$和与$\vb n$:term[正交]{id="math.linear-algebra.orthogonal"}的向量各变成什么。

**为什么想到这么做**：验证各列正交规范即可；$Q^{-1}=Q\T$，$Q$又对称，逆就是它自己。

**推导**：三列的:term[长度]{id="math.linear-algebra.length"}都是$\frac13\sqrt{1+4+4}=1$，两两的:term[点积]{id="math.linear-algebra.dot-product"}是$\frac19(2+2-4)=0$、$\frac19(2-4+2)=0$、$\frac19(4-2-2)=0$，所以$Q$是正交矩阵，$Q^{-1}=Q\T=Q$。按第一行展开，$\det\begin{pmatrix}1&2&2\\2&1&-2\\2&-2&1\end{pmatrix}=-3-12-12=-27$，$\det Q=-1$。$Q\vb n=\frac13(1-2-2,\,2-1+2,\,2+2-1)=(-1,1,1)=-\vb n$；若$\vb x\cdot\vb n=0$，可以验证$Q\vb x=\vb x-\frac23(\vb x\cdot\vb n)\vb n=\vb x$。所以$Q$是关于和$\vb n$垂直的平面的镜面反射，:term[行列式]{id="math.linear-algebra.determinant"}为$-1$正对应镜像。

### 例 2　旋转还是反射

$Q=\begin{pmatrix}\frac35&\frac45\\\frac45&-\frac35\end{pmatrix}$是:term[正交矩阵]{id="math.linear-algebra.orthogonal-matrix"}吗？它是旋转还是反射？是反射的话，镜子是哪条直线？

**为什么想到这么做**：先看列是否正交规范，再由:term[行列式]{id="math.linear-algebra.determinant"}的符号分辨；反射时找出不动的向量，就找到了镜子。

**推导**：两列:term[长度]{id="math.linear-algebra.length"}都是$1$，:term[点积]{id="math.linear-algebra.dot-product"}是$\frac{12}{25}-\frac{12}{25}=0$，是正交矩阵；$\det Q=-\frac9{25}-\frac{16}{25}=-1$，是反射。它是定理里的$S_\theta$，$\cos\theta=\frac35$、$\sin\theta=\frac45$。$Q(2,1)=\bigl(\frac{6+4}5,\frac{8-3}5\bigr)=(2,1)$，镜子是过原点和$(2,1)$的直线$y=\frac x2$；垂直方向上，$Q(-1,2)=(1,-2)$，反了向。

## 常见误区

- 「各列两两:term[正交]{id="math.linear-algebra.orthogonal"}的:term[方阵]{id="math.linear-algebra.square-matrix"}就是:term[正交矩阵]{id="math.linear-algebra.orthogonal-matrix"}。」还要每列:term[长度]{id="math.linear-algebra.length"}是$1$：$\begin{pmatrix}2&0\\0&1\end{pmatrix}$的$Q\T Q=\begin{pmatrix}4&0\\0&1\end{pmatrix}\ne I$。
- 「:term[行列式]{id="math.linear-algebra.determinant"}为$1$的矩阵都是旋转。」:term[剪切]{id="math.linear-algebra.shear"}（shear）矩阵$\begin{pmatrix}1&1\\0&1\end{pmatrix}$的行列式是$1$，却改变长度。
- 「正交矩阵把每个向量变成和它垂直的向量。」「正交」说的是各列两两正交、:term[点积]{id="math.linear-algebra.dot-product"}保持不变，不是把向量转$90^\circ$；$I$就是正交矩阵。
- 「动画里图形中途变小了，说明旋转会改变长度。」那是插值的过渡；只有开头和结尾是要看的变换，结尾的单位圆和原来一样大。

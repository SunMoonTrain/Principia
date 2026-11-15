---
id: physics.optics.jones-calculus
title: |
  琼斯矩阵
goal: |
  会用琼斯矢量和琼斯矩阵计算偏振光通过一串光学元件后的偏振态。
prerequisites: [physics.optics.birefringence]
minutes: 45
summary: |
  偏振态写成复数列向量，元件写成矩阵，一串元件就是矩阵的乘积。
status: reviewed
---

## 这一节要回答的问题

光依次穿过一片:term[偏振片]{id="physics.optics.polarizer"}（polarizer）、一片:term[波片]{id="physics.optics.wave-plate"}（wave plate）、再一片偏振片……每过一个元件，都要把电场沿新的方向分解，记下两个分量的振幅和相位差，元件一多就容易乱。偏振态（state of polarization）能不能写成一个向量，每个元件写成一个矩阵，一串元件就是这些矩阵的乘积？

## 讲解

### 琼斯矢量

按[偏振](lesson:physics.optics.polarization)里的写法，电场的两个分量是$E_x=A_x\cos(\omega t-kz)$，$E_y=A_y\cos(\omega t-kz-\delta)$。用复数表示（见[复数表示与旋转矢量](lesson:physics.oscillations-waves.phasors)），$E_x=\operatorname{Re}\bigl(\tilde E_xe^{i(\omega t-kz)}\bigr)$，$E_y=\operatorname{Re}\bigl(\tilde E_ye^{i(\omega t-kz)}\bigr)$，:term[复振幅]{id="physics.electromagnetism.complex-amplitude"}（complex amplitude）$\tilde E_x=A_x$，$\tilde E_y=A_ye^{-i\delta}$：模是振幅，辐角是初相位，落后$\delta$就乘$e^{-i\delta}$。

::anchor{id="def-jones-vector"}
把电场两个分量的复振幅排成列向量$\vb J=\begin{pmatrix}\tilde E_x\\\tilde E_y\end{pmatrix}$，它叫作这束光的:term[琼斯矢量]{id="physics.optics.jones-vector"}（Jones vector）。

为什么这样定义：偏振态由$A_x$、$A_y$和相位差$\delta$决定，两个复数的模和辐角之差正好记下了这三个数，一个向量就装下了整个偏振态。光强正比于$|\tilde E_x|^2+|\tilde E_y|^2$。边界情况：$\vb J$乘一个复数$c$，偏振态不变，只是光强变成$|c|^2$倍、整体的相位挪了$\arg c$，所以$\begin{pmatrix}1\\i\end{pmatrix}$和$\begin{pmatrix}i\\-1\end{pmatrix}$表示同一个偏振态；常把它归一化成$|\tilde E_x|^2+|\tilde E_y|^2=1$。

常见偏振态的琼斯矢量（归一化）：

| 偏振态 | 琼斯矢量 |
| --- | --- |
| 沿$x$方向线偏振 | $\begin{pmatrix}1\\0\end{pmatrix}$ |
| 沿和$x$轴成$\theta$的方向线偏振 | $\begin{pmatrix}\cos\theta\\\sin\theta\end{pmatrix}$ |
| :term[右旋圆偏振]{id="physics.optics.circular-polarization"}（right circular polarization） | $\frac1{\sqrt2}\begin{pmatrix}1\\i\end{pmatrix}$ |
| 左旋圆偏振 | $\frac1{\sqrt2}\begin{pmatrix}1\\-i\end{pmatrix}$ |

右旋圆偏振的$\tilde E_y=i=e^{i\pi/2}$，即$\delta=-\frac\pi2$，$E_y$比$E_x$超前四分之一周期，迎着光看电场顺时针转，和[偏振](lesson:physics.optics.polarization#def-circular)里的叫法一致。许多书把电场写成$\operatorname{Re}\bigl(\tilde Ee^{i(kz-\omega t)}\bigr)$，那时复振幅要取共轭，右旋圆偏振写成$\frac1{\sqrt2}\begin{pmatrix}1\\-i\end{pmatrix}$；对照别的书时要先看清它用哪种写法。

### 琼斯矩阵

:term[偏振片]{id="physics.optics.polarizer"}、:term[波片]{id="physics.optics.wave-plate"}这类元件，射出光的两个分量都是入射光两个分量的线性组合（linear combination）：入射光是两束光的叠加，射出光就是它们各自射出光的叠加。写成矩阵，就是$\vb J_{\text{出}}=M\vb J_{\text{入}}$。

::anchor{id="def-jones-matrix"}
光学元件把入射光的:term[琼斯矢量]{id="physics.optics.jones-vector"}变成射出光的琼斯矢量的$2\times2$复矩阵$M$，$\vb J_{\text{出}}=M\vb J_{\text{入}}$，叫作这个元件的:term[琼斯矩阵]{id="physics.optics.jones-matrix"}（Jones matrix）。

为什么这样定义：元件对任意偏振态的作用，由它对沿$x$、沿$y$线偏振的光的作用决定，矩阵的第一列、第二列正是这两束光射出后的琼斯矢量（见[矩阵与矩阵乘法](lesson:math.linear-algebra.matrices)）。所有元件都乘上同一个相位因子不改变偏振态，下面一律略去，比如光穿过玻璃整体晚到的那一部分相位。反例：:term[自然光]{id="physics.optics.natural-light"}（natural light）的偏振态无规则地变，没有确定的琼斯矢量，琼斯矩阵只能用来算偏振光；把自然光打乱成另一种自然光的毛玻璃，也没有琼斯矩阵。

::anchor{id="thm-jones-matrices"}
定理（几种元件的琼斯矩阵）：（1）:term[透振方向]{id="physics.optics.transmission-axis"}（transmission axis）和$x$轴成$\theta$的理想偏振片，$P(\theta)=\begin{pmatrix}\cos^2\theta&\sin\theta\cos\theta\\\sin\theta\cos\theta&\sin^2\theta\end{pmatrix}$。（2）:term[快轴]{id="physics.optics.fast-axis"}（fast axis）沿$x$轴、相位差为$\delta$的波片，$W=\begin{pmatrix}1&0\\0&e^{-i\delta}\end{pmatrix}$；:term[四分之一波片]{id="physics.optics.quarter-wave-plate"}（quarter-wave plate）是$\delta=\frac\pi2$，:term[二分之一波片]{id="physics.optics.half-wave-plate"}（half-wave plate）是$\delta=\pi$。（3）把琼斯矩阵为$M$的元件绕光的传播方向转过$\theta$，琼斯矩阵变成$R(\theta)MR(-\theta)$，$R(\theta)=\begin{pmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{pmatrix}$。（4）光依次通过琼斯矩阵为$M_1,M_2,\dots,M_n$的元件，总的琼斯矩阵是$M_n\cdots M_2M_1$。

证明思路：（1）偏振片只放过沿$\vb u=(\cos\theta,\sin\theta)$的分量，射出的是$(u_x\tilde E_x+u_y\tilde E_y)\vb u$，展开就是$P(\theta)\vb J$；$\theta=0$时只剩$\tilde E_x$。（2）波片让沿:term[慢轴]{id="physics.optics.slow-axis"}（slow axis）的分量多落后$\delta$，即$\tilde E_y$乘$e^{-i\delta}$。（3）先用$R(-\theta)$把$\vb J$换成元件自己的坐标里的分量，在那里乘$M$，再用$R(\theta)$换回来。（4）每过一个元件就左乘一个矩阵，后过的乘在左边。

矩阵乘法（matrix multiplication）一般不能交换，元件的先后顺序不能随便调换。满足$M\vb J=\lambda\vb J$的$\vb J$是$M$的特征向量（eigenvector，见[特征值与特征向量](lesson:math.linear-algebra.eigenvalues)），这样的偏振态通过元件后只乘一个复数，偏振态不变：波片$W$的特征向量是沿快轴和沿慢轴的线偏振，特征值（eigenvalue）是$1$和$e^{-i\delta}$，所以这两个方向的线偏振光通过波片后还是原样；偏振片$P(0)$的特征值是$1$和$0$，沿透振方向的光全部透过，垂直的全被挡住。

## 几何图像

:::anim{component="linear-map-2d"}
steps:
  - matrix: [["cos(a*pi/180)^2", "sin(a*pi/180)*cos(a*pi/180)"], ["sin(a*pi/180)*cos(a*pi/180)", "sin(a*pi/180)^2"]]
    label: |
      偏振片，透振方向和$x$轴成$\alpha$
  - matrix: [["cos(2*b*pi/180)", "sin(2*b*pi/180)"], ["sin(2*b*pi/180)", "-cos(2*b*pi/180)"]]
    label: |
      二分之一波片，快轴和$x$轴成$\beta$
range: { x: [-1.6, 1.6], y: [-1.6, 1.6] }
show: [grid]
vectors:
  - x: 1
    y: 0
    label: |
      入射光的电场：沿$x$方向线偏振
sliders:
  - name: a
    min: 0
    max: 180
    step: 15
    default: 30
    label: |
      偏振片的透振方向$\alpha$（度）
  - name: b
    min: 0
    max: 180
    step: 7.5
    default: 60
    label: |
      二分之一波片的快轴$\beta$（度）
:::

沿$x$方向线偏振的光（:term[琼斯矢量]{id="physics.optics.jones-vector"}$\begin{pmatrix}1\\0\end{pmatrix}$，图上的向量）先过一片:term[偏振片]{id="physics.optics.polarizer"}，再过一片:term[二分之一波片]{id="physics.optics.half-wave-plate"}，两个元件的:term[琼斯矩阵]{id="physics.optics.jones-matrix"}都是实矩阵，可以直接画成平面上的线性变换（linear transformation）。第 1 步，偏振片把整个平面压到:term[透振方向]{id="physics.optics.transmission-axis"}这条线上，电场只剩沿它的分量，长度乘$\cos\alpha$，光强乘$\cos^2\alpha$，这就是:term[马吕斯定律]{id="physics.optics.malus-law"}（Malus's law）。第 2 步，二分之一波片的矩阵是关于:term[快轴]{id="physics.optics.fast-axis"}的镜面反射，把电场方向翻到快轴的另一侧，长度不变；默认$\alpha=30^\circ$、$\beta=60^\circ$时，射出的光沿竖直方向线偏振。动画只是从单位矩阵（identity matrix）到这两个矩阵的过渡，中间的画面不代表光在元件里的变化，例如第 2 步中途电场矢量会先变短再恢复（默认值时从约$0.87$缩到$0.75$）。

## 例题

### 例 1　用矩阵重做四分之一波片

沿和$x$轴成$45^\circ$方向线偏振的光，通过:term[快轴]{id="physics.optics.fast-axis"}沿$x$轴的:term[四分之一波片]{id="physics.optics.quarter-wave-plate"}，再通过:term[透振方向]{id="physics.optics.transmission-axis"}和$x$轴成$\theta$的:term[偏振片]{id="physics.optics.polarizer"}。射出光的偏振态是什么，透过的光强是多少？

**为什么想到这么做**：写出入射光的:term[琼斯矢量]{id="physics.optics.jones-vector"}，依次左乘两个元件的:term[琼斯矩阵]{id="physics.optics.jones-matrix"}，最后算模的平方。

**推导**：入射光$\vb J=\frac1{\sqrt2}\begin{pmatrix}1\\1\end{pmatrix}$。过四分之一波片：$\begin{pmatrix}1&0\\0&-i\end{pmatrix}\frac1{\sqrt2}\begin{pmatrix}1\\1\end{pmatrix}=\frac1{\sqrt2}\begin{pmatrix}1\\-i\end{pmatrix}$，是:term[左旋圆偏振]{id="physics.optics.circular-polarization"}光，和[双折射与波片](lesson:physics.optics.birefringence#thm-wave-plates)里的结论一致。再过偏振片，射出的是$\frac{\cos\theta-i\sin\theta}{\sqrt2}\begin{pmatrix}\cos\theta\\\sin\theta\end{pmatrix}$，沿透振方向线偏振，光强是$\frac{|\cos\theta-i\sin\theta|^2}2=\frac12$，不管偏振片转到哪里都一样：圆偏振光透过转动的偏振片，光强不变。

### 例 2　转动的二分之一波片

求:term[快轴]{id="physics.optics.fast-axis"}和$x$轴成$\theta$的:term[二分之一波片]{id="physics.optics.half-wave-plate"}的:term[琼斯矩阵]{id="physics.optics.jones-matrix"}，并说明它怎样改变线偏振光的偏振方向。

**为什么想到这么做**：快轴沿$x$轴时矩阵是$\begin{pmatrix}1&0\\0&-1\end{pmatrix}$，转过$\theta$就用$R(\theta)MR(-\theta)$。

**推导**：$R(\theta)\begin{pmatrix}1&0\\0&-1\end{pmatrix}R(-\theta)=\begin{pmatrix}\cos\theta&\sin\theta\\\sin\theta&-\cos\theta\end{pmatrix}\begin{pmatrix}\cos\theta&\sin\theta\\-\sin\theta&\cos\theta\end{pmatrix}=\begin{pmatrix}\cos2\theta&\sin2\theta\\\sin2\theta&-\cos2\theta\end{pmatrix}$。作用在沿$\varphi$方向的线偏振光$\begin{pmatrix}\cos\varphi\\\sin\varphi\end{pmatrix}$上，得$\begin{pmatrix}\cos(2\theta-\varphi)\\\sin(2\theta-\varphi)\end{pmatrix}$：射出光沿$2\theta-\varphi$方向线偏振，和入射方向关于快轴对称。:term[波片]{id="physics.optics.wave-plate"}转过一个角度，射出光的偏振方向转过两倍的角度，所以转动二分之一波片是调节激光偏振方向最常用的办法。

## 常见误区

- 「光先过$M_1$再过$M_2$，总的:term[琼斯矩阵]{id="physics.optics.jones-matrix"}是$M_1M_2$。」后过的元件乘在左边，是$M_2M_1$；两个矩阵一般不能交换，顺序反了结果不同。
- 「:term[琼斯矢量]{id="physics.optics.jones-vector"}不同，偏振态就不同。」两个琼斯矢量只差一个复数因子时，偏振态相同，只有光强和整体相位不同。
- 「:term[自然光]{id="physics.optics.natural-light"}的琼斯矢量是$\frac1{\sqrt2}\begin{pmatrix}1\\1\end{pmatrix}$。」那是沿$45^\circ$的线偏振光；自然光的偏振态无规则地变，没有琼斯矢量。
- 「:term[右旋圆偏振]{id="physics.optics.circular-polarization"}光的琼斯矢量一定是$\frac1{\sqrt2}\begin{pmatrix}1\\-i\end{pmatrix}$。」这取决于复数表示用$e^{i\omega t}$还是$e^{-i\omega t}$；按这里的写法，它是左旋圆偏振光。

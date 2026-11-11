---
id: math.linear-algebra.dot-product
title: |
  点积、长度与夹角
goal: |
  会用点积求向量的长度和夹角，并判断两个向量是否垂直。
prerequisites: [math.linear-algebra.vectors]
minutes: 30
summary: |
  点积是对应分量乘积之和，$\vb u\cdot\vb v=|\vb u||\vb v|\cos\theta$。
status: reviewed
---

## 这一节要回答的问题

斜着拉一个箱子，拉力只有沿前进方向的那一部分在推它向前。知道两个向量的:term[分量]{id="math.linear-algebra.component"}（component），怎样算出它们各自有多长、:term[夹角]{id="math.linear-algebra.angle"}（angle）是多少？怎样不画图就判断两个向量是否垂直（perpendicular）？

## 讲解

### 点积

先看平面上的两个向量$\vb u=(u_1,u_2)$、$\vb v=(v_1,v_2)$。把对应的:term[分量]{id="math.linear-algebra.component"}相乘再相加，得到一个数$u_1v_1+u_2v_2$；下面会看到，:term[长度]{id="math.linear-algebra.length"}（length）和:term[夹角]{id="math.linear-algebra.angle"}都藏在这个数里。

::anchor{id="def-dot-product"}
$\R^n$中两个向量$\vb u=(u_1,\dots,u_n)$、$\vb v=(v_1,\dots,v_n)$的:term[点积]{id="math.linear-algebra.dot-product"}（dot product）是数$\vb u\cdot\vb v=u_1v_1+u_2v_2+\dots+u_nv_n$，也叫数量积（scalar product）。

为什么这样定义：结果是一个数，不是向量，它量的是两个向量的方向有多一致（见下面的定理「点积与夹角」）。物理里，恒力$\vb F$使物体产生位移$\vb d$时做的功就是$\vb F\cdot\vb d$。边界情况：$\vb v\cdot\vb 0=0$；$\vb e_i\cdot\vb v=v_i$，和:term[标准基向量]{id="math.linear-algebra.standard-basis-vector"}（standard basis vector）作点积，就取出第$i$个分量。

::anchor{id="thm-dot-laws"}
**点积的运算律**　对$\R^n$中的向量$\vb u$、$\vb v$、$\vb w$和数$c$：(1) $\vb u\cdot\vb v=\vb v\cdot\vb u$；(2) $\vb u\cdot(\vb v+\vb w)=\vb u\cdot\vb v+\vb u\cdot\vb w$；(3) $(c\vb u)\cdot\vb v=c(\vb u\cdot\vb v)$；(4) $\vb v\cdot\vb v\ge0$，等号只在$\vb v=\vb 0$时成立。

**证明思路**：(1) 到 (3) 按分量写开，都是数的运算律，例如 (2) 的第$i$项是$u_i(v_i+w_i)=u_iv_i+u_iw_i$。(4) $\vb v\cdot\vb v=v_1^2+\dots+v_n^2$，平方和不是负数，并且只有每一项都是零时才等于零。

### 长度

::anchor{id="def-length"}
向量$\vb v$的:term[长度]{id="math.linear-algebra.length"}（length，也叫模，magnitude）是$|\vb v|=\sqrt{\vb v\cdot\vb v}=\sqrt{v_1^2+\dots+v_n^2}$；长度为$1$的向量叫作:term[单位向量]{id="math.linear-algebra.unit-vector"}（unit vector），$\vb v\ne\vb 0$时，$\uv v=\frac{\vb v}{|\vb v|}$是和$\vb v$同方向的单位向量。

为什么这样定义：平面上，由勾股定理，$(v_1,v_2)$的箭头长$\sqrt{v_1^2+v_2^2}$；空间里用两次勾股定理，得$\sqrt{v_1^2+v_2^2+v_3^2}$。$n\ge4$时没有图，就拿这个式子当长度的定义，由运算律 (4)，它只在$\vb v=\vb 0$时为零。边界情况：$|c\vb v|=\sqrt{c^2\,\vb v\cdot\vb v}=|c||\vb v|$，所以$\uv v$的长度确实是$1$；两点$A$、$B$之间的距离是$|\overrightarrow{AB}|$。

### 夹角

::anchor{id="thm-dot-angle"}
**:term[点积]{id="math.linear-algebra.dot-product"}与:term[夹角]{id="math.linear-algebra.angle"}**　平面或空间里的两个非零向量$\vb u$、$\vb v$从同一点出发，夹角为$\theta$（$0\le\theta\le\pi$），则$\vb u\cdot\vb v=|\vb u||\vb v|\cos\theta$。

**证明思路**：$\vb u$、$\vb v$和$\vb u-\vb v$围成三角形，$\vb u-\vb v$所对的角是$\theta$。由余弦定理（law of cosines），$|\vb u-\vb v|^2=|\vb u|^2+|\vb v|^2-2|\vb u||\vb v|\cos\theta$；由运算律，$|\vb u-\vb v|^2=(\vb u-\vb v)\cdot(\vb u-\vb v)=|\vb u|^2-2\,\vb u\cdot\vb v+|\vb v|^2$。比较两式即得；$\vb u$、$\vb v$同向或反向时三角形退化，直接验证也成立。

$n\ge4$时没有图，要反过来用$\frac{\vb u\cdot\vb v}{|\vb u||\vb v|}$定义夹角的余弦，先得知道这个数在$-1$和$1$之间。

::anchor{id="thm-cauchy-schwarz"}
**:term[柯西-施瓦茨不等式]{id="math.linear-algebra.cauchy-schwarz-inequality"}（Cauchy-Schwarz inequality）**　对$\R^n$中任意两个向量，$|\vb u\cdot\vb v|\le|\vb u||\vb v|$，等号当且仅当$\vb u$与$\vb v$:term[平行]{id="math.linear-algebra.parallel"}（parallel）时成立。

**证明思路**：$\vb v=\vb 0$时两边都是$0$。否则对每个实数$t$，$0\le|\vb u-t\vb v|^2=|\vb v|^2t^2-2(\vb u\cdot\vb v)t+|\vb u|^2$，这个关于$t$的二次函数不取负值，所以判别式$4(\vb u\cdot\vb v)^2-4|\vb u|^2|\vb v|^2\le0$。等号成立时它有零点$t_0$，即$\vb u=t_0\vb v$；反过来，两者平行时直接代入，等号成立。

::anchor{id="def-angle"}
$\R^n$中两个非零向量$\vb u$、$\vb v$的:term[夹角]{id="math.linear-algebra.angle"}（angle）是由$\cos\theta=\frac{\vb u\cdot\vb v}{|\vb u||\vb v|}$确定的$\theta\in[0,\pi]$。

为什么这样定义：在平面和空间里，这正是上面的定理；由柯西-施瓦茨不等式，右边总在$[-1,1]$里，于是任何$n$都能这样定义夹角。点积的符号反映夹角的大小：为正是锐角，为负是钝角。边界情况：:term[零向量]{id="math.linear-algebra.zero-vector"}（zero vector）没有方向，和它谈不上夹角。

### 正交

::anchor{id="def-orthogonal"}
如果$\vb u\cdot\vb v=0$，就说$\vb u$与$\vb v$:term[正交]{id="math.linear-algebra.orthogonal"}（orthogonal）；两个非零向量正交，就是它们的:term[夹角]{id="math.linear-algebra.angle"}是$\frac\pi2$，即互相垂直（perpendicular）。

为什么这样定义：$\cos\theta=0$恰好是$\theta=\frac\pi2$，所以平面上$(u_1,u_2)$与$(v_1,v_2)$垂直，当且仅当$u_1v_1+u_2v_2=0$，不用量角。按这个定义，:term[零向量]{id="math.linear-algebra.zero-vector"}和任何向量都正交（$\vb 0\cdot\vb v=0$），以后说「和每个向量都正交」时不用另提例外。边界情况：$(1,1)\cdot(1,-1)=0$，两个非零向量的:term[点积]{id="math.linear-algebra.dot-product"}可以是零，这和数的乘法不同。

### 投影

把一个向量拆成沿另一个向量方向的部分和垂直于它的部分，是:term[点积]{id="math.linear-algebra.dot-product"}最常见的用法：拉箱子时，拉力沿前进方向的那部分才推动箱子。

::anchor{id="def-projection"}
设$\vb v\ne\vb 0$，向量$\operatorname{proj}_{\vb v}\vb u=\frac{\vb u\cdot\vb v}{\vb v\cdot\vb v}\vb v$叫作$\vb u$在$\vb v$上的:term[投影]{id="math.linear-algebra.projection"}（projection）；$\vb u-\operatorname{proj}_{\vb v}\vb u$与$\vb v$:term[正交]{id="math.linear-algebra.orthogonal"}，于是$\vb u$分解成与$\vb v$:term[平行]{id="math.linear-algebra.parallel"}和与$\vb v$正交的两部分之和。

为什么这样定义：与$\vb v$平行的部分是$c\vb v$，要$\vb u-c\vb v$与$\vb v$正交，就要$\vb u\cdot\vb v-c\,\vb v\cdot\vb v=0$，所以$c=\frac{\vb u\cdot\vb v}{\vb v\cdot\vb v}$。几何上，它的终点是从$\vb u$的终点向$\vb v$所在直线作垂线的垂足，带符号的:term[长度]{id="math.linear-algebra.length"}是$|\vb u|\cos\theta=\frac{\vb u\cdot\vb v}{|\vb v|}$。边界情况：$\vb u$与$\vb v$正交时投影是$\vb 0$，与$\vb v$平行时投影就是$\vb u$本身。

## 几何图像

![两幅图。左：从原点出发的向量 u = (2, 3) 和 v = (4, 1)，从 u 的终点向 v 所在的直线作垂线，从原点到垂足的粗箭头是 u 在 v 上的投影，垂线段是 u 减去投影的部分，u 和 v 之间标出夹角 θ。右：v 水平不动，u 与 v 的夹角分别是锐角、直角、钝角，旁边写着点积大于零、等于零、小于零](dot-projection.svg)

左图：$\vb u=(2,3)$、$\vb v=(4,1)$，从$\vb u$的终点向$\vb v$所在的直线作垂线，垂足给出:term[投影]{id="math.linear-algebra.projection"}$\operatorname{proj}_{\vb v}\vb u=\frac{11}{17}\vb v$，剩下的$\vb u-\operatorname{proj}_{\vb v}\vb u$与$\vb v$垂直。右图：$\vb v$不动，$\vb u$转到锐角、直角、钝角时，:term[点积]{id="math.linear-algebra.dot-product"}依次为正、零、负。

## 例题

### 例 1　正方体面对角线的夹角

边长为$1$的正方体，一个顶点放在原点，三条棱沿坐标轴。求从原点出发的两条面对角线$\vb u=(1,1,0)$、$\vb v=(0,1,1)$的:term[夹角]{id="math.linear-algebra.angle"}。

**为什么想到这么做**：已知:term[分量]{id="math.linear-algebra.component"}，用:term[点积]{id="math.linear-algebra.dot-product"}和:term[长度]{id="math.linear-algebra.length"}算出$\cos\theta$。

**推导**：$\vb u\cdot\vb v=0+1+0=1$，$|\vb u|=|\vb v|=\sqrt2$，所以$\cos\theta=\frac{1}{\sqrt2\cdot\sqrt2}=\frac12$，$\theta=\frac\pi3$。三条面对角线的端点$(1,1,0)$、$(0,1,1)$、$(1,0,1)$两两相距$\sqrt2$，围成等边三角形，和$60^\circ$对得上。

### 例 2　分解成平行和垂直的两部分

把$\vb u=(1,3)$分解成与$\vb v=(1,1)$:term[平行]{id="math.linear-algebra.parallel"}的部分和与$\vb v$:term[正交]{id="math.linear-algebra.orthogonal"}的部分。

**为什么想到这么做**：平行的部分就是:term[投影]{id="math.linear-algebra.projection"}$\frac{\vb u\cdot\vb v}{\vb v\cdot\vb v}\vb v$，剩下的部分自动与$\vb v$正交。

**推导**：$\vb u\cdot\vb v=1+3=4$，$\vb v\cdot\vb v=2$，投影是$2\vb v=(2,2)$，剩下的是$(1,3)-(2,2)=(-1,1)$。验算：$(-1,1)\cdot(1,1)=0$，所以$\vb u=(2,2)+(-1,1)$就是要求的分解。

## 常见误区

- 「:term[点积]{id="math.linear-algebra.dot-product"}是一个向量。」点积是数；$\vb u\cdot\vb v$和:term[数乘]{id="math.linear-algebra.scalar-multiplication"}（scalar multiplication）$c\vb v$不是一回事。
- 「$\vb u\cdot\vb v=0$，就有$\vb u=\vb 0$或$\vb v=\vb 0$。」$(1,1)\cdot(1,-1)=0$，两个非零向量:term[正交]{id="math.linear-algebra.orthogonal"}时点积也是零。
- 「$(\vb u\cdot\vb v)\vb w=\vb u(\vb v\cdot\vb w)$。」左边是$\vb w$的倍数，右边是$\vb u$的倍数，一般不相等。
- 「$\vb u\cdot\vb v=\vb u\cdot\vb w$，就能消去$\vb u$得$\vb v=\vb w$。」只能推出$\vb u\cdot(\vb v-\vb w)=0$，即$\vb u$与$\vb v-\vb w$正交。

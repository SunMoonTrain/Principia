---
id: physics.newtonian-mechanics.momentum-conservation
title: |
  质心与动量守恒
goal: |
  会求质点系的质心，并用动量守恒分析不受外力的系统。
prerequisites: [physics.newtonian-mechanics.momentum-impulse]
minutes: 30
summary: |
  外力之和等于$M\vb a_{\mathrm C}$；外力之和为零时，总动量守恒。
status: reviewed
---

## 这一节要回答的问题

站在冰面上的两个人互相一推，各自朝相反的方向滑开，轻的那个滑得快。礼花弹在空中炸成许多碎片，四散飞去，碎片「整体」的运动却好像没有乱。几个物体之间的相互作用再复杂，有没有什么量不受它的影响？

## 讲解

### 质点系、内力和外力

::anchor{id="def-system"}
把要研究的几个质点合在一起看，叫作:term[质点系]{id="physics.newtonian-mechanics.system-of-particles"}（system of particles）。质点系里各个质点之间的:term[力]{id="physics.newtonian-mechanics.force"}（force）叫作:term[内力]{id="physics.newtonian-mechanics.internal-force"}（internal force），质点系以外的物体对其中质点的力叫作:term[外力]{id="physics.newtonian-mechanics.external-force"}（external force）。

为什么这样定义：由:term[牛顿第三定律]{id="physics.newtonian-mechanics.newtons-third-law"}（Newton's third law），内力总是成对出现、等大反向，把它们和外力分开，就能看出系统整体的运动只由外力决定。边界情况：一个力是内力还是外力，要看系统怎样划分：两人互推时，把两人都算进系统，推的力是内力；只看其中一人，另一人推他的力就是外力。

### 质心

::anchor{id="def-center-of-mass"}
:term[质量]{id="physics.newtonian-mechanics.mass"}（mass）为$m_1,\dots,m_N$、位置为$\vb r_1,\dots,\vb r_N$的质点组成的:term[质点系]{id="physics.newtonian-mechanics.system-of-particles"}，总质量是$M=\sum m_i$，位置$\vb r_{\mathrm C}=\frac1M\sum m_i\vb r_i$叫作它的:term[质心]{id="physics.newtonian-mechanics.center-of-mass"}（center of mass）。

为什么这样定义：对时间求导，$M\vb v_{\mathrm C}=\sum m_i\vb v_i$，系统的总:term[动量]{id="physics.newtonian-mechanics.momentum"}（momentum）$\vb P$正好等于总质量乘质心的:term[速度]{id="physics.newtonian-mechanics.velocity"}（velocity），质心的运动代表了系统整体的运动。两个质点时，质心在两者的连线上，到两者的距离和它们的质量成反比，靠近重的那个。边界情况：质心不一定在哪个质点上，双星（binary star）的质心就在两颗星之间的空处；换一个坐标原点，每个$\vb r_i$都加上同一个矢量，$\vb r_{\mathrm C}$也加上它，质心还是空间里的同一个点。

### 质心运动定理

::anchor{id="thm-cm-motion"}
定理（:term[质心运动定理]{id="physics.newtonian-mechanics.center-of-mass-theorem"}，center-of-mass theorem）：在:term[惯性系]{id="physics.newtonian-mechanics.inertial-frame"}（inertial frame）里，:term[质点系]{id="physics.newtonian-mechanics.system-of-particles"}受的:term[外力]{id="physics.newtonian-mechanics.external-force"}之和$\vb F_{\text{外}}$等于:term[总质量]{id="physics.newtonian-mechanics.mass"}乘:term[质心]{id="physics.newtonian-mechanics.center-of-mass"}的:term[加速度]{id="physics.newtonian-mechanics.acceleration"}（acceleration），$\vb F_{\text{外}}=M\vb a_{\mathrm C}$，也就是$\vb F_{\text{外}}=\dv{\vb P}t$。

证明思路：第$i$个质点受的:term[力]{id="physics.newtonian-mechanics.force"}分成外力$\vb F_i$和别的质点给它的:term[内力]{id="physics.newtonian-mechanics.internal-force"}$\vb f_{ij}$，由:term[牛顿第二定律]{id="physics.newtonian-mechanics.newtons-second-law"}（Newton's second law），$m_i\vb a_i=\vb F_i+\sum_{j\ne i}\vb f_{ij}$。对所有质点相加，由:term[牛顿第三定律]{id="physics.newtonian-mechanics.newtons-third-law"}，$\vb f_{ij}+\vb f_{ji}=\vb 0$，内力两两抵消，剩下$\sum m_i\vb a_i=\vb F_{\text{外}}$。左边是总:term[动量]{id="physics.newtonian-mechanics.momentum"}的变化率，由质心的定义求两次导数，它也等于$M\vb a_{\mathrm C}$。

所以质心就像一个质量为$M$、受全部外力的质点那样运动；内力再大，也改变不了质心的运动。

### 动量守恒

::anchor{id="thm-momentum-conservation"}
推论（:term[动量守恒]{id="physics.newtonian-mechanics.conservation-of-momentum"}，conservation of momentum）：:term[质点系]{id="physics.newtonian-mechanics.system-of-particles"}受的:term[外力]{id="physics.newtonian-mechanics.external-force"}之和为零时，总:term[动量]{id="physics.newtonian-mechanics.momentum"}$\vb P=\sum m_i\vb v_i$保持不变，:term[质心]{id="physics.newtonian-mechanics.center-of-mass"}静止或者做匀速直线运动。

外力之和不为零、但它在某个方向上的分量为零时，总动量在这个方向上的分量守恒。碰撞、爆炸这类过程时间很短，:term[内力]{id="physics.newtonian-mechanics.internal-force"}很大，外力的:term[冲量]{id="physics.newtonian-mechanics.impulse"}（impulse）和它们相比可以忽略，总动量也近似守恒。换一个以:term[速度]{id="physics.newtonian-mechanics.velocity"}$\vb u$运动的:term[惯性系]{id="physics.newtonian-mechanics.inertial-frame"}，每个质点的速度都减去$\vb u$，总动量变成$\vb P-M\vb u$，原来不变的现在仍然不变：动量守恒在每个惯性系里都成立。

## 几何图像

![礼花弹在最高点炸成两块。实线是礼花弹炸开前的轨迹，从左下的发射点到最高点；虚线是它原来要走的抛物线，从最高点画到右下的落地点。炸开后，质量为 m 的碎片 A 几乎竖直地向上飞出、再落下，质量为 2m 的碎片 B 向右下方飞出，两条彩色实线是它们的轨迹。每隔相同的时间标出两块碎片的位置并用细线连起来，细线上离 B 较近、把 A 到 B 的距离分成 2 比 1 的那一点是质心，画成空心圆，这些空心圆都落在虚线上，直到 B 落地。右上角的小图是炸开前后的动量：A 的动量和 B 的动量首尾相接，合起来正好是炸开前礼花弹的动量](explosion.svg)

礼花弹在最高点炸成:term[质量]{id="physics.newtonian-mechanics.mass"}为$m$的$A$和质量为$2m$的$B$，空气的影响可以忽略。爆炸的:term[内力]{id="physics.newtonian-mechanics.internal-force"}很大、时间很短，炸开前后总:term[动量]{id="physics.newtonian-mechanics.momentum"}不变，右上角的小图里$\vb p_A+\vb p_B$等于炸开前的$\vb P$。炸开以后，两块碎片的:term[加速度]{id="physics.newtonian-mechanics.acceleration"}都是:term[重力加速度]{id="physics.newtonian-mechanics.gravitational-acceleration"}（gravitational acceleration）$\vb g$，:term[质心]{id="physics.newtonian-mechanics.center-of-mass"}的加速度也是$\vb g$，所以质心沿原来的抛物线前进；$B$落地以后，地面的:term[力]{id="physics.newtonian-mechanics.force"}成了:term[外力]{id="physics.newtonian-mechanics.external-force"}，质心就不再沿抛物线走了。

## 例题

### 例 1　地球和月亮的质心

地球的:term[质量]{id="physics.newtonian-mechanics.mass"}是$5.97\times10^{24}\,\mathrm{kg}$，半径约$6.37\times10^6\,\mathrm m$；月亮的质量是$7.35\times10^{22}\,\mathrm{kg}$，两者的中心相距$3.84\times10^8\,\mathrm m$。把它们看作两个质点，它们的:term[质心]{id="physics.newtonian-mechanics.center-of-mass"}在哪里？

**为什么想到这么做**：取地心为原点、指向月亮的方向为$x$轴，质心在两者的连线上，按定义算它的坐标。

**推导**：$x_{\mathrm C}=\frac{7.35\times10^{22}\times3.84\times10^8}{5.97\times10^{24}+7.35\times10^{22}}\approx4.67\times10^6\,\mathrm m$，约$4670\,\mathrm{km}$，比地球的半径小。所以地月系统的质心在地球内部、离地心约四分之三个地球半径的地方，地球和月亮都绕着这一点转，地球的中心每个月也画出一个小圈。

### 例 2　船上走动的人

:term[质量]{id="physics.newtonian-mechanics.mass"}$120\,\mathrm{kg}$、长$3.0\,\mathrm m$的小船静止在水面上，质量$60\,\mathrm{kg}$的人从船尾走到船头。水对船在水平方向的作用可以忽略，船移动了多远？

**为什么想到这么做**：人和船组成的系统在水平方向不受:term[外力]{id="physics.newtonian-mechanics.external-force"}，原来静止，水平方向的总:term[动量]{id="physics.newtonian-mechanics.momentum"}一直为零，:term[质心]{id="physics.newtonian-mechanics.center-of-mass"}在水平方向不动。人往前走，船就往后退。

**推导**：取人前进的方向为正，设船移动了$d$，人相对地面移动了$3.0+d$。质心不动：$60\times(3.0+d)+120\,d=0$，$d=-1.0\,\mathrm m$。船向后退了$1.0\,\mathrm m$，人相对地面只前进了$2.0\,\mathrm m$；不管人走得快慢、中途停不停，结果都一样。

## 常见误区

- 「系统的总:term[动量]{id="physics.newtonian-mechanics.momentum"}守恒，其中每个物体的动量也不变。」两人互推以后，各自的动量都变了，只是两个改变等大反向，加起来为零。
- 「坐在小车上的人用力推车的前挡板，车就会被推着前进。」人推车的:term[力]{id="physics.newtonian-mechanics.force"}和车推人的力是一对:term[内力]{id="physics.newtonian-mechanics.internal-force"}；地面对车没有水平方向的力时，人和车的总动量不变，原来静止，:term[质心]{id="physics.newtonian-mechanics.center-of-mass"}就一直不动。

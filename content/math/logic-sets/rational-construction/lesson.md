---
id: math.logic-sets.rational-construction
title: |
  用等价类构造有理数
goal: |
  会用整数的有序对和等价类构造有理数，并验证它的加法和乘法与代表元的选取无关。
prerequisites: [math.logic-sets.number-constructions]
minutes: 22
summary: |
  整数对$(a,b)$、$(c,d)$（$b,d\ne0$），$ad=bc$时粘成一个有理数；加法、乘法良定义。
status: reviewed
---

## 这一节要回答的问题

整数里$1\div2$没有意义，$\frac12$又是什么数？$\frac12$、$\frac24$、$\frac{-3}{-6}$写法不同，却是同一个数；能不能像造整数那样，只用整数的:term[有序对]{id="math.logic-sets.ordered-pair"}（ordered pair），把这些写法合成一个数？合起来以后，相加、相乘都要挑一种写法来算，换一种写法，结果为什么不变？

## 讲解

### 比值相同的有序对

用:term[有序对]{id="math.logic-sets.ordered-pair"}$(a,b)$表示$a$除以$b$，$(1,2)$和$(2,4)$比值相同。还没有除法，「$\frac12=\frac24$」要改写成交叉相乘：$1\cdot4=2\cdot2$。

::anchor{id="def-rational-relation"}
在$\Z\times(\Z\setminus\{0\})$上规定:term[关系]{id="math.logic-sets.binary-relation"}（binary relation）$\sim$：$(a,b)\sim(c,d)$当且仅当$ad=bc$。本节的$\sim$都指这一个，和[造整数](lesson:math.logic-sets.number-constructions#def-integer-relation)时的不同。

为什么这样规定：它说的就是$\frac ab=\frac cd$，却只用到整数的乘法；两个分量同乘非零整数$k$，比值不变，$(a,b)\sim(ka,kb)$。边界情况：第二个分量不许是$0$。要是不加限制，$(1,2)\sim(0,0)$，$(0,0)\sim(1,3)$，可$1\cdot3\ne2\cdot1$，:term[传递性]{id="math.logic-sets.transitive"}（transitivity）就没有了。

::anchor{id="thm-rational-relation"}
**定理**　$\sim$是$\Z\times(\Z\setminus\{0\})$上的:term[等价关系]{id="math.logic-sets.equivalence-relation"}（equivalence relation）。

**证明**：用[整数的运算律](lesson:math.logic-sets.number-constructions#thm-integer-laws)。$ab=ba$，所以$\sim$:term[自反]{id="math.logic-sets.reflexive"}（reflexive）；$ad=bc$可以改写成$cb=da$，所以它:term[对称]{id="math.logic-sets.symmetric"}（symmetric）。再看传递：设$ad=bc$，$cf=de$，则

$$
(af)d=(ad)f=(bc)f=b(cf)=b(de)=(be)d .
$$

$d\ne0$，由:term[消去律]{id="math.logic-sets.cancellation-law"}（cancellation law），$af=be$，即$(a,b)\sim(e,f)$。

::anchor{id="def-rationals"}
:term[商集]{id="math.logic-sets.quotient-set"}（quotient set）$\Q=(\Z\times(\Z\setminus\{0\}))/{\sim}$的元素叫作有理数（rational number），$(a,b)$所在的:term[等价类]{id="math.logic-sets.equivalence-class"}（equivalence class）记作$[(a,b)]$。

为什么这样定义：比值相同的有序对粘成一个，它们就是同一个数的不同写法；由[等价关系与商集](lesson:math.logic-sets.equivalence-relations#thm-class-lemma)，$[(a,b)]=[(c,d)]$当且仅当$ad=bc$。边界情况：$[(1,2)]=[(2,4)]=[(-3,-6)]$，一个有理数有无穷多个:term[代表元]{id="math.logic-sets.representative"}（representative），分母为正的最简分数只是其中一个。

### 加法与乘法

分数相加先通分：$\frac12+\frac13=\frac{1\cdot3+2\cdot1}{2\cdot3}$，分母取两个分母的积，不必是最小公倍数。写成:term[有序对]{id="math.logic-sets.ordered-pair"}，加法是借:term[代表元]{id="math.logic-sets.representative"}规定的：拿哪一种写法来通分，得到的都该是同一个有理数，这就要验证它是:term[良定义]{id="math.logic-sets.well-defined"}的（well-defined）。

::anchor{id="thm-rational-addition"}
**定理**　规定$[(a,b)]+[(c,d)]=[(ad+bc,\ bd)]$是良定义的，它给出$\Q\times\Q\to\Q$的:term[映射]{id="math.logic-sets.map"}（map），叫作有理数的加法。

**证明**：[非零整数的积不是$0$](lesson:math.logic-sets.number-constructions#thm-integer-laws)，所以$bd\ne0$，右边确实是有理数。设$(a,b)\sim(a',b')$，$(c,d)\sim(c',d')$，即$ab'=ba'$，$cd'=dc'$，则

$$
\begin{aligned}
(ad+bc)(b'd')&=(ab')(dd')+(cd')(bb')\\
&=(ba')(dd')+(dc')(bb')=(bd)(a'd'+b'c') ,
\end{aligned}
$$

这正是$(ad+bc,\ bd)\sim(a'd'+b'c',\ b'd')$。

定理里，左边的加号是刚规定的，右边圆括号里的是整数的加法。乘法照$\frac ab\cdot\frac cd=\frac{ac}{bd}$来规定。

::anchor{id="thm-rational-multiplication"}
**定理**　规定$[(a,b)]\cdot[(c,d)]=[(ac,\ bd)]$是良定义的，它给出$\Q\times\Q\to\Q$的映射，叫作有理数的乘法。

**证明**：同样$bd\ne0$。设$ab'=ba'$，$cd'=dc'$，则

$$
(ac)(b'd')=(ab')(cd')=(ba')(dc')=(bd)(a'c') ,
$$

即$(ac,\ bd)\sim(a'c',\ b'd')$。

顺手的规定不一定行。「分子加分子，分母加分母」，即$[(a,b)]\oplus[(c,d)]=[(a+c,\ b+d)]$，就不是良定义的：$(1,2)$和$(1,1)$给出$(2,3)$，把$(1,2)$换成$(2,4)$，给出$(3,5)$，而$2\cdot5\ne3\cdot3$；况且$b+d$可能是$0$。

### 整数放进有理数，倒数

$[(3,1)]$是$3$除以$1$，应当就是整数$3$。

::anchor{id="thm-integers-in-rationals"}
**定理**　$a\mapsto[(a,1)]$把不同的整数送到不同的有理数，并且$[(a,1)]+[(c,1)]=[(a+c,1)]$，$[(a,1)]\cdot[(c,1)]=[(ac,1)]$。

**证明**：$[(a,1)]=[(c,1)]$就是$a\cdot1=1\cdot c$，即$a=c$；两个等式照规定算出来就是。

所以可以把整数$a$和$[(a,1)]$看成一个，$\Z$就放进了$\Q$。$[(a,b)]=0$就是$a\cdot1=b\cdot0$，即$a=0$。

$\frac23$的分子、分母对调，得$\frac32$，两数相乘得$1$。

::anchor{id="def-reciprocal"}
$a\ne0$时，有理数$[(b,a)]$叫作$[(a,b)]$的倒数（reciprocal）；有理数$x$除以非零的$y$，规定为$x$乘$y$的倒数。

为什么这样定义：$[(a,b)]\cdot[(b,a)]=[(ab,\ ba)]$，就是$1$，所以除以$y$再乘$y$，又回到$x$。它也是:term[良定义]{id="math.logic-sets.well-defined"}的：$ab'=ba'$就是$ba'=ab'$，$a\ne0$时$ab'\ne0$，$a'$也不是$0$。边界情况：$0$没有倒数，$[(0,b)]\cdot[(c,d)]=[(0,bd)]$总是$0$。

整数里除不尽的，现在也除得了：$[(a,b)]=[(a,1)]\cdot[(1,b)]$，正是$a$除以$b$，以后记回$\frac ab$。

::anchor{id="thm-rational-laws"}
对有理数$x$、$y$、$z$，加法和乘法都满足交换律（commutative law）、结合律（associative law），乘法对加法满足分配律（distributive law），$x+0=x$，$x\cdot1=x$，$x+(-1)x=0$。证明见第 5 题。

例如$[(a,b)]+[(c,d)]$和$[(c,d)]+[(a,b)]$分别是$[(ad+bc,\ bd)]$和$[(cb+da,\ db)]$，由整数的交换律，是同一个。

### 有理数的大小

整数的大小照中学的用。$\frac12$、$\frac23$通分成$\frac36$、$\frac46$，就只要比分子。

::anchor{id="def-rational-order"}
设$b$、$d$是正整数。$ad<bc$时，说有理数$[(a,b)]$小于$[(c,d)]$，记作$[(a,b)]<[(c,d)]$；只要分母取正的，这和:term[代表元]{id="math.logic-sets.representative"}的选取无关，证明见第 6 题。

为什么这样定义：通分以后分母都是正数$bd$，比的是$ad$和$bc$；$(a,b)\sim(-a,-b)$，分母为正的代表元总有。边界情况：分母一正一负时不能用，$-\frac12<0$，拿$(1,-2)$、$(0,1)$来算，${1\cdot1<(-2)\cdot0}$却不成立。

从$\N$造$\Z$，从$\Z$造$\Q$，都是拿:term[有序对]{id="math.logic-sets.ordered-pair"}表示想要的差或商，把结果相同的粘成一个，再借代表元规定运算。从$\Q$造$\R$，数学分析换了办法（见[用戴德金分割构造实数](lesson:math.analysis.real-construction)）：一个数完全由「哪些有理数比它小」决定，就拿这样的有理数集合（:term[戴德金分割]{id="math.analysis.dedekind-cut"}，Dedekind cut）当作实数。$\N$、$\Z$、$\Q$、$\R$就这样一步步造了出来。

## 几何图像

![点阵，横的方向是 a，从 −6 到 6，纵的方向是 b，从 −4 到 4。b = 0 的一行上是空心的小圆，写着 b = 0，不取。四条过原点的直线，线端标着 −1/2、0、1/2、2，原点处是空心圆圈；1/2 的一条用强调色，经过 (−2, −4)、(−1, −2)、(1, 2)、(2, 4) 四个强调色的圆点。粗的水平线写着 b = 1，当作数轴，它和这四条直线从左到右依次交在横坐标为 −1/2、0、1/2、2 的地方，−1/2、1/2 两处不在点阵的点上，画成菱形](ratio-lines.svg)

图上的点是:term[有序对]{id="math.logic-sets.ordered-pair"}$(a,b)$，只画了一部分；$b=0$的一行不取，画成空心。过原点的一条直线上的点（原点不取）比值相同，合起来就是线端标着的有理数：$(a,b)$和$(c,d)$在同一条这样的直线上，说的就是$ad=bc$。强调色的是$\frac12$，画出的四个点都是它的:term[代表元]{id="math.logic-sets.representative"}，分母为正、约到最简的是$(1,2)$。

粗线$b=1$可以当数轴：每条这样的直线和它恰好交于一点，横坐标就是比值，整数落在格点（lattice point，两个坐标都是整数的点）上；图上$-\frac12$、$\frac12$的两个交点不是格点，画成菱形。反过来，原点和$b=1$上横坐标为$\sqrt2$的点连成的直线，除了原点碰不到格点，因为[$\sqrt2$不是有理数](lesson:math.logic-sets.proof-methods#thm-sqrt2)。

![横轴是 a，从 0 到 6，纵轴是 b，从 0 到 4。从原点发出三条直线，线端标着 1/2、1、3/2，3/2 用强调色。第 2 行上，从 a = 0 到 1 的一段和从 1 到 3 的较淡的一段首尾相接，下面分别标着长 1、长 2，行末写着 1 + 2 = 3，终点 (3, 2) 是强调色的圆点；第 4 行上，从 0 到 2 的一段和从 2 到 6 的较淡的一段首尾相接，下面分别标着长 2、长 4，行末写着 2 + 4 = 6，终点 (6, 4) 是强调色的圆点。两个终点都在标着 3/2 的直线上](common-row.svg)

这幅图看加法为什么:term[良定义]{id="math.logic-sets.well-defined"}：通分，是让两个代表元沿各自的直线挪到同一行；分子相加，是把两段横的长度（图上一浓一淡）首尾相接。$(1,2)$、$(1,1)$通分到第$2$行，终点是$(3,2)$；$\frac12$换成$(2,4)$，就通分到第$4$行，终点是$(6,4)$。从第$2$行换到第$4$行，只是整个从原点放大到$2$倍，终点仍在标着$\frac32$的直线上，还是同一个有理数。

造整数时，同类的点排在互相平行的斜线上，按分量相加就良定义。这里同类的点排在过原点的直线上，按分量相加，结果落在哪条直线上，要看两个点离原点多远，所以$\oplus$不行。

## 例题

### 例 1　换代表元算同一个和

分别用$(1,2)$、$(1,3)$和$(2,4)$、$(-1,-3)$当:term[代表元]{id="math.logic-sets.representative"}，算$[(1,2)]+[(1,3)]$，验证结果相同。

**为什么想到这么做**：:term[良定义]{id="math.logic-sets.well-defined"}的证明是对所有代表元说的，拿具体的数走一遍，看清算出的:term[有序对]{id="math.logic-sets.ordered-pair"}会变，它所在的类不变。

**推导**：第一种，$(1\cdot3+2\cdot1,\ 2\cdot3)=(5,6)$。第二种，$(2\cdot(-3)+4\cdot(-1),\ 4\cdot(-3))=(-10,-12)$。两个有序对不同，可$5\cdot(-12)=6\cdot(-10)$，所以$[(5,6)]=[(-10,-12)]$，和都是$\frac56$。

### 例 2　是不是良定义

下面两条规定，哪一条给出$\Q\to\Q$的:term[映射]{id="math.logic-sets.map"}？(1) $F([(a,b)])=[(a^2,b^2)]$；(2) $G([(a,b)])=[(a+b,1)]$。

**为什么想到这么做**：先看它是不是只和比值有关。$(a^2,b^2)$的比值是原来比值的平方，多半行；$a+b$随写法变，多半不行，找两个:term[代表元]{id="math.logic-sets.representative"}试。

**推导**：(1) $b\ne0$，所以$b^2\ne0$；设$ab'=ba'$，两边平方，$a^2b'^2=b^2a'^2$，即$(a^2,b^2)\sim(a'^2,b'^2)$。所以$F$是:term[良定义]{id="math.logic-sets.well-defined"}的，就是$x\mapsto x\cdot x$。(2) $[(1,2)]=[(2,4)]$，可$1+2=3$，$2+4=6$，$[(3,1)]\ne[(6,1)]$，$G$不是良定义的。[造整数](lesson:math.logic-sets.number-constructions)时，$[(a,b)]\mapsto[(a^2,b^2)]$却不是良定义的：同一个式子行不行，要看:term[有序对]{id="math.logic-sets.ordered-pair"}代表什么。

## 常见误区

- 「投$2$次中$1$次，投$3$次中$1$次，合起来投$5$次中$2$次，可见$\frac12$和$\frac13$合起来是$\frac25$。」不对：只知道这两个命中率，合不出来。投$4$次中$2$次，命中率也是$\frac12$，和投$3$次中$1$次合起来，却是$\frac37$；「分子加分子，分母加分母」合的是:term[有序对]{id="math.logic-sets.ordered-pair"}，不是有理数。
- 「两个:term[代表元]{id="math.logic-sets.representative"}表示同一个有理数，其中一个就是另一个的两个分量同乘一个整数得来的。」不对：$(2,4)$、$(3,6)$都表示$\frac12$，谁也不是谁的整数倍。所以验证:term[良定义]{id="math.logic-sets.well-defined"}，只把$(a,b)$换成$(ka,kb)$还差一步，要从$ab'=ba'$出发。
- 「$\frac ab=\frac cd$两边同乘$bd$，就得$ad=bc$，所以$ad=bc$是推出来的，不用规定。」次序反了：造有理数时还没有$\frac ab$，是拿$ad=bc$规定哪些写法算同一个；造好以后，这样推才有意义。
- 「$\frac10$只是还没有规定，规定成某个有理数就行。」不行：它要是有理数$r$，$r$乘$0$就该回到$1$，可$r\cdot0=0$。不当作有理数，而是让$(1,0)$这样的有序对也进来，会怎样，见第 7 题。

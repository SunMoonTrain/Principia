---
id: math.logic-sets.equivalence-relations
title: |
  等价关系与商集
goal: |
  会验证一个关系是等价关系，并写出它的等价类和对应的划分。
prerequisites: [math.logic-sets.cartesian-product, math.logic-sets.indexed-families]
minutes: 30
summary: |
  等价关系的等价类组成一个划分，反过来划分也给出等价关系。
status: reviewed
---

## 这一节要回答的问题

钟面上$13$点和$1$点是同一个位置，相差$360^\circ$的两个角终边相同，除以$3$余数相同的整数在很多问题里也可以看成一样。「看成一样」的规则要满足什么条件，才能把一个集合干净地分成互不重叠的几类？分好以后，把每一类当作一个新的对象，得到的又是什么？

## 讲解

### 对称性与等价关系

「看成一样」是一种:term[关系]{id="math.logic-sets.binary-relation"}（binary relation）：$\Z$上「除以$3$的余数相同」，$\R^2$上「到原点的距离相同」，$\R$上「两数之差是$2\pi$的整数倍」。它们都是:term[自反的]{id="math.logic-sets.reflexive"}（reflexive）、:term[传递的]{id="math.logic-sets.transitive"}（transitive），还多一条：$a$和$b$有这个关系，$b$和$a$也有。

::anchor{id="def-symmetric"}
设$R$是集合$A$上的关系。如果对所有$a,b\in A$，只要$a\mathrel{R}b$，就有$b\mathrel{R}a$，就说$R$具有:term[对称性]{id="math.logic-sets.symmetric"}（symmetry），也说$R$是对称的（symmetric）。

为什么单独起名：「一样」不分先后，$\le$、$\subseteq$却分先后。边界情况：$1\le1$倒过来成立，$1\le2$倒过来却不成立，有一对倒不过来，$\le$就不对称。

::anchor{id="def-equivalence-relation"}
集合$A$上自反、对称、传递的关系，叫作$A$上的:term[等价关系]{id="math.logic-sets.equivalence-relation"}（equivalence relation），常记作$\sim$，$a\sim b$读作「$a$等价于$b$」。

为什么要这三条：「一样」应当自己和自己一样，不分先后，还能传下去。三条缺一不可：$\le$自反、传递，不对称；$\R$上的「$|x-y|\le1$」自反、对称，不传递，$0$与$1$、$1$与$2$满足，$0$与$2$不满足；对称、传递而不自反的，见[笛卡儿积与关系](lesson:math.logic-sets.cartesian-product)第 8 题。

记号$\sim$还记单变量微积分的:term[等价无穷小]{id="math.calculus.equivalent-infinitesimal"}（equivalent infinitesimals），它也是等价关系；物理里还用它表示数量级相同，或者当范围号。

::anchor{id="def-congruence"}
设$n$是正整数。若整数$a$、$b$满足$n\mid a-b$，就说$a$与$b$模$n$同余（congruent modulo $n$），记作$a\equiv b\pmod n$。

为什么用差来定义：不必先算余数，整除的性质直接用得上。边界情况：$n=1$时任何两个整数都同余，$n=2$时同余就是奇偶相同。

::anchor{id="thm-congruence-equivalence"}
**定理**　设$n$是正整数。(1) 模$n$同余是$\Z$上的等价关系；(2) $a\equiv b\pmod n$当且仅当$a$、$b$除以$n$的余数相同。

**证明**：(1) $a-a=0\cdot n$；若$a-b=kn$，则$b-a=(-k)n$；若又有$b-c=ln$，则$a-c=(k+l)n$。$k$、$l$是整数，所以模$n$同余自反、对称、传递。

(2) 由带余除法（division with remainder），设$a=qn+r$，$b=q'n+r'$，$0\le r<n$，$0\le r'<n$。若$r=r'$，则$a-b=(q-q')n$。反过来，若$a-b=kn$，则$a=(q'+k)n+r'$，由:term[余数的唯一性]{id="math.logic-sets.remainder-uniqueness"}（uniqueness of remainder，见[直接证明与逆否证明](lesson:math.logic-sets.direct-proof#thm-remainder-unique)），$r=r'$。

### 等价类与商集

模$3$同余时，和$1$同余的整数是$\dots,-2,1,4,7,\dots$，和$4$同余的也正是这些。

::anchor{id="def-equivalence-class"}
设$\sim$是集合$A$上的:term[等价关系]{id="math.logic-sets.equivalence-relation"}，$a\in A$。$A$中与$a$等价的元素组成的集合$[a]=\{x\in A:x\sim a\}$，叫作$a$所在的:term[等价类]{id="math.logic-sets.equivalence-class"}（equivalence class）；几个等价关系并用时写成$[a]_\sim$。

为什么这样定义：把和$a$看成一样的元素收成一包。边界情况：由:term[自反性]{id="math.logic-sets.reflexive"}，$a\in[a]$，等价类都不是:term[空集]{id="math.logic-sets.empty-set"}（empty set）；方括号也写闭区间，看上下文分得清。

::anchor{id="thm-class-lemma"}
**定理**　设$\sim$是集合$A$上的等价关系，$a,b\in A$。(1) $[a]=[b]$当且仅当$a\sim b$；(2) 若$[a]\cap[b]\ne\varnothing$，则$[a]=[b]$。

**证明**：(1) 若$[a]=[b]$，则$a\in[a]=[b]$，即$a\sim b$。反过来设$a\sim b$：任取$x\in[a]$，则$x\sim a$，由:term[传递性]{id="math.logic-sets.transitive"}$x\sim b$，$x\in[b]$，所以$[a]\subseteq[b]$；由:term[对称性]{id="math.logic-sets.symmetric"}$b\sim a$，同理$[b]\subseteq[a]$，所以$[a]=[b]$。

(2) 取$c\in[a]\cap[b]$，则$c\sim a$，$c\sim b$，由对称性、传递性得$a\sim b$，再用 (1)。

所以两个等价类要么相等，要么:term[不相交]{id="math.logic-sets.disjoint"}（disjoint）。

::anchor{id="def-representative"}
把一个等价类写成$[a]$时，所取的元素$a$叫作这个类的:term[代表元]{id="math.logic-sets.representative"}（representative）。

为什么起这个名字：由上面的定理，类里每个元素都能拿来写这个类，模$3$时$[1]=[4]=[-2]$。边界情况：:term[相等关系]{id="math.logic-sets.binary-relation"}的类只有一个元素，代表元没得挑。复分析的:term[辐角主值]{id="math.complex-analysis.principal-argument"}（principal argument），就是在相差$2\pi$整数倍的一类:term[辐角]{id="math.complex-analysis.argument"}（argument）里挑出的代表元。

::anchor{id="def-quotient-set"}
集合$A$关于等价关系$\sim$的全部等价类组成的集合，叫作$A$关于$\sim$的:term[商集]{id="math.logic-sets.quotient-set"}（quotient set），记作$A/{\sim}$。

为什么这样定义：把看成一样的元素粘成一个，新集合的元素就是类。$\Z$关于模$3$同余的商集是$\{[0],[1],[2]\}$：每个整数和它除以$3$的余数同余，而$0$、$1$、$2$两两不同余。边界情况：商集的元素是$A$的:term[子集]{id="math.logic-sets.subset"}（subset），这个商集只有$3$个元素，每个元素却含有无穷多个整数。

借代表元规定商集上的运算，如$[a]+[b]=[a+b]$，要验证换代表元结果不变，见第 6 题和[用等价类构造整数与有理数](lesson:math.logic-sets.number-constructions)。

### 等价关系与划分

模$3$同余的三个类两两没有公共元素，合起来正是$\Z$。

::anchor{id="def-partition"}
集合$A$的一些非空:term[子集]{id="math.logic-sets.subset"}组成的集合，如果这些子集:term[两两不相交]{id="math.logic-sets.pairwise-disjoint"}（pairwise disjoint），并起来是$A$，就叫作$A$的一个:term[划分]{id="math.logic-sets.partition"}（partition），其中的子集叫作块（block）。

为什么这样定义：「分成几块，每块都有元素，块与块不重叠，合起来不漏」说精确了就是这三条。块要非空：:term[等价类]{id="math.logic-sets.equivalence-class"}都不空，而允许空块的话，$\{\{1,2,3\}\}$和$\{\{1,2,3\},\varnothing\}$按「在同一块里」给出同一个:term[等价关系]{id="math.logic-sets.equivalence-relation"}，划分和等价关系就不能一个对一个。边界情况：$\{\{1,2\},\{3\}\}$是$\{1,2,3\}$的划分，$\{\{1,2\},\{2,3\}\}$有重叠，$\{\{1\},\{2\}\}$漏了$3$，$\{\{1,2,3\},\varnothing\}$有空块，都不是。

::anchor{id="thm-partition"}
**定理**　若$\sim$是集合$A$上的:term[等价关系]{id="math.logic-sets.equivalence-relation"}，则全部:term[等价类]{id="math.logic-sets.equivalence-class"}组成$A$的一个划分，即:term[商集]{id="math.logic-sets.quotient-set"}$A/{\sim}$是$A$的划分。

**证明**：每个$a\in A$都属于$[a]$，所以等价类都不是:term[空集]{id="math.logic-sets.empty-set"}，并起来是$A$；由上面关于等价类的定理，不同的等价类:term[不相交]{id="math.logic-sets.disjoint"}。

反过来，给定$A$的一个划分，规定$a\sim b$当且仅当$a$、$b$在同一块里，$\sim$就是等价关系，它的等价类正是这些块，证明见第 5 题（1）。由上面关于等价类的定理 (1)，$a\sim b$当且仅当$a$、$b$在同一类里，即等价关系又由等价类定下来，所以$A$上的等价关系和$A$的划分一个对一个。

数学分析把有理数的:term[柯西列]{id="math.analysis.cauchy-sequence"}（Cauchy sequence）按「两个数列之差趋于$0$」分组，这是等价关系，所以各组互不相交，每个柯西列恰在一组里。

## 几何图像

![左图是一块形状不规则的区域 A，被三条曲线分成四块，相邻两块的底色深浅不同；每块里有一个强调色的圆点，分别标着 a、b、c、d，块上标着 [a]、[b]、[c]、[d]。右图是坐标平面，以原点为圆心画了四个同心圆，半径之比是 1∶2∶3∶4；原点和每个圆与 x 轴正半轴的交点都画成强调色的圆点](partition.svg)

左图把集合$A$分成了四块，每块里的圆点是挑出的:term[代表元]{id="math.logic-sets.representative"}，$a$所在的块就是$[a]$。块都不空、互不重叠，$A$的每个点都在某一块里，这就是$A$的一个:term[划分]{id="math.logic-sets.partition"}。

右图画的是例 1 的:term[等价类]{id="math.logic-sets.equivalence-class"}：$x^2+y^2$相等的点组成以原点为圆心的圆，原点自己成一类。每个圆和$x$轴正半轴恰好交于一点，这些交点连同原点，可以当各个类的代表元。

## 例题

### 例 1　到原点距离相同的点

在$\R^2$上规定$(x,y)\sim(x',y')$当且仅当$x^2+y^2=x'^2+y'^2$。验证$\sim$是:term[等价关系]{id="math.logic-sets.equivalence-relation"}，并写出它的:term[等价类]{id="math.logic-sets.equivalence-class"}和:term[商集]{id="math.logic-sets.quotient-set"}。

**为什么想到这么做**：两边比的是同一个式子$x^2+y^2$的值，三条性质都从等号来；和$(x_0,y_0)$等价，就是$x^2+y^2$取同一个值。

**推导**：$x^2+y^2=x^2+y^2$，:term[自反]{id="math.logic-sets.reflexive"}；等式两边可以交换，:term[对称]{id="math.logic-sets.symmetric"}；$x^2+y^2=x'^2+y'^2$、$x'^2+y'^2=x''^2+y''^2$推出$x^2+y^2=x''^2+y''^2$，:term[传递]{id="math.logic-sets.transitive"}。

记$r=\sqrt{x_0^2+y_0^2}$，则$[(x_0,y_0)]=\{(x,y)\in\R^2:x^2+y^2=r^2\}$，是以原点为圆心、半径为$r$的圆，$r=0$时只有原点。这个圆和射线$\{(x,0):x\ge0\}$恰好交于$(r,0)$，所以商集是$\{[(r,0)]:r\ge0\}$，$r$不同，类就不同。

### 例 2　差是有理数

在$\R$上规定$x\sim y$当且仅当$x-y\in\Q$。验证$\sim$是:term[等价关系]{id="math.logic-sets.equivalence-relation"}，并求$[0]$和$[\sqrt2]$；它们相等吗？

**为什么想到这么做**：$0$、有理数的相反数、两个有理数的和都是有理数，三条性质由此而来；两个:term[等价类]{id="math.logic-sets.equivalence-class"}是否相等，只看:term[代表元]{id="math.logic-sets.representative"}是否等价。

**推导**：$x-x=0\in\Q$，:term[自反]{id="math.logic-sets.reflexive"}。若$x-y\in\Q$，则$y-x=-(x-y)\in\Q$，:term[对称]{id="math.logic-sets.symmetric"}。若$x-y$、$y-z$都属于$\Q$，则$x-z=(x-y)+(y-z)\in\Q$，:term[传递]{id="math.logic-sets.transitive"}。

$[0]=\{x\in\R:x-0\in\Q\}=\Q$，$[\sqrt2]=\{\sqrt2+q:q\in\Q\}$。由[$\sqrt2$是无理数](lesson:math.logic-sets.proof-methods#thm-sqrt2)，$\sqrt2-0\notin\Q$，所以$[\sqrt2]\ne[0]$，两个类:term[不相交]{id="math.logic-sets.disjoint"}：$\sqrt2$加任何有理数都不是有理数。而$\sqrt2+\frac12\sim\sqrt2$，所以$[\sqrt2+\frac12]=[\sqrt2]$。

## 常见误区

- 「:term[商集]{id="math.logic-sets.quotient-set"}$A/{\sim}$是$A$的:term[子集]{id="math.logic-sets.subset"}，$\Z$关于模$3$同余的商集就是$\{0,1,2\}$。」不对：商集的元素是:term[等价类]{id="math.logic-sets.equivalence-class"}，每个等价类是$A$的子集，所以商集是:term[幂集]{id="math.logic-sets.power-set"}（power set）$\Pow(A)$的子集。$\{0,1,2\}$只是从三个类里各挑了一个:term[代表元]{id="math.logic-sets.representative"}，商集是$\{[0],[1],[2]\}$。
- 「$[a]$和$[b]$的代表元不同，这两个等价类就不同。」不对：$[a]=[b]$当且仅当$a\sim b$，模$3$时$1\ne4$，$[1]$和$[4]$却是同一个类。所以借代表元规定的运算，要验证结果和挑哪个代表元无关。
- 「模$n$同余里的$\equiv$，和常微分方程里的$\equiv$一样，都是『恒等于』。」不对：$a\equiv b\pmod n$说的是$n$整除$a-b$，$a$、$b$可以不相等，如$13\equiv1\pmod{12}$；所以这里的$\equiv$一律带上$\pmod n$。

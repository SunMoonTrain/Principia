---
id: math.logic-sets.maximal-elements
title: |
  极大元、最大元与上确界
goal: |
  会在偏序集里区分极大元、最大元、上界与上确界，并判断它们是否存在。
prerequisites: [math.logic-sets.partial-orders, math.logic-sets.induction]
minutes: 29
summary: |
  最大元比别的都大，极大元没有更大的；非空有限偏序集有极大元。
status: reviewed
---

## 这一节要回答的问题

把$2$到$10$按整除来比，$10$不是$9$的倍数，压不住$9$，可也没有别的数压在$10$上面。「比谁都大」和「没有比它大的」在实数里是一回事，在:term[偏序集]{id="math.logic-sets.poset"}（partially ordered set，poset）里怎么成了两回事？它们什么时候一定有？能从上面压住一个集合的那些元素里，又有没有最小的？

## 讲解

### 最大元与最小元

${(\Pow(X),\subseteq)}$里，$X$包含它的每个:term[子集]{id="math.logic-sets.subset"}（subset）；$2$到$10$按整除，却没有一个数是其余各数的倍数。

::anchor{id="def-greatest"}
设${(P,\preceq)}$是:term[偏序集]{id="math.logic-sets.poset"}，$S\subseteq P$。若$g\in S$，每个$x\in S$都有$x\preceq g$，就说$g$是$S$的:term[最大元]{id="math.logic-sets.greatest-element"}（greatest element）；若$s\in S$，每个$x\in S$都有$s\preceq x$，就说$s$是$S$的:term[最小元]{id="math.logic-sets.least-element"}（least element）。它们各至多有一个，存在时记作$\max S$、$\min S$。

为什么这样定义：这就是数集里「最大的数」，把$\le$换成了$\preceq$。「有最大元」写成量词（quantifier）是$\exists g\in S,\ \forall x\in S,\quad x\preceq g$，和[多重量词](lesson:math.logic-sets.nested-quantifiers#thm-quantifier-order)里「函数有最大值」一样。边界情况：${(\N,\le)}$有最小元$0$，没有最大元；有限的也可能没有，如$2$到$10$按整除，最大元得是$7$的倍数，只能是$7$，可$2$不整除$7$。

::anchor{id="thm-greatest-unique"}
**定理**　偏序集的子集$S$至多有一个最大元，也至多有一个最小元。

**证明**：设$g_1$、$g_2$都是最大元，则$g_1\preceq g_2$，$g_2\preceq g_1$，由:term[反对称性]{id="math.logic-sets.antisymmetric"}（antisymmetry），$g_1=g_2$。最小元倒过来就是。

把序倒过来，规定$a\preceq'b$当且仅当$b\preceq a$：三条性质照样成立，$\preceq'$也是:term[偏序]{id="math.logic-sets.partial-order"}（partial order），它的最大元就是原来的最小元。所以下面的结论把序倒过来也都成立，有的只叙述一半，证明都只写一半。

### 极大元与极小元

$2$到$10$按整除，$6$到$10$在里面的倍数都只有自己：没有一个压得住所有的数，也没有别的数压住它们。

::anchor{id="def-maximal"}
设$S$是:term[偏序集]{id="math.logic-sets.poset"}$P$的:term[子集]{id="math.logic-sets.subset"}，$m\in S$。若$S$中没有比$m$大的元素，即每个$x\in S$，只要$m\preceq x$就有$x=m$，就说$m$是$S$的:term[极大元]{id="math.logic-sets.maximal-element"}（maximal element）。若$S$中没有比$m$小的元素，即每个$x\in S$，只要$x\preceq m$就有$x=m$，就说$m$是$S$的:term[极小元]{id="math.logic-sets.minimal-element"}（minimal element）。

为什么另立一个概念：和$m$不:term[可比]{id="math.logic-sets.comparable"}（incomparable）的元素不碍事，没有:term[最大元]{id="math.logic-sets.greatest-element"}时也可以有极大元。「有极大元」写成量词是$\exists m\in S,\ \forall x\in S,\quad(m\preceq x\Rightarrow x=m)$，和「有最大元」只差里面的条件。边界情况：可以有好几个，$2$到$10$里就有五个，其中$7$既极大又极小。它和函数的极大值无关，那里只和附近的点比。

::anchor{id="thm-greatest-maximal"}
**定理**　设$S$是偏序集的子集。(1) 若$S$有最大元$g$，则$g$是$S$的唯一的极大元。(2) 若$S$是:term[链]{id="math.logic-sets.chain"}（chain），则$S$的极大元就是最大元。

**证明**：(1) 设$x\in S$，$g\preceq x$；又有$x\preceq g$，由:term[反对称性]{id="math.logic-sets.antisymmetric"}$x=g$，所以$g$极大。若$m$也极大，由$m\preceq g$得$g=m$。(2) 设$m$极大，任取$x\in S$，$m$与$x$可比：或者$x\preceq m$，或者$m\preceq x$而$x=m$，总有$x\preceq m$。

由 (1)，有两个极大元就没有最大元；由 (2)，在:term[全序集]{id="math.logic-sets.total-order"}（totally ordered set）里两者是一回事，实数按$\le$就是这样。

::anchor{id="thm-finite-maximal"}
**定理**　非空的有限偏序集一定有极大元，也一定有极小元。

**证明**：对元素个数归纳，只证极大元。只有一个元素时，它就极大。设有$n$个元素的都有极大元，$P$有$n+1$个元素：去掉一个元素$a$，由:term[归纳假设]{id="math.logic-sets.induction-hypothesis"}（induction hypothesis），剩下的有极大元$m$。

若$m\prec a$，则$a$极大：设$a\preceq x$而$x\ne a$，则$x$在剩下的里，由:term[传递性]{id="math.logic-sets.transitive"}（transitivity）$m\preceq x$，于是$x=m$，$a\preceq m$，连同$m\preceq a$，由反对称性$a=m$，矛盾。若$m\prec a$不成立，则$m$极大：$m\preceq x$时$x$不会是$a$，只能在剩下的里，所以$x=m$。

有限时，唯一的极大元就是最大元，证明见第 5 题。无限的不一定有极大元，如${(\N,\le)}$；:term[佐恩引理]{id="math.logic-sets.zorn-lemma"}（Zorn's lemma）给出一个保证有的条件，见[选择公理与佐恩引理](lesson:math.logic-sets.axiom-of-choice)。

### 上界与上确界

按整除，$4$和$6$的公倍数有$12,24,36,\dots$，它们都压得住$4$和$6$，其中$12$整除别的每一个。

::anchor{id="def-upper-bound"}
设$S$是:term[偏序集]{id="math.logic-sets.poset"}$P$的:term[子集]{id="math.logic-sets.subset"}。若$u\in P$，每个$x\in S$都有$x\preceq u$，就说$u$是$S$的:term[上界]{id="math.logic-sets.upper-bound"}（upper bound）；若$l\in P$，每个$x\in S$都有$l\preceq x$，就说$l$是$S$的:term[下界]{id="math.logic-sets.lower-bound"}（lower bound）。

为什么这样定义：没有:term[最大元]{id="math.logic-sets.greatest-element"}的集合，也可能从外面压得住，所以不要求$u\in S$。边界情况：上界可以有很多个，也可以没有，如${(\N,\le)}$里的全体偶数。

::anchor{id="def-supremum"}
设$S$是偏序集$P$的子集。$S$在$P$里的全部上界若有:term[最小元]{id="math.logic-sets.least-element"}，它就叫作$S$的上确界（supremum），记作$\sup S$；$S$在$P$里的全部下界若有最大元，它就叫作$S$的下确界（infimum），记作$\inf S$。

为什么这样定义：上确界是最紧的上界，由最小元的唯一性，至多有一个。边界情况：有上界也不一定有上确界，几何图像的右图里，$\{a,b\}$的上界是$c$和$d$，它们不:term[可比]{id="math.logic-sets.comparable"}，上界里没有最小的。

${(\Pow(X),\subseteq)}$里$\sup\{A,B\}=A\cup B$：它包含$A$、$B$，而包含$A$、$B$的集合都包含它；同样$\inf\{A,B\}=A\cap B$。${(\N^+,\mid)}$里，上界、下界就是公倍数、公因数；小学学过，公倍数都是最小公倍数（least common multiple）的倍数，公因数都是最大公因数（greatest common divisor）的因数，所以$\sup\{a,b\}=\operatorname{lcm}(a,b)$，$\inf\{a,b\}=\gcd(a,b)$。

::anchor{id="thm-max-sup"}
**定理**　设$S$是偏序集的子集。若$S$有最大元，则$\sup S=\max S$。

**证明**：$\max S$是$S$的上界；它属于$S$，所以每个上界$u$都满足$\max S\preceq u$。

有上确界不一定有最大元：${(\R,\le)}$里，$[0,1)$的上确界是$1$，却没有最大元。${(\R,\le)}$里的这几个概念，就是[实数的完备性](lesson:math.analysis.completeness)里的:term[上界]{id="math.analysis.upper-bound"}、:term[上确界]{id="math.analysis.supremum"}、:term[最大元]{id="math.analysis.maximum"}（maximum），那里上界、下界写作$M$、$m$；${(\Q,\le)}$里的$\{x\in\Q:x^2<2\}$有上界而没有上确界，也见那一节。

## 几何图像

![三幅哈斯图并排，每个元素写在一个圈里。左图标着有最大元：2 和 3 在最下面，2 往上连 4 和 6，3 往上连 6，4 和 6 都往上连最上面的 12，12 的圈用强调色，下面写着 12 是最大元，也是唯一的极大元。中图标着有极大元、没有最大元：最下面是 2、3、5、7，3 往上连 9 和 6，2 往上连 6、4 和 10，5 往上连 10，4 往上连 8，7 单独一点，6、7、8、9、10 的圈用强调色，下面写着 6 到 10 都是极大元，7 同时也是极小元。右图标着有上界、没有上确界：a、b 在下面，c、d 在上面，a 和 b 都往上连 c 和 d，c、d 的圈用强调色，下面写着 a、b 的上界是 c 和 d，两者不可比，没有最小的](maximal.svg)

在这三幅:term[哈斯图]{id="math.logic-sets.hasse-diagram"}（Hasse diagram）里，比大小都要沿着线往上看，光看谁画得高不行。一个元素要是还有比它大的，从它沿着线往上就走得到（见[偏序与全序](lesson:math.logic-sets.partial-orders)第 6 题），所以往上没有线的就是:term[极大元]{id="math.logic-sets.maximal-element"}，同样，往下没有线的就是:term[极小元]{id="math.logic-sets.minimal-element"}。

左图是$2,3,4,6,12$按整除：从别的数往上都走得到$12$，它是:term[最大元]{id="math.logic-sets.greatest-element"}；$2$、$3$都极小，没有:term[最小元]{id="math.logic-sets.least-element"}。中图是$2$到$10$按整除：强调色的五个数往上都没有线，是极大元，没有最大元；$7$和谁都不连，既极大又极小。

右图的:term[偏序集]{id="math.logic-sets.poset"}由$a$、$b$、$c$、$d$组成，$a$、$b$都比$c$、$d$小，此外不同的元素都不:term[可比]{id="math.logic-sets.comparable"}。$\{a,b\}$的:term[上界]{id="math.logic-sets.upper-bound"}是强调色的$c$和$d$，谁也不比谁小，所以$\{a,b\}$没有上确界；倒过来看，$\{c,d\}$的:term[下界]{id="math.logic-sets.lower-bound"}是$a$和$b$，也没有下确界。

## 例题

### 例 1　一个偏序集里的六样东西

$S=\{2,3,4,6,8,9,12,18\}$按整除。求$S$的:term[极大元]{id="math.logic-sets.maximal-element"}、:term[极小元]{id="math.logic-sets.minimal-element"}、:term[最大元]{id="math.logic-sets.greatest-element"}、:term[最小元]{id="math.logic-sets.least-element"}，以及$S$在${(\N^+,\mid)}$里的上确界、下确界。

**为什么想到这么做**：极大元逐个问「$S$里有没有它的别的倍数」；有两个极大元，就没有最大元。上确界、下确界到整个$\N^+$里找。

**推导**：$8$、$12$、$18$在$S$里没有别的倍数，其余的都有：$2\mid4$，$3\mid6$，$4\mid8$，$6\mid12$，$9\mid18$。所以极大元是$8$、$12$、$18$，没有最大元；除$2$、$3$外，各数都是$2$或$3$的倍数，$2$、$3$在$S$里没有别的因数，所以极小元是$2$、$3$，没有最小元。:term[上界]{id="math.logic-sets.upper-bound"}是公倍数，都是最小公倍数$72$的倍数；公因数只有$1$。所以$\sup S=72$，$\inf S=1$。

### 例 2　至多三个元素的子集

$P$由$\{1,2,3,4,5\}$的至多有三个元素的:term[子集]{id="math.logic-sets.subset"}组成，按$\subseteq$排。$P$的:term[极大元]{id="math.logic-sets.maximal-element"}是哪些？$P$的子集$\{\{1\},\{2\}\}$、$\{\{1,2\},\{3,4\}\}$有没有上确界？

**为什么想到这么做**：在整个:term[幂集]{id="math.logic-sets.power-set"}（power set）里上确界是:term[并集]{id="math.logic-sets.union"}（union），现在并集可能不在$P$里，要回到定义，看:term[上界]{id="math.logic-sets.upper-bound"}有哪些。

**推导**：有三个元素的，再添就不在$P$里，都极大；不到三个的还能添，不极大。$\{1\}$、$\{2\}$的上界是$P$中包含$\{1,2\}$的集合，最小的$\{1,2\}$就是上确界。同时包含$\{1,2\}$、$\{3,4\}$的集合至少有四个元素，$P$里没有，它们没有上界，也就没有上确界。

## 常见误区

- 「:term[极大元]{id="math.logic-sets.maximal-element"}就是:term[最大元]{id="math.logic-sets.greatest-element"}。」不对：$\{2,3\}$按整除，$2$、$3$都极大，谁也不是最大元。在:term[链]{id="math.logic-sets.chain"}里两者是一回事，别处要分清。
- 「$2$到$10$里最小的数是$2$，所以按整除，:term[最小元]{id="math.logic-sets.least-element"}也是$2$。」不对：$2$不整除$3$，按整除它只是:term[极小元]{id="math.logic-sets.minimal-element"}之一。说最大、最小，先要说清按哪个序。
- 「上确界一定属于这个集合。」不对：${(\Pow(X),\subseteq)}$里$\{A,B\}$的上确界是$A\cup B$；$A=\{1\}$、$B=\{2\}$时它是$\{1,2\}$，既不是$A$，也不是$B$。
- 「有:term[上界]{id="math.logic-sets.upper-bound"}就有上确界。」不对：几何图像的右图里，$\{a,b\}$有两个上界，哪一个也不比另一个小。$\R$里有上界的非空集合都有上确界，靠的是数学分析的:term[确界原理]{id="math.analysis.supremum-principle"}（least-upper-bound property）。
- 「上确界只由这个集合决定。」不对：还要看在哪个:term[偏序集]{id="math.logic-sets.poset"}里取。例 2 的$P$里，$\{\{1,2\},\{3,4\}\}$没有上确界；在${(\Pow(\{1,2,3,4,5\}),\subseteq)}$里，它的上确界是$\{1,2,3,4\}$。

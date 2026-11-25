---
id: math.logic-sets.cantor-bernstein
title: |
  康托尔-伯恩斯坦定理
goal: |
  会用单射比较两个集合的大小，并用康托尔-伯恩斯坦定理证明两个集合等势。
prerequisites: [math.logic-sets.countable-sets, math.logic-sets.image-preimage]
minutes: 24
summary: |
  从$A$到$B$、从$B$到$A$都有单射时，$A$与$B$等势。
status: reviewed
---

## 这一节要回答的问题

两个集合不:term[等势]{id="math.logic-sets.equinumerous"}（equinumerous）时，怎样说谁多谁少？$(0,1)$是$[0,1]$的一部分；反过来，把$[0,1]$缩小、挪进中间，又放得进$(0,1)$。两边都装得下对方，它们等势吗？直接写一个:term[双射]{id="math.logic-sets.bijective"}（bijective）并不容易：多出来的$0$和$1$往哪里放？

## 讲解

### 用单射比大小

一人坐一把椅子，没人站着，也许有空椅子，人就不比椅子多。$n\mapsto(n,0)$也这样给$\N$的每个元素在$\N\times\N$里各找了一处。

::anchor{id="def-cardinal-order"}
设$A$、$B$是集合。有从$A$到$B$的:term[单射]{id="math.logic-sets.injective"}（injective）时，说$A$不比$B$多，记作$|A|\le|B|$；$|A|\le|B|$，而$A$与$B$不:term[等势]{id="math.logic-sets.equinumerous"}时，说$A$比$B$少，记作$|A|<|B|$。

为什么这样定义：单射让$A$的每个元素在$B$里各占一处；对:term[有限集]{id="math.logic-sets.finite-set"}（finite set），由[等势与可数集](lesson:math.logic-sets.countable-sets#thm-finite-counting)关于元素个数的事实 (1)，就是$A$的元素个数不超过$B$的。$\le$、$<$只是记号，像不像数的大小，要逐条证。

边界情况：$A\subseteq B$时，:term[包含映射]{id="math.logic-sets.inclusion-map"}（inclusion map）是单射，所以$|A|\le|B|$；可:term[真子集]{id="math.logic-sets.proper-subset"}（proper subset）不一定更少，$\N^+$与$\N$等势。说$A$比$B$少，要证从$A$到$B$的:term[双射]{id="math.logic-sets.bijective"}一个也没有，只指出某个单射不是:term[满射]{id="math.logic-sets.surjective"}（surjective），一般还不够。

:term[恒等映射]{id="math.logic-sets.identity-map"}（identity map）$\mathrm{id}_A$是单射，所以$|A|\le|A|$；单射的:term[复合]{id="math.logic-sets.composite-map"}（composition）还是单射（见[复合映射与逆映射](lesson:math.logic-sets.composition-inverse#thm-composition-injective)），所以由$|A|\le|B|$、$|B|\le|E|$得$|A|\le|E|$。$A$与$B$等势时，双射和它的:term[逆映射]{id="math.logic-sets.inverse-map"}（inverse map）都是单射，$|A|\le|B|$、$|B|\le|A|$都成立；反过来，互相不比对方多，是不是就等势？

### 康托尔-伯恩斯坦定理

:term[有限集]{id="math.logic-sets.finite-set"}互相不比对方多，元素个数就相等。:term[无限集]{id="math.logic-sets.infinite-set"}（infinite set）没有个数可比，两个:term[单射]{id="math.logic-sets.injective"}又可能都不是:term[满射]{id="math.logic-sets.surjective"}：$A=B=\N$，$f$、$g$都取$n\mapsto n+1$时，哪一个也不能直接当:term[双射]{id="math.logic-sets.bijective"}用。

::anchor{id="thm-cantor-bernstein"}
**康托尔-伯恩斯坦定理（Cantor-Bernstein theorem）**　若有从$A$到$B$的单射，又有从$B$到$A$的单射，则$A$与$B$:term[等势]{id="math.logic-sets.equinumerous"}，即$|A|\le|B|$并且$|B|\le|A|$时，$|A|=|B|$。它也叫施罗德-伯恩斯坦定理（Schröder-Bernstein theorem）。

怎样想到证法：设$f:A\to B$、$g:B\to A$是单射，想把$A$分成两部分，在$C$上用$f$，在$A\setminus C$上把$g$倒着走。$A\setminus g(B)$的元素不是$g$的值，倒不回去，只好归$C$；$x$归了$C$，就占了$f(x)$，$g(f(x))$要是倒着走，也会走到$f(x)$，所以$g(f(x))$也得归$C$。非归$C$不可的才归，别的都倒着走，所以取最小的$C$。

**证明**：看$A$的满足下面两条的:term[子集]{id="math.logic-sets.subset"}（subset）$X$：(i) $A\setminus g(B)\subseteq X$；(ii) $g(f(X))\subseteq X$。$A$本身就是一个，所以这样的$X$组成的集合$\mathcal S$不空；照[集族的并与交](lesson:math.logic-sets.indexed-families#def-family-union-intersection)拿它自己当:term[指标集]{id="math.logic-sets.index-set"}（index set），取:term[集族的交]{id="math.logic-sets.family-intersection"}（intersection of a family）$C=\bigcap_{X\in\mathcal S}X$。

每个$X\in\mathcal S$都包含$A\setminus g(B)$，$C$也包含。$C\subseteq X$，子集的像（image）[保持包含](lesson:math.logic-sets.image-preimage#thm-image-operations)，所以$g(f(C))\subseteq g(f(X))\subseteq X$对每个$X\in\mathcal S$成立，$g(f(C))\subseteq C$。于是$C\in\mathcal S$，是其中最小的。

令$D=(A\setminus g(B))\cup g(f(C))$。由 (i)、(ii)，$D\subseteq C$，所以$g(f(D))\subseteq g(f(C))\subseteq D$；$D$又包含$A\setminus g(B)$，所以$D\in\mathcal S$，$C\subseteq D$。于是$C=(A\setminus g(B))\cup g(f(C))$。

由 (i)，$A\setminus C\subseteq g(B)$；$g$是单射，每个$x\in A\setminus C$恰是$B$中一个元素的像，把这个元素记作$g^{-1}(x)$（不是说$g$有:term[逆映射]{id="math.logic-sets.inverse-map"}）。规定$h:A\to B$：$x\in C$时$h(x)=f(x)$，$x\in A\setminus C$时$h(x)=g^{-1}(x)$，即$g(h(x))=x$。

$h$是单射：设$h(x)=h(x')$。$x$、$x'$都在$C$里时，由$f$是单射，$x=x'$；都不在$C$里时，由$x=g(h(x))$、$x'=g(h(x'))$得$x=x'$。若$x\in C$而$x'\notin C$（对调也一样），则$x'=g(h(x'))=g(h(x))$，$g(h(x))=g(f(x))\in C$，矛盾。

$h$是满射：任取$y\in B$。$g(y)\notin C$时，$h(g(y))=y$。$g(y)\in C$时，$g(y)$不属于$A\setminus g(B)$，只能属于$g(f(C))$，即有$x\in C$使$g(y)=g(f(x))$；$g$是单射，所以$y=f(x)=h(x)$。

$f$是单射，保证$h$在$C$上不把两个元素送到一处；$g$是单射，保证$g^{-1}(x)$只有一个，也保证最后一步有$y=f(x)$。$h$不冲突、不遗漏，靠等式$C=(A\setminus g(B))\cup g(f(C))$；别的子集行不行，见第 6 题。

$C$由哪些元素组成：从$A\setminus g(B)$的元素出发，反复做$g\circ f$（可以一次不做）走得到的。它们的全体满足 (i)、(ii)，所以包含$C$；$C$也满足 (i)、(ii)，所以它们都在$C$里。一层一层写成$C_0=A\setminus g(B)$、$C_{n+1}=g(f(C_n))$，要用:term[递归定义]{id="math.logic-sets.recursive-definition"}（recursive definition，见[皮亚诺公理与递归定义](lesson:math.logic-sets.peano-axioms#def-recursive-definition)）；取交就用不着它。

拿开头的问题看：$A=[0,1]$，$B=(0,1)$，$f(x)=\frac{x+1}3$，$g(y)=y$。$A\setminus g(B)=\{0,1\}$，从$0$、$1$出发反复做$x\mapsto\frac{x+1}3$，得到$C=\{0,1,\frac13,\frac23,\frac49,\frac59,\dots\}$。$h$把$0$送到$\frac13$，$\frac13$送到$\frac49$，$1$送到$\frac23$，$\frac23$送到$\frac59$，一个接一个往中间挪，别的数都不动：$0$和$1$就这样放下了。

### 怎样用

证两个集合:term[等势]{id="math.logic-sets.equinumerous"}，不必写出:term[双射]{id="math.logic-sets.bijective"}，两个方向各找一个:term[单射]{id="math.logic-sets.injective"}就够了。夹在中间的也这样证：设$A\subseteq B\subseteq E$，$A$与$E$等势，则$|A|\le|B|$，$|B|\le|E|\le|A|$，所以$B$与它们都等势。

在由集合组成的集合上，「不比……多」:term[自反]{id="math.logic-sets.reflexive"}（reflexive）、:term[传递]{id="math.logic-sets.transitive"}（transitive），定理又补上了:term[反对称性]{id="math.logic-sets.antisymmetric"}（antisymmetry，见[偏序与全序](lesson:math.logic-sets.partial-orders#def-antisymmetric)），只是「相等」换成了「等势」。任意两个集合总有一个不比另一个多，可一般要用:term[选择公理]{id="math.logic-sets.axiom-of-choice"}（axiom of choice）来证。

$x\mapsto\{x\}$是从$A$到它的:term[幂集]{id="math.logic-sets.power-set"}（power set）$\Pow(A)$的单射，所以$|A|\le|\Pow(A)|$；其实$|A|<|\Pow(A)|$，这是:term[康托尔定理]{id="math.logic-sets.cantor-theorem"}（Cantor's theorem），见[不可数集与对角线论证](lesson:math.logic-sets.uncountable-sets)。

## 几何图像

![左右两列点，左边是集合 A，右边是集合 B；f 的箭头是实线，从左指向右，g 的箭头是虚线，从右指向左。上面一串从左边的 a₀ 起，旁边写着不是 g 的值：a₀ 指向 b₀，b₀ 指向 a₁，a₁ 指向 b₁，b₁ 指向 a₂，a₂ 指向 b₂，后面还有；左边这些点用强调色，框在一起，标着 C，从它们发出的横的实线箭头是粗的。下面一串从右边的 y₀ 起，旁边写着不是 f 的值：y₀ 指向 x₀，x₀ 指向 y₁，y₁ 指向 x₁，x₁ 指向 y₂，y₂ 指向 x₂，后面还有；左边这些点写着不在 C 里，横的虚线箭头是粗的](zigzag.svg)

实线箭头是$f$，向右；虚线箭头是$g$，向左。上面一串从$a_0$起，没有虚线箭头指着它，$a_0\in A\setminus g(B)$，所以顺着箭头走到的$a_1=g(f(a_0))$、$a_2=g(f(a_1))$、……都归$C$。下面一串从$B$中的$y_0$起，没有实线箭头指着它；$x_0$、$x_1$、……从$A\setminus g(B)$出发都走不到，不在$C$里。

粗的箭头是$h$配成的对：在$C$上用$f$，$a_n$配$b_n$；在$C$外把$g$倒着走，$x_n$配$y_n$，两边都配完了。图上只画了这两种样子的串；两头都没有尽头的见第 6 题（3），还有绕成一圈的，如讲解例子里的$\frac12$：$f$、$g$都把它送到自己。

![横轴是 x，纵轴是 h(x)，都标着 0、1/3、4/9、5/9、2/3、1。从 (0, 0) 到 (1, 1) 的线段 y = x 上，x 等于 0、1/3、4/9、13/27、14/27、5/9、2/3、1 的地方是空心圈。虚线 y = (x + 1)/3 从 (0, 1/3) 到 (1, 2/3)，上面有六个强调色的圆点。强调色的折线从 (0, 0) 处的空心圈竖直向上到圆点 (0, 1/3)，水平向右到空心圈 (1/3, 1/3)，再向上到圆点 (1/3, 4/9)，再向右到空心圈 (4/9, 4/9)，一级一级走向中间；另一条从 (1, 1) 处的空心圈同样一级一级走下来。图例写着线段是 C 外的数，空心圈是挖掉的点，圆点是挪到的点](staircase.svg)

这一幅画的是讲解里从$[0,1]$到$(0,1)$的$h$，每个$x$处画一个点，高度是$h(x)$。$C$外的数不动，点在线段$y=x$上；$C$的数在$y=x$上的点挖掉了（空心圈），挪到虚线$y=\frac{x+1}3$上（强调色的圆点），越往中间越密，再往后的没有画。沿折线走：$0$处的点挪到高度$\frac13$，那里原来的$\bigl(\frac13,\frac13\bigr)$正好挖掉了；$\frac13$处的点又挪到高度$\frac49$，填上$\bigl(\frac49,\frac49\bigr)$的空，一级接一级。所以高度在$0$与$1$之间的每条水平线，都恰好碰到一个点，$h$是:term[双射]{id="math.logic-sets.bijective"}。

## 例题

### 例 1　$[0,1]$、$(0,1)$、$\R$两两等势

证明$[0,1]$、$(0,1)$、$\R$两两:term[等势]{id="math.logic-sets.equinumerous"}。

**为什么想到这么做**：$(0,1)\subseteq[0,1]\subseteq\R$，从小的到大的用:term[包含映射]{id="math.logic-sets.inclusion-map"}；只差从$\R$放回$(0,1)$的:term[单射]{id="math.logic-sets.injective"}，找一个严格递增（strictly increasing）、值都在$(0,1)$里的函数。

**推导**：令$p(x)=\frac12+\frac{x}{2(1+|x|)}$。因为$|x|<1+|x|$，所以$-1<\frac x{1+|x|}<1$，$0<p(x)<1$。$x\ge0$时$\frac x{1+|x|}=1-\frac1{1+x}$，$x<0$时$\frac x{1+|x|}=\frac1{1-x}-1$，两段都严格递增，前一段不小于$0$，后一段小于$0$；所以$p$严格递增，由[单射、满射与双射](lesson:math.logic-sets.injective-surjective#thm-monotone-injective)，$p:\R\to(0,1)$是单射。

于是$(0,1)$不比$[0,1]$多，$[0,1]$不比$\R$多，$\R$又不比$(0,1)$多。首尾相接，任意两个都互相不比对方多；由定理，它们两两等势。

### 例 2　$\N\times\N$与$\N$

用康托尔-伯恩斯坦定理证明$\N\times\N$与$\N$:term[等势]{id="math.logic-sets.equinumerous"}。

**为什么想到这么做**：[等势与可数集](lesson:math.logic-sets.countable-sets#thm-pairs-countable)写出了:term[双射]{id="math.logic-sets.bijective"}，每个自然数都要照顾到；现在只要两个方向各一个:term[单射]{id="math.logic-sets.injective"}，取不取得遍不要紧。

**推导**：$n\mapsto(n,0)$是$\N\to\N\times\N$的单射。$(m,n)\mapsto2^m3^n$是$\N\times\N\to\N$的单射：设$2^m3^n=2^k3^l$，若$m<k$，两边约去$2^m$，左边$3^n$是奇数，右边是偶数，矛盾，$m>k$同理，所以$m=k$；再由$3^n=3^l$得$n=l$。它取不到$5$，不是:term[满射]{id="math.logic-sets.surjective"}，定理照样能用：$\N\times\N$与$\N$等势。

## 常见误区

- 「由$|A|\le|B|$、$|B|\le|A|$得$A=B$。」不对：得到的是$|A|=|B|$，说的是$A$与$B$:term[等势]{id="math.logic-sets.equinumerous"}。$\N$与$\N\times\N$就互相不比对方多，却是两个集合。
- 「定理说$f$、$g$本身就是:term[双射]{id="math.logic-sets.bijective"}。」不对：$f$、$g$可以都不是:term[满射]{id="math.logic-sets.surjective"}，例 2 的两个就都不是；双射$h$是用它们拼出来的。
- 「只让$A\setminus g(B)$的元素用$f$，别的都把$g$倒着走，就拼成了双射。」不对：讲解里$[0,1]$的例子，只让$0$、$1$用$f$，$0$被送到$\frac13$，没动的$\frac13$也还在$\frac13$，撞到了一处。$\frac13$也得归$C$，它占的$\frac49$又得归$C$，一路归下去。
- 「把$g$倒着走，要给每个$x$挑一个$g^{-1}(x)$，用到了:term[选择公理]{id="math.logic-sets.axiom-of-choice"}。」不对：$g$是:term[单射]{id="math.logic-sets.injective"}，$g^{-1}(x)$只有一个，没有可挑的；整个证明都没有用到选择公理。

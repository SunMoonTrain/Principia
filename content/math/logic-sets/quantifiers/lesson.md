---
id: math.logic-sets.quantifiers
title: |
  全称量词与存在量词
goal: |
  会读写带「任意」「存在」的命题，判断它们的真假，并写出它们的否定。
prerequisites: [math.logic-sets.propositions]
minutes: 29
summary: |
  全称要每个都成立，存在有一个就行；否定时量词互换、$P(x)$取反。
status: reviewed
---

## 这一节要回答的问题

「$x^2\ge0$」本身说不上对错，$x$还没有取定；加上「对所有实数$x$」，它就成了一个真命题。换成「存在实数$x$，使$x^2\ge0$」，也是真命题，说的事却少得多。数学书里「任给」「对每个」「存在」「至少有一个」到处都是：它们各说的是什么，怎样判断这样的话对不对，又怎样写出它们的:term[否定]{id="math.logic-sets.negation"}（negation）？

## 讲解

### 含有变量的语句

像「$x>1$」这样含有变量$x$的语句不是命题（见[命题与逻辑联结词](lesson:math.logic-sets.propositions)），常记作$P(x)$；给$x$取定一个值就得到命题，如$P(x)$为「$x>1$」时，$P(3)$即「$3>1$」，为真。另一种办法是说$P(x)$对多少个$x$成立：所有的，还是至少一个。$x$的取值范围要先说好：本节用$\R$、$\Z$、$\N$、$\N^+$分别表示全体实数、整数、自然数（含$0$）、正整数（课本写$\N^*$或$\N_+$），$x\in A$表示$x$属于$A$，集合的严格讲法见[集合与子集](lesson:math.logic-sets.sets)。

### 全称量词与存在量词

「对所有实数$x$，$x^2\ge0$」是说任何一个实数代进去都得到真命题；「存在实数$x$，使$x^2=2$」是说至少有一个实数代进去得到真命题，$x=\sqrt2$就是。

::anchor{id="def-universal"}
「对所有」「对每个」「任意」「任给」这类表示「每一个都」的词，叫作:term[全称量词]{id="math.logic-sets.universal-quantifier"}（universal quantifier），记作$\forall$。设$A$是$x$的取值范围，「对$A$中所有的$x$，$P(x)$成立」叫作:term[全称量词命题]{id="math.logic-sets.universal-statement"}（universal statement），记作$\forall x\in A,\ P(x)$：$A$中每个元素代进$P(x)$都得到真命题，它就为真；有一个元素代进去得到假命题，它就为假。

为什么这样定义：加上「对所有」，就把$A$中所有的情形合成了一句有真假的话，能拿来推理了。

全称量词常常藏在「都」「任何」「所有」「一定」「凡是」里，或者不写出来：「三角形的内角和是$180^\circ$」说的是每个三角形。「两个无理数的和一定是无理数」说过头了：$\sqrt2$和$-\sqrt2$都是无理数，和却是$0$。

::anchor{id="def-existential"}
「存在」「有一个」「至少有一个」「有些」这类词，叫作:term[存在量词]{id="math.logic-sets.existential-quantifier"}（existential quantifier），记作$\exists$。「$A$中存在$x$，使$P(x)$成立」叫作:term[存在量词命题]{id="math.logic-sets.existential-statement"}（existential statement），记作$\exists x\in A,\ P(x)$：$A$中至少有一个元素代进$P(x)$得到真命题，它就为真；每个元素代进去都得到假命题，它就为假。全称量词和存在量词统称量词（quantifier）。

为什么这样定义：很多问题只关心「有没有」，如方程有没有实数解，找到一个就够了。

边界情况：「至少有一个」不排除有很多，$\exists x\in\R,\ x^2=1$有两个这样的$x$，照样为真。数学里的「有些」也不暗含「不是全部」。

两类量词的说法很多：

| 量词 | 常见的说法 | 记号 |
| --- | --- | --- |
| 全称量词 | 对所有、对每个、对一切、任意、任给、任取、所有……都、凡是……都 | $\forall$ |
| 存在量词 | 存在、都存在、有一个、至少有一个、有些、有……使 | $\exists$ |

数学分析里常说「任给$\varepsilon>0$，都存在正整数$N$……」，「都」承接「任给」；两个量词连用的话怎样读、怎样否定，见[多重量词](lesson:math.logic-sets.nested-quantifiers)。

$\forall x\in A,\ P(x)$读作「对任意$x\in A$，$P(x)$」，$\exists x\in A,\ P(x)$读作「存在$x\in A$，使$P(x)$」，课本写成$\forall x\in M,\ p(x)$、$\exists x\in M,\ p(x)$。

说明全称量词命题为真，要对取值范围里的每一个元素说出道理，只举几个例子不够；说明它为假，举出一个反例（counterexample）就够了，如$x=0$使$x^2>0$不成立，所以$\forall x\in\R,\ x^2>0$为假。存在量词命题正好反过来：找到一个就能说明它为真，说明它为假要对每一个元素说出道理。

取值范围是:term[空集]{id="math.logic-sets.empty-set"}（empty set）$\varnothing$、一个元素也没有时，照定义全称量词命题为真，存在量词命题为假：没有元素代进去得到假命题，也没有元素得到真命题。例如大于$2$的偶素数一个也没有，「所有大于$2$的偶素数都是$7$的倍数」是真命题。换个规定会怎样，见第 7 题。

### 量词命题的否定

「每个正整数都是偶数」是假命题，它的:term[否定]{id="math.logic-sets.negation"}应当为真。「每个正整数都不是偶数」也假（$2$是偶数），不是它的否定；「有正整数不是偶数」才是。$\neg P(x)$表示「$P(x)$不成立」，$x$取定为$a$时就是$P(a)$的否定。

::anchor{id="def-quantified-equivalence"}
两个带量词的命题，不管取值范围$A$是什么、其中的$P(x)$等是哪些含有变量的语句，都同真同假时，也说它们:term[逻辑等价]{id="math.logic-sets.logical-equivalence"}（logical equivalence），照样记作${\iff}$。

为什么这样定义：带量词的命题不是由几个字母用「非」「且」「或」连成的，列不出:term[真值表]{id="math.logic-sets.truth-table"}（truth table）；「对一切$A$和$P(x)$都同真同假」正好代替逐行相同。

边界情况：$A=\R$、$P(x)$取「$x^2\ge0$」时，$\forall x\in A,\ P(x)$和$\exists x\in A,\ P(x)$都真，可它们不逻辑等价：$P(x)$换成「$x^2>0$」，前者就假了。

::anchor{id="thm-quantifier-negation"}
**定理**　对任何取值范围$A$和含有变量$x$的语句$P(x)$，$\neg\bigl(\forall x\in A,\ P(x)\bigr)\iff\exists x\in A,\ \neg P(x)$，$\neg\bigl(\exists x\in A,\ P(x)\bigr)\iff\forall x\in A,\ \neg P(x)$。

**证明**：第一条的左边为真，就是「$A$中每个元素都使$P(x)$为真」不成立，即$A$中有元素$a$使$P(a)$为假、$\neg P(a)$为真，这正是右边为真。每一步都只是换个说法，倒过来也成立，所以两边总是同真同假。

第二条同样：左边为真，就是$A$中没有元素使$P(x)$为真，即每个元素都使$P(x)$为假、$\neg P(x)$为真，这正是右边为真。

为什么会是这样：$A$只有$a$、$b$两个元素时，$\forall x\in A,\ P(x)$就是$P(a)\land P(b)$，$\exists x\in A,\ P(x)$就是$P(a)\lor P(b)$，定理正是:term[德摩根律]{id="math.logic-sets.de-morgan-laws"}（De Morgan's laws）；元素更多、甚至有无穷多个时，定理就是德摩根律的推广。

用中文说：「并非所有……都……」就是「有……不……」，「不存在……使……」就是「所有……都不……」。否定时:term[全称量词]{id="math.logic-sets.universal-quantifier"}和:term[存在量词]{id="math.logic-sets.existential-quantifier"}互换，取值范围不变，后面的语句换成它的否定：$\forall x\in\R,\ x^2>0$的否定是$\exists x\in\R,\ x^2\le0$，不是$\exists x\in\R,\ x^2<0$。

## 几何图像

![数轴上涂出使 x² < 2x + 3 成立的 −1 < x < 3，两端是空心圆；下面三条线段是取值范围 [0, 2]、[2, 4]、[3, 5]，右边两列写出每个范围上全称量词命题和存在量词命题的真假](quantifier-line.svg)

取$P(x)$为「$x^2<2x+3$」，它就是$(x+1)(x-3)<0$。数轴上涂色的部分是使它成立的$x$，即$-1<x<3$，两端不算，画成空心圆。下面三条线段是三个取值范围$A$，右边两列是这时:term[全称量词命题]{id="math.logic-sets.universal-statement"}$\forall x\in A,\ P(x)$和:term[存在量词命题]{id="math.logic-sets.existential-statement"}$\exists x\in A,\ P(x)$的真假。

$[0,2]$整个落在涂色部分里，每个元素都使$P(x)$成立，两个命题都真。$[2,4]$有一段伸出涂色部分，$x=4$代进去得到$16<11$，是假的，全称量词命题为假；可它和涂色部分有公共的点，如$x=2$，存在量词命题为真。$[3,5]$和涂色部分一个公共点也没有，左端$x=3$代进去是$9<9$，也不成立，所以两个命题都假。

一般地，全称量词命题为真，是说整个取值范围都落在涂色部分里；存在量词命题为真，是说取值范围和涂色部分至少有一个公共点。

## 例题

### 例 1　写出否定，再判断真假

写出命题「$\forall x\in\R,\ x^2-2x+2>0$」的:term[否定]{id="math.logic-sets.negation"}，并判断两者哪一个为真。

**为什么想到这么做**：否定照定理写；原命题和它的否定一真一假，判断其中一个就行，这里配方能看出原命题对。

**推导**：由定理，否定是$\exists x\in\R,\ x^2-2x+2\le0$。对每个实数$x$，$x^2-2x+2=(x-1)^2+1\ge1>0$，所以原命题为真，它的否定为假。

### 例 2　说明「不存在」

判断命题「存在整数$n$，使$n^2+n$是奇数」的真假，并写出它的:term[否定]{id="math.logic-sets.negation"}。

**为什么想到这么做**：$n=0,1,2,-1$时，$n^2+n$分别是$0,2,6,0$，都是偶数，看来找不到。要说明这个:term[存在量词命题]{id="math.logic-sets.existential-statement"}为假，就证明它的否定为真。

**推导**：由定理，原命题的否定是「对每个整数$n$，$n^2+n$不是奇数」，也就是「$n^2+n$都是偶数」，因为整数不是奇数就是偶数。$n^2+n=n(n+1)$是两个相邻整数的积，其中总有一个是偶数，所以积是偶数。否定为真，原命题为假。

## 常见误区

- 「『所有$x$都满足$P(x)$』的:term[否定]{id="math.logic-sets.negation"}是『所有$x$都不满足$P(x)$』。」不对：应是「有$x$不满足$P(x)$」。「每个素数都是奇数」和「每个素数都不是奇数」都是假命题（$2$、$3$分别推翻它们），可一个命题和它的否定总是一真一假。
- 「验证了很多个元素都满足$P(x)$，:term[全称量词命题]{id="math.logic-sets.universal-statement"}就是真的。」不对：取值范围里只要有一个元素不满足，它就是假的。$n^2+n+41$在$n=0,1,\dots,39$时都是素数，$n=40$时却等于$41^2$，所以「对所有$n\in\N$，$n^2+n+41$是素数」是假命题。例子再多，没对取值范围里的每一个元素说出道理，就说明不了「所有」。
- 「取值范围是:term[空集]{id="math.logic-sets.empty-set"}时，全称量词命题没有意义。」不对：它是真命题，因为找不到使它不成立的元素；这时:term[存在量词命题]{id="math.logic-sets.existential-statement"}是假命题。

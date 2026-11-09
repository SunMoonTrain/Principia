---
id: math.analysis.nested-intervals
title: |
  闭区间套定理
goal: |
  会用单调有界原理证明闭区间套定理，并用一串缩小的区间「夹住」要找的实数。
prerequisites: [math.analysis.bounded-monotone]
minutes: 25
summary: |
  一串套起来、长度趋于零的闭区间，恰好有一个公共点。
status: reviewed
---

## 这一节要回答的问题

用二分法找$\sqrt2$：$[1,2]$的中点$1.5$的平方大于$2$，留下$[1,1.5]$；$1.25$的平方小于$2$，留下$[1.25,1.5]$……区间一半一半地缩小，好像「夹住」了一个数。凭什么相信最后真的夹住了一个数，而不是像有理数轴那样夹住一个洞？夹住的数又为什么只有一个？

## 讲解

### 闭区间套

::anchor{id="def-nested-intervals"}
如果闭区间$[a_n,b_n]$（$n=1,2,3,\dots$）一个套一个，即$[a_{n+1},b_{n+1}]\subseteq[a_n,b_n]$，并且区间的长度$b_n-a_n\to0$，就说这串区间构成一个:term[闭区间套]{id="math.analysis.nested-intervals"}（nested intervals）。

「一个套一个」写成端点就是

$$
a_1\le a_2\le\dots\le a_n\le\dots\le b_n\le\dots\le b_2\le b_1 ,
$$

左端点越来越大，右端点越来越小。

为什么这样定义：三个条件各管一件事，缺一个都不行。$(0,\frac1n)$一个套一个、长度趋于$0$，可它们不是闭区间，没有公共点：$0$不在任何一个里，而任何$x>0$在$\frac1n<x$以后就不在了。$[n,n+\frac1n]$是闭区间、长度趋于$0$，可它们不一个套一个，也没有公共点：任何$x$在$n>x$以后就不在了。$[0,1+\frac1n]$是一个套一个的闭区间，可长度趋于$1$而不是$0$，公共点有整整一段$[0,1]$。

长度趋于$0$保证「至多一个」；一个套一个的闭区间，加上:term[实数的完备性]{id="math.analysis.real-completeness"}（completeness of the real numbers），保证「至少一个」。

### 闭区间套定理

::anchor{id="thm-nested-intervals"}
**定理**　若$\{[a_n,b_n]\}$是:term[闭区间套]{id="math.analysis.nested-intervals"}，则恰有一个实数$\xi$属于每一个区间$[a_n,b_n]$，并且$a_n\to\xi$，$b_n\to\xi$。这叫作:term[闭区间套定理]{id="math.analysis.nested-interval-theorem"}（nested interval theorem）。

**证明**：由$a_n\le a_{n+1}\le b_{n+1}\le b_n\le b_1$，$\{a_n\}$单调递增、以$b_1$为:term[上界]{id="math.analysis.upper-bound"}（upper bound）；同理$\{b_n\}$单调递减、以$a_1$为下界（lower bound）。由:term[单调有界原理]{id="math.analysis.monotone-convergence-theorem"}（monotone convergence theorem），两个数列都:term[收敛]{id="math.analysis.convergent-sequence"}（convergent sequence）：$a_n\to\xi=\sup\{a_n\}$，$b_n\to\eta=\inf\{b_n\}$。由差的法则，$\eta-\xi=\lim_{n\to\infty}(b_n-a_n)=0$，所以$\xi=\eta$。

于是对每个$n$，$a_n\le\sup\{a_n\}=\xi=\inf\{b_n\}\le b_n$，即$\xi\in[a_n,b_n]$。再证唯一：若$\zeta$也属于每个区间，则$a_n\le\zeta\le b_n$，两边都趋于$\xi$，由:term[夹逼定理]{id="math.analysis.squeeze-theorem"}（squeeze theorem），常数数列$\zeta$趋于$\xi$，所以$\zeta=\xi$。

为什么想到单调有界原理：左端点一路往右走，又被$b_1$挡住；右端点一路往左走，又被$a_1$挡住，正是单调有界原理管的情形。两个:term[极限]{id="math.analysis.sequence-limit"}（limit of a sequence，lim）各自存在，长度趋于$0$再让它们重合。:term[完备性]{id="math.analysis.real-completeness"}用在单调有界原理里：在$\Q$里，用有理数端点二分出来的区间套照样能逼近$\sqrt2$，却没有一个有理数属于所有区间。

### 怎样用它找数

:term[闭区间套定理]{id="math.analysis.nested-interval-theorem"}最常见的用法是「夹住要找的数」：想证明某个具有性质$P$的数存在，就构造一串闭区间，每一个都「看上去」包含这样的数，并且一半一半地缩小。定理给出唯一的公共点$\xi$，再对端点取:term[极限]{id="math.analysis.sequence-limit"}，证明$\xi$真有性质$P$。二分法每一步把长度减半，第$n$个区间的长度是$\frac{b_1-a_1}{2^{n-1}}$，由[数列的极限](lesson:math.analysis.sequences-limits)的例 2，它趋于$0$。

二分法还附带一个误差估计：$\xi$在$[a_n,b_n]$里，所以用中点$\frac{a_n+b_n}{2}$代替$\xi$，误差不超过区间长度的一半。不知道$\xi$是多少，也知道近似值有多准。

## 几何图像

![二分法找 √2 的前 7 个闭区间，一个套一个，缩向 √2](bisection.svg)

每一行是一个区间，下一行是上一行的左半或右半，看中点的平方比$2$大还是小。左端点一路右移、右端点一路左移，长度每次减半，全部套住虚线所在的$\sqrt2$。这正是例 1 构造的:term[闭区间套]{id="math.analysis.nested-intervals"}。

## 例题

### 例 1　用闭区间套证明存在正实数$\xi$使$\xi^2=2$

**为什么想到这么做**：要找的数「平方恰好是$2$」，我们能检验的只是一个数的平方比$2$大还是小。于是用二分法，始终保持左端点的平方不超过$2$、右端点的平方大于$2$，让两个端点从两边夹住它；最后对端点取:term[极限]{id="math.analysis.sequence-limit"}，把两个不等式合成一个等式。

**推导**：令$[a_1,b_1]=[1,2]$，则$a_1^2\le2<b_1^2$。已有$[a_n,b_n]$时，取中点$m=\frac{a_n+b_n}{2}$：若$m^2\le2$，令$[a_{n+1},b_{n+1}]=[m,b_n]$，否则令$[a_{n+1},b_{n+1}]=[a_n,m]$。由归纳法，每个区间都满足$a_n^2\le2<b_n^2$，并且长度$b_n-a_n=\frac{1}{2^{n-1}}\to0$。

这是一个:term[闭区间套]{id="math.analysis.nested-intervals"}，由:term[闭区间套定理]{id="math.analysis.nested-interval-theorem"}，有$\xi$使$a_n\to\xi$、$b_n\to\xi$。由积的法则，$a_n^2\to\xi^2$，$b_n^2\to\xi^2$。由:term[保不等式性]{id="math.analysis.order-limit-theorem"}（order limit theorem），$a_n^2\le2$推出$\xi^2\le2$，$b_n^2>2$推出$\xi^2\ge2$，所以$\xi^2=2$。又$\xi\ge a_1=1>0$，所以$\xi$就是要找的正实数。

### 例 2　$[0,1]$里的数排不成一列

任给一个数列$\{x_n\}$，证明$[0,1]$里总有一个数不等于其中任何一项。

**为什么想到这么做**：要找的数$\xi$必须躲开$x_1$、$x_2$、$x_3$……每一项。那就一项一项地躲：第$n$步选一个不含$x_n$的小区间，以后所有的区间都在它里面，夹出来的$\xi$也就永远躲开了$x_n$。

**推导**：令$I_1=[0,1]$。已有闭区间$I_n$时，把它三等分成三个闭区间。相邻两个只共用一个端点，所以$x_n$至多属于其中两个；取一个不含$x_n$的作为$I_{n+1}$。

这样得到一个:term[闭区间套]{id="math.analysis.nested-intervals"}，第$n$个区间的长度是$\frac{1}{3^{n-1}}\to0$。由:term[闭区间套定理]{id="math.analysis.nested-interval-theorem"}，有$\xi$属于每一个$I_n$。对每个$n$，$\xi\in I_{n+1}$，而$x_n\notin I_{n+1}$，所以$\xi\ne x_n$。

这说明$[0,1]$里的实数不可能排成一列$x_1,x_2,x_3,\dots$而一个不漏。按集合论的说法，$[0,1]$是不可数集（uncountable set），见[不可数集与对角线论证](lesson:math.logic-sets.uncountable-sets)。

## 常见误区

- 「区间一个套一个，公共点就一定存在。」要是闭区间：$(0,\frac1n)$一个套一个，却没有公共点。在$\Q$里，闭区间也不行，要靠:term[实数的完备性]{id="math.analysis.real-completeness"}。
- 「公共点一定只有一个。」还要长度趋于$0$：$[0,1+\frac1n]$的公共部分是整个$[0,1]$。
- 「既然$\xi$在每个区间里，用定义就能直接说出$\xi$是多少。」定理只保证存在、唯一，通常说不出$\xi$的「公式」；要知道它的性质，得像例 1 那样对端点取:term[极限]{id="math.analysis.sequence-limit"}。

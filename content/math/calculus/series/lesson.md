---
id: math.calculus.series
title: |
  无穷级数与收敛
goal: |
  会用部分和判断级数是否收敛，求几何级数的和，并说明调和级数为什么发散。
prerequisites: [math.calculus.limits-at-infinity]
minutes: 26
summary: |
  级数的和是部分和的极限；$|q|<1$时$\sum aq^n=\frac a{1-q}$，调和级数发散。
status: reviewed
---

## 这一节要回答的问题

从$0$走到$1$，先走一半，再走剩下的一半，再走剩下的一半……走过的路程是$\frac12+\frac14+\frac18+\cdots$，无穷多个正数相加，结果应当是$1$。另一边，$1+\frac12+\frac13+\cdots$的每一项也越来越小，加起来却能超过任何数；$1-1+1-1+\cdots$又该等于几？无穷多个数「相加」到底是什么意思？

## 讲解

### 部分和与收敛

::anchor{id="def-series"}
给定数列$\{a_n\}$，把它的项依次用加号连起来，$a_1+a_2+\cdots+a_n+\cdots$，叫作:term[级数]{id="math.calculus.series"}（series），记作$\sum_{n=1}^\infty a_n$，$a_n$叫作它的通项（general term）。前$n$项的和$S_n=a_1+a_2+\cdots+a_n$叫作:term[部分和]{id="math.calculus.partial-sum"}（partial sum）。如果部分和组成的数列$\{S_n\}$是:term[收敛数列]{id="math.calculus.convergent-sequence"}（convergent sequence），:term[极限]{id="math.calculus.sequence-limit"}（limit of a sequence）是$S$，就说级数收敛（converge），$S$叫作级数的和，记作$\sum_{n=1}^\infty a_n=S$；否则说级数发散（diverge）。

为什么这样定义：无穷多次加法做不完，只能先加有限项，再看$n\to\infty$时部分和的极限。开头的$\frac12+\frac14+\cdots$，$S_n=1-\frac1{2^n}\to1$，和是$1$，正是走过的路程；$1-1+1-\cdots$的部分和在$1$和$0$之间来回跳，是:term[发散数列]{id="math.calculus.divergent-sequence"}（divergent sequence），级数发散。边界情况：发散的级数不能随意加括号，$(1-1)+(1-1)+\cdots$像是$0$，$1+(-1+1)+(-1+1)+\cdots$又像是$1$，这正说明它没有和。

收敛的级数可以逐项相加、乘常数：$\sum a_n=A$、$\sum b_n=B$时，$\sum(\alpha a_n+\beta b_n)=\alpha A+\beta B$，对部分和用:term[极限的四则运算法则]{id="math.calculus.limit-laws"}（limit laws）即得。去掉或添上有限项，部分和只差一个固定的数，不改变级数收敛与否，只改变和。

### 几何级数

::anchor{id="def-geometric-series"}
$a\ne0$时，:term[级数]{id="math.calculus.series"}$a+aq+aq^2+\cdots=\sum_{n=0}^\infty aq^n$叫作:term[几何级数]{id="math.calculus.geometric-series"}（geometric series），也叫等比级数，$q$叫作公比（common ratio）。

::anchor{id="thm-geometric-series"}
**定理**　$|q|<1$时几何级数收敛，和是$\frac a{1-q}$；$|q|\ge1$时发散。

道理：$q\ne1$时，由等比数列的求和公式，前$n$项的和$S_n=\frac{a(1-q^n)}{1-q}$。$0<|q|<1$时记$\frac1{|q|}=1+h$（$h>0$），由二项式定理$(1+h)^n\ge1+nh$，所以$|q|^n\le\frac1{1+nh}\to0$，于是$S_n\to\frac a{1-q}$。$|q|\ge1$时$|aq^n|\ge|a|$，通项不趋于$0$，由下面的定理，级数发散。

为什么有用：循环小数就是几何级数，$0.\dot9=\frac9{10}+\frac9{100}+\cdots$，首项$\frac9{10}$、公比$\frac1{10}$，和是$\frac{9/10}{1-1/10}=1$。边界情况：求和公式只在$|q|<1$时成立，硬把$q=2$代进去，会得到$1+2+4+\cdots=-1$这样的荒唐结果。

### 通项趋于零

::anchor{id="thm-term-test"}
**定理**　如果:term[级数]{id="math.calculus.series"}$\sum a_n$收敛，那么$n\to\infty$时$a_n\to0$。

道理：$a_n=S_n-S_{n-1}$，$S_n$和$S_{n-1}$都趋于级数的和$S$，差趋于$0$。

为什么有用：反过来说，通项不趋于$0$的级数一定发散，比如$\sum\frac n{n+1}$，通项趋于$1$。边界情况：通项趋于$0$并不能保证收敛，$\sum\frac1n$就是例子，见下面。

### 调和级数

::anchor{id="def-harmonic-series"}
:term[级数]{id="math.calculus.series"}$\sum_{n=1}^\infty\frac1n=1+\frac12+\frac13+\cdots$叫作:term[调和级数]{id="math.calculus.harmonic-series"}（harmonic series）。

::anchor{id="thm-harmonic-diverges"}
**定理**　调和级数发散。

道理：从第二项起按$2$的幂分组：第 1 组只有$\frac12$，$\frac13+\frac14\ge\frac14+\frac14=\frac12$，$\frac15+\cdots+\frac18\ge4\times\frac18=\frac12$；一般地，第$k$组从$\frac1{2^{k-1}+1}$到$\frac1{2^k}$，共$2^{k-1}$项，每项不小于$\frac1{2^k}$，和不小于$\frac12$。所以$S_{2^k}\ge1+\frac k2$，:term[部分和]{id="math.calculus.partial-sum"}没有上界，级数发散。

为什么值得记住：它是通项趋于$0$却发散的标准例子，以后判断别的级数常拿它来比。它发散得很慢：前$1000$项的和约为$7.5$，要超过$100$得加$10^{43}$项以上。边界情况：去掉一部分项，结果可能完全不同，只留分母是$2$的幂的那些项，$1+\frac12+\frac14+\cdots$是:term[几何级数]{id="math.calculus.geometric-series"}，收敛于$2$。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 41], y: [-0.5, 5.5] }
functions:
  - expr: "1/(1 - q) + 0*x"
    label: |
      几何级数的和$\frac1{1-q}$
sequences:
  - expr: "sum(k, 0, n - 1, q^k)"
    n: [1, 40]
    label: |
      几何级数$\sum q^k$的部分和$S_n$
  - expr: "sum(k, 1, n, 1/k)"
    n: [1, 40]
    label: |
      调和级数的部分和$S_n$
sliders:
  - name: q
    min: -0.8
    max: 0.8
    step: 0.05
    default: 0.5
    label: |
      公比$q$
:::

横轴是项数$n$（图上写作 x）。橙色的点是:term[几何级数]{id="math.calculus.geometric-series"}$1+q+q^2+\cdots$的:term[部分和]{id="math.calculus.partial-sum"}，蓝色横线是它的和$\frac1{1-q}$；绿色的点是:term[调和级数]{id="math.calculus.harmonic-series"}的部分和。拖动$q$：$q>0$时橙色的点一路上升，越来越贴近蓝线；$q<0$时它们在蓝线上下来回跳，跳的幅度越来越小，也收敛到蓝线。绿色的点越升越慢，前$40$项才到约$4.3$，可它没有上界，永远不会停下。

## 例题

### 例 1　裂项相消

求$\sum_{n=1}^\infty\frac1{n(n+1)}$。

**为什么想到这么做**：通项可以拆成两项之差，$\frac1{n(n+1)}=\frac1n-\frac1{n+1}$，写出:term[部分和]{id="math.calculus.partial-sum"}时，中间的项一正一负全部抵消。

**推导**：

$$
S_n=\Bigl(1-\frac12\Bigr)+\Bigl(\frac12-\frac13\Bigr)+\cdots+\Bigl(\frac1n-\frac1{n+1}\Bigr)=1-\frac1{n+1},
$$

$n\to\infty$时$S_n\to1$，所以:term[级数]{id="math.calculus.series"}收敛，和是$1$。

### 例 2　反弹的球走了多远

球从$1\,\mathrm m$高处落下，每次反弹到上一次高度的$\frac34$，一直弹下去。它一共走了多少路程？

**为什么想到这么做**：第一次下落$1\,\mathrm m$；以后每次反弹都是上去再下来，走两遍同一个高度，这些高度$\frac34,\bigl(\frac34\bigr)^2,\dots$组成公比为$\frac34$的:term[几何级数]{id="math.calculus.geometric-series"}。

**推导**：总路程是

$$
1+2\Bigl[\frac34+\Bigl(\frac34\Bigr)^2+\cdots\Bigr]=1+2\cdot\frac{3/4}{1-3/4}=1+6=7\ (\mathrm m).
$$

弹了无穷多次，路程却是有限的，因为每次的高度按固定的比例变小。

## 常见误区

- 「通项趋于$0$，:term[级数]{id="math.calculus.series"}就收敛。」:term[调和级数]{id="math.calculus.harmonic-series"}的通项$\frac1n\to0$，级数却发散；通项趋于$0$只是收敛的必要条件。
- 「:term[几何级数]{id="math.calculus.geometric-series"}的和总是$\frac a{1-q}$。」只在$|q|<1$时成立；$|q|\ge1$时级数发散，没有和。
- 「级数的项可以随便加括号。」收敛的级数加括号，相当于从:term[部分和]{id="math.calculus.partial-sum"}里挑出一部分，和不变；发散的级数加括号，可能得到不同的「和」，如$1-1+1-1+\cdots$。

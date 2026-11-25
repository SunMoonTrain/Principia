---
id: math.logic-sets.natural-arithmetic
title: |
  自然数的加法与乘法
goal: |
  会用递归定义自然数的加法和乘法，并用归纳法证明它们的结合律、交换律和分配律。
prerequisites: [math.logic-sets.peano-axioms]
minutes: 22
summary: |
  加法、乘法照右边的数递归定义，运算律也对右边的数归纳来证。
status: reviewed
---

## 这一节要回答的问题

$2+3=3+2$谁都会用，可从:term[皮亚诺公理]{id="math.logic-sets.peano-axioms"}（Peano axioms）出发，手里只有$0$和:term[后继]{id="math.logic-sets.successor"}（successor），[皮亚诺公理与递归定义](lesson:math.logic-sets.peano-axioms)的两道例题里，加法、乘法也只是先当作已知。怎样只用后继把它们定义出来？定义好以后，结合律（associative law）、交换律（commutative law）、分配律（distributive law）不再是规定，又怎样一条一条证出来？

## 讲解

本节的$S(n)$都指$n$的:term[后继]{id="math.logic-sets.successor"}，$1$就是$S(0)$，$2$就是$S(1)$，依此类推。归纳照[数学归纳法](lesson:math.logic-sets.induction#def-induction)里的简写，写成「$n=0$时……；设$n$时成立……」，「设$n$时成立」就是:term[归纳假设]{id="math.logic-sets.induction-hypothesis"}（induction hypothesis）。

### 加法

$3+2$就是从$3$起走两步：走一步到$S(3)=4$，再走一步到$S(4)=5$。

::anchor{id="def-addition"}
对每个取定的$m\in\N$，在:term[递归定理]{id="math.logic-sets.recursion-theorem"}（recursion theorem）里取$X=\N$、$c=m$、$g=S$，得到唯一的:term[映射]{id="math.logic-sets.map"}（map）$n\mapsto m+n$，满足$m+0=m$，并且对每个$n\in\N$，$m+S(n)=S(m+n)$。每个$m$各有一个这样的映射，合在一起就是$\N\times\N\to\N$的映射$(m,n)\mapsto m+n$，叫作自然数的加法（addition）。

为什么这样定义：加$n$就是从$m$起走$n$步，多走一步，就多取一次:term[后继]{id="math.logic-sets.successor"}。由定义，

$$
m+1=m+S(0)=S(m+0)=S(m),
$$

取后继就是加$1$。以后把$S(n)$写成$n+1$，定义里的第二条就成了$m+(n+1)=(m+n)+1$。

边界情况：$m+0=m$是定义，$0+n=n$却要证；定义只管右边的数每次加$1$时和怎样变，没有管左边。

::anchor{id="thm-addition-lemma"}
**定理**　对所有$m,n\in\N$，$0+n=n$，$(m+1)+n=(m+n)+1$。

**证明**：都对$n$归纳。前一条：$0+0=0$；设$0+n=n$，则$0+(n+1)=(0+n)+1=n+1$。后一条：$n=0$时两边都是$m+1$；设$n$时成立，则

$$
\begin{aligned}
(m+1)+(n+1)&=((m+1)+n)+1=((m+n)+1)+1\\
&=(m+(n+1))+1,
\end{aligned}
$$

第二个等号用:term[归纳假设]{id="math.logic-sets.induction-hypothesis"}，其余两个都是加法的定义。

这样左边也有了着落：左边的数加$1$，和也加$1$。

::anchor{id="thm-addition-laws"}
**定理（加法的结合律、交换律）**　对所有$m,n,k\in\N$，$(m+n)+k=m+(n+k)$，$m+n=n+m$。

**证明**：结合律取定$m$、$n$，对$k$归纳。$k=0$时两边都是$m+n$；设$k$时成立，则

$$
\begin{aligned}
(m+n)+(k+1)&=((m+n)+k)+1=(m+(n+k))+1\\
&=m+((n+k)+1)=m+(n+(k+1)),
\end{aligned}
$$

也只有第二个等号用归纳假设。

交换律取定$m$，对$n$归纳，两步各用上面定理的一条：$m+0=m=0+m$；设$m+n=n+m$，则

$$
m+(n+1)=(m+n)+1=(n+m)+1=(n+1)+m.
$$

为什么挑这两个变量来归纳：加法的:term[递归定义]{id="math.logic-sets.recursive-definition"}（recursive definition）管的是右边的数，归纳的变量出现在右边，定义才用得上；别的字母先取定，归纳时不动。

::anchor{id="thm-cancellation"}
**定理（加法的:term[消去律]{id="math.logic-sets.cancellation-law"}，cancellation law）**　对所有$m,n,k\in\N$，若$m+k=n+k$，则$m=n$。

**证明**：取定$m$、$n$，对$k$归纳。$k=0$时就是$m=n$。设$k$时成立；若$m+(k+1)=n+(k+1)$，即$(m+k)+1=(n+k)+1$，两个数的后继相同，由[皮亚诺公理与递归定义](lesson:math.logic-sets.peano-axioms#def-peano-axioms)的公理 (4)，$m+k=n+k$，再由归纳假设，$m=n$。

为什么起名：自然数里没有减法，「两边同时减去$k$」就由它代替；由交换律，$k$写在左边也能消去。边界情况：少了公理 (4) 就不成立。那一节缺 (4) 的反例（counterexample）$\{0,1,2\}$里，$S(1)=S(2)=2$，照定义的两条也能加，结合律、交换律都成立，可$1+1=2=2+1$，$1$消不掉。

### 大小

从$3$起走两步到$5$，$3+2=5$，$3$就排在$5$的前面。

::anchor{id="def-natural-order"}
设$m,n\in\N$。若有$k\in\N$使$m+k=n$，就说$m$不超过$n$，记作$m\le n$。任意两个自然数$m$、$n$，总有自然数$k$使$n=m+k$或者$m=n+k$，也就是$m\le n$或者$n\le m$，证明见第 6 题。

为什么这样定义：从$m$起走$k$步到了$n$，大小就由加法说了算，不必另立规矩；由交换律和:term[消去律]{id="math.logic-sets.cancellation-law"}，这样的$k$只有一个，中学记作$n-m$。后一句说两个自然数总比得出大小，[用等价类构造整数](lesson:math.logic-sets.number-constructions)时要用。边界情况：取$k=0$，每个$m$都满足$m\le m$；$m\le n$和$n\le m$都成立时只能$m=n$，也在第 6 题里证。

### 乘法

$4\cdot3$是$3$个$4$相加：从$0$起每次加$4$，加三次，依次是$4$、$8$、$12$。

::anchor{id="def-multiplication"}
对每个取定的$m\in\N$，在:term[递归定理]{id="math.logic-sets.recursion-theorem"}里取$X=\N$、$c=0$、$g(x)=x+m$，得到唯一的:term[映射]{id="math.logic-sets.map"}$n\mapsto m\cdot n$，满足$m\cdot0=0$，并且对每个$n\in\N$，$m\cdot(n+1)=m\cdot n+m$（先乘后加）。由此得到的$\N\times\N\to\N$的映射$(m,n)\mapsto m\cdot n$，叫作自然数的乘法（multiplication），${m\cdot n}$常写成$mn$。

为什么这样定义：$mn$就是$n$个$m$相加，右边的数每加$1$，就多加一个$m$，例如$m\cdot1=m\cdot0+m=0+m$，就是$m$。边界情况：$m\cdot0=0$是定义，$0\cdot n=0$又要证，见例 2。

::anchor{id="thm-distributive"}
**定理（乘法对加法的分配律）**　对所有$m,n,k\in\N$，$m(n+k)=mn+mk$。

**证明**：取定$m$、$n$，对$k$归纳。$k=0$时两边都是$mn$。设$k$时成立，则

$$
\begin{aligned}
m(n+(k+1))&=m((n+k)+1)=m(n+k)+m\\
&=(mn+mk)+m=mn+(mk+m)=mn+m(k+1),
\end{aligned}
$$

依次用了加法的定义、乘法的定义、:term[归纳假设]{id="math.logic-sets.induction-hypothesis"}、加法的结合律、乘法的定义。

乘法也满足交换律$mn=nm$（用例 2 的两个等式）、结合律$(mn)k=m(nk)$（用分配律），证明见第 5 题；由交换律，$(n+k)m=nm+km$也成立。$0$却不能消去：$2\cdot0=3\cdot0$，可$2\ne3$。

把证过的列成一张表：

| 运算律 | 对谁归纳 | 用到 |
| --- | --- | --- |
| ${0+n=n}$，${(m+1)+n=(m+n)+1}$ | $n$ | 加法的定义 |
| 加法结合律 | $k$ | 加法的定义 |
| 加法交换律 | $n$ | 加法的定义、第一行 |
| 加法:term[消去律]{id="math.logic-sets.cancellation-law"} | $k$ | 加法的定义、公理 (4) |
| 分配律 | $k$ | 两个定义、加法结合律 |

直接用到公理 (4) 的只有消去律，别的都只靠定义和归纳。

## 几何图像

![上部两排圆圈，同一列里的数相同。上排 4、5、6、7 由三支强调色箭头依次相连，写着 4 + 3，从 4 起走 3 步；下排 5、6、7、8 由三支强调色箭头依次相连，写着 (4 + 1) + 3，从 5 起走 3 步；上排的 4 到下排的 5、上排的 7 到下排的 8 各有一支虚线箭头，写着 +1。下部三块点阵：左边 3 行，每行 5 个圆点，最上面一行用强调色，写着 5·3；一支写着转 90° 的箭头指向中间，中间 5 行，每行 3 个圆点，最右边一列用强调色，写着 3·5；右边 5 行，每行 4 个圆点，上面 2 行用强调色，虚线把它们和下面 3 行隔开，分别写着 4·2 和 4·3，下面写着 4·(2 + 3) = 4·2 + 4·3](add-multiply.svg)

上部的箭头从一个数指向它的:term[后继]{id="math.logic-sets.successor"}：从$4$起走$3$步到$7$，就是$4+3$。起点往后挪一步，终点也往后挪一步，就是$(4+1)+3=(4+3)+1$。

下部的$m\cdot n$画成$n$行、每行$m$个圆点的点阵。左边的$5\cdot3$顺时针转$90^\circ$，强调色的第一行成了最右边的一列，点阵成了$3\cdot5$，点数没有变，看得出$5\cdot3=3\cdot5$。右边的$5$行分成$2$行和$3$行，就是$4\cdot(2+3)=4\cdot2+4\cdot3$。图只画了几组具体的数，对所有自然数都成立，要靠归纳来证。

## 例题

### 例 1　证明$2+2=4$

只用加法的定义，证明$2+2=4$。

**为什么想到这么做**：定义只说了右边是$0$时、是某个数的:term[后继]{id="math.logic-sets.successor"}时怎么办，所以把右边的$2$写成$S(S(0))$，一步步拆到$0$。

**推导**：先算$2+1$，再算$2+2$：

$$
\begin{aligned}
2+1&=2+S(0)=S(2+0)=S(2)=3,\\
2+2&=2+S(1)=S(2+1)=S(3)=4.
\end{aligned}
$$

右边是具体的数，拆有限次就到$0$，用不着归纳。

### 例 2　乘法的两个等式

证明：对所有$m,n\in\N$，$0\cdot n=0$，$(m+1)n=mn+n$。

**为什么想到这么做**：它们和加法的第一个定理一样，是在补定义没管的左边。乘法的:term[递归定义]{id="math.logic-sets.recursive-definition"}管的是右边的数，就对$n$归纳。

**推导**：$0\cdot0=0$；设$0\cdot n=0$，则$0\cdot(n+1)=0\cdot n+0=0$。后一条：$n=0$时两边都是$0$；设$n$时成立，则

$$
\begin{aligned}
(m+1)(n+1)&=(m+1)n+(m+1)=(mn+n)+(m+1)\\
&=(mn+m)+(n+1)=m(n+1)+(n+1).
\end{aligned}
$$

第三个等号用加法的结合律、交换律，$n+(m+1)$和$m+(n+1)$都等于$(m+n)+1$。

## 常见误区

- 「$0+n=n$由定义就有。」不对：定义说的是$n+0=n$。$0+n$的右边是字母，照定义拆不到底，要对$n$归纳来证。
- 「定义的第二条$m+(n+1)=(m+n)+1$就是结合律。」不对：它只是$(m+n)+k=m+(n+k)$里$k=1$的情形，一般的$k$要由它归纳来证。
- 「证$m+n=n+m$，先验证$m=n=0$，再由$m$、$n$时成立推出两个数都加$1$时也成立，就够了。」不够：这样从$0+0$起只走得到$1+1$、$2+2$……，走不到$2+3=3+2$。要先取定$m$，只对$n$归纳；$m$是任取的，结论就对所有的$m$、$n$成立。
- 「点阵转$90^\circ$就证明了乘法的交换律。」不够：图画的是一组具体的数；要拿点阵来证，得先证明$n$行、每行$m$个的点阵恰有$mn$个点，而且怎样数都是这么多（见[等势与可数集](lesson:math.logic-sets.countable-sets)），这些又要归纳。第 5 题直接从:term[递归定义]{id="math.logic-sets.recursive-definition"}来证。

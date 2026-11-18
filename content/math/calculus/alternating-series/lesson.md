---
id: math.calculus.alternating-series
title: |
  交错级数与绝对收敛
goal: |
  会用莱布尼茨判别法判断交错级数收敛，并区分绝对收敛和条件收敛。
prerequisites: [math.calculus.comparison-tests]
minutes: 27
summary: |
  项正负交替、绝对值递减趋于$0$的级数收敛；$\sum|a_n|$收敛则$\sum a_n$收敛。
status: reviewed
---

## 这一节要回答的问题

$1-\frac12+\frac13-\frac14+\cdots$的各项取绝对值，就是发散的:term[调和级数]{id="math.calculus.harmonic-series"}（harmonic series）。正负相间、前后抵消，能不能让它收敛？:term[比较判别法]{id="math.calculus.comparison-test"}（comparison test）、:term[积分判别法]{id="math.calculus.integral-test"}（integral test）都是对:term[正项级数]{id="math.calculus.nonnegative-series"}（series of nonnegative terms）说的，有正有负的:term[级数]{id="math.calculus.series"}（series）该怎么判断？

## 讲解

### 交错级数

::anchor{id="def-alternating-series"}
各项正负相间的:term[级数]{id="math.calculus.series"}叫作:term[交错级数]{id="math.calculus.alternating-series"}（alternating series），写作$\sum_{n=1}^\infty(-1)^{n+1}a_n=a_1-a_2+a_3-\cdots$，其中每个$a_n>0$。$a_n=\frac1n$时的$1-\frac12+\frac13-\frac14+\cdots$叫作:term[交错调和级数]{id="math.calculus.alternating-harmonic-series"}（alternating harmonic series）。

为什么单独讲：:term[正项级数]{id="math.calculus.nonnegative-series"}的:term[部分和]{id="math.calculus.partial-sum"}（partial sum）只增不减，交错级数的部分和却一会儿加、一会儿减，前面的判别法都用不上。交错调和级数是最常拿来举例的一个，它的部分和在两个越来越近的数之间来回跳。边界情况：正负相间不保证收敛，$1-1+1-1+\cdots$也是交错级数，部分和在$1$和$0$之间跳，一直不靠拢。

### 交错级数判别法

::anchor{id="thm-alternating-series-test"}
**定理（:term[交错级数判别法]{id="math.calculus.alternating-series-test"}，alternating series test）**　如果$a_n$单调递减，并且$a_n\to0$，那么:term[交错级数]{id="math.calculus.alternating-series"}$\sum_{n=1}^\infty(-1)^{n+1}a_n$收敛，它的和$S$夹在任意两个相邻的:term[部分和]{id="math.calculus.partial-sum"}之间，所以$|S-S_m|\le a_{m+1}$。这个判别法也叫莱布尼茨判别法（Leibniz test）。

道理：偶数项的部分和$S_{2k+2}=S_{2k}+(a_{2k+1}-a_{2k+2})\ge S_{2k}$，单调递增；又$S_{2k}=a_1-(a_2-a_3)-\cdots-(a_{2k-2}-a_{2k-1})-a_{2k}\le a_1$，有上界。由:term[单调有界原理]{id="math.analysis.monotone-convergence-theorem"}（monotone convergence theorem，见[两个重要极限](lesson:math.calculus.special-limits)），$S_{2k}$趋于某个数$S$；$S_{2k+1}=S_{2k}+a_{2k+1}$也趋于$S$，所以$S_n\to S$。同样可知$S_{2k+1}$单调递减，于是$S$在每一对相邻的部分和之间，和$S_m$的距离不超过$|S_{m+1}-S_m|=a_{m+1}$。

为什么有用：只要通项的绝对值单调趋于$0$，:term[级数]{id="math.calculus.series"}就收敛，而且误差一眼看得出：用前$m$项的和代替整个和，误差不超过第一个丢掉的项。:term[交错调和级数]{id="math.calculus.alternating-harmonic-series"}用前$m$项近似，误差不超过$\frac1{m+1}$；它的和是$\ln2$，见[泰勒级数](lesson:math.calculus.taylor-series)。边界情况：单调这个条件不能少，奇数项取$\frac1k$、偶数项取$\frac1{k^2}$（$k=1,2,\dots$）时$a_n\to0$，可前$2K$项的和是$\sum_{k=1}^K\bigl(\frac1k-\frac1{k^2}\bigr)$，没有上界。

### 绝对收敛与条件收敛

::anchor{id="def-absolute-convergence"}
如果$\sum|a_n|$收敛，就说$\sum a_n$:term[绝对收敛]{id="math.calculus.absolute-convergence"}（absolute convergence）；如果$\sum a_n$收敛，而$\sum|a_n|$发散，就说$\sum a_n$:term[条件收敛]{id="math.calculus.conditional-convergence"}（conditional convergence）。

::anchor{id="thm-absolute-convergence"}
**定理**　绝对收敛的:term[级数]{id="math.calculus.series"}一定收敛，并且$\Bigl|\sum_{n=1}^\infty a_n\Bigr|\le\sum_{n=1}^\infty|a_n|$。

道理：$0\le a_n+|a_n|\le2|a_n|$，由:term[比较判别法]{id="math.calculus.comparison-test"}，$\sum(a_n+|a_n|)$收敛；两个收敛的级数相减，$\sum a_n=\sum(a_n+|a_n|)-\sum|a_n|$也收敛。又$|S_n|\le\sum_{k=1}^n|a_k|\le\sum_{k=1}^\infty|a_k|$，令$n\to\infty$即得不等式。

为什么有用：$\sum|a_n|$是:term[正项级数]{id="math.calculus.nonnegative-series"}，比较判别法、:term[积分判别法]{id="math.calculus.integral-test"}都能用，有正有负的问题就变成了正项级数的问题。比如$\bigl|\frac{\cos n}{2^n}\bigr|\le\frac1{2^n}$，所以$\sum\frac{\cos n}{2^n}$绝对收敛。:term[交错调和级数]{id="math.calculus.alternating-harmonic-series"}收敛，取绝对值后是:term[调和级数]{id="math.calculus.harmonic-series"}，发散，所以它条件收敛。边界情况：条件收敛的级数全靠正负抵消，交错调和级数的正项$1+\frac13+\frac15+\cdots$单独加起来，每项$\frac1{2k-1}$都大于$\frac1{2k}$，比调和级数的一半还大，发散。

### 条件收敛的级数不能随意重排

有限个数相加，次序可以随便换；无穷多项就不一定。把:term[交错调和级数]{id="math.calculus.alternating-harmonic-series"}的项换个次序，每个正项后面跟两个负项：$1-\frac12-\frac14+\frac13-\frac16-\frac18+\cdots$。第$k$组是$\frac1{2k-1}-\frac1{4k-2}-\frac1{4k}$，前两项合并成$\frac1{4k-2}$，整组等于$\frac12\bigl(\frac1{2k-1}-\frac1{2k}\bigr)$。前$k$组的和是$\frac12S_{2k}$，趋于$\frac S2$，组内的项又趋于$0$，所以换了次序的:term[级数]{id="math.calculus.series"}收敛到$\frac S2$：用的还是那些项，和却只剩一半。

为什么要紧：:term[条件收敛]{id="math.calculus.conditional-convergence"}的级数，和依赖于项的次序；:term[绝对收敛]{id="math.calculus.absolute-convergence"}的级数怎样:term[重排]{id="math.analysis.rearrangement"}（rearrangement），和都不变，证明见数学分析的[级数的重排](lesson:math.analysis.rearrangement)。所以要交换求和的次序、重新分组时，先看级数是不是绝对收敛。边界情况：只加括号、不换次序，相当于从:term[部分和]{id="math.calculus.partial-sum"}里挑出一部分，收敛的级数和不变。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 31], y: [-0.2, 3.2] }
sequences:
  - expr: "sum(k, 1, n, (-1)^(k + 1)/k^p)"
    n: [1, 30]
    label: |
      交错级数$\sum(-1)^{k+1}\frac1{k^p}$的部分和
  - expr: "sum(k, 1, n, 1/k^p)"
    n: [1, 30]
    label: |
      各项取绝对值后的部分和
sliders:
  - name: p
    min: 0.5
    max: 2
    step: 0.05
    default: 1
    label: |
      指数$p$
:::

横轴是项数$n$。蓝色的点是:term[交错级数]{id="math.calculus.alternating-series"}$\sum(-1)^{k+1}\frac1{k^p}$的:term[部分和]{id="math.calculus.partial-sum"}，一上一下地跳，跳的幅度是下一项$\frac1{(n+1)^p}$，越来越小，收敛到一个数；$p=1$时这个数是$\ln2\approx0.693$。橙色的点是各项取绝对值后的部分和：$p>1$时它也趋于一个数，:term[级数]{id="math.calculus.series"}:term[绝对收敛]{id="math.calculus.absolute-convergence"}；$p\le1$时它没有上界，很快冲出图外，交错级数只是:term[条件收敛]{id="math.calculus.conditional-convergence"}。

## 例题

### 例 1　绝对收敛还是条件收敛

判断$\sum_{n=1}^\infty\frac{(-1)^{n+1}}{\sqrt n}$和$\sum_{n=1}^\infty\frac{(-1)^{n+1}}{n^2+1}$是:term[绝对收敛]{id="math.calculus.absolute-convergence"}、:term[条件收敛]{id="math.calculus.conditional-convergence"}还是发散。

**为什么想到这么做**：先看取绝对值后的:term[正项级数]{id="math.calculus.nonnegative-series"}收不收敛；收敛就是绝对收敛，不收敛再用:term[交错级数判别法]{id="math.calculus.alternating-series-test"}看原来的:term[级数]{id="math.calculus.series"}。

**推导**：$\sum\frac1{n^p}$在$p=\frac12$时发散，而$\frac1{\sqrt n}$单调递减趋于$0$，由交错级数判别法，第一个级数收敛，所以它条件收敛。$\frac1{n^2+1}<\frac1{n^2}$，由:term[比较判别法]{id="math.calculus.comparison-test"}，$\sum\frac1{n^2+1}$收敛，第二个级数绝对收敛。

### 例 2　算到指定的精度

用:term[部分和]{id="math.calculus.partial-sum"}近似$\sum_{n=1}^\infty\frac{(-1)^{n+1}}{n^3}$，按:term[交错级数判别法]{id="math.calculus.alternating-series-test"}的误差估计，取几项就能保证误差不超过$0.001$？

**为什么想到这么做**：$\frac1{n^3}$单调递减趋于$0$，交错级数判别法给出$|S-S_m|\le\frac1{(m+1)^3}$，只要让第一个丢掉的项不超过$0.001$。

**推导**：$\frac1{(m+1)^3}\le0.001$即$m+1\ge10$，取$m=9$，$S_9\approx0.9021$。下一个部分和$S_{10}=S_9-0.001\approx0.9011$，和$S$夹在它们之间，误差确实不超过$0.001$。

## 常见误区

- 「通项趋于$0$的:term[交错级数]{id="math.calculus.alternating-series"}一定收敛。」还要$a_n$单调递减；奇数项取$\frac1k$、偶数项取$\frac1{k^2}$时通项趋于$0$，:term[级数]{id="math.calculus.series"}却发散。
- 「级数收敛，各项取绝对值后也收敛。」:term[交错调和级数]{id="math.calculus.alternating-harmonic-series"}收敛，取绝对值后是发散的:term[调和级数]{id="math.calculus.harmonic-series"}。
- 「收敛的级数，项可以随便换次序。」只有:term[绝对收敛]{id="math.calculus.absolute-convergence"}的级数可以；交错调和级数换了次序，和可以变成原来的一半。

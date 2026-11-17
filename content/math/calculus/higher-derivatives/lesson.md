---
id: math.calculus.higher-derivatives
title: |
  高阶导数
goal: |
  会求函数的高阶导数，并用莱布尼茨公式求乘积的高阶导数。
prerequisites: [math.calculus.elementary-derivatives, math.calculus.chain-rule]
minutes: 25
summary: |
  导数再求导得高阶导数；乘积的$n$阶导数按二项式系数展开。
status: reviewed
---

## 这一节要回答的问题

位置对时间的:term[导数]{id="math.calculus.derivative"}（derivative）是速度，速度对时间的导数是加速度：汽车「越开越快」说的是哪个导数？$\sin x$求一次导是$\cos x$，求两次、三次、一百次会有什么规律？乘积的一百阶导数有没有公式可套？

## 讲解

### 二阶导数

自由下落的物体，$t$秒内落下$s(t)=4.9t^2$米，速度是$v(t)=s'(t)=9.8t$米每秒。速度每秒增加$9.8$米每秒，$v'(t)=9.8$，这就是重力加速度。加速度是:term[导数]{id="math.calculus.derivative"}的导数。

::anchor{id="def-second-derivative"}
如果$f$的:term[导函数]{id="math.calculus.derivative-function"}（derivative function）$f'$在$x$处:term[可导]{id="math.calculus.differentiable"}（differentiable），它的导数叫作$f$在$x$处的:term[二阶导数]{id="math.calculus.second-derivative"}（second derivative），记作$f''(x)$、$y''$或$\dv{^2y}{x^2}$。

为什么这样定义：$f'$说的是$f$变化的快慢，$f''$说的是$f'$变化的快慢。位置的二阶导数是加速度；在图上，$f''$是:term[切线]{id="math.calculus.tangent-line"}（tangent line）斜率的变化率，$f''>0$时切线越转越朝上，曲线向上弯（见[凹凸性与拐点](lesson:math.calculus.concavity)）。边界情况：$f$可导，$f'$不一定可导。$f(x)=x|x|$的导数是$f'(x)=2|x|$，它在$0$处不可导，所以$f''(0)$不存在。

### n 阶导数

::anchor{id="def-higher-derivative"}
一般地，$f$的$n-1$阶导数的:term[导数]{id="math.calculus.derivative"}叫作$f$的$n$阶导数，记作$f^{(n)}(x)$或$\dv{^ny}{x^n}$；二阶和二阶以上的导数统称:term[高阶导数]{id="math.calculus.higher-derivative"}（higher-order derivative）。约定$f^{(0)}=f$。

为什么要这样记：一撇一撇写下去，$f''''$很难数清楚，所以四阶起写成$f^{(4)}$；括号用来和$4$次方$f^4$区分。边界情况：$m$次多项式求$m$次导数得到常数$m!$乘首项系数，再求导就一直是$0$。

几个常用函数的$n$阶导数可以先求几阶、看出规律：

$$
(e^{ax})^{(n)}=a^ne^{ax},\qquad (\sin x)^{(n)}=\sin\Bigl(x+\frac{n\pi}2\Bigr),\qquad (\cos x)^{(n)}=\cos\Bigl(x+\frac{n\pi}2\Bigr).
$$

第一个由:term[链式法则]{id="math.calculus.chain-rule"}（chain rule，见[链式法则](lesson:math.calculus.chain-rule)），每求一次导多一个因子$a$。第二个是因为$(\sin x)'=\cos x=\sin\bigl(x+\frac\pi2\bigr)$：求一次导，图像向左平移$\frac\pi2$；再求导，再平移（见几何图像）。严格地说，看出规律以后要用数学归纳法证明，例 1 是一个完整的例子。

### 莱布尼茨公式

乘积的:term[二阶导数]{id="math.calculus.second-derivative"}：$(uv)''=(u'v+uv')'=u''v+2u'v'+uv''$；再求一次导，得$u'''v+3u''v'+3u'v''+uv'''$。系数$1,2,1$和$1,3,3,1$正是二项式系数。

::anchor{id="thm-leibniz"}
**:term[莱布尼茨公式]{id="math.calculus.leibniz-formula"}（Leibniz rule）**　$u$、$v$都$n$阶:term[可导]{id="math.calculus.differentiable"}时，$(uv)^{(n)}=\sum_{k=0}^n\binom nku^{(n-k)}v^{(k)}$。

道理：和二项式定理的证明一样，用数学归纳法。设$n$时成立，再求一次导，每一项$u^{(n-k)}v^{(k)}$由:term[乘积法则]{id="math.calculus.product-rule"}（product rule）变成$u^{(n-k+1)}v^{(k)}+u^{(n-k)}v^{(k+1)}$。合并同类项时，$u^{(n+1-k)}v^{(k)}$的系数是$\binom nk+\binom n{k-1}=\binom{n+1}k$，就是$n+1$时的公式。

它最有用的时候，是有一个因子是多项式：多项式求几次导就变成$0$，和式里只剩前几项（例 2）。边界情况：公式要$u$、$v$各自$n$阶可导；只知道乘积$n$阶可导不够，比如$|x|\cdot|x|=x^2$处处可导，$|x|$在$0$处却不可导。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-6.3, 6.3], y: [-1.6, 1.6] }
functions:
  - expr: "sin(x)"
    label: |
      $y=\sin x$
  - expr: "sin(x + k*pi/2)"
    label: |
      $y=(\sin x)^{(k)}$
sliders:
  - name: k
    min: 0
    max: 8
    step: 1
    default: 1
    label: |
      求导的次数$k$
:::

橙色曲线是$\sin x$的$k$阶:term[导数]{id="math.calculus.derivative"}。$k=1$时它是$\cos x$，比蓝色的$\sin x$向左平移了$\frac\pi2$；每多求一次导，就再向左平移$\frac\pi2$。$k=2$时得到$-\sin x$，$k=4$时和蓝色曲线重合，回到$\sin x$：$\sin x$的导数四个一循环。

## 例题

### 例 1　看出规律，再用归纳法证明

求$f(x)=\frac1{1+x}$的$n$阶导数，再写出$\ln(1+x)$的$n$阶导数（$x>-1$）。

**为什么想到这么做**：$f=(1+x)^{-1}$是整数次幂，每求一次导，指数减$1$、前面多一个因子；先算几阶找规律，再用数学归纳法证明。

**推导**：$f'=-(1+x)^{-2}$，$f''=2(1+x)^{-3}$，$f'''=-6(1+x)^{-4}$，猜$f^{(n)}=(-1)^nn!\,(1+x)^{-n-1}$。$n=1$时成立；设$n$时成立，再求一次导得$(-1)^nn!\cdot(-n-1)(1+x)^{-n-2}=(-1)^{n+1}(n+1)!\,(1+x)^{-n-2}$，$n+1$时也成立。$\bigl(\ln(1+x)\bigr)'=\frac1{1+x}$，所以$n\ge1$时$\bigl(\ln(1+x)\bigr)^{(n)}=f^{(n-1)}=\frac{(-1)^{n-1}(n-1)!}{(1+x)^n}$。

### 例 2　一个因子是多项式

求$(x^2\sin x)^{(10)}$。

**为什么想到这么做**：直接求十次导太长。用:term[莱布尼茨公式]{id="math.calculus.leibniz-formula"}，$u=\sin x$、$v=x^2$：$x^2$的三阶及以上:term[导数]{id="math.calculus.derivative"}都是$0$，和式里只剩$k=0,1,2$三项。

**推导**：$(x^2\sin x)^{(10)}=\binom{10}0x^2(\sin x)^{(10)}+\binom{10}1\cdot2x\,(\sin x)^{(9)}+\binom{10}2\cdot2\,(\sin x)^{(8)}$。由$(\sin x)^{(n)}=\sin\bigl(x+\frac{n\pi}2\bigr)$，$(\sin x)^{(10)}=-\sin x$，$(\sin x)^{(9)}=\cos x$，$(\sin x)^{(8)}=\sin x$。所以结果是$-x^2\sin x+20x\cos x+90\sin x$。

## 常见误区

- 「$f^{(n)}(x)$是$f(x)$的$n$次方。」$f^{(n)}$是$n$阶导数，$n$次方写成$f^n$或$[f(x)]^n$。
- 「$(uv)''=u''v''$。」取$u=v=x$：$(x^2)''=2$，而$u''v''=0$；正确的是$u''v+2u'v'+uv''$。
- 「$f$:term[可导]{id="math.calculus.differentiable"}，$f'$就可导。」$x|x|$处处可导，它的:term[导数]{id="math.calculus.derivative"}$2|x|$在$0$处不可导。

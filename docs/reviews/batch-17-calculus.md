# 批次 17 审查报告：单变量微积分（极限、连续与导数）

审内容 agent（和写内容 agent 是两个独立会话，没有读它的会话记录、交接说明和自查脚本）· 2026-11-15

审查范围：`math.calculus`（新领域，`proofPolicy: sketch`）的第一批 9 节：`limits-intuition`、`limit-laws`、`continuity`、`limits-at-infinity`、`special-limits`、`closed-interval-properties`、`infinitesimal-orders`、`derivative`、`derivative-rules`。包括：

- 9 节的文件头、正文、`problems.yaml`（72 道题）、5 张 SVG（`limit-vs-value.svg`、`discontinuities.svg`、`unit-circle.svg`、`closed-interval.svg`、`product-area.svg`）、8 个 `function-plot` 动画；
- `_domain.yaml` 的术语表：从空表加到 38 条；
- 两节大纲 `curve-sketching`、`improper-integrals` 各删了一项前置（协调会话转述的）。

另外看了：

- 以这一批为直接前置的已写小节（数学分析 `sequences-limits`、`continuity`、`intermediate-value`、`extreme-value`，多变量微积分 `multivariable-limits`）；
- 从别的领域链到这一批的地方：常微分方程 `lyapunov-stability` 第 5 题，数学分析 `function-limits:16` 的用法；
- 规矩 C 两个方向的扫描。

初审前按「每批的流程」第 4 条，把整个 `content/math/calculus/`（含 `_domain.yaml`，共 61 个文件）拷了一份快照到我的 scratchpad（`b17-snapshot/`），复核时和它比。

## 结论

重要 2 条，小问题 3 条；没有原有问题。

- 讲解、例题的推导和结论都对，除了下面重要 2 的两句。
- 36 道简单题、中等题独立验算，全部和标准答案一致。
- 36 道难题、思考题全部读过，参考解答都对，只有 `continuity` 第 8 题（1）的后半句不对（见重要 2）。
- 5 张图、8 个动画都正常：768 像素宽、提示和解答全部展开时没有横向滚动；SVG 文字不出界、不重叠、不压线。
- 下游 5 节和 2 处链接都接得住。

- **重要 1：`derivative` 的切线只对可导的点下了定义，讲解、例 1 和常见误区却说不可导的点也有（竖直）切线**
  - 定义卡片 `derivative:53`：「如果$f$在$a$处:term[可导]…，过点$P(a,f(a))$、斜率为$f'(a)$的直线叫作…:term[切线]…」。术语表 `_domain.yaml:318` 的简介也只说「过$(a,f(a))$、斜率为$f'(a)$的直线」。
  - 可是下面三处说不可导的点有切线：
    - `:57`：$\sqrt[3]x$ 在 $0$ 处不可导，「曲线在原点有一条竖直的切线，只是它的斜率不是数」；
    - `:121` 例 1：$\sqrt x$ 在 $0$ 处不可导，「切线是竖直的$y$轴」；
    - `:142` 常见误区：「「导数不存在，就没有切线。」$\sqrt[3]x$在原点不可导，可它在那里有竖直的切线」。
  - 照 `:53` 的定义，不可导就没有切线，所以 `:142` 当作误区的这句话按本节自己的定义其实是对的。这违反「常见误区要在最自然的理解下确实不成立」（`plan.md:302`），读者也会觉得定义和后文打架。
  - 建议把定义扩充（教材的通常做法）：在 `:53` 那一段末尾补一句，比如「$h\to0$ 时差商是:term[无穷大]（端点处只看一侧）时，竖直线 $x=a$ 也叫作曲线在 $P$ 处的切线。」术语表简介相应补上，注意 60 字上限。这样 `:57`、`:121`、`:142` 都和定义接上了。
  - 第 7 题（3）「$|x|$ 在原点没有切线」不受影响：两侧差商是 $\pm1$，不是无穷大。
- **重要 2：三处说法按字面读是错的（讲解两处，`continuity` 第 8 题的提示和参考解答一处）**
  - `limits-at-infinity:38`，有理函数那条定理的「道理」：
    - 原文：「分子、分母同除以$x^k$。分母趋于$b_k$；分子里除了$a_mx^{m-k}$，其余各项都趋于$0$。」
    - $m\ge k+2$ 时这句不对。例如 $\frac{x^3+x^2}{x}=x^2+x$，$x$ 这一项也趋于无穷大，不趋于 $0$。定理的结论没错，错的是理由。
    - 建议分两种情形写：$m\le k$ 时照现在同除以 $x^k$；$m>k$ 时改为同除以 $x^m$，分子趋于 $a_m\ne0$、分母趋于 $0$，由 `limit-laws:47` 讲过的边界情况，商是无穷大。
  - `special-limits:45`：
    - 原文：「所以$a_n<1+1+\frac12+\frac14+\cdots<3$」。
    - 省略号读成无穷多项的话，这个和正好是 $3$，「$<3$」不成立。而且无穷多项求和这一节还没讲（级数在 `series`）。
    - 建议改成有限和：$a_n\le1+1+\frac12+\cdots+\frac1{2^{n-1}}=3-\frac1{2^{n-1}}<3$。
  - `continuity` 第 8 题（1）第 3 级提示（`problems.yaml:167`）和参考解答（`:173`）：
    - 原文（提示）：「改左边一侧可以随意换掉左极限：只要右极限存在（是一个数），跳跃间断点、只有左侧是无穷大的无穷间断点也能修好」。
    - 题面说「只改$a$左边（$x<a$）的函数值、右边不动」，$f(a)$ 不能改。所以光有右极限还不够，还要 $f(a)$ 有定义并且等于右极限，也就是 $f$ 在 $a$ 处右连续。
    - 反例：$x<0$ 时 $f=0$，$f(0)=5$，$x>0$ 时 $f=1$。右极限是 $1$，可无论左边怎么改，$x=0$ 处仍然不连续（最多变成可去间断点）。$f(a)$ 没有定义的无穷间断点也一样修不好。
    - 第 3 级提示在网页上显示，读者会照着记住。
    - 建议把题面改成「只改$a$和它左边（$x\le a$）的函数值」，现在的提示和解答就对了。也可以题面不动，提示和参考解答都补上「并且$f(a)$等于右极限」。

- **小问题 1：几道题和讲解、术语表重复了（`plan.md:227`）**
  - `continuity` 第 2 题（哪些以 $x=0$ 为跳跃间断点）的两个选项照搬了讲解里判过的例子：
    - 选项 C「$\frac1x$」：`continuity:80` 拿它当无穷间断点的例子，术语表 `_domain.yaml:138` 的简介也写着「例如$\frac1x$的$x=0$」；
    - 选项 D「$\lfloor x\rfloor$」：`:75` 说过它在每个整数处是跳跃间断点，简介 `_domain.yaml:129` 也是这个例子。
    - 两个都不用多想一步，不属于批次 5 的例外。和批次 10 `vector-spaces` 第 2 题同一类。
  - `infinitesimal-orders` 第 2 题选项 C「$\tan2x$」（是否比 $x$ 高阶）：「同阶无穷小」的简介 `_domain.yaml:255` 举的正是「$x\to0$ 时的 $\tan2x$ 和 $x$」，讲解里点开浮窗就能看到答案。
  - `limits-at-infinity` 第 1 题的答案是 $2$。「这一节要回答的问题」`:16` 里 $\frac{2x+1}{x-1}$ 趋于 $2$，同一类量、同一个数，按「参数不同、可答案…一样，也要换」（批次 14）要换。动画默认 $a=2$（`:84`），画的也是 $y=2$。
  - 建议：
    - `continuity` 第 2 题：C 换成要先算一下的无穷间断点，例如 $\frac{1}{x^2-x}$；D 换成要多想一步的跳跃，例如 $\lfloor x\rfloor^2$（左极限 $1$，右极限 $0$）。
    - `infinitesimal-orders` 第 2 题：简介的例子换一个，例如「$\sin3x$和$x$」。
    - `limits-at-infinity` 第 1 题：改系数，例如分子用 $6x^3$，答案变成 $3$。
- **小问题 2：名词——两节都用的没进术语表，第一次出现没括注英文，$\arcsin x$ 没交代**
  - 两节以上用到、要进术语表（`plan.md:244`：两节以上用到的名词进表，定理名同样）：
    - 「代入法」：`limit-laws:36` 起名，有锚点 `thm-substitution`；`continuity:39` 也用（「……里的代入法说的也是这件事」）。
    - 「第一个重要极限」「第二个重要极限」：`special-limits:29`、`:57` 的定理标签起名，`infinitesimal-orders:55`、`:58` 的表里也用。
    - 进表以后 `continuity:39`、`infinitesimal-orders:55`、`:58` 补标。起名都在共同的前置上（`limit-laws` 是 `continuity` 的前置，`special-limits` 是 `infinitesimal-orders` 的前置），不用挪。
  - 第一次出现没括注英文（`plan.md:242`，题目文字同样）：
    - 两个重要极限，`special-limits:29`、`:57`。没有通行的英文名，可以写描述性的，比如 the limit of $\frac{\sin x}{x}$、the limit defining $e$。
    - `limits-intuition` 第 7 题题干（`problems.yaml:139`）的「差商」「导数」。
    - `limits-at-infinity` 第 7 题第 3 级提示（`problems.yaml:123`）的「斜渐近线」。
  - $\arcsin x$ 没交代是什么：
    - 出处：`special-limits:33`（「令$u=\arcsin x$」）、`infinitesimal-orders:55` 的表；`continuity:51` 列基本初等函数时也写了「反三角函数」。
    - 读者只有中学数学，现行高中课标不讲反三角函数。`limits-at-infinity:27` 对 $\arctan x$ 当场括注了「$\tan x$在…上的反函数」，$\arcsin x$ 第一次出现处照样括注一句就行（例如「$\sin x$ 在 $\bigl[-\frac\pi2,\frac\pi2\bigr]$ 上的反函数」）。
- **小问题 3：两处图注的说法不准**
  - `limit-laws:84`：
    - 原文：「把$p$拖到$0$，上下界变成$\pm1$，夹不住了，中间的$\sin\frac1x$在$0$处也就没有极限。」
    - 「也就」读起来像「夹不住，所以没有极限」。夹逼定理用不上，推不出极限不存在；讲解 `:58` 自己也说 $-1\le\sin\frac1x\le1$ 对极限什么都没说。
    - 建议改成「……夹不住了，夹逼定理什么也说不出；而$\sin\frac1x$在$0$处本来就没有极限」。
  - `infinitesimal-orders:121`：
    - 原文：「只有$k=2$时比值趋于不为零的$\frac12$，曲线落在橙色水平线上」。
    - $k=2$ 时曲线只在原点碰到 $y=\frac12$，离开原点就往下走，$x=\pm3$ 处约 $0.22$（页面上看过）。
    - 改成「曲线在原点附近贴向橙色水平线」。

## 改了没报的

- **`special-limits` 的前置**：从 `[limit-laws]` 改成了 `[continuity, limits-at-infinity]`，协调会话的消息里没提这一条（只提了两节大纲删前置）。
  - 改得对，而且必要：讲解 `:26` 要用 $\cos x$ 在 $0$ 处连续，`:33`、`:59`、`:66` 用 `continuity` 的换元定理和 $\ln$ 的连续性，`:37`–`:59` 讲数列和 $x\to\infty$。两条前置互不包含。
  - 改后 `special-limits` 层级 2→3，`infinitesimal-orders` 3→4。全图别的小节层级都不变：我按改前、改后的前置各算了一遍全图层级，`generated/graph.json` 里的层级和算的也一致。
  - 两节大纲删掉 `limits-at-infinity` 就是这一条连带的。构建查多余的前置（`compiler/compile.ts:124`），现在 `limits-at-infinity` 可以经 `special-limits` → `elementary-derivatives` 推出：
    - `curve-sketching` 经 `concavity` ← `higher-derivatives`；
    - `improper-integrals` 经 `fundamental-theorem` ← `antiderivatives`。
    - 两节的 goal 用到的渐近线、无穷区间都还在链上。
- 其余改动和转述一致：9 节的标题、goal 没动，文件头只加了 `minutes`、`summary`，`status` 改成 `written`；新加 9 个 `problems.yaml`、5 张 SVG；`_domain.yaml` 只加了 38 条术语，宏没动。

## 要修的，按小节分

- `limits-intuition`：第 7 题题干的「差商」「导数」括注英文（小 2）。
- `limit-laws`：「代入法」进术语表（小 2）；`:84` 图注（小 3）。
- `continuity`：
  - 第 8 题（1）的题面或提示、参考解答（重 2）；
  - 第 2 题选项 C、D（小 1）；
  - `:39` 补标「代入法」，`:51` 的反三角函数（小 2）。
- `limits-at-infinity`：`:38` 定理的道理（重 2）；第 1 题（小 1）；第 7 题提示的「斜渐近线」（小 2）。
- `special-limits`：`:45` 的有限和（重 2）；两个重要极限进表、括注英文，`:33` 的 $\arcsin x$（小 2）。
- `closed-interval-properties`：无。
- `infinitesimal-orders`：第 2 题选项 C 或「同阶无穷小」的简介（小 1）；`:55`、`:58` 补标，表里的 $\arcsin x$（小 2）；`:121` 图注（小 3）。
- `derivative`：切线的定义和简介（重 1）。
- `derivative-rules`：无。

## 需要你决定的

无。

## 我替你定的

1. **「有界」「有上界」当普通词用，不算链外术语，不标、不加前置**：
   - 出处：`limit-laws` 例 2（`:100`「在$\frac12$和$2$之间，有界」）、`infinitesimal-orders:27`（「无穷小乘有界的函数」，当场写了 $|g|\le M$）、`special-limits:45`、`:47`（「数列有上界」，当场写了 $a_n<3$）。
   - 「有界函数」要到 `closed-interval-properties` 才定义，「上界」是数学分析的术语（`math.analysis.upper-bound`），都不在这几节的链上。
   - 理由：这几处推理用的是当场写出的不等式，读者不需要看定义；为此加前置会把 `closed-interval-properties` 挪到 `limit-laws` 前面，打乱顺序。
   - `special-limits:47` 的「单调有界原理」照现在标数学分析的 id，链到证明。这合 sketch 引用分析定理的规矩（`plan.md:1158`）：条件写明，并说明这里满足。
2. **别的领域借用这一批的「导数」「可导」「切线」，按中学基础词不补标**：
   - 规矩 C 反方向扫出的正文（`lesson.md`）里，这类词有 7 行：`analysis.extreme-value:110`（「导数」「可导」）、`analysis.uniform-continuity:124`，线性代数 `kernel-image:31`、`:50`、`:87`、`:99`，`similarity:85`。中学选择性必修学过导数和切线。
   - 本领域照样重新定义、进表，因为这里要讲清极限的定义。
3. **`limits-intuition` 第 2 题的五个选项不算照搬**：它们都是讲解里讲过的道理换成具体的数（「极限和 $f(a)$ 无关」「两侧极限都存在且相等」等），不是判过的具体函数。按批次 5 的例外，「同一类、要多想一步」。
4. **`special-limits` 第 5 题（1）和讲解 `:59` 的论证几乎一样，不算重复**：讲解给的是「道理」，难题要求写成完整证明，（2）是新的。
5. **`closed-interval-properties` 最值定理的「道理」（`:39`）和数学分析 `extreme-value` 的证明是同一个论证**：都是「取一串点，挑出一部分挤向一点，那一点还在区间里，再用连续」，所以 `:41` 说「严格的证明见……」、「在圆周、闭矩形这类集合上照样成立」都站得住。多变量微积分 `multivariable-limits:49` 和常微分方程 `lyapunov-stability` 第 5 题「道理一样」的链接也就指对了地方（`plan.md:1156`）。

## 要写回 plan.md 的

1. **「题目与判题」`plan.md:302`，「常见误区也一样：要在最自然的理解下确实不成立」后面补一句**：「按本节自己的定义判断。定义只管一种情形时（例如切线只对可导的点下定义），讲解、例题、常见误区不要说另一种情形下也有；要说，先把定义扩充（批次 17 审查时提的：单变量微积分 `derivative` 的「导数不存在，就没有切线」按定义其实是对的）。」
2. **「每节固定结构 / 讲解」`plan.md:227`，「选择题的选项也不要照搬讲解、例题里已经判过的例子」后面补一句**：「术语表简介里举的例子也算判过的，读讲解时点开浮窗就看得到（批次 17 审查时提的：单变量微积分 `infinitesimal-orders` 第 2 题选项 $\tan2x$ 正是「同阶无穷小」简介的例子；`continuity` 第 2 题的 $\frac1x$、$\lfloor x\rfloor$ 讲解和简介里都判过）。」
3. **「术语规范」`plan.md:245`，「别的领域术语表里中学就学过的基础词」的例子里加上**：「单变量微积分的导数、可导、切线这类」（批次 17 审查时定的，见上面「我替你定的」2）。

## 下游和前向链接

- **以这一批为直接前置的已写小节**（5 节都已审）：都接得住，它们用到的这一批概念都在自己的链上。
  - 数学分析 `sequences-limits:16`（$1,\frac12,\frac13,\dots$ 趋于 $0$）：`limits-at-infinity:16`、`:42`、`:47` 讲了数列在 $n\to\infty$ 时的极限，「$1,\frac12,\frac13,\dots$ 收敛于 $0$」原样出现。
  - 数学分析 `continuity:16`、`:31`：`continuity:23` 按 $\lim_{x\to a}f(x)=f(a)$ 定义连续，`:63` 给「间断点」起了名。`analysis.continuity:31` 括注了英文，按规矩 C 链上的词不标，合规。
  - 数学分析 `intermediate-value:16`：`closed-interval-properties:16` 的引入、`:48`–`:53` 的介值定理和零点定理就是那幅「从横轴下方走到上方」的图。
  - 数学分析 `extreme-value:16`：`closed-interval-properties:37`–`:43` 讲了闭区间取得到最值、开区间可以取不到。反例用的是 $(-1,1)$ 上的 $x^2$、$\bigl(-\frac\pi2,\frac\pi2\bigr)$ 上的 $\tan x$、$[0,1]$ 上的 $x-\lfloor x\rfloor$，没撞上那边的 $(0,1]$ 上的 $\frac1x$ 和 $[0,1)$ 上的 $x$。
  - 多变量微积分 `multivariable-limits` ← `continuity`；它 `:49` 链到 `closed-interval-properties`「道理和闭区间上的连续函数一样」，见「我替你定的」5。
- **别处链过来的**：
  - 常微分方程 `lyapunov-stability` 第 5 题（圆周上的连续函数取得到最小值）：`closed-interval-properties:41` 明说这个道理在圆周上照样成立。
  - 数学分析 `function-limits:16`（$\frac{x^2-1}{x-1}$ 在 $1$ 处没定义、却趋于 $2$，从图像和数值表看出）：正是 `limits-intuition:16`–`:30` 的例子。
- **这一批指向大纲小节的链接**（页面上显示「待写」）：
  - `elementary-derivatives`：`special-limits:68`、`derivative-rules:58`、`special-limits` 第 7 题；
  - `taylor-polynomial`：`infinitesimal-orders:76`；
  - `mean-value-theorem`：`derivative` 第 6 题参考解答。
  - 提前提到的本领域术语都标了、括注了英文，推理没用到它们：`limits-intuition:61` 的「连续」、`special-limits:68` 的「导数」。
- **以这一批为前置、还没写的别的小节**：没有（和 `plan.md:1140` 一致）。

## 怎么审的

- **读题与验算**：
  - 用 `npm run statements -- <9 节> --tier easy,medium` 读题，没打开 `problems.yaml`。每节写一个脚本 `tools/verify/math.calculus.<小节>.ts`，共用辅助文件 `tools/verify/math.calculus._calc.ts`（单侧极限、无穷远处的极限、数列极限、按定义求导）。
  - 极限的算法：在越来越小的环形邻域 $[\delta/10,\delta]$（$\delta=10^{-2},10^{-3},10^{-4}$）里取格点看振幅，判断极限存不存在、是不是无穷大；存在时在 $h=h_0/2^k$ 处取值，用理查森外推求精确值。脚本都按原式算，不先约分、不用等价替换。导数按差商的定义外推。
  - 判断真假的选择题，在检验例子上逐条找反例，例子写在 `notes` 里：`limits-intuition` 第 2 题五个选项共用了 17 个检验函数（C 是 3 对），包括 $x+3+\sin\frac{10\pi}{2-x}$ 这种在三个给定点上对得上、左极限却不存在的。
  - 「能断定」「最小值和最大值」这类题，按 `plan.md:1153` 的做法验算：先算出界，再拿满足全部条件的具体例子核对取得到。`closed-interval-properties` 第 3 题用了 4 个检验函数，第 4 题用 60 万个格点。
  - `limits-intuition` 第 4 题要「保留三位小数」：脚本先确认 $\pm0.001$ 处的两个值夹住极限、四舍五入到三位小数相同，再和标准答案 $\ln2$ 比对；题目写了 `tolerance: {abs: 5e-4}`，接得住 $0.693$。
  - 36 道全部一致。
- **全量检查**：
  - `npm run content`：0 个错误、0 个警告；
  - `npx tsc -b`：通过；
  - `npm test`：23 个测试文件、202 个测试通过；
  - `npm run verify`：全部一致（264 个小节）。
- **难题、思考题**：36 道全部读过，不只是抽查。逐步核对了推导和数，包括：
  - `special-limits` 第 6 题的韦达公式；
  - `derivative-rules` 第 6 题的 $f'(1)=-99!$ 和第 8 题（2）的 $f'=\frac{(x-r)(P'R-PR')-mPR}{(x-r)^{m+1}R^2}$；
  - `infinitesimal-orders` 第 5 题（2）的反例。
  - 提示末尾的数和标准答案逐个对过。
- **术语**：
  - 38 条简介：长度由构建查，只用定义它那一节链上的概念（人工逐条看）。锚点都落在真正下定义的那一段，也都以句号结束。
  - 9 节每个二级、三级标题块里第一次出现的术语都标了。每节第一次出现都括注了英文，除了小问题 2 那几处。
  - 粗体标签里的术语（「极限的四则运算法则」「夹逼定理」「最值定理」等）标在标签里。
  - 一节里有几个起名的段落都加了锚点，比如 `continuity:30` 的左连续、右连续，`derivative:43` 的左导数、右导数，`closed-interval-properties:60` 的二分法。按脚本扫，正文里不在锚点段里的起名只有三处：`limits-intuition:18`（「这一节要回答的问题」里的预告），`limits-at-infinity:47`（记号），`special-limits:47`（数学分析的定理，标了那边的 id）。
- **前置**：
  - 沿每节的整条链人工核对讲解、例题和题目文字。`special-limits`、`infinitesimal-orders`、`derivative`、`derivative-rules` 我原先怀疑用到链外概念（复合函数的极限、$\ln$、$e^x$ 的连续性、链式法则、洛必达、泰勒），逐处看过：前置改过以后都在链上，没有用链外的推理。
  - 层级用脚本算过（见「改了没报的」）。
- **规矩 C 两个方向**（脚本在 scratchpad）：
  - 正方向：在 9 节正文和题目里找别的领域术语表里的词。只有「上界」（`math.analysis.upper-bound`）这一个真正的链外术语，处理见「我替你定的」1。其余是中学基础词（正弦、长度、平行、自然对数），或者只在标题、goal、题目文字里（「函数的极限」「连续函数」「保号性」「可导函数」）。
  - 反方向：在别的领域已写、已审的小节里，找链外用到这 38 个新术语的地方，共 46 处。都不用补标：
    - 大多在题目文字里，可标可不标；
    - 或者在 goal、标题里；
    - 或者意思不同：「连续作用三次」「连续时间」，`vector-calculus.differentiability:39` 和 `analytical-mechanics.virtual-work:25` 的「无穷小改变」说的是物理的微小量，不是「趋于零的函数」，后者还是批次 1 写的；
    - 或者是中学学过的「导数」，见「我替你定的」2。
- **格式**（脚本）：
  - 每段不超过 4 句，题目文字也查了；
  - 引号都是「」，没有「比……大 N 倍」，正文没写「上一节」「下一节」；
  - 正文和题目里的「例 N」「第 N 题」「几何图像」引文共 26 处（不算例题自己的标题），逐个对过，都指对了。包括跨节的：`infinitesimal-orders:71` 和第 5、6 题指 `special-limits` 例 1，`derivative-rules:58` 指 `derivative` 例 1，`continuity` 第 7 题参考解答指 `limit-laws` 第 8 题。
- **页面检查**：
  - 在 scratchpad 用 `npx vite build --outDir` 建了一份网站，没碰仓库的 `dist/`。用一个小脚本起服务（`buildServer`，网站读那份构建，进度写 scratchpad 里 `git init` 过的临时仓库）。为了能用浏览器面板的 `preview_start` 启动它，我在 `.claude/launch.json` 里加了一条 `test-serve-calculus-review`（端口 3149），复核后删掉。
  - 9 节在 768 像素宽下逐节看：难题、思考题点到第 3 级提示，简单题、中等题点「放弃，看解答」再点「确定放弃」，全部展开后页面宽度等于视口，没有横向滚动，KaTeX 的可见部分也没有超出。
  - 5 张 SVG 用 `getBBox()` 量了文字，用 `getTotalLength()`、`getPointAtLength()` 每 1 像素取点查压线：都不出界、不重叠、不压线。颜色只用 `currentColor` 和带默认值的页面变量。
  - 动画查了几个滑块极端值：`limit-laws` $p=0$，`limits-at-infinity` $a=3$、$a=-2$，`derivative` $a=1.5$、$h=0.95$，`infinitesimal-orders` $k=2$。说的现象都在画面里；函数先着色、数列后着色，和图注说的颜色一致。没有控制台报错。
  - 看完删掉了网站副本（147 MB），服务已停。`git status progress/` 只有原来就有的 ` M progress/lessons.yaml`，文件修改时间是 2026-11-12，我没碰。

## 各节

- **`limits-intuition`**：
  - 从 $\frac{x^2-1}{x-1}$ 的数值表引入。极限、单侧极限、无穷大三个定义都有「为什么」和边界情况。例 2「数值表会骗人」挑点挑得好（$x=\frac1{10^k}$ 时 $\sin\frac\pi x$ 恰好都是 0），第 8 题又换了一种骗法。
  - 动画在 $c=\pm1$ 两端，右边一段都在画面里（$y$ 从 $0$ 到 $4$）。
  - 只有小问题 2 的一处。
- **`limit-laws`**：
  - 四则运算法则的道理和第 5 题配合得好。代入法把开方也包了进来，所以后面 `limits-at-infinity` 不用 `continuity` 也能处理根式。
  - 例 2 的夹逼不平凡，第 6 题 $x\lfloor\frac1x\rfloor$ 两侧分别夹也对。
- **`continuity`**：
  - 连续、间断点的定义和数学分析接上了。复合函数极限的定理写全了「$g(x)\ne b$」的条件，并有反例。
  - 初等函数连续性写明「这里不证」，链到数学分析两节。
  - 「间断点」的定义包括 $f(a)$ 没有定义的点，所以第 4 题答 3 个间断点，和定义一致。
- **`limits-at-infinity`**：数列极限和 $x\to+\infty$ 的关系、反过来不成立的反例（$\sin\pi n$）都讲到了，第 8 题又追问了一遍。动画在 $a=-1$ 时竖直渐近线消失，和图注一致。
- **`special-limits`**：
  - 两个极限都按 sketch 讲清了为什么成立：单位圆夹逼，单调有界加二项式展开，单调有界原理链到数学分析。
  - 把 $n$ 换成实数 $x$ 的夹逼，和第二个动画的上下两串点对得上。
- **`closed-interval-properties`**：
  - 最值定理的「道理」只用三件事，正好支撑下游两处「道理一样」。
  - 二分法的表 4 步都算过，$f(0.6875)=0.01245$ 对。
  - 例 2「上山下山」用零点定理，用得自然。
  - 没有要修的。
- **`infinitesimal-orders`**：
  - 等价无穷小的表每行都给了理由。「加减里不能换」用前一节的例 1 当反例，第 5 题又给出了能换的条件（$c\ne-1$）。
  - $o$ 记号「等号只能从左往右读」讲清了。
- **`derivative`**：
  - 从下落物体的平均速度引入。差商、导数、切线、导函数的定义链条清楚，「可导必连续」的反向反例给了两个。
  - 动画 $h$ 的格点是 $\pm0.05,\pm0.15,\dots$，取不到 $0$，和图注一致。
- **`derivative-rules`**：
  - 乘积法则的「减去再加上」、商法则先求 $\frac1v$ 都写清了，第 7 题指出「设 $q=\frac uv$ 再求导」的循环论证。
  - 整数次幂的推广和 `derivative` 例 1 的 $(\sqrt x)'$ 一致。
  - 没有要修的。

## 没验证的地方

- 只看了浏览器面板的暗色主题；亮色主题没截图。SVG 只用 `currentColor` 和带默认值的变量，按理两种主题都看得清。
- 768 像素是模拟的视口，没有在真的 iPad 上看。
- 动画只查了上面列的几个滑块端点；其余端点按表达式手算，现象应在画面内（如 `limits-intuition` $c=\pm1$、`derivative` $a=-1.5$、$h=-0.95$），没逐个截图。
- 难题、思考题是人工核对，没有写脚本验算。
- 「现行高中课标不讲反三角函数」是我的判断（小问题 2 的依据）；你要是学过，那一条可以不改。

## 修订说明（写内容会话）

重要 2 条、小问题 3 条都修了，小问题全部照改，没有不改的。同类问题按要求在 9 节里整批找过，多改了 4 处，写在各条的「同类」里。只改了 `content/math/calculus/` 的文件，9 节的 `status` 没动，仍是 `written`。改了题的几道（`continuity` 第 2 题，`limits-at-infinity` 第 1、4 题，`derivative-rules` 第 2 题），先查过 `progress/`：里面没有 `math.calculus` 的任何记录，不算改号，不用迁移脚本。

### 重要 1：`derivative` 的切线定义扩充到竖直切线

- `derivative:53` 定义卡片末尾补了一句：「如果$f$在$a$处连续，并且$h\to0$时差商是无穷大（infinity），竖直线$x=a$也叫作曲线在$P$处的切线；$a$是区间的端点时只看一侧。」
  - 比报告的建议多了「$f$在$a$处连续」。不加的话，$\operatorname{sgn}x$ 在 $0$ 处（取 $f(0)=0$）的差商 $\frac1{|h|}$ 也是无穷大，跳跃处会冒出一条「切线」。
  - 「连续」「无穷大」是这一块第一次出现，标了；「无穷大」也是这一节第一次出现，英文括注从 `:57` 挪到这里。
- `:55`「为什么这样定义」补一句：定义的后一句是同一个道理，差商是无穷大说明割线越来越陡，极限位置是竖直线。这一段现在 4 句。
- `:57` 改成「按定义的后一句，曲线在原点的切线是竖直线$x=0$，它没有斜率」。例 1（`:121`）、常见误区（`:142`）的原文不用改，现在都和定义接上了。
- 术语表「切线」的简介改成「过$(a,f(a))$、斜率为$f'(a)$的直线$y=f(a)+f'(a)(x-a)$；$f$连续而差商是无穷大时，切线是竖直线$x=a$。」
- 第 7 题（3）：$|x|$ 在原点两侧的差商是 $\pm1$，不是无穷大，照样没有切线，题和提示不用改。
- 同类（定义只管一种情形，后文说了另一种）：9 节的定义和后文逐处对过，找出一处。
  - `limits-intuition:70` 原来写「$\frac1x$在$0$处的右极限是$+\infty$、左极限是$-\infty$」。可右极限按定义是一个数，$+\infty$ 只是 `def-infinity` 的记号。
  - 改成记号写法：「$\lim_{x\to0^+}\frac1x=+\infty$，$\lim_{x\to0^-}\frac1x=-\infty$，两侧的符号不同，所以只能写……」。
  - 别处说「差商是无穷大」「$x\to a^+$ 时 $f(x)$ 是无穷大」，用的都是 `def-infinity` 的说法，不用改。

### 重要 2：三处按字面读不对的说法

- `limits-at-infinity:38` 有理函数那条定理的「道理」分两种情形：
  - $m\le k$ 时同除以 $x^k$，分母趋于 $b_k$，分子趋于 $0$（$m<k$）或 $a_m$（$m=k$）；
  - $m>k$ 时同除以 $x^m$，分子趋于 $a_m\ne0$、分母趋于 $0$，由 `limit-laws` 讲过的边界情况（链接到 `#def-zero-over-zero`），商是无穷大。
- `special-limits:41`–`:48`：
  - 上界改成有限和：「$k\ge1$时第$k$项不超过$\frac1{k!}\le\frac1{2^{k-1}}$，所以$a_n\le1+\bigl(1+\frac12+\cdots+\frac1{2^{n-1}}\bigr)=3-\frac1{2^{n-1}}<3$」。
  - 同类：上面的展开式原来以「$+\cdots$」结尾，也像无穷多项。改成两行的 aligned，写出最后一项 $\frac1{n!}\bigl(1-\frac1n\bigr)\cdots\bigl(1-\frac{n-1}n\bigr)$，一眼看出是有限和。768 像素宽下量过，放得下。
- `continuity` 第 8 题（1）按报告的第一种建议改：
  - 题面（`problems.yaml:156`）改成「只改$a$和它左边（$x\le a$）的函数值、右边不动呢？」；
  - 第 1 级提示改成「改$a$和它的左边，可以换掉左极限和$f(a)$」；
  - 第 3 级提示和参考解答写明「把左极限和$f(a)$都换成右极限」；
  - 参考解答（`:173`）另外加了报告给的反例，说明只改 $x<a$、不改 $f(a)$ 不够。
- 同类（「道理」、提示里按字面不成立的话）：9 节讲解里的「道理」「为什么」段，和 72 道题的提示、参考解答，又逐条读了一遍，没有再找出。

### 小问题 1：和讲解、术语表简介重复的选项与答案

- `continuity` 第 2 题：
  - C 换成 $\frac1{x^2-x}$，是无穷间断点；
  - D 换成 $\lfloor x\rfloor^2$，左极限 $1$、右极限 $0$，是跳跃；
  - 正确选项仍是 A、D，提示、解答跟着改了。
- 「同阶无穷小」简介的例子换成「$x\to2$时的$x^2-4$和$x-2$（比值趋于$4$）」，不再是 `infinitesimal-orders` 第 2 题的 $\tan2x$。
- `limits-at-infinity` 第 1 题分子改成 $9x^3$，答案 $\frac92$。这个数也不在动画滑块 $a\in[-2,3]$ 的范围里。
- 同类：
  - 36 道简单题、中等题的答案，和各节讲解、例题、动画里算出的数逐个比过，又找出两处。
    - `limits-at-infinity` 第 4 题原答案 $(-3,2,-2)$ 里的 $2$，和引入、例 1 算出的 $2$ 是同一个数。改成 $y=\frac{\sqrt{25x^2+1}}{x+4}$，答案 $(-4,5,-5)$。
    - `derivative-rules` 第 2 题原答案 $-\frac12$，和例 2 水平切线的切点 $\bigl(-1,-\frac12\bigr)$ 是同一个数。量不同，保险起见也改了：改成求 $f'(5)$，答案 $-\frac18$。
  - 术语表 41 条简介里的例子，和全部选择题选项逐个对过。
    - 跳跃间断点、无穷间断点简介里的 $\lfloor x\rfloor$、$\frac1x$，只在 `continuity` 第 2 题撞过，已经换掉。
    - 别的简介例子（$\frac1n\to0$、$\{(-1)^n\}$、$\sin x\sim x$、$1-\cos x$ 是二阶）要么只出现在讲解里，要么题目要多算一步（`infinitesimal-orders` 第 1、4 题），不算照搬。
  - 改过的 4 道题都用脚本重算过，和新答案一致。

### 小问题 2：名词进表、补英文括注、交代 $\arcsin x$

- 进术语表 3 条：
  - 「代入法」`math.calculus.direct-substitution`，定义在 `limit-laws#thm-substitution`；
  - 「第一个重要极限」`math.calculus.first-special-limit`，定义在 `special-limits#thm-sin-limit`，英文写成 limit of $\frac{\sin x}{x}$；
  - 「第二个重要极限」`math.calculus.second-special-limit`，定义在 `special-limits#thm-e-limit`，英文写成 limit defining $e$。
- 本领域补标，标的都是正文里每块第一次出现：
  - `limit-laws:36` 的定理标签、`:94` 例 1；
  - `continuity:39`，括注 direct substitution；
  - `special-limits:29`、`:60` 的定理标签（括注英文），`:128` 例 2，`:134` 常见误区；
  - `infinitesimal-orders:55`、`:58` 表格（括注英文）。
  - 题目文字里的「代入法」「第二个重要极限」照「可标可不标」，没标。
- 英文括注：
  - `limits-intuition` 第 7 题题干（`problems.yaml:139`）：「导数（derivative）」「差商（difference quotient）」；链接改成「（见[导数的定义]）」，不再拿标题当主语。
  - `limits-at-infinity` 第 7 题第 3 级提示（`:123`）：「斜渐近线（slant asymptote）」。
  - 同类：72 道题的题干、提示、选项、解答里第一次出现的新名词又查了一遍。补了 `special-limits` 第 6 题（3）的「无穷乘积（infinite product）」，并写明它就是（2）里 $n\to\infty$ 时的极限。
- $\arcsin x$：
  - `special-limits:33` 第一次出现处括注「$\sin x$在$\bigl[-\frac\pi2,\frac\pi2\bigr]$上的反函数」；
  - `continuity:51` 的「反三角函数」后面举 $\arcsin x$ 并说明；
  - `infinitesimal-orders:51` 表前补一句。同类：这一节也是第一次出现 $\arctan x$，这句一并交代了 $\arcsin x$ 和 $\arctan x$。
  - `limits-at-infinity:27` 原来就交代了 $\arctan x$。

### 小问题 3：两处图注

- `limit-laws:84` 改成「……夹不住了，夹逼定理什么也说不出；而中间的$\sin\frac1x$在$0$处本来就没有极限。」
- `infinitesimal-orders:121` 改成「只有$k=2$时比值趋于不为零的$\frac12$，曲线在原点附近贴向橙色水平线……」。
- 同类：8 个动画和 5 张 SVG 的说明逐句对过画面，没有别的不准的说法。

### 检查

- `npm run content`：0 个错误、0 个警告。
- `npm test`：23 个测试文件、202 个测试通过。
- 页面：
  - 用 `vite build --outDir` 把网站构建到 scratchpad，另起只读服务，进度写临时仓库，没碰仓库的 `dist/` 和 `progress/`；看完已删。
  - 768 像素宽下，9 节的提示和解答全部展开，都不左右滚动。
- 自查脚本：每块术语第一次出现是否标记、每节第一次出现是否括注英文、段落句数、中英文空格、锚点段是否以句号结尾，都清零。
- 前置没再改，层级和初审时一样。

## 复核

审内容 agent · 2026-11-15。和初审前拍的快照 `b17-snapshot/` 逐文件比对，只看这一轮的改动。

### 结论

没有需要修的。重要 2 条、小问题 3 条都改对了，写内容会话按「同类」多改的 7 处也都对。9 节都通过，`status` 已改成 `reviewed`（只改了这一行）。

### 逐条

- **重要 1（切线的定义）**：通过。
  - `derivative:53` 的定义卡片补了竖直切线，条件比我建议的多了「$f$在$a$处连续」。这一条加得对：取 $f(0)=0$ 的 $\operatorname{sgn}x$ 在 $0$ 处差商是 $\frac1{|h|}$，也是无穷大，不加的话跳跃点会冒出一条「切线」。
  - 「端点只看一侧」接住了例 1 的 $\sqrt x$。`:55` 补的一句说清了竖直切线也是割线的极限位置，这一段 4 句。`:57` 改成「按定义的后一句」。
  - 例 1（`:121`）、常见误区（`:142`）现在都和定义一致：$\sqrt[3]x$ 不可导却有竖直切线，所以「导数不存在，就没有切线」在本节的定义下确实是错的。第 7 题（3）$|x|$ 两侧差商是 $\pm1$，照样没有切线。
  - 术语表「切线」的简介同步改了，链上概念够用。
  - 同类 `limits-intuition:70`：改成 $\lim_{x\to0^\pm}\frac1x=\pm\infty$ 的记号写法，和「右极限是一个数」的定义一致。这一块原来标的左、右极限随原句删掉了，块里不再出现这两个词，不用补标。
- **重要 2（三处按字面读不对的说法）**：通过。
  - `limits-at-infinity:38`：分 $m\le k$、$m>k$ 两种情形，两种都对。链接 `limit-laws#def-zero-over-zero` 落在「$\frac00$型」的定义卡片上，引用的边界情况在紧接着的 `limit-laws:47`，读者顺着就看到了。
  - `special-limits:45`：$1+\bigl(1+\frac12+\cdots+\frac1{2^{n-1}}\bigr)=3-\frac1{2^{n-1}}$，对。同类改的两行展开式，最后一项 $\frac1{n!}\bigl(1-\frac1n\bigr)\cdots\bigl(1-\frac{n-1}n\bigr)$ 就是 $\frac1{n^n}$，对。768 像素宽下这个行间公式放得下，没有横向滚动。
  - `continuity` 第 8 题（1）：
    - 题面改成「只改$a$和它左边（$x\le a$）」，第 1、3 级提示和参考解答都写明要「把左极限和$f(a)$都换成右极限」，现在都成立；
    - 参考解答里加的反例也对；
    - 「右极限不存在或是无穷大时修不好」也对，因为右边不动。
- **小问题 1（重复的选项和答案）**：通过。
  - `continuity` 第 2 题：
    - 新选项 C $\frac1{x^2-x}$ 是无穷间断点，D $\lfloor x\rfloor^2$ 左极限 $1$、右极限 $0$ 是跳跃，答案仍是 A、D，脚本重算一致；
    - D 要先想到平方以后左极限变成 $1$，属于「多想一步」；
    - 跳跃间断点、无穷间断点简介里的 $\lfloor x\rfloor$、$\frac1x$ 现在不和任何选项撞。
  - 「同阶无穷小」简介的新例子：$x\to2$ 时 $\frac{x^2-4}{x-2}=x+2\to4$，对，也不和题目撞。
  - `limits-at-infinity` 第 1 题 $\frac92$、同类改的第 4 题 $(-4,5,-5)$、同类改的 `derivative-rules` 第 2 题 $-\frac18$：脚本重算一致；这几个数在讲解、例题、动画里都没出现。
- **小问题 2（名词）**：通过。
  - 新进表 3 条：「代入法」「第一个重要极限」「第二个重要极限」。锚点都在讲解的定理段，简介只用链上的概念，长度构建查过。英文名里写了公式（limit of $\frac{\sin x}{x}$），方案允许术语表字段写行内公式（`plan.md:271`），构建也校验过。
  - 每块第一次出现都标了：
    - `limit-laws:36`（定理标签）、`:94`（例 1）；
    - `continuity:39`；
    - `special-limits:29`、`:60`（定理标签）、`:128`（例 2）、`:134`（常见误区）；
    - `infinitesimal-orders:55`、`:58`（表格）。
    - 按块逐个查过，没有漏标的块。
  - 英文括注：`continuity:39`、两个定理标签、`infinitesimal-orders` 表里都有；`limits-intuition` 第 7 题、`limits-at-infinity` 第 7 题第 3 级提示也补了。同类补的 `special-limits` 第 6 题（3）「无穷乘积（infinite product）」也对，还写明它就是（2）的极限。
  - $\arcsin x$：`special-limits:33`、`continuity:51`、`infinitesimal-orders:51` 都当场交代了，后者连 $\arctan x$ 一起交代了。
- **小问题 3（两处图注）**：通过。`limit-laws:84` 不再暗示「夹不住所以没有极限」；`infinitesimal-orders:121` 改成「在原点附近贴向」，和画面一致。

### 改了没报的

无。和快照比，这一轮改了 13 个文件，都写进了修订说明：

- `_domain.yaml`：新进表 3 条，「同阶无穷小」「切线」的简介；
- 正文 7 节：`limits-intuition`、`limit-laws`、`continuity`、`limits-at-infinity`、`special-limits`、`infinitesimal-orders`、`derivative`；
- 题目 5 节：`limits-intuition` 第 7 题，`continuity` 第 2、8 题，`limits-at-infinity` 第 1、4、7 题，`special-limits` 第 6 题，`derivative-rules` 第 2 题。

`closed-interval-properties`、5 张 SVG、两节大纲都没动。修订说明里说的「术语表 41 条」是对的：初审时是 38 条，加 3 条。

### 怎么核的

- **比对**：用 `diff -ru` 把 `content/math/calculus/` 和快照逐文件比，逐处对照修订说明。
- **验算**：
  - 改过答案、选项的 4 道简单题、中等题，用 `npm run statements` 重新读题，没打开 `problems.yaml`；
  - 照新题面改了 3 个脚本（`continuity` 第 2 题的选项函数，`limits-at-infinity` 第 1、4 题，`derivative-rules` 第 2 题），4 道都一致。
- **全量检查**：
  - `npm run content`：0 个错误、0 个警告；
  - `npx tsc -b`：通过；
  - `npm test`：23 个测试文件、202 个测试通过；
  - `npm run verify`：全部一致（264 个小节）。
- **术语与格式**：
  - 3 个新术语在 9 节正文里逐块查了标记；
  - 段落句数脚本重跑，没有超过 4 句的；
  - 用初审的反方向扫描脚本查了 3 个新术语，别的领域没有链外用到的地方，和协调会话的结论一致。
- **页面**：
  - 重新用 `vite build --outDir` 把网站建到 scratchpad，起只读服务，进度写临时仓库。
  - 9 节在 768 像素宽下，8 道题的第 3 级提示和简单题、中等题的解答都显示着，页面宽度等于视口，没有元素超出。
  - 专门看了 `special-limits` 的两行展开式、`infinitesimal-orders` 的表格（带英文括注后表宽 721 像素，正好等于正文栏宽）和 `derivative` 的切线定义卡片。
  - 看完删了网站副本，服务已停；`progress/` 没动。

### 初审报告的更正

初审写的「术语表从空表加到 39 条」是我数错了，实际是 38 条。前文 4 处（审查范围、「改了没报的」、「怎么审的」两处）已经改成 38。

### 要写回 plan.md 的

初审的 3 条仍然有效。第 1 条（`plan.md:302`，常见误区要按本节自己的定义判断）建议再带上这一轮的两个例子：

- 扩充定义时，查一遍会不会把不该算的情形也算进去。例如竖直切线要加「$f$在$a$处连续」，否则跳跃点的差商也是无穷大（批次 17 修订时写内容会话提的：取 $f(0)=0$ 的 $\operatorname{sgn}x$）。
- 极限按定义是一个数，趋于无穷大时写成记号 $\lim f=+\infty$，不说「右极限是 $+\infty$」（批次 17 修订时写内容会话改的 `limits-intuition:70`）。

### 剩下的

- 没有没通过的小节。
- 收尾已做：
  - scratchpad 里的快照 `b17-snapshot/`、网站副本、临时进度仓库已删；
  - `.claude/launch.json` 里我为看页面加的 `test-serve-calculus-review` 已删。
- 提交由写内容会话做：这份报告、9 节的 `status`、`tools/verify/math.calculus.*` 的 10 个脚本，随这一批一起提交。

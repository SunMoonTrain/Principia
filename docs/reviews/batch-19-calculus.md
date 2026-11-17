# 批次 19 审查报告：单变量微积分（定积分、导数的应用与泰勒公式）

审内容 agent（和写内容 agent 是两个独立会话，没有读它的会话记录、交接说明和自查脚本；它给协调会话的汇报是审完以后才读的，只用来核对「改了没报的」）· 2026-11-17

审查范围：`math.calculus` 的第三批 11 节：`definite-integral`、`integral-properties`（新）、`fundamental-theorem`、`lhopital`、`monotonicity`、`concavity`、`optimization`、`curve-sketching`、`taylor-polynomial`、`taylor-limits`（新）、`taylor-remainder`。包括：

- 11 节的文件头、正文、`problems.yaml`（88 道题）、11 个 `function-plot` 动画；
- `_domain.yaml`：新进表 25 条，术语表从 69 条到 94 条；
- 退回 written 的两节本领域补标：`antiderivatives:41`（微积分基本定理）、`infinitesimal-orders:76`（泰勒公式）。

另外看了：

- 以这一批为前置、或链接到这一批的已写小节和别处的用法；
- 牛顿力学 `momentum-impulse`、`work-energy`、`energy-diagrams` 用到这一批的记号；
- 规矩 C 两个方向的扫描。

开审前把这 13 节的目录和 `_domain.yaml` 拷了一份快照到我的 scratchpad（`b19-snapshot/`），复核时和它比。跨领域的 3 个文件（光学 `fermat-principle`、常微分方程 `numerical-methods`、数学分析 `weierstrass-approximation`）写内容会话还在改，不在快照里，等协调会话通知后另行复核；这里只在「跨领域的几处」记下现状和意见。

## 结论

重要 2 条，小问题 3 条，原有问题 1 条（在常微分方程 `numerical-methods`，不在这一批的小节里）。

- 讲解、例题的推导和数，除重要 1 那一处定义外都对。44 道简单题、中等题独立验算，全部和标准答案一致；44 道难题、思考题逐道读过，参考解答都对。
- 前置：这一批加的 4 处前置都真用到了（见「细节 / 前置与层级」），都是最少的直接前置。对 7347983 算全图层级，已有小节 0 处变化，两节新节是第 4、9 层。
- 篇幅：11 节的 `minutes` 在 26–28；讲解加例题 552–1111 个汉字，和批次 18 那几节（656–985 字，24–28 分钟）相当，都不超过 30。
- 11 个动画都正常，滑块两端都看过；13 节（含两节补标）在 768 像素宽下全部展开，都没有横向滚动，题目卡片里也没有要左右拖的公式。
- 下游的用法都接得住：`riemann-integral:16`、`inner-product-spaces:38`、`ftc-proof:16`、`double-integrals:32`、`linear-first-order:41`、`legendre-transform:22`、`inverse-implicit` 第 8 题、`taylor-multivariable:27`、`extrema:32`、`electric-dipole:36`，以及本领域 `antiderivatives:41` 和第 8 题、`local-extrema:45`、`higher-derivatives:27`。牛顿力学三节的记号和这边一致。

- **重要 1：拐点的定义把直线上的点也算进去了**（`concavity:41`）
  - `:25` 的凸、凹用不严格的不等号，一次函数「既凸又凹」（`:27` 写了）。`:41` 说「一侧附近 $f$ 凸、另一侧附近 $f$ 凹」就是拐点，于是：
    - $f(x)=x$ 上每一点都是拐点：两侧都既凸又凹；
    - $x\le0$ 时取 $0$、$x>0$ 时取 $x^3$ 的函数，$(-1,0)$ 也成了拐点。
  - 这和同一节 `:43`「拐点是曲线弯的方向改变的地方，切线在那里从曲线的一侧穿到另一侧」矛盾，也和术语表简介「凹凸改变的点」不符。`plan.md:302`：定义扩充时，查一遍会不会把不该算的也算进去。
  - 改法：写成「一侧附近 $f$ 严格凸、另一侧附近严格凹」。这样 `:43` 的 $\sin x$、`:45` 的 $x^4$ 和 $x|x|$、例 1、几何图像、第 1、3 题，以及 `curve-sketching` 例 1、例 2 和第 5 题的结论都不用动：它们两侧都是 $f''$ 一正一负，本来就是严格的。
- **重要 2：`integral-properties` 第 4 题问两个数，只有一个填空框**
  - 题干（`problems.yaml:55`）：「求 $f(x)=x^2$ 在 $[0,3]$ 上的平均值，并求积分中值定理里的 $\xi$。」作答方式是「填一个数」，标准答案是 $\sqrt3$（$\xi$）。
  - 两个要求的都是数。读者填平均值 $3$ 会被判错，可它正是题目要的一项。
  - 改法任选一个：
    - 答案改成 tuple $(3,\sqrt3)$，题干写「依次填平均值和 $\xi$」；
    - 题干只问 $\xi$，平均值放进提示。
  - `curve-sketching` 第 4 题（「并写出它的渐近线」）、`monotonicity` 第 4 题（「并判断……」）也多问了一项，可那一项不是数，不影响判分，可以不改。
- **小问题 1：术语进表、标记和括注的几处遗漏**（`plan.md:242`、`:244`、`:246`）
  - **两节以上用到、没进表的名词**（`:244`「两节以上用到的名词就进术语表」，定理名同样按这一条）：
    - 曲边梯形：`definite-integral:23` 起名，`integral-properties:60` 又用；
    - 区间可加性：`integral-properties:35` 是定理名，`fundamental-theorem:36` 又用（第 3 题解答也用）；
    - 积分变量：`definite-integral:45` 起名，`fundamental-theorem:27`、`:126` 又用。
    - 进表后在后一节第一次出现处标记。积分变量要是认作和「积分号」一样的基础词，至少补上英文括注（见下一条）。
  - **没进表的名词，第一次出现没括注英文**（`:242`）：
    - `definite-integral:45` 同一句里，积分下限、积分上限括了英文，积分区间、积分变量没括；
    - `integral-properties:30`、`:35`、`:44` 的定理名「线性」「区间可加性」「保序性」没括注英文。照批次 18 `implicit-differentiation:43` 的改法，写成「定理（区间可加性，additivity over intervals）」这样。
  - **别名没标**：`optimization:85`「由乘积的求导法则和链式法则」，「乘积的求导法则」就是术语「乘积法则」，这一块第一次出现，没标、没括注；别的小节都写「乘积法则」（`chain-rule:65`、`elementary-derivatives:65`）。改成 `:term[乘积法则]{id="math.calculus.product-rule"}（product rule）`。
  - **术语表简介用了链外的概念**：`_domain.yaml:855` 的「泰勒公式」简介写「余项写成佩亚诺余项或拉格朗日余项」。拉格朗日余项在 `taylor-remainder`（第 9 层）才定义，不在 `taylor-polynomial` 的链上（`:244` 末句：简介只用定义它的那一节链上的概念）。改成只说佩亚诺余项，或「余项有几种写法，如佩亚诺余项」。
  - **跨领域少补一处**（`:246`，规矩 C 反方向）：常微分方程 `linear-first-order:41`（批次 6 写的）「这由[微积分基本定理](…)（fundamental theorem of calculus）保证」，链接文字在句子里当名词用，它的链上没有 `fundamental-theorem`。按 `:244`「术语只出现在链接文字里……在链接前面把这个词写出来再标」补标 `math.calculus.fundamental-theorem-of-calculus`。写内容会话现在补标的 3 个文件里没有它。
- **小问题 2：一处锚点指错，三道选择题的解答不用字母称呼选项**
  - `fundamental-theorem` 第 8 题第 2 级提示（`problems.yaml:157`）：引的是「导数处处为零的函数是常数」，这是推论 1（`mean-value-theorem#thm-zero-derivative`），链接却指 `#thm-same-derivative`（推论 2）。改锚点。
  - 页面上选项标的是 A–D，这三道的解答却按序号或位置称呼：
    - `monotonicity` 第 3 题（`problems.yaml:60`）：「（1）……（4）……」；
    - `curve-sketching` 第 3 题（`problems.yaml:60`）：「第三个说法不对」；
    - `taylor-remainder` 第 1 题（`problems.yaml:26`）：「最后一个选项……第三个是 $R_1$ 的写法」。
    - 照 `local-extrema` 第 2 题的写法，改成「A：……D：……」「C 不对」。
- **小问题 3：`integral-properties` 几何图像的说明，把平均值变小归因于负面积**
  - `:90`：「$b$ 大于 $1+\sqrt3$ 以后曲线有一段在 $x$ 轴下方，那部分面积算负的，平均值跟着变小。」
  - 平均值 $1+\frac b2-\frac{b^2}6$ 在 $b=1.5$ 处就最大，之后一直变小。拖到 $b=2$ 时曲线还全在 $x$ 轴上方，橙色线段已经在往下走。真正的原因是新加进来的函数值 $f(b)$ 比当前的平均值小。
  - 改法：例如「$b>1.5$ 以后，右端新加进来的函数值比当前的平均值小，平均值开始变小；$b>1+\sqrt3$ 以后还有一段在 $x$ 轴下方，算负的」。
- **原有问题：`numerical-methods:89` 的 $O\bigl(\frac1{N^2}\bigr)$ 和 `taylor-polynomial:65` 接不上**
  - `numerical-methods:89`（批次 6）：「由泰勒公式，$N\ln\bigl(1+\frac1N\bigr)=1-\frac1{2N}+O\bigl(\frac1{N^2}\bigr)$」，后面也用 $O$。大 $O$ 记号在它的链上没有定义（全站只有这里和 `fourier-convergence:53` 用）。
  - 这一批 `taylor-polynomial:65` 照协调会话的要求接住这一处，给的是 $1-\frac1{2N}+o\bigl(\frac1N\bigr)$，比 `:89` 写的弱。读者顺着链接过去，对不上。
  - `:89` 的结论「整体误差约为 $\frac e2h$」只要 $o\bigl(\frac1N\bigr)$ 就够。建议趁写内容会话正在改 `numerical-methods`，把 `:89` 的两处 $O(\cdot)$ 改成 $o\bigl(\frac1N\bigr)$，即 $y_N=e-\frac e{2N}+o\bigl(\frac1N\bigr)$。不改 `taylor-polynomial`。

## 改了没报的

和写内容会话的汇报、协调会话的转述对过。本领域只有一处改了没报，是别的会话改的：

- **`hyperbolic-functions:55`**（批次 18，`reviewed`，不在这次的范围里）：「终端速度」标成了牛顿力学的 `physics.newtonian-mechanics.terminal-velocity`，`status` 没动。
  - 写内容会话的汇报里没有这一处，看来是牛顿力学那边扫规矩 C 时补的。
  - 批次 18 定过（`plan.md:1218`）：悬链线、终端速度在这里只加锚点、不进表，由变分法、牛顿力学各自定义。`:54` 的 `def-terminal-velocity` 就是本领域自己起名的那一段，`plan.md:245`：同一个概念两个领域都讲时各标自己的 id，规矩 C 只管借用。同一节 `:50` 的「悬链线」也没标变分法的 id，现在两处做法不一致。
  - 建议撤回这一处标记，恢复成「终端速度（terminal velocity）」。要保留的话，按 `plan.md:246` 退回 `written` 随这一批复核，并把 `:50` 的悬链线也照样标上。
- 常微分方程 `lyapunov-stability:25` 的「稳定平衡点」也标成了牛顿力学的 id，同样不在任何一份汇报里。它不在我的领域，只记一句。

其余和汇报一致：

- 11 节：正文、题目，文件头加 `minutes`、`summary`，`status` 改成 `written`；`definite-integral`、`taylor-polynomial` 的 goal 改了，两节新节新建。
- 前置 4 处：`definite-integral` 加 `limits-at-infinity`，`fundamental-theorem` 定为 `[integral-properties, antiderivatives, chain-rule]`，`lhopital`、`optimization` 各加 `chain-rule`。
- `antiderivatives`、`infinitesimal-orders` 各只改了一处补标，加上 `status` 退回 `written`。
- `_domain.yaml` 只加了 25 条术语，原有条目和宏没动。

## 要修的，按小节分

- `concavity`：`:41` 拐点的定义（重 1）。
- `integral-properties`：第 4 题（重 2）；`:30`、`:35`、`:44` 定理名括注英文，`:60` 曲边梯形随进表补标（小 1）；`:90` 几何图像的说明（小 3）。
- `definite-integral`：`:45` 积分区间、积分变量括注英文；曲边梯形、积分变量进表（小 1）。
- `fundamental-theorem`：`:27`、`:36` 积分变量、区间可加性随进表补标（小 1）；第 8 题第 2 级提示的锚点（小 2）。
- `optimization`：`:85` 乘积法则（小 1）。
- `monotonicity`、`curve-sketching`、`taylor-remainder`：各一道选择题的解答（小 2）。
- `_domain.yaml`：泰勒公式的简介（小 1）；进表的话加曲边梯形、区间可加性、积分变量三条。
- `lhopital`、`taylor-polynomial`、`taylor-limits`、`antiderivatives`、`infinitesimal-orders`：无。
- 别的领域：`linear-first-order:41` 补标（小 1）；`numerical-methods:89`（原有问题）；`hyperbolic-functions:55`（改了没报的）。

## 需要你决定的

无。

## 我替你定的

1. **「递增」「单调」「单调区间」按中学基础词，只加锚点、不进表，接受**：
   - 这里的「递增」是不严格的，和中学的「单调递增」不同，`monotonicity:27` 写明了「中学课本的单调递增就是这里的严格递增」。
   - 后面用到的地方意思都对得上：`concavity:34` 的「$f'$ 递增」要的就是不严格的，`special-limits:48` 的「数列递增」是严格的，严格的也满足不严格的定义。
2. **`definite-integral` 标了「被积函数」，定义在 `antiderivatives`（第 7 层），接受**：
   - `:45` 当场说了「$f(x)$ 是被积函数」，不靠浮窗也读得懂；按 `plan.md` 的「本领域后面小节的术语可以提前提到」。
   - 浮窗简介里的「要求原函数的那个函数」第 3 层的读者看不懂，按批次 7 定的「前面的小节提前提到时看不懂简介里的记号不算问题」，不改。
3. **这一批加的 `chain-rule` 前置都留着**：
   - `fundamental-theorem`：`:42` 上限是函数时求导、例 1、`:124` 的误区都用；
   - `optimization`：例 2 `:85` 写明「由……链式法则」；
   - `lhopital`：正文只在几何图像 `:85` 用到 $\ln(1+2x)$ 在 $0$ 处的导数是 $2$，第 4、5 题的提示明说用链式法则。
   - 三处层级都不变。`lhopital` 那一处也可以改成去掉前置、在第 4、5 题提示里加链接，两种都合规，按写内容会话的做法定。
4. **`taylor-polynomial` 第 4 题解答引了后一节的唯一性定理（`taylor-limits`），接受**：题目文字用到链外的结论，加了链接注明出处（`plan.md:1293`）。
5. **「平均值」进了表，别的领域扫规矩 C 时不补**：别处的「平均值」多是算术平均，是中学基础词。`vector-identities:36` 说的是函数在圆上的平均值，意思相同，可这个词本身是基础词，也不补。

## 跨领域的几处

协调会话说这 3 个文件改完后另请我复核，这里只记现状和意见：

- **常微分方程 `numerical-methods` 的前置换成 `taylor-remainder`：同意**。
  - `:39` 的证明思路和第 5 题都要拉格朗日余项，按 `plan.md:245`，推理用到的概念要在链上；
  - 代价只是它从第 9 层到第 10 层，没有下游，我按全图核过。
  - 现状：前置已换，`:39` 的链接已改指 `taylor-remainder#thm-lagrange-remainder`，「拉格朗日余项（Lagrange remainder）」在链上，不标、括注英文，对。`:89` 见上面的原有问题。
- **光学 `fermat-principle:34` 不标、只括注英文：同意**。「驻点」经 `optimization → monotonicity → mean-value-theorem → local-extrema` 在它的链上，规矩 C 不标。
- **数学分析 `weierstrass-approximation`**：现状是 `:16`、`:84`、`:110` 三处「泰勒多项式」标了 `math.calculus.taylor-polynomial`。它的链上没有 `taylor-polynomial`，是批次 4 写的，该补。等改完再复核。
- 别的领域还少一处：`linear-first-order:41`，见小问题 1。

## 细节

### 验算

- 读题：`npm run statements -- <11 节> --tier easy,medium`，没开 `problems.yaml`；验算脚本写完、比对通过以后，才读题目文件抽查难题、思考题。
- 脚本：11 个 `tools/verify/math.calculus.<小节>.ts`。在 `math.calculus._calc.ts` 里加了三个辅助函数：
  - `extremumKind`：按不严格的定义判断极值点，办法和 `local-extrema` 的脚本相同；
  - `convexityCounterexample`：按中点凸找不凸的反例；
  - `maxOn`：格点加黄金分割求区间上的最大值。
- 方法：只按题意数值地算，不用答案里的公式。
  - 积分用 tanh-sinh 数值积分，黎曼和直接加，再按 $h=\frac1n$ 外推；
  - 导数按定义做差商外推，高阶导数用 `_jet.ts` 的 Jet（按初等函数的递推算各阶导数，不套展开式）；
  - 极限在两侧取值外推，消去相减时丢的精度：用 `expm1`、`log1p`，或从 $h=0.1$ 起只外推 6 级；
  - 选择题逐个选项找反例：凸性在 $[0.01,20]$ 的 401 个格点上查中点凸；严格递增在 $[-20,20]$ 上步长 $10^{-3}$ 逐对比较；拉格朗日余项的选项对 $x=\pm0.5,\pm1,\pm2,\pm3$ 查能不能在 $0$ 和 $x$ 之间找到 $\xi$；
  - 极值题都用邻域取样确认取得到。
- 结果：44 道全部一致。`npm run verify` 全部一致（304 个小节），`npm run typecheck` 通过，`npm run content` 0 个错误、0 个警告。

### 难题、思考题

44 道逐道读过，推导和数都对，下面几道特意核了数：

- `lhopital` 第 5 题：$-\frac e2$，两步洛必达的中间式子都对。
- `curve-sketching` 第 5 题：$y'$、$y''$ 重新求过，单调区间、凹凸区间、极值 $\mp\frac{3\sqrt3}2$ 都对。
- `curve-sketching` 第 6 题：两个方向的渐近线 $y=\pm(x+1)$、$y''=-(x^2+2x)^{-3/2}$ 都对。
- `taylor-polynomial` 第 6 题：展开到 $\varepsilon^2$ 的系数是 $\frac{3\cos^2\theta-1}2$，对。
- `taylor-limits` 第 5 题：$f^{(8)}(0)=40320$，对。
- `taylor-remainder` 第 5 题：$e$ 是无理数的证明完整。
- `taylor-remainder` 第 8 题：$T_1(2)$ 到 $T_5(2)$ 的数、余项的式子都对。

难度档都合适。`definite-integral` 第 6 题偏常规，每一小问都是例题的做法，但三问连起来步骤较长，不报。

### 前置与层级

- 加的前置，正文里的用处：
  - `definite-integral` 加 `limits-at-infinity`：`:33`、例 1 用 $n\to\infty$ 的极限，`:47` 标了「数列的极限」，定义在 `limits-at-infinity`；
  - `fundamental-theorem`、`lhopital`、`optimization` 加的 `chain-rule`：见「我替你定的」第 3 条。
- 链外的术语标记、链接，都是旁白或「见某节」，推理没有用到：
  - `definite-integral`：「被积函数」，链到数学分析 `riemann-integral`、`integrable-functions`；
  - `taylor-polynomial`：`:51` 提前提到「拉格朗日余项」，例 2 提到「二阶导数判别法」（`concavity`，同在第 8 层）；
  - `taylor-remainder`：`:16`、`:44` 提到 `differentials` 第 6 题，本节自己重新推出了那个界。
- 层级：对 7347983 和现在各算一遍全图，已有小节 0 处变化。
- 引文：「第 N 题」「例 N」逐个对过。除小问题 2 那一处锚点外都指对了：
  - `monotonicity:16` → `mean-value-theorem` 第 8 题，`:47` → `local-extrema` 第 5 题，`:104` → 本节第 7 题；
  - `optimization:22` → `local-extrema` 第 7 题；
  - `curve-sketching:22` → `limits-at-infinity` 第 7 题；
  - `fundamental-theorem:38` → `antiderivatives` 第 8 题；
  - `taylor-polynomial:22` → `higher-derivatives` 第 8 题；
  - `taylor-limits:27` → `infinitesimal-orders` 第 8 题，`:52` → 本节第 3 题；
  - `lhopital:51` → 本节第 3 题；
  - `taylor-remainder:42` → 本节第 6、8 题；
  - `taylor-limits` 第 6 题 → `lhopital` 第 5 题；
  - `monotonicity` 第 6 题 → 本节例 2。

### 术语

- 脚本扫了三项，查出的都人工看过：
  - 每块第一次出现：报出的「极限」都是黎曼和的广义极限（`plan.md:243` 不标），「极大值点」「二阶可导」「不可导」不是术语或不算出现；
  - 链外标记；
  - 规矩 C 两个方向。
- 两处本领域补标都对：`antiderivatives:41`、`infinitesimal-orders:76`，都先把词写出来、标记、括注英文，再放链接。页面上两处都显示成术语。
- 规矩 C 反方向：新进表的 25 条，别的领域批次 4 以后的正文里，除了写内容会话正在补的 `weierstrass-approximation` 和小问题 1 的 `linear-first-order:41`，没有别的要补：
  - `mean-value-proofs:63` 是批次 3 写的；
  - `real-construction` 的「分割」是戴德金分割，意思不同；
  - `extrema` 的「二阶导数判别法」是多元的那个，多变量微积分自己定义；
  - 其余都在题目文字里。
- 凹凸的叫法照 `legendre-transform:22`：凸就是 convex、向上弯，`concavity:27` 提了另一种叫法。

### 页面检查

- 网站建在 scratchpad（`vite build --outDir`），另起一个进度写临时 Git 仓库的服务（端口 3149），在 `.claude/launch.json` 临时加了一条。
- 在 768 像素宽下看了 13 节：
  - 11 节每节点开 24 级提示，4 道简单题、中等题都点「放弃，看解答」再点「确定放弃」，每节点 32 下；
  - 13 节的 `scrollWidth` 都等于 `clientWidth`，没有要横向滚动的行间公式和容器，没有 KaTeX 报错，控制台没有错误。
- 11 个动画截图看过，滑块调到两端，`sum`、`prod`、`floor` 写的式子都画得出来：
  - `definite-integral` 的黎曼和台阶；
  - `taylor-polynomial` 阶数 8、展开点 1.5；
  - `taylor-remainder` 阶数 11；
  - `taylor-limits` 缩放到 0.05。
- 看完停了服务，删了 `launch.json` 里那一条（JSON 校验通过）、网站副本和临时进度仓库。

### 牛顿力学记号对照

- `momentum-impulse:30`、`:39`、`:79`：定积分写 $\int_{t_1}^{t_2}\vb F(t)\,\dd t$，括注 definite integral；用「原函数」「牛顿-莱布尼茨公式（Newton-Leibniz formula）」，和 `fundamental-theorem:47` 一致。在链上，不标，对。
- `work-energy:37`、`:49`：用牛顿-莱布尼茨公式，和这边一致。
- `energy-diagrams:44`：用「二阶导数判别法（second derivative test）的道理」，判别法在 `concavity:50`，在它的链上；平衡点附近的展开可以链 `taylor-polynomial` 例 2。

## 修订说明（写内容会话）

报告里的 6 条都改了，没有不修的。同一类问题在 11 节里都找过一遍，另外改到的地方也列在各条下面。行号是修订后的。

### 重要 1：拐点的定义

- `concavity:41`：改成「一侧附近 $f$ 严格凸、另一侧附近 $f$ 严格凹」，两个词仍标凸函数、凹函数的 id。
- `:43`「为什么这样定义」加了一句边界情况：一次函数两侧都既凸又凹，它图像上的点不是拐点。这一段现在 4 句。
- 措辞跟着改成「严格」：
  - `:45`：$x^4$「两侧都严格凸」，$x|x|$「$x<0$ 时严格凹、$x>0$ 时严格凸」；
  - `:105` 常见误区：$x^6$「两侧都严格凸」。
- `_domain.yaml` 拐点的简介改成「曲线上一侧严格凸、另一侧严格凹的点…」。
- 别处都不用动，逐处对过，它们两侧都是 $f''$ 一正一负：
  - `concavity`：$\sin x$、例 1、几何图像，第 1、3、7 题；
  - `curve-sketching`：例 1、例 2，第 2、5 题。

### 重要 2：`integral-properties` 第 4 题

- 答案改成 tuple $(3,\sqrt3)$。
- 题干改成「求……的平均值，以及积分中值定理里的 $\xi$。依次填平均值和 $\xi$。」
- 核对脚本跟着改，结果一致。
- 同类：44 道简单题、中等题的题干都看过，没有别的「要两个数、只有一个框」。只多问了非数值项的还有 4 道，不影响判分，按报告的意见不改：
  - `monotonicity` 第 4 题「判断……」；
  - `curve-sketching` 第 4 题「写出渐近线」；
  - `taylor-polynomial` 第 2 题「写出 $T_3$」；
  - `taylor-remainder` 第 3 题「写出 $R_2$」。

### 小问题 1：进表、标记和括注

**进表 3 条，术语表 94 条 → 97 条**
- 曲边梯形（curvilinear trapezoid）：锚点 `definite-integral#def-curvilinear-trapezoid`。
- 积分变量（variable of integration）：锚点 `definite-integral#def-definite-integral`。
- 区间可加性（additivity over intervals）：锚点 `integral-properties#thm-additivity`。

**标记**（每块第一次出现）
- `definite-integral`：`:23` 曲边梯形（定义处）、`:58` 几何意义；`:45` 积分变量（定义处，括注英文）、`:120` 常见误区。
- `integral-properties`：
  - 区间可加性：`:25`（本节第一次，括注英文）、`:35` 定理名、`:53`、`:98`（例 1）；
  - 曲边梯形：`:60`（本节第一次，括注英文）。
- `fundamental-theorem`：
  - 积分变量：`:27`（括注英文）、`:126`；
  - 区间可加性：`:36`，括注英文，原来的「见[定积分的性质]」链接留着。
- 三个词在本领域已写的小节里没有出现，不用补标、不用退回。
- 别的领域有：数学分析 `riemann-integral:54`（曲边梯形）、`ftc-proof:22`、`:29`（区间可加性，那边自己的引理）、`parameter-integrals:24`（积分变量）。都在各自的链上或是自己的概念，交给协调会话扫规矩 C 时定。

**括注英文**
- 报告指出的：
  - `definite-integral:45`：积分区间（interval of integration）、积分变量（variable of integration）；
  - `integral-properties` 的定理名，照 `implicit-differentiation:43` 的写法：
    - `:30`「定理（线性，linearity）」；
    - `:35`「定理（区间可加性，additivity over intervals）」；
    - `:44`「定理（保序性，monotonicity）」。
- 同类另补（正文）：
  - `fundamental-theorem`：`:36` 单侧导数（one-sided derivative）；`:40` 左导数（left derivative）、右导数（right derivative）。
  - `integral-properties`：`:39` 奇函数（odd function）、偶函数（even function）；`:46` 估值（estimation）。
  - `curve-sketching:38`：偶函数、奇函数。
  - 介值性（intermediate value property）：`monotonicity:47`、`optimization:38`。
  - `taylor-polynomial`：`:39` 二项式展开（binomial expansion）；`:121` 二项式定理（binomial theorem）。
- 同类另补（题目文字，第一次出现）：
  - `fundamental-theorem`：第 3 题解答（区间可加性）；第 5 题第 1 级提示（积分变量、线性）。
  - `integral-properties`：第 1 题第 1、3 级提示（区间可加性、线性）；第 3 题（奇函数）；第 6 题（保序性）。
  - `definite-integral` 第 8 题（曲边梯形）。
  - `optimization` 第 8 题（单侧导数、右导数）。
  - `curve-sketching` 第 5 题（奇函数）。
  - `taylor-limits` 第 5 题（偶函数）。
  - `lhopital` 第 5 题（商法则）。

**别名**
- `optimization:85` 改成 `:term[乘积法则]{id="math.calculus.product-rule"}（product rule）`。
- 同类：题目文字里的「乘积的求导法则」也改成「乘积法则（product rule）」：`fundamental-theorem` 第 5 题第 2 级提示、`monotonicity` 第 2 题第 1 级提示。

**术语表简介**
- 「泰勒公式」改成「$f(x)=T_n(x)+R_n(x)$；带佩亚诺余项时，$x\to a$ 时 $R_n(x)=o\bigl((x-a)^n\bigr)$」，不再提拉格朗日余项。
- 这一批新进表的 28 条简介都对过定义它的那一节的链，没有别的链外概念。拐点的简介随重要 1 改了。

**跨领域**
- 常微分方程 `linear-first-order:41`：改成「这由 `:term[微积分基本定理]{id="math.calculus.fundamental-theorem-of-calculus"}`（fundamental theorem of calculus，见[微积分基本定理](…)）保证」。
- 写法同 `antiderivatives:41`，`status` 不动。

### 小问题 2：锚点和选择题的称呼

- `fundamental-theorem` 第 8 题第 2 级提示：锚点改成 `mean-value-theorem#thm-zero-derivative`。
- 同类：11 节里带锚点的链接逐个对过。另改一处：`optimization:38` 原来指 `monotonicity#def-monotonic-interval`（单调区间的定义），可这里要引的是「导函数有介值性」，改成「见[极值与费马定理](…)第 5 题」，那道题证了这件事。
- 选择题的解答改用字母：
  - `monotonicity` 第 3 题：「A：……D：……B、C 不对：……」；
  - `curve-sketching` 第 3 题：「A：……B：……D：……C 不对：……」；
  - `taylor-remainder` 第 1 题：「选 A。B……；C……；D……」。
- 同类另改：`concavity` 第 4 题原来按函数名称呼，也改成「A、C：……B 不对……D 不对……」。11 节的选择题就这 4 道。

### 小问题 3：`integral-properties` 几何图像的说明

- `:90` 最后一句改成：「$b>1.5$ 以后，右端新加进来的函数值比当前的平均值小，平均值开始变小；$b>1+\sqrt3$ 以后，曲线还有一段在 $x$ 轴下方，那部分面积算负的。」
- 核过：平均值 $1+\frac b2-\frac{b^2}6$ 在 $b=1.5$ 最大。它对 $b$ 的导数是 $\frac{f(b)-\text{平均值}}b$，所以 $f(b)$ 比平均值小时平均值变小。

### 原有问题：`numerical-methods:89`

- 三处 $O(\cdot)$ 改成 $o\bigl(\frac1N\bigr)$：$N\ln\bigl(1+\frac1N\bigr)=1-\frac1{2N}+o\bigl(\frac1N\bigr)$，$y_N=e\cdot e^{-\frac1{2N}+o(\frac1N)}=e-\frac e{2N}+o\bigl(\frac1N\bigr)$。
- 结论「整体误差约为 $\frac e2h$」不变。`taylor-polynomial` 没改，`status` 不动。

### 改了没报的

`hyperbolic-functions:55` 的「终端速度」标记不是我改的。协调会话说由牛顿力学写内容会话撤回，我没碰。

### 别的领域另外 3 个文件（协调会话已转述，复核时一起看）

- 光学 `fermat-principle:34`：去掉标记和链接，写成「即驻点（stationary point）」。
- 常微分方程 `numerical-methods`：
  - `:7` 前置 `math.calculus.taylor-polynomial` 换成 `math.calculus.taylor-remainder`，它从第 9 层变到第 10 层；
  - `:39` 拉格朗日余项括注英文，链接指 `taylor-remainder#thm-lagrange-remainder`。
- 数学分析 `weierstrass-approximation:16`、`:84`、`:110`：「泰勒多项式」各标一次 `math.calculus.taylor-polynomial`。

### 检查

- `npm run content`：0 个错误，0 个警告。
- `npm test`：23 个文件，202 项测试全部通过。
- 写内容会话自己的核对脚本：44 道简单题、中等题全部一致，含改成 tuple 的那一题。
- 术语检查脚本：每块第一次出现都标了；剩下没标的 6 处都是黎曼和的广义「极限」，按 `plan.md:243` 不标。英文括注、锚点句号都合规。
- 层级：除了已经同意的 `numerical-methods`（第 9 层到第 10 层），全图没有变化，没有多余前置。

## 复核

审内容 agent · 2026-11-17

结论：通过，没有需要修的。13 节（11 节加 `antiderivatives`、`infinitesimal-orders`）的 `status` 已改成 `reviewed`；别的领域 4 个文件 `status` 没动，都通过。

- 和快照 `b19-snapshot/` 逐字比过，改动和修订说明一一对得上，没有说明以外的改动。`lhopital`、`taylor-limits`、`taylor-remainder` 的正文，`taylor-polynomial` 的题目，`antiderivatives`、`infinitesimal-orders` 两节都没改。
- 6 条都改对了：
  - 重 1：`concavity:41` 改成一侧严格凸、另一侧严格凹，`:43` 补了一次函数的边界情况（这一段 4 句），`:45`、`:105` 和拐点的简介跟着改。直线不再算拐点，例 1、第 1、3 题和 `curve-sketching` 的结论都不受影响。
  - 重 2：`integral-properties` 第 4 题改成 tuple $(3,\sqrt3)$，题干写明依次填两个数，页面上显示「按顺序填 2 个数」。我的验算脚本跟着改成两个数，一致。
  - 小 1：进表 3 条（曲边梯形、积分变量、区间可加性，术语表 97 条），简介和锚点都对，简介只用定义它那一节链上的概念；各块第一次出现都标了。英文括注、`optimization:85` 的乘积法则、泰勒公式的简介、`linear-first-order:41` 都改对了。同类另补的括注（单侧导数、左右导数、奇偶函数、介值性、二项式定理等）也都对。
  - 小 2：`fundamental-theorem` 第 8 题锚点改成 `#thm-zero-derivative`；4 道选择题的解答都改用字母。另改的 `optimization:38` 改指 `local-extrema` 第 5 题，它在链上，也证了这件事，比原来的锚点准。
  - 小 3：`integral-properties:90` 的说明对了：平均值在 $b=1.5$ 处最大，此后右端新加的函数值比平均值小。
  - 原有问题：`numerical-methods:89` 三处改成 $o(\frac1N)$，推导对，结论不变。
- 别的领域 4 个文件：
  - `fermat-principle:34`：去掉标记和链接，括注 stationary point。驻点在它的链上，对。
  - `numerical-methods`：`:7` 前置换成 `taylor-remainder`（第 10 层，没有下游）；`:39` 拉格朗日余项在链上，不标、括注英文，链接指 `#thm-lagrange-remainder`；`:89` 见上。
  - `weierstrass-approximation:16`、`:84`、`:110`：三个块各标一次，它是批次 4 写的、链上没有 `taylor-polynomial`，该补。
  - `linear-first-order:41`：先写术语、标记、括注，再放链接，同 `antiderivatives:41`。
- `hyperbolic-functions` 已回到 HEAD。`lyapunov-stability:25` 的改动还在，不归我审。
- 协调会话对 3 条新术语的规矩 C 重扫，我抽核了：`riemann-integral`、`ftc-proof` 是批次 3 写的；`parameter-integrals` 的链上有 `definite-integral`。都不用补。
- 检查：`npm run content` 0 个错误、0 个警告；`npm run verify` 全部一致（304 个小节）；`npm run typecheck` 通过；每块第一次出现、句数、链外标记的扫描结果和初审一样，只剩当时判过的几类（广义极限、不可导、极大值点等）。
- 页面：重新建网站、进度写临时仓库，在 768 像素宽下看了改过的 7 节（`definite-integral`、`integral-properties`、`fundamental-theorem`、`lhopital`、`monotonicity`、`concavity`、`optimization`），提示和解答全部展开，没有横向滚动、没有公式报错，新标的术语都显示出来。`curve-sketching`、`taylor-polynomial`、`taylor-limits`、`taylor-remainder` 这次没有再上页面看：它们只改了括注和解答里的选项字母，没有加公式。
- 收尾：停了服务，删了 `launch.json` 里临时加的那一条。

# 批次 6 审查报告：常微分方程（一阶方程）

审内容 agent（和写内容 agent 是两个独立会话，没有读它的会话记录、交接说明和自查脚本）· 2026-11-11

审查范围：`math.ode` 的 8 节：`what-is-ode`、`separable`、`linear-first-order`、`exact-equations`、`numerical-methods`、`autonomous-equations`、`bifurcations`、`existence-uniqueness`。包括它们的文件头、`problems.yaml`、3 张 SVG、8 个动画的参数，`_domain.yaml` 新增的 32 个术语，以及这个新领域全部 25 节的文件头（看记号、说法和已写的领域是否一致）。台阶 1 的会话转来的问题单独答，见「台阶 1 和写内容会话问的几处」。`exp-log-construction` 第 8 题、`jacobi-condition:36` 的两处链接按安排留到复核时看。

## 结论

重要 1 条，小问题 3 条（同一类问题合成一条）。

- **重要：前置链上缺讲解要用的概念**，四节的主线推导要用：
  - **链式法则**：`linear-first-order` 求积分因子的那一步 $\mu'=p\mu$（`:36`）要对复合函数求导，可这一节的链上没有 `math.calculus.chain-rule`。`what-is-ode` 的 $(Ce^{-kt})'$（`:22`）也是同样的情况。
  - **多元复合函数的链式法则**：`exact-equations` 由「$F$ 沿解曲线不变」推出方程（`:22`、`:27`、`:69`）靠它，链上只有偏导数。
  - **级数**：`existence-uniqueness` 证皮卡迭代收敛（`:56`）、$e^x=\sum\frac{x^k}{k!}$（`:46`）、例 1（`:108`）都用到无穷级数，链上没有讲级数的小节。这条是台阶 1 问的，并进来一起报。
  - **建议**：改三个文件头，全图算过，所有小节的层级都不变。
    - `what-is-ode` 加 `math.calculus.chain-rule`。
    - `exact-equations` 的 `math.vector-calculus.partial-derivatives` 换成 `math.vector-calculus.multivariable-chain-rule`。
    - `existence-uniqueness` 加 `math.calculus.series`。
- **小问题**：
  - **1（两节）：动画说明有一句和画面对不上**。
    - `separable:78` 说「从 0 和 1 之间出发的解是 S 形曲线」，可起点 0.5 那条一开始就是下凹的。
    - `numerical-methods:79` 说 $N=1$ 时龙格-库塔法的折线「几乎贴着」$e^x$，页面上那两段直线和曲线最多差 0.54。
  - **2（三节）：三处叙述说的比能证明的多**。
    - `numerical-methods:37` 说欧拉法是一阶方法，缺了对 $f$ 的条件。
    - `bifurcations:64` 说「所以分岔只可能发生在 $f=0$、$f_y=0$ 的点上」，漏了平衡点跑到无穷远的情形。
    - `existence-uniqueness:46` 说「由下面的定理……在每个有界区间上一致收敛」，可这个定理只保证 $|x|<1$ 的一段。
  - **3（几节）：链外的词没按规矩处理**。正文要按规矩 C 标记或括注英文，题目文字要加链接，共 6 处，见「通用」。
- **别的都对**：
  - 讲解和例题的推导、数值逐条核过，除小问题 2 的三处叙述外都对。
  - 32 道简单题、中等题的标准答案全部和独立验算一致。
  - 16 道难题的参考解答逐题核过，都对；16 道思考题问题清楚，参考解答站得住。
- **结构、证明深度都符合方案**：
  - `npm run content` 0 个错误、0 个警告。每节 7 个必选部分加常见误区都在，各有 2 道例题，都先写「为什么想到这么做」。
  - 39 个锚点段都是完整的一句：定义式、结论和起名的句子都在卡片里（批次 5 定的规矩）。
  - 8 节都是 `sketch`，略去的证明都指了题号或链接了出处。正文提到的题里，只有 `existence-uniqueness:121` 提到一道中等题（第 3 题），没有写出答案。
- **批次 4、5 的规矩**：
  - 图和动画没有画出简单题、中等题要算的数。
  - 别的领域的词，除小问题 3 的几处外，都按规矩 C 处理了。
  - 题目文字每段不超过 4 句。
  - 标准答案都是封闭形式。
- **几何图像**：3 张 SVG、6 个 `phase-portrait`、2 个 `function-plot`，没有占位框。3 张 SVG 的曲线逐点核过，文字也量过，都对。

| 小节 | 简单、中等题验算 | 难题 | 思考题 | 重要 | 小问题 |
| --- | --- | --- | --- | --- | --- |
| `what-is-ode` 微分方程与方向场 | 4 道一致 | 2 道都对 | 2 道清楚 | 0 | 0 |
| `separable` 可分离变量的方程 | 4 道一致 | 2 道都对 | 2 道清楚 | 0 | 0 |
| `linear-first-order` 一阶线性方程与积分因子 | 4 道一致 | 2 道都对 | 2 道清楚 | 0 | 0 |
| `exact-equations` 恰当方程 | 4 道一致 | 2 道都对 | 2 道清楚 | 0 | 0 |
| `numerical-methods` 数值解法：欧拉法与龙格-库塔法 | 4 道一致 | 2 道都对 | 2 道清楚 | 0 | 0 |
| `autonomous-equations` 自治方程与平衡点 | 4 道一致 | 2 道都对 | 2 道清楚 | 0 | 0 |
| `bifurcations` 分岔 | 4 道一致 | 2 道都对 | 2 道清楚 | 0 | 0 |
| `existence-uniqueness` 解的存在唯一性 | 4 道一致 | 2 道都对 | 2 道清楚 | 0 | 0 |
| 通用 · 重要（四节的前置，见下） | | | | 1 | |
| 通用 · 小问题 1（两节的动画说明） | | | | | 1 |
| 通用 · 小问题 2（三节的叙述） | | | | | 1 |
| 通用 · 小问题 3（几节的链外词） | | | | | 1 |
| 合计 | 32 道 | 16 道 | 16 道 | 1 | 3 |

要修的按小节分：

- `what-is-ode`：重要（加前置）、小问题 3。
- `separable`：小问题 1、3。
- `linear-first-order`：重要（它缺的链式法则加在 `what-is-ode` 上就补上了）、小问题 3。
- `exact-equations`：重要、小问题 3。
- `numerical-methods`：小问题 1、2、3。
- `bifurcations`：小问题 2。
- `existence-uniqueness`：重要、小问题 2。
- `autonomous-equations`：一处要修的都没有。

复核标准：重要的必须改；小问题改掉，或在修订说明里写一句不改的理由。

## 怎么审的

- **改动范围**：写内容会话的汇报我没看，只核了改动范围。只动了 `content/math/ode/`：8 节的 `lesson.md` 和 `_domain.yaml`，新加了 8 个 `problems.yaml` 和 3 张 SVG。8 节的前置和批次 0 定的一样，文件头只改了 `status`，补了 `summary`、`minutes`。
- **简单题、中等题**：
  - 先用 `npm run statements -- <8 个小节 id> --tier easy,medium` 读题，没有打开 `problems.yaml`，自己先手推了一遍。
  - 再按题意写了 8 个验算脚本 `tools/verify/math.ode.<小节>.ts`，加一个共用的 `tools/verify/math.ode._numeric.ts`。
  - 逐个用 `npx tsx` 跑，32 道全部一致。其中 `what-is-ode` p1 第一次没找到零点：我脚本的格点正好落在零点上，差分的舍入误差盖住了变号。错开格点后一致。
  - `npm run verify` 全部一致（85 节，含另一个审查会话正在写的狭义相对论脚本）。`npx tsc -p tsconfig.node.json --noEmit` 通过；`npm test` 20 个文件、180 个测试通过。
  - 验算做完以后才打开 `problems.yaml`，审提示、解答和难题、思考题。
- **验算的做法**（脚本里每题都写了一句「方法」）：
  - **不借用要验的结论**：初值问题都直接对方程做四阶龙格-库塔数值积分，不用分离变量、积分因子、势函数的公式。
  - **恰当**：不用判别法 $M_y=N_x$，看 $M\dd x+N\dd y$ 沿 4 个圆的环路积分是不是 0。`exact-equations` p1 也是这样找出 $a$ 的。
  - **稳定性**：从平衡点两侧各偏 $10^{-3}$ 出发积分，看解回不回来，不看 $f'$ 的符号。
  - **分岔值**：数平衡点的个数：右边对 $y$ 的最大（最小）值穿过 0 时，零点成对出现或消失；不联立 $f=0$、$f_y=0$。
  - **极限、上确界**：`autonomous-equations` p3 积到 $t=10^4$；`existence-uniqueness` p1 取三种 $\delta$ 的差商，最大值逼近 2 且没有超过 2；p3 在格点上数值求 $|f|$ 的最大值，再对 $b$ 求极大。
  - **皮卡迭代**：`existence-uniqueness` p2 按定义迭代，积分用嵌套的辛普森公式。
  - **选择题**：都在例子上逐条判，例子写在脚本里。
- **讲解、例题、提示、解答**：逐行核了推导和数值。例如：
  - `numerical-methods` 例 2 的误差表，6 个误差和 3 个倍数都复算过；
  - `bifurcations` 例 2 的分岔值 $\pm2$、跳变 $-1\to2$ 和 $1\to-2$；
  - `exact-equations` 动画里 6 个起点的 $F$ 值；
  - `existence-uniqueness` p7 的 $c=\frac1{144}$。
  - 交叉引用都指对了：`linear-first-order` p7 引用的「可分离变量的方程第 8 题」、`existence-uniqueness` p8 链接的变分法共轭点锚点。
- **术语和排版**：
  - 用脚本按块查了术语第一次出现的标记，以及每段句数（正文和题目文字），都没有问题。
  - 脚本只标出两类情况，人工看过都不算漏标：一是「鞍结分岔」「分岔值」这类更长的词里含「分岔」；二是 `numerical-methods:16`、`autonomous-equations:16` 的链接文字在句子里当名词用，已括注英文。
  - 另写脚本列出别的领域术语表里的词在这 8 节出现的地方，逐个看了在不在链上，结果见小问题 3 和「前置」。
  - 39 个锚点段都以句号结尾，后面不紧跟行间公式。
- **前置**：用脚本算了 8 节的整条前置链，以及改前置前后全图的层级。
- **几何图像**：
  - **SVG**：按注释里的坐标变换写脚本逐点核了 942 个点（`phase-line.svg` 271、`bifurcation-diagrams.svg` 244、`nonuniqueness-fan.svg` 427），都和公式一致，按斜率放宽后偏差不到 0.004 像素。
    - 两张图的 25 个箭头（`phase-line.svg` 8 个、`bifurcation-diagrams.svg` 17 个）逐个按方程核了方向。
    - 页面上量了每段文字的 `getBBox`，按方案的办法每隔 1 像素取点查了压线：都在画布里，互不重叠，也不压线。
  - **动画**：8 个都按方程算了滑块两端时画面上会显示什么（见各节）。6 个相图在页面上跑起来截图看过（做法见「没验证的地方」），`numerical-methods` 的 $N=1$ 也截图看过。
- **页面**：`npm run build` 后用 test-serve 打开 8 节（3142 端口被占，服务开在 3143），进度写进临时仓库，没碰 `progress/`。
  - 8 节共 1469 个 KaTeX 公式，0 处报错；控制台没有报错。
  - 定义卡片和锚点一一对应，带术语的卡片上方都显示了术语名。

## 通用（几节都有）

- **重要 · 前置链上缺讲解要用的概念**。
  - **依据**：方案第 3 条的前置清单要求「讲解里用到的概念都在前置链上（沿整条前置链查）」。`sketch` 那条例外管的是引用分析定理的严格证明（写明条件、链接出处即可）；它也说，读者要先懂才看得懂这一段的概念，仍要列为前置。下面三处是读者在主线推导里要会用的工具，不是只引用结论。
  - **链式法则**：
    - `linear-first-order` 的链只有 `what-is-ode` 和单变量微积分的导数、原函数那几节，没有 `math.calculus.chain-rule`。链上的 `elementary-derivatives` 只以和、差、积、商的求导法则（`derivative-rules`）为前置，复合函数求导在 `chain-rule` 那一节。
    - 用到的地方：
      - `:36` 积分因子的关键一步 $\mu'=p\mu$（$\mu=e^{P(x)}$）；
      - `:31` 的 $(e^{2x}y)'$；
      - 例 2（`:94`）验证 $(t+8)e^{0.5t}$ 的导数；
      - 第 1 题的提示；
      - 第 5 题（`problems.yaml:75`）的 $v'=(1-n)y^{-n}y'$。
    - `what-is-ode` 自己也用：`:22` 的 $m'(t)=-kCe^{-kt}$，例 1（`:84`）的 $(Ce^{2x})'$。
    - **建议**：加在 `what-is-ode` 上，一行同时补上 `what-is-ode`、`linear-first-order`、`numerical-methods`。`separable` 以后的几节原本就经过 `partial-fractions` → `substitution` 有链式法则。
  - **多元复合函数的链式法则**：`exact-equations` 的链上有偏导数，没有它。用到的地方：
    - `:22`：由 $F(x,y(x))$ 不变推出方程。原文写了「这一步用的是多元复合函数的链式法则」，加了链接。
    - `:27`：「为什么这样定义」的全部理由 $\frac{\dd}{\dd x}F(x,y(x))=M+Ny'$。
    - `:69`：动画说明里的 $\frac{\dd F}{\dd t}=Mx'+Ny'$。
    - 第 6 题（`problems.yaml:107`）。
    - **建议**：`math.vector-calculus.partial-derivatives` 换成 `math.vector-calculus.multivariable-chain-rule`。它的链经过 `differentiability`（全微分与切平面）再到 `partial-derivatives`，所以换掉以后不重复。顺带把 `:27` 的「$-\bigl(\frac yx\bigr)$的微分」、`:47` 的「全微分」也放到了链上。
  - **级数**：`existence-uniqueness` 的链上有数学分析的一致收敛和一致收敛的极限定理，没有讲级数的小节。用到的地方：
    - `:56`：「右边对$n$求和收敛」，再用魏尔斯特拉斯判别法。
    - `:46`：「这顺便说明了$e^x=\sum_{k=0}^{\infty}\frac{x^k}{k!}$」。
    - 例 1（`:108`）：$\sum_{k=0}^{\infty}\frac{(x^2)^k}{k!}=e^{x^2}$。
    - 第 6 题（`problems.yaml:107`、`:109`）：「这些数的和是$\frac ML(e^{Lh}-1)$」。
    - **建议**：加 `math.calculus.series`（无穷级数与收敛：部分和、几何级数），另外两处各补半句，见「问的几处」第 1 条。
  - **为什么算重要**：三处都在这一节的主线上，分别是积分因子从哪来、恰当方程的解为什么落在等值线上、皮卡迭代为什么收敛。星图按前置判断「可学」，现在还没学过链式法则的读者也会被放进 `linear-first-order`。
  - **影响**：改法都只动文件头的一行。全图算过，所有小节的层级都不变：`what-is-ode` 8、`exact-equations` 9、`existence-uniqueness` 14。以 `exact-equations` 为前置的热力学 `entropy` 也不变。三个新前置都不在原来的链上，加了还是最少的。
- **小问题 1 · 动画说明有一句和画面对不上**（`separable`、`numerical-methods`）：
  - **`separable/lesson.md:78`「从$0$和$1$之间出发的解是 S 形曲线」**：
    - 动画的 5 个起点里有 $(0,\ 0.5)$（`:65`），正好是 $\frac K2$。这条解一开始就过了拐点，一路下凹，不是 S 形。页面截图看过：$r=1$ 时 $0.05$、$0.2$ 两条是 S 形，$0.5$ 那条只有上半截。
    - `:54` 和常见误区 `:102` 自己也说只有 $0<y_0<\frac K2$ 时才是 S 形。
    - 同一段「可除了$0$，所有解最后都趋于环境容纳量$1$」也说多了：纵轴画到 $-0.2$（`:60`），在 $y<0$ 处点一下，放出的解往下跑到无穷。
    - **建议**：例如改成「从$0$和$\frac12$之间出发的解是 S 形曲线，从$\frac12$和$1$之间出发的只剩上半截……可正的解最后都趋于环境容纳量$1$」。
  - **`numerical-methods/lesson.md:79`「四阶龙格-库塔法的折线在$N=1$时就几乎贴着$e^x$」**：
    - 顶点确实几乎落在曲线上：$x=1$、$2$ 处只差 $0.010$、$0.054$。
    - 可顶点之间连的直线和 $e^x$ 最多差 $0.54$（在 $x\approx1.53$，纵轴总高 $8$）；$N=2$ 时还差 $0.18$，$N=3$ 时差 $0.09$。
    - 页面上把滑块设成 $1$ 截图看过：两段直线明显在曲线上方，看上去比说明说的差得多，读者会以为龙格-库塔法不准。
    - 说明最后一句「顶点之间连成直线只是为了看得清楚」解释了原因，可前面「几乎贴着」和画面矛盾。
    - **建议**：说明改成「它的顶点在$N=1$时就几乎落在$e^x$上」。也可以不画龙格-库塔法的折线，改用 `points` 只画它在 $x=1$、$2$ 处算出的两个值。
- **小问题 2 · 三处叙述说的比能证明的多**（`numerical-methods`、`bifurcations`、`existence-uniqueness`）：
  - **`numerical-methods/lesson.md:37`（`thm-euler-order`）**：只设「解$y$有连续的二阶导数」，就说整体误差是$h$的量级。
    - 证明思路（`:39`）自己说误差会不会被放大「要看$f$对$y$变化得多快」，第 5 题也加了 $|f(x,y)-f(x,z)|\le L|y-z|$。
    - 反例就在本领域：$y'=3y^{2/3}$、$y(0)=0$ 的解 $y=x^3$ 有连续的二阶导数，欧拉法每一步都得 $0$，$x=1$ 处的误差一直是 $1$，不随 $h$ 变小。
    - **建议**：定理里加上第 5 题那个条件。这一节还没讲利普希茨条件，写成不等式就行。
  - **`bifurcations/lesson.md:64`（`thm-bifurcation-condition`）最后一句「所以分岔只可能发生在同时满足$f(y^*,\mu_0)=0$、$f_y(y^*,\mu_0)=0$的点上」**：
    - 定理只管 $y^*$ 附近。按这一节的定义（`:27`：平衡点的个数改变就算），平衡点从无穷远处来、跑到无穷远也是分岔。
    - **反例**：$y'=\mu-e^y$ 在 $\mu>0$ 时有一个平衡点 $\ln\mu$，在 $\mu\le0$ 时没有。$\mu=0$ 处个数变了，可哪里都没有 $f=0$、$f_y=0$ 的点（$f_y=-e^y\ne0$）。
    - `:68`、例 2（`:115`）、常见误区（`:125`）用的都是这一条。
    - **建议**：给最后一句加限定，例如「平衡点不跑到无穷远时，分岔只可能发生在……」；或者把分岔的定义说成「某个平衡点附近」发生的变化。
  - **`existence-uniqueness/lesson.md:46`「由下面的定理，它们在每个有界区间上一致收敛（uniformly converge）到解$e^x$」**：
    - 对 $y'=y$、$y(0)=1$：矩形 $|x|\le a$、$|y-1|\le b$ 上 $M=1+b$，定理给的 $h=\min\bigl(a,\frac{b}{1+b}\bigr)<1$，只保证 $|x|<1$ 的一段。
    - 结论本身对：$f=y$ 对 $y$ 处处满足 $L=1$，`:56` 的估计在任何有界区间上都成立。只是这一点不能说成「由下面的定理」得到。
    - **建议**：改成「由下面的定理，它们在$0$附近一致收敛到解$e^x$」；要保留「每个有界区间」，就补半句理由。
- **小问题 3 · 链外的词**：正文要按规矩 C 标记或括注英文，题目文字要加链接（方案第 3 条：题目文字用到前置链外的结论时，加链接注明出处）。
  - **正文**：
    - **`exact-equations/lesson.md:32`「第二项要在积分号下求导（见[含参变量积分]……）」**：
      - 「积分号下求导」是数学分析的术语（`math.analysis.differentiation-under-integral`），定义它的 `parameter-integrals` 不在这一节的链上。按规矩 C 应标这个 id，并括注英文（differentiation under the integral sign）。
      - 按 `sketch` 那条还要写明条件、说明这里满足：$N$、$\frac{\partial N}{\partial x}$ 在矩形上连续。第 5 题的提示写了这个条件，正文没写。
    - **`linear-first-order/lesson.md:41`「这由[微积分基本定理](lesson:math.calculus.fundamental-theorem)保证」**：链接文字在句子里当名词用，算第一次出现，要括注英文（fundamental theorem of calculus）。这一节的链上没有定积分，所以这是链外的引用，加链接是对的。
    - **`what-is-ode/lesson.md:27`「方程里出现偏导数时」**：偏导数在这一节的链外，第一次出现要括注英文（partial derivative）。
  - **题目文字**：
    - **`numerical-methods` 第 6 题**：提示和参考解答（`problems.yaml:91`–`:99`）用了 $f_x$、$f_y$、$y''=f_x+f_yf$ 和二元函数的一阶展开，可这一节的链上没有偏导数和多元复合函数的链式法则，题里也没说明 $f_x$ 是什么。建议第 2 级提示说一句 $f_x$、$f_y$ 的意思，并链接[偏导数](lesson:math.vector-calculus.partial-derivatives)、[多元复合函数的链式法则](lesson:math.vector-calculus.multivariable-chain-rule)。
    - **`what-is-ode` 第 5 题**：完整解答（`problems.yaml:91`）和参考解答用了上确界，可链上只有单变量微积分。建议标 `math.analysis.supremum`，或链接[实数的完备性](lesson:math.analysis.completeness)。
    - **「爆破」**：在 `separable` 第 8 题（`problems.yaml:129`）、`linear-first-order` 第 7 题（`:106`）第一次出现，没有括注英文（blow-up）。`existence-uniqueness:71` 括注了。

## 各节

### math.ode.what-is-ode 微分方程与方向场

- **验算**：p1 $\{1,\ 2\}$、p2 A 和 D、p3 $2$、p4 $(1,\ 2,\ 2)$，都和标准答案一致。
- **难题**：p5（$y'=-y^2$ 的解要么恒为 $0$，要么是 $\frac{1}{x+C}$；既有零点又有非零点时，取零点集的上确界推出矛盾）、p6（落在等倾线上的那段解曲线是斜率为 $c$ 的直线段；$y'=(y-x)^2$ 的直线解是 $y=x\pm1$）对。
- **思考题**：p7（方程写的是规律，初始条件从中挑出一个解）、p8（$y''=-y$ 经过同一点的解斜率可以任取；在 $yv$ 平面上能画方向场，解是圆）清楚。
- **讲解**：
  - $y=\frac1x$、$\frac{1}{x+C}$ 满足 $y'=-y^2$；$y'=x-y$ 的等倾线 $y=x-c$ 只在 $c=1$ 时是解。例 1 的 $C=\frac54$、例 2 的 $y=x+1$ 核过。
  - 动画：7 条轨迹都挤向 $y=x-1$。从 $x=-3$ 出发的 5 条走到 $x=3$ 时在 $2.00$ 到 $2.02$ 之间，都在画面里；截图看过。
- **涉及**：重要（加 `math.calculus.chain-rule`）、小问题 3（`:27`、第 5 题）。

### math.ode.separable 可分离变量的方程

- **验算**：p1 $3e$、p2 $\frac{\ln2}{5}$、p3 $\tan\frac12$、p4 $\frac{12}{5}$，一致。
- **难题**：p5（$y'=-2\sqrt y$：$y=(1-t)^2$，之后停在 $0$；知道 $y(2)=0$ 推不出何时流空）、p6（$0<y_0<\frac K2$ 时，$y'$ 在 $y=\frac K2$ 即 $t=\frac{\ln A}{r}$ 时最大，最大值 $\frac{rK}{4}$）对。
- **思考题**：p7（「乘过去、两边积分」是链式法则的简写，容易错在除法和定义区间）、p8（倍增时间：$\frac{\ln2}{k}$ 不变；$\frac{1}{2ky}$ 越来越短，加起来有限）清楚。
- **讲解**：解法的证明思路、$y'=xy$ 的通解、例 1 的半圆只到 $x=\pm2$、例 2 的部分分式和 $A=\frac{K-y_0}{y_0}$ 核过（$y_0\ge K$ 时公式也对）。
- **动画**：$r=0.5$ 时，从 $0.05$ 出发的解拐点在 $x=5.89$，到 $x=12$ 时升到 $0.955$，都在画面里；$r=2$ 时拐点在 $x=1.47$。
- **涉及**：小问题 1（`:78`）、小问题 3（第 8 题的「爆破」）。

### math.ode.linear-first-order 一阶线性方程与积分因子

- **验算**：p1 $2(1-e^{-3})$、p2 $6$、p3 $20\ln2$、p4 $\frac{19}{8}$，一致。
- **难题**：p5（伯努利方程；$y=(1+3e^{2x})^{-1/2}$ 代回原方程验证过）、p6（两个解之差不超过 $|w(0)|e^{-ax}$）对。
- **思考题**：p7（线性方程的解不会在有限时间内爆破）、p8（常数变易法和积分因子法是一回事，$C(x)=\mu y$）清楚。
- **讲解**：定理 1、2 的证明思路核过；例 1 $y=\frac{x^4}{2}+Cx^2$、例 2 $T=t+8+22e^{-0.5t}$（最后比室温低 2 度）核过。
- **动画**：
  - $k=0.3$ 时 5 条解在 $x=8$ 处还差 $0.36$，到 $x=15$ 处只差 $0.04$；$k=3$ 时在 $x=8$ 以前就合成一条。
  - 周期解的振幅 $\frac{1}{\sqrt{1+k^2}}$ 从 $0.96$ 降到 $0.32$，和说明一致，都没出纵轴；截图看过。
- **涉及**：重要（缺链式法则，加在 `what-is-ode` 上）、小问题 3（`:41`、第 7 题的「爆破」）。

### math.ode.exact-equations 恰当方程

- **验算**：p1 $2$、p2 $\sqrt3$、p3 $\frac{\sqrt{19}-4}{2}$、p4 A 和 C，一致。
- **难题**：p5（在矩形上构造势函数，积分号下求导的条件写全了）、p6（去掉原点的平面上 $M_y=N_x$ 处处成立，方程却不恰当：沿单位圆走一圈 $F$ 增加 $2\pi$；右半平面上 $F=\arctan\frac yx$）对。
- **思考题**：p7（$\delta Q$ 不恰当，$\frac1T$ 是积分因子，乘出来的势函数是熵）、p8（$N\ne0$ 时由隐函数定理解出 $y(x)$，$N=0$ 处切线竖直）清楚。
- **讲解**：
  - 判别法和只依赖 $x$（或 $y$）的积分因子的证明思路核过；$e^{\int p\dd x}$ 确实是它的特例。
  - 例 1 $x^2y+3x+2y^2=2$、例 2 $\mu=\frac{1}{x^2}$ 和 $\ln x-\frac{y^2}{x}=C$ 核过。
- **动画**：
  - $F=y^2-x^3+3x$ 在 $(-1,\ 0)$ 处取极小（$F=-2$），在 $(1,\ 0)$ 处是鞍点（$F=2$）。
  - 6 个起点的 $F$ 依次是 $-1.125$、$-1.872$、$-1.375$、$2.0025$、$1.9988$、$-1$。前三条是绕 $(-1,\ 0)$ 的闭曲线；$(0.98,\ 0)$ 那条贴着过鞍点的回路走，横向到 $x\approx-2.0$，都在画面里。截图看过。
- **涉及**：重要（换前置）、小问题 3（`:32`）。

### math.ode.numerical-methods 数值解法：欧拉法与龙格-库塔法

- **验算**：p1 $1.22$、p2 $0.0625$、p3 $\frac{41}{12}$、p4 $\frac{169}{64}$，一致。
- **难题**：p5（欧拉法的整体误差不超过 $\frac{M_2h}{2L}\bigl(e^{L(x_n-x_0)}-1\bigr)$）、p6（改进的欧拉法和精确解的泰勒展开对到 $h^2$ 项）对。p6 的链外概念见小问题 3。
- **思考题**：p7（$y'=-50(y-\cos x)$：欧拉法每步乘 $1-50h$，要 $h<0.04$ 才稳定）、p8（舍入误差随步数积累，实际用自适应步长）清楚。
- **讲解**：
  - $y'=y$ 取步长 $0.5$ 走到 $2.25$；例 1 的 $y_N=e-\frac{e}{2N}+O\bigl(\frac{1}{N^2}\bigr)$ 核过。
  - 例 2 的表复算过：误差 $1.245\times10^{-1}$、$6.50\times10^{-2}$、$4.20\times10^{-3}$、$1.09\times10^{-3}$、$2.08\times10^{-6}$、$1.36\times10^{-7}$，缩小倍数 $1.92$、$3.85$、$15.35$。
  - 动画两条折线的式子，按两种方法对 $y'=y$ 每走一步乘的数核过。
- **涉及**：小问题 1（`:79`）、小问题 2（`:37`）、小问题 3（第 6 题）。

### math.ode.autonomous-equations 自治方程与平衡点

- **验算**：p1 $\{1,\ 3\}$、p2 $2$、p3 $2$、p4 $0.7$，一致。
- **难题**：p5（非常数解严格单调，有界时趋于平衡点）、p6（$f'(y^*)<0$ 时附近出发的解都趋于 $y^*$）对。
- **思考题**：p7（一维自治方程的解不能来回振荡，单摆是平面上的运动）、p8（$y'=-\sqrt{|y|}$ 的解在有限时间内到达平衡点，因为唯一性的条件不满足）清楚。
- **讲解**：
  - 相线上的解的三条性质、判别法、$y'=-y^3$、$y^3$、$y^2$ 在 $0$ 处的三种情形，例 1、例 2 都核过。
  - 证明思路用到的唯一性写明了条件（$f$ 连续可导），链接到后面的 `existence-uniqueness`，符合 `sketch` 那条。
- **SVG、动画**：
  - `phase-line.svg` 的曲线 271 个点、8 个箭头核过。
  - $a$ 取 $0.2$、$0.4$、$0.8$ 时，7 条解在 $x=12$ 以前都到了 $0$ 或 $1$，和说明一致；截图看过。
- **没有要修的**。「稳定」的说法见「问的几处」第 5 条，可改可不改。

### math.ode.bifurcations 分岔

- **验算**：p1 $4$、p2 $\frac14$、p3 $1$、p4 $\{-2,\ 2\}$，一致。
- **难题**：p5（$f_y<0$ 时，平衡点随参数延续下去，并且仍然稳定）、p6（$T(\varepsilon)=\frac{2}{\sqrt\varepsilon}\arctan\frac{1}{\sqrt\varepsilon}$，$T\sqrt\varepsilon\to\pi$）对。
- **思考题**：p7（临界慢化，恢复时间约 $\frac{1}{2\sqrt\mu}$）、p8（加一个常数项后，跨临界分岔断开或变成两个鞍结分岔）清楚。
- **讲解**：三个标准例子的平衡点和稳定性；例 1 在 $E=1$ 处发生跨临界分岔；例 2 的分岔值是 $\pm2$，跳变是 $-1\to2$ 和 $1\to-2$，都核过。
- **SVG、动画**：
  - `bifurcation-diagrams.svg` 的 4 支抛物线共 244 个点核过，17 个箭头的方向逐个按方程核过。
  - $\mu=-0.05$ 时，从 $\pm1.5$ 出发的解到 $x=10$ 还在 $\pm0.17$；$\mu=0.05$ 时（$\sqrt\mu=0.22$），从 $\pm1.5$ 出发的还在 $\pm0.28$，从 $\pm0.1$ 出发的才到 $\pm0.14$。这正是说明说的「越接近 0 越慢」。默认参数截图看过。
- **涉及**：小问题 2（`:64`）。

### math.ode.existence-uniqueness 解的存在唯一性

- **验算**：p1 $2$、p2 $\frac{11}{20}$、p3 $\frac14$、p4 B 和 C，一致。
- **难题**：p5（格朗沃尔不等式最简单的情形）、p6（归纳估计 $|\varphi_{n+1}-\varphi_n|\le\frac{ML^n|x-x_0|^{n+1}}{(n+1)!}$）对。p6 的「这些数的和」见重要那条的级数。
- **思考题**：p7（诺顿圆顶，$c=\frac{1}{144}$）、p8（二阶方程的解在 $xy$ 平面上可以相交，因为状态是 $(y,\ y')$）清楚。
- **讲解**：
  - 积分方程的等价、利普希茨条件和它的充分条件、皮卡迭代 $\sum\frac{x^k}{k!}$、定理和证明思路、方程组都核过。
  - 例 1 $\varphi_n=\sum_{k=0}^{n}\frac{x^{2k}}{k!}$ 的归纳、例 2 用唯一性证加法公式都核过。
- **SVG、动画**：
  - `nonuniqueness-fan.svg` 的 7 条三次曲线共 427 个点核过。
  - 部分和动画 $N=0$ 到 $8$ 在 $[-2,\ 2]$ 上最低 $-1$、最高 $7.39$，都在纵轴 $[-1.5,\ 8]$ 里。
- **涉及**：重要（加 `math.calculus.series`）、小问题 2（`:46`）。

## 台阶 1 和写内容会话问的几处

1. **级数（`existence-uniqueness:56`）**：要加一个最少的前置 `math.calculus.series`（无穷级数与收敛：部分和、几何级数），已并进重要那条。
   - **为什么加前置而不是改写**：不只 `:56`，`:46` 的 $e^x=\sum_{k=0}^{\infty}\frac{x^k}{k!}$、例 1 的 $\sum\frac{(x^2)^k}{k!}=e^{x^2}$、第 6 题的「这些数的和」都要读者懂无穷级数。只把 `:56` 换成不用级数的说法，另外三处也得跟着改，写起来更绕。
   - **最少**：`calculus.series` 不在现有的链上，加了还是最少的，层级不变。先例：`math.analysis.fourier-series` 也是用它作级数的前置。
   - **另外两处各补半句**：
     - `:56`「右边对$n$求和收敛」补一句理由：$n\ge2Lh$ 以后，后一项不到前一项的一半，所以部分和单调增，又不超过前面几项加一个几何级数，因此收敛。单调有界原理在链上（`math.analysis.bounded-monotone`）。
     - 第 6 题的「和是$\frac ML(e^{Lh}-1)$」要用 $e^x$ 的泰勒级数，链上没有。改成同样的几何级数比较，或者链接[泰勒级数](lesson:math.calculus.taylor-series)。
   - **魏尔斯特拉斯判别法**照你定的，只引用、不列前置。`:56` 现在写了条件（各项被 $\frac{ML^nh^{n+1}}{(n+1)!}$ 控制），标了数学分析的术语 id，符合规矩。
   - **也可以不加前置**：把 $\varphi_n$ 写成部分和，用单调有界原理说上界的和收敛。但这样要连带改 `:46`、`:108` 和第 6 题。
2. **两张没有术语标签的定义卡片**（`what-is-ode` 的 `def-solution`、`exact-equations` 的 `def-exact-integrating-factor`）：可以，不用改。
   - 另有一张情况一样：`separable` 的 `def-exponential-growth`。指数增长、倍增时间、半衰期都没进术语表。
   - 方案第 3 条本来就要求「定义的概念不在术语表里也要加」锚点。页面上这种卡片只是上方没有术语名，样子和定理卡片一样，截图看过。
   - 「解」不宜进术语表：进了以后，每一块里第一次出现的「解」都要标，满篇下划线。
   - `exact-equations` 的积分因子是 `linear-first-order` 那个术语的推广。术语表已经有它，指向第一次定义的地方，这张卡片不另挂术语是对的。
3. **二元函数的连续性**（`bifurcations` 的必要条件、`existence-uniqueness:39` 的「$f_y$ 在有界闭矩形上连续就有界」）：不用加多变量微积分的前置，各补半句说明就够，可改可不改，不算问题。
   - 这两处用的都是一元结论的直接推广，一元的版本在链上：`bifurcations` 的链上有单变量微积分的连续性（`calculus.continuity`）；`existence-uniqueness` 的链上有数学分析的有界性定理（`math.analysis.extreme-value`）。
   - 建议的说法：
     - `bifurcations:64`：「设$f$、$f_y$连续（$(y,\mu)$靠近$(y^*,\mu_0)$时，函数值也靠近）」。
     - `existence-uniqueness:39`：「有界闭矩形上的连续函数有界（和[有界性定理与最值定理](lesson:math.analysis.extreme-value)一样，用两次致密性定理证）」。
   - 皮卡-林德勒夫定理里的「$f$在矩形$R$上连续」同理。
4. **$f_y$ 用文字说明、不加偏导数的前置**：可以。这两节只把 $f_y$ 当作「另一个变量固定时，对 $y$ 求导」，没用到偏导数的其他性质（混合偏导、多元链式法则）。真正要用多元链式法则和二元展开的是 `numerical-methods` 第 6 题，那里也没说明 $f_x$、$f_y$，见小问题 3。
5. **「稳定」就是渐近稳定，半稳定算不稳定的一种**：和以后的李雅普诺夫稳定性不冲突，现在不用改。
   - **为什么不冲突**：李雅普诺夫的「稳定」是附近出发的解都留在附近，「渐近稳定」是稳定并且趋于平衡点，「不稳定」就是不满足「稳定」。
     - 一维时，孤立的平衡点只要两侧的解都留在附近，就一定趋于它，两种稳定是一回事，所以这一节不区分是对的。
     - 半稳定的平衡点一侧的解跑开，按李雅普诺夫的定义也是不稳定的，和这里的说法一致。
   - **以后要交代的**：两者的区别出现在平面上：中心附近的解绕着它转、不趋于它，是稳定而不渐近稳定。分析力学 `small-oscillations` 说的「稳定平衡点」就是这种。写 `lyapunov-stability`（以及 `phase-plane-linear` 里的中心）时，要交代一维那节的「稳定」指渐近稳定。这句写进了「要写回 plan.md 的」。
   - **两处措辞，可改可不改**：
     - `autonomous-equations:51` 说「本节简称稳定」，可 `bifurcations` 从 `:24` 起也这样用，不在「本节」里。可以改成「本节和[分岔](lesson:math.ode.bifurcations)里简称稳定」，或者在 `bifurcations:24` 加「（稳定都指渐近稳定）」。
     - 同一处「离$y^*$任意近处出发的解里总有跑开的」，可以说成「总有离开$y^*$某个固定范围的」。这正是李雅普诺夫的不稳定，以后可以直接引用。
6. **相图横轴是时间**：交代清楚了。
   - `what-is-ode:74` 说动点每走一步 $x$ 都增加同样的量，所以轨迹就是解曲线。`separable:78`、`autonomous-equations:88`、`bifurcations:99` 都写了「横轴是时间（图上写作 x）」。`linear-first-order:76` 的方程本来就以 $x$ 为自变量，写的是「横轴可以看成时间」。
   - 我在页面上让动画跑了起来（做法见「没验证的地方」）：6 个相图在默认参数下截图看过，滑块两端按方程算过。说明描述的现象都对得上，只有小问题 1 的 `separable:78` 那句。
   - **组件本身的一个现象**，不算内容问题，但写内容会话应该知道：
     - 尾迹只留最近 8 个单位的模拟时间（`packages/anim/src/PhasePortrait.tsx:30`，`TRAIL_SECONDS = 8`），轨迹也不会循环。
     - 横轴超过 8 个单位的 4 个（`bifurcations` 是 10，`separable`、`autonomous-equations` 是 12，`linear-first-order` 是 15），曲线前面一段会边跑边淡掉。
     - 轨迹跑出画面后约 8 秒，画面上就只剩方向场，要点「重置」重放。
     - 写进「要写回 plan.md 的」第 4 条。
7. **两处跨领域链接**（`exp-log-construction` 第 8 题、`jacobi-condition:36`）：这次不看，复核时只看这两处。现在 `existence-uniqueness` 里 `thm-picard-lindelof`、`thm-systems` 两个锚点都在。`thm-systems` 讲了高阶方程给定 $y$、$y'$ 等初值时解唯一，接得住雅可比方程那处引用。

## _domain.yaml

术语表新增 32 条：

- 微分方程、常微分方程、通解、特解、初值问题、方向场、解曲线、等倾线；
- 可分离变量的方程、逻辑斯谛方程、环境容纳量；
- 一阶线性方程、积分因子；
- 恰当方程、势函数；
- 欧拉法、局部截断误差、整体误差、改进的欧拉法、四阶龙格-库塔法；
- 自治方程、平衡点、相线、渐近稳定；
- 分岔、分岔图、鞍结分岔、跨临界分岔、叉式分岔；
- 利普希茨条件、皮卡迭代、皮卡-林德勒夫定理。

- **简介都准确**，字数构建查过；都只用到读者第一次用到这个术语时已经懂的概念。「常微分方程」的简介提到偏导数，只是用来说明「有偏导数的不算」，可以。
- **锚点**：32 条落在 26 个锚点上，都是下定义或叙述定理的那一段。页面上的定义卡片逐个看过，上方都显示了术语名。共用锚点的几组都是在同一段里一起定义的，例如通解和特解、逻辑斯谛方程和环境容纳量、局部截断误差和整体误差。
- **和别的领域没有重名**：全仓库的术语表比过中文名和英文名，唯一相关的是分析力学的「相空间」，这一批没用到。
- **宏**：`\R`、`\vb`、`\dd`、`\dv` 是批次 0 定的，和别的领域一致，这次没改。
- **25 节文件头的记号和说法**：和数学分析、变分法一致，没发现不一致的地方。
  - 导数写 $y'$，微分号用 `\dd`，向量用 `\vb`（如 `first-order-systems` 的 $\vb{x}'=A\vb{x}$），矩阵指数写 $e^{tA}$。
  - 「一致收敛」「魏尔斯特拉斯判别法」「积分号下求导」「介值定理」和数学分析术语表里的名字一样。
  - `existence-uniqueness` 第 8 题链接的「共轭点」用的是变分法的锚点。
  - 17 节还是 `outline`，它们的前置是批次 0 审过的，这次只看了记号和说法。
- **补标**：这是新领域的第一批，本领域没有已写的小节要补标。批次 5 定的补标规矩只管本领域，别的领域里提到这些词的地方不在范围里。

## 前置

8 节的前置和批次 0 定的一样，这次没有改。按整张图算了 8 节的前置链：

- **都是最少的**，构建没有「多余前置」的警告。
- **链上缺的概念**：链式法则、多元复合函数的链式法则、级数，见重要那条。
- **其余链外的引用都合规，或者在小问题 3 里**：
  - `autonomous-equations:46` 引用后面 `existence-uniqueness` 的唯一性：写了条件「$f$ 连续可导」，加了链接，符合 `sketch` 那条。
  - `existence-uniqueness:56` 的魏尔斯特拉斯判别法：按台阶 1 定的办，合规。
  - `exact-equations:32` 的积分号下求导：加了链接，但缺规矩 C 的标记和条件（小问题 3）。
  - `linear-first-order:41` 的微积分基本定理：加了链接，但缺英文括注（小问题 3）。
  - `numerical-methods:48`、`:53` 的梯形公式、辛普森公式和定积分：链上没有定积分，但这两处只是「为什么这样定义」里的类比，不影响主线，英文也括注了。单变量微积分里也没有讲数值积分的小节可以链接，我认为可以不改。
  - `bifurcations`、`existence-uniqueness` 的二元函数连续性：见「问的几处」第 3 条。
- **改前置以后**：全图算过，所有小节的层级都不变（`what-is-ode` 8、`exact-equations` 9、`existence-uniqueness` 14）。以 `exact-equations` 为前置的热力学 `entropy` 也不变（19）。

## 我替你定的

都能撤回。

1. **新建验算辅助文件 `tools/verify/math.ode._numeric.ts`**，里面的函数：
   - 四阶龙格-库塔法（含步数加倍外推）；
   - 求爆破时间；
   - 二分法、黄金分割求极大、格点加细求最大值；
   - 辛普森公式；
   - 「两侧都回来」的稳定性检验。
   - 只放通用方法，不含哪道题的答案。
2. **前置的缺口按重要报，并把台阶 1 问的「级数」并进这一条**：三处都是主线推导里读者要会用的工具，不是只引用结论的分析定理；改法都是文件头的一行，层级不变。如果你们认为只是小问题，可以降级，改法不变。
3. **级数推荐加 `math.calculus.series`，不推荐改写**：改写要动四处，加前置只改一行。
4. **两节的阅读时间没有报**：`bifurcations` 标了 35 分钟、`existence-uniqueness` 标了 40 分钟，超过方案说的 20 到 30 分钟。
   - 分析力学已经有 7 节标了 35 到 40 分钟，都审过了。
   - 这两节的内容各围绕一个主题（分岔的三种标准形式；利普希茨条件和皮卡迭代），拆开反而散。
5. **「问的几处」第 3、5 条给的措辞改动都标成「可改可不改」**，不算问题。
6. **`numerical-methods:79` 给了两种改法**（改说明，或只画龙格-库塔法的顶点），由写内容会话选。

## 要写回 plan.md 的

1. **放进「每批的流程」第 3 条前置那一项的末尾**，前提是你同意「问的几处」第 3、4 条：
   - 「`sketch` 的小节用到一元结论的直接推广（二元函数的连续性、有界闭矩形上的连续函数有界），或者把另一个变量固定、对 $y$ 求导（写作 $f_y$）时，说清意思、链接一元的那一节即可，不列多变量微积分为前置；要用多元复合函数的链式法则、多元泰勒公式时仍要列（批次 6 审查时定的）」。
2. **放进「内容生产与审查流水线」批次 6 那一段**，给以后写 `lyapunov-stability`、`phase-plane-linear` 的会话留话：
   - 「`autonomous-equations`、`bifurcations` 里的『稳定』都指渐近稳定。写李雅普诺夫稳定性时，把『稳定』定义成附近出发的解都留在附近，并交代一维孤立的平衡点两者一样；平面上的中心、分析力学 `small-oscillations` 里的『稳定平衡点』是稳定而不渐近稳定的例子（批次 6 审查时提的）」。
3. **批次 6 改的前置**（修订以后按实际写）：
   - `what-is-ode` 加 `math.calculus.chain-rule`；
   - `exact-equations` 的 `math.vector-calculus.partial-derivatives` 换成 `math.vector-calculus.multivariable-chain-rule`；
   - `existence-uniqueness` 加 `math.calculus.series`；
   - 层级都不变。
4. **放进附录 PhasePortrait 的说明**（你新加的「状态变量不能叫 `t`……写成 `{ x: "1", y: "f(x, y)" }`」那条后面），由写代码的会话核对代码以后决定写不写：
   - 「尾迹只留最近 8 个单位的模拟时间，轨迹不循环：用 `x: "1"` 画解曲线时，横轴超过 8 个单位，前面一段会边跑边淡掉；轨迹跑出画面以后要点『重置』重放（批次 6 审查时看到的）」。
5. **放进「术语规范」**，可选，把写内容会话问的那件事说死：
   - 「『解』这类每一块都会出现的基础词不进术语表；它的定义段照样加锚点，卡片上方不显示术语（批次 6 时确认）」。

## 需要你决定的

无。

## 没验证的地方

- **内置浏览器面板没显示**（会话窗口没打开），页面里的动画帧不触发。
  - 我在页面的控制台里临时把 `requestAnimationFrame` 换成 `setTimeout`，暂停再播放让组件用上它，再让动画跑到需要的时刻，按「暂停」截图。
  - 这样跑时模拟时间约是真实时间的 2 倍，所以动画的快慢和流畅度没验证，要你在 Chrome 里看。
- **滑块两端没在页面上拖**：6 个相图只截了默认参数的画面，滑块两端是按方程算的（`separable` 的 $r$、`linear-first-order` 的 $k$、`autonomous-equations` 的 $a$、`bifurcations` 的 $\mu$）。
  - `numerical-methods` 的 $N=1$ 是在控制台里设好再截图的。
  - `existence-uniqueness` 的部分和动画只按式子算过，没有截图。
- **只看了暗色主题**（跟随系统）。3 张 SVG 只用 `currentColor` 和带默认值的页面变量，亮色按代码核对。
- **阅读时间没有实测**：两节的 35、40 分钟，其余 6 节的 25 到 30 分钟。
- **三道选择题是在例子上判的，不是证明**：`what-is-ode` p2（换掉某一阶导数，看式子变不变来定阶数）、`exact-equations` p4（4 个圆上的环路积分）、`existence-uniqueness` p4（两种加细程度下的差商）。每个选项我另外逐条手推过，结论一致。
- **`autonomous-equations` p3 的极限只模拟到 $t=10^4$**：这时离 $2$ 约 $10^{-4}$，解像 $\frac1t$ 那样慢慢靠近。比对的是那附近 $|f|$ 的最小点，按方案「标准答案是极限值」那条办。
- iPad 没看。

## 修订说明（写内容会话）

2026-11-11。重要 1 条、小问题 3 条都改了；同一类问题在这一批里另外找到的也一起改了，分开写在每条下面。「问的几处」第 3、5 条的措辞也顺手改上。改动范围：`content/math/ode/`，加上台阶 1 定的两处跨领域链接和那两节的 status 行。相图尾迹（「问的几处」第 6 条）要等台阶 1 给组件加参数，这次没动动画。

### 重要 · 前置链上缺的概念

- 三个文件头照建议改了：
  - `what-is-ode` 加 `math.calculus.chain-rule`；
  - `exact-equations` 的 `math.vector-calculus.partial-derivatives` 换成 `math.vector-calculus.multivariable-chain-rule`；
  - `existence-uniqueness` 加 `math.calculus.series`。
  - 构建没有「多余前置」的警告。
- `existence-uniqueness` 补的两处半句（按「问的几处」第 1 条）：
  - `:56`（证明思路「迭代收敛」）：记 $c_n=\frac{ML^nh^{n+1}}{(n+1)!}$，$\frac{c_{n+1}}{c_n}=\frac{Lh}{n+2}$ 在 $n\ge2Lh$ 以后不到 $\frac12$，所以 $\sum c_n$ 的部分和单调增，又不超过前面几项加一个几何级数，由单调有界原理收敛。「部分和」「几何级数」「单调有界原理」都在链上，第一次出现括注了英文。
  - 第 6 题提示 3 和参考解答：「这些数的和是 $\frac ML(e^{Lh}-1)$」改成同样的几何级数比较，没有用泰勒级数。
- 另外两处用到级数的地方（`:46` 的 $e^x=\sum\frac{x^k}{k!}$、例 1 的 $e^{x^2}$）在加了 `calculus.series` 以后不用改。

### 小问题 1 · 动画说明和画面对不上

- `separable:78`：
  - 改成「从 $0$ 和 $\frac12$ 之间出发的解是 S 形曲线，起点在 $\frac12$ 到 $1$ 之间（包括 $\frac12$）的只剩 S 形的上半截，一开始就越走越缓」。
  - 同一段的「可除了 $0$，所有解最后都趋于环境容纳量 $1$」改成「可正的解最后都趋于环境容纳量 $1$」。
- `numerical-methods:79`：选了第二种改法。
  - 去掉龙格-库塔法的折线，用 `points` 只画它在 $x=1$、$x=2$ 处算出的两个值。式子是每步乘的数 $1+h+\frac{h^2}2+\frac{h^3}6+\frac{h^4}{24}$（$h=\frac1N$）的 $N$ 次方、$2N$ 次方。
  - 说明改成「两个圆点是四阶龙格-库塔法在 $x=1$、$x=2$ 处算出的值，$N=1$ 时就几乎落在 $e^x$ 上」。原来「顶点之间连成直线只是为了看得清楚」那句改成只说欧拉法：「顶点之间的线段就是沿方向场的小线段走的那一步」，这对欧拉法是实情。
  - 页面上 $N=1$ 截图看过：两个点在曲线上，欧拉法的折线在下面。
  - 为什么不只改说明：画面上那两段直线仍明显高出曲线，读者还是会以为龙格-库塔法不准。
- 同类：其余 6 个动画的说明按滑块两端又对了一遍，没有别的对不上。

### 小问题 2 · 说的比能证明的多

- `numerical-methods:37`：
  - 定理加上「$f$ 对 $y$ 满足 $|f(x,y)-f(x,z)|\le L|y-z|$（$L$ 是常数）」，结论改成「在有界区间上，整体误差是 $h$ 的量级」。
  - 证明思路 `:39` 相应改成「前面的误差每走一步至多放大到 $1+hL$ 倍，这正是定理里对 $f$ 的条件保证的」。
- `bifurcations:64`：
  - 最后一句改成「所以只要平衡点不从无穷远处来、也不跑到无穷远去，分岔就只可能发生在……」。
  - `:68` 加了报告给的反例 $y'=\mu-e^y$。
  - 例 2 的「为什么想到这么做」（`:115`）补了这一条在那里为什么成立：$\mu$ 有界时，三次方程的根也有界。
  - 常见误区 `:125` 说的是反方向（满足 $f=0$、$f_y=0$ 不一定分岔），没改。
- `existence-uniqueness:46`：改成「下面的定理只保证它们在 $0$ 附近一致收敛到解 $e^x$；不过这里相邻两项之差 $\frac{x^{n+1}}{(n+1)!}$ 在任何有界区间 $|x|\le a$ 上都不超过 $\frac{a^{n+1}}{(n+1)!}$，照定理的证明思路，它们在每个有界区间上都一致收敛到 $e^x$」。
- 同类找到的 3 处：
  - `numerical-methods:46`「改进的欧拉法是二阶方法」、`:53`「龙格-库塔法局部截断误差是 $h^5$ 量级、整体误差是 $h^4$ 量级」，都补了「$f$ 足够光滑时」，和第 6 题的条件一致。
  - `existence-uniqueness:71`「要么对所有 $x>x_0$ 都存在，要么在有限的 $x$ 处爆破」原来没有证明思路，补了一句：从走到的端点再用定理往前接，只要 $|y|$ 有界，每次能接上的长度就有一个正的下界。

### 小问题 3 · 链外的词

- 报告列的 6 处：
  - `exact-equations:32`：「积分号下求导」标了 `math.analysis.differentiation-under-integral`，括注 differentiation under the integral sign，并写明条件：$N$、$\frac{\partial N}{\partial x}$ 在矩形上连续，正满足含参变量积分里的条件。
  - `linear-first-order:41`：链接后括注 fundamental theorem of calculus。
  - `what-is-ode:27`：「偏导数」括注 partial derivative。
  - `numerical-methods` 第 6 题：
    - 提示 1 说明 $f_x$、$f_y$ 是偏导数，链接[偏导数](lesson:math.vector-calculus.partial-derivatives)和[多元复合函数的链式法则](lesson:math.vector-calculus.multivariable-chain-rule)。
    - 提示 2 的「展开到一阶」链接[全微分与切平面](lesson:math.vector-calculus.differentiability)。
    - 提示 3、参考解答也各加了链接。
    - 说明放在提示 1，不是提示 2，因为 $f_x$ 在提示 1 就出现了。
  - `what-is-ode` 第 5 题：提示 3 写成「是零点集的上确界（supremum，见[实数的完备性](lesson:math.analysis.completeness#def-supremum)）」，参考解答的「上确界」也链接到同一处。
  - 爆破：`separable` 第 8 题提示 2、`linear-first-order` 第 7 题题干是第一次出现，括注了 blow-up。
- 同类找到的（按改过的前置重算了每节的链，脚本列出链外词，逐个看过）：
  - `exact-equations` 第 5 题：提示 2 的「微积分基本定理」「积分号下求导」、提示 3 的「微积分基本定理」、参考解答的这两处，都加了链接。微积分基本定理不在这一节的链上。
  - 同一题别处有链接、这几处没有的，也补上了：
    - `exact-equations` 第 7 题参考解答的「熵」；
    - `exact-equations` 第 8 题提示 1、参考解答的「隐函数定理」；
    - `existence-uniqueness` 第 6 题提示 3、参考解答的「魏尔斯特拉斯判别法」；
    - `existence-uniqueness` 第 8 题参考解答的「共轭点」。
  - `what-is-ode` 第 2 题提示 2 的「偏导数」加了链接。
  - `exact-equations:30`：换了前置以后偏导数在链上，第一次出现按规矩 C 括注了 partial derivatives。
- 看过、不改的：
  - `numerical-methods` 的梯形公式、辛普森公式：照报告「前置」一节的意见。
  - `autonomous-equations` 的「单调有界的函数有极限」（`:46`，第 4–6 题）：链上的 `calculus.special-limits` 要求「知道第二个极限为什么存在」，用的就是单调有界准则，算学过。
  - `existence-uniqueness` 方程组那段（`thm-systems`）的「向量」：线性代数不在链上，但这里只用到「$n$ 个数排成一组，长度是平方和开方」。就地写出了长度 $|\vb y|=\sqrt{y_1^2+\dots+y_n^2}$，不加前置。

### 问的几处 · 措辞

- 第 3 条：
  - `bifurcations:64` 加了「（$(y,\mu)$ 靠近 $(y^*,\mu_0)$ 时，函数值也靠近）」。
  - `existence-uniqueness:39` 加了「有界闭矩形上的连续函数有界，证法和[有界性定理与最值定理](lesson:math.analysis.extreme-value)一样，只是要用两次致密性定理（Bolzano–Weierstrass theorem）」。
- 第 5 条：
  - `bifurcations:24` 加了「这里的稳定和上一节一样，都指渐近稳定（asymptotically stable）」，标了术语。
  - `autonomous-equations:51` 的「不稳定」改成「如果有一个固定的范围，离 $y^*$ 任意近处出发的解里，总有跑出这个范围的」。

### 两处跨领域链接（台阶 1 定的）

- `exp-log-construction/problems.yaml` 第 8 题提示 3 指向 `lesson:math.ode.existence-uniqueness#thm-picard-lindelof`。
- `jacobi-condition/lesson.md:36` 指向 `#thm-systems`。
- 两节的 status 都退回 written，别的没动。

### 检查

- `npm run content`：0 个错误、0 个警告。构建会查链接里的锚点在不在，新加的 6 个锚点链接都过了。
- `npm test`：21 个文件、184 个测试通过。
- 自查脚本（术语标记、英文括注、每段句数、卡片截断）：8 节只剩以前认定的三处，两处是链接后括注英文，一处是同一块里全称后的简称。
- 页面：网站构建到临时目录，`numerical-methods` 的动画在 $N=1$ 时截图看过。

### 问的几处 · 第 6 条：相图尾迹（台阶 1 加了 `trail: full` 以后）

- 用 `x: "1"` 画解曲线的 5 个相图都加了 `trail: full`：`what-is-ode`、`separable`、`linear-first-order`、`autonomous-equations`、`bifurcations`。`exact-equations` 的轨迹是绕圈的等值线，保持默认。
- 说明文字：5 处都没有讲尾迹变淡、要点「重置」重放的句子，所以没改。
- 页面上看过，网站构建到临时目录：
  - 做法：在控制台把 `requestAnimationFrame` 换成用 `MessageChannel` 派发，每帧时间戳加 100 毫秒，跑 200 帧后停住；先点「暂停」「播放」让组件用上它，再截图。
  - 结果：5 个动画的解曲线都从起点整条留着、不变淡，走到右边界停住。
  - 滑块两端看了两处：`separable` 的 $r=0.5$，从 $0.05$ 出发的 S 形整条在图上，到 $x=12$ 升到 $0.95$ 左右；`bifurcations` 的 $\mu=0.05$，从 $\pm1.5$、$\pm0.1$ 出发的解到 $x=10$ 都还没贴近 $\pm\sqrt\mu$。都和说明一致。
- `npm run content` 0 个错误、0 个警告。

## 复核

2026-11-11，审内容 agent。只看这次的修订，不重复已经报过的问题。

### 结论

- **原来的 1 条重要、3 条小问题都改对了**，同类另找出来的那些也改对了。「问的几处」第 3、5 条的措辞、`trail: full`、两处跨领域链接都核过，没有问题。
- **新问题：小问题 1 条**（同一类，三处）。新加的链接在句子里当名词用，又是这一节第一次出现，却没括注英文。涉及 `numerical-methods` 第 6 题、`exact-equations` 第 5 题，见「新问题」。
- **改了没报的**：没有。
- **status**：
  - 改成 `reviewed` 的（8 节）：`what-is-ode`、`separable`、`linear-first-order`、`autonomous-equations`、`bifurcations`、`existence-uniqueness`，以及两处跨领域链接所在的 `math.analysis.exp-log-construction`、`math.calculus-of-variations.jacobi-condition`。
  - 暂不改的（2 节）：`numerical-methods`、`exact-equations`，等新问题改完再复核。

### 怎么核的

- **还原修订前的版本，逐行比对**：
  - 修订前的文件取自本会话审查时读文件的原样输出（会话记录里有），还原了 19 个文件：8 节的 `lesson.md` 和 `problems.yaml`、3 张 SVG、`_domain.yaml`。
  - 这次改了其中 14 个：8 个 `lesson.md` 和 6 个 `problems.yaml`。3 张 SVG、`_domain.yaml`、`autonomous-equations` 和 `bifurcations` 的 `problems.yaml` 没动。
  - 每一处改动都在修订说明里，反过来修订说明列的也都改了。两处跨领域链接用 `git diff HEAD` 看过：各只改了链接的锚点和 status 行。
- **数学**：新写的句子逐条核过，例如：
  - `numerical-methods:37` 加上利普希茨条件以后，第 5 题正好证了这个结论。
  - `existence-uniqueness:56`：$\frac{c_{n+1}}{c_n}=\frac{Lh}{n+2}$，$n\ge2Lh$ 时小于 $\frac12$。
  - `existence-uniqueness:46`：$|x|\le a$ 上相邻两项之差不超过 $\frac{a^{n+1}}{(n+1)!}$。
  - `existence-uniqueness:71`：$|y|$ 有界时每次能接上的长度有正的下界，所以解只能在 $|y|$ 无界处停下。
  - `bifurcations:64` 加了限定以后的结论：平衡点不跑到无穷远时，在有界范围里用定理和连续性就能推出来。
  - `bifurcations:68` 的反例 $y'=\mu-e^y$、例 2 的「$\mu$ 有界时三次方程的根也有界」。
- **跑了的检查**：
  - `npm run content`：改 status 前后各跑一次，都是 0 个错误、0 个警告。
  - 8 个验算脚本：32 道一致；`exp-log-construction`、`jacobi-condition` 的验算脚本各 4 道一致。
  - `npm test`：21 个文件、184 个测试通过。
  - 层级用编译出来的 `generated/graph.json` 核过：`what-is-ode` 8、`exact-equations` 9、`existence-uniqueness` 14、热力学 `entropy` 19，都没变。
- **检查脚本**：第一轮的术语标记、每段句数、锚点段、链外词四个脚本重跑了，结果和第一轮一样，没有新问题。题目文字里新加的链接是逐个人工看的，新问题就是这样找到的。
- **页面**：`npm run build` 以后用 test-serve 打开（3143 端口），进度写进临时仓库。
  - 8 节共 1505 个 KaTeX 公式，0 处报错。
  - 控制台只有 8 条 404，是我自己脚本里多发的 8 次请求，页面本身没有报错。
- **动画**：按你说的办法做的。
  - 把 `requestAnimationFrame` 换成用 `MessageChannel` 派发，每帧时间戳加 100 毫秒；每跑 10 帧停 40 毫秒，让页面处理滑块的改动。另外拦截 `fillText` 读出画面上的 $t$。
  - 「重置」会把滑块也恢复成默认值，所以看滑块两端时不点重置，改滑块本身就会让轨迹从头开始。
  - 5 个 `trail: full` 的相图都在默认参数下跑完截图看过；滑块两端看了 `separable` 的 $r=0.5$ 和 $2$、`linear-first-order` 的 $k=0.3$ 和 $3$、`autonomous-equations` 的 $a=0.2$ 和 $0.8$、`bifurcations` 的 $\mu=-1$ 和 $0.05$。解曲线都整条留着、到右边界停住，说明描述的现象都在画面里。
  - `numerical-methods` 的 $N=1$ 截图看过：两个圆点落在 $e^x$ 上，欧拉法的折线在下面。
- **两处跨领域链接**：页面上的链接分别指向 `#thm-picard-lindelof` 和 `#thm-systems`。点过去以后，对应的定理卡片会闪一下，说明定位对了。

### 逐条

- **重要 · 前置**：三个文件头照建议改了，改了没有带来「多余前置」的警告，层级也没变。`existence-uniqueness:56` 和第 6 题改用几何级数比较，不再用 $e^x$ 的泰勒级数；「部分和」「几何级数」「单调有界原理」现在都在链上，第一次出现括注了英文。
- **小问题 1**：
  - `separable:79` 改得对：起点在 $\frac12$ 到 $1$ 之间的解一路下凹，「一开始就越走越缓」也对；「正的解」也对。
  - `numerical-methods` 选了画圆点。顶点之间的线段只对欧拉法说，「就是沿方向场的小线段走的那一步」，这对欧拉法确实成立。
- **小问题 2**：三处都改得对，同类另找的三处（改进的欧拉法、四阶龙格-库塔法的阶，以及解的延伸）也对。
- **小问题 3**：报的 6 处都改了；同类另找的各处也都加了链接，`exact-equations:30` 补了英文。「看过、不改的」三条理由都成立，例如单调有界准则确实在 `calculus.special-limits` 的目标里。
- **措辞**：`bifurcations:24` 说明了这里的稳定指渐近稳定，并标了术语；`autonomous-equations:51` 的「不稳定」现在和李雅普诺夫的说法一致；`bifurcations:64`、`existence-uniqueness:39` 也补了说明。
- **`trail: full`**：5 个画解曲线的动画都加了，`exact-equations` 保持默认，和附录的说明一致。

### 新问题

- **小问题 · 新加的三处链接当名词用，又是这一节第一次出现，没有括注英文**：
  - **依据**：方案「术语规范」第一条：题目文字里第一次出现的新名词同样括注英文全称；链接文字在句子里当名词用，算这个词第一次出现。第一轮报的 `linear-first-order:41` 就是同一种情况。
  - **`numerical-methods/problems.yaml:91`**（第 6 题提示 1）：「$f_x$、$f_y$是$f$对$x$、$y$的[偏导数](…)，$y''$这一步是用[多元复合函数的链式法则](…)对$f(x,y(x))$求导」。这两个词在这一节的正文里都没出现过，这里是第一次。
  - **`exact-equations/problems.yaml:87`**（第 5 题提示 2）：「由[微积分基本定理](…)得到」。这一节的正文和前 4 题都没提过它，它也不在这一节的链上。
  - **建议**：分别括注 partial derivative、multivariable chain rule、fundamental theorem of calculus。
- **可改可不改**：`numerical-methods` 动画在 $x=2$ 处的圆点正好压在画面右边框上，页面上只露出半个（横轴范围是 $[0,2]$）。不影响读，说明里说的「两个圆点」也看得出来。要露出整个点，可以把横轴放宽到 $2.1$，同时把纵轴放到 $8.5$（$e^{2.1}\approx8.17$）。

### 改了没报的

没有。

### 状态

- 8 节的 `status` 改成了 `reviewed`：`what-is-ode`、`separable`、`linear-first-order`、`autonomous-equations`、`bifurcations`、`existence-uniqueness`、`exp-log-construction`、`jacobi-condition`。
  - 都只改了第 11 行，和改之前的备份比过，换行仍是 LF。
  - 改完 `npm run content` 仍是 0 个错误、0 个警告。
  - `exp-log-construction/lesson.md`、`jacobi-condition/lesson.md` 现在和 HEAD 一样；那两节剩下的改动只有 `exp-log-construction/problems.yaml` 和 `jacobi-condition/lesson.md` 里的链接。
- `numerical-methods`、`exact-equations` 仍是 `written`。

### 剩下的

- 写内容会话改完新问题的三处英文以后，我复核这两节，通过就改 status。
- 提交时要带上的：
  - `content/math/ode/` 的改动；
  - 本报告；
  - 9 个验算脚本 `tools/verify/math.ode.{_numeric,what-is-ode,separable,linear-first-order,exact-equations,numerical-methods,autonomous-equations,bifurcations,existence-uniqueness}.ts`；
  - 两处跨领域链接：`content/math/analysis/exp-log-construction/problems.yaml`、`content/math/calculus-of-variations/jacobi-condition/lesson.md`。它们属于另外两个领域，按「每个领域各自作为一个提交」怎么分，由你定。

## 修订说明（第二轮，写内容会话）

2026-11-11。复核的新问题（小问题 1 条，三处）都改了；同一类问题又找到两处，一起改了，其中一处在已经 reviewed 的 `existence-uniqueness` 里，所以把它的 status 退回了 written。「可改可不改」的圆点那条也改了。

### 小问题 · 新加的链接当名词用、第一次出现，没括注英文

- 报的三处：
  - `numerical-methods/problems.yaml:91`（第 6 题提示 1）：括注了 partial derivative、multivariable chain rule。
  - `exact-equations/problems.yaml:87`（第 5 题提示 2）：括注了 fundamental theorem of calculus。
- 这一轮在题目文字里新加的别的链接，按同样的标准逐个过了一遍，都不用改。
  - 链接文字前面一次出现时已经括注过英文的：
    - `what-is-ode` 第 2 题提示 2 的「偏导数」，正文 `:27` 先出现；
    - `what-is-ode` 第 5 题参考解答的「上确界」，提示 3 先出现，括注了 supremum；
    - `exact-equations` 第 5 题提示 3 和参考解答的「微积分基本定理」「积分号下求导」；
    - `exact-equations` 第 7 题参考解答的「熵」，提示 3 先出现；
    - `exact-equations` 第 8 题参考解答的「隐函数定理」，提示 1 括注了；
    - `numerical-methods` 第 6 题提示 3 和参考解答；
    - `existence-uniqueness` 第 6 题的「魏尔斯特拉斯判别法」，正文 `:56` 先出现。
  - 写成「见[……]」指向一节的：`what-is-ode` 第 5 题提示 3 的「见[实数的完备性]」、`exact-equations` 第 5 题提示 2 的「见[含参变量积分]」、`numerical-methods` 第 6 题提示 2 的「见[全微分与切平面]」。
- 同一类，另找到的两处（脚本按页面顺序列出「不是『见……』、后面没有英文、这一节前面没出现过」的链接，逐个看过）：
  - `numerical-methods:39`（欧拉法定理的证明思路）：「由带拉格朗日余项的[泰勒公式]」，泰勒公式在链上，按规矩 C 第一次出现要括注英文，补了 Taylor's formula。这处是第一轮之前就有的。
  - `existence-uniqueness/problems.yaml:139`（第 8 题提示 3）：「变分法里的[共轭点]用的正是……」，共轭点是链外的词，在这一节是第一次出现，补了 conjugate point。这处也是第一轮之前就有的。因为这一改，`existence-uniqueness` 的 status 退回了 written，这一节只动了这一处和第 11 行。
- 看过、不改的：脚本还列出了几处链接文字是小节标题、在句子里当地点或出处用的，例如「这和[可分离变量的方程]里解出来的结果一致」「证法和[有界性定理与最值定理]一样」「正满足[含参变量积分]里的条件」。它们说的是「那一节里」，不是在用一个新名词，和第一轮认可的写法一样，没改。

### 可改可不改 · 圆点压在右边框上

- `numerical-methods` 动画的范围改成 `x: [0, 2.1]`、`y: [0, 8.5]`；$e^{2.1}\approx8.17$，还在纵轴范围里。
- 滑块两端在页面上看了：
  - $N=1$ 时截图看过：$x=1$、$x=2$ 两个圆点都整个露出来，落在 $e^x$ 上；欧拉法的折线在下面，到 $x=2.1$ 是 $4.4$。
  - $N=10$ 时截图没出来（面板隐藏，截到的是黑屏），改用悬停读图例：$x=1.975$ 处 $e^x=7.206$、折线 $6.574$；$x=2.032$ 处 $7.628$、$6.942$，都在画面里。$x=2$ 处的差约 $0.66$，$N=5$ 时约 $1.20$，和说明「步数加倍，差距大约减半」一致。
  - 按图例读数换算，$x=2$ 在画布里离右边界约 30 像素，圆点不会再压线。

### 检查

- `npm run content`：0 个错误、0 个警告。
- 自查脚本：这三节只剩以前认定的两处，都在 `numerical-methods`：一处是链接后括注英文，一处是同一块里全称后的简称。
- 没有 `git add`，没有提交。

## 复核（第二轮）

2026-11-11，审内容 agent。只看第二轮的改动。

### 结论

- **通过，没有新问题**。上一轮报的三处英文括注都补了；同一类另找的两处、「可改可不改」的圆点也都改得对。
- **改了没报的**：没有。
- **status**：`numerical-methods`、`exact-equations`、`existence-uniqueness` 改成了 `reviewed`。常微分方程这一批 8 节，加上两处跨领域链接所在的 `exp-log-construction`、`jacobi-condition`，现在全是 `reviewed`。

### 怎么核的

- **改动范围**：拿第一轮复核时存下的常微分方程文件逐行比对，第二轮只改了 5 行，都在修订说明里：
  - `numerical-methods:39` 补了英文（Taylor's formula）；
  - `numerical-methods:58` 的画面范围改成 `x: [0, 2.1]`、`y: [0, 8.5]`；
  - `numerical-methods/problems.yaml:91`、`exact-equations/problems.yaml:87`、`existence-uniqueness/problems.yaml:139` 补了英文。
  - 另外 5 节和上一轮比，只差我改的 status 行。`existence-uniqueness/lesson.md` 只有 status 退回了 `written`，和修订说明一致。
  - 两处跨领域文件和 HEAD 比，仍只差那两个链接的锚点。
- **几处括注**：都是这一节第一次出现，英文名都对。泰勒公式在链上，按规矩 C 第一次出现照样括注。共轭点是链外的词，第 8 题提示 3 是它在 `existence-uniqueness` 里第一次出现。修订说明里「看过、不改的」那几处，链接文字说的是「在那一节里」，不是当名词用，和第一轮认可的写法一样。
- **跑了的检查**：
  - `npm run content`：改 status 前后都是 0 个错误、0 个警告。
  - 3 节的验算脚本：12 道一致。
  - 术语检查脚本：和上一轮一样。
- **页面**：`npm run build` 后用 test-serve 打开，3 节的 KaTeX 都是 0 处报错，控制台没有报错。
  - `numerical-methods` 的 $N=1$、$N=10$ 截图看过：两个圆点都整个露出来，落在 $e^x$ 上；欧拉法的折线在下面，到 $x=2.1$ 时，$N=1$ 是 $4.4$。$e^{2.1}\approx8.17$，在纵轴的 $8.5$ 以内。
  - 说明里的「$x=2$ 处的差距」「两个圆点」都还对得上；$x$ 在 $2$ 到 $2.1$ 那一段，欧拉法的折线就是从 $x=2$ 起的下一步。

### 状态

- `numerical-methods`、`exact-equations`、`existence-uniqueness` 的 `status` 改成 `reviewed`。都只改了第 11 行，和改之前的备份比过，换行仍是 LF；改完 `npm run content` 仍是 0 个错误、0 个警告。

### 剩下的

- 可以提交了。这个提交要带上：
  - `content/math/ode/` 的改动；
  - 本报告；
  - 9 个验算脚本 `tools/verify/math.ode.*.ts`；
  - 你定的并进来的两处跨领域链接：`content/math/analysis/exp-log-construction/problems.yaml`、`content/math/calculus-of-variations/jacobi-condition/lesson.md`。


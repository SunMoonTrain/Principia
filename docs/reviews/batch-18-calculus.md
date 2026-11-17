# 批次 18 审查报告：单变量微积分（求导与中值定理）

审内容 agent（和写内容 agent 是两个独立会话，没有读它的会话记录、交接说明和自查脚本）· 2026-11-17

审查范围：`math.calculus` 的第二批 9 节：`differentials`、`chain-rule`、`elementary-derivatives`、`local-extrema`、`higher-derivatives`、`hyperbolic-functions`、`implicit-differentiation`、`mean-value-theorem`、`antiderivatives`。包括：

- 9 节的文件头、正文、`problems.yaml`（72 道题）、2 张 SVG（`differential.svg`、`chain-rule.svg`）、7 个 `function-plot` 动画；
- `_domain.yaml`：新进表 27 条，术语表从 41 条到 68 条；
- 退回 written 的 `continuity`：`:51` 的「反三角函数」补标；
- 大纲 `lhopital`：删了一项前置 `elementary-derivatives`。

另外看了：

- 以这一批为直接前置的已写小节（8 节）和别处指向这一批的用法；
- 牛顿力学 `kinematics-1d` 里原函数的记号；
- 规矩 C 两个方向的扫描。

开审前把整个 `content/math/calculus/`（含 `_domain.yaml`，72 个文件）拷了一份快照到我的 scratchpad（`b18-snapshot/`），复核时和它比。审查中途停过一次，接着审之前核对过：内容和快照逐文件一致，这一份报告审的就是快照里的版本。

## 结论

没有重要问题；小问题 2 条；没有原有问题。

- 讲解、例题、72 道题的推导和数都对。36 道简单题、中等题独立验算，全部和标准答案一致；36 道难题、思考题逐道读过，参考解答都对。
- 这一批改了 6 处前置，都必要、都是最少的直接前置。按改前、改后各算一遍全图层级，657 节一个都没变。
- 篇幅：9 节的 `minutes` 在 24–29，都不超过 30。讲解加例题的字数在 656–985 个汉字，和批次 17 那几节相当，估得不虚。
- 2 张 SVG、7 个动画都正常；10 节（含 `continuity`）在 768 像素宽下全部展开，都没有横向滚动。
- 下游 8 节和别处的用法都接得住。光学 `paraxial-refraction:32` 要的 $\sin\theta$、$\tan\theta$ 在 $0$ 附近的线性近似，靠 `differentials` 新加的前置 `special-limits` 接上了。

- **小问题 1：术语标记和第一次括注的几处遗漏**（`plan.md:242`–`:244`）
  - **「链式法则」只在链接文字里出现、在句子里当名词用，这一块没标**：
    - 出处：`elementary-derivatives:65`（「实数次幂」块）、`higher-derivatives:42`（「n 阶导数」块）、`hyperbolic-functions:40`（「导数」块）。
    - 按 `:244`「术语只出现在链接文字里、这一块又要标时，在链接前面把这个词写出来再标」改，例如「由:term[链式法则]{…}（chain rule，见[链式法则](…)）」。
  - **「可导函数」是这一块里第一次出现「可导」，没标**：
    - 出处：`local-extrema:43`（「驻点」块，同一块到 `:45` 才标）、`antiderivatives:25`（「原函数」块，这一块没有标）。
    - 照批次 17「连续函数」整个词标「连续」的做法，整个词标成「可导」。
  - **第一次出现的括注漏了缩写**：
    - `local-extrema:34` 写成「极限（limit）」，别的几节都是「（limit，lim）」。
    - `hyperbolic-functions:25` 的「双曲正弦（hyperbolic sine）」「双曲余弦」「双曲正切」：术语表给了缩写 sinh、cosh、tanh，第一次出现写成「（hyperbolic sine，sinh）」这样。
  - **「反函数的求导法则」**：
    - `implicit-differentiation:43` 在定理标签「定理（反函数的求导法则）」里起名，没括注英文；`elementary-derivatives:65` 也用这个名字（「反三角函数的导数要用反函数的求导法则」），`implicit-differentiation` 第 4 题的提示、解答也用。
    - 两节都用到，按 `:244`（定理名同样按两节以上进表）进表，两处都标；标签里照批次 17 写回的「定理名写在括号里也标在定理名里」。
    - 或者把 `elementary-derivatives:65` 改成不提名字（「反三角函数的导数见[隐函数与反函数的求导](…)」），只在 `implicit-differentiation:43` 括注英文，例如「定理（反函数的求导法则，inverse function rule）」。
- **小问题 2：`hyperbolic-functions` 第 8 题第 3 级提示「相差一倍」**
  - 原文（`problems.yaml:157`）：「$x=3$时$\cosh3-1\approx9.07$，$\frac92=4.5$，相差一倍。」
  - `plan.md:269`：比较两个量只写「是……的 N 倍」，「相差一倍」这类说法有歧义（是差了一倍，还是相差的部分等于一倍）。
  - 改成「前者约是后者的 $2$ 倍」。

## 改了没报的

无。改动和协调会话转述的一致：

- 9 节：正文、题目、2 张 SVG；文件头加了 `minutes`、`summary`，`status` 改成 `written`，标题、goal 没动。
- 前置 6 处，转述里说了「改了几处前置」：
  - `differentials` 加 `special-limits`；
  - `higher-derivatives`、`hyperbolic-functions` 各加 `chain-rule`；
  - `mean-value-theorem` 加 `elementary-derivatives`；
  - `antiderivatives`、大纲 `lhopital` 删 `elementary-derivatives`。现在能经 `mean-value-theorem` 推出，构建会报多余，这是连带的。
- `continuity` 只改了 `:51` 一处，加上 `status` 退回 `written`。
- `_domain.yaml` 只加了 27 条术语，原有条目和宏没动。

## 要修的，按小节分

- `elementary-derivatives`：`:65` 的「链式法则」标记、「反函数的求导法则」（小 1）。
- `local-extrema`：`:34` 括注补 lim，`:43`「可导函数」（小 1）。
- `higher-derivatives`：`:42` 的「链式法则」标记（小 1）。
- `hyperbolic-functions`：`:25` 括注补缩写，`:40` 的「链式法则」标记（小 1）；第 8 题第 3 级提示（小 2）。
- `implicit-differentiation`：`:43` 定理名括注英文，或进表（小 1）。
- `antiderivatives`：`:25`「可导函数」（小 1）。
- `differentials`、`chain-rule`、`mean-value-theorem`、`continuity`：无。

## 需要你决定的

无。

## 我替你定的

1. **极值用不严格的不等式定义，接受**：
   - `local-extrema:25` 的定义是「$|x-x_0|<\delta$ 时都有 $f(x)\le f(x_0)$」。所以常数函数每一点都是极值点（`:27` 写了），第 2 题选项 C 的 $|x|+x$ 在 $0$ 处也算极小值点，标准答案 A、C、D 和定义一致，第 3 级提示也写明了。
   - 不少中文教材用严格不等式，这里的选法前后一致，又和多变量微积分 `extrema:23` 一样（也是 $\le$），`extrema:25`「和一元时一样」就接上了。
2. **`implicit-differentiation:45`「严格单调的连续函数，反函数也连续（这里不证）」没给链接，不报**：数学分析里没有专门证明这一条的小节（只有 `exp-log-construction` 用到反函数），没有可链的地方。
3. **积分表不收 $\arctan$、$\arcsin$，合规**：`implicit-differentiation` 不在 `antiderivatives` 的链上，`antiderivatives:56` 只当旁白提一句、链过去，推理没用到。以后写换元、部分分式时再补进表。
4. **$\ln|x|$ 在 $x<0$ 那半边的导数没用链式法则**：`elementary-derivatives:42` 直接算 $\frac1h\ln\bigl(1+\frac hx\bigr)$ 的极限，所以 `antiderivatives` 的 $\int\frac1x\,\dd x=\ln|x|+C$ 不需要 `chain-rule` 当前置，接受。
5. **多变量微积分 `partial-derivatives:41`、`differentiability:46` 用中值定理，可中值定理不在这两节的链上**：它们是批次 13 审过的「证明思路」，靠链接引用。这一批 `mean-value-theorem:32` 的叙述（闭区间连续、开区间可导）接得住，不重提。

## 要写回 plan.md 的

1. **「内容生产与审查流水线」批次 18 之后的记录，单变量微积分这一批的记号和做法加一条**：「极值用不严格的不等式（$\le$、$\ge$），常数函数每一点都是极值点、端点不算极值点；以后的 `monotonicity`、`optimization`、`concavity` 照用（和多变量微积分 `extrema` 一致）」。
2. **「给以后写别的领域的会话留的话」或审查的验算部分加一条**：
   - 「单变量微积分的验算辅助：高阶导数、泰勒系数用 `tools/verify/math.calculus._jet.ts`（泰勒展开式算术，k 阶导数取系数乘 k!），定积分、原函数在某点的值用 `_calc.ts` 的 `integrate`（双指数求积，端点处导数无界也收敛）。」
   - 以后的 `taylor-polynomial`、`power-series` 可以直接用。
3. **「几个领域同时写时」临时副本的做法加一句（可选）**：
   - 「仓库 `node_modules` 里工作区包的链接坏了时（批次 18 审查时 `node_modules/@principia/anim` 成了空目录，`vite build`、`tsc -b` 都报找不到 `@principia/anim`），临时副本里在 `src/node_modules/@principia/anim` 建一个指向副本 `packages/anim` 的联接，就能照常构建；删副本前一样先删联接。」
   - 根本的修法是由写代码的会话在仓库里重新 `npm install`，见下面「没验证的地方」第 1 条。

## 下游和前向链接

- **以这一批为直接前置的已写小节**（8 节，都已审）：用到的这一批的概念都接得住，也都在它们自己的链上。
  - 光学 `paraxial-refraction:32` ← `differentials`：$\sin\theta$、$\tan\theta$ 在 $0$ 附近的线性近似是 $\theta$。`differentials:31`–`:38` 由第一个重要极限、$\frac{\tan h}h\to1$ 推出，列在近似表里；这要 `special-limits`，所以前置加得对。
  - 数学分析 `differentiability` ← `chain-rule`：
    - `:16` 说「常见的推导把差商拆成两个差商相乘」，`chain-rule:27` 正是这样写的。`:29` 写明假定 $\Delta u\ne0$，举了 $x^2\sin\frac1x$ 回到 $0$ 的例子，并链到这一节，第 5 题给出不除以 $\Delta u$ 的证明。
    - `:51` 的「微分 $\dd y=f'(x)\dd x$」由 `differentials:45` 定义。
    - 第 8 题用 $\sin$、$\cos$ 的导数，`elementary-derivatives` 不在它的链上，题目里已经链到那一节，合规；`ftc-proof` 第 7 题同。
  - 数学分析 `mean-value-proofs:16` ← `mean-value-theorem`：「$f$ 在 $[a,b]$ 上连续、在 $(a,b)$ 内可导，就有 $\xi$……」，条件和结论都和 `mean-value-theorem:32` 对得上。
  - 多变量微积分 `partial-derivatives` ← `elementary-derivatives`、`chain-rule`：求 $e^{xy}$ 这类偏导数要的两样都在。中值定理的用法见「我替你定的」5。
  - 常微分方程 `what-is-ode` ← `antiderivatives`、`chain-rule`；`linear-first-order:41`「同一个函数在区间上的原函数只差常数（见[原函数与不定积分]）」= `antiderivatives:30` 的定理，`:32` 用中值定理推论 2 证明，链到 `#thm-same-derivative`。
  - 常微分方程 `second-order-linear` ← `higher-derivatives`：二阶导数 $y''$。
  - 变分法 `beltrami-identity` ← `hyperbolic-functions`：`:69` 用 $(\cosh u)'=\sinh u$ 和 $\cosh^2u-\sinh^2u=1$，`hyperbolic-functions` 定理 1、2 给了。
  - 狭义相对论 `four-force` ← `hyperbolic-functions`：`:74` 的 $\cosh$、$\sinh$、$\tanh$。第 5 题（3）把相对论速度合成写成快度相加，正好和它对上。
- **别处的用法**：
  - 多变量微积分 `extrema:25`「和一元时一样」、`taylor-multivariable:41`「一元函数在那里取极值，导数为 0」：`local-extrema` 的定义和费马定理接得住。
  - 一元的「驻点」按意思另起了 `math.calculus.stationary-point`，多变量微积分那边仍标自己的 id，不冲突。
  - 数学分析 `trig-construction` 第 8 题把 $\frac{e^x\pm e^{-x}}2$ 叫双曲余弦、双曲正弦，和这里的定义一致。
- **批次 17 写回的「单变量微积分以后几批」那几条，这一批都照做了**：
  - `elementary-derivatives` 链到 `special-limits#thm-log-exp-limits`，补了实数次幂（定理 4，不用链式法则），讲了角度制多出的 $\frac\pi{180}$，`:38` 回应了 `limits-intuition` 第 4 题的 $\ln2$；
  - `mean-value-theorem` 讲了「导数处处相同的两个函数只差一个常数」（推论 2），第 6 题（3）补上了 `derivative` 第 6 题留下的唯一性。
- **牛顿力学 `kinematics-1d`（另一对同时写的，以 `antiderivatives` 为前置）**：`:46`「同一个函数在一个区间上的原函数只差一个常数（见[原函数与不定积分]）」，题目里积分常数写 $C_1$、$C_2$，和这边的 $C$、「积分常数」的说法一致。
- **这一批指向大纲的链接**（页面上显示「待写」）：`concavity`、`monotonicity`、`substitution`、`fundamental-theorem`，以及牛顿力学 `drag`。提前提到的本领域术语都标了、括注了英文，推理没用到：
  - `elementary-derivatives:47`、`mean-value-theorem:48` 的「原函数」；
  - `antiderivatives:56` 的「反三角函数」；
  - `continuity:51` 的「反三角函数」，这次的补标就是这一处。
- **以这一批为前置、还没写的别的小节**：`hyperbolic-functions` ← 偏微分方程 `laplace-separation`、牛顿力学 `drag`、量子力学 `tunneling`、热力学 `paramagnetism`。它们要的 $\sinh$、$\cosh$、$\tanh$、终端速度 $v_T\tanh\frac{gt}{v_T}$ 这里都有。`drag` 的推导在 `hyperbolic-functions:57` 已经链过去了。

## 怎么审的

- **读题与验算**：
  - 用 `npm run statements -- <9 节> --tier easy,medium` 读题，没打开 `problems.yaml`。每节一个脚本 `tools/verify/math.calculus.<小节>.ts`，`continuity` 沿用批次 17 的脚本。
  - 辅助文件：`_calc.ts` 新加了 `bisect`（二分求根）、`integrate`（双指数数值积分），原有函数没改；新建 `_jet.ts`（泰勒展开式算术，算高阶导数）。
  - 各类题的算法：
    - 导数一律按差商的定义外推，不用求导公式；
    - 高阶导数（`cos 2x` 的 10 阶、$x^2e^{-x}$ 的 8 阶）用泰勒展开式算术；
    - 隐函数在每个 $x$ 处二分解出 $y(x)$ 再求差商，反函数也先二分解出来再求差商；
    - 原函数在某点的值用数值积分 $F(b)=F(a)+\int_a^bf$，不先求原函数的式子；
    - 选择题按本节的极值定义（不严格的不等式）在邻域里取样判断；
    - `mean-value-theorem` 第 4 题是极值题，算出界，再拿 $1\pm3x$ 核对取得到，另取 200 个满足 $|f'|\le3$ 的函数确认不出界。
  - 36 道全部一致。
- **全量检查**：
  - `npm run content`：0 个错误、0 个警告；
  - `npm test`：23 个测试文件、202 个测试通过；
  - `npm run verify`：全部一致（273 个小节）；
  - `npx tsc -b`：报 4 个错，都不在这一批：`src/components/AnimRuntime.tsx`、`src/pages/GalleryPage.tsx` 找不到 `@principia/anim`（见「没验证的地方」1），另外两个在牛顿力学审查会话的验算脚本里。`math.calculus.*` 的脚本没有报错。
- **术语**：
  - 27 条新简介逐条看过，只用定义它那一节链上的概念，长度由构建查。锚点都落在起名的那一段，以句号结束。
  - 选择题选项和简介里的例子没有重复（批次 17 写回的新规矩）。
  - 用脚本查了每一节第一次标的术语都带英文括注，又逐块查了第一次出现有没有标：脚本报出的 20 来处，大多是「极大值点」「隐函数求导法」「基本初等函数」这类意思不同的长词，真漏的写在小问题 1。
- **前置**：
  - 沿每节的整条链人工核对讲解、例题和题目文字。题目里用到链外结论的都加了链接：`local-extrema` 第 5 题的最值定理、第 6 题的链式法则，`mean-value-theorem` 第 6 题、`differentials` 第 7 题的链式法则，`higher-derivatives` 第 8 题的中值定理。
  - 层级按改前、改后的前置各算一遍全图，`generated/graph.json` 的层级和算的也一致。
- **规矩 C 两个方向**：
  - 正方向：这一批借用的别的领域术语只有 `implicit-differentiation:36` 的「隐函数定理」（标了多变量微积分的 id，旁白），以及题目文字里的光学费马原理、相对论快度（都给了链接或括注）。
  - 反方向：27 个新术语在别的领域已写小节的正文里，按名字有 30 来处候选。去掉文件头、标题和「微分方程」「牛顿-莱布尼茨公式」这类长词以后，值得写代码的会话按 `plan.md:246` 看一眼的主要是「二阶导数」：
    - 变分法 `euler-lagrange:39`、`several-functions:16`、`:31`、`multivariable-functionals:79`；
    - 多变量微积分 `partial-derivatives:34`。
    - 「原函数」照 `plan.md:242` 的基础词不补，「极值」中学学过。
- **格式**：每段不超过 4 句（脚本，题目文字也查了）；引号都是「」；倍数只有第 8 题那一处，见小问题 2；正文没写「上一节」「下一节」；「例 N」「第 N 题」的引文逐个对过，跨节的都指对了。
- **页面检查**：
  - 仓库的 `vite build` 失败（`@principia/anim` 解析不了），所以照 `plan.md:1143` 用临时副本：`git archive HEAD` 导出，拷进这一批的 `content/math/calculus/`，`node_modules` 建联接；另在副本的 `src/node_modules/@principia/anim` 建一个联接指向副本自己的 `packages/anim`，构建成功。
  - 网站建在 scratchpad，服务的进度写 scratchpad 里 `git init` 过的临时仓库。浏览器面板这时是隐藏的，等待用 `MessageChannel` 让出。
  - 10 节在 768 像素宽下：8 道题都点到第 3 级提示，简单题、中等题点「放弃，看解答」再「确定放弃」，页面宽度等于视口，没有元素超出，KaTeX 的根号 svg 跳过了。
  - 2 张 SVG 用 `getBBox()` 量文字，用 `getPointAtLength()` 每 1 像素取点查压线：不出界、不重叠、不压线；颜色只用 `currentColor` 和带默认值的页面变量。
  - 7 个动画都在画布（691×415，高约为宽的 0.6）上画出了曲线，图例和图注说的颜色一致，控制台没有报错。
  - 看完删了副本（先单独删两个联接）和网站副本，服务已停；`progress/` 没动。为了用浏览器面板起服务，在 `.claude/launch.json` 里加了一条 `test-serve-calculus-review`（端口 3149），复核后删。

## 各节

- **`differentials`**：
  - 从 $\sqrt{4.1}$ 用切线近似引入，误差和 $x-a$ 之比趋于 $0$ 讲得清楚。$0$ 附近的近似表由第一个重要极限、两个推论和导数的定义里算过的导数推出，没有用链外的求导公式。
  - 微分、绝对误差、相对误差都有「为什么」和边界情况；两道例题的数都对（$40\pi$ 对 $126.9$，$1$ 对 $1.0025$）。
- **`chain-rule`**：
  - 照数学分析 `differentiability:16` 的拆法写，假定讲在明处，第 5 题补了不除以 $\Delta u$ 的证明。
  - 例题只用多项式和根式，没提前用 $\sin$、$e^x$ 的导数。
- **`elementary-derivatives`**：
  - $\sin$、$e^x$、$\ln$ 的导数都由 `special-limits` 的极限推出。$\ln|x|$ 在负半轴、实数次幂都绕开了链式法则，和它的前置一致。
  - 动画里绿色切线的斜率等于橙色 $\cos$ 的高度，看得明白。
- **`local-extrema`**：
  - 极值的定义、费马定理、驻点「反过来不对」的反例 $x^3$ 都齐全。例 2 讲不可导的点也可能是极值点，补全了「找候选点」的两类。
  - 定义的选法见「我替你定的」1。
- **`higher-derivatives`**：
  - 二阶导数的边界情况 $x|x|$ 选得好：一阶处处可导，二阶在 $0$ 处不存在。
  - 莱布尼茨公式的归纳证明和二项式定理对照着讲；例 2 的 $-x^2\sin x+20x\cos x+90\sin x$ 对。
- **`hyperbolic-functions`**：
  - 用 $e^x$ 的奇偶拆分引入，恒等式、导数、双曲线的来历都讲到了。悬链线、终端速度只做验证，推导链到力学（`drag`），合规。
  - 4 条曲线的颜色和图注一致（第 4 条是紫色）。
- **`implicit-differentiation`**：
  - 隐函数只要求「在一点附近」，例子 $y^5+y=x$ 选得好。反函数求导的条件写全了（连续、严格单调、$f'(x_0)\ne0$），$f'(x_0)=0$ 时的竖直切线和批次 17 的切线定义接上了。
  - 动画把纵轴取成横轴的 $0.6$ 倍，$y=x$ 画成 $45^\circ$，对称看得出来。
- **`mean-value-theorem`**：
  - 罗尔定理的三个条件各有反例；拉格朗日中值定理「把弦拉平」的证明清楚；两个推论直接回答了开头「速度表一直指着 0」的问题。
  - 动画的弦斜率 $1.125$、两个 $\xi\approx\pm1.32$ 都对（$\xi^2=1.75$）。
- **`antiderivatives`**：
  - 原函数在区间上「只差常数」由中值定理推论 2 给出。边界情况用台阶函数（达布定理，链到 `local-extrema` 第 5 题）和 $\frac1x$ 的两段常数。
  - 积分表只收链上推得出的几条，见「我替你定的」3、4。

## 没验证的地方

1. **构建环境坏了一处，不是这一批的问题，要写代码的会话处理**：
   - 仓库的 `node_modules/@principia/anim` 现在是一个空的普通目录，不是指向 `packages/anim` 的链接。仓库里直接 `vite build`、`tsc -b` 都因为找不到 `@principia/anim` 失败。
   - 我没有动仓库的 `node_modules`，页面检查在临时副本里绕过去了。修法可能是在仓库里重新 `npm install`，由写代码的会话决定。
   - 可能是哪个会话删临时副本时先删内容、后删联接弄坏的；那个目录的修改时间显示是 11 月 8 日，原因没查清。
2. **截图**：面板隐藏时只能用 DOM 和画布像素检查，没有截图看效果；亮色主题和真机也没看。
3. **动画的滑块端点**：按表达式手算过，现象都在画面里，没有逐个拖到端点截图：
   - `elementary-derivatives` $a=\pm6$；
   - `local-extrema` $a=\pm2.2$，点在 $y=\pm4.05$；
   - `implicit-differentiation` $a=1.3$，$e^{1.3}=3.67<4$；
   - `antiderivatives` 两个滑块的四个端点，点在 $y=\pm3.67$。
4. **难题、思考题**：人工核对，没写脚本。

## 修订说明（写内容会话）

没有重要问题，小问题 2 条都照改了，没有不改的。同类问题在 9 节和 `continuity` 里整批找过：正文另补了 3 处链接文字当名词用的地方，题目文字补了 14 处第一次出现的英文括注，都写在各条的「同类」里。新进术语表 1 条（「反函数的求导法则」），术语表现在 69 条。只改了 `content/math/calculus/` 的文件，题目的答案都没动。

### 小问题 1：术语标记和第一次括注的几处遗漏

- 「链式法则」只在链接文字里出现：照报告的写法，改成「:term[链式法则]（chain rule，见[链式法则](…)）」。
  - 改了 `elementary-derivatives:65`、`higher-derivatives:42`、`hyperbolic-functions:40` 三处。
  - `hyperbolic-functions` 里这个术语第一次出现的地方挪到了 `:40`，原来「用到双曲函数的场合」那一块（`:52`）上的英文括注删掉。
- 「可导函数」整个词标成「可导」：
  - `local-extrema:43`；同一块 `:45`「不可导」上原来的标记去掉，免得一块标两次。
  - `antiderivatives:25`，这是这一节第一次出现，括注 differentiable function。
- 括注补缩写：`local-extrema:34` 改成「（limit，lim）」；`hyperbolic-functions:25` 改成「（hyperbolic sine，sinh）」「（hyperbolic cosine，cosh）」「（hyperbolic tangent，tanh）」。
- 「反函数的求导法则」按报告的第一种办法进表：`math.calculus.inverse-function-rule`，定义在 `implicit-differentiation#thm-inverse-derivative`，简介只用链上的概念。
  - `implicit-differentiation:43` 的标签改成「定理（:term[反函数的求导法则]，inverse function rule）」，`:56`（反三角函数那一块）补标。
  - `elementary-derivatives:65` 补标，括注 inverse function rule。
  - 题目文字（`implicit-differentiation` 第 4 题）照「可标可不标」没标。
- 同类：
  - 自查脚本把「可导函数」当作「可导」的别名、加上新术语，在 18 节里重查每块第一次出现：清零。批次 17 的其余 8 节没有漏标的「可导函数」。
  - 有缩写的术语只有 4 条（极限、双曲正弦、双曲余弦、双曲正切），逐节查了第一次出现的括注，只有上面两处缺。
  - 正文的链接文字逐条看过 10 节，当名词用的另有 `antiderivatives` 三处：
    - `:32`「由[微分中值定理]的推论 2」改成「由:term[中值定理]（mean value theorem）的推论 2（见[微分中值定理](…)）」；
    - `:41`「[微积分基本定理]」补括注 fundamental theorem of calculus；
    - `:56`「以后的[换元积分法]」补括注 integration by substitution。
    - 其余都是「见某节」「某节例 N」「某节第 N 题」的用法。
  - 题目文字：这一节正文里没出现、第一次出现在题目里的术语，补了英文括注，共 14 处。
    - 链接文字当名词用的 4 处：`local-extrema` 第 5 题「最值定理（extreme value theorem）」、第 6 题「链式法则（chain rule）」、第 8 题「费马原理（Fermat's principle）」，`mean-value-theorem` 第 6 题第 2 级提示「链式法则（chain rule）」。
    - 链上学过的术语 10 处：`differentials` 第 7 题「割线」，`elementary-derivatives` 第 8 题「初等函数」「可导」，`local-extrema` 第 5 题「连续」，`higher-derivatives` 第 7 题「连续」，`implicit-differentiation` 第 1 题「乘积法则」、第 3 题「幂法则」、第 8 题「无穷大」，`mean-value-theorem` 第 6 题「商法则」，`antiderivatives` 第 8 题「连续函数」。

### 小问题 2：`hyperbolic-functions` 第 8 题第 3 级提示「相差一倍」

- 改成「前者约是后者的$2$倍」。
- 同类：10 节的正文和题目里带「倍」的说法逐条看过，共 20 来处，都是「是……的 N 倍」，或者说缩放的「放大……倍」（`chain-rule` 的图和图注），没有别的要改。

### 检查

- `npm run content`：0 个错误、0 个警告。
- `npm test`：23 个测试文件、202 个测试通过。
- 自查脚本：每块第一次出现的术语是否标记（含新术语和「可导函数」）、每节第一次出现是否括注英文和缩写、段落句数，18 节都清零。
- 题目的答案没改；36 道简单题、中等题的验算脚本重跑，仍全部一致。
- 这一轮没有重新建网站看页面：只加了术语标记和英文括注、改了一句话，没有新的公式和图。

### 跨领域补标（规矩 C）

照协调会话扫出的清单，在别的领域补了这一批新术语的标记，共 7 节、12 处，`status` 都没动。补之前每处都核对了两件事：
- 意思就是单变量微积分的那个概念；
- 定义它的小节不在那一节的前置链上（按全图的前置算过，7 节都不在）。

每处都是所在块里唯一的一次出现。其中 6 处还是那一节第一次出现，按术语规范同时补了英文括注；`direct-methods`、`inverse-implicit` 原来就有括注。

| 小节 | 位置 | 补标的词 | 英文括注 |
| --- | --- | --- | --- |
| 变分法 `several-functions` | `:16`（这一节要回答的问题） | 二阶导数、高阶导数 | 补了 second derivative、higher-order derivative |
| | `:31`（几个未知函数） | 二阶导数 | 不用补 |
| | `:52`（含二阶导数） | 「更高阶导数」里的高阶导数 | 不用补 |
| 变分法 `euler-lagrange` | `:22`（第一变分） | 二阶导数 | 补了 second derivative |
| | `:39`（算出第一变分）、`:62`（欧拉-拉格朗日方程） | 二阶导数 | 不用补 |
| 变分法 `direct-methods` | `:104`（例 1） | 双曲函数 | 原有 hyperbolic function |
| 多变量微积分 `partial-derivatives` | `:34`（高阶偏导数） | 「一元函数的二阶导数」里的二阶导数 | 补了 second derivative |
| 多变量微积分 `multivariable-chain-rule` | `:27`（沿曲线求导） | 「隐函数的求导公式」里的隐函数 | 补了 implicit function |
| 多变量微积分 `inverse-implicit` | `:66`（常见误区） | 隐函数 | 原有 implicit function |
| 光学 `diffraction-gratings` | `:59`（用光栅分光） | 「两边求微分」里的微分 | 补了 differential |

- 核对时各处的意思：二阶导数、高阶导数都是一元函数$y(x)$的；`partial-derivatives:34` 说的正是「一元函数的」，和后面的二阶偏导数对照；「隐函数」是由$F(x,y(x))=0$确定的$y(x)$；光栅方程两边「求微分」得到的是$\dd\theta$、$\dd\lambda$，就是微分$\dd y=f'(x)\dd x$。
- 没有拿不准、所以没补的。协调会话判断不补的那几类（标题，变分法 `multivariable-functionals:79` 的偏导数，「全微分」「微分方程」「微分中值定理」里的微分，多变量微积分的「线性近似」，「隐函数定理」，「牛顿-莱布尼茨公式」）都没动。
- `npm run content`：0 个错误、0 个警告。这 7 个文件一共改了 11 行，只有这些标记和括注。

## 复核

审内容 agent · 2026-11-17。和初审前拍的快照 `b18-snapshot/` 逐文件比对，只看这一轮的改动；别的领域 7 节的补标对照 `git diff` 逐处看。

### 结论

没有需要修的。

- 小问题 2 条都改对了；写内容会话按「同类」多改的 17 处（正文 3 处、题目文字 14 处）也都对。
- 别的领域 7 节 12 处补标都同意。
- 9 节和 `continuity` 都通过，`status` 已改成 `reviewed`（只改了这一行）。

### 逐条

- **小问题 1（术语标记和括注）**：通过。
  - 「链式法则」：`elementary-derivatives:65`、`higher-derivatives:42`、`hyperbolic-functions:40` 都写成「:term[链式法则]（chain rule，见[链式法则](…)）」。`hyperbolic-functions` 的第一次出现挪到了 `:40`，`:52` 删掉重复的英文括注，那一块里照样标着。
  - 「可导函数」：`local-extrema:43` 整个词标成「可导」，同一块 `:45` 原来的标记去掉，一块里只标一次；`antiderivatives:25` 是这一节第一次出现，括注 differentiable function。
  - 缩写：`local-extrema:34`「（limit，lim）」；`hyperbolic-functions:25` 三个都补了 sinh、cosh、tanh。
  - 「反函数的求导法则」进表（`math.calculus.inverse-function-rule`，术语表 69 条）：
    - 简介只用链上的概念（连续、严格单调、可导），式子对；锚点落在 `implicit-differentiation:43` 的定理段。
    - 定理标签「定理（:term[反函数的求导法则]，inverse function rule）」合批次 17 写回的「定理名写在括号里也标在定理名里」。
    - `:56` 是「反三角函数」块里第一次出现，标了；`elementary-derivatives:65` 是提前提到的本领域术语，标了、括注了英文，推理没用到它。
  - 同类：
    - `antiderivatives:32` 改成「由:term[中值定理]（mean value theorem）的推论 2（见[微分中值定理](…)）」，`:41`、`:56` 的链接文字补了英文括注，都对。
    - 题目文字 14 处英文括注逐处看过，名词和英文都对得上：`differentials` 第 7 题「割线」，`elementary-derivatives` 第 8 题「初等函数」「可导」，`local-extrema` 第 5、6、8 题四处，`higher-derivatives` 第 7 题，`implicit-differentiation` 第 1、3、8 题，`mean-value-theorem` 第 6 题两处，`antiderivatives` 第 8 题。
- **小问题 2（「相差一倍」）**：通过。`hyperbolic-functions` 第 8 题第 3 级提示改成「前者约是后者的$2$倍」（$9.07\div4.5\approx2.0$）。同类：10 节里带「倍」的说法我也重查了一遍，都是「是……的 N 倍」。

### 别的领域 12 处补标

都同意，逐处核对了四件事：

1. 意思相同：
   - 变分法 `euler-lagrange:22`、`:39`、`:62`、`several-functions:16`、`:31` 的「二阶导数」，都是一元函数 $y(x)$ 的 $y''$；
   - `several-functions:16`、`:52` 的「高阶导数」（`:52` 是「更高阶导数」，标的是里面的「高阶导数」，「更」是副词，意思不变）；
   - 多变量微积分 `partial-derivatives:34`「一元函数的二阶导数」；
   - `multivariable-chain-rule:27`、`inverse-implicit:66` 的「隐函数」，都是 $F(x,y)=0$ 确定的 $y(x)$；
   - 变分法 `direct-methods:104` 的「双曲函数」，指 $\sinh$、$\cosh$；
   - 光学 `diffraction-gratings:59`「两边求微分」，得到的是 $\dd\theta$、$\dd\lambda$。
2. 定义它的那一节都不在这 7 节的链上：我按全图又算了一遍，`higher-derivatives`、`implicit-differentiation`、`hyperbolic-functions`、`differentials` 分别不在对应小节的链上。
3. 7 节都是批次 4 以后写的：用 `git log` 查了各自 `problems.yaml` 第一次提交，`euler-lagrange`、`several-functions` 在批次 4，`direct-methods` 在批次 5，多变量微积分 3 节在批次 13、14，`diffraction-gratings` 在批次 16，合 `plan.md:246`。
4. 不和别的领域自己的术语撞：多变量微积分的术语表里有「隐函数定理」「全微分」，没有「隐函数」，所以标单变量微积分的 id 是对的。

只补标记、不加前置，我同意。`euler-lagrange:22`、`:39` 的「有连续的二阶导数」是定理的条件；照规矩 C 的字面，推理要用的概念应放进前置链。可这里只用到「导数的导数」这个记号，读者在链上已经懂导数。照批次 17 狭义相对论「迈克耳孙干涉仪」只补标记、不加前置的先例处理，不为它加前置、动层级。

另外两处 `git status` 里能看到的改动，线性代数 `cross-product`、狭义相对论 `stress-energy-tensor`，补标的是牛顿力学的「力矩」「角动量守恒」，不在这一批的清单里，没审。

### 改了没报的

无。和快照比，这一轮改了 15 个文件，都写进了修订说明，题目的答案一个都没动：

- `_domain.yaml`：新进表 1 条；
- 6 节的 `lesson.md`：`elementary-derivatives`、`higher-derivatives`、`hyperbolic-functions`、`implicit-differentiation`、`local-extrema`、`antiderivatives`；
- 8 个 `problems.yaml`：除 `chain-rule` 以外的 8 节。

### 怎么核的

- **比对**：快照逐文件 `diff`，逐处对照修订说明；别的领域 7 节用 `git diff` 逐个看新加的标记和括注。
- **全量检查**：
  - `npm run content`：0 个错误、0 个警告；
  - `npm test`：23 个测试文件、202 个测试通过；
  - `npm run verify`：全部一致（283 个小节），这一批 36 道题的答案没动，照样一致；
  - `npx tsc -b`：初审时的 `@principia/anim` 两个错没了（协调会话修好了链接）；剩下 2 个错在牛顿力学审查会话的验算脚本里，和这一批无关。
- **术语与格式**：初审用的脚本重跑。逐块查第一次出现，剩下报出的都是初审已判过的长词（「极大值点」「左导数」「n 阶导数」「隐函数求导法」）；段落句数、引号都没问题。
- **页面**：仓库能直接构建了，网站建到 scratchpad，服务的进度写临时仓库。10 节在 768 像素宽下点开全部提示和解答，都没有横向溢出。

### 要写回 plan.md 的

1. 初审的第 1、2 条照旧。第 3 条（`node_modules` 里工作区包的链接坏了时，临时副本里另建联接）可以只当作经验写一句，链接已经由协调会话修好。
2. **跨领域补标的记录（批次 11 的规矩那一段）加一句**：「别的领域里一元函数的『二阶导数』『高阶导数』、$F(x,y)=0$ 确定的『隐函数』、方程两边『求微分』的『微分』，按单变量微积分的 id 补标；只补标记、不加前置（批次 18，照批次 17 迈克耳孙干涉仪的先例）。」

### 剩下的

- 没有没通过的小节。
- 收尾已做：
  - scratchpad 里的快照 `b18-snapshot/`、网站副本、临时进度仓库、启动脚本已删；
  - `.claude/launch.json` 里我加的 `test-serve-calculus-review` 已删。
- 提交由写内容会话做，和这一批一起提交的有：
  - 这份报告；
  - 10 节的 `status`；
  - `tools/verify/` 下的验算文件：9 个新脚本、新的 `math.calculus._jet.ts`，以及 `math.calculus._calc.ts` 的改动（加了 `bisect`、`integrate`）。

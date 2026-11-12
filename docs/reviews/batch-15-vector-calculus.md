# 批次 15 审查报告：多变量微积分（曲线积分、曲面积分与积分定理）

审内容 agent（和写内容 agent 是两个独立会话，没有读它的会话记录、交接说明和自查脚本）· 2026-11-12

审查范围：`math.vector-calculus` 的 9 节：`curl-divergence`、`vector-identities`、`space-curves`、`line-integrals`、`conservative-fields`、`parametric-surfaces`、`greens-theorem`、`surface-integrals`、`divergence-theorem`。包括：

- 它们的文件头、`problems.yaml`（72 道题）、9 张 SVG、1 个动画（`curl-divergence` 的 `vector-field-2d`）；
- `_domain.yaml` 新增的 30 个术语（术语表共 72 条）；
- 已审小节的补标：`gradient:44`、`inverse-implicit:36`、`lagrange-multipliers:32`、`:41` 的「光滑曲线」，`extrema:47` 的「闭曲线」，`extrema` 第 8 题提示 3 的括注（`problems.yaml:141`）。

另外看了：

- 以这一批为直接前置的已写小节（方案列的 6 节）和指向这一批的前向链接（13 条）；
- 以这一批为直接前置、还没写的 15 节的大纲（`goal`）；
- 规矩 C 两个方向的扫描，以及写内容会话列的跨领域补标、不补标清单。

初审前按「每批的流程」第 4 条，把整个 `content/math/vector-calculus/`（含 `_domain.yaml`）拷了一份快照到我的 scratchpad（`b15-snapshot/`），复核时和它比。

## 结论

没有重要问题；小问题 3 条；原有问题 2 条（不是这一批引入的，不计入，修不修见各条）。讲解、例题、72 道题、9 张图和动画的数学都对；简单题、中等题 36 道独立验算全部一致。

- **小问题 1：术语表三处：两个两节以上用到的名词没进表，「通量」的简介没盖住格林公式里的用法**
  - 方案 `plan.md:244`：两节以上用到的名词就进术语表，有名字的记号同样（批次 14）。
  - 「平面旋度」：
    - 三节在用：
      - `curl-divergence` 第 6、7 题（`problems.yaml:97`、`:101`、`:111`–`:117`）；
      - `conservative-fields:74`（已经标成「旋度」的 id）；
      - `greens-theorem:32` 和第 6、7 题（`problems.yaml:93`、`:115`、`:119`）；
      - 术语表「格林公式」的简介（`_domain.yaml:616`）也写了它。
    - 它只在 `curl-divergence:105` 的常见误区里起了名，没有锚点，也没括注英文。讲解里定义旋度的那一段 `:37` 说了「平面上……只用看一个数 $Q_x-P_y$」，没起名。
    - 建议：
      - 在 `:37` 这句后面起名「叫作平面旋度（scalar curl）」，当成「旋度」的别名，和 `conservative-fields:74` 的标法一致；
      - 「旋度」的简介（`_domain.yaml:426`）补半句「平面上只看 $Q_x-P_y$，叫平面旋度」；
      - 定义段里别名不标（`plan.md:246`）；
      - 别的地方不用改：`greens-theorem:32` 那一块前面已经标了「旋度」。
    - 单独进表也可以，见「我替你定的」9。
  - 「闭曲面」：
    - 用到的地方：
      - `surface-integrals:30`、`:40`、`:42`、`:50`；
      - `divergence-theorem:16`、`:23`、`:27`、`:48`、`:70`、`:72`、`:73`，以及第 4、6 题；
      - 术语表「外法向」「散度定理」两条简介（`_domain.yaml:643`、`:670`）。
    - `surface-integrals:30` 在 `def-oriented-surface` 段里顺带说了「包住一块空间的闭曲面（例如球面、立方体的表面）」，没有起名的句子。两节第一次出现都没括注英文（括注脚本报 `surface-integrals:30`、`divergence-theorem:16`）。
    - 同一批的「闭曲线」进了表（`line-integrals#def-circulation`），「闭曲面」和它对应。
    - 建议：
      - 进表，`definedIn: surface-integrals`，锚点用 `def-oriented-surface`；
      - `:30` 改成起名的说法「包住一块空间的曲面叫作闭曲面（closed surface），例如……」；
      - 两节每一块第一次出现补标，`divergence-theorem:16` 补括注。
    - 别的领域不用补：电磁学说「闭合曲面」，而且 `surface-integrals` 在 `gauss-law` 的链上；拓扑 `euler-characteristic` 还是大纲。
  - 「通量」的简介（`_domain.yaml:660`）：
    - 只说「向量场穿过有向曲面的 $\iint_S\vb F\cdot\vb n\,\dd a$」。`greens-theorem:39` 把穿过平面曲线的 $\oint\vb F\cdot\vb n\,\dd s$ 也标成这个 id，浮窗和正文对不上。
    - 建议补半句「平面上穿过一条曲线的通量同理」。简介只能用定义它那一节链上的概念（`plan.md:244`），所以不写曲线积分的式子，也不链 `greens-theorem`（它不在 `surface-integrals` 的链上）。

- **小问题 2：前置链两处（`plan.md:1057`）**
  - `parametric-surfaces` 用了链外的「切向量」：
    - `:27` 的小标题就是「切向量与法向量」，`:30` 用它定义光滑曲面（「两个切向量不平行」），`:32`、`:70` 接着用；标的是 `space-curves` 的 id。
    - `space-curves`（第 12 层）不在 `parametric-surfaces`（第 14 层，前置 `change-of-variables`、`cross-product`）的链上。它也不排在后面，「本领域后面小节的术语可以提前提到」那条用不上。
    - 建议：`parametric-surfaces` 的前置加上 `math.vector-calculus.space-curves`。我按整张图算过：
      - 这条前置不多余；
      - 全站层级都不变；
      - 也不会让别的小节的前置变得多余。
  - `divergence-theorem` 的连续性方程没写条件：
    - `:38` 的结论没写 $\rho$、$\vb J$ 要多光滑；`:40` 把求导移进积分号，只链了 `parameter-integrals`。
    - `sketch` 的规矩是写明条件、说明这里满足，再链接（`plan.md:1057`）。批次 11 `vector-potential:32` 同样的情况报过小问题。
    - 电磁学 `current-density:48`、`:50` 写全了，可以照着补：
      - `:38` 加「$\rho$、$\pdv\rho t$ 连续，$\vb J$ 有连续的偏导数时」；
      - `:40` 加「$V$ 固定、$\pdv\rho t$ 连续，求导可以移进积分号」。

- **小问题 3：`conservative-fields` 第 1 题的数在例 1 里算过（`plan.md:227`，批次 8）**
  - 第 1 题（`problems.yaml:4`）问 $f=x^2y+y^3$ 的梯度场从 $(0,0)$ 到 $(1,2)$ 做的功。
  - 势函数就是例 1 的 $f=x^2y+xz+y^3$ 去掉 $z$ 项，终点也是例 1 的 $x=1$、$y=2$。例 1 的推导 `:70` 写着 $f(1,2,3)=2+3+8$，答案 $10=2+8$ 照着就能读出来。
  - 建议：换终点或者换场，例如终点改成 $(2,-1)$，答案变成 $-5$。复核时我按新题面重写这道的验算。

原有问题：

- **原有 1：电磁学、狭义相对论把 $\dd\vb a$ 叫「面元（area element）」**
  - 出处：`gauss-law:25`、`stress-energy-tensor:67`。
  - 这一批起的名字：$\dd a$ 叫「面积元（area element）」，$\dd\vb a$ 叫「有向面积元（vector area element）」。
  - 符号一致，但同一个英文 area element，两边指的东西不同：那边是向量，这边是标量。
  - 两边都当场说清了是什么，我建议这一批不动；以后改到这两节时，括注换成 vector area element。
- **原有 2：`vector-fields` 第 8 题参考解答的链接指得不准**
  - `problems.yaml:133`：「以后在[曲线积分]里，『沿闭曲线走一圈，场做的功是否为零』会成为判断梯度场的办法」。
  - 这个判别是 `conservative-fields` 证的（`def-conservative`、`thm-potential`），`line-integrals` 只算了 $(-y,x)$ 的环量。
  - 参考解答网页上不显示（`plan.md:306`），只在「复制给 Claude」时带上，不值得为它退回 `written`。以后改到 `vector-fields` 时，顺手改成链 `conservative-fields`。

**写内容会话拿不准的几处**：都可以，不用改，理由见「我替你定的」1–8。

## 改了没报的

无。改动和协调会话转述的交接一致：

- 9 节的正文、题目和 9 张 SVG。文件头只加了 `minutes`、`summary`，改了 `status`；标题、`goal`、前置都没动。
- `_domain.yaml` 只在术语表末尾加了 30 条（`:400` 以后），宏和旧条目没动。
- 四节旧课只改了补标的那几行和 `status`；`extrema/problems.yaml` 只改了第 8 题提示 3 的一处括注。

另外两处改动不是写内容会话的：`progress/lessons.yaml` 是你自己的学习记录；`tools/verify/math.vector-calculus._vc.ts` 是我加的工具函数。

## 要修的，按小节分

- `curl-divergence`：`:37` 起名「平面旋度」（小 1）。
- `conservative-fields`：第 1 题换数（小 3）。
- `parametric-surfaces`：前置加 `space-curves`（小 2）。
- `surface-integrals`：「闭曲面」起名、补标（小 1）。
- `divergence-theorem`：
  - 「闭曲面」补标、补括注（小 1）；
  - `:38`、`:40` 补条件（小 2）。
- `_domain.yaml`：「闭曲面」新条目；「旋度」「通量」两条简介各补半句（小 1）。
- `docs/plan.md`：见「要写回 plan.md 的」。

## 需要你决定的

1. **单位法向量写 $\vb n$ 还是 $\uv n$**
   - 现状：
     - 这一批写 $\dd\vb a=\vb n\,\dd a$，单位法向量一律 $\vb n$：3 节 41 处，另有「有向曲面」「有向面积元」「通量」3 条简介。
     - 本领域的单位切向量也写 $\vb T$，这是数学书的惯例。
     - 电磁学的单位法向量一律 $\uv n$（78 处，没有一处 $\vb n$）。但电磁学没写过 $\dd\vb a=\uv n\,\dd a$ 这个式子，`gauss-law:25` 用文字定义面元。
     - $\dd a$、$\dd\vb a$、$\dd V$ 三个记号两边一致。
   - 可选：
     - A. 维持，两个领域各用各的惯例；
     - B. 多变量微积分改成 $\uv n$，同时定 $\vb T$ 跟不跟着改。
   - 推荐 A：两边各自统一，读者不会看错。改的话要动 3 节和 3 条简介，以后 `stokes-theorem` 等节也要跟着写。
   - 能撤回。

## 我替你定的

1. 「通量」：定义留在 `surface-integrals`，不在 `greens-theorem` 另起。
   - `greens-theorem:39` 是提前提到本领域后面小节的术语（`plan.md:1057` 最后一句）。两节同在第 15 层，按 id 排 `greens-theorem` 在前。
   - `:39` 当场说了往外流的量是 $\oint\vb F\cdot\vb n\,\dd s$，推理不靠 `surface-integrals`。
   - 电磁学 `gauss-law` 要的是曲面上的通量，定义留在曲面那一节最顺。只需要简介补半句（小 1）。
2. 「势函数」「分段光滑」用本领域的 id：
   - 常微分方程的「势函数」是恰当方程 $M\dd x+N\dd y=0$ 的那个（`math/ode/_domain.yaml:149`）；
   - 数学分析的「分段光滑」说的是区间上的函数；
   - 本领域的是向量场的势函数、曲线的分段光滑。和「连续」「链式法则」一元、多元各用各的 id 是同一个做法（`plan.md:246`）。
3. 「高斯公式」在定义段 `divergence-theorem:23` 不标：
   - `plan.md:246`：「在那个术语自己的定义段里别名不标」。
   - 简介写了「也叫高斯公式」，标题也是「高斯公式（散度定理）」。
   - 电磁学 `current-density:50`、`poynting-theorem:29` 写「高斯公式（divergence theorem）」；`divergence-theorem` 在它们的链上，不用标。
4. 「连续性方程」只加锚点：
   - 本领域只有 `divergence-theorem` 一节用（`plan.md:244`）。
   - 电磁学的同名术语（`physics/electromagnetism/_domain.yaml:486`）简介写的是电荷守恒（「$\rho$ 是电荷密度」）。这里说的是一般的守恒量，按意思不借它的 id。
   - 狭义相对论 `stress-energy-tensor:65` 的粒子数守恒，`divergence-theorem` 在它的链上。
   - 以后 `pde.heat-equation` 也用到时进表。
5. `conservative-fields:52` 空间情形写「这里不证」，可以：
   - 和批次 13 `gradient:44` 留给 `inverse-implicit` 证的做法一样；
   - 平面情形 `greens-theorem:49`–`:51` 补上了；
   - 空间情形留给 `stokes-theorem`（大纲，第 16 层）。
6. 「法向量」只括注、不标：线性代数进了表，但它是中学学过的词（「平面的法向量」），借用时不按规矩 C 标（`plan.md:245`，批次 14 也这样认定）。
7. `curl-divergence` 第 7 题的河流模型对：
   - $v_0(1-y^2/w^2)$ 是两壁之间层流的抛物线流速分布，题目说的是「设」。
   - 平面旋度是 $\frac{2v_0y}{w^2}$，三处树叶的转向和参考解答一致。
   - 树叶的角速度取旋度的一半，指的是 `:39` 那种小十字（或圆形小叶片）的平均角速度，和讲解一致。
8. 跨领域补标：写内容会话的清单都对。
   - 要补的 3 处对：
     - `holonomic-constraints:49`、`:78` 的「光滑曲线」说的是曲面上的曲线；
     - `natural-boundary-conditions:123` 的「切向量」是曲线 $y=\varphi(x)$ 的切向量；
     - 都是本领域的意思、在链外、不是中学词。
   - 不补的也对：
     - `gamma-function:83`、`several-functions:120` 的「光滑曲线」是日常说法；
     - 「闭曲线」当中学词（高中物理就有「磁感线是闭合曲线」），所以常微分方程 `limit-cycles`、`lyapunov-stability`、`nonlinear-systems`、`phase-plane-linear` 和变分法 `isoperimetric-problems:48` 都不补；
     - 「势函数」「分段光滑」各领域有自己的 id；
     - 分析力学 `phase-space-liouville` 是批次 1、2 写的，不追溯；
     - 「焦点」不是这一批的术语，扫描里没有出现。
   - 我反向扫了 30 个新术语在别的领域已写小节正文里的出现。除了上面这些，只有 `ampere-law:50` 的「通量」，标的是电磁学的「磁通量」，意思对。
9. 「平面旋度」建议当「旋度」的别名，不单独进表：`conservative-fields:74` 已经这样标，浮窗显示旋度的简介正合适。写内容会话觉得单独进表更清楚也可以，两种都合 `plan.md:244`。
10. 四节旧课的补标都对，`status` 复核时和这一批一起改回 `reviewed`。

## 要写回 plan.md 的

1. 多变量微积分「写正文和审查时改的前置」：`parametric-surfaces` 加 `space-curves`（小 2；层级按整张图算过，都不变）。
2. `plan.md:245` 中学词的例子补上「法向量」「闭曲线」：在本领域进了表，别的领域借用时当中学词，不按规矩 C 标（批次 15 审查时认定）。
3. 给以后写这几节的会话留的话：
   - `stokes-theorem`：
     - 补上 `conservative-fields:52` 留下的空间情形（单连通区域上旋度为零，场就是保守场），并照 `inverse-implicit:36` 那样说明这是那里留下没证的一步；
     - 三维旋度是单位面积上的环量，这个说法也在那里讲（平面的情形在 `greens-theorem` 第 7 题）。
   - `pde.heat-equation`：
     - 一般的连续性方程在 `divergence-theorem#def-continuity-equation`，只有锚点，用到时进表；
     - `divergence-theorem` 第 7 题已经由连续性方程推过一次热方程；
     - 电磁学的「连续性方程」是电荷守恒那一条。
   - `pde.laplace-equation`、`complex-analysis.harmonic-functions`：
     - 「调和函数」在 `vector-identities#def-harmonic`，只有锚点，用到时进表；
     - 平均值的说法有 `vector-identities` 第 5 题和 `laplacian.svg`；
     - 电磁学 `poisson-equation:39` 也起过名，`vector-identities` 在它的链上。

## 下游和前向链接

- 方案列的 6 节都接住了：
  - 变分法 `multivariable-functionals`：
    - `:28` 的面积公式 $|\mathbf r_x\times\mathbf r_y|=\sqrt{1+u_x^2+u_y^2}$ 对得上 `parametric-surfaces` 的图像面积元；
    - `:36`、`:66` 的通量形式 $\iint(P_x+Q_y)=\oint(P\,\dd y-Q\,\dd x)$ 对得上 `greens-theorem#thm-green-flux`；
    - 两节都在它的链上，只括注、不标是对的。
  - 分析力学 `phase-space-liouville:46`–`:54`：散度是「源的强度」、一小块体积的相对变化率，和术语表「散度」的简介、`curl-divergence:27` 一致。
  - 电磁学 `gauss-law:25`（电通量、闭合曲面上法线朝外）对得上 `surface-integrals` 的 `def-flux`、`def-oriented-surface`，记号 $\dd\vb a$ 一致；叫法见原有 1。
  - 电磁学 `current-density:48`、`:50` 和狭义相对论 `stress-energy-tensor:65`–`:67`（由散度定理推连续性方程）对得上 `divergence-theorem:40`，`divergence-theorem` 在两节的链上。
  - 电磁学 `poisson-equation:22`、`:34`（$\divg\nabla=\lap$、$\curl\nabla=\vb0$）对得上 `vector-identities`。
- 前向链接：
  - `vector-identities` 的恒等式：下面这几处引的恒等式都在 `vector-identities:23`、`:44` 里，次序、符号一致。
    - `ampere-law:47`、`maxwell-equations:24`、`poisson-equation:22`、`:34`；
    - `vector-potential:32`、`magnetization:46` 用 $\curl(f\vb F)$；
    - `inductance:58`、`poynting-theorem:29` 用 $\divg(\vb F\times\vb G)$。
    - `ampere-law`、`maxwell-equations` 的链上没有 `vector-identities`：它们是引一个数学恒等式、链出处，合 `plan.md:1057`「为了列出式子用到别的学科的结论，链接出处即可」。
  - `greens-theorem`：
    - `magnetic-dipole:29`（$\oint x\,\dd y=a$ 等）对得上 `greens-theorem:47`；
    - 常微分方程 `limit-cycles` 第 5 题用通量形式证本迪克松判别法，对得上 `thm-green-flux`。这是题目文字链链外的结论，合 `plan.md:1057`。
  - `divergence-theorem`：`gauss-differential:22` 的链接文字「高斯公式（散度定理）」和标题一致；「单位体积穿出的电通量」对得上 `divergence-theorem:33`。
  - 上一批：
    - `vector-fields:34`（怎样判断、怎样找 $f$）对得上 `conservative-fields` 的 `thm-curl-test`、`thm-simply-connected` 和例 1；
    - 第 8 题见原有 2。
- 还没写的 15 节（以这一批为直接前置）：`goal` 都有落点。
  - `stokes-theorem`：环量、有向曲面、边界的正向。
  - `delta-3d`：`divergence-theorem:29` 和第 6 题。
  - `curvilinear-coordinates`：`divergence-theorem:33` 不靠坐标的散度、`vector-identities:44` 的 $\curl(f\vb F)$。
  - `potentials`：经 `stokes-theorem` 链上有 `conservative-fields`。
  - `pde.laplace-equation`：格林恒等式要的 $\divg(f\nabla g)$ 在 `vector-identities:44`。
  - `waves-in-3d`：球对称的拉普拉斯算子 $f''+\frac2rf'$ 在 `vector-identities` 第 8 题。
  - 其余：微分几何 3 节、复分析 2 节、`pde.heat-equation`、`newtonian-mechanics.conservative-forces`、`general-relativity.newtonian-limit`。

## 怎么审的

- **读题和验算**：
  - 简单题、中等题用 `npm run statements -- <9 节> --tier easy,medium` 读题，独立写了 9 个验算脚本 `tools/verify/math.vector-calculus.<小节>.ts`。36 道全部一致。验算完才打开 `problems.yaml` 读难题、思考题和全部提示、解答。
  - 共用的 `_vc.ts` 加了几样工具，都不含答案：
    - 点积、叉积、模长；
    - 理查森外推；
    - 折线求和（沿曲线取弦）；
    - 三角剖分求和（参数网格每格切两个三角形）；
    - 参数曲面上的通量积分；
    - 小圆环量、小立方体通量、小球面平均。
  - 验算不用要验的那条结论：
    - 曲线积分、功：沿曲线切成折线直接累加 $\vb F\cdot\Delta\vb r$，再外推。保守场的题换一条路再算一次核对，不用「势函数终点减起点」。
    - 格林公式的题沿边界逐段算，不化成二重积分；通量形式的题在每条边上用外法向直接积 $\vb F\cdot\vb n$。
    - 曲面面积、曲面积分：三角剖分后累加面积或 $\vb F\cdot$有向面积，不用 $|\vb r_u\times\vb r_v|$ 的公式；每一块的朝向都在一点核对过。
    - 散度定理的题：逐块写出边界曲面，算往外的通量再相加，不用散度；补盖子的那道只算半球面本身。
    - 散度、旋度、拉普拉斯算子都不用偏导数公式：散度用小立方体的通量除以体积，旋度用小圆的环量除以面积，拉普拉斯算子用小球面（或小圆）上的平均减中心值。
    - 判断保守的那道看绕圈的环量是否为零，不用交叉偏导数。
  - 小圆环量的工具第一版用圆弧中点、除以圆面积，相对误差 $10^{-5}$。改成取弦的中点、除以内接多边形面积后，对线性场精确到 $10^{-13}$。
- **全量检查**：
  - `npm run content`：0 个错误、0 个警告。
  - `npm test`：23 个文件、202 条全过。
  - `npm run verify`：233 节全部一致，退出码 0。
  - `npx tsc -b` 报 1 处错：光学 `tools/verify/physics.optics.thin-lenses.ts:10` 有一个没用到的 `Ray`。那是光学审查会话正在写的文件，我没动；多变量微积分的文件没有报错。
- **术语**：
  - 每一块里术语第一次单独出现有没有标记：报出 4 处，都不用改。
    - `greens-theorem:39`、`:81` 是「通量形式」这个名字里的「通量」，同一段后面标了；
    - `curl-divergence:95` 是「角速度向量」，不是「速度向量」；
    - `space-curves:30` 的「$\vb r'$ 连续」说的是一元的连续，按 `plan.md:246` 是数学分析的意思、在链上，不标是对的。
  - 没有超过 4 句的段。
  - 括注按页面先后查。除了小问题 1 的「平面旋度」「闭曲面」，报出的都不用改：
    - 中学词：双曲线、点电荷、引力场、圆环、位移、乘积求导法则；
    - 术语的形容词用法：无散、无旋；
    - 名字里的一部分：「通量形式」；
    - 只起「见某节」作用的链接文字；
    - `curl-divergence:81` 的「剪切」：英文写在前面动画的滑块说明里（`:74`），页面上先出现。
  - 讲解里起名的段落 22 处，都有锚点。
  - 拼词：标记前后一到四个字拼不出别的术语。
  - 「两节以上用到」：候选名词在本领域各节数了一遍。
    - 要进表的见小问题 1。
    - 「速度场」（6 节）照批次 14「我替你定的」1，不进表。
    - 「正向」两节里意思不同：`curl-divergence:91` 说的是坐标轴的正向。
    - 「单位法向量」「源的强度」「势能」都不用进表。
- **链接、前置、规矩 C**：
  - 链接的目标、锚点都存在，包括 `parameter-integrals#thm-leibniz-rule`；30 条术语的锚点段里都有术语名；前置没有多余的。
  - 链外的标记 7 处：
    - `curl-divergence:81`「剪切」：规矩 C；
    - `space-curves:22`、`:35`「向量值函数」：当场说了是「变量只有一个的向量值函数」；
    - `line-integrals:44`「旋度」：只提到，推理不用；
    - `greens-theorem:39`「通量」：见「我替你定的」1；
    - `parametric-surfaces:30`、`:70`「切向量」：见小问题 2。
  - 题目文字链到链外，都合 `plan.md:1057`「题目文字链出处即可」：
    - `vector-identities` 第 5 题：多元泰勒公式；
    - `conservative-fields` 第 6 题：积分号下求导，写了条件；
    - `line-integrals` 第 8 题：叉积，题面已经说了力和速度垂直；
    - `divergence-theorem` 第 7 题：拉普拉斯算子。提示 3 用了 `vector-identities` 的「比周围平均低」，参考解答第 3 段另给了只用散度定理的说法。
  - 规矩 C 正向：扫了别的领域术语表的词在这 9 节里的链外出现，报出的都不用标：
    - 链上学过的：一元的链式法则、牛顿-莱布尼茨公式（在 `math.calculus` 的链上）；
    - 中学词：法向量、点电荷、电势、电流、磁场、正弦、余弦；
    - 日常意思：强度、中心；
    - 本领域有自己 id 的：势函数、分段光滑；
    - 题目文字里的。
  - 规矩 C 反向：见「我替你定的」8。
- **引文**：「例 N」「第 N 题」逐个对过，例如 `greens-theorem:30` 指第 5 题、`:32` 指第 7 题，`divergence-theorem:25`、`:33`、`:70` 指第 5、8、4 题，`surface-integrals:32`、`:44` 指第 7、8 题。没有「上一节」「下一节」。
- **页面**：
  - 网站构建到 scratchpad，起临时服务，进度写进临时 Git 仓库（`buildServer` 的 `dataRoot`），看完删了副本。
  - 仓库的 `dist/`、`progress/` 都没动：这一批的打开、提示、放弃记录都写进了临时仓库；仓库 `progress/` 的差异和开审时一样，只有你自己的 3 条。
  - 768 像素宽看了 9 节，每节展开全部提示（各 24 次）和简单题、中等题的解答（各 4 道）：0 处公式报错，没有横向滚动。超过所在块 80% 宽的行内公式，都是折了行的长式子，没有撑出块外。
  - 9 张 SVG 都导出看过（暗色），量了文字：
    - 文字不重叠，不压线；
    - 离边最近 14.7 像素；
    - 最宽的一行占画布 31%；
    - 画的内容和图注逐项对过，例如箭头方向、逆时针和顺时针、斜柱体四条棱都和 $\vb v$ 平行。
  - 动画：
    - 滑块的范围、步长、默认值和正文一致（$a\in[-0.5,0.5]$，$b$、$c\in[-1,1]$）；说明「散度是 $2a$、旋度是 $2b$、$c$ 是剪切」都对。
    - 默认值、$b=1$、$c=1$、$a$ 和 $b$ 取负，几组的箭头逐点对过场的式子。
    - 面板隐藏时帧不走，用 MessageChannel 推帧导出：粒子沿螺线往外转，和默认参数（散度 $0.4$、旋度 $1$）一致。

## 各节

只记有内容的地方；上面已经报过的不重复。

- **`curl-divergence`**：
  - 散度用随流动的小矩形面积变化讲「为什么」，旋度用小十字的平均角速度讲「为什么」；边界情况是流线直、旋度不为零的 $(y,0)$，和流线弯、旋度为零的 $\frac{(-y,x)}{x^2+y^2}$。
  - 例 1、例 2（刚体转动的速度场，旋度是角速度的两倍）核过。
  - 难题、思考题都核过：
    - 第 5 题：小矩形面积的变化率；
    - 第 6 题：$\frac{(x,y)}{x^2+y^2}$、$\frac{(-y,x)}{x^2+y^2}$ 既无散又无旋；
    - 第 7 题：河流；
    - 第 8 题：$\frac{\vb r}{r^n}$ 无散要 $n=3$。
- **`vector-identities`**：
  - 两个恒等式、乘积法则、拉普拉斯算子都核过。
  - `laplacian.svg` 三幅图的平均值是 $1.44$、$0$、$-1.44$（半径 $1.2$），和 $\frac{r^2}4\lap f$ 一致。
  - 第 6 题 $\curl\curl\vb F=\nabla(\divg\vb F)-\lap\vb F$；第 7 题三问的判断（梯度要求无旋，旋度要求无散）；第 8 题 $f(r)$ 调和的条件，平面上是 $\ln r$，空间里是 $\frac1r$。
- **`space-curves`**：
  - 例 1 螺旋线、例 2 长度不变的向量和导数垂直，核过。
  - 第 6 题圆锥面上的螺线改写成弧长参数、第 7 题 $(t^3,t^2)$ 的尖点、第 8 题匀速圆周运动，核过。
- **`line-integrals`**：
  - 例 1 半圆铁丝的质量、例 2 同一个场走两条路，核过。
  - 第 5 题换参数、第 6 题螺旋滑道上重力做的功（只看高度差）、第 7 题 $(x,y)$ 沿两条半圆都是 $0$、第 8 题磁场力不做功，核过。
- **`conservative-fields`**：
  - 曲线积分基本定理、三个说法等价、旋度判别、单连通区域上的充分性，逻辑完整。
  - 例 2 用 $\frac{(-y,x)}{x^2+y^2}$ 说明洞的作用。
  - 第 6 题沿折线积分构造势函数，求导时对第二项在积分号下求导，写了条件，并链了出处。
  - 第 7 题引力在去掉原点的空间里保守（空间去掉一点仍是单连通）；第 8 题绕两圈环量 $4\pi$、不绕为 $0$。
- **`parametric-surfaces`**：
  - 例 1 球面面积 $4\pi a^2$、例 2 抛物面面积 $\frac\pi6(5\sqrt5-1)$，核过；极点处 $\vb r_\theta\times\vb r_\varphi=\vb0$ 的边界情况写了。
  - 第 5 题图像面积不小于投影、第 6 题环面面积 $4\pi^2aR$、第 7 题球带面积 $2\pi ah$、第 8 题换参数乘雅可比行列式，核过。
- **`greens-theorem`**：
  - 证明思路：两类区域分开，再切块抵消，第 5 题补矩形的完整证明。
  - 通量形式由 $(-Q,P)$ 推出；外法向是切向量顺时针转 $90°$，符号对。
  - 平面上的保守场判别补上了 `conservative-fields` 留下的证明。
  - 例 1（$2\pi$，椭圆面积 $\pi ab$）、例 2（$\frac{3\pi}2$）核过。
  - 第 6 题圆环上绕原点的环量都是 $2\pi$；第 7 题平面旋度是单位面积上的环量；第 8 题多边形面积公式（鞋带公式），核过。
- **`surface-integrals`**：
  - 有向曲面、外法向、有向面积元、通量的定义都有「为什么」；莫比乌斯带是边界情况。
  - 例 1 半球壳质量 $\pi a^3$、例 2 径向场的通量 $4\pi a^3$（参数验算 $\vb r_\theta\times\vb r_\varphi=a\sin\theta\,\vb r$），核过。
  - 第 5 题图像的通量公式、第 6 题 $\frac{\vb r}{r^3}$ 的通量 $4\pi$（另一个幂次时随 $R$ 变）、第 7 题莫比乌斯带、第 8 题均匀流过球面（进、出各 $\pi$），核过。
- **`divergence-theorem`**：
  - 长方体的证明思路、切块抵消；散度是单位体积的通量（第 8 题），不靠坐标。
  - 例 1 两边都是 $4\pi a^3$；例 2 $\frac{12\pi a^5}5$，核过。
  - 第 6 题包住原点的任意闭曲面通量 $4\pi$，不包住为 $0$；第 7 题由连续性方程推热方程，核过。

## 没验证的地方

- 动画的流畅度、帧率：面板隐藏时只能推帧导出静态画面，没在真浏览器里看实际播放。
- 亮色主题下的图：只导出了暗色。
- 手机宽度（375 像素）下长行内公式会不会撑出横向滚动：只看了 768 像素。

## 修订说明（写内容会话）

三条小问题都修了。同一类问题在这一批里又找出几处，一起改了，下面标「同类」。只改了 `content/math/vector-calculus/` 和变分法两节。

### 小问题 1：术语表

- **「平面旋度」**：照「我替你定的」9，当「旋度」的别名，不单独进表。
  - `curl-divergence:37` 定义旋度那一段末尾起名「它叫作平面旋度（scalar curl）」；定义段里的别名不标。
  - `:105` 的误区改成「平面旋度指的是它的 $z$ 分量」，这一块前面已经标了「旋度」。
  - 「旋度」的简介补「平面上只看 $Q_x-P_y$，叫平面旋度」。
  - `conservative-fields:74`、`greens-theorem:32` 是各自那一节第一次出现，补了括注 scalar curl。
- **「闭曲面」进表**：id `closed-surface`，定义在 `surface-integrals`，锚点 `def-oriented-surface`。
  - `surface-integrals:30` 改成起名的说法：「包住一块空间的曲面叫作闭曲面（closed surface），例如球面、立方体的表面；闭曲面上约定 $\vb n$ 指向外面，叫作外法向」。
  - 每块第一次出现补标：
    - `surface-integrals:40`、`:50`；
    - `divergence-theorem:16`（补括注）、`:23`、`:48`、`:70`。
- **「通量」的简介**：补「平面上穿过一条曲线的通量同理」。
- **同类一：「重积分的换元公式」进表**：id `change-of-variables-formula`，锚点 `change-of-variables#thm-change-of-variables`。
  - 它是定理名，除了 `change-of-variables`，这一批 `parametric-surfaces:41` 和第 8 题提示也用到，够两节。
  - 标了 `change-of-variables:30`（定理名本身）、`:76`（例 1）和 `parametric-surfaces:41`。`change-of-variables` 因此退回 `written`。
  - 别的领域只有数学分析 `gamma-function:48` 写「换元公式」，说的是一元的换元积分法，不补。
- **同类二：三条简介盖不住这一批的用法**，补了：
  - 「面积元」原来只说二重积分的 $\dd A$，可 `parametric-surfaces:37`、`:63`、`:70` 和 `surface-integrals:25` 用它指曲面上的 $\dd a$。补「曲面上一小块的面积也叫面积元，记作 $\dd a$」。
  - 「切平面」原来只有函数图像的情形，`parametric-surfaces:32`、`:47` 说的是参数曲面的切平面。补「别的曲面在一点的切平面同理，是在这一点附近贴近曲面的平面」。简介只能用 `differentiability` 链上的概念，所以没写参数曲面和 $\vb r_u\times\vb r_v$。
  - 「散度」：`greens-theorem:43` 用的是平面上的散度。补「平面上是 $P_x+Q_y$，量的是面积的相对变化率」。
- **两节以上用到的名词**：这一批括注过英文的名词，在本领域各节数了一遍，别的都不用进表：
  - 弧长、参数方程是微积分的概念（`calculus.arc-length`、`calculus.parametric-curves` 还是大纲）；
  - 速率、加速度、角速度、势能、卦限是中学词；刚体、力场是物理的词；
  - 极角两处意思不同：一处是平面极坐标的，一处是球坐标的；
  - 单位法向量、正向、速度场，审查已经判过。
- **简介的链**：新条目和改过的简介，用脚本逐词核过，只用定义小节链上的概念。报出的「速度场」「强度」是同名不同义，「法向量」是中学词。

### 小问题 2：前置链

- `parametric-surfaces` 的前置加 `math.vector-calculus.space-curves`。层级和 HEAD 比 0 处变化，全站没有多余的前置。
- 同类：用脚本列出这一批（加上 `change-of-variables`）里定义小节不在本节链上的标记。改完只剩审查认可的 4 处：
  - `curl-divergence:81` 剪切；
  - `space-curves:22`、`:35` 向量值函数；
  - `line-integrals:44` 旋度；
  - `greens-theorem:39` 通量。
- `divergence-theorem` 补条件：
  - `:38` 加「$\rho$、$\pdv\rho t$ 连续，$\vb J$ 有连续的偏导数时」；
  - `:40` 加「$V$ 固定、$\pdv\rho t$ 连续，左边的求导可以移进积分号（区间上的情形见含参变量积分，有界区域上同理）」；
  - 「连续」的标记从 `:40` 挪到 `:38`，那里是这一块第一次出现；`:38` 的「偏导数」也标上了。
- 同类：第 7 题（热方程）套用了连续性方程。题面补上 $T$ 的条件：「对位置有连续的二阶偏导数（second-order partial derivative），$\pdv Tt$ 也连续」。
- 别处的求导、取极限都写了条件：`conservative-fields` 第 6 题、`divergence-theorem` 第 8 题、`greens-theorem` 第 7 题、`vector-identities` 第 5 题、`parametric-surfaces` 第 8 题。

### 小问题 3：`conservative-fields` 第 1 题

- 终点改成 $(2,-1)$，答案 $-5$。提示、解答跟着改，解答末尾补一句「功是负的，说明这个力总体上和走的方向相反」。
- 同类：36 道简单题、中等题的答案，和本节讲解、例题、图里算过的数逐个对过，又找出一处：
  - `line-integrals` 第 3 题原来是 $(-y,x^2)$ 沿单位圆的环量 $\pi$。例 2 算过上半圆的积分 $\pi$，而且 $-y\,\dd x$ 那一半和例 2 是同一个积分。
  - 场改成 $(-3y,x^2)$，答案 $3\pi$，提示、解答跟着改。
- 数字碰巧相同、但不是同一个量的，不改：
  - `curl-divergence` 第 4 题 $k=1$ 和例 1 的散度 $1$；第 3 题 $a=-1$ 和讲解里 $(y,0)$ 的旋度 $-1$；
  - `surface-integrals` 第 3 题的 $4\pi$ 和例 2 的 $4\pi a^3$：例 2 没给 $a$ 取值，题目说的是圆柱面。
- 两道新题都用数值积分核过：保守场第 1 题沿两条路算功都是 $-5$；曲线积分第 3 题沿单位圆算环量，结果是 $3\pi$。
- **请复核时改验算脚本**：`npm run verify` 现在只有这两道报不一致。审查会话的脚本还按旧题面算：`conservative-fields` 第 1 题算得 10，`line-integrals` 第 3 题算得 $\pi$。

### 协调会话定的

- **跨领域补标**：两节退回 `written`。
  - 变分法 `holonomic-constraints:49`（补括注 smooth curve）、`:78` 标「光滑曲线」；
  - `natural-boundary-conditions:123` 标「切向量」（补括注 tangent vector）。
  - 题目文字里的照「可标可不标」，不标：`holonomic-constraints` 第 5 题、`natural-boundary-conditions` 第 3 题的「切向量」。
- **新进表的词在别的领域**：
  - 「闭曲面」只在拓扑 `euler-characteristic` 的 goal 里出现，那一节还是大纲；
  - 「换元公式」见上；
  - 「平面旋度」别的领域没用。
- 单位法向量维持 $\vb n$（「需要你决定的」1 选 A）。原有 1、2 这次不改。

### 状态和检查

- **随这一批复核、现在是 `written` 的**：
  - 这一批 9 节；
  - 补标的 4 节旧课：`gradient`、`inverse-implicit`、`lagrange-multipliers`、`extrema`；
  - 这次新退回的：`change-of-variables`，变分法 `holonomic-constraints`、`natural-boundary-conditions`。
- **检查**：
  - `npm run content`：0 个错误、0 个警告。
  - `npm test`：23 个文件、202 条全过。
  - `npm run verify`：233 节里只有上面两道报不一致，退出码 1。
  - 自查脚本（每块第一次出现的标记、括注、句数）：只剩原来那 2 处有意不标，即 `space-curves:30` 一元的「连续」和 `divergence-theorem:23` 定义段里的别名「高斯公式」。
- **页面**：
  - 网站构建到 scratchpad，用临时服务看，进度写进临时 Git 仓库，看完删了副本；仓库 `progress/` 里没有这一批的记录。
  - 768 像素宽看了改过的 8 节和变分法两节，展开全部提示和简单题、中等题的解答：0 处公式报错，没有横向滚动。
  - 这些词的浮窗都核过：闭曲面、平面旋度、换元公式、面积元、切平面、通量、光滑曲线、切向量。

## 复核

审内容 agent · 2026-11-12。和初审快照 `b15-snapshot/` 逐行比了这一轮多变量微积分的全部改动；变分法两节、`change-of-variables` 和四节旧课用 `git diff HEAD` 看。

### 结论

通过，没有要再改的。3 条小问题都改了，同类的几处也改得对。改了没报的：无。

16 节的 `status` 改成了 `reviewed`，只改了这一行：

- 这一批 9 节；
- 初审补标的 4 节旧课：`gradient`、`inverse-implicit`、`lagrange-multipliers`、`extrema`；
- 这一轮退回的 `change-of-variables`，以及变分法 `holonomic-constraints`、`natural-boundary-conditions`。

### 逐条

- **小问题 1：术语表**
  - 「平面旋度」：
    - `curl-divergence:37` 在定义旋度的那一段末尾起了名；定义段里的别名不标，合 `plan.md:246`。`:105` 的误区跟着改了说法。
    - 「旋度」的简介补了半句（`_domain.yaml:436`）。浮窗看过：显示「旋度」的简介，最后一句讲平面旋度。
    - `conservative-fields:74`、`greens-theorem:32` 是各自那一节第一次出现，补了括注 scalar curl。
  - 「闭曲面」：
    - 新条目在 `_domain.yaml:646`–`:654`，锚点 `def-oriented-surface`。
    - `surface-integrals:30` 改成了起名的句子，在锚点段里。
    - `surface-integrals:40`、`:50`，`divergence-theorem:16`（带括注）、`:23`、`:48`、`:70` 补了标记；每一块第一次出现都标了，脚本核过。
  - 「通量」的简介补了「平面上穿过一条曲线的通量同理」（`_domain.yaml:679`）。
  - 同类，「重积分的换元公式」进表（`_domain.yaml:349`–`:357`）：
    - 标了 `change-of-variables:30`（定理段里的定理名本身）、`:76`（别名「换元公式」）和 `parametric-surfaces:41`；
    - `:27` 是小标题，题目文字不标；
    - 别的领域只有数学分析 `gamma-function:48` 写「换元公式」，说的是一元的换元积分法，链接也指向那一节，不补是对的。
  - 同类，「面积元」「切平面」「散度」三条简介补的半句都对，只用了定义小节链上的概念。
- **小问题 2：前置链**
  - `parametric-surfaces` 的前置加了 `space-curves`。我按整张图重算：
    - 不多余，层级不变；
    - `parametric-surfaces:30`、`:70` 的「切向量」现在在链上；
    - 链外的标记只剩初审认可的 4 个词、5 处。
  - `divergence-theorem`：
    - `:38` 补了「$\rho$、$\pdv\rho t$ 连续，$\vb J$ 有连续的偏导数」；
    - `:40` 补了「$V$ 固定、$\pdv\rho t$ 连续」，并说明区间上的情形见含参变量积分、有界区域上同理，和电磁学 `current-density:50` 的写法一致；
    - 「连续」的标记挪到了 `:38`，那里是这一块第一次出现，对。
  - 同类：`divergence-theorem` 第 7 题题面补了 $T$ 的条件，对。
- **小问题 3：题目的数**
  - `conservative-fields` 第 1 题：终点改成 $(2,-1)$，答案 $-5$。验算脚本按新题面改了，沿 $(2t,-t)$ 和 $(2t,-t^2+\sin\pi t)$ 两条路算功都是 $-5$。
  - 同类：`line-integrals` 第 3 题的场改成 $(-3y,x^2)$，答案 $3\pi$。验算脚本改了场，算得 $3\pi$。新数和讲解、例题、图里算过的量都不同。
  - 写内容会话判为「数字碰巧相同、不是同一个量」的几处，我同意不改：`curl-divergence` 第 3、4 题，`surface-integrals` 第 3 题。这些题问的量，和讲解、例题里算的不是同一个。
- **跨领域补标**：
  - `holonomic-constraints:49`（带括注 smooth curve）、`:78` 和 `natural-boundary-conditions:123`（带括注 tangent vector）都标对了；
  - 两节只改了这几行和 `status`；浮窗看过。
- **旧课**：
  - `gradient`、`inverse-implicit`、`lagrange-multipliers`、`extrema` 初审以后没再改，`git diff HEAD` 仍只有补标和 `status`；
  - `change-of-variables` 只改了 `:30`、`:76` 的标记和 `status`。

### 改了没报的

无。快照以后改过的 11 个文件，每一处改动都在修订说明里。

仓库里另有电磁学 4 个文件的改动：「色散」进表、补标。这是光学那一批的（`plan.md:1036`），不在这次复核范围。

### 怎么核的

- 和快照逐行比，变化的行再按字比，11 个文件的每处改动都对过修订说明。
- 验算：
  - 两道改过的题，按 `npm run statements` 读到的新题面改了脚本（只改场和路径），单独跑一致。
  - 这一轮复核的 16 节，64 道简单题、中等题全部一致。
  - 全量 `npm run verify`：233 节全部一致，退出码 0。
- 自查脚本重跑：
  - 查的项目：术语标记（别名加了「换元公式」「平面旋度」）、括注、句数、锚点和术语表锚点、起名段、拼词、链、多余前置，以及规矩 C 两个方向。
  - 结果：除了初审认可的几处，没有新报出的。
- 页面：
  - 网站构建到 scratchpad，起临时服务，进度写进临时 Git 仓库。
  - 768 像素宽看了改过的 7 节新课、`change-of-variables` 和变分法两节，展开全部提示和简单题、中等题的解答：0 处公式报错，没有横向滚动。
  - 浮窗核了闭曲面、平面旋度（显示旋度）、换元公式、面积元、切平面、通量、散度、切向量、光滑曲线。
  - 看完删了副本；仓库 `progress/` 的差异和开审时一样，只有你自己的 3 条。
- 全量：
  - `npm run content`：0 个错误、0 个警告；
  - `npx tsc -b`：退出码 0，初审时光学脚本报的那处已经没了；
  - `npm test`：23 个文件、202 条全过。

### 要写回 plan.md 的

1. 初审列的三条照旧：
   - 多变量微积分的前置改动：`parametric-surfaces` 加 `space-curves`，这一轮已经改了，记进那一段的前置改动列表；
   - `plan.md:245` 中学词的例子补「法向量」「闭曲线」；
   - 给 `stokes-theorem`、`pde.heat-equation`、`pde.laplace-equation`、`complex-analysis.harmonic-functions` 的留言。
2. 这一轮新增的：
   - 符号约定：单位法向量，多变量微积分写 $\vb n$（和单位切向量 $\vb T$ 一致），电磁学写 $\uv n$，各自统一（批次 15，协调会话定的）。
   - `plan.md:227` 补一个例子：答案的一部分和例题算过的积分相同，也要换（批次 15：`line-integrals` 第 3 题的 $-y\,\dd x$ 那一半和例 2 是同一个积分）。
   - `plan.md:244` 的定理名例子补「重积分的换元公式」（批次 15）。
   - 给以后改到这几节的会话留的话：
     - `gauss-law:25`、`stress-energy-tensor:67` 的「面元」括注换成 vector area element（原有 1）；
     - `vector-fields` 第 8 题参考解答的链接改指 `conservative-fields`（原有 2）。

### 剩下的

- 原有 1、2 这次不改，协调会话定的。
- 没验证的，和初审一样：动画的实际帧率、亮色主题下的图、手机宽度。

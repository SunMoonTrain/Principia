# 批次 16 审查报告：多变量微积分（斯托克斯公式、曲线坐标、δ 函数与势）

审内容 agent（和写内容 agent 是两个独立会话，没有读它的会话记录、交接说明和自查脚本）· 2026-11-12

审查范围：`math.vector-calculus` 的最后 4 节：`stokes-theorem`、`curvilinear-coordinates`、`delta-3d`、`potentials`。包括：

- 它们的文件头、`problems.yaml`（32 道题）、2 张 SVG（`stokes.svg`、`cylinder-box.svg`）、2 个动画（`delta-3d` 的 `function-plot`、`potentials` 的 `vector-field-2d`）；
- `_domain.yaml` 新增的 6 个术语（术语表从 74 条到 80 条）；
- 已审小节补标后退回 `written` 的 3 节：`greens-theorem`（「正向」进表、`:25` 新加的「为什么这样定义」）、`conservative-fields:52`、`divergence-theorem:29`。

另外看了：

- 以这一批为直接前置的已写小节（电磁学 3 节）和指向这一批的链接；
- 以这一批为直接前置、还没写的 4 节的大纲（`goal`）；
- 规矩 C 两个方向的扫描；
- 两处史实。

初审前按「每批的流程」第 4 条，把整个 `content/math/vector-calculus/`（含 `_domain.yaml`）拷了一份快照到我的 scratchpad（`b16-snapshot/`），复核时和它比。

## 结论

没有重要问题；小问题 3 条；没有原有问题。讲解、例题、32 道题、2 张图和 2 个动画的数学都对；简单题、中等题 16 道独立验算全部一致。

- **小问题 1：`delta-3d` 例 2 的推导用了链外的乘积法则**
  - `delta-3d:93`：「由乘积法则（product rule），$\divg\vb F_\varepsilon=3g+\vb r\cdot\nabla g$」。这是 `vector-identities#thm-product-rules` 的 $\divg(f\vb F)=f\,\divg\vb F+\nabla f\cdot\vb F$，而 `vector-identities` 不在 `delta-3d` 的链上（前置是 `divergence-theorem`、`math.calculus.dirac-delta`）。例题的推理不能用链外的结论（`plan.md:1057`）。
  - 建议按分量直接算，只用链上的偏导数和链式法则：$\pdv{}x(gx)=g+x\pdv gx=g+\frac{x^2}rg'(r)$，三个分量相加得 $3g+rg'(r)$。
  - 这一节别处用到 `vector-identities` 的只有 `:48` 把 $\divg\nabla$ 起名为拉普拉斯算子，当场说了是什么，推理没用到它，可以。所以不必为此加前置，理由见「我替你定的」8。
- **小问题 2：`curvilinear-coordinates` 页面上的两处**
  - 四个定理卡片以「具体写出来：」结尾，公式落在卡片外面。
    - 出处：`:37`、`:46`、`:59`、`:72`。锚点只框住紧接的一段（`plan.md:244`），后面的行间公式不在卡片里。
    - 页面上看过：卡片最后一句是「……$\uv e_3$。具体写出来：」，冒号后面什么也没有。一般式在卡片里，结论本身没问题。
    - 建议把「具体写出来：」从锚点段挪出去，另起一行不带锚点的话（例如「在球坐标、柱坐标里具体写出来是：」），卡片以句号结束。
  - `cylinder-box.svg` 右图的标签：
    - 左下那个「φ̂」被 $x$ 轴穿过。轴线是 `<line x1="348" y1="146" x2="608" y2="146">`，标签的文字框是 $x$ 356.6–371.2、$y$ 130.3–148.6。放大导出看，φ 的竖笔正压在轴线上。
    - 两个「φ̂」和图下说明里的「φ̂」，组合用的帽子 U+0302 都画在 φ 的右上方，读着像「φ^」；「ŝ」正常。
    - 建议把左下的标签挪离轴线（例如放到箭头尖的左上方）。帽子另画一个居中的「^」，或者标签改成和正文一样的写法。
- **小问题 3：`curvilinear-coordinates` 第 7 题参考解答的验算式写错**
  - `problems.yaml:121`：$\lap\bigl(-\frac{r^2}6\bigr)=-\frac16\bigl(2+\frac2r\cdot r\bigr)=-1$。$r^2$ 的导数是 $2r$，括号里应是 $2+\frac2r\cdot2r=6$；照写的算出来是 $-\frac23$，和后面的 $=-1$ 对不上。改成 $-\frac16\bigl(2+\frac2r\cdot2r\bigr)=-1$。
  - 参考解答网页上不显示，但「复制给 Claude」批改时会带上。

**写内容会话拿不准的两条、协调会话列的几处**：都可以，理由见「我替你定的」。

## 改了没报的

无。改动和协调会话转述的一致：

- 4 节的正文、题目和 2 张 SVG。文件头加了 `minutes`、`summary`，改了 `status`；`curvilinear-coordinates` 的前置加了 `stokes-theorem`；标题、`goal` 没动。
- `_domain.yaml` 只加了 6 条新术语。
- 3 节旧课只改了补标的行、`greens-theorem:25` 新加的一段和 `status`，题目文件都没动。
  - `greens-theorem` 标了 6 处「正向」：`:23`、`:30`、`:43`、`:49`、`:59`、`:81`；`:32` 和 `:30` 在同一块，不用再标。
  - `conservative-fields:52`。
  - `divergence-theorem:29`。

## 要修的，按小节分

- `delta-3d`：例 2 不引乘积法则，按分量算（小 1）。
- `curvilinear-coordinates`：
  - 四个定理段的「具体写出来：」挪出卡片（小 2）；
  - `cylinder-box.svg` 的 φ̂ 标签（小 2）；
  - 第 7 题参考解答的验算式（小 3）。

## 需要你决定的

无。

## 我替你定的

1. **标量势取 $\vb F=-\nabla U$、记作 $U$，势函数 $f=-U$**：可以。
   - 和电磁学 $\vb E=-\nabla\varphi$、`gauge-potentials:22` 的「负梯度」一致；$\varphi$ 在本领域留给方位角。
   - `potentials:30` 当场说了和势函数差一个负号，`:115` 的误区又提醒一次。
2. **矢量势的定理只证全空间和长方体，星形区域的公式放第 5 题，「闭曲面都能缩成一点」写「这里不给」**：合 `sketch`。
   - 构造（`:47`）我按分量核过：$\curl\vb A$ 的第二、三个分量直接成立，第一个分量用 $\divg\vb G=0$。
   - 积分号下求导写了条件、链了出处（`:49`）。
   - 第 5 题的 $\int_0^1t\,\vb G(t\vb r)\times\vb r\,\dd t$ 我用 $\vb G$ 为常向量的情形核过符号。
3. **「星形区域」「尺度因子」「正交曲线坐标」「筛选性质」只加锚点**：可以，本领域都只有一节用（`plan.md:244`）。
   - 「尺度因子」广义相对论 3 节也用，说的是宇宙学的 $a(t)$，意思不同，两边都没进表。
   - 「筛选性质」常微分方程 `convolution-impulse` 也用（一元的）。以后微积分 `dirac-delta` 写的时候，一元的进不进表到时候定，`delta-3d` 的三维版本到时候再看要不要指过去。
4. **`thm-simply-connected-space` 的证明思路（`stokes-theorem:52`）**：闭曲线缩成一点时扫出一张曲面，把它修成分片光滑的那一步「这里不证」，合 `sketch`。
   - 「去掉一个点的空间是单连通的」和 `conservative-fields` 第 7 题、`potentials:25` 一致。
5. **「点源」的定义段用质点作例子，电荷放在旁白里**：可以。
   - 定义段不必借电磁学的词；`:43` 的旁白标了电磁学的「高斯定律」（规矩 C）。
6. **坐标方向的单位向量戴帽子，$\vb n$、$\vb T$ 照旧用粗体**：可以。
   - 本领域 `jacobian:52`、`change-of-variables` 已经用 $\uv{}$ 写坐标的单位向量，电磁学也是；单位法向量、单位切向量照批次 15 定的写粗体。
7. **$\delta^3$ 的两种近似**：讲解用均匀小球，例 2 和动画用 $\frac{3\varepsilon^2}{4\pi(r^2+\varepsilon^2)^{5/2}}$，都对。
   - `:75` 说了「它是 $\delta^3$ 的一种近似」，读者不会以为是同一个。
   - 动画两条曲线核过：$4\pi r^2\delta_\varepsilon$ 是 $M(r)=\frac{r^3}{(r^2+\varepsilon^2)^{3/2}}$ 的导数。峰在 $r=\sqrt{\frac23}\varepsilon$，高约 $\frac{0.558}\varepsilon$；$\varepsilon=0.1$ 时约 $5.58$，在纵轴的 $6$ 以内。
8. **拿不准的第 1 条：`delta-3d` 不加 `vector-identities` 前置**：同意不加。
   - 定理先写成 $\divg\nabla\frac1r=-4\pi\delta^3$，再当场把 $\divg\nabla$ 起名为拉普拉斯算子，推理只用链上的散度和梯度；第 3 题的 $\lap$ 记号在 `:48` 交代过。
   - 加了的话，电磁学 `poisson-equation` 的那条前置要删、那一节退回 `written`，为一个起名不值得。
   - 唯一真用到 `vector-identities` 结论的是例 2 的乘积法则，改成按分量算即可（小 1）。
9. **拿不准的第 2 条：`stokes-theorem` 不加 `divergence-theorem` 前置**：同意不加。
   - `thm-same-boundary` 本身是用斯托克斯公式证的（两边都等于沿 $C$ 的环量）。`:61` 的散度定理是「另一个看法」，标了术语、链了出处，读者跳过也不影响。
   - 第 6 题（2）是题目文字，链了出处，合 `plan.md:1057`。
   - 加前置的代价比协调会话算的还多一项：除了 4 节层级抬高，`curvilinear-coordinates` 的直接前置 `divergence-theorem` 会因为经 `stokes-theorem` 推得出而变多余，要再删一条。
10. **`curvilinear-coordinates` 第 7 题的「适当的单位」**：可以。
    - 稳态时 $k\lap T=-q$（$q$ 是单位体积的产热率），取单位使 $\frac qk=1$ 就是 $\lap T=-1$。
    - $\frac Br$ 对应球心的点热源，热流 $4\pi B$ 不随小球缩小而变，参考解答说得对。
11. **史实**：都对。
    - 斯托克斯公式最早见于 1850 年 7 月 2 日威廉·汤姆孙写给斯托克斯的信的附言，斯托克斯 1854 年把它出成史密斯奖考题（Katz，*The History of Stokes' Theorem*，Mathematics Magazine 52，1979）。
    - `stokes-theorem:36` 写「开尔文（Lord Kelvin）」：他 1892 年才封爵，1850 年还叫威廉·汤姆孙。这是通行的叫法，可以不改；想更准确，可写「威廉·汤姆孙（后来的开尔文勋爵）」。
    - 狄拉克 1931 年的磁单极论文是 *Quantised Singularities in the Electromagnetic Field*（Proc. R. Soc. A 133）。`potentials` 第 8 题的 $\frac{1-\cos\theta}{r\sin\theta}\uv\varphi$ 正是带一条「弦」的那种矢量势，说法对。
12. **跨领域补标**：没有要补的，和协调会话扫的一致。
    - 我反向扫了 6 个新术语和「正向」在别的领域已写小节正文里的链外出现：一处都没有。
    - 「三维 $\delta$ 函数」名字里有公式，脚本匹配不到，另外用 grep 查了：只有电磁学 `gauss-differential:37`，在链上。
13. **3 节旧课**：补标都对。
    - `greens-theorem:25` 新加的「为什么这样定义」有理由也有边界情况（洞的边界顺时针），合 ca295af 写回的那条（为进表新加的定义段也要有）；
    - `conservative-fields:52` 改成链到 `stokes-theorem#thm-simply-connected-space`，锚点存在；
    - `divergence-theorem:29` 的标记和链接对。
    - 复核时和这一批一起改回 `reviewed`。

## 要写回 plan.md 的

1. **多变量微积分这一批的记号和做法**（写内容会话定的，审查认可）：
   - 标量势 $\vb F=-\nabla U$，记作 $U$，势函数 $f=-U$；
   - 坐标方向的单位向量写 $\uv r$、$\uv\theta$、$\uv\varphi$、$\uv s$，$\vb n$、$\vb T$ 仍是粗体；方位角本领域写 $\varphi$，电磁学写 $\psi$；
   - 「星形区域」「尺度因子」「正交曲线坐标」「筛选性质」只加锚点；
   - `delta-3d` 不加 `vector-identities` 前置，`stokes-theorem` 不加 `divergence-theorem` 前置，理由见「我替你定的」8、9。
2. **前置改动**：`curvilinear-coordinates` 加 `stokes-theorem`（写内容会话改的，层级不变）。
3. **给以后的领域留的话**（多变量微积分 31 节写完了）：
   - 偏微分方程 `laplace-separation`、`laplace-equation`：
     - 极坐标的拉普拉斯算子和 $s^k\cos k\varphi$ 调和，在 `curvilinear-coordinates` 第 8 题；
     - 「调和函数」在 `vector-identities#def-harmonic`，只有锚点，加上这一节的题目文字，用到时进表。
   - 偏微分方程 `wave-3d`：球对称时 $\lap f=\frac1r(rf)''$，在 `curvilinear-coordinates` 第 7 题（1），推球面波直接用。
   - 偏微分方程 `greens-functions`：
     - 基本解要的 $\lap\frac1{|\vb r-\vb r'|}=-4\pi\delta^3(\vb r-\vb r')$ 在 `delta-3d#thm-laplacian-inverse-r`；
     - 泊松方程的积分解在 `delta-3d:52`（形式推导），均匀球的例子在第 7 题。
   - 偏微分方程 `heat-equation`：
     - 稳态的均匀产热球在 `curvilinear-coordinates` 第 7 题；
     - 连续性方程（`divergence-theorem#def-continuity-equation`）、热方程（`divergence-theorem` 第 7 题）照批次 15 的留言。
   - 微分几何 `stokes-on-manifolds`：
     - 要统一的三个名字都有了：「格林公式」「斯托克斯公式」是术语，「高斯公式」是「散度定理」的别名；
     - 边界的走向是术语「正向」（定义在 `greens-theorem`，曲面情形在 `stokes-theorem#def-boundary-orientation`）；
     - 不可定向的例子是 `surface-integrals` 第 7 题的莫比乌斯带。
   - 微分几何 `regular-curves`、`regular-surfaces`：本领域的「光滑曲线」「光滑曲面」就是一阶正则（导数连续、处处不为零），写「正则」时说清和它们的关系，按意思选 id。
   - 复分析 `cauchy-theorem`：
     - 用格林公式证时要 $u$、$v$ 有连续的偏导数（`greens-theorem:30` 的条件）；
     - 只假定全纯的版本（古尔萨）不能直接套。
   - 复分析 `harmonic-functions`：「调和函数」见上。
   - 微积分 `dirac-delta`：一元的「筛选性质」进不进表到时候定；`delta-3d:22` 已经按它的 `goal` 假定读者学过一元 $\delta$ 函数，写的时候和 `delta-3d:22` 的说法对一下。

## 下游和前向链接

- **电磁学 3 节都接住了**：
  - `ampere-law`：
    - `:45` 用斯托克斯公式把积分形式化成微分形式，「对任意小的曲面都成立，被积函数连续，只能处处相等」，对得上 `stokes-theorem:45`；
    - `:52`「穿过以同一条闭合曲线为边界的任意两个曲面的磁通量相同」，对得上 `thm-same-boundary` 和第 6 题（3）。
  - `gauss-differential:37`：$\delta^3$ 在原点以外为零、在包含原点的区域上积分为 $1$，对得上 `def-delta-3d`。
  - `poisson-equation`：
    - `:29` 的三个式子都在 `delta-3d`，那边写 $\frac{\uv r}{r^2}$，这边写 $\frac{\vb r}{r^3}$，相等；
    - `:43` 的球坐标拉普拉斯算子（方位角 $\psi$）对得上 `curvilinear-coordinates:74`，`:78` 交代了 $\varphi$ 和 $\psi$。`curvilinear-coordinates` 不在它的链上，但它是为写出式子引数学结论并链出处，合 `plan.md:1057`。
  - `vector-potential`：
    - `:22`「全空间（或其他足够简单的区域）上无散场是旋度」、`:43`「全空间上无旋场是梯度」，对得上 `thm-vector-potential`、`thm-scalar-potential`；
    - 第 6 题（螺线管外 $\frac\Phi{2\pi s}\uv\psi$ 不是单值函数的梯度）和 `potentials:55`、第 7 题说法一致。
  - `gauge-potentials:22`：$\vb B=\curl\vb A$，旋度为零的场写成负梯度，和标量势的符号约定一致。
- **本领域**：
  - `conservative-fields:52` 留下的空间情形，由 `thm-simply-connected-space` 补上，`:50` 说明了这一点；
  - `greens-theorem` 第 7 题的平面旋度，`stokes-theorem:43` 接上；
  - `vector-identities` 第 7 题参考解答「以后讲的定理（在合适的区域上，无旋场是梯度场，无散场是旋度场）」，由 `potentials` 的两个定理接住，例 1 求出的矢量势和那里的完全一样。
- **还没写的 4 节**：`goal` 都有落点，见「要写回 plan.md 的」3。
  - `math.differential-geometry.stokes-on-manifolds`；
  - `math.pde.greens-functions`、`laplace-separation`、`wave-3d`。

## 怎么审的

- **读题和验算**：
  - 简单题、中等题用 `npm run statements -- <4 节> --tier easy,medium` 读题，独立写了 4 个验算脚本，16 道全部一致。验算完才打开 `problems.yaml` 读难题、思考题和全部提示、解答。
  - `_vc.ts` 加了高斯-勒让德求积的节点和权重（`gaussLegendre`）。
  - 验算不用要验的那条结论：
    - `stokes-theorem`：
      - 问旋度通量的题，旋度用中心差分，在题给的半球面、圆锥面上直接积通量，不换成边界；
      - 问环量的题沿曲线切成折线累加；
      - 圆柱面上面那一圈的走向，在一点上按「外法向 × 走向指向曲面里面」定，不预设顺逆。
    - `curvilinear-coordinates`：
      - 函数、场先换成直角坐标；
      - 梯度用中心差分，$\uv\theta$ 用 $\partial\vb r/\partial\theta$ 归一化；
      - 散度用小立方体通量，旋度用小圆环量，拉普拉斯算子用小球面平均外推，不用这一节的任何公式。
    - `delta-3d`：
      - 第 1、2 题把 $\delta^3$ 换成宽 $\varepsilon$ 的三维高斯分布，三重高斯求积后 $\varepsilon\to0$ 外推；
      - 第 3 题把 $\frac1{|\vb r-\vb a|}$ 换成 $\frac1{\sqrt{|\vb r-\vb a|^2+\varepsilon^2}}$，拉普拉斯算子用二阶差分，在以 $\vb a$ 为中心的球坐标里对全空间积分（$\varepsilon=10^{-5}$），相对误差 $2\times10^{-8}$；
      - 第 4 题在球面上直接积通量，不用散度定理。
    - `potentials`：
      - 标量势按定义 $-\int\vb F\cdot\dd\vb r$ 累加，换一条弯的路核对；
      - 旋度用小圆环量；
      - 第 4 题按讲解的式子逐点数值积分出 $\vb A_1$，先核对 $\curl\vb A_1=\vb G$，$\chi$ 沿两条路核对。
- **全量检查**：
  - `npm run content`：0 个错误、0 个警告；
  - `npx tsc -b`：退出码 0；
  - `npm test`：23 个文件、202 条全过；
  - `npm run verify`：246 节全部一致，退出码 0。
- **术语**：
  - 每一块里术语第一次单独出现有没有标记，4 节新课和 3 节旧课都查了。报出 3 处都不用改：
    - `delta-3d:22` 的「在 $a$ 处连续」是一元的，按 `plan.md:246` 不标本领域的 id；
    - `greens-theorem:41`、`:83` 是「通量形式」这个名字里的「通量」。
  - 「三维 $\delta$ 函数」名字里有公式，人工核了每一块第一次出现都标了。
  - 没有超过 4 句的段。
  - 括注按页面先后查：报出的都是中学词（法向量、引力场、点电荷、库仑定律、磁通量、势能）、术语的形容词用法（无散、无旋）和只起「见某节」作用的链接文字。
  - 讲解里起名的段落 7 处，都有锚点。拼词：标记前后一到四个字拼不出别的术语。
- **链接、前置、规矩 C**：
  - 链接的目标、锚点都存在，6 条新术语的锚点段里都有术语名；前置没有多余的。
  - 锚点段：`curvilinear-coordinates` 四个定理段以冒号结尾、后面紧跟行间公式，见小问题 2。
  - 链外的标记 8 处：
    - 规矩 C 标的 6 处：`stokes-theorem:45`「安培环路定理」、`:61`「磁通量」，`delta-3d:43`「高斯定律」，`potentials:44`「规范变换」、`:55`「螺线管」「磁矢势」；
    - `stokes-theorem:61`「散度定理」、`delta-3d:48`「拉普拉斯算子」两处见「我替你定的」8、9。
  - 题目文字链到链外的，都合 `plan.md:1057`：
    - `stokes-theorem` 第 6 题：散度定理、恒等式；
    - `delta-3d` 第 5 题：格林公式；第 7 题：曲线坐标；
    - `potentials` 第 7、8 题：曲线坐标、电磁学 `vector-potential`。
  - 规矩 C 正向：报出的都不用标——
    - 中学词：法向量、电荷、电场、电势、库仑定律；
    - 链上学过的：微积分基本定理、一元的链式法则；
    - 意思不同的：`curvilinear-coordinates:109`「奇点」是场的奇点，不是常微分方程的奇点；
    - 本领域自己的 id：势函数、分段光滑；
    - 题目文字里的。
- **引文**：「例 N」「第 N 题」逐个对过。
  - 例子：`stokes-theorem:25` 指第 2 题、`:34` 指第 8 题、`:45` 指第 7 题、`:61` 指第 6 题；`curvilinear-coordinates:106`、`:108` 都指第 6 题；`delta-3d:29` 指第 6 题、`:34` 指第 8 题、`:52` 指第 7 题；`potentials:51` 指第 5 题、`:55` 指第 7 题、`:57` 指第 6、8 题。
  - 没有「上一节」「下一节」。
- **页面**：
  - 网站构建到 scratchpad，起临时服务，进度写进临时 Git 仓库（`buildServer` 的 `dataRoot`），看完删了副本；仓库的 `dist/`、`progress/` 都没动。
  - 768 像素宽看了 4 节新课和 3 节旧课，每节展开全部提示和简单题、中等题的解答：0 处公式报错，没有横向滚动。
  - 浮窗核了正向、斯托克斯公式、三维 $\delta$ 函数。
  - 2 张 SVG 导出看过（暗色），图注逐项对过：
    - `stokes.svg`：穹顶前半圈的走向向右，和法向朝上配套；两小块都逆时针，共用边上一上一下。
    - `cylinder-box.svg`：内外弧长、$\uv s$ 朝外、$\uv\varphi$ 沿逆时针切线。
    - 文字不重叠、离边至少 14.6 像素；压线的只有小问题 2 那一处。
  - 动画：
    - `potentials`：默认、$a=0.8$、$R=1$ 几组的箭头和场的式子对得上，表达式里的 `max` 能用；
    - `delta-3d`：$\varepsilon=0.5$、$0.1$ 两组曲线的峰位、峰高和总量对得上；
    - 两条曲线按蓝、橙上色，和说明一致。

## 各节

只记有内容的地方；上面已经报过的不重复。

- **`stokes-theorem`**：
  - 曲面边界的正向用「头朝 $\vb n$、曲面在左手边」定义，右手定则作第二种说法，平面情形回到格林公式。
  - 图像情形的证明思路我逐项展开核过：$R_zg_xg_y$、$Rg_{xy}$ 两对抵消，剩下 $(\curl\vb F)\cdot(-g_x,-g_y,1)$，和第 5 题一致。
  - 例 1（两边都是 $2\pi$）、例 2（$8\pi$）核过。
  - 难题、思考题：
    - 第 5 题：图像情形的证明；
    - 第 6 题：两张曲面，（2）里「一张的法向量朝 $V$ 外、另一张朝里」说得对；
    - 第 7 题：刚体转动，单位面积环量 $2|\boldsymbol\omega|$；
    - 第 8 题：$C_1$ 绕轴、$C_2$ 不绕。
- **`curvilinear-coordinates`**：
  - 单位向量的分量、右手系、尺度因子、四组公式（梯度、散度、旋度、拉普拉斯算子）逐项核过；验算脚本也用直角坐标的数值导数核了第 1–4 题。
  - 散度、旋度的证明思路（小盒子的通量、小矩形的环量）的符号对。
  - 例 1（$\frac1s\uv\varphi$、$s\uv\varphi$）、例 2（$\lap(z^2)=2$，$\theta$ 那一项不能丢）核过。
  - 第 5 题柱坐标散度的推导、第 6 题 $\pdv{\uv r}\theta=\uv\theta$ 和 $\divg\uv r=\frac2r$、第 8 题 $s^k\cos k\varphi$ 调和，核过。
- **`delta-3d`**：
  - 定义、筛选性质、点源都有「为什么」和边界情况（原点在边界上时半空间是 $\frac12$，第 6 题（2））。
  - 例 1（$8$、$0$）、例 2（$\divg\vb F_\varepsilon=4\pi\delta_\varepsilon$、总量 $1$）核过。
  - 第 5 题平面上的 $2\pi\delta^2$、第 7 题均匀球的位势（$r=1$ 处 $f$、$f'$ 都接上）、第 8 题 $\delta^3(\lambda\vb r)=\frac1{|\lambda|^3}\delta^3(\vb r)$，核过。
- **`potentials`**：
  - 星形区域一定单连通，去掉一点的空间单连通但不是星形，说得对。
  - 例 1 的矢量势 $\bigl(0,\frac{x^2}2,\frac{y^2}2-xz\bigr)$、例 2 的 $U=-x^2y-yz$ 核过。
  - 第 5 题（3）两个矢量势之差的 $\chi$ 我求导核过；第 6 题用上下半球各用斯托克斯公式，得通量为零的矛盾。
  - 第 8 题：区域去掉负半轴以后以 $(0,0,1)$ 为中心是星形的；我核过从 $(0,0,1)$ 到任一点的线段不碰负半轴。

## 没验证的地方

- 动画的实际播放：面板隐藏，粒子不走，只核了箭头和曲线的画面。
- 亮色主题下的图：只导出了暗色。
- 手机宽度（375 像素）：只看了 768 像素。

## 修订说明（写内容会话）

三条小问题都修了，可选的那条也改了。同类问题按审查说的整批找过，没有再找出要改的。只改了 `content/math/vector-calculus/` 的 6 个文件；4 节和 3 节旧课的 `status` 没动，仍是 `written`。

### 小问题 1：`delta-3d` 例 2 不再用乘积法则

- `delta-3d:93` 改成按分量算：由链式法则，$\pdv gx=g'(r)\frac xr$，$\pdv{}x(gx)=g+\frac{x^2}rg'(r)$，三项相加得 $3g+rg'(r)$。
  - 「链式法则」是这一块第一次出现，标了 `math.vector-calculus.chain-rule`；也是这一节第一次出现，括注 chain rule。
  - 它定义在 `multivariable-chain-rule`，在 `delta-3d` 的链上。
- 原来那段加上这几句会超过 4 句，拆成两段：`:93` 求散度，`:95` 讲通量和 $\varepsilon\to0$ 的极限（文字没改）。
- 同类：4 节的讲解、例题、几何图像、常见误区，用脚本按段落列出所有链外的东西，逐条看过。
  - 查的范围：链外的术语（标了的、没标的都算），和这些结论的式子：乘积法则、两个恒等式、$\lap$、$\delta^3$、积分号下求导、泰勒、换元、曲线坐标的单位向量。
  - 剩下的都是审查认可过的：
    - `stokes-theorem:45`「安培环路定理」；`:61`「散度定理」「磁通量」，以及恒等式的链接。
    - `delta-3d:43`「高斯定律」；`:48` 给 $\divg\nabla$ 起名，`:52`、`:101` 用这个记号；`:52` 把 $\delta^3$ 移进积分号，写明了是形式推导。
    - `potentials:44`「规范变换」；`:49` 积分号下求导，链了出处；`:55`「螺线管」「磁矢势」。
  - 题目文字用到链外结论的，都链了出处，就是审查列过的那几处，没有新的。

### 小问题 2：`curvilinear-coordinates` 的卡片和图

- 四张定理卡片都以句号结束。「具体写出来」另起一段，不带锚点。
  - 梯度 `:37`，后接 `:39`「在球坐标、柱坐标里具体写出来是：」。
  - 散度 `:48`，后接 `:50`。
  - 旋度 `:63`，后接 `:65`。
  - 拉普拉斯算子 `:78`，后接 `:80`。
    - 原来这一段只有「把梯度代进散度，就得到……$\lap f=\divg(\nabla f)$：」，结论全在后面的行间公式里。
    - 现在和梯度、散度两张卡片一样，把一般式写进卡片：$\lap f=\frac1{h_1h_2h_3}\Bigl[\pdv{}{q_1}\Bigl(\frac{h_2h_3}{h_1}\pdv f{q_1}\Bigr)+\cdots\Bigr]$，三项都写出。
  - 新起的四段，是各自那一块第一次出现「球坐标」「柱坐标」，都标了；`:80` 的标记是从原来的 `:72` 挪过来的。
- `cylinder-box.svg`：
  - 左下的 φ 标签挪到箭头尖的左上方（`:47`）。文字框是 $x$ 358–370、$y$ 117–135，离 $x$ 轴 11 像素，离箭头尖 5 像素。
  - 两个 φ 标签的帽子改成单独画的「^」，居中放在 φ 上方（`:40`、`:48`）。
  - 图下说明改成「两个单位向量随点变：」（`:49`），不再用组合字符。
  - 图的替代文字（`lesson.md:90`）跟着改：说明的引文换成新说法，标签写成「带帽的 φ」。
  - 同类：本领域文件里的组合字符 U+0302 原来只有 5 处（图里 3 处、替代文字 2 处），现在没有了。「ŝ」是预组合字符 U+015D，显示正常，没改。
- 同类：4 节新课和 3 节旧课的锚点段用脚本查过，没有别的以冒号结尾。

### 小问题 3：`curvilinear-coordinates` 第 7 题的验算式

- `problems.yaml:121` 改成 $-\frac16\bigl(2+\frac2r\cdot2r\bigr)=-1$。
- 同类：4 节里写了「验算」「核对」的式子逐个重算过，都对：
  - `curvilinear-coordinates` 第 1–4 题、第 8 题的解答；
  - `potentials:100`、`:108`（例 1、例 2）和第 3 题的解答；
  - `delta-3d` 第 7 题的提示和解答。

### 可选：史实里的称呼

- `stokes-theorem:36` 改成「威廉·汤姆孙（William Thomson，后来的开尔文勋爵）1850 年 7 月写给斯托克斯的一封信的附言里」。
- 按 Katz 补了「7 月」「附言」。本领域别处没有「开尔文」。

### 检查

- `npm run content`：0 个错误、0 个警告（全量构建；光学那边已经不报错了）。
- `npm test`：23 个文件、202 条全过。
- 审查的 4 个验算脚本单独跑（导入 `lib.ts` 的 `runVerification`）：16 题全部一致。
- 自查：
  - 未标记的只剩审查认可的 `delta-3d:22`（一元的「连续」）；
  - 括注顺序只报出老情况：小标题先于定义段、泛用词。
- 页面：网站构建到 scratchpad，起临时服务，进度写进临时仓库；看完删了副本。仓库的 `dist/`、`progress/` 没动。
  - 768 像素：`curvilinear-coordinates`、`delta-3d` 两节公式报错 0 处，页面不左右滚动，行间公式不用横向滚动。
  - 四张卡片的文字都以「。」结束，后面紧跟「在球坐标、柱坐标里具体写出来是：」。拉普拉斯算子卡片里的一般式宽 671 像素，卡片宽 716 像素，放得下。
  - 浮窗：`delta-3d` 新标的「链式法则」点开是对的。
  - 图：从页面上把内嵌的 SVG 画到画布上导出看过（暗色背景、页面字体）；另用无头 Edge 把两个 φ 标签放大 8 倍看过。
- 没验证：
  - 375 像素宽时，`curvilinear-coordinates` 页面会左右滚动，是散度卡片（原来就有）和拉普拉斯算子卡片里的长行内式撑的。plan.md:268 说手机宽度不在目标里，没拆。
  - 亮色主题下的图没看。

## 复核

审内容 agent · 2026-11-12。和初审快照 `b16-snapshot/` 逐行比了这一轮的改动；3 节旧课用 `git diff HEAD` 看。

### 结论

通过，没有要再改的。3 条小问题都改了，可选的那条也改得对；修订说明里同类问题的自查结果，我重跑脚本核过，一致。改了没报的：无。

7 节的 `status` 改成了 `reviewed`，只改了这一行：

- 这一批 4 节：`stokes-theorem`、`curvilinear-coordinates`、`delta-3d`、`potentials`；
- 补标的 3 节旧课：`greens-theorem`、`conservative-fields`、`divergence-theorem`。

多变量微积分 31 节现在全是 `reviewed`。

### 逐条

- **小问题 1：`delta-3d` 例 2**
  - `:93` 改成按分量算：$\pdv gx=g'(r)\frac xr$，$\pdv{}x(gx)=g+\frac{x^2}rg'(r)$，三项相加时用 $x^2+y^2+z^2=r^2$，得 $3g+rg'(r)$，对。
  - 标的「链式法则」是本领域多元的那一条，`multivariable-chain-rule` 在链上；浮窗点开看过。
  - 拆成 `:93`、`:95` 两段以后，各 3 句。
- **小问题 2：`curvilinear-coordinates`**
  - 四张定理卡片（`:37`、`:48`、`:63`、`:78`）都以句号结束。「在球坐标、柱坐标里具体写出来是：」另起不带锚点的一段（`:39`、`:50`、`:65`、`:80`），段里的标记是各块第一次出现。
  - 拉普拉斯算子卡片新写进的一般式 $\lap f=\frac1{h_1h_2h_3}\Bigl[\pdv{}{q_1}\Bigl(\frac{h_2h_3}{h_1}\pdv f{q_1}\Bigr)+\cdots\Bigr]$ 对：把 $F_i=\frac1{h_i}\pdv f{q_i}$ 代进散度公式就是它。页面上卡片宽 721 像素，里面最宽的式子 671 像素，放得下。
  - `cylinder-box.svg`：
    - 左下的 φ 标签挪到 $(364,131)$，离 $x$ 轴（$y=146$）够远；
    - 两个帽子改成单独画的折线，居中在 φ 上方，放大导出看过；
    - 图下说明、替代文字（`lesson.md:90`）跟着改，和图一致；
    - 脚本报的「压线」只剩两个帽子落在各自 φ 的文字框里，是有意的；
    - 本领域文件里已经没有组合字符 U+0302。
- **小问题 3**：`curvilinear-coordinates/problems.yaml:121` 改成 $\frac2r\cdot2r$，对。
- **可选**：`stokes-theorem:36` 改成「威廉·汤姆孙（William Thomson，后来的开尔文勋爵）1850 年 7 月写给斯托克斯的一封信的附言」，和 Katz 一致。
- **375 像素宽会左右滚动**：`plan.md:268` 写明手机宽度不在目标里、长行内式不用逐个拆，同意不改。

### 改了没报的

无。

修订说明开头写「改了 6 个文件」，可和快照比有差异的是 5 个：

- `delta-3d/lesson.md`、`stokes-theorem/lesson.md`；
- `curvilinear-coordinates` 的 `lesson.md`、`problems.yaml`、`cylinder-box.svg`。

每一处改动都在说明里。多出的那 1 个没有留下改动，只是数字对不上。

### 怎么核的

- 和快照逐行比，变化的行再按字比。
- 自查脚本重跑 7 节，结果和初审认可的一样，没有新报出的：
  - 每块第一次出现的标记、括注、句数；
  - 锚点段（不再有以冒号结尾的）、起名段、拼词；
  - 链上链外的标记、规矩 C。
- 验算：
  - 7 节的脚本单独跑，28 道全部一致；
  - 全量 `npm run verify`：246 节全部一致，退出码 0。
- 页面：
  - 网站构建到 scratchpad，起临时服务，进度写进临时 Git 仓库，看完删了副本；仓库的 `dist/`、`progress/` 没动。
  - 768 像素宽看了 `curvilinear-coordinates`、`delta-3d`、`stokes-theorem`：0 处公式报错，没有横向滚动。
- 全量：
  - `npm run content`：0 个错误、0 个警告；
  - `npx tsc -b`：退出码 0；
  - `npm test`：23 个文件、202 条全过。

### 要写回 plan.md 的

1. 初审「要写回 plan.md 的」三条照旧：
   - 这一批的记号和做法；
   - `curvilinear-coordinates` 加 `stokes-theorem` 的前置改动；
   - 给偏微分方程、微分几何、复分析、微积分 `dirac-delta` 的留言。
2. 这一轮新增两条写法规矩：
   - 定理卡片以句号结束：「具体写出来：」这类引出后面行间公式的话，放到卡片外另起一段。卡片里要写进结论本身，和 `plan.md:244` 一致（批次 16 审查时提的：`curvilinear-coordinates` 四张卡片原来以冒号结尾）。
   - SVG 里带帽的字母（φ̂ 这类）不用组合字符 U+0302：有的字体把帽子画到右上方，读着像「φ^」。帽子单独画一个居中的「^」（批次 16 审查时提的：`cylinder-box.svg`）。

### 剩下的

- 原有问题：无。
- 没验证的，和初审一样：
  - 动画的实际播放；
  - 亮色主题下的图；
  - 375 像素宽，方案不要求。
- 初审快照 `b16-snapshot/` 复核完已删。

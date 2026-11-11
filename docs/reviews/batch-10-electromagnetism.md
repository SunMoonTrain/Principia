# 批次 10 审查报告：电磁学与电动力学（静电学的微分形式、边值问题与电介质 9 节）

审内容 agent（和写内容 agent 是两个独立会话，没有读它的会话记录、交接说明和自查脚本）· 2026-11-11

审查范围：`content/physics/electromagnetism/` 下 9 节：`gauss-differential`、`capacitors`、`electrostatic-energy`、`poisson-equation`、`images-uniqueness`、`electrostatic-separation`、`multipole-expansion`、`polarization`、`electric-displacement`。每节都看了 `lesson.md` 和 `problems.yaml`，另外看了 4 张 SVG、6 个动画、`_domain.yaml` 新增的 20 个术语，以及批次 9 `gauss-applications:101` 补的那一处标记。

## 结论

重要 0 条，小问题 3 条（同一类合成一条）。

- 36 道简单题、中等题的标准答案和独立验算一致（每题两种互相独立的算法）。36 道难题、思考题的参考解答和三级提示逐题读过，推导都对；只有小问题 3 里的两处提示和一处参考解答有错字、错号。
- **小问题 1 · 前置**：三节用到了链上没有的小节，各加一个直接前置，全图层级都不变。
  - `electrostatic-separation` 加 `electric-dipole`：主定理（`:36`、`:38`）用电偶极子的电势解释感应电荷。
  - `polarization` 加 `conductors`：电介质的定义（`:25`）建立在「绝缘体」上，`:27`、`:44`、`:57` 都拿导体作对照。
  - `poisson-equation` 加 `conductors`：例 1 和 p3、p6 都用接地导体给边界条件。加了以后，`images-uniqueness` 直接列的 `conductors` 就多余了，要去掉。
  - 另有两处只要加链接：`poisson-equation:43` 的球坐标拉普拉斯算子，`images-uniqueness` p5 题干里的电偶极子。
- **小问题 2 · 术语**：
  - 复合词拆开标了 5 处，例如 `images-uniqueness:72` 写成「感应 + 带标记的电荷」，可「感应电荷」本身就是术语。
  - 「自由电荷」要进术语表（你问的，我的结论，见下）。
  - 7 个新名词第一次出现没括注英文。
  - `poisson-equation:73` 的「常微分方程」按规矩 C 要标。
- **小问题 3 · 说法和公式不准**，7 处：
  - `poisson-equation` p7 提示 1 把 $\rho$ 写成了 $\rho_m$；
  - `images-uniqueness` p6 题干把 $\pdv{\varphi}{n}$ 叫「电场的法向分量」，差一个负号；
  - `multipole-expansion` p5 参考解答的「只有」说反了；
  - `electrostatic-energy:41` 定理缺了「体电荷密度有限」这个条件；
  - 两处「强三倍」「小多少倍」有歧义；
  - 「电容」的术语简介说「只由几何形状决定」，讲到电介质以后就不对了；
  - 两道数值题没给 $\varepsilon_0$ 的取值。
- 你点名要查的几件事：
  - **`gauss-differential` 的前置改动**：合理，也是最少的。这一节自己就用到对称电场：几何图像的动画是均匀带电圆柱（`:70` 链到 `gauss-applications#thm-cylindrical`），常见误区 `:92` 用均匀带电球体的球心。`gauss-law` 在 `gauss-applications` 的链上，换掉不留多余。全图 656 节层级都不变（见「前置」）。
  - **新增的 4 个跨领域前置**（都还是 outline）：按目标核对，都站得住；只有 `poisson-equation:43` 的球坐标拉普拉斯算子不在 `vector-identities` 的目标里，要链到出处（小问题 1）。`images-uniqueness` 的 `math.pde.laplace-equation` 其实没用到，可以去掉（见「前置」）。
  - **指向这一批的链接**：5 处都接住了，`covariant-maxwell` 的 $\divg\vb E=\rho/\varepsilon_0$ 写法一致（见「前置」）。
  - **方位角 $\psi$**：只在 `poisson-equation:43` 和 `electrostatic-separation:22` 出现，两处第一次出现都交代了「$\varphi$ 留给电势」。
  - **「自由电荷」「介电常量」**：
    - 「自由电荷」要进术语表，我同意你的看法。它用在 3 节：`conductors` 讲解 4 处、题目 1 处，`polarization`，`electric-displacement` 讲解 13 行、题目 7 处；和它对着的「束缚电荷」已经在表里。补标 `conductors`、退回 written 是正常流程。现在 `electric-displacement:16` 第一次出现连英文都没有。
    - 「介电常量」可以先不进：它只在 `electric-displacement` 一节里用（`:44` 定义、p5 题干），合「只在一节里用到的名词只加锚点」那条。写内容会话说的理由（会和「真空介电常量」撞上复合词的规矩）本身不成立：以后进表时，`coulomb-law:51` 的「真空介电常量」按复合词的规矩整个词标就是了。
  - **写内容会话自己推的难题**：蔡尔德-朗缪尔定律（`poisson-equation` p5）、电介质板被拉进电容器的力（`electric-displacement` p6）逐步核过，都对。别的几道也核了，都对：不接地导体球的镜像（`images-uniqueness` p5）、挪原点后的四极矩（`multipole-expansion` p5）、外电场里的多极能量（p6）、均匀极化球（`polarization` p6）。
  - **电容器那张图**：图是对的，「$3.70\varepsilon_0$」这个数不对。
    - 我用边界元法独立解了同一个二维问题，电场线方向和图上最多差 5°，等势线的电势差 1% 到 2%（含它接地外框的影响）。
    - 单位长度的电容是 $3.816\varepsilon_0$：分 200 段和 400 段的结果差 $10^{-4}$，宽板时和帕尔默公式对得上。
    - 帕尔默公式是板宽远大于间隔时的渐近式，宽与间隔之比为 2.5 时偏小 3%。所以 3.70 和 3.69 对上多半是巧合；接地的外框只会让电容变大，不会变小。
    - 正文没写这个数，不用改（见「几何图像」）。
  - **页面**：768 宽 9 节全部展开提示和解答，都没问题。亮色主题看了电容器、镜像法两张图。4 个滑块都拖到两端看过，另 2 个没有滑块的函数图也看了。
  - **写回建议**：同意「自动标记后人工看一遍」，另补反方向的一条：短术语被标在长术语里面（见「要写回 plan.md 的」）。
  - **`gauss-applications:101`**：「平行板电容器」整个词标成「电容器」、括注英文，对。已把 `status` 改回 `reviewed`，只改了第 11 行。
- 修完以后 9 节都可以标 `reviewed`。`multipole-expansion`、`electric-displacement` 只有小问题 2、3 里的个别字句。另外，「自由电荷」进术语表后 `conductors` 要补标、退回 written，随复核看。

| 小节 | 重要 | 小问题 |
| --- | --- | --- |
| `gauss-differential` 高斯定律的微分形式 | 0 | 2（2 复合词；3 未给 $\varepsilon_0$） |
| `capacitors` 电容器 | 0 | 2（2 英文；3 未给 $\varepsilon_0$、电容的简介） |
| `electrostatic-energy` 静电场的能量 | 0 | 1（3 定理的条件、「倍」） |
| `poisson-equation` 泊松方程与拉普拉斯方程 | 0 | 3（1 前置和链接；2 复合词、英文、规矩 C；3 p7 提示） |
| `images-uniqueness` 唯一性定理与镜像法 | 0 | 3（1 前置和链接；2 复合词；3 p6 题干） |
| `electrostatic-separation` 分离变量法解静电问题 | 0 | 3（1 前置；2 复合词；3「强三倍」） |
| `multipole-expansion` 多极展开 | 0 | 2（2 英文；3 p5 参考解答） |
| `polarization` 电介质与极化 | 0 | 2（1 前置；2 复合词、自由电荷、英文） |
| `electric-displacement` 电位移与线性电介质 | 0 | 2（2 自由电荷；3「小多少倍」） |

## 怎么审的

- 读了 `docs/plan.md` 已提交的规矩：736f5e2（批次 9 的写回）、d8b52e0（批次 10 的安排）。736f5e2 新加的几条都照着查了：
  - 复合词整个词标；
  - 规矩 C 不管基础词；
  - 电场线出框要画回来；
  - 并排的图之间留空隙。
- **快照**：初审开始时把整个 `content/physics/electromagnetism/` 拷到我的 scratchpad 的 `b10/snap/`，时间是 2026-11-11T13:45:47Z。`git diff HEAD` 的输出也存了一份，复核时和它比。
- **改动范围**：
  - `git diff HEAD -- content/physics/electromagnetism/` 有 9 节的 `lesson.md`（从 outline 写成 written）、`_domain.yaml`（加了 20 个术语，宏没动）和 `gauss-applications` 的 2 行（`:11`、`:101`）。
  - 9 份 `problems.yaml`、4 张 SVG 是新文件，直接读。
  - 前置只有 `gauss-differential` 改了，和你说的一致。
- 逐节读讲解、例题、常见误区，推导逐步核对，例题的数都重算过。
- **简单题、中等题**：只用 `npm run statements` 读题，写完验算脚本、跑出结果以后才打开 `problems.yaml`。
- **难题、思考题**：36 题的参考解答连同三级提示全部读了，关键的式子另外推过：
  - 蔡尔德-朗缪尔定律的 $x^{4/3}$ 解和系数；
  - 电介质板受的力；
  - 不接地导体球的力和 $a\gg R$ 的展开；
  - 挪原点后四极矩的变换式；
  - 二阶泰勒项和无迹四极矩的关系；
  - 地球扁率在两极、赤道的符号。
- **公式**：构建不渲染参考解答，我照批次 9 复核的办法，把 9 份 `problems.yaml` 里所有文字的公式都用编译器的 `compileTex` 加本领域的宏渲染了一遍，再跑 `suspectTex`。共 1459 个公式（参考解答 465 个），0 个错误，没有可疑写法。
- **图**：
  - 4 张 SVG 都按注释里的设定反算，电场线和等势线用脚本逐段检查。
  - 电容器那张另用边界元法独立求解。
  - 6 个动画的式子逐个推过，滑块取两端在页面上看了。
- **术语和格式**：沿用以前批次的检查脚本，讲解和题目文字都查：
  - 每节第一次标记带不带英文，每块第一次出现标没标；
  - 段落句数、空格、引号；
  - 规矩 C 对照前置链查。
  - 这一批另加一个脚本，查带标记的术语和紧挨着的字是否拼成别的术语（复合词拆开标）。
- **前置**：用脚本算全图 656 节的层级，比较 HEAD 和现在；逐节列出链上有哪些电磁学小节、别的领域小节；几种改法各算一遍层级。
- **页面**：`npm run build` 后用 `.claude/launch.json` 的 `test-serve` 打开，进度写临时仓库，查完已停掉。面板没显示，画布和 SVG 都导出成图片看。
- **跑过的命令**：
  - `npm run content`：0 个错误、0 个警告。
  - 本批 9 个验算脚本逐个单独跑：36 题全部一致。连同批次 9 的 8 个，电磁学 17 节全部一致。
  - 全量 `npm run verify`：148 个小节全部一致。
  - `npx tsc -p tsconfig.node.json --noEmit`：通过。
  - `npm run build`：通过。这次全量构建没被线性代数卡住，没用临时副本。

## 简单题、中等题的验算

脚本在 `tools/verify/physics.electromagnetism.<小节>.ts`，辅助文件 `physics.electromagnetism._es.ts` 这次加了散度、拉普拉斯算子（中心差分）、小立方体的通量、勒让德多项式、三重积分。两套算法互相独立：

1. **公式**：讲解里的式子。
2. **不用这些式子的算法**：
   - **散度和电荷密度**：把电场穿出小立方体的通量在六个面上数值积分再除以体积，或者用中心差分求散度再做三重积分。
   - **泊松方程**：中心差分求拉普拉斯算子；一维泊松方程用有限差分（4000 个内点、追赶法）解。
   - **电容器**：极板换成半径 $10^6\,\mathrm m$ 的带电圆盘，对圆环的库仑场积分求板间电场；电场能量密度对体积积分；按电荷守恒解中间节点的电势。
   - **静电能**：$\frac12\sum q_i\varphi_i$ 逐点算电势；收缩球面时对静电压强做功积分。
   - **镜像法**：把平面上的感应电荷分成圆环、积出对点电荷的力。接地球的那一题不用镜像，把点电荷的电势在球面上按勒让德多项式展开、逐项加到 $l=200$。
   - **导体球放进匀强电场**：匀强电场换成远处一对 $\pm Q$（$L=10^4R$）、各配接地球的镜像电荷，求偶极矩和半球面上的电荷。
   - **球外边值问题**：球外狄利克雷问题的泊松积分，先拿常数边界值检验积分式。
   - **多极展开**：从精确的轴上电势分离 $1/z^2$、$1/z^3$ 的系数；$Q_{ij}$ 和 $\sum q_ir_i^2P_2(\cos\gamma_i)$ 两种写法互相核对。
   - **原子单位**：氢原子的那一题另走 $E_h/(ea_0)$。

| 小节 | p1 | p2 | p3 | p4 |
| --- | --- | --- | --- | --- |
| `gauss-differential` | $7.08335\times10^{-8}\,\mathrm{C/m^3}$ ✓ | A、C、D ✓ | $2.92749\times10^{-5}\,\mathrm{C/m^3}$ ✓ | $1.06250\times10^{-10}\,\mathrm C$ ✓ |
| `capacitors` | $88.5419\,\mathrm{pF}$ ✓ | $3.384\times10^{-4}\,\mathrm J$ ✓ | $3.33795\times10^{-5}\,\mathrm J$ ✓ | $2.40\times10^{-5}\,\mathrm J$ ✓ |
| `electrostatic-energy` | $-1.19840\times10^{-6}\,\mathrm J$ ✓ | $4.42709\times10^{-8}\,\mathrm J$ ✓ | $1.12350\times10^{-6}\,\mathrm J$ ✓ | $4.86630\times10^{-7}\,\mathrm J$ ✓ |
| `poisson-equation` | $-1.06250\times10^{-9}\,\mathrm{C/m^3}$ ✓ | A、C、D ✓ | $-1.0\times10^{-8}\,\mathrm{C/m^2}$ ✓ | $2/e\approx0.735759$ ✓ |
| `images-uniqueness` | $8.988\times10^{-5}\,\mathrm N$ ✓ | $-3.18310\times10^{-6}\,\mathrm{C/m^2}$ ✓ | $8.988\times10^{-7}\,\mathrm J$ ✓ | $4.21313\times10^{-8}\,\mathrm N$ ✓ |
| `electrostatic-separation` | $1.39081\times10^{-9}\,\mathrm{C\,m}$ ✓ | A、B、D ✓ | $1.66898\times10^{-8}\,\mathrm C$ ✓ | $7.5\,\mathrm V$ ✓ |
| `multipole-expansion` | $0.06$ ✓ | A、C ✓ | $1/48\approx0.0208333$ ✓ | $2.6964\times10^{-3}\,\mathrm V$ ✓ |
| `polarization` | $1.0\times10^{-6}\,\mathrm{C/m^2}$ ✓ | $-6.0\times10^{-6}\,\mathrm{C/m^3}$ ✓ | $8.75111\times10^{-6}$ ✓ | $564.705\,\mathrm V$ ✓ |
| `electric-displacement` | $200\,\mathrm{pF}$ ✓ | $2.65626\times10^{-7}\,\mathrm{C/m^2}$ ✓ | $177.084\,\mathrm{pF}$ ✓ | $10.6814\,\mathrm{pF}$ ✓ |

- 第一次跑只有一处不一致，是我脚本里 `gauss-differential` p2 的 E 项判反了（说法要求散度为正，反例里散度为零，应判「错」），改后一致。
- **选择题**：逐项用例子核对，例子写在脚本的 `notes` 里。
  - `gauss-differential` p2：
    - B：均匀球体逐层加出电场，外面 $r=2$、$3$ 处的散度为零，不和 $1/r^3$ 成正比。
    - C：取 $\rho=1-2r^2$ 的球，两处的散度符号和 $\rho$ 相同、数值是 $\rho/\varepsilon_0$。
    - E：负点电荷附近沿电场方向电场变强，散度却为零（反例）。
  - `multipole-expansion` p2 的 C：均匀球面的电势用圆环积分算出，在 $r=2$、$3$ 处正好是 $kQ/r$。
- **题面没给常量的两题**：`capacitors` p3、`gauss-differential` p4 的标准答案用 CODATA 的 $\varepsilon_0$。容差是 $5\times10^{-3}$，用 $8.988\times10^9$ 也判对，见小问题 3。

## 前置

- 全图 656 节，按 HEAD 和现在的前置各算一遍层级：**变了的 0 节**。9 节的前置都没有多余，没有悬空的 id。
- **`gauss-differential` 的 `gauss-law` 换成 `gauss-applications`**：合理，也是最少的。
  - 这一节自己就用到 `gauss-applications` 的结果：几何图像的动画是均匀带电圆柱的电场（`:70`，链到 `#thm-cylindrical`），常见误区 `:92` 用均匀带电球体的球心电场为零。
  - `gauss-law` 在 `gauss-applications` 的链上，换掉不留多余。层级由 `delta-3d`（第 18 层）决定，用哪个都是第 19 层。
  - 后面 `polarization`（例 1 叠加平面的电场、例 2 球对称）、`electrostatic-energy`（例 1 均匀球体）也经由它拿到 `gauss-applications`。
  - 另一种做法也算了：`gauss-differential` 仍用 `gauss-law`、在 `polarization` 加 `gauss-applications`，层级同样不变。但 `gauss-differential` 自己就要用，现在的做法更对。
- **新增的跨领域前置**（都还是 outline），按目标核对：
  - `math.vector-calculus.delta-3d`「会证明 $\divg\frac{\uv r}{r^2}=4\pi\delta^3$」：`gauss-differential:37`、`poisson-equation:29` 用的正是这个。
  - `math.vector-calculus.vector-identities`「$\curl\nabla f=\vb 0$，计算拉普拉斯算子」：`poisson-equation:22`、`:34` 用的就是这些。
    - 但 `:43` 写出的**球坐标拉普拉斯算子**不在它的目标里。出处是 `math.vector-calculus.curvilinear-coordinates`（「柱坐标与球坐标下的梯度、散度、旋度和拉普拉斯算子」），不在这一节的链上。
    - 这一节只用到径向那一项，而且 `:43` 交代了怎样由例 1 得到；所以只要给整个式子加一个链接，不必列为前置（小问题 1）。
  - `math.pde.laplace-equation`「格林恒等式证唯一性、平均值性质、极值原理」：
    - `images-uniqueness:27` 只用它说「数学上的说法见……」。
    - 唯一性的证明用的是本领域 `poisson-equation#thm-mean-value`；p6 的格林恒等式证法由题目一步步带着做，用到的散度定理和 $\divg(\varphi\nabla\varphi)$ 都在链上。
    - 所以这个前置其实没用到，去掉层级也不变。它是批次 0 目录里就有的；要不要去掉，写内容会话定，我没列进小问题。
  - `math.pde.legendre-polynomials`「轴对称的拉普拉斯方程分离变量得到勒让德多项式」：`electrostatic-separation#thm-axisymmetric`、`multipole-expansion#thm-generating` 都靠它。
    - $P_l(1)=1$、各 $P_l$ 线性无关在链上（线性代数的 `linear-independence` 经由它在链上）。
    - `electrostatic-separation` p5 的傅里叶正弦级数也在链上（`math.analysis.fourier-series`）。
- **链上缺的**（小问题 1）：三处各加一个前置，逐个算过，全图层级都不变：
  - `electrostatic-separation` 加 `electric-dipole`；
  - `polarization` 加 `conductors`；
  - `poisson-equation` 加 `conductors`，同时去掉 `images-uniqueness` 直接列的 `conductors`（经由 `poisson-equation` 已在链上）。
- **不用加的**（见「我替你定的」）：
  - `electrostatic-energy:16`、`:34` 提到电容器的结果，只是前后呼应，推理没用到。加 `capacitors` 反而会让这一节右移一层。
  - `multipole-expansion` 标的「拉普拉斯方程」是本领域 `poisson-equation` 定义的，那一节不在链上；可链上有偏微分方程的同名一节，读者学过这个概念。
- **指向这一批的链接**，都接住了：
  - `electric-field` 第 6 题 → `gauss-differential`：`:16` 提出问题，`:46`、`:51` 用 $\divg\vb E=0$ 说明三个系数之和为零，`poisson-equation` 的动画又画了同一组电荷的电势鞍点。
  - `electric-potential` 第 8 题 → `electrostatic-energy`：`:46` 定义能量密度 $\frac{\varepsilon_0}2E^2$，`:27` 回指第 8 题的相互作用能。
  - `electric-dipole` 第 7 题 → `polarization:57`；第 8 题 → `multipole-expansion:16` 和例 1（轴上 $\frac{2kqd^2}{r^3}$ 和第 8 题一样）。
  - `gauss-applications` 例 2 → `capacitors#thm-parallel-plate` 的证明思路；`gauss-applications:101` 已补标。
  - 狭义相对论 `covariant-maxwell` 的 $\divg\vb E=\rho/\varepsilon_0$：`gauss-differential#thm-gauss-differential`、`poisson-equation#thm-electrostatic-equations` 都写成 `\divg\vb E=\frac{\rho}{\varepsilon_0}`，同一个宏，一致。
- **以这一批为前置的 outline 小节**（`maxwell-equations`、`poynting-theorem`、`rc-circuits`、`waves-in-media`）要用的 $\divg\vb E=\rho/\varepsilon_0$、$u=\frac{\varepsilon_0}2E^2$、电容和储能、$\vb D=\varepsilon\vb E$ 都讲了。

## 逐节

### physics.electromagnetism.gauss-differential 高斯定律的微分形式

- **讲解**：
  - 散度定理加高斯定律推出微分形式（`:25`、`:27`）；反推回积分形式（`:29`）。
  - 点电荷 $r\ne0$ 处散度为零的计算（`:35`）对；$\rho=q\delta^3$（`:40`）。
  - 恩肖定理的论证（`:46`）对：平衡点处 $\pdv{E_x}x+\pdv{E_y}y+\pdv{E_z}z=0$，三者不能都为负；全为零时转到 `poisson-equation` 用电势补全。1842 年对。
- **例题**：
  - 例 1：$\rho=4\varepsilon_0Ar$、总电荷 $4\pi\varepsilon_0Aa^4$ 和外面的电场对得上。
  - 例 2：pn 结的两层电荷，符号、厚度都对。
- **几何图像**：圆柱里 $s/R^2$、外面 $1/s$，单位长度电荷不变，和说明一致。
- **题目**：p5 到 p8 都对。
  - p5：两层电荷的电场、电势差 $\rho_0w^2/\varepsilon_0$、$\rho_1w_1=\rho_2w_2$。
  - p6：非平方反比时的散度 $\frac{(2-m)k}{r^{m+1}}$ 和电通量互相核对。
  - p7：面电荷跳 $\sigma/\varepsilon_0$。
  - p8：保罗阱，1989 年和德默尔特分享诺贝尔奖的一半；引力版恩肖定理。
- **问题**：
  - `:88`「正」加带标记的「电荷」（小问题 2）；
  - p4 没给 $\varepsilon_0$（小问题 3）。

### physics.electromagnetism.capacitors 电容器

- **讲解**：
  - 电容的定义（`:25`，$\Delta\varphi=\varphi_+-\varphi_-$ 当场交代）；「为什么」里一般形状的论证提前借用唯一性定理，明说了「以后会证明」，可以（见「我替你定的」）。
  - 孤立球半径约 $9\times10^9\,\mathrm m$ 才 $1\,\mathrm F$，对。
  - 三种电容器和间隔很小时的极限（`:48`）都对。
  - 储能 $\frac{Q^2}{2C}$ 和「一半」的解释、平行板能量写成 $\frac{\varepsilon_0}2E^2\cdot Ad$ 都对。
- **例题**：
  - 例 1：串并联。
  - 例 2：断开电源拉开极板，力 $\frac{Q^2}{2\varepsilon_0A}$ 和「一半的电场」，和 `conductors` 第 6 题呼应。
- **几何图像**：边缘电场图（见「几何图像」）；函数图 $\frac{1}{\ln x}$ 和 $\frac{1}{x-1}$，$x\to1$ 时两条陡峭的曲线在左上角贴在一起，「几乎重合」看得出。
- **题目**：p5 到 p8 都对。
  - p5：接电源拉开，$\Delta U=-\frac14C_0\Delta\varphi_0^2$，电源做功 $-\frac12C_0\Delta\varphi_0^2$，外力 $\frac14C_0\Delta\varphi_0^2$，积分核对一致。
  - p6：两球相连。
  - p7：一半能量损失和电阻无关。
  - p8：电势系数、静电屏蔽。
- **问题**：
  - `:25` 起名的「极板」没括注英文（小问题 2）；
  - p3 没给 $\varepsilon_0$；「电容」的术语简介（小问题 3）。

### physics.electromagnetism.electrostatic-energy 静电场的能量

- **讲解**：
  - 定义（`:25`）和「为什么」对；$\frac12\sum q_i\varphi_i$ 和连续分布时自己的电势趋于零（`:32`）对。
  - 由 $\divg(\varphi\vb E)$ 推出电场能量（`:38`、`:43`）对。
  - 「能量储存在场里」（`:48`）的说法和批次 9 修订后的口径一致。
  - 自能发散（`:51`）对。
- **例题**：
  - 例 1：$\frac35\frac{Q^2}{4\pi\varepsilon_0R}$，两种算法（逐层搬运、能量密度 $\frac1{10}+\frac12$）都对。
  - 例 2：孤立导体球。
- **几何图像**：$4\pi r^2u$ 的曲线，球体 $x^4/R^6$、外面 $1/x^2$，面积 $\frac{6}{5R}$ 和 $\frac1R$ 正好对应例 1、例 2；$R=0.5$ 时峰值 4 在 $4.2$ 以内。
- **题目**：p5 到 p8 都对。
  - p5：交叉项 $=q_1\varphi_2(\vb r_1)$，在 $\vb r_2$ 附近可积也交代了。
  - p6：导体球表面的压强 $\frac{\sigma^2}{2\varepsilon_0}=u$。
  - p7：两个小球，总能量 $\frac{q^2}{4\pi\varepsilon_0}\bigl(\frac{6}{5a}-\frac1d\bigr)>0$。
  - p8：$r_e/2$、$\frac35r_e$，CODATA 2022 的 $r_e$、康普顿波长都对。
- **问题**：`:41` 定理缺「体电荷密度有限」（小问题 3）。

### physics.electromagnetism.poisson-equation 泊松方程与拉普拉斯方程

- **讲解**：
  - 泊松方程（`:25`）、由库仑定律反验（`:29`）、$\curl\vb E=\vb 0$（`:32`）都对。泊松 1813 年、拉普拉斯先给出外部的方程，对。
  - 拉普拉斯方程和调和函数（`:39`），球坐标下的式子（`:43`，$\psi$ 交代了）对。
  - 平均值性质（`:46`、`:48`）的证明和 `conductors` 第 5 题一致；补全恩肖定理（`:50`）对。
- **例题**：
  - 例 1：$\varphi=\frac{\rho_0}{2\varepsilon_0}x(d-x)$。
  - 例 2：德拜屏蔽 $\rho=-\frac{q}{4\pi\lambda^2}\frac{e^{-r/\lambda}}{r}$，总量 $-q$。
  - 都对。例 2 的锚点在例题里，页面上按设计不显示成卡片。
- **几何图像**：`electric-field` 第 6 题的四个电荷，沿 $x$ 是 $4+x^2$、沿 $z$ 是 $4-2z^2$，鞍点对。
- **题目**：p5 到 p8 都对，只有 p7 提示 1 的字母错了。
  - p5：蔡尔德-朗缪尔定律逐步核过。
  - p6：圆柱壳的拉普拉斯算子和单位长度电容 $\frac{2\pi\varepsilon_0}{\ln(b/a)}$。
  - p7：引力的符号。
  - p8：$k(-y,x,0)$ 的旋度 $2k$，环路积分 $2\pi kR^2$。
- **问题**：
  - 前置缺 `conductors`；`:43` 要加链接（小问题 1）。
  - `:65`「正」加带标记的「点电荷」、`:65`「鞍点」没括注英文、`:73`「常微分方程」要标（小问题 2）。
  - p7 提示 1（小问题 3）。

### physics.electromagnetism.images-uniqueness 唯一性定理与镜像法

- **讲解**：
  - 两个唯一性定理（`:25`、`:34`）的证明思路都对；后一个和 Griffiths 的第二唯一性定理同一个证法。
  - `:38` 回头接住 `capacitors:27` 那句「以后会证明」。
  - 镜像法的定义和平面镜像（`:45`、`:50`、`:52`）：$\sigma=-\frac{qd}{2\pi(s^2+d^2)^{3/2}}$、总量 $-q$、力 $\frac{kq^2}{(2d)^2}$，都对。威廉·汤姆孙 1848 年，对。
- **例题**：
  - 例 1：墙角三个像。
  - 例 2：接地球 $b=R^2/a$、$q'=-\frac Raq$。
  - 都对。
- **几何图像**：左图到平面的线、右图镜像（见「几何图像」）。
- **题目**：p5 到 p8 都对（p6 题干的符号除外）。
  - p5：不接地球，加球心的 $+\frac Raq$；$F=\frac{q^2R}{4\pi\varepsilon_0}\bigl[\frac1{a^3}-\frac{a}{(a^2-R^2)^2}\bigr]$，$a\gg R$ 时 $-\frac{2q^2R^3}{4\pi\varepsilon_0a^5}$。
  - p6：格林恒等式证唯一性，诺伊曼条件差一个常数。
  - p7：「一半」从能量看。
  - p8：两块平行板要无穷多个像。
- **问题**：
  - p5 题干的电偶极子要加链接（小问题 1）；
  - `:72`「感应」加带标记的「电荷」（小问题 2）；
  - p6 题干（小问题 3）。

### physics.electromagnetism.electrostatic-separation 分离变量法解静电问题

- **讲解**：
  - 轴对称通解（`:25`、`:27`）对，取舍规则（`:29`）对。
  - 导体球放进匀强电场（`:33` 到 `:38`）：$\varphi=-E_0\bigl(r-\frac{R^3}{r^2}\bigr)\cos\theta$，$\sigma=3\varepsilon_0E_0\cos\theta$，$p=4\pi\varepsilon_0R^3E_0$，对。
  - 「把 $z\to-z$」说明球的电势为零（`:33`），对。
- **例题**：
  - 例 1：球面上 $V_0\cos\theta$，球里匀强，$\sigma=\frac{3\varepsilon_0V_0}{R}\cos\theta$。
  - 例 2：带电的球加 $l=0$ 项。
  - 都对。
- **几何图像**：见「几何图像」。
- **题目**：p5 到 p8 都对。
  - p5：矩形槽，$C_n=\frac{4V_0}{n\pi}$（奇数）。
  - p6：$\sigma_0\cos\theta$ 的球面，里面 $-\frac{\sigma_0}{3\varepsilon_0}\uv z$，外面 $p=\frac43\pi R^3\sigma_0$。
  - p7：只剩 $l=1$。
  - p8：远处一对电荷的像，$p=\frac{2QR^3}{D^2}=4\pi\varepsilon_0R^3E_0$。
- **问题**：
  - 前置缺 `electric-dipole`（小问题 1）；
  - `:71`「感应」加带标记的「电荷」（小问题 2）；
  - `:40`「强三倍」（小问题 3）。

### physics.electromagnetism.multipole-expansion 多极展开

- **讲解**：
  - $\frac{1}{|\vb r-\vb r'|}$ 的勒让德展开由轴上的值定系数（`:25`、`:27`），对。
  - 多极展开（`:34`、`:36`）、前两项（`:38`）对。
  - $Q_{ij}$ 的定义和四极项 $\frac{1}{2r^3}\sum Q_{ij}\hat r_i\hat r_j$（`:45`）对；无迹、对称、5 个独立量，轴对称时 $Q_{xx}=Q_{yy}=-\frac12Q_{zz}$（`:47`）对。
- **例题**：
  - 例 1：直线四极子 $Q_{zz}=4qd^2$，轴上 $\frac{2kqd^2}{r^3}$。
  - 例 2：圆环 $Q_{zz}=-QR^2$，和轴上精确电势的展开对上。
- **几何图像**：$\sum_{k\le N}x^{-(k+1)}$ 和 $\frac{1}{|x-1|}$。$N=6$ 时 $x>1$ 处几乎重合；$x<1$ 处展开冲出画面，「项数越多偏得越远」看得出。
- **题目**：p5 到 p8 推导都对，只有 p5 参考解答的一句话说反了。
  - p5：$Q'_{ij}$ 的变换式逐项核过。
  - p6：二阶项 $-\frac16\sum Q_{ij}\pdv{E_j}{x_i}$。
  - p7：地球扁率：$Q_{zz}<0$，两极上方引力势高、引力弱，赤道上方相反。
  - p8：收敛。
- **问题**：
  - 例 1 标题的「四极子」没括注英文（小问题 2）；
  - p5 参考解答（小问题 3）。

### physics.electromagnetism.polarization 电介质与极化

- **讲解**：
  - 电介质、极化率、极化强度、束缚电荷的定义和定理（`:25` 到 `:49`）都对。
  - 氢原子 $\alpha=4.5\times4\pi\varepsilon_0a_0^3\approx7.42\times10^{-41}$ 对；水分子 $6.2\times10^{-30}\,\mathrm{C\,m}$ 对。
  - 「挪出去的正电荷」的论证和总束缚电荷为零（`:41`、`:49`）对。
- **例题**：
  - 例 1：电介质板里 $\frac{\sigma_{\mathrm f}-P}{\varepsilon_0}$。
  - 例 2：$\vb P=k\vb r$，里面 $\vb E=-\vb P/\varepsilon_0$、外面为零。
  - 都对。
- **几何图像**：示意图，和说明一致。
- **题目**：p5 到 p8 都对。
  - p5：偶极子积分化成束缚电荷的电势。
  - p6：均匀极化球，里面 $-\frac{\vb P}{3\varepsilon_0}$，外面 $\frac43\pi R^3\vb P$，和 `electrostatic-separation` 第 6 题对上。
  - p7、p8 说法都对。
- **问题**：
  - 前置缺 `conductors`（小问题 1）；
  - `:63`「体」加带标记的「束缚电荷」，「自由电荷」进术语表，`:22`「极性分子」、`:32`「玻尔半径」、p7 题干的「位移极化」「取向极化」没括注英文（小问题 2）。

### physics.electromagnetism.electric-displacement 电位移与线性电介质

- **讲解**：
  - $\vb D$ 的定义（`:25`）、有电介质的高斯定律（`:30`）、$\curl\vb D=\curl\vb P$（`:34`）都对。
  - 线性电介质、电极化率、介电常量、相对介电常量（`:39`、`:44`）对。
  - 填满电介质 $C=\varepsilon_{\mathrm r}C_0$（`:49` 到 `:53`），$\sigma_{\mathrm b}=-\frac{\varepsilon_{\mathrm r}-1}{\varepsilon_{\mathrm r}}\sigma_{\mathrm f}$，对。
  - 界面条件（`:60`、`:62`）对。
  - 数据和史实对：水约 80、空气多出万分之几（$\varepsilon_{\mathrm r}-1\approx5.9\times10^{-4}$）；法拉第 1837 年的「比感应容量」、虫胶约为空气的两倍；麦克斯韦的「位移」。
- **例题**：
  - 例 1：电介质里的点电荷，束缚电荷 $-\frac{\varepsilon_{\mathrm r}-1}{\varepsilon_{\mathrm r}}q$。
  - 例 2：部分填充，$\frac{\varepsilon_0A}{d-t+t/\varepsilon_{\mathrm r}}$。
  - 都对。
- **几何图像**：$E$ 在电介质板里变成 $\frac{1}{\varepsilon_{\mathrm r}}$，滑块 1 到 5 都在 $[0,1.3]$ 里。
- **题目**：p5 到 p8 都对。
  - p5：$\frac{\tan\theta_1}{\tan\theta_2}=\frac{\varepsilon_1}{\varepsilon_2}$、$\sigma_{\mathrm b}=\varepsilon_0E_1\cos\theta_1\bigl(\frac{\varepsilon_1}{\varepsilon_2}-1\bigr)$。
  - p6：电介质板受的力 $\frac{Q^2}{2C^2}\frac{\varepsilon_0w(\varepsilon_{\mathrm r}-1)}{d}$，向里，来自边缘电场。
  - p7：均匀极化球里 $\vb D=\frac23\vb P$。
  - p8：水里的离子。
- **问题**：
  - `:16`「自由电荷」第一次出现没标、没括注英文（小问题 2）；
  - p8 的「小多少倍」（小问题 3）。

## 小问题 1 · 前置（汇总）

- **三节用到了链上没有的小节**，各加一个直接前置。逐个算过，全图 656 节层级都不变：
  - `electrostatic-separation` 加 `physics.electromagnetism.electric-dipole`：
    - 主定理 `:36` 说球外的电场是一个电偶极子的电场，`:38` 用电偶极子的电势 $\frac{1}{4\pi\varepsilon_0}\frac{p\cos\theta}{r^2}$ 定出 $p$；
    - 常见误区 `:71`、p1、p6、p8 也都用电偶极矩；
    - 现在的链上没有 `electric-dipole`，浮窗会显示「还没学到」。
  - `polarization` 加 `physics.electromagnetism.conductors`：
    - 电介质的定义 `:25` 是「从极化的角度看，绝缘体叫作电介质」，「绝缘体」定义在 `conductors`；
    - `:27` 的边界情况、`:44` 自由电荷的例子、`:57` 都拿导体作对照。
  - `poisson-equation` 加 `physics.electromagnetism.conductors`：
    - 例 1（`:71` 到 `:75`）、p3、p6 用「接地导体板（圆柱面）电势为零」给边界条件；
    - `:41`、`:93` 也说「电荷都在导体上」。
    - 加了以后，`images-uniqueness` 直接列的 `conductors` 经由 `poisson-equation` 已在链上，要去掉，才是最少的。
- **两处只要加链接**：
  - `poisson-equation:43` 写出了完整的球坐标拉普拉斯算子，出处 `math.vector-calculus.curvilinear-coordinates` 不在链上。这一节只用径向那一项，`:43` 末尾也说了怎样由例 1 得到。给整个式子加一句「（见[柱坐标与球坐标下的梯度、散度和旋度](lesson:math.vector-calculus.curvilinear-coordinates)）」即可。
  - `images-uniqueness/problems.yaml:88` p5 的（3）要求「和电偶极子联系起来解释」，电偶极子不在这一节的链上。按「题目文字里用到前置链外的结论加链接」，加 `（见[电偶极子](lesson:physics.electromagnetism.electric-dipole)）`。
- **同类**：9 节其余用到的小节都在链上。不用加的两处：
  - `electrostatic-energy` 提到电容器，只是呼应；
  - `capacitors:27` 提前借用唯一性定理，明说了「以后会证明」。
  - 两处的理由见「我替你定的」。

## 小问题 2 · 术语（汇总）

- **2a · 复合词拆开标**，5 处。批次 9 写回的规矩：复合词的意思就是这个术语时，整个词带标记。
  - `images-uniqueness:72`「感应:term[电荷]」、`electrostatic-separation:71`「感应:term[电荷]」：「感应电荷」本身就是术语 `physics.electromagnetism.induced-charge`。要写成 `:term[感应电荷]{id="physics.electromagnetism.induced-charge"}`。
  - `polarization:63`「体:term[束缚电荷]」：整个「体束缚电荷」标成 `bound-charge`，和规矩里「面电荷密度」的例子一样。
  - `gauss-differential:88`「正:term[电荷]」：整个「正电荷」标，规矩里点名的例子。
  - `poisson-equation:65`「正:term[点电荷]」：整个「正点电荷」标成 `point-charge`。
  - 我的脚本把每个带标记的术语和前后紧挨着的字拼起来查，9 节加批次 9 的 8 节只找到这 5 处。「总电荷」「净电荷」的「总」「净」是修饰语，批次 9 也没拆，不算（见「我替你定的」）。
- **2b · 「自由电荷」进术语表**（你问的；我同意你的看法）。
  - **为什么**：
    - 它用在 3 节：`conductors` 讲解 `:32`、`:39`、`:60`、`:92` 和 `problems.yaml:147`；`polarization:44`（定义）、`:69` 和 6 处题目；`electric-displacement` 讲解 13 行、题目 7 处。
    - 「只在一节里用到的名词才能只加锚点」不适用。
    - 和它对着的「束缚电荷」在表里，记号 $\rho_{\mathrm f}$、$\sigma_{\mathrm f}$ 也要有一处浮窗交代。
  - **现在的问题**：`electric-displacement:16` 第一次出现既没标也没括注英文（free charge）。别处是把「自由电荷」整个词标成「电荷」（`polarization:69`、`electric-displacement:27`、`:51` 等），按复合词规矩不算错，进表以后改标自己的 id。
  - **做法**：
    - 定义就在 `polarization#def-bound-charge` 那一段（已经和「束缚电荷」共用）；
    - 简介按 `polarization` 的读者写，例如「不是因极化而错开的电荷：导体里能移动的电荷、放到物体上的电荷，记作 $\rho_{\mathrm f}$、$\sigma_{\mathrm f}$」；
    - 补标 `conductors` 各块第一次出现的地方，`conductors` 退回 written，随这一批复核。
- **2c · 新名词第一次出现没括注英文**，7 个：
  - `capacitors:25` 起名的「极板」（plate）；
  - `poisson-equation:65`「鞍点」（saddle point）；
  - `polarization:22`「极性分子」（polar molecule）、`:32`「玻尔半径」（Bohr radius）；
  - `polarization/problems.yaml:120` p7 题干的「位移极化」「取向极化」（electronic / orientation polarization）；
  - `multipole-expansion:76` 例 1 标题的「四极子」（quadrupole）。
  - 「自由电荷」在 `electric-displacement` 的那一处见 2b。
- **2d · 规矩 C**：`poisson-equation:73`「常微分方程」是常微分方程领域的术语 `math.ode.ode`（定义在 `what-is-ode`），不在这一节的链上。
  - 照规矩 C 标 `math.ode.ode`；或者改写成「变成只含 $x$ 的方程」。
  - `:31`「静电场的微分方程」是普通说法，不用标。

## 小问题 3 · 说法和公式不准（汇总）

- **3a · `poisson-equation/problems.yaml:136`**（p7 提示 1，页面上显示）：
  - 原文「把 $\rho_m$ 和 $-4\pi\varepsilon_0G\rho_m$ 对应起来」，应是「把 $\rho$ 和 $-4\pi\varepsilon_0G\rho_m$ 对应起来」。
  - 参考解答 `:142` 写的就是 $\rho$。
- **3b · `images-uniqueness/problems.yaml:110`**（p6 题干）：
  - 原文「电场的法向分量 $\pdv{\varphi}{n}$」，可电场的法向分量是 $-\pdv{\varphi}{n}$。
  - 改成「电势的法向导数 $\pdv{\varphi}{n}$（也就是电场的法向分量，差一个负号）」之类。给定哪一个，唯一性的结论都一样。
- **3c · `multipole-expansion/problems.yaml:102`**（p5 参考解答的（2），不在页面上，但给审查和批改对照用）：
  - 原文「只有 $Q=0$、$\vb p\ne\vb 0$ 时，挪原点会改变电四极矩」说反了：$Q\ne0$ 时挪原点也会改变（多出 $Q(3a_ia_j-a^2\delta_{ij})$）。
  - 原意应是「即使 $Q=0$，只要 $\vb p\ne\vb 0$，挪原点也会改变电四极矩」。
- **3d · `electrostatic-energy:41` 定理少了条件**：
  - 「电荷分布在有限区域里时，$U=\frac{\varepsilon_0}2\int E^2\dd V$」对点电荷不成立：左边按定义是有限的 $\sum_{i<j}$，右边是无穷大。`:51` 才说「对体电荷密度有限的连续分布，两种写法完全一样」。
  - 定义卡片只框住 `:41` 这一段，浮窗跳过来也只看到它。建议把条件写进定理：「电荷连续分布在有限区域里、体电荷密度有限时」。
  - 术语简介（`_domain.yaml:283`「外力做的总功；等于……在全空间的积分」）同理，可改成「连续分布时等于……」。
- **3e · 「倍」有歧义**，批次 8 修订时同类改过：
  - `electrostatic-separation:40`「球面两极处的电场是 $3E_0$，比原来的电场强三倍」：「强三倍」可读成 4 倍，改「是原来的三倍」。
  - `electric-displacement/problems.yaml:147` p8 题干「比在真空里小多少倍」、参考解答 `:156`「比真空里小约 $80$ 倍」：改成「是真空里的几分之一」「约为真空里的 $\frac1{80}$」。
  - `electrostatic-energy:43`「球面积只增大 $R^2$ 倍」说的是按 $R^2$ 增长，可顺手改成「球面积按 $R^2$ 增大」。
- **3f · 「电容」的术语简介**（`_domain.yaml:436`「只由几何形状决定」）：
  - 在 `capacitors` 里没错，可这条浮窗在 `electric-displacement`（`:16`、`:49`、`:101`）也会弹出，那里讲的正是填了电介质电容变大。
  - 建议改成「和带多少电荷无关，由两个导体的形状、大小、相对位置和中间的电介质决定」，或者「真空中只由几何形状决定」。
- **3g · 两道数值题没给常量**：`capacitors/problems.yaml:44`（p3）、`gauss-differential/problems.yaml:75`（p4）。
  - 标准答案用 CODATA 的 $\varepsilon_0$，容差 $5\times10^{-3}$，读者用 $8.988\times10^9$ 也判对，不影响判题。
  - 可这一批其余数值题都写了「取……」，补上一致。

## 记号与约定

9 节一致，第一次出现都交代了：

- **方位角 $\psi$**：`poisson-equation:43`、`electrostatic-separation:22`，各自交代「$\varphi$ 留给电势」；别的节没用到。和你定的一致。
- **电势差**：
  - 电容器写 $\Delta\varphi=\varphi_+-\varphi_-$，在 `capacitors:25` 定义时交代了，`electric-displacement` 照用。
  - 批次 9 的电势差写 $\varphi_A-\varphi_B$，不用 $U$；这里的 $\Delta\varphi$ 是另一个写法，但当场定义了，不冲突。
- **能量**：$U$ 是电势能、静电能；$u$ 是能量密度。
- **电荷**：
  - 束缚电荷、自由电荷写 $\rho_{\mathrm b}$、$\sigma_{\mathrm b}$、$\rho_{\mathrm f}$、$\sigma_{\mathrm f}$，正体下标；$\chi_{\mathrm e}$、$\varepsilon_{\mathrm r}$ 也是。
  - $Q$ 是总电荷，$Q_{ij}$ 是电四极矩，靠下标分开。
- **$\lambda$**：`poisson-equation` 里有两个意思，例 2、p4 是德拜长度，p6 是单位长度的电荷，各自当场说了，不报。
- **高斯定律的微分形式**：和狭义相对论 `covariant-maxwell` 写法一致，见「前置」。

## 格式、术语、证明深度、难度档

- 固定结构、二级标题、锚点格式都由构建查过，0 个错误。
- **术语**：
  - 9 节每个术语第一次标记都括注了英文，每块第一次出现都标了。我的脚本报的「未标记」只剩两种：链接标题里的（不算出现），和别的领域里的基础词或同名不同义的词。规矩 C 的处理见「我替你定的」。小问题 2 之外没有问题。
  - 20 个新术语的简介都在 60 字以内（最长 43 字），锚点都落在下定义的那一段。共用锚点的都在同一段里定义：电容与电容器、镜像电荷与镜像法、线性电介质与电极化率。小问题 3 的两条简介之外都准确。
- **锚点**：页面上定义卡片数等于讲解里的锚点数（3、5、5、4、4、2、3、5、6）。`poisson-equation` 例 2 的 `def-debye` 在例题里，按 `AnchorBlock` 的设计只有讲解里的显示成卡片，不算问题。
- **写法**：段落都不超过 4 句（讲解、题目文字都查了），中英文之间有空格，引号都用「」。粗体标签里的术语照规矩标了（`capacitors:34`「平行板电容器」、`gauss-differential:49`「恩肖定理」）。
- **证明深度 `sketch`**：
  - 各定理都给了证明思路，严格的部分说明了交给哪里：恩肖定理的高阶情形交给 `poisson-equation`，展开的完备性交给偏微分方程。
  - 完整推导放进难题的：拉普拉斯方程的唯一性（`images-uniqueness` p6）、束缚电荷（`polarization` p5）、四极矩的变换（`multipole-expansion` p5）。
- **难度档**：p1、p2 一步代公式；p3、p4 要组合前置或多走几步；p5、p6 是完整推导；p7、p8 问「为什么」和与别的领域的联系。都合定义。
- **数值题不问例题算过的量**：逐题对过，没有。
  - `poisson-equation` p3 用例 1 的装置，问的是板上的面电荷密度；p4 用例 2 的离子，问的是 $r=\lambda$ 以内的总电荷。例题都没算这两个量。

## 几何图像

- **`capacitors/capacitor-fringe.svg`**：
  - 注释：宽 2、间隔 0.8（即 $0.4w$）、电势 $\pm1$、外框 $|x|,|y|=8$ 接地，逐级加密的 SOR 求解。
  - 我用边界元法在自由空间里独立求了同一个问题（两块无限薄的板，每块分 400 段，段内电荷密度为常数，按余弦加密边缘）。
  - **电场线**：32 条路径和我的电场方向最多差 5.2°。
  - **等势线**：8 条在我的解里的电势是 $\pm0.205$、$\pm0.404$、$\pm0.605$、$\pm0.801$，名义值是 $\pm0.2$ 到 $\pm0.8$，沿线起伏 0.01 到 0.02。差别来自外框，图是对的。
  - 外侧面出发的线绕过边缘回到另一块板，出框的从另一侧画回来了。
  - **电容**：我算出 $C=3.816\varepsilon_0$（每单位长度）。
    - 分 200 段和 400 段只差 $10^{-4}$。
    - 拿宽板检验：板宽是间隔的 50 倍时比帕尔默公式多 0.02%，10 倍时多 0.4%，差别随间隔变大而增加，正是渐近式的样子。
    - 所以宽与间隔之比为 2.5 时，帕尔默公式的 $3.695\varepsilon_0$ 偏小 3%。写内容会话 SOR 得到的 $3.70\varepsilon_0$ 也偏小；接地外框只会让电容变大，两者对上多半是巧合。
    - 正文没写这个数，不用改；以后要写数，用 $3.82\varepsilon_0$。
- **`images-uniqueness/plane-image.svg`**：
  - 左图 16 条线：10 条落到平面上，最后一小段和法线最多差 2.5°；6 条出框，按说明「落在框外远处的平面上」，不画回来，合理，因为平面延伸到框外。
  - 右图实线和左图逐点相同（0.00 像素），虚线 16 条汇入 $-q$，其中 6 条从框边画回来。
  - 长于 1.5 像素的小段和电场方向最多差 2.6°；8° 的那一段只有 0.54 像素长，是取整误差。
  - 两幅图之间空 36 像素。
- **`electrostatic-separation/sphere-field.svg`**：
  - 24 条线：11 条终止在左半球面、11 条从右半球面出发，2 条从左框到右框；和电场方向最多差 2.9°。
  - 8 条等势线的电势是 $\pm0.6$ 到 $\pm2.4$（单位 $E_0R$），偏差不超过 0.002。
  - 靠近赤道落到球面的线最后一小段斜着进来，那里 $\sigma\to0$，电场线贴着球面才转成垂直，物理上对。
- **`polarization/polarized-slab.svg`**：示意图，左图偶极矩顺着外电场，右图左负右正，板里的虚线箭头向左，和说明一致。
- **文字**：4 张图的 22 段文字用 `getBBox()` 量过，都在画布里、互不重叠、不压线。
- **亮色主题**：电容器、镜像法两张导出成图片看过，线、文字都清楚。
- **动画**（6 个）：
  - `gauss-differential` 向量场，$R=0.5$、$2$：脚本推帧后导出画布看，圆柱里箭头向外变长、外面按 $1/s$ 变短，和说明一致。
  - `electrostatic-energy`，$R=0.5$、$1.5$：峰值 $1/R^2$ 最大是 4，在 $[0,4.2]$ 里。
  - `multipole-expansion`，$N=0$、$6$：见「逐节」。
  - `electric-displacement`，$\varepsilon_{\mathrm r}=1$、$5$：电场在板里降到 0.2，都在画面里。
  - `capacitors`、`poisson-equation` 没有滑块，导出看过。
  - 范围和滑块都配套。
- **768 宽**：
  - 9 节 72 道题的提示全部点到第 3 级、36 道简单题和中等题的解答全部展开后，都不左右滚动。
  - 行内公式没有超出右边，题卡没有被撑宽，KaTeX 错误为 0。
- **代码那边的小毛病**（不是内容问题，转给写代码的会话）：`poisson-equation` 的函数图横轴是 $[-0.9,0.9]$，原点的刻度显示成「−0.0」，是刻度取值的浮点误差。

## 史实和数字

都对。4 项上网核过，来源是维基百科、NIST、法拉第原文的转述；其余是课本里常见的。

- **莱顿瓶**：克莱斯特 1745 年 10 月、穆申布鲁克在莱顿 1746 年初各自发现，「1745 年前后」对。后来通行的内外贴金属箔的玻璃瓶，对。上网核过。
- **恩肖定理**：1842 年。
- **泊松、拉普拉斯**：泊松 1813 年指出物体内部要加和密度成正比的项；拉普拉斯先给出外部的方程。
- **镜像法**：威廉·汤姆孙 1848 年发表在《剑桥和都柏林数学杂志》，对。上网核过。
- **法拉第**：第十一辑（1837 年 12 月宣读）用同心球测「比感应容量」，虫胶约为空气的两倍，对。上网核过；原始数据没读到，只核到转述。
- **麦克斯韦**：「位移」的命名。
- **保罗阱**：1989 年诺贝尔物理学奖，保罗和德默尔特分享一半。
- **数据**：
  - 氢原子极化率 $4.5\times4\pi\varepsilon_0a_0^3$；
  - 水分子 $6.2\times10^{-30}\,\mathrm{C\,m}$（$1.85\,\mathrm D$）；
  - 水的相对介电常量约 80，空气多出约 $6\times10^{-4}$；
  - 经典电子半径 $2.8179403205\times10^{-15}\,\mathrm m$（CODATA 2022，上网核过）；
  - 康普顿波长约 $2.43\times10^{-12}\,\mathrm m$。

## 我替你定的（都能改）

1. **「介电常量」先不进术语表**：只在 `electric-displacement` 一节用，合「只加锚点」那一条。以后别的小节要用（例如介质里的电磁波）时再进表，那时 `coulomb-law:51` 的「真空介电常量」按复合词规矩整个词标。
2. **「总电荷」「净电荷」不算复合词拆开**：「总」「净」是修饰语，批次 9 的 `electric-dipole`、`gauss-law`、`conductors` 也是这样标的。
3. **规矩 C 的几个词不标**：
   - 「平衡点」（`gauss-differential:51`）、「鞍点」（`poisson-equation:65`）说的是力的平衡点和函数的鞍点，和常微分方程的「平衡点」「鞍点」不是一回事；
   - 「通解」「线性无关」「级数」的概念在链上；
   - 「中心」「分量」「平行」「夹角」「长度」是基础词。
4. **`electrostatic-energy` 不加 `capacitors` 前置**：`:16` 拿电容器的结果引出问题，`:34` 回头说「正是电容器一节的结果」，推理没用到。加上会让这一节从第 20 层移到第 21 层。
5. **`capacitors:27` 提前借用唯一性定理**：电容的定义不依赖它，只是说明一般形状时也成立，并且明说「以后会证明」，`images-uniqueness:38` 回头接住了。
6. **思考题的第 3 级提示只答最后一问**：例如 `gauss-differential` p8、`poisson-equation` p7。三条提示合起来是完整解答，批次 9 的 `electric-potential` 第 8 题也是这样，没报。
7. **电容器那张图不用改**：$3.70\varepsilon_0$ 只在交接里说过，正文没有。
8. **手机宽度没看**：方案规定 375 宽不在目标里。

## 要用户决定的

无。

## 要写回 plan.md 的

1. **同意写内容会话的建议**：用脚本自动加术语标记时，相邻的词会拼成另一个术语（「电势能精确算出」被当成「电势能」），标完要人工看一遍。
   - 补反方向的一条：长术语或复合词里的短术语被单独标出来，例如「感应 + 带标记的电荷」（「感应电荷」本身是术语）、「体 + 带标记的束缚电荷」。这一批有 5 处。
   - 查法：把每个带标记的术语和前后紧挨着的一到四个字拼起来，看是不是别的术语或复合词。
   - 放在「术语规范」复合词那一条后面（批次 10 写内容、审查时提的）。
2. **「倍」的写法**：「比……大（小）N 倍」「小多少倍」有歧义，写成「是……的 N 倍」「是……的 $\frac1N$」。批次 8 修订时逐处改过，这一批又有两处，建议写进「排版规范」（批次 10 审查时提的）。
3. **术语表的取舍**（你在这一批定的）：一个名词在两节以上用到就进术语表，补标已经 `reviewed` 的小节、退回 written 是正常流程，不算不进表的理由。这一批「自由电荷」进表；「介电常量」只在一节用，先只加锚点。
4. **给以后写电磁学的会话留的话**（本批的讲解、题目指向以后几节，写的时候要接得住）：
   - `electrostatic-energy:99`：电场的能量怎样流动（`poynting-theorem`）。
   - `electric-displacement:27`：「位移」是麦克斯韦起的名字。讲位移电流时（`maxwell-equations`）和 $\vb D$ 接上。
   - `polarization` 第 7 题：电场变化快时取向极化先跟不上、再快电子云也跟不上（`dispersion`）。水的 $\varepsilon_{\mathrm r}\approx80$ 是静电的值，到 `waves-in-media` 讲折射率时要说明光频下小得多。
   - `poisson-equation` 第 8 题：$k(-y,x,0)$ 这种绕圈的电场由变化的磁场产生（`induced-electric-field`）。
   - `gauss-differential` 第 8 题：绕核运动的电子会辐射（`larmor-formula`）。
   - `capacitors` 第 7 题：两个电容器相连，损失一半能量和电阻无关（`rc-circuits` 可以算一遍）。

## 没验证的地方

- 电容器那张图：我没重做写内容会话带接地外框的 SOR，只做了自由空间的边界元；图和我的解的差别（等势线 1% 到 2%）我归到外框，没有逐项分开。
- 法拉第的原始数值（虫胶约 2.0）只核到转述；泊松 1813、恩肖 1842、保罗阱的诺贝尔奖没上网核，按课本里常见的说法。
- 动画的实际帧率和拖动的手感没看：面板没显示，向量场是脚本推帧、导出画布看的。
- 手机宽度、iPad、Safari 没测。
- 修订后的复核还没做。

## 修订说明（写内容会话）

3 条小问题都改了，没有不改的。报告里交给我定的一处前置（`images-uniqueness` 的 `math.pde.laplace-equation`）保留，理由见下。改动只在 `content/physics/electromagnetism/`。

### 小问题 1 · 前置

- 照报告加了三个前置：`electrostatic-separation` 加 `electric-dipole`，`polarization` 加 `conductors`，`poisson-equation` 加 `conductors`；同时去掉 `images-uniqueness` 直接列的 `conductors`。
- 同类多改了一处：`poisson-equation` 加了 `conductors` 以后，原来直接列的 `electric-potential` 也能由它推出（`conductors` 的前置就有 `electric-potential`），一并去掉，现在是 `[gauss-differential, vector-identities, conductors]`。
- 用脚本按整张图算过四处改动合起来的层级：变了的 0 节。
- 两处链接：
  - `poisson-equation:43` 球坐标的拉普拉斯算子后面加了「（这个式子的推导见[柱坐标与球坐标下的梯度、散度和旋度](lesson:math.vector-calculus.curvilinear-coordinates)）」；
  - `images-uniqueness` p5（3）的「电偶极子」加了「见[电偶极子](lesson:physics.electromagnetism.electric-dipole)」。
- `images-uniqueness` 的 `math.pde.laplace-equation` 保留：讲解里「数学上的说法见……」指向它，p6 的格林恒等式证法正是它的目标；去掉层级也不变，留着让读者顺着链接和前置回顾找到数学上的那一节。

### 小问题 2 · 术语

- **2a 复合词**：5 处改成整个词标：
  - `images-uniqueness:72`、`electrostatic-separation:71`：「感应电荷」，标 `induced-charge`；
  - `polarization:63`：「体束缚电荷」，标 `bound-charge`；
  - `gauss-differential:88`：「正电荷」；`poisson-equation:65`：「正点电荷」。
  - 改完以后，两块里原来靠拆开的「电荷」才有的首次标记不见了，重新补标了这两块里的第一个「电荷」（`electrostatic-separation` 常见误区、`images-uniqueness` 例 2）。
- **2a 同类**：照报告的查法写了脚本，把每个带标记的术语和前后紧挨着的 1 到 4 个汉字拼起来，看是不是术语表里的另一个术语，或者前面是「正、负、体、面、线」。电磁学 17 个已写小节的讲解和题目都查了，只剩 `conductors:92` 一处误报（「导体里面」的「面」加上「电场」）。
- **2b「自由电荷」进术语表**：`physics.electromagnetism.free-charge`。
  - 定义就在 `polarization#def-bound-charge`，和「束缚电荷」共用一个锚点，卡片上两个都标出来；简介照报告写成「不是因极化而错开的电荷：导体里能移动的电荷、放到物体上的电荷，记作 $\rho_{\mathrm f}$、$\sigma_{\mathrm f}$」。
  - 原来整个词标成「电荷」的 7 处（`polarization:69`，`electric-displacement` 6 处）改标 `free-charge`。
  - 每块第一次出现的地方补了标记：`conductors` 4 处，`polarization` 1 处，`electric-displacement` 3 处。
  - 每节第一次出现括注 free charge：`conductors:32`、`electric-displacement:16`；`polarization` 定义处原来就有。
  - `conductors` 只改了这几处标记和括注，`status` 退回 `written`。
- **2c 括注英文**：报告列的 7 个都加了：
  - 极板（plate）`capacitors:25`；
  - 鞍点（saddle point）`poisson-equation:65`；
  - 极性分子（polar molecule）`polarization:22`；
  - 玻尔半径（Bohr radius）`polarization:32`；
  - 位移极化（electronic polarization）、取向极化（orientation polarization）：`polarization` p7 题干；
  - 四极子：在 `multipole-expansion` 例 1 的标题里写成「直线四极子（linear quadrupole）」。
- **2c 同类**：又补了 13 处：
  - 「极板」在别的三节第一次出现：`electrostatic-energy:34`、`polarization:73`、`electric-displacement:49`；
  - 电子云（electron cloud）`polarization:22`；
  - 引力势（gravitational potential）：`poisson-equation:27`、`multipole-expansion` p7；
  - 真空二极管（vacuum diode）、阴极（cathode）、阳极（anode）：`poisson-equation` p5；
  - 无迹（traceless）：`multipole-expansion` p6 参考解答；
  - 傅里叶正弦级数（Fourier sine series）：`electrostatic-separation` p5 提示 3；
  - 边缘电场（fringing field）：`electric-displacement` p6 提示 3；
  - 皮法括注了 picofarad：`capacitors` p1。
- **2d 规矩 C**：`poisson-equation:73` 改写成「变成只含 $x$ 的方程」，不再用「常微分方程」。同类：9 节里查了别的领域的词（常微分方程、偏微分方程、特征值、行列式、傅里叶级数、格林等），没有别的链外术语；「调和函数」在 `poisson-equation` 自己的定义段里起名、括注了英文。

### 小问题 3 · 说法和公式

- **3a**：`poisson-equation` p7 提示 1，$\rho_m$ 改成 $\rho$。
- **3b**：`images-uniqueness` p6 题干改成「电势沿法线的导数 $\pdv{\varphi}{n}$（电场的法向分量是它的相反数）」；提示 3 的「给法向分量时」也改成「给法向导数时」。
- **3c**：`multipole-expansion` p5 参考解答（2）改成「否则挪原点一般会改变电四极矩：即使 $Q=0$，只要 $\vb p\ne\vb 0$，就多出 $-3(p_ia_j+a_ip_j)+2(\vb p\cdot\vb a)\delta_{ij}$；$Q\ne0$ 时还多出 $Q\bigl(3a_ia_j-a^2\delta_{ij}\bigr)$」。
- **3d**：`electrostatic-energy:41` 的定理改成「电荷连续分布在有限区域里、体电荷密度处处有限时」，「体电荷密度」的英文括注挪到这里（它成了这一节第一次出现）。「静电能」的简介加了「电荷连续分布、密度有限时」。
  - 同类：这一节的一句话总结原来也没有条件，改成「连续分布时，静电能是 $\frac{\varepsilon_0}{2}E^2$ 的全空间积分，能量在电场里。」（25 字）。
- **3e「倍」**：
  - `electrostatic-separation:40`「比原来的电场强三倍」改成「是原来电场的三倍」；
  - `electric-displacement` p8 题干「比在真空里小多少倍」改成「是在真空里的几分之一」，参考解答「比真空里小约 $80$ 倍」改成「约为真空里的 $\frac{1}{80}$」；
  - `electrostatic-energy:43`「球面积只增大 $R^2$ 倍」改成「只按 $R^2$ 增大」。
  - 同类：9 节加 `conductors` 里所有「倍」都看了，剩下的是「加倍」「是……的 N 倍」，没有歧义。
- **3f**：「电容」的简介改成「……和带多少电荷无关，由两个导体的形状、相对位置和中间的电介质决定，单位是法拉」。同类：「能量密度」的简介原来说「静电场的能量密度是 $\frac{\varepsilon_0}{2}E^2$」，讲到电介质以后就不全对，改成「真空中静电场的……」。
- **3g**：`capacitors` p3、`gauss-differential` p4 的题干补了 $\varepsilon_0$ 的取值。同类：其余数值题要用的常量都给了，或者答案用不到常量（例如 `images-uniqueness` p2、`poisson-equation` p3）。

### 别的

- 「$3.70\varepsilon_0$」：同意报告。这个数只在交接说明里，正文没写；交接说明已改成「带接地外框的数值解偏小，审查用边界元法得 $3.816\varepsilon_0$」。
- `poisson-equation` 函数图原点刻度显示「−0.0」是代码那边的问题，内容没改。

### 验证

- 仓库里全量 `npm run content`：0 个错误、0 个警告。
- 验算：
  - 我的 `verify_b10.py` 94 项一致，批次 9 的 `verify_b9.py` 103 项一致；
  - 审查会话的验算脚本，本批 9 个加 `conductors`，各 4 题全部一致。
- 自查：
  - 改过的 11 个小节，自动标记演习要补的 0 处；
  - 每节第一次出现的英文括注、排版、段落句数都没问题，只剩 4 处「定理（X，English）」写法的误报（和批次 9 高斯定律那条一样）；
  - 复合词脚本只剩上面说的 1 处误报。
- 768 宽：改过的 10 节（本批 9 节加 `conductors`）：
  - 全部展开提示和解答后都不左右滚动，行内公式不超出；
  - KaTeX 错误为 0；
  - 讲解里的定义卡片数等于讲解里的锚点数（3、5、5、4、4、2、3、5、6、6）；
  - SVG 文字不出界、不重叠、不压线。
  - 服务在临时副本上起的，查完已停，仓库的 `dist/` 没动。
- `npm test` 跑了三次：一次 202 项全部通过；两次各有 1 项失败，都是 `compiler/compile.test.ts` 的「真实内容 › 构建通过」超过 30 秒超时。
  - 这一项在测试进程里编译全部真实内容，和别的测试并行跑时变慢；单独跑 `npm run content` 只要 12 到 18 秒，结果 0 个错误、0 个警告。
  - 这不是内容错误，测试没改；内容越来越多，可能要写代码的会话把这一项的超时调大。

## 复核

审内容 agent · 2026-11-11

**结论**：没有需要再修的。

- 3 条小问题都改好了；同类多改的地方逐处看过，都对。
- 说明之外的改动：只有两处，都对，见「怎么比的」。
- 9 节加 `conductors` 的 `status` 已改成 `reviewed`，只改了各节 `lesson.md` 第 11 行。`gauss-applications` 初审时已改回 `reviewed`。
- 一处可改可不改：「电容」的简介少了「大小」，见「逐条」。

### 怎么比的

- 和初审时的快照逐文件比较。快照在我的 scratchpad 的 `b10/snap/` 里，是 2026-11-11T13:45:47Z 拷的整个 `content/physics/electromagnetism/`。
- 改了 20 个文件：
  - `_domain.yaml`；
  - 9 节的 `lesson.md`，以及 `conductors/lesson.md`；
  - 8 份 `problems.yaml`：除了 `electrostatic-energy`、`conductors` 都改了；
  - `gauss-applications/lesson.md` 只有我初审时改的第 11 行。
- 4 张 SVG、动画参数都没动。
- 每一处都能在修订说明里找到。说明里没写、我看了都对的有两处：
  - `polarization:71`（例 1「所有:term[电荷]」）、`electric-displacement:51`（「同样的:term[电荷]」）补标了「电荷」。原因是「自由电荷」改指自己的 id 以后，这两块里「电荷」的第一次出现就落到了后面，和说明里 2a 的「重新补标」是同一回事。
- `poisson-equation` 去掉 `electric-potential`：说明里写了，你的消息也提了，对，见下表。

### 逐条

| 条目 | 现在的位置 | 复核 |
| --- | --- | --- |
| 小问题 1 · 前置 | 4 节的文件头 | 对，见表下第 1 点。 |
| 两处链接 | `poisson-equation:43`；`images-uniqueness/problems.yaml:88` | 对。链接文字和目标小节的标题一致，在页面上能点。 |
| `math.pde.laplace-equation` 保留 | `images-uniqueness:7` | 可以。修订说明给的理由（讲解链到它，p6 的格林恒等式证法正是它的目标）站得住，层级不受影响。 |
| 2a 复合词 | `images-uniqueness:72`、`electrostatic-separation:71`、`polarization:63`、`gauss-differential:88`、`poisson-equation:65` | 对，见表下第 2 点。 |
| 2b 自由电荷 | `_domain.yaml`；`polarization:44`；`electric-displacement` 9 处；`conductors:32`、`:39`、`:60`、`:92` | 对，见表下第 3 点。 |
| 2c 英文 | 报告列的 7 处和同类 13 处 | 对，见表下第 4 点。 |
| 2d 规矩 C | `poisson-equation:73` | 对。改成「只含 $x$ 的方程」，不用链外的术语；全节不再有「常微分方程」。 |
| 3a | `poisson-equation/problems.yaml:136` | 对。 |
| 3b | `images-uniqueness/problems.yaml:110`、提示 3 | 对：「电势沿法线的导数 $\pdv{\varphi}{n}$（电场的法向分量是它的相反数）」；提示 3 跟着改成「法向导数」。 |
| 3c | `multipole-expansion/problems.yaml:102` | 对。补出的两项和（1）的变换式逐项一致，「一般会改变」的「一般」也恰当。 |
| 3d | `electrostatic-energy:41`、一句话总结、两条简介 | 对，见表下第 5 点。 |
| 3e「倍」 | `electrostatic-separation:40`；`electric-displacement/problems.yaml:147`、`:156`；`electrostatic-energy:43` | 对。9 节加 `conductors` 里剩下的「倍」都是「加倍」「是……的 N 倍」，没有歧义。 |
| 3f 电容的简介 | `_domain.yaml:445` | 对，见表下第 6 点。 |
| 3g 常量 | `capacitors` p3、`gauss-differential` p4 | 对，补的就是标准答案用的 CODATA 2022 的 $\varepsilon_0$。 |

表里几条的展开：

1. **前置**：
   - `electrostatic-separation` 加 `electric-dipole`，`polarization` 加 `conductors`，`poisson-equation` 加 `conductors`，`images-uniqueness` 去掉 `conductors`。
   - `poisson-equation` 另外去掉 `electric-potential` 也对：`conductors` 的前置有 `electric-potential`，它仍在链上，`:22` 用的 $\vb E=-\nabla\varphi$ 有着落。
   - 按整张图重算：656 节和 HEAD 比层级变了的 0 节；9 节的前置都没有多余。
   - `polarization` 的页面上，前置提示现在列出「电偶极子」「高斯定律的微分形式」「导体与静电平衡」。
2. **复合词**：5 处都整个词标了。
   - `images-uniqueness:76`、`electrostatic-separation:72` 补标的「电荷」都是这一块里「电荷」的第一次出现。
   - 我的扫描脚本把 17 节重查一遍，剩下的只有已经说明过的「总电荷」「净电荷」，和 `conductors:92` 的误报（「里面」的「面」）。
3. **自由电荷**：
   - 术语表条目对，简介 37 字，只用读到 `polarization` 时已懂的概念。
   - 共用锚点 `def-bound-charge` 妥当：这一段同时给「束缚电荷」「自由电荷」起名，和以前「绝缘体」与「导体」、「电容」与「电容器」、「镜像电荷」与「镜像法」的做法一样。页面上卡片标签显示「束缚电荷·自由电荷」。
   - 原来整个词标成「电荷」的 7 处都改指 `free-charge`；`polarization`、`electric-displacement` 每块第一次出现都标了。
   - 每节第一次出现都括注了 free charge：`conductors:32`、`electric-displacement:16`、`polarization:44`。
   - `conductors` 的 4 处是那 4 块的第一次出现，`:32` 是全节第一次，括注了英文。这一节只改了这几处和 `status`。
   - 批次 9 别的小节没有「自由电荷」。
4. **英文括注**：7 处都加了。同类 13 处也逐个看了：
   - 「极板」在 `electrostatic-energy:34`、`polarization:73`、`electric-displacement:49` 都是各节的第一次；
   - 其余括注都对，`capacitors` p1 的 picofarad 写在单位旁也合适。
5. **3d**：
   - 定理现在写明「电荷连续分布在有限区域里、体电荷密度处处有限时」；「体电荷密度」的英文括注挪到了 `:41`，那里成了全节第一次，`:51` 不再重复，对。
   - 一句话总结「连续分布时，静电能是 $\frac{\varepsilon_0}{2}E^2$ 的全空间积分，能量在电场里。」按字数规则 25 字。
   - 「静电能」的简介加了条件；「能量密度」的简介加了「真空中」，讲到电介质以后不再说错。
6. **3f**：改成「和带多少电荷无关，由两个导体的形状、相对位置和中间的电介质决定」，原来的问题解决了。
   - 只是比讲解 `capacitors:100`「形状、大小和相对位置」少了「大小」。电容和极板面积成正比，补上更准。
   - 现在是 58 字，直接加「、大小」是 61 字，超过上限。可以把「和带多少电荷无关」缩成「和带电多少无关」，正好 60 字：「电容器一个极板的电荷与两板电势差之比 $C=\frac{Q}{\Delta\varphi}$，和带电多少无关，由两个导体的形状、大小、相对位置和中间的电介质决定，单位是法拉。」
   - 这是措辞上的小事，我没有因此卡住这一节；你们定改不改，改的话不用再复核。

### 验算和命令

- `npm run statements` 读题的变化只是两道题补了 $\varepsilon_0$、一道题补了 picofarad，答案没变。17 个电磁学验算脚本（本批 9 个加批次 9 的 8 个）逐个跑，68 题全部一致。
- **公式**：10 份 `problems.yaml`（本批 9 份加 `conductors`）的公式全部用 `compileTex` 加本领域的宏渲染、再跑 `suspectTex`。共 1607 个公式（参考解答 524 个），0 个错误，没有可疑写法。
- `npm run content`：0 个错误、0 个警告。
- `npm run build`：通过。`npx tsc -p tsconfig.node.json --noEmit`：通过。
- `npm test`：23 个文件、202 个测试通过。这一次「真实内容 › 构建通过」没有超时。
- 术语、格式的检查脚本重跑：
  - 复合词、每块第一次标记：只剩上面说的；
  - 英文括注、段落句数、空格、引号：只剩链接标题里的误报；
  - 规矩 C：没有新的链外术语，新加的「引力势」等在别的领域的术语表里都没有。
- **页面**：768 宽，`test-serve`，进度写临时仓库，查完已停。
  - 改过的 10 节，提示、解答全部展开后都不左右滚动，行内公式不出右边，KaTeX 错误为 0。
  - 讲解里的定义卡片数等于讲解里的锚点数（3、5、5、4、4、2、3、5、6、6）。
  - `conductors` 的 4 处「自由电荷」都显示成术语。
- SVG 没改，这一轮没有重看。

### 没验证的

- 「电容」的简介少了「大小」，见上，可改可不改。
- 手机宽度、iPad、Safari 没测；动画的实际帧率没看（动画参数这一轮没改）。

# 批次 11 审查报告：电磁学与电动力学（电流与静磁场 9 节）

审内容 agent（和写内容 agent 是两个独立会话，没有读它的会话记录、交接说明和自查脚本）· 2026-11-12

审查范围：`content/physics/electromagnetism/` 下 9 节：`current-density`、`dc-circuits`、`rc-circuits`、`lorentz-force`、`magnetic-force-on-currents`、`biot-savart`、`ampere-law`、`vector-potential`、`magnetic-dipole`。每节都看了 `lesson.md` 和 `problems.yaml`。另外看了：

- 8 张 SVG、8 个动画；
- `_domain.yaml` 新增的 30 个术语；
- 批次 9 `conductors:32` 补的那一处标记；
- `maxwell-equations`（大纲）去掉的前置。

## 结论

重要 0 条，小问题 3 条（同一类合成一条）。

- **验算**：36 道简单题、中等题里 33 道和独立验算一致。
  - `lorentz-force` p1、p3、p4 不一致：标准答案用了 CODATA 的常量，题面给的却是四五位的近似值。
  - 相对差 $2\times10^{-5}$ 到 $7\times10^{-5}$，按 $5\times10^{-3}$ 的容差判题不受影响，但 `npm run verify` 对这 3 题报 ✗。
- **难题、思考题**：36 题的参考解答和三级提示逐题读过，推导都对。有两处参考解答的数字或说法不准（小问题 1）。
- **小问题 1 · 题目**：
  - `lorentz-force` p1、p3、p4 的 `value` 改用题面给的常量；p3 题面补上 $e$ 的取值。
  - `vector-potential` p2 的选项 A、B 照搬了讲解、动画里判过的例子。
  - `dc-circuits` p8 参考解答说一米导线上的电势差「不到两百分之一伏」，实际约 $0.017\,\mathrm V$。
  - `vector-potential` p7 参考解答把 $\frac he$ 叫作「磁通量子」，通称的磁通量子是 $\frac h{2e}$。
- **小问题 2 · 术语**：
  - 起名的段落没加锚点：`ampere-law:33`「安培回路」，`vector-potential:45`「规范自由度」「库仑规范」。
  - 复合词里单独标了短术语：「地磁场」拆成「地」加带标记的「磁场」，2 处；「电流环」里标了「电流」，6 处。
  - `rc-circuits:88` 把电压表的内阻标成了术语「内阻」，术语表里那是电源的内阻。
  - 规矩 C：`vector-potential:27`、`:47` 的「拉格朗日量」，`ampere-law:16`、`:38` 的「微分方程」不在链上，要标。
  - 新名词第一次出现没括注英文：非静电力、晶格、位移电流、矢量面积、磁荷、超精细结构、自旋等。「矢量面积」还用在两节里、没有锚点。
  - 「霍尔效应」的简介里 $t$ 没交代。
- **小问题 3 · 说法、公式和记号**：
  - `ampere-law:29` 立体角的正负没说清。按最自然的读法（拇指那一侧为正），$\vb B=\frac{\mu_0I}{4\pi}\nabla\Omega$ 差一个负号。
  - `magnetic-dipole:53`「被拉向磁场强的地方」缺了「磁矩和磁场同向时」。
  - `vector-potential:32` 积分号下求导没写条件；`ampere-law:42` 用了 $\divg(\curl\vb B)=0$，这个恒等式不在链上，要加链接。
  - 记号撞车：`current-density` p5 用 $\tau$ 表示 $\frac{\varepsilon_0}\sigma$，同一节讲解里 $\tau$ 是德鲁德碰撞时间；`magnetic-force-on-currents` p8 用 $\varphi$ 表示偏转角。
  - 另有 3 处措辞：霍尔电势差的「大小」，`lorentz-force` 左图没说两个电荷的质量相同，`vector-potential` 动画说明里的「彼此相差」。
- 你点名要查的几件事：
  - **`conductors:32`**：「电流」整个词标、括注了英文，对。`conductors` 别处没有要补标的。已把 `status` 改回 `reviewed`，只改了第 11 行。
  - **30 个新术语**：简介都在 60 字以内（最长 51），锚点都落在下定义的那一段。两处要改：`rc-circuits:88` 的标法，「霍尔效应」的简介（都在小问题 2）。
  - **前置的四处改动**：都合理，也都是最少的。656 节按整张图算，加上、去掉各算一遍，层级都不变；9 节都没有多余的前置。
  - **跨领域前置**（都还是 outline）：按目标核对都站得住。另有三句话留给以后写那几节的会话：
    - `work-energy` 要讲到力的功率 $\vb F\cdot\vb v$；
    - `angular-momentum` 要讲到力偶的力矩和取矩点无关；
    - `potentials` 要讲到「单连通」这个条件。
  - **指向这一批的链接**：5 处都接住了，记号一致（见「前置」）。
  - **写内容会话定的记号和术语取舍**：妥当，有几点：
    - $\sigma$ 在静电各节是面电荷密度，从这一批起又是电导率。这一批没有一节两种都用，以后的趋肤效应等节要留意。
    - $\tau$ 在 `current-density` 一节里撞了（小问题 3）。
    - 「安培回路」「库仑规范」说是只加锚点，可锚点没加（小问题 2）。
    - 晶格、超导体、力偶当借用词处理，对。
    - 位移电流是本领域的概念，已在 `gauss-law`、`ampere-law`、`rc-circuits` 三节出现。它的定义在还没写的 `maxwell-equations`，等那一节写好时进术语表、补标（写回）。
    - 「电流计」改「检流计」对；「电流环」是同一类情形，没改到。
  - **立体角的证明**：思路对。「窄带」那一步一行就能写出来：混合积轮换以后正是毕奥-萨伐尔定律的被积式。建议顺便把 $\Omega$ 的正负说清（小问题 3）。
  - **你列的史实和数字**：都对，来源见「史实和数字」。
    - 狄拉克 1931 年、吉尔伯特 1600 年《论磁》、安培的分子电流、超精细结构支持电流环。
    - 偶极轴偏离地轴约十度：IGRF-13（2020）是 9.4°到 9.5°。
    - 多余电荷在 $10^{-14}\,\mathrm s$ 量级散开：带惯性的德鲁德模型里，电荷密度按等离子体频率振荡，在 $2\tau\approx5\times10^{-14}\,\mathrm s$ 内衰减。
    - 铁的电导率 $1.0\times10^7\,\mathrm{S/m}$：$20\,^\circ\mathrm C$ 时电阻率约 $9.7\times10^{-8}\,\Omega\,\mathrm m$。
    - 赤道上偶极部分 $3.0\times10^{-5}\,\mathrm T$：IGRF-13 的 $B_0=\sqrt{g_1^{0\,2}+g_1^{1\,2}+h_1^{1\,2}}\approx29\,800\,\mathrm{nT}$。
  - **8 张 SVG、8 个动画**：图都对，逐张数值核过（见「几何图像」）。动画的滑块范围合适，拖到两端画面和说明对得上，不泄露简单题、中等题的答案。带电粒子轨道画成 SVG 合适。
- 修完以后 9 节都可以标 `reviewed`。`biot-savart` 这一节没有要改的。

| 小节 | 重要 | 小问题 |
| --- | --- | --- |
| `current-density` 电流与欧姆定律 | 0 | 1（3 p5 的 $\tau$） |
| `dc-circuits` 电动势与直流电路 | 0 | 2（1 p8 参考解答；2 英文） |
| `rc-circuits` RC 电路 | 0 | 1（2 内阻） |
| `lorentz-force` 磁场与洛伦兹力 | 0 | 3（1 三题的常量；2 英文；3 左图说明） |
| `magnetic-force-on-currents` 电流受到的磁力 | 0 | 2（2 地磁场、电流环、英文；3 霍尔「大小」、p8 的 $\varphi$） |
| `biot-savart` 毕奥-萨伐尔定律 | 0 | 0 |
| `ampere-law` 安培环路定理 | 0 | 2（2 锚点、规矩 C、英文；3 立体角的正负、链接） |
| `vector-potential` 磁矢势 | 0 | 3（1 p2 选项、p7 参考解答；2 锚点、规矩 C；3 求导的条件、「彼此相差」） |
| `magnetic-dipole` 磁偶极子 | 0 | 2（2 地磁场、电流环、英文、矢量面积；3 受力的条件） |

## 怎么审的

- 读了 `docs/plan.md` 已提交的规矩：f05d9a9（批次 10 的写回）、c3d5126（批次 11 的安排）。f05d9a9 新加的几条都照着查了：
  - 自动标记后人工看一遍：相邻的字拼成别的术语，长词里的短术语被单独标出；
  - 两节以上用到的名词进术语表；
  - 「倍」的写法；
  - 方位角 $\psi$。
- **快照**：初审开始时把整个 `content/physics/electromagnetism/` 拷到我的 scratchpad 的 `b11/snap/`，时间是 2026-11-11T17:54:59Z。`git diff HEAD` 的输出也存了一份，复核时和它比。
- **改动范围**：
  - `git diff HEAD -- content/physics/electromagnetism/` 有：9 节的 `lesson.md`（从 outline 写成 written）；`_domain.yaml`（加了 30 个术语，宏没动）；`conductors` 的 2 行（`:11`、`:32`）；`maxwell-equations` 的前置。
  - 9 份 `problems.yaml`、8 张 SVG 是新文件，直接读。
  - 前置改了 4 处，和你说的一致。
- 逐节读讲解、例题、常见误区，推导逐步核对，例题的数都重算过。
- **简单题、中等题**：只用 `npm run statements` 读题，写完验算脚本、跑出结果以后才打开 `problems.yaml`。
- **难题、思考题**：36 题的参考解答连同三级提示全部读了，关键的式子另外推过：
  - 导体里电荷的弛豫、铜铁接头的界面电荷（$4.6e$）；
  - 无穷梯形网络、立方体一条棱的 $\frac7{12}R$；
  - 分步充电的热量；
  - 交叉场里从静止出发的摆线、回旋加速器的动能和频率；
  - 转动圆盘的磁矩、电动机的平均力矩；
  - 亥姆霍兹条件、有限长螺线管的轴上磁场、$\vb B=ks^2\uv\psi$ 的电流密度；
  - 库仑规范下磁矢势的唯一性、管外 $\chi=\frac{\Phi}{2\pi}\psi$ 的多值性、阿哈罗诺夫-玻姆效应的磁通；
  - 转动球壳的磁矩和球心磁场、同轴磁偶极子之间的力。
- **公式**：构建不渲染参考解答。我把 9 份 `problems.yaml` 里所有文字的公式都用编译器的 `compileTex` 加本领域的宏渲染了一遍，再跑 `suspectTex`。共 1338 个公式（参考解答 435 个），0 个错误，没有可疑写法。
- **图**：8 张 SVG 都按注释里的设定反算，用脚本逐段核对（见「几何图像」）。
- **术语和格式**：沿用以前批次的检查脚本，讲解和题目文字都查：
  - 每节第一次标记带不带英文，每块第一次出现标没标；
  - 带标记的术语和紧挨着的字拼不拼成别的术语；
  - 规矩 C 对照前置链查；
  - 段落句数、空格、引号、「倍」；
  - 30 个新术语在已写的 17 节讲解里有没有要补标的地方：除 `conductors:32` 外没有。`electric-field:29`、`electrostatic-energy:99` 的「电磁场」是更长的词，不算「磁场」出现。
- **前置**：用脚本算全图 656 节的层级，比较 HEAD 和现在；逐节列出链上有哪些小节；几种改法各算一遍层级。
- **页面**：`npm run build` 后用 `.claude/launch.json` 的 `test-serve` 打开，进度写临时仓库，查完已停掉。这次面板显示着，动画直接截图看；面板跟着应用，是暗色主题。
- **跑过的命令**：
  - `npm run content`：0 个错误、0 个警告（改 `conductors` 的 `status` 前后各跑一次）。
  - 本批 9 个验算脚本逐个单独跑：33 题一致，`lorentz-force` 3 题不一致（见下）。
  - 全量 `npm run verify`：166 个小节，661 题一致，3 题不一致（就是上面那 3 题）。
  - `npx tsc -p tsconfig.node.json --noEmit`：通过。
  - `npm run build`：通过。这次全量构建没被线性代数卡住，没用临时副本。
  - `npm test`：23 个文件、202 项全部通过，这次没有超时。

## 简单题、中等题的验算

脚本在 `tools/verify/physics.electromagnetism.<小节>.ts`。辅助文件 `physics.electromagnetism._es.ts` 这次加了：毕奥-萨伐尔定律沿导线数值积分、闭合导线的磁矩和受力、四阶龙格-库塔法（带二分找事件）、线性方程组、直流电路的节点法。两套算法互相独立：

1. **公式**：讲解里的式子。
2. **不用这些式子的算法**：
   - **电流、电阻**：加 1 V 电势差，由 $E$、$J$ 求电流再算 $\frac VI$；同轴电缆的漏电电阻沿半径切成薄圆筒数值积分。
   - **直流电路**：把电路写成节点电势的线性方程组，用高斯消元解；和戴维南等效、消元公式核对。
   - **RC 电路**：用龙格-库塔法积分电荷（或电势差）的微分方程，二分出到达某个值的时刻。时间常数按定义取：放电到 $\frac1e$、充电到 $1-\frac1e$ 的时刻。
   - **带电粒子**：用龙格-库塔法积分 $m\dv{\vb v}t=q(\vb E+\vb v\times\vb B)$，二分出速度分量变号的时刻、读位置；速度选择器二分出横向位移为零的速度。
   - **电流受力**：沿导线对 $I\,\dd\vb l\times\vb B$、$\vb r\times\dd\vb F$ 数值积分；转动的功是对数值积出的力矩按转角积分；霍尔电势差换两种宽度算，结果不变。
   - **毕奥-萨伐尔定律**：沿导线直接数值积分。无限长导线取 $\pm10^6$ 倍距离，按 $z=s\sinh u$ 换元。
   - **安培环路定理**：不用这个定理，直接叠加。
     - 螺线管：圆线圈在轴上的磁场数值积分，再沿轴积分；
     - 螺绕环：500 个分立的圆线圈逐个积分；
     - 圆柱、同轴电缆：横截面上每一小块当成长直导线，以场点为中心按方向积分。
   - **磁矢势**：
     - 旋度由小正方形回路的环量除以面积得到；
     - 螺线管外回路的环量由电流直接算：每个线圈对正方形回路的 $\oint\oint\frac{\dd\vb l\cdot\dd\vb l'}{|\vb r-\vb r'|}$（诺伊曼公式），再沿轴积分；
     - 直导线两点的磁矢势之差，由有限长导线的 $A_z$ 在两点的差数值积分。
   - **磁偶极子**：换成半径为距离 $10^{-4}$ 倍的小圆线圈，数值积分；折过的线圈按 $\frac I2\oint\vb r\times\dd\vb l$ 积分。

| 小节 | p1 | p2 | p3 | p4 |
| --- | --- | --- | --- | --- |
| `current-density` | $1.12\,\Omega$ ✓ | B、C、D ✓ | $0.218820\,\mathrm{mm/s}$ ✓ | $2.20636\times10^7\,\Omega$ ✓ |
| `dc-circuits` | $8.50\,\mathrm V$ ✓ | $2.00\,\Omega$ ✓ | $1.875\,\mathrm A$ ✓ | $(5.0\,\mathrm V,\ 1.0\,\Omega)$ ✓ |
| `rc-circuits` | $1.034\,\mathrm s$ ✓ | $e^{-4}\approx0.0183156$ ✓ | $1.30312\,\mathrm s$ ✓ | $(0.050\,\mathrm s,\ 6.0\,\mathrm V)$ ✓ |
| `lorentz-force` | $3.13182\,\mathrm{cm}$ ✗* | B、C ✓ | $20.7281\,\mathrm{cm}$ ✗* | $4.64098\,\mathrm{cm}$ ✗* |
| `magnetic-force-on-currents` | $0.259808\,\mathrm N$ ✓ | $1.25664\times10^{-2}\,\mathrm{N\,m}$ ✓ | $7.34295\,\mu\mathrm V$ ✓ | $0.0400\,\mathrm J$ ✓ |
| `biot-savart` | $40.0\,\mu\mathrm T$ ✓ | $0.376991\,\mathrm{mT}$ ✓ | $4.00\,\mathrm{mN}$ ✓ | $22.6274\,\mu\mathrm T$ ✓ |
| `ampere-law` | $3.76991\,\mathrm{mT}$ ✓ | $0.800\,\mathrm{mT}$ ✓ | $0.500\,\mathrm{mT}$ ✓ | $0.117284\,\mathrm{mT}$ ✓ |
| `vector-potential` | $0.0500\,\mathrm T$ ✓ | A、B、E ✓ | $62.8319\,\mu\mathrm{Wb}$ ✓ | $2.19722\,\mu\mathrm T\,\mathrm m$ ✓ |
| `magnetic-dipole` | $0.400\,\mu\mathrm T$ ✓ | $12.5\,\mu\mathrm T$ ✓ | $54.0833\,\mu\mathrm T$ ✓ | $1.41421\times10^{-2}\,\mathrm{A\,m^2}$ ✓ |

- **✗\***：`lorentz-force` 的标准答案依次是 $3.13191$、$20.7285$、$4.64067\,\mathrm{cm}$。
  - 我的脚本按题面给的常量算：p1 $m_{\mathrm p}=1.6726\times10^{-27}$、$e=1.6022\times10^{-19}$；p3 $1\,\mathrm u=1.6605\times10^{-27}\,\mathrm{kg}$（题面没给 $e$，取 CODATA）；p4 $m_{\mathrm e}=9.109\times10^{-31}$、$e=1.602\times10^{-19}$。
  - 标准答案的 `value` 用的是 CODATA 的 $m_{\mathrm p}$、$\mathrm u$、$m_{\mathrm e}$、$e$。两边算法都对，差别只在常量（小问题 1）。
- **选择题**：逐项用例子核对，例子写在脚本的 `notes` 里。
  - `current-density` p2：
    - C：球里 $\rho$ 均匀增加时 $\vb J=-\frac{\dot\rho}3\vb r$，小立方体的净通量数值积分为负，即净电流向里；
    - E：匀强的 $\vb J$ 穿过闭合曲面，净通量为零而 $\vb J$ 处处不为零。
  - `lorentz-force` p2：电子、质子的半径、周期都用龙格-库塔法数值求。D 的反例是速度平行于磁场。
  - `vector-potential` p2：在三个点上用中心差分求每个候选的旋度。C 的旋度是 $-B\uv z$，D 多出 $x$ 分量 $-2$。

## 前置

- 全图 656 节，按 HEAD 和现在的前置各算一遍层级：**变了的 0 节**。9 节的前置都没有多余，没有悬空的 id。
- **四处改动**：
  - **`lorentz-force` 加 `work-energy`**：需要，也是最少的。`:46`、`:48` 的定理用动能定理（动能的变化率等于合力的功率）。原来的链上（`electric-field`、`circular-dynamics`、`cross-product`）没有功。去掉、加上层级都不变。
  - **`magnetic-force-on-currents` 加 `angular-momentum`**：需要，也是最少的。用到它的有三处：
    - `thm-torque`；
    - `:48`「力偶的力矩和对哪一点取无关」；
    - 例 2 的角动量。
    原来的链上没有力矩。`:43`、`:70` 拿电偶极子作对照，`electric-dipole` 不在链上，这只是起名字的由来和类比，推理没用到，不用加。
  - **`ampere-law` 加 `gauss-differential`**：需要，也是最少的。用到它的有：
    - `:29` 的立体角（`gauss-law`）；
    - `:33` 的高斯面（`gauss-applications`）；
    - `:40`「和高斯定律的微分形式的推理一样」；
    - `:42` 的 $\divg\vb E=\frac\rho{\varepsilon_0}$；
    - `:92` 动画的对照。
    一个 `gauss-differential` 把这三节都带上了。只加 `gauss-law` 层级也不变，可这一节直接用到 `gauss-differential`，现在的做法对。
  - **`maxwell-equations`（大纲）去掉 `gauss-differential`**：对，它经由 `induced-electric-field` 到 `ampere-law` 已在链上。
- **链上缺的**（小问题 3）：`ampere-law:42` 用 $\divg(\curl\vb B)=0$ 推出 $\divg\vb J=0$。这个恒等式在 `math.vector-calculus.vector-identities`，不在 `ampere-law` 的链上；链上的 `curl-divergence` 目标里没有它。只是一句旁注，加一个链接即可，不必列为前置。
- **看过、不用改的**：
  - **`current-density` 和 `conductors`**（见「我替你定的」）：
    - 这一节用到 `conductors` 的地方：`:61`、`:119` 拿静电平衡作对照，`:34` 起的「导体」是提前提到的术语（浮窗会注明层级）。
    - `conductors` 是第 19 层，`current-density` 是第 18 层，不在链上。
    - 欧姆定律和电流密度的推理不靠 `conductors` 的定理，所以不加。加上会让 37 节右移一到两层：`current-density` 18→20，`maxwell-equations` 24→26，分析力学 `charged-particle-lagrangian` 26→28……
  - **`dc-circuits:54` 的高斯消元**：`linear-systems` 在链上，不标、括注了英文，对。
  - **积分号下求导**：`current-density:50`、`vector-potential:32` 都链到 `math.analysis.parameter-integrals`，按 `sketch` 的规矩可以不列前置。`vector-potential:32` 缺条件，见小问题 3。
  - **`magnetic-dipole:29` 的格林公式**、**`vector-potential` 的向量微分恒等式**：都在链上（经由 `stokes-theorem`、`potentials`）。
  - **`lorentz-force:68` 的伽利略变换**：`relative-motion` 在链上（经由 `newtons-laws`）。
- **跨领域前置**（都还是 outline），按目标核对：
  - `circular-dynamics`「求…需要的向心力」：`lorentz-force:57` 用的正是 $\frac{mv^2}R$。
  - `work-energy`「会计算变力做的功，并用动能定理求速度」：`lorentz-force:48` 用的是功率形式 $\dv{}{t}\bigl(\frac12mv^2\bigr)=\vb F\cdot\vb v$，`current-density:85` 也用了「力每秒做功 $q\vb E\cdot\vb v$」。目标里没写功率，写那一节时要讲到（写回）。
  - `angular-momentum`「计算质点的角动量和力矩」：`magnetic-force-on-currents:48` 和批次 9 的 `electric-dipole:64` 都用「力偶的力矩和取矩点无关」。这是力矩定义的直接推论，写那一节时点一句即可（写回）。
  - `divergence-theorem`、`stokes-theorem`：`current-density:50`、`ampere-law:40`、`:45`、`vector-potential:54` 用的正是这两个公式。
  - `potentials`「无旋场可以写成梯度、无散场可以写成旋度，并会在简单区域上求出势」：`vector-potential:22`、`:43` 用的就是这两句。
    - p6 进一步用到「旋度为零的场是梯度」只在单连通区域上成立（螺线管外就是反例），参考解答链到了 `potentials`。
    - 目标里的「简单区域」没点明单连通，写那一节时要讲到（写回）。
  - `rc-circuits` ← `math.ode.linear-first-order`（已审）：`:27`、`:43` 的积分因子正是那一节的做法，不标、括注了英文，对。
- **指向这一批的链接**，都接住了：
  - **`coulomb-law:55` 和第 8 题** → `lorentz-force`：
    - `:43` 说两个运动电荷之间还有磁力，约是电力的 $\frac{v^2}{c^2}$ 倍；
    - p7 算了并排运动的两个电子：磁力是吸引的，比值 $\mu_0\varepsilon_0v^2$；
    - p7（2）又和相对论接上。
  - **`conductors:32`** → `current-density:61`：导线接上电池，两端一直有电势差，导线里一直有电场，不是静电平衡。`:119` 的常见误区专门说了这一点。
  - **狭义相对论 `covariant-maxwell:25`** → `current-density#thm-continuity`：都写成 $\pdv\rho t+\divg\vb J=0$。`current-density:41` 还链回了四维电流的定义。
  - **`capacitors` 第 7 题** → `rc-circuits` 例 2：电阻上放出 $\frac{Q_0^2}{4C}$，是开始时能量的一半，和 $R$ 无关；p8 又讨论了 $R\to0$ 时的振荡。
  - **狭义相对论 `field-tensor`、分析力学 `charged-particle-lagrangian`**：
    - 洛伦兹力都是 $q(\vb E+\vb v\times\vb B)$；狭义相对论按它自己的约定把粒子速度写成 $\vb u$。
    - 规范函数都是 $\chi$，方向一致：$\vb A'=\vb A+\nabla\chi$；`field-tensor:82` 的 $A^\mu-\partial^\mu\chi$ 展开也是这样。
    - `vector-potential:47` 的两种选法 $(-By,0,0)$、$\frac B2(-y,x,0)$，和 `charged-particle-lagrangian` 例 2 一字不差。
  - **方位方向单位矢量 $\uv\psi$**：`biot-savart:38` 定义，`ampere-law`、`vector-potential` 照用；`magnetic-dipole` 只用到 $\uv r$、$\uv\theta$。
- **以这一批为前置的 outline 小节**：`faraday-law` ← `ampere-law`、`dc-circuits`；`gauge-potentials` ← `vector-potential`；`magnetization` ← `magnetic-dipole`；`rl-circuits` ← `rc-circuits`。这一批指向它们的链接，见「要写回 plan.md 的」。

## 逐节

### physics.electromagnetism.current-density 电流与欧姆定律

- 讲解、例题都对。
  - 例 1 的 $n\approx8.49\times10^{28}\,\mathrm{m^{-3}}$、$v_{\mathrm d}\approx2.9\times10^{-4}\,\mathrm{m/s}$，例 2 的 $\frac1{2\pi\sigma a}$，都重算过。
  - `:70` 由 $\sigma$ 和 $n$ 得 $\tau\approx2.5\times10^{-14}\,\mathrm s$：重算是 $2.49\times10^{-14}\,\mathrm s$。
  - 连续性方程的证明写明了积分号下求导的条件（$V$ 固定、$\pdv\rho t$ 连续）。
- 几何图像核过，网格是共轭调和函数（见「几何图像」）。
- p5（电荷弛豫）、p6（铜铁接头）都对。p6 的界面电荷是 $7.37\times10^{-19}\,\mathrm C\approx4.6e$。
- 小问题 3：p5 的 $\tau$ 和讲解 `:68` 的 $\tau$ 撞了。

### physics.electromagnetism.dc-circuits 电动势与直流电路

- 讲解、例题都对。
  - `thm-terminal` 的证明里，$\int_-^+\vb E_{\mathrm s}\cdot\dd\vb l=\varphi_--\varphi_+$，符号对。
  - 例 2 的 $I\approx0.704\,\mathrm A$、$I_1\approx0.913\,\mathrm A$、$I_2\approx-0.209\,\mathrm A$ 都重算过。
- p5、p6 都对：$R_\infty=\frac{1+\sqrt5}2R$、每节衰减到 $0.382$ 倍；立方体体对角线 $\frac56R$、棱 $\frac7{12}R$。
- 小问题 1：p8 参考解答的数。小问题 2：`:25`「非静电力」没括注英文。

### physics.electromagnetism.rc-circuits RC 电路

- 讲解、例题都对。
  - 例 1：$C\approx5.0\,\mu\mathrm F$。
  - 例 2：电荷之差按 $\frac{RC}2$ 衰减，热量 $\frac{Q_0^2}{4C}$。
- p5（漏电电容器 $RC=\frac{\varepsilon_0}\sigma$，任意形状）、p6（分 $N$ 步充电放热 $\frac{C\mathcal E^2}{2N}$）都对。
- 小问题 2：`:88` 的「内阻」。

### physics.electromagnetism.lorentz-force 磁场与洛伦兹力

- 讲解、例题都对。
  - `:55` 回旋运动的解 $v_x=v\cos\omega t$、$v_y=-v\sin\omega t$ 代回方程成立；$q>0$ 时从磁场指向的一侧看是顺时针，对。
  - 交叉场的证明里 $(\vb E\times\vb B)\times\vb B=-B^2\vb E$ 对。
  - 例 1：$1.14\,\mathrm{cm}$、$2.80\times10^7\,\mathrm{Hz}$。
- p5（从静止出发的摆线，最高 $\frac{2mE}{qB^2}$、速率 $\frac{2E}B$）、p6（$26.9\,\mathrm{MeV}$、$22.9\,\mathrm{MHz}$、$\gamma\approx1.029$）都对。
- 小问题 1：三题的常量。小问题 2：`:29`「磁共振成像」只括注了缩写 MRI。小问题 3：左图的说明。

### physics.electromagnetism.magnetic-force-on-currents 电流受到的磁力

- 讲解、例题都对。
  - `:48` 矩形线圈的证明核过：$a$ 边的力沿转轴、在同一条直线上，$b$ 边的力臂是 $a\sin\theta$。
  - 例 2：$\vb m=-\frac{e}{2m_{\mathrm e}}\vb L$；玻尔磁子 $9.274\times10^{-24}\,\mathrm{J/T}$。
- p5：$m=\frac14Q\omega R^2$，$L=\frac12M\omega R^2$。p6：平均力矩 $\frac2\pi NIabB$，功率约 $80\,\mathrm W$。p7：霍尔电场把力传给晶格。都对。
- 小问题 2：「地磁场」「电流环」，`:29`「晶格」、`:43`「矢量面积」没括注英文。小问题 3：`:60` 的「大小」，p8 的 $\varphi$。

### physics.electromagnetism.biot-savart 毕奥-萨伐尔定律

- 讲解、例题都对，没有要改的。
  - 直导线的换元 $z'=s\tan\alpha$ 核过。
  - 远处 $\frac{\mu_0IR^2}{2z^3}=\frac{\mu_0}{4\pi}\frac{2m}{z^3}$。
  - 例 1：$\frac{\mu_0I}{4R}\bigl(1+\frac2\pi\bigr)$。
  - 例 2：原子核处 $12.5\,\mathrm T$。
- p5（亥姆霍兹 $d=R$，$B(0)=\bigl(\frac45\bigr)^{3/2}\frac{\mu_0NI}R$）、p6（有限长螺线管 $\frac{\mu_0nI}2(\cos\theta_2-\cos\theta_1)$）都对。
- `:27`「$\mu_0$ 和 $4\pi\times10^{-7}$ 相差不到一百亿分之二」：CODATA 2022 的相对差是 $1.3\times10^{-10}$，对。

### physics.electromagnetism.ampere-law 安培环路定理

- 讲解、例题都对。
  - 散度为零的证明（`:40`）核过。
  - 螺线管、螺绕环、粗导线的推导都对。
  - 例 2 平面电流两侧的方向（上方 $-y$、下方 $+y$）对。
- 立体角那一步：思路对，正负没说清（小问题 3，写法见汇总）。
- p5：螺旋绕组沿轴的净电流，管外磁场和管内之比 $\frac1{2\pi ns}\approx0.008$。p6：$\vb J=\frac{3ks}{\mu_0}\uv z$、总电流 $\frac{2\pi ka^3}{\mu_0}$。都对。
- p7 参考解答前面叫「套数」，后面叫「环绕数」（linking number）。可以统一成「环绕数」，不算问题。
- 小问题 2：`:33` 锚点，`:16`、`:38`「微分方程」，`:33`「位移电流」、`:50`「磁荷」没括注英文。小问题 3：`:42` 的链接。

### physics.electromagnetism.vector-potential 磁矢势

- 讲解、例题都对。
  - 积分公式的旋度、散度两步核过。
  - 例 1：$\curl(g\uv z)=-g'(s)\uv\psi$，$\vb A=-\frac{\mu_0I}{2\pi}\ln\frac s{s_0}\uv z$。
  - 例 2：管内 $\frac{B_0s}2$、管外 $\frac{B_0R^2}{2s}$。
- p5：库仑规范的磁矢势相差调和函数的梯度；有界的调和函数是常数。p6：$\chi=\frac\Phi{2\pi}\psi$ 多值、管外不单连通。都对。
- 小问题 1：p2 的选项，p7 的「磁通量子」。小问题 2：`:45` 锚点，`:27`、`:47`「拉格朗日量」。小问题 3：`:32` 的条件，`:79` 的「彼此相差」。

### physics.electromagnetism.magnetic-dipole 磁偶极子

- 讲解、例题都对。
  - 恒等式 $\oint(\vb c\cdot\vb r')\,\dd\vb l'=\vb a\times\vb c$ 的格林公式证明，三个分量核过。
  - 磁场的三个分量（$\frac{3xz}{r^5}$、$\frac{3yz}{r^5}$、$\frac{3z^2-r^2}{r^5}$）核过。
  - 例 1：$7.8\times10^{22}\,\mathrm{A\,m^2}$，两极 $6.0\times10^{-5}\,\mathrm T$。
  - 例 2：$0.716$、$0.943$、$0.985$。
- p5：转动球壳 $m=\frac{4\pi}3\sigma\omega R^4$，球心 $\frac23\mu_0\sigma\omega R$；球内磁场的平均值 $\frac{\mu_0}{4\pi}\frac{2\vb m}{R^3}$，电偶极子是 $-\frac1{4\pi\varepsilon_0}\frac{\vb p}{R^3}$。p6：同轴磁偶极子之间的力 $\frac{3\mu_0m_1m_2}{2\pi z^4}$，吸引，$0.096\,\mathrm N$。都对。
- 小问题 2：「地磁场」「电流环」，`:34`「矢量面积」，`:49`「磁荷」，`:51`「超精细结构」「自旋」。小问题 3：`:53` 的条件。

## 小问题 1 · 题目（汇总）

1. **`lorentz-force` p1、p3、p4 的标准答案没用题面给的常量。**
   - `problems.yaml:7`、`:58`、`:80` 的 `value` 用 $1.67262192595\times10^{-27}$、$1.66053906892\times10^{-27}$、$9.1093837139\times10^{-31}$、$1.602176634\times10^{-19}$。
   - 题面给的是 $1.6726\times10^{-27}$、$1.6605\times10^{-27}$、$9.109\times10^{-31}$、$1.6022\times10^{-19}$ 或 $1.602\times10^{-19}$。
   - 提示、解答里代的又是题面的值，三处说法不一。判题不受影响，但 `npm run verify` 按 $10^{-6}$ 比对，这 3 题一直报 ✗。
   - 改法：`value` 照题面的常量写。p3 的题面没给 $e$，提示、解答用的是 $1.6022\times10^{-19}$，题面补上「$e=1.6022\times10^{-19}\,\mathrm C$」（和 p1 一样）。
   - 改好以后我按题面的值更新 p3 的验算脚本（现在取的是 CODATA 的 $e$）。
2. **`vector-potential` p2 的选项 A、B 照搬了判过的例子。**
   - B $\bigl(-\frac{By}2,\frac{Bx}2,0\bigr)$ 就是 `:47` 的 $\vb A_2$，讲解已判过「旋度都是 $B\uv z$」。
   - A $(0,Bx,0)$ 是动画那一族 $B\bigl(-(1-a)y,ax,0\bigr)$ 在 $a=1$ 时的样子，`:79` 也说了这一族给出同一个磁场。
   - 按「选项不要照搬讲解、例题里已经判过的例子」，换成要多想一步的。例如对的 $(-By+y^2,\ 2xy,\ 0)$（差 $\nabla(xy^2)$），错的 $(Bx,\ By,\ 0)$（旋度为零）。
3. **`dc-circuits` p8 参考解答的数不对**（`problems.yaml:152`）。
   - $E\approx0.017\,\mathrm{V/m}$，一米导线上的电势差约 $0.017\,\mathrm V$，是「两百分之一伏」（$0.005\,\mathrm V$）的 3 倍多。
   - 改成「约五十分之一伏」或「不到百分之二伏」。网页上不显示参考解答，可它是给 Claude 批改用的。
4. **`vector-potential` p7 参考解答「这个量叫作磁通量子」**（`problems.yaml:146`）。
   - $\frac he\approx4.14\times10^{-15}\,\mathrm{Wb}$ 在介观物理里常叫单电子的磁通量子。
   - CODATA、超导里通称的磁通量子是 $\Phi_0=\frac h{2e}\approx2.07\times10^{-15}\,\mathrm{Wb}$（载流子是电子对）。同一段下面就讲到超导体，容易混。
   - 改成「这个量是单个电子的磁通量子；超导体里载流子是电子对，磁通量子是 $\frac h{2e}$」，或者不提名字。

## 小问题 2 · 术语（汇总）

1. **起名的段落没加锚点**（「给新概念起名的段落…要加锚点」）。
   - `ampere-law:33`「……叫作安培回路（Amperian loop）」。
   - `vector-potential:45`「……叫作规范自由度（gauge freedom）」「……叫作库仑规范（Coulomb gauge）」。
   - 你说这两个词只加锚点，可这两段前面都没有 `::anchor`；页面上的定义卡片数也只等于已有的锚点数。各补一个，例如 `def-amperian-loop`、`def-gauge-freedom`（库仑规范在同一段，一个锚点即可）。
   - **「矢量面积」**：`magnetic-dipole:34` 起名（$\frac12\oint\vb r'\times\dd\vb l'$），在「为什么这样定义」那段的边界情况里，没有锚点；`magnetic-force-on-currents:43` 又提前用了这个词。两节用到。两种改法：
     - 推荐：把 `magnetic-dipole:34` 那一句单独成段、加锚点，括注 vector area；`magnetic-force-on-currents:43` 改成「线圈不在一个平面上时怎样推广，留到磁偶极子一节讲」，不用这个词。
     - 或者进术语表，两节都标。
2. **复合词里单独标了短术语**（f05d9a9 写回的查法正好查得出）。
   - **「地磁场」**拆成「地」加带标记的「磁场」：`magnetic-force-on-currents:38`、`magnetic-dipole:86`。地磁场就是磁场，按复合词的规矩整个词标（和「静电场」的定法一样）。
   - **「电流环」**里标了「电流」：`magnetic-dipole:16`、`:49`、`:59`、`:94`、`:102`，`magnetic-force-on-currents:99`。
     - 电流环是一个环，不是电流，按「术语名是更长的词的一部分时，不算这个术语出现」，这几处不标。
     - `magnetic-dipole:16` 现在写成「小电流（electric current）环」，英文插在词中间。改成「小电流环（current loop）」。
     - 这和把「电流计」改成「检流计」是同一个道理。
3. **`rc-circuits:88` 的「内阻」**：标成了 `internal-resistance`，可那是电压表的内阻。术语表的简介是「电源内部的电阻 $r$；电源输出电流 $I$ 时……」，同名不同义，不标；或改写成「电阻为 $1.0\,\mathrm{M\Omega}$ 的电压表」。
4. **规矩 C**：
   - `vector-potential:27`、`:47` 的「拉格朗日量」：定义在分析力学 `lagrange-equations`，不在链上，都是「以后会讲」的旁白。各块第一次出现标 `physics.analytical-mechanics.lagrangian`。
   - `ampere-law:16`（「这一节要回答的问题」）、`:38`（定理的标签里）的「微分方程」：定义在常微分方程 `what-is-ode`，不在链上。批次 10 的「常微分方程」也是这样处理的。可以标 `math.ode.differential-equation`，或者改说法（如「静磁场满足的方程」「微分形式」）。
5. **新名词第一次出现没括注英文**：
   - `dc-circuits:25` 非静电力（non-electrostatic force）；
   - `magnetic-force-on-currents:29` 晶格（lattice，`current-density` 里括注了，这一节没有）、`:43` 矢量面积（vector area）、`:64` 能带理论（band theory）；
   - `ampere-law:33` 位移电流（displacement current）、`:50` 磁荷（magnetic charge）；
   - `magnetic-dipole:34` 矢量面积、`:49` 磁荷、`:51` 超精细结构（hyperfine structure）和自旋（spin）；
   - `lorentz-force:29` 磁共振成像只括注了缩写，补全称 magnetic resonance imaging。
6. **「霍尔效应」的简介**：「两侧出现电势差 $\frac{IB}{nqt}$」里的 $t$ 没交代，浮窗里读者不知道是什么。加「（$t$ 是沿磁场方向的厚度）」，53 字。

## 小问题 3 · 说法、公式和记号（汇总）

1. **`ampere-law:29` 立体角的正负**。这一处也回答你问的「窄带」那一步。
   - 现在写「正负按电流方向用右手定则定」，没说哪一侧为正。
   - 按 $\vb B=\frac{\mu_0I}{4\pi}\nabla\Omega$，必须是场点在拇指所指的一侧时 $\Omega$ 为负。用圆线圈的轴核对：上方 $\Omega=-2\pi\bigl(1-\frac z{\sqrt{z^2+R^2}}\bigr)$，$\dv\Omega z=\frac{2\pi R^2}{(z^2+R^2)^{3/2}}$，乘 $\frac{\mu_0I}{4\pi}$ 正是轴线上的磁场。
   - 反过来按「拇指那一侧为正」，式子要写成 $\vb B=-\frac{\mu_0I}{4\pi}\nabla\Omega$。
   - 「窄带」那一步思路对，可以一行写出来，顺便把正负定死。建议改成：
     - 「取 $\Omega(\vb r)=\int_S\frac{(\vb r'-\vb r)\cdot\dd\vb a'}{|\vb r'-\vb r|^3}$，$\dd\vb a'$ 的方向和电流按右手定则对应，场点在拇指所指的一侧时 $\Omega$ 为负。」
     - 「窄带上的一小块是 $\dd\vb l'\times\delta\vb r$，它对场点张的立体角是 $\frac{(\vb r'-\vb r)\cdot(\dd\vb l'\times\delta\vb r)}{|\vb r'-\vb r|^3}=\delta\vb r\cdot\frac{\dd\vb l'\times(\vb r-\vb r')}{|\vb r-\vb r'|^3}$（混合积轮换），沿环加起来正是 $\frac{4\pi}{\mu_0I}\vb B\cdot\delta\vb r$。」
   - 这个符号我另外用斯托克斯公式推过一遍，一致。`vector-potential` p8 的 $\Phi_{\mathrm M}=-\frac{I\Omega}{4\pi}$ 用的也是这个约定，改了以后两处对得上。
2. **`magnetic-dipole:53`「在不均匀的磁场里还受合力，被拉向磁场强的地方」**：力是 $\nabla(\vb m\cdot\vb B)$，磁矩和磁场反向时被推向磁场弱的地方。加上「磁矩和磁场同向时」。p6 的情形正是同向。
3. **两处推理的出处**：
   - `vector-potential:32`「旋度可以移进积分号（积分号下求导）」没写条件（`sketch` 的规矩要写明条件、说明这里满足）。场点在电流里面时被积函数有奇点。建议写成「场点在电流外面时被积函数光滑，可以移进积分号；在电流里面时奇点可积，结论仍然成立，这里不证」。
   - `ampere-law:42` 的 $\divg(\curl\vb B)=0$ 不在链上，加一个链接到 [向量微分恒等式](lesson:math.vector-calculus.vector-identities)。
4. **记号撞车**：
   - `current-density` p5 用 $\tau=\frac{\varepsilon_0}\sigma$，同一节讲解 `:68`、`:70` 的 $\tau$ 是德鲁德的碰撞时间。p5（2）正好要拿两者比较，提示 3 写「铜的 $\tau\approx1.5\times10^{-19}\,\mathrm s$，比两次碰撞之间的时间 $2.5\times10^{-14}\,\mathrm s$ 短得多」，读者容易看错。p5 改用 $\tau_\rho$，或直接写「时间常数 $\frac{\varepsilon_0}\sigma$」。
   - `magnetic-force-on-currents` p8 用 $\varphi$ 表示指针的偏转角（`problems.yaml:147`、`:151`）。本领域约定 $\varphi$ 是电势，换一个字母，如 $\alpha$。
5. **三处措辞**：
   - `magnetic-force-on-currents:60` 霍尔效应「电势差，大小是 $\frac{IB}{nqt}$；它的正负取决于……$q$ 的正负」：「大小」带了正负。改成「大小是 $\frac{IB}{n|q|t}$」，或者去掉「大小」。
   - `lorentz-force:76`「正电荷和负电荷以同样的速率运动」：图上两个圆一样大，没说两者质量、电荷大小相同，容易让人以为电子、质子同速时半径一样（正是 p2 选项 A 考的）。补上「（质量和电荷的大小都相同）」。
   - `vector-potential:79`「彼此相差 $\nabla\bigl(\frac{(2a-1)B}2xy\bigr)$」：这是和 $a=\frac12$ 的对称形式之差。改成「和 $a=\frac12$ 的对称形式相差……」，或写成两个参数 $a$、$a'$ 之差 $\nabla\bigl((a-a')Bxy\bigr)$。

## 记号与约定

- 这一批的新记号 9 节一致：电导率 $\sigma$、电动势 $\mathcal E$、内阻 $r$、回旋频率 $f_{\mathrm c}$、角频率 $\omega_{\mathrm c}$、磁矩 $\vb m$、面电流密度 $\vb K$、方位方向 $\uv\psi$、规范函数 $\chi$、磁通量 $\Phi$。
- **$\sigma$**：静电各节是面电荷密度，这一批起又是电导率。9 节里没有一节两种都用（`magnetic-dipole` p5 的 $\sigma$ 是面电荷密度，这一节不用电导率），可以。以后同时讲导体表面电荷和电导率的小节（趋肤效应、导体中的电磁波）要区分（写回）。
- **$R$**：既是电阻（`dc-circuits`、`rc-circuits`），也是半径（`lorentz-force` 的回旋半径、`biot-savart` 的线圈半径）。没有一节两种都用，可以。
- **$m$**：既是质量也是磁矩。`magnetic-force-on-currents` 例 2 用 $m_{\mathrm e}$ 表示电子质量，p5 用 $M$ 表示圆盘质量，避开了，好。
- **静电场、静磁场**：按你定的整个词标：`dc-circuits:16`、`:45`，`ampere-law:38`、`:42`，`vector-potential:16`。「面电流密度」整个词标成「电流密度」（`ampere-law:106`），术语表的简介也包括了 $\vb K$，对。
- 「倍」的写法 9 节都是「是……的 N 倍」「变成原来的 N 倍」。

## 格式、术语、证明深度、难度档

- 固定结构、二级标题都对；段落都不超过 4 句；中英文空格、引号没问题。
- 证明深度是 `sketch`，各定理都给了证明思路。`ampere-law:40`「和高斯定律的微分形式的推理一样」链到的正是同一个道理（任意小的曲面、被积函数连续）。
- 难度档合适。简单题都是一个公式一两步，中等题要组合，难题要完整推理，思考题问条件和联系。
- 一句话总结都不超过 30 字（构建查过）。
- **页面**（768 宽，9 节加 `conductors`，难题、思考题点到第 3 级提示，简单题、中等题点「放弃」看解答）：
  - 都不左右滚动，KaTeX 错误为 0。
  - 定义卡片数等于讲解里的锚点数：9、5、4、6、6、4、7、4、3。
  - 最宽的行内公式是 `magnetic-dipole` p3 解答里那一条（紧贴句号、整条不折行），620 像素，所在的框 641 像素，还放得下。
  - `conductors:32` 的「电流」显示成术语。

## 几何图像

8 张 SVG 都按注释里的设定反算，用脚本逐段核对；文字在页面上用 `getBBox()` 量过，7 张有文字的都不出界、不重叠、不压线（`solenoid.svg` 没有文字）。

- **`current-neck.svg`**（细颈导体薄片）：
  - 边界和半宽 $1-0.65e^{-x^2/0.6}$ 最多差 0.05 像素。
  - 9 条电流线和 19 条等势线有 171 个交点，都是直角，最多差 3.6°。
  - 164 格网格的长宽比在 2.45 到 2.63 之间（5% 到 95% 分位是 2.46 到 2.54）。共轭调和函数组成的网格各格长宽比应当相同，所以这两组线确实是同一个解的流函数和电势，「相邻两条之间的电流都是总电流的十分之一」「相邻两条的电势差相等」都对。
  - 两端电流线等距（16 像素）。
- **`potential-loop.svg`**：按 $\mathcal E=1$、$r=0.25$、$R=0.75$ 核对。
  - 电势经过电源升 130 像素，内阻上降 32.5 像素，外电阻上降 97.5 像素。
  - 电池符号长线为正，电流箭头沿顺时针。都对。
- **`orbits.svg`**：
  - 右图 4 条轨道和解析解 $x=t+(v_0-1)\sin t$、$y=(1-v_0)(1-\cos t)$（$q/m=B=E=1$）比，两个周期里最多差 0.06 像素。
  - 左图两个圆半径都是 58 像素，圆心在起点下方，正电荷顺时针、负电荷逆时针，受力向下（$\uv x\times\uv z=-\uv y$）。都对。
  - 说明见小问题 3（质量相同）。
- **`coil-torque.svg`**：
  - 磁矩和磁场成 50°，和线圈垂直。
  - 左上的边电流向外，受力 $I\vb L\times\vb B$ 向上；右下的向里，受力向下。
  - 力矩使 $\vb m$ 顺时针转向 $\vb B$；由电流方向算出的磁矩方向和图上的一致。
- **`biot-savart.svg`**：
  - 左图 $\dd\vb l'\times(\vb r-\vb r')$ 垂直纸面向里，对。
  - 右图 20 条磁场线和数值积分的圆线圈磁场最多差 3.1°，箭头最多差 6.7°。每条线上的磁通函数 $\rho A_\varphi$ 相对变化不到 0.5%，左右成对。
  - 出框的线：$\Psi=0.070$、$0.102$ 两对从右（左）边出去又回来；最外两对（$0.019$、$0.041$）从上下边出去后，回来的部分整个在框外（$z=0$ 处约在 $13R$、$6R$），不用画回来。
- **`solenoid.svg`**：
  - 20 匝在 $z=-1.9,\dots,1.9$。10 条线和 20 个线圈叠加的磁场最多差 2.4°，箭头最多差 0.6°，磁通函数沿线变化不到 2%。
  - 管内 5 条线的磁通函数是 $0.04k^2$（$k=1,\dots,5$），在均匀磁场里正好等距。
  - 外圈的线从上边出去又回来；上排电流向外、管内磁场向右，对。
- **`solenoid-A.svg`**：
  - 24 个箭头的长度和 $\frac{A}{B_0R/2}\cdot42$ 像素最多差 0.11 像素，方向和逆时针切向最多差 0.17°。
  - 右图 $A_\psi$ 曲线和 $\frac s2$、$\frac1{2s}$ 最多差 0.11 像素。
- **`dipoles.svg`**：
  - 左图 10 条磁场线和数值积分的磁场最多差 3.2°，磁通函数沿线变化不到 3%。7 个箭头都画成竖直的，其中 4 个所在处的磁场偏开约 10°；箭头只有 7 像素长，看不出来。
  - 右图 8 条电场线最多差 4.0°。出框的线成对：同一个流函数值 $\cos\theta_+-\cos\theta_-$ 在上下、左右各出现一次，出去又回来。
  - 另有一个零长度的 `<path d="M 174.1 196.0 L 174.1 196.0">`（生成脚本的残留），看不见，可以删。
- **动画**（8 个，滑块都拖到两端、截图看过）：
  - `dc-circuits`：$r=0.2$ 时功率峰 $1.25$ 在 $R=0.2$，$r=2$ 时峰 $0.125$，都在 $y\le1.4$ 的范围里。
  - `rc-circuits`：切线在 $t=\tau$ 处到 1，$\tau=0.5$、$2.5$ 都对。
  - `magnetic-force-on-currents`：力矩 $-\sin\theta$、势能 $-\cos\theta$，没有滑块。
  - `biot-savart`：
    - 两根导线：$k=1$ 时中间有零点，$k=-1$ 时中间加强、远处抵消。
    - 亥姆霍兹：$d=0.5$ 中间一个峰，$d=2$ 中间凹下，$d=1$ 中间平。
  - `ampere-law`：$R=0.5$、$2$ 两端，导线内匀速转、导线外按 $\frac1s$ 减弱。
  - `vector-potential`：$a=0$ 时水平、上下两半相反，$a=1$ 时竖直。
  - `magnetic-dipole`：$R=0.25$ 时两条曲线几乎重合，$R=1.5$ 时近处偏离大。
  - 画面都不泄露简单题、中等题的答案。`vector-potential` 的动画和讲解 `:47` 判过 p2 的两个选项，这是题目的问题（小问题 1）。

## 史实和数字

- 伏打电堆 1800 年、欧姆 1827 年的书、德鲁德 1900 年、焦耳 1841 年、基尔霍夫 1845 年还是学生、霍尔 1879 年在金箔里发现（约翰斯·霍普金斯大学研究生）：都对。
- 克里斯蒂 1833 年、惠斯通 1843 年的电桥，奥斯特 1820 年 7 月，阿拉戈 9 月 11 日在巴黎科学院演示，毕奥和萨伐尔 10 月 30 日：都对。
- 亥维赛 1889 年、洛伦兹 1895 年：和通行的说法一致（洛伦兹 1892 年已有雏形）。麦克斯韦 1850 年代写出积分形式（1855 到 1856 年《论法拉第力线》）：对。
- 汤姆孙 1897 年用速度选择器测荷质比，托尔曼和斯图尔特 1916 年的转动线圈实验，昂内斯 1911 年汞在 4.2 K 超导：都对。
- 劳伦斯和利文斯顿 1932 年把质子加速到 1.22 MeV：对（伯克利 11 英寸回旋加速器）。
- 阿哈罗诺夫和玻姆 1959 年，外村彰等 1986 年用超导体包住环形磁体、电子全息：都对。
- 1948 到 2019 年用平行导线定义安培，2019 年起规定 $e$ 的值：对。
- **你列的几条**：
  - 狄拉克 1931 年（Proc. R. Soc. A 133）、吉尔伯特 1600 年《论磁》：对。
  - 安培的分子电流：1820 年代提出，对。
  - 超精细结构支持电流环：Jackson 有专门的报告讨论 21 厘米谱线说明磁偶极子是电流环而不是一对磁荷（J. D. Jackson, *The Nature of Intrinsic Magnetic Dipole Moments*, CERN 77-17, 1977）。电流环的偶极场带 $+\frac{2\mu_0}3\vb m\,\delta^3(\vb r)$，正是 s 态超精细分裂的主要来源。我只看到报告的题录和别处的引用，没读全文。
  - 偶极轴偏离地轴约十度：按 IGRF-13（2020.0）的 $g_1^0=-29404.8$、$g_1^1=-1450.9$、$h_1^1=4652.5\,\mathrm{nT}$ 算，是 9.4°到 9.5°，对。
  - 赤道上偶极部分 $3.0\times10^{-5}\,\mathrm T$：同一组系数 $B_0\approx29\,800\,\mathrm{nT}$，对。地球半径取 $6.37\times10^6\,\mathrm m$ 时偶极矩 $7.7\times10^{22}\,\mathrm{A\,m^2}$，和例 1 一致。
  - 金属里多余电荷约 $10^{-14}\,\mathrm s$ 量级散开：
    - 我按带惯性的德鲁德模型核对：$\ddot\rho+\frac{\dot\rho}{\tau}+\omega_{\mathrm p}^2\rho=0$，铜的 $\omega_{\mathrm p}\approx1.6\times10^{16}\,\mathrm s^{-1}$，$\omega_{\mathrm p}\tau\approx400$。电荷密度按等离子体频率振荡，振幅在 $2\tau\approx5\times10^{-14}\,\mathrm s$ 内衰减。
    - 「$10^{-14}\,\mathrm s$ 量级」对；「$\frac{\varepsilon_0}\sigma$ 对良导体不成立」也是教科书里常见的说法。
  - 铁的电导率 $1.0\times10^7\,\mathrm{S/m}$：$20\,^\circ\mathrm C$ 时电阻率约 $9.7\times10^{-8}\,\Omega\,\mathrm m$，对。
- 别的数：
  - 铜 $5.96\times10^7\,\mathrm{S/m}$、电子费米速率 $1.6\times10^6\,\mathrm{m/s}$、地面磁场 25 到 $65\,\mu\mathrm T$、核磁共振 1.5 T 和 3 T、玻尔磁子、氢原子里电子在核处的磁场 $12.5\,\mathrm T$、地核半径约为地球的一半多：都对。
  - 来源：IGRF-13 的系数（NOAA [igrf.html](https://www.ngdc.noaa.gov/IAGA/vmod/igrf.html)）；回旋加速器（LBL [81fchp2](https://www2.lbl.gov/Science-Articles/Research-Review/Magazine/1981/81fchp2.html)）；Jackson 的报告（CERN 77-17 题录 [cern-118393](https://ebusca.uv.mx/Record/cern-118393/Details)）；德鲁德估算是我自己算的。

## 我替你定的（都能改）

1. **`current-density` 不加 `conductors` 前置。** 这一节只拿静电平衡作对照（`:61`、`:119`），「导体」是提前提到的术语；加上会让 37 节右移一到两层。
2. **「位移电流」这一批先不进术语表。** 它的定义小节 `maxwell-equations` 还是 outline，进表会多一条构建警告，以前没有先例。等下一批写到那一节时再进、补标（写回）。
3. **`lorentz-force` 的验算脚本按题面给的常量算**，所以标准答案改好以前，`npm run verify` 对这 3 题报 ✗。复核时按题面补的 $e$ 更新 p3。
4. **「电流环」按「更长的词」处理**，里面的「电流」不标。理由和「电流计」改「检流计」一样。
5. **几处措辞不算问题，没列进小问题**：
   - `ampere-law` p7 的「套数」「环绕数」两种叫法；
   - `magnetic-dipole` p5 参考解答「从两极处和外面连起来」：其实球面上处处和外面的线相接，只是参考解答，不显示。

## 要用户决定的

无。

## 要写回 plan.md 的

1. **题目与判题**（批次 11 审查时提的）：题面给了常量时，标准答案按题面给的值算；题面没给的，才用 CODATA。`npm run verify` 按 $10^{-6}$ 比对，两者不一会一直报不一致（`lorentz-force` p1、p3、p4）。
2. **术语规范**，复合词那一条补两个例子（批次 11 审查时提的）：
   - 「地磁场」整个词标成「磁场」（同「静电场」）；
   - 「电流环」「电流计」这类意思不是那个术语的长词，里面的短术语不标（写内容会话把「电流计」改成「检流计」，同一个道理）。
3. **给以后写牛顿力学的会话留的话**（批次 11 审查时提的）：
   - `work-energy` 要讲到力的功率 $P=\vb F\cdot\vb v$ 和 $\dv Kt=\vb F\cdot\vb v$：电磁学 `lorentz-force:48`（磁力不做功）、`current-density:85`（焦耳热）用了。
   - `angular-momentum` 要讲到力偶的力矩和取矩点无关：电磁学 `electric-dipole:64`、`magnetic-force-on-currents:48` 用了。
4. **给以后写多变量微积分的会话留的话**（批次 11 审查时提的）：`potentials` 要讲清「旋度为零的场是梯度」只在单连通区域上成立。电磁学 `vector-potential` p6 用了，螺线管外的 $\frac{\Phi}{2\pi s}\uv\psi$ 就是反例。
5. **给以后写电磁学的会话留的话**（这一批的讲解、题目指向以后几节，写的时候要接得住；批次 11 审查时提的）：
   - `maxwell-equations`：
     - 「位移电流」进术语表，补标 `gauss-law:47`、`ampere-law:33`（`rc-circuits` p7 是题目文字，可标可不标）；
     - `ampere-law:33` 充电电容器的矛盾、`rc-circuits` p7 的 $\varepsilon_0A\dv Et=I$ 要接上。
   - `faraday-law`：
     - `dc-circuits:22`：发电机里推动电荷的是磁力；
     - `dc-circuits:47`：有变化的磁场时回路定律要改写；
     - `ampere-law:47`：穿过同一条闭合曲线的磁通量和曲面无关，讲电磁感应要用；
     - `magnetic-force-on-currents` p6：电动机里的反向感应电动势；
     - `biot-savart` p8：双绞线里感应的干扰互相抵消。
   - `inductance`：`rc-circuits` p8，电路的电感使两个电容器之间的电荷来回振荡。
   - `ac-circuits`：`dc-circuits` p7，交流电用变压器升压、降压。
   - `em-waves`：`biot-savart:27`，$\mu_0\varepsilon_0=\frac1{c^2}$。
   - `lienard-wiechert`：`biot-savart:31`，运动点电荷磁场的精确公式，低速时要回到 $\frac{\mu_0}{4\pi}\frac{q\vb v\times(\vb r-\vb r')}{|\vb r-\vb r'|^3}$。
   - `poynting-theorem`：`current-density` p8，能量由导线周围的电磁场从电池送到灯泡。
   - `gauge-potentials`：「库仑规范」那时第二节用到，进术语表，补标 `vector-potential:45`。
   - 同时讲导体表面电荷和电导率的小节（`skin-effect`、导体中的电磁波）：$\sigma$ 两用，要区分。

## 没验证的地方

- 手机宽度、iPad、Safari 没测。最紧的是 `magnetic-dipole` p3 解答里的行内公式，占所在框的 97%（620/641 像素），换字体渲染时可能溢出。
- 页面是在暗色主题下看的（面板跟应用主题）。亮色主题没逐个看：这一批的 SVG 都用 `currentColor` 和页面变量，和以前一样。
- 动画的帧率没看，只看了滑块两端的画面。
- 「超精细结构支持电流环」只核对了 Jackson 报告的题录和别处的引用，没读报告全文。
- 别的领域已审小节里链外用到这批新术语的地方（规矩 C），你说在查，初审没管。

## 修订说明（写内容会话）

2026-11-12 · 三条小问题逐条改完，每一类都在这一批里找了一遍同类；协调会话定的「静电场」也改了。改动只在 `content/physics/electromagnetism/` 和这一节，没有提交。

### 小问题 1 · 题目

1. **`lorentz-force` p1、p3、p4**：`value` 改用题面的常量；p3 把「$e=1.6022\times10^{-19}\,\mathrm C$」写进题面开头的括号（没另起一句，免得这段变成 5 句）。答案是 $3.13182$、$20.7277$、$4.64098\,\mathrm{cm}$，三位有效数字不变。
   - 同类：其余 8 节的数值题逐个对过题面给的常量（$\mu_0$、$\frac{\mu_0}{4\pi}$ 等），`value` 都按题面写；题面没给 $e$ 的 `current-density` p3、`magnetic-force-on-currents` p3 用 CODATA，合规矩。
2. **`vector-potential` p2**：A 换成对的 $(-By+y^2,\ 2xy,\ 0)$（差 $\nabla(xy^2)$），B 换成错的 $(Bx,\ By,\ 0)$（旋度为零），答案改成 A、E；提示 2、3 和解答跟着改。
   - 同类：`current-density` p2 的 B「细处的电流密度比粗处大」就是几何图像里细颈处判过的说法。改成「细处电子的漂移速度比粗处大」：还是对的，但要把 $J=\frac IA$ 和 $v_{\mathrm d}=\frac{J}{ne}$ 连起来，而 p3 又说「直径用不到」，要多想一步。答案不变。
   - `lorentz-force` p2 的选项没有照搬讲解里判过的例子。
3. **`dc-circuits` p8**：改成「约 $0.017\,\mathrm V$，不到五十分之一伏」。
   - 同类：其余各节难题、思考题的参考解答和讲解里的数逐个重算过，没有别的错。
4. **`vector-potential` p7**：改成「它是单个电子的磁通量子（magnetic flux quantum）；超导体里导电的是成对的电子，通常说的磁通量子是 $\frac h{2e}\approx2.07\times10^{-15}\,\mathrm{Wb}$」。超导体的英文括注挪到这里，（2）里去掉。

### 小问题 2 · 术语

1. **起名的段落加锚点**：`ampere-law` 安培回路那段加 `def-amperian-loop`，原来同一段里的边界情况另起一段，卡片只框起名的那一段；`vector-potential` 规范自由度那段加 `def-gauge-freedom`，库仑规范在同一段。
   - 同类：`naming.py` 这次报出另外 5 处。原先自查脚本里 grep 的字和 `naming.py` 输出的字对不上，一直没报出来，脚本已修。
     - `dc-circuits`「内阻」那段加 `def-internal-resistance`，术语表里 `internal-resistance` 的锚点从 `thm-terminal` 改指它；
     - `dc-circuits`「节点」「回路」那段加 `def-junction-loop`；
     - `lorentz-force`「速度选择器」那段加 `def-velocity-selector`；
     - `magnetic-force-on-currents`「安培力」那句从讲受力机制的段落挪进 `thm-force-current`，括注 Ampère force；
     - `current-density`「叫作非欧姆导体」改说「不满足欧姆定律」，不再起名。
   - `naming.py` 还报了 3 处：「这就是欧姆定律」「中学物理常把磁场部分单独叫作洛伦兹力」「这就是下面定义的出发点」。这几句不是给新概念起名，没改。
   - 交接说明里说「电流线」只加了锚点，其实没加：它在 `current-density` 几何图像的说明里起名，讲解里没有。
     - `ampere-law` 原来也用了两次这个词，按「两节以上用到的名词就进术语表」该进表。
     - 我改了 `ampere-law` 的说法（「电流沿闭合的路径流动」「场点两侧对称的两股电流」），让它只在一节用，不进表。
2. **「矢量面积」**：按推荐的做法。
   - `magnetic-dipole` 那一句单独成段，加 `def-vector-area`，括注 vector area，并说明由来：$\frac12\vb r'\times\dd\vb l'$ 是小三角形的面积矢量。
   - 原段落的边界情况换成「离回路不够远时，展开里更高阶的项不能忽略（例 2）」。
   - `magnetic-force-on-currents:43` 改成「线圈不在一个平面上时，没有确定的线圈平面，$\vb a$ 怎样取留到[磁偶极子](…#def-vector-area)一节讲」，不用这个词。
   - 所以只在一节用，不进术语表。
3. **复合词**：
   - 「地磁场」2 处整个词标；
   - 「电流环」6 处不标；`magnetic-dipole:16` 写成「小电流环（current loop）」，本节第一次单独出现的「电流」（`:22`）补括注 electric current。
   - 拿掉「电流环」的标记以后，两块里「电流」第一次出现的位置变了，补标两处：
     - `magnetic-force-on-currents` 例 2 写成「小电流环：:term[电流]是每秒…」；
     - `magnetic-dipole`「和电偶极子的不同」那一块的「环形电流」意思就是电流，整个词标。
   - 同类：`compound_scan.py` 扫了全领域，只剩 `conductors`「表面电场」的已知误报。「匀强电场」「匀强磁场」按形容词加名词处理，和已审的 `polarization:63` 一致，没改。
   - `check-terms` 现在对「电流环」报 5 处「未标记」、1 处「没括注英文」，`magnetic-force-on-currents` 例 2 再报 1 处「未标记」。都是脚本把「电流环」当成「电流」，按这次的定法是误报。
4. **`rc-circuits:88`**：改写成「:term[电阻]为 $1.0\,\mathrm{M\Omega}$ 的电压表」；`:90`「通过电压表的内阻放电」改成「通过电压表放电」。
   - 同类：全领域的「内阻」现在都指电源的内阻。
5. **规矩 C**：
   - `vector-potential:27`、`:47` 的「拉格朗日量」标 `physics.analytical-mechanics.lagrangian`，`:27` 括注 Lagrangian。
   - `ampere-law` 的「微分方程」改说法：「这一节要回答的问题」改成「静磁场的散度和旋度是什么」，定理标签和三级标题改成「静磁场的散度和旋度」。
   - `poisson-equation:32` 的标签「静电场的微分方程」是同一个问题：批次 10 留下的，`math.ode` 也不在它的链上。这一行本来就要改「静电场」，顺手改成「静电场的散度和旋度」。
   - 同类：`lorentz-force:68` 用了二重叉积 $(\vb E\times\vb B)\times\vb B=-B^2\vb E$，链上的 `cross-product` 没有这个公式，补了一句分量核对（取 $\vb E=E\uv y$、$\vb B=B\uv z$）。
6. **括注英文**：报告列的都补了：非静电力、晶格、能带理论、位移电流、两节的磁荷、超精细结构、自旋、磁共振成像的全称；「矢量面积」见第 2 条。
   - 同类，讲解里：
     - 高斯公式（divergence theorem，`ampere-law`、`vector-potential`）、伽利略变换、质谱仪、霍尔元件、面积矢量；
     - 四维电流（链接当名词用）；
     - 混合积（新写的那一步）；
     - `ampere-law` 的「高斯面」原来是链接，改成术语标记并括注 Gaussian surface。
   - 同类，题目文字里：螺距、静止能量、太阳风（2 处）、极光、辐射带、磁电式电流表、双绞线、梯形网络、准静态过程、调和函数、单连通、电子全息术、正则动量、磁纬度、磁四极子、磁偏角、磁倾角。
   - 同类，这批新术语在已写小节题目文字里第一次出现：`gloss_first.py` 扫了全领域。
     - `poisson-equation` p5「电流」、p8「磁场」，`capacitors` p7「电阻」「电流」补了括注，`capacitors` 因此退回 written。
     - `electric-potential` p8「能量密度」（批次 10 的术语）也补了，这一节本来就要退回。
     - 剩下 3 处是「电磁场」「电流环」的误报。
7. **「霍尔效应」的简介**：交代了 $n$、$q$、$t$，58 字。
   - 同类：「电阻」（$L$、$A$、$\sigma$）、「连续性方程」（$\rho$、$\vb J$）、「漂移速度」（$\vb J$）的简介也补上了符号的意思，分别是 46、48、36 字。

### 小问题 3 · 说法、公式和记号

1. **`ampere-law:29` 立体角**：按报告的写法改，拆成两段。
   - 第一段定义 $\Omega(\vb r)=\int_S\frac{(\vb r'-\vb r)\cdot\dd\vb a'}{|\vb r'-\vb r|^3}$ 和它的正负：场点在拇指所指的一侧时为负。
   - 第二段用混合积写出窄带那一步。
   - 下一段改成「拇指所指的一侧趋于 $-2\pi$、另一侧趋于 $2\pi$」。
   - 「毕奥-萨伐尔定律」在这一节第一次出现挪到了这里，原 `:59` 的英文括注去掉。
   - 验算：「窄带张的立体角等于 $\Omega$ 的改变」在轴上和闭式比、在轴外和数值积分的 $\Omega$ 比，都一致；$\frac{\mu_0I}{4\pi}\nabla\Omega$ 和磁场一致是原有的检查。这个约定和 `vector-potential` p8 的 $\Phi_{\mathrm M}=-\frac{I\Omega}{4\pi}$ 对得上。
2. **`magnetic-dipole:53`**：补「磁矩和磁场同向时」。
3. **推理的条件和出处**：
   - `vector-potential:32` 写明条件：场点在电流外面时被积函数光滑，可以移进积分号；在里面时奇点可积，这里不证。同一句也管住下面散度那一步。
   - `ampere-law:42` 的 $\divg(\curl\vb B)=0$ 加了链接。
   - 同类：`ampere-law:40` 散度那一步「各个电流元的贡献相加」也是把散度移进积分号，补了同样的条件和链接。
4. **记号撞车**：
   - `current-density` p5 不再用 $\tau$ 表示 $\frac{\varepsilon_0}{\sigma}$：题面写成 $e^{-\sigma t/\varepsilon_0}$、「时间常数（time constant）是 $\frac{\varepsilon_0}{\sigma}$」，碰撞时间照讲解写 $\tau$。
   - `magnetic-force-on-currents` p8 的 $\varphi$ 改成 $\alpha$，提示 3 也交代了它是偏转角。
   - 同类：
     - `magnetic-dipole` p3 解答里磁倾角写成 $I$，和电流撞了，改成 $\beta$；
     - `magnetic-force-on-currents` 例 1 的积分变量 $\phi$ 和 $\varphi$ 太像，改成方位角 $\psi$ 并说明；
     - `lorentz-force:59` 的 $\gamma$ 补了定义。
5. **三处措辞**：
   - 霍尔电势差「大小是 $\frac{IB}{n|q|t}$」；
   - `lorentz-force:76` 的图注补「质量相同、电荷大小相同」；
   - `vector-potential:79` 改成「和 $a=\frac12$ 的对称形式相差」。
   - 同类没找到别的。
6. **`dipoles.svg`**：零长度的 path 删了。这个文件原来是 CRLF 换行，现在和别的 SVG 一样是 LF。别的 SVG 没有零长度的 path。

**协调会话定的「静电场」**：`electric-potential:34`、`poisson-equation:25` 和 `:32`、`electric-displacement:62` 改成整个词标。这三节和 `capacitors` 都退回 written。`conductors` 这一轮没动。

**可选的那条**：`ampere-law` p7 的「套数」统一成「环绕数」。

### 我替你定的（都能改）

- 「电流线」不进术语表，改 `ampere-law` 的说法（小问题 2 第 1 条）。
- 「匀强电场」「匀强磁场」不按复合词处理。
- 「节点」「回路」只加锚点、不进术语表：别的小节里「回路」多是「闭合曲线」的一般意思。
- 已审的 `capacitors` 补两处括注、退回 written；`poisson-equation:32` 的标签顺手改。
- 几何图像说明里起名的词（电流线、亥姆霍兹线圈、摆线）不加锚点：规矩说的是讲解。

### 验证

- `npm run content`：0 个错误、0 个警告。
- `npm test`：23 个文件、202 项全部通过。
- 我的验算 `verify_b11.py`：294 项，0 项不一致。新增的 8 项核对：
  - 题面常量下的 `lorentz-force` p1、p3、p4（龙格-库塔积分）；
  - 两道选择题的新选项；
  - 窄带立体角（3 项）。
- `npm run verify`（审查的脚本，只跑没改）：664 题里 662 题一致，2 题不一致，要你更新脚本：
  - `lorentz-force` p3：脚本里 $e$ 还是 CODATA 的值；题面现在给了 $1.6022\times10^{-19}$，标准答案是 $20.7277$。
  - `vector-potential` p2：选项换了，新答案是 A、E。
  - `lorentz-force` p1、p4 现在一致了。
- 自查都过：`check-terms` 只剩 7 处标签格式的老误报（6 处加上这次退回的 `poisson-equation:25`）和 7 处「电流环」的误报；`check-style`、`long_paras`、`gloss_first`、`naming`、`compound_scan` 都过。题目公式 1306 个，0 个错误。
- 页面：在临时副本上构建，768 宽下看了 13 节（9 节加退回的 4 节），展开全部提示和解答：
  - 都不左右滚动，KaTeX 错误为 0；
  - 行内、行间公式不溢出；
  - SVG 文字不出界、不重叠、不压线；
  - 新加的 6 个锚点都显示成定义卡片。
  - 动画这次没改，没有逐帧看。

### 建议写回 plan.md 的

- 复合词那一条可以再加一对例子：「电流环」是环，里面的「电流」不标；「环形电流」是电流，整个词标。
- 起名的规矩现在只说讲解。几何图像说明里起名的词要不要锚点，写回时定一下。

## 复核

审内容 agent · 2026-11-12

**结论：通过，没有需要再修的。** 13 节的 `status` 已改成 `reviewed`，都只改了第 11 行：9 节新课，加上退回的 `electric-potential`、`poisson-equation`、`electric-displacement`、`capacitors`。`conductors` 初审时已改回，这次没动。

- 三条小问题逐条改对了，同一类在这一批里也找全了。新加的 6 个锚点都显示成定义卡片。
- 和初审快照比，修订说明里没提的只有一处：`ampere-law` 散度那一步新加了「场点在电流外面时……」，这一块第一次出现的「电流」跟着挪到了这句里（原来标在后面「磁场线绕着电流转圈」那一处）。挪得对。
- 一处可改可不改，不影响通过：`ampere-law` 散度那一步写「在电流里面时被积函数有奇点，但奇点可积，结论仍然成立，这里不证」。
  - $\vb B$ 的被积函数奇点可积，这句话本身对；可对它求散度要再求一次导，导数的奇点就不可积了，光靠「可积」撑不住移进积分号。
  - 结论没错，又写了「这里不证」，读者不会被带错。想更准，可以改成「在电流里面时要多一步论证，结论仍然成立，这里不证」。
  - `vector-potential:32` 求的是 $\vb A$ 的一阶导数，奇点可积，那里的说法对。

### 怎么比的

- 快照是初审时拷的 `b11/snap/`。和它不同的有 27 个文件：
  - 9 节的 `lesson.md`、`problems.yaml`（`biot-savart` 只改了 `problems.yaml`）；
  - `_domain.yaml`、`dipoles.svg`；
  - 4 节退回的已审课，7 个文件；
  - `conductors`：我初审时改的 `status`。
- 4 节已审课和 HEAD 比，一共 14 行，和修订说明一致。
- `dipoles.svg` 去掉换行符的差别后，只少了那条零长度路径；换行由 CRLF 改成了 LF。

### 逐条

**小问题 1 · 题目**

1. `lorentz-force` p1、p3、p4：`value` 都用了题面的常量，p3 题面补了 $e=1.6022\times10^{-19}\,\mathrm C$。我按题面更新了 p3 的验算脚本，三题都和标准答案一致：$3.13182$、$20.7277$、$4.64098\,\mathrm{cm}$。
   - 同类：其余 8 节题面给了常量的数值题，`value` 都按题面写；没给 $e$ 的两题用 CODATA，验算一致。
2. `vector-potential` p2：新选项 A $(-By+y^2,\ 2xy,\ 0)$ 对（差 $\nabla(xy^2)$），B $(Bx,\ By,\ 0)$ 错（旋度为零，它是 $\nabla\bigl(\frac B2(x^2+y^2)\bigr)$）。
   - 我用 `npm run statements` 读了新题干，更新脚本，在三个点上用中心差分求旋度：A、E，和标准答案一致。
   - 同类：`current-density` p2 的 B 换成「细处电子的漂移速度比粗处大」。说法对（$v_{\mathrm d}=\frac{I}{neA}$），也不再照搬几何图像里判过的话。脚本改成按漂移速度核对，答案仍是 B、C、D。
3. `dc-circuits` p8：「约 $0.017\,\mathrm V$，不到五十分之一伏」，对。
4. `vector-potential` p7：「单个电子的磁通量子」「超导体里……通常说的磁通量子是 $\frac h{2e}\approx2.07\times10^{-15}\,\mathrm{Wb}$」，对。

**小问题 2 · 术语**

1. **锚点**：`def-amperian-loop`、`def-gauge-freedom`（库仑规范在同一段）加对了，卡片只框起名的那一段。另外 5 处也对：
   - `dc-circuits` 的 `def-internal-resistance`，术语表 `internal-resistance` 改指它，浮窗现在落在起名的那一段，比原来指定理好；
   - `dc-circuits` 的 `def-junction-loop`、`lorentz-force` 的 `def-velocity-selector`；
   - 「安培力」挪进 `thm-force-current`，括注 Ampère force；
   - 「非欧姆导体」改成「不满足欧姆定律」，不再起名。
   - 我用脚本查了 9 节讲解里含「叫作」「叫做」「称为」「这就是」「简称」「也叫」、前面没有锚点的段落，只剩修订说明里那 3 处，确实都不是给新概念起名。
2. **「矢量面积」**：`magnetic-dipole` 单独成段，加 `def-vector-area`，括注了英文，由来（$\frac12\vb r'\times\dd\vb l'$ 是小三角形的面积矢量）说得对；`magnetic-force-on-currents:43` 不再用这个词，改链到新锚点。只在一节用，不进表，对。
3. **复合词**：
   - 「地磁场」2 处整个词标；「电流环」6 处不标，`magnetic-dipole:16` 写成「小电流环（current loop）」。
   - 两块里「电流」第一次出现的地方补标得对：`magnetic-force-on-currents` 例 2 补标「电流」，`magnetic-dipole` 的「环形电流」整个词标。
   - 我的脚本重扫：没有拼成别的术语的；块里「电流」没标的只剩「电流环」里那 6 处，按这次的定法对。
4. **`rc-circuits:88`**：改成「电阻为 $1.0\,\mathrm{M\Omega}$ 的电压表」，`:90` 跟着改，对。全领域的「内阻」现在都指电源的内阻。
5. **规矩 C**：
   - 「拉格朗日量」两处标了分析力学的 id。
   - `ampere-law` 的「微分方程」改了说法（问题、标题、定理标签都改成「散度和旋度」），`poisson-equation:32` 同样改，好。
   - 重扫只多出「奇点」（`ampere-law:45`、`vector-potential:32`）：常微分方程里的「奇点」是方程的奇点，这里是被积函数的奇点，同名不同义，不标，对。
   - 新写的「混合积」定义在线性代数 `cross-product`，在链上，不标、括注了英文，对。
6. **英文括注**：报告列的都补了；同类在讲解和题目文字里又补了约 30 处，我逐处看过，都对。
7. **简介**：「霍尔效应」交代了 $n$、$t$，58 字；「电阻」「连续性方程」「漂移速度」补了符号的意思。都对。

**小问题 3 · 说法、公式和记号**

1. **`ampere-law` 立体角**：两段写法和我推的一致。
   - 定义 $\Omega(\vb r)=\int_S\frac{(\vb r'-\vb r)\cdot\dd\vb a'}{|\vb r'-\vb r|^3}$，场点在拇指一侧时为负；
   - 窄带上一小块是 $\dd\vb l'\times\delta\vb r$，混合积轮换成毕奥-萨伐尔定律的被积式；
   - 下一段「拇指所指的一侧趋于 $-2\pi$、另一侧趋于 $2\pi$」也对上了，和 `vector-potential` p8 的 $\Phi_{\mathrm M}=-\frac{I\Omega}{4\pi}$ 一致。
2. **`magnetic-dipole:53`**：补了「磁矩和磁场同向时」，对。
3. **条件和出处**：`vector-potential:32` 写明了条件，对；`ampere-law:42` 加了链接，对；同类在 `ampere-law` 散度那一步也补了（措辞见上面「可改可不改」）。
4. **记号**：
   - `current-density` p5 不再用 $\tau$：题面写 $e^{-\sigma t/\varepsilon_0}$、时间常数 $\frac{\varepsilon_0}\sigma$，碰撞时间照讲解写 $\tau$，对。
   - `magnetic-force-on-currents` p8 改成 $\alpha$，对。
   - 同类三处都对：磁倾角改 $\beta$，例 1 的积分变量改方位角 $\psi$，补了 $\gamma$ 的定义。
   - `lorentz-force:68` 补的二重叉积分量核对：$(E\uv y\times B\uv z)\times B\uv z=EB\uv x\times B\uv z=-B^2E\uv y$，对。
5. **三处措辞**：都改了，对。
6. **`dipoles.svg`**：零长度的路径删了。

**「静电场」和退回的已审课**：

- `electric-potential:34`、`poisson-equation:25`、`:32`、`electric-displacement:62` 都整个词标。页面上三节各显示 1 处「静电场」术语，没有拆开的。
- `poisson-equation:32` 的标签改成「静电场的散度和旋度」，没有别的地方按名字引用它。
- `capacitors` p7 的两处括注、`electric-potential` p8 和 `poisson-equation` p5、p8 参考解答的括注都对。

### 写内容会话、协调会话定的几件事

- **「匀强磁场」不算复合词**：妥当，和已审的「匀强电场」一致，批次 9、10 都是这样标的。
- **几何图像说明里起名的词不加锚点**：妥当。定义卡片只在讲解里显示（`AnchorBlock` 只在讲解里渲染），图注里加锚点也看不到；需要浮窗指过去时，把定义写进讲解。建议写回时这样说。
- **「节点」「回路」只加锚点、不进术语表**：妥当。「回路」在别的节多是一般的「闭合曲线」，和「解」一样是满篇都会出现的基础词。
- **「电流线」改说法、只在一节出现、不进表**：妥当。
- **跨领域补标这一批没有**：我没有另外重扫别的领域。你给的理由（题目文字可标可不标、链上学过的、中学词、同名不同义）都是规矩里写明的，站得住。
- **参考解答不查英文括注和术语标记、对错照查**：妥当。参考解答网页上不显示，「复制给 Claude」也不带。

### 验算和命令

- 验算脚本更新了 3 处：`current-density` p2（新选项 B）、`lorentz-force` p3（题面的 $e$）、`vector-potential` p2（新选项）。这一批 9 节 36 题全部一致。
- 全量 `npm run verify`：166 个小节，664 题全部一致。
- 公式：13 份 `problems.yaml`（9 节加 4 节退回的已审课）共 2013 个公式（参考解答 645 个），0 个错误，没有可疑写法。
- `npm run content`：0 个错误、0 个警告（改 `status` 前后各一次）。
- `npm run build`、`npx tsc -p tsconfig.node.json --noEmit`：通过。
- `npm test`：23 个文件、202 项全部通过，没有超时。
- 段落句数、中英文空格、引号：13 节都没问题。
- **页面**：768 宽下看了 13 节，提示、解答全部展开。
  - 都不左右滚动，KaTeX 错误为 0。
  - 定义卡片数：9 节新课依次是 9、7、4、7、6、4、8、5、4，4 节已审课是 7、4、6、5。新加的 6 个锚点都显示成卡片，「内阻」的卡片标签落在新的 `def-internal-resistance` 上。
  - SVG 文字不出界、不重叠、不压线。

### 没验证的

- 动画这一轮没改，没再看。
- 别的领域里链外用到这批新术语的地方，没有另外重扫。
- 手机宽度、iPad、Safari 没测。

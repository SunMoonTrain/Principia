# 批次 12 审查报告：电磁学与电动力学（磁介质、电磁感应与麦克斯韦方程组 8 节）

审内容 agent（和写内容 agent 是两个独立会话，没有读它的会话记录、交接说明和自查脚本）· 2026-11-12

审查范围：`content/physics/electromagnetism/` 下 8 节：`magnetization`、`magnetic-intensity`、`faraday-law`、`induced-electric-field`、`inductance`、`rl-circuits`、`ac-circuits`、`maxwell-equations`。每节都看了 `lesson.md` 和 `problems.yaml`。另外看了：

- 5 张 SVG、8 个动画；
- `_domain.yaml` 新增的 27 个术语；
- 退回 `written` 的已审小节里改动的地方：`gauss-law:47`、`ampere-law:38`、`:52`，`biot-savart:25` 和 `biot-savart` p7 的参考解答，狭义相对论 `four-vectors:60`；
- 6 处前置改动（含大纲 `waves-in-media`、`dipole-radiation` 去掉的前置）。

## 结论

重要 0 条，小问题 3 条（同一类合成一条）。

- **验算**：32 道简单题、中等题里 29 道和独立验算一致。
  - `maxwell-equations` p1、p3、p4 不一致：标准答案用 $\varepsilon_0=8.854\times10^{-12}$（p3 还有 $\mu_0=4\pi\times10^{-7}$），题面却没给常量。
  - 按批次 11 写回的规矩，题面没给就用 CODATA。相对差约 $2\times10^{-5}$，判题不受影响，但 `npm run verify` 对这 3 题报 ✗。
- **难题、思考题**：32 题的参考解答和三级提示逐题读过，推导都对。只有 `maxwell-equations` p3 解答的末位数对不上它代的常量（小问题 1）。
- **小问题 1 · 题目**：`maxwell-equations` p1、p3、p4 的常量。
- **小问题 2 · 术语**：
  - 两节以上用到的名词没进术语表：「螺绕环」「磁荷」。
  - 复合词拆开标：「外磁场」2 处、「内导体」1 处。
- **小问题 3 · 说法和图**：
  - `ac-circuits:76` 理想变压器的电流比少一个条件（空载电流不计）。
  - `mutual.svg` 的 6 个蓝色箭头没顺着磁场线。
- 你点名要查的几件事：
  - **退回的已审小节**：改动都对。
    - `gauss-law`、`biot-savart`、`four-vectors` 已改回 `reviewed`，只改了第 11 行。
    - `ampere-law` 改的两处也对；`:52` 补标「电磁感应」你的说明里没提，改得对。它留在 `written`，因为小问题 2 还要改它的 `:55`、`:72`（见「我替你定的」）。
  - **27 个新术语**：
    - 简介都在 60 字以内（最长 53）；
    - 锚点都落在起名的那一段；
    - 各简介的物理都对。
  - **前置的 6 处改动**：都合理，也都是最少的。656 节按整张图算，层级都不变；8 节都没有多余的前置。
    - `maxwell-equations` 加 `magnetic-intensity` 会让 22 节右移，`:81` 只是给以后留的话，不加对。
  - **指向这一批的链接**：plan 里列的都接住了（见「前置」）。狭义相对论 `covariant-maxwell:35`、`:60` 的名字、式子和这一批一致。
  - **写内容会话、你定的取舍**：都妥当（见「记号与约定」）。
    - 「受迫振动」「共振」「品质因数」不标是对的。
    - 不过理由不是「那张表是空的」：常微分方程的表里已有「共振」（`math.ode.resonance`），不在链上，可它是无阻尼、频率相等时振幅线性增长的窄定义，不该借过来。
    - 真正的出处是链上的 `driven-oscillations`，「共振」也是中学学过的词。
  - **动画**：
    - `ac-circuits` 的振子拖到 $R=0$、$0.25$、$2$、$3$ 四档看过：$R\ge2$ 不再振荡，和说明一致。
    - `maxwell-equations` 的函数图拖到 $R=0.5$、$1$、$2$ 看过。
    - 别的 6 个动画也都拖到了两端。
  - **`magnetic-intensity` p8 的磁滞回线说法**：对。每磁化一圈，单位体积上做的功 $\oint H\,\dd B$ 正是 $B$–$H$ 回线围成的面积。
  - **史实**：都对。
    - 阿拉戈 1824 年的转盘、1893 年芝加哥国际电学大会定名「亨利」，都查了来源；
    - 楞次 1833 年 11 月宣读、1834 年发表，亨利 1832 年，也查了。
- 修完以后 8 节都可以标 `reviewed`。`faraday-law`、`induced-electric-field`、`rl-circuits` 这三节没有要改的。

| 小节 | 重要 | 小问题 |
| --- | --- | --- |
| `magnetization` 磁化与束缚电流 | 0 | 1（2 外磁场） |
| `magnetic-intensity` 磁场强度与线性磁介质 | 0 | 1（2 外磁场、螺绕环、磁荷） |
| `faraday-law` 法拉第电磁感应定律 | 0 | 0 |
| `induced-electric-field` 感生电场 | 0 | 0 |
| `inductance` 自感、互感与磁场的能量 | 0 | 2（2 内导体；3 `mutual.svg` 的箭头） |
| `rl-circuits` RL 电路 | 0 | 0 |
| `ac-circuits` 交流电路与阻抗 | 0 | 1（3 理想变压器的条件） |
| `maxwell-equations` 位移电流与麦克斯韦方程组 | 0 | 1（1 三题的常量） |

另外小问题 2 会改到两节已写的：`ampere-law`（现在是 `written`）和 `magnetic-dipole`（已审，补标要退回 `written`）。

## 怎么审的

- 读了 `docs/plan.md` 已提交的规矩：e4623f4（批次 11 的写回）、a334c8e（批次 12 的安排）。e4623f4 新加的几条都照着查了：
  - 题面给了常量时标准答案按题面算，没给才用 CODATA；
  - 锚点只在讲解里；
  - 「见例 N」「第 N 题」「由上面的定理」逐个对；
  - 复合词「静电场」「地磁场」「电流环」「电流计」的例子；
  - 别的领域已写小节链外用到新术语时按规矩 C 补标；
  - `reference` 不查英文括注和术语标记，对错照查；
  - 立体角、磁标势的正负约定。
- **快照**：初审开始时把 `content/physics/electromagnetism/` 和 `content/physics/special-relativity/` 拷到我的 scratchpad 的 `b12/snap/`，时间是 2026-11-11T22:02:55Z。`git diff HEAD` 的输出也存了一份。审完时和快照比过，除了我改的 3 行 `status`，内容没有变。
- **改动范围**：
  - `git diff HEAD` 有：
    - 8 节的 `lesson.md`（从 outline 写成 written）；
    - `_domain.yaml`（末尾加了 27 个术语，宏没动）；
    - `ampere-law:11`、`:38`、`:52`，`gauss-law:11`、`:47`，`biot-savart:11`、`:25` 和 `problems.yaml:135`；
    - 大纲 `waves-in-media`、`dipole-radiation` 的前置；
    - 狭义相对论 `four-vectors:11`、`:60`。
  - 8 份 `problems.yaml`、5 张 SVG 是新文件，直接读。
  - 和你的说明比，只多了 `ampere-law:52` 补标「电磁感应」（括注了英文）。这一处在 `def-magnetic-flux` 那块里第一次出现，该补，改得对。
- 逐节读讲解、例题、常见误区，推导逐步核对，例题的数都重算过。
- **简单题、中等题**：只用 `npm run statements` 读题，写完验算脚本、跑出结果以后才打开 `problems.yaml`。
- **难题、思考题**：32 题的参考解答连同三级提示全部读了。关键的式子另外推过：
  - 均匀磁化球的 $\vb A$（借均匀带电球的电场）、环形磁铁的束缚电流；
  - 匀强磁场里的磁介质球 $\frac{3\mu_{\mathrm r}}{\mu_{\mathrm r}+2}\vb B_0$、针形和饼形空腔；
  - 离开长直导线的矩形线圈、电磁阻尼的总距离 $v_0\tau$；
  - 涡电流盘的平均功率 $\frac{\pi\sigma h\omega^2B_0^2a^4}{16}$、两只电压表读数差 $\mathcal E$、轨道电子的 $\Delta m_z=-\frac{e^2r^2B}{4m_{\mathrm e}}$；
  - 大小线圈的 $M_{12}=M_{21}$、实心内导体同轴电缆多出的 $\frac{\mu_0l}{8\pi}$；
  - RL 电路的 $W-Q=\frac12LI^2$、超导线圈电阻上限 $3\times10^{-12}\,\Omega$；
  - $\omega_+\omega_-=\omega_0^2$、并联谐振 $Z\approx\frac{L}{rC}=Q^2r$；
  - 漏电带电球 $\varepsilon_0\pdv{\vb E}t=-\vb J$、两板之间电场的二阶修正 $1-\frac{\omega^2s^2}{4c^2}$（191 MHz）、磁荷守恒要求 $\vb J_{\mathrm m}$ 前取负号。
- **公式**：构建不渲染参考解答。我把 8 节和 `biot-savart` 的 `problems.yaml` 里所有文字的公式都用编译器的 `compileTex` 加本领域的宏渲染了一遍，再跑 `suspectTex`。共 1422 个公式（参考解答 445 个），0 个错误，没有可疑写法。
- **引文和链接**：用脚本把 8 节讲解、题目里的链接全部列出，核对目标小节、锚点是否存在；链接后面的「第 N 题」「例 N」和本节的「第 N 题」「例 N」「pN」逐个对照题目、例题的内容。没有指错的。
- **图**：5 张 SVG 用无头 Edge 渲染成 PNG 看过，再按注释里的设定反算，用脚本核对（见「几何图像」）。
- **术语和格式**：沿用以前批次的检查脚本，讲解和题目文字都查：
  - 每节第一次标记带不带英文，每块第一次出现标没标；
  - 带标记的术语和紧挨着的一到四个字拼不拼成别的术语；
  - 规矩 C 对照前置链查；
  - 段落句数、空格、引号；
  - 27 个新术语在已写的 26 节讲解里有没有要补标的地方，以及别的领域已写小节的正文里有没有用到这 27 个词。
- **前置**：
  - 用脚本算全图 656 节的层级，比较 HEAD 和现在；
  - 逐节列出链上有哪些小节；
  - 几种改法各算一遍层级。
- **页面**：
  - `npm run build` 后用 `.claude/launch.json` 的 `test-serve` 打开，进度写临时仓库，查完已停掉。
  - 这次会话窗口没打开，面板是隐藏的：页面都用 DOM 检查。
  - 动画用假的 `requestAnimationFrame` 推帧，把画布导出成 PNG 看。
- **跑过的命令**：
  - `npm run content`：0 个错误、0 个警告（改 `status` 前后各跑一次）。
  - 本批 8 个验算脚本逐个单独跑：29 题一致，`maxwell-equations` 3 题不一致（见下）。
  - 全量 `npm run verify`：183 个小节，729 题一致，3 题不一致（就是上面那 3 题）。
  - `npx tsc -b`：第一次没过，报的是我自己的 `physics.electromagnetism.magnetization.ts` 多 import 了一个没用的 `integrate`（TS6133），删掉以后通过。
  - `npm run build`：通过。这次全量构建没被线性代数卡住，没用临时副本。
  - `npm test`：23 个文件、202 项全部通过。

## 简单题、中等题的验算

脚本在 `tools/verify/physics.electromagnetism.<小节>.ts`，辅助文件 `_es.ts` 这一批没改。两套算法互相独立：

1. **公式**：讲解里的式子。
2. **不用这些式子的算法**：
   - **磁化**：不用束缚电流，用「磁荷」模型。端面上面磁荷 $\sigma_{\mathrm m}=\vb M\cdot\uv n$，按库仑定律的形式数值积分出 $\vb H$，再 $\vb B=\mu_0(\vb H+\vb M)$。p4 的长圆柱把端面放到 $\pm10^4R$。
   - **磁介质**：由 $\vb B=\mu_0(\vb H+\vb M)$、$\vb M=\chi_{\mathrm m}\vb H$ 二分出 $H$；界面条件用矢量分量直接算；带缝铁环对 $B$ 二分，满足 $\oint\vb H\cdot\dd\vb l=NI$。
   - **法拉第定律**：磁通量对时间数值求导；杆的运动方程用龙格-库塔法积到收尾。
   - **感生电场**：
     - 不用 $\oint\vb E\cdot\dd\vb l=-\dv\Phi t$；
     - 由螺线管的电流直接算磁矢势：每个圆线圈 $\oint\frac{\dd\vb l'}{|\vb r-\vb r'|}$，再沿轴（$z=R\sinh u$）积分；
     - 然后 $\vb E=-\pdv{\vb A}t$；
     - 电子感应加速器沿轨道分 3600 段把功加起来。
   - **电感**：从能量算。$\frac{B^2}{2\mu_0}$ 对体积数值积分得 $W$，$L=\frac{2W}{I^2}$。
   - **RL 电路**：按基尔霍夫定律写出线圈电流的方程，用龙格-库塔法积分，二分出到达某个值的时刻。
   - **交流电路**：
     - 电容器的电流对电压中心差分；
     - 共振频率用黄金分割搜索 $\frac1{|Z|}$ 的最大值；
     - 串联 RLC 用龙格-库塔法积到 60 个衰减时间以后，把一个周期的 $I(t)$ 投影到 $\cos\omega t$、$\sin\omega t$ 上读振幅和相位；
     - 变压器按功率守恒算。
   - **麦克斯韦方程组**：
     - 位移电流由极板电荷 $Q=\varepsilon_0EA$ 对时间中心差分；
     - 极板边缘的磁场由位移电流密度对圆面数值积分、再用环路一圈；
     - 海水的频率对两种电流密度之比二分。

| 小节 | p1 | p2 | p3 | p4 |
| --- | --- | --- | --- | --- |
| `magnetization` | $5.08586\times10^5\,\mathrm{A/m}$ ✓ | A、C、D ✓ | $0.710861\,\mathrm T$ ✓ | $0.376991\,\mathrm T$ ✓ |
| `magnetic-intensity` | $1.43025\times10^3\,\mathrm{A/m}$ ✓ | A、D、E ✓ | $0.324937^\circ$ ✓ | $0.271628\,\mathrm T$ ✓ |
| `faraday-law` | $0.800\,\mathrm V$ ✓ | B、C、E ✓ | $2.45\,\mathrm{m/s}$ ✓ | $47.1239\,\mathrm V$ ✓ |
| `induced-electric-field` | $1.50\,\mathrm{mV/m}$ ✓ | A、C、E ✓ | $6.28319\,\mathrm{eV}$ ✓ | $75.3982\,\mu\mathrm{V/m}$ ✓ |
| `inductance` | $0.394784\,\mathrm{mH}$ ✓ | B、C ✓ | $1.88001\,\mathrm{mH}$ ✓ | $8.88889\,\mathrm H$ ✓ |
| `rl-circuits` | $20.0\,\mathrm{ms}$ ✓ | $1.26424\,\mathrm A$ ✓ | $(0.666667\,\mathrm s,\ 3.00\,\mathrm A)$ ✓ | $0.184207\,\mathrm s$ ✓ |
| `ac-circuits` | $318.310\,\Omega$ ✓ | $1.59155\,\mathrm{kHz}$ ✓ | $(0.149071\,\mathrm A,\ 63.4349^\circ)$ ✓ | $(60,\ 0.109091\,\mathrm A)$ ✓ |
| `maxwell-equations` | $0.177084\,\mathrm A$ ✗* | A、B、E ✓ | $87.3873\,\mathrm{nT}$ ✗* | $898.755\,\mathrm{MHz}$ ✗* |

- **✗\***：`maxwell-equations` 的标准答案依次是 $0.17708$、$87.3855$、$898.774$。
  - 它们用的是 $\varepsilon_0=8.854\times10^{-12}$、$\mu_0=4\pi\times10^{-7}$。
  - 题面没给常量，我的脚本按 CODATA 算（$\varepsilon_0=8.8541878188\times10^{-12}$，$\mu_0=1.25663706127\times10^{-6}$）。
  - 两边算法都对，差别只在常量（小问题 1）。
- **选择题**：逐项用例子核对，例子写在脚本的 `notes` 里。
  - `magnetization` p2 D：$(\curl(kx\uv z))_y=-k$，中心差分核对。
  - `faraday-law` p2 B、C：把磁铁当磁矩向下的磁偶极子，数值积分出线圈的磁通量随高度的变化，看电动势和力的符号。
  - `induced-electric-field` p2 A：$\frac k2(-y,x,0)$ 的散度中心差分为零；D：半径 $2R$、$5R$ 的两个圈电动势相同。
  - `maxwell-equations` p2 B：
    - 正极板在下、负极板在上，放电时 $\varepsilon_0\pdv{\vb E}t$ 沿 $-z$；
    - 外电路的电流从下板流出、到上板，要绕回出发点，两板之间也是 $-z$；
    - 两者同向，所以 B 对。

## 前置

- 全图 656 节，按 HEAD 和现在的前置各算一遍层级：**变了的 0 节**。只把电磁学、狭义相对论的改动换回去再算一遍，也是 0 节。8 节的前置都没有多余，没有悬空的 id。
- **六处改动**：
  - **`magnetization` 加 `polarization`**：合理，也是最少的。这一节处处拿极化作对照：
    - `:16` 的问题；
    - `:34`「和极化强度一样」在原子尺度和宏观尺度之间平均；
    - `:50` 的 $\vb P\leftrightarrow\vb M$、$\rho_{\mathrm b}\leftrightarrow\vb J_{\mathrm b}$ 对照。
    加上、去掉层级都不变。
  - **`magnetic-intensity` 加 `electric-displacement`**：合理，也是最少的。
    - `:27` 说 $\vb H$ 吸收束缚电流和 $\vb D$ 吸收束缚电荷是同一个办法；
    - `:46` 的 $\varepsilon\leftrightarrow\mu$；
    - `:69` 的界面条件 $\vb B\leftrightarrow\vb D$、$\vb H\leftrightarrow\vb E$。
  - **`inductance` 加 `vector-potential`**：需要。诺伊曼公式（`:32`）和磁场能量（`:58`）都用磁矢势。
  - **`maxwell-equations` 加 `electric-displacement`**：需要。`thm-ampere-maxwell-d` 用 $\vb D$ 和 $\divg\vb D=\rho_{\mathrm f}$；极化电流要的 `polarization` 也跟着到了链上。
  - **大纲 `waves-in-media` 去掉 `electric-displacement`**：对，经由 `magnetic-intensity` 已在链上。
  - **大纲 `dipole-radiation` 去掉 `electric-dipole`**：对，经由 `retarded-potentials` 已在链上。
- **看过、不用改的**：
  - **`maxwell-equations` 不加 `magnetic-intensity`**（你定的）：`:81` 的 $\curl\vb H=\vb J_{\mathrm f}+\pdv{\vb D}t$ 只是给讲介质中电磁波时留的话，推理没用到。加上会让 22 节右移两层：`maxwell-equations` 24→26、`em-waves` 25→27、狭义相对论 `field-tensor` 26→28……
  - **`inductance:46`**：
    - 一句旁注说填满磁介质的螺线管自感变成 $\mu_{\mathrm r}$ 倍，提前用了 `magnetic-intensity`（第 25 层）的结论，加了标记和链接。
    - 定理和例题不靠它；加前置会让 6 节右移，不加。
  - **`ac-circuits:73`、`:80`**：
    - 用「相对磁导率」解释磁通量为什么关在铁芯里，用「磁滞」「涡电流」说铁芯的损耗。
    - 理想变压器的定理把「磁通量全部穿过两个线圈」写成了条件，这几句只是说明，都加了标记。
    - 加 `magnetic-intensity` 只会让 `ac-circuits` 自己 25→26，可不需要。
  - **`maxwell-equations:24`、`:61` 的 $\divg(\curl\vb B)=0$**：`vector-identities` 不在链上，`:24` 加了链接。照批次 11 `ampere-law:42` 的定法，链接即可。
  - **`induced-electric-field:32` 积分号下求导**：写了条件（曲面不动、$\pdv{\vb B}t$ 连续），链到 `parameter-integrals`，合 `sketch` 的规矩。
  - **`faraday-law:34` 的混合积、右手定则**，**`rl-circuits:31` 的一阶线性方程、积分因子**：都在链上（`cross-product`；经由 `rc-circuits` 的 `linear-first-order`），不标、括注了英文，对。
- **跨领域前置**：`ac-circuits` ← 振动与波 `driven-oscillations`（还是 outline）。
  - 目标「会求受迫振动的稳态振幅和相位，并用品质因数描述共振峰的宽窄」，正是 `:34`、`:50`、`:53` 用到的。
  - `phasors`、`complex-exponential` 经由它在链上，`:34` 链到 `phasors`。
  - 写那两节时要和这一节对齐的几点，见「要写回 plan.md 的」。
- **指向这一批的链接**（plan 列的），都接住了：
  - **`maxwell-equations`**：
    - 「位移电流」进了术语表，`gauss-law:47`、`ampere-law:38` 补标了；
    - `ampere-law:38` 充电电容器的矛盾，`:16`、`:22` 接上了；
    - `rc-circuits` p7 的 $\varepsilon_0A\dv Et=I$，`:38` 原样用、还链回了这一题；
    - `electric-displacement:27`「位移」是麦克斯韦留下的名字，`:79` 补上了以太和「后来知道并没有这样的介质」，两处说法一致；
    - 狭义相对论 `covariant-maxwell:35` 的 $\curl\vb B=\mu_0\vb J+\mu_0\varepsilon_0\pdv{\vb E}t$ 和名字「安培-麦克斯韦定律」一字不差，`:60`「去掉位移电流就得不到电荷守恒」和 `thm-maxwell-conservation` 一致。
  - **`faraday-law`**：
    - `dc-circuits:22`「发电机里是磁力」→ `:56`；
    - `dc-circuits:49` 回路定律要改写 → `:38`，`rl-circuits:22` 和 p8 又细说了怎样改；
    - `ampere-law:52` 磁通量和曲面无关 → `:38`；
    - `magnetic-force-on-currents` p6 电动机的反电动势 → `:56`、p8；
    - `biot-savart` p8 双绞线 → `:38`。
  - **`induced-electric-field`**：`poisson-equation` p8 的 $k(-y,x,0)$ → `:16`，p2 A 用的也是这个场。
  - **`inductance`**：`rc-circuits` p8 两个电容器之间来回振荡 → `:62`。
  - **`ac-circuits`**：`dc-circuits` p7 高压输电 → `:80`、p7。
  - **`magnetization`**：
    - `magnetic-dipole:54` 安培的分子电流猜想、原子磁矩来自轨道运动和自旋 → `:22`、p7。
    - 这一批没有用立体角和磁标势；`magnetic-intensity` p7 用磁荷算 $\vb H$（$-\divg\vb M$、$\vb M\cdot\uv n$），和批次 11 的约定不冲突。
- **以这一批为前置的 outline 小节**：
  - `em-waves`、`gauge-potentials` ← `maxwell-equations`；
  - `poynting-theorem` ← `maxwell-equations`、`inductance`；
  - `waves-in-media` ← `magnetic-intensity`。
  这一批指向它们的话，见「要写回 plan.md 的」。

## 逐节

### physics.electromagnetism.magnetization 磁化与束缚电流

- 讲解、例题都对。
  - `:46`、`:48` 束缚电流的证明：
    - 恒等式 $\vb M\times\nabla'\frac1{|\vb r-\vb r'|}=\frac{\nabla'\times\vb M}{|\vb r-\vb r'|}-\nabla'\times\frac{\vb M}{|\vb r-\vb r'|}$ 对；
    - $\int_V\curl\vb F\,\dd V=\oint_S\uv n\times\vb F\,\dd a$ 由 $\vb c\cdot\curl\vb F=\divg(\vb F\times\vb c)$ 得到，对；
    - 面上那一项的正负对。
  - 例 1 $\mu_0M\approx1.26\,\mathrm T$；例 2 $\frac{\mu_0M}2\int_0^\pi\sin^3\theta\,\dd\theta=\frac23\mu_0M$。
  - 铝、水、铋在 1 T 里的 $18$、$-7$、$-130\,\mathrm{A/m}$ 和 `magnetic-intensity:46` 的 $\chi_{\mathrm m}$ 一致（铋按 $-1.7\times10^{-4}$ 是 $-135$）。铁的饱和磁化约为铝的 $9.5\times10^4$ 倍，「大约十万倍」对。
- `bound-currents.svg` 核过（见「几何图像」）。
- p5（均匀磁化球）、p6（环形磁铁）、p7（安培的猜想）、p8（铁钉）都对。
- 小问题 2：`:22` 的「外磁场」。

### physics.electromagnetism.magnetic-intensity 磁场强度与线性磁介质

- 讲解、例题都对。
  - 填满磁介质的螺线管 $K_{\mathrm b}=\chi_{\mathrm m}nI$，界面条件的扁圆柱、扁矩形。
  - 例 1：$H\approx159\,\mathrm{A/m}$，$B=\mu_{\mathrm r}\mu_0\frac{NI}{2\pi s}$ 恰好是 $0.200\,\mathrm T$，$M\approx1.59\times10^5\,\mathrm{A/m}$。
  - 例 2：内表面 $\frac{\chi_{\mathrm m}I}{2\pi a}\uv z$、外表面反向。
- 动画：垂直于磁场的板，$\vb M\parallel\uv n$，$\vb M\times\uv n=\vb 0$，板不改变 $\vb B$，说法对。$k=0.5$ 时板里 $\mu_0H=2$，$k=5$ 时 $0.2$，都在画面里。
- `hysteresis.svg` 核过。
- p5、p6、p7、p8 都对。
  - p6 两种空腔里分别量到 $\mu_0\vb H_0$、$\vb B_0$。
  - p7 永磁铁球里 $\vb H=-\frac13\vb M$。
  - p8 的说法见「结论」。
- 小问题 2：`:60` 的「外磁场」，`:34` 的「螺绕环」，`:27` 的「磁荷」。

### physics.electromagnetism.faraday-law 法拉第电磁感应定律

- 讲解、例题都对。
  - `:34` 动生电动势：$\dd\Phi=\oint\vb B\cdot((\vb v\,\dd t)\times\dd\vb l)=-\dd t\oint(\vb v\times\vb B)\cdot\dd\vb l$，正负对。
  - 发电机 $NBA\omega\sin\omega t$。
  - 例 1 外力的功率等于焦耳热；例 2 圆盘 $\frac12B\omega a^2$。
- 动画：
  - 磁通量 $(1+v^2t^2)^{-3/2}$，电动势 $\frac{3v^2t}{(1+v^2t^2)^{5/2}}$；
  - 每个峰下的面积正是磁通量的最大值；
  - 峰高 $0.859v$，$v=2$ 时 $1.72$，在 $\pm2$ 的范围里。
- `sliding-rod.svg` 核过。
- p5（离开导线的矩形线圈）、p6（电磁阻尼）、p7（法拉第圆盘的「悖论」和摇摆金属板的反例）、p8（电动机）都对。
- 没有要改的。

### physics.electromagnetism.induced-electric-field 感生电场

- 讲解、例题都对。
  - `:43` 的对称性论证：没有径向分量用 $\divg\vb E=0$；没有轴向分量用过轴平面里的矩形回路。
  - 「$\dv Bt>0$ 时从磁场指向的一侧看是顺时针」对。
  - 例 1 两处都是 $2.5\times10^{-3}\,\mathrm{V/m}$（$1.0\times4.0=2.0^2$）；例 2 二比一条件。
- 动画：
  - 画的场是 $k\,s$（实际是 $\frac s2\dv Bt$），差一个常数，形状对。
  - $k>0$ 顺时针，$k=0$ 粒子停下，$R=0.5$、$2$ 两端都看过。
- p5、p6、p7、p8 都对。
  - p6 两只电压表从 $P$ 积到 $Q$ 分别读 $IR_1$、$-IR_2$。
  - p7 轨道半径不变那句是一阶近似，括号里交代了。
- 没有要改的。

### physics.electromagnetism.inductance 自感、互感与磁场的能量

- 讲解、例题都对。
  - 诺伊曼公式；$\frac12I\oint\vb A\cdot\dd\vb l\to\frac1{2\mu_0}\int B^2\,\dd V$，无穷远处的面积分趋于零；
  - 例 1 两种算法都是 $\frac{\mu_0l}{2\pi}\ln\frac ba$；
  - 例 2 $M=\mu_0nNA$。
- `mutual.svg` 的磁场线精确（见「几何图像」），箭头见小问题 3。
- p4：能量 $9.0\times10^5\,\mathrm J$，相当于 1.5 吨的车以 125 km/h 行驶，「每小时一百多千米」对。
- p5、p6、p7、p8 都对。
- 小问题 2：`:74` 的「内导体」。小问题 3：`mutual.svg` 的箭头。

### physics.electromagnetism.rl-circuits RL 电路

- 讲解、例题都对。
  - 线圈两端 $\varphi_a-\varphi_b=L\dv It$ 的正负；
  - 例 1 $\tau\ln10\approx0.115\,\mathrm s$；
  - 例 2 $1.2\times10^3\,\mathrm V$、$2.0\,\mathrm{ms}$、$1.44\,\mathrm J$。
- 动画：$T=0.25$、$2$ 两端看过。$t=3$ 处电势差的跳变，说明按默认滑块值写「从接近零」，合写回的规矩。
- p5、p6、p7、p8 都对。p6 时间常数超过 $3\times10^{12}\,\mathrm s$，约十万年。
- 没有要改的。

### physics.electromagnetism.ac-circuits 交流电路与阻抗

- 讲解、例题都对。
  - $\Delta\omega=\frac RL$ 是精确的（两个正根相减）。
  - 例 1：$|Z|\approx188\,\Omega$、$1.17\,\mathrm A$、超前 $57.9^\circ$、$137\,\mathrm W$。
  - 例 2：$C\approx101\,\mathrm{pF}$、$\Delta f\approx6.37\,\mathrm{kHz}$、$Q\approx157$。
- 动画：
  - 共振曲线 $Q=1$、$10$ 两端看过。
  - 振子组件的力是 $-k_1x-k_2x-cv$，`springs: [1, 0]` 就是 $\ddot x+R\dot x+x=0$，临界在 $R=2$，和说明一致；写 0 的那根弹簧不画。
- p5、p6、p7、p8 都对。
- 小问题 3：`:76` 理想变压器的条件。

### physics.electromagnetism.maxwell-equations 位移电流与麦克斯韦方程组

- 讲解、例题都对。
  - $\divg\vb J_{\mathrm d}=\pdv\rho t$ 抵消连续性方程；
  - 方程组蕴含电荷守恒；
  - 极化电流满足束缚电荷的连续性方程；
  - 例 1 边缘 $8.0\times10^{-6}\,\mathrm T$；例 2 $\tau=\frac\varepsilon\sigma\approx17.7\,\mathrm s$，两板之间传导电流和位移电流处处抵消。
- `displacement.svg` 核过。动画 $R=0.5$、$1$、$2$ 看过。
- p5–p8 都对。
- 小问题 1：p1、p3、p4 的常量。
- `:132`「（见 p7）」的写法不算问题，见「我替你定的」。

## 小问题 1 · 题目（汇总）

1. **`maxwell-equations` p1、p3、p4 的标准答案用了题面没给的常量。**
   - `problems.yaml:7`、`:58`、`:78` 的 `value` 用 $\varepsilon_0=8.854\times10^{-12}$，p3 还用 $\mu_0=4\pi\times10^{-7}$。三题的题面都没给常量，按 e4623f4 写回的规矩应当用 CODATA，所以 `npm run verify` 一直报 ✗。
   - p3 的解答（`:70`）还有一处末位不一致：代的是 $8.85\times10^{-12}$，可用 $8.85$ 算出来是 $8.73\times10^{-8}\,\mathrm T$（$87.3\,\mathrm{nT}$），写的却是 $8.74\times10^{-8}\,\mathrm T$、$87.4\,\mathrm{nT}$（那是 $8.854$ 的结果）。
   - 推荐改法（改动最少）：
     - 三题题面补「取 $\varepsilon_0=8.854\times10^{-12}\,\mathrm{F/m}$」，p3 再补「$\mu_0=4\pi\times10^{-7}\,\mathrm{N/A^2}$」；
     - `value` 不用动；
     - 提示、解答里代的 $8.85$ 改成 $8.854$：p1 `:17`、`:19`，p3 `:70`，p4 `:88`。
   - 另一种：题面不动，`value` 改用 CODATA；p3 解答照样要把 $8.85$ 改掉。
   - 改好以后我把脚本换成题面的常量。

## 小问题 2 · 术语（汇总）

1. **两节以上用到的名词没进术语表**（plan「两节以上用到的名词就进术语表」）。
   - **「螺绕环」**：
     - 批次 11 定的是只加锚点：`ampere-law:72` 在 `thm-toroid` 里起名，当时只有那一节的讲解用。
     - 这一批 `magnetic-intensity:34` 的讲解又用了，`:100` 例 1 的标题也是。
     - 改法：进表（toroid，`definedIn` `ampere-law`，锚点 `thm-toroid`），标 `ampere-law:72`、`magnetic-intensity:34`。
   - **「磁荷」**：
     - 三节的讲解都用：`ampere-law:55`、`:57`，`magnetic-dipole:52`、`:54`、`:105`，这一批的 `magnetic-intensity:27`。
     - 批次 11 已经两节在用，当时我漏了。
     - 术语表「磁单极子」的简介本来就是「能单独发出或吸收磁场线的『磁荷』」。最省事的做法：当作同一个概念，各块第一次出现标成 `magnetic-monopole`（和「电感」标成 `self-inductance` 一样）。也可以单独进表。
     - `magnetic-dipole` 已审，补标要随这一批退回 `written`。
2. **复合词拆开标**（和「地磁场」同一类）：
   - `magnetization:22`「没有外磁场时」、`magnetic-intensity:60`「撤去外磁场后」写成「外」加带标记的「磁场」；
   - `inductance:74`「同轴电缆的内导体」写成「内」加带标记的「导体」。
   - 整个词标：`:term[外磁场]{id="physics.electromagnetism.magnetic-field"}`、`:term[内导体]{id="physics.electromagnetism.conductor"}`。
   - 「外」「内」是单字前缀，和「地」「静」一样构成复合词，不像「匀强」是两个字的修饰语。若你们认为它们是修饰语，也可以不改，但要写回规矩。

## 小问题 3 · 说法和图（汇总）

1. **`ac-circuits:76` 理想变压器的电流比少一个条件。**
   - 现在的条件是「铁芯里的磁通量全部穿过两个线圈，线圈的电阻和铁芯的损耗都不计」。
   - 照这个条件，副线圈开路（$I_2=0$）时定理给出 $I_1=0$；实际上原线圈里有空载电流 $\frac{V_1}{\omega L_1}$。
   - 证明（`:78`）里「输入的功率等于输出的功率」也默认了铁芯里不储存能量。
   - 改法：条件里加「铁芯的磁导率极大，原线圈的空载电流可以不计」，`:73` 已经说了相对磁导率很大，接上即可。p4 题面写的是「理想变压器」，不用改。
2. **`inductance/mutual.svg` 的 6 个蓝色箭头竖直朝上，没顺着磁场线。**
   - 三对箭头所在处，磁场线偏开竖直方向 $18^\circ$、$28^\circ$、$37^\circ$（左右对称）。
   - 放大看很明显，原尺寸下最外一对也看得出。
   - 改法：按箭头所在处曲线的切向转过去，或者把箭头挪到线几乎竖直的地方（比如两个线圈之间、靠近轴的那一段）。

## 记号与约定

- 这一批的新记号 8 节一致：
  - 磁化强度 $\vb M$、磁场强度 $\vb H$、磁化率 $\chi_{\mathrm m}$、相对磁导率 $\mu_{\mathrm r}$；
  - 束缚、自由电流的下标 $\mathrm b$、$\mathrm f$；
  - 电动势 $\mathcal E$、自感 $L$、互感 $M$；
  - 复振幅 $\tilde I$；
  - 位移电流密度 $\vb J_{\mathrm d}$、极化电流密度 $\vb J_{\mathrm p}$。
- **相位差 $\theta$**：`ac-circuits` 用 $\theta$，不撞方位角 $\psi$、电势 $\varphi$，合批次 12 的安排。$\theta=\arg Z$ 是电流落后的相位，动画、例题、题目一致。
- **$q$、$Q$**：`ac-circuits:50` 交代了电荷写作 $q$、$Q$ 留给品质因数，全节照做。
- **$\sigma$**：
  - `maxwell-equations` 例 2 写了「这一节里 $\sigma$ 是电导率」，`induced-electric-field` p5 在题面里说明了。
  - 这 8 节没有一节同时用面电荷密度 $\sigma$。
- **$M$**：既是磁化强度也是互感，两者不在同一节。
- **复数**：`ac-circuits` 取 $\operatorname{Re}(\tilde Ie^{i\omega t})$，求导乘 $i\omega$。以后 `phasors` 要用同一个约定（写回）。
- **写内容会话定的术语取舍**：
  - 「传导电流」「真空磁导率」整个词标，对。
  - 「交流电路」（交流/电路）、「磁滞回线」（意思是那条曲线）不算短术语出现，对，和「电流环」同一个道理。
  - 「安培-麦克斯韦定律」进表，对。
  - 「交流电路」「阻抗」「有效值」「传导电流」「极化电流」只加锚点，对：每个都只在一节里用，别处只出现在链接文字「交流电路与阻抗」里。
- **你定的**：
  - 不给 `current-density` p8、`dc-circuits` p7 的「交流电」「变压器」补英文，对：题目文字。
  - `biot-savart:25` 整个词标「真空磁导率」，对。

## 格式、术语、证明深度、难度档

- 固定结构、二级标题都对；段落都不超过 4 句；中英文空格、引号没问题。
- **英文括注**：
  - 每节第一次标记都带英文。
  - 定理标签里写成「定理（:term[…]，English）」的 3 处（`faraday-law:32`、`:43`，`maxwell-equations:34`）和以前各批的写法一样。
- **术语检查**：
  - 带标记的术语和前后紧挨着的字拼成别的术语：没有；
  - 前面紧挨着可疑字的：「匀强」（修饰语）、「总磁矩」，以及小问题 2 的「外」「内」。
- **补标**：
  - 27 个新术语在批次 9 到 11 的 26 节讲解里，要补标的已经补了（`gauss-law:47`、`ampere-law:38`、`:52`）。
  - 脚本另报了 `images-uniqueness:52` 的「自感」，是「来自感应电荷」跨词拼出来的，不算。
- **规矩 C**：8 节里别的领域的词，链外又没标的：
  - 「正弦」（中学词）；
  - 「中心」「相似」（同名不同义）；
  - 「共振」（见「结论」）。
  都不用标。
- 证明深度是 `sketch`，各定理都给了证明思路。`induced-electric-field:32`「和静磁场的散度和旋度的推理一样」指向的正是同一个道理（任意小的曲面、被积函数连续）。
- 难度档合适。简单题一两步，中等题要组合，难题要完整推理，思考题问条件和联系。
- 一句话总结都不超过 30 字（最长 28，构建查过）。
- **页面**（768 宽，难题、思考题点到第 3 级提示，简单题、中等题点「放弃」看解答）：
  - 8 页都不左右滚动，KaTeX 错误为 0。
  - 定义卡片数等于讲解里的锚点数：6、7、4、4、6、2、8、6。
  - 没有比所在框宽的行内公式。
  - 5 张 SVG 的文字都不出界、不重叠、不压线。

## 几何图像

5 张 SVG 都用无头 Edge 渲染看过，按注释里的设定反算，用脚本核对。文字在页面上用 `getBBox()` 量过，离画布边最近 4.1 像素（`sliding-rod.svg` 角上的 $\vb B$），都是单个字母。

- **`bound-currents.svg`**：
  - 左图 16 个小方块都是逆时针（上边向左、左边向下、下边向右、右边向上），磁矩朝外，和「$\vb M$ 垂直纸面向外」一致；
  - 右图外圈也是逆时针，右边界 $\uv n$ 向右、$\vb K_{\mathrm b}$ 向上，$\uv z\times\uv x=\uv y$，对。
- **`hysteresis.svg`**：
  - 两条分支关于原点对称（反射后最多差 0.10 像素）；
  - 剩磁、矫顽力两个点都落在下降分支上（差 0 和 0.63 像素）；
  - 初始磁化曲线从原点出发、夹在两支之间；
  - 上支箭头向左、下支向右，对。
- **`sliding-rod.svg`**：
  - $\vb v$ 向右、$\vb B$ 向外，$\vb v\times\vb B$ 向下，杆里电流向下；
  - 上导轨向右、电阻里向上，整圈顺时针；
  - 杆受的力向左。都对。
- **`mutual.svg`**：
  - 每条线上逐点算磁通函数 $\Psi=sA_\psi$（圆线圈的磁矢势我用数值积分，和图自己用的椭圆积分无关），沿线相对变化 0.5% 到 1.7%（靠轴的那条变化大，是 0.1 像素的取整），确实是磁场线。
  - 6 条蓝线的 $\Psi$ 都小于 $\Psi(0.6,1.1)$、8 条灰线都大于，分得对。
  - 线圈 1 左截面向外、右截面向里，中间磁场向上；外侧两个灰色箭头和磁场差 0.3°到 0.7°；蓝色箭头见小问题 3。
  - 4 个圆的 `fill="var(--bg, #ffffff)"` 是变量的后备值，不算写死颜色。
- **`displacement.svg`**：
  - 回路 $C$ 的右半圈在导线前面（导线在那里断开一小段），箭头在近侧向下；
  - 电流向右时，按右手定则近侧的正方向正是向下；
  - $S_2$ 兜住带正电的左极板，底面在两板之间，电场从正极板指向负极板。都对。
- **动画**（8 个，滑块都拖到两端、导出画面看过）：
  - `magnetic-intensity`：$k=0.5$ 板里 $\mu_0H=2$，$k=5$ 时 $0.2$。
  - `faraday-law`：$v=0.5$ 时峰高 $0.43$，$v=2$ 时 $1.72$。
  - `induced-electric-field`：$k=-1$、$0$、$1$，$R=0.5$、$2$。
  - `rl-circuits`：$T=0.25$ 时 $t=3$ 前已到终值，$T=2$ 时只到 $0.78$。
  - `ac-circuits`：共振曲线 $Q=1$、$10$；振子 $R=0$ 等幅、$0.25$ 衰减振荡、$2$ 和 $3$ 单调放完。
  - `maxwell-equations`：$R=0.5$ 时边缘峰高 $2$，$R=2$ 时 $0.5$，边缘以外和 $\frac1s$ 重合。
  - 画面都不泄露简单题、中等题的答案。

## 史实和数字

- **你点名的两条**：
  - 阿拉戈 1824 年发现转动的铜盘带着上方的磁针转（Arago's rotations），法拉第 1831 年用电磁感应解释：对。
  - 1893 年 8 月芝加哥国际电学大会给电感的单位定名「亨利」：对。
- **别的**：
  - 奥斯特 1820 年；法拉第 1831 年 8 月 29 日的铁环、同年的铜盘发电机。
  - 亨利 1832 年（*American Journal of Science* 7 月号，感应和自感）。
  - 楞次 1833 年 11 月在圣彼得堡科学院宣读、1834 年在《物理和化学年鉴》发表。
  - 诺伊曼 1845 年、傅科 1855 年。
  - 居里 1895 年的博士论文、法拉第 1845 年的重玻璃、盖姆等人 1997 年约 16 T 让青蛙悬浮、外斯 1907 年。
  - 克斯特 1940 年在伊利诺伊大学建成电子感应加速器、2.3 MeV。
  - 冈茨工厂三人 1885 年的闭合铁芯变压器。
  - 麦克斯韦 1862 年用韦伯和科尔劳施的数据算出波速、和菲佐的光速比，1865 年的 20 个方程，亥维赛 1884 年前后整理成 4 个，赫兹 1887 到 1888 年；狄拉克 1931 年。
  - 以上都对。
- **数**：
  - 铝 $2.2\times10^{-5}$、水 $-9.0\times10^{-6}$、铋 $-1.7\times10^{-4}$（国际单位制的体积磁化率）；
  - 镍 $9.14\times10^{28}\,\mathrm{m^{-3}}$、$0.6\mu_{\mathrm B}$；
  - 铁的饱和磁化 $1.7\times10^6\,\mathrm{A/m}$、居里温度 $1043\,\mathrm K$；
  - 海水 $\varepsilon_{\mathrm r}=80$、$\sigma=4\,\mathrm{S/m}$；
  - 220 V、50 Hz，中波 1 MHz 配 100 pF。
  - 都对。
- **来源**：
  - 阿拉戈：Wikipedia [Arago's rotations](https://en.wikipedia.org/wiki/Arago%27s_rotations)；
  - 亨利单位：Smithsonian Institution Archives [Unit of Inductance Named the "Henry"](https://siarchives.si.edu/collections/siris_sic_12595)；
  - 楞次：[Encyclopedia.com](https://www.encyclopedia.com/science/dictionaries-thesauruses-pictures-and-press-releases/lenz-emil-khristianovich-heinrich-fridrich-emil)；
  - 亨利 1832：Smithsonian [Joseph Henry Discovers Electromagnetic Induction](https://siarchives.si.edu/collections/siris_sic_12470)。
  - 其余按我已有的知识核对，没有逐条检索。

## 我替你定的（都能改）

1. **`ampere-law` 留在 `written`**。它改的两处都对，但小问题 2 还要改它的 `:55`、`:72`。`gauss-law`、`biot-savart`、`four-vectors` 改回了 `reviewed`（只改第 11 行），这三节和小问题无关。
2. **`maxwell-equations:132` 的「（见 p7）」不算问题**。全站讲解里「（见 pN）」「（pN）」这种写法有 92 处，已审的 `gauss-law:47`、`four-vectors:60` 也这样写。
3. **「共振」「受迫振动」「品质因数」照写内容会话的做法只括注英文**，理由按「结论」里那样补。
4. **几处不算问题，没列进小问题**：
   - `magnetic-intensity:60`「纯铁里最大可以到几千」：常见的表里「纯铁」指工业纯铁，约 5000；氢气里退火的高纯铁可到 $10^5$，这里不必细分。
   - `hysteresis.svg` 的说明「两轴各以饱和处的值为单位」：生成模型的 $H$ 以矫顽力为单位。图上没有刻度，读者看不出差别。
   - `induced-electric-field` 动画画的场是实际值的 2 倍，说明里没给纵向的单位，不影响。
5. **`inductance:46`、`ac-circuits:73`、`:80` 提前用到 `magnetic-intensity`、`induced-electric-field` 的概念**，只作旁注、加了标记，不加前置（见「前置」）。
6. **验算脚本按 CODATA 算 `maxwell-equations` 的三题**，所以题面改好以前 `npm run verify` 对它们报 ✗。另外修了我自己脚本里一个没用的 import（`tsc` 报的）。

## 要用户决定的

无。

## 要写回 plan.md 的

1. **给以后写振动与波的会话留的话**（批次 12 审查时提的）：
   - `driven-oscillations` 的品质因数要和 `ac-circuits` 一致：
     - $Q=\frac{\omega_0}{\Delta\omega}$，$\Delta\omega$ 是速度（对应电流）振幅降到 $\frac1{\sqrt2}$ 的两个角频率之差，正好等于 $\frac bm$（对应 $\frac RL$）；
     - 能量形式 $Q=\frac{\omega_0U}{\bar P}$（`ac-circuits` p5）。
     - 位移振幅的半功率宽度只在 $Q$ 大时近似等于 $\frac bm$，讲的时候说清是哪个振幅。
   - 「共振」「受迫振动」「品质因数」进振动与波的术语表。
     - 常微分方程已有「共振」（`math.ode.resonance`，无阻尼、频率相等时振幅线性增长），定义更窄；
     - 振动与波讲的是有阻尼时的共振峰，各自定义、各标各的 id（同「完整约束」的做法）；
     - `ac-circuits` 里的这几个词那时在链上，可标可不标。
   - `phasors` 用 $\operatorname{Re}(\tilde Xe^{i\omega t})$ 的约定（复振幅带波浪号，求导乘 $i\omega$），和 `ac-circuits:34` 一致。
2. **术语规范**（批次 12 审查时提的，按修订时的决定写）：
   - 复合词补例子「外磁场」「内导体」；
   - 「两节以上用到的名词就进术语表」补例子：「螺绕环」批次 11 只加锚点，批次 12 第二节用到时进表；
   - 「磁荷」按「磁单极子」标（如果采纳）。
3. **给以后写电磁学的会话留的话**（批次 13、14 要接住的；批次 12 审查时提的）：
   - `em-waves`：`maxwell-equations:65` 的 $\frac1{\sqrt{\mu_0\varepsilon_0}}\approx3.00\times10^8\,\mathrm{m/s}$；p7 无源时 $\vb E\to c\vb B$、$\vb B\to-\frac{\vb E}c$ 方程组不变。
   - `gauge-potentials`：
     - `induced-electric-field` p8 的参考解答链过来，写了 $\vb E=-\nabla\varphi-\pdv{\vb A}t$；
     - 还写了「没有电荷时可以取 $\vb E=-\pdv{\vb A}t$」（库仑规范）。
   - `retarded-potentials`：
     - `induced-electric-field` p8（3）离螺线管 $s$ 处要过约 $\frac sc$ 才感到变化；
     - `maxwell-equations` p6（3）频率高时两板之间的场不均匀、要解电磁波的方程。
   - `waves-in-media`：
     - `maxwell-equations:81` 的 $\curl\vb H=\vb J_{\mathrm f}+\pdv{\vb D}t$；
     - p4 海水里传导电流和位移电流在 $\frac{\sigma}{2\pi\varepsilon}$（约 900 MHz）相等。
   - `skin-effect`：`induced-electric-field` p5 假定涡电流自己的磁场可以忽略，频率高时不成立，正是趋肤效应。
   - `poynting-theorem`：`inductance` 的 $u=\frac{B^2}{2\mu_0}$、$U=\frac12\int\vb A\cdot\vb J\,\dd V$，`electrostatic-energy` 的 $\frac{\varepsilon_0}2E^2$。
4. **别的领域的补标**（你已定在修订轮做）：
   - 狭义相对论 `postulates:56`「麦克斯韦方程组」要补；`:63` 在同一块里，不用再标。
   - `field-tensor:127`「真空磁导率」要补。
   - 我扫过别的已写小节，没有别的要补：
     - `covariant-maxwell`、`field-tensor:63` 在链上；
     - 数学分析 `fourier-series:16` 的「交流电」是中学词；
     - `four-vectors:60` 的「惯性定理」（线性代数 `law-of-inertia`）经由直接前置 `quadratic-forms` 在链上。

## 没验证的地方

- **页面**：
  - 是在隐藏的面板里看的（会话窗口没打开），只做了 DOM 检查，没有整页截图。
  - 动画用假的 `requestAnimationFrame` 推帧、把画布导出成 PNG 看，实际帧率没看。导出的画布是透明底，亮色、暗色主题没分别看。
- **SVG**：用无头 Edge 渲染看的是亮色。暗色主题下它们用的都是 `currentColor` 和页面变量，没逐张看。
- 手机宽度、iPad、Safari 没测。
- **史实**：只检索了「史实和数字」里注明来源的四条，其余按已有的知识核对。
- **复合词的判断**：「外磁场」「内导体」算复合词是我按「地磁场」类推的，规矩里没有原话。

## 修订说明（写内容会话）

3 条小问题都改了。同一类问题在这一批里另外找到 4 处，是定理里默认了却没写出来的条件，也一并改了。改完 `npm run content` 0 个错误、0 个警告，`npm test` 202 项通过。

### 小问题 1 · 题目

- `maxwell-equations` p1、p3、p4 的题面补了「取 $\varepsilon_0=8.854\times10^{-12}\,\mathrm{F/m}$」，p3 另补「$\mu_0=4\pi\times10^{-7}\,\mathrm{N/A^2}$」。`value` 没动。
- 提示、解答里代入的 $8.85$ 改成 $8.854$，共四处：p1 第 3 条提示和解答、p3 解答、p4 第 3 条提示。
- p3 解答的结果仍写 $8.74\times10^{-8}\,\mathrm T$、$87.4\,\mathrm{nT}$，因为按 $8.854$ 代入得 $87.39\,\mathrm{nT}$（`value` 是 $87.3855$），三位有效数字就是 $87.4$。报告里的 $87.3$ 是代 $8.85$ 时的结果。
- 同一类问题查过：8 节别的简单题、中等题，`value` 用到的常量（$\mu_0=4\pi\times10^{-7}$、$g=9.8$、$\mu_{\mathrm B}$）题面都给了。

### 小问题 2 · 术语

- **「螺绕环」进术语表**：id 是 `toroid`，定义在 `ampere-law`，锚点 `thm-toroid`。补标了两处：
  - `ampere-law:72`：标在定理标签里，英文括注也挪进标签，写成「定理（螺绕环（toroid）的磁场）」；后面「做成螺绕环」去掉括注。
  - `magnetic-intensity:34`：括注 toroid。
  - 题目文字里本节第一次出现的地方补了括注：`inductance` p3 题面，`magnetization` p6 第 2 条提示（链接文字当名词用）。
- **「磁荷」照推荐按「磁单极子」标**：`ampere-law:55`、`magnetic-dipole:52`、`:105`、`magnetic-intensity:27` 是各块第一次出现。
  - `magnetic-intensity:27` 是本节第一次出现，括注了 magnetic charge；同一块后面的不再标。
  - `magnetic-dipole` 退回 `written`。
  - `maxwell-equations` p7 题面的「磁荷」也补了括注。
- **复合词改成整个词标**：「外磁场」（`magnetization:22`、`magnetic-intensity:60`）、「内导体」（`inductance:74`）。「内导体」是本节第一次出现「导体」，括注改成 inner conductor。
- **同一类问题查过**：
  - 全领域讲解里「外」「内」后面紧跟带标记术语的，只有这 3 处。「长螺线管」「强磁场」「总电荷」照报告的看法算修饰语，不改。
  - 只加锚点的名词逐个数过在几节讲解里出现，包括居里温度、剩磁、矫顽力、亨利、有效值、阻抗、传导电流、介电常量等。两节以上出现的只有「亨利」「韦伯」「介电常量」：前两个在另一节里是人名（约瑟夫·亨利、威廉·韦伯）；「介电常量」单独用的仍只在 `electric-displacement`，`maxwell-equations` 里是「相对介电常量」。都不进表。

### 小问题 3 · 说法和图

- **`ac-circuits:76`**：
  - 条件补了「铁芯的相对磁导率又极大，副线圈不接用电器时原线圈里的电流（空载电流，no-load current）可以不计」。
  - 证明（`:78`）补了「空载电流可以不计时铁芯里磁场储存的能量也可以不计」，所以输入、输出的功率相等。
  - 这一块第一次出现的「电流」「磁场」位置变了，标记跟着挪过去。
- **`mutual.svg`**：
  - 6 个蓝色箭头改成顺着磁场线画：在箭头所在处由磁通函数的偏导数算出磁场方向，偏开竖直方向 $18.0^\circ$、$27.9^\circ$、$36.4^\circ$，左右对称。
  - 和图里画出的折线比，切向差 $0.4^\circ$ 到 $1.8^\circ$，箭头尖离线都不到 1 像素。
- **同一类问题（定理默认了却没写出的条件）又找到 4 处，都补上了**：
  - `magnetic-intensity:30` 有磁介质时的安培环路定理：加「电流恒定、场不随时间变时」。随时间变化时要加 $\pdv{\vb D}t$，见 `maxwell-equations:81`。
  - `inductance` 诺伊曼公式：加「两个线圈由很细的导线绕成、周围是真空时」。
  - `inductance` 长螺线管的自感：加「管里是真空」。证明里本来就另说了填满磁介质的情形。
  - `inductance` 磁场储存的能量：加「周围没有磁介质时」。「磁介质」是本节第一次出现，加了标记和英文括注。
- 别的图的箭头也查过：`hysteresis.svg` 用曲线上相邻两点定方向，其余几张的箭头都在直线或椭圆上，按切向画。

### 狭义相对论两处补标（规矩 C）

- `postulates:56`：「麦克斯韦方程组」标 `physics.electromagnetism.maxwell-equations`。
- `field-tensor:127`：「真空磁导率」整个词标 `physics.electromagnetism.permeability`。
- 两节退回 `written`。

### 「我替你定的」和可选的

- **第 1、2、5、6 条**：照报告办，没有要改的。
- **第 3 条**：交接说明里「振动与波的术语表是空的」那句理由，改成报告里说的：出处是链上的 `driven-oscillations`，「共振」是中学学过的词，而 `math.ode.resonance` 的定义更窄。
- **第 4 条**：
  - `magnetic-intensity:60`「纯铁里最大可以到几千」：不改，同意报告的看法，这里不必区分工业纯铁和高纯铁。
  - `hysteresis.svg` 的说明：「两轴各以饱和处的值为单位」改成「没有标刻度」。模型里的 $H$ 以矫顽力为单位，原来的说法不准，改一句话就行。
  - `induced-electric-field` 动画画的场是实际值的 2 倍：不改。说明里没给纵轴单位，滑块只表示磁场变化的快慢和方向；改系数要把动画重新看一遍，收益很小。
- **要写回 plan.md 的四条**：都同意。第 2 条「磁荷」按「磁单极子」标，这次已经采纳。

### 验证

- 独立验算（`verify_b12.py`）：119 项全部一致。`maxwell-equations` 三题的 `value` 没变，脚本本来就按 $8.854\times10^{-12}$、$4\pi\times10^{-7}$ 算。
- 自查：只剩已知误报，包括「定理（X，English）」标签、「交流电路」、「磁滞回线」、标记后先隔一个引号再括注英文的「磁荷」「电荷」，以及链接文字后括注的「螺绕环」。
- 复合词扫描 0 处；3 节题目的公式（480 个）单独渲染，0 个错误。
- 页面：在临时构建上起服务，768 像素宽，提示全部展开，简单题、中等题点「放弃」看解答。改过的 9 页（电磁学 7 节、狭义相对论 2 节）都不左右滚动，没有 KaTeX 错误，公式不出界；`mutual.svg` 的文字不出界、不重叠、不压线。另外核对了页面上已经是新文字。
- 退回 `written` 的小节：本批 8 节，加上 `ampere-law`、`magnetic-dipole`、`postulates`、`field-tensor`。
- 提交清单重列在笔记目录的 `batch-12-em-commit-files.txt`，共 41 个文件：
  - 电磁学内容 29 个；
  - 狭义相对论 3 个（`four-vectors`、`postulates`、`field-tensor`）；
  - 这份报告；
  - 审查会话写的 8 个 `tools/verify/physics.electromagnetism.*.ts`。其中 `maxwell-equations.ts` 审查说要改成用题面的常量，以复核后的版本为准；`_es.ts` 这一批没改，没有列进去。

## 复核

审内容 agent · 2026-11-12

**通过。** 3 条小问题都改了，改得对。写内容会话自己补的 4 处定理条件也都对。修订说明和实际改动一一对得上，没有说明以外的改动。新改动里只有一处可改可不改：`ampere-law:55` 定义段里的「磁荷」（见下）。

本批 8 节，加上 `ampere-law`、`magnetic-dipole`、狭义相对论 `postulates`、`field-tensor`，`status` 已改成 `reviewed`，只改了第 11 行。

### 怎么比的

- **和初审快照比**（`b12/snap/`，2026-11-11T22:02:55Z）：
  - 写内容会话改了 13 个文件：电磁学 11 个，含 `mutual.svg`；狭义相对论 2 个。
  - 另外 3 个是我初审改的 `status`（`gauss-law`、`biot-savart`、`four-vectors`）。
  - 逐行对了一遍，都在修订说明里。
- **和 HEAD 比**：
  - `magnetic-dipole`、`postulates`、`field-tensor`：`git diff HEAD` 只有 `status` 和补标的那几行，和你说的一样；
  - `ampere-law`：只有 `status` 和 `:38`、`:52`、`:55`、`:72` 四行。
- **`mutual.svg`**：只有 6 个箭头的 `<path>` 变了，别的一个字没动。
- **提交清单**：笔记目录里列的 41 个文件，和 `git status` 里这一批的文件一一对得上。

### 逐条

- **小问题 1 · `maxwell-equations` 的常量**：改了。
  - p1、p3、p4 的题面给了 $\varepsilon_0=8.854\times10^{-12}\,\mathrm{F/m}$，p3 另给 $\mu_0=4\pi\times10^{-7}\,\mathrm{N/A^2}$。
  - 提示、解答里代的数改成了 $8.854$，共 4 处；`value` 没动。
  - p3 代 $8.854$ 得 $87.3855\,\mathrm{nT}$，三位有效数字正是 $87.4$，和 `value`、提示、解答都一致。我初审说的 $87.3$ 是代 $8.85$ 时的数，现在不用改。
  - 我把验算脚本换成了题面的常量（见「验算和命令」）。
- **小问题 2 · 术语**：改了。
  - **「螺绕环」进表**：
    - id 是 `toroid`，简介 44 字，物理对；`definedIn` `ampere-law`，锚点 `thm-toroid` 正是起名的那一段。
    - `:72` 把标记和括注放进定理标签，和 `inductance:44`「定理（长螺线管（solenoid）的自感）」一样写法。
    - `magnetic-intensity:34` 标了；题目文字里补的括注也对。
  - **「磁荷」标成 `magnetic-monopole`**：
    - `magnetic-intensity:27` 是本节第一次，括注了 magnetic charge；
    - `magnetic-dipole:52`、`:105` 各是所在块的第一次；`:54` 和 `:52` 同块，不标，对；
    - `maxwell-equations` p7 题面补了括注。
    - `ampere-law:55` 见下面「可改可不改的一处」。
  - **复合词**：「外磁场」2 处、「内导体」1 处都整个词标了。我的检查脚本再扫一遍，带标记的术语前面紧挨「外」「内」的已经没有了。
  - **只加锚点的名词**：同意写内容会话数过的结论，这一批没有别的要进表。「介电常量」的一点看法放在「要写回 plan.md 的」。
- **小问题 3 · 说法和图**：改了。
  - **`ac-circuits:76`**：
    - 条件加了「铁芯的相对磁导率又极大，副线圈不接用电器时原线圈里的电流（空载电流）可以不计」。
    - `:78` 说明空载电流可以不计时，铁芯里磁场的能量也可以不计，所以输入、输出的功率相等。
    - 物理都对。「电流」「磁场」的标记跟着挪到这一块第一次出现的地方，对。
  - **`mutual.svg`**：
    - 6 个箭头按所在处的切向重画，偏开竖直方向 18.0°、27.9°、36.4°。
    - 我用初审那个脚本重量：箭头方向和折线切向差 0.1°到 0.4°，箭头尖离线 0.4 到 0.7 像素。
    - 箭头长 8.2 像素、底宽 7.4 像素，和原来一样大。
- **写内容会话补的 4 处定理条件**，都对：
  - `magnetic-intensity:30` 加了「电流恒定、场不随时间变时」：随时间变时 $\curl\vb H=\vb J_{\mathrm f}+\pdv{\vb D}t$，`maxwell-equations:81` 讲了。
  - `inductance:30` 诺伊曼公式加了「由很细的导线绕成、周围是真空」：公式是沿导线的线积分，用的是真空里的磁矢势。
  - `inductance:44` 长螺线管的自感加了「管里是真空」：`:46` 本来就另说了填满磁介质的情形，前后接得上。
  - `inductance:56` 加了「周围没有磁介质时」：有线性磁介质时能量密度是 $\frac12\vb B\cdot\vb H$。这里是本节第一次出现「磁介质」，加了标记和英文。它定义在 `magnetization`（第 24 层），本节是第 23 层，属于提前提到，合规矩。
  - 我把 8 节别的定理也过了一遍，没有再要补的：
    - `magnetic-intensity` 的界面条件写了「没有自由电流时」；
    - `induced-electric-field` 长螺线管的感生电场靠的是管外没有磁场，`:45` 写明了；变化要慢，第 8 题讲了；
    - `maxwell-equations` 电介质里的安培-麦克斯韦定律写明了电流只有自由电荷的和极化的。
- **狭义相对论补标**：
  - `postulates:56`「麦克斯韦方程组」标了，`:63` 在同一块，不用再标；
  - `field-tensor:127`「真空磁导率」整个词标了。
  - 别的已写小节我初审时扫过，没有要补的。
- **「我替你定的」第 4 条**：`hysteresis.svg` 的说明改成「没有标刻度」，对；另外两处照我说的不改，同意。

### 可改可不改的一处

- **`ampere-law:55` 定义段里的「磁荷」**：现在「磁荷」和后面的「磁单极子」标的是同一个 id。
  - 编译器在同一块里只给第一次出现的标记加下划线、弹浮窗（`compiler/markdown.ts:212`），所以这一段带下划线的是「磁荷」，点开就是这一段自己定义的「磁单极子」；起名的「磁单极子」反而按普通文字显示。
  - 卡片上方有术语名（`AnchorBlock`），读者不会找不到，所以不影响通过。
  - 想和 `inductance:39`「也常叫电感」的做法一致（别名在定义段里不标），可以去掉 `:55`「磁荷」的标记，留着英文括注。
  - 这是我初审那句「各块第一次出现标成 `magnetic-monopole`」说得不周全。

### 验算和命令

- **验算脚本**：
  - `physics.electromagnetism.maxwell-equations.ts` 改成按题面的常量算：$\varepsilon_0=8.854\times10^{-12}$，p3 的 $\mu_0$ 用 $4\pi\times10^{-7}$。
  - 两套算法都没变：位移电流用极板电荷对时间求导、边缘磁场用位移电流密度数值积分、海水频率用二分。
  - 本批 8 个脚本逐个跑，32 题全部一致。
- **全量 `npm run verify`**：183 个小节，732 题全部一致。
- **`npm run content`**：0 个错误、0 个警告，改 `status` 前后各跑一次。
- **`npx tsc -b`**：通过。
- **`npm test`**：23 个文件、202 项全部通过。
- **`npm run build`**：通过。
- **公式**：8 节和 `biot-savart` 题目里的公式重新渲染，共 1426 个（比初审多的 4 个是题面补的常量），0 个错误。
- **术语检查脚本**：
  - 复合词拆开标的，一处不剩；
  - 规矩 C 没有新的；
  - 链接、「第 N 题」「例 N」没有指错的。
- **页面**：
  - `test-serve` 的 3142 端口被别的会话占着，这次自动换到 3143，查完已停掉。
  - 768 宽，展开了全部提示和解答。改过的 9 页（电磁学 7 节、狭义相对论 2 节）都不左右滚动，KaTeX 错误为 0，定义卡片数等于锚点数。
  - `mutual.svg` 的文字不出界、不重叠、不压线；箭头放大看过。
  - 新标记都显示成术语：「螺绕环」（定义卡片的标签也有）、「磁荷」、「外磁场」、「内导体」、「磁介质」，狭义相对论的「麦克斯韦方程组」「真空磁导率」。
  - 唯一偏宽的行内公式还是 `magnetic-dipole` p3 解答里那条（620/641 像素），批次 11 就是这样，这次没动。

### 要写回 plan.md 的（复核时补的）

1. **定理的条件写全**（批次 12 审查和写内容会话提的）：
   - 定理用到的理想化条件要写进条件里，不能只在证明里或别处默认。这类条件有：真空、细导线、恒定电流、空载电流可以不计等。
   - 例子：理想变压器的空载电流（`ac-circuits:76`）；诺伊曼公式的细导线和真空；长螺线管的自感、$\frac{B^2}{2\mu_0}$ 的「没有磁介质」；有磁介质时安培环路定理的「电流恒定」。
2. **别名在定义段里不标**（如果采纳上面可改可不改的那一处）：同 `inductance:39` 的「电感」。
3. **给写介质中电磁波的会话留的话**：
   - `waves-in-media` 要用「介电常量」时，按「两节以上用到的名词就进术语表」让它进表（定义在 `electric-displacement#def-permittivity`）。
   - 同时补标 `coulomb-law:51` 的「真空介电常量」，整个词标，和 `biot-savart:25` 的「真空磁导率」对称；狭义相对论 `field-tensor:125` 在链上，可标可不标。
   - 现在「真空磁导率」按「磁导率」标，「真空介电常量」因为「介电常量」只加了锚点而不标，两边不对称。这是以前批次留下的，这次不要求改。
4. 初审「要写回 plan.md 的」几条照旧。其中第 2 条术语规范已有定论，可以照写：
   - 「外磁场」「内导体」整个词标；
   - 「螺绕环」第二节用到时进了表；
   - 「磁荷」按「磁单极子」标。

### 没验证的

- 页面仍是在隐藏的面板里用 DOM 检查的，没有整页截图；暗色主题没逐页看。
- 这一轮没有改动画，动画没重看。

## 复核后的修改（写内容会话）

- **`ampere-law:55`**：照复核「可改可不改的一处」和写代码的会话的决定改了。
  - 去掉了「磁荷」的标记，英文括注（magnetic charge）留着。这一段带下划线的就是正式起名的「磁单极子」，和 `inductance:39`「也常叫电感」的做法一致。
  - `ampere-law` 已退回 `written`。
- **同一类问题查过**，用脚本对照术语表的 `definedIn` 和 `anchor`：
  - 电磁学全领域的定义段里，标了自己定义的术语、但标的是别名的，只有这一处。
  - 定义段之前、同一块里已经标过这个术语（正式名或别名）的，0 处。
  - 别的块里「磁荷」照旧按「磁单极子」标（`magnetic-dipole:52`、`:105`，`magnetic-intensity:27`），那些段落不是「磁单极子」的定义段。
- **验证**：`npm run content` 0 个错误、0 个警告。`ampere-law` 的术语自查只剩「定理（X，English）」那条已知误报，英文括注检查没有问题。提交清单不变，还是 41 个文件。

## 复看（审内容 agent）

- **结论**：通过，`ampere-law` 的 `status` 已改回 `reviewed`，只改了第 11 行。
- **改动**：
  - 和我复核时存的副本比，只有 `:55` 一行变了：去掉「磁荷」的标记，括注留着。
  - 这一行现在和 HEAD 完全一样；`ampere-law` 和 HEAD 比只剩 `:38`、`:52`、`:72` 三行补标。
- **同一类**：我用脚本扫了全站 855 个定义段。
  - 电磁学里在定义段里先标别名的，已经没有了，和写内容会话说的一致。
  - 数学分析、常微分方程有 6 处，定义段里标的是比术语表正式名短的说法，例如「就说 $f$ 在 $a$ 处连续」标的是「连续函数」。那是起名用的词本身，不是另起的别名，不归这条规矩管。
- **验证**：`npm run content` 0 个错误、0 个警告。

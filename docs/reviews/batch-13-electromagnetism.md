# 批次 13 审查报告：电磁学与电动力学（守恒律与电磁波 9 节）

审内容 agent（和写内容 agent 是两个独立会话，没有读它的会话记录、交接说明和自查脚本）· 2026-11-12

审查范围：`content/physics/electromagnetism/` 下 9 节：`gauge-potentials`、`poynting-theorem`、`em-waves`、`em-wave-energy`、`field-momentum`、`waves-in-media`、`fresnel-equations`、`skin-effect`、`dispersion`。每节都看了 `lesson.md` 和 `problems.yaml`。另外看了：

- 4 张 SVG、7 个动画；
- `_domain.yaml` 新增的 12 个术语；
- 退回 `written` 的已审小节里补标的地方：`coulomb-law:51`、`electric-displacement:44`、`electrostatic-energy:48`、`maxwell-equations:65`、`:81`、`vector-potential:46`；
- plan 列出的指向这一批的链接和用法（电磁学、狭义相对论、分析力学）。

## 结论

重要 0 条，小问题 3 条（同一类合成一条）。

- **验算**：36 道简单题、中等题全部和独立验算一致。其中 `skin-effect` 第 3 题的题面和标准答案用的近似对不上（小问题 1）。
- **难题、思考题**：36 题的参考解答和三级提示逐题读过，推导都对。
- **小问题 1 · 题目**：`skin-effect` 第 3 题。照题面字面算导电层的面积，得 $7.93$，标准答案 $7.67$ 用的是 $2\pi a\delta$，差 3.4%，超过容差，会判错。
- **小问题 2 · 术语**：
  - 规矩 C 漏标 3 处：`poynting-theorem:36`、`field-momentum:45` 的「能量-动量张量」，`gauge-potentials:36` 的「拉格朗日量」。
  - 复合词拆开标 3 处：`field-momentum:55`、`:71` 的「放电电流」，`skin-effect:116` 的「直流电流」。
  - 标错 1 处：`skin-effect:48` 把「电磁场」里的「磁场」标成了 `magnetic-field`。
  - 两节用到的名词没进表：「复波数」（`skin-effect:25` 起名，`dispersion:29` 又用）。
- **小问题 3 · 说法**：
  - `skin-effect:34`「海水在约 900 MHz 以下算良导体」和上一段的定义 $\sigma\gg\varepsilon\omega$ 不符。
  - `field-momentum:45` 把 $\vb g$ 说成能量-动量张量的分量，差一个因子 $c$。
  - `em-waves:54`「各种频率的速度都是 $c$，所以光速不变成了狭义相对论的出发点」，推理跳了一步。
- 你点名要查的几件事：
  - **退回的已审小节**：5 节的补标都对，和你的说明一致，没有多出的改动。已改回 `reviewed`，只改了第 11 行。
  - **12 个新术语**：
    - 简介都在 60 字以内（最长 45）；
    - 锚点都落在起名的那一段；
    - 各简介的物理都对。
  - **前置**：9 节都没改，没有悬空的 id。
  - **指向这一批的链接**：plan 列的都接住了（见「前置」）。
  - **写内容会话、你定的取舍**：都妥当（见「记号与约定」）。
    - 你定的「色散」只加锚点：同意。电磁学里只有 `dispersion` 一节在正文里用这个名词。
    - p 偏振照 Griffiths 的约定：图、定理、题目三处一致，`fresnel-p.svg` 的每个箭头都核过。
  - **动画**：7 个都把滑块拉到两端，导出画布看过，和说明一致。
  - **史实和数字**：查了来源的 6 条（洛伦茨 1867、坡印亭 1884、TSI 1361 W/m²、N-BK7 的折射率、熔融石英的介电常量、硅钢的参数）都对。
- 修完以后 9 节都可以标 `reviewed`。`em-wave-energy`、`waves-in-media`、`fresnel-equations` 这三节没有要改的。

| 小节 | 重要 | 小问题 |
| --- | --- | --- |
| `gauge-potentials` 电磁势与规范变换 | 0 | 1（2 拉格朗日量） |
| `poynting-theorem` 坡印亭定理 | 0 | 1（2 能量-动量张量） |
| `em-waves` 真空中的电磁波 | 0 | 1（3 光速不变的推理） |
| `em-wave-energy` 电磁波的能量与强度 | 0 | 0 |
| `field-momentum` 电磁场的动量 | 0 | 2（2 能量-动量张量、放电电流；3 $\vb g$ 不是分量） |
| `waves-in-media` 介质中的电磁波 | 0 | 0 |
| `fresnel-equations` 界面上的反射与折射：菲涅耳公式 | 0 | 0 |
| `skin-effect` 导体中的电磁波与趋肤效应 | 0 | 3（1 第 3 题；2 电磁场、直流电流、复波数；3 海水算良导体的频率） |
| `dispersion` 介质的色散 | 0 | 1（2 复波数） |

## 怎么审的

- 读了 `docs/plan.md` 已提交的规矩：4db7613（批次 12 的写回）、d9ee1e8（批次 13 的安排）。4db7613 新加的几条都照着查了：
  - 定理里写出理想化条件；
  - 别名在它所指术语自己的定义段里不标；
  - 复合词的例子（「外磁场」「内导体」）。
- **快照**：初审开始时把 `content/physics/electromagnetism/` 拷到我的 scratchpad 的 `b13/snap/`，时间是 2026-11-12T02:19:41Z。`git diff HEAD` 的输出也存了一份。审完时和快照比过，除了我改的 5 行 `status`，内容没有变。
- **改动范围**：
  - `git diff HEAD` 有：
    - 9 节的 `lesson.md`（从 outline 写成 written）；
    - `_domain.yaml`（末尾加了 12 个术语，宏没动）；
    - 5 节已审小节的补标和第 11 行：`coulomb-law:51`、`electric-displacement:44`、`electrostatic-energy:48`、`maxwell-equations:65`、`:81`、`vector-potential:46`。
  - 9 份 `problems.yaml`、4 张 SVG 是新文件，直接读。
  - 狭义相对论、分析力学这一批没有改动。
  - 和你的说明比，没有多出的改动。
- 逐节读讲解、例题、常见误区，推导逐步核对，例题的数都重算过。
- **简单题、中等题**：只用 `npm run statements` 读题，写完验算脚本、跑出结果以后才打开 `problems.yaml`。
- **难题、思考题**：36 题的参考解答连同三级提示全部读了。关键的式子另外推过：
  - 规范变换后的洛伦茨条件、剩余的规范自由（$\chi$ 满足无源波动方程）、洛伦茨规范下两个方程和规范条件要求电荷守恒；
  - 静止的带电球和磁铁旁 $\divg\vb S=0$，场的动量在去磁时交给电荷；
  - 圆偏振的 $\vb B=\frac1c\uv z\times\vb E$；驻波的 $\vb S=\varepsilon_0cE_0^2\sin2kz\sin2\omega t\,\uv z$ 和半个波长里的总能量不变；
  - 斜射的辐射压强 $\frac Ic\cos^2\theta$ 和切向分量 $\frac Ic\cos\theta\sin\theta$；尘埃的光压和引力之比 $0.574$；
  - 菲涅耳公式的 $R+T=1$；掠射时 $r_{\mathrm s}\to-1$、$r_{\mathrm p}\to1$；全反射的衰减长度 $225\,\mathrm{nm}$ 和 $|r_{\mathrm s}|=1$（复振幅里 $B_x=\frac{i\kappa}\omega E_y$、$n_2\cos\theta_{\mathrm T}\to-i\beta$ 的正负号逐个对过）；$80^\circ$ 时自然光约 $35\%$ 被水面反射；
  - 完整复波数的 $k$、$\kappa$ 和不良导体极限 $\kappa\approx\frac\sigma2\sqrt{\frac\mu\varepsilon}$（$10\,\mathrm{GHz}$ 时近似值 $84.24$，精确值 $84.18\,\mathrm{m^{-1}}$）；良导体的 $1-R\approx\frac{2\omega\delta}{c}=2.7\times10^{-4}$；硅钢片 $\delta\approx0.8\,\mathrm{mm}$；银 $1\,\mathrm{GHz}$ 时 $\delta\approx2.0\,\mu\mathrm m$；
  - 振子模型推出的柯西公式系数和 $\lambda_0\approx91\,\mathrm{nm}$；自由电子气的 $|\tilde r|=1$ 和 $v_{\mathrm p}v_{\mathrm g}=c^2$。
- **公式**：构建不渲染参考解答。我把 9 节 `problems.yaml` 里所有文字的公式都用编译器的 `compileTex` 加本领域的宏渲染了一遍，再跑 `suspectTex`。共 1274 个公式（参考解答 412 个），0 个错误，没有可疑写法。
- **引文和链接**：用脚本把 9 节讲解、题目里的链接全部列出，核对目标小节、锚点是否存在；链接后面的「第 N 题」「例 N」和本节的「第 N 题」「例 N」逐个对照题目、例题的内容。没有指错的。
- **图**：4 张 SVG 用无头 Edge 渲染成 PNG 看过，再按坐标反算（见「几何图像」）。
- **术语和格式**：沿用以前批次的检查脚本，讲解和题目文字都查：
  - 每节第一次标记带不带英文，每块第一次出现标没标；
  - 带标记的术语和紧挨着的一到四个字拼不拼成别的术语；
  - 规矩 C 对照前置链查；
  - 段落句数、空格、引号；
  - 12 个新术语在批次 9–12 已写的电磁学小节里有没有要补标的地方，以及别的领域已写小节的正文里有没有用到这 12 个词。
- **前置**：比较 HEAD 和现在的前置，逐节列出链上有哪些小节，算了层级。
- **页面**：
  - `npm run build` 后用 `.claude/launch.json` 的 `test-serve` 打开，进度写临时仓库，查完已停掉。
  - 这次会话窗口没打开，面板是隐藏的：页面都用 DOM 检查。
  - 动画用假的 `requestAnimationFrame` 推帧，把画布导出成 PNG 看。
- **跑过的命令**：
  - `npm run content`：0 个错误、0 个警告。
  - 本批 9 个验算脚本逐个单独跑：36 题一致。
  - 全量 `npm run verify`：201 个小节、804 题全部一致。
  - `npx tsc -b`：通过。
  - `npm run build`：通过。这次全量构建没被多变量微积分卡住，没用临时副本。
  - `npm test`：23 个文件、202 项全部通过。

## 简单题、中等题的验算

脚本在 `tools/verify/physics.electromagnetism.<小节>.ts`，辅助文件 `_es.ts` 这一批没改。两套算法互相独立：

1. **公式**：讲解里的式子。
2. **不用这些式子的算法**：
   - **规范变换**：
     - 由磁矢势数值求旋度、对时间中心差分，直接算场；
     - 第 3 题把新势里的 $\vb E$ 对时间数值积分；
     - 第 4 题用龙格-库塔法积分洛伦茨条件 $\pdv\varphi t=-c^2\divg\vb A$，散度用中心差分。
   - **坡印亭定理**：
     - 场的方向用罗德里格斯转动算叉乘；
     - 第 3、4 题用能量守恒：侧面流进的功率等于焦耳热或电场能量的增加率。
   - **电磁波**：
     - 由色散关系 $k^2=\mu_0\varepsilon_0\omega^2$ 求波长；
     - 第 3 题由法拉第定律 $\pdv{B_x}t=\pdv{E_y}z$ 对时间积分一个周期，减去平均值；
     - 第 4 题对 $\cos kz$ 找最大值点得波长。
   - **能量与强度**：坡印亭矢量、能量密度对一个周期数值平均，再对 $E_0$、$r$ 二分。
   - **场的动量**：吸收功率除以 $c$ 改成由能量密度的时间平均乘以面积算动量流；第 4 题在 1 AU、3 AU 两处算比值，验证和距离无关。
   - **介质**：对 $k$ 二分，使 $k^2=\varepsilon_{\mathrm r}\mu_{\mathrm r}\frac{\omega^2}{c^2}$，再 $v=\frac\omega k$、$\lambda=\frac{2\pi}k$。
   - **菲涅耳公式**：
     - 第 1 题用费马原理：对界面上的通过点做黄金分割搜索，使光程最短；
     - 第 3、4 题直接解界面条件：$\vb E$、$\vb H$ 的切向分量连续，对 s、p 两种偏振各列一个二元线性方程组。
   - **趋肤效应**：
     - 不用良导体近似，由完整的 $\tilde k^2=\mu\varepsilon\omega^2-i\mu\sigma\omega$ 复数开方，$\delta=\frac1\kappa$；
     - 第 4 题用龙格-库塔法积分 $\pdv{\rho_{\mathrm f}}t=-\frac\sigma\varepsilon\rho_{\mathrm f}$，二分出降到 $\frac1e$ 的时刻。
   - **色散**：
     - 第 1 题把 $\dv n\lambda=-\frac{2B}{\lambda^3}$ 从 $700\,\mathrm{nm}$ 积到 $400\,\mathrm{nm}$；
     - 第 3、4 题对电子密度或频率二分，使自由电子气的 $\varepsilon_{\mathrm r}=0$。

| 小节 | p1 | p2 | p3 | p4 |
| --- | --- | --- | --- | --- |
| `gauge-potentials` | $7.85398\,\mathrm{V/m}$ ✓ | A、B、D ✓ | $10.0\,\mathrm{T\,m}$ ✓ | $-135\,\mathrm V$ ✓ |
| `poynting-theorem` | $795.775\,\mathrm{W/m^2}$ ✓ | A、C、D ✓ | $397.887\,\mathrm{W/m^2}$ ✓ | $2.2135\,\mathrm{W/m^2}$ ✓ |
| `em-waves` | $12.2449\,\mathrm{cm}$ ✓ | A、C、D ✓ | $-14.1421\,\mathrm{nT}$ ✓ | $(1.25664\,\mathrm m,\ 238.732\,\mathrm{MHz})$ ✓ |
| `em-wave-energy` | $1.37200\,\mathrm{kV/m}$ ✓ | A、C、E ✓ | $(867.730\,\mathrm{V/m},\ 320\,\mathrm W)$ ✓ | $77.4069\,\mathrm m$ ✓ |
| `field-momentum` | $3.33333\,\mathrm{nN}$ ✓ | A、B、D、E ✓ | $0.907333\,\mathrm{mm/s^2}$ ✓ | $0.574050$ ✓ |
| `waves-in-media` | $1.23967\times10^8\,\mathrm{m/s}$ ✓ | A、B、D ✓ | $(441.860\,\mathrm{nm},\ 509.338\,\mathrm{THz})$ ✓ | $(109.545,\ 2.73861\,\mathrm m)$ ✓ |
| `fresnel-equations` | $32.1176^\circ$ ✓ | A、B、D ✓ | $17.2395\%$ ✓ | $(17.6571\%,\ 0.180194\%)$ ✓ |
| `skin-effect` | $11.5922\,\mathrm{mm}$ ✓ | A、C、E ✓ | $7.66961$ ✓（见小问题 1） | $0.17708\,\mathrm{ns}$ ✓ |
| `dispersion` | $0.0177628$ ✓ | A、B、D ✓ | $6.07912\times10^{11}\,\mathrm{m^{-3}}$ ✓ | $205.268\,\mathrm{nm}$ ✓ |

- 题面给了常量的，脚本都按题面的值算（批次 11 写回的规矩）。
- **选择题**：逐项用例子核对，例子写在脚本的 `notes` 里。
  - `poynting-theorem` p2 B：静电场加静磁场的反例，场的能量不变、流进的能量为零，说法不成立。
  - `skin-effect` p2：用铜在 $1\,\mathrm{kHz}$ 到 $1\,\mathrm{GHz}$ 的完整复波数核对。$\tilde k$ 的辐角是 $-45^\circ$，磁场落后，所以 D 错。磁场和电场能量密度之比 $\frac{|\tilde k|^2}{\mu\varepsilon\omega^2}=\sqrt{1+\bigl(\frac\sigma{\varepsilon\omega}\bigr)^2}$，良导体里就是 $\frac{\sigma}{\varepsilon\omega}$。
  - `fresnel-equations` p2 D：$n=1.5$ 时 $R_{\mathrm s}$ 在 $0^\circ$–$89^\circ$ 每隔 $1^\circ$ 都比前一个大。
  - `dispersion` p2 B：$\gamma=0.05\omega_0$ 时吸收峰的位置和 $\omega_0$ 差不到 0.1%。

## 前置

- **9 节的前置都没改**（`git diff` 里没有 `prerequisites` 行），没有悬空的 id。
  - 层级：`gauge-potentials`、`poynting-theorem`、`em-waves` 第 25 层；`em-wave-energy`、`waves-in-media` 第 26 层；其余 4 节第 27 层。
  - `summary` 都在 30 字以内（最长 30）。
- **跨领域前置**：`em-waves` ← 振动与波 `waves-in-3d`，`fresnel-equations` ← `reflection-transmission`，`dispersion` ← `driven-oscillations`。三节都还是 outline，按它们的 goal 假定读者学过。
- **链外用到的，看过、不用改的**：
  - **`skin-effect` 的复数表示**：链接的 `ac-circuits` 不在链上。可链上有 `phasors`，`:22` 也把约定 $\operatorname{Re}\bigl(\tilde{\vb E}e^{i\omega t}\bigr)$ 写了出来，不用加前置。
  - **`dispersion:98` 的群速度**：`group-velocity` 不在链上，括注了英文、加了链接。这是「以后会讲」的旁白，振动与波的表里还没有这个词。
  - **`fresnel-equations:43` 的费马原理**：链到光学（outline），只作史实。
- **指向这一批的链接**（plan 列的），都接住了：
  - **`gauge-potentials`**：
    - `:25` 写了 $\vb E=-\nabla\varphi-\pdv{\vb A}t$，接住狭义相对论 `field-tensor:79` 和 `induced-electric-field` 第 8 题；`:104` 又链回第 8 题。
    - `:32` 的规范变换 $\varphi'=\varphi-\pdv\chi t$、$\vb A'=\vb A+\nabla\chi$，和分析力学 `charged-particle-lagrangian:68` 一致。
    - 和 `field-tensor:79`、`:82` 的 $A^\mu\to A^\mu-\partial^\mu\chi$ 也一致：度规是 $(+,-,-,-)$，$\partial^\mu=\bigl(\frac1c\pdv{}t,-\nabla\bigr)$，空间分量正好是 $+\nabla\chi$。
    - `:22`、`:27` 由 $\divg\vb B=0$、$\curl\vb E=-\pdv{\vb B}t$ 引出势，接住 `covariant-maxwell:46`。
    - 「库仑规范」进了表，`vector-potential:46` 补标了。洛伦茨规范在 `:58` 讲了。
  - **`poynting-theorem`**：
    - `current-density` 第 8 题 → `:42`；
    - `electrostatic-energy:99` → 整节；
    - `inductance` 的 $\frac{B^2}{2\mu_0}$ → `:16`，链到 `thm-magnetic-energy-density`；
    - `covariant-maxwell` 第 8 题 → `:36`，$u$ 和 $\frac{\vb S}c$ 是分量，和那里的 $cT^{0i}_{\text{场}}=S_i$ 一致。
  - **`em-waves`**：
    - `maxwell-equations:65` → `:22`–`:25` 的 $c=\frac1{\sqrt{\mu_0\varepsilon_0}}$；
    - 第 7 题 → `:45` 的对称；
    - `biot-savart:27` → `:34`；
    - `electric-field:29`、第 7 题 → `:32`；
    - 狭义相对论 `postulates:56` → `:54` 回链。
  - **`field-momentum`**：`electric-field` 第 7 题 → `:16`、`:49`，守恒的是电荷和场合起来的动量。
  - **`waves-in-media`**：
    - `maxwell-equations:81` → `:25` 的 $\curl\vb H=\vb J_{\mathrm f}+\pdv{\vb D}t$；
    - 第 4 题 → `:55`；
    - `polarization` 第 7 题 → `:51`；
    - 「介电常量」进了表，`coulomb-law:51` 的「真空介电常量」整词补标了。
  - **`skin-effect`**：
    - `induced-electric-field` 第 5 题 → `:61` 和第 7 题；
    - `conductors` 第 7 题 → `:50`；
    - `:22` 说明 $\sigma$ 是电导率，不是面电荷密度。
  - **`dispersion`**：`polarization` 第 7 题 → `:53`。
- **以这一批为前置、还没写的小节**：
  - 电磁学 `retarded-potentials`（批次 14）；
  - 量子力学 `aharonov-bohm`；
  - 光学 `polarization`、`brewster-angle`；
  - 热学 `blackbody-radiation`。
  这一批指向它们的话，见「要写回 plan.md 的」。

## 逐节

### physics.electromagnetism.gauge-potentials 电磁势与规范变换

- 两个定理和证明思路都对：
  - 规范变换不改变场；
  - 库仑规范下 $\lap\varphi=-\frac\rho{\varepsilon_0}$，$\lap\vb A-\frac1{c^2}\frac{\partial^2\vb A}{\partial t^2}=-\mu_0\vb J+\frac1{c^2}\nabla\pdv\varphi t$。
- 洛伦茨规范的定义段和两个有源波动方程（`:58`–`:61`）对。
- 例 1：匀强电场的两组势。例 2：平面波的势，$\omega=ck$、$\vb E\perp\vb B$、比值 $c$，对。
- 第 4 题写内容会话自己把 $-0.135\,\mathrm V$ 改成 $-135\,\mathrm V$，改得对。
- 第 7 题：阿哈罗诺夫—玻姆 1959、外村彰 1986。
- 动画 $s=0$、$1$ 两端看过（见「几何图像」）。
- 小问题 2：`:36` 的「拉格朗日量」。

### physics.electromagnetism.poynting-theorem 坡印亭定理

- 定理的推导对。
- 例 1：电阻丝侧面流进 $\frac{I^2R}{2\pi al}\cdot2\pi al=I^2R$。
- 例 2：充电电容器侧面流进的功率等于 $\dv{}{t}\bigl(\frac{\varepsilon_0}2E^2\bigr)\cdot\pi R^2d$，并说明了磁场能量是高阶小量，对。
- `poynting-circuit.svg` 的方向对（见「几何图像」）。
- 第 8 题：静电荷加磁铁时 $\divg\vb S=0$，场储存的动量在去磁时交给电荷；和 `field-momentum:49` 互相链上。
- 小问题 2：`:36` 的「能量-动量张量」。

### physics.electromagnetism.em-waves 真空中的电磁波

- 波动方程和平面波定理（「当且仅当」）对。
- `:34`：代入得 $c\approx2.998\times10^8\,\mathrm{m/s}$；1983 年米由光速定义、2019 年以后 $\mu_0$、$\varepsilon_0$ 是测量值，都对。
- 例 1：调频广播 $3.00\,\mathrm m$、$B_0\approx3.3\times10^{-10}\,\mathrm T$。例 2：驻波。
- `em-wave.svg` 的数值核过（见「几何图像」），动画 $r=0$、$1$ 都看过。
- 第 5 题：圆偏振，从 $+z$ 往回看顺时针，对。
- 第 7 题：以太，迈克耳孙—莫雷 1887。
- 小问题 3：`:54`。

### physics.electromagnetism.em-wave-energy 电磁波的能量与强度

- 能量密度相等、$\vb S=cu\,\uv n$、强度 $\frac12c\varepsilon_0E_0^2$，对。
- 例 1：阳光 $E_0\approx1.01\times10^3\,\mathrm{V/m}$、$B_0\approx3.4\,\mu\mathrm T$、$\langle u\rangle\approx4.5\,\mu\mathrm{J/m^3}$。
- 例 2：$50\,\mathrm{kW}$ 电台在 $10\,\mathrm{km}$ 处 $0.17\,\mathrm{V/m}$。
- 第 5 题：驻波的能量密度、$\vb S$ 和总能量，对。
- 动画两端看过。没有要改的。

### physics.electromagnetism.field-momentum 电磁场的动量

- 「吸收电磁波得到的动量」把「电荷速度远小于光速、垂直于传播方向」写进了定理。
- 动量密度 $\vb g=\varepsilon_0\vb E\times\vb B$、辐射压强 $\frac Ic$ 和 $\frac{2I}c$，对。
- 例 1：太阳帆 $1.8\times10^{-3}\,\mathrm N$，约 $0.18\,\mathrm g$ 的重力。
- 例 2：电容器的场动量 $QBd$ 等于放电时的冲量 $\int IdB\,\dd t$。
- `capacitor-in-field.svg` 的方向对。
- 题：第 4 题尘埃 $0.574$，第 5 题斜射，第 8 题彗尾，对。
- 小问题 2：`:45` 的「能量-动量张量」，`:55`、`:71` 的「放电电流」。小问题 3：`:45` 的 $\vb g$。

### physics.electromagnetism.waves-in-media 介质中的电磁波

- 介质中的方程组、波速定理（把「$\varepsilon$、$\mu$ 不随频率变」写进了条件）、折射率的定义，对。
- 例 1：玻璃里 $400\,\mathrm{nm}$、频率不变。例 2：水的 $1.78$ 和 $80$。
- 题：
  - 第 2 题 E 的熔融石英 $n^2\approx2.1$、静电约 $3.8$，查了来源；
  - 第 6 题波阻抗 $377\,\Omega$、玻璃 $251\,\Omega$；
  - 第 8 题二次谐波（弗兰肯 1961）。
- 动画 $n=1$、$2.5$ 看过：反射、透射系数的正负和界面连续都对。没有要改的。

### physics.electromagnetism.fresnel-equations 界面上的反射与折射：菲涅耳公式

- 三个定理（界面条件、反射与折射定律、菲涅耳公式）的条件都写全了。
- 例 1：窗玻璃每面 4%、透过 92%。例 2：水面 $45^\circ$，$R_{\mathrm s}\approx5.2\%$、$R_{\mathrm p}\approx0.27\%$，反射光里 s 偏振约 95%，都对。
- `fresnel-p.svg` 的每个箭头、⊙⊗ 都由 $\vb k\times\vb E$ 核过，按图的约定解出的 $r_{\mathrm p}$ 和定理一致。
- 第 8 题（3）主动说明了「半波损失」对 p 偏振要靠约定，好。
- 动画 $\frac{n_2}{n_1}=0.5$、$1$、$2.5$ 看过。没有要改的。

### physics.electromagnetism.skin-effect 导体中的电磁波与趋肤效应

- 复波数定理（虚部为负、取实部为正的根）和良导体定理（$k\approx\kappa$、磁场落后 $45^\circ$、$\frac{B_0}{E_0}=\sqrt{\frac{\mu\sigma}\omega}$），对。
- 例 1：铜 $50\,\mathrm{Hz}$ 时 $9.2\,\mathrm{mm}$、$1\,\mathrm{GHz}$ 时约 $2\,\mu\mathrm m$。
- 例 2：海水 $76\,\mathrm{Hz}$ 时 $28.9\,\mathrm m$、$20\,\mathrm{kHz}$ 时 $1.78\,\mathrm m$，$100\,\mathrm m$ 深处剩 3%。
- 题：
  - 第 5 题的完整 $k$、$\kappa$ 和两个极限；
  - 第 6 题良导体反射率；
  - 第 7 题硅钢片；
  - 第 8 题镀银、空心铜管、利兹线。
  都对。
- 动画 $s=0$、$0.25$、$1$ 看过。
- 小问题 1：第 3 题。小问题 2：`:48`、`:116`，「复波数」。小问题 3：`:34`。

### physics.electromagnetism.dispersion 介质的色散

- 振子模型定理把「介质足够稀薄、磁场的力不计」写进了条件。$\tilde\varepsilon_{\mathrm r}$ 的虚部为负，和 $e^{i\omega t}$ 的约定配套。
- 例 1：柯西公式拟合 N-BK7。$n_{\mathrm F}$、$n_{\mathrm C}$、$n_{\mathrm d}$ 和 SCHOTT 数据表一致，$B\approx4.22\times10^3\,\mathrm{nm^2}$、$A\approx1.5045$、$n_{\mathrm d}$ 差约 $6\times10^{-5}$。
- 例 2：电离层 $f_{\mathrm p}\approx9.0\,\mathrm{MHz}$、$100\,\mathrm{MHz}$ 时 $n\approx0.996$。
- 题：
  - 第 5 题 $\lambda_0\approx91\,\mathrm{nm}$、塞尔迈耶尔公式；
  - 第 6 题 $v_{\mathrm p}v_{\mathrm g}=c^2$；
  - 第 7 题水在约 $20\,\mathrm{GHz}$ 的弛豫；
  - 第 8 题牛顿 1672、石英 $1.3\,\mu\mathrm m$ 零色散。
- 动画 $\frac\gamma{\omega_0}=0.05$、$0.5$ 看过，纵轴单位在说明里写明了。
- 小问题 2：`:29` 的「复波数」。

## 小问题 1 · 题目（汇总）

**`skin-effect` 第 3 题：题面的模型和标准答案用的近似对不上**（`problems.yaml:55`）。

- **题面**：「把电流看成均匀分布在导线表面厚为 $\delta$ 的一层里（$\delta$ 是趋肤深度，远小于导线半径），估计导线的交流电阻是直流电阻的几倍，保留三位有效数字」。
- **标准答案**：$\frac{a}{2\delta}=7.67$，用的截面积是 $2\pi a\delta$（提示 1）。
- **问题**：
  - 照字面算那一层的面积 $\pi\bigl(a^2-(a-\delta)^2\bigr)=2\pi a\delta-\pi\delta^2$，比值是 $7.93$。
  - 和 $7.67$ 差 3.4%，容差是 0.5%，会判错。
  - 这一题 $\frac\delta a=0.065$，「远小于」不足以让读者知道该丢掉 $\delta^2$ 项，何况要三位有效数字。
- 用贝塞尔函数的精确解核对：$\frac{R_{\text{交}}}{R_{\text{直}}}=\operatorname{Re}\Bigl[\frac{\tau a}2\frac{J_0(\tau a)}{J_1(\tau a)}\Bigr]$，$\tau=\frac{1-i}\delta$，算得 $7.926$。
  - 照字面算的环形面积 $7.93$ 反而只差 0.03%；
  - 渐近式 $\frac a{2\delta}+\frac14$ 也是 $7.92$；
  - 标准答案是最低阶的近似。
- **建议**：题面写明「导电层的截面积按周长乘厚度 $2\pi a\delta$ 算」。
  - 答案、提示、解答都不用改，和讲解 `:59` 也一致。
  - 也可以反过来把答案改成环形面积的 $7.93$，提示 1–3 和解答要跟着改。
  - 我推荐前者，改动最小。

## 小问题 2 · 术语（汇总）

1. **规矩 C 漏标**（3 处，都是「狭义相对论里……」「分析力学里……」的旁白，正是规矩 C 管的情形）：
   - `poynting-theorem:36`、`field-momentum:45` 的「能量-动量张量」：
     - 狭义相对论表里有 `physics.special-relativity.stress-energy-tensor`；
     - 定义它的 `stress-energy-tensor` 不在这两节的链上，也不是中学词。
   - `gauge-potentials:36` 的「拉格朗日量」：
     - 分析力学表里有 `physics.analytical-mechanics.lagrangian`，分析力学不在链上。
     - 同一个词在 `vector-potential:48` 是标了的。
2. **复合词拆开标**（3 处，照 plan「传导电流」「环形电流」之于「电流」的规矩，整个词带标记）：
   - `field-momentum:55`、`:71`：「放电:term[电流]」改成 `:term[放电电流]{id="physics.electromagnetism.electric-current"}`。
     - `:55` 是本节第一次标，英文括注跟着改成 discharge current。
   - `skin-effect:116`：「直流:term[电流]」改成整词。
     - 同一节的「交流电流」已经整词标成了 `alternating-current`，这里对称地整词标。
     - id 我推荐 `steady-current`（这句说的是 $\omega\to0$ 时的恒定电流），用 `electric-current` 也行。
3. **标错**（1 处）：`skin-effect:48`「为什么这样定义：$\delta$说的是电:term[磁场]能进入导体多深」。
   - 「电磁场」被拆开，「磁场」标成了 `magnetic-field`，浮窗会弹出「磁场」的简介。
   - 「电磁场」不在术语表里，去掉标记即可。这一块别处没有「磁场」，不用另补。
4. **两节用到的名词没进表**：「复波数」。
   - `skin-effect:25` 在定理里起名（括注了 complex wave number），`dispersion:29` 又用：「介质不显磁性时复波数$\tilde k=\dots=k-i\kappa$」。
   - 按「两节以上用到的名词进术语表」（批次 12「螺绕环」的先例）该进表。
   - 锚点用起名那一段的 `thm-conductor-wave`，两处都标上。

## 小问题 3 · 说法（汇总）

1. **`skin-effect:34`**：「边界情况：海水在约 900 MHz 以下算良导体」。
   - 上一段（`:33`）刚定义良导体是 $\sigma\gg\varepsilon\omega$。
   - 900 MHz 是 $\sigma=\varepsilon\omega$ 的频率（`maxwell-equations` 第 4 题），以下只是传导电流占上风；$500\,\mathrm{MHz}$ 时比值只有 $1.8$。
   - 本节自己的例 2（$20\,\mathrm{kHz}$，比值 $4.5\times10^4$）和第 5 题（$1\,\mathrm{MHz}$，约 $900$）才是良导体。
   - 建议改成「海水要在比约 900 MHz（传导电流和位移电流相等的频率）低得多时才算良导体，例如 $1\,\mathrm{MHz}$ 时 $\frac\sigma{\varepsilon\omega}\approx900$（第 5 题）」。
   - `waves-in-media:55` 的说法（「传导电流比位移电流大……更像导体」）是对的，不用改。
2. **`field-momentum:45`**：「$\vb g$、$\frac{\vb S}{c}$和能量密度一起，组成电磁场的能量-动量张量的分量」。
   - $\vb g$ 本身不是分量：能量-动量张量的 $0i$ 分量是 $\frac{S_i}c$，也就是 $cg_i$（`covariant-maxwell` 第 8 题写的是 $cT^{0i}_{\text{场}}=S_i$）。
   - 把 $\vb g$ 和 $\frac{\vb S}c$ 并列，读者会以为是两个不同的分量。
   - `poynting-theorem:36` 写成「$u$和$\frac{\vb S}{c}$是……分量」是对的。
   - 建议改成「能量密度和$\frac{\vb S}{c}$（也就是$c\vb g$）……」，和小问题 2 的补标一起改。
3. **`em-waves:54`**：「它们在真空里的速度都是$c$，所以光速不变成了狭义相对论的出发点」。
   - 「各种频率的速度相同」推不出「光速和参考系无关」。
   - 狭义相对论 `postulates:56` 的说法是「方程里只出现$c$，没有说是相对什么的速度」。
   - 建议改成「它们在真空里的速度都是$c$；方程组只给出这一个$c$，没说它是相对什么的速度，这成了狭义相对论光速不变的出发点（见……）」。

## 记号与约定

写内容会话、你定的取舍，逐条看过：

1. **复数约定**：$\tilde k=k-i\kappa$、$\tilde n=\frac{c\tilde k}\omega$、$\tilde\varepsilon_{\mathrm r}$ 的虚部为负。
   - 和 `ac-circuits:34` 的 $\operatorname{Re}\bigl(\tilde Xe^{i\omega t}\bigr)$ 配套，$e^{i(\omega t-\tilde kz)}$ 在 $\kappa>0$ 时衰减。
   - `skin-effect` 的定理、`fresnel-equations` 第 6 题、`dispersion` 第 6 题三处的 $-i\beta$ 正负号逐个对过，一致。
   - 光学书多用 $e^{-i\omega t}$、$\tilde n=n+i\kappa$，以后光学要统一（见「要写回 plan.md 的」）。
2. **p 偏振照 Griffiths**：
   - 平行于界面的分量都取向右为正，垂直入射时 $r_{\mathrm p}=r_{\mathrm s}$；
   - 图、定理、第 4 题、第 8 题一致。
   - 第 8 题（3）说明了「同向、反向」要靠约定，正好防住读者把它当成绝对的事实。
3. **振子模型取稀薄、不计局域场**：写进了定理（`dispersion:25`）。第 5 题（3）说明玻璃不稀薄、这个估计只给数量级，塞尔迈耶尔公式正是不取稀薄近似的结果（不计局域场时成立）。
4. **`skin-effect` 第 5 题（3）在 $10\,\mathrm{GHz}$ 用直流电导率**：题面写明「三个数都不随频率变」，参考解答末尾补了实际的水在几十吉赫兹的强烈吸收。可以。
5. **复合词整词标**：写内容会话列的 9 个（s 偏振、p 偏振、良导体、交流电流、交流电阻、面电荷密度、传导电流、平面电磁波、静电场）都对。另有 3 处漏了（小问题 2）。
6. **振动与波的词只括注**（受迫振动、共振、相速度、群速度）：同意。振动与波的表里还没有这些词；「共振」照批次 12 的定法。
7. **「（第 N 题）」的引法**：同意，全站惯例。
8. **你定的「色散」只加锚点**（`dispersion:35` 的 `def-dispersion`）：同意。
   - 电磁学里只有 `dispersion` 一节在正文里用「色散」作名词；别的领域只在题目文字里出现（分析力学 `field-lagrangian`、狭义相对论 `velocity-transformation`）。
   - 更一般的意思（$\omega$ 随 $k$ 非线性变化）是振动与波 `dispersion-relations` 要讲的，等它写的时候再定放哪张表。
9. **「良导体」整词标成「导体」**：只在 `skin-effect` 一节用，不用进表。定义段 `:33` 不标，合 4db7613 的别名规矩。

## 格式、术语、证明深度、难度档

- **术语脚本**：
  - **带标记的术语和前后一到四个字拼成别的术语**：找出小问题 2 的 4 处（含「电磁场」）。下面这些是误报：
    - 「匀强」磁场、电场（修饰语）；
    - 「静电」相对介电常量（「静电时的」）；
    - 「来自」位移电流。
  - **每块第一次出现**：这一批 9 节没有漏标的。脚本报的这些都在更长的词里，不算：
    - 「电磁场」里的「磁场」；
    - 「电阻丝」里的「电阻」；
    - 「交流电路」里的「交流电」；
    - 链接文字里的「欧姆定律」「麦克斯韦方程组」。
  - **每节第一次标记带英文**：都带。「规范变换」「坡印亭定理」「麦克斯韦方程组」三处的英文写在定理名的括号里。
  - **批次 9–12 已写的电磁学小节**：12 个新词没有漏标。报的「强度」都在「电场强度」「磁化强度」这类更长的术语里。
  - **规矩 C**：3 处漏标（小问题 2）。下面这些报出来的不算问题：
    - 「尘埃」：狭义相对论的 dust，意思不同；
    - 「同步」：钟的同步，意思不同；
    - 「上和」：「数学上和」，误报；
    - 「余弦」「惯性系」：中学词；
    - 「共振」：见上。
- **12 个新术语**：
  - 简介 21–45 字；
  - 锚点都落在起名的那一段；
  - 物理都对，简介里的记号都是读到定义那一节的读者懂的。
- **文字格式**：段落句数、中英文空格、引号、重复标记、标了不存在的术语，9 节讲解和题目都没有问题。
- **定理的条件**：9 节 16 条定理都把理想化条件写进去了。例如：
  - 稀薄介质、不显磁性；
  - 界面上没有自由电荷和自由电流；
  - $\sigma\gg\varepsilon\omega$；
  - 电荷速度远小于光速；
  - $\varepsilon$、$\mu$ 不随频率变。
- **难度档**：每节简单题、中等题、难题、思考题各 2 道。

## 几何图像

- **4 张 SVG**：用无头 Edge 渲染看过，再按坐标反算。页面上的 SVG 文字不出界、不重叠、不压线（离边最近 6.2）。
  - **`em-wave.svg`**：
    - $\lambda=190$（viewBox 单位），$E$ 的振幅 72，各竖线长度按 $72\cos kz$ 核过；
    - $c\vb B$ 的斜线方向 $(-0.794,0.607)$ 和画出的 $y$ 轴一致，振幅 50（斜投影把 $y$ 轴缩到约 0.69 倍）；
    - $E$、$B$ 同相，$z=0$ 处 $\vb E$ 沿 $+x$、$\vb B$ 沿 $+y$，$\vb E\times\vb B$ 沿 $+z$；
    - $\lambda$ 标在相邻两个波峰之间。
  - **`poynting-circuit.svg`**：
    - 电池正极接上面的导线，电流在上线向右、下线向左；
    - 两线之间 $\vb E$ 向下；
    - 按右手定则，两根导线在中间产生的 $\vb B$ 都向里；
    - $\vb S$ 向右，从侧面流进电阻。
  - **`capacitor-in-field.svg`**：
    - $\vb E$ 向下、$\vb B$ 向里，$\vb g=\varepsilon_0\vb E\times\vb B$ 向右；
    - 放电时丝里电流向下，$I\vb l\times\vb B$ 向右，和例 2 一致。
  - **`fresnel-p.svg`**：
    - 入射角 $50.0^\circ$、折射角 $30.7^\circ$，$\frac{n_2}{n_1}=1.50$；
    - 三个电场箭头都和各自的光线垂直，方向是 $(\cos\theta,\mp\sin\theta)$，平行于界面的分量都向右；
    - 由 $\vb k\times\vb E$ 算出入射波、透射波的磁场向外（⊙），反射波的向里（⊗），和图一致。
- **7 个动画**：都把滑块拉到两端，用假的 `requestAnimationFrame` 推帧，导出画布看过。
  - **`gauge-potentials`**：$s=0$ 时矢势全沿 $x$ 方向，上半向左、下半向右，大小正比于 $|y|$；$s=1$ 时绕原点逆时针转。
  - **`em-waves`**：
    - $r=0$ 时两条曲线重合、向右移；
    - $r=1$、$s=0.25$ 时 $E=2\sin2\pi x$、$B=0$；
    - $s=1$ 时 $E=0$、$cB=2\cos2\pi x$；导体面 $x=0$ 是电场的波节。
  - **`em-wave-energy`**：
    - $r=0$ 时两个能量密度重合，坡印亭矢量等于两者之和；
    - $r=1$、$s=0.15$ 时 $u_E$ 峰 $1.31$、$u_B$ 峰 $0.69$、$S$ 峰 $0.95$，和式子算的一样（滑块步长 0.05，我设的 0.125 被吸到了 0.15）。
  - **`waves-in-media`**：
    - $n=1$ 时没有反射；
    - $n=2.5$ 时左边振幅 $0.571$，右边透射振幅 $0.571$、波长 $0.4$，界面上连续。
  - **`fresnel-equations`**：
    - $0.5$：垂直入射 $0.111$，布儒斯特点 $26.6^\circ$，$30^\circ$ 起全反射；
    - $1$：处处为零；
    - $2.5$：垂直入射 $0.184$，布儒斯特点 $68.2^\circ$。
  - **`skin-effect`**：包络 $\pm e^{-x}$；磁场在表面是 $0.707$，落后 $45^\circ$。
  - **`dispersion`**：
    - $0.05$ 时吸收峰很窄，$n-1$ 在共振处变号，反常色散只在很窄的区间；
    - $0.5$ 时峰宽。
    - 峰高都是 $1$，和说明里的单位 $\frac{Ne^2}{2m\varepsilon_0\gamma\omega_0}$ 一致。
  - 另外用组件自己的解析器在 Node 里把滑块取最小、默认、最大求值：所有曲线、点都在画面内，没有没定义的点。

## 史实和数字

- **查了来源的**：
  - 洛伦茨 1867 年写出推迟势，规范条件在他的结果里成立，后来被误归给洛伦兹：Jackson & Okun，Rev. Mod. Phys. 73, 663 (2001)。
  - 坡印亭的论文 1883 年 12 月收稿、1884 年 1 月宣读，Phil. Trans. 175（皇家学会目录）。亥维赛独立得到见他 1885 年起在 The Electrician 上的文章（二手来源）。
  - 太阳总辐照度 1361 W/m²：IAU 2015 B3 决议取的标称值（第 23 太阳周的平均）。「千分之一左右的起伏」没找到直接来源，按已有知识（约 0.1%）。
  - N-BK7 的 $n_{\mathrm d}=1.51680$、$n_{\mathrm F}=1.52238$、$n_{\mathrm C}=1.51432$：SCHOTT 数据表。
  - 熔融石英 1 MHz 时相对介电常量 3.75–3.8。
  - 硅钢：
    - 电阻率约 48 μΩ·cm（POSCO 数据），$\sigma\approx2.1\times10^6\,\mathrm{S/m}$；
    - 常见片厚 0.27、0.30、0.35 mm；
    - $B_8\ge1.88\,\mathrm T$ 对应 800 A/m 下 $\mu_{\mathrm r}\approx1900$，工作区更高。「约为几千」可以，第 7 题取 4000 的结论对 $\mu_{\mathrm r}$ 到约 $2\times10^4$ 都成立。
- **按已有知识核对的**：
  - 伊本·萨赫勒 984 年前后、斯涅耳 1621、笛卡儿 1637、费马 1662；
  - 菲涅耳 1823、洛伦兹 1875 年的博士论文；
  - 傅科 1850 年测水中光速；柯西约 1836、克里斯蒂安森 1870；
  - 兰姆 1883、亥维赛 1885（趋肤效应）；
  - 麦克斯韦 1873 年的书预言光压，列别捷夫、尼科尔斯和赫尔 1900 年前后测出；
  - 爱因斯坦 1906 年的光盒；IKAROS 2010 年、边长约 14 m；
  - 迈克耳孙—莫雷 1887；Stauffer 1997 年《物理教师》用微波炉测光速；
  - 米 1983 年由光速定义，2019 年 SI 修订；
  - Project ELF 76 Hz、2004 年关闭；阿哈罗诺夫—玻姆 1959、外村彰 1986；
  - 弗兰肯 1961；伍德 1933 年钠膜约 210 nm 起透明；牛顿 1672。
  - 数字：钠的电子密度 $2.65\times10^{28}\,\mathrm{m^{-3}}$、银 $6.3\times10^7\,\mathrm{S/m}$、水的弛豫约 20 GHz、石英约 1.3 μm 零色散。

## 我替你定的（都能改）

1. **退回的 5 节改回 `reviewed`**：`coulomb-law`、`electric-displacement`、`electrostatic-energy`、`maxwell-equations`、`vector-potential`，只改第 11 行。改前的文件存在我的 scratchpad 的 `b13/pre-status/`。
2. **「直流电流」整词标时 id 推荐 `steady-current`**，理由见小问题 2。
3. **「复波数」按小问题报**，不算可改可不改：批次 12 的「螺绕环」就是这样定的。
4. **几处不算问题，没列进小问题**：
   - `capacitor-in-field.svg` 上排在 $(432,32)$ 少画了一个 ⊗。看坐标，像是离右上角导线拐角 40 以内的点都被剔掉了；下排同一列有。纯外观，可改可不改。
   - `em-wave.svg` 里 $c\vb B$ 画得比 $\vb E$ 短（50 对 72），是斜投影把 $y$ 轴缩短了，不影响。
   - `poynting-theorem:31` 的定义说「它穿过一个曲面的通量，是单位时间穿过这个曲面的电磁能量」，`:36` 又说只有闭合曲面的能流有确定的意义。同一节自己讲清了，第 8 题也讨论了，教材通常也是先给解释、再说保留。
   - `dispersion` 动画纵轴的单位里有 $\gamma$，会随滑块变，吸收峰高总是 1。说明里写明了。
   - 4 张图里圆圈同时写了 `style` 和 `fill="var(--bg, #ffffff)"` 属性，页面脚本报「属性里写死颜色」。已审的 17 张 SVG 都这样，`style` 里的变量优先，暗色主题不受影响。
   - 狭义相对论 `postulates:56` 的「电磁波」、`velocity-transformation:88` 的「折射率」是中学词，不按规矩 C 补。

## 要用户决定的

无。

## 要写回 plan.md 的

1. **术语规范补例子**（批次 13 审查时提的）：
   - 复合词：「放电电流」「直流电流」之于「电流」；
   - 反例：「电磁场」不是「磁场」，更长的词意思不同，里面的「磁场」不标；
   - 「两节以上用到的名词进表」补例子「复波数」（如果采纳）。
2. **题目**（批次 13 审查时提的）：用近似式估算的数值题，题面写明按哪个近似算。照字面精确算和近似差得超过容差时，读者会被判错（`skin-effect` 第 3 题：环形面积 7.93 对 $2\pi a\delta$ 的 7.67）。
3. **给以后写的会话留的话**（批次 13 审查时提的）：
   - **电磁学 `retarded-potentials`**（批次 14）：
     - 从 `gauge-potentials:61` 洛伦茨规范下的两个有源波动方程出发；
     - `gauge-potentials` 第 8 题（3）已经说了「某处、某时刻的势只由光从源走到这里所需的时间以前的源决定」；
     - 洛伦茨 1867 年写出推迟势（`:63`），史实要一致。
   - **光学 `brewster-angle`**：
     - p 偏振的正负约定照 `fresnel-equations`：`fresnel-p.svg` 平行于界面的分量都取向右为正，垂直入射时 $r_{\mathrm p}=r_{\mathrm s}$，过布儒斯特角时 $r_{\mathrm p}$ 变号。
     - `fresnel-equations:66` 说「这个角度在[反射偏振与布儒斯特角]里讲」，例 2 和第 4 题已经用到了 $56^\circ$ 这个角，没起名。
   - **光学 `polarization`**：
     - `em-waves` 第 5 题只说「从 $+z$ 往回看，电场顺时针转」，没起左旋、右旋的名字；
     - 讲左旋、右旋时要说明从哪一边看、用的是哪种约定（光学和粒子物理的叫法相反）。
   - **光学 `total-internal-reflection`、`thin-film-interference`**：
     - `fresnel-equations` 第 6 题已经有衰减长度、$|r_{\mathrm s}|=1$ 和受抑全反射；
     - 第 8 题说「半波损失」只在接近垂直入射时才能不加说明地用。
     - 光学如果改用 $e^{-i\omega t}$、$\tilde n=n+i\kappa$，要说明和电磁学的约定差一个共轭。
   - **振动与波 `reflection-transmission`**：
     - `fresnel-equations:57`、第 8 题（2）要用「波从轻的弦传到重的弦上，反射波倒过来」；
     - `waves-in-media` 第 6 题要用「两根弦的阻抗相等时连接处不反射」；
     - 那一节要讲弦的阻抗 $\sqrt{T\mu}$ 和位移反射系数 $\frac{Z_1-Z_2}{Z_1+Z_2}$ 的正负。
   - **振动与波 `group-velocity`**：`dispersion:98`、第 6 题用 $v_{\mathrm p}=\frac\omega k$、$v_{\mathrm g}=\dv\omega k$，「能量和信号以群速度传播」「信号的前沿不超过 $c$」。
   - **振动与波 `driven-oscillations`**：
     - `dispersion` 的振子模型把阻尼力写成 $-m\gamma\dot x$（$\gamma$ 就是批次 12 写回的 $\frac bm$）；
     - 复振幅 $\frac1{\omega_0^2-\omega^2+i\gamma\omega}$ 用 $e^{i\omega t}$ 的约定；
     - 吸收峰宽约 $\gamma$（`dispersion:76`）。
   - **「驻波」「相速度」「群速度」也进振动与波的术语表**：这一批 `em-waves`、`em-wave-energy`、`dispersion` 只括注了英文，同批次 12 的「受迫振动」「共振」。
   - **量子力学 `aharonov-bohm`**：
     - `gauge-potentials` 第 7 题链过去（外村彰 1986 年的实验）；
     - 规范变换写成 $\varphi\to\varphi-\pdv\chi t$、$\vb A\to\vb A+\nabla\chi$，波函数的相位变换要和这个正负号配套。
4. **别的领域的补标**：我扫过别的已写小节，这一批新进表的 12 个词没有要补的：
   - 狭义相对论 `postulates:56` 的「电磁波」、`velocity-transformation:88` 的「折射率」是中学词；
   - `covariant-maxwell`、`field-tensor` 的「洛伦茨规范」「真空介电常量」在链上；
   - 狭义相对论 `stress-energy-tensor`、分析力学 `field-lagrangian:57` 的「动量密度」意思更宽：一般物质的动量密度，或者拉格朗日密度的正则动量，不是电磁场的；
   - 「强度」在别处都是「捕捞强度」「电场强度」这类别的意思。

## 没验证的地方

- **页面**：
  - 是在隐藏的面板里看的（会话窗口没打开），只做了 DOM 检查，没有整页截图。
  - 动画用假的 `requestAnimationFrame` 推帧、把画布导出成 PNG 看，实际帧率没看。导出的画布是透明底，亮色、暗色主题没分别看。
- **SVG**：用无头 Edge 渲染看的是亮色。暗色主题下它们用的都是 `currentColor` 和页面变量，没逐张看。
- 手机宽度、iPad、Safari 没测。
- **史实**：只检索了「史实和数字」里注明来源的六条，其余按已有的知识核对。
- **`skin-effect` 第 3 题的精确值**：贝塞尔函数是我自己用级数算的。低频时比值趋于 1 的检查通过了，没有拿现成的库再核一遍。
- **跨领域补标**：多变量微积分那边要补的 `poisson-equation:65`、`:91`「鞍点」，按你的安排在修订轮做，复核时再看。

## 修订说明（写内容会话）

3 条小问题都改了。同一类问题在这一批里另外找到 1 处（`em-waves:102`「合磁场」拆开标），一并改了；可改可不改的 `capacitor-in-field.svg` 少画的 ⊗ 也补上了。跨领域补标照安排做了 `poisson-equation` 的「鞍点」，这一节退回 `written`。改完 `npm run content` 0 个错误、0 个警告；写内容会话的独立验算 247 项、审查的 9 个 `tools/verify/physics.electromagnetism.*.ts` 都一致。

### 小问题 1 · 题目

- `skin-effect` 第 3 题题面改成「（$\delta$是趋肤深度，远小于导线半径$a$），这一层的截面积按周长乘厚度$2\pi a\delta$算，估计……」。答案、提示、解答都没动。
- 同一类问题查过：9 节别的简单题、中等题里用到模型或近似的，题面都写明了：
  - `skin-effect` 第 1 题用良导体的$\delta$，和完整的复波数只差约$10^{-17}$；
  - `dispersion` 第 3、4 题写了「看成自由电子气，阻尼不计」；
  - `field-momentum` 第 1、4 题写了「完全吸收」，`em-wave-energy` 第 1 题写了「光在截面上均匀分布」，`waves-in-media` 第 4 题写了「电导率可以不计」。
  - 别的题没有近似。

### 小问题 2 · 术语

- **规矩 C 补标 3 处**：
  - `gauge-potentials:36`「拉格朗日量」标 `physics.analytical-mechanics.lagrangian`。这是本节第一次出现，补了括注，写成「（Lagrangian，见[……]）」。
  - `poynting-theorem:36`、`field-momentum:45`「能量-动量张量」标 `physics.special-relativity.stress-energy-tensor`，英文括注原来就有。
  - 同一类问题查过：写了一个扫描，读全部领域的术语表和 `generated/graph.json` 的前置链。9 节正文里链外没标的，只剩报告列为误报的那些：「惯性系」「余弦」这类中学词，「尘埃」「同步」这类意思不同的词，还有「共振」。
- **复合词整个词标**：
  - `field-momentum:55`、`:71`「放电电流」标 `electric-current`。`:55` 是本节第一次，括注改成 discharge current。
  - `skin-effect:116`「直流电流」照推荐标 `steady-current`。这是本节第一次出现这个 id，括注 direct current。
  - 同一类另找到 1 处：`em-waves:102`「合磁场」原来是「合」加带标记的「磁场」，改成整个词标。这是那一块第一次出现「磁场」；同一句的「合电场」不是那一块第一次出现「电场」，不标。
  - 查法：把 9 节每个带标记的术语和紧挨着的前两个字、后两个字列出来，逐个看。剩下的「匀强」「长」「平板」「静电（时的）」是修饰语，照报告不改。
- **标错**：`skin-effect:48` 的「电磁场」去掉了标记。
  - 原因：之前已经改过一次，补「趋肤深度」时重跑自动标记，又把它标回去了。
  - 这次只用替换表改，没有再跑自动标记。
  - 全领域讲解里「电」加带标记的「磁场」只有这一处。
- **「复波数」进术语表**：id `complex-wave-number`，定义在 `skin-effect`，锚点 `thm-conductor-wave`。
  - `skin-effect:25`（起名的定理）、`dispersion:29` 都标上了。`dispersion` 是本节第一次出现，括注 complex wave number。
  - 简介：「导体或吸收介质里平面波$\operatorname{Re}\bigl(\tilde E_0e^{i(\omega t-\tilde kz)}\bigr)$的复数波数$\tilde k=k-i\kappa$：实部定波长，虚部使振幅按$e^{-\kappa z}$衰减。」
  - 同一类问题查过：只加锚点或只括注的名词，逐个数过在几节讲解里出现，包括复折射率、反射率、透射率、良导体、等离子体频率、入射面、入射角、折射角、反射角、波阻抗、线偏振、驻波、标势、电磁势、趋肤效应、色散、反射波、透射波、相速度、群速度。两节以上出现的除了「复波数」，还有：
    - 「入射角」（`fresnel-equations` 起名，`field-momentum:32` 也用）：中学就学的词，不进表；
    - 「驻波」（`em-waves`、`em-wave-energy`）、「反射波」（`em-waves`、`waves-in-media`、`fresnel-equations`）：振动与波的词，照报告「要写回 plan.md 的」第 3 条，等那边进表；
    - 「全反射」在 `field-momentum` 里出现的都是「完全反射」，不算；
    - 「矢势」是 `gauge-potentials` 起名的，别处用的是表里的「磁矢势」。

### 小问题 3 · 说法

- **`skin-effect:34`** 改成：「约$900\,\mathrm{MHz}$是海水里传导电流和位移电流相等的频率（见……第 4 题），海水要在比它低得多的频率下才算良导体，例如$1\,\mathrm{MHz}$时$\frac{\sigma}{\varepsilon\omega}\approx900$（第 5 题）；频率比它高得多时，海水更像绝缘体。」
  - 同一类问题查过：本节例 2、第 5 题说海水是良导体时都给了比值（$4.5\times10^4$、约$900$）。`waves-in-media:55` 照报告不改。
- **`field-momentum:45`** 改成：「能量密度和$\frac{\vb S}{c}$（也就是$c\vb g$）是电磁场的能量-动量张量的分量，其余的分量由麦克斯韦应力张量给出」。后半句接上了本节证明思路里的麦克斯韦应力张量。
  - 同一类问题查过：全领域提到能量-动量张量的只有这两处，`poynting-theorem:36` 不用改。
- **`em-waves:54`** 照建议改成：「它们在真空里的速度都是$c$；方程组只给出这一个$c$，没说它是相对什么的速度，这成了狭义相对论光速不变的出发点」。
  - 同一类问题查过：全领域别的地方没有拿「光速不变」做推理的说法。`em-waves` 第 7 题的以太题讲的是测量，不用改。

### 跨领域补标

- `poisson-equation:65`、`:91` 的「鞍点」标 `math.vector-calculus.saddle-point`。
  - 定义它的 `taylor-multivariable` 不在这一节的链上（查过 `generated/graph.json`），按规矩 C 标。
  - `:65` 原来就括注了 saddle point。
  - 这一节退回 `written`。

### 可改可不改的

- **`capacitor-in-field.svg`**：上排$(432,32)$的 ⊗ 补上了。
  - 原因：`gen_capmagnet.py` 原来把电阻丝那一列$y<190$的点都剔掉了，现在改成只让开电阻丝竖着的那一段。
  - 用无头 Edge 渲染看过，新加的 ⊗ 不碰导线。
- 别的几条照报告不改：`em-wave.svg` 的斜投影、`poynting-theorem:31` 和 `:36`、`dispersion` 动画的单位、圆圈的 `fill` 属性。

### 验证

- `npm run content` 0 个错误、0 个警告。
- 写内容会话的 `verify_b13.py` 247 项一致；审查的 9 个 `tools/verify/physics.electromagnetism.*.ts` 单独跑（`npm run verify` 不能只跑几节），都一致。
- 自查脚本（`chk.sh`，跑了改过的 6 节加 `poisson-equation`）只剩已知误报。
- 页面检查没有重做：这次改的是文字、术语标记和图里的一个 ⊗。跨领域的 3 个 id 和「复波数」都过了构建的术语检查；那张图用无头 Edge 单独看过。
- 提交清单重列为 39 个文件，覆盖了 `batch-13-em-commit-files.txt`：
  - 电磁学内容 29 个，比上次多了 `poisson-equation/lesson.md`；
  - 这份审查报告；
  - 审查会话的 9 个 `tools/verify/physics.electromagnetism.*.ts`。

## 复核

审内容 agent · 2026-11-12

**通过。** 3 条小问题都改了，改得对。写内容会话另找的 `em-waves:102`「合磁场」和补的 ⊗ 也对。修订说明和实际改动一一对得上，没有说明以外的改动。`poisson-equation` 的「鞍点」补标对。没有要改的。9 节新课和 `poisson-equation` 已改成 `reviewed`，只改第 11 行。

### 怎么比的

- 和初审快照（我的 scratchpad 的 `b13/snap/`，2026-11-12T02:19:41Z）逐个文件比，电磁学目录里有 15 个文件不同：
  - 5 个是我初审改回 `reviewed` 的第 11 行（`coulomb-law`、`electric-displacement`、`electrostatic-energy`、`maxwell-equations`、`vector-potential`），这次没再动；
  - 其余 10 个是 `_domain.yaml`，`dispersion`、`em-waves`、`gauge-potentials`、`poisson-equation`、`poynting-theorem` 的讲解，`field-momentum` 的讲解和图，`skin-effect` 的讲解和题目。每一处改动都在修订说明里。
  - `em-wave-energy`、`waves-in-media`、`fresnel-equations` 没动。9 份 `problems.yaml` 里只改了 `skin-effect` 第 3 题的题面。
- `poisson-equation` 用 `git diff HEAD` 看：只改了第 11 行和 `:65`、`:91`。
- 改 `status` 之前，10 节的 `lesson.md` 存了一份在 scratchpad 的 `b13r/pre-status/`。

### 逐条

- **小问题 1 · `skin-effect` 第 3 题**：改了。
  - 题面写明「这一层的截面积按周长乘厚度$2\pi a\delta$算」，顺带补了半径的记号$a$。答案、提示、解答没动。
  - 我的验算脚本仍算得 $7.66961$，一致；题面新增的两个公式渲染正常。
  - 写内容会话查的同一类题面（第 1 题、`dispersion` 第 3、4 题、`field-momentum` 第 1、4 题、`em-wave-energy` 第 1 题、`waves-in-media` 第 4 题），近似都写明了。
- **小问题 2 · 术语**：改了。
  - **规矩 C**：3 处的 id 都对。`gauge-potentials:36` 补的括注「（Lagrangian，见[……]）」合全站写法。重跑规矩 C 的扫描，9 节剩下的只有初审判过的误报。
  - **复合词**：「放电电流」两处、「直流电流」都整词标了，id 和英文括注对。
    - 另找的 `em-waves:102`「合磁场」也改得对：同一句前面已经标了「电场」，「合电场」不用再标。
  - **标错**：`skin-effect:48` 的「电磁场」去掉了标记。
    - 全站再查「电」「合」「外」「内」加带标记的「磁场」「电场」「电流」，以及「放电」「直流」等加带标记的「电流」，一处都没有了。
  - **「复波数」进了表**：
    - 简介 35 字，物理对；锚点 `thm-conductor-wave` 就是起名的定理。
    - `skin-effect:25`、`dispersion:29` 都标了，`dispersion` 括注了英文。
    - 批次 9–12 的电磁学小节、别的领域已写的小节都没有用到这个词。
  - 写内容会话数出的别的「两节以上出现」的名词：「入射角」是中学词；「驻波」「反射波」是振动与波的词。我同意都不进电磁学的表。
- **小问题 3 · 说法**：改了，三处物理都对。
  - `skin-effect:34`：900 MHz 是两种电流相等的频率，要低得多才算良导体，例子用第 5 题的 1 MHz。
  - `field-momentum:45`：「能量密度和$\frac{\vb S}{c}$（也就是$c\vb g$）是……分量，其余的分量由麦克斯韦应力张量给出」。
    - 和本节 `:43` 证明思路里的麦克斯韦应力张量接上了。
    - 空间分量和应力张量差一个负号，这里只说「由……给出」，不算错；`covariant-maxwell` 第 8 题写明了是相反数。
  - `em-waves:54` 照建议改了。
- **跨领域补标 · `poisson-equation:65`、`:91` 的「鞍点」**：对。
  - `math.vector-calculus.saddle-point` 定义在 `taylor-multivariable`，不在这一节的链上（脚本核过），也不是中学词，按规矩 C 该标。
  - 意思相同：那里的简介是「不是局部极值点的驻点」，这里的原点是电势沿$x$轴极小、沿$z$轴极大的驻点。
  - 两处在不同的块里（「几何图像」「常见误区」），各是那一块第一次出现；`:65` 原来就括注了英文。电磁学别的小节没有「鞍点」。
  - 这个 id 在多变量微积分批次 13 的改动里，还没提交。两边要一起提交；数学那边复核时如果改了 id，这里要跟着改，`npm run content` 会报出来。
- **可改可不改的 · `capacitor-in-field.svg`**：补上了。
  - 只多了上排 $(432,32)$ 的一个 ⊗（一个圆、两条线），样式和别的一致。
  - 无头 Edge 渲染看过，不碰导线；页面上 SVG 的文字不出界、不重叠、不压线。

### 验证

- `npm run content`：0 个错误、0 个警告（改 `status` 前后各跑一次）。
- 本批 9 个验算脚本单独跑：36 题一致。全量 `npm run verify`：201 个小节、804 题全部一致。
- `npx tsc -b` 通过；`npm test` 23 个文件、202 项全部通过；`npm run build` 通过，没被多变量微积分卡住。
- 检查脚本对 9 节加 `poisson-equation` 重跑：
  - 复合词拆开标的没有了；
  - 每块第一次出现、英文括注都没有新的漏标；
  - 链接 0 处出错；
  - 公式 1276 个，0 个错误。
- **页面**：在 768 宽下看了改过的 7 页：`gauge-potentials`、`poynting-theorem`、`em-waves`、`field-momentum`、`skin-effect`、`dispersion`、`poisson-equation`。
  - 展开了全部提示和解答。7 页都不左右滚动，没有 KaTeX 错误，定义卡片数等于锚点数。
  - 「复波数」「直流电流」「鞍点」都渲染成了术语。
  - 面板是隐藏的，只做了 DOM 检查。

### 原有的、不用改的

- 格式脚本在 `poisson-equation` 报了 3 处「重复标记」：「泊松方程」那一块的「静电场」，「拉普拉斯方程」那一块的「电荷」「电势」。
- 这几行这次没动，是批次 10 就有的。编译器每块只给第一次标记加下划线，读者看不出差别。

### 要写回 plan.md 的

你已经记下复合词的例子。初审报告「要写回 plan.md 的」里另外几条也请一起写回：

- 第 1 条里「复波数」的例子；
- 第 2 条：近似估算题写明按哪个近似算；
- 第 3 条：给以后写的会话留的话。

复核新加一条：

- **自动标记不要覆盖人工改过的地方**（批次 13 复核时提的）。
  - `skin-effect:48` 的「电磁场」写内容时改过一次，补「趋肤深度」时重跑自动标记，又被拆成「电」加带标记的「磁场」。
  - 脚本加术语标记时，把「电磁场」这类含术语、意思不同的更长的词放进排除表。
  - 只补一个词时用替换表，不整体重跑。

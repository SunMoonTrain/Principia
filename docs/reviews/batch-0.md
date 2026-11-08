# 批次 0 审查报告：只出目录

审内容 agent（和写内容 agent 是两个独立会话，没有读它的会话记录和交接说明）· 2026-11-09

审查范围：`content/` 下 23 个领域的 `_domain.yaml` 和 647 个只有文件头的 `lesson.md`；批次 0 写回 `docs/plan.md` 的几处；批次 0 对台阶 1 样例文件的改动。

## 结论

重要 19 条，小问题 24 条（同一类问题合成一条）。

- 目录整体能用：goal 全部是一句话，大多数小节在 1 到 2 个新概念以内，跨领域的前置基本合理。
- 重要的集中在四类：抽象代数在 `full` 下有 4 节一节放不下；有几个概念全目录没有落点（双曲函数、伽马函数和含参变量积分、正规扩张与可分扩张）；三处内容在两个地方各讲一遍；几节的 proofPolicy 和 id 要改。
- 小问题里有 19 组是前置链上缺了 goal 要用的概念，一共 37 处，多数加一条前置就行、层级不变。
- id：23 个领域 id 都可以定；小节 id 建议改名 6 个、新增 9 个（含拆分），其余 641 个可以定，见「id 汇总」。这些小节都还是 `outline`，`progress/` 里没有它们的记录，现在改不用迁移脚本。
- proofPolicy：建议把分析从 `sketch` 改成 `full`，其余 22 个领域同意写内容 agent 的取值；另有 6 节建议在文件头写 `sketch`（抽象代数的 `quintic` 不拆的话再加 1 节），见「proofPolicy 汇总」。
- 照本报告全部改完是 656 节，没有环，没有多余前置（模拟过，见「附：模拟」）。

| 领域 | 节数 | 层级 | 重要 | 小问题 |
| --- | --- | --- | --- | --- |
| math.logic-sets 逻辑与集合 | 21 | 0–11 | 0 | 1 |
| math.calculus 单变量微积分 | 45 | 0–14 | 1 | 1 |
| math.analysis 分析 | 31 | 4–16 | 3 | 1 |
| math.linear-algebra 线性代数 | 36 | 0–12 | 0 | 2 |
| math.vector-calculus 多变量微积分与向量分析 | 31 | 1–17 | 0 | 1 |
| math.ode 常微分方程 | 25 | 8–21 | 0 | 1 |
| math.complex-analysis 复分析 | 23 | 0–24 | 2 | 1 |
| math.probability 概率论 | 29 | 0–18 | 1 | 1 |
| math.abstract-algebra 抽象代数 | 29 | 5–19 | 5 | 2 |
| math.topology 拓扑 | 23 | 8–18 | 1 | 1 |
| math.differential-geometry 微分几何 | 26 | 13–23 | 0 | 1 |
| math.calculus-of-variations 变分法 | 12 | 11–16 | 1 | 0 |
| math.pde 偏微分方程 | 18 | 9–21 | 0 | 2 |
| math.representation-theory 群论与表示论 | 19 | 11–23 | 1 | 1 |
| physics.newtonian-mechanics 牛顿力学 | 34 | 8–17 | 0 | 1 |
| physics.analytical-mechanics 分析力学 | 23 | 14–25 | 1 | 1 |
| physics.oscillations-waves 振动与波 | 21 | 15–22 | 1 | 1 |
| physics.electromagnetism 电磁学与电动力学 | 47 | 12–27 | 1 | 1 |
| physics.optics 光学 | 27 | 0–37 | 0 | 1 |
| physics.thermal-physics 热力学与统计力学 | 37 | 0–38 | 0 | 1 |
| physics.special-relativity 狭义相对论 | 19 | 11–26 | 0 | 0 |
| physics.quantum-mechanics 量子力学 | 50 | 23–37 | 1 | 1 |
| physics.general-relativity 广义相对论 | 21 | 20–29 | 0 | 1 |
| 合计 | 647 | | 19 | 24 |

## 怎么审的

- 用只读脚本读出 647 个文件头和 23 个领域文件，算出每节的层级、全部祖先和直接后续（脚本放在我的临时目录，不进仓库）。
- 逐个领域、逐节读 title、goal、直接前置和直接后续。判断「goal 要用的概念在不在前置链上」时查的是整条链（全部祖先），不只看直接前置；报告里每一处「不在链上」都用脚本核对过。
- 粒度：只有目录时没法计时，按 goal 里的新概念个数估；`full` 的小节把完整证明的长度也算进去。
- 用编译器在内存里跑了一遍校验（不写 `generated/`）：0 个错误；1 个警告是 `sequences-limits` 还是 outline、暂不检查术语锚点，属预期。没有环，没有多余前置；goal 都以句号结尾、中间没有第二句。
- 把本报告建议的改动（新增、拆分、改前置）全部套上去模拟了一遍：没有环；有 7 条前置会因此变成能由别的前置推出，已在对应条目里写明要删，删掉后没有多余前置。

下文「层级」都是当前目录算出的值，箭头表示照建议改了以后的值。

## 跨领域

- **双曲函数没有落点**：6 节要用，见单变量微积分重要 1。
- **「几个领域都要用的内容只放在一处」没守住的三处**：SU(2) 表示和克莱布什-戈尔丹系数（表示论重要 1）、弦和圆膜的简正模（振动与波重要 1）、电磁波的辐射压力（电磁学小问题 1，同一个领域里讲了两遍）。方案点名的那几样（复数和欧拉公式、向量与点积叉积、$\delta$ 函数、勒让德变换、度量空间、傅里叶级数与傅里叶变换、斯图姆-刘维尔理论、诺特定理）都只放在了一处。
- **跨领域前置**：共 261 条，跨学科 86 条。数学接在物理后面的只有 2 条（`math.representation-theory.lorentz-group` ← `physics.special-relativity.lorentz-transformation`，`math.representation-theory.projection-operators` ← `physics.oscillations-waves.normal-modes`），都合理。具体问题已并进各领域。
- **物理整体偏右**（实现记录里提的「牛顿力学从第 8 层开始」）：这是真实的前置决定的，不是目录的毛病。运动学要用导数和原函数（`math.calculus.antiderivatives` 在 7 层），波动光学要先有波（20 层），量子力学要先有干涉和概率密度。我沿最长前置链查了一遍，比需要的强的只有两处：`physics.optics.paraxial-refraction`（见光学）和 `physics.quantum-mechanics.photons`（见量子力学）。另外，复分析的欧拉公式经泰勒级数讲（14 层），把常微分方程的常系数方程推到了 15 层；换成不用泰勒级数的讲法能让常微分方程、复分析左移 4 到 8 层，但物理的层级一层都不变（模拟过），所以不建议为此改。

## 数学

### math.logic-sets 逻辑与集合（21 节，层级 0–11）

proofPolicy `full`：同意。宏合理（`\N` 含不含 0，见「我替你定的」2）。id：领域和 21 个小节都可以定。

- **小问题 1 · 缺前置**：`number-constructions` 在等价类上定义加法、乘法，要验证「和代表元的选取无关」，用到映射；`functions` 不在它的前置链上。prerequisites 改为 `[equivalence-relations, functions]`（层级不变，8）。

### math.calculus 单变量微积分（45 节，层级 0–14）

proofPolicy `sketch`：同意。宏合理。id：45 个小节都可以定，另新增 1 节。

- **重要 1 · 缺「双曲函数」**：下面 6 节要用 $\sinh$、$\cosh$、$\tanh$，全目录没有一节讲：`math.calculus-of-variations.beltrami-identity`（悬链线）、`math.pde.laplace-separation`（矩形区域上的解）、`physics.newtonian-mechanics.drag`（平方阻力下的速度）、`physics.special-relativity.four-force`（双曲运动）、`physics.thermal-physics.paramagnetism`（磁化强度）、`physics.quantum-mechanics.tunneling`（方势垒的透射系数）。建议新增 `math.calculus.hyperbolic-functions`「双曲函数」，goal：会用指数函数定义 $\sinh x$、$\cosh x$、$\tanh x$，推出它们的导数和 $\cosh^2x-\sinh^2x=1$，并认出悬链线、终端速度这些用到它们的场合。prerequisites `[elementary-derivatives]`（层级 6）。上面 6 节各加这条前置，它们的层级都不变。
- **小问题 1 · goal 措辞**：`special-limits` 要「推导」$\lim_{x\to\infty}(1+\frac{1}{x})^x=e$，标准推导要用「单调有界数列收敛」，那在 `math.analysis.bounded-monotone`（7 层），不在链上，也不值得为它把这一节推到后面。建议 goal 改成「会使用……两个重要极限，并知道第二个极限为什么存在」，严格推导留给分析。

### math.analysis 分析（31 节，层级 4–16）

宏合理。id：领域 id `analysis` 不改（`completeness` 已经是 `written`，`progress/` 里有它的记录，改名要写迁移脚本）；31 个小节都可以定，另新增 3 节。显示名的建议见「给研究生和前沿内容留位置」。

- **重要 1 · proofPolicy 建议改成 `full`**：方案的分工是「分析讲严格的定义和证明」，这个领域的 goal 几乎都是「会严格证明……」；致密性定理、一致连续（康托尔定理）、连续函数可积、一致收敛下交换极限，这些证明正是「读者不看证明几乎想不到」的那一类。完整证明太长的两节在文件头写 `proofPolicy: sketch`：`real-construction`（逐条验证戴德金分割满足的性质）、`fourier-convergence`（狄利克雷定理）。已经写好的 `completeness` 不受影响：它把确界原理当公理，例题里的证明本来就是完整的。如果你想让讲解短一些、证明留到难题里自己写，就保持 `sketch`。
- **重要 2 · `exp-log-construction` 要拆**：id 和内容对不上（goal 只有指数函数和三角函数，没有对数）；一节里要定义指数和三角函数、定义 $\pi$、推出它们的性质，超过 1 到 2 个新概念；还缺前置：证明 $e^{x+y}=e^xe^y$ 要用绝对收敛级数的乘积（柯西乘积，和重排是同一个道理），定义 $\pi$ 和对数（指数函数的反函数）要用介值定理，而 `rearrangement`、`intermediate-value` 都不在链上。拆成：
  - `exp-log-construction`「用幂级数定义指数函数与对数」，goal：会用幂级数定义指数函数并证明 $e^{x+y}=e^xe^y$，再把对数定义成它的反函数。prerequisites `[power-series-theory, intermediate-value, rearrangement]`（层级 16）。
  - 新增 `trig-construction`「用幂级数定义三角函数与 π」，goal：会用幂级数定义正弦和余弦，证明和角公式，并用余弦的第一个正零点定义 $\pi$。prerequisites `[exp-log-construction]`（层级 17）。
- **重要 3 · 缺「含参变量积分」和「伽马函数」**：两者都是数学分析的主干内容。`math.complex-analysis.analytic-continuation` 的 goal 要延拓伽马函数，可全目录没有一节定义它；复分析在 `full` 下证明「全纯函数可以无穷次求导」也要在积分号下求导。建议新增：
  - `parameter-integrals`「含参变量积分」，goal：会判断什么时候可以在积分号下求导、交换两个积分的次序，并用它算出 $\int_0^{\infty}x^2e^{-ax^2}\,\mathrm{d}x$ 这类积分。prerequisites `[uniform-limit-theorems, math.calculus.improper-integrals, math.vector-calculus.partial-derivatives]`（层级 14）。
  - `gamma-function`「伽马函数」，goal：会用积分定义伽马函数，推出 $\Gamma(x+1)=x\Gamma(x)$ 和 $\Gamma(\frac{1}{2})=\sqrt{\pi}$，并用它计算 $\int_0^{\infty}x^ne^{-x}\,\mathrm{d}x$ 这类积分。prerequisites `[parameter-integrals, math.vector-calculus.polar-double-integrals]`（层级 15）。
- **小问题 1 · 缺前置（2 处，层级都不变）**：
  - `uniform-convergence` 的 goal「用上确界距离判断一致收敛」要用上确界，`completeness` 不在链上。prerequisites 改为 `[continuity, completeness]`。
  - 按批次 0 定的「严格化」规则，`sequences-limits` 应列 `math.calculus.limits-at-infinity`（那一节讲过数列极限的直观）。加上以后，`function-limits` 里的 `math.calculus.limits-intuition` 能由 `limit-arithmetic` 推出，要删掉（见「我替你定的」3）。

### math.linear-algebra 线性代数（36 节，层级 0–12）

proofPolicy `sketch`：同意。宏合理（`\im` 和 `\Im` 只差大小写，写的时候留意）。id：领域和 36 个小节都可以定。

- **小问题 1 · 缺前置**：`inner-product-spaces` 的 goal 包括「函数的积分内积」，可线性代数整个领域没有微积分的前置。建议加 `math.calculus.fundamental-theorem`（层级 7→9，后面 8 节跟着右移 2 层；数学里 `math.analysis.parseval` 和表示论的有限群部分跟着右移 1 到 2 层，物理各领域的层级不变）。不想动层级的话，就把积分内积从这一节的 goal 里拿掉，留给 `math.analysis.parseval`。
- **小问题 2 · 直和没有落点**：`orthogonal-projection`（正交补）、`math.representation-theory.irreducible-representations`（「把表示写成直和」）、`math.representation-theory.maschke-theorem`（不变补空间）都要用直和，可哪一节的 goal 都没说要定义它。建议写进 `orthogonal-projection` 的 goal（「……并把空间写成子空间和它的正交补的直和」），或者由 `irreducible-representations` 定义。

### math.vector-calculus 多变量微积分与向量分析（31 节，层级 1–17）

proofPolicy `sketch`：同意。宏合理。id：领域和 31 个小节都可以定。

- **小问题 1 · 缺前置（3 处，层级都不变）**：
  - `polar-double-integrals`：goal 要求出 $\int_{-\infty}^{\infty}e^{-x^2}\,\mathrm{d}x$，这是反常积分，`math.calculus.improper-integrals` 不在链上，加上。
  - `partial-derivatives`：goal「知道混合偏导数在什么条件下相等」要用多元函数的连续，`multivariable-limits` 不在链上。prerequisites 改为 `[multivariable-limits, math.calculus.elementary-derivatives]`（`functions-of-several-variables` 能由 `multivariable-limits` 推出，去掉）；`differentiability` 里的 `multivariable-limits` 随之能推出，去掉。
  - `conservative-fields`：goal「判断向量场是否保守」，三维的判据是旋度为零，`curl-divergence` 不在链上，加上；加了以后 `stokes-theorem` 里的 `curl-divergence` 能由 `greens-theorem` 推出，去掉。如果这一节只讲平面的判据 $\partial P/\partial y=\partial Q/\partial x$，就不用加。

### math.ode 常微分方程（25 节，层级 8–21）

proofPolicy `sketch`：同意。宏合理。id：领域和 25 个小节都可以定（`linear-systems` 可选改名，见「id 汇总」）。

- **小问题 1 · 缺前置**：`existence-uniqueness` 用皮卡迭代说明解存在，关键一步是一致收敛的极限可以和积分交换，那在 `math.analysis.uniform-limit-theorems`，只列 `uniform-convergence` 不够。换成 `math.analysis.uniform-limit-theorems`（层级 11→14；后续的 `math.differential-geometry.vector-fields-flows` 不变）。

### math.complex-analysis 复分析（23 节，层级 0–24）

宏合理（写复对数时可以加 `\Log`、`\Arg`）。id：领域和 22 个小节可以定，`elementary-functions` 见重要 2。

- **重要 1 · `full` 和前置不配套**：这个领域没有一条分析的前置，可完整证明要用一致收敛。具体是：`cauchy-integral-formula`（「全纯函数可以无穷次求导」要在积分号下求导）、`power-series`（逐项积分几何级数）、`harmonic-functions`（要用实部、虚部二阶连续可导，这来自柯西积分公式，现在只接在 `holomorphic` 后面）、`analytic-continuation`（伽马函数没有定义）。我同意用 `full`（柯西积分公式之后的结论都是「不看证明想不到」的，而且证明都短），同时：
  - `cauchy-integral-formula` 加 `math.analysis.uniform-limit-theorems`；
  - `power-series` 加 `math.analysis.function-series`；
  - `harmonic-functions` 的前置从 `holomorphic` 换成 `cauchy-integral-formula`（层级 17→19，`conformal-applications` 19→20）；
  - `analytic-continuation` 加新增的 `math.analysis.gamma-function`（见分析重要 3），或者换一个不用伽马函数的例子。
  前两条不改变层级（分析那两节在 13 层，复分析这两节在 18 层以后）。如果不想让复分析依赖分析，就改成 `sketch`。
- **重要 2 · id 比内容宽**：`elementary-functions` 的 goal 只讲复对数和幂函数。建议改名 `complex-logarithm`（标题「复对数与幂函数」不变）；$e^z$、$\sin z$、$\cos z$ 作为复变函数写进 `complex-functions` 的 goal。
- **小问题 1 · 缺前置**：`holomorphic` 要说明「偏导数连续并满足柯西-黎曼方程就复可导」，要用多元函数的可微。把 `math.vector-calculus.partial-derivatives` 换成 `math.vector-calculus.differentiability`（层级不变）。

### math.probability 概率论（29 节，层级 0–18）

proofPolicy `sketch`：同意。宏合理；概率写 $P(A)$ 就好，不要用 `\P`：KaTeX 里它是段落符号 ¶，也不报错。id：领域和 28 个小节可以定，`generating-functions` 见重要 1。

- **重要 1 · id 和标题不符**：`generating-functions` 的标题是「矩母函数」，而「母函数」一般指概率母函数 $E(s^X)$。改名 `moment-generating-functions`。
- **小问题 1 · 缺前置（5 处）**：
  - `sigma-algebras`：「为什么不能给 $[0,1]$ 的所有子集都定义长度」的标准论证（维塔利集）要用选择公理和「两数之差是有理数」这个等价关系。加 `math.logic-sets.axiom-of-choice`、`math.logic-sets.equivalence-relations`（层级不变）。
  - `poisson-distribution`：验证概率之和为 1、求期望都要用 $e^\lambda=\sum_k\lambda^k/k!$。把 `math.calculus.special-limits` 换成 `math.calculus.taylor-series`（层级 11→14，`poisson-process` 14→15）。
  - `conditional-expectation`：全期望公式是全概率公式的推广，全概率公式在 `bayes`。加 `bayes`。
  - `random-walks`：赌徒破产问题要按第一步分情况。加 `conditional-expectation`。
  - `multivariate-normal`：线性变换后仍是正态、归一化常数里的 $\det\Sigma$，都要用重积分换元。加 `math.vector-calculus.change-of-variables`。

### math.abstract-algebra 抽象代数（29 节，层级 5–19）

proofPolicy `full`：同意（拉格朗日定理、西罗定理、伽罗瓦理论都是不看证明想不到的），但在 `full` 下 `pid-ufd`、`sylow`、`quintic`、`finite-abelian-groups` 4 节放不进 20 到 30 分钟（重要 1、2、4、5），伽罗瓦基本定理还缺一个概念（重要 3）。宏合理（写有限域时可以加 `\F`）。id：除下面的拆分和新增外，都可以定。

- **重要 1 · `pid-ufd` 太大**：三个新概念（欧几里得整环、主理想整环、唯一分解整环），而且 `full` 下「主理想整环里元素能唯一分解」的证明本身就长。拆成：
  - `euclidean-domains`「欧几里得整环与主理想整环」（替换 `pid-ufd`），goal：会判断一个整环是不是欧几里得整环，并证明欧几里得整环都是主理想整环。prerequisites `[ideals, polynomial-rings]`。
  - 新增 `unique-factorization`「唯一分解整环」，goal：会区分不可约元和素元，并证明主理想整环里的元素能唯一地分解成不可约元的乘积（例如在 $\Z[i]$ 里分解）。prerequisites `[euclidean-domains]`。
  - `irreducibility` 改为 `[unique-factorization]`。
- **重要 2 · `sylow` 太大**：三个定理的完整证明，再加「判断给定阶的群是不是单群」。拆成 `sylow`「西罗定理」（goal 改为：会叙述并证明西罗的三个定理）和新增 `sylow-applications`「用西罗定理分析有限群」（goal：会用西罗定理分析给定阶的有限群，并判断它是不是单群；prerequisites `[sylow]`）。
- **重要 3 · 缺「正规扩张与可分扩张」**：`galois-correspondence` 要用伽罗瓦扩张（正规且可分），可没有一节讲这两个概念。新增 `galois-extensions`「正规扩张与可分扩张」，goal：会判断扩张是否正规、是否可分，并知道伽罗瓦扩张的伽罗瓦群的阶等于扩张的次数。prerequisites `[splitting-fields]`；`galois-correspondence` 加这条前置。
- **重要 4 · `quintic` 在 `full` 下放不下**：「根式可解 ⇒ 伽罗瓦群可解」要先讲单位根和根式扩张。推荐新增 `radical-extensions`「根式扩张」（goal：会把根式求解写成一串根式扩张，并证明根式可解的多项式的伽罗瓦群可解；prerequisites `[galois-correspondence, solvable-groups]`），`quintic` 改为 `[radical-extensions]`，goal 改成「会找出伽罗瓦群是 $S_5$ 的五次多项式，并由此说明一般的五次方程没有求根公式」。不想加节的话，`quintic` 的文件头写 `proofPolicy: sketch`。
- **重要 5 · `finite-abelian-groups`**：结构定理的完整证明很长，文件头写 `proofPolicy: sketch`，完整证明放进难题。
- **小问题 1 · 缺前置（3 处）**：
  - `galois-groups`：goal「把它看成多项式的根的置换」，`symmetric-groups` 不在链上，加上。
  - `rings`：例子里有矩阵环，`math.linear-algebra.matrices` 不在链上，加上（层级不变）。
  - `isomorphism-theorems`：例子「$\mathbb{R}/\mathbb{Z}$ 同构于单位圆上的乘法群」要用复数，加 `math.complex-analysis.complex-numbers`（它是根节点，层级不变）。
- **小问题 2 · 标题**：
  - 「域」没有落点：`rings` 只说环与整环，后面的 `polynomial-rings`「在域上的多项式环里……」就用上了域。`rings` 标题改「环、整环与域」，goal 里加上域。
  - `direct-products`「直积与有限阿贝尔群」和 `finite-abelian-groups`「有限阿贝尔群的结构」标题重叠，前者改「群的直积与中国剩余定理」。

### math.topology 拓扑（23 节，层级 8–18）

proofPolicy `full`：同意（点集拓扑的证明短，而且就是这个领域要学的东西）。宏合理。id：领域和 23 个小节都可以定。

- **重要 1 · `euler-characteristic` 给不出完整证明**：曲面分类定理和欧拉示性数的拓扑不变性，本科阶段给不出完整证明（要三角剖分或同调）。文件头写 `proofPolicy: sketch`。
- **小问题 1 · 缺前置（3 处，层级都不变）**：
  - `covering-spaces`：`full` 下道路提升的证明要用 $[0,1]$ 的紧致性（勒贝格数引理），紧致性不在链上。加 `sequential-compactness`，并把勒贝格数引理写进 `sequential-compactness` 的 goal。
  - `sequential-compactness` 用不到海涅-博雷尔定理，prerequisites 改为 `[compactness, math.analysis.subsequences]`。
  - `metric-spaces`：goal 里的「上确界度量」要用上确界。把 `math.analysis.sequences-limits` 换成 `math.analysis.completeness`；`connectedness` 里的 `math.analysis.completeness` 随之能推出，去掉。

### math.differential-geometry 微分几何（26 节，层级 13–23）

proofPolicy `sketch`：同意。宏合理。id：领域和 26 个小节都可以定。

- **小问题 1 · 缺前置**：`geodesics-on-manifolds` 的 goal「测地线是使长度取极值的曲线」要用欧拉-拉格朗日方程。加 `math.calculus-of-variations.euler-lagrange`（层级不变）。

### math.calculus-of-variations 变分法（12 节，层级 11–16）

proofPolicy `sketch`：同意。宏合理。id：领域和 11 个小节可以定，`multiple-integrals` 见重要 1。

- **重要 1 · id 容易看错**：`multiple-integrals` 读起来像向量分析里的「重积分」，这一节讲的是「多元函数的变分问题」。改名 `multivariable-functionals`。

（悬链线要用双曲函数，见单变量微积分重要 1。）

### math.pde 偏微分方程（18 节，层级 9–21）

proofPolicy `sketch`：同意。id：领域和 18 个小节都可以定。

- **小问题 1 · 缺前置**：`laplace-separation` 在圆盘上分离变量要用极坐标下的拉普拉斯算子（`math.vector-calculus.curvilinear-coordinates`），不在链上，加上（层级不变）；`legendre-polynomials` 里的同一条随之能推出，去掉。
- **小问题 2 · 符号惯例**：数学里拉普拉斯算子习惯写 $\Delta u$，全局宏 `\lap` 显示 $\nabla^2$（物理习惯）。建议这个领域的正文直接写 `\Delta`。

（和振动与波的重复见振动与波重要 1。）

### math.representation-theory 群论与表示论（19 节，层级 11–23）

proofPolicy `sketch`：同意（可选：`schur-lemma`、`maschke-theorem`、`orthogonality-relations` 写 `full`，证明短，而且是这个领域的核心）。宏合理（写洛伦兹群时要加 `\SL`）。id：领域和 19 个小节都可以定。显示名的建议见「给研究生和前沿内容留位置」。

- **重要 1 · 和量子力学重复**：`su2-representations`（用升降算符构造 SU(2) 的不可约表示，用自旋 $j$ 编号）和 `physics.quantum-mechanics.angular-momentum`、`spin` 是同一个构造；`clebsch-gordan` 和 `physics.quantum-mechanics.adding-angular-momenta` 都要算克莱布什-戈尔丹系数。方案定了「几个领域都要用的内容只放在一处」。三种做法：
  - (a) 推荐：表示论这两节接在量子力学后面，只讲群论的角度。`su2-representations` 加 `physics.quantum-mechanics.angular-momentum`，goal 改成「会把角动量的升降算符构造看成 $\mathfrak{su}(2)$ 不可约表示的分类，并说明为什么 SU(2) 有半整数自旋而 SO(3) 没有」；`clebsch-gordan` 加 `physics.quantum-mechanics.adding-angular-momenta`，goal 改成「会用特征标推出两个 SU(2) 不可约表示的张量积怎样分解（三角形规则）」；`spherical-harmonics-so3` 里的 `math.pde.spherical-harmonics` 随之能推出，去掉。代价：这两节和它们的后续 `spherical-harmonics-so3`、`wigner-eckart` 从 21–23 层移到 33–36 层（`lorentz-group` 见小问题 1）；物理的层级不变。理由：物理里的群论课本来就在量子力学之后，这样物理的学习路线不用绕道。
  - (b) 量子力学那两节接在表示论后面：它们的层级不变，但学量子力学的角动量之前，要先走表示论和抽象代数的前十来节。
  - (c) 两边都留，各讲各的。
- **小问题 1 · 缺前置（3 处）**：
  - `lorentz-group`：goal「有限维表示可以用两个 $\mathfrak{su}(2)$ 表示来标记」要用 SU(2) 的表示论。把 `lie-algebras` 换成 `su2-representations`（按做法 (a) 层级 20→34，按 (b)(c) 20→22）。
  - `character-tables`：构造特征标表要用「不可约表示维数的平方和等于群的阶」，那在 `regular-representation`。把 `orthogonality-relations` 换成 `regular-representation`（层级加 1）。
  - `schur-lemma`：「交换群的不可约表示都是一维的」要用复数域上特征值一定存在。加 `math.linear-algebra.complex-eigenvalues`（层级不变）。

## 物理

### physics.newtonian-mechanics 牛顿力学（34 节，层级 8–17）

proofPolicy `sketch`：同意。宏合理（粗体的希腊字母见「我替你定的」1）。id：领域和 34 个小节都可以定。层级从 8 开始是真实的前置决定的，不用改（见「跨领域」）。

- **小问题 1 · goal 超出前置**：`energy-diagrams` 末尾「求平衡点附近小振动的频率」要用简谐运动和泰勒展开，都不在链上。从这一节的 goal 删掉，挪到 `physics.oscillations-waves.simple-harmonic-motion`：那一节 goal 加「并说明势能极小点附近的小振动都近似是简谐运动」，前置加 `math.calculus.taylor-polynomial`；`physics.oscillations-waves.pendulums` 里的 `math.calculus.taylor-polynomial` 随之能推出，去掉。层级都不变。

（平方阻力要用双曲函数，见单变量微积分重要 1。）

### physics.analytical-mechanics 分析力学（23 节，层级 14–25）

proofPolicy `full`：同意（从达朗贝尔原理推拉格朗日方程、诺特定理、刘维尔定理，推导就是这门课本身）。宏合理。id：领域和 23 个小节都可以定。

- **重要 1 · `full` 下两节给不出完整证明**：`hamiltonian-chaos`（KAM 定理）、`adiabatic-invariants`（浸渐不变性的严格证明）。两节的文件头写 `proofPolicy: sketch`。
- **小问题 1 · 缺前置（2 处，层级不变）**：
  - `small-oscillations`：要把拉格朗日量在平衡点附近展开到二阶，`math.vector-calculus.taylor-multivariable` 不在链上，加上。
  - `inertia-tensor`：计算连续刚体的惯性张量要用三重积分，加 `math.vector-calculus.triple-integrals`。

### physics.oscillations-waves 振动与波（21 节，层级 15–22）

proofPolicy `sketch`：同意。宏合理。id：领域和 20 个小节可以定，`fourier-analysis` 见重要 1。

- **重要 1 · 和偏微分方程重复**：
  - `fourier-analysis`「用傅里叶级数分析弦振动」（把弹拨弦的初始形状展开成傅里叶级数、求各简正模的振幅）≈ `math.pde.string-modes`（分离变量解两端固定的弦，写成简正模的叠加）。建议改成接在 `math.pde.string-modes` 后面的物理应用：改名 `plucked-string`「拨弦的位置与音色」，goal：会用各次谐波的振幅解释在弦的不同位置拨弦为什么音色不同；prerequisites `[standing-waves, math.pde.string-modes]`（原来的 `math.analysis.fourier-series` 能推出，去掉）。它没有后续，直接删掉也行。
  - `membrane-modes`「鼓膜的振动」里的圆膜 ≈ `math.pde.bessel-functions`「圆膜振动与贝塞尔函数」。建议 goal 只留矩形膜的简正模，和「鼓的泛音为什么不是基频的整数倍」的物理解释；圆膜的求解引用偏微分方程那一节（前置已经有了）。
- **小问题 1 · 缺前置**：`pendulums` 大振幅时的周期修正要算一个反常积分（被积函数在最大摆角处趋于无穷），加 `math.calculus.improper-integrals`（层级不变）。

### physics.electromagnetism 电磁学与电动力学（47 节，层级 12–27）

proofPolicy `sketch`：同意。宏合理。id：领域和 47 个小节都可以定，另新增 1 节（`separation-of-variables` 可选改名，见「id 汇总」）。

- **重要 1 · `magnetization`「磁介质」太大**：束缚电流、磁场强度 $\mathbf{H}$、顺磁和抗磁和铁磁，三个新概念；电介质那边是 `polarization`、`electric-displacement` 两节。拆成：
  - `magnetization`「磁化与束缚电流」，goal：会由磁化强度求束缚电流，并区分顺磁、抗磁和铁磁。prerequisites 不变（`[magnetic-dipole]`）。
  - 新增 `magnetic-intensity`「磁场强度与线性磁介质」，goal：会用磁场强度 $\mathbf{H}$ 和安培环路定理处理有磁介质的问题，并求线性磁介质里的磁场。prerequisites `[magnetization]`。
  - `waves-in-media` 的前置把 `magnetization` 换成 `magnetic-intensity`。
- **小问题 1 · 两节重复且缺前置**：`em-wave-energy`「电磁波的能量与动量」（强度和辐射压强）和 `field-momentum`「电磁场的动量」（动量密度、辐射压力）都讲辐射压力，而 `field-momentum` 讲电磁波的辐射压力却没接 `em-waves`。建议 `em-wave-energy` 标题改「电磁波的能量与强度」、goal 去掉辐射压强；`field-momentum` 的前置改为 `[em-wave-energy]`（`poynting-theorem` 能推出）。层级不变。

### physics.optics 光学（27 节，层级 0–37）

proofPolicy `sketch`：同意。宏合理。id：领域和 27 个小节都可以定。

- **小问题 1 · 前置比需要的强**：`paraxial-refraction` 的近轴近似只要一阶近似（$\sin\theta\approx\theta$），`math.calculus.taylor-polynomial` 换成 `math.calculus.differentials`（「微分与线性近似」）。几何光学 6 节（`paraxial-refraction` 到 `ray-transfer-matrices`）从 9–12 层移到 5–8 层，更接近它们的真实深度。

### physics.thermal-physics 热力学与统计力学（37 节，层级 0–38）

proofPolicy `sketch`：同意。宏合理。id：领域和 37 个小节都可以定。

- **小问题 1 · 缺前置**：`brownian-motion` 的爱因斯坦关系（扩散系数和迁移率成正比）要用阻力和迁移率，加 `physics.newtonian-mechanics.drag`（层级不变）。

（顺磁性要用双曲函数，见单变量微积分重要 1。）

### physics.special-relativity 狭义相对论（19 节，层级 11–26）

没有需要修的（双曲运动要用双曲函数，已并进单变量微积分重要 1）。proofPolicy `full`：同意（洛伦兹变换、时间延缓这些推导短，而且是理解的关键）。宏合理。id：领域和 19 个小节都可以定。

### physics.quantum-mechanics 量子力学（50 节，层级 23–37）

proofPolicy `sketch`：同意。宏合理（矩阵元 $\langle a|A|b\rangle$ 很常用，写到时可以加 `\mel`）。id：领域和 49 个小节可以定，`commutators` 见重要 1（谐振子两节可选改名，见「id 汇总」）。

- **重要 1 · 对易子先用后讲**：`ladder-operators`（28 层）要用 $[x,p]=i\hbar$ 和 $[a,a^\dagger]=1$，可对易子要到 `commutators`（32 层）才讲。推荐在 `ladder-operators` 里引入对易子（goal 改成「会用对易子和升降算符求谐振子的能级和定态，并说明零点能从哪里来」），`commutators` 改名 `generalized-uncertainty`、标题改「一般的不确定关系」，只讲由对易子推出一般的不确定关系。另一种做法是让 `ladder-operators` 接在 `commutators` 后面（层级 28→33），不改 id。
- **小问题 1 · 缺前置（4 处）**：
  - `fine-structure`：相对论修正要用 $E^2=p^2c^2+m^2c^4$，自旋-轨道耦合要用磁矩在磁场里的能量。加 `physics.special-relativity.four-momentum` 和 `spin-precession`；`zeeman-effect` 里的 `spin-precession` 随之能推出，去掉。层级不变。
  - `variational-method`：氦原子的例子要用氢原子的 1s 波函数，加 `hydrogen-wavefunctions`（层级不变）。
  - `fermi-golden-rule`：要用末态的态密度，加 `physics.thermal-physics.density-of-states`（层级不变）。
  - `photons`：只讲光电效应，用不到双缝干涉，却要用遏止电压（电势）。前置改为 `[physics.oscillations-waves.harmonic-waves, physics.electromagnetism.electric-potential]`；电子衍射才要用干涉，给 `matter-waves` 加 `physics.optics.two-beam-interference`；`bohr-model` 里的 `physics.electromagnetism.coulomb-law` 随之能推出，去掉。量子力学整体左移 1 层（`photons`、`compton-scattering`、`bohr-model` 左移 3 层）。

（方势垒的透射系数要用双曲函数，见单变量微积分重要 1；和表示论的重复见表示论重要 1。）

### physics.general-relativity 广义相对论（21 节，层级 20–29）

proofPolicy `sketch`：同意。宏合理。id：领域和 21 个小节都可以定（宇宙学 4 节的放法见「给研究生和前沿内容留位置」）。

- **小问题 1 · 缺前置（2 处，层级不变）**：
  - `equivalence-principle`：等效原理从加速参考系里的惯性力讲起，`physics.newtonian-mechanics.accelerating-frames` 不在链上，加上。
  - `einstein-field-equations` 要说明「弱场极限下回到泊松方程」，可牛顿引力的场方程 $\nabla^2\Phi=4\pi G\rho$ 哪一节都没讲（牛顿力学用的是积分和球壳定理）。写进 `newtonian-limit` 的 goal，并给它加 `math.vector-calculus.divergence-theorem`。

## proofPolicy 汇总

| 领域 | 写内容 agent 的建议 | 我的意见 | 建议在文件头覆盖的小节 |
| --- | --- | --- | --- |
| math.logic-sets | full | 同意：这个领域教的就是怎样写证明，证明都短 | |
| math.calculus | sketch | 同意 | |
| math.analysis | sketch | **建议 full**（见分析重要 1） | `real-construction`、`fourier-convergence` 写 sketch |
| math.linear-algebra | sketch | 同意 | |
| math.vector-calculus | sketch | 同意 | |
| math.ode | sketch | 同意 | |
| math.complex-analysis | full | 同意，但要补分析的前置（见复分析重要 1）；不补就改 sketch | |
| math.probability | sketch | 同意 | |
| math.abstract-algebra | full | 同意，配合拆节 | `finite-abelian-groups` 写 sketch；`quintic` 不拆时写 sketch |
| math.topology | full | 同意 | `euler-characteristic` 写 sketch |
| math.differential-geometry | sketch | 同意 | |
| math.calculus-of-variations | sketch | 同意 | |
| math.pde | sketch | 同意 | |
| math.representation-theory | sketch | 同意 | 可选：`schur-lemma`、`maschke-theorem`、`orthogonality-relations` 写 full |
| physics.newtonian-mechanics | sketch | 同意 | |
| physics.analytical-mechanics | full | 同意 | `hamiltonian-chaos`、`adiabatic-invariants` 写 sketch |
| physics.oscillations-waves | sketch | 同意 | |
| physics.electromagnetism | sketch | 同意 | |
| physics.optics | sketch | 同意 | |
| physics.thermal-physics | sketch | 同意 | |
| physics.special-relativity | full | 同意：推导短，而且是理解的关键 | |
| physics.quantum-mechanics | sketch | 同意 | |
| physics.general-relativity | sketch | 同意 | |

## id 汇总

**领域 id**：23 个都可以定。`analysis` 不改：`completeness` 已经是 `written`，`progress/` 里有它的记录（`progress/lessons.yaml` 和 `progress/problems/math.analysis.yaml`），领域改名等于给每一节改名，要写迁移脚本。

**小节 id**：下面以外的 641 个都可以定。下面这些全是 `outline`，`progress/` 里没有记录（`progress/` 里只有 `math.analysis.completeness`），改名、拆分都不用迁移脚本。

改名（6 个）：

| 现在的 id | 建议改成 | 理由 |
| --- | --- | --- |
| `math.abstract-algebra.pid-ufd` | `math.abstract-algebra.euclidean-domains` | 拆成两节（抽象代数重要 1） |
| `math.complex-analysis.elementary-functions` | `math.complex-analysis.complex-logarithm` | 内容只有复对数和幂函数（复分析重要 2） |
| `math.probability.generating-functions` | `math.probability.moment-generating-functions` | 标题是「矩母函数」（概率论重要 1） |
| `math.calculus-of-variations.multiple-integrals` | `math.calculus-of-variations.multivariable-functionals` | 读起来像重积分（变分法重要 1） |
| `physics.oscillations-waves.fourier-analysis` | `physics.oscillations-waves.plucked-string` | 和偏微分方程重复，改成物理应用；或者直接删（振动与波重要 1） |
| `physics.quantum-mechanics.commutators` | `physics.quantum-mechanics.generalized-uncertainty` | 对易子挪到前面讲，这一节只剩一般的不确定关系（量子力学重要 1）；选另一种做法就不改 |

新增（9 个）：

| id | 标题 | prerequisites | 层级 |
| --- | --- | --- | --- |
| `math.calculus.hyperbolic-functions` | 双曲函数 | `elementary-derivatives` | 6 |
| `math.analysis.parameter-integrals` | 含参变量积分 | `uniform-limit-theorems`、`math.calculus.improper-integrals`、`math.vector-calculus.partial-derivatives` | 14 |
| `math.analysis.gamma-function` | 伽马函数 | `parameter-integrals`、`math.vector-calculus.polar-double-integrals` | 15 |
| `math.analysis.trig-construction` | 用幂级数定义三角函数与 π | `exp-log-construction` | 17 |
| `math.abstract-algebra.unique-factorization` | 唯一分解整环 | `euclidean-domains` | 14 |
| `math.abstract-algebra.sylow-applications` | 用西罗定理分析有限群 | `sylow` | 14 |
| `math.abstract-algebra.galois-extensions` | 正规扩张与可分扩张 | `splitting-fields` | 18 |
| `math.abstract-algebra.radical-extensions` | 根式扩张 | `galois-correspondence`、`solvable-groups` | 20 |
| `physics.electromagnetism.magnetic-intensity` | 磁场强度与线性磁介质 | `magnetization` | 24 |

可选改名（3 处，不改也行）：

- `math.ode.linear-systems` → `math.ode.first-order-systems`：和 `math.linear-algebra.linear-systems`（高斯消元）同名，跨领域写前置时容易看错。
- `physics.electromagnetism.separation-of-variables` → `physics.electromagnetism.electrostatic-separation`：和 `math.pde.separation-of-variables` 同名。
- `physics.quantum-mechanics.hermite-polynomials` → `physics.quantum-mechanics.oscillator-series`，`physics.quantum-mechanics.ladder-operators` → `physics.quantum-mechanics.oscillator-ladder`：两节的标题都是「量子谐振子：……」，id 却按数学工具起名；以后讲角动量的升降算符时，`ladder-operators` 这个名字容易让人以为是通用的那一节。

## 给研究生和前沿内容留位置

**结论**：现在的领域划分和 23 个领域 id 都不会挡住以后加研究生课程和前沿专题，不需要为此改 id。建议现在就改的只有两个显示名（只改 `_domain.yaml` 的 `title`，随时能改回）：

- 「分析」→「数学分析」：以后加「实分析」（测度与勒贝格积分）、「泛函分析」「调和分析」时，单写「分析」分不清是哪一门。
- 「群论与表示论」→「群表示论」：群论本身在抽象代数，这个领域讲的是表示论（有限群和李群）；以后加研究生的「李群与李代数」或「有限群论」，名字不会打架。

**以后往哪里接**（括号里是建议的新领域 id；也可以在已有领域里往后接更深的小节，层级会自动排在右边）：

| 已有领域 | 以后可以新开的领域 | 天然的入口小节 |
| --- | --- | --- |
| logic-sets | 数理逻辑（`mathematical-logic`）、公理集合论（`set-theory`） | `axiom-of-choice`、`uncountable-sets` |
| analysis | 测度论（`measure-theory`）、泛函分析（`functional-analysis`）、调和分析（`harmonic-analysis`） | `parseval`、`math.probability.sigma-algebras` |
| ode | 动力系统（`dynamical-systems`） | `chaos`、`physics.analytical-mechanics.hamiltonian-chaos` |
| complex-analysis | 黎曼曲面（`riemann-surfaces`）、多复变（`several-complex-variables`） | `analytic-continuation` |
| probability | 随机过程（`stochastic-processes`）、随机分析（`stochastic-calculus`） | `random-walks`、`poisson-process` |
| abstract-algebra | 交换代数（`commutative-algebra`）、代数数论（`algebraic-number-theory`） | `unique-factorization`、`galois-correspondence` |
| topology | 代数拓扑（`algebraic-topology`）、微分拓扑（`differential-topology`） | `covering-spaces` |
| differential-geometry | 黎曼几何（`riemannian-geometry`）、纤维丛（`fiber-bundles`） | `riemann-curvature`、`stokes-on-manifolds` |
| representation-theory | 李理论（`lie-theory`） | `lie-algebras`、`lorentz-group` |
| pde | 研究生的偏微分方程（分布、索伯列夫空间）直接接在本领域后面 | `well-posedness`、`greens-functions` |
| newtonian-mechanics | 连续介质力学（`continuum-mechanics`）、流体力学（`fluid-dynamics`） | `bernoulli` |
| analytical-mechanics | 经典场论（`classical-field-theory`） | `field-lagrangian`、`noether-theorem` |
| optics | 量子光学（`quantum-optics`）、非线性光学（`nonlinear-optics`） | `lasers` |
| thermal-physics | 研究生的统计力学（`statistical-mechanics`，这个 id 现在空着） | `ising-model`、`quantum-statistics` |
| quantum-mechanics | 量子场论（`quantum-field-theory`）、量子信息（`quantum-information`）、凝聚态（`condensed-matter`）、原子物理（`atomic-physics`） | `density-matrix`、`entanglement`、`band-structure`、`atoms` |
| general-relativity | 宇宙学（`cosmology`） | `friedmann-equations`、`cosmic-expansion-history` |

其余领域（calculus、linear-algebra、vector-calculus、calculus-of-variations、oscillations-waves、electromagnetism、special-relativity）更深的内容要么已经在别的领域，要么直接接在本领域后面就行。

**需要你定的两件事**：

1. 以后新开领域的命名：推荐用课程本身的名字（如上表），不用 `advanced-`、`graduate-`、`intro-` 这类表示程度的词。程度已经由星图上的位置表示；而且一个领域以后还会往后接内容，名字里的「入门」「高等」迟早不对。
2. 广义相对论里的 4 节宇宙学（`flrw-metric`、`cosmological-redshift`、`friedmann-equations`、`cosmic-expansion-history`）放哪：如果确定以后要加宇宙学前沿（暴胀、微波背景辐射），可以现在就放进新领域 `physics.cosmology`（现在改名不用迁移，以后改可能要）。推荐留在广义相对论：它们是广义相对论课的标准内容，以后的宇宙学领域把它们列为前置就行。

**在已有领域往后接时的约定**：已有小节占了入门级的名字（例如 `math.ode.chaos`、`math.differential-geometry.manifolds`、`math.pde.greens-functions`），更深的小节用更具体的名字（例如 `chaos-strange-attractors`），不要回头给已有小节改名：写好以后改名要写迁移脚本。

**星图**：新领域按 id 插进学科那半圈，已有领域的带会挪位置、颜色也跟着变（只是布局，不影响 id 和进度）。如果以后希望相关的领域挨在一起（例如单变量微积分挨着分析），要在 `_domain.yaml` 里加一个排序字段，这是数据格式的改动，到时由写代码 agent 问你，现在不用动。

## 批次 0 写回 plan.md 的几处

1. 「严格化」规则（「前置只列最少的直接前置」那一段）：同意。漏用了一处（分析小问题 1 的 `sequences-limits`）；和「多余前置」的构建警告冲突时怎么办，我补了一句（见「我替你定的」3）。
2. 还是 outline 的小节改名、拆分也要查 `progress/`（「内容模型」的 id 规则）：同意，和进度迁移的规则一致。
3. 符号宏的名字在所有领域通用：同意。我核对了 23 个领域文件：一共 44 个宏名，每个宏名只有一种定义，没有冲突。补了两句（见「我替你定的」1、2）。这条现在只靠照抄，领域多了容易走样，可以让写代码 agent 加一条构建检查（同名宏的定义必须一致）；这是代码改动，我没做。
4. 各领域的 id 草案：同意，见「id 汇总」。
5. 目录的深度和分工：同意。没守住「只放在一处」的三处见「跨领域」。

## 批次 0 改动了已有文件的地方

都核对过，没有问题（按约定，我没有读写内容 agent 的汇报，只核对了文件本身）：

- `content/math/analysis/_domain.yaml`：加了宏 `\dd`。
- `sequences-limits` 的前置从 `[]` 改为 `[math.logic-sets.proof-methods]`：合理，量词和证明方法都在链上。
- `completeness`（`written`）的前置加了 `math.logic-sets.sets`：合理，讲解里用了描述法表示集合。它已经是 `written`，页面上的前置回顾会多一条；id 没变。
- `bounded-monotone` 的前置加了 `limit-arithmetic`：合理，对递推式两边取极限要用四则运算。

## 我替你定的

都能撤回：改 `docs/plan.md` 里那一句就行，内容还没按它们写。

1. **小写希腊字母的粗体矢量写 `\boldsymbol{\omega}`，不写 `\vb{\omega}`**（写进了「内容模型」里符号宏那一条）。理由：我用仓库里的 KaTeX 0.19.1 试过，`\mathbf{\omega}` 渲染出来是普通的 ω，在严格模式下也不报错，构建查不出来；`\boldsymbol{\omega}` 才是粗体。牛顿力学、分析力学的 goal 里已经这样写了（`\boldsymbol{\tau}`、`\boldsymbol{\omega}`）。
2. **`\N` 包含 0，正整数集写 `\N^+`**（同一条）。理由：这是国家标准的写法；已经写好的 `completeness` 用的就是 `\N^+`；逻辑与集合的皮亚诺公理从 0 开始最自然。
3. **「严格化」规则要列的那一节，已经能由别的前置推出时不再重复列**（写进了「前置只列最少的直接前置」那一段）。理由：不然和构建的「多余前置」警告冲突。按本报告改完后，`math.analysis.function-limits` 就是这种情况。

## 附：模拟 照本报告改完后的层级

按做法 (a) 处理表示论和量子力学的重复，其余都按各条的推荐。共 656 节，没有环，没有多余前置。「层级变了的节数」只数现有的小节，不含新增的 9 节。

| 领域 | 现在 | 改完 | 层级变了的节数 |
| --- | --- | --- | --- |
| math.abstract-algebra | 5–19 | 5–21 | 8 |
| math.analysis | 4–16 | 4–17 | 1 |
| math.calculus | 0–14 | 0–14 | 0 |
| math.calculus-of-variations | 11–16 | 11–16 | 0 |
| math.complex-analysis | 0–24 | 0–24 | 2 |
| math.differential-geometry | 13–23 | 13–23 | 0 |
| math.linear-algebra | 0–12 | 0–14 | 9 |
| math.logic-sets | 0–11 | 0–11 | 0 |
| math.ode | 8–21 | 8–21 | 1 |
| math.pde | 9–21 | 9–21 | 0 |
| math.probability | 0–18 | 0–18 | 2 |
| math.representation-theory | 11–23 | 11–36 | 12 |
| math.topology | 8–18 | 8–18 | 1 |
| math.vector-calculus | 1–17 | 1–17 | 0 |
| physics.analytical-mechanics | 14–25 | 14–25 | 0 |
| physics.electromagnetism | 12–27 | 12–27 | 1 |
| physics.general-relativity | 20–29 | 20–29 | 0 |
| physics.newtonian-mechanics | 8–17 | 8–17 | 0 |
| physics.optics | 0–37 | 0–36 | 7 |
| physics.oscillations-waves | 15–22 | 15–22 | 0 |
| physics.quantum-mechanics | 23–37 | 20–36 | 50 |
| physics.special-relativity | 11–26 | 11–26 | 0 |
| physics.thermal-physics | 0–38 | 0–37 | 6 |

## 复核

2026-11-09 · 你的决定是「全按推荐」（3 处可选改名也改，表示论按做法 (a)，宇宙学 4 节不动）。

**结论：没有需要修的，可以提交。** 上面 19 条重要、24 条小问题都改到了；写内容会话有 7 处和本报告做法不同，都对或可以接受；它对 `docs/plan.md` 的新改动都妥当；没有改出新问题。

### 怎么核的

- 重新汇总文件头和领域文件，和修订前逐节对比：现在 656 节（655 个 `outline`、1 个 `written`）。去掉 10 个 id（6 个改名、3 处可选改名共 4 个 id），加了 19 个（这 10 个的新 id 和 9 个新小节）；保留 id 的小节里，85 节改了前置、标题、goal 或 proofPolicy，另有 68 节只是层级跟着变。
- 用编译器在内存里跑了一遍校验：0 个错误，1 个警告还是原来那个（`sequences-limits` 是 outline，暂不检查锚点）。脚本另查了一遍：没有环，没有多余前置，没有指向不存在小节的前置，文件头的 id 都和路径一致。
- `npm test`：17 个文件、161 个测试全过（测试把 `content/` 复制到临时目录里跑，不改仓库）。
- 在仓库里搜了改名前的 10 个 id，除了本报告，没有地方还在用。
- 层级和「附：模拟」一致，只有抽象代数深了 1 层（5–22），原因见下面第 2 处。

### 和本报告做法不同的 7 处

1. `math.analysis.parameter-integrals` 的前置用 `polar-double-integrals` 代替 `math.calculus.improper-integrals`，`gamma-function` 只接 `parameter-integrals`：对。按本报告把 `improper-integrals` 加进 `polar-double-integrals` 以后，它已经能推出，照我原来写的反而多余；goal 的例子也确实要用高斯积分。
2. `galois-extensions` 接在 `galois-groups` 后面，`galois-correspondence` 只接它：对。goal 里用到了伽罗瓦群，我写 `splitting-fields` 是漏看了。深 1 层没关系。
3. `unique-factorization` 加 `math.complex-analysis.complex-numbers`（$\Z[i]$ 要用复数）：对，层级不变。写正文时留意一点，见「剩下的」1。
4. `general-relativity.newtonian-limit` 另加 `math.vector-calculus.vector-identities`：对。拉普拉斯算子在那一节，`divergence-theorem` 推不出它。
5. `generalized-uncertainty` 加 `oscillator-ladder`，goal 多了「彼此对易的可观测量有共同的本征态」：对。对易子现在在 `oscillator-ladder` 里引入，后面 `angular-momentum` 正要用 $L^2$、$L_z$ 的共同本征态；这一节仍是两个新概念。
6. 两处 goal 措辞（`unique-factorization` 的 $\Z[i]$ 例子、`sequential-compactness` 的勒贝格数引理）：都合适，都还是一句话。
7. 表示论 `schur-lemma`、`maschke-theorem`、`orthogonality-relations` 写了 `full`：本报告写的是「可选」，照做可以，这三个证明短，而且是这个领域的核心。偏微分方程去掉宏 `\lap`：和本报告的建议一致，plan.md 里也写明了。

### plan.md 的新改动

都妥当，和本报告、你的决定一致：`\P` 不能用、偏微分方程写 $\Delta$；以后新开领域用课程名起 id；在已有领域往后接更深小节时用更具体的名字、不给已有小节改名；宇宙学 4 节留在广义相对论；领域 id 从「草案」改成「定下来的」，并写明两个显示名的改动；`_domain.yaml` 示例改成「数学分析」和 `full`，和实际文件一致；「目录的深度和分工」补上双曲函数、含参变量积分和伽马函数、弦和圆膜、角动量这几处放在哪里；「建议从分析开始」改成「数学分析」。

### 剩下的（都不挡提交）

1. 写正文时：`euclidean-domains` 的讲解如果拿 $\Z[i]$ 当欧几里得整环的例子（这是最常见的例子），要把 `math.complex-analysis.complex-numbers` 挪到 `euclidean-domains`，同时从 `unique-factorization` 删掉，不然它变成多余前置。
2. 提交时只提交 `content/`、`docs/plan.md` 和 `docs/reviews/batch-0.md`。工作区里还有一个没跟踪的 `.claude/`，不是批次 0 的产出，不要带进这个提交。
3. 可选，都是写代码 agent 的事：加一条构建检查，要求同名宏在各领域的定义一致；`docs/plan.md` 实现记录里「物理在层级上整体偏右……审目录时再看」那句，可以改成审过的结论（这是真实前置决定的，不改）。

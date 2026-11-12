# 批次 14 审查报告：多变量微积分（重积分与极值）

审内容 agent（和写内容 agent 是两个独立会话，没有读它的会话记录、交接说明和自查脚本）· 2026-11-12

审查范围：`math.vector-calculus` 的 9 节：`double-integrals`、`triple-integrals`、`polar-double-integrals`、`cylindrical-spherical`、`change-of-variables`、`extrema`、`inverse-implicit`、`lagrange-multipliers`、`vector-fields`。包括：

- 它们的文件头、`problems.yaml`、9 张 SVG；
- 3 个动画的参数（`linear-map-2d`、`function-plot`、`vector-field-2d`）；
- `_domain.yaml` 新增的 14 个术语；
- 已审的 `jacobian:87` 补标的「雅可比行列式」。

另外看了：

- 以这一批为直接前置的已写小节（方案批次 14 那一段列的 6 节）和前向链接；
- 以这一批为前置、还没写的 12 节的大纲（`goal`）。

初审前按「每批的流程」第 4 条，把整个 `content/math/vector-calculus/`（含 `_domain.yaml`）拷了一份快照到我的 scratchpad（`b14-snapshot/`），复核时和它比。

## 结论

没有重要问题；小问题 2 条；原有问题并在小问题 1 里（批次 13 我漏报的「施瓦茨定理」）。讲解、例题、72 道题和 9 张图、3 个动画的数学都对。

- **小问题 1：两节以上用到、还没进术语表的名词，6 个**
  - 方案 `plan.md:244`：两节以上用到的名词就进术语表（批次 10），链接文字在句子里当名词用的也算（批次 12）；补标 `reviewed` 的小节、退回 `written` 是正常流程。别的领域都把定理名放进术语表，例如数学分析的最值定理、夹逼定理，线性代数的谱定理、惯性定理。
  - 这一批新起名、又在别的小节用到的：
    - 「面积元」：`double-integrals:23` 起名（在 `def-double-integral` 段里）；`polar-double-integrals:25`、`change-of-variables:16` 的正文也用到；`cylindrical-spherical` 第 7 题是题目文字。
    - 「体积元」：`triple-integrals:23` 起名（在 `def-triple-integral` 段里）；`cylindrical-spherical:16` 等 5 处、`change-of-variables:16` 也用到；「柱坐标」「球坐标」两条简介里也写了它。
    - 「富比尼定理」：`double-integrals:35` 起名（锚点 `thm-fubini`）；`triple-integrals:32`「这就是三维的富比尼定理」。
  - 批次 13 的名词，这一批又用到的：
    - 「局部线性近似」：`jacobian:35` 起名（锚点 `thm-local-linear`）；`change-of-variables:25`、`inverse-implicit:25` 当名词用。
    - 「最值定理」：`multivariable-limits:47` 起名（锚点 `thm-extreme-value`）；`extrema:39`「由[最值定理](…)（extreme value theorem）」，链接文字当名词用。数学分析也有「最值定理」，照「连续」「链式法则」的先例各标各的 id，简介写明是多元的（有界闭区域上）。
    - 「施瓦茨定理」：`partial-derivatives:39` 起名，`taylor-multivariable:25`、`:34`、这一批的 `vector-fields:91` 也用到。批次 13 时它就已经两节在用，我当时漏报了。
  - 进表后：
    - 定义段落已经有锚点：面积元、体积元和二重积分、三重积分共用锚点；其余四个是各自的定理段。
    - 各节每一块里第一次出现的地方补标。动到的已审小节是 `partial-derivatives`、`taylor-multivariable`、`multivariable-limits`、`jacobian`。
    - 别的领域：我扫了这 6 个词在别的领域的用法，正文里一处都没有。题目文字里只有电磁学 `inductance` 第 6 题的提示（`problems.yaml:124`）有一处「体积元」，可标可不标。数学分析的「最值定理」是一元的那一条，各标各的 id，不冲突。
  - 我认为不用进表的几个，见「我替你定的」1。
- **小问题 2：题目文字两处**
  - `cylindrical-spherical` 第 8 题提示 3（`problems.yaml:129`）：$\iiint f\,\dd V=\int_04\pi r^2f(r)\dd r$ 漏了积分上限，显示成只有下限 $0$；参考解答 `:135` 写的是 $\int_0^\infty$。改成 `\int_0^\infty4\pi r^2f(r)\dd r`。
  - `lagrange-multipliers` 第 8 题参考解答（`problems.yaml:133`）：「约束放宽一点，最优值增加约 $\lambda$ 倍那么多」。「增加……倍」是 `plan.md:269` 不让写的那类说法，这里还说不清是什么的倍数。改成「约束的值增加 $\Delta c$，最优值约增加 $\lambda\Delta c$」。

**写内容会话拿不准的两处**：都可以，不用改。
- `extrema` 第 7 题题干括注「连续可导函数（continuously differentiable function）」：这一节第一次出现的名词，英文是通用名，括注对。
- `polar-double-integrals` 第 8 题参考解答用了 $\int_{-\infty}^\infty\sin x^2\dd x=\int_{-\infty}^\infty\cos x^2\dd x=\sqrt{\pi/2}$，写了「这里不证」。思考题的参考解答引一个标准值、注明不证可以。我核了它推出的「正方形上的积分趋于 $\pi$」：$\sin(x^2+y^2)=\sin x^2\cos y^2+\cos x^2\sin y^2$，所以极限是 $2\cdot\sqrt{\pi/2}\cdot\sqrt{\pi/2}=\pi$，对。

## 改了没报的

无。改动和交接一致：
- 9 节的正文、题目和 9 张 SVG；
- `_domain.yaml` 新增 14 条术语；
- 两处前置改动；
- `jacobian:87` 的补标（另外只改了 `status`）。

9 节的标题、`goal` 都没动；多变量微积分别的大纲没动。

## 要修的，按小节分

- `double-integrals`：「面积元」「富比尼定理」进表后标记（小 1）。
- `triple-integrals`：「体积元」「富比尼定理」标记（小 1）。
- `polar-double-integrals`：「面积元」标记（小 1）。
- `cylindrical-spherical`：「体积元」标记（小 1）；第 8 题提示 3 的积分上限（小 2）。
- `change-of-variables`：「面积元」「体积元」「局部线性近似」标记（小 1）。
- `extrema`：`:39` 的「最值定理」改成标记（小 1）。
- `inverse-implicit`：「局部线性近似」标记（小 1）。
- `lagrange-multipliers`：第 8 题参考解答的说法（小 2）。
- `vector-fields`：「施瓦茨定理」标记（小 1）。
- 批次 13 的已审小节：`partial-derivatives`、`taylor-multivariable`（施瓦茨定理），`multivariable-limits`（最值定理），`jacobian`（局部线性近似）（小 1）。
- `_domain.yaml`：6 个新条目（小 1）。

## 怎么审的

- **读题和验算**：
  - 简单题、中等题用 `npm run statements -- <9 节> --tier easy,medium` 读题，独立写了 9 个验算脚本 `tools/verify/math.vector-calculus.<小节>.ts`，逐个跑，36 道第一遍就全部一致。
  - 共用的 `tools/verify/math.vector-calculus._vc.ts` 加了几样通用工具，都不含答案：
    - 双指数（tanh-sinh）求积：端点处有根号也能到 $10^{-9}$ 以内，用 $\frac\pi4$、$\pi$ 等几个已知积分试过；
    - 嵌套的二重积分；
    - 牛顿法解方程组；
    - 四阶龙格-库塔。
  - 验算不用要验的那条结论：
    - 极坐标、柱坐标、球坐标、换元的题，一律在原来的直角坐标里写成累次积分硬算，圆环、区域的折点处拆开；
    - 交换次序的题照题面的次序硬算内层；
    - 二重积分的面积题换另一个次序；
    - 三重积分 $p2$ 改成按 $z$ 切片算截面面积；
    - 驻点从一片网格的初值用牛顿法找全，分类不用判别法，在小圆上看函数值；
    - 闭圆盘上的最值，内部用网格加黄金分割，边界用参数搜；
    - 隐函数、反函数逐点用二分法、牛顿法解出来再差分，不用 $-\frac{F_x}{F_y}$ 和 $J^{-1}$；
    - 条件极值不用乘数，把约束参数化或消元后直接搜；
    - 流线用龙格-库塔从给定点走一段，看终点满足什么关系。
  - 全量 `npm run verify`：215 节全部一致，退出码 0。
  - `npx tsc -b` 第一次报了我自己的 `triple-integrals` 脚本里两个没用到的参数，改成 `_z`、`_y` 后退出码 0。
  - `npm test` 23 个文件、202 条全过；`npm run content` 0 个错误、0 个警告。
  - 验算完才打开 `problems.yaml` 读难题、思考题和全部提示、解答。
- **术语**：
  - 每一块里术语第一次单独出现有没有标记：没有漏的；没有超过 4 句的段。
  - 括注按页面先后查：没有漏的，报出的都是中学词（同心圆、双曲线、引力场）和只起「见某节」作用的链接文字。
  - 讲解里起名的段落（叫作、这就是、统称……）共 16 处。没锚点的 3 处都不是起名：两处是「这就是三维的富比尼定理」这类认出已有的东西；`inverse-implicit:27` 是提前提到「雅可比行列式」。
  - 拼词：标记前后一到四个字拼不出别的术语。
  - 「两节以上用到」：把候选名词在本领域各节的出现次数数了一遍，结果见小问题 1。
- **链接、前置、规矩 C**：
  - 链接的目标、锚点都存在；14 条术语的锚点段里都有术语名；前置没有多余的。
  - 链外的标记 5 处都允许：
    - 规矩 C：`lagrange-multipliers:43` 的「约束」「约束力」，`vector-fields:41` 的「电场线」「常微分方程」；
    - 提前提到本领域后面的词：`inverse-implicit:27` 的「雅可比行列式」，`plan.md:964` 允许。
  - 正向扫了别的领域术语表的词在这 9 节里的链外出现，报出的都不用标：
    - 链上学过的概念：牛顿-莱布尼茨公式、比较判别法、线性近似、可导函数，`plan.md:245`；
    - 中学词：投影、夹角、行列式、法向量、电荷、电势；
    - 数学意思的「约束」；
    - 「鞍点」都是本领域的意思，已经标了本领域的 id。
  - 反向扫了 14 个新术语在别的领域的出现，结果和台阶 1 一样：正文只有分析力学批次 1 写的 `noether-theorem` 的「柱坐标」，不追溯；其余在链接文字和题目文字里。
- **引文**：「例 N」「第 N 题」逐个对过；这一批没有「上一节」「下一节」。
- **页面**：
  - 网站构建到 scratchpad、起临时服务，768 像素宽看了 9 节和 `jacobian`，看完就删了副本（C 盘紧张）。
  - 每节展开全部提示（各 24 次）和简单题、中等题的解答（各 4 道）：0 处公式报错、没有横向滚动。
  - 9 张 SVG 都导出看过（暗色），量了文字：
    - 不重叠；
    - 压线的只有 `implicit.svg` 的「A」脚边挨着切线虚线，放大看清楚可读；
    - 离边最近的是 `critical.svg` 底下一行，竖直方向 4.3 像素（批次 13 认可过 4.4 像素）。
  - 动画改滑块导出画面：
    - `change-of-variables` $(r,\theta)=(1.5,0.75)$、$(2.5,2.25)$、$(0.25,6.25)$；
    - `lagrange-multipliers` $c=2.5$、$4.5$、$7$；
    - `vector-fields` $a=0$、$0.5$ 各推 300 帧。

## 各节

只记有内容的地方；上面已经报过的不重复。

- **`double-integrals`**：
  - 富比尼定理的条件（闭矩形上连续）、一般区域的定理（边界曲线连续）都写进了条件。
  - `:37` 说两种次序相等的证明见数学分析 `parameter-integrals`，那边 `:67` 也说「这里对矩形上的连续函数补上了证明」，两边对得上。`:39` 引的那一节第 4 题正是两个累次积分不等的例子。
  - 例 1（两种次序都是 $5$）、例 2（$\frac{e-1}2$）核过。
  - SVG：截面 $A(0.5)=5$，竖条、横条的位置核过。
  - 第 5 题（重积分公式）、第 6 题（$(\int f)^2\le(b-a)\int f^2$）、第 7 题（卡瓦列里、祖暅：1635 年、南北朝，史实对）、第 8 题对。
- **`triple-integrals`**：
  - 例 1（$\frac16$）、例 2（$\frac1{24}$）核过。
  - SVG：$(0.3,0.2)$ 上方的线段到 $z=0.5$，$z=0.6$ 处的截面 $x+y\le0.4$，都对。
  - `:25` 的「电荷 $\int_V\rho\,\dd V$」和电磁学 `continuous-charge:32` 的写法一致。
  - 第 5 题（两种次序都是 $\frac1{24}$）、第 6 题（质心 $\frac14$，在到对面中心连线的 $\frac34$ 处）、第 7 题、第 8 题（锥体 $\frac13Sh$）对。
- **`polar-double-integrals`**：
  - 极坐标矩形取 $r$ 的中点，$\bar r\Delta r\Delta\theta$ 正好是它的面积，`:32` 的说法对。
  - 高斯积分的夹逼 $\pi(1-e^{-R^2})\le I(R)^2\le\pi(1-e^{-2R^2})$ 对；反常二重积分只对 $f\ge0$ 定义，和第 8 题、常见误区 `:77` 一致。
  - 例 1（$8\pi$）、例 2（$\pi$）、常见误区里漏乘 $r$ 的 $\frac{32\pi}3$ 核过。
  - 第 5 题（$\frac{\sqrt\pi}2$，和 `parameter-integrals:16` 的 $\frac{\sqrt\pi}4a^{-3/2}$ 一致）、第 6 题、第 7 题、第 8 题对。
- **`cylindrical-spherical`**：
  - 记号：柱坐标 $(s,\varphi,z)$，球坐标 $(r,\theta,\varphi)$，$\theta$ 从 $z$ 轴正向量起。
  - 台阶 1 担心的「和电磁学一致」这种说法正文里没有：`:25` 写「物理书大多这样写」，`:37`、`:75` 两处都交代了电磁学的方位角写 $\psi$，数学书常把 $\theta$、$\varphi$ 对调。
  - 例 1（$\frac12Ma^2$）、例 2（$\frac{2\pi a^3}3(1-\frac{\sqrt2}2)\approx0.613a^3$）核过。
  - 第 5 题（$\frac25MR^2$，两种算法）、第 6 题（$r=2\cos\theta$）、第 7 题对；第 8 题除了小问题 2 都对。
- **`change-of-variables`**：
  - 例 1：球坐标雅可比行列式的四项逐项核过，加起来是 $r^2\sin\theta$。例 2（$e-1$）核过。
  - 动画：极坐标的雅可比矩阵，默认 $\det=1.5$；$r=2.5$ 时角点 $(-2.57,-0.79)$ 在 $\pm3$ 的范围里。
  - SVG：四个角 $(1,1)$、$(1.5,0.5)$、$(0.5,-0.5)$ 和棕色小格的像（边长 $\frac{0.5}{\sqrt2}$ 的正方形）核过。
  - 第 5 题（$\frac43\pi abc$）、第 6 题（$\frac{2\pi}{\sqrt3}$，和 $\frac\pi{\sqrt{\det A}}$ 一致）、第 7 题、第 8 题对。
  - `:90`「多了一倍」见「我替你定的」2。
- **`extrema`**：
  - 判别法 (3) 的证明里 $Q(-f_{xy},f_{xx})=f_{xx}D$ 核过。
  - 例 1（驻点 $(0,0)$、$(\pm1,\pm1)$，$D=128$，$f=-2$）、例 2（最大 $\frac94$、最小 $-\frac14$）核过。
  - SVG：$f=0$ 的等值线在原点沿两条坐标轴交叉（原点附近 $f\approx-4xy$），和说明一致。
  - 常见误区 `:69`（$x^3+y^2$ 在原点是鞍点）和批次 13 改过的鞍点定义一致。
  - 第 5 题、第 6 题（$a=\frac32$、$b=\frac76$，误差平方和 $\frac16$）、第 7 题（$f(4,1)=-11$）、第 8 题对。
- **`inverse-implicit`**：
  - 隐函数定理由反函数定理推出（$G(x,y)=(x,F)$），对。`:36` 补上了 `gradient:44` 留下的那一步，第 5 题把它证完整。
  - 例 1（$J^{-1}$ 和直接求导核对）、例 2（叶形线上 $y'=-1$）核过。
  - SVG：$A(0.6,0.8)$ 处 $F_y=1.6$、斜率 $-0.75$，对。
  - 第 6 题（$\pdv ux=2$ 等四个值，并用 $u=\frac{x-\sqrt{2y-x^2}}2$ 直接核对）、第 7 题、第 8 题对。
- **`lagrange-multipliers`**：
  - 几个约束的条件写成「没有哪个约束的梯度是其余梯度的线性组合」，就是线性无关（含不为零），和分析力学 `constraint-forces:58` 对得上。
  - 例 1（$4.5$）、例 2（$(1,2,3)$，$\sqrt{14}$）核过。
  - 动画 $c=2.5$ 时交于 $x=1$、$5$，$c=4.5$ 时相切于 $(3,1.5)$；SVG 的 $\nabla f=(1.5,3)=1.5\nabla g$ 对。
  - 第 5 题（$1\pm\sqrt2$）、第 6 题、第 7 题（尖点）、第 8 题对（$\dv Mc=\lambda$）；第 8 题的说法见小问题 2。
- **`vector-fields`**：
  - `:41` 的「过 $\vb F\ne\vb0$ 的每一点恰有一条流线」对，引的是 `existence-uniqueness`。
  - 例 1（周期 $2\pi$，和 $R$ 无关）、例 2（$xy=1$）核过。
  - SVG 三幅图的箭头方向、流线（圆、射线、$xy=\pm1$）核过。
  - 动画 $a=0$ 时轨迹是同心圆，$a=0.5$ 时向外张开的螺线，和说明一致。
  - 第 5 题到第 8 题对。

## 台阶 1 问的几处

- **前置改的两处**：都合理，也都是最少的。
  - `double-integrals` 的 `functions-of-several-variables` 换成 `multivariable-limits`：富比尼定理和一般区域的定理都要多元的「连续」；`functions-of-several-variables` 经它在链上。
  - `lagrange-multipliers` 加 `inverse-implicit`：证明要用隐函数定理，和那一节第 5 题的「等值线是光滑曲线」。`extrema`、`gradient` 推不出它，`gradient` 也不在另两个前置的链上，三个都要。
- **以这一批为直接前置的已写小节**：都接住了。
  - 数学分析 `parameter-integrals:16`、`gamma-function:48` 和第 6 题的高斯积分 ↔ `polar-double-integrals` 的 `thm-gaussian`，含反常二重积分。`parameter-integrals:67` ↔ `double-integrals:37`，两边互相指着，说法一致。
  - 常微分方程 `convolution-impulse:51`：二重积分、交换次序在 `double-integrals`。积分区域无界时换次序的条件，那一节自己写了「这里不证」，不用这边接。
  - 变分法 `isoperimetric-problems`（积分约束配一个乘子）↔ `lagrange-multipliers:43`；分析力学 `constraint-forces:58`（梯度线性无关，每个约束一个乘子）↔ `thm-lagrange-several`。
  - 分析力学 `inertia-tensor`（对立方体做三重积分）、电磁学 `continuous-charge`（$\rho\,\dd V$）↔ `triple-integrals`。
  - 前向链接：
    - 线性代数 `determinant:59` ↔ `change-of-variables:25`；
    - 数学分析 `extreme-value` 第 8 题 ↔ `extrema:39`、`:41`；
    - 常微分方程 `exact-equations` 第 8 题 ↔ `inverse-implicit` 的 `thm-implicit-function`；
    - 本领域 `multivariable-chain-rule:27`、`gradient:44` ↔ `inverse-implicit`；`taylor-multivariable:53` ↔ `extrema`。
    - `jacobian:87` 的补标对：新词第一次出现、在例 1 那一块里，按 `plan.md:964` 提前提到。
- **以这一批为前置、还没写的 12 节**：看了 `goal`，打的底够用。
  - 概率论 `normal-distribution` ← `polar-double-integrals` 第 7 题已经算了归一化；`multivariate-normal` ← `change-of-variables` 第 6 题已经有 $\frac\pi{\sqrt{\det A}}$；`joint-distributions` ← `double-integrals` 的累次积分和 `:39` 的乘积拆分。
  - 热学 `maxwell-speed-distribution` ← `cylindrical-spherical` 第 8 题的 $4\pi v^2$；`ideal-gas-partition-function` ← 高斯积分；牛顿力学 `shell-theorem` ← 球坐标。
  - 微分几何 `regular-surfaces` ← `inverse-implicit:32` 的三元隐函数定理。
  - 本领域的 `line-integrals`、`surface-integrals`、`curl-divergence`、`greens-theorem`、`parametric-surfaces` ← 向量场、二重积分、换元。`vector-fields` 第 8 题已经把「沿闭曲线走一圈」引到 `line-integrals`。
- **「极值」不进表**：同意。一元的极值在链上的 `calculus.local-extrema`，多元的定义一字不差，按 `plan.md:245` 是链上学过的概念。
- **写内容会话定的**：
  - 柱坐标、球坐标的记号：妥当，正文的交代见「各节」。
  - 规矩 C 的取舍：妥当。`vector-fields:41` 的「电场线」「常微分方程」、`lagrange-multipliers:43` 力学意思的「约束」「约束力」标了；「电荷」「电场」「电势」当中学词，数学意思的「约束」当普通词。
  - 「上一节」「下一节」：这一批一处都没有。
- **跨领域补标**：和台阶 1 一致，这一批的 14 个新术语在别的领域正文里都不用补。小问题 1 新进表的 6 个，见那一条。

## _domain.yaml

- 术语从 22 条加到 36 条，新增 14 条；宏没动。
- 14 条的定义小节、锚点都存在，锚点段里都有术语名。
- 简介都在 60 字以内（构建查过），内容和讲解一致。细看过的：
  - 「反常二重积分」写了 $f\ge0$、连续，和正方形逼近同一个极限；
  - 「球坐标」写了 $\theta$ 从 $z$ 轴正向量起；
  - 「隐函数定理」写了三个条件和唯一性；
  - 「拉格朗日乘数法」写了 $\nabla g\ne\vb0$，顺带起了「拉格朗日乘子」的名字。
- 要加的 6 条见小问题 1。

## 我替你定的

1. **几个名词不进术语表**：
   - 「积分区域」「黎曼和」：「积分区域」是一看就懂的说法；「黎曼和」是单变量微积分 `definite-integral` 的词，在链上，等那个领域写的时候进它自己的表。
   - 「速度场」「力场」：向量场的两个例子，字面就是意思。`jacobian` 和 `vector-fields` 各用了几次。
   - 「等高线」：地图上的日常词。
   - 能撤回：要进表的话，照小问题 1 的办法加。
2. **倍数的说法**：`change-of-variables:90`「多了一倍」是 N = 1，没有歧义，常微分方程 `numerical-methods:48` 也这么写，不算违规；放大、缩小的倍数照批次 13 写回的规矩可以用。只报了小问题 2 那一处「增加约 $\lambda$ 倍那么多」：它说不清是什么的倍数。
3. **选项和题目的取材**：
   - `extrema` 第 2 题的 $x^2-3xy+y^2$ 是 `taylor-multivariable` 动画那一族的 $b=-3$，可那是另一节判过的，规矩管的是「本节」。
   - `vector-fields` 第 3 题和例 2 是同一族：场差一个因子 $\frac12$，要想到流线不变，算批次 5 的例外。
4. **`jacobian` 的状态先不改回 `reviewed`**：`:87` 的补标核过、页面上显示成术语。可小问题 1 还要在 `jacobian` 标「局部线性近似」，复核时一起改。
5. **图里两处没报**：`implicit.svg` 的「A」脚边挨着切线虚线，看得清；`critical.svg` 底下一行离边 4.3 像素，是竖直方向。

## 要写回 plan.md 的

- 术语规范「两节以上用到的名词就进术语表」后面补一句：定理名（施瓦茨定理、富比尼定理、最值定理这类）和面积元、体积元这类有名字的记号，同样按这一条；多元版本和数学分析同名的，照「连续」「链式法则」各标各的 id（批次 14 审查时提的）。
- 多变量微积分那一段的记号约定加一条：柱坐标 $(s,\varphi,z)$，球坐标 $(r,\theta,\varphi)$，$\theta$ 从 $z$ 轴正向量起；电磁学的方位角写 $\psi$（写内容会话定的，审查认可）。

## 需要你决定的

无。

## 没验证的地方

- **帧率和手感**：动画实际的帧率和拖动滑块的手感，要在 Chrome 里看。
- **主题**：9 张 SVG 和 3 个动画只看了暗色。
- **宽度**：只用 768 像素宽模拟，没看手机宽度和 iPad 真机。有几条长的行内公式（`double-integrals:47` 约 675 像素），768 像素下放得下，再窄可能撑宽。
- **小问题 1 的补标**：6 个词进表以后，本领域各节的补标要写内容会话改完、复核时才能核；别的领域只有题目文字里的一处，见那一条。

## 修订说明（写内容会话）

两条小问题都修了。

### 小问题 1：6 个名词进术语表并补标

- **术语表**：`_domain.yaml` 从 36 条加到 42 条，每条插在定义它的小节的条目后面。

| 术语 | id | 定义的小节和锚点 |
| --- | --- | --- |
| 最值定理 | `extreme-value-theorem` | `multivariable-limits` · `thm-extreme-value` |
| 施瓦茨定理 | `schwarz-theorem` | `partial-derivatives` · `thm-schwarz` |
| 局部线性近似 | `local-linear-approximation` | `jacobian` · `thm-local-linear` |
| 面积元 | `area-element` | `double-integrals` · `def-double-integral` |
| 富比尼定理 | `fubini-theorem` | `double-integrals` · `thm-fubini` |
| 体积元 | `volume-element` | `triple-integrals` · `def-triple-integral` |

- **简介**：
  - 只用定义它的那一节链上的概念，用脚本逐词核过。
  - 「最值定理」的简介写明是多元函数、在有界闭区域上，和数学分析那条一元的各标各的 id。
- **补标**：本领域每一块里第一次出现的地方都标了，共 25 处。
  - 批次 13 的小节：
    - `multivariable-limits:47`（定理名）；
    - `partial-derivatives:39`（定理名）、`:86`；
    - `jacobian:35`（定理名）、`:46`、`:87`、`:102`；
    - `taylor-multivariable:25`、`:34`。
  - 这一批：
    - `double-integrals:23`、`:35`（定理名）、`:49`、`:65`；
    - `triple-integrals:23`、`:32`、`:67`；
    - `polar-double-integrals:25`；
    - `cylindrical-spherical:16`、`:72`；
    - `change-of-variables:16`（面积元、体积元）、`:25`；
    - `inverse-implicit:25`；
    - `vector-fields:91`；
    - `extrema:39`。
  - `extrema:39` 原来是链接文字，改成了标记。
  - `change-of-variables:25` 去掉了括注里的「见[雅可比矩阵](…)」：标记的浮窗已经指向定义。
- **状态**：已审的 `multivariable-limits`、`partial-derivatives`、`taylor-multivariable` 退回 `written`。`jacobian` 本来就是 `written`。
- **括注**：6 个词在各节第一次出现的地方原来都有英文括注，没有要补的。按页面先后又扫了一遍，确认过。
- **同类找全**：
  - 本领域 18 节（批次 13 的 9 节和这一批 9 节）都加上这 6 个触发词重跑了自查，每一块第一次出现都已标记，拼词检查没有报出问题。
  - 不带「局部」的「线性近似」（`differentiability:73`、`:77`，`jacobian:54`）是一般说法，没按这个术语标。`differentiability` 说的是切平面那种一元式的近似，而且在 `jacobian` 之前。
  - 「积分区域」「黎曼和」「速度场」「力场」「等高线」照审查「我替你定的」1，不进表。
- **别的领域**：没改。电磁学 `inductance` 第 6 题提示的「体积元」是题目文字，可标可不标，也不在这次的修改范围。

### 小问题 2：题目文字

- `cylindrical-spherical/problems.yaml:129`：第 8 题提示 3 的 `\int_0` 补成 `\int_0^\infty`。
  - 同类：用脚本列出这一批正文、题目和术语表里所有只有下标、没有上标的积分号。改完剩 19 种写法，下标都是积分区域（$D$、$R$、$T$、$V$、$E$、$\Omega$、$D_R$、$S_R$、$\R^2$、$\R^3$、正方体、球、圆盘）。漏上限的只有这一处。
- `lagrange-multipliers/problems.yaml:133`：第 8 题参考解答照建议改成「约束的值增加 $\Delta c$，最优值约增加 $\lambda\Delta c$」。
  - 同类：这一批正文和题目里的「倍」共 26 个，逐处看过。其余都是「是……的 N 倍」或缩放的「放大……倍」，`plan.md:269` 允许。`change-of-variables:90` 的「多了一倍」照审查「我替你定的」2，不改。

### 验证

- 全量 `npm run content`：0 个错误、0 个警告。
- `npm test`：23 个文件、202 项通过。
- 写内容会话自己的数值验算 `check_b14.py`：189 项一致。这次没改数学内容。
- 页面：网站构建到 scratchpad，起临时服务，768 像素宽看了 13 节：这一批 9 节，加上动到的 `multivariable-limits`、`partial-derivatives`、`taylor-multivariable`、`jacobian`。
  - 0 处公式报错，没有横向滚动，提示和解答都展开了。
  - 6 个新术语的浮窗都能打开，标题、英文名、简介都对。
  - `cylindrical-spherical` 第 8 题提示 3 显示成 $\int_0^\infty4\pi r^2f(r)\dd r$。
  - 看完删了副本，停了服务。
- 改动范围：
  - `content/math/vector-calculus/` 下 15 个文件：`_domain.yaml`、12 节的 `lesson.md`、`cylindrical-spherical` 和 `lagrange-multipliers` 的 `problems.yaml`；
  - 这份报告的本节。
  - `progress/lessons.yaml` 没动。

## 复核

审内容 agent · 2026-11-12。和初审快照 `b14-snapshot/` 比，旧课用 `git diff HEAD` 看。

### 结论

通过，没有要再改的。

- 两条小问题都改对了，同类也找全了；修订说明和实际改动一致，没有改了没提的。
- 13 节的 `status` 已改成 `reviewed`（只改了这一行）：这一批 9 节，加上补标退回的 `multivariable-limits`、`partial-derivatives`、`taylor-multivariable`、`jacobian`。多变量微积分已写的 18 节现在都是 `reviewed`。
- 页面这次没能看：C 盘满了，见「剩下的」。

### 逐条

- **小问题 1（6 个名词进表）**：
  - 6 条都插在各自定义小节的条目后面，锚点都存在，锚点段里都有术语名；脚本查了整张表 42 条，全部通过。
  - 简介都对：
    - 「最值定理」写明是多元函数、有界闭区域，和数学分析那条一元的分得开；
    - 「施瓦茨定理」的条件和 `partial-derivatives:39` 一致；
    - 「富比尼定理」写了闭矩形、连续；
    - 面积元、体积元说的是 $\dd A$、$\dd V$，和直角坐标下的写法。
  - 补标 25 处，逐处看了词级 diff，都在所在块里第一次出现的地方：
    - 起名的段落里标的是定理名本身：`multivariable-limits:47`、`partial-derivatives:39`、`jacobian:35`、`double-integrals:35`；
    - `extrema:39` 由链接改成标记；
    - `change-of-variables:25` 去掉了括注里多余的「见[雅可比矩阵](…)」。
  - 同类：
    - 18 节每一块第一次出现，脚本查过都已标记（只剩 `functions-of-several-variables:23` 定义段里的别名，按规矩不标）；
    - 前后一到四个字拼不出别的术语；
    - 新标记都在链上，链外的标记和初审时一样，都是允许的那几处。
  - 「线性近似」不带「局部」的三处（`differentiability:73`、`:77`，`jacobian:54`）没标：说的是一般的线性近似，`differentiability` 又在 `jacobian` 之前，理由站得住。
- **小问题 2（题目文字）**：
  - `cylindrical-spherical` 第 8 题提示 3 补成 $\int_0^\infty$；`lagrange-multipliers` 第 8 题参考解答照建议改了。
  - 同类：写内容会话查了全部只有下标的积分号（都是积分区域）和 26 个「倍」，结论和我初审时的判断一致。

### 怎么核的

- **比改动**：`diff -rq` 快照和现在的 `content/math/vector-calculus/`，改了 15 个文件，和修订说明列的一样；12 节 `lesson.md` 用词级 diff 逐处看，`_domain.yaml` 和两个 `problems.yaml` 用逐行 diff 看。旧课的 4 节另外用 `git diff HEAD` 核了补标处和 `status`。
- **脚本重跑**：
  - 术语标记、括注、整张表的锚点、前置链、拼词，结果见上；
  - 9 个验算脚本没改，全量验算照样一致。
- **全量**：
  - `npm run content` 0 个错误、0 个警告（改状态前后各跑一次）；
  - `npx tsc -b` 退出码 0；
  - `npm test` 23 个文件、202 条全过；
  - `npm run verify` 215 节全部一致，退出码 0。

### 要写回 plan.md 的

和初审时一样，没有新的：
- 定理名、面积元这类记号名词也按「两节以上就进表」，同名的多元版本各标各的 id；
- 多变量微积分的柱坐标、球坐标记号约定。

### 剩下的

- **页面没看**：
  - 我这次重建网站副本时 C 盘满了，构建前只剩 16 MB，写到一半失败。删掉半成品后 C 盘仍只有十几 MB，是别的会话在占用。
  - 这次改的只是标记、术语表和两句题目文字，`npm run content` 已经核过标记和锚点。页面靠写内容会话看过的 13 节（浮窗、公式报错、横向滚动）。
  - 新术语的浮窗、第 8 题提示的显示，我没有亲眼看。
- 别的同初审：动画帧率、亮色主题、真机。

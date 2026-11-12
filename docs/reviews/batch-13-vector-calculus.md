# 批次 13 审查报告：多变量微积分（多元函数的微分）

审内容 agent（和写内容 agent 是两个独立会话，没有读它的会话记录、交接说明和自查脚本）· 2026-11-12

审查范围：`math.vector-calculus` 的 9 节：`functions-of-several-variables`、`multivariable-limits`、`partial-derivatives`、`differentiability`、`multivariable-chain-rule`、`gradient`、`jacobian`、`taylor-multivariable`、`legendre-transform`。包括它们的文件头、`problems.yaml`、7 张 SVG、4 个动画的参数（2 个 `function-plot`、1 个 `vector-field-2d`、1 个 `linear-map-2d`），以及 `_domain.yaml` 从空表加到 22 条的术语表和新加的宏 `\dv`。另外看了：

- 以这一批为直接前置的已写小节（方案批次 13 那一段列的 11 节）和 3 处前向链接；
- 以这一批为前置、还没写的 11 节的大纲（`goal`）；
- 改了前置的大纲 `change-of-variables`。

台阶 1 列的 5 处跨领域补标（下一轮修订时改），初审只核了它们该不该补，改动复核时看。

初审前按「每批的流程」第 4 条，把整个 `content/math/vector-calculus/`（含 `_domain.yaml`）拷了一份快照到我的 scratchpad（`b13-snapshot/`），复核时和它比。

## 结论

重要 2 条，小问题 3 条，原有问题 1 条。另外，台阶 1 的补标清单外还有 4 处，见「需要你决定的」1。

- **重要 1：「鞍点」的定义：锚点没落在起名的那一段，第 7 题的说法和定义对不上（`taylor-multivariable`）**
  - `:41` 是「为什么这样定义」那一段，「这样不是局部极值点的驻点叫作鞍点（saddle point）」在这里起名，前面没有锚点。术语表「鞍点」（`_domain.yaml:169`–`:177`）的锚点是 `def-stationary-point`，指向 `:39`，那一段只定义驻点，没有「鞍点」这个词。别的小节点「鞍点」的浮窗跳过去，卡片里看不到鞍点。脚本查了 22 条术语的锚点段里有没有术语名，只有这一条没有。
  - 方案 `plan.md:227`：起名的段落也是在下定义，要加锚点（批次 3）；`plan.md:244`：术语指向写了名字的那一段（批次 5）。
  - 改法：把 `:41` 最后两句（「反过来不对：$x^2-y^2$……正像马鞍。」）拆成单独一段，前面加 `::anchor{id="def-saddle-point"}`，术语表「鞍点」的锚点改成它。
  - 第 7 题（`problems.yaml:116`–`:130`）：提示 3（`:126`）说 $x^2+y^3$ 的原点「既不是极大也不是极小」，参考解答（`:128`）说「不是极值点」，却把 $x^2-y^4$ 的原点叫作鞍点。按 `:41` 和术语表简介的定义（不是局部极值点的驻点），$x^2+y^3$ 的原点也是鞍点。建议两处写成：不是极值点，所以也是鞍点；和 $x^2-y^4$ 不同，它沿哪条直线看都不是极大（沿 $y$ 轴单调地穿过 $0$）。这正好说明鞍点不一定是「一个方向极大、一个方向极小」。
- **重要 2：黑塞矩阵定义式里的求导次序，和展开的矩阵、和 `partial-derivatives` 的记号对不上（`taylor-multivariable:32`、术语表）**
  - `partial-derivatives:32` 约定 $f_{xy}=(f_x)_y=\frac{\partial^2f}{\partial y\,\partial x}$、$f_{yx}=(f_y)_x=\frac{\partial^2f}{\partial x\,\partial y}$；`:34` 专门说了「分式记号里的次序从右往左读」。
  - `taylor-multivariable:32` 定义「第 $i$ 行第 $j$ 列是 $\frac{\partial^2f}{\partial x_i\,\partial x_j}(\vb a)$」，按上面的约定，第 1 行第 2 列是 $\frac{\partial^2f}{\partial x\,\partial y}=f_{yx}$；同一段展开的却是 $\begin{pmatrix}f_{xx}&f_{xy}\\f_{yx}&f_{yy}\end{pmatrix}$。术语表「黑塞矩阵」的简介（`_domain.yaml:211`）也写的是 $\frac{\partial^2f}{\partial x_i\,\partial x_j}$。
  - 两个混合偏导数相等时没有差别。可这一段的定义只要求二阶偏导数存在，常见误区 `:104` 又专门引了 $f_{xy}=-1$、$f_{yx}=1$ 的函数：这时第 1 行第 2 列按定义式是 $1$，按展开式是 $-1$。
  - 改法：`:32` 和简介写成「第 $i$ 行第 $j$ 列是先对 $x_i$、再对 $x_j$ 求的二阶偏导数 $f_{x_ix_j}=\frac{\partial^2f}{\partial x_j\,\partial x_i}$」。展开式、第 1 题，以及 `:27`、`:46` 的求和都不用动（求和对 $i$、$j$ 对称）。
- **小问题 1：写法规范，3 节 3 处**
  - 倍数：`gradient:94`「否则结果大了 $5$ 倍」是 `plan.md:269` 不让写的说法（照字面是 $6$ 倍）。改成「否则结果是正确值的 $5$ 倍」。
  - 括注（`plan.md:242`）：
    - `legendre-transform:16`「热学里由内能得到自由能」是「自由能」在这一节第一次出现，括注 free energy 却在 `:27`。挪到 `:16`。
    - `multivariable-chain-rule` 第 6 题题干（`problems.yaml:90`）「叫作 $k$ 次齐次函数」起了名，没括注；英文只在参考解答的定理名里出现。改成「齐次函数（homogeneous function）」。
- **小问题 2：`taylor-multivariable` 第 4 题选项 B 是讲解判过的那一族**
  - 选项 B $x^2+4xy+y^2$（`problems.yaml:64`）就是动画里的 $x^2+bxy+y^2$ 取 $b=4$。动画的说明 `:79` 已经给了判据「$4-b^2<0$ 是鞍点」；常见误区 `:102` 判过 $b=3$；滑块步长 $0.5$，能直接拖到 $b=4$，看到 $\theta=135^\circ$ 的截线开口向下。
  - 方案 `plan.md:227`：选项不照搬判过的例子，图和动画不画出中等题要算的东西（都是批次 4）。不属于批次 5 的例外：套进判据就行，不用多想一步。
  - 建议换成族外、仍是鞍点的 $x^2+4xy+3y^2$（$H=\begin{pmatrix}2&4\\4&6\end{pmatrix}$，$12-16<0$），答案 A、C、E 不变。提示 2、3 和解答跟着改，我的验算脚本复核时按新选项改。
- **小问题 3：图里的标签压线，3 张图**（脚本查的是文字框里有没有落进线条的采样点，再导出放大看过）
  - `paraboloid.svg:16` 的「$z=1$」：`:24` 那条绿色点线（$z=2$ 那一圈投影到底面的竖线，$x=98.85$）从「=」中间穿过，读起来像「$z\ne1$」。
  - `tangent-plane.svg:19` 的「$P$」：两条曲面网格线穿过竖笔。
  - `gradient.svg:19` 的「(1, 1)」：$c=4$ 的椭圆从「1, 1)」中间穿过。
  - 改法：挪开几个像素（「$z=1$」挪到点线左边，「$P$」往上，「(1, 1)」往右下），或者给文字加一圈和背景同色的描边。
- **原有问题：变分法 `second-variation:24` 的「二次项」差一个 2 倍**（是这一批把它显出来的）
  - 原文：「被积函数的二阶导数正是多元泰勒公式（Taylor's formula）里的二次项，即 $F$ 对 $(y,p)$ 的黑塞矩阵作用在 $(\eta,\eta')$ 上」，下面的式子 $\Phi''(0)=\int_a^b(F_{yy}\eta^2+2F_{yy'}\eta\eta'+F_{y'y'}\eta'^2)\dd x$ 是对的。
  - 这一批 `taylor-multivariable:34` 把二次项定成 $\frac12\sum_{i,j}H_{ij}h_ih_j$；第 8 题参考解答（`problems.yaml:144`）写的是「正是二阶泰勒公式里二次项的两倍」。两节一起读，一个说「正是」，一个说「两倍」。
  - 改法：「……正是多元泰勒公式里二次项的两倍，即……」。这一轮改不改，见「需要你决定的」2。

**现实背景**：两条都核过，说法对。
- `functions-of-several-variables` 第 7 题：竖直的崖壁上，不同高度的等高线在地图上叠成一条；向外伸出的悬崖处会交叉，被遮住的一段常画成虚线。这是制图教材的通常说法，例如 [USF ETC 的地形图说明](https://etc.usf.edu/clipart/keyword/topographic-map)、[GISGeography](https://gisgeography.com/contour-lines-topographic-map/)。
- `legendre-transform` 第 7 题「实验里温度比熵容易控制」：温度、体积容易测量和控制，熵不能直接测，所以改用以 $T$ 为自变量的亥姆霍兹自由能。见 [Rochester PHY418 讲义](https://www.pas.rochester.edu/~stte/phy418S21/units/unit_1-5.pdf)、[Wikipedia: Thermodynamic potential](https://en.wikipedia.org/wiki/Thermodynamic_potential)。

## 改了没报的

- `_domain.yaml` 加了宏 `\dv`。定义和电磁学、常微分方程、变分法的一字不差，9 节里用到的有 70 多行，构建的宏一致性检查通过。没有问题，只是交接里没提。
- 其余改动都和交接一致：9 节的正文和题目、7 张 SVG、22 个术语、4 处前置、`change-of-variables` 去掉 `linear-algebra.determinant`。9 节的标题和 `goal` 都没动。

## 要修的，按小节分

- `functions-of-several-variables`：`paraboloid.svg:16`（小 3）。
- `multivariable-limits`：无。
- `partial-derivatives`：无。
- `differentiability`：`tangent-plane.svg:19`（小 3）。
- `multivariable-chain-rule`：第 6 题题干括注（小 1）。
- `gradient`：`:94`（小 1）；`gradient.svg:19`（小 3）。
- `jacobian`：无。
- `taylor-multivariable`：`:41` 拆段加锚点，第 7 题提示 3 和参考解答（重 1）；`:32`（重 2）；第 4 题选项 B（小 2）。
- `legendre-transform`：`:16` 括注（小 1）。
- `_domain.yaml`：「鞍点」的锚点（重 1）；「黑塞矩阵」的简介（重 2）。
- 别的领域：`second-variation:24`（原有问题）；补标清单外的 4 处（「需要你决定的」1）。

## 怎么审的

- **读题和验算**：
  - 简单题、中等题用 `npm run statements -- <9 节> --tier easy,medium` 读题，独立写了 9 个验算脚本 `tools/verify/math.vector-calculus.<小节>.ts`，逐个跑，36 道全部一致。
  - 共用的 `tools/verify/math.vector-calculus._vc.ts` 只放通用工具：中心差分求导数、偏导数、二阶偏导数、梯度、黑塞矩阵、雅可比矩阵，黄金分割法求极值，二分法，在圆上取点，二阶行列式。
  - 验算不用要验的那条结论：
    - 极限题在半径 $10^{-3}$、$10^{-5}$ 的圆上各取 3600 个点，看离极限值最远有多远，不用夹逼；
    - 链式法则的题先把复合函数整个代出来，再对它数值求导；隐函数用二分法逐点解出 $y(x)$ 再差分；
    - 方向导数按定义沿直线差分，不用「梯度点乘方向」；最大变化率在各个方向上搜出来；
    - 等值线、等值面的半径和圆心用二分法在几个方向上解出来，再在另外 20～30 个方向上核对；
    - `taylor-multivariable` 第 4 题不用黑塞矩阵判别，在半径 $10^{-2}$、$10^{-3}$ 的圆上看函数值是不是都比原点大；
    - 勒让德变换不解 $f'(x)=p$，用 $f^*(p)=\max_x\bigl(px-f(x)\bigr)$ 黄金分割求最大值，再核对最大值点处 $f'=p$。
  - 再跑全量 `npm run verify`：201 节全部一致，退出码 0。`npx tsc -b` 退出码 0；`npm test` 23 个文件、202 条全过；`npm run content` 0 个错误、0 个警告。
  - 验算完才打开 `problems.yaml` 读难题、思考题和全部提示、解答。
- **术语**：
  - 脚本查 9 节每一块里术语第一次单独出现有没有标记，别名加了「二元函数」「三元函数」「一阶偏导数」「二阶泰勒公式」，同时数了每段句数。报出的 3 处都对：两处「一元函数的链式法则」说的是一元的链式法则（`math.calculus.chain-rule` 在链上，按规矩 C 不标）；`functions-of-several-variables:23` 是「多元函数」自己的定义段，别名「二元函数」不标（批次 12 的规矩）。没有超过 4 句的段。
  - 另一个脚本按页面上的先后（正文，再按题号的题干、选项、提示、解答）查名词每节第一次出现有没有括注英文，不查参考解答。名词表是术语表的中文名加上手列的近百个词；链接文字逐条人工分「见某节」和「当名词用」。找到的就是小问题 1 的两处；「图像」「切线」「定义域」「反函数」这类中学词不算。
  - 规矩 C 两个方向都扫了：别的领域术语表的词在这 9 节出现的地方，和这 22 个新术语在别的领域正文里链外出现的地方（见「台阶 1 问的几处」）。
  - 按 f05d9a9 的查法查了拼词：213 个标记，前后一到四个字拼不出别的术语；人工看了前后是实义字的几处，也没有。
- **链接和前置**：脚本列出这一批的全部 `lesson:` 链接和别的小节指向这一批的链接，目标、锚点都存在；查了带标记的术语，定义它的小节在不在链上；前置没有多余的。链外的标记 7 处都允许：5 处是规矩 C 的跨领域标记（线性化、正定、拉格朗日量、哈密顿量、广义速度），2 处是本领域不在链上的词提前提到（`gradient:48` 的「驻点」、`jacobian:32` 的「梯度」），推理没用到它们，`plan.md:964`（批次 7）允许。
- **引文**：「例 N」「第 N 题」「上一节」「下一节」「讲解里」逐个对过，指的都是真正说这件事的地方。
- **页面**：网站构建到 scratchpad（`vite build --outDir`），另起一个临时服务，进度写临时仓库，没动仓库的 `dist/`。按 768 像素宽看了 9 节：
  - 每节先把提示全部点开（各 24 次）、简单题和中等题点「放弃」看解答（各 4 道），再数公式报错、量页面宽度：都是 0 处报错、没有横向滚动。
  - 量了 7 张 SVG 的文字：离边最近 5.4 像素（`tangents.svg` 顶上的 $y$），最宽的一行占画布宽度的 85%（`tangent-plane.svg` 底下的说明，没超过 85%），文字之间不重叠；压线的就是小问题 3。7 张图都导出成 PNG 看过（暗色）。
  - 动画改滑块、进度条让组件重画，导出画布看：`partial-derivatives` $b=0.5$、$-1$、$2$；`gradient` $k=2$、$0.25$、$4$，另外换掉 `requestAnimationFrame` 推了 240 帧；`jacobian` 进度 100%，$(a,b)=(1,0.5)$、$(1.5,1.5)$、$(0,0)$；`taylor-multivariable` $(b,\theta)=(3,45^\circ)$、$(3,135^\circ)$、$(4,45^\circ)$。

## 各节

只记有内容的地方；上面已经报过的不重复。

- **`functions-of-several-variables`**：
  - 例 1、例 2，第 1 到 8 题核过。
  - SVG：在导出的图上量过，左图四个截圆的半轴按 $1:\sqrt2:\sqrt3:2$ 变化、高度等距，右图四个圆的半径也是这个比例。
  - 第 7 题的悬崖说法见「现实背景」。
- **`multivariable-limits`**：
  - 例 1（夹逼）、例 2（$\frac{x^2y}{x^4+y^2}$ 沿直线都是 $0$、沿 $y=x^2$ 是 $\frac12$）核过。`:49` 用到「有界闭区域上的连续函数有最值」，说了「这里不证」、链接一元那一节，符合 `sketch` 和 `plan.md:964`。
  - SVG：左图等值线上的值 $\frac12\sin2\theta$（斜率 $2$、$\frac12$ 的直线上是 $\frac25$），右图 $\frac k{1+k^2}$（$y=kx^2$），都核过。
  - 第 2 题选项 C $\frac{2xy}{x^2+2y^2}$ 和讲解的 $\frac{xy}{x^2+y^2}$ 同一类，但系数不同，要重新沿直线算一遍，属于批次 5 的例外。
- **`partial-derivatives`**：
  - 施瓦茨定理 `:39` 写了条件（两个混合偏导数在附近存在、在这一点连续），证明思路用了两次中值定理，对；下游 `exact-equations:32`、`lagrange-equations:45` 要的正是这一条。
  - 动画：截线 $\frac{x^2}2-bx$、$x=1$ 处切线斜率 $1-b$，$b=-1$ 时右端 $7.5$ 在范围（上限 $8$）里。
  - 第 6 题 $f_{xy}(0,0)=-1$、$f_{yx}(0,0)=1$；第 7 题（固定哪个变量，偏导数就不同）、第 8 题（沿各方向的变化率 $\cos^2\alpha\sin\alpha$）对。
- **`differentiability`**：
  - 例 1（$\dd V=0.2\pi\approx0.63$）、例 2 核过。`:16`「上一节第 8 题」指 `partial-derivatives` 第 8 题，对。
  - SVG：$P(1,0.5,2.375)$、切平面 $z=2.375-(x-1)-0.5(y-0.5)$ 核过。
  - 第 5 题（$\frac{x^2y}{x^2+y^2}$ 在原点不可微）、第 6 题（偏导数不连续、却可微）、第 7、8 题对。
- **`multivariable-chain-rule`**：
  - `:27` 隐函数的求导公式 $y'=-\frac{F_x}{F_y}$，存在性留到 `inverse-implicit`，对。例 1、例 2（$f_x^2+f_y^2=z_r^2+\frac{z_\theta^2}{r^2}$）核过。
  - SVG 两张依赖关系图的路径、箭头标注和下面的两个公式一致。
  - 第 5 题（极坐标下的 $z_{\theta\theta}$ 和拉普拉斯算子）、第 6 题（欧拉齐次函数定理，$f=x^3-2xy^2$ 验证）、第 7、8 题（特征线）对。
- **`gradient`**：
  - 定理的证明思路对；`:37` 写了 $\dd f=\nabla f\cdot\dd\vb r$，电磁学 `electric-potential:58` 要的就是它。
  - SVG：四个椭圆的半轴 $\sqrt c$、$\sqrt{c/2}$，六个箭头的起点都在 $c=2$ 的椭圆上（$x^2+2y^2$ 算出来 $1.96$～$2.0$），$(1,1)$ 在 $c=3$ 上，都核过。
  - 动画画的是 $-\nabla f$；$k=2$ 推 240 帧，粒子贴着 $x$ 轴进原点，和说明「先沿等值线密的方向迅速下降」一致。
  - 第 5 题（最陡上升路线 $y=x^2$）到第 8 题对。
- **`jacobian`**：
  - 局部线性近似的证明、矩阵形式的链式法则对。`:39` 的「线性化」按规矩 C 标成常微分方程的 id，对。
  - SVG：$\vb F(1,0.5)=(0.75,1)$，$J=\begin{pmatrix}2&-1\\1&2\end{pmatrix}$，转角 $\arctan\frac12\approx26.6^\circ$，放大 $\sqrt5\approx2.24$，都核过。
  - 动画：默认结束时右上角显示 $\det=5$；$a=b=1.5$ 时角点 $(0,6)$ 在 $\pm6.5$ 的范围里。说明 `:77` 的「插值途中……图形一路都是正方形」有一个特例：$b=0$、$a<0$ 时，途中 $s=\frac1{1-2a}$ 那一刻矩阵为零，正方形缩成一点再翻过去。不算错，想更准可以补半句。
  - `:48`「上一节依赖关系图」：依赖关系图在 `multivariable-chain-rule`，它正是这一节在本领域唯一的直接前置，说「上一节」可以。
  - 第 5 题（极坐标的逆）、第 6 题（阻尼摆两个平衡点的行列式 $1$、$-1$）、第 7 题、第 8 题（柯西-黎曼方程）对。
- **`taylor-multivariable`**：
  - 二阶泰勒公式的证明思路（对 $\varphi$、$\varphi'$ 各用一次中值定理，$r=\varphi''(\theta)\theta_1$）对。例 1（$1.085$ 对 $1.0831$）、例 2（$3h^2+h^3+k^2$、$-3h^2+h^3$）核过。
  - 动画：$b=3$ 时 $\theta=45^\circ$ 是 $2.5t^2$、$135^\circ$ 是 $-0.5t^2$，和说明一致。
  - `:50`「正定的矩阵总有这样的 $m$（见二次型与正定矩阵）」：那一节没直接写这条，但 `quadratic-forms:51` 的 $\vb x\T A\vb x=\sum\lambda_iy_i^2$ 加上 `:39` 的「正交变换不改变长度」，取最小的特征值作 $m$ 就是一步，指得过去。
  - 第 5 题（$q(m)$ 的较小正根就是最小特征值，不超过 $a$）、第 6 题、第 8 题对；第 8 题「两倍」的说法对，变分法那边要跟着改，见原有问题。
- **`legendre-transform`**：
  - 导数定理用夹逼证，不假定 $x(p)$ 可导，对；对合性、多变量（只换一部分变量）对。
  - SVG：三个截距 $p-p\ln p$：$0.85$、$1$、$0.61$，切点 $(\ln p,p)$，都核过。
  - 第 5 题（杨氏不等式，$b=\frac a{a-1}$）、第 6 题（$(f^*)''=\frac1{f''}$，$e^x$ 验证）、第 7 题（差一个负号的写法变两次得 $f(-s)$，换回符号就是 $f$）、第 8 题（双势阱的凸包络，$-1<x<1$ 时是 $-\frac14$）对。

## 台阶 1 问的几处

- **和别的领域同名的术语**：都分得开，不用改。
  - 「连续」：简介写的是「说多元函数 $f$ 在 $(a,b)$ 处连续」，明说是多元的。数学分析进表的是「连续函数」，不是「连续」。
  - 「链式法则」：简介的式子是 $\dv{}{t}f\bigl(x(t),y(t)\bigr)=f_x\dv xt+f_y\dv yt$，一看就是多元的；浮窗下面还写「在《多元复合函数的链式法则》中定义」（`TermRef.tsx` 显示定义所在的小节标题）。数学分析那条是 $(f\circ g)'(a)=f'(g(a))g'(a)$，出处是《可导性与链式法则的证明》。
  - 「鞍点」：这边是「不是局部极值点的驻点」，例子是 $x^2-y^2$ 的原点；常微分方程那条是「两个特征值异号的平衡点」。说的不是一回事，简介分得清。
- **前置改的四处**：都合理，也都是最少的（脚本查过 9 节没有多余的前置）。
  - `jacobian` 把 `linear-maps` 换成 `determinant`：`:87` 的面积比例、第 4 题、动画的 $\det$ 都要行列式；`linear-maps` 经 `determinant` 仍在链上，`:39` 链到它没问题。
  - `change-of-variables` 去掉 `determinant`：经 `jacobian` 在链上。
  - `partial-derivatives` 加 `math.calculus.chain-rule`：例 1 用了一元的链式法则，原来的两个前置推不出它。
  - `legendre-transform` 把 `partial-derivatives` 换成 `multivariable-chain-rule`：「多个变量」那一段用多元链式法则推 $\pdv{f^*}{p_i}=x_i$；`partial-derivatives` 经它在链上。
- **「鞍点」进表、「驻点」挪到 `taylor-multivariable`**：同意。两个词都在那一节起名、用得最多，下游（`extrema`、`small-oscillations`、`quadratic-forms`）也都指那一节。`gradient:48` 提前提到「驻点」，标记加括注，推理不用它，`plan.md:964` 允许。锚点的问题见重要 1。
- **以这一批为直接前置的已写小节**：都接住了。
  - 常微分方程 `exact-equations:22` ↔ `multivariable-chain-rule:27`（$F_x+F_yy'$）；`:32` ↔ `partial-derivatives:39`（混合偏导数连续时相等）。
  - 常微分方程 `nonlinear-systems:22`–`:25` ↔ `jacobian` 的局部线性近似（`thm-local-linear`）；它写「分量有连续的偏导数」，经 `differentiability` 的充分条件推出可微，在链上。
  - 常微分方程 `lyapunov-stability:31`、`:36` ↔ `gradient:37`（沿曲线的变化率 $\nabla f\cdot\vb r'$）和梯度定理（垂直于等值线、指向增大的一侧）。
  - 常微分方程 `numerical-methods` 第 6 题：下标写法在 `partial-derivatives:32`，$y''=f_x+f_yf$ 是 `multivariable-chain-rule:27` 的特殊情形，一阶近似在 `differentiability`；题目文字用链外结论、加了链接，符合 `plan.md:964`。
  - 变分法 `functionals:56`、`euler-lagrange:22`–`:37`：三个变量的函数对第二、第三个变量的偏导数、多元链式法则，都有；`euler-lagrange` 第 8 题的「一阶变化只由速度决定」就是 `gradient:37`。
  - 变分法 `second-variation:24`、分析力学 `small-oscillations:26`、`:111`：二阶泰勒展开、黑塞矩阵、正定时严格极小（`taylor-multivariable:27`、`:46`、`:50`）。`second-variation:24` 的 2 倍见原有问题。
  - 分析力学 `virtual-work`（$\delta\vb r_i=\sum_j\pdv{\vb r_i}{q_j}\delta q_j$、一阶改变）↔ `differentiability`；`lagrange-equations:45` ↔ 施瓦茨定理；`hamiltons-equations:33`–`:37` ↔ `legendre-transform`：只换 $\dot q$、$q$ 和 $t$ 当参数（「多个变量」那一段），变两次回来（对合性），$L$ 对 $\dot q$ 是一次时做不了（`:27` 的边界情况）。
  - 数学分析 `parameter-integrals:35`、`:52` ↔ `multivariable-limits` 的连续、`partial-derivatives` 的偏导数。
  - 前向链接：数学分析 `differentiability` 第 7 题 ↔ `differentiability` 用线性近似定义可微；常微分方程 `what-is-ode` 第 2 题 ↔ `partial-derivatives`；电磁学 `electric-potential:58` ↔ `gradient:37`。
- **以这一批为前置、还没写的 11 节**：看了 `goal`，打的底够用。
  - `extrema`（驻点、二阶判别法、鞍点）← `taylor-multivariable:50` 已经说了「完整的判别留到」它；`inverse-implicit` ← `multivariable-chain-rule:27`、`gradient:44` 留的两处；`change-of-variables` ← `jacobian:87` 的面积比例和动画的 $\det$；`lagrange-multipliers` ← 梯度垂直于等值线；`vector-fields` ← 梯度场动画。
  - 偏微分方程 `pde-basics`、振动与波 `wave-equation` ← `partial-derivatives` 的记号和例 1 的一元链式法则；`transport-equation` ← `multivariable-chain-rule` 第 7、8 题的特征线；复分析 `holomorphic` ← `jacobian` 第 8 题的柯西-黎曼方程；热学 `thermodynamic-potentials` ← `legendre-transform:27` 和第 7 题（差一个负号的写法、$F=U-TS$）。
- **跨领域补标**：
  - 台阶 1 列的 5 处我的反向扫描都扫到了，都是链外、没标、意思相同，该补：`what-is-ode:27`「偏导数」，`existence-uniqueness:63`、`first-order-systems:39`「向量值函数」，`quadratic-forms:46`「多元函数」「驻点」，`euler-lagrange:64`「驻点」。
  - 清单外还有 4 处，也是链外、没标、意思相同（多元函数的驻点、函数的鞍点）：
    - 分析力学 `virtual-work:76`「平衡位置就是 $V(q_1,\dots,q_n)$ 的驻点」；
    - 分析力学 `phase-space-liouville:31`「它们是 $H$ 的驻点」（$H_p=H_q=0$）；
    - 电磁学 `poisson-equation:65`「原点是一个鞍点（saddle point）」（电势沿 $x$ 轴最低、沿 $z$ 轴最高），`:91` 常见误区「却是鞍点」在另一块，也要标。
  - 可标可不标的 2 处：`virtual-work:123` 说的是一元的 $V(\theta)$ 的驻点；分析力学 `hamiltonian-chaos:113`「穿过鞍点的分界线」既是平均后那个函数的鞍点，也是相图里的平衡点。
  - 不标的：相图里平衡点类型的「鞍点」（常微分方程各节，分析力学 `energy-function:92`、`euler-equations:103`、`phase-space-liouville:34` 起名的那一组）是常微分方程的词，不是这一个；一元意义的「连续」「链式法则」是一元的词。
- **动画和图**：参数、范围都对，说明和画面一致；`jacobian` 结束时显示 $\det=5$。答案泄露只有小问题 2 那一处。`jacobian` 动画取 $(a,b)=(0,0.5)$ 时的矩阵 $\begin{pmatrix}0&-1\\1&0\end{pmatrix}$ 碰巧就是第 4 题的雅可比矩阵，但要先自己算出它，才知道去拖到这一点，不算泄露。
- **现实背景**：见「结论」。

## _domain.yaml

- 术语从 0 条加到 22 条；加了宏 `\dv`（见「改了没报的」）。
- 22 条的定义小节、锚点都存在；除了「鞍点」（重要 1），锚点段里都有术语名。共用锚点的：二阶偏导数、混合偏导数同在 `def-second-partials`；驻点、鞍点同在 `def-stationary-point`（按重要 1 拆开）。
- 简介都在 60 字以内（构建查过），内容和讲解一致。细看过的：
  - 「混合偏导数」的「在一点附近存在并在这一点连续时相等」和 `partial-derivatives:39` 的条件一致；
  - 「方向导数」写了「可微时等于 $\nabla f\cdot\vb u$」，条件没漏；
  - 「勒让德变换」写了「严格凸」；
  - 「黑塞矩阵」见重要 2。
- 和数学分析、常微分方程同名的三条见「台阶 1 问的几处」。

## 我替你定的

1. **「放大了约 $2.24$ 倍」不算违反倍数的规矩**：`jacobian:52`（图注）、`local-linear.svg:77`、`jacobian:77`「边长放大……倍，面积放大……倍」说的是线性变换的缩放倍数，已审的线性代数 `determinant:16`「面积放大了多少倍」、分析力学 `canonical-transformations` 第 2 题「把面积放大了 $4$ 倍」都这么写。`plan.md:269` 管的是比较两个量的「比……大 N 倍」，所以只报了 `gradient:94`。能撤回：要一起改的话，写成「放大到原来的 $2.24$ 倍」。
2. **没列成问题的几处**：
   - `jacobian:48`「上一节依赖关系图」：依赖关系图所在的 `multivariable-chain-rule` 是它在本领域唯一的直接前置（方案的顺序里中间隔着 `gradient`）。
   - `taylor-multivariable:50`「见二次型与正定矩阵」：那一节没明写，但一步就推得出，见「各节」。
   - `jacobian:32` 的「梯度」：`gradient` 不在 `jacobian` 的链上，可只是「为什么这样定义」里顺带一提，推理不用它，按 `plan.md:964` 处理。
   - 「链式法则」的简介不加「多元」两个字，理由见「台阶 1 问的几处」。
3. **「熵」「内能」当基础词**：`legendre-transform` 第 7 题题干里没括注，可以；`:16` 的「内能」同样。
4. **别的领域说二元函数「连续」的地方不补标**：例如常微分方程 `existence-uniqueness:22`「$f$ 在区域上连续」。按 `plan.md:964`，`sketch` 的小节把二元函数的连续性当一元的直接推广，链接一元那一节、不列多变量微积分；这一批进表的「连续」不追着补。
5. **小问题的分法**：倍数和括注都是写法规范，合成一条；选项、标签压线各一条。

## 要写回 plan.md 的

- 术语规范「别名按它所指术语的 id 标」那附近补一句：同名术语按意思选 id。「鞍点」说的是函数的驻点不是极值点时，标 `math.vector-calculus.saddle-point`；说的是相图里平衡点的类型时，标 `math.ode.saddle-point`（批次 13 审查时提的）。补标扫描也要扫物理各领域，这一批清单外的 4 处都在分析力学、电磁学。
- 多变量微积分那一段的记号约定加一条：$f_{xy}=(f_x)_y=\frac{\partial^2f}{\partial y\,\partial x}$；黑塞矩阵第 $i$ 行第 $j$ 列是 $f_{x_ix_j}$（先对 $x_i$ 再对 $x_j$），讲到混合偏导数不等的例子时和这个次序一致（批次 13 审查时提的）。
- 可选，倍数那一条补一句：表示缩放倍数的「放大了 N 倍」照已有的先例可以用，比较两个量时只写「是……的 N 倍」。

## 需要你决定的

按「撤不回」排序；两件都能撤回。

1. **清单外的 4 处跨领域补标，这一轮要不要一起补**
   - 可选：一起补（4 处，`virtual-work:76`、`phase-space-liouville:31`、`poisson-equation:65`、`:91`，可标可不标的 2 处随你）；或者只补台阶 1 列的 5 处，这 4 处等以后。
   - 推荐一起补：规矩 C 的条件都满足，改的只是标记，复核时一起看。
   - 代价：已经 `reviewed` 的 `virtual-work`、`phase-space-liouville`（分析力学）、`poisson-equation`（电磁学）要退回 `written` 随这一批复核。
   - 能撤回。
2. **变分法 `second-variation:24` 的「二次项」这一轮要不要改**
   - 可选：这一轮改成「二次项的两倍」；或者先记着，下次动那一节时再改。
   - 推荐这一轮改：只改几个字，而这一批的第 8 题已经写了「两倍」，读者两节对着看会发现说法不一样。
   - 代价：`second-variation` 退回 `written` 随这一批复核。
   - 能撤回。

## 没验证的地方

- **帧率和手感**：动画实际的帧率和拖动滑块的手感，要在 Chrome 里看。
- **主题**：7 张 SVG 和 4 个动画只看了暗色。SVG 用的都是主题变量（`--accent`、`--good` 等）。
- **宽度**：只用 768 像素宽模拟，没看手机宽度和 iPad 真机。`differentiability`、`taylor-multivariable` 各有一条较长的行内公式（约 600 像素），768 像素下放得下。
- **台阶 1 列的 5 处补标**：初审只核了该不该补，改动复核时看。
- **电磁学**：全量构建、全量验算这次都过了，全量验算里也包括电磁学批次 13 的 9 个脚本；那边的内容由另一个审查会话负责，我没看。

## 修订说明（写内容会话）

2026-11-12。重要 2 条、小问题 3 条、原有问题 1 条都改了，台阶 1 列的 5 处跨领域补标也补了；没有不改的条目。行号是修订后的。

### 重要 1：「鞍点」的锚点和第 7 题

- 改了：
  - `taylor-multivariable` 原来的 `:41` 拆成两段，起名的那段「反过来不对：……正像马鞍。」前面加了 `::anchor{id="def-saddle-point"}`（`:43`–`:44`）。
  - 术语表「鞍点」的锚点改成 `def-saddle-point`（`_domain.yaml:177`）。
  - 第 7 题提示 3（`problems.yaml:126`）：$x^2+y^3$ 的原点「不是极值点，所以也是鞍点；和 $x^2-y^4$ 不同，它沿哪条直线看都不是极大」。
  - 第 7 题参考解答拆成两段，`:130` 写明：
    - 沿 $y$ 轴单调地穿过 $0$；
    - 沿别的方向 $(\cos\alpha,\sin\alpha)$ 是 $t^2\cos^2\alpha+t^3\sin^3\alpha$，$t^2$ 那一项占上风，是极小；
    - 所以鞍点不一定「沿一个方向极大、沿另一个方向极小」。
- 同类找全：
  - 脚本列出 9 节「讲解」里起名的段落（叫作、也叫、称为、这就是……）共 21 处，前面都有锚点。
  - 22 条术语的锚点段里都有术语名。
  - 别处说「鞍点」「不是极值点」的地方都和定义一致：`taylor-multivariable:50`、`:79`、例 2、常见误区 `:101`、`:103`，第 4、6 题，`multivariable-chain-rule` 第 8 题。

### 重要 2：黑塞矩阵的求导次序

- 改了：
  - `taylor-multivariable:32` 改成「第 $i$ 行第 $j$ 列是先对 $x_i$、再对 $x_j$ 求的二阶偏导数 $f_{x_ix_j}(\vb a)=\frac{\partial^2f}{\partial x_j\,\partial x_i}(\vb a)$」。
  - 术语表简介（`_domain.yaml:211`）同样改。
- 同类找全：9 节和术语表里分式记号的二阶偏导数共 9 处。
  - `partial-derivatives:32`、`:34`、`:93` 是约定本身，`_domain.yaml:85` 是 $f_{xx}$。
  - `taylor-multivariable:27` 的求和对 $i$、$j$ 对称，照报告没动。
  - 第 1 题按行填 $f_{xx}$、$f_{xy}$、$f_{yx}$、$f_{yy}$，和新的定义一致。

### 小问题 1：写法

- 改了：
  - `gradient:94` 改成「否则结果是正确值的 $5$ 倍」。
  - `legendre-transform:16` 的「自由能」补括注 free energy，`:27` 的括注去掉。
  - `multivariable-chain-rule` 第 6 题题干（`problems.yaml:90`）拆成两句：「……$f(tx,ty)=t^kf(x,y)$。这样的 $f$ 叫作 $k$ 次齐次函数（homogeneous function）。」
- 同类找全：
  - 「倍」：9 节和 7 张图共 7 处。其余是 `jacobian` 的缩放倍数（:52、:77、`local-linear.svg`、第 8 题，按报告「我替你定的」1 不改），或「是……的两倍」（`taylor-multivariable` 第 8 题）。
  - 括注：脚本按页面顺序查「括注写在了后面一次出现上」的词。报出的都是标题、更长的词的子串，或只起「见某节」作用的链接文字，没有新的。
  - 题目文字里起名的 5 处都有括注：齐次函数、欧拉齐次函数定理、特征线、杨氏不等式、柯西-黎曼方程。

### 小问题 2：`taylor-multivariable` 第 4 题选项 B

- 改了：
  - 选项 B 换成 $x^2+4xy+3y^2$（`problems.yaml:64`），提示 2 改成「$2\cdot6-4^2=-4<0$」。
  - 答案 A、C、E 不变，验算脚本按新选项核过。
- 同类找全：这一批的选择题还有两道。
  - `functions-of-several-variables` 第 2 题：选项和讲解、例题、图都无关。
  - `multivariable-limits` 第 2 题：报告已判为批次 5 的例外。

### 小问题 3：标签压线

- 改了：改生成脚本，再生成。
  - `paraboloid.svg` 的「$z=1$」左移 20 像素，让开 $z=2$ 那一圈投影的竖线。
  - `tangent-plane.svg` 的「$P$」上移 7 像素。
  - `gradient.svg` 的「(1, 1)」挪到点的右上方、$c=4$ 的椭圆外面。
- 同类找全：
  - 方法：脚本把 7 张图内联进一个页面，用无头 Edge 沿每条带描边的线每 0.5 像素取点，看落没落进文字框（文字框上下各缩 18%）。
  - 改前报 4 处，比报告多 1 处：`paraboloid.svg` 的「$z=3$」右端碰到一条经线，一起左移了 6 像素。
  - 改后 0 处，文字之间不重叠。离边最近 4.4 像素，是 `tangents.svg` 顶上的 $y$，没动。
  - 三处改动都放大导出看过（亮色）。

### 原有问题：变分法 `second-variation:24`

- 改成「被积函数的二阶导数正是多元泰勒公式（Taylor's formula）里二次项的两倍，即……」。
- `status` 退回 `written`。

### 跨领域补标

- 台阶 1 列的 5 处，按规矩 C 标多变量微积分的 id，每处都是所在块里第一次出现：
  - `what-is-ode:27`「偏导数」；
  - `existence-uniqueness:63`「向量值函数」：是这一节第一次出现，补了括注 vector-valued function；
  - `first-order-systems:39`「向量值函数」；
  - `quadratic-forms:46`「多元函数」「驻点」；
  - `euler-lagrange:64`「驻点」。
- 这 5 节的 `status` 都退回 `written`。
- 清单外的 4 处照台阶 1 的决定不补：
  - `virtual-work`、`phase-space-liouville` 是批次 1、2 写的，不追溯；
  - `poisson-equation` 由电磁学那边补。

### 报告标了「可选」的

- `jacobian:77` 补了一句：「$b=0$、$a<0$ 时，途中有一刻矩阵为零，正方形先缩成一点，再朝相反方向张开。」
- 「放大了约 $2.24$ 倍」照报告「我替你定的」1 不改。

### 改了的文件

- `content/math/vector-calculus/`：
  - `_domain.yaml`；
  - `taylor-multivariable/lesson.md`、`taylor-multivariable/problems.yaml`；
  - `gradient/lesson.md`、`legendre-transform/lesson.md`、`multivariable-chain-rule/problems.yaml`、`jacobian/lesson.md`；
  - `functions-of-several-variables/paraboloid.svg`、`differentiability/tangent-plane.svg`、`gradient/gradient.svg`。
- 别的领域 6 节，各改一处，加上 `status`：
  - `math/calculus-of-variations/second-variation`、`euler-lagrange`；
  - `math/ode/what-is-ode`、`existence-uniqueness`、`first-order-systems`；
  - `math/linear-algebra/quadratic-forms`。

### 检查

- `npm run content`：0 个错误、0 个警告。
- `npm test`：23 个文件、202 条全过。
- `npm run verify`：退出码 0，201 个小节全部一致；`taylor-multivariable` 第 4 题仍是 1、3、5。
- 自查脚本：
  - 术语：只剩 `functions-of-several-variables:23` 定义段里的别名「二元函数」，按规矩不标；
  - 没有超过 4 句的段落；
  - 拼词检查没有问题；
  - 数值验算 159 项一致。新加了 3 项：第 4 题新选项 B 的判别式 $-4$；$x^2+y^3$ 沿任何过原点的直线都不是极大；它在原点附近有小于 $0$ 的值。
- 页面：网站构建到 scratchpad，768 像素宽，看了下面这些页面，都没有公式报错，也没有横向滚动。
  - `taylor-multivariable`：
    - 新的「鞍点」定义卡片单独成段；
    - 「鞍点」浮窗链到 `#def-saddle-point`；
    - 第 4 题显示新选项和新提示。
  - `existence-uniqueness`、`quadratic-forms`：补的标记能弹出浮窗，`quadratic-forms` 的「驻点」注明「第 10 层才讲」。
  - `second-variation`：显示正常。
  - 临时服务、启动配置、联接都已拆掉。

## 复核

审内容 agent · 2026-11-12。和初审快照 `b13-snapshot/` 比，旧课用 `git diff HEAD` 看。

### 结论

通过，没有要再改的。

- 重要 2 条、小问题 3 条、原有问题 1 条都改对了，同类也找全了。
- 修订说明和实际改动一致，没有改了没提的。
- 15 节的 `status` 已改成 `reviewed`（只改了这一行）：这一批 9 节，加上随这一批改过的 6 节旧课。
- 清单外 4 处补标，台阶 1 的决定对。`plan.md:246` 写明跨领域补标只管批次 4 以后写的小节，`virtual-work`、`phase-space-liouville` 是批次 1、2 写的；这一条我初审漏看了，那两处不该推荐补。`poisson-equation` 归电磁学的审查复核。

### 逐条

- **重要 1（「鞍点」）**：
  - `taylor-multivariable:41` 拆成两段，起名那段 `:44` 前面加了 `::anchor{id="def-saddle-point"}`（`:43`）；术语表的锚点改了（`_domain.yaml:177`）。
  - 构建出的数据里「鞍点」指向 `taylor-multivariable#def-saddle-point`。页面上新卡片标着「鞍点」，驻点的卡片只剩驻点。
  - 第 7 题提示 3（`problems.yaml:126`）、参考解答（`:128`–`:130`）都说 $x^2+y^3$ 的原点是鞍点。沿 $(\cos\alpha,\sin\alpha)$ 是 $t^2\cos^2\alpha+t^3\sin^3\alpha$：$\cos\alpha\ne0$ 时 $t^2$ 占上风，是极小；沿 $y$ 轴单调。核过，对。
  - 同类：脚本查了讲解里起名的段落（叫作、叫做、也叫、称为、这就是、统称、简称）共 20 处，前面都有锚点（写内容会话数的是 21 处，触发词不完全一样）；22 条术语的锚点段里都有术语名。
- **重要 2（黑塞矩阵的求导次序）**：
  - `:32` 和简介（`_domain.yaml:211`）改成「先对 $x_i$、再对 $x_j$ 求的二阶偏导数 $f_{x_ix_j}=\frac{\partial^2f}{\partial x_j\,\partial x_i}$」。和 `partial-derivatives:32` 的约定、展开式、第 1 题都一致。
  - 常见误区 `:104` 那个例子，第 1 行第 2 列现在只有一个答案：$f_{xy}=-1$。
- **小问题 1（写法）**：
  - `gradient:94`、`legendre-transform:16`（`:27` 的括注去掉了）、`multivariable-chain-rule` 第 6 题题干（拆成两句，起名的那句带括注）都改了。
  - 括注脚本重跑：这两条消失，没有新的；其余报出的还是中学词和只起「见某节」作用的链接文字，和初审一样。
- **小问题 2（第 4 题选项 B）**：
  - 换成 $x^2+4xy+3y^2$，提示 2 改成 $2\cdot6-4^2=-4<0$；提示 3、解答的「B 是鞍点」照样成立。
  - 验算脚本按 `npm run statements` 的新题面改了选项 B，仍算出 A、C、E。
- **小问题 3（标签压线）**：
  - 改动：`paraboloid.svg:16`「$z=1$」左移 20、`:20`「$z=3$」左移 6；`tangent-plane.svg:19`「$P$」上移 7；`gradient.svg:19`「(1, 1)」挪到 $(300,84)$。
  - 重跑压线检查，三处都没有了。三张图都导出放大看过（暗色），字和线分开了。
  - 「$z=2$」的文字框里仍有 3 个采样点，初审就有、没报：放大看，是「2」的右端挨着 $z=2$ 那一圈的左端，没有压字。
- **原有问题**：`second-variation:24` 改成「二次项的两倍」，下面的式子没动，对。
- **可选的那一句**：`jacobian:77` 补的「$b=0$、$a<0$ 时……先缩成一点，再朝相反方向张开」对（$s=\frac1{1-2a}$ 时矩阵为零）；这一段仍是 4 句。
- **5 处跨领域补标**：
  - 都用多变量微积分的 id，每处都是所在块里、也是全节第一次出现。
  - `existence-uniqueness:63` 补的括注 vector-valued function 在全节第一次出现的地方。
  - 6 节旧课各只改了这一处（`second-variation` 是原有问题那一处），加 `status`。

### 怎么核的

- **比改动**：`diff -rq` 快照和现在的 `content/math/vector-calculus/`，改了 10 个文件，和修订说明列的一样，逐个看了 diff；旧课 6 节用 `git diff HEAD`，各 2 行（正文一处、`status`）。工作区里这两个领域以外，只有这 6 节、用户的 `progress/lessons.yaml`、两份报告和 `.claude/`。
- **脚本重跑**：
  - 术语标记、括注、链接和锚点、带标记术语的前置链、拼词、起名段落的锚点，结果见上；
  - 9 个验算脚本 36 道全部一致。
- **全量**：`npm run content` 0 个错误、0 个警告（改状态前后各跑一次）；`npx tsc -b` 退出码 0；`npm test` 23 个文件、202 条全过；`npm run verify` 201 节全部一致，退出码 0。
- **页面**：网站重新构建到 scratchpad、起临时服务，768 像素宽看了：
  - `taylor-multivariable`：新的定义卡片；
  - 三张改过的图所在的 3 节：导出放大看；
  - 6 节旧课：0 处公式报错、没有横向滚动；`what-is-ode` 的「偏导数」显示成术语，`second-variation` 是新的说法。

### 要写回 plan.md 的

- 初审提的第 1 条（同名术语按意思选 id）照旧。
- 第 2 半句「补标扫描要扫物理各领域」收回：台阶 1 的扫描本来就扫全站，排除的是批次 4 以前写的小节，按 `plan.md:246` 写清楚扫描范围就行。
- 初审的第 2 条台阶 1 这次没提，请一起写回：多变量微积分的记号约定，$f_{xy}=(f_x)_y=\frac{\partial^2f}{\partial y\,\partial x}$，黑塞矩阵第 $i$ 行第 $j$ 列是 $f_{x_ix_j}$。
- 可选的那条（倍数）照旧，由你定。

### 剩下的

- 无要改的。
- 没验证的：
  - 三张改过的图只看了暗色（写内容会话看了亮色）；
  - 动画帧率、手感和真机，同初审。

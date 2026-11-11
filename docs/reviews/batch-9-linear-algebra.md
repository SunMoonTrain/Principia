# 批次 9 审查报告：线性代数（向量、矩阵与方程组）

审内容 agent（和写内容 agent 是两个独立会话，没有读它的会话记录、交接说明和自查脚本）· 2026-11-11

审查范围：`math.linear-algebra` 的 9 节：`vectors`、`dot-product`、`linear-systems`、`cross-product`、`matrices`、`solution-sets`、`linear-maps`、`lines-planes`、`matrix-inverse`。包括它们的文件头、`problems.yaml`、7 张 SVG、5 个动画（2 个 `linear-map-2d`、3 个 `function-plot`）的参数，以及 `_domain.yaml` 新增的 45 个术语和宏 `\uv`。另外按台阶 1 的要求，看了别的领域里以这一批为前置或链接到这一批的 5 节。

初审前按「每批的流程」第 4 条，把整个 `content/math/linear-algebra/` 和 `git diff HEAD -- content/math/linear-algebra/` 拷了一份快照到我的 scratchpad（`b9-snapshot/`），复核时和它比。写报告前又比了一次，内容没有变。

## 结论

没有重要问题；小问题 2 条，原有问题 1 条。

- **小问题 1：`lines-planes` 第 7 题借了 `solution-sets` 的「自由变量」和「解集是 $\vb p+t\vb v$ 的形式」，没有链接**
  - `lines-planes` 的链是 `cross-product`、`dot-product`、`vectors`，没有 `linear-systems`，也没有 `solution-sets`。
  - 题干（`problems.yaml:104`）链接了[线性方程组与高斯消元]。它接得住提示里的「线性方程组」「解集」「行阶梯形」「主元」：这几个词都在 `linear-systems` 定义（`linear-systems:23` 的 `def-linear-system`、`:51` 的 `def-echelon`）。这一部分正是批次 2 那条规矩说的情形。
  - 接不住的两样：
    - 「自由变量（free variable）」：第 1 条提示（`problems.yaml:109`）、第 3 条提示（`:113`）、参考解答（`:115`）都用了。它定义在 `solution-sets:23`（`def-free-variable`；术语表 `_domain.yaml:313` 的 `definedIn` 也是 `solution-sets`），`linear-systems` 全文没有这个词。
    - 「解集是 $\vb p+t\vb v$ 的形式」（`problems.yaml:113`、`:115`）：这是 `solution-sets` 的通解和「解集的结构」（`solution-sets:46`）讲的。
  - 最少的改法，二选一：
    - 在第 1 条提示的「自由变量」处加[解集的结构](lesson:math.linear-algebra.solution-sets)的链接，第 3 条提示的 $\vb p+t\vb v$ 也出自那里；
    - 或者不用这个词：`linear-systems:70`（解的三种情况的证明思路）已经说了「没有主元的列对应的未知数……可以任意取值」。第 3 条提示可以改成「第三列没有主元，那个未知数可以任意取值，记作 $t$，回代解出另外两个，得到的正是 $\vb p+t\vb v$」，链接 `linear-systems#thm-three-cases`。第 1 条提示、参考解答照此改说法。
- **小问题 2：`solution-sets` 的动画，$t$ 拖到 $-3$ 时上面那个点只剩半个**
  - 横轴范围是 $[-8,8]$（`:57`），点 $\vb p+t(-2,1)$ 的横坐标是 $2-2t$（`:67`），滑块最小是 $-3$（`:71`）。这时点在 $(8,-2)$，正好压在右边框上，导出画面看只画出半个。
  - 附录「FunctionPlot」第 4 条（`plan.md:1080`）：滑块拖到两端时，要读者看的点仍要出现在画面里。
  - 改法：滑块最小改成 $-2.5$；或者横轴放到 $[-9,9]$、纵轴按比例放到 $[-5.4,5.4]$。另外两个点（$\vb p$ 和齐次解 $t(-2,1)$）在两端都在画面里。
- **原有问题 1：变分法 `direct-methods` 用了链上没有的对称矩阵、矩阵乘向量、点积和可逆**
  - `direct-methods` 在线性代数里只以 `linear-systems` 为前置（`lesson.md:7`），链上只有 `linear-systems`、`vectors`。
  - `lesson.md:55`「$A$是对称的」：对称矩阵定义在 `matrix-inverse` 的 `def-transpose`（`matrix-inverse:61`）。
  - 第 6 题（`problems.yaml:97`–`:111`）：
    - 题干说矩阵「对称」，方程组写成 $A\mathbf c=\mathbf b$；
    - 第 1 条提示用 $\mathbf c\cdot A\mathbf c>0$；
    - 第 3 条提示和参考解答说「$A$ 可逆」。
    - $A\mathbf c$ 在 `matrices`，点积在 `dot-product`，可逆在 `matrix-inverse`，都不在链上，也都没有链接。
  - 这一节写的时候 `linear-systems` 还是大纲，不是这一批引入的，所以报成「原有问题」。
  - 最少的改法：
    - `:55` 和题干的「对称」括注 $A_{ij}=A_{ji}$，不用链接。
    - 题干的 $A\mathbf c=\mathbf b$ 写成正文 `lesson.md:52` 那样的 $\sum_jA_{ij}c_j=b_i$，或者链接[矩阵与矩阵乘法](lesson:math.linear-algebra.matrices)。
    - 第 1 条提示的 $\mathbf c\cdot A\mathbf c$ 写成参考解答里已经展开的 $\sum_{i,j}c_iA_{ij}c_j$，或者链接[点积、长度与夹角](lesson:math.linear-algebra.dot-product)。
    - 「$A$ 可逆，方程组有唯一解」改成「齐次方程组只有零解，由[方程个数等于未知数个数时](lesson:math.linear-algebra.linear-systems#thm-square)的定理，方程组有唯一解」，就用不到「可逆」。这条定理在链上。
  - 改到这一节要按「每批的流程」第 6 条退回 `written`。
- **别的都对**：
  - 讲解和例题的推导、数值都核过，除了上面几处，没有发现问题。
  - 36 道简单题、中等题的标准答案，全部和独立验算一致。
  - 18 道难题的参考解答逐题核过，都对。
  - 18 道思考题问题清楚，参考解答站得住；`lines-planes` 第 7 题只缺小问题 1 那个链接。
  - 现实背景和史实都对：《九章算术》第八章第一题的数和答案、按列相消；Grcar 2011；费曼讲义第一卷第 20、52 章；Trefethen 和 Bau 第 21 讲（见「台阶 1 和写内容会话问的几处」）。
- **结构、证明深度都符合方案**：
  - `npm run build` 和 `npm run content` 都是 0 个错误、0 个警告，没有「多余前置」。
  - 每节 7 个必选部分加常见误区都在，各有 2 道例题，都先写「为什么想到这么做」。
  - 领域的 `proofPolicy` 是 `sketch`。略去的两处证明都写了「可以证明（这里不证）」：`linear-systems:63`（简化行阶梯形唯一）、`cross-product:44`（一般的 $\vb u\times\vb v$ 也符合右手定则）。
- **批次 4 到 8 的规矩**：
  - 题目文字每段不超过 4 句（脚本数过）。
  - 60 个锚点段都是一整段：定义式、结论和起名的句子都在卡片里，段末是句号，后面不紧跟行间公式（脚本查过）。
  - 768 像素宽、提示和解答全部展开时，9 节都不左右滚动，2685 个公式 0 处报错。
  - 简单题、中等题没有照搬讲解、例题里用同一组数算过的量，选择题的选项也没有照搬判过的例子（逐题和例题、讲解里的数对过）。
- **几何图像**：7 张 SVG、5 个动画，没有占位框。
  - **SVG**：7 张图的文字都量过 `getBBox`，都在画布里，离边不少于 3%，互不重叠、不压线；导出图片逐张看过，和图下的说明对得上。
  - **动画**：两个 `linear-map-2d` 和 `solution-sets` 的动画在页面上定到不同进度、拖到两端导出画面看过，另外两个按式子算了滑块每一格取值下点的位置。手机宽度看了 `linear-maps` 的动画。除了小问题 2，画面范围都和滑块配套，说明和画面对得上。

| 小节 | 简单、中等题验算 | 难题 | 思考题 | 涉及的条目 |
| --- | --- | --- | --- | --- |
| `vectors` 向量与线性运算 | 4 道一致 | 2 道都对 | 2 道清楚 | 无 |
| `dot-product` 点积、长度与夹角 | 4 道一致 | 2 道都对 | 2 道清楚 | 无（`:65` 一处措辞，可选） |
| `linear-systems` 线性方程组与高斯消元 | 4 道一致 | 2 道都对 | 2 道清楚 | 无 |
| `cross-product` 叉积 | 4 道一致 | 2 道都对 | 2 道清楚 | 无 |
| `matrices` 矩阵与矩阵乘法 | 4 道一致 | 2 道都对 | 2 道清楚 | 无 |
| `solution-sets` 解集的结构 | 4 道一致 | 2 道都对 | 2 道清楚 | 小 2（动画） |
| `linear-maps` 线性变换及其矩阵 | 4 道一致 | 2 道都对 | 2 道清楚 | 无 |
| `lines-planes` 空间中的直线与平面 | 4 道一致 | 2 道都对 | p7 缺一个链接，p8 清楚 | 小 1 |
| `matrix-inverse` 逆矩阵与转置 | 4 道一致 | 2 道都对 | 2 道清楚 | 无 |
| `_domain.yaml` 新增 45 条、宏 `\uv` | | | | 无 |
| 合计 | 36 道 | 18 道 | 18 道 | 小问题 2 |
| 变分法 `direct-methods`（不在这一批） | | | | 原有 1 |

要修的按小节分：

- `lines-planes`：第 7 题第 1、3 条提示（`problems.yaml:109`、`:113`）加 `solution-sets` 的链接或改说法（小 1）。
- `solution-sets`：动画的滑块最小值 `:71` 或画面范围 `:57`（小 2）。
- `direct-methods`（原有 1）：`lesson.md:55`，第 6 题的题干和提示。

## 怎么审的

- **读题和验算**：
  - 简单题、中等题用 `npm run statements -- <9 节> --tier easy,medium` 读题，独立写了 9 个验算脚本 `tools/verify/math.linear-algebra.<小节>.ts`，逐个跑，36 道全部一致。
  - 再跑全量 `npm run verify`：130 节全部一致；`tsc -b` 通过（验算脚本也在类型检查的范围里）。
  - 共用的通用函数写在新文件 `tools/verify/math.linear-algebra._la.ts`：向量运算、按定义的分量公式求叉积、矩阵乘法、转置、化简化行阶梯形、解方程组、用 $(A\mid I)$ 消元求逆、消元求行列式、黄金分割法求最小值、伪随机数。不含任何一道题的答案。
  - 验算不用要验的那条结论：
    - 夹角用两个向量各自的方向角相减，不用余弦公式；
    - 分解成平行、垂直两部分，对系数求 $|\vb u-c\vb v|^2$ 的最小值，不用投影公式；
    - 点到平面、点到直线的距离，在平面、直线的参数表示上直接求最近点，不用距离公式；
    - 逆矩阵用 $(A\mid I)$ 消元，不用二阶公式；不可逆的参数找行列式的零点，核对只有一个；
    - 叉积按列维-奇维塔符号逐项求和；平行四边形面积只用点积和长度；同时与两个向量正交的单位向量解齐次方程组求，不用叉积；体积用消元算行列式；
    - `solution-sets` 第 4 题（多选）随机造了 200 个有这两个解的方程组，逐个选项代进去判断。
  - 验算完才打开 `problems.yaml` 读难题、思考题和全部提示、解答。
- **现实背景**：查了三处出处。
  - Grcar, *How ordinary elimination became Gaussian elimination*, Historia Mathematica 38(2) (2011) 163–218。
    - 《九章算术》第八章（方程章）第一题：上禾 3、中禾 2、下禾 1 共 39 斗，2、3、1 共 34 斗，1、2、3 共 26 斗；答案 $9\frac14$、$4\frac14$、$2\frac34$，代回三个方程都对。
    - 书中每个方程占一列，列与列之间相消。
  - 费曼《物理学讲义》第一卷：第 20 章「空间中的转动」讲力矩是矢量、用叉积写转动方程；第 52 章「物理定律的对称性」第 5 节「极矢量和轴矢量」讲力矩、角动量、磁场在镜面反射下是轴矢量。
  - Trefethen、Bau, *Numerical Linear Algebra*：第 20 讲是高斯消元，第 21 讲是「Pivoting」（选主元），选列中绝对值最大的数当主元、乘数不超过 1，正在第 21 讲。
- **术语**：
  - 用脚本查了每节每一块里术语第一次出现有没有标记、每段句数。
  - 用另一个脚本查了 9 节里名词第一次出现有没有括注英文。
  - 脚本报出的再逐条人工看：都是长词的一部分（平行四边形、非零向量、简化行阶梯形、齐次线性方程组、非齐次线性方程组）、链接文字或基础词，不算。
- **前置**：按整张图（656 节）算层级，查了多余的前置、每节链上有哪些小节，以及以这一批为前置的下游小节。9 节都没有多余前置，层级 0 到 3。
- **页面**：`npm run build` 后用 test-serve 在 768 像素宽看了 9 节，进度写的是临时仓库。
  - 每节先把提示全部点开、简单题和中等题点「放弃」看解答，再量页面宽度、数公式报错。
  - 面板隐藏，照批次 8 的办法：改「进度」条或滑块的值让组件重画，把画布、SVG 导出成 PNG 看。
  - `linear-maps`：默认矩阵放完；$a=d=0$、$b=-1$、$c=1$（转 $90^\circ$）放到一半和放完；四个数都是 $1.5$；$a=-1.5$、其余 $1.5$。
  - `matrix-inverse`：进度 1、1.5、2。
  - `solution-sets`：$t=-3$、$3$。
  - 手机宽度（375）看了 `linear-maps` 的动画。

## 各节

只记有内容的地方；上面已经报过的不重复。

- **`vectors`**：
  - 列向量的约定交代得清楚：`:51` 写成一列、行文写成 $(v_1,v_2)$；`:53` 说明为什么写成一列，链接到以后的 `matrices`；`:63` 推广到 $\R^n$。
  - 动画：$\vb u=(3,1)$、$\vb v=(1,2)$，$a$、$b$ 在 $[-1.5,1.5]$ 里，$a\vb u+b\vb v$ 最远到 $(\pm6,\pm4.5)$，在画面 $[-8,8]\times[-4.8,4.8]$ 里；两条过 $a\vb u+b\vb v$ 的平行线和说明一致。
- **`dot-product`**：
  - `:27`「恒力做的功就是 $\vb F\cdot\vb d$」对。
  - `:65` 正好接住数学分析 `fourier-series:30`。
  - 可选：`:65`「规定零向量和任何向量都正交」。按 `:63` 的定义，$\vb 0\cdot\vb v=0$，零向量本来就和任何向量正交，不是另加的规定。可以改成「按这个定义，零向量和任何向量都正交」。
- **`linear-systems`**：
  - 例 1（`:118`）的谷子问题和 `:58` 的「一列一列地相消」和 Grcar 对得上。
  - 第 8 题三位有效数字的两种消元顺序核过：以 $0.0001$ 为主元得 $x=0$、$y=1$，先交换得 $x=y=1$，真解约是 $(1.0001,0.9999)$。
  - 动画：$m$ 在 $[-2,1]$、$c$ 在 $[1,3]$，每一格都算了交点。两端交点的横坐标是 $c-2$（$m=-2$）和 $\frac{2-c}{2}$（$m=1$），都在画面里。跑出画面的只有 $m=-1.5$、$-1.25$、$-0.75$、$-0.5$ 和部分 $c$，都挨着 $m=-1$，这正是 `:114` 说的「$m$ 越接近 $-1$，交点跑得越远」，不算问题。
- **`cross-product`**：
  - `:46` 的力矩 $\vb r\times\vb F$ 链接了以后的「力矩与角动量」；第 8 题（`problems.yaml:129`）的轴矢量出处对。
  - `:29` 的 `thm-cross-laws`、`:36` 的 `thm-cross-geometry` 接住了变分法 `holonomic-constraints:63`（$\mathbf r''$ 和 $\mathbf r$ 平行，叉积为零）。
- **`matrices`**：
  - 推理一律「对应相乘再相加」，点积只在 `:39` 作旁注、加链接。
  - `:34` 的 `thm-row-rule` 接住了常微分方程 `first-order-systems:41`。
- **`solution-sets`**：
  - 全文和题目都没有 $A\vb x$ 记号（搜过）。
  - `:52` 指向常微分方程 `linear-first-order#thm-linear-structure`，道理相同，对。
- **`linear-maps`**：动画都对。
  - 滑块默认就是图里的 $A=\begin{pmatrix}1.5&0.5\\0.5&1\end{pmatrix}$（`:69`），和 `:106` 说的一致；图例「$\vb e_1$ 的像」是第一列。
  - 四个数在 $[-1.5,1.5]$ 里，单位正方形的顶点最远到 $(\pm3,\pm3)$，在画面 $\pm3.5$ 里。
  - 转 $90^\circ$ 放到一半时，$\vb e_1$ 的像在 $(0.5,0.5)$，正方形缩小一半面积，放完是转过 $90^\circ$ 的正方形。`:108` 交代了「中间的矩阵不一定是同一种变换，比较开头和结尾就行」。
  - 四个数都是 $1.5$ 时整个平面压到直线 $y=x$ 上；行列式为负（$a=-1.5$、其余 $1.5$，行列式 $-4.5$）时正方形换了颜色。
- **`lines-planes`**：除小问题 1，都对。第 6 题异面直线的距离公式、第 5 题的勾股关系都核过。
- **`matrix-inverse`**：
  - 动画：进度 1 时单位正方形变成顶点 $(2,1)$、$(3,4)$、$(1,3)$ 的平行四边形，$\vb x$ 的像是 $(4,7)=\vb b$，和左图、`:91` 一致；进度 1.5 时是 $\frac12(A+I)$；进度 2 时回到原样。画面 $x\in[-2.5,6.5]$、$y\in[-1,8]$ 都装得下。
  - 组件的一个小现象（不是内容问题）：进度条正好拖到 1 时，标题已经显示「第 2 步（共 2 步）：再作用 $A^{-1}$」，画面是第 1 步的终点。`:91` 让读者「把进度条拖回第一步的终点」，看到的画面是对的。

## 台阶 1 和写内容会话问的几处

- **链上缺点积的三节（`matrices`、`linear-maps`、`matrix-inverse`）**：够。
  - 推理里只用「对应相乘再相加」；点积只作旁注，都加了链接：`matrices:39`、`matrix-inverse:61`、`matrix-inverse` 第 7 题的解答（`problems.yaml:113`）。`linear-maps` 没提点积。
- **`solution-sets` 不用 $A\vb x$**：够，全文和题目都没有。
- **`lines-planes` 第 7 题**：一半是批次 2 的情形。行阶梯形、主元、解集在 `linear-systems`，链接接得住；自由变量和 $\vb p+t\vb v$ 在 `solution-sets`，接不住，见小问题 1。
- **`linear-systems`**：
  - 「简化行阶梯形唯一」写成「这里不证」：妥当。`:63` 把结论和「这里不证」都写明了，它的证明比 `sketch` 深。后面 `solution-sets` 说自由变量有几个是确定的、`matrix-inverse` 说「简化行阶梯形是 $I$」，都可以靠这句结论。
  - 第 8 题的「第 21 讲」：对，第 21 讲就是选主元（Pivoting）。
- **`matrix-inverse`**：
  - `thm-one-sided` 借 `thm-square`：可以。`linear-systems` 在 `matrix-inverse` 的链上，`:30` 加了链接。
  - 第 6 题 (2) 用 `thm-three-cases`：可以。第 3 条提示（`problems.yaml:97`）把推理写全了：主元至多 $m$ 个、少于 $n$ 列，齐次方程组又不会出现 $0=b\ne0$ 的行，所以有无穷多个解。这正是 `linear-systems` 第 6 题的结论，想写得更短可以补半句「也就是[线性方程组与高斯消元]第 6 题」，可选。
  - 第 7 题的 $R_\theta$：可以。题干给出了矩阵、链接了 `linear-maps`（`:106`），解答只用矩阵乘法和 $\cos^2\theta+\sin^2\theta=1$。
- **写内容会话定的几件事**：都妥当。
  - **向量、矩阵不进术语表**：矩阵在批次 3 认定的基础词里；向量在 `vectors:24` 有定义卡片，和「解」一样只加锚点（批次 6）。
  - **列向量的约定**：见「各节」`vectors`。
  - **投影、标准基向量**：投影定义在 `dot-product:71`，标准基向量在 `vectors:81` 命名，用到它们的小节都在链上。
  - **`linear-systems` 放齐次方程组、方程个数等于未知数个数的定理、简化行阶梯形**（`:74`、`:79`、`:60`）：`matrices`、`solution-sets`、`matrix-inverse` 和变分法 `direct-methods` 都以它为前置，放在这里正好。
  - **奇异矩阵只括注英文，对称矩阵定义在 `def-transpose`**（`matrix-inverse:23`、`:61`）：妥当。
- **已写的小节指向这一批的地方**：
  - 数学分析 `fourier-series:30`：接住了，见 `dot-product:65`。
  - 变分法 `direct-methods` 第 6 题的唯一解：接住了，`thm-square`（`linear-systems:79`）、`def-homogeneous`（`:74`）都在。但对称、$A\mathbf c$、点积、可逆接不住，见原有问题 1。
  - 变分法 `holonomic-constraints`：接住了，见「各节」`cross-product`。
  - 常微分方程 `first-order-systems:41`：接住了，见「各节」`matrices`。
  - 狭义相对论 `lorentz-transformation:41`：接住了。逆矩阵在 `matrix-inverse:23`，「一边成立就够」在 `:33`，转置在 `:59`，单位矩阵在 `matrices:56`；第 7 题 (2)（`problems.yaml:115`）直接验证了 $\Lambda(\beta)\Lambda(-\beta)=I$。
- **动画**：见「各节」。手机宽度下 `linear-maps` 的画布缩到 $313\times297$，滑块、按钮都在 31 到 344 像素之间，没有被截断。
- **史实**：都对，见「怎么审的」。

## _domain.yaml

- 新增 45 条，宏加了 `\uv`。
- `\uv` 是 `\hat{\mathbf{#1}}`，和多变量微积分、分析力学、电磁学、牛顿力学四个领域一字不差（脚本比过）。
- 45 条的锚点都落在真正下定义的那一段，简介都在 60 字以内（构建查过），按读到定义那一节的读者写，内容都对。

## 我替你定的

- **`lines-planes` 第 7 题算小问题**：写内容会话以为链接 `linear-systems` 就接住了，可「自由变量」定义在 `solution-sets`，题目里又没有它的链接。
- **`solution-sets` 动画的半个点算小问题**：点还看得见，可附录要求两端要读者看的点在画面里，改一个数就行。
- **`direct-methods` 报成原有问题**：建议随这一批的修订一起改，改动很小；改了以后它退回 `written`，随批次 9 复核。不改也不影响这一批通过。
- **「平行」用在直线、平面上没标记，不报**：`linear-systems:72`、`:114`，`lines-planes:39`。术语表的「平行」说的是向量，按「同名不同义不标」（批次 3）算对。`lines-planes:83` 把「不平行的直线」标成向量的「平行」也不算错，直线平行就是方向向量平行。两种都说得通。
- **`dot-product:65` 的「规定」只列为可选**：意思没错，措辞可以更准。
- **手机宽度下页面左右滚动，不报**：`linear-maps` 在 375 像素宽时左右滚动 157 像素，来自 `:126` 很长的行内公式。按 `plan.md:268`，手机宽度不在目标里，不用在内容里逐个拆。动画本身在手机宽度下是好的。
- **新建了共用文件**：`tools/verify/math.linear-algebra._la.ts` 只有通用函数，9 个验算脚本都依赖它。提交这一批时要一起带上。

## 要写回 plan.md 的

1. **前置规范，批次 2 那条**（题目文字里用前置链外的结论，加链接注明出处）后面补半句：链接要指向这个词、这个结论真正定义的那一节，用术语表的 `definedIn` 核对；同一领域里相关的一节不一定接得住。批次 9 `lines-planes` 第 7 题的「自由变量」在 `solution-sets`，题目只链接了 `linear-systems`。

## 需要你决定的

无。

## 没验证的地方

- **帧率和手感**：动画实际的帧率和拖动滑块的手感，要在 Chrome 里看。
- **两个 `function-plot`**：`vectors`、`linear-systems` 的动画没在页面上导出，只按式子算了滑块每一格取值下点的位置、核对了说明。
- **主题**：动画和 SVG 只看了暗色。7 张 SVG 的颜色只用了 `--accent`、`--good`、`--muted`、`--warn` 四个主题变量，没有写死的颜色（搜过），亮色主题应当跟着变，但没导出看。
- **iPad**：没看真机，只用 768 像素宽模拟；手机宽度只看了 `linear-maps` 一个动画。
- **`matrix-inverse` 动画的标题**：只看了进度条正好在 1 时显示「第 2 步」。播放时停在第 1 步终点那一刻标题显示什么，没有推帧看。

## 修订说明（写内容会话）

2026-11-11。
- 小问题 2 条都改了。
- 原有问题按报告的最少改法改了。
- 可选的 `dot-product:65` 也改了。
- 同一类问题在 9 节里找了一遍，另外改了 3 处：`linear-maps` 2 处、`matrix-inverse` 1 处。
- 标准答案一个都没变，验算脚本不用动。

### 小问题 1：`lines-planes` 第 7 题

选了第二种改法，不再用「自由变量」。
- 第 2 条提示（`problems.yaml:109`，报告里说的「第 1 条提示」）改成：「化成行阶梯形（row echelon form）以后最多有几个主元（pivot）？没有主元的那一列对应的未知数怎样？」
- 第 3 条提示的第二段改成：
  - 两个平面不平行时，化成行阶梯形有两个主元，剩下一列没有主元；
  - 由[解的三种情况](lesson:math.linear-algebra.linear-systems#thm-three-cases)，那一列对应的未知数可以任意取值，记作 $t$；
  - 回代解出另外两个未知数，都是 $t$ 的一次式，所以解写成 $\vb p+t\vb v$ 的形式。
- 参考解答照此改。

改完以后：
- 这道题用到的线性方程组、解集、行阶梯形、主元都定义在 `linear-systems`，题干的链接接得住。
- $\vb p+t\vb v$ 由回代直接得出，不再借 `solution-sets` 的结论。

### 小问题 2：`solution-sets` 的动画

选了放大画面。
- `range` 改成 $x\in[-9,9]$、$y\in[-5.4,5.4]$，纵横比仍是 0.6；滑块保持 $[-3,3]$。
- 滑块取每一格时，三个点离边框都至少 1 个单位（768 像素宽时约 38 像素）。
- 两端 $t=-3$、$3$ 都导出画面看过，三个点都完整。

同一类问题查了另外 4 个动画，都不改：
- `vectors`：点离边框最近 0.3 个单位，约 12 像素；点的半径是 4.5 像素，整个点在画面里。
- `linear-systems`：照报告说的，两端在画面里；靠近 $m=-1$ 时交点跑出画面，正是讲解要说明的现象。
- 两个 `linear-map-2d`：离边框最近 0.5 个单位。

### 原有问题 1：变分法 `direct-methods`

按报告的最少改法改：
- `lesson.md:55`：「$A$是对称的」括注 $A_{ij}=A_{ji}$。
- 第 6 题题干：
  - 「对称」括注 $A_{ij}=A_{ji}$；
  - 方程组写成 $\sum_jA_{ij}c_j=b_i$（$i=1,\dots,N$）。
- 第 1、2 条提示和参考解答：$\mathbf c\cdot A\mathbf c$ 都写成 $\sum_{i,j}c_iA_{ij}c_j$。
- 第 3 条提示和参考解答不再说「可逆」：
  - 先说明齐次方程组只有零解（方程两边乘 $c_i$ 再求和）；
  - 再由[方程个数等于未知数个数时](lesson:math.linear-algebra.linear-systems#thm-square)的定理得到唯一解；
  - 第 3 条提示里第一次出现的「齐次线性方程组」括注了英文。

其他：
- 记号沿用这一节自己的 `\mathbf`。
- `status` 从 `reviewed` 退回 `written`。
- 没动第 8 题的参考解答：
  - 那里说的「对称、正定的方程组」，指的是第 6 题刚证明的性质，第 6 题的题干和提示都写了这两个词的意思；
  - 参考解答不在页面上显示。

### 同一类问题：用了别的小节定义的词，链接没指到定义那一节

查法：
- 用脚本按每节的前置链，列出 9 节正文和题目里所有链外的术语，按术语表的 `definedIn` 判断。
- 另外加了行列式、特征值、线性无关、二次型、谱定理等以后才讲、没进术语表的词。
- 逐条看它所在的段落或题目字段里，有没有指向定义那一节的链接。

除了小问题 1，又找到 3 处，都改了：
- `linear-maps` 第 6 题：
  - 提示和参考解答里的「单位向量」定义在 `dot-product`，不在链上，也没有链接。改成直接写向量 $(\cos\theta,\sin\theta)$，再说反射后「长短不变」。
  - 第 3 条提示原来是「两面镜子的夹角（angle）是 $\alpha-\beta$」，改成「从第二面镜子（和 $x$ 轴成角 $\beta$）转到第一面（成角 $\alpha$）要转过 $\alpha-\beta$」。这里是有方向的角，可以是负数，本来就不是 `dot-product` 定义的夹角。
  - 第 8 题题干的「和 $x$ 轴正方向的夹角加倍」改成「所成的角加倍」，理由同上。
- `linear-maps` 常见误区最后一条：
  - 问题：标了术语「投影」，可它定义在 `dot-product`，不在链上，也没有链接。
  - 改法：补了一句例子并链接定义，「例如把每个向量换成它在 $x$ 轴方向上的投影（见[点积、长度与夹角](lesson:math.linear-algebra.dot-product#def-projection)），也就是 $(x,y)\mapsto(x,0)$，单位正方形变成从原点到 $(1,0)$ 的线段」。
- `matrix-inverse:61`：
  - 原文「以后讲二次型（quadratic form）、谱定理（spectral theorem）时常常遇到」只括注了英文，没有链接。
  - 改成链接[二次型与正定矩阵](lesson:math.linear-algebra.quadratic-forms)、[实对称矩阵的谱定理](lesson:math.linear-algebra.spectral-theorem)。

看过、不改的：
- `vectors` 用了「长度」（定义在 `dot-product`）：说的是箭头的长度，前面说过在这里回标，报告同意了。
- `vectors` 的「相似三角形」不是线性代数的「相似」。
- 其余链外的词分两类，都有链接：
  - 前向的「以后在[……]里会讲」，链接指向定义那一节：`vector-spaces`、`gram-schmidt`、`determinant`、`linear-independence`、`column-null-space`、`orthogonal-matrices`；
  - 旁注：`matrices`、`matrix-inverse` 正文里的点积，`matrix-inverse` 第 7 题的单位向量、旋转矩阵。

### 可选的两处

- `dot-product:65`：改成「按这个定义，零向量和任何向量都正交（$\vb 0\cdot\vb v=0$），以后说『和每个向量都正交』时不用另提例外」。
- `matrix-inverse` 第 6 题 (2) 补半句「也就是[线性方程组与高斯消元]第 6 题」：没加。提示已经链接了 `thm-three-cases`，推理也写全了，再加一个指向同一节的链接显得重复。

### 复核时可以看的

- `npm run content`：0 个错误、0 个警告。
- `npm test`：23 个文件、200 条全过。
- 自查脚本：
  - 术语标记、英文括注没有问题；
  - 每段不超过 4 句；
  - 卡片检查只剩 `solution-sets:35` 的「记作 $L(\vb x)$」，只是记号，不是起名。
- 页面：构建到临时目录，768 像素宽，提示全部展开，看了 6 页：`lines-planes`、`linear-maps`、`matrix-inverse`、`dot-product`、`solution-sets` 和变分法 `direct-methods`。
  - 都不左右滚动，公式 0 处报错；
  - 新加的 4 个链接都指对了地方。
- 改动的文件：
  - `content/math/linear-algebra/`：
    - `lines-planes/problems.yaml`（第 7 题）
    - `solution-sets/lesson.md`（动画的画面范围）
    - `linear-maps/lesson.md`（常见误区）、`linear-maps/problems.yaml`（第 6、8 题）
    - `matrix-inverse/lesson.md`（`:61`）
    - `dot-product/lesson.md`（`:65`）
  - `content/math/calculus-of-variations/direct-methods/`：
    - `lesson.md`（`status`、`:55`）
    - `problems.yaml`（第 6 题）

## 复核

审内容 agent · 2026-11-11

### 结论

- **复核通过，没有新问题**：线性代数 9 节和变分法 `direct-methods` 的 `status` 都改成了 `reviewed`（只改第 11 行）。
- **点名的问题**：小问题 2 条、原有问题 1 条都改对了，可选的 `dot-product:65` 也改对了。
- **同类的 3 处和「两面镜子的夹角」**：逐条核过，都对。这 4 处初审都漏看了。
- **改了没报的：没有**。
  - 和初审的快照（scratchpad 里的 `b9-snapshot/`）逐文件比过：`linear-algebra` 改了 6 个文件，每一处都在修订说明里。
  - `direct-methods` 和 HEAD 比，改的 2 个文件也都在修订说明里。
- **初审报告写错的一处**：`lines-planes` 的 `problems.yaml:109` 是第 2 条提示，初审写成了「第 1 条提示」，修订说明指出了。

### 怎么核的

- **改动范围**：和快照逐文件按词比（`git diff --no-index --word-diff`）；`direct-methods` 和 HEAD 比。
- **验算**：标准答案没变。9 个验算脚本逐个重跑，都一致；改完 `status` 后跑全量 `npm run verify`，130 节全部一致；`tsc -b` 通过。
- **脚本**：重跑了每块术语标记和每段句数、锚点段格式、第一次出现括注英文 3 个脚本，和初审的输出比。
  - 新报的 5 条都是链接文字：`linear-maps:133` 的「点积、长度与夹角」，`matrix-inverse:61` 的两个小节标题。按规矩不算。
  - 改动的段落和题目字段都不超过 4 句；`direct-methods` 改的几段不在脚本范围里，人工数过。
- **构建**：`npm run build` 0 个错误、0 个警告；改完 `status` 后 `npm run content` 再跑一次，仍是 0 和 0。
- **页面**（768 像素宽，进度写临时仓库，提示全部点开，简单题、中等题点「放弃」看解答）：
  - 改动的 6 页：`lines-planes`、`linear-maps`、`matrix-inverse`、`dot-product`、`solution-sets`、`direct-methods`。共 1708 个公式，0 处报错，都不左右滚动。
  - 新加的链接在页面上都指向对的小节和锚点：`linear-systems#thm-three-cases`、`dot-product#def-projection`、`quadratic-forms`、`spectral-theorem`、`linear-systems#thm-square`。
  - `solution-sets` 的动画在 $t=-3$、$3$ 导出画面看了，三个点都完整。
  - LinearMap2D 的修复（36bda00）也看了：`matrix-inverse` 的进度条在 $0.999$ 和 $1$ 时标题都是「第 1 步：先作用 $A$」，$1.001$ 才到第 2 步。进度 $1$ 的画面是 $A$ 拉出的平行四边形，$\vb x$ 的像是 $(4,7)$，标题和画面对得上。

### 逐条

- **小问题 1（`lines-planes` 第 7 题）**：改说法改得对，整道题不再借 `solution-sets`。
  - 第 2 条提示（`:109`）问「最多有几个主元、没有主元的那一列对应的未知数怎样」。行阶梯形、主元在这道题里第一次出现，括注了英文。
  - 第 3 条提示（`:113`）的推理是完整的：
    - 两个平面不平行，两行都有主元，不会出现 $0=b$ 的行；
    - 剩下一列没有主元，由 `thm-three-cases`（理由在它的证明思路 `linear-systems:70`），那个未知数可以任意取值；
    - 回代出的另外两个未知数是 $t$ 的一次式，所以解是 $\vb p+t\vb v$。没有主元的那个坐标就是 $t$ 本身，$\vb v$ 在那个位置是 $1$，不是零向量，确实是直线。
  - 这一段 4 句，正好到上限。
  - 参考解答（`:115`）照此改了。用到的线性方程组、解集、行阶梯形、主元都定义在 `linear-systems`，题干的链接接得住。
- **小问题 2（`solution-sets` 的动画）**：
  - 画面改成 $[-9,9]\times[-5.4,5.4]$（`:57`），纵横比仍是 0.6，滑块没动。
  - 按式子算了滑块每一格的三个点，离边框最近是 1 个单位，就是 $t=-3$ 时的 $(8,-2)$。
- **原有问题 1（变分法 `direct-methods`）**：按最少改法改了，都对。
  - `:55` 和第 6 题题干的「对称」都括注了 $A_{ij}=A_{ji}$；题干的方程组写成 $\sum_jA_{ij}c_j=b_i$，和正文 `:52` 一致。
  - 第 1、2 条提示和参考解答：$\sum_{i,j}c_iA_{ij}c_j=\int_0^1\bigl(p\,v'^2+q\,v^2\bigr)\dd x$，展开核过。
  - 第 3 条提示和参考解答：齐次方程组两边乘 $c_i$ 再求和，得 $\sum_{i,j}c_iA_{ij}c_j=0$，由正定只能 $\mathbf c=\mathbf 0$；再由 `thm-square` 的 (3) 推 (2)，得唯一解。这条定理在链上，「可逆」不再出现。
  - 「齐次线性方程组」在这一节第一次出现，括注了英文、没有标记，符合规矩 C（`linear-systems` 在链上，学过的不标记）。
  - 第 8 题参考解答的「对称、正定的方程组」没改，同意：说的就是第 6 题证明的性质，`:55` 和第 6 题都交代了意思。
- **可选的两处**：
  - `dot-product:65` 改成「按这个定义，零向量和任何向量都正交（$\vb 0\cdot\vb v=0$）」，对。
  - `matrix-inverse` 第 6 题 (2) 不补半句，同意：提示已经链接了 `thm-three-cases`，推理也写全了。
- **同类的 3 处**（初审漏看的）：
  - `linear-maps` 第 6 题（`problems.yaml:91`、`:95`、`:99`）：去掉了链外的「单位向量」，直接写 $(\cos\theta,\sin\theta)$，再说反射后「长短不变」。像 $\bigl(\cos(2\varphi-\theta),\sin(2\varphi-\theta)\bigr)$ 和 $\vb e_2$ 的像 $(\sin2\varphi,-\cos2\varphi)$ 都核过。
  - `linear-maps:133`：投影的例子对，在 $x$ 轴方向上的投影把 $(x,y)$ 变成 $(x,0)$，单位正方形变成从原点到 $(1,0)$ 的线段；链接到 `dot-product#def-projection`。这一条 3 句。
  - `matrix-inverse:61`：二次型、谱定理改成链接两个以后的小节。链接文字是小节标题，只起「见某节」的作用，不再括注英文是对的。
- **「两面镜子的夹角」**（`linear-maps` 第 6 题第 3 条提示 `:97`、第 8 题题干 `:120`）：改得对。
  - $F_\alpha F_\beta=R_{2(\alpha-\beta)}$ 里的 $\alpha-\beta$ 有方向、可以是负数，`dot-product` 定义的夹角却在 $[0,\pi]$ 里。四个元素的和角化简也重新核过。
  - 第 8 题改成「所成的角加倍」以后，变换 (a) 才说得清：按 $[0,\pi]$ 里的夹角，$x$ 轴上下对称的两个点夹角相同，加倍以后说不清落在哪一侧。

### 状态

- 10 节改成了 `reviewed`，只改第 11 行。改前的文件拷在 scratchpad 的 `before-status-b9/`，逐个比过，只差这一行。
  - 线性代数 9 节：`vectors`、`dot-product`、`linear-systems`、`cross-product`、`matrices`、`solution-sets`、`linear-maps`、`lines-planes`、`matrix-inverse`；
  - 变分法 `direct-methods`。

### 剩下的

- **一起提交的文件**：这一轮没改验算脚本。提交这一批时，初审新建的 10 个文件（9 个验算脚本和 `tools/verify/math.linear-algebra._la.ts`）要一起带上。
- **没验证**：
  - 动画的帧率和拖动手感，要在 Chrome 里看；
  - 这一轮只看了暗色主题、768 像素宽。

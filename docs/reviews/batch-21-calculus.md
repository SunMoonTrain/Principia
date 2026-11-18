# 批次 21 审查报告：单变量微积分（级数、δ 函数与参数曲线）

审内容 agent（和写内容 agent 是两个独立会话；它的汇报是审完以后才读的，只用来核对「改了没报的」）· 2026-11-18

审查范围：`math.calculus` 的 9 节：`series`、`comparison-tests`、`alternating-series`、`ratio-root-tests`、`power-series`、`taylor-series`、`power-series-calculus`、`dirac-delta`、`parametric-curves`，都是新写的。包括 72 道题、8 个 `function-plot` 动画、1 张 SVG（`cycloid-tangent.svg`），`_domain.yaml` 新进表 22 条（114 → 136 条）。写稿员按调度员的单子补标的别的领域 10 个文件和 `arc-length:32`，调度员说这一轮不看，复核时看。

开审前把整个 `content/` 拷了快照（scratchpad 的 `b21-snapshot/`），复核时和它比；写完报告时又比了一次，这 9 节和 `_domain.yaml` 审查期间没有变动。快照里的 `arc-length` 和别的领域那 10 个文件还是补标前的样子，复核时正好拿来比。

## 结论

重要 1 条，小问题 3 条，没有原有问题。

- 讲解、例题的推导和数都对。36 道简单题、中等题独立验算，全部和标准答案一致；36 道难题、思考题逐道读过，只有 `power-series` 第 6 题参考解答里一个反例不对（重要 1），其余参考解答都对，难度档合适。
- 前置：层级和开写前定的一致（`series` 3，`comparison-tests`、`dirac-delta` 10，`alternating-series`、`ratio-root-tests`、`parametric-curves` 11，`power-series` 12，`taylor-series` 13，`power-series-calculus` 14）。链外的标记都是旁白（数学分析的单调有界原理两处、重排、一致收敛），链外的链接都是预告（指向本领域后面的小节，或「这里不证，见数学分析」），推理里没有用到链外的东西。
  - 开写前担心的一处没有出现：`parametric-curves` 正文不讲参数曲线下的面积；第 5 题用微元法按 $\theta$ 取微元 $y\,\dd x=y(\theta)x'(\theta)\,\dd\theta$，和本节推弧长微元的做法一样，不用定积分换元。
- 篇幅：`minutes` 25–28；讲解加例题 624–1023 个汉字，和批次 20 相当。
- 页面：9 节在 768 像素宽下全部展开（每节点 32 下），`scrollWidth` 都等于 `clientWidth`，没有 KaTeX 报错，没有要横拖的地方，行间公式都在栏宽以内。SVG 的 12 个文字不出界、不重叠、不压线（文字之间、文字和线最近都是 4.5 像素），蓝、绿两色和说明一致。8 个动画逐个截图看过，颜色、图例和说明对得上，只有 `alternating-series` 横轴的字母说错了（小问题 3）。
- 下游都接得住：
  - 常微分方程 `existence-uniqueness:46`、`:56`，`matrix-exponential:25`（比较判别法、绝对收敛），`series-solutions:30`、`:85`、第 5、6 题（相邻非零项之比，`power-series:46` 和例 2），`laplace-transform` 第 8 题，`convolution-impulse:34`、`:99`。
  - 数学分析 `series-cauchy:57`、`:107`、`:135`（$|S-S_m|\le a_{m+1}$ 在 `alternating-series:30`），`limsup-liminf:124`（$a_n\le a_Nq^{n-N}$ 在 `ratio-root-tests:25`），`power-series-theory:16`、`:24`、`:34`、`:37`、`:43`、`:69`、`:71`、`:79`、`:106`、`:134`、`:137`。
  - 多变量微积分 `delta-3d:22` 和第 8 题（`dirac-delta:51`），`space-curves`（平面参数曲线、`parametric-curves:58` 弧长和参数无关、`:47` $(t^3,t^2)$ 的尖角）。
  - 变分法 `beltrami-identity`：`parametric-curves:43` 的 $\dv yx=\frac{y'}{x'}$，`:80` 的弧长微元 $2r\sin\frac\theta2\,\dd\theta$。
  - `taylor-remainder` 第 8 题「$\ln(1+x)$ 只在 $-1<x\le1$ 收敛」，`taylor-series:54` 接住，$-1<x<-\frac12$ 一段用积分余项证。

- **重要 1：`power-series` 第 6 题参考解答里「两端都收敛」的例子不对**
  - `power-series/problems.yaml:117` 说 $a_n=\frac{(-1)^n}{3^n}\bigl(\frac1n+\frac{(-1)^n}{n^2}\bigr)$「这类例子则可以在两端都收敛」。
  - 在 $x=3$ 处级数是 $\sum\bigl(\frac{(-1)^n}n+\frac1{n^2}\bigr)$，条件收敛，没问题；可在 $x=-3$ 处是 $\sum\bigl(\frac1n+\frac{(-1)^n}{n^2}\bigr)$，调和级数加一个收敛级数，发散。部分和在 $n=10^2$、$10^4$、$10^6$ 时是 4.4、9.0、13.6。
  - 这个例子和前面那个一样，在 $-3$ 处发散，撑不起「不能确定」。
  - 改法：换成符号两个一组交替的级数，例如 $a_n=\frac{\varepsilon_n}{n\cdot3^n}$，$\varepsilon_n$ 依次是 $+1,-1,-1,+1,+1,-1,-1,\dots$。
    - 在 $x=3$ 处是 $\sum\frac{\varepsilon_n}n$，在 $x=-3$ 处是 $\sum\frac{(-1)^n\varepsilon_n}n$，符号都是两个一组交替。
    - 两个都收敛：两项一组，组的和正负交替、绝对值递减趋于 0；取绝对值都是调和级数。数值上两个部分和分别稳定在 0.43882 和 −1.13197。
    - 要是不想举这个例子，删掉这一句也行，结论「在 $x=-3$ 处不会绝对收敛」不受影响。但这样「不能确定」只剩一边的例子，要么举例补上，要么改成「是否收敛要看具体的级数」。

- **小问题 1：两个名词该进表，起名的段落缺锚点；一处英文、一处标记位置**（`plan.md:242`、`:244`）
  - 交错调和级数：
    - `alternating-series:25` 起名，有英文括注，可这一段是「为什么单独讲」，没有锚点（「叫作……」的段落要加锚点，`plan.md:227`）。
    - 本节 `:34`、`:46`、`:50`、`:100`、`:101`，`power-series:52`，`taylor-series:70` 都用，题目里还有 `taylor-series` 第 6 题。三节用到，照「两节以上用到的名词就进术语表」进表。
    - 锚点可以把起名挪进 `def-alternating-series` 那一段，或者单加一个；`power-series:52`、`taylor-series:70` 补标。
  - 和函数：
    - `power-series:25`「叫作和函数，记作$S(x)$」没有英文括注（sum function，数学分析 `function-series:27` 也是这样写的），这一段也没有锚点。
    - `power-series:93`、`power-series-calculus:23`、`:25` 都用，第 8 题提示也用，两节用到，进表；`power-series-calculus:23` 补标。
    - 别的领域里的「和函数」，有的是数学分析 `function-series:27` 自己起名的函数项级数的和函数，有的是「调和函数」里的字面，按规矩 C 都不用补。
    - 写稿员汇报把这两个列在「没进表的」，没写理由。参数曲线、摆线、通项、公比、逐项求导不进表，我同意，理由见「我替你定的」第 4 条。
  - 星形线：`parametric-curves:88`（例 2 标题）第一次出现，没有括注英文。在 `:90` 题干里写成「星形线（astroid）」。
  - `parametric-curves:99`：「常见误区」这一块里「弧长」第一次出现在 `:99`（「参数形式的弧长公式」），标记却在 `:100`。挪到 `:99`。

- **小问题 2：几处论证少一句，或说法不准**
  - `ratio-root-tests:42`（调度员转来的第 4 条）：
    - 「比值趋于$\rho$时，$\sqrt[n]{a_n}$也趋于$\rho$」包括 $\rho=0$、$+\infty$，第 5 题只证了 $0<\rho<+\infty$。后一句「能用比值判别法的地方，根值判别法也能用」正好要用到 $\rho=0$、$+\infty$：$\frac{x^n}{n!}$、$\frac{n!}{10^n}$ 这类最常见的情形，比值都趋于 0 或 $+\infty$。
    - 第 5 题的办法只用一边就够：$\rho=0$ 时只用 $a_n\le a_N\varepsilon^{n-N}$，$\rho=+\infty$ 时只用 $a_n\ge a_NM^{n-N}$。
    - 在括号里补一句「$\rho=0$、$+\infty$时只用那里一边的不等式，道理一样」即可，不用加题。
  - `comparison-tests:99`「$\frac1{n\ln n}$比$\frac1n$小，又比任何$\frac1{n^p}$（$p>1$）大」：
    - 前一半 $n=2$ 时不成立，$\frac1{2\ln2}\approx0.72>\frac12$；后一半只在 $n$ 足够大时成立。
    - 写「$n\ge3$时比$\frac1n$小，$n$足够大时又比任何$\frac1{n^p}$（$p>1$）大」。
  - `series:58`「从第三项起按$2$的幂分组」：
    - 接着写的「第$k$组从$\frac1{2^{k-1}+1}$到$\frac1{2^k}$」在 $k=1$ 时是第二项 $\frac12$，$S_{2^k}\ge1+\frac k2$ 也把它算作第 1 组，两处对不上。
    - 改成「从第二项起」，或者说明「$\frac12$单独算第 1 组」。第 5 题提示已经写了「第 1 组就是$\frac12$」。
  - `taylor-series:32`「在$0$处各阶导数都是$0$（[泰勒公式]第 8 题）」：那道题是把这件事当已知给出的（「已知$f$在$0$处任意阶可导，各阶导数都是$0$」），没有证。括号改成「这件事这里不证，[泰勒公式]第 8 题用过它」之类。
  - 题目里两处措辞：
    - `comparison-tests` 第 6 题第 3 级提示「严格的大于」，改成「严格大于」。
    - `taylor-series` 第 6 题参考解答「差了约$1000$倍」是比较两个量，照 `plan.md:269` 写成「前者的误差约是后者的$\frac1{1000}$」。

- **小问题 3：一处图的说明和图不符；两道选择题的选项和讲解、例题判过的例子几乎一样**
  - `alternating-series:77`「横轴是项数$n$（图上写作 x）」：这个动画只有数列、没有函数，FunctionPlot 这时横轴标的就是 n（`packages/anim/src/FunctionPlot.tsx:94`、`:112`）。删掉「（图上写作 x）」。`series:89`、`ratio-root-tests:74` 的动画有函数，横轴标 x，那两处写得对。
  - 选择题选项（`plan.md:227`「选择题的选项也不要照搬讲解、例题里已经判过的例子」）：
    - `series` 第 2 题选项 A $\sum(-1)^n$，就是讲解 `:25`、常见误区 `:125` 判过的 $1-1+1-\cdots$ 换了个符号。换成别的发散级数，例如公比大于 1 的几何级数 $\sum(1.01)^n$，正好考 $|q|\ge1$ 那一半。
    - `dirac-delta` 第 2 题选项 A $\int_0^2\sin x\,\delta(x-3)\,\dd x$，和例 1 第二个积分 $\int_{-1}^1\cos x\,\delta(x-3)\,\dd x$ 尖峰都在 3、都在区间外，只换了被积函数和区间。尖峰位置、区间都换一组数；别改成尖峰正好在区间端点的情形，那种讲解 `:46` 说要另外约定，没有确定的答案。

## 改了没报的

没有。9 节、`_domain.yaml` 的 22 条、SVG 都和汇报一致。别的领域 10 个文件和 `arc-length` 的改动是汇报「补标」一节写的，这一轮没看。

工作区里还有不是这一批的改动：
- `progress/lessons.yaml`：本会话开始时就是改过的状态。
- 牛顿力学批次 21 正在写的 `content/physics/newtonian-mechanics/` 下的文件，和振动与波的 `pendulums`。

提交这一批时别带上。牛顿力学写到一半，仓库的 `npm run content` 一直报错：开审时是 `pendulums` 的前置不存在，写报告时是 `statics` 的术语 id 不在表里，没有一处在单变量微积分。我照 plan 的办法在临时副本上构建，单变量这边 0 错 0 警。

## 要修的，按小节分

- `power-series`：第 6 题参考解答（重 1）；`:25` 和函数（小 1）；`:52` 交错调和级数补标（小 1）。
- `alternating-series`：`:25` 交错调和级数的锚点（小 1）；`:77`（小 3）。
- `taylor-series`：`:70` 补标（小 1）；`:32`、第 6 题参考解答（小 2）。
- `power-series-calculus`：`:23` 和函数补标（小 1）。
- `parametric-curves`：`:90` 星形线、`:99` 标记位置（小 1）。
- `ratio-root-tests`：`:42`（小 2）。
- `comparison-tests`：`:99`、第 6 题提示（小 2）。
- `series`：`:58`（小 2）；第 2 题选项 A（小 3）。
- `dirac-delta`：第 2 题选项 A（小 3）。
- `_domain.yaml`：进表 2 条（小 1）。

## 需要你决定的

无。

## 调度员转来的两条（写稿员拿不准的第 3、4 条）

3. `power-series-calculus:25` 把「一致收敛」标成数学分析的 `uniform-convergence`，当旁白：可以。
   - 规矩 C：链外的别的领域术语按旁白标那个领域的 id（`plan.md:245`）。这里只说「要用到它，这里不证」，并链到 `power-series-theory`，推理没用它。
   - 先例是 `special-limits` 的单调有界原理（批次 20 改过以后在 `:50`，调度员说的 `:47` 是改之前的行号）。
   - 本批 `comparison-tests:32`、`alternating-series:32` 的单调有界原理也是同样处理，一致。
4. `ratio-root-tests`「比值有极限则根值有同样的极限」只证了 $0<\rho<+\infty$：见小问题 2 第 1 条。补一句话就够，不用补题。

## 我替你定的

1. $\delta_\varepsilon$ 取对称的矩形，端点处写「要另外约定」：同意，和 `convolution-impulse:34` 一致。
2. 第二种尖峰用三角形，不用 $\frac{\varepsilon}{\pi(x^2+\varepsilon^2)}$：同意，$\arctan$ 的导数不在 `dirac-delta` 的链上。
3. $\sqrt[n]n\to1$ 用 $e^u\ge1+u$，参数曲线的严格单调用拉格朗日中值定理：同意。`mean-value-theorem` 第 5 题（1）正是 $e^x\ge1+x$，洛必达法则、`monotonicity` 都不在链上。
4. 参数曲线、摆线、逐项求导、逐项积分、通项、公比、收敛、发散不进表：接受。
   - 参数曲线、摆线在本领域只有 `parametric-curves` 一节用：`arc-length:32` 只是节名链接；`beltrami-identity` 自己给摆线起名，照 `plan.md:1434`。
   - 通项、公比是中学的词。
   - 逐项求导、逐项积分说的是做法：本领域别的小节（`derivative-rules`、`chain-rule`）里是有限项的逐项求导，意思不同。
   - 收敛、发散照 `plan.md:243` 是「级数收敛」的普通用法。
   - 交错调和级数、和函数不在此列，见小问题 1。
5. 「收敛区间」指开区间，英文写 interval of convergence：同意，和 `power-series-theory:37` 一致。

## 跨领域的几处

- 规矩 C 反方向我自己扫了一遍：新进表的 22 条，加上简称、别名（等比级数、莱布尼茨判别法、交错调和级数、狄拉克、δ 函数），共 29 个词。别的术语表里更长的词（傅里叶级数、函数项级数、三维$\delta$函数、反常积分的比较判别法等）先遮掉。
  - 链外、在正文、批次 4 以后写的、意思相同的，就是调度员定的 4 处：`fourier-series:16`、`fourier-convergence:121`、`extrema:41`、`orthogonal-projection:50`，写稿员已经改上。
  - 扫出来没标记的链外 40 处都不用补：
    - 题目文字：`uniform-convergence`、`fourier-series`、`vector-spaces`、`laplace-transform`、`images-uniqueness`、`functionals`。
    - 批次 4 以前写的：`limsup-liminf`、`poisson-brackets`。
    - 意思不同：反常积分的比较判别法和绝对收敛（`laplace-transform:30`、`:35`，`polar-double-integrals:44`）；「……的部分 和 ……」；`lines-planes` 自己起名的「直线的参数方程」；`potentials` 第 8 题的「狄拉克」。
  - 没有要再补的。
- 链接改指锚点的 7 处、`arc-length` 退回 `written`，复核时看。

## 细节

- 读题：`npm run statements -- <9 节> --tier easy,medium`；验算脚本比对通过以后才读 `problems.yaml`。
- 脚本：9 个 `tools/verify/math.calculus.<小节>.ts`。
  - 辅助函数是开审前加进 `math.calculus._calc.ts` 的批次 21 部分：`lgamma`、`partialSums`、`seriesSum`、`alternatingSum`、`positiveSeriesConverges`、`ratioLimit`、`rootLimit`、`radiusOfConvergence`、`peakLimit`、`asFunctionOfX`、`secondDerivativeAt`、`parametricArea`，都拿已知精确值自测过。
  - 方法尽量不走讲解的路：
    - 求和直接加部分和、再外推；交错级数用 Cohen–Villegas–Zagier 加速，并和部分和的平均核对。
    - 收敛与否：通项检验，加部分和增量；$p$ 接近 1 的用柯西凝聚判别法（讲解里没有）；交错的看相邻部分和的平均是否稳定，不用交错级数判别法。
    - 收敛半径用 $\lim|a_n|^{1/n}$，不用比值公式；只有 `power-series` 第 4 题根值收敛太慢，改用比值，再和根值核对到 $10^{-6}$。
    - 泰勒系数用 `_jet.ts` 的展开式算术；$\delta$ 的题按定义用矩形尖峰积分、$\varepsilon\to0$ 外推，再用三角形、高斯形尖峰核对。
    - 参数曲线的斜率先把曲线写成 $y$ 关于 $x$ 的函数（二分解 $x(t)=X$）再数值求导，不套 $\frac{y'}{x'}$；弧长用内接折线外推。
  - 结果 36 道全部一致；`npm run verify` 335 节全部一致，`npm run typecheck` 通过。
- 引文：「第 N 题」「例 N」逐个对过。`ratio-root-tests:40` 引的 `mean-value-theorem` 第 5 题、`taylor-series:47` 引的 `ratio-root-tests` 例 2 都对；`taylor-series:32` 引的 `taylor-polynomial` 第 8 题见小问题 2。
- 数：正文、例题、提示、参考解答里写出的数都核过，例如：
  - $H_{1000}\approx7.485$，超过 100 要 $10^{43}$ 项以上；
  - $H_{12367}$ 是第一个超过 10 的部分和，$H_{83}$ 是第一个超过 5 的；
  - $S_9\approx0.9021$，$T_7(0.5)\approx0.40580$；
  - $e^{-20}$ 的级数最大项约 $4.3\times10^7$；
  - $\frac{10^9}{9!}\approx2756$；
  - $\frac{n^{10}}{1.1^n}$ 在 $n=686$ 第一次小于 1；
  - 科赫雪花的面积 $\frac{2\sqrt3}5$，$\int_0^{1/2}\frac{\ln(1+x)}x\dd x\approx0.4484$，$\int_0^1e^{-x^2}\dd x\approx0.74682$；
  - SVG 里 $\theta=2.2$ 时 $P$ 的坐标、切线经过 $A$、弧 $TP$ 的长等于 $OT$。
- 术语：
  - 每块第一次出现、第一次出现括注英文、起名段落的锚点、链外标记、链接文字，都用脚本扫过。报出的「极限」是广义的取极限，「调和级数」报在「交错调和级数」里，都不算。
  - 本领域已审的旧小节里没有要补标的：扫出来的只是字面相同的「部分和」「和函数」（「偶的部分和奇的部分」「极限和函数值」这类），以及反常积分的「比较判别法」「绝对收敛」「条件收敛」，意思不同。
  - 段落句数、引号、「黑点」、「比……倍」也扫过：只有小问题 2 那一处「倍」。
- 页面：
  - 照 plan 的办法，用 `git archive HEAD` 导出临时副本，拷进当前的 `content/math/calculus/`，`node_modules` 用目录联接；在副本里构建内容（0 错 0 警）、建网站。
  - 服务进度写临时 Git 仓库（端口 3149）。
  - `.claude/launch.json` 临时加的条目已删，服务已停，副本先删联接再删目录，临时仓库已删，仓库的 `node_modules` 完好。快照 `b21-snapshot/` 留着，复核完删。

## 修订说明（写内容会话）

审查报告是 `docs/reviews/batch-21-calculus.md`，重要 1 条、小问题 3 条，全部照改，没有不修的。每条都按「同一类问题全批找一遍」扫过，另外改了同类的 5 处，在各条的「同类」里。只改了 `content/math/calculus/` 下的文件，别的领域没动。

### 重要 1：`power-series` 第 6 题

- 参考解答里「两端都收敛」的例子，换成调度员给的只含偶次幂的 $\sum_{n\ge1}\frac{(-1)^nx^{2n}}{n\cdot9^n}$，没用审查给的 $\varepsilon_n$ 那个。
  - 相邻非零项之比的绝对值趋于 $\frac{x^2}9$，所以 $R=3$，正好用讲解里隔项级数的办法。
  - $x=\pm3$ 处都是 $\sum\frac{(-1)^n}n$，两端都条件收敛。
- 第 3 级提示也补了一句。
  - 原来只指向第一个例子，那个例子在 $-3$ 处发散，照着提示做会以为答案是「发散」。
  - 末尾加了「再看只含偶次幂的 $\sum\frac{(-1)^nx^{2n}}{n\cdot9^n}$」，两个例子都点到。
- 数值核对用的是 scratchpad 里的 `v-p6-b21r.mjs`：
  - 收敛半径：系数的 $|a_k|^{1/k}$ 在 $k=2\times10^6$ 时是 0.333331，所以 $R=3$。$x=2.9$、$3.1$ 时相邻非零项之比分别是 0.934、1.068。
  - $x=\pm3$ 处，部分和在 $N=10^2$、$10^4$、$10^6$ 时是 −0.68817、−0.69310、−0.693147，趋于 $-\ln2$。
  - 取绝对值以后的部分和在 $N=10^6$ 时是 14.39，和 $\ln N+\gamma$ 一致，发散。
  - 旧例子在 $-3$ 处的部分和是 4.37、8.97、13.57，和审查给的数一致，确实发散。

### 小问题 1：进表、锚点、括注、标记位置

- 进表 2 条，术语表从 136 条变成 138 条：
  - `alternating-harmonic-series`：交错调和级数（alternating harmonic series），定义在 `alternating-series#def-alternating-series`。
  - `sum-function`：和函数（sum function），定义在 `power-series#def-power-series`。
- 起名的句子挪进了锚点段：
  - `alternating-series:23`：
    - 定义段末尾加了一句：「$a_n=\frac1n$时的$1-\frac12+\frac13-\frac14+\cdots$叫作交错调和级数（alternating harmonic series）」。
    - `:25` 原来起名的那句改成「交错调和级数是最常拿来举例的一个，它的部分和……」。
    - 卡片上方显示「交错级数·交错调和级数」。
  - `power-series:23`：
    - 定义段末尾加了一句：「它在收敛的每个$x$处都有一个和，这个和是$x$的函数，叫作幂级数的和函数（sum function），记作$S(x)$」。
    - `:25` 去掉了起名，改成「使它收敛的$x$组成和函数的定义域」。
    - 卡片上方显示「幂级数·和函数」。
- 补标记，都是这一块里第一次出现的地方：
  - 交错调和级数：
    - `alternating-series` 的 `:34`、`:46`、`:50`、`:100`。
    - `power-series:52`、`taylor-series:70`，这两处是本节第一次出现，带了括注。
  - 和函数：
    - `power-series` 的 `:75`（几何图像）、`:93`（例 2）。
    - `power-series-calculus:23`，本节第一次出现，带了括注。
    - `power-series:61` 是函数的图例文字，那里不能写标记。
  - 题目文字照「可标可不标」，没有标：`alternating-series` 第 5、7、8 题，`taylor-series` 第 6 题，`power-series-calculus` 第 8 题。
- 本领域别的小节按全名扫过：
  - 「交错调和级数」只出现在这 3 节。
  - 「和函数」另外有 5 处，都是连词「和」加「函数」，不标：`limits-intuition:59` 和它的第 7 题，`differentials` 第 2 题，`taylor-polynomial` 的 goal 和第 7 题。
- `parametric-curves:90`：「求曲线…」改成「求星形线（astroid）…」。
- `parametric-curves:99`、`:100`：「弧长」的标记挪到 `:99` 的「参数形式的弧长公式」上，`:100` 不再标。
- 同类：
  - 漏标：
    - 漏掉 `:99` 是因为我的自查脚本把「弧长公式」「阶导数」「高阶导数」当成更长的词，跳过了里面的短术语。
    - 去掉这三个词，9 节重扫了一遍，只剩原来那 7 处有意不标的广义「极限」。
  - 缺括注：
    - `series` 第 8 题的两个人名补了括注：「阿基里斯（Achilles）」「芝诺（Zeno）」。先例是 `area-between-curves` 第 6 题的「阿基米德（Archimedes）」。
    - `comparison-tests` 第 6 题改成「记余项（remainder）」。这里说的是级数的余项，`taylor-remainder` 不在这一节的链上，对读者是新名词。
    - 别的人名、曲线名原来就有括注：科赫雪花、欧拉常数、黎曼重排定理、摆线。

### 小问题 2：论证少一句、说法不准

- `ratio-root-tests:42` 改成：「比值趋于ρ时，ⁿ√aₙ也趋于ρ：0<ρ<+∞的情形见第 5 题；ρ=0 时只用那里的上界 aₙ ≤ a_N εⁿ⁻ᴺ，ρ=+∞ 时只用下界 aₙ ≥ a_N Mⁿ⁻ᴺ（ε任意小，M任意大），道理一样。」
  - 后面「所以能用比值判别法的地方……」另起一句，这一段 4 句。
  - 同类：全批「ρ、R 可以是 0 或 +∞」的说法都看过，`thm-ratio-test`、`thm-root-test`、`thm-radius-ratio`、`thm-termwise` 的道理都已经包括两端，没有要补的。
- `comparison-tests:99` 改成：「n≥3 时 1/(n ln n) 比 1/n 小，n 足够大时又比任何 1/nᵖ（p>1）大」。
  - 同类：`:41` 的「1/n² < 1/n」在 n = 1 时是等号，改成「≤」。`:113` 原来就写的是 ≤。
  - 别的不等式都核过范围，都对：讲解里的 `alternating-series:87`，以及各节题目里的十几处。
- `series:58` 改成：「从第二项起按 2 的幂分组：第 1 组只有 1/2，…」。
  - 这样和后面第 k 组的范围、$S_{2^k}\ge1+\frac k2$ 都对上了。
  - 第 5 题的提示原来就是这样分组的。
- `taylor-series:32`：括号改成「（这里不证，[泰勒公式]第 8 题用过这件事）」。
  - 同类：全批引用别处题目的另外 3 处都核过，引用的题都给了证明：
    - `mean-value-theorem` 第 5 题（1）证了 eˣ ≥ 1+x。
    - `dirac-delta` 第 6 题证了三角形尖峰也筛出 f(0)。
    - `parametric-curves` 第 6 题证了切线过最高点。
- `comparison-tests` 第 6 题第 3 级提示：改成「严格大于」。全批没有别的「严格的」。
- `taylor-series` 第 6 题参考解答：改成「前者的误差约是后者的 1/1000」。
  - 同类：`parametric-curves:25` 的「走得快一倍」也是在比较两个量，改成「点走动的速度是前一种的 2 倍」。
  - 别的「倍」都是「是……的 N 倍」的写法。

### 小问题 3：图的说明、选择题选项

- `alternating-series:77`：删了「（图上写作 x）」。
  - 核过 `FunctionPlot.tsx:94`、`:112`：只有数列时横轴标 n。
  - `series:89`、`ratio-root-tests:74` 的动画里有函数，横轴标 x，照旧。
- `series` 第 2 题 A 换成 ∑(1.01)ⁿ，公比大于 1 的几何级数。提示 2、3 和解答跟着改了，答案仍是 B、D。
- `dirac-delta` 第 2 题 A 换成 ∫₁⁵ x³ δ(x+2) dx。尖峰在 −2，在区间左边，不在端点上。提示 3 和解答跟着改了。
  - 同类：同一题的 D 原来是 ∫₋₄⁴ (x²−1) δ(x−2) dx，和例 1 的第一个积分一样，都是尖峰在 2、在区间里、被积函数是多项式。也换了，改成 ∫₀⁵ √x δ(x−4) dx = 2。答案仍是 A、B。
  - 全批 8 道选择题的选项都和讲解、例题、术语表简介对过。别的选项和判过的例子用的数都不同，是同一类，但不是同一个，照旧。例如：
    - `comparison-tests` 第 1 题 C 的 1/(3ⁿ+n)，对应讲解里的 1/(2ⁿ+1)。
    - `alternating-series` 第 1 题 A 的 1/n^0.8，对应例 1 的 1/√n。
- 数值核对用的是 `v-options-b21r.mjs`：
  - ∑(1.01)ⁿ 的部分和在 n = 2000 时是 4.4×10¹⁰。
  - A 的矩形尖峰积分在 ε ≤ 0.5 时都是 0。
  - D 在 ε = 0.001 时是 1.9999999987。

### 进度和验算脚本（复核时请看）

- 改了选项的两道题是 `series` 第 2 题和 `dirac-delta` 第 2 题。
  - `progress/` 里没有这两道题的记录，`progress/problems/` 下只有 `math.analysis.yaml`。
  - 这一批也还没提交过，所以不算改号，不用迁移脚本。
- 审查的验算脚本 `tools/verify/math.calculus.series.ts`、`math.calculus.dirac-delta.ts` 还在按旧选项算：
  - series 的 A 还是 (−1)ⁿ，dirac-delta 的 A、D 还是旧积分。
  - 答案没变，所以 `npm run verify` 照样一致。
  - 这两个脚本不在我能改的范围里，照先例（批次 13、15、18 等），请复核时按新选项改。

### 检查

- 仓库里的 `npm run content`：0 个错误，0 个警告。
- `npm run typecheck`：通过。
- `npm run verify`：335 节全部一致。
- `npm test`：23 个文件，202 项全部通过。
- 自查脚本去掉上面那三个词以后重扫：标记、英文括注、锚点段句号、段落句数、行内公式等号、公式里的汉字、一句话总结字数都合规。
- 页面：
  - 网站从仓库构建到 scratchpad（`vite build --outDir`），没有写仓库的 `dist/`。
  - 用进度写临时目录的服务，在 768 像素宽下看了 9 节，题目的提示、解答全部展开。
  - 9 节都是 `scrollWidth = clientWidth`，没有 KaTeX 报错，没有要左右拖的框，行间公式都在栏宽以内。
  - 两个新术语的浮窗显示正常。
  - 两张定义卡片的标签分别是「交错级数·交错调和级数」「幂级数·和函数」。
  - `parametric-curves` 常见误区第 2 条的「弧长」有了下划线。
- 收尾：服务已停，`.claude/launch.json` 里临时加的条目已删，网站构建目录已删。

## 复核

审内容 agent · 2026-11-18

通过。重要 1 条、小问题 3 条都改好了，同类另改的 5 处也对；补标的别的领域 10 个文件和 `arc-length:32` 和单子一致。9 节和 `arc-length` 的 status 已改成 `reviewed`。

- 逐条对过（和开审时的快照逐行比）：
  - 重要 1：`power-series` 第 6 题换上的 $\sum\frac{(-1)^nx^{2n}}{n\cdot9^n}$ 是对的。相邻非零项之比的绝对值趋于 $\frac{x^2}9$，$R=3$；$x=\pm3$ 处都是 $\sum\frac{(-1)^n}n$，两端都条件收敛。第 3 级提示两个例子都点到了，「在 $x=-3$ 处不会绝对收敛」的结论照旧。
  - 小问题 1：
    - 进表 2 条（136 → 138）。两条简介只用定义它的那一节链上的概念，字数构建查过（上限 60）。
    - 起名的句子挪进了带锚点的段落，卡片上方显示「交错级数·交错调和级数」「幂级数·和函数」，两段都以句号结束。
    - 每块第一次出现的地方都标了，各节第一次出现带英文：`alternating-series` 4 处，`power-series:52`、`:75`、`:93`，`taylor-series:70`，`power-series-calculus:23`。
    - 「星形线（astroid）」补上；`parametric-curves` 常见误区「弧长」的标记挪到 `:99`。
    - 9 节重扫分块标记、英文括注、起名段落的锚点、链、段落句数，都没查出问题；剩下的「极限」都是广义的。
  - 小问题 2：
    - `ratio-root-tests:42`：只用一边的不等式，$\rho=0$ 时 $\sqrt[n]{a_n}\le\varepsilon\sqrt[n]{a_N\varepsilon^{-N}}$，$\rho=+\infty$ 时 $\sqrt[n]{a_n}\ge M\sqrt[n]{a_NM^{-N}}$，论证成立，这一段 4 句。
    - `comparison-tests:99`、`series:58`、`taylor-series:32` 和两处措辞都照改了。
  - 小问题 3：`alternating-series:77` 删了「图上写作 x」；`series` 第 2 题 A、`dirac-delta` 第 2 题 A 换了，提示、解答跟着改，答案不变。
  - 同类 5 处都对：
    - `comparison-tests:41` 改成「$\le$」；
    - `series` 第 8 题人名补了括注；
    - `comparison-tests` 第 6 题「余项（remainder）」；
    - `parametric-curves:25` 改成「是前一种的 2 倍」；
    - `dirac-delta` 第 2 题 D 换成 $\int_0^5\sqrt x\,\delta(x-4)\,\dd x=2$，原来的 D 和例 1 第一个积分同样是尖峰在 2、被积函数是多项式。
- 改了没报的：没有。和快照比出来的改动，都在「修订说明」里。
- 新进表两条的规矩 C 反扫：
  - 「交错调和级数」在别的领域只有数学分析 `series-cauchy`、`rearrangement` 用，两节的链上都有 `alternating-series`，不标，第一次出现都带了英文。
  - 「和函数」：数学分析 `function-series:27` 给函数项级数的和函数自己起了名，那几节说的是它，不是借用；其余都是「和」加「函数」的连词、「调和函数」里的字面。本领域别的小节同样只有连词。没有要补的。
- 补标的 11 个文件：和快照比，只动了单子上的那几行。
  - 4 处标记：`fourier-series:16`、`fourier-convergence:121`、`extrema:41`、`orthogonal-projection:50`，缺的英文括注都补了。
  - 7 处链接改指锚点：`series-cauchy:107`、`limsup-liminf:124`、`convolution-impulse:34`、`delta-3d:22`、`matrix-exponential:32`、`series-solutions:32`、`arc-length:32`。构建会查锚点，都在。
  - 别的领域的 status 没动；`arc-length` 退回 `written` 以后，这次随批改成 `reviewed`。
- 验算脚本：`math.calculus.series.ts` 第 2 题 A 换成 $(1.01)^n$，`math.calculus.dirac-delta.ts` 第 2 题 A、D 换成新的两个积分，单独跑都和标准答案一致。
- 检查：
  - `npm run content` 0 个错误、0 个警告：仓库现在构建得过，牛顿力学那边已经不报错了。
  - `npm run verify` 344 节全部一致（比开审时多出来的 9 节是牛顿力学批次 21 的脚本）。
  - `npm run typecheck` 通过。
  - 页面：照 plan 的办法建临时副本，放进当前的单变量和补标的 10 个文件，其余用已提交的版本，在副本里构建（0 错 0 警）。在 768 像素宽下看了 9 节和 `arc-length`：
    - 每节点 32 下，`scrollWidth` 都等于 `clientWidth`，没有 KaTeX 报错，没有要横拖的地方，行间公式都在栏宽以内；
    - SVG 12 个文字照旧不出界、不重叠、不压线；
    - 两个新术语点开的浮窗显示正常；
    - `arc-length` 的链接指向 `#thm-parametric-arc-length`。
- 收尾：临时网站副本先删联接再删目录，临时进度仓库、`.claude/launch.json` 里临时加的条目都已删，服务已停，仓库的 `node_modules` 完好；快照 `b21-snapshot/` 已删。没有提交。
- 不归我看的：牛顿力学写稿员改的 4 个别的领域文件（`curl-divergence`、`cylindrical-spherical`、`vector-fields`、`orthogonal-matrices`）和牛顿力学的 9 节、`pendulums`，这次没碰。

# 批次 20 审查报告：单变量微积分（积分法与定积分的应用）

审内容 agent（和写内容 agent 是两个独立会话；它的汇报是审完以后才读的，只用来核对「改了没报的」）· 2026-11-18

审查范围：`math.calculus` 的 12 节：`improper-integrals`、`improper-unbounded`（新）、`area-between-curves`、`substitution`、`integration-by-parts`、`partial-fractions`、`trig-integrals`（新）、`trig-substitution`、`volumes`、`arc-length`、`polar-area`、`physical-applications`，加上补标后退回 written 的 `antiderivatives:56`、`special-limits:31`。包括 96 道题、7 个 `function-plot` 动画、5 张 SVG，`_domain.yaml` 新进表 13 条（97 → 110 条）。

开审前把这 14 节的目录和 `_domain.yaml` 拷了快照（scratchpad 的 `b20-snapshot/`），复核时和它比；写完报告时又比了一次，审查期间没有变动。

## 结论

重要 0 条，小问题 3 条，没有原有问题。

- 讲解、例题的推导和数都对。48 道简单题、中等题独立验算，全部和标准答案一致；48 道难题、思考题逐道读过，参考解答都对，难度档合适。
- 前置：全图层级和确认的一致（9 节加 1，其中已写 5 节；新节第 10、11、12 层），多余前置 0 处。链外的标记都是「提前提到」或旁白，推理里链外用到的只有小问题 1 的两处换元。
- 篇幅：`minutes` 23–28；讲解加例题 369–1022 个汉字。
- 页面：14 节在 768 像素宽下全部展开（每节 32 下），`scrollWidth` 都等于 `clientWidth`，没有 KaTeX 报错，题目卡片里没有要横拖的公式；5 张 SVG 不出界、不重叠、不压线。正文里有 3 个行间公式要横拖（小问题 3）。
- 下游都接得住：`gamma-function:41`（只用乘积法则加牛顿-莱布尼茨公式，见「跨领域的几处」）、`:48`，`fourier-series:96`，`euler-lagrange:39`，`laplace-transform:23`–`:35`、`:47`、`:57`，`separable:95`，`laplace-ivp:36`，`functionals:22`、`:30`、`:36`，`polar-double-integrals:25`、`:42`，`trig-construction` 第 7 题，`antiderivatives:56`。牛顿力学 `gravitational-potential`、`kepler-orbits`、`central-forces` 的记号和这边一致。

- **小问题 1：正文几处说法不准，或少交代一步**
  - `trig-integrals:62`「$t=\tan\frac x2$只在一个周期$(-\pi,\pi)$上有定义」不对：在$(\pi,3\pi)$上也有定义，没定义的是$x=\pm\pi$（$\pi$的奇数倍）。改成「在$x=\pm\pi$处没有定义，积分区间跨过它们时要拆开」。
  - `trig-substitution:25`「在这个范围里$\cos t\ge0$、$\tan t\ge0$」：第二种$x=a\tan t$的范围里$\tan t$有负的。按种分开说：前两种$\cos t\ge0$，第三种$\tan t\ge0$。
  - `arc-length:25`「加密分点时折线只会变长」：新分点和两旁的点共线时长度不变，写「不会变短」。
  - `improper-unbounded:103`「要用以后的换元积分法」：`substitution` 在第 9 层，比本节早，只是不在链上。去掉「以后的」，可写「令$x=t^2$换元」。
  - `polar-area` 用$\cos2\theta$、$\cos4\theta$的原函数没交代：`:40`–`:43` 心形线、例 1 `:65`、例 2 `:77`、第 3 题提示、第 4 题解答。`antiderivatives:56` 说$\cos2x$这类要用换元积分法，`polar-area` 链上没有 `substitution`；写稿员汇报说应用四节「原函数都可以求导验证」，`arc-length`、反常积分两节的提示写了，这里没写。在 `:40` 补一句$\bigl(\frac{\sin2\theta}2\bigr)'=\cos2\theta$即可；或加前置 `substitution`（仍是第 10 层，全图层级不变、不造成多余前置）。
  - `integration-by-parts:54` 图注「$\int u\,\dd v=\int_a^bu(x)v'(x)\,\dd x$」用的是定积分换元，不在链上，补一句链接 `substitution#thm-substitution-definite`。
  - 倍数说法（`plan.md:269`）：`area-between-curves:121`「宽比$\dd z$大一个固定的倍数」、`volumes` 第 8 题第 3 级提示「宽度比厚度大一个不趋于$1$的倍数」，改成「是……的若干倍」。
- **小问题 2：两个词该进表，一处规矩 C 漏标**（`plan.md:244`、`:245`）
  - 保序性：`integral-properties:44` 的定理名，`improper-integrals:48` 当名词用（`arc-length` 第 5 题提示也用）。
  - 积分区间：`definite-integral:45` 起名，`area-between-curves:54`、`:120`，`improper-integrals:16`，`improper-unbounded:101`，`trig-integrals:62`、`:99` 都用。同一句起名的积分上限，`improper-integrals:99` 也用。认作基础词的话写一句理由。
  - 进表后 `definite-integral`、`integral-properties` 补标、退回 `written`（`plan.md:246`）。
  - `improper-integrals:48`「单调有界原理（monotone convergence theorem）」是数学分析的术语，本节链外，照 `special-limits:50` 标 `math.analysis.monotone-convergence-theorem`（`plan.md:1146`）。
- **小问题 3：768 像素宽下要横拖的地方，和一张图的变量名**
  - 正文行间公式比栏宽：`trig-integrals:45`（积化和差三式一行，944 > 721 像素）、`volumes:79`（896）、`polar-area:77`（787）。拆成几行（`aligned`）。已审的 `fundamental-theorem`、`taylor-remainder`、`taylor-limits` 都没有这种情况。
  - `parts-area.svg` 端点标「t = a」「t = b」（alt 文字也是），图注和第 7 题用$x$从$a$走到$b$，改成 x。

## 改了没报的

没有。12 节、`_domain.yaml` 的 13 条、两节补标、别的领域 6 个文件都和汇报一致。工作区里 `progress/lessons.yaml` 也是改过的状态（本会话开始时就有，不在任何汇报里），提交这一批时别带上。

## 要修的，按小节分

- `trig-integrals`：`:62`（小 1）；`:62`、`:99` 积分区间（小 2）；`:45`（小 3）。
- `polar-area`：$\cos2\theta$的交代（小 1）；`:77`（小 3）。
- `integration-by-parts`：`:54` 链接（小 1）；`parts-area.svg`（小 3）。
- `improper-integrals`：`:48` 保序性、单调有界原理，`:16`、`:99` 随进表补标（小 2）。
- `improper-unbounded`：`:103`（小 1）；`:101`（小 2）。
- `trig-substitution`、`arc-length`：`:25`（小 1）。
- `area-between-curves`：`:121`（小 1）；`:54`（小 2）。`volumes`：第 8 题提示（小 1）；`:79`（小 3）。
- `definite-integral`、`integral-properties`、`_domain.yaml`：随进表补标（小 2）。
- `substitution`、`partial-fractions`、`physical-applications`、`antiderivatives`、`special-limits`：无。

## 需要你决定的

无。

## 我替你定的

1. `substitution`、`integration-by-parts` 的 goal 加定积分：同意，两节都讲了定积分的形式（`thm-substitution-definite`、`thm-parts-definite`），下游都接得住。
2. `physical-applications` 的「质心」只加锚点、不标牛顿力学的 id：同意，符合 `plan.md:246` 末句。
3. 「弧长」按中学基础词，本领域照标：同意。`polar-area:46` 用的是圆弧长$r\,\dd\theta$，标了本领域 id，按「提前提到」接受。
4. 比较判别法、绝对收敛的 id 取 `improper-comparison-test`、`absolutely-convergent-integral`，中文名带「反常积分的」：同意，给批次 21 留出了 `comparison-test`。
5. 瑕点、真分式、三角函数有理式、万能代换、圆盘法、柱壳法、极点、极轴、极径、极角、线密度只加锚点：本领域都只有一节用，接受。有理函数从批次 17 起当基础词用，不进表也接受。

## 跨领域的几处

- 已改的 6 个文件看过一遍，和确认的一致；连同还要改的 7 个，复核时正式看。
- **规矩 C 反方向还要补 3 处「分部积分」**（链外、正文、批次 4 以后）：`gamma-function:16`、`:41`（批次 5），`greens-theorem:45`（批次 15），标 `math.calculus.integration-by-parts`。不在你给的 7 处里。
- `gamma-function:41`「微积分里算$\int_0^\infty t^ne^{-t}\dd t$用的就是这一步」：这一批没有哪一节算这个积分。定理 2 的证明只用乘积法则和$[\varepsilon,A]$上的牛顿-莱布尼茨公式，不依赖它，这句是旁白，不用谁接住，补上面的标记即可。
- 牛顿力学记号：`gravitational-potential:36` 写$\int_r^{+\infty}\cdots\Big|_r^{+\infty}$，和 `improper-integrals:27` 一致；`kepler-orbits:50` 的$\pi ab$链到 `area-between-curves`（例 2）；`central-forces` 极角写$\varphi$，`polar-area:25` 说了「物理里极角常写成$\varphi$」。

## 细节

- 读题：`npm run statements -- <12 节> --tier easy,medium`；验算脚本比对通过以后才读 `problems.yaml`。
- 脚本：12 个 `tools/verify/math.calculus.<小节>.ts`。`math.calculus._calc.ts` 是我加的：开审前加了 135 行（`integrateEndpoints`、`integrateToInfinity`、`partialIntegrals`、`curveLength`、`revolvedSurfaceArea`、`sweptArea` 等），今天又加了 `convergesByIncrements`。方法：tanh-sinh 数值积分（无穷区间换到$[0,1)$，瑕点处用到端点的距离），收敛判断看部分积分的增量，弧长、旋转面、扫过的面积都按定义用折线、圆台、三角形求和外推，体积题两种切法互相核对。结果 48 道全部一致；开审时 `npm run verify` 304 节全部一致，`npm run content` 0 错 0 警。
- 引文：「第 N 题」「例 N」逐个对过，都指对了；`improper-unbounded:16`、`:22` 引的 `fundamental-theorem:55`、`definite-integral:49` 都有。动画说明里的数（$e^{10}$约 22000、折线$N=10$约 4.250）核过。
- 术语：每块第一次出现、链外标记、规矩 C 两个方向都用脚本扫过，报出的「极限」是广义的取极限，「微分」在「常微分方程」「凑微分法」里，都不算。
- 页面：网站建在 scratchpad，服务进度写临时 Git 仓库（端口 3149），`.claude/launch.json` 临时加的条目、网站副本、临时仓库都已删，服务已停。

## 修订说明（写内容会话）

报告里的 3 条小问题都改了，没有不修的；协调会话另外交代的 3 处规矩 C「分部积分」也补了。同一类问题在 12 节里都找过一遍，另外改到的地方列在各条下面。行号是修订后的。

### 小问题 1：说法和交代

- `trig-integrals:69`：改成「$t=\tan\frac x2$在$x=\pm\pi$（$\pi$的奇数倍）处没有定义，积分区间跨过这些点时要拆开」。`:106` 常见误区原来就写「在$x=\pi$处没有定义」，不用改。
- `trig-substitution:25`：改成「前两种的范围里$\cos t\ge0$，第三种的范围里$\tan t\ge0$」。
- `arc-length:25`：「只会变长」改成「不会变短」。
  - 同类：几何图像说明里写「总长一路增加」，那里是等分成 $N$ 段，$N$ 段和 $N+1$ 段不是加密的关系。
  - 逐个算了 $N=1,\dots,40$，折线总长确实单调增加，说法成立，没改。
- `improper-unbounded:103`：去掉「以后的」，改成「令$x=t^2$，用换元积分法化成$2\int_0^{+\infty}\frac{\dd t}{1+t^2}$就能算出」。
  - 同类：别的「以后」都对过，指的都是层级更高的小节。
- `polar-area`：照协调会话定的第一个办法，不加前置。
  - `:40` 补「求导可以验证$\bigl(\frac{\sin2\theta}2\bigr)'=\cos2\theta$」；
  - 例 1（`:60`）补「$\cos2\theta$的原函数仍用$\frac{\sin2\theta}2$」；
  - 例 2（`:74`）补「$(2\sin2\theta)'=4\cos2\theta$」；
  - 第 3 题第 3 级提示补$\bigl(\frac{\sin4\theta}4\bigr)'=\cos4\theta$；
  - 第 4 题解答写出$\cos^2\theta=\frac{1+\cos2\theta}2$和$\bigl(\frac{\sin2\theta}2\bigr)'=\cos2\theta$；
  - 第 6 题第 3 级提示补「求导验证」。
  - 同类：应用四节和两节反常积分用到的原函数逐个看过。`arc-length` 第 4 题第 3 级提示补了「（求导验证）」，别处都已写明，或者只用基本积分表。
- `integration-by-parts:54` 图注：改成「面积是$\int u\,\dd v$，由[定积分的换元](lesson:math.calculus.substitution#thm-substitution-definite)，它等于$\int_a^bu(x)v'(x)\,\dd x$」，绿色一块同样写。
  - 第 7 题第 3 级提示用的是同一步，也补了「由定积分的换元」。
- 倍数：
  - `area-between-curves:121` 改成「宽是$\dd z$的$\frac{\sqrt{R^2+H^2}}H$倍」；
  - `volumes` 第 8 题第 3 级提示改成「宽度是厚度的若干倍，这个倍数不趋于$1$」。
  - 同类：12 节正文和题目里的「倍」都查过。`polar-area` 第 7 题第 3 级提示「得到两倍」改成「得到的是圆面积的$2$倍」。其余是「伸缩成原来的……倍」「差一个常数倍」，不是比较两个量，不改。

### 小问题 2：进表和补标

**进表 4 条，术语表 110 条 → 114 条**（都定义在原来起名的段落，锚点不变）：

| id | 中文名 | 定义在 | 锚点 |
| --- | --- | --- | --- |
| `math.calculus.integral-monotonicity` | 保序性 | integral-properties | `thm-monotone-integral` |
| `math.calculus.interval-of-integration` | 积分区间 | definite-integral | `def-definite-integral` |
| `math.calculus.upper-limit-of-integration` | 积分上限 | definite-integral | `def-definite-integral` |
| `math.calculus.lower-limit-of-integration` | 积分下限 | definite-integral | `def-definite-integral` |

- 积分下限：正文里只在起名那一句出现。但 `fundamental-theorem`、`improper-unbounded` 的滑块标签写着「积分下限」，它又和积分上限在同一句起名，所以一起进表。
- 补标：
  - `definite-integral:45`：三个词在起名的句子里标上，英文括注原来就有；
  - `integral-properties:44` 定理名里标「保序性」，`:119` 常见误区也标；
  - `improper-integrals`：`:16` 积分区间、`:48` 保序性、`:99` 积分上限；
  - 积分区间：`improper-unbounded:101`、`area-between-curves:54` 和 `:120`、`trig-integrals:69` 和 `:106`。
  - 题目文字照「可标可不标」，没标：`area-between-curves` 第 1 题、`arc-length` 第 5 题、`integral-properties` 第 6 题。
- `definite-integral`、`integral-properties` 退回 `written`。
- `improper-integrals:48` 的单调有界原理：照 `special-limits:50` 标 `math.analysis.monotone-convergence-theorem`。
- 同类：
  - 我的检查脚本原来只认术语表里的全名，漏了「分部积分」这个简称，和协调会话的扫描是同一个毛病。
  - 补了别名后重扫本领域，`integration-by-parts` 要补 3 处：`:54`「分部积分公式」、`:74`、`:88`（`:20`、`:41` 是标题，不标）。别的小节正文里没有这个简称。
- 别的领域里「积分区间」还出现在数学分析 `fourier-convergence:23`、`parameter-integrals:27`，留给协调会话扫。

### 小问题 3：行间公式和图

- 拆成两三行（`aligned`）：`trig-integrals:48` 积化和差三式，`volumes:80` 例 2，`polar-area:77` 例 2。
- 同类：在 768 像素宽下量了 16 节所有行间公式的实际宽度，栏宽是 721 像素。
  - 另有三个余量不到 5% 的也拆了：`trig-substitution:43`（718）、`trig-integrals:25`（709）、`partial-fractions:106`（690）。
  - 修订后最宽的是 666 像素。
- `parts-area.svg`：端点改成「x = a」「x = b」，alt 文字（`integration-by-parts:52`）跟着改。
  - 重新量过：不出界、不重叠、不压线，文字离线最近 3.95 像素。

### 规矩 C 另补 3 处（协调会话转来的，status 不动）

- `math/analysis/gamma-function/lesson.md:16`：标「分部积分」，英文括注原来就有。
- 同一节 `:41`：标「分部积分」，后面是「（见[分部积分法](…)）」，不另加英文。
- `math/vector-calculus/greens-theorem/lesson.md:45`：标「分部积分」，英文括注原来就有。

### 改了没报的

没有。另外临时动过 `.claude/launch.json`，加的是页面检查服务的条目，检查完已删。

### 检查

- `npm run content`：0 个错误，0 个警告。
- `npm test`：23 个文件，202 项全部通过。
- `npm run verify`：326 节全部一致。
- 我的核对脚本：89 项里 88 项一致。不一致的那项仍是 ∫₀^{100π}|sin x| 的数值误差，按周期分段算得 200。
- 检查脚本（16 节，含退回 written 的 4 节）：块内首次出现、英文括注、锚点句号、句数、行内公式等号个数都合规。剩下的有两类：
  - 4 处有意不标的「极限」，同交稿时；
  - `definite-integral`、`integral-properties`、`antiderivatives` 里原有的 3 处「黎曼和的极限」，和 3 处题目提示里一个行内公式三个以上等号（`definite-integral` 第 5、6 题，`antiderivatives` 第 2 题）。这些这次没动，没改。
- 层级：和开写前的快照比仍是 10 处（我们定的 9 处，加物理那边的 `two-body-problem`），多余前置 0 个。这次没有改前置。
- 页面：16 节在 768 像素宽下全部展开，`scrollWidth = clientWidth`，没有 KaTeX 报错。
- 临时网站副本、`.claude/launch.json` 里的临时条目都已删，服务已停。

### 协调会话另转的一处：动画说明里的「黑点」

- 起因：物理审核员查出，FunctionPlot 的点用文字色画，深色主题下是白点，说「黑点」不对。
- 都改成「圆点」，4 行共 6 处：
  - `area-between-curves:87`；
  - `substitution:86`；
  - `partial-fractions:81`（两处）；
  - `physical-applications:74`（两处）。
- 本领域别处没有「黑点」，这一批也没有别的说「黑」「白」的地方。改完 `npm run content` 0 个错误，0 个警告。

## 复核

审内容 agent · 2026-11-18。14 节和 `_domain.yaml` 和快照 `b20-snapshot/` 逐个比，`definite-integral`、`integral-properties` 和已提交的版本比，只看这一轮的改动。

**结论：通过。** 3 条小问题都改了，同类问题找得比报告里还多，新改动里没有要修的。16 节的 `status` 已改成 `reviewed`：本批 12 节，`antiderivatives`、`special-limits`、`definite-integral`、`integral-properties`。别的领域 13 个文件的 `status` 没动。

- **小问题 1**，逐条核过：
  - `trig-integrals:69` 改成「在$x=\pm\pi$（$\pi$的奇数倍）处没有定义」，对。
  - `trig-substitution:25` 按种分开说，对。
  - `arc-length:25` 改成「不会变短」。几何图像说明里的「总长一路增加」说的是等分成$N$段，不是加密分点；写稿员逐个算了$N=1,\dots,40$，我初审算的$N=1,3,10,40$也是递增的，接受不改。
  - `improper-unbounded:103` 去掉了「以后的」。补的$2\int_0^{+\infty}\frac{\dd t}{1+t^2}$对：令$x=t^2$，$\frac{2t\,\dd t}{t(1+t^2)}$，结果是$\pi$。
  - `polar-area` 没加前置，层级不动。`:40`、例 1 `:60`、例 2 `:74` 和第 3、4、6 题都补了求导验证，几个导数都对；`arc-length` 第 4 题也补了。
  - `integration-by-parts:54` 图注链到 `substitution#thm-substitution-definite`，第 7 题提示同样补了。
  - 倍数：`area-between-curves:121` 写出倍数$\frac{\sqrt{R^2+H^2}}H$，就是母线和高之比，对；`volumes` 第 8 题、`polar-area` 第 7 题也改成了「是……的倍数」。
- **小问题 2**：
  - 进表 4 条，术语表 110 → 114 条：保序性 `integral-monotonicity`，积分区间 `interval-of-integration`，积分上限、积分下限。简介准确，只用定义它的小节链上的概念。锚点 `def-definite-integral`、`thm-monotone-integral` 都落在起名的那一段。积分下限正文只在起名的句子里出现，和积分上限同句起名，一起进表，接受。
  - 补标对：`definite-integral:45` 标在起名的句子里，和同一句的积分变量做法一样；`integral-properties:44` 定理名、`:119` 误区；`improper-integrals:16`、`:48`、`:99`；`improper-unbounded:101`；`area-between-curves:54`、`:120`；`trig-integrals:69`、`:106`。每块第一次出现的扫描没有漏的。本领域别的小节只有 `fundamental-theorem` 的滑块标签「积分下限$a$」，标签不标。页面上这些词都显示成术语。
  - `improper-integrals:48` 的单调有界原理标了 `math.analysis.monotone-convergence-theorem`，和 `special-limits:50` 一致。
  - 写稿员另补的「分部积分」简称：`integration-by-parts:54`「分部积分公式」、`:74`、`:88`，对；别的小节正文里没有这个简称。
- **小问题 3**：
  - 拆成 `aligned` 的 3 个行间公式（`trig-integrals:48`、`volumes:80`、`polar-area:77`），加上另拆的 3 个（`trig-integrals:25`、`trig-substitution:42`、`partial-fractions:106`），式子都没变，只是分行。
  - `parts-area.svg` 改成「x = a」「x = b」，alt 文字跟着改。量过：不出界、不重叠、不压线，文字离线最近 5.4 像素。
- **「黑点」改「圆点」**：4 节 6 处，对。初审截图里，深色主题下这些点确实是白的。
- **别的领域 13 个文件**，只看改动，都对：
  - 拆节时的 6 个：前置和链接和确认的一致。
  - 极坐标 7 个：
    - `nonlinear-systems` 加前置 `polar-area`，`:41` 只括注英文，在链上不标；
    - `limit-cycles` 经它在链上，`:30` 只补括注，`:89`、`:98` 不标；
    - `greens-theorem` 的前置换成 `polar-double-integrals`，它的前置里有 `double-integrals`，`:76` 的$r\,\dd r\,\dd\theta$在链上了；
    - `jacobian:16`、`:25`、`:32`，`multivariable-chain-rule:16`，`multivariable-limits:65`、`:80`，`partial-derivatives:90` 标 `math.calculus.polar-coordinates`，每节第一次出现括注英文；`jacobian:81`、`multivariable-chain-rule:64` 是标题，不标。
  - 「分部积分」3 处：`gamma-function:16`、`:41`，`greens-theorem:45`，都标了。
  - 层级：`greens-theorem` 仍是第 15 层（`conservative-fields` 在第 14 层），`nonlinear-systems` 仍是第 19 层；全图多余前置 0 处。
  - 规矩 C 反扫（新进表 4 条，加「分部积分」简称）：链外没标的只剩 `functionals` 第 8 题的提示和参考解答里各一处，是题目文字，可标可不标；`fourier-convergence:23`、`parameter-integrals:27` 的积分区间在链上。
- **改了没报的**：没有。这一轮的每一处改动，修订说明里都有。
- **检查**：
  - `npm run content` 0 个错误、0 个警告（改 `status` 前后各跑一次）；
  - `npm run verify` 326 个小节全部一致，含这一批的 12 个验算脚本；
  - 页面：网站建在 scratchpad，服务的进度写临时 Git 仓库。在 768 像素宽下看了 16 节，每节点 32 下，`scrollWidth` 都等于 `clientWidth`，没有 KaTeX 报错，正文和题目卡片里都没有要横拖的公式。
- 收尾：停了服务，删了 `.claude/launch.json` 里临时加的条目、网站副本、临时进度仓库和快照 `b20-snapshot/`。

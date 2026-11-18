# 批次 22 审查报告：复分析（复数到古尔萨定理）

审内容 agent（和写内容 agent 是两个独立会话；它的汇报是审完以后才读的，只用来核对「改了没报的」）· 2026-11-18

审查范围：`math.complex-analysis` 的 9 节：`complex-numbers`、`complex-exponential`、`complex-roots`（新）、`complex-functions`、`complex-derivative`（新）、`contour-integrals`、`holomorphic`、`cauchy-theorem`、`goursat`（新），都是新写的；`proofPolicy: full`。包括 72 道题、5 个动画（2 个 `linear-map-2d`、3 个 `function-plot`）、4 张 SVG，`_domain.yaml` 新进表 30 条、新加宏 `\Arg`、`\Log`；挪到批次 23 的 `complex-logarithm`、`conformal-maps`、`cauchy-integral-formula` 三个大纲改的前置；多变量微积分 `jacobian/problems.yaml:135` 改的链接文字。

开审前把整个 `content/` 拷了快照（scratchpad 的 `b22-snapshot/`）；写完报告时又比了一次，复分析和 `jacobian` 审查期间没有变动。

## 结论

重要 0 条，小问题 3 条，原有问题 1 条。`goursat` 的前置照用户定的改法 1 改：加 `cauchy-theorem`（见「需要你决定的」）。

- 讲解、例题的推导和数都对。主线定理都在讲解里证完，合乎 `full`：
  - `holomorphic`「复可导 ⇔ 可微且满足柯西-黎曼方程」两个方向都完整，各自从局部线性近似出发，$f'=u_x+iv_x$；只满足方程不可微的反例 $u=\sqrt{|xy|}$、$v=0$ 也对。多变量微积分 `jacobian` 第 8 题等的就是它。
  - `cauchy-theorem` 定理里写明 $f'$ 连续，证明正好用在格林公式要的偏导数连续上；`goursat` 证三角形版（不假设 $f'$ 连续）、允许一个连续的例外点、圆盘里的原函数。`cauchy-integral-formula` 的大纲前置加了 `goursat`，下一批用它的圆盘版本证柯西积分公式、再推出 $f'$ 连续，不循环（要守住的一点见「调度员让特别看的几处」第 3 条）。
  - `goursat` 里三角形套出公共点那一步：取顶点 $p_n$，实部、虚部各自落进一列套着的闭区间，用两次闭区间套定理，再用闭三角形含它里面点列的极限。一维的定理用成二维的，没有跳步。
- 36 道简单题、中等题独立验算，全部和标准答案一致；36 道难题、思考题逐道读过，参考解答都对，难度档合适。9 道选择题（5 道多选），正确选项里 A 3 次、B 4 次、C 4 次、D 3 次，不偏。
- 前置：层级和调度员核的一致（新节 15、16、18 层，已写小节 0 变）；`goursat` 照改法 1 改完是 19 层。链外标记里，`complex-numbers:59` 的「极坐标」只是旁白；`complex-derivative` 的「可微」不只是旁白，见小问题 1。
- 篇幅：`minutes` 23–28；讲解加例题 780–1228 个汉字，`full` 要证完主线定理，比批次 21 多，分钟数估得合理。
- 页面：9 节在 768 像素宽下全部展开（每节点 32 下），`scrollWidth` 都等于 `clientWidth`，没有 KaTeX 报错，没有要横拖的地方，行间公式都在栏宽以内，定义卡片都以句号结束。4 张 SVG 的文字不出界、不重叠、不压线（文字和线最近 8.6 像素），图和替代文字、说明对得上；5 个动画截图看过，图例、颜色和说明一致。
- 下游都接得住：
  - 线性代数 `complex-eigenvalues:33`、`:40`、`:88`（乘 $a+bi$ 是 $\begin{pmatrix}a&-b\\b&a\end{pmatrix}$，先转 $\theta$ 再伸缩 $r$ 倍，辐角、模）；`hermitian-unitary:46`、第 7 题的 $e^{i\theta}$ 由 `complex-numbers#def-exponential-form` 接住。
  - 常微分方程 `constant-coefficients:32` 的欧拉公式、第 5 题的 $(e^{\lambda x})'=\lambda e^{\lambda x}$（$\lambda$ 是复数）由 `complex-exponential#thm-exp-derivative` 接住。
  - 数学分析 `exp-log-construction` 第 8 题提示链到「欧拉公式与复指数」，`power-series-theory` 的题链到「全纯函数的幂级数展开」，链接文字都和标题一致。
  - 多变量微积分 `jacobian` 第 8 题（链接文字已改成新标题）、`conservative-fields` 第 8 题（$\oint\frac{\dd z}z$ 是绕数乘 $2\pi i$，`cauchy-theorem:45` 写了并链回去）、`greens-theorem:30` 和第 6 题（偏导数连续、正向；圆环论证，`cauchy-theorem:43` 用的就是它）。
  - 代数基本定理只在 `complex-roots` 第 8 题当已知说出，注明证明在以后的「刘维尔定理与代数基本定理」，和线性代数 `eigenvalues:52`、单变量微积分 `partial-fractions:32` 的「这里不证」一致。
  - 振动与波这一批的 `phasors` 链到 `complex-exponential#thm-euler`、`#thm-exp-derivative` 和 `complex-numbers#thm-multiplication`、`#def-complex-plane`，锚点都在。

- **小问题 1：前置和链外的用法**（`plan.md:245`、`:244`）
  - `complex-derivative` 用到「可微」不止是旁白：
    - `:63` 讲可微「只要求有线性的近似，它可以把正方形变成随便什么平行四边形」，`:103` 的误区「$u$、$v$都可微，$f$就复可导」靠读者懂可微才能看懂反驳，第 8 题（2）也问「一般的可微映射」把正方形变成什么。
    - 这一节的链上只有 `multivariable-limits`。把它的前置换成 `differentiability`（`differentiability` 的链上已有 `multivariable-limits`），层级仍是 16；`holomorphic` 的前置随之只留 `complex-derivative`，否则 `differentiability` 成了多余前置，`holomorphic` 仍是 17 层，别的节不变。
    - 改了以后 `:63`、`:103` 的「可微」是链上的别的领域术语，去掉 `math.vector-calculus.differentiable` 的标记，留英文括注。
  - `goursat` 写成了 `cauchy-theorem` 的续篇，前置里却没有它（两节都在第 18 层，互不在对方链上）：
    - `:16` 从「柯西积分定理要求 $f'$ 连续，这是借用格林公式付出的代价」问起，`:63`、`:91` 拿柯西积分定理作比较；`:48` 的边界情况用 `cauchy-theorem#thm-deformation` 的结论；主定理（`:53`）、例 2（`:85`）、误区（`:92`）用的「原函数」在 `cauchy-theorem:49`–`:52` 起名。
    - `plan.md:244`：两节都用、又互不在对方链上的名词，起名放在两节共同的前置上；定理名同样按这一条。原函数的定义段能挪，柯西积分定理没有共同前置可放。
    - 用户定了改法 1：`goursat` 的前置改成 `[cauchy-theorem, nested-intervals]`（`contour-integrals`、`holomorphic` 都在 `cauchy-theorem` 的链上，留着就多余），`cauchy-integral-formula` 的前置去掉多余的 `cauchy-theorem`，改成 `[goursat, uniform-limit-theorems]`。上面几处就都在链上了，这几处正文不用改。两张新前置表都核过是最少的；`goursat` 的正文和题目里没有别的领域的术语标记，不用跟着去掉。
  - 链外的别的领域的词没按旁白标：
    - `complex-numbers:82` 的「泰勒级数」：这一节没有前置，标 `math.calculus.taylor-series` 并括注英文。
    - `cauchy-theorem:73` 例 1 的「拆成部分分式」：`partial-fractions` 不在链上。分解式本身通分就能验证，改成「拆成两项之差」，或者标单变量的 id 当旁白。
    - `contour-integrals` 第 7 题参考解答（`problems.yaml:135`）说两个场「都是保守场」，用的是链外 `conservative-fields` 的结论，照「题目文字里用到前置链外的结论时，加链接注明出处」（`plan.md:1537`）补链接。
  - 第一次出现没有英文（`plan.md:242`）：
    - `goursat:16` 的「格林公式」：加了前置以后 `greens-theorem` 在链上，不标，只括注（Green's theorem）。同一句里的链接文字「柯西积分定理」当名词用，也是这一节第一次出现，英文却在 `:63`，挪到 `:16`；这一块要标的话，照 `plan.md:244` 在链接前写出这个词再标，或者直接改成标记。
    - 「复对数」：`complex-numbers:59`「以后[复对数](…)的主值」的链接文字在句子里当名词用，`cauchy-theorem:59`「以后讲复对数时」是普通文字，都补括注（complex logarithm）。

- **小问题 2：几处说法不准或说过头**
  - `_domain.yaml:257` 柯西积分定理的简介没写「$f'$连续」，可这一节证的定理要它；浮窗在 `goursat` 里也看得到，和那一节「格林公式版要 $f'$ 连续」对不上。补一句「（这里要求 $f'$ 连续，以后去掉）」，字数够。
  - `cauchy-theorem:95` 误区「沿闭曲线的复积分总是 $0$」的反驳写「要 $f$ 在曲线围成的部分里也处处全纯」，像是在说必要条件；可本节 `:59` 就有 $\oint\frac{\dd z}{z^2}=0$，第 7 题参考解答也说「条件不满足时，积分可能是 $0$，也可能不是」。改成「柯西积分定理要 $f$ 在曲线围成的部分里也处处全纯；不满足时，比如……」（`plan.md:302`「误区的反驳本身也不能说过头」）。
  - `complex-functions:64`「三行里……都交成直角……这是因为这几个函数都能求导」：保角还要导数不为 $0$（`complex-derivative:105` 的误区正讲这件事，$z^2$ 在 $0$ 处夹角加倍）。图里 $z^2$ 的网格在第一象限、$\frac1z$ 的网格不过原点，交点处导数都不为 $0$，改成「能求导，并且导数不为 $0$」就严了。
  - `complex-exponential:52`「两种定义给出同一个函数，证明要用两个级数相乘，见数学分析[用幂级数定义指数函数与对数](…#def-exp)第 8 题」：那道题是比较几种定义的思考题，只说幂级数的定义「还能原样推广到复数」，没有这个证明。改成指向那一节用柯西乘积证加法公式的定理（`exp-log-construction#thm-exp-addition`），说同样的证明对复数也成立。

- **小问题 3：术语表和图的说明**
  - 两节以上用到的名词（`plan.md:244`）：
    - 开圆盘：`complex-derivative:23` 起名（定义段里，有英文），`holomorphic:41` 的全纯定义「在以 $z_0$ 为圆心的某个开圆盘里全纯」、`goursat:53` 的定理、`:87` 都用。进表，定义在 `complex-derivative#def-open-set`，`holomorphic`、`goursat` 各块第一次出现的地方补标。
    - 纯虚数：`complex-numbers:23` 起名，`complex-derivative:39` 也用。这个领域的高中词（复数、实部、共轭复数、模……）都照样进表，纯虚数照同一尺度进表；实轴、虚轴（`complex-numbers:37` 起名，四五节都用）也一样，要当不进表的基础词，就写一句理由。
  - 两个 `linear-map-2d` 的说明按颜色指箭头：`complex-numbers:107`「绿色箭头是 $1$ 的像……橙色箭头是 $i$ 的像」，`holomorphic:84`「绿色箭头是 $(u_x,v_x)$，橙色箭头是 $(u_y,v_y)$」。组件说明（`plan.md:1927`）要「正文按图例名指，不写颜色」，别的领域用这个组件的各节都这样写（例如线性代数 `linear-maps:106`）。改成按图例名说「e₁ 的像」（就是 $1$ 的像，也就是 $w$）、「e₂ 的像」「单位圆的像」；`holomorphic:84` 正方形翻面变色那句写成「换一种颜色」。

- **原有问题：常微分方程 `series-solutions:32` 的链接文字**
  - 「复数的零点（见[复数](lesson:math.complex-analysis.complex-numbers)）」是只当节名用的「见某节」，文字应当是标题「复数与复平面」。批次 7 写的，`complex-numbers` 的标题在这一批以前就是「复数与复平面」，这一批没动它；下次改到那一节时顺手改。

## 改了没报的

没有。9 节、`_domain.yaml` 的 30 条和两个宏、4 张 SVG、三个大纲的前置、`jacobian` 的一行都和汇报一致。

工作区里还有别的会话的改动，提交这一批时别带上：
- `progress/lessons.yaml`；
- `docs/cs-plan.md`（计算机扩展方案）；
- 振动与波这一批在写的 `content/physics/oscillations-waves/` 和常微分方程 `undetermined-coefficients/lesson.md`（补标「拍」）。

## 要修的，按小节分

- `complex-derivative`：前置换成 `differentiability`，`:63`、`:103` 去掉别的领域的标记（小 1）；开圆盘进表（小 3）。
- `holomorphic`：前置只留 `complex-derivative`（小 1）；开圆盘补标（小 3）；`:84` 说明（小 3）。
- `cauchy-theorem`：`:73` 部分分式、`:59` 复对数的英文（小 1）；`:95`（小 2）。
- `goursat`：前置改成 `[cauchy-theorem, nested-intervals]`，`:16` 格林公式、柯西积分定理的英文（小 1）；开圆盘补标（小 3）。
- `cauchy-integral-formula`（大纲）：前置改成 `[goursat, uniform-limit-theorems]`（小 1）。
- `complex-numbers`：`:82` 泰勒级数、`:59` 复对数的英文（小 1）；`:107` 说明（小 3）。
- `complex-functions`：`:64`（小 2）。
- `complex-exponential`：`:52`（小 2）。
- `contour-integrals`：第 7 题参考解答的链接（小 1）。
- `_domain.yaml`：柯西积分定理的简介（小 2）；开圆盘、纯虚数（实轴、虚轴）进表（小 3）。
- `complex-roots`：无。

## 需要你决定的

无。原来这里的一条，用户 2026-11-18 选了「加前置（改法 1）」，留作记录：

1. `goursat` 要不要接在 `cauchy-theorem` 后面（小问题 1 的一部分）
   - 改法 1（选了这个）：`goursat` 的前置改成 `[cauchy-theorem, nested-intervals]`（`contour-integrals`、`holomorphic` 都在 `cauchy-theorem` 的链上，留着就多余），`cauchy-integral-formula` 的前置相应去掉多余的 `cauchy-theorem`。原函数、`:48`、柯西积分定理、格林公式就都在链上了，正文只补 `:16` 的英文括注。代价：`goursat` 从第 18 层到第 19 层，下游 14 个大纲（`cauchy-integral-formula` 到 `jordan-lemma`）各加 1 层，别的领域 0 节变化（scratchpad 的脚本按整张图算的）。
   - 改法 2（没选）：保持并列。原函数的定义段挪到 `holomorphic`（定义要用全纯函数），`:48` 照 `:93` 改写（例外点不要求连续的话，单位圆盘里 $\frac1z$ 就有原函数，沿单位圆的积分该是 $0$，可它是 $2\pi i$），格林公式按旁白标。可 `:16`、`:63`、`:91` 的柯西积分定理没有共同前置可放，只能改写成不提它，而这一节开头的问题就是从它来的。
   - 推荐改法 1 的理由：这一节本来就写成 `cauchy-theorem` 的续篇，一条前置把原函数、`:48`、柯西积分定理、格林公式几处一起理顺；也不会循环，`goursat` 的证明没用 `cauchy-theorem` 的结论，`:48` 只是边界情况里的例子。
   - 能撤回：前置是一行，这一批还没提交。

## 调度员让特别看的几处

1. 链外标记是不是只当旁白：`complex-numbers:59` 的「极坐标」是（「这和极坐标是一回事」，推理没用它）；`complex-derivative:63`、`:103` 的「可微」不是，见小问题 1，加 `differentiability` 为前置，层级不变。
2. `holomorphic` 的等价两个方向：都完整，见结论第一条。
3. `cauchy-theorem` 写明 $f'$ 连续、`goursat` 证三角形版：都做到了；下一批 `cauchy-integral-formula` 已加 `goursat` 为前置，合起来不循环。下一批写的时候要守住一点：对一般的全纯函数只用 `goursat` 的圆盘版本，`cauchy-theorem` 的两个定理只用在 $f'$ 明显连续的函数上（如 $\frac1{\zeta-z}$）。`goursat` 照用户定的接在 `cauchy-theorem` 后面以后，这一点不变：`goursat` 的证明本来就没用 `cauchy-theorem` 的结论。
4. `complex-exponential` 讲了复指数对实变量的求导和积分（`thm-exp-derivative`，连同复值函数的定义和牛顿-莱布尼茨公式）；`complex-numbers` 引进了 $e^{i\theta}$ 记号（`def-exponential-form`）。下游两处都接得住。

## 写稿员「我替你定的」5 条

1. 别的领域的「开集」「区域」不补标：同意。本领域的这两条是在复平面上按开圆盘定义的；别的领域的「区域」多是积分区域、捕获区域这类普通用词，`conservative-fields:35` 在括号里自己说了什么叫区域，那里的「开集」是平面、空间里的。我的反向扫描结果一样。
2. 「原函数」两个领域各标各的 id：同意（同一概念各自定义，`plan.md:245`）。本领域这一条起名在 `cauchy-theorem`，`goursat` 加了这个前置以后就接上了。
3. function-plot 画圆用 `sqrt(max(0, …)) + 0*sqrt(1.01 - abs(x))`：同意，页面上圆闭合，横轴上多出的 $0.01$ 看不出来。
4. `goursat` 第 2 题换选项顺序（正确答案从 B 变成 A）：同意，换完各字母分布均匀；这一批没提交过，不算改题号。
5. `local-square.svg` 的 $w_0$ 不在右面板正中：同意。两个面板刻度相同，看过页面，弯曲的网格和虚线正方形都在框里，虚轴也离开了边框。

## 跨领域的几处

- 规矩 C 反方向我自己扫了一遍：新进表的 30 条，加上别名和别写法（复可导、共轭、全纯、柯西定理、棣莫佛）；别的术语表里更长的词（单连通区域、共轭转置、共轭点等）先遮掉。
  - 链外、在正文、批次 4 以后写的、意思相同的：0 处，和写稿员、你的结论一样。
  - 扫出来的都不用补：「区域」「模」「原函数」是普通用词或实函数的原函数；「三角不等式」是实数或向量的；「共轭」在 `partial-fractions:32` 是共轭复数（高中词），在分析力学是正则共轭；「复数」「复平面」是基础词；其余在题目文字里。
  - `ac-circuits:35`、`jones-calculus:22` 第一次出现的「辐角」缺英文括注：照用户定的，下次改到时补。
- 规矩 C 正方向（这 9 节借别的领域的词）：链上的都没标、括注了英文；链外没标的见小问题 1。

## 细节

- 读题：`npm run statements -- <9 节> --tier easy,medium`；验算脚本比对通过以后才读 `problems.yaml`。
- 脚本：9 个 `tools/verify/math.complex-analysis.<小节>.ts`，共用批次 22 开审前加的 `math.complex-analysis._complex.ts`。
  - 方法尽量不走讲解的路：
    - 乘法用模和辐角算，不用 $(ac-bd)+(ad+bc)i$；旋转用 $2\times2$ 旋转矩阵，不乘 $i$。
    - $e^z$ 直接加级数 $\sum\frac{z^n}{n!}$，不用 $e^x(\cos y+i\sin y)$；$\sin z$、$\cos z$ 按 $e^{iz}$ 的定义算，不用双曲函数的公式。
    - 方根、平方根用同时迭代求多项式的根，不用棣莫弗公式、不解实部虚部的方程组；整数次幂一个一个乘。
    - 复积分按定义在折线上求和再外推，不用参数的导数、不用原函数和柯西积分定理；和路径无关的题沿两条路各算一遍。
    - 导数用小圆上的柯西积分，或者按定义看 12 个方向的差商；柯西-黎曼方程用数值偏导数；$a$、$b$ 这类待定系数由残差的线性方程组解出。
    - 「哪些集合是区域」：边界上取坐标能精确表示的点，属于集合就不是开集；网格上连边（沿边不穿过边界曲线）数连通块，先拿闭圆盘、$\{\Re z\ne0\}$、去掉原点的平面检验判法。
  - 结果 36 道全部一致；`npm run verify` 355 节全部一致（含别的会话这一批的脚本），`npm run typecheck` 通过；仓库 `npm run content` 0 错 0 警。
- 引文：「第 N 题」「例 N」逐个对过。本领域 `holomorphic:52`、`goursat:46` 的第 5 题，`contour-integrals:45` 的第 3 题，各节正文里的「例 N」；别的领域 `cauchy-theorem:43` 的 `greens-theorem` 第 6 题、`:45` 的 `conservative-fields` 第 8 题，都指对了；`complex-exponential:52` 见小问题 2。
- 数：正文、例题、提示、参考解答里写出的数都核过，例如 $\int_0^\pi e^{2t}\cos3t\,\dd t\approx-82.54$，$\cos z=2$ 的解 $2k\pi\pm1.317i$，$|\sin3i|\approx10.02$，$\frac{\sin z}z$ 在 $0$ 处的极限，$\cos\frac{2\pi}5=\frac{\sqrt5-1}4$，$\oint_{\partial T}\bar z\,\dd z=i$，$\int_Cze^{z^2}\,\dd z\approx-0.708+0.455i$。
- 术语：分块标记、第一次出现括注英文、起名段落的锚点、链外标记、链接文字都用脚本扫过；报出的「模」是「一模一样」里的字面。
- 页面：网站从仓库建到 scratchpad（`vite build --outDir`），服务进度写临时 Git 仓库（端口 3149）；`.claude/launch.json` 临时加的条目已删，服务已停，网站和临时仓库已删。快照 `b22-snapshot/` 留着，复核完删。

## 修订说明（写内容会话）

小问题 3 条全部照改，没有不修的；「需要你决定的」照调度员定的改法 1。同一类问题全批找了一遍，另外改了的写在各条下面。原有问题（`series-solutions:32`）照调度员定的，下次改到那一节时顺手改，这一批不动。

### 前置（改法 1，连同小问题 1 的前置）

- `goursat`：`[contour-integrals, holomorphic, nested-intervals]` 改成 `[cauchy-theorem, nested-intervals]`。
- `cauchy-integral-formula`（大纲）：去掉多余的 `cauchy-theorem`，成 `[goursat, uniform-limit-theorems]`。
- `complex-derivative`：`multivariable-limits` 换成 `differentiability`；`holomorphic` 只留 `[complex-derivative]`。
- 整张图重算（scratchpad 的脚本，和 HEAD 比）：`goursat` 19 层，`complex-derivative` 仍 16、`holomorphic` 仍 17；`cauchy-integral-formula` 到 `jordan-lemma` 14 个大纲各加 1 层；别的领域 0 节变化，多余前置 0 处，和调度员算的一致。
- 改法 1 以后，`goursat` 用到的原函数、`:48` 的变形积分路径、柯西积分定理、格林公式都在链上，正文只补了 `:16` 格林公式的英文（见下）。

### 小问题 1：前置和链外的用法

- `complex-derivative:63`、`:103` 的「可微」：去掉 `math.vector-calculus.differentiable` 的标记，`:63` 留英文括注（differentiable）。
- `goursat:16`「格林公式」：补（Green's theorem）。`:39`、`:91` 在链上，不标。
- `complex-numbers:82`「泰勒级数」：标 `math.calculus.taylor-series`，括注（Taylor series）。
- `cauchy-theorem:73` 例 1「拆成部分分式」：改成「拆成两项之差」。
- 「复对数」：`complex-numbers:59` 的链接后面、`cauchy-theorem:59` 都补（complex logarithm）。
- `contour-integrals` 第 7 题参考解答：「保守场」后面加「见[保守场与路径无关](lesson:math.vector-calculus.conservative-fields#def-conservative)」，和路径无关正是那里保守场的定义；「柯西积分定理一节会看到」也改成链接。
- 同类全批找过（scratchpad 的 `scan-fwd2-b22.mjs`：别的领域的术语按改过的前置算链，同名术语只要有一条在链上就算链上，跳过 plan 列的基础词）。
  - 链外没标的，另改了一处：`complex-exponential:16`、`:88` 的「常微分方程」是旁白，标 `math.ode.ode`，第一处括注（ordinary differential equation）。
  - 链上、全节第一次没括注英文的，另补了 19 处：
    - `complex-exponential` 的部分和、可积、差商；`complex-derivative` 的差商、极限的四则运算法则（limit laws）；
    - `contour-integrals` 的定积分、切向量、被积函数；`holomorphic` 的偏导数、差商、余项、幂级数；
    - `cauchy-theorem` 的正向、偏导数、被积函数、定积分；`goursat` 的余项、分段光滑、上界。
  - 题目里用到链外结论、只写了节名没加链接的，另改了 4 处：`complex-exponential` 第 8 题（以后在复积分一节证明的不等式，链到 `contour-integrals#thm-integral-modulus`），`complex-functions` 第 8 题、`complex-roots` 第 8 题（刘维尔定理，链到 `liouville`），`goursat` 第 8 题（链到 `cauchy-integral-formula`）。
  - 题目里用了链外的词，改写掉了 3 处：
    - `cauchy-theorem` 第 3 题提示 1 的「部分分式」：改成「写成$\frac Az+\frac B{z-2}$，通分以后比较分子」。
    - `holomorphic` 第 6 题提示和参考解答的「系数行列式」（`determinant` 不在链上）：改成两式各乘$u$、$v$相加的消元。
    - `holomorphic` 第 7 题参考解答的「线性变换」：改成和正文一样的「线性近似」。
  - 扫到但不改的：
    - 「线性近似」（`complex-derivative:63`、`:67`，`holomorphic:36`、`:84`）：定义它的单变量 `differentials` 不在链上，可这几处都在描述当场写出来的式子（$f(z_0)+f'(z_0)h$、$(h_1,h_2)\mapsto(u_xh_1+u_yh_2,\ v_xh_1+v_yh_2)$），和已审的多变量微积分 `differentiability` 的用法一样，那里也不标。
    - 「级数」在 `complex-exponential` 第一次出现在「复数项级数（complex series）」里，英文已经带着 series，不另括注。
    - 只当节名用的链接（「见[用幂级数定义指数函数与对数]」「由[保守场与路径无关]第 8 题」「[全纯函数的幂级数展开]一节」「[共形映射]一节」「[柯西积分公式]两节」）照规矩不算出现。
    - 导数、可导、长度、夹角、平行、闭曲线是 plan 列的基础词；极限、连续和导数同一档，也当基础词，不括注。

### 小问题 2：几处说法不准或说过头

- `_domain.yaml` 柯西积分定理的简介：补「（这里要求$f'$连续，以后去掉）」。
- `cauchy-theorem:95`：改成「柯西积分定理要$f$在曲线围成的部分里也处处全纯；不满足时积分可能不是$0$，比如$\oint_{|z|=1}\frac{\dd z}z=2\pi i$，也可能仍是$0$，比如$\oint_{|z|=1}\frac{\dd z}{z^2}=0$」。
- `complex-functions:64`：改成「都能求导，并且导数在这些交点处都不为$0$」。
- `complex-exponential:52`：改指 `exp-log-construction#thm-exp-addition`。那一节把两个级数相乘，证了实数的$\exp(x+y)=\exp x\cdot\exp y$；正文写成「同样的证明对复数也成立，再用欧拉公式就得到级数的和是$e^x(\cos y+i\sin y)$」。
- 同类全批找过：27 条误区逐条读了，30 条简介逐条和正文对过，跨领域链接逐个看了指向。另改了 4 处：
  - `complex-derivative` 误区 2「要从所有方向趋近，极限都存在而且相同」：只看直线方向不够，改成「复可导要求$h$不管沿什么路线趋于$0$，差商都趋于同一个数」。同一个意思的 `summary`（「$h$从各个方向趋于$0$」）和复导数的简介（「从任何方向趋于$0$都得有同一个极限」）一起改了。讲解里「沿每个方向的极限都得相同」说的是必要条件，没改。
  - `complex-roots` 误区 2「$(e^{i\theta})^n=e^{in\theta}$只对整数$n$成立」：$n$不是整数时这个式子还没有意思，说「只对整数成立」过头，改成「只对整数$n$证过，$n$不是整数时不能照搬」。
  - `goursat` 误区 3「例外点上$f$的值无所谓」：一点处的值本来就不影响积分，要紧的是例外点附近。改成「例外点处$f$怎样都行」，反驳改成「定理要求$f$在例外点连续，只在别处全纯不够：……」。`:48` 边界情况的「例外点上$f$必须连续」同样改成「定理要求例外点上$f$连续，这个条件不能干脆去掉」。
  - 原函数的简介在公式里写了汉字（$F$在终点、起点的值写成了 `\text{}`），改成文字「等于$F$在终点的值减去在起点的值」。

### 小问题 3：术语表和图的说明

- 进表 4 条，本领域从 30 条变成 34 条：
  - 纯虚数 `purely-imaginary`，定义在 `complex-numbers#def-complex-number`；
  - 实轴 `real-axis`、虚轴 `imaginary-axis`，定义在 `complex-numbers#def-complex-plane`，照「高中词都进表」的尺度进表；
  - 开圆盘 `open-disc`，定义在 `complex-derivative#def-open-set`。
- 补标 25 处：各块第一次出现都标了，每节第一次括注英文，分在 6 节里（`complex-numbers` 7、`complex-functions` 3、`complex-derivative` 8、`contour-integrals` 1、`holomorphic` 4、`goursat` 2）。
  - 「正实轴」「负实轴」照「正电荷之于电荷」整个词标成实轴；实轴的简介里写了它们是实轴在原点两侧的两半。
  - 起名的定义段（`complex-numbers:23`、`:37`，`complex-derivative:23`）里，被起名的词本身标上。
- 两个 `linear-map-2d` 的说明改成按图例名指、不写颜色：
  - `complex-numbers:107`：「e₁ 的像」那支是$1$的像，也就是$w$，「e₂ 的像」是$iw$，「单位圆的像」是虚线画的单位圆乘以$w$。
  - `holomorphic:84`：两支箭头按图例名指，正方形翻面那句写成「换一种颜色」。
  - 同类找过：这一批只有这两处用 `linear-map-2d`。3 个 function-plot 的说明照已审各节的做法按颜色指曲线（plan 里「不写颜色」只写在 `LinearMap2D` 的 `basis` 一条），没改。

### 原有问题

- `series-solutions:32` 的链接文字：照调度员定的，下次改到那一节时顺手改，这一批不动。

### 检查

- 仓库 `npm run content`：0 个错误，0 个警告。
- `npm run typecheck`：通过。
- `npm run verify`：复分析 9 节 36 道全部一致。全仓库只有振动与波 `phasors` 第 4 题不一致（算得 6，标准答案 5.2915…），那一节是别的会话这一批在写、还没提交的，和这次修订无关。
  - 照 plan 的办法，用临时副本（HEAD 加上这一批的改动和复分析的 10 个验算脚本）再跑：content 0 个错误、0 个警告，verify 全部一致（353 个小节）。
- 写内容会话的自查脚本：
  - `lint-b22.mjs`（分块标记、英文括注、段落句数、行内公式等号、公式里没有汉字）：只剩 2 条有意不标的别名提示；
  - `complete-b22.mjs`：9 节完整；`verify-b22.mjs`：61 项一致；`cjk-math.mjs`：本领域 36 个文件的公式里没有汉字。
- 页面：临时副本、进度写临时目录的服务，768 像素宽，9 节全部重看。
  - 都是 `scrollWidth = clientWidth`，KaTeX 没有报错，题目全部展开，行间公式最宽 591 像素。
  - 4 张 SVG 的文字不出界、不重叠、不压线；两段动画说明里没有颜色词；`goursat` 页控制台没有报错。
- 临时副本、进度目录已删，`.claude/launch.json` 里临时加的条目已删，服务已停。
- 这次修订改的 18 个文件，都没提交：
  - `_domain.yaml`；
  - 9 节的 `lesson.md`，加上 `cauchy-integral-formula/lesson.md`（只改前置）；
  - `complex-exponential`、`complex-roots`、`complex-functions`、`contour-integrals`、`holomorphic`、`cauchy-theorem`、`goursat` 的 `problems.yaml`。

## 复核

审内容 agent · 2026-11-18。只看这一轮的改动：和快照 `b22-snapshot/` 比，复分析改了 18 个文件（`_domain.yaml`，9 节和 `cauchy-integral-formula` 的 `lesson.md`，7 个 `problems.yaml`），和修订说明列的一致。

通过。重要 0 条；遗留小问题 3 处，都是补一个括注或一个短语，见最后一节，改完不用再复核。9 节的 `status` 已改成 `reviewed`。

### 逐条核对

- 前置（改法 1，连同小问题 1 的两条）：4 节的前置和修订说明一致。按整张图和 HEAD 比：
  - 层级变了的 19 节全在复分析，9 节依次是第 0、14、15、15、16、16、17、18、19 层；
  - 别的领域 0 节变化，全站多余前置 0 处，和调度员、写稿员算的一致；
  - `goursat` 新到链上的节里，没有它标过的别的领域术语，不用跟着去掉标记。
- 小问题 1：
  - 报的几处都照改了：`complex-derivative:63`、`:103` 去掉标记、`:63` 留英文；`goursat:16` 格林公式补了英文；`complex-numbers:82` 泰勒级数；`cauchy-theorem:73`；复对数两处。
  - `contour-integrals` 第 7 题的两个链接：`conservative-fields#def-conservative` 正是把保守场定义成曲线积分和路径无关，指得对。
  - 同类另改的逐处看过：常微分方程两处标记，19 处英文括注，4 处题目链接，3 处改写。括注都在全节第一次出现的地方，标记都在各块第一次出现的地方。
  - `holomorphic` 第 6 题新的消元，两步都核过：第一式乘 $u$、第二式乘 $v$ 相加得 $(u^2+v^2)u_x=0$；第一式乘 $-v$、第二式乘 $u$ 相加得 $(u^2+v^2)u_y=0$。
- 小问题 2：
  - 4 处都照改了。`cauchy-theorem:95` 的反驳两种情形都举了例子。`complex-exponential:52` 改指 `thm-exp-addition`，「再用欧拉公式」那一步对：$\exp(x+iy)=\exp x\cdot\exp(iy)$，后一个由本节的欧拉公式是 $\cos y+i\sin y$。
  - 另改的 4 处也对：`complex-derivative` 误区 2、`summary` 和复导数简介都改成不管怎样趋于 $0$，讲解 `:39` 的「沿每个方向」说的是必要条件，留着对；`complex-roots` 误区 2、`goursat` 误区 3 和 `:48` 不再说过头；原函数简介去掉了公式里的汉字。
- 小问题 3：
  - 进表 4 条，本领域 34 条。起名的段落和锚点对得上，简介只用定义它的那一节链上的概念。
  - 补标 25 处，分节数和修订说明一致。页面上这 25 个都渲染成术语，点「正实轴」弹出实轴的卡片。重跑分块标记、英文括注的扫描，没有漏的。
  - 两段 `linear-map-2d` 说明按图例名指，页面上的图例正是「e₁ 的像」「e₂ 的像」「单位圆的像」（`holomorphic` 只有前两个）。
- 反向扫描新进表的 4 条：
  - 纯虚数、实轴、虚轴是高中的词，照 `plan.md:1515` 复数、复平面的尺度，别的领域不补标（线性代数 `hermitian-unitary`、常微分方程 `nonlinear-systems`、电磁学 `dispersion` 里都是这个用法）。
  - 开圆盘在多变量微积分 `extrema:41`、`:71` 和数学分析 `extreme-value` 的题目里，说的是 $\R^2$ 的开圆盘，照写稿员第 1 条（开集、区域）的理由不补。那边英文写 open disk，本领域写 open disc，两种拼法都通行，不改。
- 改了没报的：没有。这期间工作区里常微分方程 `undetermined-coefficients/problems.yaml` 和振动与波各节也改了，是振动与波那一批的，不在这一批里。

### 遗留小问题（不影响通过，提交前顺手改）

1. `goursat:16` 的「柯西积分定理」：上一轮小问题 1 里写了，修订说明没提到。链接文字在句子里当名词用，是这一节第一次出现（`plan.md:244`），英文（Cauchy's integral theorem）却在 `:63`，挪到 `:16`。
2. `complex-functions` 第 8 题参考解答这一轮新加的「[刘维尔定理](lesson:math.complex-analysis.liouville)说」：链接文字当名词用，和标题「刘维尔定理与代数基本定理」不同，是题目文字里第一次出现的新名词，补（Liouville's theorem）（`plan.md:242`）。
3. `cauchy-theorem` 的 `summary`「$f$在闭曲线$C$上和$C$内全纯，则$\oint_Cf\,\dd z=0$」：和这一轮已改的简介是同一类，这一节证的定理要 $f'$ 连续，补「、$f'$连续」或同样的括注。

### 检查

- `npm run content`：0 个错误，0 个警告；`npm run typecheck`：通过；`npm run verify`：全部一致（363 个小节，含复分析 9 节 36 道）。改完 `status` 以后三项又各跑了一次。
- 页面：网站建到 scratchpad，服务进度写临时 Git 仓库（端口 3149），768 像素宽，9 节各点 32 下全部展开。
  - `scrollWidth` 都等于 `clientWidth`，KaTeX 没有报错，行间公式都在栏宽以内，定义卡片都以句号结束。
  - SVG 文字不出界、不重叠，文字和线最近 8.6 像素；`goursat` 页控制台没有报错。
- 收尾：服务已停，`.claude/launch.json` 里临时加的条目已删，网站和临时仓库已删，快照 `b22-snapshot/` 已删。没有提交。

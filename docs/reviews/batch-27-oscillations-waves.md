# 批次 27 审查报告：振动与波（波包与群速度、拨弦的位置与音色）

审内容 agent · 2026-11-25。和写内容 agent 是两个独立会话。这一批先由 2 位逐节审查员各审一节（读题只用 `npm run statements`，验算完才读 `problems.yaml`，不读设计稿和写稿员汇报），我汇总：先做领域层面的检查，再过一遍逐节结论，最后用写稿员汇报找「改了没报的」、看「我替你定的」和「拿不准的」。汇报的前三节（各节写了什么、全批一致、同领域补标）我在等页面检查时先看到了；领域层面的数都是自己重算的，没有照抄。

审查范围：
- 新写的 2 节、16 道题，`proofPolicy: sketch`：`group-velocity`「波包与群速度」（第 21 层）、`plucked-string`「拨弦的位置与音色」（第 22 层）。写完这一批，振动与波 23 节里 22 节有正文，剩 `membrane-modes`（批次 28）。
- 1 张 SVG（`plucked-string/pluck-nodes.svg`）、2 个 `function-plot`、6 个锚点；振动与波术语表 64 → 68 条，宏没有改。
- 退回 `written` 的 2 节，只看这一轮的改动：本领域 `dispersion-relations:89`（补标「波包」），电磁学 `dispersion` 第 8 题（安排 plan.md:2594 交给这个领域收尾改的）。
- 跨领域补标：写代码的会话起的 agent 改了别的领域 3 个文件、7 处标记，`status` 都不动，逐处复核。
- 写代码的会话开写前改的大纲（`ce52659`）：`group-velocity` 加前置 `superposition-beats`，`membrane-modes` 改题「鼓面的振动」，和安排一致。
- 快照：写代码的会话开审前拍了 `b27/run-po/snapshot-oscillations-waves/`（02:58，整个 `content/` 和 `tools/`，已经带着跨领域补标）。写报告时（03:43）和工作区比过，`content/physics/oscillations-waves/`、`content/physics/electromagnetism/`、`content/math/ode/` 一个字节都没变。

## 结论

重要 0 条，小问题 10 条。

- 讲解、例题：推导和数都对，主线定理都给了证明思路，深度合乎 `sketch`。毛病是条件少写一两个、措辞不严、例题少答一个数。
  - `group-velocity`：两列波的和差化积，$\tilde A(k)=\frac1{2\pi}\hat f(-k)$的正负号（那里的$\xi$是这里的$-k$），包络以群速度平移的定理和误差界（逐节审查员在$t=0.5$、$1$、$2$、$4\,\mathrm s$数值核过，最大误差都小于界），展宽的时间尺度$\frac{w^2}{2\lvert\omega''\rvert}$，$\int\lvert\tilde y\rvert^2\dd x=2\pi\int\lvert\tilde A\rvert^2\dd k$，一维链的$v\cos\frac{ka}2$和$0.827$，都核过。没写「群速度总小于$c$」，没把展宽说成「有色散就有」。
  - `plucked-string`：$A_n=\frac{2h\ell^2}{n^2\pi^2d(\ell-d)}\sin\frac{n\pi d}\ell$对 4 个$d$、4 个$n$数值积分核过；$0.40$、$0.18$、$\frac19$、$\frac1{25}$、约$10.3\,\mathrm{ms}$，靠边拨的$\frac{2h\ell}{n\pi(\ell-d)}$，都对。音色的定义和简介照安排的原话。
- 题目：
  - 8 道简单题、中等题，2 个验算脚本独立算（不走讲解的公式，两三套算法互相核），全部和标准答案对上；`npm run verify` 全站 471 节全部一致。
  - 8 道难题、思考题的推导和结论都对，难度档合适，第 3 级提示都写成了完整解答；我另外抽了 6 道用数值复算（见「细节」）。说过头的一处、参考解答口径不一的一处见小问题 6、10，题干少写条件的两处见小问题 7。思考题的主要结论讲解里没有先说。
  - 选择题 2 道：`group-velocity` 第 2 题 A、D、E，`plucked-string` 第 2 题 B、C、D；这一批 A 1、B 1、C 1、D 2、E 1，全领域 22 道第 2 题 A 11、B 11、C 11、D 11、E 12，不偏。
- 前置和层级：`group-velocity` 21、`plucked-string` 22、`membrane-modes` 22，量子力学 `uncertainty-wave-packets` 27、`free-particle` 28，和安排一致；`levels.mjs --domain physics.oscillations-waves` 层级变动 0 节，多余前置改前 0、改后 0。两节的链（110 节、120 节）对过讲解、例题、题目用到的概念，都在链上；链外的只作旁白或在题目里写明出处、加了链接。改过的电磁学 `dispersion` 第 8 题新带进一个链外的词，没有链接，见小问题 9。
- 篇幅：`minutes` 30、26，全节汉字 1539、1349（不数 5 个二级标题），每分钟 51.3、51.9；本领域已审的节 46.1–51.8。都不超过 30。`group-velocity` 照小问题改完约 1553 字（上限 1560），`plucked-string` 改完 1351 字（26 分钟的上限 1352），改完重数。
- 页面：自己跑了两遍页面检查（深色、浅色各一遍），2 节新写、`dispersion-relations`、电磁学 `dispersion` 和跨领域改过的 `waveguides`、`undetermined-coefficients`，6 页在 768 像素宽下全部展开（每页点 32 下）：隔离副本构建 0 个错误、0 个警告，页面都是 768/768，行间公式要拖 0 处（最宽 728），KaTeX 报错 0，占位框 0，定义卡片都以句号结束，SVG 2 张、问题 0。两个动画的滑块另在页面上拖过（写稿员没拖），都重绘、没有报错，说的和图上一致。
- 下游接住：安排 plan.md:2591–2599 列给两节的各条，逐节审查员逐条打开原文对过，我抽查了其中的引文，都接住了。没做完的只有规矩 C 的 `fourier-inversion:152`（「需要你决定的」第 1 条）；`standing-waves:16` 那句和新节对不上，见「需要你决定的」第 2 条。

- **小问题 1：两条定理各少写一个条件**（`group-velocity`、`plucked-string`；plan.md:231「定理用到的理想化条件写进定理的条件里」）
  - `group-velocity:60`：条件写了「线性、均匀的系统，色散关系$\omega(k)$的二阶导数连续」，没写$\omega(k)$取实数值（没有阻尼）。反例就在链接得到的地方：`string-modes` 第 8 题（3）的弦$u_{tt}+2\gamma u_t-\beta u_{xxt}=c^2u_{xx}$也线性、均匀，代入$e^{i(\omega t-kx)}$得到的$\omega(k)$是复数，阻尼还随$k$变，$\dv\omega k$是复数，「平移$v_{\mathrm g}t$」没有意义。证明里的$\lvert e^{iRt}-1\rvert\le\lvert R\rvert t$（`:62`）和 `:70` 的「模不随$t$变」也都要$\omega$是实数。`:74` 到了「信号和能量」才说「没有吸收时」，定理卡片单独看不出来。
    - 改法：「线性、均匀的系统，色散关系$\omega(k)$取实数值、二阶导数（second derivative）连续，……」，净加 3 个汉字；`:70` 在定理后面，跟着用这个前提，可以不再写。
  - `plucked-string:31`：「理想的弦（不计硬度和阻尼）」没写均匀。粗细不匀的弦也可以没有硬度和阻尼，简正模不是正弦，定理不成立。第 8 题（2）「弦仍是理想的」、（3）把「左右粗细不匀」当作偏离，两处都默认理想含均匀。
    - 改法：「理想的弦（均匀，不计硬度和阻尼）」，全节 1351 字，仍是 26 分钟。

- **小问题 2：一句话总结没说对谁成正比**（`plucked-string:10`；plan.md:234「写定理的总结，照字面读不能有反例」）
  - 原文：「……第$n$次谐波振幅$\propto\frac1{n^2}\bigl\lvert\sin\frac{n\pi d}\ell\bigr\rvert$。」只有$d$、$h$取定、比较不同的$n$时才成立，系数里还有$\frac1{d(\ell-d)}$。这一节讲的正是改变$d$，读者很容易拿它对同一个$n$比不同的$d$：照它算，第 1 次谐波从中点换到$0.05\ell$处变为 0.16 倍，实际是 0.82 倍。
  - 改法：说成比值，如「理想弦在$x=d$处拨成三角形、静止放开，各次谐波振幅之比由$\frac1{n^2}\bigl\lvert\sin\frac{n\pi d}\ell\bigr\rvert$定。」按字数规则 29 字。

- **小问题 3：例 1 问了没答**（`group-velocity:103`、`:107`）
  - 题面「波长为$3a$时，它和相速度各是长波极限$v$的多少倍？$ka\to\pi$时呢？」照最自然的读法，$ka\to\pi$时也要答两个数；推导只答了$v_{\mathrm g}\to0$。
  - 改法：「$v_{\mathrm g}\to0$」后面补「，$v_{\mathrm p}\to\frac2\pi v$」（不加汉字）；或者题面改成「$ka\to\pi$时群速度呢？」。

- **小问题 4：「叠起来也满足」的条件，主例高斯波包不满足**（`group-velocity:43`；plan.md「每批的流程」第 3 条「链接目标的条件这里满不满足」）
  - 给的条件是$\tilde A$只在有限区间里不为零，链 `parameter-integrals#thm-leibniz-rule`（闭矩形）。本节的主例高斯波包（`:48`、`:66`、动画、第 3、5 题）$\tilde A$处处不为零；`:62` 末句只说平移的定理对它近似成立，没管它是不是解。
  - 改法：括号里补半句，如「……见[含参变量积分](…#thm-leibniz-rule)；下面的高斯波包用那里的定理 4」（加 13 个汉字，定理 4 是 `#thm-leibniz-improper`，$\omega$增长得不比多项式快时控制函数$\lvert\omega\rvert^j\lvert\tilde A\rvert$现成）。

- **小问题 5：`group-velocity:70` 两处措辞**
  - 「$t$时刻的$\tilde y$正是$\tilde Ae^{i\omega t}$对$k$的傅里叶变换，后者的模不随$t$变」：「后者」可以读成后一个词「傅里叶变换」，也就是$\tilde y$，它的模正是随$t$变的。改成「$\tilde Ae^{i\omega t}$的模不随$t$变」。
  - 「[色散关系]一节说脉冲摊开、总能量不变，就是这个道理」：前面刚说$\int\lvert\tilde y\rvert^2\dd x$「只是能量的代表」，由它不变推不出总能量不变；两件事共同的理由是没有阻尼、各成分的模都不随$t$变。改成「……总能量不变，道理相同」，比原文短。

- **小问题 6：说过头的两处**（`group-velocity`；plan.md:346）
  - `:74`「波包以外的介质几乎不动，没有能量」：前半句「几乎」、后半句「没有」，高斯波包处处不为零。改成「几乎不动，几乎没有能量」。
  - 第 7 题第 3 级提示（3）（`problems.yaml:200`）「怎样安排都窄不过$w$，它由波数的半宽$\frac2w$定死」：本节的宽度按包络降到峰高$\frac1e$处的半宽量，只管第 5 题那样的波包时成立，「怎样安排都」不成立。我算了一个反例：$w=2$时$\tilde A\propto e^{-q^2}$，把$\lvert q\rvert<0.12$的成分反号，$\lvert\tilde A\rvert$不变，包络在$1.58$处就降到峰高的$\frac1e$，远处的旁峰最高是峰高的 0.345，也不到$\frac1e$。（按均方宽度量，说法成立；峰高也确实高不过$\int\lvert\tilde A\rvert\dd k$。）
    - 改法：收到「第 5 题的波包在任何时刻都窄不过$w$，$w$由波数的半宽$\frac2w$定」。参考解答前面写了「一般的高斯波包」，不用改；「不管怎样安排，最后总要变宽」对，不动。

- **小问题 7：题干少写条件的两处**（`plucked-string`；plan.md:346）
  - 第 2 题 D 项（`problems.yaml:33`）「$d$、$h$不变，张力变为原来的 4 倍，……频率都变为原来的 2 倍」没写弦长、线密度不变，照字面读的读者会被判错。`standing-waves` 第 2 题 E 项写的就是「弦长和线密度不变，张力变为原来的 4 倍」。改成「$d$、$h$、弦长和线密度都不变，张力变为原来的 4 倍，……」，答案不变。
  - 第 7 题（3）（`:182`）「只让离一端$d$处、宽$b$的一小段同时得到速度$V$」没说$d$是这一段的中心，第 3 级提示（`:195`）按$d-\frac b2$到$d+\frac b2$积分。改成「只让以离一端$d$处为中心、宽$b$的一小段……」。

- **小问题 8：「第$n$次谐波」没有整词标**（`plucked-string:28`）
  - 安排 plan.md:2671 写明「第$n$次谐波」整词标，这里是「第$n$次:term[谐波]{…}」，只标了后两个字。这一节各块第一次出现的正好是「第$n$次谐波」的只有这一处；已审的 `standing-waves:42`、`string-modes:35` 也是拆开写的（那两处在起名或紧跟起名）。
  - 改法：「第$n$项是:term[第$n$次谐波]{id="physics.oscillations-waves.harmonic"}（harmonic）」；不改就写一句理由。

- **小问题 9：电磁学 `dispersion` 第 8 题用了链外的「群速度」，没有链接**（`problems.yaml:157`、`:162`；plan.md「每批的流程」第 3 条「前置」：题目文字里用到前置链外的结论时加链接，提示里当已知用的也算）
  - 题干（2）改成「石英光纤里各频率成分的群速度不同时」以后，整道题靠的就是「一小段频率的成分以群速度前进」，第 2 级提示也当已知用；`group-velocity` 不在这一节的链上（第 6 题只给了$v_{\mathrm g}=\dv\omega k$的式子）。改写前的「有色散时」是这一节自己的词，没有这个问题。安排给的原话里就没有链接，写稿员照抄的。
  - 改法：题干（2）写成「石英光纤里各频率成分的群速度（见[波包与群速度](lesson:physics.oscillations-waves.group-velocity)）不同时」。题目文字，`minutes` 不动。

- **小问题 10：第 6 题参考解答的口径**（`group-velocity` `problems.yaml:178`，网页不显示）
  - 「振幅的起伏从$\pm10\%$降到约$0.6\%$」：$\pm10\%$是半幅，$0.6\%$是峰谷差（用精确的$k(\omega)$算，振幅在$0.99998A$到$1.00566A$之间）。改成「从$\pm10\%$降到约$\pm0.3\%$」，或「峰谷差从$20\%$降到约$0.6\%$」。$k''\approx-3.52\times10^{-4}$、$x\approx2.23\times10^3\,\mathrm m$都对。

## 改了没报的

没有。
- `git status` 里这一批的改动和新文件，和写稿员汇报第十节一一对上：`_domain.yaml`（只在末尾加 4 条，原有条目没动）；`group-velocity`、`plucked-string` 的 `lesson.md`（文件头只加 `minutes`、`summary`，`status` 从 `outline` 改成 `written`，标题、goal、前置没动）、2 个 `problems.yaml`、1 张 SVG；`dispersion-relations/lesson.md`（补标、加「一般」、`status`）；电磁学 `dispersion` 的 `lesson.md`、`problems.yaml`。
- 跨领域的 3 个文件：把新标记去掉以后，`waveguides`、`undetermined-coefficients` 的 `lesson.md` 和 HEAD 逐字节相同，`dispersion/lesson.md` 只差写稿员改的 `status`。
- `tools/verify/physics.oscillations-waves.group-velocity.ts`、`physics.oscillations-waves.plucked-string.ts` 是两位逐节审查员的验算脚本，只引用 `_ow.ts` 里现成的函数，没改共用文件。
- 工作区里另有逻辑与集合、偏微分方程、复分析、线性代数等别的批次没提交的文件和 `progress/`，提交振动与波时别带上（批次 25 热学和它的写回在审查期间已经由写代码的会话提交，`8a5104c`、`b410291`，和这一批没有共同的文件）。
- 汇报里的数重算过，都对：术语表 64 → 68，简介 33、51、44、54 字；全节汉字 1539、1349、993；两题的正确选项和全领域 22 题的分布；同领域补标只有 1 处。

## 需要你决定的（要写代码的会话定的）

1. **偏微分方程 `fourier-inversion:152` 的「包络」「波包」还没补标**。
   - 现状：安排（plan.md:2673）点名，可偏微分方程正在并行写，跨领域的 agent 照「不要改那个目录」没动；我核过，那一句仍是普通文字。别的要补的 7 处都补了。
   - 推荐：偏微分方程这一批收尾、提交以后由你补：「钟形的包络（envelope）」的「包络」标 `physics.oscillations-waves.envelope`，「叫作波包（wave packet）」的「波包」标 `physics.oscillations-waves.wave-packet`，`status` 不动，页面检查带上（跨领域的 agent 在隔离副本里照这样换过，0 错误 0 警告）。同时用 `b27/run-po/cross-ow/scan.mjs` 把偏微分方程后写的节再扫一遍：我在 03:50 扫时，这一批已经写出的 10 节这四个词都是 0 处，`associated-legendre`、`spherical-harmonics` 还没写。
2. **`standing-waves:16` 的开头和新节对不上**（本领域原有的话）。
   - 现状：那里写「拨一下吉他弦，弦上的波形并不跑开，只是在原地上下起伏，有几个点始终不动」。`string-modes:152` 把「弦的振动都是驻波」列为误区，新写的 `plucked-string:35` 说「放开以后，弦上并不是一个驻波：折角分成两个，各以$v$向两边跑开」。安排（plan.md:2599）只要新节「说准」，已经做到，可没有点名那句话；读者先读 `standing-waves`，再读直接挂它的 `plucked-string`，会看到相反的两句。
   - 推荐：这一批顺手改一句，「吉他弦可以这样振动：波形并不跑开，只是在原地上下起伏，有几个点始终不动。」字数差不多，`minutes` 不变；`standing-waves` 退回 `written`，随这一批复核。不想多动一节，就记作原有问题，批次 28 写 `membrane-modes`（前置是它）时改。
3. **`waveguides` 的群速度用规矩 C 的标记，还是加前置**（跨领域 agent 拿不准第 3 条）。
   - 现状：`:81` 的定理以它为主题，`:135` 的例题求它，照「规矩 C 的标记只给旁白用」的字面该进前置链。我试算过：`waveguides` 加前置 `group-velocity`，层级变 0 节（仍是 27），多余前置 0→0。
   - 推荐：不加，照标。那里当场写出了$v_{\mathrm g}=\dv\omega k$，推导和例题只用这个式子，靠 `group-velocity` 的只有 `:85`「信号也以群速度传播（见……）」那句旁白；批次 23 在同样的位置标「相速度」也没加前置。加了要连 `group-velocity` 的链一起进它的链，还要把「相速度」「群速度」的标记都撤掉。
4. **「波包」的简介和定义都要求有快速的振荡，量子力学$k_0=0$的波包不算**。
   - 现状：定义（`:46`）要求波数散开的范围远小于$k_0$，边界情况（`:48`）说范围和$k_0$差不多时「只是一个脉冲」；简介（安排定的字）写「外形是缓变的包络乘上快速的振荡」。量子力学里静止的高斯波包（$k_0=0$）照样叫波包。
   - 推荐：这一节不改（和它的定义、主例一致），写回 plan.md:2635 那一条：量子力学写 `uncertainty-wave-packets` 时在自己的表里定义「波包」（不要求快速的振荡），或者当场说一句。
5. **电磁学 `dispersion:98`、`waveguides:85` 的链接仍指整节**（跨领域 agent 拿不准第 4 条）。推荐不改：说的事在 `group-velocity` 的「信号和能量」一块，那里没有锚点，也不必为它加。

## 写稿员「我替你定的」

第 1–6 条（`group-velocity`）：
1. 误区只留一条，省下的字写「步调一致」：同意。那条误区的反驳有反例（相速度取极值处不滑动），「步调一致」又是第 7 题要用的直观。
2. 群速度的边界情况写「各部分的$\dv\omega k$又不同时」：同意，原来的写法被$\omega$是$k$的一次函数加常数推翻。
3. $\int\lvert\tilde y\rvert^2\dd x$不变改用「是$\tilde Ae^{i\omega t}$的傅里叶变换」：同意，条件只落在$\tilde A$上，`#thm-plancherel` 的两条（绝对可积、平方可积）写在句子里，满足。措辞见小问题 5。
4. 讲解的小改：同意。例 1 的题面见小问题 3。
5. 题目的小改：同意。第 4 题题号别挪（`:57` 引）。
6. 记号$\tilde y$、$\tilde Y$，第 5 题的$p$：同意，两节没有互相撞的字母。

第 7–17 条（`plucked-string`）：
- 第 7 条（总结写「拨成三角形」、用$\propto$）：前半同意（第 6 题磨圆的折角正是反例），$\propto$的写法见小问题 2。
- 第 8 条（定理不起名、卡片写全）：同意，少的「均匀」见小问题 1。
- 第 9、10、12、13、14 条：同意。
- 第 11 条（$10.3\,\mathrm{ms}$同时引两道例 1）：同意，$\frac1{97\,\mathrm{Hz}}$正是$10.3\,\mathrm{ms}$。
- 第 15 条（第 6 题（1）换题）、第 16 条（第 7 题（3）换问法）：同意，原来的撞了 `string-modes` 第 5 题（1），原来的解释和同题（2）的平板矛盾。第 7 题三问数值核过。
- 第 17 条：同意，`beaded-string#thm-chain-equations` 的证明思路写着「绳的伸长是位移的二次小量」。

第 18–21 条（收尾定的）：
- 18：第六节第 2 条（`dispersion-relations:89` 加「一般」）同意，相速度取极值处有色散而$v_{\mathrm g}=v_{\mathrm p}$，照字面有反例；第 4 条（第 3 题解答的鼓包）同意，$\frac{cw^3}{6B}$和直接由两头的群速度之差估的一致；第 5、6 条同意，第 8 题（2）照 plan.md:231 属于要改的一类，改得对。
- 19、20、21：同意。

「拿不准的」：
- 第 1 条（误区 1 和「步调一致」二选一）：留现在的。
- 第 2 条（总结「波包终会展宽」和第 7 题（3））：不算先说了主要结论，总结没讲理由，（2）的先窄后宽讲解里没有。
- 第 3 条（定理卡片不重复「连续」）：可以，证明只要$\int\lvert\tilde A\rvert\dd k$有限。
- 第 4 条（没写 `wave-energy:44`）：可以，安排只说旁白。
- 第 5 条（初相「几乎听不出来」）：可以，是经验说法，写了「几乎」。
- 第 6 条（没链魏尔斯特拉斯判别法）：可以，余项不超过$\sum_{n>N}\frac C{n^2}$，合 `sketch`。
- 第 7 条（「级数」不括注）：可以，照 `multipole-expansion:36` 的先例。
- 第 8 条（1349 字）：照小问题 1 加 2 个字是 1351，够用。

## 跨领域的几处

- 跨领域补标 7 处，逐处核了位置、块、id、意思和英文括注：
  - 电磁学 `dispersion:98`（常见误区块第一次出现）、`waveguides:81`（定理名里，标在名字里是对的）、`:121`（几何图像块）、`:131`（例 1 块）、`:135`（例 2 块，`:133` 是标题不算）、`:143`（常见误区块）的「群速度」→ `physics.oscillations-waves.group-velocity`；常微分方程 `undetermined-coefficients:69`（几何图像块，`:55` 是动画标签）的「包络」→ `physics.oscillations-waves.envelope`。意思都相同，定义节都不在那几节的链上，全节第一次出现处都有英文括注（`waveguides:81` 的在同一句第二次出现，和批次 23 的「相速度」一样）。`waveguides:83`、`:85`、`:137`、`:145` 不是本块第一次出现，不标是对的。
  - 用自己的词表（包络、波包、群速、波群、音色、音质、音品、载波、调幅，连同英文 wave packet、group velocity、envelope、timbre）重扫了全站正文、题目、术语表和 SVG，得到的行和它列的一一对上，没有漏的。没标的都站得住：几何意思的（光学 `huygens-principle`、`birefringence`、`single-slit-diffraction`，多变量微积分 `legendre-transform`，变分法 `jacobi-condition`，偏微分方程 `wave-3d` 第 8 题，本领域 `doppler-effect:37` 和马赫锥的简介），量光强的（光学 `fourier-optics`），动画标签（`undetermined-coefficients:55`、电磁学 `skin-effect:78`、`:81`），标题、链接文字、goal，题目文字（可标可不标），参考解答，批次 4 以前的 `hamilton-jacobi`，`waveguides` 第 7 题的「调幅广播」（日常词）。
  - 没补的 `fourier-inversion:152` 见「需要你决定的」第 1 条。
- 反方向（别的领域指向振动与波的旧标记，定义节进了自己的链要去掉的）：重跑了它的脚本，41 处标记没有一处在链上，不用去。
- 规矩 C 正方向（两节借别的领域的词）：链上的只括注、不标，都有英文（傅里叶变换、傅里叶反演公式、积分号下求导、二阶导数、分部积分、奇延拓、分段光滑、一致收敛、微分中值定理、高斯积分、链式法则、偏导数）；没有链外 id 的标记。「色散」「简正模」「波动方程」「复振幅」标的都是本领域的 id（别的领域有同名条目），照安排。
- 同名：新进表的 4 个词全站别的领域没有同名条目；「包络」别处都是几何意思的普通词，没有进表，不冲突。

## 细节

### 分级的口径和合并

- 口径照 plan.md「每批的流程」第 3 条：重要是讲解、例题、误区、术语简介、解答里的说法照最自然的读法不成立，或者和同一节别处、别的节、链接目标矛盾，读者照着会得出错的结论，以及硬杠被越过；其余是小问题。定理少写上下文默认的条件（小问题 1）、引的条件主例不满足而结论对（小问题 4），照批次 26 广义相对论小问题 1、偏微分方程小问题 1 的先例列小问题。
- 逐节审查员一共报了重要 0 条、小问题 12 条（`group-velocity` 7、`plucked-string` 5）。合并以后是 10 条：
  - 合并的：两节各一条「定理少写条件」合成小问题 1；`plucked-string` 第 2 题 D 项和第 7 题（3）合成小问题 7。
  - 挪走的：`group-velocity` 第 7 条（`fourier-inversion:152` 没补标）不归写稿员修，挪到「需要你决定的」第 1 条。
  - 我补的：小问题 5 的「后者的模」，小问题 6 的第 7 题（3）（数值反例的脚本是 `b27/run-po/sum-ow/narrow.py`），小问题 9，「需要你决定的」第 2–5 条。
  - 没有删掉的；各条都打开原文核过，站得住。
- 核过、不算问题的：
  - 简介「波包」没写「散开的范围远小于$k_0$」：「集中在某个值附近」已经是这个意思，再写就超 60 字；$k_0=0$的事见「需要你决定的」第 4 条。
  - `group-velocity:16`、`:97` 的「前沿」（一群波的前边）和 `:111` 的「信号的前沿（signal front）」：后者带英文、说的是信号，不会混。
  - 第 2 题 C 项要用微分中值定理，比典型的简单题略重：安排（plan.md:2459）写明切线、连线的斜率进简单题，不改。
  - `standing-waves:42` 等旧节把「第$n$次谐波」拆开标：不追溯。
  - 第 8 题（电磁学）题干问「为什么选在$1.3\,\mu\mathrm m$附近」以后紧跟着说「那里各频率成分的群速度几乎相同」：原来的题干也带着原因，安排定的字，不动。

### 跑过的检查

- `npm run content`：03:24 有 6 个错误，全在别的写稿员正写的 `content/math/pde/greens-functions`；03:43 它写完以后全站 0 个错误、0 个警告。隔离副本（HEAD 加振动与波目录、电磁学 `dispersion`、`waveguides`、常微分方程 `undetermined-coefficients`）两次都是 0 个错误、0 个警告。
- `npm run verify`：全站 471 节全部一致（两次）；两个新脚本单独跑过；`npm run typecheck` 通过。
- `npm test`：03:26 失败 1 条（`compile.test.ts`，报的是 `greens-functions`），03:43 重跑 60 个文件、632 条通过、2 条跳过、0 失败。
- `levels.mjs`：层级变动 0 节，多余前置 0→0。另试算：`waveguides` 加 `group-velocity`、加 `dispersion-relations`，电磁学 `dispersion` 加 `group-velocity`，都是 0 节变、0→0。
- 页面检查两遍（深色、浅色），结果在 `b27/run-po/sum-ow/pc.json`、`pc2.json`；截图看过两节的讲解、图、例题、误区和难题的提示，提示框里没有伸进内边距的长行内公式。
- 动画：在隔离副本的页面上拖滑块（`group-velocity` 的时间取 0、2、8、12，`plucked-string` 的拨点取 0.5、0.35、0.2、0.05）截图：$t=8$时蓝线约 0.84 高、明显比橙线宽，$t=12$时还在画面里、没有串进来的影子，前面的波长比后面的短（$\omega''>0$，和第 2 题 E 项一致）；拨点在中点时偶数次的圆点都在横轴上，0.05 时按$\frac1n$慢慢降。控制台没有报错。
- 难题、思考题的数值抽查（`b27/run-po/sum-ow/num.py`、`p7.py`）：`group-velocity` 第 5 题（3）的峰高和$\frac1e$处的半宽（差在$10^{-14}$以内）、（4）的最窄宽度，第 6 题（3）在$x=2234\,\mathrm m$处的振幅范围；`plucked-string` 第 5 题（1）的恒等式（$d=0.5$、$0.2$、$0.07$）、第 6 题（2）的因子（直接对磨圆的形状积分，$n=1$、$2$、$5$、$9$）和（3）的 48.3、724，第 7 题（1）四分之一周期时弦是直的、各点速度$-\frac{2hv}\ell$，（2）（3）的$B_n$，第 8 题（1）的 0.0079。都对。
- 链接：两节 48 处链接文字都等于那一节的标题，锚点都存在；链上、链外逐条查过（链外的 9 处、8 节都是旁白或题目里写明出处）。打开原文核过条件的：`normal-modes` 例 2、`thm-leibniz-rule`、`thm-leibniz-improper`、`thm-inversion`、`thm-gaussian-transform`、`thm-plancherel`、`thm-fourier-properties`、`thm-remainder-bound`、`thm-mean-value`、`thm-inverse-derivative`、`thm-chain-dispersion`、`thm-string-series`、`thm-fourier-uniform`、`thm-chain-equations`、`thm-causal-order`、`def-energy-flux`，`string-modes` 第 5、8 题，`wave-dalembert` 第 7、8 题，`beaded-string` 第 6 题，`nonlinear-oscillators` 第 6 题，`superposition-beats` 第 7 题，`fourier-series` 第 5 题，`fourier-transform` 例 2、第 7 题，`parameter-integrals` 第 6 题，`waves-in-3d` 第 6 题，`dispersion-relations` 例 2、第 6、8 题，`wave-equation` 例 1，`standing-waves` 例 1、例 2。除小问题 4 以外都对得上。
- 术语：脚本按块扫每块第一次出现，0 处漏标（剩下的报告都是链接文字里的节名、更长的词里的短词，如「角频率」里的「频率」、「简谐波」里的「谐波」，或意思不同的，如「按周期$2\ell$延开」）；各节第一次出现的英文括注齐全。安排列的不写的词（载波、群延迟、频谱、波列、普朗歇尔、标准差、泛音、杨氏定律、弱解等）两节网页上看得见的文字里一个没有。
- 每段不超过 4 句、中英文空格、引号：脚本查 0 处。
- `progress/` 里没有这两节的记录，也没有碰。

### 术语表（64 → 68）

- 包络 `envelope`（33 字）、波包 `wave-packet`（51）、群速度 `group-velocity`（44）锚在 `group-velocity` 的 `def-envelope`、`def-wave-packet`、`def-group-velocity`，音色 `timbre`（54）锚在 `plucked-string` 的 `def-timbre`；都落在下定义的那一段，英文、`definedIn` 对得上，简介原文照安排（plan.md:2668、:2680、:2681），只用链上的概念，都不超过 60 字。加在表的末尾，原有 64 条一个字没动。
- 只括注、不进表的：复包络、信号的前沿、琴桥、拨片、响度、起音、音调，题目里的长浪、调幅、拾音器、琴槌；各只在一节用（「琴桥」`standing-waves` 第 7 题也写了，日常词；「调幅」`waveguides` 第 7 题是「调幅广播」），不用进表。

### 退回 `written` 的两节

- `dispersion-relations:89`：「一群波（:term[波包]{…}，wave packet）前进的速度和波峰的速度一般不同」，标在这一块第一次出现，英文括注并进原有的括号；「一般」的理由见上。全节 993 字、20 分钟，别处没动。
- 电磁学 `dispersion` 第 8 题：题干（2）、第 2 级提示、参考解答照安排 plan.md:2594、:2678 改了，「零色散波长（zero-dispersion wavelength）」起名、括注齐；题干（2）正好 4 句；说法和 `:36` 的定义（色散是折射率随频率变，石英在$1.3\,\mu\mathrm m$照样有）不再冲突，也和 `group-velocity` 第 5 题（4）的回指对上。`lesson.md` 只改了 `status`，`minutes` 没动。少的链接见小问题 9。

### 篇幅（全节汉字，不数 5 个固定的二级标题）

| 节 | 问题 | 讲解 | 几何图像 | 例题 | 误区 | 合计 | `minutes` | 汉字 ÷ `minutes` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `group-velocity` | 56 | 1204 | 83 | 114 | 82 | 1539 | 30 | 51.3 |
| `plucked-string` | 56 | 943 | 101 | 188 | 61 | 1349 | 26 | 51.9 |
| `dispersion-relations`（补标） | 76 | 493 | 90 | 170 | 164 | 993 | 20 | 49.7 |

本领域别的 19 节每分钟 46.1–51.8 字。`group-velocity` 超出安排的预算 1520，在上限 1560 以内；照小问题 1、4、5、6 改完约 1553 字，不用再拆。

### 要写回 plan.md 的

- 写稿员汇报第九节的 8 条，同意照写。第 1 条补上审查定下的：`thm-envelope-velocity` 的条件带「$\omega(k)$取实数值」，`thm-plucked-amplitudes` 的「理想的弦」写明均匀，`plucked-string` 的总结写成振幅之比。
- 「每节固定结构」第 6 条（一句话总结）加例子：写「$\propto$」「正比于」要说清对谁、哪些量取定，`plucked-string` 原来的总结照字面会拿去比不同的拨点，把第 1 次谐波的 0.82 倍算成 0.16 倍。
- 「题目与判题」讲「都」「任何」「所有」的那一段加例子：「怎样安排都窄不过$w$」，宽度按$\frac1e$处的半宽量时，把一小段波数反号就更窄，收到「第 5 题的波包」。
- 「每批的流程」第 3 条「讲解和例题」加一句：例题题面问的每个量，推导都要答到（`group-velocity` 例 1 的「……时呢？」）。
- 「每批的流程」第 3 条「前置」加例子：改题目的说法时换进了链外的词（电磁学 `dispersion` 第 8 题的「群速度」），照样补链接；安排给的原话也按这条核一遍。
- plan.md:2635（量子力学 `uncertainty-wave-packets`）补一句：振动与波的「波包」要求有快速的振荡（波数散开的范围远小于$k_0$），$k_0=0$的波包由那一批自己定义或当场说明；定理只对实数的$\omega(k)$。

## 修订说明（写内容 agent，2026-11-25，第 1 轮，未提交）

重要 0 条；小问题 10 条都改了，没有不改的。两节由两位写稿员按报告分头修订，领域层面的小问题 9 由我（收尾）改。我逐条核了两节的改动和节与节之间的一致，再把两节连同退回 `written` 的 `dispersion-relations`、电磁学 `dispersion` 第 8 题当一批照同类问题找了一遍，另改了 2 处：`group-velocity` 的一句话总结、第 6 题题干（3）。「需要你决定的」5 条都没有动（`standing-waves:16`、`fourier-inversion:152` 还是原样），等写代码的会话定。

行号是改完以后的。下面提到的临时脚本和结果都在 /private/tmp/claude-501/-Users-sunmoontrain-Principia/c208bdf3-d0ba-40c6-b884-1564d13ba51b/scratchpad/b27/run-po/ 下，只写相对这个目录的路径；两位写稿员改动前的文件在 `rev1-gv/before/`、`rev1-ps/before/`，收尾改动前的在 `rev1-wrap-ow/before/`。

### 小问题 1：两条定理各少写一个条件

- `group-velocity:60`：照报告改成「线性、均匀的系统，色散关系$\omega(k)$取实数值、二阶导数（second derivative）连续，……」。
- `plucked-string:31`：照报告改成「理想的弦（均匀，不计硬度和阻尼）」。写稿员数值核过，没有这个条件定理确实不成立：前后两半线密度 1∶4 的弦，固有频率之比是 1、2.289、3.29、4.29。
- 没加「没有阻尼」的：`def-group-velocity` 卡片和群速度的简介。常见误区要说吸收很强的频率附近$\dv\omega k$可以大于$c$，定义限成没有阻尼，那条误区就不成立了；简介又是安排定的字。
- 同类另改的见「照同类问题整批找出、一起改的」第 1 条。

### 小问题 2：一句话总结没说对谁成正比

- `plucked-string:10`：照报告改成「理想弦在$x=d$处拨成三角形、静止放开，各次谐波振幅之比由$\frac1{n^2}\bigl\lvert\sin\frac{n\pi d}\ell\bigr\rvert$定。」，按 `countChars` 是 29 字。写稿员按比值读，6 个拨点、39 次谐波数值核过。

### 小问题 3：例 1 问了没答

- `group-velocity:107`：用补答的办法，写成「$ka\to\pi$时相邻小球反向振动，$v_{\mathrm p}\to\frac2\pi v$，$v_{\mathrm g}\to0$：波包不再前进，……」。$v_{\mathrm p}$放在前面，让冒号后的解释仍接着$v_{\mathrm g}\to0$；题面没动。收尾复算$\frac{\sin(\pi/2)}{\pi/2}=0.6366$。

### 小问题 4：「叠起来也满足」的条件

- `group-velocity:43`：补在原括号里，写成「……（differentiation under the integral sign，见[含参变量积分](…#thm-leibniz-rule)；$\tilde A$衰减得足够快时，如$e^{-k^2}$，用那里的定理 4）」。
- 没照报告写「下面的高斯波包」：「高斯波包」在这一块到 `:48` 才起名、括注，写在这里就成了块内第一次出现，标记和英文要挪到定义前面、还套进括号。「足够快」也把$\omega$增长不能太快包了进去，和定理 4 的控制函数对得上；收尾核过，那一节的定理 4 就是 `#thm-leibniz-improper`。
- 同一段的「$t=0$」外面包了一层花括号写成「${t=0}$」：括号里加字以后，768 像素下「t =」和「0」正好被拆到两行，写法同 `:62`。

### 小问题 5：`group-velocity:70` 两处措辞

- 「后者的模不随$t$变」改成「$\tilde Ae^{i\omega t}$的模不随$t$变」；「总能量不变，就是这个道理」改成「总能量不变，道理相同」。两处都照报告。

### 小问题 6：说过头的两处

- `group-velocity:74`：改成「几乎不动，几乎没有能量」。
- 第 7 题第 3 级提示（3）（`problems.yaml:200`）：末句照报告改成「第 5 题的波包在任何时刻都窄不过$w$，$w$由波数的半宽$\frac2w$定。」，这一段正好 4 句。收尾直接对波数求和核过第 5 题的半宽和峰高（$w=2$、$\omega''=1$，$t=-3$、$0$、$1$、$4$，和式子在 6 位小数内一致，`rev1-wrap-ow/num.py`），$t$可正可负，半宽都不小于$w$。
- 同类另改的见「照同类问题整批找出、一起改的」第 2 条。

### 小问题 7：题干少写条件的两处

- `plucked-string` 第 2 题 D 项（`problems.yaml:33`）：照报告改成「$d$、$h$、弦长和线密度（linear density）都不变，张力变为原来的 4 倍，……」。「线密度」在这一节第一次出现变成这里，英文括注从第 5 题题干挪过来。C 项没改：只换拨法，弦还是题干那一根。
- 第 7 题（3）（`:182`）：照报告改成「只让以离一端$d$处为中心、宽$b$的一小段同时得到速度$V$」。写稿员数值核过：$d$当这一段的边缘，各次振幅和解答不同。
- 答案、选项的对错、提示里的数都没变。同类另改的见「照同类问题整批找出、一起改的」第 1 条。

### 小问题 8：「第$n$次谐波」没有整词标

- `plucked-string:28`：照报告改成「第$n$项是:term[第$n$次谐波]{…}（harmonic）」。页面上看过：显示和空格正常，字母$n$下面没有下划线，和全站标签里带公式的术语一样。

### 小问题 9：电磁学 `dispersion` 第 8 题用了链外的「群速度」（领域层面，收尾改的）

- `dispersion` 的 `problems.yaml:157`：题干（2）照报告写成「石英光纤里各频率成分的群速度（见[波包与群速度](lesson:physics.oscillations-waves.group-velocity)）不同时」。这一段仍是 4 句，第 2 级提示、参考解答不动，`minutes`、`status` 不动。

### 小问题 10：第 6 题参考解答的口径

- `group-velocity` 的 `problems.yaml:178`：改成「振幅的峰谷差从$20\%$降到约$0.6\%$」。取峰谷差，是因为第 3 级提示的「只起伏$\frac12b^2A$左右」也是峰谷差。写稿员用精确的$k(\omega)$重算：$x=0$处 0.9 到 1.1，$x=2234\,\mathrm m$处 0.99998 到 1.00566，差 0.568%；收尾把他的脚本重跑了一遍，一致。

### 照同类问题整批找出、一起改的

各节写稿员在自己的节里按自己那几条的类找过；收尾时我把报告的十类都放到两节上（讲解、例题、图注、误区、总结、4 条简介和 16 道题的题干、选项、提示、解答、参考解答）又过了一遍。

1. 条件漏写（小问题 1、7 同类）：
   - `group-velocity` 的写稿员改 1 处：第 5 题题干（`problems.yaml:97`）「$\omega''$是不为零的常数」改成「系数都是实常数，$\omega''\ne0$」：（3）取模、算$\lvert p\rvert^2$都要实系数，讲解和第 7 题又引这道题的宽度。
   - `plucked-string` 的写稿员改 7 道题的题干：第 1、2、3、4、5、7 题（`problems.yaml:4`、`:21`、`:54`、`:74`、`:98`、`:176`）的「拨起」「拨起$h$」「拨一下」「拨」写明拨成（高$h$的）三角形，和定理、总结一致（第 6 题磨圆的折角就是反例）；第 4 题另补「琴桥是其中一端」，两段距离都从它量起；第 8 题第一句（`:210`）写成「理想的弦在正中间拨成三角形，从静止放开，没有偶数次谐波」，（2）问的正是开始时各点还有速度怎么办。答案都没变。
   - 收尾改 2 处：
     - `group-velocity:10` 的一句话总结：「波数范围很窄时」改成「无阻尼、波数范围窄时」，和定理卡片加「取实数值」同一个理由：总结在这一节末尾、在下游小节的「前置回顾」里都是单独看的，照字面有阻尼时$\dv\omega k$是复数。按 `countChars` 正好 30 字，「很」字为此去掉。
     - 第 6 题题干（3）（`problems.yaml:149`）：「再计入$\frac12k''\Omega^2$」后面补「（$k''\ne0$）」，答案的距离$\frac\pi{\lvert k''\rvert\Omega^2}$要它，和第 5 题的$\omega''\ne0$一样。
   - 没改的：`plucked-string` 例 1、例 2 的题面还写「拨起$h$」，`:22` 已经说明拨起$h$「成了三角形」，两道例题又写明代进定理；第 6 题题干写了「和讲解的三角形不同」「仍从静止放开」；`group-velocity` 第 3、4、6、7、8 题的题面已写明系统或没有阻尼、没有衰减。其余定义卡片、定理卡片和 4 条简介逐张看过，没有要补的。
2. 说过头（小问题 6 同类）：
   - `group-velocity` 的写稿员改 2 处：`:57`「又步调一致」改成「又大致步调一致」（$\omega''\ne0$时只有一阶相同，原话和第 7 题（3）「步调一致的时刻最窄」对不上）；`:66`「包络越窄，所含的波数越散」改成「开始时包络越窄，……」（第 5 题的波包越走越宽，可$\lvert\tilde A\rvert$一直不变）。
   - `plucked-string` 的写稿员改 2 处：`:50`「所以换拨点，音调不变，音色变。」改成「所以拨点影响音色，不影响音调。」（把拨点换到关于中点对称的那一点，音色不变，第 2 题 E 项的解答就是这样说的）；`:56` 的「第 8 题」改成「第 8 题（3）」（`string-modes` 第 8 题（1）（2）的阻尼下各次衰减一样快，只有（3）的方程是高次衰减得更快，安排写的也是回指（3））。
   - 收尾又扫了两节的「只有」「只能」「一定」「总」「都」「一直」「完全」「正好」「不论」「不管」，其余的都有前提或本来就精确。
3. 没说清对谁成正比（小问题 2 同类）：`plucked-string` 的写稿员改 4 处：第 7 题第 3 级提示（3）（`problems.yaml:195`）「振幅一直是$\frac1{n^2}$乘同一个正弦」改成「除去同一个正弦，振幅一直按$\frac1{n^2}$降」，参考解答（3）（`:203`）「拨是……」改成「拨按……」；第 8 题第 2、3 级提示（`:221`、`:225`）「$A_n$、$B_n$正比于……的积分」前面补「$n$取定时」（$B_n$的系数里有$\omega_n$）。两节其余的「正比」「反比」逐处看过，都说清了：第 2 题的$A_n$和$h$有 C 项写的$d$不变，第 4 题的信号和横向速度；`group-velocity` 第 6 题（4）的距离和$\Omega^2$成反比，说的是同一个$\omega$。
4. 问了没答（小问题 3 同类）：三道例题和 16 道题的各个小问逐个对过，没有别的。
5. 链接目标的条件（小问题 4 同类）：两节 48 处链接的目标（定理、例题、题目）逐个打开看过，说的事和条件都对得上，没有别的要补；`plucked-string:33` 借 `string-modes#thm-string-series` 的系数式时，三角形不满足那里的条件，后面已经另说了收敛和「放宽了意思的解」。
6. 指代（小问题 5 同类）：两节的「它」「那里」「后者」「这里」「这一点」逐处看过，没有会读错的。
7. 整词标（小问题 8 同类）：`plucked-string` 的写稿员把 `:110` 常见误区的「高次:term[谐波]」改成整词标。收尾用审查的 `sum-ow/terms.mjs` 逐块扫过三节，没有漏标（报告的只有链接文字里的节名、更长的词里的短词、意思不同的词）。
8. 链外的词没有链接（小问题 9 同类）：用 `rev1-wrap-ow/offchain.mjs` 把题目文字里定义节不在链上的词全列出来，逐处看过。两节链外的都带链接（`group-velocity` 第 2、3、5 题，`plucked-string` 第 5 题，后者的单位长度的能量写进了题干），其余的是更长的词里的短词或普通词（「简谐波」里的「谐波」，「中心」）；电磁学 `dispersion` 第 8 题第 2 级提示的「群速度」由题干的链接管着，第 6 题的「相速度」「群速度」题干写出了式子，是原有的。
9. 口径（小问题 10 同类）：两节参考解答里的百分数、比值和提示里的对过，没有别的口径不一。

写回 plan.md 时，写稿员汇报第九节第 1 条的数照这一轮改：`group-velocity` 1559 字、`plucked-string` 1352 字（每分钟都是 52.0）；`group-velocity` 的总结带「无阻尼」，`plucked-string` 的总结是振幅之比。

### 检查

- `npm run content`（全站）：收尾开始时、所有改动之后各跑一次，都是 0 个错误、0 个警告（写稿员那时报的 `associated-legendre` 缺题目，收尾开始时已经写上）。
- `npm test`（所有改动之后）：60 个测试文件全过，632 项通过、2 项跳过、0 失败。
- `npm run verify`：全站 471 节全部一致；`npm run typecheck` 通过。改过的几节单独跑了 `npx tsx tools/verify/<id>.ts`：`group-velocity`、`plucked-string`、`dispersion-relations`、电磁学 `dispersion` 都是 p1–p4 全部 ✓，脚本没有改。
- 页面：`pc-isolated.sh --include content/physics/oscillations-waves --include content/physics/electromagnetism/dispersion`，`group-velocity`、`plucked-string`、`dispersion-relations`、电磁学 `dispersion` 四节，深色、浅色各一遍（所有改动之后）。隔离副本构建 0 个错误、0 个警告；每页 8 题、点 32 下，768/768 不溢出，行间公式要拖 0 处（最宽 728），KaTeX 报错 0，占位框 0，定义卡片不以句号结束 0，SVG 1 张、问题 0。结果在 `rev1-wrap-ow/pc-rev1-wrap.json`、`pc-rev1-wrap-light.json`；截图看过两节改动的地方和电磁学 `dispersion` 第 8 题，排版正常。
- 层级：`levels.mjs --domain physics.oscillations-waves`，层级变动 0 节，多余前置 0→0；21、22、26，前置没改。
- 链接：`rev1-wrap-ow/links.mjs` 查三节，两节 48 处、电磁学 `dispersion` 8 处（多出第 8 题那一处），链接文字都等于那一节的标题，锚点都存在。
- 排版：`rev1-wrap-ow/style.mjs` 查四节的 `lesson.md` 和 `problems.yaml`，每段不超过 4 句，中英文、数字之间的空格，引号，公式边上手写的空格，控制字符：0 处问题。
- 篇幅（审查的 `sum-ow/count.mjs`，不数 5 个固定的二级标题）和一句话总结（`countChars`）：

  | 小节 | 汉字（审查时 → 现在） | `minutes` | 每分钟汉字 | 总结 |
  | --- | --- | --- | --- | --- |
  | `group-velocity` | 1539 → 1559（上限 1560） | 30 | 52.0 | 27 → 30 |
  | `plucked-string` | 1349 → 1352（上限 1352） | 26 | 52.0 | 29 |

  两节都正好在上限边上，再加字就要删；比报告估的 1553、1351 各多 6、1，多在「大致」「开始时」、定理 4 那半句和「影响……影响」。
- 和审查快照 `snapshot-oscillations-waves/` 比，这一轮在这一批的范围里改了 5 个文件：`group-velocity/lesson.md`（`:10`、`:43`、`:57`、`:60`、`:66`、`:70`、`:74`、`:107`）、`group-velocity/problems.yaml`（`:97`、`:149`、`:178`、`:200`）、`plucked-string/lesson.md`（`:10`、`:28`、`:31`、`:50`、`:56`、`:110`）、`plucked-string/problems.yaml`（`:4`、`:21`、`:33`、`:54`、`:74`、`:98`、`:176`、`:182`、`:195`、`:203`、`:210`、`:221`、`:225`）、电磁学 `dispersion/problems.yaml`（`:157`）。`_domain.yaml`、`pluck-nodes.svg`、`dispersion-relations`、`waveguides`、常微分方程 `undetermined-coefficients` 没动，各节 `status` 没动，`tools/verify/` 没动。没碰 `plan.md`、`progress/`，没提交。

## 复核（审内容 agent，2026-11-25，第 1 轮）

和写内容 agent、初审汇总是不同的会话。先和初审快照逐行比，再对着报告逐条核修订，最后重跑检查、改 `status`。临时文件都在 /private/tmp/claude-501/-Users-sunmoontrain-Principia/c208bdf3-d0ba-40c6-b884-1564d13ba51b/scratchpad/b27/run-po/ 下，下面只写相对这个目录的路径，这一轮的在 `recheck1-ow/`。

### 比了什么

- 用 `diff -ru` 把快照 `snapshot-oscillations-waves/` 的 `content/`、`tools/verify/` 和工作区比，又用 `recheck1-ow/gloss.py` 把这一批的改动逐字列出来。这一批范围里改了 5 个文件，行号和修订说明最后一条完全一致：
  - `group-velocity/lesson.md`：`:10`、`:43`、`:57`、`:60`、`:66`、`:70`、`:74`、`:107`；`group-velocity/problems.yaml`：`:97`、`:149`、`:178`、`:200`。
  - `plucked-string/lesson.md`：`:10`、`:28`、`:31`、`:50`、`:56`、`:110`；`plucked-string/problems.yaml`：`:4`、`:21`、`:33`、`:54`、`:74`、`:98`、`:176`、`:182`、`:195`、`:203`、`:210`、`:221`、`:225`。
  - 电磁学 `dispersion/problems.yaml`：`:157`。
- 没变的：`_domain.yaml`（四条新简介一个字没动）、`pluck-nodes.svg`、`dispersion-relations`、电磁学 `dispersion/lesson.md`、`waveguides`、常微分方程 `undetermined-coefficients`，还有「需要你决定的」点到的 `standing-waves`、偏微分方程 `fourier-inversion`；4 节的 `status` 复核前都是 `written`。
- 两位写稿员改动前的副本（`rev1-gv/before/`、`rev1-ps/before/`）和快照逐字节相同；收尾自己改的 4 处（`group-velocity:10`、第 6 题题干（3）、电磁学 `dispersion` 第 8 题、报告）和修订说明一致；报告前 196 行（初审写的）和收尾开始时的副本一字不差。
- `tools/verify/`：两个新脚本不在快照里（逐节审查员初审时写的，修改时间 03:01、03:16，早于初审报告），这一轮没动。
- 快照以后别的会话改的，不归这一批：`content/math/logic-sets/`、`content/math/pde/` 的文件和 `tools/verify/math.logic-sets.countable-sets.ts`；`content/physics/` 里除了上面 5 个文件，没有别的改动。

### 逐条核对

小问题 1–10 都改对了，没有不改的，没有带进新的问题。

- 小问题 1（两条定理各少写一个条件）：`group-velocity:60`、`plucked-string:31` 照报告改。没加「没有阻尼」的 `def-group-velocity` 卡片和群速度的简介，理由站得住：常见误区正要拿吸收很强的频率说$\dv\omega k$可以大于$c$，简介又是安排定的字。写稿员给的反例我重算过，前后两半线密度 1∶4 的弦固有频率之比是 1、2.2885、3.2885、4.2885，简正模不再是正弦，`plucked-string:31` 确实要「均匀」。
- 小问题 2（一句话总结）：`plucked-string:10` 照报告改，29 字；我对 5 个拨点、5 次谐波数值积分，振幅之比和$\frac1{n^2}\bigl\lvert\sin\frac{n\pi d}\ell\bigr\rvert$之比的最大差在$10^{-8}$以内。原来的写法把第 1 次谐波的 0.82 倍算成 0.16 倍，我也重算过，是。
- 小问题 3（例 1 问了没答）：`group-velocity:107` 补了$v_{\mathrm p}\to\frac2\pi v$；复算$ka\to\pi$时是 0.6366。放在$v_{\mathrm g}\to0$前面，冒号后的解释仍接着它，题面没动。
- 小问题 4（叠起来也满足的条件）：`group-velocity:43` 补在原括号里，没有用「下面的高斯波包」，理由站得住（这一块到 `:48` 才起名）。「那里的定理 4」打开核过，就是 `thm-leibniz-improper`；它的条件（被积函数和偏导数连续、有控制函数、积分收敛）在$\tilde A$、$\omega$连续、$\tilde A$衰减得足够快时满足。「${t=0}$」外面的花括号写法同 `:62`，页面上看过没有被拆到两行。
- 小问题 5（`:70` 两处措辞）：照报告改。「道理相同」对得上 `dispersion-relations:91`「链和弹性基底上的弦都没有阻尼」。
- 小问题 6（说过头的两处）：
  - `:74` 照报告改。
  - 第 7 题第 3 级提示（3）的末句照报告改，这一段正好 4 句。报告的反例我重算过（反号后包络在$1.58$处就降到峰高的$\frac1e$，高斯的在$2$处）；第 5 题的半宽和峰高我另用直接对波数求和核过（$w=2$、$\omega''=1$，$t=-3$、$0$、$1$、$4$，和式子在 6 位小数内一致）。
- 小问题 7（题干少写条件）：两处都照报告改，答案不变；「线密度（linear density）」的英文括注从第 5 题挪到第 2 题 D 项，这一节别处没有更早的。第 7 题（3）按「中心」对$d-\frac b2$到$d+\frac b2$积分，和第 3 级提示一致；取成边缘各次振幅都不同（$n=1$时 0.0207 和 0.0187）。
- 小问题 8（整词标）：`plucked-string:28` 照报告改，页面上看过显示正常。
- 小问题 9（链外的「群速度」）：电磁学 `dispersion` 第 8 题题干（2）加了链接，段落仍是 4 句，说法和 `group-velocity` 第 5 题（4）的回指、`dispersion:98` 对得上。
- 小问题 10（参考解答的口径）：改成「峰谷差从$20\%$降到约$0.6\%$」。用精确的$k(\omega)$重算，$x=0$处振幅在 0.9 到 1.1，$x=2234\,\mathrm m$处在 0.99998 到 1.00566，差 0.568%；$k''\approx-3.52\times10^{-4}\,\mathrm{s^2/m}$也对。
- 照同类另改的，逐处看过，都对：
  - 条件：第 5 题题干补「系数都是实常数，$\omega''\ne0$」、第 6 题（3）补「$k''\ne0$」，解答都要用；`plucked-string` 第 1、2、3、4、5、7 题的「拨起」写成「拨成（高$h$的）三角形」，和定理、总结一致，第 4 题补「琴桥是其中一端」，第 8 题第一句补「从静止放开」，答案都没变，验算脚本不用改。
  - `group-velocity:10` 的总结改成「无阻尼、波数范围窄时」，30 字，照字面没有反例；`:57`「大致步调一致」和第 7 题的「步调一致」分得开。
  - `:66`「开始时包络越窄」、`plucked-string:50`「拨点影响音色，不影响音调」都不再说过头；`:56` 改指第 8 题（3），我打开 `string-modes` 核过，高次衰减得更快正是（3）说的，（1）（2）的各次衰减一样快。
  - 第 7 题第 3 级提示（3）、第 8 题第 2、3 级提示的「正比」都说清了对谁；第 8 题的「$n$取定时」是对的，$B_n$的系数里有$\omega_n$。
- 新写、改写的地方另查：没有新出现的名词缺英文括注（脚本和人工各一遍），没有链外的词缺链接（题目文字里链外的都带链接），每段不超过 4 句。

### 改了没报的

没有。逐字差异里的每一处，修订说明都写到了。

### 遗留小问题（不影响通过，提交前顺手改的）

1. `plucked-string` 第 2 题 E 项（`problems.yaml:35`）还写「改在离另一端$d$处拨起$h$」；题干已经是「拨成高$h$的三角形」，别的题的「拨起」这一轮都改了。接着题干读不会错，可改可不改；要改，写「改在离另一端$d$处拨成同样高的三角形，有的谐波的振幅会变」，答案、分钟数都不变。
2. 两节的篇幅都正好在上限边上（`group-velocity` 1559 / 1560，`plucked-string` 1352 / 1352），以后再往讲解里加字要先删字；题目文字不算。
3. 还等写代码的会话定的（写稿员没有动，我也没有动）：「需要你决定的」第 1 条 `fourier-inversion:152` 的「包络」「波包」补标，第 2 条 `standing-waves:16`「弦上的波形并不跑开」和 `plucked-string:35` 说的相反，提交前要定，第 3–5 条照推荐即可。

### 跑过的检查

- `npm run content`（全站）：06:48 一次，改完 `status` 以后 06:56 又一次，都是 0 个错误、0 个警告。
- `npm run verify`（全站）：全部一致（471 个小节）；`group-velocity`、`plucked-string`、`dispersion-relations`、电磁学 `dispersion` 四节单独跑，p1–p4 全部 ✓。日志 `recheck1-ow/verify.log`。
- `npm test`：60 个测试文件全过，632 项通过、2 项跳过、0 失败；`npm run typecheck` 通过。
- 页面检查：`pc-isolated.sh --include content/physics/oscillations-waves --include content/physics/electromagnetism/dispersion`，四节，深色、浅色各一遍，改完 `status` 又跑了一遍深色。隔离副本构建 0 个错误、0 个警告；每页 8 题、点 32 下，768/768 不溢出，行间公式要拖 0 处（最宽 728），KaTeX 报错 0，占位框 0，定义卡片不以句号结束 0，SVG 1 张、问题 0。结果在 `recheck-pc-oscillations-waves-1.json`（深色）、`recheck1-ow/pc-light.json`；截图看过两节的讲解、例题、总结、误区，题目卡片里改过的各题（`group-velocity` 第 5、6、7 题，`plucked-string` 第 1、2、3、4、5、7、8 题），还有电磁学 `dispersion` 第 8 题，排版正常。
- 层级：`levels.mjs --domain physics.oscillations-waves`，层级变动 0 节，多余前置 0→0；21、22、20（`dispersion-relations`）、22（`membrane-modes`），电磁学 `dispersion` 26、`waveguides` 27，量子力学 `uncertainty-wave-packets` 27。
- 链接：四节 61 处（30、18、8、5），链接文字都等于那一节的标题，锚点都存在；链外 17 处都是旁白或题目里写明出处。
- 排版：`rev1-wrap-ow/style.mjs` 查四节，0 处；改过的文件里没有行尾空格、制表符、控制字符。
- 术语：`sum-ow/terms.mjs` 逐块扫过三节，报告的都是链接文字里的节名、更长的词里的短词（「角频率」「简谐波」「高斯波包」「第$n$次谐波」「高次谐波」）和别的意思的词，没有漏标。
- 篇幅和字数（自己写的 `recheck1-ow/count.py`，和初审的脚本一致）：全节汉字 1559、1352、993，`minutes` 30、26、20，每分钟 52.0、52.0、49.7；总结按 `countChars` 是 30、29 字。
- 改到的数另写脚本算过（`recheck1-ow/num.py`，只用标准库）：例 1 的两个比值、第 5 题的半宽和峰高、第 6 题的$k''$和振幅范围、`plucked-string` 的总结和第 7 题（3）、线密度不匀的弦。

### 结论

重要 0 条，小问题 10 条都改对了，没有带进新的问题。4 节通过，`status` 改成 `reviewed`：振动与波 `group-velocity`、`plucked-string`、`dispersion-relations`（这一批退回 `written` 的，这一轮没改，初审看过的改动没有问题），电磁学 `dispersion`。跨领域补标改到的 `waveguides`、`undetermined-coefficients` 照安排 `status` 不动。没有提交。

## 遗留小问题的修改（写内容 agent，2026-11-25）

复核的「遗留小问题」3 条：第 1 条标了「可改可不改」，照复核给的写法改了；第 2 条是提醒，没有要改的；第 3 条等写代码的会话定，没动。内容文件只动了 `plucked-string/problems.yaml` 一行，`status` 都没碰（振动与波有正文的 22 节都是 `reviewed`）。临时文件在 /private/tmp/claude-501/-Users-sunmoontrain-Principia/c208bdf3-d0ba-40c6-b884-1564d13ba51b/scratchpad/b27/run-po/ 下，只写相对这个目录的路径，这一轮的在 `leftover-ow/`。

1. `plucked-string` 第 2 题 E 项（`problems.yaml:35`）：「改在离另一端$d$处拨起$h$，有的谐波的振幅会变」改成「改在离另一端$d$处拨成同样高的三角形，有的谐波的振幅会变」。
   - 只换了说法，和题干的「拨成高$h$的三角形」一致。E 项照旧是错的（换到关于中点对称的拨点，$\lvert\sin\frac{n\pi d}\ell\rvert$和$d(\ell-d)$都不变），答案仍是 B、C、D。第 2、3 级提示和解答里说 E 项的地方比的是两个正弦，没有写「拨起」，不用跟着改；题干、A–D 项没动，行号不变。题目文字不算进篇幅，`minutes` 仍是 26。
   - 同类：这一节还写「拨起」的有 5 处，复核没有列，没动。讲解 `:22` 写的是「拨起$h$，成了三角形」；例 1、例 2 的题面 `:87`、`:95` 有 `:22` 说明在前，又写明代进定理（第 1 轮修订说明过）；第 5 题第 1、3 级提示（3）的「拨起$s$时」（`problems.yaml:109`、`:123`）接的是题干（3）「把弦慢慢拨成三角形」。
2. 篇幅（提醒）：讲解一个字没加，用复核的 `recheck1-ow/count.py` 重数，`group-velocity` 1559 / 1560、`plucked-string` 1352 / 1352，没有变。
3. 等写代码的会话定的，都没有动，文件还是原样：
   - 「需要你决定的」第 2 条 `standing-waves:16`：提交前要定。照推荐改，那一节要退回 `written`、再复核一次（plan.md:2766），这一步的交代是只改列出的几处、不碰 `status`，所以没有替你改。数过：推荐的那句和原句都是 32 个汉字，全节仍是 1060 字，`minutes` 21 不变。
   - 第 1 条 `fourier-inversion:152` 的「包络」「波包」：偏微分方程这一批还没提交（最近的提交是 `b410291`），等它提交以后补；`content/math/pde` 没碰。
   - 第 3–5 条的推荐都不用改内容：`waveguides` 不加前置、照标，「波包」的定义和简介不动，两处链接仍指整节。只有第 4 条要在 plan.md:2635 补一句，归写代码的会话写回。

检查：

- `npm run content`（全站）：改之前、改之后各跑一次，都是 0 个错误、0 个警告（`leftover-ow/content-before.log`、`content-after.log`）。写完这一节又跑了一次，0 个错误、1 个警告，在 `content/math/pde/_domain.yaml:588`（偏微分方程正在写的 `spherical-harmonics`），振动与波没有（`content-final.log`）。
- 验算：`npx tsx tools/verify/physics.oscillations-waves.plucked-string.ts`，p1–p4 都是 ✓，p2 是选项 2、3、4（`leftover-ow/verify-plucked.log`）。脚本里 E 项比的就是拨点在$d$和$1-d$、高相同的两个三角形，不用改。
- 页面：`pc-isolated.sh --include content/physics/oscillations-waves --include content/physics/electromagnetism/dispersion --ids physics.oscillations-waves.plucked-string`，深色、浅色各一遍，结果在 `leftover-ow/pc-plucked-string.json`、`pc-plucked-string-light.json`。隔离副本构建 0 个错误、0 个警告；8 题、点 32 下，页面 768/768，行间公式要拖 0 处（最宽 728），KaTeX 报错 0，占位框 0，定义卡片不以句号结束 0，SVG 1 张、问题 0 处。截图看过第 2 题，E 项一行放得下，显示正常。
- 排版：`rev1-wrap-ow/style.mjs` 查这一节的 `lesson.md` 和 `problems.yaml`，0 处；反斜杠改前改后都是 1214 个，没有行尾空格、制表符、控制字符。
- `content/physics` 和 `tools/verify` 的 1162 个文件和改之前逐个比过校验和，只有 `plucked-string/problems.yaml` 变了。没碰 `plan.md`、`progress/`、`_domain.yaml`，没有提交。

## 写代码的会话定的改动与复核（2026-11-25）

「需要你决定的」5 条，写代码的会话全照推荐定，动内容的只有第 2 条 `standing-waves:16`：第 1 条 `fourier-inversion:152` 的补标等偏微分方程提交以后做，第 3、5 条不改内容，第 4 条只写回 plan.md。这一处由写代码的会话另起的 agent 改，那一节退回 `written`；我来复核，和改的、写这一批的都不是同一个会话。临时文件在 /private/tmp/claude-501/-Users-sunmoontrain-Principia/c208bdf3-d0ba-40c6-b884-1564d13ba51b/scratchpad/cont/commit-ow/ 下，改的在 `sw-edit/`，复核的在 `mine/`。

- 改了什么：`standing-waves:16` 的第一句「拨一下吉他弦，弦上的波形并不跑开，只是在原地上下起伏，有几个点始终不动。」改成「吉他弦可以这样振动：波形并不跑开，只是在原地上下起伏，有几个点始终不动。」，后面两问没动。新旧两句都是 32 个汉字，全节 1060 字、`minutes` 21 不变；和 HEAD 比，这一节只有这一句不同。
- 为什么：拨弦放开以后，弦上并不是一个驻波，折角分成两个跑开（`plucked-string:35`、`:109`），「弦的振动都是驻波」正是 `string-modes:152` 的误区。原句照字面说拨一下就成驻波，读者先读这一节、再读直接挂它的 `plucked-string`，会看到相反的两句；现在只说弦可以这样振动，正是下面要讲的驻波。
- 复核了什么：
  - 读了全节、8 道题和这一节起名的 6 条术语简介，新的一句和它们都通，没有别处引开头这一句；和 `plucked-string:22`、`:35`、`:50`、`:52`、`:109`，`string-modes:16`、`:35`、`:72`、`:152`，`wave-equation:44` 和第 6 题参考解答（2）对过，不矛盾。
  - 这一节里没有「拨一下」「弦上的波形并不跑开」这类说法了。剩下的「拨」两处，`:44`「弦被拨动以后自由振动，只能以这些频率振动」和例 2「弦上还剩下哪些谐波」，说的是有哪些频率，几个谐波同时有也成立。全站搜「拨」「跑开」「原地」「吉他」「琴弦」「驻波」，没有别处说拨弦就成一个驻波。
  - 另看到一处原有的措辞，和这次改动无关、不挡，没动：`:34`「射来的波反射回来倒过来……和入射波叠成驻波」没写「简谐」，它引的 `reflection-transmission#thm-reflection` 说的是任意形状的波；连着 `:23` 的定义（限定简谐波）和紧跟的式子读不会错。要改，写「射来的简谐波」，多 2 个字，`minutes` 不变，由写代码的会话定。
  - 检查（HEAD `c09152d` 加这次要提交的文件，隔离副本）：内容构建 0 个错误、0 个警告，`npm test` 632 项通过、2 项跳过、0 失败，`npm run verify` 471 个小节全部一致（`standing-waves` 单独跑，p1–p4 都是 ✓），`npm run typecheck` 通过；层级变动 0 节，多余前置 0→0。页面检查 7 页（`group-velocity`、`plucked-string`、`standing-waves`、`dispersion-relations`、电磁学 `dispersion`、`waveguides`、常微分方程 `undetermined-coefficients`），深色、浅色各一遍：每页 8 题、点 32 下，页面 768/768，行间公式要拖 0 处（最宽 728），KaTeX 报错 0，占位框 0，定义卡片不以句号结束 0，SVG 2 张、问题 0 处。截图看过 `standing-waves` 开头，新的一句和后面两问两行排得下；四条新术语的 29 处标记和 `standing-waves` 里它起名的 6 个词的 18 处标记，浮窗逐个点开看过。
- 结论：通过，没有带进新的问题，`standing-waves` 的 `status` 改回 `reviewed`（振动与波有正文的 22 节都是 `reviewed`）。没有提交。

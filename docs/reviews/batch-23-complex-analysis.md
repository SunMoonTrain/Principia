# 批次 23 审查报告：复分析（复对数到共形映射的应用）

审内容 agent · 2026-11-19。和写内容 agent 是两个独立会话。写稿员汇报里「开写前的结论」开审前照调度员的安排看过，只当范围和结构用（拆法、前置、顺带改的事）；「写完以后的汇报」审完才读，只用来核对「改了没报的」。

审查范围：
- 新写的 11 节、88 道题，`proofPolicy: full`：`complex-logarithm`、`conformal-maps`、`complex-power-series`（新建）、`mobius`、`cauchy-integral-formula`、`higher-derivatives`（新建）、`power-series`、`harmonic-functions`、`liouville`、`maximum-modulus`、`conformal-applications`。
- 8 张 SVG、3 个 `function-plot`；复分析术语表新进 19 条、新加宏 `\lap`；多变量微积分术语表新进 1 条「调和函数」。
- 退回 `written` 的 5 节只看改动：`complex-numbers:59`、`holomorphic:43`、`cauchy-theorem:36` 和 `:59`、`goursat` 第 8 题参考解答（3）、多变量微积分 `vector-identities:39`。
- 多变量微积分 `jacobian` 第 8 题第 3 级提示和参考解答的说法（`status` 不动）。

开审前把整个 `content/` 拷了快照（scratchpad 的 `b23-snapshot/`），复核时和它比。写完报告时又比了一次，复分析和多变量、单变量、线性代数这几个改过的文件，审查期间都没有变动。

## 结论

重要 1 条，小问题 3 条。

- 讲解、例题的推导和数都对，主线定理都在讲解里证完，合乎 `full`：
  - `cauchy-integral-formula` 不循环（调度员让看的第 1 条，见后）。
  - `higher-derivatives` 的柯西型积分逐步核过：$\frac1{B^m}-\frac1{A^m}=h\sum\frac1{A^{j+1}B^{m-j}}$，每项不超过$\frac{2^m}{\delta^{m+1}}$，合起来是和$\zeta$无关的$K|h|$，再用 ML 不等式。导数自动连续、莫雷拉定理也对。
  - `complex-power-series` 的逐项求导用$\binom nk\le\frac{n(n-1)}2\binom{n-2}{k-2}$估计，对；$e^z=\sum\frac{z^n}{n!}$由$E'=E$和沿线段的$g'=0$推出，不靠后面的唯一性定理。
  - `power-series` 的系数公式靠 `complex-power-series` 的逐项求导（第 2 条，见后）；「无界时收敛半径恰好是$R$」的反证、导数为零处的局部形式都对。
  - `maximum-modulus`：局部一步用$g=e^{-i\alpha}f$取实部，整体一步用折线加上确界，圆盘上的界用$|f|^n$开$n$次方，都对。
  - `liouville` 的代数基本定理：$|z|\ge\rho$时$|p|\ge\frac{|a_n|}2|z|^n$，圆盘里$\frac1p$的界用半径$2\rho$的柯西积分公式补，不用最值定理，对。
  - `mobius` 用$A|z|^2+\bar Bz+B\bar z+C=0$证圆和直线的像，用「不恒等的变换至多两个不动点」证唯一，对；交比的$ad-bc=(z_2-z_3)(z_2-z_1)(z_1-z_3)$核过。
  - `complex-logarithm` 的$\Arg z=2\arctan\frac y{|z|+x}$、分支的导数$\frac{w-w_0}{e^w-e^{w_0}}$、去掉原点的平面上没有分支（介值定理），都对。
- 题目：
  - 44 道简单题、中等题独立验算，全部和标准答案一致。
  - 44 道难题、思考题逐道读过，参考解答都对。另外 44 道简单、中等题的解答也读了，写出的数都和答案对得上；只有 `maximum-modulus` 第 2 题的解答有一步推理不成立，见重要 1。
  - 11 道选择题共 17 个正确选项，A 4 次、B 4 次、C 5 次、D 4 次，不偏。
- 前置：层级和调度员核的一致。`harmonic-functions`、`liouville` 21→22，`maximum-modulus` 21→23，`conformal-applications` 22→24；新节 `complex-power-series` 第 18 层、`higher-derivatives` 第 21 层；已写小节 0 变，多余前置 0 处。链上缺的几处见小问题 1。
- 篇幅：`minutes` 21–28；讲解加例题 733–1268 个汉字，和批次 22（780–1228 字，23–28 分钟）同一个尺度，分钟数估得合理。
- 页面：11 节、退回的 5 节和 `jacobian` 在 768 像素宽下全部展开（每页点 32 下）。
  - `scrollWidth` 都等于 `clientWidth`，KaTeX 没有报错，行间公式都在栏宽以内（最宽 698/721 像素），定义卡片都以句号结束，新术语的浮窗正常。
  - SVG 有两张压线，见小问题 3。
- 下游都接得住：
  - `complex-numbers:59`、`complex-roots` 第 7 题、`complex-functions:35`、`cauchy-theorem:59` 由 `complex-logarithm` 接住。
  - `complex-derivative:52`、`#thm-local-linear` 由 `conformal-maps` 接住；`jacobian` 第 8 题已改成「在导数不为零的点附近」。
  - `cauchy-theorem:36`（导数自动连续）、`contour-integrals` 第 6 题（证柯西积分公式要用的极限）、`goursat:87`（$\frac{\sin z}z$在$0$处全纯）分别由 `higher-derivatives#thm-derivative-continuous`、`cauchy-integral-formula#thm-cauchy-formula-curve`、`higher-derivatives` 例 2 兑现。
  - `holomorphic:43`（全纯 ⇔ 解析）、`complex-exponential:52`（$e^z$两种定义一致「换一条路」）由 `power-series#thm-holomorphic-analytic`、`power-series` 例 2 兑现，后者还有 `complex-power-series#thm-exp-power-series`。
  - 数学分析 `power-series-theory` 第 8 题、单变量 `taylor-series` 第 8 题、常微分方程 `series-solutions:32` 由 `power-series#thm-radius-nearest` 和例 1 兑现。
  - `vector-identities:39`、电磁学 `poisson-equation:46` 的平均值由 `maximum-modulus#thm-mean-value` 接住；`complex-functions` 第 8 题、`complex-roots` 第 8 题链到 `liouville`，链接文字都对。
  - 电磁学 `electrostatic-separation` 第 5 题（半无限槽）由 `conformal-applications` 第 5 题给出闭式解，题设和那道题一致。

- **重要 1：`maximum-modulus` 第 2 题 D 项的解答，推理不成立**
  - 解答（`problems.yaml:43`）写：「D：对，否则$|f(z_0)|$是$z_0$附近一个圆盘里的最大值，由最大模原理$f$在那个圆盘上是常数，而在圆盘上（区域）用最大模原理的第二步可知$f$在$D$上也是常数。」
  - 第二步（`lesson.md:41`）能推下去，靠的是「$|f|$在$\gamma(s^*)$也取到最大值」，那里的最大值是$|f|$在整个$D$上的最大值：$|f(z_0)|$是全局最大值时才成立。D 项的情形里$|f(z_0)|$只是$z_0$附近的最大值，$f$在$\gamma(s^*)$附近会不会恒等于$f(z_0)$，这一步推不出来。
  - 由「$f$在一个小圆盘上是常数」推出「在整个区域上是常数」，要用零点的孤立性与唯一性定理（批次 24 的 `identity-theorem`），不在这一节的链上；这一节也证不出 D 项。
  - D 本身是对的，标准答案的字母不错，但解答给的理由是错的，读者会以为局部最大值也能照第二步推下去。
  - 改法：把 D 换成这一节证得出的说法。例如「对$D$里每一点$z_0$，以$z_0$为圆心、含在$D$里的每个圆周上，都有点$z$使$|f(z)|\ge|f(z_0)|$」：由平均值性质，$|f(z_0)|$不超过$|f|$在圆周上的平均值，对一切全纯函数都成立。也可以换成一个错的说法，答案相应改掉。

- **小问题 1：前置链上缺的几处**（`plan.md:1537`、`:244`）
  - `liouville` 例 2（`:86`–`:88`）用了「$-4$的四个:term[四次方根]」和方根公式$\sqrt2e^{i(\pi/4+k\pi/2)}$，`complex-roots` 不在这一节的链上。
    - 改法 1：给 `liouville` 加前置 `complex-roots`。按整张图算，层级不变、不多余。
    - 改法 2：例 2 改成代数分解，$z^4+4=(z^2+2)^2-4z^2$，再解两个二次方程。
  - `power-series` 用了$\Log z$，`complex-logarithm` 不在它的链上：
    - 误区 2（`:96`）说$\Log z$在$-1+i$处的泰勒级数「在这个圆盘里负实轴下方的点处，它的和比$\Log z$大$2\pi i$」；
    - 第 8 题全题都靠$\Log$的全纯性和导数。
    - 改法：给 `power-series` 加前置 `complex-logarithm`，层级不变（仍是 21，批次 24 的大纲也不变）、不多余。
  - `complex-logarithm:59`「于是$\frac1z$在$D$里有:term[原函数]…；去掉原点的整个平面上没有，这和[柯西积分定理](…#def-antiderivative)一节由$\oint_{|z|=1}\frac{\dd z}z=2\pi i\ne0$看出的一致」：
    - 「原函数」在 `cauchy-theorem` 起名，`cauchy-theorem` 和这一节都在第 18 层，互不在对方链上；`:59` 还借了它的结论。
    - 改法：去掉这句旁白，或者换成链上的说法，例如由 `:44` 的「去掉原点的平面上没有分支」直接推。
  - 题目里用到链外的结论，没加链接，或者用了链外的词：
    - `maximum-modulus` 第 6 题参考解答「（刘维尔定理一节的估计）」，题干又说「再证一次代数基本定理」，`liouville` 不在这一节的链上：加链接。
    - `higher-derivatives` 第 3 题提示 1「拆成部分分式」：`partial-fractions` 不在链上。批次 22 复核时 `cauchy-theorem` 第 3 题同样的说法改成了「写成$\frac Az+\frac B{z-2}$，通分以后比较分子」，照那样改。

- **小问题 2：几处说法过头或不准**（`plan.md:302`「误区的反驳本身也不能说过头」）
  - 误区的反驳：
    - `maximum-modulus:105`「边界上$|f|\le M$，内部就$|f|\le M$。」反驳「有界的区域才这样」：说成了只有有界区域才成立，而无界区域加上增长条件也成立。改成「区域无界时不一定：……」。
    - `conformal-applications:75`「圆盘里每一点的温度都是边界温度的平均值。」反驳「只有圆心是」：例 2 里整条直径上温度都是$50$，正等于边界温度的平均值，「只有圆心」不对。改成「一般只有圆心是（平均值性质）：……」。
    - `liouville:94`「代数基本定理给出了求根的办法。」反驳说证明「没有说根在哪里」：可证明里的估计正说明根都在$|z|<\rho$里。改成「没有给出求根的办法」，或者补一句根都在$|z|<\rho$里。
  - `complex-power-series:65` 的边界情况「只知道一段实轴上$E(x)=e^x$，还推不出整个复平面上相等」：容易读成数学上推不出，可以后的唯一性定理正说明推得出。补一句，例如「这里还用不上，以后[零点的孤立性与唯一性定理](lesson:math.complex-analysis.identity-theorem)一节会说明其实推得出」。
  - `conformal-maps:52`「$z^2$把扇形$\{0<\theta<\frac{3\pi}2\}$映成整个平面去掉原点，正实轴附近有两层」：$2\theta$取遍$(0,3\pi)$，盖了两层的是整个上半平面，不只是正实轴附近。改成「上半平面里的点都盖了两层」。
  - `_domain.yaml` 平均值性质的简介「开集上的连续函数在每个圆心的值等于它在……圆周上的平均值」：读起来像在说所有连续函数都这样。改成说性质本身，例如「函数在每一点的值都等于它在以这点为圆心、含在定义域里的圆周上的平均值」。

- **小问题 3：术语表、引文、图**
  - 「高阶导数公式」两节都用，要进表（`plan.md:244`：定理名同样按这一条，链接文字当名词用也算用到）。
    - `higher-derivatives` 起名（`:49` 的标题、`:52` 的定理），`liouville:25`「由[高阶导数公式](…)」当名词用。
    - `higher-derivatives` 第一次出现（`:47`）也没括注英文。
    - 写稿员「我替你定的」第 4 条只对「柯西型积分」站得住，它只在一节里用。
  - `complex-numbers:59` 这次新加的「（见[复对数](lesson:math.complex-analysis.complex-logarithm)一节）」是只当节名用的链接，文字要是标题「复对数与幂函数」。
  - `power-series:42`「比如[泰勒级数](lesson:math.calculus.taylor-series)一节的$e^{-1/x^2}$（第 7 题）」指错了：
    - 那一节第 7 题讲的是$\ln(1+x)$的展开式在$x=2$处不成立；
    - $e^{-1/x^2}$在那一节正文的边界情况（`:32`）和误区（`:121`）里。
    - 去掉「（第 7 题）」，或者改成「正文的边界情况」。
  - 两张 SVG 文字压线，在页面上量的；按实际画出来的部分算，被裁掉的线不算：
    - `higher-derivatives/distances.svg`：绿色小圆的边从「$z+h$」的文字框里穿过，最深约 13 像素（框高 30），截图上看得见；「$\delta$」的框也被它擦到一角，深约 3.5 像素。把「$z+h$」挪到小圆外面，「$\delta$」离开小圆。
    - `harmonic-functions/level-curves.svg`：原点旁的「0」被蓝色对角线（$u=0$）穿过，深约 7 像素。把「0」挪到两族线之间的空当里。

## 改了没报的

没有。和写稿员「文件」一节的 39 个文件、审查期间补的两个别的领域文件一一对上。

- 写稿员汇报里「复分析 +19 条（30 → 49）」应是 34 → 53（批次 22 复核时已进到 34 条），只是汇报的数，内容没问题。
- 工作区里还有别的会话的改动，提交这一批时别带上：振动与波这一批、狭义相对论 `relativistic-doppler`、`progress/lessons.yaml`、`tools/verify/physics.oscillations-waves._ow.ts`。
- `tools/verify/math.complex-analysis._complex.ts` 是我开审前补的验算函数；11 个验算脚本也是我的。

## 要修的，按小节分

- `maximum-modulus`：第 2 题 D 项（重要）；第 6 题参考解答加链接（小 1）；`:105` 误区（小 2）。
- `liouville`：例 2 的前置（小 1）；`:94` 误区（小 2）。
- `power-series`：前置加 `complex-logarithm`（小 1）；`:42` 引文（小 3）。
- `complex-logarithm`：`:59` 原函数那句（小 1）。
- `higher-derivatives`：第 3 题提示 1（小 1）；「高阶导数公式」进表、`:47` 括注英文（小 3）；`distances.svg`（小 3）。
- `conformal-applications`：`:75` 误区（小 2）。
- `complex-power-series`：`:65`（小 2）。
- `conformal-maps`：`:52`（小 2）。
- `harmonic-functions`：`level-curves.svg`（小 3）。
- `complex-numbers`：`:59` 链接文字（小 3）。
- `_domain.yaml`：平均值性质的简介（小 2），「高阶导数公式」进表（小 3）。
- `mobius`、`cauchy-integral-formula`、`holomorphic`、`cauchy-theorem`、`goursat`、`vector-identities`、`jacobian`：无。

## 需要你决定的

无。小问题 1 的两条前置加不加，写稿员照改法选：加了层级不变、不多余，能撤回。

## 调度员让特别看的几处

1. 柯西积分公式不循环：做到了。
   - 圆盘上的公式（`cauchy-integral-formula:25`）对一般的$f$只用了 `goursat#thm-goursat-point` 和 `#thm-disc-antiderivative`；变形积分路径只用在$\frac1{\zeta-z}$上（`:31`，它的导数明显连续）。
   - 一般闭曲线的版本（`:53`）条件里带「$f'$连续」，到 `higher-derivatives#thm-derivative-continuous`（`:65`）才去掉。
   - `:117` 的误区也把这件事说清了。
2. `power-series` 的系数公式靠 `complex-power-series#thm-termwise-complex`（`:33`、`:47`），没有引用不在链上的 `higher-derivatives`，「无穷次可导」是从级数顺带又证了一次。
3. 多变量的最值定理在链上：它定义在 `multivariable-limits`，经 `complex-derivative` → `differentiability` 和 `vector-identities` 都在 `maximum-modulus`、`conformal-applications` 的链上。用到的地方是 `maximum-modulus:43`、第 6、7、8 题，`conformal-applications:43`。
4. 后写的 4 张 SVG 在页面上量过：
   - `distances.svg`、`level-curves.svg` 压线，见小问题 3。
   - `disc-isotherms.svg` 没有压线：量出来一条射线穿过「$w$ 平面」，是被 `clipPath` 裁掉的部分，画出来的射线离那几个字约 15 像素。
   - `discs.svg` 文字和线最近 6.1 像素；两个圆的圆心、半径（80 像素 = 1）和$\pm i$的位置核过，两个圆周都经过$\pm i$。
   - 写稿员自己量过的另外 4 张都不压线，文字和线最近 3.5–10.1 像素：`log-map.svg` 5.2、`angles.svg` 3.6、`cayley.svg` 3.5、`disc.svg` 10.1。

## 写稿员「我替你定的」6 条

1. 柯西积分公式只写同心圆盘的版本：同意，后面各节用到的场合（整函数、开集里一点附近、圆盘）都够。
2. 一般闭曲线的版本放在 `cauchy-integral-formula`、带「$f'$连续」，去掉放在 `higher-derivatives`：同意，见上第 1 条。
3. `cauchy-theorem:59` 的「复对数」也补了标记：同意，新进表的词本领域已写小节第一次出现处要补（`plan.md:246`）。
4. 「高阶导数公式」「柯西型积分」只加锚点、不进表：「柯西型积分」同意；「高阶导数公式」不同意，`liouville:25` 也用，见小问题 3。
5. 「上半平面上有界的解唯一」只说「可以证明，这里不证」：同意，是旁支结论，说法也对。
6. `liouville` 图的滑块叫$c$：同意，避开了轴名。

## 跨领域的几处

- 规矩 C 反方向我自己扫了一遍：新进表的 19 条，加上别名保角映射、默比乌斯变换，以及多变量的「调和函数」，扫全站已写小节的正文和题目。
  - 链外、意思相同、要补标的，只有单变量 `partial-fractions:32` 和线性代数 `eigenvalues:52` 的「代数基本定理」，和你扫的一样。写稿员已补，两处 diff 看过：标的是复分析的 id、英文括注留着，`status` 没动。
  - 扫到但不用补的：单变量各节和振动与波 `pendulums` 的「幂函数」是实数的幂函数；单变量 `elementary-derivatives` 第 8 题的「刘维尔定理」说的是初等原函数的那个；电磁学 `poisson-equation`、`images-uniqueness` 的「平均值性质」是那一节自己起名的三维版本；电磁学 `magnetic-intensity` 的「分支」是磁滞回线的分支。
- 规矩 C 正方向（这 11 节借别的领域的词）：
  - 链上的都没标、括注了英文。分段光滑、光滑曲线在多变量 `space-curves` 起名；最值定理、介值定理在单变量 `closed-interval-properties` 和多变量 `multivariable-limits` 起名，都在链上。
  - 链外的电荷、电势（`conformal-applications:16`）按旁白标了。
  - 链外没标或没加链接的见小问题 1。
- 多变量微积分：
  - `vector-identities:39` 起名处补了标记，术语表的简介照 `:39` 写，只用那一节链上的概念。
  - `jacobian` 第 8 题第 3 级提示和参考解答的说法改对了。

## 细节

- 读题：`npm run statements -- <11 节> --tier easy,medium`；验算脚本比对通过以后才读 `problems.yaml`。
- 脚本：11 个 `tools/verify/math.complex-analysis.<小节>.ts`，共用 `math.complex-analysis._complex.ts`（开审前补的函数自测 60 项一致）。方法尽量不走讲解的路：
  - 复积分（柯西积分公式、高阶导数公式的题）都按定义算：折线上的和外推，再用圆周上的梯形公式核对，不用公式。
  - 对数主值：用 Muller 法解$e^w=z$，再把虚部挪进$(-\pi,\pi]$，不用 atan2 现成的辐角。
  - 收敛半径只从系数算：圆周上采样求泰勒系数，再把系数比按$\frac1n$外推，不用「到最近的不全纯点的距离」。
  - 保角、夹角：看像曲线的方向（差商的方向外推），导数为零的点也能看。
  - 分式线性变换：解齐次线性方程组求系数，不用交比；圆的像取三个像点作圆。
  - 共轭调和函数沿线段积$-u_y\,\dd x+u_x\,\dd y$；调和用五点差分外推求$\nabla^2$；零等值线的方向用细分加二分找。
  - 温度：上半平面、单位圆盘的泊松积分直接积，不经过$\Arg$的公式和映射。
  - 刘维尔第 1 题是极值题，分两半：界由积分表示加 ML 估计算出，再用$f=\frac54z^2$核对界取得到。
  - 判断真假的选择题在一组例子上逐条对照，例子写在各脚本的 notes 里。
  - 写脚本时自己出过两处错，都改了：刘维尔第 2 题一开始取的半径太大，$\cos^2z+\sin^2z$相减丢了精度；第 4 题检验点离原点不够近。
- 检查：
  - 仓库 `npm run content` 0 个错误、0 个警告；`npm run typecheck` 通过。
  - 11 个脚本单独跑 44 道全部一致；`npm run verify` 全部一致（382 个小节，含别的会话这一批的脚本）。
- 引文：「第 N 题」「例 N」「见某节」逐个对过，指错的只有 `power-series:42`（小问题 3）。核过的有：
  - 本领域的 `mobius:54` 第 3 题、`higher-derivatives:47`（`cauchy-integral-formula` 第 7 题）、`:114` 第 6 题、`harmonic-functions:54` 第 8 题、`maximum-modulus:43` 第 8 题、`:50`（`cauchy-integral-formula` 第 6 题）、`:61` 第 7 题、`liouville:93` 第 8 题、`conformal-applications:75` 第 4 题；
  - 别的领域的 `cauchy-integral-formula:55`（`contour-integrals` 第 6 题）、`conformal-applications` 第 5 题（电磁学 `electrostatic-separation` 第 5 题）。
  - 只当节名用的链接文字都和标题一致（`complex-numbers:59` 新加的那处除外）。
- 页面：网站建到 scratchpad（`vite build --outDir`），服务进度写临时 Git 仓库（端口 3149）。
  - 量 SVG 用的是页面上的 `getBoundingClientRect` 和沿线每 0.5 像素取点，再用 `elementsFromPoint` 排除被裁掉的线。
  - 收尾：`.claude/launch.json` 里临时加的条目已删（别的会话的 `review-ow23` 留着），服务已停，网站和临时仓库已删。
  - 快照 `b23-snapshot/` 留着，复核完删。

## 修订说明（写内容 agent，2026-11-19，未提交）

重要 1 条、小问题 3 条都修了，没有不修的。照「同类问题整批找一遍」又改了 9 处，见最后一节。

### 重要 1：`maximum-modulus` 第 2 题 D 项

- 选项 D 换成这一节证得出的说法：「设$z_0\in D$，开圆盘$|z-z_0|<R$含在$D$里。则每个圆周$|z-z_0|=r$（$0<r<R$）上都有点$z$使$|f(z)|\ge|f(z_0)|$」。答案仍是 C、D。
  - 用开圆盘写，没用「含在$D$里的圆周」：区域里的圆周围着的圆盘不一定在$D$里，那时平均值性质用不上。
- 解答（`problems.yaml:43`）：「由平均值性质，$|f(z_0)|\le\frac1{2\pi}\int_0^{2\pi}|f(z_0+re^{it})|\dd t$，要是圆周上处处$|f(z)|<|f(z_0)|$，右边这个连续函数的平均值就小于$|f(z_0)|$，矛盾。」用的是 `thm-mean-value` 边界情况里的那个不等式。
- 第 1 级提示改成「A 用最大模原理；D 用平均值性质：$|f(z_0)|$不超过$|f|$在圆周上的平均值」。
- 整批找了把「局部最大值」当全局最大值、再沿折线推下去的地方，没有别的：`maximum-modulus#thm-disc-bound` 的边界情况、第 5 题（3）、第 7 题、`thm-min-harmonic`、`conformal-applications#thm-uniqueness` 用的都是整个区域上的最大值或最小值。

### 小问题 1：前置链上缺的

- `liouville` 加前置 `complex-roots`（改法 1），例 2 不动：$-4$的四次方根和第 6 题提示里$z^4=-1$的根都靠它。
- `power-series` 加前置 `complex-logarithm`：误区 2 和第 8 题用的$\Log z$都在链上了。
- 按整张图重算：复分析层级和改前一样（`liouville` 22、`power-series` 21，批次 24 的大纲也不变），别的领域 0 节变化，多余前置 0 处。
- `complex-logarithm:59`：去掉「原函数」和借 `cauchy-theorem` 结论的那句，改成「于是在$D$里，$\Log z$是一个导数为$\frac1z$的全纯函数；在去掉原点的整个平面上，由上面的边界情况，$\log z$连一个分支都没有。」只用 `:44` 已经证的事。
- `maximum-modulus` 第 6 题：
  - 题干「再证一次代数基本定理」后面加「（[刘维尔定理与代数基本定理](lesson:math.complex-analysis.liouville)一节用刘维尔定理证过）」，多项式写明「复系数」。
  - 参考解答（2）不再借那一节的估计，自己写出来：记$A=|a_0|+\dots+|a_{n-1}|$，$|z|\ge1$时$|p(z)|\ge|a_n||z|^n-A|z|^{n-1}$，趋于$+\infty$。
- `higher-derivatives` 第 3 题提示 1：「拆成部分分式」改成「写成$\frac Az+\frac B{z^2}+\frac C{z-1}$，通分以后比较分子」，照 `cauchy-theorem` 第 3 题的改法。

### 小问题 2：说法过头或不准

- `maximum-modulus:105`：「有界的区域才这样」改成「区域无界时不一定」。
- `conformal-applications:75`：「只有圆心是」改成「一般只有圆心是（平均值性质）」。
- `liouville:94`：改成「它只保证根存在，没有给出求根的办法；证明里的估计只说明根都在圆盘$|z|<\rho$里」。
- `complex-power-series:65`：边界情况改成「这里用的是$E'=E$、$E(0)=1$在整个复平面上成立；只凭一段实轴上$E(x)=e^x$，现在还推不出整个复平面上相等，以后[零点的孤立性与唯一性定理](…identity-theorem)一节会说明其实推得出」。
- `conformal-maps:52`：「正实轴附近有两层」改成「上半平面里的点都盖了两层」。这处「正实轴」原来带着本节第一次出现的英文括注，去掉以后实轴在本节别处没有再出现，自查没有新的提示。
- `_domain.yaml` 平均值性质的简介改成「函数在每一点的值都等于它在以这一点为圆心、含在定义域里的圆周上的平均值；全纯函数和调和函数都有这个性质」。

### 小问题 3：术语表、引文、图

- 「高阶导数公式」进表：id `math.complex-analysis.higher-derivative-formula`，en「Cauchy's integral formula for derivatives」，`definedIn: higher-derivatives`，`anchor: thm-higher-derivatives`。
  - `higher-derivatives`：`:47` 第一次出现标记、括注英文；`:52` 定理写成「**定理（高阶导数公式）**」，起名的话进了卡片；例 1（`:88`）、例 2（`:100`）、误区 3（`:114`）是各块第一次出现，补了标记。
  - `liouville:25`：「由[高阶导数公式](…)」改成先写词、标记、括注英文，链接去掉（浮窗指过去）。
- `complex-numbers:59`：链接文字改成标题「复对数与幂函数」。
- `power-series:42`：改成「比如[泰勒级数](…)一节边界情况里的$e^{-1/x^2}$；本节第 7 题看它换成复变量以后，在原点附近出了什么问题」。原来的「（第 7 题）」想说的是本节第 7 题，写法会被读成那一节的第 7 题。
- `higher-derivatives/distances.svg`：
  - $z$挪近圆心（$|z-a|$从 62 改成 45），$\delta$变大，绿色小圆半径从 29 变成 37.6；$a$留在小圆外面。
  - 「$z+h$」挪到$z$正上方、小圆和虚线圆之间；$z+h$那个点挪到小圆里的左上方，离标注近。
  - 「$\delta$」放在线段 3/4 处、往左上偏 16；$\zeta$挪到$285^\circ$，两条灰线不再贴着$a$，标注放在右下、离开大圆；$C_r$往外挪一点。
  - 图注和替代文字说的都还对，没改。
- `harmonic-functions/level-curves.svg`：「0」挪到正实轴和右下那条对角线之间的空当里，沿$22.5^\circ$方向离原点 36。

### 照同类问题整批找出、一起改的

用 scratchpad 的 `scan-offchain-b23.mjs` 把 11 节的正文和题目扫了一遍。它按整张图算每节的链，列出四类：链外的术语（标了的、没标的）、指向链外小节的链接、后面跟「一节」的链接文字和标题对不对、「第 N 题」「例 N」引文。扫出的逐条看过，下面是要改的：

- 只当节名用的链接文字：`conformal-applications:34`「[复对数](…complex-logarithm#thm-arg-continuous)一节」改成「[复对数与幂函数](…)一节」。改完以后，复分析全部 28 节和这一批改过的别的领域文件，55 处节名链接都和标题一致。
- 链外的词：`harmonic-functions` 第 5 题参考解答「$\nabla u$和方向的内积」（「内积」是线性代数的词，不在链上），改成用链式法则写出$u_x\cdot(q-p)_x+u_y\cdot(q-p)_y$。
- 误区的反驳说过头，33 条逐条看过，另改 4 条：
  - `complex-logarithm:99`：「只在实数里约定立方根取实数时，它才是$-2$」，可$-2$本来就是三个值之一。改成「$-2$只是其中一个，主值是$1+\sqrt3i$；在实数里约定立方根取实数，才把它写成$-2$」。
  - `conformal-maps:81`：「它保的是夹角，不是形状」改成「不保证直线仍是直线」：共形映射把小正方形变成近似的正方形，「不是形状」说过头。另补「（$c\ne0$）」，$x=0$的像是负实轴，不是抛物线。
  - `harmonic-functions:84`：「$v$的共轭调和函数是$-u$」补「（在区域上可以差一个常数）」。
  - `maximum-modulus:104`：「它只说最大值在边界上的某处取到」补成「有界区域上的最大值」。
- 正文里说过头的，用「只有、一定、不可能」这类词搜了 11 节，另改 2 处：
  - `maximum-modulus:43`「有界区域上，$|f|$的最大值只在边界上取到」：常数函数处处取到最大值，补成「$f$不是常数时」。
  - `maximum-modulus:25`「圆周上的值就不可能全比圆心大」：定义里$u$可以是复值，补「$u$是实值时」。
- 扫到但没改的，各一句理由：
  - 基础词：「连续函数」在数学分析起名，这几节当基础词用，批次 22 也没标；「中心」「相似」「交错」「周期」「自由度」和链外同名术语意思不同。
  - 「线性变换」只出现在「分式线性变换」这个词里。
  - `conformal-applications` 第 5 题里的「电势」「导体」是题目文字，照「可标可不标」，题干已经链到电磁学那一节。
  - `conformal-maps` 第 8 题提示的「局部线性近似」，说的是链上 `complex-derivative#thm-local-linear` 那个复数版的近似。
  - 指向链外小节的链接：
    - `cauchy-integral-formula` → `higher-derivatives`、`maximum-modulus`，`conformal-maps` → `power-series`，`complex-power-series` → `identity-theorem` 这几处是预告。
    - `power-series` → `conformal-maps` 是兑现那边的预告。
    - `liouville` → `partial-fractions`、`maximum-modulus` → `poisson-equation` 是旁白。
    - `complex-logarithm` 第 7 题 → `contour-integrals#thm-power-integral`、`maximum-modulus` 第 6 题 → `liouville` 用到了链外的结论，都带着链接。
- 「第 N 题」「例 N」引文：改完以后 11 节的正文和题目里的又逐个对了一遍，都对，包括新写的「本节第 7 题」。

### 检查

- `npm run content`：0 个错误，0 个警告（最后一次改动以后跑的）。
- `npm run verify`：全部一致（382 个小节），`maximum-modulus` 第 2 题「选项 3、4」、`higher-derivatives` 第 3 题都在里面。
- scratchpad 的 `verify-b23.mjs` 128 项仍全部对上。`lint-b22.mjs` 只剩 `complex-logarithm` 的 4 条「主值」误报；`complete-b22.mjs` 11 节完整；公式里没有汉字。
- 层级：只把复分析、多变量微积分换成工作区的文件、别的领域用 HEAD，和 HEAD 比。复分析变的 4 节和改前一样，多余前置 0 处，不存在的前置 0 处。
- 页面：临时网站副本（HEAD 加上我改的文件），768 像素宽，看了改过的 10 节。`maximum-modulus`、`higher-derivatives`、`harmonic-functions`、`conformal-applications` 把提示、解答全部展开（每页点 28 下）。KaTeX 没有报错，没有残留的指令文本，都是`scrollWidth = clientWidth`。「高阶导数公式（Cauchy's integral formula for derivatives）」在 `liouville`、`higher-derivatives` 页面上照常显示。
- 两张 SVG 在页面上量（缩放 2.02 倍），量法照审查：`getBBox` 换到屏幕坐标，沿线每 0.5 像素取点，用 `elementsFromPoint` 排除没画出来的部分（虚线的空当、裁掉的线），再减去线宽的一半。
  - `distances.svg`：文字离线最近 10.1 像素（$a$离它的圆点），其余$z$ 13.0、$z+h$ 14.1、$\zeta$ 16.1、$\delta$ 10.5、$C_r$ 15.7；文字之间最近 33 像素；文字都在画布里。
    - 中途量出$\zeta$压着大圆（−1.8）、$\delta$离线段 1.4、$C_r$离大圆 2.1、$z+h$离虚线圆 6.7，都挪开了再量。
  - `level-curves.svg`：「0」离最近的线（蓝色对角线）11.4 像素。
- 收尾：临时网站副本、进度目录、无头浏览器的配置目录都删了；`.claude/launch.json` 里临时加的 `check-ca-b23r` 删了；服务已停。

### 汇报里的数

审查说得对，术语表原来是 34 条，汇报写的「30 → 49」应是「34 → 53」；加上这次进表的「高阶导数公式」，现在是 54 条。

## 复核

审内容 agent · 2026-11-19。只看这一轮的改动：和快照 `b23-snapshot/` 比，这一批范围里改了 16 个文件，和修订说明列的一致：复分析 `_domain.yaml`，10 节的 `lesson.md`，`maximum-modulus`、`higher-derivatives`、`harmonic-functions` 的 `problems.yaml`，`distances.svg`、`level-curves.svg`。多变量 `vector-identities`、`jacobian` 和 `partial-fractions`、`eigenvalues` 这一轮没有改动。

通过。重要 0 条；遗留小问题 1 处：平均值性质的简介，是我上一轮给的改法带进去的。改一个短语就行，见最后一节，改完不用再复核。

16 节的 `status` 已改成 `reviewed`：新写的 11 节，退回的 `complex-numbers`、`holomorphic`、`cauchy-theorem`、`goursat` 和多变量 `vector-identities`。`jacobian`、`partial-fractions`、`eigenvalues` 没动。

### 逐条核对

- 重要 1：
  - 新的 D 用「开圆盘$|z-z_0|<R$含在$D$里」写，和 `thm-mean-value` 的条件一致。
  - 解答那一步对：$|f(z_0)|$不超过$|f|$在圆周上的平均值，圆周上处处$|f|<|f(z_0)|$时这个平均值小于$|f(z_0)|$。第 1 级提示、解答和答案 C、D 对得上。
  - 验算脚本 `math.complex-analysis.maximum-modulus.ts` 的 D 跟着改了：单位圆盘里取 30 个$z_0$（含$f$的零点），半径取$z_0$到单位圆距离的 0.25、0.5、0.9 倍，圆周上$|f|$的最大值都不小于$|f(z_0)|$；比对结果仍是 C、D。
  - 修订说明整批找的几处，我看了其中 3 个定理：`thm-disc-bound`、`thm-min-harmonic`、`conformal-applications#thm-uniqueness`。用的都是区域里某点取到的最值，沿折线推下去没有问题。
- 小问题 1：
  - 前置：`liouville` 加了 `complex-roots`，`power-series` 加了 `complex-logarithm`。按整张图和 HEAD 比：
    - 层级变了的仍是复分析那 4 节：`harmonic-functions` 22、`liouville` 22、`maximum-modulus` 23、`conformal-applications` 24；
    - 别的领域只有振动与波 `wave-energy` 变了，是那一批自己改的前置；
    - 多余前置 0 处。
  - `complex-logarithm:59` 只用本节前面已经证的：$\Log z$在$D$上全纯、导数是$\frac1z$；去掉原点的平面上没有连续的分支。不再借 `cauchy-theorem` 的原函数。
  - `maximum-modulus` 第 6 题：题干加了链接和「复系数」；（2）的估计自己写出来了，$k<n$、$|z|\ge1$时$|a_kz^k|\le|a_k||z|^{n-1}$，那一步对。
  - `higher-derivatives` 第 3 题提示 1：给的分解通分后分子是$1$，对。
- 小问题 2：6 处都照改了。
  - `maximum-modulus:105`、`conformal-applications:75` 不再说过头；`:75` 引的第 4 题的$79.5$没变。
  - `liouville:94`：证明里$|z|\ge\rho$时$|p(z)|\ge\frac{|a_n|}2|z|^n>0$（`:45`），根确实都在$|z|<\rho$里。
  - `complex-power-series:65`：链接文字和 `identity-theorem` 的标题一致；「复平面」的标记和英文挪到了这一行里第一次出现的地方。
  - `conformal-maps:52`：$z^2$把$0<\theta<\frac{3\pi}2$映到辐角$0$到$3\pi$，上半平面盖两层，正、负实轴各一层，说法对。
  - 平均值性质的简介照我给的改法改了，可那个改法本身漏了条件，见最后一节。
- 小问题 3：
  - 「高阶导数公式」进表：id、英文、`definedIn`、`anchor` 和 `:52` 起名的定理对得上，简介只用 `higher-derivatives` 链上的概念。本领域术语表 54 条（HEAD 34 条）。
  - `higher-derivatives` 的 5 处标记：`:47` 是全节第一次出现、带英文；`:52` 是定理名；例 1、例 2、误区是各块第一次出现。`liouville:25` 改成了术语标记加英文。
  - `complex-numbers:59` 的链接文字是标题「复对数与幂函数」。
  - `power-series:42`：「本节第 7 题」正是$e^{-1/z^2}$那道，指对了。
  - 两张 SVG 在 768 像素宽的页面上重量，都不重叠、不出界：
    - `distances.svg` 文字离线最近 11.7 像素；`level-curves.svg` 的「0」离最近的线 12.9 像素。
    - `distances.svg` 的几何另算过：大圆半径 120，$|z-a|=\sqrt{2000}\approx44.7$，$\delta=120-\sqrt{2000}\approx75.3$，绿色小圆半径$37.6=\delta/2$；$z+h$在小圆里，$\zeta$在$C_r$上，$a$在小圆外。
    - 图注、替代文字仍对。
- 照同类问题另改的 9 处，逐处看过，都对，没有新的说过头或链外的词：
  - `conformal-applications:34` 的链接文字改成了标题；
  - `harmonic-functions` 第 5 题（2）用链式法则写出沿线段的导数，不再借「内积」；
  - 误区 4 条：`complex-logarithm:99`、`conformal-maps:81`（补的$c\ne0$对：$x=0$的像是负实轴）、`harmonic-functions:84`、`maximum-modulus:104`；
  - 正文 2 处：`maximum-modulus:43`「$f$不是常数时」、`:25`「$u$是实值时」。
- 别的领域：`partial-fractions:32`、`eigenvalues:52` 把「代数基本定理」标成复分析的术语，英文括注和「这里不证」都留着。这两节不在 `liouville` 的链上，照规矩 C 反向（`plan.md:246`）当旁白标，对。
- 改了没报的：没有。快照以后，工作区里变分法 `rayleigh-quotient`、常微分方程 `chaos`、电磁学 5 节、光学 2 节也改了，是振动与波那一批加的标记，不在这一批里。

### 遗留小问题（不影响通过，提交前顺手改）

1. `_domain.yaml:499` 平均值性质的简介「……以这一点为圆心、含在定义域里的圆周上的平均值；全纯函数和调和函数都有这个性质」，漏了条件。这是我上一轮给的改法里的措辞。
   - 只要求圆周含在定义域里，后半句就不对：$\frac1z$在去掉原点的平面上全纯，圆周$|z-\frac12|=1$含在这个平面里，$\frac1z$在上面的平均值是$0$（数值积分核过），而$f(\frac12)=2$。
   - `maximum-modulus:23` 的定义要的是含在$D$里的开圆盘内的圆周，也就是圆周连同它围着的圆盘都在$D$里。
   - 改法：改成「……以这一点为圆心、连同圆盘都含在定义域里的圆周上的平均值……」之类，57 字。
   - 同一段的 `:25`「只取含在$D$里的开圆盘内的圆周，是因为$u$要在整个圆周上有定义」只说了一半理由。这句第一轮就有，这一轮同一段改过。圆周在$D$里，$u$在圆周上就有定义；要整个圆盘在$D$里，是因为不然全纯函数也可能不满足，上面的$\frac1z$就是例子。一起补一句。

### 检查

- 三项检查：
  - `npm run content`：0 个错误，0 个警告；
  - `npm run typecheck`：通过；
  - `npm run verify`：全部一致（382 个小节，含复分析 20 节 80 道）。
  - 改完 `status` 以后，content、typecheck 又各跑了一次。verify 是改 `status` 之前跑的，之后只动了 16 行 `status`。
- 页面：网站建到 scratchpad，服务进度写临时 Git 仓库（端口 3149）。768 像素宽，改过的 10 节各点 32 下全部展开：`scrollWidth` 都等于 `clientWidth`，KaTeX 没有报错。
- 收尾：
  - 服务已停；`.claude/launch.json` 里临时加的 `review-serve-complex23r` 已删，别的会话的条目留着；
  - 网站和临时仓库已删，快照 `b23-snapshot/` 已删。
  - 没有提交。

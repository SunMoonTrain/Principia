# 批次 24 审查报告：复分析（零点的孤立性到柯西主值）

审内容 agent · 2026-11-19。和写内容 agent 是两个独立会话。这一批先由 11 位逐节审查员各审一节（读题只用 `npm run statements`，验算完才读 `problems.yaml`，不读设计稿和写稿员汇报），我汇总：先做领域层面的检查，再过一遍逐节结论，最后才读写稿员汇报，只用来找「改了没报的」、看「我替你定的」和「拿不准的」。

审查范围：
- 新写的 11 节、88 道题，`proofPolicy: full`：`identity-theorem`、`laurent-series`、`analytic-continuation`、`singularities`、`residue-theorem`、`real-integrals`、`argument-principle`、`gamma-continuation`（新建）、`jordan-lemma`、`rouche-theorem`（新建）、`cauchy-principal-value`（新建）。写完这一批，复分析 31 节全部写完。
- 10 张 SVG、7 个 `function-plot`；复分析术语表新进 22 条（54 → 76）；单变量微积分术语表新进 1 条「三角函数有理式」（138 → 139）。
- 退回 `written` 的 2 节只看这一轮的改动：复分析 `cauchy-theorem:43`、`:45`，单变量微积分 `trig-integrals:60`、`:95`。
- 跨领域补标：写代码的会话起的 agent 扫过，一个文件没改；逐处复核。
- 快照：写代码的会话开审前拍了 `b24/snapshot-complex-analysis/`（07:36）。写完报告时和工作区比过，`content/math/` 一个字节都没变；物理那边只有热学在动。

## 结论

重要 4 条，小问题 10 条。

- 讲解、例题：推导和数都对，主线定理都在讲解里证完，合乎 `full`；卡索拉蒂-魏尔斯特拉斯定理照安排写成不带定理块的一段，证明在 `singularities` 第 5 题。说错的有 3 处（重要 2–4），说过头、少交代、引文不准的见小问题 4–8。
  - 关键证明逐节核过：`identity-theorem` 的折线加上确界；`laurent-series` 两圈的积分表示（$g$在$\zeta=z$处由莫雷拉定理一节的结论全纯，内圈上的积分为$0$）；`residue-theorem` 先减去各点的主部、再用柯西积分定理；`gamma-continuation` 差商的$\frac{128|h|}{x^2}$估计（乘开后四个指数$\frac{7x}4$、$\frac{5x}4$、$\frac{3x}4$、$\frac x4$都是正的）；`argument-principle` 的$(we^{-L})'=0$；`rouche-theorem` 的$\Log h$；`cauchy-principal-value` 的小半圆引理。
- 题目：
  - 44 道简单题、中等题，11 个验算脚本独立算，全部和标准答案对上；`npm run verify` 全站 393 节全部一致。
  - 44 道难题、思考题的参考解答结论都对；三处推理有小毛病（`residue-theorem` 第 7 题、`laurent-series` 第 8 题、`singularities` 第 6 题的参考解答），`real-integrals` 第 5 题第 3 级提示缺一步，见小问题 6、9。难度档都合适。
  - 11 道选择题、18 个正确选项：A 4、B 5、C 4、D 5，不偏。
- 前置和层级：11 节的层级和安排一致（22、22、23、23、24、25、25、25、26、26、27），全图层级变动 0 节，多余前置 0。逐节审查员沿整条前置链（96–108 节）查过，讲解、例题、题目用到的都在链上；链外的只当旁白，按规矩 C 标了。
- 篇幅：见重要 1。照本领域已审小节的读速，9 节超过 30 分钟，`rouche-theorem` 正好在线上，`laurent-series` 合适。
- 页面：11 节加退回的两节，13 页在 768 像素宽下全部展开（每页点 32 下）：不溢出，行间公式不用拖，KaTeX 0 个报错，0 个占位框，定义卡片都以句号结束；10 张 SVG 文字出画布、重叠、压线、汉字间距提醒都是 0。
- 下游接住：安排里「已写的小节指向这一批」各条都兑现了，逐节审查员逐条打开原文对过；有几处引文指得不准或指代不清，见小问题 7。全图没有以这 11 节为前置的小节。

- **重要 1：`minutes` 普遍估低，照本领域的读速，9 节超过 30 分钟**
  - 涉及：`identity-theorem`、`analytic-continuation`、`singularities`、`residue-theorem`、`real-integrals`、`argument-principle`、`gamma-continuation`、`jordan-lemma`、`cauchy-principal-value` 超过 30；`rouche-theorem` 估低（25），折算正好 30；`laurent-series` 合适。
  - 尺度：批次 22、23 审过的复分析 20 节，讲解加例题 733–1339 个汉字，`minutes` 21–28，每分钟 29.9–51.5 个汉字（中位数 41.0）；两次审查都判「同一个尺度，估得合理」。批次 23 振动与波修订时按每分钟 52 字重估过 `minutes`；批次 18 `angular-momentum` 到每分钟 54.8 字时也改大了。
  - 这一批 11 节讲解加例题 1499–1719 个汉字，比已审最长的 `maximum-modulus`（1339）还长 12%–28%，公式也更多（170–255 个，已审的是 109–220 个），`minutes` 却还是 25–29，每分钟 51.7–65.5 字。写稿员汇报「拿不准的」第 1 条自己也说，按批次 23 的读速多数节会到 31–36 分钟。
  - 按每分钟 52 字折算（已审 20 节里最快的那一档，已经偏宽）见下表；按中位数 41 字算，11 节都在 36–42 分钟。

    | 小节 | `minutes` | 讲解加例题的汉字 | 公式 | 每分钟汉字 | 按每分钟 52 字 |
    | --- | --- | --- | --- | --- | --- |
    | `identity-theorem` | 29 | 1626 | 255 | 56.1 | 31.3 |
    | `laurent-series` | 29 | 1499 | 170 | 51.7 | 28.8 |
    | `analytic-continuation` | 27 | 1618 | 253 | 59.9 | 31.1 |
    | `singularities` | 29 | 1669 | 242 | 57.6 | 32.1 |
    | `residue-theorem` | 27 | 1665 | 238 | 61.7 | 32.0 |
    | `real-integrals` | 25 | 1637 | 179 | 65.5 | 31.5 |
    | `argument-principle` | 29 | 1719 | 245 | 59.3 | 33.1 |
    | `gamma-continuation` | 28 | 1633 | 202 | 58.3 | 31.4 |
    | `jordan-lemma` | 28 | 1600 | 217 | 57.1 | 30.8 |
    | `rouche-theorem` | 25 | 1553 | 202 | 62.1 | 29.9 |
    | `cauchy-principal-value` | 28 | 1658 | 237 | 59.2 | 31.9 |
    | 批次 22、23 的 20 节 | 21–28 | 733–1339 | 109–220 | 29.9–51.5 | — |

  - 数法：只数「讲解」「例题」两个部分里的汉字（含三级标题），不数公式、术语标记的 id 和链接地址；公式是行内、行间公式的个数。脚本是 `identity-theorem` 审查员写的 `b24/rv-identity-theorem/count.mjs`，全领域 31 节用同一个脚本数；各位审查员、写稿员的数法略有出入，结论一样。
  - 为什么列为重要：「不超过 30」是批次 17 之后你定的硬杠，审查要报出来。这回不是一两节估偏，是 11 位写稿员各自只和同批的节比，整批一起偏快了。
  - 改法：先压缩，不拆。讲解加例题压到 1550 个汉字以内（30 × 52）；公式在 240 个以上的 `identity-theorem`、`analytic-continuation`、`singularities`、`argument-principle` 最好压到 1450 上下。压完照实写 `minutes`（汉字数 ÷ 52，向上取整），不超过 30。`rouche-theorem` 不压的话，`minutes` 改成 30。几何图像的说明和常见误区不算在「讲解和例题」里，写稿员汇报里删 function-plot、删误区的办法省不下这里的字数。各节可以动的地方（逐节审查员提的，加上我补的；「别删」的是安排要接住的）：
    - `identity-theorem`：`:38` 的实函数对照和几何图像 `:93` 重复，`:38` 只留「证明里用到全纯的，正是在$\Delta$上等于泰勒级数这一步」，$e^{-1/x^2}$挪到 `:27` 当边界情况（顺带解决小问题 4 的 `:27`）；`:45` 末句和 `:58` 重复；`:67` 末句和 `:58`、误区 2 重复（顺带解决小问题 8 的「不连通」）；`:56` 再紧一紧。
    - `analytic-continuation`：`:58` 第二句和误区 1 第三句说的是同一件事，留一处；`:34` 两个不相交的开圆盘就是 `identity-theorem:58` 的例子，改成一句回指；`:45` 的凸性论证缩成一句；`:51` 复述 `power-series` 第 8 题，和 `:16` 重复，删短。
    - `singularities`：`:82` 间断点对照 126 字，压到 50 字上下（顺带解决小问题 4 的 `:82`）；`:69` 第二句（幂级数展开一节第 4、5 题）和 `:51` 重复；例 2 约 108 字，可以删掉或改成题目（例题 1 到 2 道）；`:36`「为什么这样定义」精简。
    - `residue-theorem`：`:57` 的部分分式旁白（约 40 字）；`:42` 柯西主值的预告；`:55` 末句（`:16` 开头用过那道题）；`:40` 第二句缩短；例 2「为什么想到这么做」缩 20 字左右。别删：`:55` 里 `cauchy-integral-formula` 误区 2 和 `higher-derivatives` 第 3 题的两组留数，`:62`「有界闭区域里只有有限个极点」（`gamma-continuation:130` 要用）。
    - `real-integrals`：例 1 末尾用$x=\tan t$核对那一段（`:105`）；`thm-trig-period` 的证明精简；`:41` 后半句的回指缩短。
    - `argument-principle`：`:51` 零点有限的证明压成一两句；`:64`、`:82` 两段「为什么这样定义」各有两处回指，各留一处；`:55`、`:95` 两段「为什么有用」合并；`:33`「像对数一样把乘积变成和」和 `:22` 重复。压不下来见「需要你决定的」第 1 条。
    - `gamma-continuation`：`:59` 的引子（`:62` 的定理和 `:87` 的图注都说了）；`:55`「为什么这样证」压成一句；`:44` 只留一句；`:79` 第二句（`:108` 的图注说了）；例 1 末行取$n=3$的核对。
    - `jordan-lemma`：`:86` 第一句和 `real-integrals:81` 重复，改成回指；`:88` 里$\lambda<0$取共轭已经在 `:54`、误区 2、第 5 题讲过，「次数一样时发散」在误区 3；`:63`「为什么这样定义」压短；`:52` 和几何图像重复的半句。
    - `cauchy-principal-value`：`:37` 的引子和 `:52` 都在算$\frac1z$沿半圆是$-\pi i$，留一处；`:104` 的收敛说明在改完重要 4 以后可以缩成一句；`:118` 实部那段和误区 1 重复，留一处；`:29`、`:31` 精简。
    - `rouche-theorem`：`:54` 第一句和例 1「为什么想到这么做」（`:68`）是同一件事；`:35` 后半段用$h$讲的牵狗图景和 `:22`–`:24`、几何图像重复；`:50` 前两句复述 `:41`。

- **重要 2：`singularities:146` 误区 2 的反例不满足误区的前提**
  - 误区是「沿实轴趋于$a$时$|f|\to+\infty$，$a$就是极点」，反驳用$e^{1/z}$：「沿正实轴趋于$+\infty$，沿虚轴它的模恒为$1$」。
  - 可$e^{1/z}$沿实轴并不趋于无穷：$x\to0^-$时$e^{1/x}\to0$，紧挨着的误区 1（`:145`）自己就写了「它沿负实轴趋于$0$」。反例不满足要反驳的说法的前提，这条反驳不成立；两条误区连着读，读到的是互相矛盾的两句。
  - 改法任选一种：
    - 误区改成「沿正实轴（或某一条射线）趋于$a$时$|f|\to+\infty$，$a$就是极点」，和 `:71`「只沿一条射线$|f|\to+\infty$不够，见下面的$e^{1/z}$」一致，反驳不动；
    - 保留「沿实轴」，反例换成$e^{1/z^2}$：实轴两侧都有$e^{1/x^2}\to+\infty$，沿虚轴却是$e^{-1/y^2}\to0$（这个函数换个符号，`:80` 已经讲过）。

- **重要 3：`real-integrals:83` 的边界情况，把「要换更细的估计」说成了只看有没有$e^{ix}$**
  - 原文：「分母只比分子高一次时，大半圆上的积分不再趋于$0$（第 8 题）；被积函数里还带着$e^{ix}$这样的因子时，要换一个比 ML 不等式更细的估计，见[若尔当引理与傅里叶型积分]一节。」
  - 分号后面那句单独成句，最自然的读法是「带$e^{ix}$就要若尔当引理」。这和同一节例 2 矛盾：$\frac{e^{iz}}{z^2+1}$带着$e^{iz}$，`:119` 用的正是 ML 不等式。`:125` 和安排（`plan.md:1735`）都说只有分母比分子高一次时才要若尔当引理，这正是拆出 `jordan-lemma` 时要讲清的那条分界。
  - 几何图像的说明 `:89`「$\rho\to+\infty$时圆弧上的积分趋于$0$」也没带次数条件，第 8 题就是反例。那句是在说图里的$\frac1{z^2+1}$，问题小，一起改。
  - 改法：把两个分句接成一个条件，例如「分母只比分子高一次时，大半圆上的积分不再趋于$0$（第 8 题）；这时被积函数里要是还带着$e^{ix}$这样的因子，积分仍可能收敛，只是要换一个比 ML 不等式更细的估计，见……」。`:89` 改成「分母比分子至少高$2$次时，$\rho\to+\infty$时圆弧上的积分趋于$0$」，或者明说是图里的$\frac1{z^2+1}$。

- **重要 4：`cauchy-principal-value:102`「积分本身收敛不收敛，围道管不了」在例 1 里不对**
  - 例 1 的推导（`:112`）里，实轴上两段合起来是$2i\int_\varepsilon^R\frac{\sin x}x\,\dd x$，围道上的等式让它等于另外两段积分之和的相反数，那两段在$\varepsilon\to0^+$、$R\to+\infty$时各自有极限。$\frac{\sin x}x$在$0$处补上值就连续，所以这个极限存在，本身就说明$\int_0^{+\infty}\frac{\sin x}x\,\dd x$收敛。
  - 同一节第 6 题的第 3 级提示（`problems.yaml:137`）和参考解答（`:143`）正是从围道推出「两个积分都收敛」的，和例 1 的说法互相矛盾。读者会以为围道永远证不了收敛。
  - 围道真正管不了的是「两侧各自收敛」：被积函数不是偶函数时，对称的极限推不出反常积分收敛。例 1 末段的$\frac{\cos x}x$（`:118`）和常见误区第 1 条讲的就是这个。
  - 改法：这句改成准确的说法，例如「围道给出的是对称挖去以后的极限；$\frac{\sin x}x$是偶函数，两段合起来是$2i\int_\varepsilon^R\frac{\sin x}x\,\dd x$，这个极限存在就说明积分收敛。也可以先用实分析看一遍收敛：」。`:104` 照安排用 `improper-integrals` 第 6 题说明收敛的那段可以留（压篇幅时缩成一句），只是别再说「围道管不了」；「对称地挖，偶的虚部算得出来，奇的实部只剩主值」可以放到 `:118`。

- **小问题 1：只加锚点的「连续辐角」「柯西型积分」，第二节也当名词用了**（`_domain`、`argument-principle`、`rouche-theorem`、`gamma-continuation`）
  - 「连续辐角」：`argument-principle:62` 起名、只加锚点 `def-continuous-arg`，写稿员定的是「只本节用、不进表」。可 `rouche-theorem:35` 在句子里当名词用了它：「$f(z(t))$的[连续辐角](…#def-continuous-arg)（continuous argument）加上$\Arg h(z(t))$，就是$(f+g)(z(t))$的一个连续辐角」。照 `plan.md:248`「两节以上用到的名词就进术语表」「链接文字在句子里当名词用的也算用到」，该进复分析的表：`definedIn: math.complex-analysis.argument-principle`，`anchor: def-continuous-arg`，简介例如「$w(t)$在$[\alpha,\beta]$上连续、不为$0$时，对每个$t$都是$w(t)$的一个辐角的连续实函数$\theta(t)$；两个连续辐角只差$2\pi$的整数倍常数。」（48 字）。两节各块第一次出现补标，`rouche-theorem:35` 照「先把词写出来、标记，再放链接」改。两节都是这一批的，不退回别的节。逐节审查员两边都漏了，是我补的。
  - 「柯西型积分」：`gamma-continuation:44`「和[柯西型积分](…higher-derivatives#thm-cauchy-type)的定理一样」把链接文字当名词用，也没括注英文。批次 23 定它只加锚点，前提是只有 `higher-derivatives` 一节用。推荐不当名词用，写成「和[高阶导数与莫雷拉定理](…#thm-cauchy-type)一节第一个定理的证明一样」；要保留这个词，就括注 Cauchy-type integral、进表，并在 `higher-derivatives` 起名处补标（那一节要退回 `written`）。

- **小问题 2：两条定理的简介少了条件，圆环的简介和定义句不贴切**（`_domain`、`laurent-series`）
  - 若尔当引理（`_domain.yaml:687`）漏了「$g$在$C_R$上连续」，讲解 `jordan-lemma:36` 写了。补上以后 32 字。批次 23 平均值性质的简介，也是复核时补的条件。
  - 辐角原理（`_domain.yaml:678`）只写了结论，没写$f$在$C$上全纯、不为$0$，在$C$里面除有限个极点外全纯；没有这些，积分和$N-P$都谈不上。可以写成「$f$在$C$上全纯、不为$0$，在$C$里面除有限个极点外全纯时，$\frac1{2\pi i}\oint_C\frac{f'}f\dd z$是$C$里零点数减极点数（按阶计），也是$f(C)$绕原点的圈数。」（53 字）。这一条逐节审查员没提，是我补的。
  - 圆环（`_domain.yaml:543`）「两个同心圆周之间的区域」在$r=0$（没有内圈）、$R=+\infty$（没有外圈）时不贴切。可以写成「以$a$为中心的$r<|z-a|<R$（$0\le r<R\le+\infty$），一般夹在两个同心圆周之间；$r=0$时就是去心圆盘。」（33 字）。
  - `laurent-series:25` 的定义句「$r=0$时它是$0<|z-a|<R$，即开圆盘去掉圆心，叫作去心圆盘」：$R$可以是$+\infty$，而开圆盘的半径是有限的。$R=+\infty$的情形到 `:27` 的边界情况才补，可例 2 和第 4 题都把$0<|z|<+\infty$叫去心圆盘。把「$R$有限时是开圆盘去掉圆心，$R=+\infty$时是去掉$a$的整个平面」写进定义句，`:27` 相应删短。

- **小问题 3：四节的一句话总结少了条件**（`identity-theorem`、`argument-principle`、`rouche-theorem`、`cauchy-principal-value`）
  - `identity-theorem:10`「在区域内收敛的点列上相等就恒等」漏了「互不相同」：常数点列也在区域内收敛。例如「不恒为$0$就零点孤立；在区域内收敛的互异点列上相等就恒等。」（28 字）
  - `argument-principle:10` 没写按阶计，正好可以读成常见误区第 1 条。加「（按阶计）」以后 27 字。
  - `rouche-theorem:10` 漏了「$f$、$g$全纯」。照字面读，`:37` 自己举的$f=1$、$g=\frac1{2z}$就是反例。例如「$f$、$g$全纯，$C$上$|g|<|f|$时，$f+g$和$f$在$C$里的零点一样多（按阶计）。」（29 字）
  - `cauchy-principal-value:10`「小半圆上的积分趋于$-\pi i$乘留数」没说方向，第 7 题正好说明逆时针的下半小半圆趋于$+\pi i$乘留数。例如「柯西主值是对称挖去后的极限；顺时针小半圆上积分趋于$-\pi i$乘留数。」（30 字）

- **小问题 4：讲解里说过头或少交代（前三节）**（`identity-theorem`、`analytic-continuation`、`singularities`）
  - `identity-theorem:117` 误区 3 的反驳「保证有限的，是含在定义域里的有界闭区域里的零点」漏了「定义域是区域」，紧挨着的误区 2 就是反例（两个不相交的开圆盘，一个上取$0$）。改成「定义域是区域时，保证有限的是……」（`plan.md:342`，误区的反驳也不能说过头）。
  - `identity-theorem:27` 的「边界情况」只是一句往后指的问句（「会不会在某点各阶导数都是$0$，由下面的引理回答」），不是具体的边界情形。换成具体的：实函数$e^{-1/x^2}$（在$0$处补上$0$）在$0$处各阶导数都是$0$，找不到这样的$m$；区域上的全纯函数不会这样（下面的引理）。然后删掉 `:38` 里同样的话，也省篇幅。
  - `identity-theorem:70`「有界闭区域……即包括边界在内、能放进某个圆盘里的区域」：同一块 `:63` 刚把「区域」标成本领域的术语（连成一片的开集），这里又说「包括边界在内的区域」。名字是安排定的（多变量微积分的说法），句尾可以改成「……能放进某个圆盘里的集合（它不是开集）」；不改也行，写一句理由。
  - `analytic-continuation:27`「要求$F$全纯，延拓才是唯一的」：「才」说过头，要求实部、虚部实解析时也唯一（`plan.md:342` 的「才」）。改成「要求$F$全纯，延拓就是唯一的（下面的定理）」，后半句不变。
  - `analytic-continuation:56` 少交代一句：按 `:54` 的定义，「$f_k$是$f_0$沿$\gamma$的解析延拓」是选定一组分点和圆盘以后说的，换一组，终点处得到的函数还是不是同一个，讲解没说。可例 2 问「得到什么函数」、第 4 题问「延拓回来的函数」、误区 1 说「延拓结果」，都当成唯一确定的（这本身对）。在「$f_j$就定了（只要存在）」后面补一句「换一组满足条件的分点和圆盘，终点附近得到的函数也一样（这里不证）」。
  - `singularities:82` 间断点对照有两处说过头：
    - 「可去奇点和可去间断点……都是补上（或改掉）一个值就好，别的类就不能一一对应了」读着像可去这一类能对上，可下一句的$e^{-1/x^2}$正是可去间断点换成$z$成了本性奇点；安排说「别写成一一对应」。
    - 「跳跃间断点这一类在这里没有」：$e^{-e^{1/z}}$在去掉$0$的平面上全纯，限制在实轴上，$x\to0^-$时趋于$1$、$x\to0^+$时趋于$0$，是跳跃间断点，$0$却是它的本性奇点（逐节审查员数值核过）。后半句的理由「全纯又有界就是可去奇点」证的是「在$a$附近有界却没有极限」这种情形不存在。
    - 改法：两边只有「补一个值就好」这个意思相通，实轴上属于哪一类，定不了换成$z$以后属于哪一类；跳跃间断点那种「附近有界、却没有极限」的情形这里没有，去心圆盘里全纯又有界就是可去奇点。这一段第一次出现的「间断点」括注 point of discontinuity。压篇幅时这一段本来就要压（重要 1）。

- **小问题 5：讲解里说过头或少交代（后四节）**（`residue-theorem`、`real-integrals`、`cauchy-principal-value`、`gamma-continuation`）
  - `residue-theorem:102` 误区 3「定理只要求$f$在$C$上和$C$里面除有限个点外全纯」，可以读成例外的点也能落在$C$上，和 `:42`「奇点落在$C$上时定理不管」矛盾。改成「$f$在$C$上全纯、在$C$里面除有限个点外全纯」，和术语表简介一致。
  - `real-integrals:129` 误区 1「$\frac1{iz}$和$z^{-1}$的各次幂还会在$0$处带来极点」：「会」说过头，第 1 题化出的$\frac2{z^2+6iz-1}$在$0$处就没有极点，第 4 题提示 2 也说了。改成「还可能」。
  - `cauchy-principal-value:52`「小半圆只走一半，方向又相反，得$-\pi ic$。这一段和半径无关」：一般的$f$在$\gamma_\varepsilon$上的积分不等于$-\pi ic$，也随$\varepsilon$变（例 1 的$\frac{e^{iz}}z$是$-\pi i+O(\varepsilon)$）；和半径无关的只是$\frac c{z-x_0}$那一部分（`:37` 说$\frac1z$时是对的）。改成「……极限是$-\pi ic$，不是$0$，$\varepsilon$再小这一段也不会消失」。
  - `cauchy-principal-value:73`「$Q$没有实根时，这就是有理函数那条定理和若尔当引理一节的定理」：那两条还证了积分本身收敛（`real-integrals:63` 是绝对收敛，`jordan-lemma:66` 是两个积分都收敛），这里的定理只给主值。改成「……公式和那两条定理一样（那两条还证明了积分本身收敛，柯西主值就等于它）」。
  - `gamma-continuation:46` 边界情况只说$\Re z\le0$时积分「不绝对收敛」，就下结论「积分只在右半平面上给出$\Gamma$」；可两段之前（`:29`）刚强调过收敛不一定绝对收敛。实际上积分本身也发散（$t\to0^+$那一端）。补半句「其实积分本身也发散」，或者把结论改成不靠这个理由的说法。

- **小问题 6：证明和解答里的小缺口**（`identity-theorem`、`argument-principle`、`rouche-theorem`、`residue-theorem`、`real-integrals`、`singularities`）
  - `identity-theorem:54` 唯一性定理证明的末句「互不相同的$z_n$除至多一项外都落在这个圆盘里，矛盾」：「除至多一项外」接到了「落在圆盘里」上，没说出矛盾要的是圆盘里有异于$z^*$的零点。改成「$n$足够大时$z_n$都落在这个圆盘里，它们互不相同，至多一项等于$z^*$，其余都是$h$在圆盘里异于$z^*$的零点，矛盾」。
  - `argument-principle:51` 第二句「$f$在$C$上不为$0$，极点附近$|f|\to+\infty$，所以$f$在$z^*$附近全纯、$f(z^*)=0$」次序颠倒：「$C$上不为$0$」不是「附近全纯」的理由，是得出$f(z^*)=0$以后排除$z^*\in C$用的。整个证明是对的。改成「$z^*$不是极点（极点附近$|f|\to+\infty$），所以$f$在$z^*$附近全纯，由连续性$f(z^*)=0$；$f$在$C$上不为$0$，所以$z^*$在$C$里面……」，后面不动。
  - `rouche-theorem:33`「所以$\frac{h'}h$在$U$上有原函数」缺了连续性：本领域原函数的定义（`cauchy-theorem:50`）要被积函数在开集上连续，`thm-antiderivative-integral` 也要用到。补一句「$h'$也全纯（[导数自动连续](…higher-derivatives#thm-derivative-continuous)），$h$在$U$上不为$0$，所以$\frac{h'}h$在$U$上连续」，`argument-principle:44` 就是这样写的。
  - `residue-theorem` 第 7 题参考解答（`problems.yaml:147`）「$F_2$的系数的模更小」：两个级数的同次项对不上（$F_2$里$w^{n-1}$的系数是$\frac{a_{-n}}{1-n}$，主部里是$a_{-(n-1)}$），逐项比较这一步不成立，结论对。改成比较$wF_2$和主部，或者说$\sum c_nw^{n-1}$和$\sum c_nw^n$的收敛半径相同。参考解答网页不显示。
  - `real-integrals` 第 5 题第 3 级提示（`problems.yaml:101`）直接用$z_+$处的留数；单位圆里为什么是$z_+$，第 2 级提示只说「验证它是$z_+$」，写出来的只在不显示的参考解答里。照「第 3 级是完整解答」，补一句「$|z_+|=\frac{a-\sqrt{a^2-b^2}}{|b|}<1$，因为$a-|b|<\sqrt{a^2-b^2}$（两边平方就是$|b|<a$）」。这一条取决于「需要你决定的」第 4 条。
  - `singularities` 第 6 题参考解答（`problems.yaml:116` 起）的例子$f=1$取$C=R^{3/2}$，默认了$R$有限；写「例如取$R=1$」即可。网页不显示。

- **小问题 7：引文指错或指代不清**（`laurent-series`、`analytic-continuation`、`argument-principle`、`residue-theorem`、`gamma-continuation`、`jordan-lemma`、`real-integrals`）
  - `laurent-series:48`「（后者见那一节的边界情况）」：同一句前面最近提到的是 `higher-derivatives`、`cauchy-theorem`。前者没有这件事；后者在 `:45`（变形积分路径后面的「为什么有用」）说了，但不是边界情况；写成边界情况的是开头只提过一次的 `cauchy-integral-formula:35`（「所以积分是$0$，不是$f(z)$」）。读者照「那一节」去找会找错。写明链接：指 `cauchy-integral-formula#thm-cauchy-formula`，或者两个积分一起指 `cauchy-theorem#thm-deformation` 后面的说明（$a$在$C$里面、外面两种情形都讲了）。
  - `analytic-continuation:16`、`:51` 都说「全纯函数的幂级数展开一节第 8 题」里负实轴下方的和比$\Log z$大$2\pi i$：那道题第（3）问的答案只在参考解答里，网页不显示，三级提示也没提；页面上写出这件事的是那一节的常见误区第 2 条（`power-series:96`）。改成「那一节的常见误区和第 8 题」；`:51` 再补半句理由（$F$连续地越过负实轴，虚部在$\pi$附近，$\Log z$的在$-\pi$附近，两者都满足$e^w=z$，所以差$2\pi i$）。
  - `argument-principle:71`「（理由和复对数与幂函数一节第 7 题（3）相同）」：那道题看得到的第 3 级提示里没有「差除以$2\pi$连续、只取整数」这一步，只有参考解答里有。改指 `complex-logarithm#def-branch`（那一段的边界情况就是这个推理），或者删掉括注，这一句自己已经把推理写全了。
  - `residue-theorem:62`「照[那条推论]的证明」：这一节前文没提过推论，「那条」悬空。写明是零点的孤立性与唯一性定理一节「有界闭区域里只有有限个零点」那条推论。
  - `gamma-continuation:68`「（第 5 题是另一种写法）」、`:70`「见第 7 题」紧跟在「伽马函数一节第 7 题」「第 8 题」后面，容易读成数学分析那一节的第 5、7 题（那一节也有，内容不同）。照 `power-series:42` 的写法改成「本节第 5 题」「见本节第 7 题」。`:70`「满足$f(z+1)=zf(z)$」里的$f$没交代，写成「$f(z)=\Gamma(z)\bigl(1+\frac12\sin2\pi z\bigr)$也在$D$上全纯，满足……」。
  - `jordan-lemma:63`「$\cos\lambda z$、$\sin\lambda z$的模却随$|y|$指数增长（[用留数计算实积分]一节例 2）」：那个例题只说了$\cos z$在顶点$i\rho$处等于$\cosh\rho$，没讲$\sin z$。两者的模随$|y|$增长写在 `complex-functions#thm-sin-modulus`（$|\sin z|^2=\sin^2x+\sinh^2y$），在链上。改指那里，或者两处都给。（收尾写稿员把这里原来的「那一节」改成了现在的链接，比原来好，只是还差这一点。）
  - `real-integrals` 第 7 题（`problems.yaml:142`）「讲解里的例 2」：例 2 在例题部分，改成「例 2」。

- **小问题 8：术语标记、英文括注漏了**（`identity-theorem`、`singularities`、`cauchy-principal-value`）
  - `identity-theorem:58`「（[柯西积分定理]一节讲原函数时用过）」：「原函数」是本领域的术语（`math.complex-analysis.antiderivative`），在这一块第一次出现，没标。写成`:term[原函数]{id="math.complex-analysis.antiderivative"}`；它是批次 7 认定的基础词，不用括注英文。
  - `identity-theorem:67`「换成不连通的开集就不成立」：「连通」在本领域和链上都没出现过，也没括注；本领域的说法是「连成一片」（`complex-derivative:25`、本节误区 2）。改成「不连成一片的开集」，或者随压缩篇幅整句删掉（它和 `:58` 重复）。
  - `singularities` 第 8 题第 2 级提示（`problems.yaml:162`）的「唯一性定理」「区域」是这一节第一次出现（讲解、例题里都没有），没括注英文；「唯一性定理」还和电磁学的同名定理重名。标成`:term[唯一性定理]{id="math.complex-analysis.identity-theorem"}`，浮窗就分得清；「区域」括注 domain。
  - `cauchy-principal-value` 第 8 题题干（`problems.yaml:180`）的「主部」是这一节网页上第一次出现，没括注 principal part；可以顺手标 `math.complex-analysis.principal-part`。

- **小问题 9：思考题的结论，讲解里先说了**（`laurent-series`、`argument-principle`、`residue-theorem`）
  - 规矩只禁止讲解里写出简单题、中等题的答案，这几处不算违规，但思考题没什么可想的了。
  - `laurent-series:34` 的边界情况已经写了「$\sum_{n=-\infty}^{\infty}z^n$哪里都不收敛，非负次幂的部分要$|z|<1$，负次幂的部分要$|z|>1$」，正是第 8 题（1）的答案。讲解换一个例子（如$\sum_{n\ge0}z^n+\sum_{n\ge1}2^nz^{-n}$，一半要$|z|<1$，另一半要$|z|>2$），或者第 8 题（1）改问别的级数。同一题参考解答（3）的末句（`problems.yaml:169`）「才谈得上它的和」说过头：$\sum_{n\ne0}\frac{z^n}{n^2}$在$|z|=1$上每一点两部分都收敛，按 `:32` 的定义是有和的；改成「才谈得上全纯的和函数、逐项积分和系数公式」。
  - `argument-principle:140` 误区 3 写明了「零点、极点一样多时它也是$0$（见第 8 题）；$f$没有极点时，这个推断才对」，等于先说出了第 8 题（1）的结论和（2）的全部答案。去掉误区 3 里的「（见第 8 题）」和具体结论，或者第 8 题（2）换成讲解没答过的追问（例如积分为$0$、$C$里面恰有两个一阶极点时，零点可能怎样分布，并让读者画像曲线）。
  - `residue-theorem` 第 7 题（1）要举「留数为$0$的极点」，`:27` 和误区 1 都举过$\frac1{z^2}$；（2）问为什么$n\ne-1$的项没有贡献，`:22`、`:36` 已经写了道理。（1）可以改问讲解没说过的（一阶极点处的留数能不能是$0$；本性奇点的例子$e^{1/z^2}$保留），（2）并进（3）当引子。

- **小问题 10：题目的措辞和记号**（`laurent-series`、`jordan-lemma`、`real-integrals`、`residue-theorem`）
  - `laurent-series` 第 7 题（2）（`problems.yaml:132`）：傅里叶级数在链外，只标了术语，这可以；可题干没给傅里叶系数起名，浮窗和数学分析那一节都把它记作$a_n$、$b_n$，和本题的洛朗系数$a_n$撞名，参考解答自己改记成$A_n$、$B_n$。在题干里写明「记$F$的傅里叶系数为$A_n=\frac1\pi\int_{-\pi}^{\pi}F(\theta)\cos n\theta\,\dd\theta$、$B_n=\frac1\pi\int_{-\pi}^{\pi}F(\theta)\sin n\theta\,\dd\theta$（用大写，免得和洛朗系数混）」，（3）也写成$A_n$；段落超过 4 句就另起一段。同一题第 3 级提示（`:141`）和参考解答又推了一遍第 6 题（1）的$|a_n|\le\frac{M(\rho)}{\rho^n}$，改成引用第 6 题（1）。
  - `jordan-lemma` 第 3 题第 2、3 级提示和解答（`problems.yaml:62`–`:68`）把上半平面的根记作$a_1$、$a_2$，还写「在根$a$处的留数」。这一批定的是留数定理里的奇点写$z_1,\dots,z_n$（$a_n$留给洛朗系数，`plan.md:1736`），本节讲解的定理写的也是$z_k$。改成$z_1$、$z_2$、「在根$z_k$处」，$ia_1$、$e^{ia_1}$等跟着改。
  - `jordan-lemma:29`「这条弦就是$y=\frac{2t}\pi$」：本节的$y$一直是$\Im z$（`:24`的$y=R\sin t$，图里的「y < 1/λ」）。改成「这条弦上横坐标为$t$的点高$\frac{2t}\pi$」。
  - `jordan-lemma` 第 2 题题干（`problems.yaml:23`）问「哪些只用 ML 不等式不够」：把$C_R$分成两端的小弧和中间一段，各段分别用 ML 不等式，A、B 也能证出来；题目要的是「在整个$C_R$上用，$|e^{i\lambda z}|$按$\le1$估」，这个前提现在只在第 1 级提示里。题干括号里补一句；误区 1（`lesson.md:152`）同样写成「在整个$C_R$上用 ML 不等式」。按 `plan.md:342`「选项的前提要写全」的意思，免得按字面读的读者被判错。
  - `real-integrals` 第 6 题（2）（`problems.yaml:120`）「证明$\rho\to+\infty$时$\int_{\Gamma_\rho}\frac{\dd z}{1+z^3}\to0$，并求出这个积分」：「这个积分」紧跟在$\int_{\Gamma_\rho}$后面，可以读成求圆弧上的积分。改成「并求出$\int_0^{+\infty}\frac{\dd x}{1+x^3}$」。
  - `residue-theorem` 第 1 题第 2、3 级提示（`problems.yaml:12`、`:14`）和第 3 题第 2 级提示（`:58`）用了$f(z)$、$f$，题干没起这个名字。在第 1 级提示开头补「记$f(z)=\frac{z+2}{(z-1)(z+3)}$」「记被积函数为$f$」。

## 改了没报的

没有。
- `git status` 里复分析和单变量微积分的改动、新文件，和写稿员汇报「九、改了哪些文件」一一对上：11 节的 `lesson.md`、`problems.yaml` 和 10 张 SVG，复分析 `_domain.yaml`（只在末尾加了 22 条），`cauchy-theorem/lesson.md`（两处补标、`status`），单变量微积分 `_domain.yaml`（加 1 条）、`trig-integrals/lesson.md`（两处补标、`status`）。
- 文件头里改了的标题、goal、前置（`laurent-series`、`analytic-continuation`、`singularities`、`real-integrals`、`argument-principle`、`jordan-lemma` 的，三个新节的整个文件头）是写代码的会话照安排改进大纲的（工作区里，未提交），逐条和安排对过，写稿员没再动。三个新节的 `lesson.md` 在 HEAD 里还没有，所以显示成新文件。
- `tools/verify/` 下 11 个 `math.complex-analysis.*.ts` 是逐节审查员的验算脚本，都只 import 已有的 `lib.ts`、`_complex.ts`，没改共用文件。
- 工作区里另有热学这一批的文件（别的写稿员的），提交复分析时别带上。
- 汇报里的数核过：术语表 54 → 76、138 → 139，11 节 50 个锚点，选择题字母表，都对。

## 需要你决定的

下面 4 条由写代码的会话定；每条都写了我的推荐。

1. **复分析篇幅的尺度，和超了的节压还是拆**（重要 1）。
   - 推荐：照本领域已审小节的读速，讲解加例题以每分钟 52 个汉字为上限；这一批 9 节压缩，`rouche-theorem` 改 `minutes`，都不拆。压到 1550 字以内，各节删的大多是重复的回指和旁白，安排要接住的都不用动。
   - 例外是 `argument-principle`（1719 字，最长）：压不到 1550 的话，逐节审查员给的拆法是把「连续辐角与绕数」拆成单独一节，前置 `cauchy-theorem`、`complex-logarithm`（链上已经有 `complex-exponential`、`complex-derivative`、`mean-value-theorem`、`conservative-fields`），估在第 19 层；辐角原理仍是第 25 层，儒歇定理第 26 层，已写小节层级不变。拆的话，`cauchy-theorem:45` 的「绕数」和 `residue-theorem` 第 8 题（3）的预告改指新节，「绕数」（和小问题 1 的「连续辐角」）的 `definedIn` 跟着改。这个层级是审查员手算的，要拆请用 `levels.mjs` 试算。`progress/` 里没有这几节的记录，拆分不用迁移。
   - 另一种是接受这一批更高的密度，只把 `minutes` 改成 30。不推荐：读者实际要 31–33 分钟（按中位数要 36–42 分钟），等于让「不超过 30」失效。
2. **术语标记边界上的空格**（写稿员「拿不准的」第 2 条）。编译器只在行内公式两侧自动加空格，不管术语标记的边界：
   - `某个:term[$m$阶零点]` 页面上是「某个m 阶零点」。`generated/` 里核过：「的某个」后面紧跟的 `x-term` 第一个子节点就是公式，中间没有空格；同一节「是某个 $m$」那样的普通公式就有。这一批前面紧挨汉字的有 6 处（`identity-theorem:25`、`:41`，`singularities:56` 两处，`argument-principle:36`，`rouche-theorem:48`），内容里没法手动解决；写稿员数的 9 处里另 3 处（`analytic-continuation:58`、`argument-principle:49`、`rouche-theorem:27`）前面是全角标点，不受影响。全站还有：复分析已审的 `complex-logarithm:69`、`complex-exponential:65`、`complex-roots:32`、`:44`、`:94`，单变量微积分十几处（`:term[$\frac00$型]`、`:term[$k$阶无穷小]`、`:term[$\delta$函数]`），热学这一批的 `:term[$p$-$V$图]` 8 处。
   - `由:term[ML 不等式]` 是「由ML 不等式」：这一批 7 处已经手动加了空格；批次 22、23 已审的 `goursat:31`、`:46`、`:61`，`higher-derivatives:37`，`power-series:31`，`liouville:25`、`:43`，`contour-integrals:113` 还是这样。
   - 推荐改编译器：术语标记的第一个、最后一个子节点是公式或拉丁字母时，和相邻的汉字之间也留一个空格（手动写的归成一个）。改了以后这一批手动加的空格留着也没事。
3. **数学整数题的作答提示**（写稿员「拿不准的」第 3 条）。这一批 8 道整数题照 `plan.md:168` 加了 `exact: true`，作答框下的提示是 `shared/problem-text.ts:6` 的「填整数，可以写 0x、0b 开头的十六进制、二进制」，是给计算机题写的，放在复分析里显得怪。推荐提示按学科区分（数学只写「填整数」），`exact` 留着；不改代码的话，把这 8 处 `exact: true` 去掉，答案不变。
4. **难题、思考题第 3 级提示写多完整**（写稿员「拿不准的」第 4 条）。`plan.md:284` 说三级提示「依次是方向、关键步骤、完整解答」，界面也这样标。复分析已审的 20 节和这一批前 5 节写的是最后一步的提示（第 3 级的长度约是参考解答的 4%–23%），后 6 节写得完整得多（`real-integrals` 约 30%，`cauchy-principal-value` 约 70%，`gamma-continuation` 比参考解答还长）。难题、思考题的参考解答网页不显示，第 3 级是读者唯一看得到的完整解答。推荐照 plan 的字面定成「完整解答」，以后各批照写；这一批前 5 节和已审的 20 节不回改（两种都能用），只把小问题 6 里 `real-integrals` 第 5 题缺的那一步补上。要是定成「最后一步」，后 6 节也不用回改，小问题 6 那一条可以不改。

## 写稿员「我替你定的」

收尾定的 5 条：
1. `:term[ML 不等式]` 前面紧跟汉字的一律写成「由 :term[ML 不等式]」（7 处）：同意，合「中文与英文之间加空格」；根本的办法见「需要你决定的」第 2 条。
2. `laurent-series` 不补「这个系数以后叫留数」：同意。那样写是起名，要加锚点，而留数在 `residue-theorem` 定义；`:64` 已经指过去。
3. `analytic-continuation` 第 2 题 C 项换成$\frac1{(1-z)^2}$：同意。原来的$\frac2{2-z}$就是讲解开头判过的例子把$z$换成$\frac z2$；新的要先逐项求导才认得出，正确选项仍是 A、C，逐节审查员的验算脚本按新题算过。
4. 第 3 级提示的详略、上半平面的括注、`minutes` 交给审查：`minutes` 见重要 1；提示的详略见「需要你决定的」第 4 条；上半平面、右半平面括不括注，两种都过过审，不列问题。
5. `trig-integrals:95` 的补标保留：同意。那是「例 2」那一块里第一次出现，照「每一块第一次出现都标」该标。

各节写稿员定的（汇报第七部分），只有一条不同意：
- `argument-principle`「连续辐角只加锚点、不进表」：不同意。`rouche-theorem:35` 把它当名词用了，两节用就该进表，见小问题 1。
- 其余同意：`identity-theorem` 引理单独写、唯一性定理两种条件合一；`laurent-series` 收敛定理的条件写成「在圆环里处处收敛」，简介不写「两部分都收敛的地方是一个圆环」；`singularities` 卡索拉蒂-魏尔斯特拉斯定理不带定理块、证明在第 5 题（合安排），常微分方程的「奇点」按规矩 C 标；`residue-theorem` 留数对「去心圆盘上全纯」定义，（2）用$\frac{p(a)}{q'(a)}$；`real-integrals` 有理函数定理只管实系数；`gamma-continuation` 第 1 题挪到$-\frac72$（$-\frac52$在画面里，悬停能读出 4 位），第 4 题题面加「已知$\Gamma(i)\ne0$」；`jordan-lemma` 若尔当引理写成上界$M$，傅里叶型积分只管实系数；`rouche-theorem` 例 2 换成$z+e^{-z}=2$；`cauchy-principal-value` 小半圆引理的条件写成「$(z-x_0)f$补上值以后全纯」，把可去的情形也包进去。

写稿员「拿不准的」8 条，第 1–4 条见重要 1 和「需要你决定的」；其余：
- 第 5 条（`jordan-lemma` 第 1 题换元后正是第 8 题的$I(2)$，第 8 题第 2 级提示写出了$I(\lambda)=\pi e^{-\lambda}$）：可以。规矩管的是讲解、例题、图里写出简单题的答案；第 8 题排在后面，做到那里第 1 题早做完了。
- 第 6 条（四道选择题的选项和讲解判过的例子同一类）：同意按「要多想一步」的例外留着，逐节审查员也没提。
- 第 7 条（几处略了一步、直观论证、直译的英文名、`rouche-theorem` 第 4 题的 tuple）：都可以接受。第 4 题要先用儒歇定理，再用零点定理数实根，算中等合适。
- 第 8 条（上半平面的括注）：见上。

## 跨领域的几处

- 跨领域补标（写代码的会话起的 agent 扫的，没改文件）：同意，这一批 22 个词在别的领域已写内容里没有要按规矩 C 补标的。
  - 我另用 grep 扫了一遍全站（留数、洛朗、亚纯、围道、辐角原理、儒歇、本性奇点、可去奇点、解析延拓、孤立零点、对数导数、绕数、若尔当引理、孤立奇点、主部、主值，连英文）。复分析以外只命中三处：拓扑 `circle-fundamental-group:6` 的 goal（大纲，「环绕数」）、单变量微积分 `improper-unbounded` 第 8 题参考解答的「柯西主值」（网页不显示，安排定了不标）、电磁学 `ampere-law` 第 7 题的「环绕数（linking number）」（不同概念）。
  - 意思不同的同名词（唯一性定理、奇点、极点、延拓、若尔当、圈数、零点、主部、可去、contour），抽查了 agent 列的出处：`function-limits` 的去心邻域是那一节自己的术语；`polar-area:23` 的极点、`series-solutions`、`frobenius` 的奇点、`images-uniqueness` 的唯一性定理都是各自领域的 id；`jordan-form` 是若尔当标准形；`fourier-series` 等是周期延拓。判断都对。
  - 「圆环」「环形区域」在别的领域照安排不补（小学的词）。
  - 拿不准的那一处，多变量微积分 `conservative-fields:78` 例 2 的「去心平面」：同意不补。它不是术语表的名字，也不是简称；同一块里已经写明「去掉原点的平面」；浮窗会显示「去心圆盘」和用$z$、$|z-a|$写的简介，和例题里$(x,y)$的写法对不上。
- 单变量微积分 `trig-integrals`：术语表加的 `math.calculus.rational-trig-function`（简介 29 字，只用那一节链上的概念）、`:60` 起名处、`:95`「例 2」那一块的补标都对，别的块里没有这个词；页面检查干净。复核通过后改回 `reviewed`。
- 复分析 `cauchy-theorem`：`:43`「圆环（annulus）」、`:45`「绕数」两处补标对；这一节别处的「圆环」在第 5 题的题目文字里，「圈数」不是这个词，照安排不动。复核通过后改回 `reviewed`。
- 规矩 C 正方向（这 11 节借别的领域的词）：链上的不标，第一次出现括注英文；链外的按旁白标了别的领域的 id：`residue-theorem:57` 的「部分分式」（`math.calculus.partial-fraction`）、`gamma-continuation:55` 的「分部积分」（`math.calculus.integration-by-parts`）、`singularities:27` 常微分方程的「奇点」（`math.ode.singular-point`）、`laurent-series` 第 7 题的「傅里叶级数」（`math.analysis.fourier-series`）。`jordan-lemma:63` 的「傅里叶变换」不在任何表里，括注英文、链到大纲 `math.pde.fourier-transform`，正负号的说法和光学 `fourier-optics:29` 一致。漏的只有小问题 8 那几处本领域的词。
- 同名不同义的区分：「唯一性定理」另起 id，和电磁学 `physics.electromagnetism.uniqueness-theorem` 分开（`singularities` 第 8 题提示里没标，见小问题 8）；「孤立奇点」不和常微分方程的「奇点」混；`singularities:36` 一句话分开了极坐标的极点；「柯西主值」和辐角主值、对数主值是三个 id，`cauchy-principal-value:33` 说清了；用的是「主部」，没用「主要部分」。
- `plan.md` 自己的不一致：`:1734` 写 `real-integrals` 的三角函数有理式「照 `trig-integrals` 写$R(\cos\theta,\sin\theta)$」，`:1695` 和 `trig-integrals:60` 都是正弦在前。这一批照正弦在前写，对；写回时把 `:1734` 改成一致（写稿员汇报第 11 条、`real-integrals` 审查员都提了）。

## 细节

### 分级的口径

- 重要：讲解、例题、误区、术语简介、解答里的数学说法，照最自然的读法不成立，或者推理不成立，和同一节别处或链接目标矛盾，读者照着会得出错的结论（重要 2–4）；你定的硬杠被整批越过（重要 1）。
- 小问题：措辞不严、少写一个上下文已经交代的条件、引文和术语标记、题目设计、不显示的参考解答里的小毛病。
- 逐节审查员一共报了重要 11 条、小问题 49 条。照这个口径合并以后是重要 4 条、小问题 10 条（小问题按类合并，每条下面逐处列出）：
  - 8 位审查员各自报的篇幅（重要）和 `real-integrals` 审查员报的篇幅（小问题）合成重要 1。`laurent-series` 审查员判 29 分钟合理，同意（每分钟 51.7 字）；`cauchy-principal-value` 审查员只和同批的节比，判 28 分钟合理，不采纳，照本领域的尺度是 31.9 分钟。
  - `real-integrals:89`（审查员报的小问题）并进重要 3。
  - `singularities` 误区 2、`real-integrals:83`、`cauchy-principal-value:102` 三条重要保留。
  - 删掉的两条：`argument-principle` 第 5 题第 3 级提示没链 `conformal-maps`，安排里整条是「可选」，第 5 题已经把数学做全，不算问题；`gamma-continuation` 第 4 题「像简单题」，要认出$\Gamma(i)$得靠延拓才有定义、递推公式在整个$D$上成立，算「把本节内容组合起来」，在中等的下沿，审查员自己也说可以不改。
  - 我补的：「连续辐角」第二节也用（小问题 1）、辐角原理的简介少条件（小问题 2）；`singularities` 第 6 题参考解答的例子（审查员写在难题意见里、没列进问题，补进小问题 6）。
- 别的说明：
  - `jordan-lemma:16` 转述 `real-integrals` 例 2 时把半圆写成$C_R$（那一节用$C_\rho$），这一节当场写明了$C_R$是什么，安排也说各节当场写明，不算问题。
  - `real-integrals` 审查员中途跑 `npm run verify` 时在 `singularities.ts` 第 3 题停过一次；现在全量跑通过，第 3 题算得$6.28318519$，和$2\pi$差$2\times10^{-8}$。
  - 两位审查员中途提到的 `jordan-lemma.ts:9`、`real-integrals.ts:119` 未使用变量，现在 `tsc` 没有报错了。

### 跑过的检查

- `npm run content`：全站 0 个错误、0 个警告（08:2x，审完最后跑的）。
- `npm run verify`：全部一致（393 个小节），没有 ✗，约 76 秒。
- `npm test`：34 个测试文件，310 通过，2 跳过。
- `npm run typecheck`（`tsc -b`）、`npx tsc -p tsconfig.node.json --noEmit`：都通过。
- `npm run listings -- math.complex-analysis math.calculus.trig-integrals`：通过 0、失败 0、跳过 0（没有代码清单）。
- `levels.mjs --domain math.complex-analysis`：11 节都和安排一致，层级变动 0 节，多余前置改前 0、改后 0。
- 页面检查：我自己跑了一遍 `pc-isolated.sh`（HEAD 加工作区的 `content/math/complex-analysis`、`content/math/calculus`），13 页，结果在 `b24/sum-ca/pc-summary.json`：每页 8 题、点 32 下，768/768；行间公式要拖 0 处（`identity-theorem`、`rouche-theorem` 没有行间公式，其余最宽 728）；KaTeX 报错 0，占位框 0，定义卡片不以句号结束 0；SVG 问题 0。和逐节审查员用的 07:37 那份、写稿员收尾 07:20 那份一致。
- 快照：`b24/snapshot-complex-analysis/` 和工作区的 `content/math/` 逐文件比过，相同。

### 逐节验算的做法（逐节审查员的脚本，`tools/verify/math.complex-analysis.<小节>.ts`）

- `identity-theorem`：圆周采样求泰勒系数定零点的阶；第 2 题用 11 个检验函数逐条找反例；第 3 题系数比外推收敛半径；第 4 题用像曲线圈数和 Muller 法求零点两条路。
- `laurent-series`：两部分的系数分别按系数比外推收敛半径；第 2 题比较四个选项的部分和；第 3、4 题按定义积分，不展开。
- `analytic-continuation`：右半平面上双指数求积；第 2 题系数比外推半径；第 3 题二阶递推拟合系数；第 4 题沿路径连续取对数和直接积分两条路。
- `singularities`：两个半径的圆周上按定义积洛朗系数；沿 8 个方向看$\ln|f|$对$\ln|z|$的斜率；第 3 题系数比外推半径，不找零点。
- `residue-theorem`：小圆周积分求留数，不用极点公式；第 3、4 题直接沿曲线积分。
- `real-integrals`：实积分直接数值算，和留数两条路核对。
- `argument-principle`：梯形公式积$\frac{f'}f$（$f'$也用柯西积分求）、像曲线圈数、求根，三条路。
- `gamma-continuation`：右半平面直接积分、汉克尔围道给出的$\frac1\Gamma$、兰乔斯近似加余元公式，三条路，不用本节的延拓式。
- `jordan-lemma`：在$[k\pi,(k+1)\pi]$上逐段积到$N\pi$，加分部积分得到的尾项，和留数核对。
- `rouche-theorem`：求根、积$\frac{p'}p$、像曲线圈数，三条路；第 2 题在圆周上取 20 万个点比较模。
- `cauchy-principal-value`：照题面积小半圆、理查森外推；第 2 题算截断积分；第 3、4 题逐段积加尾项。

### 术语表新进的 22 条

| id（`math.complex-analysis.`） | 中文名 | 简介字数 | 起名处 |
| --- | --- | --- | --- |
| `order-of-zero` | $m$阶零点 | 40 | `identity-theorem#def-zero-order` |
| `isolated-zeros` | 零点的孤立性 | 38 | `identity-theorem#thm-isolated-zeros` |
| `identity-theorem` | 唯一性定理 | 59 | `identity-theorem#thm-identity` |
| `annulus` | 圆环 | 24 | `laurent-series#def-annulus` |
| `punctured-disc` | 去心圆盘 | 22 | `laurent-series#def-annulus` |
| `laurent-series` | 洛朗级数 | 44 | `laurent-series#def-laurent-series` |
| `principal-part` | 主部 | 28 | `laurent-series#def-principal-part` |
| `isolated-singularity` | 孤立奇点 | 35 | `singularities#def-isolated-singularity` |
| `removable-singularity` | 可去奇点 | 48 | `singularities#def-singularity-types` |
| `pole` | 极点 | 39 | `singularities#def-singularity-types` |
| `essential-singularity` | 本性奇点 | 33 | `singularities#def-singularity-types` |
| `analytic-continuation` | 解析延拓 | 42 | `analytic-continuation#def-continuation` |
| `residue` | 留数 | 45 | `residue-theorem#def-residue` |
| `residue-theorem` | 留数定理 | 51 | `residue-theorem#thm-residue` |
| `meromorphic-function` | 亚纯函数 | 27 | `residue-theorem#def-meromorphic` |
| `contour` | 围道 | 35 | `real-integrals#def-contour` |
| `logarithmic-derivative` | 对数导数 | 36 | `argument-principle#def-log-derivative` |
| `winding-number` | 绕数 | 33 | `argument-principle#def-winding-number` |
| `argument-principle` | 辐角原理 | 39 | `argument-principle#thm-argument-principle` |
| `jordan-lemma` | 若尔当引理 | 27 | `jordan-lemma#thm-jordan-lemma` |
| `rouche-theorem` | 儒歇定理 | 43 | `rouche-theorem#thm-rouche` |
| `cauchy-principal-value` | 柯西主值 | 43 | `cauchy-principal-value#def-cauchy-pv` |

- 字数按字数规则数，都不超过 60；`definedIn`、`anchor` 都落在起名的那一段，构建也查过。
- 简介只用定义它的那一节链上的概念。全站同名的只有「唯一性定理」（电磁学），是另起的 id。
- 简介要改的见小问题 2；进表要补的「连续辐角」见小问题 1，改完复分析是 77 条。

### 记号、链接、选择题

- 记号：留数全批只用$\Res_{z=a}f(z)$（没有一处$\Res(f,a)$）；绕数只用$\operatorname{Ind}_C(a)$（`argument-principle` 和 `residue-theorem` 第 8 题）；柯西主值只用$\operatorname{P.V.}\int$；洛朗级数的积分圆周是$C_\rho$，留数定义里的小圆周$C_r$，`jordan-lemma`、`cauchy-principal-value` 的上半圆周$C_R$，`real-integrals` 的大半圆$C_\rho$（$R$留给三角函数有理式）；多项式写小写$p$；零点、极点的阶写$m$。唯一的例外是 `jordan-lemma` 第 3 题的$a_1$、$a_2$（小问题 10）。`real-integrals` 第 8 题、`cauchy-principal-value` 第 8 题的提示和参考解答里有「$2\pi i\sum\Res$」这样的简写，上下文说清了是哪些点，不列。
- 链接：11 节里指向这一批以外、又不在链上的，只有往后指的节名链接（这一批里后面的节）、旁白（`maximum-modulus`、`liouville`、`partial-fractions`）、参考解答里的 `exp-log-construction` 和大纲 `math.pde.fourier-transform`。只当节名用的链接文字都等于标题；描述性的链接文字（「逐项求导的定理」这类）逐节审查员对过目标段落和条件。指得不准的见小问题 7。
- 选择题（每节第 2 题，7 道多选、4 道单选）：

  | 小节 | 正确选项 | 小节 | 正确选项 |
  | --- | --- | --- | --- |
  | `identity-theorem` | B、D | `argument-principle` | B |
  | `laurent-series` | C | `gamma-continuation` | C、D |
  | `analytic-continuation` | A、C | `jordan-lemma` | A、B |
  | `singularities` | B、C | `rouche-theorem` | A |
  | `residue-theorem` | D | `cauchy-principal-value` | B、D |
  | `real-integrals` | A、D | | |

  合计 A 4、B 5、C 4、D 5。

### 原有问题（不在这一批，下次改到时顺手补）

- `complex-power-series:93`（已审）的误区里第一次出现「收敛圆周」，没括注 circle of convergence（写稿员查出）。
- 批次 22、23 已审各节的「由:term[ML 不等式]」，见「需要你决定的」第 2 条。

### 要写回 plan.md 的（审查建议）

1. `plan.md:1734` 的$R(\cos\theta,\sin\theta)$改成$R(\sin\theta,\cos\theta)$，和 `:1695`、`trig-integrals:60` 一致。
2. 篇幅：写稿员、收尾和审查估 `minutes` 时，和本领域已审小节的读速比，不只和同批的节比；复分析的讲解加例题以每分钟约 52 个汉字为上限（批次 24 审查提的：11 位写稿员各自和同批比，整批一起偏快，9 节超过 30 分钟）。上限的数等「需要你决定的」第 1 条定了再写。
3. 「两节以上用到的名词就进术语表」补例子：复分析的「连续辐角」（`rouche-theorem:35` 链接文字当名词用）、「柯西型积分」（`gamma-continuation:44`）。
4. 常见误区那一条补一句：误区的反例要满足误区本身的前提（批次 24：`singularities` 误区 2 用$e^{1/z}$反驳「沿实轴」，可它沿负实轴趋于$0$）。
5. 讲解（含边界情况、常见误区）也别先说出思考题的主要结论；要说就换题（批次 24：`laurent-series` 第 8 题、`argument-principle` 第 8 题、`residue-theorem` 第 7 题）。
6. 术语简介、一句话总结写定理时带上关键条件（批次 24：若尔当引理的连续、辐角原理的条件；四节的总结）。
7. 写稿员提的两条，放进「每节固定结构」第 3 条：例题推导里写出的中间结果也算写出了答案；function-plot 悬停显示 4 位有效数字，要算的点落在画面里时，「只能估读一两位」的例外不成立。
8. 写稿员汇报第八部分的复分析记号（$\Res_{z=a}$、$\operatorname{Ind}_C(a)$、$\operatorname{P.V.}$、$C_\rho$、$C_r$、$C_R$、$\gamma_\varepsilon$、$z_1,\dots,z_n$、$h_k$、$R(\sin\theta,\cos\theta)$、$\frac{p(a)}{q'(a)}$）和 FunctionPlot 的三条用法（$\Arg$在跳$2\pi$处断开、用 `sum` 写数值积分、角度滑块用度数），照录。
9. 「需要你决定的」第 2–4 条定下来以后，各记一句（编译器改了就记进实现记录）。

## 修订说明（写内容 agent，2026-11-19，第 1 轮，未提交）

重要 4 条、小问题 10 条都改了，没有不改的；有几处没照报告给的写法，各写了理由。11 节由 11 位写稿员按报告分头修订；领域层面的小问题 1、2，复看各节的修订、节与节之间的一致，再照同类问题整批找一遍，由我收尾。收尾另改的都在「照同类问题整批找出、一起改的」里，标了「收尾」。

### 重要 1：`minutes` 估低

- 11 节的讲解加例题都压到 1550 个汉字以内，`minutes` 照实写（汉字数 ÷ 52，向上取整），都不超过 30。没有拆节：`argument-principle` 压到 1498 字，「需要你决定的」第 1 条里的拆法用不上了。数法同报告（`b24/rv-identity-theorem/count.mjs`），下表是收尾改完以后的数：

  | 小节 | 汉字（改前 → 改后） | 公式 | `minutes` | 每分钟汉字 |
  | --- | --- | --- | --- | --- |
  | `identity-theorem` | 1626 → 1477 | 255 → 248 | 29 → 29 | 50.9 |
  | `laurent-series` | 1499 → 1506 | 170 → 174 | 29 → 29 | 51.9 |
  | `analytic-continuation` | 1618 → 1502 | 253 → 238 | 27 → 29 | 51.8 |
  | `singularities` | 1669 → 1463 | 242 → 224 | 29 → 29 | 50.4 |
  | `residue-theorem` | 1665 → 1488 | 238 → 231 | 27 → 29 | 51.3 |
  | `real-integrals` | 1637 → 1531 | 179 → 176 | 25 → 30 | 51.0 |
  | `argument-principle` | 1719 → 1498 | 245 → 233 | 29 → 29 | 51.7 |
  | `gamma-continuation` | 1633 → 1482 | 202 → 189 | 28 → 29 | 51.1 |
  | `jordan-lemma` | 1600 → 1466 | 217 → 203 | 28 → 29 | 50.6 |
  | `rouche-theorem` | 1553 → 1456 | 202 → 198 | 25 → 28 | 52.0 |
  | `cauchy-principal-value` | 1658 → 1549 | 237 → 218 | 28 → 30 | 51.6 |

- 删压的都是报告列的地方，外加逐句收紧；安排要接住的回指和说明都留着：
  - `identity-theorem`：`:38` 压成一句「实函数$e^{-1/x^2}$做不到的，只有证明里『$f$在$\Delta$上等于泰勒级数』这一步」。没照报告写「证明里用到全纯的，正是这一步」：`:34`「各阶导数连续」也用到全纯。$e^{-1/x^2}$挪到 `:27`；`:45`、`:67` 的末句删了；`:56` 并句。
  - `analytic-continuation`：误区 1 第三句删了，`:58` 留着「两件事不矛盾」的说明；`:34` 改成回指唯一性定理后面的边界情况；`:45` 缩成一句；`:51` 重写（见小问题 7）。
  - `singularities`：例 2 删了（例题剩 1 道，别处没有引它）；`:82` 压到 60 字左右；`:69` 不再重提幂级数展开一节第 4、5 题；`:36` 精简。
  - `residue-theorem`：报告列的五处都删压了；别删的 `:55` 两组留数、`:62`「有界闭区域里只有有限个极点」「$C$上没有极点时就能用留数定理」都在。
  - `real-integrals`：删了例 1 用$x=\tan t$的核对；`thm-trig-period` 的证明精简；`:41` 的回指只留柯西积分定理一节第 6 题（反过来用同一个代换）。
  - `argument-principle`：`:51` 重写（见小问题 6）；两段「为什么这样定义」各留一处回指；两段「为什么有用」合并到像曲线定理后面；`:33` 和 `:22` 重复的半句删了。
  - `gamma-continuation`：报告列的五处都删压了；伽马函数一节第 7、8 题，`:32` 的「$0$处补不上值」，用唯一性定理推递推公式，分部积分的规矩 C 旁白，都留着。
  - `jordan-lemma`：`:86` 第一句改成回指有理函数那条定理后面的说明；`:88` 只留实根那一句；`:63`、`:52` 压短。
  - `cauchy-principal-value`：原 `:52` 那段「为什么有用」整段删了；原 `:104` 的收敛说明缩成例 1「为什么想到这么做」末尾的括注；实部只在误区 1 讲一次；`:29`、`:31` 精简。
  - `rouche-theorem`：`:35` 后半段的牵狗图景、`:50` 第一句删了；例 1「为什么想到这么做」改成回指讲解最后一段。压到 1456 字，`minutes` 写 28，不用改成 30。
- 公式在 240 个以上的四节，报告说最好压到 1450 上下：`analytic-continuation`、`singularities`、`argument-principle` 的公式都降到了 240 以下；`identity-theorem` 1477 字、248 个公式，再压只能删安排要接住的回指（写稿员的理由），停在这里。

### 重要 2：`singularities` 误区 2

- 用第二种改法：误区写成「沿实轴从两侧趋于$a$时都有$|f|\to+\infty$，$a$就是极点」，反例换成$e^{1/z^2}$：实轴上$e^{1/x^2}$两侧都趋于$+\infty$，沿虚轴$e^{-1/y^2}\to0$，$0$是本性奇点。和误区 1 不再矛盾。

### 重要 3：`real-integrals:83`、`:89`

- `:83` 两个分句接成一个条件：「……；这时被积函数若还带着$e^{ix}$这样的因子，大半圆上的积分仍可能趋于$0$，只是要用比 ML 不等式更细的估计，见……」。写「仍可能」：$e^{-ix}$这类因子在上半圆周上不行。
- `:89` 改成「分母比分子至少高$2$次时，圆弧上的积分在$\rho\to+\infty$时趋于$0$」。

### 重要 4：`cauchy-principal-value` 例 1

- 「围道管不了」那句改成「围道给出的是对称挖去以后的极限；$\frac{\sin x}x$是偶函数（even function），这个极限存在就说明积分收敛（也可以直接由[无穷区间上的反常积分]一节第 6 题看出）」，和第 6 题的提示、参考解答一致。
- 「对称地挖，偶的虚部给出积分本身，奇的实部只剩柯西主值」放在例 1 末段，接上讲解里定理的情形$\operatorname{P.V.}\int_{-\infty}^{+\infty}\frac{e^{ix}}x\,\dd x=\pi i$。

### 小问题 1：「连续辐角」「柯西型积分」

- 「连续辐角」进了复分析的表：`math.complex-analysis.continuous-argument`，`definedIn: math.complex-analysis.argument-principle`，`anchor: def-continuous-arg`，简介 54 字（收尾核过）。`argument-principle` 各块第一次出现都标了：起名段、几何图像的说明、例 1 推导、误区 2。
- `rouche-theorem:35` 的后半段是重要 1 列的可删处，随压缩删了，这一节现在不用这个词，不用补标。全站只剩 `argument-principle` 一节用它，仍留在表里：`plan.md:248` 说只一节用的词「可以」只加锚点，进表也合规，撤掉反而要拆 4 处标记。复分析术语表现在 77 条。
- 「柯西型积分」照推荐改：`gamma-continuation:44` 写成「这里照[高阶导数与莫雷拉定理](…#thm-cauchy-type)一节第一个定理的证明……」，不再当名词用。核过 `thm-cauchy-type` 正是那一节第一个定理；这个词不进表，`higher-derivatives`、`_domain.yaml` 都不动。
- 写回 `plan.md` 时（「要写回 plan.md 的」第 3 条），请按现状写例子：两处原文都改掉了，「连续辐角」最后由起名那一节自己进了表。

### 小问题 2：简介和定义句

- 若尔当引理的简介（收尾）：补上「$g$在上半圆周$C_R$上连续」，32 字。
- 辐角原理的简介（收尾）：「$f$在逆时针的简单闭曲线$C$上全纯、不为$0$，里面除有限个极点外全纯时，$\frac1{2\pi i}\oint_C\frac{f'}f\dd z$是$C$里零点数减极点数（按阶计），也是$f(C)$绕原点的圈数。」60 字。没照报告的 53 字写法：那样丢了原简介里的「逆时针的简单闭曲线」，$C$是什么、朝哪个方向都没交代。两样都写进去，第二个「在$C$里面」省成「里面」，正好 60 字。
- 圆环的简介：「以$a$为中心的区域$r<|z-a|<R$（$0\le r<R\le+\infty$）；$r>0$、$R$有限时夹在两个同心圆周之间，$r=0$时就是去心圆盘。」39 字。
- `laurent-series:25` 的定义句改成「$r=0$时它是$0<|z-a|<R$，叫作去心圆盘（punctured disc），$R$有限时是开圆盘（open disc）去掉圆心，$R=+\infty$时是去掉$a$的整个平面」，`:27` 的边界情况相应删短。
- 简介的字数都用构建的 `countChars` 数过。

### 小问题 3：一句话总结

- `identity-theorem`、`argument-principle`、`rouche-theorem`、`cauchy-principal-value` 都照报告给的写法改了，依次 28、27、29、30 字。`identity-theorem` 想留「的全纯函数」，加上「互异」就超过 30 字；`cauchy-principal-value` 加「一阶极点」也超，引理的条件讲解里写全了。

### 小问题 4：说过头或少交代（前三节）

- `identity-theorem` 误区 3：「定义域是区域时，保证有限的是……」。
- `identity-theorem:27`：换成具体的边界情况（实函数$e^{-1/x^2}$在$0$处各阶导数都是$0$，找不到$m$；区域上的全纯函数不会这样），`:38` 里同样的话删了。
- `identity-theorem:70`：名字照安排不动，句尾改成「……能放进某个圆盘里的集合（它不是开集）」；收尾又给这个「开集」补了标记和英文（见同类问题第 6 条）。
- `analytic-continuation:27`：「才」改成「就」。`:56` 补了「换一组满足条件的分点和圆盘，终点附近得到的函数也一样（这里不证）」。
- `singularities:82`：改成一句，只说两边在「补上一个值就好」上相通，实轴上的分类搬不过来（$e^{1/x}$、$e^{-1/x^2}$换成$z$都是本性奇点）；「跳跃间断点这一类在这里没有」整句删了，安排里它只是「可以」说的边界情况；「间断点」括注 point of discontinuity。

### 小问题 5：说过头或少交代（后四节）

- `residue-theorem` 误区 3：「定理只要求$f$在$C$上全纯、在$C$里面除有限个点外全纯」。
- `real-integrals` 误区 1：「还会」改成「还可能」。
- `cauchy-principal-value:52` 那句随那段「为什么有用」删了，`:37` 只对$\frac1z$说「和半径无关」，是对的；`:73`（现在 `:71`）改成「公式和……一样；那两条还证明了积分本身收敛，柯西主值就等于它」。
- `gamma-continuation:46`：「不但$|t^{z-1}e^{-t}|$的积分发散（定理 1），积分本身也发散（$t\to0^+$那一端，这里不证）」；写稿员数值核过几个点。

### 小问题 6：证明和解答里的小缺口

- `identity-theorem:54`：照报告改，矛盾落在「圆盘里异于$z^*$的零点」上。
- `argument-principle:51`：照报告的次序重写，写明$z^*$是不孤立的零点，后面直接用零点的孤立性，不再绕第一个推论。
- `rouche-theorem:33`：补「$h'$也全纯（导数自动连续），$h$在$U$上不为$0$，所以$\frac{h'}h$在$U$上连续」。
- `residue-theorem` 第 7 题：题目改成两问以后，这一段在参考解答（2）里，改成比较$wF_2$和主部的同次项，再除以$w$；第 3 级提示用同一个论证写成完整解答。
- `real-integrals` 第 5 题第 3 级提示：补「$|z_+|=\frac{a-\sqrt{a^2-b^2}}{|b|}<1$，因为$a-|b|<\sqrt{a^2-b^2}$」。「需要你决定的」第 4 条定成「最后一步」的话，这句留着也不碍事。
- `singularities` 第 6 题参考解答：例子写明取$R=1$，$C$都取$1$。

### 小问题 7：引文

- `laurent-series:48`：两个积分一起指 `cauchy-theorem#thm-deformation` 后面的说明，$z$在里面、外面两种情形都在那里。
- `analytic-continuation:16`：「那一节的常见误区和第 8 题」。`:51` 整段重写，不再单引第 8 题，回指开头的例子，补了理由：支割线把圆盘切成上下两块，唯一性定理只管得到含$-1+i$的一块；下面一块里$\Im F$在$\pi$附近、$\Im\Log z$在$-\pi$附近，都满足$e^w=z$，所以差$2\pi i$。
- `argument-principle:71`（现在 `:69`）：括注删了，那句自己已经写全推理。
- `residue-theorem:62`：写成「照[有界闭区域里只有有限个零点](…#thm-finite-zeros)的证明」。
- `gamma-continuation`：「本节第 5 题」，误区 1 也改成「本节第 5 题」；$f(z)=\Gamma(z)\bigl(1+\frac12\sin2\pi z\bigr)$写出了名字；`:46` 的「那一节」改成「伽马函数一节」。改成「见本节第 7 题」的那一句，收尾时整句删了（见同类问题第 8 条）。
- `jordan-lemma:63`：改指 `complex-functions#thm-sin-modulus`。
- `real-integrals` 第 7 题：「讲解里的例 2」改成「例 2」。

### 小问题 8：术语标记、英文括注

- `identity-theorem:58`：「原函数」标本领域的 id（批次 7 认定的基础词，不括注）；`:67` 那句随压缩删了。
- `singularities` 第 8 题第 2 级提示：「唯一性定理」标 `math.complex-analysis.identity-theorem`、括注 identity theorem；「区域」标记、括注 domain。
- `cauchy-principal-value` 第 8 题题干：「主部」标记、括注 principal part。

### 小问题 9：思考题的结论讲解里先说了

- `laurent-series:34`：边界情况换成$\sum_{n\ne0}\frac{z^n}{n^2}$，只在$|z|=1$上收敛。没用报告举的例子：它也是哪里都不收敛，等于先答了第 8 题（3）。第 8 题参考解答（3）末句改成「才用得上这一节的定理（和函数全纯、逐项积分、系数和$\rho$无关）」，没写「才谈得上逐项积分和系数公式」：在$|z|=1$上一致收敛时，沿这个圆周照样能逐项积分。
- `argument-principle` 误区 3：只说「积分给出的是零点个数减极点个数，不是零点个数」；合并后的「为什么有用」里也不再说「没有极点时就是零点个数」。
- `residue-theorem` 第 7 题：改成两问。（1）先交代讲解里的$\frac1{z^2}$，再问一阶极点处的留数能不能是$0$、有没有留数为$0$的本性奇点；原（2）并进原（3）当引子。提示、参考解答跟着改。

### 小问题 10：题目的措辞和记号

- `laurent-series` 第 7 题：题干写明$A_n$、$B_n$的定义（标数学分析表里的「傅里叶系数」，链外，括注英文），（3）写成$A_n$、$B_n$和$n\to\infty$；第 3 级提示、参考解答（3）改成引用第 6 题（1）；积分区间跟着题干统一成$[-\pi,\pi]$。
- `jordan-lemma` 第 3 题：$a_1$、$a_2$改成$z_1$、$z_2$，「在根$z_k$处」。`:29`：「这条弦上横坐标为$t$的点高$\frac{2t}\pi$」。第 2 题题干补「在整个$C_R$上用 ML 不等式（把$|e^{i\lambda z}|$按最大值$1$估计）」，误区 1 同样写明「在整个$C_R$上」。
- `real-integrals` 第 6 题（2）：「并求出$\int_0^{+\infty}\frac{\dd x}{1+x^3}$」。
- `residue-theorem` 第 1、3 题：第 1 级提示开头给$f$起名。

### 照同类问题整批找出、一起改的

各节写稿员在自己的节里找过一遍；收尾时我把 11 节当一批又扫了一遍（脚本见「检查」）。标「收尾」的是我改的，其余是各节写稿员改的。

1. 简介、一句话总结少条件（小问题 2、3 同类）：
   - `residue-theorem` 的一句话总结补成「$f$在$C$上全纯、$C$里面只有有限个奇点时……」，30 字；`jordan-lemma` 的补「$g$在上半圆周$C_R$上连续」，27 字。
   - 收尾逐条看了这一批的其余简介，写定理的（零点的孤立性、唯一性定理、洛朗级数、留数定理、儒歇定理）条件都齐。
2. $R$可以是$+\infty$、开圆盘的半径有限（小问题 2 同类）：
   - `_domain.yaml` 去心圆盘的简介；`laurent-series:22`、`:64`、`:71`；`singularities:36`、`:41`、`:43`、`:58`。
   - 收尾：`residue-theorem:51`、`:53`（极点处留数的定理的证明）把$|z-a|<R$叫作开圆盘，可定理只设$f$在去心圆盘$0<|z-a|<R$上全纯，$R$可以是$+\infty$。改成「$g$在$|z-a|<R$上全纯」「$q_1$在整个$|z-a|<R$上都不为$0$」；这一节从此不再出现「开圆盘」，括注也就不用挪。
3. 条件漏写（小问题 3、6 同类，多半是「互不相同」）：
   - `identity-theorem` 误区 1，`:16`「不恒为$0$的多项式」；
   - `analytic-continuation` 第 7 题题干（3）、第 3 级提示、参考解答；
   - `gamma-continuation:68`「一列互不相同的点」，`:77`「沿不经过极点的简单闭曲线」；
   - `singularities:62` 补「$q(a)=0$」，第 7 题参考解答「某个去心圆盘里」，第 8 题参考解答（2）把$D$写成$\{z:|z|<\rho,\ z\ne2\}$；
   - `rouche-theorem` 第 7 题（3）补「分段光滑的」，参考解答（3）补$\frac{H'}H$连续。
4. 说过头（小问题 4、5 同类）：
   - `real-integrals` 例 2 末段「在整个$C_\rho$上用 ML 不等式不够」，误区 2「用上半圆周时就是上半平面的」；
   - `cauchy-principal-value` 边界情况「引理管不了二阶极点」（原来的「只管一阶极点」漏了可去的情形），误区 2「一阶极点」，例 1「ML 不等式只给出上界$\pi$」，第 5 题提示「积分的模不超过」；
   - `laurent-series` 第 8 题参考解答（2）；`rouche-theorem` 例 2「离$2$稍远就比$|z-2|$小」；`analytic-continuation` 误区 1 写明比较的是哪两条路。
5. 题目文字里的记号（小问题 10 同类）：`real-integrals` 第 3 题第 2 级提示给$f$起名。
6. 术语标记、英文括注（小问题 8 同类）：
   - 压缩时第一次出现挪了位置的，各节写稿员都跟着挪了标记和括注：`analytic-continuation` 的「开集」「负实轴」，`residue-theorem` 的「一阶极点」，`singularities` 的「开圆盘」，`jordan-lemma` 的「ML 不等式」「共轭」，`cauchy-principal-value` 的「奇函数」，`real-integrals` 例 1 整个词标「二阶极点」、第 5 题提示括注「共轭复数」，`rouche-theorem` 两块补标「模」，`residue-theorem` 第 7 题新提示括注 power series 等。
   - 收尾：`identity-theorem:70` 新加的「（它不是开集）」是全节第一次出现的「开集」，没标也没括注（写稿员把括注加在了后面的误区 2）。补成「（它不是开集（open set））」，「开集」带上本领域的标记；误区 2 的括注去掉，标记留着。
   - 收尾：`gamma-continuation:64` 的「虚部」是这一块第一次出现，补标；误区 1 第一次出现的「全纯函数」在引号里，标记从后面的「全纯」挪上来。这两处原稿就有，审查没报。
7. 引文指代不清（小问题 7 同类）：
   - `analytic-continuation:58`：复数的$n$次方根一节第 7 题的结论只在参考解答里，改成「一节的几何图像和第 7 题」；`gamma-continuation` 误区 1、`:46`（见小问题 7）。
   - 收尾：`identity-theorem:56`「那一节说『不等式却不一定』，原因见第 7 题」紧跟在复变函数与映射一节后面，改成「本节第 7 题」；`rouche-theorem:50`「三种证法的比较见第 8 题」紧跟在平均值性质一节第 6 题后面，改成「本节第 8 题」。
8. 思考题的结论讲解里先说了（小问题 9 同类）：
   - `identity-theorem:56` 原来的「因为$|\sin z|\le1$不是两个全纯函数相等」先说出了第 7 题（3）的理由，写稿员改成指向题目；`residue-theorem:42` 改成「$C$自己相交时定理也不管，见第 8 题」；`rouche-theorem:50` 删掉的第一句正是第 8 题（2）。
   - 收尾删了三句结论，讲解、误区剩下的部分照样成立：`jordan-lemma:54`「$M(R)\to0$也不能少：$g=1$时……不趋于$0$（第 7 题）」，第 7 题（2）问的就是这个条件能不能去掉（写稿员汇报里提了，留给收尾定）；`gamma-continuation:68`「只知道正整数处的值，也定不下$\Gamma$，见本节第 7 题」，第 7 题（1）问的就是能不能断定；`rouche-theorem` 误区 1「只在一点取等号也不行（见第 7 题）」，第 7 题（1）问的就是这件事。
   - 看过、不改：`analytic-continuation:27`「实函数只要求无穷次可导就不行（见第 7 题）」，报告小问题 4 定了后半句不变，第 7 题（1）还要数出有多少个；`real-integrals:83`「大半圆上的积分不再趋于$0$（第 8 题）」是重要 3 给的写法，第 8 题还要算出值和极限；`singularities`、`argument-principle` 的第 7 题（1）是引子，要求复述讲解里的定理；`jordan-lemma` 几何图像的说明讲的是引理为什么成立，第 7 题（1）还要估出弧长约$\frac3\lambda$。

### 检查

- `npm run content`：全站 0 个错误、0 个警告（收尾最后一处改动以后跑的）。
- `npm test`：34 个测试文件，310 通过，2 跳过。
- 验算：11 个 `npx tsx tools/verify/math.complex-analysis.<小节>.ts` 都跑了，44 道简单题、中等题全部和标准答案一致。收尾没动简单题、中等题；写稿员改过题目文字的（`jordan-lemma` 第 2 题题干，`residue-theorem` 第 1、3 题提示，`real-integrals` 第 3 题提示）答案都没变。
- 页面：`pc-isolated.sh --include content/math/complex-analysis --include content/math/calculus/trig-integrals --include content/math/calculus/_domain.yaml`，11 节都看了。每页 8 题、点 32 下，768/768 不溢出；行间公式要拖 0 处（`identity-theorem`、`rouche-theorem` 没有行间公式，其余最宽 728）；KaTeX 报错 0，占位框 0，定义卡片不以句号结束 0；10 张 SVG 问题 0 处。结果在 `b24/pc-rev1-wrap-complex-analysis.json`。
- 字数：讲解加例题用 `b24/rv-identity-theorem/count.mjs`，见重要 1 的表。简介用构建的 `countChars` 数（`b24/rev1-wrap-ca/count-brief.ts`）：若尔当引理 32、辐角原理 60、圆环 39、去心圆盘 36、连续辐角 54。复分析术语表 77 条。
- 整批扫的脚本在 `b24/rev1-wrap-ca/`：`terms-all.mjs`（每块第一次出现的术语有没有标）、`english-first.mjs`（全节第一次出现有没有括注英文）、`sent-all2.mjs`（一段超过 4 句，引号里的句子也算）。改完以后都没有剩下的问题；另外查了中英文之间的空格、「」以外的引号、「……一节」后面紧跟的「第 N 题」「例 N」，也没有剩下的。
- 和审查快照 `b24/snapshot-complex-analysis/` 比，这一轮改了 20 个文件：11 节的 `lesson.md`，8 个 `problems.yaml`（`identity-theorem`、`argument-principle`、`gamma-continuation` 的没改），复分析 `_domain.yaml`。SVG、`cauchy-theorem`、单变量微积分的文件都没动；各节 `status` 仍是 `written`。

## 复核（审内容 agent，2026-11-19，第 1 轮）

审内容 agent · 2026-11-19。和写内容 agent、初审汇总的审内容 agent 都是独立会话。先拿初审快照和工作区逐文件、逐行比，再对着修订说明逐条核，最后重跑构建、验算和页面检查。

结论：重要 4 条、小问题 10 条都改对了，没有带进新的重要问题；13 节通过，`status` 改成 `reviewed`（这一批 11 节，加上退回 `written` 的复分析 `cauchy-theorem`、单变量微积分 `trig-integrals`）。没通过的 0 条。遗留小问题 1 条，提交前顺手改。

### 比了什么

- `diff -rq b24/snapshot-complex-analysis/content content`，`tools/verify` 同样比；有差别的文件再用字符级对比（`b24/recheck-ca1/cdiff.py`）逐行看。
- 这一批范围里改了 20 个文件，和修订说明「检查」最后一条一致：11 节的 `lesson.md`；8 个 `problems.yaml`（`identity-theorem`、`argument-principle`、`gamma-continuation` 的没改）；复分析 `_domain.yaml`（改了圆环、去心圆盘、辐角原理、若尔当引理 4 条简介，新进「连续辐角」，共 77 条）。10 张 SVG、`cauchy-theorem`、单变量微积分的 `_domain.yaml` 和 `trig-integrals` 一个字节都没变，各节 `status` 都还是 `written`。
- `tools/verify/` 下复分析 11 个验算脚本快照里没有：快照拍在 07:36，逐节审查员 07:39–08:18 才写脚本，文件时间都在这段里，这一轮没动。题目的分档、答案（含选项）和快照逐题比过（`b24/recheck-ca1/answers.mjs`），一处没变；改了文字的 18 道题，和修订说明一一对上。
- 范围外：工作区里逻辑与集合（`cartesian-product`、`equivalence-relations`、`proof-methods`、`quantifiers`、`sets` 改了，`direct-proof`、`nested-quantifiers` 新建）和热学的文件也和快照不同，是别的会话在写、在改的，不归这份复核；提交复分析时别带上。

### 逐条核对

- 重要 1（篇幅）：
  - 用同一个 `b24/rv-identity-theorem/count.mjs` 重数，11 节讲解加例题 1456–1549 字，每分钟 50.4–52.0 字，和修订说明的表一字不差。`minutes` 依次是 29、29、29、29、29、30、29、29、29、28、30，都是「字数 ÷ 52 向上取整」，都不超过 30。没有拆节，「需要你决定的」第 1 条的拆法用不上了。
  - `identity-theorem` 停在 1477 字、248 个公式，比报告说「最好」的 1450 多 27 字。安排要它接住的回指（`complex-power-series:65` 的问题、`complex-functions:51` 的「不等式却不一定」、`cauchy-integral-formula:35` 的圆周）都在 `:16`、`:49`、`:56`，再删就要动它们，理由站得住。
  - 删压的地方逐处对过安排：删的都是报告列的重复回指、旁白，或者安排里写「可以」的（`residue-theorem` 的部分分式旁白和「拆开就是两点的留数」，`argument-principle` 回指 `complex-numbers` 第 8 题，`real-integrals` 回指 `cauchy-integral-formula` 例 2，`identity-theorem` 回指 `power-series` 第 7 题）；`residue-theorem:55` 的两组留数、`:62` 的「有界闭区域里只有有限个极点」、`gamma-continuation` 接伽马函数一节第 7、8 题等要接住的都还在。
- 重要 2：误区 2 改成「沿实轴从两侧趋于$a$时都有$|f|\to+\infty$」，反例$e^{1/z^2}$：实轴上$e^{1/x^2}$两侧都趋于$+\infty$，虚轴上是$e^{-1/y^2}\to0$，洛朗级数$\sum_{n\ge0}\frac{z^{-2n}}{n!}$有无穷多个负次幂。反例满足误区的前提，结论对，和误区 1 不再矛盾。
- 重要 3：`real-integrals:83` 两个分句接成了一个条件，写「仍可能趋于$0$」对（$e^{-ix}$在上半圆周上不行）；`:89` 补了「分母比分子至少高$2$次时」。同一节例 2 末段（「在整个$C_\rho$上用 ML 不等式不够」）、误区 2、`jordan-lemma` 第 2 题题干和误区 1 的说法也都一致了。
- 重要 4：`cauchy-principal-value` 例 1「为什么想到这么做」改成「围道给出的是对称挖去以后的极限；$\frac{\sin x}x$是偶函数，这个极限存在就说明积分收敛（也可以直接由第 6 题看出）」，和本节第 6 题的第 3 级提示、参考解答一致；「偶的虚部给出积分本身，奇的实部只剩柯西主值」放在例 1 末段，接误区 1。安排要的「收敛先照 `improper-integrals` 第 6 题说明」缩成了括注，几何图像的说明也接着那道题，可以。
- 小问题 1：
  - 「连续辐角」进了表：`definedIn`、`anchor` 对，简介 54 字，只用链上的辐角、连续；`argument-principle` 起名段、几何图像的说明、例 1 推导、误区 2 四块第一次出现都标了。
  - `rouche-theorem:35` 那半段随重要 1 删了，全站现在只有 `argument-principle` 一节用这个词。留在表里合 `plan.md:248`（只一节用的词「可以」只加锚点，进表不违规），同意；写回 plan 的第 3 条照修订说明按现状写。
  - 「柯西型积分」改成「照高阶导数与莫雷拉定理一节第一个定理的证明」，不再当名词用；核过 `thm-cauchy-type` 正是那一节第一个定理。
- 小问题 2：若尔当引理 32 字、辐角原理 60 字、圆环 39 字、去心圆盘 36 字，用构建的 `countChars` 重数过（`b24/recheck-ca1/count-items.ts`）。辐角原理没照报告的 53 字写法、留下「逆时针的简单闭曲线」，理由站得住。`laurent-series:25` 的定义句写全了$R$有限、$R=+\infty$两种情形，`:27` 相应删短，「它总是区域」对。
- 小问题 3：四节总结依次 28、27、29、30 字，条件齐了；同类找出的 `residue-theorem`（30 字）、`jordan-lemma`（27 字）也对。
- 小问题 4：`identity-theorem` 误区 3、`:27`（$e^{-1/x^2}$成了具体的边界情况，接下面的引理）、`:70`（「集合（它不是开集）」）；`analytic-continuation:27`「就」、`:56` 补的一句；`singularities:82` 只说「补一个值就好」相通、实轴上的分类搬不过来，「跳跃间断点这一类没有」整句删掉（安排里是「可以」当边界情况说），都对。
- 小问题 5：`residue-theorem` 误区 3、`real-integrals` 误区 1「还可能」、`cauchy-principal-value:71`，对。`cauchy-principal-value:52` 那段「为什么有用」整段删了，`:37` 只对$\frac1z$说「和半径无关」，对。`gamma-continuation:46` 补的「积分本身也发散」核过：$t\to0^+$那一端被积函数像$t^{z-1}$，$\Re z<0$时$\int_\varepsilon^1t^{z-1}\dd t$的模趋于无穷，$\Re z=0$时来回振荡；讲解写「这里不证」可以。
- 小问题 6：`identity-theorem:54`；`argument-principle:51`（先排除极点，再由$C$上不为$0$得$z^*$在里面，直接用零点的孤立性）；`rouche-theorem:33`（补了$\frac{h'}h$连续）；`residue-theorem` 第 7 题（拿$wF_2$和主部逐项比、再除以$w$，第 3 级提示用同一个论证，推导核过）；`real-integrals` 第 5 题第 3 级提示（$|z_+|=\frac{a-\sqrt{a^2-b^2}}{|b|}<1$，两边平方正是$|b|<a$）；`singularities` 第 6 题参考解答（$R=1$、$C=1$，两个例子都满足条件）。都对。
- 小问题 7：`laurent-series:48` 两个积分一起指 `cauchy-theorem#thm-deformation` 后面的说明（`cauchy-theorem:45` 里、外两种情形都在）；`analytic-continuation:16`、`:51`（照报告补了理由）、`:58`；`argument-principle:69` 删了括注；`residue-theorem:62`；`gamma-continuation`「本节第 5 题」、写出$f(z)=\Gamma(z)\bigl(1+\frac12\sin2\pi z\bigr)$、`:46` 的「伽马函数一节」；`jordan-lemma:63` 改指 `complex-functions#thm-sin-modulus`（那里有$\cos(iy)=\cosh y$和$|\sin z|^2=\sin^2x+\sinh^2y$）；`real-integrals` 第 7 题。都对。
- 小问题 8：`identity-theorem:58`「原函数」，`:67` 那句删了；`singularities` 第 8 题第 2 级提示、`cauchy-principal-value` 第 8 题题干。都对。
- 小问题 9：`laurent-series:34` 换成$\sum_{n\ne0}\frac{z^n}{n^2}$（只在$|z|=1$上收敛，不答第 8 题（1），也不答（3）的「没有」；没照报告的例子写，理由站得住），参考解答（3）末句改得准；`argument-principle` 误区 3 只剩定理本身的「零点个数减极点个数」；`residue-theorem` 第 7 题改成两问，（1）问一阶极点处的留数能不能是$0$、有没有留数为$0$的本性奇点，讲解没答过，参考解答结论对。
- 小问题 10：`laurent-series` 第 7 题（$A_n$、$B_n$写进题干，积分区间统一成$[-\pi,\pi]$，$|\theta|$的$A_n=-\frac4{\pi n^2}$核过）；`jordan-lemma` 第 3 题和 `:29`、第 2 题题干和误区 1；`real-integrals` 第 6 题（2）；`residue-theorem` 第 1、3 题。都对；改了文字的简单题、中等题答案都没变，`npm run verify` 照样一致。
- 「照同类问题整批找出、一起改的」8 类逐处看过，都对。收尾删的三句（`jordan-lemma:54`、`gamma-continuation:68`、`rouche-theorem` 误区 1）正是各自第 7 题要问的，删了以后讲解、误区剩下的部分照样成立；「看过、不改」的四处同意。

### 改了没报的

没有影响结论的。修订说明写了「外加逐句收紧」，下面是收紧以外、没单独写出来的改动，都核过、都对：

- `analytic-continuation:32`（延拓唯一性定理的证明）：原来在$D_1$里一条半径上取收敛到$a$的点列、用唯一性定理的条件（1），改成「$F$、$G$在开集$D_1$上都等于$f$，所以在其中一点处函数值、各阶导数都相等」，用条件（2）。推理对（两个函数在开集上相等，在其中每一点的各阶导数都相等）；「开集（open set）」的标记和括注也挪到了这里（同类第 6 条提了）。
- `residue-theorem:34`：括注「定理里『$f'$连续』的条件已由导数自动连续去掉」改成「$g'$连续由导数自动连续保证」。用柯西积分定理的是$g$，改得更准。
- `residue-theorem:62` 删了「以后伽马函数的解析延拓一节的$\Gamma$也是」这句预告：安排没要求这里预告，`gamma-continuation:73` 自己说了$\Gamma$亚纯。
- `real-integrals:60`（围道）删了边界情况「只有上半圆周、不闭合的曲线不是围道」，剩下的「8」字形曲线仍是边界情况，定义段照样有反例。
- `identity-theorem:67` 随末句一起删了带标记的「最大模原理（maximum modulus principle）」，只留回指那一节的结论；安排说那里只当旁白加链接，链接还在。
- `jordan-lemma` 误区 2 补了「$\frac x{x^2+1}$是实的，所以」，是取共轭的理由，对。
- 英文括注：`singularities` 第 8 题参考解答（3）的「凸的（convex）」、`gamma-continuation:77` 的「简单闭曲线（simple closed curve）」（同类第 6 条写了「等」）。

### 遗留小问题（不影响通过，提交前顺手改）

- `singularities:69`「上面的$\frac z{\sin z}$在$k\pi$、$\frac z{e^z-1}$在$2k\pi i$（$k\ne0$）也是一阶极点，就是判断收敛半径时『离中心最近的、函数不全纯的点』」：离中心最近的只有$\pm\pi$、$\pm2\pi i$，照字面读，$|k|\ge2$的也成了「最近的点」。原稿就是这个意思（「就是它们」），这一轮重写时沿用了。可以写成「……也是一阶极点；判断收敛半径时那个『离中心最近的、函数不全纯的点』，就是其中的$\pm\pi$、$\pm2\pi i$」。

### 跑过的检查

- `npm run content`：全站 0 个错误、0 个警告（复核开始时跑一次，13 节改成 `reviewed` 以后又跑一次）。
- `npm run verify`：全站 405 节；复分析 31 节 124 道题全部一致，单变量微积分 `trig-integrals` 也一致。全站唯一的 ✗ 是热学 `kinetic-theory` 第 4 题（别的会话正在修订的领域，不归这份复核）。日志在 `b24/recheck-ca1/verify.log`。
- `npm test`：34 个测试文件，310 通过，2 跳过。`npm run typecheck`：通过。
- 页面检查：`pc-isolated.sh --include content/math/complex-analysis --include content/math/calculus/trig-integrals --include content/math/calculus/_domain.yaml`，13 页（这一批 11 节加 `cauchy-theorem`、`trig-integrals`），改 `status` 前后各跑一次，结果相同，在 `b24/recheck-pc-complex-analysis-1.json`。每页 8 题、点 32 下，768/768 不溢出；行间公式要拖 0 处（`identity-theorem`、`rouche-theorem` 没有行间公式，其余最宽 728）；KaTeX 报错 0，占位框 0，定义卡片不以句号结束 0；12 张 SVG（这一批 10 张、退回的两节各 1 张）文字出画布、重叠、压线、汉字间距提醒都是 0。
- 字数：讲解加例题用 `b24/rv-identity-theorem/count.mjs`，见重要 1；总结、简介用构建的 `countChars`（`b24/recheck-ca1/count-items.ts`），总结 25–30 字，改过的 5 条简介 32–60 字；复分析术语表 77 条。
- 扫描：重跑收尾的 `b24/rev1-wrap-ca/terms-all.mjs`（每块第一次出现有没有标）、`english-first.mjs`（全节第一次出现有没有括注英文）、`sent-all2.mjs`（一段超过 4 句），剩下的命中逐条看过，都是标题、复合词（「可去奇点定理」「有界闭区域」「辐角主值」）、意思不同的「原函数」（实函数的原函数）或基础词，没有新问题。另用 `b24/recheck-ca1/spacing.py` 扫这一轮改过的行：中文和英文、数字之间的空格，「」以外的引号，都没有问题；术语标记紧贴汉字、页面上少一个空格的，仍是报告「需要你决定的」第 2 条列的 6 处，这一轮没有新增。
- 「需要你决定的」第 2–4 条仍等写代码的会话定（第 1 条压缩以后不用拆了）；第 4 条定成哪种，`real-integrals` 第 5 题补的那一步留着都不碍事。

## 遗留小问题的修改（写内容 agent，2026-11-19）

复核的「遗留小问题」只有 1 条，照改了。只动了 `singularities/lesson.md` 第 69 行，`status` 仍是 `reviewed`；别的文件、题目都没动。

- `singularities:69`：改成「上面的$\frac z{\sin z}$在$k\pi$、$\frac z{e^z-1}$在$2k\pi i$（$k\ne0$）也是一阶极点；判断收敛半径（链接和英文括注照旧）时那个『离中心最近的、函数不全纯的点』，分别是其中的$\pm\pi$、$\pm2\pi i$」。照复核给的写法，只把「就是」换成「分别是」：两个函数各对一组点，$\frac z{\sin z}$是$\pm\pi$，$\frac z{e^z-1}$是$\pm2\pi i$。
- 篇幅：讲解加例题 1463 → 1469 字，公式 224 → 226（`b24/rv-identity-theorem/count.mjs`），`minutes` 仍是 29（1469 ÷ 52 向上取整）。这一段仍是 2 句，`b24/rev1-wrap-ca/sent-all2.mjs singularities` 没有超过 4 句的段。

检查：

- `npm run content`：全站 0 个错误、0 个警告。
- 页面：`pc-isolated.sh --include content/math/complex-analysis --include content/math/calculus/trig-integrals --include content/math/calculus/_domain.yaml --ids math.complex-analysis.singularities`。8 题、点 32 下，768/768 不溢出；行间公式要拖 0 处（最宽 728）；KaTeX 报错 0，占位框 0，定义卡片不以句号结束 0；这一节没有 SVG。结果在 `b24/leftover-ca/pc-singularities.json`。
- 没改题目，不用跑验算脚本。

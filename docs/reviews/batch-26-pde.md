# 批次 26 审查报告：偏微分方程（偏微分方程与分类到三维波动方程与惠更斯原理）

审内容 agent · 2026-11-19。和写内容 agent 是两个独立会话。这一批先由 13 位逐节审查员各审一节（读题只用 `npm run statements`，验算完才读 `problems.yaml`），我汇总：先做领域层面的检查，再过一遍逐节结论，最后才读写稿员汇报，只用来找「改了没报的」、看「我替你定的」和「拿不准的」。

审查范围：
- 新领域的第一批 13 节、104 道题，`proofPolicy: sketch`：`pde-basics`、`transport-equation`、`burgers-shocks`、`wave-dalembert`、`fourier-transform`、`fourier-inversion`（新建）、`convolution`（新建）、`heat-equation`、`heat-kernel`、`separation-of-variables`、`spherical-waves`（新建）、`string-modes`、`wave-3d`。偏微分方程拆完 25 节，剩下 12 节批次 27 写。
- 6 张 SVG、13 个 `function-plot`；偏微分方程术语表 0 → 40 条；宏 `\vb`、`\dv`、`\divg` 是写代码的会话开写前加的。
- 进别的领域的表 3 条：多变量微积分「连续性方程」（`divergence-theorem:38` 补标、退回 `written`），数学分析「正弦级数」「余弦级数」（`fourier-series:54` 补标、退回 `written`）。这两节只看这一轮的改动。本领域原来没有已写的节，同领域补标都在这 13 节里。
- 写代码的会话开写前改的：批次 27 的 6 节大纲（标题、goal、前置）、新建的 4 节大纲、振动与波 `group-velocity` 的前置，逐处对过安排，一致。
- 跨领域补标：写代码的会话起的 agent 改了别的领域 9 个文件、10 处标记（另补 1 处英文括注），`status` 都不动，逐处复核。
- 快照：写代码的会话开审前拍了 `b26/run-mp/snapshot-pde/`（05:10）。写完报告时和工作区比过，`content/math/` 下一个字节都没变；这一批的文件最后一次修改在 04:40 以前。

## 结论

重要 2 条，小问题 12 条。

- 讲解、例题：推导和数都对，主线定理都给了证明思路，完整证明放进难题（`pde-basics`、`wave-dalembert`、`separation-of-variables`、`string-modes`、`wave-3d` 各自的第 5、6 题等），合乎 `sketch`。毛病是两处一般说法和同一节的题目矛盾（重要 1、2），其余是引用定理时条件没交代、说过头、少条件、英文括注这些小问题。
  - 逐节审查员核过的推导：算子分解和 $u_{tt}-c^2u_{xx}=-4c^2w_{\xi\eta}$；兰金-于戈尼奥条件；傅里叶变换的四条性质和求导；由狄利克雷核证反演公式；卷积定理；由能量守恒、散度定理推热方程；由卷积定理认出热核；分离变量的三种情形和 M 判别法；$w=ru$ 化成一维；球面平均满足的方程和基尔霍夫公式；二维的降维公式和尾巴。
  - 讲解里的数也核过：例 2 的激波在 $\frac32$ 处左右面积相等；方波中心降到一半约 $0.095\frac{L^2}D$、铁棒约 370 s；热核宽度长到 1 cm 约 4 s；空气一秒传开约 4.5 mm。
- 题目：
  - 52 道简单题、中等题，13 个验算脚本独立算（不走讲解的公式，两三种算法互相核），全部和标准答案对上；`npm run verify` 全站 443 节全部一致。
  - 52 道难题、思考题的参考解答都对，难度档合适，第 3 级提示都写成了完整解答。思考题的主要结论讲解里先说了的 1 处（`wave-3d` 第 7 题（1），小问题 8，要改）。题目里推理少一步或说过头的见小问题 6，用到链外结论没注出处的见小问题 7。
  - 简单题、中等题有 12 道的第 3 级提示停在最后一步之前（小问题 8）。
  - 14 道选择题正确选项 A 7、B 7、C 8、D 7、E 7（36 个正确选项最匀的分法），组合只有 A、C、E 出现两次。
- 前置和层级：13 节 9–19 层，和安排一致；`levels.mjs --domain math.pde` 层级变 0 节，多余前置改前 0、改后 0；`group-velocity` 21、光学 `fourier-optics` 25、电磁学 `retarded-potentials` 25、`electrostatic-separation` 21、量子力学 `stationary-states` 26 都不变。逐节审查员沿整条前置链（18–100 节）查过。链外的概念用进讲解的两处：`burgers-shocks` 的 $\tanh$，以及一元函数的二阶导数（小问题 2，两种改法都试算过，0 节变层、多余前置 0→0）。
- 篇幅：`minutes` 23–29，合计 355（安排估约 356）；讲解加例题 1184–1506 个汉字，每分钟 50.7–52.0 字（表见「细节」），都不超过 30。`heat-equation`、`separation-of-variables`、`wave-3d`、`burgers-shocks`、`pde-basics`、`fourier-inversion` 离下一分钟只差几个字，照这份报告改完要重数：`heat-equation` 照重要 2 和小问题 11 都加字约 1552 字、到 30；`burgers-shocks`、`separation-of-variables` 照小问题 1、3、5 改也会到 30 上下，超过 1560 字先压。
- 页面：我自己跑了一遍页面检查，13 节、`divergence-theorem`、`fourier-series` 和跨领域改过的 9 页，共 24 页，768 像素宽下全部展开（每页点 32 下）：隔离副本构建 0 个错误、0 个警告；页面都是 768/768，行间公式要拖 0 处（最宽 728），KaTeX 报错 0，占位框 0，定义卡片都以句号结束；SVG 12 张，出画布、重叠、压线、汉字间距都是 0。
- 下游接住：安排「已写的小节指向这一批」偏微分方程 11 条和「以这一批为前置」的各条，逐节审查员逐条打开原文对过，都接住了。没接住的只有 `heat-equation` 安排要的稳态旁白（小问题 11）；`fourier-transform:90` 对 `heat-kernel` 的说法不准（小问题 3）。

- **重要 1：「高斯函数的变换还是高斯函数」，按本节的定义不成立，和同一节第 2 题的解答矛盾**
  - 涉及：`fourier-inversion`、`convolution`。
  - 原文：`fourier-inversion:34`「为什么重要：高斯函数的变换还是高斯函数。」`:25` 的定义把平移、乘常数都算进高斯函数：$Ae^{-a(x-x_0)^2}$，$A$、$x_0$ 是实数。`convolution:111` 照抄了这句一般的说法：「高斯函数（Gaussian function）的傅里叶变换还是高斯函数」。
  - 矛盾：$x_0\ne0$ 时变换是 $Ae^{-i\xi x_0}\sqrt{\pi/a}\,e^{-\xi^2/(4a)}$，取复数值，不是这个定义下的高斯函数。本节第 2 题 A 项的解答（`problems.yaml:47`）自己就算出 $e^{-(x-1)^2}$ 的变换是 $e^{-i\xi}\sqrt\pi e^{-\xi^2/4}$。
  - 为什么列为重要：这是讲解点明的「为什么重要」，照字面不成立，和同一节的解答矛盾，读者照着会以为平移过的高斯函数变换后也是实的钟形；下游 `convolution` 又照抄了一次。和批次 26 量子力学重要 1、批次 23 振动与波重要 1 同一个口径（plan.md:342「都」「任何」那一条）。
  - 改法：`fourier-inversion:34` 改成「中心在原点的高斯函数，变换还是中心在原点的高斯函数。」定理 1 管的正是 $e^{-ax^2}$，乘常数 $A$ 也一样。不要在讲解里补平移以后的一般公式或「模不变」，那就写出了第 2 题 A 项的答案。`convolution:111` 照同样改（例 2 用的都是 $e^{-ax^2}$、$e^{-bx^2}$）。`fourier-inversion` 现在 1399 字，加 6 个汉字就到 28 分钟。

- **重要 2：稳态「和初温无关」，表面全部绝热时不成立，和同一节第 5 题（2）矛盾**
  - 涉及：`heat-equation`。
  - 原文：`:64`「边界上的情况和热源都不变时，过很久温度通常不再变（这里不证），分布只由它们决定，和初温无关」。
  - 矛盾：表面全部绝热、没有热源时，最后的温度是常数，等于初温的平均值，跟着初温变；本节第 5 题（2）证的正是这一点，两端都绝热的杆也一样。「通常」只管得到前半句「温度不再变」，管不到「和初温无关」。批次 27 `greens-identities` 的 goal「诺伊曼问题的解只差一个常数」说的也是这个例外。
  - 为什么列为重要：这是稳态定义「为什么这样定义」的那一句，读者会记成稳态总和初温无关；反例是本节自己讲的绝热边界，还是同一节的难题。逐节审查员列重要，同意。
  - 改法：把条件写进这句，不点破第 5 题，例如「边界上的情况和热源都不变、表面有一部分保持恒温时，过很久温度通常不再变（这里不证），分布只由它们决定，和初温无关」，多 10 个汉字，讲解加例题 1506 字，仍是 29 分钟。

- **小问题 1：引用的定理，条件在这里不满足或没写全**（plan.md「每批的流程」第 3 条「讲解和例题」：链接目标的条件这里满不满足；「前置」：`sketch` 小节引用分析定理要写明条件、说明满足、链出处）
  - 链过去的定理只对连续函数写，这里的函数可以有跳跃：
    - `fourier-transform:56`：绝对可积靠 `improper-integrals#def-absolute-convergence` 推出「从而收敛」，`convolution:33` 用同一节的比较判别法（`#thm-improper-comparison`）。那一节的反常积分（`def-improper-integral`、`def-improper-both-ends`）和比较判别法都设 $f$ 连续，可矩形、波列、第 2 题 A 项的 $\mathrm{sgn}$ 型函数都有跳跃。在 `fourier-transform:56` 补一句：反常积分照那一节的办法定义（先在有限区间上积分、再取极限），被积函数在每个有限区间上可积就行；比较判别法和「绝对收敛则收敛」只用到积分的保序性，照样成立。`convolution:33` 回指这一句即可。
    - `fourier-transform:75`：（1）（3）「都是换元」，链到 `substitution#thm-substitution-definite`，只交代了「只管有限区间」；那条定理还要被积函数连续，常见误区 2（`:148`）就把（1）用在矩形上。补半句：线性换元把 $[-R,R]$ 上的分割和黎曼和一一对应过去，$f$ 可积就成立。
  - `convolution:119`：「$e^{-by^2}$衰减得快，条件满足（见含参变量积分的定理 4）」没写出压住偏导数的那个函数，定理 4 的结论也只有「可导」，唯一性推论要的「导数连续」没交代。写出 $|\partial_x\cdots|\le\sqrt{2a/e}\,e^{-by^2}$，再补一句导数连续的理由（例如导数是有界、绝对可积的 $-2axe^{-ax^2}$ 和 $e^{-bx^2}$ 的卷积，由 `:52` 连续）。
  - `heat-kernel:28`：「不超过一个和$t$无关的绝对可积函数」，定理 4 要的是「连续、积分收敛」的函数，少了「连续」，第 5 题（2）的题干倒写全了。`:44`「$u$和这个卷积都满足推论的条件」：卷积可导要到 `:64` 的证明思路才说，补半句指过去，像上游 `convolution` 例 2 那样当场说明。
  - `burgers-shocks:43`：定理 1 的证明思路用「$u$可微由隐函数定理保证」得出可微，只有术语标记，没写条件、没链出处（安排只让它在 `:52` 当旁白）。改成写出 $G(x,t,u)=u-\varphi(x-ut)$、$G_u=1+t\varphi'(x_0)>0$，链 `inverse-implicit#thm-implicit-function`；或者加前置 `math.vector-calculus.inverse-implicit`（试算 0 节变层、多余前置 0→0）。
  - `burgers-shocks:75`：定理 2 的条件比证明用到的少：第 5 题题干另设「两侧的可微解连同$u_t$都能连续地延到曲线上」，证明靠它。把这句写进定理的条件。
  - `separation-of-variables:84`：魏尔斯特拉斯判别法只有术语标记、没有「见」链接（安排要「链出处」），逐项求导引的「一致收敛与极限交换」定理 3 还要「各项的导数连续」，这里没说满足。补「（见[函数项级数与魏尔斯特拉斯判别法](lesson:math.analysis.function-series#thm-weierstrass-m-test)）」和「各项的导数都连续，」。
  - `separation-of-variables:79`：「换成周期$2L$的公式」没链 `fourier-series#def-fourier-series-2l`（安排写的是两处合起来定系数）；边界情况「$\varphi(0)\ne0$时」里 $\varphi$ 只在 $(0,L)$ 上给出，改成 $\varphi(0^+)\ne0$。

- **小问题 2：讲解里用到前置链外的概念**（`burgers-shocks`、`pde-basics`、`wave-dalembert`、`spherical-waves`、`string-modes`、`_domain`）
  - `burgers-shocks` 几何图像（`:86`–`:95` 的四条曲线、`:110` 的说明）取初值 $-A\tanh x$，说明里写 $-\varphi'=\frac A{\cosh^2x}$；双曲函数在单变量微积分 `hyperbolic-functions`，不在本节的链上（链上 28 节）。推荐换成链上的函数 $-\frac{Ax}{\sqrt{1+x^2}}$（$-\varphi'=\frac A{(1+x^2)^{3/2}}$ 在原点最大，$t^*=\frac1A$、圆点、滑块都不用改，逐节审查员给了四条式子）；也可以加前置 `math.calculus.hyperbolic-functions`（试算 0 节变层、0→0），只为一幅图加前置，不如换函数。逐节审查员列重要，我降为小问题，理由见「细节」。
  - 一元函数的二阶导数：`pde-basics:63`「$F$、$G$二阶可导」，`wave-dalembert:61` 定理 2 的「$\varphi$有连续的二阶导数」（第 2、5、6、8 题也用，第 8 题还有四阶导数），`spherical-waves:57` 定理 2，达朗贝尔公式的简介（`_domain.yaml:333`）。`math.calculus.higher-derivatives` 不在 `pde-basics`、`transport-equation`、`burgers-shocks`、`wave-dalembert`、`heat-equation`、`spherical-waves`、`wave-3d` 的链上；链上的 `partial-derivatives:34` 自己就把「二阶导数」当链外的词、按规矩 C 标了。推荐给 `pde-basics` 加前置 `math.calculus.higher-derivatives`，整个领域都经它接上（试算 0 节变层、多余前置 0→0；只加给 `wave-dalembert` 也是 0、0→0，两处只加一处）。加了以后照链上的词处理：`wave-dalembert:61`、`spherical-waves:57`、`string-modes:50` 是各节「二阶导数」第一次出现，都没括注英文，补「（second derivative）」；`pde-basics:63` 的「二阶可导」补「（twice differentiable）」。

- **小问题 3：讲解、误区里说过头或少条件**（plan.md:342；`transport-equation`、`wave-dalembert`、`fourier-transform`、`convolution`、`heat-equation`、`heat-kernel`、`separation-of-variables`、`string-modes`、`wave-3d`）
  - `transport-equation:52`「$u$沿每条抛物线不变……就得$u(x,y)=g(y-x^2)$」、`:59`「解都是$F(x^2-y)$的样子」：这里的「都」要 $u$ 在整个平面上可微。反例：去掉竖直射线 $\{x=1,y\le5\}$ 以后，$C<4$ 的抛物线被切成两段，两段上可以取不同的常数。`:52` 改成「设$u$在整个平面上可微，它沿每条抛物线不变……」，`:59` 改成「整个平面上的可微解都是……」。
  - `wave-dalembert:45`「通解（general solution）里是两个任意的一元函数」少了定理 1 的「二阶可导」，照字面带折角的 $F$、$G$ 也算，和第 7 题、`:65` 的「放宽了意思的解」对不上。改成「两个任意的二阶可导的一元函数」。
  - `fourier-transform:90`「求导变成乘$i\xi$，含导数的方程就变成代数方程，[热核与无界区域上的热方程]一节就靠这一条」：只有对 $x$ 求导、常系数线性的方程才变成代数方程；`heat-kernel:36` 对 $x$ 作变换以后得到的是对 $t$ 的常微分方程。改成「对$x$求导变成乘$i\xi$；对$x$的常系数线性常微分方程变成代数方程，热方程对$x$作变换变成对$t$的常微分方程，[热核与无界区域上的热方程]一节就靠这一条」。`fourier-transform`、`heat-kernel` 两位审查员都报了，合并。
  - `convolution:130` 误区的反驳「少了翻转，$f$不是偶函数时结果就不同」说过头：取 $g=1$，两种写法都等于 $\int f$，同一节 `:56` 正好写了 $f*1$。改成「结果一般就不同」。
  - `heat-equation:55`「要$\frac{L^2}D$的若干倍时间才抹平」：换尺度只说明时间和 $\frac{L^2}D$ 成正比；两端恒温的杆，最慢的成分降到 $\frac1e$ 只要约 $0.1\frac{L^2}D$，「若干倍」读成「好几倍」就不对。改成「抹平要的时间和$\frac{L^2}D$成正比」，汉字数不变。
  - `heat-kernel:22`「端点的影响一时传不到中间」，和同一节 `:77`「扰动瞬间就传到各处」字面上相反。原意是起初小到可以不计，改成「端点的影响要过一段时间才明显（远处起初分到的热小得测不出来）」，或者用「$t$远小于$\frac{L^2}D$时」。
  - `separation-of-variables:41`：把分析力学里 $W$ 拆成几个函数之和和常微分方程的「移到等号两边」并列成「都和这里……不是一回事」，前一半说过头：`hamilton-jacobi:47` 自己就叫它分离变量，用的也是「只依赖一个变量的部分是常数」，只是拆成和。分开说，前者「是另一回事」，后者「想法相同，拆成的是和而不是乘积」。
  - `separation-of-variables:105`「乘积解怎样叠加都仍满足它们（叠加原理）」：「怎样叠加都」包括无穷多项，可那要另外验证收敛和逐项求导，正是本节定理和 `pde-basics:48` 指过来的事。改成「乘积解的线性组合仍满足它们，无穷多项要像上面的定理那样另外验证」。
  - `string-modes:16`「两端固定的弦为什么只能这样振动？」接在「原地起伏、不跑开的那几种振动」后面，读成「弦只能做驻波那样的振动」，和下一句、误区 1 相反。改成「为什么原地起伏的振动只有这几种？」。
  - `wave-3d:24`「只有小球里球对称的光滑初位移时，由那一节的定理 2 也是这样」：「只有……时」容易读成必要条件，改成「小球里没有初速度、只有球对称的光滑初位移时」。
  - `wave-3d:36` 定理的公式没写 $t>0$；$M_g$ 只对 $\rho>0$ 定义（`:31`），$t=0$ 时没有意义，第 5 题提示验初值用的也是 $M_\psi(\vb r,0^+)$。写成「$t>0$时就是……」。

- **小问题 4：一句话总结、术语简介少条件或有歧义**（plan.md:234、:251；`pde-basics`、`heat-equation`、`fourier-inversion`、`_domain`）
  - `pde-basics:10`「二阶线性偏微分方程在$B^2-AC<0$、$=0$、$>0$的点分别是椭圆、抛物、双曲型。」没交代 $B$ 是什么，照字面会把 $u_{xy}$ 的系数当成 $B$，这正是本节误区 2 要纠正的；这句还出现在 `transport-equation`、`heat-equation` 的前置回顾里。改成「$Au_{xx}+2Bu_{xy}+Cu_{yy}+\cdots=f$在$B^2-AC<0$、$=0$、$>0$的点分别是椭圆、抛物、双曲型。」（按 `countChars` 22 字）。逐节审查员给的「二阶线性方程$Au_{xx}+\cdots$」28 字也合规，可「二阶线性方程」是常微分方程表里的名字，安排为此把 goal 改成了「二阶线性偏微分方程」，不推荐。
  - `heat-equation:10`「材料均匀、无热源时，……给出$u_t=D\Delta u$」：「材料均匀」挡不住 $\kappa$、$c$ 随温度变，`:49` 的边界情况说那时只能写成 $c\rho u_t=\divg(\kappa\nabla u)$；$L$ 也没交代。改成「$c$、$\rho$、$\kappa$为常数且无热源时，能量守恒和傅里叶定律给出$u_t=D\Delta u$。」（28 字）。
  - 线性偏微分方程的简介（`_domain.yaml:63`）「不含$u$的项为零时叫齐次」：$u_t$、$u_{xx}$ 字面上也不含 $u$ 本身，前半句又没说未知函数就是 $u$。改成「未知函数$u$和它的各阶偏导数都只以一次的形式出现、系数只依赖自变量的偏微分方程；不含$u$及其偏导数的项为零时叫齐次。」（56 字）。
  - 高斯函数：定义（`fourier-inversion:25`）只要 $A\ne0$，$A<0$ 时是倒过来的钟形；`:27`「平移、乘常数都不改变钟形」和简介（`_domain.yaml:126`）「图像是钟形」都没管这种情形。讲解改成「平移、乘非零常数只改变位置和高低（$A<0$时上下翻过来）」，简介改成「……$A>0$时图像是钟形……」（34 字）。也可以把定义改成 $A>0$，`convolution`、`heat-kernel` 用到的倍数都是正的。

- **小问题 5：定义和起名**（plan.md:231；`burgers-shocks`、`wave-dalembert`、`heat-kernel`）
  - `burgers-shocks:70`、`:79`：定义把凡是满足积分形式的跳跃都叫激波，`:79` 又说「激波还要满足：特征线从两侧走进激波」，按定义第 6 题（2）那个跳跃就是一个不满足这一条的激波。另外「积分形式下的解」的定义只管在曲线上跳跃的 $u$，`:136` 例 2 的折角和第 6 题（1）的稀疏波却也这样叫。改法：`:79` 改成「积分形式下的解并不唯一（见第 6 题），能实际出现的激波还要满足……」（或者把这一条写进激波的定义）；`:70` 改成先说「满足积分形式、在一些曲线以外是可微解的$u$都算作解」，再说「$u$在曲线上跳跃时，这个跳跃叫作激波」。
  - `burgers-shocks:29`、`:31`：拟线性的定义写「系数却依赖$u$本身」，边界情况又说「$a(u)$是常数$c$时，拟线性方程就是输运方程」。二选一：定义改成「系数可以依赖$u$本身」，或者边界情况改成「$a(u)$是常数$c$时，$u_t+a(u)u_x=0$就是线性的输运方程」。
  - `wave-dalembert:38`：特征坐标的「边界情况」写的是「过每一点恰好有两条特征线……$c$越大越平」，是性质，不是边界情况。换成真正的边界情况，例如 $c\to0$ 时两族特征线并成竖直线、$(x,t)\mapsto(\xi,\eta)$ 不再一一对应，所以要 $c\ne0$。
  - `heat-kernel:62`：定理条件里起名的「分段连续（piecewise continuous）」是这条链上的新概念（链上只有 `fourier-convergence` 的「分段光滑」），没有「为什么这样定义」和反例。补一两句：间断点处左、右极限都存在，结论里的平均值才有意义；$\sin\frac1x$ 有界、只有一个间断点，可在 $0$ 处没有单侧极限，不算。
  - 「频率变量」「误差函数」要不要进表，见「需要你决定的」第 1、2 条。

- **小问题 6：题目里推理少一步或说过头**（`pde-basics`、`wave-dalembert`、`string-modes`、`spherical-waves`、`heat-equation`）
  - `pde-basics` 第 4 题解答（`problems.yaml:94`）「由叠加原理（2），$u=t+\sum_kc_ke^{-k^2t}\cos kx$（有限项）满足……」：有限项之和是齐次方程的解靠（1），（2）只管加上特解 $t$。改成「由叠加原理（1）（2）」，或分两步写。
  - `pde-basics` 第 5 题第 3 级提示（3）（`:120`，参考解答 `:128` 同句）「非线性方程没有叠加原理」说过头：$(u_x)^2=0$ 算非线性方程，解是只依赖 $y$ 的函数，线性组合仍是解。改成「非线性方程一般没有叠加原理」。
  - `wave-dalembert` 第 8 题第 3 级提示（2）（`:189`，参考解答 `:195`）「$v^2=c^2$时$H$是一次函数，$F$是三次多项式」：$H=F''$ 也可以是非零常数，$F$ 是二次多项式（如 $u=(x-ct)^2$）。改成「$F$是二次或三次多项式」。
  - `string-modes` 第 6 题题干（2）（`:132`）「证明$n\ge2$时$\nu_n<n\nu_1$，所以这些角频率不是最低那个的整数倍」：不等式只排除 $\nu_n=n\nu_1$；$\kappa=\frac53\bigl(\frac{\pi c}L\bigr)^2$ 时 $\nu_3=2\nu_1$。第 8 题第 3 级提示（2）（`:203`，参考解答 `:209`）「$\nu_n>n\nu_1$……不再是整数倍」同类：$\gamma^2=\frac58\omega_1^2$ 时 $\nu_2=3\nu_1$。分别改成「所以第$n$个角频率不再是最低那个的$n$倍」「不再是$n\nu_1$，各个角频率一般也不再成整数比」。两处都在网页上看得见，第 8 题的又是读者唯一看得到的完整解答。
  - `spherical-waves` 第 2 题 C 项（`:31`）写「满足方程」，没有像 A、B 那样限定 $r>0$，照字面原点也算；第 3 级提示（`:43`）和解答（`:47`）只用定理 1 在 $r>0$ 上验证。解答里直接算 $\Delta(x^2+y^2+z^2)=6$，或者 C 也写「在$r>0$上」。
  - `heat-equation` 第 5 题第 3 级提示（3）（`:111`）答「不一定成立」，只有一句物理说法，没有具体例子；难题的第 3 级提示是读者唯一看得到的完整解答。补一个例子：$V=(0,\pi)^3$，$u=e^{-3Dt}\sin x\sin y\sin z$ 在表面上为 $0$，$\iiint u\,\dd V=8e^{-3Dt}$ 在减小。题干（1）（`:96`）把内能直接写成 $\iiint c\rho u\,\dd V$，讲解 `:36` 是「加一个常数」，顺手对齐。

- **小问题 7：题目文字用到链外的结论，没注出处**（plan.md「每批的流程」第 3 条「前置」；`transport-equation`、`wave-dalembert`、`fourier-transform`、`heat-equation`、`heat-kernel`）
  - `transport-equation` 第 7 题（`:150` 题干（2）、`:161` 第 3 级提示）「相平面」「轨线」是常微分方程 `first-order-systems` 的词，不在本节链上，只括注了英文。题干改成「相平面（phase plane，见[一阶线性方程组](lesson:math.ode.first-order-systems#def-phase-plane)）」，或改说「$xy$平面上的什么曲线」；第 3 级提示（2）补「除去平衡点$(k\pi,0)$」（$a$、$b$ 在那里同时为 0，讲解 `:34` 的定义要求不同时为 0）；（1）的链接改指 `existence-uniqueness#thm-systems`。
  - `wave-dalembert` 第 8 题第 2 级提示（`:185`）「三种情形解这个常微分方程」，第 3 级提示用到正弦型、指数组合的解和「在一段区间上为 0 的解只能恒为 0」，这些在常微分方程 `constant-coefficients`，不在本节链上。加「（见[常系数齐次线性方程](lesson:math.ode.constant-coefficients#thm-constant-coefficients)）」。
  - `fourier-transform` 第 7 题（4）（`:150`、`:163`）用到拍、拍频和「拍频等于两个频率之差」，振动与波 `superposition-beats` 不在链上。加「（见[振动的叠加与拍](lesson:physics.oscillations-waves.superposition-beats)）」。
  - `heat-equation` 第 8 题第 2、3 级提示（2）（`:183`、`:187`）的回答靠「这个$u$就是那个解」，可反过来每个解都是这种形式、所以解唯一，要到 `wave-dalembert` 才证，那一节不在本节链上。补一句并加链接。
  - `heat-kernel` 第 8 题（3）（`:188`）问「得到的解和[分离变量法]一节的级数解是什么关系」：那一节和本节同在第 18 层、不在链上，按 id 排在后面，读者多半还没学。改成本节就能回答的问法，例如「用$\int K(x-y,t)\sin\omega y\,\dd y$把解写成正弦级数，各项怎样随时间衰减？」，再加一句「学到[分离变量法]一节时可以对照」当旁白。第 3 级提示（`:201`）当名词用的「分离变量法」跟着改。

- **小问题 8：题目设计**（`pde-basics`、`transport-equation`、`burgers-shocks`、`fourier-transform`、`heat-kernel`、`spherical-waves`、`wave-3d`）
  - 简单题、中等题的第 3 级提示停在最后一步之前，12 道：`pde-basics` 第 1–4 题（第 1 题以问句结尾，第 2、3 题没写出类型，第 4 题停在「再代入」），`transport-equation` 第 2–4 题（第 2 题只对 A、C、E 提了问题，第 3、4 题停在「再代入」），`burgers-shocks` 第 1–4 题（第 2 题 C 项是问句，其余停在「再取倒数」「再代入」「再由方程」），`fourier-transform` 第 2 题（只讲了 A）。界面上第 3 级标的是「完整解答」（`src/components/ProblemCard.tsx:24`，plan.md:284），批次 25 逻辑与集合的简单题、中等题都写完整了（那一批的小问题 3），这一批另外 9 节也写完整了。末尾补出结论和数，每段仍不超过 4 句。写回见「需要你决定的」第 5 条。`transport-equation` 的三道是逐节审查员报的，另外 9 道是我补的，`fourier-transform` 第 2 题逐节审查员看过、以「简单题有 solution」放过，我不同意，理由同上。
  - `transport-equation` 第 8 题（2）（`:178`）问「这一项的系数应当是正的还是负的」，没说加在等号哪一边；加在左边时答案正好反号。写成「在等号右边加上一项，写成$u_t+cu_x=Ku_{xx}$，$K$应当是正的还是负的……」。
  - `heat-kernel` 第 2 题 B 项（`:31`）「$\varphi$在$x_0$处有跳跃时，对每个$t>0$，$u$在$x_0$处也有跳跃」：例 1 的阶跃就是反例，几何图像的说明也说了「陡直的台阶被抹成了缓坡」，属于照搬例题判过的例子（plan.md:231）。换成要多想一步的说法，如问 $u(x_0,t)$ 是不是对每个 $t$ 都等于左右极限的平均（错，例 1 靠的是对称）。C 项（`:33`）离 `:77` 只差把点热源换成非负的连续初温，要从 $K>0$ 多推一步，可以不改。这批题还没提交，换选项不算改题号。
  - `spherical-waves` 第 3 题（中等，`:54`）问原点处 $t=1$ 时的值；第 5 题（1）的题干（`:90`）在网页上直接写出了原点处的一般式子 $\varphi(ct)+ct\varphi'(ct)+t\psi(ct)$，讲解 `:67` 还指过去（「一般的式子见第 5 题」），第 3 题就成了一步代入。推荐把第 5 题（1）改成「求$t>0$时原点处的值，用$\varphi$、$\psi$表示」，式子只留在第 3 级提示和参考解答里；`wave-3d` 第 2 题 E 项引第 3 题的 $-e^{-1}$、第 5 题引第 5 题（1）的结论，都不用改。
  - `wave-3d` 第 7 题（1）（思考，`:172`）的主要结论讲解里先说了：`:45`「扰动只在球面扫过区域的那段时间里经过$\vb r$」、`:26` 的叠加图像，把区域换成放电通道就是参考解答（持续时间是球面扫过通道的时间，和惠更斯原理不矛盾，有尽头）。照 plan.md:231 和「每批的流程」第 4 条，要改，改讲解或改题二选一；`:45` 是拍手声短促的主线，推荐改题：（1）留下算持续时间作铺垫，追问讲解没说的，例如站得越远，竖直通道给出的持续时间 $\frac{\sqrt{D^2+L^2}-D}c$ 越短（$D=20\,\mathrm{km}$ 时约 0.66 s），可远处的雷声反而常常拖得更长，为什么，再接到（2）的曲折、分支和反射。

- **小问题 9：英文括注和术语标记**（plan.md:246、:247；`transport-equation`、`burgers-shocks`、`wave-dalembert`、`fourier-transform`、`fourier-inversion`、`heat-equation`、`heat-kernel`、`separation-of-variables`、`spherical-waves`、`string-modes`、`wave-3d`）
  - 本节第一次出现、没括注英文的（题目文字里的照样算）：
    - `transport-equation` 第 6 题第 3 级提示「右极限」（`:133`）、「边界条件」（`:135`）。
    - `burgers-shocks` 第 5 题第 2 级提示「链式法则」（`:107`，讲解里没有这个词）。
    - `wave-dalembert` 第 5 题第 3 级提示「初始条件」（`:103`）。
    - `fourier-transform:75` 链接文字当名词用的「[换元积分法](…)」（integration by substitution）。
    - `fourier-inversion` 第 4 题第 1 级提示「复指数」（`:77`，写「复指数函数（complex exponential function）」）；`:57`「左右极限」（one-sided limits）。
    - `heat-equation:64`「受迫振动」（driven oscillation，不加 `:term`，plan.md:1565）。
    - `heat-kernel:62`「间断点」（point of discontinuity）和「左、右极限」，`:71`「初等函数」（elementary function），第 7 题题干「热导率」（`:152`），第 8 题题干「初始条件」（`:184`），第 8 题第 3 级提示当名词用的「分离变量法」（`:201`，照小问题 7 改了问法就不用）。
    - `separation-of-variables` 第 3 题第 2 级提示「分部积分」（`:62`），第 5 题第 1 级提示「函数项级数」（`:107`），第 7 题题干「热导率」（`:154`）。
    - `spherical-waves` 第 2 题第 3 级提示「行波」（`:43`），第 5 题第 3 级提示「微积分基本定理」（`:99`）。
    - `string-modes` 第 7 题题干「初值问题」（`:158`）。
    - `wave-3d:36`「二阶偏导数」（second-order partial derivative；前面紧挨着的「三阶偏导数」是另一个词），第 5 题第 3 级提示「三重积分」（`:115`）。
    - 「二阶导数」「二阶可导」4 处见小问题 2。
  - `burgers-shocks:143`：常见误区里「马赫锥」第一次出现在引号里的误区原文中，标记和英文括注却放在后面反驳里的第二次出现上；误区 1 是在引号里标的（收尾为「行波」挪过）。挪到引号里。
  - 这一类里 `burgers-shocks` 第 5 题、`wave-dalembert` 第 5 题、`fourier-inversion:57`、`heat-kernel` 第 8 题题干和 `:62` 的「左、右极限」、`separation-of-variables` 第 5 题、`string-modes` 第 7 题、`wave-3d` 第 5 题是我补的，其余是逐节审查员报的。

- **小问题 10：引文、记号、图的说明**（`burgers-shocks`、`spherical-waves`、`wave-dalembert`、`string-modes`、`transport-equation`、`convolution`、`heat-equation`）
  - `burgers-shocks:62`：`:59` 的式子有三个等号，正文说「第二步是牛顿-莱布尼茨公式」，其实第二步是代入方程，第三步才是。改成「第二步用了方程，第三步是牛顿-莱布尼茨公式」。
  - `spherical-waves` 第 6 题第 3 级提示（`:123`）「和第 5 题（3）的固定端是同一回事」：本节第 5 题只有两问，说的是 `wave-dalembert` 第 5 题（3），只有题干带了链接。写成「和[一维波动方程与达朗贝尔公式](lesson:math.pde.wave-dalembert)第 5 题（3）……」。
  - `wave-dalembert` 第 5 题第 3 级提示（`:107`，`:113` 同）引「末端固定时波倒过来弹回」用了「」，不是 `reflection-transmission:48` 的原文。照原文引「波倒过来弹回，末端始终不动」，或去掉引号。
  - `string-modes` 第 2 题第 3 级提示、解答（`:47`、`:51`）「是$n=3$、$A_3=\cos1$、$B_3=-\sin1$的简正模。B 错」：系数 $A_n$、$B_n$ 和选项 A、B 撞了（plan.md:172），写「选项 A 对」「选项 B 错」……
  - `transport-equation:104` 几何图像的说明「圆点从$(1,\frac12)$出发沿特征线$x=1+ct$走」：这张图的两轴是 $x$、$u$，圆点水平移动，特征线画在下面 SVG 的 $(x,t)$ 平面里。改成「横坐标按特征线$x=1+ct$随时间移动」。
  - `convolution:87` 图注「橙线是平移到$x$处的$f(x-y)$」没提翻转，字面上正是误区 2（`:130`）要纠正的说法；图里的 $f$ 是偶函数，看不出翻转。补「把$f$左右翻转、再平移到$x$处（$f$是偶函数，翻转后不变）」。
  - `heat-equation:30`、`:49`：菲克定律那段的 $\rho$ 是「这种分子的密度」，`:36` 起 $\rho$ 又是材料的密度；`:47` 刚写 $D=\frac\kappa{c\rho}$，`:49` 紧接着「同样得$\rho_t=D\Delta\rho$」。照热学 `heat-conduction-diffusion:30` 把分子的密度写成 $\rho_1$，或补一句说明这里的 $\rho$、$D$ 是菲克定律里的。

- **小问题 11：`heat-equation` 没写安排要的稳态旁白**（`heat-equation`）
  - 安排（plan.md:2051）要求讲稳态是调和函数时，旁白链多变量微积分 `curvilinear-coordinates` 第 7 题（均匀产热的小球，plan.md:1150 留的话）和复分析 `harmonic-functions:16`、`:54`、第 8 题（平板上的稳恒温度）。现在一处都没写，`:62`–`:64` 只往下链了 `laplace-equation`。不影响正确性：`harmonic-functions:54` 已经按规矩 C 标了本节的「稳态」，从那边点浮窗能接过来。
  - 改法：`:64` 句末加一句旁白，约 46 个汉字。和重要 2 一起改，讲解加例题约 1552 字，`minutes` 要改成 30，没有余量了；篇幅放不下就在修订说明里写明不加的理由。

- **小问题 12：可改可不改的几处**（不改写一句理由即可）
  - `pde-basics:63`「整条直线上二阶偏导数连续的解都是这种形式」，链过去的 `wave-dalembert` 定理 1 写的是「整个$(x,t)$平面上」，可以对齐用词。
  - `transport-equation:55` 定理 2 的条件「$\Phi_x$、$\Phi_y$不同时为$0$」证明里没用到；第 7 题的 $E$ 在平衡点两个偏导数同时为 0，参考解答只好注明「不用」。删掉，或在证明思路里补半句它的用途。
  - `burgers-shocks:67` 守恒律的边界情况已经说出第 5 题（2）的结论（两边乘 $u$ 以后跳跃速度不同）。第 5 题是难题，不违反只管思考题的那一条；想让（2）有东西可想，可以改问「证明两侧不等的跳跃不可能同时满足这两个守恒律的兰金-于戈尼奥条件」。
  - `heat-kernel:57` 引热学「走 1 cm 只要十秒左右」，接着算出「宽度长到 1 cm 要约 4 s」，可以补半句：那里是按 $t\approx\frac{L^2}D$ 估的量级，差的因子 2 来自宽度的量法。

## 改了没报的

没有。
- `git status` 里偏微分方程这一批的改动、新文件，和写稿员汇报第九部分一一对上：`_domain.yaml`（术语表 0 → 40 条；宏是写代码的会话开写前加的，汇报写明了）；13 节的 `lesson.md`、`problems.yaml`（`fourier-inversion`、`convolution`、`spherical-waves` 整个目录是新的，大纲是写代码的会话开写前建的），6 张 SVG；收尾改的多变量微积分 `_domain.yaml`、`divergence-theorem/lesson.md`，数学分析 `_domain.yaml`、`fourier-series/lesson.md`。
- 收尾改的 7 项（汇报第二部分）逐项对过，都在：同一批的提前提到（`pde-basics` 讲解里 5 块的「热方程」「波动方程」，3 道题的题目文字）、进别的领域的表、`burgers-shocks:140` 挪进引号的「行波」、4 处英文括注、$\xi$ 的说明、$\lambda\to\mu$ 和 $T\to t_1$、「证明思路」加粗、`fourier-transform` 第 2 题对调 A、E（`value` 现在是 `[1, 2]`，`npm run verify` 对上）。
- 不是写稿员改的：批次 27 的 6 节大纲、新建的 4 节大纲、振动与波 `group-velocity` 的前置（写代码的会话开写前改的，汇报列了）；别的领域那 9 个文件（写代码的会话起的跨领域 agent 改的，汇报第十部分说还没做，写汇报时确实还没做）。工作区里多变量微积分 `vector-fields`、`stokes-theorem` 的改动是广义相对论那边标的「引力场」，不是这一批的。
- `tools/verify/` 下 13 个 `math.pde.*.ts` 是逐节审查员的验算脚本，只 import 已有的 `lib.ts`、`math.ode._numeric.ts`、`math.analysis._numeric.ts`、`math.vector-calculus._vc.ts`，没有改共用文件（`git status` 里这些共用文件没有 `M`）。
- 汇报里的数核过：三张术语表的条数（PDE 0 → 40、多变量微积分 81 → 82、数学分析 97 → 99），`minutes` 表和汉字数（我数的和汇报第五部分一致），选择题字母表，都对。
- 跨领域 agent 提醒的 `harmonic-functions` 里两个工作流的改动已经分开了：`:34` 的逻辑与集合标记随批次 25 提交（`33456fa`），工作区只剩 `:54` 这一处。
- 工作区里另有这一批量子力学、广义相对论和另一批逻辑与集合、热学、振动与波的改动，以及 `docs/plan.md`、`README.md`，提交偏微分方程时别带上。

## 需要你决定的（要写代码的会话定的）

下面 6 条由写代码的会话定，每条写了我的推荐。

1. **「频率变量」进不进表**（小问题 5）。
   - 现状：`fourier-transform:59` 在 `def-fourier-transform` 那一段写「$\xi$叫作频率变量（frequency variable）」，`fourier-inversion:30`、`convolution:41`、`heat-kernel:28` 都写「$\xi$是频率变量」。安排的记号条只说「各节当场说清」；写稿员当说明用的描述词、没进表（汇报第六部分第 2 条），逐节审查员认为照 plan.md:248 要进表。
   - 推荐：进表。「叫作」是在起名，4 节当名词用，照 plan.md:248 就该进；代价是一个条目加 4 处标记，汉字不变。id `math.pde.frequency-variable`，`definedIn: math.pde.fourier-transform`，`anchor: def-fourier-transform`，简介可写「傅里叶变换$\hat f(\xi)$的自变量$\xi$：$\hat f(\xi)$量的是$f$里按$e^{i\xi x}$变化的成分。」（26 字）。
   - 要当记号，就把 `fourier-transform:59` 的「叫作」改成说明（「$\xi$是频率变量」），写回时注明它和「积分变量」一样不进表。
2. **「误差函数」进不进表**（小问题 5）。
   - 现状：安排定它只在 `heat-kernel` 加锚点（`def-erf`）。可单变量微积分 `antiderivatives` 第 8 题第 3 级提示（`problems.yaml:163`，网页上看得见）已经当名词用了：「概率里常用的误差函数（error function），乘上一个常数因子就是$e^{-x^2}$的原函数」，意思相同。照 plan.md:248（题目文字、别的领域、已写的节都算），两节用到就该进表；安排起草时多半没看到这一处。
   - 推荐：进表。id `math.pde.error-function`，`definedIn: math.pde.heat-kernel`，`anchor: def-erf`，简介可写「$\operatorname{erf}z=\frac2{\sqrt\pi}\int_0^ze^{-s^2}\dd s$，奇函数，从$-1$增到$1$；热核在半直线上的面积用它表示。」（27 字）。`heat-kernel:69` 起名处和例 1 块（`:108`）补标记；`antiderivatives` 那处是题目文字，可标可不标，`status` 不动。
3. **电磁学 `retarded-potentials:22` 的「球面波」标记**（跨领域 agent「拿不准的」第 2 条）。
   - 现状：批次 23 标了 `physics.oscillations-waves.spherical-wave`（plan.md:1653），那时链上没有讲球面波的节。这一批拆出 `spherical-waves`，`retarded-potentials` 经 `wave-3d` 把它接上了链（`graph.json` 核过），振动与波的 `waves-in-3d` 仍不在链上。
   - 推荐：去掉标记、留英文括注，`status` 不动。照规矩 C「链上学过的不标记」，先例是这一批量子力学那边 `lasers:64` 的「驻波」（链上进了振动与波 `standing-waves` 以后去掉标记）。我用脚本把以偏微分方程为链上前置的已写小节扫了一遍反方向（别的领域的标记、同一个概念的定义节已经在链上），只有这一处。
4. **变分法 `direct-methods:55` 的「特征值」**（跨领域 agent「拿不准的」第 1 条）。
   - 现状：「用试探函数（trial function）估计特征值（eigenvalue）」，意思是瑞利商那一节边值问题的特征值，和 `math.pde.eigenvalue` 相同；`direct-methods`（第 13 层，批次 5）的链上没有 `rayleigh-quotient`、`separation-of-variables`，也没有线性代数的 `eigenvalues`。
   - 推荐：不标偏微分方程的 id，同意跨领域 agent。这个词在那里的出处是同一领域紧挨着链过去的 `rayleigh-quotient`（决定稿第 14 条：那一节各自定义），浮窗指到偏微分方程第 18 层反而绕远。严格照 plan.md:248，变分法的「特征值」只在 `rayleigh-quotient:42` 加了锚点、`direct-methods:55` 又当名词用了，该进变分法的表；这是批次 5 的原有问题，记在「细节」的「原有问题」里，下次改到变分法时再定。
5. **简单题、中等题的第 3 级提示也写成完整解答，写进 plan.md:284**（小问题 8）。
   - 现状：plan.md:284 只对难题、思考题写明「第 3 级提示照字面写成完整解答」；界面上三级提示都标「方向」「关键步骤」「完整解答」。批次 25 写稿员自己把简单题、中等题也写完整了，那一批审查同意、还报了漏的 1 道；这一批 13 节里 9 节写完整了，前三节和 `fourier-transform` 第 2 题共 12 道没有。
   - 推荐：写进 plan.md:284：「简单题、中等题的第 3 级提示也写到出结论（选哪几项、数是多少），界面上这一级标的是『完整解答』」；这一批的 12 道照小问题 8 补。
6. **多变量微积分 `divergence-theorem` 的 `minutes` 35**（原有问题，收尾汇报第十部分也提了）。
   - 现状：批次 15 写的数，按现在的尺子讲解加例题 836 个汉字是 17 分钟；这次退回 `written` 只改了一处标记。
   - 推荐：这一批不动，审查只看这一轮的改动；以后要统一重估尺子定下来以前的旧节时再一起改。

## 写稿员「我替你定的」

收尾定的 7 条（汇报第七部分第 1–7 条）：
1. 连续性方程、正弦级数、余弦级数进表、补标、退回 `written`，简介是收尾写的，余弦级数也加了别名：同意。三条简介只用 `divergence-theorem`、`fourier-series` 链上的概念，锚点落在起名的那一段；两节只改了起名处的标记和 `status`。
2. 题目文字里同一批的提前提到也标了：同意，和全批一致。
3. 选择题字母只对调 `fourier-transform` 第 2 题的 A、E：同意。36 个正确选项最匀就是 8、7、7、7、7；逐节审查员按改后的 `[1, 2]` 验算过。
4. `pde-basics` 第 6 题 $\lambda\to\mu$、`burgers-shocks` 定理 1 $T\to t_1$：同意，照安排的记号条。
5. $\xi$ 各节当场说明、补英文括注：同意；进不进表见「需要你决定的」第 1 条。
6. 「证明思路」「证明」统一加粗：同意。
7. 别的领域的规矩 C 补标留给写代码的会话：同意，跨领域 agent 已补完（见「跨领域的几处」）。

各节写稿员定的（第 8–20 条），不同意或要补的：
- `pde-basics`「summary 改成『二阶线性偏微分方程……在……的点』」：summary 少了方程的样子，见小问题 4。三型的简介写了方程，同意。
- `burgers-shocks`「几何图像从 6 条特征线改成 4 条加滑块 $A$」：条数、滑块同意，初值 $-A\tanh x$ 不在链上，见小问题 2。
- `wave-dalembert`「加前置 `implicit-differentiation`」：同意（试算 0 节变层、0→0）；还建议给 `pde-basics` 加 `higher-derivatives`，见小问题 2。
- `heat-equation`「summary 带条件」：「材料均匀」不够，见小问题 4。
- `heat-kernel`「第 8 题换成半无界杆的延拓」：换题同意（原题和 `convolution` 第 7 题（2）重复），（3）问拿链外的分离变量法比较，见小问题 7；「分段连续当场说明」缺「为什么」和反例，见小问题 5。
- `spherical-waves`「第 5 题加了内容」：（1）的题干写出了式子，让第 3 题变成代入，见小问题 8。
- `string-modes`「第 6、8 题改了小问」：「不是整数倍」说过头，见小问题 6。
- 其余同意：`fourier-transform`「绝对可积」进表（4 节用，plan.md:248）、伸缩因子写 $\alpha$；`fourier-inversion` 第 4 题避开容差、「复振幅」标振动与波的 id（`phasors` 的那个，链外）；`convolution` 卷积定理的结论加「$f*g$也绝对可积」；`separation-of-variables` 分离常数的定义和特征值卡片写「齐次」；`transport-equation` 的行波反例和「定理 2 的反方向写成唯一性」；`wave-3d` 光学惠更斯原理那句的改法；各节换题、换选项（都没提交过，不算改题号）。

写稿员「拿不准的」（汇报第六部分）：
- 第 1、3、4、6 条：同意，不改（`heat-equation` 第 6 题（3）和 `separation-of-variables` 第 7 题（1）主体不同，不算重复）。
- 第 2 条（频率变量）：见「需要你决定的」第 1 条。
- 第 5 条（特征线的简介只讲一阶线性方程）：同意不改。简介按定义它的那一节写（plan.md:251）；`burgers-shocks`、`wave-dalembert` 当场扩充、各有锚点，浮窗窄一点不会误导。
- 第 7–19 条（各节写稿员的）：
  - `transport-equation` 第 7 题「守恒量、相平面、轨线只括注」：守恒量有链接，相平面、轨线要加，见小问题 7。
  - `fourier-transform` 第 7 题（1）「几乎是例 2 换个字母」：同意保留，（1）是铺垫，主要结论在（2）–（4），讲解没先说；拍频的出处见小问题 7。
  - `fourier-inversion` 第 2 题 D 项的反例正是例 2：同意保留，要看出例 2 是反例得多想一步。
  - `convolution`「例 2 积分号下求导只写了『衰减得快，条件满足』」、`heat-kernel`「『$u$和这个卷积都满足唯一性推论的条件』说得省」「定理 4 要求被积函数连续」：见小问题 1。
  - `heat-kernel`「第 2 题 B、C 是讲解结论换场景」：B 要换，C 可以不改，见小问题 8。
  - `separation-of-variables`「第 3、4 题只取第一项就落在容差以内」：同意不改，余项是 $e^{-9}$ 量级，本来就该略去。
  - 其余同意，不再逐条列。

写稿员「要写回 plan.md 的」（汇报第八部分）：第 2–5、7–11 项同意照录；第 1 项照录，按修订结果改几处（见「细节」最后一节第 1 条）；第 6 项同意。

## 跨领域的几处

- 跨领域补标（写代码的会话起的 agent 做的）：9 个文件、10 处标记，我逐处打开 diff 看了，都对，每个文件只改了这一行，`status` 都仍是 `reviewed`：
  - `partial-derivatives:34`、`what-is-ode:27`、`gram-schmidt:83` 的「偏微分方程」，`multivariable-functionals:52` 的「二阶偏微分方程」（整词）→ `math.pde.pde`：都是旁白，链上没有 `pde-basics`，英文原有，后面的节名链接不动。
  - `what-is-ode:27`「热传导方程」→ `math.pde.heat-equation`（按别名标）：`heat-equation:47` 写了「也叫热传导方程」。
  - `covariant-maxwell:69`「波动方程」→ `math.pde.wave-equation`：$\Box f=0$ 是三维无源方程，和简介的三维形式一致；`gauge-potentials:107`（常见误区块第一次出现）「没有源的波动方程」同义，`:61` 的有源方程照安排不标。两节的链上都没有振动与波的 `wave-equation`（核过）。
  - `jordan-lemma:63`「傅里叶变换」→ `math.pde.fourier-transform`：约定一致。那里说的 $\frac PQ$ 不一定绝对可积，浮窗的「绝对可积的$f$」窄一点，不误导。
  - `harmonic-functions:54`「稳恒温度」（整词）→ `math.pde.steady-state`，补了「（steady-state temperature）」：整个词带标记，英文也写整个词，同意 agent 现在的写法（「拿不准的」第 3 条）。
  - `rayleigh-quotient:42`「边值问题」→ `math.pde.boundary-value-problem`：在 `def-eigenfunction` 那一段里，可起名的是本节自己的特征值、特征函数，边值问题是借的词，照 plan.md:250 可以标；卡片上方的术语名按术语表的 `definedIn` 和 `anchor` 取（`src/components/AnchorBlock.tsx:23`），加这个标记不影响。
- 漏没漏：我把 agent 的 `xpde/scan.mjs` 在现在的工作区重跑（只读），和它 04:58 的 `hits.txt` 比，除了这 10 处变成「已标」、振动与波几节从 `written` 变成 `reviewed`，只多出 `sound-waves` 题目里的一处「波动方程」（链上有振动与波的条目）和量子力学 `bohr-model` 参考解答里「亚稳态」的「稳态」（更长的词，参考解答也不显示），都不用补。反方向另扫了一遍，只有 `retarded-potentials:22`（「需要你决定的」第 3 条）。
- 不补的理由逐类看过，都站得住：
  - 「链上有振动与波的条目」那几节，我用 `graph.json` 核了电磁学 `em-waves`、`waves-in-media`、`waveguides`、`em-wave-energy`、`fresnel-equations`，光学 `huygens-principle`：链上都有振动与波的 `wave-equation` 和 `waves-in-3d`。
  - 安排点名不补的（`fourier-optics` 全节、`rayleigh-quotient` 的特征值和特征函数、热学的傅里叶定律等）、同名不同义的排除表、学科名、批次 1–3 的分析力学、标题和链接文字、题目文字、参考解答，都照安排和先例。
  - `direct-methods:55` 见「需要你决定的」第 4 条。
- 进别的领域的表：连续性方程、正弦级数、余弦级数的简介、锚点、补标见「我替你定的」第 1 条；别的领域的连续性方程（电磁学、牛顿力学、狭义相对论）在排除表里，正弦、余弦级数别处都在链上或在题目文字里，没有要补的，和收尾、跨领域 agent 说的一致。
- 规矩 C 正方向（这 13 节借别的领域的词）：36 处别的领域的标记，我用脚本对过，定义节都不在各自的链上，都是旁白；链上学过的（一致收敛、分段光滑、调和函数、散度定理、拉普拉斯算子、连续性方程在 `heat-equation` 等）只括注。傅里叶三节和 `heat-kernel` 的链上有逻辑与集合的节，全批没有逻辑与集合的标记，照安排。
- 以这一批为前置的已审小节（电磁学 8 节、光学 3 节）：用到的词在它们自己的链上，逐节审查员查过 `images-uniqueness`、`electrostatic-separation`、`waveguides` 等的「边界条件」「分离变量法」，都只括注。

## 细节

### 分级的口径

- 重要：讲解、例题、误区、术语简介、解答里的说法，照最自然的读法不成立，或者推理不成立，和同一节别处、别的节或链接目标矛盾，读者照着会得出错的结论。和批次 23、24、25 和这一批量子力学的报告同一个口径。
- 小问题：措辞不严、少写一个上下文已经交代的条件、引文和术语标记、记号、图、题目设计（思考题的主要结论讲解里先说了也算这一类，但要改）、不显示的参考解答里的小毛病。前置链外的概念用进讲解，批次 23 复分析（`liouville` 例 2、`power-series`）、这一批量子力学都列小问题。
- 逐节审查员一共报了重要 3 条、小问题 72 条（`pde-basics` 5，`transport-equation` 7，`burgers-shocks` 1 + 7，`wave-dalembert` 6，`fourier-transform` 6，`fourier-inversion` 1 + 2，`convolution` 4，`heat-equation` 1 + 7，`heat-kernel` 10，`separation-of-variables` 5，`spherical-waves` 5，`string-modes` 4，`wave-3d` 4）。照这个口径合并以后是重要 2 条、小问题 12 条（小问题按类合并，每条下面逐处列出）：
  - 合并的：`fourier-transform:90` 两位审查员都报了（小问题 3）；`fourier-transform:56` 和 `convolution:33` 是同一个延伸（小问题 1）；`string-modes` 第 6、8 题同一类（小问题 6）；重要 1 连带 `convolution:111`（`fourier-inversion` 审查员报的，`convolution` 审查员没报）。
  - 降级的一条：`burgers-shocks` 的 $\tanh$（审查员列重要），降为小问题 2。它是前置链外的概念用进几何图像的说明，讲解的推理和结论都对，读者不会因此得出错的结论；批次 23 复分析的同类问题列小问题。
  - 两条重要都保留：`fourier-inversion:34` 和 `heat-equation:64` 都是在定义的「为什么」里给出一般说法，反例是同一节自己的题目，读者照着会记错。`heat-kernel:22`「一时传不到」和 `:77` 字面上也相反，可原意明显是「小到不计」，同一节紧接着就把有限传播速度的反面讲透了，列小问题 3。
  - 放宽的一条：`heat-kernel` 第 2 题 C 项（审查员建议和 B 一起换），要从 $K>0$ 再推一步，算 plan.md:231 允许的「要多想一步」，改为可以不改。
  - 改成「可改可不改」的 4 处（小问题 12）：审查员自己也写了可选。
  - 我补的：前三节和 `fourier-transform` 第 2 题共 9 道简单题、中等题的第 3 级提示（小问题 8；`fourier-transform` 审查员放过的那道我不同意）；一元的二阶导数连带 3 节的英文括注和达朗贝尔公式的简介（小问题 2）；英文括注 7 处（小问题 9 末尾列的）；`retarded-potentials:22` 的反方向标记（「需要你决定的」第 3 条）。
  - 删掉的：没有。

### 跑过的检查

- `npm run content`（全站）：0 个错误、0 个警告（06:1x）。
- `npm run verify`：全部一致（443 个小节），偏微分方程 13 个脚本 52 题都是 ✓。
- `npm test`：36 个测试文件，330 通过、2 跳过。
- `npx tsc -p tsconfig.node.json --noEmit`：没有错误（含 13 个新验算脚本）。
- `npm run listings -- math.pde`：通过 0、失败 0、跳过 0（没有代码清单）。
- `levels.mjs --domain math.pde --show …`：13 节 9、10、11、11、15、16、17、17、18、18、18、19、19，`group-velocity` 21、`fourier-optics` 25、`retarded-potentials` 25、`electrostatic-separation` 21、`stationary-states` 26；层级变 0 节，多余前置 0→0。小问题 1、2 的三种加前置单独和合起来试算，都是 0 节变层、0→0。
- 页面检查：我跑的 `pc-isolated.sh`（HEAD 加工作区的 `content/math/pde`、两个 `_domain.yaml`、`divergence-theorem`、`fourier-series` 和跨领域 9 个目录），24 页，结果在 `b26/run-mp/agg-pde/pc-agg.json`（06:3x），见「结论」。和收尾 04:41 那份（15 页）、逐节审查员用的 05:11 那份（13 页）、跨领域 agent 05:07 那份（9 页）一致；这一批的文件 04:40 以后没改过。
- 快照：`snapshot-pde/`（05:10）和工作区比过，`content/math/` 相同。
- 自写脚本（都在 `b26/run-mp/agg-pde/`）：`briefs.ts` 用 `countChars` 数简介、查锚点下面那一段有没有起名的词，`dupes.mjs` 查全站同名术语，`links.mjs` 比链接文字和目标标题，`count.mjs` 数汉字，`chain.mjs`、`chk.mjs` 查前置链，`xtags.mjs` 查这 13 节里别的领域的标记在不在链上，`revscan.mjs` 扫反方向的标记，`engscan.mjs` 查每节第一次出现的英文括注，`cc.ts` 数改法的字数；`hits-now.txt` 是跨领域扫描的重跑结果。

### 篇幅表（讲解加例题，只数汉字）

| 小节 | 层 | `minutes` | 问题 | 讲解 | 几何图像 | 例题 | 误区 | 全节 | 讲解加例题 | ÷52 | 每分钟 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `pde-basics` | 9 | 29 | 78 | 1304 | 113 | 202 | 117 | 1814 | 1506 | 29.0 → 29 | 51.9 |
| `transport-equation` | 10 | 28 | 86 | 1257 | 152 | 193 | 78 | 1766 | 1450 | 27.9 → 28 | 51.8 |
| `burgers-shocks` | 11 | 28 | 71 | 1161 | 219 | 294 | 264 | 2009 | 1455 | 28.0 → 28 | 52.0 |
| `wave-dalembert` | 11 | 27 | 82 | 1150 | 213 | 220 | 119 | 1784 | 1370 | 26.3 → 27 | 50.7 |
| `fourier-transform` | 15 | 28 | 87 | 1160 | 82 | 278 | 118 | 1725 | 1438 | 27.7 → 28 | 51.4 |
| `fourier-inversion` | 16 | 27 | 77 | 1064 | 205 | 335 | 115 | 1796 | 1399 | 26.9 → 27 | 51.8 |
| `convolution` | 17 | 23 | 69 | 786 | 138 | 398 | 111 | 1502 | 1184 | 22.8 → 23 | 51.5 |
| `heat-equation` | 17 | 29 | 70 | 1312 | 100 | 184 | 147 | 1813 | 1496 | 28.8 → 29 | 51.6 |
| `heat-kernel` | 18 | 27 | 72 | 1190 | 77 | 204 | 116 | 1659 | 1394 | 26.8 → 27 | 51.6 |
| `separation-of-variables` | 18 | 29 | 68 | 1360 | 168 | 140 | 107 | 1843 | 1500 | 28.8 → 29 | 51.7 |
| `spherical-waves` | 18 | 25 | 96 | 942 | 129 | 325 | 116 | 1608 | 1267 | 24.4 → 25 | 50.7 |
| `string-modes` | 19 | 26 | 92 | 1162 | 307 | 186 | 94 | 1841 | 1348 | 25.9 → 26 | 51.8 |
| `wave-3d` | 19 | 29 | 85 | 1224 | 150 | 279 | 84 | 1822 | 1503 | 28.9 → 29 | 51.8 |

- 数法：各部分含三级标题和链接文字，不含二级标题，不数公式、术语 id、链接地址、图片替代文字和动画参数。和写稿员汇报第五部分、13 位逐节审查员各自的数一致（`separation-of-variables` 有一位数成 1504，差在三级标题的数法，`minutes` 一样）。
- 尺子：数学按讲解加例题的汉字 ÷ 52 向上取整，不超过 30（plan.md:48）。合计 355 分钟。多变量微积分 `divergence-theorem` 的 35 分钟是原有的，这次只改了一处标记（见「原有问题」）。

### 逐节验算的做法（逐节审查员的脚本，`tools/verify/math.pde.<小节>.ts`）

- `pde-basics`：按定义把方程写成「点、喷射」的函数，在随机的喷射上检验仿射性判线性；分类在格点上读出 $A$、$2B$、$C$，再用矩阵特征值的符号判一次；第 4 题另用直线法、四阶龙格-库塔和理查森外推核到 $10^{-9}$。
- `transport-equation`：不用通解公式，用四阶龙格-库塔沿特征线往回积到给初值的线上，再在所求点附近用差分算残差。
- `burgers-shocks`：黄金分割求 $-\varphi'$ 的最大值并在 40 万个点上核对特征线相交；戈杜诺夫守恒格式解黎曼问题、三角形初值，看激波位置和总量。
- `wave-dalembert`：达朗贝尔公式（分段高斯-勒让德）和显式中心差分两套；第 4 题二分求开始不变的时刻，再核以后 2000 个时刻。
- `fourier-transform`、`fourier-inversion`、`convolution`：一律按定义做分段高斯-勒让德数值积分，跳跃点放进分段点；反演用对称截断加 Richardson 外推；判真假的选项在不对称、带尖角的检验函数上逐条找反例。
- `heat-equation`：差分求梯度和热流，显式差分模拟一端在冰水里、一端绝热的杆，核端点条件。
- `heat-kernel`：卷积按定义积分（积分范围截到 $14\sqrt{4Dt}$），对数尺度算远处的极小值，二分求时刻。
- `separation-of-variables`：打靶求特征值（龙格-库塔加二分），系数用辛普森公式，再用显式差分（虚格点处理绝热端）独立核。
- `spherical-waves`、`wave-3d`：$w=ru$ 奇延拓的达朗贝尔公式、三维基尔霍夫公式（球面上直接做二维求积，斐波那契格点数比例）、差分三套；二维用极坐标差分和泊松公式。
- `string-modes`：打靶求特征值、奇周期延拓的达朗贝尔公式、显式差分；第 4 题是极值题，算出最小周期再核 1 s 也是周期、0.25 s 不是。
- 难题、思考题的数逐节审查员都复算过，例如：$t^*=\frac{8\sqrt3}9$；铁、木头的接触温度 20.9、29.8；地下的年、日温度起伏深度 4.0 m、0.21 m；雷声持续 4.72 s；刚性壁空腔 $\tan kR=kR$ 的两根之比 1.7192；离散拉普拉斯算子的 $\mu_n/\lambda_n\to\frac4{\pi^2}$。

### 术语表新进的 40 条

id 省去前缀 `math.pde.`，括号里是简介字数（按 `countChars`，都不超过 60）；`definedIn`、`anchor` 构建核过，我又逐条看了锚点下面那一段，起名的词都在里面。

- `pde-basics`（8）：`pde` 偏微分方程（38，缩写 PDE）、`linear-pde` 线性偏微分方程（50）、`superposition-principle` 叠加原理（20）、`elliptic-equation`、`parabolic-equation`、`hyperbolic-equation` 三型（各 34，共用 `def-classification`）、`initial-value-problem` 初值问题（35）、`boundary-value-problem` 边值问题（45，和初值问题共用 `def-ivp-bvp`）。
- `transport-equation`（4）：输运方程（45）、特征线（52）、特征线法（35）、行波（37）。
- `wave-dalembert`（5）：波动方程（18）、达朗贝尔公式（48）、依赖区域（50）、影响区域（42，共用 `def-domains`）、有限传播速度（45）。
- `fourier-transform`（3）：傅里叶变换（21）、傅里叶逆变换（30）、绝对可积（29，安排外进表，4 节用，合 plan.md:248）。
- `fourier-inversion`（2）：高斯函数（32）、傅里叶反演公式（29）。`convolution`（2）：卷积（58）、卷积定理（48）。
- `heat-equation`（8）：热方程（46）、傅里叶定律（42）、热导率（25，共用 `def-fourier-law`）、扩散系数（29，共用 `def-heat-equation`）、稳态（34）、初边值问题（41）、狄利克雷边界条件（32）、诺伊曼边界条件（41，共用 `def-boundary-conditions`）。
- `separation-of-variables`（6）：分离变量法（54）、分离常数（40）、特征值（32）、特征函数（25，共用 `def-eigen`）、奇延拓（31）、偶延拓（35，共用 `def-extension`）。
- `spherical-waves`（1）：球面波（41）。`string-modes`（1）：简正模（49）。
- 和别的领域同名的 9 条（叠加原理、初值问题、扩散系数、行波、卷积、特征值、波动方程、球面波、简正模）都是安排定的各自定义，简介都写出了本领域的意思，分得开；`burgers-shocks`、`heat-kernel`、`wave-3d` 照安排只加锚点。
- 简介只用定义它的那一节链上的和本节已起名的概念，例外是达朗贝尔公式的简介用了一元的二阶导数（小问题 2）。要改的简介：线性偏微分方程、高斯函数（小问题 4）；可能新进的「频率变量」「误差函数」（「需要你决定的」第 1、2 条）。

### 记号、链接、选择题

- 记号：照安排「偏微分方程的记号」全批一致：未知函数 $u$，偏导数用下标、写「二阶偏导数连续」（没有 $C^2$）；$\partial_t$ 在 `wave-dalembert`、`heat-kernel` 各说明一次；波速 $c$，扩散系数 $D$，热导率 $\kappa$；`heat-kernel`、`separation-of-variables` 题目里的 $c$ 是比热容，都当场说了，那两节没有波速；$\Delta$ 在三节第一次出现处说明就是 $\nabla^2$，没有 `\lap`、`\Box`、$\dd\Omega$；$\xi$ 各节当场说清；$\lambda$ 只当特征值，$T(t)$ 只当时间因子；全批没有「本征」「主部」「弱解」「熵条件」「镜像法」「基本解」「极值原理」「对流方程」「法向导数」「物质导数」「频移」，「光锥」只在 `wave-dalembert:81` 当旁白、标狭义相对论的 id。不合约定的只有 `heat-equation` 菲克定律那段的 $\rho$、$D$（小问题 10）。
- 链接：13 节正文和题目里 221 处 `lesson:` 链接，带锚点的构建查过锚点存在。链接文字和目标标题不同的 10 处都是在句子里当名词用的（「[拉普拉斯算子]」「[多个自变量的链式法则]」「[牛顿-莱布尼茨公式]」「[常系数齐次方程的解法]」「[过阻尼]」），前面或后面都有英文括注或是同一个词的第二次出现；只当节名用的都和标题一致。「见第 N 题」「例 N」「定理 N」逐节审查员逐个对过，指错的只有小问题 10 的两处。没有「上一节」「下一节」。
- 排版：段落句数、中文和英文数字之间的空格、引号、公式边的手写空格，收尾和逐节审查员都用脚本扫过，没有问题。
- 选择题（14 道，`pde-basics` 第 2 题是 4 个选项的单选，其余是 5 个选项的多选）：`pde-basics` A、D 和 C，`transport-equation` B、C、E，`burgers-shocks` A、B、D，`wave-dalembert` C、D、E，`fourier-transform` A、B，`fourier-inversion` A、C、E，`convolution` B、D、E，`heat-equation` A、B、C，`heat-kernel` A、D、E，`separation-of-variables` C、E，`spherical-waves` B、C、D，`string-modes` A、C、E，`wave-3d` B、D。改小问题 8 的 `heat-kernel` B 项时，答案字母尽量不变（换成一个错的说法即可）。

### 以这一批为前置的大纲要接的

- 振动与波 `plucked-string`：`string-modes` 只讲到求 $A_n$、$B_n$，拨的位置一句没讲，三角形初值留了「放宽了意思的解」的口子（`string-modes:74`、`wave-dalembert` 第 7 题）。
- 振动与波 `group-velocity`：高斯函数的变换（`fourier-inversion` 定理 1）、宽度之积为 2（`:34`，照重要 1 改后是「中心在原点的」）、反演写成 $e^{i\xi x}$ 的叠加和复振幅（`:57`），$\xi=-k$ 在 `fourier-transform:63`。
- 量子力学 `stationary-states`：时间因子由分离常数定（`separation-of-variables:58`），初值按特征函数展开、系数由正交性求写成了一般说法（`:105`）。
- 批次 27：`well-posedness` 可回指 `string-modes` 第 7 题（只给两个时刻的形状）；`energy-method` 兑现 `string-modes:54` 的唯一性；`bessel-functions` 接 `string-modes:56` 和 `separation-of-variables:105` 的鼓；`laplace-equation` 起名拉普拉斯方程时补标 `pde-basics`、`heat-equation:64` 等处（现在只括注）；`greens-identities` 兑现「诺伊曼问题的解只差一个常数」，和重要 2 改后的稳态那句对上；`spherical-harmonics` 当场定义单位球面的面积元时可回指 `wave-3d` 第 5 题。

### 原有问题（不在这一批，下次改到时顺手补）

- 多变量微积分 `divergence-theorem` 的 `minutes` 是 35（讲解加例题 836 个汉字，按现在的尺子是 17），是批次 15 写的数，那时还没有 ÷52 的尺子。这次退回 `written` 只改了一处标记，审查只看这一轮的改动，不要求动它；要不要照实重写，见「需要你决定的」第 6 条（批次 17 之后定的「已写的不拆」只说了光学）。
- 变分法 `direct-methods:55` 把只在 `rayleigh-quotient:42` 加了锚点的「特征值」当名词用（批次 5），严格照 plan.md:248 要进变分法的表、补标（「需要你决定的」第 4 条）。

### 要写回 plan.md 的（审查建议）

1. 写稿员汇报第八部分第 1 项（这一批的记号和做法）照录，按修订结果改：`pde-basics` 的 summary 写方程的样子；`fourier-inversion:34` 写「中心在原点的高斯函数」；`heat-equation` 稳态那句带「表面有一部分保持恒温」；`burgers-shocks` 几何图像的初值照小问题 2 改后的写；`spherical-waves` 第 5 题（1）改成求式子；`string-modes` 第 6、8 题「不再是$n$倍」；术语表条数照「需要你决定的」第 1、2 条定了再写（40、41 或 42 条）；「定下的前置」照小问题 2 的改法补记（`pde-basics` ← `math.calculus.higher-derivatives`，`burgers-shocks` 若加前置也记上）。第 2–11 项照录。
2. plan.md:284「提示分级」：补「简单题、中等题的第 3 级提示也写到出结论」，看「需要你决定的」第 5 条定了再写。
3. plan.md:342「都」「任何」「只有」那一条补例子（批次 26 审查提的）：讲解在定义的「为什么」里给一般说法，定义允许的情形（平移过的高斯函数）、同一节题目里的边界（表面全部绝热）就是反例（`fourier-inversion:34`、`heat-equation:64`）；「不是$n$倍」推不出「不是整数倍」，特殊参数下正好成整数倍（`string-modes` 第 6、8 题）。
4. 「每批的流程」第 3 条「讲解和例题」那一项「链接目标的条件这里满不满足」补例子：单变量微积分的反常积分、比较判别法、换元定理都只对连续函数写，绝对可积的函数可以有跳跃，第一次用到的地方说一句为什么照样成立（`fourier-transform:56`、`:75`，`convolution:33`）；含参变量积分定理 4 的控制函数要连续、结论只有可导（`heat-kernel:28`、`convolution:119`）。
5. 规矩 C（plan.md:249、:250）补反方向：拆分或改前置让别的领域同一个概念的定义节进了一节的链时，那一节原有的规矩 C 标记去掉、留括注，`status` 不动；写代码的会话扫补标时连这一向一起扫（`retarded-potentials:22`，先例 `lasers:64`），看「需要你决定的」第 3 条定了再写。
6. plan.md:248 补例子：安排定「只加锚点」的词，起草时连已写小节网页上看得见的题目文字一起数（`heat-kernel` 的误差函数，`antiderivatives` 第 8 题第 3 级提示早就用了）；「叫作」起名的变量名照「需要你决定的」第 1 条定的写。
7. plan.md:231 补两句：同一节难题、思考题的题干网页上看得见，写出的一般式子能把简单题、中等题变成一步代入的，也算写出了答案（`spherical-waves` 第 5 题（1）和第 3 题）；思考题主要结论先说了的例子加 `wave-3d` 第 7 题（1）（讲解 `:45`）。
8. 「每批的流程」第 3 条「前置」那一项补例子：一元函数的二阶导数不是基础词（`partial-derivatives:34` 按规矩 C 标过），偏微分方程各节写「二阶可导」时链上要有 `math.calculus.higher-derivatives`。

## 修订说明（写内容 agent，2026-11-20，第 1 轮，未提交）

重要 2 条、小问题 12 条都改了，小问题 12 的 4 处可改可不改的也都改了，没有不改的条目。13 节由 13 位写稿员按报告分头修订；领域层面的条目（小问题 2 的前置和 $\tanh$、小问题 4 的两句总结和两条简介）由 `pde-basics`、`burgers-shocks`、`heat-equation`、`fourier-inversion` 的写稿员顺手改了，改 `_domain.yaml` 前都重读过，我收尾时逐字核过、重新试算过。收尾复看各节的修订和节与节之间的一致，再照同类问题整批找一遍，另改了 8 个文件、8 处，见「照同类问题整批找出、一起改的」。下面的行号都是改完以后的。

### 重要 1：「高斯函数的变换还是高斯函数」

- `fourier-inversion:34` 照报告改成「中心在原点的高斯函数，变换还是中心在原点的高斯函数。」没补平移以后的式子，也没写「模不变」，第 2 题 A 项不受影响。
- `convolution:111` 照同样改：「中心在原点的高斯函数（Gaussian function），傅里叶变换还是中心在原点的高斯函数（……定理 1），由卷积定理，卷积的变换是两个这样的高斯函数之积，仍是这样的高斯函数，认出它是谁的变换就行。」
- 全站搜过「还是高斯函数」「仍是高斯函数」「钟形」：只剩 `heat-kernel` 第 3 题解答的「仍是高斯函数」，说的是算出来的那个具体的解，对；`fourier-inversion:98` 的「两条都是钟形」说的是 $e^{-ax^2}$ 和它的变换，也对。

### 重要 2：稳态「和初温无关」

- `heat-equation:64` 照报告补成「边界上的情况和热源都不变、表面有一部分保持恒温时，过很久温度通常不再变（这里不证），分布只由它们决定，和初温无关」。没提全部绝热时怎样，第 5 题（2）的结论没有说破。

### 小问题 1：引用的定理，条件没写全

- `fourier-transform:56` 在绝对可积卡片下面那段补一句：「那一节只对连续函数写，这里的$f$可以有跳跃：反常积分照样先在有限区间上积、再取极限，比较判别法（comparison test）和「绝对收敛则收敛」靠的是保序性（monotonicity）等，对可积的函数照样成立。」`convolution:33` 补「那一节设被积函数连续，有跳跃时判别法照样成立，见[傅里叶变换](lesson:math.pde.fourier-transform#def-absolutely-integrable)一节」。
- `fourier-transform:75` 写成「[换元积分法](…)（integration by substitution）只管有限区间上的连续函数；线性换元把$[-R,R]$的分割（partition）和黎曼和一一对应过去，$f$可积就成立」。同类：`convolution:33` 的换元$y\to x-y$补「（有跳跃也成立，见那一节定理 1）」，指傅里叶变换一节的定理 1（`improper-integrals` 没有编号的定理，指不混）。
- `convolution:121`（从原 `:119` 拆出的一段）写出控制函数 $2a|x-y|e^{-a(x-y)^2}e^{-by^2}\le\sqrt{2a/e}\,e^{-by^2}$（$2a|t|e^{-at^2}$ 的最大值是 $\sqrt{2a/e}$，我复算过），说明满足含参变量积分定理 4 的条件（连续的控制函数、积分收敛）；再补导数连续的理由：导数是有界、绝对可积的 $-2axe^{-ax^2}$ 和 $e^{-bx^2}$ 的卷积。
- `heat-kernel:28` 控制函数补「连续」；`:44` 用括注当场说明卷积满足推论的条件（「卷积连续；照下面定理的证明思路，它对$x$的导数是有界、绝对可积的$K_x$和$\varphi$的卷积，也连续」），和上游 `convolution` 例 2 一个做法。同类：`:30` 括注补「实部、虚部」（定理 4 对实函数写），`:57` 对反常积分换元补「先在有限区间上换元，再取极限」。
- `burgers-shocks:43` 写出 $G(x,t,u)=u-\varphi(x-ut)$、偏导数连续、$G_u=1+t\varphi'(x_0)>0$（我核过），隐函数定理括注「见[反函数定理与隐函数定理](lesson:math.vector-calculus.inverse-implicit#thm-implicit-function)」，规矩 C 的标记留着，没加前置。`:75` 定理 2 补「设$q$有连续的导数」「曲线两侧的可微解连同$u_t$都能连续地延到曲线上」，和第 5 题题干一致。
- `separation-of-variables:84` 补魏尔斯特拉斯判别法的「见」链接和「各项的导数都连续，」；`:79`「周期$2L$的公式」做成指 `fourier-series#def-fourier-series-2l` 的链接，边界情况写 $\varphi(0^+)\ne0$。同类：`string-modes:52` 照同样补链接、「各项的导数都连续，」和「周期换成$2L$同理」；两节第 5 题引一致收敛与极限交换的定理 3 时补齐「原级数收敛」「各项的（各阶偏）导数连续」。

### 小问题 2：讲解里用到前置链外的概念（领域层面）

- $\tanh$：`burgers-shocks` 几何图像（`:84`–`:110`）的初值照推荐换成 $\varphi(x)=-\frac{Ax}{\sqrt{1+x^2}}$，四条特征线写成 $t=\frac{(x_0-x)\sqrt{1+x_0^2}}{Ax_0}$，说明写 $-\varphi'=\frac A{(1+x^2)^{3/2}}$ 在原点最大。我复算过：$t^*=\frac1A$；内侧一对（$x_0=\pm0.4$）交于 $\frac{\sqrt{1.16}}A\approx\frac{1.077}A$，外侧一对交于 $\frac{\sqrt{3.25}}A\approx\frac{1.803}A$，「越靠近原点走得越慢」「离原点越近的两条交得越接近它」都成立；$\varphi$ 是奇函数，`:112`「激波此后停在$x=0$」不变。纵轴范围由 $[0,3]$ 改成 $[0,4]$：$A=0.5$ 时外侧交点在 3.61（原来 $\tanh$ 那版是 3.31，本来就出画面）。没加前置 `hyperbolic-functions`；全领域再搜 `tanh`、`cosh`、`sinh`，0 处。
- 一元函数的二阶导数：`pde-basics` 的 `prerequisites` 末尾加 `math.calculus.higher-derivatives`，只加这一处（报告说两处只加一处，`wave-dalembert` 没加）。我在新的 `graph.json` 上用 `levels.mjs --domain math.pde -pde-basics/math.calculus.higher-derivatives` 反过来试算：层级变 0 节，多余前置改前 0、改后 0；13 节 9、10、11、11、15、16、17、17、18、18、18、19、19，`group-velocity` 21、`fourier-optics` 25、`retarded-potentials` 25、`electrostatic-separation` 21、`stationary-states` 26，都和报告一样。
- 规矩 C 的反方向：`higher-derivatives` 起名的二阶导数、高阶导数、莱布尼茨公式，我用脚本（`b26/run-mp/wrap-pde/hd-rev.mjs`）扫了全站的标记：标了它们的只有单变量微积分自己的节和 `euler-lagrange`、`several-functions`、`partial-derivatives`，这三节链上都没有 `pde-basics`，没有要撤的标记。13 节里别的领域的标记（38 处）用 `agg-pde/xtags.mjs` 重查，定义节都不在链上。
- 英文括注：`pde-basics:63`「二阶可导（twice differentiable）」，`wave-dalembert:61`、`spherical-waves:57`、`string-modes:50`「二阶导数（second derivative）」；同类另补 `wave-dalembert:41`、`spherical-waves:31` 的「二阶可导（twice differentiable）」和 `wave-dalembert` 第 8 题题干的「四阶导数（fourth derivative）」，都是各节第一次出现，都只括注、不标。
- 达朗贝尔公式的简介（`_domain.yaml:333`）不改：加了前置以后，二阶导数已经在定义它的 `wave-dalembert` 的链上。

### 小问题 3：讲解、误区里说过头或少条件

- `transport-equation:52`「设$u$在整个平面上可微，它沿每条抛物线不变……」，`:59`「整个平面上的可微解都是$F(x^2-y)$的样子」。同类：`:16` 写「可微解」，`:27`、`:36` 补「整个平面上的」，`:61`「一般不再不变」（$u_t+cu_x+\gamma u=\gamma$ 的解 $u\equiv1$ 就沿特征线不变）。
- `wave-dalembert:45`「通解（general solution）里是两个任意的二阶可导的一元函数」。
- `fourier-transform:90` 照报告改；「常系数线性常微分方程」整个复合词按规矩 C 标 `math.ode.ode`（本节链上没有常微分方程领域，先例 `complex-exponential:88`），「热方程」标本领域的 id（同一批的提前提到）。同类：常见误区 1 的「约定一换，定理 1、定理 2 里的式子跟着变」说过头（只差常数因子的两种约定下定理 1、2 都不变），改成「同一个函数的变换可能差一个常数因子，或者$\xi$换成$-\xi$；指数的正负号反过来时，定理 1（1）（2）和定理 2 的式子也要改」，三种约定我逐条核过。
- `convolution:132`「结果一般就不同」。`heat-equation:55`「抹平要的时间和$\frac{L^2}D$成正比」。`heat-kernel:22`「杆很长、两端离中间远大于$\sqrt{Dt}$时，端点的影响小得可以不计」；同类 `:68` 补「$\varphi$在$x$处连续时，」。
- `separation-of-variables:41` 把两件事分开：常微分方程的「移到等号两边」「是另一回事」，分析力学「想法和这里相同，只是拆成的是和而不是乘积」。`:105`「乘积解的线性组合（linear combination）仍满足它们（叠加原理），无穷多项要像上面的定理那样另外验证」；同类：同一段补「能逐项积分时」，第 7 题第 2 级提示（3）「同一量级」改成「成正比」。
- `string-modes:16`「为什么原地起伏的振动只有这几种？」。
- `wave-3d:24`「小球里没有初速度、只有球对称的光滑初位移时」，`:36`「$t>0$时就是……」。同类：`:47` 把弦整体抬高写成例 1 里的情形（$\int\psi\le0$ 时不抬高），第 8 题题干（2）、第 3 级提示、参考解答的「只有初位移时」改成「没有初速度、只有初位移时」。

### 小问题 4：一句话总结、术语简介（领域层面）

- `pde-basics:10` 照报告改成「$Au_{xx}+2Bu_{xy}+Cu_{yy}+\cdots=f$在$B^2-AC<0$、$=0$、$>0$的点分别是椭圆、抛物、双曲型。」（`countChars` 22 字）。
- `heat-equation:10` 照报告改成「$c$、$\rho$、$\kappa$为常数且无热源时，能量守恒和傅里叶定律给出$u_t=D\Delta u$。」（28 字），去掉了没交代 $L$ 的「时间尺度$\frac{L^2}D$」。两句在下游各节的前置回顾里自动跟着变。
- 线性偏微分方程的简介（`_domain.yaml:63`）照报告改成「未知函数$u$和它的各阶偏导数都只以一次的形式出现、系数只依赖自变量的偏微分方程；不含$u$及其偏导数的项为零时叫齐次。」（56 字）。同类：`pde-basics` 第 1 题第 2 级提示、`transport-equation` 第 5 题题干的「不含$u$的项」都改成「不含$u$及其偏导数的项」；全领域再搜，0 处。
- 高斯函数：用推荐的第一种改法，定义仍是 $A\ne0$。`fourier-inversion:27`「平移、乘非零常数只改变位置和高低（$A<0$时上下翻过来）」；简介（`_domain.yaml:126`）「$e^{-ax^2}$（$a>0$）以及它的平移和非零倍数$Ae^{-a(x-x_0)^2}$，$A>0$时图像是钟形，……」（36 字，比报告的写法多「非零」两字，和定义的 $A\ne0$ 对上）。

### 小问题 5：定义和起名

- `burgers-shocks:70` 改成先说「满足积分形式、在一些曲线以外是守恒律的可微解的$u$，也算作解（积分形式下的解）」，再说「$u$在其中一条曲线$x=s(t)$上跳跃时，这个跳跃叫作激波」；`:79`「积分形式下的解并不唯一，能实际出现的激波还要满足……」。例 2 的折角、第 6 题（1）的稀疏波都在定义之内，第 6 题（2）的跳跃不再和定义矛盾。同类：第 6 题第 3 级提示（2）和参考解答补「两侧都是常数，把定理 2 证明思路里的算式倒过来读，积分形式也成立」（原来用的是定理 2 的反方向）。
- `burgers-shocks:29` 选第一种：「系数可以依赖$u$本身」，`:31` 的边界情况不动。
- `wave-dalembert:38` 边界情况换成「$c\to0$时都趋于竖直；$c=0$时$\xi=\eta=x$，两族并成同一族竖直线，$(x,t)$和$(\xi,\eta)$不再一一对应，所以要$c\ne0$」。
- `heat-kernel:64` 在定理后面新加一段：「为什么这样要求：左、右极限存在，结论里的平均值才有意义。$\sin\frac1x$（$0$处任补一个值）有界，只在$0$处间断，可那里没有左、右极限，不算分段连续。」
- 「频率变量」「误差函数」进不进表没动，等「需要你决定的」第 1、2 条。

### 小问题 6：题目里推理少一步或说过头

- `pde-basics` 第 4 题第 3 级提示、解答把叠加原理（1）（2）分两步写；第 5 题第 3 级提示（3）、参考解答「非线性方程一般没有叠加原理」，提示里「非线性方程」是本节第一次出现，括注 nonlinear equation。
- `wave-dalembert` 第 8 题第 3 级提示（2）、参考解答「$H$是一次函数或不为$0$的常数，$F$是二次或三次多项式」。同类：第 8 题提示（1）「推不出$w_{\xi\eta}=0$」，（2）（3）「一次函数或常数」；第 7 题提示（2）、参考解答「一次式或常数」；第 5 题（1）题干、提示、参考解答加「$t>0$时」（$u(0,0)=\varphi(0)$ 要到（2）才推出为 0），并补「延好的函数又满足定理 2 的条件时（见（2））」。
- `string-modes` 第 6 题题干（2）「所以第$n$个角频率不再是最低那个的$n$倍」，第 3 级提示、参考解答补 $\kappa=\frac53a^2$ 时 $\nu_3=2\nu_1$；第 8 题第 3 级提示（2）、参考解答「第$n$个不再是最低那个的$n$倍，各个角频率一般也不再成整数比（$\gamma^2=\frac58\omega_1^2$时碰巧有$\nu_2=3\nu_1$）」。两个例子我复算过（$\nu_1^2=\frac83a^2$、$\nu_3^2=\frac{32}3a^2$；$\nu_1^2=\frac38\omega_1^2$、$\nu_2^2=\frac{27}8\omega_1^2$）。同类：第 6 题（3）的「永远对不齐」改成「所有乘积解的角频率不能全都对齐」，判别法那一步补 $\le n^2|A_n|$；第 7 题（1）「$B_n$随便取都行」改成「初速度取哪个满足定理条件的$\psi$都行」。
- `spherical-waves` 第 2 题 C 项题干不改（原点也成立，答案不变），三级提示和解答改用直角坐标直接算（$u_{tt}=6c^2=c^2\Delta u$），A、B 补「在$r>0$上」。同类：第 8 题（3）原来由「两根之比不是整数」推「叠加一般不再是周期函数」，改成直接验证最小那个解不以 $\frac{2R}c$ 为周期（$2kR\approx8.99$ 不是 $2\pi$ 的整数倍），我复算过 $kR\approx4.4934$。
- `heat-equation` 第 5 题第 3 级提示（3）、参考解答补立方体 $(0,\pi)^3$ 上 $u=e^{-3Dt}\sin x\sin y\sin z$ 的例子，$\iiint_Vc\rho u\,\dd V=8c\rho e^{-3Dt}$；题干（1）改成「内能是$\iiint_Vc\rho u\,\dd V$加一个常数」，和讲解 `:36` 对齐。

### 小问题 7：题目文字用到链外的结论

- `transport-equation` 第 7 题：题干「相平面（phase plane，见[一阶线性方程组](…#def-phase-plane)）」；第 3 级提示（2）先除去平衡点 $(k\pi,0)$，轨线补同一个链接；（1）的链接改指 `existence-uniqueness#thm-systems`。同类：（3）和参考解答补「平衡点除外」。
- `wave-dalembert` 第 8 题第 2、3 级提示加「见[常系数齐次线性方程](…#thm-constant-coefficients)」；第 3 级提示（3）把「在一段区间上为 0 的$H$只能恒为 0」改成由「在区间外取一点，那里$H=H'=0$」代进三种情形推出，三种情形我逐一核过。
- `fourier-transform` 第 7 题（4）题干和第 3 级提示加「见[振动的叠加与拍](lesson:physics.oscillations-waves.superposition-beats#def-beats)」。
- `heat-equation` 第 8 题第 2、3 级提示（2）补唯一性，链 `wave-dalembert#thm-dalembert`，第 3 级提示写明「那里的波速$c$就是这里的$a$」（本节的 $c$ 是比热容）；参考解答只写文字。
- `heat-kernel` 第 8 题（3）改成本节就能回答的问法（写成正弦级数、各项怎样衰减、初温为正时很久以后接近半个正弦波），「学到[分离变量法](…)一节时，可以和那里的级数解对照」当旁白；三级提示、参考解答跟着改，第 3 级提示不再把分离变量法当名词用。$b_1>0$、衰减因子之比 $e^{-D(n^2-1)\pi^2t/L^2}$ 我核过。

### 小问题 8：题目设计

- 12 道简单题、中等题的第 3 级提示都写到出结论：`pde-basics` 第 1–4 题（选 A、D；选 C；填 E、H、P；约 1.6912），`transport-equation` 第 2–4 题（选 B、C、E；$\frac2e$；$\ln5$），`burgers-shocks` 第 1–4 题（$\frac8{3\sqrt3}$；选 A、B、D；$x=4.5$；$-\frac\pi{12}$），`fourier-transform` 第 2 题（选 A、B）。每段不超过 4 句。同类在别的节又找出 7 道，见收尾第 2 条。
- `transport-equation` 第 8 题（2）题干写成「在等号右边加上一项$Ku_{xx}$（$K$是常数），方程变成$u_t+cu_x=Ku_{xx}$」，提示、参考解答的 $D$ 跟着换成 $K$。
- `heat-kernel` 第 2 题 B 项换成「$\varphi$在$x_0$处有跳跃时，对每个$t>0$，$u(x_0,t)=\frac{\varphi(x_0^-)+\varphi(x_0^+)}2$」，答案仍是 A、D、E；提示和解答用 $(0,1)$ 上为 1 的初温说明 $u(0,t)<\frac12$，并说明例 1 靠的是对称。C 项照报告不改。写稿员的独立核对（`hk-rev1/newB.mjs`）我重跑过：$D=1$ 时 $u(0,t)$ 在 $t=0.1$、1、10 是 0.4873、0.2602、0.0885。
- `spherical-waves` 第 5 题（1）题干改成「求$t>0$时原点处的值$\lim_{r\to0^+}u(r,t)$，用$\varphi$、$\psi$表示」，式子只留在第 3 级提示和参考解答；第 1、2 级提示里没有这个式子。`wave-3d` 第 2 题 E 项、第 5 题和本节第 7 题引它，都不受影响。
- `wave-3d` 第 7 题改题，讲解 `:45` 不动：题干先交代每一小段的声音按惠更斯原理干净地经过、先后到达；（1）算离下端 2 km、15 km 时各持续多久（约 4.7 s、0.87 s）、越远越短（约 $\frac{L^2}{2cd}$）；（2）追问 15 km 外也响好几秒时通道该是什么样子（沿视线方向伸展一公里以上，3 km 约 9 s），再问别的原因。数我复算过（$\sqrt{234}\approx15.297$）。和报告推荐不同的两处（距离用 15 km；（2）写成假设，不写「远处的雷声反而常常更长」），我同意写稿员的理由：雷声通常在十几公里内才听得见，「为什么……反而……」的前提核实不了（plan.md:342）。

### 小问题 9：英文括注和术语标记

- 报告列的都补了：`transport-equation` 第 6 题「右极限（right-hand limit）」「边界条件（boundary condition）」；`burgers-shocks` 第 5 题第 2 级提示「链式法则（chain rule）」，`:143` 马赫锥的标记和括注挪进引号里的误区原文；`wave-dalembert` 第 5 题「初始条件（initial condition）」；`fourier-transform:75`「（integration by substitution）」；`fourier-inversion` 第 4 题「复指数函数（complex exponential function）」，左右极限的括注放在真正第一次出现的 `:47`（「左、右极限（one-sided limits）」）；`heat-equation:64`「受迫振动（driven oscillation）」；`heat-kernel:62`「间断点（point of discontinuity）」「左、右极限（left-hand and right-hand limits）」、`:73`「初等函数（elementary function）」、第 7 题「热导率」、第 8 题「初始条件」（「分离变量法」照小问题 7 删了）；`separation-of-variables` 第 3 题「分部积分」、第 5 题「函数项级数」（按规矩 C 标 `math.analysis.function-series`）、第 7 题「热导率」；`spherical-waves` 第 2 题「行波」（加了标记）、第 5 题「微积分基本定理」；`string-modes` 第 7 题「初值问题」（加了标记）；`wave-3d:36`「二阶偏导数」、第 5 题「三重积分」。二阶导数、二阶可导见小问题 2。
- 同类各节另补的：`transport-equation:59`「恰当（exact）」、第 5 题「齐次（homogeneous）」；`burgers-shocks` 第 5 题「微积分基本定理」；`fourier-transform` 新写进来的分割、比较判别法、保序性；`fourier-inversion` 第 6 题、`heat-kernel` 第 8 题「绝对收敛（absolutely convergent）」；`convolution` 第 5 题「左右导数（one-sided derivative）」；`separation-of-variables` 第 5 题「偏导数」、`:105`「线性组合」。收尾又补 1 处，见收尾第 1 条。
- 我用审查的 `agg-pde/engscan.mjs` 重扫 13 节，和审查时的 `engscan.txt` 比：报告列的都不再报；新多出的只有链接里的节名（一阶线性方程组、反函数定理与隐函数定理、函数项级数与魏尔斯特拉斯判别法、柱坐标与球坐标下的梯度、散度和旋度）、基础词（长度）和被当成常微分方程「中心」的「中心在原点」，都不用改。

### 小问题 10：引文、记号、图的说明

- `burgers-shocks:62`「第二步用了方程，第三步是牛顿-莱布尼茨公式」；同类：第 5 题第 2 级提示对变上限积分求导那一步改叫「微积分基本定理」。
- `spherical-waves` 第 6 题第 3 级提示写成「和[一维波动方程与达朗贝尔公式](…)第 5 题（3）的固定端是同一回事」。
- `wave-dalembert` 第 5 题第 3 级提示、参考解答改成引原文「波倒过来弹回，末端始终不动」，我和 `reflection-transmission:48` 逐字对过。
- `string-modes` 第 2 题第 2、3 级提示和解答写「选项 A 对」「选项 B 错」……，末尾的「选 A、C、E」照 plan.md:172 不改。
- `transport-equation:104`「横坐标按特征线$x=1+ct$随时间移动」。`convolution:87` 图注补「把$f$左右翻转、再平移到$x$处的$f(x-y)$（$f$是偶函数，翻转后不变）」。
- `heat-equation:30`、`:49` 菲克定律里分子的密度、系数写成 $\rho_1$、$D_1$，`:49` 用 `\pdv` 写 $\pdv{\rho_1}t=D_1\Delta\rho_1$。

### 小问题 11：`heat-equation` 的稳态旁白

- 加了，在 `:64`「见[拉普拉斯方程与调和函数]」后面：「平板上的稳态温度见复分析[调和函数](lesson:math.complex-analysis.harmonic-functions)一节，均匀产热的小球见[柱坐标与球坐标下的梯度、散度和旋度](lesson:math.vector-calculus.curvilinear-coordinates)第 7 题。」链接文字都是目标的标题。这一段 4 句。连同重要 2，讲解加例题 1496 → 1550 字，`minutes` 29 → 30，不超过 1560。

### 小问题 12：可改可不改的 4 处，都改了

- `pde-basics:63`「整个$(x,t)$平面上二阶偏导数连续的解都是这种形式」，和 `wave-dalembert` 定理 1 对齐。
- `transport-equation:55` 删掉定理 2 的条件「$\Phi_x$、$\Phi_y$不同时为$0$」：证明和本节别处都用不到，全站没有链接指向 `thm-first-order`；第 7 题参考解答跟着写「（定理 2）」。
- `burgers-shocks` 第 5 题（2）照建议改问「证明两侧的值$u_-\ne u_+$的跳跃，不可能同时满足这个守恒律和伯格斯方程本身的兰金-于戈尼奥条件」，讲解 `:67` 不动；提示和参考解答用不除的形式推出 $(u_--u_+)^2=0$，我手算核过，原来的 $\frac23$、$\frac12$ 留作例子。
- `heat-kernel:57` 补「（那里按$t\approx\frac{L^2}D$只估量级）」。

### 篇幅

用审查的 `agg-pde/count-one.mjs` 重数（讲解加例题的汉字，÷52 向上取整），`minutes` 都照实改了：

| 小节 | 讲解加例题 | `minutes` |
| --- | --- | --- |
| `pde-basics` | 1506 | 29 |
| `transport-equation` | 1450 → 1478 | 28 → 29 |
| `burgers-shocks` | 1455 → 1524 | 28 → 30 |
| `wave-dalembert` | 1370 → 1391 | 27 |
| `fourier-transform` | 1438 → 1555 | 28 → 30 |
| `fourier-inversion` | 1399 → 1418 | 27 → 28 |
| `convolution` | 1184 → 1296 | 23 → 25 |
| `heat-equation` | 1496 → 1550 | 29 → 30 |
| `heat-kernel` | 1394 → 1519 | 27 → 30 |
| `separation-of-variables` | 1500 → 1553 | 29 → 30 |
| `spherical-waves` | 1267 | 25 |
| `string-modes` | 1348 → 1378 | 26 → 27 |
| `wave-3d` | 1503 → 1510 | 29 → 30 |

合计 370 分钟（报告时 355）。6 节到了 30 分钟，都不超过 1560 字；`fourier-transform`、`separation-of-variables`、`heat-equation` 只剩 5–10 字的余量，以后再加字要先删。

### 照同类问题整批找出、一起改的

各节写稿员照同类找出、一起改的，已经写在上面各条的「同类」里（条件漏写、说过头、英文括注、引文、推理少一步）。

收尾改的（8 个文件，8 处）：
1. `transport-equation:16`、`:31`（英文括注，小问题 9 同类）：写稿员把 `:16` 改成「可微解」以后，「可微」第一次出现挪到了「这一节要回答的问题」，括注还留在 `:31`。我把「（differentiable）」挪到 `:16`，`:31` 写「$u$可微时」，汉字数不变。
2. 简单题、中等题的第 3 级提示写到出结论（小问题 8 同类，7 道选择题）。报告说另外 9 节都写完整了，我把 52 道的第 3 级提示逐道看了一遍：数值题、序列题都写到了数，选择题有 7 道没说选哪几项。
   - `wave-dalembert` 第 2 题：原来还是问句（「积分那一项是多少？」），C、D、E 只列了依赖区间，是停在最后一步之前；改写成完整解答，A、B 各给判断和反例，C、D、E 各给判断，末尾「选 C、D、E」，分两段（2 句、4 句）。
   - `heat-equation` 第 2 题：A、B、C 只给了理由，补「这三项都对」和「选 A、B、C」。
   - `separation-of-variables` 第 2 题：五项只给了算式，补「不是」「是」和「选 C、E」，拆成两段。
   - `fourier-inversion`、`convolution`、`heat-kernel`、`string-modes` 第 2 题：各项都判了，末尾分别补「选 A、C、E」「选 B、D、E」「选 A、D、E」「选 A、C、E」。
   - 答案、题干、选项都没动，7 道的字母和 `value`（`[3,4,5]`、`[1,2,3]`、`[3,5]`、`[1,3,5]`、`[2,4,5]`、`[1,4,5]`、`[1,3,5]`）逐个对过。

查过、没改的：
- 「左、右极限」的英文：`fourier-inversion:47` 写 one-sided limits，`heat-kernel:62` 写 left-hand and right-hand limits，`transport-equation` 第 6 题写 right-hand limit。各节各自第一次出现，英文都对，不强求一样。
- `fourier-transform:90` 把「常系数线性常微分方程」整个复合词标成 `math.ode.ode`：常微分方程的表里没有更窄的条目，照 plan.md:250「复合词的意思就是这个术语时，整个词带标记」，同意写稿员。
- `wave-dalembert:74`「中间只用到$\psi$」、`transport-equation:130` 例 2「$u$沿特征线不再不变」（那里 $f=x$）、`heat-equation:59` 两端恒温的杆「过很久温度不再变」：在各自的上下文里成立，不改。
- 全领域搜过 `tanh`、「若干倍」「怎样叠加」「材料均匀」「一时传不到」「不含$u$的项」：0 处；「没有叠加原理」只剩「一般没有」；「整数倍」剩下的（`string-modes:16`、第 4 题、第 6 题（3）、第 8 题题干的问句，`spherical-waves` 第 8 题）都是对的说法。

### 要写代码的会话定的或改的

1. 「需要你决定的」6 条都没动，等写代码的会话定。
2. 写回 plan.md（报告「要写回 plan.md 的」第 1 条）时请照修订后的文件写：
   - 「定下的前置」补 `pde-basics` ← `math.calculus.higher-derivatives`（只加这一处；`burgers-shocks` 没加前置）。
   - `burgers-shocks` 几何图像的初值是 $-\frac{Ax}{\sqrt{1+x^2}}$，纵轴范围 $[0,4]$。
   - `pde-basics` 的 summary 写方程的样子；`heat-equation` 的 summary 是「$c$、$\rho$、$\kappa$为常数且无热源时，……」；`string-modes` 的 summary 加了「长$L$、」（$\frac{2L}c$ 里的 $L$ 原来没交代，和小问题 4 同类）。
   - `fourier-inversion:34`「中心在原点的高斯函数，变换还是中心在原点的高斯函数」；高斯函数的定义仍是 $A\ne0$，简介写「$A>0$时图像是钟形」。
   - `heat-equation` 稳态那句带「表面有一部分保持恒温」；菲克定律写 $\rho_1$、$D_1$。
   - `spherical-waves` 第 5 题（1）改成求式子；`string-modes` 第 6、8 题「不再是$n$倍」；`wave-3d` 第 7 题按 15 km 改了题。
3. 安排估约 356 分钟，现在是 370（6 节到 30）。
4. 验算脚本：`tools/verify/math.pde.heat-kernel.ts` 第 2 题 B 项查的还是改前的说法（$u$ 在跳跃点是否仍有跳跃），旧说法也是错的，所以仍是 ✓；B 已换成「$u(x_0,t)$等于左右极限的平均」，复核时请把 B 的验法换成新的。脚本是审查的，我没改。

### 检查

- `npm run content`（全站）：收尾全部改完以后跑，0 个错误、0 个警告。中间有一次，另一批正在写的热学 `phase-transitions` 报了 17 个错误（标了术语表里还没有的术语、还没有 `problems.yaml`），偏微分方程 0 个；同一时间页面检查的隔离副本构建是 0 个错误、0 个警告。
- `npm test`：收尾全部改完以后跑，36 个测试文件全过，330 通过、2 跳过。中间那一次只有编译真实内容的那一条失败，报的全是上面热学那一节的错。
- `npx tsx tools/verify/math.pde.<小节>.ts`：13 个脚本都跑了，52 题全是 ✓。验算脚本没改。
- 页面检查：`pc-isolated.sh --include content/math/pde --include content/math/vector-calculus/_domain.yaml --include content/math/vector-calculus/divergence-theorem --include content/math/analysis/_domain.yaml --include content/math/analysis/fourier-series --ids <13 节>`，结果在 `b26/run-mp/pc-wrap-rev1-pde.json`：隔离副本构建 0 个错误、0 个警告；13 节每节 8 题、点 32 下，页面 768/768，行间公式要拖 0 处（最宽 728），KaTeX 报错 0，占位框 0，定义卡片不以句号结束 0；SVG 6 张，出画布、重叠、压线 0 处，没有汉字间距提醒。
- 层级：`levels.mjs`（新的 `graph.json`）见小问题 2，层级变 0 节，多余前置 0→0。
- 字数：summary 都不超过 30（`pde-basics` 22、`heat-equation` 28、`string-modes` 27）；简介线性偏微分方程 56、高斯函数 36、达朗贝尔公式 48（`countChars`）；讲解加例题见「篇幅」。
- 排版：`b26/run-mp/wrap-pde/rev1/sentences-all.mjs` 查 13 节的 `lesson.md` 和 `problems.yaml`（题干、选项、提示、解答、参考解答），超过 4 句的只有 `heat-equation` 图片的替代文字（原来就这样，不是正文段落）；`review-pde-basics/spacing.mjs` 查中文和英文、数字之间的空格，0 处问题，半角引号只在英文人名的撇号和多行公式里。
- 英文括注、标记：`agg-pde/engscan.mjs` 见小问题 9；`agg-pde/xtags.mjs` 别的领域的标记 0 处在链上；`wrap-pde/hd-rev.mjs` 的反方向扫描见小问题 2。
- 比对：和审查快照 `b26/run-mp/snapshot-pde/` 逐文件比过，改动只在 13 节的 `lesson.md`、`problems.yaml` 和 `_domain.yaml` 的 `:63`、`:126` 两行，都在上面各条里；6 张 SVG、批次 27 的 12 个大纲和快照一样，13 节的 `status` 都仍是 `written`。没碰 `progress/` 和别的领域。

## 复核（审内容 agent，2026-11-24，第 1 轮）

这一轮复核 2026-11-20 开始过，前一位复核员 11:09 被额度打断，只差写这一节。我没有沿用它的结论：报告的 14 条和修订说明逐条自己对着现在的文件核，检查全部重跑；它改的 15 处 `status`、换的 `heat-kernel` 第 2 题 B 项验法也核了一遍。

### 复核结论

重要 2 条、小问题 12 条都解决了，没有带进新的重要问题。13 节，和这一批退回 `written` 的多变量微积分 `divergence-theorem`、数学分析 `fourier-series`，都通过，`status` 保持 `reviewed`。改了没报的 2 处，都改得对；遗留小问题 1 条。

### 比了什么

- 快照 `b26/run-mp/snapshot-pde/` 是 2026-11-24 照这一轮的编辑记录倒推重建的。我重跑 `diff -ru`，和预先算好的 `round1-content.diff`、`round1-verify.diff` 逐字节相同；13 节的 `lesson.md`、`problems.yaml` 都从头到尾读了一遍，不只看改过的行。
- 这一轮改的是 29 个内容文件和 1 个验算脚本：13 节的 `lesson.md`、`problems.yaml`（26 个），`_domain.yaml` 的 `:63`、`:126` 两条简介，`divergence-theorem`、`fourier-series` 各只有 `status` 一行，`tools/verify/math.pde.heat-kernel.ts`（前一位复核员换的 B 项验法）。
- 没动的：6 张 SVG（逐字节比过）、批次 27 的 12 个大纲、术语表的条目（仍是 40 条）、多变量微积分和数学分析的 `_domain.yaml`。跨领域补标的 9 个文件、`group-velocity` 的前置用 `git diff` 看过，和初审写的一样。
- 复核后半段，热学 `van-der-waals` 的两个文件和快照不同：另一批的会话正在写，不归这一批。
- `progress/` 里本领域只有 `pde-basics` 的 `startedAt`，没有题目记录，所以这一轮换的选项、改的题（`heat-kernel` 第 2 题 B 项和第 8 题（3），`burgers-shocks` 第 5 题（2），`spherical-waves` 第 5 题（1），`transport-equation` 第 8 题（2），`wave-3d` 第 7 题）不用迁移脚本。

### 逐条核对

- 重要 1：通过。`fourier-inversion:34`、`convolution:111` 都写成中心在原点的；$Ae^{-ax^2}$ 的变换是 $A\sqrt{\pi/a}\,e^{-\xi^2/(4a)}$，照字面成立。没写平移以后的式子，第 2 题 A 项没被说破。
- 重要 2：通过。`heat-equation:64` 补的条件和第 5 题（2）、`separation-of-variables:98`（两端绝热时趋于初温的平均值）不再矛盾，`:59` 的杆、例 1 都合这个条件；第 5 题没有点破。
- 小问题 1：都补对了。
  - `fourier-transform:56`：`improper-integrals` 的反常积分、比较判别法确实设 $f$ 连续，换成在有限区间上可积，那里的道理（保序性加单调有界，$0\le f+|f|\le2|f|$）照样成立。`:75` 线性换元的说法对；`convolution:33` 回指的两处都真的说了这件事。
  - `convolution:121`：$2a|t|e^{-at^2}$ 在 $|t|=\frac1{\sqrt{2a}}$ 处最大，值是 $\sqrt{2a/e}$；含参变量积分定理 4 的条件写全了，导数连续的理由也对。`heat-kernel:28`、`:30`、`:44`、`:57` 和定理 4 对得上。
  - `burgers-shocks:43`：$G_u=1+t\varphi'(x_0)>0$ 对，`inverse-implicit#thm-implicit-function` 写了三个变量的情形；`:75` 和第 5 题题干一致。
  - `separation-of-variables:79`、`:84`，`string-modes:52`，两节第 5 题：和 `function-series` 定理 2、`uniform-limit-theorems` 定理 3（每项的导函数连续、导函数一致收敛、在一点收敛）对得上。
- 小问题 2：`burgers-shocks` 四条线的式子和 $x=x_0-\frac{Ax_0t}{\sqrt{1+x_0^2}}$ 一致，内侧、外侧两对交于 $\frac{1.077}A$、$\frac{1.803}A$，$A=0.5$ 时外侧交点 3.61 在画面里，图截下来看过。前置只加了 `pde-basics` 一处，二阶导数、二阶可导、四阶导数的括注都在各节第一次出现处；反方向的标记没有要撤的。
- 小问题 3：逐处核了，新的说法都没有说过头。
  - `transport-equation` 的「整个平面上的可微解」、`wave-3d:36` 的「$t>0$时」、`string-modes:16` 的问法都对；`transport-equation:61`「一般不再不变」有 $u\equiv1$ 这样的例外，该写「一般」。
  - `fourier-transform:147` 写稿员另改的那句：只差常数因子时定理 1、2 都不变，指数反号时要改的正是定理 1（1）（2）和定理 2，（3）（4）不变，三种约定我各算了一遍。
- 小问题 4：两句总结 22、28 字，两条简介 56、36 字（`countChars`），照字面读没有反例；`heat-equation` 的总结里没交代的 $L$ 去掉了。
- 小问题 5：`burgers-shocks` 的定义现在管得住例 2 的折角、第 6 题（1）的稀疏波和（2）的跳跃，`:79` 不和定义冲突；`wave-dalembert:38` 换成了真正的边界情况；`heat-kernel:64` 的 $\sin\frac1x$ 对。
- 小问题 6：题目里的推理和例子逐个复算。
  - `string-modes`：$\kappa=\frac53a^2$ 时 $\nu_3=2\nu_1$，$\gamma^2=\frac58\omega_1^2$ 时 $\nu_2=3\nu_1$。`wave-dalembert` 第 8 题（3）三种情形里 $H=H'=0$ 都推出 $H\equiv0$。
  - `spherical-waves` 第 8 题：最小两根 4.4934、7.7253，$2kR\approx8.987=1.430\times2\pi$。`heat-equation` 第 5 题（3）的积分是 $8c\rho e^{-3Dt}$。`burgers-shocks` 第 5 题（2）：两边之差恒为 $-\frac{(u_--u_+)^3}{12}$，所以两个条件不能同时成立。
- 小问题 7：加的链接逐个打开核过，锚点、说的事和条件都对（`first-order-systems#def-phase-plane`、`existence-uniqueness#thm-systems`、`constant-coefficients#thm-constant-coefficients`、`superposition-beats#def-beats`、`wave-dalembert#thm-dalembert`）。`heat-kernel` 第 8 题（3）：$\int K(x-y,t)\sin\omega y\,\dd y=e^{-D\omega^2t}\sin\omega x$ 和级数解都用数值积分核过。
- 小问题 8：52 道简单题、中等题的第 3 级提示逐道看了，都写到了结论，和 `value` 一致。
  - `heat-kernel` 第 2 题 B 项是错的（$(0,1)$ 上为 1 的初温，$u(0,t)$ 在 $t=0.1$、1、10 是 0.4873、0.2602、0.0885），例 1 靠对称才一直是平均值，不是照搬判过的例子。`spherical-waves` 第 5 题（1）的题干和前两级提示都没有那个式子，数值核过它。
  - `wave-3d` 第 7 题：4.72 s、0.874 s、$\frac{L^2}{2cd}\approx0.88\,\mathrm s$、$\frac{3000}{340}\approx8.8\,\mathrm s$，都和提示里的数对得上；主要结论（越远越短，要在远处响得久就得沿视线伸展）讲解里没有。用 15 km、（2）写成假设，同意写稿员的理由。
- 小问题 9：报告列的逐处对过，都在真正第一次出现的地方；`burgers-shocks:143` 的马赫锥在引号里。新写进来的名词（恰当、分割、保序性、左右导数、线性组合、平衡点等）都有括注，英文和全站别处一致。
- 小问题 10：七处都对；「波倒过来弹回，末端始终不动」和 `reflection-transmission:48` 逐字相同。
- 小问题 11：加了，链接文字是两节的标题；那一段 4 句，`minutes` 30 合尺子。
- 小问题 12：四处都改了。`transport-equation` 定理 2 去掉条件以后证明不受影响，全站没有链接指向 `thm-first-order`。
- 收尾改的 8 处和「查过、没改的」逐条看过，同意。「没有叠加原理」另有 `burgers-shocks:31` 一处（中间隔着术语标记，纯文字搜不到），说的是伯格斯方程本身，对，不用改。

### 改了没报的

2 处，都改得对，不影响通过：
- `burgers-shocks` 第 2 题解答 D 项（`problems.yaml:59`）补了「在所看的那段时间里」，和第 3 级提示一致：固定的 $a$、$b$ 只在一段时间里够远。
- `fourier-inversion` 第 8 题第 3 级提示（3）（`problems.yaml:189`）「没有关系」改成「一般没有关系」：$f$ 是偶函数时 $\hat f(-\xi)=\hat f(\xi)$，是小问题 3 的同类。

### 遗留小问题（不影响通过，提交前顺手改）

- `heat-kernel:22`「杆很长、两端离中间远大于$\sqrt{Dt}$时」少了「的距离」，读着不顺，改成「两端离中间的距离远大于$\sqrt{Dt}$时」（讲解加例题 1519 → 1522 字，`minutes` 仍是 30）。

### 验算脚本

- `tools/verify/math.pde.heat-kernel.ts` 第 2 题 B 项的新验法核过，判断的逻辑对：两个初温在四个时刻和平均值比，只要有一个差超过 $10^{-6}$ 就判错，另有两个对照。我另写了一份不用它的函数的辛普森积分，各时刻的 $u$ 一致。
- 它的说明写「$t=0.01$、0.1、1、10，和平均相差超过 $10^{-6}$」，对 $(0,1)$ 上为 1 的初温不准：$t=0.01$ 时只差 $8\times10^{-13}$。我把说明换成各时刻实际的差，代码没动，重跑 4 题仍是 ✓。

### 「需要你决定的」

6 条都还没定，这一轮没动。第 1、2 条要加标记时行号变了：误差函数起名在 `heat-kernel:71`，例 1 块在 `:110`；频率变量的 4 处是 `fourier-transform:59`、`fourier-inversion:30`、`convolution:41`、`heat-kernel:28`（不变）。第 5 条：这一批 13 节都已照做。

### 跑过的检查（复核）

- `npm run content`（全站）：0 个错误、0 个警告，前后跑了两次。
- `npm run verify`（全站）：全部一致（443 个小节，1772 题 ✓，0 处 ✗），偏微分方程 13 个脚本 52 题都是 ✓。改了 `heat-kernel` 脚本的说明以后单独重跑，仍是 ✓。
- `npm test`：60 个测试文件全过，632 通过、2 跳过（计算机那边的提交加了测试）。`npx tsc -p tsconfig.node.json --noEmit` 没有错误。`npm run listings -- math.pde`：通过 0、失败 0、跳过 0。
- 页面检查：`pc-isolated.sh --include content/math/pde --include content/math/analysis/fourier-series --include content/math/analysis/_domain.yaml --include content/math/vector-calculus/_domain.yaml --include content/math/vector-calculus/divergence-theorem --ids <15 节>`，结果在 `b26/run-mp/recheck-pc-pde-1.json`：隔离副本构建 0 个错误、0 个警告；每页 8 题、点 32 下，页面 768/768，行间公式要拖 0 处（最宽 728），KaTeX 报错 0，占位框 0，定义卡片不以句号结束 0；SVG 7 张，出画布、重叠、压线、汉字间距提醒都是 0。`burgers-shocks`、`heat-kernel`、`wave-3d` 另截图，看了几何图像和改过的题。
- 层级：`levels.mjs --domain math.pde --show …`：13 节 9、10、11、11、15、16、17、17、18、18、18、19、19，`group-velocity` 21、`fourier-optics` 25、`retarded-potentials` 25、`electrostatic-separation` 21、`stationary-states` 26；反过来去掉新加的前置试算，层级变 0 节，多余前置 0→0。
- 自写脚本（`b26/run-mp/recheck1/`）：`hanzi.mjs` 数讲解加例题，13 节和修订说明的表完全一样，`minutes` 合计 370，最多 1555 字；`sent.mjs` 查超过 4 句的段，0 处；`space.py` 查中英文空格、半角标点，0 处是这一轮带进来的；`cc.ts` 数总结和简介；`nums.py`、`hkB.ts` 复算这一轮的数；另查了控制字符、引号和括号成对，0 处问题。
- 审查的旧脚本重跑：`agg-pde/xtags.mjs`（别的领域的标记 38 处，0 处在链上）、`agg-pde/engscan.mjs`（逐条看过，没有新漏的）、`agg-pde/links.mjs`（237 处 `lesson:` 链接，文字和标题不同的 11 处都是在句子里当名词用的，比初审多的一处是 `separation-of-variables:79` 的「周期$2L$的公式」）、`wrap-pde/hd-rev.mjs`。

### 保持 reviewed 的

`math.pde.pde-basics`、`math.pde.transport-equation`、`math.pde.burgers-shocks`、`math.pde.wave-dalembert`、`math.pde.fourier-transform`、`math.pde.fourier-inversion`、`math.pde.convolution`、`math.pde.heat-equation`、`math.pde.heat-kernel`、`math.pde.separation-of-variables`、`math.pde.spherical-waves`、`math.pde.string-modes`、`math.pde.wave-3d`，多变量微积分 `math.vector-calculus.divergence-theorem`、数学分析 `math.analysis.fourier-series`。前一位复核员已经改成 `reviewed`，我核过没有问题，没再动内容文件。没有提交。

## 遗留小问题的修改（写内容 agent，2026-11-24）

复核的「遗留小问题」只有 1 条，照改了。内容文件只动了 `heat-kernel/lesson.md` 第 22 行，`status` 仍是 `reviewed`；别的文件、题目都没动。临时文件在 `b26/run-mp/leftover-pde/` 下。

- `heat-kernel:22`：「两端离中间远大于$\sqrt{Dt}$时」改成「两端离中间的距离远大于$\sqrt{Dt}$时」，只加了「的距离」三个字。这一段仍是 2 句，行号都不变。
  - 篇幅：讲解加例题 1519 → 1522 字（讲解 1315 → 1318，例题 204 不变；审查的 `agg-pde/count-one.mjs` 和复核的 `recheck1/hanzi.mjs` 数的一样），`minutes` 仍是 30（1522 ÷ 52 向上取整），离 1560 还有 38 字。修订说明「篇幅」表里 `heat-kernel` 的 1519 现在是 1522，13 节的 `minutes` 合计仍是 370。
  - 修订说明小问题 3 引的这一句是改之前的写法，写回时以现在的文件为准。别的小节、`plan.md` 都没有引这一句。
  - 同类：自写的 `same-kind.mjs` 在 13 节的 `lesson.md`、`problems.yaml` 里找「离……」「远大于」「远小于」这类说法，62 处逐条看过。另有三处也省了「的距离」：`wave-3d:51`「离$\vb r$是$\sqrt{d^2+z^2}$」，`wave-3d` 第 2 题解答 B（`problems.yaml:49`）「离$\vb r$都不超过$|\vb r|+a$」，`string-modes` 第 7 题参考解答（`problems.yaml:183`，网页上不显示）「离整数小于$\frac1N$」。它们后面直接跟数，不像「离中间远大于」那样会断错，复核也没有列，这一轮只改列出的一处，没动。

检查：

- `npm run content`（全站）：改之前、改之后各跑一次，都是 0 个错误、0 个警告。
- 页面检查：`pc-isolated.sh --include content/math/pde --include content/math/analysis/fourier-series --include content/math/analysis/_domain.yaml --include content/math/vector-calculus/_domain.yaml --include content/math/vector-calculus/divergence-theorem --ids math.pde.heat-kernel`，结果在 `leftover-pde/pc-heat-kernel.json`。隔离副本构建 0 个错误、0 个警告；8 题、点 32 下，页面 768/768，行间公式要拖 0 处（最宽 728），KaTeX 报错 0，占位框 0，定义卡片不以句号结束 0；这一节没有 SVG。另截图看了改过的这一段，显示正常。
- 排版：复核的 `recheck1/sent.mjs` 超过 4 句的段 0 处，`recheck1/space.py` 在这一节 0 处问题；改前改后的反斜杠个数一样。
- 没改题目，不用跑验算脚本；顺手跑了 `npx tsx tools/verify/math.pde.heat-kernel.ts`，p1–p4 都是 ✓。
- `content/math/pde` 的 45 个文件和改之前逐个比过校验和，只有 `heat-kernel/lesson.md` 变了。没碰 `plan.md`、`progress/`，没有提交。

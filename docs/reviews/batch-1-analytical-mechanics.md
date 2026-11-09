# 批次 1 审查报告：分析力学（拉格朗日力学 8 节）

审内容 agent（和写内容 agent 是两个独立会话，没有读它的会话记录、交接说明和自查脚本）· 2026-11-09

审查范围：`content/physics/analytical-mechanics/` 下 `constraints`、`virtual-work`、`lagrange-equations`、`constraint-forces`、`cyclic-coordinates`、`energy-function`、`hamiltons-principle`、`noether-theorem` 8 节的 `lesson.md`、`problems.yaml`、SVG，以及 `_domain.yaml` 的改动（新增宏 `\uv`、28 个术语）。

## 结论

重要 2 条（3 处），小问题 4 条（同一类合成一条，共 12 处）。

- 32 道简单题、中等题的标准答案全部和独立验算一致；16 道难题、思考题的参考解答逐题读过，没有发现错误。
- **重要 1 · 两处判据漏了「不随时间变」的条件**：虚功原理的「当且仅当」只对定常约束成立，本节自己的转动铁丝就是反例；能量函数一节把「$h$ 等于机械能」的条件写成「约束定常」，还断言否则机械能也不守恒，本节 p5 就是反例。
- **重要 2 · `virtual-work` 缺前置**：讲解通篇用偏导数、全微分和多元函数的驻点，前置链上没有多变量微积分。加一条前置就行，层级不变。
- 小问题：讲解里说过头的话 2 处；几何图像和说明对不上 3 处；前置与术语衔接 4 处；题面与难度档 3 处。
- 有 5 节改了批次 0 定的前置，都合理、没有多余前置，见「前置的改动」。
- 几何图像：7 节有 SVG、7 节有动画组件（`constraints` 只有 SVG，`lagrange-equations` 只有相图），没有占位框；滑块范围和初值都合理（说明文字有几处对不上，见小问题 2）。
- 没有挡住 `reviewed` 的结构性问题：8 节修完都可以标。`noether-theorem` 现在就没有要修的。

| 小节 | 重要 | 小问题 |
| --- | --- | --- |
| `constraints` 约束与广义坐标 | 0 | 1（4b） |
| `virtual-work` 虚功原理与达朗贝尔原理 | 2（1a、2） | 3（2a、2b、3b） |
| `lagrange-equations` 拉格朗日方程 | 0 | 3（1a、2c、4c） |
| `constraint-forces` 拉格朗日乘子与约束力 | 0 | 2（3d、4a） |
| `cyclic-coordinates` 广义动量与循环坐标 | 0 | 2（1b、3a） |
| `energy-function` 能量函数与能量守恒 | 1（1b） | 0 |
| `hamiltons-principle` 哈密顿原理 | 0 | 1（3c） |
| `noether-theorem` 诺特定理 | 0 | 0 |

编号对应下面的分类：

- 重要 1（判据漏了「不随时间变」的条件）：1a `virtual-work`，1b `energy-function`。
- 重要 2（缺前置）：`virtual-work`。
- 小问题 1（说过头的话）：1a `lagrange-equations`，1b `cyclic-coordinates`。
- 小问题 2（几何图像和说明对不上）：2a、2b `virtual-work`，2c `lagrange-equations`。
- 小问题 3（前置与术语衔接）：3a `cyclic-coordinates`，3b `virtual-work`，3c `hamiltons-principle`，3d `constraint-forces`。
- 小问题 4（题面与难度档）：4a `constraint-forces`，4b `constraints`，4c `lagrange-equations`。

## 怎么审的

- 通读 `docs/plan.md`；用 `git diff HEAD -- content/physics/analytical-mechanics/` 看本批改动（8 节从目录写成正文，`_domain.yaml` 加了宏和术语表）。
- 逐节读讲解、例题、常见误区，推导逐步核对。SVG 按源码里的坐标核对几何（角度、长度、点是否落在线上）；动画参数手算平衡点、极值和显示范围。
- 简单题、中等题：只用 `npm run statements -- <小节 id…> --tier easy,medium` 读题，写完验算脚本、跑出结果以后才打开 `problems.yaml`，再看提示、解答和难题。
- 难题、思考题：16 题的参考解答全部读了（不只抽查），连同三级提示。
- 术语：用脚本检查每节第一次出现是否带英文全称、每个三级标题下第一次出现是否标记（课文全部合格；题目文字按方案是「可以标」，没算问题）；术语表简介和锚点逐条看。
- 前置：用脚本列出每节的整条前置链，对照讲解用到的概念；改前置的建议套到全图上模拟过冗余前置和层级。
- 页面：`npm run build` 后用 `test-serve` 打开（进度写临时仓库），8 节的几何图像截图看过，控制台没有报错。
- 跑过的命令：`npm run content`（0 个错误、0 个警告）；8 个验算脚本单独跑，再跑 `npm run verify`（15 个小节全部一致，含数学分析）；`npx tsc -p tsconfig.node.json --noEmit`（通过）；`npm run build`（通过）。

## 简单题、中等题的验算

脚本在 `tools/verify/physics.analytical-mechanics.<小节>.ts`，共用部分在 `tools/verify/physics.analytical-mechanics._mech.ts`（文件名第三段以下划线开头，`npm run verify` 不把它当成小节脚本）。每道题用两种互相独立的算法：一种从各质点在惯性系里的直角坐标出发数值地解（按达朗贝尔原理解广义加速度、直角坐标里配乘子求约束力、RK4 积分加事件定位、打靶求真实路径），不用讲解或题目里推好的方程；另一种是手推的公式。两者先互相核对（相差超过 $10^{-6}$ 就报错），再和标准答案比。选择题对每个选项做数值实验判断对错。

| 小节 | p1 | p2 | p3 | p4 |
| --- | --- | --- | --- | --- |
| `constraints` | 5 ✓ | A、B、D ✓ | 6 ✓ | 4 ✓ |
| `virtual-work` | 6 ✓ | A、B、D ✓ | $\sqrt3/2$ ✓ | $1/7$ ✓ |
| `lagrange-equations` | A、C ✓ | $-1/2$ ✓ | $-4\sqrt3/7$ ✓ | $49\sqrt2/20$ ✓ |
| `constraint-forces` | 6.9 ✓ | A、C ✓ | $-1/3$ ✓ | $5/6$ ✓ |
| `cyclic-coordinates` | 6 ✓ | C、D ✓ | 4 ✓ | $1/8$ ✓ |
| `energy-function` | 2.5 ✓ | A、B ✓ | $\pi/2$ ✓ | 1.98 ✓ |
| `hamiltons-principle` | 6 ✓ | A、C ✓ | $\pi$ ✓ | $1/2$ ✓ |
| `noether-theorem` | $-14$ ✓ | B ✓ | 6 ✓ | $\sqrt2/4$ ✓ |

各题的算法写在脚本的 `notes` 里，`npm run verify` 会打印出来。

## 前置的改动

和批次 0 审过的目录相比，5 节改了前置，都合理、都是最少的（模拟过：全图没有能由别的前置推出的前置）。

| 小节 | 批次 0 | 现在 | 看法 |
| --- | --- | --- | --- |
| `virtual-work` | `constraints`、`newtonian-mechanics.work-energy` | `constraints`、`newtonian-mechanics.potential-energy` | 合理：讲解用势能和保守力；`potential-energy` 推得出 `work-energy`。但还缺多变量微积分，见重要 2。 |
| `cyclic-coordinates` | `lagrange-equations` | 加了 `newtonian-mechanics.angular-momentum-systems` | 合理：讲解用单个质点和质点系的角动量、两个物体的总动量；诺特定理用的质点系总角动量也经它进链。建议再加 `central-forces`，见小问题 3a。 |
| `energy-function` | `lagrange-equations` | `cyclic-coordinates` | 合理：$h$ 的定义要用在 `cyclic-coordinates` 定义的广义动量；推得出 `lagrange-equations`。 |
| `hamiltons-principle` | `lagrange-equations`、`calculus-of-variations.several-functions` | 加了 `oscillations-waves.simple-harmonic-motion` | 合理：「驻值，不一定是极小」一段和 p3、p4、p7、p8 都要用谐振子的解 $x=c\sin\omega t$ 和半周期 $\pi/\omega$，别的前置推不出它。 |
| `noether-theorem` | `cyclic-coordinates`、`hamiltons-principle` | `energy-function`、`hamiltons-principle` | 合理：时间平移那一段的守恒量就是能量函数；`energy-function` 推得出 `cyclic-coordinates`。 |

## 逐节

### physics.analytical-mechanics.constraints 约束与广义坐标

讲解、两道例题、常见误区都对；双摆和位形空间的 SVG 按坐标核对过（两个摆角、位形空间里的点、粘边箭头和穿出穿入的曲线都对得上）。一句话总结准确。8 题的答案、提示、参考解答都对；p5（刚体 6 个自由度）、p6（立着滚的硬币可达任意位形）的证明完整；p8 借博苏克-乌拉姆定理说明球面上没有全局坐标，作为「和别的领域的联系」合适。

- **小问题 4b · p3 题面可以有两种读法**（`problems.yaml:52`）：「链的上端固定在天花板上的一点」没说上端能不能转。读成只能在一个平面里摆的铰链，答案是 5；读成焊死，答案是 4。标准答案 6 要求上端也能自由转动。建议改成「链的上端用能自由转动的铰链挂在天花板上的一点」。

### physics.analytical-mechanics.virtual-work 虚功原理与达朗贝尔原理

刚性杆、滑轮、纯滚动的虚功计算，广义力的定义和量纲，达朗贝尔原理的推导，例 1（梯子，$F=\frac12mg\tan\theta$）、例 2（阿特伍德机）都对。8 题都对：p5 逐个解除约束求三个约束力，p6 碗中杆的 $2R\cos2\theta=a\cos\theta$ 是经典结果，推导无误。

- **重要 1a · 虚功原理的「当且仅当」漏了「约束定常」**（`lesson.md:59` 定义卡片、`:61` 充分性的证明、`_domain.yaml:142` 术语简介）。约束随时间变时，「虚功为零」推不出「保持静止」：本节自己的转动铁丝，在水平面内转，珠子在离转轴 $1\,\mathrm{m}$ 处，重力垂直于铁丝，任何虚位移上主动力的虚功都是零，可珠子根本不可能停在原处。毛病出在 `:61` 的证明：「让约束力取 $\vb{R}_i=-\vb{F}_i$，「一直静止」满足牛顿定律」要求「一直待在这个位置」和约束相容，这只有约束不随时间变时才成立。建议：定义卡片和术语简介写成「受定常的理想约束的系统……」（简介注意 60 字上限）；`:61` 补一句「约束不随时间变，「一直待在这个位置」才和约束相容」。必要的那一半（静止 ⇒ 虚功为零）不受影响，一句话总结也不用改。
- **重要 2 · 前置链上没有多变量微积分**（`lesson.md:7`）。讲解从头到尾在用偏导数和全微分：`:25` $\delta\vb{r}_i=\sum_j\frac{\partial\vb{r}_i}{\partial q_j}\delta q_j$，`:27` 实际位移 $\dd\vb{r}_i=\sum_j\frac{\partial\vb{r}_i}{\partial q_j}\dd q_j+\frac{\partial\vb{r}_i}{\partial t}\dd t$，`:37`「一阶改变」，`:63`–`:74` 的广义力、$\frac{\partial\vb{r}}{\partial\varphi}$、$\delta V=\sum_j\frac{\partial V}{\partial q_j}\delta q_j$ 和「$V(q_1,\dots,q_n)$ 的驻点」。现在的整条链（24 节）只有单变量微积分和向量、点积，`math.vector-calculus` 一节都没有；多元链式法则要到下一节 `lagrange-equations` 才进链。建议前置加 `math.vector-calculus.differentiability`（全微分与切平面，推得出偏导数）。模拟过：全图没有新增的多余前置（`lagrange-equations` 的 `multivariable-chain-rule` 仍不能由别的前置推出），这一节仍在第 15 层，分析力学各节层级都不变。
- **小问题 2a · SVG 里 $t+\dd t$ 时刻的铁丝画歪了**（`virtual-displacement.svg:5`–`:6`）。注释说这条虚线和水平方向成 33°，实际终点 $(407.6,\ 13.3)$ 画成了 37°；实际位移 $\dd\vb{r}$ 的箭头尖 $(363.2,\ 72.1)$ 离虚线约 20 个单位，没落在 $t+\dd t$ 时刻的铁丝上，而这张图要说的正是「$\dd\vb{r}$ 指向那时铁丝上的点」。把终点改成 $(407.6,\ 43.3)$（33°，正好经过箭头尖），标签 `(414, 20)` 跟着移到 $y\approx48$。
- **小问题 2b · 倒立摆「下端铰接在地上」和平衡位置矛盾**（`lesson.md:116`）。新的平衡位置满足 $\sin\theta=K\theta$，$K<2/\pi\approx0.64$ 时 $|\theta^*|>\pi/2$，摆球在铰链下方；滑块初值 $K=0.6$ 时 $\theta^*\approx1.66$（约 95°）就已经钻到地面以下，下限 0.2 时是 149°。建议改说明：「下端铰接在一个固定的支点上（杆可以转到水平以下）」；或者把滑块下限改到 0.65、初值改到 0.8（$\theta^*\approx1.12$）。
- **小问题 3b · 「惯性力」的定义段没有锚点，名字也和牛顿力学撞车**（`lesson.md:78`）。「把 $-m_i\ddot{\vb{r}}_i$ 看成一个力，叫作惯性力（inertial force）」是在下定义，方案要求下定义的段落都加锚点（不在术语表里也要加）。另外牛顿力学 `accelerating-frames`（平动加速参考系与惯性力）里的「惯性力」指非惯性系里的 $-m\vb{a}_{\text{系}}$，同名不同义。建议加锚点，并补一句两者的关系，例如「它就是在跟着这个质点一起加速的参考系里看到的惯性力」；或者叫「达朗贝尔惯性力」。

### physics.analytical-mechanics.lagrange-equations 拉格朗日方程

「消点」「交换」两个恒等式和从达朗贝尔原理到拉格朗日方程的推导完整无误，符合 `full`；$T+V$ 的反例、乘常数加常数的边界情况、非定常约束和惯性系的说明都对。例 1 的斜面和滑块结果 $\ddot s=\frac{(M+m)g\sin\alpha}{M+m\sin^2\alpha}$ 对，`wedge.svg` 的几何（30° 斜面、滑块贴斜面、$s$ 从顶点量起）核对过。8 题都对：p5 证明拉格朗日方程在坐标变换下形式不变，p6 振动悬点的单摆，推导一步步核过。

- **小问题 1a · 例 2 的结论说过头**（`lesson.md:155`）：「只要一开始不在转轴上或有向外的速度，珠子就会被越甩越远」。解 $s=Ae^{\omega t}+Be^{-\omega t}$ 里，初速度恰好向内、大小是 $\omega s_0$ 时 $A=0$，珠子渐近地滑向转轴，不会被甩远。建议改成「除非初速度恰好向内、大小正好是 $\omega s_0$，珠子都会被越甩越远」。
- **小问题 2c · 相图的说明和初始轨迹对不上**（`lesson.md:97`–`:100`、`:111`）。说明写「上下两条波浪线是绕悬点转圈」，可 `initial` 里只有一条转圈的轨迹 `[-6.2, 2.2]`，在上半平面；而且组件不把角度折回，$g/l=1$ 时这条轨迹大约 8 秒就跑出画面。建议 `initial` 加一条 `[6.2, -2.2]`，说明补一句「转圈的轨迹跑出画面后，按「重置」再看一遍」。滑块范围 0.5–3、初值 1 合理（取最大值 3 时 `[-6.2, 2.2]` 变成在 $-2\pi$ 附近摆动，也说得通）。
- **小问题 4c · p3 要带符号的答案，题面没说**（`problems.yaml:58`）。标准答案是 $-4\sqrt3/7$（摆角从 $\pi/3$ 往回加速），可题面只说「求释放瞬间摆角的角加速度」，填 $0.990$ 会判错。建议题面补「（带符号，$\theta$ 以 $\theta_0$ 那一侧为正）」。

### physics.analytical-mechanics.constraint-forces 拉格朗日乘子与约束力

「凡是和 $a$ 垂直的 $\delta q$ 都和 $E$ 垂直 ⇒ $E=\lambda a$」的证明、广义约束力的推导、$f\to2f$ 和 $(r-l)^2$ 的边界情况、几个约束和速度约束的推广都对。例 1（圆环上的珠子）、例 2（半球顶上滑下，$\cos\theta=\frac23$）都对；`multiplier-geometry.svg` 的切向、径向和 $(\theta,r)$ 平面核对过；动画里 $N/(mg)=3\cos\theta-2\cos\theta_0$ 和四个点的式子都对，滑块 0.2–3.1、初值 2.5 能直接看到 $N=0$ 落进运动范围。8 题都对：p5 用两个乘子求转动铁丝的力并验证功率，p6 曲面 $z=h(x,y)$ 上的支持力公式，推导和半球的验算都对。

- **小问题 3d · p8 提示 3 的引用位置不对**（`problems.yaml:181`）：「上一章证明过冰刀能从任意 $(x,y,\theta)$ 滑到任意 $(x,y,\theta)$」。那是「约束与广义坐标」的例 2，不是上一节，网站也没有「章」。改成「讲约束时的例 2 证明过」。
- **小问题 4a · p3 够不上「中等」**（`problems.yaml:49`–`:66`）。例 1 和几何图像的说明（`lesson.md:111`、`:89`）已经写明 $N$ 在 $\cos\theta=\frac23\cos\theta_0$ 处变号，p3 只是代入 $\theta_0=\frac{2\pi}{3}$，一步，按四档的定义是简单题。建议换个问法，让它把两样东西组合起来，例如问「该处珠子的速率是多少，以 $\sqrt{gR}$ 为单位」（要把 $N=0$ 的位置和能量守恒合起来，答案 $\sqrt{1/3}$）。`progress/` 里没有这一领域的记录，改题不用迁移脚本（见「我替你定的」4）。

### physics.analytical-mechanics.cyclic-coordinates 广义动量与循环坐标

广义动量的定义和例子、循环坐标的定理、「先代进 $L$ 再求导」为什么把符号弄反、例 1（圆锥摆，$\dot\varphi^2=\frac{g}{l\cos\theta_0}$）、例 2（换坐标让循环坐标露出来）都对。`equal-areas.svg` 按开普勒方程核对过：两块扇形对应相同的平近点角，面积相等。动画里等效势能的最低点 $r=p_\varphi^2$，滑块 0–1.6、初值 0.8 时最低点在画面里。8 题都对：p5 劳斯函数、p6 二体问题的推导完整。

- **小问题 1b · 「到不了力心」说过头**（`lesson.md:54`）：「只要 $p_\varphi\ne0$，质点就到不了力心」。这一段讲的是一般的 $V(r)$，而比 $-1/r^2$ 更陡的吸引势（如 $-k/r^3$）压得过离心项，质点仍能落进力心。建议加限定：「只要 $V$ 在 $r\to0$ 时不比 $1/r^2$ 更陡（引力就是这样）」。
- **小问题 3a · 有心力一段重讲了牛顿力学的内容，却没把那一节列为前置；名称也不统一**（`lesson.md:7`、`:38`–`:56`、`:62`）。牛顿力学 `central-forces` 的 goal 是「会用角动量守恒把有心力问题化成一维的有效势问题」，正是这一段用拉格朗日语言重讲的内容；几何图像还直接用了「平方反比引力下的椭圆轨道」和开普勒第二定律。这些都不在前置链上。照批次 0 定的「重讲别的领域讲过的内容，把讲过它的那一节也列为前置」，建议前置加 `physics.newtonian-mechanics.central-forces`（模拟过：不多余，层级不变，仍在第 17 层）。名称：牛顿力学那一节叫「有效势」，这里叫「等效势能」（`lesson.md:54`、`:75`、`:86`、`:134`，`problems.yaml:136`），统一成一个（建议跟牛顿力学的标题用「有效势」）。加了这条前置以后，这里不再是第一次定义它，不用补锚点。

### physics.analytical-mechanics.energy-function 能量函数与能量守恒

$\frac{\dd h}{\dd t}=-\frac{\partial L}{\partial t}$ 的推导、$T=T_2+T_1+T_0$ 的分解和 $h=T_2-T_0+V$、转动铁丝和转动圆环的例子、例 2 的四个系统都对。`rotating-hoop.svg` 核对过；相图的方程 $\theta''=\sin\theta\,(w^2\cos\theta-1)$ 是例 1 的方程换成无量纲时间，$w=1.5$ 时四条初始轨迹两条绕右边的稳定点、一条绕左边的、一条绕两边的大圈，说明里「最低点变成鞍点」对。8 题都对：p5 证明转动坐标里 $h=E-\omega L_z$，p6 用 $h$ 守恒证明稳定性，p8 浸渐不变量的估计（$E/\omega$ 不变，摆长变 $\frac14$ 时能量变 2 倍）都对。

- **重要 1b · 「$h$ 等不等于机械能」的判据写成了「约束是不是定常的」，还断言否则机械能也不守恒**（`lesson.md:57`、`:139`，例 2 表头 `:130`，`_domain.yaml:232` 术语简介）。`:57` 说「后一个看约束是不是定常的……只满足前一个，有守恒量 $h$，但它不是机械能，机械能本身也不守恒」。本节 p5 就是反例：自由质点没有约束，用转动坐标时 $h$ 守恒、不等于 $E$，而 $E$ 也守恒。决定 $h=E$ 的其实是 $\vb{r}_i(q,t)$ 显不显含 $t$，也就是坐标怎么选（`:55` 和 `:126` 说的就是这个）；约束定常只是「能选出不显含 $t$ 的坐标」的前提。这一节的 goal 正是「判断它什么时候等于机械能」，判据要写准。建议：`:57` 写成「后一个看 $\vb{r}_i$ 显不显含 $t$（约束定常时可以把坐标选得不显含）、势能是否只依赖位置……只满足前一个时，$h$ 守恒但一般不是机械能，机械能一般也不守恒（p5 是个例外）」；`:139` 和术语简介里的「约束定常」同样补上「坐标不显含时间」；例 2 的表头可以改成「$\vb{r}$ 不显含 $t$？」，四行的取值不变。

### physics.analytical-mechanics.hamiltons-principle 哈密顿原理

作用量的定义和例子（匀速 $\frac{md^2}{2T}$、先慢后快 $\frac{2md^2}{3T}$）、和拉格朗日方程等价的证明、谐振子的二阶变化 $\frac{mT}{4}\bigl(\frac{\pi^2}{T^2}-\omega^2\bigr)$、全导数不改变方程、例 1（竖直上抛，$S_{\min}=-\frac{mg^2T^3}{24}$）、例 2 都对。`varied-paths.svg` 两端对齐、$\varepsilon\eta$ 箭头的两端正好落在两条路径上；动画两条抛物线的系数和讲解一致，滑块 0.5–6、初值 2 能拖过 $T=\pi$ 的翻转点。8 题都对：p6 离散作用量的驻点给出差分格式，p7、p8 讲共轭点，都清楚。

- **小问题 3c · 引用了不在前置链上的一节**（`lesson.md:48`）：「这就回到带乘子的方程：等价于让 $\int(L+\lambda f)\,\dd t$ 取驻值」。带乘子的方程在 `constraint-forces`，和这一节是平行的两节，不在前置链上。建议改成带链接的说法，例如「（带乘子的方程见[拉格朗日乘子与约束力](lesson:physics.analytical-mechanics.constraint-forces)）」，或者删掉这半句。

### physics.analytical-mechanics.noether-theorem 诺特定理

没有要修的。连续对称性的定义（含伸缩的反例）、诺特定理的证明、平移给出动量、转动给出角动量、全导数和时间平移的推广、两道例题（螺旋对称、转动圆环）都对；「生成元可以依赖速度」那句核对过，证明里确实只用到「变换后的路径对 $s$ 求导等于 $K$」。`rotation-symmetry.svg` 的转动箭头方向和两组等势线核对过；动画里 $L_z$ 的式子是 $x=\cos t$、$y=\frac1r\sin rt$ 代进去的结果，$E\equiv1$ 对。8 题都对：p5 伽利略变换给出质心匀速运动，p6 守恒量和坐标无关，p7 各向同性振子的隐藏对称性（生成元 $(\dot y,\dot x)$、$G=m\dot x\dot y-kxy$）都核对过。

## 格式、术语、证明深度

- 固定结构、二级标题、排版（中英文空格、「」引号、图片单独成段）都合格，`npm run content` 0 个错误、0 个警告。
- 术语：8 节里 28 个术语每节第一次出现都写了英文全称，每个三级标题下第一次出现都做了标记；术语表简介准确（除了重要 1 的两条），锚点都落在真正下定义的那一段。符号符合领域约定（小写希腊字母的粗体用 `\boldsymbol`）。
- 证明深度：领域是 `full`，讲解里给出了完整推导（拉格朗日方程、乘子、哈密顿原理的等价性、诺特定理）；虚功原理的充分性用的是物理论证，可以接受（条件见重要 1a）。
- 难度档：除小问题 4a 外都符合四档的定义。

## 我替你定的（都能改）

1. 验算脚本的共用部分放在 `tools/verify/physics.analytical-mechanics._mech.ts`：文件名第三段以下划线开头，`npm run verify` 的文件名规则不认它，不会当成小节脚本跑；8 个小节脚本都从它导入。
2. 验算用两种独立的算法（直角坐标出发的数值解 + 手推公式）先互相核对，再和标准答案比；选择题对每个选项做数值实验。
3. 批次 0 定的「把别的领域里讲过的内容严格化的小节，把讲过它的那一节也列为前置」，我按同样的理由用到了物理里「换一种方法重讲」的情形（小问题 3a 的 `central-forces`）。
4. 方案没说清「一批内容第一次提交之前（审查修订期间）改题，要不要附迁移脚本」。`progress/` 里没有分析力学的任何记录（只有 `math.analysis.yaml`），所以按本报告改题（如小问题 4a 换问法、换答案）不用附迁移脚本。

## 要写回 plan.md 的

1. 「内容模型」id 规则那一段，「题号同理……迁移脚本由做改动的 agent 写」之后补：「一批内容第一次提交之前（审查和修订期间）改题，先查 `progress/`：没有这些题的记录，不算改号、不用迁移脚本；有记录照常附脚本（批次 1 审查时定的）。」
2. 「内容模型」前置那一段，「把讲过它的那一节也列为前置（批次 0 定的）」之后补：「物理里换一种方法重讲别的领域讲过的结论（例如循环坐标那一节重讲有心力的降阶），同样把讲过它的那一节列为前置（批次 1 审查时定的）。」
3. 「内容生产与审查流水线 / 每批的流程」第 3 条「简单题、中等题」那一项末尾补：「同一领域的验算脚本可以共用一个辅助文件，文件名写成 `<学科>.<领域>._<名字>.ts`（第三段以下划线开头），`npm run verify` 不把它当成小节脚本（批次 1 审查时定的）。」

## 没验证的地方

- 内置浏览器的面板没显示，动画收不到帧：两个相图（`lagrange-equations`、`energy-function`）只看了初始画面，轨迹的运动、点击放轨迹、拖滑块后的样子没看到；三个函数图看了默认值下的画面。滑块范围和初值是按式子手算核对的。
- 只看了暗色主题；SVG 都用 `currentColor` 和页面变量，亮色主题下应当同样清楚，但没有截图核对。
- 题目卡片的作答、提示、术语浮窗没有在页面上操作。

## 修订说明（写内容会话）

用户的意见是「全按推荐」。报告里的 2 条重要、12 处小问题全部照改，没有不改的。按「同一类问题在整批里找一遍」，另外找到并改了 3 处（下面标「同类另改」）。只改了 `content/physics/analytical-mechanics/` 和本节。

**重要 1 · 判据漏了「不随时间变」的条件**

- 1a `virtual-work`：定义卡片改成「受定常的理想约束的系统在某个位置保持静止，当且仅当……」，术语表 `virtual-work-principle` 的简介同样加上「定常的」（33 字）。充分性那一段先说明必要的一半没用到约束定常，再补一句「约束不随时间变，「一直待在这个位置」才和约束相容」。后面新加一段，用报告里的转动铁丝作反例：重力垂直于铁丝，虚功处处为零，珠子却不可能停在原处，因为铁丝本身就转走了。一句话总结没动。
- 1b `energy-function`：「h 等不等于机械能」的判据统一改成「$\vb{r}_i(q,t)$ 显不显含 $t$」，约束定常只作为「能把坐标选得不显含」的前提。具体改了：
  - 「所以……两个独立的问题」那一段（原 `:57`），并补上 p5 这个例外：自由质点用转动坐标写，$h$ 守恒、不等于机械能，而机械能本身也守恒。
  - 常见误区第一条（原 `:139`）。
  - 例 2 的「为什么想到这么做」和推导：单摆、转动圆环分别说摆球、珠子的位置显不显含 $t$。
  - 例 2 的表头「约束定常？」改成「$\vb{r}$不显含$t$？」，四行的取值不变。
  - 术语表 `energy-function` 的简介：「约束定常时等于机械能」改成「$\vb{r}_i$不显含时间时等于机械能」。
  - 同类另改：一句话总结原来是「约束不动时 $h$ 才是机械能」，同样不准，改成「$L$不显含时间，$h$就守恒；$\vb{r}_i$不显含时间时，$h$才是机械能。」（27 字）。p1 的解答「约束在转，$h$ 不是机械能」也补成「珠子的位置显含时间」。

**重要 2 · `virtual-work` 缺前置**：加 `math.vector-calculus.differentiability`。构建 0 个警告（没有多余前置），这一节仍在第 15 层，分析力学各节的层级都没变。

**小问题 1 · 说过头的话**

- 1a `lagrange-equations` 例 2：改成先由初始条件定出 $A=\frac12(s_0+\dot s_0/\omega)$，再分三种情况：$A>0$（初速度向外、为零，或向内但小于 $\omega s_0$）时被越甩越远；向内恰好 $\omega s_0$ 时渐近滑向转轴；再快就在有限时间里滑到转轴。这比报告建议的那句多了「向内更快」的情形。
- 1b `cyclic-coordinates`：加了限定「只要 $p_\varphi\ne0$，而且 $V$ 在 $r\to0$ 时不比 $\frac{1}{r^2}$ 更陡（引力就是这样），质点就到不了力心」。
- 同类另改 `energy-function` 例 1：原句「珠子升高时 $\sin^2\theta$ 变大，$E$ 增加」只在环的下半圈成立（越过与圆心等高处以后，升高反而让 $\sin^2\theta$ 变小）。改成「珠子离转轴越远，$\sin^2\theta$ 越大，$E$ 也越大」。

**小问题 2 · 几何图像和说明对不上**

- 2a `virtual-displacement.svg`：$t+\dd t$ 时刻的铁丝终点改成 $(407.6,\ 43.3)$（33°），标签移到 $y=48$。核对过：$\dd\vb{r}$ 的箭头尖 $(363.2,\ 72.1)$ 落在这条线上。
- 2b `virtual-work` 倒立摆：按报告的第一种办法，说明改成「下端铰接在一个固定的支点上（杆可以转到水平以下）」。滑块范围 0.2–2、初值 0.6 不动，这样 $K<1$ 时的分岔照样能拖出来。
- 2c `lagrange-equations` 相图：`initial` 加了 `[6.2, -2.2]`，上下两条转圈的轨迹都有了。说明补了一句「图上不把角度折回，转圈的轨迹跑出画面后，按「重置」再看一遍」。

**小问题 3 · 前置与术语衔接**

- 3a `cyclic-coordinates`：前置加 `physics.newtonian-mechanics.central-forces`，构建没有多余前置警告，仍在第 17 层。「等效势能」统一成「有效势」，报告列的 5 处都改了：`lesson.md` 讲解一处、动画图例一处、图下说明一处、常见误区一处，`problems.yaml` p6 一处。本节第一次出现处保留了英文括注「（effective potential）」。
- 3b `virtual-work`：「惯性力」的定义单独成段，加了锚点 `def-inertial-force`，名字写成「达朗贝尔惯性力（d'Alembert inertial force），下面简称惯性力」，并补一句「它就是在跟着这个质点一起平动加速的参考系里看到的惯性力：在那个参考系里质点静止，真实的力和它正好平衡」。没有加进术语表：「惯性力」以后由牛顿力学的 `accelerating-frames` 定义，这里只是同一个概念的特殊情形。
- 3c `hamiltons-principle`：删掉「这就回到带乘子的方程：等价于让 $\int(L+\lambda f)\,\dd t$ 取驻值」这个没在前置链上证明的结论。改成只说「$\eta$ 不能各自随意取，结论要改用乘子来写：每个约束配一个未知的乘子，它给出约束力的大小」，并加链接指向 [拉格朗日乘子与约束力](lesson:physics.analytical-mechanics.constraint-forces)。
- 3d `constraint-forces` p8 提示 3：「上一章证明过」改成「讲约束时的例 2 证明过」。顺带查了 8 节里所有「上一节、下一节、讲……时」的引用，都指在前置链上的小节或本节，或者只是向后的预告。
- 同类另改 `constraints` p7 提示 3：原来用了 $\sum_i\nabla_i f\cdot\dot{\vb{r}}_i+\partial f/\partial t=0$，而这一节的前置链上没有多变量微积分，改成文字「对时间求导得到的速度之间的关系」。

**小问题 4 · 题面与难度档**

- 4a `constraint-forces` p3：按报告的建议换了问法，改成「求珠子在该处（圆环对它的力为零处）的速率，以 $\sqrt{gR}$ 为单位」。标准答案改为 `sqrt(1/3)`（≈0.577），三条提示和解答都重写，要把「力为零的位置 $\cos\theta=\frac23\cos\theta_0=-\frac13$」和能量关系 $v^2=2gR(\cos\theta-\cos\theta_0)$ 合起来用。题号、难度档不变。`progress/problems/` 里只有 `math.analysis.yaml`，没有这道题的记录，所以没写迁移脚本。我用直角坐标加约束力单独数值积分核对过：速率 $0.57736\sqrt{gR}$，力为零处 $\cos\theta=-0.33333$。
  - **请复核时改验算脚本**：`tools/verify/physics.analytical-mechanics.constraint-forces.ts` 的 p3 还在算 $\cos\theta=-\frac13$，现在 `npm run verify` 这一题会对不上。按新题意，它应当算出速率 $\sqrt{1/3}$。
- 4b `constraints` p3：题面改成「链的上端用能自由转动的铰链挂在天花板上的一点」。
- 4c `lagrange-equations` p3：题面补了「带符号（$\theta$以$\theta_0$所在的那一侧为正）」，答案不变。

**没改的**：无。`noether-theorem` 报告里没有要修的，也没动。

**修订后跑过的**：`npm run content` 0 个错误、0 个警告；术语标记、英文括注、每段句数和中英文空格用脚本重新查了 8 节，都合格；改动过的 SVG 在浏览器里看过。

**第二轮（按复核时看出的两处措辞）**：`energy-function` 讲解里「两个条件都满足，才有熟悉的机械能守恒」改成「就有」；`cyclic-coordinates` 讲解里「$V$在$r\to0$时不比$\frac{1}{r^2}$更陡」改成「比$\frac{1}{r^2}$平缓」，排除 $V=-k/r^2$、$k>\frac{p_\varphi^2}{2m}$ 这个边界情形。这两节文件头的 `status` 已退回 `written`，等复核。

## 复核

审内容 agent · 2026-11-09。只核修订说明以后的改动，不重复已经报过的问题。

**没有需要修的：8 节全部通过，文件头的 `status` 已改成 `reviewed`（只改了这一行）。** 重要 2 条（3 处）、小问题 12 处都按建议改好了，写内容会话另改的 3 处同类问题也对。复核时新看出 2 处措辞上的小问题（其中一处出在我上次给的建议本身），都不挡 `reviewed`，见本节最后。

### 怎么核的

- 对照：审查以后改动过的有 12 个文件（5 份 `lesson.md`、5 份 `problems.yaml`、`_domain.yaml`、`virtual-displacement.svg`），其余文件的修改时间都早于审查。逐份读新版本，和审查时的版本对照。整题重写的 `constraint-forces` p3 之外，另外 11 个文件按修订说明逐处核算了字节数的变化，和文件大小的实际变化完全一致。**没有修订说明之外的改动。**
- 验算：`constraint-forces` p3 先用 `npm run statements` 读新题面，再把验算脚本改成：在 RK4 积分里定位圆环的力为零的时刻，读出那一刻的速率（以 $\sqrt{gR}$ 为单位），再和手推的 $\cos\theta=\frac23\cos\theta_0$、$v^2=2gR(\cos\theta-\cos\theta_0)$ 核对。算得 $\sqrt{1/3}\approx0.57735$，和新的标准答案一致。这道题的问法是我上次建议的，答案我事先知道；独立的部分是数值积分。
- 命令：`npm run content`（改 `reviewed` 前后都是 0 个错误、0 个警告）；`npm run verify`（15 个小节全部一致）；`npx tsc -p tsconfig.node.json --noEmit`（通过）；`npm run build`（通过）；术语、排版的检查脚本重跑，没有新问题。
- 页面（`test-serve`，进度写临时仓库）：`virtual-work` 的新定义卡片（达朗贝尔惯性力不在术语表里，卡片上方不标术语名，符合方案）、改过的 SVG（$\dd\vb{r}$ 的箭头尖落在 $t+\dd t$ 时刻的铁丝上）、前置回顾里多出的「全微分与切平面」；`lagrange-equations` 相图的第四条初始轨迹。控制台没有报错。动画仍只看了初始画面（面板没显示）。

### 逐条

| 编号 | 小节 | 结果 |
| --- | --- | --- |
| 重要 1a | `virtual-work` | 通过。定义卡片和术语简介加了「定常的」；充分性的证明补了「约束不随时间变，「一直待在这个位置」才和约束相容」，并说明必要的一半没用到定常；新加的转动铁丝反例段对。 |
| 重要 1b | `energy-function` | 通过。判据改成「$\vb{r}_i(q,t)$ 显不显含 $t$」，p5 的例外写进了正文；例 2、表头、常见误区、术语简介都跟着改了。 |
| 重要 2 | `virtual-work` | 通过。前置加了 `differentiability`，构建没有多余前置的警告，仍在第 15 层。 |
| 小问题 1a | `lagrange-equations` | 通过。按 $A=\frac12(s_0+\dot s_0/\omega)$ 的正负分三种情况，比我建议的那句更完整，推导核过。 |
| 小问题 1b | `cyclic-coordinates` | 通过（措辞见本节最后 2）。 |
| 小问题 2a | `virtual-work` | 通过。 |
| 小问题 2b | `virtual-work` | 通过。 |
| 小问题 2c | `lagrange-equations` | 通过。 |
| 小问题 3a | `cyclic-coordinates` | 通过。前置加了 `central-forces`，仍在第 17 层；「有效势」统一了 5 处，第一次出现保留了英文括注。 |
| 小问题 3b | `virtual-work` | 通过。锚点、「达朗贝尔惯性力」的名字和与平动加速参考系的那句关系都对；不进术语表的理由成立。 |
| 小问题 3c | `hamiltons-principle` | 通过。删掉了没在前置链上证明的结论，改成指向 `constraint-forces` 的链接；「约束力（constraint force）」是这一节第一次出现，英文括注对。 |
| 小问题 3d | `constraint-forces` | 通过。 |
| 小问题 4a | `constraint-forces` | 通过。新题要把力为零的位置和能量关系合起来用，够得上中等题；三条提示和解答都对。 |
| 小问题 4b | `constraints` | 通过。 |
| 小问题 4c | `lagrange-equations` | 通过。 |

### 写内容会话另改的 3 处

- `energy-function` 的一句话总结和 p1 的解答：对，总结 27 字，构建通过。
- `energy-function` 例 1 改成「珠子离转轴越远，$\sin^2\theta$ 越大，$E$ 也越大」：对，原句在环的上半圈确实不成立，这一处我上次漏看了。
- `constraints` p7 提示 3 去掉了 $\sum_i\nabla_i f\cdot\dot{\vb{r}}_i$：对，这一节的前置链上没有多变量微积分。

### 复核时看出的（都是小问题，不挡 `reviewed`）

1. `energy-function/lesson.md:57`「两个条件都满足，才有熟悉的机械能守恒」：「才」说的是必要条件，而同一句后面写的 p5 例外（只满足前一个，机械能也守恒）正好不满足它。把「才有」改成「就有」即可。这句上次就有，我当时漏报了。
2. `cyclic-coordinates/lesson.md:54`「$V$ 在 $r\to0$ 时不比 $\frac{1}{r^2}$ 更陡」是我上次建议的说法，边界上不严：$V$ 正好是 $-k/r^2$、而且 $k>\frac{p_\varphi^2}{2m}$ 时，质点仍会落进力心。严格的说法是「比 $\frac{1}{r^2}$ 平缓」。

这两处不值得为它们再改一轮。以后改这两节时（比如处理 `content/issues.yaml`）顺手改，改完按方案把 `status` 退回 `written`，由审内容会话复核。

**第二轮复核（你定了现在就改）**：两处都改对了，`energy-function/lesson.md:57` 现在是「就有」，`cyclic-coordinates/lesson.md:54` 现在是「比 $\frac{1}{r^2}$ 平缓」；两份文件除了这两处和 `status` 那一行，没有别的改动（按字节数核过）。两节的 `status` 已改回 `reviewed`，`npm run content` 0 个错误、0 个警告，`npm run verify` 15 个小节全部一致。

# 批次 2 审查报告：分析力学（哈密顿力学 7 节）

审内容 agent（和写内容 agent 是两个独立会话，没有读它的会话记录、交接说明和自查脚本）· 2026-11-09

审查范围：`content/physics/analytical-mechanics/` 下 `hamiltons-equations`、`phase-space-liouville`、`poisson-brackets`、`canonical-transformations`、`hamilton-jacobi`、`action-angle-variables`、`adiabatic-invariants` 7 节的 `lesson.md`、`problems.yaml`、SVG，以及 `_domain.yaml` 的改动（新增 19 个术语，没有新宏）。

## 结论

重要 1 条（同一句话出现在 3 处），小问题 3 条（同一类合成一条）。

- 28 道简单题、中等题的标准答案全部和独立验算一致；14 道难题、思考题的参考解答和三级提示逐题读过（不只抽查），没有发现错误。
- **重要 1 · 「一个自由度时，正则变换就是保持面积的换元」漏了「不翻面」**：$Q=p$、$P=q$ 保持面积，却不是正则变换，这一节自己就举了它作反例；p2 的选项 B 正是这个换元，信了这句话的人会多选 B。
- 小问题 1：讲解和常见误区里有 3 处说法比证明或反例走得远。小问题 2：几何图像和说明、动画的显示范围对不上 2 处。小问题 3：题面与术语规范 5 类。
- 有 3 节改了批次 0 定的前置，都合理、都是最少的，层级都没变，见「前置的改动」。
- 几何图像：7 节都有 SVG，4 节另有动画组件（`hamiltons-equations` 函数图，`phase-space-liouville`、`action-angle-variables`、`adiabatic-invariants` 相图），没有占位框。SVG 里的数据逐条核对过，其中两张由数值积分画出的图重算过；滑块范围和初值除小问题 2b 外都合理。
- 没有挡住 `reviewed` 的结构性问题，7 节修完都可以标。`hamiltons-equations` 现在就没有要修的。

| 小节 | 重要 | 小问题 |
| --- | --- | --- |
| `hamiltons-equations` 哈密顿正则方程 | 0 | 0 |
| `phase-space-liouville` 相空间与刘维尔定理 | 0 | 3（1a、3c、3d） |
| `poisson-brackets` 泊松括号 | 0 | 2（2a、3d） |
| `canonical-transformations` 正则变换与生成函数 | 1（主要出处） | 1（3e） |
| `hamilton-jacobi` 哈密顿-雅可比方程 | 0 | 2（3a、3d） |
| `action-angle-variables` 作用量-角变量 | 1（同一句） | 4（1b、1c、3b、3d） |
| `adiabatic-invariants` 浸渐不变量 | 0 | 2（2b、3d） |

编号对应下面的分类：

- 重要 1（正则变换的面积判据漏了定向）：`canonical-transformations`（讲解和 p7 提示），`action-angle-variables`（讲解）。
- 小问题 1（说法比证明或反例走得远）：1a `phase-space-liouville`，1b、1c `action-angle-variables`。
- 小问题 2（几何图像和说明、动画范围对不上）：2a `poisson-brackets`，2b `adiabatic-invariants`。
- 小问题 3（题面与术语规范）：3a `hamilton-jacobi` p2 题面歧义，3b `action-angle-variables` 术语标记，3c `phase-space-liouville` 定义段没有锚点，3d 四节题目文字里的新名词没括注英文，3e `canonical-transformations` p7 提示的措辞。

## 怎么审的

- 通读 `docs/plan.md` 和批次 1 的审查报告；用 `git diff HEAD -- content/physics/analytical-mechanics/` 看本批改动：7 节从目录写成正文（另有 7 份 `problems.yaml`、7 张 SVG 是新文件），`_domain.yaml` 加了 19 个术语。批次 1 的 8 节和别的文件没有改动。没有拿写内容会话的汇报对照（按要求没读它的交接说明），所以「改了但汇报里没提」这一项没法做。
- 逐节读讲解、例题、常见误区，推导逐步核对。SVG 按源码里的坐标核对几何；`pendulum-phase-flow.svg` 的 $D_t$ 用 RK4 把 $D_0$ 边界上 720 个点重新积分到 $t=25$ 比对（SVG 的点离重算的边界都不到 0.1 像素，面积 0.19634），`equal-time-marks.svg` 的 24 个等时间点重新积分比对（误差不到 0.1 像素，两个周期 6.450、8.626）；动画参数用数值积分核对显示范围和说明里的现象。
- 简单题、中等题：只用 `npm run statements -- <7 个小节 id> --tier easy,medium` 读题，写完验算脚本、跑出结果以后才打开 `problems.yaml`，再看提示、解答和难题。
- 难题、思考题：14 题的参考解答全部读了，连同三级提示，推导逐步核过。
- 术语：用脚本检查每节第一次标记是否带上术语表里的英文全称、每个二级和三级标题下第一次出现是否标记；术语表简介和锚点逐条看。
- 前置：用脚本列出每节的整条前置链，对照讲解用到的概念；改了前置的 3 节，按批次 0 的前置重算层级比较。
- 页面：`npm run build` 后，用已经在 3142 端口运行的 `test-serve`（`.claude/launch.json` 里那条配置启动的，进度写临时仓库）打开 7 节。内置浏览器的面板没显示，截图跟不上，改用页面数据核对：7 节的二级标题齐全、公式没有 KaTeX 错误、几何图像里有 SVG、动画画布已经画出内容、滑块的范围和初值和内容文件一致，控制台没有报错。
- 跑过的命令：`npm run content`（0 个错误、0 个警告）；7 个验算脚本单独跑，再跑 `npm run verify`（29 个小节全部一致，含另一个审查会话的数学分析脚本）；`npx tsc -p tsconfig.node.json --noEmit`（通过）；`npm run build`（通过）。

## 简单题、中等题的验算

脚本在 `tools/verify/physics.analytical-mechanics.<小节>.ts`。本批的共用部分放在新文件 `tools/verify/physics.analytical-mechanics._hamilton.ts`（正则方程、数值泊松括号、相流的雅可比行列式、把 $\oint p\,\dd q$ 挂在状态上一起积分、参数缓慢变化的 tanh 斜坡），也用批次 1 的 `_mech.ts`（RK4、达朗贝尔原理、二分）。偏导数一律数值地求，不用讲解或题目里推好的式子。每道题用两种互相独立的算法：一种数值地做（按正则方程积分、对初值差分求相流的行列式、由直角坐标按达朗贝尔原理解、直接模拟参数缓慢变化的过程、数值反解生成函数），另一种是手推的公式；两者先互相核对，再和标准答案比。选择题对每个选项做数值实验。

| 小节 | p1 | p2 | p3 | p4 |
| --- | --- | --- | --- | --- |
| `hamiltons-equations` | 7 ✓ | A、C ✓ | $\sqrt{9.8\cdot9/8}$ ✓ | 2 ✓ |
| `phase-space-liouville` | $2\pi$ ✓ | A、C、D ✓ | $0.01e^{-2}$ ✓ | 5 ✓ |
| `poisson-brackets` | 8 ✓ | A、D ✓ | 3 ✓ | 2 ✓ |
| `canonical-transformations` | $1/2$ ✓ | A、C ✓ | $18+\ln2$ ✓ | 2 ✓ |
| `hamilton-jacobi` | 5 ✓ | A、B ✓（题面见 3a） | $9/4$ ✓ | $18/7$ ✓ |
| `action-angle-variables` | $1/2$ ✓ | 8 ✓ | 4 ✓ | $1/2$ ✓ |
| `adiabatic-invariants` | 2 ✓ | A、D ✓ | $1/2$ ✓ | 2 ✓ |

几个值得一提的做法（详细写在各脚本的 `notes` 里，`npm run verify` 会打印出来）：

- `canonical-transformations` 的「是不是正则变换」不用括号判据，而是直接看动力学：按旧变量积分一段运动，换成新变量后数值求 $\dot Q$、$\dot P$，看它们是否满足以 $K=H\circ$逆变换为哈密顿量的正则方程（p1 对 $a$ 二分出让残差为零的值）。
- `adiabatic-invariants` 的 4 题直接模拟参数缓慢变化的过程（$\varepsilon=0.02$ 或 $0.05$），变完读出能量、高度、振幅。模拟值和手推的极限值相差不到 $10^{-5}$，余下的差是积分误差（步长减半时跟着变小）；p2 另外核对了变了的两个量的倍数（$E_{\mathrm{osc}}$、$\phi_0$）和 $l^{-1/2}$、$l^{-3/4}$ 一致。
- `action-angle-variables` p3 的 $V=F|q|$ 在 $q=0$ 处不光滑，分两段积分，各段受力不变。

## 前置的改动

和批次 0 审过的目录相比，3 节改了前置，都合理、都是最少的（`npm run content` 没有多余前置的警告），按批次 0 的前置重算，层级都没变。

| 小节 | 批次 0 | 现在 | 看法 |
| --- | --- | --- | --- |
| `canonical-transformations` | `poisson-brackets` | 加了 `hamiltons-principle` | 合理：生成函数一段从相空间里的哈密顿原理推出，还用了「讲哈密顿原理时证明过两件事」（加全导数、换变量都不改变方程）。原来的链（`poisson-brackets` → `hamiltons-equations` → `energy-function` 那一支）上没有它。仍在第 21 层。 |
| `hamilton-jacobi` | `canonical-transformations` | 加了 `newtonian-mechanics.kepler-orbits` | 合理：例 2 用分离变量重推开普勒轨道，圆锥曲线、焦点、偏心率都来自那一节，正是批次 1 定的「物理里换一种方法重讲，把讲过的那一节列为前置」。`central-forces` 已经经 `cyclic-coordinates` 在链上，没有重复列。仍在第 22 层。 |
| `action-angle-variables` | `hamilton-jacobi` | 加了 `phase-space-liouville` | 合理：相轨道、相轨道围成的面积、$\lvert\nabla H\rvert$ 都要用，`hamilton-jacobi` 的链上没有 `phase-space-liouville`。梯度垂直于等值线也随它进链（`curl-divergence` → `vector-fields` → `gradient`）。仍在第 23 层。 |

另外 4 节的前置没改。沿整条链核对过讲解用到的数学工具：混合偏导数相等（`partial-derivatives`）、叉积求平行四边形面积、散度、多元链式法则、勒让德变换都在链上；谐振子的运动方程（`simple-harmonic-motion`）从 `canonical-transformations` 起经 `hamiltons-principle` 进链，前面三节只用到谐振子的哈密顿量和等值线，不需要它。

## 逐节

### physics.analytical-mechanics.hamiltons-equations 哈密顿正则方程

没有要修的。一维的引入、$T_2$ 正定保证反解唯一、哈密顿量的定义和勒让德变换的说法、$L=a(q)\dot q-V$ 的反例、极坐标里 $\frac{\partial h}{\partial r}$ 和 $\frac{\partial H}{\partial r}$ 离心项符号相反的边界情况、三个恒等式和正则方程的双向证明、$\dv{H}{t}=-\frac{\partial L}{\partial t}$、循环坐标代进 $H$ 不出错，都对。例 1（有心力）、例 2（斜面和滑块，$\ddot s=\frac{(M+m)g\sin\alpha}{M+m\sin^2\alpha}$）逐步核过。`legendre-tangent.svg` 的切线、切点、截距 $-H=-3$ 和长为 $H$ 的绿线都对；函数图的式子对，滑块 $-2.5$ 到 $2.5$ 时切点和截距都在画面里。8 题都对：p5 转动坐标里 $H=E-\omega L_z$ 和 $(p_{x'},p_{y'})$ 顺时针转，p6 $L$ 加 $b(q)\dot q$ 不改变运动，p8 非凸的 $L$ 和多余坐标，都清楚。

### physics.analytical-mechanics.phase-space-liouville 相空间与刘维尔定理

相空间、相轨道、相流的定义和边界情况、单摆相图的平衡点和分界线、散度为零的计算、小平行四边形面积的变化率 $\dv{A}{t}=(\nabla\cdot\vb{v})A$（展开核过，交叉项确实两两相消）、阻尼单摆的反例、例 2 的两种情形都对。`pendulum-phase-flow.svg` 的等能线、分界线、方向箭头和 $D_t$ 都按数值重算核对过；动画的 12 个初始点正好排在 $D_0$ 的圆周上，$b=0$ 时都在分界线以内，阻尼滑块 0 到 0.5 合理。8 题都对：p5 哈密顿系统没有渐近稳定的平衡点，p6 庞加莱回归定理，p8 分界线上的时间对数发散，证明都完整。

- **小问题 1a · $2n$ 维的刘维尔定理只是类比，没有证明**（`lesson.md:61`）：「$2n$ 维时把平行四边形换成平行多面体，结论同样是体积的变化率等于散度乘体积」。这一节是 `full`，而这一步要用行列式（平行多面体的体积、$\det(I+J\,\dd t)=1+\operatorname{tr}J\,\dd t+\cdots$），前置链上只有向量、点积和叉积。建议明说「一般情形要用行列式算体积，这里不展开」，不必为它加前置；或者加 `math.linear-algebra.determinant`（行列式：有向面积与体积，第 4 层，加了不改变层级）作前置，补两三句证明。
- 小问题 3c（定义段没有锚点，`lesson.md:33`）、3d（p7 提示里的「熵」「热力学第二定律」，`problems.yaml:135`），见小问题 3。

### physics.analytical-mechanics.poisson-brackets 泊松括号

泊松括号的定义、自由质点 $q-\frac{pt}{m}$ 的边界情况、基本括号、三条运算规则、雅可比恒等式的证明（只看含 $f$ 的二阶偏导数那一部分，$D_g(D_hf)-D_h(D_gf)$ 相消）、泊松定理的证明都对。例 1 的四个括号 $\pb{L_z}{x}=y$ 等、例 2 的 $\pb{L_x}{L_y}=L_z$ 逐项核过。8 题都对：p5 由 $G$ 生成的无穷小变换（$p_x$ 生成平移、$L_z$ 生成转动），p6 各向同性振子的三个守恒量的括号 $\pb{L_z}{A}=-2B$、$\pb{L_z}{B}=2A$、$\pb{A}{B}=-2L_z$，都核过；p8 守恒量至多 $2n-1$ 个，说得清楚。

- **小问题 2a · 图里看不到说明里的「穿过等值线」**（`lesson.md:72`；`level-curves.svg:12`–`:17`、`:35`–`:40`）。说明写「在带箭头的那一点，圆横穿过 $qp$ 的等值线，$qp$ 在变」，可图上的虚线只有 $qp=\pm1$，它们和圆只在四个绿点相切；带箭头的点在 $(-0.245,\ 1.39)$，$qp\approx-0.34$，经过它的等值线没有画。建议加一条虚线 $qp=-\frac12$（第二、四象限两支），把带箭头的点挪到它和圆的交点 $(-0.366,\ 1.366)$，即 SVG 的 $(200.7,\ 100.7)$，速度方向在 SVG 里是 $(0.966,\ -0.259)$；或者只改说明，写成「经过这一点的 $qp$ 等值线（图上没画）」。
- 小问题 3d（p7 题干的「对易子」，`problems.yaml:130`），见小问题 3。

### physics.analytical-mechanics.canonical-transformations 正则变换与生成函数

谐振子换元 $H=\omega P$ 和 $\pb{Q}{P}=1$ 的计算、$Q=q$、$P=2p$ 的反例、正则变换的定义、括号不变的定理和证明、相空间里的哈密顿原理、$F_1$、$F_2$ 两种生成函数的推导、恒等变换没有 $F_1$ 型生成函数、两种说法一致的论证都对。`oscillator-map.svg` 的同心圆、射线、两块阴影（扇环 $\frac{\pi}{12}\times1.25$ 和矩形 $\frac{\pi}{6}\times0.625$，都约 0.327）核对过。例 1（$F_1=\frac12m\omega q^2\cot Q$）、例 2（匀速运动的参考系，$K=\frac{P^2}{2m}+V(Q+vt)-\frac12mv^2$）都对。8 题都对：p5 自由下落参考系里 $K=\frac{P^2}{2m}$，p6 由 $F_1$ 直接算出 $\pb{Q}{P}=\frac{F_{Qq}}{F_{qQ}}=1$，p7、p8 都核过。

- **重要 1 · 「一个自由度时，正则变换就是保持面积的换元」漏了定向**（`lesson.md:52`；同一句话还在 `action-angle-variables/lesson.md:27` 和本节 `problems.yaml:149` p7 提示 3）。`:52` 由叉积得到面积是 $\pb{Q}{P}\,\delta q\,\delta p$，用的是有向面积；可「保持面积」照字面读是不带符号的面积，于是这句「就是」说反了一个方向：$Q=p$、$P=q$ 保持面积，$\pb{Q}{P}=-1$，不是正则变换，`:50` 自己就把它当反例。这一节的 goal 是「验证一个变换是否正则」，p2 的选项 B 正是这个换元，按这句话判断的人会多选 B、被判错。建议 `:52` 改成「所以一个自由度时，正则变换就是保持面积、而且不把图形翻面（叉积不变号）的换元；$Q=p$、$P=q$ 面积不变，却把图形翻了面」。另外两处只用到「正则变换保持面积」这一个方向，把「就是保持面积的换元」改成「保持面积」即可。
- 小问题 3e（p7 提示 3 的措辞，`problems.yaml:149`），见小问题 3。

### physics.analytical-mechanics.hamilton-jacobi 哈密顿-雅可比方程

自由质点的引入、方程和完全积分的定义、「独立」的意思、$\dv{S}{t}=L$、特征函数和 $\beta_E=\frac{\partial W}{\partial E}-t$、分离变量的论证、一个自由度时回到能量守恒的积分都对。`wavefronts.svg` 的轨道 $x=x_0+2-\sqrt{4-2y}$、等值线 $W=x+\frac13[8-(4-2y)^{3/2}]$、两族曲线的正交（$\nabla W=(p_x,p_y)$）核对过。例 1（谐振子）、例 2（有心力分离变量，开普勒轨道的配方、$u_0=\frac{mk}{\alpha_\varphi^2}$、$e=\sqrt{1+\frac{2E\alpha_\varphi^2}{mk^2}}$）逐步核过。8 题都对：p5 $S_2=\frac{m(q-q_0)^2}{2(t-t_0)}$ 就是作用量，p6 各向同性振子以 $w=\frac{1}{r^2}$ 积出中心在原点的椭圆，p7 相速度 $\frac{E}{p}$ 和 $\hbar\to0$ 的极限，都核过。

- 小问题 3a（p2 题面歧义，`problems.yaml:23`）、3d（p7 题干和提示里的「薛定谔方程」「群速度」「费马原理」「WKB 近似」），见小问题 3。

### physics.analytical-mechanics.action-angle-variables 作用量-角变量

作用量变量的定义、周期定理 $T=2\pi\dv{I}{E}$ 的证明（窄带宽度 $\frac{\dd E}{\lvert\nabla H\rvert}$，相点速度的大小正好是 $\lvert\nabla H\rvert$）、角变量和 $\omega=\dv{H}{I}$、几个互不耦合的自由度都对。`equal-time-marks.svg` 已按数值重算核对（见「怎么审的」）；动画的四个初始振幅 0.3 到 2.8，$g/l$ 取最大值 3 时 $\lvert p\rvert$ 最大 3.41，在 $\pm3.6$ 的范围里，滑块 0.5 到 3 合理。例 1（盒子，$T=\frac{2L}{v}$）、例 2（弹跳小球，$T=\frac{2v_0}{g}$）都对。8 题都对：p5 单摆的频率修正 $\omega\approx1-\frac{\phi_0^2}{16}$ 和给出的两组精确值（0.9742、0.728）都核过，p6 有理比和环面，p7 玻尔-索末菲量子化，p8 开普勒问题的简并和 $\frac{\varepsilon}{r^2}$ 引起的进动，都对。

- **小问题 1b · 常见误区的反例对不上题**（`lesson.md:116`）：误区是「振幅越大，周期一定越长」，可盒子里的粒子振幅总是 $L$，能量变了振幅不变，「盒子里的粒子能量越大，周期越短」反驳不了它。建议把误区改成「能量越大，周期一定越长」，三个例子就都对上了（不要改用四次方势作反例，那会提前说出 p4 的答案）。
- **小问题 1c · 「几个自由度时要能分离变量」说过头**（`lesson.md:117`）：能分离变量是有作用量-角变量的充分条件，不是必要条件；一般的条件是有 $n$ 个互相独立、彼此括号为零的守恒量（泊松括号那一节 p8 的提示已经提到「可积系统」）。建议改成「几个自由度时要有 $n$ 个互相独立、彼此括号为零的守恒量，能分离变量时就有」。
- 重要 1（`lesson.md:27` 同一句话）；小问题 3b（术语标记，`lesson.md:27`、`:40`、`:114`）、3d（p7 提示里的「WKB 近似」，`problems.yaml:133`），见上面和小问题 3。

### physics.analytical-mechanics.adiabatic-invariants 浸渐不变量

浸渐不变量的定义和反例、定理的证明思路（$\frac{\partial I}{\partial\lambda}=-\frac{T}{2\pi}\bigl\langle\frac{\partial H}{\partial\lambda}\bigr\rangle$ 推导核过，括号里偏离周期平均的部分正负抵消）、「缓慢」要和周期比都对，符合本节的 `sketch`。`equal-area-ellipses.svg` 的圆和椭圆（半轴 $\frac{1}{\sqrt3}$、$\sqrt3$）对。例 1（摆长变短，$E_{\mathrm{osc}}\propto l^{-1/2}$、$\phi_0\propto l^{-3/4}$）、例 2（墙缓慢移动，碰撞验证 $vL$ 不变）都对；例 1 里 $l$ 随时间变时 $H$ 少写的 $-\frac12m\dot l^2$ 只依赖时间，不影响结论。8 题都对：p5 $\dv{}{t}\frac{E}{\omega}$ 的瞬时值以两倍频率振荡、平均为零，p6 突变时 $I'$ 是 $2I$、$\frac I2$、平均 $\frac54I$，p7 一维气体 $\gamma=3$，p8 越过分界线，都核过。

- **小问题 2b · 说明要看的情形正好被显示范围切掉**（`lesson.md:59`、`:74`）。说明请读者「把 $\varepsilon$ 拖到 2 以上再看」，数值积分：从 $(1,0)$ 出发的轨迹，$\varepsilon=2$ 时 $\lvert p\rvert$ 最大 2.35，$\varepsilon=3$ 时 2.50，而纵轴范围是 $\pm2.2$，最后那个椭圆的上下两端画不出来（$\lvert q\rvert$ 最大 1.0，横轴没问题）。建议把 `range` 的 `p` 改成 `[-2.7, 2.7]`。默认 $\varepsilon=0.1$ 时两条轨迹最后的 $I$ 是 0.512 和 0.492（围成的面积 3.22 和 3.09，对 $\pi$ 差 2.5% 以内），$\varepsilon=0.02$ 时是 0.5006 和 0.4996，说明里「几乎落在同一个椭圆上，$\varepsilon$ 越小越接近」对得上；$\varepsilon=2$ 时是 0.92 和 0.32，「落在不同的椭圆上」也对。
- 小问题 3d（p7、p8 提示里的「熵」「等熵过程」「轨道共振」），见小问题 3。

## 小问题 3 · 题面与术语规范（汇总）

- **3a · `hamilton-jacobi` p2 题面有两种读法**（`problems.yaml:23`）：「（$\alpha$ 是常数，$t>0$）」。选项 C 的 $S=\alpha q-\alpha t$ 在 $\alpha=2$（或 0）时满足方程，照字面读选 C 也说得通；标准答案按「对所有常数都成立」判（提示 3 才这样说）。建议题面写成「（$\alpha$ 是任意常数，要求对所有 $\alpha$ 都成立；$t>0$）」。选项和答案不变，不算换题；`progress/` 里没有这一领域的记录。
- **3b · `action-angle-variables` 三处「特征函数」没标记**（`lesson.md:27` 在「作用量变量」下、`:40` 在「角变量」下、`:114` 在「常见误区」里）：都是那一块里第一次出现。`hamilton-jacobi` 例 2 已经用 `:term[特征函数]{id="physics.analytical-mechanics.characteristic-function"}` 标过这个简称，照样标上即可。
- **3c · `phase-space-liouville` 的定义段没有锚点**（`lesson.md:33`）：「……叫作中心（center）；……叫作鞍点（saddle point）」是在下定义（这两个词在前置链上没有出现过），方案要求讲解里下定义的段落都加锚点，不在术语表里也要加。建议在前面加 `::anchor{id="def-center-saddle"}`。
- **3d · 题目文字里第一次出现的新名词没括注英文**（批次 1 定的规矩）：`poisson-brackets` p7 题干「对易子」（`problems.yaml:130`）；`hamilton-jacobi` p7 题干「薛定谔方程」（`:142`）、提示 3 的「群速度」「费马原理」「WKB 近似」（`:149`、`:151`、`:153`）；`action-angle-variables` p7 提示 3「WKB 近似」（`:133`）；`adiabatic-invariants` p7 提示 3「熵」「等熵过程」（`:139`）、p8 提示 3「轨道共振」（`:157`）；`phase-space-liouville` p7 提示 3「热力学第二定律」「熵」（`:135`）。
- **3e · `canonical-transformations` p7 提示 3 的措辞**（`problems.yaml:149`）：「这里从正则变换的角度又看到一次」。`phase-space-liouville` 和这一节是平行的两支，不在这一节的前置链上，「又看到一次」默认读者学过。建议改成「这和……那一节的刘维尔定理是同一件事」，链接保留。

## 格式、术语、证明深度

- 固定结构、二级标题、排版都合格：`npm run content` 0 个错误、0 个警告；用脚本查过每段不超过 4 句、中英文之间有空格、引号用「」，都没有问题。每节两道例题都先写「为什么想到这么做」。
- 术语：19 个新术语在每节第一次标记时都写了术语表里的英文全称；每个三级标题下第一次出现都做了标记（3b 的简称除外）；简介准确，锚点都落在真正下定义的那一段（相轨道和相空间同在 `def-phase-space`，完全积分、哈密顿主函数和方程同在 `def-hamilton-jacobi`，那一段确实同时定义了它们）。符号符合领域约定。
- 证明深度：6 节是 `full`，讲解给出了完整推导（正则方程的双向证明、刘维尔定理一个自由度的情形、雅可比恒等式、括号不变定理、生成函数、周期定理）；$2n$ 维的刘维尔定理见小问题 1a。`adiabatic-invariants` 是 `sketch`，给的是证明思路并说明了严格证明要做什么，符合。
- 难度档：都符合四档的定义。`phase-space-liouville` p3 离例 2 最近，但加了弹力以后例 2 的显式解用不上，要用讲解里的 $\dv{A}{t}=(\nabla\cdot\vb{v})A$，算中等。

## 我替你定的（都能改）

1. 本批验算的共用部分放进新文件 `tools/verify/physics.analytical-mechanics._hamilton.ts`，没有改批次 1 已提交的 `_mech.ts`（只从它导入）。文件名第三段以下划线开头，`npm run verify` 不把它当成小节脚本。
2. 标准答案是极限值的题（`adiabatic-invariants` 的 4 题，$\varepsilon\to0$）：验算脚本直接模拟参数缓慢变化的过程，和手推的精确值核对时容差放宽到 $10^{-5}$，和标准答案比对的仍是手推的精确值（和批次 1 「两种算法先互相核对」的做法一致）。
3. `phase-space-liouville` 例 1 里定义的「分界线（separatrix）」后面三节都在用，但方案只要求讲解里的定义段加锚点，例题里的不算，我没有把它算成问题。
4. 重要 1 定为「重要」：它是这一节 goal（「验证一个变换是否正则」）里的判据，而且有一道题正好落在它说错的那一边；和批次 1 把「判据漏了条件」定为重要的做法一致。

## 要写回 plan.md 的

1. 「内容生产与审查流水线 / 每批的流程」第 3 条「简单题、中等题」那一项末尾补：「标准答案是某个极限值时（例如参数无限缓慢变化时的浸渐不变量），验算脚本直接模拟这个过程（参数变得足够慢），和手推的精确值核对时容差可以放宽，在脚本的 `notes` 里写明取了多慢；和标准答案比对的仍是手推的精确值（批次 2 审查时定的）。」

## 没验证的地方

- 内置浏览器的面板没显示，动画收不到帧，截图停在页面顶上：三个相图只确认了画布上画出了初始内容，轨迹的运动、点击放轨迹、拖滑块后的样子都没看到；小问题 2b 的切边是数值积分算出来的，没有在页面上看到。动画的说明是否和真实画面一致（例如相图的尾迹长短），要你在 Chrome 里看一眼。
- 没有截图核对亮色、暗色主题；SVG 都用 `currentColor` 和页面变量写颜色。
- 题目卡片的作答、提示、术语浮窗没有在页面上操作。
- `npm run verify` 里的数学分析脚本是另一个审查会话写的，只确认了它们能跑通、和标准答案一致，没有审查。

## 修订说明（写内容会话）

报告里的重要 1 条（3 处）、小问题 3 条（表里共 14 处）全部照改，没有不改的。按「同一类问题在整批里找一遍」，另外找到并改了 11 处（下面标「同类另改」）。只改了 `content/physics/analytical-mechanics/` 和本节；没有改题号、标准答案和选项，`progress/problems/` 里只有 `math.analysis.yaml`，不需要迁移脚本。

**重要 1 · 正则变换的面积判据漏了「不翻面」**

- `canonical-transformations/lesson.md:52`：改成「两条边的叉积（垂直于平面的那个分量）是 $\pb{Q}{P}\,\delta q\,\delta p$：它的绝对值是面积，它的正负说明图形有没有被翻面。所以一个自由度时，正则变换就是保持面积、而且不把图形翻面的换元；$Q=p$、$P=q$ 面积不变，却把图形翻了面，$\pb{Q}{P}=-1$」。
- 另外两处只用到一个方向，按建议把「就是保持面积的换元」改成「保持面积」：`action-angle-variables/lesson.md:27`；`canonical-transformations/problems.yaml:149`（p7 提示 3）。全批搜过「保持面积」「面积不变」，其余各处都只说「正则变换（或相流）保持面积」这一个方向，没有别的「就是」。

**小问题 1 · 说法比证明或反例走得远**

- 1a `phase-space-liouville`：采用报告的第二种办法，前置加 `math.linear-algebra.determinant`（构建没有多余前置的警告，仍在第 20 层，后面各节层级都不变），讲解里补了 $2n$ 维的证明（`lesson.md:64`、`:66`）：以 $\vb{a}_1,\dots,\vb{a}_{2n}$ 为棱的平行多面体，体积是以棱为列的行列式；经过 $\dd t$ 它被线性变换 $I+J\,\dd t$ 映过去，体积乘 $\det(I+J\,\dd t)$；按列的多重线性展开，一次项是把单位矩阵第 $k$ 列换成 $J$ 的第 $k$ 列的 $2n$ 个行列式之和，第 $k$ 个等于 $J_{kk}$，所以 $\det(I+J\,\dd t)=1+(\nabla\cdot\vb{v})\,\dd t+O(\dd t^2)$。
- 1b `action-angle-variables/lesson.md:116`：误区改成「能量越大，周期一定越长」，三个例子（单摆、谐振子、盒子）都对得上。
- 1c `action-angle-variables/lesson.md:117`：改成「几个自由度时要有 $n$ 个互相独立、彼此泊松括号为零的守恒量，能分离变量时就有」（「泊松括号」在这一节第一次出现，标了术语、括注了英文）。
- 同类另改 `canonical-transformations`：讲解里的反例 $Q=q$、$P=2p$ 原来写「正则方程不成立」，可本节 p8 说明伸缩换元在把哈密顿量乘一个常数以后能凑出正则方程（这里乘 $2$ 就行）。`lesson.md:30` 改成「把 $H$ 改写成新变量……：拿它当新的哈密顿量，正则方程不成立」；常见误区第一条（`:129`）改成「要保持基本泊松括号，才能拿改写成新变量的 $H$ 当新的哈密顿量；$Q=q$、$P=2p$ 就不行（把 $H$ 乘 $2$ 倒能凑出正则方程，那只是换了单位，见 p8）」。

**小问题 2 · 几何图像和说明、动画范围对不上**

- 2a `poisson-brackets`：按报告的第一种办法改 `level-curves.svg`：加了第二、四象限的虚线 $qp=-\frac12$，带箭头的点挪到它和圆的交点 $(-0.366,\ 1.366)$，即 SVG 的 $(200.7,\ 100.7)$，速度方向 $(0.966,\ -0.258)$；源码注释写明了这一点和 $\pb{qp}{H}=\sqrt3$。说明（`lesson.md:72`）改成「在带箭头的那一点，圆横穿过 $qp=-\frac12$ 那条虚线，$qp$ 在变」。改完在页面上看过。
- 2b `adiabatic-invariants/lesson.md:59`：`range` 的 `p` 改成 `[-2.7, 2.7]`。另外三个动画按同样的办法核了一遍：`hamiltons-equations` 的切点和截距、`phase-space-liouville` 的 12 个初始点（$\lvert p\rvert$ 最大 1.35）、`action-angle-variables` 的四个振幅（$g/l=3$ 时 $\lvert p\rvert$ 最大 3.41），都在显示范围里，没改。

**小问题 3 · 题面与术语规范**

- 3a `hamilton-jacobi/problems.yaml:23`：题面改成「（$\alpha$ 是任意常数，要求对所有 $\alpha$ 都成立；$t>0$）」，选项和答案不变。同类：查了本批其余的选择题，`canonical-transformations` p2 的 $\alpha$ 对所有值都成立，别的题没有带参数的选项，不会有两种读法。
- 3b `action-angle-variables`：三处「特征函数」都标了 `:term[特征函数]{id="physics.analytical-mechanics.characteristic-function"}`（`lesson.md:27`、`:40`、`:114`）。同类另改：用脚本把术语的简称（「特征函数」「基本括号」「主函数」「正则方程」）也当作术语，在 7 节里重查每块第一次出现，又找到 `canonical-transformations/lesson.md:83` 的「基本括号」，标上了；`:129` 改写后「哈密顿量」第一次出现挪到了常见误区第一条，标记也跟着挪了过去。
- 3c `phase-space-liouville/lesson.md:33`：加了 `::anchor{id="def-center-saddle"}`，页面上那一段已显示成定义卡片。同类另改：查了 7 节讲解里所有「叫作」「叫」的段落，`hamilton-jacobi` 讲分离变量（separation of variables）的那一段也是在下定义，加了 `::anchor{id="def-separation"}`（`lesson.md:46`）；其余的定义段都已有锚点，或者在例题里（报告「我替你定的」3）。
- 3d 报告列的都括注了英文：`poisson-brackets` p7「对易子（commutator）」；`hamilton-jacobi` p7「薛定谔方程（Schrödinger equation）」「群速度（group velocity）」「费马原理（Fermat's principle）」「WKB 近似（WKB approximation）」；`action-angle-variables` p7「WKB 近似（WKB approximation）」；`adiabatic-invariants` p7「熵（entropy）」「等熵过程（isentropic process）」、p8「轨道共振（orbital resonance）」；`phase-space-liouville` p7「热力学第二定律（second law of thermodynamics）」「熵（entropy）」。同类另改：把 7 节题目文字里的名词逐个过了一遍，又补了 `poisson-brackets` p7 提示 3「可观测量（observable）」，`hamilton-jacobi` p7 提示 3「波包（wave packet）」「波动力学（wave mechanics）」「几何光学（geometric optics）」，`action-angle-variables` p7 提示 3「波函数（wave function）」，`adiabatic-invariants` p7 提示 2「单原子理想气体（monatomic ideal gas）」，`hamiltons-equations` p7 提示 3「散度（divergence）」「正则变换（canonical transformation）」、p8 提示 3「规范自由度（gauge freedom）」。
- 3e `canonical-transformations/problems.yaml:149`：改成「这和[相空间与刘维尔定理](lesson:physics.analytical-mechanics.phase-space-liouville)那一节的刘维尔定理是同一件事」，链接保留。同类另改：`poisson-brackets` p5 提示 3 原来写「这和拉格朗日力学里的诺特定理说的是同一件事」，诺特定理那一节也不在泊松括号的前置链上，改成带链接的「这和[诺特定理](lesson:physics.analytical-mechanics.noether-theorem)（Noether's theorem）那一节说的是同一件事」。其余跨节引用（「上一节」「讲正则方程时」「以后讲……时」）都指向前置链上的小节，或者只是往后的预告。

**修订后跑过的**：`npm run content` 0 个错误、0 个警告；`npm test` 19 个文件、170 个测试全部通过；术语标记、英文括注、每段句数、中英文空格用脚本重查了 7 节，都合格；28 道简单题、中等题的自查验算重跑，全部一致（标准答案都没动）；`npm run build` 后在 test-serve 上看了改过的泊松括号的图、刘维尔定理新加的两段（公式正常、没有 KaTeX 错误）和中心、鞍点的定义卡片。文件头的 `status` 都还是 `written`，没有动。

## 复核

审内容 agent · 2026-11-09。只核修订说明以后的改动，不重复已经报过的问题。

**没有需要修的：7 节全部通过，文件头的 `status` 已改成 `reviewed`（只改了这一行）。** 重要 1 条（3 处）、小问题 3 条都按建议改好了，写内容会话另改的 11 处同类问题也都对。复核时看出两处可以顺手改进的地方，都不挡 `reviewed`，见本节最后。

### 怎么核的

- **找出全部改动**：审查时内置浏览器加载过的内容包（审查时那一版，`?v=7bb8828430`）还在浏览器缓存里。我核对过它确实是审查时的版本（里面还是「就是保持面积的换元」那句原话），再把它和修订后重新编译的内容包逐段转成文字（公式还原成 TeX、术语标记和锚点都保留）做逐行比对。内容包不含的部分另外核：文件头逐行对照，难题、思考题的 `reference` 全部重读，SVG 和动画参数单独比。
- **结果**：改动正好是修订说明列的那些，没有说明之外的改动。具体是：
  - 本批 7 节里改了 14 个文件：6 份 `lesson.md`（`hamiltons-equations` 的没动）、7 份 `problems.yaml`、`level-curves.svg`；`phase-space-liouville` 的文件头只多了 `math.linear-algebra.determinant` 这一条前置，别的文件头一行没变。
  - 题号、难度档、标准答案、容差、选项、28 个 `reference` 都没变；批次 1 的 8 节、`_domain.yaml`（术语表和宏）也都没变。
- **验算**：标准答案没有动，7 个验算脚本不用改。`hamilton-jacobi` p2 的新题面（「$\alpha$ 是任意常数，要求对所有 $\alpha$ 都成立」）和我验算时的理解、标准答案一致。
- **跑过的命令**：`npm run content`（0 个错误、0 个警告）；`npm run verify`（29 个小节全部一致）。
- **重新用脚本查了 7 节**：术语标记（这次把「特征函数」「基本括号」「主函数」「正则方程」这些简称也当术语查）、本节第一次标记的英文全称、每段不超过 4 句、中英文空格，都合格。新加的两个锚点都在。按新的前置重算了层级：`phase-space-liouville` 仍在第 20 层，后面各节都没变。
- **页面**（`test-serve`，进度写临时仓库；面板没显示，用页面数据核对）：
  - 4 节都没有 KaTeX 错误。
  - `phase-space-liouville`：「中心、鞍点」和 `hamilton-jacobi` 的「分离变量」都显示成了定义卡片；前置回顾里多了「行列式：有向面积与体积」。
  - `poisson-brackets`：带箭头的点画在 $(200.7,\ 100.7)$。
  - `adiabatic-invariants`：滑块不变。

### 逐条

| 编号 | 小节 | 结果 |
| --- | --- | --- |
| 重要 1 | `canonical-transformations`、`action-angle-variables` | 通过。`lesson.md:52` 写明叉积的绝对值是面积、正负说明翻没翻面，判据改成「保持面积、而且不把图形翻面」，并把 $Q=p$、$P=q$ 作为反例写进去；另外两处只用到的那个方向改成了「保持面积」。 |
| 小问题 1a | `phase-space-liouville` | 通过。选了加前置的那种改法，$2n$ 维的证明核过：以棱为列的行列式按列多重线性展开，一次项是 $2n$ 个「把单位矩阵第 $k$ 列换成 $J$ 的第 $k$ 列」的行列式，各等于 $J_{kk}$，所以 $\det(I+J\,\dd t)=1+(\nabla\cdot\vb{v})\,\dd t+O(\dd t^2)$。新加的两段各 2 句；`math.linear-algebra.determinant` 的 goal 正好是「多重线性和交错性」，矩阵、线性变换也随它进了链，「单位矩阵」不用另外交代；没有多余前置，层级不变。 |
| 小问题 1b | `action-angle-variables` | 通过。误区改成「能量越大，周期一定越长」，单摆、谐振子、盒子三个例子都对得上。 |
| 小问题 1c | `action-angle-variables` | 通过。改成「要有 $n$ 个互相独立、彼此泊松括号为零的守恒量，能分离变量时就有」，对：分离常数就是一组正则变换的新动量，彼此括号为零。「泊松括号」是这一节第一次出现，标了术语、括注了英文。 |
| 小问题 2a | `poisson-brackets` | 通过。新虚线两支按坐标核过，都在 $qp=-\frac12$ 上；带箭头的点 $(-0.366,\ 1.366)$ 在圆上，速度方向和箭头 $(52.2,\ -14.0)$ 的斜率一致；注释里的 $\pb{qp}{H}=\sqrt3$ 对。说明改成了「圆横穿过 $qp=-\frac12$ 那条虚线」。 |
| 小问题 2b | `adiabatic-invariants` | 通过。`range` 的 `p` 已是 $[-2.7,\ 2.7]$，$\varepsilon=3$ 时最大的 $\lvert p\rvert=2.50$ 也在画面里；动画别的参数没变。 |
| 小问题 3a | `hamilton-jacobi` | 通过。 |
| 小问题 3b | `action-angle-variables` | 通过。三处都标了；同类另改的 `canonical-transformations:83`「基本括号」也标了。 |
| 小问题 3c | `phase-space-liouville` | 通过。同类另改的 `hamilton-jacobi:46`（分离变量那一段确实在下定义）加锚点也对。 |
| 小问题 3d | 6 节 | 通过。报告列的 5 节都括注了；同类另改的 9 个名词（可观测量、波包、波动力学、几何光学、波函数、单原子理想气体，以及 `hamiltons-equations` 的散度、正则变换、规范自由度）英文都对。 |
| 小问题 3e | `canonical-transformations` | 通过。同类另改的 `poisson-brackets` p5 提示 3 也对：诺特定理那一节确实不在泊松括号的前置链上，改成了带链接的说法。 |

**写内容会话另改的 `canonical-transformations` 两处**：都对。讲解 `:30` 和常见误区第一条现在说的是「拿改写成新变量的 $H$ 当新的哈密顿量，正则方程不成立」。这比原来的「正则方程不成立」准确：$Q=q$、$P=2p$ 时取 $K=2H$，正则方程确实成立（验算过：$\dot Q=\frac{\partial K}{\partial P}$、$\dot P=-\frac{\partial K}{\partial Q}$），和 p8 讲的伸缩是同一回事。

### 复核时看出的（都不挡 `reviewed`）

1. `canonical-transformations/lesson.md:52` 句末的「（几何图像）」现在跟在反例 $Q=p$、$P=q$ 后面，读起来像图里画了这个翻面的例子。挪到「……不把图形翻面的换元」后面更清楚。
2. `level-curves.svg` 新加的那条虚线没有标「$qp=-\frac12$」，第二象限现在有两条虚线。说明已经点了名，而且带箭头的点就在它上面，不标也能认出来；要标的话，在第二象限那一支旁边加一个和「$qp=-1$」同样的标签即可。

这两处都是措辞和标注，不值得为它们再改一轮。以后改这两节时顺手改，改完按方案把 `status` 退回 `written`，由审内容会话复核。

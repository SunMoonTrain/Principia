# 批次 3 审查报告：分析力学（小振动、刚体、场与带电粒子、哈密顿混沌 8 节）

审内容 agent（和写内容 agent 是两个独立会话，没有读它的会话记录、交接说明和自查脚本）· 2026-11-09

审查范围：`content/physics/analytical-mechanics/` 下 `small-oscillations`、`rigid-body-kinematics`、`inertia-tensor`、`euler-equations`、`heavy-symmetric-top`、`field-lagrangian`、`charged-particle-lagrangian`、`hamiltonian-chaos` 8 节的 `lesson.md`、`problems.yaml`、SVG，以及 `_domain.yaml` 的改动（新增宏 `\T` 和 17 个术语）。批次 1 的 `cyclic-coordinates/equal-areas.svg`（第 23 行 φ̇ 的组合附加符）按安排在修订时改，复核时再看，这次没审。

## 结论

重要 2 条（都在 `hamiltonian-chaos`），小问题 2 条（同一类合成一条，共 8 小项）。

- 32 道简单题、中等题的标准答案全部和独立验算一致；32 道难题、思考题的参考解答和三级提示逐题读过（不只抽查），推导都对。
- **重要 1 · `hamiltonian-chaos` 例 1 拿 KAM 定理解释一个不满足它条件的系统**：$\varepsilon=0$ 时两个频率都是 $1$、和作用量无关，讲解里刚写的「频率不退化」不成立，而且每个环面都是共振的；按这一节自己的说法，共振的环面会破裂，可例 1 的结论却是「点大多仍排成闭合曲线」。
- **重要 2 · `hamiltonian-chaos` 讲解里直接写出了 p3 的答案**（`lesson.md:72`「$(\pi,0)$ 在 $0<K<4$ 时是椭圆的（p3）」），这道中等题照抄就行。
- 小问题 1：讲解里 5 处说法不准（稳定性的条件、可积系统的轨道、一个符号、例题的出发点、一个字母两用）。小问题 2：术语与规范 3 类（简称没标、新名词没括注英文、定义段没有锚点）。
- 有 5 节改了批次 0 定的前置，都合理、都是最少的；只有 `field-lagrangian` 的层级从 18 变成 19，没有别的小节以它为前置。见「前置的改动」。
- 几何图像：8 节都有 SVG，6 节另有动画组件（`small-oscillations`、`field-lagrangian` 振子，`euler-equations`、`charged-particle-lagrangian` 相图，`inertia-tensor`、`heavy-symmetric-top` 函数图），没有占位框。5 张由计算画出的图（含标准映射）从 SVG 的数据反推、重新积分或逐点比对过，都对；滑块范围和初值都合理。
- 没有挡住 `reviewed` 的结构性问题，8 节修完都可以标；`inertia-tensor`、`heavy-symmetric-top`、`charged-particle-lagrangian` 只有术语规范的小项。
- 史实和数字能查到来源的都对得上，见「史实和数字」；「贾尼别科夫看到螺母每隔几秒翻一次」只找到二手来源。

| 小节 | 重要 | 小问题 |
| --- | --- | --- |
| `small-oscillations` 小振动与简正坐标 | 0 | 2（1a、2b） |
| `rigid-body-kinematics` 刚体的角速度与欧拉角 | 0 | 2（2a、2b） |
| `inertia-tensor` 惯性张量与惯量主轴 | 0 | 1（2a） |
| `euler-equations` 欧拉方程与自由刚体 | 0 | 2（2a、2b） |
| `heavy-symmetric-top` 重对称陀螺 | 0 | 1（2b） |
| `field-lagrangian` 场的拉格朗日表述 | 0 | 2（1e、2b） |
| `charged-particle-lagrangian` 电磁场中带电粒子的拉格朗日量 | 0 | 1（2b） |
| `hamiltonian-chaos` 哈密顿系统中的混沌 | 2 | 5（1b、1c、1d、2b、2c） |

编号对应下面的分类：

- 重要 1（例 1 用错了 KAM 定理）、重要 2（讲解写出 p3 的答案）：`hamiltonian-chaos`。
- 小问题 1（讲解里的说法不准）：1a `small-oscillations` 稳定性的条件，1b `hamiltonian-chaos` 可积系统的轨道（含术语简介），1c `hamiltonian-chaos` 例 1 的符号，1d `hamiltonian-chaos` 例 2 的出发点，1e `field-lagrangian` 的 $S$ 两用。
- 小问题 2（术语与规范）：2a 简称「主轴」「角速度」没标记，2b 新名词第一次出现没括注英文（7 节），2c `hamiltonian-chaos` 定义段没有锚点。

## 怎么审的

- 通读 `docs/plan.md` 和批次 2 的审查报告；用 `git diff HEAD -- content/physics/analytical-mechanics/` 看本批改动：8 节从目录写成正文（另有 8 份 `problems.yaml`、8 张 SVG 是新文件），`_domain.yaml` 加了宏 `\T` 和 17 个术语。批次 1、2 的 15 节和别的文件没有改动。没读写内容会话的交接说明，「改了但汇报里没提」这一项没法做。
- 逐节读讲解、例题、常见误区，推导逐步核对。SVG 按源码里的坐标核对；由计算画出的 4 张（`euler-angles.svg`、`angular-momentum-sphere.svg`、`nutation-loci.svg`、`crossed-fields.svg`），以及 `standard-map.svg` 的每个点，都从数据反推或重新积分比对（结果写在各节里）。
- 简单题、中等题：只用 `npm run statements -- <8 个小节 id> --tier easy,medium` 读题，写完验算脚本、跑出结果以后才打开 `problems.yaml`。
- 难题、思考题：32 题的参考解答全部读了，连同三级提示，推导逐步核过。
- 术语：用脚本检查每节第一次标记是否带上术语表里的英文全称、每个二级和三级标题下第一次出现是否标记（这次把「主轴」「角速度」两个简称也当术语查）、每段不超过 4 句、中英文空格、引号；术语表简介和锚点逐条看；用脚本列出讲解里所有「叫作」「这就是」的句子，看定义段有没有锚点；新名词的英文括注是通读时记下、再用脚本定位第一次出现的地方。
- 前置：用脚本列出每节的整条前置链，对照讲解用到的概念；改了前置的 5 节，按批次 0 的前置重算层级比较，并检查新加的前置能不能由别的前置推出。
- 页面：`npm run build` 后用 `.claude/launch.json` 里的 `test-serve` 打开 8 节（进度写临时仓库，查完已停掉）。内置浏览器的面板没显示，截图跟不上，改用页面数据核对：8 节的二级标题齐全、公式没有 KaTeX 错误、几何图像里有 SVG、6 个动画都挂上了画布、滑块的范围和初值和内容文件一致、定义卡片都在。
- 史实和数字：网上查了能查的几条（见「史实和数字」）。
- 跑过的命令：`npm run content`（0 个错误、0 个警告）；8 个验算脚本单独跑，再跑 `npm run verify`（42 个小节全部一致，含另一个审查会话的数学分析脚本）；`npx tsc -p tsconfig.node.json --noEmit`（通过）；`npm run build`（通过）。

## 简单题、中等题的验算

脚本在 `tools/verify/physics.analytical-mechanics.<小节>.ts`。本批刚体几节的共用部分放在新文件 `tools/verify/physics.analytical-mechanics._rigid.ts`（3×3 矩阵、欧拉角、由体坐标轴的速度求角速度、按 $\dot{\vb{L}}=\boldsymbol{\tau}$ 积分刚体的转动），也用 `_mech.ts`（RK4、达朗贝尔原理、二分）和 `_hamilton.ts`（正则方程、数值泊松括号）。每道题用两种互相独立的算法：一种数值地做（角速度由体坐标轴的速度求、刚体按角动量定理积分而不用欧拉方程、按完整的运动方程从简正模出发积分读频率、场的欧拉-拉格朗日方程里的偏导数全部数值求、回到小球链积分、直接按牛顿定律积分洛伦兹力），另一种是手推的公式；两者先互相核对，再和标准答案比。选择题对每个选项做数值实验或找反例。

| 小节 | p1 | p2 | p3 | p4 |
| --- | --- | --- | --- | --- |
| `small-oscillations` | $\sqrt6$ ✓ | A、D ✓ | $\sqrt3$ ✓ | $\sqrt{2g/R}\approx6.261$ ✓ |
| `rigid-body-kinematics` | $\sqrt{20}$ ✓ | A、D ✓ | $\pi/6$ ✓ | $\sqrt5/2$ ✓ |
| `inertia-tensor` | 3 ✓ | A、B ✓ | $5/12$ ✓ | $0.17999$ ✓ |
| `euler-equations` | $-0.5$ ✓ | A、C ✓ | $\sqrt3$ ✓ | $\sqrt{45}/2$ ✓ |
| `heavy-symmetric-top` | 4.9 ✓ | A、B、C ✓ | 79.196 ✓ | 5.2437 ✓ |
| `field-lagrangian` | 100 ✓ | A、C ✓ | 372.42 ✓ | 0.2 ✓ |
| `charged-particle-lagrangian` | 8 ✓ | A、B、D ✓ | $2\times10^5$ ✓ | 0.20875 ✓ |
| `hamiltonian-chaos` | $\frac\pi2+1$ ✓ | A、B、C ✓ | 4 ✓ | $\ln2$ ✓ |

几个值得一提的做法（详细写在各脚本的 `notes` 里，`npm run verify` 会打印出来）：

- `euler-equations`、`heavy-symmetric-top` 不用欧拉方程，也不用欧拉角和有效势：刚体的状态取 $(R,\vb{L})$，$\vb{L}$ 按角动量定理变化，$\boldsymbol{\omega}$ 由 $\vb{L}=RI'R\T\boldsymbol{\omega}$ 解出，体坐标轴按 $\dot{\vb{e}}'_k=\boldsymbol{\omega}\times\vb{e}'_k$ 转。对称陀螺另用状态 $(\vb{n},\vb{L})$（$\dot{\vb{n}}=\vb{L}\times\vb{n}/I_1$），睡陀螺的临界转速由「稍微偏离竖直以后会不会倒」二分得到（分辨率约 $10^{-5}$）。
- `heavy-symmetric-top` p1 的标准答案是快陀螺的近似，即 $I_1Mgl/(I_3\omega_3)^2\to0$ 的极限：按批次 2 定的规矩，取 $I_1=10^{-10}$ 二分出严格的慢进动角速度，和 $Mgl/(I_3\omega_3)$ 核对。
- `field-lagrangian` p1、p3 除了把试探解代进数值的欧拉-拉格朗日方程，还回到小球链积分：间距 1 mm 的链上高斯隆起分成两半，量向右那一半的峰走多快；400 个小球的链从最低模出发读周期。两种算法相差不到 $10^{-4}$、$10^{-5}$。
- `hamiltonian-chaos` p1 不用映射的公式：把 $\delta$ 冲击换成宽 $w$ 的光滑脉冲，按正则方程积分一个周期，$w\to0$ 外推。p2 的反例 D 用亨农-海利斯系统，算出李雅普诺夫指数约 0.12。

## 前置的改动

和批次 0 审过的目录相比，5 节改了前置，都合理；新加的前置都不能由这一节别的前置推出（`npm run content` 也没有多余前置的警告）。按批次 0 的前置重算层级，只有 `field-lagrangian` 变了。

| 小节 | 批次 0 | 现在 | 看法 |
| --- | --- | --- | --- |
| `inertia-tensor` | `rigid-body-kinematics`、`spectral-theorem`、`triple-integrals` | 加了 `newtonian-mechanics.rotational-energy` | 合理：平行轴定理那段（`:75`）把对任意轴的结论和「转动动能与平行轴定理」对照并链接了它，原来的链上只有 `fixed-axis-rotation`。仍在第 17 层。 |
| `euler-equations` | `inertia-tensor`、`rotating-frames` | 加了 `oscillations-waves.simple-harmonic-motion` | 合理：`:61`、`:73` 用到简谐运动的解；刚体这一支的链（经 `constraints`、`fixed-axis-rotation`、`rotating-frames`）上没有振动。仍在第 18 层。 |
| `heavy-symmetric-top` | `euler-equations`、`cyclic-coordinates` | 加了 `newtonian-mechanics.gyroscopes` | 合理：`:66` 把慢进动和「陀螺与进动」里由力矩算出的进动角速度对照，是批次 1 定的「物理里换一种方法重讲，把讲过的那一节列为前置」。仍在第 19 层。 |
| `field-lagrangian` | `hamiltons-principle`、`multivariable-functionals` | 加了 `oscillations-waves.wave-equation` | 合理：开头和结论都和弦的波动方程对照，`:16` 还链接了随它进链的「一维链与连续极限」。层级 18 → 19，没有别的小节以它为前置，不影响别处。 |
| `charged-particle-lagrangian` | `lagrange-equations`、`gauge-potentials` | `lagrange-equations` 换成 `hamiltons-equations` | 合理而且最少：第二部分讲正则动量、哈密顿量和正则方程（`:49`–`:59`、p5）；`hamiltons-equations` 的链上已有 `lagrange-equations`，换掉以后没有重复列。仍在第 25 层。 |

另外 3 节的前置没改。沿整条链核对过讲解用到的数学工具：谱定理、正交矩阵、二次型、黑塞矩阵（`small-oscillations`），叉积、行列式与有向体积（`rigid-body-kinematics`），三重积分（`inertia-tensor`），格林公式（`field-lagrangian`），复特征值、相空间与刘维尔定理、生成函数（`hamiltonian-chaos`）都在链上。前置链上没有的两处我不算缺前置：`inertia-tensor` 的「正定、半正定」在 `:40` 当场用 $\vb{n}\T I\vb{n}>0$ 说明了；`euler-equations` 几何图像的「相图」「鞍点」，说明里写了画的是什么、轨迹怎样走。

## 逐节

### physics.analytical-mechanics.small-oscillations 小振动与简正坐标

单摆的引入、平衡位置的充要条件（静止时拉格朗日方程只剩 $\frac{\partial V}{\partial q_j}=0$）、$L_2$ 的定义和「为什么」、简正坐标定理的证明（两次谱定理，$D^{-1/2}O\T TOD^{-1/2}=I$，$M-\omega^2I$ 和 $V-\omega^2T$ 的行列式只差一个不为零的因子，$A$ 的第 $k$ 列满足 $(V-\omega_k^2T)a^{(k)}=0$）、半正定时的零频率都对。例 1 双摆（$\omega^2=(2\mp\sqrt2)\frac gl$，$\frac{a_2}{a_1}=\pm\sqrt2$）、例 2 三原子分子（行列式因式分解和三个简正模）逐步核过。`double-pendulum-modes.svg` 按坐标核对（摆长 110 像素，$\theta_1=0.25$，$\theta_2=\pm\sqrt2\theta_1$）；振子动画的三个简正模 $(1,\sqrt2,1)$、$(1,0,-1)$、$(1,-\sqrt2,1)$ 对，两个滑块都能取到说明里的三组值。8 题都对：p5 瑞利商、加约束不降低最低频率，p6 简正模关于 $T$ 正交和初值分解（频率比 $1+\sqrt2$），p7 四次方势和 FPU 实验，p8 球面摆的简并，都核过。

- 小问题 1a（`lesson.md:31` 稳定性的条件）、2b（讲解和 p7、p8 的新名词），见下面的汇总。

### physics.analytical-mechanics.rigid-body-kinematics 刚体的角速度与欧拉角

六个自由度的计数、$R$ 的定义（第 $k$ 列是 $\vb{e}'_k$ 的空间分量）、$\det R=1$ 的连续性论证、$\dot RR\T$ 反对称、角速度的存在和唯一性、转动矩阵保持叉积、组合定理、体分量对应 $R\T\dot R$、欧拉角的几何意义和存在唯一性的证明（$\theta=0$、$\pi$ 两种退化）、$\boldsymbol{\omega}=\dot\varphi\vb{e}_3+\dot\theta\vb{e}_N+\dot\psi\vb{e}'_3$ 和三个体分量、万向节锁都对。例 1 规则进动（空间锥、本体锥，体分量以 $-s$ 转）、例 2 纯滚动的圆锥（$\dot\psi=-\Omega/\sin\alpha$，$|\boldsymbol{\omega}|=|\Omega|\cot\alpha$）逐步核过。`euler-angles.svg`：按注释里的视角（正交投影，方位 30°、仰角 20°）把 $\varphi=75^\circ$、$\theta=38^\circ$、$\psi=25^\circ$ 的三根体坐标轴、节线和 $1'2'$ 平面的圆重新投影，和 SVG 的坐标一致（体坐标轴画成 0.92 倍长，方向一致；$2'$ 轴背向读者，画成细线）。8 题都对：p5 欧拉转动定理，p6 螺旋运动，p7 有限转动不可交换和准速度（$\int\omega'_1\dd t=\Phi(\sin\theta_1-\sin\theta_2)$），p8 偏航、俯仰、滚转的奇点（$b=\pm\frac\pi2$ 时只依赖 $a\mp c$）和四元数，都核过。

- 小问题 2a（`lesson.md:16` 的「角速度」）、2b（p8 的新名词），见汇总。

### physics.analytical-mechanics.inertia-tensor 惯性张量与惯量主轴

$\vb{L}$ 和 $I_{jk}$ 的推导、$T=\frac12\boldsymbol{\omega}\cdot\vb{L}$ 的证明、$\vb{n}\T I\vb{n}$ 就是对那根轴的转动惯量、正定和半正定（细杆）、换基时的 $Q\T IQ$、主轴的定义和极值性质、镜面对称定理、平行轴定理都对。例 1（立方体对顶点 $\frac23$、$-\frac14$，主转动惯量 $\frac16$、$\frac{11}{12}$；对中心是 $\frac16Ma^2$ 乘单位矩阵）、例 2（倾斜哑铃，$\vb{L}\perp$ 杆，$|\boldsymbol{\tau}|=ma^2\omega^2\sin2\beta$）逐步核过。`tilted-dumbbell.svg`：杆和竖直线成 35°，$\vb{L}$ 和杆垂直、和转轴成 55°，$\boldsymbol{\tau}=\boldsymbol{\omega}\times\vb{L}$ 沿 $-y$，在 $x$ 向右、$z$ 向上的纸面里正是指向纸外，箭头尖画的虚线椭圆的半径和高度都对。函数图的曲线、两条特征值水平线、两个极值点的式子在 $c$ 正负两种情况下都对，$c\in[-1,1]$ 时都在纵轴 $[0,3]$ 里。8 题都对：p5 主转动惯量的三角不等式，p6 $n$ 次对称轴（$BJ=JB$ 推出 $q=0$、$p=r$；$n=2$ 时只剩主轴），p7 动平衡，p8 惯量椭球，都核过。

- 小问题 2a（`lesson.md:108`、`:146` 的「主轴」），见汇总。
- `:62` 把「$n\ge3$ 次对称轴是主轴、另两个主转动惯量相等」的证明放在 p6，这一节是 `full`，我没有算成问题，见「我替你定的」第 4 条。

### physics.analytical-mechanics.euler-equations 欧拉方程与自由刚体

$\dot L'+\omega'\times L'=\tau'$ 的推导、欧拉方程和证明、两个守恒量、球面和椭球面的交线、中间轴定理（1、3 轴由守恒量的组合有界，2 轴线性化 $\lambda^2=\frac{(I_2-I_1)(I_3-I_2)}{I_1I_3}\Omega^2$）、自由对称陀螺的定理（$\Omega_b$；$\vb{L}$、$\boldsymbol{\omega}$、$\vb{e}'_3$ 共面，绕 $\vb{L}$ 以 $|\vb{L}|/I_1$ 转）都对。例 1 抛书（293、580、865，$\lambda\approx0.572\Omega$、$0.979\Omega$、$0.568\Omega$，翻面约 0.65 s）、例 2 地球的自由进动逐步核过。`angular-momentum-sphere.svg`：由注释推出投影方向，把每条曲线上的点还原到 $|L'|=1$ 的球面上，每条曲线的 $\sum L_k^2/I_k$ 在画图精度内是常数（1 轴附近 0.98、0.922，3 轴附近 0.353、0.411，蓝色两条都是 $0.500=1/I_2$），分界线是 $L_3=\pm\sqrt3L_1$ 两个大圆。相图动画的线性化方程核过；$a$ 取两端 1 和 5 时三条轨迹都在画面里，$a$ 靠近 2、3 时椭圆伸出画面，说明里写了「越扁长」。8 题都对：p5 自由对称陀螺的欧拉角，p6 分界线上的 $\tanh$ 解（$\mu\omega_0=\lambda$），p7 探险者 1 号，p8 贾尼别科夫效应（间隔按 $\frac1\lambda\ln\frac1\delta$ 变长），都核过。

- 小问题 2a（`lesson.md:50`、`:61`、`:68`、`:103`、`:109` 的「主轴」）、2b（p7 的新名词），见汇总。

### physics.analytical-mechanics.heavy-symmetric-top 重对称陀螺

拉格朗日量、两个广义动量（$p_\varphi$ 就是 $L_z$）、$\omega_3$ 守恒的力矩解释、能量守恒、有效势和 $\dot\varphi$、$\dot\psi$、两端 $U\to+\infty$ 的条件、匀速进动的二次方程（$\theta$ 的拉格朗日方程核过）和判别式、快陀螺的两个根（快的那支 $\vb{L}$ 正好竖直）、章动、从静止放开时起点是上面的转折角、快陀螺章动的幅度 $\frac{2I_1Mgl\sin\theta_0}{I_3^2\omega_3^2}$ 和角频率 $\frac{I_3\omega_3}{I_1}$、睡陀螺的条件都对。例 1（3.44、65.8 rad/s，近似值 3.27，最低 130 rad/s）、例 2（140 rad/s，约 76 s）逐步核过。`nutation-loci.svg`：三种情形按 $(\vb{n},\vb{L})$ 的方程重新积分，三幅图的曲线离积分轨道都不到 0.4 像素（横向同一比例，约 136 像素/弧度）；$\theta_1$、$\theta_2$ 是 0.600/0.680、0.600/0.965、0.600/0.771，（b）的 $\dot\varphi$ 在 $\theta\approx0.68$ 变号，（c）的尖点在 $\theta_1$，和说明一致。函数图的 $U(\theta)$、$E'$ 和右边那个点的反余弦公式核过，$s=0$ 时右点在 $\pi$。8 题都对：p5 快陀螺的章动，p6 $\omega_3$、$L_z$、$|\vb{L}|$ 的力矩论证，p7 岁差和 18.6 年的章动，p8 三种轨迹、尖点只在上面的转折角，都核过。

- 小问题 2b（p7 的新名词），见汇总。

### physics.analytical-mechanics.field-lagrangian 场的拉格朗日表述

小球链的势能 $\frac{T}{2a}(\Delta y)^2$、连续极限、场和拉格朗日密度的定义、$\mathcal L$ 加散度项不改变方程、场的欧拉-拉格朗日方程的证明、弦的波动方程、哈密顿密度、能量的连续性方程和能流的意义都对。例 1（$\omega_n=\sqrt{\frac T\mu(\frac{n\pi}\ell)^2+\frac\kappa\mu}$）、例 2（$\mathcal H=Tf'^2$，能流 $=v\mathcal H$）核过。`beaded-string.svg` 的 8 个小球都在虚线的连续弦上，标出的高度差对。振子动画的初值 $\sin\frac{n\pi j}{9}$ 正是链的第 $n$ 个简正模，说明里链和弦的两个频率式子都对。8 题都对：p5 梁（边界上 $\eta=\eta_x=0$，$\omega=\sqrt{EI/\mu}\,k^2$），p6 一般 $\mathcal L$ 的能流和全导数项，p7 链和弦的频率，p8 电磁场的拉格朗日密度，都核过。

- 小问题 1e（$S$ 两用）、2b（讲解和 p5、p7、p8 的新名词），见汇总。

### physics.analytical-mechanics.charged-particle-lagrangian 电磁场中带电粒子的拉格朗日量

定理的证明（$\vb{A}$ 沿运动的全导数、$[\vb{v}\times(\nabla\times\vb{A})]_j$ 的分量公式）、广义势的定义和边界情况、正则动量和哈密顿量（值等于 $\frac12m|\dot{\vb{r}}|^2+q\varphi$）、最小耦合、规范变换下 $L$ 多一个全导数、全导数定理的证明、正则动量依赖规范都对。例 1（$p_x=0$，摆线）、例 2（两种规范的循环坐标，$\vb{A}_2-\vb{A}_1=\nabla(\frac B2xy)$）逐步核过。`crossed-fields.svg` 的三条轨迹和解析解 $x=t+(v_0-1)\sin t$、$y=(1-v_0)(1-\cos t)$（$v_0=0$、$1$、$-1$）比对，偏差不到 0.1 像素。相图动画的方程核过（圆心 $(u,0)$、顺时针）；$u$ 取最大 1.5 时从静止出发的圈右端正好到 $v_x=3$ 的边上，还看得到。8 题都对：p5 由 $H$ 推洛伦兹力，p6 $p_\theta=\frac{qB}{2}(d^2-R^2)$（$p_x=-qBy_c$ 也验了），p7 阿哈罗诺夫-玻姆效应，p8 摩擦力没有广义势，都核过。

- 小问题 2b（讲解和 p7、p8 的新名词），见汇总。

### physics.analytical-mechanics.hamiltonian-chaos 哈密顿系统中的混沌

可积系统、刘维尔-阿诺德定理和证明思路、不变环面、准周期运动、庞加莱截面和庞加莱映射、周期驱动时保持面积、没有吸引子、由受冲击的转子推出标准映射（冲量 $K\sin q$ 的符号对）、标准映射保持面积、不动点的分类（迹 $2+K\cos q$）、KAM 定理的表述（丢番图条件、$\tau>n-1$）和证明思路、两个自由度时环面隔开能量面、阿诺德扩散都对，符合本节的 `sketch`。`standard-map.svg`：把两个面板的 7140 个点还原成 $(q,p)$，按 $K=0.6$、$1.2$ 的映射逐个检查相邻两点，除了 28 处换轨道的地方（29 条轨道），其余 7111 对都满足映射。8 题都对：p5 $n\alpha$ 的小数部分稠密，p6 由冲击推出映射、生成函数 $F_1=-\frac12(Q-q)^2+K\cos q$，p7 太阳系的稳定性，p8 柯克伍德空隙，都核过。

- **重要 1 · 例 1 拿 KAM 定理解释一个不满足它条件的系统**（`lesson.md:93`–`:99`；`:95`「$\varepsilon\ne0$ 时只剩总能量守恒，KAM 定理告诉我们会发生什么」）。$H_0=\frac12(p_1^2+q_1^2)+\frac12(p_2^2+q_2^2)=I_1+I_2$，频率永远是 $(1,1)$：`:77` 的条件 $\det\frac{\partial^2H_0}{\partial I^2}\ne0$ 不成立，而且 $\vb{k}=(1,-1)$ 使每个环面都满足 $\vb{k}\cdot\omega=0$，全是共振的。按 `:79` 的说法「共振的环面……破裂成岛链和夹在中间的混沌层」，读者会推出 $\varepsilon$ 一不为零就到处混沌，和 `:99`「截面上的点大多仍排成闭合曲线」正好相反；`:99` 的「靠近分界线的地方」也没说是哪条分界线（其实是平均以后的近似守恒量的分界线）。结论本身是对的，原因是平均：$\varepsilon q_1^2q_2^2$ 对快的公共转动取平均，得到一个近似守恒量，它的等值线就是截面上那些闭合曲线。建议 `:95` 不说「KAM 定理告诉我们」，`:99` 补两三句：这里两个频率都是 $1$、和 $I$ 无关，不满足 KAM 定理的不退化条件，每个环面都共振；$\varepsilon$ 小时运动仍大体规则，是因为对快的转动取平均以后多出一个近似守恒量（严格的论证要对平均以后的系统再用 KAM 定理，这里不展开），分界线指这个近似守恒量的等值线里的那条分界线。也可以换一个满足不退化条件的例子，但改动大，不必。
- **重要 2 · 讲解写出了 p3 的答案**（`lesson.md:72`「所以 $(0,0)$ 在 $K>0$ 时是双曲的，$(\pi,0)$ 在 $0<K<4$ 时是椭圆的（p3）」；`problems.yaml:47` p3 问的正是这个 $K_*$）。读者看完讲解就能照抄 4，p3 不再符合中等题的定义（要组合或多走几步推导）。建议改成「$(0,0)$ 在 $K>0$ 时是双曲的；$(\pi,0)$ 在 $K$ 较小时是椭圆的，$K$ 超过某个值以后变成双曲的（p3）」，后半句「它们对应摆的倒立位置和最低位置」保留。
- 小问题 1b（`:34` 和术语简介）、1c（`:99` 的符号）、1d（例 2 的出发点）、2b（讲解和 p5、p7、p8 的新名词）、2c（`:36`、`:72`、`:81` 的定义段没有锚点），见汇总。

## 小问题 1 · 讲解里的说法不准（汇总）

- **1a · `small-oscillations` 把「黑塞矩阵正定」说成了稳定的必要条件**（`lesson.md:31`「$V$ 的黑塞矩阵正定，平衡才是稳定的」）。正定是稳定的充分条件，不是必要条件：$V=\lambda x^4$ 的黑塞矩阵是零，平衡却是稳定的，这一节的 p7 正是这个例子（`problems.yaml:147`「真实的运动是有界的来回振动」），两处对不上。建议改成「$V$ 的黑塞矩阵正定时平衡稳定，附近是小振动；有负的特征值时不稳定；只是半正定时要看更高阶的项（p7）」。`:111` 的「平衡还要稳定，$V$ 的黑塞矩阵要正定」说的是能不能用二阶近似，可以不改。
- **1b · `hamiltonian-chaos` 把「轨道在环面上」说成了无条件的**（`lesson.md:34`「一个自由度……相轨道是闭合曲线，也就是一维的环面」；`_domain.yaml:558` 可积系统的简介「轨道在不变环面上」）。只有运动有界时才这样：自由粒子、越过势垒跑走的粒子都可积，轨道却不闭合；`:27` 的定理本身写了「有界、连通」，是对的。建议 `:34` 写成「运动有界（并且不在分界线上）时，相轨道是闭合曲线」，简介改成「……；运动有界时轨道在不变环面上」。
- **1c · `hamiltonian-chaos` 例 1 的一个符号**（`lesson.md:99`「$\pb{E_1}{H}=-\varepsilon\pb{E_1}{q_1^2q_2^2}$」）：按本领域的定义，$\pb{E_1}{H}=\pb{E_1}{H_0}+\varepsilon\pb{E_1}{q_1^2q_2^2}=\varepsilon\pb{E_1}{q_1^2q_2^2}=-2\varepsilon q_1p_1q_2^2$，前面不该有负号（数值核过：$\dot E_1$ 等于 $+\varepsilon\pb{E_1}{q_1^2q_2^2}$）。结论「不为零」不受影响。
- **1d · `hamiltonian-chaos` 例 2 的出发点说得太宽**（`lesson.md:103`「从 $p_0=0$ 附近出发的点」，`:107`「点的 $p$ 像随机游走一样增长」）。$K=1.5$ 时 $(\pi,0)$ 仍是椭圆不动点（$K<4$），周围的大岛还在：数值迭代 $10^5$ 次，从 $p_0=0.01$、$q_0=2$ 到 $4.5$ 出发的点 $|p|$ 始终小于 1.7，从 $q_0$ 在 $0$ 附近出发的点 $|p|$ 跑到 60 以上。建议写成「从 $(0,0)$ 附近（混沌区里）出发的点」。
- **1e · `field-lagrangian` 的 $S$ 两用**：作用量（`lesson.md:37`、`:50`）和能流（`:62`、`:66`、`:111`、`:113`、`:120`，`problems.yaml:110` p6）都叫 $S$，同一节里先后出现，`:62` 的 $\frac{\partial S}{\partial x}$ 容易读成作用量的导数。建议能流换一个字母（例如 $j$），p6 跟着改；或者在 `:62` 写明「这里的 $S$ 和作用量无关」。

## 小问题 2 · 术语与规范（汇总）

- **2a · 简称没标记**：「主轴」是「惯量主轴」的简称（同批次 2 的「特征函数」），下面这些块里它第一次出现时没有标记、块里也没有标过「惯量主轴」：`inertia-tensor/lesson.md:108`（几何图像）、`:146`（例 2）；`euler-equations/lesson.md:50`（自由刚体的两个守恒量）、`:61`（绕主轴转动的稳定性）、`:68`（自由对称陀螺）、`:103`（几何图像）、`:109`（例 1）。另外 `rigid-body-kinematics/lesson.md:16` 的「角速度（angular velocity）」没标，`inertia-tensor`、`euler-equations` 开头的同一个词都标了。用 `:term[主轴]{id="physics.analytical-mechanics.principal-axes"}` 这样标上即可。
- **2b · 新名词第一次出现没括注英文**（批次 1 定的规矩，按每节算；下面是脚本和通读找到的，不一定全，请照批次 2 的做法把 8 节的讲解和题目文字再逐个过一遍）：
  - `small-oscillations`：讲解「正定」「倒立摆」（`lesson.md:31`）、「正交矩阵」（`:38`）；p7 提示 3「非线性波」（`problems.yaml:149`），p8 提示 3「能级」（`:167`）。
  - `rigid-body-kinematics`：p8 题干「航天器」「计算机图形学」（`problems.yaml:152`），提示 3「拓扑学」（`:161`）。
  - `euler-equations`：p7 题干「鞭状天线」（`problems.yaml:128`）。
  - `heavy-symmetric-top`：p7 提示 1「扁球」（`problems.yaml:133`，上一节括注过，这一节是第一次），提示 3「潮汐」「自由进动」「钱德勒摆动」（`:139`）。
  - `field-lagrangian`：讲解「格林公式」（`lesson.md:39`）、「基本引理」（`:50`）、「连续性方程」（`:59`）、「偏微分方程」（`:117`）、「驻波」「波节」「波腹」（`:120`）；p5「抗弯刚度」（`problems.yaml:90`）、「色散」（`:105`），p7「声子」（`:139`）、「比热」（`:145`），p8「量子场论」（`:163`）。
  - `charged-particle-lagrangian`：讲解「电磁势」（`lesson.md:22`）、「薛定谔方程」（`:59`）、「全导数」（`:63`）、「柱坐标」（`:124`）、「动量算符」（`:133`）；p7「螺线管」「磁通量」（`problems.yaml:122`）、「波函数」「干涉条纹」（`:131`），p8 提示 3「耗散函数」（`:147`）。
  - `hamiltonian-chaos`：讲解「吸引子」「耗散系统」（`lesson.md:17`）、「混沌海」（`:52`）、「共振」（`:65`）、「雅可比矩阵」（`:70`）、「迹」（`:72`）、「岛链」「混沌层」「傅里叶系数」「牛顿迭代」（`:79`）、「随机游走」「冷原子」（`:107`）；p5 提示 1「抽屉原理」（`problems.yaml:87`），p7 提示 3「李雅普诺夫时间」（`:127`），p8「小行星带」（`:134`）、「偏心率」（`:139`）。人名「拉斯卡尔」（`:127`）、「维斯德姆」（`:143`）没写原文，而 `euler-equations` 的「钱德勒（S. C. Chandler）」「贾尼别科夫（Vladimir Dzhanibekov）」写了，建议统一（人名方案没规定，只是建议）。
- **2c · `hamiltonian-chaos` 的定义段没有锚点**：`lesson.md:72`「……叫作椭圆不动点（elliptic fixed point）；……叫作双曲不动点（hyperbolic fixed point）」是在下定义（这两个词在前置链上没有出现过），和批次 2 的 3c（中心、鞍点）同类；`:36`「这是准周期运动（quasi-periodic motion）」、`:81`「这就是阿诺德扩散（Arnold diffusion）」也是在讲解里给新概念起名。方案要求讲解里下定义的段落都加锚点，建议分别加 `::anchor{id="def-elliptic-hyperbolic"}`、`def-quasi-periodic`、`def-arnold-diffusion`。

## 格式、术语、证明深度、难度档

- 固定结构、二级标题、排版都合格：`npm run content` 0 个错误、0 个警告；用脚本查过每段不超过 4 句、中英文之间有空格、引号用「」（直引号只出现在动画参数里），都没有问题。每节两道例题都先写「为什么想到这么做」。
- 宏 `\T` 的定义 `^{\mathsf{T}}` 和 `math.linear-algebra` 的一样，符合「同名宏各领域一致」。17 个新术语在每节第一次标记时都写了术语表里的英文全称；简介准确（1b 一处除外），锚点都落在真正下定义的那一段（`euler-equations` 用定理段 `thm-euler-equations` 作欧拉方程的锚点，合适）。简称的标记见 2a。
- 证明深度：7 节是 `full`，讲解给出了完整证明（简正坐标定理、角速度的唯一性和组合、欧拉角的存在唯一性、平行轴定理、欧拉方程和中间轴定理、匀速进动和睡陀螺、场的欧拉-拉格朗日方程、带电粒子的拉格朗日量和全导数定理）；`hamiltonian-chaos` 是 `sketch`，刘维尔-阿诺德定理、两个自由度的截面保持面积、KAM 定理给的是思路，并写明了严格证明要做什么，符合。
- 难度档：除重要 2 外都符合四档的定义。`euler-equations` p3、p4 和 `heavy-symmetric-top` p3 离讲解里的公式很近，但都要先算出中间量（线性化的系数、$|\vb{L}|$、$Mgl$），按「多走几步」算中等，不算问题。

## 史实和数字

查到来源、对得上的：

- 钱德勒在 1891 年从各地纬度的变化里找到这个摆动，周期约 433 天；欧拉按刚体算出约 305 天（[EPFL Graph Search 的条目](https://graphsearch.epfl.ch/concept/227314)，[Zotov, Journées 2014](https://syrte.obspm.fr/jsr/journees2014/pdf/Zotov.pdf)）。欧拉的年份各处写 1758 或 1765，讲解只写「十八世纪」，没问题；幅度各处写「几米」或「约 9 米」，随年代变化，和「零点几角秒、几米」一致。
- 贾尼别科夫 1985 年在礼炮 7 号上看到蝶形螺母来回翻转（[维基百科 Vladimir Dzhanibekov](https://en.wikipedia.org/wiki/Vladimir_Dzhanibekov)，[COMSOL 的介绍](https://www.comsol.com/blogs/why-do-tennis-rackets-tumble-the-dzhanibekov-effect-explained)）。「每隔几秒翻一次」只在二手的科普文章里找到，没有找到一手记录。
- 内太阳系的李雅普诺夫时间约五百万年，今后 50 亿年里失稳的概率约 1%（这个 1% 有的写成水星偏心率超过 0.7，有的写成内行星相撞，说的是同一组模拟）（[Hoang、Mogavero、Laskar，arXiv:2205.04170](https://arxiv.org/pdf/2205.04170)，[Laskar，arXiv:0804.1946](https://arxiv.org/pdf/0804.1946)，[巴黎天文台的说明](https://www.observatoiredeparis.psl.eu/IMG/pdf/pr_ss_timescales_chaos_vdef.pdf)）。
- 维斯德姆 1982–1983 年对 3:1 共振的计算：长时间平静以后偏心率突然变大、穿越火星轨道（门槛各处写 0.3 或 0.35）（[Lecar 等，arXiv:astro-ph/0111600](https://arxiv.org/pdf/astro-ph/0111600)，[维斯德姆的学位论文](https://thesis.library.caltech.edu/10394)）。
- 探险者 1 号设计成绕长轴（最小主转动惯量）自旋，因柔性部件耗散能量变成绕横轴的平转（[Gunter's Space Page](https://space.skyrocket.de/doc_sdat/explorer-1.htm)）。各处多把耗散归于鞭状天线，一手分析没有查到。
- 阿波罗的惯性测量装置只有三个框架，飞行时避开框架锁住的姿态（[Apollo Lunar Surface Journal](https://nasa.gov/wp-content/uploads/static/history/alsj/e-1344.htm)，[MIT 博物馆的藏品说明](https://mitmuseum.mit.edu/collections/object/CSDL-107409)）。
- 冷原子实验实现受冲击的转子（Moore 等 1995，先扩散、后局域化）（[Phys. Rev. Lett. 75, 4598](https://link.aps.org/doi/10.1103/PhysRevLett.75.4598)）。
- 标准映射最后一条贯穿的不变曲线在 $K\approx0.9716$ 破裂（Greene 1979）（[Meiss 的标准映射说明](https://amath.colorado.edu/faculty/jdm/stdmap/math.html)，[arXiv:nlin/0508026](https://arxiv.org/pdf/nlin/0508026)）。

没上网查、按通行的教科书数据核对的：地球的 $\frac{I_3-I_1}{I_1}\approx\frac1{305}$；岁差约 2.6 万年、主章动 18.6 年（月球轨道面的进动）；科尔莫戈罗夫 1954、莫泽 1962、阿诺德 1963；FPU 实验的能量回归；阿哈罗诺夫-玻姆效应 1959 年预言。都对得上。

## 我替你定的（都能改）

1. 本批刚体几节的验算共用部分放进新文件 `tools/verify/physics.analytical-mechanics._rigid.ts`，没有改 `_mech.ts`、`_hamilton.ts`（只从它们导入）。文件名第三段以下划线开头，`npm run verify` 不把它当成小节脚本。
2. `heavy-symmetric-top` p1 的标准答案是快陀螺的近似：按批次 2 写回的「极限值」规矩，把它当成 $I_1Mgl/(I_3\omega_3)^2\to0$ 的极限来模拟（取 $I_1=10^{-10}$），和标准答案比对的仍是 $Mgl/(I_3\omega_3)$。
3. 查术语标记时，把「主轴」算作「惯量主轴」的简称、「角速度」算作「角速度矢量」的简称（同批次 2 的「特征函数」）；「环面」不算「不变环面」的简称，讲解里它另有「环面（torus）」本身的意思。
4. `full` 小节里的旁支结论：`inertia-tensor:62`「$n\ge3$ 次对称轴是主轴、另两个主转动惯量相等，证明见 p6」没标「定理」、后文只引用结论，完整证明在难题 p6 里，我没有算成证明深度的问题。要是你希望 `full` 的小节连这类结论也在讲解里证完，它的证明只要三四句（$SI=IS$，$S$ 只保持 $z$ 轴不动；左上角的块和平面转动可交换），可以挪进讲解。
5. 重要 2 定为「重要」：讲解里直接写出了中等题的答案，这道题就不再符合中等题的定义，必须改；改起来只是一句话。
6. 新名词的英文括注按「每节第一次出现」算，前置链上学过的名词（例如「磁通量」「偏心率」）在这一节第一次出现也列了；人名只作建议。

## 要写回 plan.md 的

1. 「每节固定结构与写作规范」第 3 条（讲解）末尾补一句：「讲解、例题和几何图像的说明里引用题目时，不写出简单题、中等题的答案，只说『见 pN』（批次 3 审查时定的）。」
2. 如果你同意「我替你定的」第 4 条，在「每批的流程」第 3 条「证明深度」那一项补：「`full` 的小节，主线定理在讲解里证完；没标定理、后文只引用结论的旁支结论，可以把证明放进难题，讲解里注明『证明见 pN』（批次 3 审查时定的）。」

## 没验证的地方

- 内置浏览器的面板没显示，动画收不到帧：6 个动画只确认了画布已经挂上、滑块的范围和初值和内容文件一致，动画运动、拖滑块后的画面都没看到；`euler-equations` 相图里椭圆伸出画面、`charged-particle-lagrangian` 的圈碰到右边，是按数值算的。动画的说明是否和真实画面一致，要你在 Chrome 里看一眼。
- `angular-momentum-sphere.svg` 只核了每条曲线的能量，曲线上箭头的方向没核；`standard-map.svg` 只核了每个点都在映射的轨道上，说明里「大岛」「细带」这些画面上的描述没逐一看。
- 没有截图核对亮色、暗色主题；SVG 都用 `currentColor` 和页面变量写颜色。
- 题目卡片的作答、提示、术语浮窗没有在页面上操作。
- `npm run verify` 里数学分析批次 3 的脚本是另一个审查会话写的，只确认了它们能跑通、和标准答案一致，没有审查。

## 修订说明（写内容会话）

2026-11-09。只改了 `content/physics/analytical-mechanics/`：本批 8 节、`_domain.yaml` 的两条术语简介，以及按安排修的批次 1 `cyclic-coordinates`。改完：`npm run content` 0 个错误、0 个警告（含 5dfc91b 新加的公式检查）；`npm test` 20 个文件 178 个测试通过；写内容时的数值自查 197 项一致（新说法都补了验算，见下）；`npm run build` 后用 test-serve 打开 9 节，KaTeX 0 个错误，新加的锚点都显示成定义卡片。`progress/` 里没有分析力学的做题记录，改题面不需要迁移；没有改题号、标准答案和选项。

**重要 1 · `hamiltonian-chaos` 例 1**（照建议改，没换例子）

- 「为什么想到这么做」不再说「KAM 定理告诉我们」，改成：这个例子两个频率都是 $1$、和作用量变量无关，不满足 KAM 定理的不退化条件，要另找近似的守恒量。
- 推导第一段：$\varepsilon=0$ 时第二个振子转一圈回到截面，第一个也正好转一圈，所以庞加莱映射是恒等映射，每条轨道在截面上只留下一个点；并说明这正是 KAM 定理排除的退化情形（频率和作用量变量无关，$\vb{k}=(1,-1)$ 使每个环面都共振）。原来「所有这些圆就是截面上的不变曲线」一句删掉。
- 推导第二段：$\varepsilon$ 很小时把 $q_1^2q_2^2$ 对两个振子共同的快转动取平均，$\langle q_1^2q_2^2\rangle$ 只依赖两个振子的能量和相位差，近似守恒，截面上的点沿它的等值线慢慢走、排成闭合曲线。分界线写明是这些等值线里穿过鞍点的那一条，鞍点对应两个振子能量相等、相位差四分之一周期的周期运动；$\varepsilon$ 变大时混沌最先在它附近出现。末尾注明严格论证要对平均以后的系统再用 KAM 定理，这里不展开。
- 数值核对：$\varepsilon=0.01$、总能量 $1$ 时，截面上 $I_1I_2(1+\frac12\cos2(\theta_1-\theta_2))$ 的变化约为它本身的 1%，而 $E_1$ 变化 $0.7$；$\varepsilon=0.8$ 时从鞍点附近出发的轨道李雅普诺夫指数约 $0.13$，中心附近约 $0$。
- 1c 的符号同时改正：$\pb{E_1}{H}=\varepsilon\pb{E_1}{q_1^2q_2^2}=-2\varepsilon q_1p_1q_2^2$（数值核过 $\dot E_1$）。

**重要 2 · 讲解写出了 p3 的答案**

- `hamiltonian-chaos` 改成「$(\pi,0)$ 在 $K$ 较小时是椭圆的，$K$ 超过某个值以后变成双曲的（p3）」，「它们对应摆的倒立位置和最低位置」保留。这句挪到了新加的椭圆、双曲不动点定义（见 2c）的「为什么这样定义」段末尾。
- 同类在 8 节里查了一遍：修订前讲解、例题、几何图像、常见误区里提到题号的地方共 12 处，只有这一处是简单题、中等题，其余都是 p5–p8；这次新加的 3 处（小振动的 p7、刚体运动学的 p8、混沌的 p5）也都是难题、思考题。另外找到一处没写题号、但讲解正好写出了简单题一个选项答案的：`rigid-body-kinematics` 讲解举的镜像例子 $\operatorname{diag}(1,1,-1)$ 就是 p2 的选项 B，改用「把每个矢量反向的 $-I$」。

**小问题 1**

- 1a `small-oscillations` `:31`：改成「$V$ 的黑塞矩阵正定时平衡稳定，附近是小振动；有负的特征值时不稳定；只是半正定时要看更高阶的项（p7）」。`:111` 照建议没改。
- 1b `hamiltonian-chaos` `:34`：改成「运动有界、又不在分界线上时，相轨道是闭合曲线」，边界情况补「可积系统的运动不一定有界，自由粒子、越过势垒跑走的粒子都可积，轨道却不在环面上」。术语简介：可积系统改成「……；运动有界时轨道在不变环面上」，不变环面改成「可积系统中运动有界时，作用量变量取定值的集合是 $n$ 维环面……」。同类：不变环面的定义段改成「定理里的环面，也就是……」，接上定理的有界前提；庞加莱截面的「为什么」段也补了「运动有界时」。
- 1c：见重要 1。
- 1d `hamiltonian-chaos` 例 2：题目改成「从双曲不动点 $(0,0)$ 附近（混沌区里）出发的点」，推导里随机游走的是混沌区里的点，并补「$(\pi,0)$ 周围的岛还在，从岛里出发的点不会跑远」。数值：$K=1.5$，从 $(0.02,0)$ 出发迭代 $10^5$ 次，$p$ 跑到 $[-41,66]$；从 $(\pi+0.3,0)$ 出发，$|p|<0.5$。
- 1e `field-lagrangian`：能流改记 $j$（讲解的定理、能流的解释、例 2、常见误区，p6 题干、提示 3、参考解答），作用量仍记 $S$。

**小问题 2**

- 2a：「主轴」按「惯量主轴」的简称标记，标在 `inertia-tensor` 的几何图像、例 2，`euler-equations` 的自由刚体的两个守恒量、绕主轴转动的稳定性、自由对称陀螺、几何图像、例 1 这些块里第一次出现的地方；`rigid-body-kinematics` `:16` 的「角速度」也标上了。我的术语自查脚本加上这两个简称后，8 节没有漏标的（剩下的提示都在「见……」的小节标题链接里）。
- 2b：报告列的全部补上，人名补了拉斯卡尔（J. Laskar）、维斯德姆（J. Wisdom），和 `euler-equations` 的写法一致；同一节 KAM 定理证明思路里的科尔莫戈罗夫、阿诺德、莫泽也补了原文。然后按每节讲解在前、题目在后的顺序把 8 节逐个通读，另外补了：
  - `small-oscillations`：双摆、耦合振子、单摆、角频率、简谐运动、平衡位置、对称矩阵、列向量、特征值、半正定、对角矩阵、行列式、正交变换、简谐振子、劲度系数、回复力、质心、单位矩阵；p5 子空间、二次型，p8 球面摆、特征向量、特征子空间、量子力学。
  - `rigid-body-kinematics`：质心（挪到第一次出现的「问题」一节）、右手系、对称矩阵、右手法则、极角、极坐标、半顶角、接触线、对称轴；p5 齐次方程组、线性无关、线性变换，p6 速度场、接触点，p8 阿波罗。
  - `inertia-tensor`：对称矩阵、实对称矩阵、右手系、对角矩阵、极值、体对角线、单位矩阵；p3 面对角线，p8 梯度。
  - `euler-equations`：力矩、角动量（挪到第一次出现的「问题」一节）、一阶方程组、守恒量、椭球面、角频率、镜面对称、三重积分；p7 阻尼装置。
  - `heavy-symmetric-top`：对称轴、角动量、力矩、支点、角频率、陀螺仪（挪到第一次出现处）；p5 简谐运动、平衡位置，p6 节线。
  - `field-lagrangian`：弦、小球链、张力、线密度、偏导数、格林公式、波长、驻值、分部积分、基本引理、能量密度、连续性方程、横向振动、劲度系数、弹性基底、回复力（例 1 题干原来写「恢复力」，统一成「回复力」）、简正频率、波速、偏微分方程、驻波、波节、波腹；p3 角频率，p5 梁、抗弯刚度、夹紧、色散，p6 全导数，p7 声子、波数、比热，p8 电磁波、量子场论。
  - `charged-particle-lagrangian`：梯度、电磁势、直角坐标、保守力、自由粒子、量子力学、薛定谔方程、磁矩、全导数、偏导数、漂移、回旋、角频率、柱坐标、守恒定律、动量算符；p7 螺线管、磁通量、波函数、干涉条纹、规范不变，p8 耗散函数。
  - `hamiltonian-chaos`：双摆、三体问题、吸引子、耗散系统、守恒量、梯度、回路、分界线、振子、自由粒子、势垒、能量面、稠密、混沌海、岛、冲击、共振、扰动、雅可比矩阵、行列式、不动点、特征值、迹、线性化、傅里叶系数、牛顿迭代、岛链、混沌层、鞍点、恒等映射、等值线、随机游走、冷原子、量子力学；p5 抽屉原理，p6 雅可比行列式，p7 开普勒运动、李雅普诺夫时间，p8 小行星带、偏心率。
  - 质点、势能、周期、频率、矩阵、坐标轴这类最基本的词没有括注。
- 2c：`hamiltonian-chaos` 加了 `def-quasi-periodic`、`def-elliptic-hyperbolic`、`def-arnold-diffusion` 三个锚点，各配「为什么这样定义」和边界情况；「李雅普诺夫指数」原来也是在讲解里起名，另加 `def-lyapunov-exponent`。
- 2c 同类（按协调会话定的规矩：讲解里「叫作……」「这就是……」起名的段落都加锚点）：用脚本把 8 节讲解里这类句子全列出来逐条看了。
  - `rigid-body-kinematics`：原来欧拉角「为什么」段给「奇点」起名的半句删掉，和万向节锁合成一段，加 `def-gimbal-lock`，配「为什么」和边界情况（换一组欧拉角，奇点就成了普通的点，p8）。
  - `charged-particle-lagrangian`：机械动量和最小耦合拆成一段，加 `def-minimal-coupling`，补「为什么这样定义」和边界情况（粒子本身有磁矩时要另加一项）。
  - 不是新概念的两处改成不起名的写法：`charged-particle-lagrangian` 的规范变换（前置「电磁势与规范变换」定义过）改成括注；`inertia-tensor` 的平行轴定理改成「得到的正是……里的平行轴定理」。

**批次 1 的 `cyclic-coordinates/equal-areas.svg`**

- 说明文字里的 $r^2\dot\varphi$ 改成 `r² dφ/dt`，不再用组合附加符，注释同步。`cyclic-coordinates/lesson.md` 的 status 按「每批的流程」第 6 条退回 `written`。
- 扫了本领域所有 SVG：显示出来的文字里已经没有组合附加符（`legendre-tangent.svg`、`nutation-loci.svg` 只在注释里有）。

**其他**

- `euler-equations` p3 提示 1 的「线性近似」改成「线性化以后的形式」：「线性近似」是数学分析术语表里的词，意思不完全一样。
- `euler-equations` p8 的「每隔几秒就翻一次面」改成「过一会儿就翻一次面」，因为报告说这个说法只找到二手来源。
- 「我替你定的」第 4 条（`inertia-tensor` 的 $n$ 次对称轴证明放在 p6）没有动，等协调会话或用户定。

## 复核

审内容 agent · 2026-11-09

本批 7 节和批次 1 的 `cyclic-coordinates` 通过，文件头的 `status` 已改成 `reviewed`（只改了这一行）。`hamiltonian-chaos` 的修订都对，但还差 3 处术语标记：1 处是这次新写的句子，2 处是按新定的简称规矩算的。见下面「没过的」，这一节暂不标。

**怎么复核的**：

- 找出全部改动：审查时浏览器缓存里还有当时的内容包（`physics.analytical-mechanics.json?v=77a5f7fa33`，里面还是原来那句「$(\pi,0)$ 在 $0<K<4$ 时是椭圆的（p3）」）。和现在的内容包（22:45 构建，晚于最后一次改内容）逐段比对，比了两遍：一遍按原文，一遍去掉英文括注只看实质改动。题目比了题号、难度档、标准答案、容差、选项个数、题干、提示和解答；参考解答不在内容包里，对照审查时导出的原文看。
- 改动正好是修订说明列的那些，没有说明之外的改动。改过的是 8 节的 `lesson.md` 和 `problems.yaml`、`_domain.yaml` 的两条术语简介、`cyclic-coordinates` 的 SVG 和 `status`；本批 8 张 SVG 没动。分析力学别的 14 节、宏都没变。题号、难度档、标准答案、容差、选项都没变，验算脚本不用改。
- 跑过的命令：`npm run content`（0 个错误、0 个警告）；9 个小节的验算脚本单独跑，36 题全部一致；`npm run verify`（42 个小节全部一致）。页面：用写内容会话 22:45 的构建开 `test-serve`（查完已停掉）。9 页都没有 KaTeX 错误，新加的 6 个锚点都显示成定义卡片；`cyclic-coordinates` 的图上显示「r² dφ/dt =pφ / m 不变」。

**逐条结果**：

| 条目 | 小节 | 结果 |
| --- | --- | --- |
| 重要 1 | `hamiltonian-chaos` | 通过。「为什么想到这么做」改成先说不满足不退化条件；推导第一段写成「庞加莱映射是恒等映射」，对：两个频率都是 $1$，第二个振子转一圈回到截面时第一个也正好转一圈。第二段按平均讲，我另外推过：$\langle q_1^2q_2^2\rangle=I_1I_2\bigl(1+\frac12\cos2(\theta_1-\theta_2)\bigr)$，固定 $I_1+I_2$ 以后，$I_1=I_2$、相位差 $\frac\pi2$ 处是鞍点，相位差 $0$ 处是中心，所以「鞍点对应两个振子能量相等、相位差四分之一周期」对；分界线、「对平均以后的系统再用 KAM 定理」也对。 |
| 重要 2 | `hamiltonian-chaos` | 通过。改成「$K$ 超过某个值以后变成双曲的（p3）」，挪进新加的椭圆、双曲不动点那一节的「为什么」段末尾。同类另改的 `rigid-body-kinematics:30` 也对：原来的 $\operatorname{diag}(1,1,-1)$ 正是 p2 的选项 B，换成 $-I$（$\det(-I)=-1$，正交、把右手变成左手）。 |
| 小问题 1a | `small-oscillations` | 通过。`:31` 改成正定时稳定、有负特征值时不稳定、半正定时看高阶项（p7），这一段 4 句。 |
| 小问题 1b | `hamiltonian-chaos`、`_domain.yaml` | 通过。`:34` 加了「运动有界、又不在分界线上时」，补了自由粒子、越过势垒的反例；可积系统和不变环面两条简介、不变环面的定义段、庞加莱截面的「为什么」段都接上了有界的前提。 |
| 小问题 1c | `hamiltonian-chaos` | 通过。$\pb{E_1}{H}=\varepsilon\pb{E_1}{q_1^2q_2^2}=-2\varepsilon q_1p_1q_2^2$，符号对。 |
| 小问题 1d | `hamiltonian-chaos` | 通过。例 2 题目改成从 $(0,0)$ 附近（混沌区里）出发，推导补了「$(\pi,0)$ 周围的岛还在」。和我审查时的数值一致：从岛里出发 $\lvert p\rvert$ 跑不远。 |
| 小问题 1e | `field-lagrangian` | 通过。能流在讲解的定理、解释、例 2、常见误区，以及 p6 题干、提示 3、参考解答里都改成 $j$，作用量仍是 $S$，没有漏改的。 |
| 小问题 2a | `inertia-tensor`、`euler-equations`、`rigid-body-kinematics` | 通过。报告列的 7 处「主轴」都标成 `principal-axes`，`rigid-body-kinematics:16` 的「角速度」也标了。脚本重查 8 节，没有漏标的「主轴」「角速度」。 |
| 小问题 2b | 7 节 | 通过。报告列的都补上了；同类另补的 100 多处英文括注逐个看过，都对。拉斯卡尔、维斯德姆、科尔莫戈罗夫、阿诺德、莫泽都补了原文。 |
| 小问题 2c | `hamiltonian-chaos` | 通过。`def-quasi-periodic`、`def-elliptic-hyperbolic`、`def-arnold-diffusion` 三个锚点，外加 `def-lyapunov-exponent`，各有「为什么」和边界情况，内容核过：迹为 $\pm2$ 时线性化判断不了；$n\ge3$ 时 $n$ 维环面隔不开 $2n-1$ 维的能量面；阿诺德 1964 年的例子；李雅普诺夫指数的定义和 $\frac1\lambda$ 次迭代放大 $e$ 倍。 |
| 小问题 2c 同类 | `rigid-body-kinematics`、`charged-particle-lagrangian`、`inertia-tensor` | 通过。新加的 `def-gimbal-lock`（奇点和万向节锁合成一段）、`def-minimal-coupling`（机械动量、最小耦合，磁矩那条边界情况也对）都对。规范变换改成括注，平行轴定理改成「得到的正是……」，这两处不是新概念，不加锚点合适。 |
| 其他 | `euler-equations` | 通过。p3 提示 1 改成「线性化以后的形式」，p8 改成「过一会儿就翻一次面」。 |
| 批次 1 的那张图 | `cyclic-coordinates` | 通过。`equal-areas.svg:23` 显示的文字改成 `r² dφ/dt`，整个领域的 SVG 里，组合附加符只剩注释里有（`legendre-tangent.svg`、`nutation-loci.svg`），不显示。 |

**按这次写进方案的规矩复查 8 节**：

- 起名的段落要加锚点：8 节讲解里「叫作」「这就是」的句子逐条看过，凡是给新概念起名的段落都有锚点。例题里的「规则进动」「空间锥、本体锥」「钱德勒摆动」，以及几何图像说明里指回已定义概念的「这就是……」，我按批次 2 的做法不算（规矩写在「讲解」那一条下）。
- 讲解、例题、几何图像的说明和常见误区里不写出简单题、中等题的答案：8 节里提到题号的地方只剩上面改过的那处 p3（没写答案），其余都是 p5–p8；各题的数值答案也查过，正文里没有出现。
- 简称按同一个术语 id 标记：「主轴」「角速度」都标了；「陀螺」在这几节里指一般的陀螺，不是「对称陀螺」的简称，不标合适。「环面」见下。

**没过的：`hamiltonian-chaos` 还差 3 处术语标记**（都在各自那一块里第一次出现、块里前面也没标过）：

- `lesson.md:109`（例 1「为什么想到这么做」，这次新写的）：「和作用量变量无关」的「作用量变量」没标，标成 `action-variable`。
- `lesson.md:111`（例 1 推导，这次新写的）：「使每个环面都满足 $\vb{k}\cdot\omega=0$」，这里的环面指不变环面。按新定的规矩，它是「不变环面」的简称，标成 `invariant-torus`。
- `lesson.md:101`（几何图像，原来就有）：「被破坏的共振环面留下的岛链」，同上，标成 `invariant-torus`。审查时我把「环面」整个排除在简称之外（「我替你定的」第 3 条），所以当时没报。新规矩只排除几何形状本身的「环面」，这一处就要标了。

这 3 处改完，这一节就可以标 `reviewed`。

**复核时看出的，不挡 `reviewed`**：

- `cyclic-coordinates/equal-areas.svg:23`：等号后面少了一个空格（`d<tspan>t</tspan> =<tspan>p</tspan>`），页面上显示成「dφ/dt =pφ」，原来等号两边都有空格。只是排版，改不改都行；要改的话，按规矩把这一节退回 `written`。

## 修订说明（第二轮，写内容会话）

2026-11-09。只改了 `hamiltonian-chaos/lesson.md` 的 3 处术语标记、`cyclic-coordinates/equal-areas.svg` 的一个空格、`cyclic-coordinates/lesson.md` 的 status。

- `hamiltonian-chaos` 的 3 处术语标记，照复核意见补上：
  - `:101`（几何图像）「被破坏的共振环面」：「环面」标成 `invariant-torus`。
  - `:109`（例 1「为什么想到这么做」）「和作用量变量无关」：标成 `action-variable`。
  - `:111`（例 1 推导）「使每个环面都满足」：「环面」标成 `invariant-torus`。
- 同类查了一遍：用脚本按块列出「环面」「作用量变量」「角变量」第一次出现的位置。每一块第一次出现、指不变环面的「环面」，现在都标了（标成「不变环面」或「环面」）。
  - 唯一没标的是 `:27` 刘维尔-阿诺德定理里「它就是一个 $n$ 维环面（torus）」，那里说的是几何形状本身，按新规矩不算简称。
  - 别的 7 节都没有用到「环面」。
  - 题目文字里的术语标记，方案写的是「也可以标」，没有补。
- `cyclic-coordinates/equal-areas.svg:23`：等号后面补回空格，页面上显示成「r² dφ/dt = pφ / m 不变」。原因是上一轮用编辑工具替换时，新串末尾的空格被去掉了，这次把空格放在串的中间。`cyclic-coordinates/lesson.md` 的 status 按「每批的流程」第 6 条退回 `written`。
- 改完：
  - `npm run content` 0 个错误、0 个警告。
  - `npm run build` 后用 test-serve 看了两页：3 处新标记都显示成术语（带下划线、可弹浮窗），没有 KaTeX 错误，两节都显示「未审」。
  - 只改了标记和一个空格，题目、答案都没动，没有重跑验算。

## 复核（第二轮）

审内容 agent · 2026-11-09

`hamiltonian-chaos`、`cyclic-coordinates` 两节通过，文件头的 `status` 已改成 `reviewed`（只改了这一行）。本批 8 节和 `cyclic-coordinates` 现在都是 `reviewed`。

**怎么复核的**：

- 找改动：拿第一轮复核时浏览器缓存里的内容包（`physics.analytical-mechanics.json?v=cdc1e622ec`，22:45 构建）和现在的内容包（23:07 构建，晚于这次改内容）逐段比对，再对照已提交版本看 `cyclic-coordinates` 的 `git diff`。
- 结果：只改了修订说明列的那几处，没有说明之外的改动。`hamiltonian-chaos` 正文改了 3 处，都是加标记；`cyclic-coordinates` 的 SVG 多了 1 个字符。两节的题目、分析力学别的 21 节、术语表、宏都没变。
- 跑过的命令：`npm run content`（0 个错误、0 个警告）；两节的验算脚本 8 题都一致。页面上用 test-serve 看了两页（查完已停掉），都没有 KaTeX 错误。

**逐条结果**：

| 条目 | 结果 |
| --- | --- |
| `hamiltonian-chaos:101`（几何图像）「被破坏的共振环面」 | 通过。「环面」标成 `invariant-torus`，页面上显示成术语。 |
| `hamiltonian-chaos:109`（例 1）「和作用量变量无关」 | 通过。标成 `action-variable`。 |
| `hamiltonian-chaos:111`（例 1 推导）「使每个环面都满足」 | 通过。标成 `invariant-torus`。 |
| 同类（「环面」「作用量变量」） | 通过。脚本按块重查，每一块里第一次出现、指不变环面的「环面」都标了；`:27` 定理里的「$n$ 维环面（torus）」指几何形状本身，不标合适。术语检查脚本剩下的提示都是链接里的小节标题和图片说明，不是漏标。 |
| `cyclic-coordinates/equal-areas.svg:23` 等号后的空格 | 通过。等号两边都有空格了，页面上显示「r² dφ/dt = pφ / m 不变」。和已提交版本比，只改了这一行和注释里的写法。 |

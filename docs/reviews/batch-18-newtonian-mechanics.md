# 批次 18 审查报告：牛顿力学（运动学、牛顿定律与常见的力 10 节）

审内容会话，2026-11-16 开审，11-17 续完。范围：`kinematics-1d`、`kinematics-vectors`、`circular-motion`、`relative-motion`、`newtons-laws`、`angular-momentum`、`common-forces`、`circular-dynamics`、`free-body-diagrams`、`friction`（这一批从 `common-forces` 拆出来的），以及 `_domain.yaml`（47 条术语）。

## 结论

重要 2 条，小问题 3 类（同类合并，共 13 处），没有原有问题。物理和答案没有发现错误。

- 简单题、中等题 40 道全部独立验算，和标准答案一致。难题、思考题 40 道的参考解答逐题看过，没有发现错误。
- **重要 1**：加速度的定义和运动方程用二阶导数的记号 $\frac{\dd^2x}{\dd t^2}$，可 `math.calculus.higher-derivatives` 不在 10 节任何一节的链上。
- **重要 2**：`free-body-diagrams` 受力图的右半边，加速下落的 B 受的拉力和重力画得一样长，正是本节常见误区第一条反驳的说法；图注说两个拉力一样大，两段 T 却一长一短。
- 小问题：① 写了「上一节」「下一节」「前几节」；② 和相关小节、术语的衔接（力偶、角动量守恒、两处英文括注、一处链接文字）；③ 页面显示（一个行内长式子把 768 px 的页面撑宽，两个动画的滑块最小端看不清）。
- 篇幅：`minutes` 24–30，没有超过 30 的。
- 拆分：`friction` 之前的 9 节，推理、例题、题目都没用到摩擦力，只在 `common-forces:44`、`circular-dynamics:55` 链接过去。`friction` 的前置 `[free-body-diagrams, circular-dynamics]`、层级 14 都对：例 2（`:83`）是水平弯道上静摩擦力提供向心力，第 6 题是倾斜弯道。

| 小节 | 重要 | 小问题 |
| --- | --- | --- |
| kinematics-1d 直线运动 | 1（记号从这里开始，修在这里） | 动画范围 1 |
| kinematics-vectors 平面运动与抛体 | 0 | 动画范围 1 |
| circular-motion 圆周运动 | 0（第 5、8 题的 $\ddot r$、$\ddot x$ 随重要 1 解决） | 0 |
| relative-motion 参考系与相对运动 | 0 | 措辞 3（其中参考解答 1） |
| newtons-laws 牛顿运动定律 | 0（运动方程随重要 1 解决） | 措辞 1 |
| angular-momentum 力矩与角动量 | 0 | 力偶 1；术语标记 1；英文括注 1；长式子 1 |
| common-forces 常见的力 | 0（图里小球的 T 长 4 px，随重要 2 改） | 措辞 1；链接文字 1（参考解答） |
| circular-dynamics 圆周运动的动力学 | 0 | 英文括注 1 |
| free-body-diagrams 受力分析与连接体 | 1 | 0 |
| friction 摩擦力 | 0 | 0 |

## 怎么审的

- 快照：开审时（11-16 01:30）把 10 节目录和 `_domain.yaml` 拷到 scratchpad 的 `snap18/`，另存了 `git diff HEAD`（29 个文件）。11-17 续审开始时、写报告前各比了一次，都是 0 差异。复核时和它比。
- 简单题、中等题：只用 `npm run statements` 读题，写了 10 个脚本 `tools/verify/physics.newtonian-mechanics.<id>.ts`。公用的放在 `physics.newtonian-mechanics._nm.ts`：复用电磁学 `_es.ts` 的龙格-库塔、二分、线性方程组，加了平面运动、一维运动的状态函数和数值求导。再跑 `npm run verify` 比对（见下一节）。
- 公式：10 节的正文、题目（含参考解答，构建不渲染）、47 条术语的简介，共 1922 个公式逐个交给 `compileTex`、`suspectTex`，0 个问题。
- 链接、锚点、前置：脚本查了所有 `lesson:` 链接和锚点、术语的 `definedIn` 和锚点、前置是否多余、层级。层级（网站上从 0 数）8–14；前置没有多余的。
- 术语：脚本按块（H2/H3）找所有领域术语表里的词（最长匹配优先），查每块第一次出现标了没有、每节第一次括注英文没有，再人工排除基础词。
- 记号：`kinematics-1d` 和单变量微积分 `antiderivatives`（written）对照。
- SVG：7 张图用 headless Edge 渲染（深浅两种配色看过截图），量 `getBBox` 查出界、相叠、碰线，0 处；没有脚本、事件属性、外部引用。箭头方向、长短和讲解里的关系逐张核对，例如：
  - `conical.svg` 的 $T\cos\theta=G$、$T\sin\theta=F_{\mathrm n}$，倾斜弯道的 $N\cos\theta=G$，都准到 0.1 px；
  - `torque.svg` 两块扇形的面积 3012、3004，力心正好在椭圆的焦点上；
  - `newton.svg` 的 $a_1=2a_2$、$N'$ 和 $N$ 一样长。
- 页面：`dist/` 11-16 15:48 构建，之后内容没改，直接用它起了进度写临时目录的服务（端口 3151）。768 px 下 10 节全部展开提示和解答：
  - 定义卡片数等于锚点数（10 节共 37 张），没有 KaTeX 错误；
  - `angular-momentum` 横向溢出 28 px（小问题 3），其余 9 节没有；
  - 三个动画在页面上拖到滑块两端截图看过（小问题 3）。
- 跑过的命令：`npm run content`（0 错误，0 警告）、10 个脚本各自单独跑、`npm run verify`（283 节全部一致，其中牛顿力学 40 题）。
- `progress/`：我的服务只写了临时目录。`progress/lessons.yaml` 和开审时的校验和不同，那是 11-16 15:54 网站写入的数学几节学习记录，在我 11-17 起服务之前，不是这次审查写的；页面检查前后它没变。

## 简单题、中等题的验算

每题两套算法，脚本里写明了用的例子；提示和解答末尾的数也和标准答案对过，都一致。

| 小节 | p1 | p2 | p3 | p4 | 第二套算法 |
| --- | --- | --- | --- | --- | --- |
| kinematics-1d | −6 | B、E | 52 | 47/27 | 对 x(t) 数值求导、二分出速度的零点；加速度交给龙格-库塔法积分，在「停下」处二分 |
| kinematics-vectors | 1.5152 | A、C | 8.3316 | 1.1783 | 龙格-库塔法积分平面运动，在落地、落到斜坡上、到达篮筐处二分；p3 再在出手速率上二分 |
| circular-motion | 3158.27 | C、E | 0.70711 | 120.964 | 位置 r(cos θ(t), sin θ(t)) 数值求导两次，直接量大小和夹角；p3 在时间上二分 45° 的时刻 |
| relative-motion | 12 | A、B、D | 14.142 | 120 | 地面参考系里逐步算两个物体的位置再相减；船头方向扫描、黄金分割找最小漂移 |
| newtons-laws | 3.3333 | C、E | 2.25 | 1.72133 | 力交给龙格-库塔法积分，从位移反推加速度，在掉头处二分 |
| angular-momentum | 9 | C、E | 1.0 | 14.142 | 按分量算叉积；p3 平方反比有心力积分彗星轨道，近日点积到远日点量速率；p4 用力乘力臂 |
| common-forces | 2.45 | B、E | 590 | 4.9 | 有阻尼的弹簧积分到静止量伸长；p3、p4 力（和力矩）平衡列线性方程组 |
| circular-dynamics | 7300 | A、B、E | 57.013 | 9.8995 | 水平、竖直两个方向列方程组，在未知的角度或速率上二分 |
| free-body-diagrams | 4.1417 | D、E | 23.52 | 9 | 受力在水平、竖直坐标轴（不沿斜面）上分解，各物体的方程联立 |
| friction | 60 | B、C、E | 3.4962 | 2.7283 | 推力每次加 1 N 和最大静摩擦力比；p3 方程组解 a、N；p4 龙格-库塔法积分到速度为零 |

## 重要 1 · 二阶导数的记号不在前置链上

- 位置：
  - `kinematics-1d/lesson.md:37` 加速度的定义：$a(t)=\dv vt=\frac{\dd^2x}{\dd t^2}$；
  - `newtons-laws/lesson.md:61` 运动方程 $m\frac{\dd^2\vb r}{\dd t^2}=\vb F\bigl(\vb r,\dv{\vb r}t,t\bigr)$（定义段），`:77` 例题，`newtons-laws/problems.yaml:83` 第 4 题的提示；
  - `circular-motion/problems.yaml:95`–`:110`（第 5 题，$\ddot r$、$\ddot\theta$）、`:166`–`:172`（第 8 题，$\ddot x$）；
  - `_domain.yaml:219` 运动方程的简介（浮窗）。
- 问题：$\frac{\dd^2x}{\dd t^2}$、$\ddot x$ 是二阶导数的记号，讲它的是 `math.calculus.higher-derivatives`（这一批刚写，written）。从 `dist/data/graph.json` 算 10 节的链，都不含它：`kinematics-1d` 的链经 `antiderivatives`、`mean-value-theorem` 下去，不经过它。正文也没有解释这个记号，第一次出现就在加速度的定义里。
- 先例：plan.md:684，常微分方程 `second-order-linear` 因为「主线是二阶导数」加了这个前置；plan.md:1192 也记着它以 `higher-derivatives` 为前置。
- 建议：`kinematics-1d` 的 `prerequisites` 加 `math.calculus.higher-derivatives`。层级不变：它是 6，`antiderivatives` 是 7。另外 9 节都经过 `kinematics-1d`，一并解决。
  - 也可以只在 `:37` 就地说明「$\frac{\dd^2x}{\dd t^2}$ 表示对 $t$ 求两次导数」，但运动方程是这个领域以后各节的主线，我推荐加前置。
  - 顺带：`circular-motion` 第 8 题的提示（`:166`）、解答用 $\dot x$、$\ddot x$，这一题自己没说明点记号（第 5 题题干说明了，读者不一定先做第 5 题）。照第 5 题说明一句，或者写成 $\dv xt$、$\frac{\dd^2x}{\dd t^2}$。

## 重要 2 · `fbd.svg` 右图的箭头长短画出了常见误区

- 位置：`free-body-diagrams/fbd.svg:33`–`:46`（右图的五个箭头），图注 `lesson.md:40`、`:42`；常见误区 `lesson.md:64`；例 2 `lesson.md:54`–`:60`。
- 问题：右图是光滑桌面上的 A 跨过滑轮连着挂着的 B，系统一定在加速。量 SVG 坐标（箭头长度算到箭尖）：
  - B：拉力 T 36、重力 $G_B$ 36，一样长。B 加速下落，T 一定比 $G_B$ 小（例 2：7.35 N 对 9.8 N）。`:64` 常见误区第一条反驳的正是「悬挂的物体加速下落时，绳子的拉力等于它的重力」。
  - 两段拉力：A 上的 T 46，B 上的 T 36。图注 `:42` 和 alt 都说「两个拉力一样大」。
  - A：支持力 N 50、重力 $G_A$ 62。A 竖直方向没有加速度，两者相等。
  - 同一张图的左半边是按比例画的：G 58，两个虚线分量 29.0、50.2，N 50.2，正好是 $G\sin30^\circ$、$G\cos30^\circ$。领域里别的力图（`conical.svg`、`forces.svg` 的书）也按比例，读者会把右图也当成按比例。
- 建议：右图按例 2 的数（$m_A=3.0\,\mathrm{kg}$、$m_B=1.0\,\mathrm{kg}$）取一个比例，例如每牛顿 2.5 px：N 和 $G_A$ 约 74，两段 T 约 18，$G_B$ 约 25（都算到箭尖）。不按例 2 也行，至少让 N 和 $G_A$ 一样长、两段 T 一样长、$G_B$ 比 T 长。
- 同类顺手改（差得少，单看不报）：
  - 左图的拉力 T（`fbd.svg:18`–`:19`）算到箭尖是 35，比 `lesson.md:42`「木块静止时 $T=G\sin\theta$」的 29 长 6 px：改成 29（线段 22 加箭尖 7）。
  - `common-forces/forces.svg:27`–`:28` 挂着的小球，T 算到箭尖 60、G 56，静止时应相等：T 的箭尖从 y = 94 挪到 98，线段终点从 101 挪到 105。

## 小问题 1 · 写了「上一节」「下一节」「前几节」（5 处）

知识图谱里一节的「上一节」随读者走的路线变，要写出小节名并链接。这一批有两处按前置顺序就指错了：`newtons-laws` 后面紧跟的是 `angular-momentum`，讲各种力的是 `common-forces`；`common-forces` 前面紧挨着的也是 `angular-momentum`。

- `relative-motion/lesson.md:25`「前几节的位置和速度，其实都默认以……」：改成「[直线运动](…)、[平面运动与抛体](…)里的位置和速度……」。
- `relative-motion/lesson.md:36`「下一节讲牛顿定律时这一点最要紧」：改成「讲[牛顿运动定律](…)时……」。
- `newtons-laws/lesson.md:63`「（下一节讲各种力）」：改成「（[常见的力](…)讲各种力）」。
- `common-forces/lesson.md:16`「上一节说，力只由……」：改成「[牛顿运动定律](…)里说过，……」。
- `relative-motion/problems.yaml:150` 第 7 题参考解答「是下一节的问题」：改成「是[牛顿运动定律](…)的问题」。参考解答网页上不显示（plan.md:306），顺手改。

## 小问题 2 · 和相关小节、术语的衔接（5 处）

- **力偶**：`angular-momentum` 的讲解没讲力偶。
  - 电磁学 `magnetic-force-on-currents:48`（reviewed）写「力偶的力矩和对哪一点取无关（见[力矩与角动量](…)）」，链过来找不到这句话；`electric-dipole:64` 也用「力偶（couple）」。两节都以 `angular-momentum` 为前置。
  - 本节只有第 2 题 E（`angular-momentum/problems.yaml:37`）说了这件事，也没用「力偶」这个词。
  - 建议：在讲力矩的地方（`:23` 那一块之后）补一段，加锚点：等大反向、不在同一直线上的两个力叫力偶（couple），合力为零，力矩之和 $(\vb r_1-\vb r_2)\times\vb F$ 和参考点无关。补了以后第 2 题 E 就成了照搬讲解，要换成多想一步的说法，例如「合力为零的一组力，对不同参考点的力矩之和相同」（对：多出的一项是 $-\vb r_0\times\sum\vb F_i=0$）。
  - 「力偶」这样就有三节用到，按 plan.md:244 进术语表，定义在本节。电磁学两节在链上学过、第一次出现都括注了英文，不用改。
- **角动量守恒拆开标了**：`angular-momentum/lesson.md:66`「小球对小孔的:term[角动量]{…}守恒」。表里有「角动量守恒」（`conservation-of-angular-momentum`），按最长匹配整个词标它。
- **第一次出现没括注英文**（plan.md:242，没进表的名词也括注）：
  - `angular-momentum/lesson.md:42`「$O$叫作力心」：改成「力心（center of force）」；
  - `circular-dynamics/lesson.md:60` 常见误区的「离心力」：改成「离心力（centrifugal force）」。
- **链接文字和标题不一致**：`common-forces/problems.yaml:148` 第 7 题参考解答「[约束与自由度](lesson:physics.analytical-mechanics.constraints)」，那一节的标题是「约束与广义坐标」。

## 小问题 3 · 页面显示（3 处）

- **行内长式子撑宽页面**：`angular-momentum/problems.yaml:88` 第 4 题解答里的行内公式 $(2.0,-2.0,0)\times(0,0,5.0)=\bigl(\ldots\bigr)=(-10,-10,0)\,\mathrm{N\cdot m}$ 渲染宽 672 px。
  - 768 px 视口下解答框装不下，题目列表（网格）跟着变宽，整页横向多出 28 px。点「放弃，看解答」以后才出现。
  - 建议写成行间公式（行间公式自带横向滚动），或在第二个等号处拆成两句。
- **动画滑块最小端看不清**（plan.md:1535：滑块拖到两端时，要读者看的线、点仍要出现在画面里）：
  - `kinematics-1d/lesson.md:71`，$v_0$ 最小 2：最高点 0.2 m，在纵轴 [−22, 22] 里是一条贴着横轴的线，讲解说的「位置到最高点时，速度正好穿过零」看不出来。建议最小取 8（最高点 3.3 m，用时 1.6 s），和最大的 20 比，高度仍差 6 倍多，平方关系照样看得出。
  - `kinematics-vectors/lesson.md:59`，$v_0$ 最小 5：射程最多 2.6 m、高度最多 1.2 m，在 [0, 70] × [0, 34] 里缩成原点旁的一小团，两条轨迹分不开。建议最小取 15（45° 时射程 23 m）。
  - 两处改了以后，默认值 14、20 仍在步长的格点上。
  - 最大端都在画面里：kinematics-1d $v_0=20$ 时最高 20.4 m；kinematics-vectors $v_0=25$ 时 45° 射程 63.8 m，取 15°、75° 时高的那条最高 29.8 m；friction 四个角（$\mu_{\mathrm s}$ 取 0.3、0.8，比值取 0.5、1）也都在画面里（两个截了图，两个按式子算）。

## 原有问题（不是这一批引入的）

无。

## 前置

- `circular-motion` 加的 `math.calculus.chain-rule` 有用处：`:34` 由 $\theta=\omega t$ 求速度用了链式法则（括注了英文）。层级不变。
- `friction` 见「结论」。拆出来以后 `common-forces` 的 goal 只剩重力、弹力、支持力和拉力，正文和题目都对得上。
- 二阶导数见重要 1。其余用到的数学（叉积 `math.linear-algebra.cross-product`、矢量 `math.linear-algebra.vectors`、原函数）都在链上。
- 链进来的已写小节：电磁学、狭义相对论、分析力学、线性代数里链到这一批的地方逐个看过，说法都接上了，力偶一处除外（小问题 2）。

## 记号与约定

- `kinematics-1d` 和 `antiderivatives` 一致：原函数写 $\int f(x)\,\dd x=F(x)+C$，`:46` 链到 `antiderivatives`，「原函数只差常数」由那一节引 `mean-value-theorem` 的定理。
- 矢量用粗体，导数用 $\dv{}{t}$。点记号 $\dot r$、$\ddot x$ 只在 `circular-motion` 第 5、8 题出现，第 5 题题干说明了「用点表示对时间求导」。
- 动画横轴写作 $x$，讲解说明「横轴是时间 $t$，图上写作 $x$」，照组件惯例。
- 写代码的会话交代的几条都照做了：
  - 速度、加速度、力、质量、重力、弹力、摩擦力在本领域定义，进了表；
  - 「惯性系」在本领域定义（`newtons-laws`），不标狭义相对论的 id；
  - 「约束力」照规矩 C 标分析力学的 id（`common-forces:44`）。

## 我替你定的（都能改）

1. fbd 图定为重要：它是本节唯一的图，右半边画出了本节常见误区第一条反驳的说法；同一张图的左半边、领域里别的力图都按比例画，读者没理由不信右边的长短。
2. 二阶导数定为重要，照 plan.md:684 `second-order-linear` 的先例；推荐加前置，不推荐只就地解释。
3. 第 2 题（多选）的正确项偏 E：10 节里 8 节的答案含 E，3 节是「C、E」。不影响对错，没报；作者以后出题可以打散。
4. 「力心」「离心力」都只在一节出现，按 plan.md:242 只要求括注英文，不要求进表。
5. 参考解答网页上不显示，里面的「下一节」和链接文字照样列出，让作者顺手改。

## 要写回 plan.md 的

1. 静态图（plan.md:228「几何图像」或 SVG 的附录）补一条：受力图、矢量图的箭头长短按同一比例画，和讲解里的关系（相等、谁大）一致；做不到按比例时在图注里写「长短不按比例」（批次 18 审查时提的：`free-body-diagrams` 右图把加速下落的物体受的拉力画得和重力一样长）。
2. plan.md:1535 动画范围那一条补半句：画面范围固定时，滑块最小端的曲线也要看得清，不能缩成贴着坐标轴的一小团（批次 18：`kinematics-1d`、`kinematics-vectors` 的 $v_0$ 最小值）。
3. 公式写法补一条：一长串等式（三个以上等号、带括号的矢量）写成行间公式。行内公式不换行，768 px 下超过解答框宽度时整页横向滚动（批次 18：`angular-momentum` 第 4 题）。
4. 作者照重要 1 加了前置的话，plan.md:1192 `higher-derivatives` 那一条补「牛顿力学 `kinematics-1d` 以本节为前置（加速度 $\frac{\dd^2x}{\dd t^2}$）」。

## 没验证的地方

- 难题、思考题的数只抽算了带数值的部分；参考解答逐题读过。
- 深色配色只看了 SVG 截图，页面上没切换深色。
- 动画只截了滑块两端和几个组合：kinematics-1d 取 2、20；kinematics-vectors 取 25 × 45°、25 × 15°、5 × 75°；friction 取 0.3 × 0.5、0.8 × 1，另外两个角是按式子算的。中间值没逐个看。
- 页面只在 768 px 下看了，手机宽度没看。
- 「复制给 Claude」「录入批改结果」这些按钮没点。

## 修订说明

写内容会话，2026-11-17。重要 2 条都修了。小问题 3 类 13 处也都修了，只有第 4 题的长式子没照建议改成行间公式，改法和理由见小问题 3。同类问题在 10 节里又查出一些，逐条写在下面。10 节状态都还是 `written`。

### 重要 1 · 二阶导数的记号

- `kinematics-1d:7` 的 `prerequisites` 加了 `math.calculus.higher-derivatives`。`:37` 加速度定义里第一次出现 $\frac{\dd^2x}{\dd t^2}$ 的地方，补了「（也就是位置对时间的二阶导数，second derivative）」。
- 层级：用 `generated/graph.json` 全图重算，0 个小节的层级变了。`higher-derivatives` 是 6，`antiderivatives` 是 7，`kinematics-1d` 仍是 8。
- `circular-motion:7` 去掉了 `math.calculus.chain-rule`，现在只剩 `[physics.newtonian-mechanics.kinematics-vectors]`。
  - 原因：加了上面的前置以后，它经 `kinematics-1d` → `higher-derivatives` 已经在链上，留着构建会报多余前置。
  - `:34` 用到的链式法则仍在链上，括注没动。层级仍是 10。
- `circular-motion` 第 8 题题干（`problems.yaml:155`）照第 5 题补了一句：「用点表示对时间求导：$\dot x=\dv xt$，$\ddot x=\frac{\dd^2x}{\dd t^2}$。」

### 重要 2 · 受力图的箭头长短

下面的长度都算到箭尖。

- **`fbd.svg` 右图**：按例 2 的数重画，每牛顿 2.5 px：$N$、$G_A$ 都是 73.5，两段 $T$ 都是 18.4，$G_B$ 是 24.5。
- **`fbd.svg` 左图**：
  - 拉力 $T$ 改成 29.0，也就是 $G\sin30^\circ$，和沿斜面的虚线分量一样长。
  - 同类自查发现，绳子原来从木块连到斜面顶点，和斜面成 24°，并不平行于斜面；图注和替代文字都说是「平行于斜面的细绳」。现在改成平行于斜面，拴在斜面顶端竖起的桩上。
  - $T$ 画在绳子旁边 8 px，和右图的箭头一样不压在绳上。
- **图注和替代文字**：
  - 图注 `lesson.md:42` 补了两句：「$B$在加速下落，拉力比它受的重力小（例 2）」，以及「两个图里箭头的长短都和力的大小成正比，右图按例 2 的数画」（「力」按规矩标了术语）。
  - 替代文字 `:40` 和 SVG 里的注释，也补了各箭头的长短关系。
- **`forces.svg` 挂着的小球**：$T$ 改成 56，和 $G$ 一样长。
- **同类自查**：7 张图的箭头逐张量过。
  - `newton.svg` 右图原来推力 $F$ 68，$N$、$N'$ 各 42；例 2 是 8.0 N 对 6.0 N。$F$ 改成 56，每牛顿 7 px。左图 $a_1$ 64、$a_2$ 32，本来就对。
  - 下面几张不用改：
    - `circular.svg`：匀速时三处的 $v$ 都一样长，$a$ 也都一样长；加速时 $a$ 是 $a_t$、$a_n$ 的平行四边形对角线；
    - `galilean.svg`：两个矢量三角形都闭合；
    - `conical.svg`：审查量过；
    - `torque.svg`：没有同单位、要比长短的箭头。
- **文字框检查**：在页面里用 getBBox 量，沿图形每 1 px 采样。
  - fbd、forces、newton 三张都没有出界、相叠、碰线。
  - fbd 里文字离线最近 2.1 px，是左图的 θ，这次没动它。
  - B 旁的 $T$ 上移了 2 px，留出余量。

### 小问题 1 · 「上一节」「下一节」

- 报告列的 5 处都照建议改了：`relative-motion:25`、`:36`，`newtons-laws:63`，`common-forces:16`，以及 `relative-motion` 第 7 题（`problems.yaml:150`）。
- 同类自查：在 10 节的正文和题目里搜「上一节」「下一节」「前几节」「以后」「后面」「前面」「讲过」「再讲」，又改了 7 处，都写成小节名加链接。
  - 正文 2 处：
    - `kinematics-1d:51`「以后平面上的许多运动」改成「[平面运动与抛体](…)里的许多运动」；
    - `angular-momentum:79` 例 2 末尾改成「到[功与动能定理](…)再算」。
  - 参考解答 5 处（网页上不显示，顺手改）：
    - `angular-momentum` 第 7 题（`:152`）链到「质点系的角动量守恒」，第 8 题（`:176`）链到「开普勒定律与轨道方程」；
    - `newtons-laws` 第 8 题（`:169`）链到「平动加速参考系与惯性力」；
    - `kinematics-vectors` 第 8 题（`:174`）链到「与速度有关的阻力」；
    - `circular-motion` 第 8 题（`:174`）「要在讲了力以后才能说清楚」改成「要到[简谐运动](lesson:physics.oscillations-waves.simple-harmonic-motion)才能说清楚」。
  - 链到的都是已有的 `outline` 小节，链接文字就是它们的标题。
  - 剩下的「以后」「后面」都是时间或位置上的先后（「刹死以后」「画好受力图以后」「后面一段」），不是指别的小节。
- 链接文字：用脚本把 10 节全部 25 个 `lesson:` 链接的文字和目标小节的标题对了一遍。除了报告列的那一处，还有 `kinematics-1d` 第 2 题的提示（`problems.yaml:43`）写的是「[中值定理]」，改成了「[微分中值定理]」。

### 小问题 2 · 和相关小节、术语的衔接

- **力偶**：
  - `angular-momentum:27`–`:30` 在力矩那一块补了定义段，锚点 `def-couple`：「大小相等、方向相反、作用线不重合的两个力叫作力偶（couple）。」
  - 后面的「为什么这样定义」讲三件事：力偶合力为零，却能让物体转动；力矩之和是 $(\vb r_1-\vb r_2)\times\vb F$，和参考点无关；大小等于 $F$ 乘两条作用线之间的距离。边界情况是两条作用线重合。
  - 术语表加了 `physics.newtonian-mechanics.couple`，现在共 48 条。
  - 电磁学两节没改：它们在链上，第一次出现都括注了英文。
- **第 2 题 E**：
  - 选项换成「合力为零的一组力，对不同参考点的力矩之和相同」，这一项是对的。
  - 解答写 $\sum(\vb r_i-\vb r_0)\times\vb F_i=\sum\vb r_i\times\vb F_i-\vb r_0\times\sum\vb F_i$，再说一句「力偶就是这样的一组力」。
  - 答案仍是 C、E，提示不用改。
- **角动量守恒**：`angular-momentum:77` 把「角动量守恒」整个词标成 `conservation-of-angular-momentum`。这样一来，例 2 这一块里单独的「角动量」第一次出现变成了 `:79` 推导里的那个，那里也标了。
- **英文括注**：
  - `angular-momentum:47` 写成「力心（center of force）」；
  - `circular-dynamics:60` 写成「离心力（centrifugal force）」。误区引号里的这个是全节第一次出现，括注就加在这里。
- **链接文字**：`common-forces` 第 7 题（`problems.yaml:148`）改成「约束与广义坐标」。
- **同类自查：已进表的术语**：照初审的办法（按块分、最长匹配优先）重扫 10 节。剩下的报告都是排除项：
  - 「速度表」「力心」这类意思不同的长词；
  - 「平均速度」，它自己括注了；
  - 定理标签里写在逗号后面的英文：角动量守恒、伽利略变换、二阶导数；
  - plan.md:242 列为基础词的「原函数」。
- **同类自查：没进表的名词**：按后缀（定理、定律、角、力、运动……）列出没进表的名词，逐个看第一次出现的地方。
  - 补了 5 处括注：
    - `kinematics-1d:30`「瞬时速度（instantaneous velocity）」；
    - `kinematics-1d:97`「平均加速度（average acceleration）」；
    - `kinematics-vectors:37`「抛射角（launch angle）」：原来这句只说「成$\theta$角」，「抛射角」到动画说明才第一次出现，现在在定义段里起名；
    - `circular-dynamics:37`「圆锥摆（conical pendulum）」；
    - `kinematics-1d` 第 2 题解答（`problems.yaml:47`）「拉格朗日中值定理（mean value theorem）」，英文照单变量微积分的术语表。
  - 按 plan.md:242 的尺度当作基础词、没括注的：质点、周期、原函数、匀速直线运动、轨迹、分速度、作用线、转轴、作用力和反作用力、弹性限度、形变、倾角。
  - 「洛伦兹变换」只出现在「见……一节」的链接里，不算第一次出现。

### 小问题 3 · 页面显示

- **`angular-momentum` 第 4 题解答（`problems.yaml:88`）**：
  - 先照建议改成行间公式，可页面上展开解答以后仍然横向溢出 20 px。
  - 原因：行间公式外层的 `span.math-display` 能横向滚动，可题目卡片 `article.problem` 是网格项，网格列按内容的最小宽度撑开。公式 677 px，加上卡片的内边距是 757 px，照样把页面撑宽。
  - 最后改成按分量逐个写短式子：「$x$分量$(-2.0)\times5.0-0=-10$，$y$分量$0-2.0\times5.0=-10$，$z$分量是$0$，所以力矩是$(-10,-10,0)\,\mathrm{N\cdot m}$」。展开后不再溢出。
- **同类自查**：10 节在 768 px 下展开全部 240 条提示和 40 个解答，量了每个行内公式占所在段落的宽度。
  - 没有找到超过段落一半、又没法折行的长式子。
  - 唯一一处是 `angular-momentum` 例 1 正文里那串 $\boldsymbol\tau=\vb r\times\vb F=(\dots)=(\dots)$，占 462/721 px，正是报告建议的那一类（三个等号、带括号的矢量）。它不撑宽 768 px 的页面，也改成了行间公式（`:67`–`:69`）。正文不在网格里，太宽时能自己滚动。
- **滑块**：
  - `kinematics-1d:71` 的 $v_0$ 最小改成 8，`kinematics-vectors:59` 最小改成 15。
  - 默认值 14、20 仍在格点上。新格点是原来格点的一部分，不会和简单题、中等题里的数撞上。
  - 页面上拖到最小端截图看过：$v_0=8$ 时最高点 3.3 m，速度线在 0.82 s 处穿过零；$v_0=15$、$\theta=15^\circ$ 时两条轨迹都看得清，射程 11.5 m，75° 那条高 10.7 m。

### 别的改动

- `angular-momentum` 的 `minutes` 从 25 改成 28。补了力偶两段（167 个汉字）后全文 1370 个汉字，原来每分钟 54.8 字，比这一批其余 9 节（44–53）都密；改后是 48.9。

### 修订后跑过的

- `npm run content`：0 个错误，0 个警告。
- `npm test`：23 个文件、202 个测试通过。
- 简单题、中等题的 30 个数值答案用独立算法重算，全部一致；第 2 题的新选项 E 是手算的。
- `compileTex`、`suspectTex`：10 节的正文、题目（含参考解答）和术语简介，共 1875 个公式，0 个问题。
- 其他自查：
  - 段落句数、中英文之间的空格、引号：0 处；
  - 25 个链接的文字都和目标标题一致；
  - 全图层级 0 处变化，没有多余的前置。
- 页面：`npm run build` 后，用进度写临时目录的服务（端口 3147）在 768 px 下看。
  - 10 节的定义卡片数都等于锚点数，共 38 张；没有 KaTeX 错误。
  - 每节展开全部提示和解答后，横向溢出都是 0。注意「放弃，看解答」后面还有一步页内确认「确定放弃」，脚本两步都要点，否则解答不出来，也就查不到解答里的溢出。
  - 7 张 SVG 都在页面里量过，没有出界、相叠、碰线；fbd.svg 截图看过。
- `progress/`：没碰。服务只写临时目录；`progress/lessons.yaml` 的修改时间仍是 11-16 15:54，就是审查报告里说的那次网站写入。

### 修订时我替你定的（都能改）

1. 第 4 题解答没用行间公式，改成按分量写短式子，理由见小问题 3。
2. 例 1 的叉积在 768 px 下并不溢出，也照报告建议的规矩改成了行间公式。
3. fbd 左图的绳子改成平行于斜面、拴在桩上，拉力画在绳子旁边 8 px。
4. `newton.svg` 的 $F$ 报告没列，按同类也改成了例 2 的比例。
5. `circular-motion` 去掉了 `chain-rule` 前置。报告「前置」一节认为它有用；去掉后它仍在链上，不去掉构建会报多余前置。
6. 补括注的 5 处和不补的那些，按 plan.md:242 的尺度判断。
7. `angular-momentum` 的 `minutes` 改成 28。

### 对「要写回 plan.md 的」的补充

- 第 3 条（长式子）建议加半句：题目文字（提示、解答）里的长串等式要拆短或分开写，只改成行间公式不够。
  - 原因：题目卡片是网格项，网格列按内容的最小宽度撑开，行间公式的横向滚动在卡片里不起作用（批次 18 修订时 `angular-momentum` 第 4 题就是这样）。
  - 也可以让写代码的会话给 `.problem` 加 `min-width: 0`，那样行间公式在卡片里也能滚动。
- 第 4 条照报告写。plan.md 里没有记 `circular-motion` 以 `chain-rule` 为前置，去掉它不用同步。

### 跨领域补标（规矩 C）

调度员扫过全站，定了要补的 2 处。

- `content/math/linear-algebra/cross-product/lesson.md:46`：「物理里的力矩（torque）」标 `physics.newtonian-mechanics.torque`。原来就有括注。
- `content/physics/special-relativity/stress-energy-tensor/lesson.md:84`：「和角动量守恒有关」标 `physics.newtonian-mechanics.conservation-of-angular-momentum`。这是全节唯一一次出现，原来没有括注，按 plan.md:242 补了括注 conservation of angular momentum。
- 两节的前置链上都没有 `angular-momentum`，所以按 plan.md:246 的规矩 C 标。两处都是所在那一块（「几何意义」「能量-动量张量」）的第一次出现，也是全节唯一一次。两节的 `status` 仍是 `reviewed`，随牛顿力学这一批提交。
- 这次新进表的「力偶」也查了，都不用补：
  - 电磁学 `magnetic-force-on-currents`、`electric-dipole` 以 `angular-momentum` 为前置，在链上，只要括注，原来都有；
  - 分析力学 `inertia-tensor` 只在题目文字里出现，题目里可标可不标，没动。
- 补标后 `npm run content`：0 个错误，0 个警告。

## 复核

审内容会话，2026-11-17。

### 结论

全部通过，10 节的 `status` 已改成 `reviewed`。

- 重要 2 条都修好了；小问题 3 类 13 处逐条核过，都改了。
- 第 4 题的长式子没写成行间公式，改成按分量写三个短式子，同意：行间公式放在题目卡片里照样撑宽页面（见「逐条」小问题 3）。
- 修订时自查出来的也核过，都改得对：
  - fbd 左图的绳子原来从木块侧面连到斜面顶点，和斜面成 24°，不平行于斜面，初审漏看了；现在平行于斜面，拴在桩上；
  - `newton.svg` 右图推力 F 原来 68、N 42，现在 56 比 42，正是例 2 的 8.0 N 比 6.0 N；
  - 另外 7 处「以后」「后面」改成小节名加链接，1 处链接文字「中值定理」改成标题「微分中值定理」，5 处补了英文括注。
- `circular-motion` 去掉 `chain-rule` 前置，同意：它经 `kinematics-1d` → `higher-derivatives` 仍在链上，留着是多余前置。初审「前置」一节说它有用处，指的是链式法则要在链上，现在仍在。
- 两处跨领域补标（`cross-product:46`、`stress-energy-tensor:84`）标得对，两节保持 `reviewed`。
- 没有「改了但修订说明里没写」的改动。只有 `kinematics-1d:51` 改写时顺带加了一个逗号，属于列出的那一处。
- 验算脚本的两处类型检查报错修了，`npm run typecheck` 通过。

### 和快照比，这一轮改了哪些文件

和 `snap18/`（开审时拷的）逐个文件、逐字比：

- 改过的：
  - `_domain.yaml`：加了「力偶」一条，共 48 条；
  - 9 节的 `lesson.md`（`friction` 没改）；
  - `kinematics-1d`、`kinematics-vectors`、`circular-motion`、`relative-motion`、`newtons-laws`、`angular-momentum`、`common-forces` 的 `problems.yaml`；
  - `fbd.svg`、`forces.svg`、`newton.svg`。
- 没改的：`friction` 整个目录，`circular-dynamics`、`free-body-diagrams` 的 `problems.yaml`，另外 4 张 SVG。
- 别的领域：`git diff` 看到只改了 `cross-product/lesson.md:46`、`stress-energy-tensor/lesson.md:84` 各一行。
- 逐处对过修订说明，每一处改动都写在里面。

### 逐条

- **重要 1（二阶导数）**：
  - `kinematics-1d` 加了 `math.calculus.higher-derivatives`。我用 `generated/graph.json` 重算：10 节的链都含它，层级都没变（网站上 8–14）。
  - `:37` 又就地点了一句「也就是位置对时间的二阶导数，second derivative」。英文写在逗号后面，和定理标签的写法一样，算括注了。
  - `circular-motion` 第 8 题题干补了点记号的说明。
- **重要 2（受力图）**：量了 SVG 坐标，长度都算到箭尖。
  - 右图 N、$G_A$ 都是 73.5，两段 T 都是 18.4，$G_B$ 是 24.5，正是例 2 的 29.4 N、7.35 N、9.8 N 乘每牛顿 2.5 px。
  - 左图 T 是 29.0，和沿斜面的虚线分量一样长；绳子正好 30°，T 离绳 8.1 px。
  - `forces.svg` 的小球 T、G 都是 56；`newton.svg` 的 F 56，N、N′ 各 42，$a_1$ 64、$a_2$ 32。
  - 图注 `:42` 和替代文字 `:40` 都写了长短关系和「B 加速下落，拉力比重力小」，和常见误区第一条接上了。
  - 3 张图用 headless Edge 重新量过：0 处出界、相叠、碰线；深浅两种配色的截图都看过。
- **小问题 1（措辞）**：报告列的 5 处和自查的 7 处，都改成了小节名加链接。链接脚本复查，10 节全部链接的文字都等于目标的标题。
- **小问题 2（衔接）**：
  - 力偶：定义段 `:28` 和「为什么这样定义」段 `:30`（3 句）都对，$(\vb r_1-\vb r_2)\times\vb F$ 的大小正是 F 乘两条作用线的距离。电磁学 `magnetic-force-on-currents:48` 链过来，现在找得到「力偶的力矩和对哪一点取无关」。术语表的简介按字数规则是 38 字。
  - 第 2 题 E 换成「合力为零的一组力，对不同参考点的力矩之和相同」，比讲解的力偶多一步，不算照搬；解答的推导对。验算脚本按新选项改了：取三个合力为零、不是力偶的力，对 5 个参考点的力矩之和都是 (−3, 0, −6)。
  - 「角动量守恒」整个词标了，`:79` 补标了「角动量」；「力心」「离心力」括注了；第 7 题的链接文字改了。
  - 术语脚本按块重扫 10 节：初审报的两处不再出现。只多出一条「二阶导数没括注」，是脚本没认出逗号后面的英文，不算问题；其余都是初审时核过的排除项。
- **小问题 3（页面）**：
  - 第 4 题的三个短式子算过都对：$x$ 分量 $(-2.0)\times5.0-0=-10$，$y$ 分量 $0-2.0\times5.0=-10$，$z$ 分量 0。
  - 写内容会话说改成行间公式仍溢出 20 px，和我初审时查到的原因一致：题目卡片是网格项，网格列按内容的最小宽度撑开。它对写回 plan.md 的补充我同意，见下。
  - 例 1 的叉积改成了行间公式，768 px 下宽 721 px，没有出滚动条。
  - 滑块最小值改成 8 和 15，默认值仍在格点上，页面上截图看过（见下一节）。
- **别的改动**：`angular-momentum` 的 `minutes` 改成 28，不超过 30，同意。

### 页面（修订后的内容）

- `angular-momentum/lesson.md` 在写内容会话 13:58 构建之后又改过（14:01），所以我先 `npm run build` 重建了 `dist/`，再用进度写临时目录的服务（端口 3151）在 768 px 下看。
- 10 节全部展开提示和解答：定义卡片数等于锚点数（6、4、3、2、7、5、5、1、2、3，共 38），没有 KaTeX 错误，横向溢出都是 0。力偶的卡片显示正常。
- 滑块最小端：
  - `kinematics-1d` $v_0=8$：最高点约 3.3 m，速度线在 0.82 s 处穿过零，看得清；
  - `kinematics-vectors` $v_0=15$、$\theta=15^\circ$：两条轨迹分得开，高的那条 10.7 m，落点都在 11.5 m。

### 跨领域补标

- `math.linear-algebra.cross-product:46`「物理里的力矩（torque）」标 `physics.newtonian-mechanics.torque`：
  - 这一节的链只有 `dot-product` 往下，不含牛顿力学；「力矩」是旁白里的例子，不是主题，按规矩 C 标，对；
  - 是「几何意义」那一块、也是全节唯一一次出现，原来就括注了英文。
- `physics.special-relativity.stress-energy-tensor:84`「和角动量守恒（conservation of angular momentum）有关，这里不证」标 `conservation-of-angular-momentum`：
  - 这一节的链经 `four-momentum` 有牛顿力学的几节，但没有 `angular-momentum`，按规矩 C 标，对；
  - 「这里不证」是旁白，不用加前置；是「能量-动量张量」那一块、也是全节唯一一次出现，补的括注对；
  - 牛顿力学的简介讲质点的角动量守恒，比这里浅，给没学过的读者当入口合适。
- 两节的 `status` 没动；这次复核看过，保持 `reviewed`。页面上没看这两节，只改了一个标记，`npm run content` 0 个错误。

### 跑过的命令

- 验算脚本：
  - `physics.newtonian-mechanics.angular-momentum.ts`：`:27` 的 `5 === 0`（TS2367）改成比较力的大小 `norm(FB) === 0`；第 2 题 E 按新选项改了检验和说明。
  - `physics.newtonian-mechanics.kinematics-vectors.ts`：删了没用到的 `check` 导入（TS6133）。
  - 两个脚本单独跑都一致；`npm run typecheck`（`tsc -b`）通过。
  - `npm run verify`：283 节全部一致，其中牛顿力学 40 题。
- `compileTex`、`suspectTex`：10 节的正文、题目、48 条术语简介，共 1935 个公式，0 个问题。
- 链接、锚点、前置层级脚本：没有问题，层级不变。
- `npm run content`：改 `status` 前后都是 0 个错误、0 个警告。
- `npm run build` 一次，理由见上。
- `progress/`：没碰。`progress/lessons.yaml` 的修改时间仍是 11-16 15:54。

### 要写回 plan.md 的（复核补充）

1. 初审第 3 条（长式子）照修订说明的补充写：题目文字里的长串等式要拆短，只改成行间公式不够。也可以请写代码的会话给 `.problem` 加 `min-width: 0`，让行间公式在卡片里也能横向滚动；那样这半句就不用写。
2. 初审第 4 条（`higher-derivatives` 的后续）现在可以写了，作者加了前置。

### 没验证的地方

- 深色配色只看了 3 张改过的 SVG 的截图，页面上没切换。
- 跨领域补标的两节没在页面上看。
- 动画只截了新的最小端；最大端的范围没变，沿用初审的截图。
- 难题、思考题这一轮只改了参考解答里的链接和措辞，没再算。

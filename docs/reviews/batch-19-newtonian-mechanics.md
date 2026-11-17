# 批次 19 审查报告：牛顿力学（动量与能量 10 节）

审内容会话，2026-11-17。范围：`momentum-impulse`、`momentum-conservation`、`work-energy`、`collisions`、`center-of-mass-frame`（这一批从 `collisions` 拆出来的）、`rockets`、`potential-energy`、`conservative-forces`、`energy-diagrams`、`drag`，以及 `_domain.yaml`（新增 38 条术语，共 86 条）。跨领域补标的 6 个文件写内容会话还在改，不在这次的快照里，等通知后和修订一起复核。

## 结论

重要 2 条，小问题 3 类（同类合并，共 10 处），原有问题 1 条。

- 简单题、中等题 40 道全部独立验算，答案和标准答案一致。难题、思考题 40 道的参考解答逐题看过，没有发现错误。中等题 `drag` 第 4 题的答案对，解答末尾附带的一句话算错了（重要 2）。
- **重要 1**：两处推理用到了前置链上没有的东西。`energy-diagrams` 整节的推理都建立在一维的 $F=-U'(x)$ 上，可这个关系在 `conservative-forces` 讲，那一节不在它的链上；`drag` 例 2 用了定积分的记号 $\int_0^t$，它的链上只有不定积分。
- **重要 2**：`drag` 第 4 题解答说速度减半以后「再过 4.0 s」才减到原来的 $\frac13$，应为再过 2.0 s。
- 小问题：① 说法不准（支持力被叫作非保守力、「比子弹还快」、终端速度的定义和后文矛盾、两条术语简介把充分条件写成了定义）；② 和别的小节、名词的衔接（一处「碰撞一节」没有链接、一处摩擦力没链过去、两个名词没括注英文、一道题用了链外的 $T=\frac{mv^2}r$ 没加链接）；③ 两张图的替代文字和图对不上。
- 篇幅：`minutes` 25–29，没有超过 30 的。
- 拆分：
  - `collisions` 只讲一维，狭义相对论 `four-momentum:16` 要的两件事都在 `collisions:43`：换惯性系动量守恒仍成立，完全非弹性碰撞损失的动能不变。
  - 狭义相对论 `relativistic-collisions` 第 5 题引用的「等质量弹性斜碰后两球互相垂直」，在 `center-of-mass-frame` 的几何图像（`:47`）和例 2（`:59`–`:65`）里讲了。
  - 新节第 15 层，没有已写的下游，层级都对。
- 写内容会话替我们定的事（汇报里「写回 plan.md」那部分和「我替用户定的」9 条）逐条核过，都认可，见「写内容会话替你定的」。

| 小节 | 重要 | 小问题 |
| --- | --- | --- |
| momentum-impulse 动量与冲量 | 0 | 0 |
| momentum-conservation 质心与动量守恒 | 0 | 替代文字 1 |
| work-energy 功与动能定理 | 0 | 题目里的链外结论 1（第 5 题） |
| collisions 碰撞 | 0 | 0 |
| center-of-mass-frame 质心系 | 0 | 链接 1 |
| rockets 火箭与变质量系统 | 0 | 英文括注 1（两个词） |
| potential-energy 势能与机械能守恒 | 0（重要 1 推荐补在这里） | 措辞 1；替代文字 1 |
| conservative-forces 保守力与势能的梯度 | 0 | 链接 1 |
| energy-diagrams 势能曲线与平衡 | 1 | 术语简介 1（两条） |
| drag 与速度有关的阻力 | 2（例 2 的积分记号；第 4 题解答） | 措辞 2 |

## 怎么审的

- **快照**：开审时（11-17 19:25）把 10 节目录和 `_domain.yaml` 拷到 scratchpad 的 `snap19/`。写报告前（20:12）又比了一次，0 差异。复核时和它比。
- **简单题、中等题**：
  - 只用 `npm run statements` 读题，写了 10 个脚本 `tools/verify/physics.newtonian-mechanics.<id>.ts`。
  - 公用的 `_nm.ts` 加了三样：转出电磁学 `_es.ts` 的 `integrate`；一维碰撞模拟 `collide1D`，两个物体之间夹一根很硬的弹簧；二维两个光滑圆盘的碰撞模拟 `disks2D`。
  - 再跑 `npm run verify` 比对，见下一节。
- **公式**：10 节的正文、题目（含参考解答，构建不渲染）和 86 条术语，共 1960 个公式逐个交给 `compileTex`、`suspectTex`，0 个问题。
- **链接、锚点、前置**：
  - 脚本查了所有 `lesson:` 链接和锚点、术语的 `definedIn` 和锚点、前置是否多余、层级。
  - 层级（网站上从 0 数）：
    - `momentum-impulse` 12；
    - `momentum-conservation`、`work-energy`、`drag` 13；
    - `collisions`、`rockets`、`potential-energy` 14；
    - `center-of-mass-frame`、`conservative-forces`、`energy-diagrams` 15。
  - 前置没有多余的。
  - 全站链到这 10 节、标了这 10 节术语的地方都列出来逐个看过。
- **术语**：脚本按块（H2/H3）找所有领域术语表里的词（最长匹配优先），查每块第一次出现标了没有、每节第一次括注英文没有，再人工排除。排除的有：
  - 「好像」「图像」里的「像」，「原子核」里的「核」，「斯基」里的「基」，「轨迹」里的「迹」，「力场」「用力」里的「力」；
  - 只当节名用的链接文字；
  - 定理名括注格式。
- **记号**：和单变量微积分这一批同时写的 `fundamental-theorem`、`concavity`、`integral-properties`（都是 written）对照，见「记号与约定」。
- **SVG**：6 张图在页面上量 `getBBox`，按 1 px 沿线段、路径采样查碰线。
  - 出界、相叠、压线都是 0 处；文字离线最近 2.39–4.03 px，拉丁字母最近，汉字最近 3.87 px。
  - 没有脚本、`foreignObject`。
  - 箭头长短和讲解里的关系逐张核过：
    - `collisions.svg`：$v$ 的箭头都是 72 px，$\frac v2$ 的都是 36 px；$3m$ 的球半径 23.1 = 16 × ∛3，体积和质量成正比。
    - `cm-frame.svg`：
      - $\vb v_1$ 长 216 px，圆心在它的中点、半径 108。
      - $\vb v_1'$、$\vb v_2'$ 长 187.1、108.0，相加正好是 $\vb v_1$，夹角 89.98°，偏离 30° 和例 2 一致。
      - 左图四个 $u$ 都是 50 px。
    - `explosion.svg`：
      - 右上角 $\vb P=(120,0)$ 等于 $\vb p_A=(8,-24)$ 加 $\vb p_B=(112,24)$，按质量 $m$、$2m$ 折成速度，和两条轨迹的初始方向一致。
      - 用同一个 $g$ 算，$A$ 落在 334.3、$B$ 落在 540.5，和图上一样。
      - 三个质心都在原抛物线上，误差不到 0.1 px。
    - `work.svg`：$F$ 长 80、和水平成 30°，两个分量 69.3、40.0；$\Delta\vb r$ 120 px，等于木块移动的距离；黎曼矩形取中点的高。
    - `rocket.svg`：$v$、$v+\Delta v$、燃气速度分别是 70、80、−20 px，$u=100$，$\Delta v=\frac u{10}$。动量 $m\times70=0.9m\times80+0.1m\times(-20)$。
- **页面**：
  - 照 plan 的临时副本做法：`git archive HEAD` 导出，拷进工作区的 `content/`，`node_modules` 用目录联接，在副本里 `vite build`。
  - 用副本的服务起在端口 3151，进度写 scratchpad 的 `progress-tmp19/`。看完先删联接、再删副本。
  - 768 px 下 10 节把提示、解答全部展开，每节 32 次点击，含「确定放弃」：
    - 定义卡片 38 张，等于锚点数；
    - 没有 KaTeX 错误；
    - 页面横向溢出 0；
    - 题目卡片里也没有需要横向滚动的公式。
  - 四个动画拖到滑块两端截图看过，都看得清：
    - `momentum-impulse` 的 $w$ 取 10、60；
    - `energy-diagrams` 的 $s$ 取 0.1、0.99、1.8；
    - `drag` 的 $k$ 取 0.3、1.2；
    - `conservative-forces` 的 $c$ 取 0、2。
- **跑过的命令**：
  - `npm run content`：0 错误、0 警告。
  - `npx tsc -p tsconfig.node.json --noEmit`：0 错误。我自己的脚本先报了 4 处未用变量、字面量比较，改掉了。
  - 10 个脚本各自单独跑。
  - `npm run verify`：304 节全部一致，其中牛顿力学 20 节。
- **`progress/`**：页面检查前后各算一次校验和，相同。`progress/lessons.yaml` 开审前就是修改状态，不是这次写的。

## 简单题、中等题的验算

每题两套算法，脚本里写明了用的例子；提示和解答末尾的数也和标准答案对过，除重要 2 那一句都一致。

| 小节 | p1 | p2 | p3 | p4 | 第二套算法 |
| --- | --- | --- | --- | --- | --- |
| momentum-impulse | 10.5 | A、B | 24.514 | 300 | 球棒的力取 $A\sin^2\frac{\pi t}T$，龙格-库塔法积分 $\dv vt=\frac Fm$、二分出 $A$，冲量另用高斯-勒让德求积；p3 直接积分；p4 用流量 $\rho Av^2$ |
| momentum-conservation | 2.0069 | A、C、E | 6.7082 | 1.5 | p1 先求两球的质心再合并；p3、p4 把一对等大反向的内力交给龙格-库塔法积分，p3 解线性方程组定力的两个分量，p4 二分力的大小 |
| work-energy | 692.82 | C、D | 5.0990 | 7725 | p1 雪橇按不均匀的 $x(t)$ 走，对功率 $\vb F\cdot\vb v$ 求积；p3 龙格-库塔法积到 $x=3$；p4 对 $W(t)=\Delta K+\Delta U$ 数值求导 |
| collisions | 3 | B、C、D | 3 | 64 | 两个物体之间夹很硬的弹簧，积分碰撞过程：弹性碰撞积到分开，完全非弹性碰撞在相对速度为零时锁住 |
| center-of-mass-frame | 12 | A、B、E | 1 | 4 | p1 直接加相对质心的动能；p3 弹簧碰撞；p4 两个光滑圆盘的二维模拟，二分瞄准距离，并核对碰后两个速度垂直 |
| rockets | 2 | A、C、E | 91.792 | 2.2 | p1 内力积分；p2 两种烧法分别积分；p3 每次喷出 $10^{-6}m_0$、逐份用动量守恒；p4 积一小段、把 $\frac vt$ 外推到 $t=0$ |
| potential-energy | 22.181 | D、E | 2.0408 | 3.1305 | p1 四个抛射角积到落地；p3 弹力加重力积到最高点；p4 积单摆方程到最低点 |
| conservative-forces | 12 | A、C、E | 9 | 8.9443 | 数值求导；p2 四个圆上的数值环流，加上三点的数值旋度；p3 两条路径的数值曲线积分 |
| energy-diagrams | 2 | A、B、E | 3.4641 | 4 | p1 黄金分割找最小值点；p3 从转折点积到原点；p4 模拟「跑走还是折回来」，二分出分界动能，3.98 J 折回、4.02 J 跑走 |
| drag | 54.222 | A、C、E | 0.84737 | 2 | 龙格-库塔法积分运动方程；p2 的 D 积分平方阻力下的上抛，上升 1.37 s、下落 1.65 s |

## 重要 1 · 推理用到前置链上没有的东西（2 处）

**（1）`energy-diagrams` 的 $F=-U'(x)$**

- 位置：`energy-diagrams/lesson.md:22` 直接写「只有一个保守力 $F(x)=-U'(x)$ 做功」。后面都靠它：
  - `:32` 转折点处的力是 $-U'(x)$；
  - `:37` $U'(x_0)=0$ 时力为零；
  - `:44` 定理的证明；
  - 例 2，第 2 题的 A。
- 问题：
  - 这个关系是 `conservative-forces` 的定理（`conservative-forces/lesson.md:30`「沿直线运动时 $F=-\dv Ux$」），两节都在第 15 层，`conservative-forces` 不在 `energy-diagrams` 的链上。
  - 链上的 `potential-energy` 只用功定义了势能（`:30`），算了弹性势能（`:39`），没有说过反过来怎样由 $U$ 求力。
  - 中学不讲 $F=-\dv Ux$，读者沿着链读过来，第一次见到它就在这一节的第一句。
- 不能加前置：`energy-diagrams` 加 `conservative-forces` 会从第 15 层变第 16 层，全图 15 节跟着变。其中 11 节是分析力学已审的：action-angle-variables、adiabatic-invariants、canonical-transformations、cyclic-coordinates、energy-function、hamilton-jacobi、hamiltonian-chaos、hamiltons-equations、noether-theorem、phase-space-liouville、poisson-brackets。
- 建议：用链上的东西推出来，只要一两句。由势能的定义，沿 $x$ 轴有 $U(x)=U(x_0)-\int_{x_0}^xF(s)\,\dd s$；由微积分基本定理，$U'(x)=-F(x)$。`fundamental-theorem` 经 `work-energy` 在链上。放在哪里：
  - **推荐放在 `potential-energy`**：在弹性势能（`:39`）或「为什么这样定义」（`:32`）后面补这一两句，`energy-diagrams:22` 链过去。
    - 振动与波「简谐运动」、牛顿力学「引力势能与逃逸速度」也以 `potential-energy` 为直接前置，以后都要用。
    - `potential-energy` 第 6 题（1）已经在证 $U(x)=-\int_{x_0}^xF\,\dd s$，讲解里补上不重复。
  - 也可以只在 `energy-diagrams:22` 就地推一句。

**（2）`drag` 例 2 的 $\int_0^t$**

- 位置：`drag/lesson.md:88`：$x(t)=\int_0^t4.0e^{-s/4.0}\,\dd s=16\bigl(1-e^{-t/4.0}\bigr)\,\mathrm m$。
- 问题：
  - 这是变上限的定积分。`drag` 的链上有 `antiderivatives`，没有 `definite-integral`、`fundamental-theorem`。
  - 链上各节（`separable`、`what-is-ode`、`antiderivatives`、`kinematics-1d`、`hyperbolic-functions`）都没出现过 $\int_a^b$ 这种记号。
  - 同一例的「为什么想到这么做」（`:86`）说的是「位置是速度的原函数」，和推导的写法不一致。
- 建议：
  - **推荐**照 `:86` 改写推导：$x=-16e^{-t/4.0}+C$，由 $x(0)=0$ 得 $C=16$。前置不变，链保持最少。
  - 也可以加 `math.calculus.fundamental-theorem` 为前置。按整张图算，0 节层级变，`drag` 仍是第 13 层。
  - 第 5 题参考解答（`drag/problems.yaml:111`）也用了 $\int_0^tv_x\,\dd s$。参考解答网页上不显示，顺手照改即可。

## 重要 2 · `drag` 第 4 题解答里的时间算错了

- 位置：`drag/problems.yaml:89`，中等题，解答在网页上显示：「$t=\frac m{cv_0}=\frac{500}{25\times10}=2.0\,\mathrm s$。再过 $4.0\,\mathrm s$ 速度才减到原来的 $\frac13$」。
- 问题：解答自己给出 $\frac1v=\frac1{v_0}+\frac cmt=0.1+0.05t$，所以：
  - $t=2.0\,\mathrm s$ 时 $v=\frac{v_0}2$；
  - $t=4.0\,\mathrm s$ 时 $v=\frac{v_0}3$，速度减半以后只再过 $2.0\,\mathrm s$；
  - 再过 $4.0\,\mathrm s$、也就是 $t=6.0\,\mathrm s$ 时，是 $\frac{v_0}4$。
  - 答案 2.0 s 没错，错的是这句附带的话；读者照它验算会对不上。
- 建议：改成「再过 $2.0\,\mathrm s$ 才减到原来的 $\frac13$，又过 $2.0\,\mathrm s$ 只减到 $\frac14$」。每过 2.0 s，$\frac1v$ 增加同样多，速度减得越来越慢，正好接上后半句「船越来越难停下」。

## 小问题 1 · 说法不准（4 处）

- `potential-energy/lesson.md:80`，常见误区第二条：「物体受了支持力这样的非保守力……」。
  - 按本节 `:23` 的定义，做功和路径无关的就是保守力。不动的光滑曲面的支持力，沿哪条路都不做功，不好叫它非保守力。
  - 这条误区要说的其实是「受了保守力以外的力」，和定理（`:47`）的「别的力都不做功」一致。
  - 建议改成「物体除了保守力还受别的力（例如支持力），机械能就不守恒」。
- `drag/lesson.md:16`：只受重力时落地约 $200\,\mathrm{m/s}$，「比子弹还快」。手枪子弹约 $250$–$400\,\mathrm{m/s}$，步枪约 $700$–$1000\,\mathrm{m/s}$，$200\,\mathrm{m/s}$ 比它们都慢。建议改成「约 $720\,\mathrm{km/h}$，比高铁快一倍」之类。
- `drag/lesson.md:30`，终端速度的定义：「阻力增大到和重力相等时，合力为零，速度不再变化，这个速度叫作终端速度」。
  - 读起来像下落的速度在某一刻达到 $v_T$ 以后就不变了。
  - 本节 `:41` 却说「速度永远只是越来越接近 $v_T$」，两句矛盾。
  - 建议写成「阻力和重力相等时合力为零，这个速度叫作终端速度；从静止下落的物体越来越接近它」。术语简介「阻力增大到和重力相等时的下落速度」可以不改。
- `_domain.yaml:741`、`:750`，「稳定平衡」「不稳定平衡」的简介：「$U'=0$、$U''>0$ 处，即势能的极小值点」（不稳定平衡同理）。
  - $U''>0$ 只是充分条件，简介写得像定义。
  - 本节 `:46` 说 $U''=0$ 时判别法什么也不说；第 2 题的 D 正是 $U=x^4$ 在 $U''(0)=0$ 时仍是稳定平衡。浮窗和这两处对不上。
  - 建议改成「……的平衡位置，在势能的极小值点；$U''>0$ 时一定是」，不稳定平衡同理。

## 小问题 2 · 和别的小节、名词的衔接（4 处）

- `center-of-mass-frame/lesson.md:41`：「这就是碰撞一节里的末速度公式」。正文写到别的节要加链接，建议写成 `[碰撞](lesson:physics.newtonian-mechanics.collisions#thm-elastic-1d)`。
- `conservative-forces/lesson.md:16`（`:25` 又出现）的「滑动摩擦力」标了 id，没有链到 `friction`。
  - plan 的安排是「当中学学过的滑动摩擦力用，链到 `friction`」。`potential-energy:25` 链了，这一节没链。
  - 写内容会话的汇报说两节都链了，见「和写内容会话的汇报对不上的地方」。
- `rockets/lesson.md:50` 的「质量比」、`:74` 的「重力损失」都是有名字的说法，第一次出现没括注英文，应为 mass ratio、gravity loss。
- `work-energy/problems.yaml:97`，第 5 题题干：「绳子的拉力近似是 $T=\frac{mv^2}r$」。
  - 这是 `circular-dynamics`（向心力）的结论，那一节不在 `work-energy` 的链上。
  - 题目文字用链外的结论要加链接注明出处，建议在这句后面链到 [圆周运动的动力学](lesson:physics.newtonian-mechanics.circular-dynamics)。
  - 同一题题干的角动量守恒已经链到 `angular-momentum`。

## 小问题 3 · 替代文字和图对不上（2 处）

改 SVG 时同步改了 SVG 里的注释，`lesson.md` 里的替代文字没跟着改：

- `momentum-conservation/lesson.md:52`：替代文字说「虚线是礼花弹原来的抛物线轨迹，从左下的发射点经过最高点画到右下的落地点」。图上发射点到最高点是实线，最高点以后才是虚线。SVG 的注释写对了，照它改即可。
- `potential-energy/lesson.md:55`：替代文字说「左上方画着竖直向下的重力 mg」「右边标出 A、B 离地面的高度 hA、hB」。图上：
  - $m\vb g$ 在上方偏右（x 430–445，画布宽 640）；
  - $h_A$ 在左边，$h_B$ 在右边。

## 原有问题（不是这一批引入的）

- `angular-momentum/lesson.md:77`（批次 18，reviewed），例 2「为什么想到这么做」：
  - 写的是「小球只受绳子沿绳指向小孔的:term[拉力]（tension）」，标了 `physics.newtonian-mechanics.tension`。
  - 「拉力」在 `common-forces` 定义；`angular-momentum` 的前置是 `[newtons-laws, linear-algebra.cross-product]`，链上没有 `common-forces`。
  - 例题只用到「绳子对小球的力沿绳指向小孔」，用不着拉力这个概念。批次 18 的运动学两节正是这样避开链外的「力」的。
  - 判断：确是原有问题，写内容会话说得对。两种修法：
    - **推荐**：改到这一节时，把这一处写成「绳子对小球沿绳指向小孔的:term[力]」，层级不变。
    - 或者加 `common-forces` 为前置：按整张图算，只有 `angular-momentum` 自己从第 12 层变第 13 层，别的 0 节变。
  - 两种都要把它退回 `written`、随那一批复核。照调度员的安排，这一批不修。

## 和写内容会话的汇报对不上的地方

- 汇报第 8 条说 `potential-energy`、`conservative-forces` 讲非保守力时「第一次括注并链到 `friction`」。实际只有 `potential-energy:25` 链了，`conservative-forces` 没有链接（小问题 2）。
- 别的说法都对得上：
  - 10 节都改成了 `written`；
  - 术语表 86 条；
  - 前置改动两处；
  - 礼花弹、质心系等图的改动；
  - 两个滑块范围的改动（`energy-diagrams` 最小 0.1、`drag` 最大 1.2）；
  - 量出的最近距离（我量的是 2.39–4.03 px，它写 2.41 和 3.13 px，是同一处）。

## 前置

- `rockets` 加的 `common-forces`：例 2（`:70`–`:74`）、第 4 题、第 7 题都要用重力，有用处，层级不变（14）。
- `energy-diagrams` 加的 `concavity`：定理（`:42`–`:44`）用二阶导数判别法，有用处，层级不变（15）。
- `momentum-impulse`、`momentum-conservation` 不在 `common-forces` 的链上。两节的正文和 16 道题逐处查过，没有用重力、支持力、拉力、弹力，写成「竖直方向的力互相抵消」「地球的吸引」「别的力的影响可以忽略」。唯一一处「重力加速度」是链上运动学的术语。
- 按整张图试算的几种加前置（层级从 0 数）：

| 加的前置 | 这一节的层级 | 全图层级变了的 |
| --- | --- | --- |
| `momentum-impulse` + `common-forces` | 12 → 13 | 19 节，其中分析力学已审 4 节（euler-equations、heavy-symmetric-top、inertia-tensor、rigid-body-kinematics），这一批 5 节 |
| `momentum-conservation` + `common-forces` | 13 → 13 | 0 |
| `energy-diagrams` + `conservative-forces` | 15 → 16 | 15 节，其中分析力学已审 11 节（见重要 1） |
| `drag` + `fundamental-theorem` | 13 → 13 | 0 |
| `angular-momentum-systems` + `center-of-mass-frame` | 14 → 16 | 11 节，其中分析力学已审 4 节 |
| `rotational-energy`、`two-body-problem` + `center-of-mass-frame` | 不变 | 0 |
| `angular-momentum` + `common-forces` | 12 → 13 | 只有它自己 |

- 以这一批为直接前置的已写小节都看过，它们用到的说法这一批都讲了：
  - 电磁学 `lorentz-force:48`：动能的变化率等于合力的功率，见 `work-energy:47`。
  - 电磁学 `electric-potential:34`、`:58`：$\vb F=-\nabla U$，见 `conservative-forces:30`、`:34`，负号也写明了。
  - 分析力学 `virtual-work:76`：保守力做的功等于势能的减少，见 `potential-energy:23`、`:30`。
  - 狭义相对论 `four-momentum:16`：见「结论」。
- 链进来的其他已写小节：
  - 变分法 `functionals:30` 的 $v=\sqrt{2gy}$，见 `potential-energy:51`。
  - 单变量微积分 `hyperbolic-functions:55`–`:57` 的 $v_T\tanh\frac{gt}{v_T}$ 和运动方程，见 `drag` 例 1，记号 $v_T$ 一致。
  - 本领域 `angular-momentum:79`，见 `work-energy` 例 2，并补了小球的质量 0.20 kg。
  - `kinematics-vectors` 第 8 题，见 `drag` 第 5 题，两边互相链了。
  - 狭义相对论 `postulates` 第 5 题，见 `momentum-conservation:48`。

## 记号与约定

- 和单变量微积分对照：
  - 牛顿-莱布尼茨公式写 $F(x)\Big|_a^b$，英文 Newton-Leibniz formula，和 `fundamental-theorem` 一致（`work-energy:65`、`momentum-impulse:79`）。
  - 「二阶导数判别法（second derivative test）」「极小值（local minimum）」「极大值（local maximum）」和 `concavity` 的术语名、英文一致。
  - 「平均值（average value）」和 `integral-properties` 一致。
  - 「可分离变量的方程（separable equation）」和常微分方程的术语名一致。
  - 链上的跨领域词只括注、没标，符合规矩 C。
- plan 交代的几条都照做了：
  - 势能写 $U$；
  - `conservative-forces:34` 写明了物理的 $\vb F=-\nabla U$ 和数学的 $\vb F=\nabla f$ 差一个负号；
  - 「保守力」在 `potential-energy:23` 定义；
  - 这一批都没加 `friction` 前置，滑动摩擦力只在边界情况和常见误区里出现，没进推理主线；
  - 中学学过的 14 个词都在本领域定义、进了表。
- 新记号：$K$、$\vb J$、$\bar{\vb F}$、$\vb r_{\mathrm C}$、$\vb F_{\text{外}}$、$P$、$u$、$v_T$、$\tau$，10 节里用法一致。

## 写内容会话替你定的（逐条看过）

汇报里「我替用户定的」9 条、「写回 plan.md」6 条，以及拆分时补的「`angular-momentum-systems` 不加 `center-of-mass-frame`」，都核过，认可。

1. **拆分和层级**：
   - 新节第 15 层，没有已写的下游。
   - `angular-momentum-systems` 加 `center-of-mass-frame` 会带动 11 节，其中分析力学已审 4 节，所以不加。
   - `rotational-energy`、`two-body-problem` 以后可以加，0 节变。
   - 这三条都按整张图算过（见「前置」的表）。
2. **`momentum-impulse` 不加 `common-forces`**：加了带动 19 节，所以两节都避开重力等。核过，没漏。
3. **功的一般定义用 $\int\vb F\cdot\vb v\,\dd t$**：`work-energy` 的链上没有曲线积分，这样定义说得通。
   - 一维时化成 $\int F\,\dd x$ 的推导（`work-energy:37`）对，「中途折返也成立」的条件「只随位置变化」写明了。
   - `conservative-forces:27` 再说它就是曲线积分，衔接上了。
4. **「推力」「阻力」进表**：按 plan「文字和术语表的中文名相同、意思却不是那个术语时不标记」（plan.md:243），别处一般意思的不标。
   - 「推力」是手推的力，出现在 `friction:30` 和它的第 1 题、`newtons-laws:87`（反推力）和它的题目、这一批 `work-energy` 第 8 题。
   - 「阻力」当一般说法的还有一处，`friction:24`「这时摩擦力不是阻力」，汇报没提。
   - 建议写回 plan，免得以后扫补标时重新判断。
5. **「做:term[功]」**（`potential-energy:47`）：「做功」是动宾短语，只标「功」，和 `work-energy:55`、`potential-energy:23` 的写法一致，可以。
6. **`momentum-conservation` 29 分钟**：没超过 30。

## 我替你定的（都能改）

1. 重要 1 的两处合成一条，都是推理用到链外的东西。`energy-diagrams` 那处是整节的地基，定为重要。`drag` 那处只有一行，可是同一类，一起修最省事。
2. 重要 2 定为重要：网页上显示的解答里写错了一个可以验算的事实。
3. 没报的：
   - 行内公式里有三个以上等号或约等号的有 24 个，最长的是 `work-energy:65`，正文里 4 个等号。768 px 下页面和题目卡片都不溢出、也不用横向滚动，plan 那一条要防的事没发生，所以没报。要按字面照做，就改这一处。
   - `work-energy:73` 写「见 p5」，本领域别处写「第 N 题」，只关乎风格。
   - 同一块里同一个术语标了两次：`potential-energy:44`、`:47` 的「机械能」，`energy-diagrams:37`、`:42` 的「稳定平衡」「不稳定平衡」。网页上只有第一次加下划线（plan.md:251），plan.md:1164 把这类当作「改到时顺手统一」。
   - 参考解答里两处顺手可改，网页上都不显示：
     - `drag` 第 5 题的 $\int_0^t$，见重要 1；
     - `drag` 第 7 题（`problems.yaml:161`）「半径约 0.01 mm……终端速度不到 1 cm/s」，按斯托克斯阻力算，半径 10 μm 的水滴约 1.2 cm/s，半径改成约 0.005 mm 就对了。

## 要写回 plan.md 的

1. 写内容会话列的 6 条，都同意：
   - 记号；
   - 功的定义；
   - `momentum-impulse`、`momentum-conservation` 避开重力等；
   - 两处前置改动；
   - 「反冲」在 `rockets` 定义；
   - 拆分和以后可加的前置。
   还有「`angular-momentum-systems` 不加 `center-of-mass-frame`」。
2. `energy-diagrams` 不加 `conservative-forces`：会带动 15 节，其中分析力学已审 11 节。一维的 $F=-\dv Ux$ 在哪一节推出来，按修订结果写，推荐 `potential-energy`。
3. 「推力」「阻力」在术语表里是专门的意思（火箭的推力、流体的阻力），一般说法的不标。现有的几处见上面第 4 条。
4. 原有问题：`angular-momentum:77` 例 2 用了链外的「拉力」，修法见「原有问题」。

## 没验证的地方

- 难题、思考题的数只手算核了带数值的部分。参考解答逐题读过。例如：
  - `rockets` 第 5 题 6.62、8.99 km/s；
  - `potential-energy` 第 6 题 0.111、0.141 m；
  - `center-of-mass-frame` 第 6 题的 0.03°；
  - `drag` 第 8 题的 121 倍。
- 页面跟随系统显示成深色，只在深色下截了图，浅色没看。SVG 用 `currentColor` 和页面变量，两种配色都能显示。
- 页面只在 768 px 下看了，手机宽度没看。
- 动画只截了滑块两端和一个中间值。
- 「复制给 Claude」「录入批改结果」这些按钮没点。
- 跨领域补标的 6 个文件写内容会话还在改，不在快照里，没审。它们是：
  - `relativistic-collisions` 第 5 题；
  - `virtual-work` 第 8 题提示的链接；
  - 规矩 C 标记：`magnetic-force-on-currents:83`、`poisson-equation:50`、`lyapunov-stability:25`、`hyperbolic-functions:55`。
  等通知后和修订一起复核。

## 修订说明

写内容会话，2026-11-17。报告的每一条和调度员加的几处都改了，没有不修的；同类问题在 10 节里都找过一遍，另改的写在各条的「同类」下面。

### 重要 1

**（1）`energy-diagrams` 的 $F=-U'(x)$**

- `potential-energy` 在「重力势能和弹性势能」和「机械能守恒」之间加了一个三级标题「由势能求力」，锚点是 `thm-force-from-potential`。
  - 定理：质点沿$x$轴运动，受的保守力$F(x)$只随位置变化时，$F(x)=-U'(x)$。
  - 证明思路两句：由势能的定义和[功与动能定理](lesson:physics.newtonian-mechanics.work-energy#def-work-general)里一维的功，$U(x)=-\int_{x_0}^xF(s)\,\dd s$；再由微积分基本定理，$U'(x)=-F(x)$。`fundamental-theorem` 经 `work-energy` 在链上。
  - 验算：弹性势能给出$-kx$，重力势能给出$-mg$。
- `energy-diagrams:22` 改成「……做功，$F(x)=-U'(x)$（见[势能与机械能守恒](lesson:physics.newtonian-mechanics.potential-energy#thm-force-from-potential)）」。
- `conservative-forces:30` 改成「……；沿直线运动时，它就是[势能与机械能守恒](lesson:physics.newtonian-mechanics.potential-energy#thm-force-from-potential)里推出的$F=-\dv Ux$」，不再像新结论。
- `potential-energy` 第 6 题（1）没动：那里证的是「只随位置变化的力是保守力」，讲解推的是反过来由势能求力。
- 前置都不变。

**（2）`drag` 例 2 的 $\int_0^t$**

- 推导改成：位置$x$是速度的原函数，$x=-16e^{-t/4.0}+C$，由$x(0)=0$得$C=16$。前置不变。
- 第 5 题参考解答（2）同样改成：求原函数，再由$x(0)=0$定常数。
- 同类：
  - 第 6 题参考解答（2）原来写「从$y=0$、$v=v_0$积到$y=h$、$v=0$」，用的也是定积分。改成「……$+gy$不随$y$变化，比较$y=0$和$y=h$两处」，用的是「导数为零的函数是常数」，它在链上。
  - 例 1 的「积分得」补了「由$t=0$时$u=0$定出常数是零」。
  - 10 节里只有 `drag` 的链上没有 `fundamental-theorem`，别的节用定积分都在链上。

### 重要 2

- `drag` 第 4 题解答改成：「再过$2.0\,\mathrm s$才减到原来的$\frac13$，又过$2.0\,\mathrm s$只减到$\frac14$：每过$2.0\,\mathrm s$，$\frac1v$增加同样多，速度减得越来越慢，船越来越难停下。」
- 同类：10 节提示和解答里附带的数又逐题核了一遍，没有别的错。

### 小问题 1

- `potential-energy:80`：误区改成「物体除了保守力还受别的力，例如支持力，机械能就不守恒」，解释改成「要看那些力做的功是不是零」。同类：别处没有把支持力叫作非保守力。
- `drag:16`：「比子弹还快」改成「即$720\,\mathrm{km/h}$，是高铁的两倍」，按规范写「是……的两倍」。
- `drag:30`：终端速度的定义改成「速度为某一个值时，阻力正好和重力相等，合力为零，以这个速度下落的物体就一直保持这个速度，这个速度叫作终端速度」，句末加「从静止开始下落的物体，速度越来越接近$v_T$」。和`:41`不再矛盾。
- 术语简介：
  - 稳定平衡：「质点稍稍离开后力把它推回来的平衡位置，在势能的极小值点；$U'=0$、$U''>0$处一定是。」
  - 不稳定平衡：「质点稍稍离开后力把它推得更远的平衡位置，例如势能的极大值点；$U'=0$、$U''<0$处一定是。」
- 同类，又改了两条简介：
  - 转折点：「势能等于机械能$E$、力不为零的点；质点到那里速度为零，随即掉头」，和讲解的边界情况一致。
  - 终端速度：去掉「增大到」，补「从静止下落的物体越来越接近它」。
  - 其余简介逐条对过讲解，没有把充分条件写成定义的。

### 小问题 2

- `center-of-mass-frame:41`：改成链到[碰撞](lesson:physics.newtonian-mechanics.collisions#thm-elastic-1d)。同类：10 节的正文和题目里，再没有不带链接的「某某一节」。
- `conservative-forces:16`：滑动摩擦力的括注里加「见[摩擦力](lesson:physics.newtonian-mechanics.friction)」。`:25`是第二次出现，不再加。
- `rockets`：
  - `:50`补「质量比（mass ratio）」，`:74`补「重力损失（gravity loss）」。
  - 同类：定理名里的「齐奥尔科夫斯基公式」补了 Tsiolkovsky rocket equation。
- `work-energy` 第 5 题题干：$T=\frac{mv^2}r$后面加了「（见[圆周运动的动力学](lesson:physics.newtonian-mechanics.circular-dynamics)）」。
- 同类，用了链外结论的地方加了链接：
  - `rockets` 例 1（正文）和第 5 题参考解答里，绕地球表面附近做圆周运动需要约$7.9\,\mathrm{km/s}$，链到[万有引力定律](lesson:physics.newtonian-mechanics.gravitation)。
  - `conservative-forces` 第 7 题的「磁场对运动电荷的力」，链到[磁场与洛伦兹力](lesson:physics.electromagnetism.lorentz-force)。
- 同类，补了英文括注：
  - 正文：`momentum-conservation:32`「双星（binary star）」，`collisions:59`「减速剂（moderator）」。
  - 题目：`collisions` 第 7 题「溃缩区（crumple zone）」，`center-of-mass-frame` 第 5 题「对撞机（collider）」。
  - 单位「焦耳」「瓦特」照电磁学写「欧姆」「法拉」的先例，不括注。

### 小问题 3

- `momentum-conservation:52`：替代文字改成照 SVG 的注释。
  - 实线是炸开前的轨迹，虚线是原来的抛物线。
  - 原来写碎片$A$「向左上方飞出」。图上它对地的初速度是$(2,6)$，几乎竖直向上、稍稍偏右，现在改成「几乎竖直地向上飞出、再落下」，SVG 的注释也跟着改了。这一处报告没提。
- `potential-energy:55`：改成「上方偏右」画着$m\vb g$，「左边标出$h_A$，右边标出$h_B$」，SVG 的注释同步改了。
- 同类：6 张图的替代文字又逐张对过图，另改了两处。
  - `center-of-mass-frame`：原来说画了质心速度$\vb v_{\mathrm C}$的箭头，图上只在$\vb v_1$的中点标了$\vb v_{\mathrm C}$，照图改了。
  - `rocket.svg`：原来说「一条数轴」，图上是两条，上面一条只有火箭的速度，下面一条有火箭和燃气的速度，照图改了。
- 现在 6 张图的替代文字和 SVG 的注释逐字相同。几何都没动，只重新生成了注释。

### 报告里「没报」的几处（调度员要求一起改）

- 同一块里同一个术语标了两次：去掉了 `potential-energy` 定理里的第二个「机械能」、`energy-diagrams` 定理里的「稳定平衡」「不稳定平衡」。同类：用脚本按块扫了 10 节，没有别的重复标记。
- `work-energy:73`：「见 p5」改成「见第 5 题」，照 `common-forces`、`kinematics-vectors` 的写法。同类：10 节正文里没有别的「见 pN」。
- `drag` 第 7 题参考解答：水滴半径改成约$0.005\,\mathrm{mm}$。
- 行内公式等号多的那一条，审查说 768 px 下不溢出、只关乎风格，调度员没列，没改。

### 撤回

- 单变量微积分 `hyperbolic-functions:55` 的「终端速度」标记已撤回，文件和 HEAD 一致，`git diff` 为空。
- 另外 5 个别的领域的文件，即 `relativistic-collisions`、`virtual-work`、`magnetic-force-on-currents`、`poisson-equation`、`lyapunov-stability`，保持上一轮补完的样子。

### 别的改动

- `minutes`：`potential-energy` 加了一段，全文 1582 个汉字，从 28 改成 30；`momentum-conservation` 1555 个汉字，从 29 改成 30。都不超过 30。

### 修订后跑过的

- `npm run content`：0 个错误、0 个警告。
- `npm test`：23 个文件、202 项全部通过。
- 30 道简单题、中等题的数值答案用独立算法重算，全部一致。
- 10 节 1891 个公式过 `compileTex`、`suspectTex`，0 个问题。
- 文字和链接：段落句数、中英文空格 0 处；链接 47 个，文字都和目标标题一致。
- 术语按块重扫，只剩已知的误报。
- 页面：用临时副本建网站，进度写临时目录，768 px 下改过的 9 节展开全部提示和解答。
  - 不横向溢出，KaTeX 错误 0。
  - 定义卡片数等于锚点数，10 节共 39 张，多出的一张是新加的 `thm-force-from-potential`。
- 前置没改，层级不变。

## 复核

审内容会话，2026-11-17。

### 结论

通过，没有新的问题。10 节的 `status` 已改成 `reviewed`；别的领域 5 个文件的 `status` 没动。

- 重要 2 条、小问题 3 类 10 处都修了，修法和建议一致。
- 「没报」的几处也照改了：重复标记、`work-energy:73`、`drag` 第 7 题的水滴半径。
- 修订说明写的「同类」改动逐处对过，都对。
- 汇报里说的和实际改动对得上，没有改了没写的地方。

### 和快照比，这一轮改了哪些文件

- 正文改了 9 节：`momentum-impulse` 没动。
- `problems.yaml` 改了 6 个：`work-energy`、`collisions`、`center-of-mass-frame`、`rockets`、`conservative-forces`、`drag`。只改了题干、解答、参考解答里的文字和链接，标准答案没动。
- `_domain.yaml` 改了 4 条简介：转折点、稳定平衡、不稳定平衡、终端速度。
- 3 张 SVG 只改了注释：`explosion.svg`、`rocket.svg`、`paths.svg`。去掉注释逐行比，图形一字未变。
- 前置都没变。`minutes`：`potential-energy`、`momentum-conservation` 改成 30，没超过上限。

### 逐条

- **重要 1（1）**：`potential-energy` 新加的「由势能求力」（`:41`–`:49`）对。
  - $U(x)=\int_x^{x_0}F\,\dd s$ 照的是本节 `:30` 的势能定义；用到的微积分基本定理经 `work-energy` 在链上。
  - 括注的英文和单变量微积分 `fundamental-theorem` 的写法一致。
  - `energy-diagrams:22`、`conservative-forces:30` 链到这个锚点，锚点存在，链接文字就是小节标题。
- **重要 1（2）**：`drag` 例 2（`:88`）、第 5 题参考解答都改成「求原函数，再由 $x(0)=0$ 定常数」，链上的东西够用。第 6 题参考解答改成「导数为零的函数是常数」，也对：$\frac{v_T^2}2\ln\bigl(1+\frac{v^2}{v_T^2}\bigr)+gy$ 对 $y$ 的导数是零。
- **重要 2**：`drag` 第 4 题解答改成「再过 2.0 s 减到 $\frac13$，又过 2.0 s 只减到 $\frac14$」。按 $\frac1v=0.1+0.05t$ 核过，对。
- **小问题 1**：四处都改了。
  - `potential-energy:89` 改成「除了保守力还受别的力」；
  - `drag:16`：720 km/h 约是高铁的两倍，对；
  - `drag:30` 的终端速度定义和 `:41` 不再矛盾；
  - 两条简介把 $U''$ 的条件改成充分条件。不稳定平衡写「例如势能的极大值点」，比照稳定平衡改得更准：$x^3$ 在 0 处也是不稳定平衡，却不是极大值点。
- **小问题 2**：四处都改了，链接都有效；另补的链接、英文括注也都对。
  - `rockets` 两处 7.9 km/s 链到大纲 `gravitation`，它的 goal 正是「求圆轨道的速度」。
- **小问题 3**：替代文字和图逐张对过，都对上了。另改的 `cm-frame`、`rocket` 两处也对。
  - 碎片 $A$ 改成「几乎竖直地向上飞出」。按图算，它的初速度和水平成 72°，「几乎竖直」略宽，不算错。
- **术语**：按块重扫，新出现的都是误报：
  - 只当节名用的链接文字（「势能与机械能守恒」「功与动能定理」「摩擦力」「万有引力定律」）；
  - 「limit」里的「lim」，「齐奥尔科夫斯基」里的「基」。
  - 三处重复标记已经去掉。

### 别的领域的文件

5 个文件都写于批次 4 以后，在规矩 C 补标的范围里。

| 位置 | 改动 | 判断 |
| --- | --- | --- |
| `relativistic-collisions` 第 5 题题干（`:90`）、参考解答（`:103`） | 链到 `center-of-mass-frame` | 对，照第一轮的建议两处都加了。参考解答指到例 2，例 2 正是这个结论。 |
| `virtual-work` 第 8 题提示（`:170`） | 链到 `energy-diagrams#thm-stability` | 对。题目文字只加链接就够。 |
| `magnetic-force-on-currents:83` | 「稳定平衡」「不稳定平衡」标牛顿力学的 id，括注英文 | 对。势能 $U(\theta)$ 的极小、极大，意思相同；这一节只有这一处。 |
| `poisson-equation:50` | 「稳定平衡」标牛顿力学的 id | 对。点电荷的势能 $q\varphi$ 取极小，意思相同；只有这一处。 |
| `lyapunov-stability:25` | 「稳定平衡点」整个词标 `stable-equilibrium` | 对。说的是分析力学里无阻尼小振动的平衡点，意思相同；复合词整词标，符合规矩。 |

- `:27` 的「孤立的稳定平衡点」说的是一维自治方程的平衡点，意思是常微分方程的稳定，没标是对的。
- `hyperbolic-functions` 回到 HEAD，`git diff` 为空。那一段紧跟本领域自己的 `def-terminal-velocity` 锚点，两边各讲各的，撤回是对的。
- 我又把全站扫了一遍：这一批里中学没有系统讲过的 24 个术语，看在别的领域已写小节正文里链外出现、没标的地方，没漏标的。查到的都有不标的理由：
  - 「外力」「阻力」「势能」「机械能」是中学基础词；
  - 「推力」意思不同（手推、光压、磁力）；
  - `bifurcations:59`、`lyapunov-stability:27` 的「稳定平衡点」是常微分方程的意思；
  - `virtual-work`、`small-oscillations`、`phase-space-liouville` 写于批次 1–3，不补；
  - `relativistic-collisions:30` 的「质心系」第一轮已定不标。

### 跑过的命令

- `npm run content`：0 错误、0 警告。
- 公式检查：1991 个公式，0 个问题。
- 链接、锚点、层级脚本：链接都有效；层级和第一轮相同。
- 段落句数：没有超过 4 句的。
- `npm run verify`：304 节全部一致。
- 页面：临时副本建站，服务在 3151 端口，进度写临时目录。
  - 768 px 下改过的 9 节全部展开，横向溢出 0，KaTeX 错误 0。
  - 定义卡片 39 张，等于锚点数，新卡片显示正常。
  - 看完先删联接、再删副本。
- `progress/`：页面检查前后校验和相同。

### 要写回 plan.md 的（复核补充）

- 一维的 $F=-\dv Ux$ 在 `potential-energy`「由势能求力」（`#thm-force-from-potential`）推出，`energy-diagrams`、`conservative-forces` 链过去；以后的「简单谐运动」「引力势能与逃逸速度」也可以链这里。
- 规矩 C 不标的词（这一批定的）：外力、阻力、势能、机械能当基础词；「推力」只在火箭的意思下标。

### 没验证的地方

- 别的领域 5 个文件的页面没打开看。改动只是术语标记和链接，构建已经校验了 id 和锚点。
- 只看了深色主题和 768 px 宽度，同初审。

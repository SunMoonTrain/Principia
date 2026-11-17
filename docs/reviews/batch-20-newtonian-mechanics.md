# 批次 20 审查报告：牛顿力学（引力、有心力和非惯性系）

范围：`gravitation`、`gravitational-potential`、`central-forces`、`shell-theorem`、`kepler-orbits`、`two-body-problem`、`accelerating-frames`、`rotating-frames`、`earth-rotation`、`angular-momentum-systems` 10 节；补标后退回 written 的 `circular-dynamics`（:60）、`angular-momentum`（:49）。

**重要 2 条，小问题 3 类，原有问题 1 条。** 第 3 类小问题是补做页面检查时发现的，见文末「补充」。

- 重要：① 推理用到前置链上没有的概念（3 处：`angular-momentum-systems` 的功和动能、两节的角速度、`rotating-frames` 的功）；② `earth-rotation` 里「重力」的说法和 `common-forces` 的定义对不上。
- 小问题：① 说法或数不准（3 处）；② 惯性力的定义没扩充就用到了转动参考系；③ 动画说明的「黑点」在深色主题下是白点（补充检查发现的）。
- 原有问题：`angular-momentum:77` 的「拉力」（plan 已记），这次 `angular-momentum` 退回了 written，可以一起改。

## 没做完的

- 768 px 下展开提示和解答看页面、7 张 SVG 量出界和碰线、4 个动画拖到滑块两端：初审时没做，后来补做了，见文末「补充」。
- `tsc` 和全量 `npm run verify` 由调度员跑完了：`tsc` 通过；`verify` 只有 `earth-rotation` 第 4 题不一致（脚本算得 0.09913°，标准答案 0.09896°），正是小问题 1 那一处，答案改成精确式以后就会一致。其余题目全部一致，包括这一批新写的 10 个验算脚本。
- 10 节的 `status` 都没动，仍是 written。

## 跑过的检查

- **简单题、中等题**：40 道都用 `npm run statements` 读题，独立写脚本验算，每题两套算法（脚本在 `tools/verify/physics.newtonian-mechanics.<小节>.ts`）。
  - 39 道和标准答案一致。
  - `earth-rotation` 第 4 题：标准答案用的是近似式，见小问题 1。
  - 第二套算法：
    - 平方反比引力下积分轨道，时间变量换成 $\dd t=r\,\dd s$，积到转过半圈。由此二分出圆轨道的速率、另一个拱点、周期。
    - 两个质点各自按牛顿第二定律完整模拟，不用约化质量。
    - 球体的引力：对 $(r',\theta)$ 做二重数值积分求势能，再数值求导，不用球壳定理。分层地球试了两种密度分布，结果相同。
    - 非惯性系的题都换到惯性系里算：解线性方程组，或者对轨迹数值求导。
    - 傅科摆在地面参考系里积分 2 小时，科里奥利力用完整的 $\boldsymbol\omega$ 按分量算，量出摆动平面转动的角速度。
  - `_nm.ts` 加了 `keplerHalf`、`circularSpeed`、`circularPeriod`、`twoBodyHalf`、`bisectN`、`spherePotential`、`sphereField`。
- **提示、解答、难题**：80 道题的提示、解答、参考解答里的数逐个手算过。除小问题 1 那一处外都对。
- **公式**：10 节的正文、题目（含参考解答）和 106 条术语，共 2228 个公式过 `compileTex`、`suspectTex`，0 个问题。
  - 行内公式有三个以上等号的 44 个。批次 19 的做法是 768 px 下不溢出就不报，这次页面还没看，没下结论。
- **链接**：这 10 节一共 43 个链接，目标和锚点都存在，链接文字都等于标题。全站指向这 10 节的链接、标记也逐个看过。
- **术语**：
  - 按块扫了每块第一次出现和每节第一次的英文括注，剩下的都是误报或有先例的写法。
  - 误报：「好像」里的「像」，「力心」「反作用力」里的「力」，「同步」「焦点」「中心」，以及只当节名用的链接文字。
  - 有先例的写法：「总:term[动量]守恒」这种写法，批次 19 的 `collisions`、`potential-energy` 也这样写。
  - 20 条新术语的简介、锚点都核过，惯性力那条见小问题 2。
- **规矩 C**：这一批不是中学基础词的新术语，在别的领域已写小节里没有要补的。
  - `virtual-work:83`、`:88` 的「惯性力」，照 plan 不补。
  - `rigid-body-kinematics:54` 是分析力学自己的「角速度矢量」定义段，不动。
- **前置与层级**：
  - 层级和确认的一致：`two-body-problem` 第 18 层，`earth-rotation` 第 16 层。
  - 前置没有多余的。
  - 链外用到的概念见重要 1；下面推荐加的三处前置，按整张图模拟，层级 0 处变化。

## 重要 1 · 推理用到前置链上没有的概念（3 处）

1. **`angular-momentum-systems` 的功和动能**：`work-energy` 不在链上。
   - 用到的地方：
     - 例 1 问「两人一共做了多少功」（`:65`）；
     - 推导用动能和「增加的 840 J 是肌肉做的功」（`:69`）；
     - 第 6 题（3）同样问功；
     - `:53` 旁白里的「动能」也标了 `work-energy` 的 id。
   - 推荐加 `work-energy` 为前置：仍在第 14 层，全图 0 节变化，原有前置不会变多余。
   - 另一个做法：删掉问功的部分。
2. **角速度**：`circular-motion` 不在 `angular-momentum-systems`、`angular-momentum` 的链上。
   - `angular-momentum-systems` 用到的地方：例 2 问绕质心转动的角速度（`:73`、`:77`），误区 `:82`，第 1、3、6 题；`:73`、`:82` 标了 `circular-motion` 的 id。
   - 根子在 `angular-momentum`：`:37` 写了 $L=mr^2\omega$，`:75` 标了「角速度」。这是批次 18 漏掉的。
   - 推荐给 `angular-momentum` 加 `circular-motion`：仍在第 12 层，0 节变化，两节一起接上。`angular-momentum` 这次已经退回 written，正好一起改。
3. **`rotating-frames` 的功**：`work-energy` 不在链上。
   - 用到的地方：`:58`「在 $S'$ 里不做功」，`:81` 误区「不做功」。
   - 推荐改写成「它垂直于 $\vb v'$，只改变方向、不改变速率」，链保持最少，照批次 19 `drag` 的做法。
   - 另一个做法：加 `work-energy`，0 节变化。

## 重要 2 · `earth-rotation` 里「重力」的说法

- `earth-rotation:25` 写「量到的:term[重力]（weight）是这个吸引和离心力的合力」。可 `common-forces#def-weight` 把重力定义成地面附近地球对物体的吸引力，浮窗显示的也是这句，读者在同一处看到两种说法。
- 照调度员定的办：只在 `earth-rotation` 写明 `common-forces` 的说法是不计自转时的近似，加链接到 `common-forces#def-weight`，`common-forces` 不动。可以放在 `:25` 定理后面，或放在 `:29` 那一段。

## 小问题

1. **说法或数不准（3 处）**
   - `shell-theorem` 第 3 题解答说「不到地面上的两千分之一」。实际 $5.59\times10^{-3}/9.8\approx\frac1{1750}$，比两千分之一大。可改成「约为地面上的一千七百分之一」或「不到千分之一」。
   - `central-forces:38`「$U$ 在 $r\to0$ 时又不比 $\frac1{r^2}$ 降得快」：这句把 $U=-\frac c{r^2}$ 也包进去了。那时 $2mc>L^2$ 的话墙挡不住，第 5 题讲的正是这种情形。改成「比 $\frac1{r^2}$ 降得慢」。
   - `earth-rotation` 第 4 题：
     - 标准答案按近似式算是 0.09896°；按题面字面，把吸引和离心力按矢量相加，精确值是 0.09913°，差 0.17%。
     - 在 0.5% 的容差以内，读者不会被判错。可 plan 规定「用近似式估算的数值题，题面写明按哪个近似算」，而且 `npm run verify` 会一直报不一致。
     - 推荐答案改用精确式 `atan(w²R sinλ cosλ/(g0 − w²R cos²λ))`，解答里补一句「近似式给 0.0990°」；也可以在题面写明按讲解的近似式算。
2. **惯性力的定义没扩充就用到了转动参考系**
   - `accelerating-frames:35` 只把平动参考系里的 $-m\vb a_0$ 定义为惯性力，`rotating-frames:60` 却说离心力、科里奥利力「都是惯性力」。plan 有一条「判断要按本节自己的定义」。
   - 术语简介已经是宽的说法：「非惯性系里为了照用牛顿第二定律而加上的力」。
   - 推荐把 `accelerating-frames:35` 的定义改成和简介一致：「非惯性系里为照用牛顿第二定律而给质点加上的力叫作惯性力；平动的 $S'$ 里它是 $-m\vb a_0$」。

## 原有问题

- `angular-momentum:77` 例 2 用了「拉力」并标了 `tension`，可 `common-forces` 不在它的链上（plan 批次 19 记的）。这次 `angular-momentum` 退回了 written，可以和重要 1 第 2 处一起改。
  - 推荐改成「绳子对小球沿绳指向小孔的:term[力]」，层级不变。
  - 加 `common-forces` 的话，`angular-momentum` 从第 12 层变成第 13 层。

## 写稿员「拿不准的」6 条

1. 分钟 28–30：同意，都不超过 30。
2. 引力势能、重力势能都括注 gravitational potential energy：可以，两者英文本来同名，不改。
3. `gravitation` 在球壳定理之前把地球当作质点：
   - 理想化已经写进定理的条件（`:32`），并链到球壳定理说明为什么准，符合 plan「理想化条件写进条件里」；
   - 推理没用到后面小节的结论。同意。
4. 开普勒三定律分三条进表，`angular-momentum` 退回 written：同意。`:49` 补标对，后面小节的术语可以提前标，也括注了英文。
5. `rotating-frames` 例 1 引号里的「重力」不标：同意。它说的是感到的「重力」，不是那个术语；同一块里真正说重力的 `:74` 标了。
6. 「信风」不加锚点：同意。那句是在解释中学学过的词为什么是这个方向，不是起名。

## 调度员要对的跨领域写法

- `gravitational-potential` 和 `improper-integrals` 例 1：一致。
  - $F(x)\Big|_a^{+\infty}$ 在 `improper-integrals:27` 定义；本节 `:36` 写 $\frac{GMm}s\Big|_r^{+\infty}$。积分变量换成 $s$，因为 $r$ 用作下限了，合理。
  - 那边算克服引力做的功 $+\frac{GMm}R$，这边算引力做的功，得 $-\frac{GMm}r$，两边一致。
- φ 和 θ：一致。
  - `polar-area:25` 加了「物理里极角常写成 $\varphi$」；
  - `central-forces:22` 写 $x=r\cos\varphi$，`:29` 写面积公式 $\frac12\int r^2\,\dd\varphi$。
- πab：一致。
  - `area-between-curves` 例 2（`:103`–`:115`）算出 $\pi ab$；
  - `kepler-orbits:50` 的链接写节名「微元法与平面图形的面积」，和标题一致；这一节经 `central-forces` 在链上。

## 值得一提的

- 「角速度矢量」两个领域各有一条：分析力学 `rigid-body-kinematics`，本领域 `rotating-frames`。
  - 意思一样，本领域这条只管绕固定轴转。
  - 全站已有 30 多对同名术语，例如「惯性系」在本领域和狭义相对论各一条。照 plan「同一个概念两个领域都要讲时，各自定义、各自标自己的 id」，不算问题。
- `earth-rotation:38`–`:39`：证明那一段和「### 傅科摆和信风」之间少一个空行。页面上是否照样显示成三级标题，还没看。

## 快照

初审的快照在审查会话的 scratchpad `snap20/`（12 节加 `_domain.yaml`），复核时拿来比，复核完就删。

## 补充：页面、SVG、动画（2026-11-18）

**结论：页面、SVG、动画都没有要修的；新发现 1 处小问题（动画说明的「黑点」，见下面「小问题 3」），另有 1 处贴边可以顺手改。**

- **做法**：
  - 写稿员在改工作区，所以用 HEAD 加初审快照 `snap20/` 建临时副本，没用工作区。
  - 副本里 `npm run content` 0 个错误、0 个警告，`vite build` 通过。
  - 服务起在端口 3152，进度写 scratchpad 的临时目录。
  - 看完先删 `node_modules` 联接、再删副本；`progress/` 前后的校验和相同。
- **768 px 页面**：10 节都把提示、解答全部展开，每节 32 次点击，含「确定放弃」。
  - 页面横向溢出 0；题目卡片里没有要横向滚动的公式；KaTeX 错误 0。
  - 定义卡片 40 张，等于锚点数，各节依次是 4、3、4、2、4、4、4、6、4、5。
  - `earth-rotation:38`–`:39` 少的那个空行不影响显示：「傅科摆和信风」照样是三级标题，正文里没有漏出「###」。
  - 44 个行内长式子都不撑宽页面。
    - 只有 `shell-theorem` 第 3 题解答里那串 $g=\frac{GM}{R^2}=\frac43\pi G\rho R=\cdots$ 比段落宽 11 px，伸进了卡片的内边距，没碰边框，也不出现滚动条。
    - 这一题的解答正要改「两千分之一」，可以顺手拆短，不改也行。
- **SVG**（7 张）：在页面上量 `getBBox`，沿每条线、每条路径按 1 px 采样查碰线。
  - 出界、文字相叠、碰线都是 0；没有 `script`、`foreignObject`。
  - 文字离线最近：拉丁字母 2.13 px（哑铃图的 $\vb r_{\mathrm C}$），汉字 3.98 px（车厢图的 $\vb F_{\text{惯}}$）。
  - 逐张核了几何和讲解、替代文字：
    - `orbits.svg`：e = 0.6 的椭圆宽是圆的 5 倍、高是 4 倍，力心离椭圆中心 1.5 个圆半径，正是 $a=2.5r_{\text{近}}$、$b=2r_{\text{近}}$、$ae=1.5r_{\text{近}}$。
    - `two-body.svg`：两个时刻 $m_1$、$C$、$m_2$ 都共线，$m_1$ 到 $C$ 的距离是 $m_2$ 的 0.505、0.506 倍；两个椭圆的偏心率都约 0.5，大小之比约 1:2，朝相反的方向伸展。
    - `car-pendulum.svg`：绳子偏 30.0°；拉力、重力、合力（右图是惯性力）的箭头长 64.6、56.0、32.3，满足勾股定理，合力和重力之比 0.577 = tan30°。
    - `turntable.svg`：地面上 5 个点等距排在直线上；转盘上看是向右弯的螺线，终点转过 90°；中间那一点的科里奥利力指向前进方向的右边。
    - `earth.svg`：$\lambda=40^\circ$；两个分量长 42.4、50.6，正是 $66\sin40^\circ$、$66\cos40^\circ$，首尾相接正好到 $\boldsymbol\omega$ 的箭头尖；竖直分量蓝、水平分量绿，和 `:59` 说的一致；两组信风都偏向西。
    - `dumbbell.svg`：质心等间距沿直线走，每一步转 60.0°、59.4°、60.1°；大球到质心的距离是小球的一半。
    - `shell.svg`：左右两种情形、细环、$\theta$、$s$ 的画法都和替代文字一致。
- **动画**（4 个）：滑块拖到两端截图看过，都看得清，各条线的颜色和说明里的蓝、橙、绿对得上。
  - `gravitation`：$k=0.5$、$2$。
  - `gravitational-potential`：$v_0=0$、$12.5$。12.5 时绿线在零以上、和蓝线不相交，也不压纵轴标签。
  - `central-forces`：$L=0.6$、$E=-1.2$ 时两个转折点在 0.263、0.570；$L=1.6$、$E=0.5$ 时只剩近心点 0.887，最低点浅而靠右。
  - `shell-theorem`：$a=0$ 时两条线重合，没有空洞，应当如此；$a=0.95$ 时空心球在 0.95 以内为零，过了 $R$ 和均匀球体重合。

### 小问题 3（补充检查发现的）· 动画说明的「黑点」

- `gravitational-potential:73`「黑点是它能到达的最高处」、`central-forces:88`「黑点是 $r$ 的转折点」：FunctionPlot 用文字色画点（`packages/anim/src/FunctionPlot.tsx:185`），深色主题下画出来是白点。
- 推荐改称「圆点」，深浅两种主题都对。
- 批次 19 的 `energy-diagrams:74` 也写「黑点」（已审）。改不改由调度员定，改的话那一节要退回 written。

## 复核（2026-11-18）

**通过，没有新问题。13 节的 status 已改成 reviewed**：本批 10 节，补标后退回的 `circular-dynamics`、`angular-momentum`，因「黑点」退回的 `energy-diagrams`。

写稿员的修订说明在共享笔记 `nm-writer-batch20.md` 的「初审后的修订」「复核前的补充修订」两节。和初审快照比，改过的文件和修订说明一一对得上，没有改了但没报的。

- **重要 1**：
  - `angular-momentum-systems` 加了 `work-energy`，`angular-momentum` 加了 `circular-motion`。两节用到的功、动能、角速度都在链上了。
  - `rotating-frames:58`、`:81` 改成「只改变运动（速度）的方向，不改变速率」。两处的「速率」都是块里第一次出现，标 `speed` 对。
  - 大纲 `rotational-energy` 去掉了多余的 `work-energy`。
  - 层级没变：`angular-momentum` 12、`angular-momentum-systems` 14、`fixed-axis-rotation` 15、`rotational-energy` 16、分析力学 `cyclic-coordinates` 17；全图多余前置 0。
  - 链外扫描：13 节里标了的术语，定义的小节不在链上、又不是后面层级提前提到的，现在 0 处。
- **重要 2**：`earth-rotation:29` 加的那句对。链到 `common-forces#def-weight`，链接文字等于标题；「大小最多只差 0.35%」就是赤道上的 $\omega^2R/g$。
- **小问题 1**：
  - `shell-theorem` 第 3 题改成「不到地面上的千分之一」，对，实际约 1/1750。长式子拆成两句，段落仍是 4 句。
  - `central-forces:38` 改成「比 $\frac1{r^2}$ 降得慢」，对。
  - `earth-rotation` 第 4 题：答案改成精确式，值 0.0991314°，和我的脚本按矢量相加独立算出的一致。提示和解答里的数都重算过：$3.385\times10^{-2}$、$1.693\times10^{-2}$、$9.783$、$1.730\times10^{-3}$、$0.0991^\circ$，近似式给 $0.0990^\circ$，相差不到千分之二。
- **小问题 2**：`accelerating-frames:35` 改成宽的定义，和术语简介一致。连带改的 `:37` 加了「平动的 $S'$ 里」，`:39` 去掉了同一块里重复的标记，都对。
- **小问题 3**：「黑点」改「圆点」共 8 处：`gravitational-potential:73` 2 处、`central-forces:88` 2 处、`energy-diagrams:74` 4 处。本领域已经没有「黑点」；`energy-diagrams` 除了这 4 处只改了 status。
- **原有问题**：`angular-momentum:77` 改成「小球只受绳子对它沿绳指向小孔的:term[力]」，标 `force` 对，不再用链外的拉力。

写稿员自己多改的，也看了：

- `accelerating-frames` 第 7 题（3）把摩擦力换成弹簧的弹力（`problems.yaml:149`、`:162`）。`friction` 确实不在链上，弹簧的弹力在 `common-forces`，在链上；参考解答的道理也对：弹力只由形变决定，和质量无关。
- `earth-rotation` 的 `minutes` 29 → 30：加了一句以后合理，没超过 30。
- `earth-rotation:39` 补了空行。

跑过的检查：

- `npm run content`：改完 status 以后 0 个错误、0 个警告。
- 公式 2244 个过 `compileTex`、`suspectTex`，0 个问题；行内长式子少了 `shell-theorem` 第 3 题那一个。
- 链接：目标、锚点都在，链接文字都等于标题。
- 术语按块重扫：和初审比，新报的只有链接文字「常见的力」里的「力」，那里只当节名用，不算。
- 段落都不超过 4 句。
- 10 个验算脚本重跑：40 道题全部和标准答案一致，含 `earth-rotation` 第 4 题。
- 没重建网站看页面：这一轮只改了文字，没动图和动画；写稿员在临时副本里看过改过的 13 页，公式都不比所在段落宽。

快照 `snap20/` 复核完已删。

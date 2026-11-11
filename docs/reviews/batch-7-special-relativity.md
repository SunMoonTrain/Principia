# 批次 7 审查报告：狭义相对论（四维矢量与动力学 8 节）

审内容 agent（和写内容 agent 是两个独立会话，没有读它的会话记录、交接说明和自查脚本）· 2026-11-11

审查范围：`content/physics/special-relativity/` 下 `four-vectors`、`twin-paradox`、`four-momentum`、`mass-energy`、`relativistic-collisions`、`four-force`、`relativistic-action`、`relativistic-doppler` 8 节的 `lesson.md`、`problems.yaml`、3 张 SVG，`_domain.yaml` 新增的 26 个术语和 `\pdv`、`\T` 两个宏，以及批次 6 三节（`lorentz-transformation`、`spacetime-interval`、`velocity-transformation`）新加的 3 个术语标记。

## 结论

重要 0 条，小问题 2 条（同一类合成一条）。

- 32 道简单题、中等题的标准答案全部和独立验算一致（每题两种互相独立的算法）。32 道难题、思考题的参考解答和三级提示逐题读过，推导和数字都对。
- **小问题 1 · 前置**：`relativistic-action` 定理（3）的证明和例 2 都用到「拉格朗日量不显含时间时，能量函数守恒」。这是分析力学 `energy-function` 那一节的结论，不在前置链上。建议把它加进前置：全图层级不变，加了以后 `:42` 的两个标记要去掉。
- **小问题 2 · 写法**：
  - 2a：`mass-energy:42`「它们统称核子（nucleon）」起了名，没加锚点。
  - 2b：`four-force:116` 图的说明说双曲运动的世界线「越来越贴近渐近线，却永远追不上那条光线」。渐近线那条光线在飞船后面，是光追不上飞船（p6 就是这样说的），这里说反了，至少指代不清。
  - 2c：`four-momentum:36`「时间分量是一个常数加上牛顿力学的动能」：时间分量是 $E/c$，差一个因子 $c$。
- 你点名要查的几件事：
  - **记号**：8 节一致，第一次出现都交代了，和分析力学不冲突（位置见「记号与约定」）。查了这几项：
    - 指标用 $\mu,\nu,\rho,\sigma$；
    - $\gamma_u$；
    - 作用量写 $\mathcal S$；
    - 「下标分量，也叫协变分量」；
    - 「质量」都指静质量；
    - $x^0$ 共轭的是 $-E/c$。
  - **新宏**：`\pdv`、`\T` 和别的领域的同名宏逐字相同（`\pdv` 共 11 个领域，`\T` 共 3 个领域）。
  - **前置**：`four-momentum` 加的 `velocity-transformation` 合理、不多余。全图 656 节的层级都不变（见「前置」）。
  - **入链**：批次 6 里 8 处「以后讲」「见……」，本批都讲了（见「前置」后面的表）。
  - **史实和数字**：
    - 没有错。
    - 写内容会话没上网查的三项（比结合能、粒子质量、LHC 6.8 TeV），我查了，都对得上来源。
    - `binding-energy.svg` 的 20 个点按坐标反算，和 AME 的数值相差都在 0.003 MeV 以内。
- **批次 6 三节**新加的 3 个标记（四维矢量、双生子佯谬、四维速度）都对：id 在术语表里，这个词在各节里只出现这一次。三节的 `status` 已改回 `reviewed`（只改第 11 行）。
- **页面**：
  - 768 宽下 8 节和批次 6 那 3 节都不会左右滚动，KaTeX 错误为 0。
  - 手机宽度看了 `four-force` 的动画，亮色主题看了 `twin-paradox` 的 SVG。
  - 量了 3 张 SVG 在亮色主题下的对比度（见「几何图像」）。
- 修完以后 8 节都可以标 `reviewed`。`four-vectors`、`twin-paradox`、`relativistic-collisions`、`relativistic-doppler` 没有要修的。
- 写内容会话建议写回方案的两条我都同意，第 1 条建议补一句浮窗简介怎么写（见「要写回 plan.md 的」）。

| 小节 | 重要 | 小问题 |
| --- | --- | --- |
| `four-vectors` 四维矢量与闵可夫斯基度规 | 0 | 0 |
| `twin-paradox` 双生子佯谬与其他佯谬 | 0 | 0 |
| `four-momentum` 四维速度与四维动量 | 0 | 1（2c） |
| `mass-energy` 质能关系 | 0 | 1（2a） |
| `relativistic-collisions` 相对论碰撞与衰变 | 0 | 0 |
| `four-force` 四维力与相对论动力学 | 0 | 1（2b） |
| `relativistic-action` 自由粒子的作用量 | 0 | 1（1） |
| `relativistic-doppler` 相对论多普勒效应 | 0 | 0 |

编号对应下面的分类：小问题 1（前置）、2（写法）。

## 怎么审的

- 通读 `docs/plan.md` 已提交的规矩：87a0541（批次 6 审查定下的规矩）、5d1fadd（批次 7 的安排）、8e4c9db（判题和动画认反双曲函数）。
- 改动范围：
  - `git diff HEAD -- content/physics/special-relativity/` 看本批改动：
    - 8 节文件头：`status` 从 `outline` 改成 `written`；加了 `minutes`（7 节 35，`four-force` 40）和 `summary`。
    - 前置只有 `four-momentum` 改了，加了 `velocity-transformation`。
    - `_domain.yaml` 加了 26 个术语和 `\pdv`、`\T` 两个宏，原有的没动。
    - 批次 6 三节各改了一行（加标记），连同 `status`。
  - 8 份 `problems.yaml` 和 3 张 SVG 是新文件，直接读。
  - 和你说的对得上，没有说明之外的改动。
- 逐节读讲解、例题、常见误区，推导逐步核对。例题的数都重算过，列在「逐节」里。
- 简单题、中等题：只用 `npm run statements -- <8 个小节 id> --tier easy,medium` 读题，写完验算脚本、跑出结果以后才打开 `problems.yaml`。
- 难题、思考题：32 题的参考解答连同三级提示全部读了。关键的数另外算过，列在「逐节」里。
- 术语和格式：用脚本检查了下面几项，讲解和题目文字都查。
  - 每节第一次标记是否带英文；每个二级、三级标题下第一次出现是否标记（别的领域的词按规矩 C，对照前置链判断该不该标）。
  - 每段不超过 4 句、中英文之间有空格、引号用「」。
  - 45 个锚点段是否都以句号结尾、后面没有紧跟行间公式。
  - 「叫作」「这就是」「记作」「统称」这类起名的句子有没有锚点。
- 前置：
  - 用脚本算全图 656 节的层级，比较 `four-momentum` 有、没有新前置两种情形；同时查多余的前置和悬空的 id。
  - 沿 `relativistic-action` 的前置链查它用到的分析力学概念，并算了补前置后的层级。
- 入链：批次 6 里指向本批小节的 8 处（讲解的标记、题目的「见……」），逐处看本批讲了没有。
- 页面：
  - `npm run build` 后用 `.claude/launch.json` 的 `test-serve` 打开，进度写临时仓库，查完已停掉。
  - **768 宽（iPad 竖屏）**，查了 8 节和批次 6 那 3 节：
    - KaTeX 错误、每节题目数（都是 8）。
    - 定义卡片数等于锚点数：分别是 9、3、6、4、6、10、3、4。
    - 滑块的范围和初值和内容文件一致；读了画布像素，线画上了。
    - 页面不会左右滚动。
    - 3 张 SVG 用 `getBBox()` 量文字，沿线段、路径每隔 1 像素取点查压线。
    - 「四维速度」的浮窗打开看过。
  - **手机宽度（375 × 812）**：看了 `four-force` 的动画，量了画布和光线角度，截图看过（暗色主题）。
  - **亮色主题（1280 宽）**：截图看了 `twin-paradox` 的 SVG；3 张 SVG 都量了文字和线条的对比度。
  - 6 个函数图的式子另用动画组件自己的解析器在 Node 里求值，滑块取最小、默认、最大三档。
- 史实：
  - 上网查了贝尔托齐 1964、爱因斯坦 1905 年质能关系论文的日期、雷恩维尔 2005、反质子和贝伐加速器、GSI 2014、哈费尔-基廷。
  - 写内容会话没查的 LHC 6.8 TeV、核与粒子的质量、比结合能也查了。
  - 来源见「史实和数字」。
- 跑过的命令：
  - `npm run content`：0 个错误、0 个警告。
  - 本领域 16 个验算脚本逐个单独跑：64 题全部一致。
  - 全量 `npm run verify`：102 个小节全部一致，没有被常微分方程那边卡住，没有用临时副本。
  - `npx tsc -p tsconfig.node.json --noEmit`：通过。
  - `npm run build`：通过。

## 简单题、中等题的验算

脚本在 `tools/verify/physics.special-relativity.<小节>.ts`。批次 6 的辅助文件 `physics.special-relativity._relativity.ts` 加了几个函数：四维内积、按极化恒等式由「长度」凑内积、沿任意方向推进、用雷达法推进四维矢量、按波峰到达时间算多普勒频率比。两套算法互相独立：

1. **公式**：讲解里的式子。
2. **不用这些式子的算法**：
   - 换惯性系：批次 6 的雷达法（$S'$ 原点的钟收发光信号定坐标）。
   - 钟走多快：批次 6 的光钟，在 $S$ 里用二分法追光。
   - 内积：只用「时间分量的平方减空间长度的平方」，按极化恒等式凑出 $A\cdot B$，再沿几个方向推进，核对不变。
   - 动力学：用四阶龙格-库塔法直接积分 $\dv{p}{t}=F$，借用动画包里现成的积分器（`packages/anim/src/ode.ts`）。
   - 拉格朗日量：由 $L\,\dd t=-mc^2\,\dd\tau$ 和光钟的读数比得出，数值求导得动量，再算 $up-L$。
   - 多普勒：光源的钟每走一个周期发一个波峰（间隔用光钟算），到达的间隔扣掉光源位移在传播方向上的投影。
   - 碰撞：四维动量相加求不变质量；两体衰变对动量二分，阈能对入射能量二分。

| 小节 | p1 | p2 | p3 | p4 |
| --- | --- | --- | --- | --- |
| `four-vectors` | $5$ ✓ | A、B、D ✓ | $\frac{13}3$ ✓ | $1.5$ ✓ |
| `twin-paradox` | $8$ ✓ | A、B、E ✓ | $3.6$ ✓ | $\frac{\sqrt{11}}6$ ✓ |
| `four-momentum` | $\frac{\sqrt3}2$ ✓ | A、B、D ✓ | $1.12300$ ✓ | $40.6756\,\mathrm{ns}$ ✓ |
| `mass-energy` | $8.98755\times10^{13}\,\mathrm J$ ✓ | A、B、D ✓ | $0.941079$ ✓ | $3.269$ ✓ |
| `relativistic-collisions` | $300$ ✓ | A、C、E ✓ | $205.138$ ✓ | $279.663$ ✓ |
| `four-force` | $\frac{\sqrt2}2$ ✓ | B、D、E ✓ | $1.39859$ 年 ✓ | $0.989352$ ✓ |
| `relativistic-action` | $-0.6$ ✓ | A、C、D ✓ | $\frac{25}7$ ✓ | $\sqrt{10}$ ✓ |
| `relativistic-doppler` | $\frac13$ ✓ | A、B、D ✓ | $\frac5{13}$ ✓ | $1.25$ ✓ |

几个值得一提的做法（详细写在各脚本的 `notes` 里）：

- `twin-paradox` p1、p2 的 A：在地球系和乙去程的惯性系里各算一遍。去程系里回程的速度用雷达法换过去，不用速度变换公式。
- `twin-paradox` p2 的 C、E：
  - C：把掉头改成用时 $\delta$ 的匀变速，$\delta\to0$ 时乙的读数收敛到 8 年，年龄差不来自加速度。
  - E：随意取 4 条折线世界线，固有时都比直线短。
- `four-force` p2：
  - A：积分到 $Ft=100mc$，速度仍小于 $c$。
  - D：积分途中数值求 $\dv Et$，和 $\vb F\cdot\vb u$ 一致。
  - E：积分出的固有时和 $\operatorname{artanh}\frac uc$ 一致。
- `four-force` p4：在 MeV、m 的单位下积分到走过 2 m 为止，不用双曲运动的解析解。
- `relativistic-collisions` p2 的 C：在 0 到 $500\,\mathrm{MeV}/c$ 上数能量守恒式变号的次数，只有一个解。
- `relativistic-doppler`：
  - p2 的 A：同一个情形在光源静止系和观察者静止系里各算一遍。
  - p4：光源系里沿 $y'$ 发出的光，用雷达法换到观察者系，方向是 $(0.6,0.8)$，再按波峰到达时间算频率比。
- `relativistic-action` p2 的 D：$L+mc^2-\frac12mu^2$ 在 $u=0.01c$、$0.02c$ 两处之比约 16，按 $u^4$ 缩小。
- `four-vectors` p2 的 E：举了一组数，$\sum_\mu A^\mu B^\mu$ 推进后变了，所以错。
- 选择题里纯概念的选项按定义判，`notes` 里写明了，例如 `relativistic-action` p2 的 A。

## 前置

8 节里只有 `four-momentum` 改了前置：加了 `physics.special-relativity.velocity-transformation`。

- **合理、不多余，层级不变。**
  - 用到的地方：
    - `:16`（这一节要回答的问题）：相对论的速度变换下，牛顿的动量不守恒。
    - 例 2（`:109`）：用速度变换把碰撞换到 $S'$，得 $\frac{15}{17}c$。
    - p5：由四维速度的变换推回速度变换，时间分量那一行就是 `velocity-transformation:36` 的那个 $\gamma$ 的恒等式。
  - `velocity-transformation` 不在 `four-vectors` 的链上（那条链是 `spacetime-interval`、`lorentz-transformation`），所以不多余。
  - `four-momentum` 仍在第 20 层（`four-vectors` 第 19 层加 1）。脚本算了全图 656 节：去掉这个前置，层级会变的小节是 0 个。
  - 顺带的好处：`four-force` 用的快度（`:74`；`:78`「快度是可以直接相加的」）定义在 `velocity-transformation:43`，现在经 `four-momentum` 到了 `four-force` 的链上。
- **8 节的层级**：
  - 第 19 层：`four-vectors`、`twin-paradox`。
  - 第 20 层：`four-momentum`。
  - 第 21 层：`mass-energy`、`relativistic-collisions`、`four-force`、`relativistic-action`。
  - 第 22 层：`relativistic-doppler`，由 `physics.oscillations-waves.doppler-effect`（第 21 层）决定。
  - 没有多余的前置，没有悬空的 id。
- **跨领域的前置都用上了**：
  - 二次型：`four-vectors:60` 的惯性定律。
  - 双曲函数：`four-force` 的 $\sinh$、$\cosh$、$\tanh$。
  - 哈密顿原理：`relativistic-action`。
  - 声波的多普勒效应：`relativistic-doppler`。
  - 牛顿力学的碰撞：`four-momentum`。
- **缺的一处**见小问题 1。
- 下面几处不在链上，但只是链接或旁白，推理不靠它们，我不算缺前置：
  - `relativistic-action:106` 的「双曲运动」：同领域、同在第 21 层的 `four-force`，只说「就是那一节里的双曲运动」，加了链接和标记。
  - `relativistic-action` p7 的带电粒子拉格朗日量：题目文字，链接到分析力学的 `charged-particle-lagrangian`。
  - `relativistic-doppler` p5 和速度变换比较光行差：题目文字，有链接。

批次 6 里指向本批的地方，本批都接住了：

| 批次 6 的地方 | 说的是 | 本批讲的地方 |
| --- | --- | --- |
| `spacetime-interval:74`（标记「双生子佯谬」） | 直线的固有时最长「就是双生子佯谬的答案」 | `twin-paradox:31`、`:33` 链回 `#thm-max-proper-time`、`#def-clock-hypothesis`，`:37` 的定理 |
| `spacetime-diagrams` p6（`problems.yaml:119`） | 要比出谁真的慢，必须让两只钟重新相遇 | `twin-paradox:27` 到 `:33`「两只钟并不对称」 |
| `time-dilation` p8（`problems.yaml:153`、`:159`） | 1971 年的环球飞行 | `twin-paradox` p8 在地心参考系里算，链回 `time-dilation` |
| `spacetime-interval` p7（`problems.yaml:139`） | 洛伦兹变换保持 $c^2t^2-x^2$，见四维矢量 | `four-vectors:55`、`:62` 的定理 $\Lambda\T\eta\Lambda=\eta$ |
| `spacetime-interval` p6（`problems.yaml:108`） | $u(t)=\frac{at}{\sqrt{1+(at/c)^2}}$，推导见四维力 | `four-force:65` 到 `:78` 的双曲运动 |
| `velocity-transformation` p8（`problems.yaml:151`） | 同样的推力带来的速度变化越来越小 | `four-force:61`：$\dv ut=\frac{\alpha}{\gamma_u^3}$ |
| `lorentz-transformation:41`（标记「四维矢量」） | 以后讲四维矢量时，$ct$ 是第 0 个分量 | `four-vectors:48` |
| `velocity-transformation:36`（标记「四维速度」） | 这个恒等式以后讲四维速度时会用到 | `four-momentum:24`；恒等式在 p5 里出现 |

## 逐节

### physics.special-relativity.four-vectors 四维矢量与闵可夫斯基度规

已核对：

- 求和约定、洛伦兹变换的一般形式、四维矢量、闵可夫斯基度规、洛伦兹标量、三类四维矢量、下标分量的定义，以及每个定义的「为什么」和边界情况。
- 定理 $\Lambda\T\eta\Lambda=\eta$（`:62`）和内积不变（`:73`）的证明。
- 例 1：$A\cdot B=11$，$A'=(3,0,0,0)$，$B'=(\frac{11}3,-\frac73,2,0)$，换系后内积仍是 11。例 2：$(c,\vb u)$ 不是四维矢量，和正确的变换结果差一个因子 $\gamma_u$。
- `light-cone-vectors.svg`：三类矢量画在光锥内、锥面上、锥外，几何和说明一致。

题目都对：

- p5：$\Lambda\T\eta\Lambda=\eta$ 的矩阵构成群；$\Lambda^{-1}=\eta\Lambda\T\eta$；下标分量的变换。
- p6：类时矢量的静止系；和类时矢量正交的非零矢量是类空的；反向的柯西-施瓦茨不等式。
- p7：$x_4=ict$ 的写法。
- p8：类时、类光矢量的时间分量换系不变号，类空的会变，对应因果次序不变。

问题：无。`:60` 的「惯性定律（Sylvester's law of inertia）」和前置 `math.linear-algebra.quadratic-forms` 的 goal 用词相同，又有英文名，不会和牛顿的惯性定律混，不报。

### physics.special-relativity.twin-paradox 双生子佯谬与其他佯谬

已核对：

- 双生子佯谬的提法；两只钟为什么不对称（链回批次 6 的直线固有时最长、时钟假设）。
- 「沿世界线累加固有时」的定理和证明；乙掉头前后同时线的跳变；车库佯谬。
- 例 1：地球系里甲 10 年、乙 $2\times5\times0.6=6$ 年；在乙去程的惯性系里算出同样的结果。例 2：车库系里梯子 3 m、后门关的事件在梯子系里先于前门关。
- `twin-ladder.svg`：
  - 左图 $8.2$、$1.8$ 是乙掉头前后的同时线截地球世界线的读数：$0.8c$、4 光年时为 $5\pm0.8\times4$。
  - 右图车库系里的梯子、两扇门、关门事件，和例 2 一致。

题目都对：

- p5：在乙去程的系里算两人的固有时。
- p6：撞墙的梯子，「停下」的消息不超过光速，梯子尾先进门。
- p7：甲也做同样剧烈的加速，年龄差由世界线决定。
- p8：哈费尔-基廷在地心参考系里算速度的效应。按题给的 $V\approx400\,\mathrm{m/s}$、$u\approx250\,\mathrm{m/s}$、40 小时重算，向东 $-210\,\mathrm{ns}$、向西 $+110\,\mathrm{ns}$，和参考解答一致。

问题：无。

### physics.special-relativity.four-momentum 四维速度与四维动量

已核对：

- 四维速度、四维动量、四维动量守恒、无质量粒子的定义，以及「为什么」和边界情况。
- 「一个惯性系里守恒则各惯性系都守恒」、能量-动量关系的证明；单位 $\mathrm{MeV}/c$。
- 例 1：$\gamma_u=1.25$，$E\approx0.639\,\mathrm{MeV}$，$pc\approx0.383\,\mathrm{MeV}$，核对 $E^2=(pc)^2+(mc^2)^2$。例 2：完全非弹性碰撞 $M=2.5m$；换到 $S'$ 里小球 1 的速度 $\frac{15}{17}c$，牛顿的动量不守恒。
- 函数图：能量-动量的双曲线、无质量粒子的直线、牛顿的抛物线、四维动量的端点。

题目都对：

- p5：由四维速度的变换推出速度变换。
- p6：斜碰论证 $f(v)=\gamma(v)$。
- p7：为什么不用「相对论质量」。
- p8：无质量粒子不能静止；水里的光速和「无质量粒子以光速运动」不矛盾。

问题：小问题 2c（`:36`）。

### physics.special-relativity.mass-energy 质能关系

已核对：

- 静能、质能关系、结合能和质量亏损、反应能的定义和定理，「为什么」和边界情况。
- 例 1：$B=938.272+939.565-1875.613=2.224\,\mathrm{MeV}$，占 0.12%。例 2：$Q=17.590\,\mathrm{MeV}$，占燃料静能的 0.375%。
- 函数图：动能 $(\gamma_u-1)mc^2$ 和 $\frac12mu^2$。
- `binding-energy.svg` 的 20 个点（见「几何图像」和「史实和数字」）。

题目都对：

- p5：爱因斯坦 1905 年的论证。$S'$ 里两束光的能量之和是 $\gamma L$，物体动能少了 $(\gamma-1)L$，质量少了 $\frac L{c^2}$。
- p6：反应能等于结合能之差。裂变：$235\times7.59\approx1784$、$234\times8.4\approx1966$，$Q\approx180\,\mathrm{MeV}$，连同碎片衰变约 $200\,\mathrm{MeV}$。
- p7：「质量转化成能量」的说法哪里不对，什么守恒。
- p8：热茶比冷茶重。

问题：小问题 2a（`:42`）。

### physics.special-relativity.relativistic-collisions 相对论碰撞与衰变

已核对：

- 不变质量、零动量系、阈能的定义；「不变质量不小于各部分质量之和」、两体衰变、阈能公式的证明。
- 例 1：$\pi^+\to\mu^+\nu$ 中 $E_\mu\approx109.778\,\mathrm{MeV}$，动能 $4.120\,\mathrm{MeV}$，$p_\mu c\approx29.79\,\mathrm{MeV}$。
- 例 2：反质子的阈能 $7m_pc^2$，动能约 $5.63\,\mathrm{GeV}$；对撞时每个质子只要动能 $m_pc^2$。
- 函数图：实验室系里产物动量端点的椭圆、最大飞出角。$\beta\le0.6$ 时没有最大飞出角，直线不画，和说明一致。

题目都对：

- p5：等质量弹性碰撞后两粒子运动方向的夹角小于 $90^\circ$。
- p6：自由电子不能吸收或放出一个光子。
- p7：LHC 改成打静止靶要 $E_a\approx\frac{(13.6\,\mathrm{TeV})^2}{2\times0.938\,\mathrm{GeV}}\approx9.9\times10^7\,\mathrm{GeV}$，是对撞时单个质子能量的一万多倍。
- p8：$\beta$ 衰变的连续谱说明还有第三个产物。

问题：无。

### physics.special-relativity.four-force 四维力与相对论动力学

已核对：

- 力和功率、四维力、瞬时静止系、四维加速度、双曲运动的定义；四维加速度的模、纵向力 $F=\gamma_u^3ma$、双曲运动和它的固有时的证明。
- 例 1：以 $g$ 加速一年，$\frac c\alpha\approx0.970$ 年，$u\approx0.774c$，地球上过了 1.19 年。
- 例 2：电场中加速 $2\,\mathrm{MeV}$ 的电子，$\gamma_u\approx4.914$，$u\approx0.979c$，$pc\approx2.459\,\mathrm{MeV}$，用时约 $4.1\,\mathrm{ns}$。
- 函数图：双曲线、渐近线、牛顿的抛物线、从出发点发出的光线、船上的钟读 $\tau$ 时的点（见「几何图像」）。

题目都对：

- p5：$\vb F\perp\vb u$ 时 $\vb F=\gamma_um\vb a$，平行时 $\gamma_u^3m\vb a$。
- p6：$t_e\ge\frac c\alpha$ 的信号追不上。我另用光锥坐标算了收到信号时船上的读数 $\frac c\alpha\ln\frac1{1-\alpha t_e/c}$，$t_e\to\frac c\alpha$ 时趋于无穷，和参考解答一致。
- p7：$\vb F=m\vb a$ 只在瞬时静止系里成立。
- p8：杆整体刚性加速时前后端的固有加速度不同，和贝尔的飞船佯谬的关系。

问题：小问题 2b（`:116`）。

### physics.special-relativity.relativistic-action 自由粒子的作用量

已核对：

- 记号 $\mathcal S$ 的说明；「作用量应当是洛伦兹标量」；自由粒子作用量的定义。
- 动量和能量定理的（1）（2），逐步展开过。
- 不依赖参数的写法；$x^0$ 共轭的是 $-\frac Ec$，以及负号来自度规的说明。
- 例 1：$u=0.5c$ 时 $p\approx0.577mc$、$E\approx1.155mc^2$。例 2：守恒的能量 $\gamma_umc^2+V$，匀强电场里就是双曲运动。
- 函数图：$L(u)$、低速近似、在 $u$ 处的切线（斜率是动量，在纵轴上的截距是 $-E$）。

题目都对：

- p5：由「各惯性系作用量相同」定出 $f(u^2)=f(0)\sqrt{1-u^2/c^2}$，再由低速极限定 $f(0)=-mc^2$。
- p6：取 $\lambda=t$ 回到三维写法。
- p7：带电粒子的拉格朗日量和正则动量。
- p8：常数 $-mc^2$ 的意义。

问题：小问题 1（`:38`、`:40`、`:42`、`:104`）。

### physics.special-relativity.relativistic-doppler 相对论多普勒效应

已核对：

- 四维波矢的定义和它按洛伦兹变换变换的证明、多普勒公式、纵向和横向多普勒效应；实验检验一段。
- 例 1：$0.6c$ 时频率比为 $\frac12$ 和 $2$，收到 5 GHz、20 GHz，两个因子互为倒数（声波公式不是）。
- 例 2：前后两条谱线的平均是 $\gamma\lambda_0$，比 $\lambda_0$ 长约 $\frac{\beta^2}2\lambda_0$。
- 函数图：频率比随夹角 $\theta$ 变化（见「我替你定的」4c）。

题目都对：

- p5：由四维波矢推出光行差公式，$\theta'=\frac\pi2$ 时 $\cos\theta=\beta$。
- p6：用多普勒效应重算双生子：去程乙每 3 年收到 1 个，回程每 3 年收到 9 个，共 10 个；甲前 9 年收到 3 个，最后 1 年收到 3 个，共 6 个。
- p7：光没有「波源动还是观察者动」的区别；如果有以太会怎样。
- p8：雷达测速，反射频率 $\omega\frac{1-\beta}{1+\beta}$，一阶 $-2\beta\omega$。

问题：无。

## 小问题 1 · 前置（汇总）

- **`relativistic-action` 用到能量函数守恒，前置链上没有。**
  - 原文：
    - 定理（3）（`:38`）说「上面两个量都守恒」。
    - 证明（`:40`）写「$L$ 不显含 $t$，沿运动 $\dv{}{t}\bigl(\vb u\cdot\pdv{L}{\vb u}-L\bigr)=-\pdv Lt=0$」。
    - 例 2（`:104`）「$L$ 不显含时间，能量函数守恒」，`:106` 由此得守恒的能量 $\gamma_umc^2+V$。例 2 里速度在变，只能靠这个结论。
  - 这个恒等式是分析力学 `energy-function` 那一节的内容（goal：「判断它什么时候守恒」）。`relativistic-action` 的前置是 `four-momentum` 和 `hamiltons-principle`。
  - 链上分析力学的小节只有 `hamiltons-principle`、`lagrange-equations`、`virtual-work`、`constraints`。`energy-function` 和定义「广义动量」的 `cyclic-coordinates` 都不在链上，`:42` 正是按规矩 C 给这两个词标了分析力学的 id。
  - 方案 693 行：讲解、例题和题目文字都查，只有题目文字可以只加链接。
  - **建议（我推荐）**：前置改成 `[physics.special-relativity.four-momentum, physics.analytical-mechanics.hamiltons-principle, physics.analytical-mechanics.energy-function]`。
    - `energy-function` 在第 19 层，比 `four-momentum`（第 20 层）低，`relativistic-action` 仍在第 21 层。脚本算过，全图没有小节的层级会变。
    - `hamiltons-principle` 和 `energy-function` 互相不在对方的链上，两个都要列。
    - 加了以后，「广义动量」「能量函数」都到了链上。按规矩 C，`:42` 的两个标记要去掉，英文括注留着。
  - 另一种改法：不加前置，在证明（3）里当场推一行。由链式法则和拉格朗日方程，$\dv{}{t}\bigl(\vb u\cdot\pdv L{\vb u}-L\bigr)=\vb u\cdot\bigl(\dv{}{t}\pdv L{\vb u}-\pdv L{\vb r}\bigr)-\pdv Lt=-\pdv Lt$。例 2 引用它，并在例 2 里第一次出现「能量函数」的 `:104` 补标记（这一块里还没标）。
    - 只看定理（3）本身其实更简单：速度不变，所以（1）（2）两个只依赖速度的量也不变。

## 小问题 2 · 写法（汇总）

- **2a · 起名的段落没加锚点**（`mass-energy:42`）。
  - 原文：「原子核（atomic nucleus）由质子和中子组成，它们统称核子（nucleon）。」
  - 方案规定「叫作」「这就是」这样起名的段落要加锚点，「统称」也是起名。
  - 核子在这一节用得很多：讲解 5 处、题目 4 处、SVG 2 处，「平均每个核子的结合能」是图的纵轴。哪个领域的术语表都没有它。
  - 建议给这一段加锚点（如 `def-nucleon`），这一段本身就是定义。第二句「核子之间的核力……」也可以拆成下一段。
- **2b · 图的说明把谁追谁说反了**（`four-force:116`）。
  - 原文：「双曲运动的世界线从原点出发，越来越贴近渐近线，却永远追不上那条光线：速度趋于光速而达不到。」
  - 图例里渐近线就叫「渐近线（一条光线）」，所以「那条光线」读起来指渐近线。
  - 渐近线是 $t=\frac c\alpha$ 时从地球发出的光线（图里 $c=1$），飞船一直在它前面。同一个地点，飞船比这束光先到，画面上双曲线在渐近线下方。是这束光追不上飞船，p6 的题干说的就是「这个信号永远追不上飞船」。
  - 如果「那条光线」指的是从出发点发出的光线（图里 $t=x$，在双曲线下方），飞船确实追不上它；但双曲线贴近的是渐近线，不是这一条，句子前后指的不是同一条线。
  - 建议改成：「双曲运动的世界线从原点出发，越来越贴近渐近线，却永远碰不到它，速度趋于光速而达不到。渐近线是地球在 $t=\frac1\alpha$ 时发出的光线，它跟在飞船后面，永远追不上（见 p6）。」
- **2c · 时间分量差一个因子 $c$**（`four-momentum:36`）。
  - 原文：「于是 $\vb p\approx m\vb u$，$E\approx mc^2+\frac12mu^2$：空间分量回到牛顿力学的动量，时间分量是一个常数加上牛顿力学的动能」。
  - 四维动量的时间分量是 $\frac Ec\approx mc+\frac{mu^2}{2c}$，乘以 $c$ 才是「常数加动能」。
  - 建议改成「能量（时间分量的 $c$ 倍）是一个常数加上牛顿力学的动能」。

## 记号与约定

你定的和写内容会话新定的几件事，逐节看过：

- **$(+,-,-,-)$**：
  - `four-vectors:57` 定义 $\eta=\mathrm{diag}(1,-1,-1,-1)$，`:83` 按 $A\cdot A$ 的正负分三类，类时为正。
  - 别的几节一致：四维动量 $P\cdot P=m^2c^2$，四维速度 $U\cdot U=c^2$，`four-force:52` 四维加速度 $A\cdot A=-\alpha^2$，光的四维波矢 $k\cdot k=0$。
- **指标用 $\mu,\nu,\rho,\sigma$**：`four-vectors:22` 交代了取 0 到 3。8 节都没用 $\alpha$、$\beta$ 作指标（$\beta$ 已是 $v/c$，$\alpha$ 在 `four-force` 是固有加速度）。
- **$\gamma_u$**：`four-momentum:25` 定义为速度 $u$ 对应的洛伦兹因子，和惯性系速度 $v$ 的 $\gamma$ 分开。8 节都这样用：`four-force` 的 $\gamma_u^3$，`relativistic-action` 的 $\gamma_umc^2$。
- **作用量写 $\mathcal S$**：`relativistic-action:22` 说明这一节用 $S$ 表示惯性系，所以作用量写 $\mathcal S$，并对照了分析力学的写法。
- **下标分量**：`four-vectors:91`「下标分量（covariant components，也叫协变分量）」；`:93` 交代了 $\eta^{\mu\nu}$。
- **「质量」都指静质量**：`four-momentum:36`「本领域说的质量 $m$ 都是质点静止时量到的质量……不随速度变」。p7 专门讨论「相对论质量」为什么不用，`:121` 常见误区也提了。
- **$-E/c$ 和时间共轭**：
  - `relativistic-action:55`「和 $x^\mu$ 共轭的量是 $-P_\mu$……时间坐标 $x^0=ct$ 共轭的是 $-\frac Ec$」，`:59` 说明负号来自度规。
  - 和分析力学一致：`hamilton-jacobi` 用 $H+\pdv St=0$、$p=\pdv Sq$，和 $t$ 共轭的是 $-H$。
- **$u$ 和 $v$ 的分工**：$u$ 是物体的速度，$v$ 是惯性系的速度，8 节都照批次 6 的约定用。
- **新宏**：
  - `\pdv` 和另外 10 个领域的定义逐字相同。
  - `\T` 和线性代数、分析力学的定义逐字相同。
  - 构建也查同名宏。
- **和已写领域的一致性**：分析力学的术语表里有「广义动量」「能量函数」，本领域没有重新定义，按规矩 C 标了分析力学的 id。本领域的 26 个新术语在别的领域都没有同名的。

## 格式、术语、证明深度、难度档

- **固定结构和排版**：
  - `npm run content` 0 个错误、0 个警告。
  - 用脚本查过讲解和题目文字：每段不超过 4 句，中英文之间有空格，引号用「」。
  - 每节两道例题都先写「为什么想到这么做」。
- **26 个新术语**：
  - 英文全称都对，锚点都落在下定义（或叙述定理）的那一段。页面上定义卡片的数目和锚点数一致。
  - 每节第一次标记都带英文；每个二级、三级标题下第一次出现都标了，唯一例外是小问题 1 说的 `:104`。
  - 有两处在同一块里标了两次：`four-momentum` 的「固有时」、`four-force` 的「惯性系」，第二次都在下定义的锚点段里。方案只说「这一块后面再出现的不用标」，没说不能标；锚点段单独显示成定义卡片时也有用，不报。
  - 简介都准确，只用读者在定义那一节已经懂的概念（$\gamma_u$ 的情形见「我替你定的」4a）。
- **锚点段**：45 个锚点段都以句号结尾，后面都没有紧跟行间公式。
- **起名的句子**：除 2a 外，没加锚点的起名句都是记号或引用：
  - `four-vectors:30`、`:93`、`relativistic-action:22` 是「记作」，交代记号。
  - `four-vectors:81` 解释洛伦兹标量为什么叫这个名字。
  - `four-momentum:121` 说「相对论质量」的旧说法。
  - `relativistic-doppler:98` 用已定义的「横向多普勒效应」。
- **跨领域的词**：
  - 前置链上学过的都没标、括注了英文，符合规矩 C：拉格朗日量、作用量、哈密顿原理、拉格朗日方程、欧拉-拉格朗日方程、二次型、双曲函数。
  - 链外的「广义动量」「能量函数」标了分析力学的 id。
  - 题目文字里的标记按批次 5 的规矩不查。
- **提到题目的地方**：讲解、例题、几何图像的说明、常见误区里提到的都是难题、思考题，或只说「见 pN」，没有写出简单题、中等题的答案。选择题的选项没有照搬讲解里判过的例子。
- **证明深度**：领域是 `proofPolicy: full`，8 节主线的定理都在讲解里证完了：
  - 度规保持和内积不变；沿世界线比较两只钟。
  - 四维动量守恒在各惯性系成立；能量-动量关系；质能关系。
  - 不变质量的下界、两体衰变、阈能。
  - 功率、四维加速度、纵向力、双曲运动和它的固有时。
  - 作用量推出动量和能量（前置的问题见小问题 1）、不依赖参数的写法。
  - 四维波矢的变换、多普勒公式。
- **难度档**：都符合四档的定义。中等题都比简单题多一两步。例如 `twin-paradox` p3 要在去程、回程两个惯性系里各找一个和掉头同时的地球事件，再相减；`relativistic-collisions` p4 要先由不变质量写出阈能的条件。
- **阅读时间**：`minutes` 7 节写 35、`four-force` 写 40，按批次 6 的先例不报（见「我替你定的」4e）。

## 几何图像

| 图 | 核对 | 页面上量的 |
| --- | --- | --- |
| `four-vectors/light-cone-vectors.svg` | 光锥 45°，类时、类光、类空三个矢量分别在锥内、锥面上、锥外 | 文字不出界、不重叠、不压线 |
| `twin-paradox/twin-ladder.svg` | 左图乙的折线和两条同时线（截在 1.8、8.2），右图车库、梯子和关门事件，和例 1、例 2 一致 | 同上 |
| `mass-energy/binding-energy.svg` | 横轴 $x=60+190\lg A$，纵轴每 MeV 28.89 像素；20 个点从 $^2$H 的 1.112 到 $^{238}$U 的 7.570，按坐标反算都和标准值相差 0.003 MeV 以内 | 同上 |

- 3 张图都没有写死颜色，只用 `currentColor` 和页面变量。亮色主题下量了对比度：3 张图的文字都是 16.3，线条最低 4.9（灰色的辅助线）。截图看了 `twin-paradox` 那张。
- **6 个函数图**用动画组件的解析器在 Node 里求值，式子和讲解一致，滑块的最大值、初值都在格点上。滑块拖到两端时：
  - `four-momentum`：端点 $(\gamma_u u,\gamma_u)$ 在双曲线上；$u=\pm0.9$ 时端点在 $(\pm2.065,2.294)$，在画面里。
  - `mass-energy`：$u=0.95$ 时点在 $(0.95,2.203)$，在画面里。
  - `relativistic-collisions`：椭圆在 $\beta=0.9$ 时横向到 5.74，在横轴范围 6 以内；$\beta\le0.6$ 时最大飞出角不存在，直线不画。
  - `four-force`：$\alpha=3$、$\tau=1$ 时点在 $(3.02,3.34)$，在纵轴范围 3.6 以内。
  - `relativistic-action`：切线在纵轴上的截距 $-\gamma_u$，$u=0.9$ 时是 $-2.29$，在画面里。
  - `relativistic-doppler`：相对论曲线在 $\beta=0.8$ 时最高 3.0，在纵轴范围 3.2 以内；声波式的曲线会被截掉一截（见「我替你定的」4c）。
- **手机宽度**：看了 `four-force` 的动画。
  - 画布 313 × 188，光线 43.99°；图例、两个滑块都放得下，没有横向溢出；截图看过。
  - 这张图的纵横范围之比是 0.6（$x$ 到 6，$y$ 到 3.6），符合批次 6 写回的时空图规矩。

## 史实和数字

查到来源、对得上的：

- **爱因斯坦 1905 年的质能关系论文**：《物体的惯性同它所含的能量有关吗？》，9 月 27 日收稿、11 月 21 日发表，3 页。来源：[英译本](https://www.fourmilab.ch/etexts/einstein/E_mc2/www/)，[Physics Today](https://physicstoday.aip.org/news/e-mc2)。
- **雷恩维尔等 2005 年**的直接检验：中子俘获放出的 γ 光子能量和质量差比较，偏差 $(-1.4\pm4.4)\times10^{-7}$。来源：[ScienceDaily](https://www.sciencedaily.com/releases/2005/12/051226100647.htm)，[Laser Focus World](https://www.laserfocusworld.com/detectors-imaging/article/16546701/xray-interferometry-einsteins-theory-passes-xray-test)。
- **反质子**：
  - 贝伐加速器按产生反质子的阈能设计，能量 6.2 GeV（当时叫 6 BeV）。
  - 1955 年张伯伦、塞格雷等用铜靶发现反质子，1959 年获诺贝尔奖。
  - 来源：[伯克利实验室](https://newscenter.lbl.gov/2005/10/27/the-golden-anniversary-of-the-antiproton/)，[CERN Courier](https://cerncourier.com/a/fifty-years-of-antiprotons/)。
- **GSI 2014**：博特曼等用储存环里 $\beta=0.338$ 的锂离子做艾夫斯-史迪威型实验，精确到 $2.3\times10^{-9}$。来源：[PRL 113, 120405](https://www.doi.org/10.1103/PHYSREVLETT.113.120405)，[ScienceDaily](https://www.sciencedaily.com/releases/2014/10/141007092248.htm)。
- **哈费尔-基廷**：
  - 预言：速度和引力合计，向东 $-40\pm23\,\mathrm{ns}$、向西 $+275\pm21\,\mathrm{ns}$。只算速度效应是 $-184$、$+96\,\mathrm{ns}$。
  - 实测：$-59\pm10\,\mathrm{ns}$、$+273\pm7\,\mathrm{ns}$。
  - `twin-paradox` p8 按简化的数估出 $-210$、$+110\,\mathrm{ns}$，说的是「一两百纳秒的量级」，可以。
  - 来源：[Hafele–Keating experiment](https://en.wikipedia.org/wiki/Hafele%E2%80%93Keating_experiment)。
- **贝尔托齐 1964**：用范德格拉夫加速器和直线加速器把电子加速到 0.5 到 15 MeV，测飞行时间和量热计里的能量，速度趋于 $c$ 而动能没有上限。来源：[Tests of relativistic energy and momentum](https://en.wikipedia.org/wiki/Tests_of_relativistic_energy_and_momentum)。飞行距离 8.4 m 见「没验证的地方」。
- **LHC**（写内容会话没查）：2022 年 7 月 5 日起第三轮运行，每束 6.8 TeV，对撞能量 13.6 TeV。来源：[ATLAS](https://atlas.cern/Updates/Press-Statement/Run3-first-collisions)，[CERN](https://home.cern/news/news/physics/atlas-moves-top-gear-run-3)。
- **核和粒子的质量**（写内容会话没查）：
  - 氘核 1875.613、氚核 2808.921、α 粒子 3727.379 MeV，和 CODATA 2022 一致。来源：[CODATA 2022](https://arxiv.org/pdf/2409.03787)。
  - K± 493.677 MeV，和 PDG 一致。来源：[PDG 2025](https://ccwww.kek.jp/pdg/2025/listings/rpp2025-list-K-plus-minus.pdf)。
  - 质子 938.272、中子 939.565、电子 0.511、μ 105.658、π± 139.570、π⁰ 134.977 MeV：按我知道的 CODATA、PDG 数值核对，见「没验证的地方」。
- **比结合能**（写内容会话没查）：$^{62}$Ni 8.7945、$^{56}$Fe 8.790、$^{235}$U 7.59、$^4$He 7.07 MeV 都对得上。来源：[schoolphysics](https://www.schoolphysics.co.uk/age16-19/Nuclear%20physics/Nuclear%20structure/text/Binding_energy_per_nucleon/index.html)，[Physics Classroom](https://www.physicsclassroom.com/Chemistry-Tutorial/Nuclear-Chemistry/Binding-Energy)。图上其余 16 个点按我知道的 AME 数值核对。
- 写内容会话查过的几项按我知道的核对，对得上：
  - 朗之万 1911 年提出双生子、劳厄的解释、爱因斯坦 1905 年「沿闭合曲线运动的钟回来时慢了」。
  - 考克饶夫-瓦尔顿 1932。
  - 泡利 1930、查德威克 1914 年的连续谱、柯万-莱因斯 1956。
  - 艾夫斯-史迪威 1938。

书里的数字都重算过：

- 例题：$11$ 和 $(3,0,0,0)$；6 年和 3 m；$0.639$、$0.383\,\mathrm{MeV}$、$\frac{15}{17}c$；$2.224\,\mathrm{MeV}$、0.12%、$17.590\,\mathrm{MeV}$、0.375%；$109.778$、$4.120$、$29.79\,\mathrm{MeV}$、$5.63\,\mathrm{GeV}$；$0.970$ 年、$0.774c$、$1.19$ 年、$4.914$、$0.979c$、$4.1\,\mathrm{ns}$；$0.577mc$、$1.155mc^2$；5 GHz、20 GHz。
- 题目：$-210$、$+110\,\mathrm{ns}$；约 $180\,\mathrm{MeV}$；$9.9\times10^7\,\mathrm{GeV}$；10 个和 6 个信号。

都对得上。

## 我替你定的（都能改）

1. 验算辅助文件 `_relativity.ts` 加了本批要用的函数（见「简单题、中等题的验算」）。`four-force` 的脚本直接用动画包里的四阶龙格-库塔积分器，没有另抄一份。
2. 小问题 1 推荐加前置，不推荐当场推导。理由：
   - 层级不变。
   - 这一节本来就要说「这两个量就是分析力学里的广义动量和能量函数」，先学过更顺。
   - 例 2 也要用同一个结论。
   代价是去掉 `:42` 的两个标记。当场推导也行，要多写一行、补一个标记。
3. 2b 归小问题，不归重要：
   - 按「那条光线」指渐近线读，方向说反了；按指从出发点发出的光线读，说法本身对，只是和前半句指的不是同一条线。
   - 冒号后面的结论「速度趋于光速而达不到」是对的，p6 也讲清了谁追不上谁。
4. 看到了但不报的：
   - a. 「四维速度」「四维动量」「静能」「四维力」4 个术语的简介里用了 $\gamma_u$，没解释。
     - $\gamma_u$ 在 `four-momentum:25` 定义，后面用到这些术语的地方都在它之后。
     - 只有 `velocity-transformation:36`（第 18 层）提前标了「四维速度」，浮窗上写着是第 20 层才讲的。
     - 我认为提前看到的读者看不懂后面的记号不算问题，写进了「要写回 plan.md 的」1。
   - b. `four-momentum` 的函数图里，四维动量那一段在 $u=0$ 时是竖直的，画不成 $y(x)$，会消失（$|u|$ 很小时只剩一两个像素宽）。端点 $(0,1)$ 仍在，讲解没描述这种情形。
   - c. `relativistic-doppler` 的函数图里，声波式的曲线在 $\beta>0.6875$ 时 $\theta=0$ 附近超出纵轴范围（$\beta=0.8$ 时最高 5，纵轴到 3.2）。相对论曲线始终在画面里，讲解说的「处处是 $\frac1\gamma$ 倍」在别处看得清。
   - d. `four-vectors:60` 的「惯性定律」，理由见那一节。
   - e. `minutes`：分析力学批次 3 有 35、40 的先例，这几节的篇幅也和批次 6 的差不多。
5. 批次 6 三节只核对了新加标记的那一行。三个标记都对，按你说的把 `status` 改回 `reviewed`；只改第 11 行，改完和 HEAD 比只差标记那一行。
6. 选择题里纯概念的选项按定义判，脚本 `notes` 里写明了。

## 要写回 plan.md 的

写内容会话提的两条：

1. **同领域、不在本节前置链上的术语，正文里不要依赖它：同意，建议再补一句。**
   - 现有的规矩已经覆盖一部分，这一条补的是本领域后面小节的词：
     - 方案 693 行：讲解用到的概念要在链上。
     - 规矩 C：管别的领域的词。
   - 本批的实际做法：`relativistic-action:106` 只用一句话提到同在第 21 层的「双曲运动」，`velocity-transformation:36` 提前提到「四维速度」。两处都是标记加旁白，推理不靠它们。
   - 建议的写法：「本领域后面小节的术语可以提前提到：标记、括注英文，浮窗会注明是第几层讲的；讲解和例题的推理不能用到它。术语的简介按读到定义那一节的读者写，提前看到的读者看不懂其中的记号（例如 $\gamma_u$）不算问题（批次 7 审查时定的）。」
2. **判题的式子不认 `atanh` 这类反双曲函数：同意。** 8e4c9db 已经让判题和动画都认 `asinh`、`acosh`、`atanh`，并写进了方案里式子写法那一段，不用再写回。

我这边没有别的要写回的。

## 没验证的地方

- 题目卡片的作答、提示没有在页面上操作。题目文字里的标记由构建检查 id。
- 批次 6 三个标记只打开了「四维速度」的浮窗，另外两个靠构建检查 id 和术语表核对。
- 截图只看了两张：手机宽度的 `four-force` 动画（暗色主题），电脑宽度的 `twin-paradox` 的 SVG（亮色主题）。另两张 SVG 靠 `getBBox()` 和对比度的数值判断。
- 史实里没在检索结果里看到原文的：
  - 贝尔托齐实验的飞行距离 8.4 m：检索结果只有教学网站，按我记得的论文核对。
  - π± 139.570、π⁰ 134.977、μ 105.658 MeV：检索结果里没有最新版 PDG 的数字（2003 版 π⁰ 是 134.9766，舍入后相同），按我知道的数值核对。质子、中子、电子的质量同样没在检索结果里看到。
  - 写内容会话查过的几项（朗之万、劳厄、考克饶夫-瓦尔顿、泡利、查德威克、柯万-莱因斯、艾夫斯-史迪威）我没再上网。

## 修订说明（写内容会话）

2026-11-11。这一批 8 节里动了 4 节：`relativistic-action`、`mass-energy`、`four-momentum`、`four-force`；另外改了 `_domain.yaml` 里批次 7 术语「不变质量」的一条简介（理由见「同类问题」），再就是加了本节。3 张 SVG、批次 6 那三节都没动。小问题 2 条都改了，同类问题在 8 节的讲解和题目文字里又找了一遍，找到的一起改。下面的行号是改完以后的。

### 小问题 1 · 前置

- 照报告推荐的改法：`relativistic-action` 的前置改成 `[physics.special-relativity.four-momentum, physics.analytical-mechanics.hamiltons-principle, physics.analytical-mechanics.energy-function]`。用脚本按全图重算，层级变了的小节是 0 个。定理（3）`:38`、证明 `:40`、例 2 `:104` 用到的「$L$ 不显含 $t$ 时能量函数守恒」都在前置链上了。
- `energy-function` 的前置是 `cyclic-coordinates`，所以「广义动量」「能量函数」都到了链上。按规矩 C，`:42` 的两个标记去掉了，英文括注留着；报告说 `:104` 缺的标记也就不用补了（链上的术语不标）。现在本领域没有分析力学的术语标记了（剩下的只是前置、链接）。
- 定理（3）证明的最后一句后面加了「（见[能量函数与能量守恒](…)）」的链接，指明这个结论的出处。例 2 用的是同一个结论，没有另加链接。

### 小问题 2 · 写法

- 2a（`mass-energy:42`）：「统称核子」那一句单独成段，加锚点 `def-nucleon`。原来的第二句改写成下一段的「为什么」，并补了边界情况：
  - 「为什么要有这个名字：质子和中子的质量相差只有约 $0.14\%$，在核里都受核力（nuclear force）束缚，而核力几乎不分质子和中子，所以常把它们一并看待；要把核拆开，就得克服核力给它能量。」
  - 「边界情况：氢-1 的核只有一个质子，没有可以拆开的核子。」
  - 核子没进术语表，和光钟（`time-dilation` 的 `def-light-clock`）、时钟假设（`spacetime-interval` 的 `def-clock-hypothesis`）一样只有锚点。页面上 `mass-energy` 的定义卡片从 4 张变成 5 张，等于锚点数。
- 2b（`four-force:116`）：用报告的建议句，句末补了宾语「飞船」。原来这一段 4 句，其中一句换成建议的两句以后变成 5 句，超过每段 4 句，所以拆成两段：
  - 第一段（3 句）：交代坐标；双曲运动的世界线越来越贴近渐近线，却永远碰不到它；渐近线是地球在 $t=\frac1\alpha$ 时发出的光线，跟在飞船后面，永远追不上飞船（见 p6）。
  - 第二段（2 句）：牛顿力学的抛物线；标出的点。
- 2c（`four-momentum:36`）：照报告的建议改成「能量 $E$（时间分量的 $c$ 倍）是一个常数加上牛顿力学的动能」。

### 同类问题

- **起名的句子**：在 8 节的 `lesson.md` 里搜「统称、叫作、叫做、称为、称作、记作、也叫、又叫、常叫、简称、合称、所谓、名为、这就是、就叫」，再用单字「叫」「称」搜一遍，逐个看是否在锚点段里。不在锚点段里的起名说法除 2a 外有 5 处，都不改：
  - `four-vectors:30`、`:93`、`relativistic-action:22` 是「记作」，只给记号起字母。
  - `four-momentum:121`（常见误区）说的是「相对论质量」的旧说法，是引用，不是给新概念起名。
  - `relativistic-doppler:99`（常见误区）「这就是横向多普勒效应」用的是 `:42` 已定义的术语。
  - 这 5 处和报告「格式、术语」一节判的一致。
  - 单字搜出的其余几处不是起名：`twin-paradox:25` 是紧跟定义段、解释「佯谬」这个词的「为什么」段；`four-vectors:65`、`:67`、`twin-paradox:27`、`four-momentum:113` 是「对称」。
- **把时间分量和能量混着说**：在 8 节的讲解和题目文字里搜「时间分量」「能量是四维动量的」，以及「分量」和能量、$E$ 同在一行的地方。除 2c 外另找到 5 组共 7 处，都改了：
  - `four-momentum:44`（四维动量守恒定律）：「空间分量是动量守恒，时间分量是能量守恒」，改成「空间分量守恒就是动量守恒，时间分量 $\frac Ec$ 守恒就是能量守恒」。
  - `four-momentum` p2 的第 2 条提示和解答：「能量是四维动量的时间分量」，改成「能量除以 $c$ 是四维动量的时间分量」。
  - `four-force:37`（四维力的「为什么」）：「时间分量是功率，空间分量是力」少了因子，改成「时间分量是功率乘 $\frac{\gamma_u}{c}$，空间分量是力乘 $\gamma_u$」。
  - `relativistic-action` p8 的第 2 条提示和参考解答：原来分别是「能量是四维动量的分量」「能量是四维动量的时间分量」，都改成「能量除以 $c$ 是四维动量的时间分量」。
  - `four-momentum` p7 的参考解答：「$E$ 和 $\vb p$ 是四维动量的分量」，改成「$\frac Ec$ 和 $\vb p$ 是四维动量的分量」。这一处是写修订说明时复核才找到的。
- **「长度」差一个因子 $c$**：p7 同一句还说「$m$ 是四维动量的「长度」」，而 `four-momentum:97` 的图说写的是「长度」$\sqrt{P\cdot P}=mc$。同样的说法共 3 处，都在「长度」后面补了「除以 $c$」：`four-momentum:55`、p7 的参考解答、`_domain.yaml` 里「不变质量」的简介。`relativistic-collisions:22` 只说「也可以问这个和的「长度」」，没说它等于什么，不改。
- 其余提到时间分量的地方都对，不改：
  - `mass-energy:34`「比较时间分量：$Mc=M'c+\frac{\Delta E}{c}$」。
  - `relativistic-action:55`「共轭的是 $-\frac Ec$」。
  - `relativistic-doppler` p2 的第 1 条提示「四维波矢的时间分量是 $\frac\omega c$」。
  - `four-force:146`（常见误区）「它是功率乘以 $\frac{\gamma_u}{c}$」。
  - `four-momentum` p5 的第 3 条提示和参考解答「空间分量除以时间分量再乘 $c$」。
  - `four-vectors` 讲解和题目里泛指的时间分量。`four-vectors` p7 的参考解答说虚数时间的写法里「物理量（如能量）也会跟着出现虚数分量」，没说能量就是那个分量。

### 别的

- 报告「我替你定的」第 4 条里看到但不报的几处（简介里的 $\gamma_u$、两个函数图在极端滑块值时的画面等），按协调会话的意见不改。
- 报告「要写回 plan.md 的」两条由协调会话处理。判题已认 `atanh` 这类函数，`four-force` p3 的标准答案已经写成 `ln`，不改回去。

### 验证

- `npm run content`：0 个错误、0 个警告。编译器渲染公式时开着 KaTeX 的 `throwOnError`，新写的公式（包括简介里的）都能渲染。
- 自查脚本（这一批 8 节）：
  - 每段不超过 4 句、排版：没有问题。
  - 起名的句子：`naming.py` 列出的 24 句都在锚点段里。
  - 术语标记：只剩 `relativistic-collisions:106`「质子同步加速器」里的「同步」，它不是术语「同步」，是误报。
  - 英文括注：`gloss_first.py` 除了这个「同步」没有别的。中途查出一处：2a 的边界情况里本来写了「谈不上结合能」，抢在结合能的定义段前面第一次出现，已改成「没有可以拆开的核子」。`check-terms` 另报 3 处「没括注英文？」：`four-momentum:51`、`mass-energy:32`、`relativistic-doppler:44`。它们的括注都是「（术语，English）」合写的格式，这个脚本认不出来，是误报。
- 写内容会话自己的验算脚本：212 项仍一致。这次只改了措辞，没改任何数。
- 页面（`npm run build` 后用 test-serve 打开，查完已停）：改过的 4 节在 768 像素宽下都不左右滚动，KaTeX 0 个错误，定义卡片数等于锚点数（`mass-energy` 5、`four-force` 10、`four-momentum` 6、`relativistic-action` 3）。`relativistic-action` 的前置回顾里有「能量函数与能量守恒」，`:42` 那句已没有浮窗标记。
- 最后补改的三处（`four-momentum:55`、p7 的参考解答、「不变质量」的简介）只在原句里加了几个字，没有再开页面看。
- 批次 6 那三节和 HEAD 相比各只差一行，是批次 7 写作时加的术语标记；这次没动。

## 复核

2026-11-11，审内容 agent。

**结论**：没有需要再修的。小问题 2 条都改好了；修订说明里同类多改的 10 处也逐处看过，都对。没有说明之外的改动；只有 `relativistic-action/problems.yaml` 的前 59 行没有原文可比（见「没验证的」）。8 节的 `status` 已改成 `reviewed`，只改了各节 `lesson.md` 第 11 行。

**怎么比的**

- 8 节的内容还没提交，`git diff HEAD` 看不出这一轮改了什么。和批次 6 复核一样，从我的会话记录里取出上次审查时读过的原文，逐文件和现在的比：
  - 8 份 `lesson.md` 和 7 份 `problems.yaml` 能拼出完整的原文（`four-momentum` 的是分段读的，按行号拼回去）。
  - `relativistic-action/problems.yaml` 只有第 60 行以后（p3 的后半到 p8）。
  - `_domain.yaml` 有审查时输出过的第 210 行到末尾，本批 26 个术语都在里面。
- 改动的范围和修订说明一致：
  - `lesson.md` 改了 4 节 9 处：
    - `relativistic-action` 3 处：前置、`:40` 的链接、`:42` 去掉两个标记。
    - `mass-energy` 1 处：`:42` 一段变成锚点、定义、「为什么」三段。
    - `four-force` 2 处：`:37`，以及 `:116` 拆成两段。
    - `four-momentum` 3 处：`:36`、`:44`、`:55`。
  - `problems.yaml` 改了 5 处：`four-momentum` p2 的第 2 条提示和解答、p7 的参考解答，`relativistic-action` p8 的第 2 条提示和参考解答。
  - `_domain.yaml` 只改了第 356 行「不变质量」的简介。
  - 另外 4 节、3 张 SVG、宏都没动。

**逐条**

| 编号 | 改法 | 复核 |
| --- | --- | --- |
| 小问题 1 | `relativistic-action` 前置加 `energy-function`；`:42` 的两个标记去掉，英文留着；证明（3）末尾加「（见[能量函数与能量守恒](…)）」 | 通过：<br>• 按全图重算，去掉这个前置时层级会变的小节是 0 个，`relativistic-action` 仍在第 21 层。三个前置互不在对方的链上，没有多余的。<br>• 规矩 C 按前置链重查了 8 节：链上的别的领域的术语都没标，链外的都标了。`relativistic-action` 里已经没有分析力学的标记。`:104` 的「能量函数」现在在链上，不用标，同意。<br>• 链接文字和 `energy-function` 那一节的标题一致。页面上前置回顾、`:40` 的链接都指向它，`:42` 那段没有浮窗标记了。 |
| 小问题 2a | `mass-energy`：「统称核子」单独成段，加锚点 `def-nucleon`；第二句改写成「为什么要有这个名字」一段，补了氢-1 的边界情况 | 通过：<br>• 锚点段是一整句、以句号结尾，后面是「为什么」段，不是行间公式。<br>• 「质量相差约 0.14%」重算过：$\frac{939.565-938.272}{938.272}\approx0.138\%$。「核力几乎不分质子和中子」也对。<br>• 页面上定义卡片 5 张，等于锚点数。 |
| 小问题 2b | `four-force:116`：用建议句，句末补了宾语「飞船」；拆成两段，分别是 3 句和 2 句 | 通过。页面上两段都在，公式正常。 |
| 小问题 2c | `four-momentum:36`：「能量 $E$（时间分量的 $c$ 倍）是一个常数加上牛顿力学的动能」 | 通过 |
| 2c 的同类 | 时间分量 7 处、「长度」3 处，见修订说明「同类问题」 | 通过，逐处看过：<br>• `four-momentum:44`：时间分量 $\frac Ec$ 守恒就是能量守恒。<br>• `four-force:37`：$K=\gamma_u\bigl(\frac{\vb F\cdot\vb u}c,\vb F\bigr)$，时间分量是功率乘 $\frac{\gamma_u}c$，空间分量是力乘 $\gamma_u$。<br>• `four-momentum` p2 的提示和解答、`relativistic-action` p8 的提示和参考解答、`four-momentum` p7：「能量除以 $c$ 是四维动量的时间分量」「$\frac Ec$ 和 $\vb p$ 是分量」。<br>• 「长度」除以 $c$ 是质量，因为 $\sqrt{P\cdot P}=mc$。「不变质量」的简介改了以后，浮窗显示正常，构建的字数检查也通过。<br>• 我另在 8 节的讲解、题目文字和简介里搜了「时间分量」「「长度」」「四维动量的分量」「四维动量的大小」「模」。剩下的说法都对，没有漏改的。 |

**验算**

- 这一轮只改措辞，没改数。本批 8 个脚本逐个跑：32 题全部一致。全量 `npm run verify`：102 个小节全部一致，没有被常微分方程那边卡住，没有用临时副本。
- `relativistic-action` p1 到 p4 的题干、选项、作答方式和单位，用 `npm run statements` 重新导出，和审查时的导出逐行相同。

**跑过的命令和页面**

- `npm run content`：0 个错误、0 个警告（`status` 改成 `reviewed` 之后又跑了一次，也通过）。`npm run build` 通过。
- 用 `test-serve` 看页面：3142 端口被别的会话占着，起在 3143；进度写临时仓库，查完已停。768 宽下：
  - 改过的 4 节都没有 KaTeX 错误，每节 8 道题，不左右滚动。
  - 定义卡片数等于锚点数：`four-momentum` 6、`mass-energy` 5、`four-force` 10、`relativistic-action` 3。
  - 改过的句子在页面上逐处看了：`four-momentum:36`、`:44`、`:55`，`four-force:37` 和图说明的两段，`relativistic-action:40`、`:42`。
  - 在 `relativistic-collisions` 点开「不变质量」的浮窗，显示的是新简介。
- 文字检查：用上次的脚本重查了改过的 4 节的讲解和题目文字，都没有新问题。查了这些：
  - 每段不超过 4 句、中英文空格、引号；
  - 锚点段的格式；
  - 起名句有没有锚点；
  - 术语标记。
  - `mass-energy:45` 被脚本列为起名句，是因为「为什么要有这个名字」里有「名字」二字，误报。
- 协调会话写进 plan.md 的两处（还没提交），我看了新加的行：时间分量是 $E/c$、「长度」是 $mc$ 的说法对；简介那一句和我建议的意思一致。

**我替你定的（复核时，都能改）**

1. 「核子」卡片没有标题，核子也没进术语表，我没报。理由：页面上光钟、时钟假设两张卡片也是这样，都是只有锚点的起名卡片；本领域只有 `mass-energy` 用到核子。

**没验证的**

- `relativistic-action/problems.yaml` 第 1 到 59 行没有原文可比，包括 p1、p2 的提示和解答，以及 p3 的前半。这一段的题干、选项、单位和标准答案核过，都没变；修订说明也说这一段没动。
- 手机宽度、亮色主题这一轮没看。这一轮只改了文字，图和动画都没动。

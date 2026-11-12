# 批次 16 审查报告：光学（波动光学 9 节）

审内容 agent（和写内容 agent 是两个独立会话，没有读它的会话记录、交接说明和自查脚本）· 2026-11-12

审查范围：`content/physics/optics/` 下 9 节：`fermat-principle`、`graded-index`、`huygens-principle`、`two-beam-interference`、`coherence`、`single-slit-diffraction`、`thin-film-interference`、`diffraction-gratings`、`fabry-perot`。每节都看了 `lesson.md` 和 `problems.yaml`。另外看了：

- 9 张 SVG、8 个动画（`huygens-principle` 只有图）；
- `_domain.yaml`：术语表从 36 条加到 70 条，新加的 34 条；
- 批次 15 补标后退回 `written` 的三节：`reflection-refraction`、`aberrations`、`optical-instruments`；
- 别的小节指向这一批的地方，和写内容会话对跨领域补标的判断。

## 结论

重要 2 条，小问题 3 条（同一类合成一条）。

- **验算**：36 道简单题、中等题全部和独立验算一致。
- **难题、思考题**：36 题的参考解答和三级提示逐题读过，推导和数都对，只有 `fermat-principle` 第 5 题的一个用词说反了（小问题 2）。
- **重要 1 · 常见误区说反了**：`diffraction-gratings:123` 把「光栅常量越小，色分辨本领越高」当成误区。可光栅一样宽、在同一级时，这句话是对的：光栅常量减半，照亮的缝数加倍，$R=mN$ 也加倍。同一节第 4 题就是按「宽 $5.0\,\mathrm{cm}$ × 每毫米 $1200$ 条」算缝数的。
- **重要 2 · 前置**：`two-beam-interference` 用「光程」定义光程差、做例 2，`single-slit-diffraction:61` 的证明也用它；可定义光程的 `fermat-principle` 不在这两节的链上。术语表「光程差」的简介也用了光程。给 `two-beam-interference` 加前置 `fermat-principle`，所有小节的层级都不变。
- **小问题 1 · 名词和标记**：
  - 两节以上讲解用到、没进术语表的名词有 4 个：纤芯、包层、级次、反射率。
  - 一批名词在本节第一次出现时没括注英文。
  - 复合词的标法（plan.md:246）有两类不合规矩：
    - 「单缝衍射」「光栅衍射」「多缝衍射」「双光束干涉」拆开标，共 8 处（初稿误写成 7 处，复核时更正）；
    - 「干涉条纹」「干涉仪」里的「干涉」被单独标出，共 2 处。这和写内容会话对别的领域的判断（这两个是长词，不补标）也对不上。
- **小问题 2 · 题目**：
  - `fermat-principle` 第 5 题参考解答「$L''>0$，$L$处处向上凸」，「向上凸」通常指∩形，和 $L''>0$ 正好相反；
  - 第 2 题 D 照搬了例 2 判过的结论。
- **小问题 3 · 说法**：
  - `fabry-perot:22` 说「反射本身带来的相位变化也算进 $\delta$ 里」，可 `:34`、`:54`、第 2 题 D 都按 $\delta=\frac{4\pi nd\cos\theta}\lambda$ 推出「$2nd\cos\theta=m\lambda$」，两处对不上；
  - `diffraction-gratings:55`「$d=2a$ 时所有偶数级都缺」，零级不缺；
  - 术语表「半波损失」的简介没写「接近垂直入射」（可选）。
- 你点名要查的几件事：
  - **薄膜干涉不加电磁学前置**：同意，到「证明思路」这个深度用不着电磁学的边界条件，理由见「前置」。
  - **写内容会话定的几件事**：记号、复数约定、斜入射的量法、锚点共用、不进表的词、瑞利判据不起名，都妥当。
    - 「链上只括注」的 7 个词逐个查了前置图，都真在链上。
  - **写内容会话自己改的数**和**有意取的整数**：逐个重算，都对。
  - **史实**：点名的 8 条和复查过的几条都对；夫琅禾费 1821 年 260 根金属丝、法布里和珀罗 1899 年查了来源。
  - **动画**：8 个都把画布导出成图看过，滑块拉到两端，都和说明一致。
  - **390 宽的长行内式**：
    - 写内容会话拆过的 8 处我认不出是哪几处（不读交接说明），只能把 390 宽下所有行内式都量了。
    - 题卡的提示、解答里还有 17 个宽过题卡，分布在 8 节。
    - plan.md:268 说手机宽度不在目标里，这些不用拆，不算问题。
    - 目标宽度 768 下，9 页全部展开都不左右滚动。
  - **跨领域补标**：写内容会话列的几条都成立。只是按同一个判断，这一批自己的 `coherence:25`、`fabry-perot:97` 要改（小问题 1）。
  - **批次 15 退回的三节**：只改了补标处，都对，三节第 11 行已改回 `reviewed`。
  - **别处指过来的链接**：都接住了。
- **和你转述的不一样的地方**：
  - 薄膜干涉加电磁学前置时的层级，我从第 1 层数是 `thin-film-interference` 24→28、`fabry-perot` 25→29。你说的 23→27、24→28 是从第 0 层数，都是加 4，别的小节不变。
  - 「390 宽下拆过 8 个」：拆完以后 390 宽下仍有 17 个放不下，见上。
- 修完以后 9 节都可以标 `reviewed`。

| 小节 | 重要 | 小问题 |
| --- | --- | --- |
| `fermat-principle` 费马原理 | 0 | 1（2 第 5 题「向上凸」、第 2 题 D） |
| `graded-index` 渐变折射率与光线弯曲 | 0 | 1（1 纤芯、包层） |
| `huygens-principle` 惠更斯原理 | 0 | 1（1 球面波、平面波、包络面的括注） |
| `two-beam-interference` 双光束干涉 | 1（前置，`single-slit-diffraction:61` 随之解决） | 0 |
| `coherence` 相干性 | 0 | 1（1 角直径的括注、`:25` 干涉条纹里的标记） |
| `single-slit-diffraction` 单缝衍射 | 0 | 1（1 `:48`、`:59` 拆开标，`:27` 包络的括注） |
| `thin-film-interference` 薄膜干涉 | 0 | 1（1 反射率、入射面） |
| `diffraction-gratings` 衍射光栅 | 1（`:123` 常见误区） | 2（1 级次、5 处拆开标；3 `:55` 偶数级） |
| `fabry-perot` 多光束干涉与法布里-珀罗干涉仪 | 0 | 2（1 级次、反射率、透射率、分辨本领，`:97`、`:107` 的标记；3 `:22` 反射的相位） |
| `_domain.yaml` 新术语 34 条 | 0 | 1（3「半波损失」简介，可选） |

## 怎么审的

- 读了 `docs/plan.md` 已提交的规矩：ca295af（批次 15 审查的写回）、b92bf2a（批次 16 的安排，`:1063` 起「要接住的」）、0eeecb5（页面检查只用 test-serve）。
- **快照**：初审开始时把 `content/physics/optics/` 拷到我的 scratchpad 的 `b16/snap-optics/`，时间是 2026-11-12T14:11:05Z；`git diff HEAD` 的输出也存了一份。审完时和快照比过，只有我改回 `reviewed` 的三行不同，写内容会话这期间没有改动。
- **改动范围**：
  - `git diff HEAD` 有：9 节的 `lesson.md`（从 outline 写成 written）；`_domain.yaml`（术语表加了 34 条，宏没变）；批次 15 的 `reflection-refraction`（3 处补标）、`aberrations:44`、`optical-instruments` 第 8 题，和这三节的 `status`。
  - 9 份 `problems.yaml`、9 张 SVG 是新文件，直接读。
  - 前置没有改动；电磁学、狭义相对论没有改动。
- 逐节读讲解、例题、常见误区，推导逐步核对，例题和讲解里的数都用脚本重算过。
- **简单题、中等题**：只用 `npm run statements` 读题，写完验算脚本、跑出结果以后才打开 `problems.yaml`。
- **难题、思考题**：36 题的参考解答连同三级提示全部读了。关键的式子另外推过：
  - 反射时 $L''(x)>0$；椭圆镜上各路径等长，比椭圆弯得更厉害的镜面上实际路径取极大；抛物面的等光程；
  - 分层介质的 $n\sin\theta$ 守恒、$n^2=n_0^2+\beta y$ 时光线是抛物线、近轴光线的周期 $\frac{2\pi}{\sqrt\alpha}$；
  - 惠更斯作图推反射、折射，牛顿和惠更斯两种预言的速度比互为倒数；
  - 双缝不做近似的光程差、单缝光源移动时条纹的平移 $\frac{sL}D$；
  - 钠双线的相干长度和条纹消失的周期、宽光源的可见度 $\bigl|\frac{\sin u}u\bigr|$、迈克耳孙和皮斯的 $0.039''$ 与 $1.22$ 倍后的 $0.047''$；
  - 单缝次极大 $\tan\beta=\beta$ 的两个根和 $4.7\%$、$1.6\%$，斜入射的 $a(\sin\theta-\sin i)=m\lambda$；
  - 斜看肥皂膜的 $451\,\mathrm{nm}$、增透膜三个波长的反射率和三倍厚膜的 $3.6\%$；
  - $N$ 缝因子的暗处数、紧挨主极大的次极大、斜入射能看到的级次；
  - 法布里-珀罗低反射率的展开、分辨本领 $m\mathcal F$、吸收膜的峰顶 $\bigl(1-\frac A{1-R}\bigr)^2$。
- **公式**：构建不渲染参考解答。我把 9 节 `problems.yaml` 里所有文字的公式都用编译器的 `compileTex` 加本领域的宏渲染了一遍，再跑 `suspectTex`。共 1193 个公式（参考解答 428 个），0 个错误，没有可疑写法。
- **引文和链接**：
  - 用脚本列出 9 节讲解、题目里的链接，目标小节、锚点都存在。
  - 「第 N 题」「例 N」逐个对照题目、例题的内容，没有指错的。
  - 指向还没写的小节的链接有 10 个，目标都是大纲里有的小节：`optimization`、`waves-in-3d`、`reflection-transmission`、`phasors`、`matter-waves`、`birefringence`、`fresnel-diffraction`、`resolving-power`、`lasers`、`michelson-interferometer`。
- **图**：9 张 SVG 用无头 Edge 渲染成 PNG 看过，再按坐标反算角度、长度（见「几何图像」）。
- **术语和格式**：沿用以前批次的检查脚本，改成这 9 节。讲解和题目文字都查了：
  - 每节第一次标记带不带英文，每块第一次出现标没标；
  - 带标记的术语和前后紧挨着的字拼不拼成别的词；
  - 规矩 C 对照前置图查；
  - 段落句数、空格、引号（都没有问题）；
  - 34 个新术语在别的领域已写小节的正文里出现没有；
  - 本节第一次出现的名词括没括英文，两节以上讲解用到的名词进没进表。
- **页面**：
  - `npm run build` 后用 `.claude/launch.json` 的 `test-serve` 打开，进度写临时仓库，查完已停掉。
  - 面板是隐藏的，页面都用 DOM 检查：宽 768 时 9 页都展开全部提示和解答。宽 390 时又量了一遍行内公式。
  - 动画把画布导出成 PNG 看，看完已删。
  - 查完核对过仓库 `progress/` 的三个文件，校验和和开始时一样（`lessons.yaml` 是你原来就有的改动）。
- **跑过的命令**：
  - `npm run content`：0 个错误、0 个警告。
  - 本批 9 个验算脚本逐个单独跑：36 题一致。
  - 全量 `npm run verify`：246 个小节全部一致。
  - `npx tsc -b`：通过。
  - `npm run build`：通过。
  - `npm test`：23 个文件、202 项全部通过。

## 简单题、中等题的验算

脚本在 `tools/verify/physics.optics.<小节>.ts`，辅助文件 `physics.optics._op.ts` 加了几个函数。两套算法互相独立：

1. **公式**：讲解里的式子。
2. **不用这些式子的算法**：
   - **费马原理**：第 3 题在上岸点上做黄金分割求最短时间，再对上岸位置二分；第 4 题取一块具体的薄透镜（厚度 $0.03h^2$），按定义算两条光路的光程，对高度外推。
   - **渐变折射率**：第 1 题把介质分成 300 层逐层折射；第 3 题用 RK4 积分光线方程，二分出刚好被弯回去的角度；第 4 题积分 $r''=\frac1{2\beta^2}\frac{\mathrm d(n^2)}{\mathrm dr}$ 的四分之一周期再乘 4，对振幅外推。
   - **惠更斯原理**：第 4 题把 $\frac1v$ 当折射率用向量形式的折射定律，再二分。
   - **双光束干涉**：路程差按精确几何算，不做小角度近似；第 4 题在相位差上扫一周。
   - **相干性**：第 1 题把光源分成 2000 个互不相干的点，各点的条纹相加，在缝间距上二分出条纹消失处；第 3 题把光谱按波数分成 4000 份。
   - **单缝衍射**：把缝分成 4000 段，次波直接相加（关于缝中心对称，振幅是实数、过暗纹变号），在 $\sin\theta$ 上二分暗纹，按 $L\tan\theta$ 换到屏上。
   - **薄膜干涉**：不用半波损失的规则，振幅反射系数带号，膜里多次反射全部相加；第 1 题在厚度上黄金分割求反射最小；第 4 题在半径上找第 5 个暗环；第 3 题数条纹。
   - **衍射光栅**：$N$ 条缝直接相加；第 4 题对 60000 条缝相加，二分出第一级主极大旁的第一个零点，按瑞利判据换成波长差。
   - **法布里-珀罗**：透射的各束光 $(1-R)(Re^{i\delta})^k$ 直接相加；第 1 题在频率上黄金分割找相邻两峰；第 3 题二分出半高处，按定义算「峰间隔 / 半高宽」。

| 小节 | p1 | p2 | p3 | p4 |
| --- | --- | --- | --- | --- |
| `fermat-principle` | $7.16\,\mathrm{cm}$ ✓ | A、B、D ✓ | $11.04^\circ$ ✓ | $4.50\,\mathrm{mm}$ ✓ |
| `graded-index` | $38.68^\circ$ ✓ | A、D、E ✓ | $0.4438^\circ$ ✓ | $1.347\,\mathrm{mm}$ ✓ |
| `huygens-principle` | $2.50\,\mathrm{cm}$ ✓ | A、C、E ✓ | $442.9\,\mathrm{nm}$ ✓ | $13.40^\circ$ ✓ |
| `two-beam-interference` | $2.356\,\mathrm{mm}$ ✓ | A、C、D ✓ | $600\,\mathrm{nm}$ ✓ | $9$ ✓ |
| `coherence` | $2.50\,\mathrm{mm}$ ✓ | B、C、E ✓ | $200.2\,\mathrm m$ ✓ | $0.600$ ✓ |
| `single-slit-diffraction` | $5.89\,\mathrm{mm}$ ✓ | B、D、E ✓ | $0.160\,\mathrm{mm}$ ✓ | $0.4053$ ✓ |
| `thin-film-interference` | $99.64\,\mathrm{nm}$ ✓ | A、B、E ✓ | $70.68\,\mu\mathrm m$ ✓ | $0.8671$ ✓ |
| `diffraction-gratings` | $22.32^\circ$ ✓ | C、D、E ✓ | $5$ ✓ | $8.333\,\mathrm{pm}$ ✓ |
| `fabry-perot` | $15.0\,\mathrm{GHz}$ ✓ | B、C、D ✓ | $61.24$ ✓ | $2.770\times10^{-3}$ ✓ |

- 提示、解答末尾写出的数逐题和标准答案对过，都一致。
- 题面写「以某个量为单位」的都有 `unit`，问度数的也写了；没量纲的 7 题（比值、可见度、条数、精细度、透射率）不写，对。
- 第 2 题的答案分散：ABD、ADE、ACE、ACD、BCE、BDE、ABE、CDE、BCD。
- 按近似式出的题，照字面精确算也在容差（这批都写了 $0.5\%$，光栅第 3 题是条数）以内：
  - `fabry-perot` 第 3 题：按精细度的定义精确算是 $61.234$，定理给 $61.241$，差 $1\times10^{-4}$；
  - `single-slit-diffraction` 第 1、3 题按 $L\tan\theta$ 精确算，差 $2\times10^{-6}$、$3\times10^{-5}$；`two-beam-interference` 第 1、3 题同样在 $10^{-4}$ 以内；
  - `coherence` 第 3 题：均匀光谱的条纹第一次消失处和 $\frac{\lambda^2}{\Delta\lambda}$ 只差 $\bigl(\frac{\Delta\lambda}{2\lambda}\bigr)^2$ 量级。
- **选择题**：逐项用例子核对，例子写在脚本的 `notes` 里。几个值得一提的：
  - `fermat-principle` p2 C：半径 1 的圆形凹面镜，$A$、$B$ 在直径上、离圆心各 $0.5$，经 $(0,1)$ 反射的实际路径光程 $2.2361$，经旁边 $\pm5^\circ$ 的镜面点都是 $2.2347$，实际路径是极大。
  - `coherence` p2 C：白光 400–700 nm 的相干长度约 $0.93\,\mu\mathrm m$、约 2 条条纹；滤成 540–560 nm 后约 $15\,\mu\mathrm m$、约 27 条。
  - `single-slit-diffraction` p2 E：缝宽 $0.8\lambda$ 时，最暗处在 $\sin\theta=1$，光强仍有中央的 $0.055$，没有暗纹。
  - `thin-film-interference` p2 C：玻璃上镀四分之一波厚的膜，$n=1.38$ 时反射率 $1.3\%$，$n=1.70$ 时 $9.7\%$，比不镀膜的 $4.3\%$ 还大。
  - `fabry-perot` p2 E：$R=0.04$ 时多光束和只取前两束相差不到 $0.4\%$。

## 前置

- **前置一条没改**，没有悬空的 id。
  - 层级（从第 1 层数）：`fermat-principle` 10，`graded-index` 14，`huygens-principle` 22，`two-beam-interference` 23，`coherence`、`single-slit-diffraction`、`thin-film-interference` 24，`diffraction-gratings`、`fabry-perot` 25。
  - `summary` 都在 30 字以内（最长 30）。
- **跨领域前置**：`fermat-principle` ← 微积分 `optimization`（outline）；`graded-index` ← 变分法 `euler-lagrange`；`huygens-principle` ← 振动与波 `waves-in-3d`（outline）；`thin-film-interference` ← 振动与波 `reflection-transmission`（outline，按 goal 假定读者学过）。
- **链外用到、要改的**：`two-beam-interference` 和 `single-slit-diffraction` 用光程，定义在不在链上的 `fermat-principle`（重要 2）。我用脚本把 9 节里标了本领域术语、定义却不在链上的地方全列了，只有这一个概念是推理要用的；其余都是旁白，见下。
- **写内容会话说「在链上、只括注」的 7 个词**，逐个查了前置图：
  - 「驻点」：`fermat-principle` ← `optimization` ← `monotonicity` ← `mean-value-theorem` ← `local-extrema`，goal 写了「会找出函数的驻点」。多变量微积分那个同名术语在链外，不标它，对。
  - 「欧拉-拉格朗日方程」「泛函」「最速降线」：`graded-index` ← `euler-lagrange` ← `functionals`，最速降线就定义在 `functionals`。`:34` 链到 `beltrami-identity` 第 7 题是旁白。
  - 「旋转矢量」：`phasors` 在 `single-slit-diffraction` 的链上。
  - 「阻抗」「反射系数」：`reflection-transmission` 的 goal 是「会引入阻抗，并用边界条件求……反射系数和透射系数」。
- **薄膜干涉不加 `fresnel-equations` 前置**：同意。
  - 讲解只用到两件事：两束反射光的相对相位（「恰有一次半波损失」的规则），和振幅的大小 $|r|=\frac{|n_1-n_2|}{n_1+n_2}$。
  - 弦上的位移对应电场、和波速成反比的阻抗对应折射率，照搬弦的结果得 $r=\frac{n_1-n_2}{n_1+n_2}$。符号就是电场的：$n_1<n_2$ 时 $r<0$。
  - 弦的位移该对应电场还是磁场，类比本身定不了。可换成磁场，两次反射的号一起反过来，相对相位不变，$|r|$ 也不变。讲解和题目用到的结论都不依赖这一点，所以到「证明思路」的深度用不着电磁学的边界条件。
  - 斜入射的例外，`:29` 已经用旁白交代，链到菲涅耳公式第 8 题；`:24` 也说了电磁学严格推出同样的结果。
  - 加前置的代价是 `thin-film-interference` 24→28、`fabry-perot` 25→29，别的小节不变。
- **链外用到、看过、不用改的**：
  - **旁白，标了术语、括注了英文**：
    - `fabry-perot:62` 的「主极大」（`diffraction-gratings` 不在它的链上），`:101` 的「焦距」「焦点」；
    - `fermat-principle:57`、`single-slit-diffraction:41` 的「焦点」；
    - `huygens-principle:34` 菲涅耳的史实里的「干涉」；
    - `graded-index:58`、`:116` 拿阶跃光纤对比时的「全反射」（也是中学词）；
    - `fabry-perot` 第 7 题的「相干长度」（链到 `coherence`）。
  - **电磁学的「电场」**（`two-beam-interference:22`、`:32`，`thin-film-interference:29`）：plan.md:245 列的中学基础词，不标。
  - **`graded-index:60` 的「近轴光线」**：`paraxial-refraction` 不在链上。可「光线方程」那一块先写了「光线和轴的夹角很小时」，意思在本节交代了，标记只是给名字。
- **别处指过来的链接，都接住了**：
  - 变分法 `beltrami-identity` 第 7 题（伯努利借光学解最速降线，链到 `fermat-principle`）：`graded-index:34` 讲了 1697 年伯努利的做法，并链回那一题。
  - 电磁学 `fresnel-equations:43`（费马原理）、例 1 和第 8 题（薄膜干涉）：`thin-film-interference:29` 接第 8 题的斜入射，`:54` 接例 1 的「镜头十几个表面」，说法一致。
  - `reflection-refraction:27`、`aberrations` 第 6 题（光阑太小时衍射，链到 `single-slit-diffraction`）：`single-slit-diffraction` 的衍射定义、例 2「针孔相机的孔该多大」正好接住。
  - `total-internal-reflection` 第 6 题（模间时延）：`graded-index:58` 和第 8 题接了，链回那一题。
  - `reflection-refraction:59` 和第 5 题（用波阵面推折射、反射定律）：`huygens-principle` 用同一套作图、同样的 $n_2=1.5n_1$、$50^\circ$、$30.7^\circ$。
  - `spherical-mirrors` 第 6 题（抛物面镜）：`fermat-principle:57` 和第 8 题链过去，说法一致。

## 逐节

### physics.optics.fermat-principle 费马原理

- 讲解：
  - 定义用「取极值」，紧接着说明是「导数为零，即驻点」，和第 2 题 C、第 6 题的极大值一致；
  - 反射、折射两个定理的证明，例 2 的 $x\approx1.27\,\mathrm m$、$51.7^\circ$、$36.2^\circ$、$3.26$ 对 $3.30$，都对。
- 小问题 2：第 5 题「向上凸」、第 2 题 D。

### physics.optics.graded-index 渐变折射率与光线弯曲

- 讲解：
  - 光线方程和 $n\sin\theta$ 守恒的推导都对；
  - 例 1 的 $2.4\times10^{-5}$、$0.40^\circ$、$1.7\times10^2\,\mathrm m$，例 2 的 $4.32\times10^7\,\mathrm{m^{-2}}$、$0.96\,\mathrm{mm}$ 都对；
  - 动画里三条光线周期相同，`c` 拉到最小时 $0.10\,\mathrm{rad}$ 那条超出纤芯边缘，和说明一致。
- 小问题 1：`:58` 的纤芯、包层（进表、括注）。

### physics.optics.huygens-principle 惠更斯原理

- 讲解：
  - 两个定理的作图证明都对；例 1 的 $1.50\,\mathrm{cm}$、$28.9^\circ$，例 2 的 $0.75$ 和 $1.33$ 都对；
  - 惠更斯 1678 年提出、1690 年出版，阿拉戈 1838 年的提议、傅科 1850 年的测量，都对。
- 小问题 1：`:32` 的球面波、包络面，`:41` 的平面波没括注。

### physics.optics.two-beam-interference 双光束干涉

- 讲解：
  - 光强公式、杨氏双缝的推导都对；例 1 的 $4.75\,\mathrm{mm}$、$28.5\,\mathrm{mm}$，例 2 的 $6.64\,\mu\mathrm m$ 都对；
  - 动画里蓝光画成蓝色、红光画成橙色，配色和说法一致。
- 重要 2：`:39`、`:97`、`:106` 用光程，要加前置 `fermat-principle`。

### physics.optics.coherence 相干性

- 讲解：
  - 可见度、相干长度和相干宽度的两个定理都对；例 1 的 $20\,\mu\mathrm m$、$6.6\times10^{-14}\,\mathrm s$、约 31 条条纹，例 2 的 $59\,\mu\mathrm m$、$1.1\,\mathrm{mm}$ 都对；
  - 图里 A、B 两套条纹错开半个间距，`:69` 专门说明了两个点和连续光源的区别，对。
- 小问题 1：`:63` 的角直径没括注；`:25` 标了「干涉条纹」里的「干涉」。

### physics.optics.single-slit-diffraction 单缝衍射

- 讲解：
  - 暗纹条件、光强公式、旋转矢量的说法都对；次极大 $4.72\%$、$1.65\%$ 写成 $4.7\%$、$1.6\%$；
  - 例 1 的 $0.36^\circ$、$25.3\,\mathrm{mm}$，例 2 的 $0.47\,\mathrm{mm}$ 都对；第 6 题的 $48.6^\circ$、$14.5^\circ$，第 8 题的 $84\,\mu\mathrm m$ 都对。
- `:61` 证明里用的光程在链外，`two-beam-interference` 加前置后随之解决（重要 2），本节不用改。
- 小问题 1：`:48`、`:59` 定理标签里「单缝衍射」拆开标；`:27` 的包络没括注。

### physics.optics.thin-film-interference 薄膜干涉

- 讲解：
  - 弦的类比、半波损失的定义和斜入射的例外都对；`:38` 第三束约 $4\%$（我算 $3.8\%$）对；
  - 增透膜 $r_1\approx-0.160$、$r_2\approx-0.048$、$1.2\%$（两束近似 $1.24\%$，多次反射全加 $1.26\%$）、$4.3\%$、理想折射率 $1.23$ 都对；
  - 牛顿环的史实（胡克 1665、牛顿 1704、杨 1802 前后）都对。
- 小问题 1：`:38`、`:54` 的反射率（进表）、`:29` 的入射面没括注。

### physics.optics.diffraction-gratings 衍射光栅

- 讲解：
  - 光栅方程、多缝光强、主极大宽度、色分辨本领的证明都对；
  - 例 1 的 $14.5^\circ$–$25.9^\circ$、$30.0^\circ$–$61.0^\circ$、$48.6^\circ$ 起和 $533\,\mathrm{nm}$，例 2 的 982 条、$1.64\,\mathrm{mm}$、$3.8\times10^{-4}\,\mathrm{rad}$ 都对。
- 重要 1：`:123` 的常见误区（`:71` 一起改）。
- 小问题 1：级次进表；`:37`、`:44`、`:53`、`:98`、`:122` 拆开标。小问题 3：`:55`。

### physics.optics.fabry-perot 多光束干涉与法布里-珀罗干涉仪

- 讲解：
  - 透射率公式、精细度定理、自由光谱范围都对；
  - $R=0.04$ 时 $F\approx0.17$、$T_{\min}\approx0.85$，$R=0.9$ 时 $F=360$，$R=0.95$ 时 $\mathcal F\approx61$，$R=0.99$ 时约 $310$ 都对；
  - 例 1 的 $0.025\,\mathrm{nm}$、$29.8$、$8.4\times10^{-4}\,\mathrm{nm}$、约 $6\times10^5$，例 2 的 $0.57^\circ$、$0.81^\circ$ 都对。
- 小问题 1：级次、反射率进表；透射率、分辨本领没括注；`:97`、`:107` 的标记。小问题 3：`:22`。

## 重要 1 · `diffraction-gratings:123` 的常见误区说反了

- 原文：「「光栅常量越小，色分辨本领越高。」光栅常量小，同一级里不同颜色分得更开，但 $R=mN$ 只和级次、照亮的缝数有关；能分开的最小波长差还受主极大宽度的限制。」
- 问题：
  - 两块光栅一样宽（照亮的宽度 $W$ 一样）时，缝数 $N=\frac Wd$，同一级 $R=\frac{mW}d$，光栅常量越小 $R$ 越高。这句话在最自然的比较方式下是对的。
  - 同一节第 4 题就是这样算的：宽 $5.0\,\mathrm{cm}$、每毫米 $1200$ 条，$N=6.0\times10^4$。换成每毫米 $600$ 条、同样宽，第一级 $R$ 从 $6.0\times10^4$ 降到 $3.0\times10^4$。
  - 只有「照亮的缝数相同」时，它才是误区，这里漏了这个前提。
- 改法（任选一种）：
  - 误区加上前提：「照亮的缝数相同时，光栅常量越小，色分辨本领越高。」解释照旧。
  - 或者换成真错的说法：「光栅常量越小，能达到的最高色分辨本领越高。」垂直入射时 $|m|\le\frac d\lambda$，$R\le\frac W\lambda$，上限只由照亮的宽度决定，和光栅常量无关。
- 同一处的 `:71`「色分辨本领只由级次和照亮的缝数决定，和光栅常量无关」本身不错，可读者会照字面理解成「换光栅常量不影响 $R$」。建议改成「……和光栅常量没有直接关系：光栅一样宽时，光栅常量小，缝数就多」。
- 这一批别处同类的说法都写了前提：第 2 题 C、第 6 题（3）、第 8 题（3）、`fabry-perot` 第 6 题。

## 重要 2 · `two-beam-interference` 缺前置 `fermat-principle`

- 「光程」定义在 `fermat-principle:24`（`def-optical-path`）。`two-beam-interference` 的前置只有 `huygens-principle`，链上没有它。
- 用到的地方都是推理，不是旁白：
  - `two-beam-interference:39`：定义光程差，「两条路径的光程之差叫作光程差」；
  - `:97`–`:99` 例 2：云母片让一路的光程多了 $(n-1)t$；
  - `:106` 常见误区「有介质时要用光程」；
  - `single-slit-diffraction:61`：光强公式的证明里，次波到远处的光程差（前置是 `two-beam-interference`，链上同样没有费马原理）。
- `:41` 的「为什么这样定义」从相位推出 $ns$，意思接近交代了，可「光程」这个词和它的定义还是在链外。
- 术语表「光程差」的简介「两条路径的光程之差」也用了它（plan.md:244 末尾：简介只用定义它的那一节链上的概念）。
- 和批次 15「`aberrations` 用阿贝数」是同一类（plan.md:245「同一领域也一样」）。
- 改法：`two-beam-interference` 的 `prerequisites` 加 `physics.optics.fermat-principle`。
  - 我按前置图重算过：所有小节的层级都不变（`two-beam-interference` 仍是 23 层，`fermat-principle` 在 10 层），下游的 `coherence`、`single-slit-diffraction`、`thin-film-interference`、`diffraction-gratings`、`fabry-perot` 和量子力学 `matter-waves` 都随之接上。
  - 讲解不用改。

## 小问题 1 · 名词和标记（汇总）

- **两节以上讲解用到、没进术语表的名词（plan.md:244）**，共 4 个。数的是讲解正文，不含链接文字、图注和题目：

| 名词 | 讲解里出现的小节 | 起名的地方 |
| --- | --- | --- |
| 纤芯、包层 | `total-internal-reflection`（12、10 处）、`graded-index`（7、1 处） | `total-internal-reflection:42`（括注了，没有锚点） |
| 级次 | `diffraction-gratings`（5 处）、`fabry-perot:99` | `diffraction-gratings:37`（`def-principal-maximum`，括注了 order） |
| 反射率 | `thin-film-interference:38`、`:54`，`fabry-perot`（14 处） | `fabry-perot:22`（写了「反射光强和入射光强之比」，没有锚点） |

  - 进表以后，起名处没有锚点的要加锚点；其余小节第一次出现的地方补标。`total-internal-reflection` 是已审的，要退回 `written`，plan.md:244 说这是正常流程。
  - 「反射率」：`thin-film-interference` 用得早，又是 `fabry-perot` 的前置。起名放在 `thin-film-interference`（例如 `:54` 算增透膜反射率的地方）更顺，`fabry-perot:22` 就成了链上的词。
  - 「光纤」也是两节用到，我按基础词算（和已认定的「望远镜」一样是日常词），没列进去，见「我替你定的」。
  - 相位差、光强、单色光、谱线是中学的词，没算。
- **本节第一次出现没括注英文**（plan.md:242）。上表的词进表后标记时一起括注；不进表的这几个也要括：
  - `huygens-principle:32` 球面波、包络面，`:41` 平面波（链上的 `waves-in-3d` 讲的，plan.md:245「链上学过的不标记，第一次出现照样括注英文全称」）；
  - `single-slit-diffraction:27` 包络；
  - `coherence:63` 角直径（`:104` 也没括）；
  - `thin-film-interference:29` 入射面（批次 15 在 `reflection-refraction` 括过 plane of incidence），`:38` 反射率；
  - `fabry-perot:30` 透射率（定理标签里），第 6 题题干（`problems.yaml:111`）分辨本领（`:87` 只在标题里出现）。
  - 「平面波」「球面波」如果你认为是中学词，可以不括。
- **复合词的标法（plan.md:246）**：
  - **整个词的意思就是这个术语，却拆开标了**，共 8 处（初稿误写成 7 处，复核时更正）。按「正常色散」之于「色散」的先例，整个词带标记，例如 `:term[单缝衍射]{id="physics.optics.diffraction"}`：
    - `single-slit-diffraction:48`、`:59` 定理标签里的「单缝衍射」；
    - `diffraction-gratings:37`「光栅衍射」、`:44` 定理标签里的「多缝衍射」、`:53`、`:98`、`:122`「单缝衍射」；
    - `fabry-perot:107`「双光束干涉」。
  - **长词的意思不是这个术语，里面的短术语却标了**，共 2 处。按「电流计」「磁滞回线」的先例，里面的短术语不标：
    - `coherence:25`「干涉条纹最亮处」标了「干涉」。去掉这个标记就行，这一块别的「干涉」只在链接文字里。
    - `fabry-perot:97`「照到例 1 的干涉仪上」标了「干涉」。按简称标成 `:term[干涉仪]{id="physics.optics.fabry-perot-interferometer"}`（plan.md:243 的简称规矩），或者写全「法布里-珀罗干涉仪」再标。
    - 写内容会话判断狭义相对论、电磁学里的「干涉仪」「干涉条纹」是长词、不补标，我同意（见「跨领域补标」）。这两处改了，两边才一致。

## 小问题 2 · 题目（汇总）

- **`fermat-principle` 第 5 题参考解答（`problems.yaml:106`）**：「$L''(x)=\ldots>0$，$L$处处向上凸，唯一的驻点就是最小值」。
  - 「向上凸」通常指∩形（中间高），对应 $L''<0$，和这里正好相反。
  - 网站别处的说法是「凸函数」「图像向上弯」：多变量微积分 `legendre-transform:22`「$f''>0$，于是 $f$ 严格凸（strictly convex），图像向上弯」。
  - 改成「$L$ 是凸函数（图像向上弯）」。
- **`fermat-principle` 第 2 题 D（`problems.yaml:36`）**：「光从空气斜射进水里，实际走的折线比连接两点的直线光程小」。
  - 例 2「光为什么不走直线」判的就是这个比较（空气、水，$3.26$ 对 $3.30$），解答也写「（例 2）」。
  - plan.md:227：「选择题的选项也不要照搬讲解、例题里已经判过的例子」。
  - 换一个讲解、例题没判过的说法，正误不限。

## 小问题 3 · 说法（汇总）

- **`fabry-perot:22`**：「振幅再乘 $R$，相位落后 $\delta=\frac{4\pi nd\cos\theta}\lambda$，反射本身带来的相位变化也算进 $\delta$ 里」。
  - 反射的相位变化算进去以后，$\delta$ 就不再等于 $\frac{4\pi nd\cos\theta}\lambda$。
  - 可 `:34`「$\delta=2\pi m$，即 $2nd\cos\theta=m\lambda$ 时 $T=1$」、`:54`「峰在 $\nu_m=\frac{mc}{2nd}$」、第 2 题 D「往返光程是波长的整数倍」（判为对），都按 $\delta=\frac{4\pi nd\cos\theta}\lambda$ 来的。
  - 两者只在「两次反射的相位变化合起来是 $2\pi$ 的整数倍」时一致：两面相同，像薄膜干涉里「两次都有半波损失」那样。
  - 改法：把这句换成这个前提，再补一句「一般情况下只是所有的峰一起平移，峰的形状和间隔不变」。
- **`diffraction-gratings:55`**：「$d=2a$ 时所有偶数级都缺」。
  - 零级不缺，$k=0$ 不是单缝衍射的暗纹。
  - 改成「第 $\pm2$、$\pm4$……级都缺」。术语表「缺级」的简介写的是「第 $k$、$2k$……级」，对。
- **术语表「半波损失」的简介（`_domain.yaml:518`，可选）**：
  - 简介照定义段写，没有讲解边界情况里的「接近垂直入射」（`thin-film-interference:29`）。浮窗在别处弹出时，读者看不到这个条件。
  - 可以改成「光接近垂直入射、从折射率小的介质射向折射率大的介质反射时……」。现在 53 字，加 7 字正好 60。

## 记号与约定

写内容会话定的几件事，我都同意：

- **光程差和半波损失**：恰有一次反射有半波损失时才加 $\frac\lambda2$，只在接近垂直入射时用。`thin-film-interference` 的定理、例题和题目都照这个做，第 6 题把号放进 $r_1$、$r_2$ 里，两种写法一致。
- **相干长度、相干宽度按「条纹基本看不见时」定义成量级**：定理给 $\frac{\lambda^2}{\Delta\lambda}$、$\frac\lambda{\theta_s}$，`coherence:108` 说了圆形光源、圆孔要乘约 $1.22$，第 7 题用了。我用均匀光谱、均匀条形光源直接相加，条纹第一次消失的地方正是这两个式子。
- **记号**：
  - 单缝用 $\beta$，光栅用 $\gamma$，不冲突；
  - 法布里-珀罗的 $R$ 是反射率、$F=\frac{4R}{(1-R)^2}$、精细度 $\mathcal F$；光栅的 $R$ 是色分辨本领。两节的例题、题目都没让两个 $R$ 碰头，`fabry-perot` 例 1 写 $\frac\lambda{\Delta\lambda}$、第 6 题写「分辨本领 $\frac\nu{\delta\nu}$」，避开了；
  - `thin-film-interference` 第 6 题的 $R$ 是反射率，同一节讲解、例 2、第 4、7 题的 $R$ 是透镜球面半径。各自在题面或定理里交代了，不改。
- **复数只用来求和**：相位落后写 $e^{-i\delta}$，没用复折射率。光栅的求和写 $e^{2i\gamma}$，只取模，不影响。
- **斜入射角从法线量起**：`single-slit-diffraction` 第 6 题、`diffraction-gratings` 第 6 题都写 $a(\sin\theta-\sin i)=m\lambda$，不偏折时 $\theta=i$，一致。
- **锚点**：
  - `young-double-slit` 指 `thm-young`，定理标签里起了名；
  - 相干长度、相干时间、时间相干性共用 `def-coherence-length`；相干宽度、空间相干性共用 `def-spatial-coherence`；
  - 衍射光栅、光栅常量共用 `def-grating`。
  - 起名的那一段都带着这些词，34 条的锚点都存在，都指向起名的那一段。
- **不进表的词**：「等倾条纹」只在 `fabry-perot` 例 2 的标题里出现；瑞利判据在 `diffraction-gratings:62` 只描述不起名，留给 `resolving-power`。
- **`fabry-perot:32` 写「无穷等比数列的和」**，不用「级数」，对。
- **迈克耳孙和皮斯**：第 7 题（3）相干宽度约 $3\,\mathrm m$，大于威尔逊山那台 100 英寸（$2.54\,\mathrm m$）望远镜的口径，所以要架横梁，对。

## 格式、术语、证明深度、难度档

- **34 个新术语**：简介都在 60 字以内（最长 55），锚点都存在，都在起名的那一段。简介里用到的概念，除了「光程差」用的光程（重要 2），都在定义它的那一节的链上。
- **每块第一次出现**：脚本报的「光程」都是「光程差」里的两个字，不算。每节第一次标记都带英文（定理标签里写成「（光栅方程，grating equation）」的 3 处是标签的写法）。
- **「为什么这样定义」**：27 个 `def-` 锚点后面都有，也都有反例或边界情况。
- **段落句数、中英文空格、引号**：9 节讲解和题目文字都没有问题。
- **规矩 C 的跨领域补标**，写内容会话列的几条都成立：
  - 狭义相对论的「干涉仪」「干涉条纹」「流水干涉实验」、电磁学 `vector-potential:105` 的「干涉条纹」：长词，意思不是「干涉」，按 plan.md:246 不算出现。
  - `relativistic-doppler:90` 的「次波」是「各测一次波长」，字面巧合。
  - 电磁学 `retarded-potentials:22` 的「惠更斯原理」在「见[三维波动方程与惠更斯原理]」的标题链接里，那一节讲的还是偏微分方程里的惠更斯原理；`fresnel-equations:43`、`:109` 都是「见[……]」的标题链接。
  - 分析力学 `hamiltons-principle:62` 的「费马原理」：`problems.yaml` 第一次提交在 c76e6a5（内容批次 1），不追溯。
- **证明深度和难度档**：和前几批一样。每节 8 题，两道简单、两道中等、两道难题、两道思考题；难题都要自己推一段，思考题都有物理图像。

## 几何图像

- **9 张 SVG**，按坐标反算过：
  - `fermat.svg`：
    - 左图 $A$、$B$ 离镜面 3、1 个单位，相距 8，$P$ 在 6 处，$A'$ 是 $A$ 的镜像，$A'$、$P$、$B$ 共线；
    - 右图 $\frac{\sin\theta_1}{\sin\theta_2}=1.500$。
  - `mirage.svg`：虚线是光线在眼睛处的切线（斜率 $-0.674$ 对曲线的 $-0.65$），指向路面以下。
  - `huygens.svg`：
    - 入射角 $50.0^\circ$，$BB'=199.2$，$AA'=132.8$，比值 $1.500$，折射角 $30.70^\circ$，$A'B'\perp AA'$；
    - 三个次波的半径 $132.8$、$88.5$、$44.3$，都和 $A'B'$ 相切。
  - `young.svg`、`single-slit.svg`、`grating.svg`：程差线段的长度和说明一致。光栅图里四段粗线依次是 $d\sin\theta$ 的 1、2、3、4 倍，单缝图里 $\frac\lambda2$ 正好是 $a\sin\theta$ 的一半。
  - `film.svg`：$\frac{\sin i}{\sin\theta_t}=1.51$，两束反射光平行，$C$ 到 $A$ 是 $2t\tan\theta_t$，$D$ 是 $C$ 到第一束的垂足。
  - `fabry-perot.svg`：四束透射光平行，相邻两束的间距是 $2d\tan\theta$。光在两块玻璃板里没画折射，板很薄，看不出来，不改。
  - `spatial-coherence.svg`：A、B 两套条纹错开半个间距，`:69` 专门说明了，对。
- **两处文字贴线**，页面检查脚本报了，放大看过：`fermat.svg` 的 $\theta_2$ 下沿贴着经过 $x=435$ 那条虚线，`huygens.svg` 的 $A'$ 贴着 $A$ 的次波弧。都不到 1 像素，没有压字，不算问题；要挪的话挪 2–3 个单位就开了。
- **动画**：8 个都导出画布看过，滑块拉到两端：
  - `fermat-principle`：比值 1 时最小点在 $x=1$，2 时在 $x\approx1.5$，导数过零处就是最小点。
  - `graded-index`：三条光线周期相同；差最小时 $0.10\,\mathrm{rad}$ 那条超出 $\pm25\,\mu\mathrm m$（我算从 $c<0.0074$ 起超出）。
  - `two-beam-interference`：$d$ 越大条纹越密，中央两色都最亮。
  - `coherence`：第一次消失在 $\frac{360}{\Delta\lambda/\mathrm{nm}}\,\mu\mathrm m$；$\Delta\lambda=10\,\mathrm{nm}$ 时画面内不消失（$V$ 最低 $0.56$），$100\,\mathrm{nm}$ 时在 $3.6\,\mu\mathrm m$，之后可见度很低、明暗颠倒。
  - `single-slit-diffraction`：缝宽 $0.05$、$0.1$、$0.5\,\mathrm{mm}$ 时第一条暗纹在 $12$、$6$、$1.2\,\mathrm{mm}$。
  - `thin-film-interference`：膜的折射率在 $1.1$ 到 $1.5$ 之间，最低点都在 $550\,\mathrm{nm}$，两端总比中间高；$1.23$ 时 $550\,\mathrm{nm}$ 处的反射率约 $5\times10^{-6}$。
  - `diffraction-gratings`：$N=1$ 时两条曲线重合；$\pm3$ 级缺；$N=5$ 时相邻主极大之间 3 个小亮纹。
  - `fabry-perot`：$R=0.04$ 时两条曲线重合，$R=0.95$ 时峰顶仍是 1、宽约 $0.016$。
- **页面**：
  - 宽 768、全部提示和解答展开后，9 页都不左右滚动，没有公式错误，题数 8，卡片数和锚点数一致。
  - 宽 390 时题卡里宽过容器的行内式（题干 325、提示 297、解答 290 像素），共 17 个：
    - `fermat-principle` 第 1、4 题解答；
    - `graded-index` 第 3 题提示和解答、第 4 题解答；
    - `two-beam-interference` 第 1 题解答、第 3 题提示和解答、第 4 题解答；
    - `coherence` 第 1 题提示；
    - `single-slit-diffraction` 第 1、3 题提示；
    - `thin-film-interference` 第 3 题提示和解答；
    - `diffraction-gratings` 第 4 题提示；
    - `fabry-perot` 第 1、4 题解答。
  - 题卡里提示、解答的行内式实测整体不折行（`white-space: nowrap`），所以会撑宽。plan.md:268 说手机宽度不在目标里，不用拆。`huygens-principle` 在 390 宽下也不滚动。

## 史实和数字

- 你点名的都对：
  - 亚历山大城的希罗（约 1 世纪）用最短路径讲反射；费马 1662 年用最短时间推出折射定律；傅科 1850 年测水中光速；约翰·伯努利 1697 年借光学解最速降线；
  - 惠更斯 1678 年提出、1690 年出版《光论》；阿拉戈 1838 年提议比较光速；
  - 杨 1801 年、1803 年的讲座，1803 年用针孔做光源；约恩松 1961 年的电子双缝。
- 写内容会话复查过的，我也核了：
  - 太阳的角直径 $1919''$（$0.533^\circ$）；迈克耳孙和皮斯 1920 年 12 月测参宿四、1921 年发表，$3.07\,\mathrm m$、$0.047''$；菲涅耳 1818 年的论文、1819 年获奖；
  - 夫琅禾费 1821 年用 260 根平行金属丝做光栅、量 D 线的波长（[Physics Today](https://physicstoday.aip.org/opinion/the-master-of-dispersion)、[David Darling](https://daviddarling.info/encyclopedia/F/Fraunhofer.html)）；
  - 胡克 1665 年《显微术》、牛顿 1704 年《光学》、杨 1802 年前后用牛顿环的数据算各色光的波长；
  - 法布里和珀罗 1899 年发表这种装置和测光谱的方法（《化学和物理年鉴》16 卷，同年《天体物理学报》9 卷有英文版）。
- 写内容会话自己改的数都对：
  - `graded-index` 第 3 题 $7.74\times10^{-3}$（$\sqrt{\frac{2\times3.0\times10^{-5}}{1.00026}}=7.745\times10^{-3}$）；
  - 单缝第二个次极大 $1.65\%\to1.6\%$；
  - `thin-film-interference` 第 5 题 $450.6\to451\,\mathrm{nm}$，第 6 题 $\cos152.3^\circ$（$\pi\cdot\frac{550}{650}=152.31^\circ$）；
  - `fabry-perot` 的「约 310」（$312.6$）、第 6 题「约 34 倍」（$2.04\times10^6\div6.0\times10^4=34.0$）。
- 有意取的整数：`two-beam-interference` 第 1 题「约 850 倍」（849）、单缝例 1「约 250 倍」（253）、`fabry-perot`「约为 310」（313），说法都带「约」，可以。

## 批次 15 退回的三节

- 对照 `git diff HEAD`，改动只有补标处：
  - `reflection-refraction:41`、`:59`、`:80` 的「波阵面」：`:41` 是本节第一次，带了 wavefront；`:59`、`:80` 分属另两块，块里第一次，都标了。plan.md:246 要求同一领域已写的小节补标，对。
  - `aberrations:44` 的「衍射」：原来就括注了 diffraction，现在加了标记，是这一块第一次，对。
  - `optical-instruments` 第 8 题（3）：「衍射」第一次出现，加了 diffraction 的括注。题目文字可标可不标，对。
- 三节 `lesson.md` 第 11 行已改回 `status: reviewed`，别的没动。

## 我替你定的（都能改）

- **「光纤」按基础词算**：
  - 它和「望远镜」一样是日常词，不进表，`graded-index` 也不用补括注。
  - 「纤芯」「包层」是专门的词，要进表。
  - 如果你认为「光纤」也该进表，起名放在 `total-internal-reflection:42`。
- **选项和常见误区同义不算「照搬」**：例如 `graded-index` 第 2 题 B、C 和本节常见误区的头两条几乎一样。
  - plan.md:227 说的是「判过的例子」。误区是一般说法，以前各批也这样出题，所以只报了照搬例 2 的 `fermat-principle` 第 2 题 D。
- **「精细度大致是参与叠加的光束数」**（`fabry-perot:46`、第 6 题（1））：常见教材的说法，接受。
  - 它和 `:27`「约 $\frac1{1-R}$ 束降到 $\frac1e$」差一个 $\pi$ 的因子，都只是量级说法。
- **同一块里重复标记不改**：例如 `coherence`「时间相干性」一块的相干长度、相干时间，4 节共 8 处。只有第一处有下划线，多标无害。
- **390 宽的溢出不算问题**（plan.md:268）。
- **`graded-index:60` 的「近轴光线」不算链外概念当推理用**：意思在本节先交代了。

## 要用户决定的

- 无。

## 要写回 plan.md 的

1. **plan.md:246 复合词的例子**，加上：
   - 「单缝衍射」「光栅衍射」「多缝衍射」之于「衍射」、「双光束干涉」之于「干涉」，整个词标；
   - 「干涉条纹」「干涉仪」「流水干涉实验」里的「干涉」不算出现（批次 16 审查时提的）。
2. **常见误区的写法**：误区要在最自然的理解下确实不成立；只在某个条件下不成立的，把条件写进误区。可以并进 plan.md:227「选项写清前提」那一条（批次 16 审查时提的：光栅常量与色分辨本领）。
3. **plan.md:244 进表的例子**：修完以后补上批次 16 进表的纤芯、包层、级次、反射率。
4. **plan.md:242 光学的基础词**：如果你同意，加上「光纤」。
5. **plan.md:245「同一领域也一样」的例子**：批次 16 审查时提的，`two-beam-interference` 用光程，加前置 `fermat-principle`，层级不变。

## 没验证的地方

- 深色模式没看：面板是隐藏的，只导出了画布、读了 DOM。
- 动画只看了滑块两端和默认值，中间值没逐个拉。
- 390 宽下写内容会话拆过的 8 处认不出是哪几处（我不读它的交接说明），只确认了现在的样子。
- `local-extrema`、`phasors`、`waves-in-3d`、`reflection-transmission` 还是 outline。驻点、旋转矢量、平面波与球面波、阻抗是否真在那里讲，只按它们的标题和 goal 判断。

## 复核

审内容 agent · 2026-11-12。按「每批的流程」第 4 条，只看初审以后的改动：和初审快照 `b16/snap-optics/`（2026-11-12T14:11:05Z）逐个文件比，不重复初审报过的问题。

### 结论

- **通过**。重要 2 条、小问题 3 条都改了，改法都对；修订带出来的改动也没有新问题。
- 改成 `reviewed` 的 10 节（只改第 11 行）：9 节新课，和退回过的 `total-internal-reflection`。
- 和快照比，改动和你转述的修订说明一一对得上，没有说明里没提的改动。另外三处只差第 11 行，是我初审时把批次 15 那三节改回 `reviewed`。
- 我自己的一处更正：初审写「拆开标，共 7 处」，可列出的是 8 处，数错了，正文已改成 8。写内容会话 8 处都改了。

### 逐条

- **重要 1**：`diffraction-gratings:123` 加了「照亮的缝数相同时」，`:71` 也改了，都对。
  - 解释里补了两句：「主极大也按同样的比例变宽」；「光栅一样宽时才不同（第 4 题）」。
  - 缝数 $N$ 不变时，角色散 $\frac m{d\cos\theta}$ 和主极大的角宽 $\frac\lambda{Nd\cos\theta}$ 都和 $d$ 成反比，$R=mN$ 不变；宽度一定时 $N\propto\frac1d$。
- **重要 2**：`two-beam-interference` 加了前置 `fermat-principle`。
  - 重算前置图，9 节的层级和初审时一样：10、14、22、23、24、24、24、25、25。
  - `two-beam-interference:39`、`:97`、`:106`、`single-slit-diffraction:61` 的光程，和术语表「光程差」的简介，都到了链上。
  - 本领域的链外标记重扫了一遍，剩下的都是旁白（见下面「简称标记」）。
- **小问题 1 · 名词和标记**：
  - **4 个词进表（70 → 74）**：
    - 简介 42、37、49、34 字，锚点都在起名的那一段。
    - 三个新锚点 `def-core-cladding`、`def-order`、`def-reflectance` 后面都有「为什么这样定义」和边界情况。
    - 起名的位置都同意：
      - 「级次」起名在 `two-beam-interference`，它是 `diffraction-gratings`、`fabry-perot` 共同的前置；
      - 「反射率」在 `thin-film-interference`，是 `fabry-perot` 的前置；
      - 「纤芯」「包层」在 `total-internal-reflection`。`graded-index` 为此加前置 `total-internal-reflection`，它仍是 14 层；`:58`、`:116` 的「全反射」也就成了链上的词。
    - `thin-film-interference` 新定义段说「不吸收光时，透过的光强占入射光的 $1-r^2$」，对。
    - 补标：用脚本扫了光学 18 个已写小节，这 4 个词和下面的两个简称在每块第一次出现都标了。
    - 别的领域的讲解里没有这几个词。电磁学 `fresnel-equations:62` 自己定义了反射率，照先例不补标，同意。
  - **括注**：初审列的 9 处都补了。
  - **复合词**：8 处整词标、2 处长词都按初审的建议改了。`coherence:25` 去掉标记以后，脚本会报这一块的「干涉」没标，这是「干涉条纹」里的两个字，按 plan.md:246 不算出现。
- **小问题 2 · 题目**：
  - `fermat-principle` 第 5 题改成「凸函数（convex function，图像处处向上弯）」，和 `legendre-transform:22` 的说法一致。
  - 第 2 题 D 换成光路可逆，判对，答案不变。
    - 同一条路径反着走，光程不变，所以两个方向光程取极值的是同一条路径。
    - 光路可逆是 `reflection-refraction` 的定理，在链上；本节讲解、例题没判过，不算照搬。
    - 我把验算脚本里 D 的例子换了：从 $B$ 到 $A$ 另按光程最小找通过点，和 $A$ 到 $B$ 的一样，都是 $x=1.268$；再让光从 $B$ 射向这一点，按向量形式的折射定律出射，正好指向 $A$。
- **小问题 3 · 说法**：`fabry-perot:22` 的前提、`diffraction-gratings:55`、「半波损失」的简介（59 字）都对。
- **同类整批改的**：
  - `fabry-perot:105`：误区改成「峰顶越低」，解释说各种波长平均下来透过的光确实少。对：$T$ 对 $\delta$ 取平均是 $\frac{1-R}{1+R}$，$R$ 越大越小。
  - `fabry-perot:107`：解释和 `:22` 的约定对齐，对。
  - `huygens-principle:83`：改成「次波向后也传，所以实际的光也有一部分向后传」，解释补了「在均匀介质里，光并不向后传」。误区的结论确实不对了。
  - 选项补的前提，正误都没变，也和我脚本里用的例子条件一致：
    - `diffraction-gratings` 第 2 题 A、B「用同一种单色光照射时」；
    - `single-slit-diffraction` 第 2 题 A「其他条件不变」；
    - `fabry-perot` 第 2 题 A「反射率不变时」。
- **写内容会话照简称规矩加的标记**：妥当。
  - 「光栅」按 `diffraction-grating` 标：
    - 每块第一次都标了；「光栅方程」「光栅常量」「光栅衍射」里的「光栅」没有单独标，对。
    - `diffraction-gratings:104`「反射光栅」整词标，对：定义段本来就包括「反射光的刻痕」。
  - 「可见度」按 `fringe-visibility` 标了 `coherence:33`、`:90`，对。
  - 4 处同领域链外标记都是旁白，不用加前置：
    - `single-slit-diffraction:43`：夫琅禾费的史实；
    - `fabry-perot:16`：「这一节要回答的问题」里拿光栅作比较；
    - `fabry-perot:62`：几何图像说明里的类比；
    - `fabry-perot:93`：例 1 求的是自由光谱范围、精细度和能分开的最小波长差。「比衍射光栅第 4 题那块光栅还高十倍」是算完以后的比较，答案用不到它。

### 页面

test-serve，进度写临时目录，查完已停掉。

- **浮窗**：
  - 纤芯、包层指向 `total-internal-reflection#def-core-cladding`；
  - 级次指向 `two-beam-interference#def-order`；
  - 反射率指向 `thin-film-interference#def-reflectance`；
  - 光栅、反射光栅指向「衍射光栅」，可见度指向「条纹可见度」；
  - 「半波损失」的浮窗是新简介。
- **两处前置**：
  - `two-beam-interference` 的「前置回顾」列出惠更斯原理、费马原理；
  - `graded-index` 列出费马原理、全反射与光纤、第一变分与欧拉-拉格朗日方程。
- **宽 768、全部提示和解答展开**：
  - 10 页都不左右滚动，没有公式错误，题数都是 8；
  - 卡片数 `two-beam-interference` 4→5、`thin-film-interference` 7→8、`total-internal-reflection` 5，和锚点数一致；`total-internal-reflection` 的「纤芯」第一次出现在卡片里。
- 仓库 `progress/` 的三个文件，校验和和复核开始时一样。

### 跑过的命令

- `npm run build`：通过。
- `npm run content`：0 个错误、0 个警告。
- 本批 9 个验算脚本单独跑：36 题一致。
- 全量 `npm run verify`：246 个小节全部一致；`total-internal-reflection` 的 4 题也一致。
- `npx tsc -b`：通过。
- `npm test`：23 个文件、202 项全部通过。
- 公式重新渲染了一遍：1201 个公式，0 个错误。

### 要写回 plan.md 的

- **写内容会话建议的两条，都同意**：
  1. plan.md:243 简称的例子：「光栅」之于「衍射光栅」，「可见度」之于「条纹可见度」；「反射光栅」按复合词的规矩整词标成「衍射光栅」。可以和初审写回第 1 条（复合词）放在一起。
  2. 「对各种情况平均才成立的说法，也算只在某个条件下成立」，例子是 `fabry-perot:105`。并进初审写回第 2 条（常见误区要在最自然的理解下确实不成立）。
- **我这边新加两条**：
  3. 两节都用、又互不在对方链上的名词，起名放在两节共同的前置上。例子：批次 16 的「级次」起名在 `two-beam-interference`，`diffraction-gratings`、`fabry-perot` 都接上。可以并进 plan.md:244。
  4. plan.md:245「同一领域也一样」再加一个例子：`graded-index` 用纤芯，加前置 `total-internal-reflection`，层级不变。初审写回第 5 条是 `two-beam-interference` 加 `fermat-principle`。
- 初审写回的第 1–5 条照旧。第 3 条进表的例子现在可以写定：纤芯、包层、级次、反射率。

### 没验证的

- 深色模式没看。
- 动画这次没有改动，没重新导出画面。

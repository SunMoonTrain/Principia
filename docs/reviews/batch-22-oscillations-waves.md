# 批次 22 审查报告：振动与波（第一批）

范围：
- 10 节：`simple-harmonic-motion`、`oscillation-energy`（新）、`damped-oscillations`、`normal-modes`、`phasors`、`driven-oscillations`、`pendulums`、`superposition-beats`、`beaded-string`、`wave-equation`；
- 术语表新增 32 条（0 → 32）、4 张 SVG、6 个 function-plot、2 个 oscillator。

常微分方程 `undetermined-coefficients` 的两处补标，照调度员说的这一轮没看。

**重要 2 条，小问题 3 类，原有问题 2 条；改了没报的：没有。**

- 重要：
  - ① `driven-oscillations:35` 说暂态「按$e^{-\gamma t/2}$或更快地衰减」「过几个$\frac2\gamma$以后……只剩稳态」，过阻尼时都不对，和它链过去的 `damped-oscillations#thm-critical` 正好相反。
  - ② 解答、参考解答里说错的话，4 题 5 处。
- 小问题：
  - ① 写法规矩，3 处：一处「下一节」，一处标记、一处英文括注没放在第一次出现的地方。
  - ② 交代不全，2 处：`damped-oscillations:39` 的$\frac12kA^2$没给理由；`oscillation-energy` 第 6 题提示里的$\mu$没说是什么。
  - ③ `superposition-beats:79` 替代文字里的「1:1」「1:2」「2:3」在页面上被吃掉了。
- 原有问题：
  - ① 电磁学 `em-waves:45`、`em-wave-energy:75` 的「行波」第一次出现缺英文括注（调度员已定为原有问题）。
  - ② `Oscillator` 组件画相邻两个反向的物块时，会叠在一起。

## 跑过的检查

**简单题、中等题**
- 40 道都用 `npm run statements` 读题，验算完才打开 `problems.yaml`。每题两套算法，脚本在 `tools/verify/physics.oscillations-waves.<小节>.ts`，10 个文件。
- 公用的 `_ow.ts`（批次 22 准备时我建的）这次加了用斯图姆序列求链的最低频率（`sturmCount`、`chainLowestOmega`、`stringLowestOmega`），修了 `trajectory` 在区间终点处数组越界。
- 40 道全部和标准答案一致。
- 第二套算法：
  - 振子：RK4 积分运动方程，量向上过零的平均间隔、第一个极大值的时刻、相邻极大值之比；竖直弹簧带着重力积分；`oscillation-energy` 第 4 题用两根弹簧的真实合力，积分振幅$10^{-5}\,\mathrm m$的小振动。
  - 阻尼分类：积分 200 s，数位移变号的次数。
  - 简正模：雅可比法求$M^{-1/2}KM^{-1/2}$的本征值。「是不是一个简正模」看积分出的$(x_1,x_2)$是否始终在过原点的一条直线上（二阶矩矩阵两个本征值之比）。
  - 复振幅：不用复数，把$x(t)$在 4 个周期上投影到$\cos\omega t$、$\sin\omega t$。
  - 受迫振动：稳态用打靶法求（一个驱动周期是仿射映射，解 2×2 方程组），再二分出平均功率的两个半功率点；音叉的$Q$由积分自由振动、相隔 100 个周期的两个极大值量出$\frac1e$时间。
  - 单摆：积分$\ddot\theta=-\frac gl\sin\theta$，算术-几何平均求精确周期；复摆的$I$、$d$用数值积分。第 4 题指定按$T_0\bigl(1+\frac{\theta_0^2}{16}\bigr)$估计，另核对它正是精确周期级数的前两项：精确值比估计长$T_0\cdot\frac{11\theta_0^4}{3072}$，差在 1% 以内。
  - 拍和李萨如图形：逐个载波周期取$|x|$的最大值当包络，数包络的极小值；二分$\dot x=0$找出$|x(t)|$的所有峰值；对 10–1000 Hz 的整十候选频率画图形，数一个周期里$x$、$y$各取极大值几次。
  - 链和弦：雅可比法求$N\times N$刚度矩阵；连续极限用斯图姆序列二分 100、200、400 段的链的最低频率，再做两次理查森外推。
  - 波动方程：中心差分算$y_{tt}-4y_{xx}$；同一个零点在两个时刻的位置差量波速；黄金分割求$|y_t|$的最大值。
- 选择题：每个选项都用具体例子判对错，例子写在脚本的 `notes` 里。
- `npm run typecheck`（`tsc -b`）通过。
- 全量 `npm run verify`：363 个小节全部一致，包括这 10 个新脚本。

**提示、解答、难题、思考题**
- 80 道题的提示、解答、参考解答都读了，写出的数逐个手算过。除重要 ② 的 5 处外都对。
- 难题的推导都核过：
  - 平台上物块离开的条件$N=m(g-\omega^2x)$；绳中点的小球，准确的力是线性近似的$0.995$倍；
  - $2\bar K=n\bar U$；弹簧质量相当于$\frac M3$；
  - $\dot E=-b\dot x^2$，机械能约按$e^{-\gamma t}$衰减；临界阻尼至多越过平衡位置一次；
  - 质量$m$、$2m$的两个简正模（$\lambda=\frac{3\mp\sqrt3}2$，按质量加权正交）；两个简正模的能量各自守恒；
  - $\overline{xy}=\frac12\Re(\tilde x\tilde y^*)$；$N$个旋转矢量的外接圆和初相$\frac{(N-1)\delta}2$；
  - $Q=\frac{\omega_0U}{\bar P}$；共振峰在$\sqrt{\omega_0^2-\gamma^2/2}$，峰高$\frac{F_0/m}{\gamma\omega_{\mathrm d}}$；
  - $\frac1{16}$的推导；可倒摆的$d_1d_2=k^2$；
  - 轨迹方程和$x\dot y-y\dot x=-AB\omega\sin\varphi$；李萨如图形闭合的条件；
  - 离散正弦的正交性$C_m=-\frac{1+(-1)^m}2$；$N=3$只拉中间小球；
  - 重力下垂$\frac{\mu g\ell^2}{8T}\approx3.2\times10^{-5}\,\mathrm m$；达朗贝尔解里鼓包分成两半。
- 思考题里的数和结论也核过：$T\propto A^{(1-n)/2}$；势能图在$E=0.9$时的折回点 0.33、3.97；约$\frac Q\pi$个周期建立稳态；摆线上$\ddot s=-\frac g{4a}s$；链子约$2\sqrt{L/g}$，2 m 时 0.9 s；平方阻力下$A\approx\frac{A_1}{1+\alpha A_1t}$。

**方向（批次 21 写回的规矩）**
- 4 张图的转向都按运动判过，和图注、替代文字、正文一致：
  - `reference-circle.svg`：$\omega$的弧从 18° 画到 56°，逆时针；P 在第二象限，速度沿切线向左下，加速度指向 O；Q 向左走、加速度向右。
  - `phasor-sum.svg`：$\omega$的弧从 100° 画到 154°，逆时针。
  - `lissajous.svg`：$\varphi=\frac\pi2$的圆，箭头在最右点朝下，顺时针，和第 5 题的「$0<\varphi<\pi$时顺时针」一致。
  - `pendulums.svg`：切向分力指向平衡位置，拉力沿线指向悬点。
- 题目里的方向都对：
  - `simple-harmonic-motion` 第 3 题（参考圆上逆时针转过 53.1°，$x$变大）、第 5 题（平台向上减速时物块离开）；
  - `superposition-beats` 第 2、5、8 题；`wave-equation` 第 4、6 题；
  - `damped-oscillations` 第 6 题（往关的方向推是$v_0<0$）；`driven-oscillations` 第 8 题；`normal-modes` 第 4 题（压缩量是$x_1-x_2$）。

**说过头和选择题字母**
- 10 节的误区和 80 道题扫了「只有、只能、一定、总是、才、永远、不可能」，逐处看过，没有说过头的。
- 10 道第 2 题的正确选项：A 对 5 题、B 5 题、C 5 题、D 5 题、E 6 题，不偏。

**公式**
- 10 节正文、题目（含参考解答）和 32 条术语，共 3372 个公式过 `compileTex`、`suspectTex`，0 个问题。
- 行内长式子 50 个。768 px 宽下页面全部展开后，没有一个比所在段落宽，照批次 19 的先例不报。

**术语**
- 按块查第一次出现标了没有、id 对不对，按节查英文括注。链接文字是小节标题、当「见某节」用的不算。
- 32 条新术语的锚点都在下定义的那一段；简介都读过，只用了定义它那一节链上的概念。
- 链外标记 4 处，都可以：
  - `oscillation-energy:33`「稳定平衡」标牛顿力学 `energy-diagrams` 的 id：是旁白，当场说了意思，定理用的是$U''(x_0)>0$；
  - `phasors:74`「单缝衍射」，光学，后面的小节；
  - `driven-oscillations:35`「共振」标常微分方程的 id，调度员定的；
  - `beaded-string:52`「波动方程」标本领域后面的 `wave-equation`，照「本领域后面小节的术语可以提前提到」。
- 问题见小问题 ①。

**前置和层级**
- 在工作区的全图上独立算了一遍：
  - simple-harmonic-motion 第 15 层；
  - oscillation-energy、damped-oscillations、normal-modes、phasors 第 16 层；
  - driven-oscillations、pendulums、superposition-beats、beaded-string 第 17 层；
  - wave-equation 第 18 层。
- 已写小节的层级都没变，全图没有多余前置，和调度员、写稿员说的一致。
- oscillation-energy 不在另外 9 节的链上。9 节里只有 `damped-oscillations` 用到它的结论$E=\frac12kA^2$，见小问题 ② a。
- 已写的下游都接得住（开写前列的清单逐条对过）：
  - `circular-motion` 第 8 题的猜测由参考圆说明；`euler-equations` 要的「要么静止，要么做简谐运动」；
  - `small-oscillations`、线性代数 `diagonalization` 第 7 题的两个物块；
  - `ac-circuits`、`dispersion` 要的$\frac{F_0/m}{\omega_0^2-\omega^2+i\gamma\omega}$、$e^{i\omega t}$约定、位移落后$\delta$；`ac-circuits:56` 的$Q=\frac{\omega_0}{\Delta\omega}$；
  - 常微分方程第 6 题的峰$\sqrt{\omega_0^2-\gamma^2/2}$；`action-angle` 第 5 题的$\frac1{16}$；`nonlinear-systems` 第 8 题 90° 时$1.180T_0$（例 2 的 2.042 s、2.369 s 用算术-几何平均核过）；
  - `field-lagrangian` 的记号$N$、$m$、$a$、$T$、$\mu=\frac ma$、$\ell=(N+1)a$，以及$\omega_n$、$\mu y_{tt}=Ty_{xx}$。

**页面**
- 用临时副本：HEAD，加我的快照（25 个文件），再加工作区里复分析的目录。`phasors` 链到 `complex-exponential`、`complex-numbers` 的锚点，HEAD 里那两节还是大纲。
- 内容构建 0 个错误、0 个警告；服务的进度写临时目录。
- 10 节在 768 px 宽下，每节点开 8 道题的全部 24 级提示，4 道简单题、中等题都点「放弃 → 确定放弃」，每节共 32 次点击。
- 结果：
  - 页面都不横向溢出，没有横向滚动的公式块，KaTeX 错误 0；
  - 控制台和服务端都没有报错；
  - 定义卡片数等于锚点数：5、2、4、4、4、5、5、4、4、4。

**SVG（4 张）**
- 文字框都在画布里、互不重叠；沿线条每 1 像素取点，没有压字。
- 文字之间的最小间隙：参考圆 44.3、旋转矢量 29.5、单摆 4.9（θ 和 C）、李萨如 81.3 像素；离画布边至少 7.1 像素。
- 没有写死的颜色、脚本、外部引用、组合附加符。
- `pendulums.svg` 的箭头按同一比例：$\theta=30^\circ$，$mg$ 84 像素，$T$和$mg\cos\theta$都是 72.8，$mg\sin\theta$ 42.0。复摆的 O、C 都在杆的轴线上。
- 问题见小问题 ③（替代文字）。

**动画（6 个 function-plot、2 个 oscillator）**
- 滑块拉到两端看过：
  - `oscillation-energy`：$E=0.05$、$0.9$，折回点 0.33、3.97 都在框里；
  - `damped-oscillations`：$\gamma=0.05$、$1.2$，振幅线的起点 1.25，在上限 1.3 以内；
  - `driven-oscillations`：$Q=0.5$时圆点消失，$Q=5$时峰高约 5.03；
  - `superposition-beats`：频率差 3 Hz 时 3 秒里 9 次强弱；
  - `beaded-string`：$N=20$时圆点画到$n=20$；$n=6$时相邻物块反向；
  - `wave-equation`：两个脉冲重叠时绿线是两者之和；
  - `normal-modes`：$s=1$时两条曲线重合；$\kappa=0.2$、$s=0$时，$t\approx17$物块 1 停下，和$\frac\pi{\Delta\omega}\approx17.2$一致。
- 图注里的颜色都对：蓝、橙、绿、紫依次是主题色；`beaded-string` 序列的圆点是橙色。
- 问题见原有问题 ②。

**补标**
- 本领域：振动与波另外 12 节都是大纲，不用补。
- 跨领域：见下面「跨领域写法」。

**快照和进度**
- 审查期间 25 个文件没变：和快照逐个比过 sha1。
- `progress/` 的校验和前后一样。

## 重要 1 · `driven-oscillations:35` 暂态衰减的说法，过阻尼时不对

**原文**（`:35`，稳态、暂态的「为什么这样定义」）：「暂态按$e^{-\gamma t/2}$或更快地衰减（见[阻尼振动](lesson:physics.oscillations-waves.damped-oscillations#thm-critical)），过几个$\frac2\gamma$以后，不管开始怎样，振子都只剩稳态」。

**链过去的定理说的正相反**
- `damped-oscillations:44`（`thm-critical`）：长时间后偏离按$e^{-\lambda t}$变小，「欠阻尼时是$\frac\gamma2$，过阻尼时是较小的$\lambda_1$」，而且$\lambda_1<\omega_0$。
- 过阻尼时$\frac\gamma2>\omega_0>\lambda_1$，暂态比$e^{-\gamma t/2}$慢，不是「或更快」。
- 例：$\gamma=4\omega_0$时$\lambda_1=(2-\sqrt3)\omega_0\approx0.27\omega_0$。暂态的时间尺度$\frac1{\lambda_1}\approx\frac{3.7}{\omega_0}$，是$\frac2\gamma=\frac{0.5}{\omega_0}$的 7.5 倍；「过几个$\frac2\gamma$」时暂态还远没衰减完。
- 只有欠阻尼和临界阻尼时这句话成立（临界阻尼时$\omega_0=\frac\gamma2$，多一个因子$t$）。

**建议**
- 写成「暂态按$e^{-\lambda t}$衰减，$\lambda$是[阻尼振动](…#thm-critical)里的衰减率，欠阻尼时就是$\frac\gamma2$，过阻尼时更小；过几个$\frac1\lambda$以后……」；
- 或者把前提写进去：「阻尼不超过临界值时，暂态按$e^{-\gamma t/2}$衰减（过阻尼时按更慢的$\lambda_1$）……」。
- 第 7 题说的都是「阻尼很弱」，不用改。

**为什么列为重要**：正文的结论说错了，还和它自己引用的定理矛盾。读者照「过几个$\frac2\gamma$」去估计重阻尼的振子多久进入稳态，会差好几倍。

## 重要 2 · 解答、参考解答里说错的话（4 题 5 处）

**a. `oscillation-energy` 第 4 题解答（`problems.yaml:86`）**
- 原文：「$2k(L-l_0)$是两根弹簧的拉力之和的两倍」。
- 每根弹簧的拉力是$k(L-l_0)=2.5\,\mathrm N$，两根之和$5\,\mathrm N$，正好等于$2k(L-l_0)$。
- 同一节第 8 题参考解答（`:180`）写的是「两倍拉力除以$L$」，指一根弹簧的拉力，是对的；两处对不上。
- 建议改成「$2k(L-l_0)$是两根弹簧的拉力之和」。

**b. `normal-modes` 第 6 题参考解答（3）（`problems.yaml:129`）**
- 原文：「例 2 里$E_1=E_2$一直不变」。
- 例 2 只拉开物块 1，$y_1=y_2=\frac A2$，$E_1=\frac{kA^2}4$，$E_2=\frac{(k+2\kappa)A^2}4$，两者不相等，只是$\kappa\ll k$时差不多。
- 要说的是两个各自不变。建议改成「例 2 里$E_1$、$E_2$各自一直不变」。

**c. `superposition-beats` 第 3 题解答（`problems.yaml:62`）、第 7 题参考解答（2）（`:147`）**
- 原文：「响度（和振幅的平方成正比）的最大值是最小值的$25$倍」；「响度只有主峰的$\frac19$」。
- 和振幅平方成正比的是声音的强度；响度是听觉上的量，大致随强度的对数变化。
- 建议两处的「响度」都改成「强度」。讲解 `:33`、`:103` 的「响度在它的一个周期里大两次」只说大小的先后，不用改。

**d. `phasors` 第 2 题解答（`problems.yaml:45`）**
- 原文：「初相差$\frac\pi2$时$A^2=A^2+A^2+0$」。
- 同一个$A$既当分振动的振幅又当合振幅，式子照字面读是错的。
- 建议写成「合振幅的平方是$A^2+A^2+0=2A^2$」。

**为什么列为重要**：a、b、c 是物理上说错了，读者会照着记；d 是照字面读就错的式子。

## 小问题

### ① 写法规矩（3 处）

**a. `beaded-string:52`**
- 原文：「下一节直接由弦的受力推出它」。plan 不让写「上一节」「下一节」。
- 建议写成「[弦的波动方程](lesson:physics.oscillations-waves.wave-equation)直接由弦的受力推出它」。

**b. `driven-oscillations:98`、`:99`**
- 误区这一块里，「驱动角频率」「固有角频率」第一次出现在 `:98`（「驱动角频率又正好等于固有角频率时」），没标；标记放在了 `:99`。
- 建议两个标记挪到 `:98`，`:99` 的去掉。

**c. `pendulums:30`、`:44`**
- 「转动定律」全节第一次出现在 `:30` 的链接文字里，在句子里当名词用（「对悬点用[转动定律](…)」），照 plan 算用到。
- 英文括注（law of rotation）却在 `:44`。建议挪到 `:30`。

### ② 交代不全（2 处）

**a. `damped-oscillations:39`**
- 原文：「阻尼弱时，一个来回里振幅几乎不变，机械能近似是$\frac12k\bigl(A_0e^{-\gamma t/2}\bigr)^2\propto e^{-\gamma t}$」。
- 「简谐运动的机械能是$\frac12kA^2$」是 `oscillation-energy` 的定理，它不在这一节的链上，`simple-harmonic-motion` 也没说。
- 道理只要半句：振到最远处时速度为零，机械能就是那时的弹性势能。建议补上，例如「……几乎不变；振到最远处时速度为零，机械能近似是那时的弹性势能$\frac12k\bigl(A_0e^{-\gamma t/2}\bigr)^2$」。
- 不建议加前置：加了会把这一节和它下游的 `driven-oscillations` 各推后一层。

**b. `oscillation-energy` 第 6 题第 2 级提示（`problems.yaml:124`）**
- 原文：「机械能$\frac12\mu\dot x^2+\frac12kx^2$守恒时」。
- $\mu$前面没有说是什么（应是$m+\frac M3$）；这个领域里$\mu$还当线密度、约化质量用。
- 建议写成「记$\mu=m+\frac M3$」，或者直接写出来。

### ③ `superposition-beats:79` 的替代文字在页面上被吃掉一截

- 原文：「第一幅频率比 1:1、φ=0……第二幅 1:1……第三幅 1:2……第四幅 2:3」。
- 页面上 SVG 的 `aria-label` 是「第一幅频率比 1、φ=0……第二幅 1、φ=π/2……第三幅 1，像横放的 8 字……第四幅 2，和右边……」，「:1」「:2」「:3」都没了。读屏的人听到的频率比是错的。
- 原因：remark-directive 把「:1」解析成名叫「1」的文字指令，算图片说明的文字时把它丢了（我用同样的管线单独解析过）。正文、标题里编译器会把不认识的指令还原成原文，所以同一节 `:93` 的标题「频率比 1:2 的图形」显示正常；正文、题目里的比都写在公式里。10 节里别处的替代文字没有这种写法。
- 建议改成「1∶1」（比号 U+2236）或「1 比 1」。

## 原有问题

**① 电磁学「行波」第一次出现缺英文括注**：`em-waves:45`、`em-wave-energy:75`。行波在它们的链上，不用标记，只缺括注。调度员已定为原有问题，写稿员说下次改到时再补。

**② `Oscillator` 组件：相邻两个反向运动的物块会叠在一起**
- `packages/anim/src/Oscillator.tsx:212`–`217`：参考振幅画成偏离平衡位置 0.3 个间距，方块宽取 0.5 个间距（最多 46 像素）。两个相邻物块反向、都到参考振幅时，中心相距 0.4 个间距，比方块宽小，叠在一起。
- 页面上看到的：768 px 宽、`beaded-string` 选$n=6$时，第 3、4 个物块的振幅都是 0.975，间距约 94 像素，中心最近 37.6 像素，方块宽 46，叠了约 8 像素；$n=5$同样。按同一算法，`normal-modes` 选$s=-1$时，手机宽度下两个物块也会叠上（768 px 宽时不会）。
- 组件按参考振幅归一，内容里把初位移整体缩小没用，只能改组件，例如偏离取 0.25 个间距、方块宽不超过 0.45 个间距。组件是台阶 7 写的（`c51ad39`），不是这一批引入的。

## 改了没报的

没有。
- 快照里的 25 个文件，和写稿员「改了哪些文件」一一对上：`_domain.yaml`（32 条）、9 节的 `lesson.md`、`oscillation-energy` 的两个文件、9 个 `problems.yaml`、4 张 SVG。
- 汇报里说的修改都在正文、题目里看得到：
  - `driven-oscillations` 第 3 题阻尼系数 0.20（$Q=10$）；`superposition-beats` 第 4 题改成相切 3 次、4 次（400 Hz）；`beaded-string` 频率图的$N$从 6 到 20；`oscillation-energy` 滑块下限 0.05；`damped-oscillations` 图注写紫线；
  - 5 题第 2 题调了选项顺序，提示、解答里的字母跟着改了；
  - `pendulums` 第 8 题、`beaded-string` 第 7 题的提示改成白话；`phasors` 正文写「含导数的方程」；
  - 「403 中断后的复核」说的 `superposition-beats` 第 8 题第 3 级提示，现在是「如此循环。」。
- 工作区里另外两处改动不是这一批的：
  - 常微分方程 `undetermined-coefficients` 的两处补标，写稿员在「补标」一节报了，这一轮不看；
  - 多变量微积分 `jacobian` 第 8 题参考解答的链接文字，从「复可导与柯西-黎曼方程」改成了「柯西-黎曼方程与全纯函数」，是跟着复分析 `holomorphic` 的新标题改的。复分析写稿员的汇报里说 jacobian 第 8 题「不用改」，没提这一处，调度员可以问一下那边。

## 写稿员「写法上的几个做法」8 条：都同意

1. **点号**：`simple-harmonic-motion:29` 写明「用点表示对时间求导」，另外 9 节直接用$\dot x$、$\ddot x$。
2. **唯一性在链上证**：`simple-harmonic-motion:45` 用两个解之差的机械能守恒，链上有 `potential-energy`。
3. **「共振」两种意思**：`driven-oscillations:35` 无阻尼的线性增长标常微分方程的 id；本领域自己的共振在 `:42` 定义，误区 `:98` 标本领域的 id。
4. **品质因数**：`:42` 定义$Q=\frac{\omega_0}\gamma$，`:47` 的定理证明半功率宽度恰好是$\gamma$，和 `ac-circuits:56` 的$Q=\frac{\omega_0}{\Delta\omega}$一致；$Q=\frac{\omega_0U}{\bar P}$、每周损失$\frac{2\pi}Q$在第 5 题。
5. **一维链画成纵向**：图注写了方程同形、$\frac Ta$换成$k$，第 8 题专门讲纵向和横向。组件本身叠块的问题见原有问题 ②。
6. **`phasors` 照复分析的记号**：4 个链接的锚点在临时副本里都解析到了（构建 0 个错误）；`:29` 写共轭用$z^*$、注明复分析里写$\bar z$；实部用本领域的 `\Re`。
7. **「周期性」不算「周期」出现**：和「周期函数」的先例一致。
8. **sed 改的三个文件**：`oscillation-energy`、`wave-equation`、`phasors` 的 `lesson.md` 都是统一的 CRLF，没有 BOM、控制字符、制表符；内容逐段读过，没有异样。

另：「驱动角频率」也按复合词标「角频率」的 id（`driven-oscillations:42`、`:99`），和「线性回复力」同一做法，汇报里没单列，我觉得可以。

## 调度员定的 6 条，核对结果

- **竖直弹簧放在 SHM 第 4 题**：第 4 题的解答写清了「重力只把平衡位置往下挪了$\Delta l$」，答案验算一致。
- **唯一性用两个解之差的机械能守恒证完**：见上面第 2 条。
- **「线性回复力」当「回复力」的复合词标**：`simple-harmonic-motion:43`、`:59`、`:73`、`:79`，`oscillation-energy:36`，`damped-oscillations:25`，都标了 `restoring-force`。
- **「小振动」不进表、「谐振子」不出现**：术语表里没有「小振动」，只在两条简介里当普通说法；10 节正文和题目里「谐振子」0 处。
- **「固有角频率」进表、起名在 `damped-oscillations`**：`:25` 的 `def-damped-oscillation` 起名，`driven-oscillations` 的链上有它。
- **暂态那段标常微分方程的「共振」**：`driven-oscillations:35`。同一段的另一句有错，见重要 1，和这个标记无关。

## 跨领域写法

扫了别的领域已写的小节，32 个新词连同别名（简谐振动、恢复力、利萨如图形、小球链、物理摆）：
- **欠阻尼、临界阻尼、过阻尼、共振**：常微分方程 `constant-coefficients`、`phase-plane-linear`、`undetermined-coefficients` 里是那边自己定义的，各标各的 id，不补。
- **三维、有源的「波动方程」**：`gauge-potentials:61`、`:107`，`retarded-potentials:22`、`:34`，`covariant-maxwell:69`。调度员定了不补。
- **拍**：`undetermined-coefficients` 的补标这一轮不看；光学 `aberrations:16`、狭义相对论 `length-contraction:72` 的「拍」是拍照片。
- **耦合振子**：分析力学 `hamiltonian-chaos:105` 在例题标题里，同意写稿员不补。
- **行波**：见原有问题 ①。
- **角频率**：没有人提过，请调度员定，见「拿不准的」第 3 条。

## 拿不准的

1. **`phasors` 第 4 题就是例 1 倒过来**
   - 例 1（`phasors:60`）：$2\cos\omega t+2\cos\bigl(\omega t+\frac{2\pi}3\bigr)=2\cos\bigl(\omega t+\frac\pi3\bigr)$，并说「振幅相等、相差 120° 时，合振动的振幅不变」。
   - 第 4 题：已知$x_1=6\cos\omega t$、$x=6\cos\bigl(\omega t+\frac\pi3\bigr)$，求$x_2$的振幅。照例 1 的结论直接得$6$，解答自己也说「组成等边三角形」。
   - plan「参数不同、可答案和例题算出的数一样，也要换」照字面管不到（答案 6 不是 2），可意思一样。可以换个数，例如$x_1=4\cos\omega t$，答案$\sqrt{28}\approx5.29\,\mathrm{cm}$。
2. **`damped-oscillations:75` 图注「紫线回得最慢」**：滑块在默认的$\gamma=0.2\omega_0$时，蓝线的振幅按$e^{-0.1t}$衰减，比紫线（$e^{-0.27t}$）还慢；这句话说的应是两条不振动的线，可以写成「不振动的两条线里，紫线回得慢」。可改可不改。
3. **「角频率」要不要按规矩 C 补标**
   - 常微分方程 `constant-coefficients:43`、`:85`，`phase-plane-linear:50`，电磁学 `lorentz-force:53` 用了「角频率」，没标。这三节是批次 7、8、11 写的，链上都没有 `simple-harmonic-motion`。
   - 分析力学 `charged-particle-lagrangian:104`、`:107`，`cyclic-coordinates:108` 是批次 3、1 写的，照 plan 不追溯。
   - 要是当中学基础词（和频率、周期、振幅一类，高中讲交流电、简谐运动都用$\omega$），就不补；不当基础词，就要补标 `physics.oscillations-waves.angular-frequency`，4 处，`status` 不动。写稿员的候选清单里没有这一项。我倾向于当基础词。

## 值得一提的

- 重要 1 是读链接目标读出来的：那句话自己链到 `thm-critical`，定理里写着「过阻尼时是较小的$\lambda_1$」。正文里用「见某节」支撑一个结论时，对一遍目标说的是不是同一件事，能查出这类错。
- 替代文字里写「数字:数字」会被 remark-directive 吃掉，正文和标题里不会，所以只看页面文字查不出来。建议写回 plan：图片的替代文字里比值写「1∶1」或「1 比 1」；或者让编译器在图片说明里遇到指令时报警告。

## 快照

- 快照在 `C:\Users\SUNMOO~1\AppData\Local\Temp\claude\d4908012c44339e2\2dc96dd3-1171-4d39-809e-ebecc65e53af\scratchpad\snap22\`：
  - 10 节的 `lesson.md`、`problems.yaml`，4 张 SVG，`_domain.yaml`；
  - 共 25 个文件，sha1 清单在上一级目录的 `snap22.sha1`。
- 复核时和它比，复核完删掉。
- 临时网站、临时进度目录已删，`.claude/launch.json` 里加的那一项已去掉。

## 修订说明（写内容会话）

**重要 2 条、小问题 3 类都修了；拿不准的 3 条照调度员定的办；没有不修的。同类问题全批另查出并修了 12 处：「见某节」撑不住结论 2 处，倍数写法 4 处，交代不全 2 处，修订时新引入的漏标、漏括注 4 处。**

和快照比，改了 14 个文件：7 节的 `lesson.md`（beaded-string、damped-oscillations、driven-oscillations、normal-modes、pendulums、simple-harmonic-motion、superposition-beats），7 个 `problems.yaml`（damped-oscillations、normal-modes、oscillation-energy、pendulums、phasors、superposition-beats、wave-equation）。`_domain.yaml` 和 4 张 SVG 没动。全部用编辑工具改，没经过 shell。

### 重要 1 · 暂态衰减

- `driven-oscillations:35` 改成：「暂态按$e^{-\lambda t}$衰减，$\lambda$是[阻尼振动](…#thm-critical)里说的衰减率，欠阻尼（underdamped）、临界阻尼（critically damped）时就是$\frac\gamma2$，过阻尼（overdamped）时比它小；过几个$\frac1\lambda$以后，不管开始怎样，振子都只剩稳态」。
- 和 `thm-critical` 对上：那里写的是「欠阻尼时是$\frac\gamma2$，过阻尼时是较小的$\lambda_1$」，临界阻尼时$\lambda=\omega_0=\frac\gamma2$。
- 新句子里第一次出现的欠阻尼、临界阻尼、过阻尼补了标记和括注。
- 第 7 题照你说的不用改。
- **同类全批查了**：10 节正文和 80 道题里的 36 个小节链接，逐个对了一遍链接目标说的是不是同一件事。另改 2 处：
  - `normal-modes:54`「$K$有两个不同的特征值，能对角化」原来链 `diagonalization#thm-diagonalizable`。那条定理说的是「有$n$个线性无关的特征向量才能对角化」；「特征值互不相同就能对角化」在 `#thm-distinct-independent`，锚点改过去了。
  - `pendulums:51`「被积函数和$(\theta_0-\theta)^{-1/2}$同阶，由[无界函数的反常积分](…#thm-power-unbounded)，积分收敛」：那条定理只管幂函数，从「同阶」推到「收敛」还要比较判别法。改成「……里幂函数的结论和比较判别法（comparison test），积分收敛」；比较判别法就写在同一小节「幂函数和比较」里（`improper-unbounded:47`）。
  - 其余链接都对得上：
    - 泰勒公式的佩亚诺余项、反正切的取值范围、向心加速度、$F=-U'$、机械能守恒、线性阻力的定义；
    - 常系数方程的判别式和三种通解、特征值的定义、旋转矢量求导乘$i\omega$；
    - 转动定律、平行轴定理、欧拉公式、$(e^{\lambda t})'$、复数相乘、平行四边形法则、参数方程的定义、二阶偏导数；
    - 简谐运动的几个锚点和它第 7 题、一维链的连续极限；
    - 达朗贝尔公式（大纲，goal 说的正是无界弦的解）。

### 重要 2 · 解答、参考解答里说错的话

- 照建议改：
  - a. `oscillation-energy` 第 4 题解答：「$2k(L-l_0)$是两根弹簧的拉力之和」。第 8 题参考解答的「两倍拉力除以$L$」说的是一根弹簧的拉力，和它一致，不动。
  - b. `normal-modes` 第 6 题参考解答（3）：「例 2 里$E_1$、$E_2$各自一直不变」。
  - c. `superposition-beats` 第 3 题解答：「声音的强度（和振幅的平方成正比）的最大值是最小值的$25$倍」；第 7 题参考解答（2）：「强度只有主峰的$\frac19$」。讲解 `:33`、`:103` 的「响度」照你说的不动。
  - d. `phasors` 第 2 题解答：「初相差$\frac\pi2$时合振幅的平方是$A^2+A^2+0=2A^2$，合振幅$\sqrt2A$」。
- **同类全批查了**：80 道题的题干、提示、解答、参考解答，按「响度、强度、能量、功率、倍、之和、一半、成正比、成反比、速度」逐处看，另查了「同一个字母两边都出现」的式子（0 处）。
  - 物理上说错的没有再查出来。核过的例如：
    - `driven-oscillations` 第 5 题参考解答「储存的能量除以每弧度损失的能量」；
    - `normal-modes` 第 6 题参考解答的交叉项$m\dot y_1\dot y_2+ky_1y_2$；
    - `phasors` 第 8 题的「能量相加」（$A^2$平均起来相加）。
  - 倍数写成了 plan 不让用的「大一倍」，改 4 处：
    - `simple-harmonic-motion:45`「振幅大一倍时，路程长一倍，对应时刻的速度也大一倍」改成「振幅变为原来的 2 倍时，路程是原来的 2 倍，对应时刻的速度也是原来的 2 倍」；
    - `oscillation-energy` 第 2 题 E：「换一根劲度系数是原来 2 倍的弹簧，机械能也变成原来的 2 倍」；
    - `pendulums` 第 2 题 A：「质量是原来 2 倍的」；
    - `wave-equation` 第 7 题（3）：「波速变为原来的 2 倍」。

### 小问题

- **① a** `beaded-string:52`：「[弦的波动方程](lesson:physics.oscillations-waves.wave-equation)直接由弦的受力推出它」。10 节和 80 道题里别的「上一节、下一节、前一节、后一节」：0 处。
- **① b** `driven-oscillations:98`、`:99`：「驱动角频率」「固有角频率」的标记挪到 `:98`，`:99` 的去掉。`:98` 那半句是上一轮补「完全没有阻尼、驱动角频率又正好等于固有角频率时」时加的，标记没跟着挪。
- **① c** `pendulums:30`：「对悬点用转动定律（law of rotation，见[转动定律](…)）」，`:44` 的括注去掉。
- **① 同类**：改完以后用术语脚本、首次括注脚本把 10 节重扫了一遍。查出的 4 处都在这一轮新改的句子里，已补：
  - `driven-oscillations:35` 的欠阻尼、临界阻尼、过阻尼，标记加括注（见重要 1）；
  - `damped-oscillations:39` 新加的「弹性势能」括注（elastic potential energy）。
  
  剩下的只有「周期性」，照「周期函数」的先例不算「周期」出现。
- **② a** `damped-oscillations:39`：「阻尼弱时，一个来回里振幅几乎不变；振到最远处时速度为零，机械能近似是那时的弹性势能$\frac12k\bigl(A_0e^{-\gamma t/2}\bigr)^2\propto e^{-\gamma t}$」。没加前置。
- **② b** `oscillation-energy` 第 6 题第 2 级提示：直接写成「机械能$\frac12\bigl(m+\frac M3\bigr)\dot x^2+\frac12kx^2$守恒时」。
- **② 同类**，另改 2 处：
  - `damped-oscillations` 第 5 题第 2 级提示用了$E\approx\frac12m\omega_0^2A^2$，也没给理由（同 ② a）。补了「振到最远处时速度为零，机械能就是那时的弹性势能$\frac12kA^2$」。
  - `superposition-beats` 第 7 题第 2 级提示里的$a$题干没有交代（同 ② b），改成「记一个音叉的振幅为$a$」。
  - 别处用到$\frac12kA^2$的都在参考解答里，或者题干已经给了能量的式子（`driven-oscillations` 第 5 题、`normal-modes` 第 6 题）。
- **③** `superposition-beats:79` 替代文字改成「1 比 1」「1 比 2」「2 比 3」。临时服务上看过页面，SVG 的 `aria-label` 现在是完整的「第一幅频率比 1 比 1、φ=0……第四幅 2 比 3……」。别的替代文字里没有「数字:数字」；SVG 自己的标签「1:1，φ=0」是 SVG 文字，不经过 remark，照常显示，没动。

### 拿不准的（调度员定的）

1. `phasors` 第 4 题：改成$x_1=4\cos\omega t$，合振动仍是$6\cos\bigl(\omega t+\frac\pi3\bigr)$，答案$\sqrt{28}=2\sqrt7\approx5.29\,\mathrm{cm}$。
   - 题面加了「保留三位有效数字」和容差$5.0\times10^{-3}$。
   - 提示、解答改用复振幅相减和余弦定理：$|\tilde x_2|^2=6^2+4^2-2\times6\times4\cos60^\circ=28$，初相$\pi-\arctan3\sqrt3\approx1.76$。
   - 我的独立验算核过（逐点求$x-x_1$的最大值，5.2915）。
   - `tools/verify/physics.oscillations-waves.phasors.ts` 还按原题算（得 6），`npm run verify` 因此报 1 处不一致，照调度员说的由你改脚本。
2. `damped-oscillations:75` 图注：「不来回振动的两条线里，绿线贴近横轴快得多，紫线回得慢」。
3. 「角频率」不补标。

### 原有问题

- ① 电磁学「行波」的括注：照调度员定的，下次改到时补，这一轮没动。
- ② `Oscillator` 叠块：由调度员处理，没动。

### 验证

- 仓库 `npm run content`：0 个错误、0 个警告（含复分析会话没提交的改动）。临时副本（HEAD 加振动与波目录）同样 0/0。
- `npm run typecheck`：通过。
- `npm run verify`：363 个小节，只有 `phasors` 第 4 题 1 处不一致，原因见上面「拿不准的」第 1 条；其余全部一致。
- 公式：10 节正文和题目共 3300 个公式过 `compileTex`、`suspectTex`，0 个问题。
- 段落句数、中英文空格：0 处。
- 链接文字和目标标题：36 个链接，0 处不符。
- 写稿会话的独立验算（`ow22_answers.ts`）：40 道简单题、中等题全部一致。
- 页面（临时服务、768 px 宽，10 节把提示和解答全部展开）：
  - 不横向溢出，KaTeX 错误 0；
  - 定义卡片数等于锚点数，依次为 5、2、4、4、4、5、5、4、4、4。

## 复核（2026-11-18）

**通过，没有新问题。10 节的 status 已改成 reviewed。** 常微分方程的两处补标标得对；`Oscillator` 的修复在页面上量过，相邻物块不再叠在一起。顺带看到常微分方程一处原有的页面溢出，见文末。

### 比了什么

- 和初审快照 snap22 逐个比：这一轮改了 14 个文件（7 个 `lesson.md`、7 个 `problems.yaml`），和修订说明一一对上；`_domain.yaml`、4 张 SVG 没动。没有改了没报的。
- 只看这一轮的改动。

### 修订逐条

**重要 1 · 暂态衰减**
- `driven-oscillations:35` 改得对：欠阻尼、临界阻尼时$\lambda=\frac\gamma2$（临界阻尼时$\omega_0=\frac\gamma2$），过阻尼时更小，和 `damped-oscillations:44` 的 `thm-critical` 一致；「过几个$\frac1\lambda$」也对。
- 欠阻尼、临界阻尼、过阻尼是这一节第一次出现，标记、括注都在。
- 同类另改的 2 处，链接目标都核了：
  - `normal-modes:54` 改链 `diagonalization#thm-distinct-independent`。那条写着「$n$阶方阵有$n$个互不相同的实数特征值时，一定可以对角化」，正是这里要的。
  - `pendulums:51` 加「比较判别法（comparison test）」。`improper-unbounded:47` 说[无穷区间上的反常积分]里的比较判别法在$(a,b]$上照样成立；`improper-integrals` 在 pendulums 的链上，链上的别的领域的词只括注、不标，对。

**重要 2 · 解答里的错话**
- a–d 都照建议改了，措辞都准：
  - `oscillation-energy` 第 4 题解答：「两根弹簧的拉力之和」，和第 8 题参考解答一致了；
  - `normal-modes` 第 6 题参考解答（3）：「$E_1$、$E_2$各自一直不变」；
  - `superposition-beats` 第 3 题解答、第 7 题参考解答：「强度」；
  - `phasors` 第 2 题解答：「合振幅的平方是$A^2+A^2+0=2A^2$」。
- 「大一倍」4 处改成「是原来的 2 倍」：`simple-harmonic-motion:45`，`oscillation-energy` 第 2 题 E，`pendulums` 第 2 题 A，`wave-equation` 第 7 题（3）。两道选择题的答案没变，验算脚本照旧一致。

**小问题**
- ① a：`beaded-string:52` 改成链到 `wave-equation`，链接文字就是那一节的标题。它是后面的小节，这里只交代出处，推理不用它。
- ① b、c：标记挪到 `driven-oscillations:98`；「转动定律（law of rotation）」挪到 `pendulums:30`，`:44` 的去掉。
- ② a、b 和同类的 2 处（`damped-oscillations` 第 5 题第 2 级提示补了$\frac12kA^2$的来历，`superposition-beats` 第 7 题第 2 级提示交代了$a$）：都对。新加的「弹性势能（elastic potential energy）」是 `damped-oscillations` 全节第一次出现。
- ③：页面上 SVG 的 `aria-label` 现在是完整的「第一幅频率比 1 比 1……第四幅 2 比 3」。

**拿不准的 3 条（调度员定的）**
- `phasors` 第 4 题：$\tilde x_2=6e^{i\pi/3}-4=-1+3\sqrt3\,i$，振幅$\sqrt{28}\approx5.29\,\mathrm{cm}$，初相$\pi-\arctan3\sqrt3\approx1.76$；余弦定理$6^2+4^2-2\times6\times4\cos60^\circ=28$。都对，容差$5.0\times10^{-3}$也加了。答案不再能从例 1 的结论直接读出。
- `damped-oscillations:75` 图注：「不来回振动的两条线里，绿线贴近横轴快得多，紫线回得慢」，对。
- 「角频率」不补标，照调度员定的。

### 验算脚本

- `tools/verify/physics.oscillations-waves.phasors.ts` 的第 4 题照新题改了，改之前先用 `npm run statements` 读了新题干。
- 两套算法：$\tilde x-\tilde x_1$的模；把$x-x_1$在 4 个周期上投影到$\cos\omega t$、$\sin\omega t$拟合出振幅。另用余弦定理核一次。
- 算得 5.29150262213，和标准答案$\sqrt{28}$一致。别的 9 个脚本不用改。

### 别的领域补标：常微分方程 `undetermined-coefficients` 的两处「拍」都对

- `:43`（「共振」一块的「为什么这样定义」）：「形成拍（beats）」标了 `physics.oscillations-waves.beats`，是这一块唯一的一次，原有的英文括注留着。
- `:69`（「几何图像」一块）：这一块第一次的「形成拍」标了，后面的「拍越慢」「没有拍」不标。
- 全节只有这两处「拍」；`status` 还是 reviewed，没动。
- 意思相同：两个相近的频率叠加，振幅时大时小。这一节的链上没有 `superposition-beats`，两处都是旁白，照规矩 C 标振动与波的 id、不加前置，对。
- 页面上两处都显示成术语。第 8 题题目里的「拍」照「题目文字可标可不标」不补。

### `Oscillator` 的修复（9fcc950）

- 代码：参考振幅画成偏离 0.25 个间距，方块宽不超过 0.45 个间距。相邻两个物块反向时中心最近隔 0.5 个间距，比方块宽。新测试覆盖 320–1100 像素宽、1–8 个物块。
- 页面上量了：读画布那一行的像素，取从静止放开的第一帧，那正是位移最大、相邻物块挨得最近的时刻。
  - 768 px：一维链$n=6$时第 3、4 个物块之间 6 像素，$n=5$最近 11 像素。
  - 375 px（画布 313 px）：两个耦合振子的反向模 5.5 像素；一维链$n=6$时 2.5 像素，$n=5$时 4.5 像素。
- 都不再叠在一起。手机宽度下一维链的高阶模只隔两三像素，缝看得见，但很窄：这是 0.05 个间距的下限，要更宽得再缩小偏离，不影响这一批。

### 跑过的检查

- 内容检查脚本重跑 10 节：
  - 公式 3376 个，0 个问题；行内长式 51 个，768 px 下没有一个比所在段落宽。
  - 术语按块检查：初审报的两处都消失了。新出的两条不用改：
    - `pendulums:51` 的「比较判别法」被脚本匹配成数学分析 `comparison-test`（级数的），这里说的是链上的反常积分判别法；
    - `phasors:41` 的「实轴」：复分析术语表这两天新进了 `real-axis`（复分析会话还在改），和复平面、实部同一类，照调度员转来的「复数、复平面……不括注」，不用改。
  - 引号括号、中英文空格 0 处；链外标记还是初审那 4 处；链接只多了 `beaded-string:52` 那一个。
- 临时副本（HEAD `9fcc950` 的代码，加工作区的整个 `content`）：内容构建 0 个错误、0 个警告；服务的进度写临时目录。
- 10 节在 768 px 宽下每节点 32 次，展开全部提示和解答：
  - 不横向溢出，KaTeX 错误 0；
  - 定义卡片数等于锚点数：5、2、4、4、4、5、5、4、4、4；
  - 控制台、服务端没有报错。
- 改了 status 以后，在仓库里跑：
  - `npm run content`：0 个错误、0 个警告（含复分析会话没提交的改动）；
  - `npm run verify`：363 个小节全部一致；
  - `npm run typecheck`：通过。
- `progress/` 的校验和前后一样。

### 原有问题（顺带看到的）

- 常微分方程 `undetermined-coefficients` 第 5 题第 3 级提示（`problems.yaml:79`）：行内长公式$L[ue^{kx}]=\dots=\bigl(u''+(2k+a)u'+(k^2+ak+b)u\bigr)e^{kx}$，768 px 下比页面宽 74 像素，页面横向溢出。
- 这是批次 7 写的，这一轮的补标没动这个文件。建议在第二个等号处拆成两个公式。

### 快照

- snap22 已删。
- 临时网站、临时进度目录已删，`.claude/launch.json` 里加的那一项已去掉。

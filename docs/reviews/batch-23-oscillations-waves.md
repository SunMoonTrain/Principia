# 批次 23 审查报告：振动与波（第二批）

范围：
- 8 节：`harmonic-waves`、`dispersion-relations`、`doppler-effect`、`nonlinear-oscillators`、`reflection-transmission`、`wave-energy`、`waves-in-3d`、`standing-waves`；
- 术语表新增 29 条（32 → 61）、2 张 SVG、6 个 function-plot；
- 狭义相对论 `relativistic-doppler`：前置加 `waves-in-3d`，`:16`、`:44`、`:76` 三处英文括注，status 不动。

审查期间写稿员做的跨领域补标（9 个文件 20 处），照调度员说的复核时再看。

**重要 1 条，小问题 3 类；改了没报的：没有。**

- 重要：
  - ① 「振幅很小时，非线性振动都近似是简谐运动」说过头，3 处：`nonlinear-oscillators:25`、术语表 `nonlinear-oscillation` 的简介（`_domain.yaml:428`）、第 8 题题干（`problems.yaml:163`）。少了「回复力的一次项不为零」（$U''(x_0)>0$）这个条件，和本节 `:32` 自己举的$n=4$、第 8 题参考解答（3）、链过去的 `thm-small-oscillation` 都对不上。
- 小问题：
  - ① 公式少写成立条件，2 处：`reflection-transmission:52` 的$\frac{n_1-n_2}{n_1+n_2}$只在垂直入射时成立（链过去的菲涅耳公式 `:57` 写着）；`doppler-effect:10` 的 summary 写了两者都动的公式，正文没有，也没说「沿连线相向」。
  - ② `dispersion-relations:91` 误区的反驳没说全：脉冲在有色散的介质里确实会摊开、峰值变低，只是总能量不减。
  - ③ `nonlinear-oscillators:39` 把换元定理用在反常积分上，链过去的定理要求被积函数连续，少了取极限这一步。

## 跑过的检查

**简单题、中等题**
- 32 道都用 `npm run statements` 读题，验算完才打开 `problems.yaml`。每题两套算法，脚本在 `tools/verify/physics.oscillations-waves.<小节>.ts`，8 个文件。
- 公用的 `_ow.ts` 这一批加了：
  - 三维波动方程的差分残差 `waveResidual3D`、时间平均 `timeAverage`；
  - 弦的阻抗 `impedance`、链的色散 `chainDispersion`、环形链简正模的周期 `ringModeOmega`（可加弹性基底）；
  - 分段线密度的弦的数值模拟 `stringSim`、`runString`、`pulseAtJunction`（固定端、自由端，带能量）；
  - 数波峰求接收频率 `crestArrivals`、`receivedFrequency`；对发声时刻求最早到达 `earliestArrival`；
  - 斯图姆序列求离散弦的第$n$个频率并外推 `chainOmega`、`stringOmega`（右端可自由）；
  - 由势能求周期 `periodFromPotential`、`ellipticK`。
- 32 道全部和标准答案一致。
- 第二套算法：
  - 简谐波：$t=0$时二分出相邻两个波峰量波长；在一个周期上拟合正弦，求两点的相位差；二分求初相。
  - 色散：环形链放成余弦形状，RK4 量周期；带弹性基底的链用斯图姆序列求最低频率，再二分链长。
  - 多普勒：波源每隔一个周期发出一个波峰，二分每个波峰追上观察者的时刻，数到达间隔；音爆传到地面的时刻用「各发声时刻里最早到达」求，再二分马赫数。
  - 非线性振动：由势能积分求精确周期（换元$x=A\sin u$后高斯积分），和 RK4 核对。第 1 题题目指定用近似式，另用精确周期在小振幅上两次理查森外推求$\dv\omega{(A^2)}$的系数，核对近似式；$A=0.20$时精确值约$0.747\%$，比近似式略小。
  - 反射透射：把两根弦分成小段，蛙跳积分，让高斯脉冲射到连接处，量反射、透射脉冲的高度和速度；第 4 题二分$\mu_2$，使量出的反射脉冲高度是$-0.70$。
  - 能流：$j=-Ty_xy_t$在一个周期上数值求平均；能量密度在一个波长上数值积分；模拟里分别数两根弦上的能量。
  - 三维：沿波矢方向量波峰间距，相位的数值梯度定传播方向；在球面上二重数值积分求强度。
  - 驻波：斯图姆序列求离散弦的第$n$个本征值、外推到连续极限；在整数里搜索相邻两个固有频率的阶数；二分波速。
- 选择题：每个选项都用具体例子判对错，例子写在脚本的 `notes` 里。反射透射第 2 题 D（阻抗相等时没有反射）另用$\mu_2=1.1$做对照，免得数值色散的尾巴误判。
- `npm run typecheck`（`tsc -b`）通过。
- 全量 `npm run verify`：382 个小节全部一致，包括这 8 个新脚本。

**提示、解答、难题、思考题**
- 64 道题的提示、解答、参考解答都读了，写出的数逐个手算过，都对。
- 难题、思考题核过的推导，举几个：
  - `nonlinear-oscillators` 第 8 题（2）：$\theta_0\approx23^\circ$、$7^\circ$。
  - `wave-energy` 第 5 题：驻波的$j=-TA^2k\omega\sin2kx\sin2\omega t$（两列反向行波的交叉项恒为零），一个周期平均为零；第 6 题由能量守恒和位移连续解出$\frac{1-z}{1+z}$和$-1$两个根。
  - `waves-in-3d` 第 5 题：柱面波残差$-\frac{v^2}4\rho^{-5/2}f$；第 6 题沿$z$的相速度$\frac v{\cos\alpha}$，不振动的平面相距$\frac\lambda{2\sin\alpha}$；第 7 题$\frac{a^2}{8\lambda}=25\,\mathrm m$。
  - `standing-waves` 第 5 题：自由端$f=\frac{(2n-1)v}{4\ell}$。第 6 题（3）：中点粘质量$M$的珠子，对称模满足$\cot\frac{k\ell}2=\frac{Mk}{2\mu}>0$，每个都比原来低，反对称模不变，和变分法 `rayleigh-quotient` 第 7 题一致。第 7 题：$2^{-1/12}\approx0.944$，每品缩短约$5.6\%$，越往琴身品丝越密。
- 用「见某节」「第几题」支撑结论的，对过目标：
  - `standing-waves` 第 6 题 → `simple-harmonic-motion#thm-shm-solution`、`rayleigh-quotient` 第 7 题；第 8 题 → `wave-energy` 第 5 题；
  - `waves-in-3d:46` → `vector-identities` 第 8 题（$\nabla^2f=f''+\frac2rf'$；第 5 题用的平面形式也在那题的提示里）；
  - `nonlinear-oscillators:32` → `simple-harmonic-motion` 第 7 题（$T\propto\frac1A$）；`standing-waves:46` → `rayleigh-quotient`。
  - 都对得上。对不上的 3 处是重要 ①、小问题 ① a、小问题 ③。

**方向（批次 21 写回的规矩）**
- `harmonic-waves` 动画：$\cos(2\pi(s-x))$随$s$向右移；波峰右边一点$y_t>0$，正在上升，和正文、第 4 题一致。
- `doppler.svg`：
  - 左图：圆心依次距波源 10、20、30、40，半径 20、40、60、80，$u_{\mathrm s}=0.5v$；右边相邻波峰相距 10、左边 30，前密后疏，$1∶3=(v-u_{\mathrm s})∶(v+u_{\mathrm s})$。
  - 右图：圆心距 36、72、108、144，半径 18、36、54、72，$u_{\mathrm s}=2v$；两条锥面线和轴成$30.0^\circ$，和 4 个圆都相切（最大的圆，切点到圆心正好 72），向后（左）张开；$\alpha$的弧以波源为圆心，从轴转到上面那条锥面线。
- `wavefronts.svg`：5 条波阵面方向$60^\circ$，相邻两条垂直间距 30.0；$\vb k$的箭头方向$30^\circ$，和波阵面垂直，从每条的中点穿过；右图同心圆半径 20 到 100，虚线框里只有$r=80$、$100$两段圆弧，框内的弯曲只有 1.6、1.3 像素。
- 反射透射动画：入射脉冲向右、反射向左，$\frac{Z_2}{Z_1}>1$时反射为负（倒）；连接处$1+r=\tau$，两边连续；透射脉冲的速度是$\frac{Z_1}{Z_2}$倍（张力相同，阻抗大的波速小）。
- 驻波动画：$0.5\cos(2\pi(s-x))$向右、$0.5\cos(2\pi(s+x))$向左，和是$\cos2\pi x\cos2\pi s$，四个圆点在$\cos2\pi x=0$处。
- 题目：`doppler-effect` 第 1–5 题；`reflection-transmission` 第 2 题 C（固定端倒）；`standing-waves` 第 2 题 D（波节两侧反相）；`wave-energy` 例 2（$\mu_2=4\mu_1$时$\tau=\frac23$，反过来$\frac43$）。

**说过头和选择题字母**
- 8 节的 24 条误区逐条看过；正文和 64 道题扫了「只有、只能、一定、总是、才、永远、不可能」，另加了「都」。
- 说过头的是重要 ①（「都」）和小问题 ②（误区的反驳）。其余几处都对：
  - `reflection-transmission:104`「只有射向阻抗更大的弦才倒过来」，充要；
  - `standing-waves:100`「能存在的驻波只有$\lambda_n=\frac{2\ell}n$这些」；
  - `nonlinear-oscillators:95`「只在摆角小时近似成立」。
- 8 道第 2 题的正确选项：A、B、C、D、E 各 4 次。

**记号**
- $T$只当张力（`nonlinear-oscillators` 没有张力，周期写$T$，照 pendulums）；$k$只当波数（`nonlinear-oscillators:25` 的$-kx$是劲度系数，那一节没有波数）。
- $\lambda$只当波长：`standing-waves:46` 把变分法的特征值写成$k_n^2$并说明，第 6 题写$\kappa$。
- $\tau$是透射系数，没有拿$t$当透射系数的；$u_{\mathrm s}$、$u_{\mathrm o}$只在 `doppler-effect`。
- 能量密度$u$只在 `wave-energy`；`nonlinear-oscillators` 的$u$是积分变量，两节不撞。

**公式**
- 8 节正文、64 道题（含参考解答）和 29 条术语的公式都过了 `compileTex`、`suspectTex`，0 个问题。
- 行内长式子 29 个。768 px 宽下页面全部展开后，没有一个比所在段落宽，照批次 19 的先例不报。

**术语**
- 按块查第一次出现标了没有、id 对不对，按节查英文括注。剩下的报告都是不该标的：
  - 链接文字（当「见某节」用的小节标题）；
  - 基础词（余弦、压强、电场、电磁波）；
  - 更长的词（「相位差」）；
  - `harmonic-waves:98` 光谱学的「波数」（$\frac1\lambda$，意思不同）；
  - `wave-energy` 自己起名的「能量密度」（只加锚点；电磁学那条是单位体积的场能，不该标那边的 id）。
- 29 条新术语的锚点都在下定义的那一段；简介都读过。`nonlinear-oscillation` 的简介见重要 ①。
- 链外标记 4 处，都可以：
  - `dispersion-relations:30`、`reflection-transmission:52` 的「折射率」标光学的 id（规矩 C）；
  - `waves-in-3d:48` 的「能流」是本领域后面一节（`wave-energy`，第 21 层）的词，当场说了意思，也当场说了它和振幅的平方成正比的理由，推理不靠那一节；
  - `standing-waves:44` 的「固有角频率」标本领域 `damped-oscillations` 的 id，只是对比一句。

**前置和层级**
- 用 HEAD 和工作区各算一遍全图（669、671 节，多的 2 节是复分析的）：
  - 振动与波、狭义相对论范围里，只有 `wave-energy` 20 → 21（HEAD 里是大纲）；
  - 已写小节的层级都没变；全图多余前置 0；
  - `relativistic-doppler` 仍是第 21 层。
- 前置和方案一致：`wave-energy` = [reflection-transmission, oscillation-energy]；`nonlinear-oscillators` 加 oscillation-energy、math.calculus.substitution；`relativistic-doppler` 加 waves-in-3d。
- 已写的下游都接得住（开写前列的清单逐条对过）：
  - `em-waves:41` 的$\cos(\vb k\cdot\vb r-\omega t)$：`harmonic-waves:32` 说明只差初相的符号，`:97` 的误区也讲了；
  - `beaded-string:39`：和链的色散关系一致（$\theta=ka$）；
  - `relativistic-doppler:44` 的「波源动$\frac1{1-\beta}$、观察者动$1+\beta$」：和 `doppler-effect:32` 一样；
  - `nonlinear-systems` 第 8 题的 7.416：`nonlinear-oscillators` 例 1 算出来了（$4K(\frac1{\sqrt2})=7.4163$，算术-几何平均核过）；`action-angle-variables` 第 5 题的$\frac1{16}$：例 2 把单摆当软弹簧（$\varepsilon=-\frac{\omega_0^2}6$）对上；
  - `fresnel-equations:57`、`thin-film-interference:22`（轻弦到重弦反射倒、阻抗和波速成反比）：和 `reflection-transmission:50`–`:52` 一致；`waves-in-media` 第 6 题的电磁波阻抗：`:52` 说清了和弦的阻抗方向相反；
  - `em-wave-energy:27`「能量跟着波形走」：`wave-energy:40` 的$j=vu$；`field-lagrangian` 的记号（能量密度、$j=-Ty_xy_t$）一致；
  - `polarization:69`「能流和振幅的平方成正比」、`em-wave-energy:42` 的$\frac P{4\pi r^2}$：`waves-in-3d:48`；
  - `rayleigh-quotient:16` 的「求最小的$\lambda$……（见[驻波]）」：`standing-waves:46` 接住了；
  - `wave-energy` 的时间平均：链上的 `oscillation-energy:27` 讲过$\sin^2$在一个周期上的平均。

**页面**
- 临时副本：HEAD（be6a2c3），content 换成工作区的（含复分析的改动）。内容构建 0 个错误、0 个警告，vite build 通过；服务的进度写临时目录。
- 8 节加 `relativistic-doppler`，在 768 px 宽下每节点开 8 道题的全部 24 级提示，4 道简单题、中等题都点「放弃 → 确定放弃」，每节共 32 次点击。
- 结果：
  - 页面都不横向溢出，没有横向滚动的公式块，行内公式都不比段落宽，KaTeX 错误 0；
  - 控制台没有报错；
  - 定义卡片数等于锚点数：4、3、4、5、4、5、4、4，`relativistic-doppler` 4。

**SVG（2 张）**
- 在页面上量文字框（`getBoundingClientRect`，即 `getBBox` 换到屏幕坐标；渲染宽 687 px，缩放 1.108）：文字框都在画布里、互不重叠；沿每条线和路径每 1 像素取点，没有压字。
- 最近的距离（viewBox 单位）：
  - `doppler.svg`：$\alpha$离半径 54 的圆 4.1；「马赫锥」离半径 72 的圆 5.6、离下面那条锥面线的端点 6.2；文字之间最小间隙 28.5（「马赫锥」和$u_{\mathrm s}=2v$），离画布边至少 12.5。
  - `wavefronts.svg`：$\vb k$离箭头 6.0；文字之间最小间隙 180.6，离画布边至少 9.3。
- 颜色都用 `currentColor` 或带默认值的页面变量；没有写死的颜色、脚本、外部引用、组合附加符。替代文字里没有半角冒号的比值。
- 方向见上面「方向」。

**动画（6 个 function-plot）**
- 6 个表达式逐个核过方向、连续性和取值范围（见「方向」）。
- `reflection-transmission`：$(s,\frac{Z_2}{Z_1})$取$(0,0.25)$、$(0,4)$、$(10,0.25)$、$(10,4)$、$(4,0.25)$、$(4,4)$、$(4.5,0.25)$，都重绘、没有报错。透射脉冲最高$\frac2{1+0.25}=1.6$，在上限 1.7 以内；反射最低$-0.6$。
- `harmonic-waves`（$s=0$、$3$）、`dispersion-relations`（$a=0.45$、$1.5$）、`wave-energy`（$s=0$、$2$）、`standing-waves`（$s=0$、$2$）：滑块拉到两端都重绘、没有报错。$a=0.45$时最高点$(6.98,4.44)$在框$[0,8]\times[0,5]$里。
- `nonlinear-oscillators` 没有滑块：精确值在$\theta_0\approx2.89$以后超出上限 2.2，是$\theta_0\to\pi$时$T\to\infty$，正文说了；展开到$\theta_0^4$的曲线在 3.1 处是 1.93，在框里。中点求和 200 个点，框内的范围里够准。
- 色散图悬停读不出第 3 题的$1.64\%$：要在$k=0.628$处读两条曲线的值再相除，三位有效数字读不准，不算送答案。

**补标**
- 本领域：批次 22 的 10 节里，29 个新词一个都没出现（逐词 grep），不用补。
- 跨领域：见下面「跨领域写法」。

**快照和进度**
- 审查期间快照里的 20 个文件没变：和快照逐个比过 sha1。
- `progress/` 的校验和前后一样。

## 重要 1 · 「振幅很小时都近似是简谐运动」少了条件

**原文**
- `nonlinear-oscillators:25`（`def-nonlinear-oscillation` 的「边界情况」）：「振幅很小时，光滑的回复力在平衡位置附近近似是线性的，非线性振动都近似是简谐运动（simple harmonic motion，见[简谐运动的能量与小振动](lesson:physics.oscillations-waves.oscillation-energy#thm-small-oscillation)）」。
- 术语表简介（`_domain.yaml:428`）：「……周期一般随振幅变化，振幅很小时近似是简谐运动。」
- 第 8 题题干（`problems.yaml:163`）：「讲解里说，振幅很小时，非线性振动都近似是简谐运动。」

**和本节、链接目标对不上**
- 链过去的 `oscillation-energy:36`（`thm-small-oscillation`）的条件是$U'(x_0)=0$、$U''(x_0)>0$。
- 本节 `:32` 自己举了反例：$U=c\lvert x\rvert^n$在$n=4$时周期和振幅成反比，振幅越小周期越长，多小都不是简谐运动。$cx^4$是光滑的，回复力$-4cx^3$在平衡位置附近的线性近似是零。
- 第 8 题参考解答（3）（`problems.yaml:182`）也写着：「例外是一次项的系数为零，比如$U=cx^4$……多小的振幅都不是简谐运动」。

**建议**
- `:25` 写成：振幅很小时，光滑的回复力在平衡位置附近近似是它的一次项；一次项不为零（$U''(x_0)>0$）时，非线性振动近似是简谐运动（见……）；一次项为零时不是，例如下面$U=c\lvert x\rvert^4$的例子。
- 简介补上条件，例如「振幅很小、回复力的一次项不为零时近似是简谐运动」。
- 第 8 题题干照改后的讲解引。（3）问「有没有例外」可以留着；讲解里已经点到了，也可以改成「一次项为零时会怎样」之类。

**为什么列为重要**：定义卡片里的结论说错了，和同一节七行以后的例子、和自己链过去的定理都矛盾；简介还会出现在每一处悬停里。和批次 22 的重要 1 是同一类：结论和链接目标的条件对不上。

## 小问题

### ① 公式少写成立条件（2 处）

**a. `reflection-transmission:52`**
- 原文：「光从折射率小的介质射向折射率大的介质，反射光的电场倒过来，电场的反射系数$\frac{n_1-n_2}{n_1+n_2}$和这里的$r$形式相同（见[界面上的反射与折射：菲涅耳公式](lesson:physics.electromagnetism.fresnel-equations)）」。
- 链过去的 `fresnel-equations:57` 说的是「垂直入射时两种偏振的结果相同：$r=\frac{n_1-n_2}{n_1+n_2}$」。斜入射时 s、p 偏振的系数不同，p 偏振过了布儒斯特角还要变号。
- 建议在「电场的反射系数」前加「垂直入射时」。第 8 题题干（`problems.yaml:157`）「光从空气射到玻璃上」也写成「垂直射到」，和参考解答用的公式对上。

**b. `doppler-effect:10`（summary）**
- 原文：「$f=f_0\frac{v+u_{\mathrm o}}{v-u_{\mathrm s}}$；……」。
- 正文的定理（`:28`）分两种情形，各带角度；两者都动的式子只在第 3 题解答（`problems.yaml:68`）里，那里写了「两者在一条直线上相向运动时」。summary 没写这个条件，背离时照搬，正负号就错了。
- 两种改法，任选：
  - summary 写成定理的两种情形；
  - 或者在 `:32`「两种情形并不对称」那段补一句两者都动、沿连线相向时的式子，summary 加上「相向运动时」。

### ② `dispersion-relations:91` 误区的反驳没说全

- 原文：「「有色散，波就会越走越弱。」色散说的是各种频率跑得不一样快，波形会变；能量损失要靠阻尼，链和弹性基底上的弦都没有阻尼。」
- 一个脉冲在有色散的链上，各成分跑散，脉冲摊开、峰值变低（`:30` 自己也说「波形边走边变」）。照「看起来越来越弱」理解，这句误区对脉冲其实成立。反驳只说了能量不减，读者容易记成「有色散也不会变弱」。
- 建议补半句：单一频率的简谐波不会变弱；脉冲会摊开、峰值变低，可总能量不变；能量损失要靠阻尼……

### ③ `nonlinear-oscillators:39` 把换元用在反常积分上

- `:39` 对$\int_0^{\theta_0}\frac{\dd\theta}{\sqrt{\cos\theta-\cos\theta_0}}$作换元$\sin\frac\theta2=q\sin u$，「见[换元积分法](lesson:math.calculus.substitution#thm-substitution-definite)」。
- 链过去的定理（`substitution:48`）要求$f$在区间上连续。这里被积函数在$\theta_0$处无界，是反常积分，定理不能直接用；`:39` 末尾自己也说了换元后「被积函数也不再无界」。
- 补一句就行：先在$[0,\theta_1]$（$\theta_1<\theta_0$，对应$u_1<\frac\pi2$）上换元，再令$\theta_1\to\theta_0$。`improper-integrals` 在本节的链上。

## 改了没报的

没有。
- 快照里的 20 个文件审查期间没变（逐个比过 sha1）。
- `git status` 里振动与波、狭义相对论、电磁学、光学、常微分方程、变分法的改动，和写稿员「改了哪些文件」加「审查期间的跨领域补标」一一对上：
  - `_domain.yaml`（32 → 61，只加不删）、8 节的 `lesson.md`、8 个新建的 `problems.yaml`、2 张 SVG、`relativistic-doppler/lesson.md`；
  - 补标的 9 个文件。
- 汇报里说的都看得到：前置照方案改了；`relativistic-doppler` 三处括注都在各自的第一次出现；`doppler.svg` 的$\alpha$在圆 2、圆 3 之间的空当里；`wavefronts.svg` 的虚线框框住最外面两条圆弧。
- 工作区里另外几处改动是复分析这一批的：复分析各节，单变量微积分 `partial-fractions`，线性代数 `eigenvalues`，多变量微积分 `vector-identities`、`jacobian`、`_domain.yaml`；补标的是「代数基本定理」「调和函数」。

## 写稿员「写法上的几个做法」5 条：都同意

1. **记号**：核过，没有撞的（见「记号」）。
2. **电磁学对应**：方向对，两种自洽的对应放在第 8 题，讲得清楚；只差「垂直入射」，见小问题 ① a。
3. **waves-in-3d 当场说清能流和振幅平方成正比**：`:48` 的论证不靠 `wave-energy`。
4. **大振幅单摆**：7.416、$\frac{\theta_0^2}{16}$、作用量-角变量第 5 题都对上；换元那一步见小问题 ③。
5. **「功率（power）」括注**：和批次 22 不冲突。

另：汇报说「只有、只能……」逐处看过、没有说过头的。这张单子里没有「都」，重要 ① 就是从这里漏的，见「值得一提的」。

## 跨领域写法

- 审查期间的补标（9 个文件 20 处），照调度员说的复核时一起看。
- 写稿员问的两处：
  - `em-wave-energy` 的「平面波」「球面波」、`em-waves:112` 的「球面波」，全节第一次出现没有英文括注。这两个词现在进了表，又在这两节的链上，照「链上的跨领域术语只括注」该补；和这次补的「行波」一样，3 处，status 不动。建议这一轮一起补。
  - `chaos:85` 的杜芬振子：见「拿不准的」第 1 条。
- 本领域不用补（见「补标」）。

## 拿不准的

1. **杜芬振子的定义管不管 chaos 那种形式**
   - 本节 `def-duffing`（`:46`）和简介（`_domain.yaml:437`）都写「运动方程为$\ddot x+\omega_0^2x+\varepsilon x^3=0$的振子」。`chaos:85` 刚标上的是$x''+0.25x'-x+x^3=\gamma\cos t$：线性项为负（两个势阱），还带阻尼和驱动力，照字面不在定义里。
   - 我倾向于：在 `def-duffing` 的「为什么这样定义」或「边界情况」里加一句「加上阻尼、周期驱动力，或者线性项的系数为负（两个势阱）的方程，通常也叫杜芬振子」；简介不动（已经接近 60 字的上限）；chaos 那边不用改。
2. **`doppler.svg` 的两个速度箭头一样长**
   - 左图$u_{\mathrm s}=0.5v$、右图$2v$，箭头都是 34 像素。两图比例尺不同（$v\Delta t$分别是 20、18 像素），箭头只表示方向。
   - 批次 18 写回的规矩说的是受力图、矢量图。这里要不要在图注里补「箭头只表示方向，长短不按比例」，请调度员定。我倾向于补，一句话的事。

## 值得一提的

- 重要 ①、小问题 ① a、小问题 ③ 都是对链接目标读出来的。批次 22 写回的「用『见某节』支撑结论时，对一遍目标」管用；这一批还多了一种情形：目标说的是同一件事，可它的条件（$U''>0$、垂直入射、被积函数连续）这里不满足。写回 plan 时，可以把「对一遍目标说的是不是同一件事」扩成「对一遍目标说的事和它的条件」。
- 说过头的扫描单子（只有、只能、一定、总是、才、永远、不可能）里没有「都」「任何」「所有」，重要 ① 用的是「都」。建议加进单子；这几个词出现得多，只看说一般结论的句子。

## 快照

- 快照在 `C:\Users\SUNMOO~1\AppData\Local\Temp\claude\d4908012c44339e2\2dc96dd3-1171-4d39-809e-ebecc65e53af\scratchpad\snap23\`：
  - 8 节的 `lesson.md`、`problems.yaml`，2 张 SVG，`_domain.yaml`，`relativistic-doppler/lesson.md`；
  - 共 20 个文件，sha1 清单在上一级目录的 `snap23.sha1`。
- 复核时和它比，复核完删掉。
- 临时网站、临时进度目录已删，`.claude/launch.json` 里加的那一项已去掉。

## 修订说明（写内容会话）

**重要 1 条、小问题 3 类都修了；拿不准的 2 条和跨领域的 3 处括注照调度员定的办；没有不修的。同类问题全批另查出并修了 2 处，都是 `nonlinear-oscillators` 里把换元用在反常积分上（`:32`、`:53`）。「都」「任何」「所有」84 处、46 个小节链接逐个看过，别的没有要改的。**

和快照 snap23 比，改了 7 个文件：4 节的 `lesson.md`（dispersion-relations、doppler-effect、nonlinear-oscillators、reflection-transmission），2 个 `problems.yaml`（nonlinear-oscillators、reflection-transmission），`_domain.yaml`。2 张 SVG 没动。快照以外另改电磁学 2 个文件（`em-wave-energy`、`em-waves`，见「跨领域写法」）。全部用编辑工具改，没经过 shell。

### 重要 1 · 「振幅很小时都近似是简谐运动」少了条件

- `nonlinear-oscillators:25` 照建议改成：「边界情况：振幅很小时，光滑的回复力在平衡位置附近近似等于它的一次项；一次项不为零（$U''(x_0)>0$）时，非线性振动近似是简谐运动（simple harmonic motion，见[简谐运动的能量与小振动](…#thm-small-oscillation)），一次项为零时不是，例如下面$n=4$的例子。」
- 术语表简介（`_domain.yaml:428`）：「回复力不和位移成正比时的振动；周期一般随振幅变化，振幅很小、回复力的一次项不为零时近似是简谐运动。」
- 第 8 题：
  - 题干（`problems.yaml:163`）：「讲解里说，振幅很小、回复力的一次项不为零时，非线性振动近似是简谐运动。」
  - （3）（`:169`）原来问「有没有例外」，讲解里已经点到，照建议改问「为什么平衡位置附近的回复力一般近似是线性的？一次项为零时会怎样？举一个例子。」
  - 参考解答（3）（`:182`）：「……一次项的系数为零时就不是这样，比如$U=cx^4$……」。第 3 级提示（`:176`）原来就问「一次项的系数为零时呢？」，没动。
- 和链接目标对上：`thm-small-oscillation` 的条件是$U'(x_0)=0$、$U''(x_0)>0$，回复力$-U'$在$x_0$处的一次项系数正是$-U''(x_0)$。

### 小问题

- **① a** `reflection-transmission:52`：「所以光垂直入射、从折射率小的介质射向折射率大的介质时，反射光的电场倒过来，电场的反射系数$\frac{n_1-n_2}{n_1+n_2}$和这里的$r$形式相同（见[界面上的反射与折射：菲涅耳公式](…)）」。同一段后半句「用它写电场的反射系数是$\frac{Z_2-Z_1}{Z_2+Z_1}$」改成「用它写，这个反射系数是……」，指的就是前面垂直入射的那个系数。第 8 题题干（`problems.yaml:157`）：「光从空气垂直射到玻璃上……」。
- **① b** `doppler-effect:10` 取第一种改法，summary 写成定理的两种情形：「波源动：$f=\frac{f_0}{1-(u_{\mathrm s}/v)\cos\theta}$；观察者动：$f=f_0\bigl(1+\frac{u_{\mathrm o}}v\cos\theta'\bigr)$；波源比波快时形成马赫锥，$\sin\alpha=\frac v{u_{\mathrm s}}$。」按字数规则 27 字，上限 30。两者都动的式子仍只在第 3 题解答里，那里有「在一条直线上相向运动时」的条件。
- **②** `dispersion-relations:91`：「「有色散，波就会越走越弱。」单一频率的简谐波不会变弱；脉冲里各个频率跑得不一样快，脉冲会摊开、峰值变低，可总能量不变。能量损失要靠阻尼，链和弹性基底上的弦都没有阻尼。」「频率」的标记挪到这一块新的第一次出现，「简谐波」是这一块第一次出现，标了（`:90` 的「角频率」是另一个词）。
- **③** `nonlinear-oscillators:39`：「被积函数在$\theta_0$处无界，先在$[0,\theta_1]$（$\theta_1<\theta_0$）上换元$\sin\frac\theta2=q\sin u$（见[换元积分法](…#thm-substitution-definite)），……；换元后的被积函数在$\bigl[0,\frac\pi2\bigr]$上连续，再令$\theta_1\to\theta_0$，$u$的上限趋于$\frac\pi2$，反常积分就是这个极限（见[无界函数的反常积分](lesson:math.calculus.improper-unbounded#def-improper-unbounded)），即得。」
  - 链 `improper-unbounded` 而不是 `improper-integrals`：区间有限、被积函数无界，是那一节的定义；它是 `pendulums` 的前置，在本节的链上。「反常积分」全节第一次在 `:30`，那里已有括注。
- **同类全批查了**（「见某节」链过去的定理，它的条件这里满不满足）：8 节正文和 64 道题里 46 个小节链接，逐个对了目标和它的条件。
  - 另改 2 处，都在 `nonlinear-oscillators`，和 ③ 同一类：换元用在两端无界的积分上，没链定理，可同样少了取极限这一步。
    - `:32` $U=c\lvert x\rvert^n$的周期：「换元$x=Au$（两端无界，先在去掉两端一小段的闭区间上换元，再取极限）」；
    - `:53` 杜芬振子的周期：「（换元$x=A\sin u$，同样先在$[0,A-\varepsilon]$上做，再令$\varepsilon\to0$）」。
  - 其余链接的条件都满足，举几处带条件的：
    - `standing-waves:34`、`wave-energy:51` → `reflection-transmission#thm-reflection`（张力相同的两根弦）：`wave-energy` 自己的定理 `thm-junction-energy` 写着「张力相同」；固定端是定理后面列的$Z_2\to\infty$（`reflection-transmission:48`）；
    - `harmonic-waves:30`、`waves-in-3d:46` → `wave-equation#thm-traveling-wave`（二阶可导的$f$）；`waves-in-3d:44` 自己的定理写了$r>0$；
    - `nonlinear-oscillators:30`、`:39` → `pendulums#thm-large-amplitude`（$0<\theta_0<\pi$）；`standing-waves:44` → `beaded-string#thm-continuum-limit`（固定的$n$、$N\to\infty$）。
- **「都」「任何」「所有」**：8 节正文和 64 道题共 84 处（「都」71、「任何」7、「所有」6），逐处看了说一般结论的句子，都对。举几处：
  - `nonlinear-oscillators:25`「解乘上任何常数仍是解」：说的是线性方程$m\ddot x=-kx$；
  - `waves-in-3d:44`「对任何二阶可导的函数$f$」：定理里写了$r>0$；
  - `doppler-effect:39`「所有的波都落在锥面以内，锥面前方没有任何扰动」：$u_{\mathrm s}>v$时，$t$秒前发出的球面半径$vt$小于波源走过的$u_{\mathrm s}t$，精确成立；
  - `doppler-effect:25`「都相对介质静止时，不论相距多远，接收频率都等于发出频率」；
  - `reflection-transmission` 的 `problems.yaml:45`「拉得更紧，阻抗和波速都变大」：$Z=\sqrt{T\mu}$、$v=\sqrt{T/\mu}$；
  - 误区引号里的「多短的波都能传」「对任何摆角都成立」「各点的振动步调都一样」是要反驳的说法，后面都驳了。

### 拿不准的（调度员定的）

1. **杜芬振子**
   - `nonlinear-oscillators:48`（`def-duffing` 后面「为什么这样定义」的边界情况）末尾加：「加上阻尼、周期性的驱动力，或者线性项的系数为负（两个势阱）的方程，通常也叫杜芬振子」。写「周期性的驱动力」不写「周期驱动力」：照「周期性」的先例不算「周期」出现，这一块的标记不用挪。
   - 简介（`_domain.yaml:437`）改成不排他的写法：「最简单的形式是$\ddot x+\omega_0^2x+\varepsilon x^3=0$，$\varepsilon>0$是硬弹簧、$\varepsilon<0$是软弹簧；振幅$A$小时角频率约为$\omega_0+\frac{3\varepsilon A^2}{8\omega_0}$。」构建的字数检查通过（上限 60）。
   - `chaos` 没动。
2. **`doppler.svg` 的箭头**：图注（`doppler-effect:50`）改成「大的圆点是波源，箭头表示它向右运动，只表示方向，长短不按比例；……」。SVG 文件没动。

### 跨领域写法

- `em-wave-energy:25`「平面波（plane wave）」、`:42`「球面波（spherical wave）」，`em-waves:112`「球面波（spherical wave）」：只括注、不标记，status 不动（两节都还是 reviewed）。
- 三处都是全节第一次出现：`em-waves:38`、`em-wave-energy:42` 的「平面波与球面波」是链接文字（节名），不算；`em-wave-energy:23` 的「平面电磁波」是更长的词，不算；`em-waves` 的「平面波」在 `:38` 原来就有括注。

### 验证

- 临时副本（HEAD 的代码，加工作区的振动与波目录、`relativistic-doppler` 和补标的 9 个文件）：内容构建 0 个错误、0 个警告，最后一次在全部改完以后跑。
- `npm run verify`（仓库）：382 个小节全部一致，这一批 8 个脚本 32 道都对。这一轮改的题只有两道思考题的文字（`nonlinear-oscillators`、`reflection-transmission` 第 8 题），没有标准答案。写稿会话的独立验算（`ow23_answers.ts`）把改过的非线性、多普勒、色散 3 节的 12 道简单题、中等题重跑了一遍，全部一致。
- 术语脚本、首次括注脚本重扫改过的 4 节：新句子里该标的都标了；剩下的报告只有「周期性」（照先例不算「周期」）和初审列过的不该标的。
- 公式：改过的 4 节和电磁学 2 节共 1370 个公式过 `compileTex`、`suspectTex`，0 个问题；summary 补回的$\sin\alpha$式子和初审时的一样。引号括号、中英文空格：0 处。
- minutes：`nonlinear-oscillators` 25 → 27（汉字 1396，按每分钟 52 字、有动画向上取整）；另 3 节重算没变（dispersion-relations 20、doppler-effect 29、reflection-transmission 28）。
- 页面（临时服务、768 px 宽；临时进度目录里这几节的提示、解答早先已全部展开）：
  - 改过的 4 节、电磁学 2 节、`relativistic-doppler`（前置回顾里有 doppler-effect 的 summary）：不横向溢出，KaTeX 错误 0，行内公式没有比段落宽的；
  - 定义卡片数等于锚点数：nonlinear-oscillators 5、doppler-effect 4、dispersion-relations 3、reflection-transmission 4、em-wave-energy 2、em-waves 4；
  - 新改的文字都在页面上；`doppler.svg` 渲染宽 687 px，在页面以内，图和新图注截图看过。
- 快照：snap23 的 20 个文件里变了 7 个，正是上面列的；2 张 SVG、另外 4 节和 `relativistic-doppler` 没变。
- `progress/` 没碰。

## 复核（2026-11-19）

**7 节通过，status 已改成 reviewed：harmonic-waves、dispersion-relations、doppler-effect、reflection-transmission、wave-energy、waves-in-3d、standing-waves。`nonlinear-oscillators` 先不改：修订新引入 1 处重要问题，`:53` 用$\varepsilon$当截断量，和这一节杜芬振子的系数$\varepsilon$撞了。**

- 跨领域补标 20 处、这一轮的 3 处括注都对。
- 同一类括注全站还漏 9 处（小问题），见下文。
- 顺带看到常微分方程 `chaos` 第 5 题一处原有的公式比段落宽。

### 比了什么

- 和初审快照 snap23 逐个比：改了 7 个文件，和修订说明一一对上；2 张 SVG、另外 4 节、`relativistic-doppler` 没动。没有改了没报的。
- 补标的 9 个文件和 HEAD 逐字比，改动就是单子上的这些，没有别的：
  - 17 处标记，其中 `lasers:64`、`polarization:69` 连英文括注一起补了；
  - 「行波」括注 2 处（`em-waves:45`、`em-wave-energy:75`）；
  - 这一轮的括注 3 处；
  - `em-waves:88` 把「（例 2）」改成「见例 2」。
- 只看这一轮的改动。

### 重要 · `nonlinear-oscillators:53` 的截断量用了$\varepsilon$

- 修订加的是：「……$\int_0^A\frac{x^2\,\dd x}{\sqrt{A^2-x^2}}=\frac{\pi A^2}4$（换元$x=A\sin u$，同样先在$[0,A-\varepsilon]$上做，再令$\varepsilon\to0$），得$T\approx\frac{2\pi}{\omega_0}\bigl(1-\frac{3\varepsilon A^2}{8\omega_0^2}\bigr)$」。
- 这一段的$\varepsilon$是杜芬振子的系数：同一段的势能$\frac14\varepsilon x^4$、被积函数里的$\frac\varepsilon2(A^2+x^2)$、紧接着的结论，都是它。照字面读，「令$\varepsilon\to0$」以后修正项就没了，和结论矛盾。
- 建议照 `:32` 的写法不用字母：「同样先在去掉右端一小段的区间上换元，再取极限」。换字母也行，但$\delta$这一段已经用了。
- 这一节等改完再改 status。改完我只看这一句（和新快照 snap23r 比）。

### 小问题 · 跨领域的英文括注，同一类还漏 9 处

- 这一轮补的 3 处，属于「链上的跨领域术语只括注」。我照同样的条件全站扫了一遍：定义它的小节在链上、不是基础词、全节第一次出现，标题和链接文字不算。还有 9 处，整节都没有英文括注：
  - 电磁学：
    - `em-waves:41`「平面简谐波」里的「简谐波」、`:94`「波数」；
    - `field-momentum:27`「平面波」；
    - `fresnel-equations:31`「平面波」、`:36`「波矢」；
    - `skin-effect:27`「平面波」；`waveguides:56`「平面波」；`waves-in-media:36`「平面波」。
  - 光学：`brewster-angle:22`「振幅反射系数」里的「反射系数」。
- 这几节都是 reviewed，只补括注，status 不动。和 `:53` 一起改就行，不影响振动与波这 8 节的 status。

### 修订逐条

**重要 1**
- `:25` 改得对：一次项不为零（$U''(x_0)>0$）时近似是简谐运动，和链过去的 `thm-small-oscillation` 的条件一致；一次项为零时不是，例子指到 `:32` 的$n=4$，也对。
- 简介（`_domain.yaml:428`）、第 8 题题干（`:163`）、（3）（`:169`）、参考解答（3）（`:182`）都跟着改了，说法一致。

**小问题**
- ① a：`reflection-transmission:52` 加了「垂直入射」，后半句的「这个反射系数」指的就是它，和 `fresnel-equations:57` 一致；第 8 题题干写成「垂直射到」。
- ① b：`doppler-effect:10` 的 summary 写成定理（`:28`）的两种情形，`relativistic-doppler` 的前置回顾里显示正常。
- ②：`dispersion-relations:91` 照建议改了。新加的「简谐波」是这一块第一次出现，标了；「频率」的标记挪到了这一块新的第一次出现。
- ③：`:39` 先在$[0,\theta_1]$上换元，再令$\theta_1\to\theta_0$，对。
  - 链的是 `improper-unbounded#def-improper-unbounded`，那条定义写着「瑕点是右端点$b$时，同样取……的极限」，正是这里的情形。那一节在本节的链上，链接文字是它的标题。
  - 换元后的被积函数是$\frac{\sqrt2}{\sqrt{1-q^2\sin^2u}}$，在$\bigl[0,\frac\pi2\bigr]$上连续。
- 同类另改的 2 处：`:32` 对；`:53` 见上面的重要问题。

**拿不准的 2 条（调度员定的）**
- 杜芬振子：`:48` 加的那句和 `chaos:85` 的$x''+0.25x'-x+x^3=\gamma\cos t$对上了。简介改成「最简单的形式是……」，页面上点开 `chaos` 的「杜芬振子」，浮窗里就是新简介。「周期性的驱动力」照「周期性」的先例，不算「周期」出现。
- `doppler-effect:50` 的图注加了「只表示方向，长短不按比例」。

**「都」「任何」「所有」**：写稿员举的几处都对，例如 `doppler-effect:39`「锥面前方没有任何扰动」：$u_{\mathrm s}>v$时，$t$秒前发出的球面半径$vt$小于波源走过的$u_{\mathrm s}t$。

### 跨领域补标

- 20 处逐个核了：
  - 都是所在块（二级、三级标题）里第一次出现，id 对；
  - 定义它的小节都不在那一节的链上，照规矩 C 标振动与波的 id，意思相同；
  - 全节第一次出现处都有英文括注（原有的，或这次补的）。只有 `waveguides:81` 的第一次出现在定理名里，括注在同一句紧接着的第二次出现，原来就是这样，可以不改。
- `rayleigh-quotient:16` 的「（见[驻波]）」由 `standing-waves:46` 接住了。
- 这一轮的 3 处括注（`em-wave-energy:25`、`:42`，`em-waves:112`）都在全节第一次出现。
- 页面上数了新标的术语，和改动对上：
  - 电磁学：dispersion 相速度 1；em-wave-energy 驻波 3；em-waves 驻波 1；retarded-potentials 球面波 1；waveguides 相速度 4、驻波 1、波节 1；
  - 光学：lasers 驻波 1；polarization 能流 1；
  - 数学：chaos 杜芬振子 1；rayleigh-quotient 基频 2。
- 9 节的 status 都还是 reviewed。

### 跑过的检查

- 验算：8 个脚本重跑，32 道都一致。这一轮题目只改了两道思考题的文字，没有标准答案。
- 内容检查脚本重跑 8 节：
  - 公式 1969 个，0 个问题；行内长式 28 个。
  - 术语按块检查，比初审只多出三条，都不用改：`nonlinear-oscillators:48` 的「周期性」（照先例不算「周期」）；「极限」「连续」第一次出现没括注（物理各节都不括注这两个词，18 节先例）。
- 临时副本（HEAD 的代码，加工作区的整个 `content`）：内容构建 0 个错误、0 个警告，vite build 通过；服务的进度写临时目录。
- 768 px 宽下，每节点开全部提示，简单题、中等题都点「放弃 → 确定放弃」：
  - 改过的 4 节和 `relativistic-doppler`：每节 32 次点击；不横向溢出，KaTeX 错误 0，行内公式都不比段落宽；定义卡片数等于锚点数（3、4、5、4、4）。
  - 补标的 9 节：都不横向溢出，KaTeX 错误 0。`chaos` 有一处原有的行内公式比段落宽，见下面「原有问题」。
  - 控制台、服务端都没有报错。
- 改了 status 以后，在仓库里跑：
  - `npm run content`：0 个错误、0 个警告（含复分析会话没提交的改动）；
  - `npm run verify`：382 个小节全部一致；
  - `npm run typecheck`：通过。
- `progress/` 的校验和前后一样。

### 原有问题（顺带看到的）

- 常微分方程 `chaos` 第 5 题第 3 级提示（`problems.yaml:79`）：行内公式$\dot V=\frac{2x}{\sigma}\sigma(y-x)+\dots=-2x^2+\dots$在 768 px 下比所在段落宽 27 像素（页面本身不横向溢出）。
- 这是批次 8 写的，这一轮的补标没动这个文件。建议在第二个等号处拆成两个公式。

### 快照

- snap23 已删。
- 新快照留着，给 `nonlinear-oscillators:53` 和 9 处括注的小复查用：`C:\Users\SUNMOO~1\AppData\Local\Temp\claude\d4908012c44339e2\2dc96dd3-1171-4d39-809e-ebecc65e53af\scratchpad\snap23r\`。
  - 里面是 8 节的 `lesson.md`、`problems.yaml`（改 status 以后的），`_domain.yaml`，要补括注的 7 节 `lesson.md`，`chaos/problems.yaml`；
  - 共 25 个文件，sha1 清单在上一级目录的 `snap23r.sha1`。
- 临时网站、临时进度目录已删，`.claude/launch.json` 里加的那一项已去掉。

## 修订说明补充（写内容会话，复核以后）

**复核提的重要 1 条、9 处括注里这一批要补的 3 处、顺带看到的 `chaos` 长公式，都照调度员定的改了；另 6 处括注照调度员说的这次不改。status 都没动。**

和新快照 snap23r 比，改了 4 个文件：`nonlinear-oscillators/lesson.md`、`em-waves/lesson.md`、`waveguides/lesson.md`、`chaos/problems.yaml`。全部用编辑工具改。

### 重要 · `nonlinear-oscillators:53` 的截断量

- 改成「（同样先在去掉右端一小段的区间上换元$x=A\sin u$，再取极限）」，不用字母，和 `:32` 的写法一致。原来括号开头的「换元$x=A\sin u$」并进了这一句，免得「换元」说两遍。
- 同类查了：上一轮修订新加的记号只有 `:39` 的$\theta_1$，这一段、这一节别处都没有$\theta_1$；`:32` 没加字母；别的 3 节改的句子没加新记号。
- minutes 27 → 28：这句多了 11 个汉字，全节 1409 字，除以 52 是 27.1；这一节有动画，向上取整。上一轮说明里写的 1396 是改「周期性的」之前数的，改完是 1398（26.9，仍是 27）。

### 小问题 · 跨领域的英文括注（这一批改到的小节）

- `em-waves:41`：「沿单位矢量$\uv n$方向传播的平面简谐波（plane harmonic wave）$\vb E=\dots$」。
- `em-waves:94`（例 1）：「求波长、波数（wave number）和这里磁场的振幅」。
- `waveguides:56`：「……不向前走，见下面的两列平面波（plane wave）。」原来是「不向前走（见下面的两列平面波）」，括注放进去就成了括号套括号，照批次 22 `em-waves:88` 的先例，把外面的括号改成「，见……」。
- 三处都是全节第一次出现：`em-waves` 的「简谐波」「波数」只出现这一次；`waveguides` 的「平面波」后面还有 `:62`、`:83`、`:139`、`:146`。只括注、不标记，status 不动。
- 另外 6 处（`field-momentum:27`、`fresnel-equations:31`、`:36`、`skin-effect:27`、`waves-in-media:36`、`brewster-angle:22`）照调度员说的这次不改。

### 原有问题 · `chaos` 第 5 题第 3 级提示

- `problems.yaml:79` 在第二个等号处拆成两个公式：「$\dot V=\frac{2x}{\sigma}\sigma(y-x)+2y\bigl(x(\rho-z)-y\bigr)+2z(xy-\beta z)$，$xyz$项抵消，得$\dot V=-2x^2+2(1+\rho)xy-2y^2-2\beta z^2$。」中间那句和第 1 级提示「$xyz$项会抵消」一致。
- status 不动。

### 验证

- 临时副本：内容构建 0 个错误、0 个警告（改完 minutes 以后跑的最后一次）。
- 公式：这 4 节共 1243 个公式过 `compileTex`、`suspectTex`，0 个问题；引号括号、中英文空格 0 处。
- 术语脚本重扫 `em-waves`、`waveguides`：「简谐波」「波数」「平面波」不再报首次未括注；剩下的报告复核以前就有、审查看过（如 `waveguides:81` 定理名里的「相速度」）。
- 768 px 页面（临时服务；每节展开全部 24 级提示，简单题、中等题都放弃看解答）：
  - 4 节都不横向溢出，KaTeX 错误 0，行内公式没有比段落宽的；
  - `chaos` 第 5 题第 3 级提示拆开的两个公式，右端离段落右边还有 251、355 像素；
  - 定义卡片数等于锚点数：nonlinear-oscillators 5、em-waves 4、waveguides 5、chaos 6；控制台没有报错。
- 快照：snap23r 的 25 个文件里变了 4 个，正是上面列的。
- 没重跑 `npm run verify`：这一轮没改题干和答案，`chaos` 第 5 题是难题，没有标准答案。
- `progress/` 没碰。

## 小复查（2026-11-19）

**通过，没有新问题。`nonlinear-oscillators` 的 status 已改成 reviewed，这一批 8 节都是 reviewed 了。**

### 比了什么

- 和快照 snap23r 逐个比：25 个文件里改了 4 个（`nonlinear-oscillators/lesson.md`、`em-waves/lesson.md`、`waveguides/lesson.md`、`chaos/problems.yaml`），和补充说明一一对上。另外 21 个没动，其中包括已经改成 reviewed 的 7 节。
- `chaos/problems.yaml` 和 HEAD 比只改了第 79 行。

### 逐条

- **`nonlinear-oscillators:53`**：改成「同样先在去掉右端一小段的区间上换元$x=A\sin u$，再取极限」，不再用$\varepsilon$当截断量，和 `:32` 的写法一致。两个积分都只在右端$x=A$处无界，「右端」对。上一轮新加的$\theta_1$只在 `:39` 出现，这一节别处和题目里都没有。minutes 28，没超过 30。
- **3 处括注**：`em-waves:41`「平面简谐波（plane harmonic wave）」、`:94`「波数（wave number）」，`waveguides:56`「平面波（plane wave）」，都是全节第一次出现。`waveguides:56` 把外面的括号改成「，见……」，不再括号套括号。
- **另外 6 处括注**：照调度员定的这次不改，记进 plan。
- **`chaos` 第 5 题第 3 级提示**：在第二个等号处拆成两个公式，中间加了「$xyz$项抵消，得」。重算过：$\frac{2x}\sigma\sigma(y-x)+2y\bigl(x(\rho-z)-y\bigr)+2z(xy-\beta z)$展开后$\pm2xyz$相消，正是$-2x^2+2(1+\rho)xy-2y^2-2\beta z^2$。后面的配方也对。

### 跑过的检查

- 临时副本（HEAD 的代码，加工作区的整个 `content`）：内容构建 0 个错误、0 个警告，vite build 通过；服务的进度写临时目录。
- 768 px 宽下，`nonlinear-oscillators`、`em-waves`、`waveguides`、`chaos` 每节 32 次点击，展开全部提示和解答：
  - 不横向溢出，KaTeX 错误 0，行内公式都不比段落宽；
  - 定义卡片数等于锚点数：5、4、5、6；
  - `chaos` 第 5 题第 3 级提示拆开的两个公式宽 396.5、293.3 像素，右边离段落边还有 251.5、354.7 像素；
  - 新改的文字都在页面上；控制台、服务端都没有报错。
- 改了 status 以后，在仓库里跑：
  - `npm run content`：0 个错误、0 个警告；
  - `npm run verify`：382 个小节全部一致；
  - `npm run typecheck`：通过。
- `progress/` 的校验和前后一样。

### 快照

- snap23r 已删。
- 临时网站、临时进度目录已删，`.claude/launch.json` 里加的那一项已去掉。

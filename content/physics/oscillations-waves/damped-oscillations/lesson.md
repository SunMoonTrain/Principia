---
id: physics.oscillations-waves.damped-oscillations
title: |
  阻尼振动
goal: |
  会区分欠阻尼、临界阻尼和过阻尼，并求振幅衰减的快慢。
prerequisites: [physics.oscillations-waves.simple-harmonic-motion, math.ode.constant-coefficients, physics.newtonian-mechanics.drag]
minutes: 26
summary: |
  欠阻尼时振幅按$e^{-\gamma t/2}$衰减；$\gamma=2\omega_0$是临界阻尼。
status: reviewed
---

## 这一节要回答的问题

不再推的秋千会慢慢停下，敲过的音叉声音越来越弱。:term[振幅]{id="physics.oscillations-waves.amplitude"}（amplitude）衰减得有多快？阻力（drag）大到什么程度，振子就不再来回摆，而是慢慢挪回平衡位置？闭门器、指针式电表要让门和指针尽快停在该停的地方，阻力该取多大？

## 讲解

### 阻尼力与阻尼振动

弹簧振子在空气或油里运动，还受阻力；速度不大时，它近似是和速度成正比的线性阻力（linear drag，见[与速度有关的阻力](lesson:physics.newtonian-mechanics.drag#def-drag)），沿$x$轴写成$-b\dot x$。

::anchor{id="def-damped-oscillation"}
振子除了:term[线性回复力]{id="physics.oscillations-waves.restoring-force"}（restoring force）$-kx$，还受和速度成正比、方向相反的力$-b\dot x$（$b>0$），这个力叫作:term[阻尼力]{id="physics.oscillations-waves.damping-force"}（damping force），$b$叫作阻尼系数，这时的运动叫作:term[阻尼振动]{id="physics.oscillations-waves.damped-oscillation"}（damped oscillation）。记$\gamma=\frac bm$，运动方程是$\ddot x+\gamma\dot x+\omega_0^2x=0$，其中$\omega_0=\sqrt{k/m}$是没有阻尼时的:term[角频率]{id="physics.oscillations-waves.angular-frequency"}（angular frequency），叫作振子的:term[固有角频率]{id="physics.oscillations-waves.natural-angular-frequency"}（natural angular frequency）。

为什么这样定义：阻尼力总和速度反向，功率$-b\dot x^2\le0$，它不断消耗机械能（mechanical energy），振动因此衰减，「阻尼」就是阻碍振动的意思。除以$m$以后方程里只剩$\gamma$和$\omega_0$两个参数，单位都是$\mathrm{s^{-1}}$，可以直接比较。边界情况：$b=0$就是:term[简谐运动]{id="physics.oscillations-waves.simple-harmonic-motion"}（simple harmonic motion）；大小和速度的平方成正比的平方阻力（quadratic drag）不在这里讨论；阻尼很大时振子其实不来回振动（见下面的三种情形），习惯上也算阻尼振动。

### 三种情形

::anchor{id="def-damping-cases"}
$\gamma<2\omega_0$时，振子在平衡位置两边来回振动、:term[振幅]{id="physics.oscillations-waves.amplitude"}越来越小，叫作:term[欠阻尼]{id="physics.oscillations-waves.underdamped"}（underdamped）；$\gamma=2\omega_0$时叫作:term[临界阻尼]{id="physics.oscillations-waves.critically-damped"}（critically damped）；$\gamma>2\omega_0$时叫作:term[过阻尼]{id="physics.oscillations-waves.overdamped"}（overdamped）。临界阻尼和过阻尼时，振子不再来回振动，而是回到平衡位置，途中至多越过平衡位置一次。

为什么这样定义：特征方程（characteristic equation）$r^2+\gamma r+\omega_0^2=0$的根是$-\frac\gamma2\pm\sqrt{\frac{\gamma^2}4-\omega_0^2}$，分界$\gamma=2\omega_0$就是判别式为零，即$b=2\sqrt{mk}$，和[常系数齐次线性方程](lesson:math.ode.constant-coefficients#def-damping-cases)里的$c^2=4mk$是一回事（那里的$c$就是这里的$b$）。用$\gamma$和$\omega_0$来分，比的是阻尼让运动衰减的快慢和:term[回复力]{id="physics.oscillations-waves.restoring-force"}让它振动的快慢。边界情况：$\gamma$略小于$2\omega_0$时仍是欠阻尼，可振幅衰减得很快，越过平衡位置后只剩一点点摆动，看上去和临界阻尼差不多。

::anchor{id="thm-underdamped"}
定理：欠阻尼时$x=A_0e^{-\gamma t/2}\cos(\omega_{\mathrm d}t+\varphi)$，$\omega_{\mathrm d}=\sqrt{\omega_0^2-\frac{\gamma^2}4}$，$A_0$、$\varphi$由初位置和初速度定。振幅$A_0e^{-\gamma t/2}$每过$\frac2\gamma$变为原来的$\frac1e$；阻尼弱（$\gamma\ll\omega_0$）时，机械能近似按$e^{-\gamma t}$衰减。

证明思路：特征根是$-\frac\gamma2\pm i\omega_{\mathrm d}$，由[常系数齐次线性方程](lesson:math.ode.constant-coefficients#thm-constant-coefficients)，$x=e^{-\gamma t/2}(C_1\cos\omega_{\mathrm d}t+C_2\sin\omega_{\mathrm d}t)$，再像[简谐运动](lesson:physics.oscillations-waves.simple-harmonic-motion#thm-initial-conditions)里那样合成一个余弦。阻尼弱时，一个来回里振幅几乎不变；振到最远处时速度为零，机械能近似是那时的弹性势能（elastic potential energy）$\frac12k\bigl(A_0e^{-\gamma t/2}\bigr)^2\propto e^{-\gamma t}$。

$\omega_{\mathrm d}$比$\omega_0$小，阻尼让振动变慢；阻尼弱时两者只差$\gamma^2$的量级。振动不再严格重复，相邻两次同向经过平衡位置相隔$\frac{2\pi}{\omega_{\mathrm d}}$。

::anchor{id="thm-critical"}
定理：临界阻尼时$x=(C_1+C_2t)e^{-\omega_0t}$；过阻尼时$x=C_1e^{-\lambda_1t}+C_2e^{-\lambda_2t}$，$\lambda_{1,2}=\frac\gamma2\mp\sqrt{\frac{\gamma^2}4-\omega_0^2}$。长时间后，偏离大致按$e^{-\lambda t}$变小，衰减率$\lambda$（欠阻尼时是$\frac\gamma2$，过阻尼时是较小的$\lambda_1$）在临界阻尼时最大，等于$\omega_0$。

证明思路：两个解来自[常系数齐次线性方程](lesson:math.ode.constant-coefficients#thm-constant-coefficients)里重根和两个负实根的情形。欠阻尼时$\frac\gamma2<\omega_0$；过阻尼时$\lambda_1\lambda_2=\omega_0^2$、$\lambda_1<\lambda_2$，所以$\lambda_1<\omega_0$，而且$\gamma$越大$\lambda_1$越小。要让振子既不来回振动、又尽快停下，阻尼就取在临界值附近，闭门器、指针式电表都这样设计。

## 几何图像

:::anim{component="function-plot"}
range: { x: [0, 20], y: [-1, 1.3] }
functions:
  - expr: "exp(-g*x/2) * (cos(sqrt(1 - g^2/4)*x) + g/(2*sqrt(1 - g^2/4)) * sin(sqrt(1 - g^2/4)*x))"
    label: |
      欠阻尼的位移
  - expr: "exp(-g*x/2) / sqrt(1 - g^2/4)"
    label: |
      欠阻尼的振幅$A_0e^{-\gamma t/2}$
  - expr: "(1 + x) * exp(-x)"
    label: |
      临界阻尼（$\gamma=2\omega_0$）
  - expr: "((2 + sqrt(3)) * exp(-(2 - sqrt(3))*x) - (2 - sqrt(3)) * exp(-(2 + sqrt(3))*x)) / (2*sqrt(3))"
    label: |
      过阻尼（$\gamma=4\omega_0$）
sliders:
  - name: g
    min: 0.05
    max: 1.2
    step: 0.05
    default: 0.2
    label: |
      欠阻尼的$\gamma$（以$\omega_0$为单位）
:::

横轴是时间（图上写作$x$，以$\frac1{\omega_0}$为单位），纵轴是位移，三种情形都从位移$1$处由静止放开。蓝线是:term[欠阻尼]{id="physics.oscillations-waves.underdamped"}的位移，橙线是它的:term[振幅]{id="physics.oscillations-waves.amplitude"}；绿线是:term[临界阻尼]{id="physics.oscillations-waves.critically-damped"}，紫线是:term[过阻尼]{id="physics.oscillations-waves.overdamped"}。拖大$\gamma$，蓝线衰减得更快、振动也更慢；不来回振动的两条线里，绿线贴近横轴快得多，紫线回得慢。

## 例题

### 例 1　由振幅的衰减求 γ

质量$0.20\,\mathrm{kg}$的物块连在劲度系数（spring constant）$20\,\mathrm{N/m}$的弹簧上，在空气中振动，:term[振幅]{id="physics.oscillations-waves.amplitude"}过$5.0\,\mathrm s$减为一半。求$\gamma$和阻尼系数$b$，判断是哪种阻尼，并求机械能减为一半要多久。

**为什么想到这么做**：:term[欠阻尼]{id="physics.oscillations-waves.underdamped"}时振幅按$e^{-\gamma t/2}$衰减，振幅之比只和$\gamma$、经过的时间有关；再拿$\gamma$和$2\omega_0$比，判断是哪种情形。

**推导**：$e^{-\gamma\times5.0/2}=\frac12$，$\gamma=\frac{2\ln2}{5.0}\approx0.277\,\mathrm{s^{-1}}$，$b=m\gamma\approx0.0555\,\mathrm{kg/s}$。$\omega_0=\sqrt{\frac{20}{0.20}}=10\,\mathrm{rad/s}$，$\gamma$远小于$2\omega_0$，是很弱的欠阻尼，$\omega_{\mathrm d}$和$\omega_0$相差不到万分之一。阻尼弱，机械能按$e^{-\gamma t}$衰减，减半要$\frac{\ln2}\gamma=2.5\,\mathrm s$，是振幅减半所用时间的一半。

### 例 2　恰好不来回振动

质量$0.50\,\mathrm{kg}$的物块连在劲度系数$200\,\mathrm{N/m}$的弹簧上，泡在油里。要它恰好不来回振动，阻尼系数$b$应是多少？把它拉开$x_0$由静止放开，$0.25\,\mathrm s$后还偏离多少？

**为什么想到这么做**：恰好不来回振动就是:term[临界阻尼]{id="physics.oscillations-waves.critically-damped"}$\gamma=2\omega_0$；再由初位置、初速度定出临界阻尼的解里的$C_1$、$C_2$。

**推导**：$\omega_0=\sqrt{\frac{200}{0.50}}=20\,\mathrm{rad/s}$，$b=2m\omega_0=2\sqrt{mk}=20\,\mathrm{kg/s}$。$x=(C_1+C_2t)e^{-20t}$，由$x(0)=x_0$得$C_1=x_0$，由$\dot x(0)=C_2-20C_1=0$得$C_2=20x_0$，所以$x=x_0(1+20t)e^{-20t}$。$t=0.25\,\mathrm s$时$x=6e^{-5}x_0\approx0.040x_0$。

## 常见误区

- 「阻尼越大，振子回到平衡位置越快。」超过:term[临界阻尼]{id="physics.oscillations-waves.critically-damped"}以后正相反：$\lambda_1$随$\gamma$增大而变小，$\gamma\gg\omega_0$时约为$\frac{\omega_0^2}\gamma$，振子像在蜂蜜里一样慢慢挪回去。
- 「阻尼只让:term[振幅]{id="physics.oscillations-waves.amplitude"}变小，不改变振动的快慢。」$\omega_{\mathrm d}=\sqrt{\omega_0^2-\gamma^2/4}$比$\omega_0$小，阻尼越大振动越慢；只是阻尼弱时差别是$\gamma^2$的量级，不容易察觉。
- 「振幅减半和机械能减半用的时间一样。」阻尼弱时机械能和振幅的平方成正比，衰减率是振幅的两倍，减半的时间只有一半（例 1）。

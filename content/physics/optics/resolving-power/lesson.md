---
id: physics.optics.resolving-power
title: |
  圆孔衍射与分辨本领
goal: |
  会用艾里斑和瑞利判据求望远镜和显微镜的分辨极限。
prerequisites: [physics.optics.single-slit-diffraction, physics.optics.optical-instruments]
minutes: 50
summary: |
  圆孔把点成像为艾里斑，两点靠近到瑞利判据就分不开了。
status: reviewed
---

## 这一节要回答的问题

望远镜的口径越大，越能把靠得很近的两颗星分开；显微镜换上:term[焦距]{id="physics.optics.focal-length"}（focal length）再短的目镜，也看不清更小的细节，只是把模糊的像放大（见[透镜组与光学仪器](lesson:physics.optics.optical-instruments)第 8 题）。光学仪器能分辨的细节有没有极限？这个极限由什么决定？

## 讲解

### 圆孔的夫琅禾费衍射

望远镜的物镜、眼睛的瞳孔都是圆孔。远处一个点光源发出的光到这里已是平行光，穿过圆孔时同样会:term[衍射]{id="physics.optics.diffraction"}（diffraction）；透镜把各个方向的平行光会聚到:term[焦点]{id="physics.optics.focal-point"}（focal point）所在的平面上，那里看到的就是圆孔的:term[夫琅禾费衍射]{id="physics.optics.fraunhofer-diffraction"}（Fraunhofer diffraction）图样（见[单缝衍射](lesson:physics.optics.single-slit-diffraction#def-fraunhofer)）。

::anchor{id="thm-airy"}
定理（圆孔的夫琅禾费衍射）：直径为$D$的圆孔被波长为$\lambda$的平行光垂直照射，夫琅禾费衍射图样是一个圆形的中央亮斑，外面围着一圈圈明暗相间的圆环；第一个暗环偏离原方向的角度$\theta_1$满足$\sin\theta_1=1.22\frac\lambda D$，中央亮斑里集中了约$84\%$的光能。

证明思路：照[单缝衍射](lesson:physics.optics.single-slit-diffraction#thm-single-slit-intensity)的办法，把圆孔分成垂直于某个方向的细条，各条到远处那一点的:term[光程差]{id="physics.optics.optical-path-difference"}（optical path difference）和它的位置成正比；不同的是细条的长度不同，中间长、两边短，叠加时中间的细条分量重、两边的轻。边上的:term[次波]{id="physics.optics.secondary-wavelet"}（secondary wavelet）分量小，要让各条的贡献整体抵消，光程差得比单缝的$\lambda$再大一些，按长度加权积分算出来是$1.22\lambda$（要用到:term[贝塞尔函数]{id="math.ode.bessel-function"}，Bessel function，这里不证）。$84\%$也是由这个积分算出的，单缝的中央亮纹集中了约$90\%$的光能，两者相差不多。

::anchor{id="def-airy-disk"}
圆孔的夫琅禾费衍射图样里，第一个暗环以内的中央亮斑叫作:term[艾里斑]{id="physics.optics.airy-disk"}（Airy disk）。

为什么这样定义：绝大部分光能都在这个亮斑里，外面的亮环很暗，第一个亮环的峰值只有中心的不到$2\%$，所以一个点经过圆孔成的像，看起来就是这个亮斑，它的大小说明像模糊了多少。艾里（George Biddell Airy）在 1835 年算出了它的光强分布。边界情况：:term[焦距]{id="physics.optics.focal-length"}为$f$的透镜，在焦平面上的艾里斑半径约为$1.22\frac{\lambda f}D$；即使透镜完全没有:term[像差]{id="physics.optics.aberration"}（aberration），一个点的像也不是一个点。

### 瑞利判据

两个互不相干的点光源，比如两颗星，经过同一个圆孔各自成一个:term[艾里斑]{id="physics.optics.airy-disk"}，光强直接相加。两颗星对圆孔张的角越小，两个艾里斑重叠得越多，合起来的光斑中间的凹陷越浅，最后合成一个拉长的光斑，分不出是两个。

::anchor{id="def-rayleigh"}
一个点光源所成艾里斑的中心，正好落在另一个点光源所成艾里斑的第一个暗环上时，认为两者刚好能分辨，这个标准叫作:term[瑞利判据]{id="physics.optics.rayleigh-criterion"}（Rayleigh criterion）；这时两点对圆孔张的角$\theta_{\min}=1.22\frac\lambda D$（角度小时）叫作:term[最小分辨角]{id="physics.optics.angular-resolution"}（angular resolution limit）。

为什么这样定义：按这个标准刚好分开时，两个光斑合起来的光强在两个中心之间降到峰值的约$74\%$，眼睛能看出中间有一道暗缝，认得出是两个；再靠近，凹陷很快变浅、消失。:term[衍射光栅]{id="physics.optics.diffraction-grating"}（diffraction grating）的:term[色分辨本领]{id="physics.optics.chromatic-resolving-power"}（chromatic resolving power，见[衍射光栅](lesson:physics.optics.diffraction-gratings#def-chromatic-resolving-power)）用的是同一个标准：一条谱线的:term[主极大]{id="physics.optics.principal-maximum"}（principal maximum）落在另一条旁边的第一个暗处。边界情况：这是一种约定，并不是说角度再小一点两点就绝对分不开，知道光源就是两个点、亮度又差不多时，用仪器仔细测光强的分布还能分得更细（第 8 题）。

瑞利（Lord Rayleigh）在 1879 年前后提出了这个判据。最小分辨角越小，仪器分辨细节的能力，即分辨本领（resolving power）越高；它只由口径和波长决定：口径越大、波长越短，分得越清。

### 望远镜和显微镜

望远镜的:term[最小分辨角]{id="physics.optics.angular-resolution"}是$1.22\frac\lambda D$，$D$是物镜的直径。眼睛的瞳孔在白天约$3\,\mathrm{mm}$，对$550\,\mathrm{nm}$的光$\theta_{\min}\approx2.2\times10^{-4}\,\mathrm{rad}$，约$0.8'$，和人眼实际能分辨的约$1'$相当，视网膜中央感光细胞的间距也正好和这个角度相配。望远镜的:term[角放大率]{id="physics.optics.angular-magnification"}（angular magnification）只要能把物镜的最小分辨角放大到眼睛分辨得出的约$1'$，就把物镜收到的细节都送进了眼睛；再大，只是放大了:term[艾里斑]{id="physics.optics.airy-disk"}，是无效放大（empty magnification）。

显微镜看的是近处的物体。设物镜收进的光锥的半顶角为$u$，物体和物镜之间介质的:term[折射率]{id="physics.optics.refractive-index"}（refractive index）为$n$，能分辨的两点的最小距离约为$d_{\min}=0.61\frac{\lambda}{n\sin u}$（第 5 题）。$n\sin u$叫作物镜的:term[数值孔径]{id="physics.optics.numerical-aperture"}（numerical aperture，NA），和光纤收光的那个数值孔径意思相同；在空气里$\sin u<1$，把物体浸在油里（$n\approx1.5$），数值孔径能到$1.4$左右，用可见光最好也只能分辨约$0.2\,\mu\mathrm m$的细节。要看更小的东西，就要用更短的波长：紫外光、X 射线，或者波长短得多的电子束。

## 几何图像

:::anim{component="function-plot"}
range: { x: [-3, 3], y: [0, 2.05] }
functions:
  - expr: "(sum(j, 0, 47, cos(pi*(j + 0.5)/96)^2*cos(pi*(x + 0.61*s)*sin(pi*(j + 0.5)/96)))/24)^2"
    label: |
      左边那颗星的艾里斑
  - expr: "(sum(j, 0, 47, cos(pi*(j + 0.5)/96)^2*cos(pi*(x - 0.61*s)*sin(pi*(j + 0.5)/96)))/24)^2"
    label: |
      右边那颗星的艾里斑
  - expr: "(sum(j, 0, 47, cos(pi*(j + 0.5)/96)^2*cos(pi*(x + 0.61*s)*sin(pi*(j + 0.5)/96)))/24)^2 + (sum(j, 0, 47, cos(pi*(j + 0.5)/96)^2*cos(pi*(x - 0.61*s)*sin(pi*(j + 0.5)/96)))/24)^2"
    label: |
      合起来的光强
sliders:
  - name: s
    min: 0.5
    max: 2
    step: 0.05
    default: 1
    label: |
      两颗星的角距离，以最小分辨角为单位
:::

横轴是偏离两颗星连线中点的角度，以$\frac\lambda D$为单位（图上写作$x$），沿两颗星的连线方向看；纵轴是光强，以一个:term[艾里斑]{id="physics.optics.airy-disk"}中心的光强为$1$。默认角距离正好等于:term[最小分辨角]{id="physics.optics.angular-resolution"}，一个艾里斑的中心落在另一个的第一个暗环上（$1.22\frac\lambda D$处），合起来的光强中间降到约$0.74$，这就是:term[瑞利判据]{id="physics.optics.rayleigh-criterion"}。滑块把角距离调小，中间的凹陷很快变浅，到$0.8$左右就基本看不出了；调大，两个光斑完全分开，中间几乎全暗。艾里斑的光强按圆孔的衍射积分算出。

## 例题

### 例 1　哈勃空间望远镜能看清月球上多大的东西

哈勃空间望远镜主镜的直径是$2.4\,\mathrm m$。对波长$550\,\mathrm{nm}$的光，它的:term[最小分辨角]{id="physics.optics.angular-resolution"}是多少？月球离地球约$3.84\times10^8\,\mathrm m$，它在月面上能分辨的两点相距至少多远？

**为什么想到这么做**：按:term[瑞利判据]{id="physics.optics.rayleigh-criterion"}，$\theta_{\min}=1.22\frac\lambda D$；角度很小时，两点间距约为距离乘以角度。

**推导**：$\theta_{\min}=1.22\times\frac{550\times10^{-9}}{2.4}\,\mathrm{rad}\approx2.8\times10^{-7}\,\mathrm{rad}$，$1\,\mathrm{rad}\approx2.06\times10^5$角秒，约$0.058''$。月面上的间距约$3.84\times10^8\times2.8\times10^{-7}\,\mathrm m\approx1.1\times10^2\,\mathrm m$：一百多米以下的东西，哪怕是登月舱，它也看不清。

### 例 2　油浸物镜

显微镜的油浸物镜，油的:term[折射率]{id="physics.optics.refractive-index"}$1.52$，物镜收进的光锥半顶角$67^\circ$。用波长$550\,\mathrm{nm}$的光照明，能分辨的最小距离是多少？人眼在明视距离$25\,\mathrm{cm}$处能分辨约$0.1\,\mathrm{mm}$的两点，显微镜的总放大率大约多少就够了？

**为什么想到这么做**：$d_{\min}=0.61\frac\lambda{n\sin u}$；放大率只要能把$d_{\min}$放大到眼睛能分辨的$0.1\,\mathrm{mm}$，再大就是无效放大。

**推导**：:term[数值孔径]{id="physics.optics.numerical-aperture"}$n\sin u=1.52\times\sin67^\circ\approx1.40$，$d_{\min}=0.61\times\frac{550\,\mathrm{nm}}{1.40}\approx240\,\mathrm{nm}=0.24\,\mu\mathrm m$。放大率约$\frac{0.1\,\mathrm{mm}}{0.24\,\mu\mathrm m}\approx400$倍就把能分辨的细节都送进了眼睛；实际常用到$1000$倍左右，让眼睛看得轻松些，再往上就是无效放大。

## 常见误区

- 「望远镜的放大率越大，看到的细节越多。」能分辨的细节由物镜的口径决定（:term[最小分辨角]{id="physics.optics.angular-resolution"}$1.22\frac\lambda D$）；放大率超过把它送进眼睛所需的倍数以后，只是放大了模糊的:term[艾里斑]{id="physics.optics.airy-disk"}。
- 「没有:term[像差]{id="physics.optics.aberration"}的理想透镜能把一个点成像为一个点。」光通过有限大的圆孔总要:term[衍射]{id="physics.optics.diffraction"}，理想透镜也只能把点成像为艾里斑。
- 「:term[瑞利判据]{id="physics.optics.rayleigh-criterion"}是分辨能力不可逾越的界限。」它是一个约定；事先知道光源是两个点、亮度相近时，测量光强的分布可以分辨比它更近的两点（第 8 题）。
- 「圆孔的第一个暗环在$\sin\theta=\frac\lambda D$处，和单缝一样。」圆孔的系数是$1.22$：边上的细条短，分量轻，要抵消需要更大的:term[光程差]{id="physics.optics.optical-path-difference"}。

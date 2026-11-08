// 星图的几何常量：编译器算布局、网页画立体星图都用这一份。见 docs/plan.md「立体知识图谱与动态效果」。

/** 立体星图（横放的圆筒）里节点所在圆筒壳的内外半径（场景单位）。 */
export const RADIUS_INNER = 7;
export const RADIUS_OUTER = 12;
/** 相邻两层沿轴的距离（场景单位）。 */
export const LEVEL_GAP = 2.2;

const RAD = Math.PI / 180;

/**
 * 立体星图里的位置：圆筒横放，沿 x 轴往右越深；绕轴的角度 0° 在正上方，往镜头这边转（90° 正对镜头），
 * 和横向展开图的纵轴同一个方向：数学那半圈（0–180°）正对初始镜头，物理在背面。
 */
export function position3d(angle: number, radius: number, level: number): [number, number, number] {
  return [level * LEVEL_GAP, radius * Math.cos(angle * RAD), radius * Math.sin(angle * RAD)];
}

// 星图的几何常量：编译器算布局、网页画立体星图都用这一份。见 docs/plan.md「立体知识图谱与动态效果」。

/** 立体星图里节点所在圆柱壳的内外半径（场景单位）。 */
export const RADIUS_INNER = 7;
export const RADIUS_OUTER = 12;
/** 相邻两层的高度差（场景单位）。 */
export const LEVEL_HEIGHT = 2.2;

const RAD = Math.PI / 180;

/**
 * 立体星图里的位置：高度是层级；从外面看过去，角度 0° 在左、180° 在右（和展开图的横轴同一个方向），
 * 数学那半圈朝向初始镜头。
 */
export function position3d(angle: number, radius: number, level: number): [number, number, number] {
  return [-radius * Math.cos(angle * RAD), level * LEVEL_HEIGHT, radius * Math.sin(angle * RAD)];
}

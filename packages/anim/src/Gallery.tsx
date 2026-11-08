// 组件画廊：每个组件一个演示，也是测试页（docs/plan.md「可复用动画组件库」）。
// 演示见 demos.ts，展开「写法」能看到小节里的原文；标签里的公式由网站排版后通过 renderLabel 传进来，不传就显示原文。
// 页面最下面在浏览器里再跑一遍台阶 7 的两条物理检查。

import { useMemo, type ReactNode } from 'react';
import { pendulumPeriodError, springEnergyDrift } from './checks';
import { demoSource, DEMOS } from './demos';
import { ANIMATIONS } from './registry';

/** 演示里要排版的文字：滑块标签和图例。 */
function demoLabels(params: Record<string, unknown>, render: (src: string) => ReactNode): Record<string, ReactNode> {
  const labels: Record<string, ReactNode> = {};
  const list = (key: string): { label?: string; name?: string }[] => (Array.isArray(params[key]) ? (params[key] as { label?: string; name?: string }[]) : []);
  for (const s of list('sliders')) if (s.label && s.name) labels[`slider:${s.name}`] = render(s.label);
  list('functions').forEach((f, i) => f.label && (labels[`function:${i}`] = render(f.label)));
  list('sequences').forEach((s, i) => s.label && (labels[`sequence:${i}`] = render(s.label)));
  return labels;
}

function SelfChecks() {
  const results = useMemo(
    () => [
      { name: '单摆小角度（0.1 弧度）的周期与 2π√(L/g) 的相对误差', value: pendulumPeriodError(), limit: 0.01 },
      { name: '无阻尼弹簧振子运行 100 个周期后能量的相对漂移', value: springEnergyDrift(), limit: 0.001 },
    ],
    [],
  );
  const percent = (v: number): string => `${Number((v * 100).toPrecision(2))}%`;
  return (
    <section className="anim-demo">
      <h2>物理检查</h2>
      <p className="anim-demo-note">和单元测试同一套算法（四阶龙格-库塔法，固定步长），在浏览器里再算一遍。</p>
      <table className="anim-checks">
        <thead>
          <tr>
            <th>检查</th>
            <th>结果</th>
            <th>要求</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.name}>
              <td>{r.name}</td>
              <td>{percent(r.value)}</td>
              <td>小于 {percent(r.limit)}</td>
              <td className={r.value < r.limit ? 'anim-check-pass' : 'anim-check-fail'}>{r.value < r.limit ? '通过' : '不通过'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function Gallery({ renderLabel }: { renderLabel?: (src: string) => ReactNode }) {
  const render = renderLabel ?? ((src: string) => src);
  return (
    <div className="anim-gallery">
      {DEMOS.map((demo) => {
        const Component = ANIMATIONS[demo.component];
        return (
          <section key={demo.title} className="anim-demo">
            <h2>{demo.title}</h2>
            <p className="anim-demo-note">{demo.note}</p>
            <Component params={demo.params as never} labels={demoLabels(demo.params, render)} />
            <details className="anim-demo-source">
              <summary>写法</summary>
              <pre>
                <code>{demoSource(demo)}</code>
              </pre>
            </details>
          </section>
        );
      })}
      <SelfChecks />
    </div>
  );
}

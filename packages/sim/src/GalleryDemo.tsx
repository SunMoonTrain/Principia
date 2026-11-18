import { Suspense, useState } from 'react';
import type { Machine } from './core/machine';
import { StepperBar, touchKind } from './kit/StepperBar';
import { useMachine, type PlaybackOptions } from './kit/useMachine';

import { SIMULATORS } from './registry';

const demos = [
  { name: 'bits', title: '补码加法 · 127 + 1', params: { width: 8, value: 127, op: { kind: 'add', b: 1 }, show: ['unsigned', 'signed', 'hex'],
    goals: [{ when: 'OF == 1', text: '让两个正数相加得出负数' }],
    pauses: [{ when: 'step == 7', text: '下一步处理符号位。你预测有符号结果是多少？' }] } },
  { name: 'bits', title: '补码减法 · 5 − 7', params: { width: 8, value: 5, op: { kind: 'sub', b: 7 }, show: ['unsigned', 'signed', 'hex'] } },
  { name: 'bits', title: '四位数轮 · 7 + 1', params: { width: 4, value: 7, op: { kind: 'add', b: 1 }, show: ['wheel'] } },
  { name: 'float32', title: '拆开单精度数 · 0.1', params: { mode: 'inspect', bits: 0x3dcccccd } },
  { name: 'float32', title: '单精度加法 · 16777216 + 1', params: { mode: 'add', a: 16777216, b: 1, compare64: true } },
  { name: 'float32', title: '逐次舍入 · 十次 0.1', params: { mode: 'accumulate', delta: 0.1, count: 10, compare64: true } },
  { name: 'text-encoding', title: '从码位到字节 · A中😀', params: { text: 'A中😀', show: ['utf8', 'utf16'] } },
];

const initial = { a: 1071, b: 462, steps: 0 };
type State = typeof initial;

const euclid: Machine<State, State> = {
  init: (params) => ({ ...params }),
  step({ a, b, steps }) {
    const r = a % b;
    return { state: { a: b, b: r, steps: steps + 1 }, done: r === 0, events: [
      { kind: 'write', touched: ['a', 'b', 'steps'], text: a + ' ÷ ' + b + ' 余 ' + r + '，把除数和余数移到下一步。' },
    ] };
  },
  edit(state, action) {
    if (typeof action !== 'number' || !Number.isSafeInteger(action) || action < 1) throw new Error('除数必须是正整数');
    return { ...state, b: action };
  },
  observe: (state) => ({ ...state }),
};

const options: PlaybackOptions = {
  names: ['a', 'b', 'steps'], stepsPerSecond: 2,
  pauses: [{ when: 'steps == 2', text: '先猜一猜：下一次相除，余数会是多少？' }],
  goals: [{ when: 'b == 0', text: '让余数变成 0，读出最大公约数。' }],
};

export default function GalleryDemo() {
  const player = useMachine(euclid, initial, 0, options);
  const { state, events } = player.history;
  const [input, setInput] = useState('');
  const b = Number(input);
  return <><div className="sim-demo">
    <h3>辗转相除法</h3>
    <p>从 1071 和 462 开始，每步用除数和余数替换这两个数。余数为 0 时，被除数就是最大公约数。</p>
    <StepperBar player={player}>
      <dl className="sim-state">
        <div data-touch={touchKind(events, 'a')}><dt>被除数 a</dt><dd>{state.a}</dd></div>
        <div data-touch={touchKind(events, 'b')}><dt>除数 b</dt><dd>{state.b}</dd></div>
        <div data-touch={touchKind(events, 'steps')}><dt>步数</dt><dd>{state.steps}</dd></div>
      </dl>
      <form className="sim-edit" onSubmit={(e) => { e.preventDefault(); player.edit(b); setInput(''); }}>
        <label>修改除数 <input type="number" min="1" step="1" value={input} onChange={(e) => setInput(e.target.value)} /></label>
        <button disabled={!(Number.isSafeInteger(b) && b >= 1)}>应用</button>
      </form>
    </StepperBar>
  </div>{demos.map(({ name, title, params }) => {
    const Component = SIMULATORS[name];
    return <div className="sim-demo" key={title}><h3>{title}</h3>
      <Suspense fallback={<p>正在加载模拟器…</p>}><Component params={params as never}/></Suspense></div>;
  })}</>;
}

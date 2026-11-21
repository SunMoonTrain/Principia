// 行内公式、术语标记、链接、强调边上的空格（shared/cjk-spacing.ts）：经编译器的 Markdown 管线测，输入的写法和真实内容一样。
// 简式：文字原样，公式 $…$，术语标记 ⟦…⟧，链接 ⟨…⟩，强调 *…*，加粗 **…**，删除线 ~~…~~，公式和紧贴的标点组成的不折行组 […]，
// 硬换行 ↵（转成 HTML 后硬换行后面跟着一个换行符）。

import type { Element, ElementContent } from 'hast';
import { describe, expect, it } from 'vitest';
import { keepPunctuationWithMath, markTermEdges, spaceAroundMath, type InlineNode } from '../shared/cjk-spacing.ts';
import { Diagnostics } from './diagnostics.ts';
import { parseFragment, renderField, transformBody } from './markdown.ts';

const context = () => ({ file: 'problems.yaml', macros: {}, diags: new Diagnostics(), refs: { lessons: [], terms: [] } });

function outline(nodes: ElementContent[]): string {
  return nodes
    .map((n) => {
      if (n.type === 'text') return n.value;
      if (n.type !== 'element') return '';
      const inner = outline(n.children);
      switch (n.tagName) {
        case 'x-math':
          return `$${/application\/x-tex">(.*?)<\/annotation>/.exec(String(n.properties.dataHtml))?.[1]}$`;
        case 'x-term':
          return `⟦${inner}⟧`;
        case 'a':
          return `⟨${inner}⟩`;
        case 'em':
          return `*${inner}*`;
        case 'strong':
          return `**${inner}**`;
        case 'del':
          return `~~${inner}~~`;
        case 'span':
          return `[${inner}]`;
        case 'br':
          return '↵';
        default:
          return `<${n.tagName}>${inner}</${n.tagName}>`;
      }
    })
    .join('');
}

/** 一段题目文字编译后的简式。 */
function show(src: string): string {
  const ctx = context();
  const rich = renderField({ value: src, line: 1, contentLine: 1 }, ctx, 'rich');
  expect(ctx.diags.items).toEqual([]);
  const p = rich.children.find((c): c is Element => c.type === 'element' && c.tagName === 'p');
  return outline(p?.children ?? []);
}

let termCount = 0;
/** 术语标记；每次给一个新 id（同一个字段里同一个术语第二次出现会按普通文字显示）。 */
const term = (label: string): string => `:term[${label}]{id="math.demo.t${++termCount}"}`;

/** 全角空格（U+3000），写成常量免得和半角空格看混。 */
const FW = '　';

describe('术语标记、链接、强调的边上是公式：这一侧和单独一个公式一样', () => {
  it('挨着汉字留一个空格，手写的几个空白归成一个', () => {
    expect(show(`是某个$m$阶零点，是某个${term('$m$阶零点')}`)).toBe('是某个 $m$ 阶零点，是某个 ⟦$m$ 阶零点⟧');
    expect(show(`的某个 ${term('$m$阶零点')}`)).toBe('的某个 ⟦$m$ 阶零点⟧');
    expect(show(`的某个   ${term('$m$阶零点')}`)).toBe('的某个 ⟦$m$ 阶零点⟧');
    expect(show(`取${term('常数$C$')}使`)).toBe('取⟦常数 $C$⟧ 使');
    expect(show(`取${term('常数$C$')}   使`)).toBe('取⟦常数 $C$⟧ 使');
    // 软换行也是空白
    expect(show(`的某个\n${term('$m$阶零点')}\n是`)).toBe('的某个 ⟦$m$ 阶零点⟧\n是');
    expect(show(`取${term('常数$C$')}\n使`)).toBe('取⟦常数 $C$⟧ 使');
    // 挨着的是另一个以汉字收尾、开头的容器：在两个容器之间补一个空格
    expect(show(`**定义**${term('$m$阶零点')}`)).toBe('**定义** ⟦$m$ 阶零点⟧');
    expect(show(`取${term('常数$C$')}**使**`)).toBe('取⟦常数 $C$⟧ **使**');
  });

  it('挨着中文标点不留，手写的空白去掉', () => {
    expect(show(`，${term('$m$阶零点')}。`)).toBe('，⟦$m$ 阶零点⟧。');
    expect(show(`，  ${term('$m$阶零点')}`)).toBe('，⟦$m$ 阶零点⟧');
    expect(show(`即${term('常数$C$')} 。`)).toBe('即⟦常数 $C$⟧。');
    expect(show(`「${term('$m$阶零点')}」`)).toBe('「⟦$m$ 阶零点⟧」');
  });

  it('挨着英文、数字、公式时不动，手写的空白也不动', () => {
    expect(show(`the ${term('$m$阶零点')}`)).toBe('the ⟦$m$ 阶零点⟧');
    expect(show(`the${term('$m$阶零点')}`)).toBe('the⟦$m$ 阶零点⟧');
    expect(show(`2${term('$m$阶零点')}`)).toBe('2⟦$m$ 阶零点⟧');
    expect(show(`$x$${term('$m$阶零点')}`)).toBe('$x$⟦$m$ 阶零点⟧');
    expect(show(`$x$  ${term('$m$阶零点')}`)).toBe('$x$  ⟦$m$ 阶零点⟧');
  });

  it('在段首段尾时只管里侧那一边', () => {
    expect(show(`${term('$m$阶零点')}是`)).toBe('⟦$m$ 阶零点⟧是');
    expect(show(`设${term('常数$C$')}`)).toBe('设⟦常数 $C$⟧');
    expect(show(term('$m$'))).toBe('⟦$m$⟧');
  });

  it('硬换行（行末反斜杠）后面是行首，不补空格', () => {
    expect(show(`的某个\\\n${term('$m$阶零点')}`)).toBe('的某个↵\n⟦$m$ 阶零点⟧');
    expect(show(`取${term('常数$C$')}\\\n使`)).toBe('取⟦常数 $C$⟧↵\n使');
  });

  it('链接、强调、加粗包着公式也一样；空格加在容器外面', () => {
    expect(show('见[$f$](lesson:math.demo.a)的')).toBe('见 ⟨$f$⟩ 的');
    expect(show('由[$e^z$的积分](lesson:math.demo.a)，')).toBe('由 ⟨$e^z$ 的积分⟩，');
    expect(show('设   *$x$*   是')).toBe('设 *$x$* 是');
    expect(show('（**$x$** ）')).toBe('（**$x$**）');
    expect(show('设 ~~$x$~~  是')).toBe('设 ~~$x$~~ 是');
  });

  it('公式在嵌套容器的边上：逐层往里找', () => {
    expect(show(`的某个${term('*$m$* 阶零点')}`)).toBe('的某个 ⟦*$m$* 阶零点⟧');
    expect(show('见[*$f$* 的积分](lesson:math.demo.a)')).toBe('见 ⟨*$f$* 的积分⟩');
    expect(show('见[积分 *$I$*](lesson:math.demo.a)的')).toBe('见⟨积分 *$I$*⟩ 的');
    // 术语里面先处理过：公式和顿号已经组成不折行组，组的开头仍是公式
    expect(show(`的${term('$f$、$g$的和')}`)).toBe('的 ⟦[$f$、]$g$ 的和⟧');
    // 容器边上是标点、是汉字时不算
    expect(show(`的${term('（$m$）阶')}`)).toBe('的⟦[（$m$）]阶⟧');
  });
});

describe('术语标记的头尾是拉丁字母或数字', () => {
  it('挨着汉字留一个空格，手写的几个空白归成一个', () => {
    expect(show(`由${term('ML 不等式')}可知`)).toBe('由 ⟦ML 不等式⟧可知');
    expect(show(`由 ${term('ML 不等式')}可知`)).toBe('由 ⟦ML 不等式⟧可知');
    expect(show(`由   ${term('ML 不等式')}可知`)).toBe('由 ⟦ML 不等式⟧可知');
    expect(show(`是${term('2 型超导体')}`)).toBe('是 ⟦2 型超导体⟧');
    expect(show(`在${term('点 P')}处`)).toBe('在⟦点 P⟧ 处');
    expect(show(`在${term('点 P')}  处`)).toBe('在⟦点 P⟧ 处');
    // 软换行也是空白；硬换行后面不补
    expect(show(`由\n${term('ML 不等式')}\n可知`)).toBe('由 ⟦ML 不等式⟧\n可知');
    expect(show(`在${term('点 P')}\n处`)).toBe('在⟦点 P⟧ 处');
    expect(show(`由\\\n${term('ML 不等式')}可知`)).toBe('由↵\n⟦ML 不等式⟧可知');
  });

  it('挨着中文标点不留，挨着英文、数字不动', () => {
    expect(show(`（${term('ML 不等式')}）`)).toBe('（⟦ML 不等式⟧）');
    expect(show(`，  ${term('ML 不等式')}`)).toBe('，⟦ML 不等式⟧');
    expect(show(`${term('点 P')} ，`)).toBe('⟦点 P⟧，');
    expect(show(`the ${term('ML 不等式')}`)).toBe('the ⟦ML 不等式⟧');
    expect(show(`the${term('ML 不等式')}`)).toBe('the⟦ML 不等式⟧');
    expect(show(`${term('点 P')}2`)).toBe('⟦点 P⟧2');
  });

  it('在段首段尾、在别的容器边上', () => {
    expect(show(`${term('ML 不等式')}给出`)).toBe('⟦ML 不等式⟧给出');
    expect(show(`由${term('ML 不等式')}`)).toBe('由 ⟦ML 不等式⟧');
    expect(show(`由[${term('ML 不等式')}](lesson:math.demo.a)可知`)).toBe('由 ⟨⟦ML 不等式⟧⟩可知');
  });

  it('只限术语标记：链接、强调、普通文字里汉字挨着英文照旧不加', () => {
    expect(show('由ML 不等式可知')).toBe('由ML 不等式可知');
    expect(show('见[Cauchy 定理](lesson:math.demo.a)的')).toBe('见⟨Cauchy 定理⟩的');
    expect(show('是*ML*的')).toBe('是*ML*的');
  });

  it('同一块里再次出现的术语按普通文字显示，空格照第一次出现的规则加', () => {
    const ml = ':term[ML 不等式]{id="math.demo.ml"}';
    expect(show(`由${ml}和${ml}可知`)).toBe('由 ⟦ML 不等式⟧和 ML 不等式可知');
    expect(show(`由${ml}，再由   ${ml}`)).toBe('由 ⟦ML 不等式⟧，再由 ML 不等式');
    expect(show(`由${ml}（${ml}）`)).toBe('由 ⟦ML 不等式⟧（ML 不等式）');
    const p = ':term[点 P]{id="math.demo.p"}';
    expect(show(`设${p}，${p}处`)).toBe('设⟦点 P⟧，点 P 处');
    // 公式开头的本来就会加（拆出来的是单独一个公式）；汉字开头、结尾的照旧不加
    const zero = ':term[$m$阶零点]{id="math.demo.z"}';
    expect(show(`的${zero}，即${zero}`)).toBe('的 ⟦$m$ 阶零点⟧，即 $m$ 阶零点');
    const sub = ':term[子空间]{id="math.demo.s"}';
    expect(show(`是${sub}，是${sub}的`)).toBe('是⟦子空间⟧，是子空间的');
  });
});

describe('全角空格「　」当中文标点：作者写了就原样保留，公式挨着它不另加空格', () => {
  it('粗体小标题后面的全角空格：小标题以汉字、右括号、数字、公式结尾都一样', () => {
    expect(show(`**定理**${FW}$x$ 是`)).toBe(`**定理**${FW}$x$ 是`);
    expect(show(`**乘积法则（product rule）**${FW}$u$`)).toBe(`**乘积法则（product rule）**${FW}$u$`);
    expect(show(`**定理 1**${FW}$f$`)).toBe(`**定理 1**${FW}$f$`);
    expect(show(`**坐标把$V$变成$\\R^n$**${FW}设`)).toBe(`**坐标把 $V$ 变成 $\\R^n$**${FW}设`);
    expect(show(`**生成整个$\\R^n$**${FW}$v$`)).toBe(`**生成整个 $\\R^n$**${FW}$v$`);
    expect(show(`**平面上的正交矩阵**${FW}二阶`)).toBe(`**平面上的正交矩阵**${FW}二阶`);
  });

  it('术语标记、单独的公式挨着全角空格也一样；和半角空白混写时只去掉半角的', () => {
    expect(show(`由${FW}${term('ML 不等式')}可知`)).toBe(`由${FW}⟦ML 不等式⟧可知`);
    expect(show(`${term('点 P')}${FW}，`)).toBe(`⟦点 P⟧${FW}，`);
    expect(show(`的某个${FW}${term('$m$阶零点')}`)).toBe(`的某个${FW}⟦$m$ 阶零点⟧`);
    expect(show(`设${FW}$x$`)).toBe(`设${FW}$x$`);
    expect(show(`设${FW}  ${term('$m$阶零点')}`)).toBe(`设${FW}⟦$m$ 阶零点⟧`);
    expect(show(`$x$ ${FW}是`)).toBe(`$x$${FW}是`);
  });
});

describe('只改同一层的文字，再跑一遍不变', () => {
  it('处理过的段落再跑一遍 spaceAroundMath、keepPunctuationWithMath，结果不变', () => {
    const ml = ':term[ML 不等式]{id="math.demo.ml"}';
    const src = [
      `是某个${term('$m$阶零点')}，由 ${term('ML 不等式')}和[$f$](lesson:math.demo.a)、**$x$** 的${term('常数$C$')}。`,
      '',
      `${term('$f$、$g$的和')}   见[积分 *$I$*](lesson:math.demo.a)  ，$x$ ${term('$m$阶零点')} 的 $y$`,
      '',
      `**定理**${FW}$x$ 是${ml}，由${FW}${ml}和  ${ml}可知，**$y$**${FW}设 $z$ ${FW}是`,
    ].join('\n');
    const tree = parseFragment(src);
    const ctx = context();
    transformBody(tree, { ...ctx, lineOffset: 0 });
    expect(ctx.diags.items).toEqual([]);
    const paragraphs = (tree.children ?? []).filter((c) => c.type === 'paragraph');
    expect(paragraphs).toHaveLength(3);
    for (const p of paragraphs) {
      const once = structuredClone(p.children ?? []);
      expect(spaceAroundMath(structuredClone(once))).toEqual(once);
      expect(keepPunctuationWithMath(spaceAroundMath(structuredClone(once)))).toEqual(once);
    }
  });

  it('两边都按公式处理时，中间的空白不因为先处理了左边而变；删除线也算容器', () => {
    const math = (): InlineNode => ({ type: 'inlineMath', value: 'x', data: { hName: 'x-math' } });
    const text = (value: string): InlineNode => ({ type: 'text', value });
    const xterm = (...children: InlineNode[]): InlineNode => ({ type: 'textDirective', data: { hName: 'x-term' }, children });
    const nodes = [text('汉'), xterm(text('点 P')), text('  '), xterm(math(), text(' 阶')), text(' '), { type: 'delete', children: [math()] }, text('字')];
    const out = spaceAroundMath(nodes);
    expect(out.map((n) => (n.type === 'text' ? n.value : n.type))).toEqual(['汉', 'textDirective', '  ', 'textDirective', ' ', 'delete', ' 字']);
    expect(spaceAroundMath(structuredClone(out))).toEqual(out);
  });

  it('markTermEdges 打了记号的头尾节点照术语标记处理；没打记号的文字不加；记号不带进 HTML', () => {
    const text = (value: string): InlineNode => ({ type: 'text', value });
    const label = [text('ML 不等式')];
    markTermEdges(label);
    expect(spaceAroundMath([text('由'), ...label, text('可知')]).map((n) => n.value)).toEqual(['由 ', 'ML 不等式', '可知']);
    expect(spaceAroundMath([text('由'), text('ML 不等式'), text('可知')]).map((n) => n.value)).toEqual(['由', 'ML 不等式', '可知']);
    const ml = ':term[ML 不等式]{id="math.demo.ml"}';
    const rich = renderField({ value: `由${ml}和${ml}`, line: 1, contentLine: 1 }, context(), 'rich');
    expect(JSON.stringify(rich)).not.toMatch(/termStart|termEnd/);
  });
});

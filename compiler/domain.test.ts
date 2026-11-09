import { describe, expect, it } from 'vitest';
import { Diagnostics } from './diagnostics.ts';
import { checkMacroConsistency, type DomainInfo } from './domain.ts';

/** 只带宏的领域：宏按顺序从第 5 行起，一行一个。 */
function domain(id: string, macros: Record<string, string>): DomainInfo {
  const macroLines = Object.fromEntries(Object.keys(macros).map((name, i) => [name, i + 5]));
  return { id, file: `content/${id.replace('.', '/')}/_domain.yaml`, macros, macroLines } as unknown as DomainInfo;
}

function check(domains: DomainInfo[]): { file: string; line?: number; message: string }[] {
  const diags = new Diagnostics();
  checkMacroConsistency(domains, diags);
  return diags.errors;
}

describe('同名宏在各领域的定义要一样', () => {
  it('只差空白不算不一样', () => {
    expect(check([domain('math.a', { '\\dd': '\\mathrm{d}\\,' }), domain('math.b', { '\\dd': '  \\mathrm{d}\\,\n' }), domain('math.c', { '\\dd': '\\mathrm{d}\\, ' })])).toEqual([]);
    expect(check([domain('math.a', { '\\T': '^{\\mathsf{T}}' }), domain('math.b', { '\\T': '^{\\mathsf{T}}' }), domain('math.c', { '\\R': '\\mathbb{R}' })])).toEqual([]);
  });

  it('以用得最多的定义为准，只报不一样的领域，指到那一行', () => {
    const errors = check([
      domain('math.a', { '\\R': '\\mathbf{R}' }),
      domain('math.b', { '\\Q': '\\mathbb{Q}', '\\R': '\\mathbb{R}' }),
      domain('math.c', { '\\R': '\\mathbb{R}' }),
    ]);
    expect(errors).toMatchObject([{ file: 'content/math/a/_domain.yaml', line: 5, message: '宏 \\R 在各领域的定义要一样：这里是「\\mathbf{R}」，math.b 等 2 个领域里是「\\mathbb{R}」' }]);
  });

  it('一样多时以领域 id 排在前面的为准', () => {
    const errors = check([domain('physics.y', { '\\vb': '\\boldsymbol{#1}' }), domain('math.x', { '\\vb': '\\mathbf{#1}' })]);
    expect(errors).toMatchObject([{ file: 'content/physics/y/_domain.yaml', line: 5, message: '宏 \\vb 在各领域的定义要一样：这里是「\\boldsymbol{#1}」，math.x 里是「\\mathbf{#1}」' }]);
  });
});

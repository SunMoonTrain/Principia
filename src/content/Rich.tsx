// 把编译好的 hast 渲染成 React 元素；自定义元素换成对应的组件。

import { toJsxRuntime, type Components } from 'hast-util-to-jsx-runtime';
import { useMemo, type ReactNode } from 'react';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import type { Rich as RichValue } from '../../shared/content-types';
import { AnimPlaceholder } from '../components/AnimPlaceholder';
import { ContentLink } from '../components/ContentLink';
import { MathHtml } from '../components/MathHtml';
import { TermRef } from '../components/TermRef';

function Plain({ children }: { children?: ReactNode }) {
  return <span>{children}</span>;
}

const components = {
  'x-math': MathHtml,
  'x-term': TermRef,
  'x-anim': AnimPlaceholder,
  a: ContentLink,
} as unknown as Partial<Components>;

/** 放在链接、目录这类地方时：术语不弹浮窗、链接不嵌套。 */
const inertComponents = {
  'x-math': MathHtml,
  'x-term': Plain,
  'x-anim': () => null,
  a: Plain,
} as unknown as Partial<Components>;

export function Rich({ value, inert = false }: { value: RichValue | null | undefined; inert?: boolean }) {
  return useMemo(
    () =>
      value
        ? toJsxRuntime(value, { Fragment, jsx, jsxs, components: inert ? inertComponents : components, ignoreInvalidStyle: true })
        : null,
    [value, inert],
  );
}

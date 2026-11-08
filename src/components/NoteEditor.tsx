// 思路笔记编辑器的外壳：编辑器连同 KaTeX、Markdown 解析一起按需加载，首页、复习列表不用下载它们。

import { lazy, Suspense } from 'react';
import type { NoteEditorProps } from './NoteEditorImpl';

const NoteEditorImpl = lazy(() => import('./NoteEditorImpl'));

export function NoteEditor(props: NoteEditorProps) {
  return (
    <Suspense fallback={<div className="note note-loading">正在载入笔记…</div>}>
      <NoteEditorImpl {...props} />
    </Suspense>
  );
}

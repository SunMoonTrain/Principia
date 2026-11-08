// 思路笔记：Markdown 编辑框 + 实时预览（公式用 KaTeX）。停止输入约 1 秒自动保存。
// 和 KaTeX 一起按需加载，见 NoteEditor.tsx。

import { useDeferredValue, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Rich } from '../content/Rich';
import { renderNote } from '../notes/renderNote';
import { deleteConflict, editNote, NOTE_MAX_LENGTH, useNote, type NoteConflict, type NoteView } from '../progress/notes';

export interface NoteEditorProps {
  lesson: string;
  problem: string;
  macros: Record<string, string>;
}

function SaveState({ note, empty }: { note: NoteView; empty: boolean }) {
  if (note.error) return <span className="note-state note-state-warn">{note.error}</span>;
  if (note.saving) return <span className="note-state">正在保存…</span>;
  if (note.pending) return <span className={note.offline ? 'note-state note-state-warn' : 'note-state'}>{note.offline ? '没连上，草稿先存在这台设备上' : '还没保存'}</span>;
  return empty ? null : <span className="note-state">已保存</span>;
}

function Conflict({ lesson, problem, conflict }: { lesson: string; problem: string; conflict: NoteConflict }) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="note-conflict" role="alert">
      <p>
        另一台设备同时改过这道题的笔记。上面是另一台设备的版本；你这边写的另存成了 <code>{conflict.file}</code>。对照着把要留的部分合并进上面的笔记，再删掉另存的版本。
      </p>
      <details>
        <summary>看另存的版本</summary>
        <pre className="note-conflict-text">{conflict.text}</pre>
      </details>
      <button
        type="button"
        className="giveup-button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          if (!(await deleteConflict(lesson, problem, conflict.file))) setBusy(false);
        }}
      >
        合并完了，删掉另存的版本
      </button>
    </div>
  );
}

export default function NoteEditorImpl({ lesson, problem, macros }: NoteEditorProps) {
  const note = useNote(lesson, problem);
  const [editing, setEditing] = useState(false);
  const area = useRef<HTMLTextAreaElement>(null);
  // 预览晚一拍算，打字不卡
  const deferred = useDeferredValue(note.text);
  const preview = useMemo(() => renderNote(deferred, macros), [deferred, macros]);
  const empty = note.text.trim() === '';

  // 编辑框跟着内容长高
  useLayoutEffect(() => {
    const el = area.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight + 2}px`;
  }, [note.text, editing]);

  if (!note.loaded) {
    return <div className="note note-loading">{note.offline ? '没连上进度服务，笔记暂时读不到' : '正在读取笔记…'}</div>;
  }

  return (
    <section className="note" aria-label="思路笔记">
      <div className="note-head">
        <span className="note-title">思路笔记</span>
        <SaveState note={note} empty={empty} />
        {(editing || !empty) && (
          <button type="button" className="note-toggle" onClick={() => setEditing(!editing)}>
            {editing ? '收起' : '编辑'}
          </button>
        )}
      </div>
      {editing ? (
        <>
          <textarea
            ref={area}
            className="note-input"
            value={note.text}
            onChange={(e) => editNote(lesson, problem, e.target.value)}
            placeholder={'用 Markdown 写，公式写在 $…$ 里，例如 $\\sup A + \\sup B$；单独成一段的公式写成 $$…$$'}
            spellCheck={false}
            maxLength={NOTE_MAX_LENGTH}
            autoFocus
            aria-label="思路笔记"
          />
          {!empty && (
            <div className="note-preview">
              <div className="note-preview-label">预览</div>
              <div className="note-body">
                <Rich value={preview} />
              </div>
            </div>
          )}
        </>
      ) : empty ? (
        <button type="button" className="hint-button" onClick={() => setEditing(true)}>
          写思路笔记
        </button>
      ) : (
        <div className="note-body note-rendered" onDoubleClick={() => setEditing(true)} title="双击编辑">
          <Rich value={preview} />
        </div>
      )}
      {note.conflicts.map((c) => (
        <Conflict key={c.file} lesson={lesson} problem={problem} conflict={c} />
      ))}
    </section>
  );
}

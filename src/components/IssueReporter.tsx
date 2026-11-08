// 「内容有误」：在小节页里选中一段文字，旁边出现「内容有误」按钮；题目卡片底下也有这个按钮。
// 点了弹出一个小窗，写一句哪里不对（可省略），记进 content/issues.yaml（见 docs/plan.md「题目与判题」）。

import { createContext, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { localTimestamp } from '../../shared/progress';
import { partOf, rangeText } from '../content/selectionText';
import { newId, useProgress } from '../progress/ProgressContext';

export interface IssueTarget {
  part: string;
  quote?: string;
}

const IssueContext = createContext<(target: IssueTarget) => void>(() => undefined);

export function useReportIssue(): (target: IssueTarget) => void {
  return useContext(IssueContext);
}

/** 选区在这些地方时不出按钮：你自己写的笔记、输入框、弹窗。 */
const NOT_CONTENT = '.note, .grade-list, .copy-preview, .issue-dialog, textarea, input';

function SelectionButton({ onReport }: { onReport: (target: IssueTarget) => void }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const range = useRef<Range | null>(null);

  useEffect(() => {
    let timer: number | undefined;
    const update = (): void => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const selection = document.getSelection();
        const active = document.activeElement;
        if (!selection || selection.isCollapsed || selection.rangeCount === 0 || active?.matches('textarea, input')) {
          setPos(null);
          return;
        }
        const r = selection.getRangeAt(0);
        const node = r.commonAncestorContainer;
        const el = node instanceof Element ? node : node.parentElement;
        if (!el?.closest('.lesson') || el.closest(NOT_CONTENT) || !r.toString().trim()) {
          setPos(null);
          return;
        }
        const rect = r.getBoundingClientRect();
        range.current = r.cloneRange();
        setPos({ x: Math.min(Math.max(rect.left + rect.width / 2, 60), window.innerWidth - 60), y: Math.min(rect.bottom + 8, window.innerHeight - 48) });
      }, 150);
    };
    document.addEventListener('selectionchange', update);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('selectionchange', update);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  if (!pos) return null;
  return (
    <button
      type="button"
      className="selection-issue"
      style={{ left: pos.x, top: pos.y }}
      // 按下时不让选区消失
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => {
        const r = range.current;
        if (r) onReport({ part: partOf(r.startContainer), quote: rangeText(r) });
        document.getSelection()?.removeAllRanges();
        setPos(null);
      }}
    >
      内容有误
    </button>
  );
}

function IssueDialog({ target, onSubmit, onCancel }: { target: IssueTarget; onSubmit: (note: string) => void; onCancel: () => void }) {
  const [note, setNote] = useState('');
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel]);
  const submit = (e: FormEvent): void => {
    e.preventDefault();
    onSubmit(note.trim());
  };
  return (
    <div className="dialog-backdrop" onMouseDown={onCancel}>
      <form className="issue-dialog" role="dialog" aria-modal="true" aria-labelledby="issue-dialog-title" onSubmit={submit} onMouseDown={(e) => e.stopPropagation()}>
        <h2 id="issue-dialog-title">标记内容有误</h2>
        <p className="issue-part">位置：{target.part}</p>
        {target.quote && <blockquote className="issue-quote">{target.quote}</blockquote>}
        <label className="issue-label">
          哪里不对（可省略）
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} maxLength={4000} autoFocus />
        </label>
        <p className="issue-hint">记进 content/issues.yaml，写内容 agent 下一批开始前处理。</p>
        <div className="issue-buttons">
          <button type="submit" className="answer-submit">
            记下
          </button>
          <button type="button" className="giveup-button" onClick={onCancel}>
            取消
          </button>
        </div>
      </form>
    </div>
  );
}

/** 包住小节页：提供「标记内容有误」，并在选中文字时显示按钮。 */
export function IssueReporter({ lesson, children }: { lesson: string; children: ReactNode }) {
  const progress = useProgress();
  const [target, setTarget] = useState<IssueTarget | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const submit = (note: string): void => {
    if (!target) return;
    const { part, quote } = target;
    progress.dispatch({
      type: 'issue',
      issue: { id: newId(), at: localTimestamp(), lesson, part, ...(quote ? { quote } : {}), ...(note ? { note } : {}) },
    });
    setTarget(null);
    setToast('已记下，写内容 agent 下一批开始前会处理');
  };

  return (
    <IssueContext.Provider value={setTarget}>
      {children}
      <SelectionButton onReport={setTarget} />
      {target && <IssueDialog target={target} onSubmit={submit} onCancel={() => setTarget(null)} />}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </IssueContext.Provider>
  );
}

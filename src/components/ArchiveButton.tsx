// 顶栏右上角：进度服务的连接状态，和「存档」按钮（把 progress/ 提交到 Git）。

import { useEffect, useState } from 'react';
import { useProgress } from '../progress/ProgressContext';

interface Notice {
  kind: 'ok' | 'info' | 'error';
  text: string;
}

export function ArchiveButton() {
  const progress = useProgress();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), notice.kind === 'error' ? 8000 : 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const archive = async (): Promise<void> => {
    setBusy(true);
    try {
      const result = await progress.archive();
      setNotice(
        result.committed
          ? { kind: 'ok', text: `已存档：${result.message}（${result.commit}）` }
          : { kind: 'info', text: result.message },
      );
    } catch (error) {
      setNotice({ kind: 'error', text: (error as Error).message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="archive">
      {!progress.online && (
        <span className="sync-status sync-offline" title="页面开着时进度服务断了：记录先存在这台设备的浏览器里，连上后自动补交">
          <span className="sync-dot" aria-hidden="true" />
          没连上进度服务{progress.pending ? ` · ${progress.pending} 条待补交` : ''}
        </span>
      )}
      {progress.online && progress.pending > 0 && <span className="sync-status">正在保存…</span>}
      <button type="button" className="archive-button" onClick={() => void archive()} disabled={busy} title="把进度（progress/）提交到 Git">
        {busy ? '存档中…' : '存档'}
      </button>
      {notice && (
        <div className={`archive-notice archive-notice-${notice.kind}`} role="status">
          {notice.text}
        </div>
      )}
    </div>
  );
}

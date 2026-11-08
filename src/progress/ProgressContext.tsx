// 进度：打开网页时从进度服务读（以服务端为准）；每个改动是一条操作，先在本地生效、放进待发送队列，
// 再发给服务。服务连不上时队列存在浏览器里（localStorage），继续做题不受影响，连上后自动补交。

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { applyOp, EMPTY_PROGRESS, isLearned, type ProgressOp, type ProgressState } from '../../shared/progress';
import { flushNotes } from './notes';

const QUEUE_KEY = 'principia.pending-ops';
const RETRY_MS = 3000;
/** 一次发多少条。服务端一批最多收 1000 条，离线攒多了也要分开发。 */
const BATCH = 200;

export interface ArchiveResult {
  committed: boolean;
  message: string;
  commit?: string;
}

interface ProgressValue {
  /** 服务端的进度，加上还没发出去的操作。 */
  state: ProgressState;
  /** 第一次从服务读到进度了。 */
  ready: boolean;
  online: boolean;
  pending: number;
  dispatch(op: ProgressOp): void;
  archive(): Promise<ArchiveResult>;
  isLearned(lessonId: string): boolean;
}

const ProgressContext = createContext<ProgressValue | null>(null);

function loadQueue(): ProgressOp[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as ProgressOp[]) : [];
  } catch {
    return [];
  }
}

function saveQueue(ops: ProgressOp[]): void {
  try {
    if (ops.length) localStorage.setItem(QUEUE_KEY, JSON.stringify(ops));
    else localStorage.removeItem(QUEUE_KEY);
  } catch {
    // 存不了（隐私模式）也不影响这次使用，只是关掉页面后没发出去的会丢
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [server, setServer] = useState<ProgressState>(EMPTY_PROGRESS);
  const [queue, setQueue] = useState<ProgressOp[]>(loadQueue);
  const [ready, setReady] = useState(false);
  const [online, setOnline] = useState(true);
  const queueRef = useRef(queue);
  const flushing = useRef<Promise<boolean> | null>(null);
  const retryTimer = useRef<number | undefined>(undefined);

  const setQueueBoth = (ops: ProgressOp[]): void => {
    queueRef.current = ops;
    saveQueue(ops);
    setQueue(ops);
  };

  const load = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/progress', { cache: 'no-store' });
      if (!res.ok) throw new Error(String(res.status));
      setServer((await res.json()) as ProgressState);
      setReady(true);
      setOnline(true);
      return true;
    } catch {
      setOnline(false);
      return false;
    }
  }, []);

  /** 把队列里的操作发给服务；成功返回 true。同一时间只发一批。 */
  const flush = useCallback((): Promise<boolean> => {
    if (flushing.current) return flushing.current;
    const run = async (): Promise<boolean> => {
      while (queueRef.current.length) {
        const batch = queueRef.current.slice(0, BATCH);
        try {
          const res = await fetch('/api/progress/ops', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ops: batch }),
          });
          // 400 是这批请求本身有问题，重发也没用，丢掉免得堵住后面的
          if (!res.ok && res.status !== 400) throw new Error(String(res.status));
          // 服务端逐条校验，格式不对的几条会丢掉（rejected 是它们在这批里的位置）
          const rejected = new Set(res.ok ? (((await res.json()) as { rejected?: number[] }).rejected ?? []) : batch.map((_, i) => i));
          const stored = batch.filter((_, i) => !rejected.has(i));
          setServer((s) => stored.reduce(applyOp, s));
          setQueueBoth(queueRef.current.slice(batch.length));
          setOnline(true);
        } catch {
          setOnline(false);
          window.clearTimeout(retryTimer.current);
          retryTimer.current = window.setTimeout(() => void flush(), RETRY_MS);
          return false;
        }
      }
      return true;
    };
    flushing.current = run().finally(() => {
      flushing.current = null;
    });
    return flushing.current;
  }, []);

  // 打开网页：先读服务端，再把上次没发出去的补交
  useEffect(() => {
    let stopped = false;
    const start = async (): Promise<void> => {
      if (await load()) {
        void flush();
        // 上次关页面前没保存上的笔记草稿
        void flushNotes();
      } else if (!stopped) window.setTimeout(() => void start(), RETRY_MS);
    };
    void start();
    return () => {
      stopped = true;
    };
  }, [load, flush]);

  // 回到这个页面时（比如在另一台设备上做了题），没有待发的就重新读一遍
  useEffect(() => {
    const refresh = (): void => {
      if (document.visibilityState !== 'visible') return;
      if (queueRef.current.length) void flush();
      else void load();
    };
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('online', refresh);
    return () => {
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('online', refresh);
    };
  }, [load, flush]);

  const dispatch = useCallback(
    (op: ProgressOp): void => {
      setQueueBoth([...queueRef.current, op]);
      void flush();
    },
    [flush],
  );

  const archive = useCallback(async (): Promise<ArchiveResult> => {
    // 存档要带上最新的记录和笔记：先把没发出去的都保存上
    if (!(await flush()) || !(await flushNotes())) throw new Error('还有记录或笔记没保存上（连不上进度服务？），等保存上再存档');
    const res = await fetch('/api/archive', { method: 'POST' });
    const body = (await res.json()) as ArchiveResult & { error?: string };
    if (!res.ok) throw new Error(body.error ?? `存档失败（HTTP ${res.status}）`);
    return body;
  }, [flush]);

  const state = useMemo(() => queue.reduce(applyOp, server), [server, queue]);
  const value = useMemo<ProgressValue>(
    () => ({
      state,
      ready,
      online,
      pending: queue.length,
      dispatch,
      archive,
      isLearned: (lessonId) => isLearned(state.lessons[lessonId]),
    }),
    [state, ready, online, queue.length, dispatch, archive],
  );
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressValue {
  const value = useContext(ProgressContext);
  if (!value) throw new Error('useProgress 要放在 ProgressProvider 里面用');
  return value;
}

/** 局域网地址不是安全上下文，没有 crypto.randomUUID，退一步自己拼。 */
export function newId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

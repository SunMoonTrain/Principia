// 读取内容编译器的输出（/data/graph.json 和各领域内容包）。开发模式下内容重编后自动刷新。

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { DomainPack, Graph, GraphDomain, GraphLesson } from '../../shared/content-types';

interface ContentValue {
  graph: Graph | null;
  error: string | null;
  lessons: Map<string, GraphLesson>;
  domains: Map<string, GraphDomain>;
  loadPack(domain: GraphDomain): Promise<DomainPack>;
}

const ContentContext = createContext<ContentValue | null>(null);

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`读取 ${url} 失败（HTTP ${res.status}）`);
  return (await res.json()) as T;
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [graph, setGraph] = useState<Graph | null>(null);
  const [error, setError] = useState<string | null>(null);
  // 内容包地址里带内容哈希，内容变了地址就变，所以按地址缓存即可。
  const packs = useRef(new Map<string, Promise<DomainPack>>());

  const loadGraph = useCallback(async () => {
    try {
      setGraph(await fetchJson<Graph>('/data/graph.json'));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  useEffect(() => {
    void loadGraph();
  }, [loadGraph]);

  useEffect(() => {
    const hot = import.meta.hot;
    if (!hot) return;
    const onUpdate = (): void => void loadGraph();
    hot.on('principia:content', onUpdate);
    return () => hot.off('principia:content', onUpdate);
  }, [loadGraph]);

  const loadPack = useCallback((domain: GraphDomain): Promise<DomainPack> => {
    const url = `/data/${domain.pack}`;
    let pending = packs.current.get(url);
    if (!pending) {
      pending = fetchJson<DomainPack>(url);
      pending.catch(() => packs.current.delete(url));
      packs.current.set(url, pending);
    }
    return pending;
  }, []);

  const value = useMemo<ContentValue>(
    () => ({
      graph,
      error,
      lessons: new Map((graph?.lessons ?? []).map((l) => [l.id, l])),
      domains: new Map((graph?.domains ?? []).map((d) => [d.id, d])),
      loadPack,
    }),
    [graph, error, loadPack],
  );
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(): ContentValue {
  const value = useContext(ContentContext);
  if (!value) throw new Error('useContent 要放在 ContentProvider 里面用');
  return value;
}

/** 某个领域的内容包；地址变了（内容重编）会重新读取。 */
export function useDomainPack(domainId: string | undefined): { pack: DomainPack | null; error: string | null } {
  const { domains, loadPack } = useContent();
  const domain = domainId ? domains.get(domainId) : undefined;
  const [state, setState] = useState<{ url: string; pack: DomainPack | null; error: string | null } | null>(null);

  useEffect(() => {
    if (!domain) return;
    let cancelled = false;
    loadPack(domain).then(
      (pack) => !cancelled && setState({ url: domain.pack, pack, error: null }),
      (e: unknown) => !cancelled && setState({ url: domain.pack, pack: null, error: e instanceof Error ? e.message : String(e) }),
    );
    return () => {
      cancelled = true;
    };
  }, [domain, loadPack]);

  if (!domain || !state) return { pack: null, error: null };
  // 内容包更新后、新包读回来之前，先继续显示旧的
  return { pack: state.pack, error: state.url === domain.pack ? state.error : null };
}

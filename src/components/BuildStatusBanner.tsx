// 开发模式下内容构建失败时的提示条（Vite 的错误浮层可以关掉，这条一直留着直到修好）。

import { useEffect, useState } from 'react';

export function BuildStatusBanner() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const hot = import.meta.hot;
    if (!hot) return;
    const onError = (payload: { err: { plugin?: string; message: string } }): void => {
      if (payload.err.plugin === 'principia-content') setMessage(payload.err.message);
    };
    const onOk = (): void => {
      setMessage(null);
      // 修好之后把 Vite 的错误浮层也关掉
      document.querySelectorAll('vite-error-overlay').forEach((el) => el.remove());
    };
    hot.on('vite:error', onError);
    hot.on('principia:content', onOk);
    return () => {
      hot.off('vite:error', onError);
      hot.off('principia:content', onOk);
    };
  }, []);

  if (!message) return null;
  return (
    <div className="build-banner" role="alert">
      <strong>内容构建失败</strong>，页面上显示的是上一次通过的版本。
      <details>
        <summary>看错误</summary>
        <pre>{message}</pre>
      </details>
    </div>
  );
}

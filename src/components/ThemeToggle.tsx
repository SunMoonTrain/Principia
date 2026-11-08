// 亮色 / 暗色主题：默认跟随系统，可以手动切换。偏好只存在这台设备的浏览器里（不算进度）。

import { useEffect, useState } from 'react';

type Pref = 'system' | 'light' | 'dark';
const KEY = 'principia.theme';
const ORDER: Pref[] = ['system', 'light', 'dark'];
const LABELS: Record<Pref, string> = { system: '跟随系统', light: '亮色', dark: '暗色' };

function readPref(): Pref {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : 'system';
  } catch {
    return 'system';
  }
}

export function ThemeToggle() {
  const [pref, setPref] = useState<Pref>(readPref);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = (): void => {
      const dark = pref === 'dark' || (pref === 'system' && media.matches);
      document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    };
    apply();
    try {
      if (pref === 'system') localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, pref);
    } catch {
      // 隐私模式下存不了，不影响使用
    }
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [pref]);

  const next = ORDER[(ORDER.indexOf(pref) + 1) % ORDER.length];
  return (
    <button type="button" className="theme-toggle" onClick={() => setPref(next)} title={`主题：${LABELS[pref]}（点一下换成${LABELS[next]}）`}>
      <span className={`theme-icon theme-icon-${pref}`} aria-hidden="true" />
      {LABELS[pref]}
    </button>
  );
}

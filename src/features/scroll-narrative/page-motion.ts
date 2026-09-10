import { clampProgress, observeProgress } from './observe-progress';

export function mountPageMotion(): () => void {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let cleanups: Array<() => void> = [];
  const clear = () => {
    cleanups.forEach((cleanup) => cleanup());
    cleanups = [];
    document.querySelectorAll<HTMLElement>('[data-motion]').forEach((scene) => {
      scene.style.removeProperty('--progress');
    });
  };
  const start = () => {
    clear();
    if (preference.matches) return;
    document.querySelectorAll<HTMLElement>('[data-motion]').forEach((scene) => {
      cleanups.push(
        observeProgress(scene, ({ top, height, viewport }) => {
          const progress =
            scene.dataset.motion === 'hero'
              ? clampProgress(-top / Math.min(height, viewport))
              : clampProgress((viewport - top) / (viewport * 0.85));
          scene.style.setProperty('--progress', progress.toFixed(4));
        }),
      );
    });
  };
  start();
  preference.addEventListener('change', start);
  const onPageShow = () => start();
  window.addEventListener('pageshow', onPageShow);
  const destroy = () => {
    clear();
    preference.removeEventListener('change', start);
    window.removeEventListener('pageshow', onPageShow);
    window.removeEventListener('pagehide', clear);
  };
  window.addEventListener('pagehide', clear);
  return destroy;
}

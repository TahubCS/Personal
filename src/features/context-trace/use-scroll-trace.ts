import { useEffect, useRef, type Dispatch, type RefObject } from 'react';
import {
  observeProgress,
  clampProgress,
} from '../scroll-narrative/observe-progress';
import type { TraceAction } from './trace-state';

export function useScrollTrace(
  root: RefObject<HTMLDivElement | null>,
  dispatch: Dispatch<TraceAction>,
  reducedMotion: boolean,
): RefObject<number> {
  const progress = useRef(0);
  useEffect(() => {
    const element = root.current;
    const runway = element?.closest<HTMLElement>('.trace-runway');
    if (!element || !runway || reducedMotion) return;
    const desktop = matchMedia('(min-width: 1100px) and (min-height: 800px)');
    const measure = () => {
      const fits = element.offsetHeight < innerHeight - 125;
      runway.dataset.fits = String(fits);
    };
    const resize = new ResizeObserver(measure);
    resize.observe(element);
    measure();
    const cleanup = observeProgress(runway, ({ top, height }) => {
      // Smaller screens keep the explicit, vertical manual narrative.
      if (!desktop.matches || runway.dataset.fits !== 'true') return;
      progress.current = clampProgress(
        (100 - top) / Math.max(1, height - element.offsetHeight),
      );
      dispatch({ type: 'scroll', progress: progress.current });
    });
    window.addEventListener('resize', measure);
    return () => {
      cleanup();
      resize.disconnect();
      window.removeEventListener('resize', measure);
      delete runway.dataset.fits;
    };
  }, [root, dispatch, reducedMotion]);
  return progress;
}

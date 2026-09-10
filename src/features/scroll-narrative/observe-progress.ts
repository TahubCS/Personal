export interface ScrollFrame {
  readonly top: number;
  readonly height: number;
  readonly viewport: number;
}

/** One scheduled frame per scroll event; no work while hidden or offscreen. */
export function observeProgress(
  element: HTMLElement,
  render: (frame: ScrollFrame) => void,
): () => void {
  let frame = 0;
  let active = false;
  let disposed = false;
  const update = () => {
    frame = 0;
    if (disposed || document.hidden || !active) return;
    const bounds = element.getBoundingClientRect();
    render({ top: bounds.top, height: bounds.height, viewport: innerHeight });
  };
  const schedule = () => {
    if (!frame && !disposed && !document.hidden && active)
      frame = requestAnimationFrame(update);
  };
  const intersection = new IntersectionObserver(
    ([entry]) => {
      active = entry?.isIntersecting ?? false;
      schedule();
    },
    { rootMargin: '100% 0px' },
  );
  const resize = new ResizeObserver(schedule);
  intersection.observe(element);
  resize.observe(element);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  document.addEventListener('visibilitychange', schedule);
  // Font metrics can move section boundaries after the first paint.
  void document.fonts.ready.then(schedule);
  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    intersection.disconnect();
    resize.disconnect();
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    document.removeEventListener('visibilitychange', schedule);
  };
}

export function clampProgress(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
}

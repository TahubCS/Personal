/** End before the lab's paper phase, leaving the last 13% for an exposed hold. */
export function openingProgress(
  scroll: number,
  start: number,
  distance: number,
): number {
  if (![scroll, start, distance].every(Number.isFinite) || distance <= 0)
    return 0;
  return Math.max(0, Math.min(1, (scroll - start) / distance)) * 0.6;
}

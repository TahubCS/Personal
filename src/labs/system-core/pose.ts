export interface CorePose {
  readonly rotation: readonly [number, number, number];
  readonly separation: readonly number[];
  readonly paper: number;
  readonly scale: number;
  readonly exposure: number;
}

export function normalizedProgress(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
}

function easeBetween(progress: number, start: number, end: number): number {
  const t = normalizedProgress((progress - start) / (end - start));
  return t * t * (3 - 2 * t);
}

/** Every pose is a pure function of position, including reverse and fast scroll. */
export function corePose(
  progress: number,
  layout: 'wide' | 'narrow' = 'wide',
): CorePose {
  const p = normalizedProgress(progress);
  const turn = easeBetween(p, 0.02, 0.22);
  const settle = easeBetween(p, 0.61, 0.88);
  return {
    rotation: [
      0.08 + turn * (layout === 'narrow' ? 0.87 : 0.37),
      -0.12 - turn * (layout === 'narrow' ? 0.63 : 0.83),
      -0.06 + turn * (layout === 'narrow' ? 0.14 : -0.16) + settle * 0.1,
    ],
    separation: [
      // Cover first, ceramic frame second, then the rear enclosure and routing.
      // All components settle by 52%; the paper boundary starts at 61%.
      -4.2 * easeBetween(p, 0.3, 0.5),
      -1.6 * easeBetween(p, 0.34, 0.52),
      0,
      2.25 * easeBetween(p, 0.27, 0.43),
      5.5 * easeBetween(p, 0.18, 0.35),
    ],
    paper: easeBetween(p, 0.61, 0.88),
    exposure: easeBetween(p, 0.22, 0.48),
    scale: 1 + 0.08 * easeBetween(p, 0, 0.2) - 0.19 * easeBetween(p, 0.2, 0.52),
  };
}

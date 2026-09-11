export interface CorePose {
  readonly rotation: readonly [number, number, number];
  readonly separation: readonly number[];
  readonly paper: number;
  readonly scale: number;
}

export function normalizedProgress(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
}

function easeBetween(progress: number, start: number, end: number): number {
  const t = normalizedProgress((progress - start) / (end - start));
  return t * t * (3 - 2 * t);
}

/** Every pose is a pure function of position, including reverse and fast scroll. */
export function corePose(progress: number): CorePose {
  const p = normalizedProgress(progress);
  const turn = easeBetween(p, 0.02, 0.42);
  const settle = easeBetween(p, 0.62, 1);
  return {
    rotation: [
      0.08 + turn * 0.5,
      -0.12 - turn * 0.72,
      -0.06 - turn * 0.22 + settle * 0.1,
    ],
    separation: [
      -1.5 * easeBetween(p, 0.3, 0.7),
      -0.65 * easeBetween(p, 0.35, 0.75),
      0,
      1.1 * easeBetween(p, 0.28, 0.68),
      2.4 * easeBetween(p, 0.24, 0.64),
    ],
    paper: easeBetween(p, 0.61, 0.91),
    scale:
      1 + 0.08 * easeBetween(p, 0, 0.25) - 0.19 * easeBetween(p, 0.3, 0.78),
  };
}

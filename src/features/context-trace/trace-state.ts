export type Outcome = 'success' | 'invalid-key' | 'empty';
export type TraceState = {
  source: 'scroll' | 'manual';
  step: number;
  status: 'ready' | 'playing' | 'paused' | 'complete';
  outcome: Outcome;
};

export type TraceAction =
  | { type: 'scroll'; progress: number }
  | { type: 'follow-scroll'; progress: number }
  | { type: 'play'; reducedMotion: boolean }
  | { type: 'pause' }
  | { type: 'tick' }
  | { type: 'select'; step: number }
  | { type: 'restart' }
  | { type: 'outcome'; outcome: Outcome };

export const initialState: TraceState = {
  source: 'scroll',
  step: 0,
  status: 'ready',
  outcome: 'success',
};

export function lastStep(outcome: Outcome): number {
  return outcome === 'invalid-key' ? 2 : 5;
}

export function traceReducer(
  state: TraceState,
  action: TraceAction,
): TraceState {
  const last = lastStep(state.outcome);
  switch (action.type) {
    case 'scroll':
    case 'follow-scroll': {
      if (action.type === 'scroll' && state.source !== 'scroll') return state;
      if (!Number.isFinite(action.progress)) return state;
      const step = Math.min(last, Math.max(0, Math.floor(action.progress * 6)));
      if (step === state.step && state.source === 'scroll') return state;
      return {
        ...state,
        source: 'scroll',
        step,
        status: step === last ? 'complete' : step === 0 ? 'ready' : 'paused',
      };
    }
    case 'outcome':
      return { ...initialState, source: 'manual', outcome: action.outcome };
    case 'restart':
      return { ...initialState, source: 'manual', outcome: state.outcome };
    case 'pause':
      return state.status === 'playing'
        ? { ...state, status: 'paused' }
        : state;
    case 'select': {
      if (!Number.isFinite(action.step)) return state;
      const step = Math.max(0, Math.min(last, Math.trunc(action.step)));
      return {
        ...state,
        source: 'manual',
        step,
        status: step === last ? 'complete' : step === 0 ? 'ready' : 'paused',
      };
    }
    case 'play': {
      const step = state.step === last ? 1 : Math.max(1, state.step);
      return {
        ...state,
        source: 'manual',
        step,
        status: action.reducedMotion ? 'paused' : 'playing',
      };
    }
    case 'tick':
      if (state.status !== 'playing') return state;
      return {
        ...state,
        step: Math.min(last, state.step + 1),
        status: state.step + 1 >= last ? 'complete' : 'playing',
      };
  }
}

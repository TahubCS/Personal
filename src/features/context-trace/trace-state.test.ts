import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initialState, traceReducer } from './trace-state.ts';

test('playback reaches a terminal state and never loops', () => {
  let state = traceReducer(initialState, {
    type: 'play',
    reducedMotion: false,
  });
  for (let i = 0; i < 12; i++) state = traceReducer(state, { type: 'tick' });
  assert.equal(state.step, 5);
  assert.equal(state.status, 'complete');
});
test('invalid credentials stop before embeddings and changing outcome resets playback', () => {
  let state = traceReducer(initialState, {
    type: 'outcome',
    outcome: 'invalid-key',
  });
  state = traceReducer(state, { type: 'play', reducedMotion: false });
  state = traceReducer(state, { type: 'tick' });
  assert.equal(state.step, 2);
  assert.equal(state.status, 'complete');
  assert.deepEqual(traceReducer(state, { type: 'outcome', outcome: 'empty' }), {
    ...initialState,
    outcome: 'empty',
  });
});
test('pause preserves position and reduced motion never starts playback', () => {
  const playing = traceReducer(initialState, {
    type: 'play',
    reducedMotion: false,
  });
  const paused = traceReducer(playing, { type: 'pause' });
  assert.deepEqual(traceReducer(paused, { type: 'tick' }), paused);
  assert.equal(
    traceReducer(initialState, { type: 'play', reducedMotion: true }).status,
    'paused',
  );
});
test('direct navigation is bounded by the selected outcome', () => {
  assert.equal(
    traceReducer(initialState, { type: 'select', step: -5 }).step,
    0,
  );
  assert.equal(
    traceReducer(
      { ...initialState, outcome: 'invalid-key' },
      { type: 'select', step: 99 },
    ).step,
    2,
  );
});

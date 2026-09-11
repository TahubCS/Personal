import assert from 'node:assert/strict';
import test from 'node:test';
import { corePose, normalizedProgress } from './pose.ts';

test('scroll inputs stay bounded, including invalid browser measurements', () => {
  assert.equal(normalizedProgress(Number.NaN), 0);
  assert.deepEqual(corePose(-10), corePose(0));
  assert.deepEqual(corePose(10), corePose(1));
});

test('the assembly opens along a shared axis without exchanging layer order', () => {
  for (let step = 0; step <= 100; step++) {
    const { separation, paper } = corePose(step / 100);
    assert.ok(
      separation.every(
        (value, i) => i === 0 || value >= (separation[i - 1] ?? value),
      ),
    );
    assert.ok(paper >= 0 && paper <= 1);
  }
  assert.equal(corePose(0).paper, 0);
  assert.equal(corePose(1).paper, 1);
});

test('interrupted and reverse journeys return exactly the same pose', () => {
  const middle = corePose(0.5);
  for (const p of [1, 0.1, 0.9, 0, 0.5]) corePose(p);
  assert.deepEqual(corePose(0.5), middle);
  assert.ok(corePose(0.5).separation.some((value) => Math.abs(value) > 0.5));
});

test('the assembled pose is shared across layouts and remains unlit by the reveal fill', () => {
  assert.deepEqual(corePose(0), corePose(0, 'narrow'));
  assert.deepEqual(corePose(0).rotation, [0.08, -0.12, -0.06]);
  assert.deepEqual(
    corePose(0).separation.map((value) => value || 0),
    [0, 0, 0, 0, 0],
  );
  assert.equal(corePose(0).exposure, 0);
});

test('the opened pose holds still before the unchanged paper transition', () => {
  for (const layout of ['wide', 'narrow'] as const) {
    assert.deepEqual(corePose(0.52, layout), corePose(0.6, layout));
    assert.equal(corePose(0.61, layout).paper, 0);
    assert.equal(corePose(0.91, layout).paper, 1);
  }
});

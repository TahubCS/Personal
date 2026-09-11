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

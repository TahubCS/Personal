import assert from 'node:assert/strict';
import test from 'node:test';
import { openingProgress } from './progress.ts';
import { corePose } from '../../labs/system-core/pose.ts';

test('opening is bounded and never reaches the paper transition', () => {
  assert.equal(openingProgress(-100, 50, 540), 0);
  assert.equal(openingProgress(2000, 50, 540), 0.6);
  for (let scroll = 0; scroll <= 1000; scroll += 10) {
    assert.equal(corePose(openingProgress(scroll, 50, 540)).paper, 0);
  }
  assert.equal(openingProgress(NaN, 0, 540), 0);
  assert.equal(openingProgress(100, 0, 0), 0);
});

test('the final scroll interval holds the exposed pose and reverse restores it', () => {
  const poseAt = (scroll: number) => corePose(openingProgress(scroll, 50, 540));
  assert.deepEqual(poseAt(550), poseAt(590));
  const middle = poseAt(300);
  poseAt(590);
  poseAt(50);
  assert.deepEqual(poseAt(300), middle);
});

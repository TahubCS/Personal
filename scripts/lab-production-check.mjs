import assert from 'node:assert/strict';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const assets = [];
for (const name of await readdir('dist/_astro')) {
  const content = await readFile(`dist/_astro/${name}`);
  assets.push({
    name,
    bytes: content.length,
    hash: createHash('sha256').update(content).digest('hex'),
  });
}
if (process.argv.includes('--baseline')) {
  await writeFile(
    'artifacts/motion-lab/production-baseline.json',
    JSON.stringify(assets, null, 2),
  );
  console.log('Saved production asset baseline');
} else {
  const baseline = JSON.parse(
    await readFile('artifacts/motion-lab/production-baseline.json', 'utf8'),
  );
  assert.deepEqual(assets, baseline, 'Production assets changed');
  const files = await readdir('dist', { recursive: true });
  assert.ok(
    files.every(
      (name) => !name.includes('motion-lab') && !name.includes('system-core'),
    ),
  );
  console.log(
    `Production assets unchanged: ${assets.length} files, ${assets.reduce((total, asset) => total + asset.bytes, 0)} bytes. No prototype route emitted.`,
  );
  await writeFile(
    'artifacts/motion-lab/production-check.json',
    JSON.stringify(
      { assetsUnchanged: true, routeAbsent: true, assets },
      null,
      2,
    ),
  );
}

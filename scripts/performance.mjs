import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import path from 'node:path';

const chrome = await launch({
  chromePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  chromeFlags: ['--headless', '--no-first-run'],
});
const runs = [];
try {
  for (let run = 1; run <= 3; run++) {
    const result = await lighthouse('http://127.0.0.1:4322/', {
      port: chrome.port,
      output: 'html',
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      formFactor: 'mobile',
      throttlingMethod: 'simulate',
      throttling: {
        rttMs: 150,
        throughputKbps: 1638.4,
        cpuSlowdownMultiplier: 4,
        requestLatencyMs: 562.5,
        downloadThroughputKbps: 1474.56,
        uploadThroughputKbps: 675,
      },
    });
    const lhr = result.lhr;
    const metrics = {
      run,
      scores: Object.fromEntries(
        Object.entries(lhr.categories).map(([key, value]) => [
          key,
          Math.round(value.score * 100),
        ]),
      ),
      lcpMs: lhr.audits['largest-contentful-paint'].numericValue,
      cls: lhr.audits['cumulative-layout-shift'].numericValue,
      tbtMs: lhr.audits['total-blocking-time'].numericValue,
      transferBytes: lhr.audits['total-byte-weight'].numericValue,
    };
    runs.push(metrics);
    await writeFile(`artifacts/lighthouse-mobile-${run}.html`, result.report);
    await writeFile(
      `artifacts/lighthouse-mobile-${run}.json`,
      JSON.stringify(lhr),
    );
    console.log(JSON.stringify(metrics));
  }
} finally {
  try {
    chrome.kill();
  } catch (error) {
    console.warn(
      'Lighthouse reports were saved; temporary browser profile cleanup failed:',
      String(error),
    );
    await writeFile('artifacts/lighthouse-cleanup-warning.txt', String(error));
  }
}

async function inventory(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const output = [];
  for (const entry of entries) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...(await inventory(filename)));
    else {
      const buffer = await readFile(filename);
      output.push({
        file: filename,
        bytes: buffer.length,
        gzipBytes: gzipSync(buffer).length,
      });
    }
  }
  return output;
}
const files = await inventory('dist');
await writeFile(
  'artifacts/performance.json',
  JSON.stringify(
    {
      conditions:
        'Production preview, simulated mobile, 150ms RTT, 1.6Mbps, 4x CPU; three cold-navigation Lighthouse runs. Gzip sizes are calculated, not assumed server encoding.',
      runs,
      files,
    },
    null,
    2,
  ),
);

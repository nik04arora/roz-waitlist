import { copyFile, cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { injectGoogleAnalytics } from './google-analytics.mjs';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');

await mkdir(dist, { recursive: true });

for (const directory of ['about', 'legal', 'assets']) {
  await cp(resolve(root, directory), resolve(dist, directory), {
    recursive: true,
    force: true,
    filter: (source) => !source.endsWith('.DS_Store')
  });
}

await copyFile(resolve(root, 'robots.txt'), resolve(dist, 'robots.txt'));

const legacyPages = [
  'index.html',
  'about/index.html',
  'legal/privacy-policy.html',
  'legal/cookie-policy.html',
  'legal/terms.html',
  'legal/disclosures.html'
];

for (const page of legacyPages) {
  const html = await readFile(resolve(root, page), 'utf8');
  await writeFile(resolve(dist, page), injectGoogleAnalytics(html));
}

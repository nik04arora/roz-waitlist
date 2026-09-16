import { copyFile, cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { optimizeHomepageHtml } from './optimize-homepage.mjs';

const root = resolve(import.meta.dirname, '..');
const target = resolve(root, 'static');

await mkdir(target, { recursive: true });

for (const directory of ['about', 'legal', 'assets']) {
  await cp(resolve(root, directory), resolve(target, directory), {
    recursive: true,
    force: true,
    filter: (source) => !source.endsWith('.DS_Store')
  });
}

for (const file of ['robots.txt', 'sitemap.xml']) {
  await copyFile(resolve(root, file), resolve(target, file));
}

await writeFile(resolve(target, 'index.html'), optimizeHomepageHtml(
  await readFile(resolve(root, 'index.html'), 'utf8'),
  await readFile(resolve(root, 'assets/css/home.min.css'), 'utf8')
));

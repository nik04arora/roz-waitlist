import { copyFile, cp, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

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

for (const file of ['index.html', 'robots.txt', 'sitemap.xml']) {
  await copyFile(resolve(root, file), resolve(target, file));
}

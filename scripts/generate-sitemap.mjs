import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const dist = resolve(import.meta.dirname, '..', 'dist');

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith('.html') ? [path] : [];
  }));
  return files.flat();
}

function attr(html, element, attribute, value) {
  const pattern = new RegExp(`<${element}[^>]*${attribute}=["']${value}["'][^>]*>`, 'i');
  return html.match(pattern)?.[0];
}

function contentValue(tag) {
  return tag?.match(/content=["']([^"']+)["']/i)?.[1];
}

function escapeXml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

const urls = [];
for (const file of await htmlFiles(dist)) {
  const html = await readFile(file, 'utf8');
  const canonicalTag = attr(html, 'link', 'rel', 'canonical');
  const canonical = canonicalTag?.match(/href=["']([^"']+)["']/i)?.[1];
  const robots = contentValue(attr(html, 'meta', 'name', 'robots')) || '';
  if (!canonical || /noindex/i.test(robots)) continue;

  const modified = contentValue(attr(html, 'meta', 'property', 'article:modified_time'));
  urls.push({ canonical, modified });
}

urls.sort((a, b) => a.canonical.localeCompare(b.canonical));

const body = urls.map(({ canonical, modified }) => {
  const lastmod = modified ? `<lastmod>${escapeXml(modified.slice(0, 10))}</lastmod>` : '';
  return `  <url><loc>${escapeXml(canonical)}</loc>${lastmod}</url>`;
}).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
await writeFile(resolve(dist, 'sitemap.xml'), sitemap);

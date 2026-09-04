import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { GOOGLE_ANALYTICS_ID, injectGoogleAnalytics } from './google-analytics.mjs';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const includeDrafts = process.env.INCLUDE_DRAFTS === 'true' || process.env.VERCEL_ENV === 'preview';

const requiredFiles = [
  'index.html',
  'about/index.html',
  'legal/privacy-policy.html',
  'legal/cookie-policy.html',
  'legal/terms.html',
  'legal/disclosures.html',
  'learn/index.html',
  'robots.txt',
  'sitemap.xml'
];

for (const file of requiredFiles) await access(resolve(dist, file));
await access(resolve(root, 'api/waitlist.js'));

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const values = await Promise.all(entries.map(async (entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith('.html') ? [path] : [];
  }));
  return values.flat();
}

const homepageSource = await readFile(resolve(root, 'index.html'), 'utf8');
const homepageBuilt = await readFile(resolve(dist, 'index.html'), 'utf8');
const learnLink = '<a href="/learn/">Learn</a>';
if (!homepageBuilt.includes(learnLink)) throw new Error('Built homepage is missing the Learn link.');
if (homepageBuilt !== injectGoogleAnalytics(homepageSource)) {
  throw new Error('Built homepage differs from its source by more than the expected analytics tag.');
}

for (const path of ['about/index.html', 'legal/privacy-policy.html', 'legal/cookie-policy.html', 'legal/terms.html', 'legal/disclosures.html']) {
  const [source, built] = await Promise.all([
    readFile(resolve(root, path), 'utf8'),
    readFile(resolve(dist, path), 'utf8')
  ]);
  if (injectGoogleAnalytics(source) !== built) throw new Error(`Legacy route changed unexpectedly during build: ${path}`);
}

const sitemap = await readFile(resolve(dist, 'sitemap.xml'), 'utf8');
const canonicals = new Set();
const checkedFiles = await htmlFiles(dist);

async function localTargetExists(href, sourceFile) {
  const pathname = href.split('#')[0].split('?')[0];
  if (!pathname || pathname === '/') {
    await access(resolve(dist, 'index.html'));
    return;
  }

  const clean = pathname.replace(/^\//, '');
  const base = pathname.startsWith('/') ? dist : dirname(sourceFile);
  const candidates = pathname.endsWith('/')
    ? [resolve(base, clean, 'index.html')]
    : [resolve(base, clean), resolve(base, `${clean}.html`), resolve(base, clean, 'index.html')];

  for (const candidate of candidates) {
    try {
      await access(candidate);
      return;
    } catch {}
  }
  throw new Error(`Broken internal link: ${href}`);
}

for (const file of checkedFiles) {
  if (file.includes('/assets/')) continue;
  const html = await readFile(file, 'utf8');
  const analyticsLoader = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`;
  const loaderCount = html.split(analyticsLoader).length - 1;
  const configCount = html.split(`gtag('config', '${GOOGLE_ANALYTICS_ID}')`).length - 1;
  if (loaderCount !== 1 || configCount !== 1) {
    throw new Error(`Expected exactly one Google Analytics tag in ${file}`);
  }
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1];
  const description = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i)?.[1]
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i)?.[1];
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1]
    || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1];
  if (!title || !description || !canonical) throw new Error(`Missing SEO metadata: ${file}`);
  if (canonicals.has(canonical)) throw new Error(`Duplicate canonical: ${canonical}`);
  canonicals.add(canonical);

  const noindex = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)
    || /<meta[^>]+content=["'][^"']*noindex[^"']*["'][^>]+name=["']robots["']/i.test(html);
  if (!noindex && !sitemap.includes(`<loc>${canonical}</loc>`)) {
    throw new Error(`Indexable page missing from sitemap: ${canonical}`);
  }
  if (noindex && sitemap.includes(`<loc>${canonical}</loc>`)) {
    throw new Error(`Noindex page must not appear in sitemap: ${canonical}`);
  }

  const isLearnArticle = /^https:\/\/www\.rozinvest\.com\/learn\/(?!authors\/|topics\/$|topics\/|$)[^/]+\/$/.test(canonical);
  if (isLearnArticle && !html.includes('"@type":"BlogPosting"')) {
    throw new Error(`BlogPosting JSON-LD is missing: ${canonical}`);
  }

  const hrefs = [...html.matchAll(/href=["']([^"']+)["']/gi)].map((match) => match[1]);
  for (const href of hrefs) {
    if (/^(https?:|mailto:|tel:|javascript:|#)/i.test(href)) continue;
    if (href.startsWith('/api/')) continue;
    await localTargetExists(href, file);
  }
}

console.log(`Validated ${canonicals.size} canonical pages (${includeDrafts ? 'preview with drafts' : 'production'}).`);

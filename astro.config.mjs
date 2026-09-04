import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { injectGoogleAnalytics } from './scripts/google-analytics.mjs';

function legacyDevRoutes() {
  const routeFiles = new Map([
    ['/', 'index.html'],
    ['/index.html', 'index.html'],
    ['/about', 'about/index.html'],
    ['/about/', 'about/index.html'],
    ['/legal/privacy-policy', 'legal/privacy-policy.html'],
    ['/legal/privacy-policy.html', 'legal/privacy-policy.html'],
    ['/legal/cookie-policy', 'legal/cookie-policy.html'],
    ['/legal/cookie-policy.html', 'legal/cookie-policy.html'],
    ['/legal/terms', 'legal/terms.html'],
    ['/legal/terms.html', 'legal/terms.html'],
    ['/legal/disclosures', 'legal/disclosures.html'],
    ['/legal/disclosures.html', 'legal/disclosures.html']
  ]);

  return {
    name: 'roz-legacy-dev-routes',
    hooks: {
      'astro:server:setup': ({ server }) => {
        server.middlewares.use(async (request, response, next) => {
          const pathname = new URL(request.url || '/', 'http://localhost').pathname;
          const file = routeFiles.get(pathname);
          if (!file) return next();

          const sourceHtml = await readFile(resolve(process.cwd(), file), 'utf8');
          const html = injectGoogleAnalytics(sourceHtml);

          response.statusCode = 200;
          response.setHeader('Content-Type', 'text/html; charset=utf-8');
          response.end(html);
        });
      }
    }
  };
}

export default defineConfig({
  site: 'https://www.rozinvest.com',
  output: 'static',
  trailingSlash: 'ignore',
  publicDir: './static',
  integrations: [mdx(), legacyDevRoutes()],
  build: {
    assets: '_astro'
  }
});

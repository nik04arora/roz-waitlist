# Roz Invest website

The existing homepage, About page, legal pages, assets, and `/api/waitlist` remain hand-authored static files. Astro provides a typed, static publishing layer for `/learn` without rewriting those routes.

## Local development

```sh
npm install
npm run dev
```

Local development and Vercel preview builds include draft Learn articles. Draft pages carry `noindex,nofollow` and are excluded from the generated sitemap.

The development command prepares ignored copies of the legacy pages and assets under `static/`, allowing the Astro server to preview both the existing site and `/learn` from one origin.

## Production build

```sh
npm run check
npm run build
```

The build generates Learn pages, copies the legacy site into `dist`, adds the shared Google Analytics tag to every page, creates `sitemap.xml`, and validates the output. The homepage source includes a Learn link in its footer. The Vercel serverless function stays in `api/waitlist.js`.

Use `npm run build:preview` to validate the draft article template in static output.

## Publishing a guide

1. Add a Markdown file under `src/content/learn/`.
2. Complete every required frontmatter field and cite at least one primary source.
3. Keep `status: draft` during editorial and investment review.
4. Review the Vercel preview. Draft previews are visible but not indexable.
5. Change the status to `published` only after approval and merge through a pull request.

Use Markdown for normal articles. Use MDX only when a guide needs an approved reusable component. Article metadata is validated in `src/content.config.ts`; route generation, metadata, structured data, topic pages, and sitemap inclusion are automatic.

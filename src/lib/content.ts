import type { CollectionEntry } from 'astro:content';

export function includeDrafts() {
  return Boolean(
    import.meta.env.DEV ||
    process.env.INCLUDE_DRAFTS === 'true' ||
    process.env.VERCEL_ENV === 'preview'
  );
}

export function isVisibleArticle(post: CollectionEntry<'learn'>) {
  return post.data.status === 'published' || includeDrafts();
}

export function articlePath(id: string) {
  const slug = id.replace(/\.(md|mdx)$/i, '').replace(/\/index$/i, '');
  return `/learn/${slug}/`;
}

export function topicLabel(topic: string) {
  return topic
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function sortNewestFirst(
  posts: CollectionEntry<'learn'>[]
) {
  return posts.sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf()
  );
}

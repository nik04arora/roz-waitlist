import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const authors = defineCollection({
  loader: file('src/content/authors.json'),
  schema: z.object({
    name: z.string().min(2),
    role: z.string().min(2),
    bio: z.string().min(20),
    schemaType: z.enum(['Person', 'Organization']),
    credentials: z.array(z.string()).default([]),
    profileUrl: z.url().optional()
  })
});

const learn = defineCollection({
  loader: glob({ base: './src/content/learn', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().min(10).max(90),
    description: z.string().min(50).max(170),
    summary: z.string().min(40).max(320),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    reviewBy: z.coerce.date(),
    author: reference('authors'),
    reviewer: reference('authors'),
    topics: z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).min(1),
    heroImage: z.string().startsWith('/'),
    heroImageAlt: z.string().min(10),
    sources: z.array(z.object({
      title: z.string().min(3),
      url: z.url(),
      publisher: z.string().min(2)
    })).min(1),
    relatedArticles: z.array(reference('learn')).default([]),
    status: z.enum(['draft', 'published']).default('draft'),
    featured: z.boolean().default(false),
    disclosure: z.enum(['educational', 'calculator', 'comparison']).default('educational')
  }).refine(
    (entry) => entry.updatedAt >= entry.publishedAt,
    { message: 'updatedAt must be on or after publishedAt' }
  )
});

export const collections = { authors, learn };

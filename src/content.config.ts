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
    honorificPrefix: z.string().min(2).optional(),
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
    reviewedAt: z.coerce.date().optional(),
    reviewBy: z.coerce.date().optional(),
    author: reference('authors'),
    reviewer: reference('authors').optional(),
    topics: z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).min(1),
    hero: z.object({
      type: z.literal('quote'),
      quote: z.string().min(20).max(180),
      attribution: z.string().min(2).max(60)
    }),
    socialImage: z.string().startsWith('/'),
    socialImageAlt: z.string().min(10).max(180),
    articleImages: z.array(z.string().startsWith('/')).length(3),
    sources: z.array(z.object({
      title: z.string().min(3),
      url: z.url(),
      publisher: z.string().min(2)
    })).min(1),
    cta: z.object({
      label: z.string().min(2).max(40),
      href: z.string().startsWith('/'),
      description: z.string().min(20).max(180)
    }),
    faqs: z.array(z.object({
      question: z.string().min(10).max(120),
      answer: z.string().min(30).max(500)
    })).min(2).max(8),
    relatedArticles: z.array(reference('learn')).default([]),
    status: z.enum(['draft', 'published']).default('draft'),
    featured: z.boolean().default(false),
    disclosure: z.enum(['educational', 'calculator', 'comparison']).default('educational')
  }).refine(
    (entry) => entry.updatedAt >= entry.publishedAt,
    { message: 'updatedAt must be on or after publishedAt' }
  ).refine(
    (entry) => !entry.reviewedAt || entry.reviewedAt >= entry.updatedAt,
    { message: 'reviewedAt must be on or after updatedAt' }
  ).refine(
    (entry) => Boolean(entry.reviewer) === Boolean(entry.reviewedAt),
    { message: 'reviewer and reviewedAt must be provided together' }
  ).refine(
    (entry) => !entry.reviewBy || Boolean(entry.reviewedAt),
    { message: 'reviewBy requires reviewedAt' }
  )
});

export const collections = { authors, learn };

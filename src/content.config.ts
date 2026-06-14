import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const coaches = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/coaches' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    photo: z.string(),
    photoPosition: z.string().optional(),
    order: z.number().default(0),
  }),
});

const programs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/programs' }),
  schema: z.object({
    title: z.string(),
    image: z.string(),
    ctaUrl: z.string().optional(),
    ctaText: z.string().optional(),
    order: z.number().default(0),
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gallery' }),
  schema: z.object({
    image: z.string(),
    caption: z.string().optional(),
    category: z.enum(['coach', 'event']).default('event'),
    year: z.number().default(2025),
    season: z.string().optional(),
    order: z.number().default(0),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    cover: z.string().optional(),
  }),
});

export const collections = { coaches, programs, gallery, news };

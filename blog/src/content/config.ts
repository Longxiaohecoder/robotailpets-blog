import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()),
    author: z.string(),
    draft: z.boolean().default(true),
    sources: z.array(z.string().url()).default([]),
    reviewNote: z.string().optional(),
    category: z.enum(['Cat-Friendly Homes', 'Life with Cats', 'Product Guides', '温馨家居', '相处日常', '用品选择']).optional(),
    cover: z.string().regex(/^\/images\//).optional(),
    coverAlt: z.string().optional(),
    sourceVerifiedAt: z.union([z.string(), z.date()]).transform(value =>
      typeof value === 'string' ? value : value.toISOString().slice(0, 10)
    ).optional(),
  }).superRefine((data, ctx) => {
    if (!data.draft && data.sources.length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Published articles need verified sources', path: ['sources'] });
    }
  }),
});

export const collections = { posts };

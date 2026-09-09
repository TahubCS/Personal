import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    project: z.enum(['context-compiler', 'supo', 'crowsnest']),
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = { projects };

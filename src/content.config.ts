import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const schema = z.object({
	title: z.string(),
	description: z.string(),
	category: z.enum(['GTM', 'Parenting']),
	date: z.date(),
});

const artifacts = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/artifacts' }),
	schema,
});

const entries = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/entries' }),
	schema,
});

export const collections = { artifacts, entries };

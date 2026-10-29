import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { blogSchema } from '@e-visuals-studio/core';
import { dataSource } from './data-source';

/** Vir je src/content/… ali primer/… (samo z BRIEF=primer), glej data-source.ts. */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: dataSource.blog }),
  schema: blogSchema,
});

/** Pravna besedila (zasebnost.sl.md, zasebnost.en.md); pregleda jih pravnik, generira se samo okvir iz briefa. */
const pravno = defineCollection({
  loader: glob({ pattern: '*.md', base: dataSource.pravno, generateId: ({ entry }) => entry.replace(/\.md$/, '') }),
});

export const collections = { blog, pravno };

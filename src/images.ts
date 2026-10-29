/**
 * Slike iz briefa (`slike.*`, `reference[].slika`) → ImageInput za bloke.
 * Brief vsebuje pot (src/assets/…), Astro pa potrebuje uvoženo sliko; licenco je preveril že loadBrief().
 */
import type { ImageMetadata } from 'astro';
import type { ImageInput } from '@e-visuals-studio/core';
import { t, type BriefImage } from '@e-visuals-studio/core/brief';
import type { Lang } from './i18n';

const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/**/*.{jpg,jpeg,png,webp,avif}', { eager: true });

export function image(input: BriefImage, lang: Lang): ImageInput {
  const file = files[`/${input.datoteka}`];
  if (!file) throw new Error(`Slika ${input.datoteka} iz briefa ni v src/assets/.`);
  return { src: file.default, alt: t(input.alt, lang) };
}
